/**
 * EmptyState component for showing when no data is available.
 *
 * Props:
 * - icon: Lucide icon component
 * - title: string
 * - description: string
 * - action: React.ReactNode (optional button)
 *
 * Variants: None
 * States: None
 * Accessibility: WCAG AA
 *
 * Usage:
 * <EmptyState
 *   icon={FolderOpen}
 *   title="No projects found"
 *   description="Get started by creating a new project."
 *   action={<Button>Create Project</Button>}
 * />
 */

import * as React from "react";
import { type LucideIcon } from "lucide-react";
import { cn } from "#/lib/utils";

interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ className, icon: Icon, title, description, action, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex min-h-[400px] flex-col items-center justify-center rounded-[var(--radius-lg)] border border-dashed border-[var(--border-default)] bg-[var(--surface-0)] p-8 text-center animate-in fade-in-50",
        className,
      )}
      {...props}
    >
      <div className="flex h-20 w-20 items-center justify-center rounded-[var(--radius-full)] bg-[var(--surface-2)] mb-4">
        <Icon className="h-10 w-10 text-[var(--text-tertiary)]" />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-[var(--text-primary)]">
        {title}
      </h3>
      {description && (
        <p className="mt-2 mb-4 text-sm text-[var(--text-secondary)] max-w-sm">
          {description}
        </p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  ),
);
EmptyState.displayName = "EmptyState";

export { EmptyState };
