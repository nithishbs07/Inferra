/**
 * Inferra — Workspace Tabs
 *
 * Horizontal tab bar for the workspace area. Uses Framer Motion `layoutId`
 * for an animated active indicator that slides between tabs.
 *
 * Tabs: Conversation, Files, Browser, Terminal, Memory, Tasks, Artifacts
 * Shortcuts: Cmd+1 through Cmd+7
 *
 * Props:
 * - `tabs` — Array of tab definitions
 * - `activeTab` — Currently active tab key
 * - `onTabChange` — Callback when tab changes
 *
 * Accessibility:
 * - Uses `role="tablist"` and `role="tab"` ARIA pattern
 * - Keyboard navigable (arrow keys, Enter/Space)
 * - Active tab announced via `aria-selected`
 *
 * Usage:
 * ```tsx
 * <WorkspaceTabs
 *   tabs={[
 *     { key: "conversation", label: "Conversation", icon: <MessageSquare /> },
 *     { key: "files", label: "Files", icon: <FolderOpen /> },
 *   ]}
 *   activeTab="conversation"
 *   onTabChange={(key) => setActiveTab(key)}
 * />
 * ```
 */

import React from "react";
import { motion } from "framer-motion";
import { cn } from "#/lib/utils";
import { layoutTransition } from "#/lib/motion";

export interface WorkspaceTab {
  /** Unique key for the tab */
  key: string;
  /** Display label */
  label: string;
  /** Icon element (from lucide-react) */
  icon?: React.ReactNode;
  /** Whether the tab is disabled */
  disabled?: boolean;
}

interface WorkspaceTabsProps {
  tabs: WorkspaceTab[];
  activeTab: string;
  onTabChange: (key: string) => void;
  className?: string;
}

export function WorkspaceTabs({
  tabs,
  activeTab,
  onTabChange,
  className,
}: WorkspaceTabsProps) {
  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    const enabledTabs = tabs.filter((t) => !t.disabled);
    const currentEnabledIndex = enabledTabs.findIndex(
      (t) => t.key === tabs[index].key,
    );

    let nextIndex: number | undefined;

    if (e.key === "ArrowRight") {
      e.preventDefault();
      nextIndex = (currentEnabledIndex + 1) % enabledTabs.length;
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      nextIndex =
        (currentEnabledIndex - 1 + enabledTabs.length) % enabledTabs.length;
    }

    if (nextIndex !== undefined) {
      onTabChange(enabledTabs[nextIndex].key);
    }
  };

  return (
    <div
      role="tablist"
      aria-label="Workspace tabs"
      className={cn(
        "flex items-center gap-1 px-4 h-11",
        "border-b border-[var(--border-subtle)]",
        "bg-[var(--surface-1)]",
        className,
      )}
    >
      {tabs.map((tab, index) => (
        <button
          key={tab.key}
          role="tab"
          type="button"
          aria-selected={activeTab === tab.key}
          aria-disabled={tab.disabled}
          tabIndex={activeTab === tab.key ? 0 : -1}
          onClick={() => !tab.disabled && onTabChange(tab.key)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          className={cn(
            "relative flex items-center gap-2 px-3 py-2",
            "text-[var(--text-sm)] font-[var(--font-medium)]",
            "rounded-[var(--radius-md)]",
            "transition-colors duration-[var(--duration-fast)]",
            "focus-visible:outline-none focus-visible:ring-[var(--ring-width)]",
            "focus-visible:ring-[var(--ring-color)]",
            "min-h-[36px]",
            activeTab === tab.key
              ? "text-[var(--text-primary)]"
              : "text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]",
            tab.disabled && "opacity-50 cursor-not-allowed",
          )}
        >
          {tab.icon && (
            <span className="w-4 h-4 flex-shrink-0">{tab.icon}</span>
          )}
          <span className="whitespace-nowrap">{tab.label}</span>

          {/* Animated active indicator */}
          {activeTab === tab.key && (
            <motion.div
              layoutId="workspace-tab-indicator"
              className="absolute bottom-0 left-2 right-2 h-0.5 bg-[var(--brand-primary)] rounded-full"
              transition={layoutTransition}
            />
          )}
        </button>
      ))}
    </div>
  );
}
