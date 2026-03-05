'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/useLanguage';
import { EligibilityFlow } from '@/components/landing/editorial-concierge/interactive/EligibilityFlow';
import { Shield, AlertTriangle, Heart, Clock, ArrowRight, CheckCircle, Phone, MapPin, Users, Leaf, Brain, Activity } from '@/lib/icons';
import { Heading, H1, H2, H3, H4, Label, Eyebrow, Text, Lead } from '@/components/typography';

interface SafetyPageProps {
  params: Promise<{ lang: string }>;
}

const buildSafetyCategories = (t: (key: string) => string) => [
  {
    id: 'edibles',
    title: t('safety.categories.edibles.title'),
    description: t('safety.categories.edibles.description'),
    icon: Clock,
    color: 'bg-brand/10 text-brand border-brand/20',
    tips: [
      t('safety.categories.edibles.tips.1'),
      t('safety.categories.edibles.tips.2'),
      t('safety.categories.edibles.tips.3'),
      t('safety.categories.edibles.tips.4')
    ]
  },
  {
    id: 'first-time',
    title: t('safety.categories.first_visit.title'),
    description: t('safety.categories.first_visit.description'),
    icon: Users,
    color: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    tips: [
      t('safety.categories.first_visit.tips.1'),
      t('safety.categories.first_visit.tips.2'),
      t('safety.categories.first_visit.tips.3'),
      t('safety.categories.first_visit.tips.4')
    ]
  },
  {
    id: 'medical',
    title: t('safety.categories.medical.title'),
    description: t('safety.categories.medical.description'),
    icon: Activity,
    color: 'bg-red-500/10 text-red-600 border-red-500/20',
    tips: [
      t('safety.categories.medical.tips.1'),
      t('safety.categories.medical.tips.2'),
      t('safety.categories.medical.tips.3'),
      t('safety.categories.medical.tips.4')
    ]
  },
  {
    id: 'mental',
    title: t('safety.categories.mental.title'),
    description: t('safety.categories.mental.description'),
    icon: Brain,
    color: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
    tips: [
      t('safety.categories.mental.tips.1'),
      t('safety.categories.mental.tips.2'),
      t('safety.categories.mental.tips.3'),
      t('safety.categories.mental.tips.4')
    ]
  }
];

