import { getMotionReviewStatus, listMotionLibrary } from './motion-library.js';
import { getMotionIntakeSource } from './motion-intake-catalog.js';

const EXPRESSION_CASES = Object.freeze([
    ['neutral', '中性'],
    ['relaxed', '放松'],
    ['happy', '开心'],
    ['shy', '害羞'],
    ['love', '亲近'],
    ['sad', '难过'],
    ['angry', '生气'],
    ['surprised', '惊讶'],
    ['serious', '认真'],
    ['suspicious', '疑惑'],
    ['victory', '成功'],
    ['sleep', '困倦'],
    ['jealous', '吃醋'],
    ['bored', '无聊']
]);

const STATE_CASES = Object.freeze([
    ['idle', '待机', { emotion: 'relaxed', taskState: 'idle', gestureIntent: 'none', gazeTarget: 'user', durationHint: 'hold' }],
    ['listening', '倾听', { emotion: 'relaxed', taskState: 'listening', gestureIntent: 'listening', gazeTarget: 'user', durationHint: 'hold' }],
    ['thinking', '思考', { emotion: 'thinking', taskState: 'thinking', gestureIntent: 'thinking', gazeTarget: 'side', durationHint: 'medium' }],
    ['working', '工作', { emotion: 'serious', taskState: 'working', gestureIntent: 'working', gazeTarget: 'screen', durationHint: 'hold' }],
    ['waiting_approval', '等待确认', { emotion: 'relaxed', taskState: 'waiting_approval', gestureIntent: 'approval', gazeTarget: 'user', durationHint: 'medium' }],
    ['comforting', '安慰', { emotion: 'relaxed', taskState: 'comforting', gestureIntent: 'comfort', gazeTarget: 'user', durationHint: 'medium' }],
    ['apologizing', '道歉', { emotion: 'sad', taskState: 'apologizing', gestureIntent: 'apologize', gazeTarget: 'down', durationHint: 'medium' }],
    ['blocked', '卡住', { emotion: 'suspicious', taskState: 'blocked', gestureIntent: 'thinking', gazeTarget: 'side', durationHint: 'medium' }],
    ['happy_success', '完成', { emotion: 'victory', taskState: 'happy_success', gestureIntent: 'success', gazeTarget: 'user', durationHint: 'medium' }]
]);

const MOTION_REVIEW_ORDER = Object.freeze([
    'idle',
    'idle1',
    'idle2',
    'thinking',
    'lookaround',
    'blush',
    'relax',
    'goodbye',
    'clapping',
    'jump',
    'angry',
    'sad',
    'sleepy',
    'surprised',
    'vrma17',
    'vrma25',
    'vroid_show_full_body',
    'vroid_greeting',
    'vroid_peace',
    'vroid_shoot',
    'vroid_spin',
    'vroid_model_pose',
    'vroid_squat'
]);

function createMotionCases() {
    const library = listMotionLibrary();
    const libraryById = new Map(library.map((motion) => [motion.id, motion]));
    const orderedMotions = MOTION_REVIEW_ORDER
        .map((motionId) => libraryById.get(motionId))
        .filter(Boolean);
    const orderedIds = new Set(orderedMotions.map((motion) => motion.id));
    const externalMotions = library
        .filter((motion) => !orderedIds.has(motion.id))
        .sort((left, right) => {
            const sourceCompare = String(left.intake?.source || '').localeCompare(String(right.intake?.source || ''));
            if (sourceCompare !== 0) {
                return sourceCompare;
            }
            return left.id.localeCompare(right.id);
        });
    return [...orderedMotions, ...externalMotions].map((motion) => {
        if (!motion) {
            return null;
        }
        return [motion.id, motion.intake?.displayName || motion.id, motion];
    }).filter(Boolean);
}

const MOTION_CASES = Object.freeze(createMotionCases());

function createElement(tagName, className = '', text = '') {
    const element = document.createElement(tagName);
    if (className) {
        element.className = className;
    }
    if (text) {
        element.textContent = text;
    }
    return element;
}

function normalizePercent(value) {
    const numberValue = Number(value);
    if (!Number.isFinite(numberValue)) {
        return '0%';
    }
    return `${Math.round(numberValue * 100)}%`;
}

