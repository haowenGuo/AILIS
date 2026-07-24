# SHE Coordination：把多 Codex 协作做成共享运行记忆

`SHE/coordination` 不是一个渲染、物理或玩法模块，而是 SHE 多 Codex 开发方式里的共享运行记忆。它的 README 把这个目录定义为 multi-Codex development 的 shared operational memory：每个会话先看任务板，更新状态台账，在一个有边界的 workstream 里工作，交接时使用模板，并把集成影响记录下来。

这类目录看起来不像“功能代码”，但对一个并行推进的引擎项目很关键。多个 Codex 会话同时处理不同模块时，真正容易丢失的不是某个函数实现，而是“谁负责什么、依赖谁、改了哪些边界、下一轮应该如何接手”。

## Coordination 是工程控制面

根 README 给出的使用顺序很直接：检查 `TASK_BOARD.md`，更新 `STATUS_LEDGER.md`，只在一个 bounded workstream 内工作，用目录里的模板提交 handoff，并在 `INTEGRATION_REPORT.md` 里记录集成影响。

这说明 `coordination` 目录承担的不是实现细节，而是控制面职责。它把并行开发拆成可观察的步骤：先确认任务，再声明状态，然后限制工作范围，最后留下交接和集成记录。对于多 Codex 工作流来说，这比单纯“多开几个窗口”更重要。

如果没有这种控制面，每个会话都可能只看到自己局部的上下文。Gameplay、Data、Renderer、Physics、Audio 或 Debug UI 的改动也许都能单独成立，但它们对主线架构的影响会散落在聊天记录和临时笔记里。`coordination` 的价值就在于把这些影响放回一个可重复读取的位置。

## Workstream 文件给每轮工作划边界

`WORKSTREAMS/README.md` 规定，每个 active 或 planned workstream 都应该有一个文件，并使用 `<workstream-id>_<short-name>.md` 这种命名方式。更重要的是，它要求这个文件给任何 Codex session 一个 one-file summary，覆盖 ownership、scope、dependencies、changed files 和 acceptance target。

这五项信息基本就是并行工程的最小契约。

`ownership` 说明谁负责这个切片，避免多个会话同时改同一块边界。`scope` 说明这一轮应该做什么，也说明不应该顺手做什么。`dependencies` 让模块之间的先后关系可见。`changed files` 把实际影响面写出来，方便主线集成。`acceptance target` 则把“做到什么算完成”提前固定下来。

这种文件对人类开发者有用，对 Codex 更有用。因为 Codex 不应该靠猜测判断自己能不能碰共享服务、CMake 配置或其他模块接口。一个 workstream 文件如果足够清楚，下一轮会话就可以先读契约，再决定最小修改范围。

## Handoff 把完成状态变成可追溯记录

`HANDOFFS/README.md` 很短，但它定义了一个重要习惯：完成的 handoff notes 应该按 `<workstream-id>_<short-name>_<date>.md` 存放。示例是 `W01_gameplay-core_2026-04-12.md`。

这个命名规则的意义在于让交接记录可以按 workstream 和时间排序。多 Codex 项目里，完成一次局部任务并不等于系统已经完全稳定。后续集成者需要知道这次工作属于哪个编号、解决了什么主题、发生在什么日期。

handoff 记录也能减少“重新考古”的成本。下一轮如果需要接着做某个模块，理想状态不是重新阅读所有源码或聊天记录，而是先看 workstream 摘要和最近 handoff，再决定是否需要深入实现文件。对一个仍在快速 bootstrap 的引擎来说，这种可追溯性可以直接降低合并风险。

## 集成影响必须单独记录

根 README 最后要求把 integration impact 记录到 `INTEGRATION_REPORT.md`。这句话很关键，因为它把“我完成了自己的任务”和“这件事如何影响主线”分开处理。

一个 workstream 可能只是替换了 placeholder，也可能改动了某个 runtime service contract。前者通常影响局部实现，后者会影响其他模块的接入方式。如果每个会话只提交自己的结果，而不说明集成影响，主线很快就会出现隐性漂移：接口变了但文档没变，依赖变了但任务板没变，验收目标变了但后续会话不知道。

把 integration impact 作为固定步骤，可以迫使每轮工作回答几个问题：这次改变会不会影响其他 workstream？是否需要主线调整？是否有新的测试、文档或 acceptance target？这让 `coordination` 成为架构纪律的一部分，而不只是项目管理目录。

## 这轮文章的安全边界

这篇文章只基于 `coordination` 目录下三个 README 文件：根 README、`WORKSTREAMS/README.md` 和 `HANDOFFS/README.md`。我没有读取任务板、状态台账、具体 handoff 文件、集成报告或源码实现。

这个限制也符合 `coordination` 本身的定位。目录结构和模板约定可以公开讨论，因为它们描述的是协作机制；具体任务状态、交接内容和集成风险则可能包含未完成工作细节，不应该在自动博客里展开。

## 小结

`SHE/coordination` 的价值在于把多 Codex 开发从一次次临时会话，整理成有任务板、有状态台账、有 workstream 边界、有 handoff 记录、有集成影响报告的运行系统。

对 SHE 这样的 2D 引擎项目来说，这种目录不是外围文档，而是并行开发能否持续的基础设施。它让每个会话知道自己属于哪条工作流、应该留下什么证据、完成后如何回到主线。功能模块负责让引擎变强，`coordination` 负责让这些模块能被可靠地接上。
