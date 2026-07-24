# docs/ailis-artifact-tools-architecture.md 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。
- 文件类型：`documentation`
- 原始行数：355
- SHA-256：`bd4f3ae49ac39e4eb4dcc286b68bf3a0f514193e0f5e23ccc09b3002ec629d2c`
- 可运行副本：[打开源文件](../../../source/docs/ailis-artifact-tools-architecture.md)
- 依赖：未从静态文本识别到显式依赖
- 主要符号：`capability`

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code># AILIS Artifact Tools Architecture</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3 | <code>Version: 0.5</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 4 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5 | <code>Reference design:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 6 | <code>`C:\Users\Lenovo\Documents\New project 9\ARTIFACT_TOOLS_SYSTEM_DESIGN.md`</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 7 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 8 | <code>## Position</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 9 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 10 | <code>AILIS Artifact Tools is a local engineering-grade file runtime for agents. Its</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 11 | <code>core job is not "extract text from files" and not "run a document AI model".</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 12 | <code>Its core job is to let the agent reliably open, inspect, edit, render, validate,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 13 | <code>trace, diff, and export complex user artifacts.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 14 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 15 | <code>This supersedes the earlier idea of treating RAGFlow, Docling, MinerU, or other</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 16 | <code>document-AI projects as the core artifact runtime. Those systems may remain</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 17 | <code>optional parser or OCR backends, but the core AILIS runtime must be deterministic,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 18 | <code>offline-first, format-aware, and built around file object models.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 19 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 20 | <code>## Design Principles</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 21 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 22 | <code>1. Artifact-first, not parser-first.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 23 | <code>   The agent works with stable artifact sessions and canonical entities, not raw</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 24 | <code>   ZIP/XML/PDF internals or RAG chunks.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 25 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 26 | <code>2. Native structure before text.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 27 | <code>   XLSX means sheets, ranges, formulas, fills, comments, charts, validations,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 28 | <code>   images, drawings, and workbook relationships. DOCX means paragraphs, runs,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 29 | <code>   tables, sections, headers, footers, comments, fields, and relationships.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 30 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 31 | <code>3. Render is a first-class capability.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 32 | <code>   Visual QA is required for layout, clipping, sheet maps, decks, pages, charts,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 33 | <code>   and exported deliverables.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 34 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 35 | <code>4. Editing is declarative and auditable.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 36 | <code>   Tools should express operations such as `range.setValues`,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 37 | <code>   `paragraph.insertAfter`, `slide.shape.update`, and record operation envelopes.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 38 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 39 | <code>5. Validation is built in.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 40 | <code>   Artifact work is not complete until formula errors, blank outputs, broken</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 41 | <code>   relationships, render failures, and layout diagnostics have been checked.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 42 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 43 | <code>6. Adapters are format-specific.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 44 | <code>   XLSX, DOCX, PPTX, PDF, CSV, HTML, and images share a runtime protocol, but</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 45 | <code>   each adapter owns its real file-format details.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 46 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 47 | <code>7. Evaluation drives implementation.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 48 | <code>   New capability is accepted through concrete artifact tasks and roundtrip</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 49 | <code>   checks, not through broad claims about a parser library.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 50 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 51 | <code>## Runtime Layers</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 52 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 53 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 54 | <code>Agent / LLM</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 55 | <code>  -&gt; Tool API Layer</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 56 | <code>  -&gt; Artifact Runtime</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 57 | <code>  -&gt; Canonical Artifact Model</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 58 | <code>  -&gt; Adapter Registry</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 59 | <code>     -&gt; XLSX Adapter</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 60 | <code>     -&gt; DOCX Adapter</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 61 | <code>     -&gt; PPTX Adapter</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 62 | <code>     -&gt; PDF Adapter</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 63 | <code>     -&gt; CSV Adapter</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 64 | <code>     -&gt; Image Adapter</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 65 | <code>  -&gt; Inspect / Edit / Render / Validate / Export / Trace / Diff Engines</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 66 | <code>  -&gt; Local storage, render cache, operation log, diagnostics</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 67 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 68 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 69 | <code>## Canonical Object Model</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 70 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 71 | <code>The object model is intentionally small at the core. Format adapters can attach</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 72 | <code>format-specific data under `native`.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 73 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 74 | <code>### Artifact</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 75 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 76 | <code>```json</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 77 | <code>{</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 78 | <code>  "id": "art_...",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 79 | <code>  "kind": "workbook&#124;document&#124;presentation&#124;pdf&#124;table&#124;image&#124;bundle",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 80 | <code>  "format": "xlsx&#124;docx&#124;pptx&#124;pdf&#124;csv&#124;png",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 81 | <code>  "sourcePath": "F:/...",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 82 | <code>  "createdAt": "ISO timestamp",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 83 | <code>  "summary": "short model-facing description",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 84 | <code>  "metadata": {},</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 85 | <code>  "capabilities": ["inspect", "render", "validate", "export", "trace"]</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 86 | <code>}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 87 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 88 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 89 | <code>### Entity</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 90 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 91 | <code>Entities are addressable units inside an artifact:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 92 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 93 | <code>- `page`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 94 | <code>- `sheet`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 95 | <code>- `slide`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 96 | <code>- `range`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 97 | <code>- `table`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 98 | <code>- `text_run`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 99 | <code>- `paragraph`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 100 | <code>- `image`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 101 | <code>- `shape`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 102 | <code>- `chart`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 103 | <code>- `formula`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 104 | <code>- `comment`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 105 | <code>- `relationship`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 106 | <code>- `resource`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 107 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 108 | <code>Each entity has:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 109 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 110 | <code>```json</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 111 | <code>{</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 112 | <code>  "id": "ent_...",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 113 | <code>  "artifactId": "art_...",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 114 | <code>  "kind": "range",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 115 | <code>  "locator": "Sheet1!A1:D20",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 116 | <code>  "label": "optional model-facing label",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 117 | <code>  "bounds": {},</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 118 | <code>  "style": {},</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 119 | <code>  "content": {},</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 120 | <code>  "native": {}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 121 | <code>}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 122 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 123 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 124 | <code>### Operation Envelope</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 125 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 126 | <code>Every edit, render, validation, export, trace, or diff operation is recorded:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 127 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 128 | <code>```json</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 129 | <code>{</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 130 | <code>  "id": "op_...",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 131 | <code>  "artifactId": "art_...",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 132 | <code>  "action": "inspect&#124;edit&#124;render&#124;validate&#124;export&#124;trace&#124;diff",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 133 | <code>  "target": "Sheet1!A1:D20",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 134 | <code>  "status": "planned&#124;completed&#124;failed",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 135 | <code>  "startedAt": "ISO timestamp",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 136 | <code>  "finishedAt": "ISO timestamp",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 137 | <code>  "input": {},</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 138 | <code>  "output": {},</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 139 | <code>  "diagnostics": []</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 140 | <code>}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 141 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 142 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 143 | <code>### Diagnostic</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 144 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 145 | <code>Diagnostics must be actionable:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 146 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 147 | <code>```json</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 148 | <code>{</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 149 | <code>  "code": "formula_error&#124;render_failed&#124;layout_overflow&#124;blank_output",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 150 | <code>  "severity": "info&#124;warning&#124;error&#124;fatal",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 151 | <code>  "target": "Sheet1!F12",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 152 | <code>  "message": "Cell contains #REF!",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 153 | <code>  "recoverable": true,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 154 | <code>  "suggestedActions": ["inspect formula precedents", "recalculate workbook"]</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 155 | <code>}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 156 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 157 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 158 | <code>## Tool API Surface</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 159 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 160 | <code>The stable Agent-facing API should converge on these actions:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 161 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 162 | <code>- `artifact.load`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 163 | <code>- `artifact.summary`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 164 | <code>- `artifact.index`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 165 | <code>- `artifact.inspect`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 166 | <code>- `artifact.search`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 167 | <code>- `artifact.query`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 168 | <code>- `artifact.aggregate`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 169 | <code>- `artifact.edit`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 170 | <code>- `artifact.render`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 171 | <code>- `artifact.validate`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 172 | <code>- `artifact.export`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 173 | <code>- `artifact.trace`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 174 | <code>- `artifact.diff`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 175 | <code>- `artifact.list_adapters`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 176 | <code>- `artifact.plan_import`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 177 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 178 | <code>Existing AILIS tools map into this surface:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 179 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 180 | <code>&#124; Current Tool &#124; Target Role &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 181 | <code>&#124; --- &#124; --- &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 182 | <code>&#124; `read_xlsx_workbook` &#124; XLSX adapter read/inspect bootstrap &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 183 | <code>&#124; `artifact_query` &#124; Query engine over registered sessions &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 184 | <code>&#124; `artifact_compute` &#124; Deterministic compute engine &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 185 | <code>&#124; `artifact_tools` &#124; Adapter registry, inspect/render/roundtrip/eval entry point &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 186 | <code>&#124; `artifact_import` &#124; Legacy/context import entry point &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 187 | <code>&#124; RAGFlow-lite bridge &#124; Optional table/RAG chunk backend, not core &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 188 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 189 | <code>## Adapter Contract</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 190 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 191 | <code>Each adapter declares:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 192 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 193 | <code>```json</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 194 | <code>{</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 195 | <code>  "id": "xlsx",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 196 | <code>  "formats": ["xlsx", "xlsm"],</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 197 | <code>  "kinds": ["workbook"],</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 198 | <code>  "capabilities": ["load", "index", "inspect", "search", "query", "edit", "render", "validate", "export", "trace", "recalculate", "rollback"],</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 199 | <code>  "engines": {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 200 | <code>    "parser": "exceljs/openpyxl/ooxml",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 201 | <code>    "renderer": "native-canvas/libreoffice",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 202 | <code>    "validator": "artifact-runtime"</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 203 | <code>  },</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 204 | <code>  "evaluationCases": ["gaia_xlsx_map", "financial_model_roundtrip"]</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 205 | <code>}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 206 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 207 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 208 | <code>Adapters must not expose raw internal library objects to the model. They emit</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 209 | <code>canonical artifacts, entities, operations, diagnostics, and compact observations.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 210 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 211 | <code>## Evaluation Method</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 212 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 213 | <code>Every capability needs at least one concrete artifact task:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 214 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 215 | <code>&#124; Case &#124; Required Capabilities &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 216 | <code>&#124; --- &#124; --- &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 217 | <code>&#124; XLSX map path &#124; load, inspect range/styles, compute path, render range &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 218 | <code>&#124; XLSX finance model &#124; formulas, dependencies, validation, export roundtrip &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 219 | <code>&#124; DOCX structured report &#124; paragraphs, tables, render pages, layout QA &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 220 | <code>&#124; PPTX template edit &#124; import, duplicate/edit shapes, render slides, export &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 221 | <code>&#124; PDF text/layout &#124; text spans, page render, coordinate search &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 222 | <code>&#124; PDF scanned fallback &#124; render page, detect missing text layer, optional OCR &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 223 | <code>&#124; CSV dirty data &#124; schema inference, search, transform, export &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 224 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 225 | <code>Acceptance should use deterministic checks first:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 226 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 227 | <code>- roundtrip reopen</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 228 | <code>- cell/style equality</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 229 | <code>- formula-error scan</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 230 | <code>- page/slide/image render exists and is nonblank</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 231 | <code>- layout diagnostics</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 232 | <code>- output file opens through the chosen parser</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 233 | <code>- compact model-facing observation stays within budget</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 234 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 235 | <code>## Implementation Phases</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 236 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 237 | <code>### Phase 0: Architecture Skeleton</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 238 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 239 | <code>- Canonical model helpers.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 240 | <code>- Adapter registry.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 241 | <code>- Runtime session envelopes.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 242 | <code>- Operation/diagnostic/evaluation schemas.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 243 | <code>- Tests proving the skeleton can register adapters and plan imports.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 244 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 245 | <code>### Phase 1: Runtime Entry Point</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 246 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 247 | <code>- New `artifact_tools` or upgraded `artifact_import` registry entry point.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 248 | <code>- `list_adapters`, `schema`, `plan_import`, `open_session`.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 249 | <code>- Keep existing `read_xlsx_workbook` and `artifact_query` working.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 250 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 251 | <code>### Phase 2: Cross-Format Minimal Adapters</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 252 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 253 | <code>- XLSX adapter maps existing workbook payloads into canonical entities.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 254 | <code>- PDF adapter maps text-layer extraction and page render metadata.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 255 | <code>- DOCX/PPTX adapters start with structure + render roundtrip.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 256 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 257 | <code>### Phase 3: Render And Validate</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 258 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 259 | <code>- Local render workers for sheet ranges, PDF pages, DOCX pages, PPTX slides.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 260 | <code>- Validation gates and diagnostics.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 261 | <code>- Render cache and operation logs.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 262 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 263 | <code>### Phase 4: Edit And Export</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 264 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 265 | <code>- Declarative edits.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 266 | <code>- Roundtrip export and reopen validation.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 267 | <code>- Trace/diff.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 268 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 269 | <code>## Non-Goals For Core Runtime</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 270 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 271 | <code>- Do not make RAG chunks the canonical artifact model.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 272 | <code>- Do not require OCR or neural layout models for ordinary Office/PDF files.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 273 | <code>- Do not make Docling/MinerU/Marker mandatory dependencies.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 274 | <code>- Do not copy or reverse engineer private OpenAI `@oai/artifact-tool` code.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 275 | <code>- Do not dump raw XML/JSON/binary payloads into model context.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 276 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 277 | <code>## Current Implementation State</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 278 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 279 | <code>Phase 0 is implemented:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 280 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 281 | <code>- `electron/ailis-artifact-tools-model.cjs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 282 | <code>- `electron/ailis-artifact-tools-runtime.cjs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 283 | <code>- `tests/ailis-artifact-tools-runtime.test.mjs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 284 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 285 | <code>Phase 1 and the first slice of Phase 2 are now connected:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 286 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 287 | <code>- `electron/ailis-artifact-tools-adapters.cjs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 288 | <code>- `scripts/prepare-artifact-tools-fixtures.mjs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 289 | <code>- `scripts/run-artifact-tools-eval.mjs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 290 | <code>- `tests/ailis-artifact-tools-eval.test.mjs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 291 | <code>- `evals/artifact-tools/cases/baseline.cases.json`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 292 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 293 | <code>The current executable adapters cover:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 294 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 295 | <code>&#124; Adapter &#124; Current Checks &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 296 | <code>&#124; --- &#124; --- &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 297 | <code>&#124; XLSX &#124; workbook/sheet/range inspect, cached index, compact observation, cell/text/style/formula/error/table/merge/comment/defined-name/relationship/image/hidden search, table query/aggregate, values, fills, styles, formulas, formula errors, tables, merges, hidden rows/columns/sheets, data validations, drawing/image anchors, OOXML relationships, map path compute, declaration edits, operation log, rollback backup, export, cached PNG range render, render nonblank check, formula trace with defined-name expansion, local formula recalculation, native export/reopen &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 298 | <code>&#124; CSV &#124; headers, inferred column types, malformed rows, SVG preview, normalized export/reopen &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 299 | <code>&#124; PDF &#124; text-layer spans from simple text operators, page count, SVG preview, copy/reopen &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 300 | <code>&#124; DOCX &#124; OOXML text runs and table count, SVG preview, copy/reopen &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 301 | <code>&#124; PPTX &#124; slide XML inventory and text runs, SVG contact sheet, copy/reopen &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 302 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 303 | <code>XLSX now has a first real adapter surface:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 304 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 305 | <code>- `index` builds a cached workbook index keyed by file signature. It summarizes</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 306 | <code>  sheets, cells, formulas, formula errors, styles, comments, defined names, and</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 307 | <code>  lightweight OOXML package inventory including tables, relationships, drawings,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 308 | <code>  image anchors, hidden rows/columns, and hidden or veryHidden sheets.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 309 | <code>- `inspect` supports workbook summaries and targeted `sheet`, `range`,</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 310 | <code>  `table`, `style`, `formula`, `comment`, `definedName`, `relationship`,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 311 | <code>  `chart`, `image`, `shape`, and `visibility` inventory views.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 312 | <code>- `search` returns compact candidate evidence over cell text/values, styles,</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 313 | <code>  formulas, formula errors, tables, merges, comments, defined names,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 314 | <code>  relationships, drawings, charts, images, image anchors, and hidden structure.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 315 | <code>- `query` and `aggregate` reconstruct Excel table rows from indexed table</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 316 | <code>  ranges, then perform deterministic filter, group, sum, max, min, average, and</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 317 | <code>  count operations while returning row/range evidence.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 318 | <code>- `observation` payloads are compact model-facing summaries rather than raw</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 319 | <code>  workbook dumps.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 320 | <code>- `validate` scans formula errors such as `#REF!` and reports diagnostics.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 321 | <code>- `render` uses a cached local XLSX range-to-PNG worker for workbook ranges and</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 322 | <code>  records a simple visual nonblank check. CSV, PDF, DOCX, and PPTX still use</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 323 | <code>  deterministic structural SVG previews.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 324 | <code>- `edit` supports declaration-style operations:</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 325 | <code>  `sheet.add`, `range.setValues`, `range.setFormulas`, `range.setStyles`,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 326 | <code>  `range.clear`, `range.merge`, and `range.unmerge`. It records operation logs,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 327 | <code>  dirty ranges, affected objects, and a backup-based rollback handle.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 328 | <code>- `rollback` restores an edit from the recorded backup path.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 329 | <code>- `export` writes `.xlsx` and reopens the output for validation.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 330 | <code>- `trace` builds a compact formula dependency graph for targeted formula cells,</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 331 | <code>  including cross-sheet cell/range references and defined-name targets.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 332 | <code>- `recalculate` runs the current AILIS local formula engine, updates cached</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 333 | <code>  formula results, exports, and reopens the workbook.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 334 | <code>- `run_checks` can execute an XLSX edit/export/roundtrip case from the eval</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 335 | <code>  manifest.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 336 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 337 | <code>The current recalculation engine is intentionally narrow. It supports the first</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 338 | <code>GAIA-useful slice: cell references, cross-sheet references, bounded ranges,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 339 | <code>`SUM`, and basic arithmetic. It is not a full Excel-compatible calculation</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 340 | <code>engine. LibreOffice is probed as an optional future backend, but it is not</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 341 | <code>installed in the current Windows environment.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 342 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 343 | <code>The current XLSX adapter has passed the local "ultimate complex workbook" smoke</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 344 | <code>test for hidden rows, veryHidden sheets, defined-name trace, image anchors,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 345 | <code>formula errors, and table aggregations. Next XLSX work should deepen fidelity</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 346 | <code>before broadening other formats:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 347 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 348 | <code>- Turn the current file-signature index into durable searchable artifact</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 349 | <code>  sessions shared with `artifact_query`.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 350 | <code>- Add LibreOffice/Excel recalculation fallback for broader formula coverage.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 351 | <code>- Deepen charts, shapes, conditional formatting, hyperlinks, pivot tables,</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 352 | <code>  filters/slicers, workbook protection, and theme/computed-style fidelity.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 353 | <code>- Add real diff and richer rollback/inverse-operation support.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 354 | <code>- Add failure fixtures for broken formulas, invalid matrix writes, blank render</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 355 | <code>  outputs, and style/roundtrip regressions.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
