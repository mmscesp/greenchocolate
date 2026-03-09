import { Prisma } from '@prisma/client';
import type { User } from '@supabase/supabase-js';
import { prisma } from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';

const sessionProfileSelect = {
  id: true,
  authId: true,
  email: true,
  role: true,
  tier: true,
  bio: true,
  avatarUrl: true,
  displayName: true,
  isVerified: true,
  hasCompletedOnboarding: true,
  lastActiveAt: true,
  createdAt: true,
  updatedAt: true,
  managedClubId: true,
  preferences: true,
  stats: true,
} as const;

export type SessionProfile = Prisma.ProfileGetPayload<{
  select: typeof sessionProfileSelect;
}>;

export type PublicSessionProfile = {
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
  lastActiveAt: string | null;
  managedClubId: string | null;
  createdAt: string;
  updatedAt: string;
  preferences: Record<string, unknown> | null;
  stats: Record<string, unknown> | null;
};

function isUniqueConstraintError(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    typeof (error as { code?: unknown }).code === 'string' &&
    (error as { code: string }).code === 'P2002'
  );
}

function normalizeEmail(email: string | undefined): string | null {
  const normalized = email?.trim().toLowerCase();
  return normalized && normalized.length > 0 ? normalized : null;
}

function getPreferredDisplayName(user: Pick<User, 'email' | 'user_metadata'>): string | null {
  const fullName = user.user_metadata?.full_name;
  if (typeof fullName === 'string' && fullName.trim().length > 0) {
    return fullName.trim();
  }

  const name = user.user_metadata?.name;
  if (typeof name === 'string' && name.trim().length > 0) {
    return name.trim();
  }

  const clubName = user.user_metadata?.club_name;
  if (typeof clubName === 'string' && clubName.trim().length > 0) {
    return clubName.trim();
  }

  const email = normalizeEmail(user.email);
  if (!email) {
    return null;
  }

  return email.split('@')[0] ?? null;
}

function buildProfileUpdateData(input: {
  profile: SessionProfile;
  user: Pick<User, 'email' | 'user_metadata'>;
  touchLastActive?: boolean;
}): Prisma.ProfileUpdateInput | null {
  const nextEmail = normalizeEmail(input.user.email);
  const nextDisplayName = getPreferredDisplayName(input.user);
  const updateData: Prisma.ProfileUpdateInput = {};

  if (nextEmail && nextEmail !== input.profile.email) {
    updateData.email = nextEmail;
  }

  if (!input.profile.displayName && nextDisplayName) {
    updateData.displayName = nextDisplayName;
  }

  if (input.touchLastActive) {
    updateData.lastActiveAt = new Date();
  }

  return Object.keys(updateData).length > 0 ? updateData : null;
}

async function readSessionProfileByAuthId(authId: string): Promise<SessionProfile | null> {
  return prisma.profile.findUnique({
    where: { authId },
    select: sessionProfileSelect,
  });
}

export async function getSessionUser(): Promise<User | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user ?? null;
}

export async function ensureProfileForUser(
  user: Pick<User, 'id' | 'email' | 'user_metadata'>,
  options: {
    touchLastActive?: boolean;
  } = {}
): Promise<SessionProfile | null> {
  const email = normalizeEmail(user.email);
  if (!email) {
    return null;
  }

  const existing = await readSessionProfileByAuthId(user.id);
  if (existing) {
    const updateData = buildProfileUpdateData({
      profile: existing,
      user,
      touchLastActive: options.touchLastActive,
    });

    if (!updateData) {
      return existing;
    }

    return prisma.profile.update({
      where: { id: existing.id },
      data: updateData,
      select: sessionProfileSelect,
    });
  }

  const displayName = getPreferredDisplayName(user);

  try {
    return await prisma.profile.create({
      data: {
        authId: user.id,
        email,
        displayName,
        hasCompletedOnboarding: Boolean(displayName),
        ...(options.touchLastActive ? { lastActiveAt: new Date() } : {}),
      },
      select: sessionProfileSelect,
    });
  } catch (error) {
    if (!isUniqueConstraintError(error)) {
      throw error;
    }

    const racedProfile = await readSessionProfileByAuthId(user.id);
    if (!racedProfile) {
      throw error;
    }

    const updateData = buildProfileUpdateData({
      profile: racedProfile,
      user,
      touchLastActive: options.touchLastActive,
    });

    if (!updateData) {
      return racedProfile;
    }

    return prisma.profile.update({
      where: { id: racedProfile.id },
      data: updateData,
      select: sessionProfileSelect,
    });
  }
}

export async function getSessionProfile(
  options: {
    ensure?: boolean;
    touchLastActive?: boolean;
  } = {}
): Promise<SessionProfile | null> {
  const user = await getSessionUser();
  if (!user) {
    return null;
  }

  if (options.ensure) {
    return ensureProfileForUser(user, {
      touchLastActive: options.touchLastActive,
    });
  }

  const profile = await readSessionProfileByAuthId(user.id);
  if (!profile) {
    return null;
  }

  if (!options.touchLastActive) {
    return profile;
  }

  return prisma.profile.update({
    where: { id: profile.id },
    data: { lastActiveAt: new Date() },
    select: sessionProfileSelect,
  });
}

export function toPublicSessionProfile(profile: SessionProfile): PublicSessionProfile {
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
    lastActiveAt: profile.lastActiveAt?.toISOString() ?? null,
    managedClubId: profile.managedClubId ?? null,
    createdAt: profile.createdAt.toISOString(),
    updatedAt: profile.updatedAt.toISOString(),
    preferences:
      profile.preferences && typeof profile.preferences === 'object' && !Array.isArray(profile.preferences)
        ? (profile.preferences as Record<string, unknown>)
        : null,
    stats:
      profile.stats && typeof profile.stats === 'object' && !Array.isArray(profile.stats)
        ? (profile.stats as Record<string, unknown>)
        : null,
  };
}
