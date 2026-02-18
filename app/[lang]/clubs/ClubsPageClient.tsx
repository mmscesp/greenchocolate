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
    <div className="min-h-screen bg-background">
      {/* JSON-LD Structured Data */}
      <CollectionPageStructuredData
        schema={{
          name: t('clubs.title'),
          description: t('clubs.subtitle'),
          url: `https://socialclubsmaps.com/${language}/clubs`,
          numberOfItems: clubs.length,
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Header */}
        <motion.div 
          className="mb-12 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Eyebrow Badge */}
          <motion.div 
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary mb-6 border border-primary/20"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Cannabis className="h-4 w-4" />
            <span className="text-sm font-bold uppercase tracking-wider">{t('clubs.verified_directory') || 'Verified Directory'}</span>
          </motion.div>

          {/* Main Title */}
          <motion.h1 
            className="text-4xl md:text-6xl lg:text-7xl font-black text-foreground mb-6 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Discover{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/80">
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
              <div className="text-3xl font-black text-foreground">{clubs.length}+</div>
              <div className="text-sm text-muted-foreground uppercase tracking-wider">{t('clubs.clubs_count') || 'Clubs'}</div>
            </div>
            <div className="w-px h-12 bg-border" />
            <div className="text-center">
              <div className="text-3xl font-black text-primary">100%</div>
              <div className="text-sm text-muted-foreground uppercase tracking-wider">{t('clubs.verified') || 'Verified'}</div>
            </div>
            <div className="w-px h-12 bg-border" />
            <div className="text-center">
              <div className="text-3xl font-black text-foreground">{neighborhoods.length}</div>
              <div className="text-sm text-muted-foreground uppercase tracking-wider">{t('clubs.neighborhoods') || 'Areas'}</div>
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
            <div className="inline-flex bg-muted rounded-2xl border p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-6 py-3 flex items-center gap-2 text-sm font-bold rounded-xl transition-all duration-300 ${
                  viewMode === 'grid'
                    ? 'bg-primary text-primary-foreground shadow-lg'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <Grid className="h-4 w-4" />
                {t('clubs.view_mode.list')}
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`px-6 py-3 flex items-center gap-2 text-sm font-bold rounded-xl transition-all duration-300 ${
                  viewMode === 'map'
                    ? 'bg-primary text-primary-foreground shadow-lg'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
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
                    className="bg-card rounded-3xl border h-[500px]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <div className="h-64 bg-muted animate-pulse rounded-t-3xl" />
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
                <div className="bg-muted rounded-3xl p-12 max-w-lg mx-auto border">
                  <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                    <List className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-3">
                    {t('clubs.no_results.title')}
                  </h3>
                  <p className="text-muted-foreground mb-6">
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
                    className="border-border text-foreground hover:bg-muted rounded-full px-8"
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
            className="bg-muted rounded-3xl p-12 text-center border"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Map className="h-12 w-12 text-primary" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-3">
              {t('clubs.view_mode.map')}
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              {t('clubs.map.coming_soon')}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
