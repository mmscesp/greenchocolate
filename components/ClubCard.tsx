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

type ClubCardEntity = ClubModel | ClubCardData;

interface ClubCardProps {
  club: ClubCardEntity;
  className?: string;
}

export default function ClubCard({ club, className = '' }: ClubCardProps) {
  const { t, language } = useLanguage();

  return (
    <motion.div 
      className={`group relative ${className}`}
      whileHover={{ y: -8 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      {/* Glow effect on hover */}
      <div className="absolute -inset-1 bg-gradient-to-r from-[#E8A838]/10 to-[#d4962e]/10 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10" />
      
      <div className="relative bg-[#0A0A0A]/80 backdrop-blur-xl rounded-3xl border border-white/5 overflow-hidden h-full transition-all duration-500 group-hover:border-[#E8A838]/20 group-hover:bg-[#0F0F0F]">
        {/* Image Section */}
        <div className="relative h-64 overflow-hidden">
          <Link href={`/${language}/clubs/${club.slug}`} aria-label={`${t('common.view')} ${club.name}`}>
            <Image
              src={club.images[0]}
              alt={club.name}
              fill
              className="object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
            />
          </Link>
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent opacity-90"></div>
          
          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {club.isVerified && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="relative"
              >
                <div className="absolute inset-0 bg-[#E8A838]/15 rounded-full blur-md animate-pulse" />
                <TrustBadge type="verified" size="sm" className="relative bg-black/60 backdrop-blur-md border-[#E8A838]/30" />
              </motion.div>
            )}
            <div className="inline-flex items-center px-3 py-1 bg-black/60 backdrop-blur-sm text-white text-[9px] font-bold uppercase tracking-[0.15em] rounded-full border border-white/10 shadow-lg">
              {club.priceRange}
            </div>
          </div>

          {/* Rating Badge */}
          {club.rating && (
            <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 bg-black/60 backdrop-blur-md rounded-full border border-white/10 shadow-lg">
              <Star className="h-3.5 w-3.5 fill-[#E8A838] text-[#E8A838]" />
              <span className="text-white font-bold text-xs">{club.rating}</span>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-7">
          {/* Title & Location */}
          <div className="mb-5">
            <Link href={`/${language}/clubs/${club.slug}`}>
              <EditorialHeading as="h3" size="md" className="text-white mb-2 group-hover:text-[#E8A838] transition-colors line-clamp-1">
                {club.name}
              </EditorialHeading>
            </Link>
            
            <div className="flex items-center gap-2">
              <MapPin className="h-3 w-3 text-[#E8A838]/70" />
              <ConciergeLabel size="xs" emphasis="medium" className="text-zinc-400 font-sans tracking-widest">{club.neighborhood}</ConciergeLabel>
            </div>
          </div>

          {/* Description */}
          <p className="text-zinc-400 text-sm mb-6 line-clamp-2 leading-relaxed font-serif italic opacity-80">
            {club.description}
          </p>

          {/* Vibe Tags */}
          <div className="flex flex-wrap gap-2 mb-8">
            {club.vibeTags.slice(0, 3).map((vibe, index) => (
              <Badge 
                key={index} 
                variant="outline" 
                className="text-[9px] uppercase tracking-widest border-white/5 text-zinc-400 bg-white/5 px-3 py-0.5 rounded-full"
              >
                {vibe}
              </Badge>
            ))}
          </div>

          {/* Stats */}
          <div className="flex items-center gap-6 mb-8">
            <div className="flex items-center gap-2">
              <Users className="h-3.5 w-3.5 text-[#E8A838]/60" />
              <ConciergeLabel size="xs" emphasis="low" className="text-[9px]">{club.capacity}</ConciergeLabel>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-3.5 w-3.5 text-[#E8A838]/60" />
              <ConciergeLabel size="xs" emphasis="low" className="text-[9px]">{club.foundedYear}</ConciergeLabel>
            </div>
          </div>

          {/* CTA Button */}
          <Link href={`/${language}/clubs/${club.slug}`}>
            <Button 
              className="w-full bg-[#E8A838] hover:bg-[#d4962e] text-black font-black rounded-full transition-all duration-500 border-none group/btn py-6 shadow-[0_8px_20px_-10px_rgba(232,168,56,0.4)]"
            >
              <span className="uppercase tracking-[0.2em] text-[10px]">{t('nav.explore')}</span>
              <ArrowRight className="h-3.5 w-3.5 ml-2 group-hover/btn:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        {/* Bottom accent line */}
        <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#E8A838]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      </div>
    </motion.div>
  );
}
