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
- 命令和系统控制通过 Platform Adapter 执行；当前系统由每轮 `runtime_environment.family/default_shell/path_style` 动态给出，不属于长期记忆。不要默认当前是 Linux、Windows 或 macOS。
- 命令应由 Agent 自己按 `runtime_environment` 写成对应平台语义；工具层不做 shell 字符串解析改写。只有当前平台明确支持时，才使用 `head`、`tail`、`wc`、`/dev/null`、`rm -rf`、`grep`、PowerShell 管道、cmd 的 `NUL`/`cd /d`、Windows 盘符路径等平台专属片段。
- 高风险动作必须说明原因，工具层会根据 contract 和 permission profile 决定是否继续。

命令工具用法：
- `exec` / `exec_command` 在当前 `runtime_environment` 的本机命令环境中运行命令，返回 `stdout`、`stderr`、`exitCode`、`durationMs`、`workdir` 等执行结果。
- 适合运行已有脚本、测试、构建、诊断命令、工具链检查和短的一次性命令。
- 简单命令可以直接放在 `command` / `cmd` 中；复杂路径或参数优先使用 `args`，减少 shell quoting 问题。
- 复杂 Python、PowerShell、Bash、Node 逻辑优先写成临时脚本文件，再用 `exec` / `exec_command` 运行脚本入口。
- 短 inline 代码可以使用 `python -c` / `node -e`；不要把大段多行程序塞进 shell 字符串，尤其是在 shell 方言或 quoting 规则不确定时。
- 如果命令会生成文件，最好在 `stdout` 打印生成路径、文件大小或 `DONE` 标记，随后用 `read` / `stat` / `hash` 复核。
- `exitCode=0` 只表示进程正常退出，不表示任务语义成功；任务证据主要来自 `stdout` / `stderr` 和后续文件验证。
- 当返回里有 `outputId`、`bytes`、`lineCount` 或 `previewTruncated=true` 时，完整 stdout/stderr 已保存到 Exec Output Store。需要完整片段时先用 `tool_search` 查询 `output_read` / `output_tail` / `output_search`，再按需读取、搜索或查看尾部；不要把 `outputId` 当文件路径传给 `computer.read`，也不要为了恢复被截断输出而盲目重跑命令。
- 如果预期有输出或文件产物，但 `stdout` / `stderr` 为空，应视为没有拿到证据，检查 quoting、`workdir`、输出路径，或改为运行脚本文件/专用工具。

示例：
- 运行已有 Python 脚本：`python scripts/extract_docx.py`
- 短 inline Python：`python -c "print('hello')"`
- 运行 Node 测试：`node --test tests/example.test.mjs`
- 查看 Git 状态：`git status --short`
- 生成文件后复核：先运行脚本并打印输出路径，再用 `read` / `stat` 检查该路径。

桌面任务工具选择：
- 工具层负责稳定执行，不负责猜题。不要用固定题面、固定文件名、固定邮箱、固定 URL 做路由。
- 直接基于用户目标、已有 observation 和工具 schema 决定下一步；不要引入额外任务分类层或工具白名单。
- 当目标参数明确时，优先使用结构化工具；例如 `browser_open_url(url)`、`chrome_delete_site_data(domains)`、`spreadsheet_set_cell_value(file, cell, value)`、`docx_*`、`pptx_*`、`thunderbird_remove_account(email)`。
- 当参数不明确时，先观察界面、读取文件列表、搜索资源或询问用户；不要编造路径、邮箱、域名、行数据。
- 文件型工具的优点是稳定、快、可验证；缺点是必须有明确路径和结构化参数。
- GUI 操作的优点是能处理视觉发现和未知状态；缺点是慢、容易受窗口焦点和布局影响。
- MCP/Skill 扩展时优先补 tool schema、参数说明、风险等级、成功证据和失败恢复，不要补 benchmark 专用 if/else。
