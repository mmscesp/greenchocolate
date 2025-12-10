'use client';

import { useState, useEffect, useMemo } from 'react';
import { Article } from '@/lib/types';
import articlesData from '@/data/dummy-articles.json';

export const useArticles = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setArticles(articlesData as Article[]);
      setLoading(false);
    }, 300);
  }, []);

  return { articles, loading };
};

export const useArticlesByCategory = (category?: string) => {
  const { articles, loading } = useArticles();
  
  const filteredArticles = useMemo(() => {
    if (!category) return articles;
    return articles.filter(article => article.category === category);
  }, [articles, category]);

  return { articles: filteredArticles, loading };
};

export const useArticleBySlug = (slug: string) => {
  const { articles, loading } = useArticles();
  const article = articles.find(a => a.slug === slug);
  
  return { article, loading };
};