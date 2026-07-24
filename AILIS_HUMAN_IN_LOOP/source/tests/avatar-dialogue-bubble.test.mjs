import assert from 'node:assert/strict';
import test from 'node:test';

import { AVATAR_SPEECH_EVENT_NAME, installAvatarDialogueBubble } from '../src/avatar-dialogue-bubble.js';

class FakeClassList {
    constructor(element) {
        this.element = element;
    }

    values() {
        return new Set(String(this.element.className || '').split(/\s+/).filter(Boolean));
    }

    sync(values) {
        this.element.className = [...values].join(' ');
    }

    add(name) {
        const values = this.values();
        values.add(name);
        this.sync(values);
    }

    remove(name) {
        const values = this.values();
        values.delete(name);
        this.sync(values);
    }

    contains(name) {
        return this.values().has(name);
    }
}

class FakeStyle {
    constructor() {
        this.values = new Map();
    }

    setProperty(name, value) {
        this.values.set(name, String(value));
    }
}

class FakeElement extends EventTarget {
    constructor(tagName, rect = {}) {
        super();
        this.tagName = tagName;
        this.children = [];
        this.parentElement = null;
        this.className = '';
        this.attributes = new Map();
        this.style = new FakeStyle();
        this.classList = new FakeClassList(this);
        this.textContent = '';
        this.rect = {
            left: 0,
            top: 0,
            width: 240,
            height: 72,
            ...rect
        };
    }

    appendChild(child) {
        child.parentElement = this;
        this.children.push(child);
        return child;
    }

    remove() {
        this.parentElement = null;
    }

    setAttribute(name, value) {
        this.attributes.set(name, String(value));
    }

    toggleAttribute(name, enabled) {
        if (enabled) {
            this.attributes.set(name, '');
        } else {
            this.attributes.delete(name);
        }
    }

    getBoundingClientRect() {
        return {
            ...this.rect,
            right: this.rect.left + this.rect.width,
            bottom: this.rect.top + this.rect.height
        };
    }

    get offsetLeft() {
        return Number.parseFloat(this.style.left || '0') || 0;
    }

    get offsetTop() {
        return Number.parseFloat(this.style.top || '0') || 0;
    }

    setPointerCapture() {}

    releasePointerCapture() {}
}

function installFakeDom({ onExpand = () => {} } = {}) {
    const head = new FakeElement('head');
    const body = new FakeElement('body', { width: 360, height: 520 });
    const root = new FakeElement('div', { width: 360, height: 520 });
    const styleElements = new Map();

    head.appendChild = (child) => {
        child.parentElement = head;
        head.children.push(child);
        if (child.id) {
            styleElements.set(child.id, child);
        }
        return child;
    };

    globalThis.document = {
        head,
        body,
        createElement: (tagName) => new FakeElement(tagName),
        getElementById: (id) => styleElements.get(id) || null
    };

    globalThis.CustomEvent = class CustomEvent extends Event {
        constructor(type, options = {}) {
            super(type);
            this.detail = options.detail;
        }
    };

    const windowTarget = new EventTarget();
    windowTarget.localStorage = {
        getItem: () => null,
        setItem: () => {}
    };
    windowTarget.requestAnimationFrame = (callback) => {
        callback(0);
        return 1;
    };
    windowTarget.setTimeout = (callback) => {
        callback();
        return 1;
    };
    windowTarget.clearTimeout = () => {};
    windowTarget.ailisDesktop = {
        preferences: {},
        setPetDialogueExpanded: async (payload) => {
            onExpand(payload);
            return {
                ok: true,
                expanded: Boolean(payload?.expanded),
                extraTop: payload?.expanded ? 190 : 0,
                extraWidth: payload?.expanded ? 220 : 0,
                reservedLeft: 0,
                reservedRight: 0
            };
        },
        onPreferencesUpdated: () => () => {}
    };

    globalThis.window = windowTarget;
    return { root };
}

test('pet dialogue bubble stays inside fixed overlay without expanding the Electron pet window', async () => {
    const expandCalls = [];
    const { root } = installFakeDom({
        onExpand: (payload) => expandCalls.push(payload)
    });
    const cleanup = installAvatarDialogueBubble({
        rootElement: root,
        variant: 'pet'
    });

    window.dispatchEvent(new CustomEvent(AVATAR_SPEECH_EVENT_NAME, {
        detail: {
            phase: 'start',
            id: 'message-1',
            text: '你好呀'
        }
    }));
    await Promise.resolve();
    await Promise.resolve();

    window.dispatchEvent(new CustomEvent(AVATAR_SPEECH_EVENT_NAME, {
        detail: {
            phase: 'end',
            id: 'message-1'
        }
    }));
    await Promise.resolve();
    await Promise.resolve();

    cleanup();
    assert.deepEqual(expandCalls, []);
});

test('pet dialogue bubble anchors above the avatar bounds when available', async () => {
    const { root } = installFakeDom();
    const cleanup = installAvatarDialogueBubble({
        rootElement: root,
        variant: 'pet',
        avatarBoundsProvider: () => ({
            left: 140,
            top: 210,
            right: 220,
            bottom: 460,
            width: 80,
            height: 250,
            centerX: 180,
            centerY: 335
        })
    });

    window.dispatchEvent(new CustomEvent(AVATAR_SPEECH_EVENT_NAME, {
        detail: {
            phase: 'start',
            id: 'message-2',
            text: '我在这里。'
        }
    }));
    await Promise.resolve();
    await Promise.resolve();

    const bubble = root.children[0];
    cleanup();
    assert.equal(bubble.style.left, '60px');
    assert.equal(bubble.style.top, '126px');
});
