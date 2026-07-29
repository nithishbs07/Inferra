/**
 * Inferra — Layout Barrel Export
 *
 * Re-exports all layout components for clean imports:
 * ```tsx
 * import { AppShell, Sidebar, WorkspaceTabs, StatusBar } from "#/components/layout";
 * ```
 */

export { AppShell } from "./app-shell";
export {
  Sidebar,
  SidebarItem,
  SidebarSection,
  SidebarSeparator,
  useSidebar,
} from "./sidebar/sidebar";
export { WorkspaceTabs, type WorkspaceTab } from "./workspace-tabs";
export { StatusBar, StatusDot } from "./status-bar";
