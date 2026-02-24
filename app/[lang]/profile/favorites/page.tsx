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
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">{t('user.favorites')}</h1>
        <p className="text-muted-foreground mt-1">
          {t('favorites.subtitle')}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="shadow-sm">
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm font-medium text-muted-foreground">{t('favorites.stats.total')}</p>
              <p className="text-2xl font-bold text-foreground">{favoriteClubs.length}</p>
            </div>
            <div className="bg-red-500/10 p-3 rounded-xl">
              <Heart className="h-6 w-6 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm font-medium text-muted-foreground">{t('favorites.stats.visited')}</p>
              <p className="text-2xl font-bold text-foreground">3</p>
            </div>
            <div className="bg-green-500/10 p-3 rounded-xl">
              <MapPin className="h-6 w-6 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm font-medium text-muted-foreground">{t('favorites.stats.upcoming')}</p>
              <p className="text-2xl font-bold text-foreground">2</p>
            </div>
            <div className="bg-blue-500/10 p-3 rounded-xl">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <Card className="shadow-sm">
        <CardContent className="p-5">
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder={t('favorites.search_placeholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* View Mode Toggle */}
            <div className="flex bg-muted p-1 rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={cn(
                  "px-4 py-2 flex items-center gap-2 text-sm font-medium rounded-md transition-all",
                  viewMode === 'grid'
                    ? "bg-background shadow-sm text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Grid className="h-4 w-4" />
                <span className="sr-only sm:not-sr-only">{t('common.grid')}</span>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={cn(
                  "px-4 py-2 flex items-center gap-2 text-sm font-medium rounded-md transition-all",
                  viewMode === 'list'
                    ? "bg-background shadow-sm text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <List className="h-4 w-4" />
                <span className="sr-only sm:not-sr-only">{t('common.list')}</span>
              </button>
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
                "overflow-hidden hover:shadow-lg transition-all duration-300 group",
                viewMode === 'list' && "flex flex-col md:flex-row"
              )}
            >
              <div className={cn(
                "relative overflow-hidden",
                viewMode === 'list' ? "w-full md:w-64 h-48 md:h-auto" : "h-48"
              )}>
                <Image
                  src={club.images[0]}
                  alt={club.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3">
                  <Button
                    size="icon"
                    variant="destructive"
                    className="h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeFavorite(club.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="absolute top-3 left-3">
                  <div className="bg-background/90 backdrop-blur-sm p-1.5 rounded-full shadow-sm">
                    <Heart className="h-4 w-4 text-red-500 fill-red-500" />
                  </div>
                </div>
              </div>

              <div className="flex flex-col flex-1">
                <CardHeader className="p-4 pb-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors">
                        {club.name}
                      </h3>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                        <MapPin className="h-3 w-3" />
                        <span>{club.neighborhood}</span>
                      </div>
                    </div>
                    {club.rating && (
                      <Badge variant="secondary" className="flex items-center gap-1 bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400">
                        <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                        <span>{club.rating}</span>
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent className="p-4 pt-0 flex-1">
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                    {club.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {club.vibeTags.slice(0, 2).map(vibe => (
                      <Badge key={vibe} variant="outline" className="text-xs">
                        {vibe}
                      </Badge>
                    ))}
                    <Badge variant="secondary" className="text-xs">
                      {club.priceRange}
                    </Badge>
                  </div>
                </CardContent>

                <CardFooter className="p-4 pt-0 gap-2">
                  <Link href={`/${language}/clubs/${club.slug}`} className="flex-1">
                    <Button className="w-full">
                      {t('favorites.view_club')}
                    </Button>
                  </Link>
                  <Button variant="outline" size="icon">
                    <Calendar className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="py-16 text-center shadow-sm">
          <CardContent>
            <div className="bg-muted w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="h-10 w-10 text-muted-foreground/50" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-foreground">
              {searchQuery ? t('favorites.no_results_search') : t('favorites.no_results_empty')}
            </h3>
            <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
              {searchQuery
                ? t('favorites.no_results_search_desc') || 'Try adjusting your search terms'
                : t('favorites.no_results_empty_desc') || 'Explore clubs and add them to your favorites'
              }
            </p>
            {!searchQuery && (
              <Link href={`/${language}/clubs`}>
                <Button className="gap-2">
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
