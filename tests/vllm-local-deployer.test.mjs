import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createRequire } from 'node:module';
import os from 'node:os';
import path from 'node:path';

const require = createRequire(import.meta.url);
const {
    buildAutoLaunchProfile,
    buildDeployCommand,
    buildInstallPlan,
    buildNativeRuntimeProbeScript,
    buildRuntimeProbeScript,
    getBaseUrl,
    getReusableVenvCandidates,
    inspectDownloadTarget,
    normalizeRuntimeMode,
    normalizePathForWslpath,
    parseJsonSafe,
    summarizeFailure
} = require('../electron/vllm-local-deployer.cjs');

test('Windows native mode does not silently build a WSL deploy command', () => {
    assert.throws(() => buildDeployCommand({
        projectRoot: 'F:\\AILIS_self_evolution_runtime',
        platform: 'win32',
        source: 'modelscope',
        model: 'Qwen/Qwen3-1.7B',
        vllmPackage: 'stable',
        trustRemoteCode: true
    }), /高级连接模式/);
});

test('runtime mode defaults to native on Windows', () => {
    assert.equal(normalizeRuntimeMode('', 'win32'), 'native');
    assert.equal(normalizeRuntimeMode('wsl', 'win32'), 'wsl');
    assert.equal(normalizeRuntimeMode('managed', 'win32'), 'wsl');
    assert.equal(normalizeRuntimeMode('auto', 'linux'), 'native');
});

test('builds Windows WSL deploy command only when WSL mode is explicit', () => {
    const command = buildDeployCommand({
        projectRoot: 'F:\\AILIS_self_evolution_runtime',
        platform: 'win32',
        runtimeMode: 'wsl',
        source: 'modelscope',
        model: 'Qwen/Qwen3-1.7B',
        vllmPackage: 'stable',
        trustRemoteCode: true
    });

    assert.equal(command.command, 'powershell.exe');
    assert.ok(command.args.includes('-InstallWsl'));
    assert.ok(command.args.includes('-Start'));
    assert.ok(command.args.includes('-Detached'));
    assert.ok(command.args.includes('-WaitReady'));
    assert.ok(command.args.includes('-TrustRemoteCode'));
    assert.ok(command.args.includes('-VllmPackage'));
    assert.ok(command.args.includes('stable'));
    assert.equal(command.source, 'modelscope');
    assert.equal(command.modelId, 'Qwen/Qwen3-1.7B');
    assert.equal(command.runtimeMode, 'wsl');
    assert.equal(command.venvDir, '.ailis-runtime/vllm-venv');
    assert.equal(command.vllmPackage, 'stable');
    assert.equal(command.pipIndexUrl, 'https://pypi.tuna.tsinghua.edu.cn/simple');
    assert.ok(command.args.includes('-PipIndexUrl'));
    assert.ok(command.args.includes('https://pypi.tuna.tsinghua.edu.cn/simple'));
    assert.equal(command.baseUrl, 'http://127.0.0.1:8000/v1');
});

test('builds Linux deploy command without assuming system vLLM already exists', () => {
    const command = buildDeployCommand({
        projectRoot: '/work/ailis',
        platform: 'linux',
        source: 'hf',
        model: 'Qwen/Qwen3-4B-Instruct-2507',
        port: 8010,
        vllmPackage: 'vllm==0.5.5'
    });

    assert.equal(command.command, 'bash');
    assert.ok(command.args.includes('--source'));
    assert.ok(command.args.includes('hf'));
    assert.ok(command.args.includes('--model'));
    assert.ok(command.args.includes('Qwen/Qwen3-4B-Instruct-2507'));
    assert.ok(command.args.includes('--host'));
    assert.ok(command.args.includes('127.0.0.1'));
    assert.ok(command.args.includes('--venv-dir'));
    assert.ok(command.args.includes('.ailis-runtime/vllm-venv'));
    assert.ok(command.args.includes('--start'));
    assert.ok(command.args.includes('--detached'));
    assert.ok(command.args.includes('--wait-ready'));
    assert.ok(command.args.includes('--vllm-package'));
    assert.ok(command.args.includes('vllm==0.5.5'));
    assert.equal(command.venvDir, '.ailis-runtime/vllm-venv');
    assert.equal(command.vllmPackage, 'vllm==0.5.5');
    assert.ok(command.args.includes('--pip-index-url'));
    assert.ok(command.args.includes('https://pypi.tuna.tsinghua.edu.cn/simple'));
    assert.equal(command.baseUrl, 'http://127.0.0.1:8010/v1');
});

