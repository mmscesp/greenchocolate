import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AdminActionNotice } from '@/components/admin/AdminActionNotice';
import { getAdminEventsIndex, toggleEventPublication } from '@/app/actions/admin-content';
import { getDictionary } from '@/lib/dictionary';
import type { Locale } from '@/lib/i18n-config';

export const dynamic = 'force-dynamic';

interface AdminContentEventsPageProps {
  params: Promise<{ lang: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function getString(value: string | string[] | undefined, fallback = ''): string {
  return typeof value === 'string' ? value : fallback;
}

export default async function AdminContentEventsPage({ params, searchParams }: AdminContentEventsPageProps) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang as Locale);
  const t = (key: string): string => (typeof dictionary[key] === 'string' ? dictionary[key] : key);
  const query = await searchParams;
  const status = getString(query.status);
  const message = getString(query.message);
  const events = await getAdminEventsIndex();
  type EventRow = (typeof events)[number];
  const publishedCount = events.filter((event) => event.isPublished).length;
  const unpublishedCount = events.length - publishedCount;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('admin.content.events.title')}</h1>
        <p className="text-muted-foreground mt-1">{t('admin.content.events.subtitle')}</p>
      </div>

      <AdminActionNotice status={status} message={message} />

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Total events</p>
            <p className="text-3xl font-bold">{events.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Published</p>
            <p className="text-3xl font-bold">{publishedCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Draft / unpublished</p>
            <p className="text-3xl font-bold">{unpublishedCount}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('admin.content.events.list_title')} ({events.length})</CardTitle>
          <CardDescription>{t('admin.content.events.list_subtitle')}</CardDescription>
        </CardHeader>
        <CardContent>
          {events.length === 0 ? (
            <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
              No events are available yet.
            </div>
          ) : (
            <div className="space-y-3">
              {events.map((event: EventRow) => (
                <div key={event.id} className="border rounded-md p-3">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                    <div>
                      <div className="font-medium">{event.name}</div>
                      <div className="text-sm text-muted-foreground">
                        /{event.slug} · {new Date(event.startDate).toLocaleDateString()} → {new Date(event.endDate).toLocaleDateString()}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {event.club?.name || t('admin.content.events.no_club')} · {event.city?.name || t('admin.content.events.no_city')}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={event.isPublished ? 'default' : 'secondary'}>
                        {event.isPublished ? t('admin.common.published') : t('admin.common.draft')}
                      </Badge>
                      <form action={toggleEventPublication}>
                        <input type="hidden" name="eventId" value={event.id} />
                        <input type="hidden" name="nextPublished" value={String(!event.isPublished)} />
                        <input type="hidden" name="returnPath" value={`/${lang}/admin/content/events`} />
                        <Button type="submit" size="sm" variant="secondary">
                          {event.isPublished ? t('admin.content.events.unpublish') : t('admin.content.events.publish')}
                        </Button>
                      </form>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
