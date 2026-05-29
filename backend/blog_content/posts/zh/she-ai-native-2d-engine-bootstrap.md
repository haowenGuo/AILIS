# SHE：先把 2D 引擎做成 AI 可理解的骨架

SHE 现在最值得记录的地方，不是它已经有了完整渲染器、物理或编辑器，而是它有意识地先把一个 2D 游戏引擎拆成可理解、可替换、可协作的骨架。README 很直接地说明：当前阶段是可编译的 architecture skeleton，目标是先让所有权边界、模块责任和开发流程变清楚，再引入复杂的渲染和物理代码。

这篇记录只基于低风险材料：`README.md`、根目录 `CMakeLists.txt`，以及 `docs/` 下的公开说明文档。它不展开源码实现，不发布本地工程路径、安装包、二进制文件或私有配置。

## 先确定工程边界

SHE 的目录设计很适合教学和协作：`Engine/` 放可复用运行时模块，`Game/` 放依赖引擎的具体玩法，`Tools/` 放 sandbox 这类非发布工具，`Tests/` 放验证引擎骨架的 smoke tests。这个拆分让项目从第一天起就避免把“引擎代码”“游戏代码”“工具代码”和“验证代码”混成一团。

根目录 `CMakeLists.txt` 也反映了这个边界。项目使用 C++，通过 CMake 组织 `Engine` 和 `Game`，并用选项控制是否构建 sandbox 和 smoke tests。换句话说，SHE 不是先做一个单体 demo，再事后拆模块；它一开始就把 build target 当作架构边界的一部分。

这种做法的好处很现实。后续无论是替换窗口系统、加入渲染后端，还是添加 gameplay feature，都可以问一个简单问题：这项能力属于哪个模块，是否需要成为 runtime service，是否产生新的依赖方向。如果这个问题回答不清楚，代码就不应该贸然落地。

## Runtime Services 是主干

`docs/ARCHITECTURE.md` 把 SHE 的核心称为 AI-native 2D engine architecture。它的主干不是某个具体中间件，而是一组稳定的 runtime service contract：窗口、资产、场景、反射、数据、玩法、渲染、物理、音频、UI、脚本、诊断和 AI context export。

这是一种 interface-first 的路线。Phase 1 用 placeholder 或 null implementation 保证项目能编译、能跑 smoke test、能展示调用顺序；真正的 SDL3、OpenGL、EnTT、Box2D、miniaudio、yaml-cpp、Dear ImGui 和 Lua 集成则留到后续里程碑。文档没有假装这些占位实现就是最终产品，而是把它们当作将来替换真实中间件的位置。

这个选择对小型引擎尤其重要。很多引擎项目容易从“先显示一个 sprite”开始，然后让平台、渲染、输入、资源和玩法规则互相泄漏。SHE 反过来先定义服务边界：gameplay 依赖引擎契约，而不是直接依赖中间件 API；AI context 可以读取稳定摘要，而不是到处猜代码习惯；diagnostics 记录 frame story，而不是只在出错时补日志。

## AI-native 不是装饰层

SHE 的 AI-native 设计不是在项目外面再包一层聊天工具，而是把“让 Codex 能理解和扩展项目”写进引擎内部结构。

文档里几个模块很关键：

- `Reflection` 负责类型和 feature metadata，让工具知道项目里有哪些能力。
- `Data` 负责 schema-first data contract，让玩法数据不只是散落的临时配置。
- `Gameplay` 负责事件、命令和计时器，把玩法交互集中到稳定表面。
- `Scripting` 保留 Lua host 边界，给后续脚本化玩法留下接口。
- `Diagnostics` 记录 frame phase trace，让问题能被复盘。
- `AI` 导出 authoring context，总结场景、资产、类型、feature、schema、脚本和最近帧诊断。

这套结构的意义在于减少猜测。一个 AI agent 如果只看到零散源码，很容易误判依赖关系或改错位置；如果项目能导出稳定的 authoring context，并且每个 gameplay feature 都注册 metadata 和 schema，AI 协作就更像在读系统事实，而不是靠上下文窗口碰运气。

## 路线图没有从渲染开始

`MODULE_PRIORITY.md` 明确把最初优先级放在 Gameplay Core、Data Core、Diagnostics + AI Context，而不是 Renderer2D。理由很清楚：SHE 想验证的是 AI-native gameplay authoring，不只是尽快看到像素。

这并不代表渲染不重要。`TECH_STACK.md` 已经规划了 OpenGL 作为第一条 2D renderer 路线，后续还会有 SDL3、EnTT、Box2D、miniaudio、yaml-cpp 和 Dear ImGui。但在模块优先级里，renderer 被放到 gameplay/data/diagnostics 之后，是为了先稳定那些后期最难改、也最影响 AI 协作的合同。

`MILESTONES.md` 也延续了这个节奏：M1 是 Gameplay Authoring Core，M2 是 Scriptable Gameplay，M3 稳定 world model，M4 才进入 playable runtime，最后用 vertical slice game 验证整套架构。这个顺序比“先做画面，再补结构”更慢一点，但对一个希望长期被人和 AI 一起维护的引擎来说，更可控。

## 多 Codex 工作流也是架构的一部分

SHE 的文档没有只写模块，还写了多 Codex 协作方式。`MULTI_CODEX_WORKFLOW.md` 要求每个 Codex 拥有明确 workstream，而不是随机编辑一堆文件；`W00` integration workspace 维护共享 task board、status ledger 和 integration report；每个 workstream 都要交付 handoff、测试结果、风险和下一步建议。

这和引擎架构是一体的。只有模块边界清楚，多 agent 并行才有意义；只有验收清单明确，集成者才知道应该检查什么。`ACCEPTANCE_CHECKLIST.md` 把这些要求落到具体项：模块所有权、依赖方向、架构文档、测试、AI-visible context、diagnostics 和 handoff 都要可查。

所以 SHE 的“AI-native”不只是运行时能导出上下文，也包括开发过程能被多个 AI worker 理解、分工和交接。这一点对后续把 BootstrapFeature 扩展成真实 gameplay feature 很关键。

## 小结

SHE 现在像一个提前打好桩的 2D 引擎工程：C++20 和 CMake 提供基础骨架，runtime services 定义模块边界，schema、reflection、diagnostics 和 AI context 让项目对人和 Codex 都更透明，而 milestone 和 multi-Codex workflow 则把后续迭代拆成可管理的 workstream。

它还不是完整游戏引擎，也不应该被包装成已经完成的产品。更准确的说法是：SHE 正在把“以后要做的 2D 游戏引擎”先变成一个可编译、可解释、可协作的系统框架。这个阶段的价值不在于功能数量，而在于后续功能能否沿着清晰边界稳步长出来。
