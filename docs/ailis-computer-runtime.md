# AILIS Computer Runtime

`computer` 是 AILIS 给 Agent 使用的完整电脑操作基座。它参考 OpenClaw/Codex 的工具分层，把文件系统、搜索、命令行和长进程会话收敛到一个可审计、可审批、可回放的本地工具。

## 工具名

```text
computer
```

## 能力范围

文件系统：

- `list` / `ls`：列目录
- `tree`：目录树
- `stat`：文件元信息
- `read`：读取文本文件
- `write` / `append`：写入/追加
- `mkdir`：创建目录
- `copy`：复制文件或目录
- `move` / `rename`：移动或重命名
- `delete` / `trash`：默认移动到隔离区，永久删除需要额外危险开关
- `search` / `find`：按文件名或内容搜索
- `hash`：计算校验和
- `du`：统计目录大小

命令和进程：

- `exec`：一次性命令
- `session_start`：启动长进程/后台任务
- `process_list`：列出进程会话
- `process_read`：读取进程输出和状态
- `process_write`：向进程 stdin 写入
- `process_kill`：终止进程

## 安全模型

默认可访问：

- 当前 workspace
- 项目目录
- 用户主目录
- Desktop / Documents / Downloads / Pictures / Videos / Music
- 系统临时目录

访问其他路径需要：

```json
{
  "context": {
    "allowOutsideWorkspace": true
  }
}
```

修改系统保护目录还需要：

```json
{
  "context": {
    "approved": true,
    "allowOutsideWorkspace": true,
    "allowSystemMutation": true
  }
}
```

所有会修改电脑状态的操作都需要审批：

- `write`
- `append`
- `mkdir`
- `copy`
- `move`
- `rename`
- `delete`
- `exec`
- `session_start`
- `process_write`
- `process_kill`

永久删除需要同时具备：

```json
{
  "context": {
    "approved": true
  },
  "args": {
    "allowPermanentDelete": true,
    "dangerous": true
  }
}
```

默认删除走 `trash/quarantine`，不会直接永久删除。

## 调用示例

列目录：

```json
{
  "tool": "computer",
  "args": {
    "action": "list",
    "path": "."
  }
}
```

搜索文件：

```json
{
  "tool": "computer",
  "args": {
    "action": "search",
    "path": ".",
    "name": "*.js"
  }
}
```

写文件：

```json
{
  "tool": "computer",
  "args": {
    "action": "write",
    "path": "notes/todo.txt",
    "content": "hello"
  },
  "context": {
    "approved": true
  }
}
```

执行命令：

```json
{
  "tool": "computer",
  "args": {
    "action": "exec",
    "command": "node -v"
  },
  "context": {
    "approved": true
  }
}
```

启动长进程：

```json
{
  "tool": "computer",
  "args": {
    "action": "session_start",
    "command": "pnpm dev"
  },
  "context": {
    "approved": true
  }
}
```

读取长进程输出：

```json
{
  "tool": "computer",
  "args": {
    "action": "process_read",
    "sessionId": "..."
  }
}
```

终止长进程：

```json
{
  "tool": "computer",
  "args": {
    "action": "process_kill",
    "sessionId": "..."
  },
  "context": {
    "approved": true
  }
}
```

## Agent 自然语言

Agent Runner v0 已能识别：

```text
列出目录 .
查看目录树 src
搜索文件 *.js
复制 a.txt 到 b.txt
移动 a.txt 到 archive/a.txt
删除 old.tmp
创建目录 notes
后台运行 pnpm dev
列出进程会话
读取进程会话 <sessionId>
```

复杂任务现在由 Agentic Executor Loop 驱动：模型每轮选择一个 `computer`/`code`/`email` 等工具动作，Gateway 执行后把 observation 回灌，再由模型决定继续、复核、修复或结束。

## 和 file_manager 的关系

- `computer`：通用电脑操作层，给 Agent 执行具体文件/命令动作。
- `file_manager`：高层文件整理/垃圾清理策略工具，偏计划和安全清理。

两者可以组合：先用 `file_manager clean dryRun` 生成计划，再用 `computer` 做精确复核或执行。
