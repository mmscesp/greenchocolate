import { getClubs } from '@/app/actions/clubs';
import ClubsPageClient from './ClubsPageClient';

export default async function ClubsPageWrapper() {
  const clubs = await getClubs();
  const neighborhoods = Array.from(new Set(clubs.map((club) => club.neighborhood))).sort((a, b) => a.localeCompare(b));
  const amenities = Array.from(new Set(clubs.flatMap((club) => club.amenities))).sort((a, b) => a.localeCompare(b));
  const vibes = Array.from(new Set(clubs.flatMap((club) => club.vibeTags))).sort((a, b) => a.localeCompare(b));
  
  return (
    <ClubsPageClient 
      initialClubs={clubs}
      neighborhoods={neighborhoods}
      amenities={amenities}
      vibes={vibes}
    />
  );
}
