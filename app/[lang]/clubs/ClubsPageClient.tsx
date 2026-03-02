'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import ClubCard from '@/components/ClubCard';
import FilterBar from '@/components/FilterBar';
import { useLanguage } from '@/hooks/useLanguage';
import { Map, List, Grid, Sparkles, Cannabis, Search, SlidersHorizontal, ArrowRight, ShieldCheck, Zap } from '@/lib/icons';
import { getClubs, ClubCard as ClubCardType } from '@/app/actions/clubs';
import { FilterOptions } from '@/lib/types';
import { CollectionPageStructuredData } from '@/components/StructuredData';
import { Heading, H1, H2, H3, H4, Label, Eyebrow, Text, Lead } from '@/components/typography';

// Editorial Concierge Components
import { EditorialHeading } from '@/components/landing/editorial-concierge/typography/EditorialHeading';
import { ConciergeLabel } from '@/components/landing/editorial-concierge/typography/ConciergeLabel';
import { SectionWrapper } from '@/components/landing/editorial-concierge/layout/SectionWrapper';
import { PulsingStatusDot } from '@/components/landing/editorial-concierge/interactive/PulsingStatusDot';
import { FADE_UP, STAGGER_CONTAINER, PREMIUM_SPRING } from '@/components/landing/editorial-concierge/motion/config';

interface ClubsPageClientProps {
  initialClubs: ClubCardType[];
  neighborhoods: string[];
  amenities: string[];
  vibes: string[];
}

