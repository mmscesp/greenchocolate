import { getFeaturedArticles } from '@/app/actions/articles';
import HomePageContent from './HomePageContent';
import { ArticleCard } from '@/app/actions/articles';

export interface HomePageData {
  featuredArticles: ArticleCard[];
}

export default async function HomePageWrapper() {
  // Fetch data - only articles exist in Phase 1 (clubs coming in Phase 2)
  const [featuredArticles] = await Promise.all([
    getFeaturedArticles(4),
  ]);

  return (
    <HomePageContent
      featuredArticles={featuredArticles}
    />
  );
}
