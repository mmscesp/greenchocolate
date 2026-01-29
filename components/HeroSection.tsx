'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import InteractiveHeroMap from '@/components/InteractiveHeroMap';
import { useLanguage } from '@/hooks/useLanguage';
import { Search, ArrowRight, Play } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function HeroSection() {
  const { t } = useLanguage();
  
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
  );
}
