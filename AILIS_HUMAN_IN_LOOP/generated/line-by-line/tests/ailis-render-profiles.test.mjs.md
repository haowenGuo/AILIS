# tests/ailis-render-profiles.test.mjs 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：自动化测试：验证 ailis-render-profiles 的契约与回归行为。
- 文件类型：`source-code`
- 原始行数：316
- SHA-256：`7ba6b06111b644a8f726bc96ed7908e416088b60c133da1298264c95ce15f18c`
- 可运行副本：[打开源文件](../../../source/tests/ailis-render-profiles.test.mjs)
- 依赖：`node:assert/strict`、`node:module`、`node:test`、`three`、`../src/character/render-profiles.js`、`../src/character/mtoon-render-profile-controller.js`、`../electron/store.cjs`
- 主要符号：`require`、`store`、`MockCloneableMToonMaterial`、`clone`、`createMockMToonMaterial`、`profile`、`normalized`、`legacyProfileOnly`、`skin`、`hair`、`root`、`controller`、`originalSkinShade`、`result`、`material`、`mesh`、`soft`、`vrmSystem`、`mood`

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code>import assert from 'node:assert/strict';</code> | 导入依赖 `node:assert/strict`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 2 | <code>import { createRequire } from 'node:module';</code> | 导入依赖 `node:module`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 3 | <code>import test from 'node:test';</code> | 导入依赖 `node:test`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 4 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5 | <code>import * as THREE from 'three';</code> | 导入依赖 `three`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 6 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 7 | <code>import {</code> | 导入依赖 `{`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 8 | <code>    DEFAULT_RENDER_PROFILE_ID,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 9 | <code>    RENDER_PROFILE_IDS,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 10 | <code>    getRenderProfile,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 11 | <code>    listRenderProfiles,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 12 | <code>    normalizeRenderProfileId</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 13 | <code>} from '../src/character/render-profiles.js';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 14 | <code>import {</code> | 导入依赖 `{`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 15 | <code>    MToonRenderProfileController,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 16 | <code>    __renderProfileControllerInternals</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 17 | <code>} from '../src/character/mtoon-render-profile-controller.js';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 18 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 19 | <code>const require = createRequire(import.meta.url);</code> | 声明局部标识符 `require`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 20 | <code>const store = require('../electron/store.cjs');</code> | 导入依赖 `../electron/store.cjs`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 21 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 22 | <code>class MockCloneableMToonMaterial extends THREE.MeshBasicMaterial {</code> | 定义类 `MockCloneableMToonMaterial`，把相关状态与行为收拢为一个运行时对象。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 23 | <code>    constructor({ name = 'Mock_MToon', outlineWidthFactor = 0.01 } = {}) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 24 | <code>        super({ color: '#ffffff' });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 25 | <code>        this.name = name;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 26 | <code>        this.shadeColorFactor = new THREE.Color('#111111');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 27 | <code>        this.shadingShiftFactor = 0;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 28 | <code>        this.shadingToonyFactor = 0.9;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 29 | <code>        this.giEqualizationFactor = 0.9;</code> | 注册事件处理：当用户操作、生命周期或运行时事件发生时调用相应逻辑。 |
| 30 | <code>        this.parametricRimColorFactor = new THREE.Color('#000000');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 31 | <code>        this.parametricRimLiftFactor = 0;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 32 | <code>        this.parametricRimFresnelPowerFactor = 5;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 33 | <code>        this.rimLightingMixFactor = 1;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 34 | <code>        this.matcapFactor = new THREE.Color('#ffffff');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 35 | <code>        this.outlineWidthFactor = outlineWidthFactor;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 36 | <code>        this.outlineWidthMode = 'none';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 37 | <code>        this.outlineColorFactor = new THREE.Color('#000000');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 38 | <code>        this.outlineLightingMixFactor = 1;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 39 | <code>        this.isOutline = false;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 40 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 41 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 42 | <code>    get isMToonMaterial() {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 43 | <code>        return true;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 44 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 45 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 46 | <code>    clone() {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 47 | <code>        const clone = new MockCloneableMToonMaterial({</code> | 声明局部标识符 `clone`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 48 | <code>            name: this.name,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 49 | <code>            outlineWidthFactor: this.outlineWidthFactor</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 50 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 51 | <code>        clone.copy(this);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 52 | <code>        clone.shadeColorFactor.copy(this.shadeColorFactor);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 53 | <code>        clone.shadingShiftFactor = this.shadingShiftFactor;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 54 | <code>        clone.shadingToonyFactor = this.shadingToonyFactor;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 55 | <code>        clone.giEqualizationFactor = this.giEqualizationFactor;</code> | 注册事件处理：当用户操作、生命周期或运行时事件发生时调用相应逻辑。 |
| 56 | <code>        clone.parametricRimColorFactor.copy(this.parametricRimColorFactor);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 57 | <code>        clone.parametricRimLiftFactor = this.parametricRimLiftFactor;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 58 | <code>        clone.parametricRimFresnelPowerFactor = this.parametricRimFresnelPowerFactor;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 59 | <code>        clone.rimLightingMixFactor = this.rimLightingMixFactor;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 60 | <code>        clone.matcapFactor.copy(this.matcapFactor);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 61 | <code>        clone.outlineWidthFactor = this.outlineWidthFactor;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 62 | <code>        clone.outlineWidthMode = this.outlineWidthMode;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 63 | <code>        clone.outlineColorFactor.copy(this.outlineColorFactor);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 64 | <code>        clone.outlineLightingMixFactor = this.outlineLightingMixFactor;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 65 | <code>        clone.isOutline = this.isOutline;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 66 | <code>        return clone;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 67 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 68 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 69 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 70 | <code>function createMockMToonMaterial(name, outlineWidthFactor = 0.01) {</code> | 定义函数 `createMockMToonMaterial`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 71 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 72 | <code>        name,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 73 | <code>        isMToonMaterial: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 74 | <code>        shadeColorFactor: new THREE.Color('#111111'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 75 | <code>        shadingShiftFactor: 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 76 | <code>        shadingToonyFactor: 0.9,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 77 | <code>        giEqualizationFactor: 0.9,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 78 | <code>        parametricRimColorFactor: new THREE.Color('#000000'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 79 | <code>        parametricRimLiftFactor: 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 80 | <code>        parametricRimFresnelPowerFactor: 5,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 81 | <code>        rimLightingMixFactor: 1,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 82 | <code>        matcapFactor: new THREE.Color('#ffffff'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 83 | <code>        outlineWidthFactor,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 84 | <code>        outlineWidthMode: 'none',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 85 | <code>        outlineColorFactor: new THREE.Color('#000000'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 86 | <code>        outlineLightingMixFactor: 1,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 87 | <code>        isOutline: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 88 | <code>        needsUpdate: false</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 89 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 90 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 91 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 92 | <code>test('AILIS exposes selectable render profiles including cel anime', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 93 | <code>    assert.deepEqual(RENDER_PROFILE_IDS, [</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 94 | <code>        'ailis_soft_anime_mtoon',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 95 | <code>        'ailis_bright_companion_mtoon',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 96 | <code>        'ailis_cinematic_rim_toon',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 97 | <code>        'ailis_material_hybrid_npr',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 98 | <code>        'ailis_hard_cel_mtoon'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 99 | <code>    ]);</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 100 | <code>    assert.equal(listRenderProfiles().length, 5);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 101 | <code>    assert.equal(normalizeRenderProfileId('unknown'), DEFAULT_RENDER_PROFILE_ID);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 102 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 103 | <code>    for (const profileId of RENDER_PROFILE_IDS) {</code> | 声明局部标识符 `profileId`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 104 | <code>        const profile = getRenderProfile(profileId);</code> | 声明局部标识符 `profile`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 105 | <code>        assert.equal(profile.id, profileId);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 106 | <code>        assert.ok(profile.label);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 107 | <code>        assert.ok(profile.lighting?.ambient?.color);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 108 | <code>        assert.ok(profile.lighting?.key?.position);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 109 | <code>        assert.ok(profile.materialDefaults?.shadeColor);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 110 | <code>        assert.ok(profile.materialDefaults?.outlineWidth &gt; 0);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 111 | <code>        assert.ok(profile.materialGroups?.skin);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 112 | <code>        assert.ok(profile.materialGroups?.hair);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 113 | <code>        assert.ok(profile.materialGroups?.eyes);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 114 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 115 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 116 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 117 | <code>test('desktop store normalizes render profile preferences', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 118 | <code>    assert.deepEqual(store.RENDER_PROFILE_OPTIONS, RENDER_PROFILE_IDS);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 119 | <code>    assert.equal(store.DEFAULT_RENDER_PROFILE_ID, DEFAULT_RENDER_PROFILE_ID);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 120 | <code>    assert.equal(store.normalizeRenderProfileId('ailis_cinematic_rim_toon'), 'ailis_cinematic_rim_toon');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 121 | <code>    assert.equal(store.normalizeRenderProfileId('ailis_hard_cel_mtoon'), 'ailis_hard_cel_mtoon');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 122 | <code>    assert.equal(store.normalizeRenderProfileId('ailis_wuwa_cinematic'), 'ailis_cinematic_rim_toon');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 123 | <code>    assert.equal(store.normalizeRenderProfileId('ailis_cel_anime_hard'), 'ailis_hard_cel_mtoon');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 124 | <code>    assert.equal(store.normalizeRenderProfileId('bad-profile'), DEFAULT_RENDER_PROFILE_ID);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 125 | <code>    assert.equal(store.DEFAULT_RENDER_OUTLINE_SCALE, 0.72);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 126 | <code>    assert.equal(store.normalizeRenderOutlineScale(99), 1.2);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 127 | <code>    assert.equal(store.normalizeRenderLightYawDeg(-99), -75);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 128 | <code>    assert.equal(store.normalizeRenderShadowEnabled(false), false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 129 | <code>    assert.equal(store.DEFAULT_RENDER_RESOLUTION_SCALE, 2);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 130 | <code>    assert.equal(store.normalizeRenderResolutionScale(0), 0.5);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 131 | <code>    assert.equal(store.normalizeRenderResolutionScale(2.75), 2.75);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 132 | <code>    assert.equal(store.normalizeRenderFpsLimit(28), 30);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 133 | <code>    assert.equal(store.normalizeRenderFpsLimit(99), 60);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 134 | <code>    assert.equal(store.normalizeRenderShadowQuality(2), 2);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 135 | <code>    assert.equal(store.normalizeRenderOutlineEnabled(false), false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 136 | <code>    assert.equal(store.normalizeRenderAntialiasEnabled(false), false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 137 | <code>    assert.equal(store.normalizeState({}).preferences.renderResolutionScale, 2);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 138 | <code>    assert.equal(store.normalizeState({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 139 | <code>        version: 22,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 140 | <code>        preferences: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 141 | <code>            renderResolutionScale: 3,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 142 | <code>            renderFpsLimit: 2</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 143 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 144 | <code>    }).preferences.renderResolutionScale, 2);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 145 | <code>    assert.equal(store.normalizeState({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 146 | <code>        version: 22,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 147 | <code>        preferences: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 148 | <code>            renderResolutionScale: 3,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 149 | <code>            renderFpsLimit: 2</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 150 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 151 | <code>    }).preferences.renderFpsLimit, 45);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 152 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 153 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 154 | <code>test('desktop store migrates known OpenAI-compatible preset provider keys by base URL', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 155 | <code>    const normalized = store.normalizeState({</code> | 声明局部标识符 `normalized`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 156 | <code>        preferences: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 157 | <code>            llmProvider: 'openai-compatible',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 158 | <code>            llmBaseUrl: 'https://api.deepseek.com/',</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 159 | <code>            llmModel: 'deepseek-v4-flash',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 160 | <code>            llmApiKey: 'sk-ds-test'</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 161 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 162 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 163 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 164 | <code>    assert.equal(normalized.preferences.llmProvider, 'deepseek');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 165 | <code>    assert.equal(normalized.preferences.llmBaseUrl, 'https://api.deepseek.com');</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 166 | <code>    assert.equal(normalized.preferences.llmApiKeyProfiles.deepseek.keys.length, 1);</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 167 | <code>    assert.equal(normalized.preferences.llmApiKeyProfiles.deepseek.keys[0].value, 'sk-ds-test');</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 168 | <code>    assert.equal(store.normalizeLlmProvider('qwen'), 'qwen');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 169 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 170 | <code>    const legacyProfileOnly = store.normalizeState({</code> | 声明局部标识符 `legacyProfileOnly`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 171 | <code>        preferences: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 172 | <code>            llmProvider: 'openai-compatible',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 173 | <code>            llmBaseUrl: 'https://api.deepseek.com',</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 174 | <code>            llmModel: 'deepseek-v4-flash',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 175 | <code>            llmApiKeyProfiles: {</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 176 | <code>                'openai-compatible': {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 177 | <code>                    activeKeyId: 'legacy-ds',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 178 | <code>                    keys: [{</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 179 | <code>                        id: 'legacy-ds',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 180 | <code>                        label: 'DeepSeek 主 Key',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 181 | <code>                        value: 'sk-ds-profile-only'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 182 | <code>                    }]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 183 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 184 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 185 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 186 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 187 | <code>    assert.equal(legacyProfileOnly.preferences.llmProvider, 'deepseek');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 188 | <code>    assert.equal(legacyProfileOnly.preferences.llmApiKeyProfiles.deepseek.keys[0].value, 'sk-ds-profile-only');</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 189 | <code>    assert.equal(legacyProfileOnly.preferences.llmApiKeyProfiles.deepseek.keys[0].label, 'DeepSeek 主 Key');</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 190 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 191 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 192 | <code>test('MToon render profile controller applies group-specific tuning and restores from original snapshot', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 193 | <code>    const skin = createMockMToonMaterial('AILIS_skin_face');</code> | 声明局部标识符 `skin`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 194 | <code>    const hair = createMockMToonMaterial('AILIS_hair_main');</code> | 声明局部标识符 `hair`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 195 | <code>    const root = {</code> | 声明局部标识符 `root`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 196 | <code>        traverse(visitor) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 197 | <code>            visitor(root);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 198 | <code>            visitor({ material: skin });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 199 | <code>            visitor({ material: hair });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 200 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 201 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 202 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 203 | <code>    const controller = new MToonRenderProfileController({</code> | 声明局部标识符 `controller`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 204 | <code>        vrm: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 205 | <code>            scene: root</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 206 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 207 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 208 | <code>    assert.equal(controller.bindVrm(controller.vrm), 2);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 209 | <code>    assert.equal(__renderProfileControllerInternals.classifyMaterial(skin), 'skin');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 210 | <code>    assert.equal(__renderProfileControllerInternals.classifyMaterial(hair), 'hair');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 211 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 212 | <code>    const originalSkinShade = skin.shadeColorFactor.getHexString();</code> | 声明局部标识符 `originalSkinShade`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 213 | <code>    const result = controller.apply('ailis_cinematic_rim_toon');</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 214 | <code>    assert.equal(result.id, 'ailis_cinematic_rim_toon');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 215 | <code>    assert.equal(result.materialSummary.byGroup.skin, 1);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 216 | <code>    assert.equal(result.materialSummary.byGroup.hair, 1);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 217 | <code>    assert.notEqual(skin.shadeColorFactor.getHexString(), originalSkinShade);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 218 | <code>    assert.equal(skin.needsUpdate, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 219 | <code>    assert.ok(skin.outlineWidthFactor &gt; 0);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 220 | <code>    assert.equal(skin.outlineWidthMode, 'screenCoordinates');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 221 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 222 | <code>    controller.restoreOriginal();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 223 | <code>    assert.equal(skin.shadeColorFactor.getHexString(), originalSkinShade);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 224 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 225 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 226 | <code>test('MToon render profile controller generates real outline material groups when the VRM has none', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 227 | <code>    const material = new MockCloneableMToonMaterial({</code> | 声明局部标识符 `material`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 228 | <code>        name: 'AILIS_hair_main',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 229 | <code>        outlineWidthFactor: 0</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 230 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 231 | <code>    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), material);</code> | 声明局部标识符 `mesh`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 232 | <code>    const root = new THREE.Group();</code> | 声明局部标识符 `root`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 233 | <code>    root.add(mesh);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 234 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 235 | <code>    const controller = new MToonRenderProfileController({</code> | 声明局部标识符 `controller`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 236 | <code>        vrm: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 237 | <code>            scene: root</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 238 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 239 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 240 | <code>    const result = controller.apply('ailis_hard_cel_mtoon');</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 241 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 242 | <code>    assert.equal(result.outlineSummary.generated, 1);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 243 | <code>    assert.equal(Array.isArray(mesh.material), true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 244 | <code>    assert.equal(mesh.material.length, 2);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 245 | <code>    assert.equal(mesh.material[1].isOutline, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 246 | <code>    assert.equal(mesh.material[1].side, THREE.BackSide);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 247 | <code>    assert.equal(mesh.material[0].outlineWidthMode, 'screenCoordinates');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 248 | <code>    assert.ok(mesh.material[0].outlineWidthFactor &gt;= 0.009);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 249 | <code>    assert.ok(mesh.material[1].outlineWidthFactor &gt;= 0.009);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 250 | <code>    assert.ok(mesh.geometry.groups.some((group) =&gt; group.materialIndex === 1));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 251 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 252 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 253 | <code>test('MToon render profile controller applies user look overrides to outline width only', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 254 | <code>    const soft = createMockMToonMaterial('AILIS_skin_face', 0);</code> | 声明局部标识符 `soft`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 255 | <code>    const root = {</code> | 声明局部标识符 `root`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 256 | <code>        traverse(visitor) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 257 | <code>            visitor(root);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 258 | <code>            visitor({ material: soft });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 259 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 260 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 261 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 262 | <code>    const controller = new MToonRenderProfileController({</code> | 声明局部标识符 `controller`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 263 | <code>        vrm: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 264 | <code>            scene: root</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 265 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 266 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 267 | <code>    controller.bindVrm(controller.vrm);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 268 | <code>    controller.apply('ailis_hard_cel_mtoon', {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 269 | <code>        outlineScale: 0.5</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 270 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 271 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 272 | <code>    assert.ok(soft.outlineWidthFactor &lt;= 0.0041);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 273 | <code>    assert.equal(soft.shadingShiftFactor, -0.055);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 274 | <code>    assert.equal(soft.giEqualizationFactor, 0.72);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 275 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 276 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 277 | <code>test('MToon render profile controller can disable outline for lower render cost', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 278 | <code>    const material = new MockCloneableMToonMaterial({</code> | 声明局部标识符 `material`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 279 | <code>        name: 'AILIS_hair_main',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 280 | <code>        outlineWidthFactor: 0.01</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 281 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 282 | <code>    const mesh = {</code> | 声明局部标识符 `mesh`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 283 | <code>        isMesh: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 284 | <code>        geometry: { groups: [], index: { count: 3 }, attributes: { position: { count: 3 } }, addGroup() {} },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 285 | <code>        material</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 286 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 287 | <code>    const root = {</code> | 声明局部标识符 `root`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 288 | <code>        traverse(visitor) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 289 | <code>            visitor(root);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 290 | <code>            visitor(mesh);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 291 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 292 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 293 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 294 | <code>    const controller = new MToonRenderProfileController({</code> | 声明局部标识符 `controller`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 295 | <code>        vrm: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 296 | <code>            scene: root</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 297 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 298 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 299 | <code>    controller.bindVrm(controller.vrm);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 300 | <code>    controller.apply('ailis_hard_cel_mtoon', {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 301 | <code>        outlineEnabled: false</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 302 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 303 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 304 | <code>    assert.equal(material.outlineWidthFactor, 0);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 305 | <code>    assert.equal(material.outlineWidthMode, 'none');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 306 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 307 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 308 | <code>test('VRM model system exposes a safe default scene mood before model load', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 309 | <code>    const { VRMModelSystem } = await import('../src/vrm-model-system.js');</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 310 | <code>    const vrmSystem = new VRMModelSystem();</code> | 声明局部标识符 `vrmSystem`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 311 | <code>    const mood = vrmSystem.getDefaultSceneMood();</code> | 声明局部标识符 `mood`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 312 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 313 | <code>    assert.equal(mood.state, 'idle');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 314 | <code>    assert.equal(mood.camera.distance, 1.1);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 315 | <code>    assert.equal(mood.background, '#f0f8ff');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-render-profiles 的契约与回归行为。”这一文件职责。 |
| 316 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
