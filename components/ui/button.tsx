import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        // Primary: Main actions, solid brand color
        primary: 
          "bg-brand text-white hover:bg-brand-dark shadow-sm hover:shadow",
        
        // Secondary: Alternative actions, outlined style
        secondary: 
          "bg-card text-foreground border border-border hover:bg-muted hover:border-brand/30",
        
        // Ghost: Low emphasis, navigation items
        ghost: 
          "hover:bg-neutral-100 text-foreground hover:text-brand",
        
        // Accent: Premium highlights, CTAs, verified actions
        accent: 
          "bg-gold text-neutral-900 hover:bg-gold-dark font-semibold shadow-sm hover:shadow",
        
        // Destructive: Danger actions
        destructive: 
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        
        // Link: Text-only button
        link: 
          "text-brand underline-offset-4 hover:underline hover:text-brand-dark",
        
        // Legacy aliases for backward compatibility during transition
        default: "bg-brand text-white hover:bg-brand-dark shadow-sm hover:shadow",
        outline: "bg-card text-foreground border border-border hover:bg-muted hover:border-brand/30",
      },
      size: {
        sm: "h-9 px-3 text-xs",
        md: "h-11 px-4",
        lg: "h-12 px-6 text-base",
        xl: "h-14 px-8 text-base",
        icon: "h-10 w-10",
        default: "h-11 px-4",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
