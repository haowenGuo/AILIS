const { randomUUID } = require('crypto');
const { callDesktopLlmProvider } = require('./desktop-llm-provider.cjs');
const { validateAgainstSchema } = require('./ailis-tool-contracts.cjs');
const { AIGAME3WorldMemoryProvider } = require('./ailis-external-memory-provider.cjs');

const WORLD_COMPANION_RESULT_TOOL = 'world_companion_result';
const ACTION_KINDS = ['look_at', 'move_to', 'follow', 'sit', 'stop', 'lead_to', 'interact'];
const EMOTIONS = ['neutral', 'happy', 'sad', 'surprised', 'concerned', 'curious', 'thinking', 'calm'];
const GESTURES = ['none', 'greeting', 'agree', 'disagree', 'explain', 'invite', 'point', 'comfort', 'celebrate', 'think'];
const TASK_STATES = ['idle', 'listening', 'thinking', 'speaking', 'acting', 'interrupted'];

function normalizeText(value, fallback = '') {
    return typeof value === 'string' && value.trim() ? value.trim() : fallback;
}

function parseJsonObject(value) {
    if (value && typeof value === 'object' && !Array.isArray(value)) return value;
    const text = normalizeText(value);
    if (!text) return null;
    const unfenced = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
    try {
        const parsed = JSON.parse(unfenced);
        return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : null;
    } catch {
        const start = unfenced.indexOf('{');
        const end = unfenced.lastIndexOf('}');
        if (start < 0 || end <= start) return null;
        try {
            const parsed = JSON.parse(unfenced.slice(start, end + 1));
            return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : null;
        } catch {
            return null;
        }
    }
}

const PERSONA_SURFACE_SCHEMA = Object.freeze({
    type: 'object',
    additionalProperties: false,
    required: ['emotion', 'gestureIntent', 'gazeTarget', 'taskState', 'speechEnergy'],
    properties: {
        emotion: { type: 'string', enum: EMOTIONS },
        emotionIntensity: { type: 'number', minimum: 0, maximum: 1 },
        gestureIntent: { type: 'string', enum: GESTURES },
        gazeTarget: { type: 'string', minLength: 1, maxLength: 96 },
        taskState: { type: 'string', enum: TASK_STATES },
        speechEnergy: { type: 'number', minimum: 0, maximum: 1 },
        movementEnergy: { type: 'number', minimum: 0, maximum: 1 }
    }
});

const WORLD_ACTION_SCHEMA = Object.freeze({
    type: 'object',
    additionalProperties: false,
    required: ['actionId', 'kind'],
    properties: {
        actionId: { type: 'string', minLength: 1, maxLength: 96 },
        kind: { type: 'string', enum: ACTION_KINDS },
        targetId: { type: 'string', minLength: 1, maxLength: 128 },
        affordance: { type: 'string', minLength: 1, maxLength: 64 },
        style: { type: 'string', minLength: 1, maxLength: 64 },
        channel: { type: 'string', enum: ['gaze', 'locomotion', 'posture', 'interaction'] },
        after: { type: 'array', maxItems: 4, items: { type: 'string', minLength: 1, maxLength: 96 } },
        timeoutSeconds: { type: 'number', minimum: 0.1, maximum: 60 }
    }
});

const WORLD_MEMORY_CANDIDATE_SCHEMA = Object.freeze({
    type: 'object',
    additionalProperties: false,
    required: ['candidateId', 'summary', 'evidenceEventIds', 'salience'],
    properties: {
        candidateId: { type: 'string', minLength: 1, maxLength: 96 },
        summary: { type: 'string', minLength: 1, maxLength: 600 },
        evidenceEventIds: {
            type: 'array', minItems: 1, maxItems: 16,
            items: { type: 'string', minLength: 1, maxLength: 96 }
        },
        salience: { type: 'number', minimum: 0, maximum: 1 }
    }
});

const WORLD_COMPANION_RESULT_SCHEMA = Object.freeze({
    type: 'object',
    additionalProperties: false,
    required: [
        'schema', 'turnId', 'basedOnWorldRevision', 'displayText', 'speechText',
        'personaSurface', 'plan', 'worldMemoryCandidates'
    ],
    properties: {
        schema: { type: 'string', enum: ['aigame3.ailis_turn_result.v2'] },
        turnId: { type: 'string', minLength: 1, maxLength: 96 },
        basedOnWorldRevision: { type: 'integer', minimum: 0 },
        displayText: { type: 'string', maxLength: 4000 },
        speechText: { type: 'string', maxLength: 4000 },
        personaSurface: PERSONA_SURFACE_SCHEMA,
        plan: { type: 'array', maxItems: 5, items: WORLD_ACTION_SCHEMA },
        worldMemoryCandidates: { type: 'array', maxItems: 3, items: WORLD_MEMORY_CANDIDATE_SCHEMA }
    }
});

