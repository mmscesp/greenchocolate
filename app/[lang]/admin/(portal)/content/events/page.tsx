import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getAdminEventsIndex, toggleEventPublication } from '@/app/actions/admin-content';
import { getDictionary } from '@/lib/dictionary';
import type { Locale } from '@/lib/i18n-config';

export const dynamic = 'force-dynamic';

interface AdminContentEventsPageProps {
  params: Promise<{ lang: string }>;
}

export default async function AdminContentEventsPage({ params }: AdminContentEventsPageProps) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang as Locale);
  const t = (key: string): string => (typeof dictionary[key] === 'string' ? dictionary[key] : key);
  const events = await getAdminEventsIndex();
  type EventRow = (typeof events)[number];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('admin.content.events.title')}</h1>
        <p className="text-muted-foreground mt-1">{t('admin.content.events.subtitle')}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('admin.content.events.list_title')} ({events.length})</CardTitle>
          <CardDescription>{t('admin.content.events.list_subtitle')}</CardDescription>
        </CardHeader>
        <CardContent>
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
                      <Button type="submit" size="sm" variant="secondary">
                        {event.isPublished ? t('admin.content.events.unpublish') : t('admin.content.events.publish')}
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
