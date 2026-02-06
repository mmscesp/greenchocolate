'use server';

// Membership Request Server Actions
// User membership requests to clubs

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';
import { EncryptionService } from '@/lib/encryption';
import { z } from 'zod';

// ==========================================
// ZOD SCHEMAS
// ==========================================

const submitRequestSchema = z.object({
  clubId: z.string().uuid(),
  message: z.string().max(500).optional(),
});

// ==========================================
// TYPES
// ==========================================

export interface MembershipRequestCard {
  id: string;
  status: string;
  message: string | null;
  createdAt: string;
  clubId: string;
  clubName: string;
  clubSlug: string;
  clubImage: string | null;
  clubNeighborhood: string;
}

export type ActionState = {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
};

// ==========================================
// HELPER FUNCTIONS
// ==========================================

async function getCurrentProfile() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  return prisma.profile.findUnique({
    where: { authId: user.id },
  });
}

// ==========================================
// ACTIONS
// ==========================================

/**
 * Submit Membership Request
 */
export async function submitMembershipRequest(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const profile = await getCurrentProfile();

  if (!profile) {
    return {
      success: false,
      message: 'You must be logged in to submit a request',
    };
  }

  const data = {
    clubId: formData.get('clubId') as string,
    message: (formData.get('message') as string) || undefined,
  };

  const validated = submitRequestSchema.safeParse(data);

  if (!validated.success) {
    return {
      success: false,
      errors: validated.error.flatten().fieldErrors,
      message: 'Please fix the errors below',
    };
  }

  try {
    // Check for existing request
    const existing = await prisma.membershipRequest.findUnique({
      where: {
        userId_clubId: {
          userId: profile.id,
          clubId: validated.data.clubId,
        },
      },
    });

    if (existing) {
      return {
        success: false,
        message: 'You have already submitted a request to this club',
      };
    }

    // Get user PII for legal snapshot
    let encryptedSnapshot = null;
    if (profile.encryptedData) {
      try {
        const pii = EncryptionService.decrypt(profile.encryptedData);
        const snapshotData = {
          ...pii,
          email: profile.email,
          timestamp: new Date().toISOString(),
        };
        encryptedSnapshot = { data: EncryptionService.encrypt(snapshotData) };
      } catch {
        // If decryption fails, skip snapshot
        console.warn('Could not create legal snapshot');
      }
    }

    await prisma.membershipRequest.create({
      data: {
        userId: profile.id,
        clubId: validated.data.clubId,
        message: validated.data.message,
        ...(encryptedSnapshot && { encryptedSnapshot }),
      },
    });

    revalidatePath('/dashboard/requests');
    revalidatePath(`/club/${data.clubId}`);

    return {
      success: true,
      message: 'Membership request submitted successfully',
    };

  } catch (error) {
    console.error('Submit request error:', error);
    return {
      success: false,
      message: 'Failed to submit request. Please try again.',
    };
  }
}

/**
 * Get User's Membership Requests
 */
