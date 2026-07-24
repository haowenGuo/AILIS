# tests/ailis-character-runtime.test.mjs 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：自动化测试：验证 ailis-character-runtime 的契约与回归行为。
- 文件类型：`source-code`
- 原始行数：497
- SHA-256：`db0114c2d271ed0aa9e5e1d5ee67848f633dbabb2ae896e752afe523419a3404`
- 可运行副本：[打开源文件](../../../source/tests/ailis-character-runtime.test.mjs)
- 依赖：`node:assert/strict`、`node:test`、`../src/character/character-runtime.js`、`../src/character/scene-director.js`、`../src/character/character-state-machine.js`、`../src/character/emote-controller.js`、`../src/character/chatvrm-amica-motion-controller.js`、`../src/character/chatvrm-amica-screenplay.js`、`../src/character/behavior-scheduler.js`、`../src/character/emotion-mixer.js`、`../src/character/motion-library.js`、`../src/character/motion-intake-catalog.js`、`../src/character/persona-surface.js`、`../src/config.js`
- 主要符号：`surface`、`motion`、`intakeById`、`sources`、`intake`、`loadable`、`mix`、`values`、`controller`、`parsed`、`talks`、`screenplay`、`calls`、`createAction`、`listeners`、`mixer`、`idle`、`clapping`、`idleResetCount`、`bones`、`scheduler`、`vrm`、`runtime`、`result`、`stateMachine`、`director`、`mood`

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code>import assert from 'node:assert/strict';</code> | 导入依赖 `node:assert/strict`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 2 | <code>import test from 'node:test';</code> | 导入依赖 `node:test`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 3 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4 | <code>import { CharacterRuntime } from '../src/character/character-runtime.js';</code> | 导入依赖 `../src/character/character-runtime.js`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 5 | <code>import { CharacterSceneDirector } from '../src/character/scene-director.js';</code> | 导入依赖 `../src/character/scene-director.js`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 6 | <code>import { CharacterStateMachine } from '../src/character/character-state-machine.js';</code> | 导入依赖 `../src/character/character-state-machine.js`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 7 | <code>import { CharacterEmoteController } from '../src/character/emote-controller.js';</code> | 导入依赖 `../src/character/emote-controller.js`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 8 | <code>import { ChatVRMAmicaMotionController } from '../src/character/chatvrm-amica-motion-controller.js';</code> | 导入依赖 `../src/character/chatvrm-amica-motion-controller.js`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 9 | <code>import { parseEmotionTaggedText, surfaceToScreenplay, textsToScreenplay } from '../src/character/chatvrm-amica-screenplay.js';</code> | 导入依赖 `../src/character/chatvrm-amica-screenplay.js`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 10 | <code>import { CharacterBehaviorScheduler } from '../src/character/behavior-scheduler.js';</code> | 导入依赖 `../src/character/behavior-scheduler.js`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 11 | <code>import { mixExpressionsForSurface } from '../src/character/emotion-mixer.js';</code> | 导入依赖 `../src/character/emotion-mixer.js`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 12 | <code>import { isMotionApproved, listMotionLibrary, selectMotionForSurface } from '../src/character/motion-library.js';</code> | 导入依赖 `../src/character/motion-library.js`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 13 | <code>import { getLoadableMotionFiles, listMotionIntakeEntries, listMotionIntakeSources } from '../src/character/motion-intake-catalog.js';</code> | 导入依赖 `../src/character/motion-intake-catalog.js`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 14 | <code>import { createPersonaSurfaceFromPayload, normalizePersonaSurfaceState } from '../src/character/persona-surface.js';</code> | 导入依赖 `../src/character/persona-surface.js`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 15 | <code>import { CONFIG } from '../src/config.js';</code> | 导入依赖 `../src/config.js`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 16 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 17 | <code>test('default avatar model uses the approved AILIS VRM asset', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 18 | <code>    assert.equal(CONFIG.MODEL_PATH, 'Resources/AILIS.vrm');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 19 | <code>    assert.ok(!CONFIG.MODEL_PATH.includes('AILIS_18.vrm'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 20 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 21 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 22 | <code>test('persona surface normalizes legacy avatar cue into semantic state', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 23 | <code>    const surface = createPersonaSurfaceFromPayload({</code> | 声明局部标识符 `surface`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 24 | <code>        display_text: '你好呀，我在。',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 25 | <code>        action: 'wave',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 26 | <code>        expression: 'happy'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 27 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 28 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 29 | <code>    assert.equal(surface.emotion, 'happy');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 30 | <code>    assert.equal(surface.gestureIntent, 'greeting');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 31 | <code>    assert.equal(surface.taskState, 'speaking');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 32 | <code>    assert.equal(surface.legacyAction, 'wave');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 33 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 34 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 35 | <code>test('motion library does not auto-play one-shot motion for semantic thinking state', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 36 | <code>    const surface = normalizePersonaSurfaceState({</code> | 声明局部标识符 `surface`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 37 | <code>        emotion: 'thinking',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 38 | <code>        gestureIntent: 'thinking',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 39 | <code>        taskState: 'thinking'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 40 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 41 | <code>    const motion = selectMotionForSurface(surface, {</code> | 声明局部标识符 `motion`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 42 | <code>        availableActions: ['idle', 'relax', 'thinking', 'lookaround'],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 43 | <code>        random: () =&gt; 0.99</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 44 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 45 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 46 | <code>    assert.equal(motion, null);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 47 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 48 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 49 | <code>test('motion library ignores legacy action cues unless runtime explicitly allows them', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 50 | <code>    const surface = normalizePersonaSurfaceState({</code> | 声明局部标识符 `surface`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 51 | <code>        emotion: 'thinking',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 52 | <code>        gestureIntent: 'thinking',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 53 | <code>        taskState: 'thinking',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 54 | <code>        legacyAction: 'thinking'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 55 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 56 | <code>    const motion = selectMotionForSurface(surface, {</code> | 声明局部标识符 `motion`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 57 | <code>        availableActions: ['idle', 'relax', 'thinking'],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 58 | <code>        random: () =&gt; 0.99</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 59 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 60 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 61 | <code>    assert.equal(motion, null);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 62 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 63 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 64 | <code>test('motion library allows legacy action cues only in experimental review mode', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 65 | <code>    const surface = normalizePersonaSurfaceState({</code> | 声明局部标识符 `surface`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 66 | <code>        emotion: 'thinking',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 67 | <code>        gestureIntent: 'thinking',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 68 | <code>        taskState: 'thinking',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 69 | <code>        legacyAction: 'thinking'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 70 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 71 | <code>    const motion = selectMotionForSurface(surface, {</code> | 声明局部标识符 `motion`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 72 | <code>        availableActions: ['idle', 'relax', 'thinking'],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 73 | <code>        allowLegacyActionMotion: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 74 | <code>        allowExperimentalMotion: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 75 | <code>        random: () =&gt; 0.99</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 76 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 77 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 78 | <code>    assert.equal(motion.id, 'thinking');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 79 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 80 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 81 | <code>test('motion library keeps semantic success from auto-playing expressive motions', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 82 | <code>    const surface = normalizePersonaSurfaceState({</code> | 声明局部标识符 `surface`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 83 | <code>        emotion: 'happy',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 84 | <code>        gestureIntent: 'success',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 85 | <code>        taskState: 'happy_success'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 86 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 87 | <code>    const motion = selectMotionForSurface(surface, {</code> | 声明局部标识符 `motion`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 88 | <code>        availableActions: ['relax', 'clapping', 'jump'],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 89 | <code>        random: () =&gt; 0.99</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 90 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 91 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 92 | <code>    assert.equal(motion, null);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 93 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 94 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 95 | <code>test('motion intake catalog covers every runtime motion with review metadata', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 96 | <code>    const intakeById = new Map(listMotionIntakeEntries().map((entry) =&gt; [entry.id, entry]));</code> | 声明局部标识符 `intakeById`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 97 | <code>    const sources = new Set(listMotionIntakeSources().map((source) =&gt; source.id));</code> | 声明局部标识符 `sources`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 98 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 99 | <code>    for (const motion of listMotionLibrary()) {</code> | 声明局部标识符 `motion`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 100 | <code>        const intake = intakeById.get(motion.id);</code> | 声明局部标识符 `intake`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 101 | <code>        assert.ok(intake, `${motion.id} missing intake metadata`);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 102 | <code>        assert.ok(sources.has(intake.source), `${motion.id} references unknown source`);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 103 | <code>        assert.equal(typeof intake.license, 'string');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 104 | <code>        assert.ok(intake.license.length &gt; 0);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 105 | <code>        assert.ok(Array.isArray(intake.style));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 106 | <code>        assert.ok(intake.style.length &gt; 0);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 107 | <code>        assert.equal(typeof intake.approved, 'boolean');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 108 | <code>        assert.ok(Number.isFinite(Number(intake.feminineScore)));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 109 | <code>        assert.ok(Number(intake.feminineScore) &gt;= 0);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 110 | <code>        assert.ok(Number(intake.feminineScore) &lt;= 1);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 111 | <code>        assert.ok(['low', 'medium', 'high', 'unknown'].includes(intake.clippingRisk));</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 112 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 113 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 114 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 115 | <code>test('motion intake keeps reviewed motions loadable without auto-approving risky ones', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 116 | <code>    const loadable = new Set(getLoadableMotionFiles().map((motion) =&gt; motion.name));</code> | 声明局部标识符 `loadable`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 117 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 118 | <code>    assert.equal(loadable.has('vroid_greeting'), true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 119 | <code>    assert.equal(loadable.has('vroid_peace'), true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 120 | <code>    assert.equal(loadable.has('vrma17'), true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 121 | <code>    assert.equal(loadable.has('jump'), true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 122 | <code>    assert.equal(loadable.has('fumi_004_hello_1'), true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 123 | <code>    assert.equal(loadable.has('sachi_wave01'), false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 124 | <code>    assert.equal(isMotionApproved('vroid_greeting'), false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 125 | <code>    assert.equal(isMotionApproved('vrma17'), false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 126 | <code>    assert.equal(isMotionApproved('jump'), false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 127 | <code>    assert.equal(isMotionApproved('fumi_004_hello_1'), false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 128 | <code>    assert.equal(isMotionApproved('idle'), true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 129 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 130 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 131 | <code>test('persona surface infers dance intent from assistant text as a fallback', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 132 | <code>    const surface = createPersonaSurfaceFromPayload({</code> | 声明局部标识符 `surface`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 133 | <code>        display_text: '好呀，我现在给你跳一段舞。'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 134 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 135 | <code>    const motion = selectMotionForSurface(surface, {</code> | 声明局部标识符 `motion`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 136 | <code>        availableActions: ['idle', 'vrma17', 'vrma25'],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 137 | <code>        currentMotion: 'idle',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 138 | <code>        allowExpressiveMotion: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 139 | <code>        random: () =&gt; 0</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 140 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 141 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 142 | <code>    assert.equal(surface.gestureIntent, 'dance');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 143 | <code>    assert.equal(motion, null);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 144 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 145 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 146 | <code>test('emotion mixer creates subtle multi-expression mix for shy state', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 147 | <code>    const mix = mixExpressionsForSurface(normalizePersonaSurfaceState({</code> | 声明局部标识符 `mix`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 148 | <code>        emotion: 'shy',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 149 | <code>        intensity: 0.62,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 150 | <code>        socialTone: 'soft'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 151 | <code>    }));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 152 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 153 | <code>    assert.ok(mix.blinkRight &gt; 0.2);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 154 | <code>    assert.ok(mix.happy &gt; 0.1);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 155 | <code>    assert.ok(mix.relaxed &gt; 0.1);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 156 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 157 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 158 | <code>test('chatvrm-style emote controller owns smooth emotion, blink, and lip sync channels', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 159 | <code>    const values = {};</code> | 声明局部标识符 `values`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 160 | <code>    const controller = new CharacterEmoteController({</code> | 声明局部标识符 `controller`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 161 | <code>        getExpressionPresets: () =&gt; ({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 162 | <code>            happy: 1,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 163 | <code>            relaxed: 1,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 164 | <code>            blink: 1,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 165 | <code>            blinkRight: 1,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 166 | <code>            aa: 1,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 167 | <code>            neutral: 0</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 168 | <code>        }),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 169 | <code>        defaultMix: { relaxed: 0.18 }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 170 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 171 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 172 | <code>    controller.bindVrm({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 173 | <code>        expressionManager: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 174 | <code>            setValue: (name, value) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 175 | <code>                values[name] = value;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 176 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 177 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 178 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 179 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 180 | <code>    controller.setEmotionMix({ happy: 0.5, relaxed: 0.2 }, { durationHint: 'hold' });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 181 | <code>    controller.setLipSyncValue(0.8);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 182 | <code>    controller.update(0.1);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 183 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 184 | <code>    assert.ok(values.happy &gt; 0);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 185 | <code>    assert.ok(values.happy &lt; 0.5);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 186 | <code>    assert.ok(values.aa &gt; 0);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 187 | <code>    assert.equal(values.blink &lt; 0.01, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 188 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 189 | <code>    controller.update(5.1);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 190 | <code>    assert.ok(values.blink &gt; 0.8);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 191 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 192 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 193 | <code>test('chatvrm/amica screenplay parses emotion tags without leaking VRM action names', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 194 | <code>    const parsed = parseEmotionTaggedText('[love]我有点想贴贴。');</code> | 声明局部标识符 `parsed`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 195 | <code>    assert.equal(parsed.emotion, 'love');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 196 | <code>    assert.equal(parsed.message, '我有点想贴贴。');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 197 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 198 | <code>    const talks = textsToScreenplay(['[serious]我先检查一下。', '然后告诉你结果。']);</code> | 声明局部标识符 `talks`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 199 | <code>    assert.equal(talks[0].expression, 'serious');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 200 | <code>    assert.equal(talks[0].talk.style, 'talk');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 201 | <code>    assert.equal(talks[1].expression, 'serious');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 202 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 203 | <code>    const screenplay = surfaceToScreenplay({</code> | 声明局部标识符 `screenplay`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 204 | <code>        emotion: 'victory',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 205 | <code>        text: '搞定啦。'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 206 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 207 | <code>    assert.equal(screenplay.expression, 'victory');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 208 | <code>    assert.equal(screenplay.talk.style, 'happy');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 209 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 210 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 211 | <code>test('amica-style motion controller plays one-shot action and fades back to idle', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 212 | <code>    const calls = [];</code> | 声明局部标识符 `calls`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 213 | <code>    const createAction = (name) =&gt; ({</code> | 声明局部标识符 `createAction`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 214 | <code>        name,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 215 | <code>        enabled: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 216 | <code>        loop: null,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 217 | <code>        repetitions: null,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 218 | <code>        clampWhenFinished: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 219 | <code>        time: 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 220 | <code>        reset() {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 221 | <code>            calls.push(['reset', name]);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 222 | <code>            return this;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 223 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 224 | <code>        setLoop(loop, repetitions) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 225 | <code>            this.loop = loop;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 226 | <code>            this.repetitions = repetitions;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 227 | <code>            calls.push(['loop', name, repetitions]);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 228 | <code>            return this;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 229 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 230 | <code>        setEffectiveTimeScale(value) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 231 | <code>            this.timeScale = value;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 232 | <code>            return this;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 233 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 234 | <code>        setEffectiveWeight(value) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 235 | <code>            this.weight = value;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 236 | <code>            return this;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 237 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 238 | <code>        fadeIn(value) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 239 | <code>            calls.push(['fadeIn', name, value]);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 240 | <code>            return this;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 241 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 242 | <code>        fadeOut(value) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 243 | <code>            calls.push(['fadeOut', name, value]);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 244 | <code>            return this;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 245 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 246 | <code>        stopFading() {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 247 | <code>            calls.push(['stopFading', name]);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 248 | <code>            return this;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 249 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 250 | <code>        crossFadeTo(action, duration) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 251 | <code>            calls.push(['crossFade', name, action.name, duration]);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 252 | <code>            return this;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 253 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 254 | <code>        stop() {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 255 | <code>            calls.push(['stop', name]);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 256 | <code>            return this;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 257 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 258 | <code>        play() {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 259 | <code>            calls.push(['play', name]);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 260 | <code>            return this;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 261 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 262 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 263 | <code>    const listeners = {};</code> | 声明局部标识符 `listeners`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 264 | <code>    const mixer = {</code> | 声明局部标识符 `mixer`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 265 | <code>        addEventListener(type, listener) {</code> | 注册事件处理：当用户操作、生命周期或运行时事件发生时调用相应逻辑。 |
| 266 | <code>            listeners[type] = listener;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 267 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 268 | <code>        removeEventListener(type) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 269 | <code>            delete listeners[type];</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 270 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 271 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 272 | <code>    const idle = createAction('idle');</code> | 声明局部标识符 `idle`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 273 | <code>    const clapping = createAction('clapping');</code> | 声明局部标识符 `clapping`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 274 | <code>    const controller = new ChatVRMAmicaMotionController({</code> | 声明局部标识符 `controller`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 275 | <code>        idleActions: ['idle'],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 276 | <code>        crossFadeDuration: 0.4,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 277 | <code>        logger: { log() {}, warn() {}, debug() {} }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 278 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 279 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 280 | <code>    controller.bind({ mixer, actionMap: { idle, clapping } });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 281 | <code>    controller.prepareAllActions();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 282 | <code>    assert.equal(controller.play('idle'), true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 283 | <code>    assert.equal(controller.getCurrentActionName(), 'idle');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 284 | <code>    const idleResetCount = calls.filter((call) =&gt; call[0] === 'reset' &amp;&amp; call[1] === 'idle').length;</code> | 声明局部标识符 `idleResetCount`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 285 | <code>    assert.equal(controller.play('idle'), true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 286 | <code>    assert.equal(calls.filter((call) =&gt; call[0] === 'reset' &amp;&amp; call[1] === 'idle').length, idleResetCount);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 287 | <code>    assert.equal(controller.play('clapping'), false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 288 | <code>    assert.equal(controller.getCurrentActionName(), 'idle');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 289 | <code>    assert.equal(controller.play('clapping', { allowExperimental: true }), true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 290 | <code>    assert.equal(controller.getCurrentActionName(), 'clapping');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 291 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 292 | <code>    listeners.finished({ action: clapping });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 293 | <code>    assert.equal(controller.getCurrentActionName(), 'idle');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 294 | <code>    assert.equal(calls.some((call) =&gt; call[0] === 'fadeOut' &amp;&amp; call[1] === 'clapping'), true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 295 | <code>    assert.equal(calls.some((call) =&gt; call[0] === 'fadeIn' &amp;&amp; call[1] === 'idle'), true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 296 | <code>    assert.equal(calls.some((call) =&gt; call[0] === 'play' &amp;&amp; call[1] === 'idle'), true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 297 | <code>    assert.equal(calls.some((call) =&gt; call[0] === 'crossFade'), false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 298 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 299 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 300 | <code>test('behavior scheduler produces visible state-specific micro pose', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 301 | <code>    const bones = Object.fromEntries(</code> | 声明局部标识符 `bones`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 302 | <code>        ['head', 'neck', 'chest', 'upperChest', 'spine', 'leftShoulder', 'rightShoulder']</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 303 | <code>            .map((name) =&gt; [name, { name, rotation: { x: 0, y: 0, z: 0 } }])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 304 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 305 | <code>    const scheduler = new CharacterBehaviorScheduler();</code> | 声明局部标识符 `scheduler`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 306 | <code>    const vrm = {</code> | 声明局部标识符 `vrm`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 307 | <code>        humanoid: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 308 | <code>            getNormalizedBoneNode: (name) =&gt; bones[name] &#124;&#124; null</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 309 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 310 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 311 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 312 | <code>    scheduler.update({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 313 | <code>        vrm,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 314 | <code>        deltaTime: 0.3,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 315 | <code>        surface: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 316 | <code>            emotion: 'thinking',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 317 | <code>            taskState: 'thinking',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 318 | <code>            gazeTarget: 'side',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 319 | <code>            intensity: 0.55</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 320 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 321 | <code>        currentMotion: 'idle',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 322 | <code>        isSpeaking: false</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 323 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 324 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 325 | <code>    assert.ok(Math.abs(bones.head.rotation.y) &gt; 0.01);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 326 | <code>    assert.ok(Math.abs(bones.neck.rotation.x) &gt; 0.002);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 327 | <code>    assert.ok(Math.abs(bones.chest.rotation.y) &gt; 0.001);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 328 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 329 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 330 | <code>test('behavior scheduler does not layer procedural pose over big motions', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 331 | <code>    const bones = Object.fromEntries(</code> | 声明局部标识符 `bones`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 332 | <code>        ['head', 'neck', 'chest', 'upperChest', 'spine', 'leftShoulder', 'rightShoulder']</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 333 | <code>            .map((name) =&gt; [name, { name, rotation: { x: 0, y: 0, z: 0 } }])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 334 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 335 | <code>    const scheduler = new CharacterBehaviorScheduler();</code> | 声明局部标识符 `scheduler`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 336 | <code>    const vrm = {</code> | 声明局部标识符 `vrm`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 337 | <code>        humanoid: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 338 | <code>            getNormalizedBoneNode: (name) =&gt; bones[name] &#124;&#124; null</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 339 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 340 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 341 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 342 | <code>    scheduler.update({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 343 | <code>        vrm,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 344 | <code>        deltaTime: 0.3,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 345 | <code>        surface: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 346 | <code>            emotion: 'happy',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 347 | <code>            taskState: 'happy_success',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 348 | <code>            gestureIntent: 'dance',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 349 | <code>            gazeTarget: 'user',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 350 | <code>            intensity: 0.75</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 351 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 352 | <code>        currentMotion: 'vrma17',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 353 | <code>        isSpeaking: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 354 | <code>        lipSyncValue: 0.6</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 355 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 356 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 357 | <code>    assert.equal(bones.head.rotation.x, 0);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 358 | <code>    assert.equal(bones.neck.rotation.y, 0);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 359 | <code>    assert.equal(bones.chest.rotation.z, 0);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 360 | <code>    assert.equal(bones.spine.rotation.z, 0);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 361 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 362 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 363 | <code>test('character runtime drives expression mix and semantic motion through adapter', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 364 | <code>    const calls = [];</code> | 声明局部标识符 `calls`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 365 | <code>    const runtime = new CharacterRuntime({</code> | 声明局部标识符 `runtime`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 366 | <code>        driver: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 367 | <code>            getAvailableMotions: () =&gt; ['idle', 'relax', 'goodbye', 'thinking', 'clapping'],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 368 | <code>            getCurrentMotion: () =&gt; 'idle',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 369 | <code>            setSurfaceState: (surface) =&gt; calls.push(['surface', surface.taskState, surface.gestureIntent]),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 370 | <code>            applySceneMood: (sceneMood) =&gt; calls.push(['scene', sceneMood.state]),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 371 | <code>            applyExpressionMix: (mix) =&gt; calls.push(['expression', mix]),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 372 | <code>            playMotion: (motion) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 373 | <code>                calls.push(['motion', motion.id]);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 374 | <code>                return true;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 375 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 376 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 377 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 378 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 379 | <code>    const result = runtime.applyPayload({</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 380 | <code>        display_text: '好呀，我来啦。',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 381 | <code>        surface: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 382 | <code>            emotion: 'happy',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 383 | <code>            intensity: 0.58,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 384 | <code>            gestureIntent: 'greeting',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 385 | <code>            taskState: 'speaking',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 386 | <code>            gazeTarget: 'user'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 387 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 388 | <code>    }, {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 389 | <code>        random: () =&gt; 0</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 390 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 391 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 392 | <code>    assert.equal(result.surface.gestureIntent, 'greeting');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 393 | <code>    assert.equal(result.screenplay.expression, 'happy');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 394 | <code>    assert.equal(result.motion, null);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 395 | <code>    assert.equal(result.roleState.state, 'speaking');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 396 | <code>    assert.equal(result.sceneMood.state, 'speaking');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 397 | <code>    assert.deepEqual(calls[0], ['surface', 'speaking', 'greeting']);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 398 | <code>    assert.deepEqual(calls[1], ['scene', 'speaking']);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 399 | <code>    assert.equal(calls.some((call) =&gt; call[0] === 'motion'), false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 400 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 401 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 402 | <code>test('character runtime plays companion semantic gesture when chat motion policy opts in', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 403 | <code>    const calls = [];</code> | 声明局部标识符 `calls`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 404 | <code>    const runtime = new CharacterRuntime({</code> | 声明局部标识符 `runtime`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 405 | <code>        driver: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 406 | <code>            getAvailableMotions: () =&gt; ['idle', 'vroid_greeting'],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 407 | <code>            getCurrentMotion: () =&gt; 'idle',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 408 | <code>            setSurfaceState: () =&gt; {},</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 409 | <code>            applySceneMood: () =&gt; {},</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 410 | <code>            applyExpressionMix: () =&gt; {},</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 411 | <code>            playMotion: (motion) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 412 | <code>                calls.push(motion.id);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 413 | <code>                return true;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 414 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 415 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 416 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 417 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 418 | <code>    const result = runtime.applyPayload({</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 419 | <code>        display_text: '你好呀，我在。',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 420 | <code>        surface: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 421 | <code>            emotion: 'happy',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 422 | <code>            gestureIntent: 'greeting',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 423 | <code>            taskState: 'speaking'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 424 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 425 | <code>    }, {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 426 | <code>        allowExpressiveMotion: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 427 | <code>        allowExperimentalMotion: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 428 | <code>        random: () =&gt; 0</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 429 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 430 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 431 | <code>    assert.equal(result.motion.id, 'vroid_greeting');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 432 | <code>    assert.equal(result.playedMotion, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 433 | <code>    assert.deepEqual(calls, ['vroid_greeting']);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 434 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 435 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 436 | <code>test('character state machine enriches task states with stable role defaults', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 437 | <code>    const stateMachine = new CharacterStateMachine();</code> | 声明局部标识符 `stateMachine`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 438 | <code>    const result = stateMachine.transition({</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 439 | <code>        emotion: 'thinking',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 440 | <code>        taskState: 'working',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 441 | <code>        gestureIntent: 'none'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 442 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 443 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 444 | <code>    assert.equal(result.state, 'working');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 445 | <code>    assert.equal(result.surface.taskState, 'working');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 446 | <code>    assert.equal(result.surface.gestureIntent, 'working');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 447 | <code>    assert.equal(result.surface.gazeTarget, 'screen');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 448 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 449 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 450 | <code>test('scene director maps role state into camera and light mood', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 451 | <code>    const director = new CharacterSceneDirector();</code> | 声明局部标识符 `director`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 452 | <code>    const mood = director.createSceneMood('happy_success', {</code> | 声明局部标识符 `mood`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 453 | <code>        emotion: 'happy',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 454 | <code>        socialTone: 'bright',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 455 | <code>        intensity: 0.7,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 456 | <code>        speechEnergy: 0.5</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 457 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 458 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 459 | <code>    assert.equal(mood.state, 'happy_success');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 460 | <code>    assert.ok(mood.camera.distance &lt; 1.1);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 461 | <code>    assert.ok(mood.light.ambientIntensity &gt; 2.3);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 462 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 463 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 464 | <code>test('character runtime schedules gentle idle motion without interrupting speech', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 465 | <code>    const calls = [];</code> | 声明局部标识符 `calls`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 466 | <code>    const runtime = new CharacterRuntime({</code> | 声明局部标识符 `runtime`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 467 | <code>        driver: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 468 | <code>            getAvailableMotions: () =&gt; ['idle', 'idle1', 'idle2', 'thinking'],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 469 | <code>            getCurrentMotion: () =&gt; 'idle',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 470 | <code>            setSurfaceState: () =&gt; {},</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 471 | <code>            applySceneMood: () =&gt; {},</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 472 | <code>            applyExpressionMix: () =&gt; {},</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 473 | <code>            playMotion: (motion) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 474 | <code>                calls.push(typeof motion === 'string' ? motion : motion.id);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 475 | <code>                return true;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 476 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 477 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 478 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 479 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 480 | <code>    runtime.setSurfaceState({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 481 | <code>        emotion: 'relaxed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 482 | <code>        taskState: 'idle',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 483 | <code>        gestureIntent: 'none'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 484 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 485 | <code>    runtime.nextIdleMotionMs = 100;</code> | 注册事件处理：当用户操作、生命周期或运行时事件发生时调用相应逻辑。 |
| 486 | <code>    runtime.update(0.2, { currentMotion: 'idle', isSpeaking: true });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 487 | <code>    assert.deepEqual(calls, []);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 488 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 489 | <code>    runtime.setSurfaceState({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 490 | <code>        taskState: 'idle',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 491 | <code>        gestureIntent: 'none',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 492 | <code>        source: 'speech_end'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 493 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 494 | <code>    runtime.nextIdleMotionMs = 100;</code> | 注册事件处理：当用户操作、生命周期或运行时事件发生时调用相应逻辑。 |
| 495 | <code>    runtime.update(0.2, { currentMotion: 'idle', isSpeaking: false });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 496 | <code>    assert.deepEqual(calls, ['idle']);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-character-runtime 的契约与回归行为。”这一文件职责。 |
| 497 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
