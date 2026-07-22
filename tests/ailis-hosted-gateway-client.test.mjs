import assert from 'node:assert/strict';
import test from 'node:test';

import {
    AILISHostedGatewayClient,
    readAgentRunEventStream
} from '../src/ailis-hosted-gateway-client.js';

function createEventStreamResponse(chunks) {
    const encoder = new TextEncoder();
    return new Response(new ReadableStream({
        start(controller) {
            for (const chunk of chunks) {
                controller.enqueue(encoder.encode(chunk));
            }
            controller.close();
        }
    }), {
        headers: { 'content-type': 'text/event-stream; charset=utf-8' }
    });
}

test('hosted gateway parser delivers answer deltas and returns the final Agent result', async () => {
    const response = createEventStreamResponse([
        'event: response.started\ndata: {"sequence":0}\n\n',
        'event: response.output_text.started\ndata: {"sequence":1,"streamId":"call-1"}\n\n',
        'event: response.output_text.delta\ndata: {"sequence":2,"delta":"你好","metadata":{"streamId":"call-1"}}\n\n',
        'event: response.output_text.delta\ndata: {"sequence":3,"delta":" 呀","metadata":{"streamId":"call-1"}}\n\n',
        'event: response.output_text.committed\ndata: {"sequence":4,"streamId":"call-1"}\n\n',
        'event: response.completed\ndata: {"sequence":5,"result":{"ok":true,"displayText":"你好 呀"}}\n\n'
    ]);
    const deltas = [];
    const streamEvents = [];

    const result = await readAgentRunEventStream(response, {
        onTextDelta: (delta) => deltas.push(delta),
        onTextStreamEvent: (event, payload) => streamEvents.push({ event, streamId: payload.streamId })
    });

    assert.deepEqual(deltas, ['你好', ' 呀']);
    assert.deepEqual(streamEvents, [
        { event: 'response.output_text.started', streamId: 'call-1' },
        { event: 'response.output_text.committed', streamId: 'call-1' }
    ]);
    assert.deepEqual(result, { ok: true, displayText: '你好 呀' });
});

test('hosted gateway caches status for the active web session until expiry', async () => {
    globalThis.window = {
        localStorage: {
            getItem: () => '',
            setItem: () => {},
            removeItem: () => {}
        },
        setTimeout,
        clearTimeout
    };
    const client = new AILISHostedGatewayClient({
        baseUrl: 'https://example.test',
        statusCacheTtlMs: 60000
    });
    client.sessionId = 'session-1';
    client.sessionToken = 'token-1';
    let statusCalls = 0;
    client.request = async () => {
        statusCalls += 1;
        return { ok: true, running: true, workspaceRoot: '/workspace' };
    };

    const first = await client.getStatus();
    const second = await client.getStatus();
    assert.equal(statusCalls, 1);
    assert.equal(first, second);

    client.statusCache.expiresAt = 0;
    await client.getStatus();
    assert.equal(statusCalls, 2);
});
