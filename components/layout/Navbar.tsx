'use client';

import Link from 'next/link';
import MainNavigation from './MainNavigation';
import UserProfileDropdown from '@/components/UserProfileDropdown';
import LanguageSelector from '@/components/LanguageSelector';
import { Leaf } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="glass-liquid sticky top-0 z-50 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="relative">
                <Leaf className="h-8 w-8 text-primary group-hover:text-primary/80 transition-colors animate-float" />
                <div className="absolute inset-0 bg-primary rounded-full blur-lg opacity-20 group-hover:opacity-40 transition-opacity"></div>
              </div>
              <span className="text-xl font-bold text-primary">
                SocialClubsMaps
              </span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <MainNavigation />
            <UserProfileDropdown />
            <LanguageSelector />
          </div>
        </div>
      </div>
    </nav>
  );
}
