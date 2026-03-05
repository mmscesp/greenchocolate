'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import Link from 'next/link';
import { useLanguage } from '@/hooks/useLanguage';

const cardVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] as const }
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
    },
    {
      title: t('landing.reality_check.cards.street_fixer.title'),
      myth: t('landing.reality_check.cards.street_fixer.myth'),
      reality: t('landing.reality_check.cards.street_fixer.reality'),
    },
    {
      title: t('landing.reality_check.cards.legal_assumption.title'),
      myth: t('landing.reality_check.cards.legal_assumption.myth'),
      reality: t('landing.reality_check.cards.legal_assumption.reality'),
    }
  ];

  return (
    <section className="bg-bg-base pt-24 pb-32 px-4 md:px-8 border-t border-white/5 relative z-10">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-24">
          <h2 className="text-3xl md:text-5xl font-black font-serif text-white tracking-tight mb-4 leading-tight">
            {t('landing.reality_check.title')}
          </h2>
          <p className="text-lg md:text-xl text-white/60 font-medium">
            {t('landing.reality_check.subtitle')}
          </p>
        </div>

        {/* [motion] */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {cards.map((card, idx) => (
            <motion.div
              key={idx}
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
              whileInView={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={
                shouldReduceMotion
                  ? { duration: 0.2, delay: idx * 0.03 }
                  : { ...cardVariants.visible.transition, delay: idx * 0.04 }
              }
              className="bg-bg-surface border border-white/10 p-6 md:p-8 rounded-2xl flex flex-col shadow-xl"
            >
              <div className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-4">
                {card.title}
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-brand mb-6 leading-snug">
                {card.myth}
              </h3>
              <p className="text-base text-white/80 leading-relaxed font-medium">
                {card.reality}
              </p>
            </motion.div>
          ))}
        </div>

        {/* [motion] */}
        <motion.div
          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
          whileInView={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
          className="mt-16 text-center"
        >
          <Link
            href={`/${language}/editorial/legal`}
            className="inline-flex items-center text-brand hover:text-brand-light font-bold text-lg transition-colors group"
          >
            {t('landing.reality_check.cta')}
            <span className="ml-2 transform transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
