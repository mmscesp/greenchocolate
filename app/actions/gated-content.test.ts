import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/prisma', () => ({
  prisma: {
    profile: {
      findUnique: vi.fn(),
    },
    membershipRequest: {
      findFirst: vi.fn(),
    },
    club: {
      findUnique: vi.fn(),
    },
  },
}));

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}));

import { prisma } from '@/lib/prisma';
import { getClubDetailsWithAccess } from '@/app/actions/gated-content';

describe('gated club content access', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    (prisma.profile.findUnique as any).mockResolvedValue({
      id: 'user-1',
      isVerified: true,
    });

    (prisma.club.findUnique as any).mockImplementation(({ where }: { where: { id: string } }) =>
      Promise.resolve({
        id: where.id,
        name: where.id === 'club-a' ? 'Club A' : 'Club B',
        slug: where.id,
        description: 'Private club details',
        neighborhood: 'Gracia',
        contactEmail: `${where.id}@example.com`,
        phoneNumber: '+34123456789',
      })
    );

    (prisma.membershipRequest.findFirst as any).mockImplementation(
      ({ where }: { where: { userId: string; clubId?: string; status: string } }) =>
        Promise.resolve(where.userId === 'user-1' && where.clubId === 'club-a' ? { id: 'request-a' } : null)
    );
  });

  it('only unlocks private details for the approved club', async () => {
    const approvedClub = await getClubDetailsWithAccess('club-a', 'user-1');
    const otherClub = await getClubDetailsWithAccess('club-b', 'user-1');

    expect(approvedClub.accessLevel).toBe('FULL');
    expect(approvedClub.club?.contactEmail).toBe('club-a@example.com');

    expect(otherClub.accessLevel).toBe('BASIC');
    expect(otherClub.club?.contactEmail).toBeUndefined();
    expect(otherClub.visibleFields).not.toContain('contactEmail');
  });
});
