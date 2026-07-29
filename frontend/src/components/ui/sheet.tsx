/**
 * @description Sheet component using Radix UI Dialog and Framer Motion.
 * @props {SheetProps}
 * @variants side: left, right, top, bottom
 * @states open, closed
 * @accessibility Dialog accessibility features for side panels.
 * @example
 * <Sheet>
 *   <SheetTrigger>Open Menu</SheetTrigger>
 *   <SheetContent side="right">Menu Items</SheetContent>
 * </Sheet>
 */
import * as React from "react";
import * as SheetPrimitive from "@radix-ui/react-dialog";
import { cva, type VariantProps } from "class-variance-authority";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "#/lib/utils";

const Sheet = SheetPrimitive.Root;
const SheetTrigger = SheetPrimitive.Trigger;
const SheetClose = SheetPrimitive.Close;
const SheetPortal = SheetPrimitive.Portal;

const SheetOverlay = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Overlay
    className={cn(
      "fixed inset-0 z-50 bg-[var(--surface-overlay)] backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className,
    )}
    {...props}
    ref={ref}
  />
));
SheetOverlay.displayName = SheetPrimitive.Overlay.displayName;

const sheetVariants = cva(
  "fixed z-50 gap-4 bg-[var(--surface-1)] p-6 shadow-lg transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-[var(--duration-normal)] data-[state=open]:duration-[var(--duration-slow)]",
  {
    variants: {
      side: {
        top: "inset-x-0 top-0 border-b border-[var(--border-default)]",
        bottom: "inset-x-0 bottom-0 border-t border-[var(--border-default)]",
        left: "inset-y-0 left-0 h-full w-3/4 border-r border-[var(--border-default)] sm:max-w-sm",
        right:
          "inset-y-0 right-0 h-full w-3/4 border-l border-[var(--border-default)] sm:max-w-sm",
      },
    },
    defaultVariants: {
      side: "right",
    },
  },
);

interface SheetContentProps
  extends
    React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content>,
    VariantProps<typeof sheetVariants> {}

const SheetContent = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Content>,
  SheetContentProps
>(({ side = "right", className, children, ...props }, ref) => {
  const getVariants = () => {
    switch (side) {
      case "left":
        return {
          initial: { x: "-100%" },
          animate: { x: 0 },
          exit: { x: "-100%" },
        };
      case "right":
        return {
          initial: { x: "100%" },
          animate: { x: 0 },
          exit: { x: "100%" },
        };
      case "top":
        return {
          initial: { y: "-100%" },
          animate: { y: 0 },
          exit: { y: "-100%" },
        };
      case "bottom":
        return {
          initial: { y: "100%" },
          animate: { y: 0 },
          exit: { y: "100%" },
        };
    }
  };

  return (
    <SheetPortal>
      <SheetOverlay />
      <AnimatePresence>
        <SheetPrimitive.Content asChild ref={ref} {...props}>
          <motion.div
            variants={getVariants()}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className={cn(sheetVariants({ side }), className)}
          >
            {children}
            <SheetPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-[var(--surface-2)]">
              <X className="h-4 w-4 text-[var(--text-primary)]" />
              <span className="sr-only">Close</span>
            </SheetPrimitive.Close>
          </motion.div>
        </SheetPrimitive.Content>
      </AnimatePresence>
    </SheetPortal>
  );
});
SheetContent.displayName = SheetPrimitive.Content.displayName;

function SheetHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex flex-col space-y-2 text-center sm:text-left",
        className,
      )}
      {...props}
    />
  );
}
SheetHeader.displayName = "SheetHeader";

function SheetFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
        className,
      )}
      {...props}
    />
  );
}
SheetFooter.displayName = "SheetFooter";

const SheetTitle = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Title>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Title
    ref={ref}
    className={cn(
      "text-lg font-semibold text-[var(--text-primary)]",
      className,
    )}
    {...props}
  />
));
SheetTitle.displayName = SheetPrimitive.Title.displayName;

const SheetDescription = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Description>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Description
    ref={ref}
    className={cn("text-sm text-[var(--text-secondary)]", className)}
    {...props}
  />
));
SheetDescription.displayName = SheetPrimitive.Description.displayName;

export {
  Sheet,
  SheetPortal,
  SheetOverlay,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
};
