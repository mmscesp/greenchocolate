import { prisma } from '@/lib/prisma';
import { AdminDashboardClient } from '../AdminDashboardClient';

export const dynamic = 'force-dynamic';

interface AdminPageProps {
  params: Promise<{ lang: string }>;
}

export default async function AdminPage({ params }: AdminPageProps) {
  const { lang } = await params;

  const [
    totalUsers,
    totalClubs,
    pendingVerifications,
    pendingRequests,
    recentUsers,
    recentRequests,
    clubStats,
    userRoleDistribution,
  ] = await Promise.all([
    prisma.profile.count(),
    prisma.club.count(),
    prisma.club.count({ where: { isVerified: false } }),
    prisma.membershipRequest.count({ where: { status: 'PENDING' } }),
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
  ]);

  const cityIds = clubStats.map((s) => s.cityId);
  const cities = await prisma.city.findMany({
    where: { id: { in: cityIds } },
    select: { id: true, name: true },
  });

  const clubStatsByCity = clubStats
    .map((stat) => ({
      cityName: cities.find((c) => c.id === stat.cityId)?.name || 'Unknown',
      count: stat._count,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return (
    <AdminDashboardClient
      lang={lang}
      data={{
        totalUsers,
        totalClubs,
        pendingVerifications,
        pendingRequests,
        recentUsers,
        recentRequests,
        clubStatsByCity,
        userRoleDistribution: userRoleDistribution.map((entry) => ({
          role: entry.role,
          count: entry._count,
        })),
      }}
    />
  );
}
