import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const {
    createDefaultArtifactToolsRuntime
} = require('../electron/ailis-artifact-tools-runtime.cjs');
const {
    createArtifactEvaluationCase
} = require('../electron/ailis-artifact-tools-model.cjs');

const repoRoot = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const defaultCasesDir = path.join(repoRoot, 'evals', 'artifact-tools', 'cases');
const defaultOutputDir = path.join(repoRoot, 'eval-results', 'artifact-tools');

function parseArgs(argv = process.argv.slice(2)) {
    const args = {
        casesDir: defaultCasesDir,
        outputDir: defaultOutputDir,
        json: false,
        planOnly: false
    };
    for (let index = 0; index < argv.length; index += 1) {
        const arg = argv[index];
        if (arg === '--cases-dir') {
            args.casesDir = path.resolve(argv[index + 1] || args.casesDir);
            index += 1;
        } else if (arg === '--output-dir') {
            args.outputDir = path.resolve(argv[index + 1] || args.outputDir);
            index += 1;
        } else if (arg === '--json') {
            args.json = true;
        } else if (arg === '--plan-only') {
            args.planOnly = true;
        }
    }
    return args;
}

async function readCaseFiles(casesDir) {
    const entries = await fs.readdir(casesDir, { withFileTypes: true });
    const files = entries
        .filter((entry) => entry.isFile() && entry.name.endsWith('.json'))
        .map((entry) => path.join(casesDir, entry.name))
        .sort();
    const cases = [];
    for (const file of files) {
        const parsed = JSON.parse(await fs.readFile(file, 'utf8'));
        const rawCases = Array.isArray(parsed) ? parsed : parsed.cases || [];
        for (const entry of rawCases) {
            cases.push({
                ...createArtifactEvaluationCase(entry),
                expected: entry.expected || {},
                caseFile: path.relative(repoRoot, file).replace(/\\/g, '/')
            });
        }
    }
    return cases;
}

function relativeOrEmpty(value = '') {
    if (!value) {
        return '';
    }
    return path.relative(repoRoot, value).replace(/\\/g, '/');
}

function planCases(cases = []) {
    const runtime = createDefaultArtifactToolsRuntime();
    const results = cases.map((entry) => {
        const plan = runtime.planImport({
            path: entry.input,
            format: entry.format,
            kind: entry.artifactKind,
            requiredCapabilities: entry.requiredCapabilities
        });
        return {
            id: entry.id,
            format: entry.format,
            artifactKind: entry.artifactKind,
            input: entry.input,
            adapterId: plan.adapter?.id || null,
            adapterStatus: plan.adapter?.status || null,
            status: plan.status,
            requiredCapabilities: entry.requiredCapabilities,
            checks: entry.checks,
            diagnostics: plan.diagnostics.map((diagnostic) => ({
                code: diagnostic.code,
                severity: diagnostic.severity,
                message: diagnostic.message
            }))
        };
    });
    return {
        schema: 'ailis.artifact_tools.eval_plan.v1',
        total: results.length,
        planned: results.filter((entry) => entry.status === 'planned').length,
        blocked: results.filter((entry) => entry.status === 'blocked').length,
        adapters: Object.fromEntries([...new Set(results.map((entry) => entry.adapterId).filter(Boolean))]
            .sort()
            .map((adapterId) => [adapterId, results.filter((entry) => entry.adapterId === adapterId).length])),
        results
    };
}

