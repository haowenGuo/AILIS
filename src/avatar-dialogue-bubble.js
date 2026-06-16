export const AVATAR_SPEECH_EVENT_NAME = 'ailis-avatar-speech-event';

const BUBBLE_STYLE_ID = 'ailis-avatar-dialogue-bubble-style';
const BUBBLE_HIDE_DELAY_MS = 1400;
const BUBBLE_POSITION_STORAGE_PREFIX = 'ailis-avatar-dialogue-bubble-position';
const BUBBLE_EDGE_PADDING = 8;
const DEFAULT_PET_BUBBLE_LEFT = 8;
const DEFAULT_PET_BUBBLE_TOP = 8;
const DEFAULT_PET_BUBBLE_SCALE = 1;
const DEFAULT_PET_BUBBLE_EXTRA_WIDTH = 220;
const DEFAULT_PET_BUBBLE_EXTRA_TOP = 190;
const PET_DIALOGUE_WINDOW_EXPANSION_ENABLED = false;
const PET_BUBBLE_AVATAR_GAP = 12;

function clampNumber(value, minimum, maximum, fallbackValue, digits = 2) {
    const numericValue = Number(value);
    if (!Number.isFinite(numericValue)) {
        return fallbackValue;
    }
    const clampedValue = Math.min(Math.max(numericValue, minimum), maximum);
    return Number(clampedValue.toFixed(digits));
}

function normalizePetBubbleSettings(preferences = {}) {
    return {
        left: Math.round(clampNumber(
            preferences.avatarDialogueBubbleLeft,
            0,
            640,
            DEFAULT_PET_BUBBLE_LEFT,
            0
        )),
        top: Math.round(clampNumber(
            preferences.avatarDialogueBubbleTop,
            0,
            480,
            DEFAULT_PET_BUBBLE_TOP,
            0
        )),
        scale: clampNumber(
            preferences.avatarDialogueBubbleScale,
            0.75,
            1.35,
            DEFAULT_PET_BUBBLE_SCALE,
            2
        ),
        extraWidth: Math.round(clampNumber(
            preferences.avatarDialogueBubbleExtraWidth,
            0,
            520,
            DEFAULT_PET_BUBBLE_EXTRA_WIDTH,
            0
        )),
        extraTop: Math.round(clampNumber(
            preferences.avatarDialogueBubbleExtraTop,
            0,
            360,
            DEFAULT_PET_BUBBLE_EXTRA_TOP,
            0
        ))
    };
}

