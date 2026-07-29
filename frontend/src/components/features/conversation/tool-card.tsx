import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Globe,
  Terminal,
  FolderOpen,
  GitBranch,
  Code,
  Container,
  Search,
  Pencil,
  Eye,
  CheckCircle2,
  XCircle,
  Loader2,
  ChevronDown,
  ChevronRight,
  type LucideIcon,
} from "lucide-react";
import { cn } from "#/lib/utils";
import { Badge } from "#/components/ui/badge";
import { CodeBlock } from "./code-block";

const toolIcons: Record<string, LucideIcon> = {
  browser: Globe,
  terminal: Terminal,
  filesystem: FolderOpen,
  git: GitBranch,
  python: Code,
  docker: Container,
  search: Search,
  edit: Pencil,
  read: Eye,
};

/**
 * Visual card for tool calls made by the agent.
 *
 * @description Renders a styled, expandable card representing a tool execution step.
 * Includes status indication, duration, and expandable detail areas for input and output.
 *
 * @param {ToolCardProps} props - The component props
 * @returns {JSX.Element} The rendered tool card
 *
 * @example
 * <ToolCard
 *   tool="terminal"
 *   status="completed"
 *   duration="1.2s"
 *   input="npm run build"
 *   output="Build successful"
 * />
 */
export interface ToolCardProps {
  /** The tool name */
  tool:
    | "browser"
    | "terminal"
    | "filesystem"
    | "git"
    | "python"
    | "docker"
    | "search"
    | "edit"
    | "read";
  /** Current execution status */
  status: "running" | "completed" | "error";
  /** Execution duration (e.g., '2.3s') */
  duration?: string;
  /** ISO timestamp of execution */
  timestamp?: string;
  /** The tool input/command */
  input: string;
  /** The tool output/result */
  output?: string;
  /** Error message if failed */
  error?: string;
  /** Default expansion state */
  isExpanded?: boolean;
  /** Additional CSS classes */
  className?: string;
}

export const ToolCard = React.forwardRef<HTMLDivElement, ToolCardProps>(
  (
    {
      tool,
      status,
      duration,
      timestamp,
      input,
      output,
      error,
      isExpanded = false,
      className,
      ...props
    },
    ref,
  ) => {
    const [expanded, setExpanded] = React.useState(isExpanded);
    const Icon = toolIcons[tool] || Code;

    const statusBadgeVariant = {
      running: "default",
      completed: "success",
      error: "destructive",
    } as const;

    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col w-full max-w-xl rounded-[var(--radius-lg)] border-[var(--border-subtle)] bg-[var(--surface-1)] overflow-hidden transition-colors border",
          status === "error" && "border-red-500/50",
          className,
        )}
        {...props}
      >
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="flex items-center justify-between p-3 w-full hover:bg-[var(--surface-2)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
          aria-expanded={expanded}
        >
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "p-1.5 rounded-[var(--radius-md)] bg-[var(--surface-2)]",
                status === "running" && "animate-pulse",
              )}
            >
              <Icon className="w-4 h-4 text-[var(--text-primary)]" />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-[var(--text-primary)] capitalize">
                {tool}
              </span>
              <Badge
                variant={statusBadgeVariant[status] || "default"}
                className="flex items-center gap-1 py-0 px-2 text-xs h-5"
              >
                {status === "running" && (
                  <Loader2 className="w-3 h-3 animate-spin" />
                )}
                {status === "completed" && <CheckCircle2 className="w-3 h-3" />}
                {status === "error" && <XCircle className="w-3 h-3" />}
                <span className="capitalize">{status}</span>
              </Badge>
              {duration && (
                <span className="text-xs text-[var(--text-tertiary)]">
                  {duration}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center text-[var(--text-tertiary)]">
            {expanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </div>
        </button>

        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="border-t border-[var(--border-subtle)] overflow-hidden bg-[var(--surface-0)]"
            >
              <div className="p-3 space-y-4">
                <div className="space-y-1.5">
                  <span className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
                    Input
                  </span>
                  <pre className="p-2.5 rounded-[var(--radius-md)] bg-[var(--surface-2)] text-[var(--text-primary)] font-mono text-xs overflow-x-auto whitespace-pre-wrap">
                    {input}
                  </pre>
                </div>

                {error && (
                  <div className="space-y-1.5">
                    <span className="text-xs font-semibold text-red-500 uppercase tracking-wider flex items-center gap-1">
                      <XCircle className="w-3 h-3" /> Error
                    </span>
                    <pre className="p-2.5 rounded-[var(--radius-md)] bg-red-500/10 border border-red-500/20 text-red-500 font-mono text-xs overflow-x-auto whitespace-pre-wrap">
                      {error}
                    </pre>
                  </div>
                )}

                {output && !error && (
                  <div className="space-y-1.5">
                    <span className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
                      Output
                    </span>
                    <div className="rounded-[var(--radius-md)] overflow-hidden border border-[var(--border-subtle)]">
                      {/* Fallback to pre/code block just in case CodeBlock is not fully compatible or lacks prop */}
                      {typeof CodeBlock !== "undefined" ? (
                        <CodeBlock
                          code={output}
                          language={
                            tool === "python"
                              ? "python"
                              : tool === "terminal"
                                ? "bash"
                                : "plaintext"
                          }
                        />
                      ) : (
                        <pre className="p-2.5 bg-[var(--surface-2)] text-[var(--text-primary)] font-mono text-xs overflow-x-auto whitespace-pre-wrap">
                          {output}
                        </pre>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  },
);
ToolCard.displayName = "ToolCard";
