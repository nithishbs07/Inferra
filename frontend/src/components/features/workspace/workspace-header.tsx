/**
 * Inferra — Workspace Header
 *
 * Adds workspace tabs above the content area when inside a conversation.
 * Shows tabs for: Conversation, Files, Browser, Terminal, Artifacts, Inspector
 *
 * On the home page (pathname === "/"), this renders nothing — the dashboard
 * fills the full workspace.
 *
 * Supports Cmd+1–7 keyboard shortcuts.
 *
 * Phase 3 upgrade: Artifacts and Inspector tabs now render real panels.
 * Files tab connects to the existing file explorer.
 *
 * @module workspace-header
 */

import React from "react";
import { useLocation } from "react-router";
import {
  MessageSquare,
  FolderOpen,
  Globe,
  Terminal,
  Package,
  PanelRight,
  Activity,
} from "lucide-react";
import {
  WorkspaceTabs,
  type WorkspaceTab,
} from "#/components/layout/workspace-tabs";
import { ArtifactPanel } from "#/components/features/conversation/artifact-panel";
import { InspectorPanel } from "#/components/features/conversation/inspector-panel";

const WORKSPACE_TABS: WorkspaceTab[] = [
  {
    key: "conversation",
    label: "Conversation",
    icon: <MessageSquare size={16} />,
  },
  { key: "files", label: "Files", icon: <FolderOpen size={16} /> },
  {
    key: "browser",
    label: "Browser",
    icon: <Globe size={16} />,
    disabled: true,
  },
  {
    key: "terminal",
    label: "Terminal",
    icon: <Terminal size={16} />,
    disabled: true,
  },
  { key: "artifacts", label: "Artifacts", icon: <Package size={16} /> },
  { key: "inspector", label: "Inspector", icon: <PanelRight size={16} /> },
  {
    key: "activity",
    label: "Activity",
    icon: <Activity size={16} />,
    disabled: true,
  },
];

interface WorkspaceHeaderProps {
  children: React.ReactNode;
}

export function WorkspaceHeader({ children }: WorkspaceHeaderProps) {
  const { pathname } = useLocation();
  const [activeTab, setActiveTab] = React.useState("conversation");

  // Only show tabs when inside a conversation
  const isInConversation = pathname.startsWith("/conversations/");

  // Cmd+1–7 keyboard shortcuts
  React.useEffect(() => {
    if (!isInConversation) return;

    const handler = (e: KeyboardEvent) => {
      if (!(e.metaKey || e.ctrlKey)) return;

      const num = parseInt(e.key, 10);
      if (num >= 1 && num <= 7) {
        e.preventDefault();
        const tab = WORKSPACE_TABS[num - 1];
        if (tab && !tab.disabled) {
          setActiveTab(tab.key);
        }
      }
    };

    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isInConversation]);

  if (!isInConversation) {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col h-full">
      <WorkspaceTabs
        tabs={WORKSPACE_TABS}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      <div className="flex-1 min-h-0 overflow-hidden">
        {activeTab === "conversation" && children}

        {activeTab === "artifacts" && <ArtifactPanel className="h-full" />}

        {activeTab === "inspector" && (
          <InspectorPanel className="h-full w-full max-w-none" />
        )}

        {activeTab === "files" && (
          /* Files tab renders the conversation children in a file-focused mode.
             The existing file explorer from the conversation layout will be
             shown here once the ConversationMain component is refactored. */
          <div className="flex items-center justify-center h-full text-[var(--text-tertiary)]">
            <div className="text-center space-y-2">
              <FolderOpen size={32} className="mx-auto opacity-40" />
              <p className="text-sm font-medium">File Explorer</p>
              <p className="text-xs">Connect to conversation file system</p>
            </div>
          </div>
        )}

        {/* Disabled tabs show placeholder */}
        {WORKSPACE_TABS.find((t) => t.key === activeTab)?.disabled && (
          <div className="flex items-center justify-center h-full text-[var(--text-tertiary)]">
            <div className="text-center space-y-2">
              <p className="text-sm font-medium">
                {WORKSPACE_TABS.find((t) => t.key === activeTab)?.label}
              </p>
              <p className="text-xs">Coming soon</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
