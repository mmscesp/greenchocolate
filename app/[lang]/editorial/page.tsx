import Link from 'next/link';
import { getArticles, getCategoriesWithCounts, getFeaturedArticles } from '@/app/actions/articles';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, BookOpen, Scale, Shield, Heart, History, Clock } from '@/lib/icons';
import { Button } from '@/components/ui/button';
import { Heading, H1, H2, H3, H4, Label, Eyebrow, Text, Lead } from '@/components/typography';
import { getDictionary } from '@/lib/dictionary';
import type { Locale } from '@/lib/i18n-config';

interface EditorialPageProps {
  params: Promise<{ lang: string }>;
}

export default async function EditorialPage({ params }: EditorialPageProps) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang as Locale);
  const t = (key: string): string => (typeof dictionary[key] === 'string' ? dictionary[key] : key);
  const [featuredArticles, categories] = await Promise.all([
    getFeaturedArticles(3),
    getCategoriesWithCounts(),
  ]);

  const CATEGORIES = [
    {
      slug: 'legal',
      title: t('editorial.categories.legal.title'),
      description: t('editorial.categories.legal.description'),
      icon: Scale,
      color: 'bg-brand/10 text-brand border-brand/20',
      articleCount: categories.find(c => c.name === 'Legal')?.count || 0,
    },
    {
      slug: 'etiquette',
      title: t('editorial.categories.etiquette.title'),
      description: t('editorial.categories.etiquette.description'),
      icon: Heart,
      color: 'bg-brand/10 text-brand-light border-brand/25',
      articleCount: categories.find(c => c.name === 'Etiquette')?.count || 0,
    },
    {
      slug: 'safety',
      title: t('editorial.categories.safety.title'),
      description: t('editorial.categories.safety.description'),
      icon: Shield,
      color: 'bg-brand/10 text-brand border-brand/20',
      articleCount: categories.find(c => c.name === 'Harm Reduction')?.count || 0,
    },
    {
      slug: 'culture',
      title: t('editorial.categories.culture.title'),
      description: t('editorial.categories.culture.description'),
      icon: History,
      color: 'bg-brand/15 text-brand-dark border-brand/30',
      articleCount: categories.find(c => c.name === 'Culture')?.count || 0,
    },
  ];

  const standardsItems = [
    {
      key: 'legal',
      icon: Scale,
      iconBg: 'bg-brand/10 border-brand/20',
      iconColor: 'text-brand',
      title: t('editorial.standards.items.legal.title'),
      description: t('editorial.standards.items.legal.description'),
    },
    {
      key: 'harm_reduction',
      icon: Shield,
      iconBg: 'bg-brand/10 border-brand/20',
      iconColor: 'text-brand',
      title: t('editorial.standards.items.harm_reduction.title'),
      description: t('editorial.standards.items.harm_reduction.description'),
    },
    {
      key: 'updated',
      icon: Clock,
      iconBg: 'bg-brand/10 border-brand/20',
      iconColor: 'text-brand',
      title: t('editorial.standards.items.updated.title'),
      description: t('editorial.standards.items.updated.description'),
    },
  ];

  return (
    <div className="min-h-screen bg-bg-base text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-bg-surface/40 via-bg-base to-bg-base pointer-events-none" />
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 left-[12%] h-[500px] w-[500px] rounded-full bg-brand/5 blur-[120px]" />
        <div className="absolute top-[40%] right-[5%] h-[400px] w-[400px] rounded-full bg-brand/5 blur-[120px]" />
        <div className="absolute top-[40%] right-[5%] h-[400px] w-[400px] rounded-full bg-brand/5 blur-[120px]" />
      </div>

      {/* Hero Section */}
      <section className="relative pt-24 md:pt-32 pb-20 md:pb-28 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <Eyebrow variant="muted" className="mb-6 justify-center flex items-center gap-2 text-brand">
              <BookOpen className="w-4 h-4" />
              {t('editorial.badge')}
            </Eyebrow>
            <H1 size="xl" className="mb-6 text-white font-serif tracking-tight">
              {t('editorial.title_prefix')} <span className="text-brand">{t('editorial.title_highlight')}</span>
            </H1>
            <Lead className="mb-8 text-zinc-400">
              {t('editorial.subtitle')}
            </Lead>
          </div>
        </div>
      </section>

      {/* Category Grid */}
      <section className="py-16 md:py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <H2 className="mb-10 text-white font-serif tracking-tight">{t('editorial.browse_by_topic')}</H2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {CATEGORIES.map((category) => (
              <Link
                key={category.slug}
                href={`/${lang}/editorial/${category.slug}`}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-bg-card/70 backdrop-blur-sm p-6 md:p-8 hover:border-brand/50 transition-all duration-500"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-brand/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative">
                  <div className={`inline-flex p-3 rounded-xl bg-brand/10 text-brand border border-brand/20 mb-6 transition-transform duration-500 group-hover:scale-110`}>
                    <category.icon className="w-6 h-6" />
                  </div>
                  <H3 className="mb-3 text-white group-hover:text-brand transition-colors font-serif">
                    {category.title}
                  </H3>
                  <Text variant="muted" className="mb-6 text-zinc-400 line-clamp-2">
                    {category.description}
                  </Text>
                  <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <Text size="sm" variant="muted" className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">
                      {category.articleCount} {category.articleCount === 1 ? t('editorial.article') : t('editorial.articles')}
                    </Text>
                    <div className="flex items-center gap-2 text-brand font-bold text-sm opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                      <span>Explore</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Articles */}
      {featuredArticles.length > 0 && (
        <section className="py-16 md:py-24 bg-brand/5 border-y border-brand/10 relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-12">
              <H2 className="text-white font-serif tracking-tight">{t('editorial.featured_articles')}</H2>
              <Button variant="secondary" asChild className="border-white/10 text-zinc-400 hover:bg-white/5 hover:text-white rounded-full">
                <Link href={`/${lang}/editorial/legal`}>
                  {t('editorial.view_all')} <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredArticles.map((article) => (
                <Link
                  key={article.id}
                  href={`/${lang}/editorial/${article.slug}`}
                  className="group block bg-bg-card/80 rounded-2xl border border-white/10 overflow-hidden hover:border-brand/50 transition-all duration-500 h-full"
                >
                  {article.heroImage ? (
                    <div className="aspect-video bg-bg-surface relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-bg-base/80 via-bg-base/20 to-transparent z-10" />
                      <Badge className="absolute top-4 left-4 bg-brand text-bg-base border-none font-bold uppercase tracking-widest text-[10px] z-20" variant="secondary">
                        {article.category}
                      </Badge>
                    </div>
                  ) : (
                    <div className="aspect-video bg-bg-surface relative overflow-hidden flex items-center justify-center">
                       <BookOpen className="w-12 h-12 text-zinc-700" />
                    </div>
                  )}
                  <div className="p-6">
                    <H3 size="sm" className="mb-3 text-white group-hover:text-brand transition-colors line-clamp-2 font-serif">
                      {article.title}
                    </H3>
                    <Text variant="muted" size="sm" className="line-clamp-2 mb-6 text-zinc-400">
                      {article.excerpt}
                    </Text>
                    <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-zinc-500 pt-4 border-t border-white/5">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        {article.readTime} {t('editorial.min_read')}
                      </div>
                      {article.cityName && (
                        <span className="text-brand">{article.cityName}</span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Trust Signals */}
      <section className="py-20 md:py-32 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <H2 className="mb-6 text-white font-serif tracking-tight">{t('editorial.standards.title')}</H2>
            <Text variant="muted" className="mb-10 text-zinc-400">
              {t('editorial.standards.subtitle')}
            </Text>
          </div>

          <div className="mt-2 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8 xl:gap-10">
            {standardsItems.map((item) => (
              <div key={item.key} className="h-full rounded-2xl border border-brand/15 bg-brand/5 p-6 text-center md:p-7">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 border ${item.iconBg}`}>
                  <item.icon className={`w-7 h-7 ${item.iconColor}`} />
                </div>
                <H4 className="mb-3 min-h-[3.5rem] line-clamp-2 text-white font-serif leading-tight">
                  {item.title}
                </H4>
                <Text size="sm" variant="muted" className="min-h-[3rem] line-clamp-2 text-zinc-500 leading-relaxed">
                  {item.description}
                </Text>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}


