'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { FilterOptions } from '@/lib/types';
import { NEIGHBORHOODS, AMENITIES, VIBE_TAGS } from '@/lib/constants';
import { Filter, X, MapPin, Star, DollarSign, CheckCircle, Sparkles, Search } from 'lucide-react';

interface FilterBarProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  totalResults: number;
}

export default function FilterBar({ filters, onFiltersChange, totalResults }: FilterBarProps) {
  const [showFilters, setShowFilters] = useState(false);

  const updateFilter = (key: keyof FilterOptions, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const toggleArrayFilter = (key: 'amenities' | 'vibes' | 'priceRange', value: string) => {
    const currentArray = filters[key] as string[];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    updateFilter(key, newArray);
  };

  const clearAllFilters = () => {
    onFiltersChange({
      neighborhood: '',
      amenities: [],
      vibes: [],
      isVerified: false,
      priceRange: [],
      rating: 0
    });
  };

  const hasActiveFilters = filters.neighborhood || 
    filters.amenities.length > 0 || 
    filters.vibes.length > 0 || 
    filters.isVerified || 
    filters.priceRange.length > 0 || 
    filters.rating > 0;

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-gray-200 p-6 mb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button
            variant={showFilters ? "cannabis" : "outline"}
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 transition-all duration-300"
          >
            <Filter className="h-4 w-4" />
            Filtros Avanzados
            {hasActiveFilters && (
              <Badge variant="cannabis" className="ml-2 px-2 py-0 text-xs">
                {[
                  filters.neighborhood ? 1 : 0,
                  filters.amenities.length,
                  filters.vibes.length,
                  filters.isVerified ? 1 : 0,
                  filters.priceRange.length,
                  filters.rating > 0 ? 1 : 0
                ].reduce((a, b) => a + b, 0)}
              </Badge>
            )}
          </Button>
          
          <div className="flex items-center gap-2 text-gray-600">
            <Search className="h-4 w-4" />
            <span className="font-medium">
              {totalResults} clubs encontrados
            </span>
          </div>
        </div>
        
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-red-600 hover:text-red-700 hover:bg-red-50 transition-all duration-300"
          >
            <X className="h-4 w-4 mr-1" />
            Limpiar filtros
          </Button>
        )}
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 mb-6 p-4 bg-green-50 rounded-xl border border-green-200">
          <span className="text-sm font-medium text-green-800 mr-2">Filtros activos:</span>
          
          {filters.neighborhood && (
            <Badge variant="cannabis" className="flex items-center gap-1 animate-pulse">
              <MapPin className="h-3 w-3" />
              {filters.neighborhood}
              <X 
                className="h-3 w-3 cursor-pointer hover:scale-110 transition-transform" 
                onClick={() => updateFilter('neighborhood', '')}
              />
            </Badge>
          )}
          
          {filters.amenities.map(amenity => (
            <Badge key={amenity} variant="secondary" className="flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              {amenity}
              <X 
                className="h-3 w-3 cursor-pointer hover:scale-110 transition-transform" 
                onClick={() => toggleArrayFilter('amenities', amenity)}
              />
            </Badge>
          ))}
          
          {filters.vibes.map(vibe => (
            <Badge key={vibe} variant="outline" className="flex items-center gap-1 border-purple-200 text-purple-700">
              {vibe}
              <X 
                className="h-3 w-3 cursor-pointer hover:scale-110 transition-transform" 
                onClick={() => toggleArrayFilter('vibes', vibe)}
              />
            </Badge>
          ))}
          
          {filters.priceRange.map(price => (
            <Badge key={price} variant="outline" className="flex items-center gap-1 border-yellow-200 text-yellow-700">
              <DollarSign className="h-3 w-3" />
              {price}
              <X 
                className="h-3 w-3 cursor-pointer hover:scale-110 transition-transform" 
                onClick={() => toggleArrayFilter('priceRange', price)}
              />
            </Badge>
          ))}
          
          {filters.isVerified && (
            <Badge variant="verified" className="flex items-center gap-1">
              <CheckCircle className="h-3 w-3" />
              Verificado
              <X 
                className="h-3 w-3 cursor-pointer hover:scale-110 transition-transform" 
                onClick={() => updateFilter('isVerified', false)}
              />
            </Badge>
          )}
          
          {filters.rating > 0 && (
            <Badge variant="outline" className="flex items-center gap-1 border-yellow-200 text-yellow-700">
              <Star className="h-3 w-3" />
              {filters.rating}+ estrellas
              <X 
                className="h-3 w-3 cursor-pointer hover:scale-110 transition-transform" 
                onClick={() => updateFilter('rating', 0)}
              />
            </Badge>
          )}
        </div>
      )}

      {/* Filter Options */}
      {showFilters && (
        <div className="space-y-6 pt-6 border-t border-gray-200 animate-in slide-in-from-top duration-300">
          {/* Neighborhood Filter */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-green-600" />
              Barrio
            </label>
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
              {NEIGHBORHOODS.map(neighborhood => (
                <button
                  key={neighborhood}
                  onClick={() => updateFilter('neighborhood', 
                    filters.neighborhood === neighborhood ? '' : neighborhood
                  )}
                  className={`p-3 rounded-xl text-sm font-medium border-2 transition-all duration-300 hover:scale-105 ${
                    filters.neighborhood === neighborhood
                      ? 'bg-green-100 border-green-300 text-green-800 shadow-lg'
                      : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100 hover:border-gray-300'
                  }`}
                >
                  {neighborhood}
                </button>
              ))}
            </div>
          </div>

          {/* Amenities Filter */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-purple-600" />
              Servicios y Amenidades
            </label>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {AMENITIES.slice(0, 12).map(amenity => (
                <button
                  key={amenity}
                  onClick={() => toggleArrayFilter('amenities', amenity)}
                  className={`p-3 rounded-xl text-sm font-medium border-2 transition-all duration-300 hover:scale-105 ${
                    filters.amenities.includes(amenity)
                      ? 'bg-purple-100 border-purple-300 text-purple-800 shadow-lg'
                      : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100 hover:border-gray-300'
                  }`}
                >
                  {filters.amenities.includes(amenity) && (
                    <CheckCircle className="h-3 w-3 inline mr-1" />
                  )}
                  {amenity}
                </button>
              ))}
            </div>
          </div>

          {/* Vibes Filter */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <Star className="h-4 w-4 text-yellow-600" />
              Ambiente y Estilo
            </label>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {VIBE_TAGS.slice(0, 12).map(vibe => (
                <button
                  key={vibe}
                  onClick={() => toggleArrayFilter('vibes', vibe)}
                  className={`p-3 rounded-xl text-sm font-medium border-2 transition-all duration-300 hover:scale-105 ${
                    filters.vibes.includes(vibe)
                      ? 'bg-yellow-100 border-yellow-300 text-yellow-800 shadow-lg'
                      : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100 hover:border-gray-300'
                  }`}
                >
                  {filters.vibes.includes(vibe) && (
                    <CheckCircle className="h-3 w-3 inline mr-1" />
                  )}
                  {vibe}
                </button>
              ))}
            </div>
          </div>

          {/* Additional Filters */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4 border-t border-gray-200">
            {/* Verified Filter */}
            <label className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl border border-blue-200 cursor-pointer hover:bg-blue-100 transition-colors">
              <input
                type="checkbox"
                checked={filters.isVerified}
                onChange={(e) => updateFilter('isVerified', e.target.checked)}
                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
              />
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">Solo clubs verificados</span>
              </div>
            </label>
            
            {/* Price Range Filter */}
            <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-200">
              <div className="flex items-center gap-2 mb-3">
                <DollarSign className="h-4 w-4 text-yellow-600" />
                <span className="text-sm font-medium text-yellow-800">Rango de precios:</span>
              </div>
              <div className="flex gap-2">
                {['$', '$$', '$$$'].map(price => (
                  <button
                    key={price}
                    onClick={() => toggleArrayFilter('priceRange', price)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium border-2 transition-all duration-300 hover:scale-105 ${
                      filters.priceRange.includes(price)
                        ? 'bg-yellow-200 border-yellow-400 text-yellow-800'
                        : 'bg-white border-yellow-200 text-yellow-700 hover:bg-yellow-100'
                    }`}
                  >
                    {price}
                  </button>
                ))}
              </div>
            </div>

            {/* Rating Filter */}
            <div className="p-4 bg-orange-50 rounded-xl border border-orange-200">
              <div className="flex items-center gap-2 mb-3">
                <Star className="h-4 w-4 text-orange-600" />
                <span className="text-sm font-medium text-orange-800">Valoración mínima:</span>
              </div>
              <div className="flex gap-2">
                {[4, 4.5, 5].map(rating => (
                  <button
                    key={rating}
                    onClick={() => updateFilter('rating', filters.rating === rating ? 0 : rating)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium border-2 transition-all duration-300 hover:scale-105 ${
                      filters.rating === rating
                        ? 'bg-orange-200 border-orange-400 text-orange-800'
                        : 'bg-white border-orange-200 text-orange-700 hover:bg-orange-100'
                    }`}
                  >
                    {rating}★
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}