import assert from 'node:assert/strict';
import test from 'node:test';

import { ProactiveCompanionManager } from '../src/proactive-companion-manager.js';
import {
    AILISDesktopChatService,
    buildProactiveCompanionHeartbeatDeveloperMessage,
    buildProactiveOpportunitySystemPrompt
} from '../src/ailis-chat-service.js';

function installBrowserState({ hidden = false } = {}) {
    const values = new Map();
    globalThis.document = { hidden };
    globalThis.localStorage = {
        getItem: (key) => values.get(key) || null,
        setItem: (key, value) => values.set(key, String(value))
    };
}

function createManager({
    mode = 'companion',
    hidden = false,
    chatState = {},
    requestCompanionTurn = async () => ({ shouldSpeak: false, reasonType: 'generation_failed' }),
    requestOpportunity = async () => ({ shouldSpeak: false, reasonType: 'not_enough_reason' }),
    onSpeak = async () => ({ ok: true })
} = {}) {
    installBrowserState({ hidden });
    const scheduled = [];
    const logs = [];
    const manager = new ProactiveCompanionManager({
        getConfig: () => ({
            AUTO_CHAT_ENABLED: ['companion', 'cowork'].includes(mode),
            AUTO_CHAT_MODE: mode,
            AUTO_CHAT_MIN_INTERVAL: 100_000,
            AUTO_CHAT_MAX_INTERVAL: 100_000
        }),
        getChatState: () => ({
            isBusy: false,
            userTyping: false,
            inputDisabled: false,
            voicePlaying: false,
            messageHistory: [],
            ...chatState
        }),
        requestCompanionTurn,
        requestOpportunity,
        onSpeak,
        logger: {
            log: (...args) => logs.push(args),
            warn: (...args) => logs.push(args)
        },
        setTimeoutFn: (callback, delayMs) => {
            scheduled.push({ callback, delayMs });
            return scheduled.length;
        },
        clearTimeoutFn: () => {}
    });
    return { manager, scheduled, logs };
}

test('start without an explicit delay uses the configured interval instead of one second', () => {
    const { manager, scheduled } = createManager({ mode: 'cowork' });

    manager.start('startup');

    assert.equal(scheduled.length, 1);
    assert.equal(scheduled[0].delayMs, 100_000);
});

test('companion mode speaks every twenty seconds regardless of model cooldown', () => {
    const { manager } = createManager({ mode: 'companion' });

    assert.equal(manager.getNextDelay('idle'), 20_000);
    assert.equal(manager.getNextDelay('assistant_turn'), 20_000);
    assert.equal(manager.getNextDelay('spoke', { cooldownSec: 3600 }), 20_000);
});

test('companion mode leaves recency and daily speak limits to the model', () => {
    const { manager } = createManager({ mode: 'companion' });
    const now = Date.now();
    manager.state.lastUserTurnAt = now - 1000;
    manager.state.lastAssistantTurnAt = now - 1000;
    manager.state.checksToday = 30;
    manager.state.speaksToday = 5;

    const gate = manager.hardGate(manager.buildDecisionContext(now));

    assert.equal(gate.ok, true);
});

test('window visibility is context for the model, not a hard silence gate', () => {
    const { manager } = createManager({ hidden: true });

    const context = manager.buildDecisionContext();
    const gate = manager.hardGate(context);

    assert.equal(context.interactionState.appVisible, false);
    assert.equal(gate.ok, true);
});

test('decision context carries the selected proactive mode and message metadata', () => {
    const { manager } = createManager({
        mode: 'cowork',
        chatState: {
            messageHistory: [{
                role: 'assistant',
                content: '任务刚刚完成。',
                source: 'agent',
                createdAt: '2026-07-16T10:00:00.000Z'
            }]
        }
    });

    const context = manager.buildDecisionContext();

    assert.equal(context.proactivity.mode, 'cowork');
    assert.deepEqual(context.recentContext.lastVisibleTurns[0], {
        role: 'assistant',
        text: '任务刚刚完成。',
        source: 'agent',
        createdAt: '2026-07-16T10:00:00.000Z'
    });
});

test('opportunity prompt is limited to work-mode feedback decisions', () => {
    const prompt = buildProactiveOpportunitySystemPrompt();

    assert.match(prompt, /工作模式/);
    assert.doesNotMatch(prompt, /companion：/);
    assert.match(prompt, /appVisible/);
    assert.doesNotMatch(prompt, /"text"/);
    assert.match(prompt, /不要撰写最终用户可见回复/);
});

test('companion heartbeat is a minimal ephemeral developer event', () => {
    const prompt = buildProactiveCompanionHeartbeatDeveloperMessage([
        { role: 'user', content: '我们继续聊发布流程。' },
        { role: 'assistant', content: '好，我们先看线上状态。' }
    ]);

    assert.match(prompt, /runtime event, not a user message/);
    assert.match(prompt, /same AILIS persona, memory, and conversation context/);
    assert.match(prompt, /has not sent a new message/);
    assert.match(prompt, /Take the initiative/);
    assert.doesNotMatch(prompt, /topic_followup|soft_checkin|userTurnAfterLastProactive|JSON/);
});

