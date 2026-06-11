const STYLE_ID = 'aigl-pet-mouse-hit-test-style';
const INTERACTIVE_SELECTORS = Object.freeze([
    '.avatar-dialogue-bubble--visible'
]);
const DEFAULT_WIDTH_RATIO = 0.58;
const DEFAULT_HEIGHT_RATIO = 0.78;
const DEFAULT_OFFSET_Y_RATIO = 0.08;
const HIT_TEST_CACHE_MS = 90;
const HIT_TEST_DRAG_CACHE_MS = 42;
const HIT_TEST_DEBUG_CACHE_MS = 55;
const HIT_TEST_REALTIME_INTERVAL_MS = 80;
const INTERACTIVE_ELEMENT_CACHE_MS = 250;

const OPEN_HAND_CURSOR = 'url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2732%27 height=%2732%27 viewBox=%270 0 32 32%27%3E%3Cfilter id=%27s%27 x=%27-20%25%27 y=%27-20%25%27 width=%27140%25%27 height=%27140%25%27%3E%3CfeDropShadow dx=%270%27 dy=%271.4%27 stdDeviation=%271.2%27 flood-color=%27%230b1720%27 flood-opacity=%27.28%27/%3E%3C/filter%3E%3Cpath filter=%27url(%23s)%27 fill=%27%23fff8ec%27 stroke=%27%23232b35%27 stroke-width=%271.35%27 stroke-linejoin=%27round%27 d=%27M10.7 17.7V8.2c0-1.2.8-2 1.9-2s1.9.8 1.9 2v7.2-9.1c0-1.2.8-2 1.9-2s1.9.8 1.9 2v9.2-7.8c0-1.1.8-1.9 1.8-1.9s1.8.8 1.8 1.9v8.5-5.2c0-1.1.8-1.8 1.8-1.8s1.8.7 1.8 1.8v8.5c0 5-3.4 8.4-8.3 8.4h-1.7c-3.1 0-5.5-1.2-7.2-3.6l-3.3-4.8c-.6-.9-.4-2 .5-2.5.8-.5 1.8-.3 2.4.5l2.8 3.2z%27/%3E%3Cpath fill=%27none%27 stroke=%27%23d6b489%27 stroke-width=%27.8%27 stroke-linecap=%27round%27 d=%27M14.5 15.4v3.2M18.3 15.5v3.1M21.9 16.1v2.8%27/%3E%3C/svg%3E") 12 8, grab';
const CLOSED_HAND_CURSOR = 'url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2732%27 height=%2732%27 viewBox=%270 0 32 32%27%3E%3Cfilter id=%27s%27 x=%27-20%25%27 y=%27-20%25%27 width=%27140%25%27 height=%27140%25%27%3E%3CfeDropShadow dx=%270%27 dy=%271.4%27 stdDeviation=%271.2%27 flood-color=%27%230b1720%27 flood-opacity=%27.28%27/%3E%3C/filter%3E%3Cpath filter=%27url(%23s)%27 fill=%27%23fff3df%27 stroke=%27%23232b35%27 stroke-width=%271.35%27 stroke-linejoin=%27round%27 d=%27M9.4 14.9c0-1 .8-1.8 1.9-1.8h2.4V8.2c0-1.2.8-2 1.9-2s1.9.8 1.9 2v4.9h1.2V8.9c0-1.1.8-1.9 1.8-1.9s1.8.8 1.8 1.9v4.2h.7c1.1 0 2 .9 2 2v4.5c0 5-3.3 8.3-8.2 8.3h-1.6c-3 0-5.4-1.2-7.1-3.5l-2.8-4c-.6-.9-.4-2 .5-2.5.8-.5 1.8-.3 2.4.5l1.7 2.2v-5.7z%27/%3E%3Cpath fill=%27none%27 stroke=%27%23d6a96f%27 stroke-width=%27.8%27 stroke-linecap=%27round%27 d=%27M13.8 13.2h8.7M10.5 16.2h12.3%27/%3E%3C/svg%3E") 12 8, grabbing';