test('builds local vLLM deploy command with a stable served model name', () => {
    const command = buildDeployCommand({
        projectRoot: 'F:\\AILIS_self_evolution_runtime',
        platform: 'win32',
        runtimeMode: 'wsl',
        source: 'local',
        model: 'F:\\models\\Qwen3-4B-Instruct',
        servedModelName: 'local-qwen3-4b',
        maxModelLen: 4096,
        cpuOffloadGb: 3,
        swapSpace: 6
    });

    assert.equal(command.command, 'powershell.exe');
    assert.equal(command.source, 'local');
    assert.equal(command.modelId, 'F:\\models\\Qwen3-4B-Instruct');
    assert.equal(command.servedModelId, 'local-qwen3-4b');
    assert.ok(command.args.includes('-Source'));
    assert.ok(command.args.includes('local'));
    assert.ok(command.args.includes('-Model'));
    assert.ok(command.args.includes('F:\\models\\Qwen3-4B-Instruct'));
    assert.ok(command.args.includes('-ServedModelName'));
    assert.ok(command.args.includes('local-qwen3-4b'));
    assert.ok(command.args.includes('-CpuOffloadGb'));
    assert.ok(command.args.includes('3'));
    assert.ok(command.args.includes('-SwapSpace'));
    assert.ok(command.args.includes('6'));
});

test('infers local source for filesystem model paths even when caller passes online source', () => {
    const command = buildDeployCommand({
        projectRoot: 'F:\\AILIS_self_evolution_runtime',
        platform: 'win32',
        runtimeMode: 'wsl',
        source: 'modelscope',
        model: 'F:\\lab\\LLM project\\Qwen3-4B',
        servedModelName: 'local-Qwen3-4B'
    });

    assert.equal(command.source, 'local');
    const sourceIndex = command.args.indexOf('-Source');
    assert.equal(command.args[sourceIndex + 1], 'local');
    assert.equal(command.modelId, 'F:\\lab\\LLM project\\Qwen3-4B');
});

test('install plan does not download weights for local vLLM model paths', () => {
    const plan = buildInstallPlan({
        platform: 'linux',
        source: 'local',
        targetModel: 'local-qwen3-4b',
        runtime: {
            available: true,
            pythonOk: true,
            venvAvailable: true,
            pipAvailable: true,
            vllmInstalled: true,
            gpuInfo: 'NVIDIA GPU'
        },
        service: { ok: false, modelIds: [] }
    });

    assert.equal(plan.ok, true);
    assert.equal(plan.steps.some((step) => step.id === 'download_model'), false);
    assert.ok(plan.steps.some((step) => step.id === 'start_vllm'));
    assert.equal(plan.requiresNetwork, false);
});

test('install plan requires an install path before downloading online models', () => {
    const plan = buildInstallPlan({
        platform: 'linux',
        source: 'hf',
        targetModel: 'Qwen/Qwen3-1.7B',
        runtime: {
            available: true,
            pythonOk: true,
            venvAvailable: true,
            pipAvailable: true,
            vllmInstalled: true,
            gpuInfo: 'NVIDIA GPU'
        },
        service: { ok: false, modelIds: [] }
    });

    assert.equal(plan.ok, false);
    assert.ok(plan.steps.some((step) => step.id === 'select_download_dir'));
    assert.equal(plan.steps.some((step) => step.id === 'download_model'), false);
});

