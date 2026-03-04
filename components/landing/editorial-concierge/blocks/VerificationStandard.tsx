'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useLanguage } from '@/hooks/useLanguage';
import { CheckCircle2, ArrowRight } from '@/lib/icons';

export function VerificationStandard() {
  const { language, t } = useLanguage();
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
            {t('landing.verification_standard.title')}
          </h2>
          <p className="text-lg md:text-xl text-zinc-400 font-medium mb-6">
            {t('landing.verification_standard.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
          {/* Club Card 1 */}
          <div className="bg-black border border-white/10 rounded-2xl p-6 md:p-8 group hover:border-gold/50 transition-colors duration-300">
            <div className="flex justify-between items-start mb-6">
              <span className="px-3 py-1 bg-gold text-black text-[10px] font-bold uppercase tracking-widest rounded-sm">
                Barcelona
              </span>
              <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">{t('landing.verification_standard.cards.barcelona.name')}</h3>
            <div className="space-y-2 mb-8 text-sm text-zinc-400 font-medium">
              <p>{t('landing.verification_standard.cards.barcelona.line_1')}</p>
              <p><span className="text-zinc-300">{t('landing.verification_standard.labels.visitor_policy')}</span> {t('landing.verification_standard.cards.barcelona.visitor_policy')}</p>
              <p><span className="text-zinc-300">{t('landing.verification_standard.labels.response_time')}</span> {t('landing.verification_standard.cards.barcelona.response_time')}</p>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gold mb-8">
              <CheckCircle2 className="w-4 h-4" /> {t('landing.verification_standard.verified_badge')}
            </div>
            <Link href={`/${language}/clubs`} className="text-white hover:text-gold text-sm font-bold flex items-center gap-2 transition-colors">
              {t('landing.verification_standard.view_profile')} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Club Card 2 */}
          <div className="bg-black border border-white/10 rounded-2xl p-6 md:p-8 group hover:border-gold/50 transition-colors duration-300">
            <div className="flex justify-between items-start mb-6">
              <span className="px-3 py-1 bg-gold text-black text-[10px] font-bold uppercase tracking-widest rounded-sm">
                Madrid
              </span>
              <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">{t('landing.verification_standard.cards.madrid.name')}</h3>
            <div className="space-y-2 mb-8 text-sm text-zinc-400 font-medium">
              <p>{t('landing.verification_standard.cards.madrid.line_1')}</p>
              <p><span className="text-zinc-300">{t('landing.verification_standard.labels.visitor_policy')}</span> {t('landing.verification_standard.cards.madrid.visitor_policy')}</p>
              <p><span className="text-zinc-300">{t('landing.verification_standard.labels.response_time')}</span> {t('landing.verification_standard.cards.madrid.response_time')}</p>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gold mb-8">
              <CheckCircle2 className="w-4 h-4" /> {t('landing.verification_standard.verified_badge')}
            </div>
            <Link href={`/${language}/clubs`} className="text-white hover:text-gold text-sm font-bold flex items-center gap-2 transition-colors">
              {t('landing.verification_standard.view_profile')} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Coming Next Card */}
          <div className="bg-black/50 border-2 border-dashed border-white/10 rounded-2xl p-6 md:p-8 flex flex-col justify-center items-center text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(var(--gold)/0.05),transparent)] pointer-events-none" />
            <div className="relative z-10 w-full">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gold mb-2">{t('landing.verification_standard.next_verified')}</p>
              <p className="text-xl font-bold text-white mb-8">{t('landing.verification_standard.next_week')}</p>
              
              {isSubmitted ? (
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400 text-sm font-bold">
                  {t('landing.verification_standard.subscribe_success')}
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex flex-col gap-3 w-full">
                  <input
                    type="email"
                    placeholder={t('landing.verification_standard.email_placeholder')}
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all"
                  />
                  <button
                    type="submit"
                    className="w-full px-4 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-lg text-sm transition-colors border border-white/5"
                  >
                    {t('landing.verification_standard.notify_me')}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <Link href={`/${language}/clubs`} className="inline-flex items-center gap-2 text-zinc-500 hover:text-white font-bold uppercase tracking-widest text-xs transition-colors">
            {t('landing.verification_standard.view_full_directory')} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
