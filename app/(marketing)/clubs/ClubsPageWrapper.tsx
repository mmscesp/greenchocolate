import { getClubs, getNeighborhoods, getAllAmenities, getAllVibes } from '@/app/actions/clubs';
import ClubsPageClient from './ClubsPageClient';

export default async function ClubsPageWrapper() {
  const [clubs, neighborhoods, amenities, vibes] = await Promise.all([
    getClubs(),
    getNeighborhoods(),
    getAllAmenities(),
    getAllVibes(),
  ]);
  
  return (
    <ClubsPageClient 
      initialClubs={clubs}
      neighborhoods={neighborhoods.map(n => n.name)}
      amenities={amenities}
      vibes={vibes}
    />
  );
}
