# OpenHands Next Plugin SDK

The authoritative public contract is [EXTENSION_API.md](./EXTENSION_API.md). Plugin authors must import only from `#/extensions/sdk`; registry, loader, host adapters, and first-party implementations are internal.

The Extension API is versioned independently at `1.0.0`. Plugins import only from `#/extensions/sdk` and use `definePlugin()`.

```ts
export default definePlugin({
  manifest: {
    id: "example.hello",
    name: "Hello",
    version: "1.0.0",
    apiVersion: "1.0.0",
  },
  activate(context) {
    return context.commands.register("hello", "Say hello", () =>
      context.notifications.info("Hello"),
    );
  },
});
```

Use `context.workspace.register()` for the documented extension points. Activation must return a disposer for all registered contributions. Do not import core state, API clients, or UI internals.
