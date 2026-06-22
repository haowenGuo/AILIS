const { execFile } = require('child_process');

const DEFAULT_TIMEOUT_MS = 12000;
const DEFAULT_LIMIT = 40;
const MAX_LIMIT = 80;
const MAX_NATIVE_HTTP_BUFFER = 16 * 1024 * 1024;

const SOURCE_LABELS = Object.freeze({
    hf: 'Hugging Face',
    modelscope: 'ModelScope'
});

function clampLimit(value = DEFAULT_LIMIT) {
    const numeric = Number(value);
    if (!Number.isFinite(numeric) || numeric <= 0) {
        return DEFAULT_LIMIT;
    }
    return Math.max(1, Math.min(MAX_LIMIT, Math.floor(numeric)));
}

function normalizeSource(value = 'both') {
    const normalized = String(value || 'both').trim().toLowerCase();
    if (normalized === 'huggingface' || normalized === 'hugging-face') {
        return 'hf';
    }
    if (normalized === 'ms' || normalized === 'model-scope' || normalized === 'model_scope') {
        return 'modelscope';
    }
    if (normalized === 'hf' || normalized === 'modelscope' || normalized === 'both') {
        return normalized;
    }
    return 'both';
}

function normalizeQuery(value = '') {
    return String(value || '').trim().slice(0, 120);
}

function appendOptionalParam(params, key, value) {
    if (value !== undefined && value !== null && String(value).trim()) {
        params.set(key, String(value).trim());
    }
}

function buildHuggingFaceUrl({ query, limit }) {
    const url = new URL('https://huggingface.co/api/models');
    const params = url.searchParams;
    appendOptionalParam(params, 'search', query);
    params.set('pipeline_tag', 'text-generation');
    params.set('sort', 'downloads');
    params.set('direction', '-1');
    params.set('limit', String(limit));
    return url.toString();
}

function buildModelScopeUrl({ query, limit }) {
    const url = new URL('https://modelscope.cn/openapi/v1/models');
    const params = url.searchParams;
    appendOptionalParam(params, 'search', query);
    params.set('sort', 'downloads');
    params.set('page_number', '1');
    params.set('page_size', String(limit));
    params.set('filter.task', 'text-generation');
    return url.toString();
}

function execFileText(command, args = [], { timeoutMs = DEFAULT_TIMEOUT_MS } = {}) {
    return new Promise((resolve, reject) => {
        execFile(command, args, {
            timeout: timeoutMs + 2000,
            maxBuffer: MAX_NATIVE_HTTP_BUFFER,
            windowsHide: true
        }, (error, stdout, stderr) => {
            if (error) {
                const detail = stderr ? `${error.message}: ${String(stderr).trim()}` : error.message;
                reject(new Error(detail));
                return;
            }
            resolve(String(stdout || ''));
        });
    });
}

async function fetchJsonViaNativeHttp(url, { timeoutMs = DEFAULT_TIMEOUT_MS } = {}) {
    const timeoutSec = Math.max(3, Math.ceil(timeoutMs / 1000));
    if (process.platform === 'win32') {
        const encodedUrl = Buffer.from(String(url), 'utf8').toString('base64');
        const script = [
            "$ErrorActionPreference = 'Stop';",
            "$ProgressPreference = 'SilentlyContinue';",
            `$targetUrl = [Text.Encoding]::UTF8.GetString([Convert]::FromBase64String('${encodedUrl}'));`,
            "$headers = @{ Accept = 'application/json'; 'User-Agent' = 'AILIS-vLLM-model-catalog' };",
            `$json = Invoke-RestMethod -Uri $targetUrl -Headers $headers -TimeoutSec ${timeoutSec} | ConvertTo-Json -Depth 30 -Compress;`,
            "Write-Output $json;"
        ].join(' ');
        const stdout = await execFileText('powershell.exe', [
            '-NoProfile',
            '-NonInteractive',
            '-ExecutionPolicy',
            'Bypass',
            '-Command',
            script
        ], { timeoutMs });
        return JSON.parse(stdout);
    }

    const stdout = await execFileText('curl', [
        '-L',
        '--silent',
        '--show-error',
        '--max-time',
        String(timeoutSec),
        '-H',
        'Accept: application/json',
        '-H',
        'User-Agent: AILIS-vLLM-model-catalog',
        url
    ], { timeoutMs });
    return JSON.parse(stdout);
}

