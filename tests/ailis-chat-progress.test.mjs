import assert from 'node:assert/strict';
import test from 'node:test';

import {
    createEmbodiedCommandPayload,
    AILISDesktopChatService,
    createGatewayProgressBridge
} from '../src/ailis-chat-service.js';

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

test('assistant chat routes short dance request to embodied command before gateway', async () => {
    const previousWindow = globalThis.window;
    let gatewayCalled = false;
    globalThis.window = {
        ailisDesktop: {
            gateway: {
                isSupported: true,
                async getStatus() {
                    gatewayCalled = true;
                    return { running: true };
                },
                async runAgent() {
                    gatewayCalled = true;
                    return { ok: true };
                }
            }
        }
    };

    try {
        const service = new AILISDesktopChatService();
        const payload = await service.fetchAssistantTurn({
            sessionId: 'main',
            messageHistory: [{ role: 'user', content: '跳舞' }],
            replyMode: 'text_only'
        });

        assert.equal(gatewayCalled, false);
        assert.equal(payload.action, 'dance');
        assert.equal(payload.expression, 'happy');
        assert.equal(payload.surface.gestureIntent, 'dance');
        assert.equal(payload.surface.taskState, 'happy_success');
    } finally {
        if (previousWindow === undefined) {
            delete globalThis.window;
        } else {
            globalThis.window = previousWindow;
        }
    }
});

test('assistant embodied command parser does not steal task-like dance requests', () => {
    assert.equal(createEmbodiedCommandPayload('帮我写一个跳舞脚本'), null);
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
    assert.equal(outputs[0].surface.renderer, 'ailis-progress-surface');
    assert.equal(outputs[0].surface.traceVisible, true);
    assert.doesNotMatch(outputs[0].display_text, /第 \d+|进度|tool|Evidence|TaskSpec|update_plan/);
});

test('chat progress bridge shows model progress notes', () => {
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
            runId: 'run-progress-note',
            sessionId: 'main'
        }
    });
    fake.emit({
        type: 'agent.progress.note',
        payload: {
            runId: 'run-progress-note',
            text: '我已经确认问题出在大文件读取链路，接下来会只查关键片段。',
            source: 'model_tool_progress_note'
        }
    });

    assert.equal(outputs.length, 1);
    assert.match(outputs[0].display_text, /大文件读取链路/);
    assert.equal(outputs[0].surface.source, 'persona_progress_surface');
});

test('chat progress bridge does not invent failure wording without a model note', () => {
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
            runId: 'run-failed-step',
            sessionId: 'main'
        }
    });
    fake.emit({
        type: 'agent.step.finished',
        payload: {
            runId: 'run-failed-step',
            tool: 'exec',
            ok: false,
            status: 'failed'
        }
    });

    assert.equal(outputs.length, 0);
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

test('desktop chat service keeps newer active run when an older run finishes later', async () => {
    const previousWindow = globalThis.window;
    let listener = null;
    let resolveFirstRun;
    let resolveSecondRun;
    const firstRunDone = new Promise((resolve) => {
        resolveFirstRun = resolve;
    });
    const secondRunDone = new Promise((resolve) => {
        resolveSecondRun = resolve;
    });

    globalThis.window = {
        ailisDesktop: {
            gateway: {
                isSupported: true,
                onEvent(callback) {
                    listener = callback;
                    return () => {};
                },
                async getStatus() {
                    return {
                        running: true,
                        workspaceRoot: 'F:/AILIS_self_evolution_runtime'
                    };
                },
                async runAgent({ message }) {
                    if (message === 'old') {
                        listener?.({
                            type: 'agent.run.started',
                            payload: {
                                runId: 'old-run',
                                sessionId: 'main'
                            }
                        });
                        await firstRunDone;
                        return {
                            ok: true,
                            displayText: 'old done'
                        };
                    }
                    listener?.({
                        type: 'agent.run.started',
                        payload: {
                            runId: 'new-run',
                            sessionId: 'main'
                        }
                    });
                    await secondRunDone;
                    return {
                        ok: true,
                        displayText: 'new done'
                    };
                }
            }
        }
    };

    try {
        const service = new AILISDesktopChatService();
        const oldPromise = service.fetchAssistantTurn({
            sessionId: 'main',
            messageHistory: [{ role: 'user', content: 'old' }],
            onProgress() {}
        });
        await new Promise((resolve) => setTimeout(resolve, 0));
        assert.equal(service.activeRunId, 'old-run');

        const newPromise = service.fetchAssistantTurn({
            sessionId: 'main',
            messageHistory: [{ role: 'user', content: 'new' }],
            onProgress() {}
        });
        await new Promise((resolve) => setTimeout(resolve, 0));
        assert.equal(service.activeRunId, 'new-run');

        resolveFirstRun();
        await oldPromise;
        assert.equal(service.activeRunId, 'new-run');

        resolveSecondRun();
        await newPromise;
        assert.equal(service.activeRunId, '');
    } finally {
        if (previousWindow === undefined) {
            delete globalThis.window;
        } else {
            globalThis.window = previousWindow;
        }
    }
});
