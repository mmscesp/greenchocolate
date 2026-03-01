'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useLanguage } from '@/hooks/useLanguage';
import { ArrowRight } from '@/lib/icons';

export function CommunityRoadmap() {
  const { language } = useLanguage();

  const cities = [
    {
      name: 'Barcelona',
      status: 'X verified clubs',
      tagline: 'The most developed scene in Spain. The most traps for tourists.',
      image: '/images/cities/barcelona-dusk.webp', // Placeholder path
      href: `/${language}/spain/barcelona`,
      active: true
    },
    {
      name: 'Madrid',
      status: 'Coming soon',
      tagline: 'Fewer tourists, fewer scams, better odds — if you know where to look.',
      image: '/images/cities/madrid-night.webp',
      href: `/${language}/spain/madrid`,
      active: true
    },
    {
      name: 'Valencia',
      status: 'Coming soon',
      tagline: 'Emerging. Intimate. Under the radar. Worth watching.',
      image: '/images/cities/valencia-arts.webp',
      href: `/${language}/spain/valencia`,
      active: false
    },
    {
      name: 'Tenerife',
      status: 'Coming soon',
      tagline: 'Island culture — small, tight-knit, and surprisingly sophisticated.',
      image: '/images/cities/tenerife-coast.webp',
      href: `/${language}/spain/tenerife`,
      active: false
    }
  ];

  return (
    <section className="bg-black py-24 md:py-32 px-4 md:px-8 border-t border-white/5 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 md:mb-24 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-black font-serif text-white tracking-tight mb-4">
            Four Cities. Four Completely Different Scenes.
          </h2>
          <p className="text-lg md:text-xl text-zinc-400 font-medium">
            The rules change. The culture changes. The risks change. Where you go matters more than you think.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {cities.map((city, idx) => (
            <motion.div
              key={city.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: idx * 0.1 }}
              className="group relative aspect-[4/3] md:aspect-[16/9] overflow-hidden rounded-2xl bg-zinc-900 border border-white/10"
            >
              {/* Image Layer */}
              <div className="absolute inset-0 bg-zinc-800 transition-transform duration-700 group-hover:scale-105">
                {/* In real implementation: <Image src={city.image} fill className="object-cover opacity-60 group-hover:opacity-40 transition-opacity" /> */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-90" />
              </div>

              <div className="absolute inset-0 p-6 md:p-10 flex flex-col justify-end">
                <div className="transform transition-transform duration-500 group-hover:-translate-y-2">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-3xl md:text-4xl font-black text-white tracking-tight">{city.name}</h3>
                    <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full border ${city.active ? 'bg-[#E8A838] text-black border-[#E8A838]' : 'bg-transparent text-zinc-500 border-zinc-700'}`}>
                      {city.status}
                    </span>
                  </div>
                  <p className="text-zinc-300 font-medium text-sm md:text-base max-w-md leading-relaxed mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 hidden md:block">
                    {city.tagline}
                  </p>
                  <p className="text-zinc-300 font-medium text-sm leading-relaxed mb-4 md:hidden">
                    {city.tagline}
                  </p>
                  
                  <Link
                    href={city.href}
                    className={`inline-flex items-center gap-2 font-bold uppercase tracking-widest text-xs transition-colors ${city.active ? 'text-[#E8A838] hover:text-white' : 'text-zinc-600 cursor-not-allowed'}`}
                  >
                    {city.active ? 'Explore ' + city.name : 'Coming Soon'}
                    {city.active && <ArrowRight className="w-4 h-4" />}
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
