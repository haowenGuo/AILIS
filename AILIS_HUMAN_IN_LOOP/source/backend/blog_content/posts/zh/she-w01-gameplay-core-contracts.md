# SHE W01：把玩法核心先做成命令、事件和计时器契约

SHE 的主线文章已经记录过这个 2D 引擎为什么要先做成 AI 可理解的骨架。`SHE-w01-gameplay` 更窄一些：它对应多 workstream 计划里的 W01 Gameplay Core，目标不是马上做出一个完整玩法 demo，而是先把未来所有玩法规则都要依赖的控制面稳定下来。

这篇记录只基于低风险材料：`README.md`、根目录 `CMakeLists.txt`，以及 `docs/` 下的公开说明文档。它不展开源码实现，不发布本地绝对路径、安装包、二进制文件、私有配置或未确认可公开的工程材料。

## W01 为什么排在第一波

`MODULE_PRIORITY.md` 把 W01 Gameplay Core 标成最高重要性，并建议第一批启动。原因很直接：后续所有规则、触发器、命令和事件流都会经过它。如果玩法核心没有稳定边界，渲染、物理、脚本、关卡和调试工具越早接进来，后面越难调整。

这个判断也出现在里程碑里。M1 的目标不是“画面可玩”，而是 Gameplay Authoring Core：命令可以通过稳定契约注册和执行，事件可以被观察和追踪，计时器可以用确定方式触发玩法流程，相关数据、诊断和 AI context 也能参与同一套验证。

所以 W01 的价值不是功能数量，而是把玩法系统最容易扩散的部分收拢成一组公共原语。后续 feature 不应该各自发明事件流、延迟逻辑或命令队列，而应该通过统一的 gameplay service 表达这些行为。

## 命令、事件、计时器是玩法控制面

SHE 的架构文档把 `Engine/Gameplay` 的职责说得很清楚：集中玩法命令、集中定时事件，并提供一份 frame-level gameplay activity digest。换成工程语言，就是先回答三个问题：

1. 玩法动作如何被请求和执行？
2. 玩法事件如何被广播、观察和记录？
3. 延迟、冷却、触发窗口这类时间逻辑如何进入帧循环？

这三个问题如果散落在具体 feature 里，很快会变成隐性约定。一个敌人系统可能自己维护事件列表，一个商店系统可能自己排队命令，一个任务系统又用另一种计时方式。短期能跑，长期很难让人或 AI worker 判断哪个流程才是官方路径。

W01 的方向是把这些能力变成 `IGameplayService` 这样的稳定入口。玩法 feature 可以提交命令、发布事件、注册计时逻辑，而不是直接依赖平台、渲染、物理或脚本宿主的内部细节。

## Feature 边界要对 AI 友好

文档推荐把玩法功能组织成 `Game/Features/<FeatureName>/`，并把 layer、数据 schema、测试和 README 放在同一个 feature 边界内。这个布局看起来像目录约定，实际是在控制 AI 协作的风险。

一个 feature 如果只是一堆散落文件，AI 很容易改到错误层级，或者在看不到完整上下文的情况下复制旧模式。相反，如果每个 feature 都有清楚边界，并且通过 `IReflectionService` 注册 metadata、通过 `IDataService` 注册数据形状、通过 `IGameplayService` 处理命令事件计时器，AI 就能从项目事实而不是猜测里理解它。

这也是 W01 和 W02、W03 必须一起作为第一波的原因。Gameplay Core 负责行为控制面，Data Core 负责 schema-first 数据契约，Diagnostics + AI Context 负责把发生过什么讲清楚。三者合起来，后续的 gameplay feature 才有可写、可查、可验证的路径。

## 多 Codex 工作流里的 W01

`MULTI_CODEX_LAUNCH_PLAN.md` 把 W01 定义为 Gameplay Core workstream，并让它拥有 gameplay 模块和面向 gameplay 的测试。启动任务包括命令注册、执行路径、事件总线、计时器分发、生命周期边界注释、focused contract tests 和 handoff note。

这说明 SHE 的并行开发不是简单地“多开几个会话”。每个 workstream 都有明确职责、推荐启动时机和验收方式。W01 不需要同时推进渲染器、资产管线或平台输入；它只需要把 gameplay 控制面做成其他模块可以信任的契约。

这种切法对引擎尤其重要。玩法核心一旦稳定，后续 W04 Scripting Host 可以把脚本挂到官方命令和事件路径上，W05 Scene + ECS 可以把世界对象接入玩法流程，W09 Physics2D 可以把碰撞回调转成 gameplay event，W10 Audio Runtime 也可以响应 gameplay-triggered audio events。

## 验收标准比功能清单更重要

`ACCEPTANCE_CHECKLIST.md` 给 W01 这类 workstream 设置了几条很实用的底线：模块所有权要清楚，依赖方向不能乱，风险行为要有测试，契约变化要更新架构文档，新 gameplay feature 要通过标准服务进入 AI 可见上下文。

这些要求听起来保守，但它们正是 Gameplay Core 应该先解决的问题。W01 不是为了尽快堆玩法，而是为了让后续玩法不会绕开公共通道。一个命令有没有被执行、一个事件有没有被捕获、一个 timer 为什么触发，都应该能被 diagnostics 和 AI context 解释。

这也让后续集成更容易判断质量。一个 workstream 的完成不只看“能编译”，还要看它是否留下了可读的 handoff、是否说明了测试结果和风险、是否没有制造新的隐藏依赖。

## 小结

`SHE-w01-gameplay` 代表的是 SHE 最先落地的玩法控制面：命令、事件、计时器、契约测试、诊断可见性和 AI 可理解的 feature 边界。它不会直接让引擎看起来更炫，但它会决定后续 gameplay、脚本、场景、物理和音频能不能沿着同一条稳定路径协作。

对一个 AI-native 2D 引擎来说，这个顺序是有意义的。先把玩法核心做成公共语言，再让渲染和运行时系统接入这套语言，后面的 feature 才不会变成一堆互相看不懂的特殊逻辑。
