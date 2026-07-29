import { definePlugin } from "./sdk";
import { EXTENSION_API_VERSION, type PluginPermission } from "./contracts";

const manifest = (
  id: string,
  name: string,
  description: string,
  permissions: PluginPermission[],
) => ({
  id,
  name,
  description,
  version: "1.0.0",
  apiVersion: EXTENSION_API_VERSION,
  permissions,
});

export const workspaceInsightsPlugin = definePlugin({
  manifest: manifest(
    "openhands.workspace-insights",
    "Workspace Insights",
    "Existing workspace metrics in extension surfaces.",
    ["commands", "workspace.widgets", "inspector"],
  ),
  activate: (context) => {
    const removeCommand = context.commands.register(
      "workspace-insights",
      "Open Workspace Insights",
      () => context.navigation.go("/"),
    );
    const removeWidget = context.workspace.register(
      "widget",
      "workspace-insights-widget",
      "Workspace Insights",
    );
    const removeInspector = context.workspace.register(
      "inspector",
      "workspace-insights-inspector",
      "Workspace metrics",
    );
    return () => {
      removeCommand();
      removeWidget();
      removeInspector();
    };
  },
});

export const gitProductivityPlugin = definePlugin({
  manifest: manifest(
    "openhands.git-productivity",
    "Git Productivity",
    "Existing Git workspace actions.",
    ["sidebar", "toolbar", "projects"],
  ),
  activate: (context) => {
    const sidebar = context.workspace.register(
      "sidebar",
      "git-productivity-sidebar",
      "Git Productivity",
    );
    const toolbar = context.workspace.register(
      "conversation-toolbar",
      "git-productivity-toolbar",
      "Git actions",
    );
    const project = context.workspace.register(
      "project-dashboard",
      "git-productivity-project",
      "Git project activity",
    );
    return () => {
      sidebar();
      toolbar();
      project();
    };
  },
});

export const aiUtilitiesPlugin = definePlugin({
  manifest: manifest(
    "openhands.ai-utilities",
    "AI Utilities",
    "Existing conversation productivity actions.",
    ["workspace.widgets", "toolbar", "statusbar"],
  ),
  activate: (context) => {
    const quick = context.workspace.register(
      "quick-action",
      "ai-utilities-quick",
      "New conversation",
      () => context.navigation.go("/"),
    );
    const status = context.workspace.register(
      "status-bar",
      "ai-utilities-status",
      "AI status",
    );
    const toolbar = context.workspace.register(
      "conversation-toolbar",
      "ai-utilities-toolbar",
      "Conversation utilities",
    );
    return () => {
      quick();
      status();
      toolbar();
    };
  },
});

export const developerToolsPlugin = definePlugin({
  manifest: manifest(
    "openhands.developer-tools",
    "Developer Tools",
    "Extension diagnostics for development builds.",
    ["workspace.widgets"],
  ),
  activate: (context) => {
    if (import.meta.env.PROD) return undefined;
    context.logger.debug("Developer Tools extension activated", {
      apiVersion: context.version,
    });
    return context.workspace.register(
      "widget",
      "developer-tools-diagnostics",
      "Extension diagnostics",
    );
  },
});

export const firstPartyPlugins = [
  workspaceInsightsPlugin,
  gitProductivityPlugin,
  aiUtilitiesPlugin,
  developerToolsPlugin,
];
