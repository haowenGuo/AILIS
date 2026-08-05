const dgram = require('dgram');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawn } = require('child_process');
const { EventEmitter } = require('events');

const DEFAULT_COMMAND_PORT = 19131;
const DEFAULT_EVENT_PORT = 19132;
const READY_TIMEOUT_MS = 30000;

function normalizeRendererBackend(value) {
    return String(value || '').trim().toLowerCase() === 'unity' ? 'unity' : 'electron';
}

function sanitizeBounds(bounds = {}) {
    const number = (value, fallback) => Number.isFinite(Number(value))
        ? Math.round(Number(value))
        : fallback;
    return {
        x: number(bounds.x, 0),
        y: number(bounds.y, 0),
        width: Math.max(180, number(bounds.width, 720)),
        height: Math.max(240, number(bounds.height, 960))
    };
}

function scaleBoundsForRenderer(bounds, scaleFactor = 1) {
    const safeBounds = sanitizeBounds(bounds);
    const factor = Number.isFinite(Number(scaleFactor)) && Number(scaleFactor) > 0
        ? Number(scaleFactor)
        : 1;
    return {
        x: Math.round(safeBounds.x * factor),
        y: Math.round(safeBounds.y * factor),
        width: Math.round(safeBounds.width * factor),
        height: Math.round(safeBounds.height * factor)
    };
}

function normalizeRendererWindowPhase(value) {
    const phase = String(value || '').trim().toLowerCase();
    if (phase === 'drag_begin' || phase === 'drag' || phase === 'settle') {
        return phase;
    }
    return 'sync';
}

function normalizeRendererHitTestBounds(event = {}, scaleFactor = 1) {
    const factor = Number.isFinite(Number(scaleFactor)) && Number(scaleFactor) > 0
        ? Number(scaleFactor)
        : 1;
    const x = Number(event.x);
    const y = Number(event.y);
    const width = Number(event.width);
    const height = Number(event.height);
    if (
        event.complete === false ||
        !Number.isFinite(x) ||
        !Number.isFinite(y) ||
        !Number.isFinite(width) ||
        !Number.isFinite(height) ||
        width <= 0 ||
        height <= 0
    ) {
        return null;
    }

    const left = x / factor;
    const top = y / factor;
    const normalizedWidth = width / factor;
    const normalizedHeight = height / factor;
    const maskWidth = Math.max(0, Math.min(256, Math.round(Number(event.maskWidth) || 0)));
    const maskHeight = Math.max(0, Math.min(256, Math.round(Number(event.maskHeight) || 0)));
    const mask = String(event.mask || '');
    const hasMask =
        String(event.maskEncoding || '') === 'bitset-base64-v1' &&
        maskWidth > 0 &&
        maskHeight > 0 &&
        mask.length > 0;
    const normalized = {
        left,
        top,
        right: left + normalizedWidth,
        bottom: top + normalizedHeight,
        width: normalizedWidth,
        height: normalizedHeight,
        source: 'unity',
        shape: hasMask ? 'mask' : String(event.shape || 'ellipse'),
        complete: true,
        timestamp: Number(event.timestamp || Date.now())
    };
    if (hasMask) {
        normalized.maskEncoding = 'bitset-base64-v1';
        normalized.mask = mask;
        normalized.maskWidth = maskWidth;
        normalized.maskHeight = maskHeight;
    }
    return normalized;
}

function pointInRendererHitTestBounds(point = {}, bounds = null) {
    if (!bounds || bounds.complete === false) {
        return false;
    }
    const x = Number(point.x);
    const y = Number(point.y);
    const left = Number(bounds.left);
    const top = Number(bounds.top);
    const right = Number(bounds.right);
    const bottom = Number(bounds.bottom);
    if (
        !Number.isFinite(x) ||
        !Number.isFinite(y) ||
        !Number.isFinite(left) ||
        !Number.isFinite(top) ||
        !Number.isFinite(right) ||
        !Number.isFinite(bottom) ||
        right <= left ||
        bottom <= top
    ) {
        return false;
    }
    if (x < left || x > right || y < top || y > bottom) {
        return false;
    }
    if (
        bounds.shape === 'mask' &&
        bounds.maskEncoding === 'bitset-base64-v1' &&
        bounds.mask &&
        bounds.maskWidth > 0 &&
        bounds.maskHeight > 0
    ) {
        const relativeX = Math.min(
            bounds.maskWidth - 1,
            Math.max(0, Math.floor((x - left) / (right - left) * bounds.maskWidth))
        );
        const relativeY = Math.min(
            bounds.maskHeight - 1,
            Math.max(0, Math.floor((y - top) / (bottom - top) * bounds.maskHeight))
        );
        const bitIndex = relativeY * bounds.maskWidth + relativeX;
        const bytes = Buffer.from(bounds.mask, 'base64');
        return Boolean(bytes[bitIndex >> 3] & (1 << (bitIndex & 7)));
    }
    if (String(bounds.shape || '').toLowerCase() === 'rectangle') {
        return true;
    }
    const radiusX = (right - left) / 2;
    const radiusY = (bottom - top) / 2;
    const normalizedX = (x - (left + radiusX)) / radiusX;
    const normalizedY = (y - (top + radiusY)) / radiusY;
    return normalizedX * normalizedX + normalizedY * normalizedY <= 1;
}

