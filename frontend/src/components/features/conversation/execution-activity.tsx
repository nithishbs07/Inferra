import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, CircleDashed, Clock3, XCircle } from "lucide-react";
import { cn } from "#/utils/utils";
import { slideUp } from "#/lib/motion";
import type { OpenHandsEvent } from "#/types/v1/core";
import {
  isActionEvent,
  isAgentErrorEvent,
  isObservationEvent,
} from "#/types/v1/type-guards";

type Stage =
  | "thinking"
  | "planning"
  | "searching"
  | "executing"
  | "verifying"
  | "completed";

const STAGES: Array<{ key: Stage; label: string }> = [
  { key: "thinking", label: "Thinking" },
  { key: "planning", label: "Planning" },
  { key: "searching", label: "Searching" },
  { key: "executing", label: "Executing" },
  { key: "verifying", label: "Verifying" },
  { key: "completed", label: "Completed" },
];

function stageForEvent(event: OpenHandsEvent): Stage {
  if (isAgentErrorEvent(event)) return "executing";
  if (isObservationEvent(event)) return "verifying";
  if (isActionEvent(event)) {
    const value = `${event.action.kind} ${event.summary || ""}`.toLowerCase();
    if (value.includes("plan")) return "planning";
    if (
      value.includes("search") ||
      value.includes("grep") ||
      value.includes("glob")
    )
      return "searching";
    if (value.includes("think")) return "thinking";
    return "executing";
  }
  return "thinking";
}

function formatTime(timestamp?: string) {
  return timestamp
    ? new Date(timestamp).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
    : "Live";
}

export function ExecutionTimeline({
  events,
  isRunning,
}: {
  events: OpenHandsEvent[];
  isRunning: boolean;
}) {
  const latest = events.at(-1);
  const activeStage = latest ? stageForEvent(latest) : "thinking";
  const activeIndex = STAGES.findIndex((stage) => stage.key === activeStage);
  const failed = Boolean(latest && isAgentErrorEvent(latest));
  return (
    <section
      className="rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--surface-1)] p-4"
      aria-label="Execution timeline"
    >
      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm font-semibold text-[var(--text-primary)]">
          Execution timeline
        </span>
        <span className="font-[var(--font-mono)] text-[10px] text-[var(--text-tertiary)]">
          {formatTime(latest?.timestamp)}
        </span>
      </div>
      <div className="space-y-3">
        {STAGES.map((stage, index) => {
          const isCurrent = index === activeIndex && isRunning;
          const isDone =
            index < activeIndex || (!isRunning && stage.key === "completed");
          return (
            <motion.div
              key={stage.key}
              {...slideUp}
              className="flex items-start gap-3"
            >
              <span
                className={cn(
                  "mt-0.5 flex h-5 w-5 items-center justify-center rounded-full",
                  isCurrent &&
                    "bg-[var(--brand-primary-muted)] text-[var(--brand-primary)]",
                  isDone && "bg-[var(--success-muted)] text-[var(--success)]",
                  !isCurrent &&
                    !isDone &&
                    "bg-[var(--surface-2)] text-[var(--text-tertiary)]",
                )}
              >
                {failed && isCurrent ? (
                  <XCircle size={13} />
                ) : isDone ? (
                  <CheckCircle2 size={13} />
                ) : (
                  <CircleDashed
                    size={13}
                    className={isCurrent ? "animate-spin" : ""}
                  />
                )}
              </span>
              <details className="min-w-0 flex-1" open={isCurrent}>
                <summary className="cursor-pointer list-none text-xs font-medium text-[var(--text-primary)]">
                  <span>{stage.label}</span>
                  {isCurrent && (
                    <span className="ml-2 text-[10px] font-normal text-[var(--text-tertiary)]">
                      {failed ? "Failed" : "In progress"}
                    </span>
                  )}
                </summary>
                {isCurrent && (
                  <p className="mt-1 text-xs leading-relaxed text-[var(--text-secondary)]">
                    {latest && isAgentErrorEvent(latest)
                      ? latest.error
                      : latest && isActionEvent(latest)
                        ? latest.summary ||
                          latest.tool_name ||
                          latest.action.kind
                        : "Waiting for the next execution event."}
                  </p>
                )}
              </details>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

export function ActivityFeed({
  events,
  maxItems = 6,
}: {
  events: OpenHandsEvent[];
  maxItems?: number;
}) {
  const items = React.useMemo(
    () =>
      events
        .filter(
          (event) =>
            isActionEvent(event) ||
            isObservationEvent(event) ||
            isAgentErrorEvent(event),
        )
        .slice(-maxItems)
        .reverse(),
    [events, maxItems],
  );
  return (
    <section
      className="rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--surface-1)] p-4"
      aria-label="Live activity"
    >
      <div className="mb-3 flex items-center gap-2">
        <Clock3 size={14} className="text-[var(--brand-primary)]" />
        <span className="text-sm font-semibold">Live activity</span>
      </div>
      <div className="space-y-2">
        {items.length === 0 ? (
          <p className="text-xs text-[var(--text-tertiary)]">
            Activity will appear as the agent starts working.
          </p>
        ) : (
          items.map((event) => (
            <div key={event.id} className="flex gap-2 text-xs">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--brand-primary)]" />
              <span className="min-w-0 flex-1 truncate text-[var(--text-secondary)]">
                {isAgentErrorEvent(event)
                  ? event.error
                  : isActionEvent(event)
                    ? event.summary || event.tool_name || event.action.kind
                    : event.tool_name || "Tool completed"}
              </span>
              <span className="shrink-0 font-[var(--font-mono)] text-[10px] text-[var(--text-tertiary)]">
                {formatTime(event.timestamp)}
              </span>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
