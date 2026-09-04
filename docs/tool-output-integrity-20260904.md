# 工具输出完整性修复（2026-09-04）

## 修改范围

通用工具返回链不再把每个字符串字段裁到 1200 字符，不再对正文统一 `.trim()`，也不再默认把正文截成 6000 字符、数组截成 24 项、嵌套对象按固定深度丢弃。工具生产的正文、结构化字段、空白和媒体块保留原样；敏感字段脱敏仍然执行。

涉及 `ailis-tool-result.cjs` 的标准化入口、`ailis-runtime-budget.cjs` 的工具返回处理和 `ailis-runtime.cjs` 的 Gateway 返回防护。没有修改模型、instructions、上下文压缩策略、权限判断或 EMBER 配置。

历史调用显式传入 `maxTextChars` 时仍执行该显式文本预算；截断标记独立记录，不把“文件已经完整读出”误写成“模型已看到完整内容”。未指定预算不会偷偷应用默认裁剪。字段级脱敏属于安全规则，不属于正文裁剪。

## 原有工具规则保持不变

| 工具/操作 | 已有输出限制，继续沿用 |
| --- | --- |
| `exec_command`、`write_stdin` | `max_output_tokens`；执行层现有近似 token 算法、进程输出缓冲规则不变 |
| 顶层 `exec` | `max_output_tokens` 打印预算不变 |
| 文件 `read` | 默认 128 KiB，最大 5 MiB，以及原有范围/分页行为 |
| `output_read`、`output_tail` | 默认 6000 字节，单次最多 512 KiB |
| `computer.list/tree/search` | 目录条数、深度、结果数限制 |
| `file_manager` | 扫描总数、候选数、最大深度限制 |
| `email` | 列表条数；既有正文摘要限制 |
| `web` / 文档读取 | 既有结果数、视窗、页码、摘要限制 |

这些规则不一定已经最优，本次没有重新调参。也没有承诺所有工具生产者内部的 `.trim()` 都被删除；这里只取消**通用返回链**的数据改写。

## 补上的输出上限

审计发现：仅限制条数或提供紧凑文本视图，不一定能限制实际结构化返回大小。`ailis-tool-output-limits.cjs` 显式列出以下生产者，并在工具 dispatch 后应用，正常大小结果不变：

| 生产者 | 内联 JSON 上限 | 原有缺口 |
| --- | --- | --- |
| MCP（桥接及直连）、外部适配器 | 256 KiB | 第三方返回不保证分页或总量限制 |
| `output_search` | 256 KiB | 条数有限，但一条日志可以很长 |
| `tool_search` | 512 KiB | 返回条数有限，但完整工具 Schema 可能很大 |
| `artifact_tools` | 512 KiB | 文字视图有压缩，但完整结构化 inspection/result 不保证同样上限 |
| `task_results` | 256 KiB | 限制记录数不等于限制历史结果正文大小 |
| `github_pages` | 256 KiB | 本地配置预览按行限制，单行长度不受限 |
| `tool_doctor`、`capability_manager`、`self_debugger`、`self_evolution`、`list_agents`、`wait_agent` | 128 KiB | 诊断集合、注册表、子任务结果可累计增长 |

超过上限：先将完整、已脱敏结果保存到现有 `outputStore`，再返回明确标记的最多 8000 字符预览，以及 `outputId`、`output_read` / `output_search` 入口。模型可通过现有工具发现机制找到这些读取工具。返回的是明确的存档引用契约，不伪装成完整的原 JSON。

媒体/资源块不切开 base64：在上述受限生产者中，原块可额外保留，总量最多 8 MiB；超过的整块只保留在完整存档里，并报告省略数量。因此媒体返回不适用表中的纯内联 JSON 字节上限，具有独立的媒体额度。

存档后核验文件字节数。如果存档失败，明确报告 `outputDelivery=archive_failed` 和 `fullOutputAvailable=false`，不声称完整结果已保存，也不把已经成功执行的操作改为执行失败或自动重试。预览不完整时 observation contract 的 `complete=false`。

## 离线证据与验证

历史证据取自 `longrun/jobs/ailis-terminal89-stable-base-parallel10-07c1e85-luna-max-20260903-v1/exec-command-contract-audit-20260904`，可移植 fixture 位于 `tests/fixtures/tool-output-history-20260903.json`。

- `build-cython-ext`：真实 `setup.py` 输出 4600 字符，旧模型可见返回 1200 字符。新回放经过标准化、Gateway guard、实际 code-mode 子进程后，保留完整 4600 字符，SHA-256 不变。
- 同题另一段真实输出：477 字符，旧返回被 trim 成 462 字符。新回放保留缩进和结尾换行，完整 477 字符。
- 新增回归覆盖：结构化长字段/数组/Schema、空白与空串、图片块、显式预算、错误契约、敏感字段脱敏、MCP 和外部适配器路由、超大结果存档完整性、存档失败、长行搜索、读取分页。

验证结果：198 项通过，0 失败（既有 runtime/tool-layer/code-mode/computer/research/EMBER 165 项；context-budget/observation/file-manager/email/tool-contracts 23 项；新增输出完整性 10 项）。`git diff --check` 通过。针对性测试全部离线，Gateway/工具调用由本地 fixture 或测试替身驱动。

这是输出链正确性验证，不是新一轮能力评测。没有修改历史成绩、快照或评测配置，没有付费调用模型，也没有据此推断通过率或执行速度已经提高。
