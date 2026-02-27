'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Scale, AlertTriangle, Clock, ArrowRight } from '@/lib/icons';
import { Heading, H1, H2, H3, H4, Label, Eyebrow, Text, Lead } from '@/components/typography';
import { useLanguage } from '@/hooks/useLanguage';

interface LegalPageProps {
  params: Promise<{ lang: string }>;
}

const legalGuides = [
  {
    titleKey: 'editorial.legal.guides.1.title',
    slug: 'is-weed-legal-barcelona-2026',
    excerptKey: 'editorial.legal.guides.1.excerpt',
    readTime: 8,
    featured: true,
  },
  {
    titleKey: 'editorial.legal.guides.2.title',
    slug: 'public-consumption-laws',
    excerptKey: 'editorial.legal.guides.2.excerpt',
    readTime: 6,
  },
  {
    titleKey: 'editorial.legal.guides.3.title',
    slug: 'your-rights-police-interaction',
    excerptKey: 'editorial.legal.guides.3.excerpt',
    readTime: 5,
  },
  {
    titleKey: 'editorial.legal.guides.4.title',
    slug: 'grey-zone-explained',
    excerptKey: 'editorial.legal.guides.4.excerpt',
    readTime: 7,
  },
  {
    titleKey: 'editorial.legal.guides.5.title',
    slug: 'fines-penalties-complete-guide',
    excerptKey: 'editorial.legal.guides.5.excerpt',
    readTime: 10,
  },
];

export default function LegalPage({ params }: LegalPageProps) {
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
        <div className="absolute top-[30%] right-[10%] h-[320px] w-[320px] rounded-full bg-gold/10 blur-3xl" />
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
                {t('editorial.legal.back_to_vault')}
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
              <Scale className="w-4 h-4" />
              <Label size="sm">{t('editorial.legal.badge')}</Label>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <H1 className="mb-6">
                {t('editorial.legal.title_prefix')}{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/80">
                  {t('editorial.legal.title_highlight')}
                </span>
              </H1>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Lead>
                {t('editorial.legal.lead')}
              </Lead>
            </motion.div>
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
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <H4 className="mb-2">{t('editorial.legal.key_point_public.title')}</H4>
                    <Text size="sm" variant="muted">
                      {t('editorial.legal.key_point_public.description')}
                    </Text>
                  </div>
                </div>
              </div>
              <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6">
                <div className="flex items-start gap-3">
                  <Scale className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <H4 className="mb-2">{t('editorial.legal.key_point_private.title')}</H4>
                    <Text size="sm" variant="muted">
                      {t('editorial.legal.key_point_private.description')}
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
              {t('editorial.legal.guides_title')}
            </H2>
            
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
                    className="group block rounded-2xl border bg-card p-6 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
                  >
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          {article.featured && (
                            <Badge className="bg-primary/10 text-primary border-primary/20">
                              {t('editorial.legal.featured')}
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

      {/* Disclaimer */}
      <section className="py-12 relative z-10 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <Text size="sm" variant="muted" className="text-center">
              <strong className="text-foreground">{t('editorial.legal.disclaimer_prefix')}</strong>{' '}
              {t('editorial.legal.disclaimer_body')}
            </Text>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
