/**
 * Inferra — Event Message Renderer (Next)
 *
 * Drop-in replacement for the V1 EventMessage component.
 * Maps V1 events to the new Phase 3 conversation components.
 *
 * Integration strategy:
 * - Same props interface as the original EventMessage
 * - Same event type dispatching logic
 * - Renders Phase 3 components (MessageBubble, ToolCard, AIThinkingIndicator)
 *   instead of the legacy ChatMessage/GenericEventMessage
 * - Falls back to original components for edge cases not yet migrated
 *
 * @module event-message-next
 */

import React from "react";
import { useTranslation } from "react-i18next";
import { OpenHandsEvent, MessageEvent, ActionEvent } from "#/types/v1/core";
import { ThinkAction } from "#/types/v1/core/base/action";
import {
  isActionEvent,
  isObservationEvent,
  isAgentErrorEvent,
  isUserMessageEvent,
  isPlanningFileEditorObservationEvent,
  isHookExecutionEvent,
  isACPToolCallEvent,
  isStreamingDeltaEvent,
} from "#/types/v1/type-guards";
import { useAgentState } from "#/hooks/use-agent-state";
import { AgentState } from "#/types/agent-state";

// Phase 3 components
import { MessageBubble } from "#/components/features/conversation/message-bubble";
import { ToolCard } from "#/components/features/conversation/tool-card";
import { AIThinkingIndicator } from "#/components/features/conversation/ai-thinking";
import type { AIThinkingState } from "#/components/features/conversation/ai-thinking";

// Preserved legacy components for edge cases
import { PlanPreview } from "../../features/chat/plan-preview";
import {
  ErrorEventMessage,
  GenericEventMessageWrapper,
  HookExecutionEventMessage,
} from "./event-message-components";
import { shouldShowPlanPreview } from "./hooks/use-plan-preview-events";
import { useConversationStore } from "#/stores/conversation-store";

// Event content helpers (reuse existing logic)
import { getEventContent } from "./event-content-helpers/get-event-content";
import { getObservationContent } from "./event-content-helpers/get-observation-content";

interface EventMessageNextProps {
  event: OpenHandsEvent & { isFromPlanningAgent?: boolean };
  messages: OpenHandsEvent[];
  isLastMessage: boolean;
  isInLast10Actions: boolean;
  planPreviewEventIds?: Set<string>;
}

/**
 * Maps an agent execution status to our AI thinking state.
 */
function mapAgentStateToThinking(state: AgentState): AIThinkingState {
  switch (state) {
    case AgentState.LOADING:
      return "thinking";
    case AgentState.RUNNING:
      return "executing";
    case AgentState.PAUSED:
      return "thinking";
    case AgentState.FINISHED:
      return "finished";
    case AgentState.ERROR:
      return "idle";
    default:
      return "idle";
  }
}

/**
 * Maps a tool/action kind to our ToolCard tool type.
 */
function mapActionToToolType(
  event: ActionEvent,
):
  | "browser"
  | "terminal"
  | "filesystem"
  | "git"
  | "python"
  | "docker"
  | "search"
  | "edit"
  | "read" {
  const kind = event.action?.kind || "";
  if (kind.includes("Browse") || kind.includes("Browser")) return "browser";
  if (kind.includes("Bash") || kind.includes("Execute")) return "terminal";
  if (kind.includes("FileEditor") || kind.includes("StrReplace")) return "edit";
  if (
    kind.includes("FileRead") ||
    kind.includes("Glob") ||
    kind.includes("Grep")
  )
    return "read";
  if (kind.includes("Git")) return "git";
  if (kind.includes("Python") || kind.includes("IPython")) return "python";
  if (kind.includes("Docker")) return "docker";
  if (kind.includes("MCP") || kind.includes("Search")) return "search";
  return "terminal";
}

/**
 * Extracts text content from a MessageEvent's llm_message.
 */
function getMessageText(event: MessageEvent): string {
  if (!event.llm_message?.content) return "";
  return event.llm_message.content
    .filter((c) => c.type === "text")
    .map((c) => (c as { type: "text"; text: string }).text)
    .join("");
}

/**
 * Format a timestamp for display.
 */
function formatTime(timestamp?: string): string | undefined {
  if (!timestamp) return undefined;
  try {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } catch {
    return undefined;
  }
}

