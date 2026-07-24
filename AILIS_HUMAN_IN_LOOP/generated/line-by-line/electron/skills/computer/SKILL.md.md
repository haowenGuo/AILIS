# electron/skills/computer/SKILL.md 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。
- 文件类型：`documentation`
- 原始行数：49
- SHA-256：`3adddfacd01c1b061159ae42724f16c62cc48cd81fffcf7ffde752fb00a18616`
- 可运行副本：[打开源文件](../../../../../source/electron/skills/computer/SKILL.md)
- 依赖：未从静态文本识别到显式依赖
- 主要符号：未从静态文本识别到命名符号

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code>---</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 2 | <code>id: computer</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 3 | <code>label: 电脑操作 Skill</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 4 | <code>description: Local computer operations for filesystem, shell, process, PTY, watcher, rollback, binary, and ACL workflows.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 5 | <code>when: 文件系统、命令行、进程、PTY、二进制、ACL、回滚、系统状态检查。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 6 | <code>tools:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 7 | <code>  - computer</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 8 | <code>triggers:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 9 | <code>  - 运行命令</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 10 | <code>  - 检查文件</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 11 | <code>  - 处理电脑</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 12 | <code>---</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 13 | <code># Computer Skill</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 14 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 15 | <code>用于本机文件系统、命令行、进程、PTY、文件监听、二进制读写、ACL 和回滚。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 16 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 17 | <code>规则：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 18 | <code>- 优先读取和检查，再修改；修改后主动复核。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 19 | <code>- 写文件、删除、移动、shell/PTY、进程写入/结束等动作按 Gateway 策略审批。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 20 | <code>- 命令和系统控制通过 Platform Adapter 执行；当前系统由每轮 `runtime_environment.family/default_shell/path_style` 动态给出，不属于长期记忆。不要默认当前是 Linux、Windows 或 macOS。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 21 | <code>- 命令应由 Agent 自己按 `runtime_environment` 写成对应平台语义；工具层不做 shell 字符串解析改写。只有当前平台明确支持时，才使用 `head`、`tail`、`wc`、`/dev/null`、`rm -rf`、`grep`、PowerShell 管道、cmd 的 `NUL`/`cd /d`、Windows 盘符路径等平台专属片段。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 22 | <code>- 高风险动作必须说明原因，工具层会根据 contract 和 permission profile 决定是否继续。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 23 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 24 | <code>命令工具用法：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 25 | <code>- `exec` / `exec_command` 在当前 `runtime_environment` 的本机命令环境中运行命令，返回 `stdout`、`stderr`、`exitCode`、`durationMs`、`workdir` 等执行结果。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 26 | <code>- 适合运行已有脚本、测试、构建、诊断命令、工具链检查和短的一次性命令。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 27 | <code>- 简单命令可以直接放在 `command` / `cmd` 中；复杂路径或参数优先使用 `args`，减少 shell quoting 问题。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 28 | <code>- 复杂 Python、PowerShell、Bash、Node 逻辑优先写成临时脚本文件，再用 `exec` / `exec_command` 运行脚本入口。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 29 | <code>- 短 inline 代码可以使用 `python -c` / `node -e`；不要把大段多行程序塞进 shell 字符串，尤其是在 shell 方言或 quoting 规则不确定时。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 30 | <code>- 如果命令会生成文件，最好在 `stdout` 打印生成路径、文件大小或 `DONE` 标记，随后用 `read` / `stat` / `hash` 复核。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 31 | <code>- `exitCode=0` 只表示进程正常退出，不表示任务语义成功；任务证据主要来自 `stdout` / `stderr` 和后续文件验证。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 32 | <code>- 当返回里有 `outputId`、`bytes`、`lineCount` 或 `previewTruncated=true` 时，完整 stdout/stderr 已保存到 Exec Output Store。需要完整片段时先用 `tool_search` 查询 `output_read` / `output_tail` / `output_search`，再按需读取、搜索或查看尾部；不要把 `outputId` 当文件路径传给 `computer.read`，也不要为了恢复被截断输出而盲目重跑命令。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 33 | <code>- 如果预期有输出或文件产物，但 `stdout` / `stderr` 为空，应视为没有拿到证据，检查 quoting、`workdir`、输出路径，或改为运行脚本文件/专用工具。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 34 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 35 | <code>示例：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 36 | <code>- 运行已有 Python 脚本：`python scripts/extract_docx.py`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 37 | <code>- 短 inline Python：`python -c "print('hello')"`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 38 | <code>- 运行 Node 测试：`node --test tests/example.test.mjs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 39 | <code>- 查看 Git 状态：`git status --short`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 40 | <code>- 生成文件后复核：先运行脚本并打印输出路径，再用 `read` / `stat` 检查该路径。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 41 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 42 | <code>桌面任务工具选择：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 43 | <code>- 工具层负责稳定执行，不负责猜题。不要用固定题面、固定文件名、固定邮箱、固定 URL 做路由。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 44 | <code>- 直接基于用户目标、已有 observation 和工具 schema 决定下一步；不要引入额外任务分类层或工具白名单。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 45 | <code>- 当目标参数明确时，优先使用结构化工具；例如 `browser_open_url(url)`、`chrome_delete_site_data(domains)`、`spreadsheet_set_cell_value(file, cell, value)`、`docx_*`、`pptx_*`、`thunderbird_remove_account(email)`。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 46 | <code>- 当参数不明确时，先观察界面、读取文件列表、搜索资源或询问用户；不要编造路径、邮箱、域名、行数据。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 47 | <code>- 文件型工具的优点是稳定、快、可验证；缺点是必须有明确路径和结构化参数。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 48 | <code>- GUI 操作的优点是能处理视觉发现和未知状态；缺点是慢、容易受窗口焦点和布局影响。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 49 | <code>- MCP/Skill 扩展时优先补 tool schema、参数说明、风险等级、成功证据和失败恢复，不要补 benchmark 专用 if/else。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