function installBubbleStyle() {
    if (document.getElementById(BUBBLE_STYLE_ID)) {
        return;
    }

    const style = document.createElement('style');
    style.id = BUBBLE_STYLE_ID;
    style.textContent = `
        .avatar-dialogue-bubble {
            --avatar-dialogue-bubble-scale: 1;
            position: absolute;
            left: 32%;
            top: 34px;
            z-index: 30;
            width: max-content;
            min-width: min(220px, calc(100% - 40px));
            max-width: min(460px, calc(100% - 40px));
            padding: 13px 16px;
            border: 2px solid rgba(86, 143, 184, 0.52);
            border-radius: 8px;
            background:
                linear-gradient(90deg, rgba(123, 184, 223, 0.28), transparent 34px),
                linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(246, 252, 255, 0.94)),
                radial-gradient(circle at 18px 14px, rgba(255, 255, 255, 0.9), transparent 36px);
            box-shadow:
                0 14px 34px rgba(55, 112, 151, 0.16),
                0 3px 0 rgba(123, 184, 223, 0.22),
                inset 4px 0 0 rgba(123, 184, 223, 0.34);
            color: #263847;
            font-size: 15px;
            line-height: 1.56;
            letter-spacing: 0;
            pointer-events: none;
            user-select: none;
            -webkit-user-select: none;
            touch-action: none;
            opacity: 0;
            transform: translateY(-8px) scale(var(--avatar-dialogue-bubble-scale)) scale(0.98);
            transform-origin: 28px 100%;
            transition: opacity 180ms ease, transform 180ms ease;
            filter: drop-shadow(0 8px 18px rgba(82, 137, 174, 0.14));
        }

        .avatar-dialogue-bubble--visible {
            cursor: grab;
            opacity: 1;
            pointer-events: auto;
            transform: translateY(0) scale(var(--avatar-dialogue-bubble-scale));
        }

        .avatar-dialogue-bubble--dragging {
            cursor: grabbing;
            transition: opacity 120ms ease;
        }

        .avatar-dialogue-bubble__text {
            display: -webkit-box;
            -webkit-line-clamp: 7;
            -webkit-box-orient: vertical;
            max-height: 10.9em;
            overflow: hidden;
            white-space: pre-wrap;
            word-break: break-word;
        }

        .avatar-dialogue-bubble--pet {
            left: 8px;
            top: 0;
            min-width: min(188px, calc(100% - 24px));
            max-width: min(260px, calc(100% - 24px));
            padding: 10px 12px;
            font-size: 13px;
            line-height: 1.48;
            box-shadow:
                0 10px 24px rgba(55, 112, 151, 0.18),
                0 3px 0 rgba(123, 184, 223, 0.22),
                inset 4px 0 0 rgba(123, 184, 223, 0.34);
        }

        .avatar-dialogue-bubble--pet .avatar-dialogue-bubble__text {
            -webkit-line-clamp: 5;
            max-height: 7.4em;
        }

        @media (max-width: 768px) {
            .avatar-dialogue-bubble:not(.avatar-dialogue-bubble--pet) {
                left: 18px;
                top: 28px;
                max-width: calc(100% - 28px);
                font-size: 14px;
            }
        }
    `;
    document.head.appendChild(style);
}

function getPositionStorageKey(variant) {
    return `${BUBBLE_POSITION_STORAGE_PREFIX}:${variant}`;
}

function readStoredPosition(variant) {
    try {
        const rawValue = window.localStorage.getItem(getPositionStorageKey(variant));
        const parsed = rawValue ? JSON.parse(rawValue) : null;
        if (
            parsed &&
            Number.isFinite(parsed.left) &&
            Number.isFinite(parsed.top)
        ) {
            return {
                left: parsed.left,
                top: parsed.top
            };
        }
    } catch (error) {
        console.warn('读取人物对话框位置失败：', error);
    }

    return null;
}

function saveStoredPosition(variant, position) {
    try {
        window.localStorage.setItem(
            getPositionStorageKey(variant),
            JSON.stringify({
                left: Math.round(position.left),
                top: Math.round(position.top)
            })
        );
    } catch (error) {
        console.warn('保存人物对话框位置失败：', error);
    }
}

function clampBubblePosition(rootElement, bubbleEl, position) {
    const rootRect = rootElement.getBoundingClientRect();
    const bubbleRect = bubbleEl.getBoundingClientRect();
    const maxLeft = Math.max(BUBBLE_EDGE_PADDING, rootRect.width - bubbleRect.width - BUBBLE_EDGE_PADDING);
    const maxTop = Math.max(BUBBLE_EDGE_PADDING, rootRect.height - bubbleRect.height - BUBBLE_EDGE_PADDING);

    return {
        left: Math.min(Math.max(position.left, BUBBLE_EDGE_PADDING), maxLeft),
        top: Math.min(Math.max(position.top, BUBBLE_EDGE_PADDING), maxTop)
    };
}

function normalizeAvatarBounds(bounds) {
    if (!bounds || typeof bounds !== 'object') {
        return null;
    }

    const left = Number(bounds.left);
    const top = Number(bounds.top);
    const right = Number(bounds.right);
    const bottom = Number(bounds.bottom);
    const width = Number(bounds.width) || right - left;
    const height = Number(bounds.height) || bottom - top;
    if (
        !Number.isFinite(left) ||
        !Number.isFinite(top) ||
        !Number.isFinite(right) ||
        !Number.isFinite(bottom) ||
        width <= 0 ||
        height <= 0 ||
        right <= left ||
        bottom <= top
    ) {
        return null;
    }

    return {
        left,
        top,
        right,
        bottom,
        width,
        height,
        centerX: Number.isFinite(Number(bounds.centerX)) ? Number(bounds.centerX) : left + width / 2,
        centerY: Number.isFinite(Number(bounds.centerY)) ? Number(bounds.centerY) : top + height / 2
    };
}

