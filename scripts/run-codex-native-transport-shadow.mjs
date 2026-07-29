import fs from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const {
    buildCodexBridgeDecisionSchema,
    buildCodexResponsesRequest,
    callCodexAppServerBridgeOnce,
    callCodexModelBridge
} = require('../electron/codex-model-bridge.cjs');

function parseArgs(argv = process.argv.slice(2)) {
    const args = {};
    for (let index = 0; index < argv.length; index += 1) {
        const token = argv[index];
        if (!token.startsWith('--')) {
            continue;
        }
        const [key, inlineValue] = token.slice(2).split('=', 2);
        args[key] = inlineValue ?? argv[index + 1] ?? true;
        if (inlineValue === undefined && argv[index + 1] && !argv[index + 1].startsWith('--')) {
            index += 1;
        }
    }
    return args;
}

async function readJsonLines(filePath) {
    const text = await fs.readFile(filePath, 'utf8');
    return text.split(/\r?\n/).filter(Boolean).map((line) => JSON.parse(line));
}

async function walkFiles(rootPath, predicate, output = []) {
    const entries = await fs.readdir(rootPath, { withFileTypes: true });
    for (const entry of entries) {
        const filePath = path.join(rootPath, entry.name);
        if (entry.isDirectory()) {
            await walkFiles(filePath, predicate, output);
        } else if (predicate(filePath)) {
            output.push(filePath);
        }
    }
    return output;
}

async function loadTaskSnapshot(sourceRoot, taskId) {
    const transcriptFiles = await walkFiles(
        path.join(sourceRoot, 'p1'),
        (filePath) =>
            filePath.endsWith('.jsonl') &&
            filePath.includes(`${path.sep}transcripts${path.sep}`) &&
            filePath.includes(taskId)
    );
    const snapshots = [];
    for (const transcriptFile of transcriptFiles) {
        const items = await readJsonLines(transcriptFile);
        for (const item of items) {
            if (item?.type === 'agent.context_snapshot' && item?.payload?.model_input_request) {
                snapshots.push({
                    transcriptFile,
                    iteration: Number(item.payload.iteration || 0),
                    payload: item.payload
                });
            }
        }
    }
    snapshots.sort((left, right) => left.iteration - right.iteration);
    if (!snapshots.length) {
        throw new Error(`No model input snapshot found for ${taskId}.`);
    }
    return snapshots.at(-1);
}

function summarizeResult(result, elapsedMs) {
    const responseItems = result?.providerMessage?.responseItems || [];
    return {
        ok: result?.ok === true,
        code: result?.code || '',
        elapsedMs,
        toolCallCount: Array.isArray(result?.toolCalls) ? result.toolCalls.length : 0,
        toolNames: (result?.toolCalls || []).map((call) => call.name),
        contentChars: String(result?.content || '').length,
        canonicalItemTypes: responseItems.map((item) => item.type),
        canonicalItemCount: responseItems.length,
        parallelToolCalls: result?.providerMessage?.parallelToolCalls === true,
        usage: result?.usage || null,
        error: result?.ok ? '' : result?.error || 'unknown'
    };
}

async function runTransport(label, fn) {
    const startedAt = Date.now();
    try {
        return {
            label,
            ...summarizeResult(await fn(), Date.now() - startedAt)
        };
    } catch (error) {
        return {
            label,
            ok: false,
            code: 'shadow_exception',
            elapsedMs: Date.now() - startedAt,
            toolCallCount: 0,
            toolNames: [],
            contentChars: 0,
            canonicalItemTypes: [],
            canonicalItemCount: 0,
            parallelToolCalls: false,
            usage: null,
            error: error?.message || String(error)
        };
    }
}

function markdownTable(rows) {
    return [
        '| Side | Task | Iteration | OK | Input tokens | Cached | Output tokens | Latency ms | Calls | Canonical items |',
        '|---|---|---:|---:|---:|---:|---:|---:|---|---|',
        ...rows.flatMap((row) => row.transports.map((transport) => [
            transport.label,
            row.taskId.slice(0, 8),
            row.iteration,
            transport.ok ? 'yes' : 'no',
            transport.usage?.prompt_tokens ?? '',
            transport.usage?.prompt_tokens_details?.cached_tokens ?? '',
            transport.usage?.completion_tokens ?? '',
            transport.elapsedMs,
            transport.toolNames.join(', ') || '(prose/error)',
            transport.canonicalItemTypes.join(', ') || '(legacy/none)'
        ].map((value) => String(value).replace(/\|/g, '\\|')).join(' | ').replace(/^/, '| ').concat(' |')))
    ].join('\n');
}

function buildMarkdown(report) {
    return [
        '# P1 Native Tool Transport Shadow A/B',
        '',
        `- Created: ${report.createdAt}`,
        `- Source: \`${report.sourceRoot}\``,
        `- Candidate commit: \`${report.candidateCommit}\``,
        '- Scope: transport only; no tools were executed.',
        '- Scoring: diagnostic and excluded from GAIA score.',
        '- Behavior policy: P1 finalization, audit, answer selection, and tool implementations were unchanged.',
        '',
        '## Results',
        '',
        markdownTable(report.rows),
        '',
        '## Aggregate',
        '',
        `- Legacy successful probes: ${report.aggregate.legacyOk}/${report.rows.length}`,
        `- Native successful probes: ${report.aggregate.nativeOk}/${report.rows.length}`,
        `- Legacy input tokens: ${report.aggregate.legacyInputTokens}`,
        `- Native input tokens: ${report.aggregate.nativeInputTokens}`,
        `- Input-token change: ${report.aggregate.inputTokenDeltaPercent}%`,
        `- Legacy latency: ${report.aggregate.legacyLatencyMs} ms`,
        `- Native latency: ${report.aggregate.nativeLatencyMs} ms`,
        `- Native multi-call responses: ${report.aggregate.nativeMultiCallResponses}`,
        '',
        'This shadow establishes transport compatibility and cost/shape changes only. It does not establish task correctness or justify a full GAIA gate.'
    ].join('\n');
}

