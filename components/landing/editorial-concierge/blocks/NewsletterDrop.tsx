'use client';

import React, { useState } from 'react';
import { ArrowRight, Check } from '@/lib/icons';
import { trackEvent } from '@/lib/analytics';

export function NewsletterDrop() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  const benefits = [
    'Complete Safety Kit — sent instantly',
    'Weekly verified club alerts + city guides',
    'Zero ads. Zero sponsors. Just the work.'
  ];

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim()) return;
    setStatus('loading');
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    setStatus('success');
    trackEvent('newsletter_signup_success', { source: 'landing_climax' });
  };

  return (
    <section className="bg-gradient-to-br from-[#0a0a0a] to-[#111] py-24 md:py-40 px-4 md:px-8 relative overflow-hidden text-center border-t border-white/5">
      {/* Subtle Texture/Grain Overlay could go here */}
      
      <div className="max-w-4xl mx-auto relative z-10">
        <h2 className="text-4xl md:text-6xl font-black font-serif text-white tracking-tight mb-8 leading-[1.1] drop-shadow-2xl">
          One Verified Club.<br />
          One Essential Guide.<br />
          <span className="text-[#E8A838]">Every Week.</span>
        </h2>

        <p className="text-lg md:text-2xl text-zinc-400 mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
          The most useful email for anyone navigating Spain&apos;s cannabis club scene. Free forever.
        </p>

        <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-left max-w-3xl mx-auto mb-10">
          {benefits.map((benefit, i) => (
            <div key={i} className="flex items-center gap-2 text-zinc-400 text-sm font-medium">
              <Check className="w-4 h-4 text-[#E8A838] flex-shrink-0" />
              <span>{benefit}</span>
            </div>
          ))}
        </div>

        {status === 'success' ? (
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-8 max-w-lg mx-auto mb-12">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center text-black">
                <Check className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">You&apos;re on the list.</h3>
              <p className="text-emerald-400 font-medium">Check your inbox for the Safety Kit.</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4 max-w-md mx-auto mb-12 w-full">
            <div className="flex flex-col w-full gap-4">
              <input
                type="email"
                placeholder="Your email address"
                required
                disabled={status === 'loading'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-xl text-lg text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#E8A838] focus:ring-1 focus:ring-[#E8A838] transition-all"
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full px-8 py-4 bg-[#E8A838] hover:bg-[#d4962e] disabled:opacity-50 disabled:cursor-not-allowed text-black font-black text-lg rounded-xl shadow-[0_10px_40px_rgba(232,168,56,0.2)] hover:shadow-[0_10px_40px_rgba(232,168,56,0.4)] transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              >
                {status === 'loading' ? 'Joining...' : 'Subscribe — It\'s Free'}
                {status !== 'loading' && <ArrowRight className="w-5 h-5" />}
              </button>
            </div>
            <p className="text-zinc-600 text-xs font-bold uppercase tracking-widest">
              Join 2,500+ readers navigating Spain the smart way.
            </p>
          </form>
        )}

        <p className="mt-12 text-zinc-700 text-xs">
          We send one email per week. No spam. No partners. Unsubscribe in one click.
        </p>
      </div>
    </section>
  );
}
