'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { useLanguage } from '@/hooks/useLanguage';
import { useClubs } from '@/hooks/useClubs';
import { Heart, 
Star, 
MapPin, 
Calendar, 
Search,
Grid,
List,
Trash2,
ExternalLink } from '@/lib/icons';
import { cn } from '@/lib/utils';

export default function FavoritesPage() {
  const { t, language } = useLanguage();
  const { clubs } = useClubs();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Mock favorite clubs (first 4 clubs as favorites)
  const [favoriteClubs, setFavoriteClubs] = useState(clubs.slice(0, 4));

  const filteredFavorites = favoriteClubs.filter(club =>
    club.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    club.neighborhood.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const removeFavorite = (clubId: string) => {
    setFavoriteClubs(prev => prev.filter(club => club.id !== clubId));
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 text-white">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-serif tracking-tight text-white">{t('user.favorites')}</h1>
        <p className="text-zinc-400 mt-1 font-serif italic">
          {t('favorites.subtitle')}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="shadow-xl bg-bg-base border border-white/5">
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">{t('favorites.stats.total')}</p>
              <p className="text-3xl font-serif text-white">{favoriteClubs.length}</p>
            </div>
            <div className="bg-brand/10 p-3 rounded-full border border-brand/20">
              <Heart className="h-6 w-6 text-brand" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-xl bg-bg-base border border-white/5">
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">{t('favorites.stats.visited')}</p>
              <p className="text-3xl font-serif text-white">3</p>
            </div>
            <div className="bg-white/5 p-3 rounded-full border border-white/10">
              <MapPin className="h-6 w-6 text-zinc-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-xl bg-bg-base border border-white/5">
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">{t('favorites.stats.upcoming')}</p>
              <p className="text-3xl font-serif text-white">2</p>
            </div>
            <div className="bg-white/5 p-3 rounded-full border border-white/10">
              <Calendar className="h-6 w-6 text-zinc-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <Card className="shadow-xl bg-bg-base border border-white/5">
        <CardContent className="p-5">
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
              <Input
                type="text"
                placeholder={t('favorites.search_placeholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-11 bg-white/5 border-white/10 text-white placeholder:text-zinc-600 focus:border-brand/50 focus:ring-brand/20 h-11 rounded-xl"
              />
            </div>

            {/* View Mode Toggle */}
            <div className="flex bg-white/5 p-1 rounded-xl border border-white/5">
              <Button
                type="button"
                variant={viewMode === 'grid' ? 'primary' : 'secondary'}
                size="sm"
                aria-pressed={viewMode === 'grid'}
                onClick={() => setViewMode('grid')}
                className="rounded-lg"
              >
                <Grid className="h-4 w-4" />
                <span className="sr-only sm:not-sr-only">{t('common.grid')}</span>
              </Button>
              <Button
                type="button"
                variant={viewMode === 'list' ? 'primary' : 'secondary'}
                size="sm"
                aria-pressed={viewMode === 'list'}
                onClick={() => setViewMode('list')}
                className="rounded-lg"
              >
                <List className="h-4 w-4" />
                <span className="sr-only sm:not-sr-only">{t('common.list')}</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Favorites List */}
      {filteredFavorites.length > 0 ? (
        <div className={viewMode === 'grid' 
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
          : 'space-y-4'
        }>
          {filteredFavorites.map(club => (
            <Card 
              key={club.id} 
              className={cn(
                "overflow-hidden border border-white/5 bg-bg-base hover:border-brand/50 hover:shadow-2xl transition-all duration-500 group",
                viewMode === 'list' && "flex flex-col md:flex-row"
              )}
            >
              <div className={cn(
                "relative overflow-hidden",
                viewMode === 'list' ? "w-full md:w-64 h-48 md:h-auto" : "h-56"
              )}>
                <Image
                  src={club.images[0]}
                  alt={club.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                
                <div className="absolute top-3 right-3 z-10">
                  <Button
                    size="icon"
                    variant="ghost"
                    aria-label={t('favorites.remove')}
                    className="h-9 w-9 rounded-full opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
                    onClick={() => removeFavorite(club.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="absolute top-3 left-3 z-10">
                  <div className="bg-brand p-2 rounded-full shadow-lg shadow-brand/20">
                    <Heart className="h-4 w-4 text-black fill-black" />
                  </div>
                </div>
              </div>

              <div className="flex flex-col flex-1 p-5">
                <CardHeader className="p-0 pb-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-serif text-xl text-white group-hover:text-brand transition-colors line-clamp-1">
                        {club.name}
                      </h3>
                      <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-zinc-500 mt-2">
                        <MapPin className="h-3.5 w-3.5 text-brand" />
                        <span>{club.neighborhood}</span>
                      </div>
                    </div>
                    {club.rating && (
                      <Badge variant="secondary" className="flex items-center gap-1 bg-white/5 text-white border-white/10 px-2 py-1 h-7">
                        <Star className="h-3 w-3 fill-brand text-brand" />
                        <span className="text-[10px] font-bold">{club.rating}</span>
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent className="p-0 flex-1">
                  <p className="text-sm text-zinc-400 line-clamp-2 mb-4 font-serif italic leading-relaxed">
                    {club.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {club.vibeTags.slice(0, 2).map(vibe => (
                      <span key={vibe} className="text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded-md bg-white/5 text-zinc-400 border border-white/5">
                        {vibe}
                      </span>
                    ))}
                    <span className="text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded-md bg-brand/10 text-brand border border-brand/20">
                      {club.priceRange}
                    </span>
                  </div>
                </CardContent>

                <CardFooter className="p-0 gap-3 pt-2 border-t border-white/5 mt-auto">
                  <Link href={`/${language}/clubs/${club.slug}`} className="flex-1">
                    <Button variant="primary" className="h-10 w-full rounded-full text-[10px]">
                      {t('favorites.view_club')}
                    </Button>
                  </Link>
                  <Button variant="ghost" size="icon" aria-label={t('bookings.book_new_visit')} className="h-10 w-10 rounded-full">
                    <Calendar className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="py-20 text-center shadow-xl bg-bg-base border border-white/5">
          <CardContent>
            <div className="bg-white/5 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/5">
              <Heart className="h-8 w-8 text-zinc-600" />
            </div>
            <h3 className="text-xl font-serif text-white mb-2">
              {searchQuery ? t('favorites.no_results_search') : t('favorites.no_results_empty')}
            </h3>
            <p className="text-zinc-500 mb-8 max-w-sm mx-auto font-serif italic">
              {searchQuery
                ? t('favorites.no_results_search_desc')
                : t('favorites.no_results_empty_desc')
              }
            </p>
            {!searchQuery && (
              <Link href={`/${language}/clubs`}>
                <Button variant="primary" className="gap-2 rounded-full px-8 py-6 text-[10px]">
                  <ExternalLink className="h-4 w-4" />
                  {t('nav.explore')}
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
