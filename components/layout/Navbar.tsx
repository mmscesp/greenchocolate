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
import { useLanguage } from '@/hooks/useLanguage';

export default function Navbar() {
  const { t } = useLanguage();
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
            : 'w-full px-4 md:px-8 py-4 bg-transparent border-transparent'
        )}
      >
        <div className="flex items-center justify-between w-full max-w-7xl mx-auto">
          {/* Logo Section */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 group">
              <Logo size="md" showText={false} href="" className="transition-transform group-hover:scale-110" imageClassName="h-10 w-10" />
              <span className="text-xl font-bold tracking-tight text-liquid-aware transition-all duration-300">
                {t('brand.name')}
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className={cn(
            "hidden md:flex items-center rounded-full px-2 py-1 mx-4 transition-all duration-300 text-liquid-aware",
            isScrolled ? "bg-white/5" : "bg-transparent"
          )}>
            <MainNavigation />
          </div>

          {/* Desktop Actions Section */}
          <div className="hidden md:flex items-center gap-3 text-liquid-aware">
            <LanguageSelector />
            <UserProfileDropdown />
          </div>

          {/* Mobile Actions Section */}
          <div className="flex md:hidden items-center gap-1">
            <button
              onClick={() => setMobileMenuOpen((isOpen) => !isOpen)}
              className="relative flex h-10 w-10 items-center justify-center rounded-full hover:bg-white/10 text-liquid-aware transition-colors"
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
            className="fixed inset-0 z-40 md:hidden glass-liquid pt-24 px-6 flex flex-col gap-6"
          >
            {/* Rich Profile Header inside Mobile Menu */}
            <div className="pb-4 border-b border-white/10">
              <UserProfileDropdown variant="mobile-menu-row" onMobileClose={closeMobileMenu} />
            </div>

            <div className="flex flex-col gap-6 text-2xl font-semibold text-white/90 pt-2">
              {desktopPrimaryItems.map(({ href, labelKey }) => (
                <Link key={href} href={href} onClick={closeMobileMenu} className="hover:text-white transition-colors">
                  {t(labelKey)}
                </Link>
              ))}
              {desktopExploreItems.map(({ href, titleKey }) => (
                <Link key={href} href={href} onClick={closeMobileMenu} className="hover:text-white/85 hover:text-white transition-colors text-xl font-medium">
                  {t(titleKey)}
                </Link>
              ))}
            </div>

            <div className="mt-auto pb-12 flex flex-col gap-6 border-t border-white/10 pt-8">
              <div className="flex items-center justify-between">
                <span className="text-white/60 font-medium">{t('language.label')}</span>
                <LanguageSelector direction="up" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
