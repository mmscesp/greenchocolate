import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}));

vi.mock('@/lib/prisma', () => ({
  prisma: {
    profile: {
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
  },
}));

import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';
import { getSessionProfile, toPublicSessionProfile } from '@/lib/session-profile';

const baseProfile = {
  id: 'profile-1',
  authId: 'auth-1',
  email: 'member@example.com',
  role: 'USER' as const,
  tier: 'novice',
  bio: null,
  avatarUrl: null,
  displayName: 'Member Example',
  isVerified: false,
  hasCompletedOnboarding: true,
  lastActiveAt: null,
  createdAt: new Date('2026-03-01T10:00:00.000Z'),
  updatedAt: new Date('2026-03-01T10:00:00.000Z'),
  managedClubId: null,
  preferences: null,
  stats: null,
};

describe('session-profile', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns null when there is no authenticated user', async () => {
    vi.mocked(createClient).mockResolvedValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }),
      },
    } as never);

    const result = await getSessionProfile({ ensure: true });

    expect(result).toBeNull();
    expect(prisma.profile.findUnique).not.toHaveBeenCalled();
  });

  it('creates a profile row when the session exists but Prisma profile does not', async () => {
    vi.mocked(createClient).mockResolvedValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: {
            user: {
              id: 'auth-1',
              email: 'member@example.com',
              user_metadata: {
                full_name: 'Member Example',
              },
            },
          },
          error: null,
        }),
      },
    } as never);

    vi.mocked(prisma.profile.findUnique).mockResolvedValue(null);
    vi.mocked(prisma.profile.create).mockResolvedValue(baseProfile);

    const result = await getSessionProfile({ ensure: true });

    expect(prisma.profile.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          authId: 'auth-1',
          email: 'member@example.com',
          displayName: 'Member Example',
        }),
      })
    );
    expect(result).toEqual(baseProfile);
  });

  it('touches lastActiveAt on an existing profile when requested', async () => {
    vi.mocked(createClient).mockResolvedValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: {
            user: {
              id: 'auth-1',
              email: 'member@example.com',
              user_metadata: {
                full_name: 'Member Example',
              },
            },
          },
          error: null,
        }),
      },
    } as never);

    vi.mocked(prisma.profile.findUnique).mockResolvedValue(baseProfile);
    vi.mocked(prisma.profile.update).mockResolvedValue({
      ...baseProfile,
      lastActiveAt: new Date('2026-03-05T12:00:00.000Z'),
    });

    const result = await getSessionProfile({ ensure: true, touchLastActive: true });

    expect(prisma.profile.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: baseProfile.id },
        data: expect.objectContaining({
          lastActiveAt: expect.any(Date),
        }),
      })
    );
    expect(result?.lastActiveAt).toBeInstanceOf(Date);
  });

  it('serializes only the public profile shape for the client', () => {
    const result = toPublicSessionProfile(baseProfile);

    expect(result).toEqual({
      id: 'profile-1',
      authId: 'auth-1',
      email: 'member@example.com',
      displayName: 'Member Example',
      bio: null,
      avatarUrl: null,
      role: 'USER',
      tier: 'novice',
      isVerified: false,
      hasCompletedOnboarding: true,
      lastActiveAt: null,
      managedClubId: null,
      createdAt: '2026-03-01T10:00:00.000Z',
      updatedAt: '2026-03-01T10:00:00.000Z',
      preferences: null,
      stats: null,
    });
  });
});
