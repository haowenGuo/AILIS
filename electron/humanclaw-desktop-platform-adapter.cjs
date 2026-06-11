function normalizeString(value, fallback = '') {
    if (typeof value !== 'string') {
        return fallback;
    }
    const trimmed = value.trim();
    return trimmed || fallback;
}

function normalizeBoolean(value, fallback = false) {
    if (typeof value === 'boolean') {
        return value;
    }
    if (typeof value === 'string') {
        if (/^(true|1|yes|on)$/i.test(value.trim())) {
            return true;
        }
        if (/^(false|0|no|off)$/i.test(value.trim())) {
            return false;
        }
    }
    return fallback;
}

function isUsableWindow(window) {
    return Boolean(window && typeof window.isDestroyed === 'function' && !window.isDestroyed());
}

class HumanClawDesktopPlatformAdapter {
    constructor(options = {}) {
        this.BrowserWindow = options.BrowserWindow || null;
        this.desktopCapturer = options.desktopCapturer || null;
        this.screen = options.screen || null;
        this.preloadPath = normalizeString(options.preloadPath);
        this.loadWindowContent = typeof options.loadWindowContent === 'function'
            ? options.loadWindowContent
            : async () => {};
        this.platformAdapter = options.platformAdapter || null;
    }

    getStatus() {
        return {
            enabled: true,
            kind: 'electron-desktop',
            platform: this.platformAdapter?.getStatus?.() || null,
            capabilities: {
                screenCapture: Boolean(this.desktopCapturer && this.screen),
                windowCapture: Boolean(this.BrowserWindow),
                regionSelection: Boolean(this.BrowserWindow && this.screen),
                alwaysOnTop: true,
                transparentWindows: true,
                mousePassthrough: true,
                displayBounds: Boolean(this.screen)
            }
        };
    }

    getPrimaryDisplay() {
        if (!this.screen?.getPrimaryDisplay) {
            throw new Error('Electron screen module is not available.');
        }
        return this.screen.getPrimaryDisplay();
    }

    getDisplayMatching(bounds) {
        if (!this.screen?.getDisplayMatching) {
            return this.getPrimaryDisplay();
        }
        return this.screen.getDisplayMatching(bounds);
    }

    clampBoundsToDisplay(bounds, minimumWidth = 320, minimumHeight = 320) {
        const display = this.getDisplayMatching(bounds);
        const workArea = display.workArea;
        const width = Math.min(Math.max(bounds.width, minimumWidth), workArea.width);
        const height = Math.min(Math.max(bounds.height, minimumHeight), workArea.height);

        return {
            ...bounds,
            width,
            height,
            x: Math.min(Math.max(bounds.x, workArea.x), workArea.x + workArea.width - width),
            y: Math.min(Math.max(bounds.y, workArea.y), workArea.y + workArea.height - height)
        };
    }

    buildWindowOptions(options = {}) {
        const webPreferences = {
            preload: options.preloadPath || this.preloadPath,
            contextIsolation: true,
            nodeIntegration: false,
            sandbox: false,
            ...(options.webPreferences || {})
        };
        return {
            ...(options.bounds || {}),
            ...(options.minWidth ? { minWidth: options.minWidth } : {}),
            ...(options.minHeight ? { minHeight: options.minHeight } : {}),
            frame: options.frame === undefined ? false : Boolean(options.frame),
            transparent: Boolean(options.transparent),
            backgroundColor: normalizeString(options.backgroundColor, options.transparent ? '#00000000' : '#ffffff'),
            hasShadow: options.hasShadow === undefined ? !options.transparent : Boolean(options.hasShadow),
            resizable: options.resizable === undefined ? true : Boolean(options.resizable),
            movable: options.movable === undefined ? true : Boolean(options.movable),
            minimizable: options.minimizable === undefined ? true : Boolean(options.minimizable),
            maximizable: options.maximizable === undefined ? true : Boolean(options.maximizable),
            fullscreenable: options.fullscreenable === undefined ? true : Boolean(options.fullscreenable),
            skipTaskbar: Boolean(options.skipTaskbar),
            alwaysOnTop: Boolean(options.alwaysOnTop),
            show: Boolean(options.show),
            title: normalizeString(options.title, 'AIGL Window'),
            webPreferences
        };
    }

