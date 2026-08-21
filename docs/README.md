# AILIS Documentation

This directory contains the design record, operating guides, evaluation plans, and release notes for AILIS. Start with the current architecture documents below; older documents remain useful as design history, but they are not all descriptions of the current runtime.

## Start Here

- [Getting Started](getting-started.md) - install, configure, run, package, and validate AILIS.
- [快速开始](getting-started.zh-CN.md) - AILIS 安装、配置、运行、打包与验证。
- [Embodied Agent Architecture](ailis-embodied-agent-architecture.md) - product and runtime overview.
- [System TaskAgent Architecture](ailis-system-taskagent-architecture.md) - Persona/TaskAgent responsibilities and handoff contract.
- [Codex Multi-Agent Data-Flow Migration](ailis-codex-multi-agent-dataflow-migration.md) - current agent object and result flow.
- [Memory Architecture V2](ailis-memory-architecture-v2.md) - current memory lanes and lifecycle.
- [Memory BM25 + MMR Baseline](ailis-memory-bm25-mmr-baseline.md) - current production retrieval
  parameters, BM25-only evaluation results, latency, and future comparison rules.
- [Tool Ecosystem Driver Guide](tool-ecosystem-driver-guide.md) - tool, MCP, skill, and adapter entry points.
- [Demo and Benchmark Scorecard](ailis-demo-benchmark-scorecard.md) - current evidence and benchmark status.
- [TaskAgent A7 Context Baseline](ailis-a7-taskagent-context-baseline.md) - current mainline context profile, frozen Terminal-Bench evidence, and the next promotion gate.
- [Version Registry](ailis-version-registry.md) - product releases, experiment lineage, score ownership, and the accepted `A7-main` parent.
- [Harness Architecture Audit and Roadmap](ailis-harness-architecture-audit-roadmap.md) - current execution chain, measured Codex gaps, and staged development gates.
- [Codebase Refactor Audit](ailis-codebase-refactor-audit.md) - measured code growth, ownership debt, realistic line budgets, and a rollback-safe modularization sequence.

## Agent Runtime And Harness

- [Agent Runner v0](ailis-agent-runner-v0.md)
- [Gateway v0](ailis-gateway-v0.md)
- [System TaskAgent Architecture](ailis-system-taskagent-architecture.md)
- [Codex-Compatible Object Model Migration](ailis-codex-compatible-object-model-migration.md)
- [Codex Object Model Gap Analysis](ailis-codex-object-model-gap-analysis.md)
- [Codex Multi-Agent Data-Flow Migration](ailis-codex-multi-agent-dataflow-migration.md)
- [Codex Context Compaction](ailis-codex-context-compaction.md)
- [Long-Context Runtime Source Analysis](ailis-long-context-runtime-codex-source-analysis.md)
- [Codex Harness Long-Run Development Plan](ailis-codex-harness-longrun-development-plan-20260706.md)
- [Agent Runtime Optimization Plan](ailis-agent-runtime-codex-claude-code-optimization-plan.md)
- [Runtime Alignment Verification](ailis-runtime-codex-openclaw-verification.md)
- [Codex Runtime Optimization Reference](codex-runtime-optimization-reference.md)
- [AILIS vs Codex Execution Benchmark](ailis-vs-codex-execution-benchmark.md)
- [TaskAgent A7 Context Baseline](ailis-a7-taskagent-context-baseline.md)
- [Version Registry](ailis-version-registry.md)
- [Harness Architecture Audit and Roadmap](ailis-harness-architecture-audit-roadmap.md)
- [Codebase Refactor Audit](ailis-codebase-refactor-audit.md)

## Tools, Artifacts, And Integrations

- [Advanced Tooling](ailis-advanced-tooling.md)
- [Artifact Tools Architecture](ailis-artifact-tools-architecture.md)
- [Artifact Tools Evaluation](ailis-artifact-tools-evaluation.md)
- [RAGFlow Artifact Extraction Analysis](ailis-ragflow-artifact-tool-extraction-analysis.md)
- [RAGFlow-Lite Artifact Runtime](ailis-artifact-runtime-ragflow-lite.md)
- [RAGFlow-Lite Source Index](ailis-ragflow-lite-source-index.md)
- [Standard Tool Packs](ailis-standard-tool-packs.md)
- [Tool Acquisition Gateway](ailis-codex-tool-acquisition-gateway.md)
- [Skill And MCP Reference](ailis-codex-skill-mcp-reference.md)
- [Tool Layer Semantics](codex-tool-layer-semantics.md)
- [Computer Runtime](ailis-computer-runtime.md)
- [Email Tool](ailis-email-tool.md)
- [File Manager Tool](ailis-file-manager-tool.md)
- [Platform Adapter](ailis-platform-adapter.md)
- [Contract Intake Pipeline](ailis-contract-intake-pipeline.md)
- [Crawl4AI Local Worker](ailis-crawl4ai-local-worker.md)
- [Web Search And Fetch Path](ailis-web-search-fetch-correct-path.md)
- [Network Retrieval Playbook](codex-style-network-retrieval-playbook.md)
- [Local LLM Providers](local-llm-providers.md)
- [OpenClaw Tool Alignment](openclaw-tool-alignment.md)
- [OpenClaw From Zero](openclaw-from-zero.md)
- [Claw Integration Basis Research](claw-integration-basis-research.md)

## Memory, Persona, And Experience

- [Memory Architecture V1](ailis-memory-architecture-v1.md)
- [Memory Architecture V2](ailis-memory-architecture-v2.md)
- [Memory BM25 + MMR Baseline](ailis-memory-bm25-mmr-baseline.md)
- [User System Launch Plan](ailis-user-system-launch.md)
- [Embodied Agent Architecture](ailis-embodied-agent-architecture.md)
- [Realtime Voice And AIRI Research](realtime-voice-airi-research.md)
- [Open Source Asset Pack Runtime](ailis-open-source-asset-pack-runtime.md)
- [Cartoon Rendering Options](ailis-cartoon-rendering-options.md)
- [Shader Rendering System](ailis-shader-rendering-system.md)
- [Master Stylized Rendering Research](ailis-master-stylized-rendering-research.md)

## Evaluation

- [Eval-First Roadmap](ailis-eval-first-roadmap.md)
- [Benchmark Coverage And Optimization Plan](ailis-benchmark-coverage-and-optimization-plan.md)
- [Demo And Benchmark Scorecard](ailis-demo-benchmark-scorecard.md)
- [Desktop-Real GAIA Evaluation](ailis-desktop-real-gaia-eval.md)
- [OSWorld PC Evaluation](ailis-osworld-pc-eval.md)
- [Humanlike Experience Evaluation](ailis-humanlike-eval.md)

## Release And Operations

- [Release Build System](ailis-release-build-system.md)
- [Release Packaging](ailis-release-packaging.md)
- [Release Notes](releases/)

## Adjacent Project Records

- [Simulation Classroom Delivery Report](simclass-delivery-report.md)
- [Simulation Classroom Iteration Log](simclass-iteration-log.md)

Generated images and benchmark data used by the documentation live under [assets](assets/). New architecture documents should be linked from this index and from the smallest relevant README section.
