'use client';

import React from 'react';
import Link from 'next/link';
import { useState } from 'react';
import { SectionWrapper } from '../layout/SectionWrapper';
import { EditorialHeading } from '../typography/EditorialHeading';
import { ConciergeLabel } from '../typography/ConciergeLabel';
import { Plus } from '@/lib/icons';
import { trackEvent } from '@/lib/analytics';
import { useLanguage } from '@/hooks/useLanguage';

export function EditorialFAQ() {
  const { t } = useLanguage();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    { q: t('landing.faq.items.1.q'), a: t('landing.faq.items.1.a') },
    { q: t('landing.faq.items.2.q'), a: t('landing.faq.items.2.a') },
    { q: t('landing.faq.items.3.q'), a: t('landing.faq.items.3.a') },
    { q: t('landing.faq.items.4.q'), a: t('landing.faq.items.4.a') },
    { q: t('landing.faq.items.5.q'), a: t('landing.faq.items.5.a') },
  ];

  return (
    <SectionWrapper glass>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-20">
          <ConciergeLabel className="text-emerald-600 mb-6 block">{t('landing.faq.label')}</ConciergeLabel>
          <EditorialHeading size="xl">{t('landing.faq.title')}</EditorialHeading>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="group border-b border-zinc-200 py-8">
              <button
                type="button"
                onClick={() => {
                  const nextOpen = openIndex === i ? null : i;
                  setOpenIndex(nextOpen);
                  trackEvent('landing_faq_toggle', {
                    question: faq.q,
                    opened: nextOpen === i,
                  });
                }}
                className="w-full flex items-center justify-between gap-4 sm:gap-8 text-left"
                aria-expanded={openIndex === i}
                aria-controls={`editorial-faq-panel-${i}`}
              >
                <h4 className="text-lg sm:text-xl md:text-2xl font-serif font-bold text-zinc-900 group-hover:text-emerald-600 transition-colors">
                  {faq.q}
                </h4>
                <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center shrink-0 group-hover:bg-emerald-50 transition-colors">
                  <Plus className={`w-4 h-4 text-zinc-400 group-hover:text-emerald-600 transition-transform duration-500 ${openIndex === i ? 'rotate-45' : ''}`} />
                </div>
              </button>
              {openIndex === i && (
                <div id={`editorial-faq-panel-${i}`} className="mt-6 max-w-3xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-500">
                  <p className="text-lg text-zinc-500 leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="mt-20 p-6 sm:p-8 md:p-12 rounded-[2.5rem] bg-emerald-50 border border-emerald-100 text-center">
          <EditorialHeading size="sm" className="text-emerald-900 mb-4">{t('landing.faq.cta_title')}</EditorialHeading>
          <p className="text-emerald-700 mb-8">{t('landing.faq.cta_description')}</p>
          <Link
            href="/safety"
            className="inline-flex min-h-11 items-center justify-center bg-emerald-600 text-white font-bold px-6 sm:px-8 py-3 sm:py-4 rounded-full hover:bg-emerald-700 transition-colors"
            onClick={() => {
              trackEvent('landing_faq_safety_kit_click', {
                destination: '/safety',
              });
            }}
          >
            {t('landing.faq.cta_button')}
          </Link>
        </div>
      </div>
    </SectionWrapper>
  );
}
