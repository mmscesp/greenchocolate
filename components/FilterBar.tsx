'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { FilterOptions } from '@/lib/types';
import { useLanguage } from '@/hooks/useLanguage';
import {
  Filter,
  X,
  MapPin,
  Star,
  DollarSign,
  CheckCircle,
  Sparkles,
  Search,
  SlidersHorizontal,
  Cannabis,
  Shield,
  Zap
} from 'lucide-react';

interface FilterBarProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  totalResults: number;
  neighborhoods: string[];
  amenities: string[];
  vibes: string[];
}

export default function FilterBar({ 
  filters, 
  onFiltersChange, 
  totalResults,
  neighborhoods = [],
  amenities = [],
  vibes = []
}: FilterBarProps) {
  const { t } = useLanguage();
  const [showFilters, setShowFilters] = useState(false);

  const updateFilter = (key: keyof FilterOptions, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const toggleArrayFilter = (key: 'amenities' | 'vibes' | 'priceRange', value: string) => {
    const currentArray = filters[key] as string[];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    updateFilter(key, newArray);
  };

  const clearAllFilters = () => {
    onFiltersChange({
      neighborhood: '',
      amenities: [],
      vibes: [],
      isVerified: false,
      priceRange: [],
      rating: 0
    });
  };

  const hasActiveFilters = filters.neighborhood || 
    filters.amenities.length > 0 || 
    filters.vibes.length > 0 || 
    filters.isVerified || 
    filters.priceRange.length > 0 || 
    filters.rating > 0;

  const activeFilterCount = [
    filters.neighborhood ? 1 : 0,
    filters.amenities.length,
    filters.vibes.length,
    filters.isVerified ? 1 : 0,
    filters.priceRange.length,
    filters.rating > 0 ? 1 : 0
  ].reduce((a, b) => a + b, 0);

  return (
    <motion.div
      className="bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 p-6 mb-8 hover:border-white/20 transition-all duration-500"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <motion.button
            onClick={() => setShowFilters(!showFilters)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
              showFilters
                ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/25'
                : 'bg-white/5 text-zinc-300 border border-white/10 hover:bg-white/10 hover:text-white'
            }`}
          >
            <SlidersHorizontal className="h-4 w-4" />
            {t('filters.advanced')}
            {hasActiveFilters && (
              <span className="ml-2 px-2 py-0.5 bg-white/20 rounded-full text-xs">
                {activeFilterCount}
              </span>
            )}
          </motion.button>

          <div className="flex items-center gap-2 text-zinc-400">
            <div className="w-8 h-8 bg-green-500/10 rounded-lg flex items-center justify-center">
              <Search className="h-4 w-4 text-green-400" />
            </div>
            <span className="font-medium">
              <span className="text-white font-bold">{totalResults}</span> {t('filters.results_found')}
            </span>
          </div>
        </div>

        <AnimatePresence>
          {hasActiveFilters && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={clearAllFilters}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 rounded-xl transition-all duration-300 border border-red-500/30"
            >
              <X className="h-4 w-4" />
              {t('filters.clear')}
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Active Filters Display */}
      <AnimatePresence>
        {hasActiveFilters && (
          <motion.div
            className="flex flex-wrap gap-2 mb-6 p-4 bg-green-500/5 rounded-2xl border border-green-500/20"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <span className="text-sm font-bold text-green-400 mr-2 flex items-center gap-1">
              <Zap className="h-3 w-3" />
              {t('filters.active')}
            </span>

            {filters.neighborhood && (
              <motion.button
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                onClick={() => updateFilter('neighborhood', '')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500/20 text-green-400 rounded-full text-sm font-medium border border-green-500/30 hover:bg-green-500/30 transition-colors"
              >
                <MapPin className="h-3 w-3" />
                {filters.neighborhood}
                <X className="h-3 w-3 ml-1 hover:scale-110 transition-transform" />
              </motion.button>
            )}

            {filters.amenities.map(amenity => (
              <motion.button
                key={amenity}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                onClick={() => toggleArrayFilter('amenities', amenity)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/20 text-blue-400 rounded-full text-sm font-medium border border-blue-500/30 hover:bg-blue-500/30 transition-colors"
              >
                <Sparkles className="h-3 w-3" />
                {amenity}
                <X className="h-3 w-3 ml-1 hover:scale-110 transition-transform" />
              </motion.button>
            ))}

            {filters.vibes.map(vibe => (
              <motion.button
                key={vibe}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                onClick={() => toggleArrayFilter('vibes', vibe)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-500/20 text-purple-400 rounded-full text-sm font-medium border border-purple-500/30 hover:bg-purple-500/30 transition-colors"
              >
                <Cannabis className="h-3 w-3" />
                {vibe}
                <X className="h-3 w-3 ml-1 hover:scale-110 transition-transform" />
              </motion.button>
            ))}

            {filters.priceRange.map(price => (
              <motion.button
                key={price}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                onClick={() => toggleArrayFilter('priceRange', price)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/20 text-amber-400 rounded-full text-sm font-medium border border-amber-500/30 hover:bg-amber-500/30 transition-colors"
              >
                <DollarSign className="h-3 w-3" />
                {price}
                <X className="h-3 w-3 ml-1 hover:scale-110 transition-transform" />
              </motion.button>
            ))}

            {filters.isVerified && (
              <motion.button
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                onClick={() => updateFilter('isVerified', false)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500 text-white rounded-full text-sm font-medium hover:bg-green-400 transition-colors shadow-lg shadow-green-500/25"
              >
                <Shield className="h-3 w-3" />
                {t('filters.verified')}
                <X className="h-3 w-3 ml-1 hover:scale-110 transition-transform" />
              </motion.button>
            )}

            {filters.rating > 0 && (
              <motion.button
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                onClick={() => updateFilter('rating', 0)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-500/20 text-orange-400 rounded-full text-sm font-medium border border-orange-500/30 hover:bg-orange-500/30 transition-colors"
              >
                <Star className="h-3 w-3" />
                {filters.rating}+ {t('filters.stars_suffix')}
                <X className="h-3 w-3 ml-1 hover:scale-110 transition-transform" />
              </motion.button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filter Options */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            className="space-y-8 pt-6 border-t border-white/10"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Neighborhood Filter */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <label className="block text-sm font-bold text-white mb-4 flex items-center gap-2">
                <div className="w-8 h-8 bg-green-500/10 rounded-lg flex items-center justify-center">
                  <MapPin className="h-4 w-4 text-green-400" />
                </div>
                {t('filters.neighborhood')}
              </label>
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
                {neighborhoods.map((neighborhood, index) => (
                  <motion.button
                    key={neighborhood}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => updateFilter('neighborhood',
                      filters.neighborhood === neighborhood ? '' : neighborhood
                    )}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`p-4 rounded-xl text-sm font-bold border-2 transition-all duration-300 ${
                      filters.neighborhood === neighborhood
                        ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-500/50 text-green-400 shadow-lg shadow-green-500/10'
                        : 'bg-white/5 border-white/10 text-zinc-400 hover:bg-white/10 hover:border-white/20 hover:text-white'
                    }`}
                  >
                    {filters.neighborhood === neighborhood && (
                      <CheckCircle className="h-3 w-3 inline mr-1" />
                    )}
                    {neighborhood}
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Amenities Filter */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              <label className="block text-sm font-bold text-white mb-4 flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-blue-400" />
                </div>
                {t('filters.amenities')}
              </label>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {amenities.map((amenity, index) => (
                  <motion.button
                    key={amenity}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.03 }}
                    onClick={() => toggleArrayFilter('amenities', amenity)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`p-4 rounded-xl text-sm font-bold border-2 transition-all duration-300 ${
                      filters.amenities.includes(amenity)
                        ? 'bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border-blue-500/50 text-blue-400 shadow-lg shadow-blue-500/10'
                        : 'bg-white/5 border-white/10 text-zinc-400 hover:bg-white/10 hover:border-white/20 hover:text-white'
                    }`}
                  >
                    {filters.amenities.includes(amenity) && (
                      <CheckCircle className="h-3 w-3 inline mr-1" />
                    )}
                    {amenity}
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Vibes Filter */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <label className="block text-sm font-bold text-white mb-4 flex items-center gap-2">
                <div className="w-8 h-8 bg-purple-500/10 rounded-lg flex items-center justify-center">
                  <Cannabis className="h-4 w-4 text-purple-400" />
                </div>
                {t('filters.vibes')}
              </label>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {vibes.map((vibe, index) => (
                  <motion.button
                    key={vibe}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.03 }}
                    onClick={() => toggleArrayFilter('vibes', vibe)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`p-4 rounded-xl text-sm font-bold border-2 transition-all duration-300 ${
                      filters.vibes.includes(vibe)
                        ? 'bg-gradient-to-r from-purple-500/20 to-violet-500/20 border-purple-500/50 text-purple-400 shadow-lg shadow-purple-500/10'
                        : 'bg-white/5 border-white/10 text-zinc-400 hover:bg-white/10 hover:border-white/20 hover:text-white'
                    }`}
                  >
                    {filters.vibes.includes(vibe) && (
                      <CheckCircle className="h-3 w-3 inline mr-1" />
                    )}
                    {vibe}
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Additional Filters */}
            <motion.div
              className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-6 border-t border-white/10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
            >
              {/* Verified Filter */}
              <motion.button
                onClick={() => updateFilter('isVerified', !filters.isVerified)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center gap-4 p-5 rounded-2xl border-2 transition-all duration-300 ${
                  filters.isVerified
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 border-transparent text-white shadow-lg shadow-green-500/25'
                    : 'bg-white/5 border-white/10 text-zinc-400 hover:bg-white/10 hover:border-white/20'
                }`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  filters.isVerified ? 'bg-white/20' : 'bg-green-500/10'
                }`}>
                  <Shield className={`h-6 w-6 ${filters.isVerified ? 'text-white' : 'text-green-400'}`} />
                </div>
                <div className="text-left">
                  <span className={`block text-sm font-bold ${filters.isVerified ? 'text-white' : 'text-zinc-300'}`}>
                    {t('filters.verified_only')}
                  </span>
                  <span className={`text-xs ${filters.isVerified ? 'text-white/70' : 'text-zinc-500'}`}>
                    Show only verified clubs
                  </span>
                </div>
                {filters.isVerified && (
                  <CheckCircle className="h-5 w-5 ml-auto" />
                )}
              </motion.button>

              {/* Price Range Filter */}
              <div className="p-5 bg-white/5 rounded-2xl border border-white/10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-amber-500/10 rounded-lg flex items-center justify-center">
                    <DollarSign className="h-5 w-5 text-amber-400" />
                  </div>
                  <span className="text-sm font-bold text-white">{t('filters.price_range')}</span>
                </div>
                <div className="flex gap-3">
                  {['$', '$$', '$$$'].map(price => (
                    <motion.button
                      key={price}
                      onClick={() => toggleArrayFilter('priceRange', price)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className={`flex-1 py-3 rounded-xl text-lg font-bold border-2 transition-all duration-300 ${
                        filters.priceRange.includes(price)
                          ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 border-amber-500/50 text-amber-400 shadow-lg'
                          : 'bg-white/5 border-white/10 text-zinc-400 hover:bg-white/10 hover:border-white/20'
                      }`}
                    >
                      {price}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Rating Filter */}
              <div className="p-5 bg-white/5 rounded-2xl border border-white/10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-orange-500/10 rounded-lg flex items-center justify-center">
                    <Star className="h-5 w-5 text-orange-400" />
                  </div>
                  <span className="text-sm font-bold text-white">{t('filters.min_rating')}</span>
                </div>
                <div className="flex gap-3">
                  {[4, 4.5, 5].map(rating => (
                    <motion.button
                      key={rating}
                      onClick={() => updateFilter('rating', filters.rating === rating ? 0 : rating)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className={`flex-1 py-3 rounded-xl text-sm font-bold border-2 transition-all duration-300 flex items-center justify-center gap-1 ${
                        filters.rating === rating
                          ? 'bg-gradient-to-r from-orange-500/20 to-red-500/20 border-orange-500/50 text-orange-400 shadow-lg'
                          : 'bg-white/5 border-white/10 text-zinc-400 hover:bg-white/10 hover:border-white/20'
                      }`}
                    >
                      <Star className={`h-3 w-3 ${filters.rating === rating ? 'fill-orange-400' : ''}`} />
                      {rating}
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}