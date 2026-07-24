# docs/ailis-crawl4ai-local-worker.md 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。
- 文件类型：`documentation`
- 原始行数：84
- SHA-256：`cd5672ced14a31173efbdf002f4fc4ac0be76293ee93632401f0bab8c2b3bc7b`
- 可运行副本：[打开源文件](../../../source/docs/ailis-crawl4ai-local-worker.md)
- 依赖：未从静态文本识别到显式依赖
- 主要符号：未从静态文本识别到命名符号

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code># AILIS Crawl4AI Local Worker</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 2 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3 | <code>Date: 2026-06-22</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 4 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5 | <code>AILIS should treat Crawl4AI as the default mature rendering/extraction backend for difficult web pages, not as a Docker-only side service.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 6 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 7 | <code>## Runtime Shape</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 8 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 9 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 10 | <code>web_search / web_research</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 11 | <code>  -&gt; candidate URLs</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 12 | <code>  -&gt; web_fetch</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 13 | <code>     -&gt; local Crawl4AI worker first when enabled or explicitly requested</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 14 | <code>     -&gt; legacy Crawl4AI HTTP URL only when configured</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 15 | <code>     -&gt; builtin fetch/extract fallback when Crawl4AI is unavailable</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 16 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 17 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 18 | <code>The local worker is `scripts/ailis-crawl4ai-worker.py`. It calls the Python `crawl4ai` package directly with `AsyncWebCrawler`, then returns JSON containing Markdown, links, metadata, and structured failure information.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 19 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 20 | <code>## Product Packaging</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 21 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 22 | <code>AILIS release packages should include an application-private web runtime so end users do not need to install Python, uv, pip, Playwright, or Crawl4AI manually.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 23 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 24 | <code>Packaging flow:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 25 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 26 | <code>```powershell</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 27 | <code>pnpm ailis:web-runtime:prepare</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 28 | <code>pnpm desktop:package:win</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 29 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 30 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 31 | <code>`pnpm ailis:web-runtime:prepare` prepares `build-cache/ailis-web-runtime` from the developer/runtime cache and `electron-builder.yml` packages it as `resources/ailis-web-runtime`. This is a build-time step, not a first-run user install step.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 32 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 33 | <code>If the existing `.ailis-runtime/crawl4ai-venv` is tied to a system Python such as Anaconda, the prepare script rebuilds it with uv-managed private Python before packaging. The prepared runtime can include:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 34 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 35 | <code>- `crawl4ai-venv`: the ready-to-run Crawl4AI worker environment.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 36 | <code>- `python`: optional portable/private Python copied from `.ailis-runtime/python` or `build-cache/ailis-web-runtime-source/python`.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 37 | <code>- `uv`: optional private uv copied from `.ailis-runtime/uv` or `build-cache/ailis-web-runtime-source/uv`.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 38 | <code>- `ms-playwright`: private Playwright browser cache used by Crawl4AI for rendered extraction.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 39 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 40 | <code>If private Python cannot be downloaded or preseeded, packaging should fail rather than silently shipping a non-portable system-Python venv. Release builders can preseed `.ailis-runtime/python` or `build-cache/ailis-web-runtime-source/python` in offline environments.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 41 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 42 | <code>At runtime, `web_fetch` resolves Crawl4AI Python in this order:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 43 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 44 | <code>1. Explicit tool args or env vars: `crawl4aiPython`, `AILIS_CRAWL4AI_PYTHON`, `AILIS_PYTHON`.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 45 | <code>2. Packaged runtime: `process.resourcesPath/ailis-web-runtime/crawl4ai-venv`, then `process.resourcesPath/ailis-web-runtime/python`.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 46 | <code>3. Developer package cache: `build-cache/ailis-web-runtime/crawl4ai-venv`, then `build-cache/ailis-web-runtime/python`.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 47 | <code>4. Local dev fallback: `.ailis-runtime/crawl4ai-venv`.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 48 | <code>5. System `python`.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 49 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 50 | <code>If the private runtime is missing or broken, AILIS falls back to builtin HTML/text extraction instead of blocking all search.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 51 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 52 | <code>## Developer Install Without Docker</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 53 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 54 | <code>```powershell</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 55 | <code>powershell -NoProfile -ExecutionPolicy Bypass -File scripts/setup-ailis-crawl4ai.ps1</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 56 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 57 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 58 | <code>This creates `.ailis-runtime/crawl4ai-venv`, installs `crawl4ai`, and installs Playwright Chromium. Developers can then run `pnpm ailis:web-runtime:prepare` to copy that runtime into `build-cache/ailis-web-runtime` for packaging.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 59 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 60 | <code>To force AILIS to use that venv:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 61 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 62 | <code>```powershell</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 63 | <code>$env:AILIS_CRAWL4AI_PYTHON = "$PWD\.ailis-runtime\crawl4ai-venv\Scripts\python.exe"</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 64 | <code>$env:AILIS_CRAWL4AI_ENABLED = "1"</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 65 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 66 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 67 | <code>## Configuration</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 68 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 69 | <code>- `AILIS_CRAWL4AI_ENABLED=1`: enable full local Crawl4AI worker use in auto mode.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 70 | <code>- `AILIS_CRAWL4AI_WORKER`: override worker script path.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 71 | <code>- `AILIS_CRAWL4AI_PYTHON`: override Python executable.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 72 | <code>- `AILIS_CRAWL4AI_URL`: legacy HTTP service base URL, only for users who intentionally run a Crawl4AI service.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 73 | <code>- `AILIS_WEB_FETCH_PROVIDER=builtin`: disable Crawl4AI and use the builtin fetch/extract path.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 74 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 75 | <code>## Tool Behavior</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 76 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 77 | <code>- `web_fetch({ provider: "crawl4ai" })` forces local rendered Crawl4AI extraction unless a legacy `crawl4aiUrl` is supplied.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 78 | <code>- `web_fetch({ provider: "builtin" })` disables rendered fallback.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 79 | <code>- `web_research` passes the Crawl4AI worker/python settings down to `web_fetch`, so search-selected pages benefit automatically.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 80 | <code>- If the Python package is missing, the worker returns `crawl4ai_missing_dependency` with install commands, and `web_fetch` safely falls back to builtin extraction instead of submitting empty evidence.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 81 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 82 | <code>## Why This Replaces Further Hand-Rolled HTML Optimization</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 83 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 84 | <code>The goal is not to keep adding custom HTML heuristics. Crawl4AI provides the mature browser/render/Markdown layer. AILIS should focus on evidence-chain orchestration: candidate ranking, source disambiguation, PDF routing, evidence cards, and final-answer verification.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
