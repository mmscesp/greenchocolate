'use client';

import React from 'react';
import Link from 'next/link';
import { SectionWrapper } from '../layout/SectionWrapper';
import { EditorialHeading } from '../typography/EditorialHeading';
import { ConciergeLabel } from '../typography/ConciergeLabel';
import { GlowingTimeline } from '../interactive/GlowingTimeline';
import { useLanguage } from '@/hooks/useLanguage';
// import { MagneticButton } from '../interactive/MagneticButton';

export function CommunityRoadmap() {
  const { t } = useLanguage();

  const phases = [
    {
      phase: t('landing.roadmap.phase_01'),
      title: t('landing.roadmap.phase_01_title'),
      desc: t('landing.roadmap.phase_01_desc'),
      status: 'active',
    },
    {
      phase: t('landing.roadmap.phase_02'),
      title: t('landing.roadmap.phase_02_title'),
      desc: t('landing.roadmap.phase_02_desc'),
      status: 'future',
    },
    {
      phase: t('landing.roadmap.phase_03'),
      title: t('landing.roadmap.phase_03_title'),
      desc: t('landing.roadmap.phase_03_desc'),
      status: 'future',
    },
    {
      phase: t('landing.roadmap.phase_04'),
      title: t('landing.roadmap.phase_04_title'),
      desc: t('landing.roadmap.phase_04_desc'),
      status: 'future',
    },
  ] as const;

  return (
    <SectionWrapper glass>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-14 sm:mb-24">
          <ConciergeLabel className="text-emerald-500 mb-6 block">{t('landing.roadmap.label')}</ConciergeLabel>
          <EditorialHeading size="xl" className="text-white">{t('landing.roadmap.title')}</EditorialHeading>
          <p className="text-zinc-400 text-lg mt-6">
            {t('landing.roadmap.description_line_1')}
            {' '}
            {t('landing.roadmap.description_line_2')}
          </p>
        </div>

        <div className="relative">
          <GlowingTimeline />
          
          <div className="space-y-16">
            {phases.map((item, i) => (
              <div key={i} className={`relative md:flex md:justify-between md:items-center ${i % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                {/* Visual Dot */}
                <div className={`absolute left-6 md:left-1/2 md:-ml-1.5 w-3 h-3 rounded-full border border-black z-20 ${item.status === 'active' ? 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.5)]' : 'bg-zinc-800'}`} />
                
                <div className="md:w-[45%] ml-12 md:ml-0">
                  <div className={`p-5 sm:p-8 rounded-[2rem] border transition-colors duration-700 ${item.status === 'active' ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-zinc-800 bg-zinc-900/30'}`}>
                    <ConciergeLabel emphasis={item.status === 'active' ? 'high' : 'low'} className="mb-2 block">{item.phase}</ConciergeLabel>
                    <h4 className="text-xl font-bold text-white mb-2">{item.title}</h4>
                    <p className="text-sm text-zinc-500 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-16 sm:mt-24 text-center">
        <Link href="/account/register" className="inline-flex min-h-11 items-center justify-center bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-8 sm:px-12 py-3 sm:py-6 rounded-full transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-emerald-500/20 text-base sm:text-lg uppercase tracking-widest">
          {t('landing.roadmap.cta')}
        </Link>
          <p className="mt-6 text-zinc-500 text-sm italic">
            {t('landing.roadmap.note')}
          </p>
        </div>
      </div>
    </SectionWrapper>
  );
}
