'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/useLanguage';
import UserProfileDropdown from '@/components/UserProfileDropdown';
import LanguageSelector from '@/components/LanguageSelector';
import { Leaf } from 'lucide-react';

export default function Navbar() {
  const { t } = useLanguage();

  return (
    <nav className="glass-liquid sticky top-0 z-50 text-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="relative">
                <Leaf className="h-8 w-8 text-green-600 group-hover:text-green-700 transition-colors animate-float" />
                <div className="absolute inset-0 bg-green-400 rounded-full blur-lg opacity-20 group-hover:opacity-30 transition-opacity"></div>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                SocialClubsMaps
              </span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/clubs">
              <Button variant="ghost" className="hover:bg-green-50">{t('nav.explore')}</Button>
            </Link>
            <Link href="/learn">
              <Button variant="ghost" className="hover:bg-green-50">{t('nav.blog')}</Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="cannabis" size="sm" className="shadow-lg">{t('nav.dashboard')}</Button>
            </Link>
            <UserProfileDropdown />
            <LanguageSelector />
          </div>
        </div>
      </div>
    </nav>
  );
}
