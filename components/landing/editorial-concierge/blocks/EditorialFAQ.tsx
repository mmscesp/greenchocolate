'use client';

import React from 'react';
import Link from 'next/link';
import { useState } from 'react';
import { SectionWrapper } from '../layout/SectionWrapper';
import { EditorialHeading } from '../typography/EditorialHeading';
import { ConciergeLabel } from '../typography/ConciergeLabel';
import { Plus } from 'lucide-react';
import { trackEvent } from '@/lib/analytics';

const FAQS = [
  { q: "What is a Cannabis Social Club?", a: "A private, non-profit association where members consume cannabis in a social setting. They are not shops; they are member-only establishments with strict protocols." },
  { q: "Is cannabis legal in Spain?", a: "Personal use and private cultivation are decriminalized. Public consumption remains illegal and subject to administrative fines. CSCs operate in a legal grey zone." },
  { q: "Can I be rejected from a club?", a: "Yes. Private associations have their own membership criteria and are not obligated to accept new members. Many clubs have closed lists." },
  { q: "What are the public consumption risks?", a: "Fines range from €601 to €30,000 under Organic Law 4/2015. Confiscation of product is standard. Discretion is essential." },
  { q: "Why does privacy matter so much?", a: "The legal protection of CSCs relies on their private, non-promotional nature. Respecting members' privacy and neighbor silence is mandatory." },
];

export function EditorialFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <SectionWrapper>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-20">
          <ConciergeLabel className="text-emerald-600 mb-6 block">Intelligence</ConciergeLabel>
          <EditorialHeading size="xl">Everything You Need to Know</EditorialHeading>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, i) => (
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
                className="w-full flex items-center justify-between gap-8 text-left"
                aria-expanded={openIndex === i}
                aria-controls={`editorial-faq-panel-${i}`}
              >
                <h4 className="text-xl md:text-2xl font-serif font-bold text-zinc-900 group-hover:text-emerald-600 transition-colors">
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
        
        <div className="mt-20 p-12 rounded-[2.5rem] bg-emerald-50 border border-emerald-100 text-center">
          <EditorialHeading size="sm" className="text-emerald-900 mb-4">Still have questions?</EditorialHeading>
          <p className="text-emerald-700 mb-8">Subscribe to the Intelligence Briefing or download the Safety Kit for deeper intelligence.</p>
          <Link
            href="/safety"
            className="inline-block bg-emerald-600 text-white font-bold px-8 py-4 rounded-full hover:bg-emerald-700 transition-colors"
            onClick={() => {
              trackEvent('landing_faq_safety_kit_click', {
                destination: '/safety',
              });
            }}
          >
            Get the Safety Kit
          </Link>
        </div>
      </div>
    </SectionWrapper>
  );
}
