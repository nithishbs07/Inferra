/**
 * @file command-palette.tsx
 * @description A premium Command Palette component for global navigation and actions.
 * Wraps cmdk's Command inside a Dialog with fuzzy search, keyboard navigation, and recently used commands.
 *
 * Props:
 * - className: Optional CSS classes to apply to the dialog content.
 *
 * Accessibility notes:
 * - WCAG AA compliant with proper ARIA attributes via Radix UI Dialog and cmdk.
 * - Fully keyboard navigable (Arrow keys to move, Enter to select, Esc to close).
 * - Cmd+K / Ctrl+K opens the palette globally.
 *
 * Usage:
 * ```tsx
 * import { CommandPalette, useCommandPalette } from "#/components/features/command-palette";
 *
 * // In root layout:
 * <CommandPalette />
 *
 * // In any component:
 * const { open } = useCommandPalette();
 * <button onClick={open}>Open Command Palette</button>
 * ```
 */

import * as React from "react";
import { useNavigate } from "react-router";
import {
  Compass,
  MessageSquare,
  FolderOpen,
  Cpu,
  Brain,
  Wrench,
  Settings,
} from "lucide-react";

import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from "#/components/ui/command";
import { Dialog, DialogContent } from "#/components/ui/dialog";
import { Badge } from "#/components/ui/badge";
import { cn } from "#/lib/utils";

const OPEN_COMMAND_PALETTE_EVENT = "open-command-palette";
const CLOSE_COMMAND_PALETTE_EVENT = "close-command-palette";
const TOGGLE_COMMAND_PALETTE_EVENT = "toggle-command-palette";

/**
 * Hook to programmatically control the Command Palette from anywhere in the app.
 */
export function useCommandPalette() {
  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    const handleClose = () => setIsOpen(false);
    const handleToggle = () => setIsOpen((prev) => !prev);

    window.addEventListener(OPEN_COMMAND_PALETTE_EVENT, handleOpen);
    window.addEventListener(CLOSE_COMMAND_PALETTE_EVENT, handleClose);
    window.addEventListener(TOGGLE_COMMAND_PALETTE_EVENT, handleToggle);

    return () => {
      window.removeEventListener(OPEN_COMMAND_PALETTE_EVENT, handleOpen);
      window.removeEventListener(CLOSE_COMMAND_PALETTE_EVENT, handleClose);
      window.removeEventListener(TOGGLE_COMMAND_PALETTE_EVENT, handleToggle);
    };
  }, []);

  const open = React.useCallback(() => {
    window.dispatchEvent(new Event(OPEN_COMMAND_PALETTE_EVENT));
  }, []);

  const close = React.useCallback(() => {
    window.dispatchEvent(new Event(CLOSE_COMMAND_PALETTE_EVENT));
  }, []);

  const toggle = React.useCallback(() => {
    window.dispatchEvent(new Event(TOGGLE_COMMAND_PALETTE_EVENT));
  }, []);

  return { isOpen, open, close, toggle, setIsOpen };
}

type CommandDef = {
  id: string;
  label: string;
  icon: React.ElementType;
  shortcut?: string[];
  onSelect: (navigate: ReturnType<typeof useNavigate>) => void;
};

// Global command registry
const COMMANDS: Record<string, CommandDef[]> = {
  Navigation: [
    {
      id: "nav-home",
      label: "Home",
      icon: Compass,
      shortcut: ["G", "H"],
      onSelect: (nav) => nav("/"),
    },
    {
      id: "nav-settings",
      label: "Settings",
      icon: Settings,
      shortcut: ["G", "S"],
      onSelect: (nav) => nav("/settings"),
    },
  ],
  Conversations: [
    {
      id: "conv-new",
      label: "New Conversation",
      icon: MessageSquare,
      shortcut: ["C", "N"],
      onSelect: (nav) => nav("/"),
    },
    {
      id: "conv-recent",
      label: "Recent Conversations",
      icon: MessageSquare,
      onSelect: () =>
        window.dispatchEvent(new Event("open-conversation-panel")),
    },
  ],
  Projects: [
    {
      id: "proj-open",
      label: "Open Project",
      icon: FolderOpen,
      shortcut: ["P", "O"],
      onSelect: (nav) => nav("/projects"),
    },
  ],
  Models: [
    {
      id: "model-switch",
      label: "Switch Model",
      icon: Cpu,
      shortcut: ["M", "S"],
      onSelect: (nav) => nav("/settings"),
    },
  ],
  Memory: [
    {
      id: "mem-view",
      label: "View Memory",
      icon: Brain,
      shortcut: ["M", "V"],
      onSelect: (nav) => nav("/settings/condenser"),
    },
  ],
  Tools: [
    {
      id: "tool-manage",
      label: "Manage Tools",
      icon: Wrench,
      shortcut: ["T", "M"],
      onSelect: (nav) => nav("/settings/mcp"),
    },
  ],
  Settings: [
    {
      id: "set-prefs",
      label: "Preferences",
      icon: Settings,
      onSelect: (nav) => nav("/settings/app"),
    },
  ],
};

