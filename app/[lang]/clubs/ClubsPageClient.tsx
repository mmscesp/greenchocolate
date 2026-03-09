'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import ClubCard from '@/components/ClubCard';
import FilterBar from '@/components/FilterBar';
import { useLanguage } from '@/hooks/useLanguage';
import { Map, Grid, Search, Zap, ShieldCheck, ArrowRight } from '@/lib/icons';
import { getClubs, ClubCard as ClubCardType } from '@/app/actions/clubs';
import { FilterOptions } from '@/lib/types';
import { CollectionPageStructuredData } from '@/components/StructuredData';

// Editorial Concierge Components
import { EditorialHeading } from '@/components/landing/editorial-concierge/typography/EditorialHeading';
import { ConciergeLabel } from '@/components/landing/editorial-concierge/typography/ConciergeLabel';
import { SectionWrapper } from '@/components/landing/editorial-concierge/layout/SectionWrapper';
import { PulsingStatusDot } from '@/components/landing/editorial-concierge/interactive/PulsingStatusDot';
import { FADE_UP, STAGGER_CONTAINER, PREMIUM_SPRING } from '@/components/landing/editorial-concierge/motion/config';
import { cn } from '@/lib/utils';

interface ClubsPageClientProps {
  initialClubs: ClubCardType[];
  neighborhoods: string[];
  amenities: string[];
  vibes: string[];
}

const LIVE_CLUB_SLUGS = new Set(['club-311-barcelona']);

