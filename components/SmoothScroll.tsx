'use client';

import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { usePathname } from 'next/navigation';

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const tickerCallbackRef = useRef<((time: number) => void) | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    // Accessibility check: disable smooth scroll for users who prefer reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // Register ScrollTrigger early
    gsap.registerPlugin(ScrollTrigger);

    // Initialize Lenis with God-Level Physics
    lenisRef.current = new Lenis({
      duration: 1.2, // PERFECTLY MATCHES GSAP SCRUB (1.2)
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Apple-style heavy friction
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5, // 1.5 gives a premium, weighty feel on mobile touch
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

    // CRITICAL FIX: Recalculate GSAP math if user resizes the window or rotates tablet
    // Because our Hero uses absolute vh positioning, this is required.
    const handleResize = () => {
      ScrollTrigger.refresh();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      lenisRef.current?.destroy();
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
