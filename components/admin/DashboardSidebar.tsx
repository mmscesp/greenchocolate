'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Logo, LogoIcon } from '@/components/ui/logo';
import { BarChart3, Users, Calendar, Settings, LogOut, Home } from 'lucide-react';

const navItems = [
  { href: '/club-panel/dashboard', label: 'Overview', icon: BarChart3 },
  { href: '/club-panel/dashboard/profile', label: 'Profile', icon: Settings },
  { href: '/club-panel/dashboard/requests', label: 'Requests', icon: Users },
  { href: '/club-panel/dashboard/events', label: 'Events', icon: Calendar },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col">
      <div className="p-6 border-b">
        <Link href="/club-panel" className="flex items-center gap-2">
          <LogoIcon size="md" />
          <span className="font-bold text-gray-900">Club Admin</span>
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
                  'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                  isActive ? 'bg-green-50 text-green-600 font-medium' : 'text-gray-600 hover:bg-gray-50'
                )}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="p-4 border-t space-y-2">
        <Link href="/" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
          <Home className="h-5 w-5" />
          <span>Back to Site</span>
        </Link>
        <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors">
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
