# Ollama Local AI Setup

Run Inferra completely offline with no API keys using Ollama.

---

## What is Ollama?

[Ollama](https://ollama.ai) runs large language models locally on your machine. Inferra integrates with Ollama's OpenAI-compatible API (`/v1/chat/completions`) for zero-configuration local AI.

**No data leaves your machine. No API key required.**

---

## Step 1 — Install Ollama

### macOS
```bash
brew install ollama
```
Or download from [ollama.ai/download](https://ollama.ai/download)

### Linux
```bash
curl -fsSL https://ollama.ai/install.sh | sh
```

### Windows
Download the installer from [ollama.ai/download](https://ollama.ai/download)

---

## Step 2 — Start Ollama

```bash
ollama serve
```

Verify it's running:
```bash
curl http://localhost:11434/
# Expected: Ollama is running
```

---

## Step 3 — Pull a Model

Inferra auto-selects the best model from this preference list:

| Priority | Model | Size | Best For |
|---|---|---|---|
| 1st | `qwen3:14b` | ~9GB | Best quality |
| 2nd | `qwen3:8b` | ~5GB | Balanced |
| 3rd | `qwen2.5-coder` | ~5GB | Code tasks |
| 4th | `deepseek-r1` | varies | Reasoning |
| 5th | `gemma3` | ~5GB | General use |

Pull whichever fits your machine's RAM:

```bash
# Best for 16GB+ RAM
ollama pull qwen3:14b

# Good for 8GB RAM
ollama pull qwen2.5-coder

# Lightweight option
ollama pull gemma3
```

Check what's installed:
```bash
ollama list
```

---

## Step 4 — Start Inferra

Inferra auto-detects Ollama on startup:

```bash
cd Inferra
npm run dev   # or poetry run uvicorn ... for the backend
```

During the boot animation you'll see:
```
Initializing Intelligence...
Loading Agent Runtime...
Connecting Local AI...
Loading qwen2.5-coder:7b...   ← your detected model
Preparing Workspace...
Ready.
```

---

## Step 5 — Verify Connection

Open **http://localhost:3001** and check the status bar at the bottom — it should show **Connected**.

To run a manual test:

```bash
curl http://localhost:11434/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "qwen2.5-coder:7b",
    "messages": [{"role": "user", "content": "Hello Inferra"}],
    "stream": false
  }'
```

Expected: `200 OK` with a JSON response containing the model's reply.

---

## Configuration

Inferra auto-configures these settings when Ollama is detected:

| Setting | Value |
|---|---|
| Provider | Ollama |
| Base URL | `http://localhost:11434/v1` |
| API Key | `ollama` (placeholder — not a real key) |
| Temperature | `0.2` |
| Streaming | Enabled |

To override manually, edit your settings in the Inferra UI under **Settings → Local AI**.

---

## Troubleshooting

### Ollama not detected

```
Cannot connect to Ollama. Please start: ollama serve
```

**Fix:** Run `ollama serve` in a terminal and keep it running.

---

### No models found

```
No supported local model found.
```

**Fix:** Pull at least one model:
```bash
ollama pull qwen2.5-coder
```

---

### Slow responses

Local LLMs are slower than cloud APIs, especially on first run (model loads into RAM). After the first response, subsequent ones are much faster.

**Tips:**
- Use a smaller model (`qwen3:8b` instead of `qwen3:14b`) on machines with less RAM
- Keep `ollama serve` running permanently so the model stays loaded
- Add to login items on macOS: **System Settings → General → Login Items**

---

### Model crashes or gives errors

Inferra automatically falls back to the next model in the preference list:
```
qwen3:14b → qwen3:8b → qwen2.5-coder → deepseek-r1 → gemma3
```

If all fail, check `ollama list` and pull a supported model.

---

## RAM Requirements

| Model | Min RAM | Recommended |
|---|---|---|
| `qwen3:8b` | 8GB | 16GB |
| `qwen3:14b` | 12GB | 24GB |
| `qwen2.5-coder:7b` | 8GB | 16GB |
| `gemma3:12b` | 10GB | 16GB |
| `deepseek-r1:7b` | 8GB | 16GB |

> **Tip:** On Apple Silicon Macs (M1/M2/M3), Ollama uses the Neural Engine for fast inference — performance is significantly better than on Intel Macs or CPU-only Linux.

---

## Keeping Ollama Running

### macOS — run as a background service

```bash
brew services start ollama
```

This starts Ollama automatically on login and keeps it running in the background.

### Linux — systemd service

```bash
sudo systemctl enable ollama
sudo systemctl start ollama
```