let cachedInteractiveElements = [];
let cachedInteractiveElementsAt = 0;

function clampNumber(value, minimum, maximum, fallbackValue, digits = 2) {
    const numericValue = Number(value);
    if (!Number.isFinite(numericValue)) {
        return fallbackValue;
    }
    const clampedValue = Math.min(Math.max(numericValue, minimum), maximum);
    return Number(clampedValue.toFixed(digits));
}

function normalizeSettings(preferences = {}) {
    const shape = String(preferences.petMouseHitTestShape || '').trim().toLowerCase();
    return {
        enabled: preferences.petMouseHitTestEnabled !== false,
        shape: ['ellipse', 'rectangle'].includes(shape) ? shape : 'ellipse',
        widthRatio: clampNumber(preferences.petMouseHitTestWidthRatio, 0.2, 1, DEFAULT_WIDTH_RATIO, 2),
        heightRatio: clampNumber(preferences.petMouseHitTestHeightRatio, 0.25, 1, DEFAULT_HEIGHT_RATIO, 2),
        offsetXRatio: clampNumber(preferences.petMouseHitTestOffsetXRatio, -0.5, 0.5, 0, 2),
        offsetYRatio: clampNumber(preferences.petMouseHitTestOffsetYRatio, -0.5, 0.5, DEFAULT_OFFSET_Y_RATIO, 2),
        debug: Boolean(preferences.petMouseHitTestDebug)
    };
}

