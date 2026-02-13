'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

// Register plugins once
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

// ═══════════════════════════════════════════════════════════════
// ADJUSTABLE CONFIGURATION - Tweak these values to perfect the hero
// ═══════════════════════════════════════════════════════════════
const HERO_CONFIG = {
  // Image positioning
  image: {
    desktop: {
      initialScale: 1.5,         // More zoom for bleed room during pan
      objectPosition: 'center 55%', // Balanced: shows sky + Sagrada
      transformOrigin: 'center 50%', // Center focal point
    },
    mobile: {
      initialScale: 1.35,        // Less zoom on mobile but still bleed room
      objectPosition: 'center 60%', // Slightly lower for mobile
      transformOrigin: 'center 55%',
    }
  },
  
  // Scroll behavior
  scroll: {
    totalHeight: '350vh',        // Total scroll height (try 300vh to 400vh)
    introLimit: 200,             // Pixels for initial scroll-capture (0 to disable)
  },
  
  // Animation ranges
  animation: {
    // Zoom: start → end scale during scroll
    zoomStart: 1.5,              // More zoom = more bleed room for panning
    zoomEnd: 1.0,                // Final zoom level
    
    // Pan: vertical movement 
    // NEGATIVE = image shifted UP (hidden overflow at top)
    // POSITIVE = image shifted DOWN (reveals bottom)
    panStart: -20,               // Start HIGHER (negative = hidden overflow above viewport)
    panEnd: 20,                  // End LOWER (positive = reveals city bottom)
    
    // Text exit timing
    textExitStart: '100vh',      // When text starts fading
    textExitEnd: '250vh',        // When text fully gone
  },
  
  // Entrance timing (in seconds, staggered)
  entrance: {
    taglineDelay: 0.3,           // Tagline appears after load
    headlineDelay: 0.8,          // Headline appears
    bodyDelay: 1.3,              // Body text appears
    ctaDelay: 1.8,               // CTAs appear
    scrollIndicatorDelay: 2.2,   // Scroll hint appears
    stagger: 0.15,               // Time between elements
  }
};

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
  const taglineRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const localTriggersRef = useRef<ScrollTrigger[]>([]);
  
  // Animation values - start with correct scale from config
  const initialScaleRef = useRef(HERO_CONFIG.image.desktop.initialScale);
  const scrollProgressRef = useRef(0);
  const prefersReducedMotionRef = useRef(false);
  const INTRO_SCROLL_LIMIT = HERO_CONFIG.scroll.introLimit; // pixels for scroll-capture
  
  // Image position ref for dynamic updates
  const imagePositionRef = useRef(HERO_CONFIG.image.desktop.objectPosition);

  // Check reduced motion preference
  useEffect(() => {
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
        imagePositionRef.current = mobile
          ? HERO_CONFIG.image.mobile.objectPosition
          : HERO_CONFIG.image.desktop.objectPosition;
      }, 100);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => {
      window.removeEventListener('resize', checkMobile);
      clearTimeout(resizeTimeout);
    };
  }, []);



  // GSAP animations for post-intro scroll
  useGSAP(() => {
    if (!imageLoaded || !containerRef.current || prefersReducedMotionRef.current) return;

    const ctx = gsap.context(() => {
      const triggers: ScrollTrigger[] = [];

      // Only run post-intro animations
      const imageTl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: `${INTRO_SCROLL_LIMIT}px top`,
          end: 'bottom bottom',
          scrub: 0.3,
          onUpdate: (self) => {
            if (progressRef.current) {
              const adjustedProgress = (self.progress * 0.7) + 0.3;
              progressRef.current.style.transform = `scaleX(${adjustedProgress})`;
            }
          }
        }
      });

      // ═══════════════════════════════════════════════════════════════
      // CAMERA EFFECT: Zoom out + Pan down simultaneously
      // This creates the "descending helicopter" feeling
      // ═══════════════════════════════════════════════════════════════
      
      // Zoom out from initial scale to final scale
      imageTl.fromTo(imageRef.current, 
        { scale: HERO_CONFIG.animation.zoomStart },
        { scale: HERO_CONFIG.animation.zoomEnd, ease: 'power2.inOut', duration: 1 },
        0
      );

      // Pan DOWN (positive yPercent reveals bottom of image)
      // Combined with zoom, this creates the descending camera effect
      imageTl.fromTo(imageRef.current,
        { yPercent: HERO_CONFIG.animation.panStart },
        { yPercent: HERO_CONFIG.animation.panEnd, ease: 'power2.inOut', duration: 1 },
        0
      );

      if (imageTl.scrollTrigger) triggers.push(imageTl.scrollTrigger);

      // ═══════════════════════════════════════════════════════════════
      // TEXT EXIT: Fade out as user scrolls past the hero content
      // ═══════════════════════════════════════════════════════════════
      const textTl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: HERO_CONFIG.animation.textExitStart,
          end: HERO_CONFIG.animation.textExitEnd,
          scrub: 0.3,
        }
      });

      if (textRef.current) {
        textTl.fromTo(textRef.current,
          { opacity: 1, filter: 'blur(0px)' },
          { opacity: 0, filter: 'blur(10px)', ease: 'power2.in' },
          0
        );
      }

      if (taglineRef.current) {
        textTl.fromTo(taglineRef.current,
          { yPercent: 0 },
          { yPercent: -15, ease: 'none' },
          0
        );
      }

      if (headlineRef.current) {
        textTl.fromTo(headlineRef.current,
          { yPercent: 0, scale: 0.95 },
          { yPercent: -30, scale: 0.9, ease: 'none' },
          0
        );
      }

      if (textTl.scrollTrigger) triggers.push(textTl.scrollTrigger);

      // ═══════════════════════════════════════════════════════════════
      // PROGRESSIVE DARKENING: Image gets darker as we approach stats
      // This creates seamless transition to the black stats section
      // ═══════════════════════════════════════════════════════════════
      
      // Gradient overlay intensifies
      const gradientTrigger = ScrollTrigger.create({
        trigger: containerRef.current,
        start: '50% top',
        end: 'bottom bottom',
        scrub: 0.5,
        onUpdate: (self) => {
          // Greenery gradient becomes visible
          const greeneryGradient = document.querySelector('.greenery-transition-gradient') as HTMLElement | null;
          if (greeneryGradient) {
            greeneryGradient.style.opacity = String(self.progress);
          }
          
          // Main dark overlay intensifies
          const mainOverlay = document.querySelector('.hero-main-overlay') as HTMLElement | null;
          if (mainOverlay) {
            // Start at 0.65 opacity, end at 0.95 (almost solid black)
            const newOpacity = 0.65 + (self.progress * 0.3);
            mainOverlay.style.background = `linear-gradient(to bottom, 
              rgba(10,10,15,${newOpacity}) 0%, 
              rgba(10,10,15,${0.35 + (self.progress * 0.4)}) 35%, 
              rgba(10,10,15,${0.6 + (self.progress * 0.35)}) 70%, 
              rgba(10,10,15,${0.9 + (self.progress * 0.1)}) 100%)`;
          }
        }
      });
      triggers.push(gradientTrigger);

      localTriggersRef.current = triggers;

      // ═══════════════════════════════════════════════════════════════
      // ELEGANT ENTRANCE: All text elements stagger in on page load
      // No scroll required - immediate value proposition
      // ═══════════════════════════════════════════════════════════════
      
      const entranceTl = gsap.timeline({ delay: 0.2 });
      
      // Tagline slides up and fades in
      if (taglineRef.current) {
        entranceTl.fromTo(taglineRef.current,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' },
          HERO_CONFIG.entrance.taglineDelay
        );
      }
      
      // Headline scales in with slight bounce
      if (headlineRef.current) {
        entranceTl.fromTo(headlineRef.current,
          { scale: 0.9, opacity: 0 },
          { scale: 1, opacity: 1, duration: 1, ease: 'back.out(1.2)' },
          HERO_CONFIG.entrance.headlineDelay
        );
      }
      
      // Body text fades up
      if (bodyRef.current) {
        entranceTl.fromTo(bodyRef.current,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7, ease: 'power2.out' },
          HERO_CONFIG.entrance.bodyDelay
        );
      }
      
      // CTAs slide up
      if (ctaRef.current) {
        entranceTl.fromTo(ctaRef.current,
          { y: 25, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' },
          HERO_CONFIG.entrance.ctaDelay
        );
      }
      
      // Scroll indicator pulses in last
      entranceTl.fromTo('.scroll-indicator',
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
        HERO_CONFIG.entrance.scrollIndicatorDelay
      );

    }, containerRef);

    return () => {
      localTriggersRef.current.forEach(trigger => trigger.kill());
      ctx.revert();
    };
  }, { scope: containerRef, dependencies: [imageLoaded] });

  // 3D Tilt effect
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (prefersReducedMotionRef.current || isMobile || !textRef.current) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    
    gsap.to(textRef.current, {
      rotateY: x * 2,
      rotateX: -y * 2,
      duration: 0.3,
      ease: 'power1.out',
      overwrite: 'auto'
    });
  }, [isMobile]);

  const handleMouseLeave = useCallback(() => {
    if (!textRef.current) return;
    
    gsap.to(textRef.current, {
      rotateY: 0,
      rotateX: 0,
      duration: 0.5,
      ease: 'power2.out',
      overwrite: 'auto'
    });
  }, []);

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

      {/* Progress bar */}
      <div className="fixed top-0 left-0 w-full h-1 z-50 bg-transparent">
        <div ref={progressRef} className="h-full bg-gradient-to-r from-[#E8A838] to-[#D9534F] origin-left" style={{ transform: 'scaleX(0)' }} />
      </div>

      {/* Sticky viewport */}
      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden">
        {/* Background layer */}
        <div className="absolute inset-0 bg-black">
          <div 
            ref={imageRef} 
            className="hero-image-container absolute inset-0 w-full h-full will-change-transform"
            style={{ 
              transform: `scale(${initialScaleRef.current})`, 
              transformOrigin: isMobile 
                ? HERO_CONFIG.image.mobile.transformOrigin 
                : HERO_CONFIG.image.desktop.transformOrigin,
              backfaceVisibility: 'hidden'
            }}
          >
            <Image 
              src="/images/hero/barcelona-skyline.webp" 
              alt="Aerial view of Barcelona with Sagrada Familia" 
              fill 
              priority 
              quality={85} 
              sizes="100vw"
              objectFit="cover"
              objectPosition={isMobile ? 'center 55%' : 'center 50%'}
              className={`transition-opacity duration-700 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
              onLoad={() => setImageLoaded(true)} 
            />
          </div>
        </div>

        {/* Overlays - Darker for text readability */}
        <div className="hero-main-overlay absolute inset-0 pointer-events-none z-10" style={{ 
          background: 'linear-gradient(to bottom, rgba(10,10,15,0.85) 0%, rgba(10,10,15,0.55) 35%, rgba(10,10,15,0.75) 70%, rgba(10,10,15,0.95) 100%)' 
        }} />
        <div className="image-vignette absolute inset-0 pointer-events-none z-20" />
        
        {/* Hero fade mask - smooth transition to stats */}
        <div 
          className="hero-fade-mask absolute inset-0 pointer-events-none z-30"
          style={{ 
            background: 'linear-gradient(to bottom, transparent 0%, transparent 50%, rgba(10,10,15,0.2) 65%, rgba(10,10,15,0.6) 80%, rgba(10,10,15,1) 100%)',
            opacity: 1
          }} 
        />
        
        {/* Greenery transition gradient */}
        <div 
          className="greenery-transition-gradient absolute inset-0 pointer-events-none z-35" 
          style={{ background: 'linear-gradient(to bottom, transparent 0%, transparent 40%, rgba(10,10,15,0.4) 60%, rgba(10,10,15,0.8) 80%, rgba(10,10,15,1) 100%)', opacity: 0 }} 
        />

        {/* Text content */}
        <div 
          ref={textRef} 
          className="hero-text-content relative z-40 w-full h-full flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 pt-16 md:pt-24"
          style={{ perspective: '1000px', transformStyle: 'preserve-3d' }} 
          onMouseMove={handleMouseMove} 
          onMouseLeave={handleMouseLeave}
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

            {/* CTAs - Appear on page load */}
            <div 
              ref={ctaRef} 
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center w-full max-w-md mx-auto mb-6"
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

            {/* Scroll indicator */}
            <div className="scroll-indicator mt-4">
              <div className="flex flex-col items-center gap-2">
                <ChevronDown 
                  className="w-6 h-6 md:w-8 md:h-8 animate-bounce" 
                  style={{ color: '#E8A838' }} 
                  strokeWidth={2.5} 
                />
                <span className="text-xs md:text-sm text-gray-400 uppercase tracking-widest font-medium">
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