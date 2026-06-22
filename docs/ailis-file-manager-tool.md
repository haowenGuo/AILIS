# AILIS File Manager Tool

AILIS 自带一个本地 `file_manager` 工具，用来做文件整理、垃圾文件扫描、临时文件清理和安全的 C 盘清理计划。

核心原则：

- 默认只做 `dryRun` 计划，不直接移动或删除。
- 真正执行 `clean` / `organize` 必须带 `context.approved=true`。
- `clean` 默认使用 `quarantine` 隔离模式，把文件移动到隔离区，不永久删除。
- 永久删除必须同时设置 `context.approved=true`、`allowPermanentDelete=true`、`dangerous=true`。
- C 盘清理不扫描整个 `C:\`，只使用 `c_drive_safe` 安全预设。

## 工具接口

统一工具名：`file_manager`

动作：

- `schema`：查看工具能力、预设和安全策略
- `scan`：扫描候选垃圾文件
- `clean`：生成清理计划或执行隔离/删除
- `organize`：按文件类型生成整理计划或移动文件

## 安全预设

| Profile | 说明 |
| --- | --- |
| `workspace` | 当前工作区 |
| `downloads` | 用户下载目录 |
| `desktop` | 用户桌面 |
| `documents` | 用户文档 |
| `temp` | 用户临时目录 |
| `c_drive_safe` | Windows 安全清理预设：用户临时目录、LocalAppData Temp、Windows Temp、下载目录 |
| `windows_safe_cleanup` | `c_drive_safe` 的别名 |

## Gateway 调用示例

查看工具 schema：

```json
{
  "tool": "file_manager",
  "args": {
    "action": "schema"
  }
}
```

扫描下载目录：

```json
{
  "tool": "file_manager",
  "args": {
    "action": "scan",
    "profile": "downloads",
    "minAgeDays": 7
  }
}
```

生成 C 盘安全清理计划：

```json
{
  "tool": "file_manager",
  "args": {
    "action": "clean",
    "profile": "c_drive_safe",
    "dryRun": true,
    "minAgeDays": 7
  }
}
```

执行隔离清理：

```json
{
  "tool": "file_manager",
  "args": {
    "action": "clean",
    "profile": "c_drive_safe",
    "dryRun": false,
    "mode": "quarantine"
  },
  "context": {
    "approved": true
  }
}
```

整理下载目录：

```json
{
  "tool": "file_manager",
  "args": {
    "action": "organize",
    "profile": "downloads",
    "dryRun": true
  }
}
```

执行整理：

```json
{
  "tool": "file_manager",
  "args": {
    "action": "organize",
    "profile": "downloads",
    "dryRun": false
  },
  "context": {
    "approved": true
  }
}
```

## Agent 自然语言

现在 Agent 可以识别：

```text
清理 C盘垃圾文件
扫描临时文件
清理下载目录垃圾
整理下载目录
整理桌面文件
分类当前工作区文件
```

这些自然语言默认都会先生成计划，不会直接删文件。

## 第一版会识别的垃圾候选

- 临时/备份扩展名：`.tmp`、`.temp`、`.bak`、`.old`
- 日志和崩溃文件：旧 `.log`、`.dmp`、`.dump`
- 下载残留：`.crdownload`、`.part`、`.download`
- 可选：空文件、生成目录和依赖目录，需要显式参数开启

## 边界

第一版不做注册表清理、不卸载软件、不清理驱动、不删除 Windows 更新缓存、不碰 `Program Files`。这些都属于高风险系统维护，应后续接 Windows 官方 API 或专门维护工具，并且必须有更强审批和回滚策略。
