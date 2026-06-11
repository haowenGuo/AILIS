const { getToolContract } = require('./humanclaw-tool-contracts.cjs');

const RENDERER_VERSION = 3;
const DEFAULT_EXPRESSION = 'relaxed';
const DEFAULT_LIP_SYNC = Object.freeze({ mode: 'audio_envelope' });
const ALLOWED_ACTIONS = new Set([
    'wave',
    'angry',
    'surprised',
    'dance',
    'thinking',
    'lookaround',
    'blush',
    'relax',
    'sad',
    'sleepy',
    'goodbye',
    'clapping',
    'jump'
]);
const ALLOWED_EXPRESSIONS = new Set(['happy', 'angry', 'sad', 'surprised', 'relaxed', 'blinkRight']);
const ALLOWED_RELATIONSHIP_STAGES = new Set(['cautious', 'familiarizing', 'trusted', 'close']);
const ALLOWED_EMOTIONS = new Set(['neutral', 'relaxed', 'happy', 'shy', 'sad', 'anxious', 'angry', 'tired', 'surprised', 'thinking', 'focused', 'comforting']);
const ALLOWED_TASK_STATES = new Set([
    'completed',
    'planned',
    'needs_approval',
    'uncertain',
    'failed',
    'blocked',
    'expired'
]);
const ALLOWED_SURFACE_TASK_STATES = new Set([
    'idle',
    'listening',
    'thinking',
    'speaking',
    'working',
    'waiting_approval',
    'happy_success',
    'apologizing',
    'comforting',
    'blocked',
    'failed'
]);
const ALLOWED_GESTURE_INTENTS = new Set([
    'none',
    'greeting',
    'farewell',
    'listening',
    'thinking',
    'working',
    'approval',
    'success',
    'celebrate',
    'shy',
    'comfort',
    'apologize',
    'surprised',
    'angry',
    'dance'
]);
const ALLOWED_SOCIAL_TONES = new Set(['soft', 'bright', 'calm', 'serious', 'playful', 'quiet']);
const ALLOWED_GAZE_TARGETS = new Set(['user', 'side', 'down', 'screen', 'away', 'none']);
const ALLOWED_DURATION_HINTS = new Set(['short', 'medium', 'long', 'hold']);
const ALLOWED_APPROVAL_STATES = new Set(['none', 'required', 'optional']);
const ALLOWED_EVIDENCE_STATES = new Set(['unknown', 'present', 'missing', 'none']);
const EXPRESSION_TO_EMOTION = Object.freeze({
    happy: 'happy',
    angry: 'angry',
    sad: 'sad',
    surprised: 'surprised',
    relaxed: 'relaxed',
    blinkRight: 'shy'
});

const INTERNAL_TEXT_REPLACEMENTS = Object.freeze([
    [/Agentic Executor(?: Loop)?/gi, '任务执行流程'],
    [/\bllm-agentic-executor\b/gi, '任务执行流程'],
    [/\btool_call\b/gi, '工具步骤'],
    [/\bload_context\b/gi, '补充上下文'],
    [/\bartifact_verifier\b/gi, '产物复核'],
    [/\bweb_fetch\b/gi, '网页读取'],
    [/\bapprovalId\b/gi, '确认信息'],
    [/\braw observation\b/gi, '观察记录'],
    [/\bgit_status\b/gi, '仓库状态检查'],
    [/\bexec\b/gi, '执行步骤'],
    [/\bmkdir\b/gi, '创建目录'],
    [/\bjson\b/gi, '结构化结果'],
    [/\bvision\.capture_context\b/gi, '截图查看'],
    [/\bmcp_bridge\b/gi, '外部工具连接'],
    [/\bsubagents?\b/gi, '并行助手'],
    [/context\.approved\s*=\s*true/gi, '已确认'],
    [/HUMANCLAW_[A-Z0-9_<>]+/g, '本地配置项']
]);

function normalizeText(value, fallback = '') {
    if (typeof value !== 'string') {
        return fallback;
    }
    const trimmed = value.trim();
    return trimmed || fallback;
}

function normalizeAction(value) {
    const action = normalizeText(value);
    return ALLOWED_ACTIONS.has(action) ? action : '';
}

function normalizeExpression(value, fallback = DEFAULT_EXPRESSION) {
    const expression = normalizeText(value);
    if (ALLOWED_EXPRESSIONS.has(expression)) {
        return expression;
    }
    return ALLOWED_EXPRESSIONS.has(fallback) ? fallback : DEFAULT_EXPRESSION;
}

function normalizeRelationshipStage(value) {
    const stage = normalizeText(value, 'trusted').toLowerCase();
    return ALLOWED_RELATIONSHIP_STAGES.has(stage) ? stage : 'trusted';
}

