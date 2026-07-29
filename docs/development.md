# Development Guide

## Prerequisites

| Tool | Version | Install |
|---|---|---|
| Python | 3.12+ | [python.org](https://python.org) |
| Node.js | 22.12+ | [nodejs.org](https://nodejs.org) |
| Poetry | latest | `curl -sSL https://install.python-poetry.org \| python3 -` |
| npm | 10+ | bundled with Node.js |

## Quick Start

### 1. Clone

```bash
git clone https://github.com/nithishbs07/Inferra.git
cd Inferra
```

### 2. Start the Backend

```bash
# Install Python dependencies
poetry install

# Start the backend server
poetry run uvicorn openhands.server.app:app \
  --host 0.0.0.0 \
  --port 3000 \
  --reload
```

Backend runs at **http://localhost:3000**

### 3. Start the Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

Frontend runs at **http://localhost:3001**

The Vite proxy automatically forwards `/api/*` and `/socket.io/*` to the backend.

## Environment Variables

Create a `.env` file in the project root if needed:

```bash
# Optional — only needed for cloud LLM providers
LLM_API_KEY=your_key_here

# For Ollama (no key needed — runs locally)
# LLM_BASE_URL=http://localhost:11434/v1
```

## Useful Commands

### Frontend

```bash
# Type check
npx tsc --noEmit

# Lint
npx eslint src --ext .ts,.tsx

# Format
npx prettier --write src/

# Production build
npm run build
```

### Backend

```bash
# Run tests
poetry run pytest tests/

# Type check
poetry run mypy openhands/

# Lint
poetry run ruff check openhands/
```

## Project Structure

```
Inferra/
├── frontend/                  # React frontend
│   ├── src/
│   │   ├── components/        # UI components
│   │   │   ├── features/      # Feature components
│   │   │   │   ├── boot/      # Boot animation
│   │   │   │   ├── sidebar/   # Sidebar navigation
│   │   │   │   ├── dashboard/ # Home dashboard
│   │   │   │   └── command-palette/
│   │   │   ├── layout/        # Layout components
│   │   │   └── ui/            # Base UI components
│   │   ├── hooks/             # React hooks
│   │   ├── routes/            # Route components
│   │   ├── lib/               # Utilities
│   │   └── index.css          # Design tokens
│   └── package.json
│
├── openhands/                 # Python backend
│   ├── server/                # FastAPI server
│   ├── app_server/            # App-level APIs
│   │   ├── settings/          # Settings management
│   │   └── sandbox/           # Agent sandbox
│   └── core/                  # Core logic
│
└── docs/                      # Documentation
```

## Making Changes

### Adding a new frontend route

1. Add the component in `frontend/src/routes/`
2. Register it in `frontend/src/routes.ts`
3. Add a sidebar entry in `sidebar-next.tsx`

### Adding a new API endpoint

1. Create a router in `openhands/app_server/`
2. Register it in `openhands/server/app.py`
3. Add a corresponding hook in `frontend/src/hooks/query/`

### Modifying the design system

All design tokens live in `frontend/src/index.css` under `:root`. Never hardcode colors — always use CSS variables.

## Boot Animation

The boot animation is in `frontend/src/components/features/boot/`:

| File | Purpose |
|---|---|
| `splash-screen.tsx` | Outer wrapper, session management |
| `boot-animation.tsx` | 5-phase orchestrator |
| `inferra-logo-animated.tsx` | SVG logo with spring physics |
| `ambient-particles.tsx` | 20 GPU-accelerated ambient particles |

To replay it during development: open DevTools Console and run:
```js
sessionStorage.removeItem('inferra_boot_shown')
location.reload()
```

## Troubleshooting

| Issue | Fix |
|---|---|
| `POST /api/v1/app-conversations → 500` | Docker is not running. Start Docker Desktop. |
| Frontend can't reach backend | Check Vite proxy in `vite.config.ts` |
| TypeScript errors | Run `npx tsc --noEmit` and fix all `error TS` lines |
| Backend won't start | Run `poetry install` first |
