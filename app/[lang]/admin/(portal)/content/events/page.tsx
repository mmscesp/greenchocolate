import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getAdminEventsIndex, toggleEventPublication } from '@/app/actions/admin-content';

export const dynamic = 'force-dynamic';

export default async function AdminContentEventsPage() {
  const events = await getAdminEventsIndex();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Content - Events</h1>
        <p className="text-muted-foreground mt-1">Moderate event publication visibility.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Events ({events.length})</CardTitle>
          <CardDescription>Latest 100 events across clubs and cities.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {events.map((event) => (
              <div key={event.id} className="border rounded-md p-3">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                  <div>
                    <div className="font-medium">{event.name}</div>
                    <div className="text-sm text-muted-foreground">
                      /{event.slug} · {new Date(event.startDate).toLocaleDateString()} → {new Date(event.endDate).toLocaleDateString()}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {event.club?.name || 'No club'} · {event.city?.name || 'No city'}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={event.isPublished ? 'default' : 'secondary'}>
                      {event.isPublished ? 'Published' : 'Draft'}
                    </Badge>
                    <form action={toggleEventPublication}>
                      <input type="hidden" name="eventId" value={event.id} />
                      <input type="hidden" name="nextPublished" value={String(!event.isPublished)} />
                      <Button type="submit" size="sm" variant="outline">
                        {event.isPublished ? 'Unpublish' : 'Publish'}
                      </Button>
                    </form>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
