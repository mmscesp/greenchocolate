'use client';

import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { usePathname } from 'next/navigation';
import { trackEvent } from '@/lib/analytics';

const SUPPORTED_LANGS = new Set(['en', 'es', 'fr', 'de', 'it', 'pl', 'ru', 'pt']);

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

function getLanguageFromPath(pathname: string): string {
  const [, maybeLang] = pathname.split('/');
  return maybeLang && SUPPORTED_LANGS.has(maybeLang) ? maybeLang : 'unknown';
}

function isLocalizedHomePath(pathname: string): boolean {
  const normalized = pathname.endsWith('/') && pathname.length > 1 ? pathname.slice(0, -1) : pathname;
  const [, maybeLang, maybeRest] = normalized.split('/');
  return Boolean(maybeLang && SUPPORTED_LANGS.has(maybeLang) && !maybeRest);
}

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const tickerCallbackRef = useRef<((time: number) => void) | null>(null);
  const initializedRef = useRef(false);
  const pathname = usePathname();
  const initialPathnameRef = useRef(pathname);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    gsap.registerPlugin(ScrollTrigger);

    const initialPathname = initialPathnameRef.current ?? window.location.pathname;
    const isConstrainedDevice = isConstrainedDeviceRuntime();
    const isHomePath = isLocalizedHomePath(initialPathname);
    const intentEvents: Array<keyof WindowEventMap> = ['wheel', 'touchstart', 'pointerdown', 'keydown', 'scroll'];

    let idleId: number | null = null;
    let timeoutId: number | null = null;
    let heroReady = !isHomePath;
    let userIntentReady = !isHomePath;

    const handleResize = () => {
      ScrollTrigger.refresh();
    };

    const clearDeferredStart = () => {
      if (idleId !== null && typeof window.cancelIdleCallback === 'function') {
        window.cancelIdleCallback(idleId);
      }
      if (timeoutId !== null) {
        window.clearTimeout(timeoutId);
      }
      idleId = null;
      timeoutId = null;
    };

    const initializeLenis = () => {
      if (initializedRef.current) return;
      initializedRef.current = true;
      clearDeferredStart();

      // Initialize Lenis with tuned physics. Constrained devices get lighter touch response.
      lenisRef.current = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: isConstrainedDevice ? 1.2 : 1.5,
        infinite: false,
      });

      // Sync Lenis with GSAP ScrollTrigger
      lenisRef.current.on('scroll', ScrollTrigger.update);

      // Sync GSAP ticker with Lenis requestAnimationFrame
      const tickerCallback = (time: number) => {
        lenisRef.current?.raf(time * 1000);
      };
      tickerCallbackRef.current = tickerCallback;
      gsap.ticker.add(tickerCallback);

      // Disable lag smoothing to prevent visual jumps on fast scrolls
      gsap.ticker.lagSmoothing(0);

      if (isHomePath) {
        trackEvent('hero_effects_enabled', {
          device_class: isConstrainedDevice ? 'constrained' : 'standard',
          reduced_motion: false,
          language: getLanguageFromPath(initialPathname),
          pathname: initialPathname,
        });
      }
    };

    const maybeInitializeLenis = () => {
      if (initializedRef.current) return;
      if (!heroReady || !userIntentReady) return;
      initializeLenis();
    };

    const markUserIntentReady = () => {
      userIntentReady = true;
      maybeInitializeLenis();
    };

    const handleHeroReady = () => {
      heroReady = true;
      maybeInitializeLenis();
    };

    if (isHomePath) {
      window.addEventListener('scm:hero-visual-ready', handleHeroReady, { once: true });
      intentEvents.forEach((eventName) => {
        window.addEventListener(eventName, markUserIntentReady, { passive: true, once: true });
      });

      const fallbackDelay = isConstrainedDevice ? 1400 : 900;
      if (typeof window.requestIdleCallback === 'function') {
        idleId = window.requestIdleCallback(markUserIntentReady, { timeout: fallbackDelay });
      } else {
        timeoutId = window.setTimeout(markUserIntentReady, fallbackDelay);
      }
    } else {
      initializeLenis();
    }

    // Recalculate GSAP math if user resizes the window or rotates tablet.
    window.addEventListener('resize', handleResize);

    return () => {
      clearDeferredStart();
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scm:hero-visual-ready', handleHeroReady);
      intentEvents.forEach((eventName) => {
        window.removeEventListener(eventName, markUserIntentReady);
      });

      lenisRef.current?.destroy();
      lenisRef.current = null;

      if (tickerCallbackRef.current) {
        gsap.ticker.remove(tickerCallbackRef.current);
        tickerCallbackRef.current = null;
      }
    };
  }, []);

  // CRITICAL FIX FOR NEXT.JS ROUTING
  // Force GSAP to recalculate when changing pages so old scroll heights aren't remembered
  useEffect(() => {
    // Small timeout ensures the DOM has painted the new page before calculating heights
    const timeoutId = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [pathname]);

  return <>{children}</>;
}


