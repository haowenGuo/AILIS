import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { runSweBenchLiteExecution } from './run-swebench-lite-execution.mjs';

const execFileAsync = promisify(execFile);

async function runGit(args, cwd) {
    await execFileAsync('git', args, {
        cwd,
        windowsHide: true,
        maxBuffer: 10 * 1024 * 1024
    });
}

async function gitOutput(args, cwd) {
    const { stdout } = await execFileAsync('git', args, {
        cwd,
        windowsHide: true,
        maxBuffer: 10 * 1024 * 1024
    });
    return stdout.trim();
}

async function write(filePath, text) {
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, text, 'utf8');
}

async function createTinyRepo(rootDir) {
    const repoDir = path.join(rootDir, 'tiny-source');
    await fs.mkdir(repoDir, { recursive: true });
    await runGit(['init'], repoDir);
    await runGit(['config', 'user.email', 'selftest@example.local'], repoDir);
    await runGit(['config', 'user.name', 'SWE selftest'], repoDir);
    await write(path.join(repoDir, 'mathbug.py'), [
        'def add(a, b):',
        '    return a + 1',
        ''
    ].join('\n'));
    await write(path.join(repoDir, 'tests', 'test_mathbug.py'), [
        'from mathbug import add',
        '',
        '',
        'def test_existing_behavior():',
        '    assert add(1, 1) == 2',
        ''
    ].join('\n'));
    await runGit(['add', '.'], repoDir);
    await runGit(['commit', '-m', 'base buggy fixture'], repoDir);
    const baseCommit = await gitOutput(['rev-parse', 'HEAD'], repoDir);
    return { repoDir, baseCommit };
}

async function createTinyAgent(rootDir) {
    const agentPath = path.join(rootDir, 'tiny-agent.mjs');
    await write(agentPath, [
        "import fs from 'node:fs/promises';",
        "import path from 'node:path';",
        '',
        "const repoDir = process.env.SWE_BENCH_REPO;",
        "if (!repoDir) throw new Error('SWE_BENCH_REPO is required');",
        "const target = path.join(repoDir, 'mathbug.py');",
        "const source = await fs.readFile(target, 'utf8');",
        "const updated = source.replace('return a + 1', 'return a + b');",
        "if (updated === source) throw new Error('expected buggy return statement not found');",
        "await fs.writeFile(target, updated, 'utf8');",
        "console.log('tiny agent patched mathbug.py');",
        ''
    ].join('\n'));
    return agentPath;
}

async function main() {
    const rootDir = await fs.mkdtemp(path.join(os.tmpdir(), 'swebench-exec-selftest-'));
    const { repoDir, baseCommit } = await createTinyRepo(rootDir);
    const agentPath = await createTinyAgent(rootDir);
    const datasetPath = path.join(rootDir, 'tiny.dataset.jsonl');
    const row = {
        row_idx: 0,
        dataset: 'local/selftest',
        config: 'default',
        split: 'test',
        repo: 'local/tiny',
        repo_url: repoDir,
        instance_id: 'local__tiny-1',
        base_commit: baseCommit,
        problem_statement: 'add(a, b) incorrectly ignores b. Make add(2, 3) return 5.',
        hints_text: '',
        test_patch: [
            'diff --git a/tests/test_mathbug.py b/tests/test_mathbug.py',
            '--- a/tests/test_mathbug.py',
            '+++ b/tests/test_mathbug.py',
            '@@ -4,2 +4,6 @@',
            ' def test_existing_behavior():',
            '     assert add(1, 1) == 2',
            '+',
            '+',
            '+def test_addition_bug():',
            '+    assert add(2, 3) == 5',
            ''
        ].join('\n'),
        patch: [
            'diff --git a/mathbug.py b/mathbug.py',
            '--- a/mathbug.py',
            '+++ b/mathbug.py',
            '@@ -1,2 +1,2 @@',
            ' def add(a, b):',
            '-    return a + 1',
            '+    return a + b',
            ''
        ].join('\n'),
        fail_to_pass: ['tests/test_mathbug.py::test_addition_bug'],
        pass_to_pass: ['tests/test_mathbug.py::test_existing_behavior'],
        version: 'selftest',
        created_at: new Date().toISOString(),
        environment_setup_commit: baseCommit
    };
    await fs.writeFile(datasetPath, `${JSON.stringify(row)}\n`, 'utf8');
    const outputDir = path.join(rootDir, 'execution');
    const report = await runSweBenchLiteExecution({
        datasetPath,
        limit: 1,
        runner: 'host',
        setupMode: 'skip',
        agentMode: 'agent-command',
        agentCommand: `node ${JSON.stringify(agentPath)}`,
        outputDir,
        checkoutTimeoutMs: 60000,
        testTimeoutMs: 60000,
        passToPassLimit: 1
    });
    console.log(JSON.stringify({
        ok: report.ok,
        output: report.output,
        summary: report.summary,
        case: report.cases[0]
            ? {
                  instance_id: report.cases[0].instance_id,
                  status: report.cases[0].status,
                  phases: report.cases[0].phases,
                  missingEvidence: report.cases[0].missingEvidence,
                  candidateDiffPath: report.cases[0].candidateDiffPath
              }
            : null
    }, null, 2));
    if (!report.ok) {
        process.exitCode = 1;
    }
}

await main();
