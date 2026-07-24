# src/character/emote-controller.js 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。
- 文件类型：`source-code`
- 原始行数：332
- SHA-256：`afa3f4aae2ff4233bcf8550667dd291d8035037232a82ee0074b13238926ee26`
- 可运行副本：[打开源文件](../../../../source/src/character/emote-controller.js)
- 依赖：未从静态文本识别到显式依赖
- 主要符号：`BLINK_CLOSE_SECONDS`、`BLINK_OPEN_SECONDS`、`EXPRESSION_SMOOTHING`、`LIP_SYNC_SMOOTHING`、`DEFAULT_HOLD_SECONDS`、`EMOTION_FALLBACK_MIXES`、`clamp`、`numberValue`、`getLerpAlpha`、`normalizeDurationHint`、`normalized`、`CharacterEmoteController`、`manager`、`names`、`allExpressions`、`presetExpressions`、`customNames`、`expression`、`lower`、`sanitized`、`resolvedName`、`safeValue`、`directExpressionName`、`fallbackMix`、`mix`、`expressionAlpha`、`lipAlpha`、`knownNames`、`current`、`target`、`channelAlpha`、`next`

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code>const BLINK_CLOSE_SECONDS = 0.12;</code> | 声明局部标识符 `BLINK_CLOSE_SECONDS`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 2 | <code>const BLINK_OPEN_SECONDS = 5;</code> | 声明局部标识符 `BLINK_OPEN_SECONDS`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 3 | <code>const EXPRESSION_SMOOTHING = 14;</code> | 声明局部标识符 `EXPRESSION_SMOOTHING`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 4 | <code>const LIP_SYNC_SMOOTHING = 20;</code> | 声明局部标识符 `LIP_SYNC_SMOOTHING`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 5 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 6 | <code>const DEFAULT_HOLD_SECONDS = Object.freeze({</code> | 声明局部标识符 `DEFAULT_HOLD_SECONDS`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 7 | <code>    short: 2.4,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 8 | <code>    medium: 3.6,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 9 | <code>    long: 5.2,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 10 | <code>    hold: Infinity</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 11 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 12 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 13 | <code>const EMOTION_FALLBACK_MIXES = Object.freeze({</code> | 声明局部标识符 `EMOTION_FALLBACK_MIXES`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 14 | <code>    neutral: { relaxed: 0.16 },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 15 | <code>    relaxed: { relaxed: 0.42 },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 16 | <code>    happy: { happy: 0.42, relaxed: 0.18 },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 17 | <code>    angry: { angry: 0.5 },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 18 | <code>    sad: { sad: 0.48, relaxed: 0.16 },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 19 | <code>    surprised: { surprised: 0.46, relaxed: 0.1 },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 20 | <code>    shy: { happy: 0.16, relaxed: 0.28, blinkRight: 0.2 },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 21 | <code>    jealous: { angry: 0.22, sad: 0.12, relaxed: 0.12 },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 22 | <code>    bored: { relaxed: 0.24, sad: 0.12 },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 23 | <code>    serious: { relaxed: 0.34, surprised: 0.06 },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 24 | <code>    suspicious: { surprised: 0.16, angry: 0.12, relaxed: 0.16 },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 25 | <code>    victory: { happy: 0.5, relaxed: 0.18 },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 26 | <code>    sleep: { relaxed: 0.28, sad: 0.12, blink: 0.24 },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 27 | <code>    love: { happy: 0.22, relaxed: 0.34, blinkRight: 0.18 }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 28 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 29 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 30 | <code>function clamp(value, minimum = 0, maximum = 1) {</code> | 定义函数 `clamp`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 31 | <code>    const numberValue = Number(value);</code> | 声明局部标识符 `numberValue`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 32 | <code>    if (!Number.isFinite(numberValue)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 33 | <code>        return minimum;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 34 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 35 | <code>    return Math.min(Math.max(numberValue, minimum), maximum);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 36 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 37 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 38 | <code>function getLerpAlpha(deltaTime, smoothing) {</code> | 定义函数 `getLerpAlpha`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 39 | <code>    return 1 - Math.exp(-Math.max(0, deltaTime) * smoothing);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 40 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 41 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 42 | <code>function normalizeDurationHint(value) {</code> | 定义函数 `normalizeDurationHint`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 43 | <code>    const normalized = String(value &#124;&#124; '').trim().toLowerCase();</code> | 声明局部标识符 `normalized`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 44 | <code>    return normalized in DEFAULT_HOLD_SECONDS ? normalized : 'short';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 45 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 46 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 47 | <code>export class CharacterEmoteController {</code> | 定义类 `CharacterEmoteController`，把相关状态与行为收拢为一个运行时对象。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 48 | <code>    constructor({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 49 | <code>        getExpressionPresets = () =&gt; ({}),</code> | 注册事件处理：当用户操作、生命周期或运行时事件发生时调用相应逻辑。 |
| 50 | <code>        defaultMix = { relaxed: 0.18 }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 51 | <code>    } = {}) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 52 | <code>        this.vrm = null;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 53 | <code>        this.expressionManager = null;</code> | 注册事件处理：当用户操作、生命周期或运行时事件发生时调用相应逻辑。 |
| 54 | <code>        this.getExpressionPresets = getExpressionPresets;</code> | 注册事件处理：当用户操作、生命周期或运行时事件发生时调用相应逻辑。 |
| 55 | <code>        this.defaultMix = { ...defaultMix };</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 56 | <code>        this.expressionNames = new Set(Object.keys(this.getExpressionPresets() &#124;&#124; {}));</code> | 注册事件处理：当用户操作、生命周期或运行时事件发生时调用相应逻辑。 |
| 57 | <code>        this.emotionTarget = { ...this.defaultMix };</code> | 注册事件处理：当用户操作、生命周期或运行时事件发生时调用相应逻辑。 |
| 58 | <code>        this.expressionValues = {};</code> | 注册事件处理：当用户操作、生命周期或运行时事件发生时调用相应逻辑。 |
| 59 | <code>        this.holdRemainingSeconds = Infinity;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 60 | <code>        this.lipSyncTarget = 0;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 61 | <code>        this.lipSyncValue = 0;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 62 | <code>        this.autoBlinkEnabled = true;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 63 | <code>        this.blinkRemainingSeconds = BLINK_OPEN_SECONDS;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 64 | <code>        this.isBlinkClosed = false;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 65 | <code>        this.cachedKnownExpressionNames = [];</code> | 注册事件处理：当用户操作、生命周期或运行时事件发生时调用相应逻辑。 |
| 66 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 67 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 68 | <code>    bindVrm(vrm) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 69 | <code>        this.vrm = vrm &#124;&#124; null;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 70 | <code>        this.expressionManager = vrm?.expressionManager &#124;&#124; null;</code> | 注册事件处理：当用户操作、生命周期或运行时事件发生时调用相应逻辑。 |
| 71 | <code>        this.registerCustomExpressions(vrm);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 72 | <code>        this.expressionNames = new Set([</code> | 注册事件处理：当用户操作、生命周期或运行时事件发生时调用相应逻辑。 |
| 73 | <code>            ...Object.keys(this.getExpressionPresets() &#124;&#124; {}),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 74 | <code>            ...this.discoverExpressionNames(vrm)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 75 | <code>        ]);</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 76 | <code>        this.expressionValues = {};</code> | 注册事件处理：当用户操作、生命周期或运行时事件发生时调用相应逻辑。 |
| 77 | <code>        this.emotionTarget = { ...this.defaultMix };</code> | 注册事件处理：当用户操作、生命周期或运行时事件发生时调用相应逻辑。 |
| 78 | <code>        this.holdRemainingSeconds = Infinity;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 79 | <code>        this.lipSyncTarget = 0;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 80 | <code>        this.lipSyncValue = 0;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 81 | <code>        this.blinkRemainingSeconds = BLINK_OPEN_SECONDS;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 82 | <code>        this.isBlinkClosed = false;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 83 | <code>        this.refreshKnownExpressionNames(['aa', 'blink']);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 84 | <code>        this.applyAllExpressionsImmediately(0);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 85 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 86 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 87 | <code>    discoverExpressionNames(vrm = this.vrm) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 88 | <code>        const manager = vrm?.expressionManager;</code> | 声明局部标识符 `manager`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 89 | <code>        const names = new Set();</code> | 声明局部标识符 `names`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 90 | <code>        for (const name of Object.keys(this.getExpressionPresets() &#124;&#124; {})) {</code> | 声明局部标识符 `name`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 91 | <code>            names.add(name);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 92 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 93 | <code>        for (const expression of manager?.expressions &#124;&#124; []) {</code> | 声明局部标识符 `expression`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 94 | <code>            if (expression?.expressionName) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 95 | <code>                names.add(expression.expressionName);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 96 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 97 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 98 | <code>        for (const name of Object.keys(manager?.expressionMap &#124;&#124; {})) {</code> | 声明局部标识符 `name`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 99 | <code>            names.add(name);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 100 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 101 | <code>        for (const name of Object.keys(manager?.presetExpressionMap &#124;&#124; {})) {</code> | 声明局部标识符 `name`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 102 | <code>            names.add(name);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 103 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 104 | <code>        return [...names];</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 105 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 106 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 107 | <code>    registerCustomExpressions(vrm = this.vrm) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 108 | <code>        const manager = vrm?.expressionManager;</code> | 声明局部标识符 `manager`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 109 | <code>        if (!manager?.expressionMap &#124;&#124; typeof manager.registerExpression !== 'function') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 110 | <code>            return [];</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 111 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 112 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 113 | <code>        const allExpressions = manager.expressionMap &#124;&#124; {};</code> | 声明局部标识符 `allExpressions`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 114 | <code>        const presetExpressions = manager.presetExpressionMap &#124;&#124; {};</code> | 声明局部标识符 `presetExpressions`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 115 | <code>        const customNames = Object.keys(allExpressions).filter((name) =&gt; !(name in presetExpressions));</code> | 声明局部标识符 `customNames`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 116 | <code>        for (const expressionName of customNames) {</code> | 声明局部标识符 `expressionName`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 117 | <code>            const expression = allExpressions[expressionName];</code> | 声明局部标识符 `expression`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 118 | <code>            if (!expression) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 119 | <code>                continue;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 120 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 121 | <code>            try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 122 | <code>                manager.registerExpression(expression);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 123 | <code>            } catch {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 124 | <code>                // Some three-vrm versions already register these expressions.</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 125 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 126 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 127 | <code>        return customNames;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 128 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 129 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 130 | <code>    getKnownExpressionNames(extraNames = []) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 131 | <code>        return new Set([</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 132 | <code>            ...Object.keys(this.getExpressionPresets() &#124;&#124; {}),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 133 | <code>            ...this.expressionNames,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 134 | <code>            ...Object.keys(this.expressionValues &#124;&#124; {}),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 135 | <code>            ...Object.keys(this.emotionTarget &#124;&#124; {}),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 136 | <code>            ...extraNames</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 137 | <code>        ]);</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 138 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 139 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 140 | <code>    refreshKnownExpressionNames(extraNames = []) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 141 | <code>        this.cachedKnownExpressionNames = [...this.getKnownExpressionNames(extraNames)];</code> | 注册事件处理：当用户操作、生命周期或运行时事件发生时调用相应逻辑。 |
| 142 | <code>        return this.cachedKnownExpressionNames;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 143 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 144 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 145 | <code>    resolveExpressionName(expressionName) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 146 | <code>        if (!expressionName) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 147 | <code>            return '';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 148 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 149 | <code>        const normalized = String(expressionName).trim();</code> | 声明局部标识符 `normalized`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 150 | <code>        if (this.expressionNames.has(normalized)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 151 | <code>            return normalized;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 152 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 153 | <code>        const lower = normalized.toLowerCase();</code> | 声明局部标识符 `lower`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 154 | <code>        for (const name of this.expressionNames) {</code> | 声明局部标识符 `name`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 155 | <code>            if (String(name).toLowerCase() === lower) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 156 | <code>                return name;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 157 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 158 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 159 | <code>        return '';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 160 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 161 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 162 | <code>    sanitizeMix(mix = {}) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 163 | <code>        const sanitized = {};</code> | 声明局部标识符 `sanitized`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 164 | <code>        for (const [name, value] of Object.entries(mix &#124;&#124; {})) {</code> | 循环控制：对集合、队列、重试次数或状态持续执行同一组逻辑。 |
| 165 | <code>            const resolvedName = this.resolveExpressionName(name);</code> | 声明局部标识符 `resolvedName`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 166 | <code>            if (!resolvedName) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 167 | <code>                continue;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 168 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 169 | <code>            const safeValue = clamp(value);</code> | 声明局部标识符 `safeValue`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 170 | <code>            if (safeValue &gt; 0.01) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 171 | <code>                sanitized[resolvedName] = Number(safeValue.toFixed(3));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 172 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 173 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 174 | <code>        return sanitized;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 175 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 176 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 177 | <code>    setEmotionMix(mix = {}, { durationHint = 'short' } = {}) {</code> | 注册事件处理：当用户操作、生命周期或运行时事件发生时调用相应逻辑。 |
| 178 | <code>        const sanitized = this.sanitizeMix(mix);</code> | 声明局部标识符 `sanitized`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 179 | <code>        this.emotionTarget = Object.keys(sanitized).length ? sanitized : { ...this.defaultMix };</code> | 注册事件处理：当用户操作、生命周期或运行时事件发生时调用相应逻辑。 |
| 180 | <code>        this.holdRemainingSeconds = DEFAULT_HOLD_SECONDS[normalizeDurationHint(durationHint)];</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 181 | <code>        return true;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 182 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 183 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 184 | <code>    playEmotion(emotionName, options = {}) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 185 | <code>        const normalized = String(emotionName &#124;&#124; 'relaxed').trim().toLowerCase();</code> | 声明局部标识符 `normalized`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 186 | <code>        const directExpressionName = this.resolveExpressionName(normalized);</code> | 声明局部标识符 `directExpressionName`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 187 | <code>        const fallbackMix = EMOTION_FALLBACK_MIXES[normalized] &#124;&#124; EMOTION_FALLBACK_MIXES.relaxed;</code> | 声明局部标识符 `fallbackMix`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 188 | <code>        const mix = directExpressionName</code> | 声明局部标识符 `mix`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 189 | <code>            ? { [directExpressionName]: normalized === 'surprised' ? 0.5 : 1 }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 190 | <code>            : fallbackMix;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 191 | <code>        return this.setEmotionMix(mix, {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 192 | <code>            durationHint: options.durationHint &#124;&#124; 'medium'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 193 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 194 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 195 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 196 | <code>    lipSync(expressionName = 'aa', value = 0) {</code> | 注册事件处理：当用户操作、生命周期或运行时事件发生时调用相应逻辑。 |
| 197 | <code>        if (this.resolveExpressionName(expressionName &#124;&#124; 'aa') !== 'aa') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 198 | <code>            return this.setLipSyncValue(value);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 199 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 200 | <code>        return this.setLipSyncValue(value);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 201 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 202 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 203 | <code>    clearEmotionMix() {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 204 | <code>        this.emotionTarget = { ...this.defaultMix };</code> | 注册事件处理：当用户操作、生命周期或运行时事件发生时调用相应逻辑。 |
| 205 | <code>        this.holdRemainingSeconds = Infinity;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 206 | <code>        return true;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 207 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 208 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 209 | <code>    setLipSyncValue(value) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 210 | <code>        this.lipSyncTarget = clamp(value);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 211 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 212 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 213 | <code>    setAutoBlinkEnabled(enabled) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 214 | <code>        this.autoBlinkEnabled = Boolean(enabled);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 215 | <code>        if (!this.autoBlinkEnabled &amp;&amp; this.isBlinkClosed) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 216 | <code>            this.openBlink();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 217 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 218 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 219 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 220 | <code>    forceBlink() {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 221 | <code>        if (!this.expressionManager) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 222 | <code>            return false;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 223 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 224 | <code>        this.closeBlink();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 225 | <code>        return true;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 226 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 227 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 228 | <code>    closeBlink() {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 229 | <code>        this.isBlinkClosed = true;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 230 | <code>        this.blinkRemainingSeconds = BLINK_CLOSE_SECONDS;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 231 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 232 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 233 | <code>    openBlink() {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 234 | <code>        this.isBlinkClosed = false;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 235 | <code>        this.blinkRemainingSeconds = BLINK_OPEN_SECONDS;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 236 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 237 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 238 | <code>    shouldAutoBlink() {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 239 | <code>        if (!this.autoBlinkEnabled) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 240 | <code>            return false;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 241 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 242 | <code>        return !(</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 243 | <code>            this.emotionTarget.blink &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 244 | <code>            this.emotionTarget.blinkLeft &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 245 | <code>            this.emotionTarget.blinkRight</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 246 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 247 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 248 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 249 | <code>    updateBlink(deltaTime) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 250 | <code>        if (!this.shouldAutoBlink()) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 251 | <code>            if (this.isBlinkClosed) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 252 | <code>                this.openBlink();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 253 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 254 | <code>            return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 255 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 256 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 257 | <code>        this.blinkRemainingSeconds -= Math.max(0, deltaTime);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 258 | <code>        if (this.blinkRemainingSeconds &gt; 0) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 259 | <code>            return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 260 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 261 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 262 | <code>        if (this.isBlinkClosed) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 263 | <code>            this.openBlink();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 264 | <code>            return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 265 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 266 | <code>        this.closeBlink();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 267 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 268 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 269 | <code>    updateHold(deltaTime) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 270 | <code>        if (!Number.isFinite(this.holdRemainingSeconds)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 271 | <code>            return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 272 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 273 | <code>        this.holdRemainingSeconds -= Math.max(0, deltaTime);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 274 | <code>        if (this.holdRemainingSeconds &lt;= 0) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 275 | <code>            this.clearEmotionMix();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 276 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 277 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 278 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 279 | <code>    getTargetValue(expressionName) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 280 | <code>        if (expressionName === 'aa') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 281 | <code>            return this.lipSyncValue;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 282 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 283 | <code>        if (expressionName === 'blink') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 284 | <code>            return Math.max(this.emotionTarget.blink &#124;&#124; 0, this.isBlinkClosed ? 1 : 0);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 285 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 286 | <code>        return this.emotionTarget[expressionName] &#124;&#124; 0;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 287 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 288 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 289 | <code>    setManagerValue(expressionName, value) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 290 | <code>        if (!this.expressionManager &#124;&#124; expressionName === 'neutral') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 291 | <code>            return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 292 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 293 | <code>        try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 294 | <code>            this.expressionManager.setValue(expressionName, clamp(value));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 295 | <code>        } catch {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 296 | <code>            // Some VRM files expose fewer expression presets than the config.</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 297 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 298 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 299 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 300 | <code>    applyAllExpressionsImmediately(value = 0) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 301 | <code>        for (const name of this.getKnownExpressionNames(['aa', 'blink'])) {</code> | 声明局部标识符 `name`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 302 | <code>            this.expressionValues[name] = value;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 303 | <code>            this.setManagerValue(name, value);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 304 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 305 | <code>        this.refreshKnownExpressionNames(['aa', 'blink']);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 306 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 307 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 308 | <code>    update(deltaTime) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 309 | <code>        if (!this.expressionManager) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 310 | <code>            return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 311 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 312 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 313 | <code>        this.updateHold(deltaTime);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 314 | <code>        this.updateBlink(deltaTime);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 315 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 316 | <code>        const expressionAlpha = getLerpAlpha(deltaTime, EXPRESSION_SMOOTHING);</code> | 声明局部标识符 `expressionAlpha`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 317 | <code>        const lipAlpha = getLerpAlpha(deltaTime, LIP_SYNC_SMOOTHING);</code> | 声明局部标识符 `lipAlpha`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 318 | <code>        this.lipSyncValue += (this.lipSyncTarget - this.lipSyncValue) * lipAlpha;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 319 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 320 | <code>        const knownNames = this.cachedKnownExpressionNames.length</code> | 声明局部标识符 `knownNames`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 321 | <code>            ? this.cachedKnownExpressionNames</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 322 | <code>            : this.refreshKnownExpressionNames(['aa', 'blink']);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 323 | <code>        for (const name of knownNames) {</code> | 声明局部标识符 `name`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 324 | <code>            const current = this.expressionValues[name] &#124;&#124; 0;</code> | 声明局部标识符 `current`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 325 | <code>            const target = this.getTargetValue(name);</code> | 声明局部标识符 `target`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 326 | <code>            const channelAlpha = name === 'aa' ? lipAlpha : expressionAlpha;</code> | 声明局部标识符 `channelAlpha`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 327 | <code>            const next = current + (target - current) * channelAlpha;</code> | 声明局部标识符 `next`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 328 | <code>            this.expressionValues[name] = next;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 329 | <code>            this.setManagerValue(name, next);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 330 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 331 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 332 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
