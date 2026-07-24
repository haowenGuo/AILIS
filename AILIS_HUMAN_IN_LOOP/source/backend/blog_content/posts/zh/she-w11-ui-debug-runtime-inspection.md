# SHE W11：把 UI + Debug Tools 做成运行时检查界面

SHE 的前十个工作流已经把 2D 引擎骨架拆成了比较清楚的运行时层：Gameplay Core 负责命令、事件和计时器，Data Core 负责 schema，Diagnostics 和 AI Context 负责解释帧，Scene/ECS、Assets、Platform、Renderer2D、Physics2D 和 Audio Runtime 逐步补上可运行世界所需的基础系统。

W11 UI + Debug Tools 的位置很特别。它不是面向玩家的菜单系统，也不是完整编辑器，而是一个 tooling plane：在运行时系统已经有东西可观察之后，用 debug overlay、panel、runtime counters、traces、scene/physics/render inspection hooks 和 sandbox entry points，把引擎状态变成开发者和 Codex 都能读懂的界面。

## Debug UI 不能早于被检查的系统

`MODULE_PRIORITY.md` 把 W11 排在 Wave D，理由是 debug visibility 在 runtime systems 存在之后才有高杠杆价值。这是一个很务实的顺序。太早做 UI，很容易只得到一组空面板；太晚做 UI，renderer、physics、audio 和 scene 的问题又会长期藏在日志和猜测里。

因此 W11 的核心不是“加几个窗口”，而是把已有运行时契约可视化。W03 已经定义 frame trace 和 latest frame diagnostics report，W08 提供 renderer frame submission，W09 提供 fixed-step physics 与 collision callbacks，W10 提供 audio update 与玩法反馈边界。W11 应该把这些系统的可观察信息汇到同一个调试表面，而不是让每个模块各自发明一套临时输出。

这也解释了为什么文档把 W11 放在 `W04 Scripting Host` 同一个更高层次的 authoring and inspection 阶段。脚本提高玩法迭代速度，Debug Tools 提高观察和定位速度；两者都应该建立在清晰 runtime contracts 之上。

## `IUiService` 是帧所有权边界

AI-native refactor 文档把 `IUiService` 列为一等 runtime service，当前 bootstrap 实现是 `NullUiService`，职责是 debug/runtime UI frame owner。这个描述很关键：UI 层不是随便在 renderer 里插入几个 ImGui 调用，而是要有自己的 frame ownership。

在 frame flow 中，UI 位于 renderer 之后、audio 之前：`Renderer.BeginFrame / OnRender / SubmitSceneSnapshot / EndFrame` 之后进入 `UI.BeginFrame / OnUi / EndFrame`，随后是 `Audio.Update`、`AI.RefreshContext` 和 `Diagnostics.EndFrame`。

这个顺序给 W11 划出了清楚边界。UI 可以展示本帧已经形成的 scene snapshot、render submissions、physics/debug state、gameplay digest 和 diagnostics trace；但它不应该偷偷成为 gameplay mutation 的第二入口。需要改变运行时状态的交互，应当通过已有 gameplay command、event、data 或 service contract 表达，而不是绕过架构直接改内部对象。

## 第一版面板应该服务于检查，而不是编辑器野心

Tech Stack 文档把未来 UI 指向 `Dear ImGui` 和 simple runtime HUD layer，理由是它能快速做 debug HUD、inspector panels、profiling views、scene and asset inspection。这里的重点是“快速有用”，不是立刻做完整关卡编辑器。

对 W11 来说，第一批高价值界面可以很朴素：

- runtime counters：帧号、delta time、entity count、asset count、schema count、active feature count
- diagnostics panel：最近一帧的 phase list、phase count、是否包含 gameplay activity
- scene inspector：当前 scene、entity summary、transform 或 component 摘要
- render/physics view：sprite submission 数、camera 状态、body/collider 数、最近 collision event
- audio/debug event view：最近 gameplay-triggered audio event、channel/group 摘要
- AI context preview：当前 authoring context 是否包含必要 section

这些面板并不需要一开始就漂亮。它们的价值在于把隐藏状态变成可扫描的信息，让开发者能快速回答“这一帧发生了什么”“这个系统有没有接入标准契约”“Codex 能不能从公开上下文理解当前状态”。

## Sandbox 是调试工具的落点

Multi-Codex launch plan 给 W11 的 ownership 很明确：`Engine/UI/*`、debug-tooling tests，以及 selected sandbox debug integration。也就是说，W11 既要建立 UI service 边界，也要找到一个非 shipping 的运行入口来展示工具。

README 里已经把 `Tools/Sandbox` 定义为 engine inspection executable。这让 sandbox 成为 W11 的自然落点：它可以承载 debug overlay、inspection panels 和 smoke-level integration，而不把这些工具逻辑塞进正式游戏入口。这样既能验证 UI service 的 frame lifecycle，也能保持 gameplay code 与 tooling code 的职责分离。

这种分离对长期维护很重要。Debug UI 可以更激进地读取 engine internals，但它仍然不应该变成 engine responsibility 的垃圾桶。真正应该稳定下来的信息，要沉淀成 service contract、diagnostics report、reflection metadata 或 AI context section；面板只是它们的可视化入口。

## W11 也要被测试

文档要求每个 workstream 都要有聚焦的 smoke tests。对 UI/debug tools 来说，测试的重点不一定是像素级截图，而是 contract 和 lifecycle。

可测试的问题包括：`IUiService` 是否能按 begin/on/end 的顺序进入一帧，debug panels 是否能从 diagnostics、scene、asset、physics 或 render summary 读取稳定数据，sandbox integration 是否不引入 forbidden dependency direction，AI context refresh 是否仍在 UI 和 audio 之后、diagnostics end frame 之前保持清楚顺序。

这些测试让 Debug Tools 不只是“开发时能打开的窗口”，而是 SHE AI-native 架构的一部分。它要和 W03 的 diagnostics、W05 的 scene model、W08 的 renderer、W09 的 physics、W10 的 audio 一样，拥有能被集成者复查的契约。

## 小结

W11 UI + Debug Tools 的意义，是把 SHE 的运行时解释能力从文档和日志推进到可交互的检查界面。它应该用 `IUiService` 稳定 frame ownership，用 Dear ImGui 和 runtime HUD 作为未来实现方向，通过 sandbox 展示 debug overlay 和 inspection panels，并把 runtime counters、traces、scene/physics/render 状态和 AI context preview 汇成一套可扫描的调试表面。

它不应该急着变成完整编辑器，也不应该绕过 gameplay、data、diagnostics 或 AI context 契约。真正好的 W11，是让每个后续 Codex 和开发者都能少猜一点：打开调试界面，就能看见这一帧、这个场景、这些资源和这些系统到底处在什么状态。
