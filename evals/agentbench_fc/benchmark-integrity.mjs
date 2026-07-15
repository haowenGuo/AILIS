import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const DEFAULT_AGENTBENCH_FC_MANIFEST = path.join(__dirname, 'benchmark-manifest.json');

function run(command, args, cwd) {
    return new Promise((resolve) => {
        const child = spawn(command, args, {
            cwd,
            windowsHide: true,
            stdio: ['ignore', 'pipe', 'pipe']
        });
        let stdout = '';
        let stderr = '';
        child.stdout.on('data', (chunk) => { stdout += chunk.toString(); });
        child.stderr.on('data', (chunk) => { stderr += chunk.toString(); });
        child.once('error', (error) => resolve({ code: -1, stdout, stderr, error: error.message }));
        child.once('close', (code) => resolve({ code, stdout, stderr }));
    });
}

async function exists(target) {
    try {
        await fs.access(target);
        return true;
    } catch {
        return false;
    }
}

async function hashFile(target) {
    return crypto.createHash('sha256').update(await fs.readFile(target)).digest('hex');
}

export async function readAgentBenchFcManifest(manifestPath = DEFAULT_AGENTBENCH_FC_MANIFEST) {
    return JSON.parse(await fs.readFile(manifestPath, 'utf8'));
}

export async function verifyAgentBenchFcCheckout({ root, manifest, task = '' }) {
    const failures = [];
    const gitResult = await run('git', ['rev-parse', 'HEAD'], root);
    const revision = gitResult.code === 0 ? gitResult.stdout.trim() : '';
    if (revision !== manifest.revision) {
        failures.push({ kind: 'revision_mismatch', expected: manifest.revision, actual: revision });
    }
    for (const [relativePath, expectedHash] of Object.entries(manifest.files || {})) {
        const absolutePath = path.join(root, relativePath);
        if (!await exists(absolutePath)) {
            failures.push({ kind: 'critical_file_missing', path: relativePath });
            continue;
        }
        const actualHash = await hashFile(absolutePath);
        if (actualHash !== expectedHash) {
            failures.push({
                kind: 'critical_file_hash_mismatch',
                path: relativePath,
                expected: expectedHash,
                actual: actualHash
            });
        }
    }
    const taskNames = task ? [task] : [];
    for (const taskName of taskNames) {
        const definition = manifest.tasks?.[taskName];
        if (!definition) {
            failures.push({ kind: 'unknown_task', task: taskName });
            continue;
        }
        for (const relativePath of definition.requiredPaths || []) {
            if (!await exists(path.join(root, relativePath))) {
                failures.push({ kind: 'required_data_missing', task: taskName, path: relativePath });
            }
        }
    }
    return {
        ok: failures.length === 0,
        schema: manifest.schema,
        repository: manifest.repository,
        expectedRevision: manifest.revision,
        actualRevision: revision,
        task: task || null,
        failures
    };
}

export function assertAgentBenchFcIntegrity(result) {
    if (result?.ok === true) return result;
    const details = (result?.failures || [])
        .map((failure) => `${failure.kind}${failure.path ? `:${failure.path}` : ''}`)
        .join(', ');
    throw new Error(`AgentBench FC integrity check failed: ${details || 'unknown failure'}`);
}
