/**
 * Inferra — Attachment Card
 *
 * Beautiful file attachment cards supporting multiple file types.
 * Used in message content when users attach files.
 *
 * Supported types: image, pdf, code, csv, json, zip, text, unknown
 *
 * @module attachment-card
 */

import React from "react";
import { motion } from "framer-motion";
import {
  Image,
  FileText,
  Code,
  Table2,
  FileJson,
  Archive,
  File,
  Download,
  X,
} from "lucide-react";
import { cn } from "#/lib/utils";
import { hoverLift } from "#/lib/motion";

export type AttachmentType =
  | "image"
  | "pdf"
  | "code"
  | "csv"
  | "json"
  | "zip"
  | "text"
  | "unknown";

export interface AttachmentCardProps {
  /** File name */
  name: string;
  /** File type */
  type: AttachmentType;
  /** File size (human-readable, e.g., "2.4 KB") */
  size?: string;
  /** Preview URL (for images) */
  previewUrl?: string;
  /** Download URL */
  downloadUrl?: string;
  /** Whether the attachment can be removed */
  removable?: boolean;
  /** Remove callback */
  onRemove?: () => void;
  /** Click callback (for preview/expand) */
  onClick?: () => void;
  /** Additional CSS */
  className?: string;
}

const ICONS: Record<AttachmentType, React.ElementType> = {
  image: Image,
  pdf: FileText,
  code: Code,
  csv: Table2,
  json: FileJson,
  zip: Archive,
  text: FileText,
  unknown: File,
};

const TYPE_COLORS: Record<AttachmentType, string> = {
  image: "text-[var(--info)]",
  pdf: "text-[var(--error)]",
  code: "text-[var(--brand-primary)]",
  csv: "text-[var(--success)]",
  json: "text-[var(--warning)]",
  zip: "text-[var(--text-secondary)]",
  text: "text-[var(--text-secondary)]",
  unknown: "text-[var(--text-tertiary)]",
};

const TYPE_LABELS: Record<AttachmentType, string> = {
  image: "Image",
  pdf: "PDF",
  code: "Code",
  csv: "CSV",
  json: "JSON",
  zip: "Archive",
  text: "Text",
  unknown: "File",
};

export function AttachmentCard({
  name,
  type,
  size,
  previewUrl,
  downloadUrl,
  removable = false,
  onRemove,
  onClick,
  className,
}: AttachmentCardProps) {
  const Icon = ICONS[type];
  const iconColor = TYPE_COLORS[type];

  return (
    <motion.div
      {...hoverLift}
      onClick={onClick}
      className={cn(
        "relative group inline-flex items-center gap-3",
        "px-3 py-2.5 rounded-[var(--radius-lg)]",
        "bg-[var(--surface-1)] border border-[var(--border-subtle)]",
        "hover:border-[var(--border-default)]",
        "transition-colors duration-[var(--duration-fast)]",
        onClick && "cursor-pointer",
        "max-w-[280px]",
        className,
      )}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {/* Image Preview */}
      {type === "image" && previewUrl ? (
        <div className="w-10 h-10 rounded-[var(--radius-md)] overflow-hidden flex-shrink-0 bg-[var(--surface-2)]">
          <img
            src={previewUrl}
            alt={name}
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div
          className={cn(
            "w-10 h-10 rounded-[var(--radius-md)] flex items-center justify-center flex-shrink-0",
            "bg-[var(--surface-2)]",
          )}
        >
          <Icon size={18} className={iconColor} />
        </div>
      )}

      {/* File Info */}
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-[var(--text-primary)] truncate">
          {name}
        </p>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className="text-[10px] text-[var(--text-tertiary)]">
            {TYPE_LABELS[type]}
          </span>
          {size && (
            <>
              <span className="text-[var(--text-tertiary)]">·</span>
              <span className="text-[10px] text-[var(--text-tertiary)] font-[var(--font-mono)]">
                {size}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
        {downloadUrl && (
          <a
            href={downloadUrl}
            download={name}
            onClick={(e) => e.stopPropagation()}
            className={cn(
              "flex items-center justify-center w-6 h-6 rounded-[var(--radius-sm)]",
              "text-[var(--text-tertiary)] hover:text-[var(--text-primary)]",
              "hover:bg-[var(--surface-hover)]",
            )}
            aria-label={`Download ${name}`}
          >
            <Download size={12} />
          </a>
        )}
      </div>

      {/* Remove button */}
      {removable && onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className={cn(
            "absolute -top-1.5 -right-1.5",
            "w-5 h-5 rounded-full flex items-center justify-center",
            "bg-[var(--surface-3)] border border-[var(--border-subtle)]",
            "text-[var(--text-tertiary)] hover:text-[var(--text-primary)]",
            "hover:bg-[var(--surface-hover)]",
            "opacity-0 group-hover:opacity-100",
            "transition-all duration-150",
          )}
          aria-label={`Remove ${name}`}
        >
          <X size={10} />
        </button>
      )}
    </motion.div>
  );
}

// ─── Attachment Grid ─────────────────────────────────────

interface AttachmentGridProps {
  children: React.ReactNode;
  className?: string;
}

export function AttachmentGrid({ children, className }: AttachmentGridProps) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>{children}</div>
  );
}
