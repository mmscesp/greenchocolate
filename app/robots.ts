import { MetadataRoute } from 'next';
import { i18n } from '@/lib/i18n-config';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://socialclubsmaps.com';
  const localizedDisallow = i18n.locales.flatMap((locale) => [
    `/${locale}/account/requests`,
    `/${locale}/profile`,
    `/${locale}/club-panel`,
    `/${locale}/club-panel/*`,
    `/${locale}/dashboard`,
    `/${locale}/dashboard/*`,
    `/${locale}/admin`,
    `/${locale}/admin/*`,
  ]);

  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/sitemap.xml',
          '/robots.txt',
          '/llms.txt',
          '/llms-full.txt',
          '/_next/static/*',
          '/.well-known/*',
        ],
        disallow: [
          '/account/requests',
          '/profile',
          '/club-panel',
          '/club-panel/*',
          '/dashboard',
          '/dashboard/*',
          '/admin',
          '/admin/*',
          ...localizedDisallow,
          '/api/internal',
          '/api/internal/*',
        ],
      },
      {
        userAgent: 'Googlebot',
        disallow: [
          '/account/requests',
          '/profile',
          '/club-panel',
          '/club-panel/*',
          '/dashboard',
          '/dashboard/*',
          '/admin',
          '/admin/*',
          ...localizedDisallow,
        ],
      },
      {
        userAgent: 'GPTBot',
        disallow: [
          '/account/requests',
          '/profile',
          '/club-panel',
          '/club-panel/*',
          '/dashboard',
          '/dashboard/*',
          '/admin',
          '/admin/*',
          ...localizedDisallow,
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
