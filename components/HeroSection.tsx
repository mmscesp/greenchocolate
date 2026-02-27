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

  useGSAP(() => {
    if (!imageLoaded) return;
    gsap.registerPlugin(ScrollTrigger);

    const mm = gsap.matchMedia();

    // ==========================================
    // DESKTOP: Scroll-Driven Cinematic Experience
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

      const aspectRatio = HERO_CONFIG.image.height / HERO_CONFIG.image.width;
      const getViewportHeight = () => window.visualViewport?.height || window.innerHeight;
      const getBaseImageHeight = () => window.innerWidth * aspectRatio;
      const getTravel = (scale = 1) => Math.max(0, getBaseImageHeight() * scale - getViewportHeight());

      const getInitialY = () => -getTravel(HERO_CONFIG.focal.initialZoom) * HERO_CONFIG.focal.initialTravel;
      const getAct2Y = () => -getTravel(1.08) * HERO_CONFIG.focal.act2Travel;
      const getAct3Y = () => -getTravel(1.04) * HERO_CONFIG.focal.act3Travel;
      const getFinalY = () => -getTravel(HERO_CONFIG.focal.finalScale) * HERO_CONFIG.focal.act4Travel;

      gsap.set([imageTrackRef.current, imageBaseRef.current, imageEdgeRef.current], {
        scale: HERO_CONFIG.focal.initialZoom,
        y: getInitialY,
        transformOrigin: '50% 62%',
      });
      gsap.set(imageEdgeRef.current, { opacity: 0.36 });
      gsap.set(vignetteRef.current, { opacity: 0 }); 
      
      gsap.set(headlineWrapRef.current, { opacity: 1, y: 0, scale: 1, transformOrigin: '50% 0%' });
      gsap.set(narrativeWrapRef.current, { y: 0, opacity: 1 });
      gsap.set(bodyRef.current, { opacity: 0, y: "4vh" });
      gsap.set(ctaRef.current, { opacity: 0, y: "4vh" });
      gsap.set(statsRef.current, { opacity: 0, y: "6vh" });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: desktopContainerRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1.2,
          snap: {
            snapTo: "labels",
            duration: { min: 0.2, max: 0.6 },
            delay: 0.1,
            ease: "power2.inOut",
          }
        }
      });

      const ACT = 1;
      tl.addLabel('act1', 0);

      tl.to([imageTrackRef.current, imageBaseRef.current], { scale: 1.08, y: getAct2Y, ease: 'none', duration: ACT }, 0)
        .to(imageEdgeRef.current, { scale: 1.08, y: getAct2Y, opacity: 0.34, ease: 'none', duration: ACT }, 0)
        .to(headlineWrapRef.current, { scale: 0.8, y: "-3vh", ease: 'power2.inOut', duration: ACT }, 0)
        .to(bodyRef.current, { opacity: 1, y: 0, ease: 'power2.out', duration: ACT * 0.8 }, 0.2);
      
      tl.addLabel('act2', 1);

      tl.to([imageTrackRef.current, imageBaseRef.current], { scale: 1.04, y: getAct3Y, ease: 'none', duration: ACT }, 1)
        .to(imageEdgeRef.current, { scale: 1.04, y: getAct3Y, opacity: 0.32, ease: 'none', duration: ACT }, 1)
        .to(narrativeWrapRef.current, { y: "-8vh", ease: 'power2.inOut', duration: ACT }, 1)
        .to(ctaRef.current, { opacity: 1, y: 0, ease: 'power2.out', duration: ACT * 0.8 }, 1.2);
      
      tl.addLabel('act3', 2);

      tl.to([imageTrackRef.current, imageBaseRef.current], { scale: HERO_CONFIG.focal.finalScale, y: getFinalY, ease: 'power1.out', duration: ACT }, 2)
        .to(imageEdgeRef.current, { scale: HERO_CONFIG.focal.finalScale, y: getFinalY, opacity: 0.30, ease: 'power1.out', duration: ACT }, 2)
        .to(vignetteRef.current, { opacity: 1, ease: 'power2.inOut', duration: ACT }, 2) 
        .to(narrativeWrapRef.current, { y: "-14vh", scale: 0.9, ease: 'power2.inOut', duration: ACT }, 2)
        .to(ctaRef.current, { y: "-4vh", scale: 0.95, ease: 'power2.inOut', duration: ACT }, 2)
        .to(statsRef.current, { opacity: 1, y: 0, ease: 'power2.out', duration: ACT * 0.8 }, 2.2);

      tl.addLabel('act4', 3);
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

  }, { scope: rootRef, dependencies: [imageLoaded, prefersReducedMotion] });

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
              <Image src="/images/hero/barcelona-skyline.webp" alt="" width={HERO_CONFIG.image.width} height={HERO_CONFIG.image.height} priority quality={82} className="h-full w-full object-cover brightness-[1.02] saturate-[1.02] select-none" />
            </div>
            <div ref={imageEdgeRef} className="absolute inset-[-14%] will-change-transform" style={{ WebkitMaskImage: 'radial-gradient(ellipse 125% 120% at 50% 45%, rgba(0, 0, 0, 0) 58%, rgba(0, 0, 0, 1) 100%)', maskImage: 'radial-gradient(ellipse 125% 120% at 50% 45%, rgba(0, 0, 0, 0) 58%, rgba(0, 0, 0, 1) 100%)' }}>
              <Image src="/images/hero/barcelona-skyline.webp" alt="" width={HERO_CONFIG.image.width} height={HERO_CONFIG.image.height} priority quality={72} className="h-full w-full object-cover blur-xl brightness-[1.02] saturate-[1.02] select-none" />
            </div>
            <div ref={imageTrackRef} className="absolute inset-x-0 top-0 will-change-transform">
              <Image src="/images/hero/barcelona-skyline.webp" alt={t('hero.section.image_alt')} width={HERO_CONFIG.image.width} height={HERO_CONFIG.image.height} priority quality={88} className="h-auto w-full select-none" onLoad={() => setImageLoaded(true)} />
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
                      <h1 className="sr-only">
                        {t('hero.section.sr_title')}
                      </h1>
                      <p className="text-xs sm:text-base md:text-xl lg:text-2xl text-white tracking-[0.25em] uppercase font-light [text-shadow:0_2px_10px_rgba(0,0,0,0.8),0_4px_30px_rgba(0,0,0,0.6)]">
                        {t('hero.section.strapline_top')}
                      </p>
                      <p className="mt-2 text-xs sm:text-base md:text-xl lg:text-2xl text-[#D9534F] tracking-[0.25em] uppercase font-black [text-shadow:0_2px_10px_rgba(0,0,0,0.8),0_4px_30px_rgba(0,0,0,0.6)]">
                        {t('hero.section.strapline_bottom')}
                      </p>
                      
                      <div className="mt-4 sm:mt-6 flex items-center justify-center w-full max-w-5xl mx-auto overflow-hidden">
                        <div className="flex-1 flex justify-center h-[3rem] sm:h-[4.5rem] md:h-[6.5rem] lg:h-[8rem] drop-shadow-[0_10px_40px_rgba(0,0,0,0.85)]">
                          <MorphingText texts={localCities} className="text-[clamp(1.2rem,4.5vw,7.5rem)] font-black text-white tracking-tighter uppercase" />
                        </div>
                        <span aria-hidden="true" className="px-1 sm:px-4 text-[clamp(1.5rem,5.5vw,8rem)] text-[#E8A838] font-black leading-none shrink-0 drop-shadow-[0_0_30px_rgba(232,168,56,0.8)] pb-2 md:pb-4">
                          ×
                        </span>
                        <div className="flex-1 flex justify-center h-[3rem] sm:h-[4.5rem] md:h-[6.5rem] lg:h-[8rem] drop-shadow-[0_10px_40px_rgba(0,0,0,0.85)]">
                          <MorphingText texts={globalCities} className="text-[clamp(1.2rem,4.5vw,7.5rem)] font-black text-white tracking-tighter uppercase" />
                        </div>
                      </div>
                  </div>

                  <div ref={bodyRef} className="mx-auto mt-2 sm:mt-5 max-w-3xl will-change-transform px-4 relative z-10">
                    <p className="text-sm md:text-lg lg:text-xl text-gray-100 leading-relaxed font-medium [text-shadow:0_2px_8px_rgba(0,0,0,0.9),0_4px_20px_rgba(0,0,0,0.6)]">
                      {t('hero.section.body')}
                    </p>
                    <p className="mt-3 text-base md:text-xl lg:text-2xl text-white font-bold uppercase tracking-[0.12em] [text-shadow:0_2px_10px_rgba(0,0,0,0.9),0_4px_30px_rgba(0,0,0,0.7)]">
                      {t('hero.section.subbody')}
                    </p>
                  </div>
                </div>
              </div>

              {/* --- BOTTOM HALF: CTAS & STATS --- */}
              <div className="absolute inset-x-0 bottom-6 md:bottom-10 pointer-events-none flex flex-col items-center justify-end h-full">
                <div ref={ctaRef} className="pointer-events-auto w-full max-w-3xl mx-auto will-change-transform mb-6">
                  <div className="flex flex-col md:flex-row justify-center gap-3 md:gap-5 px-4">
                    <Link href={`/${language}/safety`} className="w-full md:w-auto">
                      <Button size="lg" className="w-full px-6 md:px-10 py-6 md:py-7 text-sm md:text-lg font-bold rounded-full bg-[#E8A838] text-black hover:bg-[#d4962e] hover:scale-105 transition-all duration-300 shadow-[0_10px_40px_rgba(232,168,56,0.3)]">
                        {t('hero.section.cta_safety')}
                      </Button>
                    </Link>
                    <Link href={`/${language}/editorial/legal`} className="w-full md:w-auto">
                      <Button size="lg" variant="outline" className="w-full px-6 md:px-10 py-6 md:py-7 text-sm md:text-lg font-bold rounded-full border-2 border-white text-white bg-black/30 backdrop-blur-md hover:bg-white/10 hover:scale-105 transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
                        {t('hero.section.cta_how_it_works')}
                      </Button>
                    </Link>
                  </div>
                </div>

                <div ref={statsRef} className="pointer-events-auto w-full will-change-transform px-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 max-w-5xl mx-auto">
                    {[
                      { value: '4', label: t('hero.section.stats.desktop.guides'), icon: BookOpen },
                      { value: '2.5K+', label: t('hero.section.stats.desktop.kits'), icon: Shield },
                      { value: '€0', label: t('hero.section.stats.desktop.fines'), icon: AlertCircle },
                      { value: 'Mar 26', label: t('hero.section.stats.desktop.launch'), icon: Calendar },
                    ].map((stat, i) => {
                      const Icon = stat.icon;
                      return (
                        <div key={i} className="bg-black/60 backdrop-blur-xl border border-white/20 p-3 md:px-5 md:py-4 rounded-xl text-center shadow-[0_20px_80px_rgba(0,0,0,0.6)]">
                          <div className="mb-2 flex justify-center">
                            <Icon className="h-4 w-4 md:h-6 md:w-6 text-[#E8A838]" />
                          </div>
                          <div className="text-xl md:text-3xl lg:text-4xl font-black text-white mb-0.5">{stat.value}</div>
                          <div className="text-[9px] md:text-[11px] font-bold text-[#E8A838] uppercase tracking-[0.18em]">
                            {stat.label}
                          </div>
                        </div>
                      );
                    })}
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
          <div ref={mobileBgRef} className="w-full h-full will-change-transform">
            {/* object-[center_15%] drops the blue sky nicely for the typography */}
            <Image src="/images/hero/barcelona-skyline.webp" alt={t('hero.section.image_alt')} fill priority quality={80} className="object-cover object-[center_15%]" onLoad={() => setImageLoaded(true)} />
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
            <h1 className="sr-only">{t('hero.section.sr_title')}</h1>
            <p className="text-[11px] sm:text-xs text-white tracking-[0.3em] uppercase font-medium drop-shadow-md">{t('hero.section.strapline_top')}</p>
            <p className="mt-4 text-[11px] sm:text-xs text-[#D9534F] tracking-[0.3em] uppercase font-black drop-shadow-md">{t('hero.section.strapline_bottom')}</p>
            
            <div className="mt-6 flex flex-col items-center justify-center w-full">
              {/* Stacked Morphing Text for massive impact */}
              <div className="h-[18vw] sm:h-[6rem] flex items-center justify-center w-full overflow-visible">
                <MorphingText texts={localCities} className="text-[13vw] sm:text-[5rem] font-black text-white tracking-tighter uppercase drop-shadow-[0_10px_30px_rgba(0,0,0,0.9)]" />
              </div>
              
              <div className="h-[2.5rem] flex items-center justify-center">
                <span className="text-[#E8A838] text-[3rem] font-black leading-none drop-shadow-lg">×</span>
              </div>
              
              <div className="h-[18vw] sm:h-[6rem] flex items-center justify-center w-full overflow-visible">
                <MorphingText texts={globalCities} className="text-[13vw] sm:text-[5rem] font-black text-white tracking-tighter uppercase drop-shadow-[0_10px_30px_rgba(0,0,0,0.9)]" />
              </div>
            </div>

            <p className="mt-10 text-[15px] sm:text-base text-gray-100 font-medium leading-relaxed drop-shadow-[0_4px_10px_rgba(0,0,0,0.9)] px-2">
              {t('hero.section.body')}
            </p>
            <p className="mt-4 text-[16px] sm:text-lg text-white font-bold uppercase tracking-[0.1em] drop-shadow-[0_4px_15px_rgba(0,0,0,0.9)]">
              {t('hero.section.subbody')}
            </p>
          </div>
          
          {/* Spacer pushes the CTAs to the bottom visually */}
          <div className="flex-grow min-h-[4vh]" /> 

          {/* BOTTOM: CTAs & Stats */}
          <div className="w-full flex flex-col gap-6 mt-8">
            
            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
              <Link href={`/${language}/safety`} className="w-full">
                <Button size="lg" className="w-full py-7 text-base font-bold rounded-full bg-[#E8A838] text-black hover:bg-[#d4962e] shadow-[0_4px_20px_rgba(232,168,56,0.3)]">
                  {t('hero.section.cta_safety')}
                </Button>
              </Link>
              <Link href={`/${language}/editorial/legal`} className="w-full">
                <Button size="lg" variant="outline" className="w-full py-7 text-base font-bold rounded-full border border-white/40 text-white bg-white/10 backdrop-blur-md">
                  {t('hero.section.cta_how_it_works')}
                </Button>
              </Link>
            </div>

            {/* Native Glassmorphic Stats */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: '4', label: t('hero.section.stats.mobile.guides'), icon: BookOpen },
                { value: '2.5K+', label: t('hero.section.stats.mobile.kits'), icon: Shield },
                { value: '€0', label: t('hero.section.stats.mobile.fines'), icon: AlertCircle },
                { value: 'Mar 26', label: t('hero.section.stats.mobile.launch'), icon: Calendar },
              ].map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <div key={i} className="bg-black/50 backdrop-blur-lg border border-white/15 p-4 rounded-xl text-center shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
                    <div className="mb-2 flex justify-center"><Icon className="h-5 w-5 text-[#E8A838]" /></div>
                    <div className="text-2xl font-black text-white mb-0.5">{stat.value}</div>
                    <div className="text-[10px] font-bold text-[#E8A838] uppercase tracking-[0.15em]">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
      {/* ========================================================= */}
      {/* GLOBAL LOADING OVERLAY                                    */}
      {/* ========================================================= */}
      <div className={`fixed inset-0 z-[100] flex items-center justify-center bg-zinc-900 transition-opacity duration-1000 ${imageLoaded ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <div className="flex flex-col items-center gap-6">
          <div className="w-20 h-20 md:w-28 md:h-28 border-4 border-[#E8A838] border-t-transparent rounded-full animate-spin" />
          <p className="text-white/70 text-sm md:text-base tracking-wider">{t('hero.section.loading')}</p>
        </div>
      </div>

    </section>
  );
}
