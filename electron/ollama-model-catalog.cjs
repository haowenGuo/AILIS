const { execFile } = require('child_process');

const DEFAULT_TIMEOUT_MS = 12000;
const DEFAULT_LIMIT = 30;
const MAX_LIMIT = 60;
const MAX_TAG_FAMILIES = 8;
const MAX_HTML_BUFFER = 8 * 1024 * 1024;

function clampLimit(value = DEFAULT_LIMIT) {
    const numeric = Number(value);
    if (!Number.isFinite(numeric) || numeric <= 0) {
        return DEFAULT_LIMIT;
    }
    return Math.max(1, Math.min(MAX_LIMIT, Math.floor(numeric)));
}

function normalizeQuery(value = '') {
    return String(value || '').trim().slice(0, 120);
}

function normalizeModelFamily(value = '') {
    return String(value || '')
        .trim()
        .replace(/^\/?library\//, '')
        .replace(/:.+$/, '')
        .replace(/[^a-zA-Z0-9_.-]/g, '')
        .slice(0, 160);
}

function buildOllamaSearchUrl({ query = '' } = {}) {
    const normalizedQuery = normalizeQuery(query);
    if (!normalizedQuery) {
        return 'https://ollama.com/library';
    }
    const url = new URL('https://ollama.com/search');
    url.searchParams.set('q', normalizedQuery);
    return url.toString();
}

function buildOllamaTagsUrl(model = '') {
    const family = normalizeModelFamily(model);
    if (!family) {
        throw new Error('Ollama model family is required.');
    }
    return `https://ollama.com/library/${encodeURIComponent(family)}/tags`;
}

function execFileText(command, args = [], { timeoutMs = DEFAULT_TIMEOUT_MS } = {}) {
    return new Promise((resolve, reject) => {
        execFile(command, args, {
            timeout: timeoutMs + 2000,
            maxBuffer: MAX_HTML_BUFFER,
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

async function fetchTextViaNativeHttp(url, { timeoutMs = DEFAULT_TIMEOUT_MS } = {}) {
    const timeoutSec = Math.max(3, Math.ceil(timeoutMs / 1000));
    if (process.platform === 'win32') {
        const encodedUrl = Buffer.from(String(url), 'utf8').toString('base64');
        const script = [
            "$ErrorActionPreference = 'Stop';",
            "$ProgressPreference = 'SilentlyContinue';",
            `$targetUrl = [Text.Encoding]::UTF8.GetString([Convert]::FromBase64String('${encodedUrl}'));`,
            "$headers = @{ Accept = 'text/html'; 'User-Agent' = 'AILIS-Ollama-model-catalog' };",
            `$response = Invoke-WebRequest -Uri $targetUrl -Headers $headers -UseBasicParsing -TimeoutSec ${timeoutSec};`,
            'Write-Output $response.Content;'
        ].join(' ');
        return execFileText('powershell.exe', [
            '-NoProfile',
            '-NonInteractive',
            '-ExecutionPolicy',
            'Bypass',
            '-Command',
            script
        ], { timeoutMs });
    }

    return execFileText('curl', [
        '-L',
        '--silent',
        '--show-error',
        '--max-time',
        String(timeoutSec),
        '-H',
        'Accept: text/html',
        '-H',
        'User-Agent: AILIS-Ollama-model-catalog',
        url
    ], { timeoutMs });
}

async function fetchText(url, { fetchImpl, timeoutMs = DEFAULT_TIMEOUT_MS, allowNativeFallback = true } = {}) {
    const fetcher = fetchImpl || globalThis.fetch;
    if (typeof fetcher !== 'function') {
        if (allowNativeFallback) {
            return fetchTextViaNativeHttp(url, { timeoutMs });
        }
        throw new Error('当前 Node/Electron 运行时不支持 fetch，无法实时获取 Ollama 模型目录。');
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
        const response = await fetcher(url, {
            signal: controller.signal,
            headers: {
                accept: 'text/html',
                'user-agent': 'AILIS-Ollama-model-catalog'
            }
        });
        if (!response?.ok) {
            const status = response?.status || 'unknown';
            const statusText = response?.statusText || 'HTTP request failed';
            const error = new Error(`${status} ${statusText}`);
            error.httpStatus = status;
            throw error;
        }
        return await response.text();
    } catch (error) {
        if (allowNativeFallback && !error?.httpStatus) {
            return fetchTextViaNativeHttp(url, { timeoutMs });
        }
        if (error?.name === 'AbortError') {
            throw new Error(`请求超时（${timeoutMs}ms）`);
        }
        throw error;
    } finally {
        clearTimeout(timer);
    }
}

function decodeHtml(value = '') {
    return String(value || '')
        .replace(/&nbsp;/g, ' ')
        .replace(/&#39;/g, "'")
        .replace(/&quot;/g, '"')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>');
}

function stripHtml(value = '') {
    return decodeHtml(String(value || '')
        .replace(/<script[\s\S]*?<\/script>/gi, ' ')
        .replace(/<style[\s\S]*?<\/style>/gi, ' ')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim());
}

function uniqueBy(values = [], getKey = (value) => value) {
    const seen = new Set();
    const result = [];
    for (const value of values) {
        const key = String(getKey(value) || '').toLowerCase();
        if (!key || seen.has(key)) {
            continue;
        }
        seen.add(key);
        result.push(value);
    }
    return result;
}

function parseSpanValues(block = '', marker = '') {
    const values = [];
    const pattern = new RegExp(`<span\\s+[^>]*${marker}[^>]*>([\\s\\S]*?)<\\/span>`, 'gi');
    for (const match of block.matchAll(pattern)) {
        const value = stripHtml(match[1]);
        if (value) {
            values.push(value);
        }
    }
    return uniqueBy(values, (value) => value);
}

function parseOllamaSearchHtml(html = '') {
    const models = [];
    const source = String(html || '');
    const anchorPattern = /<a\s+[^>]*href="\/library\/([^":/?#]+)"[^>]*class="[^"]*\bgroup\b[^"]*"[^>]*>([\s\S]*?)(?=<\/a>)/gi;
    let searchRank = 0;
    for (const match of source.matchAll(anchorPattern)) {
        const family = normalizeModelFamily(decodeHtml(match[1]));
        if (!family) {
            continue;
        }
        const block = match[2] || '';
        const titleMatch = block.match(/x-test-search-response-title[^>]*>([\s\S]*?)<\/span>/i);
        const descMatch = block.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
        const capabilities = parseSpanValues(block, 'x-test-capability');
        const sizes = parseSpanValues(block, 'x-test-size');
        const pullsMatch = block.match(/x-test-pull-count[^>]*>([\s\S]*?)<\/span>/i) ||
            block.match(/([\d,.]+[KMB]?)\s+Pulls?/i);
        models.push({
            id: family,
            family,
            tag: '',
            displayName: titleMatch ? stripHtml(titleMatch[1]) : family,
            description: descMatch ? stripHtml(descMatch[1]) : '',
            capabilities,
            sizes,
            pulls: pullsMatch ? stripHtml(pullsMatch[1]) : '',
            searchRank: searchRank++,
            tagRank: 0,
            source: 'ollama',
            sourceLabel: 'Ollama Library',
            url: `https://ollama.com/library/${family}`,
            tagsUrl: `https://ollama.com/library/${family}/tags`,
            fit: inferOllamaModelFit({ family, capabilities, description: descMatch ? stripHtml(descMatch[1]) : '' })
        });
    }
    return uniqueBy(models, (model) => model.family);
}

function parseByteSize(value = '') {
    const match = String(value || '').replace(/\s+/g, '').match(/(\d+(?:\.\d+)?)(KB|MB|GB|TB)/i);
    if (!match) {
        return 0;
    }
    const amount = Number(match[1]);
    const unit = match[2].toUpperCase();
    const multiplier = {
        KB: 1024,
        MB: 1024 ** 2,
        GB: 1024 ** 3,
        TB: 1024 ** 4
    }[unit] || 1;
    return Math.round(amount * multiplier);
}

function parseOllamaTagsHtml(html = '', family = '') {
    const normalizedFamily = normalizeModelFamily(family);
    const source = String(html || '');
    const tagPattern = new RegExp(`href="\\/library\\/${normalizedFamily.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}:([^"]+)"`, 'gi');
    const tags = [];
    let tagRank = 0;
    for (const match of source.matchAll(tagPattern)) {
        const rawTag = decodeHtml(match[1] || '').trim();
        if (!rawTag) {
            continue;
        }
        const id = `${normalizedFamily}:${rawTag}`;
        const start = Math.max(0, match.index || 0);
        const block = source.slice(start, start + 1200);
        const plain = stripHtml(block);
        const sizeMatch = plain.match(/(?:^|\s|•)(\d+(?:\.\d+)?\s*(?:KB|MB|GB|TB))(?:\s|•|$)/i);
        const contextMatch = plain.match(/(\d+(?:\.\d+)?\s*[KMG]?)\s+context window/i);
        tags.push({
            id,
            family: normalizedFamily,
            tag: rawTag,
            displayName: id,
            description: '',
            capabilities: [],
            sizes: [],
            pulls: '',
            searchRank: 0,
            tagRank: tagRank++,
            sizeText: sizeMatch ? sizeMatch[1].replace(/\s+/g, '') : '',
            sizeBytes: sizeMatch ? parseByteSize(sizeMatch[1]) : 0,
            contextWindow: contextMatch ? `${contextMatch[1].replace(/\s+/g, '')} context` : '',
            source: 'ollama',
            sourceLabel: 'Ollama Library',
            url: `https://ollama.com/library/${normalizedFamily}:${rawTag}`,
            tagsUrl: `https://ollama.com/library/${normalizedFamily}/tags`,
            fit: inferOllamaModelFit({ family: normalizedFamily, tag: rawTag })
        });
    }
    return uniqueBy(tags, (tag) => tag.id);
}

function inferOllamaModelFit({ family = '', tag = '', capabilities = [], description = '' } = {}) {
    const joined = [
        family,
        tag,
        description,
        ...(capabilities || [])
    ].join(' ').toLowerCase();
    if (/\b(embed|embedding|rerank|clip|whisper|ocr|nomic-embed)\b/.test(joined)) {
        return {
            level: 'blocked',
            label: '非对话模型',
            detail: '这个模型更像 embedding / rerank / 音频等专用模型，不适合作为 AILIS 对话主模型。'
        };
    }
    if (/\bcloud\b|:cloud|-cloud\b|\bmlx\b|-mlx\b/.test(joined)) {
        return {
            level: 'blocked',
            label: '非通用本地 tag',
            detail: 'cloud / mlx 这类 tag 不适合作为普通跨平台本地 Ollama pull 候选。'
        };
    }
    if (/\b(vl|vision|llava|bakllava|moondream)\b/.test(joined)) {
        return {
            level: 'good',
            label: '多模态/可对话',
            detail: '多模态模型可以安装；AILIS 当前 Ollama 对话链路会优先按文本模型使用。'
        };
    }
    if (/\b(coder|code|tools|instruct|chat|qwen|llama|gemma|mistral|deepseek|phi)\b/.test(joined)) {
        return {
            level: 'good',
            label: '适合对话/任务',
            detail: '适合作为本地对话或任务执行候选模型。'
        };
    }
    return {
        level: 'ok',
        label: '可尝试',
        detail: 'Ollama 官方库模型，可选择后由 Ollama pull 安装。'
    };
}

function rankOllamaModel(model = {}) {
    const fitRank = {
        good: 0,
        ok: 1,
        warning: 2,
        blocked: 3
    }[model.fit?.level] ?? 2;
    const searchRank = Number.isFinite(Number(model.searchRank)) ? Number(model.searchRank) : 999;
    const tagRank = Number.isFinite(Number(model.tagRank)) ? Number(model.tagRank) : 999;
    return fitRank * 100000 + searchRank * 1000 + tagRank;
}

async function searchOllamaModelCatalog(payload = {}, options = {}) {
    const query = normalizeQuery(payload.query || '');
    const limit = clampLimit(payload.limit || DEFAULT_LIMIT);
    const timeoutMs = Number(payload.timeoutMs || options.timeoutMs || DEFAULT_TIMEOUT_MS) || DEFAULT_TIMEOUT_MS;
    const errors = [];
    const searchUrl = buildOllamaSearchUrl({ query });
    const html = await fetchText(searchUrl, {
        fetchImpl: options.fetchImpl,
        timeoutMs,
        allowNativeFallback: options.allowNativeFallback !== false
    });
    const families = parseOllamaSearchHtml(html);
    const expanded = [];
    const familiesForTags = families.slice(0, Math.min(MAX_TAG_FAMILIES, limit));
    for (const family of familiesForTags) {
        try {
            const tagsHtml = await fetchText(buildOllamaTagsUrl(family.family), {
                fetchImpl: options.fetchImpl,
                timeoutMs,
                allowNativeFallback: options.allowNativeFallback !== false
            });
            const tags = parseOllamaTagsHtml(tagsHtml, family.family)
                .map((tag) => ({
                    ...tag,
                    searchRank: family.searchRank,
                    description: family.description,
                    capabilities: family.capabilities,
                    sizes: family.sizes,
                    pulls: family.pulls,
                    fit: tag.fit?.level === 'ok' ? family.fit : tag.fit
                }));
            if (tags.length) {
                expanded.push(...tags);
            } else {
                expanded.push(family);
            }
        } catch (error) {
            errors.push({
                source: 'ollama-tags',
                model: family.family,
                message: error.message || String(error)
            });
            expanded.push(family);
        }
    }
    if (families.length > familiesForTags.length) {
        expanded.push(...families.slice(familiesForTags.length));
    }
    const models = uniqueBy(expanded, (model) => model.id)
        .filter((model) => model.fit?.level !== 'blocked')
        .sort((a, b) => rankOllamaModel(a) - rankOllamaModel(b))
        .slice(0, limit);

    return {
        ok: true,
        query,
        source: 'ollama',
        searchedAt: new Date().toISOString(),
        sources: [{
            source: 'ollama',
            sourceLabel: 'Ollama Library',
            url: searchUrl,
            returned: models.length,
            total: families.length
        }],
        errors,
        models
    };
}

module.exports = {
    buildOllamaSearchUrl,
    buildOllamaTagsUrl,
    inferOllamaModelFit,
    parseOllamaSearchHtml,
    parseOllamaTagsHtml,
    searchOllamaModelCatalog
};
