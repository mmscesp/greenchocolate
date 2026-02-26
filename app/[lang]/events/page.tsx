import Link from 'next/link';
import { getUpcomingEvents } from '@/app/actions/events';
import { Badge } from '@/components/ui/badge';

interface EventsPageProps {
  params: Promise<{ lang: string }>;
}

export default async function EventsPage({ params }: EventsPageProps) {
  const { lang } = await params;
  const events = await getUpcomingEvents(24);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 md:pt-32 pb-12 space-y-8">
      <section className="rounded-2xl border bg-card p-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-3">Europe Events</h1>
        <p className="text-muted-foreground">Cultural and industry events connected to the platform's trust-and-education mission.</p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {events.length > 0 ? events.map((event) => (
          <Link
            key={event.id}
            href={`/${lang}/events/${event.slug}`}
            className="rounded-xl border bg-card p-5 hover:border-primary/50 transition-colors"
          >
            <div className="flex flex-wrap gap-2 mb-2">
              {event.cityName && <Badge variant="outline">{event.cityName}</Badge>}
              {event.clubName && <Badge variant="secondary">{event.clubName}</Badge>}
            </div>
            <h2 className="text-lg font-semibold mb-2">{event.name}</h2>
            <p className="text-sm text-muted-foreground mb-3 line-clamp-3">{event.description}</p>
            <p className="text-xs text-muted-foreground">{new Date(event.startDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}</p>
            <p className="text-xs text-muted-foreground">{event.location}</p>
          </Link>
        )) : (
          <div className="col-span-full rounded-xl border border-dashed p-6 text-sm text-muted-foreground">
            No upcoming published events yet.
          </div>
        )}
      </section>
    </div>
  );
}
