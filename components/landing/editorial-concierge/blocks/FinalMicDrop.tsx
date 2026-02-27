'use client';

import React from 'react';
import Link from 'next/link';
import { SectionWrapper } from '../layout/SectionWrapper';
import { EditorialHeading } from '../typography/EditorialHeading';
import { ConciergeLabel } from '../typography/ConciergeLabel';
import { useLanguage } from '@/hooks/useLanguage';
// import { MagneticButton } from '../interactive/MagneticButton';

export function FinalMicDrop() {
  const { t } = useLanguage();

  return (
    <SectionWrapper glass className="min-h-[90vh] flex items-center justify-center text-center py-0" container={false}>
      {/* Cinematic Background Image Placeholder */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black/60 z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black z-10" />
        <div className="w-full h-full bg-zinc-900" />
      </div>

      <div className="relative z-20 max-w-5xl px-4 sm:px-6">
        <ConciergeLabel emphasis="high" size="md" className="mb-8 block tracking-[0.4em]">{t('landing.final.label')}</ConciergeLabel>
        <EditorialHeading size="2xl" className="text-white mb-12">{t('landing.final.title_line_1')} <br />{t('landing.final.title_line_2')}</EditorialHeading>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
          <Link href="/safety" className="w-full sm:w-auto min-h-11 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-8 sm:px-12 py-3 sm:py-6 rounded-full transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-emerald-500/20 text-base sm:text-lg uppercase tracking-widest text-center">
            {t('landing.final.cta_safety')}
          </Link>
          <Link href="/editorial" className="w-full sm:w-auto min-h-11 bg-emerald-500/10 hover:bg-emerald-500/20 backdrop-blur-md text-white border border-emerald-500/25 font-bold px-8 sm:px-12 py-3 sm:py-6 rounded-full transition-all hover:scale-105 active:scale-95 text-base sm:text-lg uppercase tracking-widest text-center">
            {t('landing.final.cta_editorial')}
          </Link>
        </div>

        <p className="mt-16 text-zinc-500 font-mono text-xs uppercase tracking-widest">
          {t('landing.final.footer_badge')}
        </p>
      </div>
    </SectionWrapper>
  );
}
