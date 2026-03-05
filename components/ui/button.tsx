'use client';

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from '@/lib/icons';
import { motion, useReducedMotion } from 'framer-motion';

import { cn } from '@/lib/utils';

const MotionSlot = motion.create(Slot);

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium tracking-tight transition-all duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/45 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-55',
  {
    variants: {
      variant: {
        primary:
          'bg-brand text-white shadow-[0_1px_3px_rgba(0,0,0,0.12)] hover:bg-brand-dark hover:shadow-[0_2px_6px_rgba(0,0,0,0.16)]',
        secondary:
          'border border-border bg-transparent text-brand hover:bg-muted/60 hover:border-brand/45',
        ghost: 'bg-transparent text-foreground hover:bg-muted/60',
        accent:
          'bg-brand text-bg-base shadow-[0_1px_3px_rgba(0,0,0,0.12)] hover:bg-brand-dark hover:shadow-[0_2px_6px_rgba(0,0,0,0.16)]',
        destructive:
          'bg-destructive text-destructive-foreground shadow-[0_1px_3px_rgba(0,0,0,0.12)] hover:bg-destructive/90',
        link: 'h-auto p-0 bg-transparent text-brand hover:underline underline-offset-4 shadow-none',
      },
      size: {
        sm: 'rounded-lg px-3 py-1.5 text-sm',
        md: 'rounded-xl px-4 py-2 text-sm',
        lg: 'rounded-xl px-5 py-2.5 text-base',
        xl: 'rounded-xl px-6 py-3 text-base',
        icon: 'h-9 w-9 rounded-full p-2',
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

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
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
    if (asChild) {
      return (
        // [motion]
        <MotionSlot
          className={cn(
            buttonVariants({ variant, size }),
            loading && 'cursor-not-allowed pointer-events-none',
            className
          )}
          ref={ref}
          aria-busy={loading || undefined}
          whileTap={isMotionEnabled ? { scale: 0.96 } : undefined}
          whileHover={isHoverEnabled ? { scale: 1.01 } : undefined}
          transition={isMotionEnabled || isHoverEnabled ? { type: 'spring', stiffness: 400, damping: 17 } : undefined}
          {...props}
        >
          {children}
        </MotionSlot>
      );
    }

    return (
      // [motion]
      <motion.button
        className={cn(
          buttonVariants({ variant, size }),
          loading && 'cursor-not-allowed pointer-events-none',
          className
        )}
        ref={ref}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
        whileTap={isMotionEnabled ? { scale: 0.96 } : undefined}
        whileHover={isHoverEnabled ? { scale: 1.01 } : undefined}
        transition={isMotionEnabled || isHoverEnabled ? { type: 'spring', stiffness: 400, damping: 17 } : undefined}
        {...props}
      >
        <span className="inline-flex h-4 w-4 items-center justify-center">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : leftIcon ? leftIcon : null}
        </span>
        {children}
        {rightIcon ? <span className="inline-flex h-4 w-4 items-center justify-center">{rightIcon}</span> : null}
      </motion.button>
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
