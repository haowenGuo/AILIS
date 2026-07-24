# src/vrm-model-system.js 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。
- 文件类型：`source-code`
- 原始行数：1245
- SHA-256：`fab5bb15be9a94d0b2e6c924ff00f2d2ad717082526a41ffb1c2112e037e5237`
- 可运行副本：[打开源文件](../../../source/src/vrm-model-system.js)
- 依赖：`three`、`three/addons/loaders/GLTFLoader.js`、`three/addons/controls/OrbitControls.js`、`@pixiv/three-vrm`、`@pixiv/three-vrm-animation`、`./character/emote-controller.js`、`./character/character-runtime.js`、`./character/chatvrm-amica-motion-controller.js`、`./character/mtoon-render-profile-controller.js`、`./character/render-profiles.js`、`./character/vrm-driver.js`、`./config.js`
- 主要符号：`BASE_SCENE_CAMERA`、`AVATAR_HIT_TEST_BONES`、`AVATAR_HIT_TEST_CACHE_MS`、`BASE_PROFILE_LIGHT`、`GROUND_SHADOW_RECEIVER_SIZE`、`GROUND_SHADOW_TARGET_Y`、`GROUND_SHADOW_MIN_CAMERA_EXTENT`、`GROUND_SHADOW_MAX_CAMERA_EXTENT`、`SCENE_STATE_LIGHT_BOOSTS`、`clampNumber`、`numericValue`、`numberOr`、`applyLightConfig`、`getRenderLookSettings`、`look`、`rotateLightPosition`、`yaw`、`cosYaw`、`sinYaw`、`x`、`y`、`z`、`withLightLook`、`VRMModelSystem`、`container`、`fallbackPixelRatio`、`renderPixelRatio`、`material`、`geometry`、`box`、`size`、`center`、`bounds`、`maxBodyExtent`、`enabled`、`shadowTarget`、`shadow`、`shadowMapSize`、`camera`、`extent`、`count`、`lighting`、`profile`、`sceneMood`、`ambientMultiplier`、`keyMultiplier`、`ambientOffset`、`keyOffset`、`keyPosition`、`sceneKeyX`、`sceneKeyY`、`sceneKeyZ`、`stateBoost`、`normalizedProfileId`、`result`、`defaults`、`requestedCamera`、`requestedLight`、`sceneDistance`、`sceneHeight`、`sceneTargetY`、`profileLight`、`lerpAlpha`、`current`、`target`、`lerp`、`cameraDistance`、`humanoid`、`rect`、`projected`、`points`、`worldPosition`、`canvasRect`、`boneNode`、`screenPoint`、`corners`、`minX`、`maxX`、`minY`、`maxY`、`rawWidth`、`rawHeight`、`horizontalPadding`、`topPadding`、`bottomPadding`、`left`、`top`、`right`、`bottom`、`width`、`height`、`boneBounds`、`now`、`loader`、`gltf`、`percent`、`shadowCasterCount`、`animLoader`、`vrmAnimation`、`action`、`played`、`presetValue`、`fpsLimit`、`frameIntervalMs`、`currentTimestamp`、`elapsedMs`、`deltaTime`、`targetLipSyncValue`、`pulse`、`lipSyncSmoothing`、`safeValue`

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code>import * as THREE from 'three';</code> | 导入依赖 `three`，使本文件可以复用外部模块能力。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 2 | <code>import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';</code> | 导入依赖 `three/addons/loaders/GLTFLoader.js`，使本文件可以复用外部模块能力。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 3 | <code>import { OrbitControls } from 'three/addons/controls/OrbitControls.js';</code> | 导入依赖 `three/addons/controls/OrbitControls.js`，使本文件可以复用外部模块能力。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 4 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5 | <code>import { VRMLoaderPlugin, VRMUtils } from '@pixiv/three-vrm';</code> | 导入依赖 `@pixiv/three-vrm`，使本文件可以复用外部模块能力。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 6 | <code>import { createVRMAnimationClip, VRMAnimationLoaderPlugin } from '@pixiv/three-vrm-animation';</code> | 导入依赖 `@pixiv/three-vrm-animation`，使本文件可以复用外部模块能力。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 7 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 8 | <code>import { CharacterEmoteController } from './character/emote-controller.js';</code> | 导入依赖 `./character/emote-controller.js`，使本文件可以复用外部模块能力。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 9 | <code>import { CharacterRuntime } from './character/character-runtime.js';</code> | 导入依赖 `./character/character-runtime.js`，使本文件可以复用外部模块能力。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 10 | <code>import { ChatVRMAmicaMotionController } from './character/chatvrm-amica-motion-controller.js';</code> | 导入依赖 `./character/chatvrm-amica-motion-controller.js`，使本文件可以复用外部模块能力。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 11 | <code>import { MToonRenderProfileController } from './character/mtoon-render-profile-controller.js';</code> | 导入依赖 `./character/mtoon-render-profile-controller.js`，使本文件可以复用外部模块能力。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 12 | <code>import { getRenderProfile, normalizeRenderProfileId } from './character/render-profiles.js';</code> | 导入依赖 `./character/render-profiles.js`，使本文件可以复用外部模块能力。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 13 | <code>import { createVrmDriver } from './character/vrm-driver.js';</code> | 导入依赖 `./character/vrm-driver.js`，使本文件可以复用外部模块能力。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 14 | <code>import { CONFIG } from './config.js';</code> | 导入依赖 `./config.js`，使本文件可以复用外部模块能力。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 15 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 16 | <code>const BASE_SCENE_CAMERA = Object.freeze({</code> | 声明局部标识符 `BASE_SCENE_CAMERA`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 17 | <code>    distance: 1.1,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 18 | <code>    height: 1.3,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 19 | <code>    targetY: 1</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 20 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 21 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 22 | <code>const AVATAR_HIT_TEST_BONES = Object.freeze([</code> | 声明局部标识符 `AVATAR_HIT_TEST_BONES`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 23 | <code>    'hips',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 24 | <code>    'spine',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 25 | <code>    'chest',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 26 | <code>    'upperChest',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 27 | <code>    'neck',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 28 | <code>    'head',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 29 | <code>    'leftShoulder',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 30 | <code>    'leftUpperArm',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 31 | <code>    'leftLowerArm',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 32 | <code>    'leftHand',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 33 | <code>    'rightShoulder',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 34 | <code>    'rightUpperArm',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 35 | <code>    'rightLowerArm',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 36 | <code>    'rightHand',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 37 | <code>    'leftUpperLeg',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 38 | <code>    'leftLowerLeg',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 39 | <code>    'leftFoot',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 40 | <code>    'leftToes',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 41 | <code>    'rightUpperLeg',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 42 | <code>    'rightLowerLeg',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 43 | <code>    'rightFoot',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 44 | <code>    'rightToes'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 45 | <code>]);</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 46 | <code>const AVATAR_HIT_TEST_CACHE_MS = 75;</code> | 声明局部标识符 `AVATAR_HIT_TEST_CACHE_MS`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 47 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 48 | <code>const BASE_PROFILE_LIGHT = Object.freeze({</code> | 声明局部标识符 `BASE_PROFILE_LIGHT`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 49 | <code>    ambientIntensity: 2.2,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 50 | <code>    keyIntensity: 1,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 51 | <code>    keyX: 5,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 52 | <code>    keyY: 5,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 53 | <code>    keyZ: 5</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 54 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 55 | <code>const GROUND_SHADOW_RECEIVER_SIZE = 7.2;</code> | 声明局部标识符 `GROUND_SHADOW_RECEIVER_SIZE`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 56 | <code>const GROUND_SHADOW_TARGET_Y = 0.85;</code> | 声明局部标识符 `GROUND_SHADOW_TARGET_Y`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 57 | <code>const GROUND_SHADOW_MIN_CAMERA_EXTENT = 2.7;</code> | 声明局部标识符 `GROUND_SHADOW_MIN_CAMERA_EXTENT`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 58 | <code>const GROUND_SHADOW_MAX_CAMERA_EXTENT = 5.6;</code> | 声明局部标识符 `GROUND_SHADOW_MAX_CAMERA_EXTENT`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 59 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 60 | <code>const SCENE_STATE_LIGHT_BOOSTS = Object.freeze({</code> | 声明局部标识符 `SCENE_STATE_LIGHT_BOOSTS`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 61 | <code>    idle: { fill: 0, rim: 0 },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 62 | <code>    listening: { fill: 0.02, rim: 0.03 },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 63 | <code>    thinking: { fill: -0.04, rim: 0.1 },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 64 | <code>    speaking: { fill: 0.04, rim: 0.06 },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 65 | <code>    working: { fill: -0.06, rim: 0.14 },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 66 | <code>    waiting_approval: { fill: 0.01, rim: 0.04 },</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 67 | <code>    happy_success: { fill: 0.08, rim: 0.12 },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 68 | <code>    apologizing: { fill: -0.03, rim: -0.04 },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 69 | <code>    comforting: { fill: 0.06, rim: 0.02 },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 70 | <code>    blocked: { fill: -0.08, rim: 0.08 }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 71 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 72 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 73 | <code>function clampNumber(value, minimum, maximum, fallbackValue = minimum) {</code> | 定义函数 `clampNumber`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 74 | <code>    const numericValue = Number(value);</code> | 声明局部标识符 `numericValue`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 75 | <code>    if (!Number.isFinite(numericValue)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 76 | <code>        return fallbackValue;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 77 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 78 | <code>    return Math.min(Math.max(numericValue, minimum), maximum);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 79 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 80 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 81 | <code>function numberOr(value, fallbackValue) {</code> | 定义函数 `numberOr`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 82 | <code>    const numericValue = Number(value);</code> | 声明局部标识符 `numericValue`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 83 | <code>    return Number.isFinite(numericValue) ? numericValue : fallbackValue;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 84 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 85 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 86 | <code>function applyLightConfig(light, config = {}) {</code> | 定义函数 `applyLightConfig`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 87 | <code>    if (!light &#124;&#124; !config) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 88 | <code>        return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 89 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 90 | <code>    if (config.color) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 91 | <code>        light.color.set(config.color);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 92 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 93 | <code>    if ('intensity' in config) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 94 | <code>        light.intensity = clampNumber(config.intensity, 0, 5, light.intensity);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 95 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 96 | <code>    if (Array.isArray(config.position) &amp;&amp; config.position.length &gt;= 3) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 97 | <code>        light.position.set(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 98 | <code>            numberOr(config.position[0], light.position.x),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 99 | <code>            numberOr(config.position[1], light.position.y),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 100 | <code>            numberOr(config.position[2], light.position.z)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 101 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 102 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 103 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 104 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 105 | <code>function getRenderLookSettings() {</code> | 定义函数 `getRenderLookSettings`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 106 | <code>    const look = CONFIG.RENDER_LOOK &#124;&#124; {};</code> | 声明局部标识符 `look`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 107 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 108 | <code>        lightYawDeg: clampNumber(look.lightYawDeg, -75, 75, 0),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 109 | <code>        keyLightScale: clampNumber(look.keyLightScale, 0.65, 1.45, 1),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 110 | <code>        ambientFillScale: clampNumber(look.ambientFillScale, 0.55, 1.35, 1),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 111 | <code>        outlineScale: clampNumber(look.outlineScale, 0.25, 1.2, 1),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 112 | <code>        outlineEnabled: CONFIG.RENDER_OUTLINE_ENABLED !== false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 113 | <code>        shadowEnabled: look.shadowEnabled !== false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 114 | <code>        shadowStrength: clampNumber(look.shadowStrength, 0, 0.65, 0.22),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 115 | <code>        shadowRange: clampNumber(look.shadowRange, 0.65, 1.8, 1.8)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 116 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 117 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 118 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 119 | <code>function rotateLightPosition(position = [], yawDeg = 0) {</code> | 定义函数 `rotateLightPosition`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 120 | <code>    if (!Array.isArray(position) &#124;&#124; position.length &lt; 3) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 121 | <code>        return position;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 122 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 123 | <code>    const yaw = THREE.MathUtils.degToRad(yawDeg);</code> | 声明局部标识符 `yaw`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 124 | <code>    const cosYaw = Math.cos(yaw);</code> | 声明局部标识符 `cosYaw`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 125 | <code>    const sinYaw = Math.sin(yaw);</code> | 声明局部标识符 `sinYaw`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 126 | <code>    const x = numberOr(position[0], 0);</code> | 声明局部标识符 `x`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 127 | <code>    const y = numberOr(position[1], 0);</code> | 声明局部标识符 `y`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 128 | <code>    const z = numberOr(position[2], 0);</code> | 声明局部标识符 `z`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 129 | <code>    return [</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 130 | <code>        Number((x * cosYaw + z * sinYaw).toFixed(3)),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 131 | <code>        y,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 132 | <code>        Number((-x * sinYaw + z * cosYaw).toFixed(3))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 133 | <code>    ];</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 134 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 135 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 136 | <code>function withLightLook(config = {}, { intensityScale = 1, yawDeg = 0 } = {}) {</code> | 定义函数 `withLightLook`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 137 | <code>    if (!config) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 138 | <code>        return config;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 139 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 140 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 141 | <code>        ...config,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 142 | <code>        intensity: 'intensity' in config</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 143 | <code>            ? clampNumber(numberOr(config.intensity, 0) * intensityScale, 0, 5, config.intensity)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 144 | <code>            : config.intensity,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 145 | <code>        position: Array.isArray(config.position)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 146 | <code>            ? rotateLightPosition(config.position, yawDeg)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 147 | <code>            : config.position</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 148 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 149 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 150 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 151 | <code>export class VRMModelSystem {</code> | 定义类 `VRMModelSystem`，把相关状态与行为收拢为一个运行时对象。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 152 | <code>    constructor() {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 153 | <code>        this.scene = null;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 154 | <code>        this.camera = null;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 155 | <code>        this.renderer = null;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 156 | <code>        this.controls = null;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 157 | <code>        this.ambientLight = null;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 158 | <code>        this.directionalLight = null;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 159 | <code>        this.fillLight = null;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 160 | <code>        this.rimLight = null;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 161 | <code>        this.shadowReceiver = null;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 162 | <code>        this.sceneMoodTarget = null;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 163 | <code>        this.sceneMoodCurrent = null;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 164 | <code>        this.clock = new THREE.Clock();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 165 | <code>        this.lastRenderTimestamp = 0;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 166 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 167 | <code>        this.vrm = null;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 168 | <code>        this.mixer = null;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 169 | <code>        this.actionMap = {};</code> | 注册事件处理：当用户操作、生命周期或运行时事件发生时调用相应逻辑。 |
| 170 | <code>        this.currentAction = null;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 171 | <code>        this.motionController = new ChatVRMAmicaMotionController({</code> | 注册事件处理：当用户操作、生命周期或运行时事件发生时调用相应逻辑。 |
| 172 | <code>            idleActions: CONFIG.IDLE_ACTION_LIST,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 173 | <code>            danceActions: CONFIG.DANCE_ACTION_LIST,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 174 | <code>            crossFadeDuration: CONFIG.CROSS_FADE_DURATION,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 175 | <code>            logger: console</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 176 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 177 | <code>        this.currentSurfaceState = null;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 178 | <code>        this.activeRenderProfileId = normalizeRenderProfileId(CONFIG.RENDER_PROFILE_ID);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 179 | <code>        this.renderProfileController = null;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 180 | <code>        this.avatarHitTestBounds = null;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 181 | <code>        this.avatarHitTestBoundsUpdatedAt = 0;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 182 | <code>        this.avatarProjectionScratch = new THREE.Vector3();</code> | 注册事件处理：当用户操作、生命周期或运行时事件发生时调用相应逻辑。 |
| 183 | <code>        this.avatarWorldPositionScratch = new THREE.Vector3();</code> | 注册事件处理：当用户操作、生命周期或运行时事件发生时调用相应逻辑。 |
| 184 | <code>        this.avatarBoxScratch = new THREE.Box3();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 185 | <code>        this.avatarBoxCornerScratch = Array.from({ length: 8 }, () =&gt; new THREE.Vector3());</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 186 | <code>        this.characterRuntime = new CharacterRuntime({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 187 | <code>            driver: createVrmDriver(this)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 188 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 189 | <code>        this.characterEmoteController = new CharacterEmoteController({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 190 | <code>            getExpressionPresets: () =&gt; this.getExpressionPresets(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 191 | <code>            defaultMix: { relaxed: 0.18 }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 192 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 193 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 194 | <code>        this.isModelLoaded = false;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 195 | <code>        this.autoBlinkEnabled = true;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 196 | <code>        this.nextBlinkTime = 0;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 197 | <code>        this.blinkTimer = 0;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 198 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 199 | <code>        // 口型状态：优先由真实音频驱动，兜底才用正弦波。</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 200 | <code>        this.isSpeaking = false;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 201 | <code>        this.useExternalLipSync = false;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 202 | <code>        this.speakTimeAccumulator = 0;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 203 | <code>        this.externalLipSyncValue = 0;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 204 | <code>        this.smoothedLipSyncValue = 0;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 205 | <code>        this.speechIdleResetTimer = null;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 206 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 207 | <code>        this.activeExpressions = new Set();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 208 | <code>        this.expressionResetTimer = null;</code> | 注册事件处理：当用户操作、生命周期或运行时事件发生时调用相应逻辑。 |
| 209 | <code>        this.animate = this.animate.bind(this);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 210 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 211 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 212 | <code>    isBlinkExpression(expressionName) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 213 | <code>        return ['blink', 'blinkLeft', 'blinkRight'].includes(expressionName);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 214 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 215 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 216 | <code>    hasActiveBlinkExpression() {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 217 | <code>        for (const expressionName of this.activeExpressions) {</code> | 声明局部标识符 `expressionName`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 218 | <code>            if (this.isBlinkExpression(expressionName)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 219 | <code>                return true;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 220 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 221 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 222 | <code>        return false;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 223 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 224 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 225 | <code>    hasBlockingEmotionExpression() {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 226 | <code>        for (const expressionName of this.activeExpressions) {</code> | 声明局部标识符 `expressionName`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 227 | <code>            if (</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 228 | <code>                expressionName !== 'aa' &amp;&amp;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 229 | <code>                !this.isBlinkExpression(expressionName)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 230 | <code>            ) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 231 | <code>                return true;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 232 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 233 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 234 | <code>        return false;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 235 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 236 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 237 | <code>    getExpressionPresets() {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 238 | <code>        return { ...CONFIG.EXPRESSION_PRESETS };</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 239 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 240 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 241 | <code>    getExpressionPresetValue(expressionName) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 242 | <code>        return CONFIG.EXPRESSION_PRESETS[expressionName];</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 243 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 244 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 245 | <code>    setExpressionPresetValue(expressionName, value) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 246 | <code>        if (!(expressionName in CONFIG.EXPRESSION_PRESETS)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 247 | <code>            console.warn(`⚠️ 表情预设 "${expressionName}" 不存在，无法更新`);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 248 | <code>            return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 249 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 250 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 251 | <code>        CONFIG.EXPRESSION_PRESETS[expressionName] = THREE.MathUtils.clamp(value, 0, 1);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 252 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 253 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 254 | <code>    init(containerId) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 255 | <code>        const container = document.getElementById(containerId);</code> | 声明局部标识符 `container`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 256 | <code>        if (!container) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 257 | <code>            console.error('❌ 画布容器不存在');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 258 | <code>            return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 259 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 260 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 261 | <code>        this.scene = new THREE.Scene();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 262 | <code>        this.scene.background = new THREE.Color(0xf0f8ff);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 263 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 264 | <code>        this.camera = new THREE.PerspectiveCamera(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 265 | <code>            75,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 266 | <code>            container.clientWidth / container.clientHeight,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 267 | <code>            0.1,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 268 | <code>            1000</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 269 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 270 | <code>        this.camera.position.copy(CONFIG.CAMERA_POSITION);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 271 | <code>        this.camera.lookAt(CONFIG.CAMERA_TARGET);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 272 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 273 | <code>        this.renderer = new THREE.WebGLRenderer({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 274 | <code>            antialias: CONFIG.RENDER_ANTIALIAS_ENABLED !== false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 275 | <code>            alpha: true</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 276 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 277 | <code>        this.renderer.setSize(container.clientWidth, container.clientHeight);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 278 | <code>        this.applyRendererQualitySettings();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 279 | <code>        this.renderer.shadowMap.enabled = true;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 280 | <code>        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 281 | <code>        container.appendChild(this.renderer.domElement);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 282 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 283 | <code>        this.controls = new OrbitControls(this.camera, this.renderer.domElement);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 284 | <code>        this.controls.enableDamping = true;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 285 | <code>        this.controls.dampingFactor = 0.05;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 286 | <code>        this.controls.target.copy(CONFIG.CAMERA_TARGET);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 287 | <code>        this.controls.enablePan = false;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 288 | <code>        this.controls.minDistance = CONFIG.CAMERA_MIN_DISTANCE;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 289 | <code>        this.controls.maxDistance = CONFIG.CAMERA_MAX_DISTANCE;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 290 | <code>        this.controls.minPolarAngle = Math.PI * 0.3;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 291 | <code>        this.controls.maxPolarAngle = Math.PI * 0.7;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 292 | <code>        this.controls.minAzimuthAngle = -Math.PI / 6;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 293 | <code>        this.controls.maxAzimuthAngle = Math.PI / 6;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 294 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 295 | <code>        this.initLight();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 296 | <code>        this.applyPreferences();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 297 | <code>        window.addEventListener('resize', () =&gt; this.onWindowResize(container));</code> | 注册事件处理：当用户操作、生命周期或运行时事件发生时调用相应逻辑。 |
| 298 | <code>        this.animate();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 299 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 300 | <code>        console.log('✅ 3D场景初始化完成');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 301 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 302 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 303 | <code>    applyPreferences() {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 304 | <code>        if (!this.camera &#124;&#124; !this.controls) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 305 | <code>            return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 306 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 307 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 308 | <code>        this.camera.position.copy(CONFIG.CAMERA_POSITION);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 309 | <code>        this.controls.target.copy(CONFIG.CAMERA_TARGET);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 310 | <code>        this.controls.minDistance = CONFIG.CAMERA_MIN_DISTANCE;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 311 | <code>        this.controls.maxDistance = CONFIG.CAMERA_MAX_DISTANCE;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 312 | <code>        this.camera.lookAt(CONFIG.CAMERA_TARGET);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 313 | <code>        this.camera.updateProjectionMatrix();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 314 | <code>        this.controls.update();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 315 | <code>        this.applyRendererQualitySettings();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 316 | <code>        this.applyRenderProfile(CONFIG.RENDER_PROFILE_ID, {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 317 | <code>            syncSceneMood: Boolean(this.isModelLoaded)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 318 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 319 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 320 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 321 | <code>    applyRendererQualitySettings() {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 322 | <code>        if (!this.renderer) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 323 | <code>            return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 324 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 325 | <code>        const fallbackPixelRatio = clampNumber(CONFIG.RENDER_PIXEL_RATIO, 0.5, 3, 2);</code> | 声明局部标识符 `fallbackPixelRatio`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 326 | <code>        const renderPixelRatio = clampNumber(CONFIG.RENDER_RESOLUTION_SCALE, 0.5, 3, fallbackPixelRatio);</code> | 声明局部标识符 `renderPixelRatio`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 327 | <code>        this.renderer.setPixelRatio(renderPixelRatio);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 328 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 329 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 330 | <code>    initLight() {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 331 | <code>        this.ambientLight = new THREE.AmbientLight(0xffffff, 2.2);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 332 | <code>        this.directionalLight = new THREE.DirectionalLight(0xffffff, 1);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 333 | <code>        this.fillLight = new THREE.DirectionalLight(0xdfeaff, 0.28);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 334 | <code>        this.rimLight = new THREE.DirectionalLight(0xd9ecff, 0.22);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 335 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 336 | <code>        this.directionalLight.position.set(5, 5, 5);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 337 | <code>        this.directionalLight.castShadow = true;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 338 | <code>        this.scene.add(this.directionalLight.target);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 339 | <code>        this.fillLight.position.set(-4, 3, 4);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 340 | <code>        this.rimLight.position.set(-4, 4, -4);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 341 | <code>        this.scene.add(this.ambientLight);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 342 | <code>        this.scene.add(this.directionalLight);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 343 | <code>        this.scene.add(this.fillLight);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 344 | <code>        this.scene.add(this.rimLight);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 345 | <code>        this.initShadowReceiver();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 346 | <code>        this.applyRenderProfileLighting(this.getActiveRenderProfile());</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 347 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 348 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 349 | <code>    initShadowReceiver() {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 350 | <code>        if (!this.scene &#124;&#124; this.shadowReceiver) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 351 | <code>            return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 352 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 353 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 354 | <code>        const material = new THREE.ShadowMaterial({</code> | 声明局部标识符 `material`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 355 | <code>            color: 0x202033,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 356 | <code>            opacity: 0.22,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 357 | <code>            transparent: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 358 | <code>            depthWrite: false</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 359 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 360 | <code>        const geometry = new THREE.PlaneGeometry(GROUND_SHADOW_RECEIVER_SIZE, GROUND_SHADOW_RECEIVER_SIZE);</code> | 声明局部标识符 `geometry`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 361 | <code>        this.shadowReceiver = new THREE.Mesh(geometry, material);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 362 | <code>        this.shadowReceiver.name = 'AILIS_ShadowMap_Receiver';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 363 | <code>        this.shadowReceiver.rotation.x = -Math.PI / 2;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 364 | <code>        this.shadowReceiver.position.set(0, -0.015, 0);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 365 | <code>        this.shadowReceiver.receiveShadow = true;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 366 | <code>        this.shadowReceiver.castShadow = false;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 367 | <code>        this.shadowReceiver.renderOrder = -10;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 368 | <code>        this.scene.add(this.shadowReceiver);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 369 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 370 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 371 | <code>    getVrmWorldBounds() {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 372 | <code>        if (!this.vrm?.scene) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 373 | <code>            return null;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 374 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 375 | <code>        const box = new THREE.Box3().setFromObject(this.vrm.scene);</code> | 声明局部标识符 `box`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 376 | <code>        if (box.isEmpty()) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 377 | <code>            return null;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 378 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 379 | <code>        const size = new THREE.Vector3();</code> | 声明局部标识符 `size`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 380 | <code>        const center = new THREE.Vector3();</code> | 声明局部标识符 `center`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 381 | <code>        box.getSize(size);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 382 | <code>        box.getCenter(center);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 383 | <code>        return { box, size, center };</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 384 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 385 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 386 | <code>    getGroundShadowTarget() {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 387 | <code>        const bounds = this.getVrmWorldBounds();</code> | 声明局部标识符 `bounds`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 388 | <code>        if (!bounds) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 389 | <code>            return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 390 | <code>                center: new THREE.Vector3(0, GROUND_SHADOW_TARGET_Y, 0),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 391 | <code>                groundY: -0.015,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 392 | <code>                extent: GROUND_SHADOW_MIN_CAMERA_EXTENT</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 393 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 394 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 395 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 396 | <code>        const maxBodyExtent = Math.max(bounds.size.x, bounds.size.y, bounds.size.z, 1.8);</code> | 声明局部标识符 `maxBodyExtent`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 397 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 398 | <code>            center: new THREE.Vector3(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 399 | <code>                bounds.center.x,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 400 | <code>                bounds.box.min.y + Math.max(bounds.size.y * 0.52, GROUND_SHADOW_TARGET_Y),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 401 | <code>                bounds.center.z</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 402 | <code>            ),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 403 | <code>            groundY: bounds.box.min.y - 0.015,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 404 | <code>            extent: clampNumber(maxBodyExtent * 1.55, GROUND_SHADOW_MIN_CAMERA_EXTENT, GROUND_SHADOW_MAX_CAMERA_EXTENT, 3.2)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 405 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 406 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 407 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 408 | <code>    applyRenderShadowSettings() {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 409 | <code>        const look = getRenderLookSettings();</code> | 声明局部标识符 `look`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 410 | <code>        const enabled = Boolean(look.shadowEnabled &amp;&amp; look.shadowStrength &gt; 0);</code> | 声明局部标识符 `enabled`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 411 | <code>        const shadowTarget = this.getGroundShadowTarget();</code> | 声明局部标识符 `shadowTarget`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 412 | <code>        if (this.renderer) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 413 | <code>            this.renderer.shadowMap.enabled = enabled;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 414 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 415 | <code>        if (this.directionalLight) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 416 | <code>            this.directionalLight.castShadow = enabled;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 417 | <code>            if (this.directionalLight.target) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 418 | <code>                this.directionalLight.target.position.copy(shadowTarget.center);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 419 | <code>                this.directionalLight.target.updateMatrixWorld();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 420 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 421 | <code>            const shadow = this.directionalLight.shadow;</code> | 声明局部标识符 `shadow`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 422 | <code>            if (shadow) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 423 | <code>                const shadowMapSize = Math.round(clampNumber(CONFIG.RENDER_SHADOW_MAP_SIZE, 512, 2048, 2048));</code> | 声明局部标识符 `shadowMapSize`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 424 | <code>                shadow.mapSize.width = shadowMapSize;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 425 | <code>                shadow.mapSize.height = shadowMapSize;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 426 | <code>                shadow.bias = -0.00012;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 427 | <code>                shadow.normalBias = 0.012;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 428 | <code>                shadow.radius = 2.4;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 429 | <code>                const camera = shadow.camera;</code> | 声明局部标识符 `camera`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 430 | <code>                const extent = clampNumber(</code> | 声明局部标识符 `extent`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 431 | <code>                    shadowTarget.extent * look.shadowRange,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 432 | <code>                    GROUND_SHADOW_MIN_CAMERA_EXTENT,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 433 | <code>                    GROUND_SHADOW_MAX_CAMERA_EXTENT,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 434 | <code>                    3.2</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 435 | <code>                );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 436 | <code>                camera.near = 0.05;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 437 | <code>                camera.far = Math.max(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 438 | <code>                    14,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 439 | <code>                    this.directionalLight.position.distanceTo(shadowTarget.center) + extent * 2.4</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 440 | <code>                );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 441 | <code>                camera.left = -extent;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 442 | <code>                camera.right = extent;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 443 | <code>                camera.top = extent;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 444 | <code>                camera.bottom = -extent;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 445 | <code>                camera.updateProjectionMatrix();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 446 | <code>                shadow.needsUpdate = true;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 447 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 448 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 449 | <code>        if (this.shadowReceiver) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 450 | <code>            this.shadowReceiver.visible = enabled;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 451 | <code>            this.shadowReceiver.position.set(shadowTarget.center.x, shadowTarget.groundY, shadowTarget.center.z);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 452 | <code>            this.shadowReceiver.scale.setScalar(1);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 453 | <code>            if (this.shadowReceiver.material) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 454 | <code>                this.shadowReceiver.material.opacity = look.shadowStrength;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 455 | <code>                this.shadowReceiver.material.needsUpdate = true;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 456 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 457 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 458 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 459 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 460 | <code>    setupVrmShadowCasting() {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 461 | <code>        if (!this.vrm?.scene) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 462 | <code>            return 0;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 463 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 464 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 465 | <code>        let count = 0;</code> | 声明局部标识符 `count`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 466 | <code>        this.vrm.scene.traverse((node) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 467 | <code>            if (!node?.isMesh &amp;&amp; !node?.isSkinnedMesh) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 468 | <code>                return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 469 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 470 | <code>            node.castShadow = true;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 471 | <code>            node.receiveShadow = false;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 472 | <code>            count += 1;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 473 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 474 | <code>        return count;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 475 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 476 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 477 | <code>    getActiveRenderProfile() {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 478 | <code>        return getRenderProfile(this.activeRenderProfileId &#124;&#124; CONFIG.RENDER_PROFILE_ID);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 479 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 480 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 481 | <code>    applyRenderProfileLighting(profile = this.getActiveRenderProfile()) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 482 | <code>        const lighting = profile?.lighting &#124;&#124; {};</code> | 声明局部标识符 `lighting`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 483 | <code>        const look = getRenderLookSettings();</code> | 声明局部标识符 `look`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 484 | <code>        applyLightConfig(this.ambientLight, withLightLook(lighting.ambient, {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 485 | <code>            intensityScale: look.ambientFillScale</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 486 | <code>        }));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 487 | <code>        applyLightConfig(this.directionalLight, withLightLook(lighting.key, {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 488 | <code>            intensityScale: look.keyLightScale,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 489 | <code>            yawDeg: look.lightYawDeg</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 490 | <code>        }));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 491 | <code>        applyLightConfig(this.fillLight, withLightLook(lighting.fill, {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 492 | <code>            intensityScale: look.ambientFillScale,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 493 | <code>            yawDeg: look.lightYawDeg</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 494 | <code>        }));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 495 | <code>        applyLightConfig(this.rimLight, withLightLook(lighting.rim, {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 496 | <code>            intensityScale: Math.sqrt(look.keyLightScale),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 497 | <code>            yawDeg: look.lightYawDeg</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 498 | <code>        }));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 499 | <code>        this.applyRenderShadowSettings();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 500 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 501 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 502 | <code>    applyRenderProfileSceneLight(light = {}, stateName = 'idle') {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 503 | <code>        const profile = this.getActiveRenderProfile();</code> | 声明局部标识符 `profile`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 504 | <code>        const sceneMood = profile?.lighting?.sceneMood &#124;&#124; {};</code> | 声明局部标识符 `sceneMood`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 505 | <code>        const look = getRenderLookSettings();</code> | 声明局部标识符 `look`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 506 | <code>        const ambientMultiplier = numberOr(sceneMood.ambientMultiplier, 1);</code> | 声明局部标识符 `ambientMultiplier`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 507 | <code>        const keyMultiplier = numberOr(sceneMood.keyMultiplier, 1);</code> | 声明局部标识符 `keyMultiplier`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 508 | <code>        const ambientOffset = numberOr(sceneMood.ambientOffset, 0);</code> | 声明局部标识符 `ambientOffset`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 509 | <code>        const keyOffset = numberOr(sceneMood.keyOffset, 0);</code> | 声明局部标识符 `keyOffset`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 510 | <code>        const keyPosition = rotateLightPosition(profile?.lighting?.key?.position &#124;&#124; [], look.lightYawDeg);</code> | 声明局部标识符 `keyPosition`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 511 | <code>        const sceneKeyX = numberOr(light.keyX, BASE_PROFILE_LIGHT.keyX);</code> | 声明局部标识符 `sceneKeyX`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 512 | <code>        const sceneKeyY = numberOr(light.keyY, BASE_PROFILE_LIGHT.keyY);</code> | 声明局部标识符 `sceneKeyY`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 513 | <code>        const sceneKeyZ = numberOr(light.keyZ, BASE_PROFILE_LIGHT.keyZ);</code> | 声明局部标识符 `sceneKeyZ`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 514 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 515 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 516 | <code>            state: stateName,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 517 | <code>            ambientIntensity: clampNumber(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 518 | <code>                (numberOr(light.ambientIntensity, BASE_PROFILE_LIGHT.ambientIntensity) * ambientMultiplier + ambientOffset) *</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 519 | <code>                    look.ambientFillScale,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 520 | <code>                0.4,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 521 | <code>                4,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 522 | <code>                BASE_PROFILE_LIGHT.ambientIntensity</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 523 | <code>            ),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 524 | <code>            keyIntensity: clampNumber(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 525 | <code>                (numberOr(light.keyIntensity, BASE_PROFILE_LIGHT.keyIntensity) * keyMultiplier + keyOffset) *</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 526 | <code>                    look.keyLightScale,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 527 | <code>                0.1,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 528 | <code>                3,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 529 | <code>                BASE_PROFILE_LIGHT.keyIntensity</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 530 | <code>            ),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 531 | <code>            keyX: numberOr(keyPosition?.[0], BASE_PROFILE_LIGHT.keyX) +</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 532 | <code>                (sceneKeyX - BASE_PROFILE_LIGHT.keyX),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 533 | <code>            keyY: numberOr(keyPosition?.[1], BASE_PROFILE_LIGHT.keyY) +</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 534 | <code>                (sceneKeyY - BASE_PROFILE_LIGHT.keyY),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 535 | <code>            keyZ: numberOr(keyPosition?.[2], BASE_PROFILE_LIGHT.keyZ) +</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 536 | <code>                (sceneKeyZ - BASE_PROFILE_LIGHT.keyZ)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 537 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 538 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 539 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 540 | <code>    updateAuxiliaryRenderProfileLights(currentMood = {}) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 541 | <code>        const profile = this.getActiveRenderProfile();</code> | 声明局部标识符 `profile`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 542 | <code>        const lighting = profile?.lighting &#124;&#124; {};</code> | 声明局部标识符 `lighting`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 543 | <code>        const sceneMood = lighting.sceneMood &#124;&#124; {};</code> | 声明局部标识符 `sceneMood`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 544 | <code>        const stateBoost = SCENE_STATE_LIGHT_BOOSTS[currentMood.state] &#124;&#124; SCENE_STATE_LIGHT_BOOSTS.idle;</code> | 声明局部标识符 `stateBoost`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 545 | <code>        const look = getRenderLookSettings();</code> | 声明局部标识符 `look`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 546 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 547 | <code>        if (this.fillLight &amp;&amp; lighting.fill) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 548 | <code>            this.fillLight.intensity = clampNumber(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 549 | <code>                numberOr(lighting.fill.intensity, 0) * look.ambientFillScale +</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 550 | <code>                    numberOr(sceneMood.fillMoodInfluence, 0) * stateBoost.fill,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 551 | <code>                0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 552 | <code>                2,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 553 | <code>                numberOr(lighting.fill.intensity, 0)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 554 | <code>            );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 555 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 556 | <code>        if (this.rimLight &amp;&amp; lighting.rim) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 557 | <code>            this.rimLight.intensity = clampNumber(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 558 | <code>                numberOr(lighting.rim.intensity, 0) * Math.sqrt(look.keyLightScale) +</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 559 | <code>                    numberOr(sceneMood.rimMoodInfluence, 0) * stateBoost.rim,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 560 | <code>                0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 561 | <code>                2,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 562 | <code>                numberOr(lighting.rim.intensity, 0)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 563 | <code>            );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 564 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 565 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 566 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 567 | <code>    applyRenderProfile(profileId = CONFIG.RENDER_PROFILE_ID, { syncSceneMood = true } = {}) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 568 | <code>        const normalizedProfileId = normalizeRenderProfileId(profileId);</code> | 声明局部标识符 `normalizedProfileId`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 569 | <code>        const profile = getRenderProfile(normalizedProfileId);</code> | 声明局部标识符 `profile`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 570 | <code>        this.activeRenderProfileId = normalizedProfileId;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 571 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 572 | <code>        this.applyRenderProfileLighting(profile);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 573 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 574 | <code>        if (this.vrm) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 575 | <code>            if (!this.renderProfileController) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 576 | <code>                this.renderProfileController = new MToonRenderProfileController({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 577 | <code>                    vrm: this.vrm,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 578 | <code>                    logger: console</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 579 | <code>                });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 580 | <code>                this.renderProfileController.bindVrm(this.vrm);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 581 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 582 | <code>            const result = this.renderProfileController.apply(normalizedProfileId, getRenderLookSettings());</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 583 | <code>            console.log('🎨 AILIS 渲染方案已应用:', profile.label, result.materialSummary, result.outlineSummary);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 584 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 585 | <code>        this.applyRenderShadowSettings();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 586 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 587 | <code>        if (syncSceneMood &amp;&amp; this.characterRuntime?.updateSceneMoodForCurrentSurface) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 588 | <code>            this.sceneMoodCurrent = null;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 589 | <code>            this.characterRuntime.updateSceneMoodForCurrentSurface('render_profile_update', {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 590 | <code>                force: true</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 591 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 592 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 593 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 594 | <code>        return true;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 595 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 596 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 597 | <code>    getDefaultSceneMood() {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 598 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 599 | <code>            state: 'idle',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 600 | <code>            camera: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 601 | <code>                distance: CONFIG.CAMERA_POSITION.z,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 602 | <code>                height: CONFIG.CAMERA_POSITION.y,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 603 | <code>                targetY: CONFIG.CAMERA_TARGET.y,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 604 | <code>                yaw: 0</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 605 | <code>            },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 606 | <code>            light: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 607 | <code>                ambientIntensity: this.ambientLight?.intensity ?? 2.2,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 608 | <code>                keyIntensity: this.directionalLight?.intensity ?? 1,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 609 | <code>                keyX: this.directionalLight?.position?.x ?? 5,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 610 | <code>                keyY: this.directionalLight?.position?.y ?? 5,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 611 | <code>                keyZ: this.directionalLight?.position?.z ?? 5</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 612 | <code>            },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 613 | <code>            background: '#f0f8ff'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 614 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 615 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 616 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 617 | <code>    normalizeSceneMood(sceneMood = {}) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 618 | <code>        const defaults = this.getDefaultSceneMood();</code> | 声明局部标识符 `defaults`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 619 | <code>        const requestedCamera = sceneMood.camera &#124;&#124; {};</code> | 声明局部标识符 `requestedCamera`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 620 | <code>        const requestedLight = sceneMood.light &#124;&#124; {};</code> | 声明局部标识符 `requestedLight`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 621 | <code>        const sceneDistance = Number(requestedCamera.distance) &#124;&#124; BASE_SCENE_CAMERA.distance;</code> | 声明局部标识符 `sceneDistance`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 622 | <code>        const sceneHeight = Number(requestedCamera.height) &#124;&#124; BASE_SCENE_CAMERA.height;</code> | 声明局部标识符 `sceneHeight`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 623 | <code>        const sceneTargetY = Number(requestedCamera.targetY) &#124;&#124; BASE_SCENE_CAMERA.targetY;</code> | 声明局部标识符 `sceneTargetY`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 624 | <code>        const profileLight = this.applyRenderProfileSceneLight(</code> | 声明局部标识符 `profileLight`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 625 | <code>            {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 626 | <code>                ambientIntensity: requestedLight.ambientIntensity,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 627 | <code>                keyIntensity: requestedLight.keyIntensity,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 628 | <code>                keyX: requestedLight.keyX,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 629 | <code>                keyY: requestedLight.keyY,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 630 | <code>                keyZ: requestedLight.keyZ</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 631 | <code>            },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 632 | <code>            sceneMood.state &#124;&#124; defaults.state &#124;&#124; 'idle'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 633 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 634 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 635 | <code>            state: sceneMood.state &#124;&#124; defaults.state &#124;&#124; 'idle',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 636 | <code>            camera: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 637 | <code>                distance: defaults.camera.distance + (sceneDistance - BASE_SCENE_CAMERA.distance),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 638 | <code>                height: defaults.camera.height + (sceneHeight - BASE_SCENE_CAMERA.height),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 639 | <code>                targetY: defaults.camera.targetY + (sceneTargetY - BASE_SCENE_CAMERA.targetY),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 640 | <code>                yaw: Number(requestedCamera.yaw) &#124;&#124; 0</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 641 | <code>            },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 642 | <code>            light: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 643 | <code>                ambientIntensity: profileLight.ambientIntensity,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 644 | <code>                keyIntensity: profileLight.keyIntensity,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 645 | <code>                keyX: profileLight.keyX,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 646 | <code>                keyY: profileLight.keyY,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 647 | <code>                keyZ: profileLight.keyZ</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 648 | <code>            },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 649 | <code>            background: sceneMood.background &#124;&#124; defaults.background</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 650 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 651 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 652 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 653 | <code>    applySceneMood(sceneMood = {}) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 654 | <code>        if (!this.camera &#124;&#124; !this.scene) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 655 | <code>            return false;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 656 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 657 | <code>        this.sceneMoodTarget = this.normalizeSceneMood(sceneMood);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 658 | <code>        if (!this.sceneMoodCurrent) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 659 | <code>            this.sceneMoodCurrent = this.getDefaultSceneMood();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 660 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 661 | <code>        return true;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 662 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 663 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 664 | <code>    updateSceneMood(deltaTime) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 665 | <code>        if (!this.sceneMoodTarget &#124;&#124; !this.camera &#124;&#124; !this.controls) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 666 | <code>            return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 667 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 668 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 669 | <code>        const lerpAlpha = Math.min(1, Math.max(0.02, deltaTime * 2.8));</code> | 声明局部标识符 `lerpAlpha`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 670 | <code>        const current = this.sceneMoodCurrent &#124;&#124; this.getDefaultSceneMood();</code> | 声明局部标识符 `current`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 671 | <code>        const target = this.sceneMoodTarget;</code> | 声明局部标识符 `target`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 672 | <code>        const lerp = (from, to) =&gt; THREE.MathUtils.lerp(from, to, lerpAlpha);</code> | 声明局部标识符 `lerp`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 673 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 674 | <code>        current.camera.distance = lerp(current.camera.distance, target.camera.distance);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 675 | <code>        current.camera.height = lerp(current.camera.height, target.camera.height);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 676 | <code>        current.camera.targetY = lerp(current.camera.targetY, target.camera.targetY);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 677 | <code>        current.camera.yaw = lerp(current.camera.yaw, target.camera.yaw);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 678 | <code>        current.state = target.state &#124;&#124; current.state &#124;&#124; 'idle';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 679 | <code>        current.light.ambientIntensity = lerp(current.light.ambientIntensity, target.light.ambientIntensity);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 680 | <code>        current.light.keyIntensity = lerp(current.light.keyIntensity, target.light.keyIntensity);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 681 | <code>        current.light.keyX = lerp(current.light.keyX, target.light.keyX);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 682 | <code>        current.light.keyY = lerp(current.light.keyY, target.light.keyY);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 683 | <code>        current.light.keyZ = lerp(current.light.keyZ, target.light.keyZ);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 684 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 685 | <code>        const cameraDistance = current.camera.distance;</code> | 声明局部标识符 `cameraDistance`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 686 | <code>        this.camera.position.set(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 687 | <code>            Math.sin(current.camera.yaw) * cameraDistance,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 688 | <code>            current.camera.height,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 689 | <code>            Math.cos(current.camera.yaw) * cameraDistance</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 690 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 691 | <code>        this.controls.target.set(CONFIG.CAMERA_TARGET.x, current.camera.targetY, CONFIG.CAMERA_TARGET.z);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 692 | <code>        this.camera.lookAt(this.controls.target);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 693 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 694 | <code>        if (this.ambientLight) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 695 | <code>            this.ambientLight.intensity = current.light.ambientIntensity;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 696 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 697 | <code>        if (this.directionalLight) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 698 | <code>            this.directionalLight.intensity = current.light.keyIntensity;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 699 | <code>            this.directionalLight.position.set(current.light.keyX, current.light.keyY, current.light.keyZ);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 700 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 701 | <code>        this.updateAuxiliaryRenderProfileLights(current);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 702 | <code>        if (this.scene.background &amp;&amp; current.background) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 703 | <code>            this.scene.background = new THREE.Color(current.background);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 704 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 705 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 706 | <code>        this.sceneMoodCurrent = current;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 707 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 708 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 709 | <code>    getHumanoidBoneNode(boneName) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 710 | <code>        const humanoid = this.vrm?.humanoid;</code> | 声明局部标识符 `humanoid`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 711 | <code>        if (!humanoid) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 712 | <code>            return null;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 713 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 714 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 715 | <code>        return humanoid.getNormalizedBoneNode?.(boneName) &#124;&#124;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 716 | <code>            humanoid.getRawBoneNode?.(boneName) &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 717 | <code>            humanoid.getBoneNode?.(boneName) &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 718 | <code>            null;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 719 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 720 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 721 | <code>    projectWorldPointToRenderer(worldPosition, canvasRect = null) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 722 | <code>        if (!this.camera &#124;&#124; !this.renderer?.domElement &#124;&#124; !worldPosition) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 723 | <code>            return null;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 724 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 725 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 726 | <code>        const rect = canvasRect &#124;&#124; this.renderer.domElement.getBoundingClientRect();</code> | 声明局部标识符 `rect`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 727 | <code>        if (!rect &#124;&#124; rect.width &lt;= 0 &#124;&#124; rect.height &lt;= 0) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 728 | <code>            return null;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 729 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 730 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 731 | <code>        const projected = this.avatarProjectionScratch.copy(worldPosition).project(this.camera);</code> | 声明局部标识符 `projected`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 732 | <code>        if (</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 733 | <code>            !Number.isFinite(projected.x) &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 734 | <code>            !Number.isFinite(projected.y) &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 735 | <code>            !Number.isFinite(projected.z)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 736 | <code>        ) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 737 | <code>            return null;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 738 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 739 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 740 | <code>        if (projected.z &lt; -1.15 &#124;&#124; projected.z &gt; 1.15) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 741 | <code>            return null;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 742 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 743 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 744 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 745 | <code>            x: rect.left + ((projected.x + 1) / 2) * rect.width,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 746 | <code>            y: rect.top + ((1 - projected.y) / 2) * rect.height</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 747 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 748 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 749 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 750 | <code>    collectAvatarBoneScreenPoints() {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 751 | <code>        if (!this.vrm &#124;&#124; !this.camera &#124;&#124; !this.renderer) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 752 | <code>            return [];</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 753 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 754 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 755 | <code>        this.vrm.scene.updateWorldMatrix(true, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 756 | <code>        this.camera.updateMatrixWorld(true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 757 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 758 | <code>        const points = [];</code> | 声明局部标识符 `points`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 759 | <code>        const worldPosition = this.avatarWorldPositionScratch;</code> | 声明局部标识符 `worldPosition`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 760 | <code>        const canvasRect = this.renderer.domElement.getBoundingClientRect();</code> | 声明局部标识符 `canvasRect`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 761 | <code>        for (const boneName of AVATAR_HIT_TEST_BONES) {</code> | 声明局部标识符 `boneName`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 762 | <code>            const boneNode = this.getHumanoidBoneNode(boneName);</code> | 声明局部标识符 `boneNode`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 763 | <code>            if (!boneNode) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 764 | <code>                continue;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 765 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 766 | <code>            boneNode.getWorldPosition(worldPosition);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 767 | <code>            const screenPoint = this.projectWorldPointToRenderer(worldPosition, canvasRect);</code> | 声明局部标识符 `screenPoint`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 768 | <code>            if (screenPoint) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 769 | <code>                points.push(screenPoint);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 770 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 771 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 772 | <code>        return points;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 773 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 774 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 775 | <code>    computeAvatarBoxScreenBounds() {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 776 | <code>        if (!this.vrm?.scene &#124;&#124; !this.camera &#124;&#124; !this.renderer?.domElement) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 777 | <code>            return null;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 778 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 779 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 780 | <code>        this.vrm.scene.updateWorldMatrix(true, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 781 | <code>        this.camera.updateMatrixWorld(true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 782 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 783 | <code>        const box = this.avatarBoxScratch.setFromObject(this.vrm.scene);</code> | 声明局部标识符 `box`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 784 | <code>        if (box.isEmpty()) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 785 | <code>            return null;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 786 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 787 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 788 | <code>        const corners = this.avatarBoxCornerScratch;</code> | 声明局部标识符 `corners`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 789 | <code>        corners[0].set(box.min.x, box.min.y, box.min.z);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 790 | <code>        corners[1].set(box.min.x, box.min.y, box.max.z);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 791 | <code>        corners[2].set(box.min.x, box.max.y, box.min.z);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 792 | <code>        corners[3].set(box.min.x, box.max.y, box.max.z);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 793 | <code>        corners[4].set(box.max.x, box.min.y, box.min.z);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 794 | <code>        corners[5].set(box.max.x, box.min.y, box.max.z);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 795 | <code>        corners[6].set(box.max.x, box.max.y, box.min.z);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 796 | <code>        corners[7].set(box.max.x, box.max.y, box.max.z);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 797 | <code>        const canvasRect = this.renderer.domElement.getBoundingClientRect();</code> | 声明局部标识符 `canvasRect`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 798 | <code>        const points = corners</code> | 声明局部标识符 `points`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 799 | <code>            .map((corner) =&gt; this.projectWorldPointToRenderer(corner, canvasRect))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 800 | <code>            .filter(Boolean);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 801 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 802 | <code>        return this.buildAvatarScreenBounds(points, {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 803 | <code>            source: 'avatar_box',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 804 | <code>            horizontalPaddingRatio: 0.06,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 805 | <code>            topPaddingRatio: 0.04,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 806 | <code>            bottomPaddingRatio: 0.05</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 807 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 808 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 809 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 810 | <code>    buildAvatarScreenBounds(points, {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 811 | <code>        source = 'avatar_bones',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 812 | <code>        horizontalPaddingRatio = 0.22,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 813 | <code>        topPaddingRatio = 0.13,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 814 | <code>        bottomPaddingRatio = 0.1</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 815 | <code>    } = {}) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 816 | <code>        if (!Array.isArray(points) &#124;&#124; points.length &lt; 4 &#124;&#124; !this.renderer?.domElement) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 817 | <code>            return null;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 818 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 819 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 820 | <code>        const canvasRect = this.renderer.domElement.getBoundingClientRect();</code> | 声明局部标识符 `canvasRect`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 821 | <code>        const minX = Math.min(...points.map((point) =&gt; point.x));</code> | 声明局部标识符 `minX`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 822 | <code>        const maxX = Math.max(...points.map((point) =&gt; point.x));</code> | 声明局部标识符 `maxX`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 823 | <code>        const minY = Math.min(...points.map((point) =&gt; point.y));</code> | 声明局部标识符 `minY`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 824 | <code>        const maxY = Math.max(...points.map((point) =&gt; point.y));</code> | 声明局部标识符 `maxY`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 825 | <code>        const rawWidth = Math.max(1, maxX - minX);</code> | 声明局部标识符 `rawWidth`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 826 | <code>        const rawHeight = Math.max(1, maxY - minY);</code> | 声明局部标识符 `rawHeight`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 827 | <code>        const horizontalPadding = Math.max(18, rawWidth * horizontalPaddingRatio, canvasRect.width * 0.035);</code> | 声明局部标识符 `horizontalPadding`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 828 | <code>        const topPadding = Math.max(16, rawHeight * topPaddingRatio, canvasRect.height * 0.035);</code> | 声明局部标识符 `topPadding`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 829 | <code>        const bottomPadding = Math.max(20, rawHeight * bottomPaddingRatio, canvasRect.height * 0.04);</code> | 声明局部标识符 `bottomPadding`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 830 | <code>        const left = Math.max(canvasRect.left, minX - horizontalPadding);</code> | 声明局部标识符 `left`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 831 | <code>        const top = Math.max(canvasRect.top, minY - topPadding);</code> | 声明局部标识符 `top`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 832 | <code>        const right = Math.min(canvasRect.right, maxX + horizontalPadding);</code> | 声明局部标识符 `right`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 833 | <code>        const bottom = Math.min(canvasRect.bottom, maxY + bottomPadding);</code> | 声明局部标识符 `bottom`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 834 | <code>        const width = right - left;</code> | 声明局部标识符 `width`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 835 | <code>        const height = bottom - top;</code> | 声明局部标识符 `height`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 836 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 837 | <code>        if (width &lt; 24 &#124;&#124; height &lt; 32) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 838 | <code>            return null;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 839 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 840 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 841 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 842 | <code>            left,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 843 | <code>            top,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 844 | <code>            right,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 845 | <code>            bottom,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 846 | <code>            width,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 847 | <code>            height,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 848 | <code>            centerX: left + width / 2,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 849 | <code>            centerY: top + height / 2,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 850 | <code>            source,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 851 | <code>            pointCount: points.length</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 852 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 853 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 854 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 855 | <code>    computeAvatarHitTestBounds() {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 856 | <code>        const boneBounds = this.buildAvatarScreenBounds(</code> | 声明局部标识符 `boneBounds`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 857 | <code>            this.collectAvatarBoneScreenPoints(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 858 | <code>            { source: 'avatar_bones' }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 859 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 860 | <code>        if (boneBounds) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 861 | <code>            return boneBounds;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 862 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 863 | <code>        return this.computeAvatarBoxScreenBounds();</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 864 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 865 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 866 | <code>    updateAvatarHitTestBounds({ force = false } = {}) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 867 | <code>        const now = typeof performance !== 'undefined' ? performance.now() : Date.now();</code> | 声明局部标识符 `now`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 868 | <code>        if (</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 869 | <code>            !force &amp;&amp;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 870 | <code>            this.avatarHitTestBounds &amp;&amp;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 871 | <code>            now - this.avatarHitTestBoundsUpdatedAt &lt; AVATAR_HIT_TEST_CACHE_MS</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 872 | <code>        ) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 873 | <code>            return this.avatarHitTestBounds;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 874 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 875 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 876 | <code>        try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 877 | <code>            this.avatarHitTestBounds = this.computeAvatarHitTestBounds();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 878 | <code>        } catch {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 879 | <code>            this.avatarHitTestBounds = null;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 880 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 881 | <code>        this.avatarHitTestBoundsUpdatedAt = now;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 882 | <code>        return this.avatarHitTestBounds;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 883 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 884 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 885 | <code>    getAvatarHitTestBounds() {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 886 | <code>        return this.updateAvatarHitTestBounds();</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 887 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 888 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 889 | <code>    async loadModel() {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 890 | <code>        try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 891 | <code>            console.log('⏳ 开始加载VRM模型...');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 892 | <code>            const loader = new GLTFLoader();</code> | 声明局部标识符 `loader`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 893 | <code>            loader.register((parser) =&gt; new VRMLoaderPlugin(parser));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 894 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 895 | <code>            const gltf = await new Promise((resolve, reject) =&gt; {</code> | 声明局部标识符 `gltf`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 896 | <code>                loader.load(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 897 | <code>                    CONFIG.MODEL_PATH,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 898 | <code>                    resolve,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 899 | <code>                    (progress) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 900 | <code>                        const percent = (progress.loaded / progress.total * 100).toFixed(2);</code> | 声明局部标识符 `percent`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 901 | <code>                        console.log(`模型加载中：${percent}%`);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 902 | <code>                    },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 903 | <code>                    reject</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 904 | <code>                );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 905 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 906 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 907 | <code>            this.vrm = gltf.userData.vrm;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 908 | <code>            VRMUtils.rotateVRM0(this.vrm);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 909 | <code>            this.vrm.scene.scale.set(1, 1, 1);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 910 | <code>            this.scene.add(this.vrm.scene);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 911 | <code>            const shadowCasterCount = this.setupVrmShadowCasting();</code> | 声明局部标识符 `shadowCasterCount`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 912 | <code>            this.renderProfileController = new MToonRenderProfileController({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 913 | <code>                vrm: this.vrm,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 914 | <code>                logger: console</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 915 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 916 | <code>            this.renderProfileController.bindVrm(this.vrm);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 917 | <code>            this.applyRenderProfile(CONFIG.RENDER_PROFILE_ID, {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 918 | <code>                syncSceneMood: false</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 919 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 920 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 921 | <code>            this.initExpressionSystem();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 922 | <code>            this.isModelLoaded = true;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 923 | <code>            await this.loadAllAnimations();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 924 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 925 | <code>            console.log('✅ VRM模型和动作全部加载完成！');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 926 | <code>            console.log('🌓 VRM 阴影投射 Mesh 数量:', shadowCasterCount);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 927 | <code>            console.log('📦 当前已加载的动作列表:', Object.keys(this.actionMap));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 928 | <code>            window.dispatchEvent(new CustomEvent('modelLoaded'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 929 | <code>        } catch (error) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 930 | <code>            console.error('❌ 模型加载失败：', error);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 931 | <code>            window.dispatchEvent(new CustomEvent('modelLoadError', { detail: error }));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 932 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 933 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 934 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 935 | <code>    initExpressionSystem() {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 936 | <code>        if (!this.vrm) return;</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 937 | <code>        console.log('✅ 可用表情列表:', this.vrm.expressionManager.expressions.map((item) =&gt; item.expressionName));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 938 | <code>        this.characterEmoteController?.bindVrm(this.vrm);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 939 | <code>        this.resetExpression();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 940 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 941 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 942 | <code>    async loadAllAnimations() {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 943 | <code>        console.log('⏳ 开始加载VRMA动作文件...');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 944 | <code>        this.mixer = new THREE.AnimationMixer(this.vrm.scene);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 945 | <code>        this.motionController.bind({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 946 | <code>            mixer: this.mixer,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 947 | <code>            actionMap: this.actionMap</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 948 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 949 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 950 | <code>        const animLoader = new GLTFLoader();</code> | 声明局部标识符 `animLoader`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 951 | <code>        animLoader.register((parser) =&gt; new VRMAnimationLoaderPlugin(parser));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 952 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 953 | <code>        for (const fileInfo of CONFIG.ANIMATION_FILES) {</code> | 声明局部标识符 `fileInfo`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 954 | <code>            try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 955 | <code>                await this.loadSingleAnimation(animLoader, fileInfo);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 956 | <code>            } catch (error) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 957 | <code>                console.error(`❌ 加载动作失败: ${fileInfo.name}`, error);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 958 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 959 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 960 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 961 | <code>        this.setupActionFinishListener();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 962 | <code>        this.motionController.prepareAllActions();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 963 | <code>        this.playResolvedAction('idle');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 964 | <code>        console.log('🎬 默认动作：IDLE 循环模式启动');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 965 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 966 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 967 | <code>    loadSingleAnimation(loader, fileInfo) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 968 | <code>        return new Promise((resolve, reject) =&gt; {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 969 | <code>            loader.load(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 970 | <code>                fileInfo.path,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 971 | <code>                (gltf) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 972 | <code>                    let vrmAnimation = gltf.userData.vrmAnimation;</code> | 声明局部标识符 `vrmAnimation`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 973 | <code>                    if (!vrmAnimation &amp;&amp; gltf.userData.vrmAnimations?.length &gt; 0) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 974 | <code>                        vrmAnimation = gltf.userData.vrmAnimations[0];</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 975 | <code>                    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 976 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 977 | <code>                    let clip;</code> | 声明局部标识符 `clip`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 978 | <code>                    if (!vrmAnimation &amp;&amp; gltf.animations?.length &gt; 0) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 979 | <code>                        clip = gltf.animations[0];</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 980 | <code>                    } else if (vrmAnimation) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 981 | <code>                        clip = createVRMAnimationClip(vrmAnimation, this.vrm);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 982 | <code>                    } else {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 983 | <code>                        reject(new Error('无法解析动画文件格式'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 984 | <code>                        return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 985 | <code>                    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 986 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 987 | <code>                    const action = this.mixer.clipAction(clip);</code> | 声明局部标识符 `action`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 988 | <code>                    this.actionMap[fileInfo.name] = action;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 989 | <code>                    this.motionController?.prepareAction(fileInfo.name, action);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 990 | <code>                    resolve();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 991 | <code>                },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 992 | <code>                () =&gt; {},</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 993 | <code>                reject</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 994 | <code>            );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 995 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 996 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 997 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 998 | <code>    setupActionFinishListener() {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 999 | <code>        if (!this.mixer &#124;&#124; !this.motionController) return;</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1000 | <code>        this.motionController.bind({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 1001 | <code>            mixer: this.mixer,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 1002 | <code>            actionMap: this.actionMap</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 1003 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1004 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1005 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1006 | <code>    getActionNameByInstance(actionInstance) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 1007 | <code>        return this.motionController?.getActionNameByInstance(actionInstance) &#124;&#124;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1008 | <code>            Object.keys(this.actionMap).find((name) =&gt; this.actionMap[name] === actionInstance) &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 1009 | <code>            '';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 1010 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1011 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1012 | <code>    getCurrentActionName() {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 1013 | <code>        return this.motionController?.getCurrentActionName() &#124;&#124;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1014 | <code>            this.getActionNameByInstance(this.currentAction) &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 1015 | <code>            '';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 1016 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1017 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1018 | <code>    setCharacterSurfaceState(surface) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 1019 | <code>        this.currentSurfaceState = surface &#124;&#124; null;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 1020 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1021 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1022 | <code>    applyPersonaSurfacePayload(payload = {}, context = {}) {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 1023 | <code>        if (!this.characterRuntime) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1024 | <code>            return null;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1025 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1026 | <code>        return this.characterRuntime.applyPayload(payload, context);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1027 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1028 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1029 | <code>    playAction(actionName, options = {}) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 1030 | <code>        if (actionName === 'idle') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1031 | <code>            return this.playResolvedAction('idle');</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1032 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1033 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1034 | <code>        return this.applyPersonaSurfacePayload({</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1035 | <code>            action: actionName,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 1036 | <code>            source: 'legacy_action'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 1037 | <code>        }, {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 1038 | <code>            source: 'legacy_action',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 1039 | <code>            allowLegacyActionMotion: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 1040 | <code>            allowExperimentalMotion: Boolean(options.allowExperimental)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 1041 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1042 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1043 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1044 | <code>    playResolvedAction(actionName, options = {}) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 1045 | <code>        if (!this.isModelLoaded) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1046 | <code>            console.warn('⚠️ 模型未加载');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 1047 | <code>            return false;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1048 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1049 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1050 | <code>        const played = this.motionController?.play(actionName, options) ?? false;</code> | 声明局部标识符 `played`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 1051 | <code>        this.currentAction = this.motionController?.currentAction &#124;&#124; this.currentAction;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 1052 | <code>        return played;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1053 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1054 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1055 | <code>    getRandomIdleAction() {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 1056 | <code>        return this.motionController?.selectIdleAction() &#124;&#124; null;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1057 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1058 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1059 | <code>    getRandomDanceAction() {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 1060 | <code>        return this.motionController?.selectDanceAction() &#124;&#124; null;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1061 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1062 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1063 | <code>    applyExpressionPreset(expressionName) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 1064 | <code>        if (expressionName === 'neutral') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1065 | <code>            this.resetExpression();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 1066 | <code>            return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1067 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1068 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1069 | <code>        const presetValue = this.getExpressionPresetValue(expressionName);</code> | 声明局部标识符 `presetValue`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 1070 | <code>        if (typeof presetValue !== 'number') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1071 | <code>            console.warn(`⚠️ 表情预设 "${expressionName}" 不存在`);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 1072 | <code>            return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1073 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1074 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1075 | <code>        this.applyExpressionMix({ [expressionName]: presetValue }, {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 1076 | <code>            durationHint: this.isBlinkExpression(expressionName) ? 'short' : 'medium'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 1077 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1078 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1079 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1080 | <code>    applyExpressionMix(expressionMix = {}, { durationHint = 'short' } = {}) {</code> | 注册事件处理：当用户操作、生命周期或运行时事件发生时调用相应逻辑。 |
| 1081 | <code>        if (!this.isModelLoaded &#124;&#124; !this.vrm &#124;&#124; !expressionMix &#124;&#124; typeof expressionMix !== 'object') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1082 | <code>            return false;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1083 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1084 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1085 | <code>        return this.characterEmoteController?.setEmotionMix(expressionMix, { durationHint }) ?? false;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1086 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1087 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1088 | <code>    setExpression(expressionName, value) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 1089 | <code>        if (!this.isModelLoaded &#124;&#124; !this.vrm) return;</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1090 | <code>        this.characterEmoteController?.setEmotionMix({ [expressionName]: value }, {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 1091 | <code>            durationHint: 'hold'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 1092 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1093 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1094 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1095 | <code>    clearExpressionValues() {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 1096 | <code>        if (!this.isModelLoaded &#124;&#124; !this.vrm) return;</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1097 | <code>        this.activeExpressions.clear();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 1098 | <code>        this.characterEmoteController?.clearEmotionMix();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 1099 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1100 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1101 | <code>    resetExpression() {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 1102 | <code>        this.clearExpressionValues();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 1103 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1104 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1105 | <code>    scheduleNeutralReset() {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 1106 | <code>        // Expression lifetimes are owned by CharacterEmoteController.</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 1107 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1108 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1109 | <code>    startAudioDrivenSpeech() {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 1110 | <code>        if (!this.isModelLoaded) return;</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1111 | <code>        clearTimeout(this.speechIdleResetTimer);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 1112 | <code>        this.speechIdleResetTimer = null;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 1113 | <code>        this.isSpeaking = true;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 1114 | <code>        this.useExternalLipSync = true;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 1115 | <code>        this.externalLipSyncValue = 0;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 1116 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1117 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1118 | <code>    startFallbackSpeech() {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 1119 | <code>        if (!this.isModelLoaded) return;</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1120 | <code>        clearTimeout(this.speechIdleResetTimer);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 1121 | <code>        this.speechIdleResetTimer = null;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 1122 | <code>        this.isSpeaking = true;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 1123 | <code>        this.useExternalLipSync = false;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 1124 | <code>        this.speakTimeAccumulator = 0;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 1125 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1126 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1127 | <code>    setLipSyncValue(value) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 1128 | <code>        if (!this.isModelLoaded) return;</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1129 | <code>        this.isSpeaking = true;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 1130 | <code>        this.useExternalLipSync = true;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 1131 | <code>        this.externalLipSyncValue = THREE.MathUtils.clamp(value, 0, CONFIG.MAX_MOUTH_OPEN);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 1132 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1133 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1134 | <code>    stopSpeaking() {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 1135 | <code>        if (!this.isModelLoaded &#124;&#124; !this.vrm) return;</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1136 | <code>        this.isSpeaking = false;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 1137 | <code>        this.useExternalLipSync = false;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 1138 | <code>        this.externalLipSyncValue = 0;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 1139 | <code>        this.smoothedLipSyncValue = 0;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 1140 | <code>        this.characterEmoteController?.setLipSyncValue(0);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 1141 | <code>        clearTimeout(this.speechIdleResetTimer);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 1142 | <code>        this.speechIdleResetTimer = setTimeout(() =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 1143 | <code>            this.speechIdleResetTimer = null;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 1144 | <code>            if (this.isSpeaking &#124;&#124; this.currentSurfaceState?.taskState !== 'speaking') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1145 | <code>                return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1146 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1147 | <code>            this.characterRuntime?.setSurfaceState({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 1148 | <code>                taskState: 'idle',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 1149 | <code>                gestureIntent: 'none',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 1150 | <code>                source: 'speech_end'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 1151 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1152 | <code>        }, 900);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 1153 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1154 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1155 | <code>    triggerBlink() {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 1156 | <code>        if (!this.isModelLoaded &#124;&#124; !this.autoBlinkEnabled) return;</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1157 | <code>        return this.characterEmoteController?.forceBlink() ?? false;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1158 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1159 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1160 | <code>    onWindowResize(container) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 1161 | <code>        if (!this.camera &#124;&#124; !this.renderer) return;</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1162 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1163 | <code>        this.camera.aspect = container.clientWidth / container.clientHeight;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 1164 | <code>        this.camera.updateProjectionMatrix();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 1165 | <code>        this.renderer.setSize(container.clientWidth, container.clientHeight);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 1166 | <code>        this.applyRendererQualitySettings();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 1167 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1168 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1169 | <code>    animate(timestamp = 0) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 1170 | <code>        requestAnimationFrame(this.animate);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 1171 | <code>        const fpsLimit = clampNumber(CONFIG.RENDER_FPS_LIMIT, 24, 60, 60);</code> | 声明局部标识符 `fpsLimit`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 1172 | <code>        const frameIntervalMs = 1000 / fpsLimit;</code> | 声明局部标识符 `frameIntervalMs`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 1173 | <code>        const currentTimestamp = timestamp &#124;&#124; performance.now();</code> | 声明局部标识符 `currentTimestamp`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 1174 | <code>        if (</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1175 | <code>            this.lastRenderTimestamp &gt; 0 &amp;&amp;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 1176 | <code>            currentTimestamp - this.lastRenderTimestamp &lt; frameIntervalMs</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 1177 | <code>        ) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 1178 | <code>            return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1179 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1180 | <code>        if (this.lastRenderTimestamp &gt; 0) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1181 | <code>            const elapsedMs = currentTimestamp - this.lastRenderTimestamp;</code> | 声明局部标识符 `elapsedMs`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 1182 | <code>            this.lastRenderTimestamp = currentTimestamp - (elapsedMs % frameIntervalMs);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 1183 | <code>        } else {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 1184 | <code>            this.lastRenderTimestamp = currentTimestamp;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 1185 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1186 | <code>        const deltaTime = Math.min(this.clock.getDelta(), 0.1);</code> | 声明局部标识符 `deltaTime`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 1187 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1188 | <code>        this.characterRuntime?.beginFrame?.();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 1189 | <code>        if (this.mixer) this.mixer.update(deltaTime);</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1190 | <code>        this.characterRuntime?.update(deltaTime, {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 1191 | <code>            vrm: this.vrm,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 1192 | <code>            isSpeaking: this.isSpeaking,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 1193 | <code>            lipSyncValue: this.smoothedLipSyncValue,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 1194 | <code>            currentMotion: this.getCurrentActionName()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 1195 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1196 | <code>        this.updateSceneMood(deltaTime);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 1197 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1198 | <code>        this.updateSpeaking(deltaTime);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 1199 | <code>        this.characterEmoteController?.setAutoBlinkEnabled(this.autoBlinkEnabled);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 1200 | <code>        this.characterEmoteController?.update(deltaTime);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 1201 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1202 | <code>        if (this.vrm) this.vrm.update(deltaTime);</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1203 | <code>        if (this.controls?.enabled) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1204 | <code>            this.controls.update();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 1205 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1206 | <code>        this.renderer.render(this.scene, this.camera);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 1207 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1208 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1209 | <code>    updateAutoBlink() {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 1210 | <code>        this.characterEmoteController?.setAutoBlinkEnabled(this.autoBlinkEnabled);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 1211 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1212 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1213 | <code>    updateSpeaking(deltaTime) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 1214 | <code>        if (!this.isModelLoaded &#124;&#124; !this.vrm) return;</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1215 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1216 | <code>        let targetLipSyncValue = 0;</code> | 声明局部标识符 `targetLipSyncValue`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 1217 | <code>        if (this.isSpeaking) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1218 | <code>            if (this.useExternalLipSync) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1219 | <code>                targetLipSyncValue = this.externalLipSyncValue;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 1220 | <code>            } else {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 1221 | <code>                this.speakTimeAccumulator += deltaTime;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 1222 | <code>                const pulse = 0.5 - 0.5 * Math.cos(this.speakTimeAccumulator * Math.PI * 2 * CONFIG.SPEAK_SPEED);</code> | 声明局部标识符 `pulse`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 1223 | <code>                targetLipSyncValue = Math.pow(pulse, CONFIG.AUDIO_LIP_SYNC_PULSE_SHAPE) * CONFIG.SPEAK_AMPLITUDE;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 1224 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1225 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1226 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1227 | <code>        const lipSyncSmoothing = this.useExternalLipSync</code> | 声明局部标识符 `lipSyncSmoothing`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 1228 | <code>            ? CONFIG.AUDIO_LIP_SYNC_MODEL_SMOOTHING</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 1229 | <code>            : CONFIG.LIP_SYNC_SMOOTHING;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 1230 | <code>        this.smoothedLipSyncValue = THREE.MathUtils.lerp(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 1231 | <code>            this.smoothedLipSyncValue,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 1232 | <code>            targetLipSyncValue,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 1233 | <code>            lipSyncSmoothing</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 1234 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1235 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1236 | <code>        this.applyLipSyncValue(this.smoothedLipSyncValue);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 1237 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1238 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1239 | <code>    applyLipSyncValue(value) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 1240 | <code>        if (!this.vrm) return;</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1241 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1242 | <code>        const safeValue = THREE.MathUtils.clamp(value, 0, CONFIG.MAX_MOUTH_OPEN);</code> | 声明局部标识符 `safeValue`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 1243 | <code>        this.characterEmoteController?.setLipSyncValue(safeValue);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。”这一文件职责。 |
| 1244 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1245 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
