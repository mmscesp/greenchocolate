'use client';

import React from 'react';
import { ConciergeLabel } from '../typography/ConciergeLabel';
import { PulsingStatusDot } from '../interactive/PulsingStatusDot';
import { useLanguage } from '@/hooks/useLanguage';

export function TrustStrip() {
  const { t } = useLanguage();

  return (
    <div className="sticky top-16 z-40 w-full min-h-12 bg-black/90 backdrop-blur-xl border-b border-white/10 flex items-center py-1 shadow-lg transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full flex items-center justify-between gap-3">
        
        <div className="flex items-center gap-3 sm:gap-6 min-w-0">
          <div className="flex items-center gap-2">
            <PulsingStatusDot />
            <ConciergeLabel size="xs" emphasis="high" className="text-white truncate">{t('landing.trust.status_verified')}</ConciergeLabel>
            </div>
          <div className="hidden md:flex items-center gap-4 border-l border-white/10 pl-6">
            <ConciergeLabel size="xs" className="text-zinc-400">{t('landing.trust.last_audit')}</ConciergeLabel>
            <ConciergeLabel size="xs" className="text-emerald-400 font-medium">{t('landing.trust.education_first')}</ConciergeLabel>
            <ConciergeLabel size="xs" className="text-emerald-400 font-medium">{t('landing.trust.privacy_always')}</ConciergeLabel>
          </div>
        </div>
        
        <div className="hidden md:flex items-center gap-2 text-zinc-500">
          <ConciergeLabel size="xs" className="uppercase tracking-widest font-semibold text-[10px]">
            {t('landing.trust.no_brokerage')}
          </ConciergeLabel>
        </div>

      </div>
    </div>
  );
}
