'use client';

import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/hooks/useLanguage';
import { deliverEditorialDigestLead } from '@/app/actions/lead-capture';
import { ArrowRight } from '@/lib/icons';

export function FinalMicDrop() {
  const { t, language } = useLanguage();
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    const fallbackPath = `/${language}/editorial`;
    setIsSubmitting(true);

    try {
      const result = await deliverEditorialDigestLead({
        email: email.trim(),
        locale: language,
        primaryHref: fallbackPath,
        primaryLabel: t('landing.featured_vault.all_guides'),
        source: 'final_mic_drop',
      });

      if (result.deliveryMode === 'direct') {
        setIsSubmitting(false);
        router.push(result.fallbackPath);
        return;
      }

      setSubmitted(true);
    } catch (error) {
      console.error('Final mic drop signup failed:', error);
      setIsSubmitting(false);
      router.push(fallbackPath);
      return;
    }

    setIsSubmitting(false);
  };

  return (
    <section className="bg-[#0A0C10] min-h-[80vh] lg:min-h-[100dvh] flex items-center justify-center text-center py-20 md:py-32 px-4 relative overflow-hidden border-t border-white/5">
      {/* Brutalist atmospheric background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(var(--brand)/0.03),transparent_60%)] pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-32 bg-gradient-to-b from-brand/50 to-transparent opacity-50" />

      <div className="absolute left-4 md:left-8 top-8 bottom-8 flex flex-col justify-between items-center opacity-20 hidden md:flex">
        <span className="text-[10px] font-mono rotate-180" style={{ writingMode: 'vertical-rl' }}>[ EOF ]</span>
        <div className="w-px h-full bg-white/20 mx-auto my-4" />
        <span className="text-[10px] font-mono rotate-180" style={{ writingMode: 'vertical-rl' }}>[ END ]</span>
      </div>

      <div className="absolute right-4 md:right-8 top-8 bottom-8 flex flex-col justify-between items-center opacity-20 hidden md:flex">
        <span className="text-[10px] font-mono rotate-180" style={{ writingMode: 'vertical-rl' }}>[ 2026 ]</span>
        <div className="w-px h-full bg-white/20 mx-auto my-4" />
        <span className="text-[10px] font-mono rotate-180" style={{ writingMode: 'vertical-rl' }}>[ SCM ]</span>
      </div>

      <motion.div
        className="relative z-20 max-w-4xl w-full mx-auto"
        initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 30 }}
        whileInView={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="flex items-center justify-center gap-4 mb-8 md:mb-12 opacity-40">
          <div className="w-2 h-2 rounded-full bg-brand" />
          <div className="w-2 h-2 rounded-full bg-brand" />
          <div className="w-2 h-2 rounded-full bg-brand" />
        </div>

        <h2 className="text-5xl md:text-[6rem] lg:text-[8rem] font-black font-serif text-white tracking-tighter leading-[0.95] mb-8">
          {t('landing.final_mic_drop.title')}
        </h2>
        
        <p className="text-lg md:text-2xl lg:text-3xl text-white/40 font-serif italic mb-16 md:mb-24 max-w-2xl mx-auto leading-relaxed">
          {t('landing.final_mic_drop.subtitle')}
        </p>

        <div className="max-w-xl mx-auto w-full relative">
          {submitted ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center gap-4 py-8"
            >
              <div className="w-16 h-px bg-brand" />
              <p className="text-white font-serif text-2xl italic">
                {t('landing.final_mic_drop.success')}
              </p>
              <div className="w-16 h-px bg-brand" />
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-brand/20 via-brand/10 to-transparent rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
              
              <div className="relative flex flex-col md:flex-row items-center gap-4 md:gap-0 p-2 bg-white/[0.03] backdrop-blur-md rounded-[2rem] border border-white/10 group-hover:border-brand/30 transition-colors duration-500">
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  required
                  placeholder={t('landing.final_mic_drop.email_placeholder')}
                  value={email}
                  disabled={isSubmitting}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-6 py-4 md:py-5 bg-transparent text-base md:text-lg text-white placeholder:text-zinc-600 focus:outline-none disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full md:w-auto px-8 py-4 md:py-5 bg-brand hover:bg-brand-light text-black font-black uppercase tracking-[0.2em] text-[10px] md:text-xs rounded-[1.5rem] transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-3 shrink-0 group/btn"
                >
                  <span>{isSubmitting ? '...' : t('landing.final_mic_drop.cta')}</span>
                  {!isSubmitting && <ArrowRight className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform" />}
                </button>
              </div>
            </form>
          )}
        </div>

        <p className="mt-12 text-zinc-600 text-[10px] font-bold uppercase tracking-[0.3em]">
          {t('landing.final_mic_drop.disclaimer')}
        </p>
      </motion.div>
    </section>
  );
}
