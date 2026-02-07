import { getCurrentUserProfile } from '@/app/actions/users';
import UserProfilePageContent from './UserProfilePageContent';

export default async function ProfilePage() {
  const userProfile = await getCurrentUserProfile();

  return <UserProfilePageContent userProfile={userProfile} />;
}
