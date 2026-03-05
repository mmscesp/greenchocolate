'use client';
import React from 'react';
import { SectionWrapper } from '../layout/SectionWrapper';
import { EditorialHeading } from '../typography/EditorialHeading';
import { ConciergeLabel } from '../typography/ConciergeLabel';
import { ArrowRight, AlertCircle, Info, ShieldCheck, Newspaper } from '@/lib/icons';
import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/hooks/useLanguage';

export function WeeklyIntelligence() {
  const { t } = useLanguage();
  const shouldReduceMotion = useReducedMotion();

  const intelligenceCards = [
    {
      title: t('landing.weekly.cards.legal.title'),
      content: t('landing.weekly.cards.legal.content'),
      icon: ShieldCheck,
      color: 'text-brand',
      bg: 'bg-brand/15',
    },
    {
      title: t('landing.weekly.cards.safety.title'),
      content: t('landing.weekly.cards.safety.content'),
      icon: AlertCircle,
      color: 'text-brand-light',
      bg: 'bg-brand/10',
    },
    {
      title: t('landing.weekly.cards.harm.title'),
      content: t('landing.weekly.cards.harm.content'),
      icon: Info,
      color: 'text-brand-dark',
      bg: 'bg-brand/20',
    },
  ];

  return (
    <SectionWrapper>
      <div className="max-w-5xl mx-auto">
        {/* [motion] */}
        <motion.div
          className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 mb-16"
          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
          whileInView={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <div>
            <ConciergeLabel className="text-brand mb-4 block">{t('landing.weekly.label')}</ConciergeLabel>
            <EditorialHeading size="xl">{t('landing.weekly.title')}</EditorialHeading>
          </div>
          <div className="flex items-center gap-3 px-6 py-3 rounded-full bg-brand/10 border border-brand/30">
            <Newspaper className="w-4 h-4 text-brand" />
            <ConciergeLabel size="xs" emphasis="high" className="text-brand">{t('landing.weekly.updated')}</ConciergeLabel>
          </div>
        </motion.div>

        {/* [motion] */}
        <motion.div
          className="grid md:grid-cols-3 gap-8"
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {intelligenceCards.map((item, i) => (
            <motion.div 
              key={i} 
              variants={{
                hidden: shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] } },
              }}
              className="group relative p-8 rounded-[2rem] bg-bg-card border border-white/10 hover:border-brand/40 transition-all duration-500 overflow-hidden cursor-pointer"
              whileHover={shouldReduceMotion ? undefined : { y: -3 }}
              transition={shouldReduceMotion ? { duration: 0.2 } : { duration: 0.2 }}
              style={{ willChange: shouldReduceMotion ? undefined : 'transform' }}
            >
              {/* Ambient Glow */}
              <div className="absolute -inset-1 bg-gradient-to-r from-brand/0 to-brand/0 rounded-[2.5rem] blur-xl opacity-0 group-hover:from-brand/10 group-hover:to-brand-light/10 group-hover:opacity-100 transition-all duration-500 -z-10" />

              <div className="relative z-10">
                <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-8 transition-transform duration-500 group-hover:scale-110", item.bg)}>
                  <item.icon className={cn("w-5 h-5", item.color)} />
                </div>
                <h4 className="text-xl font-bold text-white mb-4 transition-colors duration-500 group-hover:text-brand">{item.title}</h4>
                <p className="text-zinc-300 text-sm leading-relaxed transition-colors duration-500 group-hover:text-zinc-200">
                  {item.content}
                </p>
              </div>

              <div className="mt-8 pt-8 border-t border-white/10 relative z-10 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400 group-hover:text-brand transition-colors duration-500">
                {t('landing.weekly.read_context')}
                <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 text-brand group-hover:translate-x-1 transition-all duration-500" />
              </div>

              {/* Expanding Accent Line */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-gradient-to-r from-brand to-brand-light rounded-full group-hover:w-1/3 transition-all duration-500 z-20" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </SectionWrapper>
  );
}
