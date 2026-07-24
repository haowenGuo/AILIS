# README.fr.md 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。
- 文件类型：`documentation`
- 原始行数：173
- SHA-256：`da06c52ae0359d974c2b9af5177cac2f35742b573b8f5e1f5e8d58c0956526e4`
- 可运行副本：[打开源文件](../../source/README.fr.md)
- 依赖：未从静态文本识别到显式依赖
- 主要符号：未从静态文本识别到命名符号

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code>&lt;div align="center"&gt;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 2 | <code>  &lt;h1&gt;AILIS Assistant&lt;/h1&gt;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 3 | <code>  &lt;p&gt;&lt;strong&gt;Un assistant IA incarné pour desktop, open source, avec personnage VRM, voix temps réel, contexte visuel, mémoire et Agent Harness inspiré de Codex.&lt;/strong&gt;&lt;/p&gt;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
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
| 21 | <code>## Qu'est-ce qu'AILIS</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 22 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 23 | <code>AILIS Assistant est un assistant IA incarné conçu d'abord pour le desktop. Il réunit un personnage 3D VRM, des fenêtres Electron, l'interaction vocale, le contexte visuel basé sur des captures d'écran, la mémoire et un Agent Runtime structuré.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 24 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 25 | <code>AILIS n'est pas un simple chatbot web. Le projet vise un assistant personnel de bureau capable de parler avec l'utilisateur, de comprendre le contexte de l'écran avec permission, de retenir les préférences utiles et d'exécuter des tâches via des outils explicites et auditables.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 26 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 27 | <code>## Direction du projet</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 28 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 29 | <code>AILIS cherche à combiner l'expressivité d'un personnage et la fiabilité d'un système d'exécution.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 30 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 31 | <code>- Une couche personnage avec présence, expressions, mouvements, voix et continuité relationnelle.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 32 | <code>- Un Agent Harness pour planifier, router les outils, demander validation, journaliser les preuves et récupérer après erreur.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 33 | <code>- Un runtime desktop local-first où les paramètres, mémoires, logs et modèles restent sous le contrôle de l'utilisateur.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 34 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 35 | <code>## Capacités actuelles</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 36 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 37 | <code>- Personnage VRM desktop avec expressions, motions, lip sync et bulles de dialogue.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 38 | <code>- Fenêtre de mascotte Electron, fenêtre de chat, panneau de contrôle, intégration tray et état local persistant.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 39 | <code>- Configuration de fournisseurs de modèles compatibles OpenAI, avec base URL personnalisée et workflows locaux.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 40 | <code>- Workers TTS desktop, chemins de voix cloud et worker optionnel de reconnaissance vocale locale.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 41 | <code>- Contexte visuel avec permissions via captures d'écran, fenêtres et régions.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 42 | <code>- Blocs de mémoire, contexte de projet, état relationnel et réflexion légère.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 43 | <code>- Couche d'outils pour fichiers, code, actions ordinateur, email, compétences MCP, Web/Search et utilitaires locaux.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 44 | <code>- Modèle d'approbation explicite pour les actions affectant fichiers, applications, comptes ou services externes.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 45 | <code>- Évaluations d'expérience humaine, tests de contrats d'outils, vérifications Gateway et smoke tests d'agent.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 46 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 47 | <code>## Architecture</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 48 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 49 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 50 | <code>Utilisateur / Voix / Écran</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 51 | <code>        &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 52 | <code>        v</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 53 | <code>AILIS Desktop UI</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 54 | <code>  - Personnage VRM</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 55 | <code>  - Fenêtre de chat</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 56 | <code>  - Panneau de contrôle</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
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
| 81 | <code>## Structure du dépôt</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 82 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 83 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 84 | <code>electron/   Processus principal Electron, preload bridge, services runtime, adaptateurs d'outils locaux</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 85 | <code>src/        Applications renderer pour mascotte, chat, contrôle, voix, vision UI et bulles</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 86 | <code>backend/    Backend FastAPI optionnel, schémas API, services mémoire et assets statiques</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 87 | <code>Resources/  Modèle VRM, motions VRMA, audio de référence et assets personnage</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 88 | <code>docs/       Architecture, mémoire, écosystème d'outils, évaluation et planning de release</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 89 | <code>evals/      Scénarios d'expérience humaine et données d'évaluation long terme</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 90 | <code>scripts/    Préparation runtime, validation, smoke tests, benchmarks et packaging</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 91 | <code>tests/      Tests runtime, mémoire, outils, contrats, gateway et comportement agent</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 92 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 93 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 94 | <code>## Démarrage rapide</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 95 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 96 | <code>```bash</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 97 | <code>pnpm install</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 98 | <code>pnpm desktop:dev</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 99 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 100 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 101 | <code>Construire et lancer:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 102 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 103 | <code>```bash</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 104 | <code>pnpm desktop:start</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 105 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 106 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 107 | <code>Packager l'application Windows:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 108 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 109 | <code>```bash</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 110 | <code>pnpm desktop:package</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 111 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 112 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 113 | <code>Backend optionnel:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 114 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 115 | <code>```bash</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 116 | <code>python -m venv .venv</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 117 | <code>.venv\Scripts\activate</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 118 | <code>pip install -r requirements.txt</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 119 | <code>copy backend\.env.example backend\.env</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 120 | <code>python -m uvicorn backend.main:app --reload</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 121 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 122 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 123 | <code>## Modèles et voix</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 124 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 125 | <code>AILIS n'est pas lié à un fournisseur unique. La configuration peut se faire via le panneau de contrôle desktop ou les fichiers d'environnement locaux.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 126 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 127 | <code>- Fournisseurs cloud compatibles OpenAI.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 128 | <code>- Endpoints vLLM locaux.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 129 | <code>- Workflows locaux orientés Ollama.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 130 | <code>- Base URL, nom de modèle, timeout et clés privées personnalisés.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 131 | <code>- Préparation optionnelle du runtime ASR local et TTS desktop.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 132 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 133 | <code>Ne committez jamais de vraies clés API, identifiants, transcriptions, caches de modèles, logs runtime ou résultats d'évaluation générés.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 134 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 135 | <code>## Commandes utiles</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 136 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 137 | <code>```bash</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 138 | <code>pnpm test:ailis-runtime</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 139 | <code>pnpm test:ailis-agent</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 140 | <code>pnpm test:ailis-tool-contracts</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 141 | <code>pnpm test:ailis-memory</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 142 | <code>pnpm ailis:validate-harness</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 143 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 144 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 145 | <code>Validation Gateway complète:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 146 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 147 | <code>```bash</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 148 | <code>pnpm ailis:validate-gateway</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 149 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 150 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 151 | <code>## Documents clés</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 152 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 153 | <code>- [Embodied Agent Architecture](docs/ailis-embodied-agent-architecture.md)</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 154 | <code>- [Memory Architecture V2](docs/ailis-memory-architecture-v2.md)</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 155 | <code>- [Humanlike Eval](docs/ailis-humanlike-eval.md)</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 156 | <code>- [Tool Ecosystem Driver Guide](docs/tool-ecosystem-driver-guide.md)</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 157 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 158 | <code>## État du projet</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 159 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 160 | <code>Ligne de release actuelle : `v1.1.0`.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 161 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 162 | <code>AILIS est en développement actif. Le runtime desktop, l'Agent Harness, la couche d'outils et la surface d'évaluation sont déjà importants, mais le projet doit encore être considéré comme un product/runtime en phase alpha plutôt qu'un Agent OS de production. Les priorités immédiates sont les contrats d'outils, les validations plus sûres, une meilleure mémoire, une configuration locale plus fluide et des évaluations end-to-end plus solides.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 163 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 164 | <code>## Confidentialité et sécurité</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 165 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 166 | <code>- La capture visuelle est basée sur la permission et sert à comprendre le contexte.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 167 | <code>- Les actions qui affectent fichiers, applications, comptes ou services externes doivent passer par une approbation explicite.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 168 | <code>- La mémoire et l'état runtime restent locaux sauf choix contraire de l'utilisateur.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 169 | <code>- Les secrets doivent rester dans la configuration locale, jamais dans le dépôt.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 170 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 171 | <code>## Licence</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 172 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 173 | <code>Le code source d'AILIS est publié sous [MIT License](LICENSE). Certains assets, modèles, motions ou ressources vocales inclus ou tiers peuvent avoir leurs propres licences; vérifiez les notes associées avant redistribution.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
