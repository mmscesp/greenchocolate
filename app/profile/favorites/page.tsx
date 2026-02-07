'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/hooks/useLanguage';
import { useClubs } from '@/hooks/useClubs';
import { 
  Heart, 
  Star, 
  MapPin, 
  Calendar, 
  Filter,
  Search,
  Grid,
  List,
  Trash2
} from 'lucide-react';

export default function FavoritesPage() {
  const { t } = useLanguage();
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
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{t('user.favorites')}</h1>
        <p className="text-gray-600 mt-2">
          Tus clubs favoritos guardados para acceso rápido
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Favoritos</p>
              <p className="text-2xl font-bold text-red-600">{favoriteClubs.length}</p>
            </div>
            <div className="bg-red-100 p-3 rounded-full">
              <Heart className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Clubs Visitados</p>
              <p className="text-2xl font-bold text-green-600">3</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <MapPin className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Próximas Visitas</p>
              <p className="text-2xl font-bold text-blue-600">2</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-4 justify-between">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar en favoritos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
            />
          </div>

          {/* View Mode Toggle */}
          <div className="flex bg-gray-100 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-4 py-2 flex items-center gap-2 text-sm font-medium transition-colors ${
                viewMode === 'grid'
                  ? 'bg-green-600 text-white'
                  : 'text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Grid className="h-4 w-4" />
              Cuadrícula
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 flex items-center gap-2 text-sm font-medium transition-colors ${
                viewMode === 'list'
                  ? 'bg-green-600 text-white'
                  : 'text-gray-700 hover:bg-gray-200'
              }`}
            >
              <List className="h-4 w-4" />
              Lista
            </button>
          </div>
        </div>
      </div>

      {/* Favorites List */}
      {filteredFavorites.length > 0 ? (
        <div className={viewMode === 'grid' 
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
          : 'space-y-4'
        }>
          {filteredFavorites.map(club => (
            <div 
              key={club.id} 
              className={`bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group ${
                viewMode === 'list' ? 'flex' : ''
              }`}
            >
              <div className={`relative ${viewMode === 'list' ? 'w-48 h-32' : 'h-48'} overflow-hidden`}>
                <Image
                  src={club.images[0]}
                  alt={club.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3">
                  <button
                    onClick={() => removeFavorite(club.id)}
                    className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="absolute top-3 left-3">
                  <Heart className="h-5 w-5 text-red-500 fill-red-500" />
                </div>
              </div>

              <div className="p-6 flex-1">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-green-600 transition-colors">
                    {club.name}
                  </h3>
                  {club.rating && (
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{club.rating}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 text-gray-600 mb-3">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm">{club.neighborhood}</span>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {club.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {club.vibeTags.slice(0, 2).map(vibe => (
                    <Badge key={vibe} variant="outline" className="text-xs">
                      {vibe}
                    </Badge>
                  ))}
                  <Badge variant="secondary" className="text-xs">
                    {club.priceRange}
                  </Badge>
                </div>

                <div className="flex gap-2">
                  <Link href={`/clubs/${club.slug}`} className="flex-1">
                    <Button variant="cannabis" size="sm" className="w-full">
                      Ver Club
                    </Button>
                  </Link>
                  <Button variant="outline" size="sm">
                    <Calendar className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="bg-white rounded-xl p-8 max-w-md mx-auto">
            <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchQuery ? 'No se encontraron favoritos' : 'No tienes favoritos aún'}
            </h3>
            <p className="text-gray-600 mb-4">
              {searchQuery 
                ? 'Prueba con otros términos de búsqueda'
                : 'Explora clubs y guarda tus favoritos para acceso rápido'
              }
            </p>
            {!searchQuery && (
              <Link href="/clubs">
                <Button variant="cannabis">
                  {t('nav.explore')}
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}