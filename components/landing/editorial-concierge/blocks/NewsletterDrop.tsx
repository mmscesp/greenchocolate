'use client';

import React from 'react';
import { useState } from 'react';
import { SectionWrapper } from '../layout/SectionWrapper';
import { EditorialHeading } from '../typography/EditorialHeading';
import { ConciergeLabel } from '../typography/ConciergeLabel';
import { ArrowRight, Check } from 'lucide-react';
import { trackEvent } from '@/lib/analytics';

export function NewsletterDrop() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim()) return;
    trackEvent('landing_newsletter_submit_attempt', {
      email_length: email.trim().length,
    });
    setStatus('loading');
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setStatus('success');
    trackEvent('landing_newsletter_submit_success', {
      source: 'newsletter_drop',
    });
  };

  return (
    <SectionWrapper dark className="bg-[#0A0A0A]">
      {/* Background Animated Gradient Placeholder */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-emerald-500/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-emerald-900/10 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <ConciergeLabel emphasis="medium" className="mb-6 block text-emerald-500">Strategic Intelligence</ConciergeLabel>
        <EditorialHeading size="xl" className="mb-8 text-white">The definitive weekly briefing on the Spanish cannabis landscape.</EditorialHeading>
        <p className="text-zinc-400 text-lg md:text-xl mb-12 max-w-2xl mx-auto">
          Critical legal updates, emerging scam patterns, and harm reduction protocols. 
          Zero promotion. Pure, high-trust intelligence for the informed member.
        </p>

        <form onSubmit={handleSubmit} className="relative max-w-2xl mx-auto mb-16 flex flex-col md:block">
          <label htmlFor="newsletter-drop-email" className="sr-only">Email address</label>
          <input 
            id="newsletter-drop-email"
            type="email" 
            required
            placeholder="Email address..."
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full bg-transparent border-b-2 border-zinc-800 py-4 md:py-6 px-2 md:px-4 text-xl md:text-3xl text-white font-serif focus:outline-none focus:border-emerald-500 transition-colors placeholder:text-zinc-700"
          />
          <button 
            type="submit"
            disabled={status === 'loading'}
            className="mt-6 md:mt-0 md:absolute md:right-0 md:bottom-6 text-emerald-500 hover:text-emerald-400 font-bold uppercase tracking-widest text-sm md:text-xs flex items-center justify-center md:justify-start gap-2"
          >
            {status === 'success' ? 'Subscribed' : status === 'loading' ? 'Subscribing...' : 'Subscribe'} <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {status === 'success' && (
          <p className="mb-8 text-emerald-400 text-sm font-bold uppercase tracking-widest">You are in. Watch your inbox.</p>
        )}

        <div className="flex flex-wrap justify-center gap-8">
          {[
            'Legal Intelligence',
            'Scam Alerts',
            'Harm Reduction',
            'Regulatory Analysis'
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