test('install plan downloads online models only after install path is ready', () => {
    const plan = buildInstallPlan({
        platform: 'linux',
        source: 'modelscope',
        targetModel: 'Qwen/Qwen3-1.7B',
        runtime: {
            available: true,
            pythonOk: true,
            venvAvailable: true,
            pipAvailable: true,
            vllmInstalled: true,
            gpuInfo: 'NVIDIA GPU'
        },
        downloadTarget: {
            ok: true,
            path: '/models/ailis',
            blockers: [],
            warnings: []
        },
        service: { ok: false, modelIds: [] }
    });

    assert.equal(plan.ok, true);
    assert.ok(plan.steps.some((step) => step.id === 'download_model'));
    assert.match(
        plan.steps.find((step) => step.id === 'download_model')?.description || '',
        /\/models\/ailis/
    );
});

test('download target inspection reports invalid install folders before deployment', () => {
    const missingParentPath = path.join(os.tmpdir(), `ailis-missing-${Date.now()}-${Math.random()}`, 'models');
    const result = inspectDownloadTarget({
        downloadDir: missingParentPath,
        modelId: 'Qwen/Qwen3-4B'
    });

    assert.equal(result.ok, false);
    assert.ok(result.requiredBytes > 0);
    assert.ok(result.blockers.some((item) => /上级目录不存在/.test(item)));
});

test('install plan reuses a discovered vLLM runtime instead of forcing reinstall', () => {
    const plan = buildInstallPlan({
        platform: 'win32',
        runtimeMode: 'wsl',
        wsl: { required: true, available: true, distros: ['Ubuntu'] },
        source: 'local',
        targetModel: 'local-qwen3-4b',
        runtime: {
            available: true,
            shellOk: true,
            pythonOk: true,
            venvAvailable: true,
            pipAvailable: true,
            vllmInstalled: false,
            reusableVenvDir: '~/.cache/ailis/vllm-smoke-venv',
            gpuInfo: 'NVIDIA GPU'
        },
        service: { ok: true, modelIds: ['Qwen/Qwen2-0.5B-Instruct'] }
    });

    assert.equal(plan.ok, true);
    assert.equal(plan.steps.some((step) => step.id === 'install_vllm'), false);
    assert.ok(plan.steps.some((step) => step.id === 'switch_vllm_service'));
    assert.equal(plan.requiresNetwork, false);
});

test('install plan upgrades a reusable runtime when it is incompatible with the local model', () => {
    const plan = buildInstallPlan({
        platform: 'win32',
        runtimeMode: 'wsl',
        wsl: { required: true, available: true, distros: ['Ubuntu'] },
        source: 'local',
        targetModel: 'local-qwen3-4b',
        runtime: {
            available: true,
            shellOk: true,
            pythonOk: true,
            venvAvailable: true,
            pipAvailable: true,
            vllmInstalled: false,
            reusableVenvDir: '~/.cache/ailis/vllm-smoke-venv',
            modelCompatibility: {
                ok: false,
                reason: '本地模型声明需要 transformers 4.51.0+，当前可复用 runtime 是 4.44.2，需要升级。'
            },
            gpuInfo: 'NVIDIA GPU'
        },
        service: { ok: false, modelIds: [] }
    });

    assert.equal(plan.ok, true);
    assert.ok(plan.steps.some((step) => step.id === 'install_vllm'));
    assert.match(
        plan.steps.find((step) => step.id === 'install_vllm')?.description || '',
        /需要升级/
    );
});