async function fetchJson(url, { fetchImpl, timeoutMs = DEFAULT_TIMEOUT_MS, allowNativeFallback = true } = {}) {
    const fetcher = fetchImpl || globalThis.fetch;
    if (typeof fetcher !== 'function') {
        if (allowNativeFallback) {
            return fetchJsonViaNativeHttp(url, { timeoutMs });
        }
        throw new Error('当前 Node/Electron 运行时不支持 fetch，无法实时获取模型目录。');
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
        const response = await fetcher(url, {
            signal: controller.signal,
            headers: {
                accept: 'application/json',
                'user-agent': 'AILIS-vLLM-model-catalog'
            }
        });
        if (!response?.ok) {
            const status = response?.status || 'unknown';
            const statusText = response?.statusText || 'HTTP request failed';
            const error = new Error(`${status} ${statusText}`);
            error.httpStatus = status;
            throw error;
        }
        return await response.json();
    } catch (error) {
        if (allowNativeFallback && !error?.httpStatus) {
            return fetchJsonViaNativeHttp(url, { timeoutMs });
        }
        if (error?.name === 'AbortError') {
            throw new Error(`请求超时（${timeoutMs}ms）`);
        }
        throw error;
    } finally {
        clearTimeout(timer);
    }
}

function firstArray(value, keys = []) {
    if (Array.isArray(value)) {
        return value;
    }
    if (!value || typeof value !== 'object') {
        return [];
    }
    for (const key of keys) {
        const candidate = value[key];
        if (Array.isArray(candidate)) {
            return candidate;
        }
        if (candidate && typeof candidate === 'object') {
            const nested = firstArray(candidate, keys);
            if (nested.length) {
                return nested;
            }
        }
    }
    return [];
}

function normalizeStringList(value) {
    if (Array.isArray(value)) {
        return value.map((entry) => String(entry || '').trim()).filter(Boolean);
    }
    if (typeof value === 'string' && value.trim()) {
        return [value.trim()];
    }
    return [];
}

function parseLicense(tags = [], explicitLicense = '') {
    if (explicitLicense) {
        return explicitLicense;
    }
    const licenseTag = tags.find((tag) => /^license:/i.test(tag));
    return licenseTag ? licenseTag.replace(/^license:/i, '') : '';
}

function inferTasks({ tasks = [], tags = [], pipelineTag = '' } = {}) {
    const taskSet = new Set(normalizeStringList(tasks));
    if (pipelineTag) {
        taskSet.add(pipelineTag);
    }
    for (const tag of tags) {
        const taskMatch = String(tag).match(/^task:(.+)$/i);
        if (taskMatch?.[1]) {
            taskSet.add(taskMatch[1]);
        } else if (tag === 'text-generation' || tag === 'image-text-to-text' || tag === 'conversational') {
            taskSet.add(tag);
        }
    }
    return Array.from(taskSet).filter(Boolean);
}

function hasAnyNeedle(text, needles) {
    const haystack = String(text || '').toLowerCase();
    return needles.some((needle) => haystack.includes(needle));
}

