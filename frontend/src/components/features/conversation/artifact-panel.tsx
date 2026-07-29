/**
 * @file artifact-panel.tsx
 * @description A panel for viewing artifacts generated during the conversation.
 * @props ArtifactPanelProps
 * @accessibility WCAG AA, Keyboard navigable
 */
import * as React from "react";
import { motion } from "framer-motion";
import {
  FileCode,
  File,
  Image as ImageIcon,
  FileText,
  Table2,
  Download,
} from "lucide-react";
import { cn } from "#/lib/utils";
import { Card, CardContent } from "#/components/ui/card";
import { EmptyState } from "#/components/ui/empty-state";
import { Badge } from "#/components/ui/badge";
import { ScrollArea } from "#/components/ui/scroll-area";
import { useFilteredEvents } from "#/hooks/use-filtered-events";
import { isActionEvent, isObservationEvent } from "#/types/v1/type-guards";
import { getObservationContent } from "#/components/v1/chat/event-content-helpers/get-observation-content";

export type ArtifactType =
  | "code"
  | "file"
  | "image"
  | "report"
  | "table"
  | "download";

export interface Artifact {
  id: string;
  type: ArtifactType;
  title: string;
  language?: string;
  preview?: string;
  size?: string;
  timestamp: string;
}

export interface ArtifactPanelProps {
  artifacts?: Artifact[];
  className?: string;
}

function getArtifactsFromEvents(
  events: ReturnType<typeof useFilteredEvents>["v1FullEvents"],
): Artifact[] {
  const actionById = new Map(
    events.filter(isActionEvent).map((event) => [event.id, event]),
  );
  return events.filter(isObservationEvent).flatMap((event) => {
    const action = actionById.get(event.action_id);
    const kind = action?.action.kind || "";
    if (!/(FileEditor|StrReplace|Write|Browser|IPython|ExecuteBash)/.test(kind))
      return [];
    const content = getObservationContent(event);
    if (!content) return [];
    const type: ArtifactType = /FileEditor|StrReplace|Write/.test(kind)
      ? "code"
      : /Browser/.test(kind)
        ? "image"
        : "report";
    return [
      {
        id: event.id,
        type,
        title: action?.summary || action?.tool_name || kind,
        preview: content,
        timestamp: event.timestamp
          ? new Date(event.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
          : "",
      },
    ];
  });
}

const getArtifactIcon = (type: ArtifactType) => {
  switch (type) {
    case "code":
      return <FileCode className="w-5 h-5" />;
    case "image":
      return <ImageIcon className="w-5 h-5" />;
    case "report":
      return <FileText className="w-5 h-5" />;
    case "table":
      return <Table2 className="w-5 h-5" />;
    case "download":
      return <Download className="w-5 h-5" />;
    case "file":
    default:
      return <File className="w-5 h-5" />;
  }
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: import("framer-motion").Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
};

export const ArtifactPanel = React.forwardRef<
  HTMLDivElement,
  ArtifactPanelProps
>((props, ref) => {
  const { v1FullEvents } = useFilteredEvents();
  const derivedArtifacts = React.useMemo(
    () => getArtifactsFromEvents(v1FullEvents),
    [v1FullEvents],
  );
  const { artifacts = derivedArtifacts, className, ...rest } = props;

  return (
    <div
      ref={ref}
      className={cn(
        "flex flex-col h-full bg-[var(--surface-0)] text-[var(--text-primary)]",
        className,
      )}
      {...rest}
    >
      <div className="p-4 border-b border-[var(--border-subtle)]">
        <h2 className="text-lg font-semibold">Artifacts</h2>
        <p className="text-sm text-[var(--text-secondary)]">
          Files and generated content from this session.
        </p>
      </div>

      <ScrollArea className="flex-1 p-4">
        {artifacts.length === 0 ? (
          <EmptyState
            icon={File}
            title="No artifacts yet"
            description="Artifacts generated during the conversation will appear here."
            className="mt-12"
          />
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col gap-3"
          >
            {artifacts.map((artifact) => (
              <motion.div key={artifact.id} variants={itemVariants}>
                <Card className="hover:bg-[var(--surface-2)] transition-colors cursor-pointer border-[var(--border-subtle)] bg-[var(--surface-1)]">
                  <CardContent className="p-3 flex items-start gap-3">
                    <div className="mt-1 p-2 rounded-md bg-[var(--surface-2)] text-[var(--text-secondary)]">
                      {getArtifactIcon(artifact.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="text-sm font-medium truncate">
                          {artifact.title}
                        </h3>
                        <span className="text-[10px] text-[var(--text-tertiary)] whitespace-nowrap">
                          {artifact.timestamp}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge
                          variant="secondary"
                          className="text-[10px] px-1.5 py-0 capitalize"
                        >
                          {artifact.type}
                        </Badge>
                        {artifact.language && (
                          <span className="text-xs text-[var(--text-secondary)] truncate">
                            {artifact.language}
                          </span>
                        )}
                        {artifact.size && (
                          <span className="text-xs text-[var(--text-secondary)] whitespace-nowrap ml-auto">
                            {artifact.size}
                          </span>
                        )}
                      </div>
                      {artifact.preview && (
                        <p className="text-xs text-[var(--text-secondary)] mt-2 line-clamp-2">
                          {artifact.preview}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </ScrollArea>
    </div>
  );
});

ArtifactPanel.displayName = "ArtifactPanel";
