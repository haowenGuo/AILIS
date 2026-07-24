# docs/ailis-standard-tool-packs.md 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。
- 文件类型：`documentation`
- 原始行数：115
- SHA-256：`50ffc0be68bc62a0c7e977aba57c0c71c46d6690c90a71de173059f1178ecae6`
- 可运行副本：[打开源文件](../../../source/docs/ailis-standard-tool-packs.md)
- 依赖：未从静态文本识别到显式依赖
- 主要符号：未从静态文本识别到命名符号

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code># AILIS Standard Tool Packs</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 2 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3 | <code>Date: 2026-06-14</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 4 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5 | <code>## Goal</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 6 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 7 | <code>Stop optimizing one benchmark/task at a time. AILIS should import mature tool backends as standard packs, compile them into canonical contracts, expose only verified callable tools, and keep auth-required/local tools visible as contract-only until smoke validation passes.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 8 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 9 | <code>## Packs</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 10 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 11 | <code>&#124; Pack &#124; Purpose &#124; Default callable &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 12 | <code>&#124; --- &#124; --- &#124; --- &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 13 | <code>&#124; `email_productivity_pack` &#124; Gmail API, Microsoft Graph mail, Composio Gmail fallback &#124; No. Requires OAuth/auth profiles. &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 14 | <code>&#124; `document_reader_pack` &#124; Docling, MarkItDown, and lightweight Python document extraction contracts &#124; `python_document_extract` can become callable after local dependency smoke. &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 15 | <code>&#124; `web_retrieval_pack` &#124; Firecrawl, Tavily, Jina Reader adapter contract &#124; No by default. Requires API keys or adapter. &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 16 | <code>&#124; `academic_metadata_pack` &#124; OpenAlex, Crossref, Semantic Scholar metadata &#124; OpenAlex/Crossref/Semantic Scholar public read-only contracts are callable. &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 17 | <code>&#124; `media_transcription_pack` &#124; YouTube search/metadata, transcript, ASR, cookies, frame fallback contract &#124; `youtube_video_search` is MCP-local when yt-dlp is installed; transcript may still need cookies/ASR. &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 18 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 19 | <code>## Commands</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 20 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 21 | <code>Dry-run compile/lint/exposure:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 22 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 23 | <code>```bash</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 24 | <code>node scripts/setup-ailis-standard-tool-packs.mjs --dry-run</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 25 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 26 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 27 | <code>Write exposure state:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 28 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 29 | <code>```bash</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 30 | <code>pnpm ailis:setup-standard-tool-packs</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 31 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 32 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 33 | <code>Expose only public read-only tools:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 34 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 35 | <code>```bash</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 36 | <code>node scripts/setup-ailis-standard-tool-packs.mjs --write --public-only</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 37 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 38 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 39 | <code>Expose selected packs:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 40 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 41 | <code>```bash</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 42 | <code>node scripts/setup-ailis-standard-tool-packs.mjs --write --pack academic_metadata_pack,document_reader_pack</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 43 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 44 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 45 | <code>Expose auth/local adapters and run smoke verification:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 46 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 47 | <code>```bash</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 48 | <code>pnpm ailis:setup-standard-tool-packs:verify</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 49 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 50 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 51 | <code>Run tests:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 52 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 53 | <code>```bash</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 54 | <code>pnpm test:ailis-standard-tool-packs</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 55 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 56 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 57 | <code>## Runtime Behavior</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 58 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 59 | <code>- `search_tool_candidates` now includes standard tool pack candidates.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 60 | <code>- `tool_search` can surface standard public OpenAPI tools such as OpenAlex and Crossref as `external__provider__tool`.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 61 | <code>- `expose_standard_tool_packs` imports packs through the existing contract compiler/linter and writes verified exposure state.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 62 | <code>- Auth-required tools remain non-callable unless `enableAuthRequiredAdapters` is explicitly used and auth profiles are configured.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 63 | <code>- Local adapter tools remain non-callable until `enableLocalAdapters` and `verifyAdapters` pass dependency smoke.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 64 | <code>- No API keys or tokens are stored in pack definitions. Auth profiles reference env vars only.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 65 | <code>- `read_document` now emits `DOCUMENT_READ_COMPLETE`, completeness counts, `fullTextPath`, and structured `document.paragraphs/tables` so the agent can stop reading raw DOCX/ZIP after a successful parse.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 66 | <code>- `youtube_video_search` resolves title/channel clues to YouTube URLs through local yt-dlp. `youtube_transcript` classifies anti-bot/cookie failures as `anti_bot_blocked` instead of a generic failure.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 67 | <code>- `paper_metadata_lookup` author-history calls now carry both `authorId` and author name, and its answer candidate includes title variants for metadata sources that lower-case or hyphenate titles.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 68 | <code>- External HTTP executor failures include normalized recovery affordance:</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 69 | <code>  - HTTP 429 -&gt; `failureReason: "rate_limited"` with retry/backoff and alternate-source guidance.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 70 | <code>  - HTTP 403 -&gt; `failureReason: "forbidden_or_blocked"` with guidance to switch to official APIs, metadata mirrors, or authenticated access instead of query rewrites.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 71 | <code>  - HTTP 401 -&gt; `failureReason: "authentication_required"` and auth-profile setup guidance.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 72 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 73 | <code>## Current Smoke Findings</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 74 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 75 | <code>- `pnpm ailis:setup-standard-tool-packs:verify` promoted public OpenAlex/Crossref/Semantic Scholar contracts and local `python_document_extract`; Gmail/Graph/Composio/Firecrawl/Tavily remained `needs_config`; Docling/MarkItDown remained `missing_dependency`.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 76 | <code>- Real yt-dlp search smoke resolved `BBC Earth Top 5 Silliest Animal Moments` to `https://www.youtube.com/watch?v=2Njmx-UuU3M`.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 77 | <code>- Real transcript smoke for that URL returned `anti_bot_blocked`, because YouTube required browser cookies; this is an access/cookie/backend issue, not a query wording problem.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 78 | <code>- GAIA targeted retest after the YouTube affordance change passed `0383a3ee-47a7-41a4-b493-519bdefe0488` with `Rockhopper penguin`.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 79 | <code>- GAIA targeted retest after paper author disambiguation/title candidates passed `46719c30-f4c3-4cad-be07-d5cb21eee6bb`.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 80 | <code>- GAIA Secret Santa DOCX retest changed from `missing_evidence` to a submitted answer, but the answer was still wrong (`Tyson` vs gold `Fred`); remaining issue is document reasoning/QA, not raw DOCX extraction.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 81 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 82 | <code>## Auth Profiles</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 83 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 84 | <code>Examples:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 85 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 86 | <code>```json</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 87 | <code>{</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 88 | <code>  "action": "configure_external_auth_profile",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 89 | <code>  "authProfileId": "gmail-oauth",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 90 | <code>  "provider": "openapi",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 91 | <code>  "authType": "bearer_env",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 92 | <code>  "envVar": "GMAIL_ACCESS_TOKEN"</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 93 | <code>}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 94 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 95 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 96 | <code>```json</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 97 | <code>{</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 98 | <code>  "action": "configure_external_auth_profile",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 99 | <code>  "authProfileId": "composio-main",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 100 | <code>  "provider": "composio",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 101 | <code>  "authType": "composio_api_key_env",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 102 | <code>  "envVar": "COMPOSIO_API_KEY",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 103 | <code>  "baseUrl": "https://backend.composio.dev/api/v3"</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 104 | <code>}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 105 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 106 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 107 | <code>## Maintenance Rule</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 108 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 109 | <code>When a task fails, do not immediately add task-specific routing. First classify the failure against the pack layer:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 110 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 111 | <code>1. Missing backend: add a mature backend contract to a pack.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 112 | <code>2. Bad schema: improve the contract/lint examples and bad examples.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 113 | <code>3. Tool not callable: add auth/adapter/smoke, then expose.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 114 | <code>4. Agent did not pick it: improve pack keywords/search text and tool affordance.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 115 | <code>5. Tool returned insufficient evidence: improve structured output or recovery hints.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
