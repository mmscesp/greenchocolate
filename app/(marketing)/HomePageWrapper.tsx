import { getFeaturedClubs, getClubs } from '@/app/actions/clubs';
import HomePageContent from './HomePageContent';
import { ClubCard } from '@/app/actions/clubs';

interface HomePageWrapperProps {
  // Accept pre-computed data from server
  featuredClubs: ClubCard[];
  allClubs: ClubCard[];
}

export default async function HomePageWrapper() {
  // Fetch data in parallel on the server
  const [featuredClubs, allClubs] = await Promise.all([
    getFeaturedClubs(3),
    getClubs({ isVerified: true }),
  ]);

  return <HomePageContent featuredClubs={featuredClubs} allClubs={allClubs} />;
}
