import fs from 'node:fs/promises';
import fsSync from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

import {
    configureResearchMcpLlmEnvironment,
    loadDesktopStateSettings
} from './ailis-eval-runtime-config.mjs';

const require = createRequire(import.meta.url);
const { AILISGateway } = require('../electron/ailis-gateway.cjs');
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '..');
const RUN_STAMP = new Date().toISOString().replace(/[:.]/g, '-');
const OUTPUT_ROOT = path.join(
    PROJECT_ROOT,
    'eval-results',
    'engineering',
    `taskagent-prefix-cache-ab-${RUN_STAMP}`
);

const TASKS = [
    {
        id: 'file-write',
        prompt: '在当前工作区创建 hello.txt，内容必须精确为 Hello, cache!（UTF-8、不要 BOM、不要额外换行）。请实际写入并重新读取验证，不要只解释命令。',
        prepare: async () => {},
        verify: async (workspace) => {
            const target = path.join(workspace, 'hello.txt');
            const bytes = await fs.readFile(target);
            return {
                passed: bytes.equals(Buffer.from('Hello, cache!', 'utf8')),
                detail: `hello.txt bytes=${bytes.length}`
            };
        }
    },
    {
        id: 'csv-aggregate',
        prompt: '读取当前工作区 orders.csv，按 region 汇总 amount，将结果写入 summary.json。JSON 必须只有 North、South、West 三个键并按此顺序排列，值为数值。实际运行 node verify.mjs，只有看到 SUMMARY_OK 才完成。',
        prepare: async (workspace) => {
            await fs.writeFile(path.join(workspace, 'orders.csv'), [
                'region,item,amount',
                'North,apple,12',
                'South,coffee,7',
                'West,eggs,5',
                'North,berry,8',
                'South,dates,13',
                'West,flour,9',
                ''
            ].join('\n'));
            await fs.writeFile(path.join(workspace, 'verify.mjs'), [
                "import fs from 'node:fs';",
                "const value = JSON.parse(fs.readFileSync('summary.json', 'utf8'));",
                "const expected = JSON.stringify({ North: 20, South: 20, West: 14 });",
                "if (JSON.stringify(value) !== expected) {",
                "  console.error('SUMMARY_BAD', JSON.stringify(value));",
                '  process.exit(1);',
                '}',
                "console.log('SUMMARY_OK');",
                ''
            ].join('\n'));
        },
        verify: async (workspace) => runVerifier(workspace, ['verify.mjs'], 'SUMMARY_OK')
    },
    {
        id: 'code-repair',
        prompt: '修复当前工作区 src/range.js 的 inclusiveRange，使递增、递减、相等端点、非整除步长和错误方向都符合 test.mjs。不要改测试。实际运行 node test.mjs，只有看到 RANGE_OK 才完成。',
        prepare: async (workspace) => {
            await fs.mkdir(path.join(workspace, 'src'), { recursive: true });
            await fs.writeFile(path.join(workspace, 'package.json'), '{"type":"module"}\n');
            await fs.writeFile(path.join(workspace, 'src', 'range.js'), [
                'export function inclusiveRange(start, end, step = 1) {',
                "  if (step === 0) throw new RangeError('step must not be zero');",
                '  const values = [];',
                '  for (let value = start; value < end; value += step) values.push(value);',
                '  return values;',
                '}',
                ''
            ].join('\n'));
            await fs.writeFile(path.join(workspace, 'test.mjs'), [
                "import assert from 'node:assert/strict';",
                "import { inclusiveRange } from './src/range.js';",
                'assert.deepEqual(inclusiveRange(1, 3), [1, 2, 3]);',
                'assert.deepEqual(inclusiveRange(5, 1, -2), [5, 3, 1]);',
                'assert.deepEqual(inclusiveRange(4, 4), [4]);',
                'assert.deepEqual(inclusiveRange(1, 6, 2), [1, 3, 5]);',
                'assert.deepEqual(inclusiveRange(3, 1, 1), []);',
                'assert.deepEqual(inclusiveRange(1, 3, -1), []);',
                "assert.throws(() => inclusiveRange(1, 2, 0), /step/);",
                "console.log('RANGE_OK');",
                ''
            ].join('\n'));
        },
        verify: async (workspace) => runVerifier(workspace, ['test.mjs'], 'RANGE_OK')
    }
];

