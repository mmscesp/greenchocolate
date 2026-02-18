import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Building2, Users, Calendar, ClipboardList } from 'lucide-react';
import { getAdminClubById, updateClubFlags } from '@/app/actions/admin-clubs';

interface ClubDetailPageProps {
  params: Promise<{ lang: string; id: string }>;
}

export default async function AdminClubDetailPage({ params }: ClubDetailPageProps) {
  const { lang, id } = await params;
  const club = await getAdminClubById(id);

  if (!club) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Club Details</h1>
          <p className="text-muted-foreground mt-1">Inspect profile, assigned admins, and operational data.</p>
        </div>
        <Link href={`/${lang}/admin/clubs`}>
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to clubs
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{club.name}</CardTitle>
          <CardDescription>/{club.slug} · {club.city.name}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2 flex-wrap">
            <Badge variant={club.isVerified ? 'default' : 'secondary'}>
              {club.isVerified ? 'Verified' : 'Pending verification'}
            </Badge>
            <Badge variant={club.isActive ? 'default' : 'destructive'}>
              {club.isActive ? 'Active' : 'Inactive'}
            </Badge>
            <Badge variant="outline">Founded {club.foundedYear}</Badge>
            <Badge variant="outline">Capacity {club.capacity}</Badge>
          </div>

          <p className="text-sm text-muted-foreground">{club.description}</p>

          <div className="flex flex-wrap gap-3 pt-2">
            <form action={updateClubFlags}>
              <input type="hidden" name="clubId" value={club.id} />
              <input type="hidden" name="isVerified" value={String(!club.isVerified)} />
              <Button type="submit" variant="outline">
                {club.isVerified ? 'Unverify Club' : 'Verify Club'}
              </Button>
            </form>

            <form action={updateClubFlags}>
              <input type="hidden" name="clubId" value={club.id} />
              <input type="hidden" name="isActive" value={String(!club.isActive)} />
              <Button type="submit" variant="outline">
                {club.isActive ? 'Deactivate Club' : 'Activate Club'}
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Users className="h-4 w-4" />
              Assigned Admins ({club.admins.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {club.admins.length === 0 ? (
              <p className="text-sm text-muted-foreground">No assigned admins.</p>
            ) : (
              club.admins.map((admin) => (
                <div key={admin.id} className="border rounded-md p-2 text-sm">
                  <div className="font-medium">{admin.displayName || 'Unnamed admin'}</div>
                  <div className="text-muted-foreground">{admin.email}</div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <ClipboardList className="h-4 w-4" />
              Membership Requests ({club._count.membershipRequests})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {club.membershipRequests.length === 0 ? (
              <p className="text-sm text-muted-foreground">No recent requests.</p>
            ) : (
              club.membershipRequests.map((request) => (
                <div key={request.id} className="border rounded-md p-2 text-sm">
                  <div className="font-medium">{request.user.displayName || request.user.email}</div>
                  <div className="text-muted-foreground">{request.status}</div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Calendar className="h-4 w-4" />
              Events ({club._count.events})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {club.events.length === 0 ? (
              <p className="text-sm text-muted-foreground">No events.</p>
            ) : (
              club.events.map((event) => (
                <div key={event.id} className="border rounded-md p-2 text-sm">
                  <div className="font-medium">{event.name}</div>
                  <div className="text-muted-foreground">
                    {new Date(event.startDate).toLocaleDateString()} · {event.isPublished ? 'Published' : 'Draft'}
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
