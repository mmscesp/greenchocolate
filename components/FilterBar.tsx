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
          <div className="w-10 h-10 bg-zinc-900 rounded-full flex items-center justify-center">
            <Search className="h-4 w-4 text-emerald-500" />
          </div>
          <div>
            <EditorialHeading size="sm" className="text-zinc-900">
              {totalResults} clubs found
            </EditorialHeading>
            <ConciergeLabel size="xs" emphasis="low">Precision Directory Screening</ConciergeLabel>
          </div>
        </div>
        
        {hasActiveFilters && (
          <button 
            type="button"
            onClick={clearAllFilters}
            className="inline-flex min-h-11 items-center gap-2 rounded-full px-3 text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-red-500 transition-colors"
          >
            <X className="h-3 w-3" /> Clear All
          </button>
        )}
      </div>

      {/* Advanced Filters Sections */}
      <div className="space-y-10">
        
        {/* Neighborhood Filter */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-zinc-400" />
                  <EditorialHeading size="sm" className="text-zinc-500 uppercase tracking-[0.2em] text-[10px]">Neighborhood</EditorialHeading>
          </div>
          <div className="flex flex-wrap gap-2">
            {neighborhoods.map((neighborhood) => (
              <button
                type="button"
                key={neighborhood}
                onClick={() => updateFilter('neighborhood',
                  filters.neighborhood === neighborhood ? '' : neighborhood
                )}
                className={`min-h-11 px-4 py-2.5 rounded-full text-xs font-bold transition-all border ${
                  filters.neighborhood === neighborhood
                    ? 'bg-zinc-900 border-zinc-900 text-white shadow-lg'
                    : 'bg-white border-zinc-200 text-zinc-600 hover:border-zinc-400'
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
            <LayoutGrid className="h-4 w-4 text-zinc-400" />
                  <EditorialHeading size="sm" className="text-zinc-500 uppercase tracking-[0.2em] text-[10px]">Services & Amenities</EditorialHeading>
          </div>
          <div className="flex flex-wrap gap-2">
            {amenities.map((amenity) => (
              <button
                type="button"
                key={amenity}
                onClick={() => toggleArrayFilter('amenities', amenity)}
                className={`min-h-11 px-4 py-2.5 rounded-full text-xs font-bold transition-all border ${
                  filters.amenities.includes(amenity)
                    ? 'bg-zinc-900 border-zinc-900 text-white shadow-lg'
                    : 'bg-white border-zinc-200 text-zinc-600 hover:border-zinc-400'
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
            <Sparkles className="h-4 w-4 text-zinc-400" />
                  <EditorialHeading size="sm" className="text-zinc-500 uppercase tracking-[0.2em] text-[10px]">Vibe & Style</EditorialHeading>
          </div>
          <div className="flex flex-wrap gap-2">
            {vibes.map((vibe) => (
              <button
                type="button"
                key={vibe}
                onClick={() => toggleArrayFilter('vibes', vibe)}
                className={`min-h-11 px-4 py-2.5 rounded-full text-xs font-bold transition-all border ${
                  filters.vibes.includes(vibe)
                    ? 'bg-zinc-900 border-zinc-900 text-white shadow-lg'
                    : 'bg-white border-zinc-200 text-zinc-600 hover:border-zinc-400'
                }`}
              >
                {vibe}
              </button>
            ))}
          </div>
        </div>

        {/* Boolean & Range Filters */}
        <div className="grid grid-cols-1 gap-8 pt-8 border-t border-zinc-100">
          
          {/* Verified Only */}
          <button
            type="button"
            onClick={() => updateFilter('isVerified', !filters.isVerified)}
            className="flex items-center justify-between gap-4 group"
          >
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                filters.isVerified ? 'bg-emerald-500' : 'bg-zinc-100 group-hover:bg-zinc-200'
              }`}>
                <Shield className={`h-4 w-4 ${filters.isVerified ? 'text-white' : 'text-zinc-400'}`} />
              </div>
              <div className="text-left">
                <span className="block text-xs font-bold uppercase tracking-widest text-zinc-900">Verified clubs only</span>
                <span className="text-[10px] text-zinc-400">Show only verified clubs</span>
              </div>
            </div>
            <div className={`w-10 h-6 rounded-full p-1 transition-colors ${filters.isVerified ? 'bg-emerald-500' : 'bg-zinc-200'}`}>
              <motion.div 
                className="w-4 h-4 bg-white rounded-full shadow-sm"
                animate={{ x: filters.isVerified ? 16 : 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </div>
          </button>

          {/* Price Range */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-zinc-400" />
              <EditorialHeading size="sm" className="text-zinc-500 uppercase tracking-[0.2em] text-[10px]">Price range:</EditorialHeading>
            </div>
            <div className="flex gap-2">
              {['$', '$$', '$$$'].map(price => (
                <button
                  type="button"
                  key={price}
                  onClick={() => toggleArrayFilter('priceRange', price)}
                  className={`flex-1 py-3 rounded-xl text-sm font-bold border transition-all ${
                    filters.priceRange.includes(price)
                      ? 'bg-zinc-900 border-zinc-900 text-white'
                      : 'bg-white border-zinc-200 text-zinc-400 hover:border-zinc-300'
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
              <Star className="h-4 w-4 text-zinc-400" />
              <EditorialHeading size="sm" className="text-zinc-500 uppercase tracking-[0.2em] text-[10px]">Minimum rating:</EditorialHeading>
            </div>
            <div className="flex gap-2">
              {[4, 4.5, 5].map(rating => (
                <button
                  type="button"
                  key={rating}
                  onClick={() => updateFilter('rating', filters.rating === rating ? 0 : rating)}
                  className={`flex-1 py-3 rounded-xl text-sm font-bold border transition-all ${
                    filters.rating === rating
                      ? 'bg-zinc-900 border-zinc-900 text-white'
                      : 'bg-white border-zinc-200 text-zinc-400 hover:border-zinc-300'
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
