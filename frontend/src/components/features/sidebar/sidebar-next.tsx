/**
 * Inferra — Premium Sidebar (Integrated)
 *
 * Replaces the legacy sidebar with the new design system while
 * preserving ALL existing business logic:
 * - Settings modal auto-open for OSS first-time users
 * - Conversation panel toggle
 * - User context menu (org switching, invitations)
 * - Feature flag checks (automations)
 * - Email verification guards
 *
 * Architecture:
 * - Uses Phase 1 `Sidebar` layout component for expand/collapse
 * - Wraps existing `UserActions` and `ConversationPanel` components
 * - Active route highlighting via `useLocation`
 * - Tooltip labels when collapsed
 *
 * @module sidebar-next
 */

import React from "react";
import { useLocation, useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  MessageSquare,
  FolderOpen,
  Bot,
  Brain,
  Wrench,
  Settings,
  Plus,
} from "lucide-react";
import { cn } from "#/lib/utils";
import InferraMark from "#/assets/branding/inferra-mark.svg?react";
import {
  Sidebar,
  SidebarItem,
  SidebarSection,
  SidebarSeparator,
  useSidebar,
} from "#/components/layout/sidebar/sidebar";

// Preserve existing business logic imports
import { useGitUser } from "#/hooks/query/use-git-user";
import { useSettings } from "#/hooks/query/use-settings";
import { useConfig } from "#/hooks/query/use-config";
import { UserActions } from "#/components/features/sidebar/user-actions";
import { ConversationPanel } from "#/components/features/conversation-panel/conversation-panel";
import { ConversationPanelWrapper } from "#/components/features/conversation-panel/conversation-panel-wrapper";
import { SettingsModal } from "#/components/shared/modals/settings/settings-modal";
import { displayErrorToast } from "#/utils/custom-toast-handlers";

interface SidebarNextProps {
  className?: string;
}

export function SidebarNext({ className }: SidebarNextProps) {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const user = useGitUser();
  const { data: config } = useConfig();
  const {
    data: settings,
    error: settingsError,
    isError: settingsIsError,
    isFetching: isFetchingSettings,
  } = useSettings();

  // ─── Preserved Business Logic ────────────────────────
  const [settingsModalIsOpen, setSettingsModalIsOpen] = React.useState(false);
  const [conversationPanelIsOpen, setConversationPanelIsOpen] =
    React.useState(false);

  React.useEffect(() => {
    if (pathname === "/settings") {
      setSettingsModalIsOpen(false);
    } else if (
      !isFetchingSettings &&
      settingsIsError &&
      settingsError?.status !== 404
    ) {
      displayErrorToast(
        "Something went wrong while fetching settings. Please reload the page.",
      );
    } else if (
      config?.app_mode === "oss" &&
      settingsError?.status === 404 &&
      !config?.feature_flags?.hide_llm_settings
    ) {
      setSettingsModalIsOpen(true);
    }
  }, [
    pathname,
    isFetchingSettings,
    settingsIsError,
    settingsError,
    config?.app_mode,
    config?.feature_flags?.hide_llm_settings,
  ]);

  React.useEffect(() => {
    const openConversationPanel = () => setConversationPanelIsOpen(true);
    window.addEventListener("open-conversation-panel", openConversationPanel);
    return () =>
      window.removeEventListener(
        "open-conversation-panel",
        openConversationPanel,
      );
  }, []);

  // ─── Navigation Items ────────────────────────────────
  const navItems = React.useMemo(
    () => [
      { key: "/", icon: <Home size={20} />, label: "Home" },
      {
        key: "conversations",
        icon: <MessageSquare size={20} />,
        label: "Chats",
        action: "panel",
      },
      {
        key: "new",
        icon: <Plus size={20} />,
        label: "New Project",
        action: "new",
      },
      {
        key: "/projects",
        icon: <FolderOpen size={20} />,
        label: "Projects",
      },
      {
        key: "/settings/agent",
        icon: <Bot size={20} />,
        label: "Agents",
      },
      {
        key: "/settings/condenser",
        icon: <Brain size={20} />,
        label: "Memory",
      },
      {
        key: "/settings/mcp",
        icon: <Wrench size={20} />,
        label: "Tools",
      },
    ],
    [],
  );

  const bottomItems = React.useMemo(
    () => [
      { key: "/settings", icon: <Settings size={20} />, label: "Settings" },
    ],
    [],
  );

  const isDisabled = settings?.email_verified === false;

  const handleNavClick = React.useCallback(
    (key: string, action?: string) => {
      if (isDisabled) return;

      if (action === "panel") {
        setConversationPanelIsOpen((prev) => !prev);
        return;
      }
      if (action === "new") {
        navigate("/");
        return;
      }
      if (key.startsWith("/")) {
        navigate(key);
      }
    },
    [navigate, isDisabled],
  );

  const isActive = React.useCallback(
    (key: string) => {
      if (key === "/") return pathname === "/";
      if (key === "conversations") return conversationPanelIsOpen;
      if (key.startsWith("/")) return pathname.startsWith(key);
      return pathname.startsWith(`/${key}`);
    },
    [pathname, conversationPanelIsOpen],
  );

  return (
    <>
      <Sidebar defaultExpanded className={className}>
        <SidebarNextContent
          navItems={navItems}
          bottomItems={bottomItems}
          isActive={isActive}
          onNavClick={handleNavClick}
          user={user}
          isDisabled={isDisabled}
        />
      </Sidebar>

      {/* Conversation Panel — slides out from sidebar */}
      {conversationPanelIsOpen && (
        <ConversationPanelWrapper isOpen={conversationPanelIsOpen}>
          <ConversationPanel
            onClose={() => setConversationPanelIsOpen(false)}
          />
        </ConversationPanelWrapper>
      )}

      {/* Settings Modal — preserved existing behavior */}
      {settingsModalIsOpen && (
        <SettingsModal
          settings={settings}
          onClose={() => setSettingsModalIsOpen(false)}
        />
      )}
    </>
  );
}

