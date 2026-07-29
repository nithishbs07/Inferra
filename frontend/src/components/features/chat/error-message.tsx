import React from "react";
import { useTranslation } from "react-i18next";
import { AlertTriangle, ChevronDown, ChevronUp } from "lucide-react";
import i18n from "#/i18n";
import { MarkdownRenderer } from "../markdown/markdown-renderer";

interface ErrorMessageProps {
  errorId?: string;
  defaultMessage: string;
}

export function ErrorMessage({ errorId, defaultMessage }: ErrorMessageProps) {
  const { t } = useTranslation();
  const [showDetails, setShowDetails] = React.useState(false);

  const hasValidTranslationId = !!errorId && i18n.exists(errorId);
  const errorKey = hasValidTranslationId
    ? errorId
    : "CHAT_INTERFACE$AGENT_ERROR_MESSAGE";

  return (
    <div className="my-3 w-full rounded-[var(--radius-lg)] border border-[var(--error)]/35 bg-[var(--error-muted)]/40 p-4 text-sm shadow-sm">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 rounded-full bg-[var(--error-muted)] p-1.5 text-[var(--error)]">
          <AlertTriangle size={16} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="font-semibold text-[var(--error)]">
            {t(errorKey)}
            <button
              type="button"
              onClick={() => setShowDetails((prev) => !prev)}
              className="ml-2 rounded-[var(--radius-sm)] p-1 text-[var(--error)] transition-colors hover:bg-[var(--error-muted)]"
              aria-expanded={showDetails}
              aria-label="Toggle technical error details"
            >
              {showDetails ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>
          </div>
          <p className="mt-1 text-xs leading-relaxed text-[var(--text-secondary)]">
            The agent stopped before completing this step. You can review the
            technical details below.
          </p>
        </div>
      </div>

      {showDetails && (
        <div className="mt-3 border-t border-[var(--error)]/20 pt-3 text-xs text-[var(--text-secondary)]">
          <MarkdownRenderer>{defaultMessage}</MarkdownRenderer>
        </div>
      )}
    </div>
  );
}
