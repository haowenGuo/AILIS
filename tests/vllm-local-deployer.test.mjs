import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const {
    buildDeployCommand,
    buildInstallPlan,
    getBaseUrl,
    summarizeFailure
} = require('../electron/vllm-local-deployer.cjs');

test('builds Windows one-click deploy command with automatic WSL bootstrap', () => {
    const command = buildDeployCommand({
        projectRoot: 'F:\\AILIS_self_evolution_runtime',
        platform: 'win32',
        source: 'modelscope',
        model: 'Qwen/Qwen3-1.7B',
        trustRemoteCode: true
    });

    assert.equal(command.command, 'powershell.exe');
    assert.ok(command.args.includes('-InstallWsl'));
    assert.ok(command.args.includes('-Start'));
    assert.ok(command.args.includes('-Detached'));
    assert.ok(command.args.includes('-WaitReady'));
    assert.ok(command.args.includes('-TrustRemoteCode'));
    assert.equal(command.source, 'modelscope');
    assert.equal(command.modelId, 'Qwen/Qwen3-1.7B');
    assert.equal(command.baseUrl, 'http://127.0.0.1:8000/v1');
});

test('builds Linux deploy command without assuming system vLLM already exists', () => {
    const command = buildDeployCommand({
        projectRoot: '/work/ailis',
        platform: 'linux',
        source: 'hf',
        model: 'Qwen/Qwen3-4B-Instruct-2507',
        port: 8010
    });

    assert.equal(command.command, 'bash');
    assert.deepEqual(command.args.slice(1, 7), [
        '--source',
        'hf',
        '--model',
        'Qwen/Qwen3-4B-Instruct-2507',
        '--host',
        '127.0.0.1'
    ]);
    assert.ok(command.args.includes('--start'));
    assert.ok(command.args.includes('--detached'));
    assert.ok(command.args.includes('--wait-ready'));
    assert.equal(command.baseUrl, 'http://127.0.0.1:8010/v1');
});

test('install plan detects missing Windows WSL and Python/runtime setup', () => {
    const plan = buildInstallPlan({
        platform: 'win32',
        wsl: { required: true, available: false, distros: [] },
        runtime: { available: false },
        service: { ok: false }
    });

    assert.equal(plan.ok, false);
    assert.ok(plan.steps.some((step) => step.id === 'install_wsl'));
    assert.ok(plan.steps.some((step) => step.id === 'start_vllm'));
    assert.equal(plan.requiresSystemChange, true);
});

test('install plan detects Python, vLLM, GPU, and service readiness work', () => {
    const plan = buildInstallPlan({
        platform: 'linux',
        runtime: {
            available: true,
            pythonOk: false,
            vllmInstalled: false,
            gpuInfo: ''
        },
        service: { ok: false }
    });

    assert.equal(plan.ok, true);
    assert.ok(plan.steps.some((step) => step.id === 'install_python'));
    assert.ok(plan.steps.some((step) => step.id === 'install_vllm'));
    assert.ok(plan.steps.some((step) => step.id === 'gpu_check'));
    assert.ok(plan.steps.some((step) => step.id === 'start_vllm'));
    assert.equal(plan.requiresNetwork, true);
});

test('summarizes common deployment failures as actionable causes', () => {
    assert.equal(
        summarizeFailure(['No WSL distro found. Run wsl --install -d Ubuntu'], 3).code,
        'wsl_missing'
    );
    assert.equal(
        summarizeFailure(['python3 was not found'], 3).code,
        'python_missing'
    );
    assert.equal(
        summarizeFailure(['CUDA out of memory'], 1).code,
        'gpu_or_cuda'
    );
});

test('normalizes client base URL for wildcard host', () => {
    assert.equal(getBaseUrl({ host: '0.0.0.0', port: 8001 }), 'http://127.0.0.1:8001/v1');
});
