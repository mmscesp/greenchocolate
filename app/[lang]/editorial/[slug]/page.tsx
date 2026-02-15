import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getArticleBySlug, getRelatedArticles, getArticles } from '@/app/actions/articles';
import { JsonLd } from '@/components/JsonLd';
import ArticleContent from '@/app/[lang]/learn/[slug]/ArticleContent';

export const revalidate = 3600;

interface ArticlePageProps {
  params: Promise<{ lang: string; slug: string }>;
}

export async function generateStaticParams() {
  try {
    const articles = await getArticles();
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
  const article = await getArticleBySlug(slug);

  if (!article) {
    return { title: 'Article Not Found' };
  }

  const canonicalUrl = `https://socialclubsmaps.com/${lang}/editorial/${article.slug}`;

  return {
    title: article.metaTitle || article.title,
    description: article.metaDescription || article.excerpt,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: article.title,
      description: article.excerpt,
      url: canonicalUrl,
      images: article.heroImage ? [article.heroImage] : [],
      type: 'article',
      publishedTime: article.publishedAt || undefined,
      authors: [article.authorName],
    },
  };
}

export default async function EditorialArticlePage({ params }: ArticlePageProps) {
  const { lang, slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const relatedArticles = await getRelatedArticles(article.id, 3);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'MedicalWebPage',
    headline: article.title,
    description: article.excerpt,
    image: article.heroImage,
    datePublished: article.publishedAt,
    author: {
      '@type': 'Person',
      name: article.authorName,
    },
    publisher: {
      '@type': 'Organization',
      name: 'SocialClubsMaps',
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
        item: `https://socialclubsmaps.com/${lang}`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Knowledge Hub',
        item: `https://socialclubsmaps.com/${lang}/editorial`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: article.category,
        item: `https://socialclubsmaps.com/${lang}/editorial?category=${encodeURIComponent(article.category)}`,
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: article.title,
        item: `https://socialclubsmaps.com/${lang}/editorial/${article.slug}`,
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
