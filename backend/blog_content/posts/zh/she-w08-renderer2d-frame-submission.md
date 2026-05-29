# SHE W08：把 Renderer2D 做成清晰的提交与帧所有权边界

SHE 的前几条 workstream 已经把玩法、数据、诊断、脚本、场景、资产和平台输入分成了稳定边界。W08 Renderer2D 进入的是下一层问题：一个 2D 引擎怎样真正把世界显示出来。

这里的重点不是马上追求复杂渲染效果，而是先把渲染提交路径、相机、sprite、纹理/材质句柄和 frame begin/end 的所有权讲清楚。只有这条路径稳定，后续 physics、audio、UI 和工具层才有一个可靠的视觉目标。

## 为什么 W08 是 Wave C 的关键节点

公开 docs 把 W08 Renderer2D 放在 Wave C，也就是“实际可玩的运行时”阶段。它的重要性和难度都被标成 S：渲染既是用户最先看到的结果，也是引擎里最容易被早期设计债拖住的部分。

W01 到 W03 先稳定 control plane，W05 到 W07 再建立 world/runtime spine。到了 W08，Scene + ECS 应该能说明世界里有什么，Asset Pipeline 应该能说明资源如何被引用，Platform + Input 应该能提供窗口、事件和帧时间。Renderer2D 的任务就是把这些契约连接到一条可测试、可解释的画面提交路径。

所以 W08 不是孤立的“画一个 sprite”。它是在验证前面几层边界能否支撑一个真实运行时：世界模型能否被读取，资产句柄能否被消费，窗口和帧节奏能否承载 begin/end，诊断系统能否说明这一帧发生了什么。

## 渲染服务先要守住引擎边界

当前技术栈文档把 Renderer 描述为 null renderer service，计划的生产技术是 OpenGL first，未来可以再考虑 RHI。这个选择很务实：对早期 2D 引擎来说，OpenGL 足够支撑 sprite、texture upload、framebuffer 和简单后处理，同时比现代显式图形 API 更容易教学和调试。

但真正重要的是边界。Game/Features 不应该直接依赖 OpenGL，也不应该直接持有后端细节。它们应该通过 engine contracts 表达“我想渲染什么”，而不是表达“我如何调用图形 API”。

这也是 W08 要优先稳定 `IRendererService` 的原因。Renderer 可以替换 null backend，也可以逐步引入 OpenGL sprite pipeline，但对上层暴露的应当是相机、sprite submission、material/texture handle 和 frame lifecycle，而不是低层 API 泄漏。

## Sprite submission 是第一条可玩的视觉路径

W08 launch plan 里最明确的任务，是实现第一条 real 2D render path with camera and sprite submission。这个范围很克制，也很关键。

相机负责把世界空间和屏幕空间连接起来。Sprite submission 负责把 scene 或 gameplay 想展示的对象转成 renderer 可以排序、批处理或直接绘制的请求。纹理和材质句柄则把 W06 Asset Pipeline 的身份模型接到可见画面上。

这一层如果设计得好，后续可以逐步扩展：

- 批处理 sprite，减少 draw calls
- 支持材质参数和 texture atlas
- 支持 framebuffer、post-processing 和 debug overlays
- 让 UI/debug tools 读取 renderer counters 或 frame artifacts

但第一版不需要一次做完这些。第一版最重要的是把提交数据结构和帧生命周期定住，让测试、diagnostics 和后续 workstream 都知道该检查哪里。

## Frame begin/end 应该有明确所有权

SHE 的 frame flow 把 Renderer 放在 Scene 更新之后、UI 和 Audio 之前：`Renderer.BeginFrame / OnRender / SubmitSceneSnapshot / EndFrame`。这说明渲染不是随便插入的一段绘制代码，而是整帧叙事中的一个正式阶段。

W08 需要回答几个所有权问题：

- 谁负责开始和结束 renderer frame
- Scene snapshot 在什么时候被读取
- Layer 的 OnRender 能提交什么
- Renderer 是否允许在 frame 外接收提交
- 诊断系统如何记录 renderer 阶段

这些问题看起来偏工程细节，但会决定引擎以后是否容易扩展。如果 begin/end 分散在多个调用点，物理、UI、debug overlay 和未来 editor 都会被迫猜测渲染状态。反过来，如果 Renderer2D 有清楚的 frame ownership，后续模块就能围绕同一个 frame contract 工作。

## AI-native 引擎也需要可解释的画面

SHE 一直强调 AI-native：通过 service contracts、schema-first data、feature metadata、frame diagnostics 和 authoring context，让 Codex 能从事实理解项目。W08 也应该延续这个方向。

渲染系统不只是把像素画出来。它还应该尽量让“这一帧为什么是这样”可解释。至少，renderer-facing 信息应该能被 diagnostics 或 AI context 间接说明：当前 scene 有多少对象，资产注册里有哪些可用资源，哪些 feature 提交了可见对象，最近一帧是否经过了 renderer phase。

这不是要求 AI context 直接控制渲染。架构决策已经说得很清楚，AI context 对模拟路径应该是只读的。W08 更应该做的是让 renderer 成为可观察的 runtime service，而不是隐藏在游戏逻辑或平台回调里的黑盒。

## 小结

W08 Renderer2D 是 SHE 从“运行时骨架”走向“可见运行时”的关键一步。它把 null renderer 替换为 OpenGL-first 的 2D 渲染方向，但真正要交付的是更稳定的工程契约：camera、sprite submission、texture/material handle integration，以及清晰的 frame begin/end ownership。

如果 W07 让引擎有了窗口、输入和节拍，那么 W08 就让这套节拍开始产生画面。它不需要在第一版解决所有渲染问题，但必须让后续 physics、audio、UI、debug tools 和 AI context 都能理解：画面是从哪里来的，在哪一帧提交，又由谁负责结束。