export function installAvatarDialogueBubble({
    rootElement = document.body,
    variant = 'main',
    avatarBoundsProvider = null
} = {}) {
    if (!rootElement) {
        return () => {};
    }

    installBubbleStyle();

    const bubbleEl = document.createElement('div');
    bubbleEl.className = `avatar-dialogue-bubble avatar-dialogue-bubble--${variant}`;
    bubbleEl.setAttribute('role', 'status');
    bubbleEl.setAttribute('aria-live', 'polite');

    const textEl = document.createElement('div');
    textEl.className = 'avatar-dialogue-bubble__text';
    bubbleEl.appendChild(textEl);
    rootElement.appendChild(bubbleEl);

    let hideTimer = 0;
    let activeSpeechId = '';
    let dragState = null;
    let lifecycleToken = 0;
    let petReservedTop = 0;
    let petReservedTopRequest = 0;
    let petReservedWidthRequest = 0;
    let petReservedLeft = 0;
    let petReservedRight = 0;
    let bubbleSettings = normalizePetBubbleSettings(window.ailisDesktop?.preferences || {});

    const usesDesktopBubbleSettings = () => variant === 'pet' && Boolean(window.ailisDesktop);

    const applyBubbleScale = () => {
        const scale = usesDesktopBubbleSettings() ? bubbleSettings.scale : DEFAULT_PET_BUBBLE_SCALE;
        bubbleEl.style.setProperty('--avatar-dialogue-bubble-scale', String(scale));
    };

    const getConfiguredPosition = () => {
        if (usesDesktopBubbleSettings()) {
            return {
                left: bubbleSettings.left,
                top: bubbleSettings.top
            };
        }

        return readStoredPosition(variant);
    };

    const persistPosition = (safePosition) => {
        if (!usesDesktopBubbleSettings()) {
            saveStoredPosition(variant, safePosition);
            return;
        }

        bubbleSettings = {
            ...bubbleSettings,
            left: Math.round(safePosition.left),
            top: Math.round(safePosition.top)
        };

        const savePromise = window.ailisDesktop?.savePreferences?.({
            avatarDialogueBubbleLeft: bubbleSettings.left,
            avatarDialogueBubbleTop: bubbleSettings.top
        });
        savePromise?.catch?.((error) => {
            console.warn('保存人物对话框位置失败：', error);
        });
    };

    const applyPosition = (position, { persist = false } = {}) => {
        const safePosition = clampBubblePosition(rootElement, bubbleEl, position);
        bubbleEl.style.left = `${safePosition.left}px`;
        bubbleEl.style.top = `${safePosition.top}px`;

        if (persist) {
            persistPosition(safePosition);
        }
    };

    const getAvatarAnchoredPosition = () => {
        if (variant !== 'pet' || typeof avatarBoundsProvider !== 'function') {
            return null;
        }

        let avatarBounds = null;
        try {
            avatarBounds = normalizeAvatarBounds(avatarBoundsProvider());
        } catch {
            avatarBounds = null;
        }
        if (!avatarBounds) {
            return null;
        }

        const rootRect = rootElement.getBoundingClientRect();
        const bubbleRect = bubbleEl.getBoundingClientRect();
        if (!rootRect || !bubbleRect || bubbleRect.width <= 0 || bubbleRect.height <= 0) {
            return null;
        }

        return {
            left: avatarBounds.centerX - rootRect.left - bubbleRect.width / 2,
            top: avatarBounds.top - rootRect.top - bubbleRect.height - PET_BUBBLE_AVATAR_GAP
        };
    };

    const getPreferredPosition = () => getAvatarAnchoredPosition() || getConfiguredPosition();

    const applyPreferredPosition = () => {
        const position = getPreferredPosition();
        if (position) {
            window.requestAnimationFrame(() => applyPosition(position));
        }
    };

    applyBubbleScale();
    const storedPosition = getConfiguredPosition();
    if (storedPosition) {
        window.requestAnimationFrame(() => applyPosition(storedPosition));
    }

    const clearHideTimer = () => {
        if (hideTimer) {
            window.clearTimeout(hideTimer);
            hideTimer = 0;
        }
    };

    const applyPetDialogueReservations = ({
        extraTop = 0,
        reservedLeft = 0,
        reservedRight = 0
    } = {}) => {
        if (variant !== 'pet') {
            return;
        }

        petReservedTop = Math.max(0, Math.round(Number(extraTop) || 0));
        petReservedLeft = Math.max(0, Math.round(Number(reservedLeft) || 0));
        petReservedRight = Math.max(0, Math.round(Number(reservedRight) || 0));
        rootElement.style.setProperty('--pet-dialogue-reserved-top', `${petReservedTop}px`);
        rootElement.style.setProperty('--pet-dialogue-reserved-left', `${petReservedLeft}px`);
        rootElement.style.setProperty('--pet-dialogue-reserved-right', `${petReservedRight}px`);
        rootElement.toggleAttribute(
            'data-dialogue-expanded',
            petReservedTop > 0 || petReservedLeft > 0 || petReservedRight > 0
        );
        window.requestAnimationFrame(() => {
            window.dispatchEvent(new Event('resize'));
        });
    };

    const setPetDialogueShellExpanded = async (expanded, { force = false } = {}) => {
        if (variant !== 'pet') {
            return 0;
        }

        if (!PET_DIALOGUE_WINDOW_EXPANSION_ENABLED) {
            petReservedTopRequest = 0;
            petReservedWidthRequest = 0;
            if (petReservedTop > 0 || petReservedLeft > 0 || petReservedRight > 0) {
                applyPetDialogueReservations();
            }
            return 0;
        }

        const requestedExtraTop = bubbleSettings.extraTop;
        const requestedExtraWidth = bubbleSettings.extraWidth;
        const hasReservedSpace = petReservedTop > 0 || petReservedLeft > 0 || petReservedRight > 0;
        if (
            expanded &&
            hasReservedSpace &&
            petReservedTopRequest === requestedExtraTop &&
            petReservedWidthRequest === requestedExtraWidth &&
            !force
        ) {
            return petReservedTop;
        }
        if (!expanded && !hasReservedSpace && !force) {
            return 0;
        }

        const setExpanded = window.ailisDesktop?.setPetDialogueExpanded;
        if (!setExpanded) {
            applyPetDialogueReservations();
            return 0;
        }

        try {
            const result = await setExpanded({
                expanded,
                extraTop: expanded ? requestedExtraTop : 0,
                extraWidth: expanded ? requestedExtraWidth : 0
            });
            const nextReservedTop = expanded ? Number(result?.extraTop || 0) : 0;
            petReservedTopRequest = expanded ? requestedExtraTop : 0;
            petReservedWidthRequest = expanded ? requestedExtraWidth : 0;
            applyPetDialogueReservations({
                extraTop: nextReservedTop,
                reservedLeft: expanded ? result?.reservedLeft : 0,
                reservedRight: expanded ? result?.reservedRight : 0
            });
            return petReservedTop;
        } catch (error) {
            console.warn('调整人物对话框窗口高度失败：', error);
            if (!expanded) {
                applyPetDialogueReservations();
            }
            return petReservedTop;
        }
    };

    const hideBubble = ({ delay = BUBBLE_HIDE_DELAY_MS } = {}) => {
        clearHideTimer();
        const token = ++lifecycleToken;
        hideTimer = window.setTimeout(() => {
            if (token !== lifecycleToken) {
                return;
            }
            bubbleEl.classList.remove('avatar-dialogue-bubble--visible');
            activeSpeechId = '';
            void setPetDialogueShellExpanded(false);
        }, delay);
    };

    const showBubble = ({ id = '', text = '' } = {}) => {
        const nextText = String(text || '').trim();
        if (!nextText) {
            hideBubble({ delay: 0 });
            return;
        }

        clearHideTimer();
        const token = ++lifecycleToken;
        activeSpeechId = String(id || Date.now());
        textEl.textContent = nextText;

        const revealBubble = () => {
            if (token !== lifecycleToken) {
                return;
            }

            bubbleEl.classList.add('avatar-dialogue-bubble--visible');
            applyPreferredPosition();
        };

        if (variant === 'pet') {
            void setPetDialogueShellExpanded(true).finally(() => {
                window.requestAnimationFrame(revealBubble);
            });
            return;
        }

        revealBubble();
    };

    const beginDrag = (event) => {
        if (event.button !== 0) {
            return;
        }

        event.preventDefault();
        event.stopPropagation();

        const rootRect = rootElement.getBoundingClientRect();
        const bubbleRect = bubbleEl.getBoundingClientRect();

        dragState = {
            pointerId: event.pointerId,
            offsetX: event.clientX - bubbleRect.left,
            offsetY: event.clientY - bubbleRect.top,
            rootLeft: rootRect.left,
            rootTop: rootRect.top
        };

        bubbleEl.classList.add('avatar-dialogue-bubble--dragging');
        bubbleEl.setPointerCapture?.(event.pointerId);
    };

    const moveDrag = (event) => {
        if (!dragState || event.pointerId !== dragState.pointerId) {
            return;
        }

        event.preventDefault();
        event.stopPropagation();

        applyPosition({
            left: event.clientX - dragState.rootLeft - dragState.offsetX,
            top: event.clientY - dragState.rootTop - dragState.offsetY
        });
    };

    const endDrag = (event) => {
        if (!dragState || event.pointerId !== dragState.pointerId) {
            return;
        }

        event.preventDefault();
        event.stopPropagation();

        const currentPosition = {
            left: bubbleEl.offsetLeft,
            top: bubbleEl.offsetTop
        };

        dragState = null;
        bubbleEl.classList.remove('avatar-dialogue-bubble--dragging');
        bubbleEl.releasePointerCapture?.(event.pointerId);
        applyPosition(currentPosition, { persist: true });
    };

    const handleSpeechEvent = (event) => {
        const detail = event.detail || {};
        const phase = detail.phase || detail.type;

        if (phase === 'start' || phase === 'update') {
            showBubble(detail);
            return;
        }

        if (phase === 'end') {
            const nextId = String(detail.id || '');
            if (!nextId || !activeSpeechId || nextId === activeSpeechId) {
                hideBubble();
            }
        }
    };

    const handlePreferencesUpdated = ({ preferences = {} } = {}) => {
        if (!usesDesktopBubbleSettings()) {
            return;
        }

        bubbleSettings = normalizePetBubbleSettings(preferences);
        applyBubbleScale();

        if (bubbleEl.classList.contains('avatar-dialogue-bubble--visible') || petReservedTop > 0) {
            void setPetDialogueShellExpanded(true, { force: true }).finally(() => {
                applyPreferredPosition();
            });
            return;
        }

        applyPreferredPosition();
    };

    const removePreferencesListener = window.ailisDesktop?.onPreferencesUpdated?.(handlePreferencesUpdated);

    window.addEventListener(AVATAR_SPEECH_EVENT_NAME, handleSpeechEvent);
    bubbleEl.addEventListener('pointerdown', beginDrag);
    bubbleEl.addEventListener('pointermove', moveDrag);
    bubbleEl.addEventListener('pointerup', endDrag);
    bubbleEl.addEventListener('pointercancel', endDrag);

    return () => {
        clearHideTimer();
        lifecycleToken += 1;
        void setPetDialogueShellExpanded(false);
        removePreferencesListener?.();
        window.removeEventListener(AVATAR_SPEECH_EVENT_NAME, handleSpeechEvent);
        bubbleEl.removeEventListener('pointerdown', beginDrag);
        bubbleEl.removeEventListener('pointermove', moveDrag);
        bubbleEl.removeEventListener('pointerup', endDrag);
        bubbleEl.removeEventListener('pointercancel', endDrag);
        bubbleEl.remove();
    };
}
