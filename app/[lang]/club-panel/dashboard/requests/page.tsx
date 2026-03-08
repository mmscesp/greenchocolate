import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getClubApplications } from '@/app/actions/applications';

export const dynamic = 'force-dynamic';

export default async function ClubRequestsPage() {
  const requests = await getClubApplications();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Membership Requests</h1>
        <p className="mt-2 text-muted-foreground">
          This queue is now admin-managed. Club accounts can review request status, but approvals and rejections happen
          from the platform admin portal.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Read-only request view</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {requests.length === 0 ? (
            <p className="text-sm text-muted-foreground">No applicant requests are currently visible for this club.</p>
          ) : (
            requests.map((request) => (
              <div key={request.id} className="rounded-2xl border border-border p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold">{request.user.displayName || request.user.email}</p>
                  <Badge variant="secondary">{request.status}</Badge>
                  <Badge variant="secondary">{request.stage}</Badge>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  {request.club.name} · {new Date(request.createdAt).toLocaleString()}
                </p>
                {request.message ? (
                  <p className="mt-2 text-sm text-slate-700">{request.message}</p>
                ) : null}
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
