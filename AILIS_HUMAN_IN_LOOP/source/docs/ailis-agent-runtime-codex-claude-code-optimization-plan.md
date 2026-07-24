# AILIS Agent Runtime Optimization Plan from Codex and Claude Code

Last updated: 2026-06-18

This document records a code-backed optimization plan for AILIS Agent/Tools/MCP/Context Runtime. It is intentionally strict: every proposed module below points to an inspected Codex or Claude Code implementation anchor.

The goal is not to copy product behavior blindly. The goal is to copy the engineering shape that makes Codex and Claude Code stable:

- The model receives accurate environment context instead of guessing the OS or shell.
- Tool schemas are small, searchable, and loaded progressively.
- Command/file outputs are bounded, metadata-rich, and recoverable.
- Large files become queryable artifacts instead of raw prompt payload.
- Repeated reads are detected by runtime state, not by hoping the model remembers.
- Context growth is measured and compacted with explicit budgets.

## Source Inventory

### Codex source used

Codex npm package installed locally:

- `C:\Users\Lenovo\AppData\Roaming\npm\node_modules\@openai\codex\package.json`
- package version: `0.139.0`
- package points to repository: `https://github.com/openai/codex.git`, directory `codex-cli`

Inspected source checkout:

```text
D:\Temp\codex-source-inspect
HEAD: 5867b529ae91afad02de74a0bc1a2162e3721688
Commit date: 2026-06-17 19:36:16 +0000
Commit subject: unified-exec: preserve PathUri through exec-server (#28681)
```

Important Codex source anchors:

- `D:\Temp\codex-source-inspect\codex-rs\core\src\context\environment_context.rs`
- `D:\Temp\codex-source-inspect\codex-rs\core\src\shell.rs`
- `D:\Temp\codex-source-inspect\codex-rs\core\src\tools\handlers\shell_spec.rs`
- `D:\Temp\codex-source-inspect\codex-rs\core\src\tools\handlers\unified_exec.rs`
- `D:\Temp\codex-source-inspect\codex-rs\core\src\tools\handlers\unified_exec\exec_command.rs`
- `D:\Temp\codex-source-inspect\codex-rs\core\src\unified_exec\mod.rs`
- `D:\Temp\codex-source-inspect\codex-rs\core\src\unified_exec\process.rs`
- `D:\Temp\codex-source-inspect\codex-rs\core\src\unified_exec\process_manager.rs`
- `D:\Temp\codex-source-inspect\codex-rs\core\src\unified_exec\head_tail_buffer.rs`
- `D:\Temp\codex-source-inspect\codex-rs\core\src\tools\context.rs`
- `D:\Temp\codex-source-inspect\codex-rs\utils\output-truncation\src\lib.rs`
- `D:\Temp\codex-source-inspect\codex-rs\core\src\tools\handlers\tool_search.rs`
- `D:\Temp\codex-source-inspect\codex-rs\core\src\tools\handlers\tool_search_spec.rs`
- `D:\Temp\codex-source-inspect\codex-rs\core\src\mcp_tool_exposure.rs`
- `D:\Temp\codex-source-inspect\codex-rs\core\src\tools\handlers\mcp.rs`
- `D:\Temp\codex-source-inspect\codex-rs\core-skills\src\render.rs`
- `D:\Temp\codex-source-inspect\codex-rs\core-skills\src\injection.rs`
- `D:\Temp\codex-source-inspect\codex-rs\core\src\context_manager\history.rs`
- `D:\Temp\codex-source-inspect\codex-rs\core\src\thread_rollout_truncation.rs`

### Claude Code source used

Claude Code installed locally:

- `C:\Users\Lenovo\AppData\Roaming\npm\node_modules\@anthropic-ai\claude-code\package.json`
- package version: `2.1.101`
- main bundle: `C:\Users\Lenovo\AppData\Roaming\npm\node_modules\@anthropic-ai\claude-code\cli.js`

Important boundary: the Claude Code npm package is a bundled/minified `cli.js`, not a split source tree. Therefore Claude Code references below use package version, function/string name, and byte offset inside `cli.js`, not stable source line numbers.

Key Claude Code bundle anchors:

- `S14` Read prompt function at byte offset `3736163`.
- `RZY` Read input schema at byte offset `9781964`.
- `wz=cq({name:uq...})` Read tool object at byte offset `9784805`.
- `eEK` Read call implementation at byte offset `9776413`.
- `E96` text file reader at byte offset `9632031`.
- `DH8` line-number formatter at byte offset `912430`.
- `jL6` read-state reconstruction/dedup support at byte offset `6593787`.
- `MTz` long-file sequential chunk instruction at byte offset `6816469`.
- `GR6` Bash max output length at byte offset `7055797`.
- `L2` Bash task output/spill-to-disk class at byte offset `7055988`.
- `Mg6` capped output accumulator at byte offset `873217`.

## 1. Runtime Environment Context

### Source evidence

Codex injects runtime environment context as structured context, not as memory and not as a hardcoded Windows assumption.

Reference:

- `D:\Temp\codex-source-inspect\codex-rs\core\src\context\environment_context.rs:20`
- `D:\Temp\codex-source-inspect\codex-rs\core\src\context\environment_context.rs:30`
- `D:\Temp\codex-source-inspect\codex-rs\core\src\context\environment_context.rs:422`
- `D:\Temp\codex-source-inspect\codex-rs\core\src\context\environment_context.rs:535`

Confirmed behavior:

- `EnvironmentContextEnvironment` stores `id`, `cwd`, and `shell`.
- `EnvironmentContext::from_turn_context` builds the context from current turn environments.
- The rendered context includes `<cwd>` and `<shell>`.
- It also includes current date, timezone, network info, filesystem roots, and permissions when available.

Codex shell execution uses detected shell type to derive the actual process arguments.

Reference:

- `D:\Temp\codex-source-inspect\codex-rs\core\src\shell.rs:22`
- `D:\Temp\codex-source-inspect\codex-rs\core\src\shell.rs:32`
- `D:\Temp\codex-source-inspect\codex-rs\core\src\shell.rs:42`

Confirmed behavior:

- Bash/zsh/sh use `-c` or `-lc`.
- PowerShell uses `-NoProfile -Command` when not a login shell.
- Cmd uses `/c`.

### AILIS direction

AILIS should have a first-class `runtime_environment` turn context module:

```text
runtime_environment
  environmentId
  cwd
  osFamily
  shellName
  shellPath
  pathConvention
  currentDate
  timezone
  filesystemRoots
  permissionProfile
  networkPolicy
```

This belongs in turn/runtime context, not in long-term user memory. It changes with environment, session, remote target, and shell.

### AILIS implementation target

Likely files:

