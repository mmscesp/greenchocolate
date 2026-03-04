'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { useLanguage } from '@/hooks/useLanguage';
import type { Club as ClubModel } from '@/lib/types';
import type { ClubCard as ClubCardData } from '@/app/actions/clubs';
import { MapPin, Star, Users, Clock, ArrowRight } from '@/lib/icons';
import TrustBadge from './trust/TrustBadge';
import { EditorialHeading } from './landing/editorial-concierge/typography/EditorialHeading';
import { ConciergeLabel } from './landing/editorial-concierge/typography/ConciergeLabel';
import { cn } from '@/lib/utils';

type ClubCardEntity = ClubModel | ClubCardData;

interface ClubCardProps {
  club: ClubCardEntity;
  className?: string;
}

export default function ClubCard({ club, className = '' }: ClubCardProps) {
  const { t, language } = useLanguage();

  return (
    <motion.div 
      className={cn("group relative h-full", className)}
      whileHover={{ y: -8 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      {/* Glow effect on hover */}
      <div className="absolute -inset-1 bg-gradient-to-r from-gold/10 to-gold-dark/10 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10" />
      
      <div className="relative bg-bg-base/80 backdrop-blur-xl rounded-3xl border border-white/5 overflow-hidden h-full flex flex-col transition-all duration-500 group-hover:border-gold/20 group-hover:bg-bg-surface">
        {/* Image Section */}
        <div className="relative h-56 sm:h-64 overflow-hidden flex-shrink-0">
          <Link href={`/${language}/clubs/${club.slug}`} aria-label={`${t('common.view')} ${club.name}`}>
            <Image
              src={club.images[0]}
              alt={club.name}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
              className="object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
            />
          </Link>
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-bg-base via-transparent to-transparent opacity-90"></div>
          
          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {club.isVerified && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="relative"
              >
                <div className="absolute inset-0 bg-gold/15 rounded-full blur-md animate-pulse" />
                <TrustBadge type="verified" size="sm" className="relative bg-black/60 backdrop-blur-md border-gold/30 scale-90 sm:scale-100 origin-left" />
                <TrustBadge type="verified" size="sm" className="relative bg-black/60 backdrop-blur-md border-[#E8A838]/30 scale-90 sm:scale-100 origin-left" />
              </motion.div>
            )}
            <div className="inline-flex items-center px-2.5 py-1 bg-black/60 backdrop-blur-sm text-white text-[8px] sm:text-[9px] font-bold uppercase tracking-[0.15em] rounded-full border border-white/10 shadow-lg w-fit">
              {club.priceRange}
            </div>
          </div>

          {/* Rating Badge */}
          {club.rating && (
            <div className="absolute top-4 right-4 flex items-center gap-1.5 px-2.5 py-1.5 bg-black/60 backdrop-blur-md rounded-full border border-white/10 shadow-lg">
              <Star className="h-3 w-3 sm:h-3.5 sm:w-3.5 fill-gold text-gold" />
              <span className="text-white font-bold text-[10px] sm:text-xs">{club.rating}</span>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-5 sm:p-7 flex flex-col flex-1">
          {/* Title & Location */}
          <div className="mb-4 sm:mb-5">
            <Link href={`/${language}/clubs/${club.slug}`}>
              <EditorialHeading as="h3" size="sm" className="text-white mb-2 group-hover:text-gold transition-colors line-clamp-1">
                {club.name}
              </EditorialHeading>
            </Link>
            
            <div className="flex items-center gap-2">
              <MapPin className="h-3 w-3 text-gold/70" />
              <ConciergeLabel size="xs" emphasis="medium" className="text-zinc-400 font-sans tracking-widest text-[10px] sm:text-[11px]">{club.neighborhood}</ConciergeLabel>
            </div>
          </div>

          {/* Description */}
          <p className="text-zinc-400 text-xs sm:text-sm mb-6 line-clamp-2 leading-relaxed font-serif italic opacity-80">
            {club.description}
          </p>

          {/* Vibe Tags */}
          <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-6 sm:mb-8">
            {club.vibeTags.slice(0, 3).map((vibe, index) => (
              <Badge 
                key={index} 
                variant="outline" 
                className="text-[8px] sm:text-[9px] uppercase tracking-widest border-white/5 text-zinc-400 bg-white/5 px-2.5 sm:px-3 py-0.5 rounded-full"
              >
                {vibe}
              </Badge>
            ))}
          </div>

          {/* Spacer to push stats and button to bottom */}
          <div className="mt-auto">
            {/* Stats */}
            <div className="flex items-center gap-6 mb-6 sm:mb-8">
              <div className="flex items-center gap-2">
                <Users className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-gold/60" />
                <ConciergeLabel size="xs" emphasis="low" className="text-[8px] sm:text-[9px]">{club.capacity}</ConciergeLabel>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-gold/60" />
                <ConciergeLabel size="xs" emphasis="low" className="text-[8px] sm:text-[9px]">{club.foundedYear}</ConciergeLabel>
              </div>
            </div>

            {/* CTA Button */}
            <Link href={`/${language}/clubs/${club.slug}`}>
              <Button 
                className="w-full bg-gold hover:bg-gold-dark text-black font-black rounded-full transition-all duration-500 border-none group/btn h-12 sm:h-14 shadow-[0_8px_20px_-10px_hsl(var(--gold)/0.4)]"
              >
                <span className="uppercase tracking-[0.2em] text-[10px]">{t('nav.explore')}</span>
                <ArrowRight className="h-3.5 w-3.5 ml-2 group-hover/btn:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Bottom accent line */}
        <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-gold/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      </div>
    </motion.div>
  );
}
