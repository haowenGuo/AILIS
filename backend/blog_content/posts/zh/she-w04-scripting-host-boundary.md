# SHE W04：把脚本能力先做成稳定宿主边界

`SHE-w04-scripting` 是 SHE 2D 引擎拆分工作流里的 W04。它的主题不是立刻把所有玩法都搬进脚本，而是先回答一个更基础的问题：脚本应该怎样进入引擎，才不会绕开已经建立好的玩法、数据、诊断和 AI Context 契约。

从公开文档看，W04 被放在 “Scripting Host” 位置，优先级是 authoring plane。也就是说，它服务的是更快的玩法迭代，但它不应该成为新的隐藏运行时。真正稳妥的路线，是让脚本能力站在 W01、W02、W03 已经打好的控制平面之上。

## 脚本不是绕过引擎的捷径

SHE 前三条工作流已经把几个关键边界讲清楚了。W01 负责命令、事件和计时器；W02 负责 schema-first 的玩法数据；W03 负责 frame trace、diagnostics report 和 Codex 可读的 authoring context。W04 如果直接让脚本随意修改场景或玩法状态，就会破坏这条清晰的叙事线。

所以 W04 更像一个宿主边界，而不是一个万能脚本入口。脚本模块可以成为玩法迭代层，但它触发 gameplay flow 时仍应该走 `IGameplayService` 的命令、事件和 timer 路径；读取数据时应该依赖 `IDataService` 已注册的 schema 和记录；需要暴露给 Codex 时，则进入 AI Context 的 `[script_catalog]`，而不是藏在某个不可追踪的文件约定里。

这也是文档里反复强调 “stable host boundary” 的原因。脚本可以让功能更快，但边界本身必须慢一点、稳一点。

## 宿主边界要承担什么

W04 的核心对象是 `IScriptingService`、`ScriptingService` 和 `ScriptModuleDescriptor` 这一类概念。它们要表达的不是 “现在已经有完整 Lua runtime”，而是先建立几件稳定的事：

- 脚本模块如何被登记和识别。
- 脚本模块处在哪个生命周期阶段。
- 引擎原生玩法和脚本玩法之间的责任边界在哪里。
- 未来 Lua 与 `sol2` 接入时，绑定注册应落在什么位置。
- 一条最小 bootstrap 集成样例如何证明这个边界可用。

这类接口的价值在于降低后续替换成本。当前 SHE 仍是 C++20 与 CMake 驱动的可编译骨架，很多 runtime service 还是 placeholder 或 null implementation。W04 先定义清楚 host contract，后续再接入 Lua runtime，就不需要让具体脚本引擎泄漏到 `Game/Features/*`、diagnostics 或 AI exporter 的每个角落。

## 它在帧流程里的位置

SHE 的 frame flow 对 W04 很重要。公开架构文档把 `Scripting.Update` 放在 `Gameplay.FlushCommands` 之后、`Scene.UpdateSceneGraph` 之前。这个顺序说明了脚本层的角色：它可以参与一帧中的玩法推进，但它不是第一手事件入口，也不是绕过 scene contract 的后门。

更后面，`AI.RefreshContext` 会在 renderer、UI、audio 更新之后执行，最后由 diagnostics 收尾。这样一来，脚本模块的登记、参与过的 gameplay activity、最新 frame report 和数据状态可以被整理成同一份上下文。对 Codex 来说，这比 “去猜某个脚本文件里发生了什么” 要可靠得多。

这种顺序也让测试更容易聚焦。W04 的测试不应该只证明脚本能跑，还应该证明脚本触发的行为能被 gameplay digest、diagnostics report 和 authoring context 观察到。

## 为什么 W04 要等前置契约稳定

模块优先级文档把 W04 标成重要性 A、难度 A，并建议在 W01 和 W02 稳定之后启动。这个判断很实际：如果命令、事件、timer 和数据 schema 还没有稳定，脚本层就会被迫自己发明一套临时接口。短期看好像更快，长期看会制造第二套 gameplay runtime。

W04 更健康的目标，是把脚本做成 “绑定到契约上的 authoring layer”。设计上可以先保守：

- 不让脚本直接拥有底层平台、渲染或物理后端。
- 不让脚本绕过 `IGameplayService` 直接写 gameplay state。
- 不让脚本数据脱离 `IDataService` 的 schema 注册。
- 不让 AI Context 通过文件抓取来理解脚本，而是通过 service catalog 总结脚本模块。

这样做的结果是，脚本变成加速迭代的工具，而不是破坏架构的捷径。

## 下一步应该验证什么

W04 的启动提示给出了很清楚的任务顺序：先确认 W01 和 W02 的 public contracts 足够稳定，再实现稳定脚本宿主边界，随后记录 engine-native gameplay 和 script-owned gameplay 的所有权关系，并补上聚焦的 script-host tests。

这篇文章记录的重点也在这里。SHE 的脚本工作流最有价值的部分，并不是 “用了 Lua” 这个技术标签，而是它把脚本放在一个可登记、可诊断、可测试、可被 Codex 理解的位置。等这个位置站稳以后，真正的 Lua runtime、绑定层和脚本化玩法才有长期维护的基础。
