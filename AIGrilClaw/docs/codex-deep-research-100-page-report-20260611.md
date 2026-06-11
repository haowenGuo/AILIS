# CODEX 详细调研：AIGL 稳定执行链 100 页报告

生成日期：2026-06-11

说明：本 Markdown 与 DOCX 同源。DOCX 使用固定 100 页研究卡片结构；每页给出结论、分组、优先级、Codex 机制、AIGL 差距、改造建议、验收点和证据。

## 快速导航

| 页码 | 分组 | 主题 | 优先级 |
|---|---|---|---|
| 001 | 总览判断 | 封面：目标、边界与最终判断 | P0 |
| 002 | 总览判断 | 调研方法：官方文档 + 本地源码 + GAIA 失败复盘 | P0 |
| 003 | 总览判断 | 五类 GAIA 结果总览 | P0 |
| 004 | 总览判断 | 为什么 direct-tool 后仍没有明显上涨 | P0 |
| 005 | 总览判断 | Codex 不是 prompt trick | P0 |
| 006 | 总览判断 | 如何阅读这份 100 页手册 | P0 |
| 007 | 总览判断 | 可信度分级：A/B/C | P0 |
| 008 | 总览判断 | 术语边界：executor、transcript、evidence、finalizer | P0 |
| 009 | Codex 执行链 | Agent Turn Loop 主入口 | P0 |
| 010 | 上下文压缩 | Pre-sampling Compaction | P0 |
| 011 | Codex 执行链 | Skills 与 Plugins 注入 | P0 |
| 012 | Codex 执行链 | Model Request Construction | P0 |
| 013 | Codex 执行链 | ToolRouter：模型可见 spec 与 handler 分离 | P0 |
| 014 | Codex 执行链 | ToolRegistry：执行边界 | P0 |
| 015 | 工具暴露与发现 | Spec Plan：工具面按环境规划 | P0 |
| 016 | 工具暴露与发现 | MCP direct/deferred threshold | P0 |
| 017 | 工具暴露与发现 | Tool Search 的 BM25 检索 | P0 |
| 018 | 工具暴露与发现 | Tool Search 输出必须是可加载 spec | P0 |
| 019 | 工具暴露与发现 | MCP Tool Boundary | P0 |
| 020 | 工具暴露与发现 | MCP Resources 与 Prompt Context | P0 |
| 021 | Codex 执行链 | Plugin Manifest 结构 | P0 |
| 022 | Codex 执行链 | Skill Loader 与依赖声明 | P0 |
| 023 | Codex 执行链 | 系统提示的正确位置 | P0 |
| 024 | Codex 执行链 | AGENTS.md 与仓库指令层 | P0 |
| 025 | Codex 执行链 | Conversation Item 模型 | P0 |
| 026 | Codex 执行链 | Tool Call ID 关联 | P0 |
| 027 | Codex 执行链 | Transcript Continuation | P0 |
| 028 | 观测与证据 | Failure Observation | P0 |
| 029 | Shell / Session | exec_command schema | P0 |
| 030 | Shell / Session | write_stdin 与空轮询 | P0 |
| 031 | Shell / Session | ProcessManager 生命周期 | P0 |
| 032 | Shell / Session | yield_time_ms 与 deadline | P0 |
| 033 | Shell / Session | 输出 token accounting | P0 |
| 034 | Shell / Session | Session Cap 与资源治理 | P0 |
| 035 | Shell / Session | Windows Sandbox 注意事项 | P0 |
| 036 | Shell / Session | Shell Tool 不是裸 shell | P0 |
| 037 | Patch / Permission | apply_patch schema | P0 |
| 038 | Patch / Permission | apply_patch verification | P0 |
| 039 | Patch / Permission | exec 中拦截 patch | P0 |
| 040 | Patch / Permission | Patch Events 与 Delta | P0 |
| 041 | Patch / Permission | request_permissions Tool | P0 |
| 042 | Patch / Permission | Permission Profile | P0 |
| 043 | Patch / Permission | Approval/Sandbox Policy | P0 |
| 044 | Patch / Permission | 危险命令与安全命令 | P0 |
| 045 | Patch / Permission | Grant 后续跑 | P0 |
| 046 | 观测与证据 | ToolOutput Family | P0 |
| 047 | 观测与证据 | MCP Output Wrapping | P0 |
| 048 | 观测与证据 | Function Output Truncation | P0 |
| 049 | 观测与证据 | Telemetry Preview | P0 |
| 050 | 观测与证据 | Tool Events | P0 |
| 051 | 上下文压缩 | Compaction Window | P0 |
| 052 | 上下文压缩 | Inline 与 Remote Compact | P0 |
| 053 | 上下文压缩 | Retention Budget | P0 |
| 054 | 网页证据定位 | Web Search Bounded Retrieval | P0 |
| 055 | Shell / Session | Code Mode 与本地脚本 | P0 |
| 056 | 观测与证据 | 文件系统 Artifact | P0 |
| 057 | 观测与证据 | EvidenceArtifact 总体设计 | P0 |
| 058 | 观测与证据 | stdout 作为证据 | P0 |
| 059 | 观测与证据 | PDF/Document Evidence | P0 |
| 060 | 视频 / 视觉 | Image/Vision Evidence | P1 |
| 061 | 长链检索 | 长链检索控制器总览 | P0 |
| 062 | 长链检索 | 长链：论文/作者历史 | P0 |
| 063 | 长链检索 | 长链：实体解析器 | P0 |
| 064 | 长链检索 | 长链：链接跟随 | P0 |
| 065 | 长链检索 | 长链：源获取优先 | P0 |
| 066 | 网页证据定位 | 网页字段定位 | P0 |
| 067 | 网页证据定位 | 网页格式证据 | P0 |
| 068 | 视频 / 视觉 | 媒体：字幕优先 | P1 |
| 069 | 视频 / 视觉 | 媒体：帧采样 | P1 |
| 070 | 视频 / 视觉 | 视觉到结构化：棋盘 | P1 |
| 071 | 结构化来源 | 结构化来源总览 | P1 |
| 072 | 结构化来源 | ClinicalTrials Adapter | P1 |
| 073 | 结构化来源 | Baseball Reference Adapter | P1 |
| 074 | 结构化来源 | Wikipedia Featured Article Adapter | P1 |
| 075 | 结构化来源 | Cornell LII Legal Adapter | P1 |
| 076 | 结构化来源 | Olympics Table Adapter | P1 |
| 077 | 结构化来源 | NPB Roster Adapter | P1 |
| 078 | 结构化来源 | BASE Interactive Table | P1 |
| 079 | 结构化来源 | Presidents Geo Compute | P1 |
| 080 | 结构化来源 | 通用表格抽取 | P1 |
| 081 | Shell / Session | Compute Handoff | P0 |
| 082 | Exact Answer | Benchmark Final Answer Contract | P0 |
| 083 | Exact Answer | Finalizer Confidence Gate | P0 |
| 084 | Exact Answer | Answer Normalization | P0 |
| 085 | 观测与证据 | Observation Digest Gap | P0 |
| 086 | 上下文压缩 | recent_turn_items Gap | P0 |
| 087 | 观测与证据 | Lossless 并不 Lossless | P0 |
| 088 | 工具暴露与发现 | Direct Native Tools Gap | P0 |
| 089 | 工具暴露与发现 | Nested Args Schema Error | P0 |
| 090 | 工具暴露与发现 | tool_search query/q Bug | P0 |
| 091 | 结构化来源 | Adapter Correctness | P1 |
| 092 | 落地路线 | P0：真正 direct-tool executor | P0 |
| 093 | 落地路线 | P0：EvidenceArtifact Store | P0 |
| 094 | Exact Answer | P0：final_answer 原生工具 | P0 |
| 095 | 长链检索 | P0：Retrieval Controllers | P0 |
| 096 | 视频 / 视觉 | P1：Media/Vision Primitives | P1 |
| 097 | 结构化来源 | P1：Source Adapters | P1 |
| 098 | 上下文压缩 | P1：Compaction 与 Token Telemetry | P0 |
| 099 | 落地路线 | Regression Suite Matrix | P0 |
| 100 | 落地路线 | 实施顺序与 Go/No-Go | P0 |

## GAIA 分类结果

| 类别 | 题数 | 通过 | 主要结论 |
|---|---:|---:|---|
| 长链检索 | 6 | 0 | 多跳链路没有固化成锚点和下一跳状态，反复 web_search。 |
| 网页证据定位 | 2 | 0 | 页面内字段、格式和 DOM/渲染证据定位不足。 |
| 视频/视觉 | 4 | 2 | 字幕/网页可救两题，真实帧/棋盘结构化仍失败。 |
| 专用数据源/结构化字段 | 8 | 0 | 专用 adapter 覆盖和结构化结果传递不足。 |
| finalizer/观测捕获 | 4 | 0 | 答案提取、证据捕获和格式化提交仍不可靠。 |

## 来源键说明

