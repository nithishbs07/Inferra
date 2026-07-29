#!/usr/bin/env node
import { readFileSync } from "node:fs";

const apiDocument = readFileSync(new URL("../src/extensions/EXTENSION_API.md", import.meta.url), "utf8");
const sdk = readFileSync(new URL("../src/extensions/sdk.ts", import.meta.url), "utf8");
const contracts = readFileSync(new URL("../src/extensions/contracts.tsx", import.meta.url), "utf8");

const requiredSdkExports = ["PLUGIN_SDK_VERSION", "PluginContext", "PluginLogger", "PluginDefinition", "definePlugin"];
for (const name of requiredSdkExports) {
  if (!sdk.includes(name)) throw new Error(`Extension SDK export is missing: ${name}`);
  if (!apiDocument.includes(name)) throw new Error(`Extension API documentation is missing: ${name}`);
}
if (!contracts.includes('EXTENSION_API_VERSION = "1.0.0"')) throw new Error("Extension API version must remain 1.0.0");
if (!apiDocument.includes("Extension API 1.0.0")) throw new Error("Extension API documentation version mismatch");
console.log("Extension API contract validation passed.");
