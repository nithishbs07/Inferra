/**
 * Tabs component using @radix-ui/react-tabs and Framer Motion.
 *
 * Props:
 * - Tabs: value, onValueChange, defaultValue, className
 * - TabsList: className
 * - TabsTrigger: value, className
 * - TabsContent: value, className
 *
 * Variants: None
 * States: active, inactive, focus, disabled
 * Accessibility: WCAG AA, keyboard navigable (arrows), focus visible
 *
 * Usage:
 * <Tabs defaultValue="tab1">
 *   <TabsList>
 *     <TabsTrigger value="tab1">Tab 1</TabsTrigger>
 *     <TabsTrigger value="tab2">Tab 2</TabsTrigger>
 *   </TabsList>
 *   <TabsContent value="tab1">Content 1</TabsContent>
 *   <TabsContent value="tab2">Content 2</TabsContent>
 * </Tabs>
 */

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { motion } from "framer-motion";
import { cn } from "#/lib/utils";
import { layoutTransition } from "#/lib/motion";

const TabsContext = React.createContext<{ value?: string }>({});

const Tabs = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Root>
>(({ value, defaultValue, onValueChange, ...props }, ref) => {
  const [activeValue, setActiveValue] = React.useState(value || defaultValue);

  return (
    <TabsContext.Provider value={{ value: activeValue }}>
      <TabsPrimitive.Root
        ref={ref}
        value={value}
        defaultValue={defaultValue}
        onValueChange={(val) => {
          setActiveValue(val);
          onValueChange?.(val);
        }}
        {...props}
      />
    </TabsContext.Provider>
  );
});
Tabs.displayName = TabsPrimitive.Root.displayName;

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex h-10 items-center justify-center rounded-[var(--radius-md)] bg-[var(--surface-1)] p-1 text-[var(--text-secondary)]",
      className,
    )}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, children, value, ...props }, ref) => {
  const context = React.useContext(TabsContext);
  const isActive = context.value === value;

  return (
    <TabsPrimitive.Trigger
      ref={ref}
      value={value}
      className={cn(
        "relative inline-flex items-center justify-center whitespace-nowrap rounded-[var(--radius-sm)] px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)] disabled:pointer-events-none disabled:opacity-50 data-[state=active]:text-[var(--text-primary)] min-h-[44px] min-w-[44px]",
        className,
      )}
      {...props}
    >
      <span className="relative z-10">{children}</span>
      {isActive && (
        <motion.div
          layoutId="tabs-indicator"
          className="absolute inset-0 z-0 rounded-[var(--radius-sm)] border-b-2 border-[var(--brand-primary)] bg-[var(--surface-active)] shadow-[var(--shadow-sm)]"
          initial={false}
          transition={layoutTransition}
        />
      )}
    </TabsPrimitive.Trigger>
  );
});
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)]",
      className,
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };
