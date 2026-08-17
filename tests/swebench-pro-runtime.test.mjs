import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

import {
    buildOfficialSweBenchProRow,
    buildSweBenchProAgentTask
} from '../scripts/prepare-swebench-pro.mjs';
import {
    buildOfficialSweBenchProEvalCommand,
    inspectSweBenchProDatasetCoverage,
    inspectSweBenchProHarness,
    validateSweBenchProPredictions,
    windowsPathToWslPath
} from '../scripts/swebench-pro-runtime.mjs';
import {
    buildAgentPayload,
    buildTaskPrompt,
    capturePatch,
    createSWEProVerificationExecutor,
    normalizeUnifiedDiff,
    parseArgs,
    resolveContainerVerificationTimeoutMs,
    resolveSWEProVerificationWorkdir,
    validateAgentTask
} from '../scripts/run-ailis-swebench-pro.mjs';

test('SWE-bench Pro captures untracked files without touching a locked real Git index', async () => {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-swe-patch-test-'));
    try {
        const { execFile } = await import('node:child_process');
        const { promisify } = await import('node:util');
        const run = promisify(execFile);
        await run('git', ['init', '--quiet'], { cwd: root });
        await run('git', ['config', 'user.email', 'ailis@example.invalid'], { cwd: root });
        await run('git', ['config', 'user.name', 'AILIS Test'], { cwd: root });
        await fs.writeFile(path.join(root, 'tracked.txt'), 'base\n');
        await run('git', ['add', 'tracked.txt'], { cwd: root });
        await run('git', ['commit', '--quiet', '-m', 'base'], { cwd: root });
        await fs.writeFile(path.join(root, 'new.txt'), 'new content\n');
        await fs.writeFile(path.join(root, '.git', 'index.lock'), 'external lock');

        const captured = await capturePatch(root);

        assert.equal(captured.ok, true);
        assert.match(captured.patch, /new file mode 100644/);
        assert.match(captured.patch, /\+new content/);
        assert.equal(await fs.readFile(path.join(root, '.git', 'index.lock'), 'utf8'), 'external lock');
    } finally {
        await fs.rm(root, { recursive: true, force: true });
    }
});

test('SWE-bench Pro keeps official grader fields but removes gold patches from agent tasks', () => {
    const row = {
        repo: 'NodeBB/NodeBB',
        instance_id: 'instance_NodeBB__NodeBB-example-v1',
        base_commit: 'abc123',
        problem_statement: 'Repair the issue.',
        patch: 'gold patch',
        test_patch: 'hidden tests',
        fail_to_pass: ['test/failing.js'],
        pass_to_pass: ['test/regression.js'],
        issue_categories: ['data_bug'],
        selected_test_files_to_run: ['test/failing.js'],
        dockerhub_tag: 'nodebb.example'
    };

    const official = buildOfficialSweBenchProRow(row);
    const task = buildSweBenchProAgentTask(row);

    assert.equal(official.patch, 'gold patch');
    assert.equal(official.test_patch, 'hidden tests');
    assert.equal(official.fail_to_pass, '["test/failing.js"]');
    assert.equal(official.selected_test_files_to_run, '["test/failing.js"]');
    assert.equal(Object.hasOwn(task, 'patch'), false);
    assert.equal(Object.hasOwn(task, 'test_patch'), false);
    assert.equal(task.instance_id, row.instance_id);
});

test('SWE-bench Pro preserves mixed-quote Python lists for the official evaluator', () => {
    const literal = '["test/a.js", \'test/b.js\']';
    const official = buildOfficialSweBenchProRow({
        fail_to_pass: literal,
        pass_to_pass: '[\'test/regression.js\']',
        selected_test_files_to_run: '["test/a.js"]'
    });
    assert.equal(official.fail_to_pass, literal);
    assert.equal(official.pass_to_pass, '[\'test/regression.js\']');
    assert.equal(official.selected_test_files_to_run, '["test/a.js"]');
});

test('SWE-bench Pro command delegates scoring to the official ScaleAI evaluator', () => {
    const root = path.join(os.tmpdir(), 'ailis-swebench-pro-command');
    const command = buildOfficialSweBenchProEvalCommand({
        harnessDir: path.join(root, 'harness'),
        rawSamplePath: path.join(root, 'sample.jsonl'),
        patchPath: path.join(root, 'predictions.json'),
        outputDir: path.join(root, 'results'),
        workers: 2,
        dockerhubUsername: 'jefzda',
        mode: 'local-docker',
        blockNetwork: true,
        redo: true,
        python: 'python-test'
    });

    assert.equal(command.command, 'python-test');
    assert.equal(command.cwd, path.join(root, 'harness'));
    assert.ok(command.args[0].endsWith(path.join('harness', 'swe_bench_pro_eval.py')));
    assert.ok(command.args.includes('--num_workers=2'));
    assert.ok(command.args.includes('--dockerhub_username=jefzda'));
    assert.ok(command.args.includes('--use_local_docker'));
    assert.ok(command.args.includes('--block_network'));
    assert.ok(command.args.includes('--redo'));
});

