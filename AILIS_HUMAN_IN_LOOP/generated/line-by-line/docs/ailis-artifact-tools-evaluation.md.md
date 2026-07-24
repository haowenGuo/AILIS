# docs/ailis-artifact-tools-evaluation.md 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。
- 文件类型：`documentation`
- 原始行数：189
- SHA-256：`16f4b3e7d6432bd6902478e53d35edd46ee1fcf2ddccb4697ad801e7f55d4188`
- 可运行副本：[打开源文件](../../../source/docs/ailis-artifact-tools-evaluation.md)
- 依赖：未从静态文本识别到显式依赖
- 主要符号：未从静态文本识别到命名符号

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code># AILIS Artifact Tools Evaluation Plan</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3 | <code>Version: 0.5</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 4 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5 | <code>## Purpose</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 6 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 7 | <code>AILIS Artifact Tools should be evaluated as a local file runtime, not as a</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 8 | <code>generic document parser. Each evaluation case must prove an agent can obtain</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 9 | <code>stable structured evidence, optionally render the artifact, perform deterministic</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 10 | <code>checks, and return or export a reliable result.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 11 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 12 | <code>## Evaluation Shape</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 13 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 14 | <code>Each case should define:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 15 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 16 | <code>```json</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 17 | <code>{</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 18 | <code>  "id": "xlsx_map_path_color",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 19 | <code>  "artifactKind": "workbook",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 20 | <code>  "input": "path/to/file.xlsx",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 21 | <code>  "goal": "answer a question or produce an edited/exported artifact",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 22 | <code>  "requiredCapabilities": ["load", "inspect", "render", "validate"],</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 23 | <code>  "expectedEvidence": ["cell value", "fill color", "range address"],</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 24 | <code>  "expectedAnswer": "F478A7",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 25 | <code>  "checks": ["structured equality", "render nonblank", "roundtrip reopen"]</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 26 | <code>}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 27 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 28 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 29 | <code>## Core Metrics</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 30 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 31 | <code>- `answer_correct`: final answer or exported artifact matches expectation.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 32 | <code>- `evidence_complete`: tool observations include all required fields.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 33 | <code>- `structure_preserved`: styles, formulas, relationships, layout, or coordinates</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 34 | <code>  survive import/export.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 35 | <code>- `render_valid`: rendered page/range/slide exists, is nonblank, and has expected</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 36 | <code>  dimensions.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 37 | <code>- `roundtrip_valid`: exported artifact can be reopened and still contains the</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 38 | <code>  expected structure.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 39 | <code>- `model_context_cost`: observation remains compact and queryable.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 40 | <code>- `tool_steps`: task converges without unnecessary loops.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 41 | <code>- `diagnostics_quality`: failures include actionable recovery hints.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 42 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 43 | <code>## Baseline Case Families</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 44 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 45 | <code>### Workbook</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 46 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 47 | <code>1. `xlsx_map_path_color`</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 48 | <code>   - Read START/END cells, blocked fill colors, path cells, and target fill.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 49 | <code>   - Requires exact styles and range coordinates.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 50 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 51 | <code>2. `xlsx_formula_error_repair`</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 52 | <code>   - Detect formula errors, trace dependencies, edit formulas, export, reopen.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 53 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 54 | <code>3. `xlsx_dashboard_visual_qa`</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 55 | <code>   - Render a dashboard range and detect clipped headers, unreadable colors, or</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 56 | <code>     blank charts.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 57 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 58 | <code>4. `xlsx_search_index_observation`</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 59 | <code>   - Build a workbook index and search compact candidate evidence across text,</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 60 | <code>     styles, formulas, errors, tables, merges, comments, defined names, and</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 61 | <code>     package inventory.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 62 | <code>   - Query table rows for filter/group/aggregate evidence, including hidden</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 63 | <code>     rows and image/drawing anchors.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 64 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 65 | <code>### PDF</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 66 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 67 | <code>1. `pdf_text_layer_search`</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 68 | <code>   - Extract text spans and page coordinates without OCR.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 69 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 70 | <code>2. `pdf_page_render`</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 71 | <code>   - Render specific pages, verify nonblank output, map text evidence to page.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 72 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 73 | <code>3. `pdf_scanned_needs_ocr`</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 74 | <code>   - Detect no usable text layer and return `needs_ocr` rather than pretending</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 75 | <code>     the document is empty.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 76 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 77 | <code>### DOCX</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 78 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 79 | <code>1. `docx_table_inspect`</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 80 | <code>   - Read paragraphs, headings, tables, and comments.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 81 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 82 | <code>2. `docx_render_layout_gate`</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 83 | <code>   - Render pages and detect blank/clipped/overflow layout.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 84 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 85 | <code>3. `docx_edit_roundtrip`</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 86 | <code>   - Apply a small edit, export, reopen, and verify.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 87 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 88 | <code>### PPTX</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 89 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 90 | <code>1. `pptx_slide_inventory`</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 91 | <code>   - List slides, shapes, images, speaker notes, and layout/theme metadata.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 92 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 93 | <code>2. `pptx_template_edit`</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 94 | <code>   - Duplicate/edit an existing slide while preserving visual system.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 95 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 96 | <code>3. `pptx_render_contact_sheet`</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 97 | <code>   - Render slide previews and verify nonblank outputs.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 98 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 99 | <code>### CSV / Plain Tables</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 100 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 101 | <code>1. `csv_schema_inference`</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 102 | <code>   - Detect delimiter, encoding, headers, types, and malformed rows.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 103 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 104 | <code>2. `csv_transform_export`</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 105 | <code>   - Apply a deterministic transform and export a clean table.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 106 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 107 | <code>## Evaluation Harness Design</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 108 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 109 | <code>The harness is data-driven:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 110 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 111 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 112 | <code>evals/artifact-tools/cases/*.json</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 113 | <code>evals/artifact-tools/fixtures/</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 114 | <code>scripts/prepare-artifact-tools-fixtures.mjs</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 115 | <code>scripts/run-artifact-tools-eval.mjs</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 116 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 117 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 118 | <code>Current commands:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 119 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 120 | <code>```bash</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 121 | <code>pnpm eval:artifact-tools:prepare</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 122 | <code>pnpm eval:artifact-tools:plan</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 123 | <code>pnpm eval:artifact-tools:run</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 124 | <code>pnpm test:ailis-artifact-tools</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 125 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 126 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 127 | <code>The harness:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 128 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 129 | <code>1. Loads the case manifest and chooses the registered adapter.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 130 | <code>2. Runs `artifact_tools.run_checks`.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 131 | <code>3. Performs structure checks against each case's `expected` block.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 132 | <code>4. Writes render outputs under `eval-results/artifact-tools/renders/`. XLSX</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 133 | <code>   cases use real PNG range renders; CSV, PDF, DOCX, and PPTX currently use</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 134 | <code>   deterministic structural SVG previews.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 135 | <code>5. Reopens an exported or copied artifact under</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 136 | <code>   `eval-results/artifact-tools/roundtrip/`.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 137 | <code>6. Emits a compact text or JSON report with status, diagnostics, render paths,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 138 | <code>   and roundtrip paths.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 139 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 140 | <code>The first real fixture set covers:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 141 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 142 | <code>- `xlsx_map_path_color`: real XLSX with exact fills and a unique non-blue path.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 143 | <code>- `xlsx_formula_style_inspect`: real XLSX with tables, formulas, styles,</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 144 | <code>  validation, merges, and a known formula error.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 145 | <code>- `xlsx_edit_export_roundtrip`: real XLSX declaration edits followed by export</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 146 | <code>  and reopen checks.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 147 | <code>- `xlsx_render_trace_recalculate`: real XLSX range render, formula dependency</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 148 | <code>  trace, pre-recalculation edit, local formula recalculation, export, and</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 149 | <code>  reopen checks.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 150 | <code>- `xlsx_search_index_observation`: real XLSX index/search case covering text,</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 151 | <code>  style, formula, formula error, table, merge, comment, defined name, hidden</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 152 | <code>  row, image inventory, image anchor search, and table query/aggregate checks.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 153 | <code>- `pdf_text_layer_search`: real minimal PDF with a text layer.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 154 | <code>- `docx_render_layout_gate`: real DOCX with paragraphs and a table.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 155 | <code>- `pptx_render_contact_sheet`: real PPTX with two slides.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 156 | <code>- `csv_schema_inference`: dirty CSV with malformed row diagnostics.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 157 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 158 | <code>## Acceptance Rule</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 159 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 160 | <code>No adapter is "supported" until it passes at least:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 161 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 162 | <code>- one structure-only case,</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 163 | <code>- one render or validation case,</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 164 | <code>- one failure/recovery case,</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 165 | <code>- one roundtrip case if the adapter supports edits or export.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 166 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 167 | <code>This rule keeps AILIS from accumulating shallow parsers that look useful but fail</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 168 | <code>real agent tasks.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 169 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 170 | <code>## Current Limitations</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 171 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 172 | <code>- XLSX is the priority adapter. Other formats are intentionally shallow until</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 173 | <code>  XLSX reaches the first-stage contract in the system design.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 174 | <code>- XLSX render checks now produce PNG range renders through the XLSX adapter.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 175 | <code>  Non-XLSX render checks still produce deterministic SVG structural previews,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 176 | <code>  not final Poppler/LibreOffice page images.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 177 | <code>- XLSX now has declaration-style edit/export/reopen checks. CSV has meaningful</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 178 | <code>  export/reopen checks. PDF, DOCX, and PPTX</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 179 | <code>  currently use copy/reopen roundtrip until edit/export adapters exist.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 180 | <code>- XLSX formula tracing and recalculation are covered by the baseline harness,</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 181 | <code>  but recalculation is currently the narrow AILIS local formula engine, not a</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 182 | <code>  complete Excel-compatible engine.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 183 | <code>- XLSX search/query is now covered by the baseline harness and returns compact</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 184 | <code>  candidate evidence for hidden rows, image anchors, and table aggregates. The</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 185 | <code>  current index is process-local and file-signature cached; it is not yet a</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 186 | <code>  durable cross-session artifact database.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 187 | <code>- DOCX/PPTX structure inspection reads OOXML package parts through a local</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 188 | <code>  Python zip helper. This is deliberately lighter than a neural document-AI</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 189 | <code>  stack, but it is not yet a full Office object model.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
