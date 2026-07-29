import type { ExtensionPoint, PluginManifest } from "./contracts";

export const PLUGIN_SDK_VERSION = "1.0.0";

export interface PluginLogger {
  debug(message: string, data?: unknown): void;
  warn(message: string, data?: unknown): void;
  error(message: string, error?: unknown): void;
}
export interface PluginContext {
  version: typeof PLUGIN_SDK_VERSION;
  commands: {
    register(id: string, title: string, action: () => void): () => void;
  };
  navigation: { go(to: string): void };
  workspace: {
    register(
      point: ExtensionPoint,
      id: string,
      title: string,
      action?: () => void,
    ): () => void;
  };
  notifications: { info(message: string): void; error(message: string): void };
  theme: { mode(): "light" | "dark" | "system" };
  settings: {
    get<T>(key: string): T | undefined;
    set<T>(key: string, value: T): void;
  };
  logger: PluginLogger;
}

export interface PluginDefinition {
  manifest: PluginManifest;
  activate(context: PluginContext): void | (() => void);
}
export const definePlugin = (plugin: PluginDefinition) => plugin;
