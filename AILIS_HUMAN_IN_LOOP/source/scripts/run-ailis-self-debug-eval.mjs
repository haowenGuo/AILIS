import fs from 'node:fs/promises';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { AILISRuntime } = require('../electron/ailis-runtime.cjs');

const execFileAsync = promisify(execFile);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const DEFAULT_QUIXBUGS_REPO = 'https://github.com/jkoppel/QuixBugs';
const DEFAULT_QUIXBUGS_DIR = path.join(projectRoot, 'build-cache', 'quixbugs');
const DEFAULT_OUTPUT_DIR = path.join(projectRoot, 'eval-results', 'engineering', 'self-debug-quixbugs');
const DEFAULT_PROGRAMS = ['bucketsort', 'find_in_sorted', 'flatten', 'gcd'];

function parseArgs(argv = process.argv.slice(2)) {
    const args = {
        benchmark: 'quixbugs',
        sourceDir: DEFAULT_QUIXBUGS_DIR,
        repoUrl: DEFAULT_QUIXBUGS_REPO,
        outputDir: DEFAULT_OUTPUT_DIR,
        programs: [...DEFAULT_PROGRAMS],
        limit: 0,
        timeoutMs: 60000,
        mode: 'oracle-patch'
    };
    for (let index = 0; index < argv.length; index += 1) {
        const arg = argv[index];
        if (arg === '--source-dir') args.sourceDir = path.resolve(argv[++index] || args.sourceDir);
        else if (arg === '--repo-url') args.repoUrl = argv[++index] || args.repoUrl;
        else if (arg === '--output-dir') args.outputDir = path.resolve(argv[++index] || args.outputDir);
        else if (arg === '--programs') args.programs = String(argv[++index] || '').split(/[,\s]+/).map((entry) => entry.trim()).filter(Boolean);
        else if (arg === '--program') args.programs = [argv[++index] || ''].filter(Boolean);
        else if (arg === '--limit') args.limit = Number(argv[++index] || 0);
        else if (arg === '--timeout-ms') args.timeoutMs = Number(argv[++index] || args.timeoutMs);
        else if (arg === '--mode') args.mode = argv[++index] || args.mode;
    }
    if (args.limit > 0) {
        args.programs = args.programs.slice(0, args.limit);
    }
    return args;
}

async function pathExists(filePath) {
    try {
        await fs.access(filePath);
        return true;
    } catch {
        return false;
    }
}

async function runCommand(command, args = [], options = {}) {
    const startedAt = Date.now();
    try {
        const result = await execFileAsync(command, args, {
            cwd: options.cwd || projectRoot,
            env: {
                ...process.env,
                ...(options.env || {})
            },
            timeout: options.timeoutMs || 60000,
            maxBuffer: 20 * 1024 * 1024,
            windowsHide: true
        });
        return {
            ok: true,
            command: [command, ...args].join(' '),
            cwd: options.cwd || projectRoot,
            exitCode: 0,
            durationMs: Date.now() - startedAt,
            stdout: String(result.stdout || '').slice(-12000),
            stderr: String(result.stderr || '').slice(-12000)
        };
    } catch (error) {
        return {
            ok: false,
            command: [command, ...args].join(' '),
            cwd: options.cwd || projectRoot,
            exitCode: typeof error.code === 'number' ? error.code : null,
            signal: error.signal || '',
            durationMs: Date.now() - startedAt,
            stdout: String(error.stdout || '').slice(-12000),
            stderr: String(error.stderr || error.message || '').slice(-12000),
            error: error.message || String(error)
        };
    }
}

async function ensureQuixBugs(args) {
    if (await pathExists(path.join(args.sourceDir, '.git'))) {
        return {
            ok: true,
            sourceDir: args.sourceDir,
            cloned: false
        };
    }
    await fs.mkdir(path.dirname(args.sourceDir), { recursive: true });
    const clone = await runCommand('git', ['clone', '--depth', '1', args.repoUrl, args.sourceDir], {
        cwd: projectRoot,
        timeoutMs: 120000
    });
    return {
        ok: clone.ok,
        sourceDir: args.sourceDir,
        cloned: clone.ok,
        clone
    };
}

async function copyBenchmarkSource(sourceDir, targetDir) {
    await fs.rm(targetDir, { recursive: true, force: true });
    await fs.mkdir(path.dirname(targetDir), { recursive: true });
    await fs.cp(sourceDir, targetDir, {
        recursive: true,
        filter: (entry) => !entry.includes(`${path.sep}.git${path.sep}`) && !entry.endsWith(`${path.sep}.git`)
    });
}

function normalizeText(text = '') {
    return String(text || '').replace(/\r\n/g, '\n');
}

