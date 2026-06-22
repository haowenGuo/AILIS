import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const root = process.cwd();
const rel = (...parts) => path.join(...parts);
const abs = (...parts) => path.join(root, ...parts);

const human = {
  runtime: rel('electron', 'ailis-runtime.cjs'),
  toolRuntime: rel('electron', 'ailis-tool-runtime.cjs'),
  toolSpecs: rel('electron', 'ailis-tool-specs.cjs'),
  gateway: rel('electron', 'ailis-gateway.cjs'),
  runner: rel('electron', 'ailis-agent-runner.cjs'),
  runtimeTest: rel('tests', 'ailis-runtime.test.mjs'),
};

const codex = {
  common: rel('build-cache', 'codex-runtime', 'codex-rs', 'app-server-protocol', 'src', 'protocol', 'common.rs'),
  item: rel('build-cache', 'codex-runtime', 'codex-rs', 'app-server-protocol', 'src', 'protocol', 'v2', 'item.rs'),
  mcp: rel('build-cache', 'codex-runtime', 'codex-rs', 'app-server-protocol', 'src', 'protocol', 'v2', 'mcp.rs'),
  thread: rel('build-cache', 'codex-runtime', 'codex-rs', 'core', 'src', 'codex_thread.rs'),
  shell: rel('build-cache', 'codex-runtime', 'codex-rs', 'core', 'src', 'tools', 'handlers', 'shell.rs'),
  handlerMod: rel('build-cache', 'codex-runtime', 'codex-rs', 'core', 'src', 'tools', 'handlers', 'mod.rs'),
  multiAgents: rel('build-cache', 'codex-runtime', 'codex-rs', 'core', 'src', 'tools', 'handlers', 'multi_agents_common.rs'),
  appClient: rel('build-cache', 'codex-runtime', 'codex-rs', 'app-server-client', 'src', 'lib.rs'),
};

function findDistFile(prefix) {
  const dist = abs('build-cache', 'openclaw-runtime', 'dist');
  if (!fs.existsSync(dist)) return null;
  const match = fs.readdirSync(dist).find((entry) => entry.startsWith(prefix) && entry.endsWith('.js'));
  return match ? rel('build-cache', 'openclaw-runtime', 'dist', match) : null;
}

const openclaw = {
  agentEvents: findDistFile('agent-events-'),
  acpCli: findDistFile('acp-cli-'),
  extraParams: findDistFile('extra-params-'),
  agentRunner: findDistFile('agent-runner.runtime-'),
  toolPolicy: findDistFile('tool-policy-'),
  tools: findDistFile('openclaw-tools-'),
  subagentsDoc: rel('build-cache', 'openclaw-runtime', 'docs', 'tools', 'subagents.md'),
  transcriptDoc: rel('build-cache', 'openclaw-runtime', 'docs', 'reference', 'transcript-hygiene.md'),
  acpDoc: rel('build-cache', 'openclaw-runtime', 'docs', 'cli', 'acp.md'),
};

