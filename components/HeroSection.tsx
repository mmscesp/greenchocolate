'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { BookOpen, Shield, AlertCircle, Calendar } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

const HERO_CONFIG = {
  scrollHeight: '320vh',
  image: {
    width: 3937,
    height: 5906,
  },
  focal: {
    initialZoom: 1.2,
    initialTravel: 0.16,
    act2Travel: 0.24,
    act3Travel: 0.28,
    act3Scale: 0.975,
  },
} as const;

export default function HeroSection() {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const containerRef = useRef<HTMLElement>(null);
  const imageBaseRef = useRef<HTMLDivElement>(null);
  const imageEdgeRef = useRef<HTMLDivElement>(null);
  const imageTrackRef = useRef<HTMLDivElement>(null);

  const headlineWrapRef = useRef<HTMLDivElement>(null);
  const narrativeRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updatePreference = () => setPrefersReducedMotion(mediaQuery.matches);

    updatePreference();
    mediaQuery.addEventListener('change', updatePreference);

    return () => {
      mediaQuery.removeEventListener('change', updatePreference);
    };
  }, []);

  useGSAP(() => {
    if (!imageLoaded || !containerRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    if (prefersReducedMotion) {
      gsap.set(imageBaseRef.current, { clearProps: 'all', scale: 1.08, y: 0 });
      gsap.set(imageEdgeRef.current, { clearProps: 'all', scale: 1.15, y: 0, opacity: 0.56 });
      gsap.set(imageTrackRef.current, { clearProps: 'all', scale: 1, y: 0 });
      gsap.set(narrativeRef.current, { clearProps: 'all', y: 0, opacity: 1 });
      gsap.set(headlineWrapRef.current, { clearProps: 'all', scale: 0.72, y: 0, opacity: 1 });
      gsap.set(bodyRef.current, { clearProps: 'all', opacity: 1, y: 0 });
      gsap.set(ctaRef.current, { clearProps: 'all', opacity: 1, y: 0 });
      gsap.set(statsRef.current, { clearProps: 'all', opacity: 1, y: 0 });
      return;
    }

    const aspectRatio = HERO_CONFIG.image.height / HERO_CONFIG.image.width;
    const getViewportHeight = () => window.visualViewport?.height || window.innerHeight;
    const getBaseImageHeight = () => window.innerWidth * aspectRatio;
    const getTravel = (scale = 1) => Math.max(0, getBaseImageHeight() * scale - getViewportHeight());

    const getInitialY = () => -getTravel(HERO_CONFIG.focal.initialZoom) * HERO_CONFIG.focal.initialTravel;
    const getAct2Y = () => -getTravel(1) * HERO_CONFIG.focal.act2Travel;
    const getAct3Y = () => -getTravel(1) * HERO_CONFIG.focal.act3Travel;
    const getBottomY = () => -getTravel(1);

    gsap.set(imageTrackRef.current, {
      scale: HERO_CONFIG.focal.initialZoom,
      y: getInitialY,
      transformOrigin: '50% 62%',
    });
    gsap.set(imageBaseRef.current, {
      scale: 1.08,
      y: () => getInitialY() * 0.7,
      transformOrigin: '50% 62%',
    });
    gsap.set(imageEdgeRef.current, {
      scale: 1.15,
      y: () => getInitialY() * 0.55,
      opacity: 0.56,
      transformOrigin: '50% 62%',
    });

    gsap.set(headlineWrapRef.current, {
      opacity: 1,
      y: 0,
      scale: 1,
      transformOrigin: '50% 0%',
    });
    gsap.set(narrativeRef.current, { y: 0, opacity: 1 });

    gsap.set(bodyRef.current, { opacity: 0, y: 24 });
    gsap.set(ctaRef.current, { opacity: 0, y: 36 });
    gsap.set(statsRef.current, { opacity: 0, y: 46 });

    const ACT = 1;
    const labels = ['act0', 'act1', 'act2', 'act3'] as const;

    const timeline = gsap.timeline({ paused: true });
    timeline.addLabel('act0', 0);
    timeline.addLabel('act1', ACT);
    timeline.addLabel('act2', ACT * 2);
    timeline.addLabel('act3', ACT * 3);

    timeline
      .to(
        imageTrackRef.current,
        {
          scale: 1,
          y: getAct2Y,
          ease: 'power2.inOut',
          duration: ACT,
        },
        0
      )
      .to(
        imageBaseRef.current,
        {
          y: () => getAct2Y() * 0.7,
          duration: ACT,
          ease: 'power2.inOut',
        },
        0
      )
      .to(
        imageEdgeRef.current,
        {
          y: () => getAct2Y() * 0.55,
          opacity: 0.52,
          duration: ACT,
          ease: 'power2.inOut',
        },
        0
      )
      .to(
        headlineWrapRef.current,
        {
          scale: 0.72,
          y: 0,
          ease: 'power2.inOut',
          duration: ACT,
        },
        0
      )
      .to(
        bodyRef.current,
        {
          opacity: 1,
          y: 0,
          ease: 'power2.out',
          duration: ACT * 0.72,
        },
        ACT * 0.24
      )
      .to(
        narrativeRef.current,
        {
          y: -130,
          ease: 'power1.inOut',
          duration: ACT * 0.9,
        },
        ACT
      )
      .to(
        imageTrackRef.current,
        {
          scale: HERO_CONFIG.focal.act3Scale,
          y: getAct3Y,
          duration: ACT,
          ease: 'power1.inOut',
        },
        ACT
      )
      .to(
        imageBaseRef.current,
        {
          y: () => getAct3Y() * 0.7,
          duration: ACT,
          ease: 'power1.inOut',
        },
        ACT
      )
      .to(
        imageEdgeRef.current,
        {
          y: () => getAct3Y() * 0.5,
          opacity: 0.5,
          duration: ACT,
          ease: 'power1.inOut',
        },
        ACT
      )
      .to(
        headlineWrapRef.current,
        {
          opacity: 0.93,
          ease: 'power1.inOut',
          duration: ACT * 0.9,
        },
        ACT
      )
      .to(
        bodyRef.current,
        {
          y: 0,
          opacity: 0.9,
          ease: 'power1.inOut',
          duration: ACT * 0.9,
        },
        ACT
      )
      .to(
        ctaRef.current,
        {
          opacity: 1,
          y: 0,
          ease: 'power2.out',
          duration: ACT * 0.72,
        },
        ACT * 1.2
      )
      .to(
        imageTrackRef.current,
        {
          scale: HERO_CONFIG.focal.act3Scale,
          y: getBottomY,
          duration: ACT,
          ease: 'power1.inOut',
        },
        ACT * 2
      )
      .to(
        imageBaseRef.current,
        {
          y: () => getBottomY() * 0.7,
          duration: ACT,
          ease: 'power1.inOut',
        },
        ACT * 2
      )
      .to(
        imageEdgeRef.current,
        {
          y: () => getBottomY() * 0.45,
          opacity: 0.48,
          duration: ACT,
          ease: 'power1.inOut',
        },
        ACT * 2
      )
      .to(
        statsRef.current,
        {
          opacity: 1,
          y: 0,
          ease: 'power2.out',
          duration: ACT * 0.75,
        },
        ACT * 2.2
      );

    let currentAct = 0;
    let isTransitioning = false;
    let releasedToPage = false;

    const isHeroActive = () => {
      if (!containerRef.current) return false;
      const rect = containerRef.current.getBoundingClientRect();
      return rect.top <= 2 && rect.bottom > getViewportHeight() * 0.45;
    };

    const goToAct = (nextAct: number) => {
      if (nextAct < 0 || nextAct > 3 || nextAct === currentAct || isTransitioning) {
        return;
      }

      isTransitioning = true;
      timeline.tweenTo(labels[nextAct], {
        duration: 0.42,
        ease: 'power2.inOut',
        overwrite: true,
        onComplete: () => {
          currentAct = nextAct;
          isTransitioning = false;
        },
      });
    };

    const wheelThreshold = 8;
    const handleWheel = (event: WheelEvent) => {
      if (!isHeroActive() || releasedToPage) {
        return;
      }

      if (Math.abs(event.deltaY) < wheelThreshold) {
        return;
      }

      event.preventDefault();

      if (isTransitioning) {
        return;
      }

      if (event.deltaY > 0) {
        if (currentAct < 3) {
          goToAct(currentAct + 1);
          return;
        }

        releasedToPage = true;
        const containerEl = containerRef.current;
        if (!containerEl) return;
        const rect = containerEl.getBoundingClientRect();
        const exitTarget = window.scrollY + rect.bottom - getViewportHeight() + 12;
        window.scrollTo({ top: exitTarget, behavior: 'auto' });
        return;
      }

      if (currentAct > 0) {
        goToAct(currentAct - 1);
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });

    const activationTrigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top top',
      end: 'bottom bottom',
      onEnter: () => {
        releasedToPage = false;
      },
      onEnterBack: () => {
        releasedToPage = false;
      },
      onLeave: () => {
        releasedToPage = true;
      },
    });

    const refreshHandler = () => {
      timeline.seek(labels[currentAct], false);
    };

    ScrollTrigger.addEventListener('refresh', refreshHandler);

    return () => {
      window.removeEventListener('wheel', handleWheel);
      activationTrigger.kill();
      ScrollTrigger.removeEventListener('refresh', refreshHandler);
      timeline.kill();
    };
  }, { scope: containerRef, dependencies: [imageLoaded, prefersReducedMotion] });

  const sectionStyle = prefersReducedMotion
    ? undefined
    : ({ height: HERO_CONFIG.scrollHeight } as const);

  const stageClasses = prefersReducedMotion
    ? 'relative min-h-[100dvh] w-full overflow-hidden bg-black'
    : 'sticky top-0 left-0 h-[100dvh] w-full overflow-hidden bg-black';

  return (
    <section ref={containerRef} className="relative w-full" style={sectionStyle}>
      <div className={stageClasses}>
        <div className="absolute inset-0">
          <div ref={imageBaseRef} className="absolute inset-[-10%] will-change-transform">
            <Image
              src="/images/hero/barcelona-skyline.webp"
              alt=""
              width={HERO_CONFIG.image.width}
              height={HERO_CONFIG.image.height}
              priority
              quality={82}
              aria-hidden="true"
              className="h-full w-full object-cover brightness-[1.03] saturate-[1.04] select-none"
            />
          </div>
          <div
            ref={imageEdgeRef}
            className="absolute inset-[-14%] will-change-transform"
            style={{
              WebkitMaskImage:
                'radial-gradient(ellipse 125% 120% at 50% 45%, rgba(0, 0, 0, 0) 58%, rgba(0, 0, 0, 1) 100%)',
              maskImage:
                'radial-gradient(ellipse 125% 120% at 50% 45%, rgba(0, 0, 0, 0) 58%, rgba(0, 0, 0, 1) 100%)',
            }}
          >
            <Image
              src="/images/hero/barcelona-skyline.webp"
              alt=""
              width={HERO_CONFIG.image.width}
              height={HERO_CONFIG.image.height}
              priority
              quality={72}
              aria-hidden="true"
              className="h-full w-full object-cover blur-3xl brightness-[1.08] saturate-[1.08] select-none"
            />
          </div>
          <div ref={imageTrackRef} className="absolute inset-x-0 top-0 will-change-transform">
            <Image
              src="/images/hero/barcelona-skyline.webp"
              alt="Barcelona Skyline"
              width={HERO_CONFIG.image.width}
              height={HERO_CONFIG.image.height}
              priority
              quality={88}
              className="h-auto w-full select-none"
              onLoad={() => setImageLoaded(true)}
            />
          </div>
        </div>

        <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-b from-black/30 via-black/8 to-black/35" />

        <div className="absolute inset-0 z-20 px-6">
          <div className="relative mx-auto h-full w-full max-w-6xl">
            <div className="absolute inset-0 flex items-center justify-center text-center">
              <div ref={narrativeRef} className="w-full max-w-5xl will-change-transform">
                <div ref={headlineWrapRef} className="will-change-transform">
                <p className="text-base sm:text-lg md:text-2xl lg:text-3xl text-white tracking-[0.25em] uppercase font-light drop-shadow-2xl">
                  Different city. Different rules.
                </p>
                <p className="mt-3 text-base sm:text-lg md:text-2xl lg:text-3xl text-[#D9534F] tracking-[0.25em] uppercase font-black drop-shadow-2xl">
                  Different consequences.
                </p>

                <div className="mt-8 flex items-center justify-center gap-2 md:gap-5 lg:gap-7 whitespace-nowrap">
                  <h1 className="text-[clamp(1.8rem,5.5vw,8.5rem)] font-black text-white tracking-tighter uppercase leading-none drop-shadow-[0_25px_60px_rgba(0,0,0,0.9)]">
                    BARCELONA
                  </h1>
                  <span
                    aria-hidden="true"
                    className="text-[clamp(2.1rem,6vw,9rem)] text-[#E8A838] font-black leading-none"
                    style={{ filter: 'drop-shadow(0 0 40px rgba(232, 168, 56, 0.75))' }}
                  >
                    ×
                  </span>
                  <h1 className="text-[clamp(1.8rem,5.5vw,8.5rem)] font-black text-white tracking-tighter uppercase leading-none drop-shadow-[0_25px_60px_rgba(0,0,0,0.9)]">
                    AMSTERDAM
                  </h1>
                </div>
                </div>

                <div ref={bodyRef} className="mx-auto mt-6 max-w-3xl">
                  <p className="text-base md:text-xl lg:text-2xl text-gray-100 leading-relaxed font-light drop-shadow-lg">
                    Spanish CSCs aren&apos;t coffeeshops. No walk-ins. No menus. No second chances.
                  </p>
                  <p className="mt-4 text-lg md:text-2xl lg:text-3xl text-white font-bold uppercase tracking-[0.12em] drop-shadow-2xl">
                    We&apos;re your verification layer.
                  </p>
                </div>
              </div>
            </div>

            <div className="absolute inset-x-0 bottom-8 md:bottom-12 pointer-events-none">
              <div ref={ctaRef} className="pointer-events-auto">
                <div className="flex flex-col md:flex-row justify-center gap-4 md:gap-6">
                  <Link href="/safety-guide">
                    <Button
                      size="lg"
                      className="px-8 md:px-12 py-6 md:py-8 text-base md:text-xl font-bold rounded-full bg-[#E8A838] text-black hover:bg-[#d4962e] hover:scale-105 transition-all duration-300 shadow-2xl"
                    >
                      Get the Free Safety Guide →
                    </Button>
                  </Link>
                  <Link href="/how-it-works">
                    <Button
                      size="lg"
                      variant="outline"
                      className="px-8 md:px-12 py-6 md:py-8 text-base md:text-xl font-bold rounded-full border-2 border-white text-white bg-black/20 backdrop-blur-md hover:bg-white/10 hover:scale-105 transition-all duration-300"
                    >
                      How It Works
                    </Button>
                  </Link>
                </div>
              </div>

              <div ref={statsRef} className="mt-6 md:mt-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
                  {[
                    { value: '4', label: 'Expert Guides', icon: BookOpen },
                    { value: '2.5K+', label: 'Safety Kits', icon: Shield },
                    { value: '€0', label: 'Fines', icon: AlertCircle },
                    { value: 'Mar 26', label: 'Launch', icon: Calendar },
                  ].map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                      <div
                        key={i}
                        className="bg-black/45 backdrop-blur-xl border border-white/30 p-4 md:p-7 rounded-2xl text-center shadow-[0_20px_80px_rgba(0,0,0,0.5)]"
                      >
                        <div className="mb-3 flex justify-center">
                          <Icon className="h-5 w-5 md:h-8 md:w-8 text-[#E8A838]" />
                        </div>
                        <div className="text-2xl md:text-5xl font-black text-white mb-1">{stat.value}</div>
                        <div className="text-[10px] md:text-xs font-bold text-[#E8A838] uppercase tracking-[0.18em]">
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

        <div
          className={`fixed inset-0 z-[100] flex items-center justify-center bg-zinc-900 transition-opacity duration-1000 ${
            imageLoaded ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
        >
          <div className="flex flex-col items-center gap-6">
            <div className="w-20 h-20 md:w-28 md:h-28 border-4 border-[#E8A838] border-t-transparent rounded-full animate-spin" />
            <p className="text-white/70 text-sm md:text-base tracking-wider">Loading experience...</p>
          </div>
        </div>
      </div>
    </section>
  );
}
