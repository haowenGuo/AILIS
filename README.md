# AIGL Assistant / HumanClaw

<p align="center">
  <strong>A desktop-first embodied AI assistant built around AIGL, combining a VRM character, HumanClaw task execution, conversational companionship, memory, vision, speech, and a local Electron runtime.</strong>
</p>

<p align="center">
  <a href="README.md">English</a> ·
  <a href="README.zh-CN.md">简体中文</a> ·
  <a href="README.ja.md">日本語</a>
</p>

---

## What This Project Is

AIGL Assistant is the current AIGRIL mainline. It is no longer just a browser avatar or a lightweight desktop pet. The project is moving toward a personal embodied-agent system: AIGL appears as a desktop character, talks with the user, remembers long-term context, understands visual context when permitted, and can execute real tasks through the HumanClaw runtime.

The product target is deliberately two-layered:

- The surface should feel like AIGL is sharing the desktop with the user.
- The bottom layer should be stable like a local agent harness, with tools, approvals, audit logs, memory, recovery, and tests.

In short: AIGL Assistant is trying to make task execution feel less like operating a developer console and more like working with a capable character.

## Core Systems

| System | Role |
| --- | --- |
| Embodied desktop shell | Electron windows for the VRM pet, chat panel, control panel, and Agent Analysis Lab. |
| AIGL character runtime | VRM rendering, VRMA motions, expressions, dialogue bubbles, lip sync, speech state, and stylized rendering controls. |
| HumanClaw Gateway | Local HTTP/SSE gateway on `127.0.0.1:19777` for health, tool listing, tool calls, audit logs, events, and agent runs. |
| HumanClaw Agent Runner | LLM-centered agent loop for conversation/task routing, planning, tool calls, approval recovery, interruption, and final responses. |
| Tool layer | OpenClaw-aligned tools plus HumanClaw local tools for file, code, computer, email, vision, MCP, tool search, capability management, and artifact verification. |
| Persona memory runtime | Core memory blocks, project/user/relationship state, affinity, secret index, event memory, reflection direction, and control-panel inspection. |
| Vision layer | Permission-aware screenshot/context capture for screen, active window, chat window, pet window, control panel, and selected regions. |
| Speech layer | Local ASR worker plus multiple TTS paths, including browser speech, Kokoro, CosyVoice3, and ElevenLabs-style cloud speech. |
| Control panel | Local settings for LLM providers, model presets, speech, ASR, email profiles, computer-control mode, state directory, memory, and gateway status. |
| Evaluation and validation | Humanlike evals, long-term companionship scenarios, HumanClaw tool tests, gateway smokes, SWE-bench/GAIA/OSWorld-oriented scripts. |

## Design Direction

AIGL Assistant is not "a chatbot with tool buttons" and not "an agent platform with a cute skin." The architecture aims for a clear separation:

```text
LLM understands intent.
Memory preserves continuity.
Harness executes reliably.
Tools observe or act.
Persona renderer turns runtime events into AIGL-like expression.
Eval catches drift in reliability, safety, and humanlike experience.
```

Important design principles:

- Keep the interface low-tool-feel: users should not see raw `tool_call`, approval ids, or noisy observations.
- Keep execution explicit and auditable: file writes, shell execution, email actions, external effects, and privacy-sensitive vision go through policy and approval gates.
- Treat memory as persona continuity, not a keyword trigger system.
- Let the model decide semantics with structured context, while code hardens schemas, paths, approvals, redaction, timeouts, event replay, and persistence.
- Preserve the desktop character layer instead of collapsing everything into a control panel.

## Task Execution

HumanClaw exposes a local gateway and an agent loop rather than making the renderer call tools directly.

Runtime path:

```text
Chat / voice / attachment
  -> HumanClaw Desktop Chat Service
  -> window.aigrilDesktop.gateway.runAgent()
  -> HumanClaw Agent Runner
  -> HumanClaw Gateway
  -> local tools / OpenClaw-style tools / MCP tools
  -> structured events
  -> persona progress and final response
```