function clampRendererWindowByVisibleContent(
    windowBounds = {},
    contentBounds = null,
    displayBounds = {},
    margin = 0
) {
    const windowX = Number(windowBounds.x);
    const windowY = Number(windowBounds.y);
    const windowWidth = Number(windowBounds.width);
    const windowHeight = Number(windowBounds.height);
    const left = Number(contentBounds?.left);
    const top = Number(contentBounds?.top);
    const right = Number(contentBounds?.right);
    const bottom = Number(contentBounds?.bottom);
    const displayX = Number(displayBounds.x);
    const displayY = Number(displayBounds.y);
    const displayWidth = Number(displayBounds.width);
    const displayHeight = Number(displayBounds.height);
    const safeMargin = Math.max(0, Number(margin) || 0);

    if (
        !Number.isFinite(windowX) ||
        !Number.isFinite(windowY) ||
        !Number.isFinite(windowWidth) ||
        !Number.isFinite(windowHeight) ||
        !Number.isFinite(left) ||
        !Number.isFinite(top) ||
        !Number.isFinite(right) ||
        !Number.isFinite(bottom) ||
        right <= left ||
        bottom <= top ||
        !Number.isFinite(displayX) ||
        !Number.isFinite(displayY) ||
        !Number.isFinite(displayWidth) ||
        !Number.isFinite(displayHeight) ||
        displayWidth <= 0 ||
        displayHeight <= 0
    ) {
        return null;
    }

    const minimumX = displayX + safeMargin - left;
    const maximumX = displayX + displayWidth - safeMargin - right;
    const minimumY = displayY + safeMargin - top;
    const maximumY = displayY + displayHeight - safeMargin - bottom;
    const clampAxis = (value, minimum, maximum) => {
        if (maximum < minimum) {
            return Math.round((minimum + maximum) / 2);
        }
        return Math.round(Math.min(Math.max(value, minimum), maximum));
    };

    return {
        ...windowBounds,
        x: clampAxis(windowX, minimumX, maximumX),
        y: clampAxis(windowY, minimumY, maximumY)
    };
}

class AILISCharacterRendererRuntime extends EventEmitter {
    constructor(options = {}) {
        super();
        this.enabled = options.enabled !== false;
        this.projectRoot = path.resolve(options.projectRoot || path.join(__dirname, '..'));
        this.resourcesPath = String(options.resourcesPath || '').trim();
        this.platform = options.platform || process.platform;
        this.commandPort = Number(options.commandPort || process.env.AILIS_UNITY_RENDERER_PORT || DEFAULT_COMMAND_PORT);
        this.eventPort = Number(options.eventPort || process.env.AILIS_UNITY_RENDERER_EVENT_PORT || DEFAULT_EVENT_PORT);
        this.spawnProcess = options.spawnProcess || spawn;
        this.createSocket = options.createSocket || (() => dgram.createSocket('udp4'));
        this.child = null;
        this.socket = null;
        this.readyTimer = null;
        this.desiredBackend = 'electron';
        this.status = 'electron';
        this.lastError = '';
        this.lastConfiguration = null;
        this.lastWindowBounds = null;
        this.lastSentWindowBoundsFingerprint = '';
        this.lastHitTestBounds = null;
        this.displayScaleFactor = 1;
        this.lastSentConfiguration = '';
        this.bootstrapSettingsPath = '';
        this.stopping = false;
        this.failureInProgress = false;
        this.selectedCharacterPackageId = '';
        this.lastAnimationDebugState = null;
        this.pendingAnimationDebugRequests = new Map();
    }

    getStatus() {
        const activePackage = this.getActiveCharacterPackage();
        return {
            featureEnabled: this.enabled,
            desiredBackend: this.desiredBackend,
            effectiveBackend: this.status === 'ready' ? 'unity' : 'electron',
            status: this.status,
            available: Boolean(this.resolveUnityExecutable()),
            executablePath: this.resolveUnityExecutable(),
            processId: this.child?.pid || null,
            commandPort: this.commandPort,
            eventPort: this.eventPort,
            characterPackageId: activePackage?.id || '',
            characterPackageName: activePackage?.displayName || '',
            hitTestBounds: this.lastHitTestBounds,
            error: this.lastError
        };
    }