test('install plan warns when local model weights are larger than GPU memory', () => {
    const launchProfile = buildAutoLaunchProfile({
        source: 'local',
        runtime: {
            gpuInfo: 'NVIDIA GeForce RTX 3060 Laptop GPU, 6144 MiB, 546.92'
        },
        modelRequirements: {
            weightBytes: 8 * 1024 ** 3
        },
        modelHardwareFit: {
            ok: false,
            severity: 'high',
            reason: '本地模型权重约 8.0GB，大于当前最大 GPU 显存约 6.0GB。'
        }
    });
    const plan = buildInstallPlan({
        platform: 'win32',
        runtimeMode: 'wsl',
        wsl: { required: true, available: true, distros: ['Ubuntu'] },
        source: 'local',
        targetModel: 'local-qwen3-4b',
        runtime: {
            available: true,
            shellOk: true,
            pythonOk: true,
            venvAvailable: true,
            pipAvailable: true,
            vllmInstalled: true,
            gpuInfo: 'NVIDIA GeForce RTX 3060 Laptop GPU, 6144 MiB, 546.92'
        },
        modelHardwareFit: {
            ok: false,
            severity: 'high',
            reason: '本地模型权重约 7.6GB，大于当前最大 GPU 显存约 6.0GB。'
        },
        launchProfile,
        service: { ok: false, modelIds: [] }
    });

    const memoryStep = plan.steps.find((step) => step.id === 'gpu_memory_fit');
    assert.equal(memoryStep?.severity, 'warning');
    assert.match(memoryStep?.description || '', /权重约 7\.6GB/);
    const autoStep = plan.steps.find((step) => step.id === 'auto_launch_profile');
    assert.equal(autoStep?.severity, 'warning');
    assert.match(autoStep?.description || '', /cpu_offload_gb/);
    assert.equal(launchProfile.maxModelLen, 2048);
    assert.ok(launchProfile.cpuOffloadGb > 0);
});

test('install plan warns but does not block modern runtime upgrade on older NVIDIA driver', () => {
    const plan = buildInstallPlan({
        platform: 'win32',
        runtimeMode: 'wsl',
        wsl: { required: true, available: true, distros: ['Ubuntu'] },
        source: 'local',
        targetModel: 'local-qwen3-4b',
        runtime: {
            available: true,
            shellOk: true,
            pythonOk: true,
            venvAvailable: true,
            pipAvailable: true,
            reusableVenvDir: '~/.cache/ailis/vllm-smoke-venv',
            modelCompatibility: {
                ok: false,
                reason: '本地模型声明需要 transformers 4.51.0+，当前可复用 runtime 是 4.44.2，需要升级。'
            },
            gpuInfo: 'NVIDIA GeForce RTX 3060 Laptop GPU, 6144 MiB, 546.92'
        },
        runtimeUpgradeFeasibility: {
            ok: true,
            severity: 'warning',
            reason: '当前 NVIDIA 驱动 546.92 偏旧，将在隔离 runtime 中升级验证。'
        },
        service: { ok: false, modelIds: [] }
    });

    assert.equal(plan.ok, true);
    const caution = plan.steps.find((step) => step.id === 'runtime_upgrade_caution');
    assert.equal(caution?.severity, 'warning');
    assert.equal(plan.blockingSteps.some((step) => step.id === 'runtime_upgrade_caution'), false);
});


test('install plan detects missing Windows WSL and Python/runtime setup', () => {
    const plan = buildInstallPlan({
        platform: 'win32',
        runtimeMode: 'wsl',
        wsl: { required: true, available: false, distros: [] },
        runtime: { available: false },
        service: { ok: false }
    });

    assert.equal(plan.ok, false);
    assert.ok(plan.steps.some((step) => step.id === 'install_wsl'));
    assert.ok(plan.steps.some((step) => step.id === 'start_vllm'));
    assert.equal(plan.requiresSystemChange, true);
});

