'use client';
import React from 'react';
import Link from 'next/link';
import { SectionWrapper } from '../layout/SectionWrapper';
import { EditorialHeading } from '../typography/EditorialHeading';
import { ConciergeLabel } from '../typography/ConciergeLabel';
import { motion } from 'framer-motion';
import { ArrowRight, Clock, User } from 'lucide-react';
import { type ArticleCard } from '@/app/actions/articles';
import { trackEvent } from '@/lib/analytics';

interface FeaturedVaultProps {
  articles: ArticleCard[];
}

export function FeaturedVault({ articles }: FeaturedVaultProps) {
  const fallbackArticles: ArticleCard[] = [
    {
      id: '1',
      title: 'Navigating the 2026 Spanish Regulatory Landscape',
      slug: 'is-weed-legal-barcelona-2026',
      excerpt: 'A detailed analysis of consumption regulations, administrative protocols, and member protections under current law.',
      category: 'Legal Framework',
      tags: ['legal', 'spain'],
      readTime: 12,
      authorName: 'Editorial Team',
      authorAvatar: null,
      heroImage: null,
      publishedAt: null,
      cityName: null,
      citySlug: null,
    },
    {
      id: '2',
      title: 'Health Protocols & Responsible Consumption',
      slug: 'safety-and-harm-reduction-basics',
      excerpt: 'Evidence-based guidelines on dosage, interaction risks, and maintaining a safe environment within private associations.',
      category: 'Harm Reduction',
      tags: ['safety', 'harm-reduction'],
      readTime: 10,
      authorName: 'Editorial Team',
      authorAvatar: null,
      heroImage: null,
      publishedAt: null,
      cityName: null,
      citySlug: null,
    },
    {
      id: '3',
      title: 'Data Protection & Member Anonymity',
      slug: 'privacy-and-member-anonymity',
      excerpt: 'Understanding how social clubs manage sensitive information and your rights regarding personal data in the digital age.',
      category: 'Privacy',
      tags: ['privacy', 'trust'],
      readTime: 7,
      authorName: 'Editorial Team',
      authorAvatar: null,
      heroImage: null,
      publishedAt: null,
      cityName: null,
      citySlug: null,
    }
  ];
  const displayArticles = articles.length > 0 ? articles : fallbackArticles;

  return (
    <SectionWrapper>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
        <div className="max-w-2xl">
          <ConciergeLabel className="mb-4 text-emerald-600">Knowledge Base</ConciergeLabel>
          <EditorialHeading size="xl">Safety, Law & Harm Reduction</EditorialHeading>
        </div>
        <Link
          href="/editorial"
          className="flex items-center gap-2 font-bold uppercase tracking-widest text-xs text-zinc-500 hover:text-emerald-600 transition-colors"
          onClick={() => {
            trackEvent('landing_featured_explore_archive_click', {
              destination: '/editorial',
            });
          }}
        >
          Explore Archive <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid md:grid-cols-3 gap-6 md:gap-8">
        {displayArticles.map((article) => (
          <Link
            key={article.id}
            href={article.slug ? `/editorial/${article.slug}` : '/editorial'}
            className="block"
            onClick={() => {
              trackEvent('landing_featured_article_click', {
                article_id: article.id,
                article_title: article.title,
                destination: article.slug ? `/editorial/${article.slug}` : '/editorial',
              });
            }}
          >
            <motion.div
              className="group relative p-5 sm:p-6 rounded-[2.5rem] bg-white border border-zinc-200/50 hover:border-emerald-500/30 transition-all duration-500 overflow-hidden"
              whileHover={{ y: -6 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
            {/* Ambient Glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/0 to-emerald-500/0 rounded-[3rem] blur-xl opacity-0 group-hover:from-emerald-500/10 group-hover:to-teal-500/10 group-hover:opacity-100 transition-all duration-500 -z-10" />

            <div className="relative z-10">
              <div className="relative aspect-[16/10] rounded-[2rem] overflow-hidden mb-6 bg-zinc-100">
                {/* Image Placeholder */}
                <div className="absolute inset-0 bg-zinc-200 group-hover:scale-105 transition-transform duration-1000 z-0" />
                <div className="absolute top-4 left-4 z-10">
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-white/90 backdrop-blur-sm text-zinc-900 shadow-sm">
                    {article.category}
                  </span>
                </div>
              </div>
            <div className="space-y-4">
                <div className="flex items-center gap-4 text-zinc-400">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    <ConciergeLabel size="xs" emphasis="low">{article.readTime} min read</ConciergeLabel>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5" />
                    <ConciergeLabel size="xs" emphasis="low">{article.authorName}</ConciergeLabel>
                  </div>
                </div>
                
                <h3 className="text-xl md:text-2xl font-serif font-bold text-zinc-900 group-hover:text-emerald-600 transition-colors duration-500 leading-tight">
                  {article.title}
                </h3>
                <p className="text-zinc-500 text-sm leading-relaxed line-clamp-2 transition-colors duration-500 group-hover:text-zinc-700">
                  {article.excerpt}
                </p>
                
                <div className="pt-4 mt-4 border-t border-zinc-100 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400 group-hover:text-emerald-600 transition-colors duration-500">
                  Examine Report
                  <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 text-emerald-600 group-hover:translate-x-1 transition-all duration-500" />
                </div>
              </div>
            </div>

            {/* Expanding Accent Line */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full group-hover:w-1/3 transition-all duration-500 z-20" />
            </motion.div>
          </Link>
        ))}
      </div>
    </SectionWrapper>
  );
}