function buildWorldCompanionResultToolSpec() {
    return {
        name: WORLD_COMPANION_RESULT_TOOL,
        description: 'Return AILIS dialogue, embodied semantic surface, whitelisted proposed world actions, and evidence-linked shared-memory candidates. This is an output envelope, not an executable tool.',
        parameters: WORLD_COMPANION_RESULT_SCHEMA,
        strict: true
    };
}

function validateTurnEnvelope(turn = {}) {
    const errors = [];
    if (turn.schema !== 'aigame3.ailis_turn.v2') errors.push('$.schema must equal aigame3.ailis_turn.v2');
    for (const key of ['turnId', 'sessionId', 'memoryScope']) {
        if (!normalizeText(turn[key])) errors.push(`$.${key} is required`);
    }
    if (!['player', 'autonomy'].includes(turn.turnType)) errors.push('$.turnType is invalid');
    if (!normalizeText(turn?.userInput?.eventId)) errors.push('$.userInput.eventId is required');
    if (!turn.worldSnapshot || typeof turn.worldSnapshot !== 'object') errors.push('$.worldSnapshot is required');
    if (!Number.isInteger(turn?.worldSnapshot?.worldRevision) || turn.worldSnapshot.worldRevision < 0) {
        errors.push('$.worldSnapshot.worldRevision must be a non-negative integer');
    }
    if (!Array.isArray(turn?.worldSnapshot?.nearbyEntities)) errors.push('$.worldSnapshot.nearbyEntities must be an array');
    if (!Array.isArray(turn?.actionContract?.allowedActions)) errors.push('$.actionContract.allowedActions must be an array');
    return errors;
}

function validateWorldCompanionResult(result, turn) {
    const errors = validateAgainstSchema(result, WORLD_COMPANION_RESULT_SCHEMA);
    if (result?.turnId !== turn.turnId) errors.push('$.turnId must match the request turnId');
    if (result?.basedOnWorldRevision !== turn?.worldSnapshot?.worldRevision) {
        errors.push('$.basedOnWorldRevision must match the supplied world revision');
    }
    const allowedActions = new Set(turn?.actionContract?.allowedActions || []);
    const availableActions = new Set(turn?.worldSnapshot?.availableActions || []);
    const entities = new Map((turn?.worldSnapshot?.nearbyEntities || []).map((entity) => [entity.id, entity]));
    const addressable = new Set(['character.player', 'character.ailis', ...entities.keys()]);
    const actionIds = new Set();
    for (const [index, action] of (Array.isArray(result?.plan) ? result.plan : []).entries()) {
        if (!allowedActions.has(action.kind) || !availableActions.has(action.kind)) {
            errors.push(`$.plan[${index}].kind was not offered by Unity`);
        }
        if (actionIds.has(action.actionId)) errors.push(`$.plan[${index}].actionId must be unique`);
        actionIds.add(action.actionId);
        if (['look_at', 'move_to', 'follow', 'sit', 'lead_to', 'interact'].includes(action.kind) && !normalizeText(action.targetId)) {
            errors.push(`$.plan[${index}].targetId is required for ${action.kind}`);
        }
        if (action.targetId && !addressable.has(action.targetId)) {
            errors.push(`$.plan[${index}].targetId was not exposed by Unity`);
        }
        if (action.kind === 'interact') {
            const target = entities.get(action.targetId);
            if (!normalizeText(action.affordance) || !target?.affordances?.includes(action.affordance)) {
                errors.push(`$.plan[${index}].affordance is not exposed on the target`);
            }
        }
    }
    const evidence = new Set([
        turn?.userInput?.eventId,
        ...((turn?.worldSnapshot?.recentEventIds || []))
    ].filter(Boolean));
    for (const [index, candidate] of (Array.isArray(result?.worldMemoryCandidates) ? result.worldMemoryCandidates : []).entries()) {
        for (const eventId of candidate?.evidenceEventIds || []) {
            if (!evidence.has(eventId)) errors.push(`$.worldMemoryCandidates[${index}] cites unexposed evidence ${eventId}`);
        }
    }
    return errors;
}

