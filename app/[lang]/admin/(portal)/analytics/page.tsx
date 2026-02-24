import { prisma } from '@/lib/prisma';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { StatsCard } from '@/components/admin/StatsCard';
import { Users, Building2, ClipboardList, Calendar } from '@/lib/icons';

export const dynamic = 'force-dynamic';

export default async function AdminAnalyticsPage() {
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
        <h1 className="text-3xl font-bold tracking-tight">Platform Analytics</h1>
        <p className="text-muted-foreground mt-1">High-level platform growth and activity metrics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="New Users (30d)" value={newUsers30d} icon={Users} color="blue" />
        <StatsCard title="New Clubs (30d)" value={newClubs30d} icon={Building2} color="green" />
        <StatsCard title="New Requests (30d)" value={newRequests30d} icon={ClipboardList} color="orange" />
        <StatsCard title="Upcoming Events" value={upcomingEvents} icon={Calendar} color="purple" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Membership Request Distribution</CardTitle>
          <CardDescription>Current status breakdown across all clubs.</CardDescription>
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
