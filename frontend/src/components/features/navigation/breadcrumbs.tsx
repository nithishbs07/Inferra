/**
 * Inferra — Breadcrumbs
 *
 * Route-aware breadcrumb navigation.
 * Automatically generates breadcrumbs from the current URL path.
 *
 * Props:
 * - `separator` — Custom separator element. Default: ChevronRight icon
 * - `className` — Additional CSS classes
 *
 * Route Mapping:
 * - / → Home
 * - /settings → Settings
 * - /settings/agent → Settings > Agent
 * - /conversations/:id → Conversations > [ID]
 *
 * Accessibility:
 * - Uses `<nav aria-label="Breadcrumb">`
 * - Uses `<ol>` with `aria-current="page"` on last item
 *
 * Usage:
 * ```tsx
 * <Breadcrumbs />
 * ```
 */

import React from "react";
import { useLocation, Link } from "react-router";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "#/lib/utils";

const ROUTE_LABELS: Record<string, string> = {
  "": "Home",
  settings: "Settings",
  agent: "Agent",
  condenser: "Condenser",
  verification: "Verification",
  "org-defaults": "Organization Defaults",
  mcp: "MCP",
  skills: "Skills",
  user: "User",
  integrations: "Integrations",
  app: "App",
  billing: "Billing",
  secrets: "Secrets",
  "api-keys": "API Keys",
  "org-members": "Members",
  org: "Organization",
  "usage-monitoring": "Usage",
  "admin-dashboard": "Admin",
  budgets: "Budgets",
  conversations: "Conversations",
};

interface BreadcrumbsProps {
  separator?: React.ReactNode;
  className?: string;
}

export function Breadcrumbs({ separator, className }: BreadcrumbsProps) {
  const { pathname } = useLocation();

  const segments = React.useMemo(() => {
    const parts = pathname.split("/").filter(Boolean);
    if (parts.length === 0) return [];

    return parts.map((part, index) => {
      const path = `/${parts.slice(0, index + 1).join("/")}`;
      const label = ROUTE_LABELS[part] || decodeURIComponent(part);
      const isLast = index === parts.length - 1;
      return { path, label, isLast };
    });
  }, [pathname]);

  if (segments.length === 0) return null;

  const sep = separator || (
    <ChevronRight
      size={12}
      className="text-[var(--text-tertiary)] flex-shrink-0"
      aria-hidden="true"
    />
  );

  return (
    <nav aria-label="Breadcrumb" className={cn("flex items-center", className)}>
      <ol className="flex items-center gap-1.5 text-[var(--text-xs)]">
        {/* Home link */}
        <li className="flex items-center gap-1.5">
          <Link
            to="/"
            className={cn(
              "flex items-center gap-1 text-[var(--text-tertiary)]",
              "hover:text-[var(--text-secondary)]",
              "transition-colors duration-[var(--duration-fast)]",
            )}
          >
            <Home size={12} />
          </Link>
          {segments.length > 0 && sep}
        </li>

        {/* Path segments */}
        {segments.map((segment) => (
          <li key={segment.path} className="flex items-center gap-1.5">
            {segment.isLast ? (
              <span
                className="text-[var(--text-secondary)] font-[var(--font-medium)] truncate max-w-[200px]"
                aria-current="page"
              >
                {segment.label}
              </span>
            ) : (
              <>
                <Link
                  to={segment.path}
                  className={cn(
                    "text-[var(--text-tertiary)]",
                    "hover:text-[var(--text-secondary)]",
                    "transition-colors duration-[var(--duration-fast)]",
                    "truncate max-w-[150px]",
                  )}
                >
                  {segment.label}
                </Link>
                {sep}
              </>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
