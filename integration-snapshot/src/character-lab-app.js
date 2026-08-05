import {
    CHARACTER_ACTION_CATEGORIES,
    createCharacterActionSurface,
    getCharacterActionSupport,
    listCharacterActionIntents
} from './character/action-catalog.js';

const EXPRESSION_CASES = Object.freeze([
    { id: 'neutral', label: '中性', note: '自然待机', emotion: 'neutral' },
    { id: 'relaxed', label: '放松', note: '柔和稳定', emotion: 'relaxed' },
    { id: 'happy', label: '开心', note: '积极回应', emotion: 'happy' },
    { id: 'shy', label: '害羞', note: '轻微羞涩', emotion: 'shy' },
    { id: 'love', label: '亲近', note: '温暖喜欢', emotion: 'love' },
    { id: 'sad', label: '难过', note: '低落情绪', emotion: 'sad' },
    { id: 'angry', label: '生气', note: '不满严肃', emotion: 'angry' },
    { id: 'surprised', label: '惊讶', note: '意外反应', emotion: 'surprised' },
    { id: 'thinking', label: '思考', note: '专注疑惑', emotion: 'thinking' },
    { id: 'victory', label: '成功', note: '完成喜悦', emotion: 'victory' },
    { id: 'sleep', label: '困倦', note: '低能量', emotion: 'tired' },
    { id: 'suspicious', label: '疑惑', note: '观察判断', emotion: 'suspicious' }
]);

const MOTION_CASES = Object.freeze(listCharacterActionIntents().map((intent) => ({
    id: intent.id,
    label: intent.label,
    note: intent.description,
    category: intent.category,
    surface: createCharacterActionSurface(intent.id)
})));

const BUBBLE_PRESETS = Object.freeze([
    {
        label: '短句',
        text: '找到啦，我们继续吧。'
    },
    {
        label: '两行对话',
        text: '我已经检查完当前步骤。\n下一步准备验证实际效果。'
    },
    {
        label: '长文本',
        text: '这一段用来测试较长的对话气泡。气泡应该根据人物当前在屏幕中的实际位置和文本高度自动向上调整，不能遮挡人物，也不应该阻止人物拖动。'
    },
    {
        label: '中英混排',
        text: 'AILIS Character Lab 已连接。Let us verify motion, expression and dialogue together.'
    }
]);

const elements = {
    tabs: [...document.querySelectorAll('[data-tab]')],
    panels: [...document.querySelectorAll('[data-panel]')],
    runtimeStatus: document.getElementById('runtime-status'),
    openStateMachineBtn: document.getElementById('open-state-machine-btn'),
    experienceSequenceBtn: document.getElementById('experience-sequence-btn'),
    refreshAnimationStateBtn: document.getElementById('refresh-animation-state-btn'),
    debugAdapter: document.getElementById('debug-adapter'),
    debugTaskState: document.getElementById('debug-task-state'),
    debugEmotion: document.getElementById('debug-emotion'),
    debugPlayback: document.getElementById('debug-playback'),
    animationLayerGrid: document.getElementById('animation-layer-grid'),
    animationDebugNote: document.getElementById('animation-debug-note'),
    pauseAnimationBtn: document.getElementById('pause-animation-btn'),
    resumeAnimationBtn: document.getElementById('resume-animation-btn'),
    debugLayerSelect: document.getElementById('debug-layer-select'),
    animationSeek: document.getElementById('animation-seek'),
    animationSeekValue: document.getElementById('animation-seek-value'),
    characterPackageSelect: document.getElementById('character-package-select'),
    characterPackageMeta: document.getElementById('character-package-meta'),
    switchCharacterBtn: document.getElementById('switch-character-btn'),
    operationStatus: document.getElementById('operation-status'),
    currentTest: document.getElementById('current-test'),
    expressionGrid: document.getElementById('expression-grid'),
    motionGrid: document.getElementById('motion-grid'),
    motionSystemCount: document.getElementById('motion-system-count'),
    motionCategory: document.getElementById('motion-category'),
    motionCatalogGrid: document.getElementById('motion-catalog-grid'),
    motionCatalogCount: document.getElementById('motion-catalog-count'),
    motionCatalogEmpty: document.getElementById('motion-catalog-empty'),
    expressionIntensity: document.getElementById('expression-intensity'),
    expressionIntensityValue: document.getElementById('expression-intensity-value'),
    motionIntensity: document.getElementById('motion-intensity'),
    motionIntensityValue: document.getElementById('motion-intensity-value'),
    socialTone: document.getElementById('social-tone'),
    motionDuration: document.getElementById('motion-duration'),
    expressionSequenceBtn: document.getElementById('expression-sequence-btn'),
    motionSequenceBtn: document.getElementById('motion-sequence-btn'),
    motionCatalogSequenceBtn: document.getElementById('motion-catalog-sequence-btn'),
    resetExpressionBtn: document.getElementById('reset-expression-btn'),
    stopMotionBtn: document.getElementById('stop-motion-btn'),
    bubbleText: document.getElementById('bubble-text'),
    bubbleCount: document.getElementById('bubble-count'),
    bubbleSyncSpeech: document.getElementById('bubble-sync-speech'),
    bubblePresets: document.getElementById('bubble-presets'),
    showBubbleBtn: document.getElementById('show-bubble-btn'),
    updateBubbleBtn: document.getElementById('update-bubble-btn'),
    hideBubbleBtn: document.getElementById('hide-bubble-btn'),
    minimizeBtn: document.getElementById('minimize-btn'),
    maximizeBtn: document.getElementById('maximize-btn'),
    closeBtn: document.getElementById('close-btn')
};