- `F:\AILIS_self_evolution_runtime\electron\ailis-agent-runner.cjs`
- `F:\AILIS_self_evolution_runtime\electron\ailis-runtime.cjs`
- `F:\AILIS_self_evolution_runtime\electron\ailis-gateway.cjs`

Add a model-visible context block similar to:

```xml
<runtime_environment>
  <cwd>F:\AILIS_self_evolution_runtime</cwd>
  <os_family>windows</os_family>
  <shell>powershell</shell>
  <path_convention>windows</path_convention>
  <timezone>Asia/Shanghai</timezone>
</runtime_environment>
```

The exact values must be detected at runtime. Do not write a fixed Windows string into static prompt text.

### Do not do

- Do not translate Unix commands into PowerShell by regex.
- Do not assume the user's machine is always Windows.
- Do not put `runtime_environment` into persistent preference memory.
- Do not make command correctness depend on hidden app-side command rewriting.

## 2. Shell and Exec Tool Contract

### Source evidence

Codex has two related command tools:

- `exec_command`, the unified exec tool.
- `shell_command`, older/simple shell command tool.

Reference:

- `D:\Temp\codex-source-inspect\codex-rs\core\src\tools\handlers\shell_spec.rs:21`
- `D:\Temp\codex-source-inspect\codex-rs\core\src\tools\handlers\shell_spec.rs:52`
- `D:\Temp\codex-source-inspect\codex-rs\core\src\tools\handlers\shell_spec.rs:88`
- `D:\Temp\codex-source-inspect\codex-rs\core\src\tools\handlers\shell_spec.rs:110`
- `D:\Temp\codex-source-inspect\codex-rs\core\src\tools\handlers\shell_spec.rs:188`
- `D:\Temp\codex-source-inspect\codex-rs\core\src\tools\handlers\shell_spec.rs:261`
- `D:\Temp\codex-source-inspect\codex-rs\core\src\tools\handlers\shell_spec.rs:402`

Confirmed behavior:

- `exec_command` schema includes `cmd`, `workdir`, `tty`, `yield_time_ms`, `max_output_tokens`, optional `shell`, optional `environment_id`.
- `write_stdin` is a separate tool for ongoing sessions.
- On Windows, the tool description says PowerShell and gives PowerShell examples.
- Windows safety rules are guidance, not a Unix-to-PowerShell translator.
- `unified_exec_output_schema` explicitly includes `chunk_id`, `wall_time_seconds`, `exit_code`, `session_id`, `original_token_count`, and `output`.

Claude Code's Bash prompt also uses shell/tool guidance rather than a command rewriting layer.

Reference:

- `C:\Users\Lenovo\AppData\Roaming\npm\node_modules\@anthropic-ai\claude-code\cli.js`
- Bash tool guidance string near byte offset `7218141`.

Confirmed behavior:

- Bash output limit is stated in the tool prompt.
- It tells the model to use dedicated tools for file search/content search/read/edit/write instead of using PowerShell equivalents when dedicated tools exist.
- It tells the model not to prefix commands with `cd` or `Set-Location` because working directory is already set.

### AILIS direction

AILIS exec should be one unified command interface with explicit environment semantics:

```json
{
  "cmd": "Get-ChildItem -Force",
  "workdir": "F:\\AILIS_self_evolution_runtime",
  "yieldTimeMs": 10000,
  "maxOutputTokens": 10000,
  "shell": "powershell",
  "environmentId": "local"
}
```

The tool should return a structured observation:

```json
{
  "status": "completed",
  "exitCode": 0,
  "wallTimeMs": 842,
  "outputId": "exec_...",
  "stdoutPreview": "...",
  "stderrPreview": "",
  "stdoutBytes": 12345,
  "stderrBytes": 0,
  "stdoutLines": 240,
  "stderrLines": 0,
  "truncated": true,
  "nextTools": ["output_read", "output_tail", "output_search"]
}
```

### AILIS implementation target

Likely files:

- `F:\AILIS_self_evolution_runtime\electron\ailis-computer-tool.cjs`
- `F:\AILIS_self_evolution_runtime\electron\ailis-tool-runtime.cjs`
- `F:\AILIS_self_evolution_runtime\electron\ailis-tool-contracts.cjs`
- `F:\AILIS_self_evolution_runtime\electron\ailis-agent-runner.cjs`

Required changes:

- Update tool declaration so the model sees the actual shell/environment.
- Add `yieldTimeMs` and `maxOutputTokens` semantics if missing.
- Return structured metadata even for empty output.
- Preserve full output in an output store.

### Do not do

- Do not return only `exitCode=0`.
- Do not use a fixed failure phrase like "有一步没有顺利通过".
- Do not auto-convert `/dev/null`, `head`, `tail`, or `cd /d` with brittle parsing.
- Do not hide stderr, timeout, spawn failure, permission failure, or empty-output diagnostics.

## 3. Exec Output Store

### Source evidence

Codex unified exec uses a process manager, output buffer, and output metadata.

References:

- `D:\Temp\codex-source-inspect\codex-rs\core\src\unified_exec\mod.rs:64`
- `D:\Temp\codex-source-inspect\codex-rs\core\src\unified_exec\mod.rs:70`
- `D:\Temp\codex-source-inspect\codex-rs\core\src\unified_exec\mod.rs:71`
- `D:\Temp\codex-source-inspect\codex-rs\core\src\unified_exec\head_tail_buffer.rs:1`
- `D:\Temp\codex-source-inspect\codex-rs\core\src\unified_exec\process.rs:44`
- `D:\Temp\codex-source-inspect\codex-rs\core\src\unified_exec\process_manager.rs:382`
- `D:\Temp\codex-source-inspect\codex-rs\core\src\unified_exec\process_manager.rs:464`
- `D:\Temp\codex-source-inspect\codex-rs\core\src\unified_exec\process_manager.rs:598`
- `D:\Temp\codex-source-inspect\codex-rs\core\src\unified_exec\process_manager.rs:615`
- `D:\Temp\codex-source-inspect\codex-rs\core\src\unified_exec\process_manager.rs:1139`
- `D:\Temp\codex-source-inspect\codex-rs\core\src\tools\context.rs:308`
- `D:\Temp\codex-source-inspect\codex-rs\core\src\tools\context.rs:409`

Confirmed behavior:

- Codex default `DEFAULT_MAX_OUTPUT_TOKENS` is `10000`.
- Codex unified exec process buffer retains up to `1 MiB`.
- `HeadTailBuffer` preserves a stable prefix and suffix and drops the middle.
- Initial `exec_command` can return a live process/session id.
- `write_stdin` can poll or interact with the process.
- `ExecCommandToolOutput` includes wall time, exit code, process id, original token count, and output.

