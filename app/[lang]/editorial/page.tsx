import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getCategoriesWithCounts, getFeaturedArticles } from '@/app/actions/articles';
import { JsonLd } from '@/components/JsonLd';
import { CommunityRoadmap } from '@/components/landing/editorial-concierge/blocks/CommunityRoadmap';
import { EditorialFAQ } from '@/components/landing/editorial-concierge/blocks/EditorialFAQ';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, BookOpen, Scale, Shield, Heart, History, Clock, CheckCircle2, Map, Search } from '@/lib/icons';
import { Button } from '@/components/ui/button';
import { H2, H3, Text } from '@/components/typography';
import { getDictionary } from '@/lib/dictionary';
import type { Locale } from '@/lib/i18n-config';
import { getArticleCardImage } from '@/lib/image-fallbacks';
import { getLocalizedArticleCategory } from '@/lib/article-taxonomy';
import { buildBreadcrumbJsonLd, buildCollectionPageJsonLd, buildItemListJsonLd, buildLocalizedMetadata, isLocale } from '@/lib/seo';

interface EditorialPageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({
  params,
}: EditorialPageProps): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) {
    return {};
  }

  const metadataByLocale: Record<string, { title: string; description: string }> = {
    es: {
      title: 'Guías y Recursos de Cannabis Social Clubs en España | SocialClubsMaps',
      description:
        'Guías expertas sobre legalidad, etiqueta, seguridad y cultura de cannabis social clubs en España.',
    },
    en: {
      title: 'Cannabis Social Club Guides for Spain | SocialClubsMaps',
      description:
        'Legal, safety, etiquette, and city intelligence guides for understanding cannabis social clubs in Spain without relying on shortcut advice.',
    },
    fr: {
      title: 'Guides et Ressources des Clubs Sociaux Cannabis en Espagne | SocialClubsMaps',
      description:
        'Guides experts sur la conformité légale, l étiquette, la sécurité et la culture des clubs sociaux cannabis en Espagne.',
    },
    de: {
      title: 'Cannabis Social Club Guides und Ressourcen in Spanien | SocialClubsMaps',
      description:
        'Expertenleitfäden zu Legalität, Etikette, Sicherheit und Clubkultur rund um Cannabis Social Clubs in Spanien.',
    },
  };

  const localized = metadataByLocale[lang] ?? metadataByLocale.en;

  return buildLocalizedMetadata({
    lang,
    path: '/editorial',
    title: localized.title,
    description: localized.description,
    keywords: [
      'cannabis social club guide Spain',
      'cannabis legal guide Spain',
      'cannabis harm reduction Spain',
      'social club etiquette Spain',
    ],
  });
}

