import * as React from "react";
import { motion } from "framer-motion";
import { Copy, Pencil, RefreshCw, Trash2, Pin, Bookmark } from "lucide-react";
import { cn } from "#/lib/utils";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "#/components/ui/tooltip";

/**
 * Hover-revealed toolbar that appears above/to the right of any message.
 *
 * @description Provides contextual actions for a message like copy, edit, delete, pin, and bookmark.
 * Features a staggered fade-in animation and hover interactions.
 *
 * @param {MessageActionsProps} props - The component props
 * @returns {JSX.Element} The rendered message actions toolbar
 *
 * @example
 * <MessageActions
 *   messageId="msg-1"
 *   isUser={true}
 *   onCopy={() => console.log('copy')}
 *   onEdit={() => console.log('edit')}
 * />
 */
export interface MessageActionsProps {
  /** The message ID */
  messageId: string;
  /** Whether it's a user message (affects available actions like edit/retry) */
  isUser: boolean;
  /** Copy callback */
  onCopy?: () => void;
  /** Edit callback (user messages only) */
  onEdit?: () => void;
  /** Retry callback (user messages only) */
  onRetry?: () => void;
  /** Delete callback */
  onDelete?: () => void;
  /** Pin callback */
  onPin?: () => void;
  /** Bookmark callback */
  onBookmark?: () => void;
  /** Additional CSS classes */
  className?: string;
}

export const MessageActions = React.forwardRef<
  HTMLDivElement,
  MessageActionsProps
>(
  (
    {
      messageId,
      isUser,
      onCopy,
      onEdit,
      onRetry,
      onDelete,
      onPin,
      onBookmark,
      className,
      ...props
    },
    ref,
  ) => (
    <TooltipProvider delayDuration={300}>
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 5 }}
        transition={{ duration: 0.15, ease: "easeOut" }}
        className={cn(
          "absolute top-0 right-0 -mt-3 mr-2 z-10 flex items-center gap-1 p-1 bg-[var(--surface-2)] border border-[var(--border-subtle)] rounded-[var(--radius-md)] shadow-[var(--shadow-md)]",
          className,
        )}
        {...props}
      >
        {onPin && (
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={onPin}
                className="flex items-center justify-center w-7 h-7 rounded-[var(--radius-sm)] text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
                aria-label="Pin message"
              >
                <Pin className="w-4 h-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Pin message</p>
            </TooltipContent>
          </Tooltip>
        )}

        {onBookmark && (
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={onBookmark}
                className="flex items-center justify-center w-7 h-7 rounded-[var(--radius-sm)] text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
                aria-label="Bookmark message"
              >
                <Bookmark className="w-4 h-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Bookmark message</p>
            </TooltipContent>
          </Tooltip>
        )}

        {onCopy && (
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={onCopy}
                className="flex items-center justify-center w-7 h-7 rounded-[var(--radius-sm)] text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
                aria-label="Copy message"
              >
                <Copy className="w-4 h-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Copy message</p>
            </TooltipContent>
          </Tooltip>
        )}

        {isUser && onEdit && (
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={onEdit}
                className="flex items-center justify-center w-7 h-7 rounded-[var(--radius-sm)] text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
                aria-label="Edit message"
              >
                <Pencil className="w-4 h-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Edit message</p>
            </TooltipContent>
          </Tooltip>
        )}

        {isUser && onRetry && (
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={onRetry}
                className="flex items-center justify-center w-7 h-7 rounded-[var(--radius-sm)] text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
                aria-label="Retry message"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Retry message</p>
            </TooltipContent>
          </Tooltip>
        )}

        {onDelete && (
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={onDelete}
                className="flex items-center justify-center w-7 h-7 rounded-[var(--radius-sm)] text-[var(--text-secondary)] hover:bg-red-500/10 hover:text-red-500 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                aria-label="Delete message"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Delete message</p>
            </TooltipContent>
          </Tooltip>
        )}
      </motion.div>
    </TooltipProvider>
  ),
);
MessageActions.displayName = "MessageActions";
