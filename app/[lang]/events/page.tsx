import type { Metadata } from 'next';
import { getEvents } from '@/app/actions/events';
import EventsPageClient from './EventsPageClient';
import { buildLocalizedMetadata, isLocale } from '@/lib/seo';

interface EventsPageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({
  params,
}: EventsPageProps): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) {
    return {};
  }

  const byLocale: Record<string, { title: string; description: string }> = {
    es: {
      title: 'Eventos de Cannabis Social Clubs en España | SocialClubsMaps',
      description:
        'Descubre eventos, conferencias y coberturas clave vinculadas al ecosistema del cannabis en España y Europa.',
    },
    en: {
      title: 'Cannabis Social Club Events in Spain | SocialClubsMaps',
      description:
        'Discover key cannabis events, conferences, and editorial signal pieces relevant to Spain and the wider European scene.',
    },
    fr: {
      title: 'Événements des Clubs Sociaux Cannabis en Espagne | SocialClubsMaps',
      description:
        "Découvrez les événements, conférences et lectures clés liés à l'écosystème du cannabis en Espagne et en Europe.",
    },
    de: {
      title: 'Events von Cannabis Social Clubs in Spanien | SocialClubsMaps',
      description:
        'Entdecke wichtige Cannabis-Events, Konferenzen und redaktionelle Signalstücke für Spanien und Europa.',
    },
  };

  const localized = byLocale[lang] ?? byLocale.en;
  return buildLocalizedMetadata({
    lang,
    path: '/events',
    title: localized.title,
    description: localized.description,
  });
}

export default async function EventsPage({ params }: EventsPageProps) {
  const { lang } = await params;
  const events = await getEvents(24, isLocale(lang) ? lang : 'en');

  return (
    <EventsPageClient lang={lang} initialEvents={events} />
  );
}
