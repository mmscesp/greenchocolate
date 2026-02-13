'use client';

import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
      return; // Skip smooth scroll for accessibility
    }

    // ✅ OPTIMIZED for no-snap hero with scrub: 1.5
    lenisRef.current = new Lenis({
      // ✅ REDUCED from 0.9 to balance with scrub: 1.5
      // Math: 0.7 (Lenis) × 1.5 (GSAP scrub) = 1.05 total lag
      duration: 0.7,
      
      // ✅ SIMPLIFIED easing - standard smooth curve
      // No need for asymmetric since there's no snap
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      
      // ✅ REDUCED from 1.4 back to 1.2 (300vh instead of 400vh)
      wheelMultiplier: 1.2,
      
      // ✅ Mobile touch responsiveness
      touchMultiplier: 2,
      
      // ✅ Prevent infinite scroll
      infinite: false,
      
      // ✅ Auto-resize on window changes
      autoResize: true,
    });

    // ✅ Integrate Lenis with GSAP ScrollTrigger
    lenisRef.current.on('scroll', ScrollTrigger.update);

    // ✅ Use GSAP ticker for smooth 60fps animation loop
    gsap.ticker.lagSmoothing(0);
    
    const tickerCallback = (time: number) => {
      lenisRef.current?.raf(time * 1000);
    };
    
    gsap.ticker.add(tickerCallback);

    // ✅ CRITICAL: Refresh ScrollTrigger after Lenis initializes
    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });

    // ✅ Cleanup
    return () => {
      lenisRef.current?.destroy();
      gsap.ticker.remove(tickerCallback);
    };
  }, []);

  return <>{children}</>;
}