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
import { BookOpen, Shield, Scale, MapPin, Calendar } from '@/lib/icons';

export default function MainNavigation() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-transparent hover:bg-accent/50 data-[state=open]:bg-accent/50 text-primary hover:text-primary">
            Explore
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-4 w-[min(92vw,20rem)] sm:w-[24rem] md:w-[26rem] lg:w-[31rem] glass-liquid rounded-md">
              <ListItem href="/spain/barcelona" title="Barcelona Guide" icon={<MapPin className="h-4 w-4" />}>
                The complete hub for Barcelona's cannabis culture and clubs.
              </ListItem>
              <ListItem href="/spain/madrid" title="Madrid Guide" icon={<MapPin className="h-4 w-4" />}>
                Navigate Madrid's discreet but thriving scene.
              </ListItem>
              <ListItem href="/events" title="Events" icon={<Calendar className="h-4 w-4" />}>
                Cultural and industry events across Europe.
              </ListItem>
              <ListItem href="/safety" title="Safety Protocol" icon={<Shield className="h-4 w-4" />}>
                Essential safety guidelines and best practices.
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <Link href="/editorial" className={cn(navigationMenuTriggerStyle(), "bg-transparent hover:bg-accent/50 text-primary hover:text-primary")}>
            <span className="inline-flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Guides
            </span>
          </Link>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <Link href="/clubs" className={cn(navigationMenuTriggerStyle(), "bg-transparent hover:bg-accent/50 text-primary hover:text-primary")}>
            Clubs Directory
          </Link>
        </NavigationMenuItem>
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
            'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
            className
          )}
          {...props}
        >
          <div className="flex items-center gap-2 text-sm font-medium leading-none">
            {icon}
            {title}
          </div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground pl-6">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = 'ListItem';