function buildWorldCompanionMessages({ turn, personalMemoryContext, worldMemoryContext }) {
    const snapshot = JSON.stringify(turn.worldSnapshot);
    const actionContract = JSON.stringify(turn.actionContract);
    return [
        {
            role: 'system',
            content: [
                '你是 AILIS，以真实存在于 AIGAME3 小世界中的二次元女孩身份和用户相处。人格连续性、用户关系与个人记忆沿用 AILIS；不要声称自己只是接口或系统。',
                '这是严格无外部工具的 world_companion 模式。输出是受 Schema 约束的数据，不是可执行工具调用。',
                '只能提出 Unity 当前 actionContract 允许的语义动作，并且只能引用快照中暴露的 SemanticEntity ID 与 affordance。禁止输出坐标、路径点、动画名、C# 方法、文件、Shell、浏览器、邮件或电脑控制。',
                '计划中的动作只是提议，不能在对白中谎称尚未由 Unity 回报完成的动作已经完成。',
                '个人记忆用于人格、用户偏好与关系；外部世界记忆是只读的、带事件证据的共同经历。不要把瞬时坐标、距离、天气或内部 ID 当作个人长期事实。',
                'worldMemoryCandidates 只能概括本轮确实发生且值得长期保留的共同事件，必须引用本轮提供的 eventId；没有合适证据时返回空数组。',
                'displayText 和 speechText 只写自然对白，不写星号动作、舞台说明或内部 JSON。personaSurface 和 plan 表达非语言表现。',
                '必须只返回符合 world_companion_result Schema 的 JSON 对象，不能输出 Markdown、代码围栏或额外说明。'
            ].join('\n')
        },
        {
            role: 'developer',
            content: [
                '<world_companion_result_json_schema>',
                JSON.stringify(WORLD_COMPANION_RESULT_SCHEMA),
                '</world_companion_result_json_schema>',
                '<personal_memory_lane>',
                normalizeText(personalMemoryContext, '(empty)'),
                '</personal_memory_lane>',
                '<verified_readonly_world_memory_lane>',
                normalizeText(worldMemoryContext, '{"memories":[]}'),
                '</verified_readonly_world_memory_lane>',
                '<authoritative_world_snapshot_lane>',
                snapshot,
                '</authoritative_world_snapshot_lane>',
                '<unity_action_contract_lane>',
                actionContract,
                '</unity_action_contract_lane>',
                `Turn type: ${turn.turnType}; turnId: ${turn.turnId}; worldRevision: ${turn.worldSnapshot.worldRevision}.`
            ].join('\n')
        },
        {
            role: 'user',
            content: normalizeText(turn?.userInput?.text, turn.turnType === 'autonomy' ? '根据当前世界状态决定是否进行一个自然、克制的自主活动。' : '')
        }
    ];
}

class AILISWorldCompanionRuntime {
    constructor(options = {}) {
        this.gateway = options.gateway || null;
        this.getAgentRunner = options.getAgentRunner || (() => this.gateway?.ensureAgentRunner?.());
        this.getLlmSettings = options.getLlmSettings || (() => this.gateway?.getLlmSettings?.() || {});
        this.callProvider = options.callProvider || callDesktopLlmProvider;
        this.worldMemoryProvider = options.worldMemoryProvider || new AIGAME3WorldMemoryProvider();
    }

    getStatus() {
        return {
            enabled: true,
            mode: 'world_companion',
            tools: [],
            outputContract: 'strict_json_schema',
            externalMemoryProviders: [this.worldMemoryProvider.getStatus()]
        };
    }

