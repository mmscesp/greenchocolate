'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Shield, AlertTriangle, Heart, Clock, ArrowRight, CheckCircle } from 'lucide-react';

interface SafetyPageProps {
  params: Promise<{ lang: string }>;
}

const safetyProtocols = [
  {
    title: 'Start Low, Go Slow',
    description: 'Especially with edibles. Wait at least 2 hours before considering more.',
    icon: Clock,
  },
  {
    title: 'Stay Hydrated',
    description: 'Keep water nearby. Cannabis can cause dry mouth and dehydration.',
    icon: Heart,
  },
  {
    title: 'Know Your Limits',
    description: 'Everyone\'s tolerance is different. Listen to your body.',
    icon: Shield,
  },
  {
    title: 'Emergency Contacts',
    description: 'Save local emergency numbers. Know where the nearest hospital is.',
    icon: AlertTriangle,
  },
];

const safetyGuides = [
  {
    title: 'Edibles Safety Guide',
    slug: 'edibles-safety-guide',
    excerpt: 'Why edibles hit different and how to dose safely.',
    readTime: 6,
  },
  {
    title: 'First Time in a Club',
    slug: 'first-time-club-guide',
    excerpt: 'What to expect and how to stay comfortable.',
    readTime: 5,
  },
  {
    title: 'Recognizing Overconsumption',
    slug: 'recognizing-overconsumption',
    excerpt: 'Signs to watch for and how to help someone who\'s had too much.',
    readTime: 4,
  },
];

export default function SafetyPage({ params }: SafetyPageProps) {
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
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
        <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-amber-500/5 to-transparent" />
        <div className="absolute top-20 right-0 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-orange-500/5 rounded-full blur-3xl" />
      </div>

      {/* Hero */}
      <section className="relative py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 text-amber-400 px-4 py-1.5 rounded-full text-sm font-medium mb-6"
            >
              <Shield className="w-4 h-4" />
              Safety & Harm Reduction
            </motion.div>
            
            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-6 text-white"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Your Safety is{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">
                Our Priority
              </span>
            </motion.h1>
            
            <motion.p 
              className="text-lg md:text-xl text-zinc-400 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Evidence-based harm reduction information to help you make informed decisions 
              and stay safe while exploring Spain&apos;s cannabis culture.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Core Protocols */}
      <section className="py-12 relative z-10 border-y border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2 
            className="text-xl font-semibold mb-8 text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Core Safety Protocols
          </motion.h2>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {safetyProtocols.map((protocol, index) => (
              <div 
                key={index}
                className="flex items-start gap-4 p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm"
              >
                <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center shrink-0 border border-amber-500/20">
                  <protocol.icon className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">{protocol.title}</h3>
                  <p className="text-sm text-zinc-400">{protocol.description}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Safety Guides */}
      <section className="py-16 md:py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2 
            className="text-2xl md:text-3xl font-bold mb-8 text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            Safety Guides
          </motion.h2>
          
          <div className="grid gap-4">
            {safetyGuides.map((guide, index) => (
              <motion.div
                key={guide.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
              >
                <Link
                  href={`/${lang}/editorial/${guide.slug}`}
                  className="group block rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 hover:border-amber-500/30 hover:bg-white/[0.07] transition-all duration-500"
                >
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                          <Clock className="w-3.5 h-3.5" />
                          {guide.readTime} min read
                        </div>
                      </div>
                      <h3 className="text-xl font-bold mb-2 text-white group-hover:text-amber-400 transition-colors">
                        {guide.title}
                      </h3>
                      <p className="text-zinc-400">
                        {guide.excerpt}
                      </p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-zinc-500 group-hover:text-amber-400 group-hover:translate-x-1 transition-all shrink-0" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Emergency Info */}
      <section className="py-12 relative z-10 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="rounded-2xl border border-red-500/20 bg-red-500/5 p-8 backdrop-blur-sm"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center shrink-0 border border-red-500/20">
                <AlertTriangle className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white mb-2">Emergency Information</h3>
                <p className="text-zinc-400 mb-4">
                  If you or someone you know is experiencing a medical emergency, 
                  call 112 immediately. This is the universal emergency number in Spain.
                </p>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 text-sm text-zinc-300">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    Emergency: 112
                  </div>
                  <div className="flex items-center gap-2 text-sm text-zinc-300">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    Police: 091
                  </div>
                  <div className="flex items-center gap-2 text-sm text-zinc-300">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    Medical: 061
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
