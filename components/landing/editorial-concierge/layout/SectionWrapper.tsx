import React from 'react';
import { cn } from '@/lib/utils';

interface SectionWrapperProps extends React.HTMLAttributes<HTMLElement> {
  container?: boolean;
  dark?: boolean;
  glass?: boolean;
}

export const SectionWrapper = React.forwardRef<HTMLElement, SectionWrapperProps>(
  ({ container = true, dark = false, glass = false, className, children, ...props }, ref) => {
    return (
      <section
        ref={ref}
        className={cn(
          'py-24 relative overflow-hidden transition-colors duration-500',
          glass
            ? 'bg-card/60 dark:bg-black/24 backdrop-blur-md border border-emerald-500/15 dark:border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.08)]'
            : dark
              ? 'bg-background/80 backdrop-blur-sm text-white'
              : 'bg-background/80 backdrop-blur-sm text-zinc-900',
          className
        )}
        {...props}
      >
        {container ? (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {children}
          </div>
        ) : (
          children
        )}
      </section>
    );
  }
);

SectionWrapper.displayName = 'SectionWrapper';
