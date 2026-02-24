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
      // The Hero is 400vh long. We only want the navbar to turn solid 
      // when the user is actually leaving the Hero section.
      setIsScrolled(window.scrollY > window.innerHeight * 3.8);
    };

    window.addEventListener('scroll', handleScroll);
    // Trigger once on mount to check initial position
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isHomePage = pathname === '/' || /^\/(en|es|de|fr|it)(\/|$)/.test(pathname) && pathname.split('/').filter(Boolean).length <= 1;

  return (
    <nav
      className={cn(
        'z-50 transition-all duration-500 pointer-events-auto', // Slower 500ms transition for premium fade
        isHomePage ? 'fixed left-0 right-0' : 'sticky top-0',
        
        // --- THE MAGIC LOGIC ---
        isHomePage && !isScrolled 
          // 1. Transparent State (Over the Sky):
          // We force 'dark' mode so text is white. We add a subtle gradient to protect against bright clouds.
          ? 'top-0 dark bg-gradient-to-b from-black/80 via-black/20 to-transparent border-transparent' 
          
          // 2. Scrolled State (Over the rest of the site):
          // Drops the gradient, removes 'dark' (reverting to system theme), adds glass blur and border.
          : 'top-0 bg-background/95 backdrop-blur-md border-b border-border shadow-sm supports-[backdrop-filter]:bg-background/60 text-foreground'
      )}
    >
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* We explicitly set text-foreground here so it inherits the forced 'dark' mode perfectly */}
        <div className="flex justify-between h-16 text-foreground"> 
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 group">
              <Logo size="md" showText={false} href="" className="" imageClassName="h-8 w-8" />
              <span className="text-xl font-bold tracking-tight">
                SocialClubsMaps
              </span>
            </Link>
          </div>
          <div className="flex items-center gap-2 md:gap-6">
            <MainNavigation />
            <UserProfileDropdown />
            <LanguageSelector />
          </div>
        </div>
      </div>
    </nav>
  );
}