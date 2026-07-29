/**
 * Inferra — Premium Message Bubble
 *
 * The core message rendering component for the conversation experience.
 * Replaces plain text messages with rich, structured, card-based messages.
 *
 * Features:
 * - User / Assistant / System message variants
 * - Rich markdown content with syntax highlighting
 * - Streaming support (animated cursor, progressive rendering)
 * - Tool call cards inline
 * - Message actions on hover (copy, edit, retry, etc.)
 * - Timestamp, model badge
 * - Avatar
 * - Collapsible long messages
 *
 * @module message-bubble
 */

import React from "react";
import { motion } from "framer-motion";
import { Bot, User, Info, Copy, Check } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "#/lib/utils";
import { slideUp } from "#/lib/motion";
import { CodeBlock } from "./code-block";

// ─── Types ─────────────────────────────────────────────

export type MessageRole = "user" | "assistant" | "system";

export interface MessageBubbleProps {
  /** Unique message ID */
  id: string;
  /** Message role */
  role: MessageRole;
  /** Message content (rendered as-is — markdown parsing handled upstream) */
  children: React.ReactNode;
  /** Optional avatar URL */
  avatarUrl?: string;
  /** Optional display name */
  name?: string;
  /** Optional model name (for assistant messages) */
  model?: string;
  /** Timestamp string */
  timestamp?: string;
  /** Whether the message is currently streaming */
  isStreaming?: boolean;
  /** Whether this is the last message (for scroll anchoring) */
  isLast?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Actions toolbar content (injected from parent) */
  actions?: React.ReactNode;
}

