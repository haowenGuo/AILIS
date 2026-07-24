import { spawn } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { AILISToolDoctor } = require('../electron/ailis-tool-doctor.cjs');
const { AILISMcpManager } = require('../electron/ailis-mcp-session.cjs');

function parseArgs(argv) {
    const result = {
        mode: 'smoke',
        runEval: false,
        discoverPaths: [],
        githubRepos: [],
        cloneGithub: false,
        outputDir: path.resolve('eval-results', 'tool-doctor'),
        stateDir: path.resolve('.ailis-state')
    };
    for (let index = 0; index < argv.length; index += 1) {
        const arg = argv[index];
        if (arg === '--mode') {
            result.mode = argv[index + 1] || result.mode;
            index += 1;
        } else if (arg === '--run-eval' || arg === '--run') {
            result.runEval = true;
        } else if (arg === '--discover') {
            result.discoverPaths.push(argv[index + 1]);
            index += 1;
        } else if (arg === '--github-repo') {
            result.githubRepos.push(argv[index + 1]);
            index += 1;
        } else if (arg === '--clone-github') {
            result.cloneGithub = true;
        } else if (arg === '--output-dir') {
            result.outputDir = path.resolve(argv[index + 1] || result.outputDir);
            index += 1;
        } else if (arg === '--state-dir') {
            result.stateDir = path.resolve(argv[index + 1] || result.stateDir);
            index += 1;
        }
    }
    result.discoverPaths = result.discoverPaths.filter(Boolean);
    result.githubRepos = result.githubRepos.filter(Boolean);
    return result;
}

function runCommand(command, options = {}) {
    const startedAt = Date.now();
    const isWindows = process.platform === 'win32';
    return new Promise((resolve) => {
        let settled = false;
        let timedOut = false;
        const child = spawn(isWindows ? 'cmd.exe' : 'sh', isWindows ? ['/d', '/s', '/c', command] : ['-lc', command], {
            cwd: options.cwd || process.cwd(),
            env: process.env,
            stdio: ['ignore', 'pipe', 'pipe'],
            windowsHide: true
        });
        const timeoutMs = Number(options.timeoutMs || 120000);
        let stdout = '';
        let stderr = '';
        const finish = (payload) => {
            if (settled) {
                return;
            }
            settled = true;
            clearTimeout(timer);
            resolve(payload);
        };
        const killTree = () => {
            timedOut = true;
            if (isWindows && child.pid) {
                const killer = spawn('taskkill.exe', ['/PID', String(child.pid), '/T', '/F'], {
                    stdio: 'ignore',
                    windowsHide: true
                });
                killer.on('error', () => {
                    child.kill('SIGTERM');
                });
                return;
            }
            child.kill('SIGTERM');
        };
        const timer = setTimeout(killTree, timeoutMs);
        child.stdout.on('data', (chunk) => {
            stdout += chunk.toString();
        });
        child.stderr.on('data', (chunk) => {
            stderr += chunk.toString();
        });
        child.on('close', (code, signal) => {
            finish({
                command,
                ok: code === 0 && !timedOut,
                code,
                signal,
                timedOut,
                durationMs: Date.now() - startedAt,
                stdout: stdout.slice(-12000),
                stderr: timedOut
                    ? `${stderr.slice(-11000)}\n[tool_doctor] timed out after ${timeoutMs}ms`
                    : stderr.slice(-12000)
            });
        });
        child.on('error', (error) => {
            finish({
                command,
                ok: false,
                code: null,
                signal: '',
                timedOut,
                durationMs: Date.now() - startedAt,
                stdout,
                stderr: error?.message || String(error)
            });
        });
    });
}

async function main() {
    const args = parseArgs(process.argv.slice(2));
    const projectRoot = path.resolve('.');
    const auditDir = args.stateDir;
    const mcpManager = new AILISMcpManager({
        workspaceRoot: projectRoot,
        projectRoot,
        configPath: path.join(auditDir, 'mcp-servers.json')
    });
    const doctor = new AILISToolDoctor({
        workspaceRoot: projectRoot,
        projectRoot,
        auditDir,
        mcpManager
    });
    const startedAt = new Date().toISOString();
    const health = (await doctor.execute({
        action: 'health_check',
        mode: args.mode,
        includeMcp: true
    })).details;
    const evalPlan = (await doctor.execute({
        action: 'eval_plan',
        mode: args.mode
    })).details;
    const discovery = args.discoverPaths.length || args.githubRepos.length
        ? (await doctor.execute({
            action: 'discover_mcp',
            paths: args.discoverPaths,
            githubRepos: args.githubRepos,
            cloneGithub: args.cloneGithub
        })).details
        : null;
    const evalResults = [];
    if (args.runEval) {
        for (const check of evalPlan.checks) {
            const result = await runCommand(check.command, { cwd: projectRoot });
            evalResults.push({
                id: check.id,
                purpose: check.purpose,
                ...result
            });
            await doctor.execute({
                action: 'record_observation',
                tool: `eval:${check.id}`,
                status: result.ok ? 'success' : (result.timedOut ? 'timeout' : 'failed'),
                latencyMs: result.durationMs,
                errorCode: result.ok ? '' : (result.timedOut ? 'timeout' : `exit_${result.code ?? 'error'}`),
                summary: check.command
            });
        }
    }
    const failed = evalResults.filter((result) => !result.ok);
    if (failed.length) {
        await doctor.execute({
            action: 'propose_repair',
            tool: 'eval',
            title: `Tool Doctor eval failed: ${failed.map((item) => item.id).join(', ')}`,
            reason: 'Scheduled tool/eval health check found failing checks.',
            evidence: failed.map((item) => ({
                id: item.id,
                command: item.command,
                durationMs: item.durationMs,
                stderrTail: item.stderr
            })),
            validationCommands: evalPlan.checks.map((check) => check.command)
        });
    }
    await fs.mkdir(args.outputDir, { recursive: true });
    const report = {
        ok: failed.length === 0,
        status: failed.length ? 'degraded' : 'completed',
        startedAt,
        completedAt: new Date().toISOString(),
        mode: args.mode,
        runEval: args.runEval,
        health,
        discovery,
        evalPlan,
        evalResults,
        scorecard: (await doctor.execute({ action: 'scorecard' })).details
    };
    const reportPath = path.join(args.outputDir, `tool-doctor-${Date.now()}.json`);
    await fs.writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
    console.log(JSON.stringify({
        ok: report.ok,
        status: report.status,
        reportPath,
        mode: args.mode,
        runEval: args.runEval,
        evalChecks: evalResults.length,
        failedChecks: failed.map((item) => item.id),
        recommendations: health.recommendations || []
    }, null, 2));
    await mcpManager.shutdown().catch(() => {});
    process.exitCode = report.ok ? 0 : 1;
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
