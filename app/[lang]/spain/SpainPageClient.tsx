'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Building2, ArrowRight, Globe, Cannabis, Star } from 'lucide-react';

interface City {
  id: string;
  slug: string;
  name: string;
  region: string | null;
  country: string;
  description: string | null;
  clubCount: number;
}

interface SpainPageClientProps {
  cities: City[];
  popularCities: City[];
  lang: string;
}

export default function SpainPageClient({ cities, popularCities, lang }: SpainPageClientProps) {
  return (
    <div className="min-h-screen bg-zinc-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-green-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-teal-500/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        {/* Hero Section */}
        <motion.section 
          className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm p-8 md:p-12 mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center">
              <Globe className="h-5 w-5 text-green-400" />
            </div>
            <Badge variant="outline" className="border-white/20 text-zinc-400 bg-white/5">
              Country Hub
            </Badge>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6">
            Cannabis Social Clubs in{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-emerald-400 to-teal-500">
              Spain
            </span>
          </h1>
          
          <p className="text-xl text-zinc-400 max-w-3xl leading-relaxed">
            Explore city-by-city guidance, neighborhood context, and verified club listings. 
            Public pages stay educational; sensitive operational details remain gated.
          </p>

          {/* Stats */}
          <div className="flex items-center gap-8 mt-8 pt-8 border-t border-white/10">
            <div className="text-center">
              <div className="text-3xl font-black text-white">{cities.length}</div>
              <div className="text-sm text-zinc-500 uppercase tracking-wider">Cities</div>
            </div>
            <div className="w-px h-12 bg-white/10" />
            <div className="text-center">
              <div className="text-3xl font-black text-green-400">100%</div>
              <div className="text-sm text-zinc-500 uppercase tracking-wider">Verified</div>
            </div>
            <div className="w-px h-12 bg-white/10" />
            <div className="text-center">
              <div className="text-3xl font-black text-white">24/7</div>
              <div className="text-sm text-zinc-500 uppercase tracking-wider">Support</div>
            </div>
          </div>
        </motion.section>

        {/* Popular Cities Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center">
              <Star className="h-5 w-5 text-amber-400" />
            </div>
            <h2 className="text-2xl font-bold text-white">Popular Cities</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularCities.length > 0 ? popularCities.map((city, index) => (
              <motion.div
                key={city.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link
                  href={`/${lang}/spain/${city.slug}`}
                  className="group block relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 hover:border-green-500/30 hover:bg-white/[0.07] transition-all duration-500 overflow-hidden"
                >
                  {/* Glow effect */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-green-500/0 to-emerald-500/0 rounded-2xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 -z-10" />
                  
                  <div className="flex items-center gap-2 text-sm text-zinc-400 mb-3">
                    <MapPin className="h-4 w-4 text-green-400" /> 
                    {city.region || city.country}
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-green-400 transition-colors">
                    {city.name}
                  </h3>
                  
                  <p className="text-sm text-zinc-400 mb-4 line-clamp-2">
                    {city.description || 'City-level trust and etiquette guidance.'}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="inline-flex items-center gap-2 text-zinc-400 bg-white/5 px-3 py-1.5 rounded-full">
                      <Building2 className="h-4 w-4 text-green-400" /> 
                      <span className="font-bold text-white">{city.clubCount}</span> clubs
                    </span>
                    <span className="inline-flex items-center gap-1 text-green-400 font-bold group-hover:translate-x-1 transition-transform">
                      Explore <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>

                  {/* Bottom accent line */}
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full group-hover:w-1/4 transition-all duration-500" />
                </Link>
              </motion.div>
            )) : (
              <div className="col-span-full rounded-2xl border border-dashed border-white/10 p-8 text-center">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-8 w-8 text-zinc-500" />
                </div>
                <p className="text-zinc-400">No cities are available yet. Publish city records to activate this hub.</p>
              </div>
            )}
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section 
          className="mt-12 rounded-3xl border border-white/10 p-8 bg-gradient-to-br from-white/5 to-transparent"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                <Cannabis className="h-5 w-5 text-green-400" />
                Need broad comparison first?
              </h3>
              <p className="text-zinc-400">Use the full directory to compare verified clubs across cities.</p>
            </div>
            <Button 
              asChild
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white font-bold px-8 py-6 rounded-xl shadow-lg shadow-green-500/25 transition-all duration-300"
            >
              <Link href={`/${lang}/clubs`} className="flex items-center gap-2">
                Open Full Directory <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