function formatMotionReviewTitle(actionName) {
    const motion = listMotionLibrary().find((item) => item.id === actionName);
    const intake = motion?.intake || null;
    const source = getMotionIntakeSource(intake?.source);
    if (!intake) {
        return '未进入 motion intake 账本，禁止进入稳定 Runtime。';
    }
    return [
        `状态: ${getMotionReviewStatus(actionName)}`,
        `来源: ${source?.title || intake.source}`,
        `许可: ${intake.license}`,
        `风格: ${intake.style.join(', ')}`,
        `女性化: ${Math.round(Number(intake.feminineScore || 0) * 100)}%`,
        `穿模风险: ${intake.clippingRisk}`,
        `稳定 Runtime: ${intake.approved ? '允许' : '禁止'}`,
        intake.notes ? `备注: ${intake.notes}` : ''
    ].filter(Boolean).join('\n');
}

function getVrmSystem() {
    return window.vrmSystem || null;
}

function getLabStatus() {
    const vrmSystem = getVrmSystem();
    if (!vrmSystem) {
        return {
            ready: false,
            text: 'VRM 未就绪'
        };
    }

    const surface = vrmSystem.currentSurfaceState || {};
    const emote = vrmSystem.characterEmoteController || {};
    const motion = vrmSystem.getCurrentActionName?.() || 'none';
    return {
        ready: Boolean(vrmSystem.isModelLoaded),
        text: [
            `模型: ${vrmSystem.isModelLoaded ? '已加载' : '加载中'}`,
            `动作: ${motion}`,
            `状态: ${surface.taskState || '-'}`,
            `情绪: ${surface.emotion || '-'}`,
            `口型: ${normalizePercent(emote.lipSyncValue || 0)}`
        ].join(' | ')
    };
}

function injectLabStyles() {
    if (document.getElementById('ailis-character-lab-style')) {
        return;
    }

    const style = document.createElement('style');
    style.id = 'ailis-character-lab-style';
    style.textContent = `
        .ailis-character-lab-toggle {
            position: fixed;
            left: 14px;
            bottom: 14px;
            z-index: 2147483640;
            border: 1px solid rgba(92, 142, 170, 0.28);
            background: rgba(255, 255, 255, 0.88);
            color: #24526d;
            border-radius: 999px;
            padding: 7px 11px;
            font-size: 12px;
            line-height: 1;
            box-shadow: 0 8px 28px rgba(23, 60, 82, 0.12);
            cursor: pointer;
            backdrop-filter: blur(10px);
        }

        .ailis-character-lab {
            position: fixed;
            left: 14px;
            bottom: 52px;
            z-index: 2147483641;
            width: min(360px, calc(100vw - 28px));
            max-height: min(680px, calc(100vh - 72px));
            display: none;
            flex-direction: column;
            gap: 10px;
            padding: 12px;
            border: 1px solid rgba(92, 142, 170, 0.24);
            border-radius: 8px;
            background: rgba(248, 252, 255, 0.94);
            color: #173c52;
            box-shadow: 0 18px 45px rgba(23, 60, 82, 0.18);
            backdrop-filter: blur(14px);
            overflow: auto;
            user-select: none;
        }

        .ailis-character-lab.is-open {
            display: flex;
        }

        .ailis-character-lab__header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 8px;
        }

        .ailis-character-lab__title {
            font-size: 14px;
            font-weight: 700;
        }

        .ailis-character-lab__status {
            padding: 7px 8px;
            border-radius: 6px;
            background: rgba(115, 184, 229, 0.12);
            color: #335e75;
            font-size: 11px;
            line-height: 1.45;
        }

        .ailis-character-lab__section {
            display: flex;
            flex-direction: column;
            gap: 6px;
        }

        .ailis-character-lab__section-title {
            font-size: 12px;
            font-weight: 700;
            color: #4a7187;
        }

        .ailis-character-lab__grid {
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 6px;
        }

        .ailis-character-lab__button {
            min-width: 0;
            min-height: 30px;
            border: 1px solid rgba(92, 142, 170, 0.22);
            border-radius: 6px;
            background: rgba(255, 255, 255, 0.86);
            color: #244f66;
            font-size: 12px;
            cursor: pointer;
        }

        .ailis-character-lab__button:hover {
            background: rgba(225, 244, 255, 0.92);
        }

        .ailis-character-lab__button.is-danger {
            color: #8b3741;
            border-color: rgba(139, 55, 65, 0.25);
            background: rgba(255, 246, 247, 0.92);
        }

        .ailis-character-lab__button.is-wide {
            grid-column: span 2;
        }

        .ailis-character-lab__hint {
            color: #648296;
            font-size: 11px;
            line-height: 1.45;
        }
    `;
    document.head.appendChild(style);
}

