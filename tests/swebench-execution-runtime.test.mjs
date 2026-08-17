import assert from 'node:assert/strict';
import test from 'node:test';
import {
    buildGitHubArchiveCurlArgs,
    gitForWindowsUnzipCandidates,
    isTransientWslFailure,
    repairUtf8Mojibake,
    runSweBenchExecution,
    runWslWithRetries,
    shouldPreferGitHubArchive
} from '../scripts/run-swebench-lite-execution.mjs';
import {
    SWE_BENCH_DATASET,
    SWE_BENCH_LITE_DATASET,
    SWE_BENCH_PRO_DATASET,
    normalizeSweBenchRow,
    resolveSweBenchDataset,
    sweBenchDatasetFilePrefix
} from '../scripts/prepare-swebench-lite-sample.mjs';

test('SWE-bench sampler separates full, Lite, and Pro dataset identities', () => {
    assert.equal(resolveSweBenchDataset(SWE_BENCH_DATASET), 'princeton-nlp/SWE-bench');
    assert.equal(
        resolveSweBenchDataset(SWE_BENCH_LITE_DATASET),
        'princeton-nlp/SWE-bench_Lite'
    );
    assert.equal(sweBenchDatasetFilePrefix(SWE_BENCH_DATASET), 'swebench');
    assert.equal(sweBenchDatasetFilePrefix(SWE_BENCH_LITE_DATASET), 'swebench-lite');
    assert.equal(resolveSweBenchDataset(SWE_BENCH_PRO_DATASET), 'ScaleAI/SWE-bench_Pro');
    assert.equal(sweBenchDatasetFilePrefix(SWE_BENCH_PRO_DATASET), 'swebench-pro');
    assert.throws(
        () => resolveSweBenchDataset('third-party/not-swebench'),
        /Unsupported SWE-bench dataset/
    );
    assert.equal(typeof runSweBenchExecution, 'function');
});

test('legacy SWE-bench execution runner refuses to score SWE-bench Pro', async () => {
    await assert.rejects(
        runSweBenchExecution({ datasetName: SWE_BENCH_PRO_DATASET }),
        /official ScaleAI harness/
    );
});

test('SWE-bench Pro rows preserve official Python-list test metadata losslessly', () => {
    const row = normalizeSweBenchRow({
        row_idx: 7,
        row: {
            repo: 'NodeBB/NodeBB',
            instance_id: 'instance_NodeBB__NodeBB-example-v1',
            base_commit: 'abc123',
            problem_statement: 'Repair the issue.',
            patch: 'diff --git a/a b/a',
            test_patch: 'diff --git a/test b/test',
            fail_to_pass: '["test/a.js", \'test/b.js\']',
            pass_to_pass: '["test/b.js"]',
            requirements: 'Use the existing API.',
            interface: 'db.mget(keys)',
            repo_language: 'js',
            issue_specificity: 'specific',
            issue_categories: '["data_bug"]',
            before_repo_set_cmd: 'git reset --hard abc123',
            selected_test_files_to_run: '["test/a.js"]',
            dockerhub_tag: 'nodebb.example'
        }
    }, SWE_BENCH_PRO_DATASET);

    assert.equal(row.fail_to_pass, '["test/a.js", \'test/b.js\']');
    assert.equal(row.pass_to_pass, '["test/b.js"]');
    assert.deepEqual(row.issue_categories, ['data_bug']);
    assert.equal(row.selected_test_files_to_run, '["test/a.js"]');
    assert.equal(row.docker_image, 'jefzda/sweap-images:nodebb.example');
});

test('SWE-bench runner reverses only evidence-bearing UTF-8 mojibake', () => {
    const original = "invalid_usernames = ['Éric', 'أحمد', 'عبد ال']";
    const mojibake = Buffer.from(original, 'utf8').toString('latin1');
    assert.equal(repairUtf8Mojibake(mojibake), original);
    assert.equal(repairUtf8Mojibake('ASCII-only patch context'), 'ASCII-only patch context');
    assert.equal(repairUtf8Mojibake('Valid René and Øresund'), 'Valid René and Øresund');
});

