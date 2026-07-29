/**
 * @description Alert component for displaying semantic messages.
 * @props {AlertProps}
 * @variants default, info, warning, error, success
 * @states static
 * @accessibility Role alert used implicitly by semantic purpose.
 * @example
 * <Alert variant="error">
 *   <AlertTitle>Error</AlertTitle>
 *   <AlertDescription>Something went wrong.</AlertDescription>
 * </Alert>
 */
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "#/lib/utils";

const alertVariants = cva(
  "relative w-full rounded-[var(--radius-md)] border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-[var(--text-primary)]",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--surface-1)] border-[var(--border-default)] text-[var(--text-primary)]",
        info: "bg-[var(--info-muted)] border-[var(--info)] text-[var(--info)] [&>svg]:text-[var(--info)]",
        warning:
          "bg-[var(--warning-muted)] border-[var(--warning)] text-[var(--warning)] [&>svg]:text-[var(--warning)]",
        error:
          "bg-[var(--error-muted)] border-[var(--error)] text-[var(--error)] [&>svg]:text-[var(--error)]",
        success:
          "bg-[var(--success-muted)] border-[var(--success)] text-[var(--success)] [&>svg]:text-[var(--success)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(alertVariants({ variant }), className)}
    {...props}
  />
));
Alert.displayName = "Alert";

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-medium leading-none tracking-tight", className)}
    {...props}
  />
));
AlertTitle.displayName = "AlertTitle";

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm [&_p]:leading-relaxed", className)}
    {...props}
  />
));
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertTitle, AlertDescription };