    createWindow(options = {}) {
        if (!this.BrowserWindow) {
            throw new Error('Electron BrowserWindow module is not available.');
        }
        return new this.BrowserWindow(this.buildWindowOptions(options));
    }

    applyWindowBehavior(window, options = {}) {
        if (!isUsableWindow(window)) {
            return false;
        }
        if (options.alwaysOnTop !== undefined && typeof window.setAlwaysOnTop === 'function') {
            window.setAlwaysOnTop(Boolean(options.alwaysOnTop), normalizeString(options.alwaysOnTopLevel, 'screen-saver'));
        }
        if (options.visibleOnAllWorkspaces !== undefined && typeof window.setVisibleOnAllWorkspaces === 'function') {
            window.setVisibleOnAllWorkspaces(Boolean(options.visibleOnAllWorkspaces), {
                visibleOnFullScreen: options.visibleOnFullScreen === undefined ? true : Boolean(options.visibleOnFullScreen)
            });
        }
        if (options.menuBarVisible !== undefined && typeof window.setMenuBarVisibility === 'function') {
            window.setMenuBarVisibility(Boolean(options.menuBarVisible));
        }
        if (options.mousePassthrough !== undefined) {
            this.setMousePassthrough(window, Boolean(options.mousePassthrough), options);
        }
        return true;
    }

    setMousePassthrough(window, enabled, options = {}) {
        if (!isUsableWindow(window) || typeof window.setIgnoreMouseEvents !== 'function') {
            return false;
        }
        window.setIgnoreMouseEvents(Boolean(enabled), {
            forward: options.forward === undefined ? true : Boolean(options.forward)
        });
        return true;
    }

    createRegionSelectionWindow(display, options = {}) {
        const bounds = display.bounds;
        const window = this.createWindow({
            bounds: {
                x: bounds.x,
                y: bounds.y,
                width: bounds.width,
                height: bounds.height
            },
            frame: false,
            transparent: true,
            backgroundColor: '#00000000',
            hasShadow: false,
            resizable: false,
            movable: false,
            minimizable: false,
            maximizable: false,
            fullscreenable: false,
            skipTaskbar: true,
            alwaysOnTop: true,
            show: false,
            title: normalizeString(options.title, 'AIGL Region Capture')
        });
        this.applyWindowBehavior(window, {
            alwaysOnTop: true,
            alwaysOnTopLevel: 'screen-saver',
            visibleOnAllWorkspaces: true,
            visibleOnFullScreen: true,
            menuBarVisible: false
        });
        return window;
    }

    async showRegionSelectionWindow(window, htmlFile = 'vision-region.html') {
        if (!isUsableWindow(window)) {
            return false;
        }
        await this.loadWindowContent(window, htmlFile);
        if (!isUsableWindow(window)) {
            return false;
        }
        window.show();
        window.focus();
        return true;
    }

    normalizeRegionSelection(selection = {}, display, image, options = {}) {
        const scaleFactor = Number(display?.scaleFactor) || 1;
        const imageSize = image.getSize();
        const minSize = Number(options.minSize || 1);
        const rawX = Number(selection.x);
        const rawY = Number(selection.y);
        const rawWidth = Number(selection.width);
        const rawHeight = Number(selection.height);

        if (
            !Number.isFinite(rawX) ||
            !Number.isFinite(rawY) ||
            !Number.isFinite(rawWidth) ||
            !Number.isFinite(rawHeight) ||
            rawWidth < minSize ||
            rawHeight < minSize
        ) {
            throw new Error(normalizeString(options.tooSmallMessage, '截图区域太小。'));
        }

        const x = Math.max(0, Math.min(Math.round(rawX * scaleFactor), imageSize.width - 1));
        const y = Math.max(0, Math.min(Math.round(rawY * scaleFactor), imageSize.height - 1));
        const width = Math.max(1, Math.min(Math.round(rawWidth * scaleFactor), imageSize.width - x));
        const height = Math.max(1, Math.min(Math.round(rawHeight * scaleFactor), imageSize.height - y));

        if (width < 1 || height < 1) {
            throw new Error(normalizeString(options.emptyMessage, '截图区域为空。'));
        }

        return { x, y, width, height };
    }

