'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, ShieldCheck, Lock } from '@/lib/icons';
import { trackEvent } from '@/lib/analytics';
import { useLanguage } from '@/hooks/useLanguage';
import { SectionWrapper } from '../layout/SectionWrapper';
import { EditorialHeading } from '../typography/EditorialHeading';
import { ConciergeLabel } from '../typography/ConciergeLabel';

export function WhoWeAre() {
  const { t } = useLanguage();

  const promises = [
    {
      icon: ShieldCheck,
      title: t('landing.story.promise.1.title'),
      desc: t('landing.story.promise.1.desc'),
    },
    {
      icon: Lock,
      title: t('landing.story.promise.2.title'),
      desc: t('landing.story.promise.2.desc'),
    },
    {
      icon: CheckCircle2,
      title: t('landing.story.promise.3.title'),
      desc: t('landing.story.promise.3.desc'),
    },
  ];

  return (
    <SectionWrapper glass>
      <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
        {/* Left Side: The Human Soul */}
        <div className="space-y-8">
          <div>
            <ConciergeLabel className="text-emerald-600 mb-6">{t('landing.story.label')}</ConciergeLabel>
            <EditorialHeading size="xl" className="mb-8 leading-[1.1]">{t('landing.story.title')}</EditorialHeading>
            <p className="text-lg sm:text-xl text-zinc-500 leading-relaxed max-w-lg">
              {t('landing.story.body')}
            </p>
          </div>

          <div className="flex items-center gap-4 pt-2">
            <div className="h-px w-8 bg-zinc-300" />
            <p className="text-sm font-bold text-zinc-900 tracking-wide uppercase">
              {t('landing.story.signature')}
            </p>
          </div>

          <div className="pt-6">
            <Link
              href="/safety"
              className="group inline-flex items-center justify-center gap-3 rounded-full bg-emerald-600 text-white px-8 py-4 font-bold text-base hover:bg-emerald-700 transition-all duration-300 shadow-[0_8px_30px_rgba(13,115,119,0.2)] hover:shadow-[0_10px_40px_rgba(13,115,119,0.3)] hover:-translate-y-0.5"
              onClick={() => {
                trackEvent('landing_story_primary_cta_click', {
                  destination: '/safety',
                });
              }}
            >
              {t('landing.story.cta_primary')}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Right Side: The Ironclad Promise (Dark Ledger) */}
        <div className="w-full relative">
          <motion.div
            className="relative overflow-hidden rounded-[2.5rem] bg-zinc-950 text-white p-8 sm:p-10 border border-white/10 shadow-2xl group"
            whileHover={{ y: -6 }}
            transition={{ type: 'spring', stiffness: 300, damping: 24 }}
          >
            {/* Ambient Background Glow */}
            <div className="absolute top-0 right-0 -mr-24 -mt-24 w-80 h-80 rounded-full bg-emerald-500/10 blur-[80px] opacity-60 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            
            <div className="relative z-10">
              <h3 className="font-serif text-2xl sm:text-3xl text-emerald-400 mb-10 font-bold tracking-tight">
                {t('landing.story.promise.title')}
              </h3>

              <div className="space-y-8">
                {promises.map((promise, idx) => (
                  <div key={idx} className="flex items-start gap-5">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                      <promise.icon className="w-5 h-5 text-emerald-500" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-white mb-1">{promise.title}</h4>
                      <p className="text-zinc-400 text-sm leading-relaxed">{promise.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </SectionWrapper>
  );
}
