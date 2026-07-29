/**
 * Inferra — Workspace Split View
 *
 * Resizable split pane layout for the conversation workspace.
 * Supports Conversation + Browser/Terminal/Files side by side.
 *
 * Uses the ResizeHandle from the Phase 1 component library for drag-to-resize.
 *
 * Layout modes:
 * - `single` — Full-width content
 * - `split-right` — Content + right panel
 * - `split-bottom` — Content + bottom panel
 *
 * Props:
 * - `mainContent` — Primary content (usually the conversation)
 * - `secondaryContent` — Secondary content (browser, terminal, files)
 * - `direction` — 'horizontal' | 'vertical'
 * - `defaultSize` — Default secondary panel size as fraction (0-1). Default: 0.4
 * - `minSize` — Minimum secondary panel size as fraction. Default: 0.2
 * - `maxSize` — Maximum secondary panel size as fraction. Default: 0.7
 * - `isOpen` — Whether the secondary panel is visible
 * - `onClose` — Callback when panel is closed
 *
 * @module split-view
 */

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, GripVertical, GripHorizontal } from "lucide-react";
import { cn } from "#/lib/utils";

interface SplitViewProps {
  mainContent: React.ReactNode;
  secondaryContent?: React.ReactNode;
  direction?: "horizontal" | "vertical";
  defaultSize?: number;
  minSize?: number;
  maxSize?: number;
  isOpen?: boolean;
  onClose?: () => void;
  className?: string;
}

export function SplitView({
  mainContent,
  secondaryContent,
  direction = "horizontal",
  defaultSize = 0.4,
  minSize = 0.2,
  maxSize = 0.7,
  isOpen = false,
  onClose,
  className,
}: SplitViewProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [size, setSize] = React.useState(defaultSize);
  const [isDragging, setIsDragging] = React.useState(false);

  const isHorizontal = direction === "horizontal";

  const handleDragStart = React.useCallback(() => {
    setIsDragging(true);
    document.body.style.cursor = isHorizontal ? "col-resize" : "row-resize";
    document.body.style.userSelect = "none";
  }, [isHorizontal]);

  const handleDrag = React.useCallback(
    (e: MouseEvent) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      let newSize: number;

      if (isHorizontal) {
        const x = e.clientX - rect.left;
        newSize = 1 - x / rect.width;
      } else {
        const y = e.clientY - rect.top;
        newSize = 1 - y / rect.height;
      }

      newSize = Math.max(minSize, Math.min(maxSize, newSize));
      setSize(newSize);
    },
    [isHorizontal, minSize, maxSize],
  );

  const handleDragEnd = React.useCallback(() => {
    setIsDragging(false);
    document.body.style.cursor = "";
    document.body.style.userSelect = "";
  }, []);

  React.useEffect(() => {
    if (!isDragging) return;

    const onMouseMove = (e: MouseEvent) => handleDrag(e);
    const onMouseUp = () => handleDragEnd();

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [isDragging, handleDrag, handleDragEnd]);

  const mainStyle: React.CSSProperties = isOpen
    ? isHorizontal
      ? { width: `${(1 - size) * 100}%` }
      : { height: `${(1 - size) * 100}%` }
    : { width: "100%", height: "100%" };

  const secondaryStyle: React.CSSProperties = isHorizontal
    ? { width: `${size * 100}%` }
    : { height: `${size * 100}%` };

  return (
    <div
      ref={containerRef}
      className={cn(
        "flex h-full overflow-hidden",
        isHorizontal ? "flex-row" : "flex-col",
        className,
      )}
    >
      {/* Main Content */}
      <div
        className="flex-shrink-0 overflow-hidden transition-[width,height] duration-200"
        style={mainStyle}
      >
        {mainContent}
      </div>

      {/* Resize Handle + Secondary Panel */}
      <AnimatePresence>
        {isOpen && secondaryContent && (
          <>
            {/* Resize Handle */}
            <div
              role="separator"
              aria-orientation={isHorizontal ? "vertical" : "horizontal"}
              aria-label="Resize panel"
              tabIndex={0}
              onMouseDown={handleDragStart}
              onKeyDown={(e) => {
                const step = 0.05;
                if (
                  (isHorizontal && e.key === "ArrowLeft") ||
                  (!isHorizontal && e.key === "ArrowUp")
                ) {
                  setSize((s) => Math.min(maxSize, s + step));
                } else if (
                  (isHorizontal && e.key === "ArrowRight") ||
                  (!isHorizontal && e.key === "ArrowDown")
                ) {
                  setSize((s) => Math.max(minSize, s - step));
                }
              }}
              className={cn(
                "flex items-center justify-center flex-shrink-0",
                "bg-[var(--surface-0)] hover:bg-[var(--surface-hover)]",
                "transition-colors duration-[var(--duration-fast)]",
                "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--brand-primary)]",
                isHorizontal
                  ? "w-2 cursor-col-resize border-x border-[var(--border-subtle)]"
                  : "h-2 cursor-row-resize border-y border-[var(--border-subtle)]",
                isDragging && "bg-[var(--brand-primary-muted)]",
              )}
            >
              {isHorizontal ? (
                <GripVertical
                  size={10}
                  className="text-[var(--text-tertiary)]"
                />
              ) : (
                <GripHorizontal
                  size={10}
                  className="text-[var(--text-tertiary)]"
                />
              )}
            </div>

            {/* Secondary Panel */}
            <motion.div
              initial={
                isHorizontal ? { x: 20, opacity: 0 } : { y: 20, opacity: 0 }
              }
              animate={{ x: 0, y: 0, opacity: 1 }}
              exit={
                isHorizontal ? { x: 20, opacity: 0 } : { y: 20, opacity: 0 }
              }
              transition={{ duration: 0.2 }}
              className="flex-shrink-0 overflow-hidden relative"
              style={secondaryStyle}
            >
              {/* Close button */}
              {onClose && (
                <button
                  type="button"
                  onClick={onClose}
                  className={cn(
                    "absolute top-2 right-2 z-10",
                    "w-6 h-6 rounded-[var(--radius-sm)] flex items-center justify-center",
                    "text-[var(--text-tertiary)] hover:text-[var(--text-primary)]",
                    "hover:bg-[var(--surface-hover)]",
                    "transition-colors duration-[var(--duration-fast)]",
                  )}
                  aria-label="Close panel"
                >
                  <X size={14} />
                </button>
              )}
              {secondaryContent}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
