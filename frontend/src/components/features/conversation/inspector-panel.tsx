/**
 * @file inspector-panel.tsx
 * @description A right-side panel showing real-time information about the current conversation.
 * @props InspectorPanelProps
 * @accessibility WCAG AA, Keyboard navigable
 */
import * as React from "react";
import {
  Settings,
  Clock,
  Zap,
  BrainCircuit,
  Play,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { cn } from "#/lib/utils";
import { ScrollArea } from "#/components/ui/scroll-area";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "#/components/ui/accordion";
import { Progress } from "#/components/ui/progress";
import { Badge } from "#/components/ui/badge";
import { useActiveConversation } from "#/hooks/query/use-active-conversation";
import { useAgentState } from "#/hooks/use-agent-state";
import { AgentState } from "#/types/agent-state";

export interface InspectorPanelProps {
  model?: { name: string; provider: string };
  contextUsed?: number;
  contextMax?: number;
  tools?: Array<{ name: string; enabled: boolean; icon: string }>;
  tasks?: Array<{
    name: string;
    status: "running" | "completed" | "error";
    elapsed: string;
  }>;
  tokenCount?: number;
  latency?: number;
  memoryCount?: number;
  className?: string;
}

export const InspectorPanel = React.forwardRef<
  HTMLDivElement,
  InspectorPanelProps
>((props, ref) => {
  const { data: conversation } = useActiveConversation();
  const { curAgentState } = useAgentState();
  const usage = conversation?.metrics?.accumulated_token_usage;
  const {
    model = {
      name: conversation?.llm_model || "Not selected",
      provider: "Inferra",
    },
    contextUsed = usage?.prompt_tokens || 0,
    contextMax = usage?.context_window || 0,
    tools = [],
    tasks = curAgentState === AgentState.RUNNING ||
    curAgentState === AgentState.LOADING
      ? [
          {
            name: "Agent execution",
            status: "running" as const,
            elapsed: "Live",
          },
        ]
      : [],
    tokenCount = usage?.per_turn_token || 0,
    latency = 0,
    memoryCount = 0,
    className,
    ...rest
  } = props;

  const contextPercentage =
    contextMax > 0
      ? Math.min(100, Math.round((contextUsed / contextMax) * 100))
      : 0;

  return (
    <div
      ref={ref}
      className={cn(
        "flex flex-col w-[320px] h-full bg-[var(--surface-1)] border-l border-[var(--border-subtle)] text-[var(--text-primary)]",
        className,
      )}
      {...rest}
    >
      <div className="p-4 border-b border-[var(--border-subtle)] flex items-center justify-between">
        <h2 className="text-sm font-semibold flex items-center gap-2">
          <Settings className="w-4 h-4 text-[var(--text-secondary)]" />
          Inspector
        </h2>
      </div>

      <ScrollArea className="flex-1">
        <Accordion
          type="multiple"
          defaultValue={[
            "model",
            "context",
            "tools",
            "tasks",
            "performance",
            "memory",
          ]}
          className="w-full"
        >
          {/* Model Info */}
          <AccordionItem
            value="model"
            className="border-b border-[var(--border-subtle)] px-4"
          >
            <AccordionTrigger className="text-sm font-medium py-3 hover:no-underline">
              Model Info
            </AccordionTrigger>
            <AccordionContent className="pb-4 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[var(--text-secondary)]">
                  Current Model
                </span>
                <Badge variant="outline" className="bg-[var(--surface-2)]">
                  {model.name}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-[var(--text-secondary)]">
                  Provider
                </span>
                <span className="text-xs font-medium">{model.provider}</span>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Context */}
          <AccordionItem
            value="context"
            className="border-b border-[var(--border-subtle)] px-4"
          >
            <AccordionTrigger className="text-sm font-medium py-3 hover:no-underline">
              Context
            </AccordionTrigger>
            <AccordionContent className="pb-4 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[var(--text-secondary)]">
                  Token Usage
                </span>
                <span className="text-xs font-mono">
                  {contextUsed.toLocaleString()} / {contextMax.toLocaleString()}
                </span>
              </div>
              <Progress value={contextPercentage} className="h-2" />
              <div className="text-right text-[10px] text-[var(--text-tertiary)]">
                {contextPercentage}% utilized
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Active Tools */}
          <AccordionItem
            value="tools"
            className="border-b border-[var(--border-subtle)] px-4"
          >
            <AccordionTrigger className="text-sm font-medium py-3 hover:no-underline flex items-center gap-2">
              Active Tools
            </AccordionTrigger>
            <AccordionContent className="pb-4 flex flex-col gap-3">
              {tools.length === 0 && (
                <p className="text-xs text-[var(--text-tertiary)]">
                  No tools are currently running.
                </p>
              )}
              {tools.map((tool, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-[var(--surface-2)] flex items-center justify-center">
                      <Zap className="w-3 h-3 text-[var(--text-secondary)]" />
                    </div>
                    <span className="text-xs font-medium">{tool.name}</span>
                  </div>
                  <span
                    className={cn(
                      "h-2 w-2 rounded-full",
                      tool.enabled
                        ? "bg-[var(--success)]"
                        : "bg-[var(--text-tertiary)]",
                    )}
                    aria-label={`${tool.name} ${tool.enabled ? "enabled" : "inactive"}`}
                  />
                </div>
              ))}
            </AccordionContent>
          </AccordionItem>

          {/* Running Tasks */}
          <AccordionItem
            value="tasks"
            className="border-b border-[var(--border-subtle)] px-4"
          >
            <AccordionTrigger className="text-sm font-medium py-3 hover:no-underline flex items-center gap-2">
              Running Tasks
            </AccordionTrigger>
            <AccordionContent className="pb-4 flex flex-col gap-3">
              {tasks.length === 0 && (
                <p className="text-xs text-[var(--text-tertiary)]">
                  The agent is idle.
                </p>
              )}
              {tasks.map((task, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2 rounded-md bg-[var(--surface-2)]"
                >
                  <div className="flex items-center gap-2">
                    {task.status === "running" && (
                      <Play className="w-3 h-3 text-[var(--brand-primary)] animate-pulse" />
                    )}
                    {task.status === "completed" && (
                      <CheckCircle className="w-3 h-3 text-[var(--success)]" />
                    )}
                    {task.status === "error" && (
                      <XCircle className="w-3 h-3 text-[var(--error)]" />
                    )}
                    <span className="text-xs">{task.name}</span>
                  </div>
                  <span className="text-[10px] font-mono text-[var(--text-tertiary)] flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {task.elapsed}
                  </span>
                </div>
              ))}
            </AccordionContent>
          </AccordionItem>

          {/* Performance */}
          <AccordionItem
            value="performance"
            className="border-b border-[var(--border-subtle)] px-4"
          >
            <AccordionTrigger className="text-sm font-medium py-3 hover:no-underline">
              Performance
            </AccordionTrigger>
            <AccordionContent className="pb-4 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[var(--text-secondary)]">
                  Total Tokens
                </span>
                <span className="text-xs font-mono">
                  {tokenCount.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-[var(--text-secondary)]">
                  Latency
                </span>
                <span className="text-xs font-mono">{latency}ms</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-[var(--text-secondary)]">
                  Est. Cost
                </span>
                <span className="text-xs font-mono text-[var(--text-tertiary)]">
                  ~$0.04
                </span>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Memory */}
          <AccordionItem value="memory" className="px-4 border-none">
            <AccordionTrigger className="text-sm font-medium py-3 hover:no-underline flex items-center gap-2">
              Memory
            </AccordionTrigger>
            <AccordionContent className="pb-4">
              <div className="flex items-center justify-between p-2 rounded-md bg-[var(--surface-2)] border border-[var(--border-subtle)]">
                <div className="flex items-center gap-2">
                  <BrainCircuit className="w-4 h-4 text-[var(--brand-primary)]" />
                  <span className="text-xs font-medium">
                    Referenced Memories
                  </span>
                </div>
                <Badge variant="secondary" className="font-mono text-[10px]">
                  {memoryCount}
                </Badge>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </ScrollArea>
    </div>
  );
});

InspectorPanel.displayName = "InspectorPanel";
