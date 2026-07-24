# docs/codex-style-network-retrieval-playbook.md 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。
- 文件类型：`documentation`
- 原始行数：207
- SHA-256：`2a8f3deaab8a076778d752939db5581817987d5e4310d8a696f967a0b2d1d9cf`
- 可运行副本：[打开源文件](../../../source/docs/codex-style-network-retrieval-playbook.md)
- 依赖：未从静态文本识别到显式依赖
- 主要符号：未从静态文本识别到命名符号

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code># Codex-Style Network Retrieval Playbook</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 2 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3 | <code>This document describes a public, reproducible retrieval architecture that matches the direction of OpenAI Codex guidance without claiming access to private implementation details. It combines:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 4 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5 | <code>- Public OpenAI/Codex docs about tools, internet access, MCP, and `AGENTS.md`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 6 | <code>- Official API guidance from scholarly data providers</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 7 | <code>- The concrete implementation points in this repository</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 8 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 9 | <code>The goal is simple: for network-heavy tasks, especially GAIA-style research questions, the agent should prefer narrow, structured tools over broad `web_search`, preserve evidence in machine-readable form, and treat `403` or `429` as routing signals rather than “search harder” prompts.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 10 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 11 | <code>## Public Codex Signals</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 12 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 13 | <code>OpenAI’s public docs consistently point in the same direction:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 14 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 15 | <code>- Codex cloud tasks default to restricted internet access and can be configured with an allowlist. That means internet retrieval should be explicit and narrow, not an uncontrolled first move.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 16 | <code>  Source: [Internet access](https://developers.openai.com/codex/cloud/internet-access)</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 17 | <code>- Codex uses `AGENTS.md` to provide durable repository instructions and task guidance.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 18 | <code>  Source: [AGENTS.md](https://developers.openai.com/codex/local-config)</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 19 | <code>- Codex can dynamically load only the relevant tools for a task instead of exposing the whole tool surface at once.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 20 | <code>  Source: [Tools](https://developers.openai.com/codex/cloud/tools)</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 21 | <code>- OpenAI’s general tool guidance emphasizes direct tool use, remote MCP servers, and structured tool definitions rather than free-form browsing.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 22 | <code>  Source: [Responses API tools guide](https://developers.openai.com/api/docs/guides/tools)</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 23 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 24 | <code>The reproducible takeaway is not “copy Codex internals.” It is:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 25 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 26 | <code>1. Keep the internet surface narrow.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 27 | <code>2. Route by artifact or domain first.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 28 | <code>3. Expose specific tools before generic search.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 29 | <code>4. Preserve structured evidence all the way to finalization.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 30 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 31 | <code>## The Architecture To Reproduce</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 32 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 33 | <code>### 1. Intent-first routing</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 34 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 35 | <code>Before the model sees a large tool list, classify the task into one of a few retrieval modes:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 36 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 37 | <code>- Exact scholarly title or DOI</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 38 | <code>- Known webpage URL</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 39 | <code>- Known PDF URL or local PDF</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 40 | <code>- Word, spreadsheet, presentation, audio, image, or GitHub artifact</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 41 | <code>- Broad public discovery</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 42 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 43 | <code>Important boundary: do not turn the global `tool_search` implementation into a paper-specific parser. `tool_search` should stay a general deferred-tool discovery mechanism. Domain interpretation belongs inside the domain tool or its model-visible affordance:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 44 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 45 | <code>- `paper_metadata_lookup` may normalize raw scholarly clues into `author`, `year`, `topic`, and `venue`.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 46 | <code>- `web_search`, `web_fetch`, and `web_extract_links` may return `suggestedNextCalls` and `evidenceGap`.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 47 | <code>- The runner may rank artifact-specific tools above `web_search` through routing metadata.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 48 | <code>- The global tool index should not learn benchmark-specific paper fields that could degrade non-paper tasks.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 49 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 50 | <code>Repository mapping:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 51 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 52 | <code>- [ailis-tool-routing.cjs](../electron/ailis-tool-routing.cjs)</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 53 | <code>- [ailis-mcp-session.cjs](../electron/ailis-mcp-session.cjs)</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 54 | <code>- [ailis-gateway.cjs](../electron/ailis-gateway.cjs)</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 55 | <code>- [ailis-tool-runtime.cjs](../electron/ailis-tool-runtime.cjs)</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 56 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 57 | <code>### 2. Structured retrieval before HTML scraping</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 58 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 59 | <code>For paper and report questions, the first retrieval action should be metadata lookup from scholarly APIs, not `web_search` and not direct publisher scraping.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 60 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 61 | <code>Default order:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 62 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 63 | <code>1. `paper_metadata_lookup`</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 64 | <code>2. `pdf_find_and_extract`</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 65 | <code>3. `pdf_extract_text`</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 66 | <code>4. `web_fetch`</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 67 | <code>5. `web_search`</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 68 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 69 | <code>Why this order:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 70 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 71 | <code>- Metadata lookup gives authors, year, DOI, venue, and likely landing/PDF URLs without hitting fragile publisher HTML.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 72 | <code>- Fuzzy bibliographic clues such as author/year/topic/venue should be accepted by `paper_metadata_lookup` directly. If the model only passes a raw scholarly query, the tool can infer those fields internally instead of requiring `tool_search` to produce paper-shaped JSON.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 73 | <code>- A second `paper_metadata_lookup` hop with `authorId` can list an author’s earlier works chronologically without falling back to generic search.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 74 | <code>- If the upstream API is already sorted chronologically, for example OpenAlex author works with `sort=publication_date:asc`, preserve that order for “first paper” questions instead of re-ranking by relevance score afterward.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 75 | <code>- Full-text extraction is only needed after metadata disambiguation.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 76 | <code>- `web_search` is low precision for exact-title academic tasks and is easily polluted by common words.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 77 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 78 | <code>Repository mapping:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 79 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 80 | <code>- [mcp-ailis-research-server.cjs](../scripts/mcp-ailis-research-server.cjs)</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 81 | <code>- [run-gaia-level1-lite.mjs](../scripts/run-gaia-level1-lite.mjs)</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 82 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 83 | <code>### 3. Site policy awareness</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 84 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 85 | <code>Different domains need different treatment:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 86 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 87 | <code>- `OpenAlex`: preferred structured scholarly index. Use an API key when available and avoid raw HTML scraping.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 88 | <code>  Source: [OpenAlex API](https://docs.openalex.org/api-entities/works/search-works)</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 89 | <code>- `Crossref`: preferred DOI metadata source. Use polite-pool style contact information when available.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 90 | <code>  Source: [Crossref REST API](https://www.crossref.org/documentation/retrieve-metadata/rest-api/)</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 91 | <code>- `Semantic Scholar`: use the API with a key and explicit rate limiting; do not treat it like a generic fetch target.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 92 | <code>  Sources: [Semantic Scholar API](https://www.semanticscholar.org/product/api), [Tutorial](https://www.semanticscholar.org/product/api/tutorial), [License](https://www.semanticscholar.org/product/api/license)</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 93 | <code>- `Google Scholar`: not a stable automated backend. Expect unusual-traffic challenges and avoid it as a default machine path.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 94 | <code>  Source: [Google unusual traffic help](https://support.google.com/websearch/answer/86640?hl=en)</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 95 | <code>- Publisher pages such as ACM: metadata first, publisher HTML second. `403` usually means access control or anti-automation, not that the network is broken.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 96 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 97 | <code>### 4. Error taxonomy, not generic failure</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 98 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 99 | <code>Every retrieval tool should return machine-readable failure states. These are routing instructions:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 100 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 101 | <code>- `requires_auth` or `access_denied_403`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 102 | <code>- `rate_limited_429`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 103 | <code>- `bot_challenge`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 104 | <code>- `unsupported_content_type`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 105 | <code>- `no_results`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 106 | <code>- `partial_evidence`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 107 | <code>- `timeout_budget_exhausted`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 108 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 109 | <code>Behavior rules:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 110 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 111 | <code>- Do not retry the same publisher page repeatedly after `403`.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 112 | <code>- Do not loop on the same API after `429`; back off or switch source.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 113 | <code>- Do not read raw `.docx` or `.pptx` bytes when a dedicated parser already succeeded.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 114 | <code>- Do not promote a preview string above the structured payload that produced it.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 115 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 116 | <code>### 5. Structured evidence must survive to the finalizer</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 117 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 118 | <code>This is the part many agents get wrong. A narrow tool can succeed, yet the task still fails because the finalizer only sees a truncated preview.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 119 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 120 | <code>Required rule:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 121 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 122 | <code>- If a tool returns structured content, the evidence digest must prefer that structured content over `content[0].text`.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 123 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 124 | <code>That matters for:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 125 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 126 | <code>- `read_document`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 127 | <code>- `read_spreadsheet`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 128 | <code>- `read_presentation`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 129 | <code>- API-backed tools such as ClinicalTrials and scholarly metadata</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 130 | <code>- `pdf_find_and_extract`, especially when the answer is a short word near a small evidence phrase. The tool should surface `answerCandidates`, `evidenceSnippets`, and PDF URL in structured form before long extracted text.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 131 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 132 | <code>Repository mapping:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 133 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 134 | <code>- [run-gaia-level1-lite.mjs](../scripts/run-gaia-level1-lite.mjs)</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 135 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 136 | <code>### 6. Validate on traces, not just unit tests</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 137 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 138 | <code>Passing tests only prove code shape. For retrieval systems, we need three levels:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 139 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 140 | <code>1. Unit tests for parser/tool behavior</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 141 | <code>2. Transcript inspection to verify the actual tool order</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 142 | <code>3. GAIA re-runs to verify end-to-end improvement</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 143 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 144 | <code>The acceptance question is:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 145 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 146 | <code>Did the agent choose the right tool first, keep structured evidence intact, and avoid repeated low-value fallbacks?</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 147 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 148 | <code>## Concrete Routing Policy</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 149 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 150 | <code>Use this table directly.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 151 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 152 | <code>&#124; Task shape &#124; First tool &#124; Second tool &#124; Fallback &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 153 | <code>&#124; --- &#124; --- &#124; --- &#124; --- &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 154 | <code>&#124; Exact paper title or DOI &#124; `paper_metadata_lookup` &#124; `pdf_find_and_extract` &#124; `web_search` &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 155 | <code>&#124; Known PDF URL &#124; `pdf_extract_text` &#124; `download_file` &#124; none &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 156 | <code>&#124; Known HTML URL &#124; `web_fetch` &#124; `web_extract_links` &#124; `web_search` &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 157 | <code>&#124; Word document &#124; `read_document` &#124; `run_python_file` only if parser failed &#124; never raw binary read &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 158 | <code>&#124; Spreadsheet &#124; `read_spreadsheet` &#124; `run_python_file` only if computation is missing &#124; never preview-only final answer &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 159 | <code>&#124; Presentation &#124; `read_presentation` &#124; image or OCR fallback if needed &#124; no broad search &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 160 | <code>&#124; YouTube/video &#124; transcript tool &#124; frame extraction / vision fallback &#124; `web_search` last &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 161 | <code>&#124; GitHub repo &#124; `github_repo_read` &#124; `web_search` only to discover repo &#124; none &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 162 | <code>&#124; Broad fresh public fact &#124; `web_search` &#124; `web_fetch` &#124; alternate backend &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 163 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 164 | <code>## Implementation Checklist For This Repo</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 165 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 166 | <code>### Already implemented</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 167 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 168 | <code>- Intent-aware tool ranking that demotes `web_search` for artifact-specific tasks</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 169 | <code>- `paper_metadata_lookup` as a first-hop scholarly metadata tool</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 170 | <code>- `paper_metadata_lookup` now supports fuzzy bibliographic discovery from `author`, `year`, `topic`, and `venue` clues, not only exact title / DOI lookups</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 171 | <code>- `paper_metadata_lookup` can infer those bibliographic fields internally from a raw scholarly query, so `tool_search` remains generic</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 172 | <code>- Author chronology mode now preserves OpenAlex publication order instead of re-ranking same-year works by score</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 173 | <code>- `read_document` now returns full structured content, not only raw JSON text</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 174 | <code>- GAIA evidence digestion now prefers structured DOCX evidence</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 175 | <code>- `pdf_find_and_extract` now uses rare evidence-term weighting, OJS article/download discovery, and quoted-word answer candidates so title quotes do not outrank body evidence</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 176 | <code>- `pdf_find_and_extract` now uses DOI-aware scholarly candidates before generic document search, including OpenAlex DOI locations and arXiv DOI Atom entries</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 177 | <code>- `pdf_find_and_extract` now separates internal extraction length from returned text-window length, so late acknowledgements/funding sections can be found without dumping huge PDFs into the model</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 178 | <code>- `pdf_find_and_extract` now extracts award/grant/identifier candidates near evidence terms such as author initials, NASA, award, grant, or contract</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 179 | <code>- GAIA evidence digestion now preserves structured PDF `answerCandidates` / `evidenceSnippets`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 180 | <code>- GAIA prompt/finalizer now preserve exact article dates for web/news discovery; month-only broadening is treated as a risk when the question gives an exact day</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 181 | <code>- `web_search`, `web_fetch`, and `web_extract_links` now return `suggestedNextCalls`, `evidenceGap`, and `recoveryHint` so the agent sees the next concrete move without benchmark-specific routing</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 182 | <code>- `web_search` now re-ranks candidates by query overlap and treats obviously off-target result sets as a diagnosis signal; for scholarly-looking queries it suggests `paper_metadata_lookup` instead of encouraging more blind clicks</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 183 | <code>- Search backend fallback continues past parsed but off-target result sets and includes Yahoo HTML parsing, which recovered Fafnir/OJS pages missed by earlier backends</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 184 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 185 | <code>### Next recommended steps</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 186 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 187 | <code>1. Add a keyed `Semantic Scholar` adapter with 1 RPS throttling and `Retry-After` handling.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 188 | <code>2. Add video frame extraction after `youtube_transcript` failure.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 189 | <code>3. Add guards that block raw `.docx`, `.pptx`, and `.xlsx` binary reads when a dedicated parser exists.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 190 | <code>4. Add title surface-form normalization for exact-answer scoring on scholarly metadata titles, without changing the returned source title.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 191 | <code>5. Add trace assertions in GAIA regression runs:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 192 | <code>   - exact-title paper questions should start with `paper_metadata_lookup`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 193 | <code>   - DOCX questions should not fall back to raw binary reads after successful `read_document`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 194 | <code>   - repeated `web_search` after `403` or `429` should be treated as a regression</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 195 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 196 | <code>## Minimal Reproduction Recipe</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 197 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 198 | <code>If we wanted to rebuild the same pattern from scratch:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 199 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 200 | <code>1. Put routing rules and failure policy in `AGENTS.md`.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 201 | <code>2. Expose only narrow MCP tools with clear schemas.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 202 | <code>3. Add a ranking layer that lifts domain-specific tools above generic search without changing global `tool_search` semantics.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 203 | <code>4. Make each tool return both readable text and structured payloads.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 204 | <code>5. Teach the finalizer to prefer structured payloads.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 205 | <code>6. Evaluate with transcript inspection plus GAIA, not tests alone.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 206 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 207 | <code>That is the closest public, reproducible version of the Codex approach that we can safely implement here.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