export default async function EditorialPage({ params }: EditorialPageProps) {
  const { lang } = await params;
  const locale = isLocale(lang) ? lang : 'en';
  const dictionary = await getDictionary(lang as Locale);
  const t = (key: string): string => (typeof dictionary[key] === 'string' ? dictionary[key] : key);
  const [featuredArticles, categories] = await Promise.all([
    getFeaturedArticles(3, lang as Locale),
    getCategoriesWithCounts(lang as Locale),
  ]);

  const CATEGORIES = [
    {
      slug: 'legal',
      title: t('editorial.categories.legal.title'),
      description: t('editorial.categories.legal.description'),
      icon: Scale,
      imageUrl: '/images/editorial/spain-legal-flags.webp',
      articleCount: categories.find((c) => c.name === 'Legal')?.count || 0,
    },
    {
      slug: 'etiquette',
      title: t('editorial.categories.etiquette.title'),
      description: t('editorial.categories.etiquette.description'),
      icon: Heart,
      imageUrl: '/images/editorial/barcelona-gaudi-house.webp',
      articleCount: categories.find((c) => c.name === 'Etiquette')?.count || 0,
    },
    {
      slug: 'safety',
      title: t('editorial.categories.safety.title'),
      description: t('editorial.categories.safety.description'),
      icon: Shield,
      imageUrl: '/images/editorial/safety-kit.webp',
      articleCount: categories.find((c) => c.name === 'Harm Reduction')?.count || 0,
    },
    {
      slug: 'culture',
      title: t('editorial.categories.culture.title'),
      description: t('editorial.categories.culture.description'),
      icon: History,
      imageUrl: '/images/editorial/barcelona-vs-amsterdam.webp',
      articleCount: categories.find((c) => c.name === 'Culture')?.count || 0,
    },
  ];

  const standardsItems = [
    {
      key: 'legal',
      title: t('editorial.standards.items.legal.title'),
      description: t('editorial.standards.items.legal.description'),
      icon: Scale,
    },
    {
      key: 'harm_reduction',
      title: t('editorial.standards.items.harm_reduction.title'),
      description: t('editorial.standards.items.harm_reduction.description'),
      icon: Shield,
    },
    {
      key: 'updated',
      title: t('editorial.standards.items.updated.title'),
      description: t('editorial.standards.items.updated.description'),
      icon: CheckCircle2,
    },
  ];
  const collectionJsonLd = buildCollectionPageJsonLd({
    name: 'Cannabis Social Club Guides for Spain',
    description: 'Legal, safety, etiquette, and city intelligence guides from SocialClubsMaps.',
    path: `/${lang}/editorial`,
  });
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: 'Home', path: `/${lang}` },
    { name: 'Editorial Guides', path: `/${lang}/editorial` },
  ]);
  const itemListJsonLd = buildItemListJsonLd([
    ...CATEGORIES.map((category) => ({
      name: category.title,
      path: `/${lang}/editorial/${category.slug}`,
      description: category.description,
    })),
    ...featuredArticles.map((article) => ({
      name: article.title,
      path: `/${lang}/editorial/${article.slug}`,
      description: article.excerpt,
    })),
  ]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-bg-base text-white">
      <JsonLd data={collectionJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={itemListJsonLd} />

      <section className="relative min-h-[calc(100svh-2rem)] overflow-hidden border-b border-white/10">
        <div className="absolute inset-0">
          <Image
            src="/images/cities/barcelona-city.webp"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-72 saturate-125 contrast-110"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,hsl(var(--bg-base))_0%,rgba(2,10,14,0.88)_38%,rgba(2,10,14,0.46)_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_35%,rgba(0,203,204,0.2),transparent_28%),linear-gradient(180deg,rgba(2,10,14,0.06)_0%,hsl(var(--bg-base))_100%)]" />
        </div>

        <div className="relative z-10 mx-auto flex min-h-[calc(100svh-2rem)] max-w-7xl items-center px-4 pb-16 pt-28 sm:px-6 lg:px-8">
          <div className="max-w-[56rem]">
            <div className="mb-6 inline-flex items-center gap-3 text-brand">
              <BookOpen className="h-4 w-4" />
              <span className="text-xs font-black uppercase tracking-[0.28em]">{t('editorial.badge')}</span>
            </div>
            {locale === 'en' ? (
              <h1 className="font-serif text-[clamp(2rem,10vw,6rem)] font-black leading-[0.92] tracking-normal text-white">
                <span className="block whitespace-nowrap">Navigate Spain&apos;s</span>
                <span className="block whitespace-nowrap">Cannabis Culture</span>
                <span className="block text-brand">{t('editorial.title_highlight')}</span>
              </h1>
            ) : (
              <h1 className="max-w-[16ch] text-balance font-serif text-[clamp(2.5rem,6vw,6rem)] font-black leading-[0.92] tracking-normal text-white">
                <span className="block">{t('editorial.title_prefix')}</span>
                <span className="block text-brand">{t('editorial.title_highlight')}</span>
              </h1>
            )}
            <p className="mt-7 max-w-2xl text-base leading-7 text-white/72 md:text-lg">
              {t('editorial.subtitle')}
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="rounded-full bg-brand px-7 text-sm font-black uppercase tracking-[0.14em] text-bg-base hover:bg-brand-dark">
                <Link href={`/${lang}/editorial/legal`}>
                  {t('editorial.hero.primary_cta')} <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="secondary" className="rounded-full border-white/15 bg-white/5 px-7 text-sm font-bold text-white hover:border-brand/50 hover:bg-white/10">
                <Link href={`/${lang}/safety-kit`}>{t('editorial.hero.secondary_cta')}</Link>
              </Button>
            </div>
            <div className="mt-10 grid max-w-2xl gap-5 border-t border-white/10 pt-7 sm:grid-cols-3">
              {[
                { icon: Scale, value: '4', label: t('editorial.hero.stat_topics') },
                { icon: Search, value: String(featuredArticles.length), label: t('editorial.hero.stat_featured') },
                { icon: Map, value: 'BCN', label: t('editorial.hero.stat_city') },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="flex items-start gap-3 border-white/10 sm:border-r sm:pr-5 last:border-r-0">
                    <Icon className="mt-1 h-4 w-4 shrink-0 text-brand" />
                    <div>
                      <p className="font-serif text-2xl font-black leading-none text-white">{item.value}</p>
                      <p className="mt-1 text-xs leading-4 text-white/64">{item.label}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 border-b border-white/10 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 max-w-3xl">
            <p className="mb-3 text-xs font-black uppercase tracking-[0.28em] text-brand">{t('editorial.topic_label')}</p>
            <H2 className="text-white font-serif tracking-tight">{t('editorial.browse_by_topic')}</H2>
          </div>
          <div className="grid grid-cols-1 gap-px overflow-hidden border-y border-white/10 bg-white/10 md:grid-cols-2">
            {CATEGORIES.map((category) => (
              <Link
                key={category.slug}
                href={`/${lang}/editorial/${category.slug}`}
                className="group relative min-h-[25rem] overflow-hidden bg-bg-base p-6 md:p-8"
              >
                <Image
                  src={category.imageUrl}
                  alt=""
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover opacity-20 transition duration-700 group-hover:scale-105 group-hover:opacity-34"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bg-base via-bg-base/80 to-bg-base/30" />
                <div className="relative flex h-full min-h-[21rem] flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-[0.22em] text-brand">{String(category.articleCount).padStart(2, '0')}</span>
                    <div className="flex h-12 w-12 items-center justify-center rounded-full border border-brand/30 bg-bg-base/50 text-brand backdrop-blur-md">
                      <category.icon className="w-5 h-5" />
                    </div>
                  </div>
                  <div>
                    <H3 className="mb-4 text-white group-hover:text-brand transition-colors font-serif">{category.title}</H3>
                    <Text className="max-w-md text-zinc-400">
                      {category.description}
                    </Text>
                    <div className="mt-8 flex items-center gap-2 text-sm font-bold text-brand">
                      <span>{t('common.explore')}</span>
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {featuredArticles.length > 0 && (
        <section className="py-16 md:py-24 border-b border-white/10 relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="mb-3 text-xs font-black uppercase tracking-[0.28em] text-brand">{t('editorial.featured_label')}</p>
                <H2 className="text-white font-serif tracking-tight">{t('editorial.featured_articles')}</H2>
              </div>
              <Button variant="secondary" asChild className="border-white/10 text-zinc-400 hover:bg-white/5 hover:text-white rounded-full">
                <Link href={`/${lang}/editorial/legal`}>
                  {t('editorial.view_all')} <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredArticles.map((article) => {
                const image = getArticleCardImage({
                  heroImage: article.heroImage,
                  category: article.category,
                  citySlug: article.citySlug,
                });

                return (
                  <Link
                    key={article.id}
                    href={`/${lang}/editorial/${article.slug}`}
                    className="group block h-full overflow-hidden border border-white/10 bg-white/[0.03] transition-all duration-500 hover:border-brand/50 hover:bg-white/[0.055]"
                  >
                    <div className="aspect-video bg-bg-surface relative overflow-hidden">
                      <Image
                        src={image}
                        alt={article.title}
                        fill
                        sizes="(min-width: 768px) 33vw, 100vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-bg-base/80 via-bg-base/20 to-transparent z-10" />
                      <Badge className="absolute top-4 left-4 bg-brand text-bg-base border-none font-bold uppercase tracking-widest text-[10px] z-20" variant="secondary">
                        {getLocalizedArticleCategory(article.category, t)}
                      </Badge>
                    </div>
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
                        {article.cityName && <span className="text-brand">{article.cityName}</span>}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <section className="py-20 md:py-32 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <p className="mb-3 text-xs font-black uppercase tracking-[0.28em] text-brand">{t('editorial.standards.kicker')}</p>
            <H2 className="mb-6 text-white font-serif tracking-tight">{t('editorial.standards.title')}</H2>
            <Text variant="muted" className="mb-10 text-zinc-400">
              {t('editorial.standards.subtitle')}
            </Text>
          </div>

          <div className="mt-2 grid grid-cols-1 gap-px overflow-hidden border-y border-white/10 bg-white/10 lg:grid-cols-3">
            {standardsItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={item.key} className="bg-bg-base p-7 md:p-9">
                  <div className="mb-10 flex items-center justify-between">
                    <Icon className="h-6 w-6 text-brand" />
                    <span className="font-serif text-4xl font-black text-white/10">0{index + 1}</span>
                  </div>
                  <H3 className="mb-4 font-serif text-white">{item.title}</H3>
                  <Text className="text-zinc-400">{item.description}</Text>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <CommunityRoadmap />
      <EditorialFAQ />
    </div>
  );
}

