# tests/swebench-execution-runtime.test.mjs 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：自动化测试：验证 swebench-execution-runtime 的契约与回归行为。
- 文件类型：`source-code`
- 原始行数：160
- SHA-256：`46adaaaf4b16ea765e853605f5aa216099644d49f49cc30fda9806a8040d0391`
- 可运行副本：[打开源文件](../../../source/tests/swebench-execution-runtime.test.mjs)
- 依赖：`node:assert/strict`、`node:test`、`../scripts/run-swebench-lite-execution.mjs`、`../scripts/prepare-swebench-lite-sample.mjs`
- 主要符号：`original`、`mojibake`、`row`、`args`、`diagnostic`、`results`、`calls`、`delays`、`result`

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code>import assert from 'node:assert/strict';</code> | 导入依赖 `node:assert/strict`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 swebench-execution-runtime 的契约与回归行为。”这一文件职责。 |
| 2 | <code>import test from 'node:test';</code> | 导入依赖 `node:test`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 swebench-execution-runtime 的契约与回归行为。”这一文件职责。 |
| 3 | <code>import {</code> | 导入依赖 `{`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 swebench-execution-runtime 的契约与回归行为。”这一文件职责。 |
| 4 | <code>    buildGitHubArchiveCurlArgs,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 swebench-execution-runtime 的契约与回归行为。”这一文件职责。 |
| 5 | <code>    gitForWindowsUnzipCandidates,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 swebench-execution-runtime 的契约与回归行为。”这一文件职责。 |
| 6 | <code>    isTransientWslFailure,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 swebench-execution-runtime 的契约与回归行为。”这一文件职责。 |
| 7 | <code>    repairUtf8Mojibake,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 swebench-execution-runtime 的契约与回归行为。”这一文件职责。 |
| 8 | <code>    runSweBenchExecution,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 swebench-execution-runtime 的契约与回归行为。”这一文件职责。 |
| 9 | <code>    runWslWithRetries,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 swebench-execution-runtime 的契约与回归行为。”这一文件职责。 |
| 10 | <code>    shouldPreferGitHubArchive</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 swebench-execution-runtime 的契约与回归行为。”这一文件职责。 |
| 11 | <code>} from '../scripts/run-swebench-lite-execution.mjs';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 swebench-execution-runtime 的契约与回归行为。”这一文件职责。 |
| 12 | <code>import {</code> | 导入依赖 `{`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 swebench-execution-runtime 的契约与回归行为。”这一文件职责。 |
| 13 | <code>    SWE_BENCH_DATASET,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 swebench-execution-runtime 的契约与回归行为。”这一文件职责。 |
| 14 | <code>    SWE_BENCH_LITE_DATASET,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 swebench-execution-runtime 的契约与回归行为。”这一文件职责。 |
| 15 | <code>    resolveSweBenchDataset,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 swebench-execution-runtime 的契约与回归行为。”这一文件职责。 |
| 16 | <code>    sweBenchDatasetFilePrefix</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 swebench-execution-runtime 的契约与回归行为。”这一文件职责。 |
| 17 | <code>} from '../scripts/prepare-swebench-lite-sample.mjs';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 swebench-execution-runtime 的契约与回归行为。”这一文件职责。 |
| 18 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 19 | <code>test('SWE-bench sampler separates full and Lite dataset identities', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 swebench-execution-runtime 的契约与回归行为。”这一文件职责。 |
| 20 | <code>    assert.equal(resolveSweBenchDataset(SWE_BENCH_DATASET), 'princeton-nlp/SWE-bench');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 swebench-execution-runtime 的契约与回归行为。”这一文件职责。 |
| 21 | <code>    assert.equal(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 swebench-execution-runtime 的契约与回归行为。”这一文件职责。 |
| 22 | <code>        resolveSweBenchDataset(SWE_BENCH_LITE_DATASET),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 swebench-execution-runtime 的契约与回归行为。”这一文件职责。 |
| 23 | <code>        'princeton-nlp/SWE-bench_Lite'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 swebench-execution-runtime 的契约与回归行为。”这一文件职责。 |
| 24 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 25 | <code>    assert.equal(sweBenchDatasetFilePrefix(SWE_BENCH_DATASET), 'swebench');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 swebench-execution-runtime 的契约与回归行为。”这一文件职责。 |
| 26 | <code>    assert.equal(sweBenchDatasetFilePrefix(SWE_BENCH_LITE_DATASET), 'swebench-lite');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 swebench-execution-runtime 的契约与回归行为。”这一文件职责。 |
| 27 | <code>    assert.throws(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 swebench-execution-runtime 的契约与回归行为。”这一文件职责。 |
| 28 | <code>        () =&gt; resolveSweBenchDataset('third-party/not-swebench'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 swebench-execution-runtime 的契约与回归行为。”这一文件职责。 |
| 29 | <code>        /Unsupported SWE-bench dataset/</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 swebench-execution-runtime 的契约与回归行为。”这一文件职责。 |
| 30 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 31 | <code>    assert.equal(typeof runSweBenchExecution, 'function');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 swebench-execution-runtime 的契约与回归行为。”这一文件职责。 |
| 32 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 33 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 34 | <code>test('SWE-bench runner reverses only evidence-bearing UTF-8 mojibake', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 swebench-execution-runtime 的契约与回归行为。”这一文件职责。 |
| 35 | <code>    const original = "invalid_usernames = ['Éric', 'أحمد', 'عبد ال']";</code> | 声明局部标识符 `original`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 swebench-execution-runtime 的契约与回归行为。”这一文件职责。 |
| 36 | <code>    const mojibake = Buffer.from(original, 'utf8').toString('latin1');</code> | 声明局部标识符 `mojibake`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 swebench-execution-runtime 的契约与回归行为。”这一文件职责。 |
| 37 | <code>    assert.equal(repairUtf8Mojibake(mojibake), original);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 swebench-execution-runtime 的契约与回归行为。”这一文件职责。 |
| 38 | <code>    assert.equal(repairUtf8Mojibake('ASCII-only patch context'), 'ASCII-only patch context');</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 swebench-execution-runtime 的契约与回归行为。”这一文件职责。 |
| 39 | <code>    assert.equal(repairUtf8Mojibake('Valid René and Øresund'), 'Valid René and Øresund');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 swebench-execution-runtime 的契约与回归行为。”这一文件职责。 |
| 40 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 41 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 42 | <code>test('SWE-bench runner only prefers an uncached GitHub archive when explicitly enabled', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 swebench-execution-runtime 的契约与回归行为。”这一文件职责。 |
| 43 | <code>    const row = {</code> | 声明局部标识符 `row`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 swebench-execution-runtime 的契约与回归行为。”这一文件职责。 |
| 44 | <code>        repo: 'django/django',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 swebench-execution-runtime 的契约与回归行为。”这一文件职责。 |
| 45 | <code>        base_commit: 'bceadd2788dc2dad53eba0caae172bd8522fd483'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 swebench-execution-runtime 的契约与回归行为。”这一文件职责。 |
| 46 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 47 | <code>    assert.equal(shouldPreferGitHubArchive({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 swebench-execution-runtime 的契约与回归行为。”这一文件职责。 |
| 48 | <code>        row,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 swebench-execution-runtime 的契约与回归行为。”这一文件职责。 |
| 49 | <code>        args: { archiveFallback: true, archiveFirst: true }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 swebench-execution-runtime 的契约与回归行为。”这一文件职责。 |
| 50 | <code>    }), true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 swebench-execution-runtime 的契约与回归行为。”这一文件职责。 |
| 51 | <code>    assert.equal(shouldPreferGitHubArchive({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 swebench-execution-runtime 的契约与回归行为。”这一文件职责。 |
| 52 | <code>        row,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 swebench-execution-runtime 的契约与回归行为。”这一文件职责。 |
| 53 | <code>        args: { archiveFallback: true, archiveFirst: false }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 swebench-execution-runtime 的契约与回归行为。”这一文件职责。 |
| 54 | <code>    }), false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 swebench-execution-runtime 的契约与回归行为。”这一文件职责。 |
| 55 | <code>    assert.equal(shouldPreferGitHubArchive({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 swebench-execution-runtime 的契约与回归行为。”这一文件职责。 |
| 56 | <code>        row,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 swebench-execution-runtime 的契约与回归行为。”这一文件职责。 |
| 57 | <code>        args: { archiveFallback: false, archiveFirst: true }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 swebench-execution-runtime 的契约与回归行为。”这一文件职责。 |
| 58 | <code>    }), false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 swebench-execution-runtime 的契约与回归行为。”这一文件职责。 |
| 59 | <code>    assert.equal(shouldPreferGitHubArchive({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 swebench-execution-runtime 的契约与回归行为。”这一文件职责。 |
| 60 | <code>        row,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 swebench-execution-runtime 的契约与回归行为。”这一文件职责。 |
| 61 | <code>        args: { archiveFallback: true, archiveFirst: true },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 swebench-execution-runtime 的契约与回归行为。”这一文件职责。 |
| 62 | <code>        cachedArchivePath: 'cached.zip'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 swebench-execution-runtime 的契约与回归行为。”这一文件职责。 |
| 63 | <code>    }), false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 swebench-execution-runtime 的契约与回归行为。”这一文件职责。 |
| 64 | <code>    assert.equal(shouldPreferGitHubArchive({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 swebench-execution-runtime 的契约与回归行为。”这一文件职责。 |
| 65 | <code>        row: { repo: 'django/django' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 swebench-execution-runtime 的契约与回归行为。”这一文件职责。 |
| 66 | <code>        args: { archiveFallback: true, archiveFirst: true }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 swebench-execution-runtime 的契约与回归行为。”这一文件职责。 |
| 67 | <code>    }), false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 swebench-execution-runtime 的契约与回归行为。”这一文件职责。 |
| 68 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 69 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 70 | <code>test('SWE-bench archive download retries curl 18 failures without unsafe range requests', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 swebench-execution-runtime 的契约与回归行为。”这一文件职责。 |
| 71 | <code>    const args = buildGitHubArchiveCurlArgs({</code> | 声明局部标识符 `args`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 swebench-execution-runtime 的契约与回归行为。”这一文件职责。 |
| 72 | <code>        archivePath: 'F:\\cache\\commit.zip',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 swebench-execution-runtime 的契约与回归行为。”这一文件职责。 |
| 73 | <code>        url: 'https://codeload.github.com/astropy/astropy/zip/commit',</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 74 | <code>        archiveTimeoutMs: 900_000</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 swebench-execution-runtime 的契约与回归行为。”这一文件职责。 |
| 75 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 76 | <code>    assert.deepEqual(args.slice(0, 9), [</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 swebench-execution-runtime 的契约与回归行为。”这一文件职责。 |
| 77 | <code>        '-L',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 swebench-execution-runtime 的契约与回归行为。”这一文件职责。 |
| 78 | <code>        '--fail',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 swebench-execution-runtime 的契约与回归行为。”这一文件职责。 |
| 79 | <code>        '--retry',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 swebench-execution-runtime 的契约与回归行为。”这一文件职责。 |
| 80 | <code>        '2',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 swebench-execution-runtime 的契约与回归行为。”这一文件职责。 |
| 81 | <code>        '--retry-all-errors',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 swebench-execution-runtime 的契约与回归行为。”这一文件职责。 |
| 82 | <code>        '--retry-delay',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 swebench-execution-runtime 的契约与回归行为。”这一文件职责。 |
| 83 | <code>        '3',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 swebench-execution-runtime 的契约与回归行为。”这一文件职责。 |
| 84 | <code>        '--connect-timeout',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 swebench-execution-runtime 的契约与回归行为。”这一文件职责。 |
| 85 | <code>        '20'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 swebench-execution-runtime 的契约与回归行为。”这一文件职责。 |
| 86 | <code>    ]);</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 87 | <code>    assert.equal(args.includes('--continue-at'), false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 swebench-execution-runtime 的契约与回归行为。”这一文件职责。 |
| 88 | <code>    assert.equal(args.at(-3), '-o');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 swebench-execution-runtime 的契约与回归行为。”这一文件职责。 |
| 89 | <code>    assert.equal(args.at(-2), 'F:\\cache\\commit.zip');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 swebench-execution-runtime 的契约与回归行为。”这一文件职责。 |
| 90 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 91 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 92 | <code>test('SWE-bench runner resolves Git for Windows unzip beside custom Git roots', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 swebench-execution-runtime 的契约与回归行为。”这一文件职责。 |
| 93 | <code>    assert.deepEqual(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 swebench-execution-runtime 的契约与回归行为。”这一文件职责。 |
| 94 | <code>        gitForWindowsUnzipCandidates(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 swebench-execution-runtime 的契约与回归行为。”这一文件职责。 |
| 95 | <code>            'F:\\Git\\cmd\\git.exe\r\nC:\\Program Files\\Git\\cmd\\git.exe\r\n'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 swebench-execution-runtime 的契约与回归行为。”这一文件职责。 |
| 96 | <code>        ),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 97 | <code>        [</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 swebench-execution-runtime 的契约与回归行为。”这一文件职责。 |
| 98 | <code>            'F:\\Git\\usr\\bin\\unzip.exe',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 swebench-execution-runtime 的契约与回归行为。”这一文件职责。 |
| 99 | <code>            'C:\\Program Files\\Git\\usr\\bin\\unzip.exe'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 swebench-execution-runtime 的契约与回归行为。”这一文件职责。 |
| 100 | <code>        ]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 101 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 102 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 103 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 104 | <code>test('SWE-bench runner recognizes NUL-separated WSL VM startup failures', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 swebench-execution-runtime 的契约与回归行为。”这一文件职责。 |
| 105 | <code>    const diagnostic = 'W\0s\0l\0/\0S\0e\0r\0v\0i\0c\0e\0/\0C\0r\0e\0a\0t\0e\0I\0n\0s\0t\0a\0n\0c\0e\0/\0C\0r\0e\0a\0t\0e\0V\0m\0/\0H\0C\0S\0_\0E\0_\0C\0O\0N\0N\0E\0C\0T\0I\0O\0N\0_\0T\0I\0M\0E\0O\0U\0T\0';</code> | 声明局部标识符 `diagnostic`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 swebench-execution-runtime 的契约与回归行为。”这一文件职责。 |
| 106 | <code>    assert.equal(isTransientWslFailure({ stderr: diagnostic }), true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 swebench-execution-runtime 的契约与回归行为。”这一文件职责。 |
| 107 | <code>    assert.equal(isTransientWslFailure({ stderr: '2 failed in 1.2s' }), false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 swebench-execution-runtime 的契约与回归行为。”这一文件职责。 |
| 108 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 109 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 110 | <code>test('SWE-bench runner retries only bounded transient WSL startup failures', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 swebench-execution-runtime 的契约与回归行为。”这一文件职责。 |
| 111 | <code>    const results = [</code> | 声明局部标识符 `results`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 swebench-execution-runtime 的契约与回归行为。”这一文件职责。 |
| 112 | <code>        { ok: false, exitCode: -1, durationMs: 10, stdout: '', stderr: 'HCS_E_CONNECTION_TIMEOUT' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 swebench-execution-runtime 的契约与回归行为。”这一文件职责。 |
| 113 | <code>        { ok: false, exitCode: -1, durationMs: 11, stdout: '', stderr: 'Wsl/Service/CreateInstance/CreateVm' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 swebench-execution-runtime 的契约与回归行为。”这一文件职责。 |
| 114 | <code>        { ok: true, exitCode: 0, durationMs: 12, stdout: 'ready', stderr: '' }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 swebench-execution-runtime 的契约与回归行为。”这一文件职责。 |
| 115 | <code>    ];</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 116 | <code>    const calls = [];</code> | 声明局部标识符 `calls`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 swebench-execution-runtime 的契约与回归行为。”这一文件职责。 |
| 117 | <code>    const delays = [];</code> | 声明局部标识符 `delays`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 swebench-execution-runtime 的契约与回归行为。”这一文件职责。 |
| 118 | <code>    const result = await runWslWithRetries({</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 swebench-execution-runtime 的契约与回归行为。”这一文件职责。 |
| 119 | <code>        distro: 'Ubuntu-22.04',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 swebench-execution-runtime 的契约与回归行为。”这一文件职责。 |
| 120 | <code>        script: 'python3 --version',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 swebench-execution-runtime 的契约与回归行为。”这一文件职责。 |
| 121 | <code>        maxAttempts: 3,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 swebench-execution-runtime 的契约与回归行为。”这一文件职责。 |
| 122 | <code>        retryDelayMs: 5,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 swebench-execution-runtime 的契约与回归行为。”这一文件职责。 |
| 123 | <code>        execute: async (...args) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 swebench-execution-runtime 的契约与回归行为。”这一文件职责。 |
| 124 | <code>            calls.push(args);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 swebench-execution-runtime 的契约与回归行为。”这一文件职责。 |
| 125 | <code>            return results.shift();</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 126 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 127 | <code>        delay: async (milliseconds) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 swebench-execution-runtime 的契约与回归行为。”这一文件职责。 |
| 128 | <code>            delays.push(milliseconds);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 swebench-execution-runtime 的契约与回归行为。”这一文件职责。 |
| 129 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 130 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 131 | <code>    assert.equal(result.ok, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 swebench-execution-runtime 的契约与回归行为。”这一文件职责。 |
| 132 | <code>    assert.equal(result.attempts, 3);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 swebench-execution-runtime 的契约与回归行为。”这一文件职责。 |
| 133 | <code>    assert.equal(result.transientFailures.length, 2);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 swebench-execution-runtime 的契约与回归行为。”这一文件职责。 |
| 134 | <code>    assert.equal(calls.length, 3);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 swebench-execution-runtime 的契约与回归行为。”这一文件职责。 |
| 135 | <code>    assert.deepEqual(delays, [5, 10]);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 swebench-execution-runtime 的契约与回归行为。”这一文件职责。 |
| 136 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 137 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 138 | <code>test('SWE-bench runner does not retry ordinary command or test failures', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 swebench-execution-runtime 的契约与回归行为。”这一文件职责。 |
| 139 | <code>    let calls = 0;</code> | 声明局部标识符 `calls`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 swebench-execution-runtime 的契约与回归行为。”这一文件职责。 |
| 140 | <code>    const result = await runWslWithRetries({</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 swebench-execution-runtime 的契约与回归行为。”这一文件职责。 |
| 141 | <code>        distro: 'Ubuntu-22.04',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 swebench-execution-runtime 的契约与回归行为。”这一文件职责。 |
| 142 | <code>        script: 'python -m pytest',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 swebench-execution-runtime 的契约与回归行为。”这一文件职责。 |
| 143 | <code>        execute: async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 swebench-execution-runtime 的契约与回归行为。”这一文件职责。 |
| 144 | <code>            calls += 1;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 swebench-execution-runtime 的契约与回归行为。”这一文件职责。 |
| 145 | <code>            return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 146 | <code>                ok: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 swebench-execution-runtime 的契约与回归行为。”这一文件职责。 |
| 147 | <code>                exitCode: 1,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 swebench-execution-runtime 的契约与回归行为。”这一文件职责。 |
| 148 | <code>                durationMs: 10,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 swebench-execution-runtime 的契约与回归行为。”这一文件职责。 |
| 149 | <code>                stdout: '2 failed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 swebench-execution-runtime 的契约与回归行为。”这一文件职责。 |
| 150 | <code>                stderr: ''</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 swebench-execution-runtime 的契约与回归行为。”这一文件职责。 |
| 151 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 152 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 153 | <code>        delay: async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 swebench-execution-runtime 的契约与回归行为。”这一文件职责。 |
| 154 | <code>            throw new Error('non-transient failures must not be delayed or retried');</code> | 抛出错误：拒绝继续无效路径，并把明确失败原因交给上层处理。 |
| 155 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 156 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 157 | <code>    assert.equal(result.ok, false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 swebench-execution-runtime 的契约与回归行为。”这一文件职责。 |
| 158 | <code>    assert.equal(result.attempts, 1);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 swebench-execution-runtime 的契约与回归行为。”这一文件职责。 |
| 159 | <code>    assert.equal(calls, 1);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 swebench-execution-runtime 的契约与回归行为。”这一文件职责。 |
| 160 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
