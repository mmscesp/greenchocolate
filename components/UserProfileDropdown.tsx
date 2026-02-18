'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useLanguage } from '@/hooks/useLanguage';
import { useAuth } from '@/components/auth/AuthProvider';
import { getUnreadNotificationCount } from '@/app/actions/notifications';
import {
  User,
  Settings,
  Heart,
  Star,
  Calendar,
  LogOut,
  ChevronDown,
  Shield,
  Bell,
  CreditCard,
  Loader2,
  Building2,
  LayoutDashboard,
  Users,
  ClipboardList,
} from 'lucide-react';

interface UserProfileDropdownProps {
  className?: string;
}

export default function UserProfileDropdown({ className = '' }: UserProfileDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const { t } = useLanguage();
  const { user, profile, signOut, loading: authLoading } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    setLoading(true);
    setIsOpen(false);
    await signOut();
    router.push('/');
    router.refresh();
  };

  // Show loading state
  if (authLoading) {
    return (
      <div className={`relative ${className}`}>
        <Button
          variant="ghost"
          size="sm"
          disabled
          className="flex items-center gap-2"
        >
          <Loader2 className="h-4 w-4 animate-spin" />
        </Button>
      </div>
    );
  }

  // If not logged in, show login button
  if (!user) {
    return (
      <div className={`relative ${className} flex items-center gap-3`}>
        <Link href="/account/login">
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground hover:bg-accent">
            Log in
          </Button>
        </Link>
      </div>
    );
  }

  // Get user display info
  const displayName = profile?.displayName || user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';
  const userEmail = profile?.email || user.email || '';
  const isAdmin = profile?.role === 'ADMIN';
  const isClubAdmin = profile?.role === 'CLUB_ADMIN';
  const memberSince = profile?.createdAt
    ? new Date(profile.createdAt).getFullYear().toString()
    : new Date().getFullYear().toString();

  useEffect(() => {
    let mounted = true;

    const loadUnreadCount = async () => {
      try {
        const count = await getUnreadNotificationCount();
        if (mounted) {
          setUnreadNotifications(count);
        }
      } catch (error) {
        if (mounted) {
          setUnreadNotifications(0);
        }
      }
    };

    if (user) {
      loadUnreadCount();
    }

    return () => {
      mounted = false;
    };
  }, [user]);

  return (
    <div className={`relative ${className}`}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 hover:bg-accent"
      >
        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
          {user.user_metadata?.avatar_url ? (
            <Image
              src={user.user_metadata.avatar_url}
              alt={displayName}
              width={32}
              height={32}
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <User className="h-4 w-4 text-primary" />
          )}
        </div>
        <span className="hidden sm:inline font-medium text-foreground">
          {displayName.split(' ')[0]}
        </span>
        <ChevronDown className={`h-3 w-3 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </Button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown Menu */}
          <div className="absolute top-full right-0 mt-2 w-80 bg-background rounded-xl shadow-lg border border-border py-4 z-50 animate-in slide-in-from-top-2 duration-200">
            {/* User Info Header */}
            <div className="px-4 pb-4 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  {user.user_metadata?.avatar_url ? (
                    <Image
                      src={user.user_metadata.avatar_url}
                      alt={displayName}
                      width={48}
                      height={48}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <User className="h-6 w-6 text-primary" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate">{displayName}</h3>
                  <p className="text-sm text-muted-foreground truncate">{userEmail}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs">
                      Member since {memberSince}
                    </Badge>
                    {isAdmin && (
                      <Badge variant="default" className="bg-destructive text-destructive-foreground text-xs">
                        <Shield className="h-3 w-3 mr-1" />
                        Admin
                      </Badge>
                    )}
                    {isClubAdmin && (
                      <Badge variant="default" className="bg-primary text-primary-foreground text-xs">
                        <Building2 className="h-3 w-3 mr-1" />
                        Club Admin
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Role-based Navigation */}
            {isClubAdmin && (
              <div className="px-4 py-3 border-b border-border bg-primary/5">
                <Link
                  href="/club-panel/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  <span className="font-medium">Club Dashboard</span>
                </Link>
              </div>
            )}

            {/* Main Menu Items */}
            <div className="py-2">
              <Link
                href="/profile"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-2 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              >
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <div className="font-medium">My Profile</div>
                  <div className="text-xs text-muted-foreground">Account settings</div>
                </div>
              </Link>

              <Link
                href="/profile/favorites"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-2 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              >
                <div className="w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                  <Heart className="h-4 w-4 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <div className="font-medium">Saved Clubs</div>
                  <div className="text-xs text-muted-foreground">3 clubs saved</div>
                </div>
              </Link>

              <Link
                href="/profile/reviews"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-2 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              >
                <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center">
                  <Star className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div>
                  <div className="font-medium">My Reviews</div>
                  <div className="text-xs text-muted-foreground">12 reviews written</div>
                </div>
              </Link>

              <Link
                href="/profile/requests"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-2 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              >
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                  <ClipboardList className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <div className="font-medium">Membership Requests</div>
                  <div className="text-xs text-muted-foreground">Track your applications</div>
                </div>
              </Link>


            </div>

            {/* Secondary Menu */}
            <div className="py-2 border-t border-border">
              <Link
                href="/profile/notifications"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-2 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              >
                <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                  <Bell className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <div className="font-medium">Notifications</div>
                  <div className="text-xs text-muted-foreground">
                    {unreadNotifications} new notification{unreadNotifications === 1 ? '' : 's'}
                  </div>
                </div>
              </Link>

              <Link
                href="/profile/settings"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-2 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              >
                <div className="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                  <Settings className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                </div>
                <div>
                  <div className="font-medium">Settings</div>
                  <div className="text-xs text-muted-foreground">Preferences & privacy</div>
                </div>
              </Link>
            </div>

            {/* Logout */}
            <div className="pt-2 border-t border-border">
              <button
                onClick={handleLogout}
                disabled={loading}
                className="flex items-center gap-3 px-4 py-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors w-full disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <div className="w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                      <LogOut className="h-4 w-4 text-red-600 dark:text-red-400" />
                    </div>
                    <div className="font-medium">Log out</div>
                  </>
                )}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
