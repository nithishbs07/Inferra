import type {
  ExtensionContribution,
  ExtensionPoint,
  ExtensionRegistryApi,
} from "./contracts";

/** A failure-isolated registry; plugins can only add/remove their own contributions. */
export class ExtensionRegistry implements ExtensionRegistryApi {
  private readonly contributions = new Map<string, ExtensionContribution>();

  register(contribution: Omit<ExtensionContribution, "pluginId">): () => void {
    if (!contribution.id || !contribution.title || !contribution.point)
      throw new Error("Contribution requires id, title, and extension point");
    if (this.contributions.has(contribution.id))
      throw new Error(
        `Extension contribution already exists: ${contribution.id}`,
      );
    this.contributions.set(
      contribution.id,
      contribution as ExtensionContribution,
    );
    return () => this.contributions.delete(contribution.id);
  }

  registerForPlugin(
    pluginId: string,
    contribution: Omit<ExtensionContribution, "pluginId">,
  ) {
    return this.register({
      ...contribution,
      pluginId,
    } as ExtensionContribution);
  }

  list(point?: ExtensionPoint) {
    return [...this.contributions.values()]
      .filter((item) => !point || item.point === point)
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  }

  clearPlugin(pluginId: string) {
    [...this.contributions.values()]
      .filter((item) => item.pluginId === pluginId)
      .forEach((item) => this.contributions.delete(item.id));
  }
}
