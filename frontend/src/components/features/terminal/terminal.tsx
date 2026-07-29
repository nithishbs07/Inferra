import { useTranslation } from "react-i18next";
import React from "react";
import { Check, ChevronDown, ChevronUp, Copy, Search } from "lucide-react";
import { useTerminal } from "#/hooks/use-terminal";
import "@xterm/xterm/css/xterm.css";
import { RUNTIME_INACTIVE_STATES } from "#/types/agent-state";
import { cn } from "#/utils/utils";
import { WaitingForRuntimeMessage } from "../chat/waiting-for-runtime-message";
import { useAgentState } from "#/hooks/use-agent-state";
import { I18nKey } from "#/i18n/declaration";
import { useCommandStore } from "#/stores/command-store";

function Terminal() {
  const { t } = useTranslation();
  const { curAgentState, isArchived } = useAgentState();

  // Don't show runtime inactive state for archived conversations
  const isRuntimeInactive =
    !isArchived && RUNTIME_INACTIVE_STATES.includes(curAgentState);

  const ref = useTerminal();
  const commands = useCommandStore((state) => state.commands);
  const [query, setQuery] = React.useState("");
  const [collapsed, setCollapsed] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const matchCount = React.useMemo(
    () =>
      query.trim()
        ? commands.filter((command) =>
            command.content.toLowerCase().includes(query.toLowerCase()),
          ).length
        : commands.length,
    [commands, query],
  );
  const copyOutput = React.useCallback(async () => {
    try {
      await navigator.clipboard.writeText(
        commands.map((command) => command.content).join("\n"),
      );
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard access is optional */
    }
  }, [commands]);

  return (
    <div className="h-full flex flex-col overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--surface-1)]">
      {isArchived && (
        <div className="w-full h-full flex items-center text-center justify-center text-2xl text-tertiary-light pt-16">
          {t(I18nKey.CONVERSATION$ARCHIVED_READ_ONLY)}
        </div>
      )}
      {!isArchived && isRuntimeInactive && (
        <WaitingForRuntimeMessage className="pt-16" />
      )}

      <div className="flex items-center gap-2 border-b border-[var(--border-subtle)] px-3 py-2">
        <div className="relative min-w-0 flex-1">
          <Search
            size={14}
            className="absolute left-2 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]"
          />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search terminal output"
            className="h-7 w-full rounded-[var(--radius-sm)] bg-[var(--surface-2)] pl-7 pr-2 text-xs text-[var(--text-primary)] outline-none focus:ring-1 focus:ring-[var(--brand-primary)]"
          />
        </div>
        <span className="hidden font-[var(--font-mono)] text-[10px] text-[var(--text-tertiary)] sm:inline">
          {matchCount} lines
        </span>
        <button
          type="button"
          onClick={copyOutput}
          className="rounded-[var(--radius-sm)] p-1.5 text-[var(--text-secondary)] hover:bg-[var(--surface-hover)]"
          aria-label="Copy terminal output"
        >
          {copied ? (
            <Check size={15} className="text-[var(--success)]" />
          ) : (
            <Copy size={15} />
          )}
        </button>
        <button
          type="button"
          onClick={() => setCollapsed((value) => !value)}
          className="rounded-[var(--radius-sm)] p-1.5 text-[var(--text-secondary)] hover:bg-[var(--surface-hover)]"
          aria-expanded={!collapsed}
          aria-label="Collapse terminal"
        >
          {collapsed ? <ChevronDown size={15} /> : <ChevronUp size={15} />}
        </button>
      </div>
      {!collapsed && (
        <div className="flex-1 min-h-0 p-4">
          <div
            ref={ref}
            className={cn(
              "w-full h-full",
              isRuntimeInactive || isArchived
                ? "p-0 w-0 h-0 opacity-0 overflow-hidden"
                : "",
            )}
          />
        </div>
      )}
    </div>
  );
}

export default Terminal;
