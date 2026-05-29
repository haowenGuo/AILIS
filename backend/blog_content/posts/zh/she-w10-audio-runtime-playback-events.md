# SHE W10：把 Audio Runtime 做成播放契约和玩法反馈边界

SHE 的 W08 让世界可以被画出来，W09 让世界可以按固定步长运动和碰撞。W10 Audio Runtime 接着补上一个很容易被低估的部分：游戏反馈如何被听见，声音资源如何播放，音频事件如何进入已有的运行时叙事。

公开文档把 W10 放在 Wave C，也就是 playable runtime 阶段。它不是简单地把项目接上一个能出声的库，而是要把 `IAudioService`、miniaudio、sound/music asset contract、channel/group ownership 和 gameplay-triggered audio events 放进 SHE 已经建立好的 service、assets、platform、gameplay、diagnostics 与 AI context 边界里。

## 音频也需要 runtime service 边界

SHE 当前仍是一个可编译的 2D 引擎骨架。README 说明这一阶段先稳定 ownership boundary、module responsibility 和 development workflow，复杂运行时代码会在后续阶段逐步替换 bootstrap placeholder。

音频层正好体现了这个策略。AI-native refactor 文档把 `IAudioService` 列为一等 runtime service，当前 bootstrap class 是 `NullAudioService`，责任是 audio frame owner。技术栈文档则把未来实现指向 `miniaudio`，理由是它集成足迹小，也足够支撑小型独立游戏的音效、音乐、bus 和音量控制。

所以 W10 的第一目标不是马上做一个完整混音器，而是先把“谁拥有播放状态、谁提交播放请求、谁管理声道、谁处理每帧更新”讲清楚。只要边界稳定，后续把 null service 换成真实 miniaudio backend 时，gameplay、assets 和 diagnostics 都不需要绕过统一契约。

## 播放路径不只是能出声

Multi-Codex launch plan 对 W10 的即时任务很明确：确认 W01、W06 和 W07 的契约足够稳定，完成第一条 miniaudio-backed playback path，定义 sound/music asset usage 与 channel ownership，并补上聚焦的 audio smoke tests。

这说明音频运行时依赖三个前置基础。

W01 Gameplay Core 提供 command、event 和 timer 这条共享控制路径。音频不应该让 feature 随手调用私有播放函数，而应该能响应 gameplay-triggered audio events，例如命中反馈、UI 操作、环境触发、关卡状态变化。

W06 Asset Pipeline 提供 asset ID、metadata、loader registration 和 handle lifetime。音频资源不应该只是硬编码文件路径，而应该变成和 texture、material 一样可追踪的资源契约：sound effect 与 music 的身份、加载状态、生命周期和用途都要清楚。

W07 Platform + Input 提供窗口循环、事件泵和 frame timing。音频更新虽然不直接等同渲染帧，但它需要和 runtime frame story 对齐，避免播放请求、暂停、恢复和 shutdown 落在不明确的生命周期里。

## 声道和音乐要先定义所有权

技术栈文档提到 miniaudio 的目标包括 sound effect playback、music、buses 和 volume control。对一个小型 2D 引擎来说，这些词很实用，但也容易在第一版里变成隐形全局状态。

W10 应该优先回答几类 ownership 问题：

- sound effect 和 music 是否走不同的播放路径
- 短音效、循环环境声和背景音乐如何区分
- channel 或 group 的创建、复用、停止由谁负责
- 音量、静音、暂停和淡入淡出是全局策略还是 group 级策略
- asset handle 失效时，正在播放的声音如何处理

这些问题如果在 contract 层写清楚，后续 debug UI、设置菜单、cutscene、脚本事件和关卡系统都可以共享同一套音频语义，而不是各自拥有一份播放状态。

## 音频事件应该进入 Gameplay，而不是绕过 Gameplay

架构决策里有一条对 W10 很关键：下游系统应该把 `IGameplayService` 的公开表面当成稳定入口，触发 gameplay 的集成应通过共享的 command/event/timer 路径，而不是发明私有派发通道。

对音频来说，这意味着“播放一个音效”不应该退化成任意模块直接触碰底层 backend。更稳妥的方式是把需要播放的原因表达成 gameplay event 或 command，再由 Audio Runtime 在自己的边界内解释成 playback request。

这样做的收益很直接。物理碰撞可以触发命中音效，UI debug 可以显示最近的 audio event，diagnostics 可以记录哪些事件产生了播放请求，AI context 可以总结当前音频能力和最近帧里的声音反馈。所有模块观察的是同一条可解释路径，而不是一组散落的 backend 调用。

## `Audio.Update` 属于整帧叙事

架构文档和 AI-native refactor 文档都把 `Audio.Update` 放在 frame flow 中：renderer 和 UI 之后，AI context refresh 与 diagnostics end frame 之前。这个位置很重要。

它说明音频不是和 gameplay 完全分离的后台黑盒。每帧里，gameplay 先推进命令和事件，scripting、scene、renderer、UI 依次完成自己的阶段，然后 audio 读取这一帧已经形成的播放意图。随后 AI context 才刷新，diagnostics 才结束帧记录。

这种顺序让音频反馈可以被解释：这一帧为什么播放了某个声音，它来自哪个 gameplay event，使用了哪个 asset，落在哪个 channel/group，是否被音量或暂停状态影响。对玩家来说它只是反馈；对引擎来说它应该是可测试、可诊断、可复盘的运行时行为。

## 小结

W10 Audio Runtime 的重点不是尽快把声音塞进游戏，而是把声音放进 SHE 已经建立好的架构秩序里。它要稳定 `IAudioService` 的 frame ownership，用 miniaudio 作为后续实际播放后端，定义 sound/music asset usage、channel/group ownership，并让 gameplay-triggered audio events 走共享事件路径。

如果 W08 让世界可见，W09 让世界可动，那么 W10 就让世界开始有反馈。最重要的是，这些反馈不能变成隐藏在实现里的第二套系统，而应该继续服务于 SHE 的 runtime services、asset pipeline、gameplay contracts、diagnostics 和 AI-readable context。
