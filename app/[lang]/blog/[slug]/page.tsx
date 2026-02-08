import { notFound } from 'next/navigation';
import ArticleContent from './ArticleContent';
import { getArticleBySlug, getRelatedArticles, getArticles } from '@/app/actions/articles';
import { JsonLd } from '@/components/JsonLd';
import { Metadata } from 'next';

// ISR: Revalidate every hour
export const revalidate = 3600;

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

// Generate static params for all articles at build time
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
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return { title: 'Article Not Found' };
  
  return {
    title: article.metaTitle || article.title,
    description: article.metaDescription || article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: article.heroImage ? [article.heroImage] : [],
      type: 'article',
      publishedTime: article.publishedAt || undefined,
      authors: [article.authorName],
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) { notFound(); }
  
  const relatedArticles = await getRelatedArticles(article.id, 3);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
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
        item: 'https://socialclubsmaps.com/',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blog',
        item: 'https://socialclubsmaps.com/blog',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: article.category,
        item: `https://socialclubsmaps.com/blog?category=${encodeURIComponent(article.category)}`,
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: article.title,
        item: `https://socialclubsmaps.com/blog/${article.slug}`,
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
