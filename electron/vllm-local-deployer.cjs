const { EventEmitter } = require('events');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const DEFAULT_HOST = '127.0.0.1';
const DEFAULT_PORT = 8000;
const DEFAULT_READY_TIMEOUT_SEC = 900;
const MAX_LOG_LINES = 160;
const MAX_LINE_LENGTH = 4000;
const MIN_RECOMMENDED_DISK_KB = 12 * 1024 * 1024;
const DEFAULT_PROJECT_VENV_DIR = '.ailis-runtime/vllm-venv';
const DEFAULT_PIP_INDEX_URL = 'https://pypi.tuna.tsinghua.edu.cn/simple';
const LEGACY_VLLM_TRANSFORMERS_VERSION = '4.44.2';
const BYTES_PER_GIB = 1024 ** 3;
const DEFAULT_UNKNOWN_MODEL_DOWNLOAD_BYTES = 20 * BYTES_PER_GIB;

function formatGiB(bytes = 0) {
    const value = Number(bytes) || 0;
    return `${(value / BYTES_PER_GIB).toFixed(1)}GB`;
}

function parseParameterCountFromModelId(modelId = '') {
    const text = String(modelId || '');
    const matches = Array.from(text.matchAll(/(^|[^A-Za-z0-9])([0-9]+(?:\.[0-9]+)?)\s*([bm])([^A-Za-z0-9]|$)/gi));
    if (!matches.length) {
        return 0;
    }
    const match = matches[matches.length - 1];
    const value = Number(match[2]);
    if (!Number.isFinite(value) || value <= 0) {
        return 0;
    }
    return match[3].toLowerCase() === 'b'
        ? value * 1_000_000_000
        : value * 1_000_000;
}

function estimateRequiredDownloadBytes({ modelId = '', sizeBytes = 0 } = {}) {
    const explicitSize = Math.max(0, Number(sizeBytes) || 0);
    const parameterCount = parseParameterCountFromModelId(modelId);
    const estimatedWeightBytes = parameterCount > 0
        ? parameterCount * 2.2
        : DEFAULT_UNKNOWN_MODEL_DOWNLOAD_BYTES;
    const modelBytes = Math.max(explicitSize, estimatedWeightBytes);
    return Math.ceil(modelBytes * 1.25 + 4 * BYTES_PER_GIB);
}

function normalizeModelId(value = '') {
    return String(value || '').trim().slice(0, 240);
}

function normalizeModelReference(value = '') {
    return String(value || '').trim().slice(0, 1000);
}

function normalizeSource(value = 'modelscope') {
    const normalized = String(value || '').trim().toLowerCase();
    if (normalized === 'local' || normalized === 'path' || normalized === 'folder') {
        return 'local';
    }
    if (normalized === 'hf' || normalized === 'huggingface' || normalized === 'hugging-face') {
        return 'hf';
    }
    if (normalized === 'ms' || normalized === 'modelscope' || normalized === 'model-scope') {
        return 'modelscope';
    }
    return 'modelscope';
}

function looksLikeLocalModelPath(value = '') {
    const text = String(value || '').trim();
    if (!text) {
        return false;
    }
    return /^[A-Za-z]:[\\/]/.test(text) ||
        /^\\\\/.test(text) ||
        text.startsWith('/') ||
        text.startsWith('~/') ||
        text.startsWith('./') ||
        text.startsWith('../') ||
        fs.existsSync(text);
}

function inferVllmSource(source = 'modelscope', model = '') {
    const normalized = normalizeSource(source);
    if (normalized !== 'local' && looksLikeLocalModelPath(model)) {
        return 'local';
    }
    return normalized;
}

function normalizePort(value = DEFAULT_PORT) {
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) {
        return DEFAULT_PORT;
    }
    return Math.max(1, Math.min(65535, Math.floor(numeric)));
}

function normalizeReadyTimeoutSec(value = DEFAULT_READY_TIMEOUT_SEC) {
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) {
        return DEFAULT_READY_TIMEOUT_SEC;
    }
    return Math.max(60, Math.min(7200, Math.floor(numeric)));
}

function normalizeVllmPackage(value = 'auto') {
    const normalized = String(value || '').trim();
    if (!normalized) {
        return 'auto';
    }
    return normalized.slice(0, 160);
}

function getDefaultVenvDir(platform = process.platform) {
    return DEFAULT_PROJECT_VENV_DIR;
}

function normalizeVenvDir(value = '', platform = process.platform) {
    const normalized = String(value || '').trim();
    return (normalized || getDefaultVenvDir(platform)).slice(0, 260);
}

function normalizeRuntimeMode(value = '', platform = process.platform) {
    const normalized = String(value || '').trim().toLowerCase();
    if (normalized === 'auto' || normalized === 'managed' || normalized === 'ailis-managed' || normalized === 'automatic') {
        return platform === 'win32' ? 'wsl' : 'native';
    }
    if (normalized === 'wsl' || normalized === 'linux-wsl' || normalized === 'compat' || normalized === 'compatibility') {
        return 'wsl';
    }
    if (normalized === 'native' || normalized === 'host' || normalized === 'windows' || normalized === 'local') {
        return 'native';
    }
    return platform === 'win32' ? 'native' : 'native';
}

function parseVersionTuple(value = '') {
    const parts = String(value || '')
        .match(/\d+/g)
        ?.slice(0, 3)
        .map((part) => Number(part)) || [];
    while (parts.length < 3) {
        parts.push(0);
    }
    return parts;
}

function compareVersions(a = '', b = '') {
    const left = parseVersionTuple(a);
    const right = parseVersionTuple(b);
    for (let index = 0; index < 3; index += 1) {
        if (left[index] > right[index]) {
            return 1;
        }
        if (left[index] < right[index]) {
            return -1;
        }
    }
    return 0;
}

function readLocalModelRequirements(modelPath = '') {
    const modelDir = String(modelPath || '').trim();
    if (!modelDir) {
        return null;
    }
    try {
        const configPath = path.join(modelDir, 'config.json');
        if (!fs.existsSync(configPath)) {
            return null;
        }
        const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        const transformersVersion = String(config.transformers_version || '').trim();
        const weightStats = estimateLocalModelWeightSize(modelDir);
        return {
            modelType: String(config.model_type || '').trim(),
            architectures: Array.isArray(config.architectures) ? config.architectures.filter(Boolean) : [],
            transformersVersion,
            weightBytes: weightStats.bytes,
            weightFileCount: weightStats.fileCount,
            legacyTransformersVersion: LEGACY_VLLM_TRANSFORMERS_VERSION,
            requiresModernTransformers: Boolean(
                transformersVersion &&
                compareVersions(transformersVersion, LEGACY_VLLM_TRANSFORMERS_VERSION) > 0
            )
        };
    } catch {
        return null;
    }
}

function estimateLocalModelWeightSize(modelDir = '') {
    const result = { bytes: 0, fileCount: 0 };
    try {
        const entries = fs.readdirSync(modelDir, { withFileTypes: true });
        for (const entry of entries) {
            if (!entry.isFile()) {
                continue;
            }
            if (!/\.(safetensors|bin|gguf|pth|pt)$/i.test(entry.name)) {
                continue;
            }
            const stats = fs.statSync(path.join(modelDir, entry.name));
            result.bytes += Number(stats.size) || 0;
            result.fileCount += 1;
        }
    } catch {
        // Best-effort sizing only; deployment can still continue without it.
    }
    return result;
}

function parseGpuMemoryMiB(gpuInfo = '') {
    const values = [];
    const text = String(gpuInfo || '');
    for (const segment of text.split(/[;\n]+/)) {
        const match = segment.match(/,\s*([0-9]+(?:\.[0-9]+)?)\s*MiB\s*,/i);
        if (match) {
            values.push(Number(match[1]));
        }
    }
    return values.filter((value) => Number.isFinite(value) && value > 0);
}

function getLargestGpuMemoryBytes(gpuInfo = '') {
    const values = parseGpuMemoryMiB(gpuInfo);
    return values.length ? Math.max(...values) * 1024 * 1024 : 0;
}

function getNearestExistingPath(targetPath = '') {
    let current = path.resolve(String(targetPath || '.'));
    while (current && !fs.existsSync(current)) {
        const parent = path.dirname(current);
        if (!parent || parent === current) {
            return '';
        }
        current = parent;
    }
    return current;
}

function getDiskFreeBytes(targetPath = '') {
    try {
        const existingPath = getNearestExistingPath(targetPath);
        if (!existingPath || typeof fs.statfsSync !== 'function') {
            return 0;
        }
        const stats = fs.statfsSync(existingPath);
        return Number(stats.bavail || 0) * Number(stats.bsize || 0);
    } catch {
        return 0;
    }
}

