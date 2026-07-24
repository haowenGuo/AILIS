# backend/blog_content/posts/en/autoresearch-evidence-first-agentic-research.md 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。
- 文件类型：`documentation`
- 原始行数：146
- SHA-256：`268da1f26e54149964eeaeee07582aaeb372c56780d6fd436291c012c85a1740`
- 可运行副本：[打开源文件](../../../../../../source/backend/blog_content/posts/en/autoresearch-evidence-first-agentic-research.md)
- 依赖：未从静态文本识别到显式依赖
- 主要符号：未从静态文本识别到命名符号

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code># AutoResearch: Turning Agentic Research into a Traceable Pipeline</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 2 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3 | <code>AutoResearch is an agentic research system for complex technical work. Its goal is not merely to search and summarize, but to turn research into an inspectable engineering pipeline.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 4 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5 | <code>This post is based on the local `F:\AutoResearch` project README, MVP architecture notes, and Phase 1 module checklist. It is a first project-level introduction: why the system exists, how it is structured, and how it moves from a research topic to an evidence-backed Markdown report.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 6 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 7 | <code>## The problem it is trying to solve</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 8 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 9 | <code>Many research agents are basically search plus summarization.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 10 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 11 | <code>That can work for short questions, but longer tasks expose several problems:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 12 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 13 | <code>- search direction drifts</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 14 | <code>- claims and evidence are loosely connected</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 15 | <code>- intermediate steps are hard to inspect</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 16 | <code>- reports may look complete while citations remain weak</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 17 | <code>- each run behaves like a one-off prompt instead of a reusable workflow</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 18 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 19 | <code>AutoResearch takes a more engineering-oriented position. It treats research as a task pipeline rather than a single model response. The input is a topic; the output is a structured report with sources, evidence, and traceable intermediate artifacts.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 20 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 21 | <code>## The Phase 1 boundary</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 22 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 23 | <code>AutoResearch does not begin by trying to automate all of science.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 24 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 25 | <code>Its Phase 1 focuses on one main path:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 26 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 27 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 28 | <code>research topic</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 29 | <code>  -&gt; question decomposition</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 30 | <code>  -&gt; web and paper retrieval</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 31 | <code>  -&gt; evidence extraction and citation storage</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 32 | <code>  -&gt; outline generation</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 33 | <code>  -&gt; section drafting</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 34 | <code>  -&gt; critic review</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 35 | <code>  -&gt; final Markdown report</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 36 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 37 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 38 | <code>That boundary matters.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 39 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 40 | <code>Phase 1 intentionally avoids automatic experiment execution, automatic code modification, leaderboard submission, and complex multi-agent tree search. The immediate goal is to build a credible Research Core first.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 41 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 42 | <code>I like this tradeoff because research systems need grounding before they need spectacle. If the evidence layer is weak, adding more agents only amplifies instability.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 43 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 44 | <code>## The architectural split</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 45 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 46 | <code>The README and architecture notes show a clear layered structure:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 47 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 48 | <code>- `apps/api`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 49 | <code>- `apps/web`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 50 | <code>- `services/worker`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 51 | <code>- `packages/agent-core`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 52 | <code>- `packages/connectors`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 53 | <code>- `packages/memory`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 54 | <code>- `packages/paper-rag`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 55 | <code>- `packages/report-engine`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 56 | <code>- `packages/shared-schemas`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 57 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 58 | <code>The API creates tasks, returns status, streams progress, and exposes reports. The web app lets users submit topics, inspect the timeline, review sources, and read the generated report. The worker runs long research jobs asynchronously instead of forcing the whole process into a single request.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 59 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 60 | <code>The package layer is where the design becomes interesting.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 61 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 62 | <code>`agent-core` orchestrates the main path with roles such as Planner, WebScout, ScholarScout, Synthesis, and Critic. `connectors` handle search and content fetching. `memory` normalizes and deduplicates sources while preserving task artifacts. `paper-rag` builds evidence cards and citations. `report-engine` assembles outlines, section drafts, and final Markdown reports.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 63 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 64 | <code>The core value of this split is that every stage has an explicit artifact. The system is not just one large prompt with hidden intermediate reasoning.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 65 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 66 | <code>## Evidence before style</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 67 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 68 | <code>One principle in the AutoResearch documents is especially important: evidence comes before prose style.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 69 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 70 | <code>The system first needs to ensure that:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 71 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 72 | <code>- sources are traceable</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 73 | <code>- claims are grounded in evidence</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 74 | <code>- reports carry citations</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 75 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 76 | <code>Only after that should it optimize for writing quality.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 77 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 78 | <code>This sounds simple, but it is a serious product decision. A research report is not marketing copy. For technical surveys, literature reviews, and architecture decisions, the most valuable part is not fluency. It is knowing why a conclusion should be trusted.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 79 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 80 | <code>That is why AutoResearch does not treat report generation as a final “write everything” prompt. It decomposes the process into evidence extraction, citation storage, outline generation, section drafting, and critic review. This may be slower, but it is much more suitable for long-term technical work.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 81 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 82 | <code>## Why the memory layer matters</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 83 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 84 | <code>In an automatic research system, memory is not just chat history.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 85 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 86 | <code>AutoResearch uses memory more like a research asset layer. It is responsible for:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 87 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 88 | <code>- normalizing URLs, DOIs, arXiv IDs, and other source identities</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 89 | <code>- deduplicating repeated sources</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 90 | <code>- preserving intermediate artifacts from each research task</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 91 | <code>- supporting lookup of sources, evidence, and reports by task</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 92 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 93 | <code>This matters for long-running work.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 94 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 95 | <code>Without memory, every research run starts from scratch. With structured memory, the system can accumulate what it has already read, what it has already concluded, and which pieces of evidence support which claims.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 96 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 97 | <code>That is the difference between a search-summary tool and a real research workflow. AutoResearch is not only generating a report; it is preserving a research trajectory.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 98 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 99 | <code>## The product value</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 100 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 101 | <code>AutoResearch is well suited for tasks such as:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 102 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 103 | <code>- technical architecture surveys</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 104 | <code>- literature direction mapping</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 105 | <code>- open-source project comparisons</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 106 | <code>- early-stage competition planning</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 107 | <code>- system design research</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 108 | <code>- first drafts of long reports or proposals</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 109 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 110 | <code>It is less about answering a single fact and more about helping a user form a judgment around a complex topic.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 111 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 112 | <code>For example, when researching an autonomous science system, a game engine architecture, or a safety-evaluation pipeline, a single chat response is rarely enough. A better workflow is to decompose the question, collect sources, extract evidence, build an outline, and preserve the path that produced the final report.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 113 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 114 | <code>## Source and local usage</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 115 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 116 | <code>The local README shows that AutoResearch is a Python project using FastAPI, Pydantic, SQLAlchemy, Requests, and Uvicorn.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 117 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 118 | <code>The basic local setup looks like this:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 119 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 120 | <code>```powershell</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 121 | <code>python -m venv .venv</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 122 | <code>.\.venv\Scripts\python.exe -m pip install -e .[dev]</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 123 | <code>.\.venv\Scripts\python.exe -m uvicorn autoresearch.api.main:app --host 127.0.0.1 --port 8000</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 124 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 125 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 126 | <code>Then the worker can be started with:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 127 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 128 | <code>```powershell</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 129 | <code>.\.venv\Scripts\python.exe -m autoresearch.worker.main --poll-interval 1</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 130 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 131 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 132 | <code>The web UI lives under `apps\web` and can be run separately.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 133 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 134 | <code>I am not automatically packaging or uploading the local source tree, because public distribution boundaries still need to be confirmed. But the project already has a structure that could later support a polished GitHub README, screenshots, reproducible demos, and public research reports.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 135 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 136 | <code>## What to write next</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 137 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 138 | <code>AutoResearch can naturally become a series:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 139 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 140 | <code>- how the Planner decomposes a research topic</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 141 | <code>- how evidence cards reduce vague reporting</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 142 | <code>- how memory supports long-running research</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 143 | <code>- how the report engine turns evidence into long-form writing</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 144 | <code>- why automatic research cannot be reduced to one large prompt</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 145 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 146 | <code>This first article is the overview. The main idea is simple: AutoResearch turns agentic research from one-shot generation into a traceable, reviewable, and steadily improvable pipeline.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
