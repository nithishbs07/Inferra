import {
  EXTENSION_API_VERSION,
  PLUGIN_PERMISSIONS,
  type PluginManifest,
} from "./contracts";

const ID = /^[a-z][a-z0-9]*(?:[.-][a-z0-9]+)+$/;
const SEMVER = /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/;

export function validateManifest(manifest: PluginManifest) {
  if (!manifest || !ID.test(manifest.id))
    throw new Error("Plugin manifest id must be a stable dotted identifier");
  if (!manifest.name?.trim())
    throw new Error(`Plugin ${manifest.id} requires a name`);
  if (!SEMVER.test(manifest.version))
    throw new Error(
      `Plugin ${manifest.id} version must use Semantic Versioning`,
    );
  if (manifest.apiVersion !== EXTENSION_API_VERSION)
    throw new Error(
      `Plugin ${manifest.id} targets unsupported Extension API ${manifest.apiVersion}`,
    );
  if (!Array.isArray(manifest.permissions))
    throw new Error(`Plugin ${manifest.id} must declare permissions`);
  if (new Set(manifest.permissions).size !== manifest.permissions.length)
    throw new Error(`Plugin ${manifest.id} declares duplicate permissions`);
  if (
    manifest.permissions.some(
      (permission) => !PLUGIN_PERMISSIONS.includes(permission),
    )
  )
    throw new Error(`Plugin ${manifest.id} declares an unknown permission`);
}
