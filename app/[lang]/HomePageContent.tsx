'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import HeroSection from '@/components/HeroSection';
import SafetyKitForm from '@/components/marketing/SafetyKitForm';
import TouristMistakes from '@/components/marketing/TouristMistakes';
import WaitlistForm from '@/components/marketing/WaitlistForm';
import FineCalculator from '@/components/marketing/FineCalculator';
import EligibilityQuiz from '@/components/marketing/EligibilityQuiz';
import FeaturedArticles from '@/components/marketing/FeaturedArticles';
import WhyUsSection from '@/components/marketing/WhyUsSection';
import { FaqAccordion } from '@/components/ui/faq-accordion';
import TrustBadge from '@/components/trust/TrustBadge';
import { useLanguage } from '@/hooks/useLanguage';
import { BookOpen, Shield, AlertTriangle, Calendar, ArrowRight, Clock, MapPin, CheckCircle, Lock, Eye, Calculator } from 'lucide-react';
import { motion } from 'framer-motion';
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

        <div className="min-h-screen bg-white relative">
        {/* Hero Section (stats integrated inside) */}
        <HeroSection />

        {/* What Tourists Get Wrong */}
        <section className="py-24 bg-white relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <TouristMistakes />
          </div>
        </section>

        {/* Interactive Tools - Risk Radar & Eligibility */}
        <section className="py-24 bg-zinc-900 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-red-500 rounded-full blur-3xl" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/20 rounded-full text-indigo-300 mb-6">
                <Calculator className="h-4 w-4" />
                <span className="text-sm font-bold">Interactive Tools</span>
              </div>
              <h2 className="text-4xl lg:text-5xl font-black text-white mb-4">
                Know Before You Go
              </h2>
              <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
                Two essential tools to check your eligibility and understand the real costs of mistakes.
              </p>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-8 items-start">
              <FineCalculator />
              <EligibilityQuiz />
            </div>
          </div>
        </section>

        {/* Featured Articles */}
        <section className="py-24 bg-gradient-to-b from-zinc-50 to-white relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-20 left-10 w-72 h-72 bg-green-100 rounded-full blur-3xl opacity-30" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-30" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {/* Section Header */}
            <div className="text-center mb-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 rounded-full text-green-600 mb-6"
              >
                <BookOpen className="h-4 w-4" />
                <span className="text-sm font-bold">Knowledge Hub</span>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-4xl lg:text-5xl font-black text-gray-900 mb-4"
              >
                Expert Guides & Insights
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-xl text-gray-600 max-w-2xl mx-auto mb-8"
              >
                Deep dives into Spanish cannabis culture, written by locals and legal experts.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                <Link href="/editorial">
                  <Button
                    variant="outline"
                    className="rounded-full px-8 py-6 text-base font-bold border-2 hover:bg-green-50 hover:border-green-300 transition-all group"
                  >
                    Browse All Guides
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </motion.div>
            </div>

            {/* Articles Grid */}
            <FeaturedArticles articles={featuredArticles.slice(0, 4)} />
          </div>
        </section>

        {/* Trusted Nav Layer - Why Us */}
        <WhyUsSection />

        {/* Coming Soon: Barcelona */}
        <section className="py-24 bg-zinc-900 relative overflow-hidden">
          {/* Background Effects */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-green-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-3xl" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <Badge className="mb-6 bg-green-500/10 text-green-400 border-green-500/20 backdrop-blur-sm">Launching March 2026</Badge>
                <h2 className="text-4xl lg:text-5xl font-black text-white mb-8 leading-tight">
                  First City:{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">
                    Barcelona
                  </span>
                </h2>
                <p className="text-xl text-zinc-400 mb-10 leading-relaxed">
                  We're curating the first verified database of Barcelona cannabis social clubs. Launching with 20-40 club profiles and 5-10 verified partners.
                </p>
                <div className="space-y-4 mb-10">
                  {[
                    { date: 'March 2026', event: 'Barcelona Club Directory Launch' },
                    { date: 'Q2 2026', event: 'Madrid & Valencia Expansion' },
                    { date: 'Q3 2026', event: 'Full Partner Verification System' },
                  ].map((item, i) => (
                    <motion.div 
                      key={i} 
                      className="flex items-center gap-4 p-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.1 * i }}
                    >
                      <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center shrink-0 border border-green-500/20">
                        <Calendar className="h-5 w-5 text-green-400" />
                      </div>
                      <div>
                        <div className="font-bold text-white">{item.date}</div>
                        <div className="text-sm text-zinc-400">{item.event}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/waitlist">
                    <Button className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-8 py-4 rounded-2xl font-bold w-full sm:w-auto border-0 shadow-lg shadow-green-500/25">
                      Join Early Access Waitlist
                    </Button>
                  </Link>
                  <Link href="/editorial">
                    <Button variant="outline" className="rounded-2xl px-8 py-4 w-full sm:w-auto border-white/10 text-zinc-300 hover:bg-white/5 hover:text-white">
                      Browse Knowledge Hub
                    </Button>
                  </Link>
                </div>
              </motion.div>
              
              <motion.div 
                className="relative"
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="absolute -inset-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-3xl blur-2xl"></div>
                <div className="relative rounded-3xl p-8 min-h-[400px] flex flex-col items-center justify-center border border-white/10 bg-white/5 backdrop-blur-sm">
                  <div className="w-20 h-20 bg-green-500/10 rounded-2xl flex items-center justify-center mb-6 border border-green-500/20">
                    <MapPin className="h-10 w-10 text-green-400" />
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-4">Barcelona</h3>
                  <p className="text-zinc-400 text-center max-w-xs text-lg">
                    Spain's most established cannabis social club scene. We're mapping every verified club.
                  </p>
                  <div className="mt-8 flex items-center gap-3 px-6 py-3 rounded-full bg-green-500/10 border border-green-500/20">
                    <span className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></span>
                    <span className="text-green-400 font-medium">Launching Soon</span>
                  </div>
                  
                  {/* Decorative elements */}
                  <div className="absolute top-4 right-4 w-2 h-2 bg-green-400/50 rounded-full"></div>
                  <div className="absolute top-8 right-8 w-1 h-1 bg-emerald-400/30 rounded-full"></div>
                  <div className="absolute bottom-4 left-4 w-2 h-2 bg-emerald-400/50 rounded-full"></div>
                </div>
              </motion.div>
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
