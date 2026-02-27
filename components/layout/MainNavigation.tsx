'use client';

import * as React from 'react';
import Link from 'next/link';
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
import { BookOpen, Shield, MapPin, Calendar } from '@/lib/icons';

interface DesktopExploreItem {
  href: string;
  titleKey: string;
  descriptionKey: string;
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
    href: '/spain/madrid',
    titleKey: 'nav.explore.madrid.title',
    descriptionKey: 'nav.explore.madrid.description',
    Icon: MapPin,
  },
  {
    href: '/events',
    titleKey: 'nav.explore.events.title',
    descriptionKey: 'nav.explore.events.description',
    Icon: Calendar,
  },
  {
    href: '/safety',
    titleKey: 'nav.explore.safety.title',
    descriptionKey: 'nav.explore.safety.description',
    Icon: Shield,
  },
];

export const desktopPrimaryItems: DesktopPrimaryItem[] = [
  {
    href: '/editorial',
    labelKey: 'nav.guides',
    Icon: BookOpen,
  },
  {
    href: '/clubs',
    labelKey: 'nav.clubs_directory',
  },
];

export default function MainNavigation() {
  const { t, language } = useLanguage();
  const withLocale = (path: string) => `/${language}${path}`;

  return (
    <NavigationMenu viewportClassName="bg-transparent border-none shadow-none">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-transparent hover:bg-white/5 data-[state=open]:bg-white/5 text-white hover:text-white transition-colors">
            {t('nav.explore_menu')}
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-4 w-[min(92vw,20rem)] sm:w-[24rem] md:w-[26rem] lg:w-[31rem] glass-dropdown mt-2 animate-in fade-in zoom-in-95 duration-200">
              {desktopExploreItems.map(({ href, titleKey, descriptionKey, Icon }) => (
                <ListItem key={href} href={withLocale(href)} title={t(titleKey)} icon={<Icon className="h-4 w-4" />}>
                  {t(descriptionKey)}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {desktopPrimaryItems.map(({ href, labelKey, Icon }) => (
          <NavigationMenuItem key={href}>
            <Link href={withLocale(href)} className={cn(navigationMenuTriggerStyle(), 'bg-transparent hover:bg-white/5 text-white hover:text-white transition-colors')}>
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
