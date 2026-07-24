# AGENTS.md 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。
- 文件类型：`documentation`
- 原始行数：9
- SHA-256：`268f0597a21aea9637f6d0bc6bf2c819a113b92a7a4ce9b3d1b29ec89c694594`
- 可运行副本：[打开源文件](../../source/AGENTS.md)
- 依赖：未从静态文本识别到显式依赖
- 主要符号：未从静态文本识别到命名符号

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code># AILIS Agent Engineering Rules</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 2 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3 | <code>These rules are hard constraints for Agent and Harness development in this repository.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 4 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5 | <code>1. The model is the semantic decision-maker. Do not use text matching, regular expressions, task-type branches, or fallback rewrites to replace or steer a valid model decision. Runtime code may validate a strict schema and return an error, but it must not invent or rewrite the model's task.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 6 | <code>2. Context management is the primary engineering problem. Keep Persona memory, visible conversation, active-task state, TaskAgent working context, evidence, and tool outputs in explicit data lanes. Compact by budget while preserving goals, constraints, unresolved state, evidence refs, and output refs.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 7 | <code>3. The Harness is an operating system for the model, not a cage around it. Focus deterministic code on context assembly, lifecycle state, permissions, budgets, MCP reliability, tool contracts, durable references, and observability. Let the model decide what a request means, whether evidence is sufficient, and what action to take next.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 8 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 9 | <code>Allowed deterministic guards include schema validation, permission enforcement, timeout/cost safety limits, lifecycle status recording, and lossless reference preservation. They must report observations back to the model instead of substituting their own semantic plan.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
