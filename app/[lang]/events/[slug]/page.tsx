import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getEventBySlug } from '@/app/actions/events';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface PageProps {
  params: Promise<{ lang: string; slug: string }>;
}

export default async function EventPage({ params }: PageProps) {
  const { lang, slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <section className="rounded-2xl border bg-card p-8">
        <div className="flex flex-wrap gap-2 mb-3">
          {event.cityName && <Badge variant="outline">{event.cityName}</Badge>}
          {event.clubName && <Badge variant="secondary">{event.clubName}</Badge>}
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-4">{event.name}</h1>
        <p className="text-muted-foreground mb-4">{event.description}</p>
        <div className="text-sm text-muted-foreground space-y-1">
          <p>Date: {new Date(event.startDate).toLocaleString()} - {new Date(event.endDate).toLocaleString()}</p>
          <p>Location: {event.location}</p>
        </div>
      </section>

      <section className="rounded-xl border bg-muted/30 p-6 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">Always verify venue rules and local regulations before attending.</p>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/${lang}/events`}>Back to events</Link>
          </Button>
          {event.eventUrl && (
            <Button asChild>
              <a href={event.eventUrl} target="_blank" rel="noreferrer">Official Event Page</a>
            </Button>
          )}
        </div>
      </section>
    </div>
  );
}
