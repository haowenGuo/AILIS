# backend/blog_content/posts/en/ailis-render-github-pages-deployment.md 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。
- 文件类型：`documentation`
- 原始行数：112
- SHA-256：`1d3b1e928f0597527c6a3ecb6dc05955843a5ddefe83aee9d48cffb42d8a2025`
- 可运行副本：[打开源文件](../../../../../../source/backend/blog_content/posts/en/ailis-render-github-pages-deployment.md)
- 依赖：未从静态文本识别到显式依赖
- 主要符号：未从静态文本识别到命名符号

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code># How AILIS Is Deployed: GitHub Pages for the Frontend and Render for the Backend</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 2 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3 | <code>AILIS is no longer only a local virtual-character demo. It has been split into a deployable web system: the frontend runs on GitHub Pages, the backend runs on Render, and visitors can open a browser to meet AILIS and try the conversation flow.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 4 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5 | <code>This post documents one of the most important engineering lines in the project: turning an AI application with a 3D avatar, streaming chat, memory, and safety APIs into something other people can actually visit.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 6 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 7 | <code>## Why the frontend and backend are deployed separately</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 8 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 9 | <code>The frontend owns the experience.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 10 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 11 | <code>It includes:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 12 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 13 | <code>- 3D VRM avatar rendering</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 14 | <code>- motion and expression control</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 15 | <code>- streaming text display</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 16 | <code>- fallback lip sync and speaking state</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 17 | <code>- the browser interaction layer</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 18 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 19 | <code>These pieces are a natural fit for GitHub Pages. They are static assets, easy to host, and ideal for a project showcase.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 20 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 21 | <code>The backend owns the parts that should not live directly in the browser:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 22 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 23 | <code>- LLM API calls</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 24 | <code>- session memory</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 25 | <code>- RAG retrieval</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 26 | <code>- content safety checks</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 27 | <code>- TTS and other key-protected services</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 28 | <code>- SQLite-backed server state</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 29 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 30 | <code>That part needs a real Python service, so I deploy it to Render as a FastAPI backend.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 31 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 32 | <code>## Current live entry points</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 33 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 34 | <code>The project currently has three useful public links:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 35 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 36 | <code>- Full live experience: [https://haowenGuo.github.io/AILIS/?backend=https://airi-backend.onrender.com](https://haowenGuo.github.io/AILIS/?backend=https://airi-backend.onrender.com)</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 37 | <code>- Frontend-only page: [https://haowenGuo.github.io/AILIS/](https://haowenGuo.github.io/AILIS/)</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 38 | <code>- Backend API docs: [https://airi-backend.onrender.com/docs](https://airi-backend.onrender.com/docs)</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 39 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 40 | <code>This setup makes the project easy to understand. Visitors can first try the live page without installing anything, then inspect the source code or backend API if they want to go deeper.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 41 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 42 | <code>## What the Render backend does</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 43 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 44 | <code>The AILIS backend is not just a thin proxy.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 45 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 46 | <code>It handles several responsibilities:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 47 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 48 | <code>- chat endpoints such as `/api/chat`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 49 | <code>- user sessions and conversation history</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 50 | <code>- memory compression when conversations become long</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 51 | <code>- content safety checks</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 52 | <code>- a shared FastAPI surface for later modules such as voice, education demos, and the blog</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 53 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 54 | <code>Render works well here because it connects directly to GitHub and can redeploy when the `main` branch changes. For a personal project that needs to be shown to others, this is much lighter than maintaining a cloud server by hand.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 55 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 56 | <code>There are tradeoffs. Free or small instances can cold-start, and network latency between Render and model providers can hurt the experience. That is one reason I paused heavy TTS work and returned to streaming text first: the interaction needs to feel stable before it feels fancy.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 57 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 58 | <code>## What GitHub Pages does</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 59 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 60 | <code>The frontend turns backend capability into something the user can feel.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 61 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 62 | <code>AILIS is not organized around a plain chat box. It is organized around the AILIS avatar:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 63 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 64 | <code>- the user sends a message</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 65 | <code>- the backend returns streaming text</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 66 | <code>- the avatar enters a speaking state</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 67 | <code>- text appears progressively</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 68 | <code>- fallback lip sync follows the estimated speaking rhythm</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 69 | <code>- expressions and actions change through controlled interfaces</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 70 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 71 | <code>GitHub Pages is a good home for this layer because it doubles as a project homepage. A visitor can open the link and immediately see the character, interaction model, and overall polish.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 72 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 73 | <code>## Source code and desktop packages</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 74 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 75 | <code>The source code is available here:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 76 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 77 | <code>[https://github.com/haowenGuo/AILIS](https://github.com/haowenGuo/AILIS)</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 78 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 79 | <code>The desktop version also has an Electron packaging path. According to the project README, Windows packages can be generated with:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 80 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 81 | <code>```bash</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 82 | <code>pnpm desktop:package</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 83 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 84 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 85 | <code>The generated files are written to `release/`, including installer, portable, and unpacked versions.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 86 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 87 | <code>I do not want the auto-blogging job to upload local installers automatically. A public binary should be checked for version, size, dependencies, and redistribution safety first. For now, the better path is to document the packaging command, then publish official downloads through GitHub Releases once a stable build is ready.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 88 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 89 | <code>## What changed after deployment</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 90 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 91 | <code>Deployment changes the nature of the project.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 92 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 93 | <code>AILIS is no longer just “something that runs on my machine.” It becomes:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 94 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 95 | <code>- a live web experience</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 96 | <code>- a demo that can be shared with classmates or interviewers</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 97 | <code>- a product-like project with a visible iteration trail</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 98 | <code>- a backend platform that can keep growing through APIs</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 99 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 100 | <code>That is why the blog system and publishing guide matter. Once a project is online, it needs more than code. It needs documentation, public explanation, iteration notes, and a way for people to follow the work.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 101 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 102 | <code>## Next steps</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 103 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 104 | <code>The next improvements are less about adding random features and more about tightening the loop:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 105 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 106 | <code>- reduce cold-start and model-call latency</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 107 | <code>- improve streaming output and avatar speaking state</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 108 | <code>- prepare a clean public desktop release</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 109 | <code>- keep turning project iterations into blog posts</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 110 | <code>- decide which source, assets, and model resources are safe to distribute</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 111 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 112 | <code>The current deployment is not complicated, but it changes AILIS from a local AI avatar experiment into something people can open, experience, understand, and follow.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
