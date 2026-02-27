 'use client';

import React from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { trackEvent } from '@/lib/analytics';
import { SectionWrapper } from '../layout/SectionWrapper';
import { EditorialHeading } from '../typography/EditorialHeading';
import { ConciergeLabel } from '../typography/ConciergeLabel';
import { BentoCard } from '../interactive/BentoCard';
import { Search } from '@/lib/icons';
import { useLanguage } from '@/hooks/useLanguage';

export function KnowledgeRouter() {
  const { t } = useLanguage();
  const [query, setQuery] = useState('');
  const router = useRouter();

  const topics = [
    { id: 'laws', title: t('landing.router.topics.laws.title'), desc: t('landing.router.topics.laws.desc'), size: 'large' as const, img: '/images/topics/laws.webp', href: '/editorial/legal' },
    { id: 'cbd', title: t('landing.router.topics.cbd.title'), desc: t('landing.router.topics.cbd.desc'), size: 'small' as const, img: '/images/topics/cbd.webp', href: '/editorial' },
    { id: 'products', title: t('landing.router.topics.products.title'), desc: t('landing.router.topics.products.desc'), size: 'small' as const, img: '/images/topics/products.webp', href: '/safety' },
    { id: 'body', title: t('landing.router.topics.body.title'), desc: t('landing.router.topics.body.desc'), size: 'medium' as const, img: '/images/topics/body.webp', href: '/safety' },
    { id: 'plant', title: t('landing.router.topics.plant.title'), desc: t('landing.router.topics.plant.desc'), size: 'medium' as const, img: '/images/topics/plant.webp', href: '/editorial' },
    { id: 'history', title: t('landing.router.topics.history.title'), desc: t('landing.router.topics.history.desc'), size: 'small' as const, img: '/images/topics/history.webp', href: '/editorial/culture' },
    { id: 'dictionary', title: t('landing.router.topics.dictionary.title'), desc: t('landing.router.topics.dictionary.desc'), size: 'small' as const, img: '/images/topics/dictionary.webp', href: '/editorial' },
    { id: 'start', title: t('landing.router.topics.start.title'), desc: t('landing.router.topics.start.desc'), size: 'large' as const, img: '/images/topics/start.webp', href: '/safety' },
  ];

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = query.trim();
    trackEvent('landing_knowledge_search_submit', {
      has_query: Boolean(trimmed),
      query_length: trimmed.length,
    });
    router.push(trimmed ? `/editorial?q=${encodeURIComponent(trimmed)}` : '/editorial');
  };

  return (
    <SectionWrapper glass>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
        <div className="max-w-2xl">
          <ConciergeLabel className="mb-4 text-emerald-600">{t('landing.router.label')}</ConciergeLabel>
          <EditorialHeading size="xl">{t('landing.router.title')}</EditorialHeading>
        </div>
        
        <form onSubmit={handleSubmit} className="relative group w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-emerald-500 transition-colors" />
          <label htmlFor="knowledge-router-search" className="sr-only">{t('landing.router.search_aria_label')}</label>
          <input 
            id="knowledge-router-search"
            type="text" 
            placeholder={t('landing.router.search_placeholder')}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="w-full bg-card border border-zinc-200 rounded-full py-4 pl-12 pr-6 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all"
          />
        </form>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[200px] md:auto-rows-[240px] gap-4 md:gap-6">
        {topics.map((topic) => (
          <BentoCard 
            key={topic.id}
            title={topic.title}
            desc={topic.desc}
            size={topic.size}
            imageSrc={topic.img}
            href={topic.href}
          />
        ))}
      </div>
    </SectionWrapper>
  );
}
