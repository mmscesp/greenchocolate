import ClubsPageWrapper from './ClubsPageWrapper';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cannabis Social Clubs | SocialClubsMaps',
  description: 'Discover and explore cannabis social clubs. Find verified clubs with detailed information, amenities, and membership options.',
};

export default function ClubsPage() {
  return <ClubsPageWrapper />;
}
