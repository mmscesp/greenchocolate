import React from 'react';
import { cn } from '@/lib/utils';

interface SectionWrapperProps extends React.HTMLAttributes<HTMLElement> {
  container?: boolean;
  dark?: boolean;
}

export const SectionWrapper = React.forwardRef<HTMLElement, SectionWrapperProps>(
  ({ container = true, dark = false, className, children, ...props }, ref) => {
    return (
      <section
        ref={ref}
        className={cn(
          'py-24 relative overflow-hidden',
          dark ? 'bg-black text-white' : 'bg-[#FAFAFA] text-zinc-900',
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
