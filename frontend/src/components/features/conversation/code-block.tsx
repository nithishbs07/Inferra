/**
 * Inferra — Premium Code Block
 *
 * Modern code block component with:
 * - Syntax highlighting (via CSS classes, compatible with highlight.js/shiki)
 * - Copy to clipboard
 * - Download as file
 * - Collapse / expand for long blocks
 * - Line numbers (optional)
 * - Language badge
 * - Diff view support (lines starting with +/-)
 * - File name header
 *
 * Props:
 * - `code` — The code string
 * - `language` — Language identifier (e.g., "typescript", "python")
 * - `filename` — Optional filename to show in header
 * - `showLineNumbers` — Show line numbers. Default: true for >5 lines
 * - `collapsible` — Allow collapse for long blocks. Default: true if >20 lines
 * - `maxCollapsedLines` — Lines shown when collapsed. Default: 12
 * - `diff` — Enable diff mode (highlight +/- lines)
 * - `className` — Additional classes
 *
 * Accessibility:
 * - `role="region"` with `aria-label`
 * - Copy button has aria feedback
 * - Keyboard navigable toolbar
 *
 * Usage:
 * ```tsx
 * <CodeBlock
 *   code="const x = 1;"
 *   language="typescript"
 *   filename="index.ts"
 * />
 * ```
 */

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Copy,
  Check,
  Download,
  ChevronDown,
  ChevronUp,
  FileCode,
} from "lucide-react";
import { cn } from "#/lib/utils";

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  showLineNumbers?: boolean;
  collapsible?: boolean;
  maxCollapsedLines?: number;
  diff?: boolean;
  className?: string;
}

