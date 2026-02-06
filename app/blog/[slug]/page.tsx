import { notFound } from 'next/navigation';
import ArticleContent from './ArticleContent';
import { getArticleBySlug, getRelatedArticles } from '@/app/actions/articles';
import { JsonLd } from '@/components/JsonLd';
import { Metadata } from 'next';

interface ArticlePageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const article = await getArticleBySlug(params.slug);
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
  const article = await getArticleBySlug(params.slug);
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

  return (
    <>
      <JsonLd data={jsonLd} />
      <ArticleContent article={article} relatedArticles={relatedArticles} />
    </>
  );
}