'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { ScrollArea } from './ui/scroll-area';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger, DrawerFooter, DrawerClose } from './ui/drawer';
import { FilterOptions } from '@/lib/types';
import { useLanguage } from '@/hooks/useLanguage';
import { 
  X, 
  MapPin, 
  Star, 
  DollarSign, 
  Shield, 
  Search, 
  SlidersHorizontal, 
  Sparkles, 
  LayoutGrid,
  ChevronDown,
  Check,
  ArrowRight
} from '@/lib/icons';
import { EditorialHeading } from './landing/editorial-concierge/typography/EditorialHeading';
import { ConciergeLabel } from './landing/editorial-concierge/typography/ConciergeLabel';
import { trackEvent } from '@/lib/analytics';
import { cn } from '@/lib/utils';

interface FilterBarProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  totalResults: number;
  neighborhoods: string[];
  amenities: string[];
  vibes: string[];
}

// Reusable Filter Chip Component
const FilterChip = ({ 
  active, 
  onClick, 
  children, 
  className 
}: { 
  active: boolean; 
  onClick: () => void; 
  children: React.ReactNode;
  className?: string;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      "px-5 py-2.5 rounded-full text-[11px] font-bold uppercase tracking-[0.15em] transition-all border whitespace-nowrap",
      active
        ? "bg-brand border-brand text-black shadow-[0_4px_20px_hsl(var(--brand)/0.3)]"
        : "bg-white/5 border-white/10 text-zinc-300 hover:border-brand/40 hover:text-white hover:bg-white/10"
    )}
  >
    {children}
  </button>
);

// Desktop Popover Filter Section
const DesktopFilterPopover = ({ 
  label, 
  icon: Icon, 
  count, 
  children 
}: { 
  label: string; 
  icon: any; 
  count: number; 
  children: React.ReactNode 
}) => (
  <Popover>
    <PopoverTrigger asChild>
      <button 
        className={cn(
          "h-11 px-5 flex items-center gap-3 transition-all hover:bg-white/5 rounded-full group whitespace-nowrap border border-transparent",
          count > 0 ? "text-brand bg-brand/5 border-brand/20" : "text-zinc-300 hover:text-white"
        )}
      >
        <Icon className={cn("h-4 w-4 transition-transform group-hover:scale-110", count > 0 && "fill-current")} />
        <span className="text-[11px] font-bold uppercase tracking-[0.2em]">{label}</span>
        {count > 0 && (
          <Badge className="bg-brand text-black border-none text-[9px] font-bold h-5 min-w-[20px] px-1">
            {count}
          </Badge>
        )}
        <ChevronDown className={cn("h-3 w-3 opacity-50 transition-transform group-data-[state=open]:rotate-180")} />
      </button>
    </PopoverTrigger>
    <PopoverContent className="w-[calc(100vw-2rem)] sm:w-80 p-5 sm:p-6 bg-bg-base/95 backdrop-blur-2xl border-white/10 text-white shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-[1.5rem] sm:rounded-[2rem] z-50" align="start">
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400">{label}</span>
          {count > 0 && (
            <span className="text-[9px] font-bold text-brand uppercase tracking-widest">{count} ACTIVE</span>
          )}
        </div>
        <div className="max-h-[350px] overflow-y-auto pr-2 no-scrollbar">
          {children}
        </div>
      </div>
    </PopoverContent>
  </Popover>
);

