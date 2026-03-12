import { prisma } from '@/lib/prisma';
import { AdminDashboardClient } from '../AdminDashboardClient';
import { getDictionary } from '@/lib/dictionary';
import type { Locale } from '@/lib/i18n-config';

export const dynamic = 'force-dynamic';

interface AdminPageProps {
  params: Promise<{ lang: string }>;
}

export default async function AdminPage({ params }: AdminPageProps) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang as Locale);
  const t = (key: string): string => (typeof dictionary[key] === 'string' ? dictionary[key] : key);
  const now = new Date();
  const next14Days = new Date(now);
  next14Days.setDate(next14Days.getDate() + 14);

  const [
    totalUsers,
    totalClubs,
    verifiedClubs,
    activeClubs,
    pendingVerifications,
    pendingRequests,
    publishedEvents,
    activeSafetyPasses,
    expiringSafetyPasses,
    pendingBookings,
    upcomingBookings,
    recentUsers,
    recentRequests,
    clubStats,
    userRoleDistribution,
    recentAuditEvents,
  ] = await Promise.all([
    prisma.profile.count(),
    prisma.club.count(),
    prisma.club.count({ where: { isVerified: true } }),
    prisma.club.count({ where: { isActive: true } }),
    prisma.club.count({ where: { isVerified: false } }),
    prisma.membershipRequest.count({ where: { status: 'PENDING' } }),
    prisma.event.count({ where: { isPublished: true } }),
    prisma.safetyPass.count({
      where: {
        status: 'ACTIVE',
        expiresAt: { gt: now },
      },
    }),
    prisma.safetyPass.count({
      where: {
        status: 'ACTIVE',
        expiresAt: {
          gt: now,
          lte: next14Days,
        },
      },
    }),
    prisma.booking.count({ where: { status: 'PENDING' } }),
    prisma.booking.count({
      where: {
        scheduledFor: { gte: now },
        status: { in: ['PENDING', 'CONFIRMED'] },
      },
    }),
    prisma.profile.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        displayName: true,
        role: true,
        createdAt: true,
        avatarUrl: true,
      },
    }),
    prisma.membershipRequest.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            displayName: true,
            email: true,
            avatarUrl: true,
          },
        },
        club: {
          select: {
            name: true,
            slug: true,
          },
        },
      },
    }),
    prisma.club.groupBy({
      by: ['cityId'],
      _count: true,
    }),
    prisma.profile.groupBy({
      by: ['role'],
      _count: true,
    }),
    prisma.auditLog.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        tableName: true,
        operation: true,
        changedBy: true,
        createdAt: true,
      },
    }),
  ]);

  type ClubStatRow = (typeof clubStats)[number];
  type CityRow = (typeof cities)[number];
  type UserRoleRow = (typeof userRoleDistribution)[number];

  const cityIds = clubStats.map((s: ClubStatRow) => s.cityId);
  const cities = await prisma.city.findMany({
    where: { id: { in: cityIds } },
    select: { id: true, name: true },
  });
  const auditActorIds = Array.from(new Set(recentAuditEvents.map((event) => event.changedBy)));
  const auditActors = auditActorIds.length
    ? await prisma.profile.findMany({
        where: {
          authId: {
            in: auditActorIds,
          },
        },
        select: {
          authId: true,
          email: true,
          displayName: true,
        },
      })
    : [];

  const clubStatsByCity = clubStats
    .map((stat: ClubStatRow) => ({
      cityName: cities.find((c: CityRow) => c.id === stat.cityId)?.name || t('admin.common.unknown'),
      count: stat._count,
    }))
    .sort((a: { cityName: string; count: number }, b: { cityName: string; count: number }) => b.count - a.count)
    .slice(0, 5);

  return (
    <AdminDashboardClient
      lang={lang}
      data={{
        totalUsers,
        totalClubs,
        verifiedClubs,
        activeClubs,
        pendingVerifications,
        pendingRequests,
        publishedEvents,
        activeSafetyPasses,
        expiringSafetyPasses,
        pendingBookings,
        upcomingBookings,
        recentUsers,
        recentRequests,
        clubStatsByCity,
        userRoleDistribution: userRoleDistribution.map((entry: UserRoleRow) => ({
          role: entry.role,
          count: entry._count,
        })),
        recentAuditEvents: recentAuditEvents.map((event) => {
          const actor = auditActors.find((profile) => profile.authId === event.changedBy);

          return {
            ...event,
            actorLabel: actor?.displayName || actor?.email || event.changedBy,
          };
        }),
      }}
    />
  );
}
