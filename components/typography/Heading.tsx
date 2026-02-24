import React from 'react';
import { cn } from '@/lib/utils';

interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'hero';
  variant?: 'default' | 'gradient' | 'muted';
  serif?: boolean;
}

const sizes = {
  xs: 'text-lg md:text-xl',
  sm: 'text-xl md:text-2xl',
  md: 'text-2xl md:text-3xl',
  lg: 'text-3xl md:text-4xl lg:text-5xl',
  xl: 'text-4xl md:text-5xl lg:text-6xl',
  '2xl': 'text-5xl md:text-6xl lg:text-7xl',
  '3xl': 'text-6xl md:text-7xl lg:text-8xl',
  hero: 'text-[clamp(2.5rem,8vw,10rem)] leading-[0.9]',
};

const variants = {
  default: 'text-foreground',
  gradient: 'bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent',
  muted: 'text-muted-foreground',
};

export const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ as: Component = 'h2', size = 'lg', variant = 'default', serif = true, className, children, ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={cn(
          serif ? 'font-serif' : 'font-sans',
          'font-bold tracking-tight leading-[1.1]',
          sizes[size],
          variants[variant],
          className
        )}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Heading.displayName = 'Heading';

/**
 * Shorthand for h1 elements
 */
export const H1 = React.forwardRef<HTMLHeadingElement, Omit<HeadingProps, 'as'>>(
  (props, ref) => <Heading as="h1" {...props} ref={ref} />
);
H1.displayName = 'H1';

/**
 * Shorthand for h2 elements
 */
export const H2 = React.forwardRef<HTMLHeadingElement, Omit<HeadingProps, 'as'>>(
  (props, ref) => <Heading as="h2" {...props} ref={ref} />
);
H2.displayName = 'H2';

/**
 * Shorthand for h3 elements
 */
export const H3 = React.forwardRef<HTMLHeadingElement, Omit<HeadingProps, 'as'>>(
  (props, ref) => <Heading as="h3" {...props} ref={ref} />
);
H3.displayName = 'H3';

/**
 * Shorthand for h4 elements
 */
export const H4 = React.forwardRef<HTMLHeadingElement, Omit<HeadingProps, 'as'>>(
  (props, ref) => <Heading as="h4" {...props} ref={ref} />
);
H4.displayName = 'H4';