export default function FilterBar({
  filters, 
  onFiltersChange, 
  totalResults,
  neighborhoods = [],
  amenities = [],
  vibes = []
}: FilterBarProps) {
  const { t } = useLanguage();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

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

  const activeFilterCount = [
    filters.neighborhood ? 1 : 0,
    filters.amenities.length,
    filters.vibes.length,
    filters.isVerified ? 1 : 0,
    filters.priceRange.length,
    filters.rating > 0 ? 1 : 0
  ].reduce((a, b) => a + b, 0);


  return (
    <>
      {/* Mobile Sticky Floating Filter Button */}
      <div className="fixed bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-50 lg:hidden w-[calc(100%-2rem)] sm:w-[calc(100%-4rem)] max-w-sm">
        <Drawer open={isMobileOpen} onOpenChange={setIsMobileOpen}>
          <DrawerTrigger asChild>
            <button className="w-full h-14 sm:h-16 bg-brand text-black rounded-full shadow-[0_20px_40px_hsl(var(--brand)/0.4)] flex items-center justify-between px-6 sm:px-8 transition-all active:scale-95 border border-white/20">
              <div className="flex items-center gap-3">
                <SlidersHorizontal className="h-5 w-5" />
                <span className="text-xs sm:text-sm font-black uppercase tracking-[0.2em] sm:tracking-[0.25em]">{t('filters.advanced')}</span>
                {activeFilterCount > 0 && (
                  <div className="w-6 h-6 bg-bg-base text-brand rounded-full flex items-center justify-center text-[11px] font-bold">
                    {activeFilterCount}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs font-bold opacity-80 uppercase tracking-widest">
                {totalResults} {t('filters.results')}
              </div>
            </button>
          </DrawerTrigger>
          <DrawerContent className="bg-bg-base border-white/10 h-[92vh] rounded-t-[3rem]">
            <div className="mx-auto w-12 h-1.5 rounded-full bg-muted mt-3 mb-1" />
            <DrawerHeader className="border-b border-white/5 px-8 py-6">
              <div className="flex items-center justify-between">
                <DrawerTitle>
                  <EditorialHeading size="sm" className="text-white">{t('filters.advanced')}</EditorialHeading>
                </DrawerTitle>
                {activeFilterCount > 0 && (
                  <button onClick={clearAllFilters} className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 hover:text-red-400">
                    {t('filters.clear_all')}
                  </button>
                )}
              </div>
            </DrawerHeader>
            <ScrollArea className="flex-1 px-8 py-8 no-scrollbar">
              <div className="space-y-12 pb-32">
                {/* Neighborhoods */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-brand" />
                    <ConciergeLabel size="sm" emphasis="high" className="text-white">{t('filters.neighborhood')}</ConciergeLabel>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {neighborhoods.map((n) => (
                      <FilterChip
                        key={n}
                        active={filters.neighborhood === n}
                        onClick={() => updateFilter('neighborhood', filters.neighborhood === n ? '' : n)}
                      >
                        {n}
                      </FilterChip>
                    ))}
                  </div>
                </div>

                {/* Amenities */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <LayoutGrid className="h-4 w-4 text-brand" />
                    <ConciergeLabel size="sm" emphasis="high" className="text-white">{t('filters.amenities')}</ConciergeLabel>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {amenities.map((a) => (
                      <FilterChip
                        key={a}
                        active={filters.amenities.includes(a)}
                        onClick={() => toggleArrayFilter('amenities', a)}
                      >
                        {a}
                      </FilterChip>
                    ))}
                  </div>
                </div>

                {/* Vibes */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <Sparkles className="h-4 w-4 text-brand" />
                    <ConciergeLabel size="sm" emphasis="high" className="text-white">{t('filters.vibes')}</ConciergeLabel>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {vibes.map((v) => (
                      <FilterChip
                        key={v}
                        active={filters.vibes.includes(v)}
                        onClick={() => toggleArrayFilter('vibes', v)}
                      >
                        {v}
                      </FilterChip>
                    ))}
                  </div>
                </div>

                {/* Boolean Toggles */}
                <div className="pt-8 border-t border-white/5 space-y-4">
                  <button
                    onClick={() => updateFilter('isVerified', !filters.isVerified)}
                    className="w-full flex items-center justify-between p-6 bg-white/5 rounded-3xl border border-white/10 hover:border-gold/30 transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "w-12 h-12 rounded-2xl flex items-center justify-center transition-all border",
                        filters.isVerified ? "bg-brand border-brand" : "bg-bg-surface border-border group-hover:border-brand/30"
                      )}>
                        <Shield className={cn("h-6 w-6", filters.isVerified ? "text-black" : "text-zinc-500")} />
                      </div>
                      <div className="text-left">
                        <span className="block text-xs font-black uppercase tracking-[0.2em] text-white">{t('filters.verified_only')}</span>
                        <span className="text-[11px] text-zinc-400 uppercase tracking-tight">{t('filters.verified_only_desc')}</span>
                      </div>
                    </div>
                    <Switch checked={filters.isVerified} onCheckedChange={(v) => updateFilter('isVerified', v)} />
                  </button>
                </div>
              </div>
            </ScrollArea>
            <DrawerFooter className="border-t border-white/5 p-6 sm:p-8 bg-bg-base/80 backdrop-blur-xl">
              <DrawerClose asChild>
                <Button className="w-full bg-brand text-black hover:bg-brand-dark rounded-full h-14 sm:h-16 font-black uppercase tracking-[0.2em] sm:tracking-[0.25em] text-xs shadow-2xl">
                  {t('filters.show_results')} ({totalResults})
                </Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div>

      {/* Desktop Horizontal Premium Bar */}
      <div className="hidden lg:block w-full">
        <div className="flex items-center justify-between glass-liquid rounded-full p-2 pl-10 shadow-2xl overflow-hidden min-h-[64px]">
          {/* Results Summary */}
          <div className="flex items-center gap-4 border-r border-white/10 pr-8 mr-4">
            <Search className="h-4 w-4 text-brand" />
            <div className="flex flex-col">
              <span className="text-white text-sm font-black leading-none">{totalResults}</span>
              <span className="text-zinc-400 text-[9px] font-bold uppercase tracking-[0.2em] mt-1">{t('filters.results_found')}</span>
            </div>
          </div>

          {/* Filter Popovers */}
          <div className="flex items-center gap-1 flex-1 no-scrollbar overflow-x-auto">
            <DesktopFilterPopover 
              label={t('filters.neighborhood')} 
              icon={MapPin} 
              count={filters.neighborhood ? 1 : 0}
            >
              <div className="flex flex-wrap gap-2">
                {neighborhoods.map(n => (
                  <FilterChip
                    key={n}
                    active={filters.neighborhood === n}
                    onClick={() => updateFilter('neighborhood', filters.neighborhood === n ? '' : n)}
                  >
                    {n}
                  </FilterChip>
                ))}
              </div>
            </DesktopFilterPopover>

            <DesktopFilterPopover 
              label={t('filters.amenities')} 
              icon={LayoutGrid} 
              count={filters.amenities.length}
            >
              <div className="flex flex-wrap gap-2">
                {amenities.map(a => (
                  <FilterChip
                    key={a}
                    active={filters.amenities.includes(a)}
                    onClick={() => toggleArrayFilter('amenities', a)}
                  >
                    {a}
                  </FilterChip>
                ))}
              </div>
            </DesktopFilterPopover>

            <DesktopFilterPopover 
              label={t('filters.vibes')} 
              icon={Sparkles} 
              count={filters.vibes.length}
            >
              <div className="flex flex-wrap gap-2">
                {vibes.map(v => (
                  <FilterChip
                    key={v}
                    active={filters.vibes.includes(v)}
                    onClick={() => toggleArrayFilter('vibes', v)}
                  >
                    {v}
                  </FilterChip>
                ))}
              </div>
            </DesktopFilterPopover>

            {/* Quick Toggle: Verified */}
            <button
              onClick={() => updateFilter('isVerified', !filters.isVerified)}
              className={cn(
                "h-11 px-6 rounded-full flex items-center gap-3 transition-all hover:bg-white/5 group border border-transparent",
                filters.isVerified
                  ? "text-brand bg-brand/5 border-brand/20"
                  : "text-zinc-300 hover:text-white"
              )}
            >
              <Shield className={cn("h-4 w-4 transition-transform group-hover:scale-110", filters.isVerified && "fill-current")} />
              <span className="text-[11px] font-bold uppercase tracking-[0.2em]">{t('filters.verified_only')}</span>
            </button>
          </div>

          {/* Actions: Clear All */}
          <div className="pl-6 border-l border-white/10 ml-4 pr-6 flex items-center">
            {activeFilterCount > 0 ? (
              <button 
                onClick={clearAllFilters}
                className="text-zinc-400 hover:text-red-400 transition-all flex items-center gap-2 group"
              >
                <X className="h-4 w-4 transition-transform group-hover:rotate-90" />
                <span className="text-[10px] font-bold uppercase tracking-[0.3em]">{t('filters.clear_all')}</span>
              </button>
            ) : (
              <span className="text-zinc-600 text-[10px] font-bold uppercase tracking-[0.3em]">{t('filters.advanced')}</span>
            )}
          </div>
        </div>

        {/* Active Filters Bar */}
        <AnimatePresence>
          {activeFilterCount > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-wrap gap-2 px-6 mt-4"
            >
              {filters.neighborhood && (
                <Badge variant="outline" className="bg-brand/10 text-brand border-brand/20 px-4 py-1.5 rounded-full flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase">
                  {filters.neighborhood}
                <X className="h-3 w-3 cursor-pointer hover:text-white transition-colors" onClick={(e) => { e.stopPropagation(); updateFilter('neighborhood', ''); }} />
                </Badge>
              )}
              {filters.isVerified && (
                <Badge variant="outline" className="bg-brand/10 text-brand border-brand/20 px-4 py-1.5 rounded-full flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase">
                  Verified
                  <X className="h-3 w-3 cursor-pointer hover:text-white transition-colors" onClick={(e) => { e.stopPropagation(); updateFilter('isVerified', false); }} />
                </Badge>
              )}
              {filters.amenities.map(a => (
                <Badge key={a} variant="outline" className="bg-white/5 text-zinc-200 border-white/10 px-4 py-1.5 rounded-full flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase hover:bg-white/10 transition-colors">
                  {a}
                  <X className="h-3 w-3 cursor-pointer hover:text-red-400 transition-colors" onClick={(e) => { e.stopPropagation(); toggleArrayFilter('amenities', a); }} />
                </Badge>
              ))}
              {filters.vibes.map(v => (
                <Badge key={v} variant="outline" className="bg-white/5 text-zinc-200 border-white/10 px-4 py-1.5 rounded-full flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase hover:bg-white/10 transition-colors">
                  {v}
                  <X className="h-3 w-3 cursor-pointer hover:text-red-400 transition-colors" onClick={(e) => { e.stopPropagation(); toggleArrayFilter('vibes', v); }} />
                </Badge>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
