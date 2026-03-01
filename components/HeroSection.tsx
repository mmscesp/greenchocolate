'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { BookOpen, Shield, AlertCircle, Calendar } from '@/lib/icons';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { MorphingText } from '@/components/ui/morphing-text';
import { useLanguage } from '@/hooks/useLanguage';

const HERO_CONFIG = {
  scrollHeight: '400vh',
  image: { width: 3937, height: 5906 },
  focal: {
    initialZoom: 1.2,
    initialTravel: 0.16,
    act2Travel: 0.32,
    act3Travel: 0.48,
    act4Travel: 0.65,
    finalScale: 1.0,
  },
} as const;

export default function HeroSection() {
  const { t, language } = useLanguage();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [overlayHidden, setOverlayHidden] = useState(false);
  const [animationReady, setAnimationReady] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const localCities = [
    t('hero.section.cities.local.1'),
    t('hero.section.cities.local.2'),
    t('hero.section.cities.local.3'),
    t('hero.section.cities.local.4'),
  ];
  const globalCities = [
    t('hero.section.cities.global.1'),
    t('hero.section.cities.global.2'),
    t('hero.section.cities.global.3'),
    t('hero.section.cities.global.4'),
  ];

  // Scoping Root Ref for GSAP matchMedia
  const rootRef = useRef<HTMLElement>(null);

  // --- DESKTOP REFS ---
  const desktopContainerRef = useRef<HTMLDivElement>(null);
  const imageBaseRef = useRef<HTMLDivElement>(null);
  const imageEdgeRef = useRef<HTMLDivElement>(null);
  const imageTrackRef = useRef<HTMLDivElement>(null);
  const narrativeWrapRef = useRef<HTMLDivElement>(null);
  const headlineWrapRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const vignetteRef = useRef<HTMLDivElement>(null);

  // --- MOBILE REFS ---
  const mobileContainerRef = useRef<HTMLDivElement>(null);
  const mobileBgRef = useRef<HTMLDivElement>(null);
  const mobileContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updatePreference = () => setPrefersReducedMotion(mediaQuery.matches);
    updatePreference();
    mediaQuery.addEventListener('change', updatePreference);
    return () => mediaQuery.removeEventListener('change', updatePreference);
  }, []);

  useEffect(() => {
    if (!imageLoaded) return;

    let frameOne = 0;
    let frameTwo = 0;

    frameOne = window.requestAnimationFrame(() => {
      frameTwo = window.requestAnimationFrame(() => {
        setAnimationReady(true);
      });
    });

    return () => {
      if (frameOne) {
        window.cancelAnimationFrame(frameOne);
      }
      if (frameTwo) {
        window.cancelAnimationFrame(frameTwo);
      }
    };
  }, [imageLoaded]);

  const handleHeroImageLoad = () => {
    setImageLoaded(true);
    window.requestAnimationFrame(() => {
      setOverlayHidden(true);
    });
  };

  useGSAP(() => {
    if (!imageLoaded || !animationReady) return;
    gsap.registerPlugin(ScrollTrigger);

    const mm = gsap.matchMedia();

    // ==========================================
    // DESKTOP: The "Reverse Dolly" Cinematic
    // ==========================================
    mm.add("(min-width: 768px)", () => {
      if (!desktopContainerRef.current) return;

      if (prefersReducedMotion) {
        gsap.set([
          imageBaseRef.current, imageEdgeRef.current, imageTrackRef.current, 
          narrativeWrapRef.current, headlineWrapRef.current, bodyRef.current, 
          ctaRef.current, statsRef.current, vignetteRef.current
        ], { clearProps: 'all', opacity: 1, scale: 1, y: 0 });
        return;
      }

      // --- SETUP: Initial State (The "Close-up") ---
      // 1. Camera starts zoomed in on the skyline
      gsap.set([imageTrackRef.current, imageBaseRef.current, imageEdgeRef.current], {
        scale: 1.25, // Start closer for more dramatic pull-back
        transformOrigin: '50% 60%', // Pivot around Sagrada Familia/City Center
      });
      
      // 2. Depth Layers
      gsap.set(imageEdgeRef.current, { opacity: 0.4 }); // Subtle blur bloom
      gsap.set(vignetteRef.current, { opacity: 0 }); // Start bright
      
      // 3. Content Stage (The "Clean Slate")
      gsap.set(headlineWrapRef.current, { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' });
      gsap.set(bodyRef.current, { opacity: 0, y: 60, filter: 'blur(10px)' }); // Prepare for "Rack Focus" entry
      gsap.set(narrativeWrapRef.current, { y: 0 });
      gsap.set(ctaRef.current, { opacity: 0, y: 40 });
      gsap.set(statsRef.current, { opacity: 0 });

      // --- TIMELINE: The Story ---
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: desktopContainerRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1.5, // Heavier scrub for "expensive" camera feel
          // SNAP REMOVED: Fluid control is more premium
        }
      });

      // --- ACT 1: THE HOOK (0% -> 35%) ---
      // "Spain has cannabis clubs..." fades out as we widen the shot.
      
      // Camera: Pull back significantly
      tl.to([imageTrackRef.current, imageBaseRef.current, imageEdgeRef.current], {
        scale: 1.15,
        duration: 1,
        ease: 'power1.inOut'
      }, 0);

      // Headline: Cinematic Exit (Blur + Fly Up + Expand)
      tl.to(headlineWrapRef.current, {
        opacity: 0,
        y: -80,
        scale: 1.05, // Slight growth implies moving "past" the camera
        filter: 'blur(12px)', // Cinematic rack focus exit
        duration: 0.8,
        ease: 'power2.in'
      }, 0);

      // Vignette: Creep in to prep for readability
      tl.to(vignetteRef.current, { opacity: 0.4, duration: 1 }, 0);

      // --- ACT 2: THE CONTEXT (35% -> 70%) ---
      // "Most people get them wrong..." paragraph enters crisply.
      
      // Body: Enter from below (The "Rack Focus" effect)
      tl.to(bodyRef.current, {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        duration: 0.8,
        ease: 'power2.out'
      }, 0.3); // Overlap slightly with headline exit

      // Camera: Continue steady pull back
      tl.to([imageTrackRef.current, imageBaseRef.current, imageEdgeRef.current], {
        scale: 1.08,
        duration: 1,
        ease: 'none' // Linear middle movement
      }, 1);

      // Narrative Container: Slide up to make room for footer
      tl.to(narrativeWrapRef.current, {
        y: -60, 
        duration: 1,
        ease: 'power1.inOut'
      }, 1);

      // Vignette: Darken fully for contrast
      tl.to(vignetteRef.current, { opacity: 0.7, duration: 1 }, 1);

      // --- ACT 3: THE ACTION (70% -> 100%) ---
      // Paragraph dims slightly, Buttons & Stats reveal.

      // Camera: Final lock to 1.0
      tl.to([imageTrackRef.current, imageBaseRef.current, imageEdgeRef.current], {
        scale: 1.0,
        duration: 1,
        ease: 'power2.out' // Soft landing
      }, 2);

      // CTAs: Stagger in from below
      tl.to(ctaRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out'
      }, 2.2);

      // Stats: Subtle fade in
      tl.to(statsRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.6
      }, 2.4);
    });

    // ==========================================
    // MOBILE: Ambient Motion + Native Scrolling
    // ==========================================
    mm.add("(max-width: 767px)", () => {
      if (!mobileContainerRef.current || !mobileContentRef.current) return;

      if (prefersReducedMotion) {
        gsap.set(mobileContentRef.current.children, { opacity: 1, y: 0 });
        return;
      }

      // 1. Slow cinematic background push (Time-based, infinite)
      gsap.to(mobileBgRef.current, {
        scale: 1.08,
        duration: 25,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        transformOrigin: "center 15%" // Focus push on the skyline
      });

      // 2. Snappy UI Stagger Entry (Plays once on load)
      gsap.from(mobileContentRef.current.children, {
        y: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: "power3.out",
        delay: 0.1,
        clearProps: "all"
      });
    });

    return () => mm.revert();

  }, { scope: rootRef, dependencies: [imageLoaded, animationReady, prefersReducedMotion] });

  const sectionStyle = prefersReducedMotion ? undefined : ({ height: HERO_CONFIG.scrollHeight } as const);
  const stageClasses = prefersReducedMotion
    ? 'relative min-h-[100dvh] w-full overflow-hidden bg-black'
    : 'sticky top-0 left-0 h-[100dvh] w-full overflow-hidden bg-black';

  return (
    <section ref={rootRef} className="relative w-full bg-black">
      
      {/* ========================================================= */}
      {/* DESKTOP EXPERIENCE (Hidden on mobile)                       */}
      {/* ========================================================= */}
      <div className="hidden md:block w-full" ref={desktopContainerRef} style={sectionStyle}>
        <div className={stageClasses}>
          {/* --- DRONE BACKGROUND --- */}
          <div className="absolute inset-0 bg-black">
            <div ref={imageBaseRef} className="absolute inset-[-10%] will-change-transform">
              <Image src="/images/hero/barcelona-skyline.webp" alt="" width={HERO_CONFIG.image.width} height={HERO_CONFIG.image.height} sizes="(min-width: 768px) 120vw, 100vw" quality={78} loading="lazy" decoding="async" fetchPriority="low" className="h-full w-full object-cover brightness-[1.02] saturate-[1.02] select-none" />
            </div>
            <div ref={imageEdgeRef} className="absolute inset-[-14%] will-change-transform" style={{ WebkitMaskImage: 'radial-gradient(ellipse 125% 120% at 50% 45%, rgba(0, 0, 0, 0) 58%, rgba(0, 0, 0, 1) 100%)', maskImage: 'radial-gradient(ellipse 125% 120% at 50% 45%, rgba(0, 0, 0, 0) 58%, rgba(0, 0, 0, 1) 100%)' }}>
              <Image src="/images/hero/barcelona-skyline.webp" alt="" width={HERO_CONFIG.image.width} height={HERO_CONFIG.image.height} sizes="(min-width: 768px) 128vw, 100vw" quality={68} loading="lazy" decoding="async" fetchPriority="low" className="h-full w-full object-cover blur-xl brightness-[1.02] saturate-[1.02] select-none" />
            </div>
            <div ref={imageTrackRef} className="absolute inset-x-0 top-0 will-change-transform">
              <Image src="/images/hero/barcelona-skyline.webp" alt={t('hero.section.image_alt')} width={HERO_CONFIG.image.width} height={HERO_CONFIG.image.height} sizes="100vw" priority quality={88} className="h-auto w-full select-none" onLoad={handleHeroImageLoad} />
            </div>
          </div>

          {/* --- LIGHTING / BASE VIGNETTE --- */}
          <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-b from-black/40 via-transparent to-black/40" />
          <div ref={vignetteRef} className="absolute inset-0 z-10 pointer-events-none bg-black/50 backdrop-blur-[2px] will-change-opacity" />

          {/* --- CONTENT LAYER --- */}
          <div className="absolute inset-0 z-20 px-4 md:px-6">
            <div className="relative mx-auto h-full w-full max-w-6xl">
              
              {/* --- TOP HALF: NARRATIVE & MORPHING HEADLINE --- */}
              <div className="absolute inset-0 flex items-center justify-center text-center">
                <div ref={narrativeWrapRef} className="w-full max-w-5xl will-change-transform relative">
                  <div className="absolute inset-0 z-[-1] w-[150%] h-[150%] -left-[25%] -top-[25%] bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.45)_0%,transparent_65%)] pointer-events-none blur-md" />

                  <div ref={headlineWrapRef} className="will-change-transform w-full">
                      <h1 className="text-[clamp(2.5rem,5vw,4.5rem)] font-black font-serif text-white tracking-tight leading-[1.1] drop-shadow-[0_10px_40px_rgba(0,0,0,0.85)] max-w-4xl mx-auto">
                        Spain has cannabis clubs.<br />
                        <span className="text-white/70">Most people get them completely wrong.</span><br />
                        <span className="text-[#E8A838]">That&apos;s Why We&apos;re Here.</span>
                      </h1>
                      
                      <div className="mt-8 flex items-center justify-center gap-2 text-sm sm:text-base md:text-lg text-white/80 font-medium tracking-widest uppercase">
                        <span>Currently covering:</span>
                        <div className="flex items-center text-[#E8A838] font-bold">
                          <MorphingText texts={['Barcelona', 'Madrid', 'Valencia', 'Tenerife']} className="inline-block" />
                        </div>
                      </div>
                  </div>

                  <div ref={bodyRef} className="mx-auto mt-6 sm:mt-10 max-w-3xl will-change-transform px-4 relative z-10">
                    <p className="text-base md:text-lg lg:text-xl text-gray-100 leading-relaxed font-medium [text-shadow:0_2px_8px_rgba(0,0,0,0.9),0_4px_20px_rgba(0,0,0,0.6)]">
                      Cannabis Social Clubs are private, members-only associations operating in Spain&apos;s legal grey zone. They can&apos;t advertise, can&apos;t recruit publicly, and can&apos;t vet visitors on their own. We do that work — through independent verification, education, and the most comprehensive safety resources in the space.
                    </p>
                  </div>
                </div>
              </div>

              {/* --- BOTTOM HALF: CTAS & STATS --- */}
              <div className="absolute inset-x-0 bottom-6 md:bottom-10 pointer-events-none flex flex-col items-center justify-end h-full">
                <div ref={ctaRef} className="pointer-events-auto w-full max-w-3xl mx-auto will-change-transform mb-6">
                  <div className="flex flex-col md:flex-row justify-center gap-3 md:gap-5 px-4">
                    <Link href={`/${language}/safety-kit`} className="w-full md:w-auto">
                      <Button size="lg" className="w-full px-6 md:px-10 py-6 md:py-7 text-sm md:text-lg font-bold rounded-full bg-[#E8A838] text-black hover:bg-[#d4962e] hover:scale-105 transition-all duration-300 shadow-[0_10px_40px_rgba(232,168,56,0.3)]">
                        Get the Free Safety Kit
                      </Button>
                    </Link>
                    <Link href={`/${language}/editorial/legal`} className="w-full md:w-auto">
                      <Button size="lg" variant="outline" className="w-full px-6 md:px-10 py-6 md:py-7 text-sm md:text-lg font-bold rounded-full border-2 border-white text-white bg-black/30 backdrop-blur-md hover:bg-white/10 hover:scale-105 transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
                        How Clubs Actually Work &rarr;
                      </Button>
                    </Link>
                  </div>
                </div>

                <div ref={statsRef} className="pointer-events-auto w-full will-change-transform px-4 flex justify-center pb-4">
                   <div className="flex flex-col items-center gap-2 text-white/60 animate-bounce">
                     <span className="text-sm font-medium tracking-widest uppercase">What most tourists get wrong</span>
                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
                   </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
      {/* ========================================================= */}
      {/* MOBILE NATIVE EXPERIENCE (Hidden on desktop)                */}
      {/* ========================================================= */}
      <div className="block md:hidden relative w-full min-h-[100dvh] bg-black overflow-hidden flex flex-col" ref={mobileContainerRef}>
        
        {/* Background Layer with Dark Gradients */}
        <div className="absolute inset-0 z-0">
          <div ref={mobileBgRef} className="relative w-full h-full will-change-transform">
            {/* object-[center_15%] drops the blue sky nicely for the typography */}
            <Image src="/images/hero/barcelona-skyline.webp" alt={t('hero.section.image_alt')} fill quality={80} sizes="100vw" loading="lazy" decoding="async" className="object-cover object-[center_15%]" onLoad={handleHeroImageLoad} />
          </div>
          
          {/* Global Vignette for Cinematic Mood */}
          <div className="absolute inset-0 bg-black/30 pointer-events-none" />
          
          {/* Gradients for Text Contrast */}
          <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/90 via-black/40 to-transparent h-[50vh] pointer-events-none" />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/95 to-transparent h-[75vh] pointer-events-none" />
        </div>

        {/* Content Layer */}
        <div ref={mobileContentRef} className="relative z-10 flex flex-col min-h-[100dvh] px-5 pt-12 pb-6">
          
          {/* TOP: Typography Stack */}
          <div className="flex flex-col items-center text-center w-full mt-8">
            <h1 className="text-[8vw] leading-[1.15] font-black font-serif text-white tracking-tight drop-shadow-[0_10px_30px_rgba(0,0,0,0.9)] max-w-sm mx-auto">
              Spain has cannabis clubs.<br />
              <span className="text-white/70">Most people get them completely wrong.</span><br />
              <span className="text-[#E8A838]">That&apos;s Why We&apos;re Here.</span>
            </h1>
            <div className="mt-8 flex flex-col items-center justify-center gap-1 text-[11px] text-white/80 font-medium tracking-widest uppercase">
              <span>Currently covering:</span>
              <div className="text-[#E8A838] font-bold h-[20px] overflow-hidden">
                <MorphingText texts={['Barcelona', 'Madrid', 'Valencia', 'Tenerife']} className="inline-block" />
              </div>
            </div>

            <p className="mt-8 text-[15px] sm:text-base text-gray-100 font-medium leading-relaxed drop-shadow-[0_4px_10px_rgba(0,0,0,0.9)] px-2">
              Cannabis Social Clubs are private, members-only associations operating in Spain&apos;s legal grey zone. They can&apos;t advertise, can&apos;t recruit publicly, and can&apos;t vet visitors on their own. We do that work — through independent verification, education, and the most comprehensive safety resources in the space.
            </p>
          </div>
          
          {/* Spacer pushes the CTAs to the bottom visually */}
          <div className="flex-grow min-h-[4vh]" /> 

          {/* BOTTOM: CTAs & Stats */}
          <div className="w-full flex flex-col gap-6 mt-8">
            
            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
              <Link href={`/${language}/safety-kit`} className="w-full">
                <Button size="lg" className="w-full py-7 text-base font-bold rounded-full bg-[#E8A838] text-black hover:bg-[#d4962e] shadow-[0_4px_20px_rgba(232,168,56,0.3)]">
                  Get the Free Safety Kit
                </Button>
              </Link>
              <Link href={`/${language}/editorial/legal`} className="w-full">
                <Button size="lg" variant="outline" className="w-full py-7 text-base font-bold rounded-full border border-white/40 text-white bg-white/10 backdrop-blur-md">
                  How Clubs Actually Work &rarr;
                </Button>
              </Link>
            </div>

            {/* Scroll Indicator */}
            <div className="flex flex-col items-center justify-center gap-2 text-white/60 animate-bounce mt-4 pb-2">
              <span className="text-[10px] font-medium tracking-widest uppercase">What most tourists get wrong</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
            </div>
          </div>

        </div>
      </div>
      {/* ========================================================= */}
      {/* GLOBAL LOADING OVERLAY                                    */}
      {/* ========================================================= */}
      <div className={`fixed inset-0 z-[100] flex items-center justify-center bg-zinc-900 transition-opacity duration-1000 ${overlayHidden ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <div className="flex flex-col items-center gap-6">
          <div className="w-20 h-20 md:w-28 md:h-28 border-4 border-[#E8A838] border-t-transparent rounded-full animate-spin" />
          <p className="text-white/70 text-sm md:text-base tracking-wider">{t('hero.section.loading')}</p>
        </div>
      </div>

    </section>
  );
}
