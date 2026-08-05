import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import test from 'node:test';

const require = createRequire(import.meta.url);
const {
    AILISContextCompiler,
    MemoryContext
} = require('../electron/ailis-context-compiler.cjs');
const {
    buildModelInput,
    buildModelInputContextManager,
    responseItemsToChatMessages
} = require('../electron/ailis-model-input-builder.cjs');

function createMemoryRuntime(overrides = {}) {
    return {
        getContextSources() {
            return {
                personaText: '- persona identity',
                userText: '- stable user preference',
                relationshipText: '- relationship boundary',
                affinityText: '- relationship stage: trusted',
                projectText: '- active project architecture',
                relevantMemoriesText: '- relevant evidence-backed memory',
                secretIndexText: '- configured secret name only',
                relevantMemoryRefs: ['memory-event-1'],
                relevantMemoryCount: 1,
                retrievalQueryChars: 42,
                ...overrides
            };
        }
    };
}

test('ContextCompiler builds separately budgeted Persona, User, Relationship, Project, and Relevant Memories sections', () => {
    const longUserText = Array.from({ length: 40 }, (_, index) => `- user-line-${String(index).padStart(2, '0')} complete fact`).join('\n');
    const compiler = new AILISContextCompiler({
        memoryRuntime: createMemoryRuntime({ userText: longUserText })
    });
    const context = compiler.compile({
        sessionId: 'persona-session',
        currentUserMessage: 'current instruction',
        agentMode: 'persona',
        sectionBudgets: { user: 50 }
    });

    assert.ok(context instanceof MemoryContext);
    assert.equal(context.schema, 'ailis.memory_context.v1');
    assert.deepEqual(
        context.sections.slice(0, 5).map((section) => section.id),
        ['persona', 'user', 'relationship', 'project', 'relevant_memories']
    );
    const user = context.sections.find((section) => section.id === 'user');
    assert.equal(user.budgetTokens, 50);
    assert.equal(user.truncated, true);
    assert.match(user.text, /user-line-00 complete fact/);
    assert.match(user.text, /section truncated by ContextCompiler budget/);
    assert.doesNotMatch(user.text, /user-line-39/);
    assert.ok(user.text.length <= 200);
});

test('ContextCompiler passes a structured RetrievalRequest to the memory runtime', () => {
    let captured = null;
    const compiler = new AILISContextCompiler({
        memoryRuntime: {
            getContextSources(input) {
                captured = input;
                return createMemoryRuntime().getContextSources();
            }
        }
    });
    const retrievalRequest = {
        query: 'the retrieval-only question',
        referenceTime: '2026-08-04T00:00:00.000Z',
        source: 'test_adapter'
    };

    compiler.compile({
        sessionId: 'retrieval-session',
        currentUserMessage: 'a longer model-facing instruction',
        sessionRecentTurns: [{ role: 'user', content: 'old visible turn' }],
        retrievalRequest
    });

    assert.equal(captured.message, 'a longer model-facing instruction');
    assert.deepEqual(captured.retrievalRequest, retrievalRequest);
});

test('ContextCompiler keeps Persona-only memory out of TaskAgent context', () => {
    const compiler = new AILISContextCompiler({ memoryRuntime: createMemoryRuntime() });
    const context = compiler.compile({
        currentUserMessage: 'execute the task',
        sessionRecentTurns: [{ role: 'user', content: 'prior visible turn' }],
        activeTaskState: 'persona active task state',
        interactionPreferences: 'temporary relationship nickname',
        agentMode: 'task_agent'
    });
    const ids = context.sections.map((section) => section.id);

    assert.equal(ids.includes('persona'), false);
    assert.equal(ids.includes('relationship'), false);
    assert.equal(ids.includes('current_task'), false);
    assert.equal(ids.includes('user'), true);
    assert.equal(ids.includes('project'), true);
    assert.equal(ids.includes('relevant_memories'), true);
    assert.doesNotMatch(context.asDeveloperInstruction(), /temporary relationship nickname/);
});

test('ContextCompiler scales all section budgets to a bounded model-visible envelope', () => {
    const longText = Array.from({ length: 300 }, (_, index) => `- complete-line-${index} ${'x'.repeat(40)}`).join('\n');
    const compiler = new AILISContextCompiler({
        memoryRuntime: createMemoryRuntime({
            personaText: longText,
            userText: longText,
            relationshipText: longText,
            affinityText: longText,
            projectText: longText,
            relevantMemoriesText: longText,
            secretIndexText: longText
        })
    });
    const context = compiler.compile({
        currentUserMessage: 'bounded context',
        activeTaskState: longText,
        agentMode: 'persona',
        maxChars: 4000
    });

    assert.equal(context.diagnostics.scaledForMaxChars, true);
    assert.ok(context.asDeveloperInstruction().length <= 4000);
    assert.ok(context.sections.every((section) => section.approxTokens <= section.budgetTokens));
});

test('model input exposes compiled memory as a developer ResponseItem and keeps the current user message once', () => {
    const compiler = new AILISContextCompiler({ memoryRuntime: createMemoryRuntime() });
    const memoryContext = compiler.compile({
        currentUserMessage: 'CURRENT_USER_TASK',
        agentMode: 'persona'
    });
    const input = buildModelInput({
        message: 'CURRENT_USER_TASK',
        messageHistory: [
            { role: 'user', content: 'earlier question' },
            { role: 'assistant', content: 'earlier answer' },
            { role: 'user', content: 'CURRENT_USER_TASK' }
        ],
        memoryContext,
        runtimeEnvironment: { current_date: '2026-07-17' }
    });

    assert.equal(input[0].type, 'message');
    assert.equal(input[0].role, 'developer');
    assert.match(input[0].content[0].text, /<memory_context>/);
    const contextItem = input.find((item) => item.role === 'user' && /"type":"context"/.test(item.content?.[0]?.text || ''));
    assert.ok(contextItem);
    assert.doesNotMatch(contextItem.content[0].text, /memory_context/);
    const allText = input
        .filter((item) => item.type === 'message')
        .flatMap((item) => item.content || [])
        .map((part) => part.text || '')
        .join('\n');
    assert.equal(allText.split('CURRENT_USER_TASK').length - 1, 1);

    const messages = responseItemsToChatMessages({ instructions: 'base', input });
    assert.equal(messages[1].role, 'developer');
});

test('semantic compaction preserves both developer memory and runtime attachment context', () => {
    const contextManager = buildModelInputContextManager({
        message: 'continue',
        memoryContext: new MemoryContext({
            sections: [{ id: 'user', label: 'User', text: '- durable preference' }]
        }),
        fileAttachments: [{ path: 'F:\\workspace\\fixture.xlsx' }]
    });
    const compacted = contextManager.buildSemanticCompactedItem({
        contextMode: 'persona',
        goal: 'continue'
    });
    const messages = compacted.replacement_history.filter((item) => item.type === 'message');

    assert.ok(messages.some((item) => item.role === 'developer' && /durable preference/.test(item.content[0].text)));
    assert.ok(messages.some((item) => item.role === 'user' && /attached_files/.test(item.content[0].text)));
});
