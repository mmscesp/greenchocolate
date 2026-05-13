import './globals.css';
import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { Plus_Jakarta_Sans, Playfair_Display, JetBrains_Mono } from 'next/font/google';
import AnalyticsDebugListener from '@/components/dev/AnalyticsDebugListener';
import { i18n, isLocale } from '@/lib/i18n-config';
import { JsonLd } from '@/components/JsonLd';
import { buildLanguageAlternates, buildSiteNavigationJsonLd, getBaseUrl, toAbsoluteUrl } from '@/lib/seo';

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
    default: 'SocialClubsMaps | Spain Cannabis Social Club Guidance',
    template: '%s | SocialClubsMaps',
  },
  description:
    'Independent, legally grounded guidance for cannabis social clubs in Spain, starting with Barcelona safety, verification standards, and visitor education.',
  keywords: [
    'cannabis social clubs Spain',
    'Barcelona cannabis social club guide',
    'Spain cannabis legal guide',
    'verified cannabis social club profiles',
    'SCM verification standard',
    'visitor safety guide Spain',
  ],
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
    title: 'SocialClubsMaps | Spain Cannabis Social Club Guidance',
    description:
      'Independent, legally grounded guidance for cannabis social clubs in Spain, starting with Barcelona safety, verification standards, and visitor education.',
    images: [
      {
        url: '/images/SCM_Logo_OG.png',
        alt: 'SocialClubsMaps independent cannabis social club guidance for Spain',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SocialClubsMaps | Spain Cannabis Social Club Guidance',
    description:
      'Independent, legally grounded guidance for cannabis social clubs in Spain, starting with Barcelona safety, verification standards, and visitor education.',
    images: ['/images/SCM_Logo_OG.png'],
    creator: '@socialclubsmaps',
  },
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/images/SCM_Logo_SVG.svg',
  },
  manifest: '/manifest.webmanifest',
  alternates: {
    languages: buildLanguageAlternates(''),
  },
  category: 'reference',
  classification: 'Cannabis social club education and verification guide',
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
    target: `${getBaseUrl()}/${i18n.defaultLocale}/spain/barcelona/clubs?search={search_term_string}`,
    'query-input': 'required name=search_term_string',
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const requestHeaders = await headers();
  const localeHeader = requestHeaders.get('x-scm-locale');
  const htmlLang = localeHeader && isLocale(localeHeader) ? localeHeader : i18n.defaultLocale;

  return (
    <html
      lang={htmlLang}
      className={`${plusJakarta.variable} ${playfair.variable} ${jetbrainsMono.variable}`}
    >
      <body className="font-sans antialiased">
        <JsonLd data={organizationJsonLd} />
        <JsonLd data={websiteJsonLd} />
        <JsonLd data={buildSiteNavigationJsonLd(htmlLang)} />
        <AnalyticsDebugListener />
        {children}
      </body>
    </html>
  );
}

