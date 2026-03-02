'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useLanguage } from '@/hooks/useLanguage';

const HERO_CONFIG = {
  scrollHeight: '200vh', 
  image: { width: 3937, height: 5906 },
  focal: {
    initialZoom: 1.2,
    initialTravel: 0.16,
    finalScale: 1.05,
    finalTravel: 0.55,
  },
} as const;

export default function HeroSection() {
  const { t, language } = useLanguage();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [overlayHidden, setOverlayHidden] = useState(false);
  const [animationReady, setAnimationReady] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const rootRef = useRef<HTMLElement>(null);

  // --- DESKTOP REFS ---
  const desktopContainerRef = useRef<HTMLDivElement>(null);
  const imageBaseRef = useRef<HTMLDivElement>(null);
  const imageEdgeRef = useRef<HTMLDivElement>(null);
  const imageTrackRef = useRef<HTMLDivElement>(null);
  
  const headlineWrapRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
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
      if (frameOne) window.cancelAnimationFrame(frameOne);
      if (frameTwo) window.cancelAnimationFrame(frameTwo);
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
    // DESKTOP: THE PREMIUM "SPREAD" LAYOUT
    // ==========================================
    mm.add("(min-width: 768px)", () => {
      if (!desktopContainerRef.current) return;

      if (prefersReducedMotion) {
        gsap.set([
          imageBaseRef.current, imageEdgeRef.current, imageTrackRef.current, 
          headlineWrapRef.current, bodyRef.current, ctaRef.current, vignetteRef.current
        ], { clearProps: 'all', opacity: 1, scale: 1, y: 0 });
        return;
      }

      const aspectRatio = HERO_CONFIG.image.height / HERO_CONFIG.image.width;
      const getViewportHeight = () => window.visualViewport?.height || window.innerHeight;
      const getBaseImageHeight = () => window.innerWidth * aspectRatio;
      const getTravel = (scale = 1) => Math.max(0, getBaseImageHeight() * scale - getViewportHeight());

      const getInitialY = () => -getTravel(HERO_CONFIG.focal.initialZoom) * HERO_CONFIG.focal.initialTravel;
      const getFinalY = () => -getTravel(HERO_CONFIG.focal.finalScale) * HERO_CONFIG.focal.finalTravel;

      // 1. INITIAL STATES (Act 1)
      gsap.set([imageTrackRef.current, imageBaseRef.current, imageEdgeRef.current], {
        scale: HERO_CONFIG.focal.initialZoom,
        y: getInitialY,
        transformOrigin: '50% 62%', 
      });
      gsap.set(imageEdgeRef.current, { opacity: 0.36 });
      gsap.set(vignetteRef.current, { opacity: 0 }); 
      
      // H1 starts perfectly centered, dominant.
      gsap.set(headlineWrapRef.current, { opacity: 1, y: "0vh", scale: 1, transformOrigin: "center center" });
      
      // Body & CTAs start completely hidden, deep down off-screen.
      gsap.set(bodyRef.current, { opacity: 0, y: "20vh", transformOrigin: "center center" }); 
      gsap.set(ctaRef.current, { opacity: 0, y: "30vh", transformOrigin: "center center" });  

      // 2. TIMELINE
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
            ease: "power2.inOut"
          }
        }
      });

      const ACT = 1;

      // --- ACT 1: THE HOOK (0%) ---
      tl.addLabel('act1', 0);

      // --- ACT 1 -> ACT 2: THE CURTAIN RISE ---
      tl.to([imageTrackRef.current, imageBaseRef.current], { scale: HERO_CONFIG.focal.finalScale, y: getFinalY, ease: 'power1.inOut', duration: ACT }, 0)
        .to(imageEdgeRef.current, { scale: HERO_CONFIG.focal.finalScale, y: getFinalY, opacity: 0.25, ease: 'power1.inOut', duration: ACT }, 0)
        .to(vignetteRef.current, { opacity: 0.85, ease: 'power2.inOut', duration: ACT }, 0)
        
        // HEADLINE: Barely shrinks at all (0.9). Moves UP into the top third of the screen.
        .to(headlineWrapRef.current, { 
          scale: 0.9, 
          y: "-20vh", 
          ease: 'power2.inOut', 
          duration: ACT 
        }, 0)
        
        // BODY: Rises up from the depths into the middle slot.
        .to(bodyRef.current, { 
          opacity: 1, 
          y: "8vh", 
          ease: 'power2.out', 
          duration: ACT * 0.8 
        }, 0.2)

        // CTAs: Follows the body up, landing in the bottom third.
        .to(ctaRef.current, { 
          opacity: 1, 
          y: "22vh", 
          ease: 'power2.out', 
          duration: ACT * 0.8 
        }, 0.25); // Slight stagger behind the body text

      tl.addLabel('act2', 1);
    });

    // ==========================================
    // MOBILE: Native Scroll
    // ==========================================
    mm.add("(max-width: 767px)", () => {
      if (!mobileContainerRef.current || !mobileContentRef.current) return;

      if (prefersReducedMotion) {
        gsap.set(mobileContentRef.current.children, { opacity: 1, y: 0 });
        return;
      }

      gsap.to(mobileBgRef.current, {
        scale: 1.15,
        duration: 30,
        ease: "power1.inOut",
        yoyo: true,
        repeat: -1,
        transformOrigin: "center 15%"
      });

      gsap.from(mobileContentRef.current.children, {
        y: 40,
        opacity: 0,
        duration: 1.2,
        stagger: 0.15,
        ease: "power3.out",
        delay: 0.2,
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
      {/* DESKTOP EXPERIENCE                                          */}
      {/* ========================================================= */}
      <div className="hidden md:block w-full" ref={desktopContainerRef} style={sectionStyle}>
        <div className={stageClasses}>
          
          <div className="absolute inset-0 bg-black">
            <div ref={imageBaseRef} className="absolute inset-[-10%] will-change-transform">
              <Image src="/images/hero/barcelona-skyline.webp" alt="" width={HERO_CONFIG.image.width} height={HERO_CONFIG.image.height} sizes="(min-width: 768px) 120vw, 100vw" quality={78} priority className="h-full w-full object-cover brightness-[1.02] saturate-[1.02] select-none" />
            </div>
            <div ref={imageEdgeRef} className="absolute inset-[-14%] will-change-transform" style={{ WebkitMaskImage: 'radial-gradient(ellipse 125% 120% at 50% 45%, rgba(0, 0, 0, 0) 58%, rgba(0, 0, 0, 1) 100%)', maskImage: 'radial-gradient(ellipse 125% 120% at 50% 45%, rgba(0, 0, 0, 0) 58%, rgba(0, 0, 0, 1) 100%)' }}>
              <Image src="/images/hero/barcelona-skyline.webp" alt="" width={HERO_CONFIG.image.width} height={HERO_CONFIG.image.height} sizes="(min-width: 768px) 128vw, 100vw" quality={68} priority className="h-full w-full object-cover blur-xl brightness-[1.02] saturate-[1.02] select-none" />
            </div>
            <div ref={imageTrackRef} className="absolute inset-x-0 top-0 will-change-transform">
              <Image src="/images/hero/barcelona-skyline.webp" alt={t('hero.section.image_alt')} width={HERO_CONFIG.image.width} height={HERO_CONFIG.image.height} sizes="100vw" priority quality={88} className="h-auto w-full select-none" onLoad={handleHeroImageLoad} />
            </div>
          </div>

          <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-b from-black/50 via-transparent to-black/50" />
          <div ref={vignetteRef} className="absolute inset-0 z-10 pointer-events-none bg-black/70 backdrop-blur-[2px] will-change-opacity" />

          {/* --- FULL CANVAS SPREAD LAYER --- */}
          <div className="absolute inset-0 z-20 overflow-hidden pointer-events-none">
            
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 w-[120vw] h-[100vh] bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.5)_0%,transparent_60%)] pointer-events-none blur-xl" />

            {/* 1. HEADLINE LAYER */}
            <div ref={headlineWrapRef} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[90vw] text-center will-change-transform">
              {/* Added a highly refined text-shadow to make it look 3D and premium */}
              <h1 className="flex flex-col items-center justify-center font-black font-serif tracking-tight leading-[1.05] drop-shadow-[0_15px_40px_rgba(0,0,0,0.95)] [text-shadow:0_2px_10px_rgba(0,0,0,0.8),0_10px_40px_rgba(0,0,0,0.7)] text-[clamp(2.5rem,4.5vw,4.5rem)]">
                <span className="text-white whitespace-nowrap">{t('hero.section.headline.line_1')}</span>
                <span className="text-white/80 whitespace-nowrap">{t('hero.section.headline.line_2')}</span>
                <span className="text-[#E8A838] whitespace-nowrap">{t('hero.section.headline.line_3')}</span>
              </h1>
              <div className="mt-5 text-sm md:text-lg text-white/90 font-medium tracking-wide drop-shadow-md">
                <span>{t('hero.section.covering_label')} </span>
                <span className="text-[#E8A838] font-bold">{t('hero.section.covering_cities')}</span>
              </div>
            </div>

            {/* 2. BODY LAYER (Refined to look like a true sub-element) */}
            <div ref={bodyRef} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl px-6 text-center will-change-transform">
              {/* Changed from text-2xl/bold to text-lg/normal to fix the hierarchy */}
              <p className="text-base md:text-lg lg:text-xl text-gray-200 leading-relaxed font-normal drop-shadow-lg [text-shadow:0_2px_10px_rgba(0,0,0,0.8)]">
                {t('hero.section.body')}
              </p>
            </div>

            {/* 3. CTAs LAYER */}
            <div ref={ctaRef} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full pointer-events-auto will-change-transform">
              <div className="flex flex-col md:flex-row justify-center items-center gap-4 px-6">
                <Link href={`/${language}/safety-kit`} className="w-full md:w-auto">
                  <Button size="lg" className="w-full md:w-auto px-10 py-7 md:py-8 text-sm md:text-lg font-bold rounded-full bg-[#E8A838] text-black hover:bg-[#d4962e] hover:scale-105 transition-all duration-300 shadow-[0_10px_40px_rgba(232,168,56,0.5)]">
                    {t('hero.section.cta_primary')}
                  </Button>
                </Link>
                <Link href={`/${language}/editorial/legal`} className="w-full md:w-auto">
                  <Button size="lg" variant="outline" className="w-full md:w-auto px-10 py-7 md:py-8 text-sm md:text-lg font-bold rounded-full border-2 border-white/60 text-white bg-black/40 backdrop-blur-md hover:bg-white/20 hover:border-white hover:scale-105 transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.6)]">
                    {t('hero.section.cta_secondary')}
                  </Button>
                </Link>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* MOBILE NATIVE EXPERIENCE                                    */}
      {/* ========================================================= */}
      <div className="block md:hidden relative w-full min-h-[100dvh] bg-black overflow-hidden flex flex-col" ref={mobileContainerRef}>
        
        <div className="absolute inset-0 z-0">
          <div ref={mobileBgRef} className="relative w-full h-full will-change-transform">
            <Image src="/images/hero/barcelona-skyline.webp" alt={t('hero.section.image_alt')} fill quality={80} sizes="100vw" priority className="object-cover object-[center_15%]" onLoad={handleHeroImageLoad} />
          </div>
          <div className="absolute inset-0 bg-black/40 pointer-events-none" />
          <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/90 via-black/40 to-transparent h-[50vh] pointer-events-none" />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/95 to-transparent h-[75vh] pointer-events-none" />
        </div>

        <div ref={mobileContentRef} className="relative z-10 flex flex-col min-h-[100dvh] px-5 pt-[100px] pb-8">
          
          <div className="flex flex-col items-center text-center w-full">
            <h1 className="flex flex-col text-[clamp(2rem,8vw,3.5rem)] leading-[1.05] font-black font-serif text-white tracking-tight drop-shadow-[0_10px_30px_rgba(0,0,0,0.95)] w-full">
              <span>{t('hero.section.headline.line_1')}</span>
              <span className="text-white/80">{t('hero.section.headline.line_2')}</span>
              <span className="text-[#E8A838]">{t('hero.section.headline.line_3')}</span>
            </h1>
            <div className="mt-5 flex flex-col items-center justify-center gap-1 text-xs text-white/90 font-medium tracking-wide">
              <span>{t('hero.section.covering_label')} <span className="text-[#E8A838] font-bold">{t('hero.section.covering_cities')}</span></span>
            </div>

            <p className="mt-8 text-[15px] text-gray-200 font-normal leading-relaxed drop-shadow-[0_4px_10px_rgba(0,0,0,0.9)]">
              {t('hero.section.body')}
            </p>
          </div>
          
          <div className="flex-grow min-h-[4vh]" /> 

          <div className="w-full flex flex-col gap-4 mt-8">
            <Link href={`/${language}/safety-kit`} className="w-full">
              <Button size="lg" className="w-full py-7 text-base font-bold rounded-full bg-[#E8A838] text-black hover:bg-[#d4962e] shadow-[0_4px_20px_rgba(232,168,56,0.4)]">
                {t('hero.section.cta_primary')}
              </Button>
            </Link>
            <Link href={`/${language}/editorial/legal`} className="w-full">
              <Button size="lg" variant="outline" className="w-full py-7 text-base font-bold rounded-full border-2 border-white/50 text-white bg-black/40 backdrop-blur-md">
                {t('hero.section.cta_secondary')}
              </Button>
            </Link>
          </div>

        </div>
      </div>

      <div className={`fixed inset-0 z-[100] flex items-center justify-center bg-zinc-900 transition-opacity duration-1000 ${overlayHidden ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <div className="flex flex-col items-center gap-6">
          <div className="w-20 h-20 md:w-28 md:h-28 border-4 border-[#E8A838] border-t-transparent rounded-full animate-spin" />
          <p className="text-white/70 text-sm md:text-base tracking-wider">{t('hero.section.loading')}</p>
        </div>
      </div>

    </section>
  );
}