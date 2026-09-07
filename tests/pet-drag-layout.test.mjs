import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs';
import vm from 'node:vm';
import { createRequire } from 'node:module';
import { layoutPetBubble } from '../src/pet-bubble-layout.js';

const require = createRequire(import.meta.url);
const { createAILISDesktopPlatformAdapter } = require('../electron/ailis-desktop-platform-adapter.cjs');
const display = { workArea: { x: 0, y: 0, width: 1707, height: 1019 } };
const adapter = createAILISDesktopPlatformAdapter({ screen: { getDisplayMatching: () => display } });
const layoutAt = (x, y, extraTop = 190, extraWidth = 220) => adapter.getExpandedWindowLayout({
    baseBounds: { x, y, width: 216, height: 288 }, requestedExtraTop: extraTop, requestedExtraWidth: extraWidth
});

test('moving across edges preserves the avatar viewport and the transparent window size', () => {
    for (const x of [-300, 0, 110, 750, 1491, 2200]) {
        for (const y of [-300, 0, 100, 190, 667, 731, 1200]) {
            const l = layoutAt(x, y);
            assert.equal(l.expandedBounds.width, 436);
            assert.equal(l.expandedBounds.height, 478);
            assert.equal(l.expandedBounds.width - l.reservedLeft - l.reservedRight, 216);
            assert.equal(l.expandedBounds.height - l.extraTop, 288);
            assert.equal(l.reservedLeft, 110);
            assert.equal(l.extraTop, 190);
            assert.ok(l.baseBounds.x >= 0 && l.baseBounds.x + 216 <= 1707);
            assert.ok(l.baseBounds.y >= 0 && l.baseBounds.y + 288 <= 1019);
        }
    }
});

test('zero padding stays zero; different monitor sizes and negative origins do not scale the avatar', () => {
    const zero = layoutAt(0, 0, 0, 0);
    assert.deepEqual(zero.expandedBounds, zero.baseBounds);
    const smaller = createAILISDesktopPlatformAdapter({ screen: {
        getDisplayMatching: () => ({ workArea: { x: -1280, y: -100, width: 1280, height: 720 } })
    } });
    const l = smaller.getExpandedWindowLayout({ baseBounds: { x: -1500, y: -400, width: 500, height: 900 },
        requestedExtraTop: 190, requestedExtraWidth: 220 });
    assert.equal(l.baseBounds.width, 500);
    assert.equal(l.baseBounds.height, 900);
    assert.equal(l.baseBounds.x, -1280);
    assert.equal(l.baseBounds.y, -100);
});

test('the real main-process drag handlers change position with a fixed canonical size', () => {
    const source = fs.readFileSync(new URL('../electron/main.cjs', import.meta.url), 'utf8');
    const helper = source.slice(source.indexOf('function applyPetWindowLayout('), source.indexOf('function getCurrentPetScale('));
    const handlers = source.slice(source.indexOf("    ipcMain.on('ailis:begin-drag-pet-window'"),
        source.indexOf("    ipcMain.on('ailis:set-pet-mouse-passthrough'"));
    for (const padding of [190, 0]) {
        const initial = layoutAt(1491, 0, padding, padding ? 220 : 0);
        const calls = new Map(); const sent = []; let cursor = { x: 0, y: 0 }; let positions = 0;
        const window = { isDestroyed: () => false, isVisible: () => true, getBounds: () => initial.expandedBounds,
            setPosition: () => assert.fail('do not round-trip native bounds during drag'),
            setBounds: bounds => {
                positions++;
                assert.equal(bounds.width, initial.expandedBounds.width);
                assert.equal(bounds.height, initial.expandedBounds.height);
            },
            webContents: { send: (event, value) => sent.push({ event, value }) } };
        const context = vm.createContext({
            petWindow: window, petWindowLayout: initial, petDialogueCollapsedBounds: initial.baseBounds,
            petDialogueExpanded: Boolean(padding), petDialogueExtraTop: padding, petDialogueExtraWidth: padding ? 220 : 0,
            petDragState: null, desktopState: { petWindow: {} }, desktopPlatformAdapter: adapter,
            screen: { getCursorScreenPoint: () => ({ ...cursor }) },
            BrowserWindow: { fromWebContents: sender => sender === window.webContents ? window : null },
            ipcMain: { on: (event, handler) => calls.set(event, handler) },
            getPetDialogueExpandedLayout: (baseBounds, top, width) => adapter.getExpandedWindowLayout({
                baseBounds, requestedExtraTop: top, requestedExtraWidth: width }),
            setPetWindowBoundsTransient: () => assert.fail('drag resized the window'), updateWindowState: () => {}
        });
        vm.runInContext(helper + handlers, context);
        const event = { sender: window.webContents };
        for (const target of [{ x: 1311, y: 667 }, { x: 600, y: 100 }, { x: 0, y: 0 }, { x: 1491, y: 731 }]) {
            calls.get('ailis:begin-drag-pet-window')(event);
            const base = context.petDialogueCollapsedBounds;
            cursor = { x: cursor.x + target.x - base.x, y: cursor.y + target.y - base.y };
            calls.get('ailis:drag-pet-window')(event);
            calls.get('ailis:end-drag-pet-window')(event);
            assert.equal(context.petWindowLayout.baseBounds.width, 216);
            assert.equal(context.petWindowLayout.baseBounds.height, 288);
            assert.equal(context.petWindowLayout.expandedBounds.height, 288 + padding);
            assert.equal(context.petWindowLayout.baseBounds.y, target.y);
        }
        assert.equal(positions, 4);
        assert.equal(sent.length, 4);
        assert.ok(sent.every(s => s.event === 'ailis:pet-window-layout'));
    }
});

test('bubbles use visible space without covering the avatar at any screen edge', () => {
    for (const x of [0, 750, 1491]) for (const y of [0, 100, 190, 731]) {
        const l = layoutAt(x, y);
        const a = { left: 154, right: 282, top: 215, bottom: 458 };
        const bubble = layoutPetBubble({ visibleBounds: l.visibleBounds, avatarBounds: a, width: 320, height: 140 });
        assert.ok(bubble, `no bubble slot at ${x},${y}`);
        assert.ok(bubble.left >= l.visibleBounds.left && bubble.top >= l.visibleBounds.top);
        assert.ok(bubble.left + bubble.width <= l.visibleBounds.right);
        assert.ok(bubble.top + bubble.height <= l.visibleBounds.bottom);
        assert.ok(bubble.left + bubble.width <= a.left || bubble.left >= a.right ||
            bubble.top + bubble.height <= a.top || bubble.top >= a.bottom);
        if (y >= 190) assert.equal(bubble.side, 'above');
        if (y === 0) assert.ok(['left', 'right', 'below'].includes(bubble.side));
    }
});
