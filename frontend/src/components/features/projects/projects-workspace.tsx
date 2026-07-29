import React from "react";
import { NavLink } from "react-router";
import {
  Activity,
  ArrowDownAZ,
  Grid2X2,
  List,
  Search,
  Sparkles,
} from "lucide-react";
import { usePaginatedConversations } from "#/hooks/query/use-paginated-conversations";
import { cn } from "#/utils/utils";

type View = "grid" | "list";
type Filter = "all" | "active" | "archived";

function formatDate(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

export function ProjectsWorkspace() {
  const { data, isFetching } = usePaginatedConversations(50);
  const [query, setQuery] = React.useState("");
  const [view, setView] = React.useState<View>("grid");
  const [filter, setFilter] = React.useState<Filter>("all");
  const [sortNewest, setSortNewest] = React.useState(true);
  const conversations = data?.pages.flatMap((page) => page.items) ?? [];

  const projects = React.useMemo(() => {
    const groups = new Map<string, typeof conversations>();
    conversations.forEach((conversation) => {
      const key =
        conversation.selected_repository || "Unassigned conversations";
      groups.set(key, [...(groups.get(key) || []), conversation]);
    });
    return [...groups.entries()]
      .map(([name, sessions]) => ({
        name,
        sessions: [...sessions].sort(
          (a, b) =>
            new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
        ),
      }))
      .filter(({ name, sessions }) => {
        const matchesQuery =
          name.toLowerCase().includes(query.toLowerCase()) ||
          sessions.some((session) =>
            (session.title || "").toLowerCase().includes(query.toLowerCase()),
          );
        const matchesFilter =
          filter === "all" ||
          sessions.some((session) =>
            filter === "active"
              ? session.sandbox_status !== "MISSING"
              : session.sandbox_status === "MISSING",
          );
        return matchesQuery && matchesFilter;
      })
      .sort((a, b) =>
        sortNewest
          ? new Date(b.sessions[0].updated_at).getTime() -
            new Date(a.sessions[0].updated_at).getTime()
          : a.name.localeCompare(b.name),
      );
  }, [conversations, filter, query, sortNewest]);

  return (
    <section
      className="mx-auto mt-8 w-full max-w-6xl px-6 pb-10 lg:px-0"
      aria-label="Projects workspace"
    >
      <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-1 flex items-center gap-2 text-[var(--brand-primary)]">
            <Sparkles size={15} />
            <span className="text-xs font-semibold uppercase tracking-[0.16em]">
              Workspace
            </span>
          </div>
          <h2 className="text-2xl font-semibold tracking-tight text-[var(--text-primary)]">
            Projects & sessions
          </h2>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            Projects are organized from the repositories already used by your
            conversations.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setSortNewest((value) => !value)}
            className="inline-flex h-8 items-center gap-1.5 rounded-[var(--radius-sm)] border border-[var(--border-subtle)] px-2.5 text-xs text-[var(--text-secondary)] hover:bg-[var(--surface-hover)]"
          >
            <ArrowDownAZ size={14} />
            {sortNewest ? "Recent" : "Name"}
          </button>
          <button
            type="button"
            onClick={() => setView("grid")}
            className={cn(
              "rounded-[var(--radius-sm)] p-2",
              view === "grid" &&
                "bg-[var(--brand-primary-muted)] text-[var(--brand-primary)]",
            )}
            aria-label="Grid view"
          >
            <Grid2X2 size={15} />
          </button>
          <button
            type="button"
            onClick={() => setView("list")}
            className={cn(
              "rounded-[var(--radius-sm)] p-2",
              view === "list" &&
                "bg-[var(--brand-primary-muted)] text-[var(--brand-primary)]",
            )}
            aria-label="List view"
          >
            <List size={15} />
          </button>
        </div>
      </div>
      <div className="mb-5 flex flex-col gap-2 sm:flex-row">
        <label className="relative min-w-0 flex-1">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]"
          />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search projects and sessions"
            className="h-10 w-full rounded-[var(--radius-md)] border border-[var(--border-subtle)] bg-[var(--surface-1)] pl-9 pr-3 text-sm outline-none transition focus:border-[var(--brand-primary)] focus:ring-2 focus:ring-[var(--brand-primary-muted)]"
          />
        </label>
        <div className="flex gap-1 rounded-[var(--radius-md)] border border-[var(--border-subtle)] bg-[var(--surface-1)] p-1">
          {(["all", "active", "archived"] as Filter[]).map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setFilter(value)}
              className={cn(
                "rounded-[var(--radius-sm)] px-3 py-1.5 text-xs capitalize",
                filter === value &&
                  "bg-[var(--surface-2)] text-[var(--text-primary)]",
              )}
            >
              {value}
            </button>
          ))}
        </div>
      </div>
      {isFetching && conversations.length === 0 ? (
        <ProjectSkeleton />
      ) : projects.length === 0 ? (
        <EmptyProjects />
      ) : (
        <div
          className={cn(
            view === "grid"
              ? "grid gap-3 md:grid-cols-2 xl:grid-cols-3"
              : "space-y-2",
          )}
        >
          {projects.map(({ name, sessions }) => (
            <ProjectCard
              key={name}
              name={name}
              sessions={sessions}
              list={view === "list"}
            />
          ))}
        </div>
      )}
      <section
        className="mt-8 rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--surface-1)] p-4"
        aria-label="Session manager"
      >
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold">Session manager</h3>
            <p className="mt-1 text-xs text-[var(--text-secondary)]">
              Active and recent sessions from existing conversations.
            </p>
          </div>
          <span className="text-xs text-[var(--text-tertiary)]">
            {
              conversations.filter(
                (conversation) => conversation.sandbox_status !== "MISSING",
              ).length
            }{" "}
            active
          </span>
        </div>
        <div className="divide-y divide-[var(--border-subtle)]">
          {conversations.slice(0, 8).map((conversation) => (
            <NavLink
              key={conversation.id}
              to={`/conversations/${conversation.id}`}
              className="flex items-center gap-3 py-3 transition hover:bg-[var(--surface-hover)]"
            >
              <span
                className={cn(
                  "h-2 w-2 rounded-full",
                  conversation.sandbox_status === "MISSING"
                    ? "bg-[var(--text-tertiary)]"
                    : "bg-[var(--success)]",
                )}
              />
              <span className="min-w-0 flex-1 truncate text-sm font-medium">
                {conversation.title || "Untitled conversation"}
              </span>
              <span className="hidden truncate text-xs text-[var(--text-secondary)] sm:block">
                {conversation.selected_repository || "No project"}
              </span>
              <span className="shrink-0 text-[10px] text-[var(--text-tertiary)]">
                {formatDate(conversation.updated_at)}
              </span>
            </NavLink>
          ))}
        </div>
      </section>
    </section>
  );
}