    getDefaultCharacterManifestCandidates() {
        const executablePath = this.resolveUnityExecutable();
        const executableDirectory = executablePath ? path.dirname(executablePath) : '';
        const executableName = executablePath
            ? path.basename(executablePath, path.extname(executablePath))
            : 'AILISCharacterDemo';
        return [
            process.env.AILIS_UNITY_CHARACTER_MANIFEST,
            executableDirectory && path.join(
                executableDirectory,
                `${executableName}_Data`,
                'StreamingAssets',
                'ailis-character.json'
            ),
            path.join(
                this.projectRoot,
                'unity-character-demo',
                'Build',
                this.platform === 'win32' ? 'Windows' : this.platform,
                'AILISCharacterDemo_Data',
                'StreamingAssets',
                'ailis-character.json'
            )
        ].filter(Boolean);
    }

    getStreamingAssetsDirectories() {
        const directories = [];
        for (const manifestPath of this.getDefaultCharacterManifestCandidates()) {
            directories.push(path.dirname(manifestPath));
        }
        directories.push(path.join(
            this.projectRoot,
            'unity-character-demo',
            'Assets',
            'StreamingAssets'
        ));
        return [...new Set(
            directories
                .map((directory) => path.resolve(directory))
                .filter((directory) => fs.existsSync(directory))
        )];
    }

    readCharacterPackage(manifestPath, source = 'installed') {
        try {
            const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
            const id = String(manifest?.id || '').trim();
            if (!id || id.length > 120) {
                return null;
            }
            const adapter = String(manifest?.adapter || 'vrm').trim() || 'vrm';
            const model = String(manifest?.model || '').trim();
            return {
                id,
                displayName: String(manifest?.displayName || id).trim() || id,
                adapter,
                manifestPath: path.resolve(manifestPath),
                modelPath: model
                    ? path.resolve(path.dirname(manifestPath), model)
                    : '',
                source
            };
        } catch {
            return null;
        }
    }

    listCharacterPackages() {
        const packages = new Map();
        const addPackage = (manifestPath, source) => {
            if (!manifestPath || !fs.existsSync(manifestPath)) {
                return;
            }
            const descriptor = this.readCharacterPackage(manifestPath, source);
            if (descriptor && !packages.has(descriptor.id)) {
                packages.set(descriptor.id, descriptor);
            }
        };

        for (const streamingAssets of this.getStreamingAssetsDirectories()) {
            const charactersDirectory = path.join(streamingAssets, 'Characters');
            if (!fs.existsSync(charactersDirectory)) {
                continue;
            }
            const entries = fs.readdirSync(charactersDirectory, { withFileTypes: true })
                .filter((entry) => entry.isDirectory())
                .sort((left, right) => left.name.localeCompare(right.name));
            for (const entry of entries) {
                addPackage(
                    path.join(charactersDirectory, entry.name, 'ailis-character.json'),
                    streamingAssets.includes(`${path.sep}Build${path.sep}`)
                        ? 'build'
                        : 'project'
                );
            }
        }
        for (const manifestPath of this.getDefaultCharacterManifestCandidates()) {
            addPackage(manifestPath, 'active');
        }
        return [...packages.values()];
    }

    selectCharacterPackage(packageId) {
        const normalizedId = String(packageId || '').trim();
        if (!normalizedId) {
            this.selectedCharacterPackageId = '';
            return this.getActiveCharacterPackage();
        }
        const selected = this.listCharacterPackages().find(
            (item) => item.id === normalizedId
        );
        if (!selected) {
            return null;
        }
        this.selectedCharacterPackageId = selected.id;
        return selected;
    }

    getActiveCharacterPackage() {
        const packages = this.listCharacterPackages();
        if (this.selectedCharacterPackageId) {
            const selected = packages.find(
                (item) => item.id === this.selectedCharacterPackageId
            );
            if (selected) {
                return selected;
            }
        }
        const defaultManifestPath = this.getDefaultCharacterManifestCandidates()
            .find((candidate) => fs.existsSync(candidate));
        const defaultPackage = defaultManifestPath
            ? this.readCharacterPackage(defaultManifestPath, 'active')
            : null;
        return defaultPackage || packages[0] || null;
    }

    resolveCharacterManifestPath() {
        return this.getActiveCharacterPackage()?.manifestPath || '';
    }