const state = {
    sequenceTimer: null,
    sequenceToken: 0,
    activeButton: null,
    bubbleId: '',
    capabilities: null,
    characters: [],
    characterCatalogFingerprint: '',
    switchingCharacter: false,
    motionCatalog: [],
    motionCatalogFingerprint: '',
    activeTab: 'guide',
    animationState: null,
    animationRequestPending: false
};

function setStatus(message, current = '') {
    elements.operationStatus.textContent = message;
    if (current) {
        elements.currentTest.textContent = `当前：${current}`;
    }
}

function selectTab(target) {
    state.activeTab = target;
    stopSequence();
    for (const item of elements.tabs) {
        item.setAttribute(
            'aria-selected',
            item.dataset.tab === target ? 'true' : 'false'
        );
    }
    for (const panel of elements.panels) {
        panel.classList.toggle(
            'is-active',
            panel.dataset.panel === target
        );
    }
    if (target === 'state') {
        void refreshAnimationState();
    }
}

function getCharacterAdapterLabel(adapter) {
    return String(adapter || '').toLowerCase() === 'asset-bundle'
        ? 'UnityPackage'
        : 'VRM 1.0';
}

function updateCharacterSelectionMeta() {
    const selectedId = elements.characterPackageSelect.value;
    const selected = state.characters.find((character) => character.id === selectedId);
    const activeId = String(state.capabilities?.packageId || '');
    elements.switchCharacterBtn.disabled = Boolean(
        state.switchingCharacter ||
        !selected ||
        selected.id === activeId
    );
    if (!selected) {
        elements.characterPackageMeta.textContent = '当前没有发现可切换的 Unity 人物包。';
        return;
    }
    const activeText = selected.id === activeId ? '当前启用' : '可切换';
    elements.characterPackageMeta.textContent =
        `${getCharacterAdapterLabel(selected.adapter)} · ${activeText} · 已安装 ${state.characters.length} 个人物`;
}

function renderCharacterSelector(capabilities) {
    const characters = Array.isArray(capabilities?.characters)
        ? capabilities.characters.filter((character) => character?.id)
        : [];
    const fingerprint = JSON.stringify(characters.map((character) => [
        character.id,
        character.displayName,
        character.adapter
    ]));
    state.characters = characters;
    if (fingerprint !== state.characterCatalogFingerprint) {
        state.characterCatalogFingerprint = fingerprint;
        elements.characterPackageSelect.replaceChildren();
        for (const character of characters) {
            const option = document.createElement('option');
            option.value = character.id;
            option.textContent =
                `${character.displayName || character.id} · ${getCharacterAdapterLabel(character.adapter)}`;
            elements.characterPackageSelect.appendChild(option);
        }
    }
    const activeId = String(capabilities?.packageId || '');
    if (!state.switchingCharacter && characters.some((character) => character.id === activeId)) {
        elements.characterPackageSelect.value = activeId;
    }
    elements.characterPackageSelect.disabled = characters.length === 0 || state.switchingCharacter;
    updateCharacterSelectionMeta();
}

async function switchCharacter() {
    const packageId = elements.characterPackageSelect.value;
    if (!packageId || state.switchingCharacter) {
        return;
    }
    stopSequence();
    state.switchingCharacter = true;
    elements.characterPackageSelect.disabled = true;
    elements.switchCharacterBtn.disabled = true;
    setStatus('正在重启 Unity 人物渲染，聊天和 Agent 不会中断。', '切换人物');
    try {
        const result = await window.ailisDesktop?.characterLab?.selectCharacter?.({
            packageId
        });
        if (!result?.ok) {
            setStatus(
                result?.error === 'character_package_not_installed'
                    ? '人物包已经不在安装目录，请重新打开测试台刷新清单。'
                    : `人物切换失败：${result?.error || '运行时未就绪'}`,
                '切换失败'
            );
            return;
        }
        state.capabilities = result.capabilities || state.capabilities;
        renderCharacterSelector(state.capabilities);
        applyCapabilityLabels();
        renderMotionCatalog(state.capabilities);
        setStatus(
            `已切换到 ${state.capabilities?.displayName || packageId}，正在等待人物显示。`,
            '人物已切换'
        );
    } finally {
        state.switchingCharacter = false;
        elements.characterPackageSelect.disabled = state.characters.length === 0;
        updateCharacterSelectionMeta();
        void refreshRuntimeStatus();
    }
}

