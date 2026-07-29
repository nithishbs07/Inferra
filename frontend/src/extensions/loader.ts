import {
  type ExtensionPoint,
  type FrontendPlugin,
  type PluginPermission,
} from "./contracts";
import { ExtensionRegistry } from "./registry";
import { validateManifest } from "./validation";

export class PluginLoader {
  private readonly disposers = new Map<string, () => void>();

  private readonly loaded = new Set<string>();

  constructor(private readonly registry: ExtensionRegistry) {}

  load(plugin: FrontendPlugin) {
    validateManifest(plugin.manifest);
    if (this.loaded.has(plugin.manifest.id))
      throw new Error(`Plugin ${plugin.manifest.id} is already loaded`);
    try {
      const pluginId = plugin.manifest.id;
      const required: Record<ExtensionPoint, PluginPermission> = {
        command: "commands",
        widget: "workspace.widgets",
        sidebar: "sidebar",
        inspector: "inspector",
        settings: "settings",
        "quick-action": "workspace.widgets",
        "conversation-toolbar": "toolbar",
        "status-bar": "statusbar",
        "context-menu": "workspace.widgets",
        "project-dashboard": "projects",
      };
      const api = {
        register: (
          contribution: Parameters<ExtensionRegistry["register"]>[0],
        ) => {
          if (
            !plugin.manifest.permissions.includes(required[contribution.point])
          )
            throw new Error(
              `Plugin ${pluginId} lacks permission for ${contribution.point}`,
            );
          return this.registry.registerForPlugin(pluginId, contribution);
        },
      };
      this.disposers.set(pluginId, plugin.activate(api) || (() => {}));
      this.loaded.add(pluginId);
    } catch (error) {
      console.error(`Unable to load plugin ${plugin.manifest.id}`, error);
    }
  }

  unload(pluginId: string) {
    this.disposers.get(pluginId)?.();
    this.disposers.delete(pluginId);
    this.registry.clearPlugin(pluginId);
    this.loaded.delete(pluginId);
  }

  reload(plugin: FrontendPlugin) {
    this.unload(plugin.manifest.id);
    this.load(plugin);
  }
}
