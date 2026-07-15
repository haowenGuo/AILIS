import assert from 'node:assert/strict';
import test from 'node:test';

import {
    buildOpenAiAssistantMessage,
    buildOpenAiChatResponse,
    buildProviderPayload,
    validateFcChatRequest
} from '../scripts/serve-ailis-agentbench-fc.mjs';

test('FC bridge preserves official messages, schemas, and tool choice', () => {
    const messages = [
        { role: 'system', content: 'Use tools.' },
        { role: 'user', content: 'Inspect the database.' },
        {
            role: 'assistant',
            content: null,
            tool_calls: [{
                id: 'call_previous',
                type: 'function',
                function: { name: 'execute_sql', arguments: '{"query":"SHOW TABLES"}' }
            }]
        },
        { role: 'tool', tool_call_id: 'call_previous', content: '[["items"]]' }
    ];
    const tools = [{
        type: 'function',
        function: {
            name: 'execute_sql',
            description: 'Execute SQL.',
            parameters: {
                type: 'object',
                additionalProperties: false,
                properties: { query: { type: 'string' } },
                required: ['query']
            }
        }
    }];
    const payload = buildProviderPayload({ messages, tools, tool_choice: 'auto' }, { temperature: 0.8, timeoutMs: 10_000 });
    assert.equal(payload.messages, messages);
    assert.equal(payload.tools, tools);
    assert.equal(payload.tool_choice, 'auto');
    assert.equal(Object.hasOwn(payload, 'parallel_tool_calls'), false);
});

test('FC bridge returns native OpenAI tool_calls without prose conversion', () => {
    const message = buildOpenAiAssistantMessage({
        content: '',
        toolCalls: [{
            id: 'call_123',
            name: 'execute_sql',
            arguments: { query: 'SELECT COUNT(*) FROM items' },
            rawArguments: '{"query":"SELECT COUNT(*) FROM items"}'
        }],
        providerMessage: { reasoning_content: 'Need the count.' }
    }, () => 'fixed');
    assert.deepEqual(message, {
        role: 'assistant',
        content: '',
        tool_calls: [{
            id: 'call_123',
            type: 'function',
            function: {
                name: 'execute_sql',
                arguments: '{"query":"SELECT COUNT(*) FROM items"}'
            }
        }],
        reasoning_content: 'Need the count.'
    });
});

test('FC bridge emits OpenAI completion metadata and usage', () => {
    const response = buildOpenAiChatResponse({
        model: 'test-model',
        content: 'finished',
        usage: { promptTokens: 10, completionTokens: 2, totalTokens: 12 }
    }, () => 'fixed');
    assert.equal(response.id, 'chatcmpl-fixed');
    assert.equal(response.choices[0].finish_reason, 'stop');
    assert.deepEqual(response.usage, { prompt_tokens: 10, completion_tokens: 2, total_tokens: 12 });
});

test('FC bridge rejects requests that drop official function schemas', () => {
    assert.throws(() => validateFcChatRequest({ messages: [{ role: 'user', content: 'x' }], tools: [] }), /tools is required/);
    assert.throws(() => validateFcChatRequest({ messages: [], tools: [{}] }), /messages is required/);
});