Claude Code also has an output store/spill pattern.

References:

- `GR6` Bash max output length at byte offset `7055797`.
- `L2` Bash task output/spill-to-disk class at byte offset `7055988`.
- `Mg6` capped output accumulator at byte offset `873217`.

Confirmed behavior:

- `BASH_MAX_OUTPUT_LENGTH` is read from env and bounded by defaults.
- The `L2` task output class tracks task id, output path, stdout/stderr, total lines, total bytes, overflow state, and spill-to-disk behavior.
- When output overflows, full output is saved to a file and the model receives recent output plus a saved-file notice.
- `Mg6` caps accumulated content and appends an explicit truncation marker.

### AILIS direction

AILIS should not try to put all exec output in model context. It should implement `Exec Output Store`:

```text
exec_command
  -> write full stdout/stderr to .ailis-state/output-store/{callId}.log
  -> return preview, outputId, byte counts, line counts, truncation status
  -> let model call output_read/output_tail/output_search
  -> let Agent Lab show full output outside model context
```

### AILIS implementation target

Likely files:

- `F:\AILIS_self_evolution_runtime\electron\ailis-computer-tool.cjs`
- `F:\AILIS_self_evolution_runtime\electron\ailis-tool-runtime.cjs`
- new optional file: `F:\AILIS_self_evolution_runtime\electron\ailis-exec-output-store.cjs`
- tests under `F:\AILIS_self_evolution_runtime\tests\`

Required tools:

- `output_read(outputId, offsetBytes?, maxBytes?)`
- `output_tail(outputId, lines?)`
- `output_search(outputId, query|regex, maxMatches?)`
- optional `output_summary(outputId)`

Observation contract:

```text
Output is not lost.
Preview may be truncated.
Full output is available through output_* tools.
```

### Do not do

- Do not raise one global output limit and call it solved.
- Do not return only a 1200-character preview.
- Do not make Agent Lab and model context share the same output budget.
- Do not drop the middle without saying so.

## 4. Text File Read Runtime

### Source evidence

Claude Code's Read tool is a real file-runtime layer, not a generic byte dump.

References:

- `S14` Read prompt function at byte offset `3736163`.
- `RZY` Read input schema at byte offset `9781964`.
- `wz=cq({name:uq...})` Read tool object at byte offset `9784805`.
- `eEK` Read call implementation at byte offset `9776413`.
- `E96` text file reader at byte offset `9632031`.
- `DH8` line-number formatter at byte offset `912430`.

Confirmed behavior:

- Read schema has `file_path`, `offset`, `limit`, and `pages`.
- Default read starts from the beginning and reads a bounded number of lines.
- Text result carries `filePath`, `content`, `numLines`, `startLine`, and `totalLines`.
- Output is formatted with line numbers.
- Large content raises a specific error telling the model to use `offset` and `limit` or search.
- Device files that can block or infinite-output are denied.
- Binary files are rejected unless supported as images/PDF/notebooks.

Claude Code also has a long-file instruction generator.

Reference:

- `MTz` at byte offset `6816469`.

Confirmed behavior:

- It instructs the model to read sequential chunks until the whole file is read.
- If truncation warnings occur, reduce chunk size before proceeding.
- The model must state what portion was read before analysis.

### AILIS direction

AILIS `read` should become a structured read tool:

```json
{
  "filePath": "...",
  "offsetLine": 1,
  "limitLines": 2000,
  "content": "...",
  "startLine": 1,
  "numLines": 2000,
  "totalLines": 12842,
  "totalBytes": 620000,
  "readBytes": 92000,
  "complete": false,
  "truncated": false,
  "next": "Use read with offsetLine=2001 to continue, or search for specific terms."
}
```

### AILIS implementation target

Likely files:

- `F:\AILIS_self_evolution_runtime\electron\ailis-computer-tool.cjs`
- `F:\AILIS_self_evolution_runtime\electron\ailis-tool-contracts.cjs`
- `F:\AILIS_self_evolution_runtime\electron\ailis-tool-runtime.cjs`

Required behavior:

- Support line ranges for text files.
- Return line counts and total line counts.
- Preserve model-facing line numbers.
- Reject or redirect binary/structured files with actionable next tool hints.
- Store read state so repeated reads can be detected.

### Do not do

- Do not read arbitrary large files into one model observation.
- Do not return binary garbage.
- Do not report a truncated preview as if it were complete.
- Do not make `.xlsx`, `.docx`, `.pdf`, `.pptx` go through generic text read.

## 5. Read State, Deduplication, and Re-Read Prevention

### Source evidence

Claude Code tracks read state and can return `file_unchanged` instead of repeating content.

References:

- `jL6` read-state reconstruction/dedup support at byte offset `6593787`.
- `wz=cq({name:uq...})` Read tool object at byte offset `9784805`.
- Read prompt reminder strings around byte offset `3736163`, including file-unchanged messages.

Confirmed behavior:

- Claude Code records prior full-file reads when no `offset`/`limit` was used.
- It maps tool call ids to read file paths and later tool results.
- It stores content, timestamp, offset, and limit in read state.
- If the same file is read again and unchanged, it can return `file_unchanged`.
- The model-visible reminder says earlier content is still current.

Codex also has context/history management that normalizes tool outputs and tracks history.

Reference:

- `D:\Temp\codex-source-inspect\codex-rs\core\src\context_manager\history.rs:32`
- `D:\Temp\codex-source-inspect\codex-rs\core\src\context_manager\history.rs:90`
- `D:\Temp\codex-source-inspect\codex-rs\core\src\context_manager\history.rs:249`

Confirmed behavior:

- Codex records history items through a context manager.
- It processes items under truncation policy before prompt use.
- It tracks token usage info over time.

### AILIS direction

AILIS needs `Read State` as runtime memory for files/artifacts read during a run:

```text
readState[filePath]
  mtime
  size
  rangesRead
  fullReadComplete
  evidenceIds
  lastToolCallId
