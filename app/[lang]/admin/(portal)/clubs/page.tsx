import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Building2, ChevronLeft, ChevronRight } from '@/lib/icons';
import { getAdminClubs, updateClubFlags } from '@/app/actions/admin-clubs';

interface ClubsPageProps {
  params: Promise<{ lang: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function getString(value: string | string[] | undefined, fallback = ''): string {
  return typeof value === 'string' ? value : fallback;
}

export default async function AdminClubsPage({ params, searchParams }: ClubsPageProps) {
  const { lang } = await params;
  const query = await searchParams;

  const q = getString(query.q);
  const verification = getString(query.verification, 'ALL') as 'ALL' | 'VERIFIED' | 'PENDING';
  const activity = getString(query.activity, 'ALL') as 'ALL' | 'ACTIVE' | 'INACTIVE';
  const page = Number(getString(query.page, '1')) || 1;

  const data = await getAdminClubs({ query: q, verification, activity, page, pageSize: 20 });
  type ClubRow = (typeof data.clubs)[number];

  const buildUrl = (nextPage: number) => {
    const paramsObj = new URLSearchParams();
    if (q) paramsObj.set('q', q);
    if (verification !== 'ALL') paramsObj.set('verification', verification);
    if (activity !== 'ALL') paramsObj.set('activity', activity);
    paramsObj.set('page', String(nextPage));
    return `/${lang}/admin/clubs?${paramsObj.toString()}`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Clubs Management</h1>
        <p className="text-muted-foreground mt-1">Review, verify, and manage all clubs on the platform.</p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <form className="grid grid-cols-1 md:grid-cols-[1fr_auto_auto_auto] gap-3" action={`/${lang}/admin/clubs`}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input name="q" defaultValue={q} placeholder="Search by club name, slug, email" className="pl-9" />
            </div>
            <select
              name="verification"
              defaultValue={verification}
              className="h-10 rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="ALL">All verification</option>
              <option value="VERIFIED">Verified</option>
              <option value="PENDING">Pending</option>
            </select>
            <select
              name="activity"
              defaultValue={activity}
              className="h-10 rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="ALL">All activity</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
            <Button type="submit">Filter</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Clubs ({data.total})</CardTitle>
          <CardDescription>Page {data.page} of {Math.max(1, data.totalPages)}</CardDescription>
        </CardHeader>
        <CardContent>
          {data.clubs.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Building2 className="h-8 w-8 mx-auto mb-2" />
              No clubs found for this filter.
            </div>
          ) : (
            <div className="space-y-4">
              {data.clubs.map((club: ClubRow) => (
                <div key={club.id} className="border rounded-lg p-4">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="min-w-0">
                      <div className="font-medium text-lg truncate">{club.name}</div>
                      <div className="text-sm text-muted-foreground truncate">/{club.slug} · {club.city.name}</div>
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        <Badge variant={club.isVerified ? 'default' : 'secondary'}>
                          {club.isVerified ? 'Verified' : 'Pending verification'}
                        </Badge>
                        <Badge variant={club.isActive ? 'default' : 'destructive'}>
                          {club.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                        <Badge variant="outline">{club._count.membershipRequests} requests</Badge>
                        <Badge variant="outline">{club.admins.length} admins</Badge>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 items-center">
                      <Link href={`/${lang}/admin/clubs/${club.id}`}>
                        <Button variant="outline" size="sm">Details</Button>
                      </Link>

                      <form action={updateClubFlags}>
                        <input type="hidden" name="clubId" value={club.id} />
                        <input type="hidden" name="isVerified" value={String(!club.isVerified)} />
                        <Button type="submit" size="sm" variant="outline">
                          {club.isVerified ? 'Unverify' : 'Verify'}
                        </Button>
                      </form>

                      <form action={updateClubFlags}>
                        <input type="hidden" name="clubId" value={club.id} />
                        <input type="hidden" name="isActive" value={String(!club.isActive)} />
                        <Button type="submit" size="sm" variant="outline">
                          {club.isActive ? 'Deactivate' : 'Activate'}
                        </Button>
                      </form>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between mt-6 pt-4 border-t">
            <Button asChild variant="outline" size="sm" disabled={data.page <= 1}>
              <Link href={buildUrl(Math.max(1, data.page - 1))}>
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Link>
            </Button>
            <span className="text-sm text-muted-foreground">Page {data.page} of {Math.max(1, data.totalPages)}</span>
            <Button asChild variant="outline" size="sm" disabled={data.page >= data.totalPages}>
              <Link href={buildUrl(Math.min(data.totalPages || 1, data.page + 1))}>
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
