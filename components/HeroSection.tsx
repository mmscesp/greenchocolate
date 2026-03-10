'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
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

const HERO_ASSETS = {
  desktop: '/images/hero/barcelona-skyline.webp',
  mobile: '/images/hero/barcelona-skyline.webp',
} as const;

const HERO_CONFIG = {
  scrollHeight: '200vh',
  desktop: {
    initialMediaScale: 1.08,
    finalMediaScale: 1.01,
    initialContentScale: 0.95,
    vignetteIdleOpacity: 0.18,
    act2: {
      headline: { scale: 0.84, y: '-17vh' },
      contentBlock: { y: '24vh', scale: 1 },
      vignette: { opacity: 0.85 },
    },
  },
  mobile: {
    initialScale: 1.03,
    finalScale: 1.09,
  },
} as const;

type MobileHeroTypographyPreset = {
  headlineWrap: string;
  headline: string;
  line1: string;
  line2: string;
  line3: string;
  underline: string;
  body: string;
};

const MOBILE_HERO_TYPOGRAPHY = {
  en: {
    headlineWrap: 'max-w-[22rem] px-1',
    headline: 'gap-5 text-[clamp(1.9rem,7.95vw,2.78rem)] leading-[1.08] tracking-[-0.04em]',
    line1: 'whitespace-nowrap max-[347px]:whitespace-normal leading-[1.08]',
    line2: 'mx-auto max-w-[11.8em] text-[0.89em] leading-[1.12] text-balance',
    line3: 'whitespace-nowrap max-[347px]:whitespace-normal text-[0.91em] leading-[1.08]',
    underline: 'left-1/2 -bottom-1.5 h-[10px] w-[90%] -translate-x-1/2',
    body: 'max-w-[17.75rem] text-[0.9rem] leading-[1.5]',
  },
  es: {
    headlineWrap: 'max-w-[22.5rem] px-1',
    headline: 'gap-5 text-[clamp(1.88rem,8.05vw,2.8rem)] leading-[1.08] tracking-[-0.04em]',
    line1: 'whitespace-nowrap max-[347px]:whitespace-normal leading-[1.08]',
    line2: 'mx-auto max-w-[11.9em] text-[0.9em] leading-[1.12] text-balance',
    line3: 'whitespace-nowrap max-[347px]:whitespace-normal text-[0.91em] leading-[1.08]',
    underline: 'left-1/2 -bottom-1.5 h-[10px] w-[90%] -translate-x-1/2',
    body: 'max-w-[18rem] text-[0.9rem] leading-[1.5]',
  },
  fr: {
    headlineWrap: 'max-w-[21.5rem] px-1',
    headline: 'gap-5 text-[clamp(1.76rem,7.6vw,2.55rem)] leading-[1.08] tracking-[-0.035em]',
    line1: 'mx-auto max-w-[11.5em] leading-[1.08] text-balance',
    line2: 'mx-auto max-w-[12.2em] text-[0.9em] leading-[1.12] text-balance',
    line3: 'mx-auto max-w-[10.8em] text-[0.89em] leading-[1.08] text-balance',
    underline: 'left-1/2 -bottom-1.5 h-[10px] w-[87%] -translate-x-1/2',
    body: 'max-w-[17.9rem] text-[0.89rem] leading-[1.5]',
  },
  de: {
    headlineWrap: 'max-w-[21.5rem] px-1',
    headline: 'gap-5 text-[clamp(1.78rem,7.7vw,2.58rem)] leading-[1.08] tracking-[-0.035em]',
    line1: 'mx-auto max-w-[11.3em] leading-[1.08] text-balance',
    line2: 'mx-auto max-w-[12em] text-[0.9em] leading-[1.12] text-balance',
    line3: 'mx-auto max-w-[10.5em] text-[0.89em] leading-[1.08] text-balance',
    underline: 'left-1/2 -bottom-1.5 h-[10px] w-[87%] -translate-x-1/2',
    body: 'max-w-[17.9rem] text-[0.89rem] leading-[1.5]',
  },
  default: {
    headlineWrap: 'max-w-[21.5rem] px-1',
    headline: 'gap-5 text-[clamp(1.78rem,7.7vw,2.58rem)] leading-[1.08] tracking-[-0.035em]',
    line1: 'mx-auto max-w-[11.3em] leading-[1.08] text-balance',
    line2: 'mx-auto max-w-[12em] text-[0.9em] leading-[1.12] text-balance',
    line3: 'mx-auto max-w-[10.5em] text-[0.89em] leading-[1.08] text-balance',
    underline: 'left-1/2 -bottom-1.5 h-[10px] w-[87%] -translate-x-1/2',
    body: 'max-w-[17.9rem] text-[0.89rem] leading-[1.5]',
  },
} satisfies Record<string, MobileHeroTypographyPreset>;

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

