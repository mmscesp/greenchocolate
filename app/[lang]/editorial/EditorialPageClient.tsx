'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/useLanguage';
import { ArrowRight, BookOpen, Scale, Shield, Heart, History, Clock } from '@/lib/icons';

interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: number;
  heroImage?: string;
  cityName?: string;
}

interface Category {
  name: string;
  count: number;
}

interface EditorialPageClientProps {
  lang: string;
}

// Mock data
const buildMockFeaturedArticles = (t: (key: string) => string): Article[] => [
  {
    id: '1',
    slug: 'is-weed-legal',
    title: t('editorial.mock.1.title'),
    excerpt: t('editorial.mock.1.excerpt'),
    category: t('editorial.mock.1.category'),
    readTime: 8,
    cityName: t('editorial.mock.1.city_name'),
  },
  {
    id: '2',
    slug: '5-mistakes-tourists-make',
    title: t('editorial.mock.2.title'),
    excerpt: t('editorial.mock.2.excerpt'),
    category: t('editorial.mock.2.category'),
    readTime: 6,
  },
  {
    id: '3',
    slug: 'edibles-safety-guide',
    title: t('editorial.mock.3.title'),
    excerpt: t('editorial.mock.3.excerpt'),
    category: t('editorial.mock.3.category'),
    readTime: 5,
  },
];

const buildCategories = (t: (key: string) => string) => [
  {
    slug: 'legal',
    title: t('editorial.categories.legal.title'),
    description: t('editorial.categories.legal.description'),
    icon: Scale,
    gradient: 'from-brand to-brand-dark',
    bgColor: 'bg-brand/10',
    textColor: 'text-brand',
    borderColor: 'border-brand/20',
    articleCount: 5,
  },
  {
    slug: 'etiquette',
    title: t('editorial.categories.etiquette.title'),
    description: t('editorial.categories.etiquette.description'),
    icon: Heart,
    gradient: 'from-brand-light to-brand',
    bgColor: 'bg-brand/10',
    textColor: 'text-brand-light',
    borderColor: 'border-brand/25',
    articleCount: 4,
  },
  {
    slug: 'safety',
    title: t('editorial.categories.safety.title'),
    description: t('editorial.categories.safety.description'),
    icon: Shield,
    gradient: 'from-brand to-brand-dark',
    bgColor: 'bg-brand/10',
    textColor: 'text-brand',
    borderColor: 'border-brand/20',
    articleCount: 3,
  },
  {
    slug: 'culture',
    title: t('editorial.categories.culture.title'),
    description: t('editorial.categories.culture.description'),
    icon: History,
    gradient: 'from-brand-dark to-brand',
    bgColor: 'bg-brand/15',
    textColor: 'text-brand-dark',
    borderColor: 'border-brand/25',
    articleCount: 6,
  },
];

