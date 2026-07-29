import type React from "react";

/** Stable, frontend-only contract for Inferra extensions. */
export const EXTENSION_API_VERSION = "1.0.0" as const;

export type ExtensionPoint =
  | "command"
  | "sidebar"
  | "widget"
  | "inspector"
  | "settings"
  | "quick-action"
  | "conversation-toolbar"
  | "status-bar"
  | "context-menu"
  | "project-dashboard";

export const PLUGIN_PERMISSIONS = [
  "commands",
  "workspace.widgets",
  "sidebar",
  "toolbar",
  "statusbar",
  "settings",
  "notifications",
  "projects",
  "inspector",
] as const;
export type PluginPermission = (typeof PLUGIN_PERMISSIONS)[number];

export interface PluginManifest {
  id: string;
  name: string;
  version: string;
  apiVersion: typeof EXTENSION_API_VERSION;
  permissions: PluginPermission[];
  author?: string;
  description?: string;
  contributes?: Partial<Record<ExtensionPoint, boolean>>;
}

export interface ExtensionContribution {
  id: string;
  pluginId: string;
  point: ExtensionPoint;
  title: string;
  component?: React.ComponentType;
  action?: () => void;
  order?: number;
}

export interface FrontendPlugin {
  manifest: PluginManifest;
  activate(api: ExtensionRegistryApi): void | (() => void);
}

export interface ExtensionRegistryApi {
  register(contribution: Omit<ExtensionContribution, "pluginId">): () => void;
}
