'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Star, Clock, ArrowRight } from 'lucide-react';

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

const mockEvents: Event[] = [
  {
    id: '1',
    slug: 'cannabis-cup-barcelona-2025',
    name: 'Cannabis Cup Barcelona 2025',
    description: 'Join the most prestigious cannabis competition in Europe. Top growers and extractors compete for excellence awards across multiple categories.',
    startDate: '2025-03-15',
    endDate: '2025-03-17',
    location: 'Fira Barcelona, Barcelona',
    cityName: 'Barcelona',
    clubName: 'Green Revolution CSC',
  },
  {
    id: '2',
    slug: 'medical-cannabis-summit',
    name: 'Medical Cannabis Summit Europe',
    description: 'A comprehensive conference bringing together medical professionals, researchers, and patients to discuss therapeutic applications of cannabis.',
    startDate: '2025-04-20',
    endDate: '2025-04-22',
    location: 'RAI Amsterdam, Amsterdam',
    cityName: 'Amsterdam',
    clubName: 'Medical Green CSC',
  },
  {
    id: '3',
    slug: 'cannabis-expo-berlin',
    name: 'Cannabis Expo Berlin 2025',
    description: 'The largest B2B cannabis exhibition in Germany, featuring international exhibitors, networking events, and educational workshops.',
    startDate: '2025-05-10',
    endDate: '2025-05-12',
    location: 'Messe Berlin, Berlin',
    cityName: 'Berlin',
    clubName: 'Berlin Green CSC',
  },
  {
    id: '4',
    slug: 'cannabis-culture-festival',
    name: 'Cannabis Culture Festival Madrid',
    description: 'Celebrate cannabis culture with live music, art exhibitions, educational talks, and community networking in the heart of Spain.',
    startDate: '2025-06-15',
    endDate: '2025-06-16',
    location: 'Matadero Madrid, Madrid',
    cityName: 'Madrid',
    clubName: 'Madrid Social Club',
  },
  {
    id: '5',
    slug: 'indoor-cannabis-workshop',
    name: 'Advanced Indoor Growing Workshop',
    description: 'Master indoor cultivation techniques with expert growers. Learn about lighting, nutrients, environmental control, and organic pest management.',
    startDate: '2025-02-28',
    endDate: '2025-03-01',
    location: 'Green Lab, Barcelona',
    cityName: 'Barcelona',
    clubName: 'Green Revolution CSC',
  },
  {
    id: '6',
    slug: 'cannabis-regulation-forum',
    name: 'European Cannabis Regulation Forum',
    description: 'Join policymakers, industry leaders, and advocates to discuss the future of cannabis regulation across European markets.',
    startDate: '2025-07-08',
    endDate: '2025-07-09',
    location: 'Brussels Expo, Brussels',
    cityName: 'Brussels',
  },
];

export default function EventsPageClient({ lang }: EventsPageClientProps) {
  const [events] = useState<Event[]>(mockEvents);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 500);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-900 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse">
            <div className="h-64 bg-white/5 rounded-3xl mb-12" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-80 bg-white/5 rounded-2xl" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-900 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-pink-500/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <motion.section 
          className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm p-8 md:p-12 mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center">
              <Calendar className="h-5 w-5 text-purple-400" />
            </div>
            <Badge variant="outline" className="border-white/20 text-zinc-400 bg-white/5">
              Community
            </Badge>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6">
            Europe{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-rose-500">
              Events
            </span>
          </h1>
          
          <p className="text-xl text-zinc-400 max-w-3xl leading-relaxed">
            Cultural and industry events connected to the platform&apos;s trust-and-education mission.
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
                className="group block rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 hover:border-purple-500/30 hover:bg-white/[0.07] transition-all duration-500 h-full relative"
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/0 to-pink-500/0 rounded-2xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 -z-10" />
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {event.cityName && (
                    <Badge variant="outline" className="border-white/10 text-zinc-300 bg-white/5">
                      <MapPin className="h-3 w-3 mr-1" /> {event.cityName}
                    </Badge>
                  )}
                  {event.clubName && (
                    <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                      <Star className="h-3 w-3 mr-1" /> {event.clubName}
                    </Badge>
                  )}
                </div>
                
                <h2 className="text-xl font-bold text-white mb-3 group-hover:text-purple-400 transition-colors line-clamp-2">
                  {event.name}
                </h2>
                
                <p className="text-sm text-zinc-400 mb-4 line-clamp-3">
                  {event.description}
                </p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-xs text-zinc-500">
                    <Clock className="h-3 w-3" />
                    <span>{new Date(event.startDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-zinc-500">
                    <MapPin className="h-3 w-3" />
                    <span>{event.location}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <span className="text-xs text-zinc-500 font-medium">View Details</span>
                  <ArrowRight className="h-4 w-4 text-purple-400 group-hover:translate-x-1 transition-transform" />
                </div>

                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full group-hover:w-1/4 transition-all duration-500" />
              </Link>
            </motion.div>
          )) : (
            <div className="col-span-full rounded-2xl border border-dashed border-white/10 p-8 text-center">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8 text-zinc-500" />
              </div>
              <p className="text-zinc-400">No upcoming published events yet.</p>
            </div>
          )}
        </motion.section>
      </div>
    </div>
  );
}
