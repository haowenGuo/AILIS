# tests/ailis-skills.test.mjs 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：自动化测试：验证 ailis-skills 的契约与回归行为。
- 文件类型：`source-code`
- 原始行数：65
- SHA-256：`deedafbd2b9ea717f3843ad80947b6e654b2cc4f11d38b10224134d977d637fd`
- 可运行副本：[打开源文件](../../../source/tests/ailis-skills.test.mjs)
- 依赖：`node:assert/strict`、`node:module`、`node:test`、`../electron/ailis-skills.cjs`、`../electron/ailis-tool-contracts.cjs`
- 主要符号：`require`、`skills`、`mcp`、`context`、`capabilityContext`、`selfDebuggerContext`、`selfEvolutionContext`、`githubPagesContext`

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code>import assert from 'node:assert/strict';</code> | 导入依赖 `node:assert/strict`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-skills 的契约与回归行为。”这一文件职责。 |
| 2 | <code>import { createRequire } from 'node:module';</code> | 导入依赖 `node:module`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-skills 的契约与回归行为。”这一文件职责。 |
| 3 | <code>import test from 'node:test';</code> | 导入依赖 `node:test`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-skills 的契约与回归行为。”这一文件职责。 |
| 4 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5 | <code>const require = createRequire(import.meta.url);</code> | 声明局部标识符 `require`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-skills 的契约与回归行为。”这一文件职责。 |
| 6 | <code>const {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-skills 的契约与回归行为。”这一文件职责。 |
| 7 | <code>    buildAILISSkillContextText,</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-skills 的契约与回归行为。”这一文件职责。 |
| 8 | <code>    getAILISSkill,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-skills 的契约与回归行为。”这一文件职责。 |
| 9 | <code>    listAILISSkillSummaries</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-skills 的契约与回归行为。”这一文件职责。 |
| 10 | <code>} = require('../electron/ailis-skills.cjs');</code> | 导入依赖 `../electron/ailis-skills.cjs`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-skills 的契约与回归行为。”这一文件职责。 |
| 11 | <code>const {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-skills 的契约与回归行为。”这一文件职责。 |
| 12 | <code>    getToolContract,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-skills 的契约与回归行为。”这一文件职责。 |
| 13 | <code>    getToolContractPromptText</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-skills 的契约与回归行为。”这一文件职责。 |
| 14 | <code>} = require('../electron/ailis-tool-contracts.cjs');</code> | 导入依赖 `../electron/ailis-tool-contracts.cjs`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-skills 的契约与回归行为。”这一文件职责。 |
| 15 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 16 | <code>test('AILIS skills load from SKILL.md packages and reference contracted tools', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-skills 的契约与回归行为。”这一文件职责。 |
| 17 | <code>    const skills = listAILISSkillSummaries();</code> | 声明局部标识符 `skills`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-skills 的契约与回归行为。”这一文件职责。 |
| 18 | <code>    assert.ok(skills.length &gt;= 6);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-skills 的契约与回归行为。”这一文件职责。 |
| 19 | <code>    assert.ok(skills.some((skill) =&gt; skill.id === 'vision' &amp;&amp; skill.source === 'skill_file'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-skills 的契约与回归行为。”这一文件职责。 |
| 20 | <code>    assert.ok(skills.some((skill) =&gt; skill.id === 'mcp_bridge'));</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-skills 的契约与回归行为。”这一文件职责。 |
| 21 | <code>    assert.ok(skills.some((skill) =&gt; skill.id === 'capability_manager'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-skills 的契约与回归行为。”这一文件职责。 |
| 22 | <code>    assert.ok(skills.some((skill) =&gt; skill.id === 'self_debugger'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-skills 的契约与回归行为。”这一文件职责。 |
| 23 | <code>    assert.ok(skills.some((skill) =&gt; skill.id === 'self_evolution' &amp;&amp; skill.source === 'skill_file'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-skills 的契约与回归行为。”这一文件职责。 |
| 24 | <code>    assert.ok(skills.some((skill) =&gt; skill.id === 'github_pages' &amp;&amp; skill.source === 'skill_file'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-skills 的契约与回归行为。”这一文件职责。 |
| 25 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 26 | <code>    for (const skill of skills) {</code> | 声明局部标识符 `skill`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-skills 的契约与回归行为。”这一文件职责。 |
| 27 | <code>        for (const toolId of skill.tools &#124;&#124; []) {</code> | 声明局部标识符 `toolId`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-skills 的契约与回归行为。”这一文件职责。 |
| 28 | <code>            assert.ok(getToolContract(toolId), `${skill.id} references an uncontracted tool: ${toolId}`);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-skills 的契约与回归行为。”这一文件职责。 |
| 29 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 30 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 31 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 32 | <code>    const mcp = getAILISSkill('mcp_bridge');</code> | 声明局部标识符 `mcp`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-skills 的契约与回归行为。”这一文件职责。 |
| 33 | <code>    assert.equal(mcp.id, 'mcp_bridge');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-skills 的契约与回归行为。”这一文件职责。 |
| 34 | <code>    assert.ok(mcp.tools.includes('mcp_bridge'));</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-skills 的契约与回归行为。”这一文件职责。 |
| 35 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 36 | <code>    const context = buildAILISSkillContextText('mcp_bridge');</code> | 声明局部标识符 `context`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-skills 的契约与回归行为。”这一文件职责。 |
| 37 | <code>    assert.match(context, /SKILL PACKAGE mcp_bridge/);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-skills 的契约与回归行为。”这一文件职责。 |
| 38 | <code>    assert.doesNotMatch(context, /TOOL CONTRACT mcp_bridge@v/);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-skills 的契约与回归行为。”这一文件职责。 |
| 39 | <code>    assert.match(context, /health_check/);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-skills 的契约与回归行为。”这一文件职责。 |
| 40 | <code>    assert.match(context, /mcp__ailis_research__web_fetch/);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-skills 的契约与回归行为。”这一文件职责。 |
| 41 | <code>    assert.doesNotMatch(context, /先 `list_servers`/);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-skills 的契约与回归行为。”这一文件职责。 |
| 42 | <code>    assert.doesNotMatch(context, /调用 `call_tool` 前/);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-skills 的契约与回归行为。”这一文件职责。 |
| 43 | <code>    assert.match(getToolContractPromptText('mcp_bridge'), /TOOL CONTRACT mcp_bridge@v/);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-skills 的契约与回归行为。”这一文件职责。 |
| 44 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 45 | <code>    const capabilityContext = buildAILISSkillContextText('capability_manager');</code> | 声明局部标识符 `capabilityContext`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-skills 的契约与回归行为。”这一文件职责。 |
| 46 | <code>    assert.doesNotMatch(capabilityContext, /TOOL CONTRACT capability_manager@v/);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-skills 的契约与回归行为。”这一文件职责。 |
| 47 | <code>    assert.match(capabilityContext, /install_capability/);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-skills 的契约与回归行为。”这一文件职责。 |
| 48 | <code>    assert.match(getToolContractPromptText('capability_manager'), /TOOL CONTRACT capability_manager@v/);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-skills 的契约与回归行为。”这一文件职责。 |
| 49 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 50 | <code>    const selfDebuggerContext = buildAILISSkillContextText('self_debugger');</code> | 声明局部标识符 `selfDebuggerContext`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-skills 的契约与回归行为。”这一文件职责。 |
| 51 | <code>    assert.doesNotMatch(selfDebuggerContext, /TOOL CONTRACT self_debugger@v/);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-skills 的契约与回归行为。”这一文件职责。 |
| 52 | <code>    assert.match(selfDebuggerContext, /validate_patch/);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-skills 的契约与回归行为。”这一文件职责。 |
| 53 | <code>    assert.match(getToolContractPromptText('self_debugger'), /TOOL CONTRACT self_debugger@v/);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-skills 的契约与回归行为。”这一文件职责。 |
| 54 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 55 | <code>    const selfEvolutionContext = buildAILISSkillContextText('self_evolution');</code> | 声明局部标识符 `selfEvolutionContext`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-skills 的契约与回归行为。”这一文件职责。 |
| 56 | <code>    assert.doesNotMatch(selfEvolutionContext, /TOOL CONTRACT self_evolution@v/);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-skills 的契约与回归行为。”这一文件职责。 |
| 57 | <code>    assert.match(selfEvolutionContext, /analyze/);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-skills 的契约与回归行为。”这一文件职责。 |
| 58 | <code>    assert.match(selfEvolutionContext, /不把用户引导去控制面板/);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-skills 的契约与回归行为。”这一文件职责。 |
| 59 | <code>    assert.match(getToolContractPromptText('self_evolution'), /TOOL CONTRACT self_evolution@v/);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-skills 的契约与回归行为。”这一文件职责。 |
| 60 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 61 | <code>    const githubPagesContext = buildAILISSkillContextText('github_pages');</code> | 声明局部标识符 `githubPagesContext`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-skills 的契约与回归行为。”这一文件职责。 |
| 62 | <code>    assert.match(githubPagesContext, /GITHUB PAGES SKILL/);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-skills 的契约与回归行为。”这一文件职责。 |
| 63 | <code>    assert.match(githubPagesContext, /github_pages\.diagnose_publish/);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-skills 的契约与回归行为。”这一文件职责。 |
| 64 | <code>    assert.match(getToolContractPromptText('github_pages'), /TOOL CONTRACT github_pages@v/);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-skills 的契约与回归行为。”这一文件职责。 |
| 65 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