function inspectDownloadTarget({ downloadDir = '', modelId = '', modelSizeBytes = 0 } = {}) {
    const rawPath = String(downloadDir || '').trim();
    const requiredBytes = estimateRequiredDownloadBytes({ modelId, sizeBytes: modelSizeBytes });
    const result = {
        ok: false,
        path: rawPath,
        exists: false,
        parentExists: false,
        freeBytes: 0,
        requiredBytes,
        requiredGiB: Number((requiredBytes / BYTES_PER_GIB).toFixed(1)),
        freeGiB: 0,
        blockers: [],
        warnings: []
    };
    if (!rawPath) {
        result.blockers.push('请选择模型安装路径。');
        return result;
    }
    const resolved = path.resolve(rawPath);
    result.path = resolved;
    let stat = null;
    try {
        stat = fs.existsSync(resolved) ? fs.statSync(resolved) : null;
    } catch {
        stat = null;
    }
    if (stat && !stat.isDirectory()) {
        result.blockers.push('安装路径必须是文件夹，不能是文件。');
        return result;
    }
    result.exists = Boolean(stat?.isDirectory());
    const parent = result.exists ? resolved : path.dirname(resolved);
    result.parentExists = fs.existsSync(parent);
    if (!result.parentExists) {
        result.blockers.push('安装路径的上级目录不存在，请换一个有效目录。');
        return result;
    }
    result.freeBytes = getDiskFreeBytes(resolved);
    result.freeGiB = Number((result.freeBytes / BYTES_PER_GIB).toFixed(1));
    if (result.freeBytes > 0 && result.freeBytes < requiredBytes) {
        result.blockers.push(`安装路径可用空间约 ${formatGiB(result.freeBytes)}，预计至少需要 ${formatGiB(requiredBytes)}。请换更小模型或更大磁盘。`);
        return result;
    }
    if (!result.exists) {
        result.warnings.push('安装目录不存在，部署时会尝试创建。');
    }
    if (!result.freeBytes) {
        result.warnings.push('无法确认安装路径剩余空间，部署前请手动确认磁盘空间。');
    }
    result.ok = result.blockers.length === 0;
    return result;
}

function parseNvidiaDriverVersion(gpuInfo = '') {
    const text = String(gpuInfo || '');
    const match = text.match(/,\s*([0-9]{3,}(?:\.[0-9]+)?)\s*(?:;|$)/);
    return match ? match[1] : '';
}

function evaluateRuntimeUpgradeFeasibility(runtime = {}, modelRequirements = null) {
    if (!modelRequirements?.requiresModernTransformers) {
        return { ok: true, severity: '', reason: '' };
    }
    const driverVersion = parseNvidiaDriverVersion(runtime?.gpuInfo || '');
    const driverMajor = Number.parseInt(driverVersion, 10);
    if (Number.isFinite(driverMajor) && driverMajor > 0 && driverMajor < 550) {
        return {
            ok: true,
            severity: 'warning',
            reason: `当前 NVIDIA 驱动 ${driverVersion} 偏旧，AILIS 会优先在隔离 runtime 中升级 vLLM/Transformers 并验证当前模型；如果底层 CUDA/PyTorch 不兼容，再保留旧环境并给出失败原因。`
        };
    }
    return { ok: true, severity: '', reason: '' };
}

function evaluateLocalModelHardwareFit(runtime = {}, modelRequirements = null) {
    const weightBytes = Number(modelRequirements?.weightBytes) || 0;
    const largestGpuBytes = getLargestGpuMemoryBytes(runtime?.gpuInfo || '');
    if (!weightBytes || !largestGpuBytes) {
        return { ok: true, severity: '', reason: '' };
    }
    if (weightBytes > largestGpuBytes) {
        return {
            ok: false,
            severity: 'high',
            reason: `本地模型权重约 ${formatGiB(weightBytes)}，大于当前最大 GPU 显存约 ${formatGiB(largestGpuBytes)}。纯 GPU 加载不稳，AILIS 会自动降低上下文并尝试 CPU offload；速度会变慢。`
        };
    }
    if (weightBytes > largestGpuBytes * 0.85) {
        return {
            ok: true,
            severity: 'warning',
            reason: `本地模型权重约 ${formatGiB(weightBytes)}，接近当前最大 GPU 显存约 ${formatGiB(largestGpuBytes)}。vLLM 还需要 KV cache 和运行时开销，建议降低上下文长度或使用量化模型。`
        };
    }
    return { ok: true, severity: '', reason: '' };
}

function buildAutoLaunchProfile(diagnosis = {}, payload = {}) {
    const requestedMaxModelLen = Math.max(0, Math.floor(Number(payload.maxModelLen) || 0));
    const requestedGpuMemoryUtilization = String(payload.gpuMemoryUtilization || '').trim();
    const requestedCpuOffloadGb = Math.max(0, Number(payload.cpuOffloadGb || payload.cpuOffloadGB || 0) || 0);
    const requestedSwapSpace = Math.max(0, Math.floor(Number(payload.swapSpace || payload.swapSpaceGb || 0) || 0));
    const profile = {
        adjusted: false,
        reason: '',
        maxModelLen: requestedMaxModelLen,
        gpuMemoryUtilization: requestedGpuMemoryUtilization,
        cpuOffloadGb: requestedCpuOffloadGb,
        swapSpace: requestedSwapSpace,
        notes: []
    };
    const weightBytes = Number(diagnosis.modelRequirements?.weightBytes) || 0;
    const largestGpuBytes = getLargestGpuMemoryBytes(diagnosis.runtime?.gpuInfo || '');
    if (!weightBytes || !largestGpuBytes || diagnosis.source !== 'local') {
        return profile;
    }
    if (diagnosis.modelHardwareFit?.severity === 'high') {
        const targetGpuBytes = largestGpuBytes * 0.82;
        const deficitGiB = Math.max(1, Math.ceil((weightBytes - targetGpuBytes) / BYTES_PER_GIB + 1));
        if (!profile.maxModelLen) {
            profile.maxModelLen = 2048;
        }
        if (!profile.gpuMemoryUtilization) {
            profile.gpuMemoryUtilization = '0.82';
        }
        if (!profile.cpuOffloadGb) {
            profile.cpuOffloadGb = Math.min(16, deficitGiB);
        }
        if (!profile.swapSpace) {
            profile.swapSpace = Math.max(4, Math.ceil(profile.cpuOffloadGb + 2));
        }
        profile.adjusted = true;
        profile.reason = `模型权重 ${formatGiB(weightBytes)} 超过 GPU 显存 ${formatGiB(largestGpuBytes)}，将自动降低上下文并启用 CPU offload。`;
    } else if (diagnosis.modelHardwareFit?.severity === 'warning') {
        if (!profile.maxModelLen) {
            profile.maxModelLen = 4096;
        }
        if (!profile.gpuMemoryUtilization) {
            profile.gpuMemoryUtilization = '0.85';
        }
        profile.adjusted = true;
        profile.reason = `模型权重接近 GPU 显存，将自动降低上下文长度以减少 KV cache 压力。`;
    }
    if (profile.adjusted) {
        profile.notes = [
            profile.maxModelLen ? `max_model_len=${profile.maxModelLen}` : '',
            profile.gpuMemoryUtilization ? `gpu_memory_utilization=${profile.gpuMemoryUtilization}` : '',
            profile.cpuOffloadGb ? `cpu_offload_gb=${profile.cpuOffloadGb}` : '',
            profile.swapSpace ? `swap_space=${profile.swapSpace}` : ''
        ].filter(Boolean);
    }
    return profile;
}

function findRuntimeCandidate(runtime = {}, venvDir = '') {
    const candidates = Array.isArray(runtime.runtimeCandidates) ? runtime.runtimeCandidates : [];
    const target = String(venvDir || '').trim().toLowerCase();
    if (!target) {
        return null;
    }
    return candidates.find((candidate) => {
        const values = [
            candidate?.venvDir,
            candidate?.resolvedVenvDir,
            candidate?.venvPython
        ].map((value) => String(value || '').trim().toLowerCase());
        return values.some((value) => value && (value === target || value.includes(target)));
    }) || null;
}

function evaluateRuntimeModelCompatibility(runtime = {}, modelRequirements = null) {
    if (!modelRequirements?.requiresModernTransformers) {
        return { ok: true, reason: '' };
    }
    const selectedVenvDir = runtime.reusableVenvDir || '';
    const candidate = findRuntimeCandidate(runtime, selectedVenvDir);
    const transformersVersion = String(candidate?.transformersVersion || runtime.transformersVersion || '').trim();
    if (!transformersVersion) {
        return {
            ok: false,
            reason: `本地模型声明需要 transformers ${modelRequirements.transformersVersion}+，但当前 vLLM runtime 无法确认 transformers 版本。`
        };
    }
    if (compareVersions(transformersVersion, modelRequirements.transformersVersion) < 0) {
        return {
            ok: false,
            reason: `本地模型声明需要 transformers ${modelRequirements.transformersVersion}+，当前可复用 runtime 是 ${transformersVersion}，需要升级。`
        };
    }
    return { ok: true, reason: '' };
}

function uniqueStrings(values = []) {
    const seen = new Set();
    return values
        .map((value) => String(value || '').trim())
        .filter(Boolean)
        .filter((value) => {
            const key = value.toLowerCase();
            if (seen.has(key)) {
                return false;
            }
            seen.add(key);
            return true;
        });
}

function getReusableVenvCandidates(venvDir = '', platform = process.platform, runtimeMode = 'native') {
    const mode = normalizeRuntimeMode(runtimeMode, platform);
    return uniqueStrings([
        normalizeVenvDir(venvDir, platform),
        getDefaultVenvDir(platform),
        ...(platform === 'win32' && mode === 'wsl'
            ? ['~/.cache/ailis/vllm-venv', '~/.cache/ailis/vllm-smoke-venv']
            : []),
        DEFAULT_PROJECT_VENV_DIR
    ]);
}

function getBaseUrl({ host = DEFAULT_HOST, port = DEFAULT_PORT } = {}) {
    const clientHost = host === '0.0.0.0' || host === '::' ? DEFAULT_HOST : host;
    return `http://${clientHost}:${normalizePort(port)}/v1`;
}

