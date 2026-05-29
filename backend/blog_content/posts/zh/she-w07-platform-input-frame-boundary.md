# SHE W07：把窗口、输入和帧时间做成运行时边界

SHE 前几条 workstream 已经把玩法、数据、诊断、脚本、场景和资产先稳定成契约。W07 Platform + Input 处理的是另一类基础问题：一个 2D 引擎什么时候从可编译骨架变成真正的运行时。

答案不是“接入一个窗口库”这么简单。W07 要把窗口、输入、事件泵和帧时间放到一个清楚的边界里，让后续 renderer、physics、audio、UI 和 gameplay 都能依赖同一套节拍。

## 为什么 W07 属于运行时骨架

公开 docs 把 W07 标成 runtime plane，重要性是 A，难度是 B。这个排序很合理：没有真实窗口、输入和帧时间，项目可以有很好的玩法契约和数据契约，但还不是可玩的引擎。

在开发波次里，W07 和 W05 Scene + ECS、W06 Asset Pipeline 一起属于第二波 runtime spine。场景定义“世界里有什么”，资产定义“资源如何被引用和加载”，平台层则定义“这个世界如何进入一帧、一帧地运行，并接收外部输入”。

这也是它和 W08 Renderer2D、W09 Physics2D 的关系。渲染和物理会让引擎更可见、更可玩，但它们都需要一个稳定的窗口、事件和时间来源。W07 先把这条运行时入口稳住，后面的模块才不需要各自发明自己的 loop。

## 平台层应该只暴露引擎需要的事实

当前 Phase 1 的技术栈文档把 Platform 描述为 null window service，计划的生产技术是 SDL3。W07 的目标是把这个占位实现替换成第一版 SDL3-backed window/input layer。

关键点是 SDL3 不应该泄露到 gameplay 代码里。平台层可以负责窗口创建、键盘输入、指针输入、事件泵和关闭请求，但对上层最好暴露的是引擎自己的状态和事件，而不是 middleware 细节。

这能保持 SHE 一直强调的依赖方向：Game/Features 依赖 engine services，不直接依赖具体平台 API。以后如果平台层要扩展到 gamepad、多窗口、高 DPI 或更多桌面平台，也应该优先藏在平台服务边界后面。

## 帧时间是共享契约，不是局部工具

W07 另一个容易被低估的部分是 frame timing。docs 里的 frame flow 把 `Window.PumpEvents` 放在 `Diagnostics.BeginFrame` 之后、`Gameplay.BeginFrame` 之前，这说明平台事件不是随便找个地方处理的辅助逻辑，而是一帧叙事的前置条件。

当输入和时间在一帧开头被收集清楚，后续系统就能用同一份事实推进：

- gameplay 可以把输入转成命令、事件或计时器行为
- physics 可以在固定步长里保持更清楚的更新节奏
- renderer 可以围绕明确的 frame begin/end 组织提交
- diagnostics 可以记录这一帧到底接收了什么事件、推进了什么阶段
- AI context 可以在帧结束后导出更完整的运行时故事

这也是 W07 不应该只是“让窗口能打开”。它真正要稳定的是运行时节拍。

## 输入不要绕过 gameplay 契约

SHE 的架构决策已经强调，gameplay 活动应该尽量走共享的 command、event、timer 路径。W07 收到键盘或指针输入后，后续 gameplay-facing 行为也应该沿着这条路径进入系统，而不是从平台回调直接修改游戏规则。

这样做的好处是明显的。输入可以被诊断系统看到，可以被 AI context 解释，也可以被测试用更稳定的方式覆盖。更重要的是，平台层保持平台层的职责：收集和归一化外部输入，而不是决定具体游戏逻辑。

对一个 AI-native engine 来说，这种边界尤其重要。Codex 后续添加玩法时，不需要猜测某个 SDL callback 里是否藏着业务逻辑，只需要看 engine service contracts 和 gameplay digest。

## 面向后续模块的交付标准

W07 的 launch plan 给了很明确的工作边界：主要拥有 `Engine/Platform/*` 和 platform/input tests，只有在必要时才触碰共享 core 文件。验收重点也很克制：event pumping、frame timing、input state 必须显式，平台输入要有聚焦的 smoke tests。

这会直接影响后续 workstream：

- W08 Renderer2D 需要稳定的窗口和 frame begin/end 边界
- W09 Physics2D 需要明确的 fixed-step timing 接入点
- W10 Audio Runtime 需要可预期的 frame update cadence
- W11 UI + Debug Tools 需要输入状态和事件能被调试面板读取

所以 W07 的价值不在于一次实现所有平台能力，而在于让后续模块知道自己该接在哪里。

## 小结

W07 Platform + Input 是 SHE 从“架构可读”走向“运行时可用”的关键一环。它把 null platform 替换成真实窗口和输入层，同时维护事件泵、帧时间、diagnostics、gameplay 和 AI context 之间的顺序关系。

如果 W01 到 W06 让项目有了可协作的内骨架，那么 W07 就是在给这套骨架接上真正的节拍器。后续渲染、物理、音频和调试 UI 能否自然接入，很大程度上取决于这个边界是否足够干净。
