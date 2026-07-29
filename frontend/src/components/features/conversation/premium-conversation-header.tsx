import React from "react";
import { motion } from "framer-motion";
import { PanelRight, Share2 } from "lucide-react";
import { useActiveConversation } from "#/hooks/query/use-active-conversation";
import { useAgentState } from "#/hooks/use-agent-state";
import { useConversationStore } from "#/stores/conversation-store";
import { AgentState } from "#/types/agent-state";
import { slideUp } from "#/lib/motion";
import { cn } from "#/utils/utils";
import { ConversationNameWithStatus } from "./conversation-name-with-status";

function getStatusLabel(state: AgentState) {
  if (state === AgentState.RUNNING) return "Working";
  if (state === AgentState.LOADING || state === AgentState.INIT)
    return "Preparing";
  if (state === AgentState.PAUSED) return "Paused";
  if (state === AgentState.ERROR) return "Needs attention";
  return "Ready";
}

export function PremiumConversationHeader() {
  const { data: conversation } = useActiveConversation();
  const { curAgentState } = useAgentState();
  const { isRightPanelShown, setIsRightPanelShown } = useConversationStore();
  const isRunning =
    curAgentState === AgentState.RUNNING ||
    curAgentState === AgentState.LOADING;
  const copyShareLink = React.useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
    } catch {
      /* unavailable in embedded deployments */
    }
  }, []);

  return (
    <motion.header
      {...slideUp}
      className="flex min-h-16 items-center justify-between gap-3 rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--surface-1)] px-4 shadow-sm"
    >
      <div className="min-w-0">
        <ConversationNameWithStatus />
        <div className="mt-1 flex items-center gap-2 text-xs text-[var(--text-tertiary)]">
          <span
            className={cn(
              "h-1.5 w-1.5 rounded-full bg-[var(--text-tertiary)]",
              isRunning && "bg-[var(--brand-primary)] animate-pulse",
            )}
          />
          <span>{getStatusLabel(curAgentState)}</span>
          {conversation?.llm_model && (
            <>
              <span>·</span>
              <span className="truncate">{conversation.llm_model}</span>
            </>
          )}
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-1">
        <button
          type="button"
          onClick={copyShareLink}
          className="inline-flex h-8 items-center gap-1.5 rounded-[var(--radius-sm)] px-2.5 text-xs font-medium text-[var(--text-secondary)] transition-colors hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)]"
          aria-label="Copy conversation link"
        >
          <Share2 size={15} />
          <span className="hidden sm:inline">Share</span>
        </button>
        <button
          type="button"
          onClick={() => setIsRightPanelShown(!isRightPanelShown)}
          className={cn(
            "inline-flex h-8 items-center gap-1.5 rounded-[var(--radius-sm)] px-2.5 text-xs font-medium transition-colors",
            isRightPanelShown
              ? "bg-[var(--brand-primary-muted)] text-[var(--brand-primary)]"
              : "text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)]",
          )}
          aria-label="Toggle inspector and workspace panel"
          aria-pressed={isRightPanelShown}
        >
          <PanelRight size={15} />
          <span className="hidden sm:inline">Inspector</span>
        </button>
      </div>
    </motion.header>
  );
}
