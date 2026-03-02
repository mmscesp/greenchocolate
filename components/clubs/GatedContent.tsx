'use client';

import React from 'react';
import { Fingerprint, ArrowRight } from '@/lib/icons';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useLanguage } from '@/hooks/useLanguage';

interface Props {
  blurLevel?: 'medium' | 'heavy';
  label?: string;
  description?: string;
}

export default function GatedContent({ 
  blurLevel = 'heavy', 
  label,
  description
}: Props) {
  const { language, t } = useLanguage();
  const withLocale = (path: string) => `/${language}${path}`;
  const computedLabel = label ?? t('clubs.gated.label');
  const computedDescription = description ?? t('clubs.gated.description');
  const blurClass = blurLevel === 'heavy' ? 'blur-xl' : 'blur-lg';
  
  return (
    <div className="relative overflow-hidden rounded-[2rem] group border border-white/5 bg-[#0A0A0A]">
      {/* Blurred Background Content */}
      <div className={`${blurClass} select-none pointer-events-none opacity-10 p-8`}>
        <div className="space-y-4">
           <div className="h-6 w-3/4 bg-[#E8A838]/10 rounded-lg"></div>
           <div className="h-4 w-1/2 bg-[#E8A838]/10 rounded-lg"></div>
           <div className="h-4 w-full bg-[#E8A838]/10 rounded-lg"></div>
           <div className="h-4 w-5/6 bg-[#E8A838]/10 rounded-lg"></div>
           <div className="h-10 w-full bg-[#E8A838]/10 rounded-xl mt-6"></div>
        </div>
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[2px] z-10 p-6 text-center">
         <div className="bg-[#0A0A0A]/95 backdrop-blur-md p-8 sm:p-10 rounded-[2.5rem] border border-white/10 shadow-2xl max-w-md w-full relative overflow-hidden">
            {/* Decorative background element */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#E8A838]/5 rounded-full blur-3xl" />
            
            <div className="relative z-10">
              <div className="mx-auto w-16 h-16 bg-[#E8A838]/10 rounded-2xl flex items-center justify-center mb-6 border border-[#E8A838]/20">
                <Fingerprint className="h-8 w-8 text-[#E8A838]" />
              </div>
              
              <h3 className="font-serif text-2xl text-white mb-3 tracking-tight">{computedLabel}</h3>
              <p className="text-sm text-zinc-500 mb-8 leading-relaxed font-serif italic">
                {computedDescription}
              </p>
              
              <div className="grid gap-4">
                <Button className="w-full py-7 bg-[#E8A838] text-black font-black rounded-full uppercase tracking-[0.2em] text-[10px] group/btn shadow-[0_8px_20px_-10px_rgba(232,168,56,0.4)] hover:bg-[#d4962e] transition-all" asChild>
                  <Link href={withLocale('/account/register')}>
                    <span>{t('clubs.gated.initiate_verification')}</span>
                    <ArrowRight className="h-3.5 w-3.5 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                
                <div className="flex items-center justify-center gap-4 mt-2">
                  <Link href={withLocale('/account/login')} className="text-[10px] font-bold text-zinc-500 hover:text-[#E8A838] uppercase tracking-widest transition-colors">
                    {t('clubs.gated.member_login')}
                  </Link>
                  <div className="w-1 h-1 bg-white/10 rounded-full" />
                  <Link href={withLocale('/editorial/legal')} className="text-[10px] font-bold text-zinc-500 hover:text-[#E8A838] uppercase tracking-widest transition-colors">
                    {t('clubs.gated.legal_faq')}
                  </Link>
                </div>
              </div>
            </div>
         </div>
      </div>
    </div>
  );
}
