const path = require('path');
const fsp = require('fs/promises');
const { createHash } = require('crypto');

const DEFAULT_BUILTIN_LEXICON_PATH = path.join(
    __dirname,
    'safety',
    'ember-sensitive-lexicon.json'
);
const DEFAULT_MAX_CACHE_ENTRIES = 512;

function normalizeSeverity(value = '') {
    const severity = String(value || '').trim().toLowerCase();
    return ['high', 'medium', 'low'].includes(severity) ? severity : 'medium';
}

function normalizeMatchMode(value = '') {
    return String(value || '').trim().toLowerCase() === 'word' ? 'word' : 'compact';
}

function normalizeText(value = '') {
    return String(value || '')
        .normalize('NFKC')
        .toLowerCase()
        .replace(/[\u0000\u200B-\u200D\u2060\uFEFF]/gu, '')
        .replace(/[^\p{L}\p{N}_]+/gu, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

function compactText(value = '') {
    return normalizeText(value).replace(/\s+/g, '');
}

function isWordCharacter(value = '') {
    return Boolean(value) && /[\p{L}\p{N}_]/u.test(value);
}

function normalizeLexicon(source = {}, sourceId = 'unknown') {
    const rules = Array.isArray(source?.rules) ? source.rules : [];
    const entries = [];
    for (const rule of rules) {
        const id = String(rule?.id || '').trim();
        const category = String(rule?.category || 'sensitive_content').trim();
        const severity = normalizeSeverity(rule?.severity);
        const match = normalizeMatchMode(rule?.match);
        if (!id || !Array.isArray(rule?.terms)) {
            continue;
        }
        for (const rawTerm of rule.terms) {
            const term = match === 'word'
                ? normalizeText(rawTerm)
                : compactText(rawTerm);
            if (!term) {
                continue;
            }
            entries.push({
                id,
                category,
                severity,
                match,
                sourceId,
                term
            });
        }
    }
    return {
        schema: String(source?.schema || 'ailis.safety.lexicon.v1'),
        version: String(source?.version || 'unknown'),
        languages: Array.isArray(source?.languages)
            ? source.languages.map((item) => String(item || '').trim()).filter(Boolean)
            : [],
        entries
    };
}

function buildAhoCorasick(entries = []) {
    const nodes = [{
        next: new Map(),
        fail: 0,
        outputs: []
    }];

    for (const entry of entries) {
        let state = 0;
        for (const character of entry.term) {
            const existing = nodes[state].next.get(character);
            if (existing !== undefined) {
                state = existing;
                continue;
            }
            const nextState = nodes.length;
            nodes[state].next.set(character, nextState);
            nodes.push({
                next: new Map(),
                fail: 0,
                outputs: []
            });
            state = nextState;
        }
        nodes[state].outputs.push(entry);
    }

    const queue = [];
    for (const state of nodes[0].next.values()) {
        queue.push(state);
    }
    for (let offset = 0; offset < queue.length; offset += 1) {
        const state = queue[offset];
        for (const [character, nextState] of nodes[state].next.entries()) {
            queue.push(nextState);
            let fallback = nodes[state].fail;
            while (fallback && !nodes[fallback].next.has(character)) {
                fallback = nodes[fallback].fail;
            }
            nodes[nextState].fail = nodes[fallback].next.get(character) ?? 0;
            nodes[nextState].outputs.push(...nodes[nodes[nextState].fail].outputs);
        }
    }

    return {
        nodeCount: nodes.length,
        search(text = '', onMatch = null) {
            let state = 0;
            const matches = [];
            for (let index = 0; index < text.length; index += 1) {
                const character = text[index];
                while (state && !nodes[state].next.has(character)) {
                    state = nodes[state].fail;
                }
                state = nodes[state].next.get(character) ?? 0;
                if (!nodes[state].outputs.length) {
                    continue;
                }
                for (const entry of nodes[state].outputs) {
                    const start = index - entry.term.length + 1;
                    const match = {
                        entry,
                        start,
                        end: index + 1
                    };
                    if (!onMatch || onMatch(match, text) !== false) {
                        matches.push(match);
                    }
                }
            }
            return matches;
        }
    };
}

function hasWordBoundaries(match, text) {
    const before = match.start > 0 ? text[match.start - 1] : '';
    const after = match.end < text.length ? text[match.end] : '';
    return !isWordCharacter(before) && !isWordCharacter(after);
}

function hashText(value = '') {
    return createHash('sha256').update(String(value || '')).digest('hex');
}

function selectHighestSeverity(matches = []) {
    if (matches.some((match) => match.entry.severity === 'high')) {
        return 'high';
    }
    if (matches.some((match) => match.entry.severity === 'medium')) {
        return 'medium';
    }
    return matches.length ? 'low' : 'none';
}

class AILISSensitiveWordClassifier {
    constructor(options = {}) {
        this.builtinLexiconPath = path.resolve(
            options.builtinLexiconPath || DEFAULT_BUILTIN_LEXICON_PATH
        );
        this.customLexiconPath = options.customLexiconPath
            ? path.resolve(options.customLexiconPath)
            : '';
        this.extraLexicons = Array.isArray(options.extraLexicons) ? options.extraLexicons : [];
        this.maxCacheEntries = Math.max(
            16,
            Number(options.maxCacheEntries || DEFAULT_MAX_CACHE_ENTRIES)
        );
        this.status = 'idle';
        this.ready = false;
        this.lastError = '';
        this.loadedAt = 0;
        this.lastCheckedAt = 0;
        this.checkCount = 0;
        this.patternCount = 0;
        this.nodeCount = 0;
        this.languages = [];
        this.lexiconVersions = [];
        this.wordMatcher = null;
        this.compactMatcher = null;
        this.preparePromise = null;
        this.resultCache = new Map();
    }

    getStatus() {
        return {
            engine: 'aho_corasick_lexicon',
            runtime: 'javascript',
            profile: 'sensitive_word_fast_path',
            status: this.status,
            ready: this.ready,
            lastError: this.lastError,
            loadedAt: this.loadedAt,
            lastCheckedAt: this.lastCheckedAt,
            checkCount: this.checkCount,
            patternCount: this.patternCount,
            nodeCount: this.nodeCount,
            lexiconVersions: [...this.lexiconVersions],
            customLexiconPath: this.customLexiconPath,
            languages: [...this.languages],
            estimatedDownloadBytes: 0,
            capability: 'explicit_sensitive_term_detection',
            limitation: 'keyword_matching_does_not_detect_implicit_bias_or_contextual_intent'
        };
    }

    async readLexicon(filePath, required = false) {
        if (!filePath) {
            return null;
        }
        try {
            const content = await fsp.readFile(filePath, 'utf8');
            return JSON.parse(content.replace(/^\uFEFF/, ''));
        } catch (error) {
            if (!required && error?.code === 'ENOENT') {
                return null;
            }
            throw error;
        }
    }

    async prepare() {
        if (this.ready) {
            return this;
        }
        if (this.preparePromise) {
            return this.preparePromise;
        }
        this.status = 'loading';
        this.lastError = '';
        this.preparePromise = (async () => {
            const sources = [];
            const builtin = await this.readLexicon(this.builtinLexiconPath, true);
            sources.push(normalizeLexicon(builtin, 'builtin'));
            const custom = await this.readLexicon(this.customLexiconPath, false);
            if (custom) {
                sources.push(normalizeLexicon(custom, 'custom'));
            }
            for (let index = 0; index < this.extraLexicons.length; index += 1) {
                sources.push(normalizeLexicon(this.extraLexicons[index], `extra-${index + 1}`));
            }

            const entriesByRule = new Map();
            for (const source of sources) {
                const sourceRules = new Map();
                for (const entry of source.entries) {
                    const entries = sourceRules.get(entry.id) || [];
                    entries.push(entry);
                    sourceRules.set(entry.id, entries);
                }
                for (const [ruleId, entries] of sourceRules.entries()) {
                    entriesByRule.set(ruleId, entries);
                }
            }
            const entries = [...entriesByRule.values()].flat();
            const wordEntries = entries.filter((entry) => entry.match === 'word');
            const compactEntries = entries.filter((entry) => entry.match === 'compact');
            this.wordMatcher = buildAhoCorasick(wordEntries);
            this.compactMatcher = buildAhoCorasick(compactEntries);
            this.patternCount = entries.length;
            this.nodeCount = this.wordMatcher.nodeCount + this.compactMatcher.nodeCount;
            this.languages = [...new Set(sources.flatMap((source) => source.languages))];
            this.lexiconVersions = sources.map((source) => source.version);
            this.status = 'ready';
            this.ready = true;
            this.loadedAt = Date.now();
            return this;
        })().catch((error) => {
            this.status = 'error';
            this.ready = false;
            this.lastError = error?.message || String(error);
            throw error;
        }).finally(() => {
            this.preparePromise = null;
        });
        return this.preparePromise;
    }

    async dispose() {
        this.wordMatcher = null;
        this.compactMatcher = null;
        this.resultCache.clear();
        this.status = 'idle';
        this.ready = false;
        this.lastError = '';
    }

    remember(cacheKey, result) {
        if (this.resultCache.has(cacheKey)) {
            this.resultCache.delete(cacheKey);
        }
        this.resultCache.set(cacheKey, result);
        while (this.resultCache.size > this.maxCacheEntries) {
            const oldestKey = this.resultCache.keys().next().value;
            this.resultCache.delete(oldestKey);
        }
    }

    async evaluate({ text = '' } = {}) {
        await this.prepare();
        const rawText = String(text || '');
        const cacheKey = hashText(rawText);
        const cached = this.resultCache.get(cacheKey);
        if (cached) {
            this.lastCheckedAt = Date.now();
            this.checkCount += 1;
            return {
                ...cached,
                details: {
                    ...cached.details,
                    cacheHit: true
                }
            };
        }

        const startedAt = performance.now();
        const wordText = normalizeText(rawText);
        const compact = wordText.replace(/\s+/g, '');
        const wordMatches = this.wordMatcher.search(wordText, hasWordBoundaries);
        const compactMatches = this.compactMatcher.search(compact);
        const matches = [...wordMatches, ...compactMatches];
        const severity = selectHighestSeverity(matches);
        const decision = severity === 'high'
            ? 'block'
            : severity === 'medium'
                ? 'review'
                : 'allow';
        const categories = [...new Set(matches.map((match) => match.entry.category))];
        const ruleIds = [...new Set(matches.map((match) => match.entry.id))];
        const elapsedMs = Number((performance.now() - startedAt).toFixed(3));
        const result = {
            decision,
            riskLevel: severity,
            riskTypes: categories,
            summary: decision === 'allow'
                ? '本地敏感词扫描未发现显性风险模式。'
                : `本地敏感词扫描命中 ${ruleIds.length} 类显性风险模式。`,
            suggestion: decision === 'block' ? 'block_or_rewrite' : '',
            details: {
                engine: 'aho_corasick_lexicon',
                profile: 'sensitive_word_fast_path',
                patternCount: this.patternCount,
                matchCount: matches.length,
                matchedRuleIds: ruleIds,
                categories,
                highestSeverity: severity,
                textChars: rawText.length,
                normalizedChars: wordText.length,
                elapsedMs,
                cacheHit: false,
                coverageComplete: true
            }
        };
        this.remember(cacheKey, result);
        this.lastCheckedAt = Date.now();
        this.checkCount += 1;
        return result;
    }
}

module.exports = {
    AILISSensitiveWordClassifier,
    DEFAULT_BUILTIN_LEXICON_PATH,
    buildAhoCorasick,
    compactText,
    hasWordBoundaries,
    normalizeLexicon,
    normalizeText
};
