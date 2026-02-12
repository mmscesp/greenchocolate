'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

export default function HeroSection() {
  const [imageLoaded, setImageLoaded] = useState(false);

  // Handle image load
  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  return (
    <section
      className="relative min-h-screen w-full overflow-hidden flex flex-col items-center justify-center pt-safe-top pb-safe-bottom"
      role="region"
      aria-label="Wake-Up Call Hero"
    >
      {/* Background Image Container */}
      <div className="absolute inset-0 w-full h-full">
          <Image
            src="/pexels-jamesheming-4570837-ezgif.com-jpg-to-webp-converter.webp"
            alt="Barcelona Cannabis Social Club Background"
            fill
            className={`object-cover object-[center_40%] transition-opacity duration-1000 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={handleImageLoad}
            priority
            sizes="100vw"
          />
      </div>

      {/* Gradient Overlays for Text Readability */}
      <div
        className="absolute inset-0 z-10 bg-gradient-to-b from-black/80 via-black/50 to-black/90 pointer-events-none"
        aria-hidden="true"
      />

      {/* Main Content Container */}
      <div className="relative z-30 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center text-center w-full min-h-screen pb-12 md:pb-24 lg:pb-32">
        
        {/* HEADER TEXT - Cinematic & Compact */}
        <div className="mb-6 md:mb-10">
          <p className="text-sm md:text-base font-medium text-white/80 tracking-[0.4em] uppercase mb-2">
            Different city. Different rules.
          </p>
          <h2 className="text-xl md:text-3xl font-black text-[#D9534F] tracking-[0.2em] uppercase">
            Different consequences.
          </h2>
        </div>

        {/* CITY SIDE-BY-SIDE - Symmetrical & Contained */}
        <div className="flex flex-col md:flex-row items-center justify-center w-full mb-10 md:mb-16 select-none max-w-[98vw] mx-auto overflow-hidden">
          {/* Barcelona Side */}
          <div className="flex-1 w-full md:text-right">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-[0.1em] lg:tracking-[0.15em] uppercase leading-none md:pr-4 lg:pr-8">
              BARCELONA
            </h1>
          </div>
          
          {/* Mirror Pivot */}
          <div className="py-2 md:py-0 text-5xl md:text-7xl font-bold text-[#E8A838] leading-none z-10 drop-shadow-[0_0_20px_rgba(232,168,56,0.4)]">
            ≠
          </div>
          
          {/* Amsterdam Side */}
          <div className="flex-1 w-full md:text-left">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-[0.1em] lg:tracking-[0.15em] uppercase leading-none md:pl-4 lg:pl-8">
              AMSTERDAM
            </h1>
          </div>
        </div>

        {/* BODY CONTENT - Enhanced Readability */}
        <div className="max-w-xl md:max-w-2xl mx-auto mb-10 md:mb-14 px-4">
          <p className="text-sm md:text-lg text-gray-300 leading-relaxed mb-4 font-medium">
            Spain's cannabis social clubs aren't coffeeshops. <br className="hidden md:block" />
            No walk-ins. No menus. No second chances if you don't know the rules.
          </p>
          <p className="text-lg md:text-2xl text-white font-bold tracking-tight">
            We're the verification layer that keeps you safe.
          </p>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full max-w-md mx-auto">
          <Link href="/safety-guide" className="w-full sm:w-auto">
            <Button
              size="lg"
              className="w-full sm:w-auto px-8 py-7 text-lg font-bold rounded-full bg-[#E8A838] text-black hover:bg-[#d4962e] transition-all shadow-xl group border-none"
            >
              Get the Free Safety Guide →
            </Button>
          </Link>

          <Link href="/how-it-works" className="w-full sm:w-auto">
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto px-8 py-7 text-lg font-bold rounded-full border-2 border-white text-white bg-transparent hover:bg-white/10 transition-all"
            >
              How It Actually Works
            </Button>
          </Link>
        </div>
      </div>

      {/* Bottom decorative gradient - "The Merge" transition */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-zinc-950 to-transparent z-20 pointer-events-none" />
    </section>
  );
}

