'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { useLanguage } from '@/hooks/useLanguage';
import { ArrowRight } from '@/lib/icons';
import { getCityImage } from '@/lib/image-fallbacks';

export function CommunityRoadmap() {
  const { language, t } = useLanguage();
  const shouldReduceMotion = useReducedMotion();

  const cities = [
    {
      slug: 'barcelona',
      name: t('landing.community_roadmap.cities.barcelona.name'),
      status: t('landing.community_roadmap.cities.barcelona.status'),
      tagline: t('landing.community_roadmap.cities.barcelona.tagline'),
      href: `/${language}/spain/barcelona`,
      active: true,
    },
    {
      slug: 'madrid',
      name: t('landing.community_roadmap.cities.madrid.name'),
      status: t('landing.community_roadmap.cities.madrid.status'),
      tagline: t('landing.community_roadmap.cities.madrid.tagline'),
      href: `/${language}/spain/madrid`,
      active: false,
    },
    {
      slug: 'valencia',
      name: t('landing.community_roadmap.cities.valencia.name'),
      status: t('landing.community_roadmap.cities.valencia.status'),
      tagline: t('landing.community_roadmap.cities.valencia.tagline'),
      href: `/${language}/spain/valencia`,
      active: false,
    },
    {
      slug: 'tenerife',
      name: t('landing.community_roadmap.cities.tenerife.name'),
      status: t('landing.community_roadmap.cities.tenerife.status'),
      tagline: t('landing.community_roadmap.cities.tenerife.tagline'),
      href: `/${language}/spain/tenerife`,
      active: false,
    },
  ] as const;

  return (
    <section className="relative isolate z-10 bg-bg-base py-24 md:py-32 px-4 md:px-8 border-t border-white/5 overflow-hidden">
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {cities.map((city, idx) => (
            <motion.div
              key={city.slug}
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
              whileInView={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.4, delay: idx * 0.04, ease: [0.25, 0.1, 0.25, 1] }}
              className="group relative aspect-[5/4] sm:aspect-[4/3] md:aspect-[16/9] overflow-hidden rounded-2xl bg-bg-surface border border-white/10"
            >
              <Image
                src={getCityImage(city.slug)}
                alt={city.name}
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover opacity-65 transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-bg-base via-bg-base/55 to-transparent opacity-95" />

              <div className="absolute inset-0 p-5 sm:p-6 md:p-10 flex flex-col justify-end">
                <div className="transform transition-transform duration-500 group-hover:-translate-y-2">
                  <div className="mb-2 flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <h3 className="min-w-0 text-3xl md:text-4xl font-black text-white tracking-tight">{city.name}</h3>
                    <span className={`shrink-0 rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-widest backdrop-blur-sm ${city.active ? 'bg-brand text-bg-base border-brand' : 'bg-bg-base/55 text-zinc-100 border-zinc-300/40'}`}>
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
                  ) : null}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

