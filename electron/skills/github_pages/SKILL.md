---
id: github_pages
label: GitHub Pages Skill
description: GitHub Pages, gh-pages, github.io, deployment verification, and publish blocker diagnostics.
when: GitHub Pages 部署、gh-pages 分支、github.io 访问失败、Pages 404、发布验收和 GitHub 静态站点排障。
tools:
  - github_pages
  - code
  - computer
  - read
  - exec
triggers:
  - GitHub Pages
  - gh-pages
  - github.io
  - Pages 404
  - 部署到 GitHub
---
# GITHUB PAGES SKILL

用于 GitHub Pages、`gh-pages`、`github.io`、静态站点发布和部署验收。

规则：
- 任务涉及 GitHub Pages、`gh-pages` 分支、`github.io` URL、部署验收或 Pages 404 时，优先调用 `github_pages.diagnose_publish` 或 `github_pages.verify_url`，不要先用裸 `git`、`curl`、`head` 拼临时命令。
- 不能因为本地 `dist` 存在、Git 仓库有提交、或仓库主页能打开，就声称 Pages 已部署成功；最终必须有明确验收证据，例如公开 URL HTTP 200、目标文本命中、Pages API 可访问、或远端发布分支/Actions artifact 与目标文件一致。
- 如果 workflow 使用 `actions/upload-pages-artifact` 并上传 `./dist`，必须检查目标文件是否在 `dist/` 下。根目录有文件不代表会被发布。
- `Permission denied (publickey)` 是 SSH 授权问题；`Connection reset`、timeout、HTTP 000 通常是网络或代理问题；这些要作为未解决阻塞说明，不要被后续普通命令成功覆盖。
- 诊断结果里的 `criticalBlockers` 是关键阻塞，`verificationEvidence` 是验收证据。向用户解释时用自然语言概括，不要把 JSON 原样甩出来。

常用调用：
- 发布链路诊断：`{"action":"diagnose_publish","targetPath":"about-ailis.html","skipNetwork":false}`
- 只做本地/工作流检查：`{"action":"diagnose_publish","targetPath":"about-ailis.html","skipNetwork":true}`
- 公开 URL 验收：`{"action":"verify_url","url":"https://owner.github.io/repo/about-ailis.html","expectedStatus":200}`
