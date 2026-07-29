/**
 * Input component
 * @description Form input field with support for icons and states.
 * @props {InputProps}
 * @variants default, focus, error, disabled
 * @accessibility Proper aria attributes, keyboard support, high contrast borders on focus.
 * @usage
 * ```tsx
 * <Input startIcon={<SearchIcon />} placeholder="Search..." error={true} />
 * ```
 */
import * as React from "react";
import { cn } from "#/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  error?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, startIcon, endIcon, error, disabled, ...props }, ref) => (
    <div className="relative flex items-center w-full">
      {startIcon && (
        <div className="absolute left-3 text-[var(--text-tertiary)] flex items-center justify-center pointer-events-none">
          {startIcon}
        </div>
      )}
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-[var(--radius-md)] border bg-[var(--surface-0)] px-3 py-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] transition-colors focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50 min-h-[44px]",
          error
            ? "border-[var(--error)] focus-visible:ring-[var(--error)]"
            : "border-[var(--border-subtle)] focus-visible:border-[var(--brand-primary)] focus-visible:ring-[var(--brand-primary)]",
          startIcon && "pl-9",
          endIcon && "pr-9",
          className,
        )}
        ref={ref}
        disabled={disabled}
        aria-invalid={error}
        {...props}
      />
      {endIcon && (
        <div className="absolute right-3 text-[var(--text-tertiary)] flex items-center justify-center pointer-events-none">
          {endIcon}
        </div>
      )}
    </div>
  ),
);
Input.displayName = "Input";

export { Input };
