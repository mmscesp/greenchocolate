import ClubsPageWrapper from './ClubsPageWrapper';
import { Metadata } from 'next';

// ISR: Revalidate every hour
export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Cannabis Social Clubs Directory | Find CSCs in Spain | SocialClubsMaps',
  description: 'Browse verified cannabis social clubs in Madrid, Barcelona, and across Spain. Filter by neighborhood, amenities, and vibe. Pre-register for membership today.',
  keywords: 'cannabis social clubs directory, CSC Spain, Madrid cannabis clubs, Barcelona cannabis clubs, find cannabis clubs, marijuana clubs Spain',
  openGraph: {
    title: 'Cannabis Social Clubs Directory | SocialClubsMaps',
    description: 'Browse verified cannabis social clubs in Madrid, Barcelona, and across Spain.',
    type: 'website',
    locale: 'es_ES',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cannabis Social Clubs Directory | SocialClubsMaps',
    description: 'Browse verified cannabis social clubs in Spain.',
  },
  alternates: {
    canonical: 'https://socialclubsmaps.com/clubs',
  },
};

export default function ClubsPage() {
  return <ClubsPageWrapper />;
}
