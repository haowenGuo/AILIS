import assert from 'node:assert/strict';
import test from 'node:test';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const {
    createHumanClawDesktopPlatformAdapter
} = require('../electron/humanclaw-desktop-platform-adapter.cjs');

class MockImage {
    constructor(width, height, options = {}) {
        this.width = width;
        this.height = height;
        this.empty = Boolean(options.empty);
        this.cropRect = options.cropRect || null;
    }

    getSize() {
        return {
            width: this.width,
            height: this.height
        };
    }

    isEmpty() {
        return this.empty;
    }

    crop(rect) {
        return new MockImage(rect.width, rect.height, { cropRect: rect });
    }
}

class MockBrowserWindow {
    static created = [];

    constructor(options = {}) {
        this.options = options;
        this.destroyed = false;
        this.image = new MockImage(320, 240);
        this.calls = [];
        MockBrowserWindow.created.push(this);
    }

    isDestroyed() {
        return this.destroyed;
    }

    setAlwaysOnTop(...args) {
        this.calls.push(['setAlwaysOnTop', ...args]);
    }

    setVisibleOnAllWorkspaces(...args) {
        this.calls.push(['setVisibleOnAllWorkspaces', ...args]);
    }

    setMenuBarVisibility(...args) {
        this.calls.push(['setMenuBarVisibility', ...args]);
    }

    setIgnoreMouseEvents(...args) {
        this.calls.push(['setIgnoreMouseEvents', ...args]);
    }

    show() {
        this.calls.push(['show']);
    }

    focus() {
        this.calls.push(['focus']);
    }

    async capturePage() {
        return this.image;
    }
}

function makeDisplay(overrides = {}) {
    return {
        id: 'display-1',
        scaleFactor: 1,
        size: {
            width: 800,
            height: 600
        },
        bounds: {
            x: 0,
            y: 0,
            width: 800,
            height: 600
        },
        workArea: {
            x: 0,
            y: 0,
            width: 800,
            height: 600
        },
        ...overrides
    };
}

test('desktop platform adapter clamps window bounds inside the matching display', () => {
    const display = makeDisplay();
    const adapter = createHumanClawDesktopPlatformAdapter({
        screen: {
            getDisplayMatching: () => display
        }
    });

    assert.deepEqual(
        adapter.clampBoundsToDisplay(
            { x: -40, y: 560, width: 120, height: 80 },
            200,
            120
        ),
        { x: 0, y: 480, width: 200, height: 120 }
    );
});

test('desktop platform adapter normalizes DIP region selection into image pixels', () => {
    const adapter = createHumanClawDesktopPlatformAdapter();
    const display = makeDisplay({ scaleFactor: 2 });
    const image = new MockImage(400, 240);

    assert.deepEqual(
        adapter.normalizeRegionSelection(
            { x: 12.4, y: 5.4, width: 45.2, height: 30.2 },
            display,
            image,
            { minSize: 12 }
        ),
        { x: 25, y: 11, width: 90, height: 60 }
    );

    assert.throws(
        () => adapter.normalizeRegionSelection({ x: 0, y: 0, width: 8, height: 20 }, display, image, { minSize: 12 }),
        /截图区域太小/
    );
});

test('desktop platform adapter captures the matching Electron screen source', async () => {
    const selectedImage = new MockImage(1280, 720);
    let capturedOptions = null;
    const adapter = createHumanClawDesktopPlatformAdapter({
        desktopCapturer: {
            getSources: async (options) => {
                capturedOptions = options;
                return [
                    { display_id: 'wrong-display', thumbnail: new MockImage(10, 10) },
                    { display_id: 'display-7', thumbnail: selectedImage }
                ];
            }
        },
        screen: {
            getPrimaryDisplay: () => makeDisplay({ id: 'display-7' })
        }
    });

    const image = await adapter.captureScreenSnapshot(makeDisplay({
        id: 'display-7',
        scaleFactor: 2,
        size: {
            width: 640,
            height: 360
        }
    }));

    assert.equal(image, selectedImage);
    assert.deepEqual(capturedOptions, {
        types: ['screen'],
        thumbnailSize: {
            width: 1280,
            height: 720
        }
    });
});

test('desktop platform adapter creates a transparent topmost region selection window', async () => {
    MockBrowserWindow.created = [];
    const loadedPages = [];
    const adapter = createHumanClawDesktopPlatformAdapter({
        BrowserWindow: MockBrowserWindow,
        preloadPath: 'preload.cjs',
        loadWindowContent: async (window, pageName) => {
            loadedPages.push({ window, pageName });
        }
    });

    const window = adapter.createRegionSelectionWindow(makeDisplay({
        bounds: {
            x: 10,
            y: 20,
            width: 1024,
            height: 768
        }
    }));

    assert.equal(MockBrowserWindow.created[0], window);
    assert.equal(window.options.x, 10);
    assert.equal(window.options.y, 20);
    assert.equal(window.options.width, 1024);
    assert.equal(window.options.height, 768);
    assert.equal(window.options.transparent, true);
    assert.equal(window.options.frame, false);
    assert.equal(window.options.skipTaskbar, true);
    assert.equal(window.options.webPreferences.preload, 'preload.cjs');
    assert.deepEqual(window.calls.slice(0, 3), [
        ['setAlwaysOnTop', true, 'screen-saver'],
        ['setVisibleOnAllWorkspaces', true, { visibleOnFullScreen: true }],
        ['setMenuBarVisibility', false]
    ]);

    await adapter.showRegionSelectionWindow(window, 'vision-region.html');
    assert.deepEqual(loadedPages, [{ window, pageName: 'vision-region.html' }]);
    assert.deepEqual(window.calls.slice(-2), [['show'], ['focus']]);
});

test('desktop platform adapter exposes mouse passthrough and region capture helpers', async () => {
    const screenImage = new MockImage(400, 300);
    const adapter = createHumanClawDesktopPlatformAdapter({
        BrowserWindow: MockBrowserWindow,
        desktopCapturer: {
            getSources: async () => [{ display_id: 'display-1', thumbnail: screenImage }]
        },
        screen: {
            getPrimaryDisplay: () => makeDisplay()
        }
    });
    const window = new MockBrowserWindow();

    assert.equal(adapter.setMousePassthrough(window, true), true);
    assert.deepEqual(window.calls.at(-1), ['setIgnoreMouseEvents', true, { forward: true }]);

    const cropped = await adapter.captureRegionSnapshot({
        display: makeDisplay({ scaleFactor: 2 }),
        requestSelection: async () => ({ x: 10, y: 12, width: 30, height: 20 }),
        minSize: 12
    });

    assert.deepEqual(cropped.cropRect, { x: 20, y: 24, width: 60, height: 40 });
    assert.equal(cropped.width, 60);
    assert.equal(cropped.height, 40);
});
