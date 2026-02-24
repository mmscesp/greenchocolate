import React from 'react';
import { cn } from '@/lib/utils';

interface TextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  size?: 'sm' | 'base' | 'lg' | 'xl';
  variant?: 'default' | 'muted' | 'lead';
  serif?: boolean;
}

const sizes = {
  sm: 'text-sm',
  base: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
};

const variants = {
  default: 'text-foreground',
  muted: 'text-muted-foreground',
  lead: 'text-lg text-muted-foreground',
};

export const Text = React.forwardRef<HTMLParagraphElement, TextProps>(
  ({ size = 'base', variant = 'default', serif = false, className, children, ...props }, ref) => {
    return (
      <p
        ref={ref}
        className={cn(
          serif ? 'font-serif' : 'font-sans',
          'leading-relaxed',
          sizes[size],
          variants[variant],
          className
        )}
        {...props}
      >
        {children}
      </p>
    );
  }
);

Text.displayName = 'Text';

/**
 * Lead paragraph - larger, muted text for introductions
 */
export const Lead = React.forwardRef<HTMLParagraphElement, Omit<TextProps, 'size' | 'variant'>>(
  (props, ref) => <Text size="lg" variant="lead" {...props} ref={ref} />
);
Lead.displayName = 'Lead';
