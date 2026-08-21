# Getting Started with AILIS

This guide contains desktop development, the current model connection, voice runtime, optional backend, packaging, and validation instructions. Return to the [project homepage](../README.md) for the product overview.

## Prerequisites

- Node.js
- pnpm 10.33, pinned through the repository `packageManager` field
- Windows or Linux capable of running Electron for desktop development

## Start the Desktop App

Install dependencies and run in development mode:

```bash
pnpm install
pnpm desktop:dev
```

Build and start:

```bash
pnpm desktop:start
```

Build Windows installer and portable packages:

```bash
pnpm desktop:package
```

## Model Connection

The current release uses AILIS Cloud to connect to the model service, so users can start without entering an API key. Persona orchestration, memory storage, TaskAgent, approvals, and computer and file tools continue to run on the user's PC. Model context required for the current request is relayed through the managed AILIS service.

## Voice Runtime

Prepare the optional desktop voice runtime:

```bash
pnpm ailis:voice-runtime:prepare
```

Prepare ASR only:

```bash
pnpm ailis:asr-runtime:prepare
```

Voice packs are large. Normal development and text interaction do not require the complete offline voice runtime.

## Optional Backend

```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy backend\.env.example backend\.env
python -m uvicorn backend.main:app --reload
```

## Basic Validation

```bash
pnpm test:ailis-runtime
pnpm test:ailis-agent
pnpm test:ailis-tool-contracts
pnpm test:ailis-memory
pnpm ailis:validate-harness
```

The full Gateway validation runs a broader set of runtime, contract, tool, memory, Agent, and smoke checks:

```bash
pnpm ailis:validate-gateway
```

## Repository Layout

```text
electron/   Electron main process, preload bridge, runtime services, and tool adapters
src/        Pet, chat, control panel, voice, visual UI, and bubble renderers
backend/    Optional FastAPI backend, API schemas, memory services, and static assets
Resources/  VRM model, VRMA motions, reference audio, and character assets
docs/       Architecture, memory, tools, evaluation, and release documentation
scripts/    Runtime preparation, validation, benchmarks, and packaging helpers
tests/      Runtime, memory, tool, Gateway, and Agent tests
```

## Secrets and Local Data

Do not commit API keys, account credentials, chat transcripts, runtime logs, or generated evaluation outputs. Model-visible conversation context, tool results, and user-approved image or file content can be sent to the current model service. Tool execution and persistent memory databases remain local by default.
