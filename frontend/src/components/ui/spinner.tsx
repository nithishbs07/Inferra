/**
 * Spinner component
 * @description Animated SVG spinner for loading states.
 * @props {SpinnerProps}
 * @sizes sm, default, lg
 * @accessibility Informative or decorative loading indicator. Use aria-label if standalone.
 * @usage
 * ```tsx
 * <Spinner size="lg" aria-label="Loading profile..." />
 * ```
 */
import * as React from "react";
import { motion } from "framer-motion";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "#/lib/utils";

const spinnerVariants = cva("text-[var(--brand-primary)]", {
  variants: {
    size: {
      sm: "h-4 w-4",
      default: "h-6 w-6",
      lg: "h-8 w-8",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

export interface SpinnerProps extends VariantProps<typeof spinnerVariants> {
  className?: string;
  "aria-label"?: string;
}

function Spinner({ className, size, ...props }: SpinnerProps) {
  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn(spinnerVariants({ size }), className)}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      role="status"
      aria-label={props["aria-label"] || "Loading"}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </motion.svg>
  );
}
Spinner.displayName = "Spinner";

export { Spinner };