```

For repeated full reads:

```json
{
  "status": "file_unchanged",
  "filePath": "...",
  "evidenceId": "read_...",
  "message": "This file has not changed since the previous full read. Use the earlier evidence or request a specific range/search."
}
```

For repeated artifact ranges:

```json
{
  "status": "evidence_already_available",
  "artifactId": "...",
  "requestedRange": "A10:I13",
  "coveredBy": "Sheet1!A1:I20",
  "evidenceId": "artifact_grid_...",
  "complete": true,
  "reasoningReady": true
}
```

### AILIS implementation target

Likely files:

- `F:\AILIS_self_evolution_runtime\electron\ailis-context-artifact-store.cjs`
- `F:\AILIS_self_evolution_runtime\electron\ailis-computer-tool.cjs`
- `F:\AILIS_self_evolution_runtime\electron\ailis-agent-runner.cjs`

Required behavior:

- Track file/artifact reads by range and timestamp.
- Treat covered repeated reads as successful but redundant.
- Return a positive, actionable observation rather than an error.
- Surface evidence ids to Agent Lab.

### Do not do

- Do not block repeated reads with a generic failure.
- Do not rely only on prompt text like "do not read again".
- Do not hide the fact that earlier evidence exists.
- Do not force final answers globally; only suppress redundant evidence acquisition.

## 6. Structured Artifact Runtime

### Source evidence

Claude Code's Read has special handling for images, PDFs, notebooks, binary files, and page ranges.

References:

- `RZY` schema includes `pages` at byte offset `9781964`.
- `eEK` handles `ipynb`, image types, PDF page extraction, PDF page count, and text files at byte offset `9776413`.
- Binary MIME/type handling appears near `PTz` at byte offset `6816469`.

Confirmed behavior:

- Notebook reads are parsed as cells, not raw JSON text when possible.
- PDF reads may require page ranges.
- Large PDFs can be rejected with a specific instruction to use `pages`.
- Images are returned as image content with metadata.
- Binary files are rejected if no supported reader exists.

Codex does not expose an XLSX-specific public code path in the inspected core, but its general pattern is the same: do not dump huge raw outputs into prompt; use structured tool results and truncation policies.

References:

- `D:\Temp\codex-source-inspect\codex-rs\utils\output-truncation\src\lib.rs:12`
- `D:\Temp\codex-source-inspect\codex-rs\core\src\tools\context.rs:331`
- `D:\Temp\codex-source-inspect\codex-rs\core\src\tools\context.rs:366`

Confirmed behavior:

- Tool output is converted into a model-facing response item.
- Code mode result is structured JSON.
- Large text is formatted/truncated with explicit warnings.

### AILIS direction

AILIS should generalize current XLSX work into `Context/Artifact Runtime`:

```text
artifact_store
  spreadsheet artifact
  document artifact
  pdf artifact
  log artifact
  command-output artifact
  browser-dom artifact
```

Each artifact should have:

```json
{
  "artifactId": "ctx-spreadsheet-...",
  "kind": "spreadsheet",
  "sourcePath": "...",
  "summary": "...",
  "dimensions": "...",
  "queryTools": ["artifact_query", "artifact_search", "artifact_compute"],
  "payloadPath": "...",
  "payloadReadableByModel": false
}
```

### AILIS implementation target

Existing relevant files:

- `F:\AILIS_self_evolution_runtime\electron\ailis-context-artifact-store.cjs`
- `F:\AILIS_self_evolution_runtime\electron\ailis-xlsx-workbook-tool.cjs`
- `F:\AILIS_self_evolution_runtime\electron\ailis-gateway.cjs`
- `F:\AILIS_self_evolution_runtime\electron\ailis-tool-runtime.cjs`

Required next tools:

- `artifact_query`
- `artifact_search`
- `artifact_range`
- `artifact_payload_read` for chunked audited payload access
- `artifact_compute` for deterministic data worker/subagent analysis

### Do not do

- Do not write one-off XLSX or GitHub hacks as the primary architecture.
- Do not expose `fullJsonPath` as the recommended model action.
- Do not let the model raw-read generated artifact payloads as its first option.
- Do not remove payload access completely; make it chunked, searchable, and auditable.

## 7. Evidence Sufficiency and Coverage Gate

### Source evidence

Claude Code avoids repeated reads with `file_unchanged` and read state.

References:

- `jL6` at byte offset `6593787`.
- `wz=cq({name:uq...})` at byte offset `9784805`.

Codex keeps structured history and token info rather than relying on raw conversation text.

References:

- `D:\Temp\codex-source-inspect\codex-rs\core\src\context_manager\history.rs:32`
- `D:\Temp\codex-source-inspect\codex-rs\core\src\context_manager\history.rs:107`
- `D:\Temp\codex-source-inspect\codex-rs\core\src\context_manager\history.rs:130`
- `D:\Temp\codex-source-inspect\codex-rs\core\src\context_manager\history.rs:249`

Confirmed behavior:

- ContextManager can estimate token count.
- It normalizes history before model prompt.
- It updates token info from provider usage.
- It can replace or drop history segments.

### AILIS direction

AILIS needs an evidence layer above raw tool results:

```text
evidence_id
  source tool call
  artifact id
  range/query covered
  complete flag
  truncated flag
  reasoning_ready flag
  short human-readable claim
  payload pointer
