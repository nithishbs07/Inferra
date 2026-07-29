import { describe, expect, it, vi } from "vitest";
import {
  EXTENSION_API_VERSION,
  type FrontendPlugin,
  type PluginManifest,
} from "./contracts";
import { PluginLoader } from "./loader";
import { ExtensionRegistry } from "./registry";
import { validateManifest } from "./validation";

const manifest = (overrides: Partial<PluginManifest> = {}): PluginManifest => ({
  id: "example.plugin",
  name: "Example Plugin",
  version: "1.0.0",
  apiVersion: EXTENSION_API_VERSION,
  permissions: ["commands"],
  ...overrides,
});

const plugin = (overrides: Partial<FrontendPlugin> = {}): FrontendPlugin => ({
  manifest: manifest(),
  activate: (api) =>
    api.register({ id: "example.command", point: "command", title: "Example" }),
  ...overrides,
});

describe("Extension API runtime", () => {
  it("accepts a valid 1.0 manifest and rejects invalid fields", () => {
    expect(() => validateManifest(manifest())).not.toThrow();
    expect(() => validateManifest(manifest({ id: "invalid" }))).toThrow(
      /dotted identifier/,
    );
    expect(() => validateManifest(manifest({ version: "1" }))).toThrow(
      /Semantic Versioning/,
    );
    expect(() =>
      validateManifest(manifest({ apiVersion: "2.0.0" as "1.0.0" })),
    ).toThrow(/unsupported/);
    expect(() =>
      validateManifest(manifest({ permissions: ["commands", "commands"] })),
    ).toThrow(/duplicate/);
    expect(() =>
      validateManifest(manifest({ permissions: ["unknown" as "commands"] })),
    ).toThrow(/unknown/);
  });

  it("stores ownership and rejects duplicate contribution IDs", () => {
    const registry = new ExtensionRegistry();
    registry.registerForPlugin("example.plugin", {
      id: "one",
      point: "command",
      title: "One",
    });
    expect(registry.list()).toMatchObject([
      { id: "one", pluginId: "example.plugin" },
    ]);
    expect(() =>
      registry.registerForPlugin("other.plugin", {
        id: "one",
        point: "command",
        title: "Duplicate",
      }),
    ).toThrow(/already exists/);
    registry.clearPlugin("example.plugin");
    expect(registry.list()).toHaveLength(0);
  });

  it("loads, unloads, and reloads a plugin without stale registry entries", () => {
    const registry = new ExtensionRegistry();
    const loader = new PluginLoader(registry);
    const target = plugin();
    loader.load(target);
    expect(registry.list()).toHaveLength(1);
    expect(() => loader.load(target)).toThrow(/already loaded/);
    loader.unload(target.manifest.id);
    expect(registry.list()).toHaveLength(0);
    loader.reload(target);
    expect(registry.list()).toHaveLength(1);
  });

  it("enforces contribution permissions", () => {
    const registry = new ExtensionRegistry();
    const loader = new PluginLoader(registry);
    const restricted = plugin({
      manifest: manifest({ permissions: ["sidebar"] }),
      activate: (api) =>
        api.register({ id: "blocked", point: "command", title: "Blocked" }),
    });
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    loader.load(restricted);
    expect(registry.list()).toHaveLength(0);
    expect(error).toHaveBeenCalled();
    error.mockRestore();
  });

  it("isolates an activation failure so later plugins load", () => {
    const registry = new ExtensionRegistry();
    const loader = new PluginLoader(registry);
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    loader.load(
      plugin({
        manifest: manifest({ id: "example.failing" }),
        activate: () => {
          throw new Error("boom");
        },
      }),
    );
    loader.load(
      plugin({
        manifest: manifest({ id: "example.working" }),
        activate: (api) =>
          api.register({ id: "working", point: "command", title: "Working" }),
      }),
    );
    expect(registry.list()).toHaveLength(1);
    expect(registry.list()[0].id).toBe("working");
    error.mockRestore();
  });
});