function getRangeValue(element, fallback) {
    const value = Number(element?.value);
    return Number.isFinite(value) ? value : fallback;
}

function getSocialTone() {
    return ['formal', 'soft', 'playful'][Math.round(getRangeValue(elements.socialTone, 1))] || 'soft';
}

function getDurationHint() {
    return ['short', 'medium', 'hold'][Math.round(getRangeValue(elements.motionDuration, 1))] || 'medium';
}

function stopSequence() {
    clearInterval(state.sequenceTimer);
    clearTimeout(state.sequenceTimer);
    state.sequenceTimer = null;
    state.sequenceToken += 1;
    elements.expressionSequenceBtn.textContent = '自动巡检';
    elements.motionSequenceBtn.textContent = '语义巡检';
    elements.motionCatalogSequenceBtn.textContent = '资源巡检';
    elements.experienceSequenceBtn.textContent = '整体体验巡检';
}

function markActive(button) {
    state.activeButton?.classList.remove('is-active');
    state.activeButton = button || null;
    state.activeButton?.classList.add('is-active');
}

function normalizeSemantic(value) {
    return String(value || '').trim().toLowerCase().replaceAll('-', '_');
}

function findExpressionCapability(item) {
    const expressions = state.capabilities?.expressions;
    if (!Array.isArray(expressions) || expressions.length === 0) {
        return null;
    }
    const emotion = normalizeSemantic(item.emotion);
    const candidates = expressions
        .filter((expression) => (
            normalizeSemantic(expression.id) === emotion ||
            normalizeSemantic(expression.key) === emotion ||
            normalizeSemantic(expression.preset) === emotion ||
            normalizeSemantic(expression.customName) === emotion ||
            expression.semanticChannels?.some((channel) => normalizeSemantic(channel) === emotion)
        ))
        .sort((left, right) => Number(right.priority || 0) - Number(left.priority || 0));
    return candidates[0] || null;
}

function applyCapabilityLabels() {
    if (state.capabilities?.backend !== 'unity') {
        return;
    }
    for (const item of EXPRESSION_CASES) {
        const button = elements.expressionGrid.querySelector(`[data-test-id="${item.id}"]`);
        const note = button?.querySelector('[data-test-note]');
        const capability = findExpressionCapability(item);
        if (!button || !note) {
            continue;
        }
        button.disabled = !capability;
        button.classList.toggle('is-unavailable', !capability);
        note.textContent = capability
            ? `${item.note} · ${capability.standard || 'legacy'}:${capability.key || capability.id} → ${capability.stateName || capability.driver}`
            : `${item.note} · 当前人物包未映射`;
    }
    for (const item of MOTION_CASES) {
        const button = elements.motionGrid.querySelector(`[data-test-id="${item.id}"]`);
        const note = button?.querySelector('[data-test-note]');
        const support = getCharacterActionSupport(
            item.id,
            state.capabilities?.motions || []
        );
        if (!button || !note) {
            continue;
        }
        button.disabled = false;
        button.classList.remove('is-unavailable');
        button.classList.toggle('is-unmapped', support.status === 'unmapped');
        button.classList.toggle(
            'is-fallback',
            support.status === 'fallback' || support.status === 'motion_fallback'
        );
        if (support.status === 'exact') {
            note.textContent = `${item.note} · 精确支持：${support.motion.id}`;
        } else if (support.status === 'fallback') {
            note.textContent =
                `${item.note} · 降级为 ${support.resolvedIntent}：${support.motion.id}`;
        } else if (support.status === 'motion_fallback') {
            note.textContent =
                `${item.note} · ${support.reviewedMotion.id} 待审查，安全替代为 ${support.motion.id}`;
        } else {
            note.textContent = `${item.note} · 当前人物未映射，将保持安全基础状态`;
        }
    }
}

async function applySurface(surface, label) {
    if (!window.ailisDesktop?.characterLab?.applySurface) {
        setStatus('桌面测试接口尚未加载，请重启 AILIS。', '接口不可用');
        return false;
    }

    const result = await window.ailisDesktop.characterLab.applySurface({
        requestId: `character-lab-${Date.now()}`,
        surface: {
            emotion: 'relaxed',
            taskState: 'speaking',
            gestureIntent: 'none',
            gazeTarget: 'user',
            socialTone: getSocialTone(),
            durationHint: getDurationHint(),
            intensity: 0.6,
            speechEnergy: 0,
            speechText: '',
            speechDurationSeconds: 0,
            ...surface
        }
    });

    if (!result?.ok) {
        setStatus(`测试命令未送达：${result?.error || 'unknown_error'}`, '发送失败');
        return false;
    }
    setStatus(`命令已发送到 ${result.backend === 'unity' ? 'Unity' : 'Three.js'} 后端`, label);
    return true;
}

