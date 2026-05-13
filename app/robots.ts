import { MetadataRoute } from 'next';
import { i18n } from '@/lib/i18n-config';
import { getBaseUrl } from '@/lib/seo';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getBaseUrl();
  const localizedDisallow = i18n.locales.flatMap((locale) => [
    `/${locale}/account`,
    `/${locale}/account/*`,
    `/${locale}/auth`,
    `/${locale}/auth/*`,
    `/${locale}/forgot-password`,
    `/${locale}/resend-confirmation`,
    `/${locale}/reset-password`,
    `/${locale}/account/requests`,
    `/${locale}/profile`,
    `/${locale}/profile/*`,
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
          '/auth',
          '/auth/*',
          '/reset-password',
          '/account/requests',
          '/account',
          '/account/*',
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
          '/auth',
          '/auth/*',
          '/reset-password',
          '/account',
          '/account/*',
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
          '/auth',
          '/auth/*',
          '/reset-password',
          '/account',
          '/account/*',
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
