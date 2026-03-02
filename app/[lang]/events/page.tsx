import Link from 'next/link';
import { getUpcomingEvents } from '@/app/actions/events';
import EventsPageClient from './EventsPageClient';
import { Badge } from '@/components/ui/badge';
import { getDictionary } from '@/lib/dictionary';
import type { Locale } from '@/lib/i18n-config';

interface EventsPageProps {
  params: Promise<{ lang: string }>;
}

export default async function EventsPage({ params }: EventsPageProps) {
  const { lang } = await params;
  const events = await getUpcomingEvents(24);
  const dictionary = await getDictionary(lang as Locale);
  const t = (key: string) => dictionary[key] || key;

  return (
    <EventsPageClient lang={lang} initialEvents={events} />
  );
}