async function playMotion(motion, label = motion?.id || '动作') {
    if (!window.ailisDesktop?.characterLab?.playMotion) {
        setStatus('精确动作测试接口尚未加载，请重启 AILIS。', '接口不可用');
        return false;
    }
    const result = await window.ailisDesktop.characterLab.playMotion({
        requestId: `character-lab-motion-${Date.now()}`,
        motionId: motion?.id
    });
    if (!result?.ok) {
        setStatus(`动作未播放：${result?.error || 'unknown_error'}`, '播放失败');
        return false;
    }
    const compatibility = normalizeSemantic(motion?.compatibility || 'approved');
    const compatibilityLabel = compatibility === 'approved'
        ? `已直接播放人物包动作 ${result.motionId}。`
        : compatibility === 'review'
            ? `已直接播放 ${result.motionId}；请重点检查 ${motion.collisionZones?.join('、') || '人物碰撞区域'}。`
            : `已强制播放禁用动作 ${result.motionId}；该动作不会进入自动调度，仅用于复现问题。`;
    setStatus(
        compatibilityLabel,
        label
    );
    return true;
}

function createTestButton(item, onClick) {
    const button = document.createElement('button');
    button.className = 'test-button';
    button.type = 'button';
    button.dataset.testId = item.id;
    const title = document.createElement('strong');
    title.textContent = item.label;
    const note = document.createElement('span');
    note.textContent = item.note;
    note.dataset.testNote = '';
    button.append(title, note);
    button.addEventListener('click', () => {
        stopSequence();
        markActive(button);
        void onClick(item, button);
    });
    return button;
}

function renderExpressionCases() {
    for (const item of EXPRESSION_CASES) {
        elements.expressionGrid.appendChild(createTestButton(item, async () => {
            await applySurface({
                emotion: item.emotion,
                taskState: item.id === 'neutral' || item.id === 'relaxed' ? 'idle' : 'speaking',
                gestureIntent: 'none',
                intensity: getRangeValue(elements.expressionIntensity, 0.65)
            }, item.label);
        }));
    }
}

function renderMotionCases() {
    elements.motionSystemCount.textContent = String(MOTION_CASES.length);
    const allOption = document.createElement('option');
    allOption.value = '';
    allOption.textContent = `全部动作（${MOTION_CASES.length}）`;
    elements.motionCategory.appendChild(allOption);
    for (const category of CHARACTER_ACTION_CATEGORIES) {
        const count = MOTION_CASES.filter((item) => item.category === category.id).length;
        const option = document.createElement('option');
        option.value = category.id;
        option.textContent = `${category.label}（${count}）`;
        elements.motionCategory.appendChild(option);
    }
    for (const item of MOTION_CASES) {
        const button = createTestButton(item, async () => {
            await applySurface({
                ...item.surface,
                durationHint: getDurationHint(),
                intensity: getRangeValue(elements.motionIntensity, 0.68)
            }, item.label);
        });
        button.dataset.category = item.category;
        elements.motionGrid.appendChild(button);
    }
}

function filterMotionCases() {
    const category = elements.motionCategory.value;
    for (const button of elements.motionGrid.querySelectorAll('[data-category]')) {
        button.hidden = Boolean(category && button.dataset.category !== category);
    }
}

function getVisibleMotionCases() {
    const category = elements.motionCategory.value;
    return MOTION_CASES.filter((item) => !category || item.category === category);
}

function getMotionCatalog(capabilities) {
    if (capabilities?.backend !== 'unity' || !Array.isArray(capabilities?.motions)) {
        return [];
    }
    return capabilities.motions
        .filter((motion) => motion?.id && (
            motion?.stateName ||
            motion?.file ||
            motion?.bakedClipResource ||
            motion?.nativeParameter
        ))
        .map((motion) => ({
            ...motion,
            id: String(motion.id),
            label: String(motion.displayName || motion.id),
            note: [
                    motion.loop ? '循环' : '单次',
                    motion.stateName ? `运行状态: ${motion.stateName}` : '',
                    motion.file ? `VRMA: ${motion.file}` : '',
                    motion.bakedClipResource
                        ? `Humanoid Clip: ${motion.bakedClipResource}`
                        : '',
                    motion.sourceId ? `来源: ${motion.sourceId}` : '',
                    motion.license ? `许可: ${motion.license}` : '',
                    motion.styleTags?.length
                        ? `风格: ${motion.styleTags.join(' / ')}`
                        : '',
                    normalizeSemantic(motion.compatibility || 'approved') === 'approved'
                        ? '已批准'
                        : normalizeSemantic(motion.compatibility || 'approved') === 'review'
                            ? `待审查${motion.fallbackMotionId ? `，自动调度回退 ${motion.fallbackMotionId}` : ''}`
                            : `已禁用${motion.acceptanceNote ? `：${motion.acceptanceNote}` : ''}`
            ].filter(Boolean).join(' · ')
        }))
        .sort((left, right) => {
            const priority = Number(right.priority || 0) - Number(left.priority || 0);
            return priority || left.id.localeCompare(right.id);
        });
}