test('SWE-bench runner only prefers an uncached GitHub archive when explicitly enabled', () => {
    const row = {
        repo: 'django/django',
        base_commit: 'bceadd2788dc2dad53eba0caae172bd8522fd483'
    };
    assert.equal(shouldPreferGitHubArchive({
        row,
        args: { archiveFallback: true, archiveFirst: true }
    }), true);
    assert.equal(shouldPreferGitHubArchive({
        row,
        args: { archiveFallback: true, archiveFirst: false }
    }), false);
    assert.equal(shouldPreferGitHubArchive({
        row,
        args: { archiveFallback: false, archiveFirst: true }
    }), false);
    assert.equal(shouldPreferGitHubArchive({
        row,
        args: { archiveFallback: true, archiveFirst: true },
        cachedArchivePath: 'cached.zip'
    }), false);
    assert.equal(shouldPreferGitHubArchive({
        row: { repo: 'django/django' },
        args: { archiveFallback: true, archiveFirst: true }
    }), false);
});

test('SWE-bench archive download retries curl 18 failures without unsafe range requests', () => {
    const args = buildGitHubArchiveCurlArgs({
        archivePath: 'F:\\cache\\commit.zip',
        url: 'https://codeload.github.com/astropy/astropy/zip/commit',
        archiveTimeoutMs: 900_000
    });
    assert.deepEqual(args.slice(0, 9), [
        '-L',
        '--fail',
        '--retry',
        '2',
        '--retry-all-errors',
        '--retry-delay',
        '3',
        '--connect-timeout',
        '20'
    ]);
    assert.equal(args.includes('--continue-at'), false);
    assert.equal(args.at(-3), '-o');
    assert.equal(args.at(-2), 'F:\\cache\\commit.zip');
});

test('SWE-bench runner resolves Git for Windows unzip beside custom Git roots', () => {
    assert.deepEqual(
        gitForWindowsUnzipCandidates(
            'F:\\Git\\cmd\\git.exe\r\nC:\\Program Files\\Git\\cmd\\git.exe\r\n'
        ),
        [
            'F:\\Git\\usr\\bin\\unzip.exe',
            'C:\\Program Files\\Git\\usr\\bin\\unzip.exe'
        ]
    );
});

test('SWE-bench runner recognizes NUL-separated WSL VM startup failures', () => {
    const diagnostic = 'W\0s\0l\0/\0S\0e\0r\0v\0i\0c\0e\0/\0C\0r\0e\0a\0t\0e\0I\0n\0s\0t\0a\0n\0c\0e\0/\0C\0r\0e\0a\0t\0e\0V\0m\0/\0H\0C\0S\0_\0E\0_\0C\0O\0N\0N\0E\0C\0T\0I\0O\0N\0_\0T\0I\0M\0E\0O\0U\0T\0';
    assert.equal(isTransientWslFailure({ stderr: diagnostic }), true);
    assert.equal(isTransientWslFailure({ stderr: '2 failed in 1.2s' }), false);
});

test('SWE-bench runner retries only bounded transient WSL startup failures', async () => {
    const results = [
        { ok: false, exitCode: -1, durationMs: 10, stdout: '', stderr: 'HCS_E_CONNECTION_TIMEOUT' },
        { ok: false, exitCode: -1, durationMs: 11, stdout: '', stderr: 'Wsl/Service/CreateInstance/CreateVm' },
        { ok: true, exitCode: 0, durationMs: 12, stdout: 'ready', stderr: '' }
    ];
    const calls = [];
    const delays = [];
    const result = await runWslWithRetries({
        distro: 'Ubuntu-22.04',
        script: 'python3 --version',
        maxAttempts: 3,
        retryDelayMs: 5,
        execute: async (...args) => {
            calls.push(args);
            return results.shift();
        },
        delay: async (milliseconds) => {
            delays.push(milliseconds);
        }
    });
    assert.equal(result.ok, true);
    assert.equal(result.attempts, 3);
    assert.equal(result.transientFailures.length, 2);
    assert.equal(calls.length, 3);
    assert.deepEqual(delays, [5, 10]);
});

test('SWE-bench runner does not retry ordinary command or test failures', async () => {
    let calls = 0;
    const result = await runWslWithRetries({
        distro: 'Ubuntu-22.04',
        script: 'python -m pytest',
        execute: async () => {
            calls += 1;
            return {
                ok: false,
                exitCode: 1,
                durationMs: 10,
                stdout: '2 failed',
                stderr: ''
            };
        },
        delay: async () => {
            throw new Error('non-transient failures must not be delayed or retried');
        }
    });
    assert.equal(result.ok, false);
    assert.equal(result.attempts, 1);
    assert.equal(calls, 1);
});
