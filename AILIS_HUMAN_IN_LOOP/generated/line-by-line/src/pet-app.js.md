# src/pet-app.js 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。
- 文件类型：`source-code`
- 原始行数：286
- SHA-256：`bee8bed8ce25d385729818eddcc65508246d786ebfa2f95d5a405fbb171e77d7`
- 可运行副本：[打开源文件](../../../source/src/pet-app.js)
- 依赖：`./vrm-model-system.js`、`./tts-audio-player.js`、`./chat-tts-system.js`、`./chat-service.js`、`./speech-provider.js`、`./config.js`、`./avatar-dialogue-bubble.js`、`./pet-mouse-hit-test.js`、`./i18n.js`
- 主要符号：`PET_RENDER_AVATAR_REFERENCE_HEIGHT`、`PET_RENDER_WINDOW_FRAME_HEIGHT`、`PET_WINDOW_CAMERA_DISTANCE_RATIO`、`WEB_RENDER_PROFILE_ID`、`WEB_RENDER_SHADOW_PREFERENCES`、`WEB_DESKTOP_RENDER_QUALITY_PREFERENCES`、`WEB_MOBILE_RENDER_QUALITY_PREFERENCES`、`WEB_CLOSE_CAMERA_PREFERENCES`、`WEB_MOBILE_CAMERA_PREFERENCES`、`applyPetWindowFrameCameraCompensation`、`compensatedDistance`、`emitDesktopChatEvent`、`installPetInteractions`、`dragState`、`resetDragState`、`totalDistance`、`wasClick`、`petShellEl`、`canvasContainerEl`、`initialPreferences`、`runtimeUrl`、`activeNativeVoiceId`、`isEmbeddedWebExperience`、`useWebCloseCamera`、`isWebMobileViewport`、`webCameraPreferences`、`webRenderQualityPreferences`、`withWebRenderPreferences`、`effectivePreferences`、`vrmSystem`、`audioPlayer`、`chatService`、`buildSpeechProvider`、`speechProvider`、`chatSystem`、`mouseHitTest`、`removePetCursorPointListener`、`previousModelPath`、`nextChatService`

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code>import { VRMModelSystem } from './vrm-model-system.js';</code> | 导入依赖 `./vrm-model-system.js`，使本文件可以复用外部模块能力。 本行属于“桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。”这一文件职责。 |
| 2 | <code>import { TTSAudioPlayer } from './tts-audio-player.js';</code> | 导入依赖 `./tts-audio-player.js`，使本文件可以复用外部模块能力。 本行属于“桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。”这一文件职责。 |
| 3 | <code>import { ChatTTSSystem } from './chat-tts-system.js';</code> | 导入依赖 `./chat-tts-system.js`，使本文件可以复用外部模块能力。 本行属于“桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。”这一文件职责。 |
| 4 | <code>import { createChatService } from './chat-service.js';</code> | 导入依赖 `./chat-service.js`，使本文件可以复用外部模块能力。 本行属于“桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。”这一文件职责。 |
| 5 | <code>import { createSpeechProvider } from './speech-provider.js';</code> | 导入依赖 `./speech-provider.js`，使本文件可以复用外部模块能力。 本行属于“桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。”这一文件职责。 |
| 6 | <code>import { CONFIG, applyDesktopPreferencesToConfig } from './config.js';</code> | 导入依赖 `./config.js`，使本文件可以复用外部模块能力。 本行属于“桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。”这一文件职责。 |
| 7 | <code>import { installAvatarDialogueBubble } from './avatar-dialogue-bubble.js';</code> | 导入依赖 `./avatar-dialogue-bubble.js`，使本文件可以复用外部模块能力。 本行属于“桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。”这一文件职责。 |
| 8 | <code>import { installPetMouseHitTest } from './pet-mouse-hit-test.js';</code> | 导入依赖 `./pet-mouse-hit-test.js`，使本文件可以复用外部模块能力。 本行属于“桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。”这一文件职责。 |
| 9 | <code>import { setUiLanguage } from './i18n.js';</code> | 导入依赖 `./i18n.js`，使本文件可以复用外部模块能力。 本行属于“桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。”这一文件职责。 |
| 10 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 11 | <code>const PET_RENDER_AVATAR_REFERENCE_HEIGHT = 560;</code> | 声明局部标识符 `PET_RENDER_AVATAR_REFERENCE_HEIGHT`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。”这一文件职责。 |
| 12 | <code>const PET_RENDER_WINDOW_FRAME_HEIGHT = 960;</code> | 声明局部标识符 `PET_RENDER_WINDOW_FRAME_HEIGHT`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。”这一文件职责。 |
| 13 | <code>const PET_WINDOW_CAMERA_DISTANCE_RATIO = PET_RENDER_WINDOW_FRAME_HEIGHT / PET_RENDER_AVATAR_REFERENCE_HEIGHT;</code> | 声明局部标识符 `PET_WINDOW_CAMERA_DISTANCE_RATIO`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。”这一文件职责。 |
| 14 | <code>const WEB_RENDER_PROFILE_ID = 'ailis_bright_companion_mtoon';</code> | 声明局部标识符 `WEB_RENDER_PROFILE_ID`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。”这一文件职责。 |
| 15 | <code>const WEB_RENDER_SHADOW_PREFERENCES = Object.freeze({</code> | 声明局部标识符 `WEB_RENDER_SHADOW_PREFERENCES`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。”这一文件职责。 |
| 16 | <code>    renderShadowStrength: 0.16,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。”这一文件职责。 |
| 17 | <code>    renderShadowRange: 1.25</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。”这一文件职责。 |
| 18 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 19 | <code>const WEB_DESKTOP_RENDER_QUALITY_PREFERENCES = Object.freeze({</code> | 声明局部标识符 `WEB_DESKTOP_RENDER_QUALITY_PREFERENCES`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。”这一文件职责。 |
| 20 | <code>    renderResolutionScale: 1.25,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。”这一文件职责。 |
| 21 | <code>    renderShadowQuality: 2,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。”这一文件职责。 |
| 22 | <code>    renderFpsLimit: 60</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。”这一文件职责。 |
| 23 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 24 | <code>const WEB_MOBILE_RENDER_QUALITY_PREFERENCES = Object.freeze({</code> | 声明局部标识符 `WEB_MOBILE_RENDER_QUALITY_PREFERENCES`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。”这一文件职责。 |
| 25 | <code>    renderResolutionScale: 1,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。”这一文件职责。 |
| 26 | <code>    renderShadowQuality: 1,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。”这一文件职责。 |
| 27 | <code>    renderFpsLimit: 60</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。”这一文件职责。 |
| 28 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 29 | <code>const WEB_CLOSE_CAMERA_PREFERENCES = Object.freeze({</code> | 声明局部标识符 `WEB_CLOSE_CAMERA_PREFERENCES`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。”这一文件职责。 |
| 30 | <code>    cameraDistance: 1.34,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。”这一文件职责。 |
| 31 | <code>    cameraHeight: 1.28,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。”这一文件职责。 |
| 32 | <code>    cameraTargetY: 1.04</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。”这一文件职责。 |
| 33 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 34 | <code>const WEB_MOBILE_CAMERA_PREFERENCES = Object.freeze({</code> | 声明局部标识符 `WEB_MOBILE_CAMERA_PREFERENCES`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。”这一文件职责。 |
| 35 | <code>    cameraDistance: 1.48,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。”这一文件职责。 |
| 36 | <code>    cameraHeight: 1.3,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。”这一文件职责。 |
| 37 | <code>    cameraTargetY: 1.06</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。”这一文件职责。 |
| 38 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 39 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 40 | <code>function applyPetWindowFrameCameraCompensation() {</code> | 定义函数 `applyPetWindowFrameCameraCompensation`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。”这一文件职责。 |
| 41 | <code>    const compensatedDistance = CONFIG.CAMERA_POSITION.z * PET_WINDOW_CAMERA_DISTANCE_RATIO;</code> | 声明局部标识符 `compensatedDistance`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。”这一文件职责。 |
| 42 | <code>    CONFIG.CAMERA_POSITION.set(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。”这一文件职责。 |
| 43 | <code>        CONFIG.CAMERA_POSITION.x,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。”这一文件职责。 |
| 44 | <code>        CONFIG.CAMERA_POSITION.y,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。”这一文件职责。 |
| 45 | <code>        Number(compensatedDistance.toFixed(3))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。”这一文件职责。 |
| 46 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 47 | <code>    CONFIG.CAMERA_MIN_DISTANCE = Number(Math.max(0.55, compensatedDistance - 0.35).toFixed(2));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。”这一文件职责。 |
| 48 | <code>    CONFIG.CAMERA_MAX_DISTANCE = Number(Math.min(3.2, compensatedDistance + 0.6).toFixed(2));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。”这一文件职责。 |
| 49 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 50 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 51 | <code>function emitDesktopChatEvent(payload) {</code> | 定义函数 `emitDesktopChatEvent`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。”这一文件职责。 |
| 52 | <code>    window.ailisDesktop?.emitChatEvent?.(payload);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。”这一文件职责。 |
| 53 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 54 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 55 | <code>function installPetInteractions(rootElement) {</code> | 定义函数 `installPetInteractions`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。”这一文件职责。 |
| 56 | <code>    let dragState = null;</code> | 声明局部标识符 `dragState`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。”这一文件职责。 |
| 57 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 58 | <code>    const resetDragState = () =&gt; {</code> | 声明局部标识符 `resetDragState`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。”这一文件职责。 |
| 59 | <code>        dragState = null;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。”这一文件职责。 |
| 60 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 61 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 62 | <code>    rootElement.addEventListener('pointerdown', (event) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。”这一文件职责。 |
| 63 | <code>        if (event.button !== 0) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 64 | <code>            return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 65 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 66 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 67 | <code>        dragState = {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。”这一文件职责。 |
| 68 | <code>            pointerId: event.pointerId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。”这一文件职责。 |
| 69 | <code>            startX: event.screenX,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。”这一文件职责。 |
| 70 | <code>            startY: event.screenY,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。”这一文件职责。 |
| 71 | <code>            moved: false</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。”这一文件职责。 |
| 72 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 73 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 74 | <code>        window.ailisDesktop?.beginDragPetWindow?.();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。”这一文件职责。 |
| 75 | <code>        rootElement.setPointerCapture?.(event.pointerId);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。”这一文件职责。 |
| 76 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 77 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 78 | <code>    rootElement.addEventListener('pointermove', (event) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。”这一文件职责。 |
| 79 | <code>        if (!dragState &#124;&#124; event.pointerId !== dragState.pointerId) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 80 | <code>            return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 81 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 82 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 83 | <code>        const totalDistance = Math.abs(event.screenX - dragState.startX) +</code> | 声明局部标识符 `totalDistance`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。”这一文件职责。 |
| 84 | <code>            Math.abs(event.screenY - dragState.startY);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。”这一文件职责。 |
| 85 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 86 | <code>        if (totalDistance &gt; 4) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 87 | <code>            dragState.moved = true;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。”这一文件职责。 |
| 88 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 89 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 90 | <code>        if (dragState.moved) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 91 | <code>            window.ailisDesktop?.dragPetWindow?.();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。”这一文件职责。 |
| 92 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 93 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 94 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 95 | <code>    rootElement.addEventListener('pointerup', async (event) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。”这一文件职责。 |
| 96 | <code>        if (!dragState &#124;&#124; event.pointerId !== dragState.pointerId) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 97 | <code>            return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 98 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 99 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 100 | <code>        const wasClick = !dragState.moved;</code> | 声明局部标识符 `wasClick`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。”这一文件职责。 |
| 101 | <code>        resetDragState();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。”这一文件职责。 |
| 102 | <code>        window.ailisDesktop?.endDragPetWindow?.();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。”这一文件职责。 |
| 103 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 104 | <code>        if (wasClick) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 105 | <code>            await window.ailisDesktop?.showChatWindow?.();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。”这一文件职责。 |
| 106 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 107 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 108 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 109 | <code>    rootElement.addEventListener('pointercancel', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。”这一文件职责。 |
| 110 | <code>        resetDragState();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。”这一文件职责。 |
| 111 | <code>        window.ailisDesktop?.endDragPetWindow?.();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。”这一文件职责。 |
| 112 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 113 | <code>    rootElement.addEventListener('contextmenu', async (event) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。”这一文件职责。 |
| 114 | <code>        event.preventDefault();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。”这一文件职责。 |
| 115 | <code>        resetDragState();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。”这一文件职责。 |
| 116 | <code>        await window.ailisDesktop?.showControlMenu?.();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。”这一文件职责。 |
| 117 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 118 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 119 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 120 | <code>window.addEventListener('DOMContentLoaded', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。”这一文件职责。 |
| 121 | <code>    const petShellEl = document.getElementById('pet-shell');</code> | 声明局部标识符 `petShellEl`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。”这一文件职责。 |
| 122 | <code>    const canvasContainerEl = document.getElementById('canvas-container');</code> | 声明局部标识符 `canvasContainerEl`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。”这一文件职责。 |
| 123 | <code>    const initialPreferences = window.ailisDesktop?.preferences &#124;&#124; {};</code> | 声明局部标识符 `initialPreferences`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。”这一文件职责。 |
| 124 | <code>    const runtimeUrl = new URL(window.location.href);</code> | 声明局部标识符 `runtimeUrl`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。”这一文件职责。 |
| 125 | <code>    let activeNativeVoiceId = runtimeUrl.searchParams.get('ttsVoice')?.trim() &#124;&#124; '';</code> | 声明局部标识符 `activeNativeVoiceId`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。”这一文件职责。 |
| 126 | <code>    const isEmbeddedWebExperience = runtimeUrl.searchParams.get('web') === '1';</code> | 声明局部标识符 `isEmbeddedWebExperience`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。”这一文件职责。 |
| 127 | <code>    const useWebCloseCamera = isEmbeddedWebExperience &amp;&amp; runtimeUrl.searchParams.get('camera') === 'close';</code> | 声明局部标识符 `useWebCloseCamera`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。”这一文件职责。 |
| 128 | <code>    const isWebMobileViewport = window.matchMedia('(max-width: 760px)').matches;</code> | 声明局部标识符 `isWebMobileViewport`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。”这一文件职责。 |
| 129 | <code>    const webCameraPreferences = isWebMobileViewport</code> | 声明局部标识符 `webCameraPreferences`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。”这一文件职责。 |
| 130 | <code>        ? WEB_MOBILE_CAMERA_PREFERENCES</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。”这一文件职责。 |
| 131 | <code>        : WEB_CLOSE_CAMERA_PREFERENCES;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。”这一文件职责。 |
| 132 | <code>    const webRenderQualityPreferences = isWebMobileViewport</code> | 声明局部标识符 `webRenderQualityPreferences`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。”这一文件职责。 |
| 133 | <code>        ? WEB_MOBILE_RENDER_QUALITY_PREFERENCES</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。”这一文件职责。 |
| 134 | <code>        : WEB_DESKTOP_RENDER_QUALITY_PREFERENCES;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。”这一文件职责。 |
| 135 | <code>    const withWebRenderPreferences = (preferences = {}) =&gt; isEmbeddedWebExperience</code> | 声明局部标识符 `withWebRenderPreferences`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。”这一文件职责。 |
| 136 | <code>        ? {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。”这一文件职责。 |
| 137 | <code>            ...preferences,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。”这一文件职责。 |
| 138 | <code>            ...(useWebCloseCamera ? webCameraPreferences : {}),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。”这一文件职责。 |
| 139 | <code>            ...WEB_RENDER_SHADOW_PREFERENCES,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。”这一文件职责。 |
| 140 | <code>            ...webRenderQualityPreferences,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。”这一文件职责。 |
| 141 | <code>            renderProfileId: WEB_RENDER_PROFILE_ID</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。”这一文件职责。 |
| 142 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 143 | <code>        : preferences;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。”这一文件职责。 |
| 144 | <code>    const effectivePreferences = withWebRenderPreferences(initialPreferences);</code> | 声明局部标识符 `effectivePreferences`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。”这一文件职责。 |
| 145 | <code>    applyDesktopPreferencesToConfig(effectivePreferences);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。”这一文件职责。 |
| 146 | <code>    setUiLanguage(initialPreferences.uiLanguage &#124;&#124; 'zh-CN');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。”这一文件职责。 |
| 147 | <code>    if (!isEmbeddedWebExperience) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 148 | <code>        applyPetWindowFrameCameraCompensation();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。”这一文件职责。 |
| 149 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 150 | <code>    const vrmSystem = new VRMModelSystem();</code> | 声明局部标识符 `vrmSystem`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。”这一文件职责。 |
| 151 | <code>    installAvatarDialogueBubble({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。”这一文件职责。 |
| 152 | <code>        rootElement: petShellEl,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。”这一文件职责。 |
| 153 | <code>        variant: 'pet',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。”这一文件职责。 |
| 154 | <code>        avatarBoundsProvider: () =&gt; vrmSystem.getAvatarHitTestBounds?.()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。”这一文件职责。 |
| 155 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 156 | <code>    const audioPlayer = new TTSAudioPlayer(vrmSystem);</code> | 声明局部标识符 `audioPlayer`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。”这一文件职责。 |
| 157 | <code>    let chatService = createChatService(initialPreferences);</code> | 声明局部标识符 `chatService`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。”这一文件职责。 |
| 158 | <code>    const buildSpeechProvider = (speechMode = null, nativeVoiceId = activeNativeVoiceId) =&gt; createSpeechProvider({</code> | 声明局部标识符 `buildSpeechProvider`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。”这一文件职责。 |
| 159 | <code>        enableTTS: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。”这一文件职责。 |
| 160 | <code>        speechMode,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。”这一文件职责。 |
| 161 | <code>        nativeVoiceId</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。”这一文件职责。 |
| 162 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 163 | <code>    let speechProvider = buildSpeechProvider(initialPreferences.speechMode);</code> | 声明局部标识符 `speechProvider`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。”这一文件职责。 |
| 164 | <code>    const chatSystem = new ChatTTSSystem(vrmSystem, audioPlayer, chatService, {</code> | 声明局部标识符 `chatSystem`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。”这一文件职责。 |
| 165 | <code>        speechProvider,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。”这一文件职责。 |
| 166 | <code>        chunkedTtsEnabled: initialPreferences.chunkedTtsEnabled</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。”这一文件职责。 |
| 167 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 168 | <code>    const mouseHitTest = isEmbeddedWebExperience</code> | 声明局部标识符 `mouseHitTest`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。”这一文件职责。 |
| 169 | <code>        ? null</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。”这一文件职责。 |
| 170 | <code>        : installPetMouseHitTest({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。”这一文件职责。 |
| 171 | <code>            rootElement: petShellEl,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。”这一文件职责。 |
| 172 | <code>            canvasElement: canvasContainerEl,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。”这一文件职责。 |
| 173 | <code>            avatarBoundsProvider: () =&gt; vrmSystem.getAvatarHitTestBounds?.(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。”这一文件职责。 |
| 174 | <code>            preferences: initialPreferences</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。”这一文件职责。 |
| 175 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 176 | <code>    const removePetCursorPointListener = window.ailisDesktop?.onPetCursorPoint?.((payload = {}) =&gt; {</code> | 声明局部标识符 `removePetCursorPointListener`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。”这一文件职责。 |
| 177 | <code>        mouseHitTest?.handleCursorPoint?.(payload);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。”这一文件职责。 |
| 178 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 179 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 180 | <code>    window.addEventListener('ailis-chat-ui-event', (event) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。”这一文件职责。 |
| 181 | <code>        emitDesktopChatEvent(event.detail);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。”这一文件职责。 |
| 182 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 183 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 184 | <code>    window.ailisDesktop?.onChatMessageRequest?.((payload = {}) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。”这一文件职责。 |
| 185 | <code>        void chatSystem.sendExternalMessage(payload.content &#124;&#124; '', {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。”这一文件职责。 |
| 186 | <code>            attachments: payload.attachments &#124;&#124; [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。”这一文件职责。 |
| 187 | <code>            source: payload.source &#124;&#124; ''</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。”这一文件职责。 |
| 188 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 189 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 190 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 191 | <code>    window.ailisDesktop?.onChatControlRequest?.((payload = {}) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。”这一文件职责。 |
| 192 | <code>        if (payload.type === 'clear-conversation') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 193 | <code>            chatSystem.clearConversation();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。”这一文件职责。 |
| 194 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 195 | <code>        if (payload.type === 'interrupt-conversation') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 196 | <code>            void chatSystem.interruptCurrentTurn();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。”这一文件职责。 |
| 197 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 198 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 199 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 200 | <code>    window.ailisDesktop?.onChatStateSyncRequest?.(() =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。”这一文件职责。 |
| 201 | <code>        emitDesktopChatEvent({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。”这一文件职责。 |
| 202 | <code>            type: 'snapshot',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。”这一文件职责。 |
| 203 | <code>            messages: chatSystem.getTranscriptSnapshot(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。”这一文件职责。 |
| 204 | <code>            isBusy: chatSystem.isBusy</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。”这一文件职责。 |
| 205 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 206 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 207 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 208 | <code>    window.ailisDesktop?.onPreferencesUpdated?.(({ preferences = {} } = {}) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。”这一文件职责。 |
| 209 | <code>        const previousModelPath = CONFIG.MODEL_PATH;</code> | 声明局部标识符 `previousModelPath`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。”这一文件职责。 |
| 210 | <code>        applyDesktopPreferencesToConfig(withWebRenderPreferences(preferences));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。”这一文件职责。 |
| 211 | <code>        setUiLanguage(preferences.uiLanguage &#124;&#124; 'zh-CN');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。”这一文件职责。 |
| 212 | <code>        if (CONFIG.MODEL_PATH !== previousModelPath) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 213 | <code>            window.location.reload();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。”这一文件职责。 |
| 214 | <code>            return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 215 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 216 | <code>        if (!isEmbeddedWebExperience) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 217 | <code>            applyPetWindowFrameCameraCompensation();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。”这一文件职责。 |
| 218 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 219 | <code>        speechProvider?.dispose?.();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。”这一文件职责。 |
| 220 | <code>        speechProvider = buildSpeechProvider(preferences.speechMode);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。”这一文件职责。 |
| 221 | <code>        chatSystem.setSpeechProvider(speechProvider);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。”这一文件职责。 |
| 222 | <code>        const nextChatService = createChatService(preferences);</code> | 声明局部标识符 `nextChatService`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。”这一文件职责。 |
| 223 | <code>        if (nextChatService.conversationMode !== chatService.conversationMode) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 224 | <code>            chatService = nextChatService;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。”这一文件职责。 |
| 225 | <code>            chatSystem.setChatService(chatService);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。”这一文件职责。 |
| 226 | <code>            window.chatService = chatService;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。”这一文件职责。 |
| 227 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 228 | <code>        chatSystem.applyRuntimePreferences(preferences);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。”这一文件职责。 |
| 229 | <code>        vrmSystem.applyPreferences();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。”这一文件职责。 |
| 230 | <code>        mouseHitTest?.updatePreferences(preferences);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。”这一文件职责。 |
| 231 | <code>        window.speechProvider = speechProvider;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。”这一文件职责。 |
| 232 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 233 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 234 | <code>    if (!isEmbeddedWebExperience) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 235 | <code>        installPetInteractions(petShellEl);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。”这一文件职责。 |
| 236 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 237 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 238 | <code>    window.vrmSystem = vrmSystem;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。”这一文件职责。 |
| 239 | <code>    window.audioPlayer = audioPlayer;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。”这一文件职责。 |
| 240 | <code>    window.chatService = chatService;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。”这一文件职责。 |
| 241 | <code>    window.chatSystem = chatSystem;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。”这一文件职责。 |
| 242 | <code>    window.speechProvider = speechProvider;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。”这一文件职责。 |
| 243 | <code>    window.setAilisRenderProfile = (profileId) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。”这一文件职责。 |
| 244 | <code>        CONFIG.RENDER_PROFILE_ID = isEmbeddedWebExperience</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。”这一文件职责。 |
| 245 | <code>            ? WEB_RENDER_PROFILE_ID</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。”这一文件职责。 |
| 246 | <code>            : String(profileId &#124;&#124; '').trim() &#124;&#124; CONFIG.RENDER_PROFILE_ID;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。”这一文件职责。 |
| 247 | <code>        return vrmSystem.applyRenderProfile(CONFIG.RENDER_PROFILE_ID);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 248 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 249 | <code>    window.setAilisSpeechVoice = ({ speechMode = 'server', nativeVoiceId = '' } = {}) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。”这一文件职责。 |
| 250 | <code>        activeNativeVoiceId = String(nativeVoiceId &#124;&#124; '').trim();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。”这一文件职责。 |
| 251 | <code>        speechProvider?.dispose?.();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。”这一文件职责。 |
| 252 | <code>        speechProvider = buildSpeechProvider(speechMode, activeNativeVoiceId);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。”这一文件职责。 |
| 253 | <code>        chatSystem.setSpeechProvider(speechProvider);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。”这一文件职责。 |
| 254 | <code>        window.speechProvider = speechProvider;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。”这一文件职责。 |
| 255 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 256 | <code>            mode: speechProvider.mode,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。”这一文件职责。 |
| 257 | <code>            provider: speechProvider.getPrimaryModeLabel()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。”这一文件职责。 |
| 258 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 259 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 260 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 261 | <code>    vrmSystem.init('canvas-container');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。”这一文件职责。 |
| 262 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 263 | <code>    if (vrmSystem.scene) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 264 | <code>        vrmSystem.scene.background = null;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。”这一文件职责。 |
| 265 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 266 | <code>    if (vrmSystem.renderer) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 267 | <code>        vrmSystem.renderer.setClearColor(0x000000, 0);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。”这一文件职责。 |
| 268 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 269 | <code>    if (vrmSystem.controls) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 270 | <code>        vrmSystem.controls.enabled = false;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。”这一文件职责。 |
| 271 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 272 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 273 | <code>    await vrmSystem.loadModel();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。”这一文件职责。 |
| 274 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 275 | <code>    emitDesktopChatEvent({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。”这一文件职责。 |
| 276 | <code>        type: 'snapshot',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。”这一文件职责。 |
| 277 | <code>        messages: chatSystem.getTranscriptSnapshot(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。”这一文件职责。 |
| 278 | <code>        isBusy: chatSystem.isBusy</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。”这一文件职责。 |
| 279 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 280 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 281 | <code>    window.addEventListener('beforeunload', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。”这一文件职责。 |
| 282 | <code>        removePetCursorPointListener?.();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。”这一文件职责。 |
| 283 | <code>        mouseHitTest?.dispose?.();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。”这一文件职责。 |
| 284 | <code>        speechProvider?.dispose?.();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。”这一文件职责。 |
| 285 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 286 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
