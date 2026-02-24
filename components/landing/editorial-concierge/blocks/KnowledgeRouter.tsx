 'use client';

import React from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { trackEvent } from '@/lib/analytics';
import { SectionWrapper } from '../layout/SectionWrapper';
import { EditorialHeading } from '../typography/EditorialHeading';
import { ConciergeLabel } from '../typography/ConciergeLabel';
import { BentoCard } from '../interactive/BentoCard';
import { Search } from 'lucide-react';

const TOPICS = [
  { id: 'laws', title: 'Laws', desc: "Spain's rules, fines, and what 'private' really means.", size: 'large' as const, img: '/images/topics/laws.webp', href: '/editorial/legal' },
  { id: 'cbd', title: 'CBD', desc: 'Labels, legality context, and common myths.', size: 'small' as const, img: '/images/topics/cbd.webp', href: '/editorial' },
  { id: 'products', title: 'Products', desc: 'Edibles, vapes, concentrates: risks and safer choices.', size: 'small' as const, img: '/images/topics/products.webp', href: '/safety' },
  { id: 'body', title: 'Body', desc: 'Onset times, anxiety, tolerance, and effects.', size: 'medium' as const, img: '/images/topics/body.webp', href: '/safety' },
  { id: 'plant', title: 'Plant', desc: 'Cannabinoids and terpenes, explained.', size: 'medium' as const, img: '/images/topics/plant.webp', href: '/editorial' },
  { id: 'history', title: 'History', desc: "How Spain's club model happened.", size: 'small' as const, img: '/images/topics/history.webp', href: '/editorial/culture' },
  { id: 'dictionary', title: 'Dictionary', desc: "Every term you'll see online, decoded.", size: 'small' as const, img: '/images/topics/dictionary.webp', href: '/editorial' },
  { id: 'start', title: 'First time? Start here', desc: 'Practical safety-first basics.', size: 'large' as const, img: '/images/topics/start.webp', href: '/safety' },
];

export function KnowledgeRouter() {
  const [query, setQuery] = useState('');
  const router = useRouter();

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
    <SectionWrapper>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
        <div className="max-w-2xl">
          <ConciergeLabel className="mb-4 text-emerald-600">Knowledge Hub</ConciergeLabel>
          <EditorialHeading size="xl">What would you like to learn about?</EditorialHeading>
        </div>
        
        <form onSubmit={handleSubmit} className="relative group w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-emerald-500 transition-colors" />
          <label htmlFor="knowledge-router-search" className="sr-only">Search the knowledge vault</label>
          <input 
            id="knowledge-router-search"
            type="text" 
            placeholder="Search the Knowledge Vault..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="w-full bg-white border border-zinc-200 rounded-full py-4 pl-12 pr-6 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all"
          />
        </form>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[200px] md:auto-rows-[240px] gap-4 md:gap-6">
        {TOPICS.map((topic) => (
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
