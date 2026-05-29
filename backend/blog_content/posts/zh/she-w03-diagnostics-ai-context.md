# SHE W03：让诊断和 AI Context 讲清楚每一帧

SHE 的 W03 workstream 负责 `Diagnostics + AI Context`。它不是一个新的玩法模块，也不是渲染、物理或脚本系统本身，而是让这些系统未来能够被人和 Codex 看懂的观察层。

这篇文章基于项目的 README、CMake 配置和公开 docs，记录 W03 的工程定位：把 frame trace、phase report、gameplay activity、schema catalog 和 authoring context 统一成稳定的运行时叙事。

## 为什么诊断要排在第一波

SHE 的阶段规划把 W01 Gameplay Core、W02 Data Core 和 W03 Diagnostics + AI Context 放在同一批基础 workstream 中。原因很直接：如果玩法命令、数据 schema 和运行时状态都已经存在，但没有统一的诊断出口，后续调试就会回到猜测。

W03 的价值不是“多打日志”，而是把运行时发生过什么组织成可检查的事实。文档中的 frame flow 从 `Diagnostics.BeginFrame` 开始，经过 window、gameplay、fixed update、scripting、scene、renderer、UI、audio 和 AI context refresh，最后在 `Diagnostics.EndFrame` 收束。这个顺序让一帧不是零散事件，而是一条可以复盘的链路。

## W03 的边界

按照 workstream 划分，W03 主要拥有两个方向：

- `Engine/Diagnostics/*`：记录 frame phase、生成 frame report，并让命令与事件活动能出现在诊断故事里。
- `Engine/AI/*`：导出 Codex 可读的 authoring context，汇总场景、类型、feature、schema、数据注册表、gameplay digest、script catalog 和最新诊断报告。

这个边界很重要。AI context 是只读观察面，不直接修改模拟；Diagnostics 记录事实，不绕过 Gameplay、Data 或 Scene 的正式契约。这样后续脚本、物理、渲染和 UI 都可以接入同一套可解释路径，而不是各自发明临时调试格式。

## 稳定的 Authoring Context

`AI_CONTEXT.md` 给 W03 定义了稳定外层结构，包括 `authoring_context_contract_version`、`context_version`、`frame_index`，以及 `[project]`、`[runtime_state]`、`[module_counts]`、`[reflection_catalog]`、`[schema_catalog]`、`[data_registry]`、`[gameplay_state]`、`[script_catalog]` 和 `[latest_frame_report]`。

这套结构的关键点是：它不要求 Codex 去搜索随机文件，也不把数据模块降级成 AI 专用格式。schema catalog 和 data registry 应该来自 `IDataService` 的稳定契约；gameplay digest 应该来自 `IGameplayService`；latest frame report 则来自 diagnostics。AI 层只是汇总事实，而不是替代这些模块的所有权。

对一个 AI-native engine 来说，这比“把更多文件塞进上下文”更可靠。上下文越稳定，Codex 越容易判断当前有哪些 feature、schema、script module 和最近一帧的运行状态，也越不容易误改隐藏约定。

## 好的诊断不是噪声

文档对 latest frame report 的形状也做了约束：报告包含版本、捕获帧数、当前帧序号、phase 数量、是否包含 gameplay activity、frame summary，以及每个 phase 的明细 section。

这说明 W03 的目标不是输出无限制的日志流，而是输出可以被测试、审阅和压缩的报告。对调试来说，最有用的信息通常是：

- 当前帧经过了哪些阶段；
- gameplay 命令和事件是否进入了正式路径；
- 数据和 schema 的摘要是否仍然可信；
- AI context 能否解释当前 runtime，而不是只列文件名。

当这些信息稳定下来，后续 W04 Scripting Host、W05 Scene + ECS、W08 Renderer2D 和 W11 UI + Debug Tools 都能把自己的状态接入同一个诊断叙事。

## 小结

SHE W03 的意义在于把“可观察性”提前做成架构基础。它让引擎不只是在内部运行，也能把运行过程讲清楚：一帧如何开始，哪些系统参与，玩法活动在哪里出现，数据契约是否可见，Codex 应该从哪里读取事实。

这类工作短期看不如渲染窗口直观，但它决定了后续多人、多 Agent、多模块开发时能否可靠交接。对 SHE 这种 AI-native 2D engine 来说，Diagnostics + AI Context 是控制平面的一部分，不是事后补上的调试附件。