test('install plan does not require WSL in Windows native mode', () => {
    const plan = buildInstallPlan({
        platform: 'win32',
        runtimeMode: 'native',
        wsl: { required: false, available: false, distros: [] },
        source: 'local',
        targetModel: 'local-qwen3-4b',
        runtime: {
            available: true,
            shellOk: true,
            pythonOk: false,
            pythonMissing: true,
            venvAvailable: false,
            pipAvailable: false,
            vllmInstalled: false
        },
        service: { ok: false, modelIds: [] }
    });

    assert.equal(plan.ok, false);
    assert.equal(plan.steps.some((step) => step.id === 'install_wsl'), false);
    assert.equal(plan.steps.some((step) => step.id === 'repair_wsl_shell'), false);
    assert.equal(plan.steps.some((step) => step.id === 'install_python'), false);
    assert.ok(plan.steps.some((step) => step.id === 'windows_native_vllm_service_required'));
});

test('install plan blocks Windows native mode when running service has another model', () => {
    const plan = buildInstallPlan({
        platform: 'win32',
        runtimeMode: 'native',
        source: 'local',
        targetModel: 'local-qwen3-4b',
        runtime: {
            available: true,
            shellOk: true,
            pythonOk: true,
            venvAvailable: true,
            pipAvailable: true,
            vllmInstalled: false
        },
        service: { ok: true, modelIds: ['other-model'] }
    });

    assert.equal(plan.ok, false);
    assert.ok(plan.steps.some((step) => step.id === 'windows_native_vllm_model_mismatch'));
});

test('install plan detects Python, vLLM, GPU, and service readiness work', () => {
    const plan = buildInstallPlan({
        platform: 'linux',
        targetModel: 'Qwen/Qwen3-1.7B',
        runtime: {
            available: true,
            pythonOk: false,
            venvAvailable: false,
            pipAvailable: false,
            vllmInstalled: false,
            gpuInfo: '',
            diskAvailableKb: 2 * 1024 * 1024
        },
        downloadTarget: {
            ok: true,
            path: '/models',
            blockers: [],
            warnings: []
        },
        service: { ok: false }
    });

    assert.equal(plan.ok, true);
    assert.ok(plan.steps.some((step) => step.id === 'install_python'));
    assert.ok(plan.steps.some((step) => step.id === 'install_vllm'));
    assert.ok(plan.steps.some((step) => step.id === 'disk_space_low'));
    assert.ok(plan.steps.some((step) => step.id === 'download_model'));
    assert.ok(plan.steps.some((step) => step.id === 'gpu_check'));
    assert.ok(plan.steps.some((step) => step.id === 'start_vllm'));
    assert.equal(plan.requiresNetwork, true);
});

test('install plan treats shell-ready but Python-missing runtime as auto-fixable', () => {
    const plan = buildInstallPlan({
        platform: 'win32',
        runtimeMode: 'wsl',
        wsl: { required: true, available: true, distros: ['Ubuntu-22.04'] },
        targetModel: 'Qwen/Qwen3-1.7B',
        runtime: {
            available: true,
            shellOk: true,
            pythonOk: false,
            pythonMissing: true,
            venvAvailable: false,
            pipAvailable: false,
            vllmInstalled: false
        },
        downloadTarget: {
            ok: true,
            path: '/models',
            blockers: [],
            warnings: []
        },
        service: { ok: false, modelIds: [] }
    });

    assert.equal(plan.ok, true);
    assert.deepEqual(
        plan.steps.map((step) => step.id).filter((id) => ['install_python', 'install_vllm', 'download_model'].includes(id)),
        ['install_python', 'install_vllm', 'download_model']
    );
});

test('install plan blocks when WSL shell itself cannot start', () => {
    const plan = buildInstallPlan({
        platform: 'win32',
        runtimeMode: 'wsl',
        wsl: { required: true, available: true, distros: ['Ubuntu-22.04'] },
        targetModel: 'local-Qwen3-4B',
        source: 'local',
        runtime: {
            available: false,
            shellOk: false,
            pythonOk: false,
            error: 'Wsl/WSL_E_USER_NOT_FOUND getpwuid(0) failed 5 CreateProcessCommon:807',
            shellFailure: {
                code: 'wsl_shell_unusable',
                blocking: true,
                message: 'WSL/Ubuntu 已安装，但 Linux shell 无法启动。'
            }
        },
        service: { ok: false, modelIds: [] }
    });

    assert.equal(plan.ok, false);
    assert.ok(plan.steps.some((step) => step.id === 'repair_wsl_shell'));
    assert.equal(plan.steps.some((step) => step.id === 'install_python'), false);
});