const args = parseArgs();
const sourceRoot = path.resolve(String(args.source || ''));
const outputDir = path.resolve(String(args.output || path.join(process.cwd(), 'tmp', 'codex-native-transport-shadow')));
const taskSpecs = String(args.tasks || '')
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((entry) => {
        const [taskId, side = 'unspecified'] = entry.split(':', 2);
        return { taskId, side };
    });

if (!sourceRoot || !taskSpecs.length) {
    throw new Error('Usage: --source <P1-vs-Codex result root> --tasks <taskId:correct,taskId:failed> [--output <dir>]');
}

await fs.mkdir(outputDir, { recursive: true });
const results = await readJsonLines(path.join(sourceRoot, 'p1', 'results.jsonl'));
const resultByTask = new Map(results.map((row) => [row.task_id, row]));
const settings = {
    model: String(args.model || 'gpt-5.5'),
    reasoningEffort: String(args.effort || 'medium'),
    timeoutMs: Number(args.timeout || 120000),
    codexBridgeMaxAttempts: 1
};
const transportMode = String(args.transport || 'both').toLowerCase();
const runLegacy = transportMode === 'both' || transportMode === 'legacy';
const runNative = transportMode === 'both' || transportMode === 'native';
if (!runLegacy && !runNative) {
    throw new Error('--transport must be one of: both, legacy, native.');
}
const rows = [];

for (const taskSpec of taskSpecs) {
    const snapshot = await loadTaskSnapshot(sourceRoot, taskSpec.taskId);
    const payload = {
        ...snapshot.payload.model_input_request,
        timeoutMs: settings.timeoutMs
    };
    const messages = snapshot.payload.messages || [];
    const nativeRequest = buildCodexResponsesRequest(settings, payload, messages);
    const legacySchema = buildCodexBridgeDecisionSchema(payload.tools || [], payload);
    const row = {
        taskId: taskSpec.taskId,
        side: taskSpec.side,
        originalStatus: resultByTask.get(taskSpec.taskId)?.status || '',
        question: resultByTask.get(taskSpec.taskId)?.question || '',
        iteration: snapshot.iteration,
        transcriptFile: snapshot.transcriptFile,
        request: {
            instructionChars: String(payload.instructions || '').length,
            inputItemCount: Array.isArray(payload.input) ? payload.input.length : 0,
            toolCount: Array.isArray(payload.tools) ? payload.tools.length : 0,
            legacyDecisionSchemaBytes: Buffer.byteLength(JSON.stringify(legacySchema)),
            nativeRequestBytes: Buffer.byteLength(JSON.stringify(nativeRequest)),
            nativeParallelToolCalls: nativeRequest.parallel_tool_calls === true
        },
        transports: []
    };
    if (runLegacy) {
        row.transports.push(await runTransport('legacy-json-bridge', () =>
            callCodexAppServerBridgeOnce(settings, payload, messages)
        ));
    }
    if (runNative) {
        row.transports.push(await runTransport('native-responses', () =>
            callCodexModelBridge(settings, payload, messages)
        ));
    }
    rows.push(row);
    await fs.writeFile(
        path.join(outputDir, 'shadow.partial.json'),
        `${JSON.stringify({ rows }, null, 2)}\n`,
        'utf8'
    );
}

const legacy = rows
    .map((row) => row.transports.find((transport) => transport.label === 'legacy-json-bridge'))
    .filter(Boolean);
const native = rows
    .map((row) => row.transports.find((transport) => transport.label === 'native-responses'))
    .filter(Boolean);
const sum = (values) => values.reduce((total, value) => total + Number(value || 0), 0);
const legacyInputTokens = sum(legacy.map((item) => item.usage?.prompt_tokens));
const nativeInputTokens = sum(native.map((item) => item.usage?.prompt_tokens));
const report = {
    schema: 'ailis.codex_native_transport_shadow.v1',
    createdAt: new Date().toISOString(),
    sourceRoot,
    candidateCommit: String(args.commit || 'working-tree'),
    excludedFromScore: true,
    toolsExecuted: false,
    rows,
    aggregate: {
        legacyOk: legacy.filter((item) => item.ok).length,
        nativeOk: native.filter((item) => item.ok).length,
        legacyInputTokens,
        nativeInputTokens,
        inputTokenDeltaPercent: legacyInputTokens
            ? Number((((nativeInputTokens - legacyInputTokens) / legacyInputTokens) * 100).toFixed(2))
            : null,
        legacyLatencyMs: sum(legacy.map((item) => item.elapsedMs)),
        nativeLatencyMs: sum(native.map((item) => item.elapsedMs)),
        nativeMultiCallResponses: native.filter((item) => item.toolCallCount > 1).length
    }
};

await fs.writeFile(path.join(outputDir, 'shadow-report.json'), `${JSON.stringify(report, null, 2)}\n`, 'utf8');
await fs.writeFile(path.join(outputDir, 'shadow-report.md'), `${buildMarkdown(report)}\n`, 'utf8');
console.log(JSON.stringify({
    outputDir,
    aggregate: report.aggregate
}, null, 2));
