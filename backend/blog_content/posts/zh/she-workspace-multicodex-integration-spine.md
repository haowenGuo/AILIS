# SHE Workspace：把多 Codex 引擎开发收束到 W00 主线

SHE-workspace 里的主仓库不是又一个孤立的引擎副本，而是整个多 Codex 开发方式里的 `W00`：架构师和集成者所在的主线工作区。它负责保持方向、切分 workstream、接收各分支回传的结果，并把分散的模块实现重新收束成一条可验证的引擎脊柱。

这篇文章关注的是这个 workspace 的工程意义。前面的 SHE 系列已经分别讨论了 Gameplay、Data、Diagnostics、Scene、Renderer、Physics、Audio、UI Debug 和 Vertical Slice 等模块；这里更值得记录的是：当一个 2D 引擎被拆成十几个 Codex 工作窗口之后，主仓库如何避免并行开发变成并行混乱。

## W00 不是旁观者，而是集成主线

`MULTI_CODEX_LAUNCH_PLAN.md` 把 `W00` 定义为 Architect + Integrator。其他窗口分别负责 `W01 Gameplay Core`、`W02 Data Core`、`W03 Diagnostics + AI Context`，一直到 Renderer2D、Physics2D、Audio Runtime、UI Debug 和 Vertical Slice。每个 workstream 有自己的分支和工作树，但共享状态不能依赖这些分支里的临时改动。

所以 `MULTI_CODEX_WORKFLOW.md` 里有一个关键规则：当多个 worktree 同时存在时，`W00` 的 `main` 分支才是协调状态的 source of truth。任务板、状态台账和集成报告都应该由 `W00` 维护。分支里的 coordination 文件可以存在副本，但不能被误认为实时共享状态。

这个规则看起来像流程管理，实际上是在保护架构。引擎项目里最危险的并行不是多个模块同时写代码，而是多个模块同时修改边界却没有一个地方记录接口变化。`W00` 的存在，让每个工作流都必须回答：我改了什么接口，跑了什么测试，还有什么风险，下一轮应该先看哪里。

## 文档栈是并行开发的记忆系统

SHE workspace 的 public docs 很密集，但它们不是装饰文档，而是多 Agent 协作的共享记忆。`ARCHITECTURE.md` 说明 runtime services、dependency rules 和 frame flow；`MODULE_PRIORITY.md` 给出 W01-W11 的重要性和难度排序；`MILESTONES.md` 把路线拆成 Coordination Foundation、Gameplay Authoring Core、Scriptable Gameplay、World Model、Playable Runtime、Authoring Quality 和 Vertical Slice。

这些文件共同做了一件事：把“下一步应该做什么”从聊天记录里拿出来，放进可重复读取的项目材料里。

对人类开发者来说，这减少了反复解释背景的成本。对 Codex 来说，这更关键，因为每个会话的上下文窗口都是有限的。一个 workstream Codex 不应该通过猜测来判断自己能不能碰 `RuntimeServices`、`Application` 或 CMake 配置；它应该从 launch plan、workflow、acceptance checklist 和架构决策中知道哪些文件属于本次边界，哪些文件需要向 `W00` 报告。

这也是为什么 workspace 主仓库比单个模块工作树更重要。模块仓库负责把一个 slice 做深，`W00` 负责让所有 slice 仍然拼得回去。

## Runtime services 是所有 workstream 的共同语言

主 README 和 `ARCHITECTURE.md` 都强调，SHE 当前阶段是可编译的架构骨架，而不是功能完整的引擎。项目先把 `Engine/`、`Game/`、`Tools/` 和 `Tests/` 分开，再用 runtime service contracts 约束各模块接入方式。

这套服务包括 window、assets、scene、reflection、data、gameplay、renderer、physics、audio、UI、scripting、diagnostics 和 AI context。它们的意义不只是“接口好看”，而是给多 Codex 开发提供共同语言。`W08 Renderer2D` 不应该直接猜 scene 的内部存储；`W09 Physics2D` 不应该绕开 gameplay event；`W03 Diagnostics + AI Context` 不应该靠随机扫描文件理解 runtime 状态。

