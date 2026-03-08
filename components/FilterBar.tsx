'use client';

import { useEffect, useId, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Drawer, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from './ui/drawer';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { ScrollArea } from './ui/scroll-area';
import { Switch } from './ui/switch';
import { FilterOptions } from '@/lib/types';
import { useLanguage } from '@/hooks/useLanguage';
import { ChevronDown, LayoutGrid, MapPin, Search, Shield, SlidersHorizontal, Sparkles, X } from '@/lib/icons';
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

type FilterSectionKey = 'neighborhood' | 'amenities' | 'vibes';

type FilterSectionConfig = {
  key: FilterSectionKey;
  label: string;
  icon: typeof MapPin;
  options: string[];
  count: number;
};

const EMPTY_FILTERS: FilterOptions = {
  neighborhood: '',
  amenities: [],
  vibes: [],
  isVerified: false,
  priceRange: [],
  rating: 0,
};

function countActiveFilters(filters: FilterOptions) {
  return [
    filters.neighborhood ? 1 : 0,
    filters.amenities.length,
    filters.vibes.length,
    filters.isVerified ? 1 : 0,
  ].reduce((total, value) => total + value, 0);
}

function FilterChip({
  active,
  onClick,
  children,
  className,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Button
      type="button"
      variant={active ? 'primary' : 'secondary'}
      size="sm"
      onClick={onClick}
      className={cn(
        'h-auto min-h-10 rounded-full px-4 py-2 text-left leading-tight whitespace-normal break-words',
        active
          ? 'border-brand/60 bg-brand/90 text-bg-base shadow-[0_14px_30px_rgba(0,0,0,0.18)] backdrop-blur-xl'
          : 'glass-liquid border-white/14 bg-white/[0.05] text-zinc-100 hover:border-brand/40 hover:bg-white/[0.08]',
        className
      )}
    >
      {children}
    </Button>
  );
}

function ActiveFilterToken({
  label,
  onRemove,
}: {
  label: string;
  onRemove: () => void;
}) {
  return (
    <Badge className="glass-liquid flex items-center gap-2 rounded-full border border-brand/25 bg-brand/[0.14] px-3 py-2 text-[11px] font-semibold tracking-[0.08em] text-brand">
      <span className="max-w-full break-words normal-case">{label}</span>
      <button
        type="button"
        aria-label={`Remove ${label}`}
        onClick={onRemove}
        className="inline-flex h-5 w-5 items-center justify-center rounded-full text-brand transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/45"
      >
        <X className="h-3 w-3" />
      </button>
    </Badge>
  );
}

function DesktopFilterPopover({
  label,
  icon: Icon,
  count,
  activeStatusLabel,
  children,
}: {
  label: string;
  icon: typeof MapPin;
  count: number;
  activeStatusLabel: string;
  children: React.ReactNode;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant={count > 0 ? 'primary' : 'secondary'}
          size="sm"
          className={cn(
            'h-11 rounded-full border px-4',
            count > 0
              ? 'border-brand/40 bg-brand/90 text-bg-base shadow-[0_14px_30px_rgba(0,0,0,0.18)] backdrop-blur-xl hover:bg-brand-dark'
              : 'glass-liquid border-white/14 bg-white/[0.05] text-zinc-100 hover:border-brand/35 hover:bg-white/[0.08]'
          )}
        >
          <Icon className="h-4 w-4" />
          <span className="max-w-[12rem] truncate">{label}</span>
          {count > 0 && (
            <Badge className="h-5 min-w-[20px] border-none bg-bg-base/90 px-1 text-[10px] font-bold text-brand shadow-none">
              {count}
            </Badge>
          )}
          <ChevronDown className="h-3.5 w-3.5 opacity-70 transition-transform group-data-[state=open]:rotate-180" />
        </Button>
      </PopoverTrigger>
        <PopoverContent
          align="start"
          className="glass-dropdown w-[min(24rem,calc(100vw-2rem))] rounded-[1.5rem] border border-white/14 bg-[#07131c]/78 p-5 text-white shadow-[0_20px_50px_rgba(0,0,0,0.35)] backdrop-blur-2xl"
        >
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-white/8 pb-3">
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-zinc-400">{label}</span>
            {count > 0 && (
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-brand">
                {count} {activeStatusLabel}
              </span>
            )}
          </div>
          <div className="flex max-h-[18rem] flex-wrap gap-2 overflow-y-auto pr-1">{children}</div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

function MobileFilterDrawer({
  appliedFilters,
  totalResults,
  open,
  onOpenChange,
  onApply,
  sections,
  verifiedLabel,
  verifiedDescription,
  title,
  description,
  clearAllLabel,
  resultsLabel,
  showResultsLabel,
}: {
  appliedFilters: FilterOptions;
  totalResults: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApply: (filters: FilterOptions) => void;
  sections: FilterSectionConfig[];
  verifiedLabel: string;
  verifiedDescription: string;
  title: string;
  description: string;
  clearAllLabel: string;
  resultsLabel: string;
  showResultsLabel: string;
}) {
  const [draftFilters, setDraftFilters] = useState<FilterOptions>(appliedFilters);
  const verifiedSwitchId = useId();

  const activeDraftCount = countActiveFilters(draftFilters);

  const setSingleValue = (key: 'neighborhood', value: string) => {
    setDraftFilters((current) => ({
      ...current,
      [key]: current[key] === value ? '' : value,
    }));
  };

  const toggleArrayValue = (key: 'amenities' | 'vibes', value: string) => {
    setDraftFilters((current) => {
      const currentValues = current[key];
      const nextValues = currentValues.includes(value)
        ? currentValues.filter((item) => item !== value)
        : [...currentValues, value];

      return {
        ...current,
        [key]: nextValues,
      };
    });
  };

  const handleResetDraft = () => {
    setDraftFilters(EMPTY_FILTERS);
    trackEvent('clubs_filter_mobile_draft_reset');
  };

  const handleApply = () => {
    onApply(draftFilters);
    onOpenChange(false);
    trackEvent('clubs_filter_mobile_apply', {
      active_filters: countActiveFilters(draftFilters),
    });
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) {
      setDraftFilters(appliedFilters);
    }
    if (!nextOpen) {
      setDraftFilters(appliedFilters);
    }
    onOpenChange(nextOpen);
  };

  return (
    <Drawer open={open} onOpenChange={handleOpenChange}>
      <DrawerTrigger asChild>
        <Button
          type="button"
          variant="secondary"
          size="md"
          className="glass-liquid h-12 w-full justify-between rounded-full border border-white/14 bg-[#08131d]/72 px-4 text-sm text-white shadow-[0_14px_32px_rgba(0,0,0,0.3)] backdrop-blur-2xl hover:border-brand/35 hover:bg-[#0b1824]/78"
        >
          <span className="flex min-w-0 items-center gap-3">
            <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand/14 text-brand">
              <SlidersHorizontal className="h-4 w-4" />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-left text-sm font-semibold text-white">{title}</span>
            </span>
          </span>
          <span className="flex items-center gap-2 text-xs font-medium text-zinc-300">
            {activeDraftCount > 0 && (
              <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-brand px-1.5 text-[11px] font-bold text-bg-base">
                {activeDraftCount}
              </span>
            )}
            <span className="whitespace-nowrap">
              {totalResults} {resultsLabel}
            </span>
          </span>
        </Button>
      </DrawerTrigger>
      <DrawerContent className="glass-dropdown h-[min(88vh,48rem)] rounded-t-[2rem] border-x border-t border-white/12 bg-[#07131c]/82 text-white shadow-[0_-18px_50px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
        <DrawerHeader className="border-b border-white/8 bg-white/[0.02] px-5 pb-5 pt-4 text-left backdrop-blur-xl sm:px-6">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <DrawerTitle className="font-serif text-[1.75rem] font-bold leading-tight text-white">{title}</DrawerTitle>
              <DrawerDescription className="max-w-sm text-sm leading-6 text-zinc-400">
                {description}
              </DrawerDescription>
            </div>
            {activeDraftCount > 0 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleResetDraft}
                className="h-auto rounded-full px-3 py-2 text-xs font-semibold text-zinc-300 hover:bg-white/5 hover:text-white"
              >
                {clearAllLabel}
              </Button>
            )}
          </div>
        </DrawerHeader>
        <ScrollArea className="flex-1">
          <div className="space-y-8 px-5 py-6 sm:px-6">
            {sections.map((section) => (
              <section key={section.key} className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-brand/12 text-brand">
                    <section.icon className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-zinc-200">{section.label}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {section.options.map((option) => {
                    const active = section.key === 'neighborhood'
                      ? draftFilters.neighborhood === option
                      : draftFilters[section.key].includes(option);
                    const handleClick = () =>
                      section.key === 'neighborhood'
                        ? setSingleValue('neighborhood', option)
                        : toggleArrayValue(section.key, option);

                    return (
                      <FilterChip key={option} active={active} onClick={handleClick} className="max-w-full">
                        {option}
                      </FilterChip>
                    );
                  })}
                </div>
              </section>
            ))}

            <section className="border-t border-white/8 pt-8">
              <div className="glass-liquid flex items-start gap-4 rounded-[1.75rem] border border-white/12 bg-white/[0.04] p-4 backdrop-blur-xl sm:p-5">
                <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-brand/8 text-brand">
                  <Shield className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1 space-y-1">
                  <label htmlFor={verifiedSwitchId} className="block text-sm font-semibold uppercase tracking-[0.16em] text-zinc-100">
                    {verifiedLabel}
                  </label>
                  <p className="text-sm leading-5 text-zinc-400">{verifiedDescription}</p>
                </div>
                <Switch
                  id={verifiedSwitchId}
                  checked={draftFilters.isVerified}
                  onCheckedChange={(checked) => setDraftFilters((current) => ({ ...current, isVerified: checked }))}
                  className="mt-1 shrink-0 data-[state=checked]:bg-brand data-[state=unchecked]:bg-white/10"
                />
              </div>
            </section>
          </div>
        </ScrollArea>
        <DrawerFooter className="border-t border-white/8 bg-white/[0.03] px-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] pt-4 backdrop-blur-xl sm:px-6">
          <Button
            type="button"
            variant="primary"
            size="lg"
            onClick={handleApply}
            className="h-14 w-full rounded-full text-sm font-semibold"
          >
            {showResultsLabel} ({totalResults})
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

