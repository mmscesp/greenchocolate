'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, History, Calendar, MapPin, Clock, ArrowRight } from '@/lib/icons';
import { Heading, H1, H2, H3, H4, Label, Eyebrow, Text, Lead } from '@/components/typography';
import { useLanguage } from '@/hooks/useLanguage';

interface CulturePageProps {
  params: Promise<{ lang: string }>;
}

const cultureGuides = [
  {
    titleKey: 'editorial.culture.guides.1.title',
    slug: 'barcelona-cannabis-club-movement',
    excerptKey: 'editorial.culture.guides.1.excerpt',
    readTime: 12,
    featured: true,
  },
  {
    titleKey: 'editorial.culture.guides.2.title',
    slug: 'interview-club-founders',
    excerptKey: 'editorial.culture.guides.2.excerpt',
    readTime: 15,
  },
  {
    titleKey: 'editorial.culture.guides.3.title',
    slug: 'stigma-to-acceptance',
    excerptKey: 'editorial.culture.guides.3.excerpt',
    readTime: 8,
  },
  {
    titleKey: 'editorial.culture.guides.4.title',
    slug: 'club-as-community-center',
    excerptKey: 'editorial.culture.guides.4.excerpt',
    readTime: 6,
  },
  {
    titleKey: 'editorial.culture.guides.5.title',
    slug: 'madrid-vs-barcelona-comparison',
    excerptKey: 'editorial.culture.guides.5.excerpt',
    readTime: 7,
  },
];

export default function CulturePage({ params }: CulturePageProps) {
  const { t } = useLanguage();
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
      <div className="min-h-screen bg-gradient-to-b from-emerald-50/40 via-background to-amber-50/25">
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
    <div className="min-h-screen bg-gradient-to-b from-emerald-50/40 via-background to-amber-50/25 relative overflow-hidden">
      {/* Background Effects - subtle */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-emerald-500/10 to-transparent" />
        <div className="absolute top-[36%] right-[10%] h-[320px] w-[320px] rounded-full bg-gold/10 blur-3xl" />
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
                {t('editorial.culture.back_to_vault')}
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
              <History className="w-4 h-4" />
              <Label size="sm">{t('editorial.culture.badge')}</Label>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <H1 className="mb-6">
                {t('editorial.culture.title_prefix')}{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/80">
                  {t('editorial.culture.title_highlight')}
                </span>
              </H1>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Lead>
                {t('editorial.culture.lead')}
              </Lead>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <H3 className="mb-6">{t('editorial.culture.history_title')}</H3>
            
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 bg-purple-500/10 rounded-full flex items-center justify-center shrink-0 border border-purple-500/20">
                    <Calendar className="w-5 h-5 text-purple-400" />
                  </div>
                  <div className="w-0.5 h-full bg-emerald-500/20 mt-2" />
                </div>
                <div className="pb-6">
                  <span className="text-sm text-zinc-500">{t('editorial.culture.timeline.1990s.period')}</span>
                  <H4 className="text-white mb-2">{t('editorial.culture.timeline.1990s.title')}</H4>
                  <Text size="sm" variant="muted">
                    {t('editorial.culture.timeline.1990s.description')}
                  </Text>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 bg-violet-500/10 rounded-full flex items-center justify-center shrink-0 border border-violet-500/20">
                    <MapPin className="w-5 h-5 text-violet-400" />
                  </div>
                  <div className="w-0.5 h-full bg-emerald-500/20 mt-2" />
                </div>
                <div className="pb-6">
                  <span className="text-sm text-zinc-500">{t('editorial.culture.timeline.2006_2010.period')}</span>
                  <H4 className="text-white mb-2">{t('editorial.culture.timeline.2006_2010.title')}</H4>
                  <Text size="sm" variant="muted">
                    {t('editorial.culture.timeline.2006_2010.description')}
                  </Text>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 bg-fuchsia-500/10 rounded-full flex items-center justify-center shrink-0 border border-fuchsia-500/20">
                    <History className="w-5 h-5 text-fuchsia-400" />
                  </div>
                </div>
                <div>
                  <span className="text-sm text-zinc-500">{t('editorial.culture.timeline.present.period')}</span>
                  <H4 className="text-white mb-2">{t('editorial.culture.timeline.present.title')}</H4>
                  <Text size="sm" variant="muted">
                    {t('editorial.culture.timeline.present.description')}
                  </Text>
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
              {t('editorial.culture.guides_title')}
            </H2>
            
            <div className="grid gap-4">
              {cultureGuides.map((article, index) => (
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
                              {t('editorial.culture.featured')}
                            </Badge>
                          )}
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Clock className="w-3.5 h-3.5" />
                            {article.readTime} {t('editorial.min_read')}
                          </div>
                        </div>
                        <H3 className="mb-2 group-hover:text-primary transition-colors">
                          {t(article.titleKey)}
                        </H3>
                        <Text variant="muted">
                          {t(article.excerptKey)}
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
