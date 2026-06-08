'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useReducedMotion } from 'framer-motion';
import type { Map as MapLibreMap, Marker as MapLibreMarker, NavigationControl, StyleSpecification } from 'maplibre-gl';
import type { ClubCard } from '@/app/actions/clubs';
import { useLanguage } from '@/hooks/useLanguage';
import { getBoundsForMapPoints, type GeoCoordinate } from '@/lib/club-map';
import { buildClubMediaItems, getClubPrimaryMediaImage } from '@/lib/club-media';
import { getCardLocationLabel, getClubStatusLabel } from '@/lib/public-club-safety';
import { ArrowRight, ChevronLeft, ChevronRight, Info, Star, X } from '@/lib/icons';
import { cn } from '@/lib/utils';

const OSM_TILE_URL = process.env.NEXT_PUBLIC_OSM_TILE_URL || 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
const OSM_ATTRIBUTION = '© OpenStreetMap contributors';

const osmRasterStyle: StyleSpecification = {
  version: 8,
  sources: {
    osm: {
      type: 'raster',
      tiles: [OSM_TILE_URL],
      tileSize: 256,
      attribution: OSM_ATTRIBUTION,
    },
  },
  layers: [
    {
      id: 'osm',
      type: 'raster',
      source: 'osm',
    },
  ],
};

interface ClubDirectoryMapProps {
  clubs: ClubCard[];
  cityCenter: GeoCoordinate;
  selectedClubId?: string | null;
  onSelectClub?: (clubId: string) => void;
  onPreviewOpenChange?: (isOpen: boolean) => void;
  className?: string;
  mapClassName?: string;
}

type MapLibreModule = typeof import('maplibre-gl');
type PreviewPosition = { x: number; y: number };

const PREVIEW_CARD_WIDTH = 352;
const PREVIEW_CARD_HEIGHT = 432;
const PREVIEW_CARD_MARGIN = 18;
const PREVIEW_ANCHOR_X_RATIO = 0.5;
const PREVIEW_ANCHOR_Y_RATIO = 0.52;