```

For spreadsheet tasks, after `artifact_query grid A1:I20` returns complete, AILIS should pin:

```json
{
  "evidenceId": "ev_grid_...",
  "artifactId": "ctx-spreadsheet-...",
  "sheet": "Sheet1",
  "range": "A1:I20",
  "complete": true,
  "truncated": false,
  "reasoningReady": true
}
```

If the model later asks for `A10:I13`, runtime should detect coverage and return `evidence_already_available` with the pinned evidence id.

### AILIS implementation target

Likely files:

- `F:\AILIS_self_evolution_runtime\electron\ailis-context-artifact-store.cjs`
- `F:\AILIS_self_evolution_runtime\electron\ailis-agent-runner.cjs`
- `F:\AILIS_self_evolution_runtime\electron\ailis-gateway.cjs`

Required behavior:

- Pin complete non-truncated artifact observations.
- Record coverage ranges for structured artifacts.
- Detect redundant queries.
- Offer `artifact_compute` when reasoning over complete evidence is more appropriate than more reads.

### Do not do

- Do not classify "GitHub failed" or "XLSX failed" with task-specific if-statements.
- Do not treat `evidence_already_available` as an error.
- Do not assume the model will remember a full grid after context compression.
- Do not let prompt compression erase the only copy of complete evidence metadata.

## 8. Tool Search and Deferred Tool Exposure

### Source evidence

Codex implements tool search as a real tool over deferred metadata.

References:

- `D:\Temp\codex-source-inspect\codex-rs\core\src\tools\handlers\tool_search_spec.rs:7`
- `D:\Temp\codex-source-inspect\codex-rs\core\src\tools\handlers\tool_search_spec.rs:49`
- `D:\Temp\codex-source-inspect\codex-rs\core\src\tools\handlers\tool_search.rs:24`
- `D:\Temp\codex-source-inspect\codex-rs\core\src\tools\handlers\tool_search.rs:66`
- `D:\Temp\codex-source-inspect\codex-rs\core\src\tools\handlers\tool_search.rs:151`

Confirmed behavior:

- Tool search description tells the model some tools are not visible up front.
- Search engine uses BM25 over tool metadata.
- Search results are coalesced into loadable tool specs.
- The model uses `tool_search` instead of listing MCP resources for MCP tool discovery.

Codex also defers MCP tools when the set is too large.

References:

- `D:\Temp\codex-source-inspect\codex-rs\core\src\mcp_tool_exposure.rs:14`
- `D:\Temp\codex-source-inspect\codex-rs\core\src\mcp_tool_exposure.rs:16`
- `D:\Temp\codex-source-inspect\codex-rs\core\src\mcp_tool_exposure.rs:37`
- `D:\Temp\codex-source-inspect\codex-rs\core\src\mcp_tool_exposure.rs:50`

Confirmed behavior:

- Direct MCP exposure threshold is `100`.
- Exposure result separates `direct_tools` and `deferred_tools`.
- If search is enabled and tool count or feature flags require it, tools are deferred.

### AILIS direction

AILIS should expose a small core tool surface:

```text
exec_command
read
write/edit/apply_patch if available
artifact_query
tool_search
maybe current-task obvious tools
```

Everything else should be discoverable:

```text
read_xlsx_workbook
read_docx_document
pdf_extract_text
github_repo_inspect
github_pages_diagnose
browser_dom_query
email_search
calendar_read
```

### AILIS implementation target

Existing likely files:

- `F:\AILIS_self_evolution_runtime\electron\ailis-tool-routing.cjs`
- `F:\AILIS_self_evolution_runtime\electron\ailis-tool-specs.cjs`
- `F:\AILIS_self_evolution_runtime\electron\ailis-agent-runner.cjs`
- `F:\AILIS_self_evolution_runtime\electron\ailis-tool-contracts.cjs`

Required behavior:

- Build search entries from name, description, schema keys, source, skill tags, and examples.
- Search should return actual loadable tool specs, not just prose recommendations.
- Tool search should cover local tools and MCP-derived tools.

### Do not do

- Do not dump every tool declaration into the base prompt.
- Do not hide specialized readers behind only a generic "read" prompt.
- Do not make the model call `list_mcp_resources` for tool discovery.
- Do not use a hardcoded legal-tool whitelist that blocks newly loaded tools.

## 9. MCP Tool Registry and Direct MCP Tools

### Source evidence

Codex wraps each MCP tool into a first-class handler/spec.

References:

- `D:\Temp\codex-source-inspect\codex-rs\core\src\tools\handlers\mcp.rs:32`
- `D:\Temp\codex-source-inspect\codex-rs\core\src\tools\handlers\mcp.rs:38`
- `D:\Temp\codex-source-inspect\codex-rs\core\src\tools\handlers\mcp.rs:67`
- `D:\Temp\codex-source-inspect\codex-rs\core\src\tools\handlers\mcp.rs:89`
- `D:\Temp\codex-source-inspect\codex-rs\core\src\tools\handlers\mcp.rs:121`
- `D:\Temp\codex-source-inspect\codex-rs\core\src\tools\handlers\mcp.rs:143`

Confirmed behavior:

- `McpHandler` owns one `ToolInfo` and one generated `ToolSpec`.
- `tool_name()` returns the canonical MCP-derived tool name.
- `search_info()` creates searchable metadata from MCP tool info.
- `handle_call()` dispatches to `handle_mcp_tool_call` with server name and tool name known by runtime.

Codex MCP resource tools also have structured list/read handlers.

Reference:

- `D:\Temp\codex-source-inspect\codex-rs\core\src\tools\handlers\mcp_resource.rs:36`
- `D:\Temp\codex-source-inspect\codex-rs\core\src\tools\handlers\mcp_resource.rs:54`
- `D:\Temp\codex-source-inspect\codex-rs\core\src\tools\handlers\mcp_resource.rs:173`

Confirmed behavior:

- Resource listing and reading use typed argument structs.
- Resource payloads include server and uri.

### AILIS direction

AILIS should keep `mcp_bridge` for diagnostics, but normal task execution should use direct MCP-derived tools:

```text
mcp__github__create_issue
mcp__github__get_pull_request
mcp__ailis_research__web_fetch
mcp__ailis_research__pdf_extract_text
```

Runtime, not the model, should remember:

```text
model tool name -> MCP server -> MCP tool -> input schema -> risk metadata
```

### AILIS implementation target

New or refactored module:

- `F:\AILIS_self_evolution_runtime\electron\ailis-mcp-tool-registry.cjs`

Affected files:

- `F:\AILIS_self_evolution_runtime\electron\ailis-runtime.cjs`
- `F:\AILIS_self_evolution_runtime\electron\ailis-tool-runtime.cjs`
- `F:\AILIS_self_evolution_runtime\electron\ailis-tool-contracts.cjs`
- `F:\AILIS_self_evolution_runtime\electron\ailis-tool-routing.cjs`

Required behavior:

- On server connect, list MCP tools.
- Convert each MCP tool into an AILIS tool contract.
- Validate args against the real MCP input schema.
- Dispatch directly to MCP.
- Emit tool start/end events with server/tool/duration/status.

### Do not do

- Do not make the model manually pass `{server, tool, args}` for routine tasks.
- Do not expose only an indirect MCP bridge when direct schema is available.
- Do not treat MCP schema validation failure as a fatal task failure.
- Do not invent MCP tools from memory; only expose live discovered tools.

## 10. Skills and Progressive Disclosure

### Source evidence

Codex skill rendering is explicitly progressive.

References:

- `D:\Temp\codex-source-inspect\codex-rs\core-skills\src\render.rs:17`
- `D:\Temp\codex-source-inspect\codex-rs\core-skills\src\render.rs:25`
- `D:\Temp\codex-source-inspect\codex-rs\core-skills\src\render.rs:30`
- `D:\Temp\codex-source-inspect\codex-rs\core-skills\src\render.rs:47`
- `D:\Temp\codex-source-inspect\codex-rs\core-skills\src\render.rs:56`
- `D:\Temp\codex-source-inspect\codex-rs\core-skills\src\render.rs:143`
- `D:\Temp\codex-source-inspect\codex-rs\core-skills\src\render.rs:160`

Confirmed behavior:

- Skill metadata has a budget.
- Codex can truncate skill descriptions to fit a skills context budget.
- The prompt says skill bodies live in `SKILL.md`.
- The model must read `SKILL.md` before using a skill.
- It should only load directly relevant referenced files.
- It should use scripts/assets from skills instead of recreating them.

Codex skill injection only injects explicitly mentioned selected skill bodies.

References:

- `D:\Temp\codex-source-inspect\codex-rs\core-skills\src\injection.rs:58`
- `D:\Temp\codex-source-inspect\codex-rs\core-skills\src\injection.rs:75`
- `D:\Temp\codex-source-inspect\codex-rs\core-skills\src\injection.rs:80`
- `D:\Temp\codex-source-inspect\codex-rs\core-skills\src\injection.rs:90`

Confirmed behavior:

- `build_skill_injections` receives selected skills.
- It reads `SKILL.md` contents for those skills.
- It emits warnings if loading fails.
- It tracks skill invocation analytics.

### AILIS direction

AILIS skills should not be a second tool-schema injection system. They should be workflow packages:

```text
electron/skills/spreadsheet-analysis/
  SKILL.md
  scripts/
  references/
  tests/
