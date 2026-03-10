'use client';

import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Plus } from '@/lib/icons';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';

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
    <section className="border-t border-white/5 bg-bg-base px-4 py-20 sm:px-5 sm:py-24 md:px-8 md:py-32">
      <div className="mx-auto w-full max-w-3xl">
        {/* [motion] */}
        <motion.div
          className="mb-14 text-center sm:mb-16 md:mb-20"
          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
          whileInView={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <h2 className="font-serif text-3xl font-black tracking-tight text-white sm:text-4xl md:text-5xl">
            {t('landing.editorial_faq.title')}
          </h2>
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

        {/* [motion] */}
        <div className="space-y-3 sm:space-y-4">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
              whileInView={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.35, delay: i * 0.03, ease: [0.25, 0.1, 0.25, 1] }}
              className="group overflow-hidden rounded-[1.5rem] border border-white/5 bg-bg-surface transition-colors hover:border-white/10 sm:rounded-2xl"
            >
              <Button
                type="button"
                variant="ghost"
                size="lg"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="!h-auto !min-h-[5.75rem] w-full items-start justify-between gap-3 !overflow-visible p-5 text-left !text-clip !whitespace-normal sm:gap-4 sm:p-6 md:p-8"
                aria-expanded={openIndex === i}
              >
                <h4 className="min-w-0 flex-1 text-pretty break-words pr-2 text-lg font-bold leading-tight text-white sm:pr-4 md:text-xl">
                  {faq.q}
                </h4>
                <div className={`mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full border transition-all duration-300 sm:size-10 ${openIndex === i ? 'rotate-45 border-brand bg-brand text-bg-base' : 'border-white/10 text-zinc-500'}`}>
                  <Plus className="w-4 h-4" />
                </div>
              </Button>
              
              <div
                className={`grid transition-all duration-300 ease-in-out ${openIndex === i ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
              >
                <div className="overflow-hidden">
                  <p className="px-5 pb-5 text-[15px] leading-7 text-zinc-400 sm:px-6 sm:pb-6 sm:text-base md:px-8 md:pb-8 md:text-lg">
                    {faq.a}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
