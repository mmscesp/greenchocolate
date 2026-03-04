'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useLanguage } from '@/hooks/useLanguage';
import { ArrowRight, MapPin } from '@/lib/icons';

export function KnowledgeRouter() {
  const { language, t } = useLanguage();

  const events = [
    {
      date: 'APR 17–19',
      name: 'Spannabis Bilbao 2026',
      location: 'Bilbao, Spain',
      desc: t('landing.knowledge_router.events.spannabis.description'),
      href: `/${language}/editorial/spannabis-bilbao-2026`
    },
    {
      date: 'APR 13–15',
      name: 'ICBC Berlin 2026',
      location: 'Berlin, Germany',
      desc: t('landing.knowledge_router.events.icbc.description'),
      href: `/${language}/editorial/icbc-berlin-2026`
    },
    {
      date: 'MAY 26–27',
      name: 'Cannabis Europa London 2026',
      location: 'London, UK',
      desc: t('landing.knowledge_router.events.europa.description'),
      href: `/${language}/editorial/cannabis-europa-london-2026`
    }
  ];

  return (
    <section className="bg-bg-surface py-16 md:py-20 px-4 md:px-8 border-t border-white/10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h2 className="text-2xl md:text-3xl font-black font-serif text-white tracking-tight mb-2">
              {t('landing.knowledge_router.title')}
            </h2>
            <p className="text-zinc-300 font-medium">
              {t('landing.knowledge_router.subtitle')}
            </p>
          </div>
          <Link
            href={`/${language}/events`}
            className="hidden md:inline-flex items-center gap-2 text-zinc-400 hover:text-brand font-bold uppercase tracking-widest text-xs transition-colors"
          >
            {t('landing.knowledge_router.full_events')} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {events.map((event, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group bg-bg-card border border-white/10 hover:border-brand/50 rounded-xl p-5 md:p-6 transition-colors shadow-sm hover:shadow-md"
            >
              <div className="mb-4">
                <span className="inline-block px-3 py-1 bg-brand/15 border border-brand/30 text-brand text-[10px] font-bold uppercase tracking-widest rounded-sm">
                  {event.date}
                </span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-brand transition-colors">
                {event.name}
              </h3>
              <div className="flex items-center gap-1.5 text-zinc-400 text-sm font-medium mb-4">
                <MapPin className="w-3.5 h-3.5" />
                {event.location}
              </div>
              <p className="text-zinc-300 text-sm mb-6">
                {event.desc}
              </p>
              <Link
                href={event.href}
                className="inline-flex items-center gap-2 text-zinc-100 font-bold text-sm hover:text-brand hover:translate-x-1 transition-transform transition-colors"
              >
                {t('landing.knowledge_router.read_guide')} <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 text-center md:hidden">
          <Link
            href={`/${language}/events`}
            className="inline-flex items-center gap-2 text-zinc-400 hover:text-brand font-bold uppercase tracking-widest text-xs transition-colors"
          >
            {t('landing.knowledge_router.full_events')} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
