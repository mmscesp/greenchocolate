'use client';

import { useState } from 'react';
import {
  DesktopNavigationRail,
  MobileNavigationRailPanel,
  type NavigationRailAction,
  type NavigationRailItem,
} from '@/components/layout/NavigationRail';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from '@/components/ui/sheet';
import { adminSignOut } from '@/app/actions/admin-auth';
import { useLanguage } from '@/hooks/useLanguage';
import {
  BarChart3,
  Building2,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  FileText,
  Home,
  LayoutDashboard,
  LogOut,
  Menu,
  Newspaper,
  Settings,
  Users,
} from '@/lib/icons';

interface AdminSidebarProps {
  className?: string;
  adminInfo?: {
    displayName?: string | null;
    email: string;
    avatarUrl?: string | null;
  };
  lang?: string;
}

const isExactMatch = (href: string) => (pathname: string) => pathname === href;
const isPrefixMatch = (href: string) => (pathname: string) =>
  pathname === href || pathname.startsWith(`${href}/`);

interface AdminRailConfigParams {
  t: (key: string) => string;
  lang: string;
  adminInfo?: {
    displayName?: string | null;
    email: string;
    avatarUrl?: string | null;
  };
  onSelect?: () => void;
}

function createAdminRailConfig({
  t,
  lang,
  adminInfo,
  onSelect,
}: AdminRailConfigParams): {
  title: string;
  description: string;
  identity: {
    displayName: string;
    email: string;
    avatarUrl?: string | null;
    badgeText: string;
  };
  items: NavigationRailItem[];
  footerActions: NavigationRailAction[];
} {
  const withLocale = (href: string) => `/${lang}${href}`;
  const clubsHref = withLocale('/admin/clubs');
  const verificationHref = withLocale('/admin/clubs/verification');

  return {
    title: t('admin.nav.title'),
    description: t('admin.dashboard.header.description'),
    identity: {
      displayName: adminInfo?.displayName || t('admin.common.admin'),
      email: adminInfo?.email || 'admin@example.com',
      avatarUrl: adminInfo?.avatarUrl,
      badgeText: t('admin.shell.mode'),
    },
    items: [
      {
        id: 'admin-dashboard',
        label: t('admin.nav.dashboard'),
        href: withLocale('/admin'),
        icon: LayoutDashboard,
        isActive: isExactMatch(withLocale('/admin')),
      },
      {
        id: 'admin-users',
        label: t('admin.nav.users'),
        href: withLocale('/admin/users'),
        icon: Users,
        isActive: isPrefixMatch(withLocale('/admin/users')),
      },
      {
        id: 'admin-clubs',
        label: t('admin.nav.clubs'),
        href: clubsHref,
        icon: Building2,
        isActive: (pathname) =>
          (pathname === clubsHref || pathname.startsWith(`${clubsHref}/`)) &&
          !pathname.startsWith(verificationHref),
      },
      {
        id: 'admin-verification',
        label: t('admin.nav.verification_queue'),
        href: verificationHref,
        icon: CheckCircle2,
        isActive: isPrefixMatch(verificationHref),
      },
      {
        id: 'admin-requests',
        label: t('admin.nav.membership_requests'),
        href: withLocale('/admin/requests'),
        icon: ClipboardList,
        isActive: isPrefixMatch(withLocale('/admin/requests')),
      },
      {
        id: 'admin-articles',
        label: t('admin.nav.content_articles'),
        href: withLocale('/admin/content/articles'),
        icon: Newspaper,
        isActive: isPrefixMatch(withLocale('/admin/content/articles')),
      },
      {
        id: 'admin-events',
        label: t('admin.nav.content_events'),
        href: withLocale('/admin/content/events'),
        icon: CalendarDays,
        isActive: isPrefixMatch(withLocale('/admin/content/events')),
      },
      {
        id: 'admin-analytics',
        label: t('admin.nav.analytics'),
        href: withLocale('/admin/analytics'),
        icon: BarChart3,
        isActive: isPrefixMatch(withLocale('/admin/analytics')),
      },
      {
        id: 'admin-audit',
        label: t('admin.nav.audit_logs'),
        href: withLocale('/admin/audit-logs'),
        icon: FileText,
        isActive: isPrefixMatch(withLocale('/admin/audit-logs')),
      },
      {
        id: 'admin-settings',
        label: t('admin.nav.settings'),
        href: withLocale('/admin/settings'),
        icon: Settings,
        isActive: isPrefixMatch(withLocale('/admin/settings')),
      },
    ],
    footerActions: [
      {
        id: 'admin-back',
        kind: 'link',
        label: t('nav.back_to_site'),
        href: `/${lang}`,
        icon: Home,
        onSelect,
      },
      {
        id: 'admin-logout',
        kind: 'form',
        label: t('nav.logout'),
        icon: LogOut,
        tone: 'danger',
        action: adminSignOut.bind(null, lang),
        onSelect,
      },
    ],
  };
}

export function AdminSidebar({
  className,
  adminInfo,
  lang = 'en',
}: AdminSidebarProps) {
  const { t } = useLanguage();
  const railConfig = createAdminRailConfig({ t, lang, adminInfo });

  return (
    <DesktopNavigationRail
      railId="admin"
      variant="admin"
      title={railConfig.title}
      identity={railConfig.identity}
      items={railConfig.items}
      footerActions={railConfig.footerActions}
      className={className}
      stickyClassName="top-24 h-[calc(100dvh-6rem)]"
      expandedWidth={304}
      collapsedWidth={88}
    />
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
  const railConfig = createAdminRailConfig({
    t,
    lang,
    adminInfo,
    onSelect: () => setOpen(false),
  });

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" aria-label={t('admin.nav.toggle_menu')} className="lg:hidden hover:bg-slate-800 rounded-full transition-colors">
          <Menu className="h-6 w-6 text-slate-300" />
          <span className="sr-only">{t('admin.nav.toggle_menu')}</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[88vw] max-w-sm border-r-0 bg-transparent p-4 shadow-none">
        <SheetHeader className="sr-only">
          <SheetTitle>{railConfig.title}</SheetTitle>
          <SheetDescription>{railConfig.description}</SheetDescription>
        </SheetHeader>
        <MobileNavigationRailPanel
          railId="admin-mobile"
          variant="admin"
          title={railConfig.title}
          identity={railConfig.identity}
          items={railConfig.items}
          footerActions={railConfig.footerActions}
          onItemSelect={() => setOpen(false)}
        />
      </SheetContent>
    </Sheet>
  );
}