export function installCharacterRuntimeLab({ rootElement = document.body } = {}) {
    if (typeof window === 'undefined' || window.__ailisCharacterRuntimeLabInstalled) {
        return null;
    }
    window.__ailisCharacterRuntimeLabInstalled = true;
    injectLabStyles();

    const state = {
        open: window.localStorage?.getItem('ailis_character_lab_open') === '1',
        sequenceTimer: null,
        pulseTimer: null
    };

    const toggleButton = createElement('button', 'ailis-character-lab-toggle', '角色验收');
    toggleButton.type = 'button';
    toggleButton.title = '打开/关闭角色验收面板，快捷键 Ctrl+Shift+L';

    const panel = createElement('section', 'ailis-character-lab');
    panel.setAttribute('aria-label', 'AILIS 角色验收面板');

    const header = createElement('div', 'ailis-character-lab__header');
    header.append(
        createElement('div', 'ailis-character-lab__title', '角色 Runtime 验收'),
        createElement('button', 'ailis-character-lab__button', '关闭')
    );
    const closeButton = header.querySelector('button');

    const status = createElement('div', 'ailis-character-lab__status');
    const sequenceLabel = createElement('div', 'ailis-character-lab__hint', '当前巡检：手动');

    function setOpen(open) {
        state.open = Boolean(open);
        panel.classList.toggle('is-open', state.open);
        window.localStorage?.setItem('ailis_character_lab_open', state.open ? '1' : '0');
    }

    function stopSequence({ resetIdle = true } = {}) {
        clearInterval(state.sequenceTimer);
        state.sequenceTimer = null;
        clearInterval(state.pulseTimer);
        state.pulseTimer = null;
        sequenceLabel.textContent = '当前巡检：手动';
        const vrmSystem = getVrmSystem();
        vrmSystem?.stopSpeaking?.();
        if (resetIdle) {
            vrmSystem?.playResolvedAction?.('idle');
            vrmSystem?.applyPersonaSurfacePayload?.({
                display_text: '',
                surface: {
                    emotion: 'relaxed',
                    taskState: 'idle',
                    gestureIntent: 'none',
                    durationHint: 'hold',
                    source: 'character_lab_stop'
                }
            }, {
                source: 'character_lab_stop'
            });
        }
    }

    function applySurface(surfacePatch = {}, label = '') {
        const vrmSystem = getVrmSystem();
        if (!vrmSystem?.applyPersonaSurfacePayload) {
            sequenceLabel.textContent = '当前巡检：VRM 未就绪';
            return null;
        }
        return vrmSystem.applyPersonaSurfacePayload({
            display_text: label,
            surface: {
                intensity: 0.55,
                socialTone: 'soft',
                speechEnergy: 0.42,
                gazeTarget: 'user',
                durationHint: 'medium',
                source: 'character_lab',
                ...surfacePatch
            }
        }, {
            source: 'character_lab'
        });
    }

    function testExpression(emotion, label) {
        stopSequence({ resetIdle: false });
        const taskState = emotion === 'neutral' || emotion === 'relaxed' ? 'idle' : 'speaking';
        applySurface({
            emotion,
            taskState,
            gestureIntent: 'none',
            text: label
        }, label);
        sequenceLabel.textContent = `当前巡检：表情 - ${label}`;
    }

    function testState(surface, label) {
        stopSequence({ resetIdle: false });
        applySurface(surface, label);
        sequenceLabel.textContent = `当前巡检：小动作/状态 - ${label}`;
    }

    function testMotion(actionName, label) {
        stopSequence({ resetIdle: false });
        const vrmSystem = getVrmSystem();
        let played = false;
        if (actionName === 'idle') {
            played = Boolean(vrmSystem?.playResolvedAction?.('idle'));
        } else {
            played = Boolean(vrmSystem?.playAction?.(actionName, {
                allowExperimental: true
            }));
        }
        sequenceLabel.textContent = `当前巡检：实验大动作 - ${label}${played ? '' : '（未加载或播放失败）'}`;
    }

    function startSequence(items, runner, intervalMs, prefix) {
        stopSequence({ resetIdle: false });
        let index = 0;
        const runNext = () => {
            const item = items[index % items.length];
            runner(item);
            sequenceLabel.textContent = `当前巡检：${prefix} ${index + 1}/${items.length} - ${item[1]}`;
            index += 1;
        };
        runNext();
        state.sequenceTimer = setInterval(runNext, intervalMs);
    }

    function startLipPulse() {
        stopSequence({ resetIdle: false });
        const vrmSystem = getVrmSystem();
        if (!vrmSystem) {
            return;
        }
        vrmSystem.startAudioDrivenSpeech?.();
        let phase = 0;
        state.pulseTimer = setInterval(() => {
            phase += 0.35;
            const value = 0.18 + Math.max(0, Math.sin(phase)) * 0.62;
            vrmSystem.setLipSyncValue?.(value);
        }, 90);
        sequenceLabel.textContent = '当前巡检：口型脉冲';
    }

    function createSection(title, cases, handler, options = {}) {
        const section = createElement('div', 'ailis-character-lab__section');
        section.appendChild(createElement('div', 'ailis-character-lab__section-title', title));
        const grid = createElement('div', 'ailis-character-lab__grid');
        for (const item of cases) {
            const label = options.getLabel?.(item) || item[1];
            const button = createElement('button', 'ailis-character-lab__button', label);
            const titleText = options.getTitle?.(item);
            if (titleText) {
                button.title = titleText;
            }
            button.type = 'button';
            button.addEventListener('click', () => handler(item));
            grid.appendChild(button);
        }
        section.appendChild(grid);
        return section;
    }

    const expressionSection = createSection('表情验收', EXPRESSION_CASES, ([emotion, label]) => {
        testExpression(emotion, label);
    });

    const stateSection = createSection('小动作/状态验收', STATE_CASES, ([, label, surface]) => {
        testState(surface, label);
    });

    const motionSection = createSection('实验大动作/VRMA 验收', MOTION_CASES, ([actionName, label]) => {
        testMotion(actionName, label);
    }, {
        getLabel: ([actionName, label]) => {
            const status = getMotionReviewStatus(actionName);
            return status === 'approved' ? label : `${label}*`;
        },
        getTitle: ([actionName]) => {
            return formatMotionReviewTitle(actionName);
        }
    });

    const automationSection = createElement('div', 'ailis-character-lab__section');
    automationSection.appendChild(createElement('div', 'ailis-character-lab__section-title', '自动巡检'));
    const automationGrid = createElement('div', 'ailis-character-lab__grid');
    const autoExpressionsButton = createElement('button', 'ailis-character-lab__button is-wide', '自动表情');
    autoExpressionsButton.type = 'button';
    autoExpressionsButton.addEventListener('click', () => {
        startSequence(EXPRESSION_CASES, ([emotion, label]) => testExpression(emotion, label), 2600, '表情');
    });
    const autoStatesButton = createElement('button', 'ailis-character-lab__button', '自动状态');
    autoStatesButton.type = 'button';
    autoStatesButton.addEventListener('click', () => {
        startSequence(STATE_CASES, ([, label, surface]) => testState(surface, label), 3600, '状态');
    });
    const autoMotionsButton = createElement('button', 'ailis-character-lab__button', '自动动作');
    autoMotionsButton.type = 'button';
    autoMotionsButton.addEventListener('click', () => {
        startSequence(MOTION_CASES, ([actionName, label]) => testMotion(actionName, label), 4700, '实验动作');
    });
    const lipButton = createElement('button', 'ailis-character-lab__button', '口型脉冲');
    lipButton.type = 'button';
    lipButton.addEventListener('click', startLipPulse);
    const stopButton = createElement('button', 'ailis-character-lab__button is-danger', '停止/回待机');
    stopButton.type = 'button';
    stopButton.addEventListener('click', () => stopSequence());
    automationGrid.append(autoExpressionsButton, autoStatesButton, autoMotionsButton, lipButton, stopButton);
    automationSection.appendChild(automationGrid);

    const hint = createElement(
        'div',
        'ailis-character-lab__hint',
        '建议先点“自动状态”看小动作。带 * 的 VRMA 是实验资产：可手动查看，但默认不会进入普通对话表现链路。'
    );

    panel.append(header, status, sequenceLabel, expressionSection, stateSection, motionSection, automationSection, hint);
    rootElement.append(toggleButton, panel);

    function updateStatus() {
        status.textContent = getLabStatus().text;
    }

    toggleButton.addEventListener('click', (event) => {
        event.stopPropagation();
        setOpen(!state.open);
    });
    closeButton.addEventListener('click', (event) => {
        event.stopPropagation();
        setOpen(false);
    });
    panel.addEventListener('pointerdown', (event) => event.stopPropagation());
    panel.addEventListener('click', (event) => event.stopPropagation());
    toggleButton.addEventListener('pointerdown', (event) => event.stopPropagation());

    window.addEventListener('keydown', (event) => {
        if (event.ctrlKey && event.shiftKey && event.code === 'KeyL') {
            event.preventDefault();
            setOpen(!state.open);
        }
        if (event.key === 'Escape' && state.open) {
            setOpen(false);
        }
    });

    window.ailisDesktop?.onCharacterLabToggle?.(() => {
        setOpen(true);
    });

    setOpen(state.open);
    updateStatus();
    setInterval(updateStatus, 250);

    return {
        open: () => setOpen(true),
        close: () => setOpen(false),
        stop: stopSequence,
        testExpression,
        testMotion,
        testState
    };
}