export function isVerifiedMapClub(club: ClubCard): boolean {
  return getClubStatusLabel(club) === 'Verified Profile';
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function getMapPinMarkup(clubName: string, isVerified: boolean, isSelected: boolean): string {
  const statusIcon = isVerified
    ? '<path d="M8.2 12.1 10.9 14.8 16.4 8.8" />'
    : '<circle cx="12" cy="10.2" r="2.6" />';
  const selectedLabel = isSelected
    ? `<span class="scm-map-marker-label" aria-hidden="true">${escapeHtml(clubName)}</span>`
    : '';

  return `
    <span class="scm-map-marker-pin" aria-hidden="true">
      <svg class="scm-map-marker-icon" viewBox="0 0 24 32" focusable="false" aria-hidden="true">
        <path class="scm-map-marker-shape" d="M12 0C5.4 0 0 5.4 0 12c0 8.7 10.2 18.9 10.7 19.3a1.8 1.8 0 0 0 2.6 0C13.8 30.9 24 20.7 24 12 24 5.4 18.6 0 12 0Zm0 17.1A5.1 5.1 0 1 1 12 6.9a5.1 5.1 0 0 1 0 10.2Z" />
        <g class="scm-map-marker-symbol" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
          ${statusIcon}
        </g>
      </svg>
    </span>
    ${selectedLabel}
  `;
}

function getClubPreviewImages(club: ClubCard) {
  const mediaItems = buildClubMediaItems({
    slug: club.slug,
    name: club.name,
    images: club.images,
    citySlug: club.citySlug,
    neighborhood: club.neighborhood,
    district: club.district,
    isVerified: club.isVerified,
    verificationStatus: club.verificationStatus,
  });

  return mediaItems.map((item) => ({
    src: item.kind === 'video' ? item.poster : item.src,
    alt: item.alt,
  }));
}

function clampPreviewPosition(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function getPreviewAnchor(container: HTMLElement): PreviewPosition {
  const { width, height } = container.getBoundingClientRect();
  const halfWidth = PREVIEW_CARD_WIDTH / 2;
  const halfHeight = PREVIEW_CARD_HEIGHT / 2;
  const minX = halfWidth + PREVIEW_CARD_MARGIN;
  const maxX = Math.max(minX, width - halfWidth - PREVIEW_CARD_MARGIN);
  const minY = halfHeight + PREVIEW_CARD_MARGIN;
  const maxY = Math.max(minY, height - halfHeight - PREVIEW_CARD_MARGIN);

  return {
    x: clampPreviewPosition(width * PREVIEW_ANCHOR_X_RATIO, minX, maxX),
    y: clampPreviewPosition(height * PREVIEW_ANCHOR_Y_RATIO, minY, maxY),
  };
}

function ClubMapPreviewCard({
  club,
  position,
  onClose,
}: {
  club: ClubCard;
  position: PreviewPosition;
  onClose: () => void;
}) {
  const { t, language } = useLanguage();
  const [carouselState, setCarouselState] = useState({ clubId: club.id, imageIndex: 0 });
  const translate = (key: string, fallback: string) => {
    const value = t(key);
    return value === key ? fallback : value;
  };
  const statusLabel = getClubStatusLabel(club);
  const verified = isVerifiedMapClub(club);
  const locationLabel = getCardLocationLabel({
    neighborhood: club.neighborhood,
    cityName: club.cityName,
  });
  const images = useMemo(() => getClubPreviewImages(club), [club]);
  const imageIndex = carouselState.clubId === club.id ? carouselState.imageIndex : 0;
  const activeImage = images[imageIndex] ?? {
    src: getClubPrimaryMediaImage([]),
    alt: club.name,
  };
  const hasCarousel = images.length > 1;
  const mapPreviewControlClassName = 'inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/18 bg-black/80 text-white shadow-[0_12px_28px_rgba(0,0,0,0.46)] backdrop-blur-md transition hover:bg-black/92 hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand';

  const showPreviousImage = () => {
    setCarouselState((current) => {
      const currentIndex = current.clubId === club.id ? current.imageIndex : 0;
      return {
        clubId: club.id,
        imageIndex: currentIndex === 0 ? images.length - 1 : currentIndex - 1,
      };
    });
  };

  const showNextImage = () => {
    setCarouselState((current) => {
      const currentIndex = current.clubId === club.id ? current.imageIndex : 0;
      return {
        clubId: club.id,
        imageIndex: (currentIndex + 1) % images.length,
      };
    });
  };

  const cardContent = (
    <>
      <div className="relative h-52 bg-bg-surface">
        <Image
          src={activeImage.src}
          alt={activeImage.alt}
          fill
          sizes="352px"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/10" />

        <div className="absolute left-3 top-3">
          <span
            className={cn(
              'inline-flex max-w-[13rem] items-center rounded-full border px-3 py-1 text-[9px] font-black uppercase tracking-[0.14em] shadow-lg backdrop-blur-md',
              verified
                ? 'border-brand/50 bg-brand text-black'
                : 'border-amber-300/35 bg-black/75 text-amber-100'
            )}
          >
            {statusLabel}
          </span>
        </div>

        <div className="absolute right-3 top-3 flex items-center gap-2">
          <button
            type="button"
            aria-label={translate('clubs.map.close_preview', 'Close preview')}
            onClick={onClose}
            className={mapPreviewControlClassName}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {hasCarousel ? (
          <>
            <button
              type="button"
              aria-label={translate('common.previous', 'Previous image')}
              onClick={showPreviousImage}
              className={cn('absolute left-3 top-1/2 -translate-y-1/2', mapPreviewControlClassName)}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              aria-label={translate('common.next', 'Next image')}
              onClick={showNextImage}
              className={cn('absolute right-3 top-1/2 -translate-y-1/2', mapPreviewControlClassName)}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            <div className="absolute inset-x-0 bottom-3 flex justify-center gap-1.5">
              {images.slice(0, 6).map((image, index) => (
                <button
                  key={`${image.src}-${index}`}
                  type="button"
                  aria-label={`Image ${index + 1}`}
                  onClick={() => setCarouselState({ clubId: club.id, imageIndex: index })}
                  className={cn(
                    'h-1.5 rounded-full transition-all',
                    index === imageIndex ? 'w-5 bg-white' : 'w-1.5 bg-white/55'
                  )}
                />
              ))}
            </div>
          </>
        ) : null}
      </div>

      <div className="space-y-3 p-4 max-lg:pb-[calc(1rem+env(safe-area-inset-bottom,0px))]">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="line-clamp-1 text-base font-black leading-6 text-white">{club.name}</h3>
            {locationLabel ? (
              <p className="mt-1 line-clamp-1 text-sm font-semibold text-zinc-400">{locationLabel}</p>
            ) : null}
          </div>

          {club.rating ? (
            <span className="inline-flex shrink-0 items-center gap-1 text-sm font-bold text-white">
              <Star className="h-4 w-4 fill-brand text-brand" />
              {club.rating}
              {club.reviewCount ? <span className="text-zinc-500">({club.reviewCount})</span> : null}
            </span>
          ) : null}
        </div>

        <div className="flex flex-wrap gap-1.5">
          {club.vibeTags
            .filter((vibe) => {
              const normalized = vibe.toLowerCase();
              return normalized !== 'public listing' && normalized !== 'unverified' && !normalized.includes('tourist');
            })
            .slice(0, 2)
            .map((vibe) => (
              <span
                key={vibe}
                className="rounded-full border border-white/10 bg-white/[0.05] px-2 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-zinc-400"
              >
                {vibe}
              </span>
            ))}
        </div>

        <Link
          href={`/${language}/clubs/${club.slug}`}
          className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-full border border-brand/20 bg-brand/[0.1] text-[10px] font-black uppercase tracking-[0.16em] text-brand transition hover:bg-brand hover:text-black"
        >
          {t('clubs.card.explore_this_club')}
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </>
  );

  return (
    <>
      <article
        className="absolute z-30 hidden w-[22rem] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[1.35rem] border border-white/12 bg-[#080a0f] text-white shadow-[0_30px_90px_rgba(0,0,0,0.55)] animate-in fade-in zoom-in-95 duration-200 lg:block"
        style={{ left: position.x, top: position.y }}
        aria-label={`${club.name} ${statusLabel}`}
      >
        {cardContent}
      </article>

      <article
        className="absolute inset-x-0 bottom-0 z-40 overflow-hidden rounded-t-[1.65rem] border border-white/12 bg-[#080a0f] text-white shadow-[0_-24px_70px_rgba(0,0,0,0.55)] animate-in slide-in-from-bottom-5 fade-in duration-200 lg:hidden"
        aria-label={`${club.name} ${statusLabel}`}
      >
        {cardContent}
      </article>
    </>
  );
}

export default function ClubDirectoryMap({
  clubs,
  cityCenter,
  selectedClubId: controlledSelectedClubId,
  onSelectClub,
  onPreviewOpenChange,
  className,
  mapClassName,
}: ClubDirectoryMapProps) {
  const { t } = useLanguage();
  const shouldReduceMotion = useReducedMotion();
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const maplibreRef = useRef<MapLibreModule | null>(null);
  const markersRef = useRef<MapLibreMarker[]>([]);
  const [isMapReady, setIsMapReady] = useState(false);
  const [internalSelectedClubId, setInternalSelectedClubId] = useState<string | null>(null);
  const [previewPosition, setPreviewPosition] = useState<PreviewPosition | null>(null);
  const [dismissedPreviewClubId, setDismissedPreviewClubId] = useState<string | null>(null);
  const selectedClubId = controlledSelectedClubId ?? internalSelectedClubId;

  const mappableClubs = useMemo(() => clubs.filter((club) => club.mapPoint !== null), [clubs]);
  const selectedClub = useMemo(
    () => mappableClubs.find((club) => club.id === selectedClubId) ?? null,
    [mappableClubs, selectedClubId]
  );
  const previewOpenClubId = selectedClub && previewPosition && dismissedPreviewClubId !== selectedClub.id
    ? selectedClub.id
    : null;
  const bounds = useMemo(
    () => getBoundsForMapPoints(mappableClubs.map((club) => club.mapPoint!).filter(Boolean)),
    [mappableClubs]
  );

  const selectClub = useCallback((clubId: string) => {
    setInternalSelectedClubId(clubId);
    setDismissedPreviewClubId(null);
    onSelectClub?.(clubId);
  }, [onSelectClub]);

  const closePreview = () => {
    setDismissedPreviewClubId(selectedClubId ?? null);
    setPreviewPosition(null);
  };

  useEffect(() => {
    onPreviewOpenChange?.(Boolean(previewOpenClubId));
  }, [onPreviewOpenChange, previewOpenClubId]);

  useEffect(() => {
    if (selectedClubId) {
      setDismissedPreviewClubId(null);
    }
  }, [selectedClubId]);

  useEffect(() => {
    let isCancelled = false;

    async function createMap() {
      if (!mapContainerRef.current || mapRef.current) {
        return;
      }

      const maplibre = await import('maplibre-gl');
      if (isCancelled || !mapContainerRef.current) {
        return;
      }

      const map = new maplibre.Map({
        container: mapContainerRef.current,
        style: osmRasterStyle,
        center: [cityCenter.lng, cityCenter.lat],
        zoom: 12,
        attributionControl: { compact: false },
        cooperativeGestures: true,
      });

      map.addControl(new maplibre.NavigationControl({ showCompass: false }) as NavigationControl, 'top-right');
      map.on('load', () => {
        if (!isCancelled) {
          setIsMapReady(true);
          map.resize();
        }
      });

      maplibreRef.current = maplibre;
      mapRef.current = map;
    }

    createMap();

    return () => {
      isCancelled = true;
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];
      mapRef.current?.remove();
      mapRef.current = null;
      maplibreRef.current = null;
      setIsMapReady(false);
    };
  }, [cityCenter.lat, cityCenter.lng]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !isMapReady) {
      return;
    }

    if (bounds) {
      map.fitBounds(
        [
          [bounds.west, bounds.south],
          [bounds.east, bounds.north],
        ],
        {
          padding: 72,
          maxZoom: 14,
          duration: shouldReduceMotion ? 0 : 650,
        }
      );
      return;
    }

    map.flyTo({
      center: [cityCenter.lng, cityCenter.lat],
      zoom: 12,
      duration: shouldReduceMotion ? 0 : 650,
    });
  }, [bounds, cityCenter.lat, cityCenter.lng, isMapReady, shouldReduceMotion]);

  useEffect(() => {
    const map = mapRef.current;
    const container = mapContainerRef.current;
    if (!map || !container || !isMapReady || !selectedClub) {
      setPreviewPosition(null);
      return;
    }

    if (!selectedClub?.mapPoint) {
      setPreviewPosition(null);
      return;
    }

    const anchor = getPreviewAnchor(container);
    setPreviewPosition(anchor);

    map.stop();
    map.easeTo({
      center: [selectedClub.mapPoint.lng, selectedClub.mapPoint.lat],
      zoom: Math.max(map.getZoom(), 13.8),
      offset: [
        anchor.x - container.getBoundingClientRect().width / 2,
        anchor.y - container.getBoundingClientRect().height / 2,
      ],
      duration: shouldReduceMotion ? 0 : 620,
      easing: (time) => 1 - Math.pow(1 - time, 3),
      essential: true,
    });
  }, [isMapReady, selectedClub, shouldReduceMotion]);

  useEffect(() => {
    const map = mapRef.current;
    const container = mapContainerRef.current;
    if (!map || !container || !isMapReady || !selectedClub?.mapPoint) {
      setPreviewPosition(null);
      return;
    }

    let animationFrame: number | null = null;
    const updatePreviewPosition = () => {
      if (animationFrame !== null) {
        window.cancelAnimationFrame(animationFrame);
      }

      animationFrame = window.requestAnimationFrame(() => {
        setPreviewPosition(getPreviewAnchor(container));
        animationFrame = null;
      });
    };

    updatePreviewPosition();
    map.on('resize', updatePreviewPosition);

    return () => {
      if (animationFrame !== null) {
        window.cancelAnimationFrame(animationFrame);
      }
      map.off('resize', updatePreviewPosition);
    };
  }, [isMapReady, selectedClub]);

  useEffect(() => {
    const map = mapRef.current;
    const maplibre = maplibreRef.current;
    if (!map || !maplibre || !isMapReady) {
      return;
    }

    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    for (const club of mappableClubs) {
      if (!club.mapPoint) {
        continue;
      }

      if (previewOpenClubId === club.id) {
        continue;
      }

      const isVerified = isVerifiedMapClub(club);
      const statusLabel = getClubStatusLabel(club);
      const locationLabel = getCardLocationLabel({ neighborhood: club.neighborhood, cityName: club.cityName }) ?? club.cityName;
      const isSelected = selectedClubId === club.id;
      const markerButton = document.createElement('button');
      markerButton.type = 'button';
      markerButton.setAttribute('aria-label', `${club.name}, ${statusLabel}, ${locationLabel}`);
      markerButton.className = [
        'scm-map-marker',
        isVerified ? 'scm-map-marker-verified' : 'scm-map-marker-public',
        isSelected ? 'scm-map-marker-selected' : '',
      ]
        .filter(Boolean)
        .join(' ');
      markerButton.innerHTML = getMapPinMarkup(club.name, isVerified, isSelected);
      markerButton.addEventListener('click', () => {
        selectClub(club.id);
      });

      const marker = new maplibre.Marker({ element: markerButton, anchor: 'bottom' })
        .setLngLat([club.mapPoint.lng, club.mapPoint.lat])
        .addTo(map);
      markersRef.current.push(marker);
    }

    return () => {
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];
    };
  }, [isMapReady, mappableClubs, previewOpenClubId, selectedClubId, selectClub, t]);

  return (
    <section className={cn('relative h-full min-h-[520px] overflow-hidden rounded-[2rem] border border-white/10 bg-bg-surface shadow-2xl', className)}>
      <div
        ref={mapContainerRef}
        className={cn('h-full min-h-[520px] w-full bg-bg-base', mapClassName)}
        aria-label={t('clubs.map.aria_label')}
      />

      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(2,10,14,0.2),transparent_28%,rgba(2,10,14,0.24))]" />

      {mappableClubs.length === 0 ? (
        <div className="absolute inset-x-4 top-1/2 z-20 mx-auto max-w-md -translate-y-1/2 rounded-3xl border border-white/10 bg-bg-base/90 p-6 text-center shadow-2xl backdrop-blur-md">
          <Info className="mx-auto mb-4 h-8 w-8 text-brand" />
          <h3 className="text-lg font-bold text-white">{t('clubs.map.empty_title')}</h3>
          <p className="mt-2 text-sm leading-6 text-zinc-400">{t('clubs.map.empty_body')}</p>
        </div>
      ) : null}

      {selectedClub && previewPosition && previewOpenClubId === selectedClub.id ? (
        <ClubMapPreviewCard
          club={selectedClub}
          position={previewPosition}
          onClose={closePreview}
        />
      ) : null}

      <a
        href="https://www.openstreetmap.org/copyright"
        target="_blank"
        rel="noopener noreferrer"
        className="absolute bottom-2 right-2 z-20 rounded bg-white/90 px-2 py-1 text-[10px] font-semibold text-slate-800 shadow"
      >
        {t('clubs.map.attribution')}
      </a>
    </section>
  );
}
