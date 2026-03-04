'use client';

import { useEffect, useRef, useState } from 'react';
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
  Bell, 
  Loader2, 
  LayoutDashboard, 
  ClipboardList, 
  PanelTop 
} from '@/lib/icons';
import { cn } from '@/lib/utils';
import { Drawer } from 'vaul';
import { useLanguage } from '@/hooks/useLanguage';

interface UserProfileDropdownProps {
  className?: string;
  variant?: 'dropdown' | 'mobile-menu-row';
  onMobileClose?: () => void;
  tone?: 'light' | 'dark';
}

export default function UserProfileDropdown({ className = '', variant = 'dropdown', onMobileClose, tone = 'light' }: UserProfileDropdownProps) {
  const { t, language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const previousBodyOverflowRef = useRef<string | null>(null);
  const { user, profile, signOut, loading: authLoading } = useAuth();
  const router = useRouter();
  const withLocale = (path: string) => `/${language}${path}`;
  const useLightTone = variant === 'mobile-menu-row' ? true : tone === 'light';

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

  useEffect(() => {
    if (isOpen && typeof window !== 'undefined' && window.innerWidth < 768) {
      if (previousBodyOverflowRef.current === null) {
        previousBodyOverflowRef.current = document.body.style.overflow;
      }
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = previousBodyOverflowRef.current ?? '';
      previousBodyOverflowRef.current = null;
    }

    return () => {
      if (previousBodyOverflowRef.current !== null) {
        document.body.style.overflow = previousBodyOverflowRef.current;
        previousBodyOverflowRef.current = null;
      }
    };
  }, [isOpen]);

  const handleLogout = async () => {
    setLoading(true);
    setIsOpen(false);
    if (onMobileClose) onMobileClose();
    await signOut();
    router.push(`/${language}`);
    router.refresh();
  };

  const handleLinkClick = () => {
    setIsOpen(false);
    if (onMobileClose) onMobileClose();
  };

  const formatText = (key: string, values: Record<string, string | number>) => {
    let message = t(key);

    for (const [name, value] of Object.entries(values)) {
      message = message.replace(`{{${name}}}`, String(value));
    }

    return message;
  };

  if (authLoading) {
    return (
      <div className={cn('relative', className)}>
        <Button
          variant="ghost"
          size="sm"
          disabled
          className={cn(
            'flex items-center justify-center h-10 w-10 p-0 rounded-full border',
            useLightTone ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'
          )}
        >
          <Loader2 className={cn('h-4 w-4 animate-spin', useLightTone ? 'text-white/50' : 'text-slate-500')} />
        </Button>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={cn('relative', className)}>
        <Link href={withLocale('/account/login')}>
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              'h-10 px-4 rounded-full border transition-all',
              useLightTone
                ? 'bg-white/5 border-white/10 text-white/80 hover:text-white hover:bg-white/10'
                : 'bg-black/5 border-black/10 text-slate-700 hover:text-slate-900 hover:bg-black/10'
            )}
          >
            {t('auth.login')}
          </Button>
        </Link>
      </div>
    );
  }

  const displayName = profile?.displayName || user.user_metadata?.full_name || user.email?.split('@')[0] || t('user.fallback.name');
  const userEmail = profile?.email || user.email || '';
  const isAdmin = profile?.role === 'ADMIN';
  const isClubAdmin = profile?.role === 'CLUB_ADMIN';
  const memberSince = profile?.createdAt ? new Date(profile.createdAt).getFullYear().toString() : new Date().getFullYear().toString();

  const renderProfileMenuContent = () => (
    <>
      {/* User Info Header */}
      <div className="px-6 md:px-5 pb-5 md:pb-4 border-b border-white/5 shrink-0 pt-4 md:pt-0">
        <div className="flex items-center gap-4 md:gap-3">
          <div className="w-14 h-14 md:w-12 md:h-12 rounded-full overflow-hidden border border-white/10 shrink-0">
            {user.user_metadata?.avatar_url ? (
              <Image
                src={user.user_metadata.avatar_url}
                alt={displayName}
                width={56}
                height={56}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-brand/20 text-brand-light font-bold text-xl md:text-lg">
                {displayName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg md:text-base truncate text-white">{displayName}</h3>
            <p className="text-sm md:text-xs text-white/50 truncate">{userEmail}</p>
            <div className="flex flex-wrap gap-1.5 mt-2">
              <Badge variant="outline" className="text-[10px] py-0 px-1.5 border-white/10 text-white/60">
                {t('user.member_since')} {memberSince}
              </Badge>
              {isAdmin && (
                <Badge className="text-[10px] py-0 px-1.5 bg-red-500/20 text-red-400 border-none">
                  {t('admin.common.admin')}
                </Badge>
              )}
              {isClubAdmin && (
                <Badge className="text-[10px] py-0 px-1.5 bg-brand/20 text-brand-light border-none">
                  {t('user.role.club_admin')}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable Area */}
      <div className="overflow-y-auto max-h-[60vh] md:max-h-[none] custom-scrollbar">
        {/* Role-based Navigation */}
        {(isAdmin || isClubAdmin) && (
          <div className="px-3 md:px-2 py-3 md:py-2 border-b border-white/5 space-y-1">
            {isAdmin && (
                <Link
                href={withLocale('/admin')}
                onClick={handleLinkClick}
                className="flex items-center gap-3 px-4 md:px-3 py-3 md:py-2 rounded-xl md:rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
              >
                <PanelTop className="h-5 w-5 md:h-4 md:w-4" />
                <span className="text-base md:text-sm font-medium">{t('user.menu.platform_admin_portal')}</span>
              </Link>
            )}
            {isClubAdmin && (
              <Link
                href={withLocale('/club-panel/dashboard')}
                onClick={handleLinkClick}
                className="flex items-center gap-3 px-4 md:px-3 py-3 md:py-2 rounded-xl md:rounded-lg bg-brand/10 text-brand-light hover:bg-brand/20 transition-colors"
              >
                <LayoutDashboard className="h-5 w-5 md:h-4 md:w-4" />
                <span className="text-base md:text-sm font-medium">{t('nav.dashboard')}</span>
              </Link>
            )}
          </div>
        )}

        {/* Main Menu Items */}
        <div className="px-3 md:px-2 py-3 md:py-2 space-y-1">
          <MenuLink href={withLocale('/profile')} icon={<User className="h-5 w-5 md:h-4 md:w-4 text-blue-400" />} label={t('user.my_profile')} sublabel={t('user.menu.profile_desc')} onClick={handleLinkClick} />
          <MenuLink href={withLocale('/profile/favorites')} icon={<Heart className="h-5 w-5 md:h-4 md:w-4 text-red-400" />} label={t('user.favorite_clubs')} sublabel={t('user.menu.favorites_desc')} onClick={handleLinkClick} />
          <MenuLink href={withLocale('/profile/reviews')} icon={<Star className="h-5 w-5 md:h-4 md:w-4 text-brand" />} label={t('user.my_reviews')} sublabel={t('user.menu.reviews_desc')} onClick={handleLinkClick} />
          <MenuLink href={withLocale('/profile/requests')} icon={<ClipboardList className="h-5 w-5 md:h-4 md:w-4 text-green-400" />} label={t('dashboard.requests')} sublabel={t('user.menu.requests_desc')} onClick={handleLinkClick} />
        </div>

        {/* Secondary Menu */}
        <div className="px-3 md:px-2 py-3 md:py-2 border-t border-white/5 space-y-1">
          <MenuLink 
            href={withLocale('/profile/notifications')} 
            icon={<Bell className="h-5 w-5 md:h-4 md:w-4 text-purple-400" />} 
            label={t('user.notifications')} 
            sublabel={formatText('user.menu.new_count', { count: unreadNotifications })} 
            onClick={handleLinkClick} 
          />
          <MenuLink href={withLocale('/profile/settings')} icon={<Settings className="h-5 w-5 md:h-4 md:w-4 text-gray-400" />} label={t('user.settings')} sublabel={t('user.settings_desc')} onClick={handleLinkClick} />
        </div>

        {/* Logout */}
        <div className="px-3 md:px-2 pt-3 md:pt-2 pb-2 md:pb-0 border-t border-white/5">
          <button
            onClick={handleLogout}
            disabled={loading}
            className="flex w-full items-center gap-4 md:gap-3 px-4 md:px-3 py-3 md:py-2 rounded-xl md:rounded-lg text-white/70 hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50"
          >
            <div className="w-10 h-10 md:w-8 md:h-8 rounded-full bg-red-500/10 flex items-center justify-center shrink-0">
              {loading ? <Loader2 className="h-5 w-5 md:h-4 md:w-4 animate-spin" /> : <LogOut className="h-5 w-5 md:h-4 md:w-4" />}
            </div>
            <span className="text-base md:text-sm font-medium">{t('nav.logout')}</span>
          </button>
        </div>
      </div>
    </>
  );

  const renderDesktopTrigger = () => (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setIsOpen(!isOpen)}
      className={cn(
        'flex h-10 items-center gap-2 pl-1 pr-3 rounded-full border transition-all group',
        useLightTone
          ? 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
          : 'bg-black/5 border-black/10 hover:bg-black/10 hover:border-black/20'
      )}
    >
      <div className={cn('w-8 h-8 rounded-full overflow-hidden border', useLightTone ? 'border-white/20' : 'border-black/15')}>
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
      <span className={cn('hidden sm:inline font-medium text-sm', useLightTone ? 'text-white group-hover:text-white' : 'text-slate-900 group-hover:text-slate-950')}>
        {displayName.split(' ')[0]}
      </span>
      <ChevronDown className={cn('h-3 w-3 transition-transform duration-300', useLightTone ? 'text-white/40' : 'text-slate-500', isOpen && 'rotate-180')} />
    </Button>
  );

  const renderMobileMenuRowTrigger = () => (
    <button
      onClick={() => setIsOpen(true)}
      className="flex items-center gap-4 w-full px-2 py-3 rounded-2xl hover:bg-white/5 transition-colors group text-left"
    >
      <div className="w-12 h-12 rounded-full overflow-hidden border border-white/20 shrink-0">
        {user.user_metadata?.avatar_url ? (
          <Image
            src={user.user_metadata.avatar_url}
            alt={displayName}
            width={48}
            height={48}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-brand/20 text-brand-light font-bold text-lg">
            {displayName.charAt(0).toUpperCase()}
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-xl text-white truncate">{displayName}</h3>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-sm text-brand-light font-medium group-hover:text-brand-light/80 transition-colors">
            {t('user.menu.view_profile')}
          </span>
          {unreadNotifications > 0 && (
            <Badge className="bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 border-none px-1.5 py-0">
              {formatText('user.menu.new_count', { count: unreadNotifications })}
            </Badge>
          )}
        </div>
      </div>
      <ChevronDown className="h-5 w-5 text-white/40 group-hover:text-white/70 transition-colors -rotate-90 shrink-0" />
    </button>
  );
  return (
    <div className={cn('relative', className)}>
      {variant === 'dropdown' ? renderDesktopTrigger() : renderMobileMenuRowTrigger()}

      {/* Desktop Floating Dropdown */}
      {variant === 'dropdown' && isOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-transparent" onClick={() => setIsOpen(false)} />
          <div className="absolute z-50 glass-dropdown flex flex-col overflow-hidden top-full right-0 mt-2 w-[320px] rounded-2xl border-b pb-4 pt-4 shadow-2xl animate-in slide-in-from-top-2 zoom-in-95 duration-200">
            {renderProfileMenuContent()}
          </div>
        </>
      )}

      {/* Mobile Swipeable Drawer using Vaul */}
      {variant === 'mobile-menu-row' && (
        <Drawer.Root open={isOpen} onOpenChange={setIsOpen}>
          <Drawer.Portal>
            <Drawer.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" />
            <Drawer.Content className="glass-dropdown flex flex-col rounded-t-[32px] mt-24 max-h-[90vh] fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 outline-none pb-8">
              <div className="p-4 bg-transparent mx-auto shrink-0 w-full flex items-center justify-center">
                <div className="w-12 h-1.5 bg-white/20 rounded-full" />
              </div>
              <div className="flex-1 overflow-y-auto custom-scrollbar">
                {renderProfileMenuContent()}
              </div>
            </Drawer.Content>
          </Drawer.Portal>
        </Drawer.Root>
      )}
    </div>
  );
}

function MenuLink({ href, icon, label, sublabel, onClick }: { href: string; icon: React.ReactNode; label: string; sublabel: string; onClick: () => void }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-4 md:gap-3 px-4 md:px-3 py-3 md:py-2 rounded-xl md:rounded-lg text-white/70 hover:text-white hover:bg-white/5 transition-colors group"
    >
      <div className="w-10 h-10 md:w-8 md:h-8 rounded-full bg-white/5 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-base md:text-sm font-medium truncate">{label}</div>
        <div className="text-[11px] md:text-[10px] text-white/40 truncate">{sublabel}</div>
      </div>
    </Link>
  );
}
