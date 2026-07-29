/**
 * Inferra — Status Bar
 *
 * Bottom status bar showing contextual information about the current
 * workspace state: agent status, connection status, model info, git branch.
 *
 * Height: 32px (var(--status-bar-height))
 *
 * Sections:
 * - Left: Agent state indicator + status text
 * - Center: Optional breadcrumb or info
 * - Right: Model name, connection status, git branch
 *
 * Props:
 * - `leftContent` — Left section content
 * - `centerContent` — Center section content (optional)
 * - `rightContent` — Right section content
 *
 * Usage:
 * ```tsx
 * <StatusBar
 *   leftContent={<AgentStatusIndicator state="running" />}
 *   rightContent={<span>GPT-4o · Connected · main</span>}
 * />
 * ```
 */

import React from "react";
import { cn } from "#/lib/utils";

interface StatusBarProps {
  leftContent?: React.ReactNode;
  centerContent?: React.ReactNode;
  rightContent?: React.ReactNode;
  className?: string;
}

export function StatusBar({
  leftContent,
  centerContent,
  rightContent,
  className,
}: StatusBarProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between w-full h-full px-3",
        "text-[var(--text-2xs)] text-[var(--text-tertiary)]",
        "font-[var(--font-mono)]",
        className,
      )}
      role="status"
      aria-label="Workspace status"
    >
      {/* Left section */}
      <div className="flex items-center gap-2 min-w-0 flex-shrink-0">
        {leftContent}
      </div>

      {/* Center section */}
      {centerContent && (
        <div className="flex items-center gap-2 min-w-0 flex-1 justify-center">
          {centerContent}
        </div>
      )}

      {/* Right section */}
      <div className="flex items-center gap-3 min-w-0 flex-shrink-0">
        {rightContent}
      </div>
    </div>
  );
}

// ─── Status Indicator Dot ──────────────────────────────────

interface StatusDotProps {
  status: "connected" | "connecting" | "disconnected" | "error";
  label?: string;
  className?: string;
}

export function StatusDot({ status, label, className }: StatusDotProps) {
  const colors = {
    connected: "bg-[var(--success)]",
    connecting: "bg-[var(--warning)] animate-pulse",
    disconnected: "bg-[var(--text-tertiary)]",
    error: "bg-[var(--error)]",
  };

  return (
    <span className={cn("flex items-center gap-1.5", className)}>
      <span
        className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0", colors[status])}
        aria-hidden="true"
      />
      {label && <span>{label}</span>}
    </span>
  );
}