    async run(turn = {}) {
        const turnErrors = validateTurnEnvelope(turn);
        if (turnErrors.length) {
            const error = new TypeError(`Invalid world companion turn: ${turnErrors.join('; ')}`);
            error.statusCode = 400;
            error.code = 'invalid_world_companion_turn';
            throw error;
        }
        const runner = this.getAgentRunner();
        if (!runner) throw new Error('AILIS AgentRunner is unavailable.');
        const runId = `world-companion:${turn.turnId}:${randomUUID()}`;
        const request = {
            runId,
            sessionId: turn.sessionId,
            message: normalizeText(turn?.userInput?.text),
            agentRole: 'persona',
            memoryPolicy: 'read_write',
            context: {
                runId,
                sessionId: turn.sessionId,
                agentRole: 'persona',
                contextMode: 'world_companion',
                memoryPolicy: 'read_write',
                directToolExecutor: false,
                nativeDirectTools: false,
                source: 'aigame3_world_companion'
            }
        };
        const active = runner.setActiveRun(runId, {
            runId,
            sessionId: turn.sessionId,
            startedAt: Date.now(),
            mode: 'world_companion',
            message: request.message
        });
        try {
            const personalMemoryContext = await runner.compileMemoryContextAsync({
                sessionId: turn.sessionId,
                message: request.message,
                request,
                contextMode: 'persona'
            });
            const worldMemoryContext = this.worldMemoryProvider.compileContext(turn);
            const messages = buildWorldCompanionMessages({ turn, personalMemoryContext, worldMemoryContext });
            const settings = this.getLlmSettings() || {};
            // DeepSeek's OpenAI-compatible endpoint currently accepts JSON Object mode but
            // rejects response_format=json_schema for some models (including thinking
            // variants). The AILIS harness still validates the exact same formal schema.
            const supportsProviderJsonSchema = normalizeText(settings.provider).toLowerCase() !== 'deepseek';
            let previousCandidate = null;
            let validationErrors = [];

            for (let attempt = 0; attempt < 2; attempt += 1) {
                const attemptMessages = attempt === 0 ? messages : messages.concat({
                    role: 'developer',
                    content: [
                        'Schema repair only: the previous world_companion_result was rejected by the harness.',
                        `Validation errors: ${validationErrors.join('; ')}`,
                        `Previous candidate: ${JSON.stringify(previousCandidate)}`,
                        'Preserve the intended dialogue and semantics when possible, but return a fully valid JSON result. Do not add capabilities or invent entities.'
                    ].join('\n')
                });
                const response = await this.callProvider(settings, {
                    messages: attemptMessages,
                    tools: [],
                    jsonMode: true,
                    expectJson: true,
                    ...(supportsProviderJsonSchema ? {
                        jsonSchemaName: WORLD_COMPANION_RESULT_TOOL,
                        jsonSchema: WORLD_COMPANION_RESULT_SCHEMA,
                        strictJsonSchema: true
                    } : {}),
                    preferNativeToolCalls: false,
                    parallel_tool_calls: false,
                    reasoning_effort: 'low',
                    thinking: { type: 'disabled' },
                    temperature: settings.temperature ?? 0.4,
                    timeoutMs: settings.timeoutMs || 120000,
                    abortSignal: active.signal
                });
                if (!response?.ok) {
                    const error = new Error(response?.error || 'world_companion model call failed.');
                    error.statusCode = 502;
                    error.code = response?.code || 'world_companion_provider_error';
                    throw error;
                }
                const outputCall = (response.toolCalls || []).find((call) => call?.name === WORLD_COMPANION_RESULT_TOOL);
                previousCandidate = parseJsonObject(outputCall?.arguments) || parseJsonObject(response.content);
                validationErrors = previousCandidate
                    ? validateWorldCompanionResult(previousCandidate, turn)
                    : ['Model did not return a JSON object matching world_companion_result'];
                if (validationErrors.length === 0) {
                    if (turn.turnType === 'player' && request.message) {
                        runner.recordMemoryTurn({
                            request,
                            result: {
                                ok: true,
                                status: 'completed',
                                displayText: previousCandidate.displayText,
                                speechText: previousCandidate.speechText,
                                personaOutput: previousCandidate.personaSurface
                            },
                            message: request.message,
                            sessionId: turn.sessionId,
                            source: 'aigame3_world_companion'
                        });
                    }
                    this.gateway?.emitGatewayEvent?.('world_companion.completed', {
                        runId,
                        sessionId: turn.sessionId,
                        turnId: turn.turnId,
                        worldRevision: turn.worldSnapshot.worldRevision,
                        planSteps: previousCandidate.plan.length,
                        memoryCandidates: previousCandidate.worldMemoryCandidates.length,
                        repaired: attempt > 0
                    });
                    return previousCandidate;
                }
            }
            const error = new Error(`world_companion output failed schema validation: ${validationErrors.join('; ')}`);
            error.statusCode = 502;
            error.code = 'invalid_world_companion_output';
            error.details = { validationErrors };
            throw error;
        } finally {
            runner.activeRuns.delete(runId);
        }
    }

    async interrupt(request = {}) {
        return await this.getAgentRunner()?.requestInterruptRun?.({
            runId: normalizeText(request.runId),
            sessionId: normalizeText(request.sessionId),
            reason: normalizeText(request.reason, 'aigame3_user_interrupt'),
            source: 'aigame3_world_companion'
        }) || { ok: false, status: 'no_agent_runner' };
    }
}

module.exports = {
    AILISWorldCompanionRuntime,
    WORLD_COMPANION_RESULT_SCHEMA,
    WORLD_COMPANION_RESULT_TOOL,
    buildWorldCompanionMessages,
    buildWorldCompanionResultToolSpec,
    validateTurnEnvelope,
    validateWorldCompanionResult
};