export const EventMessageNext = React.memo(
  ({
    event,
    messages,
    isLastMessage,
    isInLast10Actions,
    planPreviewEventIds,
  }: EventMessageNextProps) => {
    const { t } = useTranslation();
    const { curAgentState } = useAgentState();
    const { planContent } = useConversationStore();

    const isAgentRunning =
      curAgentState === AgentState.RUNNING ||
      curAgentState === AgentState.LOADING;

    // ─── Agent Error Events ──────────────────────────────
    if (isAgentErrorEvent(event)) {
      return <ErrorEventMessage event={event} />;
    }

    // ─── Hook Execution Events ──────────────────────────
    if (isHookExecutionEvent(event)) {
      return <HookExecutionEventMessage event={event} />;
    }

    // ─── ACP Sub-Agent Events ──────────────────────────
    if (isACPToolCallEvent(event)) {
      return (
        <ToolCard
          tool="terminal"
          status={
            event.status === "completed"
              ? "completed"
              : event.is_error
                ? "error"
                : "running"
          }
          input={event.title || "Sub-agent tool call"}
          output={
            event.content ? JSON.stringify(event.content, null, 2) : undefined
          }
          error={event.is_error ? "Tool call failed" : undefined}
          timestamp={formatTime(event.timestamp)}
        />
      );
    }

    // ─── Streaming Deltas ───────────────────────────────
    if (isStreamingDeltaEvent(event)) {
      const reasoning = event.reasoning_content ?? "";
      const message = event.content ?? "";

      return (
        <>
          {reasoning && (
            <MessageBubble
              id={`${event.id}-reasoning`}
              role="assistant"
              name="Thinking"
              timestamp={formatTime(event.timestamp)}
              isStreaming={isLastMessage && isAgentRunning}
            >
              <div className="text-[var(--text-secondary)] italic text-xs">
                {reasoning}
              </div>
            </MessageBubble>
          )}
          {message && (
            <MessageBubble
              id={event.id}
              role="assistant"
              timestamp={formatTime(event.timestamp)}
              isStreaming={isLastMessage && isAgentRunning}
              isLast={isLastMessage}
            >
              {message}
            </MessageBubble>
          )}
          {isLastMessage && isAgentRunning && !message && !reasoning && (
            <AIThinkingIndicator
              state={mapAgentStateToThinking(curAgentState)}
            />
          )}
        </>
      );
    }

    // ─── Finish Action ──────────────────────────────────
    if (isActionEvent(event) && event.action.kind === "FinishAction") {
      // Use the getEventContent helper to extract the finish message
      const eventContent = getEventContent(event);
      const message =
        typeof eventContent.details === "string"
          ? eventContent.details
          : String(eventContent.details ?? "");

      if (message) {
        return (
          <MessageBubble
            id={event.id}
            role="assistant"
            name="Result"
            timestamp={formatTime(event.timestamp)}
          >
            {message}
          </MessageBubble>
        );
      }
      return null;
    }

    // ─── Think Action ───────────────────────────────────
    if (isActionEvent(event) && event.action.kind === "ThinkAction") {
      const thinkAction = event as ActionEvent<ThinkAction>;
      return (
        <MessageBubble
          id={event.id}
          role="assistant"
          timestamp={formatTime(event.timestamp)}
        >
          {thinkAction.action.thought}
        </MessageBubble>
      );
    }

    // ─── Action Events (Tool Calls) ─────────────────────
    if (isActionEvent(event)) {
      const toolType = mapActionToToolType(event);
      const thoughtTexts = event.thought;
      const thought = Array.isArray(thoughtTexts)
        ? thoughtTexts
            .filter((t) => t.type === "text")
            .map((t) => (t as { type: "text"; text: string }).text)
            .join("")
        : event.summary || "";

      return (
        <>
          {thought && (
            <MessageBubble
              id={`${event.id}-thought`}
              role="assistant"
              timestamp={formatTime(event.timestamp)}
            >
              {thought}
            </MessageBubble>
          )}
          <ToolCard
            tool={toolType}
            status="running"
            input={event.summary || event.tool_name || event.action.kind}
            timestamp={formatTime(event.timestamp)}
          />
        </>
      );
    }

    // ─── Observation Events (Tool Results) ──────────────
    if (isObservationEvent(event)) {
      // Planning file editor — keep using legacy PlanPreview
      if (isPlanningFileEditorObservationEvent(event)) {
        if (
          planPreviewEventIds &&
          shouldShowPlanPreview(event.id, planPreviewEventIds)
        ) {
          const isStreaming =
            isLastMessage && curAgentState === AgentState.RUNNING;
          return (
            <PlanPreview
              planContent={planContent}
              isStreaming={isStreaming}
              isBuildDisabled={isAgentRunning}
            />
          );
        }
        return null;
      }

      // Find corresponding action
      const correspondingAction = messages.find(
        (msg) => isActionEvent(msg) && msg.id === event.action_id,
      );

      const action =
        correspondingAction && isActionEvent(correspondingAction)
          ? correspondingAction
          : undefined;

      const toolType = action ? mapActionToToolType(action) : "terminal";
      const actionThoughts = action?.thought;
      const thought = Array.isArray(actionThoughts)
        ? actionThoughts
            .filter((t) => t.type === "text")
            .map((t) => (t as { type: "text"; text: string }).text)
            .join("")
        : action?.summary || "";

      // Use the existing getObservationContent helper for proper formatting
      const obsOutput = getObservationContent(event);

      // Check for errors via the observation object
      const obs = event.observation as unknown as
        | Record<string, unknown>
        | undefined;
      const hasError =
        obs &&
        typeof obs === "object" &&
        "is_error" in obs &&
        obs.is_error === true;
      const errorMsg =
        hasError && typeof obs.error === "string" ? obs.error : undefined;

      return (
        <>
          {thought && action?.action.kind !== "ThinkAction" && (
            <MessageBubble
              id={`${event.id}-thought`}
              role="assistant"
              timestamp={formatTime(action?.timestamp)}
            >
              {thought}
            </MessageBubble>
          )}
          <ToolCard
            tool={toolType}
            status={hasError ? "error" : "completed"}
            input={action?.summary || action?.tool_name || "Tool execution"}
            output={obsOutput || undefined}
            error={errorMsg}
            timestamp={formatTime(event.timestamp)}
          />
        </>
      );
    }

    // ─── Message Events (User / Assistant) ──────────────
    if (!isActionEvent(event) && !isObservationEvent(event)) {
      const messageEvent = event as MessageEvent;
      const text = getMessageText(messageEvent);
      const isUser = isUserMessageEvent(event);

      return (
        <MessageBubble
          id={event.id}
          role={isUser ? "user" : "assistant"}
          timestamp={formatTime(event.timestamp)}
          isLast={isLastMessage}
        >
          {text}
        </MessageBubble>
      );
    }

    // ─── Fallback ──────────────────────────────────────
    return (
      <GenericEventMessageWrapper event={event} isLastMessage={isLastMessage} />
    );
  },
);