export default function ClubsPageClient({ 
  initialClubs, 
  neighborhoods, 
  amenities, 
  vibes 
}: ClubsPageClientProps) {
  const { t, language } = useLanguage();
  const shouldReduceMotion = useReducedMotion();
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [clubs, setClubs] = useState<ClubCardType[]>(initialClubs);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    neighborhood: '',
    amenities: [],
    vibes: [],
    isVerified: false,
    priceRange: [],
    rating: 0
  });

  // Fetch clubs when filters change
  const handleFiltersChange = useCallback(async (newFilters: FilterOptions) => {
    setFilters(newFilters);
    setLoading(true);
    try {
      const result = await getClubs({
        neighborhood: newFilters.neighborhood || undefined,
        amenities: newFilters.amenities.length > 0 ? newFilters.amenities : undefined,
        vibes: newFilters.vibes.length > 0 ? newFilters.vibes : undefined,
        priceRange: newFilters.priceRange.length > 0 ? newFilters.priceRange : undefined,
        isVerified: newFilters.isVerified ? true : undefined,
      });
      setClubs(result.filter((club) => LIVE_CLUB_SLUGS.has(club.slug)));
    } catch (error) {
      console.error('Error fetching clubs:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-bg-base font-sans selection:bg-brand/30 selection:text-white">
      {/* JSON-LD Structured Data */}
      <CollectionPageStructuredData
        schema={{
          name: t('clubs.title'),
          description: t('clubs.subtitle'),
          url: `https://socialclubsmaps.com/${language}/clubs`,
          numberOfItems: clubs.length,
        }}
      />

      {/* Hero Header */}
      <SectionWrapper dark className="pt-24 pb-16 sm:pt-32 sm:pb-20 relative overflow-hidden bg-bg-base backdrop-blur-none">
        {/* Background Gradients */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-1/4 w-[400px] h-[400px] sm:w-[600px] sm:h-[600px] bg-brand/5 rounded-full blur-[100px] sm:blur-[140px] -translate-y-1/2 animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] bg-white/[0.02] rounded-full blur-[80px] sm:blur-[120px] translate-y-1/2" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div 
            variants={STAGGER_CONTAINER}
            initial="initial"
            animate="animate"
            className="text-center"
          >
            {/* Eyebrow */}
            <motion.div variants={FADE_UP} className="flex justify-center mb-6 sm:mb-10">
              <div className="inline-flex items-center gap-2 sm:gap-3 px-4 py-2 sm:px-6 sm:py-2.5 bg-brand/10 border border-brand/20 rounded-full backdrop-blur-md">
                <PulsingStatusDot />
                <ConciergeLabel size="xs" className="text-brand tracking-[0.2em] sm:tracking-[0.3em] sm:text-sm">
                  {t('clubs.verified_directory')}
                </ConciergeLabel>
              </div>
            </motion.div>

            {/* Main Title */}
            <motion.div variants={FADE_UP}>
              <EditorialHeading as="h1" size="hero" className="text-white mb-6 sm:mb-10">
                {t('clubs.hero.title_prefix')} <span className="text-brand italic font-serif">{t('clubs.hero.title_highlight')}</span> {t('clubs.hero.title_suffix')}
              </EditorialHeading>
            </motion.div>

            {/* Subtitle */}
            <motion.div variants={FADE_UP}>
              <p className="text-zinc-400 text-lg md:text-2xl max-w-3xl mx-auto leading-relaxed font-serif italic px-2 sm:px-0">
                "{t('clubs.subtitle')}"
              </p>
            </motion.div>
          </motion.div>
        </div>
      </SectionWrapper>

      <section className="relative bg-bg-base pb-32 sm:pb-40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          
          {/* Filter Bar - Sticky on Desktop */}
          <div className="mb-10 sm:mb-16">
            <FilterBar 
              filters={filters} 
              onFiltersChange={handleFiltersChange}
              totalResults={clubs.length}
              neighborhoods={neighborhoods}
              amenities={amenities}
              vibes={vibes}
            />
          </div>

          {/* Concierge Tip Banner */}
          <motion.div 
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
            whileInView={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            className="mb-12 sm:mb-20 glass-liquid rounded-[1.5rem] sm:rounded-[2.5rem] p-6 sm:p-10 flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-10 relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-brand/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
            <div className="flex items-center gap-6 sm:gap-10 relative z-10">
              <div className="hidden md:flex w-16 h-16 sm:w-20 sm:h-20 rounded-[1.5rem] sm:rounded-[2rem] bg-brand/10 items-center justify-center border border-brand/20 text-brand transform rotate-6 group-hover:rotate-0 transition-all duration-700 shadow-2xl shadow-brand/10">
                <ShieldCheck className="h-8 w-8 sm:h-10 sm:w-10" />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-2 sm:mb-4">
                  <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-brand animate-pulse shadow-[0_0_10px_hsl(var(--brand))]" />
                  <ConciergeLabel size="xs" className="text-brand tracking-[0.2em] sm:tracking-[0.3em] sm:text-sm">{t('clubs.sidebar.concierge_tip')}</ConciergeLabel>
                </div>
                <p className="text-zinc-200 text-base sm:text-xl leading-relaxed font-serif italic max-w-2xl">
                  "{t('clubs.sidebar.concierge_quote')}"
                </p>
              </div>
            </div>
            <Link 
              href={`/${language}/mission#verification-standard`} 
              className="relative z-10 flex w-full items-center justify-center gap-3 bg-white/5 px-6 py-4 text-center text-[11px] font-black uppercase tracking-[0.2em] text-white transition-all hover:border-brand hover:bg-brand hover:text-black sm:gap-4 sm:px-10 sm:py-5 sm:text-[12px] sm:tracking-[0.3em] sm:whitespace-nowrap lg:w-auto rounded-full border border-white/10 shadow-2xl"
            >
              {t('clubs.sidebar.learn_standard')} <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 transition-transform group-hover:translate-x-2" />
            </Link>
          </motion.div>

          {/* View Toggle & Status */}
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between mb-10 sm:mb-16 px-2">
            <div className="flex items-center p-1.5 glass-liquid rounded-full w-full sm:w-fit border-white/5 overflow-hidden">
              <Button
                type="button"
                variant={viewMode === 'grid' ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="h-10 flex-1 rounded-full px-6 sm:h-12 sm:flex-none sm:px-10"
              >
                <Grid className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> {t('clubs.view_mode.grid')}
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                disabled
                className="h-10 flex-1 rounded-full px-6 sm:h-12 sm:flex-none sm:px-10"
              >
                <Map className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> {t('clubs.view_mode.map_soon')}
              </Button>
            </div>
            
            <AnimatePresence>
              {loading && (
                // [motion]
                <motion.div 
                  initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95 }}
                  animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
                  exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                  className="flex items-center justify-center gap-3 sm:gap-4 text-brand bg-brand/10 px-6 py-3 sm:px-8 sm:py-4 rounded-full border border-brand/20 shadow-2xl shadow-brand/5 w-full sm:w-auto"
                >
                  <Zap className="h-4 w-4 sm:h-5 sm:w-5 animate-pulse fill-current" />
                  <span className="text-[10px] sm:text-[12px] font-black uppercase tracking-[0.2em] sm:tracking-[0.3em]">{t('clubs.status.updating_directory')}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Clubs Content */}
          {viewMode === 'grid' ? (
            <div>
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                  {[1, 2, 3, 4, 5, 6].map(i => (
                    <div key={i} className="bg-bg-base rounded-[2rem] border border-white/5 min-h-[350px] sm:min-h-[400px] animate-pulse overflow-hidden">
                      <div className="h-56 sm:h-64 bg-bg-surface/60" />
                      <div className="p-6 sm:p-8 space-y-4">
                        <div className="h-6 sm:h-8 bg-bg-surface/60 rounded-lg w-3/4" />
                        <div className="h-3 sm:h-4 bg-bg-surface/60 rounded-lg w-1/2" />
                        <div className="h-10 sm:h-12 bg-bg-surface/60 rounded-lg" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : clubs.length > 0 ? (
                // [motion]
                <motion.div
                  variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
                >
                  {clubs.map((club, index) => (
                    // [motion]
                    <motion.div
                      key={club.id}
                      variants={{
                        hidden: shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 16 },
                        show: {
                          opacity: 1,
                          y: 0,
                          transition: { duration: 0.45, ease: 'easeOut', delay: (index % 3) * 0.02 },
                        },
                      }}
                    >
                      <ClubCard club={club} />
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <div className="bg-bg-base rounded-[2rem] sm:rounded-[3rem] border border-white/5 p-8 sm:p-20 text-center max-w-4xl mx-auto">
                  <div className="w-16 h-16 sm:w-24 sm:h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 sm:mb-8 border border-white/5">
                    <Search className="h-8 w-8 sm:h-10 sm:w-10 text-zinc-700" />
                  </div>
                  <EditorialHeading size="md" className="mb-4 text-white text-xl sm:text-2xl">{t('clubs.no_results.title')}</EditorialHeading>
                  <p className="text-zinc-500 mb-8 sm:mb-10 max-w-sm mx-auto font-serif italic text-base sm:text-lg">
                    {t('clubs.no_results.subtitle')}
                  </p>
                  <Button
                    type="button"
                    variant="secondary"
                    size="lg"
                    onClick={() => handleFiltersChange({
                      neighborhood: '',
                      amenities: [],
                      vibes: [],
                      isVerified: false,
                      priceRange: [],
                      rating: 0
                    })}
                    className="min-h-12 rounded-full px-8 text-[10px] sm:min-h-14 sm:px-12"
                  >
                    {t('clubs.clear_filters')}
                  </Button>
                </div>
              )}
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}