function ProjectCard({
  name,
  sessions,
  list,
}: {
  name: string;
  sessions: Array<{
    id: string;
    title: string | null;
    llm_model: string | null;
    updated_at: string;
    sandbox_status: string;
  }>;
  list: boolean;
}) {
  const latest = sessions[0];
  const active = sessions.filter(
    (session) => session.sandbox_status !== "MISSING",
  ).length;
  return (
    <article
      className={cn(
        "rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--surface-1)] p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-[var(--brand-primary)]/45",
        list && "flex items-center gap-5",
      )}
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <h3
            className="truncate text-sm font-semibold text-[var(--text-primary)]"
            title={name}
          >
            {name}
          </h3>
          <span
            className={cn(
              "mt-1 h-2 w-2 shrink-0 rounded-full",
              active > 0 ? "bg-[var(--success)]" : "bg-[var(--text-tertiary)]",
            )}
            title={active > 0 ? "Active sessions" : "No active sessions"}
          />
        </div>
        <p className="mt-1 text-xs text-[var(--text-secondary)]">
          {sessions.length} {sessions.length === 1 ? "session" : "sessions"} ·{" "}
          {active} active
        </p>
        <div className="mt-4 border-t border-[var(--border-subtle)] pt-3">
          <NavLink
            to={`/conversations/${latest.id}`}
            className="block truncate text-sm font-medium text-[var(--text-primary)] hover:text-[var(--brand-primary)]"
          >
            {latest.title || "Untitled conversation"}
          </NavLink>
          <div className="mt-1 flex items-center justify-between gap-2 text-[10px] text-[var(--text-tertiary)]">
            <span className="truncate">
              {latest.llm_model || "Model not recorded"}
            </span>
            <span>{formatDate(latest.updated_at)}</span>
          </div>
        </div>
      </div>
      {list && <Activity size={16} className="text-[var(--text-tertiary)]" />}
    </article>
  );
}

function ProjectSkeleton() {
  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="h-36 animate-pulse rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--surface-1)]"
        />
      ))}
    </div>
  );
}
function EmptyProjects() {
  return (
    <div className="flex min-h-56 flex-col items-center justify-center rounded-[var(--radius-lg)] border border-dashed border-[var(--border-subtle)] bg-[var(--surface-1)] text-center">
      <Sparkles size={24} className="mb-3 text-[var(--brand-primary)]" />
      <h3 className="text-sm font-semibold">No matching projects</h3>
      <p className="mt-1 max-w-sm text-xs text-[var(--text-secondary)]">
        Start a conversation with a repository to see its project and sessions
        here.
      </p>
    </div>
  );
}
