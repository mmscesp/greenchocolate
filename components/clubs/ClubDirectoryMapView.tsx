'use client';

import { useCallback, useMemo, useRef, useState, type ReactNode } from 'react';
import { motion, useDragControls, useReducedMotion } from 'framer-motion';
import type { ClubCard } from '@/app/actions/clubs';
import ClubDirectoryMap from '@/components/clubs/ClubDirectoryMap';
import ClubMapListCard from '@/components/clubs/ClubMapListCard';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useLanguage } from '@/hooks/useLanguage';
import type { GeoCoordinate } from '@/lib/club-map';
import { HelpCircle, MapPin, Search, ShieldCheck, SlidersHorizontal, Zap } from '@/lib/icons';
import type { FilterOptions } from '@/lib/types';
import { cn } from '@/lib/utils';

interface ClubDirectoryMapViewProps {
  clubs: ClubCard[];
  cityCenter: GeoCoordinate;
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  neighborhoods: string[];
  amenities: string[];
  vibes: string[];
  loading?: boolean;
}

type MobileSheetState = 'collapsed' | 'mid' | 'expanded';

const EMPTY_FILTERS: FilterOptions = {
  neighborhood: '',
  amenities: [],
  vibes: [],
  isVerified: false,
  priceRange: [],
  rating: 0,
};

function countActiveFilters(filters: FilterOptions): number {
  return [
    filters.neighborhood ? 1 : 0,
    filters.amenities.length,
    filters.vibes.length,
    filters.isVerified ? 1 : 0,
  ].reduce((total, value) => total + value, 0);
}

function matchesSearch(club: ClubCard, query: string): boolean {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) {
    return true;
  }

  const searchable = [
    club.name,
    club.neighborhood,
    club.cityName,
    club.district,
    ...club.amenities,
    ...club.vibeTags,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  return searchable.includes(normalizedQuery);
}