test('runtime probe can report missing Python without needing Python itself', () => {
    const script = buildRuntimeProbeScript('/mnt/f/AILIS_self_evolution_runtime');
    assert.match(script, /if ! command -v python3/);
    assert.match(script, /"pythonMissing":true/);
    assert.match(script, /runtimeCandidates/);
    assert.match(script, /reusableVenvDir/);
    assert.match(script, /transformersVersion/);
});

test('runtime discovery keeps Windows native paths separate from WSL paths', () => {
    const candidates = getReusableVenvCandidates('', 'win32');
    assert.deepEqual(candidates, ['.ailis-runtime/vllm-venv']);
    const wslCandidates = getReusableVenvCandidates('', 'win32', 'wsl');
    assert.ok(wslCandidates.includes('~/.cache/ailis/vllm-venv'));
    assert.ok(wslCandidates.includes('~/.cache/ailis/vllm-smoke-venv'));
});

test('native runtime probe script does not create runtime directories during diagnosis', () => {
    const script = buildNativeRuntimeProbeScript('F:\\AILIS_self_evolution_runtime');
    assert.doesNotMatch(script, /os\.makedirs/);
    assert.match(script, /runtimeCandidates/);
});

test('summarizes common deployment failures as actionable causes', () => {
    assert.equal(
        summarizeFailure(['No WSL distro found. Run wsl --install -d Ubuntu'], 3).code,
        'wsl_missing'
    );
    assert.equal(
        summarizeFailure(['Wsl/WSL_E_USER_NOT_FOUND', 'getpwuid(0) failed 5', 'CreateProcessCommon:807'], 1).code,
        'wsl_shell_unusable'
    );
    assert.equal(
        summarizeFailure(['python3 was not found'], 3).code,
        'python_missing'
    );
    assert.equal(
        summarizeFailure(['CUDA out of memory'], 1).code,
        'gpu_or_cuda'
    );
    assert.equal(
        summarizeFailure([
            'NVIDIA GPU detected: NVIDIA GeForce RTX 3060 Laptop GPU, 6144 MiB',
            'ValueError: The checkpoint you are trying to load has model type `qwen3` but Transformers does not recognize this architecture.'
        ], 1).code,
        'model_runtime_incompatible'
    );
    assert.equal(
        summarizeFailure([
            'NVIDIA GPU detected: NVIDIA GeForce RTX 3060 Laptop GPU, 6144 MiB',
            'vLLM did not become ready within 1200s.'
        ], 4).code,
        'ready_timeout'
    );
    assert.equal(
        summarizeFailure([
            'Successfully installed nvidia-cuda-runtime-cu12',
            'huggingface_hub.errors.LocalEntryNotFoundError',
            'Network is unreachable'
        ], 1).code,
        'model_download_or_network'
    );
});

test('normalizes client base URL for wildcard host', () => {
    assert.equal(getBaseUrl({ host: '0.0.0.0', port: 8001 }), 'http://127.0.0.1:8001/v1');
});

test('normalizes Windows paths before passing them to wslpath', () => {
    assert.equal(
        normalizePathForWslpath('F:\\AILIS_self_evolution_runtime'),
        'F:/AILIS_self_evolution_runtime'
    );
});

test('parses runtime probe JSON even when WSL emits warnings first', () => {
    const payload = parseJsonSafe('w\0s\0l\0 warning\n{"pythonOk":true,"pythonVersion":"3.10.12"}\n', {});
    assert.equal(payload.pythonOk, true);
    assert.equal(payload.pythonVersion, '3.10.12');
});
