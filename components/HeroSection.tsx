'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronDown, BookOpen, Shield, AlertCircle, Calendar } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

// ═══════════════════════════════════════════════════════════════
// HERO CONFIGURATION - Barcelona Skyline Cinematic Sequence
// Image: 3333x5000px (2:3 ratio)
// Scene1 reference: 53% crop → scale 1.88 → Sagrada centered with sky above
// Full width: scale 1.0
// ═══════════════════════════════════════════════════════════════
const HERO_CONFIG = {
  image: {
    desktop: {
      initialScale: 1.88,      // Start at Scene1 frame (53% crop)
      finalScale: 1.0,         // Zoom OUT to show full city width
      objectPosition: '51% 41%', // Sagrada: 51% horiz, 41% vert
      transformOrigin: '51% 41%',
    },
    mobile: {
      initialScale: 1.5,
      finalScale: 0.85,
      objectPosition: '50% 45%',
      transformOrigin: '50% 45%',
    }
  },
  
  scroll: {
    totalHeight: '175vh',      // Premium scroll, not 300vh
  },
  
  animation: {
    // Phase 1: ZOOM OUT (0% → 50% scroll)
    zoomStart: 1.88,
    zoomEnd: 1.0,
    zoomPhaseEnd: 0.5,
    
    // Phase 2: PAN DOWN (30% → 90% scroll) - reveal greenery
    panStart: 0,
    panEnd: -30,
    panPhaseStart: 0.3,
    panPhaseEnd: 0.9,
    
    // Text: shrink + fade during scroll
    textScaleStart: 1.0,
    textScaleEnd: 0.75,
    textFadeStart: 0.5,
    textFadeEnd: 0.8,
  },
  
  // Buttons appear mid-scroll (left/right of Sagrada)
  buttonsAppear: 0.45,
  buttonsFullVisible: 0.65,
  
  // Stats: appear on dark greenery (bottom 25% of image)
  statsAppear: 0.75,
  statsFullVisible: 1.0,
};

// ═══════════════════════════════════════════════════════════════
// STATS DATA - Integrated into hero
// ═══════════════════════════════════════════════════════════════
const statsData = [
  { value: '4', label: 'Expert Guides', description: '100% Verified Content', icon: BookOpen },
  { value: '2.5K+', label: 'Safety Kits', description: 'Downloaded by Travelers', icon: Shield },
  { value: '€0', label: 'Fines', description: 'For Protected Members', icon: AlertCircle },
  { value: 'Mar', label: '2026', description: 'Barcelona Club Launch', icon: Calendar },
];

// Easing function for smooth scroll-capture
function easeOutCubic(x: number): number {
  return 1 - Math.pow(1 - x, 3);
}

