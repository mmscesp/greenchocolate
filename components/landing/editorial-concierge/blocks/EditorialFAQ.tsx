'use client';

import React, { useState } from 'react';
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from '@/lib/icons';
import { useLanguage } from '@/hooks/useLanguage';

export function EditorialFAQ() {
  const { t } = useLanguage();
  const shouldReduceMotion = useReducedMotion();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    { 
      q: t('landing.editorial_faq.items.legal.question'),
      a: t('landing.editorial_faq.items.legal.answer'),
    },
    { 
      q: t('landing.editorial_faq.items.international.question'),
      a: t('landing.editorial_faq.items.international.answer'),
    },
    { 
      q: t('landing.editorial_faq.items.listing_volume.question'),
      a: t('landing.editorial_faq.items.listing_volume.answer'),
    },
    { 
      q: t('landing.editorial_faq.items.free.question'),
      a: t('landing.editorial_faq.items.free.answer'),
    },
    { 
      q: t('landing.editorial_faq.items.difference.question'),
      a: t('landing.editorial_faq.items.difference.answer'),
    },
    {
      q: t('landing.editorial_faq.items.sales.question'),
      a: t('landing.editorial_faq.items.sales.answer'),
    }
  ];

  return (
    <section className="relative isolate z-10 bg-bg-base px-4 py-20 sm:py-24 md:px-8 md:py-32 lg:py-40">
      {/* Background Atmosphere */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand/5 blur-[120px] rounded-full pointer-events-none opacity-30 translate-x-1/2 -translate-y-1/2" />

      <div className="mx-auto w-full max-w-4xl relative z-10">
        <motion.div
          className="mb-16 md:mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8"
          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
          whileInView={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div>
            <div className="flex items-center gap-4 mb-6">
              <div className="h-[1px] w-8 bg-brand/50" />
              <span className="text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase text-brand">
                FAQ
              </span>
            </div>
            <h2 className="font-serif text-4xl font-black tracking-tight text-white md:text-5xl lg:text-6xl leading-[1.05]">
              {t('landing.editorial_faq.title')}
            </h2>
          </div>
        </motion.div>

        {/* Schema markup for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": faqs.map(faq => ({
                "@type": "Question",
                "name": faq.q,
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": faq.a
                }
              }))
            })
          }}
        />

        <div className="border-t border-white/10">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
              whileInView={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="group border-b border-white/10"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="flex w-full items-center justify-between gap-6 py-6 md:py-8 text-left transition-colors hover:text-brand"
                aria-expanded={openIndex === i}
              >
                <div className="flex items-start md:items-center gap-6 md:gap-8">
                  <span className="text-xs font-mono text-white/20 pt-1 md:pt-0">
                    0{i + 1}
                  </span>
                  <h4 className="text-lg md:text-2xl font-serif font-bold leading-snug text-white group-hover:text-brand-light transition-colors duration-300">
                    {faq.q}
                  </h4>
                </div>
                
                <div className="shrink-0 flex items-center justify-center">
                  <motion.div
                    animate={{ rotate: openIndex === i ? 180 : 0 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className={`w-8 h-8 rounded-full border flex items-center justify-center transition-colors duration-300 ${openIndex === i ? 'border-brand bg-brand text-black' : 'border-white/20 text-white/50 group-hover:border-brand/50 group-hover:text-brand'}`}
                  >
                    {openIndex === i ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                  </motion.div>
                </div>
              </button>
              
              <AnimatePresence initial={false}>
                {openIndex === i && (
                  <motion.div
                    initial={shouldReduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
                    animate={shouldReduceMotion ? { opacity: 1 } : { height: 'auto', opacity: 1 }}
                    exit={shouldReduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="pb-8 pl-12 md:pl-[3.25rem] pr-4 md:pr-16">
                      <div className="w-8 h-[1px] bg-brand/30 mb-6" />
                      <p className="text-base md:text-lg leading-relaxed text-white/60 font-medium">
                        {faq.a}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