export default function SafetyPage({ params }: SafetyPageProps) {
  const { t } = useLanguage();
  const [lang, setLang] = useState('en');
  const [isLoading, setIsLoading] = useState(true);
  const safetyCategories = buildSafetyCategories(t);

  useEffect(() => {
    params.then(({ lang: resolvedLang }) => {
      setLang(resolvedLang);
      setTimeout(() => setIsLoading(false), 300);
    });
  }, [params]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg-base">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse space-y-8">
            <div className="h-64 bg-bg-surface rounded-3xl" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-48 bg-bg-surface rounded-2xl" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );

  }

  return (
    <div className="min-h-screen bg-bg-base text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-bg-surface/50 via-bg-base to-bg-surface/50 pointer-events-none" />
      {/* Background Effects - subtle */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-brand/5 to-transparent" />
        <div className="absolute top-[30%] right-[10%] h-[320px] w-[320px] rounded-full bg-brand/5 blur-[100px]" />
        <div className="absolute top-[30%] right-[10%] h-[320px] w-[320px] rounded-full bg-brand/5 blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 md:pt-32 pb-12 relative z-10">
        {/* Hero with Quiz */}
        <motion.section 
          className="rounded-3xl border border-white/10 bg-bg-card/70 backdrop-blur-sm shadow-2xl p-6 sm:p-8 md:p-12 mb-12 relative overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-brand/5 to-transparent pointer-events-none" />
          <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 relative z-10">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-brand/10 rounded-xl flex items-center justify-center border border-brand/20">
                  <Shield className="h-6 w-6 text-brand" />
                  <Shield className="h-6 w-6 text-brand" />
                </div>
                <Badge className="bg-brand text-bg-base border-none font-bold uppercase tracking-widest text-[10px]">
                  {t('safety.badge')}
                </Badge>
              </div>
              
              <H1 className="mb-6 text-white font-serif tracking-tight">
                {t('safety.title_prefix')}{' '}
                <span className="text-brand">
                  {t('safety.title_highlight')}
                </span>
              </H1>
              
              <Lead className="mb-8 text-zinc-400">
                {t('safety.subtitle')}
              </Lead>

              <div className="flex flex-wrap gap-3">
                {[t('safety.tags.evidence_based'), t('safety.tags.updated'), t('safety.tags.expert_reviewed')].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-500 bg-white/5 border border-white/10 px-4 py-2 rounded-full">
                    <CheckCircle className="h-4 w-4 text-brand" />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="w-full lg:w-[380px] shrink-0">
              <EligibilityFlow />
            </div>
          </div>
        </motion.section>

        {/* Safety Categories */}
        <section className="mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-12"
          >
            <H2 className="mb-3 text-white font-serif tracking-tight">
              {t('safety.essential_knowledge.title')}
            </H2>
            <Text variant="muted" className="text-zinc-400">
              {t('safety.essential_knowledge.subtitle')}
            </Text>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {safetyCategories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                className="rounded-2xl border border-white/10 bg-bg-card/70 backdrop-blur-sm p-6 sm:p-8 hover:border-brand/50 transition-all duration-500"
              >
                <div className="flex items-start gap-4 mb-6">
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center bg-brand/10 text-brand border border-brand/20`}>
                    <category.icon className="h-7 w-7" />
                  </div>
                  <div>
                    <H3 className="text-white font-serif">{category.title}</H3>
                    <Text size="sm" variant="muted" className="mt-2 text-zinc-400 line-clamp-2">
                      {category.description}
                    </Text>
                  </div>
                </div>

                <ul className="space-y-4 mt-6 border-t border-white/5 pt-6">
                  {category.tips.map((tip, tipIndex) => (
                    <li key={tipIndex} className="flex items-start gap-3 text-sm text-zinc-400">
                      <CheckCircle className="h-4 w-4 text-brand shrink-0 mt-0.5" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

        </section>

        {/* Emergency */}
        <motion.section 
          className="rounded-3xl border border-red-500/20 bg-red-500/5 p-6 sm:p-8 md:p-12 mb-12 relative overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <AlertTriangle className="h-48 w-48 text-red-600" />
          </div>
          <div className="flex items-start gap-4 mb-10 relative z-10">
            <div className="w-14 h-14 bg-red-500/10 rounded-xl flex items-center justify-center border border-red-500/20">
              <AlertTriangle className="h-7 w-7 text-red-500" />
            </div>
            <div>
              <H2 className="mb-2 text-white font-serif tracking-tight">{t('safety.emergency.title')}</H2>
              <Text variant="muted" className="text-zinc-400">
                {t('safety.emergency.subtitle')}
              </Text>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
            <div className="bg-bg-card/80 rounded-2xl p-6 sm:p-8 border border-white/5">
              <div className="flex items-center gap-3 mb-6">
                <Phone className="h-5 w-5 text-red-500" />
                <H3 className="font-bold text-white text-sm uppercase tracking-widest">{t('safety.emergency.eu.title')}</H3>
              </div>
              <Text className="text-5xl font-black text-red-500 mb-3 font-serif">112</Text>
              <Text size="sm" variant="muted" className="text-zinc-500">{t('safety.emergency.eu.description')}</Text>
            </div>

            <div className="bg-bg-card/80 rounded-2xl p-6 sm:p-8 border border-white/5">
              <div className="flex items-center gap-3 mb-6">
                <MapPin className="h-5 w-5 text-red-500" />
                <H3 className="font-bold text-white text-sm uppercase tracking-widest">{t('safety.emergency.hospitals.title')}</H3>
              </div>
              <ul className="space-y-3 text-sm text-zinc-400 font-medium">
                <li>{t('safety.emergency.hospitals.1')}</li>
                <li>{t('safety.emergency.hospitals.2')}</li>
              </ul>
            </div>

            <div className="bg-bg-card/80 rounded-2xl p-6 sm:p-8 border border-white/5">
              <div className="flex items-center gap-3 mb-6">
                <Users className="h-5 w-5 text-red-500" />
                <H3 className="font-bold text-white text-sm uppercase tracking-widest">{t('safety.emergency.police.title')}</H3>
              </div>
              <Text className="text-5xl font-black text-red-500 mb-3 font-serif">088</Text>
              <Text size="sm" variant="muted" className="text-zinc-500">{t('safety.emergency.police.description')}</Text>
            </div>
          </div>

        </motion.section>

        {/* CTA */}
        <motion.section 
          className="mt-12 rounded-3xl border border-white/10 bg-gradient-to-br from-brand/10 via-bg-surface/40 to-bg-surface/40 p-8 sm:p-12 relative overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 relative z-10">
            <div className="flex items-start sm:items-center gap-6">
              <div className="w-16 h-16 bg-brand/10 rounded-2xl flex items-center justify-center border border-brand/20 shrink-0">
                <Leaf className="h-8 w-8 text-brand" />
                <Leaf className="h-8 w-8 text-brand" />
              </div>
              <div>
                <H3 className="text-2xl font-bold text-white font-serif">{t('safety.cta.title')}</H3>
                <Text variant="muted" className="text-zinc-400 text-lg mt-1">{t('safety.cta.subtitle')}</Text>
              </div>
            </div>
            <div className="flex w-full sm:w-auto">
              <Button asChild className="w-full sm:w-auto min-h-14 px-10 bg-brand hover:bg-brand-dark text-bg-base font-bold rounded-full text-sm uppercase tracking-widest">
                <Link href={`/${lang}/clubs`}>
                  {t('safety.cta.button')} <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </motion.section>

      </div>
    </div>
  );
}
