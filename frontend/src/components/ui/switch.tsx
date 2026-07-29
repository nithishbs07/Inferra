/**
 * Switch component using @radix-ui/react-switch.
 *
 * Props:
 * - checked, onCheckedChange, disabled, required, name, value, className
 *
 * Variants: None
 * States: checked, unchecked, focus, disabled
 * Accessibility: WCAG AA, touch target >= 44px
 *
 * Usage:
 * <Switch checked={true} onCheckedChange={setVal} />
 */

import * as React from "react";
import * as SwitchPrimitives from "@radix-ui/react-switch";
import { motion } from "framer-motion";
import { cn } from "#/lib/utils";
import { layoutTransition } from "#/lib/motion";

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <div className="flex items-center min-h-[44px] min-w-[44px]">
    <SwitchPrimitives.Root
      className={cn(
        "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-[var(--radius-full)] border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-[var(--brand-primary)] data-[state=unchecked]:bg-[var(--surface-3)]",
        className,
      )}
      {...props}
      ref={ref}
    >
      <SwitchPrimitives.Thumb asChild>
        <motion.div
          layout
          transition={layoutTransition}
          className={cn(
            "pointer-events-none block h-5 w-5 rounded-[var(--radius-full)] bg-white shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0",
          )}
        />
      </SwitchPrimitives.Thumb>
    </SwitchPrimitives.Root>
  </div>
));
Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };
