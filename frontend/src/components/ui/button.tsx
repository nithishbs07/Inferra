/**
 * Button component
 * @description Interactive button component with variants, sizes, and states.
 * @props {ButtonProps}
 * @variants default, secondary, ghost, destructive, outline, link
 * @sizes sm, default, lg, icon
 * @accessibility Supports keyboard navigation, aria-disabled when loading, proper touch targets.
 * @usage
 * ```tsx
 * <Button variant="secondary" size="lg" isLoading>Click Me</Button>
 * ```
 */
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { cn } from "#/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-[var(--radius-md)] text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--brand-primary)] disabled:pointer-events-none disabled:opacity-50 min-h-[44px] min-w-[44px]",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--brand-primary)] text-[var(--text-inverse)] shadow hover:bg-[var(--brand-primary-hover)]",
        destructive:
          "bg-[var(--error)] text-[var(--text-inverse)] shadow-sm hover:opacity-90",
        outline:
          "border border-[var(--border-subtle)] bg-transparent shadow-sm hover:bg-[var(--surface-1)] hover:text-[var(--text-primary)]",
        secondary:
          "bg-[var(--surface-2)] text-[var(--text-primary)] shadow-sm hover:bg-[var(--surface-3)]",
        ghost:
          "hover:bg-[var(--surface-1)] hover:text-[var(--text-primary)] bg-transparent text-[var(--text-primary)]",
        link: "text-[var(--brand-primary)] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-[var(--radius-sm)] px-3 text-xs min-h-[44px] min-w-[44px]", // Note: forcing 44px min touch target
        lg: "h-11 rounded-[var(--radius-lg)] px-8",
        icon: "h-10 w-10 min-h-[44px] min-w-[44px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends
    Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "ref">,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      isLoading = false,
      children,
      disabled,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";
    const MotionComp = motion.create(Comp as any);

    return (
      <MotionComp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || isLoading}
        whileTap={{ scale: 0.97 }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 25,
          duration: 0.15,
        }}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </MotionComp>
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