    getCapabilities() {
        const manifestPath = this.resolveCharacterManifestPath();
        let manifest = null;
        if (manifestPath) {
            try {
                manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
            } catch {
                manifest = null;
            }
        }
        const normalizeStrings = (values) => Array.isArray(values)
            ? values.map((value) => String(value || '').trim()).filter(Boolean)
            : [];
        const vrmExpressionProfile = manifest?.vrmExpressionProfile;
        const vrmBindings = Array.isArray(vrmExpressionProfile?.bindings)
            ? vrmExpressionProfile.bindings
            : null;
        const expressions = vrmBindings
            ? vrmBindings.map((expression) => {
                const preset = String(expression?.preset || 'custom').trim();
                const customName = String(expression?.customName || '').trim();
                const expressionKey = preset.toLowerCase() === 'custom'
                    ? customName
                    : preset;
                return {
                    id: String(expression?.id || expressionKey),
                    key: expressionKey,
                    preset,
                    customName,
                    standard: String(vrmExpressionProfile?.standard || 'VRM-1.0'),
                    driver: String(expression?.driver || ''),
                    stateName: String(expression?.stateName || ''),
                    semanticChannels: expressionKey ? [expressionKey] : [],
                    isBinary: expression?.isBinary === true,
                    overrideBlink: String(expression?.overrideBlink || 'none'),
                    overrideLookAt: String(expression?.overrideLookAt || 'none'),
                    overrideMouth: String(expression?.overrideMouth || 'none'),
                    morphTargetCount: Array.isArray(expression?.morphTargetBindings)
                        ? expression.morphTargetBindings.length
                        : 0,
                    priority: Number(expression?.priority || 0)
                };
            })
            : Array.isArray(manifest?.expressions)
                ? manifest.expressions.map((expression) => ({
                    id: String(expression?.id || ''),
                    key: String(expression?.id || ''),
                    preset: '',
                    customName: '',
                    standard: 'legacy',
                    driver: String(expression?.driver || ''),
                    stateName: String(expression?.stateName || ''),
                    semanticChannels: normalizeStrings(expression?.semanticChannels),
                    isBinary: false,
                    overrideBlink: 'none',
                    overrideLookAt: 'none',
                    overrideMouth: 'none',
                    morphTargetCount: 0,
                    priority: Number(expression?.priority || 0)
                }))
                : [];
        return {
            schema: 'ailis.character-capabilities.v2',
            backend: this.getStatus().effectiveBackend,
            packageId: String(manifest?.id || ''),
            displayName: String(manifest?.displayName || ''),
            characters: this.listCharacterPackages().map((item) => ({
                id: item.id,
                displayName: item.displayName,
                adapter: item.adapter,
                source: item.source,
                selected: item.id === String(manifest?.id || '')
            })),
            expressionStandard: vrmBindings
                ? String(vrmExpressionProfile?.standard || 'VRM-1.0')
                : 'legacy',
            expressions,
            motions: Array.isArray(manifest?.motions)
                ? manifest.motions.map((motion) => ({
                    id: String(motion?.id || ''),
                    displayName: String(motion?.displayName || ''),
                    sourceId: String(motion?.sourceId || ''),
                    license: String(motion?.license || ''),
                    styleTags: normalizeStrings(motion?.styleTags),
                    file: String(motion?.file || ''),
                    stateName: String(motion?.stateName || ''),
                    bakedClipResource: String(
                        motion?.bakedClipResource || ''
                    ),
                    performanceLayer: String(motion?.performanceLayer || ''),
                    nativeLayerId: String(motion?.nativeLayerId || ''),
                    nativeParameter: String(motion?.nativeParameter || ''),
                    nativeParameterType: String(
                        motion?.nativeParameterType || ''
                    ),
                    nativeParameterValue: Number(
                        motion?.nativeParameterValue || 0
                    ),
                    loop: motion?.loop === true,
                    fallbackDurationSeconds: Number(
                        motion?.fallbackDurationSeconds || 0
                    ),
                    transitionSeconds: Number(motion?.transitionSeconds || 0),
                    gestureIntents: normalizeStrings(motion?.gestureIntents),
                    taskStates: normalizeStrings(motion?.taskStates),
                    emotions: normalizeStrings(motion?.emotions),
                    compatibility: String(motion?.compatibility || 'approved'),
                    acceptanceGrade: String(motion?.acceptanceGrade || ''),
                    acceptanceNote: String(motion?.acceptanceNote || ''),
                    fallbackMotionId: String(motion?.fallbackMotionId || ''),
                    collisionZones: normalizeStrings(motion?.collisionZones),
                    priority: Number(motion?.priority || 0)
                }))
                : []
        };
    }

