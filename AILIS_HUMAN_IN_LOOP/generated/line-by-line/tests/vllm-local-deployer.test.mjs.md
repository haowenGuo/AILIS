# tests/vllm-local-deployer.test.mjs 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：自动化测试：验证 vllm-local-deployer 的契约与回归行为。
- 文件类型：`source-code`
- 原始行数：604
- SHA-256：`e0a6adfed96e7812888f3da7807a633853b9f598d12348984f46798590d91d85`
- 可运行副本：[打开源文件](../../../source/tests/vllm-local-deployer.test.mjs)
- 依赖：`node:assert/strict`、`node:test`、`node:module`、`node:os`、`node:path`、`../electron/vllm-local-deployer.cjs`
- 主要符号：`require`、`command`、`sourceIndex`、`plan`、`missingParentPath`、`result`、`launchProfile`、`memoryStep`、`autoStep`、`caution`、`script`、`candidates`、`wslCandidates`、`payload`

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code>import assert from 'node:assert/strict';</code> | 导入依赖 `node:assert/strict`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 2 | <code>import { test } from 'node:test';</code> | 导入依赖 `node:test`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 3 | <code>import { createRequire } from 'node:module';</code> | 导入依赖 `node:module`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 4 | <code>import os from 'node:os';</code> | 导入依赖 `node:os`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 5 | <code>import path from 'node:path';</code> | 导入依赖 `node:path`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 6 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 7 | <code>const require = createRequire(import.meta.url);</code> | 声明局部标识符 `require`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 8 | <code>const {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 9 | <code>    buildAutoLaunchProfile,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 10 | <code>    buildDeployCommand,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 11 | <code>    buildInstallPlan,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 12 | <code>    buildNativeRuntimeProbeScript,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 13 | <code>    buildRuntimeProbeScript,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 14 | <code>    getBaseUrl,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 15 | <code>    getReusableVenvCandidates,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 16 | <code>    inspectDownloadTarget,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 17 | <code>    normalizeRuntimeMode,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 18 | <code>    normalizePathForWslpath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 19 | <code>    parseJsonSafe,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 20 | <code>    summarizeFailure</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 21 | <code>} = require('../electron/vllm-local-deployer.cjs');</code> | 导入依赖 `../electron/vllm-local-deployer.cjs`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 22 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 23 | <code>test('Windows native mode does not silently build a WSL deploy command', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 24 | <code>    assert.throws(() =&gt; buildDeployCommand({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 25 | <code>        projectRoot: 'F:\\AILIS_self_evolution_runtime',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 26 | <code>        platform: 'win32',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 27 | <code>        source: 'modelscope',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 28 | <code>        model: 'Qwen/Qwen3-1.7B',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 29 | <code>        vllmPackage: 'stable',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 30 | <code>        trustRemoteCode: true</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 31 | <code>    }), /高级连接模式/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 32 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 33 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 34 | <code>test('runtime mode defaults to native on Windows', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 35 | <code>    assert.equal(normalizeRuntimeMode('', 'win32'), 'native');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 36 | <code>    assert.equal(normalizeRuntimeMode('wsl', 'win32'), 'wsl');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 37 | <code>    assert.equal(normalizeRuntimeMode('managed', 'win32'), 'wsl');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 38 | <code>    assert.equal(normalizeRuntimeMode('auto', 'linux'), 'native');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 39 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 40 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 41 | <code>test('builds Windows WSL deploy command only when WSL mode is explicit', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 42 | <code>    const command = buildDeployCommand({</code> | 声明局部标识符 `command`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 43 | <code>        projectRoot: 'F:\\AILIS_self_evolution_runtime',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 44 | <code>        platform: 'win32',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 45 | <code>        runtimeMode: 'wsl',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 46 | <code>        source: 'modelscope',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 47 | <code>        model: 'Qwen/Qwen3-1.7B',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 48 | <code>        vllmPackage: 'stable',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 49 | <code>        trustRemoteCode: true</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 50 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 51 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 52 | <code>    assert.equal(command.command, 'powershell.exe');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 53 | <code>    assert.ok(command.args.includes('-InstallWsl'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 54 | <code>    assert.ok(command.args.includes('-Start'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 55 | <code>    assert.ok(command.args.includes('-Detached'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 56 | <code>    assert.ok(command.args.includes('-WaitReady'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 57 | <code>    assert.ok(command.args.includes('-TrustRemoteCode'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 58 | <code>    assert.ok(command.args.includes('-VllmPackage'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 59 | <code>    assert.ok(command.args.includes('stable'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 60 | <code>    assert.equal(command.source, 'modelscope');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 61 | <code>    assert.equal(command.modelId, 'Qwen/Qwen3-1.7B');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 62 | <code>    assert.equal(command.runtimeMode, 'wsl');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 63 | <code>    assert.equal(command.venvDir, '.ailis-runtime/vllm-venv');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 64 | <code>    assert.equal(command.vllmPackage, 'stable');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 65 | <code>    assert.equal(command.pipIndexUrl, 'https://pypi.tuna.tsinghua.edu.cn/simple');</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 66 | <code>    assert.ok(command.args.includes('-PipIndexUrl'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 67 | <code>    assert.ok(command.args.includes('https://pypi.tuna.tsinghua.edu.cn/simple'));</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 68 | <code>    assert.equal(command.baseUrl, 'http://127.0.0.1:8000/v1');</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 69 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 70 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 71 | <code>test('builds Linux deploy command without assuming system vLLM already exists', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 72 | <code>    const command = buildDeployCommand({</code> | 声明局部标识符 `command`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 73 | <code>        projectRoot: '/work/ailis',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 74 | <code>        platform: 'linux',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 75 | <code>        source: 'hf',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 76 | <code>        model: 'Qwen/Qwen3-4B-Instruct-2507',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 77 | <code>        port: 8010,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 78 | <code>        vllmPackage: 'vllm==0.5.5'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 79 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 80 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 81 | <code>    assert.equal(command.command, 'bash');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 82 | <code>    assert.ok(command.args.includes('--source'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 83 | <code>    assert.ok(command.args.includes('hf'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 84 | <code>    assert.ok(command.args.includes('--model'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 85 | <code>    assert.ok(command.args.includes('Qwen/Qwen3-4B-Instruct-2507'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 86 | <code>    assert.ok(command.args.includes('--host'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 87 | <code>    assert.ok(command.args.includes('127.0.0.1'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 88 | <code>    assert.ok(command.args.includes('--venv-dir'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 89 | <code>    assert.ok(command.args.includes('.ailis-runtime/vllm-venv'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 90 | <code>    assert.ok(command.args.includes('--start'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 91 | <code>    assert.ok(command.args.includes('--detached'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 92 | <code>    assert.ok(command.args.includes('--wait-ready'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 93 | <code>    assert.ok(command.args.includes('--vllm-package'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 94 | <code>    assert.ok(command.args.includes('vllm==0.5.5'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 95 | <code>    assert.equal(command.venvDir, '.ailis-runtime/vllm-venv');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 96 | <code>    assert.equal(command.vllmPackage, 'vllm==0.5.5');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 97 | <code>    assert.ok(command.args.includes('--pip-index-url'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 98 | <code>    assert.ok(command.args.includes('https://pypi.tuna.tsinghua.edu.cn/simple'));</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 99 | <code>    assert.equal(command.baseUrl, 'http://127.0.0.1:8010/v1');</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 100 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 101 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 102 | <code>test('builds local vLLM deploy command with a stable served model name', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 103 | <code>    const command = buildDeployCommand({</code> | 声明局部标识符 `command`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 104 | <code>        projectRoot: 'F:\\AILIS_self_evolution_runtime',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 105 | <code>        platform: 'win32',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 106 | <code>        runtimeMode: 'wsl',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 107 | <code>        source: 'local',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 108 | <code>        model: 'F:\\models\\Qwen3-4B-Instruct',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 109 | <code>        servedModelName: 'local-qwen3-4b',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 110 | <code>        maxModelLen: 4096,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 111 | <code>        cpuOffloadGb: 3,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 112 | <code>        swapSpace: 6</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 113 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 114 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 115 | <code>    assert.equal(command.command, 'powershell.exe');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 116 | <code>    assert.equal(command.source, 'local');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 117 | <code>    assert.equal(command.modelId, 'F:\\models\\Qwen3-4B-Instruct');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 118 | <code>    assert.equal(command.servedModelId, 'local-qwen3-4b');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 119 | <code>    assert.ok(command.args.includes('-Source'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 120 | <code>    assert.ok(command.args.includes('local'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 121 | <code>    assert.ok(command.args.includes('-Model'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 122 | <code>    assert.ok(command.args.includes('F:\\models\\Qwen3-4B-Instruct'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 123 | <code>    assert.ok(command.args.includes('-ServedModelName'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 124 | <code>    assert.ok(command.args.includes('local-qwen3-4b'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 125 | <code>    assert.ok(command.args.includes('-CpuOffloadGb'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 126 | <code>    assert.ok(command.args.includes('3'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 127 | <code>    assert.ok(command.args.includes('-SwapSpace'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 128 | <code>    assert.ok(command.args.includes('6'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 129 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 130 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 131 | <code>test('infers local source for filesystem model paths even when caller passes online source', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 132 | <code>    const command = buildDeployCommand({</code> | 声明局部标识符 `command`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 133 | <code>        projectRoot: 'F:\\AILIS_self_evolution_runtime',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 134 | <code>        platform: 'win32',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 135 | <code>        runtimeMode: 'wsl',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 136 | <code>        source: 'modelscope',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 137 | <code>        model: 'F:\\lab\\LLM project\\Qwen3-4B',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 138 | <code>        servedModelName: 'local-Qwen3-4B'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 139 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 140 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 141 | <code>    assert.equal(command.source, 'local');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 142 | <code>    const sourceIndex = command.args.indexOf('-Source');</code> | 声明局部标识符 `sourceIndex`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 143 | <code>    assert.equal(command.args[sourceIndex + 1], 'local');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 144 | <code>    assert.equal(command.modelId, 'F:\\lab\\LLM project\\Qwen3-4B');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 145 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 146 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 147 | <code>test('install plan does not download weights for local vLLM model paths', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 148 | <code>    const plan = buildInstallPlan({</code> | 声明局部标识符 `plan`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 149 | <code>        platform: 'linux',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 150 | <code>        source: 'local',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 151 | <code>        targetModel: 'local-qwen3-4b',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 152 | <code>        runtime: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 153 | <code>            available: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 154 | <code>            pythonOk: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 155 | <code>            venvAvailable: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 156 | <code>            pipAvailable: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 157 | <code>            vllmInstalled: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 158 | <code>            gpuInfo: 'NVIDIA GPU'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 159 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 160 | <code>        service: { ok: false, modelIds: [] }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 161 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 162 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 163 | <code>    assert.equal(plan.ok, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 164 | <code>    assert.equal(plan.steps.some((step) =&gt; step.id === 'download_model'), false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 165 | <code>    assert.ok(plan.steps.some((step) =&gt; step.id === 'start_vllm'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 166 | <code>    assert.equal(plan.requiresNetwork, false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 167 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 168 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 169 | <code>test('install plan requires an install path before downloading online models', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 170 | <code>    const plan = buildInstallPlan({</code> | 声明局部标识符 `plan`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 171 | <code>        platform: 'linux',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 172 | <code>        source: 'hf',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 173 | <code>        targetModel: 'Qwen/Qwen3-1.7B',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 174 | <code>        runtime: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 175 | <code>            available: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 176 | <code>            pythonOk: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 177 | <code>            venvAvailable: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 178 | <code>            pipAvailable: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 179 | <code>            vllmInstalled: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 180 | <code>            gpuInfo: 'NVIDIA GPU'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 181 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 182 | <code>        service: { ok: false, modelIds: [] }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 183 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 184 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 185 | <code>    assert.equal(plan.ok, false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 186 | <code>    assert.ok(plan.steps.some((step) =&gt; step.id === 'select_download_dir'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 187 | <code>    assert.equal(plan.steps.some((step) =&gt; step.id === 'download_model'), false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 188 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 189 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 190 | <code>test('install plan downloads online models only after install path is ready', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 191 | <code>    const plan = buildInstallPlan({</code> | 声明局部标识符 `plan`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 192 | <code>        platform: 'linux',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 193 | <code>        source: 'modelscope',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 194 | <code>        targetModel: 'Qwen/Qwen3-1.7B',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 195 | <code>        runtime: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 196 | <code>            available: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 197 | <code>            pythonOk: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 198 | <code>            venvAvailable: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 199 | <code>            pipAvailable: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 200 | <code>            vllmInstalled: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 201 | <code>            gpuInfo: 'NVIDIA GPU'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 202 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 203 | <code>        downloadTarget: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 204 | <code>            ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 205 | <code>            path: '/models/ailis',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 206 | <code>            blockers: [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 207 | <code>            warnings: []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 208 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 209 | <code>        service: { ok: false, modelIds: [] }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 210 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 211 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 212 | <code>    assert.equal(plan.ok, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 213 | <code>    assert.ok(plan.steps.some((step) =&gt; step.id === 'download_model'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 214 | <code>    assert.match(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 215 | <code>        plan.steps.find((step) =&gt; step.id === 'download_model')?.description &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 216 | <code>        /\/models\/ailis/</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 217 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 218 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 219 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 220 | <code>test('download target inspection reports invalid install folders before deployment', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 221 | <code>    const missingParentPath = path.join(os.tmpdir(), `ailis-missing-${Date.now()}-${Math.random()}`, 'models');</code> | 声明局部标识符 `missingParentPath`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 222 | <code>    const result = inspectDownloadTarget({</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 223 | <code>        downloadDir: missingParentPath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 224 | <code>        modelId: 'Qwen/Qwen3-4B'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 225 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 226 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 227 | <code>    assert.equal(result.ok, false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 228 | <code>    assert.ok(result.requiredBytes &gt; 0);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 229 | <code>    assert.ok(result.blockers.some((item) =&gt; /上级目录不存在/.test(item)));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 230 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 231 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 232 | <code>test('install plan reuses a discovered vLLM runtime instead of forcing reinstall', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 233 | <code>    const plan = buildInstallPlan({</code> | 声明局部标识符 `plan`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 234 | <code>        platform: 'win32',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 235 | <code>        runtimeMode: 'wsl',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 236 | <code>        wsl: { required: true, available: true, distros: ['Ubuntu'] },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 237 | <code>        source: 'local',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 238 | <code>        targetModel: 'local-qwen3-4b',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 239 | <code>        runtime: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 240 | <code>            available: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 241 | <code>            shellOk: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 242 | <code>            pythonOk: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 243 | <code>            venvAvailable: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 244 | <code>            pipAvailable: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 245 | <code>            vllmInstalled: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 246 | <code>            reusableVenvDir: '~/.cache/ailis/vllm-smoke-venv',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 247 | <code>            gpuInfo: 'NVIDIA GPU'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 248 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 249 | <code>        service: { ok: true, modelIds: ['Qwen/Qwen2-0.5B-Instruct'] }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 250 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 251 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 252 | <code>    assert.equal(plan.ok, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 253 | <code>    assert.equal(plan.steps.some((step) =&gt; step.id === 'install_vllm'), false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 254 | <code>    assert.ok(plan.steps.some((step) =&gt; step.id === 'switch_vllm_service'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 255 | <code>    assert.equal(plan.requiresNetwork, false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 256 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 257 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 258 | <code>test('install plan upgrades a reusable runtime when it is incompatible with the local model', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 259 | <code>    const plan = buildInstallPlan({</code> | 声明局部标识符 `plan`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 260 | <code>        platform: 'win32',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 261 | <code>        runtimeMode: 'wsl',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 262 | <code>        wsl: { required: true, available: true, distros: ['Ubuntu'] },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 263 | <code>        source: 'local',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 264 | <code>        targetModel: 'local-qwen3-4b',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 265 | <code>        runtime: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 266 | <code>            available: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 267 | <code>            shellOk: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 268 | <code>            pythonOk: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 269 | <code>            venvAvailable: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 270 | <code>            pipAvailable: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 271 | <code>            vllmInstalled: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 272 | <code>            reusableVenvDir: '~/.cache/ailis/vllm-smoke-venv',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 273 | <code>            modelCompatibility: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 274 | <code>                ok: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 275 | <code>                reason: '本地模型声明需要 transformers 4.51.0+，当前可复用 runtime 是 4.44.2，需要升级。'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 276 | <code>            },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 277 | <code>            gpuInfo: 'NVIDIA GPU'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 278 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 279 | <code>        service: { ok: false, modelIds: [] }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 280 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 281 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 282 | <code>    assert.equal(plan.ok, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 283 | <code>    assert.ok(plan.steps.some((step) =&gt; step.id === 'install_vllm'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 284 | <code>    assert.match(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 285 | <code>        plan.steps.find((step) =&gt; step.id === 'install_vllm')?.description &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 286 | <code>        /需要升级/</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 287 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 288 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 289 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 290 | <code>test('install plan warns when local model weights are larger than GPU memory', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 291 | <code>    const launchProfile = buildAutoLaunchProfile({</code> | 声明局部标识符 `launchProfile`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 292 | <code>        source: 'local',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 293 | <code>        runtime: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 294 | <code>            gpuInfo: 'NVIDIA GeForce RTX 3060 Laptop GPU, 6144 MiB, 546.92'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 295 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 296 | <code>        modelRequirements: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 297 | <code>            weightBytes: 8 * 1024 ** 3</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 298 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 299 | <code>        modelHardwareFit: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 300 | <code>            ok: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 301 | <code>            severity: 'high',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 302 | <code>            reason: '本地模型权重约 8.0GB，大于当前最大 GPU 显存约 6.0GB。'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 303 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 304 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 305 | <code>    const plan = buildInstallPlan({</code> | 声明局部标识符 `plan`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 306 | <code>        platform: 'win32',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 307 | <code>        runtimeMode: 'wsl',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 308 | <code>        wsl: { required: true, available: true, distros: ['Ubuntu'] },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 309 | <code>        source: 'local',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 310 | <code>        targetModel: 'local-qwen3-4b',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 311 | <code>        runtime: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 312 | <code>            available: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 313 | <code>            shellOk: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 314 | <code>            pythonOk: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 315 | <code>            venvAvailable: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 316 | <code>            pipAvailable: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 317 | <code>            vllmInstalled: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 318 | <code>            gpuInfo: 'NVIDIA GeForce RTX 3060 Laptop GPU, 6144 MiB, 546.92'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 319 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 320 | <code>        modelHardwareFit: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 321 | <code>            ok: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 322 | <code>            severity: 'high',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 323 | <code>            reason: '本地模型权重约 7.6GB，大于当前最大 GPU 显存约 6.0GB。'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 324 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 325 | <code>        launchProfile,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 326 | <code>        service: { ok: false, modelIds: [] }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 327 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 328 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 329 | <code>    const memoryStep = plan.steps.find((step) =&gt; step.id === 'gpu_memory_fit');</code> | 声明局部标识符 `memoryStep`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 330 | <code>    assert.equal(memoryStep?.severity, 'warning');</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 331 | <code>    assert.match(memoryStep?.description &#124;&#124; '', /权重约 7\.6GB/);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 332 | <code>    const autoStep = plan.steps.find((step) =&gt; step.id === 'auto_launch_profile');</code> | 声明局部标识符 `autoStep`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 333 | <code>    assert.equal(autoStep?.severity, 'warning');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 334 | <code>    assert.match(autoStep?.description &#124;&#124; '', /cpu_offload_gb/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 335 | <code>    assert.equal(launchProfile.maxModelLen, 2048);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 336 | <code>    assert.ok(launchProfile.cpuOffloadGb &gt; 0);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 337 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 338 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 339 | <code>test('install plan warns but does not block modern runtime upgrade on older NVIDIA driver', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 340 | <code>    const plan = buildInstallPlan({</code> | 声明局部标识符 `plan`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 341 | <code>        platform: 'win32',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 342 | <code>        runtimeMode: 'wsl',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 343 | <code>        wsl: { required: true, available: true, distros: ['Ubuntu'] },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 344 | <code>        source: 'local',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 345 | <code>        targetModel: 'local-qwen3-4b',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 346 | <code>        runtime: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 347 | <code>            available: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 348 | <code>            shellOk: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 349 | <code>            pythonOk: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 350 | <code>            venvAvailable: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 351 | <code>            pipAvailable: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 352 | <code>            reusableVenvDir: '~/.cache/ailis/vllm-smoke-venv',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 353 | <code>            modelCompatibility: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 354 | <code>                ok: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 355 | <code>                reason: '本地模型声明需要 transformers 4.51.0+，当前可复用 runtime 是 4.44.2，需要升级。'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 356 | <code>            },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 357 | <code>            gpuInfo: 'NVIDIA GeForce RTX 3060 Laptop GPU, 6144 MiB, 546.92'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 358 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 359 | <code>        runtimeUpgradeFeasibility: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 360 | <code>            ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 361 | <code>            severity: 'warning',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 362 | <code>            reason: '当前 NVIDIA 驱动 546.92 偏旧，将在隔离 runtime 中升级验证。'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 363 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 364 | <code>        service: { ok: false, modelIds: [] }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 365 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 366 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 367 | <code>    assert.equal(plan.ok, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 368 | <code>    const caution = plan.steps.find((step) =&gt; step.id === 'runtime_upgrade_caution');</code> | 声明局部标识符 `caution`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 369 | <code>    assert.equal(caution?.severity, 'warning');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 370 | <code>    assert.equal(plan.blockingSteps.some((step) =&gt; step.id === 'runtime_upgrade_caution'), false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 371 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 372 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 373 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 374 | <code>test('install plan detects missing Windows WSL and Python/runtime setup', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 375 | <code>    const plan = buildInstallPlan({</code> | 声明局部标识符 `plan`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 376 | <code>        platform: 'win32',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 377 | <code>        runtimeMode: 'wsl',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 378 | <code>        wsl: { required: true, available: false, distros: [] },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 379 | <code>        runtime: { available: false },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 380 | <code>        service: { ok: false }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 381 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 382 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 383 | <code>    assert.equal(plan.ok, false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 384 | <code>    assert.ok(plan.steps.some((step) =&gt; step.id === 'install_wsl'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 385 | <code>    assert.ok(plan.steps.some((step) =&gt; step.id === 'start_vllm'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 386 | <code>    assert.equal(plan.requiresSystemChange, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 387 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 388 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 389 | <code>test('install plan does not require WSL in Windows native mode', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 390 | <code>    const plan = buildInstallPlan({</code> | 声明局部标识符 `plan`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 391 | <code>        platform: 'win32',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 392 | <code>        runtimeMode: 'native',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 393 | <code>        wsl: { required: false, available: false, distros: [] },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 394 | <code>        source: 'local',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 395 | <code>        targetModel: 'local-qwen3-4b',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 396 | <code>        runtime: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 397 | <code>            available: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 398 | <code>            shellOk: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 399 | <code>            pythonOk: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 400 | <code>            pythonMissing: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 401 | <code>            venvAvailable: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 402 | <code>            pipAvailable: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 403 | <code>            vllmInstalled: false</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 404 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 405 | <code>        service: { ok: false, modelIds: [] }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 406 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 407 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 408 | <code>    assert.equal(plan.ok, false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 409 | <code>    assert.equal(plan.steps.some((step) =&gt; step.id === 'install_wsl'), false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 410 | <code>    assert.equal(plan.steps.some((step) =&gt; step.id === 'repair_wsl_shell'), false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 411 | <code>    assert.equal(plan.steps.some((step) =&gt; step.id === 'install_python'), false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 412 | <code>    assert.ok(plan.steps.some((step) =&gt; step.id === 'windows_native_vllm_service_required'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 413 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 414 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 415 | <code>test('install plan blocks Windows native mode when running service has another model', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 416 | <code>    const plan = buildInstallPlan({</code> | 声明局部标识符 `plan`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 417 | <code>        platform: 'win32',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 418 | <code>        runtimeMode: 'native',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 419 | <code>        source: 'local',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 420 | <code>        targetModel: 'local-qwen3-4b',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 421 | <code>        runtime: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 422 | <code>            available: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 423 | <code>            shellOk: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 424 | <code>            pythonOk: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 425 | <code>            venvAvailable: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 426 | <code>            pipAvailable: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 427 | <code>            vllmInstalled: false</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 428 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 429 | <code>        service: { ok: true, modelIds: ['other-model'] }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 430 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 431 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 432 | <code>    assert.equal(plan.ok, false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 433 | <code>    assert.ok(plan.steps.some((step) =&gt; step.id === 'windows_native_vllm_model_mismatch'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 434 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 435 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 436 | <code>test('install plan detects Python, vLLM, GPU, and service readiness work', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 437 | <code>    const plan = buildInstallPlan({</code> | 声明局部标识符 `plan`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 438 | <code>        platform: 'linux',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 439 | <code>        targetModel: 'Qwen/Qwen3-1.7B',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 440 | <code>        runtime: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 441 | <code>            available: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 442 | <code>            pythonOk: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 443 | <code>            venvAvailable: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 444 | <code>            pipAvailable: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 445 | <code>            vllmInstalled: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 446 | <code>            gpuInfo: '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 447 | <code>            diskAvailableKb: 2 * 1024 * 1024</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 448 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 449 | <code>        downloadTarget: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 450 | <code>            ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 451 | <code>            path: '/models',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 452 | <code>            blockers: [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 453 | <code>            warnings: []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 454 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 455 | <code>        service: { ok: false }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 456 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 457 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 458 | <code>    assert.equal(plan.ok, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 459 | <code>    assert.ok(plan.steps.some((step) =&gt; step.id === 'install_python'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 460 | <code>    assert.ok(plan.steps.some((step) =&gt; step.id === 'install_vllm'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 461 | <code>    assert.ok(plan.steps.some((step) =&gt; step.id === 'disk_space_low'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 462 | <code>    assert.ok(plan.steps.some((step) =&gt; step.id === 'download_model'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 463 | <code>    assert.ok(plan.steps.some((step) =&gt; step.id === 'gpu_check'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 464 | <code>    assert.ok(plan.steps.some((step) =&gt; step.id === 'start_vllm'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 465 | <code>    assert.equal(plan.requiresNetwork, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 466 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 467 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 468 | <code>test('install plan treats shell-ready but Python-missing runtime as auto-fixable', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 469 | <code>    const plan = buildInstallPlan({</code> | 声明局部标识符 `plan`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 470 | <code>        platform: 'win32',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 471 | <code>        runtimeMode: 'wsl',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 472 | <code>        wsl: { required: true, available: true, distros: ['Ubuntu-22.04'] },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 473 | <code>        targetModel: 'Qwen/Qwen3-1.7B',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 474 | <code>        runtime: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 475 | <code>            available: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 476 | <code>            shellOk: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 477 | <code>            pythonOk: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 478 | <code>            pythonMissing: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 479 | <code>            venvAvailable: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 480 | <code>            pipAvailable: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 481 | <code>            vllmInstalled: false</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 482 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 483 | <code>        downloadTarget: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 484 | <code>            ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 485 | <code>            path: '/models',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 486 | <code>            blockers: [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 487 | <code>            warnings: []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 488 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 489 | <code>        service: { ok: false, modelIds: [] }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 490 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 491 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 492 | <code>    assert.equal(plan.ok, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 493 | <code>    assert.deepEqual(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 494 | <code>        plan.steps.map((step) =&gt; step.id).filter((id) =&gt; ['install_python', 'install_vllm', 'download_model'].includes(id)),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 495 | <code>        ['install_python', 'install_vllm', 'download_model']</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 496 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 497 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 498 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 499 | <code>test('install plan blocks when WSL shell itself cannot start', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 500 | <code>    const plan = buildInstallPlan({</code> | 声明局部标识符 `plan`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 501 | <code>        platform: 'win32',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 502 | <code>        runtimeMode: 'wsl',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 503 | <code>        wsl: { required: true, available: true, distros: ['Ubuntu-22.04'] },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 504 | <code>        targetModel: 'local-Qwen3-4B',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 505 | <code>        source: 'local',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 506 | <code>        runtime: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 507 | <code>            available: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 508 | <code>            shellOk: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 509 | <code>            pythonOk: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 510 | <code>            error: 'Wsl/WSL_E_USER_NOT_FOUND getpwuid(0) failed 5 CreateProcessCommon:807',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 511 | <code>            shellFailure: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 512 | <code>                code: 'wsl_shell_unusable',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 513 | <code>                blocking: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 514 | <code>                message: 'WSL/Ubuntu 已安装，但 Linux shell 无法启动。'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 515 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 516 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 517 | <code>        service: { ok: false, modelIds: [] }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 518 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 519 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 520 | <code>    assert.equal(plan.ok, false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 521 | <code>    assert.ok(plan.steps.some((step) =&gt; step.id === 'repair_wsl_shell'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 522 | <code>    assert.equal(plan.steps.some((step) =&gt; step.id === 'install_python'), false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 523 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 524 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 525 | <code>test('runtime probe can report missing Python without needing Python itself', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 526 | <code>    const script = buildRuntimeProbeScript('/mnt/f/AILIS_self_evolution_runtime');</code> | 声明局部标识符 `script`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 527 | <code>    assert.match(script, /if ! command -v python3/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 528 | <code>    assert.match(script, /"pythonMissing":true/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 529 | <code>    assert.match(script, /runtimeCandidates/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 530 | <code>    assert.match(script, /reusableVenvDir/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 531 | <code>    assert.match(script, /transformersVersion/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 532 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 533 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 534 | <code>test('runtime discovery keeps Windows native paths separate from WSL paths', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 535 | <code>    const candidates = getReusableVenvCandidates('', 'win32');</code> | 声明局部标识符 `candidates`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 536 | <code>    assert.deepEqual(candidates, ['.ailis-runtime/vllm-venv']);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 537 | <code>    const wslCandidates = getReusableVenvCandidates('', 'win32', 'wsl');</code> | 声明局部标识符 `wslCandidates`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 538 | <code>    assert.ok(wslCandidates.includes('~/.cache/ailis/vllm-venv'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 539 | <code>    assert.ok(wslCandidates.includes('~/.cache/ailis/vllm-smoke-venv'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 540 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 541 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 542 | <code>test('native runtime probe script does not create runtime directories during diagnosis', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 543 | <code>    const script = buildNativeRuntimeProbeScript('F:\\AILIS_self_evolution_runtime');</code> | 声明局部标识符 `script`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 544 | <code>    assert.doesNotMatch(script, /os\.makedirs/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 545 | <code>    assert.match(script, /runtimeCandidates/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 546 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 547 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 548 | <code>test('summarizes common deployment failures as actionable causes', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 549 | <code>    assert.equal(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 550 | <code>        summarizeFailure(['No WSL distro found. Run wsl --install -d Ubuntu'], 3).code,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 551 | <code>        'wsl_missing'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 552 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 553 | <code>    assert.equal(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 554 | <code>        summarizeFailure(['Wsl/WSL_E_USER_NOT_FOUND', 'getpwuid(0) failed 5', 'CreateProcessCommon:807'], 1).code,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 555 | <code>        'wsl_shell_unusable'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 556 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 557 | <code>    assert.equal(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 558 | <code>        summarizeFailure(['python3 was not found'], 3).code,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 559 | <code>        'python_missing'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 560 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 561 | <code>    assert.equal(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 562 | <code>        summarizeFailure(['CUDA out of memory'], 1).code,</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 563 | <code>        'gpu_or_cuda'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 564 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 565 | <code>    assert.equal(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 566 | <code>        summarizeFailure([</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 567 | <code>            'NVIDIA GPU detected: NVIDIA GeForce RTX 3060 Laptop GPU, 6144 MiB',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 568 | <code>            'ValueError: The checkpoint you are trying to load has model type `qwen3` but Transformers does not recognize this architecture.'</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 569 | <code>        ], 1).code,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 570 | <code>        'model_runtime_incompatible'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 571 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 572 | <code>    assert.equal(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 573 | <code>        summarizeFailure([</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 574 | <code>            'NVIDIA GPU detected: NVIDIA GeForce RTX 3060 Laptop GPU, 6144 MiB',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 575 | <code>            'vLLM did not become ready within 1200s.'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 576 | <code>        ], 4).code,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 577 | <code>        'ready_timeout'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 578 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 579 | <code>    assert.equal(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 580 | <code>        summarizeFailure([</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 581 | <code>            'Successfully installed nvidia-cuda-runtime-cu12',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 582 | <code>            'huggingface_hub.errors.LocalEntryNotFoundError',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 583 | <code>            'Network is unreachable'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 584 | <code>        ], 1).code,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 585 | <code>        'model_download_or_network'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 586 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 587 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 588 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 589 | <code>test('normalizes client base URL for wildcard host', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 590 | <code>    assert.equal(getBaseUrl({ host: '0.0.0.0', port: 8001 }), 'http://127.0.0.1:8001/v1');</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 591 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 592 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 593 | <code>test('normalizes Windows paths before passing them to wslpath', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 594 | <code>    assert.equal(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 595 | <code>        normalizePathForWslpath('F:\\AILIS_self_evolution_runtime'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 596 | <code>        'F:/AILIS_self_evolution_runtime'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 597 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 598 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 599 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 600 | <code>test('parses runtime probe JSON even when WSL emits warnings first', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 601 | <code>    const payload = parseJsonSafe('w\0s\0l\0 warning\n{"pythonOk":true,"pythonVersion":"3.10.12"}\n', {});</code> | 声明局部标识符 `payload`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 602 | <code>    assert.equal(payload.pythonOk, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 603 | <code>    assert.equal(payload.pythonVersion, '3.10.12');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 vllm-local-deployer 的契约与回归行为。”这一文件职责。 |
| 604 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
