'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { H1, H3, Eyebrow, Text, Lead } from '@/components/typography';
import { useLanguage } from '@/hooks/useLanguage';
import { Calendar, MapPin, Clock, ArrowRight } from '@/lib/icons';
import { getEventImage } from '@/lib/image-fallbacks';

interface Event {
  id: string;
  slug: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  cityName?: string | null;
  clubName?: string | null;
  imageUrl?: string | null;
}

interface EventsPageClientProps {
  lang: string;
  initialEvents?: Event[];
}

const buildMockEvents = (t: (key: string) => string): Event[] => [
  {
    id: '1',
    slug: 'cannabis-cup-barcelona-2025',
    name: t('events.mock.1.name'),
    description: t('events.mock.1.description'),
    startDate: '2025-03-15',
    endDate: '2025-03-17',
    location: t('events.mock.1.location'),
    cityName: t('events.mock.1.city_name'),
    clubName: t('events.mock.1.club_name'),
  },
  {
    id: '2',
    slug: 'medical-cannabis-summit',
    name: t('events.mock.2.name'),
    description: t('events.mock.2.description'),
    startDate: '2025-04-20',
    endDate: '2025-04-22',
    location: t('events.mock.2.location'),
    cityName: t('events.mock.2.city_name'),
    clubName: t('events.mock.2.club_name'),
  },
  {
    id: '3',
    slug: 'cannabis-expo-berlin',
    name: t('events.mock.3.name'),
    description: t('events.mock.3.description'),
    startDate: '2025-05-10',
    endDate: '2025-05-12',
    location: t('events.mock.3.location'),
    cityName: t('events.mock.3.city_name'),
    clubName: t('events.mock.3.club_name'),
  },
  {
    id: '4',
    slug: 'cannabis-culture-festival',
    name: t('events.mock.4.name'),
    description: t('events.mock.4.description'),
    startDate: '2025-06-15',
    endDate: '2025-06-16',
    location: t('events.mock.4.location'),
    cityName: t('events.mock.4.city_name'),
    clubName: t('events.mock.4.club_name'),
  },
  {
    id: '5',
    slug: 'indoor-cannabis-workshop',
    name: t('events.mock.5.name'),
    description: t('events.mock.5.description'),
    startDate: '2025-02-28',
    endDate: '2025-03-01',
    location: t('events.mock.5.location'),
    cityName: t('events.mock.5.city_name'),
    clubName: t('events.mock.5.club_name'),
  },
  {
    id: '6',
    slug: 'cannabis-regulation-forum',
    name: t('events.mock.6.name'),
    description: t('events.mock.6.description'),
    startDate: '2025-07-08',
    endDate: '2025-07-09',
    location: t('events.mock.6.location'),
    cityName: t('events.mock.6.city_name'),
  },
];

function getCitySlugFromName(cityName?: string | null): string | null {
  if (!cityName) {
    return null;
  }

  const normalized = cityName.toLowerCase();
  if (normalized.includes('barcelona')) return 'barcelona';
  if (normalized.includes('madrid')) return 'madrid';
  if (normalized.includes('valencia')) return 'valencia';
  if (normalized.includes('sevill')) return 'sevilla';
  if (normalized.includes('malaga') || normalized.includes('málaga')) return 'malaga';
  if (normalized.includes('tenerife')) return 'tenerife';

  return null;
}

