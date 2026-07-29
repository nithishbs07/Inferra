/**
 * Inferra — AI Thinking Indicator
 *
 * Replaces generic spinners with contextual AI state visualization.
 * Shows what the AI is currently doing with animated transitions.
 *
 * States:
 * - Thinking (brain icon, cyan pulse)
 * - Planning (clipboard icon, yellow)
 * - Searching (search icon, cyan)
 * - Executing (zap icon, red/brand)
 * - Verifying (check icon, green)
 * - Finished (checkmark, green, fades out)
 *
 * @module ai-thinking
 */

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain,
  ClipboardList,
  Search,
  Zap,
  CheckCircle2,
  CheckCircle,
} from "lucide-react";
import { cn } from "#/lib/utils";
import { springStiff } from "#/lib/motion";

export type AIThinkingState =
  | "thinking"
  | "planning"
  | "searching"
  | "executing"
  | "verifying"
  | "finished"
  | "idle";

interface AIThinkingConfig {
  icon: React.ElementType;
  label: string;
  color: string;
  bgColor: string;
  contextual?: string[];
}

const STATE_CONFIG: Record<
  Exclude<AIThinkingState, "idle">,
  AIThinkingConfig
> = {
  thinking: {
    icon: Brain,
    label: "Thinking",
    color: "text-[var(--agent-thinking)]",
    bgColor: "bg-[var(--agent-thinking)]/10",
    contextual: [
      "Analyzing your request...",
      "Understanding the context...",
      "Processing information...",
    ],
  },
  planning: {
    icon: ClipboardList,
    label: "Planning",
    color: "text-[var(--agent-planning)]",
    bgColor: "bg-[var(--agent-planning)]/10",
    contextual: [
      "Creating an action plan...",
      "Structuring the approach...",
      "Organizing steps...",
    ],
  },
  searching: {
    icon: Search,
    label: "Searching",
    color: "text-[var(--agent-thinking)]",
    bgColor: "bg-[var(--agent-thinking)]/10",
    contextual: [
      "Searching codebase...",
      "Looking for references...",
      "Scanning files...",
    ],
  },
  executing: {
    icon: Zap,
    label: "Executing",
    color: "text-[var(--agent-executing)]",
    bgColor: "bg-[var(--agent-executing)]/10",
    contextual: [
      "Running commands...",
      "Making changes...",
      "Executing actions...",
    ],
  },
  verifying: {
    icon: CheckCircle2,
    label: "Verifying",
    color: "text-[var(--agent-verifying)]",
    bgColor: "bg-[var(--agent-verifying)]/10",
    contextual: [
      "Checking results...",
      "Validating changes...",
      "Running tests...",
    ],
  },
  finished: {
    icon: CheckCircle,
    label: "Finished",
    color: "text-[var(--agent-finished)]",
    bgColor: "bg-[var(--agent-finished)]/10",
  },
};

interface AIThinkingIndicatorProps {
  /** Current AI state */
  state: AIThinkingState;
  /** Optional contextual message override */
  message?: string;
  /** Compact mode (icon + short label only) */
  compact?: boolean;
  /** Additional CSS */
  className?: string;
}

export function AIThinkingIndicator({
  state,
  message,
  compact = false,
  className,
}: AIThinkingIndicatorProps) {
  const [contextIndex, setContextIndex] = React.useState(0);

  if (state === "idle") return null;

  const config = STATE_CONFIG[state];
  const Icon = config.icon;

  // Rotate contextual messages
  React.useEffect(() => {
    if (!config.contextual?.length || message) return;
    const interval = setInterval(() => {
      setContextIndex((prev) => (prev + 1) % (config.contextual?.length || 1));
    }, 3000);
    return () => clearInterval(interval);
  }, [config.contextual, message]);

  const displayMessage =
    message || config.contextual?.[contextIndex] || config.label;

  if (compact) {
    return (
      <div
        className={cn(
          "inline-flex items-center gap-1.5 text-xs",
          config.color,
          className,
        )}
      >
        {state === "finished" ? (
          <Icon size={14} />
        ) : (
          <motion.div
            animate={{ rotate: state === "executing" ? 360 : 0 }}
            transition={
              state === "executing"
                ? { duration: 1, repeat: Infinity, ease: "linear" }
                : undefined
            }
          >
            <Icon size={14} />
          </motion.div>
        )}
        <span className="font-medium">{config.label}</span>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.15 }}
      className={cn("flex items-center gap-3 px-4 py-3", className)}
    >
      {/* Animated icon */}
      <div
        className={cn(
          "relative flex items-center justify-center w-8 h-8 rounded-full",
          config.bgColor,
        )}
      >
        {/* Pulse ring for active states */}
        {state !== "finished" && (
          <motion.div
            className={cn("absolute inset-0 rounded-full", config.bgColor)}
            animate={{ scale: [1, 1.4], opacity: [0.5, 0] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeOut",
            }}
          />
        )}
        <AnimatePresence mode="wait">
          <motion.div
            key={state}
            initial={{ scale: 0, rotate: -90 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 90 }}
            transition={springStiff}
            className={config.color}
          >
            <Icon size={16} />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* State text */}
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <span className={cn("text-sm font-medium", config.color)}>
            {config.label}
          </span>

          {/* Animated dots for active states */}
          {state !== "finished" && <ThinkingDots className={config.color} />}
        </div>

        {/* Contextual message */}
        <AnimatePresence mode="wait">
          <motion.p
            key={displayMessage}
            initial={{ opacity: 0, y: 2 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -2 }}
            transition={{ duration: 0.2 }}
            className="text-xs text-[var(--text-tertiary)] mt-0.5"
          >
            {displayMessage}
          </motion.p>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ─── Thinking Dots ─────────────────────────────────────

function ThinkingDots({ className }: { className?: string }) {
  return (
    <div className="flex items-center gap-0.5">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className={cn("w-1 h-1 rounded-full bg-current", className)}
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            delay: i * 0.2,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
