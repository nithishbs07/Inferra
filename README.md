<div align="center">

<img src="https://raw.githubusercontent.com/nithishbs07/Inferra/main/frontend/src/assets/inferra-logo.svg" alt="Inferra" width="80" />

# Inferra

**The AI-Native Software Engineering Workspace**

Run AI agents locally, on your infrastructure, or in the cloud —  
on your terms, with your models, your tools, your workflow.

[![Status](https://img.shields.io/badge/status-beta-E53935?style=flat-square)](https://github.com/nithishbs07/Inferra)
[![License](https://img.shields.io/badge/license-MIT-white?style=flat-square)](LICENSE)
[![Built with](https://img.shields.io/badge/built%20with-React%20%2B%20FastAPI-09090B?style=flat-square)](#)

[Quickstart](#quickstart) · [Architecture](#architecture) · [Self-Hosting](#self-hosting) · [Documentation](#documentation)

</div>

---

## What is Inferra?

Inferra is a self-hosted, always-on AI engineering workspace. It turns coding agents into a personal engineering team — running reports, decomposing GitHub issues, automating pull requests, and shipping code while you focus on what matters.

It runs entirely on your machine by default, but can connect to agent backends running in Docker containers, on VMs, or within your company infrastructure. You can optionally connect to cloud inference endpoints or run fully air-gapped with local models via Ollama.

| Capability | Description |
|---|---|
| **Self-host your way** | Run agents locally, in Docker, on VMs, or anywhere you can run an agent server backend |
| **Switch backends instantly** | Flip between local, remote, and cloud agents without losing context |
| **Create automations** | Build workflows that integrate with Slack, GitHub, Linear, and more — on a schedule or via webhooks |
| **Bring your own model** | Use with any LLM — OpenAI, Anthropic, Gemini, or fully local via Ollama |
| **Use with any agent** | Works with any agent implementing the Agent-Client Protocol (ACP) |

---

## Quickstart

You can run Inferra on your laptop, a dedicated machine like a Mac Mini, or a cloud server.

### Option 1 — Without a Sandbox

> ⚠️ This runs the agent server directly on your machine. The agent will have full access to your filesystem.

**Prerequisites:** Node.js 22.12.x or later, `uv`

```bash
npm install -g @inferra/agent-canvas
inferra
```

You can also run pieces separately:

```bash
inferra --frontend-only   # static frontend + ingress only
inferra --backend-only    # agent server + automation backend + ingress only
```

---

### Option 2 — With a Docker Sandbox

**Prerequisites:** Docker Desktop (macOS/Windows) or Docker Engine (Linux)

```bash
export PROJECTS_PATH="$HOME/projects"
mkdir -p "$PROJECTS_PATH" "$HOME/.inferra"

docker run -it --rm \
  -p 8000:8000 \
  -v "$HOME/.inferra:/home/inferra/.inferra" \
  -v "${PROJECTS_PATH}:/projects" \
  ghcr.io/nithishbs07/inferra:latest
```

The agent will have access to any project under `PROJECTS_PATH`.

---

### Option 3 — From Source

> ⚠️ Runs the agent server directly on your machine.

**Prerequisites:** Node.js 22.12.x or later, npm, uv

```bash
git clone https://github.com/nithishbs07/Inferra.git
cd Inferra
npm install
npm run dev
```

Access the UI at **http://localhost:8000**. Add additional agent backends directly from the UI.

---

### Option 4 — Local AI with Ollama

Run 100% offline with no cloud API keys required.

```bash
# Install Ollama
brew install ollama
ollama serve

# Pull a model
ollama pull qwen2.5-coder

# Start Inferra — it auto-detects Ollama
npm run dev
```

Inferra will automatically detect Ollama, select the best available model, and configure itself. No API key needed.

**Supported local models (preference order):**
1. `qwen3:14b`
2. `qwen3:8b`
3. `qwen2.5-coder`
4. `deepseek-r1`
5. `gemma3`

---

## Architecture

Inferra is powered by a modular agent server architecture. Each agent server runs on a single host/port. The Inferra workspace can connect to multiple agent servers simultaneously.

```
┌─────────────────────────────────┐
│         Inferra Workspace        │
│    (React + Vite frontend)       │
└────────────┬────────────────────┘
             │
    ┌─────────▼──────────┐
    │   FastAPI Backend   │
    │  /api/v1/* routes   │
    └────────┬────────────┘
             │
    ┌────────▼────────────────────────────────┐
    │           Agent Backends                 │
    │                                          │
    │  • Local (your laptop)                   │
    │  • Docker container                      │
    │  • Remote VM / Mac Mini                  │
    │  • Ollama (local LLM)                    │
    │  • Cloud endpoint                        │
    └──────────────────────────────────────────┘
```

You can run an agent server anywhere:
- **Directly on your laptop** — great for personal projects
- **On a dedicated machine** — Mac Mini, home server
- **On a VM in the cloud** — for always-on agents
- **Fully local with Ollama** — air-gapped, no cloud required

---

## Features

### 🤖 AI Agent Workspace
- Start conversations with AI agents from a clean, minimal interface
- Full streaming support — see tokens as they arrive
- Conversation history with search
- Multi-agent support

### ⚡ Automations
- Create workflows triggered by schedules or webhooks
- Integrate with Slack, GitHub, Linear, Notion, and more
- Agent-generated reports that publish automatically

### 🔌 Model Flexibility
- **Cloud:** OpenAI, Anthropic, Google Gemini, Azure
- **Local:** Ollama with automatic model detection
- **Custom:** Any OpenAI-compatible endpoint
- Temperature, context window, streaming — all configurable

### 🛡️ Privacy First
- Fully self-hostable
- Local model support via Ollama — no data leaves your machine
- No telemetry without explicit consent

### 🎨 Premium Design
- Apple-inspired boot animation
- Dark-first design system (`#09090B` background, `#E53935` accent)
- Command palette (⌘K) for instant navigation
- Responsive, accessible, 120fps-targeted animations

---

## Self-Hosting

For production deployments, see the [self-hosting guide](docs/self-hosting.md).

Key considerations:
- **Security hardening** is essential if exposing to the internet
- **PROJECTS_PATH** controls what the agent can access
- **Ollama** can be run on a separate machine and accessed over LAN

---

## Compatible Agents

Inferra works with any agent implementing the [Agent-Client Protocol (ACP)](https://agentprotocol.ai):

| Agent | Status |
|---|---|
| Inferra Agent (built-in) | ✅ Native |
| Claude Code | ✅ ACP compatible |
| OpenHands | ✅ ACP compatible |
| Codex | ✅ ACP compatible |
| Gemini | ✅ ACP compatible |
| Custom agents | ✅ Any ACP server |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite, Framer Motion, React Router v7 |
| Backend | Python 3.12, FastAPI, uvicorn |
| Database | SQLite (local) / PostgreSQL (production) |
| Agent Protocol | OpenHands SDK / ACP |
| Local AI | Ollama (OpenAI-compatible API) |
| Styling | Vanilla CSS with design tokens |

---

## Development

```bash
# Clone
git clone https://github.com/nithishbs07/Inferra.git
cd Inferra

# Backend
poetry install
poetry run uvicorn openhands.server.app:app --host 0.0.0.0 --port 3000

# Frontend
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:3001`, backend at `http://localhost:3000`.

---

## Documentation

- [Architecture Overview](docs/architecture.md)
- [Development Guide](docs/development.md)
- [Self-Hosting Guide](docs/self-hosting.md)
- [Ollama Local AI Setup](docs/ollama.md)

---

## Contributing

Issues and pull requests are welcome. Please open a GitHub issue for bugs, feature requests, or questions.

---

## License

MIT License — see [LICENSE](LICENSE) for details.

---

<div align="center">

Built with ❤️ · Powered by local AI · Runs anywhere

**[github.com/nithishbs07/Inferra](https://github.com/nithishbs07/Inferra)**

</div>
