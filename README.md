# AILIS

AILIS is a desktop agent with a VRM avatar, text and voice interaction, tools, and persistent memory. The desktop main conversation uses **one agent and one durable Session** for dialogue, tool execution, and the final answer. Personality is configuration, not an automatic second model that rewrites task results.

[中文](README.zh-CN.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Français](README.fr.md) · [Deutsch](README.de.md)

## Source identity

The package version is **1.4.1**. This documentation was checked against source commit `00b3244d67a6c63906f674a1b4c3746e4c362d78` in the independent consolidation worktree on 2026-09-06. It is not a claim that every installed 1.4.1 package or concurrent worktree contains the same code.

```powershell
git rev-parse HEAD
git status --short
```

## Start from source

The repository pins pnpm 10.33.0; the recorded local validation used Node 22.17.1. From this repository root:

```powershell
pnpm install --frozen-lockfile
pnpm desktop:dev
```

For a production frontend followed by Electron startup, use `pnpm desktop:start`. These commands install dependencies or start processes and write state; they do not update an existing installed app. Configure the main model in the control panel before testing. Cloud availability, credentials and optional local runtimes are separate requirements.

## What is here

- Electron desktop: control panel, chat, pet, Agent Lab and screen-region selector.
- Gateway and Agent loop: model decisions, tool contracts, approvals, output references and Session checkpoints.
- Memory: persistent context, curated profiles and budgeted background retrieval.
- Optional voice, vision, MCP, local tools and asset packs.
- Separate Hosted Node, Python APIs, website and browser demo. They are not all bundled into the desktop product.

## Current manual

The technical manual is maintained as one Chinese source-of-truth set to avoid divergent translations:

- [Documentation index](docs/README.md)
- [Getting started](docs/getting-started.md) and [configuration / isolation](docs/configuration.md)
- [Architecture](docs/architecture.md), [Agent / Session](docs/agent-session.md), [tools](docs/tools.md), [memory](docs/memory.md)
- [Voice and avatar](docs/voice-and-avatar.md)
- [Development](docs/development.md), [production packaging](docs/production-runtime.md), [backend](docs/backend-and-hosted.md)
- [Evaluation definitions](docs/evaluation.md) and [troubleshooting](docs/troubleshooting.md)

## Limits and safety

A stable Session does not guarantee cache hits or perfect recall. Current compaction, deployment and storage limitations are documented rather than presented as completed features. We do not reuse historical benchmark scores as measurements of this source snapshot.

Tools may access files, networks, accounts and the operating system. Local storage does not imply that selected context never leaves the device. Protect settings, credentials, conversation logs and attachments; Base64-encoded memory secrets are not encrypted storage.

Old release notes and design reports remain recoverable from Git. [Migration and recovery scope](docs/README.md) explains what was removed from the current manual and what runtime/content resources were deliberately preserved.

## Contributing and license

See [CONTRIBUTING](CONTRIBUTING.md) and [AGENTS.md](AGENTS.md). First-party code is declared MIT in [package.json](package.json); see [LICENSE](LICENSE). Third-party code, models, voices and motion assets retain their own terms. A runnable asset is not automatically licensed for redistribution.
