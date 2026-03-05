import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getEventBySlug } from '@/app/actions/events';
import { getDictionary } from '@/lib/dictionary';
import type { Locale } from '@/lib/i18n-config';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Clock, ArrowLeft, ExternalLink } from '@/lib/icons';

interface EventPageProps {
  params: Promise<{ lang: string; slug: string }>;
}

export default async function EventPage({ params }: EventPageProps) {
  const { lang, slug } = await params;
  const dictionary = await getDictionary(lang as Locale);
  const t = (key: string): string => (typeof dictionary[key] === 'string' ? dictionary[key] : key);

  const event = await getEventBySlug(slug);

  if (!event) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background relative">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 md:pt-32 pb-12 relative z-10">
        <div className="mb-8">
          <Button variant="secondary" asChild className="border-border text-muted-foreground hover:bg-muted hover:text-foreground">
            <Link href={`/${lang}/events`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t('event_detail.back_to_events')}
            </Link>
          </Button>
        </div>

        <section className="rounded-3xl border bg-card shadow-lg shadow-primary/5 p-8 md:p-12 mb-8">
          <div className="flex flex-wrap gap-2 mb-6">
            {event.cityName && (
              <Badge variant="secondary" className="border-primary/20 text-primary bg-primary/5">
                <MapPin className="h-3 w-3 mr-1" />
                {event.cityName}
              </Badge>
            )}
            {event.clubName && (
              <Badge className="bg-primary/10 text-primary border-primary/20">
                {event.clubName}
              </Badge>
            )}
          </div>

          <h1 className="text-3xl md:text-5xl font-black text-foreground mb-6">{event.name}</h1>

          <p className="text-lg text-muted-foreground mb-8 leading-relaxed">{event.description}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-3 text-muted-foreground bg-muted px-4 py-3 rounded-xl">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">{t('event_detail.date')}</p>
                <p className="text-foreground font-medium">
                  {new Date(event.startDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-muted-foreground bg-muted px-4 py-3 rounded-xl">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">{t('event_detail.location')}</p>
                <p className="text-foreground font-medium">{event.location}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border bg-card p-6 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
          <div className="flex items-center gap-3 text-muted-foreground">
            <Clock className="h-5 w-5" />
            <p className="text-sm">{t('event_detail.compliance_note')}</p>
          </div>
          {event.eventUrl ? (
            <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <a href={event.eventUrl} target="_blank" rel="noreferrer">
                {t('event_detail.official_page')}
                <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
          ) : null}
        </section>
      </div>
    </div>
  );
}
