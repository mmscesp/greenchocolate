'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/hooks/useLanguage';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { MapPin } from '@/lib/icons';

interface DesktopExploreItem {
  href?: string;
  titleKey: string;
  descriptionKey: string;
  comingSoon?: boolean;
  Icon: React.ComponentType<{ className?: string }>;
}

interface DesktopPrimaryItem {
  href: string;
  labelKey: string;
  Icon?: React.ComponentType<{ className?: string }>;
}

export const desktopExploreItems: DesktopExploreItem[] = [
  {
    href: '/spain/barcelona',
    titleKey: 'nav.explore.barcelona.title',
    descriptionKey: 'nav.explore.barcelona.description',
    Icon: MapPin,
  },
  {
    titleKey: 'nav.explore.madrid.title',
    descriptionKey: 'nav.explore.madrid.description',
    comingSoon: true,
    Icon: MapPin,
  },
  {
    href: '/spain/valencia',
    titleKey: 'nav.explore.valencia.title',
    descriptionKey: 'nav.explore.valencia.description',
    comingSoon: true,
    Icon: MapPin,
  },
  {
    href: '/spain/tenerife',
    titleKey: 'nav.explore.tenerife.title',
    descriptionKey: 'nav.explore.tenerife.description',
    comingSoon: true,
    Icon: MapPin,
  },
];

export const desktopPrimaryItems: DesktopPrimaryItem[] = [
  {
    href: '/editorial',
    labelKey: 'nav.guides',
  },
  {
    href: '/clubs',
    labelKey: 'nav.clubs_directory',
  },
];

export const desktopTrailingItems: DesktopPrimaryItem[] = [
  {
    href: '/events',
    labelKey: 'nav.events',
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
    return pathname === localized || pathname.startsWith(`${localized}/`);
  };
  const triggerClassName = tone === 'light'
    ? 'bg-transparent hover:bg-white/5 data-[state=open]:bg-white/5 text-white hover:text-white transition-colors'
    : 'bg-transparent hover:bg-black/5 data-[state=open]:bg-black/5 text-slate-800 hover:text-slate-900 transition-colors';

  return (
    <NavigationMenu viewportClassName="bg-transparent border-none shadow-none">
      <NavigationMenuList>
        {desktopPrimaryItems.map(({ href, labelKey, Icon }) => (
          <NavigationMenuItem key={href}>
            <Link href={withLocale(href)} className={cn(navigationMenuTriggerStyle(), triggerClassName, 'relative')}> 
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
              {Icon ? (
                <span className="inline-flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  {t(labelKey)}
                </span>
              ) : (
                t(labelKey)
              )}
            </Link>
          </NavigationMenuItem>
        ))}

        <NavigationMenuItem>
          <NavigationMenuTrigger className={triggerClassName}>
            {t('nav.cities')}
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="mt-2 grid w-[min(92vw,20rem)] gap-3 p-4 sm:w-[24rem] md:w-[min(26rem,calc(100vw-2rem))] lg:w-[31rem] glass-dropdown animate-in fade-in zoom-in-95 duration-200">
              {desktopExploreItems.map(({ href, titleKey, descriptionKey, comingSoon, Icon }) => {
                const itemTitle = t(titleKey);

                if (comingSoon || !href) {
                  return (
                    <li key={titleKey}>
                      <div
                        className={cn(
                          'block select-none space-y-1 rounded-lg p-3 leading-none opacity-80',
                          'cursor-not-allowed bg-white/5'
                        )}
                        aria-disabled="true"
                      >
                        <div className="flex items-center justify-between gap-2 text-sm font-semibold leading-none text-white">
                          <span className="inline-flex items-center gap-2">
                            <Icon className="h-4 w-4" />
                            {itemTitle}
                          </span>
                          <span className="rounded-full border border-white/20 bg-white/10 px-2 py-0.5 text-[10px] uppercase tracking-wide text-white/80">
                            {t('nav.coming_soon')}
                          </span>
                        </div>
                        <p className="line-clamp-2 text-sm leading-snug text-white/70 pl-6">
                          {t(descriptionKey)}
                        </p>
                      </div>
                    </li>
                  );
                }

                return (
                  <ListItem key={href} href={withLocale(href)} title={itemTitle} icon={<Icon className="h-4 w-4" />}>
                    {t(descriptionKey)}
                  </ListItem>
                );
              })}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {desktopTrailingItems.map(({ href, labelKey, Icon }) => (
          <NavigationMenuItem key={href}>
            <Link href={withLocale(href)} className={cn(navigationMenuTriggerStyle(), triggerClassName, 'relative')}>
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
              {Icon ? (
                <span className="inline-flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  {t(labelKey)}
                </span>
              ) : (
                t(labelKey)
              )}
            </Link>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<'a'>,
  React.ComponentPropsWithoutRef<'a'> & { icon?: React.ReactNode }
>(({ className, title, children, icon, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            'block select-none space-y-1 rounded-lg p-3 leading-none no-underline outline-none transition-all hover:bg-white/5 hover:text-white focus:bg-white/5 focus:text-white group',
            className
          )}
          {...props}
        >
          <div className="flex items-center gap-2 text-sm font-semibold leading-none text-white group-hover:text-white">
            {icon}
            {title}
          </div>
          <p className="line-clamp-2 text-sm leading-snug text-white/70 pl-6 group-hover:text-white">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = 'ListItem';
