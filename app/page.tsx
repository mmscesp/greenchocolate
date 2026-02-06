import { Metadata } from 'next';
import HomePageContent from './HomePageContent';

export const metadata: Metadata = {
  title: 'Cannabis Social Clubs Spain | SocialClubsMaps - Find & Join CSCs',
  description: 'Discover verified cannabis social clubs in Spain. Find CSCs in Madrid, Barcelona, and more. Pre-register for membership, explore amenities, and join the community.',
  keywords: 'cannabis social club, CSC, Spain, Madrid, Barcelona, marijuana club, cannabis association, join CSC, find cannabis club',
  openGraph: {
    title: 'Cannabis Social Clubs Spain | SocialClubsMaps',
    description: 'Discover verified cannabis social clubs in Spain. Find CSCs in Madrid, Barcelona, and more.',
    type: 'website',
    locale: 'es_ES',
    siteName: 'SocialClubsMaps',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cannabis Social Clubs Spain | SocialClubsMaps',
    description: 'Discover verified cannabis social clubs in Spain.',
  },
  alternates: {
    canonical: 'https://socialclubsmaps.com',
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
};

export default function HomePage() {
  return <HomePageContent />;
}
