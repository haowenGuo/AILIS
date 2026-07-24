---
id: mcp_bridge
label: MCP Skill
description: Discover configured MCP servers, resources, prompts, and direct MCP tool specs through AILIS MCP sessions.
when: 需要接入外部 MCP Server、发现外部工具、读取 MCP resources/prompts 时。
tools:
  - mcp_bridge
triggers:
  - MCP
  - 外部工具
  - 读资源
---
# MCP Skill

MCP 是 AILIS 连接外部工具的统一插座。普通任务里，MCP 工具会以 `mcp__server__tool` 这种 direct tool 形式暴露给 Agent。

规则：
- 普通任务优先使用 capability_context 或 tool_search 返回的 direct tool，例如 `mcp__ailis_research__web_fetch`、`mcp__ailis_research__pdf_find_and_extract`、`mcp__ailis_research__pdf_extract_text`。
- `mcp_bridge` 只用于 MCP 管理、发现和修复：`list_servers`、`health_check`、`list_tool_specs`、`search_tools`、`list_resources/read_resource`、`list_prompts/get_prompt`、注册或关闭 server。
- 不要在普通任务里手工拼 `mcp_bridge.call_tool(server, tool_name, parameters)`；如果已经有 direct tool spec，直接调用 direct tool。
- MCP 失败时不要假装成功，向用户说明是配置、连接、鉴权、schema、超时，还是底层工具返回错误。
- 研究/网页类 direct tool 要遵守语义边界：`web_fetch` 只读 HTML/纯文本；不知道 PDF 直链时先用 `pdf_find_and_extract`，已知 PDF URL/路径时用 `pdf_extract_text`，二进制文件再用 `download_file`。
- PDF/论文题：如果知道标题，调用 `mcp__ailis_research__pdf_find_and_extract` 时把标题放进 `title`，把要找的字段放进 `extract_query`，例如 `{"title":"Exact Paper Title","extract_query":"volume m^3"}`；不要把答案字段当成唯一 `query`。
