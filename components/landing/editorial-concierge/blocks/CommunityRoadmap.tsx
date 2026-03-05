'use client';

import React from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { useLanguage } from '@/hooks/useLanguage';
import { ArrowRight } from '@/lib/icons';

export function CommunityRoadmap() {
  const { language, t } = useLanguage();
  const shouldReduceMotion = useReducedMotion();

  const cities = [
    {
      name: 'Barcelona',
      status: t('landing.community_roadmap.cities.barcelona.status'),
      tagline: t('landing.community_roadmap.cities.barcelona.tagline'),
      image: '/images/cities/barcelona-dusk.webp', // Placeholder path
      href: `/${language}/spain/barcelona`,
      active: true
    },
    {
      name: 'Madrid',
      status: t('landing.community_roadmap.cities.madrid.status'),
      tagline: t('landing.community_roadmap.cities.madrid.tagline'),
      image: '/images/cities/madrid-night.webp',
      href: `/${language}/spain/madrid`,
      active: true
    },
    {
      name: 'Valencia',
      status: t('landing.community_roadmap.cities.valencia.status'),
      tagline: t('landing.community_roadmap.cities.valencia.tagline'),
      image: '/images/cities/valencia-arts.webp',
      href: `/${language}/spain/valencia`,
      active: false
    },
    {
      name: 'Tenerife',
      status: t('landing.community_roadmap.cities.tenerife.status'),
      tagline: t('landing.community_roadmap.cities.tenerife.tagline'),
      image: '/images/cities/tenerife-coast.webp',
      href: `/${language}/spain/tenerife`,
      active: false
    }
  ];

  return (
    <section className="bg-bg-base py-24 md:py-32 px-4 md:px-8 border-t border-white/5 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* [motion] */}
        <motion.div
          className="text-center mb-16 md:mb-24 max-w-3xl mx-auto"
          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
          whileInView={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <h2 className="text-3xl md:text-5xl font-black font-serif text-white tracking-tight mb-4">
            {t('landing.community_roadmap.title')}
          </h2>
          <p className="text-lg md:text-xl text-zinc-400 font-medium">
            {t('landing.community_roadmap.subtitle')}
          </p>
        </motion.div>

        {/* [motion] */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6"
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {cities.map((city) => (
            <motion.div
              key={city.name}
              variants={{
                hidden: shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.25, 0.1, 0.25, 1] } },
              }}
              className="group relative aspect-[4/3] md:aspect-[16/9] overflow-hidden rounded-2xl bg-bg-surface border border-white/10"
            >
              {/* Image Layer */}
              <div className="absolute inset-0 bg-bg-card transition-transform duration-700 group-hover:scale-105">
                {/* In real implementation: <Image src={city.image} fill className="object-cover opacity-60 group-hover:opacity-40 transition-opacity" /> */}
                <div className="absolute inset-0 bg-gradient-to-t from-bg-base via-bg-base/60 to-transparent opacity-90" />
              </div>

              <div className="absolute inset-0 p-6 md:p-10 flex flex-col justify-end">
                <div className="transform transition-transform duration-500 group-hover:-translate-y-2">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-3xl md:text-4xl font-black text-white tracking-tight">{city.name}</h3>
                    <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full border ${city.active ? 'bg-brand text-bg-base border-brand' : 'bg-transparent text-zinc-500 border-zinc-700'}`}>
                      {city.status}
                    </span>
                  </div>
                  <p className="text-zinc-300 font-medium text-sm md:text-base max-w-md leading-relaxed mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 hidden md:block">
                    {city.tagline}
                  </p>
                  <p className="text-zinc-300 font-medium text-sm leading-relaxed mb-4 md:hidden">
                    {city.tagline}
                  </p>
                  
                  {city.active ? (
                    <Link
                      href={city.href}
                      className="inline-flex items-center gap-2 font-bold uppercase tracking-widest text-xs text-brand hover:text-zinc-100 transition-colors"
                    >
                      {t('landing.community_roadmap.explore_prefix')} {city.name}
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  ) : (
                    <span className="inline-flex items-center gap-2 font-bold uppercase tracking-widest text-xs text-zinc-600" aria-disabled="true">
                      {t('landing.community_roadmap.coming_soon')}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
