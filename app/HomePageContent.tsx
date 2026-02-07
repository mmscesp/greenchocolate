'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ClubCardComponent from '@/components/ClubCard';
import Footer from '@/components/Footer';
import LanguageSelector from '@/components/LanguageSelector';
import UserProfileDropdown from '@/components/UserProfileDropdown';
import HeroSection from '@/components/HeroSection';
import { useLanguage } from '@/hooks/useLanguage';
import { Leaf, TrendingUp, Award } from 'lucide-react';
import type { ClubCard } from '@/app/actions/clubs';
import type { Club } from '@/lib/types';

interface HomePageContentProps {
  featuredClubs: ClubCard[];
  allClubs: ClubCard[];
}

// Map ClubCard (from server) to Club (expected by component)
function mapToClub(card: ClubCard): Club {
  return {
    id: card.id,
    name: card.name,
    slug: card.slug,
    isVerified: card.isVerified,
    neighborhood: card.neighborhood,
    images: card.images,
    description: card.description,
    amenities: card.amenities,
    vibeTags: card.vibeTags,
    openingHours: {},
    allowsPreRegistration: true,
    coordinates: { lat: 0, lng: 0 },
    address: '',
    contactEmail: '',
    phoneNumber: '',
    rating: card.rating || undefined,
    reviewCount: card.reviewCount || undefined,
    priceRange: card.priceRange as '$' | '$$' | '$$$',
    capacity: card.capacity,
    foundedYear: card.foundedYear,
  };
}

export default function HomePageContent({ featuredClubs, allClubs }: HomePageContentProps) {
  const { t } = useLanguage();
  
  const monthPicks = useMemo(() => {
    return allClubs.slice(0, 4);
  }, [allClubs]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 relative overflow-hidden">
      {/* Navigation */}
      <nav className="bg-white/95 backdrop-blur-md shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center gap-2 group">
                <div className="relative">
                  <Leaf className="h-8 w-8 text-green-600 group-hover:text-green-700 transition-colors animate-float" />
                  <div className="absolute inset-0 bg-green-400 rounded-full blur-lg opacity-20 group-hover:opacity-30 transition-opacity"></div>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  SocialClubsMaps
                </span>
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/clubs">
                <Button variant="ghost" className="hover:bg-green-50">{t('nav.explore')}</Button>
              </Link>
              <Link href="/blog">
                <Button variant="ghost" className="hover:bg-green-50">{t('nav.blog')}</Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="cannabis" size="sm" className="shadow-lg">{t('nav.dashboard')}</Button>
              </Link>
              <UserProfileDropdown />
              <LanguageSelector />
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <HeroSection />

      {/* Featured Clubs */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-50/50 to-emerald-50/50"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="verified" className="mb-4">
              <Award className="h-4 w-4 mr-1" />
              {t('home.featured.badge')}
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              {t('home.featured.title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('home.featured.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredClubs.map(club => (
                <div key={club.id} className="transform hover:scale-105 transition-all duration-300">
                  <ClubCardComponent club={mapToClub(club)} />
                </div>
              ))}
            </div>
        </div>
      </section>

      {/* Month's Picks */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-green-50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="success" className="mb-4 animate-pulse">
              <TrendingUp className="h-4 w-4 mr-1" />
              {t('home.picks.badge')}
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              {t('home.picks.title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('home.picks.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {monthPicks.map((club, index) => (
                <div 
                  key={club.id} 
                  className="transform hover:scale-105 transition-all duration-300"
                  style={{animationDelay: `${index * 0.1}s`}}
                >
                  <ClubCardComponent club={mapToClub(club)} />
                </div>
              ))}
            </div>

          <div className="text-center mt-12">
            <Link href="/clubs">
              <Button variant="outline" size="lg" className="border-green-200 hover:bg-green-50 group">
                {t('common.view_all')} Clubs
                <TrendingUp className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Search */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="absolute inset-0 cannabis-pattern opacity-20"></div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-8">
            {t('home.search.title')}
          </h2>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            {t('home.search.subtitle')}
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {[
              { name: 'Malasaña', icon: '🎨', color: 'from-purple-400 to-purple-600' },
              { name: 'Centro', icon: '🏛️', color: 'from-blue-400 to-blue-600' },
              { name: 'Chueca', icon: '🌈', color: 'from-pink-400 to-pink-600' },
              { name: 'La Latina', icon: '🍷', color: 'from-red-400 to-red-600' }
            ].map((neighborhood, index) => (
              <Link key={neighborhood.name} href={`/clubs?neighborhood=${neighborhood.name}`}>
                <div className="group p-6 bg-white rounded-2xl border border-gray-200 hover:border-green-300 hover:shadow-xl transition-all duration-300 card-hover cursor-pointer">
                  <div className={`w-16 h-16 bg-gradient-to-r ${neighborhood.color} rounded-2xl flex items-center justify-center text-2xl mb-4 mx-auto group-hover:scale-110 transition-transform`}>
                    {neighborhood.icon}
                  </div>
                  <span className="text-lg font-semibold text-gray-900 group-hover:text-green-600 transition-colors">
                    {neighborhood.name}
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            {[
              { name: 'Relajado', color: 'bg-blue-100 text-blue-800 hover:bg-blue-200' },
              { name: 'Social', color: 'bg-green-100 text-green-800 hover:bg-green-200' },
              { name: 'Creativo', color: 'bg-purple-100 text-purple-800 hover:bg-purple-200' },
              { name: 'Educativo', color: 'bg-orange-100 text-orange-800 hover:bg-orange-200' }
            ].map(vibe => (
              <Link key={vibe.name} href={`/clubs?vibe=${vibe.name}`}>
                <Badge 
                  variant="outline" 
                  className={`cursor-pointer transition-all duration-300 hover:scale-105 ${vibe.color} border-transparent px-4 py-2 text-sm font-medium`}
                >
                  {vibe.name}
                </Badge>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-emerald-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="group">
              <div className="text-4xl lg:text-5xl font-bold mb-2 group-hover:scale-110 transition-transform">150+</div>
              <div className="text-green-100 text-lg">{t('home.stats.verified_clubs')}</div>
            </div>
            <div className="group">
              <div className="text-4xl lg:text-5xl font-bold mb-2 group-hover:scale-110 transition-transform">10K+</div>
              <div className="text-green-100 text-lg">{t('home.stats.active_members')}</div>
            </div>
            <div className="group">
              <div className="text-4xl lg:text-5xl font-bold mb-2 group-hover:scale-110 transition-transform">25</div>
              <div className="text-green-100 text-lg">{t('home.stats.cities')}</div>
            </div>
            <div className="group">
              <div className="text-4xl lg:text-5xl font-bold mb-2 group-hover:scale-110 transition-transform">4.9★</div>
              <div className="text-green-100 text-lg">{t('home.stats.rating')}</div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
