import { definePlugin } from "../sdk";

export default definePlugin({
  manifest: {
    id: "example.my-plugin",
    name: "My Plugin",
    version: "1.0.0",
    apiVersion: "1.0.0",
    description: "A starter extension.",
    permissions: ["commands", "notifications"],
  },
  activate(context) {
    return context.commands.register(
      "my-plugin.hello",
      "My Plugin: Hello",
      () => context.notifications.info("Hello from My Plugin"),
    );
  },
});
