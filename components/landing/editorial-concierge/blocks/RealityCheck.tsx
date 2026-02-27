'use client';

import React from 'react';
import { SectionWrapper } from '../layout/SectionWrapper';
import { EditorialHeading } from '../typography/EditorialHeading';
import { ConciergeLabel } from '../typography/ConciergeLabel';
import { StickyAccordion } from '../interactive/StickyAccordion';
import { useLanguage } from '@/hooks/useLanguage';

export function RealityCheck() {
  const { t } = useLanguage();

  const realityItems = [
    {
      title: t('landing.reality.items.walkins.title'),
      desc: t('landing.reality.items.walkins.desc'),
      iconName: 'ShieldCheck',
      color: 'from-emerald-500 to-teal-600',
    },
    {
      title: t('landing.reality.items.public.title'),
      desc: t('landing.reality.items.public.desc'),
      iconName: 'AlertTriangle',
      color: 'from-red-500 to-rose-600',
    },
    {
      title: t('landing.reality.items.discretion.title'),
      desc: t('landing.reality.items.discretion.desc'),
      iconName: 'MapPin',
      color: 'from-blue-500 to-indigo-600',
    },
    {
      title: t('landing.reality.items.promoters.title'),
      desc: t('landing.reality.items.promoters.desc'),
      iconName: 'ShieldCheck',
      color: 'from-amber-500 to-orange-600',
    },
  ];

  return (
    <SectionWrapper glass className="pt-32 pb-48">
      <div className="max-w-3xl mb-24">
        <ConciergeLabel className="text-red-500 mb-6">{t('landing.reality.label')}</ConciergeLabel>
        <EditorialHeading size="2xl" className="text-white">{t('landing.reality.title_prefix')} <span className="italic text-red-500">{t('landing.reality.title_emphasis')}</span> {t('landing.reality.title_suffix')}</EditorialHeading>
      </div>

      <StickyAccordion items={realityItems} />
    </SectionWrapper>
  );
}
