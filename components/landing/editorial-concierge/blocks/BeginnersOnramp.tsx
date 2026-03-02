'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/hooks/useLanguage';

export function BeginnersOnramp() {
  const { t } = useLanguage();

  return (
    <section className="bg-[#0a0a0a] py-32 md:py-48 px-4 md:px-8 border-t border-white/5 relative z-10">
      <div className="max-w-3xl mx-auto text-center md:text-left">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-black font-serif text-white tracking-tight mb-12 leading-tight">
            {t('landing.beginners_onramp.title')}
          </h2>

          <div className="space-y-8 text-lg md:text-xl text-zinc-400 font-medium leading-relaxed">
            <p>
              {t('landing.beginners_onramp.paragraph_1')}
            </p>

            <p>
              {t('landing.beginners_onramp.paragraph_2')}
            </p>

            <p className="text-2xl md:text-3xl text-white font-bold leading-snug pt-6 border-t border-white/10 mt-12">
              {t('landing.beginners_onramp.paragraph_3')}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
