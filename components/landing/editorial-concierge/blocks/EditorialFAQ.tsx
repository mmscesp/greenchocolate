'use client';

import React, { useState } from 'react';
import { Plus } from '@/lib/icons';

export function EditorialFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    { 
      q: "Are Cannabis Social Clubs legal in Spain?", 
      a: "Genuinely complicated. No national law explicitly legalizes them. What IS clear: public consumption carries fines from €601 to €30,000. Private spaces are treated very differently. Read our legal guide." 
    },
    { 
      q: "Can international visitors actually join a Cannabis Social Club?", 
      a: "Some clubs accept international visitors. Many don't. You'll need prior membership, valid ID, and patience. Our directory shows who's open and what's required." 
    },
    { 
      q: "Why don't you list more clubs?", 
      a: "Because we verify every one. No scraped listings. No paid placements. One new club per week — that's the pace at which quality stays uncompromised." 
    },
    { 
      q: "Is SocialClubsMaps free?", 
      a: "Everything is free. Always will be. Safety information should never be paywalled." 
    },
    { 
      q: "How is this different from other cannabis directories?", 
      a: "Independent. Unsponsored. Every listing verified personally. No sensitive details on public pages. Education first — not just addresses." 
    },
    {
      q: "Do you sell cannabis or facilitate purchases?",
      a: "No. We're an educational platform and curated directory. We don't sell, broker, or facilitate the sale of any substance. What occurs between a club and its members is their private matter."
    }
  ];

  return (
    <section className="bg-[#0a0a0a] py-24 md:py-32 px-4 md:px-8 border-t border-white/5">
      <div className="max-w-3xl mx-auto">
        <div className="mb-16 md:mb-20 text-center">
          <h2 className="text-3xl md:text-5xl font-black font-serif text-white tracking-tight">
            Questions We Hear Most
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
            <div key={i} className="group bg-[#111] rounded-2xl border border-white/5 overflow-hidden transition-colors hover:border-white/10">
              <button
                type="button"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between gap-4 p-6 md:p-8 text-left focus:outline-none"
                aria-expanded={openIndex === i}
              >
                <h4 className="text-lg md:text-xl font-bold text-white pr-8">
                  {faq.q}
                </h4>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border transition-all duration-300 ${openIndex === i ? 'bg-[#E8A838] border-[#E8A838] text-black rotate-45' : 'border-white/10 text-zinc-500'}`}>
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
