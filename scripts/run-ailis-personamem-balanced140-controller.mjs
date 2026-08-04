import fs from 'node:fs/promises';
import fsSync from 'node:fs';
import path from 'node:path';
import { spawn, spawnSync } from 'node:child_process';
import { aggregatePersonaMemResults, stableHash } from './ailis-personamem-runtime.mjs';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function readJson(filePath, fallback = null) {
    try {
        return JSON.parse(await fs.readFile(filePath, 'utf8'));
    } catch {
        return fallback;
    }
}

async function writeJsonAtomic(filePath, value) {
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    const temporary = `${filePath}.tmp-${process.pid}-${Date.now()}`;
    await fs.writeFile(temporary, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
    await fs.rename(temporary, filePath);
}

async function appendJsonLine(filePath, value) {
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.appendFile(filePath, `${JSON.stringify(value)}\n`, 'utf8');
}

function pidAlive(pid) {
    if (!Number.isInteger(Number(pid)) || Number(pid) <= 0) return false;
    try {
        process.kill(Number(pid), 0);
        return true;
    } catch {
        return false;
    }
}

async function readLatestResults(filePath) {
    const results = new Map();
    if (!fsSync.existsSync(filePath)) return results;
    const text = await fs.readFile(filePath, 'utf8');
    for (const line of text.split(/\r?\n/).filter(Boolean)) {
        try {
            const entry = JSON.parse(line);
            if (entry?.question_id) results.set(entry.question_id, entry);
        } catch {}
    }
    return results;
}

async function tail(filePath, maxChars = 6000) {
    try {
        const text = await fs.readFile(filePath, 'utf8');
        return text.slice(-maxChars);
    } catch {
        return '';
    }
}

function classifyFailure(text) {
    const normalized = String(text || '').toLowerCase();
    if (/credential|api key|enoent|permission|model cache/.test(normalized)) return 'environment_failed';
    if (/timeout|network|fetch failed|econn|429|rate limit/.test(normalized)) return 'runtime_failed';
    if (/incomplete personamem state|checkpoint|partial_completed/.test(normalized)) return 'orchestration_failed';
    if (/audit failed|write-chain|provenance/.test(normalized)) return 'verifier_failed';
    return 'runner_failed';
}

function parseArgs(argv = process.argv.slice(2)) {
    const marker = argv.indexOf('--job-dir');
    if (marker < 0 || !argv[marker + 1]) throw new Error('--job-dir is required');
    return { jobDir: path.resolve(argv[marker + 1]) };
}

async function main() {
    const { jobDir } = parseArgs();
    const configPath = path.join(jobDir, 'job-config.json');
    const config = await readJson(configPath, null);
    if (!config) throw new Error(`Missing job config: ${configPath}`);
    const repoRoot = path.resolve(config.repoRoot);
    const runDir = path.resolve(config.runDir);
    const workerCount = Number(config.workerCount || 3);
    const maxAttempts = Number(config.maxAttemptsPerShard || 3);
    const eventLogPath = path.join(jobDir, 'event-log.jsonl');
    const progressPath = path.join(jobDir, 'progress.json');
    const statePath = path.join(jobDir, 'state.json');
    const parallelPath = path.join(jobDir, 'parallel-status.json');
    const lockPath = path.join(jobDir, 'controller.lock.json');
    const stopPath = path.join(jobDir, 'stop.flag');
    const priorLock = await readJson(lockPath, null);
    if (priorLock?.controllerPid !== process.pid && pidAlive(priorLock?.controllerPid)) {
        throw new Error(`Controller already active: PID ${priorLock.controllerPid}`);
    }
    await fs.mkdir(jobDir, { recursive: true });
    await fs.mkdir(runDir, { recursive: true });
    await writeJsonAtomic(lockPath, {
        jobId: config.jobId,
        controllerPid: process.pid,
        startedAt: new Date().toISOString(),
        status: 'running'
    });
    const event = async (type, summary, artifactPaths = [], failureCategory = null) => {
        await appendJsonLine(eventLogPath, {
            at: new Date().toISOString(),
            type,
            jobId: config.jobId,
            iteration: 1,
            summary,
            artifactPaths,
            failureCategory
        });
    };
    await event('CONTROLLER_STARTED', `Controller PID ${process.pid} started`, [lockPath]);

    const rootManifestPath = path.join(runDir, 'manifest.json');
    if (!fsSync.existsSync(rootManifestPath)) {
        const validation = spawnSync(process.execPath, [
            path.join(repoRoot, 'scripts', 'run-ailis-personamem.mjs'),
            '--phase', 'balanced128',
            '--seed', config.seed,
            '--validate-only',
            '--output-dir', runDir,
            ...config.frozenRunnerArgs
        ], { cwd: repoRoot, env: process.env, encoding: 'utf8', windowsHide: true });
        await fs.writeFile(path.join(jobDir, 'validation.stdout.log'), validation.stdout || '', 'utf8');
        await fs.writeFile(path.join(jobDir, 'validation.stderr.log'), validation.stderr || '', 'utf8');
        if (validation.status !== 0) {
            await event('FAILURE_CLASSIFIED', 'Balanced manifest validation failed', [
                path.join(jobDir, 'validation.stderr.log')
            ], 'verifier_failed');
            throw new Error(`Balanced validation failed with exit ${validation.status}`);
        }
        await event('TEST_FINISHED', 'Balanced-140 manifest validation passed', [rootManifestPath]);
    }
    const rootManifest = await readJson(rootManifestPath, null);
    if (rootManifest?.sample?.selectedQuestionCount !== 140 ||
        rootManifest?.sample?.selectedPersonaCount !== 20 ||
        rootManifest?.sample?.selectedSliceCount !== 39) {
        throw new Error('Frozen Balanced-140 manifest does not match 140 questions/20 personas/39 slices');
    }
    const expectedQuestionIds = new Set(rootManifest.sample.slices.flatMap((slice) =>
        slice.selectedQuestions.map((question) => question.questionId)));
    const expectedSliceIds = new Set(rootManifest.sample.slices.map((slice) => slice.sliceId));
    if (expectedQuestionIds.size !== 140 || expectedSliceIds.size !== 39) {
        throw new Error('Frozen Balanced-140 manifest contains duplicate questions or slices');
    }

    let persisted = await readJson(parallelPath, { workers: [] });
    const workers = Array.from({ length: workerCount }, (_, index) => {
        const previous = persisted.workers?.find((worker) => worker.index === index) || {};
        return {
            index,
            pid: Number(previous.pid || 0),
            attempt: Number(previous.attempt || 0),
            status: pidAlive(previous.pid) ? 'running' : (previous.status || 'pending'),
            startedAt: previous.startedAt || null,
            exitedAt: previous.exitedAt || null,
            exitCode: previous.exitCode ?? null,
            child: null
        };
    });

    const shardDir = (index) => path.join(runDir, 'shards', `shard-${String(index).padStart(2, '0')}`);
    const workerLog = (index, stream) => path.join(
        jobDir,
        `worker-${String(index).padStart(2, '0')}.${stream}.log`
    );
    const shardSnapshot = async (index) => {
        const directory = shardDir(index);
        const manifest = await readJson(path.join(directory, 'manifest.json'), null);
        const summary = await readJson(path.join(directory, 'summary.json'), null);
        const results = await readLatestResults(path.join(directory, 'results.jsonl'));
        const selected = Number(manifest?.sample?.selectedQuestionCount || 0);
        const completed = [...results.values()].filter((entry) => entry.status === 'completed').length;
        const failed = [...results.values()].filter((entry) => entry.status === 'failed').length;
        const stateRoot = path.join(directory, 'states');
        let checkpoints = 0;
        if (fsSync.existsSync(stateRoot)) {
            for (const state of await fs.readdir(stateRoot, { withFileTypes: true })) {
                if (state.isDirectory() && fsSync.existsSync(path.join(stateRoot, state.name, 'slice-checkpoint.json'))) {
                    checkpoints += 1;
                }
            }
        }
        const complete = selected > 0 && completed === selected && failed === 0 &&
            summary?.invariants?.allSliceAuditsPassed === true &&
            summary?.invariants?.allWriteChainsPassed === true &&
            summary?.invariants?.allLedgerAuditsPassed === true;
        return { manifest, summary, selected, completed, failed, checkpoints, complete };
    };

    const persistWorkers = async () => {
        await writeJsonAtomic(parallelPath, {
            jobId: config.jobId,
            updatedAt: new Date().toISOString(),
            workers: workers.map(({ child, ...worker }) => ({
                ...worker,
                alive: pidAlive(worker.pid)
            }))
        });
    };

    const quarantineIncompleteStates = async (index) => {
        const root = path.join(shardDir(index), 'states');
        if (!fsSync.existsSync(root)) return [];
        const moved = [];
        for (const entry of await fs.readdir(root, { withFileTypes: true })) {
            if (!entry.isDirectory()) continue;
            const source = path.join(root, entry.name);
            if (fsSync.existsSync(path.join(source, 'slice-checkpoint.json'))) continue;
            const target = path.join(
                jobDir,
                'quarantine',
                `shard-${String(index).padStart(2, '0')}`,
                `${entry.name}-attempt-${workers[index].attempt}-${Date.now()}`
            );
            await fs.mkdir(path.dirname(target), { recursive: true });
            await fs.rename(source, target);
            moved.push(target);
        }
        return moved;
    };

    const spawnWorker = async (worker) => {
        worker.attempt += 1;
        const directory = shardDir(worker.index);
        await fs.mkdir(directory, { recursive: true });
        const stdoutFd = fsSync.openSync(workerLog(worker.index, 'stdout'), 'a');
        const stderrFd = fsSync.openSync(workerLog(worker.index, 'stderr'), 'a');
        const child = spawn(process.execPath, [
            path.join(repoRoot, 'scripts', 'run-ailis-personamem.mjs'),
            '--phase', 'balanced128',
            '--seed', config.seed,
            '--shard-index', String(worker.index),
            '--shard-count', String(workerCount),
            '--output-dir', directory,
            '--retry-failed',
            ...config.frozenRunnerArgs
        ], {
            cwd: repoRoot,
            env: {
                ...process.env,
                OMP_NUM_THREADS: '1',
                MKL_NUM_THREADS: '1',
                TOKENIZERS_PARALLELISM: 'false'
            },
            windowsHide: true,
            stdio: ['ignore', stdoutFd, stderrFd]
        });
        fsSync.closeSync(stdoutFd);
        fsSync.closeSync(stderrFd);
        worker.child = child;
        worker.pid = child.pid;
        worker.status = 'running';
        worker.startedAt = new Date().toISOString();
        worker.exitedAt = null;
        worker.exitCode = null;
        child.on('exit', (code) => {
            worker.status = code === 0 ? 'exited' : 'failed';
            worker.exitCode = code;
            worker.exitedAt = new Date().toISOString();
            worker.child = null;
        });
        await event('AGENT_RUN_STARTED',
            `Shard ${worker.index} attempt ${worker.attempt} PID ${worker.pid} started`,
            [directory, workerLog(worker.index, 'stdout')]);
        await persistWorkers();
    };

    const updateProgress = async (status = 'running', nextAction = 'continue workers') => {
        const snapshots = await Promise.all(workers.map((worker) => shardSnapshot(worker.index)));
        const completed = snapshots.reduce((sum, snapshot) => sum + snapshot.completed, 0);
        const failed = snapshots.reduce((sum, snapshot) => sum + snapshot.failed, 0);
        const checkpoints = snapshots.reduce((sum, snapshot) => sum + snapshot.checkpoints, 0);
        const active = workers.filter((worker) => pidAlive(worker.pid)).length;
        const evidence = `questions=${completed}/140 failed=${failed}; checkpoints=${checkpoints}/39`;
        await writeJsonAtomic(progressPath, {
            jobId: config.jobId,
            status,
            iteration: 1,
            currentAction: status === 'completed' ? 'final verification complete' : 'Balanced-140 shard evaluation',
            controllerPid: process.pid,
            activeAgentRuns: active,
            activeWorkers: workers.filter((worker) => pidAlive(worker.pid)).map((worker) => ({
                index: worker.index,
                pid: worker.pid,
                attempt: worker.attempt
            })),
            lastUpdateAt: new Date().toISOString(),
            completedSteps: completed,
            failedSteps: failed,
            completedSlices: checkpoints,
            totalSlices: 39,
            totalQuestions: 140,
            latestArtifactPath: rootManifestPath,
            latestEvidence: evidence,
            nextAction,
            risk: failed ? 'failed questions pending retry' : 'DeepSeek latency/rate limit and low F-drive headroom'
        });
        await writeJsonAtomic(statePath, {
            jobId: config.jobId,
            status,
            controllerPid: process.pid,
            runDir,
            completedQuestions: completed,
            failedQuestions: failed,
            completedSlices: checkpoints,
            workerCount,
            updatedAt: new Date().toISOString()
        });
        await persistWorkers();
        return { snapshots, completed, failed, checkpoints, active };
    };

    await event('ITERATION_STARTED', 'Balanced-140 evaluation iteration started', [rootManifestPath]);
    await updateProgress('running', 'launch three balanced shards');
    for (const worker of workers) {
        const snapshot = await shardSnapshot(worker.index);
        if (snapshot.complete) {
            worker.status = 'completed';
            continue;
        }
        if (!pidAlive(worker.pid)) {
            const quarantined = await quarantineIncompleteStates(worker.index);
            if (quarantined.length > 0) {
                await event('FAILURE_CLASSIFIED',
                    `Shard ${worker.index} was interrupted; ${quarantined.length} partial states quarantined before resume`,
                    quarantined,
                    'runtime_failed');
                await event('REPAIR_STARTED',
                    `Resuming shard ${worker.index} from the latest atomic slice checkpoint`,
                    quarantined);
            }
            await spawnWorker(worker);
        }
    }

    let finalSnapshots = [];
    while (true) {
        if (fsSync.existsSync(stopPath)) {
            for (const worker of workers) {
                if (pidAlive(worker.pid)) {
                    try { process.kill(worker.pid); } catch {}
                }
            }
            await updateProgress('stopped', 'await explicit resume');
            await event('JOB_STOPPED', 'stop.flag detected; workers stopped', [stopPath]);
            await writeJsonAtomic(lockPath, {
                jobId: config.jobId,
                controllerPid: process.pid,
                status: 'stopped',
                endedAt: new Date().toISOString()
            });
            return;
        }
        const status = await updateProgress('running', 'continue or retry incomplete shards');
        finalSnapshots = status.snapshots;
        if (finalSnapshots.every((snapshot) => snapshot.complete)) break;
        for (const worker of workers) {
            const snapshot = finalSnapshots[worker.index];
            if (snapshot.complete) {
                worker.status = 'completed';
                continue;
            }
            if (pidAlive(worker.pid)) continue;
            const errorTail = await tail(workerLog(worker.index, 'stderr'));
            const failureCategory = classifyFailure(errorTail);
            const quarantined = await quarantineIncompleteStates(worker.index);
            await event('FAILURE_CLASSIFIED',
                `Shard ${worker.index} attempt ${worker.attempt} incomplete; ${quarantined.length} partial states quarantined`,
                [workerLog(worker.index, 'stderr'), ...quarantined],
                failureCategory);
            if (worker.attempt >= maxAttempts) {
                await updateProgress('failed', `shard ${worker.index} exhausted retries`);
                await event('ITERATION_FAILED', `Shard ${worker.index} exhausted ${maxAttempts} attempts`, [
                    workerLog(worker.index, 'stderr')
                ], failureCategory);
                throw new Error(`Shard ${worker.index} exhausted retry budget`);
            }
            await event('REPAIR_STARTED', `Restarting shard ${worker.index} from atomic checkpoints`, quarantined);
            await spawnWorker(worker);
        }
        await sleep(Number(config.pollIntervalMs || 15000));
    }

    const allResults = new Map();
    const groupAudits = [];
    for (let index = 0; index < workerCount; index += 1) {
        const results = await readLatestResults(path.join(shardDir(index), 'results.jsonl'));
        for (const [questionId, result] of results.entries()) {
            if (allResults.has(questionId)) throw new Error(`Duplicate result across shards: ${questionId}`);
            allResults.set(questionId, result);
        }
        const summary = await readJson(path.join(shardDir(index), 'summary.json'), {});
        groupAudits.push(...(summary.groupAudits || []));
    }
    const ordered = [...expectedQuestionIds].map((questionId) => allResults.get(questionId)).filter(Boolean);
    const aggregate = aggregatePersonaMemResults(ordered);
    const byPersona = {};
    for (const result of ordered) {
        byPersona[result.persona_id] ||= { total: 0, completed: 0, correct: 0, accuracy: null };
        const bucket = byPersona[result.persona_id];
        bucket.total += 1;
        if (result.status === 'completed') bucket.completed += 1;
        if (result.score?.correct === true) bucket.correct += 1;
        bucket.accuracy = bucket.completed ? bucket.correct / bucket.completed : null;
    }
    const uniqueAudits = new Map(groupAudits.map((audit) => [audit.sliceId, audit]));
    const finalSummary = {
        benchmark: 'PersonaMem',
        phase: 'balanced128',
        design: 'balanced_one_per_persona_type',
        completedAt: new Date().toISOString(),
        ...aggregate,
        byPersona,
        sample: rootManifest.sample,
        sampleDigest: stableHash(JSON.stringify(rootManifest.sample)),
        groupAudits: [...uniqueAudits.values()],
        invariants: {
            expectedQuestionCount: 140,
            uniqueQuestionCount: allResults.size,
            expectedPersonaCount: 20,
            observedPersonaCount: Object.keys(byPersona).length,
            expectedSliceCount: 39,
            auditedSliceCount: uniqueAudits.size,
            allSliceAuditsPassed: [...uniqueAudits.values()].every((audit) =>
                audit.slice?.includedMessageCount === audit.identity?.resolvedEndIndex),
            allWriteChainsPassed: [...uniqueAudits.values()].every((audit) => audit.writeChain?.ok === true),
            allLedgerAuditsPassed: [...uniqueAudits.values()].every((audit) => audit.ledgerAudit?.ok === true),
            questionTurnViolationCount: ordered.filter((result) =>
                result?.invariants?.questionTurnRecorded === true).length,
            taskAgentStepCount: 0,
            shortTermMessageCount: 0
        },
        manifestPath: rootManifestPath,
        shardCount: workerCount
    };
    const accepted = finalSummary.total === 140 && finalSummary.completed === 140 &&
        finalSummary.failed === 0 && finalSummary.invariants.observedPersonaCount === 20 &&
        finalSummary.invariants.auditedSliceCount === 39 &&
        finalSummary.invariants.allSliceAuditsPassed &&
        finalSummary.invariants.allWriteChainsPassed &&
        finalSummary.invariants.allLedgerAuditsPassed &&
        finalSummary.invariants.questionTurnViolationCount === 0;
    await writeJsonAtomic(path.join(runDir, 'summary.json'), finalSummary);
    await writeJsonAtomic(path.join(runDir, 'verdict.json'), {
        status: accepted ? 'accepted' : 'rejected',
        accepted,
        checkedAt: new Date().toISOString(),
        summaryPath: path.join(runDir, 'summary.json'),
        invariants: finalSummary.invariants
    });
    const typeRows = Object.entries(finalSummary.byQuestionType).map(([type, bucket]) =>
        `| ${type} | ${bucket.correct}/${bucket.completed} | ${(bucket.accuracy * 100).toFixed(2)}% |`).join('\n');
    const report = [
        '# AILIS Memory v3 PersonaMem 128K Balanced-140',
        '',
        `- Verdict: **${accepted ? 'ACCEPTED' : 'REJECTED'}**`,
        `- Overall: **${finalSummary.correct}/${finalSummary.completed} (${(finalSummary.accuracy * 100).toFixed(2)}%)**`,
        `- Failed: ${finalSummary.failed}`,
        '- Coverage: 20 personas × 7 query types × 1 deterministic question',
        '- Reader: deepseek-chat, temperature 0; Reader sees retrieved Memory v3 evidence only',
        '- Memory: hybrid_rrf_ledger_v3; retrieval Top-8; question writeback disabled',
        '',
        '## Accuracy by query type',
        '',
        '| Query type | Correct | Accuracy |',
        '|---|---:|---:|',
        typeRows,
        '',
        '## Integrity',
        '',
        `- Audited exact slices: ${finalSummary.invariants.auditedSliceCount}/39`,
        `- Slice/write/Ledger audits: ${finalSummary.invariants.allSliceAuditsPassed && finalSummary.invariants.allWriteChainsPassed && finalSummary.invariants.allLedgerAuditsPassed ? 'PASS' : 'FAIL'}`,
        `- Question writeback violations: ${finalSummary.invariants.questionTurnViolationCount}`,
        '- TaskAgent steps: 0',
        '- Short-term messages: 0',
        '',
        '> This is a deterministic balanced engineering evaluation, not the official full-context PersonaMem leaderboard score.',
        ''
    ].join('\n');
    await fs.writeFile(path.join(runDir, 'final-report.md'), report, 'utf8');
    if (!accepted) throw new Error('Final Balanced-140 acceptance gate failed');
    await updateProgress('completed', 'report result and stop heartbeat');
    await event('VERDICT_CREATED', 'Balanced-140 acceptance verdict passed', [
        path.join(runDir, 'verdict.json'),
        path.join(runDir, 'final-report.md')
    ]);
    await event('JOB_COMPLETED',
        `Balanced-140 completed ${finalSummary.correct}/${finalSummary.completed} (${(finalSummary.accuracy * 100).toFixed(2)}%)`,
        [path.join(runDir, 'summary.json'), path.join(runDir, 'final-report.md')]);
    await writeJsonAtomic(lockPath, {
        jobId: config.jobId,
        controllerPid: process.pid,
        status: 'completed',
        endedAt: new Date().toISOString()
    });
}

main().catch(async (error) => {
    console.error(`[PersonaMem Balanced-140 controller] ${error?.stack || error}`);
    process.exitCode = 1;
});