function inferVllmFit(model) {
    const joined = [
        model.id,
        model.displayName,
        ...(model.tags || []),
        ...(model.tasks || [])
    ].join(' ').toLowerCase();
    const isInstruction = hasAnyNeedle(joined, ['instruct', 'chat', 'assistant', 'coder']);
    const isVision = hasAnyNeedle(joined, ['vl', 'vision', 'image-text-to-text', 'multimodal']);
    const hasTransformers = hasAnyNeedle(joined, ['transformers', 'transformer']);
    const hasSafetensors = hasAnyNeedle(joined, ['safetensors']);
    const isGguf = hasAnyNeedle(joined, ['gguf']);

    if (model.private) {
        return {
            level: 'blocked',
            label: '私有模型',
            detail: '私有模型通常需要登录和权限，不适合作为默认本地 vLLM 候选。'
        };
    }
    if (model.gated) {
        return {
            level: 'warning',
            label: '可能需要授权',
            detail: '该模型可能需要登录或访问授权，下载前请确认本机凭据。'
        };
    }
    if (isGguf) {
        return {
            level: 'warning',
            label: '更适合 llama.cpp/Ollama',
            detail: 'GGUF 通常不是 vLLM 的首选权重格式。'
        };
    }
    if (isVision) {
        return {
            level: 'warning',
            label: '多模态模型',
            detail: 'vLLM 可尝试部署，但 AILIS 侧需要启用视觉/多模态链路后才适合作为主模型。'
        };
    }
    if (isInstruction) {
        return {
            level: 'good',
            label: '适合对话/Agent',
            detail: 'Instruct/Chat/Coder 类模型通常更适合作为 AILIS 的本地任务模型。'
        };
    }
    if (hasTransformers || hasSafetensors) {
        return {
            level: 'neutral',
            label: '基础模型',
            detail: '看起来可由 Transformers/vLLM 尝试加载，但更建议优先选择 Instruct/Chat 版本。'
        };
    }
    return {
        level: 'unknown',
        label: '需确认兼容性',
        detail: '缺少明显的 Transformers/safetensors 标记，启动 vLLM 前需要确认模型格式。'
    };
}

function scoreModel(model) {
    const downloads = Math.max(0, Number(model.downloads) || 0);
    const likes = Math.max(0, Number(model.likes) || 0);
    const fitBoost = {
        good: 100,
        neutral: 40,
        warning: 10,
        unknown: 0,
        blocked: -100
    }[model.fit?.level] ?? 0;
    const recencyBoost = (() => {
        const timestamp = Date.parse(model.lastModified || model.createdAt || '');
        if (!Number.isFinite(timestamp)) {
            return 0;
        }
        const days = Math.max(0, (Date.now() - timestamp) / 86400000);
        return Math.max(0, 20 - Math.min(20, days / 90));
    })();
    return fitBoost + Math.log10(downloads + 1) * 12 + Math.log10(likes + 1) * 4 + recencyBoost;
}

function normalizeHuggingFaceModel(raw = {}) {
    const id = String(raw.modelId || raw.id || '').trim();
    if (!id) {
        return null;
    }
    const tags = normalizeStringList(raw.tags);
    const tasks = inferTasks({ tags, pipelineTag: raw.pipeline_tag || raw.pipelineTag });
    const model = {
        id,
        displayName: id,
        source: 'hf',
        sourceLabel: SOURCE_LABELS.hf,
        url: `https://huggingface.co/${id}`,
        downloads: Number(raw.downloads) || 0,
        likes: Number(raw.likes) || 0,
        license: parseLicense(tags),
        tasks,
        tags,
        libraryName: raw.library_name || raw.libraryName || '',
        createdAt: raw.createdAt || raw.created_at || '',
        lastModified: raw.lastModified || raw.last_modified || '',
        private: Boolean(raw.private),
        gated: Boolean(raw.gated),
        rawProvider: 'huggingface'
    };
    model.fit = inferVllmFit(model);
    model.score = scoreModel(model);
    return model;
}

function normalizeModelScopeModel(raw = {}) {
    const id = String(raw.id || raw.model_id || raw.modelId || '').trim();
    if (!id) {
        return null;
    }
    const tags = normalizeStringList(raw.tags);
    const tasks = inferTasks({ tags, tasks: raw.tasks || raw.task });
    const model = {
        id,
        displayName: raw.display_name || raw.name || id,
        source: 'modelscope',
        sourceLabel: SOURCE_LABELS.modelscope,
        url: `https://modelscope.cn/models/${id}`,
        downloads: Number(raw.downloads) || 0,
        likes: Number(raw.likes) || 0,
        license: parseLicense(tags, raw.license || ''),
        tasks,
        tags,
        libraryName: raw.library || raw.library_name || '',
        createdAt: raw.created_at || raw.createdAt || '',
        lastModified: raw.last_modified || raw.lastModified || '',
        sizeBytes: Number(raw.file_size) || 0,
        parameters: Number(raw.params) || 0,
        private: Boolean(raw.private),
        gated: Boolean(raw.gated),
        rawProvider: 'modelscope'
    };
    model.fit = inferVllmFit(model);
    model.score = scoreModel(model);
    return model;
}

