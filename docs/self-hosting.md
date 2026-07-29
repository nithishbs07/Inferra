# Self-Hosting Guide

## Overview

Inferra is designed to be self-hosted. You can run it on your laptop, a dedicated local machine, or a cloud server.

---

## Option 1 — Local Machine (No Docker)

Best for: personal use, development

```bash
git clone https://github.com/nithishbs07/Inferra.git
cd Inferra

# Backend
poetry install
poetry run uvicorn openhands.server.app:app --host 0.0.0.0 --port 3000

# Frontend (new terminal)
cd frontend && npm install && npm run dev
```

> ⚠️ The agent has full access to your filesystem in this mode.

---

## Option 2 — Docker (Recommended)

Best for: isolated agent execution, production

### Prerequisites
- [Docker Desktop](https://docker.com/products/docker-desktop) (macOS/Windows)
- Docker Engine (Linux)

### Run

```bash
export PROJECTS_PATH="$HOME/projects"
mkdir -p "$PROJECTS_PATH" "$HOME/.inferra"

docker run -it --rm \
  -p 3000:3000 \
  -v "$HOME/.inferra:/home/inferra/.inferra" \
  -v "${PROJECTS_PATH}:/projects" \
  -v /var/run/docker.sock:/var/run/docker.sock \
  ghcr.io/nithishbs07/inferra:latest
```

The agent can only access files under `PROJECTS_PATH`.

---

## Option 3 — Cloud Server (Always-On)

Best for: team use, always-on agents, webhook integrations

### Recommended specs
- 2 vCPU, 4GB RAM minimum
- 8 vCPU, 16GB RAM for heavy workloads
- Ubuntu 22.04 LTS

### Setup

```bash
# Install dependencies
sudo apt update && sudo apt install -y docker.io git

# Clone Inferra
git clone https://github.com/nithishbs07/Inferra.git
cd Inferra

# Set your projects directory
export PROJECTS_PATH="/opt/inferra/projects"
mkdir -p "$PROJECTS_PATH"

# Run
docker run -d \
  --name inferra \
  --restart unless-stopped \
  -p 3000:3000 \
  -v /opt/inferra:/home/inferra/.inferra \
  -v "${PROJECTS_PATH}:/projects" \
  -v /var/run/docker.sock:/var/run/docker.sock \
  ghcr.io/nithishbs07/inferra:latest
```

---

## Option 4 — Local AI with Ollama (Air-Gapped)

Best for: privacy-first, no cloud API keys, offline use

See the full [Ollama Local AI Setup](ollama.md) guide.

Quick start:

```bash
brew install ollama
ollama serve
ollama pull qwen2.5-coder
```

Then start Inferra normally — it auto-detects Ollama.

---

## Security Hardening

> ⚠️ If exposing Inferra to the internet, follow these steps.

### 1. Use a reverse proxy (Nginx or Caddy)

```nginx
server {
    listen 443 ssl;
    server_name inferra.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
    }
}
```

### 2. Enable authentication

Set a `JWT_SECRET` environment variable:

```bash
docker run -d \
  -e JWT_SECRET="your-very-long-random-secret" \
  ... \
  ghcr.io/nithishbs07/inferra:latest
```

### 3. Restrict `PROJECTS_PATH`

Only mount directories the agent should have access to. Never mount `/` or `$HOME`.

### 4. Firewall

Only expose port 443 (HTTPS). Block direct access to 3000/3001.

---

## Updating

```bash
# Pull latest
git pull origin main

# Rebuild frontend
cd frontend && npm install && npm run build

# Restart backend
poetry run uvicorn openhands.server.app:app --host 0.0.0.0 --port 3000
```

Or with Docker:

```bash
docker pull ghcr.io/nithishbs07/inferra:latest
docker restart inferra
```

---

## Backup

Inferra stores settings and conversation history in `~/.inferra/` (or the mounted volume path). Back this up regularly:

```bash
tar -czf inferra-backup-$(date +%Y%m%d).tar.gz ~/.inferra/
```
