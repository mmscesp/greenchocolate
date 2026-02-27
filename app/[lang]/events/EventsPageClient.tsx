'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/hooks/useLanguage';
import { Calendar, MapPin, Star, Clock, ArrowRight } from '@/lib/icons';

interface Event {
  id: string;
  slug: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  cityName?: string;
  clubName?: string;
  imageUrl?: string;
}

interface EventsPageClientProps {
  lang: string;
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

export default function EventsPageClient({ lang }: EventsPageClientProps) {
  const { t } = useLanguage();
  const [events] = useState<Event[]>(() => buildMockEvents(t));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 500);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse">
            <div className="h-64 bg-muted rounded-3xl mb-12" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-80 bg-muted rounded-2xl" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative">
      {/* Background Effects - subtle */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 md:pt-32 pb-12 relative">
        <motion.section 
          className="rounded-3xl border bg-card shadow-lg shadow-primary/5 p-8 md:p-12 mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <Calendar className="h-5 w-5 text-primary" />
            </div>
            <Badge variant="outline" className="border-primary/20 text-primary bg-primary/5">
              {t('events.badge')}
            </Badge>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black text-foreground mb-6">
            {t('events.title_prefix')}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/80">
              {t('events.title_highlight')}
            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-3xl leading-relaxed">
            {t('events.subtitle')}
          </p>
        </motion.section>

        <motion.section 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {events.length > 0 ? events.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link
                href={`/${lang}/events/${event.slug}`}
                className="group block rounded-2xl border bg-card p-6 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 h-full relative"
              >
                <div className="flex flex-wrap gap-2 mb-4">
                  {event.cityName && (
                    <Badge variant="outline" className="border-border text-muted-foreground bg-muted">
                      <MapPin className="h-3 w-3 mr-1" /> {event.cityName}
                    </Badge>
                  )}
                  {event.clubName && (
                    <Badge className="bg-primary/10 text-primary border-primary/20">
                      <Star className="h-3 w-3 mr-1" /> {event.clubName}
                    </Badge>
                  )}
                </div>
                
                <h2 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2">
                  {event.name}
                </h2>
                
                <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                  {event.description}
                </p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{new Date(event.startDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    <span>{event.location}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <span className="text-xs text-muted-foreground font-medium">{t('events.view_details')}</span>
                  <ArrowRight className="h-4 w-4 text-primary group-hover:translate-x-1 transition-transform" />
                </div>

                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-1 bg-primary rounded-full group-hover:w-1/4 transition-all duration-300" />
              </Link>
            </motion.div>
          )) : (
            <div className="col-span-full rounded-2xl border border-dashed border-border p-8 text-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">{t('events.empty')}</p>
            </div>
          )}
        </motion.section>
      </div>
    </div>
  );
}
