import { getCurrentUserProfile, getProfileBackendStatus } from '@/app/actions/users';
import UserProfilePageContent from './UserProfilePageContent';

// This page requires authentication, so it must be dynamic
export const dynamic = 'force-dynamic';

export default async function ProfilePage() {
  const [userProfile, backendStatus] = await Promise.all([
    getCurrentUserProfile(),
    getProfileBackendStatus(),
  ]);

  return <UserProfilePageContent userProfile={userProfile} backendStatus={backendStatus} />;
}