function injectStyles() {
    if (document.getElementById(STYLE_ID)) {
        return;
    }
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
        .pet-mouse-hit-test-zone {
            position: absolute;
            z-index: 2147483638;
            display: none;
            border: 2px solid rgba(23, 133, 107, 0.72);
            background: rgba(23, 133, 107, 0.08);
            box-shadow: 0 0 0 9999px rgba(15, 35, 45, 0.05);
            pointer-events: none;
        }

        .pet-mouse-hit-test-zone.is-visible {
            display: block;
        }

        html[data-pet-mouse-hit-active="true"],
        html[data-pet-mouse-hit-active="true"] body,
        html[data-pet-mouse-hit-active="true"] #pet-shell,
        html[data-pet-mouse-hit-active="true"] #canvas-container,
        html[data-pet-mouse-hit-active="true"] canvas,
        #pet-shell[data-mouse-hit-active="true"],
        #pet-shell[data-mouse-hit-active="true"] * {
            cursor: grab !important;
            cursor: ${OPEN_HAND_CURSOR} !important;
        }

        html[data-pet-mouse-dragging="true"],
        html[data-pet-mouse-dragging="true"] body,
        html[data-pet-mouse-dragging="true"] #pet-shell,
        html[data-pet-mouse-dragging="true"] #canvas-container,
        html[data-pet-mouse-dragging="true"] canvas,
        #pet-shell[data-mouse-hit-dragging="true"],
        #pet-shell[data-mouse-hit-dragging="true"] * {
            cursor: grabbing !important;
            cursor: ${CLOSED_HAND_CURSOR} !important;
        }
    `;
    document.head.appendChild(style);
}

function getElementRect(element) {
    if (!element || typeof element.getBoundingClientRect !== 'function') {
        return null;
    }
    const rect = element.getBoundingClientRect();
    if (!rect || rect.width <= 0 || rect.height <= 0) {
        return null;
    }
    return rect;
}

function pointInRect(point, rect) {
    return point.x >= rect.left &&
        point.x <= rect.right &&
        point.y >= rect.top &&
        point.y <= rect.bottom;
}

function normalizeRect(rect) {
    if (!rect || typeof rect !== 'object') {
        return null;
    }

    const left = Number(rect.left);
    const top = Number(rect.top);
    const right = Number(rect.right);
    const bottom = Number(rect.bottom);
    if (
        !Number.isFinite(left) ||
        !Number.isFinite(top) ||
        !Number.isFinite(right) ||
        !Number.isFinite(bottom) ||
        right <= left ||
        bottom <= top
    ) {
        return null;
    }

    const width = right - left;
    const height = bottom - top;
    return {
        left,
        top,
        right,
        bottom,
        width,
        height,
        centerX: left + width / 2,
        centerY: top + height / 2,
        source: rect.source || 'dynamic'
    };
}

function getManualHotZoneRect(canvasElement, settings) {
    const canvasRect = getElementRect(canvasElement);
    if (!canvasRect) {
        return null;
    }

    const width = Math.max(24, canvasRect.width * settings.widthRatio);
    const height = Math.max(32, canvasRect.height * settings.heightRatio);
    const centerX = canvasRect.left + canvasRect.width / 2 + canvasRect.width * settings.offsetXRatio;
    const centerY = canvasRect.top + canvasRect.height / 2 + canvasRect.height * settings.offsetYRatio;
    return {
        left: centerX - width / 2,
        top: centerY - height / 2,
        right: centerX + width / 2,
        bottom: centerY + height / 2,
        width,
        height,
        centerX,
        centerY
    };
}

function getDynamicWidthScale(settings) {
    return clampNumber(
        1 + (settings.widthRatio - DEFAULT_WIDTH_RATIO) * 0.85,
        0.68,
        1.46,
        1,
        3
    );
}

function getDynamicHeightScale(settings) {
    return clampNumber(
        1 + (settings.heightRatio - DEFAULT_HEIGHT_RATIO) * 0.72,
        0.72,
        1.36,
        1,
        3
    );
}

function getDynamicHotZoneRect(canvasElement, settings, avatarBoundsProvider) {
    if (typeof avatarBoundsProvider !== 'function') {
        return null;
    }

    let rawAvatarRect = null;
    try {
        rawAvatarRect = avatarBoundsProvider();
    } catch {
        rawAvatarRect = null;
    }

    const canvasRect = getElementRect(canvasElement);
    const avatarRect = normalizeRect(rawAvatarRect);
    if (!canvasRect || !avatarRect) {
        return null;
    }

    const visibleLeft = Math.max(canvasRect.left, avatarRect.left);
    const visibleTop = Math.max(canvasRect.top, avatarRect.top);
    const visibleRight = Math.min(canvasRect.right, avatarRect.right);
    const visibleBottom = Math.min(canvasRect.bottom, avatarRect.bottom);
    const visibleRect = normalizeRect({
        left: visibleLeft,
        top: visibleTop,
        right: visibleRight,
        bottom: visibleBottom,
        source: avatarRect.source
    });
    if (!visibleRect) {
        return null;
    }

    const width = Math.max(24, visibleRect.width * getDynamicWidthScale(settings));
    const height = Math.max(32, visibleRect.height * getDynamicHeightScale(settings));
    const centerX = visibleRect.centerX + canvasRect.width * settings.offsetXRatio;
    const centerY = visibleRect.centerY + canvasRect.height * (settings.offsetYRatio - DEFAULT_OFFSET_Y_RATIO);
    const left = Math.max(canvasRect.left, centerX - width / 2);
    const top = Math.max(canvasRect.top, centerY - height / 2);
    const right = Math.min(canvasRect.right, centerX + width / 2);
    const bottom = Math.min(canvasRect.bottom, centerY + height / 2);
    return normalizeRect({
        left,
        top,
        right,
        bottom,
        source: visibleRect.source
    });
}

function getHotZoneRect(canvasElement, settings, avatarBoundsProvider) {
    return getDynamicHotZoneRect(canvasElement, settings, avatarBoundsProvider) ||
        getManualHotZoneRect(canvasElement, settings);
}

function pointInHotZone(point, rect, shape) {
    if (!rect) {
        return false;
    }
    if (shape === 'rectangle') {
        return pointInRect(point, rect);
    }
    const radiusX = rect.width / 2;
    const radiusY = rect.height / 2;
    if (radiusX <= 0 || radiusY <= 0) {
        return false;
    }
    const normalizedX = (point.x - rect.centerX) / radiusX;
    const normalizedY = (point.y - rect.centerY) / radiusY;
    return normalizedX * normalizedX + normalizedY * normalizedY <= 1;
}

function pointInInteractiveElement(point) {
    const now = typeof performance !== 'undefined' ? performance.now() : Date.now();
    if (now - cachedInteractiveElementsAt > INTERACTIVE_ELEMENT_CACHE_MS) {
        cachedInteractiveElements = INTERACTIVE_SELECTORS
            .flatMap((selector) => [...document.querySelectorAll(selector)]);
        cachedInteractiveElementsAt = now;
    }

    for (const element of cachedInteractiveElements) {
        if (!element?.isConnected) {
            continue;
        }
        const rect = getElementRect(element);
        if (rect && pointInRect(point, rect)) {
            return true;
        }
    }
    return false;
}

function getPointFromEvent(event = {}) {
    if (!event) {
        return null;
    }

    const x = Number(event.clientX);
    const y = Number(event.clientY);
    if (Number.isFinite(x) && Number.isFinite(y)) {
        return { x, y };
    }
    return null;
}

export function installPetMouseHitTest({
    rootElement,
    canvasElement,
    avatarBoundsProvider = null,
    preferences = {}
} = {}) {
    if (!rootElement || !canvasElement || typeof window === 'undefined') {
        return null;
    }

    injectStyles();
    const debugOverlay = document.createElement('div');
    debugOverlay.className = 'pet-mouse-hit-test-zone';
    rootElement.appendChild(debugOverlay);

    const state = {
        settings: normalizeSettings(preferences),
        mouseInside: false,
        pointerDown: false,
        passthrough: null,
        lastPoint: null,
        cachedHotZoneRect: null,
        cachedHotZoneAt: 0,
        realtimeTimerId: null
    };

    function clearHotZoneCache() {
        state.cachedHotZoneRect = null;
        state.cachedHotZoneAt = 0;
    }

    function setPassthrough(enabled) {
        const nextEnabled = Boolean(enabled);
        if (state.passthrough === nextEnabled) {
            return;
        }
        state.passthrough = nextEnabled;
        window.aigrilDesktop?.setPetMousePassthrough?.(nextEnabled);
    }

    function applyCursorState(active) {
        const dragging = Boolean(state.pointerDown);
        const cursor = active
            ? dragging
                ? 'grabbing'
                : 'grab'
            : '';

        rootElement.toggleAttribute('data-mouse-hit-active', Boolean(active));
        rootElement.toggleAttribute('data-mouse-hit-dragging', dragging);
        document.documentElement.toggleAttribute('data-pet-mouse-hit-active', Boolean(active));
        document.documentElement.toggleAttribute('data-pet-mouse-dragging', dragging);
        document.body?.toggleAttribute?.('data-pet-mouse-hit-active', Boolean(active));
        document.body?.toggleAttribute?.('data-pet-mouse-dragging', dragging);

        rootElement.style.cursor = cursor;
        canvasElement.style.cursor = cursor;
        const canvas = canvasElement.querySelector('canvas');
        if (canvas) {
            canvas.style.cursor = cursor;
        }
        if (document.body) {
            document.body.style.cursor = cursor;
        }
    }

    function getCachedHotZoneRect({ force = false } = {}) {
        const now = performance.now();
        const maxAge = state.pointerDown
            ? HIT_TEST_DRAG_CACHE_MS
            : state.settings.debug
                ? HIT_TEST_DEBUG_CACHE_MS
                : HIT_TEST_CACHE_MS;

        if (
            !force &&
            state.cachedHotZoneRect &&
            now - state.cachedHotZoneAt < maxAge
        ) {
            return state.cachedHotZoneRect;
        }

        state.cachedHotZoneRect = getHotZoneRect(canvasElement, state.settings, avatarBoundsProvider);
        state.cachedHotZoneAt = now;
        return state.cachedHotZoneRect;
    }

    function updateDebugOverlay(rect = null) {
        if (!state.settings.debug) {
            debugOverlay.classList.remove('is-visible');
            return;
        }

        const nextRect = rect || getCachedHotZoneRect();
        debugOverlay.classList.toggle('is-visible', Boolean(nextRect));
        if (!nextRect) {
            return;
        }
        const rootRect = rootElement.getBoundingClientRect();
        debugOverlay.style.left = `${Math.round(nextRect.left - rootRect.left)}px`;
        debugOverlay.style.top = `${Math.round(nextRect.top - rootRect.top)}px`;
        debugOverlay.style.width = `${Math.round(nextRect.width)}px`;
        debugOverlay.style.height = `${Math.round(nextRect.height)}px`;
        debugOverlay.style.borderRadius = state.settings.shape === 'ellipse' ? '999px' : '8px';
    }

    function isHot(point) {
        if (!point) {
            return false;
        }
        if (pointInInteractiveElement(point)) {
            return true;
        }
        const rect = getCachedHotZoneRect();
        updateDebugOverlay(rect);
        return pointInHotZone(point, rect, state.settings.shape);
    }

    function evaluate(event = null) {
        if (!state.settings.enabled) {
            applyCursorState(false);
            setPassthrough(false);
            updateDebugOverlay();
            return false;
        }

        const point = getPointFromEvent(event) || state.lastPoint;
        if (point) {
            state.lastPoint = point;
        }
        const active = Boolean(state.pointerDown || isHot(point));
        applyCursorState(active);
        setPassthrough(!active);
        return active;
    }

    function handleMouseMove(event) {
        state.mouseInside = true;
        evaluate(event);
    }

    function handlePointerDown(event) {
        if (evaluate(event)) {
            state.pointerDown = true;
            applyCursorState(true);
            setPassthrough(false);
        }
    }

    function handlePointerUp(event) {
        state.pointerDown = false;
        evaluate(event);
    }

    function handleMouseLeave() {
        state.mouseInside = false;
        state.lastPoint = null;
        if (!state.pointerDown && state.settings.enabled) {
            applyCursorState(false);
            setPassthrough(true);
        }
    }

    function handleCursorPoint(payload = {}) {
        if (!payload?.inside) {
            if (!state.pointerDown) {
                handleMouseLeave();
            }
            return false;
        }

        state.mouseInside = true;
        return evaluate({
            clientX: payload.clientX,
            clientY: payload.clientY
        });
    }

    function handleResize() {
        clearHotZoneCache();
        evaluate();
    }

    function handleRealtimeTick() {
        if (!state.settings.enabled) {
            return;
        }
        if (!state.lastPoint && !state.pointerDown && !state.settings.debug) {
            return;
        }

        evaluate();
    }

    document.addEventListener('mousemove', handleMouseMove, true);
    document.addEventListener('pointerdown', handlePointerDown, true);
    document.addEventListener('pointerup', handlePointerUp, true);
    document.addEventListener('pointercancel', handlePointerUp, true);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('blur', handleMouseLeave);
    window.addEventListener('resize', handleResize);

    evaluate();
    state.realtimeTimerId = window.setInterval(handleRealtimeTick, HIT_TEST_REALTIME_INTERVAL_MS);

    return {
        updatePreferences(nextPreferences = {}) {
            state.settings = normalizeSettings(nextPreferences);
            clearHotZoneCache();
            evaluate();
        },
        handleCursorPoint,
        dispose() {
            document.removeEventListener('mousemove', handleMouseMove, true);
            document.removeEventListener('pointerdown', handlePointerDown, true);
            document.removeEventListener('pointerup', handlePointerUp, true);
            document.removeEventListener('pointercancel', handlePointerUp, true);
            window.removeEventListener('mouseleave', handleMouseLeave);
            window.removeEventListener('blur', handleMouseLeave);
            window.removeEventListener('resize', handleResize);
            if (state.realtimeTimerId !== null) {
                window.clearInterval(state.realtimeTimerId);
            }
            debugOverlay.remove();
            applyCursorState(false);
            setPassthrough(false);
        },
        evaluate
    };
}
