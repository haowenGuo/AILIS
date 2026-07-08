<div align="center">
  <img alt="AILIS character waving" src="Resources/Emotes/ailis-small/wave.png" width="156">
  <h1>AILIS</h1>
  <p><strong>A desktop AI companion with a visible character, voice, memory, and a Codex-style tool runtime.</strong></p>
  <p>
    <img alt="Version" src="https://img.shields.io/badge/version-1.1.0-2563eb?style=for-the-badge">
    <img alt="Runtime" src="https://img.shields.io/badge/runtime-Electron-0f172a?style=for-the-badge">
    <img alt="License" src="https://img.shields.io/badge/license-MIT-059669?style=for-the-badge">
  </p>
  <p>
    <a href="README.md">English</a> ·
    <a href="README.zh-CN.md">简体中文</a> ·
    <a href="README.ja.md">日本語</a> ·
    <a href="README.ko.md">한국어</a> ·
    <a href="README.fr.md">Français</a> ·
    <a href="README.de.md">Deutsch</a>
  </p>
  <p>
    <a href="https://haowenguo.github.io/AILIS/">Homepage</a> ·
    <a href="https://github.com/haowenGuo/AILIS/releases/tag/v1.1.0">Download</a> ·
    <a href="docs/ailis-embodied-agent-architecture.md">Architecture</a> ·
    <a href="docs/ailis-demo-benchmark-scorecard.md">Benchmarks</a>
  </p>
</div>

---

<p align="center">
  <img alt="How people use AILIS as a desktop AI companion" src="docs/assets/ailis-zhihu/ailis-user-flow-image2.png">
</p>

## Meet AILIS

AILIS is built to feel less like a blank chat box and more like a presence on your desktop. It combines a 3D character surface, realtime dialogue, voice output, memory, screen/file context, and a tool-using agent runtime for real work.

The product direction is simple: a companion you can talk with naturally, and a work partner that can switch into task mode when you need help with code, research, files, email, or desktop workflows.

## Product Surface

<p align="center">
  <img alt="AILIS happy expression" src="Resources/Emotes/ailis-small/happy.png" width="128">
  <img alt="AILIS thinking expression" src="Resources/Emotes/ailis-small/thinking.png" width="128">
  <img alt="AILIS sparkle expression" src="Resources/Emotes/ailis-small/sparkle.png" width="128">
</p>

AILIS brings three layers together:

- **Character layer**: VRM character, expressions, motions, lip sync, speech bubbles, tray and desktop windows.
- **Companion layer**: conversational style, user preferences, memory blocks, relationship state, and lightweight reflection.
- **Agent layer**: tool routing, approvals, evidence logs, recovery loops, model provider configuration, and local runtime utilities.

## What It Can Do

- VRM desktop character with expressions, motions, lip sync, and dialogue bubbles.
- Electron pet window, chat window, control panel, tray integration, and local persistent state.
- OpenAI-compatible model provider configuration, including custom base URLs and local-provider workflows.
- Voice output through desktop TTS workers and cloud provider paths.
- Optional local speech recognition worker for desktop voice input.
- Permission-aware visual context through screenshot, window, and region capture flows.
- Memory blocks, project context, relationship state, and lightweight reflection.
- Tool layer for file operations, code work, computer actions, email, MCP skills, web/search support, and local runtime utilities.
- Approval-aware execution model for actions that can affect files, apps, accounts, or external services.
- Humanlike experience evals, tool-contract tests, gateway checks, and agent execution smoke tests.

## Why It Is Different

AILIS is not only an expressive avatar and not only an automation console. The interesting part is the bridge:

- It can stay soft and conversational during daily interaction.
- It can become explicit and auditable during task execution.
- It keeps provider, memory, model, voice, and local runtime choices under the user's control.
- It is open source under MIT, so the character surface and the agent harness can evolve together.

## Architecture

<p align="center">
  <img alt="AILIS desktop AI runtime architecture" src="docs/assets/ailis-zhihu/ailis-architecture-image2.png">
</p>

```text
User / Voice / Screen
        |
        v
AILIS Desktop UI
  - VRM character
  - Chat window
  - Control panel
        |
        v
Agent Harness
  - planner
  - tool router
  - approval gate
  - evidence log
  - recovery loop
        |
        v
Runtime Services
  - model providers
  - voice / ASR / TTS
  - vision capture
  - memory store
  - local tools / MCP
        |
        v
Validation
  - tests
  - evals
  - smoke checks
```

## Repository Layout

```text
electron/   Desktop main process, preload bridge, runtime services, local tool adapters
src/        Renderer apps for the pet, chat, control panel, speech, vision UI, and bubbles
backend/    Optional FastAPI backend, API schemas, memory services, and static assets
Resources/  VRM model, VRMA motions, reference audio, and character assets
docs/       Architecture notes, memory design, tool ecosystem, evaluation, and release planning
evals/      Humanlike experience scenarios and long-term companionship evaluation data
scripts/    Runtime preparation, validation, smoke tests, benchmarks, and packaging helpers
tests/      Node test suites for runtime, memory, tools, contracts, gateway, and agent behavior
```

## Quick Start

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

## Model And Voice Setup

AILIS is provider-agnostic at the application layer. Configure providers through the desktop control panel or local environment files:

- OpenAI-compatible cloud providers.
- Local vLLM endpoints.
- Ollama-oriented local workflows.
- Custom base URLs, model names, request timeouts, and private API keys.
- Optional local ASR and desktop TTS runtime preparation.

Never commit real API keys, account credentials, chat transcripts, local model caches, runtime logs, or generated eval outputs.

## Useful Commands

```bash
pnpm test:ailis-runtime
pnpm test:ailis-agent
pnpm test:ailis-tool-contracts
pnpm test:ailis-memory
pnpm ailis:validate-harness
```

Full gateway validation is heavier and runs a larger set of runtime, contract, tool, memory, agent, and smoke checks:

```bash
pnpm ailis:validate-gateway
```

## Core Documents

- [Embodied Agent Architecture](docs/ailis-embodied-agent-architecture.md)
- [Memory Architecture V2](docs/ailis-memory-architecture-v2.md)
- [Humanlike Eval](docs/ailis-humanlike-eval.md)
- [Tool Ecosystem Driver Guide](docs/tool-ecosystem-driver-guide.md)

## Project Status

Current release line: `v1.1.0`.

AILIS is in active development. It already has a substantial desktop runtime, agent harness, tool layer, and evaluation surface, but it should still be treated as an alpha-stage product/runtime rather than a production-grade Agent OS. The near-term priority is reliability: clearer tool contracts, safer approvals, stronger memory behavior, better local model setup, and higher-quality end-to-end evaluation.

## Privacy And Safety

AILIS is designed for personal desktop use, so privacy and control are part of the architecture:

- Vision capture is permission-aware and should be used to understand context, not to silently act.
- Mutating or high-risk tool actions should pass through explicit approval.
- Local memory and runtime state should remain machine-local unless the user chooses otherwise.
- Secrets belong in local configuration, never in source control.

## License

AILIS source code is released under the [MIT License](LICENSE). Some bundled or third-party assets, models, motions, and voice resources may have their own licenses; check asset-specific notes before redistribution.
