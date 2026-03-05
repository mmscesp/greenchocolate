import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Lock, AlertTriangle, ArrowRight, Shield, Check, X } from '@/lib/icons';
import { getDictionary } from '@/lib/dictionary';
import type { Locale } from '@/lib/i18n-config';
import { H1, H2, H3, Text, Lead, Eyebrow } from '@/components/typography';
import { Button } from '@/components/ui/button';
import { SafetyKitFunnel } from '@/components/landing/editorial-concierge/interactive/SafetyKitFunnel';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return {
    title: "The Spain Safety Kit — Free Download | SocialClubsMaps",
    description: "Free guide for travelers visiting Cannabis Social Clubs in Spain. Legal lines, scam red flags, first-visit etiquette, emergency numbers. Built by locals in Barcelona. Downloaded by 2,500+ travelers."
  };
}

interface SafetyKitLandingPageProps {
  params: Promise<{ lang: string }>;
}

export default async function SafetyKitLandingPage({ params }: SafetyKitLandingPageProps) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang as Locale);
  const t = (key: string) => {
    // Nested object support for the new dictionary structure
    const keys = key.split('.');
    let result: any = dictionary;
    for (const k of keys) {
      if (result && typeof result === 'object') {
        result = result[k];
      } else {
        return key;
      }
    }
    return result || key;
  };

  return (
    <div className="min-h-screen bg-bg-base text-white relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-bg-surface/40 via-bg-base to-bg-base pointer-events-none" />
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 right-0 w-[520px] h-[520px] bg-brand/5 blur-[130px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-[460px] h-[460px] bg-brand/5 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-14 md:pt-32 md:pb-24">
        
        {/* HERO SECTION */}
        <div className="grid lg:grid-cols-2 gap-14 items-center">
          <div>
            <Eyebrow variant="muted" className="mb-6 flex items-center gap-2 text-brand">
              <ShieldCheck className="h-4 w-4" />
              {t('safety_kit.eyebrow')}
            </Eyebrow>

            <H1 size="xl" className="mb-6 text-white font-serif tracking-tight">
              {t('safety_kit.title')}
            </H1>

            <Lead className="mb-6 text-brand font-medium">
              {t('safety_kit.subtitle')}
            </Lead>

            <Text className="mb-10 text-zinc-200 text-lg sm:text-xl leading-relaxed">
              {t('safety_kit.body')}
            </Text>
            
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-bg-base bg-bg-surface" />
                ))}
              </div>
              <Text size="sm" className="text-zinc-300 font-medium">
                {t('safety_kit.social_proof')}
              </Text>
            </div>
          </div>

          <div>
            <SafetyKitFunnel />
          </div>
        </div>
      </div>

      {/* TRUST STRIP */}
      <div className="border-y border-white/5 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 overflow-x-auto no-scrollbar">
          <div className="flex items-center justify-between min-w-max gap-8 opacity-70">
            {t('safety_kit.trust_strip').split('·').map((item: string, idx: number) => (
              <React.Fragment key={idx}>
                <Text size="sm" className="uppercase tracking-widest text-xs font-bold text-zinc-300 whitespace-nowrap">
                  {item.trim()}
                </Text>
                {idx < 4 && <div className="w-1 h-1 rounded-full bg-muted" />}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 space-y-32">
        
        {/* WHAT'S INSIDE SECTION */}
        <section className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <H2 size="lg" className="font-serif mb-4 text-white">{t('safety_kit.inside_title')}</H2>
            <Text className="text-zinc-200 text-lg max-w-2xl mx-auto leading-relaxed">{t('safety_kit.inside_subtitle')}</Text>
          </div>

          <div className="space-y-6">
            {[1, 2, 3, 4, 5].map((num) => (
              <div key={num} className="relative p-8 sm:p-10 rounded-3xl border border-white/10 bg-gradient-to-br from-bg-card/90 to-bg-base backdrop-blur-md hover:border-brand/50 transition-all duration-300 group overflow-hidden">
                {/* Large Background Number for premium feel */}
                <div className="absolute -top-6 -right-6 text-[120px] font-serif font-bold text-white/[0.03] group-hover:text-brand/[0.05] transition-colors pointer-events-none select-none leading-none">
                  0{num}
                </div>
                
                <div className="relative z-10">
                  <H3 size="md" className="text-brand font-serif mb-3 group-hover:text-brand-light transition-colors">
                    {t(`safety_kit.modules.${num}.title`)}
                  </H3>
                  <Text className="text-zinc-200 text-base sm:text-lg leading-relaxed">
                    {t(`safety_kit.modules.${num}.desc`)}
                  </Text>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* WHO IT'S FOR & WHAT IT'S NOT */}
        <section className="grid lg:grid-cols-2 gap-6 relative">
          {/* Decorative background glows */}
          <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-green-500/10 blur-[120px] rounded-full pointer-events-none -translate-y-1/2" />
          <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-red-500/10 blur-[120px] rounded-full pointer-events-none -translate-y-1/2" />

          {/* Built For You */}
          <div className="relative p-8 sm:p-10 lg:p-12 rounded-3xl border border-white/5 bg-gradient-to-b from-bg-card/90 to-bg-surface/80 backdrop-blur-xl shadow-2xl flex flex-col h-full overflow-hidden">
            {/* Top Green Accent Line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-green-500/50 to-transparent opacity-50" />
            
            <div className="mb-10">
              <div className="w-14 h-14 rounded-2xl bg-green-500/10 flex items-center justify-center border border-green-500/20 mb-6 shadow-[0_0_30px_-5px_rgba(34,197,94,0.15)]">
                <Check className="w-7 h-7 text-green-400" />
              </div>
              <H3 size="lg" className="font-serif text-white m-0 tracking-tight">{t('safety_kit.who_title')}</H3>
            </div>
            
            <ul className="space-y-6 flex-1">
              {t('safety_kit.who_bullets').map((bullet: string, idx: number) => (
                <li key={idx} className="flex gap-4 group">
                  <div className="mt-1 w-6 h-6 rounded-full bg-green-500/10 flex items-center justify-center border border-green-500/20 shrink-0 group-hover:bg-green-500/20 transition-colors">
                    <Check className="w-3 h-3 text-green-400" />
                  </div>
                  <Text className="text-zinc-200 leading-relaxed group-hover:text-white transition-colors">{bullet}</Text>
                </li>
              ))}
            </ul>
          </div>

          {/* What It Won't Do */}
          <div className="relative p-8 sm:p-10 lg:p-12 rounded-3xl border border-white/5 bg-gradient-to-b from-bg-card/90 to-bg-surface/80 backdrop-blur-xl shadow-2xl flex flex-col h-full overflow-hidden">
            {/* Top Red Accent Line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-red-500/50 to-transparent opacity-50" />

            <div className="mb-10">
              <div className="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center border border-red-500/20 mb-6 shadow-[0_0_30px_-5px_rgba(239,68,68,0.15)]">
                <X className="w-7 h-7 text-red-400" />
              </div>
              <H3 size="lg" className="font-serif text-white m-0 tracking-tight">{t('safety_kit.not_title')}</H3>
            </div>
            
            <ul className="space-y-6 mb-10 flex-1">
              {t('safety_kit.not_bullets').map((bullet: string, idx: number) => (
                <li key={idx} className="flex gap-4 group">
                  <div className="mt-1 w-6 h-6 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/20 shrink-0 group-hover:bg-red-500/20 transition-colors">
                    <X className="w-3 h-3 text-red-400" />
                  </div>
                  <Text className="text-zinc-200 leading-relaxed group-hover:text-white transition-colors">{bullet}</Text>
                </li>
              ))}
            </ul>

            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-brand/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <Text className="text-zinc-200 text-sm sm:text-base leading-relaxed relative z-10">
                {t('safety_kit.not_closing')}
              </Text>
            </div>
          </div>
        </section>

        {/* FROM THE TEAM */}
        <section className="text-center max-w-2xl mx-auto">
          <div className="w-12 h-12 rounded-full bg-brand/10 flex items-center justify-center mx-auto mb-6">
            <Shield className="w-6 h-6 text-brand" />
          </div>
          <Text className="text-xl md:text-2xl font-serif text-white italic leading-relaxed mb-6">
            {t('safety_kit.quote')}
          </Text>
          <Text size="sm" className="text-brand uppercase tracking-widest font-bold">
            {t('safety_kit.quote_author')}
          </Text>
        </section>

      </div>

      {/* FINAL CTA SECTION */}
      <div className="relative z-10 border-t border-white/10 bg-bg-surface py-20 md:py-32">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <H2 size="xl" className="font-serif mb-4">{t('safety_kit.final_headline')}</H2>
          <Lead className="text-brand mb-10">{t('safety_kit.final_body')}</Lead>
          
          <div className="max-w-md mx-auto">
            <SafetyKitFunnel />
          </div>
        </div>
      </div>

    </div>
  );
}
