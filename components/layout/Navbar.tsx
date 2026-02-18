'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import MainNavigation from './MainNavigation';
import UserProfileDropdown from '@/components/UserProfileDropdown';
import LanguageSelector from '@/components/LanguageSelector';
import { Logo } from '@/components/ui/logo';
import { cn } from '@/lib/utils';

export default function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Trigger glassmorphism only after the Hero Cinematic sequence is well underway
      setIsScrolled(window.scrollY > window.innerHeight * 2);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Check if it's the home page (root or just a locale like /en, /es)
  const isHomePage = pathname === '/' || /^\/(en|es|de|fr|it)(\/|$)/.test(pathname) && pathname.split('/').filter(Boolean).length <= 1;

  return (
    <nav
      className={cn(
        'z-50 transition-all duration-300 pointer-events-auto',
        isHomePage ? 'fixed top-0 left-0 right-0' : 'sticky top-0',
        isHomePage
          ? isScrolled
            ? 'bg-background/95 backdrop-blur border-b supports-[backdrop-filter]:bg-background/60'
            : 'dark bg-transparent border-transparent'
          : 'bg-background/95 backdrop-blur border-b supports-[backdrop-filter]:bg-background/60'
      )}
    >

      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 group">
              <Logo size="md" showText={false} href="" className="" imageClassName="h-8 w-8" />
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
