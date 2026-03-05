import { prisma } from '@/lib/prisma';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getDictionary } from '@/lib/dictionary';
import type { Locale } from '@/lib/i18n-config';

export const dynamic = 'force-dynamic';

interface AdminRequestsPageProps {
  params: Promise<{ lang: string }>;
}

export default async function AdminRequestsPage({ params }: AdminRequestsPageProps) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang as Locale);
  const t = (key: string): string => (typeof dictionary[key] === 'string' ? dictionary[key] : key);
  const [pending, approved, rejected, recentRequests] = await Promise.all([
    prisma.membershipRequest.count({ where: { status: 'PENDING' } }),
    prisma.membershipRequest.count({ where: { status: 'APPROVED' } }),
    prisma.membershipRequest.count({ where: { status: 'REJECTED' } }),
    prisma.membershipRequest.findMany({
      take: 50,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            displayName: true,
          },
        },
        club: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    }),
  ]);

  type RecentRequestRow = (typeof recentRequests)[number];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('admin.requests.title')}</h1>
        <p className="text-muted-foreground mt-1">{t('admin.requests.subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">{t('admin.common.pending')}</p>
            <p className="text-3xl font-bold">{pending}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">{t('admin.common.approved')}</p>
            <p className="text-3xl font-bold">{approved}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">{t('admin.common.rejected')}</p>
            <p className="text-3xl font-bold">{rejected}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('admin.requests.latest')}</CardTitle>
          <CardDescription>{t('admin.requests.latest_subtitle')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentRequests.map((request: RecentRequestRow) => (
              <div key={request.id} className="border rounded-md p-3 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <div>
                  <div className="font-medium">{request.user.displayName || request.user.email}</div>
                  <div className="text-sm text-muted-foreground">{request.club.name} · {new Date(request.createdAt).toLocaleString()}</div>
                </div>
                <Badge
                  variant={
                    request.status === 'APPROVED'
                      ? 'default'
                      : request.status === 'REJECTED'
                        ? 'destructive'
                        : 'secondary'
                  }
                >
                  {request.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
