import { getFeaturedArticles } from '@/app/actions/articles';
import HomePageContent from './HomePageContent';

export default async function HomePage() {
  // Fetch data - only articles exist in Phase 1 (clubs coming in Phase 2)
  const featuredArticles = await getFeaturedArticles(4);

  return (
    <HomePageContent
      featuredArticles={featuredArticles}
    />
  );
}
