import React from 'react';
import { cn } from '@/lib/utils';

interface ConciergeLabelProps extends React.HTMLAttributes<HTMLSpanElement> {
  size?: 'xs' | 'sm' | 'md';
  emphasis?: 'low' | 'medium' | 'high';
  mono?: boolean;
}

const sizes = {
  xs: 'text-[10px] tracking-[0.2em]',
  sm: 'text-xs tracking-[0.15em]',
  md: 'text-sm tracking-[0.1em]'
};

const emphases = {
  low: 'text-zinc-500',
  medium: 'text-zinc-400',
  high: 'text-white/80'
};

export const ConciergeLabel = React.forwardRef<HTMLSpanElement, ConciergeLabelProps>(
  ({ size = 'sm', emphasis = 'medium', mono = true, className, children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          'uppercase font-bold',
          mono ? 'font-mono' : 'font-sans',
          sizes[size],
          emphases[emphasis],
          className
        )}
        {...props}
      >
        {children}
      </span>
    );
  }
);

ConciergeLabel.displayName = 'ConciergeLabel';
