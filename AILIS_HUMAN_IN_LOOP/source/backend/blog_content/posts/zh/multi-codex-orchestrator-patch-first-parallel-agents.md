# Multi-Codex Orchestrator：把多 Agent 协作变成可验证的 Patch 流水线

Multi-Codex Orchestrator 是一个多 Code Agent 协同编程控制平面。它的目标不是再造一个会写代码的 Agent，而是把复杂工程任务拆成多个可以并行、可以恢复、可以验收的 patch 交付单元。

这篇文章基于本机项目 `F:\CodeAgents\multi-codex-orchestrator` 的 README、package.json 和测试目录整理。它是这个自动博客任务里第 4 个研究项目，也很适合作为“多智能体工程化”的项目介绍。

## 它解决的不是“会不会写代码”

单个强 Code Agent 已经很擅长解决局部问题。

真正麻烦的是复杂工程任务：

- 上下文越来越重，模型容易丢细节
- 多个模块互相影响，容易误改
- 出错后只能大范围重跑
- 并行 Agent 没有可靠协作协议
- 最终到底能不能合并，缺少确定性验证

Multi-Codex Orchestrator 的定位是控制平面。它不试图让一个 Agent 一口气吃下所有上下文，而是让 Manager 把任务拆成结构化子任务，再让多个 Worker 在独立 worktree 中开发，最后用 review、repair、integration 和 global test 收敛。

这套设计的重点不是“更多 Agent 更聪明”，而是“每个 Agent 的产物必须能被验证”。

## 控制面角色拆分

项目 README 里把角色分得很清楚：

- `Manager Codex`
- `Worker Codex`
- `Repair Codex`
- `Conflict Resolver Codex`

Manager 负责理解任务、拆解子任务、管理依赖、review、验收和推进节奏。Worker 在独立 git worktree 中完成局部模块开发并提交 patch。Repair 在失败上下文内做最小修复。Conflict Resolver 在 integration worktree 中解决 patch 冲突。

这比“开几个 Agent 聊天协作”更像真实工程系统。

每个角色都有明确边界，协作单位不是自然语言承诺，而是结构化工件和 patch。

## Artifact-first 协作

这个项目最重要的思想之一是 artifact-first collaboration。

Agent 之间不是只说“我改好了”，而是传递这些对象：

- `TaskSpec`
- `SubTaskSpec`
- `PatchBundle`
- `TestReport`
- `ReviewVerdict`
- `FailureReport`
- `BlockedEscalationPlan`

这很关键。自然语言适合解释意图，但不适合作为自动化系统的唯一接口。结构化 artifact 才能被恢复、被检查、被重新执行、被归档和被后续流程消费。

换句话说，多 Agent 协作真正需要的是协议，而不只是并发。

## 为什么 worktree 是核心

README 里还有一个非常实际的设计选择：每个 worker 都在独立 git worktree 中运行。

这解决了共享目录并发开发最容易出现的问题：

- worker 之间不会直接踩文件
- 每个 patch 从同一个 base commit 出发
- 每个 worker 有独立日志、测试结果和 patch
- integration 阶段再统一合并

这套模式很接近人类团队里的分支开发，只不过 worker 是 Agent。

如果多个 Agent 直接在同一个目录里改文件，短期看起来快，长期会非常混乱。worktree-first 的设计让并行变得可控。

## 验证决定能不能推进

项目的另一个核心原则是 deterministic verification。

Worker 可以自由思考，但能不能进入下一阶段，不由“它自己觉得完成了”决定，而由控制面执行验证决定。

验证分几层：

- 局部验证：`localVerificationCommands`
- 全局验收：`globalTestCommands`
- review verdict：`approved / needs_repair / rejected`

这让系统更接近 CI/CD，而不是聊天机器人。

尤其在自动编码场景里，这个原则很重要。Agent 的解释可以很好听，但真正可靠的是测试、patch、review verdict 和最终集成结果。

## 失败后不是重跑，而是 Repair

复杂任务一定会失败。

Multi-Codex Orchestrator 的设计不是失败后重跑全部流程，而是进入 repair loop：

- 写出失败报告
- 把失败上下文交给 repair agent
- 只修最小范围
- 重新运行最小测试
- 通过后回到 review 或 integration

这个思路很工程化。

如果每次失败都从头跑，成本会很高，而且可能破坏已经完成的部分。最小修复循环则更像真实开发：先定位，再修复，再复测。

## 依赖感知和冲突解决

这个项目还支持 dependency-aware scheduling。

`TaskSpec` 可以显式声明 dependencies，调度器按 DAG 波次推进。依赖任务没批准之前，下游 worker 不会启动。下游 worker 做局部验证时，会先应用上游 patch，再跑 scoped tests。

这解决了一个很常见的问题：并行不是所有事情都同时开跑。有些模块确实可以并行，有些必须等接口或基础层稳定。

integration 阶段如果 patch 应用失败，系统会生成冲突报告，调用 Conflict Resolver，并在 integration worktree 中解决冲突，而不是简单把整个任务打回。

## 当前工程状态

从 README 和 package.json 看，这个项目是一个 TypeScript / Node.js 工程，核心依赖是 `@openai/codex-sdk`。

脚本包括：

- `npm run dev`
- `npm test`
- `npm run typecheck`
- parallel benchmark 相关命令
- SWE-bench mini 相关命令

测试目录中已经包含 conflict resolver、repair dependencies、deterministic verdict、execution mode、benchmark scoring 等测试文件。

这说明项目不是只停留在概念设计，而是已经围绕可靠性做了不少回归测试。

## 适合写成什么样的项目展示

Multi-Codex Orchestrator 最适合被展示成一个“Agent 工程控制平面”。

它的亮点不是 UI，也不是单次 demo 生成了多少代码，而是这些工程能力：

- 多 worker 并行开发
- worktree 隔离
- patch 级交付
- review-driven repair
- dependency-aware execution
- conflict resolver
- run-state 恢复
- benchmark suite

这类项目很适合和普通 Code Agent demo 拉开差距。因为它回答的是更难的问题：当任务变复杂、失败变常态、多个 Agent 同时工作时，如何保持工程可控。

## 下一步

后续可以继续写几篇更细的文章：

- 为什么多 Agent 编程需要 artifact，而不是聊天记录
- git worktree 如何成为 Agent 并行的隔离层
- repair loop 如何降低失败重跑成本
- dependency-aware scheduling 为什么比简单并发更重要
- parallel benchmark suite 如何评估吞吐和稳定性

这一篇先作为总览。Multi-Codex Orchestrator 的价值在于，它把“让多个 Agent 写代码”这件事，从热闹的并发，推进到了可恢复、可验证、可集成的工程流水线。