function runVerifier(workspace, args, expectedText) {
    const result = spawnSync(process.execPath, args, {
        cwd: workspace,
        encoding: 'utf8',
        timeout: 30000
    });
    const output = `${result.stdout || ''}${result.stderr || ''}`.trim();
    return {
        passed: result.status === 0 && output.includes(expectedText),
        detail: `exit=${result.status}; output=${output.slice(0, 500)}`
    };
}

async function walkFiles(root) {
    const output = [];
    if (!fsSync.existsSync(root)) return output;
    for (const entry of await fs.readdir(root, { withFileTypes: true })) {
        const target = path.join(root, entry.name);
        if (entry.isDirectory()) output.push(...await walkFiles(target));
        else output.push(target);
    }
    return output;
}

function usageNumber(usage, key) {
    const value = Number(usage?.[key]);
    return Number.isFinite(value) ? value : 0;
}

async function readTraceMetrics(auditDir, runId) {
    const files = (await walkFiles(auditDir)).filter((file) => file.endsWith('.jsonl'));
    const snapshots = [];
    const llmCalls = [];
    let toolCalls = 0;
    for (const file of files) {
        const content = await fs.readFile(file, 'utf8');
        for (const line of content.split(/\r?\n/)) {
            if (!line) continue;
            let event;
            try { event = JSON.parse(line); } catch { continue; }
            if (event.runId !== runId) continue;
            if (event.type === 'agent.context_snapshot') snapshots.push(event.payload || {});
            if (event.type === 'agent.llm_call') llmCalls.push(event.payload || {});
            if (event.type === 'tool.call' || event.type === 'tool.call.started') toolCalls += 1;
        }
    }
    const usage = llmCalls.reduce((sum, call) => {
        sum.promptTokens += usageNumber(call.usage, 'promptTokens');
        sum.cachedTokens += usageNumber(call.usage, 'cachedTokens');
        sum.uncachedPromptTokens += usageNumber(call.usage, 'uncachedPromptTokens') ||
            Math.max(0, usageNumber(call.usage, 'promptTokens') - usageNumber(call.usage, 'cachedTokens'));
        sum.completionTokens += usageNumber(call.usage, 'completionTokens');
        sum.durationMs += usageNumber(call, 'durationMs');
        return sum;
    }, { promptTokens: 0, cachedTokens: 0, uncachedPromptTokens: 0, completionTokens: 0, durationMs: 0 });
    const postFirst = llmCalls.slice(1).reduce((sum, call) => {
        sum.promptTokens += usageNumber(call.usage, 'promptTokens');
        sum.cachedTokens += usageNumber(call.usage, 'cachedTokens');
        return sum;
    }, { promptTokens: 0, cachedTokens: 0 });
    const prefixes = snapshots
        .map((snapshot) => snapshot.prompt_prefix)
        .filter(Boolean);
    return {
        llmCalls: llmCalls.length,
        toolCalls,
        ...usage,
        cacheRate: usage.promptTokens ? usage.cachedTokens / usage.promptTokens : 0,
        postFirstCacheRate: postFirst.promptTokens ? postFirst.cachedTokens / postFirst.promptTokens : 0,
        prefixTransitions: prefixes.slice(1).length,
        compatiblePrefixTransitions: prefixes.slice(1).filter((prefix) => prefix.compatible === true).length,
        incompatiblePrefixTransitions: prefixes.slice(1).filter((prefix) => prefix.compatible === false).length,
        cacheEpochs: [...new Set(prefixes.map((prefix) => prefix.cacheEpoch))].length,
        projectionModes: [...new Set(snapshots.map((snapshot) =>
            snapshot.model_input_request?.stats?.task_agent_prompt_projection
        ).filter(Boolean))]
    };
}

