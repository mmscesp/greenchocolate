'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import MainNavigation from './MainNavigation';
import UserProfileDropdown from '@/components/UserProfileDropdown';
import LanguageSelector from '@/components/LanguageSelector';
import { Leaf } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 group">
              <Leaf className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold text-foreground">
                SocialClubsMaps
              </span>
            </Link>
          </div>
          <div className="flex items-center gap-6">
            <MainNavigation />
            <UserProfileDropdown />
            <LanguageSelector />
          </div>
        </div>
      </div>
    </nav>
  );
}
