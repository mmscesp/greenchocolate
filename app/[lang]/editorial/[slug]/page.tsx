import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getArticleBySlug, getRelatedArticles, getArticles } from '@/app/actions/articles';
import { JsonLd } from '@/components/JsonLd';
import ArticleContent from '@/app/[lang]/editorial/[slug]/ArticleContent';
import { getArticleCardImage } from '@/lib/image-fallbacks';
import { isLocale } from '@/lib/i18n-config';
import { buildLanguageAlternates, toAbsoluteUrl } from '@/lib/seo';

export const revalidate = 3600;

interface ArticlePageProps {
  params: Promise<{ lang: string; slug: string }>;
}

export async function generateStaticParams() {
  try {
    const articles = await getArticles({ locale: 'en' });
    return articles.map((article) => ({
      slug: article.slug,
    }));
  } catch (error) {
    console.warn('Failed to fetch articles during build, using empty params');
    return [];
  }
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isLocale(lang)) {
    return {};
  }
  const article = await getArticleBySlug(slug, lang as 'es' | 'en' | 'fr' | 'de');

  if (!article) {
    return {
      title:
        lang === 'es'
          ? 'Articulo no encontrado'
          : lang === 'fr'
            ? 'Article introuvable'
            : lang === 'de'
              ? 'Artikel nicht gefunden'
              : 'Article Not Found',
    };
  }

  const canonicalUrl = toAbsoluteUrl(`/${lang}/editorial/${article.slug}`);
  const articleImage = getArticleCardImage({
    heroImage: article.heroImage,
    category: article.category,
    citySlug: article.citySlug,
  });

  return {
    title: article.metaTitle || article.title,
    description: article.metaDescription || article.excerpt,
    alternates: {
      canonical: canonicalUrl,
      languages: buildLanguageAlternates(`/editorial/${article.slug}`),
    },
    openGraph: {
      title: article.title,
      description: article.excerpt,
      url: canonicalUrl,
      images: [articleImage],
      type: 'article',
      publishedTime: article.publishedAt || undefined,
      authors: [article.authorName],
      siteName: 'SocialClubsMaps',
      locale: lang === 'es' ? 'es_ES' : lang === 'en' ? 'en_US' : lang === 'fr' ? 'fr_FR' : 'de_DE',
    },
    twitter: {
      card: 'summary_large_image',
      title: article.metaTitle || article.title,
      description: article.metaDescription || article.excerpt,
      images: [articleImage],
      creator: '@socialclubsmaps',
    },
  };
}

export default async function EditorialArticlePage({ params }: ArticlePageProps) {
  const { lang, slug } = await params;
  const article = await getArticleBySlug(slug, lang as 'es' | 'en' | 'fr' | 'de');

  if (!article) {
    notFound();
  }

  const articleImage = getArticleCardImage({
    heroImage: article.heroImage,
    category: article.category,
    citySlug: article.citySlug,
  });

  const relatedArticles = await getRelatedArticles(article.id, 3, lang as 'es' | 'en' | 'fr' | 'de');

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt,
    image: articleImage,
    datePublished: article.publishedAt,
    mainEntityOfPage: toAbsoluteUrl(`/${lang}/editorial/${article.slug}`),
    author: {
      '@type': 'Person',
      name: article.authorName,
    },
    publisher: {
      '@type': 'Organization',
      name: 'SocialClubsMaps',
      logo: {
        '@type': 'ImageObject',
        url: toAbsoluteUrl('/images/SCM_Logo_SVG.svg'),
      },
    },
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: toAbsoluteUrl(`/${lang}`),
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Knowledge Hub',
        item: toAbsoluteUrl(`/${lang}/editorial`),
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: article.category,
        item: toAbsoluteUrl(`/${lang}/editorial?category=${encodeURIComponent(article.category)}`),
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: article.title,
        item: toAbsoluteUrl(`/${lang}/editorial/${article.slug}`),
      },
    ],
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
      <ArticleContent article={article} relatedArticles={relatedArticles} />
    </>
  );
}