    resolveUnityExecutable() {
        if (!this.enabled) {
            return '';
        }
        const executableName = this.platform === 'win32'
            ? 'AILISCharacterDemo.exe'
            : 'AILISCharacterDemo';
        const candidates = [
            process.env.AILIS_UNITY_RENDERER_EXE,
            this.resourcesPath && path.join(
                this.resourcesPath,
                'character-renderers',
                'unity',
                executableName
            ),
            path.join(
                this.projectRoot,
                'unity-character-demo',
                'Build',
                this.platform === 'win32' ? 'Windows' : this.platform,
                executableName
            )
        ].filter(Boolean);
        return candidates.find((candidate) => fs.existsSync(candidate)) || '';
    }

    async activate(backend, options = {}) {
        this.desiredBackend = normalizeRendererBackend(backend);
        if (this.desiredBackend === 'electron') {
            await this.stop('renderer_switched_to_electron');
            this.status = 'electron';
            this.lastError = '';
            this.emit('state', this.getStatus());
            return this.getStatus();
        }

        if (!this.enabled) {
            this.status = 'fallback';
            this.lastError = 'Unity character rendering is not available in this product variant.';
            this.emit('fallback', this.getStatus());
            this.emit('state', this.getStatus());
            return this.getStatus();
        }

        const previousPackageId = this.getActiveCharacterPackage()?.id || '';
        const requestedPackageId = String(options.characterPackageId || '').trim();
        if (requestedPackageId && !this.selectCharacterPackage(requestedPackageId)) {
            this.status = 'fallback';
            this.lastError = `Character package is not installed: ${requestedPackageId}`;
            this.emit('fallback', this.getStatus());
            this.emit('state', this.getStatus());
            return this.getStatus();
        }
        const activePackage = this.getActiveCharacterPackage();
        const characterPackageChanged = Boolean(
            requestedPackageId &&
            activePackage?.id &&
            activePackage.id !== previousPackageId
        );

        const executablePath = this.resolveUnityExecutable();
        if (!executablePath) {
            this.status = 'fallback';
            this.lastError = 'Unity character renderer is not installed.';
            this.emit('fallback', this.getStatus());
            this.emit('state', this.getStatus());
            return this.getStatus();
        }

        this.lastConfiguration = this.createConfiguration(options);
        this.displayScaleFactor = Number.isFinite(Number(options.displayScaleFactor)) &&
            Number(options.displayScaleFactor) > 0
            ? Number(options.displayScaleFactor)
            : 1;
        this.lastWindowBounds = scaleBoundsForRenderer(
            options.bounds,
            options.displayScaleFactor
        );
        if (characterPackageChanged && this.child && !this.child.killed) {
            await this.stop('character_package_changed');
        }
        if (this.child && !this.child.killed) {
            this.sendConfiguration(this.lastConfiguration);
            this.sendWindowBounds(this.lastWindowBounds);
            return this.getStatus();
        }

        this.lastSentConfiguration = '';
        this.removeBootstrapSettingsFile();
        this.bootstrapSettingsPath = this.writeBootstrapSettings(this.lastConfiguration);
        await this.ensureEventSocket();
        this.stopping = false;
        this.failureInProgress = false;
        this.status = 'starting';
        this.lastError = '';
        const logPath = String(options.logPath || path.join(
            this.projectRoot,
            'unity-character-demo',
            'Logs',
            'ailis-integrated-renderer.log'
        ));
        fs.mkdirSync(path.dirname(logPath), { recursive: true });
        const args = [
            '-popupwindow',
            '-screen-fullscreen', '0',
            '-screen-width', String(this.lastWindowBounds.width),
            '-screen-height', String(this.lastWindowBounds.height),
            '--port', String(this.commandPort),
            '--event-port', String(this.eventPort),
            '--width', String(this.lastWindowBounds.width),
            '--height', String(this.lastWindowBounds.height),
            '--x', String(this.lastWindowBounds.x),
            '--y', String(this.lastWindowBounds.y),
            '--transparent', 'true',
            '--topmost', 'true',
            '-logFile', logPath
        ];
        if (activePackage?.manifestPath) {
            args.push('--character-package', activePackage.manifestPath);
        }
        if (this.bootstrapSettingsPath) {
            args.push('--settings-file', this.bootstrapSettingsPath);
        }
        this.child = this.spawnProcess(executablePath, args, {
            cwd: path.dirname(executablePath),
            // Unity needs a realized native window while UniVRM uploads meshes/materials.
            // Hiding the process at CreateProcess time can stall LoadPathAsync indefinitely.
            windowsHide: false,
            stdio: 'ignore'
        });
        this.child.once('error', (error) => this.handleProcessFailure(error));
        this.child.once('exit', (code, signal) => this.handleProcessExit(code, signal));
        clearTimeout(this.readyTimer);
        this.readyTimer = setTimeout(() => {
            if (this.status !== 'ready') {
                this.handleProcessFailure(new Error(`Unity renderer did not become ready within ${READY_TIMEOUT_MS}ms.`));
            }
        }, READY_TIMEOUT_MS);
        this.readyTimer.unref?.();
        this.emit('state', this.getStatus());
        return this.getStatus();
    }

