import Link from 'next/link';
import type { ReactNode } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Clock } from '@/lib/icons';
import { H1, H2, H3, Label, Lead, Text } from '@/components/typography';

interface CategoryArticlePageProps {
  lang: string;
  t: (key: string) => string;
  backToVaultKey: string;
  badgeKey: string;
  titlePrefixKey: string;
  titleHighlightKey: string;
  leadKey: string;
  guidesTitleKey: string;
  featuredKey: string;
  badgeIcon: ReactNode;
  articles: Array<{
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    readTime: number;
  }>;
}

export default function CategoryArticlePage({
  lang,
  t,
  backToVaultKey,
  badgeKey,
  titlePrefixKey,
  titleHighlightKey,
  leadKey,
  guidesTitleKey,
  featuredKey,
  badgeIcon,
  articles,
}: CategoryArticlePageProps) {
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-900/50 via-black to-zinc-900/50 pointer-events-none" />
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-[#E8A838]/5 to-transparent" />
        <div className="absolute top-[30%] right-[10%] h-[320px] w-[320px] rounded-full bg-[#E8A838]/5 blur-[100px]" />
      </div>

      <section className="relative pt-24 md:pt-32 pb-16 lg:pb-24 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Button variant="outline" asChild className="mb-6 border-white/10 text-zinc-400 hover:bg-white/5 hover:text-white rounded-full">
            <Link href={`/${lang}/editorial`}>
              <ArrowLeft className="mr-2 w-4 h-4" />
              {t(backToVaultKey)}
            </Link>
          </Button>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-[#E8A838]/10 border border-[#E8A838]/20 text-[#E8A838] px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest mb-6">
              {badgeIcon}
              <Label size="sm">{t(badgeKey)}</Label>
            </div>

            <H1 className="mb-6 text-white font-serif tracking-tight">
              {t(titlePrefixKey)} <span className="text-[#E8A838]">{t(titleHighlightKey)}</span>
            </H1>

            <Lead className="text-zinc-400">{t(leadKey)}</Lead>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <H2 className="mb-8 text-white font-serif tracking-tight">{t(guidesTitleKey)}</H2>

            <div className="grid gap-4">
              {articles.map((article, index) => (
                <Link
                  key={article.id}
                  href={`/${lang}/editorial/${article.slug}`}
                  className="group block rounded-2xl border border-white/10 bg-zinc-900/40 p-6 hover:border-[#E8A838]/50 hover:shadow-2xl hover:shadow-[#E8A838]/5 transition-all duration-500"
                >
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        {index === 0 ? (
                          <Badge className="bg-[#E8A838] text-black border-none font-bold uppercase tracking-widest text-[10px]">
                            {t(featuredKey)}
                          </Badge>
                        ) : null}
                        <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                          <Clock className="w-3.5 h-3.5" />
                          {article.readTime} {t('editorial.min_read')}
                        </div>
                      </div>
                      <H3 className="mb-2 text-white group-hover:text-[#E8A838] transition-colors font-serif">{article.title}</H3>
                      <Text variant="muted" className="text-zinc-400 line-clamp-2">
                        {article.excerpt}
                      </Text>
                    </div>
                    <div className="flex items-center gap-2 text-[#E8A838] font-bold text-sm opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0 shrink-0">
                      <span>Read</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
