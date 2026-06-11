---
id: computer
label: 电脑操作 Skill
description: Local computer operations for filesystem, shell, process, PTY, watcher, rollback, binary, and ACL workflows.
when: 文件系统、命令行、进程、PTY、二进制、ACL、回滚、系统状态检查。
tools:
  - computer
triggers:
  - 运行命令
  - 检查文件
  - 处理电脑
---
# Computer Skill

用于本机文件系统、命令行、进程、PTY、文件监听、二进制读写、ACL 和回滚。

规则：
- 优先读取和检查，再修改；修改后主动复核。
- 写文件、删除、移动、shell/PTY、进程写入/结束等动作按 Gateway 策略审批。
- 命令和系统控制通过 Platform Adapter 执行；当前桌面端优先 Windows，但不要把 Windows-only 假设写进任务策略。需要平台细节时先看 computer.schema 的 platform/safety。
- 高风险动作必须说明原因，工具层会根据 contract 和 permission profile 决定是否继续。

桌面任务工具选择：
- 工具层负责稳定执行，不负责猜题。不要用固定题面、固定文件名、固定邮箱、固定 URL 做路由。
- 直接基于用户目标、已有 observation 和工具 schema 决定下一步；不要引入额外任务分类层或工具白名单。
- 当目标参数明确时，优先使用结构化工具；例如 `browser_open_url(url)`、`chrome_delete_site_data(domains)`、`spreadsheet_set_cell_value(file, cell, value)`、`docx_*`、`pptx_*`、`thunderbird_remove_account(email)`。
- 当参数不明确时，先观察界面、读取文件列表、搜索资源或询问用户；不要编造路径、邮箱、域名、行数据。
- 文件型工具的优点是稳定、快、可验证；缺点是必须有明确路径和结构化参数。
- GUI 操作的优点是能处理视觉发现和未知状态；缺点是慢、容易受窗口焦点和布局影响。
- MCP/Skill 扩展时优先补 tool schema、参数说明、风险等级、成功证据和失败恢复，不要补 benchmark 专用 if/else。