export function CodeBlock({
  code,
  language = "text",
  filename,
  showLineNumbers,
  collapsible,
  maxCollapsedLines = 12,
  diff = false,
  className,
}: CodeBlockProps) {
  const [copied, setCopied] = React.useState(false);
  const [isExpanded, setIsExpanded] = React.useState(false);

  const lines = code.split("\n");
  const lineCount = lines.length;

  // Auto-detect settings
  const shouldShowLineNumbers = showLineNumbers ?? lineCount > 5;
  const isCollapsible = collapsible ?? lineCount > 20;
  const isCollapsed = isCollapsible && !isExpanded;

  const displayedLines = isCollapsed
    ? lines.slice(0, maxCollapsedLines)
    : lines;
  const hiddenLineCount = isCollapsed ? lineCount - maxCollapsedLines : 0;

  const handleCopy = React.useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement("textarea");
      textarea.value = code;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [code]);

  const handleDownload = React.useCallback(() => {
    const ext = LANG_EXTENSIONS[language] || "txt";
    const name = filename || `code.${ext}`;
    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.click();
    URL.revokeObjectURL(url);
  }, [code, language, filename]);

  return (
    <div
      role="region"
      aria-label={filename ? `Code: ${filename}` : `${language} code block`}
      className={cn(
        "group rounded-[var(--radius-lg)] overflow-hidden",
        "border border-[var(--border-subtle)]",
        "bg-[var(--surface-3)]",
        className,
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-[var(--surface-2)] border-b border-[var(--border-subtle)]">
        <div className="flex items-center gap-2 min-w-0">
          <FileCode
            size={14}
            className="text-[var(--text-tertiary)] flex-shrink-0"
          />
          {filename ? (
            <span className="text-xs font-medium text-[var(--text-secondary)] truncate font-[var(--font-mono)]">
              {filename}
            </span>
          ) : (
            <span className="text-xs text-[var(--text-tertiary)] font-[var(--font-mono)]">
              {LANG_LABELS[language] || language}
            </span>
          )}
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-[var(--duration-fast)]">
          {isCollapsible && (
            <ToolbarButton
              onClick={() => setIsExpanded(!isExpanded)}
              aria-label={isExpanded ? "Collapse code" : "Expand code"}
            >
              {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </ToolbarButton>
          )}
          <ToolbarButton onClick={handleDownload} aria-label="Download code">
            <Download size={14} />
          </ToolbarButton>
          <ToolbarButton
            onClick={handleCopy}
            aria-label={copied ? "Copied!" : "Copy code"}
          >
            <AnimatePresence mode="wait">
              {copied ? (
                <motion.span
                  key="check"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="text-[var(--success)]"
                >
                  <Check size={14} />
                </motion.span>
              ) : (
                <motion.span
                  key="copy"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                >
                  <Copy size={14} />
                </motion.span>
              )}
            </AnimatePresence>
          </ToolbarButton>
        </div>
      </div>

      {/* Code content */}
      <div className="overflow-x-auto custom-scrollbar">
        <pre className="p-4 text-sm leading-relaxed font-[var(--font-mono)] text-[var(--text-primary)]">
          <code>
            {displayedLines.map((line, i) => (
              <div
                key={i}
                className={cn("flex", diff && getDiffLineClass(line))}
              >
                {shouldShowLineNumbers && (
                  <span className="select-none w-10 flex-shrink-0 text-right pr-4 text-[var(--text-tertiary)] text-xs leading-relaxed">
                    {i + 1}
                  </span>
                )}
                <span className="flex-1 whitespace-pre">{line || "\n"}</span>
              </div>
            ))}
          </code>
        </pre>
      </div>

      {/* Collapse indicator */}
      {isCollapsed && hiddenLineCount > 0 && (
        <button
          type="button"
          onClick={() => setIsExpanded(true)}
          className={cn(
            "w-full py-2 text-xs text-center",
            "text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]",
            "bg-[var(--surface-2)] border-t border-[var(--border-subtle)]",
            "transition-colors duration-[var(--duration-fast)]",
            "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--brand-primary)]",
          )}
        >
          Show {hiddenLineCount} more line{hiddenLineCount > 1 ? "s" : ""}
        </button>
      )}
    </div>
  );
}

// ─── Toolbar Button ──────────────────────────────────────

function ToolbarButton({
  children,
  onClick,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center justify-center w-7 h-7 rounded-[var(--radius-sm)]",
        "text-[var(--text-tertiary)] hover:text-[var(--text-primary)]",
        "hover:bg-[var(--surface-hover)]",
        "transition-colors duration-[var(--duration-fast)]",
        "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--brand-primary)]",
      )}
      {...props}
    >
      {children}
    </button>
  );
}

// ─── Diff Line Styling ───────────────────────────────────

function getDiffLineClass(line: string): string {
  if (line.startsWith("+")) return "bg-[var(--success-muted)]";
  if (line.startsWith("-")) return "bg-[var(--error-muted)]";
  return "";
}

// ─── Language Labels ─────────────────────────────────────

const LANG_LABELS: Record<string, string> = {
  typescript: "TypeScript",
  javascript: "JavaScript",
  python: "Python",
  rust: "Rust",
  go: "Go",
  java: "Java",
  cpp: "C++",
  c: "C",
  html: "HTML",
  css: "CSS",
  json: "JSON",
  yaml: "YAML",
  markdown: "Markdown",
  bash: "Bash",
  shell: "Shell",
  sql: "SQL",
  graphql: "GraphQL",
  dockerfile: "Dockerfile",
  text: "Plain Text",
  diff: "Diff",
  tsx: "TSX",
  jsx: "JSX",
};

const LANG_EXTENSIONS: Record<string, string> = {
  typescript: "ts",
  javascript: "js",
  python: "py",
  rust: "rs",
  go: "go",
  java: "java",
  cpp: "cpp",
  c: "c",
  html: "html",
  css: "css",
  json: "json",
  yaml: "yml",
  markdown: "md",
  bash: "sh",
  shell: "sh",
  sql: "sql",
  graphql: "graphql",
  dockerfile: "Dockerfile",
  tsx: "tsx",
  jsx: "jsx",
};
