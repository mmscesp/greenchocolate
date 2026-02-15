import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

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
  alternates: {
    canonical: 'https://socialclubsmaps.com',
    languages: {
      es: 'https://socialclubsmaps.com/es',
      en: 'https://socialclubsmaps.com/en',
      fr: 'https://socialclubsmaps.com/fr',
      de: 'https://socialclubsmaps.com/de',
      it: 'https://socialclubsmaps.com/it',
      pl: 'https://socialclubsmaps.com/pl',
      ru: 'https://socialclubsmaps.com/ru',
      pt: 'https://socialclubsmaps.com/pt',
    },
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
    <html>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