async function runCases(cases = [], options = {}) {
    const runtime = createDefaultArtifactToolsRuntime();
    const results = [];
    for (const entry of cases) {
        const plan = runtime.planImport({
            path: entry.input,
            format: entry.format,
            kind: entry.artifactKind,
            requiredCapabilities: entry.requiredCapabilities
        });
        if (!plan.adapter || plan.status === 'blocked') {
            results.push({
                id: entry.id,
                format: entry.format,
                artifactKind: entry.artifactKind,
                input: entry.input,
                adapterId: plan.adapter?.id || null,
                adapterStatus: plan.adapter?.status || null,
                status: 'blocked',
                checks: entry.checks,
                diagnostics: plan.diagnostics
            });
            continue;
        }
        const run = await runtime.execute({
            action: 'run_checks',
            caseId: entry.id,
            path: entry.input,
            format: entry.format,
            kind: entry.artifactKind,
            requiredCapabilities: entry.requiredCapabilities,
            expected: entry.expected,
            outputDir: options.outputDir,
            repoRoot
        });
        const result = run.result || {};
        results.push({
            id: entry.id,
            format: entry.format,
            artifactKind: entry.artifactKind,
            input: entry.input,
            adapterId: result.adapterId || plan.adapter.id,
            adapterStatus: plan.adapter.status,
            status: result.status || (run.ok === false ? 'failed' : 'passed'),
            requiredCapabilities: entry.requiredCapabilities,
            checks: entry.checks,
            structure: {
                passed: Boolean(result.structure?.passed),
                checks: result.structure?.checks || []
            },
            render: {
                passed: Boolean(result.render?.passed),
                renderKind: result.render?.renderKind || '',
                outputPath: relativeOrEmpty(result.render?.outputPath || ''),
                bytes: result.render?.bytes || 0
            },
            roundtrip: {
                passed: Boolean(result.roundtrip?.passed),
                mode: result.roundtrip?.mode || '',
                outputPath: relativeOrEmpty(result.roundtrip?.outputPath || '')
            },
            trace: result.trace ? {
                passed: Boolean(result.trace.passed),
                target: result.trace.target || '',
                nodeCount: result.trace.nodes?.length || 0,
                edgeCount: result.trace.edges?.length || 0,
                checks: result.trace.checks || []
            } : null,
            searches: Array.isArray(result.searches) ? result.searches.map((search) => ({
                passed: Boolean(search.passed),
                kind: search.search?.kind || '',
                query: search.search?.query || search.search?.fillRgb || search.search?.error || '',
                returned: search.search?.returned || 0,
                totalCandidates: search.search?.totalCandidates || 0,
                checks: search.checks || []
            })) : null,
            queries: Array.isArray(result.queries) ? result.queries.map((query) => ({
                passed: Boolean(query.passed),
                table: query.table || '',
                range: query.range || '',
                rowCount: query.rowCount || 0,
                totalMatchedRows: query.totalMatchedRows || 0,
                aggregate: query.aggregateResult || null,
                groupCount: query.groups?.length || 0,
                checks: query.checks || []
            })) : null,
            edit: result.edit ? {
                passed: Boolean(result.edit.passed),
                outputPath: relativeOrEmpty(result.edit.outputPath || ''),
                operationCount: result.edit.operations?.length || 0,
                afterPassed: result.edit.after ? Boolean(result.edit.after.passed) : null,
                checks: result.edit.after?.checks || []
            } : null,
            recalculation: result.recalculation ? {
                passed: Boolean(result.recalculation.passed),
                outputPath: relativeOrEmpty(result.recalculation.outputPath || ''),
                engine: result.recalculation.engine || '',
                updatedCount: result.recalculation.updatedCount || 0,
                afterPassed: result.recalculation.after ? Boolean(result.recalculation.after.passed) : null,
                checks: result.recalculation.after?.checks || []
            } : null,
            diagnostics: (result.diagnostics || run.details?.diagnostics || []).map((diagnostic) => ({
                code: diagnostic.code,
                severity: diagnostic.severity,
                message: diagnostic.message
            })),
            inspection: result.inspection || null
        });
    }
    return {
        schema: 'ailis.artifact_tools.eval_run.v1',
        total: results.length,
        passed: results.filter((entry) => entry.status === 'passed').length,
        failed: results.filter((entry) => entry.status === 'failed').length,
        blocked: results.filter((entry) => entry.status === 'blocked').length,
        outputDir: relativeOrEmpty(options.outputDir),
        adapters: Object.fromEntries([...new Set(results.map((entry) => entry.adapterId).filter(Boolean))]
            .sort()
            .map((adapterId) => [adapterId, results.filter((entry) => entry.adapterId === adapterId).length])),
        results
    };
}