export default function ClubsPageClient({ 
  initialClubs, 
  neighborhoods, 
  amenities, 
  vibes 
}: ClubsPageClientProps) {
  const { t, language } = useLanguage();
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
      setClubs(result);
    } catch (error) {
      console.error('Error fetching clubs:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-black font-sans selection:bg-[#E8A838]/30 selection:text-white">
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
      <SectionWrapper dark className="pt-32 pb-24 relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#E8A838]/5 rounded-full blur-[120px] -translate-y-1/2" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-white/5 rounded-full blur-[100px] translate-y-1/2" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div 
            variants={STAGGER_CONTAINER}
            initial="initial"
            animate="animate"
            className="text-center"
          >
            {/* Eyebrow */}
            <motion.div variants={FADE_UP} className="flex justify-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#E8A838]/10 border border-[#E8A838]/20 rounded-full">
                <PulsingStatusDot />
                <ConciergeLabel size="xs" className="text-[#E8A838]">
                  {t('clubs.verified_directory')}
                </ConciergeLabel>
              </div>
            </motion.div>

            {/* Main Title */}
            <motion.div variants={FADE_UP}>
              <EditorialHeading as="h1" size="hero" className="text-white mb-8">
                {t('clubs.hero.title_prefix')} <span className="text-[#E8A838] italic">{t('clubs.hero.title_highlight')}</span> {t('clubs.hero.title_suffix')}
              </EditorialHeading>
            </motion.div>

            {/* Subtitle */}
            <motion.div variants={FADE_UP}>
              <p className="text-zinc-400 text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed font-serif">
                {t('clubs.subtitle')}
              </p>
            </motion.div>

            {/* Quick Stats Grid */}
            <motion.div 
              variants={FADE_UP}
              className="grid grid-cols-2 md:grid-cols-3 gap-8 mt-16 max-w-4xl mx-auto border-t border-white/5 pt-16"
            >
              <div>
                <div className="text-4xl md:text-5xl font-serif text-white mb-2">{clubs.length}+</div>
                <ConciergeLabel size="xs" emphasis="low" className="uppercase tracking-[0.2em]">
                  {t('clubs.clubs_count')}
                </ConciergeLabel>
              </div>
              <div className="hidden md:block">
                <div className="text-4xl md:text-5xl font-serif text-[#E8A838] mb-2">100%</div>
                <ConciergeLabel size="xs" emphasis="low" className="uppercase tracking-[0.2em]">
                  {t('clubs.verified')}
                </ConciergeLabel>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-serif text-white mb-2">{neighborhoods.length}</div>
                <ConciergeLabel size="xs" emphasis="low" className="uppercase tracking-[0.2em]">
                  {t('clubs.neighborhoods')}
                </ConciergeLabel>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </SectionWrapper>

      <section className="relative bg-black py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
            {/* Left Column: Filter Sidebar */}
            <div className="lg:w-80 flex-shrink-0">
              <div className="sticky top-24 space-y-8">
                <div className="bg-[#0A0A0A] rounded-[2rem] p-6 sm:p-8 border border-white/5 shadow-2xl">
                  <div className="mb-8">
                    <EditorialHeading size="sm" className="text-white uppercase tracking-widest border-b border-white/5 pb-4 mb-8">{t('filters.advanced')}</EditorialHeading>
                  </div>
                  
                  <FilterBar 
                    filters={filters} 
                    onFiltersChange={handleFiltersChange}
                    totalResults={clubs.length}
                    neighborhoods={neighborhoods}
                    amenities={amenities}
                    vibes={vibes}
                  />
                </div>

                <div className="bg-[#111] rounded-[2rem] p-6 sm:p-8 text-white relative overflow-hidden border border-white/5">
                  <div className="relative z-10">
                    <ConciergeLabel size="xs" className="text-[#E8A838] mb-4 block">{t('clubs.sidebar.concierge_tip')}</ConciergeLabel>
                    <p className="text-zinc-400 text-sm leading-relaxed mb-6 font-serif italic">
                      {t('clubs.sidebar.concierge_quote')}
                    </p>
                    <Link href={`/${language}/guide/verification`} className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white hover:text-[#E8A838] transition-colors">
                      {t('clubs.sidebar.learn_standard')} <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                  <ShieldCheck className="absolute -bottom-4 -right-4 h-32 w-32 text-white/5" />
                </div>
              </div>
            </div>

            {/* Right Column: Grid and Results */}
            <div className="flex-1">
              {/* View Toggle */}
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
                <div className="flex flex-wrap items-center gap-3">
                  <button 
                    type="button"
                    onClick={() => setViewMode('grid')}
                    className={`inline-flex min-h-11 items-center gap-2 px-5 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${
                      viewMode === 'grid' ? 'bg-[#E8A838] text-black shadow-lg shadow-[#E8A838]/20' : 'text-zinc-500 hover:bg-white/5'
                    }`}
                  >
                    <Grid className="h-4 w-4" /> {t('clubs.view_mode.grid')}
                  </button>
                  <button
                    type="button"
                    disabled
                    aria-disabled="true"
                    title={t('clubs.view_mode.map_dev_title')}
                    className="inline-flex min-h-11 items-center gap-2 px-5 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest text-zinc-600 bg-white/5 cursor-not-allowed border border-white/5"
                  >
                    <Map className="h-4 w-4" /> {t('clubs.view_mode.map_soon')}
                  </button>
                </div>
                
                <AnimatePresence>
                  {loading && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2 text-[#E8A838] text-[10px] font-bold uppercase tracking-widest"
                    >
                      <Zap className="h-3 w-3 animate-pulse" /> {t('clubs.status.updating_directory')}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Clubs Content */}
              {viewMode === 'grid' ? (
                <div>
                  {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {[1, 2, 3, 4].map(i => (
                        <div key={i} className="bg-[#0A0A0A] rounded-[2rem] border border-white/5 h-[450px] animate-pulse overflow-hidden">
                          <div className="h-64 bg-[#111]" />
                          <div className="p-8 space-y-4">
                            <div className="h-8 bg-[#111] rounded-lg w-3/4" />
                            <div className="h-4 bg-[#111] rounded-lg w-1/2" />
                            <div className="h-12 bg-[#111] rounded-lg" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : clubs.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {clubs.map((club, index) => (
                        <motion.div
                          key={club.id}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: (index % 2) * 0.1, duration: 0.5, ease: PREMIUM_SPRING.ease }}
                        >
                          <ClubCard club={club} />
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-[#0A0A0A] rounded-[2rem] border border-white/5 p-8 sm:p-12 lg:p-20 text-center">
                      <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8 border border-white/5">
                        <Search className="h-8 w-8 text-zinc-700" />
                      </div>
                      <EditorialHeading size="sm" className="mb-4 text-white">{t('clubs.no_results.title')}</EditorialHeading>
                      <p className="text-zinc-500 mb-8 max-w-sm mx-auto font-serif italic">
                        {t('clubs.no_results.subtitle')}
                      </p>
                      <button 
                        type="button"
                        onClick={() => handleFiltersChange({
                          neighborhood: '',
                          amenities: [],
                          vibes: [],
                          isVerified: false,
                          priceRange: [],
                          rating: 0
                        })}
                        className="rounded-full min-h-11 px-8 sm:px-12 py-3 sm:py-6 font-bold uppercase tracking-[0.2em] text-[10px] border-[#E8A838]/30 text-[#E8A838] hover:bg-[#E8A838] hover:text-black transition-all"
                      >
                        {t('clubs.clear_filters')}
                      </button>
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
