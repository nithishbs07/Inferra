/**
 * Progress component
 * @description Displays an indicator showing the completion progress of a task.
 * @props {ProgressProps}
 * @accessibility Role progressbar, values automatically managed via radix.
 * @usage
 * ```tsx
 * <Progress value={33} />
 * ```
 */
import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cn } from "#/lib/utils";

export interface ProgressProps extends React.ComponentPropsWithoutRef<
  typeof ProgressPrimitive.Root
> {
  value?: number | null;
}

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(({ className, value, ...props }, ref) => {
  const isIndeterminate = value === null || value === undefined;

  return (
    <ProgressPrimitive.Root
      ref={ref}
      className={cn(
        "relative h-2 w-full overflow-hidden rounded-[var(--radius-full)] bg-[var(--surface-2)]",
        className,
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className={cn(
          "h-full w-full flex-1 bg-[var(--brand-primary)] transition-all",
          isIndeterminate &&
            "animate-[progress-indeterminate_1s_infinite_linear] origin-left",
        )}
        style={
          !isIndeterminate
            ? { transform: `translateX(-${100 - (value || 0)}%)` }
            : undefined
        }
      />
    </ProgressPrimitive.Root>
  );
});
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
