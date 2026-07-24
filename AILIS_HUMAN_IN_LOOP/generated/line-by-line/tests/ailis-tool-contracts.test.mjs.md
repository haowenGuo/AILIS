# tests/ailis-tool-contracts.test.mjs 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：工具契约层：定义 schema、风险、审批、错误与执行约束。
- 文件类型：`source-code`
- 原始行数：383
- SHA-256：`f533ebec220218114792795218e4e18950d3bf60c1a431f49b38d75a1136f32e`
- 可运行副本：[打开源文件](../../../source/tests/ailis-tool-contracts.test.mjs)
- 依赖：`node:assert/strict`、`node:module`、`node:test`、`../electron/ailis-tool-contracts.cjs`
- 主要符号：`require`、`contracts`、`codexCollaborationTools`、`validSpawnAgent`、`spawnContract`、`invalidSpawnAgent`、`validFollowupTask`、`invalidWaitAgent`、`waitContract`、`listContract`、`validRead`、`badRead`、`badEmail`、`validEmailReadNumericUid`、`validEmailListStringLimit`、`badMcpCall`、`validMcpRead`、`validMcpToolNameAlias`、`validMcpToolArgsAlias`、`validMcpHealth`、`validToolSearch`、`validWebSearch`、`validWebScreenshot`、`validGitHubPages`、`validArtifactCompute`、`validArtifactToolsPlan`、`validArtifactImport`、`badArtifactImport`、`badArtifactCompute`、`badToolSearch`、`badWebSearch`、`validWebRun`、`webRunContract`、`emptyWebRun`、`mixedWebRun`、`unsupportedWebRun`、`wrongArtifactOwner`、`badMcpPrompt`、`validDoctorObservation`、`badRepair`、`validCapabilityPlan`、`validCandidateSearch`、`validCandidatePlan`、`validLearningRecord`、`badCapabilityRepair`、`validSelfDebugCase`、`badSelfDebugCase`、`validSelfDebugApply`、`validSelfEvolutionAnalyze`、`badSelfEvolutionApply`、`emailPrompt`、`combined`、`summaries`、`toolSearchPrompt`、`artifactComputePrompt`、`artifactToolsPrompt`、`artifactImportPrompt`、`doctorPrompt`、`capabilityPrompt`、`selfDebuggerPrompt`、`selfEvolutionPrompt`

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code>import assert from 'node:assert/strict';</code> | 导入依赖 `node:assert/strict`，使本文件可以复用外部模块能力。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 2 | <code>import { createRequire } from 'node:module';</code> | 导入依赖 `node:module`，使本文件可以复用外部模块能力。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 3 | <code>import test from 'node:test';</code> | 导入依赖 `node:test`，使本文件可以复用外部模块能力。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 4 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5 | <code>const require = createRequire(import.meta.url);</code> | 声明局部标识符 `require`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 6 | <code>const {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 7 | <code>    buildToolContractsPrompt,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 8 | <code>    getToolContractPromptText,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 9 | <code>    listToolContracts,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 10 | <code>    listToolContractSummaries,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 11 | <code>    validateToolContract</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 12 | <code>} = require('../electron/ailis-tool-contracts.cjs');</code> | 导入依赖 `../electron/ailis-tool-contracts.cjs`，使本文件可以复用外部模块能力。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 13 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 14 | <code>test('AILIS tool contracts expose versioned schemas and validate common failures', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 15 | <code>    const contracts = listToolContracts();</code> | 声明局部标识符 `contracts`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 16 | <code>    assert.ok(contracts.length &gt;= 10);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 17 | <code>    assert.ok(contracts.some((contract) =&gt; contract.id === 'mcp_bridge' &amp;&amp; contract.version &gt;= 1));</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 18 | <code>    assert.ok(contracts.some((contract) =&gt; contract.id === 'tool_search' &amp;&amp; contract.version &gt;= 1));</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 19 | <code>    assert.ok(contracts.some((contract) =&gt; contract.id === 'web_search' &amp;&amp; contract.version &gt;= 1));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 20 | <code>    assert.ok(contracts.some((contract) =&gt; contract.id === 'tool_doctor' &amp;&amp; contract.version &gt;= 1));</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 21 | <code>    assert.ok(contracts.some((contract) =&gt; contract.id === 'capability_manager' &amp;&amp; contract.version &gt;= 1));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 22 | <code>    assert.ok(contracts.some((contract) =&gt; contract.id === 'self_debugger' &amp;&amp; contract.version &gt;= 1));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 23 | <code>    assert.ok(contracts.some((contract) =&gt; contract.id === 'self_evolution' &amp;&amp; contract.version &gt;= 1));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 24 | <code>    assert.ok(contracts.some((contract) =&gt; contract.id === 'github_pages' &amp;&amp; contract.risk === 'low'));</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 25 | <code>    assert.ok(contracts.some((contract) =&gt; contract.id === 'computer' &amp;&amp; contract.risk === 'high'));</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 26 | <code>    for (const toolId of ['spawn_agent', 'followup_task', 'wait_agent', 'list_agents', 'close_agent']) {</code> | 声明局部标识符 `toolId`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 27 | <code>        assert.ok(contracts.some((contract) =&gt; contract.id === toolId), `${toolId} contract is registered`);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 28 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 29 | <code>    const codexCollaborationTools = new Set(['spawn_agent', 'followup_task', 'wait_agent', 'list_agents', 'close_agent']);</code> | 声明局部标识符 `codexCollaborationTools`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 30 | <code>    assert.ok(contracts.every((contract) =&gt;</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 31 | <code>        codexCollaborationTools.has(contract.id) &#124;&#124; contract.returns?.properties?.content</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 32 | <code>    ));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 33 | <code>    assert.ok(contracts.every((contract) =&gt; contract.errors?.includes('invalid_tool_args')));</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 34 | <code>    assert.ok(contracts.every((contract) =&gt; contract.experience?.embodiedAction));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 35 | <code>    assert.ok(contracts.every((contract) =&gt; contract.experience?.userFacingVerb));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 36 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 37 | <code>    const validSpawnAgent = validateToolContract('spawn_agent', {</code> | 声明局部标识符 `validSpawnAgent`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 38 | <code>        task_name: 'mavuika_guide',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 39 | <code>        message: 'Research and produce the current guide.',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 40 | <code>        fork_turns: 'all'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 41 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 42 | <code>    assert.equal(validSpawnAgent.ok, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 43 | <code>    assert.equal(validSpawnAgent.contract.approval, 'never');</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 44 | <code>    const spawnContract = contracts.find((contract) =&gt; contract.id === 'spawn_agent');</code> | 声明局部标识符 `spawnContract`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 45 | <code>    assert.deepEqual(spawnContract.returns.required, ['task_name', 'nickname']);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 46 | <code>    assert.equal(spawnContract.returns.additionalProperties, false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 47 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 48 | <code>    const invalidSpawnAgent = validateToolContract('spawn_agent', {</code> | 声明局部标识符 `invalidSpawnAgent`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 49 | <code>        task_name: 'Mavuika-Guide',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 50 | <code>        message: 'Research the guide.',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 51 | <code>        unexpected: true</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 52 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 53 | <code>    assert.equal(invalidSpawnAgent.ok, false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 54 | <code>    assert.ok(invalidSpawnAgent.errors.some((error) =&gt; error.includes('task_name')));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 55 | <code>    assert.ok(invalidSpawnAgent.errors.some((error) =&gt; error.includes('unexpected')));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 56 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 57 | <code>    const validFollowupTask = validateToolContract('followup_task', {</code> | 声明局部标识符 `validFollowupTask`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 58 | <code>        target: 'mavuika_guide',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 59 | <code>        message: 'Verify the weapon ranking.'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 60 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 61 | <code>    assert.equal(validFollowupTask.ok, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 62 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 63 | <code>    const invalidWaitAgent = validateToolContract('wait_agent', { timeoutMs: 10_000 });</code> | 声明局部标识符 `invalidWaitAgent`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 64 | <code>    assert.equal(invalidWaitAgent.ok, false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 65 | <code>    assert.ok(invalidWaitAgent.errors.some((error) =&gt; error.includes('timeoutMs')));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 66 | <code>    const waitContract = contracts.find((contract) =&gt; contract.id === 'wait_agent');</code> | 声明局部标识符 `waitContract`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 67 | <code>    assert.deepEqual(waitContract.returns.required, ['message', 'timed_out']);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 68 | <code>    const listContract = contracts.find((contract) =&gt; contract.id === 'list_agents');</code> | 声明局部标识符 `listContract`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 69 | <code>    assert.deepEqual(listContract.returns.required, ['agents']);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 70 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 71 | <code>    const validRead = validateToolContract('read', { path: 'package.json' });</code> | 声明局部标识符 `validRead`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 72 | <code>    assert.equal(validRead.ok, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 73 | <code>    assert.equal(validRead.contract.mutates, false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 74 | <code>    assert.equal(validRead.contract.experience.userFacingVerb, '看一下文件');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 75 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 76 | <code>    const badRead = validateToolContract('read', {});</code> | 声明局部标识符 `badRead`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 77 | <code>    assert.equal(badRead.ok, false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 78 | <code>    assert.equal(badRead.status, 'invalid_tool_args');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 79 | <code>    assert.ok(badRead.errors.some((error) =&gt; error.includes('path')));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 80 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 81 | <code>    const badEmail = validateToolContract('email', { action: 'check_new' });</code> | 声明局部标识符 `badEmail`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 82 | <code>    assert.equal(badEmail.ok, false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 83 | <code>    assert.ok(badEmail.errors.some((error) =&gt; error.includes('one of')));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 84 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 85 | <code>    const validEmailReadNumericUid = validateToolContract('email', {</code> | 声明局部标识符 `validEmailReadNumericUid`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 86 | <code>        action: 'read',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 87 | <code>        uid: 2652</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 88 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 89 | <code>    assert.equal(validEmailReadNumericUid.ok, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 90 | <code>    assert.equal(validEmailReadNumericUid.args.uid, '2652');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 91 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 92 | <code>    const validEmailListStringLimit = validateToolContract('email', {</code> | 声明局部标识符 `validEmailListStringLimit`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 93 | <code>        action: 'list',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 94 | <code>        limit: '10',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 95 | <code>        filter: 'unread'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 96 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 97 | <code>    assert.equal(validEmailListStringLimit.ok, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 98 | <code>    assert.equal(validEmailListStringLimit.args.limit, 10);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 99 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 100 | <code>    const badMcpCall = validateToolContract('mcp_bridge', {</code> | 声明局部标识符 `badMcpCall`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 101 | <code>        action: 'call_tool',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 102 | <code>        server: 'fixture',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 103 | <code>        args: { text: 'hello' }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 104 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 105 | <code>    assert.equal(badMcpCall.ok, false);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 106 | <code>    assert.ok(badMcpCall.errors.some((error) =&gt; error.includes('requires tool')));</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 107 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 108 | <code>    const validMcpRead = validateToolContract('mcp_bridge', {</code> | 声明局部标识符 `validMcpRead`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 109 | <code>        action: 'read_resource',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 110 | <code>        server: 'fixture',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 111 | <code>        uri: 'fixture://note'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 112 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 113 | <code>    assert.equal(validMcpRead.ok, true);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 114 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 115 | <code>    const validMcpToolNameAlias = validateToolContract('mcp_bridge', {</code> | 声明局部标识符 `validMcpToolNameAlias`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 116 | <code>        action: 'call_tool',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 117 | <code>        server: 'fixture',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 118 | <code>        tool_name: 'echo',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 119 | <code>        arguments: { text: 'hello' }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 120 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 121 | <code>    assert.equal(validMcpToolNameAlias.ok, true);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 122 | <code>    assert.equal(validMcpToolNameAlias.args.tool, 'echo');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 123 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 124 | <code>    const validMcpToolArgsAlias = validateToolContract('mcp_bridge', {</code> | 声明局部标识符 `validMcpToolArgsAlias`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 125 | <code>        action: 'call_tool',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 126 | <code>        server: 'fixture',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 127 | <code>        tool: 'echo',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 128 | <code>        tool_args: { text: 'hello' }</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 129 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 130 | <code>    assert.equal(validMcpToolArgsAlias.ok, true);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 131 | <code>    assert.deepEqual(validMcpToolArgsAlias.args.args, { text: 'hello' });</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 132 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 133 | <code>    const validMcpHealth = validateToolContract('mcp_bridge', {</code> | 声明局部标识符 `validMcpHealth`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 134 | <code>        action: 'health_check',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 135 | <code>        server: 'fixture'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 136 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 137 | <code>    assert.equal(validMcpHealth.ok, true);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 138 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 139 | <code>    const validToolSearch = validateToolContract('tool_search', {</code> | 声明局部标识符 `validToolSearch`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 140 | <code>        query: 'playwright wait selector',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 141 | <code>        limit: 5</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 142 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 143 | <code>    assert.equal(validToolSearch.ok, true);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 144 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 145 | <code>    const validWebSearch = validateToolContract('web_search', {</code> | 声明局部标识符 `validWebSearch`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 146 | <code>        query: 'official release date',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 147 | <code>        maxResults: 5,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 148 | <code>        search_context_size: 'medium'</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 149 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 150 | <code>    assert.equal(validWebSearch.ok, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 151 | <code>    const validWebScreenshot = validateToolContract('web_run', {</code> | 声明局部标识符 `validWebScreenshot`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 152 | <code>        screenshot: [{</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 153 | <code>            ref_id: 'turn0view0',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 154 | <code>            detail: 'original'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 155 | <code>        }]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 156 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 157 | <code>    assert.equal(validWebScreenshot.ok, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 158 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 159 | <code>    const validGitHubPages = validateToolContract('github_pages', {</code> | 声明局部标识符 `validGitHubPages`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 160 | <code>        action: 'diagnose_publish',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 161 | <code>        targetPath: 'about-ailis.html',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 162 | <code>        skipNetwork: true</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 163 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 164 | <code>    assert.equal(validGitHubPages.ok, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 165 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 166 | <code>    const validArtifactCompute = validateToolContract('artifact_compute', {</code> | 声明局部标识符 `validArtifactCompute`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 167 | <code>        artifactId: 'ctx-spreadsheet-demo',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 168 | <code>        sheet: 'Map'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 169 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 170 | <code>    assert.equal(validArtifactCompute.ok, true);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 171 | <code>    assert.equal(validArtifactCompute.args.action, 'profile');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 172 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 173 | <code>    const validArtifactToolsPlan = validateToolContract('artifact_tools', {</code> | 声明局部标识符 `validArtifactToolsPlan`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 174 | <code>        action: 'plan_import',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 175 | <code>        path: 'report.pdf',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 176 | <code>        requiredCapabilities: ['load', 'inspect', 'render']</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 177 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 178 | <code>    assert.equal(validArtifactToolsPlan.ok, true);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 179 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 180 | <code>    const validArtifactImport = validateToolContract('artifact_import', {</code> | 声明局部标识符 `validArtifactImport`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 181 | <code>        path: 'inventory.xlsx',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 182 | <code>        parserId: 'table'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 183 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 184 | <code>    assert.equal(validArtifactImport.ok, true);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 185 | <code>    assert.equal(validArtifactImport.args.action, 'import');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 186 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 187 | <code>    const badArtifactImport = validateToolContract('artifact_import', {});</code> | 声明局部标识符 `badArtifactImport`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 188 | <code>    assert.equal(badArtifactImport.ok, false);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 189 | <code>    assert.ok(badArtifactImport.errors.some((error) =&gt; error.includes('requires path')));</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 190 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 191 | <code>    const badArtifactCompute = validateToolContract('artifact_compute', {</code> | 声明局部标识符 `badArtifactCompute`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 192 | <code>        action: 'find_path',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 193 | <code>        sheet: 'Map'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 194 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 195 | <code>    assert.equal(badArtifactCompute.ok, false);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 196 | <code>    assert.ok(badArtifactCompute.errors.some((error) =&gt; error.includes('requires artifactId')));</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 197 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 198 | <code>    const badToolSearch = validateToolContract('tool_search', {});</code> | 声明局部标识符 `badToolSearch`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 199 | <code>    assert.equal(badToolSearch.ok, false);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 200 | <code>    assert.ok(badToolSearch.errors.some((error) =&gt; error.includes('requires query')));</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 201 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 202 | <code>    const badWebSearch = validateToolContract('web_search', {});</code> | 声明局部标识符 `badWebSearch`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 203 | <code>    assert.equal(badWebSearch.ok, false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 204 | <code>    assert.ok(badWebSearch.errors.some((error) =&gt; error.includes('requires query')));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 205 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 206 | <code>    const validWebRun = validateToolContract('web_run', {</code> | 声明局部标识符 `validWebRun`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 207 | <code>        search_query: [{ q: 'Codex app-server tool lifecycle' }],</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 208 | <code>        response_length: 'medium'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 209 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 210 | <code>    assert.equal(validWebRun.ok, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 211 | <code>    assert.equal(contracts.find((contract) =&gt; contract.id === 'web_run').schema.minProperties, 1);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 212 | <code>    const webRunContract = contracts.find((contract) =&gt; contract.id === 'web_run');</code> | 声明局部标识符 `webRunContract`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 213 | <code>    assert.equal(webRunContract.schema.properties.search_query.items.properties.q.maxLength, 240);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 214 | <code>    assert.equal(webRunContract.schema.properties.search_query.items.properties.domains.maxItems, 8);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 215 | <code>    const emptyWebRun = validateToolContract('web_run', {});</code> | 声明局部标识符 `emptyWebRun`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 216 | <code>    assert.equal(emptyWebRun.ok, false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 217 | <code>    assert.ok(emptyWebRun.errors.some((error) =&gt; error.includes('exactly one non-empty operation')));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 218 | <code>    const mixedWebRun = validateToolContract('web_run', {</code> | 声明局部标识符 `mixedWebRun`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 219 | <code>        search_query: [{ q: 'query' }],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 220 | <code>        open: [{ ref_id: 'turn0search0' }]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 221 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 222 | <code>    assert.equal(mixedWebRun.ok, false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 223 | <code>    const unsupportedWebRun = validateToolContract('web_run', {</code> | 声明局部标识符 `unsupportedWebRun`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 224 | <code>        image_query: [{ q: 'unsupported' }]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 225 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 226 | <code>    assert.equal(unsupportedWebRun.ok, false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 227 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 228 | <code>    const wrongArtifactOwner = validateToolContract('artifact_query', {</code> | 声明局部标识符 `wrongArtifactOwner`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 229 | <code>        action: 'summary',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 230 | <code>        artifactHandle: {</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 231 | <code>            owner: 'artifact_tools',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 232 | <code>            tool: 'artifact_tools',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 233 | <code>            sessionId: 'arts-demo',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 234 | <code>            artifactId: 'art_demo'</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 235 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 236 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 237 | <code>    assert.equal(wrongArtifactOwner.ok, false);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 238 | <code>    assert.ok(wrongArtifactOwner.errors.some((error) =&gt; error.includes('owned by artifact_tools')));</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 239 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 240 | <code>    const badMcpPrompt = validateToolContract('mcp_bridge', {</code> | 声明局部标识符 `badMcpPrompt`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 241 | <code>        action: 'get_prompt',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 242 | <code>        server: 'fixture'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 243 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 244 | <code>    assert.equal(badMcpPrompt.ok, false);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 245 | <code>    assert.ok(badMcpPrompt.errors.some((error) =&gt; error.includes('requires prompt')));</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 246 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 247 | <code>    const validDoctorObservation = validateToolContract('tool_doctor', {</code> | 声明局部标识符 `validDoctorObservation`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 248 | <code>        action: 'record_observation',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 249 | <code>        tool: 'mcp_bridge',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 250 | <code>        status: 'timeout',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 251 | <code>        latencyMs: 25000,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 252 | <code>        errorCode: 'timeout'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 253 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 254 | <code>    assert.equal(validDoctorObservation.ok, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 255 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 256 | <code>    const badRepair = validateToolContract('tool_doctor', {</code> | 声明局部标识符 `badRepair`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 257 | <code>        action: 'propose_repair',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 258 | <code>        tool: 'mcp_bridge'</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 259 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 260 | <code>    assert.equal(badRepair.ok, false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 261 | <code>    assert.ok(badRepair.errors.some((error) =&gt; error.includes('requires title')));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 262 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 263 | <code>    const validCapabilityPlan = validateToolContract('capability_manager', {</code> | 声明局部标识符 `validCapabilityPlan`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 264 | <code>        action: 'plan_install',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 265 | <code>        request: 'install github MCP',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 266 | <code>        sourceKind: 'github_mcp',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 267 | <code>        githubRepo: 'https://github.com/example/mcp.git'</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 268 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 269 | <code>    assert.equal(validCapabilityPlan.ok, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 270 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 271 | <code>    const validCandidateSearch = validateToolContract('capability_manager', {</code> | 声明局部标识符 `validCandidateSearch`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 272 | <code>        action: 'search_tool_candidates',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 273 | <code>        query: 'ocr pdf tools'</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 274 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 275 | <code>    assert.equal(validCandidateSearch.ok, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 276 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 277 | <code>    const validCandidatePlan = validateToolContract('capability_manager', {</code> | 声明局部标识符 `validCandidatePlan`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 278 | <code>        action: 'plan_mcp_candidate',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 279 | <code>        candidateId: 'mcp-registry:io-example-docs:1.0.0'</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 280 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 281 | <code>    assert.equal(validCandidatePlan.ok, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 282 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 283 | <code>    const validLearningRecord = validateToolContract('capability_manager', {</code> | 声明局部标识符 `validLearningRecord`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 284 | <code>        action: 'record_tool_outcome',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 285 | <code>        taskText: 'read a pdf',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 286 | <code>        toolId: 'mcp__docs__read',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 287 | <code>        success: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 288 | <code>        score: 1</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 289 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 290 | <code>    assert.equal(validLearningRecord.ok, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 291 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 292 | <code>    const badCapabilityRepair = validateToolContract('capability_manager', {</code> | 声明局部标识符 `badCapabilityRepair`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 293 | <code>        action: 'execute_repair'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 294 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 295 | <code>    assert.equal(badCapabilityRepair.ok, false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 296 | <code>    assert.ok(badCapabilityRepair.errors.some((error) =&gt; error.includes('requires candidateDiff')));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 297 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 298 | <code>    const validSelfDebugCase = validateToolContract('self_debugger', {</code> | 声明局部标识符 `validSelfDebugCase`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 299 | <code>        action: 'open_case',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 300 | <code>        bugReport: 'AILIS failed to read the latest tool result',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 301 | <code>        affectedCapability: 'agent_loop'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 302 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 303 | <code>    assert.equal(validSelfDebugCase.ok, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 304 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 305 | <code>    const badSelfDebugCase = validateToolContract('self_debugger', {</code> | 声明局部标识符 `badSelfDebugCase`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 306 | <code>        action: 'open_case'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 307 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 308 | <code>    assert.equal(badSelfDebugCase.ok, false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 309 | <code>    assert.ok(badSelfDebugCase.errors.some((error) =&gt; error.includes('requires bugReport')));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 310 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 311 | <code>    const validSelfDebugApply = validateToolContract('self_debugger', {</code> | 声明局部标识符 `validSelfDebugApply`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 312 | <code>        action: 'apply_patch',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 313 | <code>        caseId: 'debug-123'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 314 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 315 | <code>    assert.equal(validSelfDebugApply.ok, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 316 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 317 | <code>    const validSelfEvolutionAnalyze = validateToolContract('self_evolution', {</code> | 声明局部标识符 `validSelfEvolutionAnalyze`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 318 | <code>        action: 'analyze',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 319 | <code>        taskText: '以后按我的偏好优化 AILIS'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 320 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 321 | <code>    assert.equal(validSelfEvolutionAnalyze.ok, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 322 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 323 | <code>    const badSelfEvolutionApply = validateToolContract('self_evolution', {</code> | 声明局部标识符 `badSelfEvolutionApply`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 324 | <code>        action: 'apply_proposal'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 325 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 326 | <code>    assert.equal(badSelfEvolutionApply.ok, false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 327 | <code>    assert.ok(badSelfEvolutionApply.errors.some((error) =&gt; error.includes('requires id')));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 328 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 329 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 330 | <code>test('AILIS tool contracts generate prompt and summary text from the same source', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 331 | <code>    const emailPrompt = getToolContractPromptText('email');</code> | 声明局部标识符 `emailPrompt`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 332 | <code>    assert.match(emailPrompt, /TOOL CONTRACT email@v/);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 333 | <code>    assert.match(emailPrompt, /input_schema/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 334 | <code>    assert.match(emailPrompt, /return_schema/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 335 | <code>    assert.match(emailPrompt, /error_codes/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 336 | <code>    assert.match(emailPrompt, /experience=/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 337 | <code>    assert.match(emailPrompt, /看看邮箱/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 338 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 339 | <code>    const combined = buildToolContractsPrompt(['mcp_bridge', 'vision.capture_context']);</code> | 声明局部标识符 `combined`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 340 | <code>    assert.match(combined, /health_check/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 341 | <code>    assert.match(combined, /vision\.capture_context/);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 342 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 343 | <code>    const summaries = listToolContractSummaries(['mcp_bridge']);</code> | 声明局部标识符 `summaries`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 344 | <code>    assert.equal(summaries[0].id, 'mcp_bridge');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 345 | <code>    assert.ok(summaries[0].actions.includes('list_prompts'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 346 | <code>    assert.equal(summaries[0].experience.embodiedAction, 'use_external_tool');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 347 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 348 | <code>    const toolSearchPrompt = getToolContractPromptText('tool_search');</code> | 声明局部标识符 `toolSearchPrompt`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 349 | <code>    assert.match(toolSearchPrompt, /tool_search/);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 350 | <code>    assert.match(toolSearchPrompt, /query/);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 351 | <code>    assert.match(toolSearchPrompt, /deferred tools/i);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 352 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 353 | <code>    const artifactComputePrompt = getToolContractPromptText('artifact_compute');</code> | 声明局部标识符 `artifactComputePrompt`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 354 | <code>    assert.match(artifactComputePrompt, /artifact_compute/);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 355 | <code>    assert.match(artifactComputePrompt, /find_path/);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 356 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 357 | <code>    const artifactToolsPrompt = getToolContractPromptText('artifact_tools');</code> | 声明局部标识符 `artifactToolsPrompt`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 358 | <code>    assert.match(artifactToolsPrompt, /artifact_tools/);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 359 | <code>    assert.match(artifactToolsPrompt, /plan_import/);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 360 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 361 | <code>    const artifactImportPrompt = getToolContractPromptText('artifact_import');</code> | 声明局部标识符 `artifactImportPrompt`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 362 | <code>    assert.match(artifactImportPrompt, /artifact_import/);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 363 | <code>    assert.match(artifactImportPrompt, /parserId/);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 364 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 365 | <code>    const doctorPrompt = getToolContractPromptText('tool_doctor');</code> | 声明局部标识符 `doctorPrompt`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 366 | <code>    assert.match(doctorPrompt, /discover_mcp/);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 367 | <code>    assert.match(doctorPrompt, /检查工具健康/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 368 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 369 | <code>    const capabilityPrompt = getToolContractPromptText('capability_manager');</code> | 声明局部标识符 `capabilityPrompt`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 370 | <code>    assert.match(capabilityPrompt, /install_capability/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 371 | <code>    assert.match(capabilityPrompt, /安装和修复能力/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 372 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 373 | <code>    const selfDebuggerPrompt = getToolContractPromptText('self_debugger');</code> | 声明局部标识符 `selfDebuggerPrompt`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 374 | <code>    assert.match(selfDebuggerPrompt, /collect_evidence/);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 375 | <code>    assert.match(selfDebuggerPrompt, /自我排查问题/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 376 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 377 | <code>    const selfEvolutionPrompt = getToolContractPromptText('self_evolution');</code> | 声明局部标识符 `selfEvolutionPrompt`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 378 | <code>    assert.match(selfEvolutionPrompt, /apply_proposal/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 379 | <code>    assert.match(selfEvolutionPrompt, /分析并优化自己/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 380 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 381 | <code>    assert.equal(getToolContractPromptText('subagents'), '');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 382 | <code>    assert.equal(listToolContracts().some((contract) =&gt; contract.id === 'subagents'), false);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具契约层：定义 schema、风险、审批、错误与执行约束。”这一文件职责。 |
| 383 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
