import { getClubs } from '@/app/actions/clubs';
import { ClubDashboardClient } from '@/components/club/ClubDashboardClient';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  // In a real app with managedClubId, we'd filter by the current user's club
  // For now, we'll fetch all clubs and let the UI handle selection or use the first one
  const clubs = await getClubs({});
  
  // Use first club for demo (in production, this would filter by managedClubId)
  const firstClub = clubs.length > 0 ? clubs[0] : null;

  return <ClubDashboardClient club={firstClub} />;
}

