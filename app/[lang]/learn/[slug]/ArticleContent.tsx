'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Footer from '@/components/Footer';
import LanguageSelector from '@/components/LanguageSelector';
import { useLanguage } from '@/hooks/useLanguage';
import { ArticleDetail, ArticleCard } from '@/app/actions/articles';
import { Leaf, Calendar, Clock, User, ArrowLeft, Share2, Shield, Info, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import ExpertByline from '@/components/trust/ExpertByline';
import TrustBadge from '@/components/trust/TrustBadge';
import SafetyKitForm from '@/components/marketing/SafetyKitForm';

interface ArticleContentProps {
  article: ArticleDetail;
  relatedArticles?: ArticleCard[];
}

export default function ArticleContent({ article, relatedArticles = [] }: ArticleContentProps) {
  const { t, language } = useLanguage();

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href={`/${language}`} className="flex items-center gap-2 group">
                <Leaf className="h-6 w-6 text-green-600 group-hover:rotate-12 transition-transform" />
                <span className="text-lg font-black tracking-tighter text-zinc-900 uppercase">SocialClubsMaps</span>
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <Link href={`/${language}/learn`}>
                <Button variant="ghost" className="text-xs font-black uppercase tracking-widest text-zinc-500 hover:text-zinc-900">
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
              <TrustBadge variant="expert" />
              <Badge variant="secondary" className="bg-white/10 text-white border-white/20 backdrop-blur-md uppercase tracking-widest text-[10px] font-black">
                {article.category}
              </Badge>
            </div>
            <h1 className="text-4xl lg:text-7xl font-black text-white mb-6 leading-[0.95] tracking-tighter">
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-[1fr_350px] gap-20">
          
          {/* Article Main Body */}
          <article>
            <div className="bg-white">
              {/* Expert Byline */}
              <ExpertByline 
                name={article.authorName} 
                role="Legal & Compliance Specialist" 
                date={new Date(article.publishedAt || '').toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
              />

              {/* Regulatory Box */}
              <div className="mb-12 p-8 bg-zinc-50 rounded-3xl border border-zinc-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5">
                  <Shield className="h-24 w-24" />
                </div>
                <div className="flex items-center gap-2 text-zinc-900 font-black text-xs uppercase tracking-widest mb-4">
                  <Info className="h-4 w-4 text-blue-500" />
                  Compliance Summary
                </div>
                <p className="text-zinc-600 font-medium leading-relaxed relative z-10">
                  {article.excerpt}
                </p>
              </div>

              {/* Content Render */}
              <div className="prose prose-zinc prose-lg max-w-none prose-headings:font-black prose-headings:tracking-tighter prose-p:text-zinc-600 prose-p:leading-relaxed prose-strong:text-zinc-900">
                <div className="space-y-8">
                  {article.content.split('\n\n').map((paragraph, index) => (
                    <p key={index}>
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>

              {/* Tags & Interaction */}
              <div className="mt-20 pt-8 border-t border-zinc-100 flex flex-wrap items-center justify-between gap-6">
                <div className="flex flex-wrap gap-2">
                  {article.tags.map(tag => (
                    <Badge key={tag} variant="outline" className="text-[10px] font-black uppercase tracking-widest bg-zinc-50 text-zinc-500 border-zinc-200">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <Button variant="outline" size="sm" className="rounded-full font-black text-[10px] uppercase tracking-widest px-6 group">
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
          <div className="mt-32 pt-20 border-t border-zinc-100">
            <h2 className="text-3xl font-black text-zinc-900 mb-12 tracking-tighter uppercase">{t('blog.related_articles')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {relatedArticles.map((related) => (
                <Link key={related.id} href={`/${language}/learn/${related.slug}`}>
                  <article className="group cursor-pointer">
                    <div className="relative h-64 mb-6 rounded-2xl overflow-hidden bg-zinc-100 border border-zinc-100">
                      {related.heroImage && (
                        <Image
                          src={related.heroImage}
                          alt={related.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      )}
                    </div>
                    <Badge variant="outline" className="mb-4 bg-zinc-50 text-zinc-500 text-[10px] font-black uppercase border-zinc-200">
                      {related.category}
                    </Badge>
                    <h3 className="text-xl font-bold text-zinc-900 mb-2 group-hover:text-green-600 transition-colors">
                      {related.title}
                    </h3>
                    <p className="text-zinc-500 text-sm line-clamp-2 leading-relaxed">
                      {related.excerpt}
                    </p>
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
