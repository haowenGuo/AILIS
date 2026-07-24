# electron/skills/mcp_bridge/SKILL.md 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。
- 文件类型：`documentation`
- 原始行数：23
- SHA-256：`715018860e5ec915ec8e0957157acbf0efdcb1f2a8b77cb2972fac899feb9b1b`
- 可运行副本：[打开源文件](../../../../../source/electron/skills/mcp_bridge/SKILL.md)
- 依赖：未从静态文本识别到显式依赖
- 主要符号：未从静态文本识别到命名符号

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code>---</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 2 | <code>id: mcp_bridge</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 3 | <code>label: MCP Skill</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 4 | <code>description: Discover configured MCP servers, resources, prompts, and direct MCP tool specs through AILIS MCP sessions.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 5 | <code>when: 需要接入外部 MCP Server、发现外部工具、读取 MCP resources/prompts 时。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 6 | <code>tools:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 7 | <code>  - mcp_bridge</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 8 | <code>triggers:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 9 | <code>  - MCP</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 10 | <code>  - 外部工具</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 11 | <code>  - 读资源</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 12 | <code>---</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 13 | <code># MCP Skill</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 14 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 15 | <code>MCP 是 AILIS 连接外部工具的统一插座。普通任务里，MCP 工具会以 `mcp__server__tool` 这种 direct tool 形式暴露给 Agent。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 16 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 17 | <code>规则：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 18 | <code>- 普通任务优先使用 capability_context 或 tool_search 返回的 direct tool，例如 `mcp__ailis_research__web_fetch`、`mcp__ailis_research__pdf_find_and_extract`、`mcp__ailis_research__pdf_extract_text`。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 19 | <code>- `mcp_bridge` 只用于 MCP 管理、发现和修复：`list_servers`、`health_check`、`list_tool_specs`、`search_tools`、`list_resources/read_resource`、`list_prompts/get_prompt`、注册或关闭 server。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 20 | <code>- 不要在普通任务里手工拼 `mcp_bridge.call_tool(server, tool_name, parameters)`；如果已经有 direct tool spec，直接调用 direct tool。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 21 | <code>- MCP 失败时不要假装成功，向用户说明是配置、连接、鉴权、schema、超时，还是底层工具返回错误。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 22 | <code>- 研究/网页类 direct tool 要遵守语义边界：`web_fetch` 只读 HTML/纯文本；不知道 PDF 直链时先用 `pdf_find_and_extract`，已知 PDF URL/路径时用 `pdf_extract_text`，二进制文件再用 `download_file`。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 23 | <code>- PDF/论文题：如果知道标题，调用 `mcp__ailis_research__pdf_find_and_extract` 时把标题放进 `title`，把要找的字段放进 `extract_query`，例如 `{"title":"Exact Paper Title","extract_query":"volume m^3"}`；不要把答案字段当成唯一 `query`。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