    createConfiguration(options = {}) {
        const preferences = options.preferences || {};
        const unity = preferences.unityRenderer && typeof preferences.unityRenderer === 'object'
            ? preferences.unityRenderer
            : {};
        const legacyPerformancePreset = Number(unity.performanceTuningVersion || 0) < 2 &&
            String(unity.pipelineAsset || '').toLowerCase() === 'performance' &&
            Number(unity.targetFrameRate) === 30 &&
            Number(unity.renderScale) === 0.85 &&
            Number(unity.msaaSampleCount) === 2;
        return {
            schema: 'ailis.character-renderer-settings.v4',
            performanceTuningVersion: 2,
            pipelineAsset: String(unity.pipelineAsset || 'balanced'),
            targetFrameRate: legacyPerformancePreset
                ? 60
                : Math.max(24, Number(unity.targetFrameRate || 60)),
            renderScale: Number(unity.renderScale ?? 1),
            msaaSampleCount: Number(unity.msaaSampleCount ?? 4),
            adaptiveSupersampling: unity.adaptiveSupersampling !== false,
            shadowDistance: Number(unity.shadowDistance ?? 12),
            shadowCascadeCount: Number(unity.shadowCascadeCount ?? 2),
            cameraAntialiasing: String(unity.cameraAntialiasing || 'none'),
            cameraAntialiasingQuality: String(unity.cameraAntialiasingQuality || 'medium'),
            renderPostProcessing: unity.renderPostProcessing === true,
            postExposure: Number(unity.postExposure ?? 0),
            contrast: Number(unity.contrast ?? 0),
            saturation: Number(unity.saturation ?? 0),
            bloomIntensity: Number(unity.bloomIntensity ?? 0),
            mtoonOutlineWidthMultiplier: Number(unity.mtoonOutlineWidthMultiplier ?? 0.75),
            mtoonOutlineColorBlend: Number(unity.mtoonOutlineColorBlend ?? 0.58),
            cameraFramingMode: String(unity.cameraFramingMode || 'full-body'),
            cameraFieldOfView: Number(unity.cameraFieldOfView ?? 38),
            cameraDistance: Number(unity.cameraDistance ?? 2.15),
            cameraHeight: Number(unity.cameraHeight ?? 1.3),
            cameraTargetHeight: Number(unity.cameraTargetHeight ?? 1.18),
            cameraHorizontalOffset: Number(unity.cameraHorizontalOffset ?? 0),
            framingPadding: Number(unity.framingPadding ?? 1.14),
            framingVerticalBias: Number(unity.framingVerticalBias ?? 0.02),
            ambientIntensity: Number(unity.ambientIntensity ?? 1.05),
            mainLightShadows: unity.mainLightShadows !== false,
            mainLightShadowStrength: Number(unity.mainLightShadowStrength ?? 0.45),
            keyLightIntensity: Number(unity.keyLightIntensity ?? 1.1),
            keyLightYaw: Number(unity.keyLightYaw ?? 160),
            keyLightPitch: Number(unity.keyLightPitch ?? 30),
            keyLightColor: String(unity.keyLightColor || '#FFF2E8'),
            fillLightIntensity: Number(unity.fillLightIntensity ?? 0.78),
            fillLightColor: String(unity.fillLightColor || '#E8EEFF'),
            rimLightIntensity: Number(unity.rimLightIntensity ?? 0.58),
            rimLightColor: String(unity.rimLightColor || '#CFE7FF'),
            showDebugOverlay: false,
            lipSyncMode: 'energy'
        };
    }

    async ensureEventSocket() {
        if (this.socket) {
            return;
        }
        const socket = this.createSocket();
        socket.on('message', (bytes) => this.handleRendererEvent(bytes));
        socket.on('error', (error) => {
            this.lastError = error.message || String(error);
            this.emit('state', this.getStatus());
        });
        await new Promise((resolve, reject) => {
            socket.once('error', reject);
            socket.bind(this.eventPort, '127.0.0.1', () => {
                socket.removeListener('error', reject);
                resolve();
            });
        });
        this.socket = socket;
    }

