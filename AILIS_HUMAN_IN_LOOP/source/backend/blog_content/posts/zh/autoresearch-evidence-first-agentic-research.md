# AutoResearch：把自动调研做成可追踪的研究流水线

AutoResearch 是一个面向复杂技术问题的自动研究系统。它的目标不是简单地“搜一搜然后总结”，而是把研究过程拆成可以追踪、可以复查、可以继续迭代的工程流水线。

这篇文章基于本机项目 `F:\AutoResearch` 中的 README、MVP 架构文档和 Phase 1 模块清单整理。它适合作为 AutoResearch 的第一篇项目介绍：先解释系统为什么存在，再解释它如何从一个研究主题走到一份带证据的 Markdown 报告。

## 它想解决什么问题

很多所谓的 research agent，本质上只是搜索加总结。

这种方式在短问题上可以工作，但一旦任务变长，就会暴露几个问题：

- 搜索方向容易漂移
- 证据和结论之间关系不清楚
- 中间过程不可复查
- 报告看起来完整，但 citation 不够可靠
- 每次运行都像一次性 prompt，难以形成工程资产

AutoResearch 的定位更偏工程化。它把“调研”看成一条任务链路，而不是一次模型回答。输入是研究主题，输出是带来源、带证据、可回溯的结构化研究报告。

## Phase 1 的核心边界

AutoResearch 的 Phase 1 没有一开始就追求全自动科研。

它明确只做一条主链路：

```text
研究主题
  -> 拆题
  -> 网页/论文并行检索
  -> 证据抽取与引用归档
  -> 提纲生成
  -> 章节草稿生成
  -> critic 审阅
  -> 最终 Markdown 报告
```

这个边界很重要。

它暂时不做自动实验执行，不做自动代码修改，不做 leaderboard 提交，也不做复杂多 agent 树搜索。第一阶段的重点是先做出一个可信的 Research Core。

我很喜欢这个取舍。因为对研究型系统来说，第一优先级不是“看起来聪明”，而是“结论能不能查回去”。如果证据层没有做好，后面再加多少 agent 都只是把不稳定性放大。

## 架构上的关键拆分

从项目 README 和文档看，AutoResearch 当前采用的是比较清楚的分层结构：

- `apps/api`
- `apps/web`
- `services/worker`
- `packages/agent-core`
- `packages/connectors`
- `packages/memory`
- `packages/paper-rag`
- `packages/report-engine`
- `packages/shared-schemas`

API 负责创建任务、查询状态和返回报告。Web 控制台负责输入 topic、查看 timeline、查看来源列表和报告预览。Worker 负责异步执行长任务，避免把研究过程塞进一次同步请求里。

真正有意思的是 packages 层。

`agent-core` 负责主链路编排，包含 Planner、WebScout、ScholarScout、Synthesis、Critic 等角色。`connectors` 负责搜索和内容抓取。`memory` 负责来源归一化、去重和任务产物回查。`paper-rag` 负责 evidence card 和 citation。`report-engine` 负责提纲、章节草稿和最终 Markdown 组装。

这套结构的核心价值是：每一步都有自己的产物，而不是把所有东西塞进一个大 prompt 里。

## 证据先于文风

AutoResearch 文档里有一个原则很关键：证据先于文风。

也就是说，系统首先要保证：

- source 可回溯
- claim 有 evidence
- report 有 citation

然后再谈写得漂不漂亮。

这个原则很朴素，但非常关键。研究报告不是营销文案，不能只追求流畅。尤其是技术调研、论文综述、方案评估这类任务，真正值钱的是“我为什么相信这个结论”。

所以 AutoResearch 没有把报告生成看成最后一步的大模型写作，而是把它拆成证据抽取、引用归档、提纲生成、章节草稿和 critic 审阅。这样做会慢一点，但更适合长线项目。

## 为什么要有 Memory 层

在自动研究系统里，memory 不只是聊天记录。

AutoResearch 的 memory 更像一个研究资产库，至少承担几件事：

- 对 URL、DOI、arXiv ID 等来源做归一化
- 避免同一来源重复入库
- 保存研究任务的中间产物
- 支持按 task 回查 sources、evidence 和 report

这对长任务非常重要。

如果没有 memory，每一轮研究都像重新开始；如果有了结构化 memory，系统就可以逐步积累“这个任务已经看过什么、得出过什么、哪些证据支持哪些结论”。

这也是 AutoResearch 和普通搜索总结工具的差异。它不是只生成一篇文章，而是在生成文章的同时保留一条研究轨迹。

## 从产品角度看它的价值

AutoResearch 适合几类场景：

- 技术选型调研
- 论文方向梳理
- 开源项目对比
- 比赛方案前期研究
- 系统架构资料整理
- 长报告和 proposal 的初稿生成

它最适合的不是“问一个事实答案”，而是“我需要围绕一个复杂主题形成判断”。

比如，如果要调研一个自动科研系统、一个游戏引擎架构、一个安全检测方案，单次问答往往不够。更好的方式是让系统拆问题、找来源、抽证据、生成提纲，再把所有过程留下来。

## 源码和运行方式

本机项目的 README 显示，AutoResearch 是一个 Python 项目，主要依赖包括 FastAPI、Pydantic、SQLAlchemy、Requests 和 Uvicorn。

本地启动大致分为三步：

```powershell
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install -e .[dev]
.\.venv\Scripts\python.exe -m uvicorn autoresearch.api.main:app --host 127.0.0.1 --port 8000
```

然后启动 worker：

```powershell
.\.venv\Scripts\python.exe -m autoresearch.worker.main --poll-interval 1
```

如果使用 Web UI，还需要进入 `apps\web` 启动前端。

目前我不会自动把本机源码打包上传，因为还需要确认公开分发边界。但从项目结构看，它已经很适合后续整理成 GitHub 仓库说明、演示截图和可复现实验报告。

## 下一步可以写什么

AutoResearch 后续很适合继续拆成几篇文章：

- Planner 如何把研究主题拆成可执行问题
- Evidence Card 如何避免报告空泛
- Memory 层如何支持长周期研究
- Report Engine 如何把证据组织成长文
- 为什么自动科研系统不能只靠一个大 prompt

这一篇先作为总览。它记录的是 AutoResearch 的基本思想：把自动调研从一次性生成，变成一条可追踪、可复查、可持续改进的研究流水线。
