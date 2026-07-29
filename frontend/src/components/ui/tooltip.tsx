/**
 * @description Tooltip component using Radix UI and Framer Motion.
 * @props {TooltipProps}
 * @variants default
 * @states open, closed
 * @accessibility Keyboard focusable and screen reader friendly.
 * @example
 * <TooltipProvider>
 *   <Tooltip>
 *     <TooltipTrigger>Hover me</TooltipTrigger>
 *     <TooltipContent>Tooltip info here <TooltipArrow /></TooltipContent>
 *   </Tooltip>
 * </TooltipProvider>
 */
import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "#/lib/utils";
import { scaleIn } from "#/lib/motion";

const TooltipProvider = TooltipPrimitive.Provider;

const Tooltip = TooltipPrimitive.Root;

const TooltipTrigger = TooltipPrimitive.Trigger;

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, children, ...props }, ref) => (
  <AnimatePresence>
    <TooltipPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      asChild
      {...props}
    >
      <motion.div
        variants={scaleIn}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ delay: 0.2, duration: 0.2 }}
        className={cn(
          "z-50 overflow-hidden rounded-[var(--radius-md)] bg-[var(--surface-2)] px-3 py-1.5 text-xs text-[var(--text-primary)] shadow-[var(--shadow-md)]",
          className,
        )}
      >
        {children}
      </motion.div>
    </TooltipPrimitive.Content>
  </AnimatePresence>
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

const TooltipArrow = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Arrow>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Arrow>
>(({ className, ...props }, ref) => (
  <TooltipPrimitive.Arrow
    ref={ref}
    className={cn("fill-[var(--surface-2)]", className)}
    {...props}
  />
));
TooltipArrow.displayName = TooltipPrimitive.Arrow.displayName;

export {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
  TooltipArrow,
};
