'use client';

import { useState, type ElementType } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Sidebar, useSidebar } from '@/components/ui/sidebar';
import { ChevronLeft, ChevronRight } from '@/lib/icons';
import { cn } from '@/lib/utils';

export type NavigationRailVariant = 'profile' | 'admin';

export interface NavigationRailIdentity {
  displayName: string;
  email: string;
  avatarUrl?: string | null;
  badgeText?: string;
}

export interface NavigationRailItem {
  id: string;
  label: string;
  href: string;
  icon: ElementType;
  isActive?: (pathname: string) => boolean;
}

interface NavigationRailActionBase {
  id: string;
  label: string;
  icon: ElementType;
  tone?: 'default' | 'danger';
  onSelect?: () => void;
}

export interface NavigationRailLinkAction extends NavigationRailActionBase {
  kind: 'link';
  href: string;
}

export interface NavigationRailButtonAction extends NavigationRailActionBase {
  kind: 'button';
  onClick: () => void | Promise<void>;
}

export interface NavigationRailFormAction extends NavigationRailActionBase {
  kind: 'form';
  action: (payload: FormData) => void | Promise<void>;
}

export type NavigationRailAction =
  | NavigationRailLinkAction
  | NavigationRailButtonAction
  | NavigationRailFormAction;

interface SharedNavigationRailProps {
  railId: string;
  variant: NavigationRailVariant;
  title: string;
  subtitle?: string;
  identity: NavigationRailIdentity;
  items: NavigationRailItem[];
  footerActions: NavigationRailAction[];
}

interface NavigationRailPanelProps extends SharedNavigationRailProps {
  className?: string;
  forceExpanded?: boolean;
  onTogglePinned?: () => void;
  isPinned?: boolean;
  onItemSelect?: () => void;
}

interface DesktopNavigationRailProps extends SharedNavigationRailProps {
  className?: string;
  stickyClassName?: string;
  expandedWidth?: number;
  collapsedWidth?: number;
}

const railStyles = {
  profile: {
    container:
      'border border-white/8 bg-[linear-gradient(180deg,rgba(10,14,24,0.98)_0%,rgba(13,18,32,0.98)_100%)] text-white shadow-[0_24px_80px_rgba(0,0,0,0.28)]',
    glow:
      'absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-brand/10 via-brand/4 to-transparent',
    orbLeft:
      'absolute left-[-20%] top-[24%] h-52 w-52 rounded-full bg-brand/8 blur-3xl',
    orbRight:
      'absolute bottom-[-12%] right-[-10%] h-40 w-40 rounded-full bg-gold/8 blur-3xl',
    title: 'text-brand',
    subtitle: 'text-zinc-400',
    control:
      'border-white/10 bg-white/5 text-zinc-300 hover:bg-white hover:text-black',
    card: 'border-white/8 bg-white/[0.035]',
    avatarFallback: 'bg-brand/18 text-brand',
    badge: 'text-brand/90',
    navList: 'space-y-2',
    navItem:
      'min-h-12 rounded-[20px] py-2 px-3',
    navActive:
      'border-brand/30 bg-brand/10 text-white shadow-[0_12px_30px_rgba(0,0,0,0.18)]',
    navInactive:
      'border-white/5 bg-white/[0.02] text-zinc-300 hover:border-white/10 hover:bg-white/[0.05] hover:text-white',
    navIcon: 'h-9 w-9 rounded-xl',
    navIconActive: 'border-brand/20 bg-brand/16 text-brand',
    navIconInactive:
      'border-white/8 bg-black/20 text-zinc-400 group-hover:border-white/12 group-hover:text-white',
    indicator: 'bg-brand',
    footerBorder: 'border-white/8',
    footerDefault:
      'border-white/8 bg-white/[0.03] text-zinc-300 hover:bg-white hover:text-black',
    footerDanger:
      'border-red-500/15 bg-red-500/[0.06] text-red-300 hover:bg-red-500 hover:text-white',
  },
  admin: {
    container:
      'border border-slate-700/70 bg-[linear-gradient(180deg,rgba(9,14,22,0.98)_0%,rgba(14,20,30,0.98)_100%)] text-slate-100 shadow-[0_24px_80px_rgba(0,0,0,0.3)]',
    glow:
      'absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-emerald-500/10 via-slate-500/6 to-transparent',
    orbLeft:
      'absolute left-[-18%] top-[20%] h-44 w-44 rounded-full bg-emerald-500/10 blur-3xl',
    orbRight:
      'absolute bottom-[-10%] right-[-10%] h-36 w-36 rounded-full bg-slate-400/10 blur-3xl',
    title: 'text-emerald-400',
    subtitle: 'text-slate-400',
    control:
      'border-slate-700 bg-slate-800/80 text-slate-300 hover:bg-slate-100 hover:text-slate-900',
    card: 'border-slate-700/80 bg-slate-800/55',
    avatarFallback: 'bg-emerald-500/15 text-emerald-300',
    badge: 'text-emerald-300/90',
    navList: 'space-y-1.5',
    navItem:
      'min-h-[42px] rounded-[18px] py-1.5 px-2.5',
    navActive:
      'border-emerald-400/30 bg-emerald-400/10 text-slate-50 shadow-[0_10px_28px_rgba(0,0,0,0.18)]',
    navInactive:
      'border-slate-700/70 bg-slate-900/40 text-slate-300 hover:border-slate-600 hover:bg-slate-800/70 hover:text-white',
    navIcon: 'h-8 w-8 rounded-xl',
    navIconActive: 'border-emerald-400/20 bg-emerald-400/14 text-emerald-300',
    navIconInactive:
      'border-slate-700/80 bg-slate-950/50 text-slate-400 group-hover:border-slate-600 group-hover:text-white',
    indicator: 'bg-emerald-400',
    footerBorder: 'border-slate-700/80',
    footerDefault:
      'border-slate-700/80 bg-slate-900/40 text-slate-300 hover:bg-slate-100 hover:text-slate-900',
    footerDanger:
      'border-red-500/20 bg-red-500/[0.08] text-red-300 hover:bg-red-500 hover:text-white',
  },
} as const;

