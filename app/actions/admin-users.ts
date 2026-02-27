'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getAdminSessionProfile } from '@/lib/security/admin-guard';
import { logAdminAuditEvent } from '@/lib/security/admin-audit';

const usersFilterSchema = z.object({
  query: z.string().optional(),
  role: z.enum(['ALL', 'USER', 'CLUB_ADMIN', 'ADMIN']).default('ALL'),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});

const updateRoleSchema = z.object({
  userId: z.string().min(1),
  role: z.enum(['USER', 'CLUB_ADMIN', 'ADMIN']),
});

const updateVerificationSchema = z.object({
  userId: z.string().min(1),
  isVerified: z.boolean(),
});

export type AdminUsersFilterInput = z.input<typeof usersFilterSchema>;

export async function getAdminUsers(rawInput: AdminUsersFilterInput = {}) {
  const admin = await getAdminSessionProfile();
  if (!admin) {
    return {
      users: [],
      total: 0,
      page: 1,
      pageSize: 20,
      totalPages: 0,
    };
  }

  const input = usersFilterSchema.parse(rawInput);

  const whereClause = {
    ...(input.role !== 'ALL' ? { role: input.role } : {}),
    ...(input.query
      ? {
          OR: [
            { email: { contains: input.query, mode: 'insensitive' as const } },
            { displayName: { contains: input.query, mode: 'insensitive' as const } },
          ],
        }
      : {}),
  };

  const skip = (input.page - 1) * input.pageSize;

  const [users, total] = await Promise.all([
    prisma.profile.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      skip,
      take: input.pageSize,
      select: {
        id: true,
        authId: true,
        email: true,
        displayName: true,
        avatarUrl: true,
        role: true,
        isVerified: true,
        managedClubId: true,
        lastActiveAt: true,
        createdAt: true,
        updatedAt: true,
      },
    }),
    prisma.profile.count({ where: whereClause }),
  ]);

  return {
    users,
    total,
    page: input.page,
    pageSize: input.pageSize,
    totalPages: Math.ceil(total / input.pageSize),
  };
}

export async function getAdminUserById(userId: string) {
  const admin = await getAdminSessionProfile();
  if (!admin) {
    return null;
  }

  const user = await prisma.profile.findUnique({
    where: { id: userId },
    include: {
      managedClub: {
        select: {
          id: true,
          name: true,
          slug: true,
          isVerified: true,
          isActive: true,
        },
      },
      membershipRequests: {
        take: 10,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          status: true,
          message: true,
          createdAt: true,
          club: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
      },
      reviews: {
        take: 10,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          rating: true,
          content: true,
          isPublic: true,
          createdAt: true,
          club: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
      },
      favorites: {
        take: 10,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          createdAt: true,
          club: {
            select: {
              id: true,
              name: true,
              slug: true,
              isVerified: true,
            },
          },
        },
      },
      _count: {
        select: {
          membershipRequests: true,
          reviews: true,
          favorites: true,
          notifications: true,
        },
      },
    },
  });

  if (!user) {
    return null;
  }

  await logAdminAuditEvent({
    tableName: 'Profile',
    operation: 'ADMIN_VIEW_USER',
    changedBy: admin.authId,
    recordId: user.id,
    changeData: {
      viewedBy: admin.email,
      timestamp: new Date().toISOString(),
    },
  });

  return user;
}

export async function updateUserRole(formData: FormData): Promise<void> {
  const admin = await getAdminSessionProfile();
  if (!admin) {
    return;
  }

  const parsed = updateRoleSchema.safeParse({
    userId: formData.get('userId'),
    role: formData.get('role'),
  });

  if (!parsed.success) {
    return;
  }

  if (parsed.data.userId === admin.id) {
    return;
  }

  const previous = await prisma.profile.findUnique({
    where: { id: parsed.data.userId },
    select: { role: true, email: true },
  });

  if (!previous) {
    return;
  }

  await prisma.profile.update({
    where: { id: parsed.data.userId },
    data: { role: parsed.data.role },
  });

  await logAdminAuditEvent({
    tableName: 'Profile',
    operation: 'ADMIN_UPDATE_ROLE',
    changedBy: admin.authId,
    recordId: parsed.data.userId,
    changeData: {
      targetEmail: previous.email,
      fromRole: previous.role,
      toRole: parsed.data.role,
    },
  });

  revalidatePath('/');
}

export async function updateUserVerification(formData: FormData): Promise<void> {
  const admin = await getAdminSessionProfile();
  if (!admin) {
    return;
  }

  const parsed = updateVerificationSchema.safeParse({
    userId: formData.get('userId'),
    isVerified: formData.get('isVerified') === 'true',
  });

  if (!parsed.success) {
    return;
  }

  const previous = await prisma.profile.findUnique({
    where: { id: parsed.data.userId },
    select: { isVerified: true, email: true },
  });

  if (!previous) {
    return;
  }

  await prisma.profile.update({
    where: { id: parsed.data.userId },
    data: { isVerified: parsed.data.isVerified },
  });

  await logAdminAuditEvent({
    tableName: 'Profile',
    operation: 'ADMIN_UPDATE_VERIFICATION',
    changedBy: admin.authId,
    recordId: parsed.data.userId,
    changeData: {
      targetEmail: previous.email,
      fromVerified: previous.isVerified,
      toVerified: parsed.data.isVerified,
    },
  });

  revalidatePath('/');
}
