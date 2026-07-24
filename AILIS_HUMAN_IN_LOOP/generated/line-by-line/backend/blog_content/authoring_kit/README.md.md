# backend/blog_content/authoring_kit/README.md 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。
- 文件类型：`documentation`
- 原始行数：51
- SHA-256：`3cb152aa50b0620ff88841d6ef26a0d5409d6d3635d75d0bb08bbdf9b69a7bc9`
- 可运行副本：[打开源文件](../../../../../source/backend/blog_content/authoring_kit/README.md)
- 依赖：未从静态文本识别到显式依赖
- 主要符号：未从静态文本识别到命名符号

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code># AILIS Blog Authoring Kit</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 2 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3 | <code>以后如果你要发博客，或者让其他 AI 帮你发博客，直接把整个 `authoring_kit` 文件夹交给它就可以。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 4 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5 | <code>## 这个文件夹里有什么</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 6 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 7 | <code>- `PUBLISHING_GUIDE.md`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 8 | <code>  - 完整发文规范</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 9 | <code>  - 规定能改什么、不能改什么、文章必须满足什么格式</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 10 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 11 | <code>- `post_template_zh.md`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 12 | <code>  - 中文文章模板</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 13 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 14 | <code>- `post_template_en.md`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 15 | <code>  - 英文文章模板</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 16 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 17 | <code>- `posts_json_entry_template.json`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 18 | <code>  - `posts.json` 的标准条目模板</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 19 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 20 | <code>## 正确用法</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 21 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 22 | <code>让其他 AI 发文时，告诉它：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 23 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 24 | <code>1. 先阅读 `PUBLISHING_GUIDE.md`</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 25 | <code>2. 按 `post_template_zh.md` 写中文正文</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 26 | <code>3. 按 `post_template_en.md` 写英文正文</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 27 | <code>4. 按 `posts_json_entry_template.json` 更新 `backend/blog_content/posts.json`</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 28 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 29 | <code>## 给其他 AI 的标准任务描述</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 30 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 31 | <code>你可以直接复制下面这段：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 32 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 33 | <code>```md</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 34 | <code>请严格按照 AILIS 博客发文规范执行，只修改博客内容层：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 35 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 36 | <code>1. 阅读 `backend/blog_content/authoring_kit/PUBLISHING_GUIDE.md`</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 37 | <code>2. 新增中文文章到 `backend/blog_content/posts/zh/&lt;slug&gt;.md`</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 38 | <code>3. 新增英文文章到 `backend/blog_content/posts/en/&lt;slug&gt;.md`</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 39 | <code>4. 按 `backend/blog_content/authoring_kit/posts_json_entry_template.json` 的格式更新 `backend/blog_content/posts.json`</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 40 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 41 | <code>要求：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 42 | <code>- 必须中英双语</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 43 | <code>- 不要修改博客代码</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 44 | <code>- 不要修改部署配置</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 45 | <code>- 不要覆盖旧文章</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 46 | <code>- `slug` 使用小写英文和短横线</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 47 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 48 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 49 | <code>## 你自己只需要记住一件事</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 50 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 51 | <code>以后发文就看这个文件夹，不用再到处找规范。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