const MessageBubble = React.memo(
  React.forwardRef<HTMLDivElement, MessageBubbleProps>(
    (
      {
        id,
        role,
        children,
        avatarUrl,
        name,
        model,
        timestamp,
        isStreaming = false,
        isLast = false,
        className,
        actions,
      },
      ref,
    ) => {
      const [copied, setCopied] = React.useState(false);

      const isUser = role === "user";
      const isSystem = role === "system";

      const handleCopy = React.useCallback(async () => {
        const el = document.getElementById(`msg-content-${id}`);
        if (!el) return;
        try {
          await navigator.clipboard.writeText(el.textContent || "");
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch {
          /* noop */
        }
      }, [id]);

      return (
        <motion.div
          ref={ref}
          variants={slideUp}
          initial="initial"
          animate="animate"
          data-message-id={id}
          data-role={role}
          className={cn(
            "group relative flex gap-3 px-4 py-3 md:px-6",
            // Hover state
            "hover:bg-[var(--surface-hover)] transition-colors duration-[var(--duration-fast)]",
            // System messages are subdued
            isSystem && "opacity-70",
            className,
          )}
        >
          {/* Avatar */}
          <div className="flex-shrink-0 pt-0.5">
            <MessageAvatar role={role} avatarUrl={avatarUrl} name={name} />
          </div>

          {/* Content Column */}
          <div className="flex-1 min-w-0 space-y-1">
            {/* Header: Name + Model + Timestamp */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-semibold text-[var(--text-primary)]">
                {name || (isUser ? "You" : isSystem ? "System" : "Assistant")}
              </span>
              {model && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-[var(--radius-sm)] bg-[var(--surface-2)] text-[var(--text-tertiary)] font-[var(--font-mono)]">
                  {model}
                </span>
              )}
              {timestamp && (
                <span className="text-[10px] text-[var(--text-tertiary)] font-[var(--font-mono)]">
                  {timestamp}
                </span>
              )}
            </div>

            {/* Message Content */}
            <div
              id={`msg-content-${id}`}
              className={cn(
                "text-sm leading-relaxed text-[var(--text-primary)]",
                // User messages have slightly different styling
                isUser && "text-[var(--text-primary)]",
                // System messages use secondary text
                isSystem && "text-[var(--text-secondary)] italic text-xs",
                // Prose-like styling for assistant messages
                !isUser &&
                  !isSystem &&
                  "prose-p:mb-3 prose-li:mb-1 prose-headings:mb-2 prose-headings:mt-4",
              )}
            >
              {typeof children === "string" ? (
                <RichMessageContent content={children} />
              ) : (
                children
              )}

              {/* Streaming cursor */}
              {isStreaming && (
                <motion.span
                  className="inline-block w-[2px] h-4 bg-[var(--brand-primary)] ml-0.5 align-text-bottom"
                  animate={{ opacity: [1, 0] }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  aria-hidden="true"
                />
              )}
            </div>
          </div>

          {/* Hover Actions */}
          <div className="absolute top-2 right-4 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
            <QuickAction
              onClick={handleCopy}
              aria-label={copied ? "Copied" : "Copy message"}
            >
              {copied ? (
                <Check size={14} className="text-[var(--success)]" />
              ) : (
                <Copy size={14} />
              )}
            </QuickAction>
            {actions}
          </div>
        </motion.div>
      );
    },
  ),
);
MessageBubble.displayName = "MessageBubble";

export { MessageBubble };

// ─── Message Avatar ──────────────────────────────────────

interface MessageAvatarProps {
  role: MessageRole;
  avatarUrl?: string;
  name?: string;
}

const RichMessageContent = React.memo(({ content }: { content: string }) => (
  <ReactMarkdown
    remarkPlugins={[remarkGfm]}
    components={{
      p: ({ children }) => <p className="mb-3 last:mb-0">{children}</p>,
      h1: ({ children }) => (
        <h1 className="mb-3 mt-5 text-xl font-semibold tracking-tight first:mt-0">
          {children}
        </h1>
      ),
      h2: ({ children }) => (
        <h2 className="mb-3 mt-5 text-lg font-semibold tracking-tight first:mt-0">
          {children}
        </h2>
      ),
      h3: ({ children }) => (
        <h3 className="mb-2 mt-4 text-base font-semibold first:mt-0">
          {children}
        </h3>
      ),
      ul: ({ children }) => (
        <ul className="mb-3 list-disc space-y-1 pl-5 last:mb-0">{children}</ul>
      ),
      ol: ({ children }) => (
        <ol className="mb-3 list-decimal space-y-1 pl-5 last:mb-0">
          {children}
        </ol>
      ),
      blockquote: ({ children }) => (
        <blockquote className="my-3 border-l-2 border-[var(--brand-primary)] pl-3 text-[var(--text-secondary)]">
          {children}
        </blockquote>
      ),
      a: ({ children, href }) => (
        <a
          href={href}
          className="text-[var(--brand-primary)] underline underline-offset-2"
          target="_blank"
          rel="noreferrer"
        >
          {children}
        </a>
      ),
      code: ({ className, children, ...props }) => {
        const language = /language-(\w+)/.exec(className || "")?.[1];
        const code = String(children).replace(/\n$/, "");
        if (language)
          return <CodeBlock code={code} language={language} className="my-3" />;
        return (
          <code
            {...props}
            className="rounded bg-[var(--surface-2)] px-1.5 py-0.5 font-[var(--font-mono)] text-[0.85em]"
          >
            {children}
          </code>
        );
      },
    }}
  >
    {content}
  </ReactMarkdown>
));

const MessageAvatar = React.memo(
  ({ role, avatarUrl, name }: MessageAvatarProps) => {
    const isUser = role === "user";
    const isSystem = role === "system";

    if (avatarUrl) {
      return (
        <img
          src={avatarUrl}
          alt={name || "Avatar"}
          className="w-8 h-8 rounded-full object-cover"
        />
      );
    }

    const bgColor = isUser
      ? "bg-[var(--surface-3)]"
      : isSystem
        ? "bg-[var(--surface-2)]"
        : "bg-[var(--brand-primary-muted)]";

    const iconColor = isUser
      ? "text-[var(--text-secondary)]"
      : isSystem
        ? "text-[var(--text-tertiary)]"
        : "text-[var(--brand-primary)]";

    return (
      <div
        className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center",
          bgColor,
        )}
      >
        {isUser ? (
          <User size={16} className={iconColor} />
        ) : isSystem ? (
          <Info size={16} className={iconColor} />
        ) : (
          <Bot size={16} className={iconColor} />
        )}
      </div>
    );
  },
);

// ─── Quick Action Button ──────────────────────────────────

function QuickAction({
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={cn(
        "flex items-center justify-center w-7 h-7 rounded-[var(--radius-sm)]",
        "text-[var(--text-tertiary)] hover:text-[var(--text-primary)]",
        "hover:bg-[var(--surface-2)]",
        "transition-colors duration-[var(--duration-fast)]",
        "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--brand-primary)]",
      )}
      {...props}
    >
      {children}
    </button>
  );
}