function formatTextReport(report) {
    if (report.schema === 'ailis.artifact_tools.eval_run.v1') {
        const lines = [
            'AILIS_ARTIFACT_TOOLS_EVAL_RUN',
            `total=${report.total} passed=${report.passed} failed=${report.failed} blocked=${report.blocked}`,
            `adapters=${JSON.stringify(report.adapters)}`,
            `outputDir=${report.outputDir}`
        ];
        for (const result of report.results) {
            lines.push([
                `case=${result.id}`,
                `format=${result.format}`,
                `kind=${result.artifactKind}`,
                `adapter=${result.adapterId || '(none)'}`,
                `status=${result.status}`,
                `structure=${result.structure?.passed ? 'pass' : 'fail'}`,
                `render=${result.render?.passed ? 'pass' : 'fail'}`,
                `roundtrip=${result.roundtrip?.passed ? 'pass' : 'fail'}`,
                result.trace ? `trace=${result.trace.passed ? 'pass' : 'fail'}` : '',
                result.searches ? `search=${result.searches.every((entry) => entry.passed) ? 'pass' : 'fail'}` : '',
                result.queries ? `query=${result.queries.every((entry) => entry.passed) ? 'pass' : 'fail'}` : '',
                result.edit ? `edit=${result.edit.passed ? 'pass' : 'fail'}` : '',
                result.recalculation ? `recalculate=${result.recalculation.passed ? 'pass' : 'fail'}` : ''
            ].join(' '));
            if (result.render?.outputPath) {
                lines.push(`  render=${result.render.outputPath}`);
            }
            if (result.roundtrip?.outputPath) {
                lines.push(`  roundtrip=${result.roundtrip.outputPath} mode=${result.roundtrip.mode}`);
            }
            if (result.trace?.target) {
                lines.push(`  trace=${result.trace.target} nodes=${result.trace.nodeCount} edges=${result.trace.edgeCount}`);
            }
            for (const search of result.searches || []) {
                lines.push(`  search=${search.kind} query=${search.query || '(inventory)'} returned=${search.returned}/${search.totalCandidates} status=${search.passed ? 'pass' : 'fail'}`);
            }
            for (const query of result.queries || []) {
                lines.push(`  query=${query.table || '(table)'} rows=${query.rowCount}/${query.totalMatchedRows} groups=${query.groupCount} aggregate=${query.aggregate ? JSON.stringify({ op: query.aggregate.op, column: query.aggregate.column, value: query.aggregate.value }) : '(none)'} status=${query.passed ? 'pass' : 'fail'}`);
            }
            if (result.edit?.outputPath) {
                lines.push(`  edit=${result.edit.outputPath} operations=${result.edit.operationCount} after=${result.edit.afterPassed === null ? 'n/a' : (result.edit.afterPassed ? 'pass' : 'fail')}`);
            }
            if (result.recalculation?.outputPath) {
                lines.push(`  recalculate=${result.recalculation.outputPath} engine=${result.recalculation.engine} updated=${result.recalculation.updatedCount} after=${result.recalculation.afterPassed === null ? 'n/a' : (result.recalculation.afterPassed ? 'pass' : 'fail')}`);
            }
            for (const check of result.structure?.checks || []) {
                lines.push(`  check=${check.passed ? 'pass' : 'fail'}:${check.name}`);
            }
            for (const check of result.trace?.checks || []) {
                lines.push(`  trace_check=${check.passed ? 'pass' : 'fail'}:${check.name}`);
            }
            for (const search of result.searches || []) {
                for (const check of search.checks || []) {
                    lines.push(`  search_check=${check.passed ? 'pass' : 'fail'}:${check.name}`);
                }
            }
            for (const query of result.queries || []) {
                for (const check of query.checks || []) {
                    lines.push(`  query_check=${check.passed ? 'pass' : 'fail'}:${check.name}`);
                }
            }
            for (const check of result.edit?.checks || []) {
                lines.push(`  edit_check=${check.passed ? 'pass' : 'fail'}:${check.name}`);
            }
            for (const check of result.recalculation?.checks || []) {
                lines.push(`  recalc_check=${check.passed ? 'pass' : 'fail'}:${check.name}`);
            }
            for (const diagnostic of result.diagnostics || []) {
                lines.push(`  diagnostic=${diagnostic.severity}:${diagnostic.code}:${diagnostic.message}`);
            }
        }
        return lines.join('\n');
    }
    const lines = [
        'AILIS_ARTIFACT_TOOLS_EVAL_PLAN',
        `total=${report.total} planned=${report.planned} blocked=${report.blocked}`,
        `adapters=${JSON.stringify(report.adapters)}`
    ];
    for (const result of report.results) {
        lines.push([
            `case=${result.id}`,
            `format=${result.format}`,
            `kind=${result.artifactKind}`,
            `adapter=${result.adapterId || '(none)'}`,
            `status=${result.status}`,
            `checks=${result.checks.join('|')}`
        ].join(' '));
        for (const diagnostic of result.diagnostics) {
            lines.push(`  diagnostic=${diagnostic.severity}:${diagnostic.code}:${diagnostic.message}`);
        }
    }
    return lines.join('\n');
}

async function main() {
    const args = parseArgs();
    const cases = await readCaseFiles(args.casesDir);
    const report = args.planOnly ? planCases(cases) : await runCases(cases, args);
    process.stdout.write(args.json ? `${JSON.stringify(report, null, 2)}\n` : `${formatTextReport(report)}\n`);
}

main().catch((error) => {
    console.error(error?.stack || error?.message || String(error));
    process.exitCode = 1;
});