test('work-mode approved opportunity delivers through the unified main Session', async () => {
    const calls = [];
    const agentCalls = [];
    globalThis.window = {
        ailisDesktop: {
            gateway: {
                isSupported: true,
                getStatus: async () => ({ running: true, workspaceRoot: '/test-workspace' }),
                runAgent: async (payload) => {
                    agentCalls.push(payload);
                    return { ok: true, model: 'reply-model', displayText: '刚才你说想把发布流程再理一遍，我陪你从部署状态接着看。' };
                }
            },
            llm: {
                chat: async (payload) => {
                    calls.push(payload);
                    if (calls.length === 1) {
                        return {
                            ok: true,
                            model: 'decision-model',
                            content: JSON.stringify({
                                shouldSpeak: true,
                                intent: 'topic_followup',
                                emotion: 'curious',
                                cooldownSec: 600,
                                reasonType: 'recent_context_followup'
                            })
                        };
                    }
                    throw new Error('No separate Persona reply call');
                }
            }
        }
    };
    const service = new AILISDesktopChatService();
    const history = [
        { role: 'user', content: '发布流程好像还有点乱。', source: '' },
        { role: 'assistant', content: '我们已经把构建通过了，接下来要核对部署状态。', source: '' },
        { role: 'assistant', content: '要继续吗？', source: 'proactive_companion' }
    ];

    const opportunity = await service.evaluateProactiveOpportunity({
        sessionId: 'proactive-test',
        messageHistory: history,
        context: {
            proactivity: { mode: 'cowork' }
        }
    });

    assert.equal(calls.length, 1);
    assert.equal(calls[0].jsonMode, true);
    assert.equal(agentCalls.length, 1);
    assert.equal(agentCalls[0].context.agentRole, 'unified_agent');
    assert.equal(agentCalls[0].sessionId, 'proactive-test');
    assert.equal(agentCalls[0].suppressCurrentUserMessage, true);
    assert.deepEqual(agentCalls[0].messageHistory, history);
    assert.equal(opportunity.payload.display_text, '刚才你说想把发布流程再理一遍，我陪你从部署状态接着看。');
    assert.equal(opportunity.payload.proactiveCompanion.decisionModel, 'decision-model');
    assert.equal(opportunity.payload.proactiveCompanion.replyModel, 'reply-model');
});

test('work-mode rejected opportunity never calls the persona reply generator', async () => {
    const calls = [];
    globalThis.window = {
        ailisDesktop: {
            gateway: {},
            llm: {
                chat: async (payload) => {
                    calls.push(payload);
                    return {
                        ok: true,
                        content: JSON.stringify({
                            shouldSpeak: false,
                            intent: 'quiet_presence',
                            emotion: 'relaxed',
                            cooldownSec: 600,
                            reasonType: 'not_enough_reason'
                        })
                    };
                }
            }
        }
    };
    const service = new AILISDesktopChatService();

    const opportunity = await service.evaluateProactiveOpportunity({
        messageHistory: [{ role: 'user', content: '先这样吧。' }],
        context: { proactivity: { mode: 'cowork' } }
    });

    assert.equal(calls.length, 1);
    assert.equal(opportunity.shouldSpeak, false);
});

test('work-mode decision keeps old user context through a long tail of proactive messages', async () => {
    const calls = [];
    globalThis.window = {
        ailisDesktop: {
            gateway: {},
            llm: {
                chat: async (payload) => {
                    calls.push(payload);
                    return {
                        ok: true,
                        content: JSON.stringify({
                            shouldSpeak: false,
                            intent: 'quiet_presence',
                            emotion: 'relaxed',
                            cooldownSec: 600,
                            reasonType: 'not_enough_reason'
                        })
                    };
                }
            }
        }
    };
    const service = new AILISDesktopChatService();
    const history = [
        { role: 'user', content: '我们刚才在讨论 Render 部署。' },
        { role: 'assistant', content: '构建已经通过，下一步要核对线上状态。' },
        ...Array.from({ length: 14 }, (_, index) => ({
            role: 'assistant',
            content: `主动消息 ${index + 1}`,
            source: 'proactive_companion'
        }))
    ];

    await service.evaluateProactiveOpportunity({
        messageHistory: history,
        context: { proactivity: { mode: 'cowork' } }
    });

    const decisionContext = JSON.parse(calls[0].messages.at(-1).content);
    assert.equal(
        decisionContext.recentContext.lastVisibleTurns.some(
            (message) => message.role === 'user' && message.text.includes('Render 部署')
        ),
        true
    );
    assert.equal(
        decisionContext.recentContext.lastVisibleTurns.some(
            (message) => message.role === 'assistant' && message.text.includes('线上状态')
        ),
        true
    );
});