function renderMotionCatalog(capabilities) {
    const catalog = getMotionCatalog(capabilities);
    const fingerprint = JSON.stringify(catalog.map((motion) => [
        motion.id,
        motion.displayName,
        motion.sourceId,
        motion.license,
        motion.stateName,
        motion.file,
        motion.bakedClipResource,
        motion.compatibility,
        motion.acceptanceGrade,
        motion.acceptanceNote,
        motion.fallbackMotionId
    ]));
    state.motionCatalog = catalog;
    elements.motionCatalogCount.textContent = String(catalog.length);
    elements.motionCatalogEmpty.classList.toggle('is-visible', catalog.length === 0);
    elements.motionCatalogSequenceBtn.disabled = catalog.length === 0;
    if (fingerprint === state.motionCatalogFingerprint) {
        return;
    }
    state.motionCatalogFingerprint = fingerprint;
    elements.motionCatalogGrid.replaceChildren();
    for (const motion of catalog) {
        const button = createTestButton(motion, async () => {
            await playMotion(motion, motion.id);
        });
        button.classList.toggle(
            'is-review',
            normalizeSemantic(motion.compatibility || 'approved') === 'review'
        );
        button.classList.toggle(
            'is-rejected',
            normalizeSemantic(motion.compatibility || 'approved') === 'rejected'
        );
        button.title = motion.collisionZones?.length
            ? `重点检查：${motion.collisionZones.join('、')}`
            : '';
        elements.motionCatalogGrid.appendChild(button);
    }
}

function findMotionMetadata(motionId) {
    const normalizedId = normalizeSemantic(motionId);
    return state.motionCatalog.find(
        (motion) => normalizeSemantic(motion.id) === normalizedId
    ) || null;
}

function formatPercent(value) {
    return `${Math.round(
        Math.max(0, Math.min(1, Number(value) || 0)) * 100
    )}%`;
}

function renderAnimationState(snapshot) {
    state.animationState = snapshot || null;
    const supported = snapshot?.supported === true;
    const ready = snapshot?.ready === true;
    elements.debugAdapter.textContent = snapshot?.adapterId || '未连接';
    elements.debugTaskState.textContent = snapshot?.taskState || '—';
    elements.debugEmotion.textContent = snapshot?.emotion || '—';
    elements.debugPlayback.textContent = snapshot?.paused
        ? '已暂停'
        : ready ? '播放中' : '未就绪';
    elements.pauseAnimationBtn.disabled =
        !supported || !ready || snapshot?.paused;
    elements.resumeAnimationBtn.disabled =
        !supported || !ready || !snapshot?.paused;
    elements.animationSeek.disabled = !supported || !ready;

    const layers = Array.isArray(snapshot?.layers)
        ? snapshot.layers
        : [];
    elements.animationLayerGrid.replaceChildren();
    for (const layerId of [
        'base',
        'additive',
        'gesture',
        'action',
        'face'
    ]) {
        const layer = layers.find((item) => item?.id === layerId) || {
            id: layerId,
            label: layerId[0].toUpperCase() + layerId.slice(1),
            active: false,
            weight: 0,
            normalizedTime: 0
        };
        const metadata = findMotionMetadata(layer.motionId);
        const card = document.createElement('article');
        card.className = 'state-layer';
        card.classList.toggle('is-active', layer.active === true);
        card.classList.toggle(
            'is-transitioning',
            layer.transitioning === true
        );

        const head = document.createElement('div');
        head.className = 'state-layer__head';
        const name = document.createElement('div');
        name.className = 'state-layer__name';
        name.textContent = layer.label || layer.id;
        const weight = document.createElement('div');
        weight.className = 'state-layer__weight';
        weight.textContent = formatPercent(layer.weight);
        head.append(name, weight);

        const motion = document.createElement('div');
        motion.className = 'state-layer__motion';
        motion.textContent = layer.motionId || '空闲';
        const meta = document.createElement('div');
        meta.className = 'state-layer__meta';
        meta.textContent = [
            layer.transitioning
                ? '过渡中'
                : layer.active ? '正在运行' : '未激活',
            metadata?.sourceId ? `来源 ${metadata.sourceId}` : '',
            metadata?.compatibility === 'review' ? '待审查资源' : '',
            metadata?.compatibility === 'rejected' ? '已禁用资源' : '',
            layer.clipName && layer.clipName !== layer.motionId
                ? `Clip ${layer.clipName}`
                : ''
        ].filter(Boolean).join(' · ');

        const progress = document.createElement('div');
        progress.className = 'state-progress';
        const progressBar = document.createElement('div');
        progressBar.className = 'state-progress__bar';
        progressBar.style.width = formatPercent(layer.normalizedTime);
        progress.appendChild(progressBar);
        card.append(head, motion, meta, progress);
        elements.animationLayerGrid.appendChild(card);
    }

    const selectedLayer = layers.find(
        (item) => item?.id === elements.debugLayerSelect.value
    );
    if (
        document.activeElement !== elements.animationSeek &&
        selectedLayer
    ) {
        const normalizedTime = Math.max(
            0,
            Math.min(1, Number(selectedLayer.normalizedTime) || 0)
        );
        elements.animationSeek.value = String(normalizedTime);
        elements.animationSeekValue.textContent =
            formatPercent(normalizedTime);
    }
    if (!supported) {
        elements.animationDebugNote.textContent =
            '当前人物适配器只能播放动作，尚未提供逐层状态调试；动作与表情测试仍可正常使用。';
    } else if (!ready) {
        elements.animationDebugNote.textContent =
            `动画运行时尚未就绪：${snapshot?.status || '正在加载人物'}`;
    } else {
        elements.animationDebugNote.textContent =
            '状态来自正式 Unity 人物进程。暂停与定位只影响动画预览，不会改变聊天或 Agent 状态。';
    }
}

