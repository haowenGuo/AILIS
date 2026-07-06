'use strict';

const ToolExposure = Object.freeze({
    DIRECT: 'direct',
    DIRECT_MODEL_ONLY: 'direct_model_only',
    DEFERRED: 'deferred'
});

function normalizeName(value = '') {
    return String(value || '').trim();
}

function toolNameOf(spec = {}) {
    return normalizeName(spec.name || spec.function?.name);
}

function safeJsonParse(value = '', fallback = {}) {
    if (value && typeof value === 'object' && !Array.isArray(value)) {
        return value;
    }
    try {
        const parsed = JSON.parse(String(value || '{}'));
        return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : fallback;
    } catch {
        return fallback;
    }
}

function normalizedToolName({ namespace = null, name = '' } = {}) {
    const normalizedName = normalizeName(name);
    const normalizedNamespace = normalizeName(namespace);
    if (!normalizedName) {
        return '';
    }
    return normalizedNamespace ? `${normalizedNamespace}__${normalizedName}` : normalizedName;
}

class ToolRegistry {
    constructor(entries = []) {
        this.entries = [];
        for (const entry of Array.isArray(entries) ? entries : []) {
            this.add(entry);
        }
    }

    add(entry = {}) {
        const name = toolNameOf(entry.spec || entry);
        if (!name) {
            return;
        }
        this.entries.push({
            name,
            exposure: entry.exposure || ToolExposure.DIRECT,
            spec: entry.spec || entry
        });
    }

    byExposure(exposure = ToolExposure.DIRECT) {
        return this.entries
            .filter((entry) => entry.exposure === exposure)
            .map((entry) => entry.spec);
    }

    all() {
        return this.entries.map((entry) => ({ ...entry }));
    }
}

class ToolRouter {
    constructor({ registry = new ToolRegistry(), model_visible_specs: modelVisibleSpecs = [] } = {}) {
        this.registry = registry instanceof ToolRegistry ? registry : new ToolRegistry(registry);
        this.model_visible_specs = Array.isArray(modelVisibleSpecs) ? modelVisibleSpecs : [];
    }

    static fromParts(registry, modelVisibleSpecs = []) {
        return new ToolRouter({
            registry: registry instanceof ToolRegistry ? registry : new ToolRegistry(registry),
            model_visible_specs: modelVisibleSpecs
        });
    }

    modelVisibleSpecs() {
        return this.model_visible_specs.map((spec) => ({ ...spec }));
    }

    registryEntries() {
        return this.registry.all();
    }

    buildToolCall(item = {}) {
        return ToolRouter.buildToolCall(item);
    }

    static buildToolCall(item = {}) {
        if (!item || typeof item !== 'object') {
            return null;
        }
        if (item.type === 'function_call') {
            const toolName = normalizedToolName({
                namespace: item.namespace,
                name: item.name
            });
            const callId = normalizeName(item.call_id || item.id);
            if (!toolName || !callId) {
                return null;
            }
            return {
                toolName,
                callId,
                payload: {
                    type: 'function',
                    arguments: typeof item.arguments === 'string' ? item.arguments : JSON.stringify(item.arguments || {})
                },
                args: safeJsonParse(item.arguments),
                responseItem: { ...item }
            };
        }
        if (item.type === 'tool_search_call') {
            if (item.execution !== 'client') {
                return null;
            }
            const callId = normalizeName(item.call_id || item.id);
            if (!callId) {
                return null;
            }
            return {
                toolName: 'tool_search',
                callId,
                payload: {
                    type: 'tool_search',
                    arguments: item.arguments || {}
                },
                args: item.arguments || {},
                responseItem: { ...item }
            };
        }
        if (item.type === 'custom_tool_call') {
            const toolName = normalizeName(item.name);
            const callId = normalizeName(item.call_id || item.id);
            if (!toolName || !callId) {
                return null;
            }
            return {
                toolName,
                callId,
                payload: {
                    type: 'custom',
                    input: String(item.input || '')
                },
                args: { input: String(item.input || '') },
                responseItem: { ...item }
            };
        }
        return null;
    }
}

function buildToolRouterFromModelVisibleSpecs(specs = [], {
    exposure = ToolExposure.DIRECT,
    limit = null,
    finalToolName = '',
    finalToolSpec = null
} = {}) {
    const registry = new ToolRegistry();
    const seen = new Set();
    const modelVisible = [];
    const push = (spec, specExposure = exposure) => {
        const name = toolNameOf(spec);
        if (!name || seen.has(name)) {
            return;
        }
        seen.add(name);
        registry.add({ name, exposure: specExposure, spec });
        modelVisible.push(spec);
    };

    for (const spec of Array.isArray(specs) ? specs : []) {
        if (finalToolName && toolNameOf(spec) === finalToolName) {
            continue;
        }
        push(spec);
    }
    if (finalToolSpec) {
        push(finalToolSpec);
    }

    if (Number.isFinite(Number(limit)) && Number(limit) > 0 && modelVisible.length > Number(limit)) {
        const numericLimit = Number(limit);
        if (finalToolSpec && finalToolName) {
            const withoutFinal = modelVisible.filter((spec) => toolNameOf(spec) !== finalToolName);
            return ToolRouter.fromParts(
                registry,
                withoutFinal.slice(0, Math.max(0, numericLimit - 1)).concat(finalToolSpec)
            );
        }
        return ToolRouter.fromParts(registry, modelVisible.slice(0, numericLimit));
    }
    return ToolRouter.fromParts(registry, modelVisible);
}

module.exports = {
    ToolExposure,
    ToolRegistry,
    ToolRouter,
    buildToolRouterFromModelVisibleSpecs,
    safeJsonParse,
    toolNameOf
};