    async captureWindowSnapshot({ targetWindow, emptyMessage = '窗口截图为空。' } = {}) {
        if (!isUsableWindow(targetWindow)) {
            throw new Error('要截图的窗口还没有打开。');
        }
        const image = await targetWindow.capturePage();
        if (!image || image.isEmpty()) {
            throw new Error(emptyMessage);
        }
        return image;
    }

    async captureScreenSnapshot(display = this.getPrimaryDisplay()) {
        if (!this.desktopCapturer?.getSources) {
            throw new Error('Electron desktopCapturer module is not available.');
        }
        const thumbnailSize = {
            width: Math.round(display.size.width * display.scaleFactor),
            height: Math.round(display.size.height * display.scaleFactor)
        };
        const sources = await this.desktopCapturer.getSources({
            types: ['screen'],
            thumbnailSize
        });
        const source = sources.find((item) => String(item.display_id) === String(display.id)) || sources[0];
        const image = source?.thumbnail;

        if (!image || image.isEmpty()) {
            throw new Error('屏幕截图为空。');
        }
        return image;
    }

    async captureRegionSnapshot({ display = this.getPrimaryDisplay(), requestSelection, minSize = 1 } = {}) {
        if (typeof requestSelection !== 'function') {
            throw new Error('Region capture requires a requestSelection function.');
        }
        const screenImage = await this.captureScreenSnapshot(display);
        const selection = await requestSelection(display);
        const cropRect = this.normalizeRegionSelection(selection, display, screenImage, { minSize });
        const image = screenImage.crop(cropRect);

        if (!image || image.isEmpty()) {
            throw new Error('矩形截图为空。');
        }
        return image;
    }

    getExpandedWindowLayout({ baseBounds, requestedExtraTop = 0, requestedExtraWidth = 0, minimumWidth = 320, minimumHeight = 320, normalizeExtraTop, normalizeExtraWidth } = {}) {
        const safeBaseBounds = this.clampBoundsToDisplay(baseBounds, minimumWidth, minimumHeight);
        const display = this.getDisplayMatching(safeBaseBounds);
        const workArea = display.workArea;
        const extraTopNormalizer = typeof normalizeExtraTop === 'function' ? normalizeExtraTop : (value) => Math.max(0, Number(value) || 0);
        const extraWidthNormalizer = typeof normalizeExtraWidth === 'function' ? normalizeExtraWidth : (value) => Math.max(0, Number(value) || 0);
        const requestedTop = extraTopNormalizer(requestedExtraTop);
        const requestedWidth = extraWidthNormalizer(requestedExtraWidth);
        const availableTop = Math.max(0, safeBaseBounds.y - workArea.y);
        const extraTop = Math.min(
            requestedTop,
            availableTop,
            Math.max(0, workArea.height - safeBaseBounds.height)
        );
        const targetWidth = Math.min(
            safeBaseBounds.width + requestedWidth,
            workArea.width
        );
        const baseCenterX = safeBaseBounds.x + safeBaseBounds.width / 2;
        const centeredX = Math.round(baseCenterX - targetWidth / 2);
        const expandedX = Math.min(
            Math.max(centeredX, workArea.x),
            workArea.x + workArea.width - targetWidth
        );
        const reservedLeft = Math.max(0, safeBaseBounds.x - expandedX);
        const reservedRight = Math.max(
            0,
            expandedX + targetWidth - (safeBaseBounds.x + safeBaseBounds.width)
        );
        const extraWidth = Math.max(0, Math.round(reservedLeft + reservedRight));

        return {
            baseBounds: safeBaseBounds,
            extraTop,
            extraWidth,
            reservedLeft,
            reservedRight,
            expandedBounds: {
                ...safeBaseBounds,
                x: expandedX,
                y: safeBaseBounds.y - extraTop,
                width: targetWidth,
                height: safeBaseBounds.height + extraTop
            }
        };
    }
}

function createHumanClawDesktopPlatformAdapter(options = {}) {
    if (options instanceof HumanClawDesktopPlatformAdapter) {
        return options;
    }
    return new HumanClawDesktopPlatformAdapter(options);
}

module.exports = {
    HumanClawDesktopPlatformAdapter,
    createHumanClawDesktopPlatformAdapter,
    isUsableWindow
};
