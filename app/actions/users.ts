'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import {
  cancelMembershipRequest as cancelCanonicalMembershipRequest,
  getUserMembershipRequests as getCanonicalUserMembershipRequests,
  type ActionState as MembershipActionState,
} from '@/app/actions/applications';
import { getSessionProfile, type SessionProfile } from '@/lib/session-profile';
import { mapRequestStatus } from '@/lib/application-utils';

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
  currentStage: 'INTAKE' | 'DOCUMENT_VERIFICATION' | 'BACKGROUND_CHECK' | 'FINAL_APPROVAL';
  message: string | null;
  createdAt: Date;
}

export type ProfileApplicationStatus =
  | 'draft'
  | 'submitted'
  | 'reviewing'
  | 'background_check'
  | 'approved'
  | 'rejected';

export interface UserPassportStatus {
  verificationId: string;
  tier: 'standard' | 'premium' | 'elite';
  verifiedAt: Date;
  validUntil: Date;
  isActive: boolean;
}

export interface UserProfileStats {
  clubsInteracted: number;
  favoritesCount: number;
  reviewsWritten: number;
  totalRequests: number;
  pendingRequests: number;
  approvedRequests: number;
  rejectedRequests: number;
  memberSinceYear: string;
}

export interface UserProfileBackendStatus {
  passport: UserPassportStatus;
  application: {
    status: ProfileApplicationStatus;
    submittedAt?: Date;
    estimatedCompletion?: Date;
  };
  stats: UserProfileStats;
}

export interface UserFavoriteClub {
  id: string;
  name: string;
  slug: string;
  neighborhood: string;
  cityName: string;
  citySlug: string;
  images: string[];
  logoUrl: string | null;
  priceRange: string;
  isVerified: boolean;
  rating: number | null;
  reviewCount: number;
  createdAt: Date;
}

export interface UserReviewItem {
  id: string;
  clubId: string;
  clubName: string;
  clubSlug: string;
  clubImage: string | null;
  clubNeighborhood: string;
  rating: number;
  content: string | null;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type UserSettings = {
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
    marketing: boolean;
    clubUpdates: boolean;
    newReviews: boolean;
    favoriteClubEvents: boolean;
  };
  privacy: {
    profileVisibility: 'public' | 'friends' | 'private';
    showEmail: boolean;
    showPhone: boolean;
    showLocation: boolean;
    allowMessages: boolean;
  };
  security: {
    twoFactor: boolean;
    loginAlerts: boolean;
    sessionTimeout: number;
  };
};

const updateProfileSchema = z.object({
  displayName: z.string().trim().min(2).max(100).optional(),
  bio: z.string().trim().max(500).nullable().optional(),
  avatarUrl: z.string().trim().url().nullable().optional(),
});

const userSettingsSchema = z.object({
  notifications: z.object({
    email: z.boolean(),
    push: z.boolean(),
    sms: z.boolean(),
    marketing: z.boolean(),
    clubUpdates: z.boolean(),
    newReviews: z.boolean(),
    favoriteClubEvents: z.boolean(),
  }),
  privacy: z.object({
    profileVisibility: z.enum(['public', 'friends', 'private']),
    showEmail: z.boolean(),
    showPhone: z.boolean(),
    showLocation: z.boolean(),
    allowMessages: z.boolean(),
  }),
  security: z.object({
    twoFactor: z.boolean(),
    loginAlerts: z.boolean(),
    sessionTimeout: z.number().int().min(0).max(1440),
  }),
});

function toUserProfile(profile: SessionProfile): UserProfile {
  return {
    id: profile.id,
    authId: profile.authId,
    email: profile.email,
    displayName: profile.displayName,
    bio: profile.bio,
    avatarUrl: profile.avatarUrl,
    role: profile.role,
    tier: profile.tier,
    isVerified: profile.isVerified,
    hasCompletedOnboarding: profile.hasCompletedOnboarding,
    lastActiveAt: profile.lastActiveAt,
    managedClubId: profile.managedClubId ?? null,
    createdAt: profile.createdAt,
    updatedAt: profile.updatedAt,
  };
}

function mapTier(tier: string): 'standard' | 'premium' | 'elite' {
  if (tier.toLowerCase() === 'elite') return 'elite';
  if (tier.toLowerCase() === 'premium') return 'premium';
  return 'standard';
}