test('companion mode directly generates one contextual reply without an opportunity judgment', async () => {
    const calls = [];
    globalThis.window = {
        ailisDesktop: {
            gateway: {
                isSupported: true,
                getStatus: async () => ({
                    running: true,
                    workspaceRoot: 'F:\\AILIS_self_evolution_runtime'
                }),
                runAgent: async (payload) => {
                    calls.push(payload);
                    return {
                        ok: true,
                        model: 'companion-model',
                        displayText: '刚才我们在整理发布流程，我继续陪你看线上状态。',
                        speechText: '刚才我们在整理发布流程，我继续陪你看线上状态。'
                    };
                }
            }
        }
    };
    const service = new AILISDesktopChatService();
    const history = [
        { role: 'user', content: '发布流程好像还有点乱。' },
        { role: 'assistant', content: '构建已经通过，下一步要核对线上状态。' }
    ];

    const turn = await service.createProactiveCompanionTurn({
        sessionId: 'companion-test',
        messageHistory: history,
        context: {
            nowIso: '2026-07-17T06:00:00.000Z',
            proactivity: { mode: 'companion' },
            interactionState: {
                appVisible: true,
                lastUserMessageAgeMs: 4000,
                lastAssistantMessageAgeMs: 2000,
                lastProactiveAgeMs: 20_000
            }
        }
    });

    assert.equal(calls.length, 1);
    assert.equal(calls[0].context.agentRole, 'unified_agent');
    assert.equal(calls[0].suppressCurrentUserMessage, true);
    assert.deepEqual(calls[0].messageHistory, history);
    assert.match(calls[0].ephemeralDeveloperMessage, /runtime event, not a user message/);
    assert.equal(calls[0].context.unifiedAgent, true);
    assert.equal(calls[0].context.suppressCurrentUserMessage, true);
    assert.equal(turn.shouldSpeak, true);
    assert.equal(turn.reasonType, 'companion_cycle');
    assert.equal('intent' in turn, false);
    assert.equal('emotion' in turn, false);
    assert.equal(turn.payload.display_text, '刚才我们在整理发布流程，我继续陪你看线上状态。');
    assert.equal(turn.payload.expression, null);
    assert.equal(turn.payload.surface, null);
    assert.equal(turn.payload.proactiveCompanion.replyModel, 'companion-model');
});

test('companion heartbeat preserves the ordinary chat history instead of building a special context', async () => {
    const calls = [];
    globalThis.window = {
        ailisDesktop: {
            gateway: {
                isSupported: true,
                getStatus: async () => ({
                    running: true,
                    workspaceRoot: 'F:\\AILIS_self_evolution_runtime'
                }),
                runAgent: async (payload) => {
                    calls.push(payload);
                    return {
                        ok: true,
                        displayText: '这一轮会从上一段继续推进，而不是重新开场。'
                    };
                }
            }
        }
    };
    const service = new AILISDesktopChatService();
    const history = [
        { role: 'user', content: '我们聊聊下周的安排。' },
        { role: 'assistant', content: '可以，我们先从最重要的目标开始。' },
        ...Array.from({ length: 8 }, (_, index) => ({
            role: 'assistant',
            content: `主动内容 ${index + 1}`,
            source: 'proactive_companion'
        }))
    ];

    await service.createProactiveCompanionTurn({
        messageHistory: history,
        context: { proactivity: { mode: 'companion' } }
    });

    assert.deepEqual(calls[0].messageHistory, history);
    assert.match(calls[0].ephemeralDeveloperMessage, /9 assistant response\(s\)/);
    assert.equal(calls[0].message, '我们聊聊下周的安排。');
});

test('companion manager uses the direct generation path instead of the work-mode judge', async () => {
    let companionCalls = 0;
    let opportunityCalls = 0;
    const { manager, scheduled } = createManager({
        requestCompanionTurn: async () => {
            companionCalls += 1;
            return {
                shouldSpeak: true,
                reasonType: 'companion_cycle',
                payload: { display_text: '我继续陪你聊刚才的话题。' }
            };
        },
        requestOpportunity: async () => {
            opportunityCalls += 1;
            return { shouldSpeak: false };
        }
    });

    await manager.tick('timer');

    assert.equal(companionCalls, 1);
    assert.equal(opportunityCalls, 0);
    assert.equal(manager.state.speaksToday, 1);
    assert.equal(scheduled.at(-1).delayMs, 20_000);
});

test('a failed delivery is not counted as a proactive message', async () => {
    const { manager, scheduled } = createManager({
        requestCompanionTurn: async () => ({
            shouldSpeak: true,
            reasonType: 'companion_cycle',
            cooldownSec: 20,
            payload: { display_text: '还想继续刚才的话题吗？' }
        }),
        onSpeak: async () => ({ ok: false, reason: 'delivery_failed' })
    });

    await manager.tick('timer');

    assert.equal(manager.state.speaksToday, 0);
    assert.equal(manager.state.lastDecision.shouldSpeak, false);
    assert.equal(manager.state.lastDecision.reason, 'delivery_failed');
    assert.equal(scheduled.at(-1).delayMs, 100_000);
});