export default function HeroSection() {
  const { t, language } = useLanguage();
  const pathname = usePathname();

  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isConstrainedDevice, setIsConstrainedDevice] = useState(false);

  const rootRef = useRef<HTMLElement>(null);
  const visualReadyFiredRef = useRef(false);
  const desktopContainerRef = useRef<HTMLDivElement>(null);
  const desktopMediaRef = useRef<HTMLDivElement>(null);
  const headlineWrapRef = useRef<HTMLDivElement>(null);
  const contentBlockRef = useRef<HTMLDivElement>(null);
  const vignetteRef = useRef<HTMLDivElement>(null);
  const mobileContainerRef = useRef<HTMLDivElement>(null);
  const mobileMediaRef = useRef<HTMLDivElement>(null);
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

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setPrefersReducedMotion(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    const rafId = window.requestAnimationFrame(() => {
      setIsConstrainedDevice(isConstrainedDeviceRuntime());
    });

    return () => window.cancelAnimationFrame(rafId);
  }, []);

  useEffect(() => {
    if (visualReadyFiredRef.current) return;

    let firstFrame = 0;
    let secondFrame = 0;

    const markReady = () => {
      if (visualReadyFiredRef.current) return;
      visualReadyFiredRef.current = true;
      const payload = buildAnalyticsPayload();
      trackEvent('hero_visual_ready', payload);
      window.dispatchEvent(new CustomEvent('scm:hero-visual-ready', { detail: payload }));
    };

    firstFrame = window.requestAnimationFrame(() => {
      secondFrame = window.requestAnimationFrame(markReady);
    });

    return () => {
      window.cancelAnimationFrame(firstFrame);
      window.cancelAnimationFrame(secondFrame);
    };
  }, [buildAnalyticsPayload]);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      const reduceMotion = prefersReducedMotion || window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      mm.add('(min-width: 768px)', () => {
        if (!desktopContainerRef.current || !desktopMediaRef.current || !headlineWrapRef.current || !contentBlockRef.current || !vignetteRef.current) {
          return;
        }

        const headlineLines = gsap.utils.toArray('.h1-line', headlineWrapRef.current) as HTMLElement[];
        const underlinePaths = gsap.utils.toArray('.h1-underline-path', desktopContainerRef.current) as SVGPathElement[];

        gsap.set(desktopMediaRef.current, {
          scale: HERO_CONFIG.desktop.initialMediaScale,
          y: '1.5%',
          transformOrigin: 'center 38%',
        });
        gsap.set(vignetteRef.current, {
          opacity: reduceMotion ? HERO_CONFIG.desktop.act2.vignette.opacity : HERO_CONFIG.desktop.vignetteIdleOpacity,
        });
        gsap.set(headlineWrapRef.current, { y: 0, scale: 1, transformOrigin: 'center center' });
        gsap.set(contentBlockRef.current, {
          y: '30vh',
          autoAlpha: 0,
          scale: HERO_CONFIG.desktop.initialContentScale,
          transformOrigin: 'center center',
        });

        if (reduceMotion) {
          gsap.set(contentBlockRef.current, {
            y: HERO_CONFIG.desktop.act2.contentBlock.y,
            autoAlpha: 1,
            scale: HERO_CONFIG.desktop.act2.contentBlock.scale,
          });
          gsap.set(underlinePaths, { strokeDashoffset: 0 });
          return;
        }

        gsap.fromTo(
          headlineLines,
          { y: 18 },
          {
            y: 0,
            duration: 0.85,
            stagger: 0.08,
            ease: 'power2.out',
            clearProps: 'transform',
          }
        );

        gsap.to(underlinePaths, {
          strokeDashoffset: 0,
          duration: 1.25,
          ease: 'power2.out',
          delay: 0.2,
        });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: desktopContainerRef.current,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 1.2,
          },
        });

        tl.to(
          desktopMediaRef.current,
          {
            scale: HERO_CONFIG.desktop.finalMediaScale,
            y: '0%',
            ease: 'power2.out',
            duration: 1,
          },
          0
        );
        tl.to(
          vignetteRef.current,
          {
            opacity: isConstrainedDevice ? 0.68 : HERO_CONFIG.desktop.act2.vignette.opacity,
            ease: 'power2.out',
            duration: 1,
          },
          0
        );
        tl.to(
          headlineWrapRef.current,
          {
            scale: HERO_CONFIG.desktop.act2.headline.scale,
            y: HERO_CONFIG.desktop.act2.headline.y,
            ease: 'power2.out',
            duration: 1,
          },
          0
        );
        tl.to(
          contentBlockRef.current,
          {
            autoAlpha: 1,
            y: HERO_CONFIG.desktop.act2.contentBlock.y,
            scale: HERO_CONFIG.desktop.act2.contentBlock.scale,
            ease: 'power2.out',
            duration: 1,
          },
          0
        );
      });

      mm.add('(max-width: 767px)', () => {
        if (!mobileContainerRef.current || !mobileMediaRef.current || !mobileContentRef.current) {
          return;
        }

        const mobileItems = mobileContainerRef.current.querySelectorAll('[data-mobile-hero-item]');
        const underlinePaths = gsap.utils.toArray('.h1-underline-path', mobileContainerRef.current) as SVGPathElement[];
        const startScale = isConstrainedDevice ? 1.02 : HERO_CONFIG.mobile.initialScale;
        const endScale = isConstrainedDevice ? 1.05 : HERO_CONFIG.mobile.finalScale;

        if (reduceMotion) {
          gsap.set(mobileMediaRef.current, { clearProps: 'transform' });
          gsap.set(underlinePaths, { strokeDashoffset: 0 });
          return;
        }

        gsap.set(mobileMediaRef.current, {
          scale: startScale,
          transformOrigin: 'center 36%',
        });
        gsap.to(mobileMediaRef.current, {
          scale: endScale,
          duration: isConstrainedDevice ? 10 : 18,
          ease: 'sine.inOut',
          yoyo: !isConstrainedDevice,
          repeat: isConstrainedDevice ? 0 : -1,
          transformOrigin: 'center 36%',
        });

        gsap.fromTo(
          mobileItems,
          { y: 16 },
          {
            y: 0,
            duration: 0.8,
            stagger: 0.12,
            ease: 'power2.out',
          }
        );

        gsap.to(underlinePaths, {
          strokeDashoffset: 0,
          duration: 1.1,
          ease: 'power2.out',
          delay: 0.2,
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
  const desktopGlassBlur = isConstrainedDevice ? 6 : 10;
  const mobileGlassBlur = isConstrainedDevice ? 10 : 18;
  const mobileHeroTypography = MOBILE_HERO_TYPOGRAPHY[language] ?? MOBILE_HERO_TYPOGRAPHY.default;

  return (
    <section ref={rootRef} className="relative w-full bg-bg-base" style={{ contain: 'layout style' }}>
      {shouldUseGlassDistortion ? (
        <svg style={{ display: 'none' }} aria-hidden="true">
          <filter id="glass-distortion" x="0%" y="0%" width="100%" height="100%" filterUnits="objectBoundingBox">
            <feTurbulence type="fractalNoise" baseFrequency="0.001 0.004" numOctaves="1" seed="17" result="turbulence" />
            <feGaussianBlur in="turbulence" stdDeviation="2" result="softMap" />
            <feDisplacementMap in="SourceGraphic" in2="softMap" scale="24" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </svg>
      ) : null}

      <div className="hidden md:block w-full" ref={desktopContainerRef} style={sectionStyle}>
        <div className={stageClasses}>
          <div className="absolute inset-0 bg-bg-base">
            <div ref={desktopMediaRef} className="absolute inset-0 will-change-transform">
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-cover bg-no-repeat select-none"
                style={{
                  backgroundImage: `url(${HERO_ASSETS.desktop})`,
                  backgroundPosition: 'center 35%',
                }}
              />
            </div>
          </div>

          <div className="absolute inset-0 z-[1] pointer-events-none bg-gradient-to-b from-black/45 via-transparent to-black/45" />
          <div
            ref={vignetteRef}
            className="absolute inset-0 z-[2] pointer-events-none will-change-opacity"
            style={{ background: 'radial-gradient(ellipse 75% 70% at 50% 55%, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0.78) 100%)' }}
          />

          <div className="absolute inset-0 z-[3] pointer-events-none">
            <div
              ref={headlineWrapRef}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[90vw] text-center will-change-transform"
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[150%] bg-black/35 blur-[72px] rounded-[100%] pointer-events-none z-0 [transform:translateZ(0)]" />

              <h1 className="relative z-10 flex flex-col items-center justify-center gap-4 md:gap-5 font-black font-serif tracking-[-0.03em] text-[clamp(2.2rem,4.5vw,4.5rem)] drop-shadow-[0_4px_24px_rgba(0,0,0,0.6)]">
                <span className="h1-line text-white text-balance leading-[1.05] will-change-transform">
                  {t('hero.section.headline.line_1')}
                </span>
                <span className="h1-line text-white/95 text-balance leading-[1.05] will-change-transform">
                  {t('hero.section.headline.line_2')}
                </span>
                <span className="h1-line text-brand text-balance leading-[1.05] will-change-transform relative inline-block">
                  <span className="relative z-10">{t('hero.section.headline.line_3')}</span>
                  <svg className="absolute -bottom-1 md:-bottom-2 left-0 w-full h-[10px] md:h-[14px] text-brand opacity-90 overflow-visible" viewBox="0 0 300 20" preserveAspectRatio="none">
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

            <div
              ref={contentBlockRef}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[38rem] px-4 flex flex-col items-center gap-5 opacity-0 will-change-[transform,opacity,scale] pointer-events-none"
            >
              <div
                className="relative w-full overflow-hidden rounded-[2.25rem] px-8 py-8 md:px-10 md:py-9 flex flex-col items-center gap-7 pointer-events-auto transition-transform duration-500 hover:scale-[1.01]"
                style={{ boxShadow: '0 10px 40px rgba(0, 0, 0, 0.58), 0 0 20px rgba(0, 0, 0, 0.18)' }}
              >
                <div
                  className={`absolute inset-0 z-0 pointer-events-none ${shouldUseGlassDistortion ? 'md:[filter:url(#glass-distortion)]' : ''} [transform:translateZ(0)]`}
                  style={{ backdropFilter: `blur(${desktopGlassBlur}px)`, isolation: 'isolate' }}
                />
                <div className="absolute inset-0 z-10 pointer-events-none" style={{ background: 'rgba(10, 10, 10, 0.42)' }} />
                <div
                  className="absolute inset-0 z-20 pointer-events-none rounded-[2.25rem]"
                  style={{ boxShadow: 'inset 2px 2px 1px 0 rgba(255, 255, 255, 0.2), inset -1px -1px 1px 1px var(--glass-highlight)' }}
                />

                <div className="relative z-30 flex flex-col items-center gap-6 w-full">
                  <p className="text-[1.05rem] text-white/95 leading-[1.6] text-center text-balance font-medium drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                    {t('hero.section.body')}
                  </p>
                  <div className="flex justify-center items-center gap-4 w-full">
                    <Button asChild size="lg" className="px-8 py-6 md:py-5 text-[0.95rem] font-bold rounded-full bg-brand text-bg-base hover:bg-brand-dark hover:scale-[1.03] active:scale-[0.98] transition-all duration-200 shadow-[0_4px_20px_hsl(var(--brand)/0.3)]">
                      <Link href={`/${language}/safety-kit`}>{t('hero.section.cta_primary')}</Link>
                    </Button>
                    <Button asChild size="lg" variant="secondary" className="px-8 py-6 md:py-5 text-[0.95rem] font-bold rounded-full border-white/20 text-white bg-white/5 hover:bg-white/15 hover:border-white/40 hover:scale-[1.03] active:scale-[0.98] transition-all duration-200 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]">
                      <Link href={`/${language}/editorial/what-are-cannabis-social-clubs-spain`}>{t('hero.section.cta_secondary')}</Link>
                    </Button>
                  </div>
                </div>
              </div>

              <div className="relative overflow-hidden rounded-full flex items-center shadow-[0_8px_20px_rgba(0,0,0,0.5)] transition-transform duration-300 hover:scale-[1.02] group pointer-events-auto">
                <div
                  className={`absolute inset-0 z-0 pointer-events-none ${shouldUseGlassDistortion ? 'md:[filter:url(#glass-distortion)]' : ''} [transform:translateZ(0)]`}
                  style={{ backdropFilter: `blur(${Math.max(4, desktopGlassBlur - 2)}px)`, isolation: 'isolate' }}
                />
                <div className="absolute inset-0 z-10 pointer-events-none" style={{ background: 'rgba(10, 10, 10, 0.52)' }} />
                <div
                  className="absolute inset-0 z-20 pointer-events-none rounded-full"
                  style={{ boxShadow: 'inset 1px 1px 1px 0 rgba(255, 255, 255, 0.2), inset -1px -1px 1px 0 var(--glass-highlight)' }}
                />
                <div className="relative z-30 flex items-center gap-3 px-6 py-2.5">
                  <span className="text-[11px] text-white/80 uppercase tracking-[0.1em] font-bold drop-shadow-md">{t('hero.section.covering_label')}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
                  <span className="text-[13px] font-bold text-brand-light tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">{t('hero.section.covering_cities')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="md:hidden relative w-full min-h-[100dvh] flex flex-col bg-bg-base overflow-hidden" ref={mobileContainerRef}>
        <div className="absolute inset-0 z-0">
          <div
            ref={mobileMediaRef}
            aria-hidden="true"
            className="relative w-full h-full will-change-transform bg-cover bg-no-repeat"
            style={{
              backgroundImage: `url(${HERO_ASSETS.mobile})`,
              backgroundPosition: 'center 38%',
            }}
          />
          <div className="absolute inset-0 bg-black/40 pointer-events-none" />
          <div className="absolute top-0 inset-x-0 h-[35vh] bg-gradient-to-b from-black/90 via-black/30 to-transparent pointer-events-none" />
          <div className="absolute bottom-0 inset-x-0 h-[65vh] bg-gradient-to-t from-black/95 via-black/60 to-transparent pointer-events-none" />
        </div>

        <div ref={mobileContentRef} className="relative z-10 flex flex-col min-h-[100dvh] px-4 pt-[16vh] pb-[6vh]">
          <div data-mobile-hero-item className={`mx-auto flex w-full flex-col items-center text-center ${mobileHeroTypography.headlineWrap}`}>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[120%] bg-black/40 blur-[56px] rounded-[100%] pointer-events-none -z-10 [transform:translateZ(0)]" />

            <h1 className={`flex w-full flex-col items-center font-black font-serif text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)] ${mobileHeroTypography.headline}`}>
              <span className={`${mobileHeroTypography.line1}`}>{t('hero.section.headline.line_1')}</span>
              <span className={`text-white/95 ${mobileHeroTypography.line2}`}>{t('hero.section.headline.line_2')}</span>
              <span className={`relative inline-block text-brand ${mobileHeroTypography.line3}`}>
                <span className="relative z-10">{t('hero.section.headline.line_3')}</span>
                <svg className={`absolute text-brand opacity-90 overflow-visible ${mobileHeroTypography.underline}`} viewBox="0 0 300 20" preserveAspectRatio="none">
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

          <div className="mt-auto w-full max-w-[26rem] mx-auto flex flex-col items-center gap-5 pt-10">
            <div data-mobile-hero-item className="w-full">
              <div
                className="relative flex w-full flex-col items-center gap-5 overflow-hidden rounded-[2.25rem] p-6"
                style={{ boxShadow: '0 10px 40px rgba(0, 0, 0, 0.6), 0 0 20px rgba(0, 0, 0, 0.2)' }}
              >
                <div className="absolute inset-0 z-0 pointer-events-none [transform:translateZ(0)]" style={{ backdropFilter: `blur(${mobileGlassBlur}px)` }} />
                <div className="absolute inset-0 z-10 pointer-events-none" style={{ background: 'rgba(10, 10, 10, 0.45)' }} />
                <div
                  className="absolute inset-0 z-20 pointer-events-none rounded-[2.25rem]"
                  style={{ boxShadow: 'inset 2px 2px 1px 0 rgba(255, 255, 255, 0.25), inset -1px -1px 1px 1px var(--glass-highlight)' }}
                />

                <div className="relative z-30 flex w-full flex-col items-center gap-5">
                  <p className={`text-center text-white/95 text-balance font-medium drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] ${mobileHeroTypography.body}`}>{t('hero.section.body')}</p>
                  <div className="w-full flex flex-col gap-3">
                    <Button asChild size="lg" className="w-full py-6 text-[0.95rem] font-bold rounded-full bg-brand text-bg-base hover:bg-brand-dark active:scale-[0.98] transition-all shadow-[0_4px_20px_hsl(var(--brand)/0.25)]">
                      <Link href={`/${language}/safety-kit`}>{t('hero.section.cta_primary')}</Link>
                    </Button>
                    <Button asChild size="lg" variant="secondary" className="w-full py-6 text-[0.95rem] font-bold rounded-full border border-white/20 text-white bg-white/5 active:bg-white/10 active:scale-[0.98] transition-all shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]">
                      <Link href={`/${language}/editorial/what-are-cannabis-social-clubs-spain`}>{t('hero.section.cta_secondary')}</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div data-mobile-hero-item className="flex justify-center">
              <div className="relative flex items-center overflow-hidden rounded-full shadow-[0_8px_20px_rgba(0,0,0,0.5)]">
                <div className="absolute inset-0 z-0 pointer-events-none [transform:translateZ(0)]" style={{ backdropFilter: `blur(${Math.max(8, mobileGlassBlur - 4)}px)` }} />
                <div className="absolute inset-0 z-10 pointer-events-none" style={{ background: 'rgba(10, 10, 10, 0.55)' }} />
                <div
                  className="absolute inset-0 z-20 pointer-events-none rounded-full"
                  style={{ boxShadow: 'inset 1px 1px 1px 0 rgba(255, 255, 255, 0.25), inset -1px -1px 1px 0 var(--glass-highlight)' }}
                />
                <div className="relative z-30 flex items-center gap-2.5 px-5 py-2.5">
                  <span className="text-[11px] text-white/80 uppercase tracking-[0.1em] font-bold drop-shadow-md">{t('hero.section.covering_label')}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
                  <span className="text-[13px] font-bold text-brand-light tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">{t('hero.section.covering_cities')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
