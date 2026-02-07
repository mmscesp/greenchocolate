'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import ClubCard from '@/components/ClubCard';
import FilterBar from '@/components/FilterBar';
import Footer from '@/components/Footer';
import LanguageSelector from '@/components/LanguageSelector';
import UserProfileDropdown from '@/components/UserProfileDropdown';
import { useLanguage } from '@/hooks/useLanguage';
import { Leaf, Map, List, Grid } from 'lucide-react';
import { getClubs, ClubCard as ClubCardType } from '@/app/actions/clubs';
import { Club, FilterOptions } from '@/lib/types';
import { CollectionPageStructuredData } from '@/components/StructuredData';

interface ClubsPageClientProps {
  initialClubs: ClubCardType[];
  neighborhoods: string[];
  amenities: string[];
  vibes: string[];
}

export default function ClubsPageClient({ 
  initialClubs, 
  neighborhoods, 
  amenities, 
  vibes 
}: ClubsPageClientProps) {
  const { t } = useLanguage();
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [clubs, setClubs] = useState<ClubCardType[]>(initialClubs);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    neighborhood: '',
    amenities: [],
    vibes: [],
    isVerified: false,
    priceRange: [],
    rating: 0
  });

  // Fetch clubs when filters change
  const handleFiltersChange = useCallback(async (newFilters: FilterOptions) => {
    setFilters(newFilters);
    setLoading(true);
    try {
      const result = await getClubs({
        neighborhood: newFilters.neighborhood || undefined,
        amenities: newFilters.amenities.length > 0 ? newFilters.amenities : undefined,
        vibes: newFilters.vibes.length > 0 ? newFilters.vibes : undefined,
        priceRange: newFilters.priceRange.length > 0 ? newFilters.priceRange : undefined,
        isVerified: newFilters.isVerified ? true : undefined,
      });
      setClubs(result);
    } catch (error) {
      console.error('Error fetching clubs:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* JSON-LD Structured Data */}
      <CollectionPageStructuredData
        schema={{
          name: t('clubs.title'),
          description: t('clubs.subtitle'),
          url: 'https://socialclubsmaps.com/clubs',
          numberOfItems: clubs.length,
        }}
      />

      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center gap-2">
                <Leaf className="h-8 w-8 text-green-600" />
                <span className="text-xl font-bold text-gray-900">SocialClubsMaps</span>
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/blog">
                <Button variant="ghost">{t('nav.blog')}</Button>
              </Link>
              <Link href="/club-panel">
                <Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-50">Panel Club</Button>
              </Link>
              <UserProfileDropdown />
              <LanguageSelector />
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {t('clubs.title')}
          </h1>
          <p className="text-lg text-gray-600">
            {t('clubs.subtitle')}
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex bg-white rounded-lg border overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-4 py-2 flex items-center gap-2 text-sm font-medium transition-colors ${
                viewMode === 'grid'
                  ? 'bg-green-600 text-white'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Grid className="h-4 w-4" />
              {t('clubs.view_mode.list')}
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`px-4 py-2 flex items-center gap-2 text-sm font-medium transition-colors ${
                viewMode === 'map'
                  ? 'bg-green-600 text-white'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Map className="h-4 w-4" />
              {t('clubs.view_mode.map')}
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <FilterBar 
          filters={filters} 
          onFiltersChange={handleFiltersChange}
          totalResults={clubs.length}
          neighborhoods={neighborhoods}
          amenities={amenities}
          vibes={vibes}
        />

        {/* Content */}
        {viewMode === 'grid' ? (
          <div>
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="bg-gray-200 animate-pulse rounded-lg h-96"></div>
                ))}
              </div>
            ) : clubs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {clubs.map(club => (
                  <ClubCard key={club.id} club={club as unknown as Club} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="bg-white rounded-lg p-8 max-w-md mx-auto">
                  <List className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {t('clubs.no_results.title')}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {t('clubs.no_results.subtitle')}
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => handleFiltersChange({
                      neighborhood: '',
                      amenities: [],
                      vibes: [],
                      isVerified: false,
                      priceRange: [],
                      rating: 0
                    })}
                  >
                    {t('clubs.clear_filters')}
                  </Button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-lg p-8 text-center">
            <Map className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {t('clubs.view_mode.map')}
            </h3>
            <p className="text-gray-600">
              {t('clubs.map.coming_soon')}
            </p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}