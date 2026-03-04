'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useLanguage } from '@/hooks/useLanguage';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring' as const, stiffness: 300, damping: 24 }
  }
};

export function WhoWeAre() {
  const { language, t } = useLanguage();

  const pillars = [
    {
      label: t('landing.who_we_are.pillars.educate.label'),
      when: t('landing.who_we_are.pillars.educate.when'),
      body: t('landing.who_we_are.pillars.educate.body'),
      cta: t('landing.who_we_are.pillars.educate.cta'),
      href: `/${language}/editorial`
    },
    {
      label: t('landing.who_we_are.pillars.verify.label'),
      when: t('landing.who_we_are.pillars.verify.when'),
      body: t('landing.who_we_are.pillars.verify.body'),
      cta: t('landing.who_we_are.pillars.verify.cta'),
      href: `/${language}/clubs`
    },
    {
      label: t('landing.who_we_are.pillars.protect.label'),
      when: t('landing.who_we_are.pillars.protect.when'),
      body: t('landing.who_we_are.pillars.protect.body'),
      cta: t('landing.who_we_are.pillars.protect.cta'),
      href: `/${language}/safety-kit`
    }
  ];

  return (
    <section className="bg-bg-surface py-24 md:py-32 px-4 md:px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-20 md:mb-28 max-w-4xl">
          <h2 className="text-4xl md:text-6xl font-black font-serif text-white tracking-tight mb-8 leading-[1.1]">
            {t('landing.who_we_are.header.title_line_1')}<br />
            <span className="text-zinc-300">{t('landing.who_we_are.header.title_line_2')}</span>
          </h2>
          <div className="space-y-6 text-lg md:text-xl font-medium text-zinc-300 leading-relaxed max-w-3xl border-l-4 border-brand pl-6 md:pl-8">
            <p>
              {t('landing.who_we_are.header.paragraph_1')}
            </p>
            <p>
              {t('landing.who_we_are.header.paragraph_2')}
            </p>
            <p className="text-white font-bold pt-2">{t('landing.who_we_are.header.signature')}</p>
          </div>
        </div>

        {/* The Three Pillars */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12"
        >
          <div className="md:col-span-3 mb-8">
            <h3 className="text-sm font-bold tracking-[0.2em] text-zinc-300 uppercase">{t('landing.who_we_are.pillars_title')}</h3>
          </div>

          {pillars.map((pillar, idx) => (
            <motion.div
              key={idx}
              variants={cardVariants}
              className="flex flex-col h-full group"
            >
              <div className="mb-6 pb-6 border-b-2 border-white/10 group-hover:border-brand transition-colors duration-500">
                <h3 className="text-5xl md:text-6xl font-black font-serif text-zinc-100 tracking-tighter mb-2">
                  {pillar.label}
                </h3>
                <span className="text-sm font-bold uppercase tracking-widest text-brand">
                  {pillar.when}
                </span>
              </div>
              <p className="text-base md:text-lg text-zinc-300 leading-relaxed mb-8 flex-grow font-medium">
                {pillar.body}
              </p>
              <Link
                href={pillar.href}
                className="inline-flex items-center text-zinc-100 hover:text-brand font-bold text-lg hover:translate-x-2 transition-transform transition-colors duration-300"
              >
                {pillar.cta}
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