async function runOne({ task, variant, llmSettings, mcpConfigPath }) {
    const workspace = path.join(OUTPUT_ROOT, 'workspaces', task.id, variant);
    const auditDir = path.join(OUTPUT_ROOT, 'audit', task.id, variant);
    await fs.mkdir(workspace, { recursive: true });
    await fs.mkdir(auditDir, { recursive: true });
    await task.prepare(workspace);
    const gateway = new AILISGateway({
        port: 0,
        workspaceRoot: workspace,
        projectRoot: PROJECT_ROOT,
        auditDir,
        profileCurationEnabled: false,
        ...(mcpConfigPath ? { mcpConfigPath } : {})
    });
    await gateway.start();
    const startedAt = Date.now();
    const threadId = `cache-ab-${task.id}-${variant}-${RUN_STAMP}`;
    const sessionId = `cache-ab:${task.id}:${variant}:${RUN_STAMP}`;
    const sharedContext = [
        '<shared_session_context>',
        JSON.stringify({
            schema: 'ailis.shared_session_context.v1',
            session_id: sessionId,
            visible_history: [{ role: 'user', content: task.prompt }]
        }),
        '</shared_session_context>'
    ].join('\n');
    let result;
    try {
        result = await gateway.runAgent({
            sessionId,
            message: task.prompt,
            agentLoop: 'llm',
            planner: 'llm',
            memoryPolicy: 'disabled',
            llmSettings,
            directToolExecutor: true,
            nativeDirectTools: true,
            requireTaskExecution: true,
            taskAgentPromptProjection: variant,
            context: {
                workspace,
                agentLoop: 'llm',
                planner: 'llm',
                memoryPolicy: 'disabled',
                llmSettings,
                directToolExecutor: true,
                nativeDirectTools: true,
                requireTaskExecution: true,
                evaluationName: 'taskagent_prefix_cache_ab',
                agentRole: 'task_agent',
                taskAgentRoutingOwned: true,
                taskAgentThreadId: threadId,
                taskAgentTurnId: `${threadId}:turn-1`,
                currentTaskRequest: task.prompt,
                sessionLedgerProjection: {
                    visible_history: [{ role: 'user', content: task.prompt }],
                    completed_turns: [],
                    unresolved_fields: []
                },
                ephemeralDeveloperMessage: sharedContext,
                taskAgentPromptProjection: variant,
                approved: true,
                autoConfirm: true,
                approvalPolicy: 'auto',
                confirmationPolicy: 'auto',
                executeExternal: true,
                permissionProfile: 'danger-full-access'
            }
        });
        await gateway.waitForBackgroundTaskRuns?.();
    } finally {
        await gateway.stop().catch(() => {});
    }
    const verifier = await task.verify(workspace).catch((error) => ({
        passed: false,
        detail: error?.message || String(error)
    }));
    const trace = await readTraceMetrics(auditDir, result?.runId || '');
    return {
        taskId: task.id,
        variant,
        runId: result?.runId || '',
        status: result?.status || '',
        ok: result?.ok === true,
        verifier,
        wallClockMs: Date.now() - startedAt,
        finalAnswer: String(result?.displayText || result?.finalAnswer || '').slice(0, 2000),
        trace
    };
}

function percentage(value) {
    return `${(100 * value).toFixed(2)}%`;
}

