'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

// Register plugins once
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export default function HeroSection() {
  // State (minimal - only for UI, not animations)
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Refs for all animation targets (NO STATE for animations!)
  const containerRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const localTriggersRef = useRef<ScrollTrigger[]>([]);
  
  // Animation values stored in refs (NOT state!)
  const initialScaleRef = useRef(1.53);
  const prefersReducedMotionRef = useRef(false);

  // Check for reduced motion preference (once on mount)
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    prefersReducedMotionRef.current = mediaQuery.matches;
    
    const handleChange = (e: MediaQueryListEvent) => {
      prefersReducedMotionRef.current = e.matches;
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Responsive detection (debounced)
  useEffect(() => {
    let resizeTimeout: NodeJS.Timeout;
    
    const checkMobile = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        const mobile = window.innerWidth < 768;
        setIsMobile(mobile);
        initialScaleRef.current = mobile ? 1.3 : 1.53;
      }, 100);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => {
      window.removeEventListener('resize', checkMobile);
      clearTimeout(resizeTimeout);
    };
  }, []);

  // Letter split helper
  const splitText = useCallback((text: string) => {
    return text.split(' ').map((word: string, i: number) => (
      <span key={i} className="inline-block overflow-hidden">
        <span className="word-inner inline-block">{word}</span>
        {i < text.split(' ').length - 1 && <span>&nbsp;</span>}
      </span>
    ));
  }, []);

  // OPTIMIZED GSAP ANIMATIONS
  useGSAP(() => {
    if (!imageLoaded || !containerRef.current || prefersReducedMotionRef.current) return;

    const ctx = gsap.context(() => {
      const triggers = [];

      // ANIMATION 1: Image Zoom + Pan (MERGED into single timeline)
      const imageTl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.3,
          onUpdate: (self) => {
            if (progressRef.current) {
              progressRef.current.style.transform = `scaleX(${self.progress})`;
            }
          }
        }
      });

      imageTl.fromTo(imageRef.current, 
        { scale: initialScaleRef.current },
        { scale: 1, ease: 'none', duration: 0.66 },
        0
      );

      imageTl.to(imageRef.current, 
        { yPercent: -25, ease: 'none', duration: 0.67 },
        0.33
      );

      if (imageTl.scrollTrigger) triggers.push(imageTl.scrollTrigger);

      // ANIMATION 2: Text Exit + Parallax (BATCHED into single timeline)
      const textTl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '50% top',
          scrub: 0.3,
        }
      });

      if (textRef.current) {
        textTl.fromTo(textRef.current,
          { opacity: 1, filter: 'blur(0px)' },
          { opacity: 0, filter: 'blur(10px)', ease: 'power2.in' },
          0.4
        );
      }

      if (taglineRef.current) {
        textTl.fromTo(taglineRef.current,
          { yPercent: 0 },
          { yPercent: -15, ease: 'none' },
          0
        );
      }

      if (headlineRef.current) {
        textTl.fromTo(headlineRef.current,
          { yPercent: 0 },
          { yPercent: -30, ease: 'none' },
          0
        );
      }

      if (bodyRef.current) {
        textTl.fromTo(bodyRef.current,
          { yPercent: 0 },
          { yPercent: -20, ease: 'none' },
          0
        );
      }

      if (textTl.scrollTrigger) triggers.push(textTl.scrollTrigger);

      // ANIMATION 3: Greenery Gradient
      const gradientTrigger = ScrollTrigger.create({
        trigger: containerRef.current,
        start: '60% top',
        end: 'bottom bottom',
        scrub: 0.3,
        onUpdate: (self) => {
          const gradient = document.querySelector('.greenery-transition-gradient') as HTMLElement | null;
          if (gradient) {
            gradient.style.opacity = String(self.progress);
          }
        }
      });
      triggers.push(gradientTrigger);

      localTriggersRef.current = triggers;

      // ENTRANCE ANIMATIONS
      gsap.from('.tagline-word .word-inner', {
        y: 40,
        opacity: 0,
        duration: 0.6,
        stagger: 0.05,
        ease: 'power3.out',
        delay: 0.3,
      });

      gsap.to('.symbol-not-equal', {
        textShadow: '0 0 60px rgba(232, 168, 56, 0.6)',
        scale: 1.02,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });

    }, containerRef);

    return () => {
      localTriggersRef.current.forEach(trigger => trigger.kill());
      ctx.revert();
    };
  }, { scope: containerRef, dependencies: [imageLoaded] });

  // 3D Tilt effect
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (prefersReducedMotionRef.current || isMobile || !textRef.current) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    
    gsap.to(textRef.current, {
      rotateY: x * 2,
      rotateX: -y * 2,
      duration: 0.2,
      ease: 'power1.out',
      overwrite: 'auto'
    });
  }, [isMobile]);

  const handleMouseLeave = useCallback(() => {
    if (!textRef.current) return;
    
    gsap.to(textRef.current, {
      rotateY: 0,
      rotateX: 0,
      duration: 0.4,
      ease: 'power2.out',
      overwrite: 'auto'
    });
  }, []);

  return (
    <section 
      ref={containerRef}
      className="hero-scroll-wrapper relative w-full bg-[#0A0A0F]"
      style={{ height: '300vh' }}
      role="region"
      aria-label="Hero Introduction"
    >
      <div className={`fixed inset-0 z-[100] flex items-center justify-center bg-[#0A0A0F] transition-all duration-700 ${imageLoaded ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <div className="relative">
          <div className="w-20 h-20 border-2 border-[#E8A838]/20 rounded-full" />
          <div className="absolute inset-0 w-20 h-20 border-2 border-[#E8A838] rounded-full border-t-transparent animate-spin" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-[#E8A838] rounded-full animate-pulse" />
        </div>
      </div>

      <div className="fixed top-0 left-0 w-full h-1 z-50 bg-transparent">
        <div ref={progressRef} className="h-full bg-gradient-to-r from-[#E8A838] to-[#D9534F] origin-left" style={{ transform: 'scaleX(0)' }} />
      </div>

      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden">
        <div className="absolute inset-0 bg-black">
          <div ref={imageRef} className="hero-image-container absolute inset-0 w-full h-full will-change-transform" style={{ transform: `scale(${initialScaleRef.current})`, transformOrigin: 'center 40%', backfaceVisibility: 'hidden' }}>
            <Image src="/images/hero/barcelona-skyline.webp" alt="Aerial view of Barcelona with Sagrada Familia" fill priority quality={75} sizes="100vw" className={`object-cover object-[center_40%] transition-opacity duration-700 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`} onLoad={() => setImageLoaded(true)} />
          </div>
        </div>

        <div className="absolute inset-0 pointer-events-none z-10" style={{ background: 'linear-gradient(to bottom, rgba(10,10,15,0.7) 0%, rgba(10,10,15,0.4) 40%, rgba(10,10,15,0.75) 100%)' }} />
        <div className="image-vignette absolute inset-0 pointer-events-none z-20" />
        <div className="greenery-transition-gradient absolute inset-0 pointer-events-none z-25" style={{ background: 'linear-gradient(to bottom, transparent 0%, transparent 50%, rgba(10,10,15,0.6) 70%, rgba(10,10,15,1) 100%)', opacity: 0 }} />

        <div ref={textRef} className="hero-text-content relative z-30 w-full h-full flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 pt-20 md:pt-32" style={{ perspective: '1000px', transformStyle: 'preserve-3d' }} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
          <div className="max-w-6xl mx-auto w-full text-center">
            <div ref={taglineRef} className="mb-6 md:mb-8">
              <p className="tagline-word text-xl md:text-2xl lg:text-3xl text-[#F5F0EB] tracking-[0.1em] leading-relaxed">{splitText('Different city. Different rules.')}</p>
              <p className="tagline-word text-xl md:text-2xl lg:text-3xl font-bold tracking-[0.1em] leading-relaxed mt-1" style={{ color: '#D9534F' }}>{splitText('Different consequences.')}</p>
            </div>

            <div ref={headlineRef} className="mb-8 md:mb-12 animate-fade-in-scale animation-delay-1300 opacity-0 fill-mode-forwards">
              <div className="flex items-center justify-center gap-4 md:gap-6 lg:gap-8 flex-wrap">
                <h1 className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-black tracking-[0.15em] uppercase text-[#F5F0EB]">BARCELONA</h1>
                <span className="symbol-not-equal text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-black" style={{ color: '#E8A838', textShadow: '0 0 40px rgba(232, 168, 56, 0.4)', display: 'inline-block' }}>≠</span>
                <h1 className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-black tracking-[0.15em] uppercase text-[#F5F0EB]">AMSTERDAM</h1>
              </div>
            </div>

            <div ref={bodyRef} className="mb-8 md:mb-12 max-w-2xl lg:max-w-3xl mx-auto animate-fade-in-up animation-delay-2000 opacity-0 fill-mode-forwards">
              <p className="text-base md:text-lg lg:text-xl text-gray-300 leading-relaxed mb-4">Spain&apos;s cannabis social clubs aren&apos;t coffeeshops.<br className="hidden sm:block" /> No walk-ins. No menus. No second chances if you don&apos;t know the rules.</p>
              <p className="text-lg md:text-xl lg:text-2xl text-[#F5F0EB] font-semibold">We&apos;re the verification layer that keeps you safe.</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full max-w-md mx-auto animate-fade-in-up animation-delay-2500 opacity-0 fill-mode-forwards mb-8">
              <Link href="/safety-guide" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto px-8 py-7 text-lg font-bold rounded-full bg-[#E8A838] text-black hover:bg-[#d4962e] transition-all shadow-xl hover:shadow-2xl hover:shadow-[#E8A838]/20 group border-none hover:-translate-y-1">Get the Free Safety Guide →</Button>
              </Link>
              <Link href="/how-it-works" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full sm:w-auto px-8 py-7 text-lg font-bold rounded-full border-2 border-white text-white bg-transparent hover:bg-white/10 transition-all hover:-translate-y-1">How It Actually Works</Button>
              </Link>
            </div>

            <div className="animate-fade-in-up animation-delay-2500 opacity-0 fill-mode-forwards">
              <div className="flex flex-col items-center gap-2">
                <ChevronDown className="w-8 h-8 md:w-10 md:h-10 animate-bounce" style={{ color: '#E8A838' }} strokeWidth={2.5} />
                <span className="text-sm md:text-base text-gray-400 uppercase tracking-wider font-medium">Scroll to explore</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}