const checks = [
  {
    id: 'formal-item-transcript-and-events',
    verdict: 'aligned-conceptually',
    evidence: [
      ev('Codex item lifecycle protocol', codex.common, ['TurnStarted => "turn/started"', 'ItemStarted => "item/started"', 'ItemCompleted => "item/completed"', 'PlanDelta => "item/plan/delta"']),
      ev('OpenClaw agent event streams', openclaw.agentEvents, ['stream: "item"', 'stream: "plan"', 'stream: "approval"']),
      ev('AILIS JSONL runtime transcript', human.runtime, ["type: 'thread.started'", "type: 'turn.started'", "item.type === 'tool.call'", "type: 'tool.result'", "this.emitGatewayEvent('runtime.item'"]),
      ev('AILIS SSE transcript route', human.gateway, ["url.pathname === '/transcript'", 'formatSseEvent(event)', 'writeGatewayEventToClient']),
    ],
  },
  {
    id: 'update-plan-as-real-runtime-tool',
    verdict: 'aligned',
    evidence: [
      ev('Codex plan delta notification', codex.item, ['pub struct PlanDeltaNotification', 'pub delta: String']),
      ev('OpenClaw plan tool and stream', openclaw.toolPolicy, ['id: "update_plan"', 'label: "update_plan"']),
      ev('AILIS update_plan tool definition', human.toolSpecs, ["id: 'update_plan'", 'AILIS_RUNTIME_TOOL_DEFINITIONS']),
      ev('AILIS update_plan transcript event', human.runtime, ["type: 'plan.updated'", 'async updatePlan']),
      ev('AILIS agent drives update_plan', human.runner, ["tool: 'update_plan'", 'plan_update']),
    ],
  },
  {
    id: 'tool-exposure-and-catalog',
    verdict: 'aligned-simplified',
    evidence: [
      ev('OpenClaw broad tool catalog', openclaw.toolPolicy, ['id: "update_plan"', 'id: "exec"', 'id: "read"', 'id: "subagents"']),
      ev('AILIS gateway exposes registry-backed tools', human.gateway, ['const gatewayDefinitions = this.gatewayToolRuntimeRegistry.listDefinitions()', 'const runtimeTools = gatewayDefinitions', 'codex_like_gateway_tool_registry']),
      ev('AILIS runtime exposes tool definitions', human.runtime, ['getRuntimeToolDefinitions()', 'toolRuntimeRegistry']),
      ev('AILIS Codex-like tool runtime registry', human.toolRuntime, ['class AILISToolRuntimeRegistry', 'modelVisibleSpecs', 'async dispatch']),
    ],
  },
  {
    id: 'approval-and-policy-classification',
    verdict: 'aligned-simplified',
    evidence: [
      ev('Codex approval guard for exec escalation', codex.shell, ['Approval policy guard', 'requests_sandbox_override()', 'AskForApproval::OnRequest']),
      ev('Codex validates additional permissions', codex.handlerMod, ['normalize_and_validate_additional_permissions', 'approval_policy: AskForApproval']),
      ev('OpenClaw ACP approval classifier', openclaw.acpCli, ['function classifyAcpToolApproval', '"readonly_scoped"', 'approvalClass: "exec_capable"', 'approvalClass: "control_plane"', 'approvalClass: "mutating"']),
      ev('AILIS policy classification', human.runtime, ['classifyToolCall', 'evaluateToolCall', "class: 'readonly_scoped'", "class: 'exec_capable'", "class: 'control_plane'"]),
    ],
  },
  {
    id: 'sandbox-and-permission-profile',
    verdict: 'partial-gap-no-container-sandbox',
    evidence: [
      ev('Codex derives sandbox from permission profile', codex.thread, ['pub approval_policy: AskForApproval', 'pub permission_profile: PermissionProfile', 'pub fn sandbox_policy(&self) -> SandboxPolicy']),
      ev('Codex exec uses sandbox policy', codex.shell, ['file_system_sandbox_policy', 'permission_profile: turn.permission_profile()']),
      ev('AILIS permission profile model', human.runtime, ['normalizePermissionProfile', "fileSystem: 'workspace-write'", "shell: 'approval-required'", "approvalPolicy: 'on-request'"]),
    ],
  },
  {
    id: 'transcript-repair',
    verdict: 'openclaw-aligned-codex-adjacent',
    evidence: [
      ev('OpenClaw synthetic missing tool result', openclaw.extraParams, ['missing tool result in session history', 'makeMissingToolResult', 'repairToolUseResultPairing']),
      ev('OpenClaw transcript hygiene docs', openclaw.transcriptDoc, ['Tool result pairing repair', 'synthetic tool results']),
      ev('AILIS transcript repair inserts missing tool.result', human.runtime, ['async repairTranscript', "status: 'repaired_missing_result'", "type: 'transcript.repair'"]),
      ev('AILIS repair test', human.runtimeTest, ['repairs incomplete transcripts', "status === 'repaired_missing_result'"]),
    ],
  },
  {
    id: 'tool-result-guard',
    verdict: 'aligned-simplified',
    evidence: [
      ev('OpenClaw result cleanup exports', openclaw.extraParams, ['stripToolResultDetails', 'sanitizeToolUseResultPairing']),
      ev('AILIS guard redacts and truncates results', human.runtime, ['guardToolResult', 'redactObject(part)', 'next.truncated = true', "status: 'guarded'"]),
      ev('AILIS gateway guards every result', human.gateway, ['const guardedResult = this.runtime.guardToolResult(result, { toolId, callId })', 'const guardedError = this.runtime.guardToolResult']),
    ],
  },
  {
    id: 'mcp-bridge',
    verdict: 'aligned-simplified-stdio-session-manager',
    evidence: [
      ev('Codex MCP tool call protocol', codex.mcp, ['pub struct McpServerToolCallParams', 'pub server: String', 'pub tool: String', 'pub struct McpServerToolCallResponse']),
      ev('OpenClaw ACP MCP bridge constraints', openclaw.acpDoc, ['Per-session `mcpServers` are not supported in bridge mode', 'plugin-tools-mcp-bridge']),
      ev('AILIS MCP runtime bridge surface', human.toolSpecs, ["id: 'mcp_bridge'", 'AILIS_RUNTIME_TOOL_DEFINITIONS']),
      ev('AILIS MCP direct dispatch', human.toolRuntime, ['dispatchDirectMcpTool', 'tool_search']),
      ev('AILIS MCP call lifecycle', human.runtime, ['executeMcpBridge', "type: 'mcp.tool.call.begin'", "type: 'mcp.tool.call.end'"]),
      ev('AILIS MCP stdio session manager', rel('electron', 'ailis-mcp-session.cjs'), ['class AILISMcpManager', "session.request('tools/list'", "session.request('tools/call'", "session.request('resources/read'"]),
    ],
  },
  {
    id: 'subagent-relay',
    verdict: 'aligned-simplified-child-runner',
    evidence: [
      ev('Codex child agents inherit runtime policy', codex.multiAgents, ['apply_spawn_agent_runtime_overrides', 'approval_policy', 'set_permission_profile']),
      ev('OpenClaw subagent orchestration docs', openclaw.subagentsDoc, ['sessions_spawn', '`subagents`', 'Completion is push-based']),
      ev('AILIS subagent runtime definition', human.toolSpecs, ["id: 'subagents'", 'AILIS_RUNTIME_TOOL_DEFINITIONS']),
      ev('AILIS subagent runtime dispatch', human.toolRuntime, ['definitionById.subagents']),
      ev('AILIS subagent runner surface', human.runtime, ['startSubagentRun', 'this.subagentRuns.set', "type: 'subagent.completed'"]),
    ],
  },
  {
    id: 'approval-resume',
    verdict: 'aligned-simplified-durable-pending-store',
    evidence: [
      ev('AILIS agent pending approval', human.runner, ['storePendingAgentApproval', 'executePendingAgentApproval', 'approvalType: \'agent_tool_call\'']),
      ev('AILIS durable pending store', human.runner, ['pending-agent-state.json', 'loadPendingState', 'persistPendingState', 'durable_pending_store']),
      ev('AILIS policy can request approval', human.runtime, ["? 'approval.requested'", "result.status === 'needs_approval'"]),
      ev('Codex approval mode appears in thread config', codex.thread, ['pub approval_policy: AskForApproval']),
    ],
  },
  {
    id: 'local-core-computer-tools',
    verdict: 'ailis-specific-aligned-to-codex-tool-shape',
    evidence: [
      ev('Codex command execution handler', codex.shell, ['ToolEmitter::shell', 'ShellRequest', 'intercept_apply_patch']),
      ev('AILIS local core tools registered as runtime tools', human.gateway, ['createGatewayToolRuntimeRegistry', "'ailis-local-core'", 'executeGatewayLocalTool']),
      ev('AILIS gateway dispatches through registry first', human.gateway, ['this.gatewayToolRuntimeRegistry.dispatch', 'this.executeGatewayLocalTool']),
      ev('AILIS agent prompt exposes computer actions', human.runner, ['computer action：list/tree/stat/read/write/write_binary/append/mkdir/copy/move/rename/delete/search/hash/du/exec_command/write_stdin/exec/session_start/process_read/process_write/process_kill/pty_start/pty_write/pty_kill/watch/watch_stop/rollback_list/rollback_restore/acl_get/acl_set']),
    ],
  },
  {
    id: 'event-backpressure-and-lossless-tier',
    verdict: 'aligned-simplified-cursor-replay-and-slow-consumer-guard',
    evidence: [
      ev('Codex lossless event delivery tier', codex.appClient, ['server_notification_requires_delivery', 'ItemCompleted(_)', 'TurnCompleted(_)', 'PlanDelta(_)']),
      ev('AILIS SSE event route', human.gateway, ['this.sseClients', 'eventLog', 'getEventsAfter', 'writeGatewayEventToClient']),
      ev('AILIS transcript JSONL persistence', human.runtime, ['fsp.appendFile(run.transcriptPath', 'JSON.stringify(transcriptItem)']),
    ],
  },
];

