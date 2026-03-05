'use client';

import React from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Clock } from '@/lib/icons';
import { useLanguage } from '@/hooks/useLanguage';
import { type ArticleCard } from '@/app/actions/articles';

interface FeaturedVaultProps {
  articles?: ArticleCard[];
}

export function FeaturedVault({ articles = [] }: FeaturedVaultProps) {
  const { language, t } = useLanguage();
  const shouldReduceMotion = useReducedMotion();

  const fallbackArticles = [
    {
      id: '1',
      tag: t('landing.featured_vault.fallback.essential.tag'),
      title: t('landing.featured_vault.fallback.essential.title'),
      description: t('landing.featured_vault.fallback.essential.description'),
      readTime: t('landing.featured_vault.fallback.essential.read_time'),
      slug: 'what-are-cannabis-social-clubs-spain',
      image: '/images/editorial/club-interior-warm.webp'
    },
    {
      id: '2',
      tag: t('landing.featured_vault.fallback.safety.tag'),
      title: t('landing.featured_vault.fallback.safety.title'),
      description: t('landing.featured_vault.fallback.safety.description'),
      readTime: t('landing.featured_vault.fallback.safety.read_time'),
      slug: 'safety-kit-visitors-spain',
      image: '/images/editorial/safety-kit-hero.webp'
    },
    {
      id: '3',
      tag: t('landing.featured_vault.fallback.culture.tag'),
      title: t('landing.featured_vault.fallback.culture.title'),
      description: t('landing.featured_vault.fallback.culture.description'),
      readTime: t('landing.featured_vault.fallback.culture.read_time'),
      slug: 'barcelona-vs-amsterdam-cannabis',
      image: '/images/editorial/bcn-vs-ams.webp'
    },
    {
      id: '4',
      tag: t('landing.featured_vault.fallback.city_guide.tag'),
      title: t('landing.featured_vault.fallback.city_guide.title'),
      description: t('landing.featured_vault.fallback.city_guide.description'),
      readTime: t('landing.featured_vault.fallback.city_guide.read_time'),
      slug: 'first-time-barcelona-cannabis-club',
      image: '/images/editorial/first-time-bcn.webp'
    }
  ];

  const displayItems = articles.length > 0
    ? articles.slice(0, 4).map((article) => ({
        id: article.id,
        tag: article.category,
        title: article.title,
        description: article.excerpt,
        readTime: `${article.readTime} min read`,
        slug: article.slug,
        image: article.heroImage || '/images/editorial/club-interior-warm.webp',
      }))
    : fallbackArticles;

  return (
    <section className="bg-bg-surface py-24 md:py-32 px-4 md:px-8 border-t border-white/10">
      <div className="max-w-7xl mx-auto">
        {/* [motion] */}
        <motion.div
          className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16"
          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
          whileInView={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <div className="max-w-3xl">
            <h2 className="text-4xl md:text-5xl font-black font-serif text-white tracking-tight mb-4 leading-[1.1]">
              {t('landing.featured_vault.title')}
            </h2>
            <p className="text-lg md:text-xl text-zinc-300 font-medium max-w-2xl">
              {t('landing.featured_vault.subtitle')}
            </p>
          </div>
          <Link
            href={`/${language}/editorial`}
            className="hidden md:flex items-center gap-2 font-bold uppercase tracking-widest text-xs text-zinc-400 hover:text-brand transition-colors"
          >
            {t('landing.featured_vault.all_guides')} <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        {/* [motion] */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12"
        >
          {displayItems.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
              whileInView={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.4, delay: idx * 0.04, ease: [0.25, 0.1, 0.25, 1] }}
              whileHover={
                shouldReduceMotion
                  ? undefined
                  : { y: -3, boxShadow: '0 8px 30px rgba(0,0,0,0.10)' }
              }
              style={{ willChange: shouldReduceMotion ? undefined : 'transform' }}
            >
              <Link href={`/${language}/editorial/${item.slug}`} className="group block h-full">
                <div className="relative aspect-[16/9] overflow-hidden rounded-xl bg-bg-elevated mb-6 shadow-sm group-hover:shadow-md transition-all duration-500">
                  <div className="absolute inset-0 bg-bg-base/20 group-hover:bg-bg-base/0 transition-colors duration-500 z-10" />
                  {/* In a real app, use Next/Image here */}
                  <div className="absolute inset-0 bg-bg-card group-hover:scale-105 transition-transform duration-700 ease-out" />
                  <div className="absolute top-4 left-4 z-20">
                    <span className="px-3 py-1 bg-bg-base/85 backdrop-blur-md text-xs font-bold uppercase tracking-wider text-brand rounded-sm shadow-sm border border-brand/30">
                      {item.tag}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col h-auto">
                  <h3 className="text-2xl md:text-3xl font-bold font-serif text-white leading-tight mb-3 group-hover:text-brand transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="text-zinc-300 font-medium leading-relaxed mb-4 line-clamp-2 text-base md:text-lg">
                    {item.description}
                  </p>
                  <div className="mt-auto pt-4 border-t border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-400">
                      <Clock className="w-4 h-4" />
                      {item.readTime}
                    </div>
                    <span className="text-xs font-bold uppercase tracking-widest text-zinc-200 group-hover:translate-x-1 transition-transform duration-300">
                      {t('landing.featured_vault.read_cta')}
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 pt-16 border-t border-white/10 md:hidden flex justify-center">
          <Link
            href={`/${language}/editorial`}
            className="flex items-center gap-2 font-bold uppercase tracking-widest text-xs text-zinc-400 hover:text-brand transition-colors"
          >
            {t('landing.featured_vault.all_guides')} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Newsletter Tease Inline */}
        <div className="mt-20 md:mt-24 py-12 border-y border-white/10 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-12">
          <div className="text-center md:text-left">
            <p className="text-lg font-bold text-white mb-1">{t('landing.featured_vault.newsletter.title')}</p>
            <p className="text-zinc-400 text-sm">{t('landing.featured_vault.newsletter.subtitle')}</p>
          </div>
          <form className="flex w-full md:w-auto gap-2" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder={t('landing.featured_vault.newsletter.email_placeholder')}
              className="flex-1 md:w-64 px-4 py-3 bg-bg-card border border-white/15 rounded-lg text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-brand text-bg-base text-sm font-bold rounded-lg hover:bg-brand-dark transition-colors"
            >
              {t('landing.featured_vault.newsletter.subscribe')}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
