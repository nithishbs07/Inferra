import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain,
  ClipboardList,
  Search,
  Zap,
  CheckCircle2,
  CheckCircle,
  XCircle,
  PauseCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

import { cn } from "#/lib/utils";

export type AgentState =
  | "thinking"
  | "planning"
  | "searching"
  | "executing"
  | "verifying"
  | "completed"
  | "error"
  | "paused";

export interface AgentTimelineStep {
  /** The state of the agent */
  state: AgentState;
  /** Label describing what the agent is doing */
  label: string;
  /** Optional timestamp string */
  timestamp?: string;
  /** Optional detailed description or logs */
  detail?: string;
  /** Optional duration string */
  duration?: string;
}

export interface AgentTimelineProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Array of timeline steps */
  steps: AgentTimelineStep[];
  /** Currently active state (for animation) */
  currentState?: AgentState;
  /** If true, renders a horizontal compact version with only icons */
  compact?: boolean;
}

const stateConfig = {
  thinking: {
    icon: Brain,
    color: "var(--agent-thinking)", // #8DFFF9
    className: "text-[var(--agent-thinking)]",
  },
  planning: {
    icon: ClipboardList,
    color: "var(--agent-planning)", // #FFEA92
    className: "text-[var(--agent-planning)]",
  },
  searching: {
    icon: Search,
    color: "var(--agent-thinking)", // #8DFFF9
    className: "text-[var(--agent-thinking)]",
  },
  executing: {
    icon: Zap,
    color: "var(--agent-executing)", // #EF4444
    className: "text-[var(--agent-executing)]",
  },
  verifying: {
    icon: CheckCircle2,
    color: "var(--agent-verifying)", // #BCFF8C
    className: "text-[var(--agent-verifying)]",
  },
  completed: {
    icon: CheckCircle,
    color: "var(--agent-finished)", // #BCFF8C
    className: "text-[var(--agent-finished)]",
  },
  error: {
    icon: XCircle,
    color: "var(--agent-error)", // #FF684E
    className: "text-[var(--agent-error)]",
  },
  paused: {
    icon: PauseCircle,
    color: "var(--agent-paused)", // #9099AC
    className: "text-[var(--agent-paused)]",
  },
};

/**
 * AgentTimeline component visually represents the AI's workflow over time.
 * Displays a vertical timeline of steps or a compact horizontal icon-only mode.
 * Includes expandable details and animated state transitions.
 *
 * @example
 * <AgentTimeline
 *   steps={[{ state: 'thinking', label: 'Analyzing request' }]}
 *   currentState="thinking"
 * />
 */
export const AgentTimeline = React.forwardRef<
  HTMLDivElement,
  AgentTimelineProps
>(({ steps, currentState, compact = false, className, ...props }, ref) => {
  if (compact) {
    return (
      <div
        ref={ref}
        className={cn("flex items-center gap-2", className)}
        {...props}
        role="list"
        aria-label="Agent workflow timeline"
      >
        {steps.map((step, index) => {
          const Config = stateConfig[step.state];
          const Icon = Config.icon;
          const isActive = step.state === currentState;

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 20,
                delay: index * 0.1,
              }}
              className="relative"
              title={step.label}
              role="listitem"
            >
              <div
                className={cn(
                  "flex h-6 w-6 items-center justify-center rounded-full bg-[var(--surface-1)]",
                  isActive &&
                    "ring-2 ring-[var(--brand-primary)] ring-offset-1 ring-offset-[var(--surface-0)]",
                )}
              >
                <Icon
                  className={cn("h-3.5 w-3.5", Config.className)}
                  aria-hidden="true"
                />
              </div>
              {isActive && (
                <motion.div
                  className="absolute inset-0 rounded-full bg-[var(--brand-primary)] opacity-20"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              )}
            </motion.div>
          );
        })}
      </div>
    );
  }

  // Identify the active step index based on currentState (last occurrence)
  let activeIndex = -1;
  for (let i = steps.length - 1; i >= 0; i--) {
    if (steps[i].state === currentState) {
      activeIndex = i;
      break;
    }
  }

  return (
    <div
      ref={ref}
      className={cn("flex flex-col", className)}
      {...props}
      role="list"
      aria-label="Agent workflow timeline"
    >
      {steps.map((step, index) => {
        const Config = stateConfig[step.state];
        const Icon = Config.icon;
        const isActive = index === activeIndex;
        const isCompleted = index < activeIndex || step.state === "completed";
        const isFuture = index > activeIndex;

        return (
          <TimelineStep
            key={index}
            step={step}
            index={index}
            icon={Icon}
            colorClass={Config.className}
            isActive={isActive}
            isCompleted={isCompleted}
            isFuture={isFuture}
            isLast={index === steps.length - 1}
          />
        );
      })}
    </div>
  );
});
AgentTimeline.displayName = "AgentTimeline";

interface TimelineStepProps {
  step: AgentTimelineStep;
  index: number;
  icon: React.ElementType;
  colorClass: string;
  isActive: boolean;
  isCompleted: boolean;
  isFuture: boolean;
  isLast: boolean;
}

