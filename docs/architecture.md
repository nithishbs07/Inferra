# Architecture Overview

## System Design

Inferra is composed of three layers: the **Workspace** (frontend), the **Agent Server** (backend API), and the **Agent Runtime** (where code actually executes).

```
┌──────────────────────────────────────────────────────────┐
│                   Inferra Workspace                       │
│              React 19 + Vite + Framer Motion             │
│                   localhost:3001                          │
└─────────────────────┬────────────────────────────────────┘
                      │ HTTP + WebSocket
                      │ /api/v1/*
┌─────────────────────▼────────────────────────────────────┐
│                  FastAPI Backend                          │
│              Python 3.12 + uvicorn                        │
│                   localhost:3000                          │
│                                                          │
│  Routes:                                                 │
│  POST /api/v1/app-conversations  → start agent session   │
│  GET  /api/v1/projects           → list projects         │
│  GET  /api/v1/settings           → user settings         │
│  GET  /api/v1/agents             → available agents      │
│  GET  /api/v1/mcp                → MCP tool servers      │
│  WS   /api/v1/conversations/:id  → live agent stream     │
└──────────┬──────────────────┬───────────────────────────┘
           │                  │
┌──────────▼──────┐  ┌────────▼──────────────────────────┐
│  LLM Provider   │  │         Agent Runtime               │
│                 │  │                                     │
│  • Ollama       │  │  • Docker container (recommended)   │
│  • OpenAI       │  │  • Local process (no Docker)        │
│  • Anthropic    │  │  • Remote VM                        │
│  • Any OpenAI-  │  │  • Cloud sandbox                    │
│    compat API   │  │                                     │
└─────────────────┘  └─────────────────────────────────────┘
```

## Component Map

### Frontend (`/frontend/src`)

| Path | Purpose |
|---|---|
| `routes/root-layout.tsx` | App shell, auth, boot animation |
| `components/features/boot/` | 5-phase boot animation system |
| `components/features/sidebar/sidebar-next.tsx` | Premium sidebar navigation |
| `components/features/dashboard/dashboard.tsx` | Home dashboard |
| `components/features/command-palette/` | ⌘K command palette |
| `components/layout/app-shell.tsx` | Main layout wrapper |
| `components/layout/status-bar.tsx` | Bottom status bar |
| `lib/motion.ts` | Animation tokens and spring configs |

### Backend (`/openhands`)

| Path | Purpose |
|---|---|
| `server/app.py` | FastAPI app entry point |
| `app_server/settings/` | User settings storage and API |
| `app_server/sandbox/` | Agent sandbox management |
| `core/config/` | LLM and agent configuration |

## Data Flow — New Conversation

```
User clicks "New Chat"
        ↓
POST /api/v1/app-conversations
        ↓
Backend creates conversation record
        ↓
Backend connects to Docker / local runtime
        ↓
Agent sandbox starts
        ↓
WebSocket opens: /api/v1/conversations/:id
        ↓
User message → LLM → streaming tokens → UI
```

## Design System

Inferra uses centralized CSS custom properties defined in `frontend/src/index.css`:

| Token | Value | Purpose |
|---|---|---|
| `--surface-0` | `#09090B` | Primary background |
| `--surface-1` | `#15161A` | Panel background |
| `--surface-2` | `#1E2025` | Elevated surface |
| `--brand-primary` | `#E53935` | Inferra Red |
| `--brand-hover` | `#FF4D4F` | Hover state |
| `--border` | `#2B2D31` | Default border |
| `--text-primary` | `#FFFFFF` | Primary text |
| `--text-secondary` | `#A8A8A8` | Secondary text |
