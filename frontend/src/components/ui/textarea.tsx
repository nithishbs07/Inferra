/**
 * Textarea component
 * @description Multiline text input field with auto-resize support via rows prop.
 * @props {TextareaProps}
 * @states default, focus, error, disabled
 * @accessibility Proper aria attributes, keyboard support.
 * @usage
 * ```tsx
 * <Textarea rows={4} placeholder="Type your message here." />
 * ```
 */
import * as React from "react";
import { cn } from "#/lib/utils";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, disabled, ...props }, ref) => (
    <textarea
      className={cn(
        "flex min-h-[80px] w-full rounded-[var(--radius-md)] border bg-[var(--surface-0)] px-3 py-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] transition-colors focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50",
        error
          ? "border-[var(--error)] focus-visible:ring-[var(--error)]"
          : "border-[var(--border-subtle)] focus-visible:border-[var(--brand-primary)] focus-visible:ring-[var(--brand-primary)]",
        className,
      )}
      ref={ref}
      disabled={disabled}
      aria-invalid={error}
      {...props}
    />
  ),
);
Textarea.displayName = "Textarea";

export { Textarea };
