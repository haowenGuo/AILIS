# README.de.md 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。
- 文件类型：`documentation`
- 原始行数：173
- SHA-256：`27c57609eb5e7ed54231e4b6ac52b2468ed479c82846be367486230a09f67ce5`
- 可运行副本：[打开源文件](../../source/README.de.md)
- 依赖：未从静态文本识别到显式依赖
- 主要符号：未从静态文本识别到命名符号

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code>&lt;div align="center"&gt;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 2 | <code>  &lt;h1&gt;AILIS Assistant&lt;/h1&gt;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 3 | <code>  &lt;p&gt;&lt;strong&gt;Ein Open-Source-Desktop-Assistent mit verkörperter KI, VRM-Charakter, Echtzeitstimme, visuellem Kontext, Gedächtnis und Codex-artigem Agent Harness.&lt;/strong&gt;&lt;/p&gt;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 4 | <code>  &lt;p&gt;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 5 | <code>    &lt;img alt="Version" src="https://img.shields.io/badge/version-1.1.0-2563eb?style=for-the-badge"&gt;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 6 | <code>    &lt;img alt="Runtime" src="https://img.shields.io/badge/runtime-Electron-0f172a?style=for-the-badge"&gt;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 7 | <code>    &lt;img alt="License" src="https://img.shields.io/badge/license-MIT-059669?style=for-the-badge"&gt;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 8 | <code>  &lt;/p&gt;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 9 | <code>  &lt;p&gt;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 10 | <code>    &lt;a href="README.md"&gt;English&lt;/a&gt; ·</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 11 | <code>    &lt;a href="README.zh-CN.md"&gt;简体中文&lt;/a&gt; ·</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 12 | <code>    &lt;a href="README.ja.md"&gt;日本語&lt;/a&gt; ·</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 13 | <code>    &lt;a href="README.ko.md"&gt;한국어&lt;/a&gt; ·</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 14 | <code>    &lt;a href="README.fr.md"&gt;Français&lt;/a&gt; ·</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 15 | <code>    &lt;a href="README.de.md"&gt;Deutsch&lt;/a&gt;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 16 | <code>  &lt;/p&gt;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 17 | <code>&lt;/div&gt;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 18 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 19 | <code>---</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 20 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 21 | <code>## Was ist AILIS</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 22 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 23 | <code>AILIS Assistant ist ein desktop-first Assistent mit verkörperter KI. Das Projekt verbindet einen 3D-VRM-Charakter, Electron-Desktopfenster, Sprachinteraktion, visuellen Kontext aus Screenshots, Gedächtnis und einen strukturierten Agent Runtime.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 24 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 25 | <code>AILIS ist kein einfacher Web-Chatbot. Ziel ist ein persönlicher Desktop-Assistent, der mit dem Nutzer sprechen, bei Erlaubnis den Bildschirmkontext verstehen, nützliche Präferenzen behalten und Aufgaben über explizite, auditierbare Tools ausführen kann.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 26 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 27 | <code>## Projektausrichtung</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 28 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 29 | <code>AILIS verbindet eine ausdrucksstarke Charakterebene mit zuverlässiger Aufgabenausführung.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 30 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 31 | <code>- Eine Charakterebene mit Präsenz, Ausdrücken, Bewegungen, Stimme und Beziehungsgefühl.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 32 | <code>- Ein Agent Harness für Planung, Tool-Routing, Genehmigungen, Evidence Logs und Recovery.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 33 | <code>- Ein local-first Desktop Runtime, bei dem Einstellungen, Gedächtnis, Logs und Modellkonfiguration beim Nutzer bleiben.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 34 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 35 | <code>## Aktuelle Fähigkeiten</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 36 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 37 | <code>- VRM-Desktopcharakter mit Ausdrücken, Bewegungen, Lip Sync und Dialogblasen.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 38 | <code>- Electron-Pet-Fenster, Chatfenster, Control Panel, Tray-Integration und lokaler persistenter Zustand.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 39 | <code>- Konfiguration OpenAI-kompatibler Modellanbieter, inklusive eigener base URL und lokaler Modell-Workflows.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 40 | <code>- Desktop-TTS-Worker, Cloud-Voice-Pfade und optionaler lokaler Spracherkennungs-Worker.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 41 | <code>- Berechtigungsbewusster visueller Kontext über Screenshot-, Fenster- und Region-Capture.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 42 | <code>- Memory Blocks, Projektkontext, Beziehungszustand und leichte Reflection.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 43 | <code>- Tool-Layer für Dateien, Code, Computeraktionen, E-Mail, MCP Skills, Web/Search und lokale Runtime-Utilities.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 44 | <code>- Explizites Genehmigungsmodell für Aktionen, die Dateien, Apps, Konten oder externe Dienste betreffen.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 45 | <code>- Humanlike Experience Evals, Tool-Contract-Tests, Gateway Checks und Agent Execution Smoke Tests.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 46 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 47 | <code>## Architektur</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 48 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 49 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 50 | <code>Nutzer / Stimme / Bildschirm</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 51 | <code>        &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 52 | <code>        v</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 53 | <code>AILIS Desktop UI</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 54 | <code>  - VRM-Charakter</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 55 | <code>  - Chatfenster</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 56 | <code>  - Control Panel</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 57 | <code>        &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 58 | <code>        v</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 59 | <code>Agent Harness</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 60 | <code>  - planner</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 61 | <code>  - tool router</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 62 | <code>  - approval gate</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 63 | <code>  - evidence log</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 64 | <code>  - recovery loop</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 65 | <code>        &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 66 | <code>        v</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 67 | <code>Runtime Services</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 68 | <code>  - model providers</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 69 | <code>  - voice / ASR / TTS</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 70 | <code>  - vision capture</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 71 | <code>  - memory store</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 72 | <code>  - local tools / MCP</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 73 | <code>        &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 74 | <code>        v</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 75 | <code>Validation</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 76 | <code>  - tests</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 77 | <code>  - evals</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 78 | <code>  - smoke checks</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 79 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 80 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 81 | <code>## Repository-Struktur</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 82 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 83 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 84 | <code>electron/   Electron Main Process, Preload Bridge, Runtime Services, lokale Tool-Adapter</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 85 | <code>src/        Renderer Apps für Pet, Chat, Control Panel, Voice, Vision UI und Bubbles</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 86 | <code>backend/    Optionales FastAPI Backend, API Schemas, Memory Services und statische Assets</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 87 | <code>Resources/  VRM Model, VRMA Motions, Reference Audio und Character Assets</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 88 | <code>docs/       Architektur, Memory Design, Tool Ecosystem, Evaluation und Release Planning</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 89 | <code>evals/      Humanlike Experience Szenarien und Long-Term Companionship Eval-Daten</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 90 | <code>scripts/    Runtime Preparation, Validation, Smoke Tests, Benchmarks und Packaging Helpers</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 91 | <code>tests/      Tests für Runtime, Memory, Tools, Contracts, Gateway und Agent Behavior</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 92 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 93 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 94 | <code>## Schnellstart</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 95 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 96 | <code>```bash</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 97 | <code>pnpm install</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 98 | <code>pnpm desktop:dev</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 99 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 100 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 101 | <code>Bauen und starten:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 102 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 103 | <code>```bash</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 104 | <code>pnpm desktop:start</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 105 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 106 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 107 | <code>Windows Desktop App packen:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 108 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 109 | <code>```bash</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 110 | <code>pnpm desktop:package</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 111 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 112 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 113 | <code>Optionales Backend:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 114 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 115 | <code>```bash</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 116 | <code>python -m venv .venv</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 117 | <code>.venv\Scripts\activate</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 118 | <code>pip install -r requirements.txt</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 119 | <code>copy backend\.env.example backend\.env</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 120 | <code>python -m uvicorn backend.main:app --reload</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 121 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 122 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 123 | <code>## Modell- und Sprachkonfiguration</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 124 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 125 | <code>AILIS ist auf Anwendungsebene nicht an einen einzelnen Modellanbieter gebunden. Die Konfiguration erfolgt über das Desktop Control Panel oder lokale Environment-Dateien.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 126 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 127 | <code>- OpenAI-kompatible Cloud-Anbieter.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 128 | <code>- Lokale vLLM Endpoints.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 129 | <code>- Ollama-orientierte lokale Workflows.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 130 | <code>- Eigene base URL, model name, timeout und private API keys.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 131 | <code>- Optionale Vorbereitung von local ASR und desktop TTS runtime.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 132 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 133 | <code>Committen Sie niemals echte API keys, Zugangsdaten, Chat-Transkripte, lokale Modell-Caches, Runtime Logs oder generierte Eval-Ergebnisse.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 134 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 135 | <code>## Nützliche Befehle</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 136 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 137 | <code>```bash</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 138 | <code>pnpm test:ailis-runtime</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 139 | <code>pnpm test:ailis-agent</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 140 | <code>pnpm test:ailis-tool-contracts</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 141 | <code>pnpm test:ailis-memory</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 142 | <code>pnpm ailis:validate-harness</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 143 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 144 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 145 | <code>Vollständige Gateway-Validierung:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 146 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 147 | <code>```bash</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 148 | <code>pnpm ailis:validate-gateway</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 149 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 150 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 151 | <code>## Wichtige Dokumente</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 152 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 153 | <code>- [Embodied Agent Architecture](docs/ailis-embodied-agent-architecture.md)</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 154 | <code>- [Memory Architecture V2](docs/ailis-memory-architecture-v2.md)</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 155 | <code>- [Humanlike Eval](docs/ailis-humanlike-eval.md)</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 156 | <code>- [Tool Ecosystem Driver Guide](docs/tool-ecosystem-driver-guide.md)</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 157 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 158 | <code>## Projektstatus</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 159 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 160 | <code>Aktuelle Release-Linie: `v1.1.0`.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 161 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 162 | <code>AILIS wird aktiv entwickelt. Desktop Runtime, Agent Harness, Tool-Layer und Evaluation Surface sind bereits substanziell, das Projekt sollte aber noch als Alpha-Produkt/Runtime und nicht als production-grade Agent OS betrachtet werden. Kurzfristige Prioritäten sind klarere Tool Contracts, sicherere Genehmigungen, bessere Memory-Qualität, einfachere lokale Modellkonfiguration und robustere End-to-End-Evaluation.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 163 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 164 | <code>## Datenschutz und Sicherheit</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 165 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 166 | <code>- Vision Capture ist berechtigungsbewusst und dient dem Kontextverständnis.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 167 | <code>- Aktionen, die Dateien, Apps, Konten oder externe Dienste betreffen, müssen explizit genehmigt werden.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 168 | <code>- Memory und Runtime State bleiben lokal, sofern der Nutzer nichts anderes wählt.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 169 | <code>- Secrets gehören in lokale Konfiguration, niemals ins Repository.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 170 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 171 | <code>## Lizenz</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 172 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 173 | <code>Der AILIS source code steht unter der [MIT License](LICENSE). Einige gebündelte oder Drittanbieter-Assets, Modelle, Motions und Voice-Ressourcen können eigene Lizenzen haben; prüfen Sie die asset-spezifischen Hinweise vor einer Weiterverteilung.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
