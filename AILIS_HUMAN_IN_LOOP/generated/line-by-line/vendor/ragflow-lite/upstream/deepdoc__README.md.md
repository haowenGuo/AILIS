# vendor/ragflow-lite/upstream/deepdoc__README.md 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。
- 文件类型：`documentation`
- 原始行数：145
- SHA-256：`d1db237b113b8c4f4a5f5aaf07baba9bd74af4b0077e9ae07ba776f263b9d78e`
- 可运行副本：[打开源文件](../../../../../source/vendor/ragflow-lite/upstream/deepdoc__README.md)
- 依赖：`deepdoc.parser`
- 主要符号：未从静态文本识别到命名符号

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code>English &#124; [简体中文](./README_zh.md)</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 2 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3 | <code># *Deep*Doc</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 4 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5 | <code>- [1. Introduction](#1)</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 6 | <code>- [2. Vision](#2)</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 7 | <code>- [3. Parser](#3)</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 8 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 9 | <code>&lt;a name="1"&gt;&lt;/a&gt;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 10 | <code>## 1. Introduction</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 11 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 12 | <code>With a bunch of documents from various domains with various formats and along with diverse retrieval requirements,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 13 | <code>an accurate analysis becomes a very challenge task. *Deep*Doc is born for that purpose.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 14 | <code>There are 2 parts in *Deep*Doc so far: vision and parser.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 15 | <code>You can run the flowing test programs if you're interested in our results of OCR, layout recognition and TSR.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 16 | <code>```bash</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 17 | <code>python deepdoc/vision/t_ocr.py -h</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 18 | <code>usage: t_ocr.py [-h] --inputs INPUTS [--output_dir OUTPUT_DIR]</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 19 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 20 | <code>options:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 21 | <code>  -h, --help            show this help message and exit</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 22 | <code>  --inputs INPUTS       Directory where to store images or PDFs, or a file path to a single image or PDF</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 23 | <code>  --output_dir OUTPUT_DIR</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 24 | <code>                        Directory where to store the output images. Default: './ocr_outputs'</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 25 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 26 | <code>```bash</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 27 | <code>python deepdoc/vision/t_recognizer.py -h</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 28 | <code>usage: t_recognizer.py [-h] --inputs INPUTS [--output_dir OUTPUT_DIR] [--threshold THRESHOLD] [--mode {layout,tsr}]</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 29 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 30 | <code>options:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 31 | <code>  -h, --help            show this help message and exit</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 32 | <code>  --inputs INPUTS       Directory where to store images or PDFs, or a file path to a single image or PDF</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 33 | <code>  --output_dir OUTPUT_DIR</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 34 | <code>                        Directory where to store the output images. Default: './layouts_outputs'</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 35 | <code>  --threshold THRESHOLD</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 36 | <code>                        A threshold to filter out detections. Default: 0.5</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 37 | <code>  --mode {layout,tsr}   Task mode: layout recognition or table structure recognition</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 38 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 39 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 40 | <code>Our models are served on HuggingFace. If you have trouble downloading HuggingFace models, this might help!!</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 41 | <code>```bash</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 42 | <code>export HF_ENDPOINT=https://hf-mirror.com</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 43 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 44 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 45 | <code>&lt;a name="2"&gt;&lt;/a&gt;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 46 | <code>## 2. Vision</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 47 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 48 | <code>We use vision information to resolve problems as human being.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 49 | <code>  - OCR. Since a lot of documents presented as images or at least be able to transform to image,</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 50 | <code>    OCR is a very essential and fundamental or even universal solution for text extraction.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 51 | <code>    ```bash</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 52 | <code>        python deepdoc/vision/t_ocr.py --inputs=path_to_images_or_pdfs --output_dir=path_to_store_result</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 53 | <code>     ```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 54 | <code>    The inputs could be directory to images or PDF, or an image or PDF.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 55 | <code>    You can look into the folder 'path_to_store_result' where has images which demonstrate the positions of results,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 56 | <code>    txt files which contain the OCR text.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 57 | <code>    &lt;div align="center" style="margin-top:20px;margin-bottom:20px;"&gt;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 58 | <code>    &lt;img src="https://github.com/infiniflow/ragflow/assets/12318111/f25bee3d-aaf7-4102-baf5-d5208361d110" width="900"/&gt;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 59 | <code>    &lt;/div&gt;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 60 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 61 | <code>  - Layout recognition. Documents from different domain may have various layouts,</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 62 | <code>    like, newspaper, magazine, book and résumé are distinct in terms of layout.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 63 | <code>    Only when machine have an accurate layout analysis, it can decide if these text parts are successive or not,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 64 | <code>    or this part needs Table Structure Recognition(TSR) to process, or this part is a figure and described with this caption.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 65 | <code>    We have 10 basic layout components which covers most cases:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 66 | <code>      - Text</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 67 | <code>      - Title</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 68 | <code>      - Figure</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 69 | <code>      - Figure caption</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 70 | <code>      - Table</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 71 | <code>      - Table caption</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 72 | <code>      - Header</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 73 | <code>      - Footer</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 74 | <code>      - Reference</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 75 | <code>      - Equation</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 76 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 77 | <code>     Have a try on the following command to see the layout detection results.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 78 | <code>     ```bash</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 79 | <code>        python deepdoc/vision/t_recognizer.py --inputs=path_to_images_or_pdfs --threshold=0.2 --mode=layout --output_dir=path_to_store_result</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 80 | <code>     ```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 81 | <code>    The inputs could be directory to images or PDF, or an image or PDF.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 82 | <code>    You can look into the folder 'path_to_store_result' where has images which demonstrate the detection results as following:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 83 | <code>    &lt;div align="center" style="margin-top:20px;margin-bottom:20px;"&gt;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 84 | <code>    &lt;img src="https://github.com/infiniflow/ragflow/assets/12318111/07e0f625-9b28-43d0-9fbb-5bf586cd286f" width="1000"/&gt;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 85 | <code>    &lt;/div&gt;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 86 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 87 | <code>  - Table Structure Recognition(TSR). Data table is a frequently used structure to present data including numbers or text.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 88 | <code>    And the structure of a table might be very complex, like hierarchy headers, spanning cells and projected row headers.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 89 | <code>    Along with TSR, we also reassemble the content into sentences which could be well comprehended by LLM.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 90 | <code>    We have five labels for TSR task:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 91 | <code>      - Column</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 92 | <code>      - Row</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 93 | <code>      - Column header</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 94 | <code>      - Projected row header</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 95 | <code>      - Spanning cell</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 96 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 97 | <code>    Have a try on the following command to see the layout detection results.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 98 | <code>     ```bash</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 99 | <code>        python deepdoc/vision/t_recognizer.py --inputs=path_to_images_or_pdfs --threshold=0.2 --mode=tsr --output_dir=path_to_store_result</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 100 | <code>     ```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 101 | <code>    The inputs could be directory to images or PDF, or an image or PDF.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 102 | <code>    You can look into the folder 'path_to_store_result' where has both images and html pages which demonstrate the detection results as following:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 103 | <code>    &lt;div align="center" style="margin-top:20px;margin-bottom:20px;"&gt;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 104 | <code>    &lt;img src="https://github.com/infiniflow/ragflow/assets/12318111/cb24e81b-f2ba-49f3-ac09-883d75606f4c" width="1000"/&gt;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 105 | <code>    &lt;/div&gt;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 106 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 107 | <code>  - **Table Auto-Rotation**. For scanned PDFs where tables may be incorrectly oriented (rotated 90°, 180°, or 270°),</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 108 | <code>    the PDF parser automatically detects the best rotation angle using OCR confidence scores before performing</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 109 | <code>    table structure recognition. This significantly improves OCR accuracy and table structure detection for rotated tables.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 110 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 111 | <code>    The feature evaluates 4 rotation angles (0°, 90°, 180°, 270°) and selects the one with highest OCR confidence.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 112 | <code>    After determining the best orientation, it re-performs OCR on the correctly rotated table image.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 113 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 114 | <code>    This feature is **enabled by default**. You can control it via environment variable:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 115 | <code>    ```bash</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 116 | <code>    # Disable table auto-rotation</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 117 | <code>    export TABLE_AUTO_ROTATE=false</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 118 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 119 | <code>    # Enable table auto-rotation (default)</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 120 | <code>    export TABLE_AUTO_ROTATE=true</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 121 | <code>    ```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 122 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 123 | <code>    Or via API parameter:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 124 | <code>    ```python</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 125 | <code>    from deepdoc.parser import PdfParser</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 126 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 127 | <code>    parser = PdfParser()</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 128 | <code>    # Disable auto-rotation for this call</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 129 | <code>    boxes, tables = parser(pdf_path, auto_rotate_tables=False)</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 130 | <code>    ```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 131 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 132 | <code>&lt;a name="3"&gt;&lt;/a&gt;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 133 | <code>## 3. Parser</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 134 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 135 | <code>Four kinds of document formats as PDF, DOCX, EXCEL and PPT have their corresponding parser.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 136 | <code>The most complex one is PDF parser since PDF's flexibility. The output of PDF parser includes:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 137 | <code>  - Text chunks with their own positions in PDF(page number and rectangular positions).</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 138 | <code>  - Tables with cropped image from the PDF, and contents which has already translated into natural language sentences.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 139 | <code>  - Figures with caption and text in the figures.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 140 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 141 | <code>### Résumé</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 142 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 143 | <code>The résumé is a very complicated kind of document. A résumé which is composed of unstructured text</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 144 | <code>with various layouts could be resolved into structured data composed of nearly a hundred of fields.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 145 | <code>We haven't opened the parser yet, as we open the processing method after parsing procedure.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
