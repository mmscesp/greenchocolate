'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Heart, Users, Camera, Smartphone, Clock, ArrowRight } from 'lucide-react';

interface EtiquettePageProps {
  params: Promise<{ lang: string }>;
}

const etiquetteGuides = [
  {
    title: '5 Mistakes Tourists Make',
    slug: '5-mistakes-tourists-make',
    excerpt: 'Don\'t be "that" tourist. Learn the local norms and club etiquette before you arrive.',
    readTime: 6,
    featured: true,
  },
  {
    title: 'Photography Rules: What You Need to Know',
    slug: 'photography-rules-clubs',
    excerpt: 'Why clubs ban photos and how to respect privacy in shared spaces.',
    readTime: 4,
  },
  {
    title: 'Tipping and Contribution Culture',
    slug: 'tipping-contribution-culture',
    excerpt: 'Understanding how clubs fund their operations and member expectations.',
    readTime: 5,
  },
  {
    title: 'Conversations with Locals',
    slug: 'conversations-locals',
    excerpt: 'How to engage respectfully with club members and staff.',
    readTime: 4,
  },
  {
    title: 'Respecting Club Hierarchy',
    slug: 'respecting-club-hierarchy',
    excerpt: 'Understanding club governance and how decisions are made.',
    readTime: 5,
  },
];

export default function EtiquettePage({ params }: EtiquettePageProps) {
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
        <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-green-500/5 to-transparent" />
        <div className="absolute top-20 right-0 w-[600px] h-[600px] bg-green-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-3xl" />
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
              className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-1.5 rounded-full text-sm font-medium mb-6"
            >
              <Heart className="w-4 h-4" />
              Club Etiquette
            </motion.div>
            
            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-6 text-white"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Be a{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">
                Respectful Guest
              </span>
            </motion.h1>
            
            <motion.p 
              className="text-lg md:text-xl text-zinc-400 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Private cannabis clubs thrive on mutual respect and community. 
              Learn the unwritten rules, understand local customs, and 
              become a valued member of the community rather than a passing tourist.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Core Principles */}
      <section className="py-12 relative z-10 border-y border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <motion.h2 
              className="text-xl font-semibold mb-6 text-white"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Core Principles
            </motion.h2>
            
            <motion.div 
              className="grid gap-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <div className="flex items-start gap-4 p-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm">
                <div className="w-10 h-10 bg-green-500/10 rounded-full flex items-center justify-center shrink-0 border border-green-500/20">
                  <Users className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">Respect Privacy</h3>
                  <p className="text-sm text-zinc-400">
                    No photos, no social media check-ins. What happens in the club stays in the club.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 p-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm">
                <div className="w-10 h-10 bg-emerald-500/10 rounded-full flex items-center justify-center shrink-0 border border-emerald-500/20">
                  <Smartphone className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">Phones Away</h3>
                  <p className="text-sm text-zinc-400">
                    Keep your phone in your pocket. Looking at it may be seen as disrespectful.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 p-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm">
                <div className="w-10 h-10 bg-teal-500/10 rounded-full flex items-center justify-center shrink-0 border border-teal-500/20">
                  <Camera className="w-5 h-5 text-teal-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">No External Guests</h3>
                  <p className="text-sm text-zinc-400">
                    Clubs are private. You cannot bring guests who are not members.
                  </p>
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
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              Etiquette Guides
            </motion.h2>
            
            <div className="grid gap-4">
              {etiquetteGuides.map((article, index) => (
                <motion.div
                  key={article.slug}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                >
                  <Link
                    href={`/${lang}/editorial/${article.slug}`}
                    className="group block rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 hover:border-green-500/30 hover:bg-white/[0.07] transition-all duration-500"
                  >
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          {article.featured && (
                            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                              Featured
                            </Badge>
                          )}
                          <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                            <Clock className="w-3.5 h-3.5" />
                            {article.readTime} min read
                          </div>
                        </div>
                        <h3 className="text-xl font-bold mb-2 text-white group-hover:text-green-400 transition-colors">
                          {article.title}
                        </h3>
                        <p className="text-zinc-400">
                          {article.excerpt}
                        </p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-zinc-500 group-hover:text-green-400 group-hover:translate-x-1 transition-all shrink-0" />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
