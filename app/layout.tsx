import './globals.css';
import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { Plus_Jakarta_Sans, Playfair_Display, JetBrains_Mono } from 'next/font/google';
import AnalyticsDebugListener from '@/components/dev/AnalyticsDebugListener';
import { i18n, isLocale } from '@/lib/i18n-config';
import { JsonLd } from '@/components/JsonLd';
import { buildLanguageAlternates, getBaseUrl, toAbsoluteUrl } from '@/lib/seo';

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-primary',
  weight: ['400', '500', '600', '700'],
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
  weight: ['400', '700', '900'],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '700'],
});

export const metadata: Metadata = {
  metadataBase: new URL(getBaseUrl()),
  title: {
    default: 'SocialClubsMaps - Cannabis Social Clubs Directory Spain',
    template: '%s | SocialClubsMaps',
  },
  description: 'Discover and connect with verified cannabis social clubs in Spain. Browse directories in Barcelona, Madrid, Valencia, and more. Expert guides on legal compliance and safety.',
  keywords: ['cannabis social clubs', 'CSC Spain', 'Barcelona cannabis clubs', 'Madrid marijuana clubs', 'cannabis directory', 'Spain cannabis guide', 'cannabis tourism Spain', 'legal cannabis Spain'],
  authors: [{ name: 'SocialClubsMaps' }],
  creator: 'SocialClubsMaps',
  publisher: 'SocialClubsMaps',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: getBaseUrl(),
    siteName: 'SocialClubsMaps',
    title: 'SocialClubsMaps - Cannabis Social Clubs Directory Spain',
    description: 'Discover and connect with verified cannabis social clubs in Spain. Browse directories in Barcelona, Madrid, Valencia, and more.',
    images: [
      {
        url: '/images/SCM_Logo_SVG.svg',
        alt: 'SocialClubsMaps - Cannabis Social Clubs Directory',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SocialClubsMaps - Cannabis Social Clubs Directory Spain',
    description: 'Discover and connect with verified cannabis social clubs in Spain.',
    images: ['/images/SCM_Logo_SVG.svg'],
    creator: '@socialclubsmaps',
  },
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/images/SCM_Logo_SVG.svg',
  },
  alternates: {
    languages: buildLanguageAlternates(''),
  },
  category: 'reference',
  classification: 'Cannabis Social Club Directory',
};

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'SocialClubsMaps',
  url: getBaseUrl(),
  logo: toAbsoluteUrl('/images/SCM_Logo_SVG.svg'),
  sameAs: [
    'https://www.instagram.com/socialclubsmaps',
    'https://x.com/socialclubsmaps',
    'https://www.tiktok.com/@socialclubsmaps',
  ],
};

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'SocialClubsMaps',
  url: getBaseUrl(),
  inLanguage: i18n.locales,
  potentialAction: {
    '@type': 'SearchAction',
    target: `${getBaseUrl()}/${i18n.defaultLocale}/clubs?search={search_term_string}`,
    'query-input': 'required name=search_term_string',
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const requestHeaders = await headers();
  const requestLocale = requestHeaders.get('x-scm-locale');
  const htmlLang = requestLocale && isLocale(requestLocale)
    ? requestLocale
    : i18n.defaultLocale;

  return (
    <html
      lang={htmlLang}
      className={`${plusJakarta.variable} ${playfair.variable} ${jetbrainsMono.variable}`}
    >
      <body className="font-sans antialiased">
        <JsonLd data={organizationJsonLd} />
        <JsonLd data={websiteJsonLd} />
        <AnalyticsDebugListener />
        {children}
      </body>
    </html>
  );
}

