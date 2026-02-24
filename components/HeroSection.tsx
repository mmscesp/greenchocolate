'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { BookOpen, Shield, AlertCircle, Calendar } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { MorphingText } from '@/components/ui/morphing-text';

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
  const [imageLoaded, setImageLoaded] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const containerRef = useRef<HTMLElement>(null);
  const imageBaseRef = useRef<HTMLDivElement>(null);
  const imageEdgeRef = useRef<HTMLDivElement>(null);
  const imageTrackRef = useRef<HTMLDivElement>(null);

  const narrativeWrapRef = useRef<HTMLDivElement>(null);
  const headlineWrapRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const vignetteRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updatePreference = () => setPrefersReducedMotion(mediaQuery.matches);
    updatePreference();
    mediaQuery.addEventListener('change', updatePreference);
    return () => mediaQuery.removeEventListener('change', updatePreference);
  }, []);

  useGSAP(() => {
    if (!imageLoaded || !containerRef.current) return;
    gsap.registerPlugin(ScrollTrigger);

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

    // --- INITIAL SETUP ---
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

    // --- MAGNETIC SCRUB TIMELINE ---
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
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

    // ACT 1 -> ACT 2
    tl.to([imageTrackRef.current, imageBaseRef.current], { scale: 1.08, y: getAct2Y, ease: 'none', duration: ACT }, 0)
      .to(imageEdgeRef.current, { scale: 1.08, y: getAct2Y, opacity: 0.34, ease: 'none', duration: ACT }, 0)
      .to(headlineWrapRef.current, { scale: 0.8, y: "-3vh", ease: 'power2.inOut', duration: ACT }, 0)
      .to(bodyRef.current, { opacity: 1, y: 0, ease: 'power2.out', duration: ACT * 0.8 }, 0.2);
    
    tl.addLabel('act2', 1);

    // ACT 2 -> ACT 3
    tl.to([imageTrackRef.current, imageBaseRef.current], { scale: 1.04, y: getAct3Y, ease: 'none', duration: ACT }, 1)
      .to(imageEdgeRef.current, { scale: 1.04, y: getAct3Y, opacity: 0.32, ease: 'none', duration: ACT }, 1)
      .to(narrativeWrapRef.current, { y: "-8vh", ease: 'power2.inOut', duration: ACT }, 1)
      .to(ctaRef.current, { opacity: 1, y: 0, ease: 'power2.out', duration: ACT * 0.8 }, 1.2);
    
    tl.addLabel('act3', 2);

    // ACT 3 -> ACT 4
    tl.to([imageTrackRef.current, imageBaseRef.current], { scale: HERO_CONFIG.focal.finalScale, y: getFinalY, ease: 'power1.out', duration: ACT }, 2)
      .to(imageEdgeRef.current, { scale: HERO_CONFIG.focal.finalScale, y: getFinalY, opacity: 0.30, ease: 'power1.out', duration: ACT }, 2)
      .to(vignetteRef.current, { opacity: 1, ease: 'power2.inOut', duration: ACT }, 2) 
      .to(narrativeWrapRef.current, { y: "-14vh", scale: 0.9, ease: 'power2.inOut', duration: ACT }, 2)
      .to(ctaRef.current, { y: "-4vh", scale: 0.95, ease: 'power2.inOut', duration: ACT }, 2)
      .to(statsRef.current, { opacity: 1, y: 0, ease: 'power2.out', duration: ACT * 0.8 }, 2.2);

    tl.addLabel('act4', 3);

    return () => tl.kill();

  }, { scope: containerRef, dependencies: [imageLoaded, prefersReducedMotion] });

  const sectionStyle = prefersReducedMotion ? undefined : ({ height: HERO_CONFIG.scrollHeight } as const);
  const stageClasses = prefersReducedMotion
    ? 'relative min-h-[100dvh] w-full overflow-hidden bg-black'
    : 'sticky top-0 left-0 h-[100dvh] w-full overflow-hidden bg-black';

  return (
    <section ref={containerRef} className="relative w-full" style={sectionStyle}>
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
            <Image src="/images/hero/barcelona-skyline.webp" alt="Barcelona Skyline" width={HERO_CONFIG.image.width} height={HERO_CONFIG.image.height} priority quality={88} className="h-auto w-full select-none" onLoad={() => setImageLoaded(true)} />
          </div>
        </div>

        {/* --- LIGHTING / BASE VIGNETTE --- */}
        <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-b from-black/40 via-transparent to-black/40" />
        
        {/* --- DYNAMIC CINEMATIC SHADOW (ACT 4 Contrast Protector) --- */}
        <div ref={vignetteRef} className="absolute inset-0 z-10 pointer-events-none bg-black/50 backdrop-blur-[2px] will-change-opacity" />

        {/* --- CONTENT LAYER --- */}
        <div className="absolute inset-0 z-20 px-4 md:px-6">
          <div className="relative mx-auto h-full w-full max-w-6xl">
            
            {/* --- TOP HALF: NARRATIVE & MORPHING HEADLINE --- */}
            <div className="absolute inset-0 flex items-center justify-center text-center">
              <div ref={narrativeWrapRef} className="w-full max-w-5xl will-change-transform relative">
                
                {/* INVISIBLE TEXT HALO */}
                <div className="absolute inset-0 z-[-1] w-[150%] h-[150%] -left-[25%] -top-[25%] bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.45)_0%,transparent_65%)] pointer-events-none blur-md" />

                <div ref={headlineWrapRef} className="will-change-transform w-full">
                  
                    {/* SEO GHOST HACK: Updated with the new exact cities! */}
                    <h1 className="sr-only">
                      Social Clubs Maps: Cannabis Social Clubs in Barcelona, Madrid, Tenerife, Valencia compared to dispensaries and coffeeshops in Amsterdam, Los Angeles, Vancouver, and Bangkok.
                    </h1>

                    <p className="text-xs sm:text-base md:text-xl lg:text-2xl text-white tracking-[0.25em] uppercase font-light [text-shadow:0_2px_10px_rgba(0,0,0,0.8),0_4px_30px_rgba(0,0,0,0.6)]">
                      Different city. Different rules.
                    </p>
                    <p className="mt-2 text-xs sm:text-base md:text-xl lg:text-2xl text-[#D9534F] tracking-[0.25em] uppercase font-black [text-shadow:0_2px_10px_rgba(0,0,0,0.8),0_4px_30px_rgba(0,0,0,0.6)]">
                      Different consequences.
                    </p>
                    
                    {/* THE MORPHING UI */}
                    <div className="mt-4 sm:mt-6 flex items-center justify-center w-full max-w-5xl mx-auto overflow-hidden">
                      
                      {/* LEFT: SPANISH CITIES */}
                      <div className="flex-1 flex justify-center h-[3rem] sm:h-[4.5rem] md:h-[6.5rem] lg:h-[8rem] drop-shadow-[0_10px_40px_rgba(0,0,0,0.85)]">
                        <MorphingText 
                          texts={["BARCELONA", "MADRID", "TENERIFE", "VALENCIA"]} 
                          className="text-[clamp(1.2rem,4.5vw,7.5rem)] font-black text-white tracking-tighter uppercase"
                        />
                      </div>

                      {/* THE X */}
                      <span aria-hidden="true" className="px-1 sm:px-4 text-[clamp(1.5rem,5.5vw,8rem)] text-[#E8A838] font-black leading-none shrink-0 drop-shadow-[0_0_30px_rgba(232,168,56,0.8)] pb-2 md:pb-4">
                        ×
                      </span>

                      {/* RIGHT: GLOBAL LEGAL HUBS */}
                      <div className="flex-1 flex justify-center h-[3rem] sm:h-[4.5rem] md:h-[6.5rem] lg:h-[8rem] drop-shadow-[0_10px_40px_rgba(0,0,0,0.85)]">
                        <MorphingText 
                          texts={["AMSTERDAM", "LOS ANGELES", "VANCOUVER", "BANGKOK"]} 
                          className="text-[clamp(1.2rem,4.5vw,7.5rem)] font-black text-white tracking-tighter uppercase"
                        />
                      </div>
                      
                    </div>
                </div>

                <div ref={bodyRef} className="mx-auto mt-2 sm:mt-5 max-w-3xl will-change-transform px-4 relative z-10">
                  <p className="text-sm md:text-lg lg:text-xl text-gray-100 leading-relaxed font-medium [text-shadow:0_2px_8px_rgba(0,0,0,0.9),0_4px_20px_rgba(0,0,0,0.6)]">
                    Spanish CSCs aren&apos;t coffeeshops. No walk-ins. No menus. No second chances.
                  </p>
                  <p className="mt-3 text-base md:text-xl lg:text-2xl text-white font-bold uppercase tracking-[0.12em] [text-shadow:0_2px_10px_rgba(0,0,0,0.9),0_4px_30px_rgba(0,0,0,0.7)]">
                    We&apos;re your verification layer.
                  </p>
                </div>
              </div>
            </div>

            {/* --- BOTTOM HALF: CTAS & STATS --- */}
            <div className="absolute inset-x-0 bottom-6 md:bottom-10 pointer-events-none flex flex-col items-center justify-end h-full">
              
              <div ref={ctaRef} className="pointer-events-auto w-full max-w-3xl mx-auto will-change-transform mb-6">
                <div className="flex flex-col md:flex-row justify-center gap-3 md:gap-5 px-4">
                  <Link href="/safety" className="w-full md:w-auto">
                    <Button size="lg" className="w-full px-6 md:px-10 py-6 md:py-7 text-sm md:text-lg font-bold rounded-full bg-[#E8A838] text-black hover:bg-[#d4962e] hover:scale-105 transition-all duration-300 shadow-[0_10px_40px_rgba(232,168,56,0.3)]">
                      Get the Free Safety Guide →
                    </Button>
                  </Link>
                  <Link href="/editorial/legal" className="w-full md:w-auto">
                    <Button size="lg" variant="outline" className="w-full px-6 md:px-10 py-6 md:py-7 text-sm md:text-lg font-bold rounded-full border-2 border-white text-white bg-black/30 backdrop-blur-md hover:bg-white/10 hover:scale-105 transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
                      How It Works
                    </Button>
                  </Link>
                </div>
              </div>

              <div ref={statsRef} className="pointer-events-auto w-full will-change-transform px-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 max-w-5xl mx-auto">
                  {[
                    { value: '4', label: 'Expert Guides', icon: BookOpen },
                    { value: '2.5K+', label: 'Safety Kits', icon: Shield },
                    { value: '€0', label: 'Fines', icon: AlertCircle },
                    { value: 'Mar 26', label: 'Launch', icon: Calendar },
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

        <div className={`fixed inset-0 z-[100] flex items-center justify-center bg-zinc-900 transition-opacity duration-1000 ${imageLoaded ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          <div className="flex flex-col items-center gap-6">
            <div className="w-20 h-20 md:w-28 md:h-28 border-4 border-[#E8A838] border-t-transparent rounded-full animate-spin" />
            <p className="text-white/70 text-sm md:text-base tracking-wider">Loading experience...</p>
          </div>
        </div>
      </div>
    </section>
  );
}