const noopSidebarSetter: React.Dispatch<React.SetStateAction<boolean>> = () => undefined;

function NavigationRailPanel({
  railId,
  variant,
  title,
  subtitle,
  identity,
  items,
  footerActions,
  className,
  forceExpanded = false,
  onTogglePinned,
  isPinned = false,
  onItemSelect,
}: NavigationRailPanelProps) {
  const pathname = usePathname();
  const { open } = useSidebar();
  const expanded = forceExpanded || open;
  const styles = railStyles[variant];

  return (
    <div
      className={cn(
        'relative flex h-full flex-col overflow-hidden rounded-[30px]',
        styles.container,
        className
      )}
    >
      <div className="pointer-events-none absolute inset-0">
        <div className={styles.glow} />
        <div className={styles.orbLeft} />
        <div className={styles.orbRight} />
      </div>

      <div className="relative z-10 flex h-full flex-col p-3">
        <div className={cn('flex items-center', expanded ? 'justify-between' : 'justify-center')}>
          <AnimatePresence initial={false}>
            {expanded ? (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="min-w-0"
              >
                <p className={cn('text-[0.65rem] font-black uppercase tracking-[0.3em]', styles.title)}>
                  {title}
                </p>
                {subtitle ? <p className={cn('mt-1 text-xs', styles.subtitle)}>{subtitle}</p> : null}
              </motion.div>
            ) : null}
          </AnimatePresence>

          {onTogglePinned ? (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label={title}
              onClick={onTogglePinned}
              className={cn('h-10 w-10 rounded-full border', styles.control)}
            >
              {isPinned ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </Button>
          ) : null}
        </div>

        <div className="mt-3">
          <div
            className={cn(
              'rounded-[24px] border px-3 py-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]',
              styles.card,
              expanded ? 'px-3.5 py-3' : 'px-2.5 py-2.5'
            )}
          >
            <div className={cn('flex items-center gap-3', expanded ? '' : 'justify-center')}>
              <Avatar className={cn('border border-white/10', expanded ? 'h-11 w-11' : 'h-10 w-10')}>
                <AvatarImage src={identity.avatarUrl || ''} />
                <AvatarFallback className={cn('font-bold uppercase', styles.avatarFallback)}>
                  {identity.displayName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <AnimatePresence initial={false}>
                {expanded ? (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="min-w-0 flex-1"
                  >
                    <p className="truncate text-sm font-semibold">{identity.displayName}</p>
                    <p className={cn('truncate text-xs', styles.subtitle)}>{identity.email}</p>
                    {identity.badgeText ? (
                      <p className={cn('mt-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.2em]', styles.badge)}>
                        {identity.badgeText}
                      </p>
                    ) : null}
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          </div>
        </div>

        <div className="mt-3 flex min-h-0 flex-1 flex-col justify-start">
          <nav className={styles.navList}>
            {items.map((item) => {
              const isActive = item.isActive
                ? item.isActive(pathname)
                : pathname === item.href || pathname.startsWith(`${item.href}/`);
              const Icon = item.icon;

              return (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={onItemSelect}
                  title={!expanded ? item.label : undefined}
                  className={cn(
                    'group relative flex items-center border transition-all duration-300',
                    expanded ? `gap-3 ${styles.navItem}` : 'justify-center rounded-[18px] px-0 py-1.5',
                    isActive ? styles.navActive : styles.navInactive
                  )}
                >
                  <div
                    className={cn(
                      'flex shrink-0 items-center justify-center border transition-all duration-300',
                      styles.navIcon,
                      isActive ? styles.navIconActive : styles.navIconInactive
                    )}
                  >
                    <Icon className="h-5 w-5" weight={isActive ? 'fill' : 'regular'} />
                  </div>

                  <AnimatePresence initial={false}>
                    {expanded ? (
                      <motion.span
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -8 }}
                        className="truncate text-sm font-semibold"
                      >
                        {item.label}
                      </motion.span>
                    ) : null}
                  </AnimatePresence>

                  {isActive ? (
                    <motion.div
                      layoutId={`rail-active-${railId}`}
                      className={cn('absolute inset-y-3 left-0 w-1 rounded-full', styles.indicator)}
                    />
                  ) : null}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className={cn('mt-auto pt-3', styles.footerBorder, 'border-t')}>
          <div className="space-y-2">
            {footerActions.map((action) => {
              const Icon = action.icon;
              const buttonClassName = cn(
                'h-10 w-full rounded-[18px] border',
                action.tone === 'danger' ? styles.footerDanger : styles.footerDefault,
                expanded ? 'justify-start gap-3 px-3' : 'justify-center px-0'
              );

              if (action.kind === 'link') {
                return (
                  <Link key={action.id} href={action.href} onClick={action.onSelect ?? onItemSelect} className="block">
                    <Button variant="ghost" className={buttonClassName}>
                      <Icon className="h-4 w-4 shrink-0" />
                      <AnimatePresence initial={false}>
                        {expanded ? (
                          <motion.span
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -8 }}
                            className="text-sm font-medium"
                          >
                            {action.label}
                          </motion.span>
                        ) : null}
                      </AnimatePresence>
                    </Button>
                  </Link>
                );
              }

              if (action.kind === 'form') {
                return (
                  <form
                    key={action.id}
                    action={action.action}
                    onSubmit={() => {
                      (action.onSelect ?? onItemSelect)?.();
                    }}
                  >
                    <Button type="submit" variant="ghost" className={buttonClassName}>
                      <Icon className="h-4 w-4 shrink-0" />
                      <AnimatePresence initial={false}>
                        {expanded ? (
                          <motion.span
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -8 }}
                            className="text-sm font-medium"
                          >
                            {action.label}
                          </motion.span>
                        ) : null}
                      </AnimatePresence>
                    </Button>
                  </form>
                );
              }

              return (
                <Button
                  key={action.id}
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    action.onClick();
                    (action.onSelect ?? onItemSelect)?.();
                  }}
                  className={buttonClassName}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <AnimatePresence initial={false}>
                    {expanded ? (
                      <motion.span
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -8 }}
                        className="text-sm font-medium"
                      >
                        {action.label}
                      </motion.span>
                    ) : null}
                  </AnimatePresence>
                </Button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export function DesktopNavigationRail({
  railId,
  variant,
  title,
  subtitle,
  identity,
  items,
  footerActions,
  className,
  stickyClassName = 'top-24 h-[calc(100dvh-6rem)]',
  expandedWidth = 292,
  collapsedWidth = 88,
}: DesktopNavigationRailProps) {
  const [open, setOpen] = useState(false);
  const [isPinned, setIsPinned] = useState(false);

  const handleTogglePinned = () => {
    setIsPinned((current) => {
      const next = !current;
      setOpen(next);
      return next;
    });
  };

  return (
    <Sidebar open={open} setOpen={setOpen}>
      <motion.aside
        animate={{ width: open ? expandedWidth : collapsedWidth }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        onMouseEnter={() => {
          if (!isPinned) {
            setOpen(true);
          }
        }}
        onMouseLeave={() => {
          if (!isPinned) {
            setOpen(false);
          }
        }}
        className={cn(
          'sticky z-30 hidden shrink-0 self-start lg:block',
          stickyClassName,
          className
        )}
      >
        <NavigationRailPanel
          railId={railId}
          variant={variant}
          title={title}
          subtitle={subtitle}
          identity={identity}
          items={items}
          footerActions={footerActions}
          onTogglePinned={handleTogglePinned}
          isPinned={isPinned}
        />
      </motion.aside>
    </Sidebar>
  );
}

export function MobileNavigationRailPanel({
  railId,
  variant,
  title,
  subtitle,
  identity,
  items,
  footerActions,
  className,
  onItemSelect,
}: NavigationRailPanelProps) {
  return (
    <Sidebar open={true} setOpen={noopSidebarSetter} animate={false}>
      <NavigationRailPanel
        railId={railId}
        variant={variant}
        title={title}
        subtitle={subtitle}
        identity={identity}
        items={items}
        footerActions={footerActions}
        className={className}
        forceExpanded={true}
        onItemSelect={onItemSelect}
      />
    </Sidebar>
  );
}