function MapModeControls({
  query,
  onQueryChange,
  filters,
  onFiltersChange,
  neighborhoods,
  amenities,
  vibes,
  totalResults,
  visibleResults,
  mappableResults,
  hideHeader = false,
}: {
  query: string;
  onQueryChange: (query: string) => void;
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  neighborhoods: string[];
  amenities: string[];
  vibes: string[];
  totalResults: number;
  visibleResults: number;
  mappableResults: number;
  hideHeader?: boolean;
}) {
  const { t } = useLanguage();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [recommendationOpen, setRecommendationOpen] = useState(false);
  const activeFilterCount = countActiveFilters(filters);
  const translate = (key: string, fallback: string) => {
    const value = t(key);
    return value === key ? fallback : value;
  };
  const recommendationInfoTitle = translate('clubs.map.recommendation_info_title', 'How recommendations work');
  const recommendationInfoBody = translate(
    'clubs.map.recommendation_info_body',
    'Recommendations consider verified profiles, profile quality, real review signals, location relevance, and your active filters.'
  );
  const verifiedShortLabel = translate('filters.verified_short', 'Verified');
  const filtersTitle = translate('filters.title', 'Filters');

  const updateFilter = <K extends keyof FilterOptions>(key: K, value: FilterOptions[K]) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const addArrayFilter = (key: 'amenities' | 'vibes', value: string) => {
    if (!value || filters[key].includes(value)) {
      return;
    }

    updateFilter(key, [...filters[key], value]);
  };

  const removeArrayFilter = (key: 'amenities' | 'vibes', value: string) => {
    updateFilter(key, filters[key].filter((item) => item !== value));
  };

  const clearAll = () => {
    onQueryChange('');
    onFiltersChange(EMPTY_FILTERS);
  };

  const FilterChip = ({
    label,
    active,
    onClick,
  }: {
    label: string;
    active: boolean;
    onClick: () => void;
  }) => (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        'min-h-10 rounded-full border px-3 text-sm font-bold transition-colors',
        active
          ? 'border-brand/60 bg-brand text-black shadow-[0_0_24px_rgba(0,201,177,0.18)]'
          : 'border-white/10 bg-white/[0.045] text-zinc-300 hover:border-brand/35 hover:text-white'
      )}
    >
      {label}
    </button>
  );

  return (
    <div className="space-y-3">
      {hideHeader ? null : (
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-brand">{t('clubs.map.workspace_label')}</p>
            <div className="relative mt-1 flex min-w-0 items-center gap-2">
              <h2 className="truncate text-lg font-black leading-6 text-white">{t('clubs.map.workspace_title')}</h2>
              <button
                type="button"
                aria-label={recommendationInfoTitle}
                aria-expanded={recommendationOpen}
                onClick={() => setRecommendationOpen((open) => !open)}
                className="inline-flex h-5 w-5 shrink-0 items-center justify-center text-zinc-500 transition-colors hover:text-brand"
              >
                <HelpCircle className="h-3.5 w-3.5" />
              </button>
              {recommendationOpen ? (
                <div className="absolute left-0 top-9 z-40 w-72 rounded-2xl border border-white/10 bg-[#090d13]/96 p-4 text-left shadow-[0_22px_60px_rgba(0,0,0,0.55)] backdrop-blur-xl">
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-brand">
                    {recommendationInfoTitle}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-zinc-300">
                    {recommendationInfoBody}
                  </p>
                </div>
              ) : null}
            </div>
          </div>
          <span className="shrink-0 rounded-full border border-white/10 bg-white/[0.045] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-zinc-400">
            {visibleResults} {t('clubs.map.results')}
          </span>
        </div>
      </div>
      )}

      <div className="relative">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
        <input
          type="search"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder={t('clubs.map.search_placeholder')}
          className="h-11 w-full rounded-2xl border border-white/10 bg-white/[0.055] pl-10 pr-4 text-sm font-semibold text-white outline-none transition-colors placeholder:text-zinc-600 hover:border-brand/35 focus:border-brand/70"
        />
      </div>

      <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-2">
        <Button
          type="button"
          variant={filters.isVerified ? 'primary' : 'secondary'}
          size="sm"
          onClick={() => updateFilter('isVerified', !filters.isVerified)}
          className="h-10 justify-center rounded-full px-3 text-[10px] font-black uppercase tracking-[0.12em]"
        >
          <ShieldCheck className="h-4 w-4" />
          <span>{verifiedShortLabel}</span>
        </Button>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          aria-label={filtersTitle}
          onClick={() => setFiltersOpen(true)}
          className={cn(
            'relative h-10 w-10 rounded-full p-0',
            activeFilterCount > 0
              ? 'border-brand/60 bg-brand/[0.14] text-brand shadow-[0_0_24px_rgba(0,201,177,0.16)]'
              : 'text-zinc-400'
          )}
        >
          <SlidersHorizontal className="h-4 w-4" />
          {activeFilterCount > 0 ? (
            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-brand shadow-[0_0_10px_rgba(0,201,177,0.9)]" />
          ) : null}
        </Button>
      </div>

      <Dialog open={filtersOpen} onOpenChange={setFiltersOpen}>
        <DialogContent
          closeLabel={t('common.close')}
          className="flex max-h-[min(82svh,46rem)] flex-col gap-0 overflow-hidden rounded-[2rem] border-white/10 bg-[#070b10]/98 p-0 text-white shadow-[0_30px_100px_rgba(0,0,0,0.72)] backdrop-blur-2xl sm:max-w-[46rem]"
        >
          <DialogHeader className="shrink-0 border-b border-white/10 bg-[radial-gradient(circle_at_20%_0%,rgba(0,201,177,0.16),transparent_42%)] px-6 pb-5 pt-6 text-left">
            <div className="flex items-start justify-between gap-6 pr-8">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-brand">{t('clubs.map.workspace_label')}</p>
                <DialogTitle className="mt-1 text-2xl font-black text-white">{filtersTitle}</DialogTitle>
              </div>
            </div>
            <DialogDescription className="sr-only">
              {visibleResults} {t('clubs.map.results')} · {mappableResults} {t('clubs.map.pins')} · {totalResults} {t('clubs.map.total')}
            </DialogDescription>
          </DialogHeader>

          <div className="no-scrollbar min-h-0 flex-1 space-y-5 overflow-y-auto px-6 py-5">
            <section className="rounded-[1.25rem] border border-white/10 bg-white/[0.035] p-4">
              <div className="mb-3 flex items-center justify-between gap-3">
                <h3 className="text-xs font-black uppercase tracking-[0.18em] text-zinc-300">{t('filters.neighborhood')}</h3>
                {filters.neighborhood ? (
                  <button
                    type="button"
                    onClick={() => updateFilter('neighborhood', '')}
                    className="text-xs font-bold text-brand hover:text-brand-light"
                  >
                    {t('filters.clear_all')}
                  </button>
                ) : null}
              </div>
              <div className="flex flex-wrap gap-2">
                {neighborhoods.map((neighborhood) => (
                  <FilterChip
                    key={neighborhood}
                    label={neighborhood}
                    active={filters.neighborhood === neighborhood}
                    onClick={() => updateFilter('neighborhood', filters.neighborhood === neighborhood ? '' : neighborhood)}
                  />
                ))}
              </div>
            </section>

            <section className="rounded-[1.25rem] border border-white/10 bg-white/[0.035] p-4">
              <h3 className="mb-3 text-xs font-black uppercase tracking-[0.18em] text-zinc-300">{t('filters.amenities')}</h3>
              <div className="flex flex-wrap gap-2">
                {amenities.map((amenity) => (
                  <FilterChip
                    key={amenity}
                    label={amenity}
                    active={filters.amenities.includes(amenity)}
                    onClick={() => filters.amenities.includes(amenity)
                      ? removeArrayFilter('amenities', amenity)
                      : addArrayFilter('amenities', amenity)}
                  />
                ))}
              </div>
            </section>

            <section className="rounded-[1.25rem] border border-white/10 bg-white/[0.035] p-4">
              <h3 className="mb-3 text-xs font-black uppercase tracking-[0.18em] text-zinc-300">{t('filters.vibes')}</h3>
              <div className="flex flex-wrap gap-2">
                {vibes.map((vibe) => (
                  <FilterChip
                    key={vibe}
                    label={vibe}
                    active={filters.vibes.includes(vibe)}
                    onClick={() => filters.vibes.includes(vibe)
                      ? removeArrayFilter('vibes', vibe)
                      : addArrayFilter('vibes', vibe)}
                  />
                ))}
              </div>
            </section>

            <section className="rounded-[1.25rem] border border-white/10 bg-white/[0.035] p-4">
              <button
                type="button"
                aria-pressed={filters.isVerified}
                onClick={() => updateFilter('isVerified', !filters.isVerified)}
                className="flex w-full items-center justify-between gap-4 text-left"
              >
                <span>
                  <span className="block text-sm font-black uppercase tracking-[0.16em] text-white">{t('filters.verified_only')}</span>
                  <span className="mt-1 block text-sm text-zinc-500">{t('clubs.map.sort_verified')}</span>
                </span>
                <span
                  className={cn(
                    'inline-flex h-8 w-14 items-center rounded-full border p-1 transition-colors',
                    filters.isVerified ? 'border-brand bg-brand/25' : 'border-white/10 bg-white/[0.04]'
                  )}
                >
                  <span
                    className={cn(
                      'h-6 w-6 rounded-full transition-transform',
                      filters.isVerified ? 'translate-x-6 bg-brand' : 'translate-x-0 bg-zinc-500'
                    )}
                  />
                </span>
              </button>
            </section>
          </div>

          <DialogFooter className="shrink-0 flex-row items-center justify-between border-t border-white/10 bg-[#080a0f]/96 px-6 pb-5 pt-4 sm:space-x-0">
            <Button
              type="button"
              variant="ghost"
              onClick={clearAll}
              className="h-10 rounded-full px-2 text-sm font-semibold text-zinc-400 hover:bg-transparent hover:text-white"
            >
              {t('filters.clear_all')}
            </Button>
            <Button
              type="button"
              variant="primary"
              onClick={() => setFiltersOpen(false)}
              className="h-10 rounded-full px-10 font-black uppercase tracking-[0.14em]"
            >
              {t('common.apply')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function MobileMapSheet({
  query,
  onQueryChange,
  filters,
  onFiltersChange,
  neighborhoods,
  amenities,
  vibes,
  totalResults,
  visibleResults,
  mappableResults,
  list,
  sheetState,
  onSheetStateChange,
}: {
  query: string;
  onQueryChange: (query: string) => void;
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  neighborhoods: string[];
  amenities: string[];
  vibes: string[];
  totalResults: number;
  visibleResults: number;
  mappableResults: number;
  list: ReactNode;
  sheetState: MobileSheetState;
  onSheetStateChange: (state: MobileSheetState) => void;
}) {
  const { t } = useLanguage();
  const shouldReduceMotion = useReducedMotion();
  const dragControls = useDragControls();
  const dragStartedRef = useRef(false);
  const sheetHeights: Record<MobileSheetState, string> = {
    collapsed: '6.75rem',
    mid: '44svh',
    expanded: '78svh',
  };

  const snapByDrag = (offsetY: number) => {
    if (offsetY < -42) {
      onSheetStateChange(sheetState === 'collapsed' ? 'mid' : 'expanded');
      return;
    }

    if (offsetY > 42) {
      onSheetStateChange(sheetState === 'expanded' ? 'mid' : 'collapsed');
    }
  };

  return (
    <motion.div
      className="absolute inset-x-0 bottom-0 z-30 flex overflow-hidden rounded-t-[1.65rem] border border-white/12 bg-[#080a0f] text-white shadow-[0_-24px_70px_rgba(0,0,0,0.55)] lg:hidden"
      initial={false}
      animate={{ height: sheetHeights[sheetState] }}
      transition={shouldReduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 420, damping: 42, mass: 0.9 }}
      drag="y"
      dragControls={dragControls}
      dragListener={false}
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={0.06}
      onDragStart={() => {
        dragStartedRef.current = true;
      }}
      onDragEnd={(_, info) => {
        snapByDrag(info.offset.y);
        window.setTimeout(() => {
          dragStartedRef.current = false;
        }, 250);
      }}
    >
      <div className="flex min-h-0 w-full flex-col">
        <button
          type="button"
          aria-label={t('clubs.map.workspace_title')}
          onClick={() => {
            if (dragStartedRef.current) {
              dragStartedRef.current = false;
              return;
            }
            onSheetStateChange(sheetState === 'collapsed' ? 'mid' : 'collapsed');
          }}
          onPointerDown={(event) => {
            dragControls.start(event);
          }}
          className="shrink-0 px-5 pb-3 pt-2 text-left"
        >
          <span className="mx-auto mb-4 block h-1.5 w-12 rounded-full bg-white/18" />
          <span className="block text-[10px] font-black uppercase tracking-[0.22em] text-brand">
            {t('clubs.map.workspace_label')}
          </span>
        </button>

        {sheetState === 'collapsed' ? null : (
          <>
            <div className="shrink-0 border-b border-white/10 px-5 pb-4">
              <MapModeControls
                query={query}
                onQueryChange={onQueryChange}
                filters={filters}
                onFiltersChange={onFiltersChange}
                neighborhoods={neighborhoods}
                amenities={amenities}
                vibes={vibes}
                totalResults={totalResults}
                visibleResults={visibleResults}
                mappableResults={mappableResults}
                hideHeader
              />
            </div>
            <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto px-3 pb-[calc(1rem+env(safe-area-inset-bottom,0px))] pt-3">
              {list}
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}

export default function ClubDirectoryMapView({
  clubs,
  cityCenter,
  filters,
  onFiltersChange,
  neighborhoods,
  amenities,
  vibes,
  loading = false,
}: ClubDirectoryMapViewProps) {
  const { t } = useLanguage();
  const [query, setQuery] = useState('');
  const [selectedClubId, setSelectedClubId] = useState<string | null>(null);
  const [mobileSheetState, setMobileSheetState] = useState<MobileSheetState>('mid');
  const [mobilePreviewOpen, setMobilePreviewOpen] = useState(false);
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const searchedAndSortedClubs = useMemo(() => {
    return clubs.filter((club) => matchesSearch(club, query));
  }, [clubs, query]);

  const totalMappableClubs = useMemo(
    () => clubs.filter((club) => club.mapPoint !== null),
    [clubs]
  );
  const mappableClubs = useMemo(
    () => searchedAndSortedClubs.filter((club) => club.mapPoint !== null),
    [searchedAndSortedClubs]
  );
  const visibleSelectedClubId = selectedClubId && mappableClubs.some((club) => club.id === selectedClubId)
    ? selectedClubId
    : null;

  const handleSelectClub = (clubId: string) => {
    setSelectedClubId(clubId);
    setMobileSheetState('mid');
    window.requestAnimationFrame(() => {
      cardRefs.current[clubId]?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    });
  };

  const handleMapPreviewOpenChange = useCallback((isOpen: boolean) => {
    setMobilePreviewOpen(isOpen);
    if (!isOpen) {
      setMobileSheetState('mid');
    }
  }, []);

  const list = (
    <div className="space-y-3">
      {mappableClubs.length > 0 ? (
        mappableClubs.map((club) => (
          <div
            key={club.id}
            ref={(node) => {
              cardRefs.current[club.id] = node;
            }}
          >
            <ClubMapListCard
              club={club}
              selected={visibleSelectedClubId === club.id}
              onSelect={handleSelectClub}
            />
          </div>
        ))
      ) : (
        <div className="rounded-[1.5rem] border border-white/8 bg-white/[0.035] p-6 text-center">
          <MapPin className="mx-auto mb-3 h-7 w-7 text-zinc-600" />
          <h3 className="text-base font-bold text-white">{t('clubs.no_results.title')}</h3>
          <p className="mt-2 text-sm leading-6 text-zinc-500">{t('clubs.no_results.subtitle')}</p>
        </div>
      )}
    </div>
  );

  return (
    <section
      data-testid="club-directory-map-view"
      className="relative -mx-4 h-[calc(100svh-7.75rem)] min-h-0 overflow-hidden rounded-[2rem] border border-white/10 bg-[#05090d] shadow-[0_30px_90px_rgba(0,0,0,0.45)] sm:-mx-6 lg:mx-0 lg:h-[clamp(36rem,calc(100svh-9.25rem),47.5rem)] lg:min-h-0"
    >
      <div className="grid h-full min-h-0 lg:grid-cols-[minmax(22.5rem,26.25rem)_1fr]">
        <aside className="hidden h-full min-h-0 flex-col border-r border-white/10 bg-[#080a0f]/96 lg:flex">
          <div className="border-b border-white/10 p-4">
            <MapModeControls
              query={query}
              onQueryChange={setQuery}
              filters={filters}
              onFiltersChange={onFiltersChange}
              neighborhoods={neighborhoods}
              amenities={amenities}
              vibes={vibes}
              totalResults={totalMappableClubs.length}
              visibleResults={mappableClubs.length}
              mappableResults={mappableClubs.length}
            />
            {loading ? (
              <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-brand/25 bg-brand/[0.1] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-brand">
                <Zap className="h-3.5 w-3.5 animate-pulse fill-current" />
                {t('clubs.status.updating_directory')}
              </div>
            ) : null}
          </div>
          <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto p-4 pr-3">
            {list}
          </div>
        </aside>

        <div className="relative h-full min-h-0">
          <ClubDirectoryMap
            clubs={mappableClubs}
            cityCenter={cityCenter}
            selectedClubId={visibleSelectedClubId}
            onSelectClub={handleSelectClub}
            onPreviewOpenChange={handleMapPreviewOpenChange}
            className="h-full min-h-0 rounded-none border-0 shadow-none"
            mapClassName="min-h-0"
          />

          {mobilePreviewOpen ? null : (
            <MobileMapSheet
              query={query}
              onQueryChange={setQuery}
              filters={filters}
              onFiltersChange={onFiltersChange}
              neighborhoods={neighborhoods}
              amenities={amenities}
              vibes={vibes}
              totalResults={totalMappableClubs.length}
              visibleResults={mappableClubs.length}
              mappableResults={mappableClubs.length}
              list={list}
              sheetState={mobileSheetState}
              onSheetStateChange={setMobileSheetState}
            />
          )}

          <div className={cn('pointer-events-none absolute inset-0 z-20 transition-opacity', loading ? 'opacity-100' : 'opacity-0')}>
            <div className="absolute right-5 top-20 inline-flex items-center gap-2 rounded-full border border-brand/25 bg-bg-base/85 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-brand shadow-2xl backdrop-blur-xl">
              <Zap className="h-4 w-4 animate-pulse fill-current" />
              {t('clubs.status.updating_directory')}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
