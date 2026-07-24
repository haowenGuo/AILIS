# docs/ailis-web-search-fetch-correct-path.md 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。
- 文件类型：`documentation`
- 原始行数：72
- SHA-256：`7b2f231cb86cef68a388b2a6b5e94d0f87a5ac749cb3d0646dcc2a580fd6ba63`
- 可运行副本：[打开源文件](../../../source/docs/ailis-web-search-fetch-correct-path.md)
- 依赖：未从静态文本识别到显式依赖
- 主要符号：未从静态文本识别到命名符号

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code># AILIS Web Search / Web Fetch Correct Path</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 2 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3 | <code>Date: 2026-06-20</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 4 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5 | <code>## Why The Chain Got Worse</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 6 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 7 | <code>The recent failure was not just "Bing is bad" or "the model is dumb". The broken part was the retrieval chain:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 8 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 9 | <code>1. Search produced a mixed result set where broad official/home pages appeared before target-specific guide pages.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 10 | <code>2. The search merge stage truncated raw results before reranking, so lower-ranked but relevant pages were lost.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 11 | <code>3. `web_research` then fetched broad pages even when target terms were missing.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 12 | <code>4. Fetch candidates were not diversified by host, so one JavaScript-heavy site could consume the whole page budget.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 13 | <code>5. A fetched long page could look "complete" even if it was not answer-bearing for the target entity.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 14 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 15 | <code>This means search quality must be controlled at every step, not only by adding more providers.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 16 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 17 | <code>## What Good Systems Do</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 18 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 19 | <code>SearXNG shows the value of a real search API surface: structured parameters, engine/category selection, and JSON output. Its docs also warn that query syntax such as `site:` is passed to underlying search services, so not every engine honors it the same way. A robust agent search layer must treat provider results as candidates, not truth.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 20 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 21 | <code>Reference: https://docs.searxng.org/dev/search_api.html</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 22 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 23 | <code>Firecrawl's search design combines discovery and optional page content retrieval. It supports web/news/image sources, search categories such as GitHub/research/PDF, domain include/exclude filters, and a search-then-scrape pattern. The important idea is not "call Firecrawl", but "separate discovery, filtering, scraping, and evidence packaging".</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 24 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 25 | <code>Reference: https://docs.firecrawl.dev/features/search</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 26 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 27 | <code>Firecrawl scrape emphasizes LLM-ready markdown and handling hard pages such as JS-rendered pages, PDFs, images, and dynamic content. That maps to AILIS as a fetch escalation policy: simple static fetch first, rendered extraction when static fetch returns a shell, and document/media tools for non-HTML.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 28 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 29 | <code>Reference: https://docs.firecrawl.dev/features/scrape</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 30 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 31 | <code>Crawl4AI's useful ideas are content selection, markdown generation, link references, BM25/pruning filters, CSS/target element extraction, and preserving structured metadata/links. AILIS should return an evidence bundle with text, links, headings, tables, metadata, and quality labels, rather than dumping raw HTML text into the model.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 32 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 33 | <code>References:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 34 | <code>- https://docs.crawl4ai.com/core/markdown-generation/</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 35 | <code>- https://docs.crawl4ai.com/core/content-selection/</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 36 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 37 | <code>OpenAI's hosted web search design emphasizes citations, source metadata, and tunable search context. The agent should not just receive noisy snippets; it should receive a controlled evidence surface with source accounting.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 38 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 39 | <code>Reference: https://platform.openai.com/docs/guides/tools-web-search</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 40 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 41 | <code>## Correct AILIS Direction</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 42 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 43 | <code>AILIS should keep `web_search`, `web_fetch`, and `web_research`, but their contract should be:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 44 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 45 | <code>1. Query planning: preserve literal user intent, add exact entity variants, add vertical/source-focused variants only when context is specific enough.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 46 | <code>2. Candidate collection: collect a wide pool, deduplicate, preserve source metadata, and never truncate before reranking.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 47 | <code>3. Relevance gates: for multi-entity tasks, a result that only matches broad context terms is not a fetch candidate.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 48 | <code>4. Fetch selection: diversify hosts before spending multiple fetches on one domain.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 49 | <code>5. Fetch extraction: classify `sufficient_evidence`, `partial_evidence`, `off_target_evidence`, `js_shell`, `access_denied`, etc.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 50 | <code>6. Controller behavior: if confidence is low or no answer-bearing page exists, stop and ask or report the gap; do not loop blindly.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 51 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 52 | <code>## Patch Applied In This Pass</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 53 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 54 | <code>This pass implements the first repair slice:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 55 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 56 | <code>1. Added search-result target coverage so results missing specific target terms are not considered relevant.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 57 | <code>2. Penalized broad context-only pages before follow-up selection.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 58 | <code>3. Stopped `web_research` from fetching irrelevant ranked results just to fill `maxPages`.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 59 | <code>4. Added source-focused guide query variants for specific CJK guide tasks.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 60 | <code>5. Expanded the web research merge pool so relevant lower-ranked results are not truncated before reranking.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 61 | <code>6. Diversified fetch candidates by host so one JS-heavy domain cannot consume the whole budget.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 62 | <code>7. Added regression coverage for broad-page rejection and host-diverse fetch selection.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 63 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 64 | <code>## Validation Snapshot</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 65 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 66 | <code>Task: `绝区零 叶瞬光 小光 攻略`</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 67 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 68 | <code>Before: broad official/BWiki home pages were fetched or marked as off-target only after wasting the fetch budget.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 69 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 70 | <code>After: search keeps target-specific pages such as TapTap/Bilibili/Miyoushe/Gamersky/BWiki candidates; fetch diversification retrieves at least one readable guide page; `answerReadiness` becomes `ready` when enough page evidence is available.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 71 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 72 | <code>The remaining weakness is rendered extraction for JS-heavy sites such as Miyoushe/HoYoLAB. The next major upgrade should make `web_fetch` escalate from static fetch to rendered/Crawl4AI-style extraction when static fetch returns a shell.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