function stripAnsi(value = '') {
    return String(value || '').replace(/\0/g, '').replace(/\x1B\[[0-?]*[ -/]*[@-~]/g, '');
}

function normalizeDiagnosticText(value = '') {
    return stripAnsi(value)
        .replace(/\s+/g, ' ')
        .trim();
}

function splitOutputLines(chunk = '') {
    return stripAnsi(chunk)
        .replace(/\r\n/g, '\n')
        .replace(/\r/g, '\n')
        .split('\n')
        .map((line) => line.trimEnd())
        .filter(Boolean);
}

function clipLine(line = '') {
    const text = String(line || '');
    return text.length > MAX_LINE_LENGTH ? `${text.slice(0, MAX_LINE_LENGTH)}...` : text;
}

function execFileText(command, args = [], { timeoutMs = 12000 } = {}) {
    return new Promise((resolve, reject) => {
        const child = spawn(command, args, {
            windowsHide: true,
            shell: false
        });
        let stdout = '';
        let stderr = '';
        const timer = setTimeout(() => {
            try {
                child.kill();
            } catch {
                // Ignore kill races.
            }
            reject(new Error(`Command timed out after ${timeoutMs}ms: ${command}`));
        }, timeoutMs);
        child.stdout?.on?.('data', (chunk) => {
            stdout += String(chunk || '');
        });
        child.stderr?.on?.('data', (chunk) => {
            stderr += String(chunk || '');
        });
        child.on('error', (error) => {
            clearTimeout(timer);
            reject(error);
        });
        child.on('exit', (code) => {
            clearTimeout(timer);
            if (Number(code) === 0) {
                resolve(stdout);
                return;
            }
            reject(new Error(stderr || stdout || `${command} exited with code ${code}`));
        });
    });
}

function execFileSafe(command, args = [], options = {}) {
    return execFileText(command, args, options)
        .then((stdout) => ({ ok: true, stdout, error: '' }))
        .catch((error) => ({ ok: false, stdout: '', error: error.message || String(error) }));
}

function parseJsonSafe(value, fallback = null) {
    const text = stripAnsi(value);
    try {
        return JSON.parse(text);
    } catch {
        const start = text.indexOf('{');
        const end = text.lastIndexOf('}');
        if (start >= 0 && end > start) {
            try {
                return JSON.parse(text.slice(start, end + 1));
            } catch {
                return fallback;
            }
        }
        return fallback;
    }
}

function classifyRuntimeShellFailure(error = '', { platform = process.platform } = {}) {
    const text = normalizeDiagnosticText(error);
    const lower = text.toLowerCase();
    if (!lower) {
        return null;
    }
    if (
        platform === 'win32' &&
        /wsl_e_user_not_found|getpwuid|getpwnam|utilinitgroups|createprocesscommon|createprocessparsecommon|create process failed/.test(lower)
    ) {
        return {
            code: 'wsl_shell_unusable',
            blocking: true,
            message: 'AILIS 托管运行环境已经安装，但当前无法启动。AILIS 已尝试自动重启该环境；如果仍失败，请先重启电脑，之后再点“部署并启用”。',
            detail: text.slice(0, 1000)
        };
    }
    if (platform === 'win32' && /the attempted operation is not supported|wsl.*not.*running|failed to launch|access is denied/.test(lower)) {
        return {
            code: 'wsl_shell_unusable',
            blocking: true,
            message: 'AILIS 托管运行环境当前无法启动。AILIS 已尝试自动恢复；如果仍失败，请重启电脑后再试。',
            detail: text.slice(0, 1000)
        };
    }
    return null;
}

function normalizePathForWslpath(value = '') {
    return String(value || '').replace(/\\/g, '/');
}

async function isVllmServiceReady({ host = DEFAULT_HOST, port = DEFAULT_PORT, timeoutMs = 3500 } = {}) {
    const baseUrl = getBaseUrl({ host, port });
    if (typeof globalThis.fetch !== 'function') {
        return { ok: false, baseUrl, modelIds: [], error: 'fetch_unavailable' };
    }
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
        const response = await globalThis.fetch(`${baseUrl}/models`, {
            signal: controller.signal,
            headers: { accept: 'application/json' }
        });
        if (!response.ok) {
            return { ok: false, baseUrl, modelIds: [], error: `${response.status} ${response.statusText}` };
        }
        const payload = await response.json();
        return {
            ok: true,
            baseUrl,
            modelIds: Array.isArray(payload?.data)
                ? payload.data.map((item) => item?.id).filter(Boolean)
                : []
        };
    } catch (error) {
        return { ok: false, baseUrl, modelIds: [], error: error.message || String(error) };
    } finally {
        clearTimeout(timer);
    }
}

