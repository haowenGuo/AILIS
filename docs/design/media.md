# 语音、视觉和角色

媒体系统负责把声音、屏幕和角色表现连接到交互过程。文字内容、音频流和动作数据分别处理，便于独立控制时延、播放和渲染。

## 输入

语音输入由麦克风采集、分段策略和 ASR 组成。local-asr-manager 管理本地识别进程，desktop_asr_worker.py 执行识别。recognitionMode 决定交互方式，识别模型和解释器由运行组件提供。

图像输入可以来自附件或屏幕区域。区域选择页面负责选择范围，主进程和视觉工具负责截图及请求。是否启用独立视觉 provider 由配置决定。

## 合成与播放

SpeechProvider 选择合成方式。桌面设置提供 off、server 和 cosyvoice3；浏览器有自己的语音候选。CosyVoice3 使用本地 Python worker，server 方式连接配置的合成服务。

聊天 TTS 系统处理播报文本，分块合成与播放队列处理逐段到达的音频。取消、打断、设备切换和新一轮输入需要同时协调合成与播放状态。

一次语音交互的等待可以拆为：

```text
用户停止说话 → 端点检测 → ASR → Agent → TTS → 排队与播放
```

模型首字、音频首响和整段播完是不同时间点。定位慢响应时应分别记录。

## 角色呈现

rendering/index.js 暴露 VRMModelSystem、对话气泡和鼠标命中测试接口。VRMModelSystem 管理场景、模型、相机、灯光和渲染；character 模块管理状态、动作、表情和 render profile。

文字显示、播报清洗和动作映射共同形成最终交互效果。修改呈现层时，分别核对原始回答、显示文本、语音文本和实际画面。

## 资源与资产包

资产包通过 manifest 指定类型、标识、版本和资源路径，可以配置渲染风格、人物样式、声音或模型。示例 cinematic skin 使用内置角色，并提供三个 profile 文件。

动作候选由 catalog 登记文件、来源、风格和审核字段；贴纸由映射表选取。素材接入需要文件检查、实际画面验收和来源／许可记录。

## 准备与验证

运行组件清单包括 Python、ASR、CosyVoice3 和 Web runtime；按功能安装，避免为文本功能准备全部媒体模型。

验证顺序建议为文本回答、单独转写、固定文本合成、流式播放与打断、角色动作。单元测试覆盖参数和协议，麦克风、播放设备、穿模、掉帧和长时运行需要实际环境验证。

源码：[SpeechProvider](../../src/speech-provider.js)、[聊天 TTS](../../src/chat-tts-system.js)、[分块队列](../../src/realtime-voice/tts-playback-queue.js)、[ASR](../../electron/local-asr-manager.cjs)、[CosyVoice3](../../electron/desktop-cosyvoice3-tts.cjs)、[渲染入口](../../src/rendering/index.js)、[资产包](../../electron/asset-pack-runtime.cjs)、[组件清单](../../installer/ailis-runtime-components.json)。
