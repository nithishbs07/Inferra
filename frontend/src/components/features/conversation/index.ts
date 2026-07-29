/**
 * Inferra — Conversation Components
 *
 * Barrel export for all Phase 3 conversation experience components.
 */

// Core message components
export { MessageBubble } from "./message-bubble";
export type { MessageBubbleProps, MessageRole } from "./message-bubble";
export {
  AssistantMessage,
  ErrorMessage,
  SystemMessage,
  ThinkingMessage,
  ToolMessage,
  UserMessage,
} from "./message-variants";

// Code experience
export { CodeBlock } from "./code-block";

// AI state visualization
export { AIThinkingIndicator } from "./ai-thinking";
export type { AIThinkingState } from "./ai-thinking";

// Agent timeline
export { AgentTimeline, AgentStateIndicator } from "./agent-timeline";

// Tool execution
export { ToolCard } from "./tool-card";

// Message interactions
export { MessageActions } from "./message-actions";

// Attachments
export { AttachmentCard, AttachmentGrid } from "./attachment-card";
export type { AttachmentType, AttachmentCardProps } from "./attachment-card";

// Panels
export { InspectorPanel } from "./inspector-panel";
export { ArtifactPanel } from "./artifact-panel";
export { ActivityFeed, ExecutionTimeline } from "./execution-activity";

// Layout
export { SplitView } from "./split-view";

// History
export { ConversationHistory } from "./conversation-history";
export type { ConversationItem, HistoryFilter } from "./conversation-history";
