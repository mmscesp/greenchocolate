'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useLanguage } from '@/hooks/useLanguage';
import { Search, ArrowRight, Play, MapPin, Leaf, Shield, Users, Mail, Rocket } from 'lucide-react';
import WaitlistForm from './marketing/WaitlistForm';

export default function HeroSection() {
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Check for reduced motion preference
  const prefersReducedMotion = useRef(
    typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false
  );

  // Handle image load
  const handleImageLoad = () => {
    setIsLoading(false);
    setImageLoaded(true);
  };

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen w-full overflow-hidden pt-safe-top pb-safe-bottom"
      role="region"
      aria-label={t('home.hero.title')}
    >
      {/* Background Image Container */}
      <div className="absolute inset-0 w-full h-full">
        {/* Placeholder - User will provide image */}
        {/* Replace src with actual image when ready */}
        <div
          className="w-full h-full bg-gradient-to-br from-green-900 via-emerald-800 to-green-950"
          aria-hidden="true"
        >
          {/* Pattern overlay for visual interest */}
          <div className="absolute inset-0 opacity-10">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}
            />
          </div>
        </div>

        {/* Image would go here when provided:
        <Image
          src="/user-provided-image.jpg"
          alt={t('home.hero.image_alt')}
          fill
          className={`object-cover transition-opacity duration-700 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={handleImageLoad}
          priority
          sizes="100vw"
        />
        */}
      </div>

      {/* Gradient Overlays for Text Readability */}
      <div
        className="absolute inset-0 z-10 bg-gradient-to-b from-black/60 via-black/40 to-black/70 pointer-events-none"
        aria-hidden="true"
      />

      {/* Main Content Container */}
      <div className="relative z-30 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 w-full py-12 sm:py-16 md:py-20 lg:py-24 min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center text-center w-full max-w-5xl lg:max-w-6xl">
          {/* Badge */}
          <div className="fade-in-up mb-8">
            <Badge className="bg-white/10 backdrop-blur-2xl border border-white/20 text-white hover:bg-white/20 transition-all px-8 py-2.5 text-base shadow-[0_0_20px_rgba(255,255,255,0.05)] rounded-full tracking-widest uppercase">
              <Leaf className="h-4 w-4 mr-2" />
              {t('home.hero.badge')}
            </Badge>
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight tracking-tight drop-shadow-lg max-w-4xl">
            <span className="block fade-in-up" style={{ animationDelay: '0.1s' }}>
              {t('home.hero.title')}
            </span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-300 via-emerald-400 to-green-300 mt-1 sm:mt-2 fade-in-up" style={{ animationDelay: '0.2s' }}>
              {t('home.hero.title_highlight')}
            </span>
          </h1>

          {/* Subtitle */}
          <div className="max-w-2xl sm:max-w-3xl mx-auto mb-8 sm:mb-10 lg:mb-12 px-2 sm:px-0 fade-in-up" style={{ animationDelay: '0.3s' }}>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 leading-relaxed font-medium drop-shadow-md">
              Navigate Spain's Cannabis Culture safely and respectfully with verified information and expert-vetted guides.
            </p>
          </div>

          {/* Waitlist Form Integration */}
          <div className="fade-in-up mb-12 w-full flex justify-center" style={{ animationDelay: '0.4s' }}>
            <WaitlistForm />
          </div>

          {/* Secondary CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center fade-in-up mb-10 sm:mb-12 lg:mb-16" style={{ animationDelay: '0.5s' }}>
            <Link href="/learn" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg font-bold rounded-xl bg-white text-green-900 hover:bg-green-50 hover:scale-105 transition-all duration-300 shadow-lg group"
              >
                <Leaf className="h-4 w-4 sm:h-5 sm:w-5 mr-2 group-hover:rotate-12 transition-transform" />
                Start Learning
                <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>

            <Link href="/mission" className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg font-bold rounded-xl bg-white/10 backdrop-blur-xl border border-white/30 text-white hover:bg-white/20 hover:border-white/50 hover:scale-105 transition-all duration-300 group"
              >
                <Shield className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-green-400 group-hover:scale-110 transition-transform" />
                Our Mission
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-4 sm:bottom-6 lg:bottom-8 left-1/2 transform -translate-x-1/2 z-30 fade-in-up hidden sm:flex" style={{ animationDelay: '0.7s' }}>
        <div className="flex flex-col items-center gap-2 text-white/50">
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-1">
            <div className="w-1.5 h-3 bg-white/50 rounded-full animate-float" />
          </div>
        </div>
      </div>

      {/* Bottom decorative gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-green-950/50 to-transparent z-20 pointer-events-none" />
    </section>
  );
}
