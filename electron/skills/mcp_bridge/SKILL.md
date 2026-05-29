---
id: mcp_bridge
label: MCP Skill
description: Discover and call configured MCP servers, tools, resources, and prompts through HumanClaw MCP sessions.
when: 需要接入外部 MCP Server、发现外部工具、读取 MCP resources/prompts 时。
tools:
  - mcp_bridge
triggers:
  - MCP
  - 外部工具
  - 读资源
---
# MCP Skill

MCP 是 AIGL 连接外部工具的统一插座。使用时先发现能力，再调用具体工具。

规则：
- 先 `list_servers` 或 `health_check`，确认 server 可用。
- 再 `list_tools/list_resources/list_prompts` 发现能力。
- 调用 `call_tool` 前要遵守 MCP tool 的 `inputSchema`；本地 manager 会做参数校验。
- `read_resource/get_prompt` 是只读上下文；`call_tool/register_server/remove_server/shutdown_server` 可能需要审批。
- MCP 失败时不要假装成功，向用户说明是配置、连接、鉴权、schema 还是超时问题。