function normalizeEmotionHint(value) {
    const emotion = normalizeText(value, 'neutral').toLowerCase();
    return ALLOWED_EMOTIONS.has(emotion) ? emotion : 'neutral';
}

function normalizeSurfaceTaskState(value, fallback = 'speaking') {
    const state = normalizeText(value, fallback).toLowerCase().replace(/[-\s]+/g, '_');
    if (ALLOWED_SURFACE_TASK_STATES.has(state)) {
        return state;
    }
    if (state === 'completed') {
        return 'happy_success';
    }
    if (state === 'planned' || state === 'uncertain') {
        return 'thinking';
    }
    if (state === 'needs_approval') {
        return 'waiting_approval';
    }
    if (state === 'blocked') {
        return 'blocked';
    }
    if (state === 'failed' || state === 'expired' || state === 'error') {
        return 'failed';
    }
    return ALLOWED_SURFACE_TASK_STATES.has(fallback) ? fallback : 'speaking';
}

function normalizeGestureIntent(value, fallback = 'none') {
    const intent = normalizeText(value, fallback).toLowerCase().replace(/[-\s]+/g, '_');
    if (ALLOWED_GESTURE_INTENTS.has(intent)) {
        return intent;
    }
    if (intent === 'wave' || intent === 'hello') {
        return 'greeting';
    }
    if (intent === 'goodbye' || intent === 'bye') {
        return 'farewell';
    }
    if (intent === 'lookaround' || intent === 'look_around') {
        return 'thinking';
    }
    if (intent === 'blush') {
        return 'shy';
    }
    if (intent === 'clapping' || intent === 'done') {
        return 'success';
    }
    return ALLOWED_GESTURE_INTENTS.has(fallback) ? fallback : 'none';
}

function normalizeSocialTone(value, fallback = 'soft') {
    const tone = normalizeText(value, fallback).toLowerCase().replace(/[-\s]+/g, '_');
    return ALLOWED_SOCIAL_TONES.has(tone) ? tone : fallback;
}

function normalizeGazeTarget(value, fallback = 'user') {
    const target = normalizeText(value, fallback).toLowerCase().replace(/[-\s]+/g, '_');
    return ALLOWED_GAZE_TARGETS.has(target) ? target : fallback;
}

function normalizeDurationHint(value, fallback = 'short') {
    const duration = normalizeText(value, fallback).toLowerCase().replace(/[-\s]+/g, '_');
    return ALLOWED_DURATION_HINTS.has(duration) ? duration : fallback;
}

function normalizeUnitNumber(value, fallback = 0.5) {
    const numericValue = Number(value);
    if (!Number.isFinite(numericValue)) {
        return fallback;
    }
    return Math.min(Math.max(numericValue, 0), 1);
}

function normalizeTaskState(value) {
    const state = normalizeText(value, 'completed').toLowerCase();
    if (ALLOWED_TASK_STATES.has(state)) {
        return state;
    }
    if (state === 'max_steps_reached') {
        return 'blocked';
    }
    if (state === 'error' || state === 'invalid_agent_tool_call' || state === 'tool_failed') {
        return 'failed';
    }
    if (state === 'needs_approval') {
        return 'needs_approval';
    }
    return 'failed';
}

function isSurfaceTaskState(value) {
    const state = normalizeText(value).toLowerCase().replace(/[-\s]+/g, '_');
    return ALLOWED_SURFACE_TASK_STATES.has(state);
}

function isSurfaceOnlyTaskState(value) {
    const state = normalizeText(value).toLowerCase().replace(/[-\s]+/g, '_');
    return ALLOWED_SURFACE_TASK_STATES.has(state) && !ALLOWED_TASK_STATES.has(state);
}

function normalizeApprovalState(value) {
    const state = normalizeText(value, 'none').toLowerCase();
    return ALLOWED_APPROVAL_STATES.has(state) ? state : 'none';
}

function normalizeEvidenceState(value) {
    const state = normalizeText(value, 'unknown').toLowerCase();
    return ALLOWED_EVIDENCE_STATES.has(state) ? state : 'unknown';
}

function sanitizeUserFacingText(value) {
    let text = normalizeText(value);
    if (!text) {
        return '';
    }
    for (const [pattern, replacement] of INTERNAL_TEXT_REPLACEMENTS) {
        text = text.replace(pattern, replacement);
    }
    text = text
        .replace(/确认编号[:：][^\n]+/gi, '')
        .replace(/如果确认，请回复[“"][^”"]+[”"]；?如果不执行，请回复[“"][^”"]+[”"]。?/g, '你点头我就继续，不想继续也可以先停。')
        .replace(/\n{3,}/g, '\n\n')
        .replace(/[ \t]+\n/g, '\n')
        .replace(/\n[ \t]+/g, '\n')
        .trim();
    return text;
}

