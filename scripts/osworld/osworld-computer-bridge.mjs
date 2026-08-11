import fs from 'node:fs/promises';
import path from 'node:path';

const SUPPORTED_ACTIONS = Object.freeze([
    'schema',
    'screen_screenshot',
    'mouse_move',
    'mouse_click',
    'mouse_double_click',
    'mouse_right_click',
    'mouse_drag',
    'scroll',
    'keyboard_type',
    'keyboard_press',
    'keyboard_hotkey',
    'wait'
]);

function normalizeText(value, fallback = '') {
    return typeof value === 'string' && value.trim() ? value.trim() : fallback;
}

function normalizeAction(value = '') {
    const action = normalizeText(value).toLowerCase().replace(/[-\s]+/g, '_');
    const aliases = {
        screenshot: 'screen_screenshot',
        click: 'mouse_click',
        double_click: 'mouse_double_click',
        right_click: 'mouse_right_click',
        drag: 'mouse_drag',
        type: 'keyboard_type',
        press_key: 'keyboard_press',
        hotkey: 'keyboard_hotkey',
        sleep: 'wait'
    };
    return aliases[action] || action;
}

function finiteNumber(value, fallback = null) {
    const number = Number(value);
    return Number.isFinite(number) ? number : fallback;
}

function point(args = {}, prefix = '') {
    const x = finiteNumber(args[`${prefix}X`] ?? args[`${prefix}x`]);
    const y = finiteNumber(args[`${prefix}Y`] ?? args[`${prefix}y`]);
    return x === null || y === null ? null : { x, y };
}

function normalizeKeys(value) {
    if (Array.isArray(value)) {
        return value.map((key) => normalizeText(String(key))).filter(Boolean);
    }
    return normalizeText(String(value || ''))
        .split('+')
        .map((key) => key.trim())
        .filter(Boolean);
}

function translateComputerAction(args = {}) {
    const action = normalizeAction(args.action || args.operation || args.intent);
    if (action === 'screen_screenshot') {
        return { action, observeOnly: true, actions: [] };
    }
    if (action === 'wait') {
        return { action, actions: [{ action_type: 'WAIT' }] };
    }
    if (action === 'mouse_move') {
        const target = point(args);
        if (!target) throw new Error('mouse_move requires numeric x and y');
        return { action, actions: [{ action_type: 'MOVE_TO', parameters: target }] };
    }
    if (action === 'mouse_click') {
        const target = point(args);
        const parameters = {
            button: normalizeText(args.button, 'left'),
            ...(target || {})
        };
        const clickCount = finiteNumber(args.numClicks ?? args.clicks);
        if (clickCount !== null) parameters.num_clicks = Math.max(1, Math.round(clickCount));
        return { action, actions: [{ action_type: 'CLICK', parameters }] };
    }
    if (action === 'mouse_double_click' || action === 'mouse_right_click') {
        const target = point(args);
        return {
            action,
            actions: [{
                action_type: action === 'mouse_double_click' ? 'DOUBLE_CLICK' : 'RIGHT_CLICK',
                parameters: target || {}
            }]
        };
    }
    if (action === 'mouse_drag') {
        const start = point(args);
        const end = point(args, 'end');
        if (!end) throw new Error('mouse_drag requires numeric endX and endY');
        return {
            action,
            actions: [
                ...(start ? [{ action_type: 'MOVE_TO', parameters: start }] : []),
                { action_type: 'DRAG_TO', parameters: end }
            ]
        };
    }
    if (action === 'scroll') {
        const dx = finiteNumber(args.dx, 0);
        const dy = finiteNumber(args.dy ?? args.delta, 0);
        if (!dx && !dy) throw new Error('scroll requires a non-zero delta, dx, or dy');
        return { action, actions: [{ action_type: 'SCROLL', parameters: { dx, dy } }] };
    }
    if (action === 'keyboard_type') {
        const text = typeof args.text === 'string' ? args.text : String(args.content || '');
        if (!text) throw new Error('keyboard_type requires text');
        return { action, actions: [{ action_type: 'TYPING', parameters: { text } }] };
    }
    if (action === 'keyboard_press') {
        const key = normalizeText(args.key);
        if (!key) throw new Error('keyboard_press requires key');
        return { action, actions: [{ action_type: 'PRESS', parameters: { key } }] };
    }
    if (action === 'keyboard_hotkey') {
        const keys = normalizeKeys(args.keys || args.key);
        if (!keys.length) throw new Error('keyboard_hotkey requires keys');
        return { action, actions: [{ action_type: 'HOTKEY', parameters: { keys } }] };
    }
    throw new Error(`OSWorld computer bridge does not support action: ${action || 'missing'}`);
}

