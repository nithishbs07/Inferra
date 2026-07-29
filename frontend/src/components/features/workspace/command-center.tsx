import React from "react";
import { NavLink } from "react-router";
import {
  Command,
  FolderOpen,
  MessageSquare,
  Plus,
  Search,
  Settings,
  Star,
} from "lucide-react";
import { usePaginatedConversations } from "#/hooks/query/use-paginated-conversations";

const FAVORITES_KEY = "openhands-next-favorite-conversations";

export function CommandCenter() {
  const { data } = usePaginatedConversations(20);
  const conversations = data?.pages.flatMap((page) => page.items) ?? [];
  const [favorites, setFavorites] = React.useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(FAVORITES_KEY) || "[]");
    } catch {
      return [];
    }
  });
  const saveFavorites = (next: string[]) => {
    setFavorites(next);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
  };
  const projects = new Set(
    conversations
      .map((conversation) => conversation.selected_repository)
      .filter(Boolean),
  ).size;
  const active = conversations.filter(
    (conversation) => conversation.sandbox_status !== "MISSING",
  ).length;
  return (
    <section className="mx-auto w-full max-w-6xl px-6 lg:px-0">
      <div className="grid gap-3 md:grid-cols-4">
        <Metric label="Conversations" value={conversations.length} />
        <Metric label="Active sessions" value={active} />
        <Metric label="Projects" value={projects} />
        <button
          type="button"
          onClick={() =>
            window.dispatchEvent(new Event("open-command-palette"))
          }
          className="flex items-center justify-between rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--surface-1)] p-4 text-left transition hover:border-[var(--brand-primary)]"
        >
          <span>
            <span className="block text-xs text-[var(--text-secondary)]">
              Workspace Spotlight
            </span>
            <span className="mt-1 block text-sm font-semibold">
              Search anything
            </span>
          </span>
          <Command size={18} className="text-[var(--brand-primary)]" />
        </button>
      </div>
      <div className="mt-3 grid gap-3 lg:grid-cols-[1fr_1.4fr]">
        <div className="rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--surface-1)] p-4">
          <h2 className="text-sm font-semibold">Quick actions</h2>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <Quick to="/" icon={<Plus size={15} />} label="New conversation" />
            <Quick
              to="/settings"
              icon={<Settings size={15} />}
              label="Settings"
            />
            <button
              type="button"
              onClick={() =>
                window.dispatchEvent(new Event("open-command-palette"))
              }
              className="flex items-center gap-2 rounded-[var(--radius-sm)] bg-[var(--surface-2)] p-2.5 text-left text-xs hover:bg-[var(--surface-hover)]"
            >
              <Search size={15} />
              Search workspace
            </button>
            <Quick
              to="/projects"
              icon={<FolderOpen size={15} />}
              label="Projects"
            />
          </div>
        </div>
        <div className="rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--surface-1)] p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">Favorites</h2>
            <Star size={15} className="text-[var(--brand-primary)]" />
          </div>
          <div className="mt-2 space-y-1">
            {conversations
              .filter((conversation) => favorites.includes(conversation.id))
              .slice(0, 4)
              .map((conversation) => (
                <div
                  key={conversation.id}
                  className="flex items-center gap-2 rounded-[var(--radius-sm)] px-2 py-1.5 hover:bg-[var(--surface-hover)]"
                >
                  <NavLink
                    to={`/conversations/${conversation.id}`}
                    className="min-w-0 flex-1 truncate text-xs font-medium"
                  >
                    <MessageSquare
                      size={13}
                      className="mr-2 inline text-[var(--text-tertiary)]"
                    />
                    {conversation.title || "Untitled conversation"}
                  </NavLink>
                  <button
                    type="button"
                    onClick={() =>
                      saveFavorites(
                        favorites.filter((id) => id !== conversation.id),
                      )
                    }
                    aria-label="Remove favorite"
                  >
                    <Star
                      size={14}
                      className="fill-[var(--brand-primary)] text-[var(--brand-primary)]"
                    />
                  </button>
                </div>
              ))}
            {conversations.filter((conversation) =>
              favorites.includes(conversation.id),
            ).length === 0 && (
              <p className="text-xs text-[var(--text-tertiary)]">
                Favorite conversations from the project workspace to keep them
                close.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--surface-1)] p-4">
      <span className="text-xs text-[var(--text-secondary)]">{label}</span>
      <strong className="mt-1 block text-2xl tracking-tight">{value}</strong>
    </div>
  );
}
function Quick({
  to,
  icon,
  label,
}: {
  to: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <NavLink
      to={to}
      className="flex items-center gap-2 rounded-[var(--radius-sm)] bg-[var(--surface-2)] p-2.5 text-xs hover:bg-[var(--surface-hover)]"
    >
      {icon}
      {label}
    </NavLink>
  );
}