function ev(label, file, patterns, required = true) {
  return { label, file, patterns, required };
}

function readText(file) {
  if (!file) return null;
  const full = abs(file);
  if (!fs.existsSync(full)) return null;
  return fs.readFileSync(full, 'utf8');
}

function lineNumber(text, needle) {
  const index = text.indexOf(needle);
  if (index < 0) return null;
  return text.slice(0, index).split(/\r?\n/).length;
}

function evaluateEvidence(item) {
  const text = readText(item.file);
  if (text == null) {
    return {
      ...item,
      ok: false,
      missing: ['file_missing'],
      matches: [],
    };
  }
  const matches = [];
  const missing = [];
  for (const pattern of item.patterns) {
    const found = text.includes(pattern);
    if (!found) {
      missing.push(pattern);
      continue;
    }
    matches.push({
      pattern,
      line: lineNumber(text, pattern),
    });
  }
  return {
    ...item,
    ok: missing.length === 0,
    missing,
    matches,
  };
}

function getOpenClawVersion() {
  const pkg = abs('build-cache', 'openclaw-runtime', 'package.json');
  if (!fs.existsSync(pkg)) return 'missing';
  const json = JSON.parse(fs.readFileSync(pkg, 'utf8'));
  return `${json.name || 'openclaw'}@${json.version || 'unknown'}`;
}

