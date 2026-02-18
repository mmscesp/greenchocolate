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
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse space-y-8">
            <div className="h-48 bg-muted rounded-3xl" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-32 bg-muted rounded-2xl" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative">
      {/* Background Effects - subtle */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-primary/5 to-transparent" />
      </div>

      {/* Hero */}
      <section className="relative py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-6"
            >
              <Shield className="w-4 h-4" />
              Safety First
            </motion.div>
            
            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-6 text-foreground"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Stay Safe, Stay{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/80">
                Informed
              </span>
            </motion.h1>
            
            <motion.p 
              className="text-lg md:text-xl text-muted-foreground leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Harm reduction resources and safety protocols for responsible cannabis consumption. 
              Your safety is our priority.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Core Protocols */}
      <section className="py-12 relative z-10 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2 
            className="text-xl font-semibold mb-8 text-foreground"
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
                className="flex items-start gap-4 p-6 rounded-2xl border bg-card"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0 border border-primary/20">
                  <protocol.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">{protocol.title}</h3>
                  <p className="text-sm text-muted-foreground">{protocol.description}</p>
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
            className="text-2xl md:text-3xl font-bold mb-8 text-foreground"
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
                  className="group block rounded-2xl border bg-card p-6 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
                >
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Clock className="w-3.5 h-3.5" />
                          {guide.readTime} min read
                        </div>
                      </div>
                      <h3 className="text-xl font-bold mb-2 text-foreground group-hover:text-primary transition-colors">
                        {guide.title}
                      </h3>
                      <p className="text-muted-foreground">
                        {guide.excerpt}
                      </p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Emergency Info */}
      <section className="py-12 relative z-10 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="rounded-2xl border border-red-500/20 bg-red-500/5 p-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center shrink-0 border border-red-500/20">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Emergency Information</h3>
                <p className="text-sm text-muted-foreground">
                  In case of medical emergency, call 112 (EU Emergency) or local emergency services. 
                  Be honest with medical professionals about cannabis consumption—it helps them provide proper care.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