function compactSpeechText(value) {
    return sanitizeUserFacingText(value)
        .replace(/\[(?:action|expression):[^\]]*\]/g, '')
        .replace(/```[\s\S]*?```/g, '我把较长的细节放在文字里。')
        .replace(/[#>*_`~\-\[\]\(\)]/g, '')
        .replace(/\s+/g, ' ')
        .trim();
}

function summarizeBubbleText(value, fallback = '') {
    const text = sanitizeUserFacingText(value) || sanitizeUserFacingText(fallback);
    if (!text) {
        return '';
    }
    const singleLine = text.replace(/\s*\n+\s*/g, ' ').trim();
    if (singleLine.length <= 34) {
        return singleLine;
    }
    return `${singleLine.slice(0, 33)}...`;
}

function withControlTags(text, { action, expression } = {}) {
    const tags = [];
    const safeAction = normalizeAction(action);
    const safeExpression = normalizeExpression(expression, '');
    if (safeAction) {
        tags.push(`[action:${safeAction}]`);
    }
    if (safeExpression) {
        tags.push(`[expression:${safeExpression}]`);
    }
    return `${tags.join('')}${normalizeText(text, '我处理好了。')}`;
}

function getToolExperience(toolId) {
    return getToolContract(toolId)?.experience || {
        embodiedAction: 'handle_task',
        permissionStyle: 'policy',
        progressStyle: 'quiet',
        successStyle: 'summarize_result',
        failureStyle: 'plain_explain',
        userFacingVerb: '处理',
        userSafePreview: 'summary_only'
    };
}

function inferExpressionFromEmotion(emotionHint, fallback = DEFAULT_EXPRESSION) {
    const emotion = normalizeEmotionHint(emotionHint);
    if (emotion === 'happy') {
        return 'happy';
    }
    if (emotion === 'sad' || emotion === 'tired') {
        return 'sad';
    }
    if (emotion === 'anxious') {
        return 'surprised';
    }
    if (emotion === 'angry') {
        return 'angry';
    }
    if (emotion === 'surprised') {
        return 'surprised';
    }
    if (emotion === 'shy') {
        return 'blinkRight';
    }
    return normalizeExpression(fallback);
}

function inferActionFromEmotion(emotionHint, taskState = 'completed') {
    return '';
}

function inferSurfaceTaskState(taskState, approvalState = 'none') {
    if (approvalState === 'required' || taskState === 'needs_approval') {
        return 'waiting_approval';
    }
    if (taskState === 'completed') {
        return 'happy_success';
    }
    if (taskState === 'failed' || taskState === 'expired') {
        return 'failed';
    }
    return normalizeSurfaceTaskState(taskState);
}

function inferGestureIntent({ action = '', emotionHint = 'neutral', taskState = 'completed', approvalState = 'none' } = {}) {
    const actionIntent = normalizeGestureIntent(action, '');
    if (actionIntent) {
        return actionIntent;
    }
    if (approvalState === 'required' || taskState === 'needs_approval') {
        return 'approval';
    }
    if (taskState === 'planned' || taskState === 'uncertain') {
        return 'thinking';
    }
    if (taskState === 'failed' || taskState === 'blocked' || taskState === 'expired') {
        return 'apologize';
    }
    if (taskState === 'completed' && emotionHint === 'happy') {
        return 'success';
    }
    if (emotionHint === 'anxious' || emotionHint === 'thinking' || emotionHint === 'focused') {
        return 'thinking';
    }
    if (emotionHint === 'shy') {
        return 'shy';
    }
    if (emotionHint === 'surprised') {
        return 'surprised';
    }
    if (emotionHint === 'angry') {
        return 'angry';
    }
    if (emotionHint === 'sad' || emotionHint === 'tired') {
        return 'comfort';
    }
    return 'none';
}

function buildEmotionLead(emotionHint, relationshipStage = 'trusted') {
    const emotion = normalizeEmotionHint(emotionHint);
    const stage = normalizeRelationshipStage(relationshipStage);
    if (emotion === 'angry') {
        return stage === 'close' || stage === 'trusted'
            ? '我知道你现在有点火大，'
            : '我理解你现在有点火大，';
    }
    if (emotion === 'anxious') {
        return stage === 'close' || stage === 'trusted'
            ? '我知道你现在有点着急，'
            : '我理解你现在有点着急，';
    }
    if (emotion === 'sad' || emotion === 'tired') {
        return stage === 'close' || stage === 'trusted'
            ? '我知道你现在有点累，'
            : '我理解你现在有点累，';
    }
    if (emotion === 'happy') {
        return '好呀，';
    }
    return '';
}

function mapErrorCodeToReason(errorCode = '', { toolId = '' } = {}) {
    const code = normalizeText(errorCode).toLowerCase();
    const tool = normalizeText(toolId).toLowerCase();
    if (!code) {
        return '这一步没有完整成功';
    }
    if (tool === 'email' && code.includes('needs_config')) {
        return '邮箱账号或授权信息还没配置完整';
    }
    if (tool === 'code' && code.includes('needs_config')) {
        return '本地 GitHub 或代码工具环境还没准备完整';
    }
    if (code.includes('needs_llm_config')) {
        return '我这边还没拿到可用的大模型配置';
    }
    if (code.includes('timeout')) {
        return '这一步等待时间超出了预期';
    }
    if (code.includes('invalid_json') || code.includes('json')) {
        return '我这一步还没形成可以直接交给你的可靠结论';
    }
    if (code.includes('blocked') || code.includes('policy')) {
        return '这一步受本地安全边界限制';
    }
    if (code.includes('expired')) {
        return '这个待处理项已经过期';
    }
    if (code.includes('needs_approval')) {
        return '这一步仍然需要你的确认';
    }
    if (code.includes('not_found')) {
        return '我没有拿到足够明确的定位信息';
    }
    if (code.includes('tool_failed') || code.includes('error')) {
        return '这一步执行没有完整成功';
    }
    return '这一步没有完整成功';
}

function isInternalFailureDetail(value) {
    const text = sanitizeUserFacingText(value).toLowerCase();
    if (!text) {
        return false;
    }
    return (
        text.includes('结构化结果') ||
        text.includes('任务执行流程') ||
        text.includes('内部结果') ||
        text.includes('合法') ||
        text.includes('格式') ||
        text.includes('工具步骤') ||
        text.includes('执行步骤')
    );
}

function buildNextActionText(nextAction, { toolId = '', title = '', action = '' } = {}) {
    const raw = sanitizeUserFacingText(nextAction);
    if (raw) {
        return raw.replace(/\n+/g, ' ').trim();
    }
    const fallbackTitle = sanitizeUserFacingText(title);
    if (fallbackTitle) {
        return fallbackTitle;
    }
    const fallbackAction = sanitizeUserFacingText(action);
    if (fallbackAction) {
        return fallbackAction;
    }
    const experience = toolId ? getToolExperience(toolId) : null;
    const verb = sanitizeUserFacingText(experience?.userFacingVerb || '继续处理');
    return verb || '继续处理';
}

function createPersonaSurface({
    text,
    speechText,
    bubbleText,
    expression = DEFAULT_EXPRESSION,
    action = '',
    emotion = '',
    intensity = 0.5,
    socialTone = 'soft',
    gestureIntent = '',
    taskState = 'speaking',
    speechEnergy = null,
    gazeTarget = 'user',
    durationHint = 'short',
    ttsStyle = '自然、清楚、低工具感',
    lipSync = DEFAULT_LIP_SYNC,
    source = 'agent',
    toolId = '',
    experience = null
} = {}) {
    const safeText = sanitizeUserFacingText(text) || '我处理好了。';
    const safeSpeechText = compactSpeechText(speechText || safeText) || compactSpeechText(safeText);
    const safeBubbleText = summarizeBubbleText(bubbleText, safeText) || safeText;
    const safeExpression = normalizeExpression(expression);
    const safeAction = normalizeAction(action);
    const safeEmotion = normalizeEmotionHint(emotion || EXPRESSION_TO_EMOTION[safeExpression] || 'relaxed');
    const safeIntensity = normalizeUnitNumber(intensity, safeEmotion === 'relaxed' ? 0.38 : 0.55);
    return {
        version: RENDERER_VERSION,
        renderer: 'aigl-persona-renderer',
        source,
        text: safeText,
        speechText: safeSpeechText,
        bubbleText: safeBubbleText,
        expression: safeExpression,
        action: safeAction || null,
        emotion: safeEmotion,
        intensity: safeIntensity,
        socialTone: normalizeSocialTone(socialTone),
        gestureIntent: normalizeGestureIntent(gestureIntent || safeAction),
        taskState: normalizeSurfaceTaskState(taskState),
        speechEnergy: normalizeUnitNumber(speechEnergy, Math.max(0.25, safeIntensity * 0.85)),
        gazeTarget: normalizeGazeTarget(gazeTarget),
        durationHint: normalizeDurationHint(durationHint),
        ttsStyle,
        lipSync: lipSync && typeof lipSync === 'object' ? lipSync : DEFAULT_LIP_SYNC,
        toolId: normalizeText(toolId),
        experience: experience || (toolId ? getToolExperience(toolId) : null)
    };
}

function renderPersonaSurfaceGateway(input = {}) {
    const requestedTaskState = normalizeText(input.task_state || input.taskState);
    const taskState = normalizeTaskState(
        requestedTaskState && !isSurfaceOnlyTaskState(requestedTaskState)
            ? requestedTaskState
            : input.status || (input.ok === false ? 'failed' : 'completed')
    );
    const approvalState = normalizeApprovalState(
        input.approval_state ||
        input.approvalState ||
        (taskState === 'needs_approval' || input.confirmationRequired ? 'required' : 'none')
    );
    const evidenceState = normalizeEvidenceState(input.evidence_state || input.evidenceState || 'unknown');
    const errorCode = normalizeText(input.error_code || input.errorCode || input.status || '');
    const relationshipStage = normalizeRelationshipStage(input.relationship_stage || input.relationshipStage || 'trusted');
    const emotionHint = normalizeEmotionHint(input.emotion_hint || input.emotionHint || 'neutral');
    const toolId = normalizeText(input.tool_id || input.toolId || '');
    const action = normalizeAction(input.action || '');
    const source = normalizeText(input.source || 'persona_surface_gateway');
    const dryRun = input.dry_run === true || input.dryRun === true;
    const surfaceEmotion = normalizeEmotionHint(input.emotion || input.emotionHint || input.emotion_hint || emotionHint);
    const surfaceTaskState = normalizeSurfaceTaskState(
        input.surface_task_state ||
            input.surfaceTaskState ||
            input.persona_task_state ||
            input.personaTaskState ||
            (isSurfaceOnlyTaskState(requestedTaskState) ? requestedTaskState : ''),
        inferSurfaceTaskState(taskState, approvalState)
    );
    const surfaceGestureIntent = normalizeGestureIntent(
        input.gesture_intent ||
            input.gestureIntent ||
            inferGestureIntent({ action, emotionHint: surfaceEmotion, taskState, approvalState })
    );
    const nextAction = buildNextActionText(input.next_action || input.nextAction || '', {
        toolId,
        title: input.title,
        action: input.action_label || input.action
    });
    const emotionLead = buildEmotionLead(emotionHint, relationshipStage);
    const requestedText = sanitizeUserFacingText(input.text || input.displayText || input.fallback_text || input.fallbackText || '');
    const requestedBubble = sanitizeUserFacingText(input.bubble_text || input.bubbleText || '');
    const requestedSpeech = sanitizeUserFacingText(input.speech_text || input.speechText || '');
    const requestedTtsStyle = sanitizeUserFacingText(input.tts_style || input.ttsStyle || '');
    const reasonText = sanitizeUserFacingText(input.reason || '');

    const approvalRequired = approvalState === 'required' || taskState === 'needs_approval';
    const failedState = taskState === 'failed' || taskState === 'blocked' || taskState === 'expired';
    const uncertainState = taskState === 'uncertain' || taskState === 'planned';
    const personaAuthoredText = input.text_is_persona_safe === true || input.personaText === true;
    const surfaceIntensity = normalizeUnitNumber(input.intensity, failedState ? 0.4 : uncertainState ? 0.38 : 0.52);
    const surfaceGazeTarget = normalizeGazeTarget(input.gaze_target || input.gazeTarget, approvalRequired ? 'user' : failedState ? 'down' : uncertainState ? 'side' : 'user');
    const surfaceDurationHint = normalizeDurationHint(input.duration_hint || input.durationHint, approvalRequired || uncertainState ? 'medium' : 'short');

    if (approvalRequired) {
        const target = sanitizeUserFacingText(input.vision_target_label || input.visionTargetLabel || '');
        const actionText = toolId === 'vision.capture_context'
            ? `看一眼${target || '当前画面'}`
            : nextAction;
        const text = dryRun
            ? `${emotionLead}我已经想好下一步了，等你点头我再开始。`
            : [
                `${emotionLead}这一步我需要先得到你的确认。`,
                `我会先${actionText}，然后把结果用一句人话告诉你。`,
                toolId === 'vision.capture_context'
                    ? '你同意的话告诉我“可以看”，我就继续。'
                    : '你点头我就继续，不想继续也可以先停。',
                reasonText ? `这样做是为了：${reasonText}` : ''
            ].filter(Boolean).join('\n');
        return createPersonaSurface({
            text,
            speechText: requestedSpeech || text,
            bubbleText: requestedBubble || (dryRun ? '下一步我已经准备好了。' : '这一步需要你点头。'),
            expression: inferExpressionFromEmotion(surfaceEmotion, 'relaxed'),
            action: '',
            emotion: surfaceEmotion,
            intensity: surfaceIntensity,
            socialTone: input.social_tone || input.socialTone || 'soft',
            gestureIntent: surfaceGestureIntent,
            taskState: surfaceTaskState,
            speechEnergy: input.speech_energy ?? input.speechEnergy,
            gazeTarget: surfaceGazeTarget,
            durationHint: surfaceDurationHint,
            ttsStyle: requestedTtsStyle || '先确认再继续，语气自然',
            source,
            toolId,
            experience: input.experience || getToolExperience(toolId)
        });
    }

    if (failedState) {
        const failureReason = mapErrorCodeToReason(errorCode, { toolId });
        const emailConfigMissing = toolId === 'email' && errorCode.toLowerCase().includes('needs_config');
        const canUseRequestedFailureText =
            !emailConfigMissing &&
            requestedText &&
            !isInternalFailureDetail(requestedText) &&
            !/HUMANCLAW_|<PROVIDER>|tool_call|raw observation/i.test(requestedText);
        if (canUseRequestedFailureText) {
            return createPersonaSurface({
                text: requestedText,
                speechText: requestedSpeech || requestedText,
                bubbleText: requestedBubble || '',
                expression: inferExpressionFromEmotion(surfaceEmotion, 'relaxed'),
                action: '',
                emotion: surfaceEmotion,
                intensity: surfaceIntensity,
                socialTone: input.social_tone || input.socialTone || 'soft',
                gestureIntent: surfaceGestureIntent,
                taskState: surfaceTaskState,
                speechEnergy: input.speech_energy ?? input.speechEnergy,
                gazeTarget: surfaceGazeTarget,
                durationHint: surfaceDurationHint,
                ttsStyle: requestedTtsStyle || '简洁说明卡点和补救',
                source,
                toolId,
                experience: input.experience || getToolExperience(toolId)
            });
        }
        const evidenceLine = emailConfigMissing
            ? '我还没连上邮箱，不会假装已经看过邮件。'
            : evidenceState === 'missing'
                ? '我还没拿到足够证据，不会把这一步说成已经完成。'
                : '';
        const extraReason = reasonText && reasonText !== failureReason && !isInternalFailureDetail(reasonText)
            ? `补充信息：${reasonText}。`
            : '';
        const nextActionLine = nextAction
            ? `这轮没有继续执行新的动作；如果要继续，下一步建议是：${nextAction}。`
            : '这轮没有继续执行新的动作。';
        const text = [
            `${emotionLead}这一步我先停住，不拿不稳的结果冒进。`,
            `目前卡点：${failureReason}。`,
            evidenceLine,
            extraReason,
            nextActionLine
        ].filter(Boolean).join('\n');
        return createPersonaSurface({
            text,
            speechText: text,
            bubbleText: emailConfigMissing ? '邮箱还没连上，我先不假装看过。' : '这一步我先稳住。',
            expression: inferExpressionFromEmotion(surfaceEmotion, 'relaxed'),
            action: '',
            emotion: surfaceEmotion,
            intensity: surfaceIntensity,
            socialTone: input.social_tone || input.socialTone || 'soft',
            gestureIntent: surfaceGestureIntent,
            taskState: surfaceTaskState,
            speechEnergy: input.speech_energy ?? input.speechEnergy,
            gazeTarget: surfaceGazeTarget,
            durationHint: surfaceDurationHint,
            ttsStyle: requestedTtsStyle || '简洁说明卡点和补救',
            source,
            toolId,
            experience: input.experience || getToolExperience(toolId)
        });
    }

    if (uncertainState) {
        const canUseRequestedText =
            requestedText &&
            !isInternalFailureDetail(requestedText) &&
            !/HUMANCLAW_|<PROVIDER>|tool_call|raw observation/i.test(requestedText);
        const evidenceLine = evidenceState === 'missing' || evidenceState === 'none'
            ? '这轮还没拿到足够的实际证据。'
            : '这轮已经停下，还没有继续执行新的动作。';
        const extraReason = reasonText && !isInternalFailureDetail(reasonText)
            ? `当前卡点：${reasonText}。`
            : '';
        const nextActionLine = nextAction
            ? `如果要继续，下一步建议是：${nextAction}。`
            : '';
        const text = [
            `${emotionLead}${evidenceLine}`,
            extraReason,
            nextActionLine
        ].filter(Boolean).join('\n');
        return createPersonaSurface({
            text: canUseRequestedText ? requestedText : text,
            speechText: canUseRequestedText ? (requestedSpeech || requestedText) : text,
            bubbleText: requestedBubble || (canUseRequestedText ? requestedText : '这轮先停在这里。'),
            expression: inferExpressionFromEmotion(surfaceEmotion, 'relaxed'),
            action: '',
            emotion: surfaceEmotion,
            intensity: surfaceIntensity,
            socialTone: input.social_tone || input.socialTone || 'soft',
            gestureIntent: surfaceGestureIntent,
            taskState: surfaceTaskState,
            speechEnergy: input.speech_energy ?? input.speechEnergy,
            gazeTarget: surfaceGazeTarget,
            durationHint: surfaceDurationHint,
            ttsStyle: requestedTtsStyle || '自然说明不确定性',
            source,
            toolId,
            experience: input.experience || getToolExperience(toolId)
        });
    }

    const successText = requestedText || `${emotionLead}我处理好了。`;
    const successAction = action || inferActionFromEmotion(emotionHint, taskState);
    return createPersonaSurface({
        text: successText,
        speechText: requestedSpeech || successText,
        bubbleText: requestedBubble || successText,
        expression: inferExpressionFromEmotion(surfaceEmotion, input.ok === false ? 'relaxed' : 'relaxed'),
        action: successAction,
        emotion: surfaceEmotion,
        intensity: surfaceIntensity,
        socialTone: input.social_tone || input.socialTone || 'soft',
        gestureIntent: surfaceGestureIntent,
        taskState: surfaceTaskState,
        speechEnergy: input.speech_energy ?? input.speechEnergy,
        gazeTarget: surfaceGazeTarget,
        durationHint: surfaceDurationHint,
        ttsStyle: requestedTtsStyle || '自然、清楚、低工具感',
        source,
        toolId,
        experience: input.experience || (toolId ? getToolExperience(toolId) : null)
    });
}

function attachPersonaSurface(result = {}, surface = null) {
    const personaSurface = surface || renderPersonaSurfaceGateway({
        task_state: result.ok ? 'completed' : (result.status || 'failed'),
        approval_state: result.confirmationRequired ? 'required' : 'none',
        evidence_state: Array.isArray(result.steps) && result.steps.length ? 'present' : 'unknown',
        error_code: result.error || result.status || '',
        text: result.displayText || result.error || '我处理好了。',
        source: result.planner || 'agent',
        ok: result.ok
    });
    const displayText = withControlTags(personaSurface.text, personaSurface);
    return {
        ...result,
        displayText,
        speechText: personaSurface.speechText,
        bubbleText: personaSurface.bubbleText,
        expression: personaSurface.expression,
        action: personaSurface.action,
        emotion: personaSurface.emotion,
        intensity: personaSurface.intensity,
        socialTone: personaSurface.socialTone,
        gestureIntent: personaSurface.gestureIntent,
        taskState: personaSurface.taskState,
        speechEnergy: personaSurface.speechEnergy,
        gazeTarget: personaSurface.gazeTarget,
        durationHint: personaSurface.durationHint,
        ttsStyle: personaSurface.ttsStyle,
        lipSync: personaSurface.lipSync,
        surface: personaSurface
    };
}

function renderApprovalSurface({
    toolId,
    title,
    action,
    reason,
    dryRun = false,
    visionTargetLabel = ''
} = {}) {
    const nextAction = toolId === 'vision.capture_context'
        ? `看一眼${normalizeText(visionTargetLabel, '屏幕')}`
        : normalizeText(title || action || getToolExperience(toolId).userFacingVerb || '继续处理');
    return renderPersonaSurfaceGateway({
        task_state: dryRun ? 'planned' : 'needs_approval',
        approval_state: dryRun ? 'none' : 'required',
        evidence_state: dryRun ? 'none' : 'missing',
        relationship_stage: 'trusted',
        emotion_hint: 'neutral',
        next_action: nextAction,
        reason,
        title,
        action,
        dry_run: dryRun,
        vision_target_label: visionTargetLabel,
        source: 'approval',
        tool_id: toolId,
        experience: getToolExperience(toolId)
    });
}

function renderStatusSurface({
    text,
    status = '',
    ok = false,
    toolId = '',
    expression = '',
    action = '',
    source = 'agent_status'
} = {}) {
    const taskState = normalizeTaskState(status || (ok ? 'completed' : 'failed'));
    const surface = renderPersonaSurfaceGateway({
        task_state: taskState,
        approval_state: status === 'needs_approval' ? 'required' : 'none',
        evidence_state: 'unknown',
        error_code: status,
        relationship_stage: 'trusted',
        emotion_hint: ok ? 'neutral' : 'anxious',
        next_action: '',
        text,
        source,
        tool_id: toolId,
        action,
        ok,
        expression: normalizeExpression(expression || (ok ? 'happy' : 'surprised'))
    });
    const preserveText = ok && taskState === 'completed';
    return createPersonaSurface({
        ...surface,
        text: preserveText ? normalizeText(text, surface.text) : surface.text,
        speechText: preserveText ? normalizeText(text, surface.speechText) : surface.speechText,
        bubbleText: preserveText ? normalizeText(text, surface.bubbleText) : surface.bubbleText,
        expression: normalizeExpression(expression || surface.expression),
        action: normalizeAction(action || surface.action || '')
    });
}

function renderToolFailureSurface({
    step = {},
    response = null,
    userMessage = '',
    intent = '',
    fallbackText = ''
} = {}) {
    const toolId = normalizeText(step.tool);
    const status = normalizeText(response?.status || response?.error?.status || response?.code || 'error');
    const action = normalizeText(step.args?.action || step.args?.operation || step.args?.intent);
    const userFacingVerb = getToolExperience(toolId).userFacingVerb || '继续处理';
    const nextAction = toolId === 'vision.capture_context'
        ? `看一眼${normalizeText(step.args?.target, '当前画面')}`
        : userFacingVerb;
    const lowerIntent = normalizeText(intent || userMessage).toLowerCase();
    const emotionHint = /火大|生气|烦|焦虑|担心|紧张|着急/.test(lowerIntent) ? 'anxious' : 'neutral';
    const relationHint = /宝|亲|抱抱/.test(lowerIntent) ? 'close' : 'trusted';
    const emailNeedsConfigText =
        toolId === 'email' && status === 'needs_config'
            ? [
                '我现在还没连上你的邮箱账号，所以不能直接替你查看新邮件。',
                '等邮箱账号和授权信息在控制面板里补好后，我就可以继续帮你查。',
                '我先停在这里，不会假装已经看过邮件。'
            ].join('\n')
            : '';
    return renderPersonaSurfaceGateway({
        task_state: status === 'needs_approval' ? 'needs_approval' : 'failed',
        approval_state: status === 'needs_approval' ? 'required' : 'none',
        evidence_state: response?.ok ? 'present' : 'missing',
        error_code: status,
        relationship_stage: relationHint,
        emotion_hint: emotionHint,
        next_action: emailNeedsConfigText ? '补全邮箱账号和授权信息' : nextAction,
        reason: emailNeedsConfigText ? '' : fallbackText,
        text: emailNeedsConfigText || fallbackText,
        bubble_text: emailNeedsConfigText ? '邮箱还没连上，我先不假装看过。' : '',
        source: 'tool_failure',
        tool_id: toolId,
        action,
        experience: {
            ...getToolExperience(toolId),
            status,
            action,
            failureStyle: 'persona_safe_explain'
        }
    });
}

function renderMaxStepsSurface({
    maxSteps = 0,
    stepCount = 0,
    latestSummary = '',
    mode = 'task'
} = {}) {
    const summary = sanitizeUserFacingText(latestSummary);
    const text = [
        stepCount > 0 ? `我已经做了 ${stepCount} 轮处理，` : '',
        '但这一轮还没形成足够稳的结论，我先停住，避免越查越乱。',
        summary ? `目前主要卡在：${summary}` : '',
        mode === 'conversation'
            ? '如果继续，我会把下一步压成一句人话再往下走。'
            : '如果继续，我会从这个卡点接着查。'
    ].filter(Boolean).join('\n');
    return renderPersonaSurfaceGateway({
        task_state: 'blocked',
        approval_state: 'none',
        evidence_state: stepCount > 0 ? 'present' : 'missing',
        error_code: 'max_steps_reached',
        relationship_stage: 'trusted',
        emotion_hint: 'neutral',
        next_action: summary || '继续从当前卡点往下查',
        text,
        bubble_text: '我先停住，避免越跑越乱。',
        text_is_persona_safe: true,
        source: 'agent_max_steps',
        experience: {
            embodiedAction: 'pause_and_explain',
            permissionStyle: 'none',
            progressStyle: 'quiet',
            successStyle: 'not_completed',
            failureStyle: 'plain_explain',
            userFacingVerb: '先停住',
            userSafePreview: 'summary_only',
            maxSteps: Number(maxSteps) || 0
        }
    });
}

module.exports = {
    RENDERER_VERSION,
    attachPersonaSurface,
    createPersonaSurface,
    getToolExperience,
    renderApprovalSurface,
    renderMaxStepsSurface,
    renderPersonaSurfaceGateway,
    renderToolFailureSurface,
    renderStatusSurface,
    withControlTags
};
