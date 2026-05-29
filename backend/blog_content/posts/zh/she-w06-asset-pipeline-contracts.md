# SHE W06：让资产管线先稳定身份、元数据和加载边界

`SHE-w06-assets` 是 SHE 2D 引擎拆分路线里的 W06。前面的 W05 已经把问题推进到 Scene + ECS：世界里有什么、实体怎样识别、组件怎样查询、生命周期由谁负责。W06 接着处理另一个同样容易变复杂的基础问题：资源怎样进入这个世界。

从公开文档看，W06 的关键词不是“导入一堆文件”，而是 `Asset Pipeline`。它要先定义 asset identifier、metadata model、loader registration、asset handle lifetime rules，以及 renderer/audio 以后能共同理解的 resource contract。对一个还处在接口优先阶段的引擎来说，这个顺序比直接接入完整导入器更稳。

## 资产管线属于运行时和数据的交界处

SHE 的模块优先级把 W06 标成重要性 A、难度 A，并把它放在 Wave B 的 runtime spine 里。这个位置很关键。W06 不像 W01、W02、W03 那样主要服务 authoring control plane，也不像 W08 Renderer2D 那样直接产生可见画面。它站在数据、场景、渲染和音频之间，负责让资源身份变成稳定事实。

没有资产管线，Scene 很难可靠引用 prefab、texture、sound 或 scene file；Renderer 很难知道纹理句柄是否仍然有效；Audio 也会被迫发明自己的 sound registry。最终每个模块都会各自理解“资源是什么”，这会让后续集成变得脆弱。

W06 的价值，就是让这些模块先共享一套语言：资源有稳定 ID，有可读元数据，有注册过的 loader，有明确的 handle 生命周期，并且可以被 diagnostics 和 AI Context 以摘要方式解释出来。

## 先定义身份，再谈导入复杂度

技术栈文档把当前 Assets 层描述为 in-memory registry，未来目标是 `yaml-cpp`、import metadata 和 cooked cache。这个拆分很务实。早期真正要固定的不是“支持多少文件格式”，而是资源身份和元数据模型。

一个可维护的 asset contract 至少要回答几类问题：

- asset ID 是否稳定，是否适合被 scene、prefab、renderer、audio 和 AI Context 引用。
- metadata 记录的是 authoring 路径、类型、依赖、版本，还是运行时缓存状态。
- loader 是按资源类型注册，还是按扩展名、schema 或 importer profile 注册。
- 资源加载失败时，错误怎样回到 diagnostics，而不是只落在临时日志里。
- handle 失效、替换、热重载或延迟加载时，消费者应该看到什么语义。

这些问题如果不先收敛，后面接入 YAML、texture importer、audio decoder 或 cooked cache 时就会把复杂度扩散到各个 runtime module。W06 更像是给资源系统打地基，而不是马上追求完整编辑器管线。

## W06 必须对齐 W02 和 W05

公开启动计划里给 W06 的第一项任务，是确认 W02 data contracts 和 W05 scene needs。这句话很重要，因为资产管线不能孤立设计。

W02 已经把 gameplay data 推向 schema-first。W06 如果要处理 scene file、prefab metadata 或资源清单，就应该继续借用这种 schema 思路，让数据形状可验证，而不是让每个 loader 自己解析一套隐藏格式。

W05 则提供世界模型。资源最终不是抽象存在，它们会被 scene entity、prefab、transform 层级、renderer submission 和 physics/audio 关联使用。Asset ID 和 handle lifetime 如果不考虑 scene lifetime，后续就容易出现“实体还在，资源没了”或“资源替换了，引用方不知道”的边界问题。

因此，W06 的接口设计应该把资源身份、场景引用和数据 schema 放在同一张图里看。它不是 W05 的附属模块，但它必须让 W05 后面的 prefab 和 scene authoring 路线成立。

## Loader 边界保护 Renderer 和 Audio

W06 还被要求“keep renderer/audio consumers in mind”。这并不意味着 Assets 要提前依赖具体渲染器或音频后端。更合理的意思是：资源管线要交付 renderer 和 audio 能消费的稳定合同，但不能让 middleware API 泄漏到整个引擎。

对 Renderer2D 来说，未来最直接的需求会是 texture、material、sprite sheet、font 或 shader-like 配置。对 Audio Runtime 来说，需求会是 sound effect、music、bus/group 配置和播放参数。两者的底层实现不同，但都需要同样的基础能力：稳定资源 ID、类型化元数据、加载状态、错误报告和生命周期规则。

如果 W06 把 loader registration 做成清晰边界，W08 可以专注 sprite submission 和 texture/material handle integration，W10 可以专注 miniaudio-backed playback path，而不是重复解决资源发现和资源身份问题。

## AI Context 也应该看见资产状态

SHE 的 AI Context 契约已经预留了 asset count、asset registry 和 loader summary。也就是说，资产管线不是只服务运行时，它还要服务可解释性。

这点对 AI-native engine 很关键。Codex 后续添加功能时，不应该靠扫描随机文件来猜某个资源是否存在、由谁加载、是否可信、当前引用数大概是多少。更好的方式是由 `IAssetService` 提供稳定摘要，再由 AI Context 把它展示成可读的 authoring context。

这样做还有一个实际好处：当资源缺失、loader 未注册、metadata 不匹配或 handle 过期时，diagnostics 可以把问题放进一帧的叙事里。调试者看到的不只是“贴图没显示”，而是资源身份、加载路径、消费模块和失败阶段之间的关系。

## 下一步应该验证什么

W06 最值得验证的不是“能注册一个字符串”，而是资产合同是否能支撑后面的系统。

测试应该覆盖 asset ID 注册、metadata 查询、重复注册或未知资源的行为、loader registration、handle 生命周期、失败状态，以及 AI Context 中资产摘要是否来自标准 `IAssetService` 合同。它也应该用小而明确的 fixture 证明 renderer/audio consumer 不需要知道资源内部存储细节。

如果 W06 站稳，SHE 的后续路线会更顺。W08 Renderer2D 可以拿到清晰的 texture/material 入口，W10 Audio Runtime 可以建立 sound/music 播放合同，W05 Scene + ECS 可以把 prefab 和 scene authoring 接到稳定资源身份上。对这个项目来说，资产管线的核心意义不是管理文件，而是让资源成为引擎里可验证、可追踪、可解释的一等公民。
