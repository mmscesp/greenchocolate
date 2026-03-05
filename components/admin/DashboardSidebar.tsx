'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/hooks/useLanguage';
import { cn } from '@/lib/utils';
import { LogoIcon } from '@/components/ui/logo';
import { BarChart3, Users, Calendar, Settings, LogOut, Home } from '@/lib/icons';

const navItems = [
  { href: '/club-panel/dashboard', labelKey: 'club_panel.nav.overview', icon: BarChart3 },
  { href: '/club-panel/dashboard/profile', labelKey: 'club_panel.nav.club_profile', icon: Settings },
  { href: '/club-panel/dashboard/requests', labelKey: 'club_panel.nav.membership_requests', icon: Users },
  { href: '/club-panel/dashboard/events', labelKey: 'club_panel.nav.events', icon: Calendar },
];

export function DashboardSidebar() {
  const { t } = useLanguage();
  const pathname = usePathname();

  return (
    <div className="w-full md:w-64 bg-card border-r border-gray-200 h-full md:h-screen flex flex-col">
      <div className="p-6 border-b">
        <Link href="/club-panel" className="flex items-center gap-2">
          <LogoIcon size="md" />
          <span className="font-bold text-gray-900">{t('club_panel.common.club_admin_fallback')}</span>
        </Link>
      </div>

      <nav className="flex-1 p-4">
        <div className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex min-h-11 items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                  isActive ? 'bg-green-50 text-green-600 font-medium' : 'text-gray-600 hover:bg-muted'
                )}
              >
                <Icon className="h-5 w-5" />
                <span>{t(item.labelKey)}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="p-4 border-t space-y-2">
        <Link href="/" className="flex min-h-11 items-center gap-3 px-4 py-3 text-gray-600 hover:bg-muted rounded-lg transition-colors">
          <Home className="h-5 w-5" />
          <span>{t('nav.back_to_site')}</span>
        </Link>
        <button type="button" className="w-full flex min-h-11 items-center gap-3 px-4 py-3 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors">
          <LogOut className="h-5 w-5" />
          <span>{t('nav.logout')}</span>
        </button>
      </div>
    </div>
  );
}