async function refreshAnimationState() {
    if (
        state.animationRequestPending ||
        state.activeTab !== 'state' ||
        !window.ailisDesktop?.characterLab?.getAnimationState
    ) {
        return;
    }
    state.animationRequestPending = true;
    try {
        const result =
            await window.ailisDesktop.characterLab.getAnimationState();
        if (result?.animation) {
            renderAnimationState(result.animation);
        } else if (!result?.ok) {
            elements.animationDebugNote.textContent =
                result?.error === 'unity_character_renderer_not_ready'
                    ? '请先在控制面板的人物外观中启用 Unity 渲染。'
                    : `状态机读取失败：${result?.error || '未知错误'}`;
        }
    } catch (error) {
        elements.animationDebugNote.textContent =
            `状态机读取失败：${error?.message || '连接中断'}`;
    } finally {
        state.animationRequestPending = false;
    }
}

async function controlAnimation(operation, extra = {}) {
    if (!window.ailisDesktop?.characterLab?.controlAnimation) {
        setStatus(
            '动画调试接口尚未加载，请重启 AILIS。',
            '接口不可用'
        );
        return;
    }
    const result =
        await window.ailisDesktop.characterLab.controlAnimation({
            operation,
            ...extra
        });
    if (result?.animation) {
        renderAnimationState(result.animation);
    }
    if (!result?.ok) {
        setStatus(
            `动画调试操作失败：${result?.error || 'unknown_error'}`,
            '状态机'
        );
        return;
    }
    setStatus(
        operation === 'pause'
            ? '动画已暂停，可拖动播放位置检查姿态。'
            : operation === 'resume'
                ? '动画已继续播放。'
                : `已定位到 ${formatPercent(extra.normalizedTime)}。`,
        '状态机'
    );
}

function runSequence(cases, grid, applyItem, button, runningLabel) {
    if (state.sequenceTimer) {
        stopSequence();
        return;
    }
    const runnableCases = cases.filter((item) => (
        !grid.querySelector(`[data-test-id="${item.id}"]`)?.disabled
    ));
    if (runnableCases.length === 0) {
        setStatus('当前人物包没有可巡检的对应能力。', `${runningLabel}不可用`);
        return;
    }
    let index = 0;
    button.textContent = '停止巡检';
    const advance = () => {
        const item = runnableCases[index % runnableCases.length];
        const testButton = grid.querySelector(`[data-test-id="${item.id}"]`);
        markActive(testButton);
        void applyItem(item);
        index += 1;
    };
    setStatus('自动巡检已开始，每 2.4 秒切换一次。', runningLabel);
    advance();
    state.sequenceTimer = setInterval(advance, 2400);
}

function createExperienceSteps() {
    return [
        {
            label: '自然待机',
            holdMs: 2200,
            run: () => applySurface({
                emotion: 'relaxed',
                taskState: 'idle',
                gestureIntent: 'none',
                intensity: 0.35
            }, '自然待机')
        },
        {
            label: '挥手问候',
            holdMs: 3200,
            run: async () => {
                const text = '你好呀，我们来检查 Unity-Chan 的完整人物体验。';
                await showBubbleText(text, 'start');
                return applySurface({
                    emotion: 'happy',
                    taskState: 'speaking',
                    gestureIntent: 'greeting',
                    intensity: 0.72,
                    speechEnergy: 0.68,
                    speechText: text,
                    speechDurationSeconds: 3.1
                }, '挥手问候');
            }
        },
        {
            label: '自然说话与口型',
            holdMs: 3600,
            run: async () => {
                const text = '现在检查对话气泡、自然说话动作，以及文本驱动的无声口型。';
                await showBubbleText(text, 'update');
                return applySurface({
                    emotion: 'relaxed',
                    taskState: 'speaking',
                    gestureIntent: 'speaking',
                    intensity: 0.58,
                    speechEnergy: 0.62,
                    speechText: text,
                    speechDurationSeconds: 3.5
                }, '自然说话与口型');
            }
        },
        {
            label: '思考',
            holdMs: 2800,
            run: async () => {
                await showBubbleText('让我确认一下动作、表情和状态机是否一致。', 'update');
                return applySurface({
                    emotion: 'thinking',
                    taskState: 'thinking',
                    gestureIntent: 'thinking',
                    intensity: 0.66,
                    speechEnergy: 0,
                    speechText: '',
                    speechDurationSeconds: 0
                }, '思考');
            }
        },
        {
            label: '专注工作',
            holdMs: 3000,
            run: async () => {
                await showBubbleText('正在检查人物动作资源和运行状态。', 'update');
                return applySurface({
                    emotion: 'focused',
                    taskState: 'working',
                    gestureIntent: 'working',
                    intensity: 0.62,
                    speechEnergy: 0,
                    speechText: '',
                    speechDurationSeconds: 0
                }, '专注工作');
            }
        },
        {
            label: '完成庆祝',
            holdMs: 3200,
            run: async () => {
                const text = '检查完成，人物已经回到 AILIS 的语义驱动链路。';
                await showBubbleText(text, 'update');
                return applySurface({
                    emotion: 'victory',
                    taskState: 'happy_success',
                    gestureIntent: 'celebrate',
                    intensity: 0.82,
                    speechEnergy: 0.7,
                    speechText: text,
                    speechDurationSeconds: 3
                }, '完成庆祝');
            }
        },
        {
            label: '恢复待机',
            holdMs: 800,
            run: () => hideBubble()
        }
    ];
}

