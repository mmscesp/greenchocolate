'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/hooks/useLanguage';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';

interface DesktopPrimaryItem {
  href: string;
  labelKey: string;
}

export const desktopPrimaryItems: DesktopPrimaryItem[] = [
  {
    href: '/spain/barcelona',
    labelKey: 'nav.barcelona',
  },
  {
    href: '/spain/barcelona/clubs',
    labelKey: 'nav.clubs_directory',
  },
  {
    href: '/editorial',
    labelKey: 'nav.guides',
  },
  {
    href: '/verification',
    labelKey: 'nav.verification',
  },
];

interface MainNavigationProps {
  tone?: 'light' | 'dark';
}

export default function MainNavigation({ tone = 'light' }: MainNavigationProps) {
  const { t, language } = useLanguage();
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();
  const withLocale = (path: string) => `/${language}${path}`;
  const isActiveRoute = (path: string) => {
    const localized = withLocale(path);
    if (path === '/spain/barcelona') {
      return pathname === localized;
    }
    return pathname === localized || pathname.startsWith(`${localized}/`);
  };
  const triggerClassName = tone === 'light'
    ? 'bg-transparent hover:bg-white/5 data-[state=open]:bg-white/5 text-white hover:text-white transition-colors'
    : 'bg-transparent hover:bg-black/5 data-[state=open]:bg-black/5 text-slate-800 hover:text-slate-900 transition-colors';

  return (
    <NavigationMenu className="w-full min-w-0">
      <NavigationMenuList className="w-full min-w-0 justify-center gap-0.5 xl:gap-1">
        {desktopPrimaryItems.map(({ href, labelKey }) => (
          <NavigationMenuItem key={href}>
            <Link
              href={withLocale(href)}
              className={cn(
                navigationMenuTriggerStyle(),
                triggerClassName,
                'relative h-9 min-w-0 max-w-[9.5rem] px-2.5 text-[0.9rem] leading-none xl:max-w-[10.5rem] xl:px-3'
              )}
            >
              {/* [motion] */}
              {isActiveRoute(href) ? (
                <motion.span
                  layoutId="main-nav-active"
                  className={cn(
                    'absolute inset-x-2 -bottom-0.5 h-0.5 rounded-full',
                    tone === 'light' ? 'bg-white/90' : 'bg-slate-900/80'
                  )}
                  transition={
                    shouldReduceMotion
                      ? { duration: 0.15 }
                      : { duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }
                  }
                />
              ) : null}
              <span className="block truncate">{t(labelKey)}</span>
            </Link>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
