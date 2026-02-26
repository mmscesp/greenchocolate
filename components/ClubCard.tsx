'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { useLanguage } from '@/hooks/useLanguage';
import type { Club as ClubModel } from '@/lib/types';
import type { ClubCard as ClubCardData } from '@/app/actions/clubs';
import { MapPin, Star, Users, Clock, CheckCircle, ArrowRight, ShieldCheck } from '@/lib/icons';
import TrustBadge from './trust/TrustBadge';

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
      whileHover={{ y: -10 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      {/* Glow effect on hover */}
      <div className="absolute -inset-1 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
      
      <div className="relative bg-midnight-charcoal/50 backdrop-blur-md rounded-3xl border border-white/5 overflow-hidden h-full transition-all duration-500 group-hover:border-primary/30 group-hover:bg-midnight-charcoal/80">
        {/* Image Section */}
        <div className="relative h-64 overflow-hidden">
          <Link href={`/${language}/clubs/${club.slug}`} aria-label={`${t('common.view')} ${club.name}`}>
            <Image
              src={club.images[0]}
              alt={club.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-1000"
            />
          </Link>
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-midnight-charcoal via-transparent to-transparent opacity-80"></div>
          
          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {club.isVerified && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="relative"
              >
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-md animate-pulse" />
                <TrustBadge type="verified" size="sm" className="relative bg-midnight-charcoal/80 backdrop-blur-sm border-primary/50" />
              </motion.div>
            )}
            <div className="inline-flex items-center px-3 py-1 bg-midnight-charcoal/60 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-widest rounded-full border border-white/10">
              {club.priceRange}
            </div>
          </div>

          {/* Rating Badge */}
          {club.rating && (
            <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 bg-black/50 backdrop-blur-sm rounded-full border border-white/20">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-white font-bold text-sm">{club.rating}</span>
              <span className="text-white/60 text-xs">({club.reviewCount})</span>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-6">
          {/* Title & Location */}
          <div className="mb-4">
            <Link href={`/${language}/clubs/${club.slug}`}>
              <h3 className="text-2xl font-serif text-white mb-2 group-hover:text-primary transition-colors line-clamp-1">
                {club.name}
              </h3>
            </Link>
            
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs font-medium uppercase tracking-wider">{club.neighborhood}</span>
            </div>
          </div>

          {/* Description */}
          <p className="text-muted-foreground text-sm mb-6 line-clamp-2 leading-relaxed font-sans">
            {club.description}
          </p>

          {/* Vibe Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {club.vibeTags.slice(0, 3).map((vibe, index) => (
              <Badge 
                key={index} 
                variant="outline" 
                className="text-[10px] uppercase tracking-tighter border-emerald-500/20 text-zinc-300 bg-emerald-500/10 px-2 py-0"
              >
                {vibe}
              </Badge>
            ))}
          </div>

          {/* Stats */}
          <div className="flex items-center gap-6 mb-6 text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
            <div className="flex items-center gap-2">
              <Users className="h-3 w-3 text-primary" />
              <span>{club.capacity}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-3 w-3 text-primary" />
              <span>EST. {club.foundedYear}</span>
            </div>
          </div>

          {/* CTA Button */}
          <Link href={`/${language}/clubs/${club.slug}`}>
            <Button 
              className="w-full bg-secondary hover:bg-primary hover:text-primary-foreground text-foreground font-bold rounded-xl transition-all duration-500 border border-white/5 group/btn py-6"
            >
              <span className="uppercase tracking-widest text-xs">{t('nav.explore')}</span>
              <ArrowRight className="h-4 w-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        {/* Bottom accent line */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full group-hover:w-1/3 transition-all duration-500" />
      </div>
    </motion.div>
  );
}
