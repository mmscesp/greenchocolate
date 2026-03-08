'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import MainNavigation, { desktopExploreItems } from './MainNavigation';
import UserProfileDropdown from '@/components/UserProfileDropdown';
import LanguageSelector from '@/components/LanguageSelector';
import { Logo } from '@/components/ui/logo';
import { cn } from '@/lib/utils';
import { Menu, X } from '@/lib/icons';
import { useLanguage } from '@/hooks/useLanguage';

export default function Navbar() {
  const { t, language } = useLanguage();
  const shouldReduceMotion = useReducedMotion();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const previousBodyOverflowRef = useRef<string | null>(null);
  const pillOffsetY = 16;
  const closeMobileMenu = () => setMobileMenuOpen(false);
  const withLocale = (path: string) => `/${language}${path}`;
  const localizedHomePath = `/${language}`;

  useEffect(() => {
    let frameId: number | null = null;

    const handleScroll = () => {
      if (frameId !== null) return;
      frameId = window.requestAnimationFrame(() => {
        frameId = null;
        const nextScrolled = window.scrollY > 100;
        setIsScrolled((current) => (current === nextScrolled ? current : nextScrolled));
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      if (previousBodyOverflowRef.current === null) {
        previousBodyOverflowRef.current = document.body.style.overflow;
      }
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = previousBodyOverflowRef.current ?? '';
      previousBodyOverflowRef.current = null;
    }

    return () => {
      if (previousBodyOverflowRef.current !== null) {
        document.body.style.overflow = previousBodyOverflowRef.current;
        previousBodyOverflowRef.current = null;
      }
    };
  }, [mobileMenuOpen]);

  // Close mobile menu on resize to desktop, and handle Escape key
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keydown', handleKeyDown);
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
        transition={
          shouldReduceMotion
            ? { duration: 0.2 }
            : { type: 'spring', stiffness: 300, damping: 30 }
        }
        className={cn(
          'fixed inset-x-0 mx-auto z-50 transition-all duration-500',
          isScrolled
            ? 'top-4 glass-liquid rounded-full px-6 py-2'
            : 'top-0 w-full px-4 md:px-8 py-3 md:py-4 bg-transparent border-transparent'
        )}
      >
        <div className="flex items-center justify-between w-full max-w-7xl mx-auto">
          {/* Logo Section */}
          <div className="flex items-center">
            <Logo
              href={localizedHomePath}
              size={isScrolled ? 'md' : 'lg'}
              showText={false}
              className="gap-3 scale-90 md:scale-100 origin-left transition-transform"
              imageClassName="drop-shadow-[0_1px_4px_rgba(0,0,0,0.25)]"
              priority
            />
            <Link href={localizedHomePath} className="flex items-center">
              <span className="text-xl font-bold tracking-tight transition-all duration-300 text-white">
                {t('brand.name')}
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className={cn(
            'hidden md:flex items-center rounded-full px-2 py-1 mx-4 transition-all duration-300',
            isScrolled ? 'bg-white/5' : 'bg-transparent'
          )}>
            <MainNavigation tone="light" />
          </div>

          {/* Desktop Actions Section */}
          <div className={cn('hidden md:flex items-center gap-3')}>
            <LanguageSelector />
            <UserProfileDropdown />
            <motion.div
              whileHover={shouldReduceMotion ? undefined : { scale: 1.02 }}
              whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
              transition={{ duration: 0.2 }}
              className="inline-block"
            >
              <Link
                href={withLocale('/safety-kit')}
                className="inline-block px-5 py-2 text-sm font-bold bg-brand text-black rounded-full hover:bg-brand-dark transition-colors shadow-sm"
              >
                {t('nav.get_safety_kit')}
              </Link>
            </motion.div>
          </div>

          {/* Mobile Actions Section */}
          <div className="flex md:hidden items-center gap-1">
            {/* [motion] */}
            <motion.button
              whileHover={shouldReduceMotion ? undefined : { rotate: 5, scale: 1.1 }}
              whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileMenuOpen((isOpen) => !isOpen)}
              aria-label={mobileMenuOpen ? t('nav.mobile.close_menu') : t('nav.mobile.open_menu')}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-site-menu"
              className={cn(
                'relative flex h-10 w-10 items-center justify-center rounded-full transition-colors',
                'hover:bg-white/10 text-white'
              )}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </motion.button>
          </div>
        </div>
      </motion.nav>
      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          // [motion]
          <motion.div
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -20 }}
            animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -20 }}
            transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
            id="mobile-site-menu"
            role="dialog"
            aria-modal="true"
            aria-label={t('nav.mobile.open_menu')}
            className="fixed inset-x-0 top-0 h-[100dvh] z-40 md:hidden glass-liquid pt-20 px-6 pb-[env(safe-area-inset-bottom,24px)] flex flex-col gap-4 overflow-y-auto overscroll-contain"
          >
            {/* Rich Profile Header & Actions inside Mobile Menu */}
            <div className="pb-4 border-b border-white/10 shrink-0 flex items-center justify-between gap-4">
              <div className="flex-1">
                <UserProfileDropdown variant="mobile-menu-row" onMobileClose={closeMobileMenu} />
              </div>
              <div className="shrink-0 flex items-center justify-end">
                <LanguageSelector />
              </div>
            </div>

            <div className="flex flex-col gap-4 text-xl font-semibold text-white/90 pt-2 shrink-0">
              <Link href={withLocale('/editorial')} onClick={closeMobileMenu} className="hover:text-white transition-colors">
                {t('nav.guides')}
              </Link>
              <Link href={withLocale('/clubs')} onClick={closeMobileMenu} className="hover:text-white transition-colors">
                {t('nav.clubs_directory')}
              </Link>
              <Link href={withLocale('/events')} onClick={closeMobileMenu} className="hover:text-white transition-colors">
                {t('nav.events')}
              </Link>
              <div className="pt-4 border-t border-white/10 flex flex-col gap-4">
                <span className="block text-sm uppercase tracking-wider text-white/50">{t('nav.cities')}</span>
                {desktopExploreItems.map(({ href, titleKey, comingSoon }) => {
                  if (comingSoon || !href) {
                    return (
                      <div key={titleKey} className="flex items-center justify-between gap-3 text-white/60 text-lg font-medium cursor-not-allowed" aria-disabled="true">
                        <span>{t(titleKey)}</span>
                        <span className="rounded-full border border-white/20 bg-white/10 px-2 py-0.5 text-[10px] uppercase tracking-wide text-white/80">
                          {t('nav.coming_soon')}
                        </span>
                      </div>
                    );
                  }

                  return (
                    <Link key={href} href={withLocale(href)} onClick={closeMobileMenu} className="block hover:text-white/85 hover:text-white transition-colors text-lg font-medium">
                      {t(titleKey)}
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="mt-auto pb-8 flex flex-col gap-6 border-t border-white/10 pt-6 shrink-0">
              <motion.div
                whileHover={shouldReduceMotion ? undefined : { scale: 1.02 }}
                whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
                transition={{ duration: 0.2 }}
                className="w-full"
              >
                <Link
                  href={withLocale('/safety-kit')}
                  onClick={closeMobileMenu}
                  className="block w-full text-center py-3 text-base font-bold bg-brand text-black rounded-full hover:bg-brand-dark transition-colors shadow-sm"
                >
                  {t('nav.get_safety_kit')}
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
