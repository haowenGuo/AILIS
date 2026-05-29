# SHE W05：把 Scene + ECS 做成稳定世界模型

`SHE-w05-scene` 是 SHE 2D 引擎拆分路线里的 W05。前面的 W01 到 W04 更偏控制平面和 authoring plane：命令、事件、计时器、schema-first 数据、诊断、AI Context 和脚本宿主边界。W05 开始进入另一个更重的层面：引擎到底怎样拥有一个世界。

从公开文档看，W05 的关键词是 `Scene + ECS`。它不是单纯添加一个场景类，也不是马上把所有系统接到 EnTT 上，而是先把 entity identity、component storage、query conventions、transform ownership 和 scene lifetime 这些基础规则讲清楚。这个世界模型一旦被大量 gameplay、asset、renderer、physics 和 tooling 依赖，后续再推倒重来会很昂贵。

## 世界模型是第二波运行时骨架

SHE 的模块优先级把 W05 标成重要性 S、难度 S，并放在 Wave B 的 runtime spine 中。这个排序很合理。W01、W02、W03 让引擎的行为、数据和诊断变得可描述；W05 则要把这些描述落到真正的场景对象上。

没有 Scene + ECS，玩法命令只能停留在抽象 digest 里，数据 schema 也缺少稳定的落点，renderer 和 physics 后续更难知道自己应该消费什么。W05 的价值，就是让 “世界中有什么、它们怎样被识别、生命周期由谁负责、系统怎样查询它们” 这些问题有统一答案。

这也是为什么它被放在 W08 Renderer2D 和 W09 Physics2D 之前。渲染需要可提交的 scene snapshot，物理需要稳定的 body/entity 关联，资产管线也需要把 prefab、scene file 和 runtime object 连起来。W05 是这些模块共同的地基。

## 不急着炫技，先定义身份和生命周期

公开文档里对 W05 的直接任务很具体：实现 entity identity、component storage/query conventions 和 scene lifetime rules，并补充场景生命周期与查询测试。这里最重要的不是 “ECS” 这个标签，而是身份和生命周期。

一个可维护的场景系统至少要回答几件事：

- entity ID 是否稳定，能否安全地被 gameplay、diagnostics 和 AI Context 引用。
- component 的所有权在哪里，查询接口应该暴露到什么程度。
- transform 是 scene 的核心责任，还是散落在 renderer、physics、gameplay 各自维护。
- entity 创建、销毁、激活、失效的时机怎样进入一帧的叙事。
- scene update 应该如何被 diagnostics 和 authoring context 观察到。

这些规则越早稳定，后面的系统越不容易绕开 Scene contract。否则 renderer 会发明自己的对象表，physics 会保存另一套 body 映射，gameplay 又会持有临时句柄，最终 AI Context 只能从碎片里猜测世界状态。

## Scene 必须和前置契约对齐

W05 不是孤立模块。它需要继承前几条 workstream 形成的工程习惯。

W01 的 `IGameplayService` 已经把命令、事件和 timer 作为共享行为入口。W05 如果要响应玩法行为，应该把 scene mutation 放在可解释的命令或生命周期规则之后，而不是让 feature 直接随意改世界状态。

W02 的 `IDataService` 负责 schema 和数据注册。W05 后续承接 prefab、scene file 或 data-driven entity 时，应当让数据形状仍然由 schema contract 管，而不是把 YAML 或配置解析逻辑散到 scene runtime 里。

W03 的 diagnostics 和 AI Context 则要求场景变化可观察。公开 AI Context 契约已经预留 active scene、entity count、asset count、registered types、schema catalog、gameplay digest 和 latest frame report。W05 做得好不好，最终应该能从这些稳定输出里看出来。

## 现在还是接口优先，而不是完整生产 ECS

SHE 的技术栈文档把当前 Scene 实现描述为 minimal scene world，未来生产技术目标是 EnTT。这是一个务实选择。项目当前仍然是 C++20 和 CMake 驱动的可编译骨架，许多服务还处在 placeholder 或 null implementation 阶段。此时过早追求完整 ECS 功能，反而可能掩盖真正重要的接口问题。

更好的路线是先把 Scene contract 定义清楚：世界由谁拥有，entity 如何生成和失效，component 查询怎样表达，transform 如何成为跨系统共享事实。等这些问题被测试和文档固定下来，再把底层存储替换成 EnTT，替换成本才会可控。

这也符合 SHE 的整体风格：先让模块边界可读、可测、可被 Codex 理解，再逐步接入真实中间件。W05 的目标不是一次性写出完美 ECS，而是把世界模型的长期形状定下来。

## 下一步应该验证什么

W05 最值得验证的地方，是它能否成为后续 runtime 模块共同信任的场景层。

测试不应该只检查 “能创建 entity”。它还应该覆盖 scene lifetime、component 查询、transform 所有权、无效 entity 的处理，以及 scene update 在 frame flow 中的位置。更进一步，diagnostics 和 AI Context 应该能讲清楚当前 active scene 和 entity 数量，而不是让调试者去读内部容器。

如果 W05 站稳，SHE 后面的 W06 Asset Pipeline、W08 Renderer2D 和 W09 Physics2D 都会轻松很多。资产可以落到稳定的 entity/prefab 模型上，渲染可以消费清晰的 scene snapshot，物理可以把碰撞结果回写到 gameplay event 流程里。对一个 AI-native 2D 引擎来说，这才是 Scene + ECS 的真正意义：让世界既能运行，也能被人和 Codex 看懂。
