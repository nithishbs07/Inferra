/**
 * Inferra - Dashboard
 *
 * Provides a high-level overview of running agents, models, recent activity, and quick actions.
 *
 * @module Dashboard
 *
 * States:
 * - Loaded with placeholder data (Phase 3 will connect real data)
 * - Empty states for all widgets
 *
 * Accessibility:
 * - WCAG AA compliant colors and contrast
 * - Keyboard navigable quick actions
 *
 * Usage:
 * ```tsx
 * import { Dashboard } from '#/components/features/dashboard';
 * <Dashboard />
 * ```
 */

import React from "react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import {
  Plus,
  FolderOpen,
  Cpu,
  Settings,
  MessageSquare,
  Activity,
  Database,
  CheckCircle2,
  XCircle,
  Clock,
} from "lucide-react";

import { Card, CardHeader, CardTitle, CardContent } from "#/components/ui/card";
import { Button } from "#/components/ui/button";
import { Badge } from "#/components/ui/badge";
import { Avatar, AvatarFallback } from "#/components/ui/avatar";
import { EmptyState } from "#/components/ui/empty-state";
import { cn } from "#/lib/utils";
import { stagger, slideUp, hoverLift } from "#/lib/motion";

// --- Placeholder Data ---

const RECENT_CONVERSATIONS = [
  {
    id: 1,
    title: "Fix React memory leak",
    timeAgo: "2h ago",
    model: "GPT-4o",
    avatar: "R",
  },
  {
    id: 2,
    title: "Refactor auth service",
    timeAgo: "5h ago",
    model: "Claude 3.5 Sonnet",
    avatar: "A",
  },
  {
    id: 3,
    title: "Setup CI/CD pipeline",
    timeAgo: "1d ago",
    model: "GPT-4o",
    avatar: "C",
  },
];

const RUNNING_AGENTS = [
  {
    id: 1,
    name: "Code Reviewer",
    status: "active",
    color: "bg-[var(--success)]",
  },
  {
    id: 2,
    name: "Test Generator",
    status: "idle",
    color: "bg-[var(--warning)]",
  },
];

const MODEL_STATUS = [
  { id: 1, name: "GPT-4o", status: "connected" },
  { id: 2, name: "Claude 3.5 Sonnet", status: "connected" },
  { id: 3, name: "Llama 3 70B", status: "disconnected" },
];

const ACTIVITY_FEED = [
  {
    id: 1,
    desc: "Agent Test Generator completed task",
    time: "10m ago",
    icon: Activity,
  },
  { id: 2, desc: "New model GPT-4o connected", time: "1h ago", icon: Cpu },
  {
    id: 3,
    desc: 'Project "Inferra" opened',
    time: "2h ago",
    icon: FolderOpen,
  },
];

const MEMORY_STATS = {
  count: 124,
  lastUpdated: "15m ago",
};

// --- Components ---

function StatusDot({ colorClass }: { colorClass: string }) {
  return (
    <span
      className={cn(
        "inline-block h-2 w-2 rounded-[var(--radius-full)]",
        colorClass,
      )}
    />
  );
}

