import { getCurrentUserProfile } from '@/app/actions/users';
import UserProfilePageContent from './UserProfilePageContent';

// This page requires authentication, so it must be dynamic
export const dynamic = 'force-dynamic';

export default async function ProfilePage() {
  const userProfile = await getCurrentUserProfile();

  return <UserProfilePageContent userProfile={userProfile} />;
}
