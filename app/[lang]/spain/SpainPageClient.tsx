'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/useLanguage';
import { MapPin, Building2, ArrowRight, Globe, Cannabis, Star } from '@/lib/icons';
import { Heading, H1, H2, H3, H4, Label, Eyebrow, Text, Lead } from '@/components/typography';

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
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 md:pt-32 pb-12">
        {/* Hero Section */}
        <motion.section 
          className="rounded-3xl border bg-card shadow-lg shadow-primary/5 p-8 md:p-12 mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <Globe className="h-5 w-5 text-primary" />
            </div>
            <Badge variant="outline" className="border-primary/20 text-primary bg-primary/5">
              {t('spain.badge')}
            </Badge>
          </div>
          
          <H1 className="mb-6">
            {t('spain.title_prefix')}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary to-primary/80">
              {t('spain.title_highlight')}
            </span>
          </H1>

          <Lead className="max-w-3xl">
            {t('spain.subtitle')}
          </Lead>

          {/* Stats */}
          <div className="flex items-center gap-8 mt-8 pt-8 border-t border-border">
            <div className="text-center">
              <div className="text-3xl font-black text-foreground">{cities.length}</div>
              <div className="text-sm text-muted-foreground uppercase tracking-wider">{t('spain.stats.cities')}</div>
            </div>
            <div className="w-px h-12 bg-border" />
            <div className="text-center">
              <div className="text-3xl font-black text-primary">100%</div>
              <div className="text-sm text-muted-foreground uppercase tracking-wider">{t('spain.stats.verified')}</div>
            </div>
            <div className="w-px h-12 bg-border" />
            <div className="text-center">
              <div className="text-3xl font-black text-foreground">24/7</div>
              <div className="text-sm text-muted-foreground uppercase tracking-wider">{t('spain.stats.support')}</div>
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
              <Star className="h-5 w-5 text-amber-500" />
            </div>
            <H2>{t('spain.popular_cities')}</H2>
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
                  className="group block relative rounded-2xl border bg-card p-6 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 overflow-hidden"
                >
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                    <MapPin className="h-4 w-4 text-primary" /> 
                    {city.region || city.country}
                  </div>
                  
                  <H3 className="mb-3 group-hover:text-primary transition-colors">
                    {city.name}
                  </H3>
                  
                  <Text variant="muted" size="sm" className="mb-4 line-clamp-2">
                    {city.description || t('spain.city_fallback_description')}
                  </Text>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="inline-flex items-center gap-2 text-muted-foreground bg-muted px-3 py-1.5 rounded-full">
                      <Building2 className="h-4 w-4 text-primary" /> 
                      <span className="font-bold text-foreground">{city.clubCount}</span> {t('spain.clubs')}
                    </span>
                    <span className="inline-flex items-center gap-1 text-primary font-bold group-hover:translate-x-1 transition-transform">
                      {t('spain.explore')} <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>

                  {/* Bottom accent line */}
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-1 bg-primary rounded-full group-hover:w-1/4 transition-all duration-300" />
                </Link>
              </motion.div>
            )) : (
              <div className="col-span-full rounded-2xl border border-dashed border-border p-8 text-center">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-8 w-8 text-muted-foreground" />
                </div>
                <Text variant="muted">{t('spain.empty')}</Text>
              </div>
            )}
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section 
          className="mt-12 rounded-3xl border p-8 bg-gradient-to-br from-muted/50 to-background"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <H3 className="mb-2 flex items-center gap-2">
                <Cannabis className="h-5 w-5 text-primary" />
                {t('spain.cta.title')}
              </H3>
              <Text variant="muted">{t('spain.cta.subtitle')}</Text>
            </div>
            <Button 
              asChild
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-8 py-6 rounded-xl shadow-lg shadow-primary/25 transition-all duration-300"
            >
              <Link href={`/${lang}/clubs`} className="flex items-center gap-2">
                {t('spain.cta.button')} <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
