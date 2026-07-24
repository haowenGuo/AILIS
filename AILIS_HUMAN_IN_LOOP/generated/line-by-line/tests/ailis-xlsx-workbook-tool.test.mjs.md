# tests/ailis-xlsx-workbook-tool.test.mjs 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：自动化测试：验证 ailis-xlsx-workbook-tool 的契约与回归行为。
- 文件类型：`source-code`
- 原始行数：190
- SHA-256：`55e3aa22d887119d6cd53c7a32b1e47b9c4f0b085ee968727dfb37c6aea78d9a`
- 可运行副本：[打开源文件](../../../source/tests/ailis-xlsx-workbook-tool.test.mjs)
- 依赖：`node:assert/strict`、`node:fs/promises`、`node:os`、`node:path`、`node:test`、`node:module`、`exceljs`、`../electron/ailis-xlsx-workbook-tool.cjs`、`../electron/ailis-context-artifact-store.cjs`
- 主要符号：`require`、`ExcelJS`、`dir`、`filePath`、`auditDir`、`contextArtifactStore`、`workbook`、`sheet`、`result`、`summary`、`range`、`coveredRange`、`profile`、`pathResult`、`nestedPathResult`、`ruleTextPathResult`、`search`、`record`、`guarded`

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code>import assert from 'node:assert/strict';</code> | 导入依赖 `node:assert/strict`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-xlsx-workbook-tool 的契约与回归行为。”这一文件职责。 |
| 2 | <code>import fsp from 'node:fs/promises';</code> | 导入依赖 `node:fs/promises`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-xlsx-workbook-tool 的契约与回归行为。”这一文件职责。 |
| 3 | <code>import os from 'node:os';</code> | 导入依赖 `node:os`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-xlsx-workbook-tool 的契约与回归行为。”这一文件职责。 |
| 4 | <code>import path from 'node:path';</code> | 导入依赖 `node:path`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-xlsx-workbook-tool 的契约与回归行为。”这一文件职责。 |
| 5 | <code>import test from 'node:test';</code> | 导入依赖 `node:test`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-xlsx-workbook-tool 的契约与回归行为。”这一文件职责。 |
| 6 | <code>import { createRequire } from 'node:module';</code> | 导入依赖 `node:module`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-xlsx-workbook-tool 的契约与回归行为。”这一文件职责。 |
| 7 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 8 | <code>const require = createRequire(import.meta.url);</code> | 声明局部标识符 `require`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-xlsx-workbook-tool 的契约与回归行为。”这一文件职责。 |
| 9 | <code>const ExcelJS = require('exceljs');</code> | 导入依赖 `exceljs`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-xlsx-workbook-tool 的契约与回归行为。”这一文件职责。 |
| 10 | <code>const { executeReadXlsxWorkbookTool } = require('../electron/ailis-xlsx-workbook-tool.cjs');</code> | 导入依赖 `../electron/ailis-xlsx-workbook-tool.cjs`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-xlsx-workbook-tool 的契约与回归行为。”这一文件职责。 |
| 11 | <code>const { AILISContextArtifactStore } = require('../electron/ailis-context-artifact-store.cjs');</code> | 导入依赖 `../electron/ailis-context-artifact-store.cjs`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-xlsx-workbook-tool 的契约与回归行为。”这一文件职责。 |
| 12 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 13 | <code>test('read_xlsx_workbook reads values, fills, formulas, and merged ranges', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-xlsx-workbook-tool 的契约与回归行为。”这一文件职责。 |
| 14 | <code>    const dir = await fsp.mkdtemp(path.join(os.tmpdir(), 'ailis-xlsx-tool-'));</code> | 声明局部标识符 `dir`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-xlsx-workbook-tool 的契约与回归行为。”这一文件职责。 |
| 15 | <code>    const filePath = path.join(dir, 'colored-map.xlsx');</code> | 声明局部标识符 `filePath`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-xlsx-workbook-tool 的契约与回归行为。”这一文件职责。 |
| 16 | <code>    const auditDir = path.join(dir, '.audit');</code> | 声明局部标识符 `auditDir`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-xlsx-workbook-tool 的契约与回归行为。”这一文件职责。 |
| 17 | <code>    const contextArtifactStore = new AILISContextArtifactStore({</code> | 声明局部标识符 `contextArtifactStore`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-xlsx-workbook-tool 的契约与回归行为。”这一文件职责。 |
| 18 | <code>        rootDir: path.join(auditDir, 'context-artifacts')</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-xlsx-workbook-tool 的契约与回归行为。”这一文件职责。 |
| 19 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 20 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 21 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 22 | <code>        const workbook = new ExcelJS.Workbook();</code> | 声明局部标识符 `workbook`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-xlsx-workbook-tool 的契约与回归行为。”这一文件职责。 |
| 23 | <code>        const sheet = workbook.addWorksheet('Map');</code> | 声明局部标识符 `sheet`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-xlsx-workbook-tool 的契约与回归行为。”这一文件职责。 |
| 24 | <code>        sheet.getCell('A1').value = 'START';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-xlsx-workbook-tool 的契约与回归行为。”这一文件职责。 |
| 25 | <code>        sheet.getCell('B1').fill = {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-xlsx-workbook-tool 的契约与回归行为。”这一文件职责。 |
| 26 | <code>            type: 'pattern',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-xlsx-workbook-tool 的契约与回归行为。”这一文件职责。 |
| 27 | <code>            pattern: 'solid',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-xlsx-workbook-tool 的契约与回归行为。”这一文件职责。 |
| 28 | <code>            fgColor: { argb: 'FF0099FF' }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-xlsx-workbook-tool 的契约与回归行为。”这一文件职责。 |
| 29 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 30 | <code>        sheet.getCell('C2').value = 'END';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-xlsx-workbook-tool 的契约与回归行为。”这一文件职责。 |
| 31 | <code>        sheet.getCell('C2').fill = {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-xlsx-workbook-tool 的契约与回归行为。”这一文件职责。 |
| 32 | <code>            type: 'pattern',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-xlsx-workbook-tool 的契约与回归行为。”这一文件职责。 |
| 33 | <code>            pattern: 'solid',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-xlsx-workbook-tool 的契约与回归行为。”这一文件职责。 |
| 34 | <code>            fgColor: { argb: 'FF92D050' }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-xlsx-workbook-tool 的契约与回归行为。”这一文件职责。 |
| 35 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 36 | <code>        sheet.getCell('B2').fill = {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-xlsx-workbook-tool 的契约与回归行为。”这一文件职责。 |
| 37 | <code>            type: 'pattern',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-xlsx-workbook-tool 的契约与回归行为。”这一文件职责。 |
| 38 | <code>            pattern: 'solid',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-xlsx-workbook-tool 的契约与回归行为。”这一文件职责。 |
| 39 | <code>            fgColor: { argb: 'FFF478A7' }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-xlsx-workbook-tool 的契约与回归行为。”这一文件职责。 |
| 40 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 41 | <code>        sheet.getCell('A2').value = 1;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-xlsx-workbook-tool 的契约与回归行为。”这一文件职责。 |
| 42 | <code>        sheet.getCell('A3').value = 2;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-xlsx-workbook-tool 的契约与回归行为。”这一文件职责。 |
| 43 | <code>        sheet.getCell('F1').value = { formula: 'SUM(A2:A3)', result: 3 };</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-xlsx-workbook-tool 的契约与回归行为。”这一文件职责。 |
| 44 | <code>        sheet.mergeCells('D4:E4');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-xlsx-workbook-tool 的契约与回归行为。”这一文件职责。 |
| 45 | <code>        sheet.getCell('D4').value = 'merged-note';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-xlsx-workbook-tool 的契约与回归行为。”这一文件职责。 |
| 46 | <code>        await workbook.xlsx.writeFile(filePath);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-xlsx-workbook-tool 的契约与回归行为。”这一文件职责。 |
| 47 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 48 | <code>        const result = await executeReadXlsxWorkbookTool(</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-xlsx-workbook-tool 的契约与回归行为。”这一文件职责。 |
| 49 | <code>            {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-xlsx-workbook-tool 的契约与回归行为。”这一文件职责。 |
| 50 | <code>                path: filePath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-xlsx-workbook-tool 的契约与回归行为。”这一文件职责。 |
| 51 | <code>                sheet: 'Map',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-xlsx-workbook-tool 的契约与回归行为。”这一文件职责。 |
| 52 | <code>                maxRows: 6,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-xlsx-workbook-tool 的契约与回归行为。”这一文件职责。 |
| 53 | <code>                maxCols: 6,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-xlsx-workbook-tool 的契约与回归行为。”这一文件职责。 |
| 54 | <code>                includeStyles: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-xlsx-workbook-tool 的契约与回归行为。”这一文件职责。 |
| 55 | <code>                includeFormulas: true</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-xlsx-workbook-tool 的契约与回归行为。”这一文件职责。 |
| 56 | <code>            },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 57 | <code>            {},</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-xlsx-workbook-tool 的契约与回归行为。”这一文件职责。 |
| 58 | <code>            {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-xlsx-workbook-tool 的契约与回归行为。”这一文件职责。 |
| 59 | <code>                workspaceDir: dir,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-xlsx-workbook-tool 的契约与回归行为。”这一文件职责。 |
| 60 | <code>                workspaceRoot: dir,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-xlsx-workbook-tool 的契约与回归行为。”这一文件职责。 |
| 61 | <code>                projectRoot: dir,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-xlsx-workbook-tool 的契约与回归行为。”这一文件职责。 |
| 62 | <code>                auditDir,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-xlsx-workbook-tool 的契约与回归行为。”这一文件职责。 |
| 63 | <code>                contextArtifactStore</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-xlsx-workbook-tool 的契约与回归行为。”这一文件职责。 |
| 64 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 65 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 66 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 67 | <code>        assert.equal(result.isError, false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-xlsx-workbook-tool 的契约与回归行为。”这一文件职责。 |
| 68 | <code>        assert.match(result.content[0].text, /XLSX_WORKBOOK_READ_COMPLETE/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-xlsx-workbook-tool 的契约与回归行为。”这一文件职责。 |
| 69 | <code>        assert.match(result.content[0].text, /fillColors=.*0099FF/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-xlsx-workbook-tool 的契约与回归行为。”这一文件职责。 |
| 70 | <code>        assert.doesNotMatch(result.content[0].text, /fullJsonPath/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-xlsx-workbook-tool 的契约与回归行为。”这一文件职责。 |
| 71 | <code>        assert.ok(result.structuredContent.artifact.artifactId);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-xlsx-workbook-tool 的契约与回归行为。”这一文件职责。 |
| 72 | <code>        assert.equal(result.details.artifactId, result.structuredContent.artifact.artifactId);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-xlsx-workbook-tool 的契约与回归行为。”这一文件职责。 |
| 73 | <code>        assert.equal(result.structuredContent.observationContract.reasoning_ready, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-xlsx-workbook-tool 的契约与回归行为。”这一文件职责。 |
| 74 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 75 | <code>        const summary = await contextArtifactStore.execute({</code> | 声明局部标识符 `summary`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-xlsx-workbook-tool 的契约与回归行为。”这一文件职责。 |
| 76 | <code>            action: 'summary',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-xlsx-workbook-tool 的契约与回归行为。”这一文件职责。 |
| 77 | <code>            artifactId: result.details.artifactId</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-xlsx-workbook-tool 的契约与回归行为。”这一文件职责。 |
| 78 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 79 | <code>        assert.equal(summary.isError, false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-xlsx-workbook-tool 的契约与回归行为。”这一文件职责。 |
| 80 | <code>        assert.match(summary.content[0].text, /artifact_query actions/);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-xlsx-workbook-tool 的契约与回归行为。”这一文件职责。 |
| 81 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 82 | <code>        const range = await contextArtifactStore.execute({</code> | 声明局部标识符 `range`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-xlsx-workbook-tool 的契约与回归行为。”这一文件职责。 |
| 83 | <code>            action: 'range',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-xlsx-workbook-tool 的契约与回归行为。”这一文件职责。 |
| 84 | <code>            artifactId: result.details.artifactId,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-xlsx-workbook-tool 的契约与回归行为。”这一文件职责。 |
| 85 | <code>            sheet: 'Map',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-xlsx-workbook-tool 的契约与回归行为。”这一文件职责。 |
| 86 | <code>            range: 'A1:F4'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-xlsx-workbook-tool 的契约与回归行为。”这一文件职责。 |
| 87 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 88 | <code>        assert.equal(range.isError, false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-xlsx-workbook-tool 的契约与回归行为。”这一文件职责。 |
| 89 | <code>        assert.match(range.content[0].text, /START/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-xlsx-workbook-tool 的契约与回归行为。”这一文件职责。 |
| 90 | <code>        assert.match(range.content[0].text, /0099FF/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-xlsx-workbook-tool 的契约与回归行为。”这一文件职责。 |
| 91 | <code>        assert.equal(range.details.coverage.range, 'A1:F4');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-xlsx-workbook-tool 的契约与回归行为。”这一文件职责。 |
| 92 | <code>        assert.equal(range.details.complete, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-xlsx-workbook-tool 的契约与回归行为。”这一文件职责。 |
| 93 | <code>        assert.equal(range.details.reasoningReady, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-xlsx-workbook-tool 的契约与回归行为。”这一文件职责。 |
| 94 | <code>        assert.ok(range.details.evidence.evidenceId);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-xlsx-workbook-tool 的契约与回归行为。”这一文件职责。 |
| 95 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 96 | <code>        const coveredRange = await contextArtifactStore.execute({</code> | 声明局部标识符 `coveredRange`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-xlsx-workbook-tool 的契约与回归行为。”这一文件职责。 |
| 97 | <code>            action: 'range',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-xlsx-workbook-tool 的契约与回归行为。”这一文件职责。 |
| 98 | <code>            artifactId: result.details.artifactId,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-xlsx-workbook-tool 的契约与回归行为。”这一文件职责。 |
| 99 | <code>            sheet: 'Map',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-xlsx-workbook-tool 的契约与回归行为。”这一文件职责。 |
| 100 | <code>            range: 'B1:C2'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-xlsx-workbook-tool 的契约与回归行为。”这一文件职责。 |
| 101 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 102 | <code>        assert.equal(coveredRange.isError, false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-xlsx-workbook-tool 的契约与回归行为。”这一文件职责。 |
| 103 | <code>        assert.match(coveredRange.content[0].text, /covered_by_pinned_evidence/);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-xlsx-workbook-tool 的契约与回归行为。”这一文件职责。 |
| 104 | <code>        assert.equal(coveredRange.details.coveredByEvidence.evidenceId, range.details.evidence.evidenceId);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-xlsx-workbook-tool 的契约与回归行为。”这一文件职责。 |
| 105 | <code>        assert.equal(coveredRange.details.coveredByEvidence.range, 'A1:F4');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-xlsx-workbook-tool 的契约与回归行为。”这一文件职责。 |
| 106 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 107 | <code>        const profile = await contextArtifactStore.compute({</code> | 声明局部标识符 `profile`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-xlsx-workbook-tool 的契约与回归行为。”这一文件职责。 |
| 108 | <code>            action: 'profile',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-xlsx-workbook-tool 的契约与回归行为。”这一文件职责。 |
| 109 | <code>            artifactId: result.details.artifactId,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-xlsx-workbook-tool 的契约与回归行为。”这一文件职责。 |
| 110 | <code>            sheet: 'Map'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-xlsx-workbook-tool 的契约与回归行为。”这一文件职责。 |
| 111 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 112 | <code>        assert.equal(profile.isError, false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-xlsx-workbook-tool 的契约与回归行为。”这一文件职责。 |
| 113 | <code>        assert.match(profile.content[0].text, /ARTIFACT_COMPUTE_PROFILE/);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-xlsx-workbook-tool 的契约与回归行为。”这一文件职责。 |
| 114 | <code>        assert.equal(profile.structuredContent.profiles[0].sheet, 'Map');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-xlsx-workbook-tool 的契约与回归行为。”这一文件职责。 |
| 115 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 116 | <code>        const pathResult = await contextArtifactStore.compute({</code> | 声明局部标识符 `pathResult`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-xlsx-workbook-tool 的契约与回归行为。”这一文件职责。 |
| 117 | <code>            action: 'find_path',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-xlsx-workbook-tool 的契约与回归行为。”这一文件职责。 |
| 118 | <code>            artifactId: result.details.artifactId,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-xlsx-workbook-tool 的契约与回归行为。”这一文件职责。 |
| 119 | <code>            sheet: 'Map',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-xlsx-workbook-tool 的契约与回归行为。”这一文件职责。 |
| 120 | <code>            startValue: 'START',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-xlsx-workbook-tool 的契约与回归行为。”这一文件职责。 |
| 121 | <code>            endValue: 'END',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-xlsx-workbook-tool 的契约与回归行为。”这一文件职责。 |
| 122 | <code>            blockedFills: ['0099FF'],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-xlsx-workbook-tool 的契约与回归行为。”这一文件职责。 |
| 123 | <code>            stepSize: 2,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-xlsx-workbook-tool 的契约与回归行为。”这一文件职责。 |
| 124 | <code>            stepToExtract: 1,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-xlsx-workbook-tool 的契约与回归行为。”这一文件职责。 |
| 125 | <code>            extractField: 'cell_color_hex'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-xlsx-workbook-tool 的契约与回归行为。”这一文件职责。 |
| 126 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 127 | <code>        assert.equal(pathResult.isError, false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-xlsx-workbook-tool 的契约与回归行为。”这一文件职责。 |
| 128 | <code>        assert.match(pathResult.content[0].text, /ARTIFACT_COMPUTE_FIND_PATH/);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-xlsx-workbook-tool 的契约与回归行为。”这一文件职责。 |
| 129 | <code>        assert.match(pathResult.content[0].text, /answer_candidate=F478A7/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-xlsx-workbook-tool 的契约与回归行为。”这一文件职责。 |
| 130 | <code>        assert.equal(pathResult.details.result.pathFound, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-xlsx-workbook-tool 的契约与回归行为。”这一文件职责。 |
| 131 | <code>        assert.equal(pathResult.details.result.path.some((cell) =&gt; cell.address === 'B1'), false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-xlsx-workbook-tool 的契约与回归行为。”这一文件职责。 |
| 132 | <code>        assert.equal(pathResult.details.result.extraction.cell.address, 'B2');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-xlsx-workbook-tool 的契约与回归行为。”这一文件职责。 |
| 133 | <code>        assert.equal(pathResult.details.result.extraction.answerCandidate, 'F478A7');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-xlsx-workbook-tool 的契约与回归行为。”这一文件职责。 |
| 134 | <code>        assert.equal(pathResult.details.reasoningReady, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-xlsx-workbook-tool 的契约与回归行为。”这一文件职责。 |
| 135 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 136 | <code>        const nestedPathResult = await contextArtifactStore.compute({</code> | 声明局部标识符 `nestedPathResult`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-xlsx-workbook-tool 的契约与回归行为。”这一文件职责。 |
| 137 | <code>            action: 'find_path',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-xlsx-workbook-tool 的契约与回归行为。”这一文件职责。 |
| 138 | <code>            artifactId: result.details.artifactId,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-xlsx-workbook-tool 的契约与回归行为。”这一文件职责。 |
| 139 | <code>            params: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-xlsx-workbook-tool 的契约与回归行为。”这一文件职责。 |
| 140 | <code>                start_cell: 'START',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-xlsx-workbook-tool 的契约与回归行为。”这一文件职责。 |
| 141 | <code>                end_cell: 'END',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-xlsx-workbook-tool 的契约与回归行为。”这一文件职责。 |
| 142 | <code>                move_step: 2,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-xlsx-workbook-tool 的契约与回归行为。”这一文件职责。 |
| 143 | <code>                target_turn: 1,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-xlsx-workbook-tool 的契约与回归行为。”这一文件职责。 |
| 144 | <code>                avoid_color: 'blue',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-xlsx-workbook-tool 的契约与回归行为。”这一文件职责。 |
| 145 | <code>                return_field: 'cell_hex_color'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-xlsx-workbook-tool 的契约与回归行为。”这一文件职责。 |
| 146 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 147 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 148 | <code>        assert.equal(nestedPathResult.isError, false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-xlsx-workbook-tool 的契约与回归行为。”这一文件职责。 |
| 149 | <code>        assert.match(nestedPathResult.content[0].text, /answer_candidate=F478A7/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-xlsx-workbook-tool 的契约与回归行为。”这一文件职责。 |
| 150 | <code>        assert.equal(nestedPathResult.details.result.extraction.cell.address, 'B2');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-xlsx-workbook-tool 的契约与回归行为。”这一文件职责。 |
| 151 | <code>        assert.equal(nestedPathResult.details.result.extraction.answerCandidate, 'F478A7');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-xlsx-workbook-tool 的契约与回归行为。”这一文件职责。 |
| 152 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 153 | <code>        const ruleTextPathResult = await contextArtifactStore.compute({</code> | 声明局部标识符 `ruleTextPathResult`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-xlsx-workbook-tool 的契约与回归行为。”这一文件职责。 |
| 154 | <code>            action: 'find_path',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-xlsx-workbook-tool 的契约与回归行为。”这一文件职责。 |
| 155 | <code>            artifactId: result.details.artifactId,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-xlsx-workbook-tool 的契约与回归行为。”这一文件职责。 |
| 156 | <code>            params: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-xlsx-workbook-tool 的契约与回归行为。”这一文件职责。 |
| 157 | <code>                start_cell: 'A1',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-xlsx-workbook-tool 的契约与回归行为。”这一文件职责。 |
| 158 | <code>                end_cell: 'C2',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-xlsx-workbook-tool 的契约与回归行为。”这一文件职责。 |
| 159 | <code>                move_rules: '2 cells per turn, up/down/left/right, no backward, no blue cells (0099FF)',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-xlsx-workbook-tool 的契约与回归行为。”这一文件职责。 |
| 160 | <code>                target_turn: 1,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-xlsx-workbook-tool 的契约与回归行为。”这一文件职责。 |
| 161 | <code>                return_field: 'cell_fill_color_hex'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-xlsx-workbook-tool 的契约与回归行为。”这一文件职责。 |
| 162 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 163 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 164 | <code>        assert.equal(ruleTextPathResult.isError, false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-xlsx-workbook-tool 的契约与回归行为。”这一文件职责。 |
| 165 | <code>        assert.match(ruleTextPathResult.content[0].text, /answer_candidate=F478A7/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-xlsx-workbook-tool 的契约与回归行为。”这一文件职责。 |
| 166 | <code>        assert.equal(ruleTextPathResult.details.result.extraction.cell.address, 'B2');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-xlsx-workbook-tool 的契约与回归行为。”这一文件职责。 |
| 167 | <code>        assert.equal(ruleTextPathResult.details.result.extraction.answerCandidate, 'F478A7');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-xlsx-workbook-tool 的契约与回归行为。”这一文件职责。 |
| 168 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 169 | <code>        const search = await contextArtifactStore.execute({</code> | 声明局部标识符 `search`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-xlsx-workbook-tool 的契约与回归行为。”这一文件职责。 |
| 170 | <code>            action: 'search',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-xlsx-workbook-tool 的契约与回归行为。”这一文件职责。 |
| 171 | <code>            artifactId: result.details.artifactId,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-xlsx-workbook-tool 的契约与回归行为。”这一文件职责。 |
| 172 | <code>            query: 'SUM'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-xlsx-workbook-tool 的契约与回归行为。”这一文件职责。 |
| 173 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 174 | <code>        assert.equal(search.isError, false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-xlsx-workbook-tool 的契约与回归行为。”这一文件职责。 |
| 175 | <code>        assert.equal(search.details.matchCount, 1);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-xlsx-workbook-tool 的契约与回归行为。”这一文件职责。 |
| 176 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 177 | <code>        const record = await contextArtifactStore.getRecord(result.details.artifactId);</code> | 声明局部标识符 `record`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-xlsx-workbook-tool 的契约与回归行为。”这一文件职责。 |
| 178 | <code>        assert.ok(record.metadata.pinnedEvidence.some((entry) =&gt;</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-xlsx-workbook-tool 的契约与回归行为。”这一文件职责。 |
| 179 | <code>            entry.evidenceId === range.details.evidence.evidenceId &amp;&amp;</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-xlsx-workbook-tool 的契约与回归行为。”这一文件职责。 |
| 180 | <code>            entry.coverage?.range === 'A1:F4'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-xlsx-workbook-tool 的契约与回归行为。”这一文件职责。 |
| 181 | <code>        ));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 182 | <code>        await fsp.stat(record.payloadPath);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-xlsx-workbook-tool 的契约与回归行为。”这一文件职责。 |
| 183 | <code>        const guarded = contextArtifactStore.guardReadResult(record, record.payloadPath);</code> | 声明局部标识符 `guarded`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-xlsx-workbook-tool 的契约与回归行为。”这一文件职责。 |
| 184 | <code>        assert.equal(guarded.isError, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-xlsx-workbook-tool 的契约与回归行为。”这一文件职责。 |
| 185 | <code>        assert.equal(guarded.details.status, 'blocked');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-xlsx-workbook-tool 的契约与回归行为。”这一文件职责。 |
| 186 | <code>        assert.equal(guarded.details.suggestedNext.tool, 'artifact_query');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-xlsx-workbook-tool 的契约与回归行为。”这一文件职责。 |
| 187 | <code>    } finally {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-xlsx-workbook-tool 的契约与回归行为。”这一文件职责。 |
| 188 | <code>        await fsp.rm(dir, { recursive: true, force: true });</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-xlsx-workbook-tool 的契约与回归行为。”这一文件职责。 |
| 189 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 190 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