// ─── Inner Content (separated for useSidebar hook access) ──

interface NavItem {
  key: string;
  icon: React.ReactNode;
  label: string;
  action?: string;
}

interface SidebarNextContentProps {
  navItems: NavItem[];
  bottomItems: NavItem[];
  isActive: (key: string) => boolean;
  onNavClick: (key: string, action?: string) => void;
  user: ReturnType<typeof useGitUser>;
  isDisabled?: boolean;
}

const SidebarNextContent = React.memo(
  ({
    navItems,
    bottomItems,
    isActive,
    onNavClick,
    user,
    isDisabled,
  }: SidebarNextContentProps) => {
    const { isExpanded, toggleExpanded } = useSidebar();

    return (
      <>
        {/* Header */}
        <div className="flex items-center gap-3 px-4 h-14 flex-shrink-0 border-b border-[var(--border-subtle)]">
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
            <InferraMark width={24} height={24} aria-hidden="true" />
          </button>
          <AnimatePresence>
            {isExpanded && (
              <motion.span
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.15 }}
                className="text-base font-semibold text-[var(--text-primary)] whitespace-nowrap tracking-tight"
              >
                Inferra
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Main navigation */}
        <SidebarSection className="flex-1 pt-2">
          {navItems.map((item) => (
            <SidebarItem
              key={item.key}
              icon={item.icon}
              label={item.label}
              isActive={isActive(item.key)}
              onClick={() => onNavClick(item.key, item.action)}
              className={isDisabled ? "opacity-50 pointer-events-none" : ""}
            />
          ))}
        </SidebarSection>

        <SidebarSeparator />

        {/* Bottom section — Settings + User */}
        <SidebarSection className="pb-3">
          {bottomItems.map((item) => (
            <SidebarItem
              key={item.key}
              icon={item.icon}
              label={item.label}
              isActive={isActive(item.key)}
              onClick={() => onNavClick(item.key)}
            />
          ))}

          {/* User avatar — wraps existing UserActions */}
          <div className="px-1 pt-1">
            <UserActions
              user={
                user.data ? { avatar_url: user.data.avatar_url } : undefined
              }
              isLoading={user.isFetching}
            />
          </div>
        </SidebarSection>
      </>
    );
  },
);