function splitPatchLines(text = '') {
    const normalized = normalizeText(text);
    return normalized.endsWith('\n') ? normalized.slice(0, -1).split('\n') : normalized.split('\n');
}

function renderFullFilePatch(relativePath, oldText, newText) {
    const oldLines = splitPatchLines(oldText);
    const newLines = splitPatchLines(newText);
    return [
        `diff --git a/${relativePath} b/${relativePath}`,
        `--- a/${relativePath}`,
        `+++ b/${relativePath}`,
        `@@ -1,${oldLines.length} +1,${newLines.length} @@`,
        ...oldLines.map((line) => `-${line}`),
        ...newLines.map((line) => `+${line}`),
        ''
    ].join('\n');
}

function quixTestCommand(program) {
    return `python -m pytest python_testcases/test_${program}.py -q`;
}

async function readProgramPatch(caseDir, program) {
    const relativePath = `python_programs/${program}.py`;
    const buggyPath = path.join(caseDir, 'python_programs', `${program}.py`);
    const correctPath = path.join(caseDir, 'correct_python_programs', `${program}.py`);
    const [buggy, correct] = await Promise.all([
        fs.readFile(buggyPath, 'utf8'),
        fs.readFile(correctPath, 'utf8')
    ]);
    return renderFullFilePatch(relativePath, buggy, correct);
}

function summarizeCase(result) {
    return {
        program: result.program,
        status: result.status,
        baselineFailed: result.metrics.baselineFailed,
        evidenceCollected: result.metrics.evidenceCollected,
        diagnosisReady: result.metrics.diagnosisReady,
        patchProposed: result.metrics.patchProposed,
        patchValidated: result.metrics.patchValidated,
        approvalBlocked: result.metrics.approvalBlocked,
        repaired: result.metrics.repaired,
        validationPassed: result.metrics.validationPassed,
        durationMs: result.durationMs
    };
}

async function runQuixBugsCase(args, program) {
    const startedAt = Date.now();
    const caseDir = path.join(args.outputDir, 'cases', program, 'repo');
    await copyBenchmarkSource(args.sourceDir, caseDir);
    const auditDir = path.join(args.outputDir, 'cases', program, '.ailis-state');
    const runtime = new AILISRuntime({
        workspaceRoot: caseDir,
        projectRoot: caseDir,
        auditDir
    });
    const runId = `self-debug-quixbugs-${program}`;
    const testCommand = quixTestCommand(program);
    const metrics = {
        baselineFailed: false,
        evidenceCollected: false,
        diagnosisReady: false,
        patchProposed: false,
        patchValidated: false,
        approvalBlocked: false,
        repaired: false,
        validationPassed: false,
        noUnauthorizedMutation: false
    };
    const phases = {};
    try {
        await runtime.startRun({
            runId,
            sessionId: 'self-debug-eval',
            message: `QuixBugs ${program} should repair failing tests.`,
            planner: 'self-debug-eval'
        });
        const baseline = await runCommand('python', ['-m', 'pytest', `python_testcases/test_${program}.py`, '-q'], {
            cwd: caseDir,
            timeoutMs: args.timeoutMs
        });
        phases.baseline = baseline;
        metrics.baselineFailed = baseline.ok === false;

        const opened = await runtime.executeTool('self_debugger', {
            action: 'open_case',
            bugReport: `Open-source QuixBugs benchmark failure for ${program}. Repair the buggy Python implementation so its pytest testcase passes.`,
            affectedCapability: 'code_repair',
            recentRunId: runId,
            sourceHints: [
                `python_programs/${program}.py`,
                `python_testcases/test_${program}.py`
            ]
        }, {
            runId,
            sessionId: 'self-debug-eval'
        });
        phases.openCase = opened.details;
        const caseId = opened.details.case?.id || '';

        const evidence = await runtime.executeTool('self_debugger', {
            action: 'collect_evidence',
            caseId,
            maxFileChars: 20000
        }, {
            runId,
            sessionId: 'self-debug-eval'
        });
        phases.collectEvidence = evidence.details;
        metrics.evidenceCollected = evidence.details.status === 'completed' && evidence.details.evidenceCount >= 2;

        const diagnosis = await runtime.executeTool('self_debugger', {
            action: 'diagnose',
            caseId,
            validationCommands: [testCommand]
        }, {
            runId,
            sessionId: 'self-debug-eval'
        });
        phases.diagnose = diagnosis.details;
        metrics.diagnosisReady = ['ready_for_patch_proposal', 'needs_more_evidence'].includes(diagnosis.details.diagnosis?.status);

        const beforeApply = await fs.readFile(path.join(caseDir, 'python_programs', `${program}.py`), 'utf8');
        const candidateDiff = await readProgramPatch(caseDir, program);
        const proposed = await runtime.executeTool('self_debugger', {
            action: 'propose_patch',
            caseId,
            title: `QuixBugs ${program} repair`,
            candidateDiff,
            validationCommands: [testCommand]
        }, {
            runId,
            sessionId: 'self-debug-eval'
        });
        phases.proposePatch = proposed.details;
        metrics.patchProposed = proposed.details.status === 'completed';

        const validated = await runtime.executeTool('self_debugger', {
            action: 'validate_patch',
            caseId
        }, {
            runId,
            sessionId: 'self-debug-eval'
        });
        phases.validatePatch = validated.details;
        metrics.patchValidated = validated.details.status === 'completed';

        const blocked = await runtime.executeTool('self_debugger', {
            action: 'apply_patch',
            caseId
        }, {
            runId,
            sessionId: 'self-debug-eval'
        });
        phases.applyWithoutApproval = blocked.details;
        const stillBeforeApply = await fs.readFile(path.join(caseDir, 'python_programs', `${program}.py`), 'utf8');
        metrics.approvalBlocked = blocked.details.status === 'needs_approval';
        metrics.noUnauthorizedMutation = stillBeforeApply === beforeApply;

        const applied = await runtime.executeTool('self_debugger', {
            action: 'apply_patch',
            caseId,
            approved: true
        }, {
            runId,
            sessionId: 'self-debug-eval',
            approved: true
        });
        phases.applyPatch = applied.details;
        metrics.repaired = applied.details.status === 'completed';
        metrics.validationPassed = applied.details.repairResult?.status === 'completed';

        return {
            program,
            benchmark: 'QuixBugs',
            mode: args.mode,
            status: metrics.repaired && metrics.validationPassed ? 'passed' : 'failed',
            durationMs: Date.now() - startedAt,
            runId,
            caseId,
            caseDir,
            metrics,
            phases
        };
    } finally {
        await runtime.shutdown().catch(() => {});
    }
}

