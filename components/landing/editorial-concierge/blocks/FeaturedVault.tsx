'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, BookOpen } from '@/lib/icons';
import { useLanguage } from '@/hooks/useLanguage';
import { type ArticleCard } from '@/app/actions/articles';
import { getArticleCardImage } from '@/lib/image-fallbacks';
import { SectionEyebrow } from './SectionEyebrow';
import { getFeaturedVaultPackages } from '@/lib/editorial-sprint';

interface FeaturedVaultProps {
  articles?: ArticleCard[];
}

export function FeaturedVault({ articles = [] }: FeaturedVaultProps) {
  const { language, t } = useLanguage();
  const shouldReduceMotion = useReducedMotion();

  const fallbackArticles = getFeaturedVaultPackages((language as 'en' | 'es' | 'fr' | 'de') ?? 'en').map((article) => ({
    ...article,
    readTime: `${article.readTime} ${t('landing.featured_vault.read_time_suffix')}`,
    image: getArticleCardImage({
      heroImage: null,
      category: article.category,
      citySlug: article.citySlug,
    }),
  }));

  const displayItems =
    articles.length > 0
      ? articles.slice(0, 4).map((article) => ({
          id: article.id,
          tag: article.category,
          title: article.title,
          description: article.excerpt,
          readTime: `${article.readTime} ${t('landing.featured_vault.read_time_suffix')}`,
          slug: article.slug,
          image: getArticleCardImage({
            heroImage: article.heroImage,
            category: article.category,
            citySlug: article.citySlug,
          }),
        }))
      : fallbackArticles;

  return (
    <section className="bg-bg-base py-16 md:py-24 px-4 md:px-8 border-t border-white/5 relative z-10 overflow-hidden">
      {/* Editorial Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.8)_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          className="flex flex-col items-center text-center mb-16 md:mb-24"
          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
          whileInView={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <SectionEyebrow className="mb-6">
            <span className="inline-flex items-center gap-2">
              <BookOpen className="w-3.5 h-3.5" />
              The Vault
            </span>
          </SectionEyebrow>
          
          <h2 className="text-4xl md:text-5xl lg:text-[4rem] font-black font-serif text-white tracking-tight leading-[1.05] mb-6 max-w-3xl">
            {t('landing.featured_vault.title')}
          </h2>
          <p className="text-lg md:text-xl text-white/50 font-serif italic max-w-2xl leading-relaxed">
            {t('landing.featured_vault.subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-4 lg:gap-6 items-stretch">
          {displayItems.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 30 }}
              whileInView={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: idx * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className={`group flex flex-col h-full ${idx === 0 || idx === 3 ? 'lg:col-span-2' : 'lg:col-span-1'} ${idx === 0 ? 'lg:row-span-2' : ''}`}
            >
              <Link href={`/${language}/editorial/${item.slug}`} className="flex flex-col h-full relative overflow-hidden rounded-[2rem] bg-bg-surface border border-white/5 hover:border-brand/30 transition-all duration-700 hover:shadow-[0_0_40px_rgba(194,165,108,0.1)] group/card">
                
                <div className={`relative w-full ${idx === 0 ? 'h-64 lg:h-[400px]' : 'h-56'} overflow-hidden shrink-0`}>
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="object-cover transition-transform duration-1000 ease-out group-hover/card:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0C10] via-black/40 to-transparent opacity-90 group-hover/card:opacity-70 transition-opacity duration-700" />
                  
                  {/* Floating category tag */}
                  <div className="absolute top-6 left-6 z-20">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand" />
                      <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-white">
                        {item.tag}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col flex-grow p-6 md:p-8 bg-[#0A0C10] relative z-10 -mt-4">
                  <div className="flex items-center gap-4 mb-4 text-[10px] font-bold uppercase tracking-widest text-white/40">
                    <span>{item.readTime}</span>
                  </div>
                  
                  <h3 className={`font-bold font-serif text-white leading-[1.2] mb-4 group-hover/card:text-brand-light transition-colors duration-500 ${idx === 0 ? 'text-2xl md:text-3xl lg:text-4xl' : 'text-xl md:text-2xl'}`}>
                    {item.title}
                  </h3>
                  
                  <p className="text-white/50 font-medium leading-relaxed mb-8 line-clamp-2 text-sm md:text-base mt-auto">
                    {item.description}
                  </p>
                  
                  <div className="pt-6 border-t border-white/5 flex justify-end">
                    <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover/card:bg-brand group-hover/card:border-brand transition-all duration-500">
                      <ArrowRight className="w-4 h-4 text-white group-hover/card:text-black transform -rotate-45 group-hover/card:rotate-0 transition-transform duration-500" />
                    </div>
                  </div>
                </div>

              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mt-16 flex justify-center"
        >
          <Link
            href={`/${language}/editorial`}
            className="group/btn inline-flex items-center gap-4 px-8 py-4 rounded-full border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/20 text-white font-bold text-[11px] uppercase tracking-[0.2em] transition-all duration-300 backdrop-blur-sm"
          >
            <span>{t('landing.featured_vault.all_guides')}</span>
            <div className="w-8 h-[1px] bg-white/20 group-hover/btn:bg-brand group-hover/btn:w-12 transition-all duration-500 relative">
               <ArrowRight className="absolute -right-1 -top-[5px] w-3 h-3 text-brand transform translate-x-0 group-hover/btn:translate-x-1 transition-transform" />
            </div>
          </Link>
        </motion.div>

      </div>
    </section>
  );
}