async function fetchJson(url, options = {}, timeoutMs = 120000) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    try {
        const response = await fetch(url, { ...options, signal: controller.signal });
        const text = await response.text();
        const payload = text ? JSON.parse(text) : {};
        if (!response.ok) {
            throw new Error(payload.error || `OSWorld bridge HTTP ${response.status}`);
        }
        return payload;
    } finally {
        clearTimeout(timeout);
    }
}

class OSWorldComputerBridgeTool {
    constructor({ bridgeUrl, artifactDir, timeoutMs = 120000 } = {}) {
        this.bridgeUrl = normalizeText(bridgeUrl).replace(/\/+$/, '');
        this.artifactDir = path.resolve(artifactDir || process.cwd());
        this.timeoutMs = Math.max(5000, Number(timeoutMs) || 120000);
        this.imageSequence = 0;
        if (!this.bridgeUrl) throw new Error('OSWorldComputerBridgeTool requires bridgeUrl');
    }

    async shutdown() {}

    async materializeObservation(payload = {}, action = 'screen_screenshot') {
        await fs.mkdir(this.artifactDir, { recursive: true });
        const screenshotBase64 = normalizeText(payload.screenshot_base64 || payload.screenshotBase64);
        const screenshotPath = path.join(
            this.artifactDir,
            `observation-${String(++this.imageSequence).padStart(4, '0')}.png`
        );
        if (screenshotBase64) {
            await fs.writeFile(screenshotPath, Buffer.from(screenshotBase64, 'base64'));
        }
        const accessibilityTree = normalizeText(payload.accessibility_tree || payload.accessibilityTree);
        const status = normalizeText(payload.status, payload.done ? 'done' : 'completed');
        const text = [
            `OSWorld GUI action: ${action}`,
            `status=${status}`,
            `step=${Number(payload.step || payload.action_count || 0)}`,
            payload.limit_reached ? 'The GUI action budget is exhausted. Stop calling tools and return your final response.' : '',
            accessibilityTree ? 'Accessibility tree (current screen):' : '',
            accessibilityTree ? accessibilityTree.slice(0, 18000) : ''
        ].filter(Boolean).join('\n');
        const details = {
            status,
            action,
            done: payload.done === true,
            limitReached: payload.limit_reached === true,
            step: Number(payload.step || payload.action_count || 0),
            ...(screenshotBase64 ? {
                modelImage: {
                    path: screenshotPath,
                    detail: 'original'
                },
                screenshotPath
            } : {})
        };
        return {
            content: [{ type: 'text', text }],
            isError: payload.ok === false,
            details,
            structuredContent: details
        };
    }

    async execute(args = {}) {
        const requestedAction = normalizeAction(args.action || args.operation || args.intent || 'schema');
        if (requestedAction === 'schema' || requestedAction === 'help') {
            return {
                content: [{
                    type: 'text',
                    text: [
                        'OSWorld computer transport. It controls only the isolated Ubuntu benchmark VM.',
                        `Supported actions: ${SUPPORTED_ACTIONS.join(', ')}.`,
                        'Every observation returns a fresh screenshot. Finish by returning a normal final response.'
                    ].join('\n')
                }],
                isError: false,
                details: { status: 'completed', action: 'schema', supportedActions: SUPPORTED_ACTIONS },
                structuredContent: { status: 'completed', supportedActions: SUPPORTED_ACTIONS }
            };
        }
        try {
            const translated = translateComputerAction({ ...args, action: requestedAction });
            const payload = translated.observeOnly
                ? await fetchJson(`${this.bridgeUrl}/observe`, {}, this.timeoutMs)
                : await fetchJson(`${this.bridgeUrl}/action`, {
                      method: 'POST',
                      headers: { 'content-type': 'application/json' },
                      body: JSON.stringify({
                          requested_action: requestedAction,
                          requested_args: args,
                          actions: translated.actions
                      })
                  }, this.timeoutMs);
            return await this.materializeObservation(payload, requestedAction);
        } catch (error) {
            const message = error?.name === 'AbortError'
                ? `OSWorld bridge timed out after ${this.timeoutMs}ms`
                : error?.message || String(error);
            return {
                content: [{ type: 'text', text: message }],
                isError: true,
                details: {
                    status: 'computer_exec_failed',
                    action: requestedAction,
                    error: message,
                    retryable: false
                },
                structuredContent: {
                    ok: false,
                    status: 'computer_exec_failed',
                    action: requestedAction,
                    error: message
                }
            };
        }
    }
}

export {
    OSWorldComputerBridgeTool,
    SUPPORTED_ACTIONS,
    normalizeAction,
    translateComputerAction
};
