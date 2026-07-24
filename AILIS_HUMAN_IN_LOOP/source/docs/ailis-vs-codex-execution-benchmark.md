# AILIS vs Codex 执行能力实测

日期：2026-05-24  
AILIS 命令：`pnpm ailis:benchmark-execution`
Codex CLI：`codex-cli 0.120.0`

## 测试任务

这轮没有只测 hello world，而是测了更接近任务执行智能体的场景：

1. 代码修复：构造一个有 bug 的 Node 项目，先跑失败测试，再修 `src/math.js`，再跑测试确认通过。
2. 长进程控制：启动一个持续输出的 Node 进程，读取 stdout，写入 stdin，让它退出。
3. 安全策略：尝试越界读文件、未审批执行命令、只读权限下写文件。
4. Codex 对照：用 Codex CLI 在临时目录里跑同类文件创建任务和代码修复任务。

## AILIS 实测结果

命令：

```bash
pnpm ailis:benchmark-execution
```

结果：通过。

工作区：

```text
F:\temp\ailis-execution-bench-Va1bmh
```

关键结果：

| 项目 | 结果 |
|---|---|
| 代码修复 | 通过。先测出失败，再写入修复，`npm test` 通过 |
| 初始失败测试 | `exec` 返回 `error`，耗时约 `2242ms` |
| 修复后测试 | `exec` 返回 `completed`，耗时约 `2056ms` |
| code tool 测试 | `code.test` 返回 `completed`，耗时约 `1853ms` |
| 语义索引 | `code.semantic_index` 返回 `completed`，索引文件数 `3` |
| 长进程 | `session_start`、`process_read`、`process_write`、最终 `process_read` 全部通过 |
| 安全策略 | 越界 read 被 `blocked`；未审批 exec 返回 `needs_approval`；只读 profile 写文件被 `blocked` |
| transcript | `bench-code-repair` 有 `18` 个 transcript item，类型为 `tool.call` / `tool.result` |
| audit | `17` 条 audit entries |

本轮发现并修复的问题：

- `permissionProfile: { fileSystem: "read-only" }` 原本没有挡住 `write`。
- 原因是 `isReadOnlyProfile()` 只看 `profile.id || profile.fileSystem`，默认 `id=workspace-write` 会盖住 `fileSystem`。
- 已修为同时检查 `id` 和 `fileSystem`，并补了回归测试。

## Codex 实测结果

### 1. 默认模型启动

命令形态：

```bash
codex exec --skip-git-repo-check --full-auto --json -C <tmp> ...
```

结果：

- 默认模型是 `gpt-5.5`。
- 当前本机 CLI `codex-cli 0.120.0` 被服务端拒绝：

```text
The 'gpt-5.5' model requires a newer version of Codex.
```

所以后续改用：

```bash
codex exec --skip-git-repo-check --full-auto --json -m gpt-5.4 -C <tmp> ...
```

### 2. 简单文件创建任务

任务：创建 `result.txt`，写入 `CODEX_SMOKE_OK`，读回验证。

工作区：

```text
F:\temp\codex-capability-f86f0e3329a34962bcea36ba1719d961
```

结果：

- exit code：`0`
- 文件创建成功：`result.txt = CODEX_SMOKE_OK`
- 最终消息：`Verified by reading it back. Filename: result.txt.`
- 有 `turn.completed`
- 耗时约 `178s`

观察：

- 中间出现多次 `stream disconnected` / `Reconnecting...`
- 最终 fallback 到 HTTP 后完成。

### 3. 复杂代码修复任务

任务：同样构造一个失败的 Node 项目，让 Codex 修 `src/math.js` 并跑 `npm test`。

工作区：

```text
F:\temp\codex-code-repair-872f05c92d7d45c1bcb2c379d5f13069
```

结果：

- 外层命令超时：`421s`
- 但任务中途已经把 `src/math.js` 修好
- 手动复核 `npm test --prefix <tmp>` 通过，输出 `CODEX_COMPLEX_TEST_OK`
- 没有生成 `last-message.txt`
- event log 里没有 `turn.completed`
- 留下了临时文件 `src/math.new.js`

Codex event 里出现的关键行为：

- 先运行 `npm test`，发现失败。
- 读取 `tests/run-tests.js` 和 `src/math.js`。
- 判断出两个 bug：`sum` 只返回首项，`average([])` 除以 0。
- 多次尝试 `apply_patch`，但 patch context 匹配失败。
- 创建 `src/math.new.js` 成功。
- `Move-Item` 覆盖原文件失败：`Access to the path is denied.`
- 改用 `Set-Content` 覆盖 `src/math.js` 成功。
- 再次运行 `npm test` 成功。
- 尝试清理 `src/math.new.js` 失败，之后外层超时。

## 对照结论

| 维度 | AILIS 当前表现 | Codex 当前表现 |
|---|---|---|
| 文件/代码执行速度 | 快，整个复杂 benchmark 约十几秒 | 慢，本机实测简单任务约 178s，复杂任务超过 421s |
| 多步自主修复 | 目前 benchmark 是工具链确定性执行，Agentic Loop 有基础但没有 Codex 那么强的自我诊断 | 强，会读测试、定位 bug、尝试 patch、失败后换策略 |
| Windows 文件操作鲁棒性 | 本轮稳定；直接 `write` 覆盖成功 | 遇到 patch context、move/delete 权限问题，最终代码修好但收尾卡住 |
| 命令执行 | `exec`、`session_start`、`process_read/write/kill` 实测通过 | `command_execution` 实测可用；源码层有更完整事件协议 |
| 长进程控制 | 实测通过，能读 stdout 和写 stdin | 本轮未跑同款任务；源码/CLI 支持 process/spawn 类能力 |
| 审批与安全 | 本轮发现一个只读 profile bug，已修复；越界读、未审批 exec、只读写入现在都能挡住 | sandbox/approval 模型更成熟，但 `--full-auto` 下仍会遇到 Windows 权限/文件锁问题 |
| transcript / event | AILIS 有 `tool.call` / `tool.result` JSONL 和 audit，简单可验收 | Codex 有 `item.started/completed`、`turn.completed` 等更正式协议；复杂任务未正常完成 turn |
| 可靠性 | 当前本地工具链更稳定，适合个人桌面任务 | 模型能力强，但依赖服务端、网络、CLI 版本和流式连接稳定性 |

## 判断

AILIS 当前更像“可靠的本地工具执行器 + 初版 Agent Loop”：速度快、确定性强、便于验收，但复杂任务的自主修复能力还不如 Codex。

Codex 更像“完整工程智能体 runtime”：会自己观察、修复、换策略，事件协议也更成熟；但这轮本机实测里，服务端重连、CLI 版本、Windows 文件操作让它的端到端稳定性并不完美。

对 AILIS 下一步最有价值的是补三块：

1. 让 Agentic Executor 在工具失败后自动换策略，而不是依赖固定脚本。
2. 把 `apply_patch` / 精确编辑工具做成一等工具，减少整文件覆盖。
3. 给长任务加 `turn.completed` 级别的最终状态和失败收敛，不只留 tool transcript。