function isUsefulVllmCandidate(model) {
    if (!model?.id || model.private) {
        return false;
    }
    const joined = [
        model.id,
        ...(model.tags || []),
        ...(model.tasks || [])
    ].join(' ').toLowerCase();
    if (hasAnyNeedle(joined, ['text-generation', 'image-text-to-text', 'conversational'])) {
        return true;
    }
    return hasAnyNeedle(joined, ['qwen', 'deepseek', 'llama', 'gemma', 'mistral', 'glm', 'internlm', 'yi']);
}

function dedupeModels(models = []) {
    const seen = new Set();
    const deduped = [];
    for (const model of models) {
        const key = `${model.source}:${model.id}`.toLowerCase();
        if (seen.has(key)) {
            continue;
        }
        seen.add(key);
        deduped.push(model);
    }
    return deduped;
}

async function fetchHuggingFaceModels({ query, limit, fetchImpl, timeoutMs, allowNativeFallback }) {
    const url = buildHuggingFaceUrl({ query, limit });
    const payload = await fetchJson(url, { fetchImpl, timeoutMs, allowNativeFallback });
    const rows = firstArray(payload, ['value', 'models', 'items', 'data']);
    return {
        source: 'hf',
        sourceLabel: SOURCE_LABELS.hf,
        url,
        total: rows.length,
        models: rows.map(normalizeHuggingFaceModel).filter(isUsefulVllmCandidate)
    };
}

async function fetchModelScopeModels({ query, limit, fetchImpl, timeoutMs, allowNativeFallback }) {
    const url = buildModelScopeUrl({ query, limit });
    const payload = await fetchJson(url, { fetchImpl, timeoutMs, allowNativeFallback });
    const rows = firstArray(payload, ['models', 'items', 'list', 'data', 'results']);
    return {
        source: 'modelscope',
        sourceLabel: SOURCE_LABELS.modelscope,
        url,
        total: Number(payload?.data?.total_count ?? payload?.total_count ?? rows.length) || rows.length,
        models: rows.map(normalizeModelScopeModel).filter(isUsefulVllmCandidate)
    };
}

async function searchVllmModelCatalog(options = {}, deps = {}) {
    const source = normalizeSource(options.source);
    const query = normalizeQuery(options.query);
    const limit = clampLimit(options.limit);
    const timeoutMs = Math.max(
        3000,
        Math.min(30000, Number(options.timeoutMs) || DEFAULT_TIMEOUT_MS)
    );
    const fetchImpl = deps.fetchImpl || options.fetchImpl || globalThis.fetch;
    const allowNativeFallback = !deps.fetchImpl && !options.fetchImpl;
    const startedAt = Date.now();

    const jobs = [];
    if (source === 'hf' || source === 'both') {
        jobs.push(fetchHuggingFaceModels({ query, limit, fetchImpl, timeoutMs, allowNativeFallback }));
    }
    if (source === 'modelscope' || source === 'both') {
        jobs.push(fetchModelScopeModels({ query, limit, fetchImpl, timeoutMs, allowNativeFallback }));
    }

    const settled = await Promise.allSettled(jobs);
    const sources = [];
    const errors = [];
    const models = [];
    for (const result of settled) {
        if (result.status === 'fulfilled') {
            sources.push({
                source: result.value.source,
                sourceLabel: result.value.sourceLabel,
                url: result.value.url,
                total: result.value.total,
                returned: result.value.models.length
            });
            models.push(...result.value.models);
            continue;
        }
        errors.push({
            message: result.reason?.message || String(result.reason || 'unknown error')
        });
    }

    const sortedModels = dedupeModels(models)
        .sort((a, b) => b.score - a.score)
        .slice(0, limit);

    return {
        ok: sortedModels.length > 0,
        source,
        query,
        limit,
        fetchedAt: new Date().toISOString(),
        durationMs: Date.now() - startedAt,
        sources,
        errors,
        models: sortedModels
    };
}

module.exports = {
    buildHuggingFaceUrl,
    buildModelScopeUrl,
    normalizeHuggingFaceModel,
    normalizeModelScopeModel,
    searchVllmModelCatalog
};