function toProfileApplicationStatus(
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'SCHEDULED',
  currentStage?: string | null
): ProfileApplicationStatus {
  const normalized = mapRequestStatus(status, currentStage);

  if (normalized === 'APPROVED') return 'approved';
  if (normalized === 'REJECTED') return 'rejected';
  if (normalized === 'BACKGROUND_CHECK') return 'background_check';
  if (normalized === 'SUBMITTED') return 'submitted';
  if (normalized === 'UNDER_REVIEW') return 'reviewing';
  return 'draft';
}

function estimateCompletion(status: ProfileApplicationStatus, submittedAt: Date): Date | undefined {
  const estimate = new Date(submittedAt);

  if (status === 'submitted' || status === 'reviewing') {
    estimate.setDate(estimate.getDate() + 10);
    return estimate;
  }

  if (status === 'background_check') {
    estimate.setDate(estimate.getDate() + 4);
    return estimate;
  }

  return undefined;
}

function getDefaultSettings(): UserSettings {
  return {
    notifications: {
      email: true,
      push: true,
      sms: false,
      marketing: false,
      clubUpdates: true,
      newReviews: true,
      favoriteClubEvents: true,
    },
    privacy: {
      profileVisibility: 'public',
      showEmail: false,
      showPhone: false,
      showLocation: true,
      allowMessages: true,
    },
    security: {
      twoFactor: false,
      loginAlerts: true,
      sessionTimeout: 30,
    },
  };
}

async function getCurrentProfileRecord(): Promise<SessionProfile | null> {
  return getSessionProfile({ ensure: true });
}

async function buildProfileStats(profileId: string, createdAt: Date): Promise<UserProfileStats> {
  const [favorites, reviews, requests] = await Promise.all([
    prisma.favorite.findMany({
      where: { userId: profileId },
      select: { clubId: true },
    }),
    prisma.review.findMany({
      where: { userId: profileId },
      select: { clubId: true },
    }),
    prisma.membershipRequest.findMany({
      where: { userId: profileId },
      select: { clubId: true, status: true },
    }),
  ]);

  const interactedClubIds = new Set<string>();
  favorites.forEach((item) => interactedClubIds.add(item.clubId));
  reviews.forEach((item) => interactedClubIds.add(item.clubId));
  requests.forEach((item) => interactedClubIds.add(item.clubId));

  return {
    clubsInteracted: interactedClubIds.size,
    favoritesCount: favorites.length,
    reviewsWritten: reviews.length,
    totalRequests: requests.length,
    pendingRequests: requests.filter((item) => item.status === 'PENDING').length,
    approvedRequests: requests.filter((item) => item.status === 'APPROVED').length,
    rejectedRequests: requests.filter((item) => item.status === 'REJECTED').length,
    memberSinceYear: createdAt.getFullYear().toString(),
  };
}

export async function getCurrentUserProfile(): Promise<UserProfile | null> {
  try {
    const profile = await getCurrentProfileRecord();
    return profile ? toUserProfile(profile) : null;
  } catch (error) {
    console.error('getCurrentUserProfile error:', error);
    return null;
  }
}

export async function getUserMembershipRequests(): Promise<UserMembershipRequest[]> {
  try {
    const requests = await getCanonicalUserMembershipRequests();

    return requests.map((request) => ({
      id: request.id,
      clubId: request.clubId,
      clubName: request.clubName,
      clubSlug: request.clubSlug,
      status: request.status,
      currentStage: request.currentStage,
      message: request.message,
      createdAt: new Date(request.createdAt),
    }));
  } catch (error) {
    console.error('getUserMembershipRequests error:', error);
    return [];
  }
}

export async function updateUserProfile(formData: FormData): Promise<{ success: boolean; message?: string }> {
  try {
    const profile = await getCurrentProfileRecord();
    if (!profile) {
      return { success: false, message: 'Unauthorized' };
    }

    const rawDisplayName = String(formData.get('displayName') ?? '').trim();
    const rawBio = String(formData.get('bio') ?? '').trim();
    const rawAvatarUrl = String(formData.get('avatarUrl') ?? '').trim();

    const validated = updateProfileSchema.safeParse({
      displayName: rawDisplayName || undefined,
      bio: rawBio ? rawBio : null,
      avatarUrl: rawAvatarUrl ? rawAvatarUrl : null,
    });

    if (!validated.success) {
      return { success: false, message: validated.error.errors[0]?.message || 'Invalid profile data' };
    }

    await prisma.profile.update({
      where: { id: profile.id },
      data: {
        displayName: validated.data.displayName,
        bio: validated.data.bio ?? null,
        avatarUrl: validated.data.avatarUrl ?? null,
      },
    });

    revalidatePath('/profile');
    revalidatePath('/account');

    return { success: true, message: 'Profile updated successfully' };
  } catch (error) {
    console.error('updateUserProfile error:', error);
    return { success: false, message: 'Failed to update profile' };
  }
}

