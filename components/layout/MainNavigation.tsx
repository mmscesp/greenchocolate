'use client';

import * as React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
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
  title: string;
  description: string;
  Icon: React.ComponentType<{ className?: string }>;
}

interface DesktopPrimaryItem {
  href: string;
  label: string;
  Icon?: React.ComponentType<{ className?: string }>;
}

export const desktopExploreItems: DesktopExploreItem[] = [
  {
    href: '/spain/barcelona',
    title: 'Barcelona Guide',
    description: "The complete hub for Barcelona's cannabis culture and clubs.",
    Icon: MapPin,
  },
  {
    href: '/spain/madrid',
    title: 'Madrid Guide',
    description: "Navigate Madrid's discreet but thriving scene.",
    Icon: MapPin,
  },
  {
    href: '/events',
    title: 'Events',
    description: 'Cultural and industry events across Europe.',
    Icon: Calendar,
  },
  {
    href: '/safety',
    title: 'Safety Protocol',
    description: 'Essential safety guidelines and best practices.',
    Icon: Shield,
  },
];

export const desktopPrimaryItems: DesktopPrimaryItem[] = [
  {
    href: '/editorial',
    label: 'Guides',
    Icon: BookOpen,
  },
  {
    href: '/clubs',
    label: 'Clubs Directory',
  },
];

export default function MainNavigation() {
  return (
    <NavigationMenu viewportClassName="bg-transparent border-none shadow-none">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-transparent hover:bg-white/5 data-[state=open]:bg-white/5 text-white/70 hover:text-white transition-colors">
            Explore
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-4 w-[min(92vw,20rem)] sm:w-[24rem] md:w-[26rem] lg:w-[31rem] glass-dropdown mt-2 animate-in fade-in zoom-in-95 duration-200">
              {desktopExploreItems.map(({ href, title, description, Icon }) => (
                <ListItem key={href} href={href} title={title} icon={<Icon className="h-4 w-4" />}>
                  {description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {desktopPrimaryItems.map(({ href, label, Icon }) => (
          <NavigationMenuItem key={href}>
            <Link href={href} className={cn(navigationMenuTriggerStyle(), 'bg-transparent hover:bg-white/5 text-white/70 hover:text-white transition-colors')}>
              {Icon ? (
                <span className="inline-flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  {label}
                </span>
              ) : (
                label
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
          <div className="flex items-center gap-2 text-sm font-semibold leading-none text-white/90 group-hover:text-white">
            {icon}
            {title}
          </div>
          <p className="line-clamp-2 text-sm leading-snug text-white/50 pl-6 group-hover:text-white/70">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = 'ListItem';
