# SHE W12：用第一个可玩 Vertical Slice 验证整条引擎链路

SHE 前面的工作流一直在搭骨架：Gameplay Core 定义命令、事件和计时器，Data Core 稳定 schema-first 数据契约，Diagnostics 与 AI Context 让每一帧可解释，Scene、Assets、Platform、Renderer2D、Physics2D、Audio 和 UI Debug 逐步补齐运行时所需的系统边界。

W12 First Vertical Slice Game 的意义，是把这些边界拉到同一个小型可玩循环里验证。它不是再写一个孤立模块，而是回答一个更直接的问题：这套 AI-native 2D 引擎骨架，能不能承载一个从输入、移动、碰撞、收集、失败、胜利、音频反馈到调试可见性的完整玩法闭环？

## Vertical Slice 要小，但必须完整

`MILESTONES.md` 把 M6 定义为 Vertical Slice Game：完成一个小而完整的 game loop，使用引擎官方的 gameplay、data、diagnostics 和 AI-native workflows，并证明 Codex 可以快速扩展玩法而不需要重写架构。

W12 的 feature README 给出的玩家循环很明确：玩家用 `WASD` 或方向键移动，收集三个 signal cores，避开红色 patrol drones，胜负后按 `R` 重新开始，按 `Esc` 退出。

这个目标刻意保持很小。它不需要复杂关卡、不需要大量内容，也不需要完整编辑器。但它必须真的从头跑到尾：玩家有输入，世界里有目标和危险，状态会变化，游戏有结束条件，失败和胜利之后能回到可重试状态。

这类 vertical slice 的价值不在内容量，而在链路完整性。只要其中一个系统边界没有打通，循环就会立刻暴露问题：输入不能驱动 gameplay，collision 不能转成事件，数据不能描述 feature，audio 不能响应 gameplay，debug UI 或 AI context 看不到真实状态，都会让这个小循环断掉。

## 它验证的是系统之间的连接

W12 的 feature README 列出的 engine surfaces 很有代表性：

- gameplay commands、events 和 timers
- feature-owned schema registration 和 authored records
- script-module registration 以及 command-routed invocation
- scene entities 和 renderer-driven sprite submission
- Box2D-backed sensor collisions，用于 pickup 和 fail states
- gameplay-routed audio playback
- shared debug/UI/AI context exports

这些点不是一串功能清单，而是前面 W01-W11 的集成考试。W01 定义 gameplay 活动怎么进入系统；W02 让玩法数据有 schema 和 record；W03 让 frame diagnostics 与 AI context 能解释发生了什么；W05 和 W08 让实体与 sprite 进入可见世界；W09 让碰撞参与玩法；W10 让音频成为 gameplay feedback；W11 则把运行时检查界面接到标准服务上。

所以 W12 不应该绕过这些契约。比如收集 signal core 不应只是 feature 内部随手改一个局部变量，而应当能通过 command/event/timer 或 gameplay digest 被观察。撞到 patrol drone 不应只是渲染层的特殊判断，而应当沿着 physics sensor、collision callback、gameplay event 和 diagnostics report 形成可追踪路径。

这样的限制会让第一版实现更朴素，但它保留了长期可维护性。一个可玩的 vertical slice 如果依赖隐藏通道才跑起来，说明前面的架构没有真正承接玩法；一个可玩的 vertical slice 如果能全部走标准服务，才说明引擎 spine 开始成立。

## Feature 边界让 Codex 不需要猜

SHE 的玩法组织方式不是一个越来越大的 `Game/Source` 目录，而是 `Game/Features/<FeatureName>/`。feature index 说明每个 feature 应该拥有自己的 layer 或 systems、data schemas、authoring notes 和 tests。这个形状对 AI-assisted development 很关键：Codex 可以被指向一个明确 feature 目录和相关 engine service contracts，而不是在整个工程里猜哪些文件属于本次任务。

