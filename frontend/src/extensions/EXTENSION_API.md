# OpenHands Next Extension API 1.0.0

This document is the canonical public contract for the frontend Extension API. It is intentionally small and versioned independently from the OpenHands Next application.

## Public API inventory

Plugin authors may import only from `#/extensions/sdk`:

- `PLUGIN_SDK_VERSION`
- `definePlugin()`
- `PluginDefinition`
- `PluginContext`
- `PluginLogger`

The manifest types and extension-point names are part of the contract. The loader and registry are host-owned implementation details and are not plugin imports.

## Manifest

Every plugin supplies a manifest through `definePlugin()`.

| Field         | Required | Rules                                                          |
| ------------- | -------- | -------------------------------------------------------------- |
| `id`          | Yes      | Unique, stable plugin identifier.                              |
| `name`        | Yes      | Human-readable name.                                           |
| `version`     | Yes      | Plugin Semantic Version.                                       |
| `apiVersion`  | Yes      | Target Extension API version, currently `1.0.0`.               |
| `permissions` | Yes      | Unique declared permissions. Unknown permissions are rejected. |
| `author`      | No       | Plugin author or organization.                                 |
| `description` | No       | Short user-facing description.                                 |
| `contributes` | No       | Declarative summary of intended contribution types.            |

Malformed manifests, duplicate plugin IDs, duplicate permissions, and unsupported API versions are rejected before activation.

## Permissions and extension points

Extension API 1.0 defines these permission names and their associated contribution surfaces:

| Permission          | Grants                        |
| ------------------- | ----------------------------- |
| `commands`          | Command Palette commands.     |
| `workspace.widgets` | Workspace dashboard widgets.  |
| `sidebar`           | Sidebar items.                |
| `toolbar`           | Conversation toolbar actions. |
| `statusbar`         | Status-bar items.             |
| `settings`          | Settings pages.               |
| `notifications`     | Host notification requests.   |
| `projects`          | Project dashboard widgets.    |
| `inspector`         | Inspector panels.             |

The corresponding extension points are command, sidebar, widget, inspector, settings, quick-action, conversation-toolbar, status-bar, context-menu, and project-dashboard. The host validates that a plugin holds the permission required for a contribution before registration.

## Plugin context

`PluginContext` is capability-scoped. It exposes commands, navigation, workspace registration, notifications, theme, settings, logger, and the SDK version. It must never expose internal React state, stores, API clients, authentication data, or agent/runtime controls.

## Lifecycle and error handling

1. The host validates the manifest and API version.
2. The host creates a permission-scoped context.
3. `activate(context)` registers contributions and may return a disposer.
4. On unload, the host invokes the disposer and removes all contributions owned by the plugin.

Duplicate contribution IDs and registrations outside granted permissions are rejected with actionable errors. A plugin activation failure is isolated: it must not prevent other plugins from loading. Registry cleanup is always performed on unload.

## Compatibility and versioning

The Extension API follows Semantic Versioning independently of the application UI:

- `1.x`: backwards-compatible additions and fixes.
- `2.0`: breaking contract changes only.
- Patch releases: clarifications and bug fixes without contract changes.

Deprecated APIs remain available throughout the current major version, are documented with a replacement and migration path, and are removed only in the next major version.

## Public versus internal modules

Public: `#/extensions/sdk` and the manifest/extension-point contract documented here.

Internal host modules: `registry.ts`, `loader.ts`, plugin discovery, host adapters, React surfaces, application stores, API clients, and first-party plugin implementation. Plugins must not import these files directly.

## Security model

The host validates manifest shape, permissions, contribution IDs, and API version before activation. Capability gating prevents ungranted contribution registration. Plugins have no direct access to internal state or backend APIs through this contract. Failures are isolated to the plugin lifecycle boundary.

## Non-goals for 1.0

Extension API 1.0 does not provide a marketplace, remote plugin installation, network permissions, backend extensions, arbitrary runtime code loading, third-party sandboxing, or direct access to agent execution and memory.
