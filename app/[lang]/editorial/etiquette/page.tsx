'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Heart, Users, Camera, Smartphone, Clock, ArrowRight } from '@/lib/icons';
import { Heading, H1, H2, H3, H4, Label, Eyebrow, Text, Lead } from '@/components/typography';

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
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse space-y-8">
            <div className="h-48 bg-muted rounded-3xl" />
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
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
      <section className="relative pt-24 md:pt-32 pb-16 lg:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Button variant="outline" asChild className="mb-6 border-border text-muted-foreground hover:bg-muted hover:text-foreground">
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
              className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-6"
            >
              <Heart className="w-4 h-4" />
              <Label size="sm">Club Etiquette</Label>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <H1 className="mb-6">
                Be a Respectful{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/80">
                  Club Guest
                </span>
              </H1>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Lead>
                Every club has its own culture and rules. Learn the unwritten norms,
                respect the space, and connect with the community like a local.
              </Lead>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Etiquette Tips */}
      <section className="py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6">
                <div className="flex items-start gap-3">
                  <Smartphone className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <H4 className="mb-2">Phones Away</H4>
                    <Text size="sm" variant="muted">
                      Most clubs ask you to keep your phone in your pocket.
                      No photos without explicit permission.
                    </Text>
                  </div>
                </div>
              </div>
              <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6">
                <div className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <H4 className="mb-2">Respect Privacy</H4>
                    <Text size="sm" variant="muted">
                      Don&apos;t discuss other members or share who you met at the club.
                      What happens in the club stays in the club.
                    </Text>
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
            <H2 className="mb-8">
              Etiquette Guides
            </H2>
            
            <div className="grid gap-4">
              {etiquetteGuides.map((article, index) => (
                <motion.div
                  key={article.slug}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                >
                  <Link
                    href={`/${lang}/editorial/${article.slug}`}
                    className="group block rounded-2xl border bg-card p-6 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
                  >
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          {article.featured && (
                            <Badge className="bg-primary/10 text-primary border-primary/20">
                              Featured
                            </Badge>
                          )}
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Clock className="w-3.5 h-3.5" />
                            {article.readTime} min read
                          </div>
                        </div>
                        <H3 className="mb-2 group-hover:text-primary transition-colors">
                          {article.title}
                        </H3>
                        <Text variant="muted">
                          {article.excerpt}
                        </Text>
                      </div>
                      <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0" />
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
