/**
 * Skeleton component
 * @description Animated placeholder for loading states.
 * @props {SkeletonProps}
 * @variants line, circle, card
 * @accessibility Decorative element, hidden from screen readers. Use aria-busy on parent container.
 * @usage
 * ```tsx
 * <Skeleton variant="card" className="h-[200px] w-[300px]" />
 * ```
 */
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "#/lib/utils";

const skeletonVariants = cva("animate-pulse bg-[var(--surface-3)]", {
  variants: {
    variant: {
      line: "h-4 w-full rounded-[var(--radius-sm)]",
      circle: "rounded-full",
      card: "rounded-[var(--radius-lg)]",
    },
  },
  defaultVariants: {
    variant: "line",
  },
});

export interface SkeletonProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof skeletonVariants> {}

function Skeleton({ className, variant, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(skeletonVariants({ variant }), className)}
      {...props}
      aria-hidden="true"
    />
  );
}

export { Skeleton, skeletonVariants };
