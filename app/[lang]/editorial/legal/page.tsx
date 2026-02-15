'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Scale, AlertTriangle, Clock, ArrowRight } from 'lucide-react';

interface LegalPageProps {
  params: Promise<{ lang: string }>;
}

const legalGuides = [
  {
    title: 'Is Weed Legal in Barcelona in 2026?',
    slug: 'is-weed-legal-barcelona-2026',
    excerpt: 'The real rules, fines, and grey areas explained. What every visitor needs to know before arriving.',
    readTime: 8,
    featured: true,
  },
  {
    title: 'Understanding Public Consumption Laws',
    slug: 'public-consumption-laws',
    excerpt: 'Why private clubs exist and what happens if you consume in public spaces.',
    readTime: 6,
  },
  {
    title: 'Your Rights During Police Interaction',
    slug: 'your-rights-police-interaction',
    excerpt: 'What to do if approached by authorities. Know your rights and stay compliant.',
    readTime: 5,
  },
  {
    title: 'The Grey Zone Explained',
    slug: 'grey-zone-explained',
    excerpt: 'Spain\'s unique legal framework and what it means for club members.',
    readTime: 7,
  },
  {
    title: 'Fines and Penalties: A Complete Guide',
    slug: 'fines-penalties-complete-guide',
    excerpt: 'From €601 to more serious consequences. Understanding the enforcement landscape.',
    readTime: 10,
  },
];

export default function LegalPage({ params }: LegalPageProps) {
  const [lang, setLang] = useState('en');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    params.then(({ lang: resolvedLang }) => {
      setLang(resolvedLang);
      setTimeout(() => setIsLoading(false), 300);
    });
  }, [params]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse space-y-8">
            <div className="h-48 bg-white/5 rounded-3xl" />
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-white/5 rounded-2xl" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-blue-500/5 to-transparent" />
        <div className="absolute top-20 right-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-3xl" />
      </div>

      {/* Hero */}
      <section className="relative py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Button variant="outline" asChild className="mb-6 border-white/10 text-zinc-300 hover:bg-white/5 hover:text-white">
              <Link href={`/${lang}/editorial`}>
                <ArrowLeft className="mr-2 w-4 h-4" />
                Back to Knowledge Vault
              </Link>
            </Button>
          </motion.div>
          
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 px-4 py-1.5 rounded-full text-sm font-medium mb-6"
            >
              <Scale className="w-4 h-4" />
              Legal Framework
            </motion.div>
            
            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-6 text-white"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Understanding Spain&apos;s{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                Cannabis Laws
              </span>
            </motion.h1>
            
            <motion.p 
              className="text-lg md:text-xl text-zinc-400 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Spain&apos;s relationship with cannabis is nuanced. Unlike Amsterdam&apos;s coffee shops, 
              Spain operates under a private association model. Learn what this means for you, 
              your rights, and how to stay compliant.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Key Points */}
      <section className="py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-6">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-amber-200 mb-2">Public Consumption is Illegal</h3>
                    <p className="text-sm text-amber-200/70">
                      Consuming in public spaces can result in fines starting at €601. 
                      Always consume inside the private club premises only.
                    </p>
                  </div>
                </div>
              </div>
              <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-6">
                <div className="flex items-start gap-3">
                  <Scale className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-blue-200 mb-2">Private Associations are Legal</h3>
                    <p className="text-sm text-blue-200/70">
                      Clubs operate as private, non-profit associations. Members can 
                      consume on premises when following house rules.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-16 md:py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <motion.h2 
              className="text-2xl md:text-3xl font-bold mb-8 text-white"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              Legal Guides & Resources
            </motion.h2>
            
            <div className="grid gap-4">
              {legalGuides.map((article, index) => (
                <motion.div
                  key={article.slug}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                >
                  <Link
                    href={`/${lang}/editorial/${article.slug}`}
                    className="group block rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 hover:border-blue-500/30 hover:bg-white/[0.07] transition-all duration-500"
                  >
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          {article.featured && (
                            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                              Featured
                            </Badge>
                          )}
                          <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                            <Clock className="w-3.5 h-3.5" />
                            {article.readTime} min read
                          </div>
                        </div>
                        <h3 className="text-xl font-bold mb-2 text-white group-hover:text-blue-400 transition-colors">
                          {article.title}
                        </h3>
                        <p className="text-zinc-400">
                          {article.excerpt}
                        </p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-zinc-500 group-hover:text-blue-400 group-hover:translate-x-1 transition-all shrink-0" />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-12 relative z-10 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <p className="text-sm text-zinc-500">
              <strong className="text-zinc-300">Disclaimer:</strong> This information is for educational purposes only 
              and does not constitute legal advice. Laws may change. Consult with a qualified 
              legal professional for advice specific to your situation.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
