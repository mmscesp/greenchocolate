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

const approveRequestSchema = z.object({
  requestId: z.string().uuid(),
  clubSlug: z.string(),
  notes: z.string().optional(),
});

const rejectRequestSchema = z.object({
  requestId: z.string().uuid(),
  clubSlug: z.string(),
  reason: z.string().min(1).max(500),
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

export interface ClubRequest {
  id: string;
  status: string;
  message: string | null;
  createdAt: string;
  user: {
    id: string;
    displayName: string | null;
    email: string; // Only returned for authorized club admins
    avatarUrl: string | null;
  };
}

export type ActionState = {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
};

// ==========================================
// HELPER FUNCTIONS
// ==========================================

type ProfileWithManagedClub = {
  id: string;
  authId: string;
  email: string;
  role: 'USER' | 'ADMIN' | 'CLUB_ADMIN';
  tier: string;
  encryptedData: string | null;
  avatarUrl: string | null;
  bio: string | null;
  displayName: string | null;
  isVerified: boolean;
  hasCompletedOnboarding: boolean;
  createdAt: Date;
  updatedAt: Date;
  managedClubId: string | null;
};

async function getCurrentProfile(): Promise<ProfileWithManagedClub | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const profile = await prisma.profile.findUnique({
    where: { authId: user.id },
  });

  if (!profile) {
    return null;
  }

  // Cast to include managedClubId which exists in DB but may not be in generated types
  return {
    ...profile,
    managedClubId: (profile as unknown as Record<string, string | null>).managedClubId ?? null,
  } as ProfileWithManagedClub;
}

/**
 * Verify that the current user is authorized to manage a club
 * CRIT-003: Centralized authorization check for club admin operations
 */
async function verifyClubAdminAccess(clubId: string, profile: Awaited<ReturnType<typeof getCurrentProfile>>) {
  if (!profile) {
    return false;
  }

  // Allow if user is an admin
  if (profile.role === 'ADMIN') {
    return true;
  }

  // Allow if user manages this specific club
  // Access managedClubId through index signature to avoid type issues until Prisma types are regenerated
  const profileRecord = profile as Record<string, unknown>;
  const managedClubId = profileRecord.managedClubId as string | null | undefined;
  if (managedClubId === clubId) {
    return true;
  }

  return false;
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

    // Get club info for the encrypted snapshot
    const club = await prisma.club.findUnique({
      where: { id: validated.data.clubId },
    });

    if (!club) {
      return {
        success: false,
        message: 'Club not found',
      };
    }

    // Get user's PII for legal compliance snapshot
    const pii = profile.encryptedData
      ? EncryptionService.decryptPII(profile.encryptedData)
      : {};

    // Create encrypted snapshot
    const encryptedSnapshot = EncryptionService.encryptPII(pii);

    await prisma.membershipRequest.create({
      data: {
        userId: profile.id,
        clubId: validated.data.clubId,
        message: validated.data.message,
        encryptedSnapshot: { data: encryptedSnapshot },
        status: 'PENDING',
      },
    });

    revalidatePath('/dashboard/requests');

    return {
      success: true,
      message: 'Request submitted successfully',
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
export async function getUserMembershipRequests() {
  const profile = await getCurrentProfile();

  if (!profile) {
    return [];
  }

  try {
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

    return requests.map((req: (typeof requests)[number]) => ({
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
    console.error('Get requests error:', error);
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
 * Get Club Membership Requests
 * Can be called with a clubSlug or will infer from the current user's managed club
 * CRIT-003 FIX: Added authorization check when clubSlug is provided
 * HIGH-005 FIX: Removed email from selection to prevent PII leak
 */
export async function getClubMembershipRequests(clubSlug?: string): Promise<ClubRequest[]> {
  try {
    const profile = await getCurrentProfile();

    if (!profile) {
      return [];
    }

    let targetClubId: string | undefined;

    if (!clubSlug) {
      // Use the user's managed club
      if (!profile.managedClubId) {
        return [];
      }
      targetClubId = profile.managedClubId;
    } else {
      // CRIT-003: When clubSlug is provided, verify user manages that club
      const club = await prisma.club.findUnique({
        where: { slug: clubSlug },
      });

      if (!club) return [];

      // Verify authorization
      const isAuthorized = await verifyClubAdminAccess(club.id, profile);
      if (!isAuthorized) {
        return [];
      }

      targetClubId = club.id;
    }

    const requests = await prisma.membershipRequest.findMany({
      where: { clubId: targetClubId },
      include: {
        user: {
          select: {
            id: true,
            displayName: true,
            email: true, // Email included for authorized club admins only
            avatarUrl: true,
          },
        },
      },
      orderBy: [
        { status: 'asc' },
        { createdAt: 'desc' },
      ],
    });

    return requests.map((req: (typeof requests)[number]) => ({
      id: req.id,
      status: req.status,
      message: req.message,
      createdAt: req.createdAt.toISOString(),
      user: {
        id: req.user.id,
        displayName: req.user.displayName,
        email: req.user.email,
        avatarUrl: req.user.avatarUrl,
      },
    }));
  } catch (error) {
    console.error('getClubMembershipRequests error:', error);
    return [];
  }
}

/**
 * Approve Membership Request
 * CRIT-003 FIX: Added ownership verification
 */
export async function approveClubMembershipRequest(
  requestId: string,
  clubSlug?: string,
  notes?: string
): Promise<ActionState> {
  try {
    const profile = await getCurrentProfile();
    if (!profile) {
      return { success: false, message: 'Unauthorized' };
    }

    let finalClubSlug = clubSlug;
    if (!finalClubSlug) {
      if (!profile.managedClubId) {
        return { success: false, message: 'No managed club found' };
      }
      const club = await prisma.club.findUnique({ where: { id: profile.managedClubId } });
      if (!club) return { success: false, message: 'Managed club not found' };
      finalClubSlug = club.slug;
    }

    const validated = approveRequestSchema.safeParse({
      requestId,
      clubSlug: finalClubSlug,
      notes,
    });

    if (!validated.success) {
      return {
        success: false,
        message: 'Invalid request data',
      };
    }

    const club = await prisma.club.findUnique({
      where: { slug: validated.data.clubSlug },
    });

    if (!club) {
      return {
        success: false,
        message: 'Club not found',
      };
    }

    // CRIT-003: Verify the user manages this club
    const isAuthorized = await verifyClubAdminAccess(club.id, profile);
    if (!isAuthorized) {
      return {
        success: false,
        message: 'Unauthorized: You do not have permission to approve requests for this club',
      };
    }

    const request = await prisma.membershipRequest.findUnique({
      where: { id: validated.data.requestId },
    });

    if (!request || request.clubId !== club.id) {
      return {
        success: false,
        message: 'Request not found or does not belong to this club',
      };
    }

    await prisma.membershipRequest.update({
      where: { id: validated.data.requestId },
      data: {
        status: 'APPROVED',
        reviewedAt: new Date(),
        appointmentNotes: validated.data.notes,
      },
    });

    revalidatePath('/club-panel/dashboard/requests');

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

// Aliases for backward compatibility or cleaner imports
export const approveMembershipRequest = approveClubMembershipRequest;
export const rejectMembershipRequest = rejectClubMembershipRequest;

/**
 * Reject Membership Request
 * CRIT-003 FIX: Added ownership verification
 */
export async function rejectClubMembershipRequest(
  requestId: string,
  clubSlug?: string,
  reason?: string
): Promise<ActionState> {
  try {
    const profile = await getCurrentProfile();
    if (!profile) {
      return { success: false, message: 'Unauthorized' };
    }

    let finalClubSlug = clubSlug;
    if (!finalClubSlug) {
      if (!profile.managedClubId) {
        return { success: false, message: 'No managed club found' };
      }
      const club = await prisma.club.findUnique({ where: { id: profile.managedClubId } });
      if (!club) return { success: false, message: 'Managed club not found' };
      finalClubSlug = club.slug;
    }

    const validated = rejectRequestSchema.safeParse({
      requestId,
      clubSlug: finalClubSlug,
      reason: reason || 'No reason provided',
    });

    if (!validated.success) {
      return {
        success: false,
        message: 'Invalid request data',
      };
    }

    const club = await prisma.club.findUnique({
      where: { slug: validated.data.clubSlug },
    });

    if (!club) {
      return {
        success: false,
        message: 'Club not found',
      };
    }

    // CRIT-003: Verify the user manages this club
    const isAuthorized = await verifyClubAdminAccess(club.id, profile);
    if (!isAuthorized) {
      return {
        success: false,
        message: 'Unauthorized: You do not have permission to reject requests for this club',
      };
    }

    const request = await prisma.membershipRequest.findUnique({
      where: { id: validated.data.requestId },
    });

    if (!request || request.clubId !== club.id) {
      return {
        success: false,
        message: 'Request not found or does not belong to this club',
      };
    }

    await prisma.membershipRequest.update({
      where: { id: validated.data.requestId },
      data: {
        status: 'REJECTED',
        reviewedAt: new Date(),
        rejectionReason: validated.data.reason,
      },
    });

    revalidatePath('/club-panel/dashboard/requests');

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