// Flatten commands for easy lookup
const ALL_COMMANDS = Object.values(COMMANDS).flat();

const RECENT_KEY = "openhands_recent_commands";

function useRecentCommands() {
  const [recentIds, setRecentIds] = React.useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(RECENT_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const addRecent = React.useCallback((id: string) => {
    setRecentIds((prev) => {
      const next = [id, ...prev.filter((x) => x !== id)].slice(0, 5);
      try {
        localStorage.setItem(RECENT_KEY, JSON.stringify(next));
      } catch (e) {
        console.warn("Failed to save recent commands to localStorage", e);
      }
      return next;
    });
  }, []);

  return { recentIds, addRecent };
}

export interface CommandPaletteProps {
  className?: string;
}

export const CommandPalette = React.forwardRef<
  HTMLDivElement,
  CommandPaletteProps
>(({ className }, ref) => {
  const navigate = useNavigate();
  const { isOpen, setIsOpen, toggle } = useCommandPalette();
  const { recentIds, addRecent } = useRecentCommands();

  // Global keyboard shortcut
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        toggle();
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [toggle]);

  const handleSelect = React.useCallback(
    (command: CommandDef) => {
      addRecent(command.id);
      command.onSelect(navigate);
      setIsOpen(false);
    },
    [addRecent, navigate, setIsOpen],
  );

  const recentCommands = recentIds
    .map((id) => ALL_COMMANDS.find((c) => c.id === id))
    .filter((c): c is CommandDef => c !== undefined);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent
        className={cn(
          "overflow-hidden p-0 max-w-[640px] max-h-[400px]",
          "bg-[var(--surface-2)] border-[var(--border-default)]",
          "shadow-xl rounded-[var(--radius-xl)]",
          className,
        )}
      >
        <Command
          ref={ref}
          className="w-full h-full flex flex-col bg-transparent"
        >
          <CommandInput
            placeholder="Type a command or search..."
            className="text-[var(--text-primary)]"
          />
          <CommandList className="flex-1 overflow-y-auto">
            <CommandEmpty>No results found.</CommandEmpty>

            {recentCommands.length > 0 && (
              <>
                <CommandGroup heading="Recently Used">
                  {recentCommands.map((command) => (
                    <CommandPaletteItem
                      key={`recent-${command.id}`}
                      command={command}
                      onSelect={() => handleSelect(command)}
                    />
                  ))}
                </CommandGroup>
                <CommandSeparator />
              </>
            )}

            {Object.entries(COMMANDS).map(([groupName, groupCommands]) => (
              <CommandGroup key={groupName} heading={groupName}>
                {groupCommands.map((command) => (
                  <CommandPaletteItem
                    key={command.id}
                    command={command}
                    onSelect={() => handleSelect(command)}
                  />
                ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
});
CommandPalette.displayName = "CommandPalette";

function CommandPaletteItem({
  command,
  onSelect,
}: {
  command: CommandDef;
  onSelect: () => void;
}) {
  const Icon = command.icon;
  return (
    <CommandItem
      value={`${command.label} ${command.id}`}
      onSelect={onSelect}
      className={cn(
        "flex items-center gap-3 px-4 py-2 cursor-pointer",
        "data-[selected=true]:bg-[var(--surface-3)]",
        "data-[selected=true]:text-[var(--text-primary)]",
        "text-[var(--text-secondary)]",
      )}
    >
      <Icon className="w-4 h-4" />
      <span className="flex-1">{command.label}</span>
      {command.shortcut && (
        <div className="flex items-center gap-1">
          {command.shortcut.map((key) => (
            <Badge
              key={key}
              variant="outline"
              className={cn(
                "h-5 px-1.5 py-0 min-w-5 flex items-center justify-center text-[10px]",
                "bg-[var(--surface-1)] border-[var(--border-muted)] text-[var(--text-tertiary)]",
                "font-mono rounded-[var(--radius-sm)]",
              )}
            >
              {key}
            </Badge>
          ))}
        </div>
      )}
    </CommandItem>
  );
}
