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

    // Tuned for step-snapped hero narrative
    lenisRef.current = new Lenis({
      duration: 0.45,
      
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      
      wheelMultiplier: 1,
      
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
