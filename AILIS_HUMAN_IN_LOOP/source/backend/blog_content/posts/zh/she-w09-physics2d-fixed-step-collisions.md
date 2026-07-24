# SHE W09：把 Physics2D 做成固定步长与碰撞事件边界

SHE 的 W08 Renderer2D 已经把“世界如何显示出来”放到了清晰的提交路径上。W09 Physics2D 接着处理另一个让 2D 引擎真正可玩的核心问题：对象如何稳定运动、碰撞如何进入玩法、模拟步骤由谁拥有。

公开文档把 W09 放在 Wave C，也就是 playable runtime 阶段。它不是给项目随手加一个物理库，而是要把 Box2D、body/collider 生命周期、fixed-step simulation 和 collision callbacks 放进 SHE 已经建立好的 runtime service、scene、gameplay、diagnostics 与 AI context 边界里。

## 为什么物理必须先有边界

SHE 当前仍是一个可编译的架构骨架，README 明确说复杂渲染和物理代码还在后续阶段。这个顺序是合理的：物理系统一旦直接散落在 gameplay、scene 或 renderer 中，后面很难再把确定性、调试和事件流理清楚。

W09 的第一层价值，就是让 `IPhysicsService` 成为固定步长模拟的拥有者。上层不应该直接操控 Box2D world，也不应该把碰撞处理藏在某个 feature 的私有回调里。它们应该通过稳定的运行时契约表达 body、collider、step 和 contact 的意图。

这也解释了为什么 docs 把 W09 的重要性和难度都标为 A：它不一定像 Renderer2D 那样立即产生最直观的画面结果，但它会决定之后平台跳跃、触发器、投射检测、伤害区域和角色控制器能不能用同一套规则工作。

## Fixed-step 是整帧叙事的一部分

AI-native refactor 文档里的 frame flow 很关键：固定更新阶段中包含 `Layer.OnFixedUpdate`、`Gameplay.AdvanceFixedStep` 和 `Physics.Step`。这说明物理不是普通 update 里的临时代码，而是一个显式的、可诊断的固定步长阶段。

这种设计带来几个好处。

第一，模拟节奏可以和渲染帧率分开。Renderer2D 负责把当前世界画出来，Physics2D 负责在固定间隔内推进运动和碰撞，Platform + Input 提供帧时间，Gameplay 在明确的 fixed-step 入口里响应结果。

第二，测试更容易写。物理 smoke tests 可以围绕固定 step、body lifecycle、collider registration 和 contact event 做断言，而不必依赖真实窗口或不稳定的帧间隔。

第三，诊断更有意义。既然 diagnostics 已经负责记录每一帧发生了什么，W09 就应该让 physics phase 也能被解释：这一轮 step 是否执行、产生了哪些 collision event、哪些 gameplay event 因此入队。

## Box2D 应该被包在 runtime contract 后面

技术栈文档把当前物理层描述为 null physics service，计划的实际技术是 Box2D。选择 Box2D 的原因很直接：它已经覆盖 2D colliders、rigid bodies、contact callbacks 和 raycasts，也有成熟文档和社区经验。

但 W09 真正要交付的不是“项目用了 Box2D”这个事实，而是 Box2D runtime boundary。这个边界至少要回答几类问题：

- body 和 collider 的生命周期由谁管理
- scene entity 与 physics body 如何关联
- fixed-step 内何时执行 physics world step
- contact callback 如何转成 gameplay event
- raycast 或 query 结果如何暴露给 gameplay，而不泄露后端细节

如果这些问题在第一版就被写成清楚的 contract，后续替换实现、增加调试面板或扩展玩法类型时，就不会把 Box2D 的低层对象传得到处都是。

## 碰撞事件应该进入 Gameplay，而不是绕过 Gameplay

架构决策里有一条对 W09 很重要：下游系统应该把 `IGameplayService` 的公开表面当成稳定入口，触发 gameplay 的集成应通过共享的 command/event/timer 路径，而不是发明私有派发通道。

这意味着 collision callbacks 不应该直接修改任意 gameplay 状态。更稳妥的方式是把碰撞结果整理成 gameplay events：谁和谁接触、接触开始还是结束、是否是 trigger、是否需要由 feature 订阅处理。

这样做的收益很实际。Scripting、audio、diagnostics、UI debug 和 AI context 都能观察同一条事件路径。一个碰撞可以触发音效、脚本逻辑、调试显示和日志记录，但所有模块都知道它来自 fixed-step physics phase，而不是某个隐藏回调。

## W09 也要保持 AI 可解释

SHE 的一个核心目标，是让 Codex 能从稳定材料理解项目，而不是靠猜。AI context 文档要求新 subsystem 扩展 context exporter，不要绕开它；架构决策也强调 AI context 对确定性模拟路径是只读的。

所以 W09 的 AI-native 方向不是让 AI 直接改写模拟结果，而是让物理状态和事件更容易被说明。比如：当前 physics service 的能力、最近 fixed-step 统计、已注册 collider 类型、最近 contact digest、与 scene entity 的关联方式，都可以成为 diagnostics 或 authoring context 的摘要来源。

这会让后续调试更直接。当角色穿墙、trigger 没触发、物体没有同步到渲染位置时，Codex 应该能看到固定步长、scene、gameplay event 和 renderer snapshot 之间的关系，而不是只能读一堆不连贯的实现细节。

## 小结

W09 Physics2D 是 SHE 从可见运行时走向可玩运行时的关键一环。它的目标不是一次性做完整物理系统，而是先稳定最容易影响长期架构的部分：Box2D runtime boundary、body/collider lifetime、fixed-step simulation integration，以及 collision callbacks into gameplay events。

如果 W08 让世界可以被画出来，那么 W09 就让世界开始按规则运动和反馈。最重要的是，这些规则要进入 SHE 已经建立好的 service、scene、gameplay、diagnostics 和 AI context 体系，而不是变成隐藏在实现里的第二套运行时。
