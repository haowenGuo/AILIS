import assert from 'node:assert/strict';
import test from 'node:test';

import { createGatewayProgressBridge } from '../src/humanclaw-chat-service.js';

function createFakeGateway() {
    let listener = null;
    return {
        gateway: {
            onEvent(callback) {
                listener = callback;
                return () => {
                    listener = null;
                };
            }
        },
        emit(event) {
            listener?.(event);
        }
    };
}

test('chat progress bridge stays silent for ordinary run start events', () => {
    const fake = createFakeGateway();
    const outputs = [];
    const unsubscribe = createGatewayProgressBridge({
        gateway: fake.gateway,
        sessionId: 'main',
        onProgress: (payload) => outputs.push(payload)
    });

    fake.emit({
        type: 'agent.run.started',
        payload: {
            runId: 'run-1',
            sessionId: 'main',
            mode: 'llm-agentic-executor',
            intent: 'llm_agent'
        }
    });

    assert.equal(outputs.length, 0);
    unsubscribe();
});

test('chat progress bridge stays silent until reasoning arrives for a task run', () => {
    const fake = createFakeGateway();
    const outputs = [];
    createGatewayProgressBridge({
        gateway: fake.gateway,
        sessionId: 'main',
        onProgress: (payload) => outputs.push(payload)
    });

    fake.emit({
        type: 'agent.run.started',
        payload: {
            runId: 'run-task',
            sessionId: 'main',
            mode: 'task',
            executionRequired: true,
            stepCount: 2
        }
    });

    assert.equal(outputs.length, 0);
});

test('chat progress bridge shows public reasoning instead of tool-start templates', () => {
    const fake = createFakeGateway();
    const outputs = [];
    createGatewayProgressBridge({
        gateway: fake.gateway,
        sessionId: 'main',
        onProgress: (payload) => outputs.push(payload)
    });

    fake.emit({
        type: 'agent.run.started',
        payload: {
            runId: 'run-2',
            sessionId: 'main'
        }
    });
    fake.emit({
        type: 'agent.step.started',
        payload: {
            runId: 'run-2',
            tool: 'update_plan',
            title: '内部计划更新'
        }
    });
    assert.equal(outputs.length, 0);

    fake.emit({
        type: 'agent.reasoning.delta',
        payload: {
            runId: 'run-2',
            text: '我先读取 note.txt，确认里面有没有可以直接引用的内容。'
        }
    });
    fake.emit({
        type: 'agent.step.started',
        payload: {
            runId: 'run-2',
            tool: 'read',
            title: '读取 note.txt'
        }
    });

    assert.equal(outputs.length, 1);
    assert.match(outputs[0].display_text, /读取 note\.txt/);
    assert.equal(outputs[0].surface.renderer, 'aigl-progress-surface');
    assert.equal(outputs[0].surface.traceVisible, true);
    assert.doesNotMatch(outputs[0].display_text, /第 \d+|进度|tool|Evidence|TaskSpec|update_plan/);
});

test('chat progress bridge ignores low-information computer starts without reasoning', () => {
    const fake = createFakeGateway();
    const outputs = [];
    createGatewayProgressBridge({
        gateway: fake.gateway,
        sessionId: 'main',
        onProgress: (payload) => outputs.push(payload)
    });

    fake.emit({
        type: 'agent.run.started',
        payload: {
            runId: 'run-computer',
            sessionId: 'main'
        }
    });
    fake.emit({
        type: 'agent.step.started',
        payload: {
            runId: 'run-computer',
            tool: 'computer',
            title: '看本机状态'
        }
    });
    fake.emit({
        type: 'agent.step.started',
        payload: {
            runId: 'run-computer',
            tool: 'computer',
            title: '看本机状态'
        }
    });

    assert.equal(outputs.length, 0);
});
