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
      className="stat-card text-center group cursor-default"
      style={{ animationDelay: `${index * 0.12}s` }}
    >
      {/* Icon Container with enhanced hover */}
      <div className="relative w-14 h-14 md:w-16 md:h-16 mx-auto mb-4">
        <div className="absolute inset-0 bg-[#E8A838]/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="relative w-full h-full bg-[#E8A838]/10 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:bg-[#E8A838]/20 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-[#E8A838]/10">
          <Icon className="w-7 h-7 md:w-8 md:h-8 text-[#E8A838] transition-transform duration-300 group-hover:scale-110" strokeWidth={2} />
        </div>
      </div>

      {/* Value with counter animation */}
      <div className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-2 tracking-tight tabular-nums">
        {count}
      </div>

      {/* Label */}
      <div className="text-sm md:text-base font-bold text-[#4A7C6F] mb-1 tracking-wide">
        {stat.label}
      </div>

      {/* Description */}
      <div className="text-xs md:text-sm text-zinc-500 uppercase tracking-wider font-medium px-2">
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
      // Staggered card entrance with enhanced animation
      gsap.from('.stat-card', {
        opacity: 0,
        y: 80,
        scale: 0.9,
        rotateX: 15,
        stagger: {
          each: 0.12,
          from: 'start',
        },
        duration: 1,
        ease: 'back.out(1.7)',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 85%',
          end: 'top 50%',
          toggleActions: 'play none none reverse',
          onEnter: () => setStartAnimation(true),
        }
      });

      // Subtle parallax on the entire section
      gsap.to(sectionRef.current, {
        yPercent: -5,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
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
      className="stats-section py-16 md:py-20 lg:py-24 border-t border-zinc-800 relative z-40"
      style={{ perspective: '1000px' }}
    >
      {/* Background subtle gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0A0A0F]/80 to-[#0A0A0F] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 lg:gap-10">
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