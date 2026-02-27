'use client';

import React from 'react';
import { SectionWrapper } from '../layout/SectionWrapper';
import { EditorialHeading } from '../typography/EditorialHeading';
import { ConciergeLabel } from '../typography/ConciergeLabel';
import { CheckCircle2, ShieldCheck, Fingerprint, Lock } from '@/lib/icons';
import { useLanguage } from '@/hooks/useLanguage';

const ICONS: Record<string, React.ElementType> = {
  ShieldCheck,
  Lock,
  Fingerprint,
};

export function VerificationStandard() {
  const { t } = useLanguage();

  const verifyItems = [
    { title: t('landing.verification.items.legal.title'), desc: t('landing.verification.items.legal.desc'), iconName: 'ShieldCheck' },
    { title: t('landing.verification.items.privacy.title'), desc: t('landing.verification.items.privacy.desc'), iconName: 'Lock' },
    { title: t('landing.verification.items.transparency.title'), desc: t('landing.verification.items.transparency.desc'), iconName: 'Fingerprint' },
  ];

  const verifyList = [
    t('landing.verification.list.verify.1'),
    t('landing.verification.list.verify.2'),
    t('landing.verification.list.verify.3'),
    t('landing.verification.list.verify.4'),
  ];

  const cannotGuaranteeList = [
    t('landing.verification.list.cannot.1'),
    t('landing.verification.list.cannot.2'),
    t('landing.verification.list.cannot.3'),
  ];

  return (
    <SectionWrapper glass>
      <div className="grid lg:grid-cols-2 gap-10 sm:gap-12 lg:gap-20 items-center">
        <div>
          <ConciergeLabel className="text-emerald-600 mb-6">{t('landing.verification.label')}</ConciergeLabel>
          <EditorialHeading size="xl" className="mb-8">{t('landing.verification.title')}</EditorialHeading>
          <p className="text-lg text-zinc-500 leading-relaxed mb-12">
            {t('landing.verification.description_line_1')}
            {' '}
            {t('landing.verification.description_line_2')}
          </p>
          
          <div className="space-y-8">
            {verifyItems.map((item, i) => {
              const Icon = ICONS[item.iconName] || ShieldCheck;
              return (
                <div key={i} className="flex gap-6">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0 border border-emerald-100">
                    <Icon className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-zinc-900 mb-1">{item.title}</h4>
                    <p className="text-sm text-zinc-500">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-zinc-900 rounded-[3rem] p-6 sm:p-8 lg:p-14 text-white relative overflow-hidden min-h-[320px] sm:min-h-[420px] lg:min-h-[480px] flex flex-col justify-center">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{ 
              backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.2) 1px, transparent 0)', 
              backgroundSize: '32px 32px' 
            }} />
          </div>
          
          <div className="relative z-10">
            <ConciergeLabel emphasis="high" className="mb-12 block">{t('landing.verification.forensic_label')}</ConciergeLabel>
            
            <div className="space-y-8">
              <div className="pb-8 border-b border-white/10">
                <h4 className="font-serif text-xl mb-4 text-emerald-400 font-bold">{t('landing.verification.what_we_verify')}</h4>
                <ul className="space-y-3">
                  {verifyList.map((s) => (
                    <li key={s} className="flex items-center gap-3 text-sm text-zinc-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" /> {s}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="font-serif text-xl mb-4 text-zinc-400 font-bold">{t('landing.verification.what_we_cannot_guarantee')}</h4>
                <ul className="space-y-3 opacity-60">
                  {cannotGuaranteeList.map((s) => (
                    <li key={s} className="flex items-center gap-3 text-sm text-zinc-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-zinc-600" /> {s}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