function aggregate(results, variant) {
    const rows = results.filter((result) => result.variant === variant);
    const sum = (key) => rows.reduce((total, row) => total + Number(row.trace?.[key] || 0), 0);
    const promptTokens = sum('promptTokens');
    const cachedTokens = sum('cachedTokens');
    const prefixTransitions = sum('prefixTransitions');
    const compatiblePrefixTransitions = sum('compatiblePrefixTransitions');
    return {
        variant,
        passed: rows.filter((row) => row.verifier.passed).length,
        total: rows.length,
        promptTokens,
        cachedTokens,
        uncachedPromptTokens: sum('uncachedPromptTokens'),
        completionTokens: sum('completionTokens'),
        cacheRate: promptTokens ? cachedTokens / promptTokens : 0,
        llmCalls: sum('llmCalls'),
        toolCalls: sum('toolCalls'),
        llmDurationMs: sum('durationMs'),
        wallClockMs: rows.reduce((total, row) => total + row.wallClockMs, 0),
        prefixTransitions,
        compatiblePrefixTransitions,
        prefixCompatibilityRate: prefixTransitions ? compatiblePrefixTransitions / prefixTransitions : 0,
        cacheEpochs: sum('cacheEpochs')
    };
}

function buildReport(results, aggregates, runtime) {
    const legacy = aggregates.find((row) => row.variant === 'legacy');
    const appendOnly = aggregates.find((row) => row.variant === 'append-only');
    const lines = [
        '# TaskAgent Stable-Prefix Cache A/B',
        '',
        `- Provider/model: ${runtime.provider} / ${runtime.model}`,
        `- Generated: ${new Date().toISOString()}`,
        '- Difference under test: legacy ephemeral full-state tail vs canonical append-only state/context.',
        '',
        '| Task | Legacy verifier | Append-only verifier | Legacy cache | Append-only cache | Legacy prefix | Append-only prefix |',
        '|---|---:|---:|---:|---:|---:|---:|'
    ];
    for (const task of TASKS) {
        const a = results.find((row) => row.taskId === task.id && row.variant === 'legacy');
        const b = results.find((row) => row.taskId === task.id && row.variant === 'append-only');
        lines.push(`| ${task.id} | ${a.verifier.passed ? 'PASS' : 'FAIL'} | ${b.verifier.passed ? 'PASS' : 'FAIL'} | ${percentage(a.trace.cacheRate)} | ${percentage(b.trace.cacheRate)} | ${a.trace.compatiblePrefixTransitions}/${a.trace.prefixTransitions} | ${b.trace.compatiblePrefixTransitions}/${b.trace.prefixTransitions} |`);
    }
    lines.push(
        '',
        '| Aggregate | Legacy | Append-only | Delta |',
        '|---|---:|---:|---:|',
        `| Verifier pass | ${legacy.passed}/${legacy.total} | ${appendOnly.passed}/${appendOnly.total} | ${appendOnly.passed - legacy.passed >= 0 ? '+' : ''}${appendOnly.passed - legacy.passed} |`,
        `| Cache rate | ${percentage(legacy.cacheRate)} | ${percentage(appendOnly.cacheRate)} | ${(100 * (appendOnly.cacheRate - legacy.cacheRate)).toFixed(2)} pp |`,
        `| Uncached input | ${legacy.uncachedPromptTokens.toLocaleString()} | ${appendOnly.uncachedPromptTokens.toLocaleString()} | ${(appendOnly.uncachedPromptTokens - legacy.uncachedPromptTokens).toLocaleString()} |`,
        `| LLM calls | ${legacy.llmCalls} | ${appendOnly.llmCalls} | ${appendOnly.llmCalls - legacy.llmCalls} |`,
        `| Tool calls | ${legacy.toolCalls} | ${appendOnly.toolCalls} | ${appendOnly.toolCalls - legacy.toolCalls} |`,
        `| Prefix compatibility | ${percentage(legacy.prefixCompatibilityRate)} | ${percentage(appendOnly.prefixCompatibilityRate)} | ${(100 * (appendOnly.prefixCompatibilityRate - legacy.prefixCompatibilityRate)).toFixed(2)} pp |`,
        `| LLM duration | ${(legacy.llmDurationMs / 1000).toFixed(1)}s | ${(appendOnly.llmDurationMs / 1000).toFixed(1)}s | ${((appendOnly.llmDurationMs - legacy.llmDurationMs) / 1000).toFixed(1)}s |`,
        `| Wall clock | ${(legacy.wallClockMs / 1000).toFixed(1)}s | ${(appendOnly.wallClockMs / 1000).toFixed(1)}s | ${((appendOnly.wallClockMs - legacy.wallClockMs) / 1000).toFixed(1)}s |`,
        '',
        '> These are short 3-5-call tasks. The measured cache rate includes each cold first request and newly appended tool output, so it is evidence of improvement rather than an 80% production-cache claim.',
        '',
        '## Gate',
        '',
        `- No correctness regression: ${appendOnly.passed >= legacy.passed ? 'PASS' : 'FAIL'}`,
        `- All append-only verifiers pass: ${appendOnly.passed === appendOnly.total ? 'PASS' : 'FAIL'}`,
        `- Cache rate improves: ${appendOnly.cacheRate > legacy.cacheRate ? 'PASS' : 'FAIL'}`,
        `- Uncached input decreases: ${appendOnly.uncachedPromptTokens < legacy.uncachedPromptTokens ? 'PASS' : 'FAIL'}`,
        ''
    );
    return `${lines.join('\n')}\n`;
}

