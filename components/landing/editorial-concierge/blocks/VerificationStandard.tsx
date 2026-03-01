'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useLanguage } from '@/hooks/useLanguage';
import { CheckCircle2, ArrowRight } from '@/lib/icons';

export function VerificationStandard() {
  const { t, language } = useLanguage();
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    // Integrate actual subscription logic here
  };

  return (
    <section className="bg-zinc-900 py-24 md:py-32 px-4 md:px-8 overflow-hidden relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-black font-serif text-white tracking-tight mb-4">
            The Clubs We&apos;ve Verified. So Far.
          </h2>
          <p className="text-lg md:text-xl text-zinc-400 font-medium mb-6">
            We add one new verified club every week. Each one takes time. That&apos;s the point.
          </p>
          <p className="text-sm md:text-base text-zinc-500 leading-relaxed max-w-2xl mx-auto">
            Most directories scrape hundreds of unverified listings and call it comprehensive. We do the opposite — we visit, we verify, we build a relationship with every club before it appears here. If it&apos;s listed, it earned it.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-6 md:gap-8 overflow-x-auto pb-8 md:pb-0 snap-x snap-mandatory scrollbar-hide">
          {/* Club Card 1 */}
          <div className="min-w-[300px] md:min-w-[340px] bg-black border border-white/10 rounded-2xl p-6 md:p-8 flex-shrink-0 snap-center group hover:border-[#E8A838]/50 transition-colors duration-300">
            <div className="flex justify-between items-start mb-6">
              <span className="px-3 py-1 bg-[#E8A838] text-black text-[10px] font-bold uppercase tracking-widest rounded-sm">
                Barcelona
              </span>
              <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Club 311 Barcelona</h3>
            <div className="space-y-2 mb-8 text-sm text-zinc-400 font-medium">
              <p>Relaxed atmosphere · Est. 2018</p>
              <p>International members welcome</p>
              <p>Avg. response time: 12–24h</p>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#E8A838] mb-8">
              <CheckCircle2 className="w-4 h-4" /> Verified — SocialClubsMaps
            </div>
            <Link href={`/${language}/clubs`} className="text-white hover:text-[#E8A838] text-sm font-bold flex items-center gap-2 transition-colors">
              View Profile <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Club Card 2 */}
          <div className="min-w-[300px] md:min-w-[340px] bg-black border border-white/10 rounded-2xl p-6 md:p-8 flex-shrink-0 snap-center group hover:border-[#E8A838]/50 transition-colors duration-300">
            <div className="flex justify-between items-start mb-6">
              <span className="px-3 py-1 bg-[#E8A838] text-black text-[10px] font-bold uppercase tracking-widest rounded-sm">
                Madrid
              </span>
              <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">The Green Lounge</h3>
            <div className="space-y-2 mb-8 text-sm text-zinc-400 font-medium">
              <p>Premium Lounge · Est. 2020</p>
              <p>Strict referral policy (verified)</p>
              <p>Avg. response time: 2–4h</p>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#E8A838] mb-8">
              <CheckCircle2 className="w-4 h-4" /> Verified — SocialClubsMaps
            </div>
            <Link href={`/${language}/clubs`} className="text-white hover:text-[#E8A838] text-sm font-bold flex items-center gap-2 transition-colors">
              View Profile <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Coming Next Card */}
          <div className="min-w-[300px] md:min-w-[340px] bg-black/50 border-2 border-dashed border-white/10 rounded-2xl p-6 md:p-8 flex-shrink-0 snap-center flex flex-col justify-center items-center text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(232,168,56,0.05),transparent)] pointer-events-none" />
            <div className="relative z-10 w-full">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#E8A838] mb-2">Next Club Verified</p>
              <p className="text-xl font-bold text-white mb-8">Week of March 30, 2026</p>
              
              {isSubmitted ? (
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400 text-sm font-bold">
                  You&apos;ll be the first to know.
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex flex-col gap-3 w-full">
                  <input
                    type="email"
                    placeholder="Your email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#E8A838] focus:ring-1 focus:ring-[#E8A838] transition-all"
                  />
                  <button
                    type="submit"
                    className="w-full px-4 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-lg text-sm transition-colors border border-white/5"
                  >
                    Notify Me
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <Link href={`/${language}/clubs`} className="inline-flex items-center gap-2 text-zinc-500 hover:text-white font-bold uppercase tracking-widest text-xs transition-colors">
            View the Full Directory <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
