'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';

export function FinalMicDrop() {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section className="bg-black min-h-[100dvh] flex items-center justify-center text-center py-20 px-4 relative overflow-hidden">
      {/* Pure black background, minimalist approach */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.15),transparent_70%)]" />

      <div className="relative z-20 max-w-3xl w-full mx-auto">
        <h2 className="text-[12vw] md:text-[7rem] font-black font-serif text-white tracking-tighter leading-none mb-6">
          {t('landing.final_mic_drop.title')}
        </h2>
        
        <p className="text-xl md:text-2xl text-zinc-400 font-medium mb-16">
          {t('landing.final_mic_drop.subtitle')}
        </p>

        <div className="max-w-md mx-auto w-full">
          {submitted ? (
            <div className="text-emerald-400 font-bold text-xl py-6">
              {t('landing.final_mic_drop.success')}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input
                type="email"
                required
                placeholder={t('landing.final_mic_drop.email_placeholder')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-6 py-5 bg-white/5 border border-white/10 rounded-xl text-xl text-center text-white placeholder:text-zinc-600 focus:outline-none focus:border-gold transition-all"
              />
              <button
                type="submit"
                className="w-full px-8 py-5 bg-gold hover:bg-gold-dark text-black font-black text-xl rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              >
                {t('landing.final_mic_drop.cta')}
              </button>
            </form>
          )}
        </div>

        <p className="mt-12 text-zinc-600 text-xs font-bold uppercase tracking-widest">
          {t('landing.final_mic_drop.disclaimer')}
        </p>
      </div>
    </section>
  );
}
