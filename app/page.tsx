'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ClubCard from '@/components/ClubCard';
import Footer from '@/components/Footer';
import LanguageSelector from '@/components/LanguageSelector';
import UserProfileDropdown from '@/components/UserProfileDropdown';
import InteractiveHeroMap from '@/components/InteractiveHeroMap';
import { useClubs } from '@/hooks/useClubs';
import { useLanguage } from '@/hooks/useLanguage';
import { MapPin, Star, Users, Leaf, Shield, Search, Zap, TrendingUp, Award, Clock, ArrowRight, Play } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function HomePage() {
  const { clubs, loading } = useClubs();
  const { t } = useLanguage();
  const featuredClubs = clubs.filter(club => club.isVerified).slice(0, 3);
  const monthPicks = clubs.slice(0, 4);
  
  const [verifiedClubs, setVerifiedClubs] = useState(0);
  const [activeMembers, setActiveMembers] = useState(0);
  const [typewriterText, setTypewriterText] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  
  const fullText = t('home.hero.title');
  
  // Typewriter effect
  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index <= fullText.length) {
        setTypewriterText(fullText.slice(0, index));
        index++;
      } else {
        clearInterval(timer);
        setShowCursor(false);
      }
    }, 100);
    
    return () => clearInterval(timer);
  }, [fullText]);
  
  // Counter animations
  useEffect(() => {
    const clubTimer = setInterval(() => {
      setVerifiedClubs(prev => prev < 150 ? prev + 3 : prev);
    }, 50);
    
    const memberTimer = setInterval(() => {
      setActiveMembers(prev => prev < 10000 ? prev + 200 : prev);
    }, 50);
    
    return () => {
      clearInterval(clubTimer);
      clearInterval(memberTimer);
    };
  }, []);

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
      <section className="relative overflow-hidden min-h-screen flex items-center">
        {/* Hemp Texture Background */}
        <div className="absolute inset-0 hemp-texture opacity-20"></div>
        
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-50/80 via-transparent to-emerald-50/80"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
            
            {/* Left Side - Content */}
            <div className="space-y-8 slide-in-left">
              {/* Badge */}
              <div className="fade-in-up">
                <Badge variant="cannabis" className="mb-6 animate-glow text-base px-6 py-2">
                  {t('home.hero.badge')}
                </Badge>
              </div>
              
              {/* Typewriter Headline */}
              <div className="space-y-4">
                <h1 className="text-4xl lg:text-6xl xl:text-7xl font-bold text-gray-900 leading-tight">
                  <span className="typewriter inline-block">
                    {typewriterText}
                    {showCursor && <span className="animate-pulse">|</span>}
                  </span>
                  <span className="block text-gradient mt-2 fade-in-up" style={{ animationDelay: '3s' }}>
                    {t('home.hero.title_highlight')}
                  </span>
                </h1>
              </div>
              
              {/* Subtitle with fade-in */}
              <p className="text-xl lg:text-2xl text-gray-600 leading-relaxed max-w-2xl fade-in-up" style={{ animationDelay: '4s' }}>
                {t('home.hero.subtitle')}
              </p>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 fade-in-up" style={{ animationDelay: '5s' }}>
                <Link href="/clubs">
                  <Button variant="cannabis" size="xl" className="w-full sm:w-auto group shadow-2xl hover:shadow-green-500/25 transition-all duration-300">
                    <Search className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                    {t('home.hero.explore_clubs')}
                    <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Button variant="outline" size="xl" className="w-full sm:w-auto border-2 border-green-200 hover:bg-green-50 group hover:border-green-300 transition-all duration-300">
                  <Play className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                  {t('home.hero.learn_more')}
                </Button>
              </div>
              
              {/* Trust Indicators */}
              <div className="grid grid-cols-2 gap-6 pt-8 fade-in-up" style={{ animationDelay: '6s' }}>
                <div className="text-center">
                  <div className="text-3xl lg:text-4xl font-bold text-green-600 counter-animation">
                    {verifiedClubs}+
                  </div>
                  <div className="text-sm text-gray-600 font-medium">{t('home.trust.verified')}</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl lg:text-4xl font-bold text-emerald-600 counter-animation">
                    {Math.floor(activeMembers / 1000)}K+
                  </div>
                  <div className="text-sm text-gray-600 font-medium">{t('home.trust.community')}</div>
                </div>
              </div>
            </div>
            
            {/* Right Side - Interactive Map */}
            <div className="relative h-[600px] lg:h-[700px] slide-in-right">
              <div className="absolute inset-0 bg-gradient-to-br from-green-100/50 to-emerald-100/50 rounded-3xl shadow-2xl overflow-hidden">
                <InteractiveHeroMap />
              </div>
              
              {/* Floating Elements around Map */}
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-green-400 rounded-full opacity-60 float-gentle"></div>
              <div className="absolute -bottom-6 -right-6 w-12 h-12 bg-emerald-300 rounded-full opacity-40 float-gentle" style={{ animationDelay: '2s' }}></div>
              <div className="absolute top-1/4 -left-6 w-6 h-6 bg-lime-400 rounded-full opacity-50 float-gentle" style={{ animationDelay: '4s' }}></div>
            </div>
          </div>
        </div>
      </section>

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

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-gray-200 animate-pulse rounded-2xl h-96 skeleton"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredClubs.map(club => (
                <div key={club.id} className="transform hover:scale-105 transition-all duration-300">
                  <ClubCard club={club} />
                </div>
              ))}
            </div>
          )}
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

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-gray-200 animate-pulse rounded-2xl h-80 skeleton"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {monthPicks.map((club, index) => (
                <div 
                  key={club.id} 
                  className="transform hover:scale-105 transition-all duration-300"
                  style={{animationDelay: `${index * 0.1}s`}}
                >
                  <ClubCard club={club} />
                </div>
              ))}
            </div>
          )}

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