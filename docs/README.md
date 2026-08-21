# AILIS Documentation

<p align="center">
  <strong>Build, understand, and evaluate the AILIS desktop embodied Agent.</strong>
</p>

<p align="center">
  <a href="../README.md">Project Home</a> ·
  <a href="README.zh-CN.md">简体中文</a> ·
  <a href="getting-started.md">Quick Start</a> ·
  <a href="evaluation.md">Benchmarks</a>
</p>

The pages below describe the current `v1.4.0` codebase and the accepted A7 TaskAgent context baseline. Design studies and experiment logs remain in the repository for traceability, but they are not part of the current product documentation.

## Start Here

| | Guide | What it covers |
| :---: | --- | --- |
| 01 | **[Getting Started](getting-started.md)** | Install dependencies, run the desktop app, prepare voice, validate, and package. |
| 02 | **[System Architecture](architecture.md)** | Desktop experience, Gateway, Persona, TaskAgent, Agent Loop, tools, memory, and model relay. |
| 03 | **[TaskAgent Runtime](taskagent.md)** | Thread/Turn lifecycle, canonical context, tools, approvals, checkpoints, and completion. |
| 04 | **[Memory System](memory.md)** | Persistent memory lanes, BM25/MMR retrieval, prompt projection, privacy, and limits. |
| 05 | **[Tool Runtime](tools.md)** | Built-in tools, contracts, deferred discovery, execution policy, artifacts, and audit events. |
| 06 | **[Evaluation](evaluation.md)** | GAIA, Terminal-Bench, ToolSandbox, long-memory results, Codex comparisons, and evidence. |

## Current Runtime At A Glance

```text
Desktop UI and embodied character
        |
        v
AILIS Gateway  ->  approvals, events, audit, model relay
        |
        +------> Persona runtime  -> conversation and presentation
        |
        +------> TaskAgent Harness
                    |
                    v
              Agent Loop + ContextManager
                    |
                    v
              Tool runtime and platform adapters

Memory runtime and persistent state support both Persona and TaskAgent lanes.
```

The production Agent Loop lives in [`electron/agent-loop/`](../electron/agent-loop/). The previous `electron/ailis-agent-runner.cjs` path is now a compatibility entry point, not the implementation.

## Engineering References

These pages are useful when changing the runtime or reproducing measurements:

- [TaskAgent A7 Context Baseline](ailis-a7-taskagent-context-baseline.md)
- [Core Loop Reading Guide](ailis-core-loop-reading-guide.zh-CN.md)
- [Full Evaluation Scorecard](ailis-evaluation-master-scorecard-20260817.md)
- [Memory Retrieval Baseline](ailis-memory-bm25-mmr-baseline.md)
- [Release Build System](ailis-release-build-system.md)
- [Version and Experiment Registry](ailis-version-registry.md)
- [Harness Architecture Audit](ailis-harness-architecture-audit-roadmap.md)
- [Codebase Refactor Audit](ailis-codebase-refactor-audit.md)

## Documentation Status

Only pages linked under **Start Here** are maintained as the public description of the current runtime. Files with names such as `v0`, `plan`, `research`, `migration`, `analysis`, or a dated benchmark run are engineering records. They may describe rejected ideas, earlier implementations, or frozen experiments.

Release history is available under [`docs/releases/`](releases/) and on [GitHub Releases](https://github.com/haowenGuo/AILIS/releases).