function DesktopFilterBar({
  filters,
  totalResults,
  sections,
  onToggleArrayFilter,
  onUpdateFilter,
  onClearAll,
  clearAllLabel,
  resultsFoundLabel,
  advancedLabel,
  verifiedOnlyLabel,
  activeStatusLabel,
  verifiedLabel,
}: {
  filters: FilterOptions;
  totalResults: number;
  sections: FilterSectionConfig[];
  onToggleArrayFilter: (key: 'amenities' | 'vibes', value: string) => void;
  onUpdateFilter: <K extends keyof FilterOptions>(key: K, value: FilterOptions[K]) => void;
  onClearAll: () => void;
  clearAllLabel: string;
  resultsFoundLabel: string;
  advancedLabel: string;
  verifiedOnlyLabel: string;
  activeStatusLabel: string;
  verifiedLabel: string;
}) {
  const activeFilterCount = countActiveFilters(filters);

  return (
    <div className="hidden lg:block">
      <div className="glass-liquid sticky top-24 z-30 rounded-[2rem] border border-white/14 bg-[#08131d]/72 p-4 shadow-[0_18px_42px_rgba(0,0,0,0.24)] backdrop-blur-2xl">
        <div className="flex flex-wrap items-center gap-4">
          <div className="glass-liquid flex min-w-[11rem] items-center gap-3 rounded-[1.25rem] border border-white/12 bg-white/[0.05] px-4 py-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-brand/12 text-brand">
              <Search className="h-4 w-4" />
            </span>
            <div>
              <p className="text-xl font-semibold text-white">{totalResults}</p>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-400">{resultsFoundLabel}</p>
            </div>
          </div>

          <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
            {sections.map((section) => (
              <DesktopFilterPopover
                key={section.key}
                label={section.label}
                icon={section.icon}
                count={section.count}
                activeStatusLabel={activeStatusLabel}
              >
                {section.options.map((option) => {
                  const active = section.key === 'neighborhood'
                    ? filters.neighborhood === option
                    : filters[section.key].includes(option);
                  const handleClick = () =>
                    section.key === 'neighborhood'
                      ? onUpdateFilter('neighborhood', filters.neighborhood === option ? '' : option)
                      : onToggleArrayFilter(section.key, option);

                  return (
                    <FilterChip key={option} active={active} onClick={handleClick}>
                      {option}
                    </FilterChip>
                  );
                })}
              </DesktopFilterPopover>
            ))}

            <Button
              type="button"
              variant={filters.isVerified ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => onUpdateFilter('isVerified', !filters.isVerified)}
              className={cn(
                'h-11 rounded-full border px-4',
                filters.isVerified
                  ? 'border-brand/40 bg-brand/90 text-bg-base shadow-[0_14px_30px_rgba(0,0,0,0.18)] backdrop-blur-xl hover:bg-brand-dark'
                  : 'glass-liquid border-white/14 bg-white/[0.05] text-zinc-100 hover:border-brand/35 hover:bg-white/[0.08]'
              )}
            >
              <Shield className="h-4 w-4" />
              <span>{verifiedOnlyLabel}</span>
            </Button>
          </div>

          <div className="ml-auto flex items-center gap-3">
            {activeFilterCount > 0 ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onClearAll}
                className="glass-liquid h-11 rounded-full border border-white/12 bg-white/[0.04] px-4 text-zinc-300 hover:bg-white/[0.08] hover:text-white"
              >
                <X className="h-4 w-4" />
                <span>{clearAllLabel}</span>
              </Button>
            ) : (
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-500">{advancedLabel}</span>
            )}
          </div>
        </div>

        <AnimatePresence>
          {activeFilterCount > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="mt-4 flex flex-wrap gap-2 border-t border-white/8 pt-4"
            >
              {filters.neighborhood && (
                <ActiveFilterToken
                  label={filters.neighborhood}
                  onRemove={() => onUpdateFilter('neighborhood', '')}
                />
              )}
              {filters.isVerified && (
                <ActiveFilterToken
                  label={verifiedLabel}
                  onRemove={() => onUpdateFilter('isVerified', false)}
                />
              )}
              {filters.amenities.map((amenity) => (
                <ActiveFilterToken
                  key={amenity}
                  label={amenity}
                  onRemove={() => onToggleArrayFilter('amenities', amenity)}
                />
              ))}
              {filters.vibes.map((vibe) => (
                <ActiveFilterToken
                  key={vibe}
                  label={vibe}
                  onRemove={() => onToggleArrayFilter('vibes', vibe)}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function FilterBar({
  filters,
  onFiltersChange,
  totalResults,
  neighborhoods = [],
  amenities = [],
  vibes = [],
}: FilterBarProps) {
  const { t } = useLanguage();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [hideMobileTrigger, setHideMobileTrigger] = useState(false);

  useEffect(() => {
    const updateTriggerVisibility = () => {
      if (typeof window === 'undefined' || window.innerWidth >= 1024) {
        setHideMobileTrigger(false);
        return;
      }

      const footer = document.querySelector('footer, [role="contentinfo"]');
      if (!footer) {
        setHideMobileTrigger(false);
        return;
      }

      const footerTop = footer.getBoundingClientRect().top;
      const isNearFooter = footerTop <= window.innerHeight - 64;
      setHideMobileTrigger(isNearFooter);
    };

    updateTriggerVisibility();
    window.addEventListener('scroll', updateTriggerVisibility, { passive: true });
    window.addEventListener('resize', updateTriggerVisibility);

    return () => {
      window.removeEventListener('scroll', updateTriggerVisibility);
      window.removeEventListener('resize', updateTriggerVisibility);
    };
  }, []);

  const updateFilter = <K extends keyof FilterOptions>(key: K, value: FilterOptions[K]) => {
    onFiltersChange({ ...filters, [key]: value });
    trackEvent('clubs_filter_update', {
      key,
      value_type: Array.isArray(value) ? 'array' : typeof value,
    });
  };

  const toggleArrayFilter = (key: 'amenities' | 'vibes', value: string) => {
    const currentArray = filters[key];
    const newArray = currentArray.includes(value)
      ? currentArray.filter((item) => item !== value)
      : [...currentArray, value];

    updateFilter(key, newArray);
  };

  const clearAllFilters = () => {
    onFiltersChange(EMPTY_FILTERS);
    trackEvent('clubs_filter_clear_all');
  };

  const activeFilterCount = countActiveFilters(filters);

  const sections: FilterSectionConfig[] = [
    {
      key: 'neighborhood',
      label: t('filters.neighborhood'),
      icon: MapPin,
      options: neighborhoods,
      count: filters.neighborhood ? 1 : 0,
    },
    {
      key: 'amenities',
      label: t('filters.amenities'),
      icon: LayoutGrid,
      options: amenities,
      count: filters.amenities.length,
    },
    {
      key: 'vibes',
      label: t('filters.vibes'),
      icon: Sparkles,
      options: vibes,
      count: filters.vibes.length,
    },
  ];

  return (
    <>
      <div
        className={cn(
          'fixed inset-x-4 bottom-[calc(1rem+env(safe-area-inset-bottom))] z-40 transition-all duration-200 lg:hidden',
          (hideMobileTrigger && !isMobileOpen) ? 'pointer-events-none translate-y-6 opacity-0' : 'opacity-100'
        )}
      >
        <MobileFilterDrawer
          appliedFilters={filters}
          totalResults={totalResults}
          open={isMobileOpen}
          onOpenChange={setIsMobileOpen}
          onApply={onFiltersChange}
          sections={sections}
          verifiedLabel={t('filters.verified_only')}
          verifiedDescription={t('filters.verified_only_desc')}
          title={t('filters.advanced')}
          description={t('filters.mobile_description')}
          clearAllLabel={t('filters.clear_all')}
          resultsLabel={t('filters.results')}
          showResultsLabel={t('filters.show_results')}
        />
      </div>

      <DesktopFilterBar
        filters={filters}
        totalResults={totalResults}
        sections={sections}
        onToggleArrayFilter={toggleArrayFilter}
        onUpdateFilter={updateFilter}
        onClearAll={clearAllFilters}
        clearAllLabel={t('filters.clear_all')}
        resultsFoundLabel={t('filters.results_found')}
        advancedLabel={t('filters.advanced')}
        verifiedOnlyLabel={t('filters.verified_only')}
        activeStatusLabel={t('filters.active_status')}
        verifiedLabel={t('filters.verified')}
      />
    </>
  );
}
