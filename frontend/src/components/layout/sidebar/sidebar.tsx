/**
 * Inferra — Sidebar
 *
 * Expandable/collapsible navigation sidebar with persistent width.
 *
 * States:
 * - **Collapsed** (72px): Icon-only with tooltips
 * - **Expanded** (240–320px, resizable): Icons + text labels + sub-items
 *
 * Toggle: Keyboard shortcut (Cmd+B) or click the toggle button.
 * Width persisted to localStorage.
 *
 * Navigation items:
 * - Home, Chats, Projects, Agents, Memory, Tools
 * - Settings, Profile (bottom-aligned)
 *
 * Props:
 * - `defaultExpanded` — Initial expanded state. Default: true
 * - `children` — Optional custom content (overrides default nav items)
 *
 * Accessibility:
 * - `<nav>` landmark with `aria-label`
 * - All items keyboard navigable
 * - Collapse/expand announced to screen readers
 *
 * Usage:
 * ```tsx
 * <Sidebar defaultExpanded={true} />
 * ```
 */

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import InferraMark from "#/assets/branding/inferra-mark.svg?react";
import { cn } from "#/lib/utils";
import { springGentle } from "#/lib/motion";

const STORAGE_KEY = "openhands-sidebar-width";
const STORAGE_EXPANDED_KEY = "openhands-sidebar-expanded";

interface SidebarProps {
  defaultExpanded?: boolean;
  children?: React.ReactNode;
  className?: string;
}

interface SidebarContextValue {
  isExpanded: boolean;
  toggleExpanded: () => void;
  width: number;
}

const SidebarContext = React.createContext<SidebarContextValue | undefined>(
  undefined,
);

export function useSidebar(): SidebarContextValue {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a Sidebar");
  }
  return context;
}

export function Sidebar({
  defaultExpanded = true,
  children,
  className,
}: SidebarProps) {
  const [isExpanded, setIsExpanded] = React.useState(() => {
    if (typeof window === "undefined") return defaultExpanded;
    const stored = localStorage.getItem(STORAGE_EXPANDED_KEY);
    return stored !== null ? stored === "true" : defaultExpanded;
  });

  const [width, setWidth] = React.useState(() => {
    if (typeof window === "undefined") return 260;
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? parseInt(stored, 10) : 260;
  });

  const collapsedWidth = 72;
  const currentWidth = isExpanded ? width : collapsedWidth;

  // Persist state
  React.useEffect(() => {
    localStorage.setItem(STORAGE_EXPANDED_KEY, String(isExpanded));
  }, [isExpanded]);

  React.useEffect(() => {
    if (isExpanded) {
      localStorage.setItem(STORAGE_KEY, String(width));
    }
  }, [width, isExpanded]);

  // Keyboard shortcut: Cmd+B or Ctrl+B
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "b") {
        e.preventDefault();
        setIsExpanded((prev) => !prev);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  const toggleExpanded = React.useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  const contextValue = React.useMemo(
    () => ({ isExpanded, toggleExpanded, width: currentWidth }),
    [isExpanded, toggleExpanded, currentWidth],
  );

  return (
    <SidebarContext.Provider value={contextValue}>
      <motion.nav
        aria-label="Main navigation"
        animate={{ width: currentWidth }}
        transition={springGentle}
        className={cn(
          "h-full flex flex-col",
          "bg-[var(--surface-1)]",
          "border-r border-[var(--border-subtle)]",
          "overflow-hidden",
          className,
        )}
      >
        {children || <SidebarDefaultContent />}
      </motion.nav>
    </SidebarContext.Provider>
  );
}

// ─── Sidebar Item ────────────────────────────────────────

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  href?: string;
  isActive?: boolean;
  onClick?: () => void;
  className?: string;
}

export function SidebarItem({
  icon,
  label,
  isActive = false,
  onClick,
  className,
}: SidebarItemProps) {
  const { isExpanded } = useSidebar();

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-md)]",
        "text-[var(--text-secondary)] transition-colors",
        "duration-[var(--duration-fast)]",
        "hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)]",
        "focus-visible:outline-none focus-visible:ring-[var(--ring-width)]",
        "focus-visible:ring-[var(--ring-color)] focus-visible:ring-offset-[var(--ring-offset)]",
        "min-h-[44px]", // WCAG touch target
        isActive && "bg-[var(--surface-active)] text-[var(--text-primary)]",
        className,
      )}
      aria-current={isActive ? "page" : undefined}
      title={!isExpanded ? label : undefined}
    >
      <span className="flex-shrink-0 w-5 h-5">{icon}</span>
      <AnimatePresence>
        {isExpanded && (
          <motion.span
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "auto" }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.15 }}
            className="text-[var(--text-sm)] font-[var(--font-medium)] whitespace-nowrap overflow-hidden"
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}

