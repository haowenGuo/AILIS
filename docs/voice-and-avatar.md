# 语音、视觉与角色呈现

[手册索引与源码基线](README.md) · [配置](configuration.md)

## 语音是主对话的输入／输出通道

桌宠页面通过 [pet-app.js](../src/pet-app.js)、[chat-tts-system.js](../src/chat-tts-system.js)、[speech-provider.js](../src/speech-provider.js) 和 [tts-audio-player.js](../src/tts-audio-player.js) 组织输入、合成与播放。语音启用不意味着换成另一个 Persona 模型，也不应重写主 Agent 的事实性答案。

| 部分 | 代码入口 | 依赖／边界 |
| --- | --- | --- |
| 本地 ASR | [local-asr-manager](../electron/local-asr-manager.cjs)、[Python worker](../electron/desktop_asr_worker.py) | 解释器、识别模型、麦克风与权限 |
| ASR 时延配置 | [asr-latency-presets](../src/realtime-voice/asr-latency-presets.js) | VAD／分段策略，不是模型速度保证 |
| TTS provider 选择 | [speech-provider](../src/speech-provider.js) | 桌面支持 off／server／cosyvoice3；浏览器有其独立 native 分支 |
| CosyVoice3 | [desktop-cosyvoice3-tts](../electron/desktop-cosyvoice3-tts.cjs)、[worker](../electron/cosyvoice3_tts_worker.py) | 可选 Python、模型与本地服务生命周期 |
| 服务器／远端合成 | [desktop-elevenlabs-tts](../electron/desktop-elevenlabs-tts.cjs)、[backend TTS](../backend/services/tts_service.py) | 具体配置、网络与可能的独立费用 |
| 分块与播放 | [chunked-tts-session](../src/realtime-voice/chunked-tts-session.js)、[playback queue](../src/realtime-voice/tts-playback-queue.js) | 分块、队列、取消、首音频与播完时间 |

浏览器 native speech 分支不等于桌面设置仍支持旧的 native/Kokoro 模式。仓库中残留某个 worker 文件，也不能据此认定它是当前主语音入口。

## 先文本，再语音

1. 关闭语音验证主模型文本对话。
2. 检查识别设备与 ASR 依赖，确认转写结果再进入模型。
3. 对同一段短文本单独验证 TTS。
4. 最后测试流式回答、分块播放、打断、下一轮与设备切换。

语音总等待包含端点检测、识别、模型、合成和播放排队。模型首字时间不等于用户听见第一句话的时间，录音开始到整段读完也不等于 Agent 的推理时延。

## 可选资源包

[runtime-components.json](../installer/ailis-runtime-components.json)列出的 Python、CosyVoice3、ASR、Web runtime 均是可选组件；默认不选中。CosyVoice3 和 ASR 依赖 Python 组件，但只装解释器不等于模型可用。

准备脚本：[voice](../scripts/prepare-ailis-voice-runtime.mjs)、[ASR](../scripts/prepare-ailis-asr-runtime.mjs)、[bootstrap](../electron/voice-runtime-bootstrap.cjs)。下载前核对目标盘与存储路径。清单中的 estimated size 是估计，不能当安装后实测占用。

## 角色渲染

[src/rendering/index.js](../src/rendering/index.js)是页面侧公共导出边界，提供 `VRMModelSystem`、对话气泡和鼠标命中测试安装接口。[vrm-model-system.js](../src/rendering/vrm-model-system.js)承担场景、模型、相机和逐帧渲染；[src/character/](../src/character)承担角色状态、行为调度、动作、表情与渲染 profile。

主回答向角色呈现的转换是程序层格式转换。`persona-surface`、`screenplay` 等文件名表示呈现数据，不代表默认有一个独立人格模型接管答案。验证时分别检查正文保持、TTS 清洗和动作映射，避免“动画正常”掩盖回答内容被改写。

## 外部皮肤与动作

- [asset-pack-runtime](../electron/asset-pack-runtime.cjs)读取 manifest、管理资产包。皮肤可以只覆盖渲染、语音或人格样式，不一定带 VRM。
- [本地示例皮肤](../sample-asset-packs/ailis-cinematic-skin/README.md)不含 VRM，使用内置角色模型；不是完整角色资产授权包。
- [动作 intake](../Resources/MotionIntake/README.md)先记录来源、许可、文件和审核状态，再做视觉验收。
- [motion-intake-catalog](../src/character/motion-intake-catalog.js)中存在 `approved: true` 但 license 仍为 unknown 的旧条目。**运行审核通过不等于再分发许可通过**；发布资源前必须补齐授权核验。
- [贴纸资源](../Resources/Emotes/ailis/README.md)由映射表决定使用，不按目录文件数宣称所有图片都加载。

## 测试与未覆盖部分

```powershell
node --test tests/asr-latency-presets.test.mjs tests/ailis-render-profiles.test.mjs tests/ailis-persona-renderer.test.mjs
pnpm motion:intake:verify
```

结构／配置测试不能替代肉眼检查穿模、设备录音、真实首音频、GPU／CPU 占用与长期播放稳定性。本次文档重写没有执行真实录音或语音模型测速。