W12 正好是这种设计的检验场。Vertical Slice Feature 既要足够独立，能作为一个玩法闭环被阅读；又要足够集成，不能把数据、输入、碰撞、渲染、音频和诊断全部私有化。

对后续扩展来说，这会形成一个很有用的模板。以后如果要增加新的拾取物、敌人行为、关卡规则或脚本触发点，理想路径不是从零理解整个引擎，而是沿着 W12 已经踩过的 feature boundary：注册 metadata，声明 schema，把输入或碰撞转成 gameplay event，刷新 diagnostics 和 AI context，再用 focused smoke tests 验证。

这也是 AI-native 架构的核心收益。它不是把 AI 当成外部聊天助手，而是让项目自身持续输出稳定上下文：feature metadata、schema catalog、data registry、gameplay digest、latest frame report 和 debug surface 都在告诉 Codex 当前玩法到底处在什么状态。

## 小游戏比大规划更容易暴露架构问题

很多引擎项目会在早期写很长的 roadmap，却迟迟不让玩家控制一个东西。SHE 的 W12 选择相反：在基础服务有了形状之后，用一个很小的 game loop 去逼迫架构接受现实。

这个现实包括几个问题：

- input 是否真的进入 gameplay，而不是停留在 platform 层
- scene entity 是否能被 renderer、physics、diagnostics 和 AI context 共同引用
- data schema 是否能描述 feature-owned authored records
- collision 是否能以稳定事件进入 gameplay flow
- audio 是否能作为 gameplay-triggered feedback，而不是孤立播放 API
- debug/UI 是否能展示运行时状态，而不是只显示空面板
- restart 是否能检验 scene、gameplay、physics、audio 和 timers 的生命周期

这些问题都很具体，也都很难靠文档完全证明。一个小的 vertical slice 能把它们压缩到同一条运行路径里。它会暴露命名不稳定、生命周期不清楚、服务接口缺参数、诊断信息不够、AI context 漏掉关键 section 等实际问题。

这也是为什么 W12 比“再补一个模块”更像阶段性收口。它把分散的 workstreams 变成玩家能感受到的东西，也把架构假设变成可以回归验证的行为。

## 测试和调试要跟着玩法一起出现

`ACCEPTANCE_CHECKLIST.md` 对 gameplay feature 的要求很明确：feature 要位于 `Game/Features/<FeatureName>/`，通过 reflection 注册 metadata，在数据契约变化时通过 DataService 注册 schemas，必要时使用 GameplayService 处理 commands、events 和 timers，并通过标准 engine contracts 更新 AI-visible context。

这意味着 W12 的验收不应该只看“能不能玩”。更好的验收问题是：这条玩法路径能不能被解释、被测试、被重启、被 Codex 继续扩展。

focused tests 可以覆盖胜负条件、pickup 计数、restart lifecycle、collision-to-event path、schema registration、AI context sections 和 diagnostics report。debug surface 则应该帮助开发者快速确认：当前收集了几个 signal cores，patrol drones 是否存在，最近一次碰撞事件是什么，游戏状态是 playing、won 还是 lost。

如果这些信息都只能靠读源码猜，W12 就没有完全达到 AI-native 的目标。真正理想的 W12，是玩家可以玩，开发者可以查，Codex 可以从公开上下文理解，并且下一轮 feature 修改不需要重开架构讨论。

## 小结

SHE W12 First Vertical Slice Game 是从“引擎骨架”走向“可玩证明”的关键一步。它用一个小型循环串起输入、移动、收集、危险、胜负、重启、渲染、物理、音频、debug UI 和 AI context，验证前面 W01-W11 建立的服务契约能不能共同工作。

它的重点不是内容规模，而是集成质量。一个玩家可以完成的小循环，一旦完全走官方 gameplay、data、diagnostics 和 AI-native workflows，就会成为后续玩法开发最重要的样板：少猜测，多契约；少临时通道，多可观察链路；少抽象承诺，多可运行证据。