export async function cancelMembershipRequest(requestId: string): Promise<{ success: boolean; message?: string }> {
  try {
    const result = (await cancelCanonicalMembershipRequest(requestId)) as MembershipActionState;
    return {
      success: result.success,
      message: result.message,
    };
  } catch (error) {
    console.error('cancelMembershipRequest error:', error);
    return { success: false, message: 'Failed to cancel request' };
  }
}

export async function isAdmin(): Promise<boolean> {
  try {
    const profile = await getCurrentProfileRecord();
    return profile?.role === 'ADMIN';
  } catch (error) {
    console.error('isAdmin error:', error);
    return false;
  }
}

export async function isClubAdmin(): Promise<boolean> {
  try {
    const profile = await getCurrentProfileRecord();
    return profile?.role === 'CLUB_ADMIN' || profile?.role === 'ADMIN';
  } catch (error) {
    console.error('isClubAdmin error:', error);
    return false;
  }
}

export async function getProfileBackendStatus(): Promise<UserProfileBackendStatus | null> {
  try {
    const profile = await getCurrentProfileRecord();
    if (!profile) {
      return null;
    }

    const [latestRequest, safetyPass, stats] = await Promise.all([
      prisma.membershipRequest.findFirst({
        where: { userId: profile.id },
        orderBy: [{ updatedAt: 'desc' }, { createdAt: 'desc' }],
      }),
      prisma.safetyPass.findUnique({
        where: { userId: profile.id },
        select: {
          passNumber: true,
          tier: true,
          status: true,
          issuedAt: true,
          expiresAt: true,
        },
      }),
      buildProfileStats(profile.id, profile.createdAt),
    ]);

    const passport: UserPassportStatus = safetyPass
      ? {
          verificationId: safetyPass.passNumber,
          tier: mapTier(safetyPass.tier),
          verifiedAt: safetyPass.issuedAt,
          validUntil: safetyPass.expiresAt,
          isActive: safetyPass.status === 'ACTIVE' && safetyPass.expiresAt > new Date(),
        }
      : {
          verificationId: `SCM-${profile.id.slice(0, 8).toUpperCase()}`,
          tier: mapTier(profile.tier),
          verifiedAt: profile.createdAt,
          validUntil: new Date(profile.createdAt.getFullYear() + 1, profile.createdAt.getMonth(), profile.createdAt.getDate()),
          isActive: Boolean(profile.isVerified),
        };

    if (!latestRequest) {
      return {
        passport,
        application: {
          status: 'draft',
        },
        stats,
      };
    }

    const requestStatus = latestRequest.status as 'PENDING' | 'APPROVED' | 'REJECTED' | 'SCHEDULED';
    const applicationStatus = toProfileApplicationStatus(requestStatus, latestRequest.currentStage);

    return {
      passport,
      application: {
        status: applicationStatus,
        submittedAt: latestRequest.createdAt,
        estimatedCompletion: estimateCompletion(applicationStatus, latestRequest.createdAt),
      },
      stats,
    };
  } catch (error) {
    console.error('getProfileBackendStatus error:', error);
    return null;
  }
}

export async function getCurrentUserFavorites(): Promise<UserFavoriteClub[]> {
  try {
    const profile = await getCurrentProfileRecord();
    if (!profile) {
      return [];
    }

    const favorites = await prisma.favorite.findMany({
      where: { userId: profile.id },
      orderBy: { createdAt: 'desc' },
      include: {
        club: {
          include: {
            city: {
              select: {
                name: true,
                slug: true,
              },
            },
            reviews: {
              where: { isPublic: true },
              select: { rating: true },
            },
          },
        },
      },
    });

    return favorites.map((favorite) => {
      const ratings = favorite.club.reviews.map((review) => review.rating);
      const rating =
        ratings.length > 0
          ? Math.round((ratings.reduce((sum, value) => sum + value, 0) / ratings.length) * 10) / 10
          : null;

      return {
        id: favorite.club.id,
        name: favorite.club.name,
        slug: favorite.club.slug,
        neighborhood: favorite.club.neighborhood,
        cityName: favorite.club.city.name,
        citySlug: favorite.club.city.slug,
        images: favorite.club.images,
        logoUrl: favorite.club.logoUrl,
        priceRange: favorite.club.priceRange,
        isVerified: favorite.club.isVerified,
        rating,
        reviewCount: ratings.length,
        createdAt: favorite.createdAt,
      };
    });
  } catch (error) {
    console.error('getCurrentUserFavorites error:', error);
    return [];
  }
}