test('SWE-bench Pro official scorer can execute through WSL Docker', () => {
    const root = path.join('F:\\', 'AILIS', 'bench');
    const command = buildOfficialSweBenchProEvalCommand({
        harnessDir: path.join(root, 'harness'),
        rawSamplePath: path.join(root, 'sample.jsonl'),
        patchPath: path.join(root, 'predictions.json'),
        outputDir: path.join(root, 'results'),
        mode: 'wsl-docker',
        wslDistro: 'Ubuntu-Test',
        python: '/opt/ailis/bin/python'
    });
    assert.equal(windowsPathToWslPath(path.join(root, 'sample.jsonl')), '/mnt/f/AILIS/bench/sample.jsonl');
    assert.equal(command.command, 'wsl');
    assert.deepEqual(command.args.slice(0, 4), ['-d', 'Ubuntu-Test', '--', '/opt/ailis/bin/python']);
    assert.ok(command.args.some((value) => value === '--use_local_docker'));
    assert.ok(command.args.some((value) => value.includes('/mnt/f/AILIS/bench/sample.jsonl')));
});

test('SWE-bench Pro prediction validation accepts official JSON and rejects duplicate IDs', async () => {
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-swebench-pro-predictions-'));
    const validPath = path.join(tempDir, 'valid.json');
    const duplicatePath = path.join(tempDir, 'duplicate.json');
    const truncatedPath = path.join(tempDir, 'truncated.json');
    await fs.writeFile(validPath, JSON.stringify([
        { instance_id: 'instance-a', patch: 'diff --git a/a b/a\n', prefix: 'ailis' }
    ]));
    await fs.writeFile(duplicatePath, JSON.stringify([
        { instance_id: 'instance-a', patch: 'patch-a\n' },
        { instance_id: 'instance-a', patch: 'patch-b\n' }
    ]));
    await fs.writeFile(truncatedPath, JSON.stringify([
        { instance_id: 'instance-b', patch: 'diff --git a/b b/b' }
    ]));

    const valid = await validateSweBenchProPredictions(validPath);
    const duplicate = await validateSweBenchProPredictions(duplicatePath);
    const truncated = await validateSweBenchProPredictions(truncatedPath);

    assert.equal(valid.ok, true);
    assert.equal(valid.count, 1);
    assert.equal(duplicate.ok, false);
    assert.match(duplicate.errors.join('\n'), /duplicate instance_id/);
    assert.equal(truncated.ok, false);
    assert.match(truncated.errors.join('\n'), /must end with a newline/);
});

test('SWE-bench Pro canonicalizes captured unified diffs with one terminating newline', () => {
    assert.equal(normalizeUnifiedDiff('diff --git a/a b/a'), 'diff --git a/a b/a\n');
    assert.equal(normalizeUnifiedDiff('diff --git a/a b/a\n'), 'diff --git a/a b/a\n');
    assert.equal(normalizeUnifiedDiff('   '), '');
});

test('SWE-bench Pro reserves enough time for container startup before verification', () => {
    assert.equal(resolveContainerVerificationTimeoutMs(10000, 0), 120000);
    assert.equal(resolveContainerVerificationTimeoutMs(300000, 0), 300000);
    assert.equal(resolveContainerVerificationTimeoutMs(10000, 240000), 240000);
});

test('SWE-bench Pro harness inspection requires the official evaluator layout', async () => {
    const harnessDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-swebench-pro-harness-'));
    const missing = await inspectSweBenchProHarness(harnessDir);
    assert.equal(missing.ready, false);
    assert.ok(missing.missing.includes('swe_bench_pro_eval.py'));

    await Promise.all([
        fs.writeFile(path.join(harnessDir, 'swe_bench_pro_eval.py'), ''),
        fs.writeFile(path.join(harnessDir, 'requirements.txt'), ''),
        fs.mkdir(path.join(harnessDir, 'run_scripts')),
        fs.mkdir(path.join(harnessDir, 'dockerfiles')),
        fs.mkdir(path.join(harnessDir, 'helper_code'))
    ]);
    const ready = await inspectSweBenchProHarness(harnessDir);
    assert.equal(ready.ready, true);
    assert.deepEqual(ready.missing, []);
});

