'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useReducedMotion, useScroll, useSpring } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/hooks/useLanguage';
import { ArticleDetail, ArticleCard } from '@/app/actions/articles';
import { Calendar, Clock, ArrowLeft, Share2, Shield, Info, ExternalLink, ArrowRight } from '@/lib/icons';
import ExpertByline from '@/components/trust/ExpertByline';
import TrustBadge from '@/components/trust/TrustBadge';
import { EligibilityFlow } from '@/components/landing/editorial-concierge/interactive/EligibilityFlow';
import ArticleContentRenderer from '@/components/article/ArticleContentRenderer';
import { getArticleCardImage } from '@/lib/image-fallbacks';
import { getLocalizedArticleCategory } from '@/lib/article-taxonomy';

interface ArticleContentProps {
  article: ArticleDetail;
  relatedArticles?: ArticleCard[];
}

export default function ArticleContent({ article, relatedArticles = [] }: ArticleContentProps) {
  const { t, language } = useLanguage();
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  const [showStickyCTA, setShowStickyCTA] = useState(false);

  const articleHeroImage = getArticleCardImage({
    heroImage: article.heroImage,
    category: article.category,
    citySlug: article.citySlug,
  });

  const locale = language === 'es' ? 'es-ES' : language === 'fr' ? 'fr-FR' : language === 'de' ? 'de-DE' : 'en-US';
  const localizedCategory = getLocalizedArticleCategory(article.category, t);

  useEffect(() => {
    let frameId = 0;
    const handleScroll = () => {
      if (frameId !== 0) {
        return;
      }

      frameId = window.requestAnimationFrame(() => {
        setShowStickyCTA(window.scrollY > 500);
        frameId = 0;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (frameId !== 0) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-bg-base text-white relative overflow-hidden">
      {/* Reading Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-brand z-[60] origin-left"
        style={{ scaleX }}
      />

      {/* Sticky CTA Banner */}
      {/* [motion] */}
      <motion.div
        initial={shouldReduceMotion ? { opacity: 0 } : { y: 100, opacity: 0 }}
        animate={
          shouldReduceMotion
            ? { opacity: showStickyCTA ? 1 : 0 }
            : { y: showStickyCTA ? 0 : 100, opacity: showStickyCTA ? 1 : 0 }
        }
        transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
        className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-bg-base/90 backdrop-blur-md border-t border-white/10"
      >
        <div className="mx-auto flex max-w-4xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-white font-bold hidden sm:block">{t('article.sticky_cta.desktop')}</p>
          <p className="text-white font-bold sm:hidden">{t('article.sticky_cta.mobile')}</p>
          <div className="flex items-center gap-3">
            <Link href={`/${language}/clubs`}>
              <Button className="bg-brand hover:bg-brand-dark text-bg-base font-bold rounded-full">
                {t('article.sticky_cta.button')} <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Background Effects - subtle */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-bg-surface/40 via-bg-base to-bg-base pointer-events-none" />
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-brand/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-brand/5 rounded-full blur-[120px]" />
      </div>

      {/* Back to Editorial link */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 md:pt-32 pb-6 relative z-10">
        <Link href={`/${language}/editorial`}>
          <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('nav.back_to_blog')}
          </Button>
        </Link>
      </div>

      {/* Hero Section */}
      <div className="relative h-[450px] lg:h-[650px] overflow-hidden bg-bg-surface relative z-10">
        <Image
          src={articleHeroImage}
          alt={article.heroImageAlt || article.title}
          fill
          className="object-cover opacity-40"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg-base via-bg-base/40 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-20">
          <div className="max-w-4xl mx-auto">
            <div className="flex gap-2 mb-8">
              <TrustBadge type="legal" size="sm" className="bg-brand/10 border-brand/20 text-brand" />
              <Badge variant="secondary" className="bg-white/10 text-white border-white/20 uppercase tracking-widest text-[10px] font-bold">
                {localizedCategory}
              </Badge>
            </div>
            <h1 className="text-4xl lg:text-7xl font-black text-white mb-8 leading-[0.95] tracking-tight font-serif">
              {article.title}
            </h1>
            <div className="flex items-center gap-8 text-zinc-400 font-bold text-[10px] uppercase tracking-widest">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-brand" />
                <span>{article.readTime} {t('article.min_read')}</span>
              </div>
              <div className="hidden sm:flex items-center gap-2">
                <Calendar className="h-4 w-4 text-brand" />
                <span>{t('article.verified')} {new Date(article.publishedAt || '').toLocaleDateString(locale, { month: 'short', year: 'numeric' })}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 pb-32 relative z-10">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-12 xl:grid-cols-[minmax(0,1fr)_350px]">
          
          {/* Article Main Body */}
          <article>
            <div className="bg-bg-card/70 backdrop-blur-sm rounded-3xl border border-white/10 shadow-2xl p-8 lg:p-12">
              {/* Expert Byline */}
              <ExpertByline 
                name={article.authorName} 
                role={t('article.author_role')} 
                date={new Date(article.publishedAt || '').toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' })}
              />

              {/* [motion] */}
              <motion.div
                initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 16 }}
                whileInView={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
              >
                {/* Regulatory Box */}
                <div className="mb-12 p-8 bg-brand/5 rounded-3xl border border-brand/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5">
                  <Shield className="h-24 w-24 text-brand" />
                </div>
                <div className="flex items-center gap-2 text-brand font-bold text-[10px] uppercase tracking-widest mb-4">
                  <Info className="h-4 w-4" />
                  {t('article.compliance_summary')}
                </div>
                <p className="text-white font-medium leading-relaxed relative z-10 text-lg">
                  {article.excerpt}
                </p>
              </div>
              </motion.div>

              {/* Content Render */}
              <div className="prose prose-invert prose-gold max-w-none">
                <ArticleContentRenderer content={article.content} />
              </div>

              {/* Tags & Interaction */}
              <div className="mt-20 pt-8 border-t border-white/5 flex flex-wrap items-center justify-between gap-6">
                <div className="flex flex-wrap gap-2">
                  {article.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="text-[10px] font-bold uppercase tracking-widest bg-white/5 text-zinc-400 border-white/10">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <Button variant="secondary" size="sm" className="rounded-full font-bold text-[10px] uppercase tracking-widest px-6 group border-white/10 text-zinc-400 hover:bg-white/5 hover:text-white transition-all">
                  <Share2 className="h-3 w-3 mr-2 group-hover:rotate-12 transition-transform" />
                  {t('blog.share')}
                </Button>
              </div>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="space-y-12">
            {/* Safety Kit Widget */}
            <div className="sticky top-24 space-y-12">
              <div className="rounded-3xl border border-white/10 bg-bg-card/80 p-4 backdrop-blur-sm shadow-xl">
                <EligibilityFlow />
                <div className="mt-6 flex justify-center">
                  <Link href={`/${language}/safety`}>
                    <Button className="rounded-full bg-brand hover:bg-brand-dark text-bg-base font-bold uppercase tracking-widest text-[10px] px-8 py-6">
                      {t('article.open_safety_guide')} <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Verification Details */}
              <div className="p-8 bg-bg-card/70 border border-white/10 rounded-3xl shadow-xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-brand/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-brand mb-8 flex items-center gap-2">
                  <Shield className="h-4 w-4" /> {t('article.vetting_process')}
                </h4>
                <ul className="space-y-5 text-[13px] font-medium text-zinc-400">
                  <li className="flex items-start gap-3">
                    <div className="h-1.5 w-1.5 bg-brand rounded-full mt-1.5 shrink-0" />
                    {t('article.vetting_items.license')}
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="h-1.5 w-1.5 bg-brand rounded-full mt-1.5 shrink-0" />
                    {t('article.vetting_items.audit')}
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="h-1.5 w-1.5 bg-brand rounded-full mt-1.5 shrink-0" />
                    {t('article.vetting_items.house_rules')}
                  </li>
                </ul>
                <Link href={`/${language}/mission`}>
                  <Button variant="link" className="mt-10 p-0 text-brand font-bold text-[10px] uppercase tracking-widest hover:text-brand-dark transition-colors">
                    {t('article.learn_about_vetting')} <ExternalLink className="h-3 w-3 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </aside>
        </div>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <div className="mt-32 pt-20 border-t border-white/5">
            {/* [motion] */}
            <motion.h2
              className="text-3xl font-black text-white mb-12 tracking-tight uppercase font-serif"
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: -8 }}
              whileInView={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            >
              {t('blog.related_articles')}
            </motion.h2>
            {/* [motion] */}
            <motion.div
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              {relatedArticles.map((related) => {
                const relatedImage = getArticleCardImage({
                  heroImage: related.heroImage,
                  category: related.category,
                  citySlug: related.citySlug,
                });

                return (
                <motion.div
                  key={related.id}
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
                  <Link href={`/${language}/editorial/${related.slug}`}>
                    <article className="group cursor-pointer relative">
                    <div className="relative h-64 mb-6 rounded-2xl overflow-hidden bg-bg-surface border border-white/10 group-hover:border-brand/50 transition-all duration-500">
                      <Image
                        src={relatedImage}
                        alt={related.title}
                        fill
                        className="object-cover opacity-60 transition-transform duration-700 group-hover:scale-105 group-hover:opacity-80"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-bg-base via-bg-base/20 to-transparent" />
                    </div>
                    <Badge variant="secondary" className="mb-4 bg-white/5 text-zinc-400 text-[10px] font-bold uppercase border-white/10">
                      {getLocalizedArticleCategory(related.category, t)}
                    </Badge>
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-brand transition-colors font-serif">
                      {related.title}
                    </h3>
                    <p className="text-zinc-400 text-sm line-clamp-2 leading-relaxed mb-6">
                      {related.excerpt}
                    </p>
                    
                    <div className="flex items-center gap-2 text-brand font-bold text-xs opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                      <span>{t('blog.read_more')}</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                    </article>
                  </Link>
                </motion.div>
                );
              })}
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}

