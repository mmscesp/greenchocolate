'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useSpring } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/hooks/useLanguage';
import { ArticleDetail, ArticleCard } from '@/app/actions/articles';
import { Leaf, Calendar, Clock, User, ArrowLeft, Share2, Shield, Info, ExternalLink, ArrowRight } from '@/lib/icons';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import ExpertByline from '@/components/trust/ExpertByline';
import TrustBadge from '@/components/trust/TrustBadge';
import SafetyKitForm from '@/components/marketing/SafetyKitForm';
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
    const handleScroll = () => {
      setShowStickyCTA(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background relative">
      {/* Reading Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-primary/80 z-[60] origin-left"
        style={{ scaleX }}
      />

      {/* Sticky CTA Banner */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: showStickyCTA ? 0 : 100 }}
        className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-background/95 backdrop-blur-md border-t border-border"
      >
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <p className="text-foreground font-bold hidden sm:block">Want to visit a club safely?</p>
          <p className="text-foreground font-bold sm:hidden">Visit safely?</p>
          <div className="flex items-center gap-3">
            <Link href={`/${language}/clubs`}>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-full">
                Browse Clubs <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Background Effects - subtle */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-primary/3 rounded-full blur-3xl" />
      </div>

      {/* Back to Editorial link */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 md:pt-32 pb-6">
        <Link href={`/${language}/editorial`}>
          <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('nav.back_to_blog')}
          </Button>
        </Link>
      </div>

      {/* Hero Section */}
      <div className="relative h-[400px] lg:h-[600px] overflow-hidden bg-muted">
        {article.heroImage && (
          <Image
            src={article.heroImage}
            alt={article.heroImageAlt || article.title}
            fill
            className="object-cover opacity-60"
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-16">
          <div className="max-w-4xl mx-auto">
            <div className="flex gap-2 mb-6">
              <TrustBadge type="legal" size="sm" className="bg-gold/10 border-gold/20 text-gold" />
              <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 uppercase tracking-widest text-[10px] font-bold">
                {article.category}
              </Badge>
            </div>
            <h1 className="text-4xl lg:text-7xl font-black text-foreground mb-6 leading-[0.95] tracking-tight">
              {article.title}
            </h1>
            <div className="flex items-center gap-8 text-muted-foreground font-bold text-xs uppercase tracking-widest">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                <span>{article.readTime} MIN READ</span>
              </div>
              <div className="hidden sm:flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                <span>VERIFIED {new Date(article.publishedAt || '').toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 pb-32">
        <div className="grid lg:grid-cols-[1fr_350px] gap-20">
          
          {/* Article Main Body */}
          <article>
            <div className="bg-card rounded-3xl border shadow-lg shadow-primary/5 p-8">
              {/* Expert Byline */}
              <ExpertByline 
                name={article.authorName} 
                role="Legal & Compliance Specialist" 
                date={new Date(article.publishedAt || '').toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
              />

              {/* Regulatory Box */}
              <div className="mb-12 p-8 bg-primary/5 rounded-3xl border border-primary/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Shield className="h-24 w-24 text-primary" />
                </div>
                <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest mb-4">
                  <Info className="h-4 w-4" />
                  Compliance Summary
                </div>
                <p className="text-foreground font-medium leading-relaxed relative z-10">
                  {article.excerpt}
                </p>
              </div>

              {/* Content Render */}
              <ArticleContentRenderer content={article.content} />

              {/* Tags & Interaction */}
              <div className="mt-20 pt-8 border-t border-border flex flex-wrap items-center justify-between gap-6">
                <div className="flex flex-wrap gap-2">
                  {article.tags.map(tag => (
                    <Badge key={tag} variant="outline" className="text-[10px] font-bold uppercase tracking-widest bg-muted text-muted-foreground border-border">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <Button variant="outline" size="sm" className="rounded-full font-bold text-[10px] uppercase tracking-widest px-6 group border-border text-muted-foreground hover:bg-muted hover:text-foreground">
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
              <SafetyKitForm />

              {/* Verification Details */}
              <div className="p-8 bg-card border rounded-3xl shadow-lg shadow-primary/5 relative overflow-hidden group">
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <h4 className="text-xs font-bold uppercase tracking-widest text-primary mb-6 flex items-center gap-2">
                  <Shield className="h-4 w-4" /> Vetting Process
                </h4>
                <ul className="space-y-4 text-xs font-medium text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <div className="h-1.5 w-1.5 bg-primary rounded-full mt-1.5 shrink-0" />
                    Association License Verification
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="h-1.5 w-1.5 bg-primary rounded-full mt-1.5 shrink-0" />
                    Physical Site Safety Audit
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="h-1.5 w-1.5 bg-primary rounded-full mt-1.5 shrink-0" />
                    House Rules & Etiquette Review
                  </li>
                </ul>
                <Link href={`/${language}/mission`}>
                  <Button variant="link" className="mt-8 p-0 text-primary font-bold text-[10px] uppercase tracking-widest hover:text-primary/80 transition-colors">
                    Learn about vetting <ExternalLink className="h-3 w-3 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </aside>
        </div>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <div className="mt-32 pt-20 border-t border-border">
            <h2 className="text-3xl font-bold text-foreground mb-12 tracking-tight uppercase">{t('blog.related_articles')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.map((related) => (
                <Link key={related.id} href={`/${language}/editorial/${related.slug}`}>
                  <article className="group cursor-pointer relative">
                    <div className="relative h-64 mb-6 rounded-2xl overflow-hidden bg-muted border group-hover:border-primary/50 transition-all duration-300">
                      {related.heroImage && (
                        <Image
                          src={related.heroImage}
                          alt={related.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-60" />
                    </div>
                    <Badge variant="outline" className="mb-4 bg-muted text-muted-foreground text-[10px] font-bold uppercase border-border">
                      {related.category}
                    </Badge>
                    <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {related.title}
                    </h3>
                    <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed">
                      {related.excerpt}
                    </p>
                    
                    {/* Bottom accent line */}
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-1 bg-primary rounded-full group-hover:w-1/4 transition-all duration-300" />
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
