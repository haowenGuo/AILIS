# electron/ailis-web-run-description.md 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。
- 文件类型：`documentation`
- 原始行数：16
- SHA-256：`fcf874db3c1f8bb39c370d88dc44ab8adcc9e3d450125fe8ae3ddee1fa326b28`
- 可运行副本：[打开源文件](../../../source/electron/ailis-web-run-description.md)
- 依赖：未从静态文本识别到显式依赖
- 主要符号：未从静态文本识别到命名符号

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code>Public web discovery and page navigation. Execute exactly one supported operation per call.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 2 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3 | <code>Supported operations:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 4 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5 | <code>* `search_query`: discover candidate pages with one to four non-empty queries. Example: `{"search_query":[{"q":"OpenAI Codex app-server outputSchema"}],"response_length":"medium"}`</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 6 | <code>* `open`: open one search reference or HTTP(S) URL. Example: `{"open":[{"ref_id":"turn0search0"}]}`</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 7 | <code>* `click`: open one numbered link from a previously opened reference. Example: `{"click":[{"ref_id":"turn0view0","id":3}]}`</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 8 | <code>* `find`: find one non-empty pattern in a previously opened reference. Example: `{"find":[{"ref_id":"turn0view0","pattern":"Methods"}]}`</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 9 | <code>* `screenshot`: capture one browser-rendered PNG from a previously opened reference or HTTP(S) URL and return it to the main model as visual tool evidence. Use for layout, indentation, columns, line breaks, colors, positions, charts, canvas, and other properties that text extraction cannot preserve. Example: `{"screenshot":[{"ref_id":"turn0view0","detail":"original"}]}`</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 10 | <code>* `archive`: discover or open historical public-web snapshots for a known URL or stable URL prefix. Use this when a question asks about a past/as-of state and the live site, database, API, OAI endpoint, or search result page is unavailable. Prefer `mode:"search"` to discover a dynamic URL and open the first readable snapshot in one call; use `matchType:"prefix"` and concise `contains` terms such as identifiers, filter values, classifications, or years. Use `mode:"captures"` only to inspect candidates and `mode:"open"` for a known provider/URL/timestamp. `fromYear` and `toYear` constrain archive crawl dates, not publication/content y … [本行共 899 字符，完整内容见 source 副本]</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 11 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 12 | <code>Do not combine operations in one call. Do not send empty objects, arrays, queries, reference ids, or patterns. `response_length` applies only to `search_query`. For capabilities outside the six operations above, discover a dedicated tool.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 13 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 14 | <code>Search results return stable reference ids for later `open`, `click`, and `find` calls. Search is discovery; open a relevant candidate before treating it as evidence. When a search returns no candidates, broaden the query and remove optional recency/domain filters before trying another source or search formulation. A page's native ordering is not proof of global ordering across records. If page navigation identifies the entity but the answer still depends on structured identity, a join across records, global sorting or de-duplication, chronology, or a complete candidate-set boundary, use `tool_search` to discover a dedicated metadat … [本行共 896 字符，完整内容见 source 副本]</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 15 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 16 | <code>For benchmark/evaluation tasks, repositories or pages that merely repeat the task prompt are not answer evidence. Use the named authoritative source, its API/metadata connector, or an archived snapshot instead.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
