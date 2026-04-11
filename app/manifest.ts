import type { MetadataRoute } from 'next';
import { getBaseUrl } from '@/lib/seo';

export default function manifest(): MetadataRoute.Manifest {
  const baseUrl = getBaseUrl();

  return {
    name: 'SocialClubsMaps',
    short_name: 'SocialClubsMaps',
    description:
      'Discover and connect with verified cannabis social clubs in Spain with safety-first local guidance.',
    start_url: '/',
    display: 'standalone',
    background_color: '#050A11',
    theme_color: '#A8A555',
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
      {
        src: '/images/SCM_Logo_OG.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
    id: baseUrl,
  };
}

