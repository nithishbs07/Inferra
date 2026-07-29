import React from "react";
import { MessageBubble, type MessageBubbleProps } from "./message-bubble";

type SharedMessageProps = Omit<MessageBubbleProps, "role">;

/** Role-specific message primitives keep event rendering declarative and consistent. */
export const UserMessage = React.memo((props: SharedMessageProps) => (
  <MessageBubble {...props} role="user" />
));

export const AssistantMessage = React.memo((props: SharedMessageProps) => (
  <MessageBubble {...props} role="assistant" />
));

export const SystemMessage = React.memo((props: SharedMessageProps) => (
  <MessageBubble {...props} role="system" />
));

export const ToolMessage = React.memo((props: SharedMessageProps) => (
  <MessageBubble {...props} role="assistant" name={props.name ?? "Tool"} />
));

export const ThinkingMessage = React.memo((props: SharedMessageProps) => (
  <MessageBubble {...props} role="assistant" name={props.name ?? "Thinking"} />
));

export const ErrorMessage = React.memo((props: SharedMessageProps) => (
  <MessageBubble {...props} role="system" name={props.name ?? "Error"} />
));
