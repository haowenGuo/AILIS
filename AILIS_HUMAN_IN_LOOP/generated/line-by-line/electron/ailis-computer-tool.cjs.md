# electron/ailis-computer-tool.cjs 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：电脑操作工具：在审批和安全边界内执行桌面观察与交互。
- 文件类型：`source-code`
- 原始行数：3507
- SHA-256：`b47db14439bf2b631a26592dbb7a663414d093d454179ce7c4a80b3df667ee0e`
- 可运行副本：[打开源文件](../../../source/electron/ailis-computer-tool.cjs)
- 依赖：`fs`、`fs/promises`、`os`、`path`、`crypto`、`zlib`、`child_process`、`./ailis-platform-adapter.cjs`、`./ailis-pdf-document-engine.cjs`、`node-pty`
- 主要符号：`fs`、`fsp`、`os`、`path`、`crypto`、`zlib`、`COMPUTER_TOOL_ID`、`DEFAULT_MAX_BYTES`、`DEFAULT_TEXT_ARTIFACT_BYTES`、`DEFAULT_MAX_ARTIFACT_SOURCE_BYTES`、`DEFAULT_SEARCH_LIMIT`、`DEFAULT_TREE_LIMIT`、`DEFAULT_PROCESS_BUFFER_BYTES`、`DEFAULT_EXEC_TIMEOUT_MS`、`DEFAULT_SESSION_TIMEOUT_MS`、`DEFAULT_BINARY_CHUNK_BYTES`、`DEFAULT_WATCH_BUFFER_EVENTS`、`DEFAULT_ROLLBACK_LIMIT`、`DEFAULT_EXEC_YIELD_TIME_MS`、`DEFAULT_EXEC_MAX_OUTPUT_TOKENS`、`MIN_EXEC_YIELD_TIME_MS`、`MAX_EXEC_YIELD_TIME_MS`、`WRITE_ACTIONS`、`READ_ONLY_ACTIONS`、`nodePtyLoadResult`、`loadNodePty`、`normalizeString`、`trimmed`、`normalizeCommandArgs`、`normalizeBoolean`、`normalizeNumber`、`parsed`、`getRuntimePlatform`、`isPathInside`、`uniquePaths`、`maybePath`、`commonUserRoots`、`home`、`platformAdapter`、`protectedRoots`、`isFullControlContext`、`rawProfile`、`profile`、`resolveTargetPath`、`value`、`guardPath`、`readOnly`、`commonRoots`、`protectedHit`、`insideCommon`、`outsideAllowed`、`createTextResult`、`createErrorResult`、`isLikelyTextBuffer`、`sample`、`control`、`nul`、`allowedWhitespace`、`decoded`、`replacementChars`、`getStructuredFileHint`、`ext`、`hints`、`isTextArtifactExtension`、`isDocumentArtifactExtension`、`decodeXmlEntities`、`normalizeExtractedDocumentText`、`stripXmlToText`、`withBreaks`、`readZipEntries`、`eocdSignature`、`eocdOffset`、`index`、`centralDirectorySize`、`centralDirectoryOffset`、`entries`、`offset`、`end`、`method`、`compressedSize`、`fileNameLength`、`extraLength`、`commentLength`、`localHeaderOffset`、`name`、`localNameLength`、`localExtraLength`、`dataOffset`、`compressed`、`extractDocxDocument`、`parts`、`sections`、`xml`、`text`、`buildArtifactPreview`、`source`、`createManagedTextArtifact`、`lines`、`createManagedDocumentArtifact`、`artifactCreatedReadResult`、`normalizeDocumentParseFailure`、`isScannedPdfNeedsOcrFailure`、`scannedPdfNeedsOcrReadResult`、`pickOutputStoreDirectTool`、`normalized`、`outputStoreWrongSurfaceResult`、`outputId`、`normalizedAction`、`hasFilesystemTarget`、`explicitOutputAction`、`normalizeGuiAction`、`aliases`、`formatBytes`、`units`、`unitIndex`、`safeStat`、`statDetails`、`getWorkspaceRoot`、`getRollbackRoot`、`sanitizePathComponent`、`rollbackJournalPath`、`appendJsonLine`、`rollbackSnapshotPath`、`digest`、`removeIfExists`、`createRollbackSnapshot`、`rollbackRoot`、`maxBytes`、`entry`、`stat`、`snapshot`、`size`、`readRollbackJournal`、`journal`、`runExecFile`、`runAdapterCommand`、`steps`、`stdoutParts`、`stderrParts`、`lastExitCode`、`step`、`result`、`parseJsonObject`、`line`、`defaultScreenshotPath`、`root`、`actionWait`、`durationMs`、`actionScreenScreenshot`、`targetPath`、`guard`、`command`、`actionClipboardRead`、`actionClipboardWrite`、`action`、`actionGuiInput`、`actionList`、`target`、`includeHidden`、`limit`

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code>const fs = require('fs');</code> | 导入依赖 `fs`，使本文件可以复用外部模块能力。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2 | <code>const fsp = require('fs/promises');</code> | 导入依赖 `fs/promises`，使本文件可以复用外部模块能力。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3 | <code>const os = require('os');</code> | 导入依赖 `os`，使本文件可以复用外部模块能力。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 4 | <code>const path = require('path');</code> | 导入依赖 `path`，使本文件可以复用外部模块能力。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 5 | <code>const crypto = require('crypto');</code> | 导入依赖 `crypto`，使本文件可以复用外部模块能力。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 6 | <code>const zlib = require('zlib');</code> | 导入依赖 `zlib`，使本文件可以复用外部模块能力。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 7 | <code>const { execFile, spawn } = require('child_process');</code> | 导入依赖 `child_process`，使本文件可以复用外部模块能力。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 8 | <code>const { randomUUID } = require('crypto');</code> | 导入依赖 `crypto`，使本文件可以复用外部模块能力。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 9 | <code>const { createAILISPlatformAdapter, getDefaultPlatformAdapter } = require('./ailis-platform-adapter.cjs');</code> | 导入依赖 `./ailis-platform-adapter.cjs`，使本文件可以复用外部模块能力。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 10 | <code>const { extractPdfDocument } = require('./ailis-pdf-document-engine.cjs');</code> | 导入依赖 `./ailis-pdf-document-engine.cjs`，使本文件可以复用外部模块能力。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 11 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 12 | <code>const COMPUTER_TOOL_ID = 'computer';</code> | 声明局部标识符 `COMPUTER_TOOL_ID`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 13 | <code>const DEFAULT_MAX_BYTES = 128 * 1024;</code> | 声明局部标识符 `DEFAULT_MAX_BYTES`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 14 | <code>const DEFAULT_TEXT_ARTIFACT_BYTES = 128 * 1024;</code> | 声明局部标识符 `DEFAULT_TEXT_ARTIFACT_BYTES`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 15 | <code>const DEFAULT_MAX_ARTIFACT_SOURCE_BYTES = 50 * 1024 * 1024;</code> | 声明局部标识符 `DEFAULT_MAX_ARTIFACT_SOURCE_BYTES`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 16 | <code>const DEFAULT_SEARCH_LIMIT = 200;</code> | 声明局部标识符 `DEFAULT_SEARCH_LIMIT`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 17 | <code>const DEFAULT_TREE_LIMIT = 500;</code> | 声明局部标识符 `DEFAULT_TREE_LIMIT`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 18 | <code>const DEFAULT_PROCESS_BUFFER_BYTES = 256 * 1024;</code> | 声明局部标识符 `DEFAULT_PROCESS_BUFFER_BYTES`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 19 | <code>const DEFAULT_EXEC_TIMEOUT_MS = 30000;</code> | 声明局部标识符 `DEFAULT_EXEC_TIMEOUT_MS`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 20 | <code>const DEFAULT_SESSION_TIMEOUT_MS = 12 * 60 * 60 * 1000;</code> | 声明局部标识符 `DEFAULT_SESSION_TIMEOUT_MS`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 21 | <code>const DEFAULT_BINARY_CHUNK_BYTES = 256 * 1024;</code> | 声明局部标识符 `DEFAULT_BINARY_CHUNK_BYTES`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 22 | <code>const DEFAULT_WATCH_BUFFER_EVENTS = 500;</code> | 声明局部标识符 `DEFAULT_WATCH_BUFFER_EVENTS`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 23 | <code>const DEFAULT_ROLLBACK_LIMIT = 200;</code> | 声明局部标识符 `DEFAULT_ROLLBACK_LIMIT`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 24 | <code>const DEFAULT_EXEC_YIELD_TIME_MS = 1000;</code> | 声明局部标识符 `DEFAULT_EXEC_YIELD_TIME_MS`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 25 | <code>const DEFAULT_EXEC_MAX_OUTPUT_TOKENS = 6000;</code> | 声明局部标识符 `DEFAULT_EXEC_MAX_OUTPUT_TOKENS`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 26 | <code>const MIN_EXEC_YIELD_TIME_MS = 50;</code> | 声明局部标识符 `MIN_EXEC_YIELD_TIME_MS`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 27 | <code>const MAX_EXEC_YIELD_TIME_MS = 30000;</code> | 声明局部标识符 `MAX_EXEC_YIELD_TIME_MS`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 28 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 29 | <code>const WRITE_ACTIONS = new Set([</code> | 声明局部标识符 `WRITE_ACTIONS`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 30 | <code>    'write',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 31 | <code>    'append',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 32 | <code>    'mkdir',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 33 | <code>    'copy',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 34 | <code>    'move',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 35 | <code>    'rename',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 36 | <code>    'delete',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 37 | <code>    'trash',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 38 | <code>    'exec',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 39 | <code>    'run',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 40 | <code>    'exec_command',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 41 | <code>    'session_start',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 42 | <code>    'pty_start',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 43 | <code>    'pty_write',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 44 | <code>    'pty_kill',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 45 | <code>    'process_write',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 46 | <code>    'process_kill',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 47 | <code>    'mouse_move',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 48 | <code>    'mouse_click',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 49 | <code>    'mouse_double_click',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 50 | <code>    'mouse_right_click',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 51 | <code>    'mouse_drag',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 52 | <code>    'scroll',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 53 | <code>    'keyboard_type',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 54 | <code>    'keyboard_press',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 55 | <code>    'keyboard_hotkey',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 56 | <code>    'clipboard_write',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 57 | <code>    'watch_stop',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 58 | <code>    'write_binary',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 59 | <code>    'acl_set',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 60 | <code>    'rollback_restore'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 61 | <code>]);</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 62 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 63 | <code>const READ_ONLY_ACTIONS = new Set([</code> | 声明局部标识符 `READ_ONLY_ACTIONS`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 64 | <code>    'schema',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 65 | <code>    'ls',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 66 | <code>    'list',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 67 | <code>    'tree',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 68 | <code>    'stat',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 69 | <code>    'read',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 70 | <code>    'read_binary',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 71 | <code>    'search',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 72 | <code>    'find',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 73 | <code>    'hash',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 74 | <code>    'du',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 75 | <code>    'acl_get',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 76 | <code>    'watch_start',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 77 | <code>    'watch_poll',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 78 | <code>    'watch_list',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 79 | <code>    'screen_screenshot',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 80 | <code>    'clipboard_read',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 81 | <code>    'wait',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 82 | <code>    'pty_status',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 83 | <code>    'pty_read',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 84 | <code>    'pty_resize',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 85 | <code>    'rollback_list',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 86 | <code>    'process_list',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 87 | <code>    'process_read',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 88 | <code>    'write_stdin'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 89 | <code>]);</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 90 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 91 | <code>let nodePtyLoadResult = null;</code> | 声明局部标识符 `nodePtyLoadResult`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 92 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 93 | <code>function loadNodePty() {</code> | 定义函数 `loadNodePty`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 94 | <code>    if (nodePtyLoadResult) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 95 | <code>        return nodePtyLoadResult;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 96 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 97 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 98 | <code>        // node-pty is a native optional dependency. pnpm may require build-script approval,</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 99 | <code>        // so every PTY action must degrade cleanly when it cannot be loaded.</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 100 | <code>        nodePtyLoadResult = { ok: true, pty: require('node-pty') };</code> | 导入依赖 `node-pty`，使本文件可以复用外部模块能力。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 101 | <code>    } catch (error) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 102 | <code>        nodePtyLoadResult = { ok: false, error: error?.message &#124;&#124; String(error) };</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 103 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 104 | <code>    return nodePtyLoadResult;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 105 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 106 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 107 | <code>function normalizeString(value, fallback = '') {</code> | 定义函数 `normalizeString`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 108 | <code>    if (typeof value !== 'string') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 109 | <code>        return fallback;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 110 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 111 | <code>    const trimmed = value.trim();</code> | 声明局部标识符 `trimmed`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 112 | <code>    return trimmed &#124;&#124; fallback;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 113 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 114 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 115 | <code>function normalizeCommandArgs(value) {</code> | 定义函数 `normalizeCommandArgs`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 116 | <code>    if (!Array.isArray(value)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 117 | <code>        return [];</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 118 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 119 | <code>    return value</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 120 | <code>        .map((entry) =&gt; String(entry))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 121 | <code>        .filter((entry) =&gt; entry.length &gt; 0);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 122 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 123 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 124 | <code>function normalizeBoolean(value, fallback = false) {</code> | 定义函数 `normalizeBoolean`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 125 | <code>    if (typeof value === 'boolean') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 126 | <code>        return value;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 127 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 128 | <code>    if (typeof value === 'string') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 129 | <code>        if (/^(true&#124;1&#124;yes&#124;on)$/i.test(value.trim())) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 130 | <code>            return true;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 131 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 132 | <code>        if (/^(false&#124;0&#124;no&#124;off)$/i.test(value.trim())) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 133 | <code>            return false;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 134 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 135 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 136 | <code>    return fallback;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 137 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 138 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 139 | <code>function normalizeNumber(value, fallback, min, max) {</code> | 定义函数 `normalizeNumber`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 140 | <code>    const parsed = Number(value);</code> | 声明局部标识符 `parsed`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 141 | <code>    if (!Number.isFinite(parsed)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 142 | <code>        return fallback;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 143 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 144 | <code>    return Math.min(Math.max(parsed, min), max);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 145 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 146 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 147 | <code>function getRuntimePlatform(runtime = {}) {</code> | 定义函数 `getRuntimePlatform`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 148 | <code>    return runtime.platformAdapter &#124;&#124; getDefaultPlatformAdapter();</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 149 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 150 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 151 | <code>function isPathInside(rootPath, targetPath, platformAdapter = getDefaultPlatformAdapter()) {</code> | 定义函数 `isPathInside`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 152 | <code>    return platformAdapter.isPathInside(rootPath, targetPath);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 153 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 154 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 155 | <code>function uniquePaths(paths, platformAdapter = getDefaultPlatformAdapter()) {</code> | 定义函数 `uniquePaths`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 156 | <code>    return platformAdapter.uniquePaths(paths);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 157 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 158 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 159 | <code>function maybePath(...parts) {</code> | 定义函数 `maybePath`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 160 | <code>    if (parts.some((part) =&gt; !normalizeString(part))) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 161 | <code>        return '';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 162 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 163 | <code>    return path.join(...parts);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 164 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 165 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 166 | <code>function commonUserRoots(runtime = {}) {</code> | 定义函数 `commonUserRoots`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 167 | <code>    const home = os.homedir();</code> | 声明局部标识符 `home`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 168 | <code>    const platformAdapter = getRuntimePlatform(runtime);</code> | 声明局部标识符 `platformAdapter`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 169 | <code>    return uniquePaths([</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 170 | <code>        runtime.workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 171 | <code>        runtime.workspaceDir,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 172 | <code>        runtime.projectRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 173 | <code>        home,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 174 | <code>        os.tmpdir(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 175 | <code>        process.env.TEMP,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 176 | <code>        process.env.TMP,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 177 | <code>        maybePath(process.env.LOCALAPPDATA, 'Temp'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 178 | <code>        maybePath(home, 'Desktop'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 179 | <code>        maybePath(home, 'Documents'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 180 | <code>        maybePath(home, 'Downloads'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 181 | <code>        maybePath(home, 'Pictures'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 182 | <code>        maybePath(home, 'Videos'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 183 | <code>        maybePath(home, 'Music')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 184 | <code>    ], platformAdapter);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 185 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 186 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 187 | <code>function protectedRoots(runtime = {}) {</code> | 定义函数 `protectedRoots`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 188 | <code>    return getRuntimePlatform(runtime).protectedRoots();</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 189 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 190 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 191 | <code>function isFullControlContext(context = {}) {</code> | 定义函数 `isFullControlContext`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 192 | <code>    const rawProfile = typeof context.permissionProfile === 'string'</code> | 声明局部标识符 `rawProfile`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 193 | <code>        ? context.permissionProfile</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 194 | <code>        : context.permissionProfile?.id &#124;&#124; context.permissions &#124;&#124; context.policy &#124;&#124; context.sandbox;</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 195 | <code>    const profile = normalizeString(rawProfile).toLowerCase();</code> | 声明局部标识符 `profile`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 196 | <code>    return (</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 197 | <code>        profile === 'danger-full-access' &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 198 | <code>        profile === 'full-access' &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 199 | <code>        context.allowComputerWideAccess === true &#124;&#124;</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 200 | <code>        (context.computerControlEnabled === true &amp;&amp; context.allowOutsideWorkspace === true)</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 201 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 202 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 203 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 204 | <code>function resolveTargetPath(rawPath, runtime = {}) {</code> | 定义函数 `resolveTargetPath`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 205 | <code>    const value = normalizeString(rawPath);</code> | 声明局部标识符 `value`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 206 | <code>    if (!value) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 207 | <code>        return '';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 208 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 209 | <code>    if (value === '~') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 210 | <code>        return os.homedir();</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 211 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 212 | <code>    if (value.startsWith(`~${path.sep}`) &#124;&#124; value.startsWith('~/')) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 213 | <code>        return path.resolve(os.homedir(), value.slice(2));</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 214 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 215 | <code>    if (path.isAbsolute(value)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 216 | <code>        return path.resolve(value);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 217 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 218 | <code>    return path.resolve(runtime.workspaceDir &#124;&#124; runtime.workspaceRoot &#124;&#124; process.cwd(), value);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 219 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 220 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 221 | <code>function guardPath(targetPath, action, context = {}, runtime = {}) {</code> | 定义函数 `guardPath`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 222 | <code>    if (!targetPath) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 223 | <code>        return createErrorResult('needs_config', 'computer 工具需要 path/source/target/workdir 参数。');</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 224 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 225 | <code>    const readOnly = READ_ONLY_ACTIONS.has(action);</code> | 声明局部标识符 `readOnly`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 226 | <code>    const commonRoots = commonUserRoots(runtime);</code> | 声明局部标识符 `commonRoots`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 227 | <code>    const platformAdapter = getRuntimePlatform(runtime);</code> | 声明局部标识符 `platformAdapter`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 228 | <code>    const protectedHit = protectedRoots(runtime).find((root) =&gt; isPathInside(root, targetPath, platformAdapter));</code> | 声明局部标识符 `protectedHit`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 229 | <code>    if (protectedHit &amp;&amp; isFullControlContext(context)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 230 | <code>        return createErrorResult(</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 231 | <code>            'blocked',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 232 | <code>            '完全控制模式仍然拒绝访问 C 盘系统保护路径。',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 233 | <code>            {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 234 | <code>                path: targetPath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 235 | <code>                protectedRoot: protectedHit,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 236 | <code>                action,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 237 | <code>                permissionProfile: context.permissionProfile &#124;&#124; context.policy &#124;&#124; context.sandbox &#124;&#124; 'full-control'</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 238 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 239 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 240 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 241 | <code>    const insideCommon = commonRoots.some((root) =&gt; isPathInside(root, targetPath, platformAdapter));</code> | 声明局部标识符 `insideCommon`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 242 | <code>    if (insideCommon) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 243 | <code>        return null;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 244 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 245 | <code>    const outsideAllowed = context.allowOutsideWorkspace === true &#124;&#124; context.allowComputerWideAccess === true;</code> | 声明局部标识符 `outsideAllowed`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 246 | <code>    if (!outsideAllowed) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 247 | <code>        return createErrorResult(</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 248 | <code>            'blocked',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 249 | <code>            'computer 默认只访问工作区、用户目录和临时目录。访问其他路径需要 context.allowOutsideWorkspace=true。',</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 250 | <code>            {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 251 | <code>                path: targetPath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 252 | <code>                action,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 253 | <code>                commonRoots</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 254 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 255 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 256 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 257 | <code>    if (protectedHit &amp;&amp; !readOnly &amp;&amp; context.allowSystemMutation !== true) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 258 | <code>        return createErrorResult(</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 259 | <code>            'blocked',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 260 | <code>            '拒绝修改系统保护目录。若确实需要系统级修改，必须显式设置 context.allowSystemMutation=true 且通过审批。',</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 261 | <code>            {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 262 | <code>                path: targetPath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 263 | <code>                protectedRoot: protectedHit,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 264 | <code>                action</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 265 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 266 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 267 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 268 | <code>    return null;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 269 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 270 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 271 | <code>function createTextResult(text, details = {}) {</code> | 定义函数 `createTextResult`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 272 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 273 | <code>        content: text ? [{ type: 'text', text }] : [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 274 | <code>        details</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 275 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 276 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 277 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 278 | <code>function createErrorResult(status, message, details = {}) {</code> | 定义函数 `createErrorResult`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 279 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 280 | <code>        content: [{ type: 'text', text: message }],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 281 | <code>        isError: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 282 | <code>        details: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 283 | <code>            status,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 284 | <code>            error: message,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 285 | <code>            ...details</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 286 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 287 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 288 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 289 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 290 | <code>function isLikelyTextBuffer(buffer) {</code> | 定义函数 `isLikelyTextBuffer`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 291 | <code>    if (!Buffer.isBuffer(buffer) &#124;&#124; buffer.length === 0) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 292 | <code>        return true;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 293 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 294 | <code>    const sample = buffer.subarray(0, Math.min(buffer.length, 8192));</code> | 声明局部标识符 `sample`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 295 | <code>    let control = 0;</code> | 声明局部标识符 `control`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 296 | <code>    let nul = 0;</code> | 声明局部标识符 `nul`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 297 | <code>    for (const byte of sample) {</code> | 声明局部标识符 `byte`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 298 | <code>        if (byte === 0) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 299 | <code>            nul += 1;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 300 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 301 | <code>        const allowedWhitespace = byte === 9 &#124;&#124; byte === 10 &#124;&#124; byte === 12 &#124;&#124; byte === 13;</code> | 声明局部标识符 `allowedWhitespace`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 302 | <code>        if (byte &lt; 32 &amp;&amp; !allowedWhitespace) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 303 | <code>            control += 1;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 304 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 305 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 306 | <code>    const decoded = sample.toString('utf8');</code> | 声明局部标识符 `decoded`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 307 | <code>    const replacementChars = (decoded.match(/\uFFFD/g) &#124;&#124; []).length;</code> | 声明局部标识符 `replacementChars`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 308 | <code>    return nul === 0 &amp;&amp; control / sample.length &lt; 0.02 &amp;&amp; replacementChars / Math.max(1, decoded.length) &lt; 0.02;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 309 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 310 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 311 | <code>function getStructuredFileHint(filePath = '') {</code> | 定义函数 `getStructuredFileHint`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 312 | <code>    const ext = path.extname(filePath).toLowerCase();</code> | 声明局部标识符 `ext`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 313 | <code>    const hints = {</code> | 声明局部标识符 `hints`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 314 | <code>        '.docx': 'Word/DOCX document',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 315 | <code>        '.doc': 'Word document',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 316 | <code>        '.xlsx': 'Excel/XLSX spreadsheet',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 317 | <code>        '.xls': 'Excel spreadsheet',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 318 | <code>        '.pptx': 'PowerPoint/PPTX presentation',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 319 | <code>        '.ppt': 'PowerPoint presentation',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 320 | <code>        '.pdf': 'PDF document',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 321 | <code>        '.zip': 'ZIP archive',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 322 | <code>        '.7z': '7z archive',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 323 | <code>        '.rar': 'RAR archive',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 324 | <code>        '.png': 'PNG image',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 325 | <code>        '.jpg': 'JPEG image',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 326 | <code>        '.jpeg': 'JPEG image',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 327 | <code>        '.webp': 'WebP image',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 328 | <code>        '.gif': 'GIF image',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 329 | <code>        '.mp3': 'audio file',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 330 | <code>        '.wav': 'audio file',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 331 | <code>        '.mp4': 'video file',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 332 | <code>        '.mov': 'video file'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 333 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 334 | <code>    return hints[ext] &#124;&#124; 'binary or structured file';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 335 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 336 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 337 | <code>function isTextArtifactExtension(filePath = '') {</code> | 定义函数 `isTextArtifactExtension`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 338 | <code>    return new Set([</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 339 | <code>        '.txt',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 340 | <code>        '.log',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 341 | <code>        '.md',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 342 | <code>        '.markdown',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 343 | <code>        '.json',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 344 | <code>        '.jsonl',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 345 | <code>        '.csv',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 346 | <code>        '.tsv',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 347 | <code>        '.xml',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 348 | <code>        '.yaml',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 349 | <code>        '.yml',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 350 | <code>        '.toml'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 351 | <code>    ]).has(path.extname(filePath).toLowerCase());</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 352 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 353 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 354 | <code>function isDocumentArtifactExtension(filePath = '') {</code> | 定义函数 `isDocumentArtifactExtension`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 355 | <code>    return new Set(['.docx', '.pdf']).has(path.extname(filePath).toLowerCase());</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 356 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 357 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 358 | <code>function decodeXmlEntities(text = '') {</code> | 定义函数 `decodeXmlEntities`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 359 | <code>    return String(text &#124;&#124; '')</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 360 | <code>        .replace(/&amp;lt;/g, '&lt;')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 361 | <code>        .replace(/&amp;gt;/g, '&gt;')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 362 | <code>        .replace(/&amp;amp;/g, '&amp;')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 363 | <code>        .replace(/&amp;quot;/g, '"')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 364 | <code>        .replace(/&amp;apos;/g, "'")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 365 | <code>        .replace(/&amp;#(\d+);/g, (_, code) =&gt; String.fromCharCode(Number(code)))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 366 | <code>        .replace(/&amp;#x([0-9a-f]+);/gi, (_, code) =&gt; String.fromCharCode(parseInt(code, 16)));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 367 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 368 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 369 | <code>function normalizeExtractedDocumentText(text = '') {</code> | 定义函数 `normalizeExtractedDocumentText`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 370 | <code>    return String(text &#124;&#124; '')</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 371 | <code>        .replace(/\r\n/g, '\n')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 372 | <code>        .replace(/[ \t]+\n/g, '\n')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 373 | <code>        .replace(/\n{3,}/g, '\n\n')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 374 | <code>        .trim();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 375 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 376 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 377 | <code>function stripXmlToText(xml = '') {</code> | 定义函数 `stripXmlToText`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 378 | <code>    const withBreaks = String(xml &#124;&#124; '')</code> | 声明局部标识符 `withBreaks`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 379 | <code>        .replace(/&lt;\/w:p&gt;/g, '\n')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 380 | <code>        .replace(/&lt;\/w:tr&gt;/g, '\n')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 381 | <code>        .replace(/&lt;\/w:tc&gt;/g, '\t')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 382 | <code>        .replace(/&lt;w:tab\/&gt;/g, '\t')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 383 | <code>        .replace(/&lt;w:br\/&gt;/g, '\n');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 384 | <code>    return normalizeExtractedDocumentText(decodeXmlEntities(withBreaks.replace(/&lt;[^&gt;]+&gt;/g, '')));</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 385 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 386 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 387 | <code>function readZipEntries(buffer) {</code> | 定义函数 `readZipEntries`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 388 | <code>    const eocdSignature = 0x06054b50;</code> | 声明局部标识符 `eocdSignature`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 389 | <code>    let eocdOffset = -1;</code> | 声明局部标识符 `eocdOffset`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 390 | <code>    for (let index = buffer.length - 22; index &gt;= Math.max(0, buffer.length - 66000); index -= 1) {</code> | 声明局部标识符 `index`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 391 | <code>        if (buffer.readUInt32LE(index) === eocdSignature) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 392 | <code>            eocdOffset = index;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 393 | <code>            break;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 394 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 395 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 396 | <code>    if (eocdOffset &lt; 0) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 397 | <code>        throw new Error('zip_eocd_not_found');</code> | 抛出错误：拒绝继续无效路径，并把明确失败原因交给上层处理。 |
| 398 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 399 | <code>    const centralDirectorySize = buffer.readUInt32LE(eocdOffset + 12);</code> | 声明局部标识符 `centralDirectorySize`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 400 | <code>    const centralDirectoryOffset = buffer.readUInt32LE(eocdOffset + 16);</code> | 声明局部标识符 `centralDirectoryOffset`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 401 | <code>    const entries = new Map();</code> | 声明局部标识符 `entries`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 402 | <code>    let offset = centralDirectoryOffset;</code> | 声明局部标识符 `offset`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 403 | <code>    const end = centralDirectoryOffset + centralDirectorySize;</code> | 声明局部标识符 `end`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 404 | <code>    while (offset &lt; end &amp;&amp; buffer.readUInt32LE(offset) === 0x02014b50) {</code> | 循环控制：对集合、队列、重试次数或状态持续执行同一组逻辑。 |
| 405 | <code>        const method = buffer.readUInt16LE(offset + 10);</code> | 声明局部标识符 `method`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 406 | <code>        const compressedSize = buffer.readUInt32LE(offset + 20);</code> | 声明局部标识符 `compressedSize`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 407 | <code>        const fileNameLength = buffer.readUInt16LE(offset + 28);</code> | 声明局部标识符 `fileNameLength`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 408 | <code>        const extraLength = buffer.readUInt16LE(offset + 30);</code> | 声明局部标识符 `extraLength`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 409 | <code>        const commentLength = buffer.readUInt16LE(offset + 32);</code> | 声明局部标识符 `commentLength`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 410 | <code>        const localHeaderOffset = buffer.readUInt32LE(offset + 42);</code> | 声明局部标识符 `localHeaderOffset`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 411 | <code>        const name = buffer.subarray(offset + 46, offset + 46 + fileNameLength).toString('utf8');</code> | 声明局部标识符 `name`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 412 | <code>        const localNameLength = buffer.readUInt16LE(localHeaderOffset + 26);</code> | 声明局部标识符 `localNameLength`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 413 | <code>        const localExtraLength = buffer.readUInt16LE(localHeaderOffset + 28);</code> | 声明局部标识符 `localExtraLength`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 414 | <code>        const dataOffset = localHeaderOffset + 30 + localNameLength + localExtraLength;</code> | 声明局部标识符 `dataOffset`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 415 | <code>        const compressed = buffer.subarray(dataOffset, dataOffset + compressedSize);</code> | 声明局部标识符 `compressed`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 416 | <code>        let content;</code> | 声明局部标识符 `content`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 417 | <code>        if (method === 0) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 418 | <code>            content = compressed;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 419 | <code>        } else if (method === 8) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 420 | <code>            content = zlib.inflateRawSync(compressed);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 421 | <code>        } else {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 422 | <code>            content = Buffer.alloc(0);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 423 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 424 | <code>        entries.set(name, content);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 425 | <code>        offset += 46 + fileNameLength + extraLength + commentLength;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 426 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 427 | <code>    return entries;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 428 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 429 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 430 | <code>function extractDocxDocument(buffer) {</code> | 定义函数 `extractDocxDocument`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 431 | <code>    const entries = readZipEntries(buffer);</code> | 声明局部标识符 `entries`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 432 | <code>    const parts = [</code> | 声明局部标识符 `parts`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 433 | <code>        'word/document.xml',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 434 | <code>        ...[...entries.keys()].filter((name) =&gt; /^word\/(?:header&#124;footer&#124;footnotes&#124;endnotes)\d*\.xml$/i.test(name))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 435 | <code>    ];</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 436 | <code>    const sections = [];</code> | 声明局部标识符 `sections`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 437 | <code>    for (const part of parts) {</code> | 声明局部标识符 `part`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 438 | <code>        const xml = entries.get(part);</code> | 声明局部标识符 `xml`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 439 | <code>        if (!xml) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 440 | <code>            continue;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 441 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 442 | <code>        const text = stripXmlToText(xml.toString('utf8'));</code> | 声明局部标识符 `text`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 443 | <code>        if (text) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 444 | <code>            sections.push({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 445 | <code>                index: sections.length,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 446 | <code>                title: part,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 447 | <code>                text</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 448 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 449 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 450 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 451 | <code>    const text = normalizeExtractedDocumentText(sections.map((section) =&gt; section.text).join('\n\n'));</code> | 声明局部标识符 `text`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 452 | <code>    if (!text) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 453 | <code>        throw new Error('docx_no_text_extracted');</code> | 抛出错误：拒绝继续无效路径，并把明确失败原因交给上层处理。 |
| 454 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 455 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 456 | <code>        format: 'docx',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 457 | <code>        parser: 'basic_docx_zip_xml',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 458 | <code>        text,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 459 | <code>        pages: [{ pageNumber: 1, text }],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 460 | <code>        sections</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 461 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 462 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 463 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 464 | <code>function buildArtifactPreview(text = '', maxChars = 4000) {</code> | 定义函数 `buildArtifactPreview`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 465 | <code>    const source = String(text &#124;&#124; '');</code> | 声明局部标识符 `source`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 466 | <code>    if (source.length &lt;= maxChars) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 467 | <code>        return { text: source, truncated: false };</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 468 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 469 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 470 | <code>        text: `${source.slice(0, Math.max(0, maxChars - 120))}\n... [artifact preview truncated; use artifact_query for exact ranges/search] ...`,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 471 | <code>        truncated: true</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 472 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 473 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 474 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 475 | <code>async function createManagedTextArtifact({ target, stat, text, encoding = 'utf8', runtime = {}, context = {}, args = {} } = {}) {</code> | 定义函数 `createManagedTextArtifact`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 476 | <code>    if (!runtime.contextArtifactStore?.createArtifact) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 477 | <code>        return null;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 478 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 479 | <code>    const lines = text.split(/\r?\n/);</code> | 声明局部标识符 `lines`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 480 | <code>    return await runtime.contextArtifactStore.createArtifact({</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 481 | <code>        kind: 'text',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 482 | <code>        type: path.extname(target).slice(1).toLowerCase() &#124;&#124; 'text',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 483 | <code>        tool: COMPUTER_TOOL_ID,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 484 | <code>        runId: context.runId,</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 485 | <code>        sessionId: context.sessionId &#124;&#124; context.sessionKey,</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 486 | <code>        sourcePath: target,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 487 | <code>        payload: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 488 | <code>            path: target,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 489 | <code>            textArtifact: {</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 490 | <code>                path: target,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 491 | <code>                encoding,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 492 | <code>                type: path.extname(target).slice(1).toLowerCase() &#124;&#124; 'text',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 493 | <code>                bytes: stat.size,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 494 | <code>                chars: text.length,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 495 | <code>                lineCount: lines.length,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 496 | <code>                text</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 497 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 498 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 499 | <code>        summary: `Text artifact ${path.basename(target)}: ${lines.length} lines, ${text.length} chars`,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 500 | <code>        metadata: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 501 | <code>            size: stat.size,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 502 | <code>            extension: path.extname(target).toLowerCase(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 503 | <code>            createdFrom: 'computer.read',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 504 | <code>            requestedMaxBytes: args.maxBytes</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 505 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 506 | <code>        modelView: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 507 | <code>            path: target,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 508 | <code>            lineCount: lines.length,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 509 | <code>            chars: text.length,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 510 | <code>            queryTools: ['artifact_query:text_schema', 'artifact_query:text_range', 'artifact_query:text_search', 'artifact_query:text_tail']</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 511 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 512 | <code>        queryHints: ['artifact_query summary', 'artifact_query text_range', 'artifact_query text_search', 'artifact_query text_tail']</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 513 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 514 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 515 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 516 | <code>async function createManagedDocumentArtifact({ target, stat, document, runtime = {}, context = {} } = {}) {</code> | 定义函数 `createManagedDocumentArtifact`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 517 | <code>    if (!runtime.contextArtifactStore?.createArtifact) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 518 | <code>        return null;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 519 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 520 | <code>    const lines = document.text.split(/\r?\n/);</code> | 声明局部标识符 `lines`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 521 | <code>    return await runtime.contextArtifactStore.createArtifact({</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 522 | <code>        kind: 'document',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 523 | <code>        type: document.format &#124;&#124; path.extname(target).slice(1).toLowerCase() &#124;&#124; 'document',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 524 | <code>        tool: COMPUTER_TOOL_ID,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 525 | <code>        runId: context.runId,</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 526 | <code>        sessionId: context.sessionId &#124;&#124; context.sessionKey,</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 527 | <code>        sourcePath: target,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 528 | <code>        payload: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 529 | <code>            path: target,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 530 | <code>            documentArtifact: {</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 531 | <code>                path: target,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 532 | <code>                format: document.format,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 533 | <code>                parser: document.parser,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 534 | <code>                bytes: stat.size,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 535 | <code>                chars: document.text.length,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 536 | <code>                lineCount: lines.length,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 537 | <code>                text: document.text,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 538 | <code>                pages: document.pages &#124;&#124; [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 539 | <code>                sections: document.sections &#124;&#124; []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 540 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 541 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 542 | <code>        summary: `Document artifact ${path.basename(target)}: ${document.format &#124;&#124; 'document'}, ${document.text.length} chars`,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 543 | <code>        metadata: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 544 | <code>            size: stat.size,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 545 | <code>            extension: path.extname(target).toLowerCase(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 546 | <code>            parser: document.parser,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 547 | <code>            createdFrom: 'computer.read'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 548 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 549 | <code>        modelView: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 550 | <code>            path: target,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 551 | <code>            format: document.format,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 552 | <code>            parser: document.parser,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 553 | <code>            pages: document.pages?.length &#124;&#124; 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 554 | <code>            sections: document.sections?.length &#124;&#124; 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 555 | <code>            chars: document.text.length,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 556 | <code>            queryTools: ['artifact_query:document_schema', 'artifact_query:document_search', 'artifact_query:document_page', 'artifact_query:document_section']</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 557 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 558 | <code>        queryHints: ['artifact_query summary', 'artifact_query document_search', 'artifact_query document_page', 'artifact_query document_section']</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 559 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 560 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 561 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 562 | <code>function artifactCreatedReadResult({ kind, record, target, stat, text = '', preview, actions = [] } = {}) {</code> | 定义函数 `artifactCreatedReadResult`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 563 | <code>    return createTextResult([</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 564 | <code>        `${kind === 'document' ? 'DOCUMENT_ARTIFACT_CREATED' : 'TEXT_ARTIFACT_CREATED'}`,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 565 | <code>        `artifactId=${record.id}`,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 566 | <code>        `path=${target}`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 567 | <code>        `bytes=${stat.size} payloadBytes=${record.payloadBytes}`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 568 | <code>        `queryWith=artifact_query actions ${actions.join(', ')}`,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 569 | <code>        'observation_contract=complete:true truncated:false reasoning_ready:true',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 570 | <code>        '--- preview ---',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 571 | <code>        preview.text</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 572 | <code>    ].filter(Boolean).join('\n'), {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 573 | <code>        status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 574 | <code>        action: 'read',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 575 | <code>        path: target,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 576 | <code>        size: stat.size,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 577 | <code>        sizeText: formatBytes(stat.size),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 578 | <code>        artifactId: record.id,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 579 | <code>        artifactKind: kind,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 580 | <code>        payloadBytes: record.payloadBytes,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 581 | <code>        previewTruncated: preview.truncated,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 582 | <code>        complete: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 583 | <code>        truncated: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 584 | <code>        reasoningReady: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 585 | <code>        suggestedNext: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 586 | <code>            tool: 'artifact_query',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 587 | <code>            args: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 588 | <code>                artifactId: record.id,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 589 | <code>                action: kind === 'document' ? 'document_search' : 'text_search',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 590 | <code>                query: '&lt;text&gt;'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 591 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 592 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 593 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 594 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 595 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 596 | <code>function normalizeDocumentParseFailure(error) {</code> | 定义函数 `normalizeDocumentParseFailure`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 597 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 598 | <code>        code: normalizeString(error?.code &#124;&#124; ''),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 599 | <code>        message: error?.message &#124;&#124; String(error &#124;&#124; ''),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 600 | <code>        details: error?.details &amp;&amp; typeof error.details === 'object' ? error.details : {}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 601 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 602 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 603 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 604 | <code>function isScannedPdfNeedsOcrFailure(failure = {}) {</code> | 定义函数 `isScannedPdfNeedsOcrFailure`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 605 | <code>    return failure.code === 'scanned_pdf_needs_ocr' &#124;&#124;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 606 | <code>        failure.code === 'pdf_no_text_extracted' &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 607 | <code>        /scanned_pdf_needs_ocr&#124;pdf_no_text_extracted&#124;no selectable text&#124;scanned\/image-only/i.test(failure.message &#124;&#124; '');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 608 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 609 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 610 | <code>function scannedPdfNeedsOcrReadResult({ target, stat, bytesRead = 0, fileKind = 'PDF document', failure = {} } = {}) {</code> | 定义函数 `scannedPdfNeedsOcrReadResult`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 611 | <code>    return createErrorResult(</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 612 | <code>        'scanned_pdf_needs_ocr',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 613 | <code>        `这个 PDF 没有可选中的文本，像是扫描件或图片型 PDF。read 不会把 PDF 图片流乱码当作正文；请通过 tool_search 查找 OCR / PDF page render / vision 工具，再把 OCR 结果保存为 document_artifact 后查询。`,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 614 | <code>        {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 615 | <code>            path: target,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 616 | <code>            size: stat?.size &#124;&#124; 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 617 | <code>            sizeText: formatBytes(stat?.size &#124;&#124; 0),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 618 | <code>            bytesSampled: bytesRead,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 619 | <code>            fileKind,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 620 | <code>            documentParseError: failure.message &#124;&#124; 'scanned_pdf_needs_ocr',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 621 | <code>            documentParseCode: failure.code &#124;&#124; 'scanned_pdf_needs_ocr',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 622 | <code>            parseDetails: failure.details &#124;&#124; {},</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 623 | <code>            suggestedNext: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 624 | <code>                tool: 'tool_search',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 625 | <code>                query: 'OCR scanned PDF image-only PDF pdf_page_render ocr_document vision text extraction'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 626 | <code>            },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 627 | <code>            observationContract: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 628 | <code>                complete: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 629 | <code>                truncated: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 630 | <code>                reasoning_ready: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 631 | <code>                needs_ocr: true</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 632 | <code>            },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 633 | <code>            override: 'If raw bytes are needed for a custom OCR pipeline, use read_binary or render PDF pages to images first.'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 634 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 635 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 636 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 637 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 638 | <code>function pickOutputStoreDirectTool(action = '') {</code> | 定义函数 `pickOutputStoreDirectTool`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 639 | <code>    const normalized = normalizeGuiAction(action);</code> | 声明局部标识符 `normalized`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 640 | <code>    if (normalized === 'tail' &#124;&#124; normalized === 'output_tail' &#124;&#124; normalized === 'tail_output') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 641 | <code>        return 'output_tail';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 642 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 643 | <code>    if (normalized === 'search' &#124;&#124; normalized === 'find' &#124;&#124; normalized === 'output_search' &#124;&#124; normalized === 'search_output') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 644 | <code>        return 'output_search';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 645 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 646 | <code>    if (normalized === 'read' &#124;&#124; normalized === 'cat' &#124;&#124; normalized === 'output_read' &#124;&#124; normalized === 'read_output') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 647 | <code>        return 'output_read';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 648 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 649 | <code>    return '';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 650 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 651 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 652 | <code>function outputStoreWrongSurfaceResult(args = {}, action = '') {</code> | 定义函数 `outputStoreWrongSurfaceResult`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 653 | <code>    const outputId = normalizeString(args.outputId &#124;&#124; args.output_id &#124;&#124; args.id);</code> | 声明局部标识符 `outputId`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 654 | <code>    if (!outputId) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 655 | <code>        return null;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 656 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 657 | <code>    const normalizedAction = normalizeGuiAction(action);</code> | 声明局部标识符 `normalizedAction`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 658 | <code>    const hasFilesystemTarget = Boolean(normalizeString(args.path &#124;&#124; args.source &#124;&#124; args.target &#124;&#124; args.workdir));</code> | 声明局部标识符 `hasFilesystemTarget`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 659 | <code>    const explicitOutputAction = /^output_(read&#124;tail&#124;search)$/.test(normalizedAction) &#124;&#124; /_output$/.test(normalizedAction);</code> | 声明局部标识符 `explicitOutputAction`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 660 | <code>    if (hasFilesystemTarget &amp;&amp; !explicitOutputAction) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 661 | <code>        return null;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 662 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 663 | <code>    if (!pickOutputStoreDirectTool(action)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 664 | <code>        return null;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 665 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 666 | <code>    return createErrorResult(</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 667 | <code>        'wrong_tool_surface',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 668 | <code>        `outputId 是执行日志标识，不是文件路径，也不是 computer action。请通过 tool_search 查询 output_read/output_tail/output_search，并用返回的 direct tool 按需读取、搜索或查看尾部；不要把 outputId 当 path 传给 computer.read。`,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 669 | <code>        {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 670 | <code>            action,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 671 | <code>            outputId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 672 | <code>            wrongCall: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 673 | <code>                tool: 'computer',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 674 | <code>                args: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 675 | <code>                    action,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 676 | <code>                    outputId</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 677 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 678 | <code>            },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 679 | <code>            defaultSurface: 'deferred_output_store_tools',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 680 | <code>            recovery: 'Call tool_search with a query like "exec output outputId search tail read", then call output_search/output_tail/output_read directly.'</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 681 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 682 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 683 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 684 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 685 | <code>function normalizeGuiAction(action = '') {</code> | 定义函数 `normalizeGuiAction`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 686 | <code>    const normalized = normalizeString(action).toLowerCase().replace(/[-\s]+/g, '_');</code> | 声明局部标识符 `normalized`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 687 | <code>    const aliases = {</code> | 声明局部标识符 `aliases`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 688 | <code>        screenshot: 'screen_screenshot',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 689 | <code>        capture_screen: 'screen_screenshot',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 690 | <code>        click: 'mouse_click',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 691 | <code>        double_click: 'mouse_double_click',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 692 | <code>        right_click: 'mouse_right_click',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 693 | <code>        drag: 'mouse_drag',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 694 | <code>        mouse_scroll: 'scroll',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 695 | <code>        type: 'keyboard_type',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 696 | <code>        type_text: 'keyboard_type',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 697 | <code>        press_key: 'keyboard_press',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 698 | <code>        hotkey: 'keyboard_hotkey',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 699 | <code>        read_clipboard: 'clipboard_read',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 700 | <code>        write_clipboard: 'clipboard_write',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 701 | <code>        sleep: 'wait',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 702 | <code>        shell: 'exec_command',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 703 | <code>        shell_exec: 'exec_command',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 704 | <code>        command: 'exec_command',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 705 | <code>        poll: 'write_stdin',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 706 | <code>        process_poll: 'write_stdin',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 707 | <code>        stdin: 'write_stdin'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 708 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 709 | <code>    return aliases[normalized] &#124;&#124; normalized;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 710 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 711 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 712 | <code>function formatBytes(bytes) {</code> | 定义函数 `formatBytes`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 713 | <code>    if (!Number.isFinite(bytes)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 714 | <code>        return 'unknown';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 715 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 716 | <code>    const units = ['B', 'KB', 'MB', 'GB', 'TB'];</code> | 声明局部标识符 `units`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 717 | <code>    let value = bytes;</code> | 声明局部标识符 `value`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 718 | <code>    let unitIndex = 0;</code> | 声明局部标识符 `unitIndex`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 719 | <code>    while (value &gt;= 1024 &amp;&amp; unitIndex &lt; units.length - 1) {</code> | 循环控制：对集合、队列、重试次数或状态持续执行同一组逻辑。 |
| 720 | <code>        value /= 1024;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 721 | <code>        unitIndex += 1;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 722 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 723 | <code>    return `${value.toFixed(unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 724 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 725 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 726 | <code>async function safeStat(targetPath) {</code> | 定义函数 `safeStat`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 727 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 728 | <code>        return await fsp.lstat(targetPath);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 729 | <code>    } catch {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 730 | <code>        return null;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 731 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 732 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 733 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 734 | <code>function statDetails(targetPath, stat) {</code> | 定义函数 `statDetails`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 735 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 736 | <code>        path: targetPath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 737 | <code>        type: stat.isDirectory()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 738 | <code>            ? 'directory'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 739 | <code>            : stat.isFile()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 740 | <code>                ? 'file'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 741 | <code>                : stat.isSymbolicLink()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 742 | <code>                    ? 'symlink'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 743 | <code>                    : 'other',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 744 | <code>        size: stat.size,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 745 | <code>        sizeText: formatBytes(stat.size),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 746 | <code>        mode: stat.mode,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 747 | <code>        createdAt: stat.birthtime.toISOString(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 748 | <code>        modifiedAt: stat.mtime.toISOString(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 749 | <code>        accessedAt: stat.atime.toISOString()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 750 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 751 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 752 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 753 | <code>function getWorkspaceRoot(runtime = {}) {</code> | 定义函数 `getWorkspaceRoot`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 754 | <code>    return path.resolve(runtime.workspaceRoot &#124;&#124; runtime.workspaceDir &#124;&#124; process.cwd());</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 755 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 756 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 757 | <code>function getRollbackRoot(runtime = {}) {</code> | 定义函数 `getRollbackRoot`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 758 | <code>    return path.join(getWorkspaceRoot(runtime), '.ailis-rollback');</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 759 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 760 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 761 | <code>function sanitizePathComponent(value) {</code> | 定义函数 `sanitizePathComponent`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 762 | <code>    return normalizeString(value, 'path').replace(/[^a-zA-Z0-9._-]+/g, '_').slice(0, 80) &#124;&#124; 'path';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 763 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 764 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 765 | <code>function rollbackJournalPath(runtime = {}) {</code> | 定义函数 `rollbackJournalPath`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 766 | <code>    return path.join(getRollbackRoot(runtime), 'journal.jsonl');</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 767 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 768 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 769 | <code>async function appendJsonLine(filePath, entry) {</code> | 定义函数 `appendJsonLine`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 770 | <code>    await fsp.mkdir(path.dirname(filePath), { recursive: true });</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 771 | <code>    await fsp.appendFile(filePath, `${JSON.stringify(entry)}\n`, 'utf8');</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 772 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 773 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 774 | <code>function rollbackSnapshotPath(root, targetPath) {</code> | 定义函数 `rollbackSnapshotPath`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 775 | <code>    const digest = crypto.createHash('sha256').update(path.resolve(targetPath)).digest('hex').slice(0, 16);</code> | 声明局部标识符 `digest`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 776 | <code>    return path.join(root, 'objects', digest, sanitizePathComponent(path.basename(targetPath) &#124;&#124; 'root'));</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 777 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 778 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 779 | <code>async function removeIfExists(targetPath) {</code> | 定义函数 `removeIfExists`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 780 | <code>    await fsp.rm(targetPath, { recursive: true, force: true }).catch(() =&gt; {});</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 781 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 782 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 783 | <code>async function createRollbackSnapshot(action, targets, args = {}, runtime = {}) {</code> | 定义函数 `createRollbackSnapshot`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 784 | <code>    if (args.rollback === false &#124;&#124; args.skipRollback === true &#124;&#124; args.dryRun === true) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 785 | <code>        return null;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 786 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 787 | <code>    const rollbackRoot = getRollbackRoot(runtime);</code> | 声明局部标识符 `rollbackRoot`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 788 | <code>    const maxBytes = normalizeNumber(args.rollbackMaxBytes, 100 * 1024 * 1024, 1024, 2 * 1024 * 1024 * 1024);</code> | 声明局部标识符 `maxBytes`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 789 | <code>    const entry = {</code> | 声明局部标识符 `entry`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 790 | <code>        id: randomUUID(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 791 | <code>        action,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 792 | <code>        createdAt: new Date().toISOString(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 793 | <code>        maxBytes,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 794 | <code>        snapshots: []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 795 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 796 | <code>    for (const target of uniquePaths(targets)) {</code> | 声明局部标识符 `target`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 797 | <code>        const stat = await safeStat(target);</code> | 声明局部标识符 `stat`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 798 | <code>        const snapshot = {</code> | 声明局部标识符 `snapshot`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 799 | <code>            path: target,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 800 | <code>            existed: Boolean(stat),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 801 | <code>            type: stat</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 802 | <code>                ? stat.isDirectory()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 803 | <code>                    ? 'directory'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 804 | <code>                    : stat.isFile()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 805 | <code>                        ? 'file'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 806 | <code>                        : stat.isSymbolicLink()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 807 | <code>                            ? 'symlink'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 808 | <code>                            : 'other'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 809 | <code>                : 'missing',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 810 | <code>            size: stat?.size ?? 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 811 | <code>            snapshotPath: ''</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 812 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 813 | <code>        if (stat &amp;&amp; (stat.isFile() &#124;&#124; stat.isDirectory()) &amp;&amp; !stat.isSymbolicLink()) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 814 | <code>            const size = stat.isDirectory() ? (await directorySize(target, { maxDepth: 40 })).total : stat.size;</code> | 声明局部标识符 `size`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 815 | <code>            snapshot.size = size;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 816 | <code>            if (size &lt;= maxBytes) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 817 | <code>                snapshot.snapshotPath = rollbackSnapshotPath(rollbackRoot, target);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 818 | <code>                await removeIfExists(snapshot.snapshotPath);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 819 | <code>                await copyRecursive(target, snapshot.snapshotPath);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 820 | <code>            } else {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 821 | <code>                snapshot.skipped = true;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 822 | <code>                snapshot.reason = `snapshot_too_large:${formatBytes(size)}`;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 823 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 824 | <code>        } else if (stat) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 825 | <code>            snapshot.skipped = true;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 826 | <code>            snapshot.reason = 'unsupported_file_type';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 827 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 828 | <code>        entry.snapshots.push(snapshot);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 829 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 830 | <code>    await appendJsonLine(rollbackJournalPath(runtime), entry);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 831 | <code>    return entry;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 832 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 833 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 834 | <code>async function readRollbackJournal(runtime = {}) {</code> | 定义函数 `readRollbackJournal`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 835 | <code>    const journal = rollbackJournalPath(runtime);</code> | 声明局部标识符 `journal`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 836 | <code>    const text = await fsp.readFile(journal, 'utf8').catch(() =&gt; '');</code> | 声明局部标识符 `text`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 837 | <code>    if (!text) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 838 | <code>        return [];</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 839 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 840 | <code>    return text</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 841 | <code>        .split(/\r?\n/)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 842 | <code>        .map((line) =&gt; line.trim())</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 843 | <code>        .filter(Boolean)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 844 | <code>        .map((line) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 845 | <code>            try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 846 | <code>                return JSON.parse(line);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 847 | <code>            } catch (error) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 848 | <code>                return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 849 | <code>                    id: '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 850 | <code>                    parseError: error?.message &#124;&#124; String(error),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 851 | <code>                    raw: line</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 852 | <code>                };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 853 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 854 | <code>        })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 855 | <code>        .filter((entry) =&gt; entry.id);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 856 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 857 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 858 | <code>async function runExecFile(command, args = [], options = {}) {</code> | 定义函数 `runExecFile`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 859 | <code>    return await new Promise((resolve) =&gt; {</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 860 | <code>        execFile(command, args, { windowsHide: true, timeout: 15000, ...options }, (error, stdout, stderr) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 861 | <code>            resolve({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 862 | <code>                ok: !error,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 863 | <code>                exitCode: error?.code ?? 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 864 | <code>                stdout: normalizeString(stdout),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 865 | <code>                stderr: normalizeString(stderr),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 866 | <code>                error: error ? error.message &#124;&#124; String(error) : ''</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 867 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 868 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 869 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 870 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 871 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 872 | <code>async function runAdapterCommand(commandSpec = {}, options = {}) {</code> | 定义函数 `runAdapterCommand`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 873 | <code>    const steps = Array.isArray(commandSpec.steps) &amp;&amp; commandSpec.steps.length</code> | 声明局部标识符 `steps`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 874 | <code>        ? commandSpec.steps</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 875 | <code>        : [{ command: commandSpec.command, args: commandSpec.args &#124;&#124; [], windowsHide: commandSpec.windowsHide }];</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 876 | <code>    const stdoutParts = [];</code> | 声明局部标识符 `stdoutParts`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 877 | <code>    const stderrParts = [];</code> | 声明局部标识符 `stderrParts`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 878 | <code>    let lastExitCode = 0;</code> | 声明局部标识符 `lastExitCode`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 879 | <code>    for (let index = 0; index &lt; steps.length; index++) {</code> | 声明局部标识符 `index`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 880 | <code>        const step = steps[index] &#124;&#124; {};</code> | 声明局部标识符 `step`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 881 | <code>        const result = await runExecFile(step.command, step.args &#124;&#124; [], {</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 882 | <code>            ...options,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 883 | <code>            windowsHide: step.windowsHide ?? commandSpec.windowsHide ?? options.windowsHide</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 884 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 885 | <code>        lastExitCode = result.exitCode;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 886 | <code>        if (result.stdout) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 887 | <code>            stdoutParts.push(result.stdout);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 888 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 889 | <code>        if (result.stderr) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 890 | <code>            stderrParts.push(result.stderr);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 891 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 892 | <code>        if (!result.ok &amp;&amp; !step.optional) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 893 | <code>            return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 894 | <code>                ...result,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 895 | <code>                stepIndex: index,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 896 | <code>                stepCommand: step.command,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 897 | <code>                stdout: stdoutParts.join('\n'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 898 | <code>                stderr: stderrParts.join('\n') &#124;&#124; result.stderr</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 899 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 900 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 901 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 902 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 903 | <code>        ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 904 | <code>        exitCode: lastExitCode,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 905 | <code>        stdout: stdoutParts.join('\n'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 906 | <code>        stderr: stderrParts.join('\n'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 907 | <code>        error: ''</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 908 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 909 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 910 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 911 | <code>function parseJsonObject(text = '') {</code> | 定义函数 `parseJsonObject`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 912 | <code>    const trimmed = normalizeString(text);</code> | 声明局部标识符 `trimmed`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 913 | <code>    if (!trimmed) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 914 | <code>        return null;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 915 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 916 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 917 | <code>        return JSON.parse(trimmed);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 918 | <code>    } catch {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 919 | <code>        const line = trimmed</code> | 声明局部标识符 `line`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 920 | <code>            .split(/\r?\n/)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 921 | <code>            .reverse()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 922 | <code>            .find((entry) =&gt; entry.trim().startsWith('{') &amp;&amp; entry.trim().endsWith('}'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 923 | <code>        if (!line) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 924 | <code>            return null;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 925 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 926 | <code>        try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 927 | <code>            return JSON.parse(line);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 928 | <code>        } catch {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 929 | <code>            return null;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 930 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 931 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 932 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 933 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 934 | <code>function defaultScreenshotPath(runtime = {}) {</code> | 定义函数 `defaultScreenshotPath`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 935 | <code>    const root = runtime.screenshotDir &#124;&#124;</code> | 声明局部标识符 `root`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 936 | <code>        path.join(os.tmpdir(), 'ailis-screenshots');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 937 | <code>    return path.join(root, `screen-${Date.now()}-${crypto.randomBytes(3).toString('hex')}.png`);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 938 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 939 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 940 | <code>async function actionWait(args = {}) {</code> | 定义函数 `actionWait`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 941 | <code>    const durationMs = normalizeNumber(args.durationMs &#124;&#124; args.ms &#124;&#124; args.timeoutMs, 1000, 0, 60000);</code> | 声明局部标识符 `durationMs`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 942 | <code>    await new Promise((resolve) =&gt; setTimeout(resolve, durationMs));</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 943 | <code>    return createTextResult(`wait completed: ${durationMs}ms`, {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 944 | <code>        status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 945 | <code>        action: 'wait',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 946 | <code>        durationMs</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 947 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 948 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 949 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 950 | <code>async function actionScreenScreenshot(args, context, runtime) {</code> | 定义函数 `actionScreenScreenshot`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 951 | <code>    const platformAdapter = getRuntimePlatform(runtime);</code> | 声明局部标识符 `platformAdapter`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 952 | <code>    const targetPath = resolveTargetPath(args.path &#124;&#124; args.outputPath &#124;&#124; defaultScreenshotPath(runtime), runtime);</code> | 声明局部标识符 `targetPath`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 953 | <code>    const guard = guardPath(targetPath, 'write', context, runtime);</code> | 声明局部标识符 `guard`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 954 | <code>    if (guard) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 955 | <code>        return guard;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 956 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 957 | <code>    const command = platformAdapter.desktopScreenshotCommand?.({ outputPath: targetPath });</code> | 声明局部标识符 `command`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 958 | <code>    if (!command?.supported) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 959 | <code>        return createErrorResult('not_supported', command?.reason &#124;&#124; 'screen_screenshot is not supported by this platform adapter.', {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 960 | <code>            action: 'screen_screenshot',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 961 | <code>            platform: platformAdapter.getStatus()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 962 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 963 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 964 | <code>    await fsp.mkdir(path.dirname(targetPath), { recursive: true }).catch(() =&gt; {});</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 965 | <code>    const result = await runAdapterCommand(command, {</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 966 | <code>        timeout: normalizeNumber(args.timeoutMs, 15000, 1000, 120000),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 967 | <code>        windowsHide: command.windowsHide !== false</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 968 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 969 | <code>    if (!result.ok) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 970 | <code>        return createErrorResult('computer_exec_failed', '屏幕截图失败。', {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 971 | <code>            action: 'screen_screenshot',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 972 | <code>            ...result</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 973 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 974 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 975 | <code>    const parsed = parseJsonObject(result.stdout) &#124;&#124; {};</code> | 声明局部标识符 `parsed`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 976 | <code>    const stat = await safeStat(targetPath);</code> | 声明局部标识符 `stat`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 977 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 978 | <code>        content: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 979 | <code>            { type: 'text', text: `screen_screenshot saved: ${targetPath}` },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 980 | <code>            { type: 'image', uri: targetPath, mimeType: 'image/png' }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 981 | <code>        ],</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 982 | <code>        details: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 983 | <code>            status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 984 | <code>            action: 'screen_screenshot',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 985 | <code>            path: targetPath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 986 | <code>            width: parsed.width &#124;&#124; null,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 987 | <code>            height: parsed.height &#124;&#124; null,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 988 | <code>            size: stat?.size &#124;&#124; null,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 989 | <code>            sizeText: stat ? formatBytes(stat.size) : 'unknown',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 990 | <code>            stdout: result.stdout,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 991 | <code>            stderr: result.stderr</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 992 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 993 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 994 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 995 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 996 | <code>async function actionClipboardRead(args, context, runtime) {</code> | 定义函数 `actionClipboardRead`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 997 | <code>    const platformAdapter = getRuntimePlatform(runtime);</code> | 声明局部标识符 `platformAdapter`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 998 | <code>    const command = platformAdapter.clipboardReadCommand?.();</code> | 声明局部标识符 `command`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 999 | <code>    if (!command?.supported) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1000 | <code>        return createErrorResult('not_supported', command?.reason &#124;&#124; 'clipboard_read is not supported by this platform adapter.', {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1001 | <code>            action: 'clipboard_read',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1002 | <code>            platform: platformAdapter.getStatus()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1003 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1004 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1005 | <code>    const result = await runAdapterCommand(command, {</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1006 | <code>        timeout: normalizeNumber(args.timeoutMs, 10000, 1000, 60000),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1007 | <code>        windowsHide: command.windowsHide !== false</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1008 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1009 | <code>    if (!result.ok) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1010 | <code>        return createErrorResult('computer_exec_failed', '读取剪贴板失败。', {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1011 | <code>            action: 'clipboard_read',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1012 | <code>            ...result</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1013 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1014 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1015 | <code>    const parsed = parseJsonObject(result.stdout);</code> | 声明局部标识符 `parsed`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1016 | <code>    const text = parsed &amp;&amp; typeof parsed.text === 'string' ? parsed.text : result.stdout;</code> | 声明局部标识符 `text`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1017 | <code>    return createTextResult(text, {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1018 | <code>        status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1019 | <code>        action: 'clipboard_read',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1020 | <code>        text,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1021 | <code>        bytes: Buffer.byteLength(text, 'utf8')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1022 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1023 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1024 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1025 | <code>async function actionClipboardWrite(args, context, runtime) {</code> | 定义函数 `actionClipboardWrite`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1026 | <code>    const action = 'clipboard_write';</code> | 声明局部标识符 `action`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1027 | <code>    const guard = approvalRequired(action, args, context);</code> | 声明局部标识符 `guard`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1028 | <code>    if (guard) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1029 | <code>        return guard;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1030 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1031 | <code>    const platformAdapter = getRuntimePlatform(runtime);</code> | 声明局部标识符 `platformAdapter`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1032 | <code>    const text = typeof args.text === 'string' ? args.text : String(args.content &#124;&#124; '');</code> | 声明局部标识符 `text`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1033 | <code>    const command = platformAdapter.clipboardWriteCommand?.({ text });</code> | 声明局部标识符 `command`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1034 | <code>    if (!command?.supported) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1035 | <code>        return createErrorResult('not_supported', command?.reason &#124;&#124; 'clipboard_write is not supported by this platform adapter.', {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1036 | <code>            action,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1037 | <code>            platform: platformAdapter.getStatus()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1038 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1039 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1040 | <code>    const result = await runAdapterCommand(command, {</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1041 | <code>        timeout: normalizeNumber(args.timeoutMs, 10000, 1000, 60000),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1042 | <code>        windowsHide: command.windowsHide !== false</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1043 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1044 | <code>    if (!result.ok) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1045 | <code>        return createErrorResult('computer_exec_failed', '写入剪贴板失败。', {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1046 | <code>            action,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1047 | <code>            ...result</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1048 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1049 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1050 | <code>    return createTextResult('clipboard_write completed', {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1051 | <code>        status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1052 | <code>        action,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1053 | <code>        bytes: Buffer.byteLength(text, 'utf8'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1054 | <code>        stdout: result.stdout,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1055 | <code>        stderr: result.stderr</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1056 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1057 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1058 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1059 | <code>async function actionGuiInput(args, context, runtime) {</code> | 定义函数 `actionGuiInput`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1060 | <code>    const action = normalizeGuiAction(args.action &#124;&#124; args.operation &#124;&#124; args.intent);</code> | 声明局部标识符 `action`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1061 | <code>    const guard = approvalRequired(action, args, context);</code> | 声明局部标识符 `guard`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1062 | <code>    if (guard) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1063 | <code>        return guard;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1064 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1065 | <code>    const platformAdapter = getRuntimePlatform(runtime);</code> | 声明局部标识符 `platformAdapter`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1066 | <code>    const command = platformAdapter.guiInputCommand?.({ ...args, action });</code> | 声明局部标识符 `command`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1067 | <code>    if (!command?.supported) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1068 | <code>        return createErrorResult('not_supported', command?.reason &#124;&#124; `${action} is not supported by this platform adapter.`, {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1069 | <code>            action,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1070 | <code>            platform: platformAdapter.getStatus()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1071 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1072 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1073 | <code>    const result = await runAdapterCommand(command, {</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1074 | <code>        timeout: normalizeNumber(args.timeoutMs, 10000, 1000, 120000),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1075 | <code>        windowsHide: command.windowsHide !== false</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1076 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1077 | <code>    if (!result.ok) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1078 | <code>        return createErrorResult('computer_exec_failed', `${action} 执行失败。`, {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1079 | <code>            action,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1080 | <code>            ...result</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1081 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1082 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1083 | <code>    const parsed = parseJsonObject(result.stdout) &#124;&#124; {};</code> | 声明局部标识符 `parsed`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1084 | <code>    return createTextResult(`${action} completed`, {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1085 | <code>        status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1086 | <code>        action,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1087 | <code>        observation: parsed,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1088 | <code>        stdout: result.stdout,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1089 | <code>        stderr: result.stderr</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1090 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1091 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1092 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1093 | <code>async function actionList(args, context, runtime) {</code> | 定义函数 `actionList`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1094 | <code>    const target = resolveTargetPath(args.path &#124;&#124; args.dir &#124;&#124; '.', runtime);</code> | 声明局部标识符 `target`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1095 | <code>    const guard = guardPath(target, 'list', context, runtime);</code> | 声明局部标识符 `guard`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1096 | <code>    if (guard) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1097 | <code>        return guard;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1098 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1099 | <code>    const entries = await fsp.readdir(target, { withFileTypes: true });</code> | 声明局部标识符 `entries`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1100 | <code>    const includeHidden = normalizeBoolean(args.includeHidden, true);</code> | 声明局部标识符 `includeHidden`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1101 | <code>    const limit = normalizeNumber(args.limit, 200, 1, 2000);</code> | 声明局部标识符 `limit`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1102 | <code>    const rows = [];</code> | 声明局部标识符 `rows`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1103 | <code>    for (const entry of entries) {</code> | 声明局部标识符 `entry`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1104 | <code>        if (!includeHidden &amp;&amp; entry.name.startsWith('.')) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1105 | <code>            continue;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1106 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1107 | <code>        const fullPath = path.join(target, entry.name);</code> | 声明局部标识符 `fullPath`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1108 | <code>        const stat = await safeStat(fullPath);</code> | 声明局部标识符 `stat`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1109 | <code>        rows.push({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1110 | <code>            name: entry.name,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1111 | <code>            path: fullPath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1112 | <code>            type: entry.isDirectory() ? 'directory' : entry.isFile() ? 'file' : entry.isSymbolicLink() ? 'symlink' : 'other',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1113 | <code>            size: stat?.size ?? null,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1114 | <code>            sizeText: stat ? formatBytes(stat.size) : 'unknown',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1115 | <code>            modifiedAt: stat?.mtime ? stat.mtime.toISOString() : ''</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1116 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1117 | <code>        if (rows.length &gt;= limit) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1118 | <code>            break;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1119 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1120 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1121 | <code>    rows.sort((a, b) =&gt; (a.type === b.type ? a.name.localeCompare(b.name) : a.type.localeCompare(b.type)));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1122 | <code>    return createTextResult(JSON.stringify({ action: 'list', path: target, entries: rows }, null, 2), {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1123 | <code>        status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1124 | <code>        action: 'list',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1125 | <code>        path: target,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1126 | <code>        count: rows.length,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1127 | <code>        entries: rows</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1128 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1129 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1130 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1131 | <code>async function walkTree(root, args, runtime) {</code> | 定义函数 `walkTree`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1132 | <code>    const maxDepth = normalizeNumber(args.maxDepth, 3, 0, 12);</code> | 声明局部标识符 `maxDepth`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1133 | <code>    const limit = normalizeNumber(args.limit, DEFAULT_TREE_LIMIT, 1, 5000);</code> | 声明局部标识符 `limit`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1134 | <code>    const includeFiles = args.includeFiles !== false;</code> | 声明局部标识符 `includeFiles`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1135 | <code>    const nodes = [];</code> | 声明局部标识符 `nodes`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1136 | <code>    let visited = 0;</code> | 声明局部标识符 `visited`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1137 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1138 | <code>    async function visit(current, depth) {</code> | 定义函数 `visit`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1139 | <code>        if (visited &gt;= limit) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1140 | <code>            return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1141 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1142 | <code>        const stat = await safeStat(current);</code> | 声明局部标识符 `stat`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1143 | <code>        if (!stat) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1144 | <code>            return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1145 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1146 | <code>        visited += 1;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1147 | <code>        const relativePath = path.relative(root, current) &#124;&#124; '.';</code> | 声明局部标识符 `relativePath`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1148 | <code>        if (stat.isDirectory() &#124;&#124; includeFiles) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1149 | <code>            nodes.push({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1150 | <code>                path: current,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1151 | <code>                relativePath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1152 | <code>                type: stat.isDirectory() ? 'directory' : stat.isFile() ? 'file' : 'other',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1153 | <code>                size: stat.isFile() ? stat.size : null,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1154 | <code>                sizeText: stat.isFile() ? formatBytes(stat.size) : ''</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1155 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1156 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1157 | <code>        if (!stat.isDirectory() &#124;&#124; depth &gt;= maxDepth &#124;&#124; stat.isSymbolicLink()) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1158 | <code>            return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1159 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1160 | <code>        const entries = await fsp.readdir(current);</code> | 声明局部标识符 `entries`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1161 | <code>        for (const entry of entries) {</code> | 声明局部标识符 `entry`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1162 | <code>            await visit(path.join(current, entry), depth + 1);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1163 | <code>            if (visited &gt;= limit) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1164 | <code>                break;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1165 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1166 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1167 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1168 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1169 | <code>    await visit(root, 0);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1170 | <code>    return nodes;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1171 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1172 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1173 | <code>async function actionTree(args, context, runtime) {</code> | 定义函数 `actionTree`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1174 | <code>    const target = resolveTargetPath(args.path &#124;&#124; args.dir &#124;&#124; '.', runtime);</code> | 声明局部标识符 `target`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1175 | <code>    const guard = guardPath(target, 'tree', context, runtime);</code> | 声明局部标识符 `guard`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1176 | <code>    if (guard) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1177 | <code>        return guard;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1178 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1179 | <code>    const nodes = await walkTree(target, args, runtime);</code> | 声明局部标识符 `nodes`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1180 | <code>    return createTextResult(JSON.stringify({ action: 'tree', path: target, nodes }, null, 2), {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1181 | <code>        status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1182 | <code>        action: 'tree',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1183 | <code>        path: target,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1184 | <code>        count: nodes.length,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1185 | <code>        nodes</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1186 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1187 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1188 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1189 | <code>async function actionStat(args, context, runtime) {</code> | 定义函数 `actionStat`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1190 | <code>    const target = resolveTargetPath(args.path, runtime);</code> | 声明局部标识符 `target`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1191 | <code>    const guard = guardPath(target, 'stat', context, runtime);</code> | 声明局部标识符 `guard`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1192 | <code>    if (guard) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1193 | <code>        return guard;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1194 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1195 | <code>    const stat = await safeStat(target);</code> | 声明局部标识符 `stat`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1196 | <code>    if (!stat) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1197 | <code>        return createErrorResult('not_found', `路径不存在：${target}`, { path: target });</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1198 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1199 | <code>    const details = statDetails(target, stat);</code> | 声明局部标识符 `details`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1200 | <code>    return createTextResult(JSON.stringify(details, null, 2), {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1201 | <code>        status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1202 | <code>        action: 'stat',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1203 | <code>        ...details</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1204 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1205 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1206 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1207 | <code>async function actionRead(args, context, runtime) {</code> | 定义函数 `actionRead`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1208 | <code>    const target = resolveTargetPath(args.path, runtime);</code> | 声明局部标识符 `target`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1209 | <code>    const guard = guardPath(target, 'read', context, runtime);</code> | 声明局部标识符 `guard`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1210 | <code>    if (guard) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1211 | <code>        return guard;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1212 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1213 | <code>    const artifactRecord = await runtime.contextArtifactStore?.findByPath?.(target).catch(() =&gt; null);</code> | 声明局部标识符 `artifactRecord`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1214 | <code>    if (artifactRecord?.payloadPath &amp;&amp; path.resolve(artifactRecord.payloadPath) === path.resolve(target)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1215 | <code>        return runtime.contextArtifactStore.guardReadResult(artifactRecord, target);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1216 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1217 | <code>    const stat = await safeStat(target);</code> | 声明局部标识符 `stat`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1218 | <code>    if (!stat &#124;&#124; !stat.isFile()) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1219 | <code>        return createErrorResult('not_found', `文件不存在：${target}`, { path: target });</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1220 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1221 | <code>    const maxBytes = normalizeNumber(args.maxBytes, DEFAULT_MAX_BYTES, 1, 5 * 1024 * 1024);</code> | 声明局部标识符 `maxBytes`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1222 | <code>    const maxArtifactBytes = normalizeNumber(args.maxArtifactBytes &#124;&#124; args.max_artifact_bytes, DEFAULT_MAX_ARTIFACT_SOURCE_BYTES, 1, 100 * 1024 * 1024);</code> | 声明局部标识符 `maxArtifactBytes`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1223 | <code>    const handle = await fsp.open(target, 'r');</code> | 声明局部标识符 `handle`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1224 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 1225 | <code>        const buffer = Buffer.alloc(Math.min(stat.size, maxBytes));</code> | 声明局部标识符 `buffer`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1226 | <code>        const { bytesRead } = await handle.read(buffer, 0, buffer.length, 0);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1227 | <code>        const chunk = buffer.subarray(0, bytesRead);</code> | 声明局部标识符 `chunk`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1228 | <code>        const forceText = args.forceText === true &#124;&#124; args.allowBinaryText === true;</code> | 声明局部标识符 `forceText`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1229 | <code>        if (!forceText &amp;&amp; isDocumentArtifactExtension(target)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1230 | <code>            let documentParseError = '';</code> | 声明局部标识符 `documentParseError`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1231 | <code>            let documentParseFailure = null;</code> | 声明局部标识符 `documentParseFailure`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1232 | <code>            if (stat.size &lt;= maxArtifactBytes &amp;&amp; runtime.contextArtifactStore?.createArtifact) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1233 | <code>                try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 1234 | <code>                    const fullBuffer = stat.size === bytesRead ? chunk : await fsp.readFile(target);</code> | 声明局部标识符 `fullBuffer`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1235 | <code>                    const ext = path.extname(target).toLowerCase();</code> | 声明局部标识符 `ext`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1236 | <code>                    const document = ext === '.docx'</code> | 声明局部标识符 `document`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1237 | <code>                        ? extractDocxDocument(fullBuffer)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1238 | <code>                        : await extractPdfDocument(fullBuffer);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1239 | <code>                    const record = await createManagedDocumentArtifact({</code> | 声明局部标识符 `record`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1240 | <code>                        target,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1241 | <code>                        stat,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1242 | <code>                        document,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1243 | <code>                        runtime,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1244 | <code>                        context</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1245 | <code>                    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1246 | <code>                    if (record?.id) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1247 | <code>                        const preview = buildArtifactPreview(document.text, normalizeNumber(args.previewChars &#124;&#124; args.preview_chars, 4000, 1000, 20000));</code> | 声明局部标识符 `preview`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1248 | <code>                        return artifactCreatedReadResult({</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1249 | <code>                            kind: 'document',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1250 | <code>                            record,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1251 | <code>                            target,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1252 | <code>                            stat,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1253 | <code>                            text: document.text,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1254 | <code>                            preview,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1255 | <code>                            actions: ['summary', 'document_schema', 'document_search', 'document_page', 'document_section']</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1256 | <code>                        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1257 | <code>                    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1258 | <code>                } catch (error) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1259 | <code>                    documentParseFailure = normalizeDocumentParseFailure(error);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1260 | <code>                    documentParseError = documentParseFailure.message;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1261 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1262 | <code>            } else {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1263 | <code>                documentParseError = stat.size &gt; maxArtifactBytes</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1264 | <code>                    ? `document_too_large:${formatBytes(stat.size)} &gt; ${formatBytes(maxArtifactBytes)}`</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1265 | <code>                    : 'context_artifact_store_unavailable';</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1266 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1267 | <code>            const fileKind = getStructuredFileHint(target);</code> | 声明局部标识符 `fileKind`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1268 | <code>            if (isScannedPdfNeedsOcrFailure(documentParseFailure)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1269 | <code>                return scannedPdfNeedsOcrReadResult({</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1270 | <code>                    target,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1271 | <code>                    stat,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1272 | <code>                    bytesRead,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1273 | <code>                    fileKind,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1274 | <code>                    failure: documentParseFailure</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1275 | <code>                });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1276 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1277 | <code>            return createErrorResult(</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1278 | <code>                'binary_file',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1279 | <code>                `read 不能直接把 ${fileKind} 的原始内容放进模型上下文；${target} 未能解析为 document_artifact。请使用 tool_search 查找 DOCX/PDF 专用解析工具，或 read_binary 读取原始字节。`,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1280 | <code>                {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1281 | <code>                    path: target,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1282 | <code>                    size: stat.size,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1283 | <code>                    sizeText: formatBytes(stat.size),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1284 | <code>                    bytesSampled: bytesRead,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1285 | <code>                    fileKind,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1286 | <code>                    documentParseError,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1287 | <code>                    suggestedNext: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1288 | <code>                        tool: 'tool_search',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1289 | <code>                        query: `${fileKind} document_artifact document_search pdf docx extract text`</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1290 | <code>                    },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1291 | <code>                    override: 'If raw text decoding is truly intended, call read with forceText=true.'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1292 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1293 | <code>            );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1294 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1295 | <code>        if (!forceText &amp;&amp; !isLikelyTextBuffer(chunk)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1296 | <code>            let documentParseError = '';</code> | 声明局部标识符 `documentParseError`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1297 | <code>            let documentParseFailure = null;</code> | 声明局部标识符 `documentParseFailure`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1298 | <code>            if (</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1299 | <code>                isDocumentArtifactExtension(target) &amp;&amp;</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1300 | <code>                stat.size &lt;= maxArtifactBytes &amp;&amp;</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1301 | <code>                runtime.contextArtifactStore?.createArtifact</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1302 | <code>            ) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1303 | <code>                try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 1304 | <code>                    const fullBuffer = stat.size === bytesRead ? chunk : await fsp.readFile(target);</code> | 声明局部标识符 `fullBuffer`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1305 | <code>                    const ext = path.extname(target).toLowerCase();</code> | 声明局部标识符 `ext`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1306 | <code>                    const document = ext === '.docx'</code> | 声明局部标识符 `document`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1307 | <code>                        ? extractDocxDocument(fullBuffer)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1308 | <code>                        : await extractPdfDocument(fullBuffer);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1309 | <code>                    const record = await createManagedDocumentArtifact({</code> | 声明局部标识符 `record`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1310 | <code>                        target,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1311 | <code>                        stat,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1312 | <code>                        document,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1313 | <code>                        runtime,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1314 | <code>                        context</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1315 | <code>                    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1316 | <code>                    if (record?.id) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1317 | <code>                        const preview = buildArtifactPreview(document.text, normalizeNumber(args.previewChars &#124;&#124; args.preview_chars, 4000, 1000, 20000));</code> | 声明局部标识符 `preview`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1318 | <code>                        return artifactCreatedReadResult({</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1319 | <code>                            kind: 'document',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1320 | <code>                            record,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1321 | <code>                            target,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1322 | <code>                            stat,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1323 | <code>                            text: document.text,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1324 | <code>                            preview,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1325 | <code>                            actions: ['summary', 'document_schema', 'document_search', 'document_page', 'document_section']</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1326 | <code>                        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1327 | <code>                    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1328 | <code>                } catch (error) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1329 | <code>                    documentParseFailure = normalizeDocumentParseFailure(error);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1330 | <code>                    documentParseError = documentParseFailure.message;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1331 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1332 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1333 | <code>            const fileKind = getStructuredFileHint(target);</code> | 声明局部标识符 `fileKind`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1334 | <code>            if (isScannedPdfNeedsOcrFailure(documentParseFailure)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1335 | <code>                return scannedPdfNeedsOcrReadResult({</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1336 | <code>                    target,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1337 | <code>                    stat,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1338 | <code>                    bytesRead,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1339 | <code>                    fileKind,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1340 | <code>                    failure: documentParseFailure</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1341 | <code>                });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1342 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1343 | <code>            const structuredQuery = /Excel&#124;XLSX&#124;spreadsheet/i.test(fileKind)</code> | 声明局部标识符 `structuredQuery`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1344 | <code>                ? 'artifact_tools xlsx workbook cell values fill colors formulas merged ranges'</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1345 | <code>                : `${fileKind} extract text tables content artifact_query document_search`;</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1346 | <code>            return createErrorResult(</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1347 | <code>                'binary_file',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1348 | <code>                `read 只能读取普通文本文件；${target} 看起来是 ${fileKind}。请使用专用解析工具、tool_search，或 read_binary 读取原始字节，不要把二进制内容当文本上下文。`,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1349 | <code>                {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1350 | <code>                    path: target,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1351 | <code>                    size: stat.size,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1352 | <code>                    sizeText: formatBytes(stat.size),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1353 | <code>                    bytesSampled: bytesRead,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1354 | <code>                    fileKind,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1355 | <code>                    suggestedNext: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1356 | <code>                        tool: 'tool_search',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1357 | <code>                        query: structuredQuery</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1358 | <code>                    },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1359 | <code>                    ...(documentParseError ? { documentParseError } : {}),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1360 | <code>                    override: 'If raw text decoding is truly intended, call read with forceText=true.'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1361 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1362 | <code>            );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1363 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1364 | <code>        const text = chunk.toString(args.encoding &#124;&#124; 'utf8');</code> | 声明局部标识符 `text`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1365 | <code>        const shouldCreateTextArtifact = (</code> | 声明局部标识符 `shouldCreateTextArtifact`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1366 | <code>            args.asArtifact === true &#124;&#124;</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1367 | <code>            args.artifact === true &#124;&#124;</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1368 | <code>            (stat.size &gt; maxBytes &amp;&amp; isTextArtifactExtension(target))</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1369 | <code>        ) &amp;&amp; stat.size &lt;= maxArtifactBytes &amp;&amp; runtime.contextArtifactStore?.createArtifact;</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1370 | <code>        if (shouldCreateTextArtifact) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1371 | <code>            const fullText = stat.size === bytesRead</code> | 声明局部标识符 `fullText`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1372 | <code>                ? text</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1373 | <code>                : await fsp.readFile(target, args.encoding &#124;&#124; 'utf8');</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1374 | <code>            const record = await createManagedTextArtifact({</code> | 声明局部标识符 `record`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1375 | <code>                target,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1376 | <code>                stat,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1377 | <code>                text: fullText,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1378 | <code>                encoding: args.encoding &#124;&#124; 'utf8',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1379 | <code>                runtime,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1380 | <code>                context,</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1381 | <code>                args</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1382 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1383 | <code>            if (record?.id) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1384 | <code>                const preview = buildArtifactPreview(fullText, normalizeNumber(args.previewChars &#124;&#124; args.preview_chars, 4000, 1000, 20000));</code> | 声明局部标识符 `preview`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1385 | <code>                return artifactCreatedReadResult({</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1386 | <code>                    kind: 'text',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1387 | <code>                    record,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1388 | <code>                    target,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1389 | <code>                    stat,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1390 | <code>                    text: fullText,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1391 | <code>                    preview,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1392 | <code>                    actions: ['summary', 'text_schema', 'text_range', 'text_search', 'text_tail']</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1393 | <code>                });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1394 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1395 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1396 | <code>        return createTextResult(text, {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1397 | <code>            status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1398 | <code>            action: 'read',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1399 | <code>            path: target,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1400 | <code>            bytesRead,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1401 | <code>            truncated: stat.size &gt; maxBytes,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1402 | <code>            size: stat.size,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1403 | <code>            sizeText: formatBytes(stat.size)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1404 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1405 | <code>    } finally {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1406 | <code>        await handle.close();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1407 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1408 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1409 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1410 | <code>async function actionReadBinary(args, context, runtime) {</code> | 定义函数 `actionReadBinary`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1411 | <code>    const target = resolveTargetPath(args.path, runtime);</code> | 声明局部标识符 `target`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1412 | <code>    const guard = guardPath(target, 'read_binary', context, runtime);</code> | 声明局部标识符 `guard`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1413 | <code>    if (guard) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1414 | <code>        return guard;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1415 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1416 | <code>    const stat = await safeStat(target);</code> | 声明局部标识符 `stat`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1417 | <code>    if (!stat &#124;&#124; !stat.isFile()) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1418 | <code>        return createErrorResult('not_found', `文件不存在：${target}`, { path: target });</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1419 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1420 | <code>    const offset = normalizeNumber(args.offset, 0, 0, Number.MAX_SAFE_INTEGER);</code> | 声明局部标识符 `offset`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1421 | <code>    const length = normalizeNumber(args.length &#124;&#124; args.maxBytes, DEFAULT_BINARY_CHUNK_BYTES, 1, 8 * 1024 * 1024);</code> | 声明局部标识符 `length`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1422 | <code>    const handle = await fsp.open(target, 'r');</code> | 声明局部标识符 `handle`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1423 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 1424 | <code>        const buffer = Buffer.alloc(Math.min(length, Math.max(0, stat.size - offset)));</code> | 声明局部标识符 `buffer`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1425 | <code>        const { bytesRead } = await handle.read(buffer, 0, buffer.length, offset);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1426 | <code>        const nextOffset = offset + bytesRead;</code> | 声明局部标识符 `nextOffset`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1427 | <code>        const details = {</code> | 声明局部标识符 `details`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1428 | <code>            status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1429 | <code>            action: 'read_binary',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1430 | <code>            path: target,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1431 | <code>            offset,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1432 | <code>            bytesRead,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1433 | <code>            nextOffset,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1434 | <code>            eof: nextOffset &gt;= stat.size,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1435 | <code>            size: stat.size,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1436 | <code>            sizeText: formatBytes(stat.size),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1437 | <code>            encoding: 'base64',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1438 | <code>            dataBase64: buffer.subarray(0, bytesRead).toString('base64')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1439 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1440 | <code>        return createTextResult(JSON.stringify(details, null, 2), details);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1441 | <code>    } finally {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1442 | <code>        await handle.close();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1443 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1444 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1445 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1446 | <code>function approvalRequired(action, args, context) {</code> | 定义函数 `approvalRequired`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1447 | <code>    if (!WRITE_ACTIONS.has(action)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1448 | <code>        return null;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1449 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1450 | <code>    if (args.dryRun === true) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1451 | <code>        return null;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1452 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1453 | <code>    if (context.approved === true &#124;&#124; args.approved === true) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1454 | <code>        return null;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1455 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1456 | <code>    return createErrorResult('needs_approval', `${action} 会修改电脑状态，需要用户确认：context.approved=true。`, {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1457 | <code>        action,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1458 | <code>        approval: 'required'</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 1459 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1460 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1461 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1462 | <code>async function actionWrite(args, context, runtime, append = false) {</code> | 定义函数 `actionWrite`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1463 | <code>    const action = append ? 'append' : 'write';</code> | 声明局部标识符 `action`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1464 | <code>    const target = resolveTargetPath(args.path, runtime);</code> | 声明局部标识符 `target`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1465 | <code>    const guard = guardPath(target, action, context, runtime) &#124;&#124; approvalRequired(action, args, context);</code> | 声明局部标识符 `guard`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1466 | <code>    if (guard) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1467 | <code>        return guard;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1468 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1469 | <code>    if (args.dryRun === true) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1470 | <code>        return createTextResult(JSON.stringify({ action, dryRun: true, path: target }, null, 2), {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1471 | <code>            status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1472 | <code>            action,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1473 | <code>            dryRun: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1474 | <code>            path: target</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1475 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1476 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1477 | <code>    await fsp.mkdir(path.dirname(target), { recursive: true });</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1478 | <code>    const content = typeof args.content === 'string' ? args.content : '';</code> | 声明局部标识符 `content`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1479 | <code>    const rollback = await createRollbackSnapshot(action, [target], args, runtime);</code> | 声明局部标识符 `rollback`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1480 | <code>    if (append) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1481 | <code>        await fsp.appendFile(target, content, args.encoding &#124;&#124; 'utf8');</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1482 | <code>    } else {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1483 | <code>        await fsp.writeFile(target, content, args.encoding &#124;&#124; 'utf8');</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1484 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1485 | <code>    return createTextResult(`${action} completed: ${target}`, {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1486 | <code>        status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1487 | <code>        action,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1488 | <code>        path: target,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1489 | <code>        bytes: Buffer.byteLength(content, args.encoding &#124;&#124; 'utf8'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1490 | <code>        rollback</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1491 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1492 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1493 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1494 | <code>async function actionWriteBinary(args, context, runtime) {</code> | 定义函数 `actionWriteBinary`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1495 | <code>    const target = resolveTargetPath(args.path, runtime);</code> | 声明局部标识符 `target`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1496 | <code>    const guard = guardPath(target, 'write_binary', context, runtime) &#124;&#124; approvalRequired('write_binary', args, context);</code> | 声明局部标识符 `guard`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1497 | <code>    if (guard) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1498 | <code>        return guard;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1499 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1500 | <code>    const dataBase64 = normalizeString(args.dataBase64 &#124;&#124; args.contentBase64 &#124;&#124; args.base64);</code> | 声明局部标识符 `dataBase64`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1501 | <code>    if (!dataBase64) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1502 | <code>        return createErrorResult('needs_config', 'write_binary 需要 dataBase64/contentBase64 参数。', { path: target });</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1503 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1504 | <code>    let buffer = null;</code> | 声明局部标识符 `buffer`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1505 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 1506 | <code>        buffer = Buffer.from(dataBase64, 'base64');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1507 | <code>    } catch {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1508 | <code>        return createErrorResult('needs_config', 'write_binary 的 dataBase64 不是合法 base64。', { path: target });</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1509 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1510 | <code>    if (args.dryRun === true) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1511 | <code>        return createTextResult(JSON.stringify({ action: 'write_binary', dryRun: true, path: target, bytes: buffer.length }, null, 2), {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1512 | <code>            status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1513 | <code>            action: 'write_binary',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1514 | <code>            dryRun: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1515 | <code>            path: target,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1516 | <code>            bytes: buffer.length</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1517 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1518 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1519 | <code>    await fsp.mkdir(path.dirname(target), { recursive: true });</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1520 | <code>    const rollback = await createRollbackSnapshot('write_binary', [target], args, runtime);</code> | 声明局部标识符 `rollback`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1521 | <code>    const mode = normalizeString(args.mode, args.append === true ? 'append' : 'overwrite').toLowerCase();</code> | 声明局部标识符 `mode`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1522 | <code>    if (mode === 'append') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1523 | <code>        await fsp.appendFile(target, buffer);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1524 | <code>    } else if (Number.isFinite(Number(args.offset))) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1525 | <code>        const handle = await fsp.open(target, 'a+');</code> | 声明局部标识符 `handle`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1526 | <code>        try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 1527 | <code>            await handle.write(buffer, 0, buffer.length, Number(args.offset));</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1528 | <code>        } finally {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1529 | <code>            await handle.close();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1530 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1531 | <code>    } else {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1532 | <code>        await fsp.writeFile(target, buffer);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1533 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1534 | <code>    return createTextResult(`write_binary completed: ${target}`, {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1535 | <code>        status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1536 | <code>        action: 'write_binary',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1537 | <code>        path: target,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1538 | <code>        bytes: buffer.length,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1539 | <code>        rollback</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1540 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1541 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1542 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1543 | <code>async function actionMkdir(args, context, runtime) {</code> | 定义函数 `actionMkdir`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1544 | <code>    const target = resolveTargetPath(args.path &#124;&#124; args.dir, runtime);</code> | 声明局部标识符 `target`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1545 | <code>    const guard = guardPath(target, 'mkdir', context, runtime) &#124;&#124; approvalRequired('mkdir', args, context);</code> | 声明局部标识符 `guard`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1546 | <code>    if (guard) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1547 | <code>        return guard;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1548 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1549 | <code>    if (args.dryRun === true) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1550 | <code>        return createTextResult(JSON.stringify({ action: 'mkdir', dryRun: true, path: target }, null, 2), {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1551 | <code>            status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1552 | <code>            action: 'mkdir',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1553 | <code>            dryRun: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1554 | <code>            path: target</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1555 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1556 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1557 | <code>    const rollback = await createRollbackSnapshot('mkdir', [target], args, runtime);</code> | 声明局部标识符 `rollback`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1558 | <code>    await fsp.mkdir(target, { recursive: args.recursive !== false });</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1559 | <code>    return createTextResult(`mkdir completed: ${target}`, {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1560 | <code>        status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1561 | <code>        action: 'mkdir',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1562 | <code>        path: target,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1563 | <code>        rollback</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1564 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1565 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1566 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1567 | <code>async function copyRecursive(source, target) {</code> | 定义函数 `copyRecursive`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1568 | <code>    const stat = await fsp.lstat(source);</code> | 声明局部标识符 `stat`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1569 | <code>    if (stat.isDirectory()) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1570 | <code>        await fsp.mkdir(target, { recursive: true });</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1571 | <code>        const entries = await fsp.readdir(source);</code> | 声明局部标识符 `entries`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1572 | <code>        for (const entry of entries) {</code> | 声明局部标识符 `entry`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1573 | <code>            await copyRecursive(path.join(source, entry), path.join(target, entry));</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1574 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1575 | <code>    } else {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1576 | <code>        await fsp.mkdir(path.dirname(target), { recursive: true });</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1577 | <code>        await fsp.copyFile(source, target);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1578 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1579 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1580 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1581 | <code>async function actionCopyMove(args, context, runtime, move = false) {</code> | 定义函数 `actionCopyMove`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1582 | <code>    const action = move ? 'move' : 'copy';</code> | 声明局部标识符 `action`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1583 | <code>    const source = resolveTargetPath(args.source &#124;&#124; args.from &#124;&#124; args.path, runtime);</code> | 声明局部标识符 `source`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1584 | <code>    const target = resolveTargetPath(args.target &#124;&#124; args.to &#124;&#124; args.destination, runtime);</code> | 声明局部标识符 `target`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1585 | <code>    const guard =</code> | 声明局部标识符 `guard`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1586 | <code>        guardPath(source, 'read', context, runtime) &#124;&#124;</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1587 | <code>        guardPath(target, action, context, runtime) &#124;&#124;</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1588 | <code>        approvalRequired(action, args, context);</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 1589 | <code>    if (guard) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1590 | <code>        return guard;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1591 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1592 | <code>    if (args.dryRun === true) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1593 | <code>        return createTextResult(JSON.stringify({ action, dryRun: true, source, target }, null, 2), {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1594 | <code>            status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1595 | <code>            action,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1596 | <code>            dryRun: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1597 | <code>            source,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1598 | <code>            target</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1599 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1600 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1601 | <code>    if (move) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1602 | <code>        const rollback = await createRollbackSnapshot(action, [source, target], args, runtime);</code> | 声明局部标识符 `rollback`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1603 | <code>        await fsp.mkdir(path.dirname(target), { recursive: true });</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1604 | <code>        await fsp.rename(source, target);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1605 | <code>        return createTextResult(`${action} completed: ${source} -&gt; ${target}`, {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1606 | <code>            status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1607 | <code>            action,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1608 | <code>            source,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1609 | <code>            target,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1610 | <code>            rollback</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1611 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1612 | <code>    } else {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1613 | <code>        const rollback = await createRollbackSnapshot(action, [target], args, runtime);</code> | 声明局部标识符 `rollback`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1614 | <code>        await copyRecursive(source, target);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1615 | <code>        return createTextResult(`${action} completed: ${source} -&gt; ${target}`, {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1616 | <code>            status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1617 | <code>            action,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1618 | <code>            source,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1619 | <code>            target,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1620 | <code>            rollback</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1621 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1622 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1623 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1624 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1625 | <code>async function uniquePath(targetPath) {</code> | 定义函数 `uniquePath`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1626 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 1627 | <code>        await fsp.access(targetPath);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1628 | <code>    } catch {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1629 | <code>        return targetPath;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1630 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1631 | <code>    const dir = path.dirname(targetPath);</code> | 声明局部标识符 `dir`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1632 | <code>    const ext = path.extname(targetPath);</code> | 声明局部标识符 `ext`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1633 | <code>    const base = path.basename(targetPath, ext);</code> | 声明局部标识符 `base`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1634 | <code>    for (let index = 1; index &lt;= 9999; index += 1) {</code> | 声明局部标识符 `index`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1635 | <code>        const candidate = path.join(dir, `${base} (${index})${ext}`);</code> | 声明局部标识符 `candidate`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1636 | <code>        try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 1637 | <code>            await fsp.access(candidate);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1638 | <code>        } catch {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1639 | <code>            return candidate;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1640 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1641 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1642 | <code>    throw new Error(`无法创建唯一目标路径：${targetPath}`);</code> | 抛出错误：拒绝继续无效路径，并把明确失败原因交给上层处理。 |
| 1643 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1644 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1645 | <code>async function actionDelete(args, context, runtime) {</code> | 定义函数 `actionDelete`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1646 | <code>    const target = resolveTargetPath(args.path &#124;&#124; args.target, runtime);</code> | 声明局部标识符 `target`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1647 | <code>    const action = normalizeBoolean(args.trash, true) &#124;&#124; args.action === 'trash' ? 'trash' : 'delete';</code> | 声明局部标识符 `action`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1648 | <code>    const guard = guardPath(target, 'delete', context, runtime) &#124;&#124; approvalRequired('delete', args, context);</code> | 声明局部标识符 `guard`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1649 | <code>    if (guard) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1650 | <code>        return guard;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1651 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1652 | <code>    if (args.dryRun === true) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1653 | <code>        return createTextResult(JSON.stringify({ action, dryRun: true, path: target }, null, 2), {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1654 | <code>            status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1655 | <code>            action,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1656 | <code>            dryRun: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1657 | <code>            path: target</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1658 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1659 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1660 | <code>    if (action === 'trash') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1661 | <code>        const quarantineRoot = resolveTargetPath(</code> | 声明局部标识符 `quarantineRoot`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1662 | <code>            args.trashDir &#124;&#124; path.join(runtime.workspaceRoot &#124;&#124; runtime.workspaceDir &#124;&#124; process.cwd(), 'tmp', 'ailis-computer-trash'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1663 | <code>            runtime</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1664 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1665 | <code>        const trashGuard = guardPath(quarantineRoot, 'mkdir', context, runtime);</code> | 声明局部标识符 `trashGuard`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1666 | <code>        if (trashGuard) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1667 | <code>            return trashGuard;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1668 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1669 | <code>        const destination = await uniquePath(path.join(quarantineRoot, path.basename(target)));</code> | 声明局部标识符 `destination`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1670 | <code>        const rollback = await createRollbackSnapshot('trash', [target, destination], args, runtime);</code> | 声明局部标识符 `rollback`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1671 | <code>        await fsp.mkdir(path.dirname(destination), { recursive: true });</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1672 | <code>        await fsp.rename(target, destination);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1673 | <code>        return createTextResult(`moved to trash: ${destination}`, {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1674 | <code>            status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1675 | <code>            action: 'trash',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1676 | <code>            path: target,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1677 | <code>            destination,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1678 | <code>            rollback</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1679 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1680 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1681 | <code>    if (!(args.allowPermanentDelete === true &amp;&amp; args.dangerous === true)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1682 | <code>        return createErrorResult('blocked', '永久删除需要 allowPermanentDelete=true 和 dangerous=true。默认请使用 trash/quarantine。', {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1683 | <code>            path: target</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1684 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1685 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1686 | <code>    const rollback = await createRollbackSnapshot('delete', [target], args, runtime);</code> | 声明局部标识符 `rollback`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1687 | <code>    await fsp.rm(target, { recursive: args.recursive === true, force: args.force === true });</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1688 | <code>    return createTextResult(`deleted: ${target}`, {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1689 | <code>        status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1690 | <code>        action: 'delete',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1691 | <code>        path: target,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1692 | <code>        rollback</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1693 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1694 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1695 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1696 | <code>async function actionSearch(args, context, runtime) {</code> | 定义函数 `actionSearch`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1697 | <code>    const root = resolveTargetPath(args.path &#124;&#124; args.dir &#124;&#124; '.', runtime);</code> | 声明局部标识符 `root`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1698 | <code>    const guard = guardPath(root, 'search', context, runtime);</code> | 声明局部标识符 `guard`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1699 | <code>    if (guard) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1700 | <code>        return guard;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1701 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1702 | <code>    const namePattern = normalizeString(args.name &#124;&#124; args.glob &#124;&#124; args.pattern);</code> | 声明局部标识符 `namePattern`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1703 | <code>    const contains = normalizeString(args.contains &#124;&#124; args.text);</code> | 声明局部标识符 `contains`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1704 | <code>    const limit = normalizeNumber(args.limit, DEFAULT_SEARCH_LIMIT, 1, 5000);</code> | 声明局部标识符 `limit`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1705 | <code>    const maxDepth = normalizeNumber(args.maxDepth, 6, 0, 20);</code> | 声明局部标识符 `maxDepth`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1706 | <code>    const results = [];</code> | 声明局部标识符 `results`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1707 | <code>    const errors = [];</code> | 声明局部标识符 `errors`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1708 | <code>    const nameRegex = namePattern</code> | 声明局部标识符 `nameRegex`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1709 | <code>        ? new RegExp(namePattern.replace(/[.+^${}()&#124;[\]\\]/g, '\\$&amp;').replace(/\*/g, '.*'), 'i')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1710 | <code>        : null;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1711 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1712 | <code>    async function visit(current, depth) {</code> | 定义函数 `visit`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1713 | <code>        if (results.length &gt;= limit) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1714 | <code>            return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1715 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1716 | <code>        const stat = await safeStat(current);</code> | 声明局部标识符 `stat`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1717 | <code>        if (!stat &#124;&#124; stat.isSymbolicLink()) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1718 | <code>            return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1719 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1720 | <code>        const base = path.basename(current);</code> | 声明局部标识符 `base`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1721 | <code>        let matched = !nameRegex &#124;&#124; nameRegex.test(base);</code> | 声明局部标识符 `matched`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1722 | <code>        if (matched &amp;&amp; contains &amp;&amp; stat.isFile()) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1723 | <code>            try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 1724 | <code>                const sample = await fsp.readFile(current, 'utf8');</code> | 声明局部标识符 `sample`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1725 | <code>                matched = sample.includes(contains);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1726 | <code>            } catch {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1727 | <code>                matched = false;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1728 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1729 | <code>        } else if (contains &amp;&amp; stat.isDirectory()) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1730 | <code>            matched = false;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1731 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1732 | <code>        if (matched) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1733 | <code>            results.push({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1734 | <code>                path: current,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1735 | <code>                relativePath: path.relative(root, current) &#124;&#124; '.',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1736 | <code>                type: stat.isDirectory() ? 'directory' : stat.isFile() ? 'file' : 'other',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1737 | <code>                size: stat.isFile() ? stat.size : null,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1738 | <code>                sizeText: stat.isFile() ? formatBytes(stat.size) : ''</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1739 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1740 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1741 | <code>        if (stat.isDirectory() &amp;&amp; depth &lt; maxDepth) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1742 | <code>            let entries = [];</code> | 声明局部标识符 `entries`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1743 | <code>            try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 1744 | <code>                entries = await fsp.readdir(current);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1745 | <code>            } catch (error) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1746 | <code>                errors.push({ path: current, error: error.message &#124;&#124; String(error) });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1747 | <code>                return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1748 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1749 | <code>            for (const entry of entries) {</code> | 声明局部标识符 `entry`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1750 | <code>                await visit(path.join(current, entry), depth + 1);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1751 | <code>                if (results.length &gt;= limit) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1752 | <code>                    break;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1753 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1754 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1755 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1756 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1757 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1758 | <code>    await visit(root, 0);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1759 | <code>    return createTextResult(JSON.stringify({ action: 'search', root, results, errors }, null, 2), {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1760 | <code>        status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1761 | <code>        action: 'search',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1762 | <code>        root,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1763 | <code>        count: results.length,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1764 | <code>        results,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1765 | <code>        errors</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1766 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1767 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1768 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1769 | <code>async function actionHash(args, context, runtime) {</code> | 定义函数 `actionHash`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1770 | <code>    const target = resolveTargetPath(args.path, runtime);</code> | 声明局部标识符 `target`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1771 | <code>    const guard = guardPath(target, 'hash', context, runtime);</code> | 声明局部标识符 `guard`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1772 | <code>    if (guard) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1773 | <code>        return guard;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1774 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1775 | <code>    const algorithm = normalizeString(args.algorithm, 'sha256');</code> | 声明局部标识符 `algorithm`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1776 | <code>    const hash = crypto.createHash(algorithm);</code> | 声明局部标识符 `hash`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1777 | <code>    await new Promise((resolve, reject) =&gt; {</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1778 | <code>        const stream = fs.createReadStream(target);</code> | 声明局部标识符 `stream`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1779 | <code>        stream.on('data', (chunk) =&gt; hash.update(chunk));</code> | 注册事件处理：当用户操作、生命周期或运行时事件发生时调用相应逻辑。 |
| 1780 | <code>        stream.on('error', reject);</code> | 注册事件处理：当用户操作、生命周期或运行时事件发生时调用相应逻辑。 |
| 1781 | <code>        stream.on('end', resolve);</code> | 注册事件处理：当用户操作、生命周期或运行时事件发生时调用相应逻辑。 |
| 1782 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1783 | <code>    const digest = hash.digest('hex');</code> | 声明局部标识符 `digest`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1784 | <code>    return createTextResult(digest, {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1785 | <code>        status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1786 | <code>        action: 'hash',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1787 | <code>        path: target,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1788 | <code>        algorithm,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1789 | <code>        digest</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1790 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1791 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1792 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1793 | <code>async function directorySize(target, args) {</code> | 定义函数 `directorySize`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1794 | <code>    const maxDepth = normalizeNumber(args.maxDepth, 8, 0, 30);</code> | 声明局部标识符 `maxDepth`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1795 | <code>    let total = 0;</code> | 声明局部标识符 `total`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1796 | <code>    let files = 0;</code> | 声明局部标识符 `files`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1797 | <code>    let dirs = 0;</code> | 声明局部标识符 `dirs`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1798 | <code>    async function visit(current, depth) {</code> | 定义函数 `visit`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1799 | <code>        const stat = await safeStat(current);</code> | 声明局部标识符 `stat`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1800 | <code>        if (!stat &#124;&#124; stat.isSymbolicLink()) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1801 | <code>            return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1802 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1803 | <code>        if (stat.isFile()) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1804 | <code>            total += stat.size;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1805 | <code>            files += 1;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1806 | <code>            return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1807 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1808 | <code>        if (stat.isDirectory()) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1809 | <code>            dirs += 1;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1810 | <code>            if (depth &gt;= maxDepth) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1811 | <code>                return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1812 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1813 | <code>            const entries = await fsp.readdir(current).catch(() =&gt; []);</code> | 声明局部标识符 `entries`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1814 | <code>            for (const entry of entries) {</code> | 声明局部标识符 `entry`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1815 | <code>                await visit(path.join(current, entry), depth + 1);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1816 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1817 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1818 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1819 | <code>    await visit(target, 0);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1820 | <code>    return { total, files, dirs };</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1821 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1822 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1823 | <code>async function actionDu(args, context, runtime) {</code> | 定义函数 `actionDu`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1824 | <code>    const target = resolveTargetPath(args.path &#124;&#124; args.dir &#124;&#124; '.', runtime);</code> | 声明局部标识符 `target`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1825 | <code>    const guard = guardPath(target, 'du', context, runtime);</code> | 声明局部标识符 `guard`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1826 | <code>    if (guard) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1827 | <code>        return guard;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1828 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1829 | <code>    const result = await directorySize(target, args);</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1830 | <code>    return createTextResult(JSON.stringify({ action: 'du', path: target, ...result, sizeText: formatBytes(result.total) }, null, 2), {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1831 | <code>        status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1832 | <code>        action: 'du',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1833 | <code>        path: target,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1834 | <code>        size: result.total,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1835 | <code>        sizeText: formatBytes(result.total),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1836 | <code>        files: result.files,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1837 | <code>        dirs: result.dirs</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1838 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1839 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1840 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1841 | <code>async function actionAclGet(args, context, runtime) {</code> | 定义函数 `actionAclGet`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1842 | <code>    const target = resolveTargetPath(args.path, runtime);</code> | 声明局部标识符 `target`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1843 | <code>    const guard = guardPath(target, 'acl_get', context, runtime);</code> | 声明局部标识符 `guard`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1844 | <code>    if (guard) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1845 | <code>        return guard;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1846 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1847 | <code>    const stat = await safeStat(target);</code> | 声明局部标识符 `stat`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1848 | <code>    if (!stat) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1849 | <code>        return createErrorResult('not_found', `路径不存在：${target}`, { path: target });</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1850 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1851 | <code>    const platformAdapter = getRuntimePlatform(runtime);</code> | 声明局部标识符 `platformAdapter`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1852 | <code>    const aclCommand = platformAdapter.aclReadCommand(target);</code> | 声明局部标识符 `aclCommand`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1853 | <code>    const result = await runExecFile(aclCommand.command, aclCommand.args);</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1854 | <code>    if (!result.ok) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1855 | <code>        return createErrorResult('error', result.stderr &#124;&#124; result.error &#124;&#124; '读取 ACL 失败。', {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1856 | <code>            action: 'acl_get',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1857 | <code>            path: target,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1858 | <code>            exitCode: result.exitCode</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1859 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1860 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1861 | <code>    return createTextResult(result.stdout, {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1862 | <code>        status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1863 | <code>        action: 'acl_get',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1864 | <code>        path: target,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1865 | <code>        platform: platformAdapter.getStatus(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1866 | <code>        stdout: result.stdout</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1867 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1868 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1869 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1870 | <code>async function actionAclSet(args, context, runtime) {</code> | 定义函数 `actionAclSet`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1871 | <code>    const target = resolveTargetPath(args.path, runtime);</code> | 声明局部标识符 `target`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1872 | <code>    const guard = guardPath(target, 'acl_set', context, runtime) &#124;&#124; approvalRequired('acl_set', args, context);</code> | 声明局部标识符 `guard`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1873 | <code>    if (guard) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1874 | <code>        return guard;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1875 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1876 | <code>    const platformAdapter = getRuntimePlatform(runtime);</code> | 声明局部标识符 `platformAdapter`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1877 | <code>    const icaclsArgs = Array.isArray(args.icaclsArgs)</code> | 声明局部标识符 `icaclsArgs`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1878 | <code>        ? args.icaclsArgs.map((entry) =&gt; normalizeString(entry)).filter(Boolean)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1879 | <code>        : [];</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1880 | <code>    const aclCommand = platformAdapter.aclSetCommand(target, icaclsArgs);</code> | 声明局部标识符 `aclCommand`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1881 | <code>    if (!aclCommand.supported) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1882 | <code>        return createErrorResult('not_supported', 'acl_set 当前只实现了 Windows icacls 安全封装。', {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1883 | <code>            action: 'acl_set',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1884 | <code>            platform: platformAdapter.getStatus(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1885 | <code>            reason: aclCommand.reason</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1886 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1887 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1888 | <code>    if (!icaclsArgs.length) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1889 | <code>        return createErrorResult('needs_config', 'acl_set 需要 icaclsArgs，例如 ["/grant", "User:(R)"]。', {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1890 | <code>            action: 'acl_set',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1891 | <code>            path: target</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1892 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1893 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1894 | <code>    if (args.dryRun === true) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1895 | <code>        return createTextResult(JSON.stringify({ action: 'acl_set', dryRun: true, path: target, icaclsArgs }, null, 2), {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1896 | <code>            status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1897 | <code>            action: 'acl_set',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1898 | <code>            dryRun: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1899 | <code>            path: target,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1900 | <code>            icaclsArgs</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1901 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1902 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1903 | <code>    const before = await actionAclGet({ path: target }, context, runtime);</code> | 声明局部标识符 `before`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1904 | <code>    const rollback = await createRollbackSnapshot('acl_set', [target], args, runtime);</code> | 声明局部标识符 `rollback`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1905 | <code>    const result = await runExecFile(aclCommand.command, aclCommand.args);</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1906 | <code>    if (!result.ok) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1907 | <code>        return createErrorResult('error', result.stderr &#124;&#124; result.error &#124;&#124; '设置 ACL 失败。', {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1908 | <code>            action: 'acl_set',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1909 | <code>            path: target,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1910 | <code>            exitCode: result.exitCode,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1911 | <code>            before: before.details?.stdout &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1912 | <code>            rollback</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1913 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1914 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1915 | <code>    return createTextResult(result.stdout, {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1916 | <code>        status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1917 | <code>        action: 'acl_set',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1918 | <code>        path: target,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1919 | <code>        stdout: result.stdout,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1920 | <code>        before: before.details?.stdout &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1921 | <code>        rollback</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1922 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1923 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1924 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1925 | <code>async function actionRollbackList(args, context, runtime) {</code> | 定义函数 `actionRollbackList`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1926 | <code>    const guard = guardPath(getRollbackRoot(runtime), 'rollback_list', context, runtime);</code> | 声明局部标识符 `guard`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1927 | <code>    if (guard) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1928 | <code>        return guard;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1929 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1930 | <code>    const limit = normalizeNumber(args.limit, DEFAULT_ROLLBACK_LIMIT, 1, 1000);</code> | 声明局部标识符 `limit`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1931 | <code>    const entries = (await readRollbackJournal(runtime)).slice(-limit).reverse();</code> | 声明局部标识符 `entries`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1932 | <code>    return createTextResult(JSON.stringify({ action: 'rollback_list', count: entries.length, entries }, null, 2), {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1933 | <code>        status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1934 | <code>        action: 'rollback_list',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1935 | <code>        count: entries.length,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1936 | <code>        entries</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1937 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1938 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1939 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1940 | <code>async function actionRollbackRestore(args, context, runtime) {</code> | 定义函数 `actionRollbackRestore`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1941 | <code>    const id = normalizeString(args.id &#124;&#124; args.rollbackId);</code> | 声明局部标识符 `id`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1942 | <code>    if (!id) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1943 | <code>        return createErrorResult('needs_config', 'rollback_restore 需要 id/rollbackId 参数。');</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1944 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1945 | <code>    const approval = approvalRequired('rollback_restore', args, context);</code> | 声明局部标识符 `approval`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1946 | <code>    if (approval) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1947 | <code>        return approval;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1948 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1949 | <code>    const entries = await readRollbackJournal(runtime);</code> | 声明局部标识符 `entries`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1950 | <code>    const entry = entries.find((candidate) =&gt; candidate.id === id);</code> | 声明局部标识符 `entry`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1951 | <code>    if (!entry) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1952 | <code>        return createErrorResult('not_found', `没有找到 rollback：${id}`, { id });</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1953 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1954 | <code>    const restored = [];</code> | 声明局部标识符 `restored`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1955 | <code>    for (const snapshot of entry.snapshots &#124;&#124; []) {</code> | 声明局部标识符 `snapshot`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1956 | <code>        const target = resolveTargetPath(snapshot.path, runtime);</code> | 声明局部标识符 `target`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1957 | <code>        const guard = guardPath(target, 'write', context, runtime);</code> | 声明局部标识符 `guard`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1958 | <code>        if (guard) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1959 | <code>            return guard;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1960 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1961 | <code>        if (args.dryRun === true) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1962 | <code>            restored.push({ path: target, dryRun: true, existed: snapshot.existed });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1963 | <code>            continue;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1964 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1965 | <code>        if (!snapshot.existed) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1966 | <code>            await removeIfExists(target);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1967 | <code>            restored.push({ path: target, restored: 'removed_new_path' });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1968 | <code>            continue;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1969 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1970 | <code>        if (!snapshot.snapshotPath &#124;&#124; snapshot.skipped) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1971 | <code>            restored.push({ path: target, skipped: true, reason: snapshot.reason &#124;&#124; 'snapshot_missing' });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1972 | <code>            continue;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1973 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1974 | <code>        await removeIfExists(target);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1975 | <code>        await copyRecursive(snapshot.snapshotPath, target);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1976 | <code>        restored.push({ path: target, restored: true, type: snapshot.type });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1977 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1978 | <code>    return createTextResult(JSON.stringify({ action: 'rollback_restore', id, restored }, null, 2), {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1979 | <code>        status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1980 | <code>        action: 'rollback_restore',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1981 | <code>        id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1982 | <code>        restored</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1983 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1984 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1985 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1986 | <code>function commandNeedsApproval(args, context) {</code> | 定义函数 `commandNeedsApproval`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1987 | <code>    if (context.approved === true &#124;&#124; args.approved === true) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1988 | <code>        return null;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1989 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1990 | <code>    if (args.dryRun === true) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1991 | <code>        return null;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1992 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1993 | <code>    return createErrorResult('needs_approval', '命令行执行需要用户确认：context.approved=true。', {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1994 | <code>        action: args.action &#124;&#124; 'exec',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1995 | <code>        command: args.command,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 1996 | <code>        approval: 'required'</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 1997 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1998 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1999 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2000 | <code>function resolveWorkdir(args, context, runtime) {</code> | 定义函数 `resolveWorkdir`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2001 | <code>    return resolveTargetPath(args.workdir &#124;&#124; args.cwd &#124;&#124; runtime.workspaceDir &#124;&#124; runtime.workspaceRoot &#124;&#124; '.', runtime);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2002 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2003 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2004 | <code>function appendBounded(buffer, chunk, maxBytes = DEFAULT_PROCESS_BUFFER_BYTES) {</code> | 定义函数 `appendBounded`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2005 | <code>    const text = Buffer.isBuffer(chunk) ? chunk.toString('utf8') : String(chunk);</code> | 声明局部标识符 `text`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2006 | <code>    const merged = buffer + text;</code> | 声明局部标识符 `merged`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2007 | <code>    if (Buffer.byteLength(merged, 'utf8') &lt;= maxBytes) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2008 | <code>        return merged;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2009 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2010 | <code>    return merged.slice(Math.max(0, merged.length - maxBytes));</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2011 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2012 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2013 | <code>function estimateTokenCount(text = '') {</code> | 定义函数 `estimateTokenCount`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2014 | <code>    return Math.ceil(String(text).length / 4);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2015 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2016 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2017 | <code>function truncateByApproxTokens(text = '', maxTokens = DEFAULT_EXEC_MAX_OUTPUT_TOKENS) {</code> | 定义函数 `truncateByApproxTokens`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2018 | <code>    const source = String(text &#124;&#124; '');</code> | 声明局部标识符 `source`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2019 | <code>    const limit = normalizeNumber(maxTokens, DEFAULT_EXEC_MAX_OUTPUT_TOKENS, 256, 100000);</code> | 声明局部标识符 `limit`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2020 | <code>    const maxChars = limit * 4;</code> | 声明局部标识符 `maxChars`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2021 | <code>    if (source.length &lt;= maxChars) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2022 | <code>        return source;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2023 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2024 | <code>    return `${source.slice(0, Math.max(0, maxChars - 160))}\n...[truncated: original_token_count=${estimateTokenCount(source)}, max_output_tokens=${limit}]`;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2025 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2026 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2027 | <code>function hasShellNewline(command = '') {</code> | 定义函数 `hasShellNewline`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2028 | <code>    return /\r&#124;\n/.test(String(command &#124;&#124; ''));</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2029 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2030 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2031 | <code>function buildCommandDiagnostics({ command = '', args = [], platformAdapter = null } = {}) {</code> | 定义函数 `buildCommandDiagnostics`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2032 | <code>    const diagnostics = {</code> | 声明局部标识符 `diagnostics`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2033 | <code>        shellString: !normalizeCommandArgs(args).length,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2034 | <code>        containsNewline: hasShellNewline(command),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2035 | <code>        platform: platformAdapter?.getStatus ? platformAdapter.getStatus() : null,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2036 | <code>        warnings: []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2037 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2038 | <code>    return diagnostics;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2039 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2040 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2041 | <code>function annotateExecDetails(details = {}, { command = '', args = [], platformAdapter = null } = {}) {</code> | 定义函数 `annotateExecDetails`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2042 | <code>    const stdout = typeof details.stdout === 'string' ? details.stdout : '';</code> | 声明局部标识符 `stdout`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2043 | <code>    const stderr = typeof details.stderr === 'string' ? details.stderr : '';</code> | 声明局部标识符 `stderr`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2044 | <code>    const outputEmpty = stdout.length === 0 &amp;&amp; stderr.length === 0;</code> | 声明局部标识符 `outputEmpty`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2045 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2046 | <code>        ...details,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2047 | <code>        outputEmpty,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2048 | <code>        evidence: {</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2049 | <code>            stdoutBytes: Buffer.byteLength(stdout, 'utf8'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2050 | <code>            stderrBytes: Buffer.byteLength(stderr, 'utf8'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2051 | <code>            hasStdout: stdout.length &gt; 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2052 | <code>            hasStderr: stderr.length &gt; 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2053 | <code>            exitCode: details.exitCode ?? details.exit_code ?? null</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2054 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2055 | <code>        commandDiagnostics: buildCommandDiagnostics({ command, args, platformAdapter })</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2056 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2057 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2058 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2059 | <code>function formatExecContent(details = {}) {</code> | 定义函数 `formatExecContent`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2060 | <code>    if (details.outputStore?.outputId) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2061 | <code>        const outputStore = details.outputStore;</code> | 声明局部标识符 `outputStore`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2062 | <code>        const previewTruncated = outputStore.previewTruncated === true;</code> | 声明局部标识符 `previewTruncated`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2063 | <code>        const previewBytes = Buffer.byteLength(String(outputStore.preview &#124;&#124; ''), 'utf8');</code> | 声明局部标识符 `previewBytes`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2064 | <code>        const omittedApproxTokens = previewTruncated</code> | 声明局部标识符 `omittedApproxTokens`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2065 | <code>            ? Math.max(1, Math.ceil(Math.max(0, Number(outputStore.bytes &#124;&#124; 0) - previewBytes) / 4))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2066 | <code>            : 0;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2067 | <code>        const lines = [</code> | 声明局部标识符 `lines`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2068 | <code>            `exitCode=${details.exitCode ?? details.exit_code}`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2069 | <code>            `outputId=${outputStore.outputId}`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2070 | <code>            `bytes=${outputStore.bytes ?? 0} lines=${outputStore.lineCount ?? 0} stdoutBytes=${outputStore.stdoutBytes ?? 0} stderrBytes=${outputStore.stderrBytes ?? 0}`</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2071 | <code>        ];</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2072 | <code>        if (previewTruncated) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2073 | <code>            lines.push(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2074 | <code>                `&lt;truncated omitted_approx_tokens="${omittedApproxTokens}" /&gt;`,</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 2075 | <code>                'fullOutput=stored_for_agent_lab',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2076 | <code>                `outputRead={"outputId":"${outputStore.outputId}"}`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2077 | <code>                `outputTail={"outputId":"${outputStore.outputId}"}`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2078 | <code>                `outputSearch={"outputId":"${outputStore.outputId}","query":"&lt;text&gt;"}`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2079 | <code>                'modelHint=Visible stdout/stderr is a preview with omitted bytes. Use tool_search query "exec output outputId search tail read" to load output_search/output_tail/output_read, then inspect only the needed slice. Do not rerun the command just to recover omitted output.'</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2080 | <code>            );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2081 | <code>        } else {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2082 | <code>            lines.push('modelHint=Visible stdout/stderr below is complete for this command.');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2083 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2084 | <code>        if (outputStore.preview) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2085 | <code>            lines.push(previewTruncated ? '--- stdout/stderr preview ---' : '--- stdout/stderr complete ---', outputStore.preview);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2086 | <code>        } else {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2087 | <code>            lines.push('stdout=&lt;empty&gt;', 'stderr=&lt;empty&gt;');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2088 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2089 | <code>        const warnings = Array.isArray(details.commandDiagnostics?.warnings)</code> | 声明局部标识符 `warnings`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2090 | <code>            ? details.commandDiagnostics.warnings</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2091 | <code>            : [];</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2092 | <code>        if (warnings.length) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2093 | <code>            lines.push(`diagnostic=${warnings.map((warning) =&gt; warning.code).join(',')}`);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2094 | <code>            lines.push(warnings.map((warning) =&gt; warning.message).join(' '));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2095 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2096 | <code>        return lines.join('\n');</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2097 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2098 | <code>    if (details.stdout) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2099 | <code>        return details.stdout;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2100 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2101 | <code>    if (details.stderr) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2102 | <code>        return details.stderr;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2103 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2104 | <code>    const lines = [</code> | 声明局部标识符 `lines`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2105 | <code>        `exitCode=${details.exitCode ?? details.exit_code}`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2106 | <code>        'stdout=&lt;empty&gt;',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2107 | <code>        'stderr=&lt;empty&gt;'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2108 | <code>    ];</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2109 | <code>    const warnings = Array.isArray(details.commandDiagnostics?.warnings)</code> | 声明局部标识符 `warnings`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2110 | <code>        ? details.commandDiagnostics.warnings</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2111 | <code>        : [];</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2112 | <code>    if (warnings.length) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2113 | <code>        lines.push(`diagnostic=${warnings.map((warning) =&gt; warning.code).join(',')}`);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2114 | <code>        lines.push(warnings.map((warning) =&gt; warning.message).join(' '));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2115 | <code>    } else {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2116 | <code>        lines.push('diagnostic=no stdout/stderr was produced; if output files were expected, verify them with stat/read instead of assuming they exist.');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2117 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2118 | <code>    return lines.join('\n');</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2119 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2120 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2121 | <code>function collectSessionText(record = {}) {</code> | 定义函数 `collectSessionText`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2122 | <code>    return [record.stdout &#124;&#124; '', record.stderr &#124;&#124; ''].filter(Boolean).join(record.stdout &amp;&amp; record.stderr ? '\n' : '');</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2123 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2124 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2125 | <code>function collectPtyText(record = {}) {</code> | 定义函数 `collectPtyText`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2126 | <code>    return record.output &#124;&#124; '';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2127 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2128 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2129 | <code>async function createExecOutputCapture({ args = {}, context = {}, runtime = {}, action = 'exec', command = '', commandArgs = [], workdir = '' } = {}) {</code> | 定义函数 `createExecOutputCapture`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2130 | <code>    const store = runtime?.outputStore &#124;&#124; context?.outputStore;</code> | 声明局部标识符 `store`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2131 | <code>    if (!store?.createCapture &#124;&#124; args.storeOutput === false &#124;&#124; args.captureOutput === false) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2132 | <code>        return null;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2133 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2134 | <code>    const callId = normalizeString(context.callId &#124;&#124; args.callId &#124;&#124; args.outputId, randomUUID());</code> | 声明局部标识符 `callId`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2135 | <code>    const previewChars = normalizeNumber(</code> | 声明局部标识符 `previewChars`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2136 | <code>        args.previewChars &#124;&#124; args.outputPreviewChars &#124;&#124; args.maxPreviewChars,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2137 | <code>        6000,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2138 | <code>        256,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2139 | <code>        100000</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2140 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2141 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 2142 | <code>        return await store.createCapture({</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2143 | <code>            outputId: args.outputId &#124;&#124; callId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2144 | <code>            callId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2145 | <code>            previewChars,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2146 | <code>            metadata: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2147 | <code>                action,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2148 | <code>                tool: COMPUTER_TOOL_ID,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2149 | <code>                command,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2150 | <code>                args: commandArgs,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2151 | <code>                workdir,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2152 | <code>                runId: normalizeString(context.runId),</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2153 | <code>                sessionId: normalizeString(context.sessionId &#124;&#124; context.sessionKey),</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2154 | <code>                iteration: Number.isFinite(Number(context.iteration)) ? Number(context.iteration) : null</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2155 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2156 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2157 | <code>    } catch {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2158 | <code>        return null;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2159 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2160 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2161 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2162 | <code>function summarizeExecOutputCapture(outputCapture) {</code> | 定义函数 `summarizeExecOutputCapture`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2163 | <code>    if (!outputCapture?.summary) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2164 | <code>        return null;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2165 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2166 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 2167 | <code>        return outputCapture.summary();</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2168 | <code>    } catch {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2169 | <code>        return null;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2170 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2171 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2172 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2173 | <code>async function finalizeExecOutputCapture(outputCapture, extra = {}) {</code> | 定义函数 `finalizeExecOutputCapture`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2174 | <code>    if (!outputCapture?.finalize) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2175 | <code>        return null;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2176 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2177 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 2178 | <code>        return await outputCapture.finalize(extra);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2179 | <code>    } catch (error) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2180 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2181 | <code>            status: 'store_error',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2182 | <code>            error: error?.message &#124;&#124; String(error)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2183 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2184 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2185 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2186 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2187 | <code>async function summarizeRecordOutputStore(record = {}, extra = {}) {</code> | 定义函数 `summarizeRecordOutputStore`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2188 | <code>    if (record.outputStore) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2189 | <code>        return record.outputStore;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2190 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2191 | <code>    if (!record.outputCapture) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2192 | <code>        return null;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2193 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2194 | <code>    if (record.status &amp;&amp; record.status !== 'running') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2195 | <code>        record.outputStore = await finalizeExecOutputCapture(record.outputCapture, {</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2196 | <code>            status: record.status === 'exited' &amp;&amp; record.exitCode === 0 ? 'completed' : record.status,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2197 | <code>            exitCode: record.exitCode,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2198 | <code>            signal: record.signal,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2199 | <code>            ...extra</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2200 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2201 | <code>        return record.outputStore;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2202 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2203 | <code>    return summarizeExecOutputCapture(record.outputCapture);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2204 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2205 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2206 | <code>function attachOutputStoreDetails(details = {}, outputStore = null) {</code> | 定义函数 `attachOutputStoreDetails`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2207 | <code>    if (!outputStore?.outputId) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2208 | <code>        return details;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2209 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2210 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2211 | <code>        ...details,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2212 | <code>        outputId: outputStore.outputId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2213 | <code>        outputPreview: outputStore.preview &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2214 | <code>        outputPreviewTruncated: outputStore.previewTruncated === true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2215 | <code>        outputBytes: outputStore.bytes ?? outputStore.combinedBytes ?? null,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2216 | <code>        outputLineCount: outputStore.lineCount ?? null,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2217 | <code>        outputStore</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2218 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2219 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2220 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2221 | <code>class ComputerRuntime {</code> | 定义类 `ComputerRuntime`，把相关状态与行为收拢为一个运行时对象。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2222 | <code>    constructor(options = {}) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2223 | <code>        this.sessions = new Map();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2224 | <code>        this.ptySessions = new Map();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2225 | <code>        this.watchers = new Map();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2226 | <code>        this.workspaceRoot = options.workspaceRoot &#124;&#124; process.cwd();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2227 | <code>        this.platformAdapter = createAILISPlatformAdapter(options.platformAdapter &#124;&#124; options.platform &#124;&#124; {});</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2228 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2229 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2230 | <code>    createWatchRecord(target, args = {}) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2231 | <code>        const id = randomUUID();</code> | 声明局部标识符 `id`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2232 | <code>        const recursive = normalizeBoolean(args.recursive, false);</code> | 声明局部标识符 `recursive`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2233 | <code>        const maxEvents = normalizeNumber(args.maxEvents, DEFAULT_WATCH_BUFFER_EVENTS, 10, 5000);</code> | 声明局部标识符 `maxEvents`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2234 | <code>        const record = {</code> | 声明局部标识符 `record`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2235 | <code>            id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2236 | <code>            path: target,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2237 | <code>            recursive,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2238 | <code>            maxEvents,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2239 | <code>            startedAt: Date.now(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2240 | <code>            updatedAt: Date.now(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2241 | <code>            status: 'running',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2242 | <code>            events: [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2243 | <code>            watcher: null,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2244 | <code>            error: ''</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2245 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2246 | <code>        const pushEvent = (event) =&gt; {</code> | 声明局部标识符 `pushEvent`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2247 | <code>            record.events.push({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2248 | <code>                seq: record.events.length + 1,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2249 | <code>                at: new Date().toISOString(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2250 | <code>                ...event</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2251 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2252 | <code>            if (record.events.length &gt; record.maxEvents) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2253 | <code>                record.events.splice(0, record.events.length - record.maxEvents);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2254 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2255 | <code>            record.updatedAt = Date.now();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2256 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2257 | <code>        try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 2258 | <code>            record.watcher = fs.watch(target, { recursive }, (eventType, filename) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2259 | <code>                pushEvent({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2260 | <code>                    eventType,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2261 | <code>                    filename: filename ? String(filename) : '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2262 | <code>                    path: filename ? path.join(target, String(filename)) : target</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2263 | <code>                });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2264 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2265 | <code>            record.watcher.on('error', (error) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2266 | <code>                record.status = 'error';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2267 | <code>                record.error = error?.message &#124;&#124; String(error);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2268 | <code>                pushEvent({ eventType: 'error', error: record.error, path: target });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2269 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2270 | <code>        } catch (error) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2271 | <code>            record.status = 'error';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2272 | <code>            record.error = error?.message &#124;&#124; String(error);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2273 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2274 | <code>        this.watchers.set(id, record);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2275 | <code>        return record;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2276 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2277 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2278 | <code>    publicWatch(record, includeEvents = true) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2279 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2280 | <code>            id: record.id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2281 | <code>            path: record.path,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2282 | <code>            recursive: record.recursive,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2283 | <code>            status: record.status,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2284 | <code>            startedAt: new Date(record.startedAt).toISOString(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2285 | <code>            updatedAt: new Date(record.updatedAt).toISOString(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2286 | <code>            error: record.error,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2287 | <code>            ...(includeEvents ? { events: [...record.events] } : { eventCount: record.events.length })</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2288 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2289 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2290 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2291 | <code>    watchStart(args, context, runtime) {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2292 | <code>        const target = resolveTargetPath(args.path &#124;&#124; args.dir &#124;&#124; '.', runtime);</code> | 声明局部标识符 `target`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2293 | <code>        const guard = guardPath(target, 'watch_start', context, runtime);</code> | 声明局部标识符 `guard`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2294 | <code>        if (guard) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2295 | <code>            return guard;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2296 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2297 | <code>        const record = this.createWatchRecord(target, args);</code> | 声明局部标识符 `record`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2298 | <code>        if (record.status === 'error') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2299 | <code>            return createErrorResult('error', record.error &#124;&#124; '文件监听启动失败。', {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2300 | <code>                action: 'watch_start',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2301 | <code>                watcher: this.publicWatch(record, false)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2302 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2303 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2304 | <code>        return createTextResult(JSON.stringify(this.publicWatch(record), null, 2), {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2305 | <code>            status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2306 | <code>            action: 'watch_start',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2307 | <code>            watcher: this.publicWatch(record)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2308 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2309 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2310 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2311 | <code>    watchList() {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2312 | <code>        const watchers = [...this.watchers.values()].map((record) =&gt; this.publicWatch(record, false));</code> | 声明局部标识符 `watchers`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2313 | <code>        return createTextResult(JSON.stringify({ action: 'watch_list', watchers }, null, 2), {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2314 | <code>            status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2315 | <code>            action: 'watch_list',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2316 | <code>            watchers</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2317 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2318 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2319 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2320 | <code>    watchPoll(args) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2321 | <code>        const id = normalizeString(args.watchId &#124;&#124; args.id);</code> | 声明局部标识符 `id`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2322 | <code>        const record = this.watchers.get(id);</code> | 声明局部标识符 `record`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2323 | <code>        if (!record) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2324 | <code>            return createErrorResult('not_found', `没有找到文件监听：${id}`, { watchId: id });</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2325 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2326 | <code>        const sinceSeq = normalizeNumber(args.sinceSeq &#124;&#124; args.afterSeq, 0, 0, Number.MAX_SAFE_INTEGER);</code> | 声明局部标识符 `sinceSeq`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2327 | <code>        const events = record.events.filter((event) =&gt; Number(event.seq &#124;&#124; 0) &gt; sinceSeq);</code> | 声明局部标识符 `events`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2328 | <code>        if (args.clear === true) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2329 | <code>            record.events = [];</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2330 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2331 | <code>        return createTextResult(JSON.stringify({ action: 'watch_poll', watcher: this.publicWatch(record, false), events }, null, 2), {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2332 | <code>            status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2333 | <code>            action: 'watch_poll',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2334 | <code>            watcher: this.publicWatch(record, false),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2335 | <code>            events</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2336 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2337 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2338 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2339 | <code>    watchStop(args, context) {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2340 | <code>        const id = normalizeString(args.watchId &#124;&#124; args.id);</code> | 声明局部标识符 `id`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2341 | <code>        const record = this.watchers.get(id);</code> | 声明局部标识符 `record`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2342 | <code>        if (!record) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2343 | <code>            return createErrorResult('not_found', `没有找到文件监听：${id}`, { watchId: id });</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2344 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2345 | <code>        const approval = approvalRequired('watch_stop', args, context);</code> | 声明局部标识符 `approval`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2346 | <code>        if (approval) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2347 | <code>            return approval;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2348 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2349 | <code>        record.watcher?.close();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2350 | <code>        record.status = 'stopped';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2351 | <code>        record.updatedAt = Date.now();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2352 | <code>        this.watchers.delete(id);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2353 | <code>        return createTextResult(`watch stopped: ${id}`, {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2354 | <code>            status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2355 | <code>            action: 'watch_stop',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2356 | <code>            watchId: id</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2357 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2358 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2359 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2360 | <code>    createSessionRecord({ command, workdir, child, timeoutMs, outputCapture = null }) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2361 | <code>        const id = randomUUID();</code> | 声明局部标识符 `id`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2362 | <code>        const record = {</code> | 声明局部标识符 `record`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2363 | <code>            id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2364 | <code>            command,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2365 | <code>            workdir,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2366 | <code>            pid: child.pid,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2367 | <code>            startedAt: Date.now(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2368 | <code>            updatedAt: Date.now(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2369 | <code>            status: 'running',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2370 | <code>            exitCode: null,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2371 | <code>            signal: null,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2372 | <code>            stdout: '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2373 | <code>            stderr: '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2374 | <code>            child,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2375 | <code>            timeout: null,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2376 | <code>            outputCapture,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2377 | <code>            outputStore: summarizeExecOutputCapture(outputCapture)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2378 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2379 | <code>        child.stdout?.on('data', (chunk) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2380 | <code>            record.stdout = appendBounded(record.stdout, chunk);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2381 | <code>            record.outputCapture?.append('stdout', chunk);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2382 | <code>            record.updatedAt = Date.now();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2383 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2384 | <code>        child.stderr?.on('data', (chunk) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2385 | <code>            record.stderr = appendBounded(record.stderr, chunk);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2386 | <code>            record.outputCapture?.append('stderr', chunk);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2387 | <code>            record.updatedAt = Date.now();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2388 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2389 | <code>        child.on('exit', (code, signal) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2390 | <code>            record.status = 'exited';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2391 | <code>            record.exitCode = code;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2392 | <code>            record.signal = signal;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2393 | <code>            record.updatedAt = Date.now();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2394 | <code>            if (record.timeout) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2395 | <code>                clearTimeout(record.timeout);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2396 | <code>                record.timeout = null;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2397 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2398 | <code>            finalizeExecOutputCapture(record.outputCapture, {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2399 | <code>                status: code === 0 ? 'completed' : 'error',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2400 | <code>                exitCode: code,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2401 | <code>                signal</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2402 | <code>            }).then((summary) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2403 | <code>                if (summary) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2404 | <code>                    record.outputStore = summary;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2405 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2406 | <code>            }).catch(() =&gt; {});</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2407 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2408 | <code>        child.on('error', (error) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2409 | <code>            record.status = 'error';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2410 | <code>            record.stderr = appendBounded(record.stderr, `\n${error.message &#124;&#124; error}`);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2411 | <code>            record.outputCapture?.append('stderr', `\n${error.message &#124;&#124; error}`);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2412 | <code>            record.updatedAt = Date.now();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2413 | <code>            finalizeExecOutputCapture(record.outputCapture, {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2414 | <code>                status: 'error',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2415 | <code>                error: error?.message &#124;&#124; String(error)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2416 | <code>            }).then((summary) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2417 | <code>                if (summary) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2418 | <code>                    record.outputStore = summary;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2419 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2420 | <code>            }).catch(() =&gt; {});</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2421 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2422 | <code>        record.timeout = setTimeout(() =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2423 | <code>            if (record.status === 'running') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2424 | <code>                record.status = 'timeout';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2425 | <code>                child.kill('SIGTERM');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2426 | <code>                finalizeExecOutputCapture(record.outputCapture, {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2427 | <code>                    status: 'timeout'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2428 | <code>                }).then((summary) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2429 | <code>                    if (summary) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2430 | <code>                        record.outputStore = summary;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2431 | <code>                    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2432 | <code>                }).catch(() =&gt; {});</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2433 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2434 | <code>        }, timeoutMs);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2435 | <code>        this.sessions.set(id, record);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2436 | <code>        return record;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2437 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2438 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2439 | <code>    async waitForProcessSnapshot(record, yieldTimeMs = DEFAULT_EXEC_YIELD_TIME_MS) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2440 | <code>        const waitMs = normalizeNumber(yieldTimeMs, DEFAULT_EXEC_YIELD_TIME_MS, MIN_EXEC_YIELD_TIME_MS, MAX_EXEC_YIELD_TIME_MS);</code> | 声明局部标识符 `waitMs`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2441 | <code>        const deadline = Date.now() + waitMs;</code> | 声明局部标识符 `deadline`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2442 | <code>        let lastLength = Buffer.byteLength(collectSessionText(record), 'utf8');</code> | 声明局部标识符 `lastLength`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2443 | <code>        while (Date.now() &lt; deadline) {</code> | 循环控制：对集合、队列、重试次数或状态持续执行同一组逻辑。 |
| 2444 | <code>            if (record.status !== 'running') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2445 | <code>                break;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2446 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2447 | <code>            await new Promise((resolve) =&gt; setTimeout(resolve, 25));</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2448 | <code>            const nextLength = Buffer.byteLength(collectSessionText(record), 'utf8');</code> | 声明局部标识符 `nextLength`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2449 | <code>            if (nextLength !== lastLength) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2450 | <code>                lastLength = nextLength;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2451 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2452 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2453 | <code>        return this.buildUnifiedExecDetails(record, { yieldTimeMs: waitMs });</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2454 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2455 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2456 | <code>    async waitForPtySnapshot(record, yieldTimeMs = DEFAULT_EXEC_YIELD_TIME_MS) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2457 | <code>        const waitMs = normalizeNumber(yieldTimeMs, DEFAULT_EXEC_YIELD_TIME_MS, MIN_EXEC_YIELD_TIME_MS, MAX_EXEC_YIELD_TIME_MS);</code> | 声明局部标识符 `waitMs`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2458 | <code>        const deadline = Date.now() + waitMs;</code> | 声明局部标识符 `deadline`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2459 | <code>        while (Date.now() &lt; deadline) {</code> | 循环控制：对集合、队列、重试次数或状态持续执行同一组逻辑。 |
| 2460 | <code>            if (record.status !== 'running') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2461 | <code>                break;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2462 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2463 | <code>            await new Promise((resolve) =&gt; setTimeout(resolve, 25));</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2464 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2465 | <code>        return this.buildUnifiedPtyDetails(record, { yieldTimeMs: waitMs });</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2466 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2467 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2468 | <code>    buildUnifiedExecDetails(record, options = {}) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2469 | <code>        const outputText = collectSessionText(record);</code> | 声明局部标识符 `outputText`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2470 | <code>        const maxOutputTokens = normalizeNumber(options.maxOutputTokens &#124;&#124; options.max_output_tokens, DEFAULT_EXEC_MAX_OUTPUT_TOKENS, 256, 100000);</code> | 声明局部标识符 `maxOutputTokens`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2471 | <code>        const originalTokenCount = estimateTokenCount(outputText);</code> | 声明局部标识符 `originalTokenCount`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2472 | <code>        const output = truncateByApproxTokens(outputText, maxOutputTokens);</code> | 声明局部标识符 `output`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2473 | <code>        const running = record.status === 'running';</code> | 声明局部标识符 `running`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2474 | <code>        const outputStore = record.outputStore &#124;&#124; summarizeExecOutputCapture(record.outputCapture);</code> | 声明局部标识符 `outputStore`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2475 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2476 | <code>            status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2477 | <code>            action: options.action &#124;&#124; 'exec_command',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2478 | <code>            command: record.command,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2479 | <code>            workdir: record.workdir,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2480 | <code>            pid: record.pid,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2481 | <code>            session_id: running ? record.id : undefined,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2482 | <code>            sessionId: running ? record.id : undefined,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2483 | <code>            exit_code: running ? null : record.exitCode,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2484 | <code>            exitCode: running ? null : record.exitCode,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2485 | <code>            signal: record.signal,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2486 | <code>            process_status: record.status,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2487 | <code>            running,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2488 | <code>            chunk_id: randomUUID(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2489 | <code>            wall_time_seconds: Math.max(0, (Date.now() - record.startedAt) / 1000),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2490 | <code>            original_token_count: originalTokenCount,</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 2491 | <code>            max_output_tokens: maxOutputTokens,</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 2492 | <code>            output,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2493 | <code>            stdout: truncateByApproxTokens(record.stdout &#124;&#124; '', maxOutputTokens),</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 2494 | <code>            stderr: truncateByApproxTokens(record.stderr &#124;&#124; '', maxOutputTokens),</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 2495 | <code>            outputId: outputStore?.outputId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2496 | <code>            outputStore,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2497 | <code>            session: this.publicSession(record)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2498 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2499 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2500 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2501 | <code>    buildUnifiedPtyDetails(record, options = {}) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2502 | <code>        const outputText = collectPtyText(record);</code> | 声明局部标识符 `outputText`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2503 | <code>        const maxOutputTokens = normalizeNumber(options.maxOutputTokens &#124;&#124; options.max_output_tokens, DEFAULT_EXEC_MAX_OUTPUT_TOKENS, 256, 100000);</code> | 声明局部标识符 `maxOutputTokens`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2504 | <code>        const originalTokenCount = estimateTokenCount(outputText);</code> | 声明局部标识符 `originalTokenCount`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2505 | <code>        const output = truncateByApproxTokens(outputText, maxOutputTokens);</code> | 声明局部标识符 `output`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2506 | <code>        const running = record.status === 'running';</code> | 声明局部标识符 `running`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2507 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2508 | <code>            status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2509 | <code>            action: options.action &#124;&#124; 'exec_command',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2510 | <code>            command: record.command,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2511 | <code>            workdir: record.workdir,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2512 | <code>            pid: record.pid,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2513 | <code>            tty: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2514 | <code>            session_id: running ? record.id : undefined,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2515 | <code>            sessionId: running ? record.id : undefined,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2516 | <code>            exit_code: running ? null : record.exitCode,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2517 | <code>            exitCode: running ? null : record.exitCode,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2518 | <code>            signal: record.signal,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2519 | <code>            process_status: record.status,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2520 | <code>            running,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2521 | <code>            chunk_id: randomUUID(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2522 | <code>            wall_time_seconds: Math.max(0, (Date.now() - record.startedAt) / 1000),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2523 | <code>            original_token_count: originalTokenCount,</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 2524 | <code>            max_output_tokens: maxOutputTokens,</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 2525 | <code>            output,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2526 | <code>            stdout: output,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2527 | <code>            stderr: '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2528 | <code>            session: this.publicPty(record)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2529 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2530 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2531 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2532 | <code>    publicPty(record, includeOutput = true) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2533 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2534 | <code>            id: record.id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2535 | <code>            command: record.command,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2536 | <code>            executable: record.executable,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2537 | <code>            args: record.args,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2538 | <code>            workdir: record.workdir,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2539 | <code>            pid: record.pid,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2540 | <code>            status: record.status,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2541 | <code>            exitCode: record.exitCode,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2542 | <code>            signal: record.signal,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2543 | <code>            cols: record.cols,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2544 | <code>            rows: record.rows,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2545 | <code>            startedAt: new Date(record.startedAt).toISOString(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2546 | <code>            updatedAt: new Date(record.updatedAt).toISOString(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2547 | <code>            ...(includeOutput ? { output: record.output } : { outputBytes: Buffer.byteLength(record.output &#124;&#124; '', 'utf8') })</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2548 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2549 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2550 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2551 | <code>    async ptyStart(args, context, runtime) {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2552 | <code>        const ptyLoad = loadNodePty();</code> | 声明局部标识符 `ptyLoad`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2553 | <code>        if (!ptyLoad.ok) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2554 | <code>            return createErrorResult('not_available', 'PTY 需要 node-pty 原生模块可用；当前依赖未构建或加载失败。', {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2555 | <code>                action: 'pty_start',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2556 | <code>                package: 'node-pty',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2557 | <code>                error: ptyLoad.error,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2558 | <code>                fallback: '可先使用 computer.session_start/process_read/process_write；若要启用 PTY，需要本机允许 node-pty 构建。'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2559 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2560 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2561 | <code>        const command = normalizeString(args.command &#124;&#124; args.cmd);</code> | 声明局部标识符 `command`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2562 | <code>        const workdir = resolveWorkdir(args, context, runtime);</code> | 声明局部标识符 `workdir`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2563 | <code>        const guard = guardPath(workdir, 'read', context, runtime) &#124;&#124; commandNeedsApproval({ ...args, action: 'pty_start' }, context);</code> | 声明局部标识符 `guard`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2564 | <code>        if (guard) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2565 | <code>            return guard;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2566 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2567 | <code>        if (args.dryRun === true) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2568 | <code>            return createTextResult(JSON.stringify({ action: 'pty_start', dryRun: true, command, workdir }, null, 2), {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2569 | <code>                status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2570 | <code>                action: 'pty_start',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2571 | <code>                dryRun: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2572 | <code>                command,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2573 | <code>                workdir</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2574 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2575 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2576 | <code>        const cols = normalizeNumber(args.cols, 100, 20, 400);</code> | 声明局部标识符 `cols`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2577 | <code>        const rows = normalizeNumber(args.rows, 30, 5, 200);</code> | 声明局部标识符 `rows`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2578 | <code>        const ptySpec = getRuntimePlatform(runtime).ptySpawnOptions({</code> | 声明局部标识符 `ptySpec`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2579 | <code>            command,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2580 | <code>            executable: args.executable &#124;&#124; args.shell,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2581 | <code>            args: args.args,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2582 | <code>            cwd: workdir,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2583 | <code>            env: args.env,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2584 | <code>            term: normalizeString(args.term, 'xterm-256color'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2585 | <code>            cols,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2586 | <code>            rows,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2587 | <code>            useConpty: args.useConpty,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2588 | <code>            useConptyDll: args.useConptyDll</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2589 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2590 | <code>        const terminal = ptyLoad.pty.spawn(ptySpec.executable, ptySpec.args, ptySpec.options);</code> | 声明局部标识符 `terminal`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2591 | <code>        const record = {</code> | 声明局部标识符 `record`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2592 | <code>            id: randomUUID(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2593 | <code>            command,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2594 | <code>            executable: ptySpec.executable,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2595 | <code>            args: ptySpec.args,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2596 | <code>            workdir,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2597 | <code>            pid: terminal.pid,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2598 | <code>            status: 'running',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2599 | <code>            exitCode: null,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2600 | <code>            signal: null,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2601 | <code>            output: '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2602 | <code>            terminal,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2603 | <code>            cols,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2604 | <code>            rows,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2605 | <code>            startedAt: Date.now(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2606 | <code>            updatedAt: Date.now()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2607 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2608 | <code>        terminal.onData((chunk) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2609 | <code>            record.output = appendBounded(record.output, chunk, normalizeNumber(args.maxOutputBytes, DEFAULT_PROCESS_BUFFER_BYTES, 1024, 5 * 1024 * 1024));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2610 | <code>            record.updatedAt = Date.now();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2611 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2612 | <code>        terminal.onExit(({ exitCode, signal }) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2613 | <code>            record.status = 'exited';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2614 | <code>            record.exitCode = exitCode;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2615 | <code>            record.signal = signal;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2616 | <code>            record.updatedAt = Date.now();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2617 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2618 | <code>        this.ptySessions.set(record.id, record);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2619 | <code>        return createTextResult(JSON.stringify(this.publicPty(record), null, 2), {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2620 | <code>            status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2621 | <code>            action: 'pty_start',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2622 | <code>            session: this.publicPty(record)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2623 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2624 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2625 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2626 | <code>    ptyRead(args) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2627 | <code>        const id = normalizeString(args.sessionId &#124;&#124; args.ptyId &#124;&#124; args.id);</code> | 声明局部标识符 `id`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2628 | <code>        const record = this.ptySessions.get(id);</code> | 声明局部标识符 `record`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2629 | <code>        if (!record) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2630 | <code>            return createErrorResult('not_found', `没有找到 PTY 会话：${id}`, { sessionId: id });</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2631 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2632 | <code>        const session = this.publicPty(record);</code> | 声明局部标识符 `session`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2633 | <code>        if (args.clear === true) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2634 | <code>            record.output = '';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2635 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2636 | <code>        return createTextResult(JSON.stringify(session, null, 2), {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2637 | <code>            status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2638 | <code>            action: 'pty_read',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2639 | <code>            session</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2640 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2641 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2642 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2643 | <code>    ptyStatus() {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2644 | <code>        const sessions = [...this.ptySessions.values()].map((record) =&gt; this.publicPty(record, false));</code> | 声明局部标识符 `sessions`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2645 | <code>        const ptyLoad = loadNodePty();</code> | 声明局部标识符 `ptyLoad`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2646 | <code>        return createTextResult(JSON.stringify({ action: 'pty_status', available: ptyLoad.ok, sessions }, null, 2), {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2647 | <code>            status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2648 | <code>            action: 'pty_status',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2649 | <code>            available: ptyLoad.ok,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2650 | <code>            error: ptyLoad.ok ? '' : ptyLoad.error,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2651 | <code>            sessions</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2652 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2653 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2654 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2655 | <code>    ptyWrite(args, context) {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2656 | <code>        const id = normalizeString(args.sessionId &#124;&#124; args.ptyId &#124;&#124; args.id);</code> | 声明局部标识符 `id`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2657 | <code>        const input = typeof args.input === 'string' ? args.input : '';</code> | 声明局部标识符 `input`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2658 | <code>        const record = this.ptySessions.get(id);</code> | 声明局部标识符 `record`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2659 | <code>        if (!record) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2660 | <code>            return createErrorResult('not_found', `没有找到 PTY 会话：${id}`, { sessionId: id });</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2661 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2662 | <code>        const approval = approvalRequired('pty_write', args, context);</code> | 声明局部标识符 `approval`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2663 | <code>        if (approval) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2664 | <code>            return approval;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2665 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2666 | <code>        if (record.status !== 'running') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2667 | <code>            return createErrorResult('error', `PTY 会话不是 running：${record.status}`, { sessionId: id, status: record.status });</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2668 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2669 | <code>        record.terminal.write(input);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2670 | <code>        if (args.submit === true &#124;&#124; args.enter === true) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2671 | <code>            record.terminal.write(os.EOL);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2672 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2673 | <code>        record.updatedAt = Date.now();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2674 | <code>        return createTextResult('pty input written', {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2675 | <code>            status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2676 | <code>            action: 'pty_write',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2677 | <code>            sessionId: id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2678 | <code>            bytes: Buffer.byteLength(input)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2679 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2680 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2681 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2682 | <code>    ptyResize(args) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2683 | <code>        const id = normalizeString(args.sessionId &#124;&#124; args.ptyId &#124;&#124; args.id);</code> | 声明局部标识符 `id`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2684 | <code>        const record = this.ptySessions.get(id);</code> | 声明局部标识符 `record`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2685 | <code>        if (!record) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2686 | <code>            return createErrorResult('not_found', `没有找到 PTY 会话：${id}`, { sessionId: id });</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2687 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2688 | <code>        const cols = normalizeNumber(args.cols, record.cols, 20, 400);</code> | 声明局部标识符 `cols`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2689 | <code>        const rows = normalizeNumber(args.rows, record.rows, 5, 200);</code> | 声明局部标识符 `rows`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2690 | <code>        record.terminal.resize(cols, rows);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2691 | <code>        record.cols = cols;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2692 | <code>        record.rows = rows;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2693 | <code>        record.updatedAt = Date.now();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2694 | <code>        return createTextResult(`pty resized: ${id}`, {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2695 | <code>            status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2696 | <code>            action: 'pty_resize',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2697 | <code>            sessionId: id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2698 | <code>            cols,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2699 | <code>            rows</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2700 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2701 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2702 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2703 | <code>    ptyKill(args, context) {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2704 | <code>        const id = normalizeString(args.sessionId &#124;&#124; args.ptyId &#124;&#124; args.id);</code> | 声明局部标识符 `id`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2705 | <code>        const record = this.ptySessions.get(id);</code> | 声明局部标识符 `record`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2706 | <code>        if (!record) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2707 | <code>            return createErrorResult('not_found', `没有找到 PTY 会话：${id}`, { sessionId: id });</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2708 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2709 | <code>        const approval = approvalRequired('pty_kill', args, context);</code> | 声明局部标识符 `approval`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2710 | <code>        if (approval) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2711 | <code>            return approval;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2712 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2713 | <code>        try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 2714 | <code>            record.terminal.kill();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2715 | <code>        } catch {}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2716 | <code>        record.status = record.status === 'running' ? 'killed' : record.status;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2717 | <code>        record.updatedAt = Date.now();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2718 | <code>        return createTextResult(`pty killed: ${id}`, {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2719 | <code>            status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2720 | <code>            action: 'pty_kill',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2721 | <code>            sessionId: id</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2722 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2723 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2724 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2725 | <code>    listSessions() {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2726 | <code>        return [...this.sessions.values()].map((record) =&gt; this.publicSession(record, false));</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2727 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2728 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2729 | <code>    publicSession(record, includeOutput = true) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2730 | <code>        const outputStore = record.outputStore &#124;&#124; summarizeExecOutputCapture(record.outputCapture);</code> | 声明局部标识符 `outputStore`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2731 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2732 | <code>            id: record.id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2733 | <code>            command: record.command,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2734 | <code>            workdir: record.workdir,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2735 | <code>            pid: record.pid,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2736 | <code>            status: record.status,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2737 | <code>            exitCode: record.exitCode,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2738 | <code>            signal: record.signal,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2739 | <code>            startedAt: new Date(record.startedAt).toISOString(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2740 | <code>            updatedAt: new Date(record.updatedAt).toISOString(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2741 | <code>            ...(outputStore ? { outputId: outputStore.outputId, outputStore } : {}),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2742 | <code>            ...(includeOutput</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2743 | <code>                ? {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2744 | <code>                      stdout: record.stdout,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2745 | <code>                      stderr: record.stderr</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2746 | <code>                  }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2747 | <code>                : {})</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2748 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2749 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2750 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2751 | <code>    async exec(args, context, runtime) {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2752 | <code>        const command = normalizeString(args.command &#124;&#124; args.cmd);</code> | 声明局部标识符 `command`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2753 | <code>        if (!command) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2754 | <code>            return createErrorResult('needs_config', 'exec 需要 command 参数。');</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2755 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2756 | <code>        const commandArgs = normalizeCommandArgs(args.args &#124;&#124; args.arguments);</code> | 声明局部标识符 `commandArgs`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2757 | <code>        const commandForDisplay = commandArgs.length ? [command, ...commandArgs].join(' ') : command;</code> | 声明局部标识符 `commandForDisplay`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2758 | <code>        const workdir = resolveWorkdir(args, context, runtime);</code> | 声明局部标识符 `workdir`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2759 | <code>        const guard = guardPath(workdir, 'read', context, runtime) &#124;&#124; commandNeedsApproval({ ...args, action: 'exec', command: commandForDisplay }, context);</code> | 声明局部标识符 `guard`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2760 | <code>        if (guard) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2761 | <code>            return guard;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2762 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2763 | <code>        if (args.dryRun === true) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2764 | <code>            return createTextResult(JSON.stringify({ action: 'exec', dryRun: true, command, args: commandArgs, workdir }, null, 2), {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2765 | <code>                status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2766 | <code>                action: 'exec',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2767 | <code>                dryRun: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2768 | <code>                command,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2769 | <code>                args: commandArgs,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2770 | <code>                workdir</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2771 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2772 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2773 | <code>        const timeoutMs = normalizeNumber(args.timeoutMs &#124;&#124; args.timeout, DEFAULT_EXEC_TIMEOUT_MS, 1000, 10 * 60 * 1000);</code> | 声明局部标识符 `timeoutMs`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2774 | <code>        const maxOutputTokens = normalizeNumber(args.max_output_tokens &#124;&#124; args.maxOutputTokens, DEFAULT_EXEC_MAX_OUTPUT_TOKENS, 256, 100000);</code> | 声明局部标识符 `maxOutputTokens`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2775 | <code>        const startedAt = Date.now();</code> | 声明局部标识符 `startedAt`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2776 | <code>        const platformAdapter = getRuntimePlatform(runtime);</code> | 声明局部标识符 `platformAdapter`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2777 | <code>        const spawnSpec = platformAdapter.commandSpawnSpec</code> | 声明局部标识符 `spawnSpec`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2778 | <code>            ? platformAdapter.commandSpawnSpec(command, { args: commandArgs, cwd: workdir, env: args.env })</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2779 | <code>            : {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2780 | <code>                  supported: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2781 | <code>                  command,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2782 | <code>                  args: commandArgs,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2783 | <code>                  options: platformAdapter.shellSpawnOptions({ cwd: workdir, env: args.env })</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2784 | <code>              };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2785 | <code>        if (!spawnSpec.supported) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2786 | <code>            return createErrorResult('not_supported', spawnSpec.reason &#124;&#124; 'Command execution is not supported by this platform adapter.', {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2787 | <code>                action: 'exec',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2788 | <code>                command,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2789 | <code>                args: commandArgs,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2790 | <code>                workdir,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2791 | <code>                platform: platformAdapter.getStatus()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2792 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2793 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2794 | <code>        const outputCapture = await createExecOutputCapture({ args, context, runtime, action: 'exec', command, commandArgs, workdir });</code> | 声明局部标识符 `outputCapture`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2795 | <code>        let child;</code> | 声明局部标识符 `child`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2796 | <code>        try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 2797 | <code>            child = spawn(spawnSpec.command, spawnSpec.args &#124;&#124; [], spawnSpec.options &#124;&#124; platformAdapter.shellSpawnOptions({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2798 | <code>                cwd: workdir,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2799 | <code>                env: args.env</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2800 | <code>            }));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2801 | <code>        } catch (error) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2802 | <code>            const outputStore = await finalizeExecOutputCapture(outputCapture, {</code> | 声明局部标识符 `outputStore`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2803 | <code>                status: 'error',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2804 | <code>                error: error?.message &#124;&#124; String(error)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2805 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2806 | <code>            const details = attachOutputStoreDetails(annotateExecDetails({</code> | 声明局部标识符 `details`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2807 | <code>                status: 'error',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2808 | <code>                action: 'exec',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2809 | <code>                command,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2810 | <code>                args: commandArgs,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2811 | <code>                workdir,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2812 | <code>                exitCode: null,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2813 | <code>                stdout: '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2814 | <code>                stderr: error?.message &#124;&#124; String(error),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2815 | <code>                durationMs: Date.now() - startedAt</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2816 | <code>            }, { command, args: commandArgs, platformAdapter }), outputStore);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2817 | <code>            return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2818 | <code>                content: [{ type: 'text', text: formatExecContent(details) }],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2819 | <code>                isError: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2820 | <code>                details</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2821 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2822 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2823 | <code>        return await new Promise((resolve) =&gt; {</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2824 | <code>            let settled = false;</code> | 声明局部标识符 `settled`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2825 | <code>            let timedOut = false;</code> | 声明局部标识符 `timedOut`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2826 | <code>            let stdout = '';</code> | 声明局部标识符 `stdout`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2827 | <code>            let stderr = '';</code> | 声明局部标识符 `stderr`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2828 | <code>            const maxOutputBytes = normalizeNumber(args.maxOutputBytes, DEFAULT_PROCESS_BUFFER_BYTES, 1024, 5 * 1024 * 1024);</code> | 声明局部标识符 `maxOutputBytes`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2829 | <code>            let timer = null;</code> | 声明局部标识符 `timer`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2830 | <code>            const finish = async ({ status, exitCode = null, signal = null, error = '' } = {}) =&gt; {</code> | 声明局部标识符 `finish`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2831 | <code>                if (settled) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2832 | <code>                    return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2833 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2834 | <code>                settled = true;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2835 | <code>                if (timer) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2836 | <code>                    clearTimeout(timer);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2837 | <code>                    timer = null;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2838 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2839 | <code>                const outputStore = await finalizeExecOutputCapture(outputCapture, {</code> | 声明局部标识符 `outputStore`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2840 | <code>                    status,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2841 | <code>                    exitCode,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2842 | <code>                    signal,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2843 | <code>                    error,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2844 | <code>                    durationMs: Date.now() - startedAt</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2845 | <code>                });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2846 | <code>                const outputText = [stdout, stderr].filter(Boolean).join(stdout &amp;&amp; stderr ? '\n' : '');</code> | 声明局部标识符 `outputText`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2847 | <code>                const details = attachOutputStoreDetails(annotateExecDetails({</code> | 声明局部标识符 `details`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2848 | <code>                    status,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2849 | <code>                    action: 'exec',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2850 | <code>                    command,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2851 | <code>                    args: commandArgs,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2852 | <code>                    workdir,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2853 | <code>                    exitCode,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2854 | <code>                    signal,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2855 | <code>                    output: truncateByApproxTokens(outputText, maxOutputTokens),</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 2856 | <code>                    stdout: truncateByApproxTokens(stdout, maxOutputTokens),</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 2857 | <code>                    stderr: truncateByApproxTokens(stderr &#124;&#124; error, maxOutputTokens),</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 2858 | <code>                    durationMs: Date.now() - startedAt,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2859 | <code>                    error</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2860 | <code>                }, { command, args: commandArgs, platformAdapter }), outputStore);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2861 | <code>                resolve({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2862 | <code>                    content: [{ type: 'text', text: formatExecContent(details) }],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2863 | <code>                    isError: status !== 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2864 | <code>                    details</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2865 | <code>                });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2866 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2867 | <code>            timer = setTimeout(() =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2868 | <code>                timedOut = true;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2869 | <code>                platformAdapter.killProcessTree(child, 'SIGTERM').finally(() =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2870 | <code>                    finish({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2871 | <code>                        status: 'timeout',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2872 | <code>                        signal: 'SIGTERM',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2873 | <code>                        error: `命令超时：${command}`</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2874 | <code>                    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2875 | <code>                });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2876 | <code>            }, timeoutMs);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2877 | <code>            child.stdout?.on('data', (chunk) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2878 | <code>                stdout = appendBounded(stdout, chunk, maxOutputBytes);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2879 | <code>                outputCapture?.append('stdout', chunk);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2880 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2881 | <code>            child.stderr?.on('data', (chunk) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2882 | <code>                stderr = appendBounded(stderr, chunk, maxOutputBytes);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2883 | <code>                outputCapture?.append('stderr', chunk);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2884 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2885 | <code>            child.on('error', (error) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2886 | <code>                const message = error?.message &#124;&#124; String(error);</code> | 声明局部标识符 `message`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2887 | <code>                stderr = appendBounded(stderr, `\n${message}`, maxOutputBytes);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2888 | <code>                outputCapture?.append('stderr', `\n${message}`);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2889 | <code>                finish({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2890 | <code>                    status: 'error',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2891 | <code>                    error: message</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2892 | <code>                });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2893 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2894 | <code>            child.on('exit', (exitCode, signal) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2895 | <code>                finish({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2896 | <code>                    status: timedOut ? 'timeout' : exitCode === 0 ? 'completed' : 'error',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2897 | <code>                    exitCode,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2898 | <code>                    signal,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2899 | <code>                    error: timedOut ? `命令超时：${command}` : ''</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2900 | <code>                });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2901 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2902 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2903 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2904 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2905 | <code>    async execCommand(args, context, runtime) {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2906 | <code>        const command = normalizeString(args.cmd &#124;&#124; args.command);</code> | 声明局部标识符 `command`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2907 | <code>        if (!command) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2908 | <code>            return createErrorResult('needs_config', 'exec_command 需要 cmd 或 command 参数。');</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2909 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2910 | <code>        const commandArgs = normalizeCommandArgs(args.args &#124;&#124; args.arguments);</code> | 声明局部标识符 `commandArgs`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2911 | <code>        const commandForDisplay = commandArgs.length ? [command, ...commandArgs].join(' ') : command;</code> | 声明局部标识符 `commandForDisplay`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2912 | <code>        const workdir = resolveWorkdir(args, context, runtime);</code> | 声明局部标识符 `workdir`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2913 | <code>        const guard = guardPath(workdir, 'read', context, runtime) &#124;&#124; commandNeedsApproval({ ...args, action: 'exec_command', command: commandForDisplay }, context);</code> | 声明局部标识符 `guard`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2914 | <code>        if (guard) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2915 | <code>            return guard;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2916 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2917 | <code>        const yieldTimeMs = normalizeNumber(args.yield_time_ms &#124;&#124; args.yieldTimeMs, DEFAULT_EXEC_YIELD_TIME_MS, MIN_EXEC_YIELD_TIME_MS, MAX_EXEC_YIELD_TIME_MS);</code> | 声明局部标识符 `yieldTimeMs`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2918 | <code>        const maxOutputTokens = normalizeNumber(args.max_output_tokens &#124;&#124; args.maxOutputTokens, DEFAULT_EXEC_MAX_OUTPUT_TOKENS, 256, 100000);</code> | 声明局部标识符 `maxOutputTokens`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2919 | <code>        if (args.dryRun === true) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2920 | <code>            const details = {</code> | 声明局部标识符 `details`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2921 | <code>                status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2922 | <code>                action: 'exec_command',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2923 | <code>                dryRun: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2924 | <code>                command,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2925 | <code>                cmd: command,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2926 | <code>                args: commandArgs,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2927 | <code>                workdir,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2928 | <code>                yield_time_ms: yieldTimeMs,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2929 | <code>                max_output_tokens: maxOutputTokens</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 2930 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2931 | <code>            return createTextResult(JSON.stringify(details, null, 2), details);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2932 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2933 | <code>        if (normalizeBoolean(args.tty, false)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2934 | <code>            const ptyResult = await this.ptyStart({ ...args, command, action: 'pty_start' }, context, runtime);</code> | 声明局部标识符 `ptyResult`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2935 | <code>            if (ptyResult.isError) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2936 | <code>                return ptyResult;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2937 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2938 | <code>            const record = this.ptySessions.get(ptyResult.details?.session?.id);</code> | 声明局部标识符 `record`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2939 | <code>            if (!record) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2940 | <code>                return createErrorResult('session_not_found', 'exec_command PTY 会话创建后无法读取。', { action: 'exec_command' });</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2941 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2942 | <code>            const details = await this.waitForPtySnapshot(record, yieldTimeMs);</code> | 声明局部标识符 `details`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2943 | <code>            details.max_output_tokens = maxOutputTokens;</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 2944 | <code>            details.output = truncateByApproxTokens(details.output, maxOutputTokens);</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 2945 | <code>            details.stdout = details.output;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2946 | <code>            return createTextResult(details.output &#124;&#124; JSON.stringify(details, null, 2), details);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2947 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2948 | <code>        const timeoutMs = normalizeNumber(args.timeoutMs &#124;&#124; args.timeout, DEFAULT_SESSION_TIMEOUT_MS, 1000, 24 * 60 * 60 * 1000);</code> | 声明局部标识符 `timeoutMs`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2949 | <code>        const platformAdapter = getRuntimePlatform(runtime);</code> | 声明局部标识符 `platformAdapter`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2950 | <code>        const spawnSpec = platformAdapter.commandSpawnSpec</code> | 声明局部标识符 `spawnSpec`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2951 | <code>            ? platformAdapter.commandSpawnSpec(command, { args: commandArgs, cwd: workdir, env: args.env })</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2952 | <code>            : {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2953 | <code>                  supported: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2954 | <code>                  command,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2955 | <code>                  args: commandArgs,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2956 | <code>                  options: platformAdapter.shellSpawnOptions({ cwd: workdir, env: args.env })</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2957 | <code>              };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2958 | <code>        if (!spawnSpec.supported) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2959 | <code>            return createErrorResult('not_supported', spawnSpec.reason &#124;&#124; 'Command execution is not supported by this platform adapter.', {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2960 | <code>                action: 'exec_command',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2961 | <code>                command,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2962 | <code>                workdir,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2963 | <code>                platform: platformAdapter.getStatus()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2964 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2965 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2966 | <code>        const outputCapture = await createExecOutputCapture({ args, context, runtime, action: 'exec_command', command, commandArgs, workdir });</code> | 声明局部标识符 `outputCapture`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2967 | <code>        let child;</code> | 声明局部标识符 `child`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2968 | <code>        try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 2969 | <code>            child = spawn(spawnSpec.command, spawnSpec.args &#124;&#124; [], spawnSpec.options &#124;&#124; platformAdapter.shellSpawnOptions({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2970 | <code>                cwd: workdir,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2971 | <code>                env: args.env</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2972 | <code>            }));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2973 | <code>        } catch (error) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2974 | <code>            const outputStore = await finalizeExecOutputCapture(outputCapture, {</code> | 声明局部标识符 `outputStore`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2975 | <code>                status: 'error',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2976 | <code>                error: error?.message &#124;&#124; String(error)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2977 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2978 | <code>            const details = attachOutputStoreDetails(annotateExecDetails({</code> | 声明局部标识符 `details`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2979 | <code>                status: 'error',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2980 | <code>                action: 'exec_command',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2981 | <code>                command,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2982 | <code>                args: commandArgs,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2983 | <code>                workdir,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2984 | <code>                exitCode: null,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2985 | <code>                stdout: '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2986 | <code>                stderr: error?.message &#124;&#124; String(error)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2987 | <code>            }, { command, args: commandArgs, platformAdapter }), outputStore);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2988 | <code>            return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2989 | <code>                content: [{ type: 'text', text: formatExecContent(details) }],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2990 | <code>                isError: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2991 | <code>                details</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2992 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2993 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2994 | <code>        const record = this.createSessionRecord({ command, workdir, child, timeoutMs, outputCapture });</code> | 声明局部标识符 `record`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2995 | <code>        const details = await this.waitForProcessSnapshot(record, yieldTimeMs);</code> | 声明局部标识符 `details`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2996 | <code>        details.max_output_tokens = maxOutputTokens;</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 2997 | <code>        details.output = truncateByApproxTokens(collectSessionText(record), maxOutputTokens);</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 2998 | <code>        details.stdout = truncateByApproxTokens(record.stdout &#124;&#124; '', maxOutputTokens);</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 2999 | <code>        details.stderr = truncateByApproxTokens(record.stderr &#124;&#124; '', maxOutputTokens);</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 3000 | <code>        const outputStore = await summarizeRecordOutputStore(record, {</code> | 声明局部标识符 `outputStore`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3001 | <code>            durationMs: Math.max(0, Date.now() - record.startedAt)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3002 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3003 | <code>        const annotatedDetails = attachOutputStoreDetails(</code> | 声明局部标识符 `annotatedDetails`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3004 | <code>            annotateExecDetails(details, { command, args: commandArgs, platformAdapter }),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3005 | <code>            outputStore</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3006 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3007 | <code>        return createTextResult(formatExecContent(annotatedDetails), annotatedDetails);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3008 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3009 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3010 | <code>    async sessionStart(args, context, runtime) {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3011 | <code>        const command = normalizeString(args.command &#124;&#124; args.cmd);</code> | 声明局部标识符 `command`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3012 | <code>        if (!command) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3013 | <code>            return createErrorResult('needs_config', 'session_start 需要 command 参数。');</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3014 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3015 | <code>        const commandArgs = normalizeCommandArgs(args.args &#124;&#124; args.arguments);</code> | 声明局部标识符 `commandArgs`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3016 | <code>        const commandForDisplay = commandArgs.length ? [command, ...commandArgs].join(' ') : command;</code> | 声明局部标识符 `commandForDisplay`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3017 | <code>        const workdir = resolveWorkdir(args, context, runtime);</code> | 声明局部标识符 `workdir`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3018 | <code>        const guard = guardPath(workdir, 'read', context, runtime) &#124;&#124; commandNeedsApproval({ ...args, action: 'session_start', command: commandForDisplay }, context);</code> | 声明局部标识符 `guard`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3019 | <code>        if (guard) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3020 | <code>            return guard;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3021 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3022 | <code>        if (args.dryRun === true) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3023 | <code>            return createTextResult(JSON.stringify({ action: 'session_start', dryRun: true, command, args: commandArgs, workdir }, null, 2), {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3024 | <code>                status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3025 | <code>                action: 'session_start',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3026 | <code>                dryRun: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3027 | <code>                command,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3028 | <code>                args: commandArgs,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3029 | <code>                workdir</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3030 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3031 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3032 | <code>        const timeoutMs = normalizeNumber(args.timeoutMs &#124;&#124; args.timeout, DEFAULT_SESSION_TIMEOUT_MS, 1000, 24 * 60 * 60 * 1000);</code> | 声明局部标识符 `timeoutMs`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3033 | <code>        const platformAdapter = getRuntimePlatform(runtime);</code> | 声明局部标识符 `platformAdapter`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3034 | <code>        const spawnSpec = platformAdapter.commandSpawnSpec</code> | 声明局部标识符 `spawnSpec`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3035 | <code>            ? platformAdapter.commandSpawnSpec(command, { args: commandArgs, cwd: workdir, env: args.env })</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3036 | <code>            : {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3037 | <code>                  supported: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3038 | <code>                  command,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3039 | <code>                  args: commandArgs,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3040 | <code>                  options: platformAdapter.shellSpawnOptions({ cwd: workdir, env: args.env })</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3041 | <code>              };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3042 | <code>        if (!spawnSpec.supported) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3043 | <code>            return createErrorResult('not_supported', spawnSpec.reason &#124;&#124; 'Command execution is not supported by this platform adapter.', {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3044 | <code>                action: 'session_start',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3045 | <code>                command,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3046 | <code>                args: commandArgs,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3047 | <code>                workdir,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3048 | <code>                platform: platformAdapter.getStatus()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3049 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3050 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3051 | <code>        const outputCapture = await createExecOutputCapture({ args, context, runtime, action: 'session_start', command, commandArgs, workdir });</code> | 声明局部标识符 `outputCapture`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3052 | <code>        let child;</code> | 声明局部标识符 `child`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3053 | <code>        try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 3054 | <code>            child = spawn(spawnSpec.command, spawnSpec.args &#124;&#124; [], spawnSpec.options &#124;&#124; platformAdapter.shellSpawnOptions({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3055 | <code>                cwd: workdir,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3056 | <code>                env: args.env</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3057 | <code>            }));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3058 | <code>        } catch (error) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3059 | <code>            const outputStore = await finalizeExecOutputCapture(outputCapture, {</code> | 声明局部标识符 `outputStore`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3060 | <code>                status: 'error',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3061 | <code>                error: error?.message &#124;&#124; String(error)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3062 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3063 | <code>            const details = attachOutputStoreDetails({</code> | 声明局部标识符 `details`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3064 | <code>                status: 'error',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3065 | <code>                action: 'session_start',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3066 | <code>                command,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3067 | <code>                args: commandArgs,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3068 | <code>                workdir,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3069 | <code>                error: error?.message &#124;&#124; String(error)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3070 | <code>            }, outputStore);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3071 | <code>            return createErrorResult('error', error?.message &#124;&#124; String(error), details);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3072 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3073 | <code>        const record = this.createSessionRecord({ command, workdir, child, timeoutMs, outputCapture });</code> | 声明局部标识符 `record`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3074 | <code>        return createTextResult(JSON.stringify(this.publicSession(record), null, 2), {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3075 | <code>            status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3076 | <code>            action: 'session_start',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3077 | <code>            session: this.publicSession(record)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3078 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3079 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3080 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3081 | <code>    processRead(args) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3082 | <code>        const id = normalizeString(args.sessionId &#124;&#124; args.id);</code> | 声明局部标识符 `id`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3083 | <code>        const record = this.sessions.get(id);</code> | 声明局部标识符 `record`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3084 | <code>        if (!record) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3085 | <code>            return createErrorResult('not_found', `没有找到进程会话：${id}`, { sessionId: id });</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3086 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3087 | <code>        return createTextResult(JSON.stringify(this.publicSession(record), null, 2), {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3088 | <code>            status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3089 | <code>            action: 'process_read',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3090 | <code>            session: this.publicSession(record)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3091 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3092 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3093 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3094 | <code>    processWrite(args, context) {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3095 | <code>        const id = normalizeString(args.sessionId &#124;&#124; args.id);</code> | 声明局部标识符 `id`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3096 | <code>        const input = typeof args.input === 'string' ? args.input : '';</code> | 声明局部标识符 `input`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3097 | <code>        const record = this.sessions.get(id);</code> | 声明局部标识符 `record`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3098 | <code>        if (!record) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3099 | <code>            return createErrorResult('not_found', `没有找到进程会话：${id}`, { sessionId: id });</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3100 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3101 | <code>        const approval = approvalRequired('process_write', args, context);</code> | 声明局部标识符 `approval`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3102 | <code>        if (approval) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3103 | <code>            return approval;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3104 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3105 | <code>        if (record.status !== 'running') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3106 | <code>            return createErrorResult('error', `进程会话不是 running：${record.status}`, { sessionId: id, status: record.status });</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3107 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3108 | <code>        record.child.stdin?.write(input);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3109 | <code>        if (args.submit === true &#124;&#124; args.enter === true) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3110 | <code>            record.child.stdin?.write(os.EOL);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3111 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3112 | <code>        return createTextResult('input written', {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3113 | <code>            status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3114 | <code>            action: 'process_write',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3115 | <code>            sessionId: id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3116 | <code>            bytes: Buffer.byteLength(input)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3117 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3118 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3119 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3120 | <code>    async writeStdin(args, context) {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3121 | <code>        const id = normalizeString(args.session_id &#124;&#124; args.sessionId &#124;&#124; args.id);</code> | 声明局部标识符 `id`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3122 | <code>        const input = typeof args.chars === 'string'</code> | 声明局部标识符 `input`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3123 | <code>            ? args.chars</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3124 | <code>            : typeof args.input === 'string'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3125 | <code>                ? args.input</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3126 | <code>                : '';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3127 | <code>        const yieldTimeMs = normalizeNumber(args.yield_time_ms &#124;&#124; args.yieldTimeMs, DEFAULT_EXEC_YIELD_TIME_MS, MIN_EXEC_YIELD_TIME_MS, MAX_EXEC_YIELD_TIME_MS);</code> | 声明局部标识符 `yieldTimeMs`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3128 | <code>        const maxOutputTokens = normalizeNumber(args.max_output_tokens &#124;&#124; args.maxOutputTokens, DEFAULT_EXEC_MAX_OUTPUT_TOKENS, 256, 100000);</code> | 声明局部标识符 `maxOutputTokens`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3129 | <code>        if (!id) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3130 | <code>            return createErrorResult('needs_config', 'write_stdin 需要 session_id 或 sessionId 参数。');</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3131 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3132 | <code>        const processRecord = this.sessions.get(id);</code> | 声明局部标识符 `processRecord`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3133 | <code>        const ptyRecord = this.ptySessions.get(id);</code> | 声明局部标识符 `ptyRecord`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3134 | <code>        if (!processRecord &amp;&amp; !ptyRecord) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3135 | <code>            return createErrorResult('not_found', `没有找到 unified exec 会话：${id}`, { sessionId: id });</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3136 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3137 | <code>        if (input) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3138 | <code>            const approval = approvalRequired('write_stdin', args, context);</code> | 声明局部标识符 `approval`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3139 | <code>            if (approval) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3140 | <code>                return approval;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3141 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3142 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3143 | <code>        if (processRecord) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3144 | <code>            if (input &amp;&amp; processRecord.status !== 'running') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3145 | <code>                return createErrorResult('error', `进程会话不是 running：${processRecord.status}`, { sessionId: id, status: processRecord.status });</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3146 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3147 | <code>            if (input) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3148 | <code>                processRecord.child.stdin?.write(input);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3149 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3150 | <code>            if (input &amp;&amp; (args.submit === true &#124;&#124; args.enter === true)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3151 | <code>                processRecord.child.stdin?.write(os.EOL);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3152 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3153 | <code>            const details = await this.waitForProcessSnapshot(processRecord, yieldTimeMs);</code> | 声明局部标识符 `details`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3154 | <code>            details.action = 'write_stdin';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3155 | <code>            details.max_output_tokens = maxOutputTokens;</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 3156 | <code>            details.output = truncateByApproxTokens(collectSessionText(processRecord), maxOutputTokens);</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 3157 | <code>            details.stdout = truncateByApproxTokens(processRecord.stdout &#124;&#124; '', maxOutputTokens);</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 3158 | <code>            details.stderr = truncateByApproxTokens(processRecord.stderr &#124;&#124; '', maxOutputTokens);</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 3159 | <code>            details.bytes_written = Buffer.byteLength(input);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3160 | <code>            const outputStore = await summarizeRecordOutputStore(processRecord);</code> | 声明局部标识符 `outputStore`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3161 | <code>            const withOutputStore = attachOutputStoreDetails(details, outputStore);</code> | 声明局部标识符 `withOutputStore`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3162 | <code>            return createTextResult(formatExecContent(withOutputStore), withOutputStore);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3163 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3164 | <code>        if (input &amp;&amp; ptyRecord.status !== 'running') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3165 | <code>            return createErrorResult('error', `PTY 会话不是 running：${ptyRecord.status}`, { sessionId: id, status: ptyRecord.status });</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3166 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3167 | <code>        if (input) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3168 | <code>            ptyRecord.terminal.write(input);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3169 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3170 | <code>        if (input &amp;&amp; (args.submit === true &#124;&#124; args.enter === true)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3171 | <code>            ptyRecord.terminal.write(os.EOL);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3172 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3173 | <code>        const details = await this.waitForPtySnapshot(ptyRecord, yieldTimeMs);</code> | 声明局部标识符 `details`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3174 | <code>        details.action = 'write_stdin';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3175 | <code>        details.max_output_tokens = maxOutputTokens;</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 3176 | <code>        details.output = truncateByApproxTokens(collectPtyText(ptyRecord), maxOutputTokens);</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 3177 | <code>        details.stdout = details.output;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3178 | <code>        details.bytes_written = Buffer.byteLength(input);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3179 | <code>        return createTextResult(details.output &#124;&#124; JSON.stringify(details, null, 2), details);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3180 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3181 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3182 | <code>    async processKill(args, context) {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3183 | <code>        const id = normalizeString(args.sessionId &#124;&#124; args.id);</code> | 声明局部标识符 `id`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3184 | <code>        const record = this.sessions.get(id);</code> | 声明局部标识符 `record`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3185 | <code>        if (!record) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3186 | <code>            return createErrorResult('not_found', `没有找到进程会话：${id}`, { sessionId: id });</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3187 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3188 | <code>        const approval = approvalRequired('process_kill', args, context);</code> | 声明局部标识符 `approval`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3189 | <code>        if (approval) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3190 | <code>            return approval;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3191 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3192 | <code>        const signal = normalizeString(args.signal, 'SIGTERM');</code> | 声明局部标识符 `signal`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3193 | <code>        const killed = await this.platformAdapter.killProcessTree(record.child, signal);</code> | 声明局部标识符 `killed`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3194 | <code>        record.status = record.status === 'running' ? 'killed' : record.status;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3195 | <code>        record.updatedAt = Date.now();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3196 | <code>        record.outputStore = await summarizeRecordOutputStore(record, {</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3197 | <code>            status: 'killed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3198 | <code>            signal</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3199 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3200 | <code>        return createTextResult(`killed ${id}`, {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3201 | <code>            status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3202 | <code>            action: 'process_kill',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3203 | <code>            sessionId: id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3204 | <code>            signal,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3205 | <code>            platform: this.platformAdapter.getStatus(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3206 | <code>            kill: killed,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3207 | <code>            outputId: record.outputStore?.outputId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3208 | <code>            outputStore: record.outputStore</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3209 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3210 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3211 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3212 | <code>    async shutdown() {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3213 | <code>        for (const record of this.watchers.values()) {</code> | 声明局部标识符 `record`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3214 | <code>            try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 3215 | <code>                record.watcher?.close();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3216 | <code>            } catch {}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3217 | <code>            record.status = 'stopped';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3218 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3219 | <code>        this.watchers.clear();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3220 | <code>        for (const record of this.ptySessions.values()) {</code> | 声明局部标识符 `record`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3221 | <code>            if (record.status === 'running') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3222 | <code>                try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 3223 | <code>                    record.terminal.kill();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3224 | <code>                } catch {}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3225 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3226 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3227 | <code>        this.ptySessions.clear();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3228 | <code>        for (const record of this.sessions.values()) {</code> | 声明局部标识符 `record`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3229 | <code>            if (record.status === 'running') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3230 | <code>                try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 3231 | <code>                    await this.platformAdapter.killProcessTree(record.child, 'SIGTERM');</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3232 | <code>                } catch {}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3233 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3234 | <code>            if (record.timeout) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3235 | <code>                clearTimeout(record.timeout);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3236 | <code>                record.timeout = null;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3237 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3238 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3239 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3240 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3241 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3242 | <code>function schemaResult(runtime) {</code> | 定义函数 `schemaResult`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3243 | <code>    const schema = {</code> | 声明局部标识符 `schema`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3244 | <code>        tool: COMPUTER_TOOL_ID,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3245 | <code>        actions: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3246 | <code>            'schema',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3247 | <code>            'list',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3248 | <code>            'tree',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3249 | <code>            'stat',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3250 | <code>            'read',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3251 | <code>            'read_binary',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3252 | <code>            'write',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3253 | <code>            'write_binary',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3254 | <code>            'append',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3255 | <code>            'mkdir',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3256 | <code>            'copy',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3257 | <code>            'move',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3258 | <code>            'delete',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3259 | <code>            'search',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3260 | <code>            'hash',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3261 | <code>            'du',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3262 | <code>            'screen_screenshot',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3263 | <code>            'mouse_move',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3264 | <code>            'mouse_click',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3265 | <code>            'mouse_double_click',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3266 | <code>            'mouse_right_click',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3267 | <code>            'mouse_drag',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3268 | <code>            'scroll',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3269 | <code>            'keyboard_type',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3270 | <code>            'keyboard_press',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3271 | <code>            'keyboard_hotkey',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3272 | <code>            'clipboard_read',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3273 | <code>            'clipboard_write',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3274 | <code>            'wait',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3275 | <code>            'acl_get',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3276 | <code>            'acl_set',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3277 | <code>            'watch_start',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3278 | <code>            'watch_poll',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3279 | <code>            'watch_list',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3280 | <code>            'watch_stop',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3281 | <code>            'exec',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3282 | <code>            'exec_command',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3283 | <code>            'write_stdin',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3284 | <code>            'session_start',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3285 | <code>            'pty_status',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3286 | <code>            'pty_start',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3287 | <code>            'pty_read',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3288 | <code>            'pty_write',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3289 | <code>            'pty_resize',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3290 | <code>            'pty_kill',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3291 | <code>            'process_list',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3292 | <code>            'process_read',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3293 | <code>            'process_write',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3294 | <code>            'process_kill',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3295 | <code>            'rollback_list',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3296 | <code>            'rollback_restore'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3297 | <code>        ],</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3298 | <code>        safety: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3299 | <code>            readDefaultRoots: commonUserRoots(runtime),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3300 | <code>            protectedRoots: protectedRoots(runtime),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3301 | <code>            platform: getRuntimePlatform(runtime).getStatus(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3302 | <code>            mutationsRequireApproval: true,</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 3303 | <code>            outsideWorkspaceRequires: 'context.allowOutsideWorkspace=true',</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3304 | <code>            protectedMutationRequires: 'context.allowSystemMutation=true plus approval; full-control still keeps C drive system roots blocked',</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 3305 | <code>            deleteDefault: 'trash/quarantine; permanent delete requires allowPermanentDelete=true and dangerous=true',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3306 | <code>            rollbackJournal: rollbackJournalPath(runtime),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3307 | <code>            ptyOptional: loadNodePty().ok,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3308 | <code>            guiInput: getRuntimePlatform(runtime).getStatus().capabilities.guiInput,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3309 | <code>            screenCapture: getRuntimePlatform(runtime).getStatus().capabilities.screenCapture,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3310 | <code>            clipboard: getRuntimePlatform(runtime).getStatus().capabilities.clipboard</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3311 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3312 | <code>        directTools: {</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3313 | <code>            execOutputStore: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3314 | <code>                status: 'runtime_artifact_only_by_default',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3315 | <code>                useWhen: 'computer.exec/exec_command/session_start returns outputId, bytes, lineCount, or previewTruncated.',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3316 | <code>                defaultAgentBehavior: 'Use returned stdout/stderr/preview. If more evidence is needed, rerun a narrower command or write the needed data to a normal file and read that file.',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3317 | <code>                doNotCall: 'Do not treat outputId as a filesystem path or computer action.'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3318 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3319 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3320 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3321 | <code>    return createTextResult(JSON.stringify(schema, null, 2), {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3322 | <code>        status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3323 | <code>        action: 'schema',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3324 | <code>        schema</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3325 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3326 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3327 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3328 | <code>class AILISComputerTool {</code> | 定义类 `AILISComputerTool`，把相关状态与行为收拢为一个运行时对象。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3329 | <code>    constructor(options = {}) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3330 | <code>        this.runtime = new ComputerRuntime(options);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3331 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3332 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3333 | <code>    async shutdown() {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3334 | <code>        await this.runtime.shutdown();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3335 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3336 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3337 | <code>    async execute(args = {}, context = {}, runtime = {}) {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3338 | <code>        const action = normalizeGuiAction(args.action &#124;&#124; args.operation &#124;&#124; args.intent &#124;&#124; 'schema');</code> | 声明局部标识符 `action`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3339 | <code>        const effectiveRuntime = {</code> | 声明局部标识符 `effectiveRuntime`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3340 | <code>            ...runtime,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3341 | <code>            platformAdapter: runtime.platformAdapter &#124;&#124; this.runtime.platformAdapter</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3342 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3343 | <code>        const outputStoreSurfaceError = outputStoreWrongSurfaceResult(args, action);</code> | 声明局部标识符 `outputStoreSurfaceError`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3344 | <code>        if (outputStoreSurfaceError) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3345 | <code>            return outputStoreSurfaceError;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3346 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3347 | <code>        if (action === 'schema' &#124;&#124; action === 'help') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3348 | <code>            return schemaResult(effectiveRuntime);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3349 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3350 | <code>        if (action === 'ls' &#124;&#124; action === 'list') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3351 | <code>            return await actionList(args, context, effectiveRuntime);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3352 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3353 | <code>        if (action === 'tree') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3354 | <code>            return await actionTree(args, context, effectiveRuntime);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3355 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3356 | <code>        if (action === 'stat') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3357 | <code>            return await actionStat(args, context, effectiveRuntime);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3358 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3359 | <code>        if (action === 'read' &#124;&#124; action === 'cat') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3360 | <code>            return await actionRead(args, context, effectiveRuntime);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3361 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3362 | <code>        if (action === 'read_binary') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3363 | <code>            return await actionReadBinary(args, context, effectiveRuntime);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3364 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3365 | <code>        if (action === 'write') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3366 | <code>            return await actionWrite(args, context, effectiveRuntime, false);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3367 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3368 | <code>        if (action === 'write_binary') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3369 | <code>            return await actionWriteBinary(args, context, effectiveRuntime);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3370 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3371 | <code>        if (action === 'append') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3372 | <code>            return await actionWrite(args, context, effectiveRuntime, true);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3373 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3374 | <code>        if (action === 'mkdir') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3375 | <code>            return await actionMkdir(args, context, effectiveRuntime);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3376 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3377 | <code>        if (action === 'copy' &#124;&#124; action === 'cp') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3378 | <code>            return await actionCopyMove(args, context, effectiveRuntime, false);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3379 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3380 | <code>        if (action === 'move' &#124;&#124; action === 'rename' &#124;&#124; action === 'mv') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3381 | <code>            return await actionCopyMove(args, context, effectiveRuntime, true);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3382 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3383 | <code>        if (action === 'delete' &#124;&#124; action === 'rm' &#124;&#124; action === 'trash') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3384 | <code>            return await actionDelete(args, context, effectiveRuntime);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3385 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3386 | <code>        if (action === 'search' &#124;&#124; action === 'find') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3387 | <code>            return await actionSearch(args, context, effectiveRuntime);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3388 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3389 | <code>        if (action === 'hash' &#124;&#124; action === 'checksum') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3390 | <code>            return await actionHash(args, context, effectiveRuntime);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3391 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3392 | <code>        if (action === 'du' &#124;&#124; action === 'disk_usage') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3393 | <code>            return await actionDu(args, context, effectiveRuntime);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3394 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3395 | <code>        if (action === 'wait') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3396 | <code>            return await actionWait(args);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3397 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3398 | <code>        if (action === 'screen_screenshot') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3399 | <code>            return await actionScreenScreenshot(args, context, effectiveRuntime);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3400 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3401 | <code>        if (action === 'clipboard_read') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3402 | <code>            return await actionClipboardRead(args, context, effectiveRuntime);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3403 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3404 | <code>        if (action === 'clipboard_write') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3405 | <code>            return await actionClipboardWrite(args, context, effectiveRuntime);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3406 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3407 | <code>        if (</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3408 | <code>            [</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3409 | <code>                'mouse_move',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3410 | <code>                'mouse_click',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3411 | <code>                'mouse_double_click',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3412 | <code>                'mouse_right_click',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3413 | <code>                'mouse_drag',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3414 | <code>                'scroll',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3415 | <code>                'keyboard_type',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3416 | <code>                'keyboard_press',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3417 | <code>                'keyboard_hotkey'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3418 | <code>            ].includes(action)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3419 | <code>        ) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3420 | <code>            return await actionGuiInput({ ...args, action }, context, effectiveRuntime);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3421 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3422 | <code>        if (action === 'acl_get') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3423 | <code>            return await actionAclGet(args, context, effectiveRuntime);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3424 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3425 | <code>        if (action === 'acl_set') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3426 | <code>            return await actionAclSet(args, context, effectiveRuntime);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3427 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3428 | <code>        if (action === 'watch_start') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3429 | <code>            return this.runtime.watchStart(args, context, effectiveRuntime);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3430 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3431 | <code>        if (action === 'watch_list') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3432 | <code>            return this.runtime.watchList();</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3433 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3434 | <code>        if (action === 'watch_poll') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3435 | <code>            return this.runtime.watchPoll(args);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3436 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3437 | <code>        if (action === 'watch_stop') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3438 | <code>            return this.runtime.watchStop(args, context);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3439 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3440 | <code>        if (action === 'rollback_list') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3441 | <code>            return await actionRollbackList(args, context, effectiveRuntime);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3442 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3443 | <code>        if (action === 'rollback_restore') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3444 | <code>            return await actionRollbackRestore(args, context, effectiveRuntime);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3445 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3446 | <code>        if (action === 'exec' &#124;&#124; action === 'run') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3447 | <code>            return await this.runtime.exec({ ...args, action }, context, effectiveRuntime);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3448 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3449 | <code>        if (action === 'exec_command') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3450 | <code>            return await this.runtime.execCommand({ ...args, action }, context, effectiveRuntime);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3451 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3452 | <code>        if (action === 'write_stdin') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3453 | <code>            return await this.runtime.writeStdin({ ...args, action }, context, effectiveRuntime);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3454 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3455 | <code>        if (action === 'session_start' &#124;&#124; action === 'spawn') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3456 | <code>            return await this.runtime.sessionStart({ ...args, action }, context, effectiveRuntime);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3457 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3458 | <code>        if (action === 'pty_status') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3459 | <code>            return this.runtime.ptyStatus();</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3460 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3461 | <code>        if (action === 'pty_start') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3462 | <code>            return await this.runtime.ptyStart({ ...args, action }, context, effectiveRuntime);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3463 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3464 | <code>        if (action === 'pty_read') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3465 | <code>            return this.runtime.ptyRead(args);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3466 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3467 | <code>        if (action === 'pty_write') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3468 | <code>            return this.runtime.ptyWrite(args, context);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3469 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3470 | <code>        if (action === 'pty_resize') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3471 | <code>            return this.runtime.ptyResize(args);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3472 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3473 | <code>        if (action === 'pty_kill') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3474 | <code>            return this.runtime.ptyKill(args, context);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3475 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3476 | <code>        if (action === 'process_list') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3477 | <code>            const sessions = this.runtime.listSessions();</code> | 声明局部标识符 `sessions`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3478 | <code>            return createTextResult(JSON.stringify({ action, sessions }, null, 2), {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3479 | <code>                status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3480 | <code>                action,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3481 | <code>                sessions</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3482 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3483 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3484 | <code>        if (action === 'process_read' &#124;&#124; action === 'process_poll' &#124;&#124; action === 'process_log') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3485 | <code>            return this.runtime.processRead(args);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3486 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3487 | <code>        if (action === 'process_write' &#124;&#124; action === 'process_input') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3488 | <code>            return this.runtime.processWrite(args, context);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3489 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3490 | <code>        if (action === 'process_kill') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3491 | <code>            return await this.runtime.processKill(args, context);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3492 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3493 | <code>        return createErrorResult('needs_config', `不支持的 computer action：${action}`, {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3494 | <code>            supportedActions: schemaResult(effectiveRuntime).details.schema.actions</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3495 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3496 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3497 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3498 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3499 | <code>module.exports = {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3500 | <code>    COMPUTER_TOOL_ID,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3501 | <code>    AILISComputerTool,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3502 | <code>    ComputerRuntime,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3503 | <code>    commonUserRoots,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3504 | <code>    protectedRoots,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3505 | <code>    resolveTargetPath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3506 | <code>    getRuntimePlatform</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3507 | <code>};</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
