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
// ✅ REFINED CONFIG - TRUE 3 ACTS
// ============================================================================
const HERO_CONFIG = {
  scroll: {
    height: '400vh', // Increased to give each act more "air"
    scrub: 1.5,
  },
  camera: {
    focalPoint: '50% 38%',
    initialScale: 2.2,
    midScale: 1.8,     // For Act 1 subtle zoom
    finalScale: 1.0,
    panDown: -55,
  },
  // Normalized 0-3 duration for 3 clear acts
  acts: {
    DURATION: 1.0, 
  }
} as const;

export default function HeroSection() {
  const [imageLoaded, setImageLoaded] = useState(false);
  
  const containerRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const bgPlateRef = useRef<HTMLDivElement>(null);
  
  const taglineRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  // ============================================================================
  // ✅ SET INITIAL STATE - Everything visible from the start
  // ============================================================================
  useLayoutEffect(() => {
    if (!bgPlateRef.current) return;
    
    // Camera initial position
    gsap.set(bgPlateRef.current, {
      scale: HERO_CONFIG.camera.initialScale,
      transformOrigin: HERO_CONFIG.camera.focalPoint,
    });

    // ✅ CRITICAL: Text is VISIBLE from the start
    gsap.set([taglineRef.current, headlineRef.current, bodyRef.current], {
      opacity: 1,
      y: 0,
    });

    // CTAs and stats start hidden in state, will animate in via timeline
    gsap.set([ctaRef.current, statsRef.current], {
      opacity: 0,
    });
  }, []);

  // ============================================================================
  // ✅ SCROLL ANIMATION - 3 CLEAR ACTS
  // ============================================================================
  useGSAP(() => {
    if (!imageLoaded) return;

    gsap.registerPlugin(ScrollTrigger);

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: HERO_CONFIG.scroll.scrub,
        snap: {
          snapTo: [0, 0.33, 0.66, 1], // Snap to start of each act + end
          duration: { min: 0.2, max: 0.5 },
          delay: 0.1,
          ease: 'power2.inOut',
        },
        invalidateOnRefresh: true,
      },
    });

    const ACT = HERO_CONFIG.acts.DURATION;

    // ──────────────────────────────────────────────────────────────────────
    // ACT 1: THE REALITY CHECK (0 → 1)
    // ──────────────────────────────────────────────────────────────────────
    // Subtle initial movement to signal scroll is working
    tl.to(
      bgPlateRef.current,
      {
        scale: HERO_CONFIG.camera.midScale,
        ease: 'none',
      },
      0
    )
    .to(
      headlineRef.current,
      {
        y: -40,
        opacity: 0.9,
        ease: 'none',
      },
      0
    );

    // ──────────────────────────────────────────────────────────────────────
    // ACT 2: THE REVEAL (1 → 2)
    // ──────────────────────────────────────────────────────────────────────
    tl.to(
      bgPlateRef.current,
      {
        scale: HERO_CONFIG.camera.finalScale,
        ease: 'power1.inOut',
      },
      ACT
    )
    // Headline parallax & shrink
    .to(
      headlineRef.current,
      {
        scale: 0.5,
        y: -160,
        opacity: 0.8,
        ease: 'power1.inOut',
      },
      ACT
    )
    // Tagline and body fade out
    .to(
      [taglineRef.current, bodyRef.current],
      {
        opacity: 0,
        y: -120,
        ease: 'power1.in',
      },
      ACT
    )
    // CTAs fade in
    .fromTo(
      ctaRef.current,
      { opacity: 0, y: 100 },
      {
        opacity: 1,
        y: 0,
        ease: 'power1.out',
      },
      ACT + 0.2
    );

    // ──────────────────────────────────────────────────────────────────────
    // ACT 3: THE PROOF (2 → 3)
    // ──────────────────────────────────────────────────────────────────────
    tl.to(
      bgPlateRef.current,
      {
        yPercent: HERO_CONFIG.camera.panDown,
        ease: 'power1.inOut',
      },
      ACT * 2
    )
    // Exit headline and CTAs upward
    .to(
      [headlineRef.current, ctaRef.current],
      {
        y: -1200,
        opacity: 0,
        ease: 'power1.in',
      },
      ACT * 2
    )
    // Stats rise from bottom
    .fromTo(
      statsRef.current,
      { opacity: 0, y: 400 },
      {
        y: 0,
        opacity: 1,
        ease: 'power2.out',
      },
      ACT * 2 + 0.1
    );

    // ──────────────────────────────────────────────────────────────────────
    // MOUSE PARALLAX (Optional - subtle)
    // ──────────────────────────────────────────────────────────────────────
    const handleMouseMove = (e: MouseEvent) => {
      const xPercent = (e.clientX / window.innerWidth - 0.5) * 2;
      const yPercent = (e.clientY / window.innerHeight - 0.5) * 2;

      gsap.to(viewportRef.current, {
        rotationY: xPercent * 1.5,
        rotationX: -yPercent * 1.5,
        duration: 1.8,
        ease: 'power2.out',
      });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, { scope: containerRef, dependencies: [imageLoaded] });

  // ============================================================================
  // RENDER
  // ============================================================================
  return (
    <section
      ref={containerRef}
      className="relative w-full bg-black"
      style={{ height: HERO_CONFIG.scroll.height }}
    >
      <div
        ref={viewportRef}
        className="sticky top-0 left-0 w-full h-screen overflow-hidden bg-black"
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
            onLoad={() => setImageLoaded(true)}
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
              <p className="text-xl md:text-2xl lg:text-3xl text-white font-bold mt-6 tracking-[0.12em] uppercase drop-shadow-2xl">
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
          className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none px-4"
        >
          <div className="flex flex-col md:flex-row gap-6 pointer-events-auto translate-y-[18vh]">
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
          className="absolute bottom-10 md:bottom-16 left-0 right-0 z-50 px-4 md:px-8"
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
                  className="bg-black/75 backdrop-blur-xl border border-white/25 p-6 md:p-10 rounded-2xl md:rounded-3xl text-center shadow-[0_20px_80px_rgba(0,0,0,0.8)] hover:border-[#E8A838]/50 transition-all duration-300"
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
        <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-b from-black/70 via-transparent to-black/90" />
      </div>

      {/* Loading Screen */}
      <div
        className={`fixed inset-0 z-[100] flex items-center justify-center bg-black transition-opacity duration-1000 ${
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