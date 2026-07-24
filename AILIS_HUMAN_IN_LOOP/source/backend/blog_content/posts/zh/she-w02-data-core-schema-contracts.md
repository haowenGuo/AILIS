# SHE W02：把玩法数据先做成 schema-first 契约

上一篇 SHE workstream 文章讲的是 W01 Gameplay Core：命令、事件和计时器。`SHE-w02-data` 紧接着处理另一个基础问题：玩法数据应该如何被定义、验证、读取，并且被人和 Codex 同时理解。

这篇记录只基于低风险材料：`README.md`、根目录 `CMakeLists.txt`，以及 `docs/` 下的公开说明文档。它不展开源码实现，不发布本地绝对路径、安装包、二进制文件、私有配置或未确认可公开的工程材料。

## W02 解决的是“数据能不能被信任”

SHE 的 M1 目标叫 Gameplay Authoring Core。它不是一个单独模块，而是一组互相支撑的契约：W01 提供玩法命令、事件和计时器，W02 提供 schema-first 数据契约，W03 提供 diagnostics 和 AI context。三者合起来，才让后续 feature 有可写、可查、可验证的路径。

`MODULE_PRIORITY.md` 把 W02 Data Core 标成最高重要性，并建议放在第一波启动。原因是玩法数据如果只是散落在 YAML、配置片段或临时代码里，后续所有 feature 都会开始猜字段、猜类型、猜默认值。人可以靠记忆补全这些约定，AI worker 更容易在不完整上下文里做错。

W02 的核心价值就是把这些隐性约定提前变成显性契约。一个 feature 想新增敌人、遭遇、关卡参数或调试数据时，第一步不是随手写一份数据文件，而是先让数据形状能被注册、说明和验证。

## Data Core 是 AI-native 引擎的控制面之一

架构文档把 `Engine/Data` 的职责定义为 schema contracts for gameplay-authored data。它和渲染、平台、物理这类运行时模块不同，更接近控制面：它决定玩法作者和工具能不能用稳定方式描述游戏内容。

`TECH_STACK.md` 也给了清晰路线：Phase 1 先用内存 schema registry 保持边界可编译、可读，后续再引入 `yaml-cpp` 和 schema validation。这个顺序很务实。早期不急着把 YAML 解析、错误恢复和复杂加载器一次性做满，而是先把 public contract 做稳。

这也符合 README 里对 bootstrap 阶段的描述：当前项目是可编译的架构骨架，不是假装已经是完整引擎。Data Core 的第一阶段重点不是功能炫技，而是给后续玩法、脚本、资产和场景系统提供一个不会轻易变形的数据入口。

## schema-first 比“先写数据再补解释”更适合协作

`docs/SCHEMAS/README.md` 记录了当前 Data Core 的契约期待：schema 应该声明 `schema`、`description`、`owner` 和 `fields`；每个字段应该声明 `name`、`kind`、`required`，并可以附带说明；第一版 YAML loader 验证顶层 mapping 字段，并支持 `scalar`、`list`、`map` 三类字段。

这些字段看起来简单，但它们把很多协作问题提前解决了：

1. `owner` 说明谁负责这份数据契约。
2. `description` 让人和 AI 都能理解用途。
3. `required` 区分必填数据和可选调参。
4. `kind` 给验证器和工具提供最低限度的类型判断。

如果没有这层契约，后续 feature 很容易变成“能读就行”的配置堆积。短期写起来快，长期调试会很痛苦，因为错误可能只在运行时某个功能路径里暴露。schema-first 的好处是让数据错误尽早变成结构化验证结果，而不是变成模糊的 gameplay bug。

## W02 和 W01、W03 的连接点

W02 不是孤立的数据仓库。它要和 W01 Gameplay Core、W03 Diagnostics + AI Context 一起工作。

对 W01 来说，Data Core 提供玩法命令和事件背后的数据定义。命令可以触发一次遭遇，事件可以描述一次奖励发放，timer 可以驱动一段阶段逻辑，但这些行为最终都需要稳定的数据形状来表达参数、实体、表格和调试说明。

对 W03 来说，Data Core 是 AI context 的关键输入。`AI_CONTEXT.md` 要求 authoring context 包含 registered schemas，这意味着 Codex 不应该靠搜索随机文件猜数据结构，而应该从引擎导出的上下文里看到当前有哪些 schema、它们属于谁、字段是什么。

这也是 SHE 反复强调 AI-native 的原因。AI 不是后来附加的聊天入口，而是从 runtime services、schema、metadata、diagnostics 和 context export 开始就被纳入工程结构。

## 多 Codex 工作流里的 W02

`MULTI_CODEX_LAUNCH_PLAN.md` 把 W02 定义为 Data Core workstream，工作区对应 `SHE-w02-data`，职责边界是 `Engine/Data/*` 和 schema-focused tests。启动任务包括 YAML loading、schema registration、validation results、data queries、结构化错误报告、focused data-loading tests 和 handoff note。

这套要求说明 W02 的验收不只是“能加载一个文件”。它还要回答几个工程问题：

1. 数据从哪里进入引擎？
2. schema 如何注册和查询？
3. 验证失败如何用结构化方式表达？
4. gameplay feature 如何读取数据而不绕过公共契约？
5. handoff 如何让 W00 integrator 看懂接口变化和剩余风险？

这种切法对并行开发很重要。W02 不需要同时实现完整资产管线或场景系统；它只需要把数据契约做成其他 workstream 可以依赖的底座。等 W05 Scene + ECS、W06 Asset Pipeline、W04 Scripting Host 接入时，它们就不必重新发明自己的数据解释方式。

## 验收标准应该盯住契约稳定性

`ACCEPTANCE_CHECKLIST.md` 对 engine module 的要求很适合 W02：模块要有清楚 public interface，不能制造错误依赖方向，要有最小 smoke/integration test path，如果仍是 bootstrap 实现，还要记录未来 replacement point。

对 Data Core 来说，最重要的验收不是支持多少种 YAML 语法，而是公共表面是否稳定。schema 注册、字段描述、验证结果和数据查询一旦成为官方路径，后续玩法 feature 才能在这条路径上叠加复杂度。

如果这个基础做得好，后续引入 `yaml-cpp`、feature-local schema、数据表、prefab、scene files 或脚本 hook 时，项目仍然能保持一个清楚规则：玩法数据先被描述，再被验证，然后才被运行时消费。

## 小结

`SHE-w02-data` 代表 SHE 在玩法数据层面的第一块基础设施。它把 gameplay data 从“写一些配置给代码读”提升为“先定义 schema，再注册、验证、查询，并导出给 AI context 理解”的工程契约。

这不是一个显眼的用户功能，但它会决定后续 2D 引擎能不能持续扩展。一个 AI-native 引擎如果希望 Codex 能可靠地添加 feature，就必须让数据形状和行为控制面一样明确。W02 做的正是这件事。