test('SWE-bench Pro verifies every JSONL instance has official scripts and Dockerfiles', async () => {
    const harnessDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-swebench-pro-coverage-'));
    const instanceId = 'instance-example';
    const datasetPath = path.join(harnessDir, 'sample.jsonl');
    await fs.writeFile(datasetPath, `${JSON.stringify({
        instance_id: instanceId,
        repo: 'owner/repo',
        base_commit: 'abc123',
        before_repo_set_cmd: 'git reset --hard abc123',
        selected_test_files_to_run: '["test/failing.js"]',
        fail_to_pass: '["test/failing.js"]',
        pass_to_pass: '[]'
    })}\n`);

    const missing = await inspectSweBenchProDatasetCoverage(datasetPath, harnessDir);
    assert.equal(missing.ready, false);
    assert.equal(missing.missingFiles.length, 4);

    for (const relativePath of [
        path.join('run_scripts', instanceId, 'run_script.sh'),
        path.join('run_scripts', instanceId, 'parser.py'),
        path.join('dockerfiles', 'base_dockerfile', instanceId, 'Dockerfile'),
        path.join('dockerfiles', 'instance_dockerfile', instanceId, 'Dockerfile')
    ]) {
        const filePath = path.join(harnessDir, relativePath);
        await fs.mkdir(path.dirname(filePath), { recursive: true });
        await fs.writeFile(filePath, '');
    }

    const ready = await inspectSweBenchProDatasetCoverage(datasetPath, harnessDir);
    assert.equal(ready.ready, true);
    assert.equal(ready.rowCount, 1);
    assert.deepEqual(ready.missingFiles, []);
});

test('SWE-bench Pro coverage rejects erased fail-to-pass metadata', async () => {
    const harnessDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-swebench-pro-integrity-'));
    const datasetPath = path.join(harnessDir, 'sample.jsonl');
    await fs.writeFile(datasetPath, `${JSON.stringify({
        instance_id: 'instance-empty-f2p',
        repo: 'owner/repo',
        base_commit: 'abc123',
        before_repo_set_cmd: 'git reset --hard abc123',
        selected_test_files_to_run: '["test/example.js"]',
        fail_to_pass: '[]',
        pass_to_pass: '[]'
    })}\n`);

    const report = await inspectSweBenchProDatasetCoverage(datasetPath, harnessDir);
    assert.equal(report.ready, false);
    assert.equal(report.integrity.failToPassNonEmptyRows, 0);
    assert.match(report.errors.join('\n'), /empty fail_to_pass/);
});

test('SWE-bench Pro TaskAgent transport rejects gold and test leakage', () => {
    const safeTask = {
        instance_id: 'instance-safe',
        repo: 'owner/repo',
        base_commit: 'abc123',
        problem_statement: 'Repair the behavior.',
        dockerhub_tag: 'owner.repo-safe'
    };
    assert.equal(validateAgentTask(safeTask).ok, true);
    const leaked = validateAgentTask({ ...safeTask, patch: 'gold', fail_to_pass: '["hidden"]' });
    assert.equal(leaked.ok, false);
    assert.match(leaked.errors.join('\n'), /leaks patch/);
    assert.match(leaked.errors.join('\n'), /leaks fail_to_pass/);
});

test('SWE-bench Pro TaskAgent payload is isolated from persona and long-term memory', () => {
    const task = {
        instance_id: 'instance-safe',
        repo: 'owner/repo',
        base_commit: 'abc123',
        problem_statement: 'Repair the behavior.',
        requirements: 'Preserve the public API.',
        interface: 'repair(value)',
        dockerhub_tag: 'owner.repo-safe'
    };
    const args = parseArgs(['--max-turns', '900']);
    const prompt = buildTaskPrompt(task);
    const payload = buildAgentPayload({
        args,
        task,
        workspace: 'C:\\bench\\repo',
        llmSettings: { provider: 'test', model: 'test-model' },
        runId: 'run-1',
        sessionId: 'session-1'
    });
    assert.equal(args.maxTurns, 250);
    assert.match(prompt, /Repair the behavior/);
    assert.match(prompt, /Preserve the public API/);
    assert.equal(payload.context.agentRole, 'task_agent');
    assert.equal(payload.context.memoryPolicy, 'disabled');
    assert.equal(payload.deliveryProtocol.mode, 'engineering');
    assert.equal(payload.deliveryProtocol.requireVerification, true);
    assert.equal(payload.context.deliveryProtocol.requireVerification, true);
    assert.equal(payload.context.verificationEnvironment.platform, 'linux');
    assert.equal(payload.context.verificationEnvironment.shell, '/bin/bash');
    assert.match(payload.context.verificationEnvironment.image, /owner\.repo-safe/);
    assert.equal(payload.context.benchmarkMaxTurns, 250);
    assert.deepEqual(payload.messageHistory, []);
});

