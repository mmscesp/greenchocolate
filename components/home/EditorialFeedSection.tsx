'use client';

import Link from 'next/link';
import { ArrowRight } from '@/lib/icons';
import { useLanguage } from '@/hooks/useLanguage';

const ARTICLES = [
  {
    titleKey: 'home.editorial_feed.articles.barcelona_legal.title',
    slug: 'is-weed-legal-barcelona-2026',
    categoryKey: 'home.editorial_feed.categories.legal',
    excerptKey: 'home.editorial_feed.articles.barcelona_legal.excerpt',
  },
  {
    titleKey: 'home.editorial_feed.articles.tourist_mistakes.title',
    slug: '5-mistakes-tourists-make',
    categoryKey: 'home.editorial_feed.categories.etiquette',
    excerptKey: 'home.editorial_feed.articles.tourist_mistakes.excerpt',
  },
  {
    titleKey: 'home.editorial_feed.articles.edibles_safety.title',
    slug: 'edibles-safety-guide',
    categoryKey: 'home.editorial_feed.categories.harm_reduction',
    excerptKey: 'home.editorial_feed.articles.edibles_safety.excerpt',
  },
];

export default function EditorialFeedSection() {
  const { language, t } = useLanguage();
  const withLocale = (path: string) => `/${language}${path}`;

  return (
    <section className="py-20 md:py-28 bg-muted/30">
      <div className="container max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10 gap-4">
           <div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">{t('home.editorial_feed.title')}</h2>
            <p className="mt-2 text-muted-foreground">{t('home.editorial_feed.subtitle')}</p>
           </div>
           <Link href={withLocale('/editorial')} className="inline-flex items-center text-primary hover:underline font-medium">
             {t('home.editorial_feed.view_all')} <ArrowRight className="ml-2 h-4 w-4" />
           </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {ARTICLES.map((article) => (
            <Link key={article.slug} href={withLocale(`/editorial/${article.slug}`)} className="group block">
              <div className="bg-card border rounded-xl overflow-hidden h-full hover:border-primary/50 transition-colors">
                <div className="aspect-video bg-muted/50" />
                <div className="p-6">
                  <div className="text-xs font-semibold text-primary mb-2 uppercase tracking-wider">{t(article.categoryKey)}</div>
                  <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2">{t(article.titleKey)}</h3>
                  <p className="text-muted-foreground text-sm line-clamp-2">{t(article.excerptKey)}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
