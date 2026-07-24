# tests/ailis-email-tool.test.mjs 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：邮件工具：在账户与审批边界内读取或发送邮件。
- 文件类型：`source-code`
- 原始行数：250
- SHA-256：`5f02237e27efc2e1968943a82d403a3e67fae0f690b22aa26ba661063ee4e9f2`
- 可运行副本：[打开源文件](../../../source/tests/ailis-email-tool.test.mjs)
- 依赖：`node:assert/strict`、`node:fs/promises`、`node:os`、`node:path`、`node:test`、`node:module`、`../electron/ailis-gateway.cjs`、`../electron/ailis-email-tool.cjs`
- 主要符号：`require`、`jsonFetch`、`response`、`body`、`callTool`、`runAgent`、`providers`、`source`、`oauthUrl`、`dryToken`、`labels`、`graph`、`workspaceRoot`、`gateway`、`status`、`baseUrl`、`tools`、`draft`、`sendNeedsConfig`、`sendDryRun`、`sendDryRunFromContextProfile`、`sendDryRunFromGatewayProfile`、`sendNeedsApproval`、`classifyEmail`、`classifyLatestEmail`、`audit`

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code>import assert from 'node:assert/strict';</code> | 导入依赖 `node:assert/strict`，使本文件可以复用外部模块能力。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 2 | <code>import fs from 'node:fs/promises';</code> | 导入依赖 `node:fs/promises`，使本文件可以复用外部模块能力。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 3 | <code>import os from 'node:os';</code> | 导入依赖 `node:os`，使本文件可以复用外部模块能力。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 4 | <code>import path from 'node:path';</code> | 导入依赖 `node:path`，使本文件可以复用外部模块能力。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 5 | <code>import test from 'node:test';</code> | 导入依赖 `node:test`，使本文件可以复用外部模块能力。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 6 | <code>import { createRequire } from 'node:module';</code> | 导入依赖 `node:module`，使本文件可以复用外部模块能力。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 7 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 8 | <code>const require = createRequire(import.meta.url);</code> | 声明局部标识符 `require`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 9 | <code>const { AILISGateway } = require('../electron/ailis-gateway.cjs');</code> | 导入依赖 `../electron/ailis-gateway.cjs`，使本文件可以复用外部模块能力。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 10 | <code>const { executeEmailTool, inferProviderFromAccount, listProviderDetails } = require('../electron/ailis-email-tool.cjs');</code> | 导入依赖 `../electron/ailis-email-tool.cjs`，使本文件可以复用外部模块能力。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 11 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 12 | <code>async function jsonFetch(url, options = {}) {</code> | 定义函数 `jsonFetch`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 13 | <code>    const response = await fetch(url, {</code> | 声明局部标识符 `response`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 14 | <code>        ...options,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 15 | <code>        headers: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 16 | <code>            'content-type': 'application/json',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 17 | <code>            ...(options.headers &#124;&#124; {})</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 18 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 19 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 20 | <code>    const body = await response.json();</code> | 声明局部标识符 `body`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 21 | <code>    return { response, body };</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 22 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 23 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 24 | <code>async function callTool(baseUrl, payload) {</code> | 定义函数 `callTool`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 25 | <code>    return await jsonFetch(`${baseUrl}/tools/call`, {</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 26 | <code>        method: 'POST',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 27 | <code>        body: JSON.stringify(payload)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 28 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 29 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 30 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 31 | <code>async function runAgent(baseUrl, payload) {</code> | 定义函数 `runAgent`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 32 | <code>    return await jsonFetch(`${baseUrl}/agent/run`, {</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 33 | <code>        method: 'POST',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 34 | <code>        body: JSON.stringify(payload)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 35 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 36 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 37 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 38 | <code>test('AILIS email provider presets cover QQ, Gmail, and Outlook', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 39 | <code>    const providers = listProviderDetails();</code> | 声明局部标识符 `providers`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 40 | <code>    assert.deepEqual(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 41 | <code>        providers.map((provider) =&gt; provider.id).sort(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 42 | <code>        ['gmail', 'outlook', 'qq']</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 43 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 44 | <code>    assert.equal(inferProviderFromAccount('alice@qq.com'), 'qq');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 45 | <code>    assert.equal(inferProviderFromAccount('alice@gmail.com'), 'gmail');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 46 | <code>    assert.equal(inferProviderFromAccount('alice@outlook.com'), 'outlook');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 47 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 48 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 49 | <code>test('AILIS email list fetches searched UIDs in UID mode', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 50 | <code>    const source = await fs.readFile(path.resolve('electron/ailis-email-tool.cjs'), 'utf8');</code> | 声明局部标识符 `source`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 51 | <code>    assert.match(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 52 | <code>        source,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 53 | <code>        /client\.fetch\(selected,\s*\{[\s\S]*?envelope:\s*true[\s\S]*?\},\s*\{\s*uid:\s*true\s*\}\)/,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 54 | <code>        'listMessages must fetch the UID search results with { uid: true }'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 55 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 56 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 57 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 58 | <code>test('AILIS email OAuth and provider API actions are standardized without live credentials', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 59 | <code>    const oauthUrl = await executeEmailTool({</code> | 声明局部标识符 `oauthUrl`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 60 | <code>        action: 'oauth_authorize_url',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 61 | <code>        provider: 'gmail',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 62 | <code>        clientId: 'client-id',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 63 | <code>        redirectUri: 'http://127.0.0.1/callback',</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 64 | <code>        state: 'state-1'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 65 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 66 | <code>    assert.equal(oauthUrl.details.status, 'completed');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 67 | <code>    assert.match(oauthUrl.details.url, /accounts\.google\.com/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 68 | <code>    assert.match(oauthUrl.details.url, /gmail\.modify/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 69 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 70 | <code>    const dryToken = await executeEmailTool({</code> | 声明局部标识符 `dryToken`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 71 | <code>        action: 'oauth_exchange_code',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 72 | <code>        provider: 'outlook',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 73 | <code>        tenant: 'common',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 74 | <code>        clientId: 'client-id',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 75 | <code>        clientSecret: 'secret-value',</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 76 | <code>        redirectUri: 'http://127.0.0.1/callback',</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 77 | <code>        code: 'authorization-code',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 78 | <code>        dryRun: true</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 79 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 80 | <code>    assert.equal(dryToken.details.status, 'completed');</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 81 | <code>    assert.equal(dryToken.details.dryRun, true);</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 82 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 83 | <code>    const labels = await executeEmailTool({ action: 'gmail_list_labels' });</code> | 声明局部标识符 `labels`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 84 | <code>    assert.equal(labels.details.status, 'needs_config');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 85 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 86 | <code>    const graph = await executeEmailTool({ action: 'outlook_graph_messages' });</code> | 声明局部标识符 `graph`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 87 | <code>    assert.equal(graph.details.status, 'needs_config');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 88 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 89 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 90 | <code>test('AILIS Gateway exposes and guards the local email tool', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 91 | <code>    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-email-test-'));</code> | 声明局部标识符 `workspaceRoot`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 92 | <code>    const gateway = new AILISGateway({</code> | 声明局部标识符 `gateway`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 93 | <code>        port: 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 94 | <code>        workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 95 | <code>        projectRoot: path.resolve('.'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 96 | <code>        auditDir: path.join(workspaceRoot, '.audit'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 97 | <code>        emailProfiles: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 98 | <code>            qq: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 99 | <code>                account: 'saved@qq.com',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 100 | <code>                secret: 'saved-secret'</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 101 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 102 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 103 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 104 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 105 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 106 | <code>        const status = await gateway.start();</code> | 声明局部标识符 `status`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 107 | <code>        const baseUrl = status.url;</code> | 声明局部标识符 `baseUrl`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 108 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 109 | <code>        const tools = await jsonFetch(`${baseUrl}/tools`);</code> | 声明局部标识符 `tools`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 110 | <code>        assert.equal(tools.body.ok, true);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 111 | <code>        assert.ok(tools.body.localTools.some((tool) =&gt; tool.id === 'email'));</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 112 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 113 | <code>        const providers = await callTool(baseUrl, {</code> | 声明局部标识符 `providers`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 114 | <code>            tool: 'email',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 115 | <code>            args: { action: 'providers' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 116 | <code>            context: { workspace: workspaceRoot }</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 117 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 118 | <code>        assert.equal(providers.body.ok, true, providers.body.error);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 119 | <code>        assert.equal(providers.body.status, 'completed');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 120 | <code>        assert.ok(providers.body.result.details.providers.some((provider) =&gt; provider.id === 'qq'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 121 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 122 | <code>        const draft = await callTool(baseUrl, {</code> | 声明局部标识符 `draft`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 123 | <code>            tool: 'email',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 124 | <code>            args: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 125 | <code>                action: 'draft',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 126 | <code>                to: 'friend@example.com',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 127 | <code>                subject: 'Hello',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 128 | <code>                text: 'AILIS email draft'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 129 | <code>            },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 130 | <code>            context: { workspace: workspaceRoot }</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 131 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 132 | <code>        assert.equal(draft.body.ok, true, draft.body.error);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 133 | <code>        assert.match(JSON.stringify(draft.body.result.details), /AILIS email draft/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 134 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 135 | <code>        const sendNeedsConfig = await callTool(baseUrl, {</code> | 声明局部标识符 `sendNeedsConfig`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 136 | <code>            tool: 'email',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 137 | <code>            args: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 138 | <code>                action: 'send',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 139 | <code>                provider: 'gmail',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 140 | <code>                account: 'me@gmail.com',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 141 | <code>                to: 'friend@example.com',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 142 | <code>                subject: 'Hello',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 143 | <code>                text: 'Body'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 144 | <code>            },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 145 | <code>            context: { workspace: workspaceRoot }</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 146 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 147 | <code>        assert.equal(sendNeedsConfig.body.ok, false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 148 | <code>        assert.equal(sendNeedsConfig.body.status, 'needs_config');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 149 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 150 | <code>    const sendDryRun = await callTool(baseUrl, {</code> | 声明局部标识符 `sendDryRun`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 151 | <code>        tool: 'email',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 152 | <code>        args: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 153 | <code>            action: 'send',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 154 | <code>            provider: 'qq',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 155 | <code>                account: 'me@qq.com',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 156 | <code>                secret: 'secret-for-test',</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 157 | <code>                to: 'friend@example.com',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 158 | <code>                subject: 'Hello',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 159 | <code>                text: 'Body',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 160 | <code>                dryRun: true</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 161 | <code>            },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 162 | <code>            context: { workspace: workspaceRoot }</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 163 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 164 | <code>        assert.equal(sendDryRun.body.ok, true, sendDryRun.body.error);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 165 | <code>        assert.equal(sendDryRun.body.result.details.dryRun, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 166 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 167 | <code>        const sendDryRunFromContextProfile = await callTool(baseUrl, {</code> | 声明局部标识符 `sendDryRunFromContextProfile`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 168 | <code>            tool: 'email',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 169 | <code>            args: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 170 | <code>                action: 'send',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 171 | <code>                provider: 'qq',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 172 | <code>                to: 'friend@example.com',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 173 | <code>                subject: 'Hello',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 174 | <code>                text: 'Body',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 175 | <code>                dryRun: true</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 176 | <code>            },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 177 | <code>            context: {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 178 | <code>                workspace: workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 179 | <code>                emailProfiles: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 180 | <code>                    qq: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 181 | <code>                        account: 'configured@qq.com',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 182 | <code>                        secret: 'configured-secret'</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 183 | <code>                    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 184 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 185 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 186 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 187 | <code>        assert.equal(sendDryRunFromContextProfile.body.ok, true, sendDryRunFromContextProfile.body.error);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 188 | <code>        assert.equal(sendDryRunFromContextProfile.body.result.details.account, 'configured@qq.com');</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 189 | <code>        assert.equal(sendDryRunFromContextProfile.body.result.details.dryRun, true);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 190 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 191 | <code>        const sendDryRunFromGatewayProfile = await callTool(baseUrl, {</code> | 声明局部标识符 `sendDryRunFromGatewayProfile`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 192 | <code>            tool: 'email',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 193 | <code>            args: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 194 | <code>                action: 'send',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 195 | <code>                provider: 'qq',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 196 | <code>                to: 'friend@example.com',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 197 | <code>                subject: 'Hello',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 198 | <code>                text: 'Body',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 199 | <code>                dryRun: true</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 200 | <code>            },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 201 | <code>            context: { workspace: workspaceRoot }</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 202 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 203 | <code>        assert.equal(sendDryRunFromGatewayProfile.body.ok, true, sendDryRunFromGatewayProfile.body.error);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 204 | <code>        assert.equal(sendDryRunFromGatewayProfile.body.result.details.account, 'saved@qq.com');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 205 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 206 | <code>        const sendNeedsApproval = await callTool(baseUrl, {</code> | 声明局部标识符 `sendNeedsApproval`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 207 | <code>            tool: 'email',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 208 | <code>            args: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 209 | <code>                action: 'send',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 210 | <code>                provider: 'qq',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 211 | <code>                account: 'me@qq.com',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 212 | <code>                secret: 'secret-for-test',</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 213 | <code>                to: 'friend@example.com',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 214 | <code>                subject: 'Hello',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 215 | <code>                text: 'Body'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 216 | <code>            },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 217 | <code>            context: { workspace: workspaceRoot }</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 218 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 219 | <code>        assert.equal(sendNeedsApproval.body.ok, false);</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 220 | <code>        assert.equal(sendNeedsApproval.body.status, 'needs_approval');</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 221 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 222 | <code>        const classifyEmail = await runAgent(baseUrl, {</code> | 声明局部标识符 `classifyEmail`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 223 | <code>            sessionId: 'email-test',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 224 | <code>            message: '查看今天的邮件',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 225 | <code>            classifyOnly: true</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 226 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 227 | <code>        assert.equal(classifyEmail.body.ok, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 228 | <code>        assert.equal(classifyEmail.body.mode, 'task');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 229 | <code>        assert.equal(classifyEmail.body.intent, 'email_management');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 230 | <code>        assert.equal(classifyEmail.body.plan[0].tool, 'email');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 231 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 232 | <code>        const classifyLatestEmail = await runAgent(baseUrl, {</code> | 声明局部标识符 `classifyLatestEmail`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 233 | <code>            sessionId: 'email-test-latest',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 234 | <code>            message: '取最新10个邮件',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 235 | <code>            classifyOnly: true</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 236 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 237 | <code>        assert.equal(classifyLatestEmail.body.ok, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 238 | <code>        assert.equal(classifyLatestEmail.body.mode, 'task');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 239 | <code>        assert.equal(classifyLatestEmail.body.intent, 'email_management');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 240 | <code>        assert.equal(classifyLatestEmail.body.plan[0].tool, 'email');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 241 | <code>        assert.equal(classifyLatestEmail.body.plan[0].args.action, 'list');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 242 | <code>        assert.equal(classifyLatestEmail.body.plan[0].args.limit, 10);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 243 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 244 | <code>        const audit = await jsonFetch(`${baseUrl}/audit?limit=20`);</code> | 声明局部标识符 `audit`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 245 | <code>        assert.equal(audit.body.ok, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 246 | <code>        assert.ok(!JSON.stringify(audit.body.entries).includes('secret-for-test'));</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 247 | <code>    } finally {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 248 | <code>        await gateway.stop();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 249 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 250 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
