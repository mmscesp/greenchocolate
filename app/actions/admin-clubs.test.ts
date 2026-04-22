import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockCity = {
  id: '550e8400-e29b-41d4-a716-446655440010',
  slug: 'barcelona',
  name: 'Barcelona',
};

const mockAdminSession = {
  id: '550e8400-e29b-41d4-a716-446655440011',
  authId: '550e8400-e29b-41d4-a716-446655440012',
  email: 'founder@example.com',
  displayName: 'Founder',
  avatarUrl: null,
  role: 'ADMIN' as const,
};

const txClubCreate = vi.fn();
const txClubUpdate = vi.fn();
const txProfileUpdateMany = vi.fn();

vi.mock('@/lib/prisma', () => ({
  prisma: {
    city: {
      findUnique: vi.fn(),
    },
    club: {
      findFirst: vi.fn(),
      findUnique: vi.fn(),
    },
    profile: {
      findMany: vi.fn(),
      updateMany: vi.fn(),
    },
    $transaction: vi.fn(async (callback: (tx: unknown) => unknown) =>
      callback({
        club: {
          create: txClubCreate,
          update: txClubUpdate,
        },
        profile: {
          updateMany: txProfileUpdateMany,
        },
      })
    ),
  },
}));

vi.mock('@/lib/security/admin-guard', () => ({
  getAdminSessionProfile: vi.fn(),
}));

vi.mock('@/lib/security/admin-audit', () => ({
  logAdminAuditEvent: vi.fn().mockResolvedValue(undefined),
}));

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { getAdminSessionProfile } from '@/lib/security/admin-guard';
import { logAdminAuditEvent } from '@/lib/security/admin-audit';
import {
  createAdminClub,
  updateAdminClub,
} from '@/app/actions/admin-clubs';

function buildClubFormData(overrides?: {
  clubId?: string;
  slug?: string;
  assignedAdminIds?: string[];
}) {
  const formData = new FormData();
  formData.append('returnPath', '/en/admin/clubs');
  if (overrides?.clubId) {
    formData.append('clubId', overrides.clubId);
  }
  formData.append('name', 'Club 311 Barcelona');
  formData.append('slug', overrides?.slug ?? 'club-311-barcelona');
  formData.append('cityId', mockCity.id);
  formData.append('neighborhood', 'Sant Antoni');
  formData.append('addressDisplay', 'Carrer del Parlament 1, Barcelona');
  formData.append('latitude', '41.3851');
  formData.append('longitude', '2.1734');
  formData.append('contactEmail', 'hello@club311.example');
  formData.append('phoneNumber', '+34600111222');
  formData.append('website', 'club311.example');
  formData.append('instagram', '@club311');
  formData.append('whatsapp', '+34600111222');
  formData.append('facebook', 'https://facebook.com/club311');
  formData.append('x', 'https://x.com/club311');
  formData.append('description', 'A premium Barcelona club with a strong community atmosphere and responsible membership workflow.');
  formData.append('shortDescription', 'A premium, community-led Barcelona club.');
  formData.append('priceRange', '$$');
  formData.append('capacity', '180');
  formData.append('foundedYear', '2020');
  formData.append('logoUrl', '/images/clubs/club-311/logo.webp');
  formData.append('coverImageUrl', '/images/clubs/club-311/hero.webp');
  formData.append('metaTitle', 'Club 311 Barcelona | SocialClubsMaps');
  formData.append('metaDescription', 'Trusted admin-managed club listing for Barcelona.');
  formData.append('amenitiesInput', 'Wifi\nCoffee');
  formData.append('vibeTagsInput', 'Community\nRelaxed');
  formData.append('imagesInput', '/images/clubs/club-311/gallery-1.webp');
  formData.append('mondayHours', '15:00 - 22:00');
  formData.append('tuesdayHours', '15:00 - 22:00');
  formData.append('wednesdayHours', '15:00 - 22:00');
  formData.append('thursdayHours', '15:00 - 22:00');
  formData.append('fridayHours', '15:00 - 23:00');
  formData.append('saturdayHours', '15:00 - 23:00');
  formData.append('sundayHours', 'Closed');

  formData.append('isVerified', 'false');
  formData.append('isVerified', 'true');
  formData.append('isActive', 'false');
  formData.append('isActive', 'true');
  formData.append('allowsPreRegistration', 'false');
  formData.append('allowsPreRegistration', 'true');

  for (const adminId of overrides?.assignedAdminIds ?? ['550e8400-e29b-41d4-a716-446655440013']) {
    formData.append('assignedAdminIds', adminId);
  }

  return formData;
}

