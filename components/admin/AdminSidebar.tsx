'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { LayoutDashboard, 
Users, 
Building2, 
ClipboardList,
Newspaper,
CalendarDays,
BarChart3, 
FileText,
Shield,
Settings,
LogOut,
Menu,
ChevronLeft,
ChevronRight,
Home,
CheckCircle2, } from '@/lib/icons';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { adminSignOut } from '@/app/actions/admin-auth';
import { useLanguage } from '@/hooks/useLanguage';

interface AdminSidebarProps {
  className?: string;
  isCollapsed?: boolean;
  onClose?: () => void;
  isMobile?: boolean;
  onToggle?: () => void;
  adminInfo?: {
    displayName?: string | null;
    email: string;
    avatarUrl?: string | null;
  };
  lang?: string;
}

const navigation = [
  { 
    nameKey: 'admin.nav.dashboard', 
    href: '/admin', 
    icon: LayoutDashboard,
    exact: true 
  },
  { 
    nameKey: 'admin.nav.users', 
    href: '/admin/users', 
    icon: Users,
  },
  { 
    nameKey: 'admin.nav.clubs', 
    href: '/admin/clubs', 
    icon: Building2,
  },
  { 
    nameKey: 'admin.nav.verification_queue', 
    href: '/admin/clubs/verification', 
    icon: CheckCircle2,
  },
  { 
    nameKey: 'admin.nav.membership_requests', 
    href: '/admin/requests', 
    icon: ClipboardList,
  },
  {
    nameKey: 'admin.nav.content_articles',
    href: '/admin/content/articles',
    icon: Newspaper,
  },
  {
    nameKey: 'admin.nav.content_events',
    href: '/admin/content/events',
    icon: CalendarDays,
  },
  { 
    nameKey: 'admin.nav.analytics', 
    href: '/admin/analytics', 
    icon: BarChart3,
  },
  { 
    nameKey: 'admin.nav.audit_logs', 
    href: '/admin/audit-logs', 
    icon: FileText,
  },
  { 
    nameKey: 'admin.nav.settings', 
    href: '/admin/settings', 
    icon: Settings,
  },
];

