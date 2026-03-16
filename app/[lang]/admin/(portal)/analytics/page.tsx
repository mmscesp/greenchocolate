import { prisma } from '@/lib/prisma';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { StatsCard } from '@/components/admin/StatsCard';
import { Users, Building2, ClipboardList, Calendar, Shield } from '@/lib/icons';
import { getDictionary } from '@/lib/dictionary';
import type { Locale } from '@/lib/i18n-config';

export const dynamic = 'force-dynamic';

interface AdminAnalyticsPageProps {
  params: Promise<{ lang: string }>;
}

export default async function AdminAnalyticsPage({ params }: AdminAnalyticsPageProps) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang as Locale);
  const t = (key: string): string => (typeof dictionary[key] === 'string' ? dictionary[key] : key);
  const now = new Date();
  const last30Days = new Date(now);
  last30Days.setDate(now.getDate() - 30);
  const next14Days = new Date(now);
  next14Days.setDate(next14Days.getDate() + 14);

  const [
    newUsers30d,
    newClubs30d,
    newRequests30d,
    upcomingEvents,
    activeSafetyPasses,
    expiringSafetyPasses,
    pendingBookings,
    requestsByStatus,
    bookingsByStatus,
    safetyPassByStatus,
  ] = await Promise.all([
    prisma.profile.count({ where: { createdAt: { gte: last30Days } } }),
    prisma.club.count({ where: { createdAt: { gte: last30Days } } }),
    prisma.membershipRequest.count({ where: { createdAt: { gte: last30Days } } }),
    prisma.event.count({ where: { startDate: { gte: now } } }),
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
    prisma.membershipRequest.groupBy({ by: ['status'], _count: { _all: true } }),
    prisma.booking.groupBy({ by: ['status'], _count: { _all: true } }),
    prisma.safetyPass.groupBy({ by: ['status'], _count: { _all: true } }),
  ]);
  type RequestByStatusRow = (typeof requestsByStatus)[number];
  type BookingByStatusRow = (typeof bookingsByStatus)[number];
  type SafetyPassByStatusRow = (typeof safetyPassByStatus)[number];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('admin.analytics.title')}</h1>
        <p className="text-muted-foreground mt-1">{t('admin.analytics.subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title={t('admin.analytics.new_users_30d')} value={newUsers30d} icon={Users} color="blue" />
        <StatsCard title={t('admin.analytics.new_clubs_30d')} value={newClubs30d} icon={Building2} color="green" />
        <StatsCard title={t('admin.analytics.new_requests_30d')} value={newRequests30d} icon={ClipboardList} color="orange" />
        <StatsCard title={t('admin.analytics.upcoming_events')} value={upcomingEvents} icon={Calendar} color="purple" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatsCard title="Active safety passes" value={activeSafetyPasses} icon={Shield} color="green" trend={`${expiringSafetyPasses} expiring soon`} />
        <StatsCard title="Pending bookings" value={pendingBookings} icon={Calendar} color="orange" trend="Operational queue still open" />
        <StatsCard title="Admin focus" value={requestsByStatus.find((row) => row.status === 'PENDING')?._count._all ?? 0} icon={ClipboardList} color="default" trend="Pending request decisions" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('admin.analytics.request_distribution_title')}</CardTitle>
            <CardDescription>{t('admin.analytics.request_distribution_subtitle')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {requestsByStatus.length === 0 ? (
              <p className="text-sm text-muted-foreground">No membership requests recorded yet.</p>
            ) : (
              requestsByStatus.map((row: RequestByStatusRow) => (
                <div key={row.status} className="flex items-center justify-between border rounded-md px-3 py-2">
                  <span className="font-medium">{row.status}</span>
                  <span className="text-muted-foreground">{row._count._all}</span>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Booking distribution</CardTitle>
            <CardDescription>Scheduled visit/event volume by operational status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {bookingsByStatus.length === 0 ? (
              <p className="text-sm text-muted-foreground">No bookings recorded yet.</p>
            ) : (
              bookingsByStatus.map((row: BookingByStatusRow) => (
                <div key={row.status} className="flex items-center justify-between border rounded-md px-3 py-2">
                  <span className="font-medium">{row.status}</span>
                  <span className="text-muted-foreground">{row._count._all}</span>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Safety pass coverage</CardTitle>
            <CardDescription>Member trust state across active and expired passes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {safetyPassByStatus.length === 0 ? (
              <p className="text-sm text-muted-foreground">No safety passes issued yet.</p>
            ) : (
              safetyPassByStatus.map((row: SafetyPassByStatusRow) => (
                <div key={row.status} className="flex items-center justify-between rounded-md border px-3 py-2">
                  <div className="flex items-center gap-2">
                    <Badge variant={row.status === 'ACTIVE' ? 'default' : 'secondary'}>{row.status}</Badge>
                  </div>
                  <span className="text-muted-foreground">{row._count._all}</span>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
