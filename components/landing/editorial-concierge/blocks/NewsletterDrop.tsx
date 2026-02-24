import React from 'react';
import { SectionWrapper } from '../layout/SectionWrapper';
import { EditorialHeading } from '../typography/EditorialHeading';
import { ConciergeLabel } from '../typography/ConciergeLabel';
import { Check } from 'lucide-react';

export function NewsletterDrop() {
  return (
    <SectionWrapper dark className="bg-[#0A0A0A]">
      {/* Background Animated Gradient Placeholder */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-emerald-500/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-emerald-900/10 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <ConciergeLabel emphasis="medium" className="mb-6 block text-emerald-500">Stay Highly Informed</ConciergeLabel>
        <EditorialHeading size="xl" className="mb-8 text-white">Get weekly cannabis news for Spain in your inbox.</EditorialHeading>
        <p className="text-zinc-400 text-lg md:text-xl mb-12 max-w-2xl mx-auto">
          Law updates, scam patterns, harm reduction reminders, and culture highlights. 
          No product promotion. Just high-trust intelligence.
        </p>

        <form className="relative max-w-2xl mx-auto mb-16">
          <input 
            type="email" 
            placeholder="Enter your email for the weekly drop..."
            className="w-full bg-transparent border-b-2 border-zinc-800 py-6 px-4 text-2xl md:text-3xl text-white font-serif focus:outline-none focus:border-emerald-500 transition-colors placeholder:text-zinc-700"
          />
          <button 
            type="submit"
            className="absolute right-0 bottom-6 text-emerald-500 hover:text-emerald-400 font-bold uppercase tracking-widest text-xs flex items-center gap-2"
          >
            Subscribe <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="flex flex-wrap justify-center gap-8">
          {[
            'Legal Intelligence',
            'Scam Alerts',
            'Harm Reduction',
            'Culture Drops'
          ].map((item) => (
            <div key={item} className="flex items-center gap-2 text-zinc-500">
              <Check className="w-4 h-4 text-emerald-500" />
              <ConciergeLabel size="xs">{item}</ConciergeLabel>
            </div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}

import { ArrowRight } from 'lucide-react';
