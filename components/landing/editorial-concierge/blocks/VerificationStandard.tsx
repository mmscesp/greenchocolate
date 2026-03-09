'use client';

import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/hooks/useLanguage';
import { CheckCircle2, ArrowRight } from '@/lib/icons';
import { deliverEditorialDigestLead } from '@/app/actions/lead-capture';

export function VerificationStandard() {
  const { language, t } = useLanguage();
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion();
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    const fallbackPath = `/${language}/clubs`;
    setIsSubmitting(true);

    try {
      const result = await deliverEditorialDigestLead({
        email: email.trim(),
        locale: language,
        primaryHref: fallbackPath,
        primaryLabel: t('landing.verification_standard.view_full_directory'),
        source: 'verification_standard',
      });

      if (result.deliveryMode === 'direct') {
        setIsSubmitting(false);
        router.push(result.fallbackPath);
        return;
      }

      setIsSubmitted(true);
    } catch (error) {
      console.error('Verification standard signup failed:', error);
      setIsSubmitting(false);
      router.push(fallbackPath);
      return;
    }

    setIsSubmitting(false);
  };

  return (
    <section className="bg-bg-base py-24 md:py-32 px-4 md:px-8 overflow-hidden relative">
      <div className="max-w-7xl mx-auto">
        {/* [motion] */}
        <motion.div
          className="text-center mb-16 max-w-3xl mx-auto"
          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
          whileInView={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <h2 className="text-3xl md:text-5xl font-black font-serif text-white tracking-tight mb-4">
            {t('landing.verification_standard.title')}
          </h2>
          <p className="text-lg md:text-xl text-zinc-300 font-medium mb-6">
            {t('landing.verification_standard.subtitle')}
          </p>
        </motion.div>

        {/* [motion] */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
          {/* Club Card 1 */}
          <motion.div
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
            whileInView={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.35, delay: 0.04, ease: [0.25, 0.1, 0.25, 1] }}
            whileHover={shouldReduceMotion ? undefined : { y: -3, boxShadow: '0 8px 30px rgba(0,0,0,0.10)' }}
            style={{ willChange: shouldReduceMotion ? undefined : 'transform' }}
            className="bg-bg-card border border-white/10 rounded-2xl p-6 md:p-8 group hover:border-brand/50 transition-colors duration-300"
          >
            <div className="flex justify-between items-start mb-6">
              <span className="px-3 py-1 bg-brand text-bg-base text-[10px] font-bold uppercase tracking-widest rounded-sm">
                {t('landing.verification_standard.cards.barcelona.city_badge')}
              </span>
              <div className="w-2 h-2 rounded-full bg-brand shadow-[0_0_10px_hsl(var(--brand)/0.5)]" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">{t('landing.verification_standard.cards.barcelona.name')}</h3>
            <div className="space-y-2 mb-8 text-sm text-zinc-400 font-medium">
              <p>{t('landing.verification_standard.cards.barcelona.line_1')}</p>
              <p><span className="text-zinc-300">{t('landing.verification_standard.labels.visitor_policy')}</span> {t('landing.verification_standard.cards.barcelona.visitor_policy')}</p>
              <p><span className="text-zinc-300">{t('landing.verification_standard.labels.response_time')}</span> {t('landing.verification_standard.cards.barcelona.response_time')}</p>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-brand mb-8">
              <CheckCircle2 className="w-4 h-4" /> {t('landing.verification_standard.verified_badge')}
            </div>
            <Link href={`/${language}/clubs/club-311-barcelona`} className="text-white hover:text-brand text-sm font-bold flex items-center gap-2 transition-colors">
              {t('landing.verification_standard.view_profile')} <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          {/* Coming Next Card */}
          <motion.div
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
            whileInView={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.35, delay: 0.08, ease: [0.25, 0.1, 0.25, 1] }}
            whileHover={shouldReduceMotion ? undefined : { y: -3, boxShadow: '0 8px 30px rgba(0,0,0,0.10)' }}
            style={{ willChange: shouldReduceMotion ? undefined : 'transform' }}
            className="bg-bg-surface border-2 border-dashed border-white/10 rounded-2xl p-6 md:p-8 flex flex-col justify-center items-center text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(var(--brand)/0.08),transparent)] pointer-events-none" />
            <div className="relative z-10 w-full">
              <p className="text-[10px] font-bold uppercase tracking-widest text-brand mb-2">{t('landing.verification_standard.next_verified')}</p>
              <p className="text-xl font-bold text-white mb-8">{t('landing.verification_standard.next_week')}</p>
              
              {isSubmitted ? (
                <div className="p-4 bg-brand/10 border border-brand/30 rounded-lg text-brand text-sm font-bold">
                  {t('landing.verification_standard.subscribe_success')}
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex flex-col gap-3 w-full">
                  <input
                    type="email"
                    name="email"
                    autoComplete="email"
                    placeholder={t('landing.verification_standard.email_placeholder')}
                    required
                    disabled={isSubmitting}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all"
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full px-4 py-3 bg-brand hover:bg-brand-dark text-bg-base font-bold rounded-lg text-sm transition-colors border border-brand/40"
                  >
                    {isSubmitting ? '...' : t('landing.verification_standard.notify_me')}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>

        <div className="mt-12 text-center">
          <Link href={`/${language}/clubs`} className="inline-flex items-center gap-2 text-zinc-400 hover:text-brand font-bold uppercase tracking-widest text-xs transition-colors">
            {t('landing.verification_standard.view_full_directory')} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
