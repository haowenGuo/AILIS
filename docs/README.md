# AILIS documentation

[中文](README.zh-CN.md) · [Project](../README.md)

## Version boundary

These core guides describe the **unreleased unified-agent working source** being consolidated on `codex/code-consolidation-20260904`. Its pre-cleanup snapshot is `1442cc5`. The package version remains `1.4.1`; that number alone does not identify the architecture. The public tag at `659bf61` and [release notes](releases/v1.4.1.md) describe an earlier split-agent implementation. This worktree has not replaced the installed app.

## Current implementation

One main Agent owns a durable Session, tools, and the final reply. Personality and relationship preferences are context, not a second reply-writing model.

| Guide | Scope |
| --- | --- |
| [Architecture](architecture.md) | Entry points, execution, ownership, compatibility |
| [Agent runtime](taskagent.md) | Unified lifecycle, tool protocol, checkpoint recovery |
| [Memory](memory.md) | Session history versus long-term memory |
| [Tools](tools.md) | Tool reference; verify individual adapters against source |
| [Getting started](getting-started.md) | Build/start reference; runtime packs are separate |
| [Evaluation](evaluation.md) | Historical measurements, not scores for this cleanup |

The `taskagent.md` URL is retained so existing links work; its title and content now describe the main unified runtime.

## History and evidence

- [Archived architecture](history/architecture/README.md): former v0/V1/V2 and dual-agent designs.
- [Unified-session implementation note](unified-agent-session.md): original migration and test record.
- [A7 context baseline](ailis-a7-taskagent-context-baseline.md) and [evaluation scorecard](ailis-evaluation-master-scorecard-20260817.md): frozen evidence.
- [Release history](releases/): preserve the behavior of each published version.

Only the architecture, runtime, memory and index pages in both languages were rewritten in this consolidation batch. Other research, module and operational guides are not automatically current merely because they are present in this directory.
