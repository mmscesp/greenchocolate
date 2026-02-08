'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import HeroSection from '@/components/HeroSection';
import SafetyKitForm from '@/components/marketing/SafetyKitForm';
import WaitlistForm from '@/components/marketing/WaitlistForm';
import { FaqAccordion } from '@/components/ui/faq-accordion';
import TrustBadge from '@/components/trust/TrustBadge';
import { useLanguage } from '@/hooks/useLanguage';
import { BookOpen, Shield, AlertTriangle, Calendar, ArrowRight, Clock, MapPin } from 'lucide-react';
import { OrganizationStructuredData, WebSiteStructuredData } from '@/components/StructuredData';
import type { ArticleCard } from '@/app/actions/articles';

interface HomePageContentProps {
  featuredArticles: ArticleCard[];
}

// Content Statistics - Honest but compelling
const contentStats = [
  { value: '4', label: 'Expert Guides', description: '100% Verified Content', icon: BookOpen },
  { value: '2.5K+', label: 'Safety Kits', description: 'Downloaded by Travelers', icon: Shield },
  { value: '€0', label: 'Fines', description: 'For Protected Members', icon: AlertTriangle },
  { value: 'Mar', label: '2026', description: 'Barcelona Club Launch', icon: Calendar },
];

export default function HomePageContent({ featuredArticles }: HomePageContentProps) {
  const { t } = useLanguage();

  return (
    <>
      {/* JSON-LD Structured Data */}
      <OrganizationStructuredData
        schema={{
          name: 'SocialClubsMaps',
          url: 'https://socialclubsmaps.com',
          logo: 'https://socialclubsmaps.com/logo.png',
          description: 'Directorio de clubs sociales de cannabis en España. Encuentra y únete a los mejores CSCs.',
          sameAs: [
            'https://www.instagram.com/socialclubsmaps',
            'https://www.twitter.com/socialclubsmaps',
            'https://www.facebook.com/socialclubsmaps',
          ],
        }}
      />
      <WebSiteStructuredData name="SocialClubsMaps" url="https://socialclubsmaps.com" />

        <div className="min-h-screen bg-white relative overflow-hidden">
        {/* Hero Section */}
        <HeroSection />

        {/* Content Statistics */}
        <section className="py-16 bg-zinc-950 border-y border-zinc-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {contentStats.map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="flex justify-center mb-3">
                    <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center">
                      <stat.icon className="h-6 w-6 text-green-400" />
                    </div>
                  </div>
                  <div className="text-3xl font-black text-white mb-1">{stat.value}</div>
                  <div className="text-sm font-bold text-green-400 mb-1">{stat.label}</div>
                  <div className="text-xs font-medium text-zinc-500 uppercase tracking-wider">{stat.description}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Safety & Etiquette - The Lead Magnet */}
        <section className="py-24 bg-white relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <div className="flex gap-2 mb-6">
                  <TrustBadge variant="expert" />
                  <TrustBadge variant="privacy" />
                </div>
                <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-8 leading-tight">
                  Spain is not Amsterdam. <br />
                  <span className="text-green-600">Know the Rules.</span>
                </h2>
                <div className="space-y-6 mb-10">
                  {[
                    { title: 'Avoid Fines', desc: 'Public possession can cost you €601–€30,000. Learn how to stay safe.', icon: AlertTriangle },
                    { title: 'Etiquette First', desc: 'Social clubs are private associations, not coffee shops. Respect is the currency.', icon: BookOpen },
                    { title: 'Verified Only', desc: 'We only list clubs that meet our strict safety and legal standards.', icon: Shield },
                  ].map((item, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center shrink-0">
                        <item.icon className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 mb-1">{item.title}</h4>
                        <p className="text-gray-600">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative">
                <div className="absolute -inset-4 bg-green-100/50 rounded-3xl blur-2xl"></div>
                <div className="relative">
                  <SafetyKitForm />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Articles */}
        <section className="py-24 bg-zinc-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
              <div className="max-w-2xl">
                <Badge variant="outline" className="mb-4 border-green-200 text-green-700">Knowledge Hub</Badge>
                <h2 className="text-4xl font-bold text-gray-900 leading-tight">
                  Latest Expert Guides
                </h2>
              </div>
              <Link href="/learn">
                <Button variant="outline" className="rounded-full px-8">
                  View All Guides <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredArticles.slice(0, 4).map((article) => (
                <Link key={article.id} href={`/learn/${article.slug}`}>
                  <article className="group bg-white rounded-2xl border border-zinc-100 p-6 transition-all hover:border-green-500 hover:shadow-xl flex flex-col h-full">
                    <div className="flex justify-between items-start mb-4">
                      <Badge variant="outline" className="bg-zinc-50 text-zinc-500 text-[10px] font-black border-zinc-200 uppercase tracking-widest px-2">
                        {article.category}
                      </Badge>
                      <Clock className="h-3 w-3 text-zinc-400" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-green-600 transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-zinc-500 text-sm leading-relaxed mb-4 line-clamp-2">
                      {article.excerpt}
                    </p>
                    <div className="mt-auto pt-4 flex items-center justify-between border-t border-zinc-50">
                      <span className="text-xs font-bold text-green-600 uppercase tracking-wider">
                        Read Guide
                      </span>
                      <span className="text-[10px] font-bold text-zinc-300 uppercase">
                        {article.readTime} min
                      </span>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Trusted Nav Layer - Why Us */}
        <section className="py-24 bg-zinc-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl lg:text-5xl font-bold mb-16">The Verified Navigation Layer</h2>
            <div className="grid md:grid-cols-3 gap-12">
              <div className="p-8 border border-white/10 rounded-2xl bg-white/5">
                <div className="w-16 h-16 bg-green-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 text-green-400 text-3xl">
                  📍
                </div>
                <h3 className="text-xl font-bold mb-4">Regulatory Wiki</h3>
                <p className="text-zinc-400 leading-relaxed">Permanent, expert-reviewed knowledge nodes on laws, rights, and etiquette.</p>
              </div>
              <div className="p-8 border border-white/10 rounded-2xl bg-white/5">
                <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 text-blue-400 text-3xl">
                  🛡️
                </div>
                <h3 className="text-xl font-bold mb-4">Confidence UI</h3>
                <p className="text-zinc-400 leading-relaxed">Visual status indicators showing the reliability and safety level of every club.</p>
              </div>
              <div className="p-8 border border-white/10 rounded-2xl bg-white/5">
                <div className="w-16 h-16 bg-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 text-purple-400 text-3xl">
                  🎟️
                </div>
                <h3 className="text-xl font-bold mb-4">Verified Access</h3>
                <p className="text-zinc-400 leading-relaxed">Standardized membership request workflows that prioritize your privacy.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Coming Soon: Barcelona */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <Badge className="mb-6 bg-green-500/10 text-green-700 border-green-200">Launching March 2026</Badge>
                <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-8 leading-tight">
                  First City: <span className="text-green-600">Barcelona</span>
                </h2>
                <p className="text-xl text-gray-600 mb-10 leading-relaxed">
                  We're curating the first verified database of Barcelona cannabis social clubs. Launching with 20-40 club profiles and 5-10 verified partners.
                </p>
                <div className="space-y-4 mb-10">
                  {[
                    { date: 'March 2026', event: 'Barcelona Club Directory Launch' },
                    { date: 'Q2 2026', event: 'Madrid & Valencia Expansion' },
                    { date: 'Q3 2026', event: 'Full Partner Verification System' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center shrink-0">
                        <Calendar className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <div className="font-bold text-gray-900">{item.date}</div>
                        <div className="text-sm text-gray-500">{item.event}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/waitlist">
                    <Button className="bg-green-600 text-white hover:bg-green-500 px-8 py-4 rounded-2xl font-bold w-full sm:w-auto">
                      Join Early Access Waitlist
                    </Button>
                  </Link>
                  <Link href="/learn">
                    <Button variant="outline" className="rounded-2xl px-8 py-4 w-full sm:w-auto">
                      Browse Knowledge Hub
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="relative">
                <div className="absolute -inset-4 bg-green-100/50 rounded-3xl blur-2xl"></div>
                <div className="relative bg-zinc-900 rounded-3xl p-8 min-h-[400px] flex flex-col items-center justify-center">
                  <MapPin className="h-16 w-16 text-green-500 mb-4" />
                  <h3 className="text-2xl font-bold text-white mb-2">Barcelona</h3>
                  <p className="text-zinc-400 text-center max-w-xs">
                    Spain's most established cannabis social club scene. We're mapping every verified club.
                  </p>
                  <div className="mt-8 flex items-center gap-2 text-sm text-zinc-500">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    <span>Launching Soon</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className='py-24 bg-white'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
            <div className='text-center mb-12'>
              <Badge variant='outline' className='mb-4 border-green-200 text-green-700'>
                Common Questions
              </Badge>
              <h2 className='text-4xl font-bold text-gray-900'>
                Everything You Need to Know
              </h2>
            </div>
            <FaqAccordion />
          </div>
        </section>
      </div>
    </>
  );
}