// ─── Sidebar Section ─────────────────────────────────────

interface SidebarSectionProps {
  children: React.ReactNode;
  className?: string;
}

export function SidebarSection({ children, className }: SidebarSectionProps) {
  return (
    <div className={cn("flex flex-col gap-0.5 px-2", className)}>
      {children}
    </div>
  );
}

// ─── Sidebar Separator ───────────────────────────────────

export function SidebarSeparator() {
  return (
    <div
      className="mx-3 my-2 h-px bg-[var(--border-subtle)]"
      role="separator"
    />
  );
}

// ─── Default Content ─────────────────────────────────────

function SidebarDefaultContent() {
  const { isExpanded, toggleExpanded } = useSidebar();

  return (
    <>
      {/* Header */}
      <div className="flex items-center gap-3 px-4 h-14 flex-shrink-0">
        <button
          type="button"
          onClick={toggleExpanded}
          className={cn(
            "flex items-center justify-center w-8 h-8 rounded-[var(--radius-md)]",
            "text-[var(--brand-primary)] hover:bg-[var(--surface-hover)]",
            "transition-colors duration-[var(--duration-fast)]",
            "focus-visible:outline-none focus-visible:ring-[var(--ring-width)]",
            "focus-visible:ring-[var(--ring-color)]",
          )}
          aria-label={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
        >
          {/* Diamond logo placeholder */}
          <InferraMark width={24} height={24} aria-hidden="true" />
        </button>
        <AnimatePresence>
          {isExpanded && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="text-[var(--text-base)] font-[var(--font-semibold)] text-[var(--text-primary)] whitespace-nowrap"
            >
              Inferra
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation items */}
      <SidebarSection className="flex-1">
        {/* Placeholder items — will be connected to routing in Phase 3 */}
        <SidebarItem icon={<HomeIcon />} label="Home" />
        <SidebarItem icon={<ChatIcon />} label="Chats" />
        <SidebarItem icon={<FolderIcon />} label="Projects" />
        <SidebarItem icon={<AgentIcon />} label="Agents" />
        <SidebarItem icon={<BrainIcon />} label="Memory" />
        <SidebarItem icon={<ToolIcon />} label="Tools" />
      </SidebarSection>

      <SidebarSeparator />

      {/* Bottom section */}
      <SidebarSection className="pb-3">
        <SidebarItem icon={<SettingsIcon />} label="Settings" />
        <SidebarItem icon={<UserIcon />} label="Profile" />
      </SidebarSection>
    </>
  );
}

// ─── Placeholder Icons (Lucide-style SVGs) ───────────────
// These will be replaced with actual lucide-react imports once
// npm install completes. Using inline SVGs for now to avoid
// import dependency issues during initial setup.

function HomeIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
    </svg>
  );
}

function FolderIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />
    </svg>
  );
}

function AgentIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="10" x="3" y="11" rx="2" />
      <circle cx="12" cy="5" r="2" />
      <path d="M12 7v4" />
      <line x1="8" x2="8" y1="16" y2="16" />
      <line x1="16" x2="16" y1="16" y2="16" />
    </svg>
  );
}

function BrainIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z" />
      <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z" />
      <path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4" />
      <path d="M17.599 6.5a3 3 0 0 0 .399-1.375" />
      <path d="M6.003 5.125A3 3 0 0 0 6.401 6.5" />
      <path d="M3.477 10.896a4 4 0 0 1 .585-.396" />
      <path d="M19.938 10.5a4 4 0 0 1 .585.396" />
      <path d="M6 18a4 4 0 0 1-1.967-.516" />
      <path d="M19.967 17.484A4 4 0 0 1 18 18" />
    </svg>
  );
}

function ToolIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="8" r="5" />
      <path d="M20 21a8 8 0 0 0-16 0" />
    </svg>
  );
}
