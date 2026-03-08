import { MetadataRoute } from 'next';
import { i18n } from '@/lib/i18n-config';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://socialclubsmaps.com';
  const localizedDisallow = i18n.locales.flatMap((locale) => [
    `/${locale}/dashboard`,
    `/${locale}/dashboard/*`,
    `/${locale}/admin`,
    `/${locale}/admin/*`,
    `/${locale}/club-panel`,
    `/${locale}/club-panel/*`,
  ]);

  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/clubs',
          '/clubs/*',
          '/editorial',
          '/editorial/*',
          '/learn',
          '/learn/*',
          '/api/sitemap',
        ],
        disallow: [
          '/dashboard',
          '/dashboard/*',
          '/admin',
          '/admin/*',
          '/club-panel/dashboard',
          '/club-panel/dashboard/*',
          ...localizedDisallow,
          '/api/internal',
          '/api/internal/*',
          '/_next',
          '/_next/*',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: [
          '/',
          '/clubs',
          '/clubs/*',
          '/editorial',
          '/editorial/*',
          '/learn',
          '/learn/*',
        ],
        disallow: [
          '/dashboard',
          '/dashboard/*',
          '/admin',
          '/admin/*',
          '/club-panel',
          '/club-panel/*',
          ...localizedDisallow,
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
