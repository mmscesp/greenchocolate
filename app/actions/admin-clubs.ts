'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getAdminSessionProfile } from '@/lib/security/admin-guard';
import { logAdminAuditEvent } from '@/lib/security/admin-audit';

const clubsFilterSchema = z.object({
  query: z.string().optional(),
  verification: z.enum(['ALL', 'VERIFIED', 'PENDING']).default('ALL'),
  activity: z.enum(['ALL', 'ACTIVE', 'INACTIVE']).default('ALL'),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});

const updateClubFlagsSchema = z.object({
  clubId: z.string().uuid(),
  isVerified: z.boolean().optional(),
  isActive: z.boolean().optional(),
});

export type AdminClubsFilterInput = z.input<typeof clubsFilterSchema>;

export async function getAdminClubs(rawInput: AdminClubsFilterInput = {}) {
  const admin = await getAdminSessionProfile();
  if (!admin) {
    return {
      clubs: [],
      total: 0,
      page: 1,
      pageSize: 20,
      totalPages: 0,
    };
  }

  const parsedInput = clubsFilterSchema.safeParse(rawInput);
  const input = parsedInput.success
    ? parsedInput.data
    : clubsFilterSchema.parse({});
  const skip = (input.page - 1) * input.pageSize;

  const whereClause = {
    ...(input.query
      ? {
          OR: [
            { name: { contains: input.query, mode: 'insensitive' as const } },
            { slug: { contains: input.query, mode: 'insensitive' as const } },
            { contactEmail: { contains: input.query, mode: 'insensitive' as const } },
          ],
        }
      : {}),
    ...(input.verification === 'VERIFIED'
      ? { isVerified: true }
      : input.verification === 'PENDING'
        ? { isVerified: false }
        : {}),
    ...(input.activity === 'ACTIVE'
      ? { isActive: true }
      : input.activity === 'INACTIVE'
        ? { isActive: false }
        : {}),
  };

  const [clubs, total] = await Promise.all([
    prisma.club.findMany({
      where: whereClause,
      include: {
        city: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        admins: {
          select: {
            id: true,
            email: true,
            displayName: true,
          },
        },
        _count: {
          select: {
            membershipRequests: true,
            reviews: true,
            events: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: input.pageSize,
    }),
    prisma.club.count({ where: whereClause }),
  ]);

  return {
    clubs,
    total,
    page: input.page,
    pageSize: input.pageSize,
    totalPages: Math.ceil(total / input.pageSize),
  };
}

export async function getPendingClubVerifications() {
  const admin = await getAdminSessionProfile();
  if (!admin) {
    return [];
  }

  return prisma.club.findMany({
    where: { isVerified: false },
    include: {
      city: { select: { name: true, slug: true } },
      admins: {
        select: {
          id: true,
          email: true,
          displayName: true,
          createdAt: true,
        },
      },
      _count: {
        select: {
          membershipRequests: true,
          reviews: true,
        },
      },
    },
    orderBy: { createdAt: 'asc' },
  });
}

export async function getAdminClubById(clubId: string) {
  const admin = await getAdminSessionProfile();
  if (!admin) {
    return null;
  }

  const club = await prisma.club.findUnique({
    where: { id: clubId },
    include: {
      city: true,
      admins: {
        select: {
          id: true,
          email: true,
          displayName: true,
          role: true,
          isVerified: true,
          createdAt: true,
          lastActiveAt: true,
        },
      },
      membershipRequests: {
        take: 10,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          status: true,
          createdAt: true,
          user: {
            select: {
              id: true,
              email: true,
              displayName: true,
            },
          },
        },
      },
      events: {
        take: 10,
        orderBy: { startDate: 'desc' },
        select: {
          id: true,
          name: true,
          slug: true,
          startDate: true,
          endDate: true,
          isPublished: true,
        },
      },
      _count: {
        select: {
          membershipRequests: true,
          reviews: true,
          favorites: true,
          events: true,
          articles: true,
        },
      },
    },
  });

  if (!club) {
    return null;
  }

  await logAdminAuditEvent({
    tableName: 'Club',
    operation: 'ADMIN_VIEW_CLUB',
    changedBy: admin.authId,
    recordId: club.id,
    changeData: {
      viewedBy: admin.email,
      timestamp: new Date().toISOString(),
    },
  });

  return club;
}

export async function updateClubFlags(formData: FormData): Promise<void> {
  const admin = await getAdminSessionProfile();
  if (!admin) {
    return;
  }

  const rawIsVerified = formData.get('isVerified');
  const rawIsActive = formData.get('isActive');

  const parsed = updateClubFlagsSchema.safeParse({
    clubId: formData.get('clubId'),
    isVerified: rawIsVerified === null ? undefined : rawIsVerified === 'true',
    isActive: rawIsActive === null ? undefined : rawIsActive === 'true',
  });

  if (!parsed.success) {
    return;
  }

  if (parsed.data.isVerified === undefined && parsed.data.isActive === undefined) {
    return;
  }

  const previous = await prisma.club.findUnique({
    where: { id: parsed.data.clubId },
    select: {
      id: true,
      name: true,
      isVerified: true,
      isActive: true,
    },
  });

  if (!previous) {
    return;
  }

  const updated = await prisma.club.update({
    where: { id: parsed.data.clubId },
    data: {
      ...(parsed.data.isVerified !== undefined ? { isVerified: parsed.data.isVerified } : {}),
      ...(parsed.data.isActive !== undefined ? { isActive: parsed.data.isActive } : {}),
    },
    select: {
      isVerified: true,
      isActive: true,
    },
  });

  await logAdminAuditEvent({
    tableName: 'Club',
    operation: 'ADMIN_UPDATE_CLUB_FLAGS',
    changedBy: admin.authId,
    recordId: previous.id,
    changeData: {
      clubName: previous.name,
      from: {
        isVerified: previous.isVerified,
        isActive: previous.isActive,
      },
      to: {
        isVerified: updated.isVerified,
        isActive: updated.isActive,
      },
    },
  });

  revalidatePath('/');
}
