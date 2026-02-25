'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useAuth } from '@/components/auth/AuthProvider';
import { getUnreadNotificationCount } from '@/app/actions/notifications';
import { 
  User, 
  Settings, 
  Heart, 
  Star, 
  LogOut, 
  ChevronDown, 
  Shield, 
  Bell, 
  Loader2, 
  Building2, 
  LayoutDashboard, 
  ClipboardList, 
  PanelTop 
} from '@/lib/icons';
import { cn } from '@/lib/utils';

interface UserProfileDropdownProps {
  className?: string;
}

export default function UserProfileDropdown({ className = '' }: UserProfileDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const { user, profile, signOut, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    let mounted = true;

    const loadUnreadCount = async () => {
      try {
        const count = await getUnreadNotificationCount();
        if (mounted) {
          setUnreadNotifications(count);
        }
      } catch {
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

  const handleLogout = async () => {
    setLoading(true);
    setIsOpen(false);
    await signOut();
    router.push('/');
    router.refresh();
  };

  if (authLoading) {
    return (
      <div className={cn('relative', className)}>
        <Button variant="ghost" size="sm" disabled className="flex items-center justify-center h-10 w-10 p-0 rounded-full bg-white/5 border border-white/10">
          <Loader2 className="h-4 w-4 animate-spin text-white/50" />
        </Button>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={cn('relative', className)}>
        <Link href="/account/login">
          <Button variant="ghost" size="sm" className="h-10 px-4 rounded-full bg-white/5 border border-white/10 text-white/80 hover:text-white hover:bg-white/10 transition-all">
            Log in
          </Button>
        </Link>
      </div>
    );
  }

  const displayName = profile?.displayName || user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';
  const userEmail = profile?.email || user.email || '';
  const isAdmin = profile?.role === 'ADMIN';
  const isClubAdmin = profile?.role === 'CLUB_ADMIN';
  const memberSince = profile?.createdAt ? new Date(profile.createdAt).getFullYear().toString() : new Date().getFullYear().toString();

  return (
    <div className={cn('relative', className)}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-10 items-center gap-2 pl-1 pr-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all group"
      >
        <div className="w-8 h-8 rounded-full overflow-hidden border border-white/20">
          {user.user_metadata?.avatar_url ? (
            <Image
              src={user.user_metadata.avatar_url}
              alt={displayName}
              width={32}
              height={32}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-brand/20 text-brand-light font-bold text-xs">
              {displayName.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <span className="hidden sm:inline font-medium text-white/90 group-hover:text-white text-sm">
          {displayName.split(' ')[0]}
        </span>
        <ChevronDown className={cn('h-3 w-3 text-white/40 transition-transform duration-300', isOpen && 'rotate-180')} />
      </Button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full right-0 mt-2 w-72 glass-dropdown py-4 z-50 animate-in fade-in zoom-in-95 duration-200">
            {/* User Info Header */}
            <div className="px-5 pb-4 border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden border border-white/10">
                  {user.user_metadata?.avatar_url ? (
                    <Image
                      src={user.user_metadata.avatar_url}
                      alt={displayName}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-brand/20 text-brand-light font-bold text-lg">
                      {displayName.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate text-white">{displayName}</h3>
                  <p className="text-xs text-white/50 truncate">{userEmail}</p>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    <Badge variant="outline" className="text-[10px] py-0 px-1.5 border-white/10 text-white/60">
                      Since {memberSince}
                    </Badge>
                    {isAdmin && (
                      <Badge className="text-[10px] py-0 px-1.5 bg-red-500/20 text-red-400 border-none">
                        Admin
                      </Badge>
                    )}
                    {isClubAdmin && (
                      <Badge className="text-[10px] py-0 px-1.5 bg-brand/20 text-brand-light border-none">
                        Club
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Role-based Navigation */}
            {(isAdmin || isClubAdmin) && (
              <div className="px-2 py-2 border-b border-white/5 space-y-1">
                {isAdmin && (
                  <Link
                    href="/admin"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                  >
                    <PanelTop className="h-4 w-4" />
                    <span className="text-sm font-medium">Platform Admin Portal</span>
                  </Link>
                )}
                {isClubAdmin && (
                  <Link
                    href="/club-panel/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg bg-brand/10 text-brand-light hover:bg-brand/20 transition-colors"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    <span className="text-sm font-medium">Club Dashboard</span>
                  </Link>
                )}
              </div>
            )}

            {/* Main Menu Items */}
            <div className="px-2 py-2 space-y-1">
              <MenuLink href="/profile" icon={<User className="h-4 w-4 text-blue-400" />} label="My Profile" sublabel="Account settings" onClick={() => setIsOpen(false)} />
              <MenuLink href="/profile/favorites" icon={<Heart className="h-4 w-4 text-red-400" />} label="Saved Clubs" sublabel="Your favorites" onClick={() => setIsOpen(false)} />
              <MenuLink href="/profile/reviews" icon={<Star className="h-4 w-4 text-yellow-400" />} label="My Reviews" sublabel="Your contributions" onClick={() => setIsOpen(false)} />
              <MenuLink href="/profile/requests" icon={<ClipboardList className="h-4 w-4 text-green-400" />} label="Requests" sublabel="Membership status" onClick={() => setIsOpen(false)} />
            </div>

            {/* Secondary Menu */}
            <div className="px-2 py-2 border-t border-white/5 space-y-1">
              <MenuLink 
                href="/profile/notifications" 
                icon={<Bell className="h-4 w-4 text-purple-400" />} 
                label="Notifications" 
                sublabel={`${unreadNotifications} new`} 
                onClick={() => setIsOpen(false)} 
              />
              <MenuLink href="/profile/settings" icon={<Settings className="h-4 w-4 text-gray-400" />} label="Settings" sublabel="Preferences" onClick={() => setIsOpen(false)} />
            </div>

            {/* Logout */}
            <div className="px-2 pt-2 border-t border-white/5">
              <button
                onClick={handleLogout}
                disabled={loading}
                className="flex w-full items-center gap-3 px-3 py-2 rounded-lg text-white/70 hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50"
              >
                <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center">
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
                </div>
                <span className="text-sm font-medium">Log out</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function MenuLink({ href, icon, label, sublabel, onClick }: { href: string; icon: React.ReactNode; label: string; sublabel: string; onClick: () => void }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-3 px-3 py-2 rounded-lg text-white/70 hover:text-white hover:bg-white/5 transition-colors group"
    >
      <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <div>
        <div className="text-sm font-medium">{label}</div>
        <div className="text-[10px] text-white/40">{sublabel}</div>
      </div>
    </Link>
  );
}
