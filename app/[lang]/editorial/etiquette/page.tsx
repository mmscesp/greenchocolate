'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Heart, Users, Camera, Smartphone, Clock, ArrowRight } from '@/lib/icons';
import { Heading, H1, H2, H3, H4, Label, Eyebrow, Text, Lead } from '@/components/typography';
import { useLanguage } from '@/hooks/useLanguage';

interface EtiquettePageProps {
  params: Promise<{ lang: string }>;
}

const etiquetteGuides = [
  {
    titleKey: 'editorial.etiquette.guides.1.title',
    slug: '5-mistakes-tourists-make',
    excerptKey: 'editorial.etiquette.guides.1.excerpt',
    readTime: 6,
    featured: true,
  },
  {
    titleKey: 'editorial.etiquette.guides.2.title',
    slug: 'photography-rules-clubs',
    excerptKey: 'editorial.etiquette.guides.2.excerpt',
    readTime: 4,
  },
  {
    titleKey: 'editorial.etiquette.guides.3.title',
    slug: 'tipping-contribution-culture',
    excerptKey: 'editorial.etiquette.guides.3.excerpt',
    readTime: 5,
  },
  {
    titleKey: 'editorial.etiquette.guides.4.title',
    slug: 'conversations-locals',
    excerptKey: 'editorial.etiquette.guides.4.excerpt',
    readTime: 4,
  },
  {
    titleKey: 'editorial.etiquette.guides.5.title',
    slug: 'respecting-club-hierarchy',
    excerptKey: 'editorial.etiquette.guides.5.excerpt',
    readTime: 5,
  },
];

export default function EtiquettePage({ params }: EtiquettePageProps) {
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
      <div className="min-h-screen bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse space-y-8">
            <div className="h-48 bg-zinc-900 rounded-3xl" />
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-zinc-900 rounded-2xl" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-900/50 via-black to-zinc-900/50 pointer-events-none" />
      {/* Background Effects - subtle */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-[#E8A838]/5 to-transparent" />
        <div className="absolute top-[34%] right-[8%] h-[300px] w-[300px] rounded-full bg-[#E8A838]/5 blur-[100px]" />
      </div>

      {/* Hero */}
      <section className="relative pt-24 md:pt-32 pb-16 lg:pb-24 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Button variant="outline" asChild className="mb-6 border-white/10 text-zinc-400 hover:bg-white/5 hover:text-white rounded-full">
              <Link href={`/${lang}/editorial`}>
                <ArrowLeft className="mr-2 w-4 h-4" />
                {t('editorial.etiquette.back_to_vault')}
              </Link>
            </Button>
          </motion.div>
          
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="inline-flex items-center gap-2 bg-[#E8A838]/10 border border-[#E8A838]/20 text-[#E8A838] px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest mb-6"
            >
              <Heart className="w-4 h-4" />
              <Label size="sm">{t('editorial.etiquette.badge')}</Label>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <H1 className="mb-6 text-white font-serif tracking-tight">
                {t('editorial.etiquette.title_prefix')}{' '}
                <span className="text-[#E8A838]">
                  {t('editorial.etiquette.title_highlight')}
                </span>
              </H1>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Lead className="text-zinc-400">
                {t('editorial.etiquette.lead')}
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
              <div className="rounded-2xl border border-[#E8A838]/20 bg-[#E8A838]/5 p-6 backdrop-blur-sm">
                <div className="flex items-start gap-3">
                  <Smartphone className="w-5 h-5 text-[#E8A838] shrink-0 mt-0.5" />
                  <div>
                    <H4 className="mb-2 text-white font-serif">{t('editorial.etiquette.tip_phone.title')}</H4>
                    <Text size="sm" variant="muted" className="text-zinc-400">
                      {t('editorial.etiquette.tip_phone.description')}
                    </Text>
                  </div>
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                <div className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-zinc-300 shrink-0 mt-0.5" />
                  <div>
                    <H4 className="mb-2 text-white font-serif">{t('editorial.etiquette.tip_privacy.title')}</H4>
                    <Text size="sm" variant="muted" className="text-zinc-400">
                      {t('editorial.etiquette.tip_privacy.description')}
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
            <H2 className="mb-8 text-white font-serif tracking-tight">
              {t('editorial.etiquette.guides_title')}
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
                    className="group block rounded-2xl border border-white/10 bg-zinc-900/40 p-6 hover:border-[#E8A838]/50 hover:shadow-2xl hover:shadow-[#E8A838]/5 transition-all duration-500"
                  >
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          {article.featured && (
                            <Badge className="bg-[#E8A838] text-black border-none font-bold uppercase tracking-widest text-[10px]">
                              {t('editorial.etiquette.featured')}
                            </Badge>
                          )}
                          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                            <Clock className="w-3.5 h-3.5" />
                            {article.readTime} {t('editorial.min_read')}
                          </div>
                        </div>
                        <H3 className="mb-2 text-white group-hover:text-[#E8A838] transition-colors font-serif">
                          {t(article.titleKey)}
                        </H3>
                        <Text variant="muted" className="text-zinc-400 line-clamp-2">
                          {t(article.excerptKey)}
                        </Text>
                      </div>
                      <div className="flex items-center gap-2 text-[#E8A838] font-bold text-sm opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0 shrink-0">
                        <span>Read</span>
                        <ArrowRight className="w-4 h-4" />
                      </div>
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
