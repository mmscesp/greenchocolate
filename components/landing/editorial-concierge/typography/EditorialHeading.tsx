import React from 'react';
import { cn } from '@/lib/utils';

interface EditorialHeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'hero';
  gradient?: boolean;
}

const sizes = {
  sm: 'text-xl md:text-2xl',
  md: 'text-2xl md:text-3xl',
  lg: 'text-3xl md:text-4xl lg:text-5xl',
  xl: 'text-4xl md:text-6xl lg:text-7xl',
  '2xl': 'text-5xl md:text-7xl lg:text-8xl',
  hero: 'text-[clamp(2.5rem,8vw,10rem)] leading-tight tracking-normal'
};

export const EditorialHeading = React.forwardRef<HTMLHeadingElement, EditorialHeadingProps>(
  ({ as: Component = 'h2', size = 'lg', gradient = false, className, children, ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={cn(
          'font-serif font-bold tracking-normal leading-[1.2]',
          sizes[size],
          gradient && 'bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent',
          className
        )}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

EditorialHeading.displayName = 'EditorialHeading';