export async function removeCurrentUserFavorite(clubId: string): Promise<{ success: boolean; message?: string }> {
  try {
    const profile = await getCurrentProfileRecord();
    if (!profile) {
      return { success: false, message: 'Unauthorized' };
    }

    await prisma.favorite.delete({
      where: {
        userId_clubId: {
          userId: profile.id,
          clubId,
        },
      },
    });

    revalidatePath('/profile/favorites');

    return { success: true };
  } catch (error) {
    console.error('removeCurrentUserFavorite error:', error);
    return { success: false, message: 'Failed to remove favorite' };
  }
}

export async function getCurrentUserReviews(): Promise<UserReviewItem[]> {
  try {
    const profile = await getCurrentProfileRecord();
    if (!profile) {
      return [];
    }

    const reviews = await prisma.review.findMany({
      where: { userId: profile.id },
      orderBy: { createdAt: 'desc' },
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
    });

    return reviews.map((review) => ({
      id: review.id,
      clubId: review.club.id,
      clubName: review.club.name,
      clubSlug: review.club.slug,
      clubImage: review.club.images[0] || null,
      clubNeighborhood: review.club.neighborhood,
      rating: review.rating,
      content: review.content,
      isPublic: review.isPublic,
      createdAt: review.createdAt,
      updatedAt: review.updatedAt,
    }));
  } catch (error) {
    console.error('getCurrentUserReviews error:', error);
    return [];
  }
}

export async function deleteCurrentUserReview(reviewId: string): Promise<{ success: boolean; message?: string }> {
  try {
    const profile = await getCurrentProfileRecord();
    if (!profile) {
      return { success: false, message: 'Unauthorized' };
    }

    const deleted = await prisma.review.deleteMany({
      where: {
        id: reviewId,
        userId: profile.id,
      },
    });

    if (deleted.count === 0) {
      return { success: false, message: 'Review not found' };
    }

    revalidatePath('/profile/reviews');

    return { success: true };
  } catch (error) {
    console.error('deleteCurrentUserReview error:', error);
    return { success: false, message: 'Failed to delete review' };
  }
}

export async function getCurrentUserSettings(): Promise<UserSettings | null> {
  try {
    const profile = await getCurrentProfileRecord();
    if (!profile) {
      return null;
    }

    const defaults = getDefaultSettings();
    const parsedPreferences = userSettingsSchema.safeParse(profile.preferences);

    if (!parsedPreferences.success) {
      return defaults;
    }

    return {
      notifications: {
        ...defaults.notifications,
        ...parsedPreferences.data.notifications,
      },
      privacy: {
        ...defaults.privacy,
        ...parsedPreferences.data.privacy,
      },
      security: {
        ...defaults.security,
        ...parsedPreferences.data.security,
      },
    };
  } catch (error) {
    console.error('getCurrentUserSettings error:', error);
    return null;
  }
}

export async function updateCurrentUserSettings(
  settings: UserSettings
): Promise<{ success: boolean; message?: string }> {
  try {
    const profile = await getCurrentProfileRecord();
    if (!profile) {
      return { success: false, message: 'Unauthorized' };
    }

    const validated = userSettingsSchema.safeParse(settings);
    if (!validated.success) {
      return { success: false, message: validated.error.errors[0]?.message || 'Invalid settings' };
    }

    await prisma.profile.update({
      where: { id: profile.id },
      data: {
        preferences: validated.data,
      },
    });

    revalidatePath('/profile/settings');

    return { success: true, message: 'Settings updated successfully' };
  } catch (error) {
    console.error('updateCurrentUserSettings error:', error);
    return { success: false, message: 'Failed to update settings' };
  }
}
