# AILIS Gateway v0

AILIS Gateway v0 is a thin local HTTP gateway for the personal Claw build. It does not reimplement OpenClaw tools. It provides one stable entrypoint for the frontend and future agent loop.

Default URL when the Electron app is running:

```text
http://127.0.0.1:19777
```

## Endpoints

```http
GET /health
```

Returns gateway status, workspace root, audit log path, and OpenClaw tool-surface validation summary.

```http
GET /tools
GET /tools/list
```

Returns the OpenClaw-aligned tool registry:

- `coreTools`: 33 mirrored OpenClaw core tools
- `optionalRuntimeTools`: optional runtime tools such as `pdf`
- `channelMcpTools`: 9 OpenClaw channel MCP tools

Each tool includes a route and status such as `available`, `needs_config`, `needs_session`, `needs_pairing`, `skipped_external`, or `not_materialized`.

```http
POST /tools/call
```

Calls one tool through the gateway.

```json
{
  "tool": "read",
  "args": {
    "path": "README.md"
  },
  "context": {
    "workspace": "F:/AILIS"
  }
}
```

Response:

```json
{
  "ok": true,
  "callId": "...",
  "tool": "read",
  "status": "completed",
  "durationMs": 12,
  "result": {}
}
```

```http
POST /rpc
```

Supports:

- `gateway.health`
- `tools.list`
- `tools.call`
- `audit.list`

```http
GET /events
```

Server-sent events stream. Emits `gateway.started`, `tool.call.started`, and `tool.call.finished`.

```http
GET /audit?limit=100
```

Reads recent audit log entries. Sensitive fields such as tokens, passwords, secrets, and API keys are redacted.

## Safety Defaults

- File tools are confined to the configured workspace root.
- `apply_patch` paths must be relative workspace paths.
- `exec` requires `context.approved=true`.
- `message` is forced to `dryRun=true` unless `context.approved=true`.
- Browser, canvas, media generation, PDF, and memory tools are treated as external side-effect tools unless explicitly enabled with `context.executeExternal=true`.
- Every tool call is written to the audit log.

## Validation

Run:

```bash
pnpm ailis:smoke-gateway
pnpm test:ailis-gateway
```

The smoke test verifies:

- Gateway starts on a local port.
- `/health` returns OK.
- `/tools` exposes 33 core, 1 optional runtime, and 9 channel MCP tools.
- `write` and `read` execute through OpenClaw runtime tools.
- `exec` is blocked without approval.
- `exec` runs with `context.approved=true`.
- Audit entries are written.
