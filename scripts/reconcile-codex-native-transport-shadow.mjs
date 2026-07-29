import fs from 'node:fs/promises';
import path from 'node:path';

function parseArgs(argv) {
    const options = {
        reports: [],
        outputDir: ''
    };
    for (let index = 0; index < argv.length; index += 1) {
        const arg = argv[index];
        if (arg === '--report') {
            options.reports.push(argv[++index]);
        } else if (arg === '--output-dir') {
            options.outputDir = argv[++index];
        } else if (arg === '--help') {
            options.help = true;
        } else {
            throw new Error(`Unknown argument: ${arg}`);
        }
    }
    return options;
}

function usage() {
    return [
        'Usage:',
        '  node scripts/reconcile-codex-native-transport-shadow.mjs',
        '    --report <initial-shadow-report.json>',
        '    --report <native-rerun-report.json> [--report ...]',
        '    --output-dir <directory>',
        '',
        'Reports are processed in order. The latest successful result for each',
        'task/transport pair wins; failed attempts remain in supersededAttempts.'
    ].join('\n');
}

function transportKey(taskId, label) {
    return `${taskId}\0${label}`;
}

function tokenCount(transport, key) {
    const value = Number(transport?.usage?.[key]);
    return Number.isFinite(value) ? value : 0;
}

function percentDelta(next, previous) {
    if (!Number.isFinite(next) || !Number.isFinite(previous) || previous === 0) {
        return null;
    }
    return Number((((next - previous) / previous) * 100).toFixed(2));
}

function markdownCell(value) {
    return String(value ?? '').replace(/\|/g, '\\|').replace(/\r?\n/g, ' ');
}

function buildMarkdown(report) {
    const lines = [
        '# P1 Native Tool Transport Shadow A/B (Reconciled)',
        '',
        `- Created: ${report.createdAt}`,
        `- Candidate commit: \`${report.candidateCommit || 'working-tree'}\``,
        '- Diagnostic only: `excludedFromScore=true`',
        '- Tool execution: disabled',
        '- Behavior policy changes: none',
        '',
        '## Aggregate',
        '',
        `- Final native compatibility: ${report.aggregate.nativeOk}/${report.rows.length}`,
        `- Directly paired successful rows: ${report.aggregate.pairedSuccessfulRows}`,
        `- Paired legacy input tokens: ${report.aggregate.pairedLegacyInputTokens.toLocaleString('en-US')}`,
        `- Paired native input tokens: ${report.aggregate.pairedNativeInputTokens.toLocaleString('en-US')} (${report.aggregate.pairedInputTokenDeltaPercent}%)`,
        `- Paired legacy latency: ${report.aggregate.pairedLegacyLatencyMs.toLocaleString('en-US')} ms`,
        `- Paired native latency: ${report.aggregate.pairedNativeLatencyMs.toLocaleString('en-US')} ms (${report.aggregate.pairedLatencyDeltaPercent}%)`,
        `- Observed native cached tokens: ${report.aggregate.nativeCachedTokens.toLocaleString('en-US')}`,
        '',
        'Cache-key transport is present, but the observed backend cache count was zero; this report does not claim cache hits.',
        '',
        '## Rows',
        '',
        '| Task | Side | Legacy | Native | Legacy input | Native input | Legacy ms | Native ms | Native items/calls |',
        '|---|---|---:|---:|---:|---:|---:|---:|---|'
    ];
    for (const row of report.rows) {
        const legacy = row.transports.find((item) => item.label === 'legacy-json-bridge');
        const native = row.transports.find((item) => item.label === 'native-responses');
        const cells = [
            `\`${markdownCell(row.taskId)}\``,
            markdownCell(row.side),
            legacy?.ok ? 'OK' : `FAIL (${markdownCell(legacy?.code)})`,
            native?.ok ? 'OK' : `FAIL (${markdownCell(native?.code)})`,
            tokenCount(legacy, 'prompt_tokens').toLocaleString('en-US'),
            tokenCount(native, 'prompt_tokens').toLocaleString('en-US'),
            Number(legacy?.elapsedMs || 0).toLocaleString('en-US'),
            Number(native?.elapsedMs || 0).toLocaleString('en-US'),
            `${markdownCell(native?.canonicalItemTypes?.join(','))} / ${markdownCell(native?.toolNames?.join(','))}`
        ];
        lines.push(`| ${cells.join(' | ')} |`);
    }
    lines.push(
        '',
        '## Superseded Compatibility Attempts',
        '',
        'These failures were transport compatibility diagnostics and were rerun only after the generic wire adapter was fixed.'
    );
    for (const attempt of report.supersededAttempts) {
        lines.push(
            `- \`${attempt.taskId}\` ${attempt.label}: \`${attempt.code || 'error'}\` - ${attempt.error || 'unknown error'}`
        );
    }
    lines.push(
        '',
        'This shadow compares transport behavior only. It neither scores task correctness nor authorizes a full GAIA gate.'
    );
    return `${lines.join('\n')}\n`;
}