当所有工作都围绕这些 service contracts 发生时，集成就有了审查点。一个 workstream 如果需要改 shared core，就必须说明为什么；如果只是在自己的模块里替换 placeholder implementation，也应该保持接口稳定，避免把 middleware 细节泄漏给 gameplay 层。

这和 `TECH_STACK.md` 的 interface-first 思路一致。Phase 1 使用 null 或 in-memory bootstrap 实现，真实目标则是 SDL3、OpenGL、EnTT、Box2D、miniaudio、yaml-cpp、Dear ImGui、Lua/sol2、spdlog 和 Tracy 等生产技术。先稳定替换点，再接入复杂依赖，这会让并行开发更容易合并。

## AI Context 让集成可以被解释

`AI_CONTEXT.md` 对导出内容有非常明确的要求：项目意图、场景与实体数量、资产、类型与 feature metadata、schema、data registry、gameplay digest、script modules 和 latest frame diagnostics report 都应该进入 authoring context。

这不是为了生成漂亮报告，而是为了让下一轮 Codex 能从事实开始工作。一个模块完成之后，如果它只存在于源码改动里，后续会话仍然要重新阅读大量文件才能理解状态。相反，如果它通过 reflection、data service、diagnostics 和 AI exporter 进入稳定上下文，后续任务就能用更小的阅读范围判断系统现在拥有什么能力。

`ACCEPTANCE_CHECKLIST.md` 也把这一点写进验收：新变化应该能通过 authoring context export 被看见或解释，diagnostics 能讲清楚发生了什么，新契约能被 Codex 通过 docs、metadata 或 schemas 发现。

对一个多 worktree 的引擎项目来说，这相当于把“可集成”提升为“可解释”。能编译只是底线；能被下一位开发者和下一轮 Codex 快速理解，才是长期协作的关键。

## Open World Blueprint 把目标推向可组合内容

`AI_NATIVE_OPEN_WORLD_BLUEPRINT_V2.md` 给 SHE workspace 提供了更远的北极星：未来的 2D open-world engine 不应主要依赖一次 AI pass 读完整个项目，而应该让创建者 AI 在有限上下文里完成 world assembly、rule assembly、content assembly、local validation 和少量必要的 base contract 微调。

这个蓝图把系统分成 kernel、base、pack、composition 和 validation 五层。最重要的变化是：游戏创作的重心从直接改 `Engine/*` 或单个 `Game/Features/*`，转向可组合的 bases 和 packs。比如 region、tilemap、avatar、animation、NPC、interaction、quest、dialogue、encounter 和 item economy 都应该有 schema、有限命令集、assembler、runtime adapter、query API、validator 和 preview path。

这正好延续了 W00 workspace 的基本思想：把大问题拆成有边界的小问题。只不过前半段是把引擎实现拆成 W01-W11，后半段是把游戏内容拆成可查询、可验证、可预览的 packs。

如果这个方向成立，未来的 creator AI 不需要阅读整个引擎才能新增一个 NPC、一个小镇或一条任务线。它只需要查询相关 base，编辑对应 pack，运行本地验证，再把少数真正可复用的能力升级回 base 或 runtime service。

## 小结

SHE-workspace 的 `W00` 主仓库承担的是集成脊柱角色：它维护架构文档、workstream 切分、launch plan、acceptance checklist、AI context contract 和长期 open-world blueprint，让多个 Codex 会话可以并行推进，而不是互相覆盖。

这类结构的价值不在“开了多少个窗口”，而在每个窗口都有明确边界、每次交接都有记录、每个模块都能通过 service contracts 和 AI-visible context 回到主线。对于一个仍在 bootstrap 阶段的 2D 引擎，这种主线纪律比功能堆叠更重要。它让项目先学会被人和 Codex 共同理解，再逐步变成可玩的、可扩展的、可组合创作的引擎。
