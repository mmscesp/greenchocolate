import { prisma } from '@/lib/prisma';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { StatsCard } from '@/components/admin/StatsCard';
import { Users, Building2, ClipboardList, Calendar } from '@/lib/icons';
import { getDictionary } from '@/lib/dictionary';
import type { Locale } from '@/lib/i18n-config';

export const dynamic = 'force-dynamic';

interface AdminAnalyticsPageProps {
  params: Promise<{ lang: string }>;
}

export default async function AdminAnalyticsPage({ params }: AdminAnalyticsPageProps) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang as Locale);
  const t = (key: string) => dictionary[key] || key;
  const now = new Date();
  const last30Days = new Date(now);
  last30Days.setDate(now.getDate() - 30);

  const [newUsers30d, newClubs30d, newRequests30d, upcomingEvents, requestsByStatus] = await Promise.all([
    prisma.profile.count({ where: { createdAt: { gte: last30Days } } }),
    prisma.club.count({ where: { createdAt: { gte: last30Days } } }),
    prisma.membershipRequest.count({ where: { createdAt: { gte: last30Days } } }),
    prisma.event.count({ where: { startDate: { gte: now } } }),
    prisma.membershipRequest.groupBy({ by: ['status'], _count: { _all: true } }),
  ]);
  type RequestByStatusRow = (typeof requestsByStatus)[number];

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

      <Card>
        <CardHeader>
          <CardTitle>{t('admin.analytics.request_distribution_title')}</CardTitle>
          <CardDescription>{t('admin.analytics.request_distribution_subtitle')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {requestsByStatus.map((row: RequestByStatusRow) => (
            <div key={row.status} className="flex items-center justify-between border rounded-md px-3 py-2">
              <span className="font-medium">{row.status}</span>
              <span className="text-muted-foreground">{row._count._all}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
