'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useLanguage } from '@/hooks/useLanguage';
import { trackEvent } from '@/lib/analytics';

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
  /*
    RECALCULATED: Much wider spread to guarantee breathing room.
    Headline scales down more and moves higher.
    Card moves lower.
  */
  act2: {
    headline: { scale: 0.85, y: '-16vh' },
    contentBlock: { y: '20vh', scale: 1 },
    vignette: { opacity: 0.85 },
    blur: { opacity: 0.22 },
  },
} as const;

function isConstrainedDeviceRuntime(): boolean {
  if (typeof window === 'undefined') return false;

  const coarsePointer = window.matchMedia('(pointer: coarse)').matches;
  const hardwareConcurrency = navigator.hardwareConcurrency ?? 8;
  const nav = navigator as Navigator & {
    deviceMemory?: number;
    connection?: {
      saveData?: boolean;
    };
  };
  const deviceMemory = nav.deviceMemory ?? 8;
  const saveData = Boolean(nav.connection?.saveData);

  return coarsePointer || hardwareConcurrency <= 4 || deviceMemory <= 4 || saveData;
}

/* ------------------------------------------------------------------ */
/*  COMPONENT                                                          */
/* ------------------------------------------------------------------ */
export default function HeroSection() {
  const { t, language } = useLanguage();
  const pathname = usePathname();

  const [imageLoaded, setImageLoaded] = useState(false);
  const [isVisualReady, setIsVisualReady] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isConstrainedDevice] = useState(() => isConstrainedDeviceRuntime());

  const rootRef = useRef<HTMLElement>(null);
  const loadFiredRef = useRef(false);
  const visualReadyFiredRef = useRef(false);
  /* ---- Desktop refs ---- */
  const desktopContainerRef = useRef<HTMLDivElement>(null);
  const droneWrapRef = useRef<HTMLDivElement>(null);
  const imageSharpRef = useRef<HTMLDivElement>(null);
  const imageBlurRef = useRef<HTMLDivElement>(null);
  const headlineWrapRef = useRef<HTMLDivElement>(null);
  const contentBlockRef = useRef<HTMLDivElement>(null);
  const vignetteRef = useRef<HTMLDivElement>(null);

  /* ---- Mobile refs ---- */
  const mobileContainerRef = useRef<HTMLDivElement>(null);
  const mobileBgRef = useRef<HTMLDivElement>(null);
  const mobileContentRef = useRef<HTMLDivElement>(null);

  const buildAnalyticsPayload = useCallback(
    () => ({
      device_class: isConstrainedDevice ? 'constrained' : 'standard',
      reduced_motion: prefersReducedMotion,
      language,
      pathname: pathname ?? window.location.pathname,
    }),
    [isConstrainedDevice, language, pathname, prefersReducedMotion]
  );

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
  /*  Two-frame visual readiness gate                                  */
  /* ---------------------------------------------------------------- */
  useEffect(() => {
    if (visualReadyFiredRef.current) return;

    let rafA = 0;
    let rafB = 0;
    const markReady = () => {
      if (visualReadyFiredRef.current) return;
      visualReadyFiredRef.current = true;
      setIsVisualReady(true);
      const payload = buildAnalyticsPayload();
      trackEvent('hero_visual_ready', payload);
      window.dispatchEvent(new CustomEvent('scm:hero-visual-ready', { detail: payload }));
    };

    rafA = window.requestAnimationFrame(() => {
      rafB = window.requestAnimationFrame(markReady);
    });

    return () => {
      window.cancelAnimationFrame(rafA);
      window.cancelAnimationFrame(rafB);
    };
  }, [buildAnalyticsPayload]);

  /* ---------------------------------------------------------------- */
  /*  Image load / error — guarded against double-fire                 */
  /* ---------------------------------------------------------------- */
  const handleImageLoad = useCallback(() => {
    if (loadFiredRef.current) return;
    loadFiredRef.current = true;
    setImageLoaded(true);
    trackEvent('hero_hq_ready', buildAnalyticsPayload());
  }, [buildAnalyticsPayload]);

  const handleImageError = useCallback(() => {
    handleImageLoad();
  }, [handleImageLoad]);

  useEffect(() => {
    if (loadFiredRef.current) return;

    const desktopImg = imageSharpRef.current?.querySelector('img');
    const mobileImg = mobileBgRef.current?.querySelector('img');
    const desktopComplete = Boolean(desktopImg?.complete && desktopImg.naturalWidth > 0);
    const mobileComplete = Boolean(mobileImg?.complete && mobileImg.naturalWidth > 0);

    if (!desktopComplete && !mobileComplete) return;

    const rafId = window.requestAnimationFrame(() => {
      handleImageLoad();
    });

    return () => window.cancelAnimationFrame(rafId);
  }, [handleImageLoad]);

  /* ---------------------------------------------------------------- */
  /*  GSAP — master animation controller                               */
  /* ---------------------------------------------------------------- */
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      const { act2 } = HERO_CONFIG;
      const reducedMotion = prefersReducedMotion || window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      mm.add('(min-width: 768px)', () => {
        if (!desktopContainerRef.current) return;

        if (reducedMotion) {
          gsap.set(headlineWrapRef.current, { opacity: 1, y: act2.headline.y, scale: act2.headline.scale });
          gsap.set('.h1-line', { opacity: 1, y: 0 });
          gsap.set('.h1-underline-path', { strokeDashoffset: 0 });
          gsap.set(contentBlockRef.current, { opacity: 1, y: act2.contentBlock.y, scale: act2.contentBlock.scale });
          gsap.set(vignetteRef.current, { opacity: act2.vignette.opacity });
          gsap.set(imageSharpRef.current, { clearProps: 'transform' });
          if (imageBlurRef.current) {
            gsap.set(imageBlurRef.current, { opacity: 0, clearProps: 'transform' });
          }
          return;
        }

        const imageTargets = [imageSharpRef.current, imageBlurRef.current].filter(
          (target): target is HTMLDivElement => target !== null
        );
        const blurOpacity = isConstrainedDevice ? 0.12 : act2.blur.opacity;
        const vignetteOpacity = isConstrainedDevice ? 0.72 : act2.vignette.opacity;

        // Initial drone altitude (zoomed in, pushed slightly down)
        gsap.set(imageTargets, { scale: HERO_CONFIG.focal.initialZoom, y: '2%', transformOrigin: 'center 40%' });
        if (imageBlurRef.current) {
          gsap.set(imageBlurRef.current, { opacity: 0 });
        }
        gsap.set(vignetteRef.current, { opacity: 0 });

        if (!isConstrainedDevice) {
          // The infinite hovering wind effect
          gsap.to(droneWrapRef.current, {
            y: '1.2vh',
            rotation: 0.15,
            duration: 5.5,
            ease: 'sine.inOut',
            yoyo: true,
            repeat: -1,
          });
        } else {
          gsap.to(droneWrapRef.current, {
            y: '0.35vh',
            duration: 1.2,
            ease: 'power2.out',
          });
        }

        // ACT 1 INITIAL STATE: Text center, card hidden way down
        gsap.set(headlineWrapRef.current, { opacity: 1, y: 0, scale: 1, transformOrigin: 'center center' });
        gsap.set(contentBlockRef.current, { opacity: 0, y: '30vh', scale: 0.95, transformOrigin: 'center center' });

        // Stagger Title load-in with Blur-to-Focus reveal
        const h1Lines = gsap.utils.toArray('.h1-line', headlineWrapRef.current) as HTMLElement[];
        gsap.fromTo(
          h1Lines,
          { y: 40, opacity: 0, filter: 'blur(10px)' },
          { y: 0, opacity: 1, filter: 'blur(0px)', duration: 1.2, stagger: 0.15, ease: 'expo.out', delay: 0.3 }
        );

        // Native GSAP Underline Draw Animation
        gsap.to('.h1-underline-path', {
          strokeDashoffset: 0,
          duration: 1.5,
          ease: 'power2.inOut',
          delay: 0.9,
        });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: desktopContainerRef.current,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 1.2,
            snap: { snapTo: 'labels', duration: { min: 0.3, max: 0.6 }, delay: 0.1, ease: 'power3.inOut' },
          },
        });
        tl.addLabel('act1', 0);
        // Cinematic Arc: Pull back (scale down) AND fly upwards (y: '0%') simultaneously
        tl.to(imageTargets, { scale: HERO_CONFIG.focal.finalScale, y: '0%', ease: 'power3.inOut', duration: 1 }, 0);
        if (imageBlurRef.current) {
          tl.to(imageBlurRef.current, { opacity: blurOpacity, ease: 'power3.inOut', duration: 1 }, 0);
        }
        tl.to(vignetteRef.current, { opacity: vignetteOpacity, ease: 'power3.inOut', duration: 1 }, 0);

        // Pushes headline gently up to sit below the pill navbar
        tl.to(headlineWrapRef.current, { scale: act2.headline.scale, y: act2.headline.y, ease: 'power3.inOut', duration: 1 }, 0);

        // Pulls card up to form a cohesive optical center with the headline
        tl.to(contentBlockRef.current, { opacity: 1, y: act2.contentBlock.y, scale: act2.contentBlock.scale, ease: 'power3.inOut', duration: 1 }, 0);
        tl.addLabel('act2', 1);
      });

      /* ============================================================ */
      /*  MOBILE — Native scroll with elegant entrance                 */
      /* ============================================================ */
      /*  DESKTOP — Cinematic 2-Act Timeline                           */
      /* ============================================================ */
      mm.add('(min-width: 768px)', () => {
        if (!desktopContainerRef.current) return;

        if (reducedMotion) {
          gsap.set(headlineWrapRef.current, { opacity: 1, y: act2.headline.y, scale: act2.headline.scale });
          gsap.set('.h1-line', { opacity: 1, y: 0 });
          gsap.set('.h1-underline-path', { strokeDashoffset: 0 });
          gsap.set(contentBlockRef.current, { opacity: 1, y: act2.contentBlock.y, scale: act2.contentBlock.scale });
          gsap.set(vignetteRef.current, { opacity: act2.vignette.opacity });
          gsap.set(imageSharpRef.current, { clearProps: 'transform' });
          if (imageBlurRef.current) {
            gsap.set(imageBlurRef.current, { opacity: 0, clearProps: 'transform' });
          }
          return;
        }

        const imageTargets = [imageSharpRef.current, imageBlurRef.current].filter(
          (target): target is HTMLDivElement => target !== null
        );
        const blurOpacity = isConstrainedDevice ? 0.12 : act2.blur.opacity;
        const vignetteOpacity = isConstrainedDevice ? 0.72 : act2.vignette.opacity;

        gsap.set(imageTargets, { scale: HERO_CONFIG.focal.initialZoom, transformOrigin: 'center 40%' });
        if (imageBlurRef.current) {
          gsap.set(imageBlurRef.current, { opacity: 0 });
        }
        gsap.set(vignetteRef.current, { opacity: 0 });

        if (!isConstrainedDevice) {
          gsap.to(droneWrapRef.current, {
            y: '1.2vh',
            rotation: 0.15,
            duration: 5.5,
            ease: 'sine.inOut',
            yoyo: true,
            repeat: -1,
          });
        } else {
          gsap.to(droneWrapRef.current, {
            y: '0.35vh',
            duration: 1.2,
            ease: 'power2.out',
          });
        }

        // ACT 1 INITIAL STATE: Text center, card hidden way down
        gsap.set(headlineWrapRef.current, { opacity: 1, y: 0, scale: 1, transformOrigin: 'center center' });
        gsap.set(contentBlockRef.current, { opacity: 0, y: '30vh', scale: 0.95, transformOrigin: 'center center' });

        // Stagger Title load-in with Blur-to-Focus reveal
        const h1Lines = gsap.utils.toArray('.h1-line', headlineWrapRef.current) as HTMLElement[];
        gsap.fromTo(
          h1Lines,
          { y: 40, opacity: 0, filter: 'blur(10px)' },
          { y: 0, opacity: 1, filter: 'blur(0px)', duration: 1.2, stagger: 0.15, ease: 'expo.out', delay: 0.3 }
        );
        // Native GSAP Underline Draw Animation
        gsap.to('.h1-underline-path', {
          strokeDashoffset: 0,
          duration: 1.5,
          ease: 'power2.inOut',
          delay: 0.9,
        });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: desktopContainerRef.current,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 1.2,
            snap: { snapTo: 'labels', duration: { min: 0.3, max: 0.6 }, delay: 0.1, ease: 'power3.inOut' },
          },
        });
        tl.addLabel('act1', 0);
        // Cinematic Arc: Pull back (scale down) AND fly upwards (y: '0%') simultaneously
        tl.to(imageTargets, { scale: HERO_CONFIG.focal.finalScale, y: '0%', ease: 'power3.inOut', duration: 1 }, 0);
        if (imageBlurRef.current) {
          tl.to(imageBlurRef.current, { opacity: blurOpacity, ease: 'power3.inOut', duration: 1 }, 0);
        }
        tl.to(vignetteRef.current, { opacity: vignetteOpacity, ease: 'power3.inOut', duration: 1 }, 0);

        // Pushes headline gently up to sit below the pill navbar
        tl.to(headlineWrapRef.current, { scale: act2.headline.scale, y: act2.headline.y, ease: 'power3.inOut', duration: 1 }, 0);

        // Pulls card up to form a cohesive optical center with the headline
        tl.to(contentBlockRef.current, { opacity: 1, y: act2.contentBlock.y, scale: act2.contentBlock.scale, ease: 'power3.inOut', duration: 1 }, 0);
        tl.addLabel('act2', 1);
      });

      /* ============================================================ */
      /*  MOBILE — Native scroll with elegant entrance                 */
      /* ============================================================ */
      mm.add('(max-width: 767px)', () => {
        if (!mobileContainerRef.current || !mobileContentRef.current) return;

        if (reducedMotion) {
          gsap.set(mobileContentRef.current.children, { opacity: 1, y: 0 });
          gsap.set('.h1-underline-path', { strokeDashoffset: 0 });
          return;
        }

        const startScale = isConstrainedDevice ? 1.02 : 1.06;
        const endScale = isConstrainedDevice ? 1.06 : 1.12;

        gsap.set(mobileBgRef.current, { scale: startScale, transformOrigin: 'center 35%' });
        gsap.to(mobileBgRef.current, {
          scale: endScale,
          duration: isConstrainedDevice ? 8 : 25,
          ease: isConstrainedDevice ? 'sine.out' : 'sine.inOut',
          yoyo: !isConstrainedDevice,
          repeat: isConstrainedDevice ? 0 : -1,
          transformOrigin: 'center 35%',
        });

        gsap.from(mobileContentRef.current.children, {
          y: 40,
          opacity: 0,
          duration: 1.2,
          stagger: 0.2,
          ease: 'expo.out',
          delay: 0.2,
          clearProps: 'all',
        });

        // Underline for mobile
        gsap.to('.h1-underline-path', {
          strokeDashoffset: 0,
          duration: 1.5,
          ease: 'power2.inOut',
          delay: 0.6,
        });
      });

      return () => mm.revert();
    },
    { scope: rootRef, dependencies: [prefersReducedMotion, isConstrainedDevice] }
  );

  const sectionStyle = prefersReducedMotion ? undefined : { height: HERO_CONFIG.scrollHeight };
  const stageClasses = prefersReducedMotion
    ? 'relative min-h-[100dvh] w-full overflow-hidden bg-bg-base'
    : 'sticky top-0 left-0 h-[100dvh] w-full overflow-hidden bg-bg-base';
  const shouldUseGlassDistortion = !prefersReducedMotion && !isConstrainedDevice;
  const desktopImageUpgradeClass = imageLoaded
    ? 'blur-0 brightness-100 saturate-100 scale-100'
    : isVisualReady
      ? 'blur-[1.5px] brightness-[0.9] saturate-[0.92] scale-[1.01]'
      : 'blur-[2.5px] brightness-[0.82] saturate-[0.88] scale-[1.015]';
  const mobileImageUpgradeClass = imageLoaded
    ? 'blur-0 brightness-100 saturate-100 scale-100'
    : isVisualReady
      ? 'blur-[1.25px] brightness-[0.92] saturate-[0.94] scale-[1.006]'
      : 'blur-[2px] brightness-[0.86] saturate-[0.9] scale-[1.01]';

  return (
    <section ref={rootRef} className="relative w-full bg-bg-base" style={{ contain: 'layout style' }}>
      {/* =========================================================== */}
      {/*  LIQUID GLASS SVG FILTER                                      */}
      {/* =========================================================== */}
      {shouldUseGlassDistortion ? (
        <svg style={{ display: 'none' }} aria-hidden="true">
          <filter id="glass-distortion" x="0%" y="0%" width="100%" height="100%" filterUnits="objectBoundingBox">
            <feTurbulence type="fractalNoise" baseFrequency="0.001 0.005" numOctaves="1" seed="17" result="turbulence" />
            <feComponentTransfer in="turbulence" result="mapped">
              <feFuncR type="gamma" amplitude="1" exponent="10" offset="0.5" />
              <feFuncG type="gamma" amplitude="0" exponent="1" offset="0" />
              <feFuncB type="gamma" amplitude="0" exponent="1" offset="0.5" />
            </feComponentTransfer>
            <feGaussianBlur in="turbulence" stdDeviation="3" result="softMap" />
            <feSpecularLighting in="softMap" surfaceScale="5" specularConstant="1" specularExponent="100" lightingColor="white" result="specLight">
              <fePointLight x="-200" y="-200" z="300" />
            </feSpecularLighting>
            <feComposite in="specLight" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" result="litImage" />
            <feDisplacementMap in="SourceGraphic" in2="softMap" scale="50" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </svg>
      ) : null}

      {/* =========================================================== */}
      {/*  DESKTOP                                                      */}
      {/* =========================================================== */}
      <div className="hidden md:block w-full" ref={desktopContainerRef} style={sectionStyle}>
        <div className={stageClasses}>
          {/* ---- IMAGE STAGE ---- */}
          <div className="absolute inset-0 bg-bg-base">
            <div ref={droneWrapRef} className="absolute inset-0 scale-[1.06] origin-center will-change-transform">
              <div
                ref={imageSharpRef}
                className={`absolute inset-0 will-change-[transform,filter] transition-[filter,transform] [transition-duration:380ms] ease-out ${desktopImageUpgradeClass}`}
              >
                <Image
                  src="/images/hero/barcelona-skyline.webp"
                  alt={t('hero.section.image_alt')}
                  fill
                  sizes="(min-width: 768px) 130vw, 0px"
                  quality={78}
                  priority
                  className="object-cover object-[center_35%] select-none"
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                />
              </div>
              {!isConstrainedDevice ? (
                <div
                  ref={imageBlurRef}
                  className="absolute inset-0 will-change-[transform,opacity]"
                  style={{
                    WebkitMaskImage: 'radial-gradient(ellipse 120% 115% at 50% 55%, transparent 50%, black 100%)',
                    maskImage: 'radial-gradient(ellipse 120% 115% at 50% 55%, transparent 50%, black 100%)',
                  }}
                >
                  <Image
                    src="/images/hero/barcelona-skyline.webp"
                    alt=""
                    role="presentation"
                    aria-hidden="true"
                    fill
                    sizes="(min-width: 768px) 130vw, 0px"
                    quality={72}
                    priority={false}
                    className="object-cover object-[center_35%] blur-xl brightness-[0.95] saturate-[0.9] select-none"
                  />
                </div>
              ) : null}
            </div>
          </div>
          <div className="absolute inset-0 z-[1] pointer-events-none bg-gradient-to-b from-black/45 via-transparent to-black/45" />
          <div
            ref={vignetteRef}
            className="absolute inset-0 z-[2] pointer-events-none will-change-opacity"
            style={{ background: 'radial-gradient(ellipse 75% 70% at 50% 55%, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.8) 100%)' }}
          />

          {/* ---- CONTENT CANVAS ---- */}
          <div className="absolute inset-0 z-[3] pointer-events-none">
            {/* — Headline Container — */}
            <div ref={headlineWrapRef} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[90vw] text-center will-change-transform">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[150%] bg-black/40 blur-[80px] rounded-[100%] pointer-events-none z-0 [transform:translateZ(0)]" />

              {/* Reduced gap to md:gap-4 to stop vertical overflow, kept tight cinematic feel */}
              <h1 className="relative z-10 flex flex-col items-center justify-center gap-3 md:gap-4 font-black font-serif tracking-tight text-[clamp(2.2rem,4.5vw,4.5rem)] drop-shadow-2xl">
                <span className="h1-line text-white text-balance leading-none opacity-0 will-change-[transform,opacity]">
                  {t('hero.section.headline.line_1')}
                </span>
                <span className="h1-line text-white/80 text-balance leading-none opacity-0 will-change-[transform,opacity]">
                  {t('hero.section.headline.line_2')}
                </span>

                <span className="h1-line text-gold text-balance leading-none opacity-0 will-change-[transform,opacity] relative inline-block">
                  <span className="relative z-10">{t('hero.section.headline.line_3')}</span>

                  {/* Underline pulled slightly tighter to text to avoid bottom clipping */}
                  <svg className="absolute -bottom-2 md:-bottom-3 left-0 w-full h-[10px] md:h-[16px] text-gold opacity-80 overflow-visible" viewBox="0 0 300 20" preserveAspectRatio="none">
                    <path
                      d="M 0,10 Q 75,0 150,10 Q 225,20 300,10"
                      stroke="currentColor"
                      strokeWidth="3.5"
                      fill="none"
                      strokeLinecap="round"
                      vectorEffect="non-scaling-stroke"
                      pathLength="1"
                      className="h1-underline-path"
                      style={{ strokeDasharray: 1, strokeDashoffset: 1 }}
                    />
                  </svg>
                </span>
              </h1>
            </div>

            {/* — Dark Liquid Glass Content Block — */}
            <div ref={contentBlockRef} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[42rem] px-4 flex flex-col items-center gap-6 opacity-0 will-change-[transform,opacity,scale]">
              {/* Compacted paddings (p-6 md:p-8) & gap to reduce vertical bloat */}
              <div
                className="relative w-full overflow-hidden rounded-[2.5rem] p-6 md:p-8 flex flex-col items-center gap-6 pointer-events-auto transition-all duration-700 hover:scale-[1.01]"
                style={{ boxShadow: '0 10px 40px rgba(0, 0, 0, 0.6), 0 0 20px rgba(0, 0, 0, 0.2)' }}
              >
                <div
                  className={`absolute inset-0 z-0 pointer-events-none ${shouldUseGlassDistortion ? 'md:[filter:url(#glass-distortion)]' : ''} [transform:translateZ(0)]`}
                  style={{ backdropFilter: `blur(${isConstrainedDevice ? 8 : 12}px)`, isolation: 'isolate' }}
                />
                <div className="absolute inset-0 z-10 pointer-events-none" style={{ background: 'rgba(10, 10, 10, 0.45)' }} />
                <div
                  className="absolute inset-0 z-20 pointer-events-none rounded-[2.5rem]"
                  style={{ boxShadow: 'inset 2px 2px 1px 0 rgba(255, 255, 255, 0.25), inset -1px -1px 1px 1px var(--glass-highlight)' }}
                />

                <div className="relative z-30 flex flex-col items-center gap-6 w-full">
                  <p className="text-base md:text-lg text-white/95 leading-relaxed text-center text-balance font-medium drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                    {t('hero.section.body')}
                  </p>
                  <div className="flex flex-col sm:flex-row justify-center items-center gap-4 w-full">
                    <Button asChild size="lg" className="w-full sm:w-auto px-10 py-6 text-base font-bold rounded-full bg-brand text-bg-base hover:bg-brand-dark hover:scale-[1.03] active:scale-[0.98] transition-all duration-200 shadow-[0_4px_20px_hsl(var(--brand)/0.3)]">
                      <Link href={`/${language}/safety-kit`}>{t('hero.section.cta_primary')}</Link>
                    </Button>
                    <Button asChild size="lg" variant="secondary" className="w-full sm:w-auto px-10 py-6 text-base font-bold rounded-full border-white/20 text-white bg-white/5 hover:bg-white/15 hover:border-white/40 hover:scale-[1.03] active:scale-[0.98] transition-all duration-200 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]">
                      <Link href={`/${language}/editorial/what-are-cannabis-social-clubs-spain`}>{t('hero.section.cta_secondary')}</Link>
                    </Button>
                  </div>
                </div>
              </div>

              <div className="relative overflow-hidden rounded-full flex items-center shadow-[0_8px_20px_rgba(0,0,0,0.5)] transition-all duration-500 hover:scale-[1.02] group">
                <div
                  className={`absolute inset-0 z-0 pointer-events-none ${shouldUseGlassDistortion ? 'md:[filter:url(#glass-distortion)]' : ''} [transform:translateZ(0)]`}
                  style={{ backdropFilter: `blur(${isConstrainedDevice ? 5 : 8}px)`, isolation: 'isolate' }}
                />
                <div className="absolute inset-0 z-10 pointer-events-none" style={{ background: 'rgba(10, 10, 10, 0.55)' }} />
                <div
                  className="absolute inset-0 z-20 pointer-events-none rounded-full"
                  style={{ boxShadow: 'inset 1px 1px 1px 0 rgba(255, 255, 255, 0.25), inset -1px -1px 1px 0 var(--glass-highlight)' }}
                />
                <div className="relative z-30 flex items-center gap-3 px-6 py-2.5">
                  <span className="text-xs text-white/80 uppercase tracking-[0.1em] font-bold drop-shadow-md">{t('hero.section.covering_label')}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
                  <span className="text-sm font-bold text-brand-light tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">{t('hero.section.covering_cities')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================== */}
      {/*  MOBILE                                                       */}
      {/* =========================================================== */}
      <div className="md:hidden relative w-full min-h-[100dvh] flex flex-col bg-bg-base overflow-hidden" ref={mobileContainerRef}>
        <div className="absolute inset-0 z-0">
          <div
            ref={mobileBgRef}
                className={`relative w-full h-full will-change-[transform,filter] transition-[filter,transform] [transition-duration:380ms] ease-out ${mobileImageUpgradeClass}`}
          >
            <Image
              src="/images/hero/barcelona-skyline.webp"
              alt={t('hero.section.image_alt')}
              fill
              quality={74}
              sizes="(max-width: 767px) 100vw, 0px"
              priority
              className="object-cover object-[center_35%]"
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
          </div>
          <div className="absolute inset-0 bg-black/40 pointer-events-none" />
          <div className="absolute top-0 inset-x-0 h-[45vh] bg-gradient-to-b from-black/90 via-black/40 to-transparent pointer-events-none" />
          <div className="absolute bottom-0 inset-x-0 h-[70vh] bg-gradient-to-t from-black/95 via-black/70 to-transparent pointer-events-none" />
        </div>

        <div ref={mobileContentRef} className="relative z-10 flex flex-col min-h-[100dvh] px-4 pt-28 pb-8">
          <div className="flex flex-col items-center text-center w-full px-2">
            <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[80%] h-[20vh] bg-black/50 blur-[60px] rounded-[100%] pointer-events-none -z-10 [transform:translateZ(0)]" />

            <h1 className="flex flex-col gap-4 text-[clamp(2.5rem,10vw,3.5rem)] font-black font-serif tracking-tight text-white w-full drop-shadow-lg">
              <span className="text-balance leading-[1.1]">{t('hero.section.headline.line_1')}</span>
              <span className="text-white/90 text-balance leading-[1.1]">{t('hero.section.headline.line_2')}</span>

              <span className="text-brand text-balance leading-[1.1] relative inline-block">
                <span className="relative z-10">{t('hero.section.headline.line_3')}</span>
                <svg className="absolute -bottom-2 md:-bottom-4 left-0 w-full h-[12px] text-brand opacity-80 overflow-visible" viewBox="0 0 300 20" preserveAspectRatio="none">
                  <path
                    d="M 0,10 Q 75,0 150,10 Q 225,20 300,10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                    strokeLinecap="round"
                    vectorEffect="non-scaling-stroke"
                    pathLength="1"
                    className="h1-underline-path"
                    style={{ strokeDasharray: 1, strokeDashoffset: 1 }}
                  />
                </svg>
              </span>
            </h1>
          </div>

          <div className="flex-grow min-h-[4vh]" />

          <div className="w-full flex flex-col gap-6 mt-auto items-center">
            <div
              className="relative w-full overflow-hidden rounded-[2rem] p-6 flex flex-col items-center gap-6"
              style={{ boxShadow: '0 10px 40px rgba(0, 0, 0, 0.6), 0 0 20px rgba(0, 0, 0, 0.2)' }}
            >
              <div className="absolute inset-0 z-0 pointer-events-none [transform:translateZ(0)]" style={{ backdropFilter: `blur(${isConstrainedDevice ? 14 : 24}px)` }} />
              <div className="absolute inset-0 z-10 pointer-events-none" style={{ background: 'rgba(10, 10, 10, 0.45)' }} />
              <div
                className="absolute inset-0 z-20 pointer-events-none rounded-[2rem]"
                style={{ boxShadow: 'inset 2px 2px 1px 0 rgba(255, 255, 255, 0.25), inset -1px -1px 1px 1px var(--glass-highlight)' }}
              />

              <div className="relative z-30 w-full flex flex-col items-center gap-6">
                <p className="text-[15px] text-white/95 font-medium leading-relaxed text-center text-balance drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">{t('hero.section.body')}</p>
                <div className="w-full flex flex-col gap-3">
                  <Button asChild size="lg" className="w-full py-6 text-base font-bold rounded-full bg-brand text-bg-base hover:bg-brand-dark active:scale-[0.98] transition-all shadow-[0_4px_20px_hsl(var(--brand)/0.25)]">
                    <Link href={`/${language}/safety-kit`}>{t('hero.section.cta_primary')}</Link>
                  </Button>
                  <Button asChild size="lg" variant="secondary" className="w-full py-6 text-base font-bold rounded-full border border-white/20 text-white bg-white/5 active:bg-white/10 active:scale-[0.98] transition-all shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]">
                    <Link href={`/${language}/editorial/what-are-cannabis-social-clubs-spain`}>{t('hero.section.cta_secondary')}</Link>
                  </Button>
                </div>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-full flex items-center shadow-[0_8px_20px_rgba(0,0,0,0.5)]">
              <div className="absolute inset-0 z-0 pointer-events-none [transform:translateZ(0)]" style={{ backdropFilter: `blur(${isConstrainedDevice ? 10 : 16}px)` }} />
              <div className="absolute inset-0 z-10 pointer-events-none" style={{ background: 'rgba(10, 10, 10, 0.55)' }} />
              <div
                className="absolute inset-0 z-20 pointer-events-none rounded-full"
                style={{ boxShadow: 'inset 1px 1px 1px 0 rgba(255, 255, 255, 0.25), inset -1px -1px 1px 0 var(--glass-highlight)' }}
              />
              <div className="relative z-30 flex items-center gap-2.5 px-5 py-2">
                <span className="text-[11px] text-white/80 uppercase tracking-[0.1em] font-bold drop-shadow-md">{t('hero.section.covering_label')}</span>
                <span className="w-1 h-1 rounded-full bg-white/20" />
                <span className="text-[13px] font-bold text-brand-light tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">{t('hero.section.covering_cities')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}









