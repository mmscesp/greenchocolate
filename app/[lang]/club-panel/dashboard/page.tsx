import { getClubForAdmin } from '@/app/actions/clubs';
import { createClient } from '@/lib/supabase/server';
import { ClubDashboardClient } from '@/components/club/ClubDashboardClient';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  // Get current authenticated user
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return <ClubDashboardClient club={null} />;
  }

  // Get the club managed by this user via managedClubId
  const club = await getClubForAdmin(user.id);

  return <ClubDashboardClient club={club} />;
}

