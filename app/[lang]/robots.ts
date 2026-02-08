import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://socialclubsmaps.com';

  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/clubs',
          '/clubs/*',
          '/blog',
          '/blog/*',
          '/api/sitemap',
        ],
        disallow: [
          '/dashboard',
          '/dashboard/*',
          '/admin',
          '/admin/*',
          '/club-panel/dashboard',
          '/club-panel/dashboard/*',
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
          '/blog',
          '/blog/*',
        ],
        disallow: [
          '/dashboard',
          '/dashboard/*',
          '/admin',
          '/admin/*',
          '/club-panel',
          '/club-panel/*',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
