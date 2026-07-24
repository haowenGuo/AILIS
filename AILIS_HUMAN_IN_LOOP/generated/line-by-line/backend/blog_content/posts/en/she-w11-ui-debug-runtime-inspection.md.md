# backend/blog_content/posts/en/she-w11-ui-debug-runtime-inspection.md 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。
- 文件类型：`documentation`
- 原始行数：58
- SHA-256：`e48b9f65d7456fa5f2210a79cf661b799d978829c05cfd5553f2f4f19b878144`
- 可运行副本：[打开源文件](../../../../../../source/backend/blog_content/posts/en/she-w11-ui-debug-runtime-inspection.md)
- 依赖：未从静态文本识别到显式依赖
- 主要符号：`runtime`

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code># SHE W11: Turning UI + Debug Tools into a Runtime Inspection Surface</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 2 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3 | <code>SHE’s first ten workstreams have already separated the 2D engine skeleton into clearer runtime layers. Gameplay Core owns commands, events, and timers. Data Core owns schemas. Diagnostics and AI Context explain frames. Scene/ECS, Assets, Platform, Renderer2D, Physics2D, and Audio Runtime gradually fill in the systems needed for a running world.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 4 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5 | <code>W11 UI + Debug Tools sits in a different position. It is not the player-facing menu system, and it is not a full editor. It is the tooling plane: once runtime systems have something worth observing, W11 uses debug overlays, panels, runtime counters, traces, scene/physics/render inspection hooks, and sandbox entry points to make engine state readable to both developers and Codex.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 6 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 7 | <code>## Debug UI Should Not Arrive Before the Systems It Inspects</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 8 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 9 | <code>`MODULE_PRIORITY.md` places W11 in Wave D because debug visibility becomes high leverage after runtime systems exist to inspect. That ordering is practical. If UI arrives too early, the project gets empty panels. If it arrives too late, renderer, physics, audio, and scene problems stay hidden in logs and guesswork.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 10 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 11 | <code>So W11 is not mainly about adding windows. It is about visualizing the runtime contracts that already exist. W03 defines frame traces and the latest frame diagnostics report. W08 provides renderer frame submission. W09 provides fixed-step physics and collision callbacks. W10 provides audio update and gameplay feedback boundaries. W11 should bring those observable signals into one debug surface instead of letting each module invent temporary output.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 12 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 13 | <code>That also explains why the docs place W11 beside `W04 Scripting Host` in the higher-level authoring and inspection stage. Scripting improves gameplay iteration speed, while Debug Tools improve observation and diagnosis speed. Both should sit on top of clear runtime contracts.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 14 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 15 | <code>## `IUiService` Owns the UI Frame Boundary</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 16 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 17 | <code>The AI-native refactor document lists `IUiService` as a first-class runtime service. Its current bootstrap implementation is `NullUiService`, and its responsibility is debug/runtime UI frame ownership. That wording matters: UI should not be a few ImGui calls hidden inside the renderer. It needs its own frame boundary.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 18 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 19 | <code>In the frame flow, UI runs after renderer and before audio: `Renderer.BeginFrame / OnRender / SubmitSceneSnapshot / EndFrame`, then `UI.BeginFrame / OnUi / EndFrame`, then `Audio.Update`, `AI.RefreshContext`, and `Diagnostics.EndFrame`.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 20 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 21 | <code>This sequence gives W11 a clear role. UI can show the scene snapshot, render submissions, physics/debug state, gameplay digest, and diagnostics trace that already exist for the current frame. But it should not quietly become a second gameplay mutation path. Any interaction that changes runtime state should go through existing gameplay command, event, data, or service contracts instead of directly rewriting internal objects.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 22 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 23 | <code>## The First Panels Should Serve Inspection, Not Editor Ambition</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 24 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 25 | <code>The tech stack document points future UI toward `Dear ImGui` plus a simple runtime HUD layer because it is a fast path to debug HUDs, inspector panels, profiling views, and scene or asset inspection. The important phrase is “fast path to useful tooling,” not “build the whole editor immediately.”</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 26 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 27 | <code>For W11, the first high-value surfaces can stay plain:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 28 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 29 | <code>- runtime counters: frame index, delta time, entity count, asset count, schema count, active feature count</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 30 | <code>- diagnostics panel: latest frame phase list, phase count, and whether gameplay activity was captured</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 31 | <code>- scene inspector: active scene, entity summary, and transform or component summaries</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 32 | <code>- render/physics view: sprite submission count, camera state, body/collider count, and recent collision events</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 33 | <code>- audio/debug event view: recent gameplay-triggered audio events and channel/group summaries</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 34 | <code>- AI context preview: whether the current authoring context contains the required sections</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 35 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 36 | <code>These panels do not need to be visually sophisticated at first. Their value is making hidden state scannable so a developer can answer: what happened this frame, whether a system is wired through the standard contract, and whether Codex can understand the current state from public context.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 37 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 38 | <code>## The Sandbox Is the Right Landing Place</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 39 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 40 | <code>The Multi-Codex launch plan gives W11 clear ownership: `Engine/UI/*`, debug-tooling tests, and selected sandbox debug integration. In other words, W11 should define the UI service boundary and also provide a non-shipping runtime entry point where the tools can be exercised.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 41 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 42 | <code>The README already describes `Tools/Sandbox` as the engine inspection executable. That makes the sandbox the natural landing place for W11. It can host debug overlays, inspection panels, and smoke-level integration without pushing tooling logic into the shipping game entry point. This validates the UI service frame lifecycle while keeping gameplay code and tooling code separate.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 43 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 44 | <code>That separation matters over time. Debug UI may inspect engine internals more aggressively than the game, but it still should not become a dumping ground for engine responsibility. Information that needs to stabilize should become a service contract, diagnostics report, reflection metadata entry, or AI context section. The panel is only the visualization layer.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 45 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 46 | <code>## W11 Still Needs Tests</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 47 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 48 | <code>The docs require every workstream to include focused smoke tests. For UI/debug tools, the point is not necessarily pixel-perfect screenshot testing. The useful target is contract and lifecycle behavior.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 49 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 50 | <code>The project can test whether `IUiService` enters a frame in begin/on/end order, whether debug panels can read stable summaries from diagnostics, scene, assets, physics, or render state, whether sandbox integration avoids forbidden dependency directions, and whether AI context refresh still happens after UI and audio but before diagnostics closes the frame.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 51 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 52 | <code>Those tests keep Debug Tools from becoming “a window that opens during development” and make them part of SHE’s AI-native architecture. Like W03 diagnostics, W05 scene modeling, W08 rendering, W09 physics, and W10 audio, W11 should have contracts that an integrator can review.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 53 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 54 | <code>## Closing</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 55 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 56 | <code>W11 UI + Debug Tools moves SHE’s runtime explanation layer from documents and logs into an interactive inspection surface. It should stabilize `IUiService` frame ownership, use Dear ImGui and a runtime HUD as the future implementation direction, expose debug overlays and inspection panels through the sandbox, and bring runtime counters, traces, scene/physics/render state, and AI context previews into one scannable surface.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 57 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 58 | <code>It should not rush into becoming a full editor, and it should not bypass gameplay, data, diagnostics, or AI context contracts. A good W11 helps every later Codex session and developer guess less: open the debug surface and see what this frame, this scene, these assets, and these systems are actually doing.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
