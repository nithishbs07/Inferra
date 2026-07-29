/**
 * @description Avatar component using Radix UI primitives.
 * @props {AvatarProps & { size?: 'sm' | 'default' | 'lg', status?: 'online' | 'offline' | 'busy' }}
 * @variants size: sm, default, lg
 * @states status indicator for user presence
 * @accessibility Displays fallback when image fails to load.
 * @example
 * <Avatar size="lg" status="online">
 *   <AvatarImage src="/avatar.jpg" alt="User" />
 *   <AvatarFallback>UN</AvatarFallback>
 * </Avatar>
 */
import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "#/lib/utils";

const avatarVariants = cva(
  "relative flex shrink-0 overflow-hidden rounded-[var(--radius-full)]",
  {
    variants: {
      size: {
        sm: "h-[32px] w-[32px]",
        default: "h-[40px] w-[40px]",
        lg: "h-[48px] w-[48px]",
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
);

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root> &
    VariantProps<typeof avatarVariants> & {
      status?: "online" | "offline" | "busy";
    }
>(({ className, size, status, children, ...props }, ref) => (
  <div className="relative inline-block">
    <AvatarPrimitive.Root
      ref={ref}
      className={cn(avatarVariants({ size, className }))}
      {...props}
    >
      {children}
    </AvatarPrimitive.Root>
    {status && (
      <span
        className={cn(
          "absolute bottom-0 right-0 block rounded-[var(--radius-full)] border-2 border-[var(--surface-0)]",
          size === "sm" ? "h-2.5 w-2.5" : size === "lg" ? "h-4 w-4" : "h-3 w-3",
          status === "online" && "bg-[var(--success)]",
          status === "busy" && "bg-[var(--error)]",
          status === "offline" && "bg-[var(--text-tertiary)]",
        )}
      />
    )}
  </div>
));
Avatar.displayName = AvatarPrimitive.Root.displayName;

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn("aspect-square h-full w-full object-cover", className)}
    {...props}
  />
));
AvatarImage.displayName = AvatarPrimitive.Image.displayName;

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center rounded-[var(--radius-full)] bg-[var(--surface-2)] text-[var(--text-primary)] font-medium",
      className,
    )}
    {...props}
  />
));
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

export { Avatar, AvatarImage, AvatarFallback };
