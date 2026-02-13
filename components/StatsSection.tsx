'use client';

import { useEffect, useRef } from 'react';
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

export default function StatsSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    if (!sectionRef.current) return;

    // Staggered card entrance
    gsap.from(".stat-card", {
      opacity: 0,
      y: 60,
      scale: 0.95,
      stagger: 0.12,
      duration: 0.8,
      ease: "back.out(1.4)",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 85%", // Triggers when top of section hits 85% of viewport
        end: "top 50%",
        toggleActions: "play none none reverse"
      }
    });
  }, { scope: sectionRef });

  return (
    <section 
      ref={sectionRef}
      className="stats-section bg-[#0A0A0F] py-16 md:py-20 lg:py-24 border-t border-zinc-800 relative z-40"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 lg:gap-10">
          
          {statsData.map((stat, index) => {
            const Icon = stat.icon;
            
            return (
              <div 
                key={index} 
                className="stat-card text-center group cursor-default"
              >
                {/* Icon Container */}
                <div className="w-14 h-14 md:w-16 md:h-16 bg-[#E8A838]/10 rounded-xl flex items-center justify-center mx-auto mb-4 transition-all duration-300 group-hover:bg-[#E8A838]/20 group-hover:scale-110">
                  <Icon className="w-7 h-7 md:w-8 md:h-8 text-[#E8A838]" strokeWidth={2} />
                </div>

                {/* Value */}
                <div className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-2 tracking-tight">
                  {stat.value}
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
          })}

        </div>
      </div>
    </section>
  );
}
