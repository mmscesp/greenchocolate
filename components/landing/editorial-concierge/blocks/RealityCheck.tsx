'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import Link from 'next/link';
import { useLanguage } from '@/hooks/useLanguage';

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const }
  }
};

export function RealityCheck() {
  const { language, t } = useLanguage();
  const shouldReduceMotion = useReducedMotion();

  const cards = [
    {
      title: t('landing.reality_check.cards.walk_in.title'),
      myth: t('landing.reality_check.cards.walk_in.myth'),
      reality: t('landing.reality_check.cards.walk_in.reality'),
      number: '01',
    },
    {
      title: t('landing.reality_check.cards.street_fixer.title'),
      myth: t('landing.reality_check.cards.street_fixer.myth'),
      reality: t('landing.reality_check.cards.street_fixer.reality'),
      number: '02',
    },
    {
      title: t('landing.reality_check.cards.legal_assumption.title'),
      myth: t('landing.reality_check.cards.legal_assumption.myth'),
      reality: t('landing.reality_check.cards.legal_assumption.reality'),
      number: '03',
    }
  ];

  return (
    <section className="bg-bg-base pt-24 pb-32 md:pt-32 md:pb-40 px-4 md:px-8 border-t border-white/5 relative z-10 overflow-hidden">
      {/* Ambient glowing effect in the background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[400px] bg-brand/5 blur-[120px] rounded-[100%] pointer-events-none opacity-60" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20 md:mb-32">
          <motion.div
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
            whileInView={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Small badge above title */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/10 text-brand text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase mb-8 backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
              Reality Check
            </div>
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black font-serif text-white tracking-tight mb-6 leading-[1.15]">
              {t('landing.reality_check.title')}
            </h2>
            <p className="text-lg md:text-xl text-white/50 font-medium max-w-2xl mx-auto leading-relaxed">
              {t('landing.reality_check.subtitle')}
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 lg:gap-10">
          {cards.map((card, idx) => (
            <motion.div
              key={idx}
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 30 }}
              whileInView={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={
                shouldReduceMotion
                  ? { duration: 0.3, delay: idx * 0.1 }
                  : { ...cardVariants.visible.transition, delay: idx * 0.15 }
              }
              className="group relative bg-bg-surface/30 hover:bg-bg-surface/60 backdrop-blur-md border border-white/5 hover:border-brand/20 p-8 md:p-10 lg:p-12 rounded-[2rem] flex flex-col transition-all duration-500 overflow-hidden shadow-2xl shadow-black/20"
            >
              {/* Giant background number */}
              <div className="absolute -top-12 -right-8 text-[200px] font-black text-white/[0.02] group-hover:text-brand/[0.04] transition-colors duration-700 select-none pointer-events-none leading-none z-0">
                {card.number}
              </div>

              {/* Hover Top Border Glow */}
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-brand to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700 ease-out origin-center opacity-50 z-20" />

              <div className="relative z-10 flex flex-col h-full">
                {/* Title and line */}
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-8 h-[1px] bg-brand/50 group-hover:w-12 transition-all duration-500" />
                  <div className="text-xs uppercase tracking-[0.2em] text-white/50 font-bold group-hover:text-white/80 transition-colors duration-300">
                    {card.title}
                  </div>
                </div>

                {/* Myth */}
                <div className="mb-10">
                  <h3 className="text-2xl md:text-3xl font-serif text-white group-hover:text-brand-light transition-colors duration-300 leading-snug">
                    {card.myth}
                  </h3>
                </div>

                <div className="mt-auto">
                  {/* Reality */}
                  <div className="relative pl-6 border-l border-white/10 group-hover:border-brand/40 transition-colors duration-500">
                    <p className="text-base md:text-lg text-white/60 leading-relaxed font-medium group-hover:text-white/80 transition-colors duration-300">
                      {card.reality}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 15 }}
          whileInView={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="mt-20 md:mt-28 text-center"
        >
          <Link
            href={`/${language}/editorial/legal`}
            className="inline-flex items-center justify-center gap-4 px-8 py-4 rounded-full bg-white/[0.03] border border-white/10 hover:bg-white/10 hover:border-white/20 text-white font-semibold transition-all duration-300 group backdrop-blur-md"
          >
            <span className="text-base tracking-wide">{t('landing.reality_check.cta')}</span>
            <div className="w-8 h-8 rounded-full bg-brand/20 flex items-center justify-center group-hover:bg-brand transition-all duration-300">
              <span className="transform transition-transform group-hover:translate-x-0.5 text-brand group-hover:text-white text-sm font-bold">→</span>
            </div>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
