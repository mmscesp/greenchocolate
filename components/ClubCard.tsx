'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { useLanguage } from '@/hooks/useLanguage';
import type { Club as ClubModel } from '@/lib/types';
import type { ClubCard as ClubCardData } from '@/app/actions/clubs';
import { MapPin, Star, Users, Clock, CheckCircle, ArrowRight } from 'lucide-react';

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
      
      <div className="relative bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 overflow-hidden h-full transition-all duration-500 group-hover:border-green-500/30 group-hover:bg-white/[0.07]">
        {/* Image Section */}
        <div className="relative h-60 overflow-hidden">
          <Link href={`/${language}/clubs/${club.slug}`} aria-label={`${t('common.view')} ${club.name}`}>
            <Image
              src={club.images[0]}
              alt={club.name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-700"
            />
          </Link>
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/20 to-transparent opacity-60"></div>
          
          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {club.isVerified && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-500/90 backdrop-blur-sm text-white text-xs font-bold rounded-full shadow-lg"
              >
                <CheckCircle className="h-3.5 w-3.5" />
                {t('filters.verified')}
              </motion.div>
            )}
            <div className="inline-flex items-center px-3 py-1.5 bg-black/50 backdrop-blur-sm text-white text-xs font-bold rounded-full border border-white/20">
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
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-green-400 transition-colors line-clamp-1">
                {club.name}
              </h3>
            </Link>
            
            <div className="flex items-center gap-2 text-zinc-400">
              <div className="p-1 bg-green-500/10 rounded-full">
                <MapPin className="h-3 w-3 text-green-400" />
              </div>
              <span className="text-sm font-medium">{club.neighborhood}</span>
            </div>
          </div>

          {/* Description */}
          <p className="text-zinc-400 text-sm mb-4 line-clamp-2 leading-relaxed">
            {club.description}
          </p>

          {/* Vibe Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {club.vibeTags.slice(0, 3).map((vibe, index) => (
              <Badge 
                key={index} 
                variant="outline" 
                className="text-xs border-white/10 text-zinc-300 hover:bg-white/5 transition-colors bg-white/5"
              >
                {vibe}
              </Badge>
            ))}
            {club.vibeTags.length > 3 && (
              <Badge variant="outline" className="text-xs border-white/10 text-zinc-500 bg-white/5">
                +{club.vibeTags.length - 3}
              </Badge>
            )}
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 mb-5 text-sm">
            <div className="flex items-center gap-2 text-zinc-400">
              <div className="p-1 bg-green-500/10 rounded-full">
                <Users className="h-3 w-3 text-green-400" />
              </div>
              <span className="font-medium">{club.capacity}</span>
            </div>
            <div className="w-px h-4 bg-white/10" />
            <div className="flex items-center gap-2 text-zinc-400">
              <div className="p-1 bg-green-500/10 rounded-full">
                <Clock className="h-3 w-3 text-green-400" />
              </div>
              <span className="font-medium">{club.foundedYear}</span>
            </div>
          </div>

          {/* CTA Button */}
          <Link href={`/${language}/clubs/${club.slug}`}>
            <Button 
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white font-bold rounded-xl transition-all duration-300 shadow-lg shadow-green-500/20 group/btn"
            >
              <span>{t('nav.explore')}</span>
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
