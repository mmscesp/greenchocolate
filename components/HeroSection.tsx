'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useLanguage } from '@/hooks/useLanguage';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/* ------------------------------------------------------------------ */
/*  CONFIG                                                             */
/* ------------------------------------------------------------------ */
const HERO_CONFIG = {
  scrollHeight: '200vh',
  focal: {
    initialZoom: 1.2,
    finalScale: 1.0,
  },
  /* Act 2 resting positions — single source of truth for both
     the scroll timeline end-state AND the reduced-motion static layout */
  act2: {
    headline: { scale: 0.92, y: '-8vh' },
    body: { y: '18vh' },
    cta: { y: '34vh' },
    vignette: { opacity: 0.85 },
    blur: { opacity: 0.22 },
  },
} as const;

/* ------------------------------------------------------------------ */
/*  COMPONENT                                                          */
/* ------------------------------------------------------------------ */
export default function HeroSection() {
  const { t, language } = useLanguage();

  const [imageLoaded, setImageLoaded] = useState(false);
  const [overlayHidden, setOverlayHidden] = useState(false);
  const [overlayDismissed, setOverlayDismissed] = useState(false);
  const [animationReady, setAnimationReady] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const rootRef = useRef<HTMLElement>(null);
  const rafRefs = useRef<{ f1?: number; f2?: number }>({});

  // Guard: both desktop & mobile <Image> fire onLoad independently
  const loadFiredRef = useRef(false);

  /* ---- Desktop refs ---- */
  const desktopContainerRef = useRef<HTMLDivElement>(null);
  const droneWrapRef = useRef<HTMLDivElement>(null);
  const imageSharpRef = useRef<HTMLDivElement>(null);
  const imageBlurRef = useRef<HTMLDivElement>(null);
  const headlineWrapRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const vignetteRef = useRef<HTMLDivElement>(null);

  /* ---- Mobile refs ---- */
  const mobileContainerRef = useRef<HTMLDivElement>(null);
  const mobileBgRef = useRef<HTMLDivElement>(null);
  const mobileContentRef = useRef<HTMLDivElement>(null);

  /* ---------------------------------------------------------------- */
  /*  Reduced-motion preference                                        */
  /* ---------------------------------------------------------------- */
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setPrefersReducedMotion(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  /* ---------------------------------------------------------------- */
  /*  Two-frame readiness gate                                         */
  /* ---------------------------------------------------------------- */
  useEffect(() => {
    if (!imageLoaded) return;
    rafRefs.current.f1 = requestAnimationFrame(() => {
      rafRefs.current.f2 = requestAnimationFrame(() => {
        setAnimationReady(true);
      });
    });
    return () => {
      if (rafRefs.current.f1) cancelAnimationFrame(rafRefs.current.f1);
      if (rafRefs.current.f2) cancelAnimationFrame(rafRefs.current.f2);
    };
  }, [imageLoaded]);

  /* ---------------------------------------------------------------- */
  /*  Image load / error — guarded against double-fire                 */
  /* ---------------------------------------------------------------- */
  const handleImageLoad = useCallback(() => {
    if (loadFiredRef.current) return;
    loadFiredRef.current = true;

    setImageLoaded(true);
    requestAnimationFrame(() => {
      setOverlayHidden(true);
      setTimeout(() => setOverlayDismissed(true), 1100);
    });
  }, []);

  const handleImageError = useCallback(() => {
    if (loadFiredRef.current) return;
    loadFiredRef.current = true;

    setImageLoaded(true);
    setOverlayHidden(true);
    setTimeout(() => setOverlayDismissed(true), 100);
  }, []);

  /* ---------------------------------------------------------------- */
  /*  GSAP — master animation controller                               */
  /* ---------------------------------------------------------------- */
  useGSAP(
    () => {
      if (!imageLoaded || !animationReady) return;

      const mm = gsap.matchMedia();
      const { act2 } = HERO_CONFIG;

      /* ============================================================ */
      /*  DESKTOP — Drone pull-back                                    */
      /* ============================================================ */
      mm.add('(min-width: 768px)', () => {
        if (!desktopContainerRef.current) return;

        /* ---------------------------------------------------------- */
        /*  REDUCED MOTION: Jump straight to Act 2 resting state       */
        /*  Must pre-spread elements vertically — they're all          */
        /*  absolutely positioned at top-1/2 left-1/2, so without      */
        /*  offsets they'd stack on top of each other.                  */
        /* ---------------------------------------------------------- */
        if (prefersReducedMotion) {
          gsap.set(headlineWrapRef.current, {
            opacity: 1,
            y: act2.headline.y,
            scale: act2.headline.scale,
          });
          gsap.set(bodyRef.current, { opacity: 1, y: act2.body.y });
          gsap.set(ctaRef.current, { opacity: 1, y: act2.cta.y });
          gsap.set(vignetteRef.current, { opacity: act2.vignette.opacity });
          gsap.set(imageSharpRef.current, { clearProps: 'transform' });
          gsap.set(imageBlurRef.current, {
            opacity: 0,
            clearProps: 'transform',
          });
          return;
        }

        /* ---- 1. Initial image state ---- */
        const imageTargets = [imageSharpRef.current, imageBlurRef.current];
        gsap.set(imageTargets, {
          scale: HERO_CONFIG.focal.initialZoom,
          transformOrigin: 'center 40%',
        });
        gsap.set(imageBlurRef.current, { opacity: 0 });
        gsap.set(vignetteRef.current, { opacity: 0 });

        /* ---- 2. Continuous drone hover (independent of scroll) ---- */
        gsap.to(droneWrapRef.current, {
          y: '1.2vh',
          rotation: 0.15,
          duration: 5.5,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
        });

        /* ---- 3. Initial UI state (Act 1) ---- */
        gsap.set(headlineWrapRef.current, { opacity: 1, y: 0, scale: 1 });
        gsap.set(bodyRef.current, { opacity: 0, y: '16vh' });
        gsap.set(ctaRef.current, { opacity: 0, y: '26vh' });

        /* ---- 4. Scroll timeline (Act 1 → Act 2) ---- */
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: desktopContainerRef.current,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.8,
            snap: {
              snapTo: 'labels',
              duration: { min: 0.2, max: 0.5 },
              delay: 0.1,
              ease: 'power2.inOut',
            },
          },
        });

        tl.addLabel('act1', 0);

        // Image pulls back to reveal full skyline
        tl.to(
          imageTargets,
          {
            scale: HERO_CONFIG.focal.finalScale,
            ease: 'power1.inOut',
            duration: 1,
          },
          0
        );

        // Peripheral blur softens into view at edges
        tl.to(
          imageBlurRef.current,
          {
            opacity: act2.blur.opacity,
            ease: 'power1.inOut',
            duration: 1,
          },
          0
        );

        // Cinematic vignette fades in
        tl.to(
          vignetteRef.current,
          {
            opacity: act2.vignette.opacity,
            ease: 'power2.inOut',
            duration: 1,
          },
          0
        );

        // Headline shrinks and rises to top third
        tl.to(
          headlineWrapRef.current,
          {
            scale: act2.headline.scale,
            y: act2.headline.y,
            ease: 'power2.inOut',
            duration: 1,
          },
          0
        );

        // Body rises into center pocket
        tl.to(
          bodyRef.current,
          {
            opacity: 1,
            y: act2.body.y,
            ease: 'power2.out',
            duration: 0.8,
          },
          0.2
        );

        // CTAs rise into lower third
        tl.to(
          ctaRef.current,
          {
            opacity: 1,
            y: act2.cta.y,
            ease: 'power2.out',
            duration: 0.8,
          },
          0.25
        );

        tl.addLabel('act2', 1);
      });

      /* ============================================================ */
      /*  MOBILE — Depth + native scroll                               */
      /* ============================================================ */
      mm.add('(max-width: 767px)', () => {
        if (!mobileContainerRef.current || !mobileContentRef.current) return;

        if (prefersReducedMotion) {
          gsap.set(mobileContentRef.current.children, { opacity: 1, y: 0 });
          return;
        }

        gsap.set(mobileBgRef.current, {
          scale: 1.06,
          transformOrigin: 'center 35%',
        });
        gsap.to(mobileBgRef.current, {
          scale: 1.12,
          duration: 25,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
          transformOrigin: 'center 35%',
        });

        gsap.from(mobileContentRef.current.children, {
          y: 30,
          opacity: 0,
          duration: 1,
          stagger: 0.12,
          ease: 'power3.out',
          delay: 0.15,
          clearProps: 'all',
        });
      });

      return () => mm.revert();
    },
    {
      scope: rootRef,
      dependencies: [imageLoaded, animationReady, prefersReducedMotion],
    }
  );

  /* ---------------------------------------------------------------- */
  /*  Derived values                                                   */
  /* ---------------------------------------------------------------- */
  const sectionStyle = prefersReducedMotion
    ? undefined
    : { height: HERO_CONFIG.scrollHeight };

  const stageClasses = prefersReducedMotion
    ? 'relative min-h-[100dvh] w-full overflow-hidden bg-black'
    : 'sticky top-0 left-0 h-[100dvh] w-full overflow-hidden bg-black';

  /* ---------------------------------------------------------------- */
  /*  RENDER                                                           */
  /* ---------------------------------------------------------------- */
  return (
    <section
      ref={rootRef}
      className="relative w-full bg-black"
      style={{ contain: 'layout style' }}
    >
      {/* =========================================================== */}
      {/*  DESKTOP                                                      */}
      {/* =========================================================== */}
      <div
        className="hidden md:block w-full"
        ref={desktopContainerRef}
        style={sectionStyle}
      >
        <div className={stageClasses}>
          {/* ---- IMAGE STAGE ---- */}
          <div className="absolute inset-0 bg-black">
            <div
              ref={droneWrapRef}
              className="absolute inset-0 scale-[1.06] origin-center will-change-transform"
            >
              {/* Layer 1 — Sharp image (bottom) */}
              <div
                ref={imageSharpRef}
                className="absolute inset-0 will-change-transform"
              >
                <Image
                  src="/images/hero/barcelona-skyline.webp"
                  alt={t('hero.section.image_alt')}
                  fill
                  sizes="(min-width: 768px) 130vw, 100vw"
                  quality={90}
                  priority
                  className="object-cover object-[center_35%] select-none"
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                />
              </div>

              {/* Layer 2 — Peripheral blur (top, masked to edges only) */}
              <div
                ref={imageBlurRef}
                className="absolute inset-0 will-change-[transform,opacity]"
                style={{
                  WebkitMaskImage:
                    'radial-gradient(ellipse 120% 115% at 50% 42%, transparent 50%, black 100%)',
                  maskImage:
                    'radial-gradient(ellipse 120% 115% at 50% 42%, transparent 50%, black 100%)',
                }}
              >
                <Image
                  src="/images/hero/barcelona-skyline.webp"
                  alt=""
                  role="presentation"
                  aria-hidden="true"
                  fill
                  sizes="(min-width: 768px) 130vw, 100vw"
                  quality={50}
                  priority={false}
                  className="object-cover object-[center_35%] blur-xl brightness-[0.95] saturate-[0.9] select-none"
                />
              </div>
            </div>
          </div>

          {/* ---- ATMOSPHERIC OVERLAYS ---- */}
          <div className="absolute inset-0 z-[1] pointer-events-none bg-gradient-to-b from-black/45 via-transparent to-black/45" />

          <div
            ref={vignetteRef}
            className="absolute inset-0 z-[2] pointer-events-none will-change-opacity"
            style={{
              background:
                'radial-gradient(ellipse 75% 70% at 50% 42%, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.8) 100%)',
            }}
          />

          {/* ---- CONTENT CANVAS ---- */}
          <div className="absolute inset-0 z-[3] pointer-events-none">
            {/* — Headline — */}
            <div
              ref={headlineWrapRef}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[90vw] text-center will-change-transform"
            >
              <h1
                className="flex flex-col items-center justify-center font-black font-serif tracking-tight leading-[1.08] text-[clamp(2.2rem,4.5vw,4.5rem)]"
                style={{
                  textShadow:
                    '0 2px 8px rgba(0,0,0,0.7), 0 8px 30px rgba(0,0,0,0.5)',
                }}
              >
                <span className="text-white text-balance">
                  {t('hero.section.headline.line_1')}
                </span>
                <span className="text-white/80 text-balance">
                  {t('hero.section.headline.line_2')}
                </span>
                <span className="text-[#E8A838] text-balance">
                  {t('hero.section.headline.line_3')}
                </span>
              </h1>

              <p
                className="mt-5 flex flex-wrap items-center justify-center gap-2 text-sm md:text-base lg:text-lg text-white font-semibold tracking-[0.01em]"
                style={{ textShadow: '0 2px 10px rgba(0,0,0,0.78)' }}
              >
                <span className="rounded-full border border-white/15 bg-black/55 px-3 py-1 backdrop-blur-md">
                  {t('hero.section.covering_label')}
                </span>
                <span className="rounded-full border border-[#E8A838]/45 bg-[#E8A838]/20 px-3 py-1 font-bold text-[#FFD57B]">
                  {t('hero.section.covering_cities')}
                </span>
              </p>
            </div>

            {/* — Body — */}
            <div
              ref={bodyRef}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-xl px-6 text-center opacity-0 will-change-transform"
            >
              <p
                className="text-base md:text-lg lg:text-xl text-gray-200 leading-relaxed text-balance"
                style={{ textShadow: '0 2px 8px rgba(0,0,0,0.7)' }}
              >
                {t('hero.section.body')}
              </p>
            </div>

            {/* — CTAs — */}
            <div
              ref={ctaRef}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full pointer-events-auto opacity-0 will-change-transform"
            >
              <div className="flex flex-col md:flex-row justify-center items-center gap-4 px-6">
                <Button
                  asChild
                  size="lg"
                  className="w-full md:w-auto px-10 py-4 text-base font-bold rounded-full bg-[#E8A838] text-black hover:bg-[#d4962e] hover:scale-[1.03] active:scale-[0.98] transition-all duration-200 shadow-[0_8px_30px_rgba(232,168,56,0.4)]"
                >
                  <Link href={`/${language}/safety-kit`}>
                    {t('hero.section.cta_primary')}
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="w-full md:w-auto px-10 py-4 text-base font-bold rounded-full border-2 border-white/50 text-white bg-white/10 backdrop-blur-md hover:bg-white/20 hover:border-white/80 hover:scale-[1.03] active:scale-[0.98] transition-all duration-200"
                >
                  <Link href={`/${language}/editorial/legal`}>
                    {t('hero.section.cta_secondary')}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================== */}
      {/*  MOBILE                                                       */}
      {/* =========================================================== */}
      <div
        className="md:hidden relative w-full min-h-[100dvh] flex flex-col bg-black overflow-hidden"
        ref={mobileContainerRef}
      >
        <div className="absolute inset-0 z-0">
          <div
            ref={mobileBgRef}
            className="relative w-full h-full will-change-transform"
          >
            <Image
              src="/images/hero/barcelona-skyline.webp"
              alt={t('hero.section.image_alt')}
              fill
              quality={80}
              sizes="100vw"
              priority
              className="object-cover object-[center_35%]"
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
          </div>
          <div className="absolute inset-0 bg-black/35 pointer-events-none" />
          <div className="absolute top-0 inset-x-0 h-[45vh] bg-gradient-to-b from-black/80 via-black/30 to-transparent pointer-events-none" />
          <div className="absolute bottom-0 inset-x-0 h-[65vh] bg-gradient-to-t from-black via-black/90 to-transparent pointer-events-none" />
        </div>

        <div
          ref={mobileContentRef}
          className="relative z-10 flex flex-col min-h-[100dvh] px-6 pt-24 pb-10"
        >
          <div className="flex flex-col items-center text-center w-full">
            <h1
              className="flex flex-col text-[clamp(2rem,8vw,3.2rem)] leading-[1.08] font-black font-serif tracking-tight text-white w-full"
              style={{
                textShadow:
                  '0 2px 8px rgba(0,0,0,0.7), 0 8px 24px rgba(0,0,0,0.5)',
              }}
            >
              <span className="text-balance">
                {t('hero.section.headline.line_1')}
              </span>
              <span className="text-white/80 text-balance">
                {t('hero.section.headline.line_2')}
              </span>
              <span className="text-[#E8A838] text-balance">
                {t('hero.section.headline.line_3')}
              </span>
            </h1>

            <p
              className="mt-5 flex flex-wrap items-center justify-center gap-2 text-sm text-white font-semibold tracking-[0.01em]"
              style={{ textShadow: '0 2px 10px rgba(0,0,0,0.78)' }}
            >
              <span className="rounded-full border border-white/20 bg-black/55 px-2.5 py-1 backdrop-blur-md">
                {t('hero.section.covering_label')}
              </span>
              <span className="rounded-full border border-[#E8A838]/45 bg-[#E8A838]/20 px-2.5 py-1 font-bold text-[#FFD57B]">
                {t('hero.section.covering_cities')}
              </span>
            </p>

            <p
              className="mt-8 max-w-[52ch] mx-auto text-[15px] text-gray-200 leading-relaxed text-balance"
              style={{ textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}
            >
              {t('hero.section.body')}
            </p>
          </div>

          <div className="flex-grow min-h-[4vh]" />

          <div className="w-full flex flex-col gap-3 mt-auto">
            <Button
              asChild
              size="lg"
              className="w-full py-4 text-base font-bold rounded-full bg-[#E8A838] text-black hover:bg-[#d4962e] active:scale-[0.98] transition-all shadow-[0_4px_20px_rgba(232,168,56,0.35)]"
            >
              <Link href={`/${language}/safety-kit`}>
                {t('hero.section.cta_primary')}
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="w-full py-4 text-base font-bold rounded-full border-2 border-white/50 text-white bg-white/10 backdrop-blur-md hover:bg-white/20 active:scale-[0.98] transition-all"
            >
              <Link href={`/${language}/editorial/legal`}>
                {t('hero.section.cta_secondary')}
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* =========================================================== */}
      {/*  LOADING OVERLAY                                              */}
      {/* =========================================================== */}
      {!overlayDismissed && (
        <div
          className={`fixed inset-0 z-[100] flex items-center justify-center bg-zinc-900 transition-opacity duration-1000 ${
            overlayHidden
              ? 'opacity-0 pointer-events-none'
              : 'opacity-100'
          }`}
          aria-live="polite"
          aria-label={
            overlayHidden ? 'Content loaded' : 'Loading content'
          }
        >
          <div className="flex flex-col items-center gap-5">
            <div
              className={`w-16 h-16 md:w-20 md:h-20 border-[3px] border-[#E8A838] border-t-transparent rounded-full ${
                prefersReducedMotion ? '' : 'animate-spin'
              }`}
            />
            <p className="text-white/60 text-sm tracking-widest uppercase">
              {t('hero.section.loading')}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