export default function HeroSection() {
  // State
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Refs
  const containerRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const statsContainerRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  
  // Animation values - initialized in useEffect
  const initialScaleRef = useRef(HERO_CONFIG.image.desktop.initialScale);
  const finalScaleRef = useRef(HERO_CONFIG.image.desktop.finalScale);
  const prefersReducedMotionRef = useRef(false);

  // Refs for scroll progress (avoid querySelector)
  const scrollProgressRef = useRef<HTMLDivElement>(null);

// Check reduced motion preference
useEffect(() => {
  gsap.registerPlugin(ScrollTrigger);
  
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  prefersReducedMotionRef.current = mediaQuery.matches;
  
  const handleChange = (e: MediaQueryListEvent) => {
    prefersReducedMotionRef.current = e.matches;
  };
  
  mediaQuery.addEventListener('change', handleChange);
  return () => mediaQuery.removeEventListener('change', handleChange);
}, []);

  // Responsive detection
  useEffect(() => {
    let resizeTimeout: NodeJS.Timeout;
    
    const checkMobile = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        const mobile = window.innerWidth < 768;
        setIsMobile(mobile);
        initialScaleRef.current = mobile 
          ? HERO_CONFIG.image.mobile.initialScale 
          : HERO_CONFIG.image.desktop.initialScale;
        finalScaleRef.current = mobile 
          ? HERO_CONFIG.image.mobile.finalScale 
          : HERO_CONFIG.image.desktop.finalScale;
      }, 100);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => {
      window.removeEventListener('resize', checkMobile);
      clearTimeout(resizeTimeout);
    };
  }, []);

  // GSAP animations for scroll - SIMPLIFIED
  useGSAP(() => {
    if (!imageLoaded || !containerRef.current || prefersReducedMotionRef.current) return;

    // Main scroll timeline
    const mainTl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.5,
      }
    });

    // PHASE 1: ZOOM OUT (0% → 50% scroll)
    mainTl.fromTo(imageRef.current, 
      { 
        scale: HERO_CONFIG.animation.zoomStart,
        yPercent: HERO_CONFIG.animation.panStart,
      },
      { 
        scale: HERO_CONFIG.animation.zoomEnd, 
        ease: 'power2.inOut', 
        duration: HERO_CONFIG.animation.zoomPhaseEnd,
      },
      0
    );

    // PHASE 2: PAN DOWN (30% → 90% scroll)
    const panDuration = HERO_CONFIG.animation.panPhaseEnd - HERO_CONFIG.animation.panPhaseStart;
    mainTl.to(imageRef.current,
      { 
        yPercent: HERO_CONFIG.animation.panEnd, 
        ease: 'power2.inOut', 
        duration: panDuration,
      },
      HERO_CONFIG.animation.panPhaseStart
    );

    // Scroll progress + text animation in onUpdate
    ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.5,
      onUpdate: (self) => {
        const progress = self.progress;
        
        // Update progress bar (using ref)
        if (progressRef.current) {
          progressRef.current.style.transform = `scaleX(${progress})`;
        }
        
        // Update scroll indicator (using ref)
        if (scrollProgressRef.current) {
          scrollProgressRef.current.style.height = `${progress * 100}%`;
        }
        
        // TEXT: Scale + Fade
        let textOpacity = 1;
        let textScale = 1;
        
        if (progress > HERO_CONFIG.animation.textFadeStart) {
          const fadeProgress = (progress - HERO_CONFIG.animation.textFadeStart) / 
            (HERO_CONFIG.animation.textFadeEnd - HERO_CONFIG.animation.textFadeStart);
          const easedFade = easeOutCubic(Math.min(fadeProgress, 1));
          textOpacity = 1 - easedFade;
          textScale = HERO_CONFIG.animation.textScaleStart - 
            (easedFade * (HERO_CONFIG.animation.textScaleStart - HERO_CONFIG.animation.textScaleEnd));
        }
        
        if (textRef.current) {
          textRef.current.style.opacity = String(textOpacity);
          textRef.current.style.transform = `scale(${textScale})`;
        }
        
        // BUTTONS: Appear mid-scroll
        let buttonsOpacity = 0;
        if (progress > HERO_CONFIG.buttonsAppear) {
          const btnProgress = (progress - HERO_CONFIG.buttonsAppear) / 
            (HERO_CONFIG.buttonsFullVisible - HERO_CONFIG.buttonsAppear);
          buttonsOpacity = easeOutCubic(Math.min(btnProgress, 1));
        }
        
        if (ctaRef.current) {
          ctaRef.current.style.opacity = String(buttonsOpacity);
          ctaRef.current.style.pointerEvents = buttonsOpacity > 0 ? 'auto' : 'none';
        }
        
        // STATS: Rise from bottom on dark greenery
        let statsOpacity = 0;
        let statsY = 100;
        
        if (progress > HERO_CONFIG.statsAppear) {
          const statsProgress = (progress - HERO_CONFIG.statsAppear) / 
            (HERO_CONFIG.statsFullVisible - HERO_CONFIG.statsAppear);
          const easedStats = easeOutCubic(Math.min(statsProgress, 1));
          statsOpacity = easedStats;
          statsY = 100 - (easedStats * 100);
        }
        
        if (statsContainerRef.current) {
          statsContainerRef.current.style.opacity = String(statsOpacity);
          statsContainerRef.current.style.transform = `translateY(${statsY}px)`;
        }
      }
    });

  }, { scope: containerRef, dependencies: [imageLoaded] });

  // REMOVED: 3D Tilt effect (not approved)

  // Letter split helper
  const splitText = useCallback((text: string) => {
    return text.split(' ').map((word: string, i: number) => (
      <span key={i} className="inline-block overflow-hidden mr-1">
        <span className="word-inner inline-block">{word}</span>
        {i < text.split(' ').length - 1 && <span>&nbsp;</span>}
      </span>
    ));
  }, []);

  return (
    <section 
      ref={containerRef}
      className="hero-scroll-wrapper relative w-full bg-transparent"
      style={{ height: HERO_CONFIG.scroll.totalHeight }}
      role="region"
      aria-label="Hero Introduction"
    >
      {/* Loading screen */}
      <div className={`fixed inset-0 z-[100] flex items-center justify-center bg-[#0A0A0F] transition-all duration-700 ${imageLoaded ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <div className="relative">
          <div className="w-20 h-20 border-2 border-[#E8A838]/20 rounded-full" />
          <div className="absolute inset-0 w-20 h-20 border-2 border-[#E8A838] rounded-full border-t-transparent animate-spin" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-[#E8A838] rounded-full animate-pulse" />
        </div>
      </div>

      {/* Full-height background */}
      <div className="absolute inset-0">
        {/* Background layer - FIXED overflow */}
        <div className="absolute inset-0 bg-black overflow-hidden">
          <div 
            ref={imageRef} 
            className="hero-image-container absolute inset-0 w-full h-full will-change-transform"
            style={{ 
              transform: `scale(${initialScaleRef.current})`, 
              transformOrigin: isMobile 
                ? HERO_CONFIG.image.mobile.transformOrigin 
                : HERO_CONFIG.image.desktop.transformOrigin,
            }}
          >
            <Image 
              src="/images/hero/barcelona-skyline.webp" 
              alt="Aerial view of Barcelona with Sagrada Familia" 
              fill 
              priority 
              quality={90} 
              sizes="100vw"
              style={{
                objectFit: 'cover',
                objectPosition: isMobile 
                  ? HERO_CONFIG.image.mobile.objectPosition 
                  : HERO_CONFIG.image.desktop.objectPosition,
              }}
              className={`transition-opacity duration-700 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
              onLoad={() => setImageLoaded(true)} 
            />
          </div>
        </div>
        
        {/* SINGLE OPTIMIZED OVERLAY - Gradient + Vignette combined */}
        <div 
          className="hero-overlay absolute inset-0 pointer-events-none z-10"
          style={{ 
            background: `
              radial-gradient(ellipse 120% 100% at 50% 20%, transparent 0%, transparent 50%, rgba(10,10,15,0.3) 80%, rgba(10,10,15,0.6) 100%),
              linear-gradient(to bottom, rgba(10,10,15,0.4) 0%, rgba(10,10,15,0.1) 30%, rgba(10,10,15,0.3) 60%, rgba(10,10,15,0.7) 100%)
            `,
            backgroundBlendMode: 'normal, normal'
          }} 
        />
      </div>

      {/* Sticky text content */}
      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden">
        <div 
          ref={textRef} 
          className="hero-text-content relative z-40 w-full h-full flex flex-col items-center justify-start md:justify-center px-4 sm:px-6 lg:px-8 pt-32 md:pt-24"
          style={{ opacity: 1 }}
        >
          <div className="max-w-6xl mx-auto w-full text-center">
            {/* Tagline - Always visible */}
            <div ref={taglineRef} className="mb-5 md:mb-7">
              <p className="text-lg md:text-xl lg:text-2xl text-[#F5F0EB] tracking-[0.12em] leading-relaxed">
                {splitText('Different city. Different rules.')}
              </p>
              <p 
                className="text-lg md:text-xl lg:text-2xl font-bold tracking-[0.12em] leading-relaxed mt-1" 
                style={{ color: '#D9534F' }}
              >
                {splitText('Different consequences.')}
              </p>
            </div>

            {/* Headline */}
            <div 
              ref={headlineRef} 
              className="mb-6 md:mb-10"
            >
              <div className="flex items-center justify-center gap-3 md:gap-5 lg:gap-7 flex-wrap px-2">
                <h1 className="text-3.5xl md:text-5xl lg:text-6xl xl:text-7.5xl font-black tracking-[0.12em] uppercase text-[#F5F0EB] leading-tight">
                  BARCELONA
                </h1>
                <span 
                  className="symbol-not-equal text-4xl md:text-6xl lg:text-7xl xl:text-9xl font-black leading-none"
                  style={{ 
                    color: '#E8A838',
                    display: 'inline-block',
                    filter: 'drop-shadow(0 0 30px rgba(232, 168, 56, 0.5))',
                  }}
                >
                  ≠
                </span>
                <h1 className="text-3.5xl md:text-5xl lg:text-6xl xl:text-7.5xl font-black tracking-[0.12em] uppercase text-[#F5F0EB] leading-tight">
                  AMSTERDAM
                </h1>
              </div>
            </div>

            {/* Body - Appears on page load */}
            <div 
              ref={bodyRef} 
              className="mb-6 md:mb-10 max-w-xl lg:max-w-2xl mx-auto"
            >
              <p className="text-sm md:text-base lg:text-lg text-gray-300 leading-relaxed mb-3">
                Spanish CSCs aren&apos;t coffeeshops. No walk-ins. No menus. No second chances.
              </p>
              <p className="text-base md:text-lg lg:text-xl text-[#F5F0EB] font-semibold">
                We&apos;re your verification layer.
              </p>
            </div>

            {/* CTAs - Appear mid-scroll */}
            <div 
              ref={ctaRef} 
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center w-full max-w-md mx-auto mb-6"
              style={{ opacity: 0, pointerEvents: 'none' }}
            >
              <Link href="/safety-guide" className="w-full sm:w-auto">
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto px-6 py-5 md:px-8 md:py-6 text-base md:text-lg font-bold rounded-full bg-[#E8A838] text-black hover:bg-[#d4962e] transition-all shadow-xl hover:shadow-2xl hover:shadow-[#E8A838]/25 group border-none hover:-translate-y-1"
                >
                  Get the Free Safety Guide →
                </Button>
              </Link>
              <Link href="/how-it-works" className="w-full sm:w-auto">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="w-full sm:w-auto px-6 py-5 md:px-8 md:py-6 text-base md:text-lg font-bold rounded-full border-2 border-white/60 text-white bg-transparent hover:bg-white/10 hover:border-white transition-all hover:-translate-y-1"
                >
                  How It Works
                </Button>
              </Link>
            </div>

            {/* Scroll indicator - RIGHT SIDE VERTICAL */}
            <div className="scroll-indicator absolute right-6 md:right-10 top-1/2 -translate-y-1/2 z-50">
              <div className="flex flex-col items-center gap-3">
                {/* Vertical line with dots */}
                <div className="relative h-20 w-0.5 bg-white/20">
                  {/* Animated progress fill */}
                  <div 
                    ref={scrollProgressRef}
                    className="scroll-progress absolute top-0 left-0 w-full bg-[#E8A838] origin-top"
                    style={{ height: '0%' }}
                  />
                </div>
                
                {/* Scroll text - vertical */}
                <div className="flex flex-col items-center gap-1">
                  <span 
                    className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-medium"
                    style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
                  >
                    Scroll
                  </span>
                  <ChevronDown 
                    className="w-4 h-4 animate-bounce" 
                    style={{ color: '#E8A838' }} 
                    strokeWidth={2.5} 
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════ */}
        {/* STATS CARDS (fade in at 70-95%, rise from bottom) */}
        {/* ═══════════════════════════════════════════ */}
        <div 
          ref={statsContainerRef}
          className="absolute bottom-16 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8"
          style={{ opacity: 0, transform: 'translateY(100px)' }}
        >
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 lg:gap-6">
              {statsData.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div 
                    key={index} 
                    className="stat-card relative group cursor-default overflow-hidden rounded-xl md:rounded-2xl border border-white/5 bg-black/40 backdrop-blur-lg p-4 md:p-6 transition-all duration-500 hover:border-[#E8A838]/30 hover:bg-black/60"
                  >
                    {/* Hover glow */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#E8A838]/0 to-[#E8A838]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    <div className="relative z-10 flex flex-col items-center">
                      {/* Icon */}
                      <div className="w-10 h-10 md:w-12 md:h-12 mb-3 bg-[#E8A838]/10 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:bg-[#E8A838]/20 group-hover:scale-110 border border-[#E8A838]/20">
                        <Icon className="w-5 h-5 md:w-6 md:h-6 text-[#E8A838]" strokeWidth={2} />
                      </div>

                      {/* Value */}
                      <div className="text-2xl md:text-4xl lg:text-5xl font-black text-white mb-1 tracking-tight">
                        {stat.value}
                      </div>

                      {/* Label */}
                      <div className="text-xs md:text-sm font-bold text-[#E8A838] mb-1 uppercase tracking-wide">
                        {stat.label}
                      </div>

                      {/* Description */}
                      <div className="text-[10px] md:text-xs text-zinc-400 uppercase tracking-wider font-medium text-center">
                        {stat.description}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
