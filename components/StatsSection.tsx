'use client';

import { useEffect, useRef, useState } from 'react';
import { BookOpen, Shield, AlertCircle, Calendar } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

const statsData = [
  {
    value: '4',
    label: 'Expert Guides',
    description: '100% Verified Content',
    icon: BookOpen,
  },
  {
    value: '2.5K+',
    label: 'Safety Kits',
    description: 'Downloaded by Travelers',
    icon: Shield,
  },
  {
    value: '€0',
    label: 'Fines',
    description: 'For Protected Members',
    icon: AlertCircle,
  },
  {
    value: 'Mar',
    label: '2026',
    description: 'Barcelona Club Launch',
    icon: Calendar,
  },
];

// Counter animation hook
const useCounter = (end: string, duration: number = 2, startAnimation: boolean = false) => {
  const [count, setCount] = useState('0');
  
  useEffect(() => {
    if (!startAnimation) return;
    
    // Extract numeric part
    const numericMatch = end.match(/[0-9.]+/);
    if (!numericMatch) {
      setCount(end);
      return;
    }
    
    const targetNum = parseFloat(numericMatch[0]);
    const suffix = end.replace(/[0-9.]+/, '');
    
    let startTime: number;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / (duration * 1000), 1);
      
      // Easing function
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentNum = targetNum * easeOutQuart;
      
      // Format based on original
      let formatted: string;
      if (end.includes('.')) {
        formatted = currentNum.toFixed(1);
      } else if (targetNum >= 1000) {
        formatted = Math.floor(currentNum).toLocaleString();
      } else {
        formatted = Math.floor(currentNum).toString();
      }
      
      setCount(formatted + suffix);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };
    
    requestAnimationFrame(animate);
  }, [end, duration, startAnimation]);
  
  return count;
};

function StatCard({ stat, index, startAnimation }: { stat: typeof statsData[0]; index: number; startAnimation: boolean }) {
  const count = useCounter(stat.value, 2, startAnimation);
  const Icon = stat.icon;
  
  return (
    <div 
      className="stat-card text-center group cursor-default rising-card"
      style={{ 
        animationDelay: `${index * 0.1}s`,
        opacity: 0,
        transform: 'translateY(60px) scale(0.95)'
      }}
    >
      {/* Icon Container with enhanced hover */}
      <div className="relative w-12 h-12 md:w-14 md:h-14 mx-auto mb-4">
        <div className="absolute inset-0 bg-[#E8A838]/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="relative w-full h-full bg-[#E8A838]/10 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:bg-[#E8A838]/20 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-[#E8A838]/10">
          <Icon className="w-6 h-6 md:w-7 md:h-7 text-[#E8A838] transition-transform duration-300 group-hover:scale-110" strokeWidth={2} />
        </div>
      </div>

      {/* Value with counter animation */}
      <div className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-2 tracking-tight tabular-nums">
        {count}
      </div>

      {/* Label */}
      <div className="text-xs md:text-sm font-bold text-[#4A7C6F] mb-1 tracking-wide">
        {stat.label}
      </div>

      {/* Description */}
      <div className="text-[10px] md:text-xs text-zinc-500 uppercase tracking-wider font-medium px-1">
        {stat.description}
      </div>
    </div>
  );
}

export default function StatsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [startAnimation, setStartAnimation] = useState(false);

  useGSAP(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // ═══════════════════════════════════════════════════════════════
      // PARALLAX ENTRANCE: Stats rise from hero bottom with depth
      // ═══════════════════════════════════════════════════════════════
      
      // Create a more dramatic parallax effect
      gsap.fromTo(sectionRef.current,
        { 
          yPercent: 15,  // Start slightly below
          opacity: 0.8,
        },
        {
          yPercent: 0,
          opacity: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 90%',  // Start when top of stats hits 90% of viewport
            end: 'top 60%',
            scrub: 1.5,  // Smoother, more dramatic scrub
          }
        }
      );

      // Rising card entrance - appears to rise from depth
      gsap.to('.rising-card', {
        opacity: 1,
        y: 0,
        scale: 1,
        rotateX: 0,
        stagger: {
          each: 0.1,
          from: 'start',
        },
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          end: 'top 35%',
          toggleActions: 'play none none reverse',
          onEnter: () => setStartAnimation(true),
        }
      });

      // ═══════════════════════════════════════════════════════════════
      // SUBTLE FLOAT: Stats float slightly as user continues scrolling
      // ═══════════════════════════════════════════════════════════════
      
      gsap.to(sectionRef.current, {
        yPercent: -5,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 60%',
          end: 'bottom top',
          scrub: true,
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, { scope: sectionRef });

  return (
    <section 
      ref={sectionRef}
      className="stats-section py-14 md:py-18 lg:py-22 relative z-50"
      style={{ perspective: '1000px' }}
    >
      {/* Seamless gradient from hero - transparent at top to dark at bottom */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{ 
          background: 'linear-gradient(to bottom, rgba(10,10,15,0.3) 0%, rgba(10,10,15,0.7) 30%, rgba(10,10,15,1) 100%)',
          zIndex: -1
        }} 
      />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
          {statsData.map((stat, index) => (
            <StatCard 
              key={index} 
              stat={stat} 
              index={index}
              startAnimation={startAnimation}
            />
          ))}
        </div>
      </div>
    </section>
  );
}