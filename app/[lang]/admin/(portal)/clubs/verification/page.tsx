import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from '@/lib/icons';
import { getPendingClubVerifications, updateClubFlags } from '@/app/actions/admin-clubs';

interface VerificationPageProps {
  params: Promise<{ lang: string }>;
}

export default async function ClubVerificationPage({ params }: VerificationPageProps) {
  const { lang } = await params;
  const pendingClubs = await getPendingClubVerifications();
  type PendingClubRow = (typeof pendingClubs)[number];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Club Verification Queue</h1>
        <p className="text-muted-foreground mt-1">Review and approve newly submitted clubs.</p>
      </div>

      {pendingClubs.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center text-muted-foreground">
            <CheckCircle2 className="h-10 w-10 mx-auto mb-3 text-green-500" />
            All clubs are currently verified.
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {pendingClubs.map((club: PendingClubRow) => (
            <Card key={club.id}>
              <CardHeader>
                <CardTitle className="text-lg">{club.name}</CardTitle>
                <CardDescription>/{club.slug} · {club.city.name}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">Pending Verification</Badge>
                  <Badge variant={club.isActive ? 'default' : 'destructive'}>
                    {club.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                  <Badge variant="outline">{club.admins.length} admin(s)</Badge>
                  <Badge variant="outline">{club._count.membershipRequests} requests</Badge>
                </div>

                <div className="text-sm text-muted-foreground">
                  Contact: {club.contactEmail}
                </div>

                <div className="flex gap-2">
                  <Link href={`/${lang}/admin/clubs/${club.id}`}>
                    <Button variant="outline" size="sm">Review details</Button>
                  </Link>
                  <form action={updateClubFlags}>
                    <input type="hidden" name="clubId" value={club.id} />
                    <input type="hidden" name="isVerified" value="true" />
                    <Button type="submit" size="sm">Approve</Button>
                  </form>
                  <form action={updateClubFlags}>
                    <input type="hidden" name="clubId" value={club.id} />
                    <input type="hidden" name="isActive" value="false" />
                    <Button type="submit" size="sm" variant="destructive">Reject</Button>
                  </form>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
