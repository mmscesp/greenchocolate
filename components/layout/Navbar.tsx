'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import MainNavigation, { desktopExploreItems, desktopPrimaryItems } from './MainNavigation';
import UserProfileDropdown from '@/components/UserProfileDropdown';
import LanguageSelector from '@/components/LanguageSelector';
import { Logo } from '@/components/ui/logo';
import { cn } from '@/lib/utils';
import { Menu, X } from '@/lib/icons';

export default function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pillOffsetY = 16;
  const closeMobileMenu = () => setMobileMenuOpen(false);

  useEffect(() => {
    const handleScroll = () => {
      // Transition to pill mode after 100px of scrolling
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  const isHomePage = pathname === '/' || /^\/(en|es|de|fr|it)(\/|$)/.test(pathname) && pathname.split('/').filter(Boolean).length <= 1;

  return (
    <>
      <motion.nav
        initial={false}
        animate={{
          y: isScrolled ? pillOffsetY : 0,
          width: isScrolled ? 'min(95%, 1100px)' : '100%',
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className={cn(
          'fixed inset-x-0 mx-auto top-0 z-50 transition-all duration-500',
          isScrolled 
            ? 'glass-liquid rounded-full px-6 py-2' 
            : cn(
                'w-full px-4 md:px-8 py-4 bg-transparent border-transparent',
                isHomePage && 'dark text-white'
              )
        )}
      >
        <div className="flex items-center justify-between w-full max-w-7xl mx-auto">
          {/* Logo Section */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 group">
              <Logo size="md" showText={false} href="" className="transition-transform group-hover:scale-110" imageClassName="h-10 w-10" />
              <span className={cn(
                "text-xl font-bold tracking-tight transition-all duration-300",
                isScrolled ? "text-white" : (isHomePage ? "text-white" : "text-foreground")
              )}>
                SocialClubsMaps
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className={cn(
            "hidden md:flex items-center rounded-full px-2 py-1 mx-4 transition-all duration-300",
            isScrolled ? "bg-white/5" : "bg-transparent"
          )}>
            <MainNavigation />
          </div>

          {/* Actions Section */}
          <div className="flex items-center gap-1 md:gap-3">
            <div className="hidden sm:flex items-center gap-1">
              <LanguageSelector />
            </div>
            
            <UserProfileDropdown />

            {/* Mobile Menu Trigger */}
            <button
              onClick={() => setMobileMenuOpen((isOpen) => !isOpen)}
              className="md:hidden flex h-10 w-10 items-center justify-center rounded-full hover:bg-white/10 text-white transition-colors"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 md:hidden glass-liquid pt-32 px-6 flex flex-col gap-8"
          >
            <div className="flex flex-col gap-6 text-2xl font-semibold text-white/90">
              {desktopPrimaryItems.map(({ href, label }) => (
                <Link key={href} href={href} onClick={closeMobileMenu} className="hover:text-white transition-colors">
                  {label}
                </Link>
              ))}
              {desktopExploreItems.map(({ href, title }) => (
                <Link key={href} href={href} onClick={closeMobileMenu} className="hover:text-white/85 hover:text-white transition-colors text-xl font-medium">
                  {title}
                </Link>
              ))}
            </div>

            <div className="mt-auto pb-12 flex flex-col gap-6 border-t border-white/10 pt-8">
              <div className="flex items-center justify-between">
                <span className="text-white/60 font-medium">Language</span>
                <LanguageSelector direction="up" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}