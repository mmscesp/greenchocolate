'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/hooks/useLanguage';
import { useAuth } from '@/components/auth/AuthProvider';
import { cn } from '@/lib/utils';
import { LayoutDashboard, 
Users, 
Calendar, 
Settings, 
LogOut, 
Menu, 
ChevronRight,
ChevronLeft,
Store,
BarChart3,
FileText,
Home } from '@/lib/icons';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Logo, LogoIcon } from '@/components/ui/logo';

interface ClubSidebarProps {
  className?: string;
  isCollapsed?: boolean;
  onClose?: () => void;
  isMobile?: boolean;
  onToggle?: () => void;
}

function ClubSidebarContent({ className, isCollapsed = false, onClose, isMobile = false }: ClubSidebarProps) {
  const { t } = useLanguage();
  const { user, signOut } = useAuth();
  const pathname = usePathname();

  // Get club display info from metadata
  const clubName = user?.user_metadata?.club_name || 'Club Admin';
  // In a real app, we'd fetch the club logo from a profile or club table
  const clubLogoUrl = user?.user_metadata?.avatar_url; 
  
  const navigation = [
    { name: 'Overview', href: '/club-panel/dashboard', icon: LayoutDashboard },
    { name: 'Club Profile', href: '/club-panel/dashboard/profile', icon: Store },
    { name: 'Membership Requests', href: '/club-panel/dashboard/requests', icon: Users },
    { name: 'Events', href: '/club-panel/dashboard/events', icon: Calendar },
    { name: 'Analytics', href: '/club-panel/dashboard/analytics', icon: BarChart3 },
    { name: 'Settings', href: '/club-panel/dashboard/settings', icon: Settings },
  ];

  const showText = !isCollapsed || isMobile;

  return (
    <div className={cn("flex flex-col h-full bg-card text-card-foreground", className)}>
      {/* Header - Only on mobile (because drawer covers the site navbar) */}
      {isMobile && (
        <div className="flex items-center gap-2 h-16 border-b bg-background/50 backdrop-blur-md sticky top-0 z-10 px-6">
          <div className="bg-primary/10 p-1.5 rounded-lg shrink-0">
            <LogoIcon size="sm" />
          </div>
          <span className="text-lg font-bold tracking-tight">Club Panel</span>
        </div>
      )}

      {/* Club Info */}
      <div className={cn(
        "border-b bg-gradient-to-br from-primary/5 to-muted/20 transition-all duration-300",
        isCollapsed && !isMobile ? "p-4" : "p-6"
      )}>
        <div className={cn(
          "flex items-center gap-3 transition-all duration-300",
          isCollapsed && !isMobile ? "flex-col justify-center text-center gap-1" : ""
        )}>
          <Avatar className={cn(
            "border-2 border-primary/20 shadow-sm transition-all duration-300",
            isCollapsed && !isMobile ? "h-10 w-10" : "h-12 w-12"
          )}>
            <AvatarImage src={clubLogoUrl || ''} /> 
            <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
              {clubName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          <AnimatePresence>
            {showText && (
              <motion.div 
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="overflow-hidden"
              >
                <h3 className="font-bold truncate leading-none mb-1">{clubName}</h3>
                <p className="text-xs text-muted-foreground truncate">Club Administration</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-6 px-3 custom-scrollbar">
        <nav className="space-y-1.5">
          {navigation.map((item) => {
            // Check if active (handle nested routes correctly)
            const isActive = pathname === item.href || (item.href !== '/club-panel/dashboard' && pathname.startsWith(item.href));
            
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                title={isCollapsed && !isMobile ? item.name : undefined}
                className={cn(
                  "group relative flex min-h-11 items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                  isCollapsed && !isMobile ? "justify-center px-2" : ""
                )}
              >
                <item.icon className={cn(
                  "h-5 w-5 transition-transform duration-200 shrink-0",
                  isActive ? "scale-110" : "group-hover:scale-110"
                )} />
                
                <AnimatePresence>
                  {showText && (
                    <motion.span 
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      className="flex-1 overflow-hidden"
                    >
                      {item.name}
                    </motion.span>
                  )}
                </AnimatePresence>

                {isActive && showText && (
                  <motion.div
                    layoutId="active-club-nav-indicator"
                    className="absolute right-2 h-1.5 w-1.5 rounded-full bg-primary-foreground"
                  />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer */}
      <div className={cn(
        "border-t space-y-2 bg-muted/10 transition-all duration-300",
        isCollapsed && !isMobile ? "p-2" : "p-4"
      )}>
        <Link href="/" onClick={onClose} className="block">
          <Button 
            variant="ghost" 
            className={cn(
              "w-full min-h-11 justify-start gap-3 rounded-xl hover:bg-accent",
              isCollapsed && !isMobile ? "justify-center px-0" : ""
            )} 
            size="sm"
            title={t('nav.back_to_site')}
          >
            <Home className="h-4 w-4 shrink-0" />
            {showText && <span>{t('nav.back_to_site')}</span>}
          </Button>
        </Link>
        <Button 
          variant="ghost" 
          onClick={() => signOut()}
          className={cn(
            "w-full min-h-11 justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10 rounded-xl",
            isCollapsed && !isMobile ? "justify-center px-0" : ""
          )} 
          size="sm"
          title={t('nav.logout')}
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {showText && <span>{t('nav.logout')}</span>}
        </Button>
      </div>
    </div>
  );
}

export function ClubSidebar({ 
  className,
  isCollapsed = false,
  onToggle
}: { 
  className?: string;
  isCollapsed?: boolean;
  onToggle?: () => void;
}) {
  return (
    <aside className={cn(
      "hidden lg:flex flex-col sticky top-16 h-[calc(100vh-64px)] z-30 transition-all duration-300 ease-in-out border-r shadow-sm bg-card",
      isCollapsed ? "w-20" : "w-64",
      className
    )}>
      <ClubSidebarContent isCollapsed={isCollapsed} />
      
      {/* Toggle Button */}
      {onToggle && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className="absolute -right-4 top-4 h-8 w-8 rounded-full border bg-background shadow-md hover:bg-accent z-40 text-muted-foreground hover:text-foreground"
        >
          {isCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
        </Button>
      )}
    </aside>
  );
}

export function ClubMobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden h-11 w-11 hover:bg-accent rounded-full transition-colors">
          <Menu className="h-6 w-6 text-muted-foreground" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-[85vw] max-w-80 border-r-0 shadow-2xl">
        <SheetHeader className="sr-only">
          <SheetTitle>Club Navigation</SheetTitle>
        </SheetHeader>
        <ClubSidebarContent onClose={() => setOpen(false)} isMobile={true} />
      </SheetContent>
    </Sheet>
  );
}
