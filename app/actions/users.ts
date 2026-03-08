'use server';

// User Data Access Layer
// Server Actions for user-related operations

import { prisma } from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';
import { normalizeApplicationStage } from '@/lib/application-utils';

// ==========================================
// TYPES
// ==========================================

export interface UserProfile {
  id: string;
  authId: string;
  email: string;
  displayName: string | null;
  bio: string | null;
  avatarUrl: string | null;
  role: 'USER' | 'ADMIN' | 'CLUB_ADMIN';
  tier: string;
  isVerified: boolean;
  hasCompletedOnboarding: boolean;
  lastActiveAt: Date | null;
  managedClubId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserMembershipRequest {
  id: string;
  clubId: string;
  clubName: string;
  clubSlug: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'SCHEDULED';
  message: string | null;
  appointmentDate: Date | null;
  createdAt: Date;
}

export type ProfileApplicationStatus = 'draft' | 'submitted' | 'reviewing' | 'background_check' | 'approved' | 'rejected';

export interface UserPassportStatus {
  verificationId: string;
  tier: 'standard' | 'premium' | 'elite';
  verifiedAt: Date;
  validUntil: Date;
  isActive: boolean;
}

export interface UserProfileBackendStatus {
  passport: UserPassportStatus;
  application: {
    status: ProfileApplicationStatus;
    submittedAt?: Date;
    estimatedCompletion?: Date;
  };
}

// ==========================================
// ZOD SCHEMAS
// ==========================================

const updateProfileSchema = z.object({
  displayName: z.string().min(2).max(100).optional(),
  bio: z.string().max(500).optional(),
  avatarUrl: z.string().url().optional(),
});

// ==========================================
// HELPER FUNCTIONS
// ==========================================

async function getCurrentUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

async function getUserProfile() {
  const user = await getCurrentUser();
  if (!user) return null;

  const profile = await prisma.profile.findUnique({
    where: { authId: user.id },
  });

  return profile;
}

// ==========================================
// ACTIONS
// ==========================================

/**
 * Get current user's profile
 */
export async function getCurrentUserProfile(): Promise<UserProfile | null> {
  try {
    const profile = await getUserProfile();
    
    if (!profile) {
      return null;
    }

    return {
      id: profile.id,
      authId: profile.authId,
      email: profile.email,
      displayName: profile.displayName,
      bio: profile.bio,
      avatarUrl: profile.avatarUrl,
      role: profile.role as 'USER' | 'ADMIN' | 'CLUB_ADMIN',
      tier: profile.tier,
      isVerified: profile.isVerified,
      hasCompletedOnboarding: profile.hasCompletedOnboarding,
      lastActiveAt: profile.lastActiveAt,
      managedClubId: (profile as unknown as Record<string, string | null>).managedClubId ?? null,
      createdAt: profile.createdAt,
      updatedAt: profile.updatedAt,
    };
  } catch (error) {
    console.error('getCurrentUserProfile error:', error);
    return null;
  }
}

/**
 * Get current user's membership requests
 */
export async function getUserMembershipRequests(): Promise<UserMembershipRequest[]> {
  try {
    const profile = await getUserProfile();
    
    if (!profile) {
      return [];
    }

    const requests = await prisma.membershipRequest.findMany({
      where: { userId: profile.id },
      include: {
        club: {
          select: { name: true, slug: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return requests.map((request) => ({
      id: request.id,
      clubId: request.clubId,
      clubName: request.club.name,
      clubSlug: request.club.slug,
      status: request.status as 'PENDING' | 'APPROVED' | 'REJECTED' | 'SCHEDULED',
      message: request.message,
      appointmentDate: request.appointmentDate,
      createdAt: request.createdAt,
    }));
  } catch (error) {
    console.error('getUserMembershipRequests error:', error);
    return [];
  }
}

/**
 * Update user profile
 */
export async function updateUserProfile(formData: FormData): Promise<{ success: boolean; message?: string }> {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return { success: false, message: 'Unauthorized' };
    }

    const data = {
      displayName: formData.get('displayName') as string || undefined,
      bio: formData.get('bio') as string || undefined,
      avatarUrl: formData.get('avatarUrl') as string || undefined,
    };

    const validated = updateProfileSchema.safeParse(data);
    
    if (!validated.success) {
      return { success: false, message: validated.error.errors[0].message };
    }

    await prisma.profile.update({
      where: { authId: user.id },
      data: {
        displayName: validated.data.displayName,
        bio: validated.data.bio,
        avatarUrl: validated.data.avatarUrl,
      },
    });

    return { success: true, message: 'Profile updated successfully' };
  } catch (error) {
    console.error('updateUserProfile error:', error);
    return { success: false, message: 'Failed to update profile' };
  }
}

/**
 * Cancel a membership request
 */
export async function cancelMembershipRequest(requestId: string): Promise<{ success: boolean; message?: string }> {
  try {
    const profile = await getUserProfile();
    
    if (!profile) {
      return { success: false, message: 'Unauthorized' };
    }

    const request = await prisma.membershipRequest.findUnique({
      where: { id: requestId },
    });

    if (!request || request.userId !== profile.id) {
      return { success: false, message: 'Request not found or unauthorized' };
    }

    if (request.status !== 'PENDING') {
      return { success: false, message: 'Can only cancel pending requests' };
    }

    await prisma.membershipRequest.delete({
      where: { id: requestId },
    });

    return { success: true, message: 'Request cancelled successfully' };
  } catch (error) {
    console.error('cancelMembershipRequest error:', error);
    return { success: false, message: 'Failed to cancel request' };
  }
}

/**
 * Check if user is admin
 */
export async function isAdmin(): Promise<boolean> {
  try {
    const profile = await getUserProfile();
    return profile?.role === 'ADMIN';
  } catch (error) {
    console.error('isAdmin error:', error);
    return false;
  }
}

/**
 * Check if user is club admin
 */
export async function isClubAdmin(): Promise<boolean> {
  try {
    const profile = await getUserProfile();
    return profile?.role === 'CLUB_ADMIN' || profile?.role === 'ADMIN';
  } catch (error) {
    console.error('isClubAdmin error:', error);
    return false;
  }
}

function resolveProfileStatusFromSnapshot(
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'SCHEDULED',
  currentStage?: string | null
): ProfileApplicationStatus {
  if (status === 'APPROVED') return 'approved';
  if (status === 'REJECTED') return 'rejected';
  if (status === 'SCHEDULED') return 'background_check';

  const stage = normalizeApplicationStage(currentStage, status);
  if (stage === 'INTAKE') return 'submitted';
  if (stage === 'BACKGROUND_CHECK') return 'background_check';
  return 'reviewing';
}

function mapTier(tier: string): 'standard' | 'premium' | 'elite' {
  if (tier === 'premium') return 'premium';
  if (tier === 'elite') return 'elite';
  return 'standard';
}

/**
 * Get passport + application status data used by profile dashboard widgets.
 */
export async function getProfileBackendStatus(): Promise<UserProfileBackendStatus | null> {
  try {
    const profile = await getUserProfile();

    if (!profile) {
      return null;
    }

    const latestRequest = await prisma.membershipRequest.findFirst({
      where: { userId: profile.id },
      orderBy: [{ updatedAt: 'desc' }, { createdAt: 'desc' }],
    });

    const verifiedAt = profile.createdAt;
    const validUntil = new Date(verifiedAt);
    validUntil.setFullYear(validUntil.getFullYear() + 1);

    const passport: UserPassportStatus = {
      verificationId: `SMC-2026-${profile.id.slice(0, 8).toUpperCase()}`,
      tier: mapTier(profile.tier),
      verifiedAt,
      validUntil,
      isActive: Boolean(profile.isVerified),
    };

    if (!latestRequest) {
      return {
        passport,
        application: {
          status: 'draft',
        },
      };
    }

    const requestStatus = latestRequest.status as 'PENDING' | 'APPROVED' | 'REJECTED' | 'SCHEDULED';
    const applicationStatus = resolveProfileStatusFromSnapshot(requestStatus, latestRequest.currentStage);

    let estimatedCompletion: Date | undefined;
    if (applicationStatus === 'reviewing') {
      estimatedCompletion = new Date(latestRequest.createdAt);
      estimatedCompletion.setDate(estimatedCompletion.getDate() + 10);
    } else if (applicationStatus === 'background_check') {
      estimatedCompletion = new Date(latestRequest.createdAt);
      estimatedCompletion.setDate(estimatedCompletion.getDate() + 4);
    }

    return {
      passport,
      application: {
        status: applicationStatus,
        submittedAt: latestRequest.createdAt,
        estimatedCompletion,
      },
    };
  } catch (error) {
    console.error('getProfileBackendStatus error:', error);
    return null;
  }
}
