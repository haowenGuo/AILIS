# AILIS Assistant

AILIS Assistant is a desktop embodied-agent project built around a VRM character, a local Electron runtime, speech interaction, visual understanding, memory, and an AILIS-style tool harness.

This repository is no longer just a browser companion demo. It keeps some avatar and frontend foundations from the earlier AILIS work, but its product direction is different: AILIS Assistant is meant to feel like a personal desktop assistant that can talk, see context when permitted, remember preferences, and help with real tasks through a stable agent runtime.

## Product Direction

The project has two goals that must stay balanced:

- Humanlike experience: AILIS should feel like a character sharing the desktop with the user, not a control panel wrapped around a chatbot.
- Reliable task execution: tools, approvals, memory, vision, and model calls should be structured enough to support complex work without making the user feel they are operating a developer console.

In short, the bottom layer should be engineering-stable like Codex or Claude Code, while the top layer should feel like a warm desktop character.

## What Makes This Different From AILIS

The older AILIS project focused mainly on a web/desktop-pet companion experience. AILIS Assistant is moving toward a fuller local assistant architecture:

- Desktop-first Electron runtime instead of a public web demo first
- AILIS agent loop for planning, tool calls, approvals, event flow, and recovery
- Vision tools for chat-window, full-screen, and region screenshots as model context
- Speech routes focused on safe defaults, ElevenLabs cloud output, and a bundled CosyVoice3 local runtime path
- Local ASR direction with automatic voice activity detection
- Memory blocks, project memory, relationship state, and lightweight reflection
- Humanlike experience evals for persona, tone, memory use, emotion response, and low tool-feel
- Codex-style tool discovery with deferred MCP/Web/research tools, stricter schemas, and evidence-aware stopping
- Local-first retrieval upgrades with Crawl4AI-style rendered fetch fallback and bundled runtime preparation

## Current Capabilities

- VRM desktop character with expressions, actions, lip sync, and dialogue bubble rendering
- Electron desktop shell with pet window, chat window, control panel, and local settings
- Chat flow backed by an OpenAI-compatible model provider
- Screenshot-based visual understanding through a permission-aware vision layer
- AILIS tool layer for file, code, computer, email, MCP, and vision skills
- Durable pending approval and local state storage
- Speech output through desktop TTS workers and cloud TTS providers
- Local speech recognition worker and recognition-mode controls
- AILIS humanlike eval dataset, judge rules, runners, and long-term companionship cases
- Local LLM provider configuration for OpenAI-compatible APIs, vLLM, and Ollama-oriented workflows

## Release Status

Current release candidate: `v1.0.5`.

This release line focuses on making AILIS feel shippable as a desktop assistant: AILIS naming cleanup, safer default voice behavior, memory controls, local-model setup guidance, stronger Web/Search evidence handling, Crawl4AI-backed fetch preparation, and GAIA-derived tool-loop hardening.

## Architecture

```text
electron/   Desktop main process, AILIS runtime, TTS/ASR workers, tool implementations
src/        Renderer apps for chat, pet avatar, control panel, speech, vision UI, and bubbles
backend/    Optional FastAPI backend, API schemas, education/Vivix services, and static assets
Resources/  VRM model, VRMA motions, and reference voice assets
evals/      AILIS humanlike experience scenarios and dataset plans
tests/      Node test suites for AILIS, memory, tools, evals, provider, and runtime behavior
docs/       Architecture notes, OpenClaw research, AILIS design, memory, vision, and eval docs
scripts/    Validation, smoke tests, eval runners, generation tools, and build helpers
```

Core design documents:

- [Embodied Agent Architecture](docs/ailis-embodied-agent-architecture.md)
- [Memory Architecture V2](docs/ailis-memory-architecture-v2.md)
- [Humanlike Eval](docs/ailis-humanlike-eval.md)
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

Local caches, downloaded models, runtime logs, eval outputs, and AILIS state are intentionally ignored by Git. They are machine-local data, not source assets.

## Validation

Common checks:

```bash
pnpm test:ailis-memory
pnpm test:ailis-humanlike-eval
pnpm test:ailis-runtime
pnpm test:ailis-tool-contracts
pnpm ailis:validate-gateway
```

Humanlike eval commands:

```bash
pnpm eval:ailis-humanlike:validate
pnpm eval:ailis-humanlike:generate
pnpm eval:ailis-humanlike:report
pnpm eval:ailis-humanlike:long-term:validate
```

## Privacy Notes

AILIS Assistant is designed as a personal desktop assistant, so local secrets and private memory can exist on the user's own machine. The codebase should still avoid committing real API keys, runtime transcripts, logs, local model caches, generated eval results, or downloaded model weights.

Vision is treated as a perception layer, not a screen-control agent. Screenshots are intended to help the model understand context and answer better, not to silently click, type, purchase, send, or submit actions.

## Status

This project is in active development. The current priority is to keep the existing stable runtime intact while improving the presentation layer, memory quality, speech/vision experience, tool contracts, and eval coverage.
