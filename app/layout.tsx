import './globals.css';
import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Playfair_Display, JetBrains_Mono } from 'next/font/google';
import { LegalDisclaimer } from '@/components/LegalDisclaimer';
import AnalyticsDebugListener from '@/components/dev/AnalyticsDebugListener';
import { i18n } from '@/lib/i18n-config';

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
  metadataBase: new URL('https://socialclubsmaps.com'),
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
    url: 'https://socialclubsmaps.com',
    siteName: 'SocialClubsMaps',
    title: 'SocialClubsMaps - Cannabis Social Clubs Directory Spain',
    description: 'Discover and connect with verified cannabis social clubs in Spain. Browse directories in Barcelona, Madrid, Valencia, and more.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'SocialClubsMaps - Cannabis Social Clubs Directory',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SocialClubsMaps - Cannabis Social Clubs Directory Spain',
    description: 'Discover and connect with verified cannabis social clubs in Spain.',
    images: ['/og-image.png'],
    creator: '@socialclubsmaps',
  },
  icons: {
    icon: '/images/SCM_Logo_OG.svg',
    shortcut: '/images/SCM_Logo_OG.svg',
    apple: '/images/SCM_Logo_OG.svg',
  },
  alternates: {
    canonical: 'https://socialclubsmaps.com',
    languages: Object.fromEntries(
      i18n.locales.map((locale) => [locale, `https://socialclubsmaps.com/${locale}`])
    ),
  },
  category: 'reference',
  classification: 'Cannabis Social Club Directory',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang={i18n.defaultLocale} className={`${plusJakarta.variable} ${playfair.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans antialiased">
        <LegalDisclaimer />
        <AnalyticsDebugListener />
        {children}
      </body>
    </html>
  );
}
