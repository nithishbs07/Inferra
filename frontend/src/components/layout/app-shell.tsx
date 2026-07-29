/**
 * Inferra — App Shell
 *
 * Top-level layout component that composes the application structure:
 * Sidebar → Workspace → StatusBar
 *
 * This is the new layout system that replaces the old chatbot-style layout.
 * It provides the structural foundation without migrating any features yet.
 *
 * Architecture:
 * ```
 * ┌──────────┬──────────────────────────────────────┐
 * │          │  Workspace                            │
 * │ Sidebar  │  ┌────────────────────────────────┐  │
 * │          │  │  Content (children)             │  │
 * │          │  └────────────────────────────────┘  │
 * │          │  [Status Bar]                        │
 * └──────────┴──────────────────────────────────────┘
 * ```
 *
 * Props:
 * - `children` — Main workspace content
 * - `sidebar` — Sidebar content (optional, renders default Sidebar if omitted)
 * - `statusBar` — Status bar content (optional)
 *
 * Usage:
 * ```tsx
 * <AppShell>
 *   <WorkspaceTabs />
 *   <ConversationView />
 * </AppShell>
 * ```
 */

import React from "react";
import { cn } from "#/lib/utils";

interface AppShellProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
  statusBar?: React.ReactNode;
  className?: string;
}

export function AppShell({
  children,
  sidebar,
  statusBar,
  className,
}: AppShellProps) {
  return (
    <div
      className={cn(
        "h-screen w-screen flex overflow-hidden",
        "bg-[var(--surface-0)] text-[var(--text-primary)]",
        "font-[var(--font-sans)]",
        className,
      )}
    >
      {/* Sidebar */}
      {sidebar && <aside className="flex-shrink-0 h-full">{sidebar}</aside>}

      {/* Main workspace area */}
      <div className="flex-1 flex flex-col min-w-0 h-full">
        {/* Workspace content */}
        <main className="flex-1 min-h-0 overflow-hidden">{children}</main>

        {/* Status bar */}
        {statusBar && (
          <footer
            className={cn(
              "flex-shrink-0 h-[var(--status-bar-height)]",
              "border-t border-[var(--border-subtle)]",
              "bg-[var(--surface-1)]",
            )}
          >
            {statusBar}
          </footer>
        )}
      </div>
    </div>
  );
}