    handleRendererEvent(bytes) {
        let event;
        try {
            event = JSON.parse(Buffer.from(bytes).toString('utf8'));
        } catch {
            return;
        }
        if (event.type === 'renderer.ready') {
            clearTimeout(this.readyTimer);
            this.readyTimer = null;
            this.status = 'ready';
            this.lastError = '';
            this.sendConfiguration(this.lastConfiguration);
            this.sendWindowBounds(this.lastWindowBounds);
            this.emit('ready', this.getStatus());
            this.emit('state', this.getStatus());
            return;
        }
        if (event.type === 'renderer.hit_test_bounds') {
            this.lastHitTestBounds = normalizeRendererHitTestBounds(
                event,
                this.displayScaleFactor
            );
            this.emit('hit-test-bounds', this.lastHitTestBounds);
        }
        if (event.type === 'character.animation.state') {
            this.lastAnimationDebugState = event.animation && typeof event.animation === 'object'
                ? event.animation
                : null;
            const pending = this.pendingAnimationDebugRequests.get(
                String(event.requestId || '')
            );
            if (pending) {
                clearTimeout(pending.timer);
                this.pendingAnimationDebugRequests.delete(
                    String(event.requestId || '')
                );
                pending.resolve({
                    ok: true,
                    action: String(event.action || ''),
                    animation: this.lastAnimationDebugState
                });
            }
        }
        this.emit('event', event);
    }

    requestAnimationDebugState(options = {}) {
        return this.sendAnimationDebugRequest({
            type: 'character.animation.state.request',
            requestId: String(
                options.requestId ||
                `character-animation-state-${Date.now()}`
            )
        }, options);
    }

    controlAnimationDebug(control = {}, options = {}) {
        const operation = String(control.operation || '')
            .trim()
            .toLowerCase();
        if (!['pause', 'resume', 'seek'].includes(operation)) {
            return Promise.resolve({
                ok: false,
                error: 'invalid_animation_debug_operation',
                animation: this.lastAnimationDebugState
            });
        }
        const layer = String(control.layer || '').trim().toLowerCase();
        const normalizedTime = Math.max(
            0,
            Math.min(1, Number(control.normalizedTime) || 0)
        );
        return this.sendAnimationDebugRequest({
            type: 'character.animation.control',
            requestId: String(
                options.requestId ||
                `character-animation-control-${Date.now()}`
            ),
            animationDebug: {
                operation,
                layer,
                normalizedTime
            }
        }, options);
    }

    sendAnimationDebugRequest(message, options = {}) {
        if (this.status !== 'ready') {
            return Promise.resolve({
                ok: false,
                error: 'unity_character_renderer_not_ready',
                animation: this.lastAnimationDebugState
            });
        }
        const requestId = String(message?.requestId || '');
        if (!requestId || this.pendingAnimationDebugRequests.has(requestId)) {
            return Promise.resolve({
                ok: false,
                error: 'invalid_animation_debug_request',
                animation: this.lastAnimationDebugState
            });
        }
        const timeoutMs = Math.max(
            250,
            Math.min(5000, Number(options.timeoutMs) || 1200)
        );
        return new Promise((resolve) => {
            const timer = setTimeout(() => {
                this.pendingAnimationDebugRequests.delete(requestId);
                resolve({
                    ok: false,
                    error: 'animation_debug_timeout',
                    animation: this.lastAnimationDebugState
                });
            }, timeoutMs);
            timer.unref?.();
            this.pendingAnimationDebugRequests.set(requestId, {
                resolve,
                timer
            });
            if (!this.send(message)) {
                clearTimeout(timer);
                this.pendingAnimationDebugRequests.delete(requestId);
                resolve({
                    ok: false,
                    error: 'character_renderer_command_not_sent',
                    animation: this.lastAnimationDebugState
                });
            }
        });
    }

    settleAnimationDebugRequests(error = 'character_renderer_stopped') {
        for (const pending of this.pendingAnimationDebugRequests.values()) {
            clearTimeout(pending.timer);
            pending.resolve({
                ok: false,
                error,
                animation: this.lastAnimationDebugState
            });
        }
        this.pendingAnimationDebugRequests.clear();
    }

    sendConfiguration(configuration = this.lastConfiguration) {
        if (!configuration) {
            return false;
        }
        const fingerprint = JSON.stringify(configuration);
        this.lastConfiguration = configuration;
        if (fingerprint === this.lastSentConfiguration) {
            return false;
        }
        const sent = this.send({
            type: 'renderer.configure',
            requestId: `renderer-config-${Date.now()}`,
            renderer: configuration
        });
        if (sent) {
            this.lastSentConfiguration = fingerprint;
        }
        return sent;
    }

    writeBootstrapSettings(configuration) {
        try {
            const directory = path.join(os.tmpdir(), 'ailis-character-renderer');
            fs.mkdirSync(directory, { recursive: true });
            const filePath = path.join(
                directory,
                `renderer-${process.pid}-${Date.now()}.json`
            );
            fs.writeFileSync(filePath, JSON.stringify(configuration), 'utf8');
            return filePath;
        } catch {
            return '';
        }
    }

