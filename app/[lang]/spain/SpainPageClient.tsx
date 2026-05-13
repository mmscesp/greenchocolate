'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/useLanguage';
import { MapPin, Building2, ArrowRight, Globe, ShieldCheck, Star } from '@/lib/icons';
import { H1, H2, H3, Text, Lead } from '@/components/typography';

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
  const primaryCity = popularCities.find((city) => city.slug === 'barcelona') ?? popularCities[0];

  return (
    <div className="relative min-h-screen overflow-hidden bg-bg-base text-foreground">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_12%,rgba(0,205,200,0.14),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.035),transparent_34%)]" />
      <div className="container-public relative z-10 pt-24 pb-16 md:pt-32 md:pb-24">
        {/* Hero Section */}
        <motion.section 
          className="border-b border-white/10 pb-12 md:pb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-end">
            <div>
              <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-brand/25 bg-brand/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.28em] text-brand">
                <Globe className="h-4 w-4" />
                {t('spain.badge')}
              </div>

              <H1 className="mb-6 max-w-5xl text-5xl leading-[0.95] tracking-normal md:text-7xl lg:text-8xl">
                {t('spain.title_prefix')}{' '}
                <span className="text-brand">{t('spain.title_highlight')}</span>
              </H1>

              <Lead className="max-w-3xl text-zinc-300">
                {t('spain.subtitle')}
              </Lead>
            </div>

            {primaryCity ? (
              <div className="border border-white/10 bg-bg-surface/90 p-6">
                <div className="mb-6 flex items-center justify-between gap-4 text-[11px] font-bold uppercase tracking-[0.2em] text-brand">
                  <span>{t('spain.popular_cities')}</span>
                  <span>{cities.length} {t('spain.stats.cities')}</span>
                </div>
                <H3 className="mb-3 text-white">{primaryCity.name}</H3>
                <Text variant="muted" size="sm" className="mb-6 line-clamp-4">
                  {primaryCity.description || t('spain.city_fallback_description')}
                </Text>
                <Button asChild className="h-11 rounded-full bg-brand px-5 font-bold text-bg-base hover:bg-brand-dark">
                  <Link href={`/${lang}/spain/${primaryCity.slug}`} className="flex items-center gap-2">
                    {t('spain.explore')} <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            ) : null}
          </div>
        </motion.section>

        {/* Popular Cities Section */}
        <motion.section
          className="py-14 md:py-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center border border-brand/20 bg-brand/10 text-brand">
              <Star className="h-5 w-5 text-brand" />
              </div>
              <H2>{t('spain.popular_cities')}</H2>
            </div>
            <Text variant="muted" className="max-w-md md:text-right">
              {t('spain.subtitle')}
            </Text>
          </div>
          
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {popularCities.length > 0 ? popularCities.map((city, index) => (
              <motion.div
                key={city.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link
                  href={`/${lang}/spain/${city.slug}`}
                  className="group relative block min-h-[18rem] overflow-hidden border border-white/10 bg-bg-surface/90 p-6 transition duration-300 hover:border-brand/30 hover:bg-[#07171b]"
                >
                  <div className="mb-8 flex items-center justify-between gap-4 text-xs font-bold uppercase tracking-[0.18em] text-zinc-500">
                    <span className="inline-flex min-w-0 items-center gap-2">
                      <MapPin className="h-4 w-4 shrink-0 text-brand" />
                      <span className="truncate">{city.region || city.country}</span>
                    </span>
                    <ArrowRight className="h-4 w-4 shrink-0 text-zinc-600 transition group-hover:translate-x-1 group-hover:text-brand" />
                  </div>
                  
                  <H3 className="mb-4 transition-colors group-hover:text-brand">
                    {city.name}
                  </H3>
                  
                  <Text variant="muted" size="sm" className="line-clamp-3">
                    {city.description || t('spain.city_fallback_description')}
                  </Text>
                  
                  <div className="absolute inset-x-6 bottom-6 flex items-center justify-between gap-4 border-t border-white/10 pt-4 text-sm">
                    <span className="inline-flex items-center gap-2 text-zinc-400">
                      <Building2 className="h-4 w-4 text-brand" />
                      <span><span className="font-bold text-white">{city.clubCount}</span> {t('spain.clubs')}</span>
                    </span>
                    <span className="text-xs font-bold uppercase tracking-[0.16em] text-brand">
                      {t('spain.explore')}
                    </span>
                  </div>
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
          className="border-t border-white/10 pt-10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="grid gap-6 border border-white/10 bg-bg-surface/70 p-6 md:grid-cols-[1fr_auto] md:items-center md:p-8">
            <div className="flex gap-4">
              <div className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center border border-brand/20 bg-brand/10 text-brand">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
              <H3 className="mb-2">
                {t('spain.cta.title')}
              </H3>
              <Text variant="muted">{t('spain.cta.subtitle')}</Text>
              </div>
            </div>
            <Button 
              asChild
              className="h-12 rounded-full bg-brand px-6 font-bold text-bg-base hover:bg-brand-dark md:px-8"
            >
              <Link href={`/${lang}/spain/barcelona/clubs`} className="flex items-center gap-2">
                {t('spain.cta.button')} <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