export async function getUserMembershipRequests(): Promise<MembershipRequestCard[]> {
  try {
    const profile = await getCurrentProfile();

    if (!profile) {
      return [];
    }

    const requests = await prisma.membershipRequest.findMany({
      where: { userId: profile.id },
      include: {
        club: {
          select: {
            id: true,
            name: true,
            slug: true,
            images: true,
            neighborhood: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return requests.map((req: { id: string; status: string; message: string | null; createdAt: Date; club: { id: string; name: string; slug: string; images: string[]; neighborhood: string } }) => ({
      id: req.id,
      status: req.status,
      message: req.message,
      createdAt: req.createdAt.toISOString(),
      clubId: req.club.id,
      clubName: req.club.name,
      clubSlug: req.club.slug,
      clubImage: req.club.images[0] || null,
      clubNeighborhood: req.club.neighborhood,
    }));
  } catch (error) {
    console.error('getUserMembershipRequests error:', error);
    return [];
  }
}

/**
 * Cancel Membership Request
 */
export async function cancelMembershipRequest(
  requestId: string
): Promise<ActionState> {
  const profile = await getCurrentProfile();

  if (!profile) {
    return {
      success: false,
      message: 'Unauthorized',
    };
  }

  try {
    const request = await prisma.membershipRequest.findFirst({
      where: {
        id: requestId,
        userId: profile.id,
        status: 'PENDING',
      },
    });

    if (!request) {
      return {
        success: false,
        message: 'Request not found or cannot be cancelled',
      };
    }

    await prisma.membershipRequest.delete({
      where: { id: requestId },
    });

    revalidatePath('/dashboard/requests');

    return {
      success: true,
      message: 'Request cancelled successfully',
    };

  } catch (error) {
    console.error('Cancel request error:', error);
    return {
      success: false,
      message: 'Failed to cancel request',
    };
  }
}

/**
 * Get Club's Membership Requests (for Club Admin)
 */
export async function getClubMembershipRequests(clubId: string) {
  try {
    const profile = await getCurrentProfile();

    if (!profile || profile.role !== 'CLUB_ADMIN') {
      return [];
    }

    const requests = await prisma.membershipRequest.findMany({
      where: { clubId },
      include: {
        user: {
          select: {
            id: true,
            displayName: true,
            email: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: [
        { status: 'asc' }, // PENDING first
        { createdAt: 'desc' },
      ],
    });

    return requests.map((req) => ({
      id: req.id,
      status: req.status,
      message: req.message,
      createdAt: req.createdAt.toISOString(),
      user: req.user,
    }));
  } catch (error) {
    console.error('getClubMembershipRequests error:', error);
    return [];
  }
}

/**
 * Approve Membership Request (Admin)
 */
export async function approveMembershipRequest(
  requestId: string,
  notes?: string
): Promise<ActionState> {
  const profile = await getCurrentProfile();

  if (!profile) {
    return {
      success: false,
      message: 'Unauthorized',
    };
  }

  // Fetch the request first to verify club ownership
  const request = await prisma.membershipRequest.findUnique({
    where: { id: requestId },
    include: { club: true },
  });

  if (!request) {
    return {
      success: false,
      message: 'Request not found',
    };
  }

  // Authorization check: ADMIN can approve any, CLUB_ADMIN only their club
  if (profile.role === 'CLUB_ADMIN') {
    if (profile.managedClubId !== request.clubId) {
      return {
        success: false,
        message: 'You can only approve requests for your own club',
      };
    }
  }

  try {
    await prisma.membershipRequest.update({
      where: { id: requestId },
      data: {
        status: 'APPROVED',
        reviewedBy: profile.id,
        reviewedAt: new Date(),
        appointmentNotes: notes,
      },
    });

    revalidatePath('/dashboard/requests');
    revalidatePath('/club-panel/dashboard');

    return {
      success: true,
      message: 'Request approved',
    };

  } catch (error) {
    console.error('Approve request error:', error);
    return {
      success: false,
      message: 'Failed to approve request',
    };
  }
}

/**
 * Reject Membership Request (Admin)
 */
export async function rejectMembershipRequest(
  requestId: string,
  reason: string
): Promise<ActionState> {
  const profile = await getCurrentProfile();

  if (!profile) {
    return {
      success: false,
      message: 'Unauthorized',
    };
  }

  // Fetch the request first to verify club ownership
  const request = await prisma.membershipRequest.findUnique({
    where: { id: requestId },
    include: { club: true },
  });

  if (!request) {
    return {
      success: false,
      message: 'Request not found',
    };
  }

  // Authorization check: ADMIN can reject any, CLUB_ADMIN only their club
  if (profile.role === 'CLUB_ADMIN') {
    if (profile.managedClubId !== request.clubId) {
      return {
        success: false,
        message: 'You can only reject requests for your own club',
      };
    }
  }

  try {
    await prisma.membershipRequest.update({
      where: { id: requestId },
      data: {
        status: 'REJECTED',
        reviewedBy: profile.id,
        reviewedAt: new Date(),
        rejectionReason: reason,
      },
    });

    revalidatePath('/dashboard/requests');
    revalidatePath('/club-panel/dashboard');

    return {
      success: true,
      message: 'Request rejected',
    };

  } catch (error) {
    console.error('Reject request error:', error);
    return {
      success: false,
      message: 'Failed to reject request',
    };
  }
}