function AdminSidebarContent({ 
  className, 
  isCollapsed = false, 
  onClose, 
  isMobile = false,
  adminInfo,
  lang = 'en',
}: AdminSidebarProps) {
  const { t } = useLanguage();
  const pathname = usePathname();
  const pathnameWithoutLocale = pathname.replace(/^\/[a-z]{2}(?=\/|$)/, '') || '/';
  
  const displayName = adminInfo?.displayName || t('admin.common.admin');
  const email = adminInfo?.email || 'admin@example.com';
  
  const showText = !isCollapsed || isMobile;
  const withLocale = (href: string) => `/${lang}${href}`;

  const signOutWithLang = adminSignOut.bind(null, lang);

  return (
    <div className={cn("flex flex-col h-full bg-slate-900 text-slate-100", className)}>
      {/* Header - Only on mobile */}
      {isMobile && (
        <div className="flex items-center gap-2 h-16 border-b border-slate-700 bg-slate-800/50 backdrop-blur-md sticky top-0 z-10 px-6">
          <div className="bg-slate-700 p-1.5 rounded-lg shrink-0">
            <Shield className="h-6 w-6 text-slate-100" />
          </div>
          <span className="text-lg font-bold tracking-tight">{t('admin.login.hero.title')}</span>
        </div>
      )}

      {/* Admin Info */}
      <div className={cn(
        "border-b border-slate-700 bg-gradient-to-br from-slate-800 to-slate-800/50 transition-all duration-300",
        isCollapsed && !isMobile ? "p-4" : "p-6"
      )}>
        <div className={cn(
          "flex items-center gap-3 transition-all duration-300",
          isCollapsed && !isMobile ? "flex-col justify-center text-center gap-1" : ""
        )}>
          <Avatar className={cn(
            "border-2 border-slate-600 shadow-sm transition-all duration-300",
            isCollapsed && !isMobile ? "h-10 w-10" : "h-12 w-12"
          )}>
            <AvatarImage src={adminInfo?.avatarUrl || ''} />
            <AvatarFallback className="bg-slate-700 text-slate-100 font-semibold">
              {displayName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          <AnimatePresence>
            {showText && (
              <motion.div 
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="overflow-hidden whitespace-nowrap"
              >
                <h3 className="font-bold truncate leading-none mb-1">{displayName}</h3>
                <p className="text-xs text-slate-400 truncate">{email}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-6 px-3">
        <nav className="space-y-1.5">
          {navigation.map((item) => {
            const isActive = item.exact
              ? pathnameWithoutLocale === item.href || pathnameWithoutLocale === '/admin'
              : pathnameWithoutLocale.startsWith(item.href);
            
            return (
              <Link
                key={item.href}
                href={withLocale(item.href)}
                onClick={onClose}
                title={isCollapsed && !isMobile ? t(item.nameKey) : undefined}
                className={cn(
                  "group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-slate-100 text-slate-900 shadow-md"
                    : "text-slate-300 hover:bg-slate-800 hover:text-slate-100",
                  isCollapsed && !isMobile ? "justify-center px-2" : ""
                )}
              >
                <item.icon className={cn(
                  "h-5 w-5 transition-transform duration-200 shrink-0",
                  isActive ? "scale-110" : "group-hover:scale-110"
                )} />
                
                <AnimatePresence>
                  {showText && (
                    <motion.span 
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      className="flex-1 overflow-hidden whitespace-nowrap"
                    >
                      {t(item.nameKey)}
                    </motion.span>
                  )}
                </AnimatePresence>

                {isActive && showText && (
                  <motion.div
                    layoutId="active-admin-nav-indicator"
                    className="absolute right-2 h-1.5 w-1.5 rounded-full bg-slate-900"
                  />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer */}
      <div className={cn(
        "border-t border-slate-700 space-y-2 bg-slate-800/30 transition-all duration-300",
        isCollapsed && !isMobile ? "p-2" : "p-4"
      )}>
        <Link href={`/${lang}`} onClick={onClose} className="block">
          <Button 
            variant="ghost" 
            className={cn(
              "w-full justify-start gap-3 rounded-xl text-slate-300 hover:text-slate-100 hover:bg-slate-800",
              isCollapsed && !isMobile ? "justify-center px-0" : ""
            )} 
            size="sm"
          >
            <Home className="h-4 w-4 shrink-0" />
            {showText && <span>{t('nav.back_to_site')}</span>}
          </Button>
        </Link>
        <form action={signOutWithLang}>
          <Button 
            type="submit"
            variant="ghost" 
            className={cn(
              "w-full justify-start gap-3 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-xl",
              isCollapsed && !isMobile ? "justify-center px-0" : ""
            )} 
            size="sm"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            {showText && <span>{t('nav.logout')}</span>}
          </Button>
        </form>
      </div>
    </div>
  );
}

export function AdminSidebar({ 
  className,
  isCollapsed = false,
  onToggle,
  adminInfo,
  lang = 'en',
}: { 
  className?: string;
  isCollapsed?: boolean;
  onToggle?: () => void;
  adminInfo?: {
    displayName?: string | null;
    email: string;
    avatarUrl?: string | null;
  };
  lang?: string;
}) {
  return (
    <aside className={cn(
      "hidden lg:flex flex-col sticky top-0 h-screen z-30 transition-all duration-300 ease-in-out border-r border-slate-700 shadow-xl",
      isCollapsed ? "w-20" : "w-64",
      className
    )}>
      <AdminSidebarContent isCollapsed={isCollapsed} adminInfo={adminInfo} lang={lang} />
      
      {/* Toggle Button */}
      {onToggle && (
        <Button
          variant="ghost"
          size="icon"
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          onClick={onToggle}
          className="absolute -right-3 top-4 h-6 w-6 rounded-full border border-slate-700 bg-slate-800 shadow-md hover:bg-slate-700 z-40 text-slate-300 hover:text-slate-100"
        >
          {isCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
        </Button>
      )}
    </aside>
  );
}

export function AdminMobileNav({
  adminInfo,
  lang = 'en',
}: {
  adminInfo?: { displayName?: string | null; email: string; avatarUrl?: string | null };
  lang?: string;
}) {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" aria-label={t('admin.nav.toggle_menu')} className="lg:hidden hover:bg-slate-800 rounded-full transition-colors">
          <Menu className="h-6 w-6 text-slate-300" />
          <span className="sr-only">{t('admin.nav.toggle_menu')}</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-72 border-r-0 shadow-2xl bg-slate-900">
        <SheetHeader className="sr-only">
          <SheetTitle>{t('admin.nav.title')}</SheetTitle>
        </SheetHeader>
        <AdminSidebarContent onClose={() => setOpen(false)} isMobile={true} adminInfo={adminInfo} lang={lang} />
      </SheetContent>
    </Sheet>
  );
}
