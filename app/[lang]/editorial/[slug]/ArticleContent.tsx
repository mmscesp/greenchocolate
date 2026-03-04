'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useSpring } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/hooks/useLanguage';
import { ArticleDetail, ArticleCard } from '@/app/actions/articles';
import { Calendar, Clock, ArrowLeft, Share2, Shield, Info, ExternalLink, ArrowRight } from '@/lib/icons';
import ExpertByline from '@/components/trust/ExpertByline';
import TrustBadge from '@/components/trust/TrustBadge';
import { EligibilityFlow } from '@/components/landing/editorial-concierge/interactive/EligibilityFlow';
import ArticleContentRenderer from '@/components/article/ArticleContentRenderer';

interface ArticleContentProps {
  article: ArticleDetail;
  relatedArticles?: ArticleCard[];
}

export default function ArticleContent({ article, relatedArticles = [] }: ArticleContentProps) {
  const { t, language } = useLanguage();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  const [showStickyCTA, setShowStickyCTA] = useState(false);

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
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Reading Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gold z-[60] origin-left"
        style={{ scaleX }}
      />

      {/* Sticky CTA Banner */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: showStickyCTA ? 0 : 100 }}
        className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-black/90 backdrop-blur-md border-t border-white/10"
      >
        <div className="mx-auto flex max-w-4xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-white font-bold hidden sm:block">{t('article.sticky_cta.desktop')}</p>
          <p className="text-white font-bold sm:hidden">{t('article.sticky_cta.mobile')}</p>
          <div className="flex items-center gap-3">
            <Link href={`/${language}/clubs`}>
              <Button className="bg-gold hover:bg-gold-dark text-black font-bold rounded-full">
                {t('article.sticky_cta.button')} <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Background Effects - subtle */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-900/40 via-black to-black pointer-events-none" />
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-gold/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-gold/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-gold/5 rounded-full blur-[120px]" />
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
      <div className="relative h-[450px] lg:h-[650px] overflow-hidden bg-zinc-900 relative z-10">
        {article.heroImage && (
          <Image
            src={article.heroImage}
            alt={article.heroImageAlt || article.title}
            fill
            className="object-cover opacity-40"
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-20">
          <div className="max-w-4xl mx-auto">
            <div className="flex gap-2 mb-8">
              <TrustBadge type="legal" size="sm" className="bg-gold/10 border-gold/20 text-gold" />
              <Badge variant="secondary" className="bg-white/10 text-white border-white/20 uppercase tracking-widest text-[10px] font-bold">
                {article.category}
              </Badge>
            </div>
            <h1 className="text-4xl lg:text-7xl font-black text-white mb-8 leading-[0.95] tracking-tight font-serif">
              {article.title}
            </h1>
            <div className="flex items-center gap-8 text-zinc-400 font-bold text-[10px] uppercase tracking-widest">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gold" />
                <span>{article.readTime} {t('article.min_read')}</span>
              </div>
              <div className="hidden sm:flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gold" />
                <span>{t('article.verified')} {new Date(article.publishedAt || '').toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 pb-32 relative z-10">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-12 xl:grid-cols-[minmax(0,1fr)_350px]">
          
          {/* Article Main Body */}
          <article>
            <div className="bg-zinc-900/40 backdrop-blur-sm rounded-3xl border border-white/10 shadow-2xl p-8 lg:p-12">
              {/* Expert Byline */}
              <ExpertByline 
                name={article.authorName} 
                role={t('article.author_role')} 
                date={new Date(article.publishedAt || '').toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
              />

              {/* Regulatory Box */}
              <div className="mb-12 p-8 bg-gold/5 rounded-3xl border border-gold/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5">
                  <Shield className="h-24 w-24 text-gold" />
                </div>
                <div className="flex items-center gap-2 text-gold font-bold text-[10px] uppercase tracking-widest mb-4">
                  <Info className="h-4 w-4" />
                  {t('article.compliance_summary')}
                </div>
                <p className="text-white font-medium leading-relaxed relative z-10 text-lg">
                  {article.excerpt}
                </p>
              </div>

              {/* Content Render */}
              <div className="prose prose-invert prose-gold max-w-none">
                <ArticleContentRenderer content={article.content} />
              </div>

              {/* Tags & Interaction */}
              <div className="mt-20 pt-8 border-t border-white/5 flex flex-wrap items-center justify-between gap-6">
                <div className="flex flex-wrap gap-2">
                  {article.tags.map(tag => (
                    <Badge key={tag} variant="outline" className="text-[10px] font-bold uppercase tracking-widest bg-white/5 text-zinc-400 border-white/10">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <Button variant="outline" size="sm" className="rounded-full font-bold text-[10px] uppercase tracking-widest px-6 group border-white/10 text-zinc-400 hover:bg-white/5 hover:text-white transition-all">
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
              <div className="rounded-3xl border border-white/10 bg-zinc-900/60 p-4 backdrop-blur-sm shadow-xl">
                <EligibilityFlow />
                <div className="mt-6 flex justify-center">
                  <Link href={`/${language}/safety`}>
                    <Button className="rounded-full bg-gold hover:bg-gold-dark text-black font-bold uppercase tracking-widest text-[10px] px-8 py-6">
                      {t('article.open_safety_guide')} <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Verification Details */}
              <div className="p-8 bg-zinc-900/40 border border-white/10 rounded-3xl shadow-xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-gold/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-gold mb-8 flex items-center gap-2">
                  <Shield className="h-4 w-4" /> {t('article.vetting_process')}
                </h4>
                <ul className="space-y-5 text-[13px] font-medium text-zinc-400">
                  <li className="flex items-start gap-3">
                    <div className="h-1.5 w-1.5 bg-gold rounded-full mt-1.5 shrink-0" />
                    {t('article.vetting_items.license')}
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="h-1.5 w-1.5 bg-gold rounded-full mt-1.5 shrink-0" />
                    {t('article.vetting_items.audit')}
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="h-1.5 w-1.5 bg-gold rounded-full mt-1.5 shrink-0" />
                    {t('article.vetting_items.house_rules')}
                  </li>
                </ul>
                <Link href={`/${language}/mission`}>
                  <Button variant="link" className="mt-10 p-0 text-gold font-bold text-[10px] uppercase tracking-widest hover:text-gold-dark transition-colors">
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
            <h2 className="text-3xl font-black text-white mb-12 tracking-tight uppercase font-serif">{t('blog.related_articles')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedArticles.map((related) => (
                <Link key={related.id} href={`/${language}/editorial/${related.slug}`}>
                  <article className="group cursor-pointer relative">
                    <div className="relative h-64 mb-6 rounded-2xl overflow-hidden bg-zinc-900 border border-white/10 group-hover:border-gold/50 transition-all duration-500">
                      {related.heroImage && (
                        <Image
                          src={related.heroImage}
                          alt={related.title}
                          fill
                          className="object-cover opacity-60 transition-transform duration-700 group-hover:scale-105 group-hover:opacity-80"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                    </div>
                    <Badge variant="outline" className="mb-4 bg-white/5 text-zinc-400 text-[10px] font-bold uppercase border-white/10">
                      {related.category}
                    </Badge>
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-gold transition-colors font-serif">
                      {related.title}
                    </h3>
                    <p className="text-zinc-400 text-sm line-clamp-2 leading-relaxed mb-6">
                      {related.excerpt}
                    </p>
                    
                    <div className="flex items-center gap-2 text-gold font-bold text-xs opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                      <span>Read More</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
