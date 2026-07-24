# docs/README.md 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。
- 文件类型：`documentation`
- 原始行数：87
- SHA-256：`9aa1953578c8f498a2a324828bf6998f2dfa4705d474801738689a9cbab9b1f1`
- 可运行副本：[打开源文件](../../../source/docs/README.md)
- 依赖：未从静态文本识别到显式依赖
- 主要符号：未从静态文本识别到命名符号

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code># AILIS Documentation</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 2 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3 | <code>This directory contains the design record, operating guides, evaluation plans, and release notes for AILIS. Start with the current architecture documents below; older documents remain useful as design history, but they are not all descriptions of the current runtime.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 4 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5 | <code>## Start Here</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 6 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 7 | <code>- [Embodied Agent Architecture](ailis-embodied-agent-architecture.md) - product and runtime overview.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 8 | <code>- [System TaskAgent Architecture](ailis-system-taskagent-architecture.md) - Persona/TaskAgent responsibilities and handoff contract.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 9 | <code>- [Codex Multi-Agent Data-Flow Migration](ailis-codex-multi-agent-dataflow-migration.md) - current agent object and result flow.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 10 | <code>- [Memory Architecture V2](ailis-memory-architecture-v2.md) - current memory lanes and lifecycle.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 11 | <code>- [Tool Ecosystem Driver Guide](tool-ecosystem-driver-guide.md) - tool, MCP, skill, and adapter entry points.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 12 | <code>- [Demo and Benchmark Scorecard](ailis-demo-benchmark-scorecard.md) - current evidence and benchmark status.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 13 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 14 | <code>## Agent Runtime And Harness</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 15 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 16 | <code>- [Agent Runner v0](ailis-agent-runner-v0.md)</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 17 | <code>- [Gateway v0](ailis-gateway-v0.md)</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 18 | <code>- [System TaskAgent Architecture](ailis-system-taskagent-architecture.md)</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 19 | <code>- [Codex-Compatible Object Model Migration](ailis-codex-compatible-object-model-migration.md)</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 20 | <code>- [Codex Object Model Gap Analysis](ailis-codex-object-model-gap-analysis.md)</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 21 | <code>- [Codex Multi-Agent Data-Flow Migration](ailis-codex-multi-agent-dataflow-migration.md)</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 22 | <code>- [Codex Context Compaction](ailis-codex-context-compaction.md)</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 23 | <code>- [Long-Context Runtime Source Analysis](ailis-long-context-runtime-codex-source-analysis.md)</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 24 | <code>- [Codex Harness Long-Run Development Plan](ailis-codex-harness-longrun-development-plan-20260706.md)</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 25 | <code>- [Agent Runtime Optimization Plan](ailis-agent-runtime-codex-claude-code-optimization-plan.md)</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 26 | <code>- [Runtime Alignment Verification](ailis-runtime-codex-openclaw-verification.md)</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 27 | <code>- [Codex Runtime Optimization Reference](codex-runtime-optimization-reference.md)</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 28 | <code>- [AILIS vs Codex Execution Benchmark](ailis-vs-codex-execution-benchmark.md)</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 29 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 30 | <code>## Tools, Artifacts, And Integrations</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 31 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 32 | <code>- [Advanced Tooling](ailis-advanced-tooling.md)</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 33 | <code>- [Artifact Tools Architecture](ailis-artifact-tools-architecture.md)</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 34 | <code>- [Artifact Tools Evaluation](ailis-artifact-tools-evaluation.md)</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 35 | <code>- [RAGFlow Artifact Extraction Analysis](ailis-ragflow-artifact-tool-extraction-analysis.md)</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 36 | <code>- [RAGFlow-Lite Artifact Runtime](ailis-artifact-runtime-ragflow-lite.md)</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 37 | <code>- [RAGFlow-Lite Source Index](ailis-ragflow-lite-source-index.md)</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 38 | <code>- [Standard Tool Packs](ailis-standard-tool-packs.md)</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 39 | <code>- [Tool Acquisition Gateway](ailis-codex-tool-acquisition-gateway.md)</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 40 | <code>- [Skill And MCP Reference](ailis-codex-skill-mcp-reference.md)</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 41 | <code>- [Tool Layer Semantics](codex-tool-layer-semantics.md)</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 42 | <code>- [Computer Runtime](ailis-computer-runtime.md)</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 43 | <code>- [Email Tool](ailis-email-tool.md)</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 44 | <code>- [File Manager Tool](ailis-file-manager-tool.md)</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 45 | <code>- [Platform Adapter](ailis-platform-adapter.md)</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 46 | <code>- [Contract Intake Pipeline](ailis-contract-intake-pipeline.md)</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 47 | <code>- [Crawl4AI Local Worker](ailis-crawl4ai-local-worker.md)</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 48 | <code>- [Web Search And Fetch Path](ailis-web-search-fetch-correct-path.md)</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 49 | <code>- [Network Retrieval Playbook](codex-style-network-retrieval-playbook.md)</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 50 | <code>- [Local LLM Providers](local-llm-providers.md)</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 51 | <code>- [OpenClaw Tool Alignment](openclaw-tool-alignment.md)</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 52 | <code>- [OpenClaw From Zero](openclaw-from-zero.md)</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 53 | <code>- [Claw Integration Basis Research](claw-integration-basis-research.md)</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 54 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 55 | <code>## Memory, Persona, And Experience</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 56 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 57 | <code>- [Memory Architecture V1](ailis-memory-architecture-v1.md)</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 58 | <code>- [Memory Architecture V2](ailis-memory-architecture-v2.md)</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 59 | <code>- [User System Launch Plan](ailis-user-system-launch.md)</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 60 | <code>- [Embodied Agent Architecture](ailis-embodied-agent-architecture.md)</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 61 | <code>- [Realtime Voice And AIRI Research](realtime-voice-airi-research.md)</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 62 | <code>- [Open Source Asset Pack Runtime](ailis-open-source-asset-pack-runtime.md)</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 63 | <code>- [Cartoon Rendering Options](ailis-cartoon-rendering-options.md)</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 64 | <code>- [Shader Rendering System](ailis-shader-rendering-system.md)</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 65 | <code>- [Master Stylized Rendering Research](ailis-master-stylized-rendering-research.md)</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 66 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 67 | <code>## Evaluation</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 68 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 69 | <code>- [Eval-First Roadmap](ailis-eval-first-roadmap.md)</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 70 | <code>- [Benchmark Coverage And Optimization Plan](ailis-benchmark-coverage-and-optimization-plan.md)</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 71 | <code>- [Demo And Benchmark Scorecard](ailis-demo-benchmark-scorecard.md)</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 72 | <code>- [Desktop-Real GAIA Evaluation](ailis-desktop-real-gaia-eval.md)</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 73 | <code>- [OSWorld PC Evaluation](ailis-osworld-pc-eval.md)</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 74 | <code>- [Humanlike Experience Evaluation](ailis-humanlike-eval.md)</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 75 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 76 | <code>## Release And Operations</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 77 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 78 | <code>- [Release Build System](ailis-release-build-system.md)</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 79 | <code>- [Release Packaging](ailis-release-packaging.md)</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 80 | <code>- [Release Notes](releases/)</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 81 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 82 | <code>## Adjacent Project Records</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 83 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 84 | <code>- [Simulation Classroom Delivery Report](simclass-delivery-report.md)</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 85 | <code>- [Simulation Classroom Iteration Log](simclass-iteration-log.md)</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 86 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 87 | <code>Generated images and benchmark data used by the documentation live under [assets](assets/). New architecture documents should be linked from this index and from the smallest relevant README section.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