    removeBootstrapSettingsFile() {
        if (!this.bootstrapSettingsPath) {
            return;
        }
        try {
            fs.rmSync(this.bootstrapSettingsPath, { force: true });
        } catch {
            // A stale bootstrap file is harmless and will be replaced next launch.
        }
        this.bootstrapSettingsPath = '';
    }

    sendWindowBounds(bounds, options = {}) {
        if (
            Number.isFinite(Number(options.displayScaleFactor)) &&
            Number(options.displayScaleFactor) > 0
        ) {
            this.displayScaleFactor = Number(options.displayScaleFactor);
        }
        const scaledBounds = options.alreadyScaled === true
            ? sanitizeBounds(bounds)
            : scaleBoundsForRenderer(bounds, options.displayScaleFactor);
        const nextBounds = {
            ...scaledBounds,
            phase: normalizeRendererWindowPhase(options.phase || bounds?.phase)
        };
        this.lastWindowBounds = nextBounds;
        const fingerprint = [
            nextBounds.x,
            nextBounds.y,
            nextBounds.width,
            nextBounds.height,
            nextBounds.phase
        ].join(':');
        if (fingerprint === this.lastSentWindowBoundsFingerprint) {
            return false;
        }
        const sent = this.send({
            type: 'renderer.window',
            requestId: `renderer-window-${Date.now()}`,
            window: nextBounds
        });
        if (sent) {
            this.lastSentWindowBoundsFingerprint = fingerprint;
        }
        return sent;
    }

    send(message) {
        if (!this.socket || !message || typeof message !== 'object') {
            return false;
        }
        const packet = Buffer.from(JSON.stringify(message), 'utf8');
        this.socket.send(packet, this.commandPort, '127.0.0.1');
        return true;
    }

    handleProcessFailure(error) {
        clearTimeout(this.readyTimer);
        this.readyTimer = null;
        this.status = 'fallback';
        this.lastHitTestBounds = null;
        this.failureInProgress = true;
        this.lastError = error?.message || String(error || 'Unity renderer failed.');
        this.settleAnimationDebugRequests('unity_character_renderer_failed');
        this.emit('fallback', this.getStatus());
        this.emit('state', this.getStatus());
        if (this.child && !this.child.killed) {
            this.child.kill();
        }
    }

    handleProcessExit(code, signal) {
        clearTimeout(this.readyTimer);
        this.readyTimer = null;
        this.child = null;
        this.lastHitTestBounds = null;
        this.lastSentWindowBoundsFingerprint = '';
        this.removeBootstrapSettingsFile();
        this.settleAnimationDebugRequests('unity_character_renderer_stopped');
        if (this.failureInProgress) {
            this.failureInProgress = false;
            this.stopping = false;
            return;
        }
        if (this.stopping || this.desiredBackend === 'electron') {
            this.status = 'electron';
            this.emit('state', this.getStatus());
            return;
        }
        this.status = 'fallback';
        this.lastError = `Unity renderer exited (${code ?? 'unknown'}${signal ? `, ${signal}` : ''}).`;
        this.emit('fallback', this.getStatus());
        this.emit('state', this.getStatus());
    }

    async stop(reason = 'shutdown') {
        clearTimeout(this.readyTimer);
        this.readyTimer = null;
        this.stopping = true;
        this.failureInProgress = false;
        const child = this.child;
        this.child = null;
        if (child && !child.killed) {
            await new Promise((resolve) => {
                let settled = false;
                const finish = () => {
                    if (settled) {
                        return;
                    }
                    settled = true;
                    clearTimeout(timeout);
                    resolve();
                };
                const timeout = setTimeout(finish, 2000);
                timeout.unref?.();
                child.once('exit', finish);
                child.kill();
            });
        }
        this.lastHitTestBounds = null;
        this.lastSentWindowBoundsFingerprint = '';
        this.removeBootstrapSettingsFile();
        if (this.socket) {
            await new Promise((resolve) => this.socket.close(resolve));
            this.socket = null;
        }
        this.status = this.desiredBackend === 'electron' ? 'electron' : 'stopped';
        this.emit('event', { type: 'renderer.stopped', detail: reason });
    }
}

module.exports = {
    AILISCharacterRendererRuntime,
    DEFAULT_COMMAND_PORT,
    DEFAULT_EVENT_PORT,
    normalizeRendererBackend,
    normalizeRendererHitTestBounds,
    normalizeRendererWindowPhase,
    pointInRendererHitTestBounds,
    clampRendererWindowByVisibleContent,
    sanitizeBounds,
    scaleBoundsForRenderer
};
