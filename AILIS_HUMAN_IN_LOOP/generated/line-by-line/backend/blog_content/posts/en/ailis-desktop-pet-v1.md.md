# backend/blog_content/posts/en/ailis-desktop-pet-v1.md 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。
- 文件类型：`documentation`
- 原始行数：82
- SHA-256：`b93ef4e03a911fc47facabeb23a7d2e55d3bb0fabc8ca4ab042f12d85827f257`
- 可运行副本：[打开源文件](../../../../../../source/backend/blog_content/posts/en/ailis-desktop-pet-v1.md)
- 依赖：未从静态文本识别到显式依赖
- 主要符号：未从静态文本识别到命名符号

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code># AILIS Desktop Pet V1: From Web Avatar to Resident Companion</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 2 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3 | <code>This iteration is important not because AILIS now runs inside Electron, but because it finally behaves like a desktop product instead of a browser demo inside a shell.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 4 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5 | <code>At this point, AILIS is no longer only a 3D character on a web page. She can stay on the desktop, open a chat window on demand, and respond with animation, expression, and speech-aware interaction.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 6 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 7 | <code>## What actually shipped in this version</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 8 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 9 | <code>- A frameless transparent pet window that stays on top</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 10 | <code>- A separate chat window opened by clicking the character</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 11 | <code>- A right-click control menu for chat, scale, speech mode, and quit</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 12 | <code>- A system tray entry for visibility and desktop behavior</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 13 | <code>- Persisted window position, scale, and visibility state</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 14 | <code>- A shared VRM runtime and shared backend chat flow between web and desktop</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 15 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 16 | <code>That is the point where AILIS stops being only a character prototype and starts becoming a usable desktop companion.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 17 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 18 | <code>## How I handled speech in this version</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 19 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 20 | <code>I split speech into two layers.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 21 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 22 | <code>The first layer is output, meaning how the character speaks back.  </code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 23 | <code>The desktop build currently supports three modes:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 24 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 25 | <code>- server-side AI voice</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 26 | <code>- local lightweight voice</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 27 | <code>- voice off, with text and motion only</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 28 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 29 | <code>The second layer is input, meaning how the user speaks to the character.  </code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 30 | <code>For this version, I focused on a manual local speech-recognition path on desktop. The goal was not to imitate a full voice assistant yet. The goal was to make the core loop work reliably: record, transcribe, and send the text back into the conversation.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 31 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 32 | <code>That split keeps the desktop experience lightweight while giving more control over the most environment-sensitive parts of the product.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 33 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 34 | <code>## Why desktop cannot be treated like the web</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 35 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 36 | <code>After shipping this pass, one thing became very obvious: a desktop pet is not just a web app with a wrapper.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 37 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 38 | <code>The hard parts are usually the details:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 39 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 40 | <code>- whether the window is transparent, always on top, and still draggable</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 41 | <code>- whether the tray and right-click controls feel natural</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 42 | <code>- how the pet window and chat window stay in sync</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 43 | <code>- whether voice, rendering, and input devices block each other</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 44 | <code>- what closing a window should mean: hide, minimize, or quit</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 45 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 46 | <code>None of these decisions looks dramatic on its own, but together they decide whether the character feels like a real desktop pet or just a webpage packaged with Electron.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 47 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 48 | <code>## The structure behind this version</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 49 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 50 | <code>I did not rewrite the existing runtime from scratch. Instead, I kept the VRM renderer and chat flow, then added an Electron desktop shell around them.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 51 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 52 | <code>The system is now split into three parts:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 53 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 54 | <code>1. Electron main process  </code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 55 | <code>   Handles the pet window, chat window, tray, context menu, state persistence, and local speech-recognition worker orchestration.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 56 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 57 | <code>2. Frontend runtime  </code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 58 | <code>   Handles avatar rendering, motion, expression, lip sync, streaming messages, and chat interaction.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 59 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 60 | <code>3. FastAPI backend  </code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 61 | <code>   Handles the main conversation, memory compression, and server-side voice endpoints.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 62 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 63 | <code>This keeps the core avatar experience shared between web and desktop, while the desktop version only adds platform-specific logic where it actually matters.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 64 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 65 | <code>## What kind of product this feels like now</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 66 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 67 | <code>The most accurate way to describe AILIS at this stage is no longer “a chat page.” It is becoming a lightweight virtual companion system in desktop-pet form:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 68 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 69 | <code>- it stays on the desktop</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 70 | <code>- it opens chat when needed</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 71 | <code>- it responds with more than text</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 72 | <code>- it is starting to feel suitable for long-term companionship instead of short demos</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 73 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 74 | <code>That shift matters because it changes how I think about future work. The next steps are less about stacking features and more about improving presence, stability, and resource use.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 75 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 76 | <code>## Closing thoughts</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 77 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 78 | <code>The most valuable part of this iteration is that AILIS has crossed from prototype territory into something closer to a product.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 79 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 80 | <code>It already has the basic shape of a desktop pet, while still keeping the most important parts of the original virtual-character experience: personality, movement, and conversation.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 81 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 82 | <code>From here, the interesting work is not making the interface more complex. It is making the character lighter, steadier, and more natural to live with on a real desktop.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