test('SWE-bench Pro standard verifier rejects an unbound workspace without falling back to the host', async () => {
    const args = parseArgs([]);
    const task = {
        instance_id: 'instance-safe',
        repo: 'owner/repo',
        base_commit: 'abc123',
        problem_statement: 'Repair the behavior.',
        dockerhub_tag: 'owner.repo-safe'
    };
    const executeVerification = createSWEProVerificationExecutor({ args, tasks: [task] });
    const result = await executeVerification({
        args: { command: 'npm test' },
        workspaceDir: path.join(os.tmpdir(), 'not-the-bound-workspace')
    });
    assert.equal(result.isError, true);
    assert.equal(result.details.status, 'verification_environment_unavailable');
    assert.equal(result.details.environment.kind, 'container');
});

test('SWE-bench Pro standard verifier executes a model-selected command in the bound official container', async () => {
    const workspaceRoot = path.join(os.tmpdir(), 'ailis-swepro-standard-verifier');
    const args = parseArgs(['--workspace-root', workspaceRoot, '--container-backend', 'native']);
    const task = {
        instance_id: 'instance-safe',
        repo: 'owner/repo',
        base_commit: 'abc123',
        problem_statement: 'Repair the behavior.',
        dockerhub_tag: 'owner.repo-safe'
    };
    const calls = [];
    const executeVerification = createSWEProVerificationExecutor({
        args,
        tasks: [task],
        resolveContainerBackend: async () => ({ ok: true, backend: 'native' }),
        runContainer: async (_args, backend, dockerArgs, options) => {
            calls.push({ backend, dockerArgs, options });
            return { ok: true, stdout: '4 tests passed', stderr: '', error: '', code: 0 };
        }
    });
    const workspaceDir = path.join(workspaceRoot, task.instance_id, 'repo');
    const result = await executeVerification({
        args: {
            command: 'python -m pytest tests/unit',
            workdir: 'packages/core',
            timeoutMs: 45000
        },
        workspaceDir
    });

    assert.equal(result.isError, false);
    assert.equal(result.details.environment.platform, 'linux');
    assert.equal(result.details.stdout, '4 tests passed');
    assert.equal(calls.length, 1);
    assert.equal(calls[0].backend.backend, 'native');
    assert.ok(calls[0].dockerArgs.includes('jefzda/sweap-images:owner.repo-safe'));
    assert.ok(calls[0].dockerArgs.includes('--entrypoint'));
    assert.deepEqual(calls[0].dockerArgs.slice(-2), ['-lc', 'python -m pytest tests/unit']);
    assert.ok(calls[0].dockerArgs.includes('/app/packages/core'));
    assert.equal(calls[0].options.timeoutMs, 120000);
});

test('SWE-bench Pro verifier accepts the declared container workspace without weakening host boundaries', () => {
    const workspace = path.resolve('F:\\bench\\instance-safe\\repo');
    const root = resolveSWEProVerificationWorkdir({
        workspace,
        requestedWorkdir: '/app',
        containerWorkspace: '/app'
    });
    const nested = resolveSWEProVerificationWorkdir({
        workspace,
        requestedWorkdir: '/app/packages/core',
        containerWorkspace: '/app'
    });
    const outside = resolveSWEProVerificationWorkdir({
        workspace,
        requestedWorkdir: path.resolve(workspace, '..', 'other'),
        containerWorkspace: '/app'
    });

    assert.equal(root.ok, true);
    assert.equal(root.hostWorkdir, workspace);
    assert.equal(root.containerWorkdir, '/app');
    assert.equal(nested.ok, true);
    assert.equal(nested.hostWorkdir, path.join(workspace, 'packages', 'core'));
    assert.equal(nested.containerWorkdir, '/app/packages/core');
    assert.equal(outside.ok, false);
});

test('SWE-bench Pro TaskAgent transport accepts an explicit WSL Docker backend', () => {
    const args = parseArgs(['--workspace-source', 'image', '--container-backend', 'wsl', '--wsl-distro', 'Ubuntu-Test']);
    assert.equal(args.workspaceSource, 'image');
    assert.equal(args.containerBackend, 'wsl');
    assert.equal(args.wslDistro, 'Ubuntu-Test');
});

test('SWE-bench Pro TaskAgent defaults to public Git checkout for patch generation', () => {
    const args = parseArgs([]);
    assert.equal(args.workspaceSource, 'git');
    assert.equal(args.containerBackend, 'auto');
});

test('SWE-bench Pro transport records only whether a Git proxy is configured', () => {
    const args = parseArgs(['--git-proxy', 'http://127.0.0.1:7890']);
    assert.equal(args.gitProxy, 'http://127.0.0.1:7890');
});
