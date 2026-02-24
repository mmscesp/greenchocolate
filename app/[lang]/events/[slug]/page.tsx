'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Clock, ArrowLeft, ExternalLink } from '@/lib/icons';

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
  eventUrl?: string;
}

interface PageProps {
  params: Promise<{ lang: string; slug: string }>;
}

// Mock events data
const mockEvents: Record<string, Event> = {
  'cannabis-cup-barcelona-2025': {
    id: '1',
    slug: 'cannabis-cup-barcelona-2025',
    name: 'Cannabis Cup Barcelona 2025',
    description: 'Join the most prestigious cannabis competition in Europe. Top growers and extractors compete for excellence awards across multiple categories including best flower, best concentrate, and best edible. This three-day event features educational workshops, networking opportunities, and an awards ceremony.',
    startDate: '2025-03-15',
    endDate: '2025-03-17',
    location: 'Fira Barcelona, Barcelona',
    cityName: 'Barcelona',
    clubName: 'Green Revolution CSC',
    eventUrl: 'https://example.com/cannabis-cup',
  },
  'medical-cannabis-summit': {
    id: '2',
    slug: 'medical-cannabis-summit',
    name: 'Medical Cannabis Summit Europe',
    description: 'A comprehensive conference bringing together medical professionals, researchers, and patients to discuss therapeutic applications of cannabis. Topics include pain management, epilepsy treatment, and the latest clinical research findings.',
    startDate: '2025-04-20',
    endDate: '2025-04-22',
    location: 'RAI Amsterdam, Amsterdam',
    cityName: 'Amsterdam',
    clubName: 'Medical Green CSC',
  },
};

export default function EventPage({ params }: PageProps) {
  const [lang, setLang] = useState('en');
  const [slug, setSlug] = useState('');
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    params.then(({ lang: resolvedLang, slug: resolvedSlug }) => {
      setLang(resolvedLang);
      setSlug(resolvedSlug);
      // Simulate API call
      setTimeout(() => {
        const foundEvent = mockEvents[resolvedSlug] || Object.values(mockEvents)[0];
        setEvent(foundEvent);
        setIsLoading(false);
      }, 300);
    });
  }, [params]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse space-y-8">
            <div className="h-64 bg-muted rounded-3xl" />
            <div className="h-32 bg-muted rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Event Not Found</h1>
          <Button variant="outline" asChild className="border-border text-muted-foreground hover:bg-muted hover:text-foreground">
            <Link href={`/${lang}/events`}>Back to Events</Link>
          </Button>
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Button variant="outline" asChild className="border-border text-muted-foreground hover:bg-muted hover:text-foreground">
            <Link href={`/${lang}/events`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Events
            </Link>
          </Button>
        </motion.div>

        {/* Event Header */}
        <motion.section 
          className="rounded-3xl border bg-card shadow-lg shadow-primary/5 p-8 md:p-12 mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="flex flex-wrap gap-2 mb-6">
            {event.cityName && (
              <Badge variant="outline" className="border-primary/20 text-primary bg-primary/5">
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

          <h1 className="text-3xl md:text-5xl font-black text-foreground mb-6">
            {event.name}
          </h1>

          <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
            {event.description}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-3 text-muted-foreground bg-muted px-4 py-3 rounded-xl">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Date</p>
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
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Location</p>
                <p className="text-foreground font-medium">{event.location}</p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Action Section */}
        <motion.section 
          className="rounded-2xl border bg-card p-6 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex items-center gap-3 text-muted-foreground">
            <Clock className="h-5 w-5" />
            <p className="text-sm">Always verify venue rules and local regulations before attending.</p>
          </div>
          <div className="flex gap-3">
            {event.eventUrl && (
              <Button 
                asChild
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <a href={event.eventUrl} target="_blank" rel="noreferrer">
                  Official Event Page
                  <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            )}
          </div>
        </motion.section>
      </div>
    </div>
  );
}