The current tool surface includes:

- Core tools such as `read`, `write`, `edit`, `apply_patch`, `exec`, `update_plan`, `tool_search`, and permission requests.
- Local HumanClaw tools for email, file management, computer/runtime state, code inspection, artifact verification, and vision capture.
- MCP bridge and capability manager paths for discovering and exposing external tools.
- Audit logs and SSE events for runs, tool starts/finishes, approvals, failures, and analysis.

## Desktop Experience

The packaged product is `HumanClaw`.

- Frameless always-on-top VRM pet window.
- Separate chat window for conversation and task requests.
- Control panel for providers, voice, memory, email, gateway status, and permissions.
- Agent Analysis Lab for inspecting and continuing agent runs.
- Local state directory under `.humanclaw-state` by default.
- Windows NSIS and portable packages are built through Electron Builder.

## Repository Map

```text
electron/   Main process, HumanClaw gateway, agent runner, tools, memory, TTS/ASR workers
src/        Renderer apps for pet, chat, control panel, vision UI, speech, bubbles, character runtime
backend/    Optional FastAPI backend, schemas, legacy services, education/Vivix/static assets
Resources/  AIGL VRM model, VRMA motions, motion intake assets, reference voice assets
docs/       Architecture, memory, gateway, OpenClaw alignment, eval, benchmark, and tooling notes
tests/      Node tests for HumanClaw runtime, tools, memory, gateway, evals, provider, and UI helpers
scripts/    Smoke tests, validation, benchmark runners, eval generation, build helpers
evals/      AIGL humanlike and engineering evaluation fixtures
release/    Desktop release metadata and packaged artifacts when present
```

Core design docs:

- [Embodied Agent Architecture](docs/aigl-embodied-agent-architecture.md)
- [Memory Architecture V2](docs/aigl-memory-architecture-v2.md)
- [HumanClaw Gateway v0](docs/humanclaw-gateway-v0.md)
- [HumanClaw Agent Runner v0](docs/humanclaw-agent-runner-v0.md)
- [Tool Ecosystem Driver Guide](docs/tool-ecosystem-driver-guide.md)
- [Humanlike Eval](docs/aigl-humanlike-eval.md)
- [OpenClaw From Zero](docs/openclaw-from-zero.md)

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

Package the Windows app:

```bash
pnpm desktop:package:win
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

Most desktop settings are controlled from the HumanClaw control panel. The app supports OpenAI-compatible providers and provider presets, including custom base URLs, model names, request timeouts, and local credentials.

Local-only data such as API keys, email credentials, memory state, downloaded speech models, runtime logs, eval outputs, and temporary run state should stay out of Git.

## Validation

Common focused checks:

```bash
pnpm test:humanclaw-gateway
pnpm test:humanclaw-agent
pnpm test:humanclaw-runtime
pnpm test:humanclaw-tool-contracts
pnpm test:humanclaw-memory
pnpm test:aigl-humanlike-eval
```

Broader gateway validation:

```bash
pnpm humanclaw:validate-gateway
```

Humanlike evals:

```bash
pnpm eval:aigl-humanlike:validate
pnpm eval:aigl-humanlike:generate
pnpm eval:aigl-humanlike:report
pnpm eval:aigl-humanlike:long-term:validate
```

## Privacy and Safety

AIGL Assistant is a personal desktop assistant. It can hold local memory, credentials, paths, and private project context on the user's own machine, so the codebase treats those as local runtime data rather than source assets.

Safety defaults include workspace path guards, secret redaction, approval gates for high-risk actions, dry-run behavior for external side effects unless explicitly approved, and audit logging for tool calls. Vision is a perception layer: screenshots help AIGL understand context, but they do not imply permission to click, type, purchase, send, or submit anything.

## Status

The current mainline is active development around HumanClaw `1.0.4`. The priority is to keep the working desktop runtime stable while improving gateway startup reliability, task execution, memory quality, speech/vision experience, tool contracts, and evaluation coverage.
