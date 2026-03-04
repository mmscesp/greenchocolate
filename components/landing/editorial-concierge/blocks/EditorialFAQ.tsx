'use client';

import React, { useState } from 'react';
import { Plus } from '@/lib/icons';
import { useLanguage } from '@/hooks/useLanguage';

export function EditorialFAQ() {
  const { t } = useLanguage();
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
    <section className="bg-bg-base py-24 md:py-32 px-4 md:px-8 border-t border-white/5">
      <div className="max-w-3xl mx-auto">
        <div className="mb-16 md:mb-20 text-center">
          <h2 className="text-3xl md:text-5xl font-black font-serif text-white tracking-tight">
            {t('landing.editorial_faq.title')}
          </h2>
        </div>

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

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="group bg-bg-surface rounded-2xl border border-white/5 overflow-hidden transition-colors hover:border-white/10">
              <button
                type="button"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between gap-4 p-6 md:p-8 text-left focus:outline-none"
                aria-expanded={openIndex === i}
              >
                <h4 className="text-lg md:text-xl font-bold text-white pr-8">
                  {faq.q}
                </h4>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border transition-all duration-300 ${openIndex === i ? 'bg-gold border-gold text-black rotate-45' : 'border-white/10 text-zinc-500'}`}>
                  <Plus className="w-4 h-4" />
                </div>
              </button>
              
              <div
                className={`grid transition-all duration-300 ease-in-out ${openIndex === i ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
              >
                <div className="overflow-hidden">
                  <p className="px-6 md:px-8 pb-6 md:pb-8 text-zinc-400 leading-relaxed text-base md:text-lg">
                    {faq.a}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
