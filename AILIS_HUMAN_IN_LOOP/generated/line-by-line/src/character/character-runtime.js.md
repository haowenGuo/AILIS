# src/character/character-runtime.js 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。
- 文件类型：`source-code`
- 原始行数：222
- SHA-256：`56b7cc3368bec74f5cf90e767956f3c4380a56a6747b576ec02aa9a8c0cb1d2a`
- 可运行副本：[打开源文件](../../../../source/src/character/character-runtime.js)
- 依赖：`./behavior-scheduler.js`、`./scene-director.js`、`./character-state-machine.js`、`./emotion-mixer.js`、`./motion-library.js`、`./persona-surface.js`、`./chatvrm-amica-screenplay.js`
- 主要符号：`CharacterRuntime`、`activeSurface`、`signature`、`normalizedSurface`、`surface`、`expressionMix`、`screenplay`、`motion`、`playedMotion`、`state`、`intensity`、`baseMin`、`baseMax`、`intensityBias`、`currentMotion`、`played`

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code>import { CharacterBehaviorScheduler } from './behavior-scheduler.js';</code> | 导入依赖 `./behavior-scheduler.js`，使本文件可以复用外部模块能力。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 2 | <code>import { CharacterSceneDirector } from './scene-director.js';</code> | 导入依赖 `./scene-director.js`，使本文件可以复用外部模块能力。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 3 | <code>import { CharacterStateMachine } from './character-state-machine.js';</code> | 导入依赖 `./character-state-machine.js`，使本文件可以复用外部模块能力。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 4 | <code>import { mixExpressionsForSurface } from './emotion-mixer.js';</code> | 导入依赖 `./emotion-mixer.js`，使本文件可以复用外部模块能力。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 5 | <code>import { selectMotionForSurface } from './motion-library.js';</code> | 导入依赖 `./motion-library.js`，使本文件可以复用外部模块能力。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 6 | <code>import { createPersonaSurfaceFromPayload, normalizePersonaSurfaceState } from './persona-surface.js';</code> | 导入依赖 `./persona-surface.js`，使本文件可以复用外部模块能力。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 7 | <code>import { surfaceToScreenplay } from './chatvrm-amica-screenplay.js';</code> | 导入依赖 `./chatvrm-amica-screenplay.js`，使本文件可以复用外部模块能力。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 8 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 9 | <code>export class CharacterRuntime {</code> | 定义类 `CharacterRuntime`，把相关状态与行为收拢为一个运行时对象。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 10 | <code>    constructor({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 11 | <code>        driver = null,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 12 | <code>        scheduler = new CharacterBehaviorScheduler(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 13 | <code>        stateMachine = new CharacterStateMachine(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 14 | <code>        sceneDirector = new CharacterSceneDirector()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 15 | <code>    } = {}) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 16 | <code>        this.driver = driver;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 17 | <code>        this.scheduler = scheduler;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 18 | <code>        this.stateMachine = stateMachine;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 19 | <code>        this.sceneDirector = sceneDirector;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 20 | <code>        this.currentSurface = normalizePersonaSurfaceState({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 21 | <code>            emotion: 'relaxed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 22 | <code>            taskState: 'idle',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 23 | <code>            gestureIntent: 'none',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 24 | <code>            intensity: 0.32,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 25 | <code>            gazeTarget: 'user',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 26 | <code>            durationHint: 'hold',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 27 | <code>            source: 'runtime_init'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 28 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 29 | <code>        this.currentRoleState = this.stateMachine.transition(this.currentSurface);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 30 | <code>        this.currentSceneMood = this.sceneDirector.createSceneMood(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 31 | <code>            this.currentRoleState.state,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 32 | <code>            this.currentRoleState.surface</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 33 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 34 | <code>        this.lastSceneMoodSignature = this.createSceneMoodSignature(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 35 | <code>            this.currentRoleState,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 36 | <code>            this.currentSurface</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 37 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 38 | <code>        this.lastAppliedSceneMoodSignature = '';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 39 | <code>        this.idleMotionTimerMs = 0;</code> | 注册事件处理：当用户操作、生命周期或运行时事件发生时调用相应逻辑。 |
| 40 | <code>        this.nextIdleMotionMs = this.pickNextIdleMotionDelayMs();</code> | 注册事件处理：当用户操作、生命周期或运行时事件发生时调用相应逻辑。 |
| 41 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 42 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 43 | <code>    setDriver(driver) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 44 | <code>        this.driver = driver;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 45 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 46 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 47 | <code>    createSceneMoodSignature(roleState = this.currentRoleState, surface = this.currentSurface) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 48 | <code>        const activeSurface = surface &#124;&#124; {};</code> | 声明局部标识符 `activeSurface`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 49 | <code>        return [</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 50 | <code>            roleState?.state &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 51 | <code>            activeSurface.emotion &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 52 | <code>            activeSurface.taskState &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 53 | <code>            activeSurface.socialTone &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 54 | <code>            activeSurface.gazeTarget &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 55 | <code>            Number(activeSurface.intensity &#124;&#124; 0).toFixed(3),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 56 | <code>            Number(activeSurface.speechEnergy &#124;&#124; 0).toFixed(3)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 57 | <code>        ].join('&#124;');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 58 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 59 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 60 | <code>    updateSceneMoodForCurrentSurface(source = 'runtime_update', { force = false } = {}) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 61 | <code>        const signature = this.createSceneMoodSignature(this.currentRoleState, this.currentSurface);</code> | 声明局部标识符 `signature`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 62 | <code>        if (!force &amp;&amp; signature === this.lastAppliedSceneMoodSignature) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 63 | <code>            return this.currentSceneMood;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 64 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 65 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 66 | <code>        this.currentSceneMood = this.sceneDirector.createSceneMood(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 67 | <code>            this.currentRoleState.state,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 68 | <code>            this.currentSurface</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 69 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 70 | <code>        this.lastSceneMoodSignature = signature;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 71 | <code>        this.lastAppliedSceneMoodSignature = signature;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 72 | <code>        this.driver?.applySceneMood?.(this.currentSceneMood, {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 73 | <code>            source</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 74 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 75 | <code>        return this.currentSceneMood;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 76 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 77 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 78 | <code>    setSurfaceState(surfacePatch = {}) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 79 | <code>        const normalizedSurface = normalizePersonaSurfaceState(surfacePatch, this.currentSurface);</code> | 声明局部标识符 `normalizedSurface`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 80 | <code>        this.currentRoleState = this.stateMachine.transition(normalizedSurface);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 81 | <code>        this.currentSurface = this.currentRoleState.surface;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 82 | <code>        this.scheduler.setSurface(this.currentSurface);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 83 | <code>        this.driver?.setSurfaceState?.(this.currentSurface);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 84 | <code>        this.updateSceneMoodForCurrentSurface(this.currentSurface.source, {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 85 | <code>            force: true</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 86 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 87 | <code>        return this.currentSurface;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 88 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 89 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 90 | <code>    applyPayload(payload = {}, context = {}) {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 91 | <code>        const normalizedSurface = createPersonaSurfaceFromPayload(payload, {</code> | 声明局部标识符 `normalizedSurface`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 92 | <code>            ...context,</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 93 | <code>            previousSurface: this.currentSurface</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 94 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 95 | <code>        this.currentRoleState = this.stateMachine.transition(normalizedSurface, context);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 96 | <code>        const surface = this.currentRoleState.surface;</code> | 声明局部标识符 `surface`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 97 | <code>        this.currentSurface = surface;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 98 | <code>        this.scheduler.setSurface(surface);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 99 | <code>        this.driver?.setSurfaceState?.(surface);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 100 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 101 | <code>        this.updateSceneMoodForCurrentSurface(surface.source, {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 102 | <code>            force: true</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 103 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 104 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 105 | <code>        const expressionMix = mixExpressionsForSurface(surface);</code> | 声明局部标识符 `expressionMix`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 106 | <code>        const screenplay = surfaceToScreenplay(</code> | 声明局部标识符 `screenplay`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 107 | <code>            surface,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 108 | <code>            payload.display_text &#124;&#124; payload.speech_text &#124;&#124; payload.raw_text &#124;&#124; ''</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 109 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 110 | <code>        this.driver?.applyExpressionMix?.(expressionMix, {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 111 | <code>            durationHint: surface.durationHint,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 112 | <code>            source: surface.source</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 113 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 114 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 115 | <code>        const motion = selectMotionForSurface(surface, {</code> | 声明局部标识符 `motion`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 116 | <code>            availableActions: this.driver?.getAvailableMotions?.() &#124;&#124; [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 117 | <code>            currentMotion: this.driver?.getCurrentMotion?.() &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 118 | <code>            allowLegacyActionMotion: Boolean(context.allowLegacyActionMotion),</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 119 | <code>            allowExperimentalMotion: Boolean(context.allowExperimentalMotion &#124;&#124; context.allowExperimental),</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 120 | <code>            allowExpressiveMotion: this.shouldAllowExpressiveMotion(surface, context),</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 121 | <code>            random: context.random</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 122 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 123 | <code>        const playedMotion = motion</code> | 声明局部标识符 `playedMotion`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 124 | <code>            ? this.driver?.playMotion?.(motion, {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 125 | <code>                allowExperimental: Boolean(context.allowExperimentalMotion &#124;&#124; context.allowExperimental)</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 126 | <code>            })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 127 | <code>            : false;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 128 | <code>        if (playedMotion) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 129 | <code>            this.resetIdleMotionTimer();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 130 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 131 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 132 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 133 | <code>            surface,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 134 | <code>            screenplay,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 135 | <code>            roleState: this.currentRoleState,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 136 | <code>            sceneMood: this.currentSceneMood,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 137 | <code>            expressionMix,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 138 | <code>            motion,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 139 | <code>            playedMotion: Boolean(playedMotion)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 140 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 141 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 142 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 143 | <code>    pickNextIdleMotionDelayMs(surface = this.currentSurface) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 144 | <code>        const state = surface?.taskState &#124;&#124; 'idle';</code> | 声明局部标识符 `state`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 145 | <code>        const intensity = Number(surface?.intensity) &#124;&#124; 0.35;</code> | 声明局部标识符 `intensity`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 146 | <code>        const baseMin = state === 'thinking' &#124;&#124; state === 'working' ? 16000 : 19000;</code> | 声明局部标识符 `baseMin`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 147 | <code>        const baseMax = state === 'thinking' &#124;&#124; state === 'working' ? 26000 : 32000;</code> | 声明局部标识符 `baseMax`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 148 | <code>        const intensityBias = Math.max(0, Math.min(1500, intensity * 1500));</code> | 声明局部标识符 `intensityBias`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 149 | <code>        return Math.max(12000, baseMin + Math.random() * (baseMax - baseMin) - intensityBias);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 150 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 151 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 152 | <code>    resetIdleMotionTimer() {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 153 | <code>        this.idleMotionTimerMs = 0;</code> | 注册事件处理：当用户操作、生命周期或运行时事件发生时调用相应逻辑。 |
| 154 | <code>        this.nextIdleMotionMs = this.pickNextIdleMotionDelayMs();</code> | 注册事件处理：当用户操作、生命周期或运行时事件发生时调用相应逻辑。 |
| 155 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 156 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 157 | <code>    shouldRunIdleMotion(context = {}) {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 158 | <code>        if (context.isSpeaking) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 159 | <code>            return false;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 160 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 161 | <code>        const state = this.currentRoleState?.state &#124;&#124; this.currentSurface?.taskState &#124;&#124; 'idle';</code> | 声明局部标识符 `state`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 162 | <code>        if (!['idle', 'listening', 'thinking', 'working', 'waiting_approval'].includes(state)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 163 | <code>            return false;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 164 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 165 | <code>        const currentMotion = String(context.currentMotion &#124;&#124; this.driver?.getCurrentMotion?.() &#124;&#124; '');</code> | 声明局部标识符 `currentMotion`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 166 | <code>        return !currentMotion &#124;&#124; currentMotion.startsWith('idle');</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 167 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 168 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 169 | <code>    runIdleMotion(context = {}) {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 170 | <code>        return this.driver?.playMotion?.('idle') ?? false;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 171 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 172 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 173 | <code>    shouldAllowExpressiveMotion(surface = {}, context = {}) {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 174 | <code>        if (context.allowExpressiveMotion) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 175 | <code>            return true;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 176 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 177 | <code>        if (context.allowLegacyActionMotion) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 178 | <code>            return true;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 179 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 180 | <code>        if (surface.legacyAction === 'dance') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 181 | <code>            return true;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 182 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 183 | <code>        if (surface.legacyAction) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 184 | <code>            return ['greeting', 'farewell', 'success', 'celebrate', 'surprised', 'dance'].includes(surface.gestureIntent);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 185 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 186 | <code>        return surface.gestureIntent === 'dance' &#124;&#124; surface.gestureIntent === 'farewell';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 187 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 188 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 189 | <code>    updateIdleMotion(deltaTime, context = {}) {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 190 | <code>        if (!this.shouldRunIdleMotion(context)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 191 | <code>            this.resetIdleMotionTimer();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 192 | <code>            return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 193 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 194 | <code>        this.idleMotionTimerMs += Math.max(0, deltaTime) * 1000;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 195 | <code>        if (this.idleMotionTimerMs &lt; this.nextIdleMotionMs) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 196 | <code>            return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 197 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 198 | <code>        const played = this.runIdleMotion(context);</code> | 声明局部标识符 `played`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 199 | <code>        if (played) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 200 | <code>            this.resetIdleMotionTimer();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 201 | <code>            return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 202 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 203 | <code>        this.nextIdleMotionMs += 4000;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 204 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 205 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 206 | <code>    beginFrame() {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 207 | <code>        this.scheduler.beginFrame?.();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 208 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 209 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 210 | <code>    update(deltaTime, context = {}) {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 211 | <code>        this.currentRoleState = this.stateMachine.update(deltaTime, this.currentSurface, context);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 212 | <code>        this.currentSurface = this.currentRoleState.surface;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 213 | <code>        this.driver?.setSurfaceState?.(this.currentSurface);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 214 | <code>        this.updateSceneMoodForCurrentSurface('runtime_update');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 215 | <code>        this.updateIdleMotion(deltaTime, context);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 216 | <code>        this.scheduler.update({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 217 | <code>            ...context,</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 218 | <code>            deltaTime,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 219 | <code>            surface: this.currentSurface</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 220 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 221 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 222 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
