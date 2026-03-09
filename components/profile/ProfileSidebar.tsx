'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { useLanguage } from '@/hooks/useLanguage';
import { useAuth } from '@/components/auth/AuthProvider';
import { cn } from '@/lib/utils';
import {
  Bell,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Heart,
  Home,
  LogOut,
  Settings,
  Star,
  User,
} from '@/lib/icons';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Sidebar, useSidebar } from '@/components/ui/sidebar';

interface ProfileSidebarProps {
  className?: string;
}

type NavigationItem = {
  label: string;
  href: string;
  icon: typeof User;
};

function ProfileSidebarPanel({
  onTogglePinned,
  isPinned = false,
}: {
  onTogglePinned?: () => void;
  isPinned?: boolean;
}) {
  const { open } = useSidebar();
  const { t, language } = useLanguage();
  const { profile, user, signOut } = useAuth();
  const pathname = usePathname();

  const isExpanded = open;
  const displayName =
    profile?.displayName ||
    user?.user_metadata?.full_name ||
    user?.email?.split('@')[0] ||
    t('user.fallback.name');
  const avatarUrl = profile?.avatarUrl || user?.user_metadata?.avatar_url;
  const memberSince = profile?.createdAt
    ? new Date(profile.createdAt).getFullYear().toString()
    : new Date().getFullYear().toString();

  const navigation = useMemo<NavigationItem[]>(
    () => [
      { label: t('user.my_profile'), href: '/profile', icon: User },
      { label: t('user.favorites'), href: '/profile/favorites', icon: Heart },
      { label: t('user.my_reviews'), href: '/profile/reviews', icon: Star },
      { label: t('user.bookings'), href: '/profile/bookings', icon: Calendar },
      { label: t('user.notifications'), href: '/profile/notifications', icon: Bell },
      { label: t('user.settings'), href: '/profile/settings', icon: Settings },
    ],
    [t]
  );

  const localizedPath = (path: string) => `/${language}${path}`;

  return (
    <div
      className="relative flex h-full flex-col overflow-hidden rounded-[30px] border border-white/8 bg-[linear-gradient(180deg,rgba(10,14,24,0.98)_0%,rgba(13,18,32,0.98)_100%)] text-white shadow-[0_24px_80px_rgba(0,0,0,0.28)]"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-brand/10 via-brand/4 to-transparent" />
        <div className="absolute left-[-20%] top-[24%] h-52 w-52 rounded-full bg-brand/8 blur-3xl" />
        <div className="absolute bottom-[-12%] right-[-10%] h-40 w-40 rounded-full bg-gold/8 blur-3xl" />
      </div>

      <div className="relative z-10 flex h-full flex-col p-3">
        <div className={cn('flex items-center', isExpanded ? 'justify-between' : 'justify-center')}>
          <AnimatePresence initial={false}>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="min-w-0"
              >
                <p className="text-[0.65rem] font-black uppercase tracking-[0.3em] text-brand">
                  {t('profile.nav.title')}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {onTogglePinned ? (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label={t('profile.nav.title')}
              onClick={onTogglePinned}
              className="h-10 w-10 rounded-full border border-white/10 bg-white/5 text-zinc-300 hover:bg-white hover:text-black"
            >
              {isPinned ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </Button>
          ) : null}
        </div>

        <div className="mt-3">
          <div
            className={cn(
              'rounded-[26px] border border-white/8 bg-white/[0.035] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]',
              isExpanded ? 'px-3.5 py-3' : 'px-2.5 py-2.5'
            )}
          >
            <div className={cn('flex items-center gap-3', isExpanded ? '' : 'justify-center')}>
              <Avatar className={cn('border border-white/10', isExpanded ? 'h-11 w-11' : 'h-10 w-10')}>
                <AvatarImage src={avatarUrl || ''} />
                <AvatarFallback className="bg-brand/18 font-bold uppercase text-brand">
                  {displayName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="min-w-0 flex-1"
                  >
                    <p className="truncate text-sm font-semibold text-white">{displayName}</p>
                    <p className="truncate text-xs text-zinc-400">{user?.email}</p>
                    <p className="mt-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-brand/90">
                      {t('user.member_since')} {memberSince}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        <div className="mt-3 flex min-h-0 flex-1 flex-col justify-start">
          <nav className="space-y-2">
            {navigation.map((item) => {
              const href = localizedPath(item.href);
              const isActive = pathname === href || pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={href}
                  title={!isExpanded ? item.label : undefined}
                  className={cn(
                    'group relative flex min-h-12 items-center rounded-[20px] border transition-all duration-300',
                    isExpanded ? 'gap-3 px-3 py-2' : 'justify-center px-0 py-2',
                    isActive
                      ? 'border-brand/30 bg-brand/10 text-white shadow-[0_12px_30px_rgba(0,0,0,0.18)]'
                      : 'border-white/5 bg-white/[0.02] text-zinc-300 hover:border-white/10 hover:bg-white/[0.05] hover:text-white'
                  )}
                >
                  <div
                    className={cn(
                      'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border transition-all duration-300',
                      isActive
                        ? 'border-brand/20 bg-brand/16 text-brand'
                        : 'border-white/8 bg-black/20 text-zinc-400 group-hover:border-white/12 group-hover:text-white'
                    )}
                  >
                    <item.icon className="h-5 w-5" weight={isActive ? 'fill' : 'regular'} />
                  </div>

                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.span
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -8 }}
                        className="truncate text-sm font-semibold"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>

                  {isActive ? (
                    <motion.div
                      layoutId="desktop-profile-active"
                      className="absolute inset-y-3 left-0 w-1 rounded-full bg-brand"
                    />
                  ) : null}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto border-t border-white/8 pt-3">
          <div className="space-y-2">
            <Link href={`/${language}`} className="block">
              <Button
                variant="ghost"
                className={cn(
                  'h-10 w-full rounded-[18px] border border-white/8 bg-white/[0.03] text-zinc-300 hover:bg-white hover:text-black',
                  isExpanded ? 'justify-start gap-3 px-3' : 'justify-center px-0'
                )}
              >
                <Home className="h-4 w-4 shrink-0" />
                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.span
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -8 }}
                      className="text-sm font-medium"
                    >
                      {t('nav.back_to_site')}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Button>
            </Link>

            <Button
              variant="ghost"
              onClick={() => {
                void signOut();
              }}
              className={cn(
                'h-10 w-full rounded-[18px] border border-red-500/15 bg-red-500/[0.06] text-red-300 hover:bg-red-500 hover:text-white',
                isExpanded ? 'justify-start gap-3 px-3' : 'justify-center px-0'
              )}
            >
              <LogOut className="h-4 w-4 shrink-0" />
              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.span
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -8 }}
                    className="text-sm font-medium"
                  >
                    {t('nav.logout')}
                  </motion.span>
                )}
              </AnimatePresence>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProfileSidebar({ className }: ProfileSidebarProps) {
  const [open, setOpen] = useState(false);
  const [isPinned, setIsPinned] = useState(false);

  const handleTogglePinned = () => {
    setIsPinned((current) => {
      const next = !current;
      setOpen(next);
      return next;
    });
  };

  return (
    <Sidebar open={open} setOpen={setOpen}>
      <motion.aside
        animate={{ width: open ? 292 : 88 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        onMouseEnter={() => {
          if (!isPinned) {
            setOpen(true);
          }
        }}
        onMouseLeave={() => {
          if (!isPinned) {
            setOpen(false);
          }
        }}
        className={cn(
          'sticky top-24 z-30 hidden h-[calc(100dvh-6rem)] shrink-0 self-start lg:block',
          className
        )}
      >
        <ProfileSidebarPanel onTogglePinned={handleTogglePinned} isPinned={isPinned} />
      </motion.aside>
    </Sidebar>
  );
}
