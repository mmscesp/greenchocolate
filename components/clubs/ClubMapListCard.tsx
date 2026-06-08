'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { ClubCard } from '@/app/actions/clubs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/useLanguage';
import { buildClubMediaItems, getClubPrimaryMediaImage } from '@/lib/club-media';
import { ArrowRight, MapPin, ShieldCheck, Star } from '@/lib/icons';
import { getCardLocationLabel, getClubStatusLabel, sanitizePublicClubCopy } from '@/lib/public-club-safety';
import { cn } from '@/lib/utils';

interface ClubMapListCardProps {
  club: ClubCard;
  selected: boolean;
  onSelect: (clubId: string) => void;
  className?: string;
}

function isVerifiedProfile(club: ClubCard): boolean {
  return getClubStatusLabel(club) === 'Verified Profile';
}

export default function ClubMapListCard({ club, selected, onSelect, className }: ClubMapListCardProps) {
  const { t, language } = useLanguage();
  const statusLabel = getClubStatusLabel(club);
  const verified = isVerifiedProfile(club);
  const locationLabel = getCardLocationLabel({
    neighborhood: club.neighborhood,
    cityName: club.cityName,
  });
  const safeDescription = sanitizePublicClubCopy(club.shortDescription || club.description, locationLabel ?? club.cityName);
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
  const primaryImage = getClubPrimaryMediaImage(mediaItems);
  const visibleVibes = club.vibeTags.filter((vibe) => {
    const normalized = vibe.toLowerCase();
    return normalized !== 'public listing' && normalized !== 'unverified' && !normalized.includes('tourist');
  });

  return (
    <article
      data-club-map-card={club.id}
      className={cn(
        'group relative overflow-hidden rounded-[1.35rem] border bg-[#080d12]/92 text-left shadow-[0_18px_45px_rgba(0,0,0,0.28)] transition-all duration-200',
        selected
          ? 'border-brand/70 ring-2 ring-brand/35'
          : 'border-white/9 hover:border-brand/35 hover:bg-[#0a131a]',
        className
      )}
    >
      <button
        type="button"
        aria-pressed={selected}
        aria-label={`${t('clubs.map.select_profile')} ${club.name}`}
        onClick={() => onSelect(club.id)}
        className="block w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/60"
      >
        <div className="grid grid-cols-[8.5rem_1fr] gap-3 p-3 sm:grid-cols-[9.25rem_1fr]">
          <div className="relative min-h-[9rem] overflow-hidden rounded-[1rem] bg-bg-surface">
            <Image
              src={primaryImage}
              alt={club.name}
              fill
              sizes="150px"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
            <div
              className={cn(
                'absolute left-2 top-2 inline-flex max-w-[calc(100%-1rem)] items-center gap-1 rounded-full border px-2 py-1 text-[8px] font-black uppercase tracking-[0.12em] shadow-lg backdrop-blur-md',
                verified
                  ? 'border-brand/50 bg-brand text-black'
                  : 'border-amber-300/30 bg-bg-base/75 text-amber-100'
              )}
            >
              {verified ? <ShieldCheck className="h-3 w-3" /> : <MapPin className="h-3 w-3" />}
              <span className="truncate">{statusLabel}</span>
            </div>
          </div>

          <div className="min-w-0 py-1 pr-1">
            <div className="flex min-w-0 items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="line-clamp-1 text-base font-bold leading-6 text-white transition-colors group-hover:text-brand">
                  {club.name}
                </h3>
                {locationLabel ? (
                  <p className="mt-1 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
                    <MapPin className="h-3 w-3 shrink-0 text-brand/70" />
                    <span className="truncate">{locationLabel}</span>
                  </p>
                ) : null}
              </div>

              {club.rating ? (
                <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-white/10 bg-white/[0.06] px-2 py-1 text-xs font-bold text-white">
                  <Star className="h-3 w-3 fill-brand text-brand" />
                  {club.rating}
                </span>
              ) : null}
            </div>

            <p className="mt-3 line-clamp-2 text-xs leading-5 text-zinc-400">{safeDescription}</p>

            <div className="mt-3 flex flex-wrap gap-1.5">
              {visibleVibes.slice(0, 2).map((vibe) => (
                <Badge
                  key={vibe}
                  variant="secondary"
                  className="rounded-full border-white/5 bg-white/[0.05] px-2 py-0.5 text-[8px] uppercase tracking-[0.12em] text-zinc-400"
                >
                  {vibe}
                </Badge>
              ))}
              {!club.mapPoint ? (
                <Badge className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[8px] uppercase tracking-[0.12em] text-zinc-500">
                  {t('clubs.map.no_pin')}
                </Badge>
              ) : null}
            </div>
          </div>
        </div>
      </button>

      <div className="border-t border-white/7 px-3 pb-3 pt-2">
        <Button
          asChild
          variant="secondary"
          size="sm"
          className="h-10 w-full rounded-full border border-brand/20 bg-brand/[0.08] text-[10px] font-black uppercase tracking-[0.16em] text-brand hover:bg-brand hover:text-black"
        >
          <Link href={`/${language}/clubs/${club.slug}`}>
            {t('clubs.card.explore_this_club')}
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </Button>
      </div>
    </article>
  );
}
