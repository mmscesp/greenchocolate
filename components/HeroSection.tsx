'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

// Register plugins safely
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export default function HeroSection() {
  const [imageLoaded, setImageLoaded] = useState(false);
  const containerRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!imageLoaded || !containerRef.current || !imageRef.current) return;

    const scrollConfig = {
      trigger: containerRef.current,
      start: "top top",
      end: "bottom bottom",
      scrub: 1,
    };

    // PHASE 1: Zoom Out (0% - 66%)
    gsap.to(imageRef.current, {
      scale: 1.2,
      ease: "power2.inOut",
      scrollTrigger: {
        ...scrollConfig,
        end: "66% bottom", 
      }
    });

    // PHASE 2: Vertical Pan (33% - 100%)
    gsap.to(imageRef.current, {
      yPercent: -10,
      ease: "power2.inOut",
      scrollTrigger: {
        ...scrollConfig,
        start: "33% top",
      }
    });

    // PHASE 3: Text Exit (10% - 35%)
    if (textRef.current) {
      gsap.to(textRef.current, {
        opacity: 0,
        y: -100,
        scale: 0.9,
        ease: "power2.in",
        scrollTrigger: {
          ...scrollConfig,
          start: "10% top",
          end: "35% top", 
        }
      });
    }

    // PHASE 4: Greenery Gradient (60% - 100%)
    gsap.to(".greenery-transition-gradient", {
      opacity: 1,
      ease: "power2.inOut",
      scrollTrigger: {
        ...scrollConfig,
        start: "60% top",
      }
    });

  }, { scope: containerRef, dependencies: [imageLoaded] });

  // Initial scale based on device assumption (1.53 desktop)
  const initialScale = 1.53; 

  return (
    <section 
      ref={containerRef}
      className="hero-scroll-wrapper relative w-full bg-[#0A0A0F]"
      style={{ height: '300vh' }}
      role="region"
      aria-label="Hero Introduction"
    >
      {/* Sticky Viewport Container */}
      <div className="sticky-wrapper sticky top-0 left-0 w-full h-screen overflow-hidden">
        
        {/* ═══════════════════════════════════════════ */}
        {/* IMAGE LAYER (z-0)                           */}
        {/* ═══════════════════════════════════════════ */}
        <div className="absolute inset-0 bg-black">
          <div 
            ref={imageRef}
            className="hero-image-container absolute inset-0 w-full h-full will-change-transform"
            style={{ 
              transform: `scale(${initialScale})`,
              transformOrigin: 'center 40%',
            }}
          >
            <Image
              src="/images/hero/barcelona-skyline.webp"
              alt="Aerial view of Barcelona with Sagrada Familia"
              fill
              priority
              quality={90}
              sizes="100vw"
              className={`
                object-cover 
                object-[center_40%] 
                transition-opacity 
                duration-1000
                ${imageLoaded ? 'opacity-100' : 'opacity-0'}
              `}
              onLoad={() => setImageLoaded(true)}
            />
          </div>
        </div>

        {/* ═══════════════════════════════════════════ */}
        {/* DARK GRADIENT OVERLAY (z-10)                */}
        {/* ═══════════════════════════════════════════ */}
        <div 
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            background: 'linear-gradient(to bottom, rgba(10,10,15,0.7) 0%, rgba(10,10,15,0.4) 40%, rgba(10,10,15,0.75) 100%)'
          }}
        />

        {/* ═══════════════════════════════════════════ */}
        {/* EDGE VIGNETTE (z-20)                        */}
        {/* ═══════════════════════════════════════════ */}
        <div className="image-vignette absolute inset-0 pointer-events-none z-20" />

        {/* ═══════════════════════════════════════════ */}
        {/* GREENERY TRANSITION GRADIENT (z-25)         */}
        {/* ═══════════════════════════════════════════ */}
        <div 
          className="greenery-transition-gradient absolute inset-0 pointer-events-none z-25 opacity-0"
          style={{
            background: 'linear-gradient(to bottom, transparent 0%, transparent 50%, rgba(10,10,15,0.6) 70%, rgba(10,10,15,1) 100%)'
          }}
        />

        {/* ═══════════════════════════════════════════ */}
        {/* TEXT CONTENT LAYER (z-30)                   */}
        {/* ═══════════════════════════════════════════ */}
        <div ref={textRef} className="hero-text-content relative z-30 w-full h-full flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto w-full text-center">
            
            {/* TAGLINE */}
            <div className="mb-6 md:mb-8 animate-fade-in-up animation-delay-500 opacity-0 fill-mode-forwards">
              <p className="text-xl md:text-2xl lg:text-3xl text-[#F5F0EB] tracking-[0.1em] leading-relaxed">
                Different city. Different rules.
              </p>
              <p 
                className="text-xl md:text-2xl lg:text-3xl font-bold tracking-[0.1em] leading-relaxed mt-1"
                style={{ color: '#D9534F' }}
              >
                Different consequences.
              </p>
            </div>

            {/* MAIN HEADLINE */}
            <div className="mb-8 md:mb-12 animate-fade-in-scale animation-delay-1300 opacity-0 fill-mode-forwards">
              <div className="flex items-center justify-center gap-4 md:gap-6 lg:gap-8 flex-wrap">
                <h1 className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-black tracking-[0.15em] uppercase text-[#F5F0EB]">
                  BARCELONA
                </h1>
                <span 
                  className="text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-black"
                  style={{ 
                    color: '#E8A838',
                    textShadow: '0 0 40px rgba(232, 168, 56, 0.4)'
                  }}
                >
                  ≠
                </span>
                <h1 className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-black tracking-[0.15em] uppercase text-[#F5F0EB]">
                  AMSTERDAM
                </h1>
              </div>
            </div>

            {/* BODY TEXT */}
            <div className="mb-8 md:mb-12 max-w-2xl lg:max-w-3xl mx-auto animate-fade-in-up animation-delay-2000 opacity-0 fill-mode-forwards">
              <p className="text-base md:text-lg lg:text-xl text-gray-300 leading-relaxed mb-4">
                Spain&apos;s cannabis social clubs aren&apos;t coffeeshops.<br className="hidden sm:block" />
                No walk-ins. No menus. No second chances if you don&apos;t know the rules.
              </p>
              <p className="text-lg md:text-xl lg:text-2xl text-[#F5F0EB] font-semibold">
                We&apos;re the verification layer that keeps you safe.
              </p>
            </div>

             {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full max-w-md mx-auto animate-fade-in-up animation-delay-2500 opacity-0 fill-mode-forwards mb-8">
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

            {/* SCROLL INDICATOR */}
            <div className="animate-fade-in-up animation-delay-2500 opacity-0 fill-mode-forwards">
              <div className="flex flex-col items-center gap-2">
                <ChevronDown 
                  className="w-8 h-8 md:w-10 md:h-10 animate-bounce" 
                  style={{ color: '#E8A838' }}
                  strokeWidth={2.5}
                />
                <span className="text-sm md:text-base text-gray-400 uppercase tracking-wider font-medium">
                  Scroll to explore
                </span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
