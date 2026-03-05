'use client';

import * as React from 'react';
import { Slot, Slottable } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from '@/lib/icons';
import { motion, useReducedMotion } from 'framer-motion';

import { cn } from '@/lib/utils';

const MotionSlot = motion.create(Slot);

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap font-medium tracking-tight transition-all duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-55 min-w-0 max-w-full truncate',
  {
    variants: {
      variant: {
        primary:
          'bg-brand text-white shadow-[0_1px_3px_rgba(0,0,0,0.12)] hover:bg-brand-dark hover:shadow-[0_2px_6px_rgba(0,0,0,0.16)] focus-visible:ring-brand/45',
        secondary:
          'border border-border bg-transparent text-brand hover:bg-muted/60 hover:border-brand/45 focus-visible:ring-brand/45',
        ghost: 'bg-transparent text-foreground hover:bg-muted/60 focus-visible:ring-neutral-400',
        accent:
          'bg-brand text-bg-base shadow-[0_1px_3px_rgba(0,0,0,0.12)] hover:bg-brand-dark hover:shadow-[0_2px_6px_rgba(0,0,0,0.16)] focus-visible:ring-brand/45',
        destructive:
          'bg-destructive text-destructive-foreground shadow-[0_1px_3px_rgba(0,0,0,0.12)] hover:bg-destructive/90 focus-visible:ring-destructive/45',
        link: 'h-auto p-0 bg-transparent text-brand hover:underline underline-offset-4 shadow-none focus-visible:ring-brand/45',
      },
      size: {
        sm: 'h-8 rounded-lg px-3 gap-1.5 text-xs sm:text-sm',
        md: 'h-10 rounded-xl px-4 gap-2 text-sm sm:text-base',
        lg: 'h-12 rounded-xl px-6 gap-2.5 text-base sm:text-lg',
        xl: 'h-14 rounded-2xl px-8 gap-3 text-lg sm:text-xl',
        icon: 'h-10 w-10 rounded-full',
      },
      fullWidth: {
        true: 'w-full',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

type BaseButtonProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  'onDrag' | 'onDragStart' | 'onDragEnd' | 'onAnimationStart' | 'onAnimationEnd' | 'onAnimationIteration'
> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    loading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
  };

type IconOnlyProps =
  | {
      size: 'icon';
      'aria-label': string;
    }
  | {
      size?: Exclude<VariantProps<typeof buttonVariants>['size'], 'icon'>;
      'aria-label'?: string;
    };

export type ButtonProps = BaseButtonProps & IconOnlyProps;

const iconSizes = {
  sm: 'h-3.5 w-3.5',
  md: 'h-4 w-4',
  lg: 'h-5 w-5',
  xl: 'h-6 w-6',
  icon: 'h-5 w-5',
} as const;

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      fullWidth,
      asChild = false,
      loading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const shouldReduceMotion = useReducedMotion();
    const isMotionEnabled = !shouldReduceMotion && (variant === 'primary' || variant === 'accent' || variant === 'secondary' || variant === 'destructive');
    const isHoverEnabled = !shouldReduceMotion && (variant === 'primary' || variant === 'accent');
    
    const Comp = asChild ? MotionSlot : motion.button;
    const iconSizeClass = size && size !== 'icon' ? iconSizes[size as keyof typeof iconSizes] : iconSizes.icon;

    return (
      <Comp
        className={cn(
          buttonVariants({ variant, size, fullWidth }),
          loading && 'cursor-not-allowed pointer-events-none opacity-70',
          className
        )}
        ref={ref}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
        whileTap={isMotionEnabled ? { scale: 0.97 } : undefined}
        whileHover={isHoverEnabled ? { scale: 1.02 } : undefined}
        transition={isMotionEnabled || isHoverEnabled ? { type: 'spring', stiffness: 400, damping: 17 } : undefined}
        {...props}
      >
        {/* Note: When asChild is true, we cannot safely inject icons/loading inside the child.  
            The user must compose these manually in the children. */}
        {!asChild && (loading || leftIcon) && (
          <span className={cn("inline-flex shrink-0 items-center justify-center", iconSizeClass)}>
            {loading ? <Loader2 className={cn("animate-spin", iconSizeClass)} aria-label="Loading" /> : leftIcon}
          </span>
        )}
        <Slottable>{children}</Slottable>
        {!asChild && rightIcon && !loading && (
          <span className={cn("inline-flex shrink-0 items-center justify-center", iconSizeClass)}>
            {rightIcon}
          </span>
        )}
      </Comp>
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
