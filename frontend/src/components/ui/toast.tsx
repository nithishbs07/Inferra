/**
 * Toast component using sonner.
 *
 * Props: Standard sonner Toaster props
 *
 * Variants: success, error, info, warning
 * States: None
 * Accessibility: WCAG AA
 *
 * Usage:
 * <Toaster />
 * toast.success("Event has been created")
 */

import { Toaster as Sonner, toast } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

function Toaster({ ...props }: ToasterProps) {
  return (
    <Sonner
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-[var(--surface-2)] group-[.toaster]:text-[var(--text-primary)] group-[.toaster]:border-[var(--border-default)] group-[.toaster]:shadow-[var(--shadow-lg)] group-[.toaster]:rounded-[var(--radius-md)]",
          description: "group-[.toast]:text-[var(--text-secondary)]",
          actionButton:
            "group-[.toast]:bg-[var(--brand-primary)] group-[.toast]:text-white",
          cancelButton:
            "group-[.toast]:bg-[var(--surface-3)] group-[.toast]:text-[var(--text-primary)]",
          error:
            "group-[.toaster]:bg-[var(--error-muted)] group-[.toaster]:text-[var(--error)] group-[.toaster]:border-[var(--error)]",
          success:
            "group-[.toaster]:bg-[var(--success-muted)] group-[.toaster]:text-[var(--success)] group-[.toaster]:border-[var(--success)]",
          warning:
            "group-[.toaster]:bg-[var(--warning-muted)] group-[.toaster]:text-[var(--warning)] group-[.toaster]:border-[var(--warning)]",
          info: "group-[.toaster]:bg-[var(--info-muted)] group-[.toaster]:text-[var(--info)] group-[.toaster]:border-[var(--info)]",
        },
      }}
      {...props}
    />
  );
}

export { Toaster, toast };