- `official`：官方资料：Codex CLI https://developers.openai.com/codex/cli；Codex MCP https://developers.openai.com/codex/mcp；Apply Patch https://developers.openai.com/api/docs/guides/tools-apply-patch；Tool Search https://developers.openai.com/api/docs/guides/tools-tool-search；Shell https://developers.openai.com/api/docs/guides/tools-shell；Web Search https://developers.openai.com/api/docs/guides/tools-web-search；Agents SDK https://developers.openai.com/api/docs/guides/agents
- `turn`：.refs/openai-codex/codex-rs/core/src/session/turn.rs:141,163,236,640,692,770,892,1098,1106,1616
- `tools`：.refs/openai-codex/codex-rs/core/src/tools/router.rs:36,52,59；registry.rs:161,185,273,294；spec_plan.rs:725,789,797；mcp_tool_exposure.rs:10,32,36,40,46；tool_search.rs:23,57,73,109
- `exec`：.refs/openai-codex/codex-rs/core/src/tools/handlers/shell_spec.rs:20,103,217,229,267；unified_exec/exec_command.rs:72,222,236,279,291；write_stdin.rs:32,47,100；process_manager.rs:432,443,578,595,643,668,1093,1219
- `patch_perm`：.refs/openai-codex/codex-rs/core/src/tools/handlers/apply_patch.rs:301,313,363,442,502,515；request_permissions.rs:32,55,64,78；permissions_instructions.rs:62
- `output`：.refs/openai-codex/codex-rs/core/src/tools/context.rs:66,148,235,308,318,404,427；events.rs:54,167,316,337,395
- `skills`：.refs/openai-codex/codex-rs/core-skills/src/loader.rs:56,83,89,161,812；core-plugins/src/manifest.rs:14,38,48,140,240；gpt_5_codex_prompt.md:1,5,11
- `aigl`：F:/AIGril/electron/humanclaw-agent-runner.cjs:3544,3545,3561,3562,5175,5197,5223,5484,5607,5678,5798；humanclaw-tool-contracts.cjs:538,584,661,682；humanclaw-runtime.cjs:471,528,771,923；humanclaw-gateway.cjs:663,717,734,885,1635,1695
- `gaia`：F:/AIGril/scripts/run-gaia-level1-lite.mjs:328,355,414,425,600,622；F:/AIGril/eval-results/engineering/gaia-official/*20260611*.summary.json；F:/AIGril/docs/aigl-vs-codex-gaia-failure-source-report-20260611.md

## 正文

---

## 第 001 页｜封面：目标、边界与最终判断

**分组**：总览判断 / `EXEC`

**优先级**：P0

**结论**：这份报告的目标是解释 Codex 如何把复杂任务做稳，并把结论转成 AIGL 可施工的 100 页路线图。最终判断：AIGL 不应继续堆 prompt，而应重建 transcript-driven evidence executor。

**Codex 机制**：Codex 的优势不在单句提示，而在 runtime 把输入、工具、观察、权限、补丁、事件和下一轮决策做成闭环。模型负责推理，harness 负责把推理变成可恢复、可审计、可验证的行动。

**AIGL 差距**：AIGL 已经有 direct-tool、tool_search、recent_turn_items 和 finalizer 的雏形，但多处仍停在摘要、提示和事后补救层，尚未形成证据驱动的主循环。

**改造建议**：先把行为从 prompt 迁移到 runtime：工具 schema 直接暴露，工具结果以结构化 transcript 持久化，final answer 与用户可见话术分离。

**验收点**：同一题重跑时，工具调用参数错误减少，关键证据可回放，finalizer 只能提交 evidence-backed exact answer。

**证据**：official; turn; output; aigl; gaia

**证据展开**：official: 官方资料：Codex CLI https://developers.openai.com/codex/cli；Codex MCP https://developers.openai.com/codex/mcp；Apply Patch https://developers.openai.com/api/docs/guides/tools-apply-patch；Tool Search https://developers.openai.com/api/docs/guides/tools-tool-search；Shell https://developers.openai.com/api/docs/guides/tools-shell；Web Search https://developers.openai.com/api/docs/guides/tools-web-search；Agents SDK https://developers.openai.com/api/docs/guides/agents | turn: .refs/openai-codex/codex-rs/core/src/session/turn.rs:141,163,236,640,692,770,892,1098,1106,1616 | output: .refs/openai-codex/codex-rs/core/src/tools/context.rs:66,148,235,308,318,404,427；events.rs:54,167,316,337,395 | aigl: F:/AIGril/electron/humanclaw-agent-runner.cjs:3544,3545,3561,3562,5175,5197,5223,5484,5607,5678,5798；humanclaw-tool-contracts.cjs:538,584,661,682；humanclaw-runtime.cjs:471,528,771,923；humanclaw-gateway.cjs:663,717,734,885,1635,1695 | gaia: F:/AIGril/scripts/run-gaia-level1-lite.mjs:328,355,414,425,600,622；F:/AIGril/eval-results/engineering/gaia-official/*20260611*.summary.json；F:/AIGril/docs/aigl-vs-codex-gaia-failure-source-report-20260611.md

---

## 第 002 页｜调研方法：官方文档 + 本地源码 + GAIA 失败复盘

**分组**：总览判断 / `EXEC`

**优先级**：P0

**结论**：调研采用三层证据：官方 OpenAI 文档确认产品/API 语义，本地 openai-codex 源码确认实现形状，AIGL/GAIA 日志确认当前失败点。

**Codex 机制**：Codex 的优势不在单句提示，而在 runtime 把输入、工具、观察、权限、补丁、事件和下一轮决策做成闭环。模型负责推理，harness 负责把推理变成可恢复、可审计、可验证的行动。

**AIGL 差距**：AIGL 已经有 direct-tool、tool_search、recent_turn_items 和 finalizer 的雏形，但多处仍停在摘要、提示和事后补救层，尚未形成证据驱动的主循环。

**改造建议**：先把行为从 prompt 迁移到 runtime：工具 schema 直接暴露，工具结果以结构化 transcript 持久化，final answer 与用户可见话术分离。

**验收点**：同一题重跑时，工具调用参数错误减少，关键证据可回放，finalizer 只能提交 evidence-backed exact answer。

**证据**：official; turn; output; aigl; gaia

**证据展开**：official: 官方资料：Codex CLI https://developers.openai.com/codex/cli；Codex MCP https://developers.openai.com/codex/mcp；Apply Patch https://developers.openai.com/api/docs/guides/tools-apply-patch；Tool Search https://developers.openai.com/api/docs/guides/tools-tool-search；Shell https://developers.openai.com/api/docs/guides/tools-shell；Web Search https://developers.openai.com/api/docs/guides/tools-web-search；Agents SDK https://developers.openai.com/api/docs/guides/agents | turn: .refs/openai-codex/codex-rs/core/src/session/turn.rs:141,163,236,640,692,770,892,1098,1106,1616 | output: .refs/openai-codex/codex-rs/core/src/tools/context.rs:66,148,235,308,318,404,427；events.rs:54,167,316,337,395 | aigl: F:/AIGril/electron/humanclaw-agent-runner.cjs:3544,3545,3561,3562,5175,5197,5223,5484,5607,5678,5798；humanclaw-tool-contracts.cjs:538,584,661,682；humanclaw-runtime.cjs:471,528,771,923；humanclaw-gateway.cjs:663,717,734,885,1635,1695 | gaia: F:/AIGril/scripts/run-gaia-level1-lite.mjs:328,355,414,425,600,622；F:/AIGril/eval-results/engineering/gaia-official/*20260611*.summary.json；F:/AIGril/docs/aigl-vs-codex-gaia-failure-source-report-20260611.md

---

## 第 003 页｜五类 GAIA 结果总览

**分组**：总览判断 / `EXEC`

**优先级**：P0

**结论**：2026-06-11 的 24 题分类跑法显示，AIGL 只有视频/视觉类中 2 题通过，其余长链、网页证据、结构化来源和 finalizer 类均未得分。

**Codex 机制**：Codex 的优势不在单句提示，而在 runtime 把输入、工具、观察、权限、补丁、事件和下一轮决策做成闭环。模型负责推理，harness 负责把推理变成可恢复、可审计、可验证的行动。

**AIGL 差距**：AIGL 已经有 direct-tool、tool_search、recent_turn_items 和 finalizer 的雏形，但多处仍停在摘要、提示和事后补救层，尚未形成证据驱动的主循环。

**改造建议**：先把行为从 prompt 迁移到 runtime：工具 schema 直接暴露，工具结果以结构化 transcript 持久化，final answer 与用户可见话术分离。

**验收点**：同一题重跑时，工具调用参数错误减少，关键证据可回放，finalizer 只能提交 evidence-backed exact answer。

**证据**：official; turn; output; aigl; gaia

**证据展开**：official: 官方资料：Codex CLI https://developers.openai.com/codex/cli；Codex MCP https://developers.openai.com/codex/mcp；Apply Patch https://developers.openai.com/api/docs/guides/tools-apply-patch；Tool Search https://developers.openai.com/api/docs/guides/tools-tool-search；Shell https://developers.openai.com/api/docs/guides/tools-shell；Web Search https://developers.openai.com/api/docs/guides/tools-web-search；Agents SDK https://developers.openai.com/api/docs/guides/agents | turn: .refs/openai-codex/codex-rs/core/src/session/turn.rs:141,163,236,640,692,770,892,1098,1106,1616 | output: .refs/openai-codex/codex-rs/core/src/tools/context.rs:66,148,235,308,318,404,427；events.rs:54,167,316,337,395 | aigl: F:/AIGril/electron/humanclaw-agent-runner.cjs:3544,3545,3561,3562,5175,5197,5223,5484,5607,5678,5798；humanclaw-tool-contracts.cjs:538,584,661,682；humanclaw-runtime.cjs:471,528,771,923；humanclaw-gateway.cjs:663,717,734,885,1635,1695 | gaia: F:/AIGril/scripts/run-gaia-level1-lite.mjs:328,355,414,425,600,622；F:/AIGril/eval-results/engineering/gaia-official/*20260611*.summary.json；F:/AIGril/docs/aigl-vs-codex-gaia-failure-source-report-20260611.md

---

## 第 004 页｜为什么 direct-tool 后仍没有明显上涨

**分组**：总览判断 / `EXEC`

**优先级**：P0

**结论**：direct-tool 只解决“能否看到工具按钮”的第一层问题；真正失败集中在工具之后的链路保持、证据持久化、字段抽取和 exact answer 提交。

**Codex 机制**：Codex 的优势不在单句提示，而在 runtime 把输入、工具、观察、权限、补丁、事件和下一轮决策做成闭环。模型负责推理，harness 负责把推理变成可恢复、可审计、可验证的行动。

**AIGL 差距**：AIGL 已经有 direct-tool、tool_search、recent_turn_items 和 finalizer 的雏形，但多处仍停在摘要、提示和事后补救层，尚未形成证据驱动的主循环。

**改造建议**：先把行为从 prompt 迁移到 runtime：工具 schema 直接暴露，工具结果以结构化 transcript 持久化，final answer 与用户可见话术分离。

**验收点**：同一题重跑时，工具调用参数错误减少，关键证据可回放，finalizer 只能提交 evidence-backed exact answer。

**证据**：official; turn; output; aigl; gaia

**证据展开**：official: 官方资料：Codex CLI https://developers.openai.com/codex/cli；Codex MCP https://developers.openai.com/codex/mcp；Apply Patch https://developers.openai.com/api/docs/guides/tools-apply-patch；Tool Search https://developers.openai.com/api/docs/guides/tools-tool-search；Shell https://developers.openai.com/api/docs/guides/tools-shell；Web Search https://developers.openai.com/api/docs/guides/tools-web-search；Agents SDK https://developers.openai.com/api/docs/guides/agents | turn: .refs/openai-codex/codex-rs/core/src/session/turn.rs:141,163,236,640,692,770,892,1098,1106,1616 | output: .refs/openai-codex/codex-rs/core/src/tools/context.rs:66,148,235,308,318,404,427；events.rs:54,167,316,337,395 | aigl: F:/AIGril/electron/humanclaw-agent-runner.cjs:3544,3545,3561,3562,5175,5197,5223,5484,5607,5678,5798；humanclaw-tool-contracts.cjs:538,584,661,682；humanclaw-runtime.cjs:471,528,771,923；humanclaw-gateway.cjs:663,717,734,885,1635,1695 | gaia: F:/AIGril/scripts/run-gaia-level1-lite.mjs:328,355,414,425,600,622；F:/AIGril/eval-results/engineering/gaia-official/*20260611*.summary.json；F:/AIGril/docs/aigl-vs-codex-gaia-failure-source-report-20260611.md

---

## 第 005 页｜Codex 不是 prompt trick

**分组**：总览判断 / `EXEC`

**优先级**：P0

**结论**：Codex 的可交付能力来自模型和 harness 的乘积：模型能想，runtime 让它能查、能改、能观察、能恢复、能安全地继续。

**Codex 机制**：Codex 的优势不在单句提示，而在 runtime 把输入、工具、观察、权限、补丁、事件和下一轮决策做成闭环。模型负责推理，harness 负责把推理变成可恢复、可审计、可验证的行动。

**AIGL 差距**：AIGL 已经有 direct-tool、tool_search、recent_turn_items 和 finalizer 的雏形，但多处仍停在摘要、提示和事后补救层，尚未形成证据驱动的主循环。

**改造建议**：先把行为从 prompt 迁移到 runtime：工具 schema 直接暴露，工具结果以结构化 transcript 持久化，final answer 与用户可见话术分离。

**验收点**：同一题重跑时，工具调用参数错误减少，关键证据可回放，finalizer 只能提交 evidence-backed exact answer。

**证据**：official; turn; output; aigl; gaia

**证据展开**：official: 官方资料：Codex CLI https://developers.openai.com/codex/cli；Codex MCP https://developers.openai.com/codex/mcp；Apply Patch https://developers.openai.com/api/docs/guides/tools-apply-patch；Tool Search https://developers.openai.com/api/docs/guides/tools-tool-search；Shell https://developers.openai.com/api/docs/guides/tools-shell；Web Search https://developers.openai.com/api/docs/guides/tools-web-search；Agents SDK https://developers.openai.com/api/docs/guides/agents | turn: .refs/openai-codex/codex-rs/core/src/session/turn.rs:141,163,236,640,692,770,892,1098,1106,1616 | output: .refs/openai-codex/codex-rs/core/src/tools/context.rs:66,148,235,308,318,404,427；events.rs:54,167,316,337,395 | aigl: F:/AIGril/electron/humanclaw-agent-runner.cjs:3544,3545,3561,3562,5175,5197,5223,5484,5607,5678,5798；humanclaw-tool-contracts.cjs:538,584,661,682；humanclaw-runtime.cjs:471,528,771,923；humanclaw-gateway.cjs:663,717,734,885,1635,1695 | gaia: F:/AIGril/scripts/run-gaia-level1-lite.mjs:328,355,414,425,600,622；F:/AIGril/eval-results/engineering/gaia-official/*20260611*.summary.json；F:/AIGril/docs/aigl-vs-codex-gaia-failure-source-report-20260611.md

---

## 第 006 页｜如何阅读这份 100 页手册

**分组**：总览判断 / `EXEC`

**优先级**：P0

**结论**：每页都是一张工程研究卡：先读结论，再看 Codex 机制、AIGL 差距、改造建议、验收点和证据。后续可以按页拆 issue。

**Codex 机制**：Codex 的优势不在单句提示，而在 runtime 把输入、工具、观察、权限、补丁、事件和下一轮决策做成闭环。模型负责推理，harness 负责把推理变成可恢复、可审计、可验证的行动。

**AIGL 差距**：AIGL 已经有 direct-tool、tool_search、recent_turn_items 和 finalizer 的雏形，但多处仍停在摘要、提示和事后补救层，尚未形成证据驱动的主循环。

**改造建议**：先把行为从 prompt 迁移到 runtime：工具 schema 直接暴露，工具结果以结构化 transcript 持久化，final answer 与用户可见话术分离。

**验收点**：同一题重跑时，工具调用参数错误减少，关键证据可回放，finalizer 只能提交 evidence-backed exact answer。

**证据**：official; turn; output; aigl; gaia

**证据展开**：official: 官方资料：Codex CLI https://developers.openai.com/codex/cli；Codex MCP https://developers.openai.com/codex/mcp；Apply Patch https://developers.openai.com/api/docs/guides/tools-apply-patch；Tool Search https://developers.openai.com/api/docs/guides/tools-tool-search；Shell https://developers.openai.com/api/docs/guides/tools-shell；Web Search https://developers.openai.com/api/docs/guides/tools-web-search；Agents SDK https://developers.openai.com/api/docs/guides/agents | turn: .refs/openai-codex/codex-rs/core/src/session/turn.rs:141,163,236,640,692,770,892,1098,1106,1616 | output: .refs/openai-codex/codex-rs/core/src/tools/context.rs:66,148,235,308,318,404,427；events.rs:54,167,316,337,395 | aigl: F:/AIGril/electron/humanclaw-agent-runner.cjs:3544,3545,3561,3562,5175,5197,5223,5484,5607,5678,5798；humanclaw-tool-contracts.cjs:538,584,661,682；humanclaw-runtime.cjs:471,528,771,923；humanclaw-gateway.cjs:663,717,734,885,1635,1695 | gaia: F:/AIGril/scripts/run-gaia-level1-lite.mjs:328,355,414,425,600,622；F:/AIGril/eval-results/engineering/gaia-official/*20260611*.summary.json；F:/AIGril/docs/aigl-vs-codex-gaia-failure-source-report-20260611.md

---

## 第 007 页｜可信度分级：A/B/C

**分组**：总览判断 / `EXEC`

**优先级**：P0

**结论**：A 级来自源码或官方文档，B 级来自多处源码的强推论，C 级是给 AIGL 的工程建议。实现时先采纳 A+B，再评估 C。

**Codex 机制**：Codex 的优势不在单句提示，而在 runtime 把输入、工具、观察、权限、补丁、事件和下一轮决策做成闭环。模型负责推理，harness 负责把推理变成可恢复、可审计、可验证的行动。

**AIGL 差距**：AIGL 已经有 direct-tool、tool_search、recent_turn_items 和 finalizer 的雏形，但多处仍停在摘要、提示和事后补救层，尚未形成证据驱动的主循环。

**改造建议**：先把行为从 prompt 迁移到 runtime：工具 schema 直接暴露，工具结果以结构化 transcript 持久化，final answer 与用户可见话术分离。

**验收点**：同一题重跑时，工具调用参数错误减少，关键证据可回放，finalizer 只能提交 evidence-backed exact answer。

**证据**：official; turn; output; aigl; gaia

**证据展开**：official: 官方资料：Codex CLI https://developers.openai.com/codex/cli；Codex MCP https://developers.openai.com/codex/mcp；Apply Patch https://developers.openai.com/api/docs/guides/tools-apply-patch；Tool Search https://developers.openai.com/api/docs/guides/tools-tool-search；Shell https://developers.openai.com/api/docs/guides/tools-shell；Web Search https://developers.openai.com/api/docs/guides/tools-web-search；Agents SDK https://developers.openai.com/api/docs/guides/agents | turn: .refs/openai-codex/codex-rs/core/src/session/turn.rs:141,163,236,640,692,770,892,1098,1106,1616 | output: .refs/openai-codex/codex-rs/core/src/tools/context.rs:66,148,235,308,318,404,427；events.rs:54,167,316,337,395 | aigl: F:/AIGril/electron/humanclaw-agent-runner.cjs:3544,3545,3561,3562,5175,5197,5223,5484,5607,5678,5798；humanclaw-tool-contracts.cjs:538,584,661,682；humanclaw-runtime.cjs:471,528,771,923；humanclaw-gateway.cjs:663,717,734,885,1635,1695 | gaia: F:/AIGril/scripts/run-gaia-level1-lite.mjs:328,355,414,425,600,622；F:/AIGril/eval-results/engineering/gaia-official/*20260611*.summary.json；F:/AIGril/docs/aigl-vs-codex-gaia-failure-source-report-20260611.md

---

## 第 008 页｜术语边界：executor、transcript、evidence、finalizer

**分组**：总览判断 / `EXEC`

**优先级**：P0

**结论**：本报告把 executor 定义为模型与 runtime 的闭环，把 transcript 定义为可回灌上下文，把 evidence 定义为可复核事实，把 finalizer 定义为 exact answer gate。

**Codex 机制**：Codex 的优势不在单句提示，而在 runtime 把输入、工具、观察、权限、补丁、事件和下一轮决策做成闭环。模型负责推理，harness 负责把推理变成可恢复、可审计、可验证的行动。

**AIGL 差距**：AIGL 已经有 direct-tool、tool_search、recent_turn_items 和 finalizer 的雏形，但多处仍停在摘要、提示和事后补救层，尚未形成证据驱动的主循环。

**改造建议**：先把行为从 prompt 迁移到 runtime：工具 schema 直接暴露，工具结果以结构化 transcript 持久化，final answer 与用户可见话术分离。

**验收点**：同一题重跑时，工具调用参数错误减少，关键证据可回放，finalizer 只能提交 evidence-backed exact answer。

**证据**：official; turn; output; aigl; gaia

**证据展开**：official: 官方资料：Codex CLI https://developers.openai.com/codex/cli；Codex MCP https://developers.openai.com/codex/mcp；Apply Patch https://developers.openai.com/api/docs/guides/tools-apply-patch；Tool Search https://developers.openai.com/api/docs/guides/tools-tool-search；Shell https://developers.openai.com/api/docs/guides/tools-shell；Web Search https://developers.openai.com/api/docs/guides/tools-web-search；Agents SDK https://developers.openai.com/api/docs/guides/agents | turn: .refs/openai-codex/codex-rs/core/src/session/turn.rs:141,163,236,640,692,770,892,1098,1106,1616 | output: .refs/openai-codex/codex-rs/core/src/tools/context.rs:66,148,235,308,318,404,427；events.rs:54,167,316,337,395 | aigl: F:/AIGril/electron/humanclaw-agent-runner.cjs:3544,3545,3561,3562,5175,5197,5223,5484,5607,5678,5798；humanclaw-tool-contracts.cjs:538,584,661,682；humanclaw-runtime.cjs:471,528,771,923；humanclaw-gateway.cjs:663,717,734,885,1635,1695 | gaia: F:/AIGril/scripts/run-gaia-level1-lite.mjs:328,355,414,425,600,622；F:/AIGril/eval-results/engineering/gaia-official/*20260611*.summary.json；F:/AIGril/docs/aigl-vs-codex-gaia-failure-source-report-20260611.md

---

## 第 009 页｜Agent Turn Loop 主入口

**分组**：Codex 执行链 / `ARCH`

**优先级**：P0

**结论**：Codex 的 turn loop 会在采样前构建 skills/plugins、运行采样请求、处理自动压缩、再构建 ToolRouter；这是一条有状态循环，不是一轮 JSON planner。

**Codex 机制**：Codex 每轮不是简单追加聊天文本，而是重新组织 turn context、skills/plugins、tool exposure、ToolRouter、model request 和 tool result。工具执行后，结果以 response item/ToolOutput 形式进入后续上下文。

**AIGL 差距**：AIGL 的主循环已能构造 directToolSpecs，但工具结果大量压缩进 recent_turn_items 和 lossless_tool_observations；这让模型可见的是摘要，而不是完整的、可引用的执行事件。

**改造建议**：把 agent loop 收敛为 buildTurnContext -> buildToolPlan -> callModel -> dispatchTool -> appendTranscript -> nextTurn，并让所有工具结果进入同一种 transcript item。

**验收点**：任意一次 run 可以导出完整事件链：模型看到哪些工具、调用了哪个 schema、返回了哪个 call_id、下一轮是否读到同一 observation。

**证据**：turn; tools; output; skills; aigl

**证据展开**：turn: .refs/openai-codex/codex-rs/core/src/session/turn.rs:141,163,236,640,692,770,892,1098,1106,1616 | tools: .refs/openai-codex/codex-rs/core/src/tools/router.rs:36,52,59；registry.rs:161,185,273,294；spec_plan.rs:725,789,797；mcp_tool_exposure.rs:10,32,36,40,46；tool_search.rs:23,57,73,109 | output: .refs/openai-codex/codex-rs/core/src/tools/context.rs:66,148,235,308,318,404,427；events.rs:54,167,316,337,395 | skills: .refs/openai-codex/codex-rs/core-skills/src/loader.rs:56,83,89,161,812；core-plugins/src/manifest.rs:14,38,48,140,240；gpt_5_codex_prompt.md:1,5,11 | aigl: F:/AIGril/electron/humanclaw-agent-runner.cjs:3544,3545,3561,3562,5175,5197,5223,5484,5607,5678,5798；humanclaw-tool-contracts.cjs:538,584,661,682；humanclaw-runtime.cjs:471,528,771,923；humanclaw-gateway.cjs:663,717,734,885,1635,1695

---

## 第 010 页｜Pre-sampling Compaction

**分组**：上下文压缩 / `MEMORY`

**优先级**：P0

**结论**：Codex 在模型请求前会检查 token 状态并触发 compact，避免把上下文推到不可控边缘；这与用户要求的 70% 早压缩策略一致。

**Codex 机制**：Codex 在 pre-sampling 和 auto-compact 路径中按 token 状态、scope limit、window ordinal 和 prefill tokens 判断是否压缩；它不是等到上下文爆掉才处理。

**AIGL 差距**：AIGL 已有 recent_turn_items 和 prompt_compaction 设计，但任务链仍可能把长日志、重复 progress、摘要 observation 多次塞回模型。

**改造建议**：把 70% 作为早压缩阈值，75-80% 生成 CODEX_MEMORY.md；active prompt 只保留最近事件、未解决证据和任务状态。

**验收点**：长任务跑到 70% 时写入检查点；新线程可从检查点继续；无 API key、token、敏感原文泄漏。

**证据**：turn; aigl; F:/AIGril/docs/aigl-codex-context-compaction.md

**证据展开**：turn: .refs/openai-codex/codex-rs/core/src/session/turn.rs:141,163,236,640,692,770,892,1098,1106,1616 | aigl: F:/AIGril/electron/humanclaw-agent-runner.cjs:3544,3545,3561,3562,5175,5197,5223,5484,5607,5678,5798；humanclaw-tool-contracts.cjs:538,584,661,682；humanclaw-runtime.cjs:471,528,771,923；humanclaw-gateway.cjs:663,717,734,885,1635,1695 | F:/AIGril/docs/aigl-codex-context-compaction.md: F:/AIGril/docs/aigl-codex-context-compaction.md

---

## 第 011 页｜Skills 与 Plugins 注入

**分组**：Codex 执行链 / `ARCH`

**优先级**：P0

**结论**：Codex 把技能和插件作为能力包注入 turn，而不是把所有规则写死在一个系统提示里；这让能力发现、依赖和策略都可维护。

**Codex 机制**：Codex 每轮不是简单追加聊天文本，而是重新组织 turn context、skills/plugins、tool exposure、ToolRouter、model request 和 tool result。工具执行后，结果以 response item/ToolOutput 形式进入后续上下文。

**AIGL 差距**：AIGL 的主循环已能构造 directToolSpecs，但工具结果大量压缩进 recent_turn_items 和 lossless_tool_observations；这让模型可见的是摘要，而不是完整的、可引用的执行事件。

**改造建议**：把 agent loop 收敛为 buildTurnContext -> buildToolPlan -> callModel -> dispatchTool -> appendTranscript -> nextTurn，并让所有工具结果进入同一种 transcript item。

**验收点**：任意一次 run 可以导出完整事件链：模型看到哪些工具、调用了哪个 schema、返回了哪个 call_id、下一轮是否读到同一 observation。

**证据**：turn; tools; output; skills; aigl

**证据展开**：turn: .refs/openai-codex/codex-rs/core/src/session/turn.rs:141,163,236,640,692,770,892,1098,1106,1616 | tools: .refs/openai-codex/codex-rs/core/src/tools/router.rs:36,52,59；registry.rs:161,185,273,294；spec_plan.rs:725,789,797；mcp_tool_exposure.rs:10,32,36,40,46；tool_search.rs:23,57,73,109 | output: .refs/openai-codex/codex-rs/core/src/tools/context.rs:66,148,235,308,318,404,427；events.rs:54,167,316,337,395 | skills: .refs/openai-codex/codex-rs/core-skills/src/loader.rs:56,83,89,161,812；core-plugins/src/manifest.rs:14,38,48,140,240；gpt_5_codex_prompt.md:1,5,11 | aigl: F:/AIGril/electron/humanclaw-agent-runner.cjs:3544,3545,3561,3562,5175,5197,5223,5484,5607,5678,5798；humanclaw-tool-contracts.cjs:538,584,661,682；humanclaw-runtime.cjs:471,528,771,923；humanclaw-gateway.cjs:663,717,734,885,1635,1695

---

## 第 012 页｜Model Request Construction

**分组**：Codex 执行链 / `ARCH`

**优先级**：P0

**结论**：Codex 的模型请求由 turn context、tool specs、history、compaction state 和 final output schema 共同决定；这给 runtime 保留了调度权。

**Codex 机制**：Codex 每轮不是简单追加聊天文本，而是重新组织 turn context、skills/plugins、tool exposure、ToolRouter、model request 和 tool result。工具执行后，结果以 response item/ToolOutput 形式进入后续上下文。

**AIGL 差距**：AIGL 的主循环已能构造 directToolSpecs，但工具结果大量压缩进 recent_turn_items 和 lossless_tool_observations；这让模型可见的是摘要，而不是完整的、可引用的执行事件。

**改造建议**：把 agent loop 收敛为 buildTurnContext -> buildToolPlan -> callModel -> dispatchTool -> appendTranscript -> nextTurn，并让所有工具结果进入同一种 transcript item。

**验收点**：任意一次 run 可以导出完整事件链：模型看到哪些工具、调用了哪个 schema、返回了哪个 call_id、下一轮是否读到同一 observation。

**证据**：turn; tools; output; skills; aigl

**证据展开**：turn: .refs/openai-codex/codex-rs/core/src/session/turn.rs:141,163,236,640,692,770,892,1098,1106,1616 | tools: .refs/openai-codex/codex-rs/core/src/tools/router.rs:36,52,59；registry.rs:161,185,273,294；spec_plan.rs:725,789,797；mcp_tool_exposure.rs:10,32,36,40,46；tool_search.rs:23,57,73,109 | output: .refs/openai-codex/codex-rs/core/src/tools/context.rs:66,148,235,308,318,404,427；events.rs:54,167,316,337,395 | skills: .refs/openai-codex/codex-rs/core-skills/src/loader.rs:56,83,89,161,812；core-plugins/src/manifest.rs:14,38,48,140,240；gpt_5_codex_prompt.md:1,5,11 | aigl: F:/AIGril/electron/humanclaw-agent-runner.cjs:3544,3545,3561,3562,5175,5197,5223,5484,5607,5678,5798；humanclaw-tool-contracts.cjs:538,584,661,682；humanclaw-runtime.cjs:471,528,771,923；humanclaw-gateway.cjs:663,717,734,885,1635,1695

---

## 第 013 页｜ToolRouter：模型可见 spec 与 handler 分离

**分组**：Codex 执行链 / `ARCH`

**优先级**：P0

**结论**：ToolRouter 保存 model_visible_specs，同时把 response item 转成 runtime ToolCall；模型只能走 schema，不能绕过 handler。

**Codex 机制**：Codex 每轮不是简单追加聊天文本，而是重新组织 turn context、skills/plugins、tool exposure、ToolRouter、model request 和 tool result。工具执行后，结果以 response item/ToolOutput 形式进入后续上下文。

**AIGL 差距**：AIGL 的主循环已能构造 directToolSpecs，但工具结果大量压缩进 recent_turn_items 和 lossless_tool_observations；这让模型可见的是摘要，而不是完整的、可引用的执行事件。

**改造建议**：把 agent loop 收敛为 buildTurnContext -> buildToolPlan -> callModel -> dispatchTool -> appendTranscript -> nextTurn，并让所有工具结果进入同一种 transcript item。

**验收点**：任意一次 run 可以导出完整事件链：模型看到哪些工具、调用了哪个 schema、返回了哪个 call_id、下一轮是否读到同一 observation。

**证据**：turn; tools; output; skills; aigl

**证据展开**：turn: .refs/openai-codex/codex-rs/core/src/session/turn.rs:141,163,236,640,692,770,892,1098,1106,1616 | tools: .refs/openai-codex/codex-rs/core/src/tools/router.rs:36,52,59；registry.rs:161,185,273,294；spec_plan.rs:725,789,797；mcp_tool_exposure.rs:10,32,36,40,46；tool_search.rs:23,57,73,109 | output: .refs/openai-codex/codex-rs/core/src/tools/context.rs:66,148,235,308,318,404,427；events.rs:54,167,316,337,395 | skills: .refs/openai-codex/codex-rs/core-skills/src/loader.rs:56,83,89,161,812；core-plugins/src/manifest.rs:14,38,48,140,240；gpt_5_codex_prompt.md:1,5,11 | aigl: F:/AIGril/electron/humanclaw-agent-runner.cjs:3544,3545,3561,3562,5175,5197,5223,5484,5607,5678,5798；humanclaw-tool-contracts.cjs:538,584,661,682；humanclaw-runtime.cjs:471,528,771,923；humanclaw-gateway.cjs:663,717,734,885,1635,1695

---

## 第 014 页｜ToolRegistry：执行边界

**分组**：Codex 执行链 / `ARCH`

**优先级**：P0

**结论**：ToolRegistry 把 payload 交给对应 runtime，并允许工具结果在 original 与 model_visible 之间做转换；这正是证据护栏的位置。

**Codex 机制**：Codex 每轮不是简单追加聊天文本，而是重新组织 turn context、skills/plugins、tool exposure、ToolRouter、model request 和 tool result。工具执行后，结果以 response item/ToolOutput 形式进入后续上下文。

**AIGL 差距**：AIGL 的主循环已能构造 directToolSpecs，但工具结果大量压缩进 recent_turn_items 和 lossless_tool_observations；这让模型可见的是摘要，而不是完整的、可引用的执行事件。

**改造建议**：把 agent loop 收敛为 buildTurnContext -> buildToolPlan -> callModel -> dispatchTool -> appendTranscript -> nextTurn，并让所有工具结果进入同一种 transcript item。

**验收点**：任意一次 run 可以导出完整事件链：模型看到哪些工具、调用了哪个 schema、返回了哪个 call_id、下一轮是否读到同一 observation。

**证据**：turn; tools; output; skills; aigl

**证据展开**：turn: .refs/openai-codex/codex-rs/core/src/session/turn.rs:141,163,236,640,692,770,892,1098,1106,1616 | tools: .refs/openai-codex/codex-rs/core/src/tools/router.rs:36,52,59；registry.rs:161,185,273,294；spec_plan.rs:725,789,797；mcp_tool_exposure.rs:10,32,36,40,46；tool_search.rs:23,57,73,109 | output: .refs/openai-codex/codex-rs/core/src/tools/context.rs:66,148,235,308,318,404,427；events.rs:54,167,316,337,395 | skills: .refs/openai-codex/codex-rs/core-skills/src/loader.rs:56,83,89,161,812；core-plugins/src/manifest.rs:14,38,48,140,240；gpt_5_codex_prompt.md:1,5,11 | aigl: F:/AIGril/electron/humanclaw-agent-runner.cjs:3544,3545,3561,3562,5175,5197,5223,5484,5607,5678,5798；humanclaw-tool-contracts.cjs:538,584,661,682；humanclaw-runtime.cjs:471,528,771,923；humanclaw-gateway.cjs:663,717,734,885,1635,1695

---

## 第 015 页｜Spec Plan：工具面按环境规划

**分组**：工具暴露与发现 / `TOOLS`

**优先级**：P0

**结论**：Codex 的 spec plan 统一加入 exec_command、write_stdin、apply_patch、request_permissions、tool_search 和 MCP runtime tools。

**Codex 机制**：Codex 的工具不是自然语言建议，而是模型可见 spec 与 runtime handler 绑定的类型化对象。工具过多时会 deferred，通过 tool_search 搜索后再加载，避免 prompt 被全部 schema 淹没。

**AIGL 差距**：AIGL 有 tool_search contract 和 Gateway 搜索能力，但 GAIA 失败里仍出现 tool_search 参数用 question 而不是 query，说明模型没有始终在真实 schema 上生成调用。

**改造建议**：benchmark/task 模式下让 tool_search、MCP、external__ 工具成为原生 callable tools；搜索结果必须返回可加载 spec，不只返回推荐文本。

**验收点**：150 个工具注册时，首轮只暴露核心工具和 tool_search；命中工具在下一轮以完整 schema 可调用，错参率进入测试门槛。

**证据**：official; tools; aigl; gaia

**证据展开**：official: 官方资料：Codex CLI https://developers.openai.com/codex/cli；Codex MCP https://developers.openai.com/codex/mcp；Apply Patch https://developers.openai.com/api/docs/guides/tools-apply-patch；Tool Search https://developers.openai.com/api/docs/guides/tools-tool-search；Shell https://developers.openai.com/api/docs/guides/tools-shell；Web Search https://developers.openai.com/api/docs/guides/tools-web-search；Agents SDK https://developers.openai.com/api/docs/guides/agents | tools: .refs/openai-codex/codex-rs/core/src/tools/router.rs:36,52,59；registry.rs:161,185,273,294；spec_plan.rs:725,789,797；mcp_tool_exposure.rs:10,32,36,40,46；tool_search.rs:23,57,73,109 | aigl: F:/AIGril/electron/humanclaw-agent-runner.cjs:3544,3545,3561,3562,5175,5197,5223,5484,5607,5678,5798；humanclaw-tool-contracts.cjs:538,584,661,682；humanclaw-runtime.cjs:471,528,771,923；humanclaw-gateway.cjs:663,717,734,885,1635,1695 | gaia: F:/AIGril/scripts/run-gaia-level1-lite.mjs:328,355,414,425,600,622；F:/AIGril/eval-results/engineering/gaia-official/*20260611*.summary.json；F:/AIGril/docs/aigl-vs-codex-gaia-failure-source-report-20260611.md

---

## 第 016 页｜MCP direct/deferred threshold

**分组**：工具暴露与发现 / `TOOLS`

**优先级**：P0

**结论**：Codex 使用 DIRECT_MCP_TOOL_EXPOSURE_THRESHOLD=100，并在工具多或 tool_search 开启时把 MCP tools deferred，避免首轮 prompt 膨胀。

**Codex 机制**：Codex 的工具不是自然语言建议，而是模型可见 spec 与 runtime handler 绑定的类型化对象。工具过多时会 deferred，通过 tool_search 搜索后再加载，避免 prompt 被全部 schema 淹没。

**AIGL 差距**：AIGL 有 tool_search contract 和 Gateway 搜索能力，但 GAIA 失败里仍出现 tool_search 参数用 question 而不是 query，说明模型没有始终在真实 schema 上生成调用。

**改造建议**：benchmark/task 模式下让 tool_search、MCP、external__ 工具成为原生 callable tools；搜索结果必须返回可加载 spec，不只返回推荐文本。

**验收点**：150 个工具注册时，首轮只暴露核心工具和 tool_search；命中工具在下一轮以完整 schema 可调用，错参率进入测试门槛。

**证据**：official; tools; aigl; gaia

**证据展开**：official: 官方资料：Codex CLI https://developers.openai.com/codex/cli；Codex MCP https://developers.openai.com/codex/mcp；Apply Patch https://developers.openai.com/api/docs/guides/tools-apply-patch；Tool Search https://developers.openai.com/api/docs/guides/tools-tool-search；Shell https://developers.openai.com/api/docs/guides/tools-shell；Web Search https://developers.openai.com/api/docs/guides/tools-web-search；Agents SDK https://developers.openai.com/api/docs/guides/agents | tools: .refs/openai-codex/codex-rs/core/src/tools/router.rs:36,52,59；registry.rs:161,185,273,294；spec_plan.rs:725,789,797；mcp_tool_exposure.rs:10,32,36,40,46；tool_search.rs:23,57,73,109 | aigl: F:/AIGril/electron/humanclaw-agent-runner.cjs:3544,3545,3561,3562,5175,5197,5223,5484,5607,5678,5798；humanclaw-tool-contracts.cjs:538,584,661,682；humanclaw-runtime.cjs:471,528,771,923；humanclaw-gateway.cjs:663,717,734,885,1635,1695 | gaia: F:/AIGril/scripts/run-gaia-level1-lite.mjs:328,355,414,425,600,622；F:/AIGril/eval-results/engineering/gaia-official/*20260611*.summary.json；F:/AIGril/docs/aigl-vs-codex-gaia-failure-source-report-20260611.md

---

## 第 017 页｜Tool Search 的 BM25 检索

**分组**：工具暴露与发现 / `TOOLS`

**优先级**：P0

**结论**：tool_search 是 runtime-native 工具，内部构建搜索引擎查 deferred tool metadata；它不是一句“你可以搜索工具”的提示。

**Codex 机制**：Codex 的工具不是自然语言建议，而是模型可见 spec 与 runtime handler 绑定的类型化对象。工具过多时会 deferred，通过 tool_search 搜索后再加载，避免 prompt 被全部 schema 淹没。

**AIGL 差距**：AIGL 有 tool_search contract 和 Gateway 搜索能力，但 GAIA 失败里仍出现 tool_search 参数用 question 而不是 query，说明模型没有始终在真实 schema 上生成调用。

**改造建议**：benchmark/task 模式下让 tool_search、MCP、external__ 工具成为原生 callable tools；搜索结果必须返回可加载 spec，不只返回推荐文本。

**验收点**：150 个工具注册时，首轮只暴露核心工具和 tool_search；命中工具在下一轮以完整 schema 可调用，错参率进入测试门槛。

**证据**：official; tools; aigl; gaia

**证据展开**：official: 官方资料：Codex CLI https://developers.openai.com/codex/cli；Codex MCP https://developers.openai.com/codex/mcp；Apply Patch https://developers.openai.com/api/docs/guides/tools-apply-patch；Tool Search https://developers.openai.com/api/docs/guides/tools-tool-search；Shell https://developers.openai.com/api/docs/guides/tools-shell；Web Search https://developers.openai.com/api/docs/guides/tools-web-search；Agents SDK https://developers.openai.com/api/docs/guides/agents | tools: .refs/openai-codex/codex-rs/core/src/tools/router.rs:36,52,59；registry.rs:161,185,273,294；spec_plan.rs:725,789,797；mcp_tool_exposure.rs:10,32,36,40,46；tool_search.rs:23,57,73,109 | aigl: F:/AIGril/electron/humanclaw-agent-runner.cjs:3544,3545,3561,3562,5175,5197,5223,5484,5607,5678,5798；humanclaw-tool-contracts.cjs:538,584,661,682；humanclaw-runtime.cjs:471,528,771,923；humanclaw-gateway.cjs:663,717,734,885,1635,1695 | gaia: F:/AIGril/scripts/run-gaia-level1-lite.mjs:328,355,414,425,600,622；F:/AIGril/eval-results/engineering/gaia-official/*20260611*.summary.json；F:/AIGril/docs/aigl-vs-codex-gaia-failure-source-report-20260611.md

---

## 第 018 页｜Tool Search 输出必须是可加载 spec

**分组**：工具暴露与发现 / `TOOLS`

**优先级**：P0

**结论**：Codex 的 ToolSearchOutput 会进入模型可见输出；AIGL 应返回 tool id、schema、source、provenance 和 call pattern，而不是自然语言建议。

**Codex 机制**：Codex 的工具不是自然语言建议，而是模型可见 spec 与 runtime handler 绑定的类型化对象。工具过多时会 deferred，通过 tool_search 搜索后再加载，避免 prompt 被全部 schema 淹没。

**AIGL 差距**：AIGL 有 tool_search contract 和 Gateway 搜索能力，但 GAIA 失败里仍出现 tool_search 参数用 question 而不是 query，说明模型没有始终在真实 schema 上生成调用。

**改造建议**：benchmark/task 模式下让 tool_search、MCP、external__ 工具成为原生 callable tools；搜索结果必须返回可加载 spec，不只返回推荐文本。

**验收点**：150 个工具注册时，首轮只暴露核心工具和 tool_search；命中工具在下一轮以完整 schema 可调用，错参率进入测试门槛。

**证据**：official; tools; aigl; gaia

**证据展开**：official: 官方资料：Codex CLI https://developers.openai.com/codex/cli；Codex MCP https://developers.openai.com/codex/mcp；Apply Patch https://developers.openai.com/api/docs/guides/tools-apply-patch；Tool Search https://developers.openai.com/api/docs/guides/tools-tool-search；Shell https://developers.openai.com/api/docs/guides/tools-shell；Web Search https://developers.openai.com/api/docs/guides/tools-web-search；Agents SDK https://developers.openai.com/api/docs/guides/agents | tools: .refs/openai-codex/codex-rs/core/src/tools/router.rs:36,52,59；registry.rs:161,185,273,294；spec_plan.rs:725,789,797；mcp_tool_exposure.rs:10,32,36,40,46；tool_search.rs:23,57,73,109 | aigl: F:/AIGril/electron/humanclaw-agent-runner.cjs:3544,3545,3561,3562,5175,5197,5223,5484,5607,5678,5798；humanclaw-tool-contracts.cjs:538,584,661,682；humanclaw-runtime.cjs:471,528,771,923；humanclaw-gateway.cjs:663,717,734,885,1635,1695 | gaia: F:/AIGril/scripts/run-gaia-level1-lite.mjs:328,355,414,425,600,622；F:/AIGril/eval-results/engineering/gaia-official/*20260611*.summary.json；F:/AIGril/docs/aigl-vs-codex-gaia-failure-source-report-20260611.md

---

## 第 019 页｜MCP Tool Boundary

**分组**：工具暴露与发现 / `TOOLS`

**优先级**：P0

**结论**：Codex 把 MCP server 的原始工具身份和模型可见 schema 分开管理；这能防止桥接层把不同工具混成自由文本。

**Codex 机制**：Codex 的工具不是自然语言建议，而是模型可见 spec 与 runtime handler 绑定的类型化对象。工具过多时会 deferred，通过 tool_search 搜索后再加载，避免 prompt 被全部 schema 淹没。

**AIGL 差距**：AIGL 有 tool_search contract 和 Gateway 搜索能力，但 GAIA 失败里仍出现 tool_search 参数用 question 而不是 query，说明模型没有始终在真实 schema 上生成调用。

**改造建议**：benchmark/task 模式下让 tool_search、MCP、external__ 工具成为原生 callable tools；搜索结果必须返回可加载 spec，不只返回推荐文本。

**验收点**：150 个工具注册时，首轮只暴露核心工具和 tool_search；命中工具在下一轮以完整 schema 可调用，错参率进入测试门槛。

**证据**：official; tools; aigl; gaia

**证据展开**：official: 官方资料：Codex CLI https://developers.openai.com/codex/cli；Codex MCP https://developers.openai.com/codex/mcp；Apply Patch https://developers.openai.com/api/docs/guides/tools-apply-patch；Tool Search https://developers.openai.com/api/docs/guides/tools-tool-search；Shell https://developers.openai.com/api/docs/guides/tools-shell；Web Search https://developers.openai.com/api/docs/guides/tools-web-search；Agents SDK https://developers.openai.com/api/docs/guides/agents | tools: .refs/openai-codex/codex-rs/core/src/tools/router.rs:36,52,59；registry.rs:161,185,273,294；spec_plan.rs:725,789,797；mcp_tool_exposure.rs:10,32,36,40,46；tool_search.rs:23,57,73,109 | aigl: F:/AIGril/electron/humanclaw-agent-runner.cjs:3544,3545,3561,3562,5175,5197,5223,5484,5607,5678,5798；humanclaw-tool-contracts.cjs:538,584,661,682；humanclaw-runtime.cjs:471,528,771,923；humanclaw-gateway.cjs:663,717,734,885,1635,1695 | gaia: F:/AIGril/scripts/run-gaia-level1-lite.mjs:328,355,414,425,600,622；F:/AIGril/eval-results/engineering/gaia-official/*20260611*.summary.json；F:/AIGril/docs/aigl-vs-codex-gaia-failure-source-report-20260611.md

---

## 第 020 页｜MCP Resources 与 Prompt Context

**分组**：工具暴露与发现 / `TOOLS`

**优先级**：P0

**结论**：MCP 不只是 function call，还包括 resources、templates 和上下文。AIGL 要避免只实现 tool bridge，却忽略资源读取和证据引用。

**Codex 机制**：Codex 的工具不是自然语言建议，而是模型可见 spec 与 runtime handler 绑定的类型化对象。工具过多时会 deferred，通过 tool_search 搜索后再加载，避免 prompt 被全部 schema 淹没。

**AIGL 差距**：AIGL 有 tool_search contract 和 Gateway 搜索能力，但 GAIA 失败里仍出现 tool_search 参数用 question 而不是 query，说明模型没有始终在真实 schema 上生成调用。

**改造建议**：benchmark/task 模式下让 tool_search、MCP、external__ 工具成为原生 callable tools；搜索结果必须返回可加载 spec，不只返回推荐文本。

**验收点**：150 个工具注册时，首轮只暴露核心工具和 tool_search；命中工具在下一轮以完整 schema 可调用，错参率进入测试门槛。

**证据**：official; tools; aigl; gaia

**证据展开**：official: 官方资料：Codex CLI https://developers.openai.com/codex/cli；Codex MCP https://developers.openai.com/codex/mcp；Apply Patch https://developers.openai.com/api/docs/guides/tools-apply-patch；Tool Search https://developers.openai.com/api/docs/guides/tools-tool-search；Shell https://developers.openai.com/api/docs/guides/tools-shell；Web Search https://developers.openai.com/api/docs/guides/tools-web-search；Agents SDK https://developers.openai.com/api/docs/guides/agents | tools: .refs/openai-codex/codex-rs/core/src/tools/router.rs:36,52,59；registry.rs:161,185,273,294；spec_plan.rs:725,789,797；mcp_tool_exposure.rs:10,32,36,40,46；tool_search.rs:23,57,73,109 | aigl: F:/AIGril/electron/humanclaw-agent-runner.cjs:3544,3545,3561,3562,5175,5197,5223,5484,5607,5678,5798；humanclaw-tool-contracts.cjs:538,584,661,682；humanclaw-runtime.cjs:471,528,771,923；humanclaw-gateway.cjs:663,717,734,885,1635,1695 | gaia: F:/AIGril/scripts/run-gaia-level1-lite.mjs:328,355,414,425,600,622；F:/AIGril/eval-results/engineering/gaia-official/*20260611*.summary.json；F:/AIGril/docs/aigl-vs-codex-gaia-failure-source-report-20260611.md

---

## 第 021 页｜Plugin Manifest 结构

**分组**：Codex 执行链 / `ARCH`

**优先级**：P0

**结论**：Codex plugin manifest 能声明 skills、mcp servers、apps、hooks 和 interface；这为能力包治理提供了标准边界。

**Codex 机制**：Codex 每轮不是简单追加聊天文本，而是重新组织 turn context、skills/plugins、tool exposure、ToolRouter、model request 和 tool result。工具执行后，结果以 response item/ToolOutput 形式进入后续上下文。

**AIGL 差距**：AIGL 的主循环已能构造 directToolSpecs，但工具结果大量压缩进 recent_turn_items 和 lossless_tool_observations；这让模型可见的是摘要，而不是完整的、可引用的执行事件。

**改造建议**：把 agent loop 收敛为 buildTurnContext -> buildToolPlan -> callModel -> dispatchTool -> appendTranscript -> nextTurn，并让所有工具结果进入同一种 transcript item。

**验收点**：任意一次 run 可以导出完整事件链：模型看到哪些工具、调用了哪个 schema、返回了哪个 call_id、下一轮是否读到同一 observation。

**证据**：turn; tools; output; skills; aigl

**证据展开**：turn: .refs/openai-codex/codex-rs/core/src/session/turn.rs:141,163,236,640,692,770,892,1098,1106,1616 | tools: .refs/openai-codex/codex-rs/core/src/tools/router.rs:36,52,59；registry.rs:161,185,273,294；spec_plan.rs:725,789,797；mcp_tool_exposure.rs:10,32,36,40,46；tool_search.rs:23,57,73,109 | output: .refs/openai-codex/codex-rs/core/src/tools/context.rs:66,148,235,308,318,404,427；events.rs:54,167,316,337,395 | skills: .refs/openai-codex/codex-rs/core-skills/src/loader.rs:56,83,89,161,812；core-plugins/src/manifest.rs:14,38,48,140,240；gpt_5_codex_prompt.md:1,5,11 | aigl: F:/AIGril/electron/humanclaw-agent-runner.cjs:3544,3545,3561,3562,5175,5197,5223,5484,5607,5678,5798；humanclaw-tool-contracts.cjs:538,584,661,682；humanclaw-runtime.cjs:471,528,771,923；humanclaw-gateway.cjs:663,717,734,885,1635,1695

---

## 第 022 页｜Skill Loader 与依赖声明

**分组**：Codex 执行链 / `ARCH`

**优先级**：P0

**结论**：Skill loader 读取 SKILL.md metadata、dependencies 和 policy；AIGL 的能力包也应能声明依赖工具缺失时的 degraded 状态。

**Codex 机制**：Codex 每轮不是简单追加聊天文本，而是重新组织 turn context、skills/plugins、tool exposure、ToolRouter、model request 和 tool result。工具执行后，结果以 response item/ToolOutput 形式进入后续上下文。

**AIGL 差距**：AIGL 的主循环已能构造 directToolSpecs，但工具结果大量压缩进 recent_turn_items 和 lossless_tool_observations；这让模型可见的是摘要，而不是完整的、可引用的执行事件。

**改造建议**：把 agent loop 收敛为 buildTurnContext -> buildToolPlan -> callModel -> dispatchTool -> appendTranscript -> nextTurn，并让所有工具结果进入同一种 transcript item。

**验收点**：任意一次 run 可以导出完整事件链：模型看到哪些工具、调用了哪个 schema、返回了哪个 call_id、下一轮是否读到同一 observation。

**证据**：turn; tools; output; skills; aigl

**证据展开**：turn: .refs/openai-codex/codex-rs/core/src/session/turn.rs:141,163,236,640,692,770,892,1098,1106,1616 | tools: .refs/openai-codex/codex-rs/core/src/tools/router.rs:36,52,59；registry.rs:161,185,273,294；spec_plan.rs:725,789,797；mcp_tool_exposure.rs:10,32,36,40,46；tool_search.rs:23,57,73,109 | output: .refs/openai-codex/codex-rs/core/src/tools/context.rs:66,148,235,308,318,404,427；events.rs:54,167,316,337,395 | skills: .refs/openai-codex/codex-rs/core-skills/src/loader.rs:56,83,89,161,812；core-plugins/src/manifest.rs:14,38,48,140,240；gpt_5_codex_prompt.md:1,5,11 | aigl: F:/AIGril/electron/humanclaw-agent-runner.cjs:3544,3545,3561,3562,5175,5197,5223,5484,5607,5678,5798；humanclaw-tool-contracts.cjs:538,584,661,682；humanclaw-runtime.cjs:471,528,771,923；humanclaw-gateway.cjs:663,717,734,885,1635,1695

---

## 第 023 页｜系统提示的正确位置

**分组**：Codex 执行链 / `ARCH`

**优先级**：P0

**结论**：Codex prompt 强化工程习惯，例如优先 rg、使用 apply_patch、不回滚用户改动；但 prompt 只约束行为倾向，不替代 runtime。

**Codex 机制**：Codex 每轮不是简单追加聊天文本，而是重新组织 turn context、skills/plugins、tool exposure、ToolRouter、model request 和 tool result。工具执行后，结果以 response item/ToolOutput 形式进入后续上下文。

**AIGL 差距**：AIGL 的主循环已能构造 directToolSpecs，但工具结果大量压缩进 recent_turn_items 和 lossless_tool_observations；这让模型可见的是摘要，而不是完整的、可引用的执行事件。

**改造建议**：把 agent loop 收敛为 buildTurnContext -> buildToolPlan -> callModel -> dispatchTool -> appendTranscript -> nextTurn，并让所有工具结果进入同一种 transcript item。

**验收点**：任意一次 run 可以导出完整事件链：模型看到哪些工具、调用了哪个 schema、返回了哪个 call_id、下一轮是否读到同一 observation。

**证据**：turn; tools; output; skills; aigl

**证据展开**：turn: .refs/openai-codex/codex-rs/core/src/session/turn.rs:141,163,236,640,692,770,892,1098,1106,1616 | tools: .refs/openai-codex/codex-rs/core/src/tools/router.rs:36,52,59；registry.rs:161,185,273,294；spec_plan.rs:725,789,797；mcp_tool_exposure.rs:10,32,36,40,46；tool_search.rs:23,57,73,109 | output: .refs/openai-codex/codex-rs/core/src/tools/context.rs:66,148,235,308,318,404,427；events.rs:54,167,316,337,395 | skills: .refs/openai-codex/codex-rs/core-skills/src/loader.rs:56,83,89,161,812；core-plugins/src/manifest.rs:14,38,48,140,240；gpt_5_codex_prompt.md:1,5,11 | aigl: F:/AIGril/electron/humanclaw-agent-runner.cjs:3544,3545,3561,3562,5175,5197,5223,5484,5607,5678,5798；humanclaw-tool-contracts.cjs:538,584,661,682；humanclaw-runtime.cjs:471,528,771,923；humanclaw-gateway.cjs:663,717,734,885,1635,1695

---

## 第 024 页｜AGENTS.md 与仓库指令层

**分组**：Codex 执行链 / `ARCH`

**优先级**：P0

**结论**：Codex 会把仓库局部指令纳入上下文；AIGL 也要支持项目级约束，但不能让它覆盖安全和 tool schema。

**Codex 机制**：Codex 每轮不是简单追加聊天文本，而是重新组织 turn context、skills/plugins、tool exposure、ToolRouter、model request 和 tool result。工具执行后，结果以 response item/ToolOutput 形式进入后续上下文。

**AIGL 差距**：AIGL 的主循环已能构造 directToolSpecs，但工具结果大量压缩进 recent_turn_items 和 lossless_tool_observations；这让模型可见的是摘要，而不是完整的、可引用的执行事件。

**改造建议**：把 agent loop 收敛为 buildTurnContext -> buildToolPlan -> callModel -> dispatchTool -> appendTranscript -> nextTurn，并让所有工具结果进入同一种 transcript item。

**验收点**：任意一次 run 可以导出完整事件链：模型看到哪些工具、调用了哪个 schema、返回了哪个 call_id、下一轮是否读到同一 observation。

**证据**：turn; tools; output; skills; aigl

**证据展开**：turn: .refs/openai-codex/codex-rs/core/src/session/turn.rs:141,163,236,640,692,770,892,1098,1106,1616 | tools: .refs/openai-codex/codex-rs/core/src/tools/router.rs:36,52,59；registry.rs:161,185,273,294；spec_plan.rs:725,789,797；mcp_tool_exposure.rs:10,32,36,40,46；tool_search.rs:23,57,73,109 | output: .refs/openai-codex/codex-rs/core/src/tools/context.rs:66,148,235,308,318,404,427；events.rs:54,167,316,337,395 | skills: .refs/openai-codex/codex-rs/core-skills/src/loader.rs:56,83,89,161,812；core-plugins/src/manifest.rs:14,38,48,140,240；gpt_5_codex_prompt.md:1,5,11 | aigl: F:/AIGril/electron/humanclaw-agent-runner.cjs:3544,3545,3561,3562,5175,5197,5223,5484,5607,5678,5798；humanclaw-tool-contracts.cjs:538,584,661,682；humanclaw-runtime.cjs:471,528,771,923；humanclaw-gateway.cjs:663,717,734,885,1635,1695

---

## 第 025 页｜Conversation Item 模型

**分组**：Codex 执行链 / `ARCH`

**优先级**：P0

**结论**：Codex 把工具调用、非工具回复、事实和完成项作为可处理的 items；AIGL 应避免把所有历史压成一段自然语言状态。

**Codex 机制**：Codex 每轮不是简单追加聊天文本，而是重新组织 turn context、skills/plugins、tool exposure、ToolRouter、model request 和 tool result。工具执行后，结果以 response item/ToolOutput 形式进入后续上下文。

**AIGL 差距**：AIGL 的主循环已能构造 directToolSpecs，但工具结果大量压缩进 recent_turn_items 和 lossless_tool_observations；这让模型可见的是摘要，而不是完整的、可引用的执行事件。

**改造建议**：把 agent loop 收敛为 buildTurnContext -> buildToolPlan -> callModel -> dispatchTool -> appendTranscript -> nextTurn，并让所有工具结果进入同一种 transcript item。

**验收点**：任意一次 run 可以导出完整事件链：模型看到哪些工具、调用了哪个 schema、返回了哪个 call_id、下一轮是否读到同一 observation。

**证据**：turn; tools; output; skills; aigl

**证据展开**：turn: .refs/openai-codex/codex-rs/core/src/session/turn.rs:141,163,236,640,692,770,892,1098,1106,1616 | tools: .refs/openai-codex/codex-rs/core/src/tools/router.rs:36,52,59；registry.rs:161,185,273,294；spec_plan.rs:725,789,797；mcp_tool_exposure.rs:10,32,36,40,46；tool_search.rs:23,57,73,109 | output: .refs/openai-codex/codex-rs/core/src/tools/context.rs:66,148,235,308,318,404,427；events.rs:54,167,316,337,395 | skills: .refs/openai-codex/codex-rs/core-skills/src/loader.rs:56,83,89,161,812；core-plugins/src/manifest.rs:14,38,48,140,240；gpt_5_codex_prompt.md:1,5,11 | aigl: F:/AIGril/electron/humanclaw-agent-runner.cjs:3544,3545,3561,3562,5175,5197,5223,5484,5607,5678,5798；humanclaw-tool-contracts.cjs:538,584,661,682；humanclaw-runtime.cjs:471,528,771,923；humanclaw-gateway.cjs:663,717,734,885,1635,1695

---

## 第 026 页｜Tool Call ID 关联

**分组**：Codex 执行链 / `ARCH`

**优先级**：P0

**结论**：每个 tool_call 与 tool_result 必须通过 call_id 关联；没有 call_id 的 evidence 很难被 finalizer 稳定引用。

**Codex 机制**：Codex 每轮不是简单追加聊天文本，而是重新组织 turn context、skills/plugins、tool exposure、ToolRouter、model request 和 tool result。工具执行后，结果以 response item/ToolOutput 形式进入后续上下文。

**AIGL 差距**：AIGL 的主循环已能构造 directToolSpecs，但工具结果大量压缩进 recent_turn_items 和 lossless_tool_observations；这让模型可见的是摘要，而不是完整的、可引用的执行事件。

**改造建议**：把 agent loop 收敛为 buildTurnContext -> buildToolPlan -> callModel -> dispatchTool -> appendTranscript -> nextTurn，并让所有工具结果进入同一种 transcript item。

**验收点**：任意一次 run 可以导出完整事件链：模型看到哪些工具、调用了哪个 schema、返回了哪个 call_id、下一轮是否读到同一 observation。

**证据**：turn; tools; output; skills; aigl

**证据展开**：turn: .refs/openai-codex/codex-rs/core/src/session/turn.rs:141,163,236,640,692,770,892,1098,1106,1616 | tools: .refs/openai-codex/codex-rs/core/src/tools/router.rs:36,52,59；registry.rs:161,185,273,294；spec_plan.rs:725,789,797；mcp_tool_exposure.rs:10,32,36,40,46；tool_search.rs:23,57,73,109 | output: .refs/openai-codex/codex-rs/core/src/tools/context.rs:66,148,235,308,318,404,427；events.rs:54,167,316,337,395 | skills: .refs/openai-codex/codex-rs/core-skills/src/loader.rs:56,83,89,161,812；core-plugins/src/manifest.rs:14,38,48,140,240；gpt_5_codex_prompt.md:1,5,11 | aigl: F:/AIGril/electron/humanclaw-agent-runner.cjs:3544,3545,3561,3562,5175,5197,5223,5484,5607,5678,5798；humanclaw-tool-contracts.cjs:538,584,661,682；humanclaw-runtime.cjs:471,528,771,923；humanclaw-gateway.cjs:663,717,734,885,1635,1695

---

## 第 027 页｜Transcript Continuation

**分组**：Codex 执行链 / `ARCH`

**优先级**：P0

**结论**：真正的续跑不是重新描述进度，而是把上一轮 response item 和工具结果继续送入下一轮。AIGL 目前摘要链路仍会丢细节。

**Codex 机制**：Codex 每轮不是简单追加聊天文本，而是重新组织 turn context、skills/plugins、tool exposure、ToolRouter、model request 和 tool result。工具执行后，结果以 response item/ToolOutput 形式进入后续上下文。

**AIGL 差距**：AIGL 的主循环已能构造 directToolSpecs，但工具结果大量压缩进 recent_turn_items 和 lossless_tool_observations；这让模型可见的是摘要，而不是完整的、可引用的执行事件。

**改造建议**：把 agent loop 收敛为 buildTurnContext -> buildToolPlan -> callModel -> dispatchTool -> appendTranscript -> nextTurn，并让所有工具结果进入同一种 transcript item。

**验收点**：任意一次 run 可以导出完整事件链：模型看到哪些工具、调用了哪个 schema、返回了哪个 call_id、下一轮是否读到同一 observation。

**证据**：turn; tools; output; skills; aigl

**证据展开**：turn: .refs/openai-codex/codex-rs/core/src/session/turn.rs:141,163,236,640,692,770,892,1098,1106,1616 | tools: .refs/openai-codex/codex-rs/core/src/tools/router.rs:36,52,59；registry.rs:161,185,273,294；spec_plan.rs:725,789,797；mcp_tool_exposure.rs:10,32,36,40,46；tool_search.rs:23,57,73,109 | output: .refs/openai-codex/codex-rs/core/src/tools/context.rs:66,148,235,308,318,404,427；events.rs:54,167,316,337,395 | skills: .refs/openai-codex/codex-rs/core-skills/src/loader.rs:56,83,89,161,812；core-plugins/src/manifest.rs:14,38,48,140,240；gpt_5_codex_prompt.md:1,5,11 | aigl: F:/AIGril/electron/humanclaw-agent-runner.cjs:3544,3545,3561,3562,5175,5197,5223,5484,5607,5678,5798；humanclaw-tool-contracts.cjs:538,584,661,682；humanclaw-runtime.cjs:471,528,771,923；humanclaw-gateway.cjs:663,717,734,885,1635,1695

---

## 第 028 页｜Failure Observation

**分组**：观测与证据 / `EVIDENCE`

**优先级**：P0

**结论**：失败工具结果也必须进入 transcript，因为下一轮恢复需要知道错误类型、参数、stderr 和可修复路径。

**Codex 机制**：Codex 将工具结果、事件、截断、遥测 preview 和上下文压缩分别处理：UI 可以丰富，模型上下文必须小而准；失败和拒绝也都是正式事件。

**AIGL 差距**：AIGL 的 observation 目前仍过度依赖 preview/digest；ClinicalTrials 和 PPT 案例说明答案可能出现在过程里，但 finalizer 未拿到稳定证据槽。

**改造建议**：建立 EvidenceArtifact：原始 stdout、JSON path、网页字段、PDF 页码、截图帧、表格行都用 artifact id 保存，model-facing 只传摘要和引用。

**验收点**：finalizer 输入含 artifact refs；如果答案只在截断外，finalizer 必须请求读取 artifact 而不是空提交或猜答案。

**证据**：output; exec; aigl; gaia

**证据展开**：output: .refs/openai-codex/codex-rs/core/src/tools/context.rs:66,148,235,308,318,404,427；events.rs:54,167,316,337,395 | exec: .refs/openai-codex/codex-rs/core/src/tools/handlers/shell_spec.rs:20,103,217,229,267；unified_exec/exec_command.rs:72,222,236,279,291；write_stdin.rs:32,47,100；process_manager.rs:432,443,578,595,643,668,1093,1219 | aigl: F:/AIGril/electron/humanclaw-agent-runner.cjs:3544,3545,3561,3562,5175,5197,5223,5484,5607,5678,5798；humanclaw-tool-contracts.cjs:538,584,661,682；humanclaw-runtime.cjs:471,528,771,923；humanclaw-gateway.cjs:663,717,734,885,1635,1695 | gaia: F:/AIGril/scripts/run-gaia-level1-lite.mjs:328,355,414,425,600,622；F:/AIGril/eval-results/engineering/gaia-official/*20260611*.summary.json；F:/AIGril/docs/aigl-vs-codex-gaia-failure-source-report-20260611.md

---

## 第 029 页｜exec_command schema

**分组**：Shell / Session / `EXEC-RUNTIME`

**优先级**：P0

**结论**：Codex 暴露 cmd、workdir、tty、yield_time_ms、max_output_tokens、权限参数等字段；这比 AIGL 的泛化 computer.exec 更适合模型稳定调用。

**Codex 机制**：Codex 的 shell 能力是 exec_command + write_stdin + ProcessManager，而不是一次性命令。它支持 session_id、轮询、stdin、yield_time_ms、max_output_tokens、原始 token 计数和输出截断。

**AIGL 差距**：AIGL 有 computer.exec、session_start、pty_* 和 code.test 等多条执行路径，模型侧入口碎片化；长任务和脚本输出不总能稳定成为 answer-bearing evidence。

**改造建议**：新增 Codex 同型 exec_command/write_stdin 表面，旧 exec/PTY/process_read 降为内部后端；所有命令输出统一 ToolOutput 和 transcript。

**验收点**：pnpm test、Python 脚本、交互式 REPL 都能返回 session_id；空 write_stdin 可轮询；最终 transcript 包含 exit_code、stdout、stderr、original_token_count。

**证据**：official; exec; output; aigl

**证据展开**：official: 官方资料：Codex CLI https://developers.openai.com/codex/cli；Codex MCP https://developers.openai.com/codex/mcp；Apply Patch https://developers.openai.com/api/docs/guides/tools-apply-patch；Tool Search https://developers.openai.com/api/docs/guides/tools-tool-search；Shell https://developers.openai.com/api/docs/guides/tools-shell；Web Search https://developers.openai.com/api/docs/guides/tools-web-search；Agents SDK https://developers.openai.com/api/docs/guides/agents | exec: .refs/openai-codex/codex-rs/core/src/tools/handlers/shell_spec.rs:20,103,217,229,267；unified_exec/exec_command.rs:72,222,236,279,291；write_stdin.rs:32,47,100；process_manager.rs:432,443,578,595,643,668,1093,1219 | output: .refs/openai-codex/codex-rs/core/src/tools/context.rs:66,148,235,308,318,404,427；events.rs:54,167,316,337,395 | aigl: F:/AIGril/electron/humanclaw-agent-runner.cjs:3544,3545,3561,3562,5175,5197,5223,5484,5607,5678,5798；humanclaw-tool-contracts.cjs:538,584,661,682；humanclaw-runtime.cjs:471,528,771,923；humanclaw-gateway.cjs:663,717,734,885,1635,1695

---

## 第 030 页｜write_stdin 与空轮询

**分组**：Shell / Session / `EXEC-RUNTIME`

**优先级**：P0

**结论**：write_stdin 允许 chars 为空时只轮询输出，这让长命令和交互命令可以持续观察，不需要重启进程。

**Codex 机制**：Codex 的 shell 能力是 exec_command + write_stdin + ProcessManager，而不是一次性命令。它支持 session_id、轮询、stdin、yield_time_ms、max_output_tokens、原始 token 计数和输出截断。

**AIGL 差距**：AIGL 有 computer.exec、session_start、pty_* 和 code.test 等多条执行路径，模型侧入口碎片化；长任务和脚本输出不总能稳定成为 answer-bearing evidence。

**改造建议**：新增 Codex 同型 exec_command/write_stdin 表面，旧 exec/PTY/process_read 降为内部后端；所有命令输出统一 ToolOutput 和 transcript。

**验收点**：pnpm test、Python 脚本、交互式 REPL 都能返回 session_id；空 write_stdin 可轮询；最终 transcript 包含 exit_code、stdout、stderr、original_token_count。

**证据**：official; exec; output; aigl

**证据展开**：official: 官方资料：Codex CLI https://developers.openai.com/codex/cli；Codex MCP https://developers.openai.com/codex/mcp；Apply Patch https://developers.openai.com/api/docs/guides/tools-apply-patch；Tool Search https://developers.openai.com/api/docs/guides/tools-tool-search；Shell https://developers.openai.com/api/docs/guides/tools-shell；Web Search https://developers.openai.com/api/docs/guides/tools-web-search；Agents SDK https://developers.openai.com/api/docs/guides/agents | exec: .refs/openai-codex/codex-rs/core/src/tools/handlers/shell_spec.rs:20,103,217,229,267；unified_exec/exec_command.rs:72,222,236,279,291；write_stdin.rs:32,47,100；process_manager.rs:432,443,578,595,643,668,1093,1219 | output: .refs/openai-codex/codex-rs/core/src/tools/context.rs:66,148,235,308,318,404,427；events.rs:54,167,316,337,395 | aigl: F:/AIGril/electron/humanclaw-agent-runner.cjs:3544,3545,3561,3562,5175,5197,5223,5484,5607,5678,5798；humanclaw-tool-contracts.cjs:538,584,661,682；humanclaw-runtime.cjs:471,528,771,923；humanclaw-gateway.cjs:663,717,734,885,1635,1695

---

## 第 031 页｜ProcessManager 生命周期

**分组**：Shell / Session / `EXEC-RUNTIME`

**优先级**：P0

**结论**：ProcessManager 管理启动、收集输出、stdin 写入、完成状态和进程数量上限，是 Codex shell 能力的核心。

**Codex 机制**：Codex 的 shell 能力是 exec_command + write_stdin + ProcessManager，而不是一次性命令。它支持 session_id、轮询、stdin、yield_time_ms、max_output_tokens、原始 token 计数和输出截断。

**AIGL 差距**：AIGL 有 computer.exec、session_start、pty_* 和 code.test 等多条执行路径，模型侧入口碎片化；长任务和脚本输出不总能稳定成为 answer-bearing evidence。

**改造建议**：新增 Codex 同型 exec_command/write_stdin 表面，旧 exec/PTY/process_read 降为内部后端；所有命令输出统一 ToolOutput 和 transcript。

**验收点**：pnpm test、Python 脚本、交互式 REPL 都能返回 session_id；空 write_stdin 可轮询；最终 transcript 包含 exit_code、stdout、stderr、original_token_count。

**证据**：official; exec; output; aigl

**证据展开**：official: 官方资料：Codex CLI https://developers.openai.com/codex/cli；Codex MCP https://developers.openai.com/codex/mcp；Apply Patch https://developers.openai.com/api/docs/guides/tools-apply-patch；Tool Search https://developers.openai.com/api/docs/guides/tools-tool-search；Shell https://developers.openai.com/api/docs/guides/tools-shell；Web Search https://developers.openai.com/api/docs/guides/tools-web-search；Agents SDK https://developers.openai.com/api/docs/guides/agents | exec: .refs/openai-codex/codex-rs/core/src/tools/handlers/shell_spec.rs:20,103,217,229,267；unified_exec/exec_command.rs:72,222,236,279,291；write_stdin.rs:32,47,100；process_manager.rs:432,443,578,595,643,668,1093,1219 | output: .refs/openai-codex/codex-rs/core/src/tools/context.rs:66,148,235,308,318,404,427；events.rs:54,167,316,337,395 | aigl: F:/AIGril/electron/humanclaw-agent-runner.cjs:3544,3545,3561,3562,5175,5197,5223,5484,5607,5678,5798；humanclaw-tool-contracts.cjs:538,584,661,682；humanclaw-runtime.cjs:471,528,771,923；humanclaw-gateway.cjs:663,717,734,885,1635,1695

---

## 第 032 页｜yield_time_ms 与 deadline

**分组**：Shell / Session / `EXEC-RUNTIME`

**优先级**：P0

**结论**：Codex 会 clamp yield time，并按 deadline 收集输出；模型不需要猜等待多久，也不会让命令无限阻塞。

**Codex 机制**：Codex 的 shell 能力是 exec_command + write_stdin + ProcessManager，而不是一次性命令。它支持 session_id、轮询、stdin、yield_time_ms、max_output_tokens、原始 token 计数和输出截断。

**AIGL 差距**：AIGL 有 computer.exec、session_start、pty_* 和 code.test 等多条执行路径，模型侧入口碎片化；长任务和脚本输出不总能稳定成为 answer-bearing evidence。

**改造建议**：新增 Codex 同型 exec_command/write_stdin 表面，旧 exec/PTY/process_read 降为内部后端；所有命令输出统一 ToolOutput 和 transcript。

**验收点**：pnpm test、Python 脚本、交互式 REPL 都能返回 session_id；空 write_stdin 可轮询；最终 transcript 包含 exit_code、stdout、stderr、original_token_count。

**证据**：official; exec; output; aigl

**证据展开**：official: 官方资料：Codex CLI https://developers.openai.com/codex/cli；Codex MCP https://developers.openai.com/codex/mcp；Apply Patch https://developers.openai.com/api/docs/guides/tools-apply-patch；Tool Search https://developers.openai.com/api/docs/guides/tools-tool-search；Shell https://developers.openai.com/api/docs/guides/tools-shell；Web Search https://developers.openai.com/api/docs/guides/tools-web-search；Agents SDK https://developers.openai.com/api/docs/guides/agents | exec: .refs/openai-codex/codex-rs/core/src/tools/handlers/shell_spec.rs:20,103,217,229,267；unified_exec/exec_command.rs:72,222,236,279,291；write_stdin.rs:32,47,100；process_manager.rs:432,443,578,595,643,668,1093,1219 | output: .refs/openai-codex/codex-rs/core/src/tools/context.rs:66,148,235,308,318,404,427；events.rs:54,167,316,337,395 | aigl: F:/AIGril/electron/humanclaw-agent-runner.cjs:3544,3545,3561,3562,5175,5197,5223,5484,5607,5678,5798；humanclaw-tool-contracts.cjs:538,584,661,682；humanclaw-runtime.cjs:471,528,771,923；humanclaw-gateway.cjs:663,717,734,885,1635,1695

---

## 第 033 页｜输出 token accounting

**分组**：Shell / Session / `EXEC-RUNTIME`

**优先级**：P0

**结论**：Codex 计算 original_token_count，再按 max_output_tokens/truncation policy 返回模型可见文本；AIGL 的日志/摘要也应保留原始规模元数据。

**Codex 机制**：Codex 的 shell 能力是 exec_command + write_stdin + ProcessManager，而不是一次性命令。它支持 session_id、轮询、stdin、yield_time_ms、max_output_tokens、原始 token 计数和输出截断。

**AIGL 差距**：AIGL 有 computer.exec、session_start、pty_* 和 code.test 等多条执行路径，模型侧入口碎片化；长任务和脚本输出不总能稳定成为 answer-bearing evidence。

**改造建议**：新增 Codex 同型 exec_command/write_stdin 表面，旧 exec/PTY/process_read 降为内部后端；所有命令输出统一 ToolOutput 和 transcript。

**验收点**：pnpm test、Python 脚本、交互式 REPL 都能返回 session_id；空 write_stdin 可轮询；最终 transcript 包含 exit_code、stdout、stderr、original_token_count。

**证据**：official; exec; output; aigl

**证据展开**：official: 官方资料：Codex CLI https://developers.openai.com/codex/cli；Codex MCP https://developers.openai.com/codex/mcp；Apply Patch https://developers.openai.com/api/docs/guides/tools-apply-patch；Tool Search https://developers.openai.com/api/docs/guides/tools-tool-search；Shell https://developers.openai.com/api/docs/guides/tools-shell；Web Search https://developers.openai.com/api/docs/guides/tools-web-search；Agents SDK https://developers.openai.com/api/docs/guides/agents | exec: .refs/openai-codex/codex-rs/core/src/tools/handlers/shell_spec.rs:20,103,217,229,267；unified_exec/exec_command.rs:72,222,236,279,291；write_stdin.rs:32,47,100；process_manager.rs:432,443,578,595,643,668,1093,1219 | output: .refs/openai-codex/codex-rs/core/src/tools/context.rs:66,148,235,308,318,404,427；events.rs:54,167,316,337,395 | aigl: F:/AIGril/electron/humanclaw-agent-runner.cjs:3544,3545,3561,3562,5175,5197,5223,5484,5607,5678,5798；humanclaw-tool-contracts.cjs:538,584,661,682；humanclaw-runtime.cjs:471,528,771,923；humanclaw-gateway.cjs:663,717,734,885,1635,1695

---

## 第 034 页｜Session Cap 与资源治理

**分组**：Shell / Session / `EXEC-RUNTIME`

**优先级**：P0

**结论**：长进程能力必须配套最大进程数和清理策略，否则 agent 会在 benchmark 或长任务中泄漏资源。

**Codex 机制**：Codex 的 shell 能力是 exec_command + write_stdin + ProcessManager，而不是一次性命令。它支持 session_id、轮询、stdin、yield_time_ms、max_output_tokens、原始 token 计数和输出截断。

**AIGL 差距**：AIGL 有 computer.exec、session_start、pty_* 和 code.test 等多条执行路径，模型侧入口碎片化；长任务和脚本输出不总能稳定成为 answer-bearing evidence。

**改造建议**：新增 Codex 同型 exec_command/write_stdin 表面，旧 exec/PTY/process_read 降为内部后端；所有命令输出统一 ToolOutput 和 transcript。

**验收点**：pnpm test、Python 脚本、交互式 REPL 都能返回 session_id；空 write_stdin 可轮询；最终 transcript 包含 exit_code、stdout、stderr、original_token_count。

**证据**：official; exec; output; aigl

**证据展开**：official: 官方资料：Codex CLI https://developers.openai.com/codex/cli；Codex MCP https://developers.openai.com/codex/mcp；Apply Patch https://developers.openai.com/api/docs/guides/tools-apply-patch；Tool Search https://developers.openai.com/api/docs/guides/tools-tool-search；Shell https://developers.openai.com/api/docs/guides/tools-shell；Web Search https://developers.openai.com/api/docs/guides/tools-web-search；Agents SDK https://developers.openai.com/api/docs/guides/agents | exec: .refs/openai-codex/codex-rs/core/src/tools/handlers/shell_spec.rs:20,103,217,229,267；unified_exec/exec_command.rs:72,222,236,279,291；write_stdin.rs:32,47,100；process_manager.rs:432,443,578,595,643,668,1093,1219 | output: .refs/openai-codex/codex-rs/core/src/tools/context.rs:66,148,235,308,318,404,427；events.rs:54,167,316,337,395 | aigl: F:/AIGril/electron/humanclaw-agent-runner.cjs:3544,3545,3561,3562,5175,5197,5223,5484,5607,5678,5798；humanclaw-tool-contracts.cjs:538,584,661,682；humanclaw-runtime.cjs:471,528,771,923；humanclaw-gateway.cjs:663,717,734,885,1635,1695

---

## 第 035 页｜Windows Sandbox 注意事项

**分组**：Shell / Session / `EXEC-RUNTIME`

**优先级**：P0

**结论**：本项目在 Windows 上运行，Codex 源码有 Windows sandbox 分支；AIGL 的执行层也要把路径、权限、shell 语义作为平台差异处理。

**Codex 机制**：Codex 的 shell 能力是 exec_command + write_stdin + ProcessManager，而不是一次性命令。它支持 session_id、轮询、stdin、yield_time_ms、max_output_tokens、原始 token 计数和输出截断。

**AIGL 差距**：AIGL 有 computer.exec、session_start、pty_* 和 code.test 等多条执行路径，模型侧入口碎片化；长任务和脚本输出不总能稳定成为 answer-bearing evidence。

**改造建议**：新增 Codex 同型 exec_command/write_stdin 表面，旧 exec/PTY/process_read 降为内部后端；所有命令输出统一 ToolOutput 和 transcript。

**验收点**：pnpm test、Python 脚本、交互式 REPL 都能返回 session_id；空 write_stdin 可轮询；最终 transcript 包含 exit_code、stdout、stderr、original_token_count。

**证据**：official; exec; output; aigl

**证据展开**：official: 官方资料：Codex CLI https://developers.openai.com/codex/cli；Codex MCP https://developers.openai.com/codex/mcp；Apply Patch https://developers.openai.com/api/docs/guides/tools-apply-patch；Tool Search https://developers.openai.com/api/docs/guides/tools-tool-search；Shell https://developers.openai.com/api/docs/guides/tools-shell；Web Search https://developers.openai.com/api/docs/guides/tools-web-search；Agents SDK https://developers.openai.com/api/docs/guides/agents | exec: .refs/openai-codex/codex-rs/core/src/tools/handlers/shell_spec.rs:20,103,217,229,267；unified_exec/exec_command.rs:72,222,236,279,291；write_stdin.rs:32,47,100；process_manager.rs:432,443,578,595,643,668,1093,1219 | output: .refs/openai-codex/codex-rs/core/src/tools/context.rs:66,148,235,308,318,404,427；events.rs:54,167,316,337,395 | aigl: F:/AIGril/electron/humanclaw-agent-runner.cjs:3544,3545,3561,3562,5175,5197,5223,5484,5607,5678,5798；humanclaw-tool-contracts.cjs:538,584,661,682；humanclaw-runtime.cjs:471,528,771,923；humanclaw-gateway.cjs:663,717,734,885,1635,1695

---

## 第 036 页｜Shell Tool 不是裸 shell

**分组**：Shell / Session / `EXEC-RUNTIME`

**优先级**：P0

**结论**：官方 Shell 工具语义和 Codex 源码都说明 shell 应是受控 runtime，而不是让模型拼接任意字符串后直接执行。

**Codex 机制**：Codex 的 shell 能力是 exec_command + write_stdin + ProcessManager，而不是一次性命令。它支持 session_id、轮询、stdin、yield_time_ms、max_output_tokens、原始 token 计数和输出截断。

**AIGL 差距**：AIGL 有 computer.exec、session_start、pty_* 和 code.test 等多条执行路径，模型侧入口碎片化；长任务和脚本输出不总能稳定成为 answer-bearing evidence。

**改造建议**：新增 Codex 同型 exec_command/write_stdin 表面，旧 exec/PTY/process_read 降为内部后端；所有命令输出统一 ToolOutput 和 transcript。

**验收点**：pnpm test、Python 脚本、交互式 REPL 都能返回 session_id；空 write_stdin 可轮询；最终 transcript 包含 exit_code、stdout、stderr、original_token_count。

**证据**：official; exec; output; aigl

**证据展开**：official: 官方资料：Codex CLI https://developers.openai.com/codex/cli；Codex MCP https://developers.openai.com/codex/mcp；Apply Patch https://developers.openai.com/api/docs/guides/tools-apply-patch；Tool Search https://developers.openai.com/api/docs/guides/tools-tool-search；Shell https://developers.openai.com/api/docs/guides/tools-shell；Web Search https://developers.openai.com/api/docs/guides/tools-web-search；Agents SDK https://developers.openai.com/api/docs/guides/agents | exec: .refs/openai-codex/codex-rs/core/src/tools/handlers/shell_spec.rs:20,103,217,229,267；unified_exec/exec_command.rs:72,222,236,279,291；write_stdin.rs:32,47,100；process_manager.rs:432,443,578,595,643,668,1093,1219 | output: .refs/openai-codex/codex-rs/core/src/tools/context.rs:66,148,235,308,318,404,427；events.rs:54,167,316,337,395 | aigl: F:/AIGril/electron/humanclaw-agent-runner.cjs:3544,3545,3561,3562,5175,5197,5223,5484,5607,5678,5798；humanclaw-tool-contracts.cjs:538,584,661,682；humanclaw-runtime.cjs:471,528,771,923；humanclaw-gateway.cjs:663,717,734,885,1635,1695

---

## 第 037 页｜apply_patch schema

**分组**：Patch / Permission / `SAFE-EDIT`

**优先级**：P0

**结论**：Apply Patch 的意义是让模型提出结构化 diff，由 runtime 验证并应用；这比 echo/sed 覆盖源码安全得多。

**Codex 机制**：Codex 把 apply_patch 和 request_permissions 做成一等工具：补丁先验证再应用，权限不足时模型调用正式权限申请工具，而不是在自然语言里请求用户批准。

**AIGL 差距**：AIGL 已有 apply_patch、request_permissions contract 和路径守卫，但普通任务仍可能把源码修改、脚本执行、权限阻断混在 meta JSON plan 里，缺少统一生命周期。

**改造建议**：将 source edit 默认路由到 apply_patch；将权限不足返回 permission_pending；grant 后原工具链可续跑，并记录 patch/permission 事件。

**验收点**：越界 patch 被拒绝；hunk 不匹配失败；read-only profile 下写入会触发 request_permissions；grant 后继续执行而不是重开任务。

**证据**：official; patch_perm; aigl

**证据展开**：official: 官方资料：Codex CLI https://developers.openai.com/codex/cli；Codex MCP https://developers.openai.com/codex/mcp；Apply Patch https://developers.openai.com/api/docs/guides/tools-apply-patch；Tool Search https://developers.openai.com/api/docs/guides/tools-tool-search；Shell https://developers.openai.com/api/docs/guides/tools-shell；Web Search https://developers.openai.com/api/docs/guides/tools-web-search；Agents SDK https://developers.openai.com/api/docs/guides/agents | patch_perm: .refs/openai-codex/codex-rs/core/src/tools/handlers/apply_patch.rs:301,313,363,442,502,515；request_permissions.rs:32,55,64,78；permissions_instructions.rs:62 | aigl: F:/AIGril/electron/humanclaw-agent-runner.cjs:3544,3545,3561,3562,5175,5197,5223,5484,5607,5678,5798；humanclaw-tool-contracts.cjs:538,584,661,682；humanclaw-runtime.cjs:471,528,771,923；humanclaw-gateway.cjs:663,717,734,885,1635,1695

---

## 第 038 页｜apply_patch verification

**分组**：Patch / Permission / `SAFE-EDIT`

**优先级**：P0

**结论**：Codex apply_patch handler 会先验证参数、路径和 correctness error，再决定应用或返回错误。AIGL 应把失败暴露给模型修复。

**Codex 机制**：Codex 把 apply_patch 和 request_permissions 做成一等工具：补丁先验证再应用，权限不足时模型调用正式权限申请工具，而不是在自然语言里请求用户批准。

**AIGL 差距**：AIGL 已有 apply_patch、request_permissions contract 和路径守卫，但普通任务仍可能把源码修改、脚本执行、权限阻断混在 meta JSON plan 里，缺少统一生命周期。

**改造建议**：将 source edit 默认路由到 apply_patch；将权限不足返回 permission_pending；grant 后原工具链可续跑，并记录 patch/permission 事件。

**验收点**：越界 patch 被拒绝；hunk 不匹配失败；read-only profile 下写入会触发 request_permissions；grant 后继续执行而不是重开任务。

**证据**：official; patch_perm; aigl

**证据展开**：official: 官方资料：Codex CLI https://developers.openai.com/codex/cli；Codex MCP https://developers.openai.com/codex/mcp；Apply Patch https://developers.openai.com/api/docs/guides/tools-apply-patch；Tool Search https://developers.openai.com/api/docs/guides/tools-tool-search；Shell https://developers.openai.com/api/docs/guides/tools-shell；Web Search https://developers.openai.com/api/docs/guides/tools-web-search；Agents SDK https://developers.openai.com/api/docs/guides/agents | patch_perm: .refs/openai-codex/codex-rs/core/src/tools/handlers/apply_patch.rs:301,313,363,442,502,515；request_permissions.rs:32,55,64,78；permissions_instructions.rs:62 | aigl: F:/AIGril/electron/humanclaw-agent-runner.cjs:3544,3545,3561,3562,5175,5197,5223,5484,5607,5678,5798；humanclaw-tool-contracts.cjs:538,584,661,682；humanclaw-runtime.cjs:471,528,771,923；humanclaw-gateway.cjs:663,717,734,885,1635,1695

---

## 第 039 页｜exec 中拦截 patch

**分组**：Patch / Permission / `SAFE-EDIT`

**优先级**：P0

**结论**：Codex 即使模型把 patch 放进 shell command，也会尝试 intercept_apply_patch；这说明源码修改主路径应被 runtime 强制收口。

**Codex 机制**：Codex 把 apply_patch 和 request_permissions 做成一等工具：补丁先验证再应用，权限不足时模型调用正式权限申请工具，而不是在自然语言里请求用户批准。

**AIGL 差距**：AIGL 已有 apply_patch、request_permissions contract 和路径守卫，但普通任务仍可能把源码修改、脚本执行、权限阻断混在 meta JSON plan 里，缺少统一生命周期。

**改造建议**：将 source edit 默认路由到 apply_patch；将权限不足返回 permission_pending；grant 后原工具链可续跑，并记录 patch/permission 事件。

**验收点**：越界 patch 被拒绝；hunk 不匹配失败；read-only profile 下写入会触发 request_permissions；grant 后继续执行而不是重开任务。

**证据**：official; patch_perm; aigl

**证据展开**：official: 官方资料：Codex CLI https://developers.openai.com/codex/cli；Codex MCP https://developers.openai.com/codex/mcp；Apply Patch https://developers.openai.com/api/docs/guides/tools-apply-patch；Tool Search https://developers.openai.com/api/docs/guides/tools-tool-search；Shell https://developers.openai.com/api/docs/guides/tools-shell；Web Search https://developers.openai.com/api/docs/guides/tools-web-search；Agents SDK https://developers.openai.com/api/docs/guides/agents | patch_perm: .refs/openai-codex/codex-rs/core/src/tools/handlers/apply_patch.rs:301,313,363,442,502,515；request_permissions.rs:32,55,64,78；permissions_instructions.rs:62 | aigl: F:/AIGril/electron/humanclaw-agent-runner.cjs:3544,3545,3561,3562,5175,5197,5223,5484,5607,5678,5798；humanclaw-tool-contracts.cjs:538,584,661,682；humanclaw-runtime.cjs:471,528,771,923；humanclaw-gateway.cjs:663,717,734,885,1635,1695

---

## 第 040 页｜Patch Events 与 Delta

**分组**：Patch / Permission / `SAFE-EDIT`

**优先级**：P0

**结论**：patch success/failure 应进入 ToolEvent，并携带 changed files 或 delta；这能支撑 UI、回滚、审计和测试选择。

**Codex 机制**：Codex 把 apply_patch 和 request_permissions 做成一等工具：补丁先验证再应用，权限不足时模型调用正式权限申请工具，而不是在自然语言里请求用户批准。

**AIGL 差距**：AIGL 已有 apply_patch、request_permissions contract 和路径守卫，但普通任务仍可能把源码修改、脚本执行、权限阻断混在 meta JSON plan 里，缺少统一生命周期。

**改造建议**：将 source edit 默认路由到 apply_patch；将权限不足返回 permission_pending；grant 后原工具链可续跑，并记录 patch/permission 事件。

**验收点**：越界 patch 被拒绝；hunk 不匹配失败；read-only profile 下写入会触发 request_permissions；grant 后继续执行而不是重开任务。

**证据**：official; patch_perm; aigl

**证据展开**：official: 官方资料：Codex CLI https://developers.openai.com/codex/cli；Codex MCP https://developers.openai.com/codex/mcp；Apply Patch https://developers.openai.com/api/docs/guides/tools-apply-patch；Tool Search https://developers.openai.com/api/docs/guides/tools-tool-search；Shell https://developers.openai.com/api/docs/guides/tools-shell；Web Search https://developers.openai.com/api/docs/guides/tools-web-search；Agents SDK https://developers.openai.com/api/docs/guides/agents | patch_perm: .refs/openai-codex/codex-rs/core/src/tools/handlers/apply_patch.rs:301,313,363,442,502,515；request_permissions.rs:32,55,64,78；permissions_instructions.rs:62 | aigl: F:/AIGril/electron/humanclaw-agent-runner.cjs:3544,3545,3561,3562,5175,5197,5223,5484,5607,5678,5798；humanclaw-tool-contracts.cjs:538,584,661,682；humanclaw-runtime.cjs:471,528,771,923；humanclaw-gateway.cjs:663,717,734,885,1635,1695

---

## 第 041 页｜request_permissions Tool

**分组**：Patch / Permission / `SAFE-EDIT`

**优先级**：P0

**结论**：Codex 的 request_permissions 是正式工具，handler 会校验 permissions profile 并等待用户/系统响应。

**Codex 机制**：Codex 把 apply_patch 和 request_permissions 做成一等工具：补丁先验证再应用，权限不足时模型调用正式权限申请工具，而不是在自然语言里请求用户批准。

**AIGL 差距**：AIGL 已有 apply_patch、request_permissions contract 和路径守卫，但普通任务仍可能把源码修改、脚本执行、权限阻断混在 meta JSON plan 里，缺少统一生命周期。

**改造建议**：将 source edit 默认路由到 apply_patch；将权限不足返回 permission_pending；grant 后原工具链可续跑，并记录 patch/permission 事件。

**验收点**：越界 patch 被拒绝；hunk 不匹配失败；read-only profile 下写入会触发 request_permissions；grant 后继续执行而不是重开任务。

**证据**：official; patch_perm; aigl

**证据展开**：official: 官方资料：Codex CLI https://developers.openai.com/codex/cli；Codex MCP https://developers.openai.com/codex/mcp；Apply Patch https://developers.openai.com/api/docs/guides/tools-apply-patch；Tool Search https://developers.openai.com/api/docs/guides/tools-tool-search；Shell https://developers.openai.com/api/docs/guides/tools-shell；Web Search https://developers.openai.com/api/docs/guides/tools-web-search；Agents SDK https://developers.openai.com/api/docs/guides/agents | patch_perm: .refs/openai-codex/codex-rs/core/src/tools/handlers/apply_patch.rs:301,313,363,442,502,515；request_permissions.rs:32,55,64,78；permissions_instructions.rs:62 | aigl: F:/AIGril/electron/humanclaw-agent-runner.cjs:3544,3545,3561,3562,5175,5197,5223,5484,5607,5678,5798；humanclaw-tool-contracts.cjs:538,584,661,682；humanclaw-runtime.cjs:471,528,771,923；humanclaw-gateway.cjs:663,717,734,885,1635,1695

---

## 第 042 页｜Permission Profile

**分组**：Patch / Permission / `SAFE-EDIT`

**优先级**：P0

**结论**：权限环境应由 runtime 写进模型上下文，并由 policy 判断 allow/deny/request_permission；不应靠模型自觉避险。

**Codex 机制**：Codex 把 apply_patch 和 request_permissions 做成一等工具：补丁先验证再应用，权限不足时模型调用正式权限申请工具，而不是在自然语言里请求用户批准。

**AIGL 差距**：AIGL 已有 apply_patch、request_permissions contract 和路径守卫，但普通任务仍可能把源码修改、脚本执行、权限阻断混在 meta JSON plan 里，缺少统一生命周期。

**改造建议**：将 source edit 默认路由到 apply_patch；将权限不足返回 permission_pending；grant 后原工具链可续跑，并记录 patch/permission 事件。

**验收点**：越界 patch 被拒绝；hunk 不匹配失败；read-only profile 下写入会触发 request_permissions；grant 后继续执行而不是重开任务。

**证据**：official; patch_perm; aigl

**证据展开**：official: 官方资料：Codex CLI https://developers.openai.com/codex/cli；Codex MCP https://developers.openai.com/codex/mcp；Apply Patch https://developers.openai.com/api/docs/guides/tools-apply-patch；Tool Search https://developers.openai.com/api/docs/guides/tools-tool-search；Shell https://developers.openai.com/api/docs/guides/tools-shell；Web Search https://developers.openai.com/api/docs/guides/tools-web-search；Agents SDK https://developers.openai.com/api/docs/guides/agents | patch_perm: .refs/openai-codex/codex-rs/core/src/tools/handlers/apply_patch.rs:301,313,363,442,502,515；request_permissions.rs:32,55,64,78；permissions_instructions.rs:62 | aigl: F:/AIGril/electron/humanclaw-agent-runner.cjs:3544,3545,3561,3562,5175,5197,5223,5484,5607,5678,5798；humanclaw-tool-contracts.cjs:538,584,661,682；humanclaw-runtime.cjs:471,528,771,923；humanclaw-gateway.cjs:663,717,734,885,1635,1695

---

## 第 043 页｜Approval/Sandbox Policy

**分组**：Patch / Permission / `SAFE-EDIT`

**优先级**：P0

**结论**：安全边界包括 filesystem、network、shell、destructive command 和 prefix rule。AIGL 需要统一策略，不要让各工具各自判断。

**Codex 机制**：Codex 把 apply_patch 和 request_permissions 做成一等工具：补丁先验证再应用，权限不足时模型调用正式权限申请工具，而不是在自然语言里请求用户批准。

**AIGL 差距**：AIGL 已有 apply_patch、request_permissions contract 和路径守卫，但普通任务仍可能把源码修改、脚本执行、权限阻断混在 meta JSON plan 里，缺少统一生命周期。

**改造建议**：将 source edit 默认路由到 apply_patch；将权限不足返回 permission_pending；grant 后原工具链可续跑，并记录 patch/permission 事件。

**验收点**：越界 patch 被拒绝；hunk 不匹配失败；read-only profile 下写入会触发 request_permissions；grant 后继续执行而不是重开任务。

**证据**：official; patch_perm; aigl

**证据展开**：official: 官方资料：Codex CLI https://developers.openai.com/codex/cli；Codex MCP https://developers.openai.com/codex/mcp；Apply Patch https://developers.openai.com/api/docs/guides/tools-apply-patch；Tool Search https://developers.openai.com/api/docs/guides/tools-tool-search；Shell https://developers.openai.com/api/docs/guides/tools-shell；Web Search https://developers.openai.com/api/docs/guides/tools-web-search；Agents SDK https://developers.openai.com/api/docs/guides/agents | patch_perm: .refs/openai-codex/codex-rs/core/src/tools/handlers/apply_patch.rs:301,313,363,442,502,515；request_permissions.rs:32,55,64,78；permissions_instructions.rs:62 | aigl: F:/AIGril/electron/humanclaw-agent-runner.cjs:3544,3545,3561,3562,5175,5197,5223,5484,5607,5678,5798；humanclaw-tool-contracts.cjs:538,584,661,682；humanclaw-runtime.cjs:471,528,771,923；humanclaw-gateway.cjs:663,717,734,885,1635,1695

---

## 第 044 页｜危险命令与安全命令

**分组**：Patch / Permission / `SAFE-EDIT`

**优先级**：P0

**结论**：Codex 的 exec policy 区分 safe command、危险操作和审批路径；AIGL 至少要对删除、移动、网络、workspace 外写入做硬规则。

**Codex 机制**：Codex 把 apply_patch 和 request_permissions 做成一等工具：补丁先验证再应用，权限不足时模型调用正式权限申请工具，而不是在自然语言里请求用户批准。

**AIGL 差距**：AIGL 已有 apply_patch、request_permissions contract 和路径守卫，但普通任务仍可能把源码修改、脚本执行、权限阻断混在 meta JSON plan 里，缺少统一生命周期。

**改造建议**：将 source edit 默认路由到 apply_patch；将权限不足返回 permission_pending；grant 后原工具链可续跑，并记录 patch/permission 事件。

**验收点**：越界 patch 被拒绝；hunk 不匹配失败；read-only profile 下写入会触发 request_permissions；grant 后继续执行而不是重开任务。

**证据**：official; patch_perm; aigl

**证据展开**：official: 官方资料：Codex CLI https://developers.openai.com/codex/cli；Codex MCP https://developers.openai.com/codex/mcp；Apply Patch https://developers.openai.com/api/docs/guides/tools-apply-patch；Tool Search https://developers.openai.com/api/docs/guides/tools-tool-search；Shell https://developers.openai.com/api/docs/guides/tools-shell；Web Search https://developers.openai.com/api/docs/guides/tools-web-search；Agents SDK https://developers.openai.com/api/docs/guides/agents | patch_perm: .refs/openai-codex/codex-rs/core/src/tools/handlers/apply_patch.rs:301,313,363,442,502,515；request_permissions.rs:32,55,64,78；permissions_instructions.rs:62 | aigl: F:/AIGril/electron/humanclaw-agent-runner.cjs:3544,3545,3561,3562,5175,5197,5223,5484,5607,5678,5798；humanclaw-tool-contracts.cjs:538,584,661,682；humanclaw-runtime.cjs:471,528,771,923；humanclaw-gateway.cjs:663,717,734,885,1635,1695

---

## 第 045 页｜Grant 后续跑

**分组**：Patch / Permission / `SAFE-EDIT`

**优先级**：P0

**结论**：权限申请的价值在于 grant 后继续原任务，而不是把当前轮中断成用户手工操作。AIGL 需要 grant store 和 retry continuation。

**Codex 机制**：Codex 把 apply_patch 和 request_permissions 做成一等工具：补丁先验证再应用，权限不足时模型调用正式权限申请工具，而不是在自然语言里请求用户批准。

**AIGL 差距**：AIGL 已有 apply_patch、request_permissions contract 和路径守卫，但普通任务仍可能把源码修改、脚本执行、权限阻断混在 meta JSON plan 里，缺少统一生命周期。

**改造建议**：将 source edit 默认路由到 apply_patch；将权限不足返回 permission_pending；grant 后原工具链可续跑，并记录 patch/permission 事件。

**验收点**：越界 patch 被拒绝；hunk 不匹配失败；read-only profile 下写入会触发 request_permissions；grant 后继续执行而不是重开任务。

**证据**：official; patch_perm; aigl

**证据展开**：official: 官方资料：Codex CLI https://developers.openai.com/codex/cli；Codex MCP https://developers.openai.com/codex/mcp；Apply Patch https://developers.openai.com/api/docs/guides/tools-apply-patch；Tool Search https://developers.openai.com/api/docs/guides/tools-tool-search；Shell https://developers.openai.com/api/docs/guides/tools-shell；Web Search https://developers.openai.com/api/docs/guides/tools-web-search；Agents SDK https://developers.openai.com/api/docs/guides/agents | patch_perm: .refs/openai-codex/codex-rs/core/src/tools/handlers/apply_patch.rs:301,313,363,442,502,515；request_permissions.rs:32,55,64,78；permissions_instructions.rs:62 | aigl: F:/AIGril/electron/humanclaw-agent-runner.cjs:3544,3545,3561,3562,5175,5197,5223,5484,5607,5678,5798；humanclaw-tool-contracts.cjs:538,584,661,682；humanclaw-runtime.cjs:471,528,771,923；humanclaw-gateway.cjs:663,717,734,885,1635,1695

---

## 第 046 页｜ToolOutput Family

**分组**：观测与证据 / `EVIDENCE`

**优先级**：P0

**结论**：Codex 有 McpToolOutput、ToolSearchOutput、FunctionToolOutput、ApplyPatchToolOutput、ExecCommandToolOutput；不同工具输出语义不同。

**Codex 机制**：Codex 将工具结果、事件、截断、遥测 preview 和上下文压缩分别处理：UI 可以丰富，模型上下文必须小而准；失败和拒绝也都是正式事件。

**AIGL 差距**：AIGL 的 observation 目前仍过度依赖 preview/digest；ClinicalTrials 和 PPT 案例说明答案可能出现在过程里，但 finalizer 未拿到稳定证据槽。

**改造建议**：建立 EvidenceArtifact：原始 stdout、JSON path、网页字段、PDF 页码、截图帧、表格行都用 artifact id 保存，model-facing 只传摘要和引用。

**验收点**：finalizer 输入含 artifact refs；如果答案只在截断外，finalizer 必须请求读取 artifact 而不是空提交或猜答案。

**证据**：output; exec; aigl; gaia

**证据展开**：output: .refs/openai-codex/codex-rs/core/src/tools/context.rs:66,148,235,308,318,404,427；events.rs:54,167,316,337,395 | exec: .refs/openai-codex/codex-rs/core/src/tools/handlers/shell_spec.rs:20,103,217,229,267；unified_exec/exec_command.rs:72,222,236,279,291；write_stdin.rs:32,47,100；process_manager.rs:432,443,578,595,643,668,1093,1219 | aigl: F:/AIGril/electron/humanclaw-agent-runner.cjs:3544,3545,3561,3562,5175,5197,5223,5484,5607,5678,5798；humanclaw-tool-contracts.cjs:538,584,661,682；humanclaw-runtime.cjs:471,528,771,923；humanclaw-gateway.cjs:663,717,734,885,1635,1695 | gaia: F:/AIGril/scripts/run-gaia-level1-lite.mjs:328,355,414,425,600,622；F:/AIGril/eval-results/engineering/gaia-official/*20260611*.summary.json；F:/AIGril/docs/aigl-vs-codex-gaia-failure-source-report-20260611.md

---

## 第 047 页｜MCP Output Wrapping

**分组**：观测与证据 / `EVIDENCE`

**优先级**：P0

**结论**：MCP 结果不应直接拍平成文本，而要保留 server/tool/content/isError 等结构；否则 finalizer 无法判断可信来源。

**Codex 机制**：Codex 将工具结果、事件、截断、遥测 preview 和上下文压缩分别处理：UI 可以丰富，模型上下文必须小而准；失败和拒绝也都是正式事件。

**AIGL 差距**：AIGL 的 observation 目前仍过度依赖 preview/digest；ClinicalTrials 和 PPT 案例说明答案可能出现在过程里，但 finalizer 未拿到稳定证据槽。

**改造建议**：建立 EvidenceArtifact：原始 stdout、JSON path、网页字段、PDF 页码、截图帧、表格行都用 artifact id 保存，model-facing 只传摘要和引用。

**验收点**：finalizer 输入含 artifact refs；如果答案只在截断外，finalizer 必须请求读取 artifact 而不是空提交或猜答案。

**证据**：output; exec; aigl; gaia

**证据展开**：output: .refs/openai-codex/codex-rs/core/src/tools/context.rs:66,148,235,308,318,404,427；events.rs:54,167,316,337,395 | exec: .refs/openai-codex/codex-rs/core/src/tools/handlers/shell_spec.rs:20,103,217,229,267；unified_exec/exec_command.rs:72,222,236,279,291；write_stdin.rs:32,47,100；process_manager.rs:432,443,578,595,643,668,1093,1219 | aigl: F:/AIGril/electron/humanclaw-agent-runner.cjs:3544,3545,3561,3562,5175,5197,5223,5484,5607,5678,5798；humanclaw-tool-contracts.cjs:538,584,661,682；humanclaw-runtime.cjs:471,528,771,923；humanclaw-gateway.cjs:663,717,734,885,1635,1695 | gaia: F:/AIGril/scripts/run-gaia-level1-lite.mjs:328,355,414,425,600,622；F:/AIGril/eval-results/engineering/gaia-official/*20260611*.summary.json；F:/AIGril/docs/aigl-vs-codex-gaia-failure-source-report-20260611.md

---

## 第 048 页｜Function Output Truncation

**分组**：观测与证据 / `EVIDENCE`

**优先级**：P0

**结论**：Codex 对函数输出和 exec 输出使用不同 truncation policy，并保留 omission/原始规模提示。AIGL 也要区分 UI trace 与 model context。

**Codex 机制**：Codex 将工具结果、事件、截断、遥测 preview 和上下文压缩分别处理：UI 可以丰富，模型上下文必须小而准；失败和拒绝也都是正式事件。

**AIGL 差距**：AIGL 的 observation 目前仍过度依赖 preview/digest；ClinicalTrials 和 PPT 案例说明答案可能出现在过程里，但 finalizer 未拿到稳定证据槽。

**改造建议**：建立 EvidenceArtifact：原始 stdout、JSON path、网页字段、PDF 页码、截图帧、表格行都用 artifact id 保存，model-facing 只传摘要和引用。

**验收点**：finalizer 输入含 artifact refs；如果答案只在截断外，finalizer 必须请求读取 artifact 而不是空提交或猜答案。

**证据**：output; exec; aigl; gaia

**证据展开**：output: .refs/openai-codex/codex-rs/core/src/tools/context.rs:66,148,235,308,318,404,427；events.rs:54,167,316,337,395 | exec: .refs/openai-codex/codex-rs/core/src/tools/handlers/shell_spec.rs:20,103,217,229,267；unified_exec/exec_command.rs:72,222,236,279,291；write_stdin.rs:32,47,100；process_manager.rs:432,443,578,595,643,668,1093,1219 | aigl: F:/AIGril/electron/humanclaw-agent-runner.cjs:3544,3545,3561,3562,5175,5197,5223,5484,5607,5678,5798；humanclaw-tool-contracts.cjs:538,584,661,682；humanclaw-runtime.cjs:471,528,771,923；humanclaw-gateway.cjs:663,717,734,885,1635,1695 | gaia: F:/AIGril/scripts/run-gaia-level1-lite.mjs:328,355,414,425,600,622；F:/AIGril/eval-results/engineering/gaia-official/*20260611*.summary.json；F:/AIGril/docs/aigl-vs-codex-gaia-failure-source-report-20260611.md

---

## 第 049 页｜Telemetry Preview

**分组**：观测与证据 / `EVIDENCE`

**优先级**：P0

**结论**：遥测 preview 应限制 bytes/lines；内部日志可以富，模型可见内容必须少而准。这能降低慢任务里的 model-wait 时间。

**Codex 机制**：Codex 将工具结果、事件、截断、遥测 preview 和上下文压缩分别处理：UI 可以丰富，模型上下文必须小而准；失败和拒绝也都是正式事件。

**AIGL 差距**：AIGL 的 observation 目前仍过度依赖 preview/digest；ClinicalTrials 和 PPT 案例说明答案可能出现在过程里，但 finalizer 未拿到稳定证据槽。

**改造建议**：建立 EvidenceArtifact：原始 stdout、JSON path、网页字段、PDF 页码、截图帧、表格行都用 artifact id 保存，model-facing 只传摘要和引用。

**验收点**：finalizer 输入含 artifact refs；如果答案只在截断外，finalizer 必须请求读取 artifact 而不是空提交或猜答案。

**证据**：output; exec; aigl; gaia

**证据展开**：output: .refs/openai-codex/codex-rs/core/src/tools/context.rs:66,148,235,308,318,404,427；events.rs:54,167,316,337,395 | exec: .refs/openai-codex/codex-rs/core/src/tools/handlers/shell_spec.rs:20,103,217,229,267；unified_exec/exec_command.rs:72,222,236,279,291；write_stdin.rs:32,47,100；process_manager.rs:432,443,578,595,643,668,1093,1219 | aigl: F:/AIGril/electron/humanclaw-agent-runner.cjs:3544,3545,3561,3562,5175,5197,5223,5484,5607,5678,5798；humanclaw-tool-contracts.cjs:538,584,661,682；humanclaw-runtime.cjs:471,528,771,923；humanclaw-gateway.cjs:663,717,734,885,1635,1695 | gaia: F:/AIGril/scripts/run-gaia-level1-lite.mjs:328,355,414,425,600,622；F:/AIGril/eval-results/engineering/gaia-official/*20260611*.summary.json；F:/AIGril/docs/aigl-vs-codex-gaia-failure-source-report-20260611.md

---

## 第 050 页｜Tool Events

**分组**：观测与证据 / `EVIDENCE`

**优先级**：P0

**结论**：Begin/Success/Failure/Rejected 事件让工具执行可观察，也让失败恢复不再依赖自然语言回忆。

**Codex 机制**：Codex 将工具结果、事件、截断、遥测 preview 和上下文压缩分别处理：UI 可以丰富，模型上下文必须小而准；失败和拒绝也都是正式事件。

**AIGL 差距**：AIGL 的 observation 目前仍过度依赖 preview/digest；ClinicalTrials 和 PPT 案例说明答案可能出现在过程里，但 finalizer 未拿到稳定证据槽。

**改造建议**：建立 EvidenceArtifact：原始 stdout、JSON path、网页字段、PDF 页码、截图帧、表格行都用 artifact id 保存，model-facing 只传摘要和引用。

**验收点**：finalizer 输入含 artifact refs；如果答案只在截断外，finalizer 必须请求读取 artifact 而不是空提交或猜答案。

**证据**：output; exec; aigl; gaia

**证据展开**：output: .refs/openai-codex/codex-rs/core/src/tools/context.rs:66,148,235,308,318,404,427；events.rs:54,167,316,337,395 | exec: .refs/openai-codex/codex-rs/core/src/tools/handlers/shell_spec.rs:20,103,217,229,267；unified_exec/exec_command.rs:72,222,236,279,291；write_stdin.rs:32,47,100；process_manager.rs:432,443,578,595,643,668,1093,1219 | aigl: F:/AIGril/electron/humanclaw-agent-runner.cjs:3544,3545,3561,3562,5175,5197,5223,5484,5607,5678,5798；humanclaw-tool-contracts.cjs:538,584,661,682；humanclaw-runtime.cjs:471,528,771,923；humanclaw-gateway.cjs:663,717,734,885,1635,1695 | gaia: F:/AIGril/scripts/run-gaia-level1-lite.mjs:328,355,414,425,600,622；F:/AIGril/eval-results/engineering/gaia-official/*20260611*.summary.json；F:/AIGril/docs/aigl-vs-codex-gaia-failure-source-report-20260611.md

---

## 第 051 页｜Compaction Window

**分组**：上下文压缩 / `MEMORY`

**优先级**：P0

**结论**：Codex 跟踪 auto_compact_window_ordinal 和 prefill tokens；AIGL 的长任务也应记录当前窗口和压缩前后 token 量。

**Codex 机制**：Codex 在 pre-sampling 和 auto-compact 路径中按 token 状态、scope limit、window ordinal 和 prefill tokens 判断是否压缩；它不是等到上下文爆掉才处理。

**AIGL 差距**：AIGL 已有 recent_turn_items 和 prompt_compaction 设计，但任务链仍可能把长日志、重复 progress、摘要 observation 多次塞回模型。

**改造建议**：把 70% 作为早压缩阈值，75-80% 生成 CODEX_MEMORY.md；active prompt 只保留最近事件、未解决证据和任务状态。

**验收点**：长任务跑到 70% 时写入检查点；新线程可从检查点继续；无 API key、token、敏感原文泄漏。

**证据**：turn; aigl; F:/AIGril/docs/aigl-codex-context-compaction.md

**证据展开**：turn: .refs/openai-codex/codex-rs/core/src/session/turn.rs:141,163,236,640,692,770,892,1098,1106,1616 | aigl: F:/AIGril/electron/humanclaw-agent-runner.cjs:3544,3545,3561,3562,5175,5197,5223,5484,5607,5678,5798；humanclaw-tool-contracts.cjs:538,584,661,682；humanclaw-runtime.cjs:471,528,771,923；humanclaw-gateway.cjs:663,717,734,885,1635,1695 | F:/AIGril/docs/aigl-codex-context-compaction.md: F:/AIGril/docs/aigl-codex-context-compaction.md

---

## 第 052 页｜Inline 与 Remote Compact

**分组**：上下文压缩 / `MEMORY`

**优先级**：P0

**结论**：Codex 有 inline/remote compaction 路径；AIGL 不必照搬服务，但必须有本地可恢复检查点，尤其在远程 compact 失败时。

**Codex 机制**：Codex 在 pre-sampling 和 auto-compact 路径中按 token 状态、scope limit、window ordinal 和 prefill tokens 判断是否压缩；它不是等到上下文爆掉才处理。

**AIGL 差距**：AIGL 已有 recent_turn_items 和 prompt_compaction 设计，但任务链仍可能把长日志、重复 progress、摘要 observation 多次塞回模型。

**改造建议**：把 70% 作为早压缩阈值，75-80% 生成 CODEX_MEMORY.md；active prompt 只保留最近事件、未解决证据和任务状态。

**验收点**：长任务跑到 70% 时写入检查点；新线程可从检查点继续；无 API key、token、敏感原文泄漏。

**证据**：turn; aigl; F:/AIGril/docs/aigl-codex-context-compaction.md

**证据展开**：turn: .refs/openai-codex/codex-rs/core/src/session/turn.rs:141,163,236,640,692,770,892,1098,1106,1616 | aigl: F:/AIGril/electron/humanclaw-agent-runner.cjs:3544,3545,3561,3562,5175,5197,5223,5484,5607,5678,5798；humanclaw-tool-contracts.cjs:538,584,661,682；humanclaw-runtime.cjs:471,528,771,923；humanclaw-gateway.cjs:663,717,734,885,1635,1695 | F:/AIGril/docs/aigl-codex-context-compaction.md: F:/AIGril/docs/aigl-codex-context-compaction.md

---

## 第 053 页｜Retention Budget

**分组**：上下文压缩 / `MEMORY`

**优先级**：P0

**结论**：压缩不是总结一切，而是保留目标、最新指令、未解决证据、文件路径、命令结果和下一步；这也是本线程 70% 策略的核心。

**Codex 机制**：Codex 在 pre-sampling 和 auto-compact 路径中按 token 状态、scope limit、window ordinal 和 prefill tokens 判断是否压缩；它不是等到上下文爆掉才处理。

**AIGL 差距**：AIGL 已有 recent_turn_items 和 prompt_compaction 设计，但任务链仍可能把长日志、重复 progress、摘要 observation 多次塞回模型。

**改造建议**：把 70% 作为早压缩阈值，75-80% 生成 CODEX_MEMORY.md；active prompt 只保留最近事件、未解决证据和任务状态。

**验收点**：长任务跑到 70% 时写入检查点；新线程可从检查点继续；无 API key、token、敏感原文泄漏。

**证据**：turn; aigl; F:/AIGril/docs/aigl-codex-context-compaction.md

**证据展开**：turn: .refs/openai-codex/codex-rs/core/src/session/turn.rs:141,163,236,640,692,770,892,1098,1106,1616 | aigl: F:/AIGril/electron/humanclaw-agent-runner.cjs:3544,3545,3561,3562,5175,5197,5223,5484,5607,5678,5798；humanclaw-tool-contracts.cjs:538,584,661,682；humanclaw-runtime.cjs:471,528,771,923；humanclaw-gateway.cjs:663,717,734,885,1635,1695 | F:/AIGril/docs/aigl-codex-context-compaction.md: F:/AIGril/docs/aigl-codex-context-compaction.md

---

## 第 054 页｜Web Search Bounded Retrieval

**分组**：网页证据定位 / `GAIA-WEB`

**优先级**：P0

**结论**：官方 Web Search 语义是让模型获取最新信息；对 GAIA/AIGL 来说，还要把 search result、fetch、page locator 和 evidence artifact 分层。

**Codex 机制**：网页证据定位需要把页面当结构化对象处理：URL、DOM/文本、渲染、字段、附近上下文、格式差异都可能是证据，不应只靠搜索摘要。

**AIGL 差距**：网页证据定位 2/2 失败，说明页面已找到不等于字段已定位；HTTP 403、格式化诗行、Word-of-the-Day 引文作者都需要页面内控制器。

**改造建议**：增加 page evidence locator：fetch/render/DOM text 三路并行，支持 CSS/regex/nearby quote/table extraction，失败时返回定位缺口。

**验收点**：页面内字段题必须提交 URL + selector/path + snippet；格式题必须提交渲染或保留缩进的原文证据。

**证据**：official; gaia

**证据展开**：official: 官方资料：Codex CLI https://developers.openai.com/codex/cli；Codex MCP https://developers.openai.com/codex/mcp；Apply Patch https://developers.openai.com/api/docs/guides/tools-apply-patch；Tool Search https://developers.openai.com/api/docs/guides/tools-tool-search；Shell https://developers.openai.com/api/docs/guides/tools-shell；Web Search https://developers.openai.com/api/docs/guides/tools-web-search；Agents SDK https://developers.openai.com/api/docs/guides/agents | gaia: F:/AIGril/scripts/run-gaia-level1-lite.mjs:328,355,414,425,600,622；F:/AIGril/eval-results/engineering/gaia-official/*20260611*.summary.json；F:/AIGril/docs/aigl-vs-codex-gaia-failure-source-report-20260611.md

---

## 第 055 页｜Code Mode 与本地脚本

**分组**：Shell / Session / `EXEC-RUNTIME`

**优先级**：P0

**结论**：复杂表格/计算题应尽快切换到脚本，而不是让模型手算；Codex 的 exec/session 能把 stdout 作为 evidence。

**Codex 机制**：Codex 的 shell 能力是 exec_command + write_stdin + ProcessManager，而不是一次性命令。它支持 session_id、轮询、stdin、yield_time_ms、max_output_tokens、原始 token 计数和输出截断。

**AIGL 差距**：AIGL 有 computer.exec、session_start、pty_* 和 code.test 等多条执行路径，模型侧入口碎片化；长任务和脚本输出不总能稳定成为 answer-bearing evidence。

**改造建议**：新增 Codex 同型 exec_command/write_stdin 表面，旧 exec/PTY/process_read 降为内部后端；所有命令输出统一 ToolOutput 和 transcript。

**验收点**：pnpm test、Python 脚本、交互式 REPL 都能返回 session_id；空 write_stdin 可轮询；最终 transcript 包含 exit_code、stdout、stderr、original_token_count。

**证据**：official; exec; output; aigl

**证据展开**：official: 官方资料：Codex CLI https://developers.openai.com/codex/cli；Codex MCP https://developers.openai.com/codex/mcp；Apply Patch https://developers.openai.com/api/docs/guides/tools-apply-patch；Tool Search https://developers.openai.com/api/docs/guides/tools-tool-search；Shell https://developers.openai.com/api/docs/guides/tools-shell；Web Search https://developers.openai.com/api/docs/guides/tools-web-search；Agents SDK https://developers.openai.com/api/docs/guides/agents | exec: .refs/openai-codex/codex-rs/core/src/tools/handlers/shell_spec.rs:20,103,217,229,267；unified_exec/exec_command.rs:72,222,236,279,291；write_stdin.rs:32,47,100；process_manager.rs:432,443,578,595,643,668,1093,1219 | output: .refs/openai-codex/codex-rs/core/src/tools/context.rs:66,148,235,308,318,404,427；events.rs:54,167,316,337,395 | aigl: F:/AIGril/electron/humanclaw-agent-runner.cjs:3544,3545,3561,3562,5175,5197,5223,5484,5607,5678,5798；humanclaw-tool-contracts.cjs:538,584,661,682；humanclaw-runtime.cjs:471,528,771,923；humanclaw-gateway.cjs:663,717,734,885,1635,1695

---

## 第 056 页｜文件系统 Artifact

**分组**：观测与证据 / `EVIDENCE`

**优先级**：P0

**结论**：下载的 PDF、HTML、CSV、PPTX、截图、字幕和脚本输出都应成为 artifact，并有 hash/path/来源元数据。

**Codex 机制**：Codex 将工具结果、事件、截断、遥测 preview 和上下文压缩分别处理：UI 可以丰富，模型上下文必须小而准；失败和拒绝也都是正式事件。

**AIGL 差距**：AIGL 的 observation 目前仍过度依赖 preview/digest；ClinicalTrials 和 PPT 案例说明答案可能出现在过程里，但 finalizer 未拿到稳定证据槽。

**改造建议**：建立 EvidenceArtifact：原始 stdout、JSON path、网页字段、PDF 页码、截图帧、表格行都用 artifact id 保存，model-facing 只传摘要和引用。

**验收点**：finalizer 输入含 artifact refs；如果答案只在截断外，finalizer 必须请求读取 artifact 而不是空提交或猜答案。

**证据**：output; exec; aigl; gaia

**证据展开**：output: .refs/openai-codex/codex-rs/core/src/tools/context.rs:66,148,235,308,318,404,427；events.rs:54,167,316,337,395 | exec: .refs/openai-codex/codex-rs/core/src/tools/handlers/shell_spec.rs:20,103,217,229,267；unified_exec/exec_command.rs:72,222,236,279,291；write_stdin.rs:32,47,100；process_manager.rs:432,443,578,595,643,668,1093,1219 | aigl: F:/AIGril/electron/humanclaw-agent-runner.cjs:3544,3545,3561,3562,5175,5197,5223,5484,5607,5678,5798；humanclaw-tool-contracts.cjs:538,584,661,682；humanclaw-runtime.cjs:471,528,771,923；humanclaw-gateway.cjs:663,717,734,885,1635,1695 | gaia: F:/AIGril/scripts/run-gaia-level1-lite.mjs:328,355,414,425,600,622；F:/AIGril/eval-results/engineering/gaia-official/*20260611*.summary.json；F:/AIGril/docs/aigl-vs-codex-gaia-failure-source-report-20260611.md

---

## 第 057 页｜EvidenceArtifact 总体设计

**分组**：观测与证据 / `EVIDENCE`

**优先级**：P0

**结论**：EvidenceArtifact 是 AIGL 追上 Codex 稳定性的关键抽象：把 answer-bearing field 从工具摘要里解放出来。

**Codex 机制**：Codex 将工具结果、事件、截断、遥测 preview 和上下文压缩分别处理：UI 可以丰富，模型上下文必须小而准；失败和拒绝也都是正式事件。

**AIGL 差距**：AIGL 的 observation 目前仍过度依赖 preview/digest；ClinicalTrials 和 PPT 案例说明答案可能出现在过程里，但 finalizer 未拿到稳定证据槽。

**改造建议**：建立 EvidenceArtifact：原始 stdout、JSON path、网页字段、PDF 页码、截图帧、表格行都用 artifact id 保存，model-facing 只传摘要和引用。

**验收点**：finalizer 输入含 artifact refs；如果答案只在截断外，finalizer 必须请求读取 artifact 而不是空提交或猜答案。

**证据**：output; exec; aigl; gaia

**证据展开**：output: .refs/openai-codex/codex-rs/core/src/tools/context.rs:66,148,235,308,318,404,427；events.rs:54,167,316,337,395 | exec: .refs/openai-codex/codex-rs/core/src/tools/handlers/shell_spec.rs:20,103,217,229,267；unified_exec/exec_command.rs:72,222,236,279,291；write_stdin.rs:32,47,100；process_manager.rs:432,443,578,595,643,668,1093,1219 | aigl: F:/AIGril/electron/humanclaw-agent-runner.cjs:3544,3545,3561,3562,5175,5197,5223,5484,5607,5678,5798；humanclaw-tool-contracts.cjs:538,584,661,682；humanclaw-runtime.cjs:471,528,771,923；humanclaw-gateway.cjs:663,717,734,885,1635,1695 | gaia: F:/AIGril/scripts/run-gaia-level1-lite.mjs:328,355,414,425,600,622；F:/AIGril/eval-results/engineering/gaia-official/*20260611*.summary.json；F:/AIGril/docs/aigl-vs-codex-gaia-failure-source-report-20260611.md

---

## 第 058 页｜stdout 作为证据

**分组**：观测与证据 / `EVIDENCE`

**优先级**：P0

**结论**：很多 GAIA 附件题答案来自脚本 stdout；若 stdout 只在 preview 或中文总结里出现，finalizer 就会提交错或空。

**Codex 机制**：Codex 将工具结果、事件、截断、遥测 preview 和上下文压缩分别处理：UI 可以丰富，模型上下文必须小而准；失败和拒绝也都是正式事件。

**AIGL 差距**：AIGL 的 observation 目前仍过度依赖 preview/digest；ClinicalTrials 和 PPT 案例说明答案可能出现在过程里，但 finalizer 未拿到稳定证据槽。

**改造建议**：建立 EvidenceArtifact：原始 stdout、JSON path、网页字段、PDF 页码、截图帧、表格行都用 artifact id 保存，model-facing 只传摘要和引用。

**验收点**：finalizer 输入含 artifact refs；如果答案只在截断外，finalizer 必须请求读取 artifact 而不是空提交或猜答案。

**证据**：output; exec; aigl; gaia

**证据展开**：output: .refs/openai-codex/codex-rs/core/src/tools/context.rs:66,148,235,308,318,404,427；events.rs:54,167,316,337,395 | exec: .refs/openai-codex/codex-rs/core/src/tools/handlers/shell_spec.rs:20,103,217,229,267；unified_exec/exec_command.rs:72,222,236,279,291；write_stdin.rs:32,47,100；process_manager.rs:432,443,578,595,643,668,1093,1219 | aigl: F:/AIGril/electron/humanclaw-agent-runner.cjs:3544,3545,3561,3562,5175,5197,5223,5484,5607,5678,5798；humanclaw-tool-contracts.cjs:538,584,661,682；humanclaw-runtime.cjs:471,528,771,923；humanclaw-gateway.cjs:663,717,734,885,1635,1695 | gaia: F:/AIGril/scripts/run-gaia-level1-lite.mjs:328,355,414,425,600,622；F:/AIGril/eval-results/engineering/gaia-official/*20260611*.summary.json；F:/AIGril/docs/aigl-vs-codex-gaia-failure-source-report-20260611.md

---

## 第 059 页｜PDF/Document Evidence

**分组**：观测与证据 / `EVIDENCE`

**优先级**：P0

**结论**：PDF 证据必须带页码、section、附近上下文和抽取器版本；只说“找到巨大 PDF”不能支撑 exact answer。

**Codex 机制**：Codex 将工具结果、事件、截断、遥测 preview 和上下文压缩分别处理：UI 可以丰富，模型上下文必须小而准；失败和拒绝也都是正式事件。

**AIGL 差距**：AIGL 的 observation 目前仍过度依赖 preview/digest；ClinicalTrials 和 PPT 案例说明答案可能出现在过程里，但 finalizer 未拿到稳定证据槽。

**改造建议**：建立 EvidenceArtifact：原始 stdout、JSON path、网页字段、PDF 页码、截图帧、表格行都用 artifact id 保存，model-facing 只传摘要和引用。

**验收点**：finalizer 输入含 artifact refs；如果答案只在截断外，finalizer 必须请求读取 artifact 而不是空提交或猜答案。

**证据**：output; exec; aigl; gaia

**证据展开**：output: .refs/openai-codex/codex-rs/core/src/tools/context.rs:66,148,235,308,318,404,427；events.rs:54,167,316,337,395 | exec: .refs/openai-codex/codex-rs/core/src/tools/handlers/shell_spec.rs:20,103,217,229,267；unified_exec/exec_command.rs:72,222,236,279,291；write_stdin.rs:32,47,100；process_manager.rs:432,443,578,595,643,668,1093,1219 | aigl: F:/AIGril/electron/humanclaw-agent-runner.cjs:3544,3545,3561,3562,5175,5197,5223,5484,5607,5678,5798；humanclaw-tool-contracts.cjs:538,584,661,682；humanclaw-runtime.cjs:471,528,771,923；humanclaw-gateway.cjs:663,717,734,885,1635,1695 | gaia: F:/AIGril/scripts/run-gaia-level1-lite.mjs:328,355,414,425,600,622；F:/AIGril/eval-results/engineering/gaia-official/*20260611*.summary.json；F:/AIGril/docs/aigl-vs-codex-gaia-failure-source-report-20260611.md

---

## 第 060 页｜Image/Vision Evidence

**分组**：视频 / 视觉 / `GAIA-MEDIA`

**优先级**：P1

**结论**：图像证据必须从 caption 走向 structured state，例如 bounding boxes、OCR tokens、FEN、object count 和 frame timestamp。

**Codex 机制**：Codex 不会神奇看懂所有视频，但它更容易升级到字幕、帧采样、截图、脚本和专用工具；关键是 runtime 允许模型发现并调用真实媒体 primitive。

**AIGL 差距**：视频/视觉 4 题只过 2 题：可被网页/字幕救的通过，鸟类同屏计数和棋盘结构化失败，说明缺 frame-to-structure 链路。

**改造建议**：补媒体 evidence pipeline：transcript first、frame sampling、OCR/vision labels、结构化状态生成、专用 solver/validator。

**验收点**：视频题输出 transcript/caption/frame evidence；棋盘题输出 FEN 或等价棋盘状态；计数题输出帧编号与对象列表。

**证据**：official; exec; gaia

**证据展开**：official: 官方资料：Codex CLI https://developers.openai.com/codex/cli；Codex MCP https://developers.openai.com/codex/mcp；Apply Patch https://developers.openai.com/api/docs/guides/tools-apply-patch；Tool Search https://developers.openai.com/api/docs/guides/tools-tool-search；Shell https://developers.openai.com/api/docs/guides/tools-shell；Web Search https://developers.openai.com/api/docs/guides/tools-web-search；Agents SDK https://developers.openai.com/api/docs/guides/agents | exec: .refs/openai-codex/codex-rs/core/src/tools/handlers/shell_spec.rs:20,103,217,229,267；unified_exec/exec_command.rs:72,222,236,279,291；write_stdin.rs:32,47,100；process_manager.rs:432,443,578,595,643,668,1093,1219 | gaia: F:/AIGril/scripts/run-gaia-level1-lite.mjs:328,355,414,425,600,622；F:/AIGril/eval-results/engineering/gaia-official/*20260611*.summary.json；F:/AIGril/docs/aigl-vs-codex-gaia-failure-source-report-20260611.md

---

## 第 061 页｜长链检索控制器总览

**分组**：长链检索 / `GAIA-LONG`

**优先级**：P0

**结论**：长链任务需要状态机，不需要更多泛搜提示。每一跳都应记录 source、field、entity、confidence 和 next query。

**Codex 机制**：Codex 式长链不是一直搜索，而是把每一跳变成 artifact：锚定来源、抽取字段、保存下一跳实体、再进入下一步。shell/脚本/文件可把中间状态固化。

**AIGL 差距**：长链 6 题 0/6，典型症状是反复 web_search、没有稳定 canonical source、没有把上一跳证据作为下一跳输入。

**改造建议**：实现 retrieval controller：Query -> CandidateSource -> Fetch -> Locate -> Extract -> NextHop -> EvidenceCheck -> Final。每一跳必须有 artifact id。

**验收点**：6 道长链题中，每题至少输出 chain table；同一实体不得在无新证据时重复搜索三次；max_steps 前必须给出缺失 hop。

**证据**：official; gaia

**证据展开**：official: 官方资料：Codex CLI https://developers.openai.com/codex/cli；Codex MCP https://developers.openai.com/codex/mcp；Apply Patch https://developers.openai.com/api/docs/guides/tools-apply-patch；Tool Search https://developers.openai.com/api/docs/guides/tools-tool-search；Shell https://developers.openai.com/api/docs/guides/tools-shell；Web Search https://developers.openai.com/api/docs/guides/tools-web-search；Agents SDK https://developers.openai.com/api/docs/guides/agents | gaia: F:/AIGril/scripts/run-gaia-level1-lite.mjs:328,355,414,425,600,622；F:/AIGril/eval-results/engineering/gaia-official/*20260611*.summary.json；F:/AIGril/docs/aigl-vs-codex-gaia-failure-source-report-20260611.md

---

## 第 062 页｜长链：论文/作者历史

**分组**：长链检索 / `GAIA-LONG`

**优先级**：P0

**结论**：46719c30 一类任务需要先锚定 canonical paper，再抽作者历史，而不是反复搜索标题碎片。

**Codex 机制**：Codex 式长链不是一直搜索，而是把每一跳变成 artifact：锚定来源、抽取字段、保存下一跳实体、再进入下一步。shell/脚本/文件可把中间状态固化。

**AIGL 差距**：长链 6 题 0/6，典型症状是反复 web_search、没有稳定 canonical source、没有把上一跳证据作为下一跳输入。

**改造建议**：实现 retrieval controller：Query -> CandidateSource -> Fetch -> Locate -> Extract -> NextHop -> EvidenceCheck -> Final。每一跳必须有 artifact id。

**验收点**：6 道长链题中，每题至少输出 chain table；同一实体不得在无新证据时重复搜索三次；max_steps 前必须给出缺失 hop。

**证据**：official; gaia

**证据展开**：official: 官方资料：Codex CLI https://developers.openai.com/codex/cli；Codex MCP https://developers.openai.com/codex/mcp；Apply Patch https://developers.openai.com/api/docs/guides/tools-apply-patch；Tool Search https://developers.openai.com/api/docs/guides/tools-tool-search；Shell https://developers.openai.com/api/docs/guides/tools-shell；Web Search https://developers.openai.com/api/docs/guides/tools-web-search；Agents SDK https://developers.openai.com/api/docs/guides/agents | gaia: F:/AIGril/scripts/run-gaia-level1-lite.mjs:328,355,414,425,600,622；F:/AIGril/eval-results/engineering/gaia-official/*20260611*.summary.json；F:/AIGril/docs/aigl-vs-codex-gaia-failure-source-report-20260611.md

---

## 第 063 页｜长链：实体解析器

**分组**：长链检索 / `GAIA-LONG`

**优先级**：P0

**结论**：305ac316 一类题应拆成语言线索、人物实体、作品角色、最终属性四步，每步都有证据。

**Codex 机制**：Codex 式长链不是一直搜索，而是把每一跳变成 artifact：锚定来源、抽取字段、保存下一跳实体、再进入下一步。shell/脚本/文件可把中间状态固化。

**AIGL 差距**：长链 6 题 0/6，典型症状是反复 web_search、没有稳定 canonical source、没有把上一跳证据作为下一跳输入。

**改造建议**：实现 retrieval controller：Query -> CandidateSource -> Fetch -> Locate -> Extract -> NextHop -> EvidenceCheck -> Final。每一跳必须有 artifact id。

**验收点**：6 道长链题中，每题至少输出 chain table；同一实体不得在无新证据时重复搜索三次；max_steps 前必须给出缺失 hop。

**证据**：official; gaia

**证据展开**：official: 官方资料：Codex CLI https://developers.openai.com/codex/cli；Codex MCP https://developers.openai.com/codex/mcp；Apply Patch https://developers.openai.com/api/docs/guides/tools-apply-patch；Tool Search https://developers.openai.com/api/docs/guides/tools-tool-search；Shell https://developers.openai.com/api/docs/guides/tools-shell；Web Search https://developers.openai.com/api/docs/guides/tools-web-search；Agents SDK https://developers.openai.com/api/docs/guides/agents | gaia: F:/AIGril/scripts/run-gaia-level1-lite.mjs:328,355,414,425,600,622；F:/AIGril/eval-results/engineering/gaia-official/*20260611*.summary.json；F:/AIGril/docs/aigl-vs-codex-gaia-failure-source-report-20260611.md

---

## 第 064 页｜长链：链接跟随

**分组**：长链检索 / `GAIA-LONG`

**优先级**：P0

**结论**：840bfca7 一类题要求从文章链接到论文、致谢、NASA award；控制器应跟随 URL，而不是回到搜索页。

**Codex 机制**：Codex 式长链不是一直搜索，而是把每一跳变成 artifact：锚定来源、抽取字段、保存下一跳实体、再进入下一步。shell/脚本/文件可把中间状态固化。

**AIGL 差距**：长链 6 题 0/6，典型症状是反复 web_search、没有稳定 canonical source、没有把上一跳证据作为下一跳输入。

**改造建议**：实现 retrieval controller：Query -> CandidateSource -> Fetch -> Locate -> Extract -> NextHop -> EvidenceCheck -> Final。每一跳必须有 artifact id。

**验收点**：6 道长链题中，每题至少输出 chain table；同一实体不得在无新证据时重复搜索三次；max_steps 前必须给出缺失 hop。

**证据**：official; gaia

**证据展开**：official: 官方资料：Codex CLI https://developers.openai.com/codex/cli；Codex MCP https://developers.openai.com/codex/mcp；Apply Patch https://developers.openai.com/api/docs/guides/tools-apply-patch；Tool Search https://developers.openai.com/api/docs/guides/tools-tool-search；Shell https://developers.openai.com/api/docs/guides/tools-shell；Web Search https://developers.openai.com/api/docs/guides/tools-web-search；Agents SDK https://developers.openai.com/api/docs/guides/agents | gaia: F:/AIGril/scripts/run-gaia-level1-lite.mjs:328,355,414,425,600,622；F:/AIGril/eval-results/engineering/gaia-official/*20260611*.summary.json；F:/AIGril/docs/aigl-vs-codex-gaia-failure-source-report-20260611.md

---

## 第 065 页｜长链：源获取优先

**分组**：长链检索 / `GAIA-LONG`

**优先级**：P0

**结论**：b816bfce/bda648d7 类纸面来源题，早期应转入 library/PDF/title-specific acquisition，而不是继续 broad web_search。

**Codex 机制**：Codex 式长链不是一直搜索，而是把每一跳变成 artifact：锚定来源、抽取字段、保存下一跳实体、再进入下一步。shell/脚本/文件可把中间状态固化。

**AIGL 差距**：长链 6 题 0/6，典型症状是反复 web_search、没有稳定 canonical source、没有把上一跳证据作为下一跳输入。

**改造建议**：实现 retrieval controller：Query -> CandidateSource -> Fetch -> Locate -> Extract -> NextHop -> EvidenceCheck -> Final。每一跳必须有 artifact id。

**验收点**：6 道长链题中，每题至少输出 chain table；同一实体不得在无新证据时重复搜索三次；max_steps 前必须给出缺失 hop。

**证据**：official; gaia

**证据展开**：official: 官方资料：Codex CLI https://developers.openai.com/codex/cli；Codex MCP https://developers.openai.com/codex/mcp；Apply Patch https://developers.openai.com/api/docs/guides/tools-apply-patch；Tool Search https://developers.openai.com/api/docs/guides/tools-tool-search；Shell https://developers.openai.com/api/docs/guides/tools-shell；Web Search https://developers.openai.com/api/docs/guides/tools-web-search；Agents SDK https://developers.openai.com/api/docs/guides/agents | gaia: F:/AIGril/scripts/run-gaia-level1-lite.mjs:328,355,414,425,600,622；F:/AIGril/eval-results/engineering/gaia-official/*20260611*.summary.json；F:/AIGril/docs/aigl-vs-codex-gaia-failure-source-report-20260611.md

---

## 第 066 页｜网页字段定位

**分组**：网页证据定位 / `GAIA-WEB`

**优先级**：P0

**结论**：5188369a 类题说明页面找到了不代表字段找到了；locator 要能在页面内搜索 quote、author、label 和邻近节点。

**Codex 机制**：网页证据定位需要把页面当结构化对象处理：URL、DOM/文本、渲染、字段、附近上下文、格式差异都可能是证据，不应只靠搜索摘要。

**AIGL 差距**：网页证据定位 2/2 失败，说明页面已找到不等于字段已定位；HTTP 403、格式化诗行、Word-of-the-Day 引文作者都需要页面内控制器。

**改造建议**：增加 page evidence locator：fetch/render/DOM text 三路并行，支持 CSS/regex/nearby quote/table extraction，失败时返回定位缺口。

**验收点**：页面内字段题必须提交 URL + selector/path + snippet；格式题必须提交渲染或保留缩进的原文证据。

**证据**：official; gaia

**证据展开**：official: 官方资料：Codex CLI https://developers.openai.com/codex/cli；Codex MCP https://developers.openai.com/codex/mcp；Apply Patch https://developers.openai.com/api/docs/guides/tools-apply-patch；Tool Search https://developers.openai.com/api/docs/guides/tools-tool-search；Shell https://developers.openai.com/api/docs/guides/tools-shell；Web Search https://developers.openai.com/api/docs/guides/tools-web-search；Agents SDK https://developers.openai.com/api/docs/guides/agents | gaia: F:/AIGril/scripts/run-gaia-level1-lite.mjs:328,355,414,425,600,622；F:/AIGril/eval-results/engineering/gaia-official/*20260611*.summary.json；F:/AIGril/docs/aigl-vs-codex-gaia-failure-source-report-20260611.md

---

## 第 067 页｜网页格式证据

**分组**：网页证据定位 / `GAIA-WEB`

**优先级**：P0

**结论**：23dd907f 类题涉及诗行缩进/格式；纯文本提取可能丢失答案，必须保留渲染或格式化 source。

**Codex 机制**：网页证据定位需要把页面当结构化对象处理：URL、DOM/文本、渲染、字段、附近上下文、格式差异都可能是证据，不应只靠搜索摘要。

**AIGL 差距**：网页证据定位 2/2 失败，说明页面已找到不等于字段已定位；HTTP 403、格式化诗行、Word-of-the-Day 引文作者都需要页面内控制器。

**改造建议**：增加 page evidence locator：fetch/render/DOM text 三路并行，支持 CSS/regex/nearby quote/table extraction，失败时返回定位缺口。

**验收点**：页面内字段题必须提交 URL + selector/path + snippet；格式题必须提交渲染或保留缩进的原文证据。

**证据**：official; gaia

**证据展开**：official: 官方资料：Codex CLI https://developers.openai.com/codex/cli；Codex MCP https://developers.openai.com/codex/mcp；Apply Patch https://developers.openai.com/api/docs/guides/tools-apply-patch；Tool Search https://developers.openai.com/api/docs/guides/tools-tool-search；Shell https://developers.openai.com/api/docs/guides/tools-shell；Web Search https://developers.openai.com/api/docs/guides/tools-web-search；Agents SDK https://developers.openai.com/api/docs/guides/agents | gaia: F:/AIGril/scripts/run-gaia-level1-lite.mjs:328,355,414,425,600,622；F:/AIGril/eval-results/engineering/gaia-official/*20260611*.summary.json；F:/AIGril/docs/aigl-vs-codex-gaia-failure-source-report-20260611.md

---

## 第 068 页｜媒体：字幕优先

**分组**：视频 / 视觉 / `GAIA-MEDIA`

**优先级**：P1

**结论**：9d191bce 和 0383a3ee 能过，说明网页/字幕证据可救一部分视频题；AIGL 应把 transcript acquisition 做成标准路径。

**Codex 机制**：Codex 不会神奇看懂所有视频，但它更容易升级到字幕、帧采样、截图、脚本和专用工具；关键是 runtime 允许模型发现并调用真实媒体 primitive。

**AIGL 差距**：视频/视觉 4 题只过 2 题：可被网页/字幕救的通过，鸟类同屏计数和棋盘结构化失败，说明缺 frame-to-structure 链路。

**改造建议**：补媒体 evidence pipeline：transcript first、frame sampling、OCR/vision labels、结构化状态生成、专用 solver/validator。

**验收点**：视频题输出 transcript/caption/frame evidence；棋盘题输出 FEN 或等价棋盘状态；计数题输出帧编号与对象列表。

**证据**：official; exec; gaia

**证据展开**：official: 官方资料：Codex CLI https://developers.openai.com/codex/cli；Codex MCP https://developers.openai.com/codex/mcp；Apply Patch https://developers.openai.com/api/docs/guides/tools-apply-patch；Tool Search https://developers.openai.com/api/docs/guides/tools-tool-search；Shell https://developers.openai.com/api/docs/guides/tools-shell；Web Search https://developers.openai.com/api/docs/guides/tools-web-search；Agents SDK https://developers.openai.com/api/docs/guides/agents | exec: .refs/openai-codex/codex-rs/core/src/tools/handlers/shell_spec.rs:20,103,217,229,267；unified_exec/exec_command.rs:72,222,236,279,291；write_stdin.rs:32,47,100；process_manager.rs:432,443,578,595,643,668,1093,1219 | gaia: F:/AIGril/scripts/run-gaia-level1-lite.mjs:328,355,414,425,600,622；F:/AIGril/eval-results/engineering/gaia-official/*20260611*.summary.json；F:/AIGril/docs/aigl-vs-codex-gaia-failure-source-report-20260611.md

---

## 第 069 页｜媒体：帧采样

**分组**：视频 / 视觉 / `GAIA-MEDIA`

**优先级**：P1

**结论**：a1e91b78 鸟类同屏计数失败说明缺 frame sampler。控制器需要按时间窗口采样、去重、计数并输出帧证据。

**Codex 机制**：Codex 不会神奇看懂所有视频，但它更容易升级到字幕、帧采样、截图、脚本和专用工具；关键是 runtime 允许模型发现并调用真实媒体 primitive。

**AIGL 差距**：视频/视觉 4 题只过 2 题：可被网页/字幕救的通过，鸟类同屏计数和棋盘结构化失败，说明缺 frame-to-structure 链路。

**改造建议**：补媒体 evidence pipeline：transcript first、frame sampling、OCR/vision labels、结构化状态生成、专用 solver/validator。

**验收点**：视频题输出 transcript/caption/frame evidence；棋盘题输出 FEN 或等价棋盘状态；计数题输出帧编号与对象列表。

**证据**：official; exec; gaia

**证据展开**：official: 官方资料：Codex CLI https://developers.openai.com/codex/cli；Codex MCP https://developers.openai.com/codex/mcp；Apply Patch https://developers.openai.com/api/docs/guides/tools-apply-patch；Tool Search https://developers.openai.com/api/docs/guides/tools-tool-search；Shell https://developers.openai.com/api/docs/guides/tools-shell；Web Search https://developers.openai.com/api/docs/guides/tools-web-search；Agents SDK https://developers.openai.com/api/docs/guides/agents | exec: .refs/openai-codex/codex-rs/core/src/tools/handlers/shell_spec.rs:20,103,217,229,267；unified_exec/exec_command.rs:72,222,236,279,291；write_stdin.rs:32,47,100；process_manager.rs:432,443,578,595,643,668,1093,1219 | gaia: F:/AIGril/scripts/run-gaia-level1-lite.mjs:328,355,414,425,600,622；F:/AIGril/eval-results/engineering/gaia-official/*20260611*.summary.json；F:/AIGril/docs/aigl-vs-codex-gaia-failure-source-report-20260611.md

---

## 第 070 页｜视觉到结构化：棋盘

**分组**：视频 / 视觉 / `GAIA-MEDIA`

**优先级**：P1

**结论**：cca530fc 棋盘题失败说明视觉描述不够；需要 board extractor、FEN 生成、合法性校验和 chess engine/solver。

**Codex 机制**：Codex 不会神奇看懂所有视频，但它更容易升级到字幕、帧采样、截图、脚本和专用工具；关键是 runtime 允许模型发现并调用真实媒体 primitive。

**AIGL 差距**：视频/视觉 4 题只过 2 题：可被网页/字幕救的通过，鸟类同屏计数和棋盘结构化失败，说明缺 frame-to-structure 链路。

**改造建议**：补媒体 evidence pipeline：transcript first、frame sampling、OCR/vision labels、结构化状态生成、专用 solver/validator。

**验收点**：视频题输出 transcript/caption/frame evidence；棋盘题输出 FEN 或等价棋盘状态；计数题输出帧编号与对象列表。

**证据**：official; exec; gaia

**证据展开**：official: 官方资料：Codex CLI https://developers.openai.com/codex/cli；Codex MCP https://developers.openai.com/codex/mcp；Apply Patch https://developers.openai.com/api/docs/guides/tools-apply-patch；Tool Search https://developers.openai.com/api/docs/guides/tools-tool-search；Shell https://developers.openai.com/api/docs/guides/tools-shell；Web Search https://developers.openai.com/api/docs/guides/tools-web-search；Agents SDK https://developers.openai.com/api/docs/guides/agents | exec: .refs/openai-codex/codex-rs/core/src/tools/handlers/shell_spec.rs:20,103,217,229,267；unified_exec/exec_command.rs:72,222,236,279,291；write_stdin.rs:32,47,100；process_manager.rs:432,443,578,595,643,668,1093,1219 | gaia: F:/AIGril/scripts/run-gaia-level1-lite.mjs:328,355,414,425,600,622；F:/AIGril/eval-results/engineering/gaia-official/*20260611*.summary.json；F:/AIGril/docs/aigl-vs-codex-gaia-failure-source-report-20260611.md

---

## 第 071 页｜结构化来源总览

**分组**：结构化来源 / `GAIA-DATA`

**优先级**：P1

**结论**：8 道结构化来源题全败，说明 AIGL 的核心缺口不是答案推理，而是稳定进入正确数据源和字段路径。

**Codex 机制**：专用数据题的正确路径通常是 adapter 或稳定表格，而不是泛搜。Codex 的优势是能更早切换到 API、下载表格、写脚本、读取 JSON path。

**AIGL 差距**：结构化来源 8/8 失败，ClinicalTrials 甚至调用了 external tool 仍提交空答案，说明 adapter correctness 和结果传递链都不稳。

**改造建议**：按来源建立 adapters：ClinicalTrials、Baseball Reference、Wikipedia FA、Cornell LII、Olympics、NPB、BASE；每个 adapter 返回 normalized evidence rows。

**验收点**：每个 adapter 有 contract test、gold fixture、JSON path assertion；finalizer 不接受没有 source row/path 的答案。

**证据**：tools; exec; aigl; gaia

**证据展开**：tools: .refs/openai-codex/codex-rs/core/src/tools/router.rs:36,52,59；registry.rs:161,185,273,294；spec_plan.rs:725,789,797；mcp_tool_exposure.rs:10,32,36,40,46；tool_search.rs:23,57,73,109 | exec: .refs/openai-codex/codex-rs/core/src/tools/handlers/shell_spec.rs:20,103,217,229,267；unified_exec/exec_command.rs:72,222,236,279,291；write_stdin.rs:32,47,100；process_manager.rs:432,443,578,595,643,668,1093,1219 | aigl: F:/AIGril/electron/humanclaw-agent-runner.cjs:3544,3545,3561,3562,5175,5197,5223,5484,5607,5678,5798；humanclaw-tool-contracts.cjs:538,584,661,682；humanclaw-runtime.cjs:471,528,771,923；humanclaw-gateway.cjs:663,717,734,885,1635,1695 | gaia: F:/AIGril/scripts/run-gaia-level1-lite.mjs:328,355,414,425,600,622；F:/AIGril/eval-results/engineering/gaia-official/*20260611*.summary.json；F:/AIGril/docs/aigl-vs-codex-gaia-failure-source-report-20260611.md

---

## 第 072 页｜ClinicalTrials Adapter

**分组**：结构化来源 / `GAIA-DATA`

**优先级**：P1

**结论**：a0068077 已出现 external__clinicaltrials__get_study，但提交空答案；adapter 需要字段 normalization，finalizer 需要看到 enrollment path。

**Codex 机制**：专用数据题的正确路径通常是 adapter 或稳定表格，而不是泛搜。Codex 的优势是能更早切换到 API、下载表格、写脚本、读取 JSON path。

**AIGL 差距**：结构化来源 8/8 失败，ClinicalTrials 甚至调用了 external tool 仍提交空答案，说明 adapter correctness 和结果传递链都不稳。

**改造建议**：按来源建立 adapters：ClinicalTrials、Baseball Reference、Wikipedia FA、Cornell LII、Olympics、NPB、BASE；每个 adapter 返回 normalized evidence rows。

**验收点**：每个 adapter 有 contract test、gold fixture、JSON path assertion；finalizer 不接受没有 source row/path 的答案。

**证据**：tools; exec; aigl; gaia

**证据展开**：tools: .refs/openai-codex/codex-rs/core/src/tools/router.rs:36,52,59；registry.rs:161,185,273,294；spec_plan.rs:725,789,797；mcp_tool_exposure.rs:10,32,36,40,46；tool_search.rs:23,57,73,109 | exec: .refs/openai-codex/codex-rs/core/src/tools/handlers/shell_spec.rs:20,103,217,229,267；unified_exec/exec_command.rs:72,222,236,279,291；write_stdin.rs:32,47,100；process_manager.rs:432,443,578,595,643,668,1093,1219 | aigl: F:/AIGril/electron/humanclaw-agent-runner.cjs:3544,3545,3561,3562,5175,5197,5223,5484,5607,5678,5798；humanclaw-tool-contracts.cjs:538,584,661,682；humanclaw-runtime.cjs:471,528,771,923；humanclaw-gateway.cjs:663,717,734,885,1635,1695 | gaia: F:/AIGril/scripts/run-gaia-level1-lite.mjs:328,355,414,425,600,622；F:/AIGril/eval-results/engineering/gaia-official/*20260611*.summary.json；F:/AIGril/docs/aigl-vs-codex-gaia-failure-source-report-20260611.md

---

## 第 073 页｜Baseball Reference Adapter

**分组**：结构化来源 / `GAIA-DATA`

**优先级**：P1

**结论**：3f57289b 需要 baseball stats 表格，不适合 loose search；adapter 应抽 roster/stat row，并在脚本里计算 ratio/field。

**Codex 机制**：专用数据题的正确路径通常是 adapter 或稳定表格，而不是泛搜。Codex 的优势是能更早切换到 API、下载表格、写脚本、读取 JSON path。

**AIGL 差距**：结构化来源 8/8 失败，ClinicalTrials 甚至调用了 external tool 仍提交空答案，说明 adapter correctness 和结果传递链都不稳。

**改造建议**：按来源建立 adapters：ClinicalTrials、Baseball Reference、Wikipedia FA、Cornell LII、Olympics、NPB、BASE；每个 adapter 返回 normalized evidence rows。

**验收点**：每个 adapter 有 contract test、gold fixture、JSON path assertion；finalizer 不接受没有 source row/path 的答案。

**证据**：tools; exec; aigl; gaia

**证据展开**：tools: .refs/openai-codex/codex-rs/core/src/tools/router.rs:36,52,59；registry.rs:161,185,273,294；spec_plan.rs:725,789,797；mcp_tool_exposure.rs:10,32,36,40,46；tool_search.rs:23,57,73,109 | exec: .refs/openai-codex/codex-rs/core/src/tools/handlers/shell_spec.rs:20,103,217,229,267；unified_exec/exec_command.rs:72,222,236,279,291；write_stdin.rs:32,47,100；process_manager.rs:432,443,578,595,643,668,1093,1219 | aigl: F:/AIGril/electron/humanclaw-agent-runner.cjs:3544,3545,3561,3562,5175,5197,5223,5484,5607,5678,5798；humanclaw-tool-contracts.cjs:538,584,661,682；humanclaw-runtime.cjs:471,528,771,923；humanclaw-gateway.cjs:663,717,734,885,1635,1695 | gaia: F:/AIGril/scripts/run-gaia-level1-lite.mjs:328,355,414,425,600,622；F:/AIGril/eval-results/engineering/gaia-official/*20260611*.summary.json；F:/AIGril/docs/aigl-vs-codex-gaia-failure-source-report-20260611.md

---

## 第 074 页｜Wikipedia Featured Article Adapter

**分组**：结构化来源 / `GAIA-DATA`

**优先级**：P1

**结论**：4fc2f1ae 需要 FA nomination/promotion history；应走 Wikipedia 页面历史、talk/FA logs 或特定结构抓取。

**Codex 机制**：专用数据题的正确路径通常是 adapter 或稳定表格，而不是泛搜。Codex 的优势是能更早切换到 API、下载表格、写脚本、读取 JSON path。

**AIGL 差距**：结构化来源 8/8 失败，ClinicalTrials 甚至调用了 external tool 仍提交空答案，说明 adapter correctness 和结果传递链都不稳。

**改造建议**：按来源建立 adapters：ClinicalTrials、Baseball Reference、Wikipedia FA、Cornell LII、Olympics、NPB、BASE；每个 adapter 返回 normalized evidence rows。

**验收点**：每个 adapter 有 contract test、gold fixture、JSON path assertion；finalizer 不接受没有 source row/path 的答案。

**证据**：tools; exec; aigl; gaia

**证据展开**：tools: .refs/openai-codex/codex-rs/core/src/tools/router.rs:36,52,59；registry.rs:161,185,273,294；spec_plan.rs:725,789,797；mcp_tool_exposure.rs:10,32,36,40,46；tool_search.rs:23,57,73,109 | exec: .refs/openai-codex/codex-rs/core/src/tools/handlers/shell_spec.rs:20,103,217,229,267；unified_exec/exec_command.rs:72,222,236,279,291；write_stdin.rs:32,47,100；process_manager.rs:432,443,578,595,643,668,1093,1219 | aigl: F:/AIGril/electron/humanclaw-agent-runner.cjs:3544,3545,3561,3562,5175,5197,5223,5484,5607,5678,5798；humanclaw-tool-contracts.cjs:538,584,661,682；humanclaw-runtime.cjs:471,528,771,923；humanclaw-gateway.cjs:663,717,734,885,1635,1695 | gaia: F:/AIGril/scripts/run-gaia-level1-lite.mjs:328,355,414,425,600,622；F:/AIGril/eval-results/engineering/gaia-official/*20260611*.summary.json；F:/AIGril/docs/aigl-vs-codex-gaia-failure-source-report-20260611.md

---

## 第 075 页｜Cornell LII Legal Adapter

**分组**：结构化来源 / `GAIA-DATA`

**优先级**：P1

**结论**：7673d772 需要法律文本 amendment diff；adapter 应定位 rule article、版本/修订说明和目标术语。

**Codex 机制**：专用数据题的正确路径通常是 adapter 或稳定表格，而不是泛搜。Codex 的优势是能更早切换到 API、下载表格、写脚本、读取 JSON path。

**AIGL 差距**：结构化来源 8/8 失败，ClinicalTrials 甚至调用了 external tool 仍提交空答案，说明 adapter correctness 和结果传递链都不稳。

**改造建议**：按来源建立 adapters：ClinicalTrials、Baseball Reference、Wikipedia FA、Cornell LII、Olympics、NPB、BASE；每个 adapter 返回 normalized evidence rows。

**验收点**：每个 adapter 有 contract test、gold fixture、JSON path assertion；finalizer 不接受没有 source row/path 的答案。

**证据**：tools; exec; aigl; gaia

**证据展开**：tools: .refs/openai-codex/codex-rs/core/src/tools/router.rs:36,52,59；registry.rs:161,185,273,294；spec_plan.rs:725,789,797；mcp_tool_exposure.rs:10,32,36,40,46；tool_search.rs:23,57,73,109 | exec: .refs/openai-codex/codex-rs/core/src/tools/handlers/shell_spec.rs:20,103,217,229,267；unified_exec/exec_command.rs:72,222,236,279,291；write_stdin.rs:32,47,100；process_manager.rs:432,443,578,595,643,668,1093,1219 | aigl: F:/AIGril/electron/humanclaw-agent-runner.cjs:3544,3545,3561,3562,5175,5197,5223,5484,5607,5678,5798；humanclaw-tool-contracts.cjs:538,584,661,682；humanclaw-runtime.cjs:471,528,771,923；humanclaw-gateway.cjs:663,717,734,885,1635,1695 | gaia: F:/AIGril/scripts/run-gaia-level1-lite.mjs:328,355,414,425,600,622；F:/AIGril/eval-results/engineering/gaia-official/*20260611*.summary.json；F:/AIGril/docs/aigl-vs-codex-gaia-failure-source-report-20260611.md

---

## 第 076 页｜Olympics Table Adapter

**分组**：结构化来源 / `GAIA-DATA`

**优先级**：P1

**结论**：cf106601 需要 1928 Olympics 参赛/代表团表；应通过稳定表格或 Wikidata/IOC source 结构化抽取。

**Codex 机制**：专用数据题的正确路径通常是 adapter 或稳定表格，而不是泛搜。Codex 的优势是能更早切换到 API、下载表格、写脚本、读取 JSON path。

**AIGL 差距**：结构化来源 8/8 失败，ClinicalTrials 甚至调用了 external tool 仍提交空答案，说明 adapter correctness 和结果传递链都不稳。

**改造建议**：按来源建立 adapters：ClinicalTrials、Baseball Reference、Wikipedia FA、Cornell LII、Olympics、NPB、BASE；每个 adapter 返回 normalized evidence rows。

**验收点**：每个 adapter 有 contract test、gold fixture、JSON path assertion；finalizer 不接受没有 source row/path 的答案。

**证据**：tools; exec; aigl; gaia

**证据展开**：tools: .refs/openai-codex/codex-rs/core/src/tools/router.rs:36,52,59；registry.rs:161,185,273,294；spec_plan.rs:725,789,797；mcp_tool_exposure.rs:10,32,36,40,46；tool_search.rs:23,57,73,109 | exec: .refs/openai-codex/codex-rs/core/src/tools/handlers/shell_spec.rs:20,103,217,229,267；unified_exec/exec_command.rs:72,222,236,279,291；write_stdin.rs:32,47,100；process_manager.rs:432,443,578,595,643,668,1093,1219 | aigl: F:/AIGril/electron/humanclaw-agent-runner.cjs:3544,3545,3561,3562,5175,5197,5223,5484,5607,5678,5798；humanclaw-tool-contracts.cjs:538,584,661,682；humanclaw-runtime.cjs:471,528,771,923；humanclaw-gateway.cjs:663,717,734,885,1635,1695 | gaia: F:/AIGril/scripts/run-gaia-level1-lite.mjs:328,355,414,425,600,622；F:/AIGril/eval-results/engineering/gaia-official/*20260611*.summary.json；F:/AIGril/docs/aigl-vs-codex-gaia-failure-source-report-20260611.md

---

## 第 077 页｜NPB Roster Adapter

**分组**：结构化来源 / `GAIA-DATA`

**优先级**：P1

**结论**：a0c07678 需要日本棒球名单与背号邻接；adapter 要处理姓名罗马字/日文、队伍、赛季和背号排序。

**Codex 机制**：专用数据题的正确路径通常是 adapter 或稳定表格，而不是泛搜。Codex 的优势是能更早切换到 API、下载表格、写脚本、读取 JSON path。

**AIGL 差距**：结构化来源 8/8 失败，ClinicalTrials 甚至调用了 external tool 仍提交空答案，说明 adapter correctness 和结果传递链都不稳。

**改造建议**：按来源建立 adapters：ClinicalTrials、Baseball Reference、Wikipedia FA、Cornell LII、Olympics、NPB、BASE；每个 adapter 返回 normalized evidence rows。

**验收点**：每个 adapter 有 contract test、gold fixture、JSON path assertion；finalizer 不接受没有 source row/path 的答案。

**证据**：tools; exec; aigl; gaia

**证据展开**：tools: .refs/openai-codex/codex-rs/core/src/tools/router.rs:36,52,59；registry.rs:161,185,273,294；spec_plan.rs:725,789,797；mcp_tool_exposure.rs:10,32,36,40,46；tool_search.rs:23,57,73,109 | exec: .refs/openai-codex/codex-rs/core/src/tools/handlers/shell_spec.rs:20,103,217,229,267；unified_exec/exec_command.rs:72,222,236,279,291；write_stdin.rs:32,47,100；process_manager.rs:432,443,578,595,643,668,1093,1219 | aigl: F:/AIGril/electron/humanclaw-agent-runner.cjs:3544,3545,3561,3562,5175,5197,5223,5484,5607,5678,5798；humanclaw-tool-contracts.cjs:538,584,661,682；humanclaw-runtime.cjs:471,528,771,923；humanclaw-gateway.cjs:663,717,734,885,1635,1695 | gaia: F:/AIGril/scripts/run-gaia-level1-lite.mjs:328,355,414,425,600,622；F:/AIGril/eval-results/engineering/gaia-official/*20260611*.summary.json；F:/AIGril/docs/aigl-vs-codex-gaia-failure-source-report-20260611.md

---

## 第 078 页｜BASE Interactive Table

**分组**：结构化来源 / `GAIA-DATA`

**优先级**：P1

**结论**：72e110e7 属于动态/交互表格；需要 browser/table extraction 或 API，而不是搜索结果里的国家名猜测。

**Codex 机制**：专用数据题的正确路径通常是 adapter 或稳定表格，而不是泛搜。Codex 的优势是能更早切换到 API、下载表格、写脚本、读取 JSON path。

**AIGL 差距**：结构化来源 8/8 失败，ClinicalTrials 甚至调用了 external tool 仍提交空答案，说明 adapter correctness 和结果传递链都不稳。

**改造建议**：按来源建立 adapters：ClinicalTrials、Baseball Reference、Wikipedia FA、Cornell LII、Olympics、NPB、BASE；每个 adapter 返回 normalized evidence rows。

**验收点**：每个 adapter 有 contract test、gold fixture、JSON path assertion；finalizer 不接受没有 source row/path 的答案。

**证据**：tools; exec; aigl; gaia

**证据展开**：tools: .refs/openai-codex/codex-rs/core/src/tools/router.rs:36,52,59；registry.rs:161,185,273,294；spec_plan.rs:725,789,797；mcp_tool_exposure.rs:10,32,36,40,46；tool_search.rs:23,57,73,109 | exec: .refs/openai-codex/codex-rs/core/src/tools/handlers/shell_spec.rs:20,103,217,229,267；unified_exec/exec_command.rs:72,222,236,279,291；write_stdin.rs:32,47,100；process_manager.rs:432,443,578,595,643,668,1093,1219 | aigl: F:/AIGril/electron/humanclaw-agent-runner.cjs:3544,3545,3561,3562,5175,5197,5223,5484,5607,5678,5798；humanclaw-tool-contracts.cjs:538,584,661,682；humanclaw-runtime.cjs:471,528,771,923；humanclaw-gateway.cjs:663,717,734,885,1635,1695 | gaia: F:/AIGril/scripts/run-gaia-level1-lite.mjs:328,355,414,425,600,622；F:/AIGril/eval-results/engineering/gaia-official/*20260611*.summary.json；F:/AIGril/docs/aigl-vs-codex-gaia-failure-source-report-20260611.md

---

## 第 079 页｜Presidents Geo Compute

**分组**：结构化来源 / `GAIA-DATA`

**优先级**：P1

**结论**：c365c1c7 需要完整列表、坐标和距离计算；正确路径是获取 source list 后脚本计算，而非模型凭常识。

**Codex 机制**：专用数据题的正确路径通常是 adapter 或稳定表格，而不是泛搜。Codex 的优势是能更早切换到 API、下载表格、写脚本、读取 JSON path。

**AIGL 差距**：结构化来源 8/8 失败，ClinicalTrials 甚至调用了 external tool 仍提交空答案，说明 adapter correctness 和结果传递链都不稳。

**改造建议**：按来源建立 adapters：ClinicalTrials、Baseball Reference、Wikipedia FA、Cornell LII、Olympics、NPB、BASE；每个 adapter 返回 normalized evidence rows。

**验收点**：每个 adapter 有 contract test、gold fixture、JSON path assertion；finalizer 不接受没有 source row/path 的答案。

**证据**：tools; exec; aigl; gaia

**证据展开**：tools: .refs/openai-codex/codex-rs/core/src/tools/router.rs:36,52,59；registry.rs:161,185,273,294；spec_plan.rs:725,789,797；mcp_tool_exposure.rs:10,32,36,40,46；tool_search.rs:23,57,73,109 | exec: .refs/openai-codex/codex-rs/core/src/tools/handlers/shell_spec.rs:20,103,217,229,267；unified_exec/exec_command.rs:72,222,236,279,291；write_stdin.rs:32,47,100；process_manager.rs:432,443,578,595,643,668,1093,1219 | aigl: F:/AIGril/electron/humanclaw-agent-runner.cjs:3544,3545,3561,3562,5175,5197,5223,5484,5607,5678,5798；humanclaw-tool-contracts.cjs:538,584,661,682；humanclaw-runtime.cjs:471,528,771,923；humanclaw-gateway.cjs:663,717,734,885,1635,1695 | gaia: F:/AIGril/scripts/run-gaia-level1-lite.mjs:328,355,414,425,600,622；F:/AIGril/eval-results/engineering/gaia-official/*20260611*.summary.json；F:/AIGril/docs/aigl-vs-codex-gaia-failure-source-report-20260611.md

---

## 第 080 页｜通用表格抽取

**分组**：结构化来源 / `GAIA-DATA`

**优先级**：P1

**结论**：所有表格题都应输出 rows、columns、source_url、row_selector、normalization 和 computed_result；这让 finalizer 不必猜。

**Codex 机制**：专用数据题的正确路径通常是 adapter 或稳定表格，而不是泛搜。Codex 的优势是能更早切换到 API、下载表格、写脚本、读取 JSON path。

**AIGL 差距**：结构化来源 8/8 失败，ClinicalTrials 甚至调用了 external tool 仍提交空答案，说明 adapter correctness 和结果传递链都不稳。

**改造建议**：按来源建立 adapters：ClinicalTrials、Baseball Reference、Wikipedia FA、Cornell LII、Olympics、NPB、BASE；每个 adapter 返回 normalized evidence rows。

**验收点**：每个 adapter 有 contract test、gold fixture、JSON path assertion；finalizer 不接受没有 source row/path 的答案。

**证据**：tools; exec; aigl; gaia

**证据展开**：tools: .refs/openai-codex/codex-rs/core/src/tools/router.rs:36,52,59；registry.rs:161,185,273,294；spec_plan.rs:725,789,797；mcp_tool_exposure.rs:10,32,36,40,46；tool_search.rs:23,57,73,109 | exec: .refs/openai-codex/codex-rs/core/src/tools/handlers/shell_spec.rs:20,103,217,229,267；unified_exec/exec_command.rs:72,222,236,279,291；write_stdin.rs:32,47,100；process_manager.rs:432,443,578,595,643,668,1093,1219 | aigl: F:/AIGril/electron/humanclaw-agent-runner.cjs:3544,3545,3561,3562,5175,5197,5223,5484,5607,5678,5798；humanclaw-tool-contracts.cjs:538,584,661,682；humanclaw-runtime.cjs:471,528,771,923；humanclaw-gateway.cjs:663,717,734,885,1635,1695 | gaia: F:/AIGril/scripts/run-gaia-level1-lite.mjs:328,355,414,425,600,622；F:/AIGril/eval-results/engineering/gaia-official/*20260611*.summary.json；F:/AIGril/docs/aigl-vs-codex-gaia-failure-source-report-20260611.md

---

## 第 081 页｜Compute Handoff

**分组**：Shell / Session / `EXEC-RUNTIME`

**优先级**：P0

**结论**：一旦问题需要排序、计数、距离、比例或跨表 join，应进入 script artifact。Codex 的强项是自然切到 shell/脚本并读取 stdout。

**Codex 机制**：Codex 的 shell 能力是 exec_command + write_stdin + ProcessManager，而不是一次性命令。它支持 session_id、轮询、stdin、yield_time_ms、max_output_tokens、原始 token 计数和输出截断。

**AIGL 差距**：AIGL 有 computer.exec、session_start、pty_* 和 code.test 等多条执行路径，模型侧入口碎片化；长任务和脚本输出不总能稳定成为 answer-bearing evidence。

**改造建议**：新增 Codex 同型 exec_command/write_stdin 表面，旧 exec/PTY/process_read 降为内部后端；所有命令输出统一 ToolOutput 和 transcript。

**验收点**：pnpm test、Python 脚本、交互式 REPL 都能返回 session_id；空 write_stdin 可轮询；最终 transcript 包含 exit_code、stdout、stderr、original_token_count。

**证据**：official; exec; output; aigl

**证据展开**：official: 官方资料：Codex CLI https://developers.openai.com/codex/cli；Codex MCP https://developers.openai.com/codex/mcp；Apply Patch https://developers.openai.com/api/docs/guides/tools-apply-patch；Tool Search https://developers.openai.com/api/docs/guides/tools-tool-search；Shell https://developers.openai.com/api/docs/guides/tools-shell；Web Search https://developers.openai.com/api/docs/guides/tools-web-search；Agents SDK https://developers.openai.com/api/docs/guides/agents | exec: .refs/openai-codex/codex-rs/core/src/tools/handlers/shell_spec.rs:20,103,217,229,267；unified_exec/exec_command.rs:72,222,236,279,291；write_stdin.rs:32,47,100；process_manager.rs:432,443,578,595,643,668,1093,1219 | output: .refs/openai-codex/codex-rs/core/src/tools/context.rs:66,148,235,308,318,404,427；events.rs:54,167,316,337,395 | aigl: F:/AIGril/electron/humanclaw-agent-runner.cjs:3544,3545,3561,3562,5175,5197,5223,5484,5607,5678,5798；humanclaw-tool-contracts.cjs:538,584,661,682；humanclaw-runtime.cjs:471,528,771,923；humanclaw-gateway.cjs:663,717,734,885,1635,1695

---

## 第 082 页｜Benchmark Final Answer Contract

**分组**：Exact Answer / `FINAL`

**优先级**：P0

**结论**：GAIA 模式必须把用户可见回复和 submitted_answer 分离；自然语言解释不能直接成为提交答案。

**Codex 机制**：Codex 普通对话 final 与 benchmark exact answer 应分离。benchmark 模式需要 final_answer 原生工具或严格 schema，并把证据检查前置到主循环，而不是事后补救。

**AIGL 差距**：finalizer/格式化 4/4 不得分：有空提交、整段中文解释提交、低置信错误提交和 b,e 格式问题。

**改造建议**：新增 final_answer 工具，字段含 answer、format_type、confidence、evidence_refs；缺证据时返回 repair_instruction，不允许提交自然语言长段。

**验收点**：submitted_answer 只能来自 final_answer 工具；confidence 低或 evidence_refs 空时不得提交；格式 normalization 有单元测试。

**证据**：gaia; aigl

**证据展开**：gaia: F:/AIGril/scripts/run-gaia-level1-lite.mjs:328,355,414,425,600,622；F:/AIGril/eval-results/engineering/gaia-official/*20260611*.summary.json；F:/AIGril/docs/aigl-vs-codex-gaia-failure-source-report-20260611.md | aigl: F:/AIGril/electron/humanclaw-agent-runner.cjs:3544,3545,3561,3562,5175,5197,5223,5484,5607,5678,5798；humanclaw-tool-contracts.cjs:538,584,661,682；humanclaw-runtime.cjs:471,528,771,923；humanclaw-gateway.cjs:663,717,734,885,1635,1695

---

## 第 083 页｜Finalizer Confidence Gate

**分组**：Exact Answer / `FINAL`

**优先级**：P0

**结论**：d0633230 显示低置信错误仍提交；finalizer 必须有 confidence/evidence gate，低于阈值返回 repair 而非提交。

**Codex 机制**：Codex 普通对话 final 与 benchmark exact answer 应分离。benchmark 模式需要 final_answer 原生工具或严格 schema，并把证据检查前置到主循环，而不是事后补救。

**AIGL 差距**：finalizer/格式化 4/4 不得分：有空提交、整段中文解释提交、低置信错误提交和 b,e 格式问题。

**改造建议**：新增 final_answer 工具，字段含 answer、format_type、confidence、evidence_refs；缺证据时返回 repair_instruction，不允许提交自然语言长段。

**验收点**：submitted_answer 只能来自 final_answer 工具；confidence 低或 evidence_refs 空时不得提交；格式 normalization 有单元测试。

**证据**：gaia; aigl

**证据展开**：gaia: F:/AIGril/scripts/run-gaia-level1-lite.mjs:328,355,414,425,600,622；F:/AIGril/eval-results/engineering/gaia-official/*20260611*.summary.json；F:/AIGril/docs/aigl-vs-codex-gaia-failure-source-report-20260611.md | aigl: F:/AIGril/electron/humanclaw-agent-runner.cjs:3544,3545,3561,3562,5175,5197,5223,5484,5607,5678,5798；humanclaw-tool-contracts.cjs:538,584,661,682；humanclaw-runtime.cjs:471,528,771,923；humanclaw-gateway.cjs:663,717,734,885,1635,1695

---

## 第 084 页｜Answer Normalization

**分组**：Exact Answer / `FINAL`

**优先级**：P0

**结论**：6f37996b 的 b,e 格式问题说明 exact-answer normalization 要覆盖符号集合、大小写、单位、逗号空格和数字格式。

**Codex 机制**：Codex 普通对话 final 与 benchmark exact answer 应分离。benchmark 模式需要 final_answer 原生工具或严格 schema，并把证据检查前置到主循环，而不是事后补救。

**AIGL 差距**：finalizer/格式化 4/4 不得分：有空提交、整段中文解释提交、低置信错误提交和 b,e 格式问题。

**改造建议**：新增 final_answer 工具，字段含 answer、format_type、confidence、evidence_refs；缺证据时返回 repair_instruction，不允许提交自然语言长段。

**验收点**：submitted_answer 只能来自 final_answer 工具；confidence 低或 evidence_refs 空时不得提交；格式 normalization 有单元测试。

**证据**：gaia; aigl

**证据展开**：gaia: F:/AIGril/scripts/run-gaia-level1-lite.mjs:328,355,414,425,600,622；F:/AIGril/eval-results/engineering/gaia-official/*20260611*.summary.json；F:/AIGril/docs/aigl-vs-codex-gaia-failure-source-report-20260611.md | aigl: F:/AIGril/electron/humanclaw-agent-runner.cjs:3544,3545,3561,3562,5175,5197,5223,5484,5607,5678,5798；humanclaw-tool-contracts.cjs:538,584,661,682；humanclaw-runtime.cjs:471,528,771,923；humanclaw-gateway.cjs:663,717,734,885,1635,1695

---

## 第 085 页｜Observation Digest Gap

**分组**：观测与证据 / `EVIDENCE`

**优先级**：P0

**结论**：所谓 lossless observation 只保留有限窗口和摘要时就不是真 lossless；答案字段一旦不在窗口里，finalizer 会失明。

**Codex 机制**：Codex 将工具结果、事件、截断、遥测 preview 和上下文压缩分别处理：UI 可以丰富，模型上下文必须小而准；失败和拒绝也都是正式事件。

**AIGL 差距**：AIGL 的 observation 目前仍过度依赖 preview/digest；ClinicalTrials 和 PPT 案例说明答案可能出现在过程里，但 finalizer 未拿到稳定证据槽。

**改造建议**：建立 EvidenceArtifact：原始 stdout、JSON path、网页字段、PDF 页码、截图帧、表格行都用 artifact id 保存，model-facing 只传摘要和引用。

**验收点**：finalizer 输入含 artifact refs；如果答案只在截断外，finalizer 必须请求读取 artifact 而不是空提交或猜答案。

**证据**：output; exec; aigl; gaia

**证据展开**：output: .refs/openai-codex/codex-rs/core/src/tools/context.rs:66,148,235,308,318,404,427；events.rs:54,167,316,337,395 | exec: .refs/openai-codex/codex-rs/core/src/tools/handlers/shell_spec.rs:20,103,217,229,267；unified_exec/exec_command.rs:72,222,236,279,291；write_stdin.rs:32,47,100；process_manager.rs:432,443,578,595,643,668,1093,1219 | aigl: F:/AIGril/electron/humanclaw-agent-runner.cjs:3544,3545,3561,3562,5175,5197,5223,5484,5607,5678,5798；humanclaw-tool-contracts.cjs:538,584,661,682；humanclaw-runtime.cjs:471,528,771,923；humanclaw-gateway.cjs:663,717,734,885,1635,1695 | gaia: F:/AIGril/scripts/run-gaia-level1-lite.mjs:328,355,414,425,600,622；F:/AIGril/eval-results/engineering/gaia-official/*20260611*.summary.json；F:/AIGril/docs/aigl-vs-codex-gaia-failure-source-report-20260611.md

---

## 第 086 页｜recent_turn_items Gap

**分组**：上下文压缩 / `MEMORY`

**优先级**：P0

**结论**：recent_turn_items 是好方向，但它应承载结构化 observation refs，而不是把所有证据压成 preview 字符串。

**Codex 机制**：Codex 在 pre-sampling 和 auto-compact 路径中按 token 状态、scope limit、window ordinal 和 prefill tokens 判断是否压缩；它不是等到上下文爆掉才处理。

**AIGL 差距**：AIGL 已有 recent_turn_items 和 prompt_compaction 设计，但任务链仍可能把长日志、重复 progress、摘要 observation 多次塞回模型。

**改造建议**：把 70% 作为早压缩阈值，75-80% 生成 CODEX_MEMORY.md；active prompt 只保留最近事件、未解决证据和任务状态。

**验收点**：长任务跑到 70% 时写入检查点；新线程可从检查点继续；无 API key、token、敏感原文泄漏。

**证据**：turn; aigl; F:/AIGril/docs/aigl-codex-context-compaction.md

**证据展开**：turn: .refs/openai-codex/codex-rs/core/src/session/turn.rs:141,163,236,640,692,770,892,1098,1106,1616 | aigl: F:/AIGril/electron/humanclaw-agent-runner.cjs:3544,3545,3561,3562,5175,5197,5223,5484,5607,5678,5798；humanclaw-tool-contracts.cjs:538,584,661,682；humanclaw-runtime.cjs:471,528,771,923；humanclaw-gateway.cjs:663,717,734,885,1635,1695 | F:/AIGril/docs/aigl-codex-context-compaction.md: F:/AIGril/docs/aigl-codex-context-compaction.md

---

## 第 087 页｜Lossless 并不 Lossless

**分组**：观测与证据 / `EVIDENCE`

**优先级**：P0

**结论**：当工具结果被截断到 5000/1600 字符摘要时，critical field 可能丢失；应把原文存 artifact，把摘要只当索引。

**Codex 机制**：Codex 将工具结果、事件、截断、遥测 preview 和上下文压缩分别处理：UI 可以丰富，模型上下文必须小而准；失败和拒绝也都是正式事件。

**AIGL 差距**：AIGL 的 observation 目前仍过度依赖 preview/digest；ClinicalTrials 和 PPT 案例说明答案可能出现在过程里，但 finalizer 未拿到稳定证据槽。

**改造建议**：建立 EvidenceArtifact：原始 stdout、JSON path、网页字段、PDF 页码、截图帧、表格行都用 artifact id 保存，model-facing 只传摘要和引用。

**验收点**：finalizer 输入含 artifact refs；如果答案只在截断外，finalizer 必须请求读取 artifact 而不是空提交或猜答案。

**证据**：output; exec; aigl; gaia

**证据展开**：output: .refs/openai-codex/codex-rs/core/src/tools/context.rs:66,148,235,308,318,404,427；events.rs:54,167,316,337,395 | exec: .refs/openai-codex/codex-rs/core/src/tools/handlers/shell_spec.rs:20,103,217,229,267；unified_exec/exec_command.rs:72,222,236,279,291；write_stdin.rs:32,47,100；process_manager.rs:432,443,578,595,643,668,1093,1219 | aigl: F:/AIGril/electron/humanclaw-agent-runner.cjs:3544,3545,3561,3562,5175,5197,5223,5484,5607,5678,5798；humanclaw-tool-contracts.cjs:538,584,661,682；humanclaw-runtime.cjs:471,528,771,923；humanclaw-gateway.cjs:663,717,734,885,1635,1695 | gaia: F:/AIGril/scripts/run-gaia-level1-lite.mjs:328,355,414,425,600,622；F:/AIGril/eval-results/engineering/gaia-official/*20260611*.summary.json；F:/AIGril/docs/aigl-vs-codex-gaia-failure-source-report-20260611.md

---

## 第 088 页｜Direct Native Tools Gap

**分组**：工具暴露与发现 / `TOOLS`

**优先级**：P0

**结论**：AIGL direct mode 已开始暴露 native direct tools，但 fallback/meta JSON 仍会让 nested args 脆弱，尤其是 MCP/external 工具。

**Codex 机制**：Codex 的工具不是自然语言建议，而是模型可见 spec 与 runtime handler 绑定的类型化对象。工具过多时会 deferred，通过 tool_search 搜索后再加载，避免 prompt 被全部 schema 淹没。

**AIGL 差距**：AIGL 有 tool_search contract 和 Gateway 搜索能力，但 GAIA 失败里仍出现 tool_search 参数用 question 而不是 query，说明模型没有始终在真实 schema 上生成调用。

**改造建议**：benchmark/task 模式下让 tool_search、MCP、external__ 工具成为原生 callable tools；搜索结果必须返回可加载 spec，不只返回推荐文本。

**验收点**：150 个工具注册时，首轮只暴露核心工具和 tool_search；命中工具在下一轮以完整 schema 可调用，错参率进入测试门槛。

**证据**：official; tools; aigl; gaia

**证据展开**：official: 官方资料：Codex CLI https://developers.openai.com/codex/cli；Codex MCP https://developers.openai.com/codex/mcp；Apply Patch https://developers.openai.com/api/docs/guides/tools-apply-patch；Tool Search https://developers.openai.com/api/docs/guides/tools-tool-search；Shell https://developers.openai.com/api/docs/guides/tools-shell；Web Search https://developers.openai.com/api/docs/guides/tools-web-search；Agents SDK https://developers.openai.com/api/docs/guides/agents | tools: .refs/openai-codex/codex-rs/core/src/tools/router.rs:36,52,59；registry.rs:161,185,273,294；spec_plan.rs:725,789,797；mcp_tool_exposure.rs:10,32,36,40,46；tool_search.rs:23,57,73,109 | aigl: F:/AIGril/electron/humanclaw-agent-runner.cjs:3544,3545,3561,3562,5175,5197,5223,5484,5607,5678,5798；humanclaw-tool-contracts.cjs:538,584,661,682；humanclaw-runtime.cjs:471,528,771,923；humanclaw-gateway.cjs:663,717,734,885,1635,1695 | gaia: F:/AIGril/scripts/run-gaia-level1-lite.mjs:328,355,414,425,600,622；F:/AIGril/eval-results/engineering/gaia-official/*20260611*.summary.json；F:/AIGril/docs/aigl-vs-codex-gaia-failure-source-report-20260611.md

---

## 第 089 页｜Nested Args Schema Error

**分组**：工具暴露与发现 / `TOOLS`

**优先级**：P0

**结论**：tool_search 用 question 而不是 query 的错误说明 schema 约束没在生成时生效；真实 function schema 暴露比 prompt 纠错更可靠。

**Codex 机制**：Codex 的工具不是自然语言建议，而是模型可见 spec 与 runtime handler 绑定的类型化对象。工具过多时会 deferred，通过 tool_search 搜索后再加载，避免 prompt 被全部 schema 淹没。

**AIGL 差距**：AIGL 有 tool_search contract 和 Gateway 搜索能力，但 GAIA 失败里仍出现 tool_search 参数用 question 而不是 query，说明模型没有始终在真实 schema 上生成调用。

**改造建议**：benchmark/task 模式下让 tool_search、MCP、external__ 工具成为原生 callable tools；搜索结果必须返回可加载 spec，不只返回推荐文本。

**验收点**：150 个工具注册时，首轮只暴露核心工具和 tool_search；命中工具在下一轮以完整 schema 可调用，错参率进入测试门槛。

**证据**：official; tools; aigl; gaia

**证据展开**：official: 官方资料：Codex CLI https://developers.openai.com/codex/cli；Codex MCP https://developers.openai.com/codex/mcp；Apply Patch https://developers.openai.com/api/docs/guides/tools-apply-patch；Tool Search https://developers.openai.com/api/docs/guides/tools-tool-search；Shell https://developers.openai.com/api/docs/guides/tools-shell；Web Search https://developers.openai.com/api/docs/guides/tools-web-search；Agents SDK https://developers.openai.com/api/docs/guides/agents | tools: .refs/openai-codex/codex-rs/core/src/tools/router.rs:36,52,59；registry.rs:161,185,273,294；spec_plan.rs:725,789,797；mcp_tool_exposure.rs:10,32,36,40,46；tool_search.rs:23,57,73,109 | aigl: F:/AIGril/electron/humanclaw-agent-runner.cjs:3544,3545,3561,3562,5175,5197,5223,5484,5607,5678,5798；humanclaw-tool-contracts.cjs:538,584,661,682；humanclaw-runtime.cjs:471,528,771,923；humanclaw-gateway.cjs:663,717,734,885,1635,1695 | gaia: F:/AIGril/scripts/run-gaia-level1-lite.mjs:328,355,414,425,600,622；F:/AIGril/eval-results/engineering/gaia-official/*20260611*.summary.json；F:/AIGril/docs/aigl-vs-codex-gaia-failure-source-report-20260611.md

---

## 第 090 页｜tool_search query/q Bug

**分组**：工具暴露与发现 / `TOOLS`

**优先级**：P0

**结论**：AIGL contract 明确要求 query/q，但模型仍错参；修复方向是让 tool_search 成为原生工具，并用 schema validation 生成可修复 observation。

**Codex 机制**：Codex 的工具不是自然语言建议，而是模型可见 spec 与 runtime handler 绑定的类型化对象。工具过多时会 deferred，通过 tool_search 搜索后再加载，避免 prompt 被全部 schema 淹没。

**AIGL 差距**：AIGL 有 tool_search contract 和 Gateway 搜索能力，但 GAIA 失败里仍出现 tool_search 参数用 question 而不是 query，说明模型没有始终在真实 schema 上生成调用。

**改造建议**：benchmark/task 模式下让 tool_search、MCP、external__ 工具成为原生 callable tools；搜索结果必须返回可加载 spec，不只返回推荐文本。

**验收点**：150 个工具注册时，首轮只暴露核心工具和 tool_search；命中工具在下一轮以完整 schema 可调用，错参率进入测试门槛。

**证据**：official; tools; aigl; gaia

**证据展开**：official: 官方资料：Codex CLI https://developers.openai.com/codex/cli；Codex MCP https://developers.openai.com/codex/mcp；Apply Patch https://developers.openai.com/api/docs/guides/tools-apply-patch；Tool Search https://developers.openai.com/api/docs/guides/tools-tool-search；Shell https://developers.openai.com/api/docs/guides/tools-shell；Web Search https://developers.openai.com/api/docs/guides/tools-web-search；Agents SDK https://developers.openai.com/api/docs/guides/agents | tools: .refs/openai-codex/codex-rs/core/src/tools/router.rs:36,52,59；registry.rs:161,185,273,294；spec_plan.rs:725,789,797；mcp_tool_exposure.rs:10,32,36,40,46；tool_search.rs:23,57,73,109 | aigl: F:/AIGril/electron/humanclaw-agent-runner.cjs:3544,3545,3561,3562,5175,5197,5223,5484,5607,5678,5798；humanclaw-tool-contracts.cjs:538,584,661,682；humanclaw-runtime.cjs:471,528,771,923；humanclaw-gateway.cjs:663,717,734,885,1635,1695 | gaia: F:/AIGril/scripts/run-gaia-level1-lite.mjs:328,355,414,425,600,622；F:/AIGril/eval-results/engineering/gaia-official/*20260611*.summary.json；F:/AIGril/docs/aigl-vs-codex-gaia-failure-source-report-20260611.md

---

## 第 091 页｜Adapter Correctness

**分组**：结构化来源 / `GAIA-DATA`

**优先级**：P1

**结论**：即使工具被发现，如果 adapter 参数、字段路径或返回标准错了，最终仍失败；每个 adapter 都需要 fixture 和 contract test。

**Codex 机制**：专用数据题的正确路径通常是 adapter 或稳定表格，而不是泛搜。Codex 的优势是能更早切换到 API、下载表格、写脚本、读取 JSON path。

**AIGL 差距**：结构化来源 8/8 失败，ClinicalTrials 甚至调用了 external tool 仍提交空答案，说明 adapter correctness 和结果传递链都不稳。

**改造建议**：按来源建立 adapters：ClinicalTrials、Baseball Reference、Wikipedia FA、Cornell LII、Olympics、NPB、BASE；每个 adapter 返回 normalized evidence rows。

**验收点**：每个 adapter 有 contract test、gold fixture、JSON path assertion；finalizer 不接受没有 source row/path 的答案。

**证据**：tools; exec; aigl; gaia

**证据展开**：tools: .refs/openai-codex/codex-rs/core/src/tools/router.rs:36,52,59；registry.rs:161,185,273,294；spec_plan.rs:725,789,797；mcp_tool_exposure.rs:10,32,36,40,46；tool_search.rs:23,57,73,109 | exec: .refs/openai-codex/codex-rs/core/src/tools/handlers/shell_spec.rs:20,103,217,229,267；unified_exec/exec_command.rs:72,222,236,279,291；write_stdin.rs:32,47,100；process_manager.rs:432,443,578,595,643,668,1093,1219 | aigl: F:/AIGril/electron/humanclaw-agent-runner.cjs:3544,3545,3561,3562,5175,5197,5223,5484,5607,5678,5798；humanclaw-tool-contracts.cjs:538,584,661,682；humanclaw-runtime.cjs:471,528,771,923；humanclaw-gateway.cjs:663,717,734,885,1635,1695 | gaia: F:/AIGril/scripts/run-gaia-level1-lite.mjs:328,355,414,425,600,622；F:/AIGril/eval-results/engineering/gaia-official/*20260611*.summary.json；F:/AIGril/docs/aigl-vs-codex-gaia-failure-source-report-20260611.md

---

## 第 092 页｜P0：真正 direct-tool executor

**分组**：落地路线 / `ROADMAP`

**优先级**：P0

**结论**：第一优先级是 benchmark/task 模式去掉 meta planner 主路径，让核心工具和命中的 external/MCP 工具直接作为 callable schema 暴露。

**Codex 机制**：最值得复制的是执行链形状：原生工具、sessionized exec、结构化 patch、权限协议、工具搜索、ToolOutput、ToolEvent、压缩和证据管理。

**AIGL 差距**：AIGL 当前最危险的不是没有工具，而是多条半成品链路并存：meta planner、direct tools、summary observation、finalizer、adapter 各自工作但没有闭环。

**改造建议**：按 P0/P1/P2 推进：P0 先主链和证据，P1 补媒体/adapter，P2 做优化、遥测、回归和长任务体验。

**验收点**：每个 P0 改动都有 benchmark gate；没有 GAIA 分类回归报告，不合并 runtime 行为改动。

**证据**：gaia; F:/AIGril/AIGrilClaw/docs/codex-code-architecture-guide.md; F:/AIGril/AIGrilClaw/docs/aigl-codex-mainline-spec.md

**证据展开**：gaia: F:/AIGril/scripts/run-gaia-level1-lite.mjs:328,355,414,425,600,622；F:/AIGril/eval-results/engineering/gaia-official/*20260611*.summary.json；F:/AIGril/docs/aigl-vs-codex-gaia-failure-source-report-20260611.md | F:/AIGril/AIGrilClaw/docs/codex-code-architecture-guide.md: F:/AIGril/AIGrilClaw/docs/codex-code-architecture-guide.md | F:/AIGril/AIGrilClaw/docs/aigl-codex-mainline-spec.md: F:/AIGril/AIGrilClaw/docs/aigl-codex-mainline-spec.md

---

## 第 093 页｜P0：EvidenceArtifact Store

**分组**：落地路线 / `ROADMAP`

**优先级**：P0

**结论**：第二优先级是证据仓库：stdout、网页字段、PDF 页码、JSON path、表格行、视频帧都要可引用、可复读、可传给 finalizer。

**Codex 机制**：最值得复制的是执行链形状：原生工具、sessionized exec、结构化 patch、权限协议、工具搜索、ToolOutput、ToolEvent、压缩和证据管理。

**AIGL 差距**：AIGL 当前最危险的不是没有工具，而是多条半成品链路并存：meta planner、direct tools、summary observation、finalizer、adapter 各自工作但没有闭环。

**改造建议**：按 P0/P1/P2 推进：P0 先主链和证据，P1 补媒体/adapter，P2 做优化、遥测、回归和长任务体验。

**验收点**：每个 P0 改动都有 benchmark gate；没有 GAIA 分类回归报告，不合并 runtime 行为改动。

**证据**：gaia; F:/AIGril/AIGrilClaw/docs/codex-code-architecture-guide.md; F:/AIGril/AIGrilClaw/docs/aigl-codex-mainline-spec.md

**证据展开**：gaia: F:/AIGril/scripts/run-gaia-level1-lite.mjs:328,355,414,425,600,622；F:/AIGril/eval-results/engineering/gaia-official/*20260611*.summary.json；F:/AIGril/docs/aigl-vs-codex-gaia-failure-source-report-20260611.md | F:/AIGril/AIGrilClaw/docs/codex-code-architecture-guide.md: F:/AIGril/AIGrilClaw/docs/codex-code-architecture-guide.md | F:/AIGril/AIGrilClaw/docs/aigl-codex-mainline-spec.md: F:/AIGril/AIGrilClaw/docs/aigl-codex-mainline-spec.md

---

## 第 094 页｜P0：final_answer 原生工具

**分组**：Exact Answer / `FINAL`

**优先级**：P0

**结论**：第三优先级是 final_answer 工具：只接受 exact answer、evidence_refs、confidence、format_type；用户可见话术另走 presenter。

**Codex 机制**：Codex 普通对话 final 与 benchmark exact answer 应分离。benchmark 模式需要 final_answer 原生工具或严格 schema，并把证据检查前置到主循环，而不是事后补救。

**AIGL 差距**：finalizer/格式化 4/4 不得分：有空提交、整段中文解释提交、低置信错误提交和 b,e 格式问题。

**改造建议**：新增 final_answer 工具，字段含 answer、format_type、confidence、evidence_refs；缺证据时返回 repair_instruction，不允许提交自然语言长段。

**验收点**：submitted_answer 只能来自 final_answer 工具；confidence 低或 evidence_refs 空时不得提交；格式 normalization 有单元测试。

**证据**：gaia; aigl

**证据展开**：gaia: F:/AIGril/scripts/run-gaia-level1-lite.mjs:328,355,414,425,600,622；F:/AIGril/eval-results/engineering/gaia-official/*20260611*.summary.json；F:/AIGril/docs/aigl-vs-codex-gaia-failure-source-report-20260611.md | aigl: F:/AIGril/electron/humanclaw-agent-runner.cjs:3544,3545,3561,3562,5175,5197,5223,5484,5607,5678,5798；humanclaw-tool-contracts.cjs:538,584,661,682；humanclaw-runtime.cjs:471,528,771,923；humanclaw-gateway.cjs:663,717,734,885,1635,1695

---

## 第 095 页｜P0：Retrieval Controllers

**分组**：长链检索 / `GAIA-LONG`

**优先级**：P0

**结论**：第四优先级是为长链、网页字段和结构化来源加 controller；禁止无新证据重复泛搜，把 max_steps 用在推进链路上。

**Codex 机制**：Codex 式长链不是一直搜索，而是把每一跳变成 artifact：锚定来源、抽取字段、保存下一跳实体、再进入下一步。shell/脚本/文件可把中间状态固化。

**AIGL 差距**：长链 6 题 0/6，典型症状是反复 web_search、没有稳定 canonical source、没有把上一跳证据作为下一跳输入。

**改造建议**：实现 retrieval controller：Query -> CandidateSource -> Fetch -> Locate -> Extract -> NextHop -> EvidenceCheck -> Final。每一跳必须有 artifact id。

**验收点**：6 道长链题中，每题至少输出 chain table；同一实体不得在无新证据时重复搜索三次；max_steps 前必须给出缺失 hop。

**证据**：official; gaia

**证据展开**：official: 官方资料：Codex CLI https://developers.openai.com/codex/cli；Codex MCP https://developers.openai.com/codex/mcp；Apply Patch https://developers.openai.com/api/docs/guides/tools-apply-patch；Tool Search https://developers.openai.com/api/docs/guides/tools-tool-search；Shell https://developers.openai.com/api/docs/guides/tools-shell；Web Search https://developers.openai.com/api/docs/guides/tools-web-search；Agents SDK https://developers.openai.com/api/docs/guides/agents | gaia: F:/AIGril/scripts/run-gaia-level1-lite.mjs:328,355,414,425,600,622；F:/AIGril/eval-results/engineering/gaia-official/*20260611*.summary.json；F:/AIGril/docs/aigl-vs-codex-gaia-failure-source-report-20260611.md

---

## 第 096 页｜P1：Media/Vision Primitives

**分组**：视频 / 视觉 / `GAIA-MEDIA`

**优先级**：P1

**结论**：视频/视觉要补 transcript、frame sampler、OCR、object counting、board/state extraction 和 solver 接口；否则真实视觉题仍无法稳定通过。

**Codex 机制**：Codex 不会神奇看懂所有视频，但它更容易升级到字幕、帧采样、截图、脚本和专用工具；关键是 runtime 允许模型发现并调用真实媒体 primitive。

**AIGL 差距**：视频/视觉 4 题只过 2 题：可被网页/字幕救的通过，鸟类同屏计数和棋盘结构化失败，说明缺 frame-to-structure 链路。

**改造建议**：补媒体 evidence pipeline：transcript first、frame sampling、OCR/vision labels、结构化状态生成、专用 solver/validator。

**验收点**：视频题输出 transcript/caption/frame evidence；棋盘题输出 FEN 或等价棋盘状态；计数题输出帧编号与对象列表。

**证据**：official; exec; gaia

**证据展开**：official: 官方资料：Codex CLI https://developers.openai.com/codex/cli；Codex MCP https://developers.openai.com/codex/mcp；Apply Patch https://developers.openai.com/api/docs/guides/tools-apply-patch；Tool Search https://developers.openai.com/api/docs/guides/tools-tool-search；Shell https://developers.openai.com/api/docs/guides/tools-shell；Web Search https://developers.openai.com/api/docs/guides/tools-web-search；Agents SDK https://developers.openai.com/api/docs/guides/agents | exec: .refs/openai-codex/codex-rs/core/src/tools/handlers/shell_spec.rs:20,103,217,229,267；unified_exec/exec_command.rs:72,222,236,279,291；write_stdin.rs:32,47,100；process_manager.rs:432,443,578,595,643,668,1093,1219 | gaia: F:/AIGril/scripts/run-gaia-level1-lite.mjs:328,355,414,425,600,622；F:/AIGril/eval-results/engineering/gaia-official/*20260611*.summary.json；F:/AIGril/docs/aigl-vs-codex-gaia-failure-source-report-20260611.md

---

## 第 097 页｜P1：Source Adapters

**分组**：结构化来源 / `GAIA-DATA`

**优先级**：P1

**结论**：专用数据源按失败类别补 adapter，不追求一次全覆盖，先做 ClinicalTrials、Wikipedia、Baseball、Legal、Olympics 的 gold fixtures。

**Codex 机制**：专用数据题的正确路径通常是 adapter 或稳定表格，而不是泛搜。Codex 的优势是能更早切换到 API、下载表格、写脚本、读取 JSON path。

**AIGL 差距**：结构化来源 8/8 失败，ClinicalTrials 甚至调用了 external tool 仍提交空答案，说明 adapter correctness 和结果传递链都不稳。

**改造建议**：按来源建立 adapters：ClinicalTrials、Baseball Reference、Wikipedia FA、Cornell LII、Olympics、NPB、BASE；每个 adapter 返回 normalized evidence rows。

**验收点**：每个 adapter 有 contract test、gold fixture、JSON path assertion；finalizer 不接受没有 source row/path 的答案。

**证据**：tools; exec; aigl; gaia

**证据展开**：tools: .refs/openai-codex/codex-rs/core/src/tools/router.rs:36,52,59；registry.rs:161,185,273,294；spec_plan.rs:725,789,797；mcp_tool_exposure.rs:10,32,36,40,46；tool_search.rs:23,57,73,109 | exec: .refs/openai-codex/codex-rs/core/src/tools/handlers/shell_spec.rs:20,103,217,229,267；unified_exec/exec_command.rs:72,222,236,279,291；write_stdin.rs:32,47,100；process_manager.rs:432,443,578,595,643,668,1093,1219 | aigl: F:/AIGril/electron/humanclaw-agent-runner.cjs:3544,3545,3561,3562,5175,5197,5223,5484,5607,5678,5798；humanclaw-tool-contracts.cjs:538,584,661,682；humanclaw-runtime.cjs:471,528,771,923；humanclaw-gateway.cjs:663,717,734,885,1635,1695 | gaia: F:/AIGril/scripts/run-gaia-level1-lite.mjs:328,355,414,425,600,622；F:/AIGril/eval-results/engineering/gaia-official/*20260611*.summary.json；F:/AIGril/docs/aigl-vs-codex-gaia-failure-source-report-20260611.md

---

## 第 098 页｜P1：Compaction 与 Token Telemetry

**分组**：上下文压缩 / `MEMORY`

**优先级**：P0

**结论**：AIGL 需要每轮记录 prompt tokens、tool output tokens、omitted items、active window 和 artifact refs；70% 触发检查点。

**Codex 机制**：Codex 在 pre-sampling 和 auto-compact 路径中按 token 状态、scope limit、window ordinal 和 prefill tokens 判断是否压缩；它不是等到上下文爆掉才处理。

**AIGL 差距**：AIGL 已有 recent_turn_items 和 prompt_compaction 设计，但任务链仍可能把长日志、重复 progress、摘要 observation 多次塞回模型。

**改造建议**：把 70% 作为早压缩阈值，75-80% 生成 CODEX_MEMORY.md；active prompt 只保留最近事件、未解决证据和任务状态。

**验收点**：长任务跑到 70% 时写入检查点；新线程可从检查点继续；无 API key、token、敏感原文泄漏。

**证据**：turn; aigl; F:/AIGril/docs/aigl-codex-context-compaction.md

**证据展开**：turn: .refs/openai-codex/codex-rs/core/src/session/turn.rs:141,163,236,640,692,770,892,1098,1106,1616 | aigl: F:/AIGril/electron/humanclaw-agent-runner.cjs:3544,3545,3561,3562,5175,5197,5223,5484,5607,5678,5798；humanclaw-tool-contracts.cjs:538,584,661,682；humanclaw-runtime.cjs:471,528,771,923；humanclaw-gateway.cjs:663,717,734,885,1635,1695 | F:/AIGril/docs/aigl-codex-context-compaction.md: F:/AIGril/docs/aigl-codex-context-compaction.md

---

## 第 099 页｜Regression Suite Matrix

**分组**：落地路线 / `ROADMAP`

**优先级**：P0

**结论**：每个修复必须跑分类回归：长链 6、网页 2、视频 4、结构化 8、finalizer 4；不能只看单题变好。

**Codex 机制**：最值得复制的是执行链形状：原生工具、sessionized exec、结构化 patch、权限协议、工具搜索、ToolOutput、ToolEvent、压缩和证据管理。

**AIGL 差距**：AIGL 当前最危险的不是没有工具，而是多条半成品链路并存：meta planner、direct tools、summary observation、finalizer、adapter 各自工作但没有闭环。

**改造建议**：按 P0/P1/P2 推进：P0 先主链和证据，P1 补媒体/adapter，P2 做优化、遥测、回归和长任务体验。

**验收点**：每个 P0 改动都有 benchmark gate；没有 GAIA 分类回归报告，不合并 runtime 行为改动。

**证据**：gaia; F:/AIGril/AIGrilClaw/docs/codex-code-architecture-guide.md; F:/AIGril/AIGrilClaw/docs/aigl-codex-mainline-spec.md

**证据展开**：gaia: F:/AIGril/scripts/run-gaia-level1-lite.mjs:328,355,414,425,600,622；F:/AIGril/eval-results/engineering/gaia-official/*20260611*.summary.json；F:/AIGril/docs/aigl-vs-codex-gaia-failure-source-report-20260611.md | F:/AIGril/AIGrilClaw/docs/codex-code-architecture-guide.md: F:/AIGril/AIGrilClaw/docs/codex-code-architecture-guide.md | F:/AIGril/AIGrilClaw/docs/aigl-codex-mainline-spec.md: F:/AIGril/AIGrilClaw/docs/aigl-codex-mainline-spec.md

---

## 第 100 页｜实施顺序与 Go/No-Go

**分组**：落地路线 / `ROADMAP`

**优先级**：P0

**结论**：Go 条件：direct schema 调用、artifact-backed finalizer、分类回归不退化。No-Go 条件：只改 prompt、只加工具名、没有证据链和测试。

**Codex 机制**：最值得复制的是执行链形状：原生工具、sessionized exec、结构化 patch、权限协议、工具搜索、ToolOutput、ToolEvent、压缩和证据管理。

**AIGL 差距**：AIGL 当前最危险的不是没有工具，而是多条半成品链路并存：meta planner、direct tools、summary observation、finalizer、adapter 各自工作但没有闭环。

**改造建议**：按 P0/P1/P2 推进：P0 先主链和证据，P1 补媒体/adapter，P2 做优化、遥测、回归和长任务体验。

**验收点**：每个 P0 改动都有 benchmark gate；没有 GAIA 分类回归报告，不合并 runtime 行为改动。

**证据**：gaia; F:/AIGril/AIGrilClaw/docs/codex-code-architecture-guide.md; F:/AIGril/AIGrilClaw/docs/aigl-codex-mainline-spec.md

**证据展开**：gaia: F:/AIGril/scripts/run-gaia-level1-lite.mjs:328,355,414,425,600,622；F:/AIGril/eval-results/engineering/gaia-official/*20260611*.summary.json；F:/AIGril/docs/aigl-vs-codex-gaia-failure-source-report-20260611.md | F:/AIGril/AIGrilClaw/docs/codex-code-architecture-guide.md: F:/AIGril/AIGrilClaw/docs/codex-code-architecture-guide.md | F:/AIGril/AIGrilClaw/docs/aigl-codex-mainline-spec.md: F:/AIGril/AIGrilClaw/docs/aigl-codex-mainline-spec.md

---

## 官方资料索引

- 官方资料：Codex CLI https://developers.openai.com/codex/cli；Codex MCP https://developers.openai.com/codex/mcp；Apply Patch https://developers.openai.com/api/docs/guides/tools-apply-patch；Tool Search https://developers.openai.com/api/docs/guides/tools-tool-search；Shell https://developers.openai.com/api/docs/guides/tools-shell；Web Search https://developers.openai.com/api/docs/guides/tools-web-search；Agents SDK https://developers.openai.com/api/docs/guides/agents
