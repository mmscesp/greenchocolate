'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getAdminSessionProfile } from '@/lib/security/admin-guard';
import { logAdminAuditEvent } from '@/lib/security/admin-audit';
import {
  getSafeAdminReturnPath,
  revalidateAdminPortalPaths,
  withAdminActionStatus,
} from '@/lib/security/admin-portal';

const usersFilterSchema = z.object({
  query: z.string().optional(),
  role: z.enum(['ALL', 'USER', 'CLUB_ADMIN', 'ADMIN']).default('ALL'),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});

const updateRoleSchema = z.object({
  userId: z.string().min(1),
  role: z.enum(['USER', 'ADMIN']),
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
      summary: {
        admins: 0,
        clubAdmins: 0,
        members: 0,
        verified: 0,
        activeLast30Days: 0,
      },
    };
  }

  const parsedInput = usersFilterSchema.safeParse(rawInput);
  const input = parsedInput.success
    ? parsedInput.data
    : usersFilterSchema.parse({});

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
  const activeCutoff = new Date();
  activeCutoff.setDate(activeCutoff.getDate() - 30);

  const [users, total, roleDistribution, verifiedTotal, activeLast30Days] = await Promise.all([
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
    prisma.profile.groupBy({
      by: ['role'],
      _count: {
        _all: true,
      },
    }),
    prisma.profile.count({
      where: {
        isVerified: true,
      },
    }),
    prisma.profile.count({
      where: {
        lastActiveAt: {
          gte: activeCutoff,
        },
      },
    }),
  ]);

  const admins = roleDistribution.find((entry) => entry.role === 'ADMIN')?._count._all ?? 0;
  const clubAdmins =
    roleDistribution.find((entry) => entry.role === 'CLUB_ADMIN')?._count._all ?? 0;
  const members = roleDistribution.find((entry) => entry.role === 'USER')?._count._all ?? 0;

  return {
    users,
    total,
    page: input.page,
    pageSize: input.pageSize,
    totalPages: Math.ceil(total / input.pageSize),
    summary: {
      admins,
      clubAdmins,
      members,
      verified: verifiedTotal,
      activeLast30Days,
    },
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
      safetyPass: {
        select: {
          passNumber: true,
          tier: true,
          status: true,
          issuedAt: true,
          expiresAt: true,
          renewedAt: true,
          revokedAt: true,
        },
      },
      bookings: {
        take: 10,
        orderBy: { scheduledFor: 'desc' },
        select: {
          id: true,
          type: true,
          status: true,
          scheduledFor: true,
          guestCount: true,
          createdAt: true,
          club: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          event: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
      communicationEvents: {
        take: 15,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          type: true,
          audience: true,
          provider: true,
          status: true,
          recipientEmail: true,
          subject: true,
          errorMessage: true,
          sentAt: true,
          createdAt: true,
          relatedRequestId: true,
          emailOutbox: {
            select: {
              id: true,
              status: true,
              route: true,
              attempts: true,
              maxAttempts: true,
              lastError: true,
              availableAt: true,
            },
          },
        },
      },
      emailSubscriptions: {
        take: 5,
        orderBy: { updatedAt: 'desc' },
        select: {
          id: true,
          email: true,
          status: true,
          locale: true,
          source: true,
          provider: true,
          marketingConsentAt: true,
          unsubscribedAt: true,
          lastMarketingEmailAt: true,
          lastTransactionalEmailAt: true,
          updatedAt: true,
        },
      },
      _count: {
        select: {
          membershipRequests: true,
          reviews: true,
          favorites: true,
          notifications: true,
          bookings: true,
          communicationEvents: true,
          emailSubscriptions: true,
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
  const returnPath = getSafeAdminReturnPath(formData.get('returnPath'), '/en/admin/users');
  if (!admin) {
    redirect(withAdminActionStatus(returnPath, 'error', 'Admin session is required.'));
    return;
  }

  const parsed = updateRoleSchema.safeParse({
    userId: formData.get('userId'),
    role: formData.get('role'),
  });

  if (!parsed.success) {
    redirect(withAdminActionStatus(returnPath, 'error', 'Invalid role update request.'));
    return;
  }

  if (parsed.data.userId === admin.id) {
    redirect(
      withAdminActionStatus(
        returnPath,
        'error',
        'Your own platform-admin role cannot be edited from this screen.'
      )
    );
    return;
  }

  const previous = await prisma.profile.findUnique({
    where: { id: parsed.data.userId },
    select: { role: true, email: true },
  });

  if (!previous) {
    redirect(withAdminActionStatus(returnPath, 'error', 'User record was not found.'));
    return;
  }

  if (previous.role === parsed.data.role) {
    redirect(withAdminActionStatus(returnPath, 'success', 'Role already matched the selected value.'));
    return;
  }

  if (previous.role === 'ADMIN' && parsed.data.role !== 'ADMIN') {
    const adminCount = await prisma.profile.count({
      where: { role: 'ADMIN' },
    });

    if (adminCount <= 1) {
      redirect(withAdminActionStatus(returnPath, 'error', 'The final remaining platform admin cannot be demoted.'));
      return;
    }
  }

  await prisma.$transaction(async (tx) => {
    await tx.$queryRaw`SELECT set_config('app.allow_role_change', 'on', true)`;

    await tx.profile.update({
      where: { id: parsed.data.userId },
      data: { role: parsed.data.role },
    });
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
  revalidateAdminPortalPaths(['/users', `/users/${parsed.data.userId}`, '']);
  redirect(withAdminActionStatus(returnPath, 'success', `Role updated for ${previous.email}.`));
}

export async function updateUserVerification(formData: FormData): Promise<void> {
  const admin = await getAdminSessionProfile();
  const returnPath = getSafeAdminReturnPath(formData.get('returnPath'), '/en/admin/users');
  if (!admin) {
    redirect(withAdminActionStatus(returnPath, 'error', 'Admin session is required.'));
    return;
  }

  const parsed = updateVerificationSchema.safeParse({
    userId: formData.get('userId'),
    isVerified: formData.get('isVerified') === 'true',
  });

  if (!parsed.success) {
    redirect(withAdminActionStatus(returnPath, 'error', 'Invalid verification update request.'));
    return;
  }

  const previous = await prisma.profile.findUnique({
    where: { id: parsed.data.userId },
    select: { isVerified: true, email: true },
  });

  if (!previous) {
    redirect(withAdminActionStatus(returnPath, 'error', 'User record was not found.'));
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
  revalidateAdminPortalPaths(['/users', `/users/${parsed.data.userId}`, '']);
  redirect(
    withAdminActionStatus(
      returnPath,
      'success',
      parsed.data.isVerified
        ? `Marked ${previous.email} as verified.`
        : `Marked ${previous.email} as unverified.`
    )
  );
}