async function main() {
    await fs.mkdir(OUTPUT_ROOT, { recursive: true });
    const runtimeSettings = loadDesktopStateSettings({ llmTimeoutMs: 300000, temperature: 0 });
    const llmSettings = { ...runtimeSettings.llmSettings, temperature: 0, timeoutMs: 300000 };
    if (!llmSettings.baseUrl || !llmSettings.model || (!llmSettings.apiKey && !['ollama', 'vllm'].includes(llmSettings.provider))) {
        throw new Error('Missing desktop LLM settings for real-provider A/B.');
    }
    configureResearchMcpLlmEnvironment(llmSettings);
    const schedule = [
        [TASKS[0], 'legacy'],
        [TASKS[0], 'append-only'],
        [TASKS[1], 'append-only'],
        [TASKS[1], 'legacy'],
        [TASKS[2], 'legacy'],
        [TASKS[2], 'append-only']
    ];
    const results = [];
    for (const [task, variant] of schedule) {
        process.stdout.write(`[cache-ab] start task=${task.id} variant=${variant}\n`);
        const result = await runOne({
            task,
            variant,
            llmSettings,
            mcpConfigPath: runtimeSettings.mcpConfigPath
        });
        results.push(result);
        await fs.writeFile(path.join(OUTPUT_ROOT, 'results.partial.json'), `${JSON.stringify(results, null, 2)}\n`);
        process.stdout.write(`[cache-ab] done task=${task.id} variant=${variant} verifier=${result.verifier.passed ? 'PASS' : 'FAIL'} cache=${percentage(result.trace.cacheRate)} calls=${result.trace.llmCalls}\n`);
    }
    const aggregates = ['legacy', 'append-only'].map((variant) => aggregate(results, variant));
    const payload = {
        schema: 'ailis.taskagent_prefix_cache_ab.v1',
        generatedAt: new Date().toISOString(),
        runtime: { provider: llmSettings.provider, model: llmSettings.model },
        results,
        aggregates
    };
    await fs.writeFile(path.join(OUTPUT_ROOT, 'results.json'), `${JSON.stringify(payload, null, 2)}\n`);
    await fs.writeFile(
        path.join(OUTPUT_ROOT, 'REPORT.md'),
        buildReport(results, aggregates, payload.runtime)
    );
    process.stdout.write(`[cache-ab] output=${OUTPUT_ROOT}\n`);
}

main().catch((error) => {
    console.error(error?.stack || error);
    process.exitCode = 1;
});
