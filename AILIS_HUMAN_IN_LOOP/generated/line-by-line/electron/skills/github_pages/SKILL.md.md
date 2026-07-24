# electron/skills/github_pages/SKILL.md 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。
- 文件类型：`documentation`
- 原始行数：33
- SHA-256：`10522e91aa9cbe33c2c1e1a4b992c60b404a60c776583c77a396397810914482`
- 可运行副本：[打开源文件](../../../../../source/electron/skills/github_pages/SKILL.md)
- 依赖：未从静态文本识别到显式依赖
- 主要符号：未从静态文本识别到命名符号

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code>---</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 2 | <code>id: github_pages</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 3 | <code>label: GitHub Pages Skill</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 4 | <code>description: GitHub Pages, gh-pages, github.io, deployment verification, and publish blocker diagnostics.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 5 | <code>when: GitHub Pages 部署、gh-pages 分支、github.io 访问失败、Pages 404、发布验收和 GitHub 静态站点排障。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 6 | <code>tools:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 7 | <code>  - github_pages</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 8 | <code>  - code</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 9 | <code>  - computer</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 10 | <code>  - read</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 11 | <code>  - exec</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 12 | <code>triggers:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 13 | <code>  - GitHub Pages</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 14 | <code>  - gh-pages</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 15 | <code>  - github.io</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 16 | <code>  - Pages 404</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 17 | <code>  - 部署到 GitHub</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 18 | <code>---</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 19 | <code># GITHUB PAGES SKILL</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 20 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 21 | <code>用于 GitHub Pages、`gh-pages`、`github.io`、静态站点发布和部署验收。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 22 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 23 | <code>规则：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 24 | <code>- 任务涉及 GitHub Pages、`gh-pages` 分支、`github.io` URL、部署验收或 Pages 404 时，优先调用 `github_pages.diagnose_publish` 或 `github_pages.verify_url`，不要先用裸 `git`、`curl`、`head` 拼临时命令。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 25 | <code>- 不能因为本地 `dist` 存在、Git 仓库有提交、或仓库主页能打开，就声称 Pages 已部署成功；最终必须有明确验收证据，例如公开 URL HTTP 200、目标文本命中、Pages API 可访问、或远端发布分支/Actions artifact 与目标文件一致。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 26 | <code>- 如果 workflow 使用 `actions/upload-pages-artifact` 并上传 `./dist`，必须检查目标文件是否在 `dist/` 下。根目录有文件不代表会被发布。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 27 | <code>- `Permission denied (publickey)` 是 SSH 授权问题；`Connection reset`、timeout、HTTP 000 通常是网络或代理问题；这些要作为未解决阻塞说明，不要被后续普通命令成功覆盖。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 28 | <code>- 诊断结果里的 `criticalBlockers` 是关键阻塞，`verificationEvidence` 是验收证据。向用户解释时用自然语言概括，不要把 JSON 原样甩出来。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 29 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 30 | <code>常用调用：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 31 | <code>- 发布链路诊断：`{"action":"diagnose_publish","targetPath":"about-ailis.html","skipNetwork":false}`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 32 | <code>- 只做本地/工作流检查：`{"action":"diagnose_publish","targetPath":"about-ailis.html","skipNetwork":true}`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 33 | <code>- 公开 URL 验收：`{"action":"verify_url","url":"https://owner.github.io/repo/about-ailis.html","expectedStatus":200}`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
