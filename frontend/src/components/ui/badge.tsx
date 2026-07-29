/**
 * Badge component
 * @description Small status indicator or label.
 * @props {BadgeProps}
 * @variants default, secondary, destructive, success, warning, info, outline
 * @sizes sm, default
 * @accessibility Not typically interactive. Used for status communication.
 * @usage
 * ```tsx
 * <Badge variant="success" showDot>Active</Badge>
 * ```
 */
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "#/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-[var(--radius-full)] border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-[var(--brand-primary)] text-white shadow hover:bg-[var(--brand-primary)]/80",
        secondary:
          "border-transparent bg-[var(--surface-2)] text-[var(--text-primary)] hover:bg-[var(--surface-3)]",
        destructive:
          "border-transparent bg-[var(--error)] text-white shadow hover:bg-[var(--error)]/80",
        success:
          "border-transparent bg-[var(--success)] text-white shadow hover:bg-[var(--success)]/80",
        warning:
          "border-transparent bg-[var(--warning)] text-white shadow hover:bg-[var(--warning)]/80",
        info: "border-transparent bg-[var(--info)] text-white shadow hover:bg-[var(--info)]/80",
        outline: "text-[var(--text-primary)] border-[var(--border-subtle)]",
      },
      size: {
        default: "px-2.5 py-0.5 text-xs",
        sm: "px-1.5 py-0.1 text-[10px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface BadgeProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  showDot?: boolean;
}

function Badge({
  className,
  variant,
  size,
  showDot,
  children,
  ...props
}: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props}>
      {showDot && (
        <span
          className="mr-1 h-1.5 w-1.5 rounded-full bg-current opacity-75"
          aria-hidden="true"
        />
      )}
      {children}
    </div>
  );
}

export { Badge, badgeVariants };
