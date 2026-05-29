# AIGL Assistant

AIGL Assistant is a desktop embodied-agent project built around a VRM character, a local Electron runtime, speech interaction, visual understanding, memory, and a HumanClaw-style tool harness.

This repository is no longer just a browser companion demo. It keeps some avatar and frontend foundations from the earlier AIGril work, but its product direction is different: AIGL Assistant is meant to feel like a personal desktop assistant that can talk, see context when permitted, remember preferences, and help with real tasks through a stable agent runtime.

## Product Direction

The project has two goals that must stay balanced:

- Humanlike experience: AIGL should feel like a character sharing the desktop with the user, not a control panel wrapped around a chatbot.
- Reliable task execution: tools, approvals, memory, vision, and model calls should be structured enough to support complex work without making the user feel they are operating a developer console.

In short, the bottom layer should be engineering-stable like Codex or Claude Code, while the top layer should feel like a warm desktop character.

## What Makes This Different From AIGril

The older AIGril project focused mainly on a web/desktop-pet companion experience. AIGL Assistant is moving toward a fuller local assistant architecture:

- Desktop-first Electron runtime instead of a public web demo first
- HumanClaw agent loop for planning, tool calls, approvals, event flow, and recovery
- Vision tools for chat-window, full-screen, and region screenshots as model context
- Multiple speech routes, including low-latency Kokoro, higher-quality CosyVoice, and ElevenLabs
- Local ASR direction with automatic voice activity detection
- Memory blocks, project memory, relationship state, and lightweight reflection
- Humanlike experience evals for persona, tone, memory use, emotion response, and low tool-feel

## Current Capabilities

- VRM desktop character with expressions, actions, lip sync, and dialogue bubble rendering
- Electron desktop shell with pet window, chat window, control panel, and local settings
- Chat flow backed by an OpenAI-compatible model provider
- Screenshot-based visual understanding through a permission-aware vision layer
- HumanClaw tool layer for file, code, computer, email, MCP, and vision skills
- Durable pending approval and local state storage
- Speech output through desktop TTS workers and cloud TTS providers
- Local speech recognition worker and recognition-mode controls
- AIGL humanlike eval dataset, judge rules, runners, and long-term companionship cases

## Architecture

```text
electron/   Desktop main process, HumanClaw runtime, TTS/ASR workers, tool implementations
src/        Renderer apps for chat, pet avatar, control panel, speech, vision UI, and bubbles
backend/    Optional FastAPI backend, API schemas, education/Vivix services, and static assets
Resources/  VRM model, VRMA motions, and reference voice assets
evals/      AIGL humanlike experience scenarios and dataset plans
tests/      Node test suites for HumanClaw, memory, tools, evals, provider, and runtime behavior
docs/       Architecture notes, OpenClaw research, HumanClaw design, memory, vision, and eval docs
scripts/    Validation, smoke tests, eval runners, generation tools, and build helpers
```

Core design documents:

- [Embodied Agent Architecture](docs/aigl-embodied-agent-architecture.md)
- [Memory Architecture V2](docs/aigl-memory-architecture-v2.md)
- [Humanlike Eval](docs/aigl-humanlike-eval.md)
- [OpenClaw From Zero](docs/openclaw-from-zero.md)
- [Tool Ecosystem Driver Guide](docs/tool-ecosystem-driver-guide.md)

## Local Development

Install dependencies:

```bash
pnpm install
```

Run the desktop app in development mode:

```bash
pnpm desktop:dev
```

Build and start the desktop app:

```bash
pnpm desktop:start
```

Package the Windows desktop app:

```bash
pnpm desktop:package
```

Optional backend setup:

```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy backend\.env.example backend\.env
python -m uvicorn backend.main:app --reload
```

## Configuration

Most desktop settings are managed through the Electron control panel and local desktop state. The project supports OpenAI-compatible providers, including custom base URLs, model names, request timeouts, and local/private credentials.

Useful environment examples live in:

- `backend/.env.example`
- `requirements-desktop-asr.txt`
- `package.json`

Local caches, downloaded models, runtime logs, eval outputs, and HumanClaw state are intentionally ignored by Git. They are machine-local data, not source assets.

## Validation

Common checks:

```bash
pnpm test:humanclaw-memory
pnpm test:aigl-humanlike-eval
pnpm test:humanclaw-runtime
pnpm test:humanclaw-tool-contracts
pnpm humanclaw:validate-gateway
```

Humanlike eval commands:

```bash
pnpm eval:aigl-humanlike:validate
pnpm eval:aigl-humanlike:generate
pnpm eval:aigl-humanlike:report
pnpm eval:aigl-humanlike:long-term:validate
```

## Privacy Notes

AIGL Assistant is designed as a personal desktop assistant, so local secrets and private memory can exist on the user's own machine. The codebase should still avoid committing real API keys, runtime transcripts, logs, local model caches, generated eval results, or downloaded model weights.

Vision is treated as a perception layer, not a screen-control agent. Screenshots are intended to help the model understand context and answer better, not to silently click, type, purchase, send, or submit actions.

## Status

This project is in active development. The current priority is to keep the existing stable runtime intact while improving the presentation layer, memory quality, speech/vision experience, tool contracts, and eval coverage.
