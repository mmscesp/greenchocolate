import React from 'react';
import { cn } from '@/lib/utils';

interface LabelProps extends React.HTMLAttributes<HTMLSpanElement> {
  size?: 'xs' | 'sm' | 'md' | 'lg';
  variant?: 'default' | 'muted' | 'accent' | 'brand' | 'gold';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  tracking?: 'normal' | 'wide' | 'wider' | 'widest';
  mono?: boolean;
}

const sizes = {
  xs: 'text-[10px]',
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
};

const trackings = {
  normal: 'tracking-normal',
  wide: 'tracking-wide',
  wider: 'tracking-wider',
  widest: 'tracking-[0.2em]',
};

const variants = {
  default: 'text-foreground',
  muted: 'text-muted-foreground',
  accent: 'text-accent-foreground',
  brand: 'text-brand',
  gold: 'text-gold',
};

export const Label = React.forwardRef<HTMLSpanElement, LabelProps>(
  ({ 
    size = 'sm', 
    variant = 'default', 
    weight = 'medium',
    tracking = 'normal',
    mono = false,
    className, 
    children, 
    ...props 
  }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          'uppercase',
          mono ? 'font-mono' : 'font-sans',
          sizes[size],
          trackings[tracking],
          variants[variant],
          {
            'font-normal': weight === 'normal',
            'font-medium': weight === 'medium',
            'font-semibold': weight === 'semibold',
            'font-bold': weight === 'bold',
          },
          className
        )}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Label.displayName = 'Label';

/**
 * Eyebrow style label - small, uppercase, wide tracking
 */
export const Eyebrow = React.forwardRef<HTMLSpanElement, Omit<LabelProps, 'size' | 'tracking'>>(
  (props, ref) => <Label size="xs" tracking="widest" weight="semibold" {...props} ref={ref} />
);
Eyebrow.displayName = 'Eyebrow';