function runExperienceSequence() {
    if (state.sequenceTimer) {
        stopSequence();
        void hideBubble();
        setStatus('整体体验巡检已停止，人物已恢复待机。', '巡检停止');
        return;
    }

    const steps = createExperienceSteps();
    const token = ++state.sequenceToken;
    let index = 0;
    state.sequenceTimer = -1;
    elements.experienceSequenceBtn.textContent = '停止整体巡检';

    const advance = async () => {
        if (token !== state.sequenceToken) {
            return;
        }
        if (index >= steps.length) {
            stopSequence();
            markActive(null);
            setStatus('整体体验巡检完成：待机、动作、表情、口型和气泡均已走完。', '巡检完成');
            return;
        }

        const step = steps[index];
        setStatus(
            `正在执行 ${index + 1}/${steps.length}：${step.label}`,
            '整体体验巡检'
        );
        await step.run();
        if (token !== state.sequenceToken) {
            return;
        }
        index += 1;
        state.sequenceTimer = setTimeout(advance, step.holdMs);
    };

    void advance();
}

function renderBubblePresets() {
    for (const preset of BUBBLE_PRESETS) {
        const button = document.createElement('button');
        button.className = 'button';
        button.type = 'button';
        button.textContent = preset.label;
        button.addEventListener('click', () => {
            elements.bubbleText.value = preset.text;
            updateBubbleCount();
        });
        elements.bubblePresets.appendChild(button);
    }
}

function updateBubbleCount() {
    elements.bubbleCount.textContent = `${elements.bubbleText.value.length} 字`;
}

async function publishBubble(phase) {
    const text = elements.bubbleText.value.trim();
    if (!text) {
        setStatus('请先输入气泡文本。', '气泡待输入');
        elements.bubbleText.focus();
        return;
    }
    const result = await showBubbleText(text, phase);
    if (!result) {
        return;
    }
    if (elements.bubbleSyncSpeech.checked) {
        await applySurface({
            emotion: 'relaxed',
            taskState: 'speaking',
            gestureIntent: 'none',
            intensity: 0.45,
            speechEnergy: 0.62,
            speechText: text,
            speechDurationSeconds: Math.min(60, Math.max(1.2, text.length * 0.075))
        }, '气泡说话');
    } else {
        setStatus(phase === 'update' ? '气泡内容已更新。' : '气泡已显示。', '气泡测试');
    }
}

async function showBubbleText(text, phase = 'start') {
    state.bubbleId ||= `character-lab-bubble-${Date.now()}`;
    const result = await window.ailisDesktop?.characterLab?.publishBubble?.({
        phase,
        id: state.bubbleId,
        text
    });
    if (!result?.ok) {
        setStatus('气泡没有显示，请确认桌宠当前可见。', '气泡失败');
        return false;
    }
    return true;
}

async function hideBubble() {
    state.bubbleId = '';
    await window.ailisDesktop?.characterLab?.hideBubble?.();
    await applySurface({
        emotion: 'relaxed',
        taskState: 'idle',
        gestureIntent: 'none',
        intensity: 0.35,
        speechEnergy: 0,
        speechText: '',
        speechDurationSeconds: 0
    }, '待机');
    setStatus('气泡已隐藏，人物已恢复待机。', '待机');
}

async function refreshRuntimeStatus() {
    try {
        const [runtime, capabilities] = await Promise.all([
            window.ailisDesktop?.characterLab?.getStatus?.(),
            window.ailisDesktop?.characterLab?.getCapabilities?.()
        ]);
        state.capabilities = capabilities || null;
        const backend = runtime?.effectiveBackend === 'unity' ? 'Unity' : 'Three.js';
        const detail = runtime?.effectiveBackend === 'unity'
            ? runtime.status === 'ready' ? '已连接' : runtime.status || '未就绪'
            : 'Electron';
        const characterName = capabilities?.displayName || capabilities?.packageId || '';
        elements.runtimeStatus.textContent = `${backend} · ${detail}${characterName ? ` · ${characterName}` : ''}`;
        renderCharacterSelector(capabilities);
        applyCapabilityLabels();
        renderMotionCatalog(capabilities);
    } catch {
        elements.runtimeStatus.textContent = '状态读取失败';
    }
}

