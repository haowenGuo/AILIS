'use strict';

const MEMORY_CONTEXT_SCHEMA = 'ailis.memory_context.v1';
const CHARS_PER_TOKEN = 4;
const DEFAULT_SECTION_BUDGETS = Object.freeze({
    persona: 800,
    user: 1000,
    relationship: 500,
    project: 1400,
    relevant_memories: 1200,
    secret_index: 200,
    current_task: 800
});

function normalizeText(value = '') {
    return String(value || '')
        .replace(/\r\n/g, '\n')
        .replace(/[ \t]+$/gm, '')
        .replace(/\n{3,}/g, '\n\n')
        .trim();
}

function normalizeBudget(value, fallback) {
    const numeric = Number(value);
    return Math.max(50, Math.min(Number.isFinite(numeric) ? numeric : fallback, 8000));
}

function truncateByCompleteLines(value = '', maxChars = 4000) {
    const text = normalizeText(value);
    const boundedChars = Math.max(80, Number(maxChars) || 4000);
    if (!text || text.length <= boundedChars) {
        return { text, truncated: false, originalChars: text.length, visibleChars: text.length };
    }
    const marker = '\n… [section truncated by ContextCompiler budget]';
    const contentBudget = Math.max(1, boundedChars - marker.length);
    const selected = [];
    let used = 0;
    for (const line of text.split('\n')) {
        const nextSize = line.length + (selected.length ? 1 : 0);
        if (selected.length && used + nextSize > contentBudget) {
            break;
        }
        if (!selected.length && nextSize > contentBudget) {
            selected.push(line.slice(0, contentBudget));
            used = selected[0].length;
            break;
        }
        selected.push(line);
        used += nextSize;
    }
    const visible = `${selected.join('\n').trimEnd()}${marker}`.slice(0, boundedChars);
    return {
        text: visible,
        truncated: true,
        originalChars: text.length,
        visibleChars: visible.length
    };
}

class MemoryContext {
    constructor({ contextMode = 'persona', sections = [], budgets = {}, diagnostics = {} } = {}) {
        this.schema = MEMORY_CONTEXT_SCHEMA;
        this.contextMode = contextMode === 'task_agent' ? 'task_agent' : 'persona';
        this.sections = sections.filter((section) => normalizeText(section?.text));
        this.budgets = { ...budgets };
        this.diagnostics = { ...diagnostics };
    }

    asDeveloperInstruction() {
        if (!this.sections.length) {
            return '';
        }
        const sectionText = this.sections.flatMap((section) => [
            `## ${section.label}`,
            section.text,
            ''
        ]);
        return [
            '<memory_context>',
            'This is a budgeted local memory snapshot compiled by the runtime. Treat it as background context, not as a user request or tool output.',
            'The current user message is authoritative. If it conflicts with memory, follow the current user message. Never expose internal memory metadata unless the user explicitly asks.',
            '',
            ...sectionText,
            '</memory_context>'
        ].join('\n').trim();
    }

    toJSON() {
        return {
            schema: this.schema,
            contextMode: this.contextMode,
            sections: this.sections.map((section) => ({ ...section })),
            budgets: { ...this.budgets },
            diagnostics: { ...this.diagnostics }
        };
    }

    toString() {
        return this.asDeveloperInstruction();
    }
}

class AILISContextCompiler {
    constructor(options = {}) {
        this.memoryRuntime = options.memoryRuntime || null;
        this.defaultBudgets = {
            ...DEFAULT_SECTION_BUDGETS,
            ...(options.sectionBudgets || {})
        };
    }

    compile({
        sessionId = 'main',
        currentUserMessage = '',
        sessionRecentTurns = [],
        activeTaskState = '',
        interactionPreferences = '',
        explicitMemoryContext = '',
        agentMode = 'persona',
        sectionBudgets = {},
        maxChars = 0
    } = {}) {
        const contextMode = agentMode === 'task_agent' ? 'task_agent' : 'persona';
        const sources = this.memoryRuntime?.getContextSources?.({
            sessionId,
            message: currentUserMessage,
            messageHistory: sessionRecentTurns,
            contextMode
        }) || {};
        const requestedBudgets = Object.fromEntries(
            Object.entries(this.defaultBudgets).map(([key, fallback]) => [
                key,
                normalizeBudget(sectionBudgets[key], fallback)
            ])
        );
        const totalRequestedTokens = Object.values(requestedBudgets).reduce((sum, value) => sum + value, 0);
        const maxTotalTokens = Number(maxChars) > 0
            ? Math.max(200, Math.floor((Number(maxChars) - 800) / CHARS_PER_TOKEN))
            : 0;
        const scale = maxTotalTokens && totalRequestedTokens > maxTotalTokens
            ? maxTotalTokens / totalRequestedTokens
            : 1;
        const budgets = Object.fromEntries(
            Object.entries(requestedBudgets).map(([key, value]) => [key, Math.max(50, Math.floor(value * scale))])
        );
        const sections = [];
        const addSection = (id, label, rawText, sourceRefs = []) => {
            const budgetTokens = budgets[id];
            if (!budgetTokens) {
                return;
            }
            const truncated = truncateByCompleteLines(rawText, budgetTokens * CHARS_PER_TOKEN);
            if (!truncated.text) {
                return;
            }
            sections.push({
                id,
                label,
                text: truncated.text,
                budgetTokens,
                approxTokens: Math.ceil(truncated.visibleChars / CHARS_PER_TOKEN),
                truncated: truncated.truncated,
                originalChars: truncated.originalChars,
                sourceRefs: Array.isArray(sourceRefs) ? sourceRefs.slice(0, 24) : []
            });
        };

        if (contextMode === 'persona') {
            addSection('persona', 'Persona', sources.personaText, sources.personaRefs);
        }
        addSection('user', 'User', [
            sources.userText,
            contextMode === 'persona' ? normalizeText(interactionPreferences) : ''
        ].filter(Boolean).join('\n\n'), sources.userRefs);
        if (contextMode === 'persona') {
            addSection('relationship', 'Relationship', [
                sources.relationshipText,
                sources.affinityText
            ].filter(Boolean).join('\n\n'), sources.relationshipRefs);
        }
        addSection('project', 'Project', sources.projectText, sources.projectRefs);
        addSection('relevant_memories', 'Relevant Memories', [
            sources.relevantMemoriesText,
            normalizeText(explicitMemoryContext)
        ].filter(Boolean).join('\n\n'), sources.relevantMemoryRefs);
        addSection('secret_index', 'Secret Index', sources.secretIndexText, sources.secretRefs);
        if (contextMode === 'persona') {
            addSection('current_task', 'Current Task', activeTaskState, sources.activeTaskRefs);
        }

        return new MemoryContext({
            contextMode,
            sections,
            budgets,
            diagnostics: {
                sessionId: String(sessionId || 'main'),
                retrievalQueryChars: Number(sources.retrievalQueryChars) || 0,
                relevantMemoryCount: Number(sources.relevantMemoryCount) || 0,
                sectionCount: sections.length,
                scaledForMaxChars: scale < 1,
                maxChars: Number(maxChars) || 0
            }
        });
    }
}

module.exports = {
    AILISContextCompiler,
    CHARS_PER_TOKEN,
    DEFAULT_SECTION_BUDGETS,
    MEMORY_CONTEXT_SCHEMA,
    MemoryContext,
    truncateByCompleteLines
};
