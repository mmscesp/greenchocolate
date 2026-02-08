'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import LanguageSelector from '@/components/LanguageSelector';
import { useLanguage } from '@/hooks/useLanguage';
import { 
  Leaf, 
  User, 
  Heart, 
  Star, 
  Calendar, 
  Bell, 
  Settings, 
  CreditCard,
  Menu, 
  X,
  Home,
  ArrowLeft
} from 'lucide-react';

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { t } = useLanguage();
  const pathname = usePathname();

  const navigation = [
    { name: t('user.my_profile'), href: '/profile', icon: User },
    { name: t('user.favorites'), href: '/profile/favorites', icon: Heart },
    { name: t('user.my_reviews'), href: '/profile/reviews', icon: Star },
    { name: t('user.bookings'), href: '/profile/bookings', icon: Calendar },
    { name: t('user.notifications'), href: '/profile/notifications', icon: Bell },
    { name: t('user.settings'), href: '/profile/settings', icon: Settings },
    { name: t('user.upgrade_premium'), href: '/profile/premium', icon: CreditCard },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between h-16 px-6 border-b">
          <Link href="/" className="flex items-center gap-2">
            <Leaf className="h-8 w-8 text-green-600" />
            <span className="text-lg font-bold text-gray-900">SocialClubsMaps</span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* User Info */}
        <div className="p-6 border-b bg-gradient-to-r from-green-50 to-emerald-50">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
              <User className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">María González</h3>
              <p className="text-sm text-gray-600">{t('user.member_since')} 2023</p>
            </div>
          </div>
        </div>

        <nav className="mt-8 px-4">
          <div className="space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-green-100 text-green-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </div>

          <div className="mt-8 pt-8 border-t">
            <Link
              href="/"
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <Home className="h-5 w-5" />
              {t('nav.back_to_site')}
            </Link>
          </div>
        </nav>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="bg-white shadow-sm border-b h-16 flex items-center justify-between px-4 lg:px-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-400 hover:text-gray-600"
            >
              <Menu className="h-6 w-6" />
            </button>
            
            <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm">{t('nav.back_to_site')}</span>
            </Link>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600">
              Mi Perfil - SocialClubsMaps
            </div>
            <LanguageSelector />
          </div>
        </div>

        {/* Page content */}
        <main className="p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}