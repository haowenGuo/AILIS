# 代码可达性精简记录

日期：2026-09-05。范围：`codex/code-consolidation-20260904` 独立工作树；未部署、未推送、未替换已安装应用。

## 恢复点与统计口径

完整精简前快照为 `1442cc5b54cb7798e46e517fe65a241c366d50c5`，包含当时主仓的未提交源码。第一批提交为 `9cc4d731a163c6712eab4a53cdfce97e6d38e993`，也是本轮删除前的恢复点。不要用硬重置覆盖主仓已有改动。

| 第一方源码（含测试与脚本，物理行；排除第三方、文档、测试数据） | 文件 | 行数 |
| --- | ---: | ---: |
| 完整精简前 | 436 | 249,367 |
| 第一批后 / 本轮前 | 434 | 247,623 |
| 本轮后 | 429 | 245,325 |

本轮净减 **2,298 行**，累计净减 **4,042 行**。其中本轮 `electron/`、`src/` 生产 JS 净减 **2,199 行**；其余差额来自测试迁移。不是把全部 F 盘源码副本相加。

## 本轮删除依据

- 48 个模块级私有函数（862 行）：AST 词法绑定无引用、无导出，逐轮删除后检查依赖它们的私有辅助函数。涉及旧 JSON planner 辅助逻辑、旧控制面板 Agent Lab 启动、过时文档解析/预览辅助函数等。
- `src/app.js`：未被 HTML、构建配置或当前生产模块加载。保留实际 `src/pet-app.js` 和 `Test/app.js`。
- `electron/ailis-agent-runner.cjs`、`src/vrm-model-system.js`：只有测试使用的两行转发；测试迁往正式公共入口。
- `electron/ailis-local-safety-classifier.cjs`：旧 ONNX 分类器未被 Gateway 创建。保留默认敏感词分类器、可注入 evaluator、EMBER 的 observe/enforce 检查。
- `electron/ailis-xlsx-workbook-tool.cjs` 及隐藏契约：未注册到工具运行时。Excel 读取走 `artifact_tools`；历史 `artifact_query`、`artifact_compute` 数据读取仍保留并测试。

没有把“覆盖率为零”当作单独删除理由。后端教学页 `backend/static/edu/app.js` 由 FastAPI `/static` 挂载并被 HTML 加载，明确保留。

## 验证

- 16 个受影响生产模块：剔除明确删除的函数后，保留部分 AST 一致；唯一其他预期差异是把错误提示中的示例路径改为现存文件。
- 前后 Vite 构建通过，**31 个输出文件路径及 SHA-256 全部相同**。这也说明部分死代码本来就被构建器剔除了；源码变小不等于前端包或 token 成本下降。
- 扩展回归：修改前 **376 项 / 357 通过 / 15 失败 / 4 跳过**；修改后 **372 项 / 353 通过 / 15 失败 / 4 跳过**。失败名称集合完全相同，无新增失败。
- 数量差异：退役 5 个仅属于旧 ONNX 分类器的测试，新增 1 个旧 XLSX 契约移除检查。现有安全链测试保留；旧 XLSX 测试改为真实当前适配器读取 + 历史产物范围查询、缓存、计算、公式检索与原始载荷读保护。
- 15 项既有失败位于 `ailis-llm-planner.test.mjs`（14）和 `ailis-self-debugger.test.mjs`（1），未在本轮修复或屏蔽。因此不是“全套测试全绿”。
- JS 模块图解析无错误；139 个 `electron/src` JS 文件本轮扫描范围内无剩余“模块级无引用函数声明”。11 处动态加载仍按保守规则保留，CLI/worker 是显式入口。
- 主仓 `F:\AILIS\main` 原有 32 个文件快照 SHA-256 均不变。测试生成的五个样例文件已恢复，不纳入源码提交。

## 证据与边界

本地细节：[验证与计数](../tmp/code-consolidation-20260905/verification.json)、[修改前测试](../tmp/code-consolidation-20260904/round2-baseline.json)、[修改后测试](../tmp/code-consolidation-20260904/round2-after.json)。审计脚本和函数原文快照保存在 `tmp/code-consolidation-20260905/`；不随发布包分发。

这不是对任意输入、动态插件和所有 Python/IPC 分支的完整可达性证明。错误恢复、审批、可选 Provider、安装/构建脚本和公开导出不因一次运行未触发而删除。未做新的模型质量、缓存率、费用或真实桌面交互测量，也未运行正式 benchmark。
