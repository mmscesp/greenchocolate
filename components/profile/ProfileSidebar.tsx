'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/hooks/useLanguage';
import { useAuth } from '@/components/auth/AuthProvider';
import { cn } from '@/lib/utils';
import {
  User,
  Heart,
  Star,
  Calendar,
  Bell,
  Settings,
  CreditCard,
  Home,
  LogOut,
  Menu,
  ChevronRight,
  ChevronLeft,
} from '@/lib/icons';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { LogoIcon } from '@/components/ui/logo';

interface ProfileSidebarProps {
  className?: string;
  isCollapsed?: boolean;
  onClose?: () => void;
  isMobile?: boolean;
  onToggle?: () => void;
}

function ProfileSidebarContent({ className, isCollapsed = false, onClose, isMobile = false }: ProfileSidebarProps) {
  const { t, language } = useLanguage();
  const { profile, user, signOut } = useAuth();
  const pathname = usePathname();

  const displayName = profile?.displayName || user?.user_metadata?.full_name || user?.email?.split('@')[0] || t('user.fallback.name');
  const avatarUrl = profile?.avatarUrl || user?.user_metadata?.avatar_url;
  const memberSince = profile?.createdAt
    ? new Date(profile.createdAt).getFullYear().toString()
    : new Date().getFullYear().toString();

  const navigation = [
    { name: t('user.my_profile'), href: '/profile', icon: User },
    { name: t('user.favorites'), href: '/profile/favorites', icon: Heart },
    { name: t('user.my_reviews'), href: '/profile/reviews', icon: Star },
    { name: t('user.bookings'), href: '/profile/bookings', icon: Calendar },
    { name: t('user.notifications'), href: '/profile/notifications', icon: Bell },
    { name: t('user.settings'), href: '/profile/settings', icon: Settings },
    { name: t('user.upgrade_premium'), href: '/profile/settings', icon: CreditCard },
  ];

  const showText = !isCollapsed || isMobile;
  const withLocale = (path: string) => `/${language}${path}`;

  return (
    <div className={cn('flex flex-col h-full bg-bg-base text-white border-r border-white/5', className)}>
      {isMobile && (
        <div className="flex items-center gap-2 h-20 border-b border-white/5 bg-black/80 backdrop-blur-md sticky top-0 z-10 px-8">
          <div className="bg-gold/10 p-2 rounded-xl border border-gold/20 shrink-0">
            <LogoIcon size="sm" />
          </div>
          <span className="text-xl font-serif tracking-tight text-white">{t('brand.name')}</span>
        </div>
      )}

      <div
        className={cn(
          'border-b border-white/5 bg-gradient-to-br from-white/5 to-transparent transition-all duration-300',
          isCollapsed && !isMobile ? 'p-4' : 'p-8'
        )}
      >
        <div
          className={cn(
            'flex items-center gap-4 transition-all duration-300',
            isCollapsed && !isMobile ? 'flex-col justify-center text-center gap-2' : ''
          )}
        >
          <Avatar
            className={cn(
              'border-2 border-gold/20 shadow-xl transition-all duration-300',
              isCollapsed && !isMobile ? 'h-10 w-10' : 'h-14 w-14'
            )}
          >
            <AvatarImage src={avatarUrl || ''} />
            <AvatarFallback className="bg-gold text-black font-black uppercase">
              {displayName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <AnimatePresence>
            {showText && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="overflow-hidden"
              >
                <h3 className="font-bold text-sm truncate leading-none mb-2 text-white">{displayName}</h3>
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest truncate">
                  {t('user.member_since')} {memberSince}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-8 px-4 custom-scrollbar">
        <nav className="space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname === `/${language}${item.href}`;
            return (
              <Link
                key={item.href}
                href={withLocale(item.href)}
                onClick={onClose}
                title={isCollapsed && !isMobile ? item.name : undefined}
                className={cn(
                  'group relative flex min-h-12 items-center gap-4 px-4 py-3 rounded-2xl text-[11px] font-bold uppercase tracking-widest transition-all duration-300',
                  isActive
                    ? 'bg-gold text-black shadow-lg shadow-gold/20'
                    : 'text-zinc-500 hover:text-white hover:bg-white/5',
                  isCollapsed && !isMobile ? 'justify-center px-0' : ''
                )}
              >
                <item.icon
                  className={cn(
                    'h-4.5 w-4.5 transition-transform duration-300 shrink-0',
                    isActive ? 'scale-110' : 'group-hover:scale-110'
                  )}
                />

                <AnimatePresence>
                  {showText && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      className="flex-1 overflow-hidden"
                    >
                      {item.name}
                    </motion.span>
                  )}
                </AnimatePresence>

                {isActive && showText && (
                  <motion.div
                    layoutId="active-nav-indicator"
                    className="absolute right-3 h-1.5 w-1.5 rounded-full bg-black/40"
                  />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      <div
        className={cn(
          'border-t border-white/5 space-y-2 bg-black/20 transition-all duration-300',
          isCollapsed && !isMobile ? 'p-4' : 'p-6'
        )}
      >
        <Link href={`/${language}`} onClick={onClose} className="block">
          <Button
            variant="ghost"
            className={cn(
              'w-full min-h-11 justify-start gap-4 rounded-xl text-zinc-500 hover:text-white hover:bg-white/5 text-[10px] font-bold uppercase tracking-widest',
              isCollapsed && !isMobile ? 'justify-center px-0' : ''
            )}
            size="sm"
          >
            <Home className="h-4 w-4 shrink-0" />
            {showText && <span>{t('nav.back_to_site')}</span>}
          </Button>
        </Link>
        <Button
          variant="ghost"
          onClick={() => signOut()}
          className={cn(
            'w-full min-h-11 justify-start gap-4 text-red-500/70 hover:text-red-400 hover:bg-red-500/5 rounded-xl text-[10px] font-bold uppercase tracking-widest',
            isCollapsed && !isMobile ? 'justify-center px-0' : ''
          )}
          size="sm"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {showText && <span>{t('nav.logout')}</span>}
        </Button>
      </div>
    </div>
  );
}

export function ProfileSidebar({
  className,
  isCollapsed = false,
  onToggle,
}: {
  className?: string;
  isCollapsed?: boolean;
  onToggle?: () => void;
}) {
  return (
    <aside
      className={cn(
        'hidden lg:flex flex-col sticky top-16 h-[calc(100vh-64px)] z-30 transition-all duration-300 ease-in-out border-r border-white/5 bg-bg-base',
        isCollapsed ? 'w-24' : 'w-72',
        className
      )}
    >
      <ProfileSidebarContent isCollapsed={isCollapsed} />

      {onToggle && (
        <Button
          variant="ghost"
          size="icon"
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          onClick={onToggle}
          className="absolute -right-4 top-8 h-8 w-8 rounded-full border border-white/10 bg-black shadow-xl hover:bg-white hover:text-black z-40 text-zinc-500 transition-all"
        >
          {isCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
        </Button>
      )}
    </aside>
  );
}

export function ProfileMobileNav() {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" aria-label={t('common.toggle_menu')} className="lg:hidden h-11 w-11 hover:bg-white/5 rounded-full transition-colors">
          <Menu className="h-6 w-6 text-zinc-400" />
          <span className="sr-only">{t('common.toggle_menu')}</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-[85vw] max-w-80 border-r-0 shadow-2xl bg-bg-base">
        <SheetHeader className="sr-only">
          <SheetTitle>{t('profile.nav.title')}</SheetTitle>
        </SheetHeader>
        <ProfileSidebarContent onClose={() => setOpen(false)} isMobile={true} />
      </SheetContent>
    </Sheet>
  );
}