for (const tab of elements.tabs) {
    tab.addEventListener('click', () => {
        selectTab(tab.dataset.tab);
    });
}

elements.openStateMachineBtn.addEventListener(
    'click',
    () => selectTab('state')
);
elements.experienceSequenceBtn.addEventListener(
    'click',
    runExperienceSequence
);
elements.refreshAnimationStateBtn.addEventListener(
    'click',
    () => void refreshAnimationState()
);
elements.pauseAnimationBtn.addEventListener(
    'click',
    () => void controlAnimation('pause')
);
elements.resumeAnimationBtn.addEventListener(
    'click',
    () => void controlAnimation('resume')
);
elements.animationSeek.addEventListener('input', () => {
    elements.animationSeekValue.textContent =
        formatPercent(elements.animationSeek.value);
});
elements.animationSeek.addEventListener('change', () => {
    void controlAnimation('seek', {
        layer: elements.debugLayerSelect.value,
        normalizedTime: getRangeValue(elements.animationSeek, 0)
    });
});
elements.debugLayerSelect.addEventListener('change', () => {
    renderAnimationState(state.animationState);
});

elements.expressionIntensity.addEventListener('input', () => {
    elements.expressionIntensityValue.textContent =
        `${Math.round(getRangeValue(elements.expressionIntensity, 0.65) * 100)}%`;
});
elements.motionIntensity.addEventListener('input', () => {
    elements.motionIntensityValue.textContent =
        `${Math.round(getRangeValue(elements.motionIntensity, 0.68) * 100)}%`;
});
elements.expressionSequenceBtn.addEventListener('click', () => {
    runSequence(
        EXPRESSION_CASES,
        elements.expressionGrid,
        (item) => applySurface({
            emotion: item.emotion,
            taskState: item.id === 'neutral' || item.id === 'relaxed' ? 'idle' : 'speaking',
            gestureIntent: 'none',
            intensity: getRangeValue(elements.expressionIntensity, 0.65)
        }, item.label),
        elements.expressionSequenceBtn,
        '表情巡检'
    );
});
elements.motionSequenceBtn.addEventListener('click', () => {
    runSequence(
        getVisibleMotionCases(),
        elements.motionGrid,
        (item) => applySurface({
            ...item.surface,
            durationHint: getDurationHint(),
            intensity: getRangeValue(elements.motionIntensity, 0.68)
        }, item.label),
        elements.motionSequenceBtn,
        '动作巡检'
    );
});
elements.motionCategory.addEventListener('change', () => {
    stopSequence();
    markActive(null);
    filterMotionCases();
});
elements.characterPackageSelect.addEventListener('change', updateCharacterSelectionMeta);
elements.switchCharacterBtn.addEventListener('click', () => void switchCharacter());
elements.motionCatalogSequenceBtn.addEventListener('click', () => {
    runSequence(
        state.motionCatalog,
        elements.motionCatalogGrid,
        (motion) => playMotion(motion, motion.id),
        elements.motionCatalogSequenceBtn,
        '人物包动作巡检'
    );
});
elements.resetExpressionBtn.addEventListener('click', () => {
    stopSequence();
    markActive(null);
    void applySurface({
        emotion: 'neutral',
        taskState: 'idle',
        gestureIntent: 'none',
        intensity: 0.35
    }, '中性');
});
elements.stopMotionBtn.addEventListener('click', () => {
    stopSequence();
    markActive(null);
    void applySurface({
        emotion: 'relaxed',
        taskState: 'idle',
        gestureIntent: 'none',
        durationHint: 'hold',
        intensity: 0.35
    }, '待机');
});
elements.bubbleText.addEventListener('input', updateBubbleCount);
elements.showBubbleBtn.addEventListener('click', () => void publishBubble('start'));
elements.updateBubbleBtn.addEventListener('click', () => void publishBubble('update'));
elements.hideBubbleBtn.addEventListener('click', () => void hideBubble());
elements.minimizeBtn.addEventListener('click', () => void window.ailisDesktop?.minimizeCurrentWindow?.());
elements.maximizeBtn.addEventListener('click', () => void window.ailisDesktop?.toggleMaximizeCurrentWindow?.());
elements.closeBtn.addEventListener('click', () => void window.ailisDesktop?.closeCurrentWindow?.());

renderExpressionCases();
renderMotionCases();
renderBubblePresets();
updateBubbleCount();
void refreshRuntimeStatus();
const runtimeRefreshTimer = setInterval(refreshRuntimeStatus, 3000);
const animationStateRefreshTimer = setInterval(
    () => void refreshAnimationState(),
    280
);

window.addEventListener('beforeunload', () => {
    stopSequence();
    clearInterval(runtimeRefreshTimer);
    clearInterval(animationStateRefreshTimer);
});
