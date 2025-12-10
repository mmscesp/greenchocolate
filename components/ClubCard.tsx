'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Club } from '@/lib/types';
import { MapPin, Star, Users, Clock, CheckCircle, Sparkles, Heart } from 'lucide-react';

interface ClubCardProps {
  club: Club;
  className?: string;
}

export default function ClubCard({ club, className = '' }: ClubCardProps) {
  return (
    <div className={`bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden group card-hover border border-gray-100 ${className}`}>
      {/* Image Section */}
      <div className="relative h-56 overflow-hidden">
        <Image
          src={club.images[0]}
          alt={club.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-700"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {club.isVerified && (
            <Badge variant="verified" className="flex items-center gap-1 shadow-lg backdrop-blur-sm">
              <CheckCircle className="h-3 w-3" />
              Verificado
            </Badge>
          )}
          <Badge variant="secondary" className="bg-black/50 text-white border-none backdrop-blur-sm">
            {club.priceRange}
          </Badge>
        </div>

        {/* Heart Icon */}
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors cursor-pointer">
            <Heart className="h-5 w-5 text-white" />
          </div>
        </div>

        {/* Quick Action Button */}
        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          <Link href={`/clubs/${club.slug}`}>
            <Button variant="cannabis" size="sm" className="shadow-lg backdrop-blur-sm">
              <Sparkles className="h-4 w-4 mr-1" />
              Ver Detalles
            </Button>
          </Link>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-bold text-gray-900 group-hover:text-green-600 transition-colors line-clamp-1">
            {club.name}
          </h3>
          {club.rating && (
            <div className="flex items-center gap-1 text-sm text-gray-600 bg-yellow-50 px-2 py-1 rounded-full">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold">{club.rating}</span>
              <span className="text-gray-400">({club.reviewCount})</span>
            </div>
          )}
        </div>

        {/* Location */}
        <div className="flex items-center gap-2 text-gray-600 mb-4">
          <div className="p-1 bg-green-100 rounded-full">
            <MapPin className="h-3 w-3 text-green-600" />
          </div>
          <span className="text-sm font-medium">{club.neighborhood}</span>
        </div>

        {/* Description */}
        <p className="text-gray-600 mb-4 line-clamp-2 leading-relaxed">
          {club.description}
        </p>

        {/* Vibe Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {club.vibeTags.slice(0, 3).map((vibe, index) => (
            <Badge 
              key={index} 
              variant="outline" 
              className="text-xs border-green-200 text-green-700 hover:bg-green-50 transition-colors"
            >
              {vibe}
            </Badge>
          ))}
          {club.vibeTags.length > 3 && (
            <Badge variant="outline" className="text-xs border-gray-200 text-gray-500">
              +{club.vibeTags.length - 3}
            </Badge>
          )}
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-6 bg-gray-50 rounded-lg p-3">
          <div className="flex items-center gap-2">
            <div className="p-1 bg-blue-100 rounded-full">
              <Users className="h-3 w-3 text-blue-600" />
            </div>
            <span className="font-medium">{club.capacity} max</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="p-1 bg-purple-100 rounded-full">
              <Clock className="h-3 w-3 text-purple-600" />
            </div>
            <span className="font-medium">Desde {club.foundedYear}</span>
          </div>
        </div>

        {/* CTA Button */}
        <Link href={`/clubs/${club.slug}`}>
          <Button variant="cannabis" className="w-full group/btn">
            <span className="group-hover/btn:scale-105 transition-transform">
              Explorar Club
            </span>
            <Sparkles className="h-4 w-4 ml-2 group-hover/btn:rotate-12 transition-transform" />
          </Button>
        </Link>
      </div>
    </div>
  );
}