```

`SKILL.md` should explain:

- when to use the skill,
- which tool families to search/load,
- what evidence is sufficient,
- what failure modes to avoid,
- when to use data worker or artifact compute.

### AILIS implementation target

Likely files:

- `F:\AILIS_self_evolution_runtime\electron\ailis-agent-runner.cjs`
- `F:\AILIS_self_evolution_runtime\electron\ailis-tool-contracts.cjs`
- existing skill folders under `F:\AILIS_self_evolution_runtime\electron\skills\`

Required behavior:

- Base prompt gets skill catalog only.
- Skill bodies are loaded only when selected by user, model, routing, or tool search.
- Skill body should not paste all tool contracts.
- Tool contracts come from the tool registry.

### Do not do

- Do not turn skills into regex task routers.
- Do not duplicate huge tool schemas inside `SKILL.md`.
- Do not let every skill load on every turn.
- Do not ask subagents to interpret skill instructions that the main agent never read.

## 11. Context and History Management

### Source evidence

Codex has a context manager with token accounting and normalization.

References:

- `D:\Temp\codex-source-inspect\codex-rs\core\src\context_manager\history.rs:32`
- `D:\Temp\codex-source-inspect\codex-rs\core\src\context_manager\history.rs:81`
- `D:\Temp\codex-source-inspect\codex-rs\core\src\context_manager\history.rs:91`
- `D:\Temp\codex-source-inspect\codex-rs\core\src\context_manager\history.rs:111`
- `D:\Temp\codex-source-inspect\codex-rs\core\src\context_manager\history.rs:132`
- `D:\Temp\codex-source-inspect\codex-rs\core\src\context_manager\history.rs:249`

Confirmed behavior:

- It stores response items and token usage info.
- It records items under a truncation policy.
- It prepares normalized prompt history.
- It can estimate token count.
- It updates token info from actual usage.

Codex rollout truncation works by user/fork turn boundaries.

References:

- `D:\Temp\codex-source-inspect\codex-rs\core\src\thread_rollout_truncation.rs:15`
- `D:\Temp\codex-source-inspect\codex-rs\core\src\thread_rollout_truncation.rs:35`
- `D:\Temp\codex-source-inspect\codex-rs\core\src\thread_rollout_truncation.rs:69`
- `D:\Temp\codex-source-inspect\codex-rs\core\src\thread_rollout_truncation.rs:119`
- `D:\Temp\codex-source-inspect\codex-rs\core\src\thread_rollout_truncation.rs:143`

Confirmed behavior:

- It detects user-turn boundaries.
- It handles rollback markers.
- It can keep last N fork turns.
- It avoids naive byte/line truncation of history.

### AILIS direction

AILIS should treat conversation/history context as a managed runtime object:

```text
context_manager
  raw event log
  model prompt history
  pinned evidence manifest
  artifact metadata
  token usage per round
  compacted summaries
