import ClubsPageWrapper from './ClubsPageWrapper';
import { Metadata } from 'next';

// Force dynamic rendering to avoid build-time database calls
export const dynamic = 'force-dynamic';

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
