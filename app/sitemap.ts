import { MetadataRoute } from 'next';
import { getCities } from '@/app/actions/cities';
import { getClubs } from '@/app/actions/clubs';
import { getArticles } from '@/app/actions/articles';
import { i18n } from '@/lib/i18n-config';

// Force dynamic rendering to avoid build-time database calls
export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://socialclubsmaps.com';
  const now = new Date();
  const toLocalizedEntries = (
    path: string,
    changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'],
    priority: number,
    lastModified: Date = now
  ): MetadataRoute.Sitemap =>
    i18n.locales.map((locale) => ({
      url: `${baseUrl}/${locale}${path}`,
      lastModified,
      changeFrequency,
      priority,
    }));

  // Fetch dynamic data with error handling
  let cities: Awaited<ReturnType<typeof getCities>> = [];
  let clubs: Awaited<ReturnType<typeof getClubs>> = [];
  let articles: Awaited<ReturnType<typeof getArticles>> = [];

  try {
    [cities, clubs, articles] = await Promise.all([
      getCities(),
      getClubs({ isVerified: true }),
      getArticles(),
    ]);
  } catch (error) {
    console.warn('Failed to fetch dynamic data for sitemap:', error);
  }

  const staticRoutes: MetadataRoute.Sitemap = [
    ...toLocalizedEntries('', 'daily', 1.0),
    ...toLocalizedEntries('/clubs', 'daily', 0.9),
    ...toLocalizedEntries('/editorial', 'weekly', 0.8),
  ];

  const cityRoutes: MetadataRoute.Sitemap = cities.flatMap((city) =>
    toLocalizedEntries(`/spain/${city.slug}`, 'weekly', 0.8)
  );

  const clubRoutes: MetadataRoute.Sitemap = clubs.flatMap((club) =>
    toLocalizedEntries(`/clubs/${club.slug}`, 'weekly', 0.7)
  );

  const articleRoutes: MetadataRoute.Sitemap = articles.flatMap((article) =>
    toLocalizedEntries(
      `/editorial/${article.slug}`,
      'monthly',
      0.6,
      article.publishedAt ? new Date(article.publishedAt) : now
    )
  );

  return [...staticRoutes, ...cityRoutes, ...clubRoutes, ...articleRoutes];
}