```

Do not let raw transcript equal model prompt.

### AILIS implementation target

Likely files:

- `F:\AILIS_self_evolution_runtime\electron\ailis-agent-runner.cjs`
- `F:\AILIS_self_evolution_runtime\electron\ailis-gateway.cjs`
- `F:\AILIS_self_evolution_runtime\electron\ailis-memory-store.cjs`

Required behavior:

- Track per-round input/output/tool tokens.
- Keep raw event log for Agent Lab.
- Keep compact prompt history for model.
- Pin evidence separately from transcript.
- Before compaction, preserve evidence manifests and artifact ids.

### Do not do

- Do not compress away the only complete grid/output evidence.
- Do not keep giant tool outputs in every subsequent model turn.
- Do not mix persona/progress text into evidence state.
- Do not treat "context summary" as equivalent to "data retained".

## 12. Tool Output Truncation Contract

### Source evidence

Codex formats truncation warnings with original token count and line count.

References:

- `D:\Temp\codex-source-inspect\codex-rs\utils\output-truncation\src\lib.rs:12`
- `D:\Temp\codex-source-inspect\codex-rs\utils\output-truncation\src\lib.rs:17`
- `D:\Temp\codex-source-inspect\codex-rs\utils\output-truncation\src\lib.rs:20`
- `D:\Temp\codex-source-inspect\codex-rs\utils\output-truncation\src\lib.rs:83`

Confirmed behavior:

- `formatted_truncate_text` checks policy byte budget.
- It computes original token count.
- It computes total output lines.
- It prefixes truncated output with warning metadata.
- Function output items can be truncated under policy while preserving non-text items.

Claude Code output truncation and Bash output cap are also explicit.

References:

- `Mg6` capped output accumulator at byte offset `873217`.
- `GR6` Bash max output length at byte offset `7055797`.
- `L2` spill-to-disk output class at byte offset `7055988`.

Confirmed behavior:

- Truncated output explicitly says how many KB were removed.
- Bash output limit is configurable/bounded.
- Overflowed output can be saved to a path.

### AILIS direction

AILIS every tool output should declare:

```json
{
  "complete": true,
  "truncated": false,
  "reasoningReady": true,
  "originalBytes": 0,
  "originalTokensApprox": 0,
  "previewBytes": 0,
  "outputId": null,
  "next": null
}
```

When truncated:

```json
{
  "complete": false,
  "truncated": true,
  "truncationReason": "model_output_budget",
  "originalBytes": 620000,
  "originalTokensApprox": 155000,
  "previewBytes": 12000,
  "outputId": "out_...",
  "next": "Use output_search or output_read for targeted access."
}
```

### AILIS implementation target

Likely files:

- `F:\AILIS_self_evolution_runtime\electron\ailis-tool-runtime.cjs`
- `F:\AILIS_self_evolution_runtime\electron\ailis-tool-contracts.cjs`
- `F:\AILIS_self_evolution_runtime\electron\ailis-gateway.cjs`

Required behavior:

- Tool output adapter per tool family.
- Explicit truncation metadata.
- Complete vs preview distinction.
- Output id for full retrieval.

### Do not do

- Do not let truncation be invisible.
- Do not use only `exitCode=0` as success.
- Do not let "preview returned" mean "complete data read".
- Do not hide line/byte counts from the model.

## 13. Agent Lab and Trace Separation

### Source evidence

Codex records tool lifecycle and context separately from model-visible output.

References:

- `D:\Temp\codex-source-inspect\codex-rs\core\src\tools\registry.rs:300`
- `D:\Temp\codex-source-inspect\codex-rs\core\src\tools\registry.rs:345`
- `D:\Temp\codex-source-inspect\codex-rs\core\src\tools\handlers\mcp.rs:154`
- `D:\Temp\codex-source-inspect\codex-rs\core\src\tools\context.rs:323`
- `D:\Temp\codex-source-inspect\codex-rs\core\src\tools\context.rs:350`

Confirmed behavior:

- Tool registry notifies tool start and finish.
- Tool output has log preview, response item, code mode result, hook payloads.
- MCP tool output includes wall time and truncation policy.

Claude Code also separates runtime display from model result:

- `L2` tracks full output, recent lines, total lines, total bytes, timeout, task id, overflow state.
- UI rendering around Bash result uses full output and display-specific fields near byte offset `7218141`.

### AILIS direction

Agent Lab should show:

```text
full trace
full stdout/stderr
full artifact payload
tool timing
token usage
evidence graph
coverage graph
failure chain
model-visible preview
```

The model should see:

```text
compact observation
tool status
counts
evidence ids
query affordances
```

### AILIS implementation target

Likely files:

- `F:\AILIS_self_evolution_runtime\electron\ailis-gateway.cjs`
- `F:\AILIS_self_evolution_runtime\src\control-panel-app.js`
- Agent Lab frontend components if split later.

Required behavior:

- Keep trace storage rich.
- Keep model prompt lean.
- Make Agent Lab able to inspect full output/artifact via ids.
- Show whether the model saw complete data or only preview.

### Do not do

- Do not use the same string for UI trace and model observation.
- Do not compress Agent Lab raw traces just because model context must be compact.
- Do not hide tool failure details behind friendly generic text.
- Do not let later successful steps erase unresolved critical evidence failures.

## 14. Data Worker / Artifact Compute

### Source evidence

Claude Code uses dedicated tools and instructions for targeted reading and chunking. It does not rely on the model holding giant file contents in working memory.

References:

- `E96` file reader at byte offset `9632031`.
- `MTz` long-file instruction at byte offset `6816469`.
- `eEK` notebook/PDF/image/text routing at byte offset `9776413`.

Codex supports subagent/multi-agent tools and context-managed history, though the exact data-worker pattern is product-level and not a single source file in the inspected core.

References:

- `D:\Temp\codex-source-inspect\codex-rs\core\src\tools\handlers\multi_agents.rs`
- `D:\Temp\codex-source-inspect\codex-rs\core\src\tools\handlers\multi_agents_v2.rs`
- `D:\Temp\codex-source-inspect\codex-rs\core\src\context_manager\history.rs`

Confirmed boundary:

- Codex has multi-agent/subagent infrastructure.
- Claude Code has chunked targeted read infrastructure.
- AILIS `artifact_compute` is an inferred architecture combining these observed patterns; it is not claimed as a copied named feature from either product.

### AILIS direction

AILIS should add `artifact_compute` for deterministic or subagent-assisted analysis:

```json
{
  "artifactId": "ctx-spreadsheet-...",
  "task": "Find the path from START to END using color transition rules.",
  "evidencePolicy": "return steps, cells used, and contradictions",
  "maxOutputTokens": 2000
}
```

For spreadsheet/path/log/document tasks, the data worker can:

- load full artifact payload outside main model context,
- compute candidate answer,
- return concise evidence,
- attach trace and payload references for Agent Lab.

### AILIS implementation target

Likely files:

- `F:\AILIS_self_evolution_runtime\electron\ailis-context-artifact-store.cjs`
- `F:\AILIS_self_evolution_runtime\electron\ailis-agent-runner.cjs`
- new optional file: `F:\AILIS_self_evolution_runtime\electron\ailis-artifact-compute.cjs`

Required behavior:

- Start with deterministic compute for spreadsheet grid/path/table queries.
- Add subagent later only when deterministic compute is not enough.
- Always return evidence ids and trace ids.

### Do not do

- Do not ask the main model to memorize a 20x9 grid plus rules across many turns.
- Do not hide data-worker reasoning; store it in Agent Lab trace.
- Do not make `artifact_compute` one benchmark-specific solver only.
- Do not prevent raw evidence inspection; provide controlled read/query access.

## 15. Failure Observation Contract

### Source evidence

Codex returns detailed errors to the model when exec fails at the runtime boundary.

References:

- `D:\Temp\codex-source-inspect\codex-rs\core\src\tools\handlers\unified_exec\exec_command.rs:396`
- `D:\Temp\codex-source-inspect\codex-rs\core\src\tools\handlers\unified_exec\exec_command.rs:522`
- `D:\Temp\codex-source-inspect\codex-rs\core\src\tools\handlers\unified_exec\exec_command.rs:526`
- `D:\Temp\codex-source-inspect\codex-rs\core\src\tools\handlers\unified_exec\exec_command.rs:530`

Confirmed behavior:

- Runtime releases process id on open failure.
- Sandbox denial output is converted into model-visible exec output.
- Other failures include command display and error details.

Claude Code Read errors are specific:

- `FileTooLargeError` in `E96` at byte offset `9632031`.
- `MaxFileReadTokenExceededError` near Read schema at byte offset `9781964`.
- PDF too-many-pages errors in `eEK` at byte offset `9776413`.

### AILIS direction

Every failure should be returned as reasoned structured observation:

```json
{
  "status": "failed",
  "failureKind": "file_too_large",
  "message": "File content exceeds maximum allowed size.",
  "cause": {
    "sizeBytes": 620000,
    "maxBytes": 131072
  },
  "recoverable": true,
  "recommendedNext": [
    {"tool": "read", "args": {"offsetLine": 1, "limitLines": 500}},
    {"tool": "search", "args": {"pattern": "..."}}
  ]
}
```

### AILIS implementation target

Likely files:

- `F:\AILIS_self_evolution_runtime\electron\ailis-tool-runtime.cjs`
- `F:\AILIS_self_evolution_runtime\electron\ailis-tool-contracts.cjs`
- `F:\AILIS_self_evolution_runtime\electron\ailis-agent-runner.cjs`

Required behavior:

- Standardize `failureKind`.
- Preserve raw error details in Agent Lab.
- Give model repair actions.
- Do not overwrite unresolved failures with later ordinary successes.

### Do not do

- Do not return a fixed sentence for all tool failures.
- Do not hide validation errors.
- Do not make failures sound like success.
- Do not classify failures with task-specific business rules.

## 16. Recommended Implementation Order

### Phase 1: Stop the current failure loops

Source-backed modules:

- Claude Code Read state/dedup.
- Codex output metadata/truncation.
- Codex environment context.

AILIS tasks:

1. Add `runtime_environment` turn context.
2. Ensure exec returns structured metadata and failure reasons.
3. Add read/artifact state with `file_unchanged` and `evidence_already_available`.
4. Pin complete artifact observations and coverage.

Expected effect:

- Fewer Windows/Linux command mistakes.
- Less repeated file/artifact reading.
- More visible failure causes.

### Phase 2: Make large data usable

Source-backed modules:

- Claude Code chunked Read.
- Claude Code PDF/page handling.
- Codex truncation contract.
- Codex unified exec output metadata.

AILIS tasks:

1. Complete Exec Output Store.
2. Add text read ranges and search.
3. Add artifact payload chunk/search/tail.
4. Add `artifact_compute` for spreadsheet/log/document evidence.

Expected effect:

- Large logs and spreadsheets stop exploding context.
- Model can retrieve only needed details.
- Agent Lab can inspect full data.

### Phase 3: Fix tool/MCP architecture

Source-backed modules:

- Codex `McpHandler`.
- Codex `mcp_tool_exposure`.
- Codex `tool_search`.
- Codex progressive skills.

AILIS tasks:

1. Build `McpToolSpecRegistry`.
2. Convert MCP tools into direct model-visible tools.
3. Keep large/niche tools deferred behind `tool_search`.
4. Split skill workflow docs from tool schema injection.

Expected effect:

- Fewer invalid MCP wrapper calls.
- Tool discovery becomes natural.
- Prompt size drops.

### Phase 4: Make long tasks stable

Source-backed modules:

- Codex context manager.
- Codex rollout truncation.
- Codex token usage tracking.

AILIS tasks:

1. Separate raw trace from model prompt history.
2. Track token usage per round.
3. Keep pinned evidence outside prompt compression.
4. Add Agent Lab evidence graph and bottleneck view.

Expected effect:

- Long tasks stop degrading after many turns.
- Debugging can show exactly what evidence was seen and what was only stored.

## 17. Anti-Patterns to Avoid

These are explicitly against the inspected Codex/Claude Code design shape.

| Anti-pattern | Why it is wrong | Source-backed alternative |
|---|---|---|
| Regex-convert Unix commands to PowerShell | Brittle and hides environment from model | Codex injects shell/cwd context and PowerShell tool guidance |
| Return only `exitCode=0` | No evidence, no timing, no output state | Codex returns wall time, exit code, session id, token count, output |
| Let generic read open XLSX/DOCX/PDF as text | Binary/structured data becomes garbage/context explosion | Claude Code routes images/PDF/notebooks specially and rejects unsupported binary |
| Expose all tools every turn | Prompt bloat and worse tool choice | Codex uses deferred MCP tools and BM25 `tool_search` |
| Put tool schemas inside skill docs | Duplicates contracts and bloats prompt | Codex skills are progressive workflow packages |
| Treat raw transcript as model context | Old huge observations pollute every turn | Codex context manager normalizes and truncates history |
| Hide truncation | Model reasons from incomplete data as if complete | Codex and CC add explicit truncation warnings |
| Fatal-stop on one bad tool arg | Model cannot repair recoverable mistakes | Return structured validation error with expected schema |
| Hardcode GitHub/XLSX special failure classes | Does not generalize and creates conflicts | Generic failure/evidence/output contracts |

## 18. Practical Acceptance Tests

These tests should be added before claiming the architecture is fixed.

### Environment test

Prompt:

```text
Tell me the current shell and run a command that lists the first 3 files in the workspace.
```

Expected:

- Model uses correct shell syntax for the runtime environment.
- Exec observation includes wall time, exit code, output preview, and output id if needed.

### Large text test

Input:

- A 500KB text file with answer in the middle.

Expected:

- Generic read does not dump entire file.
- Model uses search/range or output tools.
- Observation marks complete/truncated accurately.

### XLSX artifact test

Input:

- Previous GAIA-like XLSX map task.

Expected:

- `read_xlsx_workbook` creates artifact.
- Model uses `artifact_query`.
- A complete grid pins evidence.
- Repeated subrange query returns `evidence_already_available`.
- If reasoning remains complex, model uses `artifact_compute`.

### MCP discovery test

Prompt:

```text
Find a tool that can read a PDF and extract pages 3-5.
```

Expected:

- Model calls `tool_search`.
- PDF tool is loaded.
- It does not call raw `mcp_bridge` unless debugging MCP.

### Failure repair test

Prompt:

```text
Read a file larger than the single-read limit and answer a marker in the middle.
```

Expected:

- First oversized read returns specific failure.
- Model repairs with range/search.
- Final answer cites evidence id or range.

## 19. Summary Mapping

| AILIS module | Codex reference | Claude Code reference | Required AILIS behavior |
|---|---|---|---|
| `runtime_environment` | `environment_context.rs`, `shell.rs` | Bash/Read prompts assume explicit tool context | Inject real cwd/shell/os every turn |
| `exec_command` | `shell_spec.rs`, `unified_exec/*`, `tools/context.rs` | Bash `GR6`, `L2`, `Mg6` | Structured output + output store |
| `read` | `context_manager/history.rs`, truncation helpers | `RZY`, `E96`, `DH8`, `eEK` | Range reads, line metadata, binary guards |
| `artifact_store` | Codex output/truncation contracts | CC special file routing | Large structured data as queryable artifact |
| `evidence_gate` | Context manager/token history | Read state/dedup `jL6` | Pin complete evidence, stop redundant reads |
| `tool_search` | `tool_search.rs`, `tool_search_spec.rs` | Not equivalent in CC bundle | Deferred discoverable tools |
| `mcp_registry` | `mcp.rs`, `mcp_tool_exposure.rs` | MCP in CC not inspected deeply here | Direct MCP-derived tools |
| `skills` | `core-skills/render.rs`, `injection.rs` | CC tool prompts separate from file readers | Progressive workflow packages |
| `Agent Lab` | Tool registry/lifecycle/context output separation | Bash display/output state `L2` | Full trace outside model prompt |

## 20. Final Engineering Principle

The stable architecture is not "add more prompt rules". It is:

```text
Runtime owns environment, schemas, validation, output storage, evidence coverage, and context budgets.
Model owns intent, planning, reasoning, and choosing the next action from accurate affordances.
Agent Lab owns full observability.
```

AILIS should move in that direction before adding more task-specific skills. Otherwise every new tool increases the chance of conflict, repeated reads, truncation loops, and hidden failures.
