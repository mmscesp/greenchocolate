'use client';

import { useState, useEffect, useRef } from 'react';
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
  const { t, language } = useLanguage();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const previousBodyOverflowRef = useRef<string | null>(null);
  const pillOffsetY = 16;
  const closeMobileMenu = () => setMobileMenuOpen(false);
  const withLocale = (path: string) => `/${language}${path}`;
  const localizedHomePath = `/${language}`;
  const isHomepage = pathname === localizedHomePath || pathname === `${localizedHomePath}/`;
  const isHomepageOverlay = isHomepage && !isScrolled;
  const useLightNavForeground = isHomepageOverlay || isScrolled;

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
            : isHomepage
              ? 'w-full px-4 md:px-8 py-3 md:py-4 bg-transparent border-transparent'
              : 'w-full px-4 md:px-8 py-3 md:py-4 bg-white/60 supports-[backdrop-filter]:bg-white/45 backdrop-blur-2xl border-b border-black/10 shadow-[0_10px_30px_-22px_rgba(15,23,42,0.45)]'
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
              <span className={cn('text-xl font-bold tracking-tight transition-all duration-300', useLightNavForeground ? 'text-white' : 'text-slate-900')}>
                SocialClubsMaps
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className={cn(
            'hidden md:flex items-center rounded-full px-2 py-1 mx-4 transition-all duration-300',
            useLightNavForeground ? 'text-white' : 'text-slate-900',
            isScrolled ? 'bg-white/5' : isHomepage ? 'bg-transparent' : 'bg-bg-surface/40 border border-black/10'
          )}>
            <MainNavigation tone={useLightNavForeground ? 'light' : 'dark'} />
          </div>

          {/* Desktop Actions Section */}
          <div className={cn('hidden md:flex items-center gap-3')}>
            <Link href={withLocale('/safety-kit')}>
              <button className="px-5 py-2 text-sm font-bold bg-brand text-black rounded-full hover:bg-brand-dark transition-colors shadow-sm">
                Get the Safety Kit
              </button>
            </Link>
          </div>

          {/* Mobile Actions Section */}
          <div className="flex md:hidden items-center gap-1">
            <button
              onClick={() => setMobileMenuOpen((isOpen) => !isOpen)}
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-site-menu"
              className={cn(
                'relative flex h-10 w-10 items-center justify-center rounded-full transition-colors',
                useLightNavForeground ? 'hover:bg-white/10 text-white' : 'hover:bg-bg-surface/40 text-slate-900'
              )}
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
            id="mobile-site-menu"
            className="fixed inset-x-0 top-0 h-[100dvh] z-40 md:hidden glass-liquid pt-20 px-6 pb-[env(safe-area-inset-bottom,24px)] flex flex-col gap-4 overflow-y-auto overscroll-contain"
          >
            {/* Rich Profile Header inside Mobile Menu */}
            <div className="pb-4 border-b border-white/10 shrink-0">
              <UserProfileDropdown variant="mobile-menu-row" onMobileClose={closeMobileMenu} />
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
              <Link href={withLocale('/safety-kit')} onClick={closeMobileMenu} className="w-full">
                <button className="w-full py-3 text-base font-bold bg-brand text-black rounded-full hover:bg-brand-dark transition-colors shadow-sm">
                  Get the Safety Kit
                </button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
