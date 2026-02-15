'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useSpring } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Footer from '@/components/Footer';
import LanguageSelector from '@/components/LanguageSelector';
import { useLanguage } from '@/hooks/useLanguage';
import { ArticleDetail, ArticleCard } from '@/app/actions/articles';
import { Leaf, Calendar, Clock, User, ArrowLeft, Share2, Shield, Info, ExternalLink, ArrowRight } from 'lucide-react';
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
    <div className="min-h-screen bg-zinc-900 relative overflow-hidden">
      {/* Reading Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-emerald-500 z-[60] origin-left"
        style={{ scaleX }}
      />

      {/* Sticky CTA Banner */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: showStickyCTA ? 0 : 100 }}
        className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-zinc-900/95 backdrop-blur-md border-t border-white/10"
      >
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <p className="text-white font-bold hidden sm:block">Want to visit a club safely?</p>
          <p className="text-white font-bold sm:hidden">Visit safely?</p>
          <div className="flex items-center gap-3">
            <Link href={`/${language}/clubs`}>
              <Button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white font-bold rounded-full">
                Browse Clubs <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-green-500/5 rounded-full blur-3xl" />
      </div>

      {/* Navigation */}
      <nav className="bg-zinc-900/80 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href={`/${language}`} className="flex items-center gap-2 group">
                <Leaf className="h-6 w-6 text-green-500 group-hover:rotate-12 transition-transform" />
                <span className="text-lg font-black tracking-tighter text-white uppercase">SocialClubsMaps</span>
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <Link href={`/${language}/editorial`}>
                <Button variant="ghost" className="text-xs font-black uppercase tracking-widest text-zinc-400 hover:text-white">
                  <ArrowLeft className="h-3 w-3 mr-2" />
                  {t('nav.back_to_blog')}
                </Button>
              </Link>
              <LanguageSelector />
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative h-[400px] lg:h-[600px] overflow-hidden bg-zinc-900">
        {article.heroImage && (
          <Image
            src={article.heroImage}
            alt={article.heroImageAlt || article.title}
            fill
            className="object-cover opacity-60"
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-16">
          <div className="max-w-4xl mx-auto">
            <div className="flex gap-2 mb-6">
              <TrustBadge variant="expert" theme="dark" />
              <Badge variant="secondary" className="bg-white/10 text-white border-white/20 backdrop-blur-md uppercase tracking-widest text-[10px] font-black">
                {article.category}
              </Badge>
            </div>
            <h1 className="text-4xl lg:text-7xl font-black text-white mb-6 leading-[0.95] tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white via-zinc-100 to-white">
              {article.title}
            </h1>
            <div className="flex items-center gap-8 text-zinc-400 font-bold text-xs uppercase tracking-widest">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-green-500" />
                <span>{article.readTime} MIN READ</span>
              </div>
              <div className="hidden sm:flex items-center gap-2">
                <Calendar className="h-4 w-4 text-green-500" />
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
            <div className="bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 p-8">
              {/* Expert Byline */}
              <ExpertByline 
                name={article.authorName} 
                role="Legal & Compliance Specialist" 
                date={new Date(article.publishedAt || '').toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
              />

              {/* Regulatory Box */}
              <div className="mb-12 p-8 bg-blue-500/10 rounded-3xl border border-blue-500/30 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Shield className="h-24 w-24 text-blue-400" />
                </div>
                <div className="flex items-center gap-2 text-blue-400 font-black text-xs uppercase tracking-widest mb-4">
                  <Info className="h-4 w-4" />
                  Compliance Summary
                </div>
                <p className="text-zinc-300 font-medium leading-relaxed relative z-10">
                  {article.excerpt}
                </p>
              </div>

              {/* Content Render */}
              <ArticleContentRenderer content={article.content} />

              {/* Tags & Interaction */}
              <div className="mt-20 pt-8 border-t border-white/10 flex flex-wrap items-center justify-between gap-6">
                <div className="flex flex-wrap gap-2">
                  {article.tags.map(tag => (
                    <Badge key={tag} variant="outline" className="text-[10px] font-black uppercase tracking-widest bg-white/5 text-zinc-400 border-white/10">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <Button variant="outline" size="sm" className="rounded-full font-black text-[10px] uppercase tracking-widest px-6 group border-white/10 text-zinc-400 hover:bg-white/5 hover:text-white">
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
              <div className="p-8 bg-zinc-950 text-white rounded-3xl shadow-2xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-green-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <h4 className="text-xs font-black uppercase tracking-widest text-green-400 mb-6 flex items-center gap-2">
                  <Shield className="h-4 w-4" /> Vetting Process
                </h4>
                <ul className="space-y-4 text-xs font-bold text-zinc-400">
                  <li className="flex items-start gap-3">
                    <div className="h-1.5 w-1.5 bg-green-500 rounded-full mt-1.5 shrink-0" />
                    Association License Verification
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="h-1.5 w-1.5 bg-green-500 rounded-full mt-1.5 shrink-0" />
                    Physical Site Safety Audit
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="h-1.5 w-1.5 bg-green-500 rounded-full mt-1.5 shrink-0" />
                    House Rules & Etiquette Review
                  </li>
                </ul>
                <Link href={`/${language}/mission`}>
                  <Button variant="link" className="mt-8 p-0 text-white font-black text-[10px] uppercase tracking-widest hover:text-green-400 transition-colors">
                    Learn about vetting <ExternalLink className="h-3 w-3 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </aside>
        </div>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <div className="mt-32 pt-20 border-t border-white/10">
            <h2 className="text-3xl font-black text-white mb-12 tracking-tighter uppercase">{t('blog.related_articles')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.map((related) => (
                <Link key={related.id} href={`/${language}/editorial/${related.slug}`}>
                  <article className="group cursor-pointer relative">
                    {/* Glow effect */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-green-500/0 via-green-500/10 to-emerald-500/0 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
                    
                    <div className="relative h-64 mb-6 rounded-2xl overflow-hidden bg-white/5 border border-white/10 group-hover:border-green-500/30 transition-all duration-500">
                      {related.heroImage && (
                        <Image
                          src={related.heroImage}
                          alt={related.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/20 to-transparent opacity-60" />
                    </div>
                    <Badge variant="outline" className="mb-4 bg-white/5 text-zinc-400 text-[10px] font-black uppercase border-white/10">
                      {related.category}
                    </Badge>
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-green-400 transition-colors">
                      {related.title}
                    </h3>
                    <p className="text-zinc-400 text-sm line-clamp-2 leading-relaxed">
                      {related.excerpt}
                    </p>
                    
                    {/* Bottom accent line */}
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full group-hover:w-1/4 transition-all duration-500" />
                  </article>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
