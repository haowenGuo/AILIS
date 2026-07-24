# tests/ailis-local-safety-classifier.test.mjs 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。
- 文件类型：`source-code`
- 原始行数：300
- SHA-256：`cd8c227ecb85a30598cc55f9814797713cf93b9fed0043c340a03410cf281859`
- 可运行副本：[打开源文件](../../../source/tests/ailis-local-safety-classifier.test.mjs)
- 依赖：`node:assert/strict`、`node:test`、`node:module`、`../electron/ailis-local-safety-classifier.cjs`、`../electron/ailis-sensitive-word-classifier.cjs`、`../electron/ailis-ember-harness.cjs`
- 主要符号：`require`、`createMockPipelineFactory`、`calls`、`factory`、`classifier`、`toxicScore`、`mock`、`safe`、`unsafe`、`disposed`、`factoryEntered`、`pipelineFactory`、`pipeline`、`preparing`、`text`、`result`、`evaluator`、`observeHarness`、`enforceHarness`、`observed`、`blocked`、`receivedText`、`harness`、`removedBuiltin`、`custom`、`first`、`second`、`targetTerm`、`lexicon`、`matcher`、`startedAt`、`matches`、`elapsedMs`

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code>import assert from 'node:assert/strict';</code> | 导入依赖 `node:assert/strict`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 2 | <code>import test from 'node:test';</code> | 导入依赖 `node:test`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 3 | <code>import { createRequire } from 'node:module';</code> | 导入依赖 `node:module`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 4 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5 | <code>const require = createRequire(import.meta.url);</code> | 声明局部标识符 `require`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 6 | <code>const {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 7 | <code>    AILISLocalSafetyClassifier,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 8 | <code>    buildTextChunks,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 9 | <code>    getToxicityScore</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 10 | <code>} = require('../electron/ailis-local-safety-classifier.cjs');</code> | 导入依赖 `../electron/ailis-local-safety-classifier.cjs`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 11 | <code>const {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 12 | <code>    AILISSensitiveWordClassifier,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 13 | <code>    buildAhoCorasick,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 14 | <code>    normalizeLexicon,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 15 | <code>    normalizeText</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 16 | <code>} = require('../electron/ailis-sensitive-word-classifier.cjs');</code> | 导入依赖 `../electron/ailis-sensitive-word-classifier.cjs`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 17 | <code>const { AILISEmberHarness } = require('../electron/ailis-ember-harness.cjs');</code> | 导入依赖 `../electron/ailis-ember-harness.cjs`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 18 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 19 | <code>function createMockPipelineFactory(onClassify) {</code> | 定义函数 `createMockPipelineFactory`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 20 | <code>    const calls = {</code> | 声明局部标识符 `calls`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 21 | <code>        factory: 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 22 | <code>        classify: 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 23 | <code>        disposed: 0</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 24 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 25 | <code>    const factory = async () =&gt; {</code> | 声明局部标识符 `factory`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 26 | <code>        calls.factory += 1;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 27 | <code>        const classifier = async (texts) =&gt; {</code> | 声明局部标识符 `classifier`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 28 | <code>            calls.classify += 1;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 29 | <code>            return texts.map((text) =&gt; {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 30 | <code>                const toxicScore = onClassify(String(text));</code> | 声明局部标识符 `toxicScore`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 31 | <code>                return [</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 32 | <code>                    { label: 'not-toxic', score: 1 - toxicScore },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 33 | <code>                    { label: 'toxic', score: toxicScore }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 34 | <code>                ];</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 35 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 36 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 37 | <code>        classifier.dispose = async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 38 | <code>            calls.disposed += 1;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 39 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 40 | <code>        return classifier;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 41 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 42 | <code>    return { factory, calls };</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 43 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 44 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 45 | <code>test('local safety classifier loads lazily and releases its pipeline', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 46 | <code>    const mock = createMockPipelineFactory((text) =&gt; text.includes('unsafe') ? 0.98 : 0.02);</code> | 声明局部标识符 `mock`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 47 | <code>    const classifier = new AILISLocalSafetyClassifier({</code> | 声明局部标识符 `classifier`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 48 | <code>        pipelineFactory: mock.factory,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 49 | <code>        cacheDir: '.tmp/ailis-safety-test'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 50 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 51 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 52 | <code>    assert.equal(classifier.getStatus().status, 'idle');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 53 | <code>    assert.equal(mock.calls.factory, 0);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 54 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 55 | <code>    const safe = await classifier.evaluate({ text: 'ordinary safe text' });</code> | 声明局部标识符 `safe`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 56 | <code>    const unsafe = await classifier.evaluate({ text: 'unsafe text' });</code> | 声明局部标识符 `unsafe`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 57 | <code>    assert.equal(safe.decision, 'allow');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 58 | <code>    assert.equal(unsafe.decision, 'block');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 59 | <code>    assert.equal(mock.calls.factory, 1);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 60 | <code>    assert.equal(classifier.getStatus().status, 'ready');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 61 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 62 | <code>    await classifier.dispose();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 63 | <code>    assert.equal(mock.calls.disposed, 1);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 64 | <code>    assert.equal(classifier.getStatus().status, 'idle');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 65 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 66 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 67 | <code>test('disabling during model loading cannot reactivate the classifier afterward', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 68 | <code>    let releasePipeline;</code> | 声明局部标识符 `releasePipeline`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 69 | <code>    let disposed = 0;</code> | 声明局部标识符 `disposed`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 70 | <code>    let markFactoryEntered;</code> | 声明局部标识符 `markFactoryEntered`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 71 | <code>    const factoryEntered = new Promise((resolve) =&gt; {</code> | 声明局部标识符 `factoryEntered`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 72 | <code>        markFactoryEntered = resolve;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 73 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 74 | <code>    const pipelineFactory = async () =&gt; new Promise((resolve) =&gt; {</code> | 声明局部标识符 `pipelineFactory`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 75 | <code>        markFactoryEntered();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 76 | <code>        releasePipeline = () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 77 | <code>            const pipeline = async () =&gt; [];</code> | 声明局部标识符 `pipeline`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 78 | <code>            pipeline.dispose = async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 79 | <code>                disposed += 1;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 80 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 81 | <code>            resolve(pipeline);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 82 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 83 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 84 | <code>    const classifier = new AILISLocalSafetyClassifier({</code> | 声明局部标识符 `classifier`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 85 | <code>        pipelineFactory,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 86 | <code>        cacheDir: '.tmp/ailis-safety-cancel'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 87 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 88 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 89 | <code>    const preparing = classifier.prepare();</code> | 声明局部标识符 `preparing`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 90 | <code>    await factoryEntered;</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 91 | <code>    assert.equal(classifier.getStatus().status, 'loading');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 92 | <code>    await classifier.dispose();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 93 | <code>    releasePipeline();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 94 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 95 | <code>    await assert.rejects(preparing, /safety_classifier_load_cancelled/);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 96 | <code>    assert.equal(classifier.getStatus().status, 'idle');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 97 | <code>    assert.equal(classifier.getStatus().ready, false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 98 | <code>    assert.equal(disposed, 1);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 99 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 100 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 101 | <code>test('local safety classifier samples the whole long input instead of only its prefix', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 102 | <code>    const mock = createMockPipelineFactory((text) =&gt; text.includes('unsafe-at-the-end') ? 0.99 : 0.01);</code> | 声明局部标识符 `mock`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 103 | <code>    const classifier = new AILISLocalSafetyClassifier({</code> | 声明局部标识符 `classifier`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 104 | <code>        pipelineFactory: mock.factory,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 105 | <code>        cacheDir: '.tmp/ailis-safety-long-input',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 106 | <code>        chunkChars: 128,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 107 | <code>        chunkOverlap: 16,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 108 | <code>        maxChunks: 4,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 109 | <code>        batchSize: 2</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 110 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 111 | <code>    const text = `${'a'.repeat(5000)} unsafe-at-the-end`;</code> | 声明局部标识符 `text`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 112 | <code>    const result = await classifier.evaluate({ text });</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 113 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 114 | <code>    assert.equal(result.decision, 'block');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 115 | <code>    assert.equal(result.details.coverageComplete, false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 116 | <code>    assert.equal(result.details.checkedChunks, 4);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 117 | <code>    assert.ok(result.details.highestRiskSpan.start &gt; 4000);</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 118 | <code>    await classifier.dispose();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 119 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 120 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 121 | <code>test('chunk builder preserves both ends when sampling oversized text', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 122 | <code>    const result = buildTextChunks('x'.repeat(5000), {</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 123 | <code>        chunkChars: 128,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 124 | <code>        overlapChars: 16,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 125 | <code>        maxChunks: 5</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 126 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 127 | <code>    assert.equal(result.coverageComplete, false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 128 | <code>    assert.equal(result.chunks.length, 5);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 129 | <code>    assert.equal(result.chunks[0].start, 0);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 130 | <code>    assert.equal(result.chunks.at(-1).end, 5000);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 131 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 132 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 133 | <code>test('toxicity score supports positive and negative binary labels', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 134 | <code>    assert.equal(getToxicityScore([{ label: 'toxic', score: 0.91 }]), 0.91);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 135 | <code>    assert.equal(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 136 | <code>        Number(getToxicityScore([{ label: 'not-toxic', score: 0.94 }]).toFixed(2)),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 137 | <code>        0.06</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 138 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 139 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 140 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 141 | <code>test('EMBER Harness observes or enforces the same local evaluator decision by mode', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 142 | <code>    const evaluator = async () =&gt; ({</code> | 声明局部标识符 `evaluator`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 143 | <code>        decision: 'block',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 144 | <code>        riskLevel: 'high',</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 145 | <code>        riskTypes: ['toxicity'],</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 146 | <code>        details: { maxToxicityScore: 0.99 }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 147 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 148 | <code>    const observeHarness = new AILISEmberHarness({</code> | 声明局部标识符 `observeHarness`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 149 | <code>        enabled: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 150 | <code>        mode: 'observe',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 151 | <code>        evaluator</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 152 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 153 | <code>    const enforceHarness = new AILISEmberHarness({</code> | 声明局部标识符 `enforceHarness`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 154 | <code>        enabled: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 155 | <code>        mode: 'enforce',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 156 | <code>        evaluator</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 157 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 158 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 159 | <code>    const observed = await observeHarness.check({ text: 'unsafe' });</code> | 声明局部标识符 `observed`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 160 | <code>    const blocked = await enforceHarness.check({ text: 'unsafe' });</code> | 声明局部标识符 `blocked`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 161 | <code>    assert.equal(observed.decision, 'block');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 162 | <code>    assert.equal(observed.blocked, false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 163 | <code>    assert.equal(blocked.blocked, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 164 | <code>    assert.equal(blocked.evaluatorDetails.maxToxicityScore, 0.99);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 165 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 166 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 167 | <code>test('EMBER Harness sends complete text to its evaluator', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 168 | <code>    let receivedText = '';</code> | 声明局部标识符 `receivedText`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 169 | <code>    const harness = new AILISEmberHarness({</code> | 声明局部标识符 `harness`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 170 | <code>        enabled: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 171 | <code>        mode: 'enforce',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 172 | <code>        evaluator: async ({ text }) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 173 | <code>            receivedText = text;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 174 | <code>            return { decision: text.endsWith('suffix-risk') ? 'block' : 'allow' };</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 175 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 176 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 177 | <code>    const text = `${'a'.repeat(15000)}suffix-risk`;</code> | 声明局部标识符 `text`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 178 | <code>    const result = await harness.check({ text });</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 179 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 180 | <code>    assert.equal(receivedText.length, text.length);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 181 | <code>    assert.equal(result.snapshot.textChars, text.length);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 182 | <code>    assert.equal(result.blocked, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 183 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 184 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 185 | <code>test('sensitive word classifier is local, lazy, and does not require model downloads', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 186 | <code>    const classifier = new AILISSensitiveWordClassifier();</code> | 声明局部标识符 `classifier`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 187 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 188 | <code>    assert.equal(classifier.getStatus().status, 'idle');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 189 | <code>    assert.equal(classifier.getStatus().estimatedDownloadBytes, 0);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 190 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 191 | <code>    const safe = await classifier.evaluate({</code> | 声明局部标识符 `safe`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 192 | <code>        text: '请读取项目文件并总结测试结果。'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 193 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 194 | <code>    const unsafe = await classifier.evaluate({</code> | 声明局部标识符 `unsafe`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 195 | <code>        text: '我 要 杀 了 你'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 196 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 197 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 198 | <code>    assert.equal(safe.decision, 'allow');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 199 | <code>    assert.equal(unsafe.decision, 'block');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 200 | <code>    assert.deepEqual(unsafe.riskTypes, ['violent_threat']);</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 201 | <code>    assert.equal(classifier.getStatus().engine, 'aho_corasick_lexicon');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 202 | <code>    assert.equal(classifier.getStatus().ready, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 203 | <code>    assert.ok(classifier.getStatus().patternCount &gt; 0);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 204 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 205 | <code>    await classifier.dispose();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 206 | <code>    assert.equal(classifier.getStatus().status, 'idle');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 207 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 208 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 209 | <code>test('sensitive word classifier normalizes full-width and zero-width obfuscation', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 210 | <code>    const classifier = new AILISSensitiveWordClassifier();</code> | 声明局部标识符 `classifier`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 211 | <code>    const result = await classifier.evaluate({</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 212 | <code>        text: 'Ｉ\u200B WILL KILL YOU'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 213 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 214 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 215 | <code>    assert.equal(normalizeText('Ｉ\u200B WILL KILL YOU'), 'i will kill you');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 216 | <code>    assert.equal(result.decision, 'block');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 217 | <code>    assert.ok(result.details.matchedRuleIds.includes('violent_threat'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 218 | <code>    await classifier.dispose();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 219 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 220 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 221 | <code>test('sensitive word classifier accepts additional data-driven lexicons without code rules', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 222 | <code>    const classifier = new AILISSensitiveWordClassifier({</code> | 声明局部标识符 `classifier`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 223 | <code>        extraLexicons: [{</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 224 | <code>            schema: 'ailis.safety.lexicon.v1',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 225 | <code>            version: 'test',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 226 | <code>            languages: ['zh'],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 227 | <code>            rules: [{</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 228 | <code>                id: 'test_rule',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 229 | <code>                category: 'test_risk',</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 230 | <code>                severity: 'medium',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 231 | <code>                match: 'compact',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 232 | <code>                terms: ['测试风险短语']</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 233 | <code>            }]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 234 | <code>        }]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 235 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 236 | <code>    const result = await classifier.evaluate({</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 237 | <code>        text: '这里包含一个测试 风险 短语'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 238 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 239 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 240 | <code>    assert.equal(result.decision, 'review');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 241 | <code>    assert.deepEqual(result.riskTypes, ['test_risk']);</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 242 | <code>    assert.equal(JSON.stringify(result).includes('测试风险短语'), false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 243 | <code>    await classifier.dispose();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 244 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 245 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 246 | <code>test('later sensitive-word lexicons override built-in rules with the same id', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 247 | <code>    const classifier = new AILISSensitiveWordClassifier({</code> | 声明局部标识符 `classifier`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 248 | <code>        extraLexicons: [{</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 249 | <code>            schema: 'ailis.safety.lexicon.v1',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 250 | <code>            version: 'override-test',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 251 | <code>            languages: ['zh'],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 252 | <code>            rules: [{</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 253 | <code>                id: 'violent_threat',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 254 | <code>                category: 'custom_risk',</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 255 | <code>                severity: 'medium',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 256 | <code>                match: 'compact',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 257 | <code>                terms: ['自定义覆盖短语']</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 258 | <code>            }]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 259 | <code>        }]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 260 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 261 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 262 | <code>    const removedBuiltin = await classifier.evaluate({ text: '我 要 杀 了 你' });</code> | 声明局部标识符 `removedBuiltin`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 263 | <code>    const custom = await classifier.evaluate({ text: '自定义 覆盖 短语' });</code> | 声明局部标识符 `custom`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 264 | <code>    assert.equal(removedBuiltin.decision, 'allow');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 265 | <code>    assert.equal(custom.decision, 'review');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 266 | <code>    assert.deepEqual(custom.riskTypes, ['custom_risk']);</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 267 | <code>    await classifier.dispose();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 268 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 269 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 270 | <code>test('sensitive word classifier caches repeated boundary text', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 271 | <code>    const classifier = new AILISSensitiveWordClassifier();</code> | 声明局部标识符 `classifier`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 272 | <code>    const first = await classifier.evaluate({ text: '普通的重复工具输出。' });</code> | 声明局部标识符 `first`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 273 | <code>    const second = await classifier.evaluate({ text: '普通的重复工具输出。' });</code> | 声明局部标识符 `second`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 274 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 275 | <code>    assert.equal(first.details.cacheHit, false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 276 | <code>    assert.equal(second.details.cacheHit, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 277 | <code>    await classifier.dispose();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 278 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 279 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 280 | <code>test('Aho-Corasick scanner covers long text with a large lexicon at low latency', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 281 | <code>    const targetTerm = `模式${(9999).toString(36)}词`;</code> | 声明局部标识符 `targetTerm`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 282 | <code>    const lexicon = normalizeLexicon({</code> | 声明局部标识符 `lexicon`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 283 | <code>        version: 'performance-test',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 284 | <code>        rules: [{</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 285 | <code>            id: 'bulk',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 286 | <code>            category: 'test',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 287 | <code>            severity: 'medium',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 288 | <code>            match: 'compact',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 289 | <code>            terms: Array.from({ length: 10000 }, (_, index) =&gt; `模式${index.toString(36)}词`)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 290 | <code>        }]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 291 | <code>    }, 'test');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 292 | <code>    const matcher = buildAhoCorasick(lexicon.entries);</code> | 声明局部标识符 `matcher`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 293 | <code>    const text = `${'普通工具输出'.repeat(1700)}${targetTerm}`;</code> | 声明局部标识符 `text`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 294 | <code>    const startedAt = performance.now();</code> | 声明局部标识符 `startedAt`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 295 | <code>    const matches = matcher.search(text);</code> | 声明局部标识符 `matches`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 296 | <code>    const elapsedMs = performance.now() - startedAt;</code> | 声明局部标识符 `elapsedMs`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 297 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 298 | <code>    assert.ok(matches.length &gt;= 1);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 299 | <code>    assert.ok(elapsedMs &lt; 500, `expected scan under 500ms, received ${elapsedMs.toFixed(2)}ms`);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-local-safety-classifier 的契约与回归行为。”这一文件职责。 |
| 300 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
