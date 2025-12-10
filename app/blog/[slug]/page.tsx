import { notFound } from 'next/navigation';
import ArticleContent from './ArticleContent';
import articlesData from '@/data/dummy-articles.json';
import { Article } from '@/lib/types';

interface ArticlePageProps {
  params: {
    slug: string;
  };
}

// Generate static params for all articles
export async function generateStaticParams() {
  const articles = articlesData as Article[];
  
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export default function ArticlePage({ params }: ArticlePageProps) {
  const articles = articlesData as Article[];
  const article = articles.find(a => a.slug === params.slug);

  if (!article) {
    notFound();
  }

  return <ArticleContent article={article} />;
}