export default function EventsPageClient({ lang, initialEvents }: EventsPageClientProps) {
  const { t } = useLanguage();
  const [events] = useState<Event[]>(() => initialEvents || buildMockEvents(t));
  const [isLoading, setIsLoading] = useState(!initialEvents);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => setIsLoading(false), 500);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg-base text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-bg-surface/20 via-bg-base to-bg-base pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10 pt-24 md:pt-32">
          <div className="animate-pulse">
            <div className="h-64 bg-bg-card/70 rounded-3xl mb-12 border border-white/5" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-80 bg-bg-card/70 rounded-2xl border border-white/5" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-base text-white relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-bg-surface/20 via-bg-base to-bg-base pointer-events-none" />
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 left-[12%] h-[500px] w-[500px] rounded-full bg-brand/5 blur-[120px]" />
        <div className="absolute top-[40%] right-[5%] h-[400px] w-[400px] rounded-full bg-brand/5 blur-[120px]" />
        <div className="absolute top-[40%] right-[5%] h-[400px] w-[400px] rounded-full bg-brand/5 blur-[120px]" />
      </div>

      <div className="relative z-10">
        {/* Hero Section */}
        <section className="pt-24 md:pt-32 pb-16 md:pb-24 border-b border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="max-w-3xl mx-auto text-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Eyebrow variant="muted" className="mb-6 justify-center flex items-center gap-2 text-brand">
                <Calendar className="w-4 h-4" />
                {t('events.badge')}
              </Eyebrow>

              <H1 size="xl" className="mb-6 text-white font-serif tracking-tight">
                {t('events.title_prefix')} <span className="text-brand">{t('events.title_highlight')}</span>
              </H1>

              <Lead className="mb-8 text-zinc-400">{t('events.subtitle')}</Lead>
            </motion.div>
          </div>
        </section>

        {/* Events Grid */}
        <section className="py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {events.length > 0 ? (
                events.map((event, index) => {
                  const eventImage = getEventImage(event.imageUrl, getCitySlugFromName(event.cityName));

                  return (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <Link
                        href={`/${lang}/events/${event.slug}`}
                        className="group relative overflow-hidden rounded-2xl border border-white/10 bg-bg-card/70 backdrop-blur-sm hover:border-brand/50 transition-all duration-500 h-full flex flex-col"
                      >
                        <div className="relative aspect-video overflow-hidden">
                          <Image
                            src={eventImage}
                            alt={event.name}
                            fill
                            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-bg-base/80 via-bg-base/20 to-transparent" />
                        </div>

                        <div className="relative flex flex-col h-full p-6 md:p-8">
                          <div className="flex items-center justify-between mb-6">
                            <div className="inline-flex p-3 rounded-xl bg-brand/10 text-brand border border-brand/20 transition-transform duration-500 group-hover:scale-110">
                              <Calendar className="w-6 h-6" />
                            </div>
                            <div className="flex flex-wrap gap-2 justify-end">
                              {event.cityName && (
                                <Badge variant="secondary" className="border-white/10 text-zinc-400 bg-white/5 uppercase tracking-widest text-[10px]">
                                  {event.cityName}
                                </Badge>
                              )}
                              {event.clubName && (
                                <Badge className="bg-brand text-bg-base border-none font-bold uppercase tracking-widest text-[10px]">
                                  {event.clubName}
                                </Badge>
                              )}
                            </div>
                          </div>

                          <H3 className="mb-3 text-white group-hover:text-brand transition-colors font-serif">{event.name}</H3>

                          <Text variant="muted" className="mb-6 text-zinc-400 line-clamp-2">
                            {event.description}
                          </Text>

                          <div className="space-y-2 mb-8 text-zinc-500 text-[10px] font-bold uppercase tracking-widest mt-auto">
                            <div className="flex items-center gap-2">
                              <Clock className="h-3.5 w-3.5 text-brand" />
                              <span>
                                {new Date(event.startDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-3.5 w-3.5 text-brand" />
                              <span>{event.location}</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-4 border-t border-white/5">
                            <Text size="sm" variant="muted" className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">
                              {t('events.view_details')}
                            </Text>
                            <div className="flex items-center gap-2 text-brand font-bold text-sm opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                              <span>Explore</span>
                              <ArrowRight className="w-4 h-4" />
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })
              ) : (
                <div className="col-span-full rounded-2xl border border-dashed border-white/10 p-12 text-center bg-bg-card/30">
                  <div className="w-16 h-16 bg-brand/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-brand/20">
                    <Calendar className="h-8 w-8 text-brand" />
                  </div>
                  <Text variant="muted">{t('events.empty')}</Text>
                </div>
              )}
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  );
}

