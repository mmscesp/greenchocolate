'use client';

import { useState, useRef, useLayoutEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { BookOpen, Shield, AlertCircle, Calendar } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

// ============================================================================
// ✅ REFINED CONFIG - 4 STEP CINEMATIC FLOW
// ============================================================================
const HERO_CONFIG = {
  scroll: {
    height: '240vh',
  },
  camera: {
    focalPoint: '50% 50%',
    step0Scale: 1.12,
    step1Scale: 1.0,
    step2Scale: 1.02,
    step3Scale: 1.02,
    frame0ObjectY: '34%',
    frame1ObjectY: '38%',
    frame2ObjectY: '54%',
    frame3ObjectY: '62%',
  },
  acts: {
    DURATION: 1.0,
  },
} as const;

export default function HeroSection() {
  const [imageLoaded, setImageLoaded] = useState(false);
  
  const containerRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const bgPlateRef = useRef<HTMLDivElement>(null);
  const bgImageRef = useRef<HTMLImageElement>(null);
  
  const taglineRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const verificationRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  // ============================================================================
  // ✅ SET INITIAL STATE - Step 0
  // ============================================================================
  useLayoutEffect(() => {
    if (!bgPlateRef.current) return;
    
    // Camera initial position (Step 0)
    gsap.set(bgPlateRef.current, {
      scale: HERO_CONFIG.camera.step0Scale,
      transformOrigin: HERO_CONFIG.camera.focalPoint,
      yPercent: 0,
    });
    if (bgImageRef.current) {
      gsap.set(bgImageRef.current, {
        objectPosition: `50% ${HERO_CONFIG.camera.frame0ObjectY}`,
      });
    }

    // Text: Tagline & Headline Visible
    gsap.set([taglineRef.current, headlineRef.current], {
      opacity: 1,
      y: 0,
      scale: 1,
    });

    // Body: Hidden initially (Revealed in Step 1)
    gsap.set(bodyRef.current, {
      opacity: 0,
      y: 20,
    });
    gsap.set(verificationRef.current, {
      opacity: 0,
      y: 12,
    });

    // CTAs and stats start hidden
    gsap.set([ctaRef.current, statsRef.current], {
      opacity: 0,
      y: 50,
    });
  }, []);

  // ============================================================================
  // ✅ SCROLL ANIMATION - 4 STEPS (3 TRANSITIONS)
  // ============================================================================
  useGSAP(() => {
    if (!imageLoaded) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      gsap.set([taglineRef.current, headlineRef.current, bodyRef.current, verificationRef.current, ctaRef.current, statsRef.current], {
        clearProps: 'all',
        opacity: 1,
        y: 0,
        scale: 1,
      });
      gsap.set(bgPlateRef.current, {
        scale: HERO_CONFIG.camera.step1Scale,
        yPercent: 0,
      });
      if (bgImageRef.current) {
        gsap.set(bgImageRef.current, {
          objectPosition: `50% ${HERO_CONFIG.camera.frame1ObjectY}`,
        });
      }
      return;
    }

    gsap.registerPlugin(ScrollTrigger);
    const ACT = HERO_CONFIG.acts.DURATION;
    const labels = ['frame0', 'frame1', 'frame2', 'frame3'] as const;

    const tl = gsap.timeline({ paused: true });
    tl.addLabel('frame0', 0);
    tl.addLabel('frame1', ACT);
    tl.addLabel('frame2', ACT * 2);
    tl.addLabel('frame3', ACT * 3);

    let currentFrame = 0;
    let isTransitioning = false;
    let releasedToPage = false;

    const isHeroActive = () => {
      if (!containerRef.current) return false;
      const rect = containerRef.current.getBoundingClientRect();
      return rect.top <= 2 && rect.bottom > window.innerHeight * 0.5;
    };

    const goToFrame = (nextFrame: number) => {
      if (nextFrame < 0 || nextFrame > 3 || isTransitioning || nextFrame === currentFrame) {
        return;
      }

      isTransitioning = true;

      tl.tweenTo(labels[nextFrame], {
        duration: 0.5,
        ease: 'power2.inOut',
        overwrite: true,
        onComplete: () => {
          currentFrame = nextFrame;
          isTransitioning = false;
        },
      });
    };

    const handleWheel = (event: WheelEvent) => {
      if (!isHeroActive() || releasedToPage) {
        return;
      }

      event.preventDefault();
      if (isTransitioning) {
        return;
      }

      if (event.deltaY > 8) {
        if (currentFrame < 3) {
          goToFrame(currentFrame + 1);
          return;
        }

        releasedToPage = true;
        window.scrollBy({ top: window.innerHeight, behavior: 'smooth' });
        return;
      }

      if (event.deltaY < -8 && currentFrame > 0) {
        goToFrame(currentFrame - 1);
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
    });

    if (!bgImageRef.current) {
      return;
    }

    tl.to(bgPlateRef.current, {
      scale: HERO_CONFIG.camera.step1Scale,
      ease: 'power1.inOut',
      duration: ACT,
    }, 0)
    .to(bgImageRef.current, {
      objectPosition: `50% ${HERO_CONFIG.camera.frame1ObjectY}`,
      ease: 'power1.inOut',
      duration: ACT,
    }, 0)
    .to([headlineRef.current, taglineRef.current], {
      scale: 0.74,
      y: -4,
      transformOrigin: 'center center',
      ease: 'power1.inOut',
      duration: ACT,
    }, 0)
    .to(bodyRef.current, {
      opacity: 1,
      y: 0,
      ease: 'power2.out',
      duration: ACT * 0.8,
    }, 0.2);

    tl.to(verificationRef.current, {
      opacity: 1,
      y: 0,
      ease: 'power2.out',
      duration: ACT * 0.45,
    }, 0.34);

    tl.to(bgPlateRef.current, {
      scale: HERO_CONFIG.camera.step2Scale,
      ease: 'power1.inOut',
      duration: ACT,
    }, ACT)
    .to(bgImageRef.current, {
      objectPosition: `50% ${HERO_CONFIG.camera.frame2ObjectY}`,
      ease: 'power1.inOut',
      duration: ACT,
    }, ACT)
    .to([headlineRef.current, taglineRef.current], {
      scale: 0.56,
      y: -18,
      opacity: 0.56,
      ease: 'power1.inOut',
      duration: ACT,
    }, ACT)
    .to(bodyRef.current, {
      scale: 0.94,
      y: -8,
      opacity: 0.92,
      ease: 'power1.inOut',
      duration: ACT,
    }, ACT)
    .to(verificationRef.current, {
      opacity: 0.88,
      y: -6,
      ease: 'power1.inOut',
      duration: ACT * 0.55,
    }, ACT)
    .to(ctaRef.current, {
      opacity: 1,
      y: 0,
      ease: 'power2.out',
      duration: ACT * 0.8,
    }, ACT + 0.2);

    tl.to(bgPlateRef.current, {
      scale: HERO_CONFIG.camera.step3Scale,
      ease: 'none',
      duration: ACT,
    }, ACT * 2)
    .to(bgImageRef.current, {
      objectPosition: `50% ${HERO_CONFIG.camera.frame3ObjectY}`,
      ease: 'none',
      duration: ACT,
    }, ACT * 2)
    .to([headlineRef.current, taglineRef.current], {
      opacity: 0.15,
      ease: 'power1.inOut',
      duration: ACT,
    }, ACT * 2)
    .to(bodyRef.current, {
      opacity: 0.5,
      ease: 'power1.inOut',
      duration: ACT,
    }, ACT * 2)
    .to(ctaRef.current, {
      opacity: 0.85,
      ease: 'power1.inOut',
      duration: ACT * 0.45,
    }, ACT * 2)
    .to(statsRef.current, {
      opacity: 1,
      y: 0,
      ease: 'power2.out',
      duration: ACT * 0.8,
    }, ACT * 2 + 0.2);

    // ──────────────────────────────────────────────────────────────────────
    // MOUSE PARALLAX (Subtle)
    // ──────────────────────────────────────────────────────────────────────
    const handleMouseMove = (e: MouseEvent) => {
      const xPercent = (e.clientX / window.innerWidth - 0.5) * 2;
      const yPercent = (e.clientY / window.innerHeight - 0.5) * 2;

      gsap.to(viewportRef.current, {
        rotationY: xPercent * 1.0,
        rotationX: -yPercent * 1.0,
        duration: 1.8,
        ease: 'power2.out',
      });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('wheel', handleWheel);
      activationTrigger.kill();
      tl.kill();
    };
  }, { scope: containerRef, dependencies: [imageLoaded] });

  // ============================================================================
  // RENDER
  // ============================================================================
  return (
    <section
      ref={containerRef}
      className="relative w-full"
      style={{ height: HERO_CONFIG.scroll.height }}
    >
      <div
        ref={viewportRef}
        className="sticky top-0 left-0 w-full h-screen overflow-hidden"
        style={{ perspective: '2000px' }}
      >
        {/* ──────────────────────────────────────────────────────────────── */}
        {/* BACKGROUND IMAGE */}
        {/* ──────────────────────────────────────────────────────────────── */}
        <div
          ref={bgPlateRef}
          className="absolute inset-0 w-full h-full will-change-transform"
        >
          <Image
            src="/images/hero/barcelona-skyline.webp"
            alt="Barcelona Skyline"
            fill
            priority
            quality={95}
            className="object-cover"
            onLoad={(e) => {
              bgImageRef.current = e.currentTarget;
              setImageLoaded(true);
            }}
          />
        </div>

        {/* ──────────────────────────────────────────────────────────────── */}
        {/* TEXT CONTENT - ✅ VISIBLE FROM START */}
        {/* ──────────────────────────────────────────────────────────────── */}
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none px-6">
          <div className="max-w-6xl mx-auto w-full text-center">
            {/* Tagline */}
            <div ref={taglineRef} className="mb-10">
              <p className="text-xl md:text-2xl lg:text-3xl text-white tracking-[0.25em] uppercase font-light drop-shadow-2xl">
                Different city. Different rules.
              </p>
              <p className="text-xl md:text-2xl lg:text-3xl text-[#D9534F] tracking-[0.25em] uppercase font-black mt-3 drop-shadow-2xl">
                Different consequences.
              </p>
            </div>

            {/* Headline */}
            <div ref={headlineRef}>
              <div className="flex items-center justify-center gap-4 md:gap-8 lg:gap-12 flex-wrap">
                <h1 className="text-5xl md:text-7xl lg:text-8xl xl:text-[9rem] font-black text-white tracking-tighter uppercase leading-none drop-shadow-[0_25px_60px_rgba(0,0,0,0.9)]">
                  BARCELONA
                </h1>
                <span
                  aria-hidden="true"
                  className="text-6xl md:text-8xl lg:text-[10rem] text-[#E8A838] font-black leading-none"
                  style={{
                    filter: 'drop-shadow(0 0 50px rgba(232, 168, 56, 0.8))',
                  }}
                >
                  ≠
                </span>
                <h1 className="text-5xl md:text-7xl lg:text-8xl xl:text-[9rem] font-black text-white tracking-tighter uppercase leading-none drop-shadow-[0_25px_60px_rgba(0,0,0,0.9)]">
                  AMSTERDAM
                </h1>
              </div>
            </div>

            {/* Body */}
            <div ref={bodyRef} className="mt-14 max-w-3xl mx-auto">
              <p className="text-lg md:text-xl lg:text-2xl text-gray-200 leading-relaxed font-light drop-shadow-lg">
                Spanish CSCs aren&apos;t coffeeshops. No walk-ins. No menus. No
                second chances.
              </p>
              <p ref={verificationRef} className="text-xl md:text-2xl lg:text-3xl text-white font-bold mt-6 tracking-[0.12em] uppercase drop-shadow-2xl">
                We&apos;re your verification layer.
              </p>
            </div>
          </div>
        </div>

        {/* ──────────────────────────────────────────────────────────────── */}
        {/* CTA BUTTONS */}
        {/* ──────────────────────────────────────────────────────────────── */}
        <div
          ref={ctaRef}
          className="absolute inset-0 z-40 flex items-end justify-center pointer-events-none px-4 pb-20 md:pb-28"
        >
          <div className="flex flex-col md:flex-row gap-6 pointer-events-auto">
            <Link href="/safety-guide">
              <Button
                size="lg"
                className="px-8 md:px-12 py-6 md:py-9 text-lg md:text-xl font-bold rounded-full bg-[#E8A838] text-black hover:bg-[#d4962e] hover:scale-105 transition-all duration-300 shadow-2xl"
              >
                Get the Free Safety Guide →
              </Button>
            </Link>
            <Link href="/how-it-works">
              <Button
                size="lg"
                variant="outline"
                className="px-8 md:px-12 py-6 md:py-9 text-lg md:text-xl font-bold rounded-full border-2 border-white text-white bg-black/20 backdrop-blur-md hover:bg-white/10 hover:scale-105 transition-all duration-300"
              >
                How It Works
              </Button>
            </Link>
          </div>
        </div>

        {/* ──────────────────────────────────────────────────────────────── */}
        {/* STATS CARDS */}
        {/* ──────────────────────────────────────────────────────────────── */}
        <div
          ref={statsRef}
          className="absolute bottom-8 md:bottom-12 left-0 right-0 z-50 px-4 md:px-8"
        >
          <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
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
                  className="bg-black/45 backdrop-blur-xl border border-white/30 p-6 md:p-10 rounded-2xl md:rounded-3xl text-center shadow-[0_20px_80px_rgba(0,0,0,0.5)] hover:border-[#E8A838]/50 transition-all duration-300"
                >
                  <div className="flex justify-center mb-4">
                    <Icon className="w-7 h-7 md:w-9 md:h-9 text-[#E8A838]" />
                  </div>
                  <div className="text-4xl md:text-6xl font-black text-white mb-2">
                    {stat.value}
                  </div>
                  <div className="text-xs md:text-sm font-bold text-[#E8A838] uppercase tracking-[0.18em] md:tracking-[0.22em]">
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Vignette */}
        <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-b from-black/50 via-transparent to-black/50" />
      </div>

      {/* Loading Screen */}
      <div
        className={`fixed inset-0 z-[100] flex items-center justify-center bg-zinc-900 transition-opacity duration-1000 ${
          imageLoaded ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        <div className="flex flex-col items-center gap-6">
          <div className="w-20 h-20 md:w-28 md:h-28 border-4 border-[#E8A838] border-t-transparent rounded-full animate-spin" />
          <p className="text-white/70 text-sm md:text-base tracking-wider">
            Loading experience...
          </p>
        </div>
      </div>
    </section>
  );
}