describe('admin clubs actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(getAdminSessionProfile).mockResolvedValue(mockAdminSession);
    vi.mocked(prisma.city.findUnique).mockResolvedValue(mockCity);
    vi.mocked(prisma.club.findFirst).mockResolvedValue(null);
    vi.mocked(prisma.profile.findMany).mockResolvedValue([
      {
        id: '550e8400-e29b-41d4-a716-446655440013',
        email: 'ops@example.com',
        managedClubId: null,
      },
    ]);

    txClubCreate.mockResolvedValue({
      id: '550e8400-e29b-41d4-a716-446655440014',
      name: 'Club 311 Barcelona',
      slug: 'club-311-barcelona',
      city: { slug: 'barcelona' },
    });

    txClubUpdate.mockResolvedValue({
      id: '550e8400-e29b-41d4-a716-446655440014',
      name: 'Club 311 Barcelona',
      slug: 'club-311-barcelona',
      city: { slug: 'barcelona' },
    });

    txProfileUpdateMany.mockResolvedValue({ count: 1 });
  });

  it('creates a club, assigns admins, and redirects to the localized edit page', async () => {
    await createAdminClub(buildClubFormData());

    expect(txClubCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          slug: 'club-311-barcelona',
          isActive: true,
          isVerified: true,
          allowsPreRegistration: true,
          website: 'https://club311.example',
          amenities: ['Wifi', 'Coffee'],
          vibeTags: ['Community', 'Relaxed'],
        }),
      })
    );
    expect(txProfileUpdateMany).toHaveBeenCalledWith({
      where: {
        id: {
          in: ['550e8400-e29b-41d4-a716-446655440013'],
        },
      },
      data: {
        managedClubId: '550e8400-e29b-41d4-a716-446655440014',
      },
    });
    expect(logAdminAuditEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        operation: 'ADMIN_CREATE_CLUB',
        recordId: '550e8400-e29b-41d4-a716-446655440014',
      })
    );
    expect(revalidatePath).toHaveBeenCalledWith('/en/clubs');
    expect(redirect).toHaveBeenCalledWith(
      '/en/admin/clubs/550e8400-e29b-41d4-a716-446655440014/edit?status=success&message=Created+Club+311+Barcelona.'
    );
  });

  it('blocks club creation when an assigned admin already belongs to another club', async () => {
    vi.mocked(prisma.profile.findMany).mockResolvedValue([
      {
        id: '550e8400-e29b-41d4-a716-446655440013',
        email: 'ops@example.com',
        managedClubId: '550e8400-e29b-41d4-a716-446655440099',
      },
    ]);

    await createAdminClub(buildClubFormData());

    expect(txClubCreate).not.toHaveBeenCalled();
    expect(redirect).toHaveBeenCalledWith(
      '/en/admin/clubs?status=error&message=Assigned+admin+ops%40example.com+is+already+linked+to+another+club.'
    );
  });

  it('updates an existing club and rebalances operator assignments', async () => {
    vi.mocked(prisma.club.findUnique).mockResolvedValue({
      id: '550e8400-e29b-41d4-a716-446655440014',
      name: 'Club 311 Barcelona',
      slug: 'club-311-barcelona',
      city: { slug: 'barcelona' },
    });

    const formData = buildClubFormData({
      clubId: '550e8400-e29b-41d4-a716-446655440014',
      assignedAdminIds: ['550e8400-e29b-41d4-a716-446655440013'],
    });
    formData.set('returnPath', '/es/admin/clubs/550e8400-e29b-41d4-a716-446655440014/edit');

    await updateAdminClub(formData);

    expect(txClubUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: '550e8400-e29b-41d4-a716-446655440014' },
        data: expect.objectContaining({
          slug: 'club-311-barcelona',
        }),
      })
    );
    expect(txProfileUpdateMany).toHaveBeenNthCalledWith(1, {
      where: {
        managedClubId: '550e8400-e29b-41d4-a716-446655440014',
        id: {
          notIn: ['550e8400-e29b-41d4-a716-446655440013'],
        },
      },
      data: {
        managedClubId: null,
      },
    });
    expect(txProfileUpdateMany).toHaveBeenNthCalledWith(2, {
      where: {
        id: {
          in: ['550e8400-e29b-41d4-a716-446655440013'],
        },
      },
      data: {
        managedClubId: '550e8400-e29b-41d4-a716-446655440014',
      },
    });
    expect(redirect).toHaveBeenCalledWith(
      '/es/admin/clubs/550e8400-e29b-41d4-a716-446655440014/edit?status=success&message=Updated+Club+311+Barcelona.'
    );
  });
});