export function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="mx-auto w-full max-w-7xl p-4 md:p-6 lg:p-8 space-y-6">
      <motion.div
        variants={stagger}
        initial="initial"
        animate="animate"
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* Quick Actions - Full Width */}
        <motion.div variants={slideUp} className="md:col-span-2">
          <Card className="bg-[var(--surface-1)] border-[var(--border-subtle)] rounded-[var(--radius-lg)]">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <motion.div
                  whileHover={hoverLift.whileHover}
                  transition={hoverLift.transition}
                >
                  <Button
                    variant="outline"
                    className="w-full h-24 flex flex-col items-center justify-center gap-2"
                    onClick={() => navigate("/")}
                  >
                    <Plus className="h-6 w-6" />
                    <span>New Conversation</span>
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={hoverLift.whileHover}
                  transition={hoverLift.transition}
                >
                  <Button
                    variant="outline"
                    className="w-full h-24 flex flex-col items-center justify-center gap-2"
                    onClick={() => navigate("/projects")}
                  >
                    <FolderOpen className="h-6 w-6" />
                    <span>Open Project</span>
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={hoverLift.whileHover}
                  transition={hoverLift.transition}
                >
                  <Button
                    variant="outline"
                    className="w-full h-24 flex flex-col items-center justify-center gap-2"
                    onClick={() => navigate("/settings")}
                  >
                    <Cpu className="h-6 w-6" />
                    <span>Browse Models</span>
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={hoverLift.whileHover}
                  transition={hoverLift.transition}
                >
                  <Button
                    variant="outline"
                    className="w-full h-24 flex flex-col items-center justify-center gap-2"
                    onClick={() => navigate("/settings")}
                  >
                    <Settings className="h-6 w-6" />
                    <span>View Settings</span>
                  </Button>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Conversations */}
        <motion.div variants={slideUp}>
          <Card className="bg-[var(--surface-1)] border-[var(--border-subtle)] rounded-[var(--radius-lg)] h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-[var(--text-secondary)]" />
                Recent Conversations
              </CardTitle>
            </CardHeader>
            <CardContent>
              {RECENT_CONVERSATIONS.length > 0 ? (
                <div className="space-y-4">
                  {RECENT_CONVERSATIONS.map((conv) => (
                    <div
                      key={conv.id}
                      className="flex items-center justify-between p-3 rounded-[var(--radius-md)] bg-[var(--surface-0)] border border-[var(--border-subtle)]"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback className="bg-[var(--brand-primary)] text-[var(--surface-0)]">
                            {conv.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium text-[var(--text-primary)]">
                            {conv.title}
                          </p>
                          <p className="text-xs text-[var(--text-tertiary)]">
                            {conv.timeAgo}
                          </p>
                        </div>
                      </div>
                      <Badge variant="secondary">{conv.model}</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={MessageSquare}
                  title="No conversations yet — start one above"
                  className="min-h-[200px] p-4"
                />
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Running Agents */}
        <motion.div variants={slideUp}>
          <Card className="bg-[var(--surface-1)] border-[var(--border-subtle)] rounded-[var(--radius-lg)] h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-[var(--text-secondary)]" />
                Running Agents
              </CardTitle>
            </CardHeader>
            <CardContent>
              {RUNNING_AGENTS.length > 0 ? (
                <div className="space-y-4">
                  {RUNNING_AGENTS.map((agent) => (
                    <div
                      key={agent.id}
                      className="flex items-center justify-between p-3 rounded-[var(--radius-md)] bg-[var(--surface-0)] border border-[var(--border-subtle)]"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-[var(--radius-full)] bg-[var(--surface-2)]">
                          <Cpu className="h-4 w-4 text-[var(--text-secondary)]" />
                        </div>
                        <span className="text-sm font-medium text-[var(--text-primary)]">
                          {agent.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className="capitalize flex items-center gap-1.5"
                        >
                          <StatusDot colorClass={agent.color} />
                          <span>{agent.status}</span>
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={Activity}
                  title="No agents running"
                  className="min-h-[200px] p-4"
                />
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Model Status */}
        <motion.div variants={slideUp}>
          <Card className="bg-[var(--surface-1)] border-[var(--border-subtle)] rounded-[var(--radius-lg)] h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cpu className="h-5 w-5 text-[var(--text-secondary)]" />
                Model Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              {MODEL_STATUS.length > 0 ? (
                <div className="space-y-4">
                  {MODEL_STATUS.map((model) => (
                    <div
                      key={model.id}
                      className="flex items-center justify-between p-3 rounded-[var(--radius-md)] bg-[var(--surface-0)] border border-[var(--border-subtle)]"
                    >
                      <span className="text-sm font-medium text-[var(--text-primary)]">
                        {model.name}
                      </span>
                      <div className="flex items-center gap-2">
                        {model.status === "connected" ? (
                          <CheckCircle2 className="h-4 w-4 text-[var(--success)]" />
                        ) : (
                          <XCircle className="h-4 w-4 text-[var(--error)]" />
                        )}
                        <span className="text-xs text-[var(--text-secondary)] capitalize">
                          {model.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={Cpu}
                  title="No models available"
                  className="min-h-[200px] p-4"
                />
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Activity Feed */}
        <motion.div variants={slideUp}>
          <Card className="bg-[var(--surface-1)] border-[var(--border-subtle)] rounded-[var(--radius-lg)] h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-[var(--text-secondary)]" />
                Activity Feed
              </CardTitle>
            </CardHeader>
            <CardContent>
              {ACTIVITY_FEED.length > 0 ? (
                <div className="space-y-4">
                  {ACTIVITY_FEED.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3">
                      <div className="mt-0.5 p-1.5 rounded-[var(--radius-full)] bg-[var(--surface-2)]">
                        <activity.icon className="h-3 w-3 text-[var(--text-secondary)]" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm text-[var(--text-primary)]">
                          {activity.desc}
                        </p>
                        <p className="text-xs text-[var(--text-tertiary)]">
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={Clock}
                  title="No recent activity"
                  className="min-h-[200px] p-4"
                />
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Memory Summary */}
        <motion.div variants={slideUp} className="md:col-span-2">
          <Card className="bg-[var(--surface-1)] border-[var(--border-subtle)] rounded-[var(--radius-lg)]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-[var(--text-secondary)]" />
                Memory Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              {MEMORY_STATS ? (
                <div className="flex flex-col sm:flex-row items-center justify-between p-6 rounded-[var(--radius-md)] bg-[var(--surface-0)] border border-[var(--border-subtle)]">
                  <div className="flex items-center gap-4 mb-4 sm:mb-0">
                    <div className="p-4 rounded-[var(--radius-full)] bg-[var(--brand-primary)]/10">
                      <Database className="h-8 w-8 text-[var(--brand-primary)]" />
                    </div>
                    <div>
                      <h4 className="text-2xl font-bold text-[var(--text-primary)]">
                        {MEMORY_STATS.count}
                      </h4>
                      <p className="text-sm text-[var(--text-secondary)]">
                        memories stored
                      </p>
                    </div>
                  </div>
                  <div className="text-center sm:text-right">
                    <p className="text-sm text-[var(--text-secondary)]">
                      Last updated
                    </p>
                    <p className="text-sm font-medium text-[var(--text-primary)]">
                      {MEMORY_STATS.lastUpdated}
                    </p>
                  </div>
                </div>
              ) : (
                <EmptyState
                  icon={Database}
                  title="Memory system not configured"
                  className="min-h-[150px] p-4"
                />
              )}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}
