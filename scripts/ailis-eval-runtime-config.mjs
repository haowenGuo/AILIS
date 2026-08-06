import fsSync from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '..');

function normalizeText(value, fallback = '') {
    if (typeof value === 'number' && Number.isFinite(value)) return String(value);
    if (typeof value !== 'string') return fallback;
    return value.trim() || fallback;
}

function loadDesktopStateSettings(args = {}) {
    const appData = process.env.APPDATA || path.join(process.env.USERPROFILE || '', 'AppData', 'Roaming');
    const stateCandidates = [
        path.join(appData, 'ailis', 'desktop-state.json'),
        path.join(appData, 'AILIS', 'desktop-state.json')
    ];
    const mcpCandidates = [
        path.join(appData, 'ailis', 'ailis-gateway', 'mcp-servers.json'),
        path.join(appData, 'AILIS', 'ailis-gateway', 'mcp-servers.json'),
        path.join(PROJECT_ROOT, '.ailis-state', 'mcp-servers.json')
    ];
    let preferences = {};
    let statePath = '';
    for (const candidate of stateCandidates) {
        if (!fsSync.existsSync(candidate)) continue;
        try {
            const state = JSON.parse(fsSync.readFileSync(candidate, 'utf8'));
            preferences = state.preferences || state.state?.preferences || {};
            statePath = candidate;
            break;
        } catch {}
    }
    const mcpConfigPath = mcpCandidates.find((candidate) => fsSync.existsSync(candidate)) || '';
    if (args.codexModelBridge) {
        process.env.AILIS_CODEX_REASONING_EFFORT = normalizeText(args.codexReasoningEffort, 'medium');
        return {
            statePath,
            mcpConfigPath,
            llmSettings: {
                provider: 'codex-model-bridge',
                baseUrl: 'codex://chatgpt-oauth',
                model: normalizeText(args.codexModel, 'gpt-5.6-luna'),
                apiKey: '',
                authMode: 'chatgpt_oauth',
                reasoningEffort: normalizeText(args.codexReasoningEffort, 'medium'),
                temperature: Number.isFinite(Number(args.temperature)) ? Number(args.temperature) : 0.2,
                timeoutMs: Math.max(30000, Number(args.llmTimeoutMs) || 120000)
            }
        };
    }
    const provider = normalizeText(
        preferences.llmProvider ||
            process.env.AILIS_AGENT_LLM_PROVIDER ||
            process.env.AILIS_LLM_PROVIDER ||
            'openai-compatible'
    );
    const baseUrl = normalizeText(
        preferences.llmBaseUrl ||
            process.env.AILIS_AGENT_LLM_BASE_URL ||
            process.env.AILIS_LLM_BASE_URL ||
            process.env.OPENAI_COMPATIBLE_BASE_URL ||
            ''
    );
    const model = normalizeText(
        preferences.llmModel ||
            process.env.AILIS_AGENT_LLM_MODEL ||
            process.env.AILIS_LLM_MODEL ||
            process.env.OPENAI_COMPATIBLE_MODEL ||
            ''
    );
    const apiKey = normalizeText(
        preferences.llmApiKey ||
            process.env.AILIS_AGENT_LLM_API_KEY ||
            process.env.AILIS_LLM_API_KEY ||
            process.env.OPENAI_COMPATIBLE_API_KEY ||
            ''
    );
    return {
        statePath,
        mcpConfigPath,
        llmSettings: {
            provider,
            baseUrl,
            model,
            apiKey,
            temperature: Number.isFinite(Number(args.temperature)) ? Number(args.temperature) : 0.2,
            timeoutMs: Math.max(30000, Number(args.llmTimeoutMs) || 120000)
        }
    };
}

function configureResearchMcpLlmEnvironment(llmSettings = {}) {
    const assignments = {
        AILIS_TOOL_LLM_PROVIDER: llmSettings.provider,
        AILIS_TOOL_LLM_BASE_URL: llmSettings.baseUrl,
        AILIS_TOOL_LLM_MODEL: llmSettings.model,
        AILIS_TOOL_LLM_API_KEY: llmSettings.apiKey,
        AILIS_TOOL_LLM_REASONING_EFFORT: llmSettings.reasoningEffort
    };
    for (const [name, value] of Object.entries(assignments)) {
        const normalized = normalizeText(value);
        if (normalized) process.env[name] = normalized;
        else delete process.env[name];
    }
}

export {
    configureResearchMcpLlmEnvironment,
    loadDesktopStateSettings
};
