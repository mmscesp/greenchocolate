'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { FilterOptions } from '@/lib/types';
import { useLanguage } from '@/hooks/useLanguage';
import { Filter,
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
Zap,
Clock,
LayoutGrid } from '@/lib/icons';
import { EditorialHeading } from './landing/editorial-concierge/typography/EditorialHeading';
import { ConciergeLabel } from './landing/editorial-concierge/typography/ConciergeLabel';
import { trackEvent } from '@/lib/analytics';

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

  const updateFilter = (key: keyof FilterOptions, value: FilterOptions[keyof FilterOptions]) => {
    onFiltersChange({ ...filters, [key]: value });
    trackEvent('clubs_filter_update', {
      key,
      value_type: Array.isArray(value) ? 'array' : typeof value,
    });
  };

  const toggleArrayFilter = (key: 'amenities' | 'vibes' | 'priceRange', value: string) => {
    const currentArray = filters[key] as string[];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    updateFilter(key, newArray);
    trackEvent('clubs_filter_toggle', {
      key,
      option: value,
      active: !currentArray.includes(value),
    });
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
    trackEvent('clubs_filter_clear_all');
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
    <div className="space-y-8">
      {/* Search Result Summary */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center border border-white/5">
            <Search className="h-4 w-4 text-[#E8A838]" />
          </div>
          <div>
            <EditorialHeading size="sm" className="text-white">
              {totalResults} {t('filters.results_found')}
            </EditorialHeading>
            <ConciergeLabel size="xs" emphasis="low" className="text-zinc-500">{t('filters.precision_screening')}</ConciergeLabel>
          </div>
        </div>
        
        {hasActiveFilters && (
          <button 
            type="button"
            onClick={clearAllFilters}
            className="inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-red-400 transition-colors bg-white/5 border border-white/5"
          >
            <X className="h-3 w-3" /> {t('filters.clear_all')}
          </button>
        )}
      </div>

      {/* Advanced Filters Sections */}
      <div className="space-y-10">
        
        {/* Neighborhood Filter */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <MapPin className="h-3.5 w-3.5 text-[#E8A838]/60" />
            <ConciergeLabel size="xs" emphasis="low" className="text-zinc-500">{t('filters.neighborhood')}</ConciergeLabel>
          </div>
          <div className="flex flex-wrap gap-2">
            {neighborhoods.map((neighborhood) => (
              <button
                type="button"
                key={neighborhood}
                onClick={() => updateFilter('neighborhood',
                  filters.neighborhood === neighborhood ? '' : neighborhood
                )}
                className={`min-h-11 px-5 py-2.5 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all border ${
                  filters.neighborhood === neighborhood
                    ? 'bg-[#E8A838] border-[#E8A838] text-black shadow-[0_4px_15px_rgba(232,168,56,0.3)]'
                    : 'bg-white/5 border-white/10 text-zinc-400 hover:border-[#E8A838]/30'
                }`}
              >
                {neighborhood}
              </button>
            ))}
          </div>
        </div>

        {/* Amenities Filter */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <LayoutGrid className="h-3.5 w-3.5 text-[#E8A838]/60" />
            <ConciergeLabel size="xs" emphasis="low" className="text-zinc-500">{t('filters.amenities')}</ConciergeLabel>
          </div>
          <div className="flex flex-wrap gap-2">
            {amenities.map((amenity) => (
              <button
                type="button"
                key={amenity}
                onClick={() => toggleArrayFilter('amenities', amenity)}
                className={`min-h-11 px-5 py-2.5 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all border ${
                  filters.amenities.includes(amenity)
                    ? 'bg-[#E8A838] border-[#E8A838] text-black shadow-[0_4px_15px_rgba(232,168,56,0.3)]'
                    : 'bg-white/5 border-white/10 text-zinc-400 hover:border-[#E8A838]/30'
                }`}
              >
                {amenity}
              </button>
            ))}
          </div>
        </div>

        {/* Vibes Filter */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5 text-[#E8A838]/60" />
            <ConciergeLabel size="xs" emphasis="low" className="text-zinc-500">{t('filters.vibes')}</ConciergeLabel>
          </div>
          <div className="flex flex-wrap gap-2">
            {vibes.map((vibe) => (
              <button
                type="button"
                key={vibe}
                onClick={() => toggleArrayFilter('vibes', vibe)}
                className={`min-h-11 px-5 py-2.5 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all border ${
                  filters.vibes.includes(vibe)
                    ? 'bg-[#E8A838] border-[#E8A838] text-black shadow-[0_4px_15px_rgba(232,168,56,0.3)]'
                    : 'bg-white/5 border-white/10 text-zinc-400 hover:border-[#E8A838]/30'
                }`}
              >
                {vibe}
              </button>
            ))}
          </div>
        </div>

        {/* Boolean & Range Filters */}
        <div className="grid grid-cols-1 gap-8 pt-10 border-t border-white/5">
          
          {/* Verified Only */}
          <button
            type="button"
            onClick={() => updateFilter('isVerified', !filters.isVerified)}
            className="flex items-center justify-between gap-4 group"
          >
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all border ${
                filters.isVerified ? 'bg-[#E8A838] border-[#E8A838]' : 'bg-white/5 border-white/10 group-hover:border-[#E8A838]/30'
              }`}>
                <Shield className={`h-4 w-4 ${filters.isVerified ? 'text-black' : 'text-zinc-500'}`} />
              </div>
              <div className="text-left">
                <span className="block text-[11px] font-bold uppercase tracking-widest text-white">{t('filters.verified_only')}</span>
                <span className="text-[10px] text-zinc-500 uppercase tracking-wider">{t('filters.verified_only_desc')}</span>
              </div>
            </div>
            <div className={`w-10 h-6 rounded-full p-1 transition-colors ${filters.isVerified ? 'bg-[#E8A838]' : 'bg-zinc-800'}`}>
              <motion.div 
                className={`w-4 h-4 rounded-full shadow-sm ${filters.isVerified ? 'bg-black' : 'bg-zinc-500'}`}
                animate={{ x: filters.isVerified ? 16 : 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </div>
          </button>

          {/* Price Range */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-3.5 w-3.5 text-[#E8A838]/60" />
              <ConciergeLabel size="xs" emphasis="low" className="text-zinc-500">{t('filters.price_range')}</ConciergeLabel>
            </div>
            <div className="flex gap-2">
              {['$', '$$', '$$$'].map(price => (
                <button
                  type="button"
                  key={price}
                  onClick={() => toggleArrayFilter('priceRange', price)}
                  className={`flex-1 py-3 rounded-xl text-xs font-bold border transition-all ${
                    filters.priceRange.includes(price)
                      ? 'bg-[#E8A838] border-[#E8A838] text-black shadow-lg'
                      : 'bg-white/5 border-white/10 text-zinc-500 hover:border-[#E8A838]/30'
                  }`}
                >
                  {price}
                </button>
              ))}
            </div>
          </div>

          {/* Minimum Rating */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Star className="h-3.5 w-3.5 text-[#E8A838]/60" />
              <ConciergeLabel size="xs" emphasis="low" className="text-zinc-500">{t('filters.minimum_rating')}</ConciergeLabel>
            </div>
            <div className="flex gap-2">
              {[4, 4.5, 5].map(rating => (
                <button
                  type="button"
                  key={rating}
                  onClick={() => updateFilter('rating', filters.rating === rating ? 0 : rating)}
                  className={`flex-1 py-3 rounded-xl text-xs font-bold border transition-all ${
                    filters.rating === rating
                      ? 'bg-[#E8A838] border-[#E8A838] text-black shadow-lg'
                      : 'bg-white/5 border-white/10 text-zinc-500 hover:border-[#E8A838]/30'
                  }`}
                >
                  {rating}
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