function buildRuntimeProbeScript(projectRoot = '.', venvDir = DEFAULT_PROJECT_VENV_DIR, candidateVenvDirs = []) {
    const root = String(projectRoot || '.').replace(/\\/g, '/').replace(/"/g, '\\"');
    const venv = String(venvDir || DEFAULT_PROJECT_VENV_DIR).replace(/\\/g, '/').replace(/"/g, '\\"');
    const pythonVenvLiteral = JSON.stringify(String(venvDir || DEFAULT_PROJECT_VENV_DIR).replace(/\\/g, '/'));
    const candidateVenvLiteral = JSON.stringify(uniqueStrings([
        venvDir || DEFAULT_PROJECT_VENV_DIR,
        ...candidateVenvDirs
    ]).map((value) => String(value || '').replace(/\\/g, '/')));
    return `
set +e
cd "${root}" 2>/dev/null || true
venv_dir="${venv}"
case "$venv_dir" in
  "~") venv_dir="$HOME" ;;
  "~/"*) venv_dir="$HOME/\${venv_dir#\\~/}" ;;
esac
venv_python="$venv_dir/bin/python"
gpu_info=""
if command -v nvidia-smi >/dev/null 2>&1; then
  gpu_info="$(nvidia-smi --query-gpu=name,memory.total,driver_version --format=csv,noheader 2>/dev/null | tr '\\n' '; ' | sed 's/[[:space:]]*$//')"
fi
disk_available_kb="$(df -Pk . 2>/dev/null | awk 'NR==2 {print $4}')"
if ! command -v python3 >/dev/null 2>&1; then
  gpu_info_json="$(printf '%s' "$gpu_info" | sed 's/\\\\/\\\\\\\\/g; s/"/\\\\"/g')"
  venv_python_json="$(printf '%s' "$venv_python" | sed 's/\\\\/\\\\\\\\/g; s/"/\\\\"/g')"
  printf '{"shellOk":true,"pythonPath":"","pythonVersion":"","pythonOk":false,"pythonMissing":true,"venvAvailable":false,"pipAvailable":false,"gpuInfo":"%s","venvPython":"%s","venvExists":false,"vllmInstalled":false,"diskAvailableKb":%s}\\n' "$gpu_info_json" "$venv_python_json" "\${disk_available_kb:-0}"
  exit 0
fi
python3 -c '
import json
import os
import shutil
import subprocess
import sys

primary_venv_dir = os.path.expanduser(${pythonVenvLiteral})
candidate_venv_dirs = ${candidateVenvLiteral}

def resolve_venv_dir(raw):
    value = os.path.expanduser(str(raw or "").strip())
    if not value:
        value = primary_venv_dir
    if not os.path.isabs(value):
        value = os.path.abspath(value)
    return value

def probe_venv(raw):
    resolved = resolve_venv_dir(raw)
    venv_python_path = os.path.join(resolved, "bin", "python")
    exists = os.path.exists(venv_python_path) and os.access(venv_python_path, os.X_OK)
    installed = False
    transformers_version = ""
    if exists:
        try:
            subprocess.check_call(
                [venv_python_path, "-c", "import vllm"],
                stdout=subprocess.DEVNULL,
                stderr=subprocess.DEVNULL,
                timeout=20
            )
            installed = True
        except Exception:
            installed = False
        try:
            transformers_version = subprocess.check_output(
                [venv_python_path, "-c", "import transformers; print(transformers.__version__)"],
                stderr=subprocess.DEVNULL,
                text=True,
                timeout=10
            ).strip()
        except Exception:
            transformers_version = ""
    return {
        "venvDir": str(raw or ""),
        "resolvedVenvDir": resolved,
        "venvPython": venv_python_path,
        "venvExists": exists,
        "vllmInstalled": installed,
        "transformersVersion": transformers_version
    }

python_path = shutil.which("python3") or ""
python_version = f"{sys.version_info.major}.{sys.version_info.minor}.{sys.version_info.micro}"
python_ok = sys.version_info >= (3, 10)
gpu_info = ""
if shutil.which("nvidia-smi"):
    try:
        gpu_info = subprocess.check_output(
            ["nvidia-smi", "--query-gpu=name,memory.total,driver_version", "--format=csv,noheader"],
            stderr=subprocess.DEVNULL,
            text=True,
            timeout=8
        ).replace("\\n", "; ").strip()
    except Exception:
        gpu_info = ""
venv_available = False
pip_available = False
try:
    subprocess.check_call([sys.executable, "-m", "venv", "--help"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    venv_available = True
except Exception:
    venv_available = False
try:
    subprocess.check_call([sys.executable, "-m", "pip", "--version"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    pip_available = True
except Exception:
    pip_available = False
runtime_candidates = []
seen_candidates = set()
for raw_candidate in [${pythonVenvLiteral}, *candidate_venv_dirs]:
    key = str(raw_candidate or "").strip().lower()
    if not key or key in seen_candidates:
        continue
    seen_candidates.add(key)
    runtime_candidates.append(probe_venv(raw_candidate))
primary_runtime = runtime_candidates[0] if runtime_candidates else probe_venv(${pythonVenvLiteral})
reusable_runtime = next((candidate for candidate in runtime_candidates if candidate.get("vllmInstalled")), None)
try:
    project_disk_available_kb = shutil.disk_usage(".").free // 1024
except Exception:
    project_disk_available_kb = 0
try:
    runtime_disk_path = os.path.dirname(primary_runtime.get("resolvedVenvDir", "")) or os.path.expanduser("~/.cache/ailis")
    while runtime_disk_path and not os.path.exists(runtime_disk_path):
        parent = os.path.dirname(runtime_disk_path)
        if parent == runtime_disk_path:
            break
        runtime_disk_path = parent
    if not runtime_disk_path:
        runtime_disk_path = "."
    runtime_disk_available_kb = shutil.disk_usage(runtime_disk_path).free // 1024
except Exception:
    runtime_disk_available_kb = project_disk_available_kb
print(json.dumps({
    "shellOk": True,
    "pythonPath": python_path,
    "pythonVersion": python_version,
    "pythonOk": python_ok,
    "pythonMissing": not bool(python_path),
    "venvAvailable": venv_available,
    "pipAvailable": pip_available,
    "gpuInfo": gpu_info,
    "venvPython": primary_runtime.get("venvPython", ""),
    "venvExists": primary_runtime.get("venvExists", False),
    "vllmInstalled": primary_runtime.get("vllmInstalled", False),
    "transformersVersion": primary_runtime.get("transformersVersion", ""),
    "runtimeCandidates": runtime_candidates,
    "reusableVenvDir": reusable_runtime.get("venvDir", "") if reusable_runtime else "",
    "reusableVenvPython": reusable_runtime.get("venvPython", "") if reusable_runtime else "",
    "diskAvailableKb": runtime_disk_available_kb,
    "runtimeDiskAvailableKb": runtime_disk_available_kb,
    "projectDiskAvailableKb": project_disk_available_kb
}))
'
`.trim();
}

function buildNativeRuntimeProbeScript(projectRoot = '.', venvDir = DEFAULT_PROJECT_VENV_DIR, candidateVenvDirs = []) {
    const projectRootLiteral = JSON.stringify(path.resolve(projectRoot || '.'));
    const primaryVenvLiteral = JSON.stringify(String(venvDir || DEFAULT_PROJECT_VENV_DIR));
    const candidateVenvLiteral = JSON.stringify(uniqueStrings([
        venvDir || DEFAULT_PROJECT_VENV_DIR,
        ...candidateVenvDirs
    ]));
    return `
import json
import os
import shutil
import subprocess
import sys

project_root = ${projectRootLiteral}
primary_venv_dir = ${primaryVenvLiteral}
candidate_venv_dirs = ${candidateVenvLiteral}

def resolve_venv_dir(raw):
    value = os.path.expanduser(str(raw or "").strip())
    if not value:
        value = primary_venv_dir
    if not os.path.isabs(value):
        value = os.path.abspath(os.path.join(project_root, value))
    return value

def probe_venv(raw):
    resolved = resolve_venv_dir(raw)
    python_name = os.path.join("Scripts", "python.exe") if os.name == "nt" else os.path.join("bin", "python")
    venv_python_path = os.path.join(resolved, python_name)
    exists = os.path.exists(venv_python_path)
    installed = False
    transformers_version = ""
    if exists:
        try:
            subprocess.check_call(
                [venv_python_path, "-c", "import vllm"],
                stdout=subprocess.DEVNULL,
                stderr=subprocess.DEVNULL,
                timeout=20,
            )
            installed = True
        except Exception:
            installed = False
        try:
            transformers_version = subprocess.check_output(
                [venv_python_path, "-c", "import transformers; print(transformers.__version__)"],
                stderr=subprocess.DEVNULL,
                text=True,
                timeout=10,
            ).strip()
        except Exception:
            transformers_version = ""
    return {
        "venvDir": str(raw or ""),
        "resolvedVenvDir": resolved,
        "venvPython": venv_python_path,
        "venvExists": exists,
        "vllmInstalled": installed,
        "transformersVersion": transformers_version,
    }

gpu_info = ""
if shutil.which("nvidia-smi"):
    try:
        gpu_info = subprocess.check_output(
            ["nvidia-smi", "--query-gpu=name,memory.total,driver_version", "--format=csv,noheader"],
            stderr=subprocess.DEVNULL,
            text=True,
            timeout=8,
        ).replace("\\n", "; ").strip()
    except Exception:
        gpu_info = ""

venv_available = False
pip_available = False
try:
    subprocess.check_call([sys.executable, "-m", "venv", "--help"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    venv_available = True
except Exception:
    venv_available = False
try:
    subprocess.check_call([sys.executable, "-m", "pip", "--version"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    pip_available = True
except Exception:
    pip_available = False

runtime_candidates = []
seen_candidates = set()
for raw_candidate in [primary_venv_dir, *candidate_venv_dirs]:
    key = str(raw_candidate or "").strip().lower()
    if not key or key in seen_candidates:
        continue
    seen_candidates.add(key)
    runtime_candidates.append(probe_venv(raw_candidate))
primary_runtime = runtime_candidates[0] if runtime_candidates else probe_venv(primary_venv_dir)
reusable_runtime = next((candidate for candidate in runtime_candidates if candidate.get("vllmInstalled")), None)
try:
    project_disk_available_kb = shutil.disk_usage(project_root).free // 1024
except Exception:
    project_disk_available_kb = 0
try:
    runtime_disk_path = os.path.dirname(primary_runtime.get("resolvedVenvDir", "")) or project_root
    while runtime_disk_path and not os.path.exists(runtime_disk_path):
        parent = os.path.dirname(runtime_disk_path)
        if parent == runtime_disk_path:
            break
        runtime_disk_path = parent
    if not runtime_disk_path:
        runtime_disk_path = project_root
    runtime_disk_available_kb = shutil.disk_usage(runtime_disk_path).free // 1024
except Exception:
    runtime_disk_available_kb = project_disk_available_kb

print(json.dumps({
    "shellOk": True,
    "pythonPath": sys.executable,
    "pythonVersion": f"{sys.version_info.major}.{sys.version_info.minor}.{sys.version_info.micro}",
    "pythonOk": sys.version_info >= (3, 10),
    "pythonMissing": False,
    "venvAvailable": venv_available,
    "pipAvailable": pip_available,
    "gpuInfo": gpu_info,
    "venvPython": primary_runtime.get("venvPython", ""),
    "venvExists": primary_runtime.get("venvExists", False),
    "vllmInstalled": primary_runtime.get("vllmInstalled", False),
    "transformersVersion": primary_runtime.get("transformersVersion", ""),
    "runtimeCandidates": runtime_candidates,
    "reusableVenvDir": reusable_runtime.get("venvDir", "") if reusable_runtime else "",
    "reusableVenvPython": reusable_runtime.get("venvPython", "") if reusable_runtime else "",
    "diskAvailableKb": runtime_disk_available_kb,
    "runtimeDiskAvailableKb": runtime_disk_available_kb,
    "projectDiskAvailableKb": project_disk_available_kb
}))
`.trim();
}

async function probeNativeRuntime({ projectRoot = '.', platform = process.platform, venvDir = DEFAULT_PROJECT_VENV_DIR } = {}) {
    const script = buildNativeRuntimeProbeScript(
        projectRoot,
        venvDir,
        getReusableVenvCandidates(venvDir, platform, 'native')
    );
    const candidates = platform === 'win32'
        ? [
            ['python', ['-c', script]],
            ['py', ['-3', '-c', script]]
        ]
        : [
            ['python3', ['-c', script]],
            ['python', ['-c', script]]
        ];
    const errors = [];
    for (const [command, args] of candidates) {
        const result = await execFileSafe(command, args, { timeoutMs: 30000 });
        if (result.ok) {
            return {
                available: true,
                shellOk: true,
                ...(parseJsonSafe(result.stdout, {}) || {}),
                error: ''
            };
        }
        errors.push(`${command}: ${result.error}`);
    }
    return {
        available: true,
        shellOk: true,
        pythonOk: false,
        pythonMissing: true,
        pythonPath: '',
        pythonVersion: '',
        venvAvailable: false,
        pipAvailable: false,
        gpuInfo: '',
        venvExists: false,
        vllmInstalled: false,
        runtimeCandidates: [],
        error: errors.join(' | ')
    };
}

function buildInstallPlan(diagnosis = {}) {
    const steps = [];
    const runtimeMode = normalizeRuntimeMode(diagnosis.runtimeMode || '', diagnosis.platform);
    const windowsNativeMode = diagnosis.platform === 'win32' && runtimeMode === 'native';
    const managedWindowsMode = diagnosis.platform === 'win32' && runtimeMode === 'wsl';
    const installWslRequested = diagnosis.installWslRequested !== false;
    const runtimeAvailable = Boolean(diagnosis.runtime?.available || diagnosis.runtime?.shellOk);
    const runtimeShellFailure = diagnosis.runtime?.shellFailure?.blocking ? diagnosis.runtime.shellFailure : null;
    const targetModel = normalizeModelId(diagnosis.targetModel || diagnosis.modelId || '');
    const localModel = normalizeSource(diagnosis.source || '') === 'local';
    const downloadTarget = diagnosis.downloadTarget || null;
    const serviceModelIds = Array.isArray(diagnosis.service?.modelIds) ? diagnosis.service.modelIds : [];
    const serviceHasTargetModel = Boolean(
        diagnosis.service?.ok &&
        targetModel &&
        serviceModelIds.some((id) => String(id || '').trim() === targetModel)
    );
    const modelRuntimeCompatible = diagnosis.runtime?.modelCompatibility?.ok !== false;
    const hasUsableVllmRuntime = modelRuntimeCompatible && Boolean(
        diagnosis.runtime?.vllmInstalled ||
        diagnosis.runtime?.reusableVenvDir
    );
    if (diagnosis.platform === 'win32' && runtimeMode === 'wsl' && !diagnosis.wsl?.available) {
        steps.push({
            id: 'install_wsl',
            title: '准备 AILIS 托管兼容环境',
            severity: installWslRequested ? 'required' : 'blocking',
            requiresSystemChange: true,
            requiresUserAction: !installWslRequested,
            description: installWslRequested
                ? 'AILIS 会尝试自动启用 Windows 的本地模型兼容环境并安装 Ubuntu；系统组件首次启用后可能需要重启。'
                : '当前选择了兼容模式，但没有检测到可用运行环境。请允许 AILIS 自动准备，或切换到连接已有服务。'
        });
    } else if (diagnosis.platform === 'win32' && runtimeMode === 'wsl' && !diagnosis.wsl?.distros?.length) {
        steps.push({
            id: 'install_wsl_distro',
            title: '安装 AILIS 托管 Linux 运行环境',
            severity: installWslRequested ? 'required' : 'blocking',
            requiresSystemChange: true,
            requiresUserAction: !installWslRequested,
            description: installWslRequested
                ? 'AILIS 会自动安装可用的 Ubuntu 运行环境，用于承载 vLLM、Python 和 CUDA 依赖。'
                : '当前没有可用的托管 Linux 运行环境。请允许 AILIS 自动安装，或切换到连接已有服务。'
        });
    }
    if (runtimeShellFailure) {
        steps.push({
            id: 'repair_wsl_shell',
            title: managedWindowsMode ? '修复 AILIS 托管运行环境' : '修复 WSL/Ubuntu Shell',
            severity: 'blocking',
            requiresSystemChange: true,
            requiresUserAction: true,
            description: managedWindowsMode
                ? `AILIS 检测到托管运行环境已经安装但无法启动：${runtimeShellFailure.message}`
                : runtimeShellFailure.message
        });
    }
    if (windowsNativeMode && !diagnosis.service?.ok) {
        steps.push({
            id: 'windows_native_vllm_service_required',
            title: '连接已有 vLLM 服务',
            severity: 'blocking',
            requiresUserAction: true,
            description: '当前是高级连接模式，本机 OpenAI-compatible vLLM 服务未响应。普通用户应使用 AILIS 自动部署模式。'
        });
    } else if (windowsNativeMode && diagnosis.service?.ok && targetModel && !serviceHasTargetModel) {
        steps.push({
            id: 'windows_native_vllm_model_mismatch',
            title: '当前 Windows vLLM 服务模型不匹配',
            severity: 'blocking',
            requiresUserAction: true,
            description: `已连接到 Windows 本地 vLLM 服务，但它没有提供 ${targetModel}。请用该模型重启服务，或把 AILIS 模型名改成服务实际返回的模型。`
        });
    }
    if (!windowsNativeMode && !runtimeShellFailure && runtimeAvailable && (
        !diagnosis.runtime?.pythonOk ||
        diagnosis.runtime?.pythonMissing ||
        diagnosis.runtime?.venvAvailable === false ||
        diagnosis.runtime?.pipAvailable === false
    )) {
        steps.push({
            id: 'install_python',
            title: '安装 Python 3.10+、venv 和 pip',
            severity: 'required',
            requiresNetwork: true,
            description: '部署时会尝试在 Linux/WSL 中自动安装 python3、python3-venv、python3-pip。'
        });
    }
    if (runtimeAvailable && diagnosis.runtimeUpgradeFeasibility?.ok === false) {
        steps.push({
            id: 'gpu_driver_update',
            title: '更新 NVIDIA 驱动或切换部署方式',
            severity: 'blocking',
            requiresSystemChange: true,
            requiresUserAction: true,
            description: diagnosis.runtimeUpgradeFeasibility.reason
        });
    } else if (runtimeAvailable && diagnosis.runtimeUpgradeFeasibility?.severity === 'warning') {
        steps.push({
            id: 'runtime_upgrade_caution',
            title: '自动升级 vLLM Runtime 并验证模型',
            severity: 'warning',
            description: diagnosis.runtimeUpgradeFeasibility.reason
        });
    }
    if (!windowsNativeMode && runtimeAvailable && !hasUsableVllmRuntime) {
        steps.push({
            id: 'install_vllm',
            title: diagnosis.runtime?.modelCompatibility?.ok === false ? '升级 vLLM 运行时以支持当前模型' : '创建 vLLM 私有运行时并安装依赖',
            severity: 'required',
            requiresNetwork: true,
            description: diagnosis.runtime?.modelCompatibility?.reason || '将在项目目录 .ailis-runtime/vllm-venv 中创建私有 venv，并安装 vLLM 与模型下载依赖。'
        });
    }
    if (!localModel) {
        if (!downloadTarget?.path) {
            steps.push({
                id: 'select_download_dir',
                title: '选择模型安装路径',
                severity: 'blocking',
                requiresUserAction: true,
                description: '自动安装模型前需要先选择下载/安装目录，AILIS 会检查目录和剩余空间。'
            });
        } else if (downloadTarget.blockers?.length) {
            steps.push({
                id: 'download_dir_not_ready',
                title: '模型安装路径不可用',
                severity: 'blocking',
                requiresUserAction: true,
                description: downloadTarget.blockers.join('；')
            });
        } else if (downloadTarget.warnings?.length) {
            steps.push({
                id: 'download_dir_warning',
                title: '模型安装路径需要确认',
                severity: 'warning',
                description: downloadTarget.warnings.join('；')
            });
        }
    }
    const diskAvailableKb = Number(diagnosis.runtime?.runtimeDiskAvailableKb || diagnosis.runtime?.diskAvailableKb) || 0;
    if (runtimeAvailable && diskAvailableKb > 0 && diskAvailableKb < MIN_RECOMMENDED_DISK_KB) {
        steps.push({
            id: 'disk_space_low',
            title: '本地磁盘空间偏低',
            severity: 'warning',
            description: `vLLM runtime/cache 所在磁盘可用空间约 ${Math.max(0.1, diskAvailableKb / 1024 / 1024).toFixed(1)}GB。安装或升级 vLLM/PyTorch 通常需要较大临时空间。`
        });
    }
    if (!windowsNativeMode && runtimeAvailable && diagnosis.modelHardwareFit?.severity) {
        steps.push({
            id: 'gpu_memory_fit',
            title: diagnosis.modelHardwareFit.ok ? '模型显存余量偏紧' : '模型权重大于可用 GPU 显存',
            severity: 'warning',
            description: diagnosis.modelHardwareFit.reason
        });
    }
    if (!windowsNativeMode && runtimeAvailable && diagnosis.launchProfile?.adjusted) {
        steps.push({
            id: 'auto_launch_profile',
            title: '自动调整 vLLM 启动参数',
            severity: 'warning',
            description: `${diagnosis.launchProfile.reason} 参数：${diagnosis.launchProfile.notes?.join('，') || '自动配置'}。`
        });
    }
    if (!windowsNativeMode && runtimeAvailable && targetModel && !serviceHasTargetModel && !localModel && downloadTarget?.ok) {
        steps.push({
            id: 'download_model',
            title: '下载开源模型权重到本地缓存',
            severity: 'required',
            requiresNetwork: true,
            description: `将从 Hugging Face 或 ModelScope 下载 ${targetModel} 到 ${downloadTarget.path}，并复用本地模型缓存。`
        });
    }
    if (!windowsNativeMode && runtimeAvailable && !diagnosis.runtime?.gpuInfo) {
        steps.push({
            id: 'gpu_check',
            title: '未检测到 NVIDIA GPU / CUDA',
            severity: 'warning',
            description: 'vLLM 通常需要 CUDA GPU。AILIS 仍可尝试部署，但模型加载可能失败或非常慢。'
        });
    }
    if (!windowsNativeMode && !diagnosis.service?.ok) {
        steps.push({
            id: 'start_vllm',
            title: '启动 vLLM OpenAI-compatible 服务',
            severity: 'required',
            description: '部署完成后会在 http://127.0.0.1:8000/v1 启动服务，并等待 /v1/models 就绪。'
        });
    } else if (!windowsNativeMode && targetModel && !serviceHasTargetModel) {
        steps.push({
            id: 'switch_vllm_service',
            title: '停止旧 vLLM 服务并切换模型',
            severity: 'required',
            description: `当前端口正在服务 ${serviceModelIds.join(', ') || '其他模型'}；部署时会先停止旧服务，释放端口和显存，再启动 ${targetModel}。`
        });
    }
    return {
        ok: !steps.some((step) => step.severity === 'blocking'),
        steps,
        requiresNetwork: steps.some((step) => step.requiresNetwork),
        requiresSystemChange: steps.some((step) => step.requiresSystemChange),
        blockingSteps: steps.filter((step) => step.severity === 'blocking')
    };
}

function summarizeFailure(lines = [], exitCode = null) {
    const text = lines.join('\n').toLowerCase();
    if (/wsl_e_user_not_found|getpwuid|getpwnam|utilinitgroups|createprocesscommon|createprocessparsecommon|create process failed/.test(text)) {
        return {
            code: 'wsl_shell_unusable',
            message: 'AILIS 托管运行环境已经安装，但当前无法启动。AILIS 已尝试自动恢复；如果仍失败，请重启电脑后再试。'
        };
    }
    if (/vllm runtime still cannot read this local model config|model type [`'"]?qwen3|transformers does not recognize|version of transformers is out of date|configuration_auto\.py|keyerror:\s*['"]qwen3|unrecognized configuration class|unknown model type/.test(text)) {
        return {
            code: 'model_runtime_incompatible',
            message: '当前 vLLM / Transformers 运行时不支持这个模型架构。需要升级本地 vLLM runtime，或换用当前 runtime 支持的模型。'
        };
    }
    if (/no wsl distro found|wsl was not found|wsl --install/.test(text)) {
        return {
            code: 'wsl_missing',
            message: 'Windows 上自动部署 vLLM 需要 WSL2/Ubuntu。当前没有可用 WSL 发行版，控制面板无法继续安装。'
        };
    }
    if (/python3 was not found|python .*too old|python 3\.10/.test(text)) {
        return {
            code: 'python_missing',
            message: 'vLLM 运行环境缺少 Python 3.10+。需要先让本地/WSL 具备可用 Python。'
        };
    }
    if (/trust_remote_code|trust-remote-code|remote code/.test(text)) {
        return {
            code: 'trust_remote_code',
            message: '该模型可能需要启用 Trust Remote Code。只在信任模型仓库时勾选后重试。'
        };
    }
    if (/snapshot_download|localentrynotfound|huggingface|modelscope|hub|repo_info|network is unreachable|cannot find the appropriate snapshot|connecterror|connection/.test(text)) {
        return {
            code: 'model_download_or_network',
            message: '模型权重下载失败，通常是 Hugging Face / ModelScope 网络不可达、模型 ID 不存在、代理未配置，或本地没有可复用缓存。'
        };
    }
    if (/nvidia-smi was not found|cuda out of memory|outofmemoryerror|out of memory|oom|no cuda gpus? are available|cuda error|cuda driver version is insufficient|failed to initialize nvml|cublas|libcuda/.test(text)) {
        return {
            code: 'gpu_or_cuda',
            message: 'vLLM 启动失败可能与 CUDA/GPU/显存有关。请查看日志中的 CUDA、GPU 或 OOM 信息。'
        };
    }
    if (/did not become ready|wait.*ready|ready timeout|timed out|timeout/.test(text)) {
        return {
            code: 'ready_timeout',
            message: 'vLLM 进程没有在限定时间内完成加载。常见原因是模型太大、下载慢、显存不足或首次编译耗时。'
        };
    }
    if (/pip install|failed building wheel|could not find a version|network|connection|ssl|proxy/.test(text)) {
        return {
            code: 'install_or_network',
            message: 'vLLM 环境安装或模型下载失败，可能是网络、pip 源、代理或依赖编译问题。'
        };
    }
    return {
        code: 'process_failed',
        message: `vLLM 自动部署进程退出失败${exitCode === null ? '' : `（exitCode=${exitCode}）`}。请查看下方日志摘要。`
    };
}

function readTextFileTailLines(filePath, { maxBytes = 64 * 1024, maxLines = 80 } = {}) {
    try {
        if (!fs.existsSync(filePath)) {
            return [];
        }
        const stats = fs.statSync(filePath);
        const length = Math.min(Number(stats.size) || 0, maxBytes);
        if (length <= 0) {
            return [];
        }
        const fd = fs.openSync(filePath, 'r');
        try {
            const buffer = Buffer.alloc(length);
            fs.readSync(fd, buffer, 0, length, Math.max(0, stats.size - length));
            return splitOutputLines(buffer.toString('utf8')).slice(-maxLines);
        } finally {
            fs.closeSync(fd);
        }
    } catch {
        return [];
    }
}

function readDetachedVllmLogLines(projectRoot = '') {
    const logDir = path.join(projectRoot || '.', '.ailis-runtime', 'vllm');
    const files = [
        ['stderr', path.join(logDir, 'vllm.err.log')],
        ['stdout', path.join(logDir, 'vllm.out.log')]
    ];
    const lines = [];
    for (const [label, filePath] of files) {
        const tail = readTextFileTailLines(filePath, { maxBytes: 80 * 1024, maxLines: 60 });
        if (!tail.length) {
            continue;
        }
        lines.push(`[AILIS vLLM] 最近 ${label} 日志：${filePath}`);
        lines.push(...tail.map((line) => `[vLLM ${label}] ${line}`));
    }
    return lines;
}

function buildDeployCommand({
    projectRoot,
    platform = process.platform,
    source = 'modelscope',
    model,
    venvDir = '',
    downloadDir = '',
    dtype = '',
    maxModelLen = 0,
    cpuOffloadGb = 0,
    swapSpace = 0,
    gpuMemoryUtilization = '',
    pipIndexUrl = '',
    pipExtraIndexUrl = '',
    servedModelName = '',
    host = DEFAULT_HOST,
    port = DEFAULT_PORT,
    readyTimeoutSec = DEFAULT_READY_TIMEOUT_SEC,
    vllmPackage = 'auto',
    trustRemoteCode = false,
    installWsl = true,
    runtimeMode = ''
} = {}) {
    const modelId = normalizeModelReference(model);
    if (!modelId) {
        throw new Error('模型 ID 不能为空。');
    }
    const normalizedSource = inferVllmSource(source, modelId);
    const normalizedRuntimeMode = normalizeRuntimeMode(runtimeMode, platform);
    const normalizedServedModelName = normalizeModelId(servedModelName);
    const normalizedPort = normalizePort(port);
    const normalizedTimeout = normalizeReadyTimeoutSec(readyTimeoutSec);
    const normalizedVllmPackage = normalizeVllmPackage(vllmPackage);
    const normalizedVenvDir = normalizeVenvDir(venvDir, platform);
    const normalizedDownloadDir = String(downloadDir || '').trim();
    const normalizedDType = String(dtype || '').trim();
    const normalizedMaxModelLen = Math.max(0, Math.floor(Number(maxModelLen) || 0));
    const normalizedCpuOffloadGb = Math.max(0, Number(cpuOffloadGb) || 0);
    const normalizedSwapSpace = Math.max(0, Math.floor(Number(swapSpace) || 0));
    const normalizedGpuMemoryUtilization = String(gpuMemoryUtilization || '').trim();
    const normalizedPipIndexUrl = String(pipIndexUrl || DEFAULT_PIP_INDEX_URL).trim();
    const normalizedPipExtraIndexUrl = String(pipExtraIndexUrl || '').trim();

    if (platform === 'win32' && normalizedRuntimeMode !== 'wsl') {
        throw new Error('当前是高级连接模式，AILIS 不会在这个模式里安装 runtime。请使用 managed/auto 部署模式，或连接已有 OpenAI-compatible vLLM 服务。');
    }

    if (platform === 'win32') {
        const scriptPath = path.join(projectRoot, 'scripts', 'bootstrap-vllm-local.ps1');
        const args = [
            '-NoProfile',
            '-ExecutionPolicy',
            'Bypass',
            '-File',
            scriptPath,
            '-Source',
            normalizedSource,
            '-Model',
            modelId,
            ...(normalizedServedModelName ? ['-ServedModelName', normalizedServedModelName] : []),
            '-VenvDir',
            normalizedVenvDir,
            ...(normalizedDownloadDir ? ['-DownloadDir', normalizedDownloadDir] : []),
            ...(normalizedDType ? ['-DType', normalizedDType] : []),
            ...(normalizedMaxModelLen > 0 ? ['-MaxModelLen', String(normalizedMaxModelLen)] : []),
            ...(normalizedCpuOffloadGb > 0 ? ['-CpuOffloadGb', String(normalizedCpuOffloadGb)] : []),
            ...(normalizedSwapSpace > 0 ? ['-SwapSpace', String(normalizedSwapSpace)] : []),
            ...(normalizedGpuMemoryUtilization ? ['-GpuMemoryUtilization', normalizedGpuMemoryUtilization] : []),
            ...(normalizedPipIndexUrl ? ['-PipIndexUrl', normalizedPipIndexUrl] : []),
            ...(normalizedPipExtraIndexUrl ? ['-PipExtraIndexUrl', normalizedPipExtraIndexUrl] : []),
            '-HostName',
            host,
            '-Port',
            String(normalizedPort),
            '-Start',
            '-Detached',
            '-WaitReady',
            '-ReadyTimeoutSec',
            String(normalizedTimeout),
            '-VllmPackage',
            normalizedVllmPackage
        ];
        if (trustRemoteCode) {
            args.push('-TrustRemoteCode');
        }
        if (installWsl) {
            args.push('-InstallWsl');
        }
        return {
            command: 'powershell.exe',
            args,
            cwd: projectRoot,
            runtimeMode: normalizedRuntimeMode,
            source: normalizedSource,
            modelId,
            servedModelId: normalizedServedModelName || modelId,
            venvDir: normalizedVenvDir,
            downloadDir: normalizedDownloadDir,
            vllmPackage: normalizedVllmPackage,
            pipIndexUrl: normalizedPipIndexUrl,
            baseUrl: getBaseUrl({ host, port: normalizedPort })
        };
    }

    const scriptPath = path.join(projectRoot, 'scripts', 'bootstrap-vllm-local.sh');
    const args = [
        scriptPath,
        '--source',
        normalizedSource,
        '--model',
        modelId,
        ...(normalizedServedModelName ? ['--served-model-name', normalizedServedModelName] : []),
        '--venv-dir',
        normalizedVenvDir,
        ...(normalizedDownloadDir ? ['--download-dir', normalizedDownloadDir] : []),
            ...(normalizedDType ? ['--dtype', normalizedDType] : []),
            ...(normalizedMaxModelLen > 0 ? ['--max-model-len', String(normalizedMaxModelLen)] : []),
            ...(normalizedCpuOffloadGb > 0 ? ['--cpu-offload-gb', String(normalizedCpuOffloadGb)] : []),
            ...(normalizedSwapSpace > 0 ? ['--swap-space', String(normalizedSwapSpace)] : []),
            ...(normalizedGpuMemoryUtilization ? ['--gpu-memory-utilization', normalizedGpuMemoryUtilization] : []),
        ...(normalizedPipIndexUrl ? ['--pip-index-url', normalizedPipIndexUrl] : []),
        ...(normalizedPipExtraIndexUrl ? ['--pip-extra-index-url', normalizedPipExtraIndexUrl] : []),
        '--host',
        host,
        '--port',
        String(normalizedPort),
        '--start',
        '--detached',
        '--wait-ready',
        '--ready-timeout-sec',
        String(normalizedTimeout),
        '--vllm-package',
        normalizedVllmPackage
    ];
    if (trustRemoteCode) {
        args.push('--trust-remote-code');
    }
    return {
        command: 'bash',
        args,
        cwd: projectRoot,
        runtimeMode: normalizedRuntimeMode,
        source: normalizedSource,
        modelId,
        servedModelId: normalizedServedModelName || modelId,
        venvDir: normalizedVenvDir,
        downloadDir: normalizedDownloadDir,
        vllmPackage: normalizedVllmPackage,
        pipIndexUrl: normalizedPipIndexUrl,
        baseUrl: getBaseUrl({ host, port: normalizedPort })
    };
}

class VllmLocalDeployer extends EventEmitter {
    constructor({
        projectRoot,
        platform = process.platform,
        processFactory = spawn
    } = {}) {
        super();
        this.projectRoot = projectRoot || path.resolve(__dirname, '..');
        this.platform = platform;
        this.processFactory = processFactory;
        this.child = null;
        this.status = this.createIdleStatus();
    }

    createIdleStatus() {
        return {
            ok: true,
            status: 'idle',
            running: false,
            modelId: '',
            source: '',
            runtimeMode: 'native',
            servedModelId: '',
            baseUrl: getBaseUrl(),
            startedAt: '',
            endedAt: '',
            exitCode: null,
            failure: null,
            diagnosis: null,
            installPlan: null,
            logLines: []
        };
    }

    async diagnose(payload = {}) {
        const host = payload.host || DEFAULT_HOST;
        const port = normalizePort(payload.port || DEFAULT_PORT);
        const runtimeMode = normalizeRuntimeMode(payload.runtimeMode || '', this.platform);
        const venvDir = normalizeVenvDir(payload.venvDir || '', this.platform);
        const diagnosis = {
            ok: false,
            platform: this.platform,
            runtimeMode,
            installWslRequested: payload.installWsl !== false,
            projectRoot: this.projectRoot,
            modelId: normalizeModelReference(payload.modelId || payload.model || ''),
            source: inferVllmSource(payload.source || '', payload.modelId || payload.model || ''),
            venvDir,
            checkedAt: new Date().toISOString(),
            wsl: {
                required: this.platform === 'win32' && runtimeMode === 'wsl',
                available: false,
                distros: [],
                error: ''
            },
        runtime: {
            available: false,
            shellOk: false,
            pythonOk: false,
            pythonMissing: false,
            pythonPath: '',
            pythonVersion: '',
            venvAvailable: false,
            pipAvailable: false,
            gpuInfo: '',
            venvExists: false,
            vllmInstalled: false,
            error: ''
        },
            service: await isVllmServiceReady({ host, port }),
            targetModel: normalizeModelId(payload.servedModelName || payload.modelId || payload.model || '')
        };

        if (this.platform === 'win32' && runtimeMode === 'wsl') {
            const wslStatus = await execFileSafe('wsl.exe', ['--status'], { timeoutMs: 8000 });
            diagnosis.wsl.available = wslStatus.ok;
            diagnosis.wsl.error = wslStatus.ok ? '' : wslStatus.error;
            if (wslStatus.ok) {
                const distroResult = await execFileSafe('wsl.exe', ['-l', '-q'], { timeoutMs: 8000 });
                diagnosis.wsl.distros = splitOutputLines(distroResult.stdout)
                    .map((line) => line.replace(/\0/g, '').trim())
                    .filter(Boolean);
            }
            if (diagnosis.wsl.distros.length) {
                const pathResult = await execFileSafe(
                    'wsl.exe',
                    ['--', 'wslpath', '-a', normalizePathForWslpath(this.projectRoot)],
                    { timeoutMs: 8000 }
                );
                const wslProjectRoot = pathResult.ok
                    ? splitOutputLines(pathResult.stdout)[0] || '/mnt/f/AILIS_self_evolution_runtime'
                    : '/mnt/f/AILIS_self_evolution_runtime';
                let runtimeResult = await execFileSafe(
                    'wsl.exe',
                    ['--', 'bash', '-lc', buildRuntimeProbeScript(wslProjectRoot, venvDir, getReusableVenvCandidates(venvDir, this.platform, runtimeMode))],
                    { timeoutMs: 30000 }
                );
                let shellFailure = runtimeResult.ok
                    ? null
                    : classifyRuntimeShellFailure(runtimeResult.error, { platform: this.platform });
                if (!runtimeResult.ok && shellFailure?.blocking) {
                    await execFileSafe('wsl.exe', ['--shutdown'], { timeoutMs: 15000 });
                    await new Promise((resolve) => setTimeout(resolve, 1200));
                    runtimeResult = await execFileSafe(
                        'wsl.exe',
                        ['--', 'bash', '-lc', buildRuntimeProbeScript(wslProjectRoot, venvDir, getReusableVenvCandidates(venvDir, this.platform, runtimeMode))],
                        { timeoutMs: 30000 }
                    );
                    shellFailure = runtimeResult.ok
                        ? null
                        : classifyRuntimeShellFailure(runtimeResult.error, { platform: this.platform });
                }
                diagnosis.runtime = {
                    ...diagnosis.runtime,
                    available: runtimeResult.ok,
                    ...(parseJsonSafe(runtimeResult.stdout, {}) || {}),
                    error: runtimeResult.ok ? '' : runtimeResult.error,
                    shellFailure
                };
            }
        } else if (this.platform === 'win32') {
            diagnosis.runtime = {
                ...diagnosis.runtime,
                ...(await probeNativeRuntime({
                    projectRoot: this.projectRoot,
                    platform: this.platform,
                    venvDir
                })),
                shellFailure: null
            };
        } else {
            const runtimeResult = await execFileSafe(
                'bash',
                ['-lc', buildRuntimeProbeScript(this.projectRoot, venvDir, getReusableVenvCandidates(venvDir, this.platform, runtimeMode))],
                { timeoutMs: 30000 }
            );
            diagnosis.runtime = {
                ...diagnosis.runtime,
                available: runtimeResult.ok,
                ...(parseJsonSafe(runtimeResult.stdout, {}) || {}),
                error: runtimeResult.ok ? '' : runtimeResult.error,
                shellFailure: runtimeResult.ok
                    ? null
                    : classifyRuntimeShellFailure(runtimeResult.error, { platform: this.platform })
            };
        }

        diagnosis.modelRequirements = diagnosis.source === 'local'
            ? readLocalModelRequirements(payload.modelId || payload.model || '')
            : null;
        diagnosis.downloadTarget = diagnosis.source === 'local'
            ? null
            : inspectDownloadTarget({
                downloadDir: payload.downloadDir || '',
                modelId: diagnosis.modelId || diagnosis.targetModel,
                modelSizeBytes: payload.modelSizeBytes || payload.sizeBytes || 0
            });
        if (this.platform === 'win32' && runtimeMode === 'native') {
            diagnosis.runtime.modelCompatibility = null;
            diagnosis.runtimeUpgradeFeasibility = { ok: true, severity: '', reason: '' };
        } else {
            diagnosis.runtime.modelCompatibility = evaluateRuntimeModelCompatibility(
                diagnosis.runtime,
                diagnosis.modelRequirements
            );
            diagnosis.runtimeUpgradeFeasibility = evaluateRuntimeUpgradeFeasibility(
                diagnosis.runtime,
                diagnosis.modelRequirements
            );
        }
        if (this.platform === 'win32' && runtimeMode === 'native') {
            diagnosis.modelHardwareFit = { ok: true, severity: '', reason: '' };
            diagnosis.launchProfile = { adjusted: false, notes: [] };
        } else {
            diagnosis.modelHardwareFit = evaluateLocalModelHardwareFit(
                diagnosis.runtime,
                diagnosis.modelRequirements
            );
            diagnosis.launchProfile = buildAutoLaunchProfile(diagnosis, payload);
        }
        const modelRuntimeCompatible = diagnosis.runtime?.modelCompatibility?.ok !== false;
        diagnosis.recommendedVenvDir = modelRuntimeCompatible
            ? (diagnosis.runtime?.reusableVenvDir || venvDir)
            : venvDir;
        diagnosis.installPlan = buildInstallPlan(diagnosis);
        const hasUsableVllmRuntime = modelRuntimeCompatible && Boolean(diagnosis.runtime?.vllmInstalled || diagnosis.runtime?.reusableVenvDir);
        const serviceHasTargetModel = Boolean(
            diagnosis.service?.ok &&
            diagnosis.targetModel &&
            Array.isArray(diagnosis.service?.modelIds) &&
            diagnosis.service.modelIds.some((id) => String(id || '').trim() === diagnosis.targetModel)
        );
        const serviceReadyForTarget = Boolean(diagnosis.service?.ok && (!diagnosis.targetModel || serviceHasTargetModel));
        diagnosis.ok = serviceReadyForTarget || (
            diagnosis.installPlan.ok &&
            (diagnosis.runtime?.available || diagnosis.runtime?.shellOk) &&
            diagnosis.runtime?.pythonOk &&
            hasUsableVllmRuntime
        );
        this.status = {
            ...this.status,
            diagnosis,
            installPlan: diagnosis.installPlan,
            runtimeMode,
            baseUrl: diagnosis.service?.baseUrl || getBaseUrl({ host, port })
        };
        return diagnosis;
    }

    appendLog(chunk) {
        const nextLines = splitOutputLines(chunk).map(clipLine);
        if (!nextLines.length) {
            return;
        }
        this.status.logLines.push(...nextLines);
        if (this.status.logLines.length > MAX_LOG_LINES) {
            this.status.logLines = this.status.logLines.slice(-MAX_LOG_LINES);
        }
        this.emit('status', this.getStatus());
    }

    async start(payload = {}) {
        if (this.child && this.status.status === 'running') {
            return {
                ...this.getStatus(),
                ok: false,
                error: '已有 vLLM 部署任务正在运行。'
            };
        }

        const diagnosis = await this.diagnose(payload);
        const launchProfile = diagnosis.launchProfile || buildAutoLaunchProfile(diagnosis, payload);
        if (diagnosis.installPlan?.ok === false) {
            const blockers = diagnosis.installPlan.blockingSteps || [];
            const message = blockers.length
                ? `部署前检查未通过：${blockers.map((step) => step.title).join('；')}。`
                : '部署前检查未通过。';
            this.status = {
                ok: false,
                status: 'failed',
                running: false,
                source: diagnosis.source,
                runtimeMode: diagnosis.runtimeMode,
                modelId: diagnosis.modelId,
                servedModelId: diagnosis.targetModel,
                baseUrl: diagnosis.service?.baseUrl || getBaseUrl({
                    host: payload.host || DEFAULT_HOST,
                    port: payload.port || DEFAULT_PORT
                }),
                startedAt: new Date().toISOString(),
                endedAt: new Date().toISOString(),
                exitCode: null,
                diagnosis,
                installPlan: diagnosis.installPlan,
                logLines: [
                    `[AILIS vLLM] ${message}`,
                    ...blockers.map((step) => `[AILIS vLLM] ${step.title}: ${step.description}`)
                ],
                failure: {
                    code: 'preflight_blocked',
                    message
                }
            };
            this.emit('status', this.getStatus());
            return this.getStatus();
        }
        const effectiveVenvDir = payload.venvDir || diagnosis.recommendedVenvDir || diagnosis.runtime?.reusableVenvDir || '';
        const command = buildDeployCommand({
            projectRoot: this.projectRoot,
            platform: this.platform,
            runtimeMode: diagnosis.runtimeMode,
            source: payload.source,
            model: payload.modelId || payload.model,
            venvDir: effectiveVenvDir,
            downloadDir: payload.downloadDir || '',
            dtype: payload.dtype || '',
            maxModelLen: payload.maxModelLen || launchProfile.maxModelLen || 0,
            cpuOffloadGb: payload.cpuOffloadGb || payload.cpuOffloadGB || launchProfile.cpuOffloadGb || 0,
            swapSpace: payload.swapSpace || payload.swapSpaceGb || launchProfile.swapSpace || 0,
            gpuMemoryUtilization: payload.gpuMemoryUtilization || launchProfile.gpuMemoryUtilization || '',
            pipIndexUrl: payload.pipIndexUrl || '',
            pipExtraIndexUrl: payload.pipExtraIndexUrl || '',
            servedModelName: payload.servedModelName || payload.servedModelId || '',
            host: payload.host || DEFAULT_HOST,
            port: payload.port || DEFAULT_PORT,
            readyTimeoutSec: payload.readyTimeoutSec || DEFAULT_READY_TIMEOUT_SEC,
            vllmPackage: payload.vllmPackage || payload.package || 'auto',
            trustRemoteCode: payload.trustRemoteCode === true,
            installWsl: payload.installWsl !== false
        });

        this.status = {
            ok: true,
            status: 'running',
            running: true,
            runtimeMode: command.runtimeMode,
            source: command.source,
            modelId: command.modelId,
            servedModelId: command.servedModelId,
            baseUrl: command.baseUrl,
            startedAt: new Date().toISOString(),
            endedAt: '',
            exitCode: null,
            failure: null,
            diagnosis,
            installPlan: diagnosis.installPlan,
            logLines: [
                `[AILIS vLLM] 自动部署已启动：${command.modelId}`,
                `[AILIS vLLM] 来源：${command.source}，API Base：${command.baseUrl}`,
                `[AILIS vLLM] vLLM 运行时：${command.venvDir}`,
                `[AILIS vLLM] vLLM 安装策略：${command.vllmPackage}`,
                `[AILIS vLLM] pip 镜像：${command.pipIndexUrl || '默认 PyPI'}`,
                ...(launchProfile.adjusted
                    ? [`[AILIS vLLM] 自动启动策略：${launchProfile.reason} ${launchProfile.notes.join('，')}`]
                    : []),
                ...(diagnosis.runtime?.modelCompatibility?.ok === false
                    ? [`[AILIS vLLM] 当前运行时需要升级：${diagnosis.runtime.modelCompatibility.reason}`]
                    : [])
            ]
        };

        const child = this.processFactory(command.command, command.args, {
            cwd: command.cwd,
            windowsHide: true,
            env: {
                ...process.env,
                AILIS_VLLM_UI_DEPLOY: '1'
            }
        });
        this.child = child;

        child.stdout?.on?.('data', (chunk) => this.appendLog(chunk));
        child.stderr?.on?.('data', (chunk) => this.appendLog(chunk));
        child.on?.('error', (error) => {
            this.status = {
                ...this.status,
                ok: false,
                status: 'failed',
                running: false,
                endedAt: new Date().toISOString(),
                failure: {
                    code: 'spawn_failed',
                    message: error.message || String(error)
                }
            };
            this.child = null;
            this.emit('status', this.getStatus());
        });
        child.on?.('exit', (code) => {
            const success = Number(code) === 0;
            const nextLogLines = success
                ? this.status.logLines
                : [
                    ...this.status.logLines,
                    ...readDetachedVllmLogLines(this.projectRoot)
                ].slice(-MAX_LOG_LINES);
            this.status = {
                ...this.status,
                ok: success,
                status: success ? 'ready' : 'failed',
                running: false,
                endedAt: new Date().toISOString(),
                exitCode: Number.isFinite(Number(code)) ? Number(code) : null,
                logLines: nextLogLines,
                failure: success ? null : summarizeFailure(nextLogLines, code)
            };
            if (success) {
                this.status.logLines.push(`[AILIS vLLM] 部署完成：${this.status.baseUrl}`);
            }
            this.child = null;
            this.emit('status', this.getStatus());
        });

        this.emit('status', this.getStatus());
        return this.getStatus();
    }

    cancel() {
        if (!this.child || this.status.status !== 'running') {
            return this.getStatus();
        }
        try {
            this.child.kill();
        } catch {
            // The child may have already exited.
        }
        this.status = {
            ...this.status,
            ok: false,
            status: 'cancelled',
            running: false,
            endedAt: new Date().toISOString(),
            failure: {
                code: 'cancelled',
                message: '用户已取消 vLLM 自动部署任务。'
            }
        };
        this.child = null;
        this.emit('status', this.getStatus());
        return this.getStatus();
    }

    getStatus() {
        return {
            ...this.status,
            logLines: [...(this.status.logLines || [])]
        };
    }
}

module.exports = {
    VllmLocalDeployer,
    buildNativeRuntimeProbeScript,
    buildRuntimeProbeScript,
    buildAutoLaunchProfile,
    buildInstallPlan,
    buildDeployCommand,
    estimateRequiredDownloadBytes,
    getBaseUrl,
    getReusableVenvCandidates,
    inspectDownloadTarget,
    normalizeRuntimeMode,
    normalizeVllmPackage,
    normalizePathForWslpath,
    parseJsonSafe,
    summarizeFailure
};