const options = parseArgs(process.argv.slice(2));
if (options.help) {
    process.stdout.write(`${usage()}\n`);
    process.exit(0);
}
if (options.reports.length < 1 || !options.outputDir) {
    throw new Error(usage());
}

const loadedReports = [];
for (const reportPath of options.reports) {
    loadedReports.push({
        reportPath: path.resolve(reportPath),
        report: JSON.parse(await fs.readFile(reportPath, 'utf8'))
    });
}

const rowMetadata = new Map();
const selected = new Map();
const attempts = [];
for (const { reportPath, report } of loadedReports) {
    for (const row of Array.isArray(report.rows) ? report.rows : []) {
        if (!rowMetadata.has(row.taskId)) {
            const { transports: _transports, ...metadata } = row;
            rowMetadata.set(row.taskId, metadata);
        }
        for (const transport of Array.isArray(row.transports) ? row.transports : []) {
            const enriched = {
                ...transport,
                sourceReport: reportPath
            };
            attempts.push({
                taskId: row.taskId,
                ...enriched
            });
            const key = transportKey(row.taskId, transport.label);
            const current = selected.get(key);
            if (!current || enriched.ok || !current.ok) {
                selected.set(key, enriched);
            }
        }
    }
}

const rows = Array.from(rowMetadata.entries()).map(([taskId, metadata]) => ({
    ...metadata,
    taskId,
    transports: ['legacy-json-bridge', 'native-responses']
        .map((label) => selected.get(transportKey(taskId, label)))
        .filter(Boolean)
}));

const supersededAttempts = attempts.filter((attempt) => {
    const winner = selected.get(transportKey(attempt.taskId, attempt.label));
    return !attempt.ok && winner?.ok && attempt.sourceReport !== winner.sourceReport;
});

const pairedRows = rows.filter((row) => {
    const legacy = row.transports.find((item) => item.label === 'legacy-json-bridge');
    const native = row.transports.find((item) => item.label === 'native-responses');
    return legacy?.ok && native?.ok;
});
const pairedLegacyInputTokens = pairedRows.reduce(
    (sum, row) => sum + tokenCount(row.transports.find((item) => item.label === 'legacy-json-bridge'), 'prompt_tokens'),
    0
);
const pairedNativeInputTokens = pairedRows.reduce(
    (sum, row) => sum + tokenCount(row.transports.find((item) => item.label === 'native-responses'), 'prompt_tokens'),
    0
);
const pairedLegacyLatencyMs = pairedRows.reduce(
    (sum, row) => sum + Number(row.transports.find((item) => item.label === 'legacy-json-bridge')?.elapsedMs || 0),
    0
);
const pairedNativeLatencyMs = pairedRows.reduce(
    (sum, row) => sum + Number(row.transports.find((item) => item.label === 'native-responses')?.elapsedMs || 0),
    0
);
const nativeTransports = rows
    .map((row) => row.transports.find((item) => item.label === 'native-responses'))
    .filter(Boolean);
const aggregate = {
    legacyOk: rows.filter((row) => row.transports.find((item) => item.label === 'legacy-json-bridge')?.ok).length,
    nativeOk: nativeTransports.filter((transport) => transport.ok).length,
    pairedSuccessfulRows: pairedRows.length,
    pairedLegacyInputTokens,
    pairedNativeInputTokens,
    pairedInputTokenDeltaPercent: percentDelta(pairedNativeInputTokens, pairedLegacyInputTokens),
    pairedLegacyLatencyMs,
    pairedNativeLatencyMs,
    pairedLatencyDeltaPercent: percentDelta(pairedNativeLatencyMs, pairedLegacyLatencyMs),
    nativeCachedTokens: nativeTransports.reduce(
        (sum, transport) => sum + Number(transport?.usage?.prompt_tokens_details?.cached_tokens || 0),
        0
    )
};

const firstReport = loadedReports[0].report;
const reconciled = {
    schema: 'ailis.codex-native-transport-shadow-reconciled.v1',
    createdAt: new Date().toISOString(),
    sourceReports: loadedReports.map(({ reportPath }) => reportPath),
    sourceRoot: firstReport.sourceRoot,
    candidateCommit: firstReport.candidateCommit,
    excludedFromScore: true,
    toolsExecuted: false,
    behaviorPolicyChanged: false,
    rows,
    supersededAttempts,
    aggregate
};

await fs.mkdir(options.outputDir, { recursive: true });
const jsonPath = path.join(options.outputDir, 'shadow-reconciled.json');
const markdownPath = path.join(options.outputDir, 'shadow-reconciled.md');
await fs.writeFile(jsonPath, `${JSON.stringify(reconciled, null, 2)}\n`);
await fs.writeFile(markdownPath, buildMarkdown(reconciled));
process.stdout.write(`${JSON.stringify({ jsonPath, markdownPath, aggregate }, null, 2)}\n`);