export default function EditorialPageClient({ lang }: EditorialPageClientProps) {
  const { t } = useLanguage();
  const shouldReduceMotion = useReducedMotion();
  const featuredArticles = buildMockFeaturedArticles(t);
  const CATEGORIES = buildCategories(t);

  return (
    <div className="min-h-screen bg-bg-base relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-brand/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-brand-dark/5 rounded-full blur-3xl" />
      </div>

      {/* Hero Section */}
      <section className="relative pt-24 md:pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge variant="secondary" className="mb-6 px-4 py-1.5 text-sm border-brand/20 text-zinc-300 bg-brand/10">
                <BookOpen className="w-4 h-4 mr-2" />
                {t('editorial.badge')}
              </Badge>
            </motion.div>
            
            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-6 text-white"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              {t('editorial.title_prefix')}{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand via-brand-light to-brand-dark">
                {t('editorial.title_highlight')}
              </span>
            </motion.h1>
            
            <motion.p 
              className="text-lg md:text-xl text-zinc-400 mb-8 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {t('editorial.subtitle')}
            </motion.p>
          </div>
        </div>
      </section>

      {/* Category Grid */}
      <section className="py-16 md:py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2 
            className="text-2xl md:text-3xl font-bold mb-8 text-white"
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: -8 }}
            whileInView={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
          >
            {t('editorial.browse_by_topic')}
          </motion.h2>
          
          {/* [motion] */}
          <motion.div
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {CATEGORIES.map((category) => (
              <motion.div
                key={category.slug}
                variants={{
                  hidden: shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 16 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
                }}
                whileHover={
                  shouldReduceMotion
                    ? undefined
                    : { y: -3, boxShadow: '0 8px 30px rgba(0,0,0,0.10)' }
                }
                transition={{ duration: 0.2 }}
                style={{ willChange: shouldReduceMotion ? undefined : 'transform' }}
              >
                <Link
                  href={`/${lang}/editorial/${category.slug}`}
                className="group relative overflow-hidden rounded-2xl border border-brand/15 bg-brand/5 backdrop-blur-sm p-6 md:p-8 hover:border-brand/30 transition-all duration-500 block h-full"
                >
                  {/* Glow effect */}
                  <div className={`absolute -inset-1 bg-gradient-to-r ${category.gradient} rounded-2xl blur-xl opacity-0 group-hover:opacity-10 transition-opacity duration-500 -z-10`} />
                  
                  <div className="relative">
                    <div className={`inline-flex p-3 rounded-xl ${category.bgColor} ${category.textColor} mb-4 border ${category.borderColor}`}>
                      <category.icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold mb-2 text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-zinc-400 transition-all">
                      {category.title}
                    </h3>
                    <p className="text-zinc-400 mb-4">
                      {category.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-zinc-500">
                        {category.articleCount} {category.articleCount === 1 ? t('editorial.article') : t('editorial.articles')}
                      </span>
                      <ArrowRight className="w-5 h-5 text-zinc-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                  
                  {/* Bottom accent line */}
                  <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-1 bg-gradient-to-r ${category.gradient} rounded-full group-hover:w-1/4 transition-all duration-500`} />
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Articles */}
      {featuredArticles.length > 0 && (
        <section className="py-16 md:py-24 relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: -8 }}
              whileInView={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <h2 className="text-2xl md:text-3xl font-bold text-white">{t('editorial.featured_articles')}</h2>
              <Button variant="secondary" asChild className="border-brand/15 text-zinc-300 hover:bg-brand/10 hover:text-white rounded-xl">
                <Link href={`/${lang}/editorial/legal`}>
                  {t('editorial.view_all')} <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </motion.div>
            
            {/* [motion] */}
            <motion.div
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {featuredArticles.map((article) => (
                <motion.div
                  key={article.id}
                  variants={{
                    hidden: shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 16 },
                    show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
                  }}
                  whileHover={
                    shouldReduceMotion
                      ? undefined
                      : { y: -3, boxShadow: '0 8px 30px rgba(0,0,0,0.10)' }
                  }
                  transition={{ duration: 0.2 }}
                  style={{ willChange: shouldReduceMotion ? undefined : 'transform' }}
                >
                  <Link
                    href={`/${lang}/editorial/${article.slug}`}
                className="group block rounded-2xl border border-brand/15 bg-brand/5 backdrop-blur-sm overflow-hidden hover:border-brand/30 transition-all duration-500 h-full"
                  >
                    <div className="aspect-video bg-bg-surface/50 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/50 to-transparent" />
                  <Badge className="absolute top-3 left-3 bg-brand/10 text-zinc-200 border-brand/20" variant="secondary">
                        {article.category}
                      </Badge>
                    </div>
                    <div className="p-5">
                      <h3 className="font-bold text-lg mb-2 text-white group-hover:text-brand transition-colors line-clamp-2">
                        {article.title}
                      </h3>
                      <p className="text-zinc-400 text-sm line-clamp-2 mb-4">
                        {article.excerpt}
                      </p>
                      <div className="flex items-center justify-between text-xs text-zinc-500">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {article.readTime} {t('editorial.min_read')}
                        </div>
                        {article.cityName && (
                          <span>{article.cityName}</span>
                        )}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* Trust Signals */}
      <section className="py-16 md:py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="max-w-3xl mx-auto text-center"
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 16 }}
            whileInView={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-white">{t('editorial.standards.title')}</h2>
            <p className="text-zinc-400 mb-10">
              {t('editorial.standards.subtitle')}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-14 h-14 bg-brand/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-brand/20">
                  <Scale className="w-7 h-7 text-brand" />
                </div>
                <h3 className="font-semibold mb-2 text-white">{t('editorial.standards.items.legal.title')}</h3>
                <p className="text-sm text-zinc-400">
                  {t('editorial.standards.items.legal.description')}
                </p>
              </div>
              <div className="text-center">
                <div className="w-14 h-14 bg-brand/15 rounded-full flex items-center justify-center mx-auto mb-4 border border-brand/25">
                  <Shield className="w-7 h-7 text-brand-light" />
                </div>
                <h3 className="font-semibold mb-2 text-white">{t('editorial.standards.items.harm_reduction.title')}</h3>
                <p className="text-sm text-zinc-400">
                  {t('editorial.standards.items.harm_reduction.description')}
                </p>
              </div>
              <div className="text-center">
                <div className="w-14 h-14 bg-brand/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-brand/30">
                  <BookOpen className="w-7 h-7 text-brand-dark" />
                </div>
                <h3 className="font-semibold mb-2 text-white">{t('editorial.standards.items.updated.title')}</h3>
                <p className="text-sm text-zinc-400">
                  {t('editorial.standards.items.updated.description')}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
