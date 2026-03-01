'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Clock } from '@/lib/icons';
import { useLanguage } from '@/hooks/useLanguage';
import { type ArticleCard } from '@/app/actions/articles';

interface FeaturedVaultProps {
  articles?: ArticleCard[];
}

export function FeaturedVault({ articles = [] }: FeaturedVaultProps) {
  const { language } = useLanguage();

  const fallbackArticles = [
    {
      id: '1',
      tag: 'Essential Guide',
      title: 'What Cannabis Social Clubs in Spain Actually Are — And Why It Matters for Your Trip',
      description: 'How they work. Who can join. What to expect. What they\'re not.',
      readTime: '12 min read',
      slug: 'what-are-cannabis-social-clubs-spain',
      image: '/images/editorial/club-interior-warm.webp'
    },
    {
      id: '2',
      tag: 'Safety',
      title: 'The Safety Kit: What Every Visitor Should Know Before Setting Foot in a Club',
      description: 'Scam patterns. Legal lines. Privacy etiquette. What to do when things go sideways.',
      readTime: '8 min read',
      slug: 'safety-kit-visitors-spain',
      image: '/images/editorial/safety-kit-hero.webp'
    },
    {
      id: '3',
      tag: 'Culture',
      title: 'Barcelona vs. Amsterdam: Two Cities, Two Systems, Two Completely Different Realities',
      description: 'If you\'re coming from coffeeshop culture expecting the same thing, this is the reset you need.',
      readTime: '10 min read',
      slug: 'barcelona-vs-amsterdam-cannabis',
      image: '/images/editorial/bcn-vs-ams.webp'
    },
    {
      id: '4',
      tag: 'City Guide',
      title: 'Your First Time in a Barcelona Cannabis Club: The Respectful Way In',
      description: 'From initial research to membership to your first visit — every step, explained by people who\'ve done it.',
      readTime: '15 min read',
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
    <section className="bg-zinc-50 py-24 md:py-32 px-4 md:px-8 border-t border-zinc-200">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="max-w-3xl">
            <h2 className="text-4xl md:text-5xl font-black font-serif text-black tracking-tight mb-4 leading-[1.1]">
              Start Here. Read Before You Fly.
            </h2>
            <p className="text-lg md:text-xl text-zinc-600 font-medium max-w-2xl">
              In-depth guides written for people who want to do this right — not fast.
            </p>
          </div>
          <Link
            href={`/${language}/editorial`}
            className="hidden md:flex items-center gap-2 font-bold uppercase tracking-widest text-xs text-zinc-500 hover:text-[#E8A838] transition-colors"
          >
            All Guides <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12">
          {displayItems.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: idx * 0.1 }}
            >
              <Link href={`/${language}/editorial/${item.slug}`} className="group block h-full">
                <div className="relative aspect-[16/9] overflow-hidden rounded-xl bg-zinc-200 mb-6 shadow-sm group-hover:shadow-md transition-all duration-500">
                  <div className="absolute inset-0 bg-zinc-800/10 group-hover:bg-zinc-800/0 transition-colors duration-500 z-10" />
                  {/* In a real app, use Next/Image here */}
                  <div className="absolute inset-0 bg-zinc-300 group-hover:scale-105 transition-transform duration-700 ease-out" />
                  <div className="absolute top-4 left-4 z-20">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-md text-xs font-bold uppercase tracking-wider text-black rounded-sm shadow-sm">
                      {item.tag}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col h-auto">
                  <h3 className="text-2xl md:text-3xl font-bold font-serif text-zinc-900 leading-tight mb-3 group-hover:text-[#E8A838] transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="text-zinc-600 font-medium leading-relaxed mb-4 line-clamp-2 text-base md:text-lg">
                    {item.description}
                  </p>
                  <div className="mt-auto pt-4 border-t border-zinc-200 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-400">
                      <Clock className="w-4 h-4" />
                      {item.readTime}
                    </div>
                    <span className="text-xs font-bold uppercase tracking-widest text-zinc-900 group-hover:translate-x-1 transition-transform duration-300">
                      Read →
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 pt-16 border-t border-zinc-200 md:hidden flex justify-center">
          <Link
            href={`/${language}/editorial`}
            className="flex items-center gap-2 font-bold uppercase tracking-widest text-xs text-zinc-500 hover:text-[#E8A838] transition-colors"
          >
            All Guides <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Newsletter Tease Inline */}
        <div className="mt-20 md:mt-24 py-12 border-y border-zinc-200 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-12">
          <div className="text-center md:text-left">
            <p className="text-lg font-bold text-black mb-1">New guides published weekly.</p>
            <p className="text-zinc-500 text-sm">Never miss one. Unsubscribe anytime.</p>
          </div>
          <form className="flex w-full md:w-auto gap-2" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="Your email"
              className="flex-1 md:w-64 px-4 py-3 bg-white border border-zinc-300 rounded-lg text-sm focus:outline-none focus:border-[#E8A838] focus:ring-1 focus:ring-[#E8A838]"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-black text-white text-sm font-bold rounded-lg hover:bg-zinc-800 transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
