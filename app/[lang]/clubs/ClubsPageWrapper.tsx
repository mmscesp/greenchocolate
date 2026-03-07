import { getClubs } from '@/app/actions/clubs';
import ClubsPageClient from './ClubsPageClient';

const LIVE_CLUB_SLUGS = new Set(['club-311-barcelona']);

export default async function ClubsPageWrapper() {
  const clubs = await getClubs();
  const liveClubs = clubs.filter((club) => LIVE_CLUB_SLUGS.has(club.slug));
  const neighborhoods = Array.from(new Set(liveClubs.map((club) => club.neighborhood))).sort((a, b) => a.localeCompare(b));
  const amenities = Array.from(new Set(liveClubs.flatMap((club) => club.amenities))).sort((a, b) => a.localeCompare(b));
  const vibes = Array.from(new Set(liveClubs.flatMap((club) => club.vibeTags))).sort((a, b) => a.localeCompare(b));
  
  return (
    <ClubsPageClient 
      initialClubs={liveClubs}
      neighborhoods={neighborhoods}
      amenities={amenities}
      vibes={vibes}
    />
  );
}
