# tests/ailis-humanlike-eval.test.mjs 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。
- 文件类型：`source-code`
- 原始行数：328
- SHA-256：`57a12088389c9e3bbbb3313d9a9c92ad90842b9f74a19b7fb2323261e5483540`
- 可运行副本：[打开源文件](../../../source/tests/ailis-humanlike-eval.test.mjs)
- 依赖：`node:assert/strict`、`node:fs/promises`、`node:path`、`node:test`、`node:module`、`../electron/ailis-humanlike-eval.cjs`
- 主要符号：`require`、`readJsonl`、`text`、`messagesToText`、`scenarios`、`validation`、`rawDataset`、`scenario`、`packet`、`plan`、`categoryTotal`、`affinityTotal`、`seedCategories`、`categoryCounts`、`affinityCounts`、`score`、`bucket`、`negativeProbeCount`、`emptyFocusTagCount`、`messages`、`candidate`、`parsed`、`response`、`summary`、`imported`

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code>import assert from 'node:assert/strict';</code> | 导入依赖 `node:assert/strict`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 2 | <code>import fs from 'node:fs/promises';</code> | 导入依赖 `node:fs/promises`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 3 | <code>import path from 'node:path';</code> | 导入依赖 `node:path`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 4 | <code>import test from 'node:test';</code> | 导入依赖 `node:test`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 5 | <code>import { createRequire } from 'node:module';</code> | 导入依赖 `node:module`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 6 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 7 | <code>const require = createRequire(import.meta.url);</code> | 声明局部标识符 `require`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 8 | <code>const {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 9 | <code>    aggregateHumanlikeEvalResults,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 10 | <code>    buildHumanlikeJudgeMessages,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 11 | <code>    buildHumanlikeJudgePacket,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 12 | <code>    buildJudgeOutputShape,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 13 | <code>    normalizeCandidateResponse,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 14 | <code>    normalizeScenario,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 15 | <code>    normalizeImportedJudgment,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 16 | <code>    parseJudgeResponse,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 17 | <code>    relationshipExpectationFromAffinity,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 18 | <code>    relationshipStageFromAffinity,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 19 | <code>    validateScenarioDataset</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 20 | <code>} = require('../electron/ailis-humanlike-eval.cjs');</code> | 导入依赖 `../electron/ailis-humanlike-eval.cjs`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 21 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 22 | <code>async function readJsonl(filePath) {</code> | 定义函数 `readJsonl`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 23 | <code>    const text = await fs.readFile(filePath, 'utf8');</code> | 声明局部标识符 `text`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 24 | <code>    return text.split(/\r?\n/).filter(Boolean).map((line) =&gt; JSON.parse(line));</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 25 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 26 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 27 | <code>function messagesToText(messages = []) {</code> | 定义函数 `messagesToText`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 28 | <code>    return messages.map((message) =&gt; message.content &#124;&#124; '').join('\n');</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 29 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 30 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 31 | <code>test('AILIS humanlike eval relationship stages match product affinity design', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 32 | <code>    assert.equal(relationshipStageFromAffinity(50), 'familiarizing');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 33 | <code>    assert.equal(relationshipStageFromAffinity(70), 'trusted');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 34 | <code>    assert.equal(relationshipStageFromAffinity(80), 'close');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 35 | <code>    assert.match(relationshipExpectationFromAffinity(50), /自然承接用户偏好的亲昵称呼/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 36 | <code>    assert.match(relationshipExpectationFromAffinity(70), /更熟悉、更自然、更有陪伴感/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 37 | <code>    assert.match(relationshipExpectationFromAffinity(90), /允许明显亲密、主动、轻微撒娇/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 38 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 39 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 40 | <code>test('AILIS humanlike eval seed dataset is structurally valid', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 41 | <code>    const scenarios = await readJsonl(path.resolve('evals/ailis-humanlike/scenarios.jsonl'));</code> | 声明局部标识符 `scenarios`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 42 | <code>    const validation = validateScenarioDataset(scenarios);</code> | 声明局部标识符 `validation`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 43 | <code>    assert.equal(validation.ok, true, JSON.stringify(validation.issues, null, 2));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 44 | <code>    assert.equal(scenarios.length, 1000);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 45 | <code>    assert.ok(scenarios.some((scenario) =&gt; scenario.affinity_score &gt;= 80));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 46 | <code>    assert.ok(scenarios.some((scenario) =&gt; scenario.category === 'multimodal_sync'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 47 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 48 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 49 | <code>test('AILIS long-term companionship scenario set covers durable relationship risks', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 50 | <code>    const scenarios = await readJsonl(path.resolve('evals/ailis-humanlike/long-term-companionship.scenarios.jsonl'));</code> | 声明局部标识符 `scenarios`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 51 | <code>    const validation = validateScenarioDataset(scenarios);</code> | 声明局部标识符 `validation`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 52 | <code>    assert.equal(validation.ok, true, JSON.stringify(validation.issues, null, 2));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 53 | <code>    assert.equal(scenarios.length, 12);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 54 | <code>    assert.ok(scenarios.every((scenario) =&gt; scenario.category === 'long_term_companionship'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 55 | <code>    assert.ok(scenarios.every((scenario) =&gt; scenario.tags?.includes('long_term_companionship')));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 56 | <code>    assert.ok(scenarios.every((scenario) =&gt; scenario.conversation?.length &gt;= 3));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 57 | <code>    assert.ok(scenarios.every((scenario) =&gt; scenario.memory_context &amp;&amp; Object.keys(scenario.memory_context).length &gt; 0));</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 58 | <code>    assert.ok(scenarios.some((scenario) =&gt; scenario.affinity_score &lt; 40));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 59 | <code>    assert.ok(scenarios.some((scenario) =&gt; scenario.affinity_score &gt;= 80));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 60 | <code>    assert.ok(scenarios.some((scenario) =&gt; scenario.tags?.includes('preference_drift')));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 61 | <code>    assert.ok(scenarios.some((scenario) =&gt; scenario.tags?.includes('privacy_memory')));</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 62 | <code>    assert.ok(scenarios.some((scenario) =&gt; scenario.tags?.includes('restart_recovery')));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 63 | <code>    assert.ok(scenarios.some((scenario) =&gt; scenario.tags?.includes('vision_uncertainty')));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 64 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 65 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 66 | <code>test('AILIS 30-day longitudinal companionship benchmark has deep daily histories', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 67 | <code>    const rawDataset = JSON.parse(await fs.readFile(path.resolve('evals/ailis-humanlike/longitudinal-companionship-30d.dataset.json'), 'utf8'));</code> | 声明局部标识符 `rawDataset`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 68 | <code>    const scenarios = await readJsonl(path.resolve('evals/ailis-humanlike/longitudinal-companionship-30d.scenarios.jsonl'));</code> | 声明局部标识符 `scenarios`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 69 | <code>    const validation = validateScenarioDataset(scenarios);</code> | 声明局部标识符 `validation`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 70 | <code>    assert.equal(validation.ok, true, JSON.stringify(validation.issues, null, 2));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 71 | <code>    assert.equal(rawDataset.version, 2);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 72 | <code>    assert.equal(rawDataset.cases.length, 10);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 73 | <code>    assert.equal(rawDataset.days_per_case, 30);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 74 | <code>    assert.equal(rawDataset.user_dialogues_per_day &gt;= 10, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 75 | <code>    for (const entry of rawDataset.cases) {</code> | 声明局部标识符 `entry`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 76 | <code>        assert.equal(entry.days.length, 30);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 77 | <code>        assert.ok(entry.days.every((day) =&gt; day.dialogues.length &gt;= 10));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 78 | <code>        assert.ok(entry.days.some((day) =&gt; day.dialogues.some((dialogue) =&gt; /邮件/.test(dialogue.user))));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 79 | <code>        assert.ok(entry.days.some((day) =&gt; day.dialogues.some((dialogue) =&gt; /论文&#124;读一下/.test(dialogue.user))));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 80 | <code>        assert.ok(entry.days.some((day) =&gt; day.dialogues.some((dialogue) =&gt; /WORD&#124;文档&#124;表格&#124;脚本/.test(dialogue.user))));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 81 | <code>        assert.ok(entry.days.some((day) =&gt; day.dialogues.some((dialogue) =&gt; /GitHub&#124;提交/.test(dialogue.user))));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 82 | <code>        assert.ok(entry.days.some((day) =&gt; day.dialogues.some((dialogue) =&gt; /领导&#124;火大&#124;累&#124;陪我/.test(dialogue.user))));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 83 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 84 | <code>    assert.equal(scenarios.length, 10);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 85 | <code>    for (const scenario of scenarios) {</code> | 声明局部标识符 `scenario`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 86 | <code>        assert.equal(scenario.category, 'longitudinal_companionship_30d');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 87 | <code>        assert.equal(scenario.longitudinal_context?.day_count, 30);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 88 | <code>        assert.equal(scenario.longitudinal_context?.minimum_user_turns_per_day &gt;= 10, true);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 89 | <code>        assert.equal(scenario.longitudinal_context?.total_user_turns, 360);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 90 | <code>        assert.equal(scenario.memory_context?.longitudinal_summary?.daily_summaries?.length, 30);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 91 | <code>        assert.equal(scenario.longitudinal_context?.relationship_curve?.length, 30);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 92 | <code>        assert.equal(scenario.longitudinal_context?.day_logs?.length, 30);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 93 | <code>        assert.equal(scenario.conversation?.filter((message) =&gt; message.role === 'user').length, 360);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 94 | <code>        assert.equal(scenario.conversation?.length &gt;= 700, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 95 | <code>        assert.ok(scenario.reliability_checks?.includes('memory_evidence_discipline'));</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 96 | <code>        assert.ok(scenario.tags?.includes('daily_10_plus_dialogues'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 97 | <code>        assert.ok(scenario.tags?.includes('realistic_daily_dialogues'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 98 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 99 | <code>    assert.ok(scenarios.some((scenario) =&gt; scenario.affinity_score &gt;= 90));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 100 | <code>    assert.ok(scenarios.some((scenario) =&gt; scenario.affinity_score &lt; 80));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 101 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 102 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 103 | <code>test('AILIS humanlike eval preserves longitudinal benchmark context for judge packets', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 104 | <code>    const scenario = normalizeScenario({</code> | 声明局部标识符 `scenario`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 105 | <code>        id: 'longitudinal-preserve-test',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 106 | <code>        category: 'longitudinal_companionship_30d',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 107 | <code>        affinity_score: 90,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 108 | <code>        user_message: '这个月我们怎么收尾？',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 109 | <code>        expected_behavior: ['应使用 30 天长期上下文。'],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 110 | <code>        longitudinal_context: {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 111 | <code>            day_count: 30,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 112 | <code>            total_user_turns: 360</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 113 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 114 | <code>        benchmark_spec: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 115 | <code>            total_user_turns: 360</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 116 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 117 | <code>        reliability_checks: ['long_context_retention']</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 118 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 119 | <code>    const packet = buildHumanlikeJudgePacket({</code> | 声明局部标识符 `packet`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 120 | <code>        scenario,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 121 | <code>        candidate: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 122 | <code>            text: '这个月我们先收一个小闭环。'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 123 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 124 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 125 | <code>    assert.equal(packet.scenario.longitudinal_context.day_count, 30);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 126 | <code>    assert.equal(packet.scenario.benchmark_spec.total_user_turns, 360);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 127 | <code>    assert.deepEqual(packet.scenario.reliability_checks, ['long_context_retention']);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 128 | <code>    assert.match(messagesToText(packet.messages), /longitudinal_context/);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 129 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 130 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 131 | <code>test('AILIS humanlike eval 1000-scenario plan is balanced and explicit', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 132 | <code>    const plan = JSON.parse(await fs.readFile(path.resolve('evals/ailis-humanlike/dataset-plan.json'), 'utf8'));</code> | 声明局部标识符 `plan`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 133 | <code>    const scenarios = await readJsonl(path.resolve('evals/ailis-humanlike/scenarios.jsonl'));</code> | 声明局部标识符 `scenarios`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 134 | <code>    const categoryTotal = plan.category_distribution.reduce((sum, bucket) =&gt; sum + bucket.target_count, 0);</code> | 声明局部标识符 `categoryTotal`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 135 | <code>    const affinityTotal = plan.affinity_distribution.reduce((sum, bucket) =&gt; sum + bucket.target_count, 0);</code> | 声明局部标识符 `affinityTotal`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 136 | <code>    const seedCategories = new Set(scenarios.map((scenario) =&gt; scenario.category));</code> | 声明局部标识符 `seedCategories`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 137 | <code>    const categoryCounts = scenarios.reduce((counts, scenario) =&gt; {</code> | 声明局部标识符 `categoryCounts`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 138 | <code>        counts[scenario.category] = (counts[scenario.category] &#124;&#124; 0) + 1;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 139 | <code>        return counts;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 140 | <code>    }, {});</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 141 | <code>    const affinityCounts = scenarios.reduce((counts, scenario) =&gt; {</code> | 声明局部标识符 `affinityCounts`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 142 | <code>        const score = Number(scenario.affinity_score);</code> | 声明局部标识符 `score`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 143 | <code>        const bucket = score &lt; 40 ? '0-39' : score &lt; 61 ? '40-60' : score &lt; 80 ? '61-79' : '80-100';</code> | 声明局部标识符 `bucket`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 144 | <code>        counts[bucket] = (counts[bucket] &#124;&#124; 0) + 1;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 145 | <code>        return counts;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 146 | <code>    }, {});</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 147 | <code>    const negativeProbeCount = scenarios.filter((scenario) =&gt;</code> | 声明局部标识符 `negativeProbeCount`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 148 | <code>        scenario.coverage?.negative_probe &#124;&#124; scenario.tags?.includes('negative_probe')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 149 | <code>    ).length;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 150 | <code>    const emptyFocusTagCount = scenarios.filter((scenario) =&gt; scenario.tags?.includes('focus_')).length;</code> | 声明局部标识符 `emptyFocusTagCount`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 151 | <code>    assert.equal(plan.target_count, 1000);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 152 | <code>    assert.equal(scenarios.length, plan.target_count);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 153 | <code>    assert.equal(categoryTotal, plan.target_count);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 154 | <code>    assert.equal(affinityTotal, plan.target_count);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 155 | <code>    assert.ok(plan.category_distribution.some((bucket) =&gt; bucket.category === 'multimodal_sync'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 156 | <code>    assert.ok(plan.category_distribution.some((bucket) =&gt; bucket.category === 'safety_privacy_boundary'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 157 | <code>    assert.ok(plan.reliability_rules.some((rule) =&gt; /80-100/.test(rule)));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 158 | <code>    for (const bucket of plan.category_distribution) {</code> | 声明局部标识符 `bucket`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 159 | <code>        assert.ok(seedCategories.has(bucket.category), `seed dataset should cover ${bucket.category}`);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 160 | <code>        assert.equal(categoryCounts[bucket.category], bucket.target_count, `${bucket.category} count should match plan`);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 161 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 162 | <code>    for (const bucket of plan.affinity_distribution) {</code> | 声明局部标识符 `bucket`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 163 | <code>        assert.equal(affinityCounts[bucket.range], bucket.target_count, `${bucket.range} count should match plan`);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 164 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 165 | <code>    assert.ok(negativeProbeCount &gt;= plan.target_count * plan.negative_case_distribution.minimum_ratio);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 166 | <code>    assert.equal(emptyFocusTagCount, 0);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 167 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 168 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 169 | <code>test('AILIS humanlike judge prompt contains core metrics and scenario context', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 170 | <code>    const scenario = normalizeScenario({</code> | 声明局部标识符 `scenario`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 171 | <code>        id: 'close-test',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 172 | <code>        category: 'relationship_stage',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 173 | <code>        affinity_score: 85,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 174 | <code>        user_message: '陪我聊会儿',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 175 | <code>        expected_behavior: ['明显亲密、主动、轻微撒娇']</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 176 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 177 | <code>    const messages = buildHumanlikeJudgeMessages({</code> | 声明局部标识符 `messages`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 178 | <code>        scenario,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 179 | <code>        candidate: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 180 | <code>            text: '好呀，我陪你慢慢聊。'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 181 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 182 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 183 | <code>    assert.match(messages[0].content, /人设一致性/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 184 | <code>    assert.match(messages[0].content, /多模态同步感/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 185 | <code>    assert.match(messages[0].content, /低工具感/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 186 | <code>    assert.match(messages[0].content, /80-100：允许明显亲密/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 187 | <code>    assert.match(messages[1].content, /close-test/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 188 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 189 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 190 | <code>test('AILIS humanlike eval parses AILIS control tags like the frontend payload', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 191 | <code>    const candidate = normalizeCandidateResponse({</code> | 声明局部标识符 `candidate`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 192 | <code>        text: '[action:wave][expression:sad]我听见啦。今天先慢一点。',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 193 | <code>        speech_text: '[action:wave][expression:sad]我听见啦。今天先慢一点。',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 194 | <code>        trace_summary: '{"status":"completed","steps":[]}'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 195 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 196 | <code>    assert.equal(candidate.text, '我听见啦。今天先慢一点。');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 197 | <code>    assert.equal(candidate.speech_text, '我听见啦。今天先慢一点。');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 198 | <code>    assert.equal(candidate.bubble_text, '我听见啦。今天先慢一点。');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 199 | <code>    assert.equal(candidate.action, 'wave');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 200 | <code>    assert.equal(candidate.expression, 'sad');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 201 | <code>    assert.equal(candidate.control_markup.parsed, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 202 | <code>    assert.equal('trace_summary' in candidate, false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 203 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 204 | <code>    const messages = buildHumanlikeJudgeMessages({</code> | 声明局部标识符 `messages`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 205 | <code>        scenario: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 206 | <code>            id: 'markup-test',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 207 | <code>            category: 'multimodal_sync',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 208 | <code>            affinity_score: 50,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 209 | <code>            user_message: '我今天有点累。',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 210 | <code>            expected_behavior: ['解析控制标签后再评估多模态一致性。']</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 211 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 212 | <code>        candidate</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 213 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 214 | <code>    assert.doesNotMatch(messages[1].content, /trace_summary/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 215 | <code>    assert.match(messages[1].content, /control_markup/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 216 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 217 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 218 | <code>test('AILIS humanlike judge parser accepts flat metric fields and legacy hard fail flags', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 219 | <code>    const parsed = parseJudgeResponse(JSON.stringify({</code> | 声明局部标识符 `parsed`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 220 | <code>        scenario_id: 'flat-judge-test',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 221 | <code>        overall_comment: '整体自然。',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 222 | <code>        persona_consistency: 5,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 223 | <code>        naturalness: 4,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 224 | <code>        memory_usefulness: 4,</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 225 | <code>        emotional_fit: 5,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 226 | <code>        multimodal_sync: 4,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 227 | <code>        low_tool_feeling: 5,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 228 | <code>        relationship_stage_fit: 4,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 229 | <code>        task_completion: 4,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 230 | <code>        hard_fail_flags: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 231 | <code>            tool_log_style: false,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 232 | <code>            exposed_internal_info: false</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 233 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 234 | <code>        issues: [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 235 | <code>        better_answer_direction: '保持。'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 236 | <code>    }));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 237 | <code>    assert.equal(parsed.ok, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 238 | <code>    assert.equal(parsed.metrics.persona_consistency.score, 5);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 239 | <code>    assert.equal(parsed.metrics.naturalness.score, 4);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 240 | <code>    assert.equal(parsed.metrics.task_completion.score, 4);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 241 | <code>    assert.equal(parsed.weighted_score, 87.6);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 242 | <code>    assert.equal(parsed.pass, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 243 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 244 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 245 | <code>test('AILIS humanlike judge packet is portable for strong manual judge flow', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 246 | <code>    const packet = buildHumanlikeJudgePacket({</code> | 声明局部标识符 `packet`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 247 | <code>        scenario: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 248 | <code>            id: 'packet-test',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 249 | <code>            category: 'low_tool_feeling',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 250 | <code>            affinity_score: 70,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 251 | <code>            user_message: '这个报错你看一下。',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 252 | <code>            expected_behavior: ['自然说明看到什么，不要像工具日志。']</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 253 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 254 | <code>        candidate: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 255 | <code>            text: '我看到了报错的关键位置，我们先确认配置。'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 256 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 257 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 258 | <code>    assert.equal(packet.scenario_id, 'packet-test');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 259 | <code>    assert.equal(packet.messages.length, 2);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 260 | <code>    assert.ok(Array.isArray(packet.judge_protocol));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 261 | <code>    assert.match(packet.judge_protocol.join('\n'), /JSON object/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 262 | <code>    assert.deepEqual(Object.keys(packet.required_output_shape.metrics), Object.keys(buildJudgeOutputShape().metrics));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 263 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 264 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 265 | <code>test('AILIS humanlike judge parser scores weighted results and hard failures', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 266 | <code>    const response = JSON.stringify({</code> | 声明局部标识符 `response`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 267 | <code>        scenario_id: 'judge-test',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 268 | <code>        overall_comment: '自然但暴露了内部好感度。',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 269 | <code>        metrics: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 270 | <code>            persona_consistency: { score: 4, reason: '像 AILIS' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 271 | <code>            naturalness: { score: 4, reason: '自然' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 272 | <code>            memory_usefulness: { score: 2, reason: '暴露数值' },</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 273 | <code>            emotional_fit: { score: 4, reason: '情绪合适' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 274 | <code>            multimodal_sync: { score: 3, reason: '信息不足' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 275 | <code>            low_tool_feeling: { score: 4, reason: '不工具化' },</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 276 | <code>            relationship_stage_fit: { score: 3, reason: '亲密度一般' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 277 | <code>            task_completion: { score: 3, reason: '只部分处理当前请求' }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 278 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 279 | <code>        hard_fail_flags: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 280 | <code>            exposes_internal_affinity_score_unprompted: true</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 281 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 282 | <code>        issues: ['暴露内部好感度'],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 283 | <code>        better_answer_direction: '不要说分数'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 284 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 285 | <code>    const parsed = parseJudgeResponse(response);</code> | 声明局部标识符 `parsed`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 286 | <code>    assert.equal(parsed.ok, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 287 | <code>    assert.equal(parsed.scenario_id, 'judge-test');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 288 | <code>    assert.equal(parsed.hard_fail, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 289 | <code>    assert.equal(parsed.pass, false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 290 | <code>    assert.equal(parsed.weighted_score &lt;= 59, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 291 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 292 | <code>    const summary = aggregateHumanlikeEvalResults([</code> | 声明局部标识符 `summary`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 293 | <code>        {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 294 | <code>            scenario: { category: 'memory_use', relationship_stage: 'close', affinity_score: 90 },</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 295 | <code>            judge: parsed</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 296 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 297 | <code>    ]);</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 298 | <code>    assert.equal(summary.total, 1);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 299 | <code>    assert.equal(summary.judged, 1);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 300 | <code>    assert.equal(summary.hard_fail_count, 1);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 301 | <code>    assert.equal(summary.by_relationship_stage.close.count, 1);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 302 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 303 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 304 | <code>test('AILIS humanlike imported judgment normalizes JSONL rows', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 305 | <code>    const imported = normalizeImportedJudgment({</code> | 声明局部标识符 `imported`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 306 | <code>        scenario_id: 'import-test',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 307 | <code>        judge_response: JSON.stringify({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 308 | <code>            scenario_id: 'import-test',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 309 | <code>            overall_comment: '整体自然。',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 310 | <code>            metrics: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 311 | <code>                persona_consistency: { score: 4, reason: '稳定像 AILIS' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 312 | <code>                naturalness: { score: 4, reason: '自然' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 313 | <code>                memory_usefulness: { score: 4, reason: '没有乱用记忆' },</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 314 | <code>                emotional_fit: { score: 4, reason: '情绪合适' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 315 | <code>                multimodal_sync: { score: 3, reason: '没有多模态信息' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 316 | <code>                low_tool_feeling: { score: 4, reason: '不工具化' },</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 317 | <code>                relationship_stage_fit: { score: 4, reason: '符合阶段' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 318 | <code>                task_completion: { score: 4, reason: '处理了当前请求' }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 319 | <code>            },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 320 | <code>            hard_fail_flags: {},</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 321 | <code>            issues: [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 322 | <code>            better_answer_direction: '保持自然，补齐多模态信息。'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 323 | <code>        })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 324 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 325 | <code>    assert.equal(imported.scenario_id, 'import-test');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 326 | <code>    assert.equal(imported.judge.ok, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 327 | <code>    assert.equal(imported.judge.metrics.multimodal_sync.score, 3);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-humanlike-eval 的契约与回归行为。”这一文件职责。 |
| 328 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
