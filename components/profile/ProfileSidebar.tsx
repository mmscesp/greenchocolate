'use client';

import { useLanguage } from '@/hooks/useLanguage';
import { useAuth } from '@/components/auth/AuthProvider';
import { DesktopNavigationRail, type NavigationRailAction, type NavigationRailItem } from '@/components/layout/NavigationRail';
import {
  Bell,
  Calendar,
  Heart,
  Home,
  LogOut,
  Settings,
  Star,
  User,
} from '@/lib/icons';

interface ProfileSidebarProps {
  className?: string;
}

export function ProfileSidebar({ className }: ProfileSidebarProps) {
  const { t, language } = useLanguage();
  const { profile, user, signOut } = useAuth();

  const displayName =
    profile?.displayName ||
    user?.user_metadata?.full_name ||
    user?.email?.split('@')[0] ||
    t('user.fallback.name');
  const avatarUrl = profile?.avatarUrl || user?.user_metadata?.avatar_url;
  const memberSince = profile?.createdAt
    ? new Date(profile.createdAt).getFullYear().toString()
    : new Date().getFullYear().toString();
  const withLocale = (path: string) => `/${language}${path}`;

  const isMatch = (href: string, exact = false) => (pathname: string) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);

  const items: NavigationRailItem[] = [
    {
      id: 'profile-overview',
      label: t('user.my_profile'),
      href: withLocale('/profile'),
      icon: User,
      isActive: isMatch(withLocale('/profile'), true),
    },
    {
      id: 'profile-favorites',
      label: t('user.favorites'),
      href: withLocale('/profile/favorites'),
      icon: Heart,
      isActive: isMatch(withLocale('/profile/favorites')),
    },
    {
      id: 'profile-reviews',
      label: t('user.my_reviews'),
      href: withLocale('/profile/reviews'),
      icon: Star,
      isActive: isMatch(withLocale('/profile/reviews')),
    },
    {
      id: 'profile-bookings',
      label: t('user.bookings'),
      href: withLocale('/profile/bookings'),
      icon: Calendar,
      isActive: isMatch(withLocale('/profile/bookings')),
    },
    {
      id: 'profile-notifications',
      label: t('user.notifications'),
      href: withLocale('/profile/notifications'),
      icon: Bell,
      isActive: isMatch(withLocale('/profile/notifications')),
    },
    {
      id: 'profile-settings',
      label: t('user.settings'),
      href: withLocale('/profile/settings'),
      icon: Settings,
      isActive: isMatch(withLocale('/profile/settings')),
    },
  ];

  const footerActions: NavigationRailAction[] = [
    {
      id: 'profile-back',
      kind: 'link',
      label: t('nav.back_to_site'),
      href: `/${language}`,
      icon: Home,
    },
    {
      id: 'profile-logout',
      kind: 'button',
      label: t('nav.logout'),
      icon: LogOut,
      tone: 'danger',
      onClick: () => {
        void signOut();
      },
    },
  ];

  return (
    <DesktopNavigationRail
      railId="profile"
      variant="profile"
      title={t('profile.nav.title')}
      identity={{
        displayName,
        email: user?.email || '',
        avatarUrl,
        badgeText: `${t('user.member_since')} ${memberSince}`,
      }}
      items={items}
      footerActions={footerActions}
      className={className}
      stickyClassName="top-24 h-[calc(100dvh-6rem)]"
      expandedWidth={292}
      collapsedWidth={88}
    />
  );
}
