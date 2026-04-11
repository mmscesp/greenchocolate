import type { Metadata } from 'next';
import { getUpcomingEvents } from '@/app/actions/events';
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
        'Descubre eventos, encuentros y actividades publicadas por cannabis social clubs verificados en España.',
    },
    en: {
      title: 'Cannabis Social Club Events in Spain | SocialClubsMaps',
      description:
        'Discover upcoming events, meetups, and activities published by verified cannabis social clubs in Spain.',
    },
    fr: {
      title: 'Événements des Clubs Sociaux Cannabis en Espagne | SocialClubsMaps',
      description:
        'Découvrez les événements et activités publiés par des clubs sociaux cannabis vérifiés en Espagne.',
    },
    de: {
      title: 'Events von Cannabis Social Clubs in Spanien | SocialClubsMaps',
      description:
        'Entdecke bevorstehende Events und Aktivitäten von verifizierten Cannabis Social Clubs in Spanien.',
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
  const events = await getUpcomingEvents(24);

  return (
    <EventsPageClient lang={lang} initialEvents={events} />
  );
}