function buildSummary(cases) {
    const total = cases.length;
    const count = (name) => cases.filter((entry) => entry.metrics[name]).length;
    const passed = cases.filter((entry) => entry.status === 'passed').length;
    return {
        total,
        passed,
        failed: total - passed,
        repairPassRate: total ? Number((passed / total).toFixed(4)) : 0,
        baselineFailureRate: total ? Number((count('baselineFailed') / total).toFixed(4)) : 0,
        evidenceCollectionRate: total ? Number((count('evidenceCollected') / total).toFixed(4)) : 0,
        patchValidationRate: total ? Number((count('patchValidated') / total).toFixed(4)) : 0,
        approvalBlockRate: total ? Number((count('approvalBlocked') / total).toFixed(4)) : 0,
        unauthorizedMutationRate: total ? Number(((total - count('noUnauthorizedMutation')) / total).toFixed(4)) : 0,
        validationPassRate: total ? Number((count('validationPassed') / total).toFixed(4)) : 0
    };
}

export async function runAILISSelfDebugEval(options = {}) {
    const args = {
        ...parseArgs([]),
        ...options
    };
    if (args.benchmark !== 'quixbugs') {
        throw new Error(`Unsupported self-debug benchmark: ${args.benchmark}`);
    }
    if (args.mode !== 'oracle-patch') {
        throw new Error(`Unsupported self-debug eval mode for this runner: ${args.mode}`);
    }
    await fs.mkdir(args.outputDir, { recursive: true });
    const benchmark = await ensureQuixBugs(args);
    if (!benchmark.ok) {
        throw new Error(`Unable to prepare QuixBugs: ${benchmark.clone?.stderr || benchmark.clone?.error || 'unknown error'}`);
    }
    const cases = [];
    for (const program of args.programs) {
        cases.push(await runQuixBugsCase(args, program));
    }
    const report = {
        ok: cases.every((entry) => entry.status === 'passed'),
        generatedAt: new Date().toISOString(),
        benchmark: {
            name: 'QuixBugs',
            sourceDir: args.sourceDir,
            repoUrl: args.repoUrl,
            mode: args.mode,
            programs: args.programs
        },
        metrics: buildSummary(cases),
        cases,
        caseSummaries: cases.map(summarizeCase)
    };
    const reportPath = path.join(args.outputDir, 'self-debug-quixbugs.report.json');
    await fs.writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
    report.output = reportPath;
    return report;
}

if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
    const report = await runAILISSelfDebugEval(parseArgs());
    console.log(JSON.stringify({
        ok: report.ok,
        output: report.output,
        benchmark: report.benchmark,
        metrics: report.metrics,
        cases: report.caseSummaries
    }, null, 2));
    if (!report.ok) {
        process.exitCode = 1;
    }
}
