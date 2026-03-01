'use client';

import React, { useState } from 'react';
import { Plus } from '@/lib/icons';

export function EditorialFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    { 
      q: "Are Cannabis Social Clubs legal in Spain?", 
      a: "It's genuinely complicated — and that complexity is exactly why we built this. Cannabis Social Clubs operate in a legal grey zone. There is no national law that explicitly legalizes them. Spain's Supreme Court has issued rulings that narrow what's considered non-criminal activity within an association. Catalonia attempted to regulate CSCs in 2017, but that law was declared unconstitutional in 2018. What IS clear: private consumption in a private space is treated very differently from public consumption, which is an administrative offense with fines from €601 to €30,000. We cover all of this in depth in our legal guide — but we're not lawyers, and nothing we publish should be taken as legal advice." 
    },
    { 
      q: "Can tourists actually join a Cannabis Social Club?", 
      a: "Some clubs accept international visitors. Many don't. Every club sets its own membership policy independently. What's universally true: you cannot walk in without prior membership, you will need valid identification, and the process takes time — sometimes days. Our directory shows which clubs are open to visitors and lists their specific requirements, including language support, response times, and intake policies." 
    },
    { 
      q: "Why don't you list more clubs?", 
      a: "Because we verify every single one. We don't scrape listings from Google Maps, TripAdvisor, or other directories. We don't accept payment for placement. We don't list clubs we haven't assessed against our verification standard. We add one new club per week because that's the pace at which we can do this properly without compromising the standard. Every directory that prioritized quantity over quality in this space eventually became part of the problem. We refuse to be that." 
    },
    { 
      q: "Is SocialClubsMaps free?", 
      a: "All our guides, safety resources, educational content, and the city quiz are completely free and always will be. The directory is free to browse. We may introduce optional premium features in the future — such as expedited verification or concierge-level trip support — but the core of what we do will remain open. We believe safety information should never be paywalled." 
    },
    { 
      q: "How is this different from other cannabis directories?", 
      a: "Most directories in this space fall into one of three categories: they scrape unverified listings to look comprehensive, they accept payment from clubs for placement, or they operate as thinly-veiled fronts for specific clubs looking to attract tourists. We are independent. We are unsponsored. We verify every listing. We don't publish sensitive details on public pages. And we invest in the educational content that helps you understand the entire landscape — not just find an address. That's the difference, and it's not close." 
    },
    {
      q: "Do you sell cannabis or facilitate purchases?",
      a: "No. Absolutely not. SocialClubsMaps is an educational platform and a curated directory. We do not sell, broker, or facilitate the sale or purchase of any controlled substance. Cannabis Social Clubs are private associations — what occurs between a club and its members is their private matter, governed by their own house rules and the laws of Spain. We help people understand how the system works and connect with clubs that meet our verification standard. That's where our role ends."
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