function TimelineStep({
  step,
  index,
  icon: Icon,
  colorClass,
  isActive,
  isCompleted,
  isFuture,
  isLast,
}: TimelineStepProps) {
  const [expanded, setExpanded] = React.useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 25,
        delay: index * 0.1,
      }}
      className="relative flex min-h-[3rem] gap-4"
      role="listitem"
    >
      {/* Timeline line */}
      {!isLast && (
        <div
          className={cn(
            "absolute bottom-0 left-2 top-6 w-[2px] -translate-x-1/2 rounded-full",
            isCompleted || isActive
              ? "bg-[var(--brand-primary)]"
              : "bg-[var(--border-subtle)]",
          )}
          aria-hidden="true"
        />
      )}

      {/* Timeline marker */}
      <div className="relative mt-1 flex h-4 w-4 shrink-0 items-center justify-center">
        <div
          className={cn(
            "flex h-4 w-4 items-center justify-center rounded-full border-2",
            isCompleted &&
              "bg-[var(--brand-primary)] border-[var(--brand-primary)] text-[var(--surface-0)]",
            isActive && cn("bg-[var(--surface-0)] border-current", colorClass),
            isFuture && "border-[var(--border-subtle)] bg-transparent",
          )}
        >
          {isCompleted ? (
            <CheckCircle className="h-2.5 w-2.5" />
          ) : (
            <Icon
              className={cn(
                "h-2.5 w-2.5",
                isActive ? "opacity-100" : "opacity-0",
              )}
            />
          )}
        </div>
        {isActive && (
          <motion.div
            className={cn(
              "absolute inset-0 rounded-full border-2 opacity-50",
              colorClass,
            )}
            animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col pb-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "text-sm font-medium leading-none",
                isActive || isCompleted
                  ? "text-[var(--text-primary)]"
                  : "text-[var(--text-secondary)]",
              )}
            >
              {step.label}
            </span>
            {step.detail && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="flex h-5 w-5 items-center justify-center rounded-sm text-[var(--text-tertiary)] hover:bg-[var(--surface-1)] hover:text-[var(--text-secondary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)]"
                aria-expanded={expanded}
                aria-label={expanded ? "Hide details" : "Show details"}
              >
                {expanded ? (
                  <ChevronUp className="h-3 w-3" />
                ) : (
                  <ChevronDown className="h-3 w-3" />
                )}
              </button>
            )}
          </div>

          {(step.timestamp || step.duration) && (
            <div className="flex items-center gap-2 font-mono text-[10px] text-[var(--text-tertiary)]">
              {step.duration && <span>{step.duration}</span>}
              {step.timestamp && <span>{step.timestamp}</span>}
            </div>
          )}
        </div>

        {/* Expandable Detail */}
        <AnimatePresence>
          {expanded && step.detail && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="mt-2 rounded-md bg-[var(--surface-1)] p-3 text-xs text-[var(--text-secondary)]">
                {step.detail}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium border",
  {
    variants: {
      state: {
        thinking:
          "bg-[var(--surface-1)] border-[var(--border-subtle)] text-[var(--agent-thinking)]",
        planning:
          "bg-[var(--surface-1)] border-[var(--border-subtle)] text-[var(--agent-planning)]",
        searching:
          "bg-[var(--surface-1)] border-[var(--border-subtle)] text-[var(--agent-thinking)]",
        executing:
          "bg-[var(--surface-1)] border-[var(--border-subtle)] text-[var(--agent-executing)]",
        verifying:
          "bg-[var(--surface-1)] border-[var(--border-subtle)] text-[var(--agent-verifying)]",
        completed:
          "bg-[var(--surface-1)] border-[var(--border-subtle)] text-[var(--agent-finished)]",
        error:
          "bg-[var(--surface-1)] border-[var(--border-subtle)] text-[var(--agent-error)]",
        paused:
          "bg-[var(--surface-1)] border-[var(--border-subtle)] text-[var(--agent-paused)]",
      },
    },
    defaultVariants: {
      state: "thinking",
    },
  },
);

export interface AgentStateIndicatorProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  /** The state of the agent */
  state: AgentState;
  /** Optional custom label to display alongside the icon */
  label?: string;
}

/**
 * AgentStateIndicator displays the current state of the agent as a small inline badge.
 * Combines an icon with an optional label, colored according to the state.
 * Useful for status bars and message headers.
 *
 * @example
 * <AgentStateIndicator state="thinking" label="Thinking..." />
 */
export const AgentStateIndicator = React.forwardRef<
  HTMLDivElement,
  AgentStateIndicatorProps
>(({ state, label, className, ...props }, ref) => {
  const Config = stateConfig[state];
  const Icon = Config.icon;

  return (
    <div
      ref={ref}
      className={cn(badgeVariants({ state }), className)}
      {...props}
      role="status"
    >
      <Icon className="h-3 w-3" aria-hidden="true" />
      {label && <span>{label}</span>}
    </div>
  );
});
AgentStateIndicator.displayName = "AgentStateIndicator";
