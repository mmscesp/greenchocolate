'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import ClubCard from '@/components/ClubCard';
import FilterBar from '@/components/FilterBar';
import { useLanguage } from '@/hooks/useLanguage';
import { Map, List, Grid, Sparkles, Cannabis } from 'lucide-react';
import { getClubs, ClubCard as ClubCardType } from '@/app/actions/clubs';
import { FilterOptions } from '@/lib/types';
import { CollectionPageStructuredData } from '@/components/StructuredData';

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
    <div className="min-h-screen bg-zinc-900 relative overflow-hidden">
      {/* JSON-LD Structured Data */}
      <CollectionPageStructuredData
        schema={{
          name: t('clubs.title'),
          description: t('clubs.subtitle'),
          url: `https://socialclubsmaps.com/${language}/clubs`,
          numberOfItems: clubs.length,
        }}
      />

      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Ambient glows */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-green-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-teal-500/5 rounded-full blur-3xl" />
        
        {/* Dot pattern */}
        <div className="absolute inset-0 opacity-10" style={{ 
          backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.03) 1px, transparent 0)', 
          backgroundSize: '40px 40px' 
        }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        {/* Hero Header */}
        <motion.div 
          className="mb-12 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Eyebrow Badge */}
          <motion.div 
            className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 rounded-full text-green-400 mb-6 border border-green-500/20"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Cannabis className="h-4 w-4" />
            <span className="text-sm font-bold uppercase tracking-wider">{t('clubs.verified_directory') || 'Verified Directory'}</span>
          </motion.div>

          {/* Main Title */}
          <motion.h1 
            className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Discover{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-emerald-400 to-teal-500">
              Premium Clubs
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p 
            className="text-xl md:text-2xl text-zinc-400 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            {t('clubs.subtitle')}
          </motion.p>

          {/* Stats */}
          <motion.div 
            className="flex items-center justify-center gap-8 mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="text-center">
              <div className="text-3xl font-black text-white">{clubs.length}+</div>
              <div className="text-sm text-zinc-500 uppercase tracking-wider">{t('clubs.clubs_count') || 'Clubs'}</div>
            </div>
            <div className="w-px h-12 bg-white/10" />
            <div className="text-center">
              <div className="text-3xl font-black text-green-400">100%</div>
              <div className="text-sm text-zinc-500 uppercase tracking-wider">{t('clubs.verified') || 'Verified'}</div>
            </div>
            <div className="w-px h-12 bg-white/10" />
            <div className="text-center">
              <div className="text-3xl font-black text-white">{neighborhoods.length}</div>
              <div className="text-sm text-zinc-500 uppercase tracking-wider">{t('clubs.neighborhoods') || 'Areas'}</div>
            </div>
          </motion.div>
        </motion.div>

        {/* View Mode Toggle & Filter Bar Container */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          {/* View Mode Toggle */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-6 py-3 flex items-center gap-2 text-sm font-bold rounded-xl transition-all duration-300 ${
                  viewMode === 'grid'
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/25'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Grid className="h-4 w-4" />
                {t('clubs.view_mode.list')}
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`px-6 py-3 flex items-center gap-2 text-sm font-bold rounded-xl transition-all duration-300 ${
                  viewMode === 'map'
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/25'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Map className="h-4 w-4" />
                {t('clubs.view_mode.map')}
              </button>
            </div>
          </div>

          {/* Filter Bar */}
          <FilterBar 
            filters={filters} 
            onFiltersChange={handleFiltersChange}
            totalResults={clubs.length}
            neighborhoods={neighborhoods}
            amenities={amenities}
            vibes={vibes}
          />
        </motion.div>

        {/* Content */}
        {viewMode === 'grid' ? (
          <div>
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <motion.div 
                    key={i} 
                    className="bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 h-[500px]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <div className="h-64 bg-white/5 animate-pulse rounded-t-3xl" />
                    <div className="p-6 space-y-4">
                      <div className="h-6 bg-white/5 animate-pulse rounded-lg w-3/4" />
                      <div className="h-4 bg-white/5 animate-pulse rounded-lg w-1/2" />
                      <div className="h-20 bg-white/5 animate-pulse rounded-lg" />
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : clubs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {clubs.map((club, index) => (
                  <motion.div
                    key={club.id}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                  >
                    <ClubCard club={club} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div 
                className="text-center py-20"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-12 max-w-lg mx-auto border border-white/10">
                  <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                    <List className="h-10 w-10 text-zinc-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">
                    {t('clubs.no_results.title')}
                  </h3>
                  <p className="text-zinc-400 mb-6">
                    {t('clubs.no_results.subtitle')}
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => handleFiltersChange({
                      neighborhood: '',
                      amenities: [],
                      vibes: [],
                      isVerified: false,
                      priceRange: [],
                      rating: 0
                    })}
                    className="border-white/20 text-white hover:bg-white/10 rounded-full px-8"
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    {t('clubs.clear_filters')}
                  </Button>
                </div>
              </motion.div>
            )}
          </div>
        ) : (
          <motion.div 
            className="bg-white/5 backdrop-blur-sm rounded-3xl p-12 text-center border border-white/10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="w-24 h-24 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Map className="h-12 w-12 text-green-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">
              {t('clubs.view_mode.map')}
            </h3>
            <p className="text-zinc-400 max-w-md mx-auto">
              {t('clubs.map.coming_soon')}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
