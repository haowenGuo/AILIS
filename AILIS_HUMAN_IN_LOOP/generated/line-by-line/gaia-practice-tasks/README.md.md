# gaia-practice-tasks/README.md 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。
- 文件类型：`documentation`
- 原始行数：58
- SHA-256：`fbcb1995fef88bd949e114ccdc8f232ae7e368e48834fed604ae7573af87d309`
- 可运行副本：[打开源文件](../../../source/gaia-practice-tasks/README.md)
- 依赖：未从静态文本识别到显式依赖
- 主要符号：未从静态文本识别到命名符号

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code># GAIA Practice Tasks</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 2 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3 | <code>这两个任务来自本地缓存的 `gaia-benchmark/GAIA` validation level 1 数据。测试时建议只把“给 AILIS 的任务文本”和对应附件交给 AILIS，不要提前给标准答案。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 4 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5 | <code>## Task 1: Secret Santa DOCX</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 6 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 7 | <code>- Task ID: `cffe0e32-c9a6-4c52-9877-78ceb4aaa9fb`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 8 | <code>- Attachment: `task1-secret-santa.docx`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 9 | <code>- Source file: `F:\AILIS\build-cache\hf-datasets\gaia-benchmark-GAIA\2023\validation\cffe0e32-c9a6-4c52-9877-78ceb4aaa9fb.docx`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 10 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 11 | <code>给 AILIS 的任务文本：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 12 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 13 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 14 | <code>An office held a Secret Santa gift exchange where each of its twelve employees was assigned one other employee in the group to present with a gift. Each employee filled out a profile including three likes or hobbies. On the day of the gift exchange, only eleven gifts were given, each one specific to one of the recipient's interests. Based on the information in the attached document, who did not give a gift?</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 15 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 16 | <code>Please read the attached DOCX completely, extract the people, interests, gifts, and constraints, then reason through the matching. Return only the name as the final answer, but briefly mention the evidence you used before the final answer.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 17 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 18 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 19 | <code>标准答案（不要提前给 AILIS 看）：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 20 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 21 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 22 | <code>Fred</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 23 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 24 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 25 | <code>主要考察点：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 26 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 27 | <code>- 是否真的读取完整 DOCX，而不是凭文件名或题目猜。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 28 | <code>- 是否能抽取约束并做匹配推理。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 29 | <code>- 是否能把中间证据和最终精确答案分开。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 30 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 31 | <code>## Task 2: Excel Map Path</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 32 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 33 | <code>- Task ID: `65afbc8a-89ca-4ad5-8d62-355bb401f61d`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 34 | <code>- Attachment: `task2-excel-map.xlsx`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 35 | <code>- Source file: `F:\AILIS\build-cache\hf-datasets\gaia-benchmark-GAIA\2023\validation\65afbc8a-89ca-4ad5-8d62-355bb401f61d.xlsx`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 36 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 37 | <code>给 AILIS 的任务文本：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 38 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 39 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 40 | <code>You are given the attached Excel file as a map. You start on the START cell and move toward the END cell. You are allowed to move two cells per turn, and you may move up, down, left, or right. You may not move fewer than two cells, and you may not move backward. You must avoid moving onto any blue cells.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 41 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 42 | <code>On the eleventh turn, what is the 6-digit hex code, without prefix, of the color of the cell where you land after moving?</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 43 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 44 | <code>Please inspect the full spreadsheet, including cell colors. Do not rely on a first-rows preview. Return only the 6-digit hex code as the final answer, and briefly explain how you reconstructed the path.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 45 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 46 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 47 | <code>标准答案（不要提前给 AILIS 看）：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 48 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 49 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 50 | <code>F478A7</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 51 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 52 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 53 | <code>主要考察点：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 54 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 55 | <code>- 是否能读取完整 Excel，而不是只看 preview。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 56 | <code>- 是否能拿到单元格填充颜色，而不只是文本值。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 57 | <code>- 是否能把网格路径走满 11 步，每步 2 格。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 58 | <code>- 是否能输出精确格式：只有 6 位 hex code，不带 `#`。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