function getCodexVersion() {
  const dir = abs('build-cache', 'codex-runtime');
  if (!fs.existsSync(path.join(dir, '.git'))) return 'missing';
  try {
    return execFileSync('git', ['-C', dir, 'rev-parse', '--short', 'HEAD'], { encoding: 'utf8' }).trim();
  } catch {
    return 'unknown';
  }
}

const evaluated = checks.map((check) => {
  const evidence = check.evidence.map(evaluateEvidence);
  const requiredFailures = evidence.filter((item) => item.required && !item.ok);
  return {
    ...check,
    evidence,
    ok: requiredFailures.length === 0,
    requiredFailures,
  };
});

const failed = evaluated.filter((check) => !check.ok);

console.log('AILIS runtime alignment verification');
console.log(`OpenClaw reference: ${getOpenClawVersion()}`);
console.log(`Codex reference: ${getCodexVersion()}`);
console.log('');

for (const check of evaluated) {
  const status = check.ok ? 'PASS' : 'FAIL';
  console.log(`[${status}] ${check.id} (${check.verdict})`);
  for (const item of check.evidence) {
    const marker = item.ok ? '  - ok' : item.required ? '  - missing' : '  - optional-missing';
    const firstMatch = item.matches[0];
    const suffix = firstMatch ? `:${firstMatch.line}` : '';
    console.log(`${marker}: ${item.label} :: ${item.file || 'unresolved'}${suffix}`);
    if (!item.ok) {
      for (const missing of item.missing) {
        console.log(`      missing pattern: ${missing}`);
      }
    }
  }
}

console.log('');
console.log(`Summary: ${evaluated.length - failed.length}/${evaluated.length} checks passed.`);

if (failed.length) {
  process.exitCode = 1;
}
