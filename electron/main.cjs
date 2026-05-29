const fs = require('fs');
const fsp = require('fs/promises');
const path = require('path');
const { pathToFileURL } = require('url');
const {
    app,
    BrowserWindow,
    desktopCapturer,
    dialog,
    ipcMain,
    Menu,
    Tray,
    nativeImage,
    protocol,
    session,
    screen,
    shell
} = require('electron');
const { DesktopASRManager } = require('./local-asr-manager.cjs');
const { synthesizeElevenLabsSpeech } = require('./desktop-elevenlabs-tts.cjs');
const {
    closeCosyVoice3TTS,
    synthesizeCosyVoice3Speech,
    warmupCosyVoice3TTS
} = require('./desktop-cosyvoice3-tts.cjs');
const {
    closeKokoroTTS,
    synthesizeKokoroSpeech,
    warmupKokoroTTS
} = require('./desktop-kokoro-tts.cjs');
const {
    OpenClawGatewayManager,
    OpenClawRuntimeSupervisor
} = require('./openclaw-runtime.cjs');
const { HumanClawGateway } = require('./humanclaw-gateway.cjs');
const {
    getOpenClawToolSurface,
    getOpenClawToolSurfaceSummary,
    validateOpenClawToolSurface
} = require('./openclaw-tool-surface.cjs');
const { callDesktopLlmProvider } = require('./desktop-llm-provider.cjs');
const {
    BACKEND_MODE_OPTIONS,
    DEFAULT_AUTO_CHAT_ENABLED,
    DEFAULT_AUTO_CHAT_MAX_INTERVAL_SEC,
    DEFAULT_AUTO_CHAT_MIN_INTERVAL_SEC,
    DEFAULT_AVATAR_DIALOGUE_BUBBLE_EXTRA_TOP,
    DEFAULT_AVATAR_DIALOGUE_BUBBLE_EXTRA_WIDTH,
    DEFAULT_BACKEND_BASE_URL,
    DEFAULT_BACKEND_MODE,
    DEFAULT_CAMERA_DISTANCE,
    DEFAULT_CAMERA_HEIGHT,
    DEFAULT_CAMERA_TARGET_Y,
    DEFAULT_COMPUTER_CONTROL_ENABLED,
    DEFAULT_DESKTOP_NATIVE_TTS_PITCH,
    DEFAULT_DESKTOP_NATIVE_TTS_RATE,
    DEFAULT_DESKTOP_NATIVE_TTS_VOLUME,
    DEFAULT_LLM_BASE_URL,
    DEFAULT_LLM_MODEL,
    DEFAULT_LLM_PROVIDER,
    DEFAULT_LLM_REQUEST_TIMEOUT_MS,
    DEFAULT_LLM_TEMPERATURE,
    DEFAULT_ELEVENLABS_API_BASE,
    DEFAULT_ELEVENLABS_API_KEY,
    DEFAULT_ELEVENLABS_MODEL_ID,
    DEFAULT_ELEVENLABS_OUTPUT_FORMAT,
    DEFAULT_ELEVENLABS_TIMEOUT_MS,
    DEFAULT_ELEVENLABS_VOICE_ID,
    DEFAULT_HUMANCLAW_STATE_DIR,
    DEFAULT_OPENCLAW_GATEWAY_URL,
    DEFAULT_PET_SCALE,
    EMAIL_PROVIDER_OPTIONS,
    LLM_PROVIDER_OPTIONS,
    PET_SCALE_OPTIONS,
    RECOGNITION_MODE_OPTIONS,
    SPEECH_MODE_OPTIONS,
    getDefaultState,
    getScaledPetSize,
    loadDesktopState,
    normalizeAutoChatEnabled,
    normalizeAutoChatMaxIntervalSec,
    normalizeAutoChatMinIntervalSec,
    normalizeAvatarDialogueBubbleExtraTop,
    normalizeAvatarDialogueBubbleExtraWidth,
    normalizeAvatarDialogueBubbleLeft,
    normalizeAvatarDialogueBubbleScale,
    normalizeAvatarDialogueBubbleTop,
    normalizeBackendBaseUrl,
    normalizeBackendMode,
    normalizeCameraDistance,
    normalizeCameraHeight,
    normalizeCameraTargetY,
    normalizeComputerControlEnabled,
    normalizeDesktopNativeTTSPitch,
    normalizeDesktopNativeTTSRate,
    normalizeDesktopNativeTTSVolume,
    normalizeElevenLabsApiBase,
    normalizeElevenLabsApiKey,
    normalizeElevenLabsModelId,
    normalizeElevenLabsOutputFormat,
    normalizeElevenLabsTimeoutMs,
    normalizeElevenLabsVoiceId,
    normalizeEmailProfiles,
    normalizeHumanClawStateDir,
    normalizeLlmApiKey,
    normalizeLlmBaseUrl,
    normalizeLlmModel,
    normalizeLlmProvider,
    normalizeLlmRequestTimeoutMs,
    normalizeLlmTemperature,
    normalizeOpenClawGatewayUrl,
    normalizeRecognitionMode,
    normalizeSpeechMode,
    normalizePreferredMicDeviceId,
    normalizePetScale,
    resizePetBounds,
    saveDesktopState
} = require('./store.cjs');

const DEFAULT_DEV_SERVER_URL = 'http://127.0.0.1:5173';
const devServerUrl = process.env.AIGRIL_DESKTOP_DEV_URL || '';
const PET_MIN_SIZE = getScaledPetSize(PET_SCALE_OPTIONS[0]);
const CHAT_MIN_WIDTH = 360;
const CHAT_MIN_HEIGHT = 420;
const CONTROL_MIN_WIDTH = 760;
const CONTROL_MIN_HEIGHT = 620;
const PET_DIALOGUE_DEFAULT_EXTRA_TOP = DEFAULT_AVATAR_DIALOGUE_BUBBLE_EXTRA_TOP;
const PET_DIALOGUE_DEFAULT_EXTRA_WIDTH = DEFAULT_AVATAR_DIALOGUE_BUBBLE_EXTRA_WIDTH;
const PET_DIALOGUE_MAX_EXTRA_TOP = 360;
const PET_DIALOGUE_MAX_EXTRA_WIDTH = 520;
const KOKORO_WARMUP_DELAY_MS = 1200;
const COSYVOICE3_WARMUP_DELAY_MS = 6500;
const SPEECH_MODEL_PROTOCOL = 'aigril-model';
const SPEECH_MODEL_CACHE_DIRNAME = 'speech-models';
const VISION_CACHE_DIRNAME = 'vision-snapshots';
const HUMANCLAW_STATE_DIRNAME = '.humanclaw-state';
const VISION_CACHE_MAX_FILES = 40;
const VISION_REGION_MIN_SIZE_DIP = 12;
const VISION_MODEL_MAX_EDGE = 1800;
const VISION_MODEL_JPEG_QUALITY = 88;
const SPEECH_MODEL_REMOTE_HOSTS = {
    modelscope: 'https://www.modelscope.cn/models/',
    huggingface: 'https://huggingface.co/'
};

let petWindow = null;
let chatWindow = null;
let controlWindow = null;
let tray = null;
let isQuitting = false;
let desktopState = null;
let desktopASRManager = null;
let assistantGateway = null;
let openclawRuntimeSupervisor = null;
let humanClawGateway = null;
let petDialogueCollapsedBounds = null;
let petDialogueExpanded = false;
let petDialogueExtraTop = 0;
let petDialogueExtraWidth = 0;
let petDialogueBoundsMutation = false;
let petDialogueBoundsMutationTimer = null;
let visionRegionSelectionRequest = null;
const windowPersistTimers = new Map();
const speechModelDownloadTasks = new Map();

if (typeof protocol?.registerSchemesAsPrivileged === 'function') {
    protocol.registerSchemesAsPrivileged([
        {
            scheme: SPEECH_MODEL_PROTOCOL,
            privileges: {
                standard: true,
                secure: true,
                supportFetchAPI: true,
                corsEnabled: true,
                stream: true
            }
        }
    ]);
}

function isDevMode() {
    return Boolean(devServerUrl);
}

function buildRendererUrl(pageName) {
    if (isDevMode()) {
        return `${devServerUrl || DEFAULT_DEV_SERVER_URL}/${pageName}`;
    }
    return path.join(__dirname, '..', 'dist', pageName);
}

function ensureSafePathSegments(rawValue, fieldName) {
    const segments = String(rawValue || '')
        .split('/')
        .map((segment) => segment.trim())
        .filter(Boolean);

    if (!segments.length) {
        throw new Error(`缺少 ${fieldName}`);
    }

    for (const segment of segments) {
        if (
            segment === '.' ||
            segment === '..' ||
            segment.includes('\\') ||
            segment.includes(':')
        ) {
            throw new Error(`${fieldName} 含有非法路径片段`);
        }
    }

    return segments;
}

function resolveSpeechModelFilePath(rootDir, { source, model, revision, filename }) {
    const rootPath = path.resolve(rootDir);
    const targetPath = path.resolve(
        rootPath,
        source,
        ...ensureSafePathSegments(model, 'model'),
        revision,
        ...ensureSafePathSegments(filename, 'filename')
    );

    if (!targetPath.startsWith(rootPath)) {
        throw new Error('语音模型路径越界');
    }

    return targetPath;
}

function getSpeechModelCacheRoot() {
    return path.join(app.getPath('userData'), SPEECH_MODEL_CACHE_DIRNAME);
}

function getVisionCacheRoot() {
    return path.join(app.getPath('userData'), VISION_CACHE_DIRNAME);
}

function getProjectRoot() {
    return path.resolve(__dirname, '..');
}

function getDefaultHumanClawStateDir() {
    return path.join(getProjectRoot(), HUMANCLAW_STATE_DIRNAME);
}

function resolveHumanClawStateDir(value = '') {
    const normalized = normalizeHumanClawStateDir(value || DEFAULT_HUMANCLAW_STATE_DIR);
    if (!normalized) {
        return getDefaultHumanClawStateDir();
    }
    return path.isAbsolute(normalized)
        ? path.resolve(normalized)
        : path.resolve(getProjectRoot(), normalized);
}

function getPersistedHumanClawStateDir() {
    return resolveHumanClawStateDir(desktopState?.preferences?.humanClawStateDir);
}

function getVisionSnapshotLabel(target) {
    if (target === 'region') {
        return '矩形截图';
    }
    if (target === 'active-window') {
        return '当前窗口截图';
    }
    if (target === 'screen') {
        return '屏幕截图';
    }
    if (target === 'pet-window') {
        return '桌宠窗口截图';
    }
    if (target === 'control-window') {
        return '控制面板截图';
    }
    return '聊天窗口截图';
}

function resizeVisionImageForModel(image) {
    const size = image.getSize();
    const maxEdge = Math.max(size.width || 0, size.height || 0);
    if (!maxEdge || maxEdge <= VISION_MODEL_MAX_EDGE) {
        return image;
    }

    const scale = VISION_MODEL_MAX_EDGE / maxEdge;
    return image.resize({
        width: Math.max(1, Math.round(size.width * scale)),
        height: Math.max(1, Math.round(size.height * scale)),
        quality: 'best'
    });
}

function imageToJpegDataUrl(image, quality = VISION_MODEL_JPEG_QUALITY) {
    return `data:image/jpeg;base64,${image.toJPEG(quality).toString('base64')}`;
}

function normalizeVisionTarget(target) {
    const normalizedTarget = String(target || '').trim().toLowerCase();
    if (['screen', 'region', 'active-window', 'chat-window', 'pet-window', 'control-window'].includes(normalizedTarget)) {
        return normalizedTarget;
    }
    if (['active', 'window', 'current-window'].includes(normalizedTarget)) {
        return 'active-window';
    }
    return 'chat-window';
}

function normalizeVisionRegionSelection(selection = {}, display, image) {
    const scaleFactor = Number(display?.scaleFactor) || 1;
    const imageSize = image.getSize();
    const rawX = Number(selection.x);
    const rawY = Number(selection.y);
    const rawWidth = Number(selection.width);
    const rawHeight = Number(selection.height);

    if (
        !Number.isFinite(rawX) ||
        !Number.isFinite(rawY) ||
        !Number.isFinite(rawWidth) ||
        !Number.isFinite(rawHeight) ||
        rawWidth < VISION_REGION_MIN_SIZE_DIP ||
        rawHeight < VISION_REGION_MIN_SIZE_DIP
    ) {
        throw new Error('截图区域太小。');
    }

    const x = Math.max(0, Math.min(Math.round(rawX * scaleFactor), imageSize.width - 1));
    const y = Math.max(0, Math.min(Math.round(rawY * scaleFactor), imageSize.height - 1));
    const width = Math.max(1, Math.min(Math.round(rawWidth * scaleFactor), imageSize.width - x));
    const height = Math.max(1, Math.min(Math.round(rawHeight * scaleFactor), imageSize.height - y));

    if (width < 1 || height < 1) {
        throw new Error('截图区域为空。');
    }

    return { x, y, width, height };
}

async function cleanupVisionCache(cacheRoot) {
    try {
        const entries = await fsp.readdir(cacheRoot, { withFileTypes: true });
        const files = await Promise.all(
            entries
                .filter((entry) => entry.isFile() && /\.png$/i.test(entry.name))
                .map(async (entry) => {
                    const filePath = path.join(cacheRoot, entry.name);
                    const stat = await fsp.stat(filePath);
                    return {
                        filePath,
                        mtimeMs: stat.mtimeMs
                    };
                })
        );
        files
            .sort((a, b) => b.mtimeMs - a.mtimeMs)
            .slice(VISION_CACHE_MAX_FILES)
            .forEach((file) => {
                void fsp.unlink(file.filePath).catch(() => {});
            });
    } catch {
        // Cache cleanup is best effort.
    }
}

async function persistVisionSnapshot(image, target) {
    const cacheRoot = getVisionCacheRoot();
    await fsp.mkdir(cacheRoot, { recursive: true });
    const id = `vision-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const filePath = path.join(cacheRoot, `${id}.png`);
    const thumbnailPath = path.join(cacheRoot, `${id}.thumb.png`);
    const png = image.toPNG();
    await fsp.writeFile(filePath, png);
    void cleanupVisionCache(cacheRoot);

    const size = image.getSize();
    const modelImage = resizeVisionImageForModel(image);
    const modelSize = modelImage.getSize();
    const thumbnailWidth = Math.min(420, Math.max(1, size.width || 420));
    const thumbnail = image.resize({
        width: thumbnailWidth,
        quality: 'good'
    });
    await fsp.writeFile(thumbnailPath, thumbnail.toPNG());

    return {
        type: 'vision',
        id,
        source: target,
        label: getVisionSnapshotLabel(target),
        imagePath: filePath,
        thumbnailPath,
        dataUrl: imageToJpegDataUrl(modelImage),
        thumbnailDataUrl: thumbnail.toDataURL(),
        mimeType: 'image/jpeg',
        width: modelSize.width,
        height: modelSize.height,
        originalWidth: size.width,
        originalHeight: size.height,
        createdAt: new Date().toISOString()
    };
}

async function captureWindowSnapshot(target, sourceWindow) {
    let targetWindow = sourceWindow;
    if (target === 'active-window') {
        targetWindow = BrowserWindow.getFocusedWindow() || chatWindow || sourceWindow;
    } else if (target === 'pet-window') {
        targetWindow = petWindow;
    } else if (target === 'control-window') {
        targetWindow = controlWindow;
    } else if (target === 'chat-window') {
        targetWindow = chatWindow || sourceWindow;
    }

    if (!targetWindow || targetWindow.isDestroyed()) {
        throw new Error('要截图的窗口还没有打开。');
    }

    const image = await targetWindow.capturePage();
    if (image.isEmpty()) {
        throw new Error('窗口截图为空。');
    }
    return image;
}

async function captureScreenSnapshot(display = screen.getPrimaryDisplay()) {
    const thumbnailSize = {
        width: Math.round(display.size.width * display.scaleFactor),
        height: Math.round(display.size.height * display.scaleFactor)
    };
    const sources = await desktopCapturer.getSources({
        types: ['screen'],
        thumbnailSize
    });
    const source = sources.find((item) => String(item.display_id) === String(display.id)) ||
        sources[0];
    const image = source?.thumbnail;

    if (!image || image.isEmpty()) {
        throw new Error('屏幕截图为空。');
    }
    return image;
}

function destroyVisionRegionWindow(request) {
    const targetWindow = request?.window;
    if (targetWindow && !targetWindow.isDestroyed()) {
        targetWindow.destroy();
    }
}

function completeVisionRegionSelection(event, selection) {
    const request = visionRegionSelectionRequest;
    const sourceWindow = BrowserWindow.fromWebContents(event.sender);
    if (!request || request.window !== sourceWindow) {
        return;
    }

    visionRegionSelectionRequest = null;
    request.resolve(selection || {});
    destroyVisionRegionWindow(request);
}

function cancelVisionRegionSelection(event) {
    const request = visionRegionSelectionRequest;
    const sourceWindow = event ? BrowserWindow.fromWebContents(event.sender) : request?.window;
    if (!request || (sourceWindow && request.window !== sourceWindow)) {
        return;
    }

    visionRegionSelectionRequest = null;
    request.reject(new Error('已取消矩形截图。'));
    destroyVisionRegionWindow(request);
}

function requestVisionRegionSelection(display) {
    if (visionRegionSelectionRequest) {
        throw new Error('已有一个矩形截图正在进行。');
    }

    const bounds = display.bounds;
    const selectionWindow = new BrowserWindow({
        x: bounds.x,
        y: bounds.y,
        width: bounds.width,
        height: bounds.height,
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
        title: 'AIGL Region Capture',
        webPreferences: {
            preload: path.join(__dirname, 'preload.cjs'),
            contextIsolation: true,
            nodeIntegration: false,
            sandbox: false
        }
    });

    selectionWindow.setAlwaysOnTop(true, 'screen-saver');
    selectionWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
    selectionWindow.setMenuBarVisibility(false);

    const request = {};
    const selectionPromise = new Promise((resolve, reject) => {
        Object.assign(request, {
            window: selectionWindow,
            resolve,
            reject
        });
    });

    visionRegionSelectionRequest = request;
    selectionWindow.once('closed', () => {
        if (visionRegionSelectionRequest !== request) {
            return;
        }
        visionRegionSelectionRequest = null;
        request.reject(new Error('已取消矩形截图。'));
    });

    void loadWindowContent(selectionWindow, 'vision-region.html')
        .then(() => {
            if (selectionWindow.isDestroyed()) {
                return;
            }
            selectionWindow.show();
            selectionWindow.focus();
        })
        .catch((error) => {
            if (visionRegionSelectionRequest === request) {
                visionRegionSelectionRequest = null;
                request.reject(error);
            }
            destroyVisionRegionWindow(request);
        });

    return selectionPromise;
}

async function captureRegionSnapshot() {
    const display = screen.getPrimaryDisplay();
    const screenImage = await captureScreenSnapshot(display);
    const selection = await requestVisionRegionSelection(display);
    const cropRect = normalizeVisionRegionSelection(selection, display, screenImage);
    const image = screenImage.crop(cropRect);

    if (!image || image.isEmpty()) {
        throw new Error('矩形截图为空。');
    }
    return image;
}

async function captureVisionSnapshot(event, payload = {}) {
    const target = normalizeVisionTarget(payload.target || payload.source);
    const sourceWindow = BrowserWindow.fromWebContents(event.sender);
    const image = target === 'region'
        ? await captureRegionSnapshot()
        : target === 'screen'
        ? await captureScreenSnapshot()
        : await captureWindowSnapshot(target, sourceWindow);

    return {
        ok: true,
        snapshot: await persistVisionSnapshot(image, target)
    };
}

async function captureVisionSnapshotForTool(payload = {}) {
    const target = normalizeVisionTarget(payload.target || payload.source);
    const image = target === 'region'
        ? await captureRegionSnapshot()
        : target === 'screen'
        ? await captureScreenSnapshot()
        : await captureWindowSnapshot(target, BrowserWindow.getFocusedWindow() || chatWindow || petWindow);

    return await persistVisionSnapshot(image, target);
}

function getBundledSpeechModelRoots() {
    return [
        path.join(process.resourcesPath, 'speech-models'),
        path.join(app.getAppPath(), 'Resources', 'speech-models'),
        path.join(app.getAppPath(), 'dist', 'Resources', 'speech-models')
    ];
}

function guessSpeechModelMimeType(filename) {
    const ext = path.extname(filename).toLowerCase();

    if (ext === '.json') {
        return 'application/json; charset=utf-8';
    }
    if (ext === '.txt') {
        return 'text/plain; charset=utf-8';
    }
    if (ext === '.wasm') {
        return 'application/wasm';
    }
    if (ext === '.js' || ext === '.mjs') {
        return 'text/javascript; charset=utf-8';
    }
    return 'application/octet-stream';
}

function getSpeechAssetVariants(asset) {
    const orderedSources = [asset.source, ...Object.keys(SPEECH_MODEL_REMOTE_HOSTS)]
        .filter(Boolean)
        .filter((source, index, items) => items.indexOf(source) === index);

    return orderedSources.map((source) => ({
        ...asset,
        source
    }));
}

async function createFileResponse(filePath) {
    const fileBuffer = await fsp.readFile(filePath);
    return new Response(fileBuffer, {
        headers: {
            'content-type': guessSpeechModelMimeType(filePath),
            'content-length': String(fileBuffer.byteLength)
        }
    });
}

async function findBundledSpeechModelFile(asset) {
    for (const rootDir of getBundledSpeechModelRoots()) {
        for (const variant of getSpeechAssetVariants(asset)) {
            const candidatePath = resolveSpeechModelFilePath(rootDir, variant);
            if (fs.existsSync(candidatePath)) {
                return candidatePath;
            }
        }
    }

    return null;
}

function buildSpeechModelRemoteUrl({ source, model, revision, filename }) {
    const host = SPEECH_MODEL_REMOTE_HOSTS[source];
    if (!host) {
        throw new Error(`不支持的语音模型源：${source}`);
    }

    return new URL(
        `${model}/resolve/${encodeURIComponent(revision)}/${filename}`,
        host
    ).toString();
}

async function downloadSpeechModelAsset(asset) {
    const cachePath = resolveSpeechModelFilePath(getSpeechModelCacheRoot(), asset);
    const existingTask = speechModelDownloadTasks.get(cachePath);
    if (existingTask) {
        return existingTask;
    }

    const task = (async () => {
        if (fs.existsSync(cachePath)) {
            return createFileResponse(cachePath);
        }

        const remoteUrl = buildSpeechModelRemoteUrl(asset);
        const response = await fetch(remoteUrl);
        if (!response.ok) {
            return response;
        }

        const responseBuffer = Buffer.from(await response.arrayBuffer());
        await fsp.mkdir(path.dirname(cachePath), { recursive: true });
        await fsp.writeFile(cachePath, responseBuffer);

        return new Response(responseBuffer, {
            headers: {
                'content-type': response.headers.get('content-type') || guessSpeechModelMimeType(cachePath),
                'content-length': String(responseBuffer.byteLength)
            }
        });
    })();

    speechModelDownloadTasks.set(cachePath, task);
    try {
        return await task;
    } finally {
        speechModelDownloadTasks.delete(cachePath);
    }
}

async function downloadSpeechModelAssetWithFallback(asset) {
    const variants = getSpeechAssetVariants(asset);
    let lastResponse = null;
    let lastError = null;

    for (const variant of variants) {
        try {
            const response = await downloadSpeechModelAsset(variant);
            if (response.ok || variant.source === variants[variants.length - 1]?.source) {
                return response;
            }
            lastResponse = response;
        } catch (error) {
            lastError = error;
        }
    }

    if (lastResponse) {
        return lastResponse;
    }

    throw lastError || new Error('语音模型资源下载失败');
}

function parseSpeechModelAssetFromUrl(targetUrl) {
    const queryAsset = {
        source: targetUrl.searchParams.get('source') || '',
        model: targetUrl.searchParams.get('model') || '',
        revision: targetUrl.searchParams.get('revision') || 'main',
        filename: targetUrl.searchParams.get('filename') || ''
    };

    if (queryAsset.model && queryAsset.filename) {
        return {
            ...queryAsset,
            source: queryAsset.source || 'modelscope'
        };
    }

    const source = targetUrl.hostname || queryAsset.source || 'modelscope';
    const pathSegments = decodeURIComponent(targetUrl.pathname || '')
        .split('/')
        .map((segment) => segment.trim())
        .filter(Boolean);

    if (pathSegments.length < 3) {
        return {
            ...queryAsset,
            source
        };
    }

    const modelSegments = pathSegments.slice(0, 2);
    let revision = 'main';
    let filenameSegments = pathSegments.slice(2);

    if (pathSegments.length >= 4 && pathSegments[2] === 'main') {
        revision = pathSegments[2];
        filenameSegments = pathSegments.slice(3);
    }

    return {
        source,
        model: modelSegments.join('/'),
        revision,
        filename: filenameSegments.join('/')
    };
}

async function handleSpeechModelProtocol(request) {
    const targetUrl = new URL(request.url);
    const asset = parseSpeechModelAssetFromUrl(targetUrl);

    try {
        for (const variant of getSpeechAssetVariants(asset)) {
            const cachePath = resolveSpeechModelFilePath(getSpeechModelCacheRoot(), variant);
            if (fs.existsSync(cachePath)) {
                return createFileResponse(cachePath);
            }
        }

        const bundledPath = await findBundledSpeechModelFile(asset);
        if (bundledPath) {
            return createFileResponse(bundledPath);
        }

        return downloadSpeechModelAssetWithFallback(asset);
    } catch (error) {
        return new Response(String(error.message || error), {
            status: 500,
            headers: {
                'content-type': 'text/plain; charset=utf-8'
            }
        });
    }
}

function makeTrayIcon() {
    const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64">
            <rect width="64" height="64" rx="14" fill="#73b8e5"/>
            <text x="50%" y="58%" text-anchor="middle" font-size="28" font-family="Segoe UI, Arial" fill="#ffffff">AG</text>
        </svg>
    `;

    return nativeImage
        .createFromDataURL(`data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`)
        .resize({ width: 16, height: 16 });
}

function clampBoundsToDisplay(bounds, minimumWidth = 320, minimumHeight = 320) {
    const display = screen.getDisplayMatching(bounds);
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

function normalizePetDialogueExtraTop(value) {
    const numericValue = Number(value);
    if (!Number.isFinite(numericValue)) {
        return normalizeAvatarDialogueBubbleExtraTop(
            desktopState?.preferences?.avatarDialogueBubbleExtraTop ??
                PET_DIALOGUE_DEFAULT_EXTRA_TOP
        );
    }
    return Math.round(Math.min(
        Math.max(normalizeAvatarDialogueBubbleExtraTop(numericValue), 0),
        PET_DIALOGUE_MAX_EXTRA_TOP
    ));
}

function normalizePetDialogueExtraWidth(value) {
    const numericValue = Number(value);
    if (!Number.isFinite(numericValue)) {
        return normalizeAvatarDialogueBubbleExtraWidth(
            desktopState?.preferences?.avatarDialogueBubbleExtraWidth ??
                PET_DIALOGUE_DEFAULT_EXTRA_WIDTH
        );
    }
    return Math.round(Math.min(
        Math.max(normalizeAvatarDialogueBubbleExtraWidth(numericValue), 0),
        PET_DIALOGUE_MAX_EXTRA_WIDTH
    ));
}

function getPetDialogueExpandedLayout(
    baseBounds,
    requestedExtraTop = PET_DIALOGUE_DEFAULT_EXTRA_TOP,
    requestedExtraWidth = PET_DIALOGUE_DEFAULT_EXTRA_WIDTH
) {
    const safeBaseBounds = clampBoundsToDisplay(
        baseBounds,
        PET_MIN_SIZE.width,
        PET_MIN_SIZE.height
    );
    const display = screen.getDisplayMatching(safeBaseBounds);
    const workArea = display.workArea;
    const requestedTop = normalizePetDialogueExtraTop(requestedExtraTop);
    const requestedWidth = normalizePetDialogueExtraWidth(requestedExtraWidth);
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

function setPetWindowBoundsTransient(bounds) {
    if (!petWindow || petWindow.isDestroyed()) {
        return;
    }

    petDialogueBoundsMutation = true;
    clearTimeout(petDialogueBoundsMutationTimer);
    petWindow.setBounds(bounds);
    petDialogueBoundsMutationTimer = setTimeout(() => {
        petDialogueBoundsMutation = false;
        petDialogueBoundsMutationTimer = null;
    }, 220);
}

function setPetDialogueWindowExpanded(
    expanded,
    requestedExtraTop = PET_DIALOGUE_DEFAULT_EXTRA_TOP,
    requestedExtraWidth = PET_DIALOGUE_DEFAULT_EXTRA_WIDTH
) {
    if (!petWindow || petWindow.isDestroyed()) {
        return {
            ok: false,
            expanded: false,
            extraTop: 0,
            reason: 'pet_window_unavailable'
        };
    }

    if (expanded) {
        const referenceBounds = petDialogueCollapsedBounds || petWindow.getBounds();
        const layout = getPetDialogueExpandedLayout(
            referenceBounds,
            requestedExtraTop,
            requestedExtraWidth
        );

        petDialogueCollapsedBounds = layout.baseBounds;
        petDialogueExpanded = layout.extraTop > 0 || layout.extraWidth > 0;
        petDialogueExtraTop = layout.extraTop;
        petDialogueExtraWidth = layout.extraWidth;
        desktopState.petWindow.bounds = layout.baseBounds;
        desktopState.petWindow.visible = petWindow.isVisible();
        setPetWindowBoundsTransient(layout.expandedBounds);

        return {
            ok: true,
            expanded: petDialogueExpanded,
            extraTop: layout.extraTop,
            extraWidth: layout.extraWidth,
            reservedLeft: layout.reservedLeft,
            reservedRight: layout.reservedRight,
            bounds: layout.expandedBounds,
            baseBounds: layout.baseBounds
        };
    }

    const restoreBounds = clampBoundsToDisplay(
        petDialogueCollapsedBounds || petWindow.getBounds(),
        PET_MIN_SIZE.width,
        PET_MIN_SIZE.height
    );

    petDialogueCollapsedBounds = null;
    petDialogueExpanded = false;
    petDialogueExtraTop = 0;
    petDialogueExtraWidth = 0;
    desktopState.petWindow.bounds = restoreBounds;
    desktopState.petWindow.visible = petWindow.isVisible();
    setPetWindowBoundsTransient(restoreBounds);
    persistDesktopState();

    return {
        ok: true,
        expanded: false,
        extraTop: 0,
        extraWidth: 0,
        reservedLeft: 0,
        reservedRight: 0,
        bounds: restoreBounds,
        baseBounds: restoreBounds
    };
}

function persistDesktopState() {
    desktopState = saveDesktopState(app, desktopState);
    refreshTrayMenu();
}

function resolveDesktopBackendBaseUrl() {
    const envBackendBaseUrl = String(process.env.AIGRIL_BACKEND_BASE_URL || '').trim();
    if (envBackendBaseUrl) {
        return normalizeBackendBaseUrl(envBackendBaseUrl);
    }

    return DEFAULT_BACKEND_BASE_URL;
}

function resolveDesktopBackendMode() {
    return normalizeBackendMode(
        desktopState?.preferences?.backendMode || DEFAULT_BACKEND_MODE
    );
}

function resolveOpenClawGatewayUrl() {
    const envGatewayUrl = String(
        process.env.AIGRIL_OPENCLAW_GATEWAY_URL ||
        process.env.OPENCLAW_GATEWAY_URL ||
        ''
    ).trim();
    if (envGatewayUrl) {
        return normalizeOpenClawGatewayUrl(envGatewayUrl);
    }

    return normalizeOpenClawGatewayUrl(
        desktopState?.preferences?.openclawGatewayUrl || DEFAULT_OPENCLAW_GATEWAY_URL
    );
}

function getPersistedLlmSettings() {
    const preferences = desktopState?.preferences || {};
    return {
        provider: normalizeLlmProvider(preferences.llmProvider || DEFAULT_LLM_PROVIDER),
        baseUrl: normalizeLlmBaseUrl(preferences.llmBaseUrl || DEFAULT_LLM_BASE_URL),
        model: normalizeLlmModel(preferences.llmModel || DEFAULT_LLM_MODEL),
        apiKey: normalizeLlmApiKey(preferences.llmApiKey || ''),
        temperature: normalizeLlmTemperature(
            preferences.llmTemperature ?? DEFAULT_LLM_TEMPERATURE
        ),
        timeoutMs: normalizeLlmRequestTimeoutMs(
            preferences.llmRequestTimeoutMs || DEFAULT_LLM_REQUEST_TIMEOUT_MS
        )
    };
}

function getEnvironmentLlmApiKey() {
    return normalizeLlmApiKey(
        process.env.DOUBAO_API_KEY ||
        process.env.ARK_API_KEY ||
        process.env.VOLCENGINE_API_KEY ||
        process.env.OPENAI_COMPATIBLE_API_KEY ||
        ''
    );
}

function getResolvedLlmSettings() {
    const persistedSettings = getPersistedLlmSettings();
    const environmentApiKey = getEnvironmentLlmApiKey();
    const apiKeySource = persistedSettings.apiKey
        ? 'saved'
        : environmentApiKey
        ? 'environment'
        : 'none';

    return {
        ...persistedSettings,
        apiKey: persistedSettings.apiKey || environmentApiKey,
        apiKeySource
    };
}

function getPersistedEmailProfiles() {
    return normalizeEmailProfiles(desktopState?.preferences?.emailProfiles || {});
}

function getPersistedComputerControlEnabled() {
    return normalizeComputerControlEnabled(
        desktopState?.preferences?.computerControlEnabled ?? DEFAULT_COMPUTER_CONTROL_ENABLED
    );
}

function getHumanClawDefaultContext() {
    if (getPersistedComputerControlEnabled()) {
        return {
            computerControlEnabled: true,
            permissionProfile: 'danger-full-access',
            approvalPolicy: 'auto',
            confirmationPolicy: 'auto',
            visionPermissionPolicy: 'manual',
            approved: true,
            autoConfirm: true,
            executeExternal: true,
            allowOutsideWorkspace: true,
            allowComputerWideAccess: true,
            allowSystemMutation: true
        };
    }

    return {
        computerControlEnabled: false,
        permissionProfile: 'workspace-write',
        approvalPolicy: 'on-request',
        confirmationPolicy: 'on-request',
        visionPermissionPolicy: 'manual',
        requireApprovalForMutations: true
    };
}

function getRendererEmailProfiles() {
    const profiles = getPersistedEmailProfiles();
    return Object.fromEntries(
        EMAIL_PROVIDER_OPTIONS.map((providerId) => {
            const profile = profiles[providerId] || {};
            return [
                providerId,
                {
                    account: profile.account || '',
                    authType: profile.authType || 'password',
                    secretConfigured: Boolean(profile.secret),
                    secretSource: profile.secret ? 'saved' : 'none'
                }
            ];
        })
    );
}

function getRendererLlmPreferences() {
    const settings = getResolvedLlmSettings();
    return {
        llmProvider: settings.provider,
        llmBaseUrl: settings.baseUrl,
        llmModel: settings.model,
        llmApiKeyConfigured: Boolean(settings.apiKey),
        llmApiKeySource: settings.apiKeySource,
        llmTemperature: settings.temperature,
        llmRequestTimeoutMs: settings.timeoutMs
    };
}

function getPersistedElevenLabsSettings() {
    const preferences = desktopState?.preferences || {};
    return {
        apiBase: normalizeElevenLabsApiBase(
            preferences.elevenLabsApiBase || DEFAULT_ELEVENLABS_API_BASE
        ),
        apiKey: normalizeElevenLabsApiKey(preferences.elevenLabsApiKey || DEFAULT_ELEVENLABS_API_KEY),
        voiceId: normalizeElevenLabsVoiceId(preferences.elevenLabsVoiceId || DEFAULT_ELEVENLABS_VOICE_ID),
        modelId: normalizeElevenLabsModelId(preferences.elevenLabsModelId || DEFAULT_ELEVENLABS_MODEL_ID),
        outputFormat: normalizeElevenLabsOutputFormat(
            preferences.elevenLabsOutputFormat || DEFAULT_ELEVENLABS_OUTPUT_FORMAT
        ),
        timeoutMs: normalizeElevenLabsTimeoutMs(
            preferences.elevenLabsTimeoutMs || DEFAULT_ELEVENLABS_TIMEOUT_MS
        ),
        enableLogging: true,
        optimizeStreamingLatency: 0,
        stability: 0.45,
        similarityBoost: 0.8,
        style: 0.15,
        speed: 1.0,
        useSpeakerBoost: true
    };
}

function getRendererElevenLabsPreferences() {
    const settings = getPersistedElevenLabsSettings();
    return {
        elevenLabsApiBase: settings.apiBase,
        elevenLabsVoiceId: settings.voiceId,
        elevenLabsModelId: settings.modelId,
        elevenLabsOutputFormat: settings.outputFormat,
        elevenLabsTimeoutMs: settings.timeoutMs,
        elevenLabsApiKeyConfigured: Boolean(settings.apiKey),
        elevenLabsApiKeySource: settings.apiKey ? 'saved' : 'none'
    };
}

function extractTextFromLlmContent(content) {
    if (typeof content === 'string') {
        return content;
    }
    if (!Array.isArray(content)) {
        return '';
    }
    return content
        .map((part) => {
            if (typeof part === 'string') {
                return part;
            }
            if (part?.type === 'text' || part?.type === 'input_text') {
                return part.text || part.content || '';
            }
            return '';
        })
        .filter(Boolean)
        .join('\n');
}

function extractLatestUserTextFromLlmPayload(payload = {}) {
    const messages = Array.isArray(payload.messages) ? payload.messages : [];
    for (let index = messages.length - 1; index >= 0; index -= 1) {
        if (messages[index]?.role === 'user') {
            return extractTextFromLlmContent(messages[index].content);
        }
    }
    return '';
}

function attachAiglMemoryToLlmPayload(payload = {}) {
    if (payload.includeAiglMemory !== true) {
        return payload;
    }
    const messages = Array.isArray(payload.messages) ? payload.messages : [];
    if (!messages.length) {
        return payload;
    }

    let memoryContext = '';
    try {
        memoryContext = ensureHumanClawGateway().memoryRuntime?.compileContext?.({
            sessionId: payload.sessionId || payload.sessionKey || 'main',
            message: payload.memoryUserMessage || extractLatestUserTextFromLlmPayload(payload),
            messageHistory: payload.messageHistory || []
        }) || '';
    } catch (error) {
        console.warn('[humanclaw-memory] 直连 LLM 注入记忆失败：', error.message || error);
    }

    if (!memoryContext) {
        return payload;
    }

    const memoryMessage = {
        role: 'system',
        content: [
            '以下是 AIGL 的本地长期记忆上下文，只作为辅助参考。',
            '若与用户当前明确指令冲突，以当前指令为准；不要主动暴露内部好感度数值。',
            '',
            memoryContext
        ].join('\n')
    };
    const nextMessages = messages.slice();
    const firstNonSystemIndex = nextMessages.findIndex((message) => message?.role !== 'system');
    if (firstNonSystemIndex === -1) {
        nextMessages.push(memoryMessage);
    } else {
        nextMessages.splice(firstNonSystemIndex, 0, memoryMessage);
    }
    return {
        ...payload,
        messages: nextMessages
    };
}

async function callDesktopLlm(payload = {}) {
    const enrichedPayload = attachAiglMemoryToLlmPayload(payload);
    const result = await callDesktopLlmProvider(getResolvedLlmSettings(), enrichedPayload);
    if (payload.includeAiglMemory === true) {
        try {
            ensureHumanClawGateway().memoryRuntime?.recordTurn?.({
                sessionId: payload.sessionId || payload.sessionKey || 'main',
                userMessage: payload.memoryUserMessage || extractLatestUserTextFromLlmPayload(payload),
                assistantMessage: result?.content || result?.error || '',
                source: payload.memorySource || 'direct_llm',
                result,
                messageHistory: payload.messageHistory || [],
                attachments: payload.memoryAttachments || []
            });
        } catch (error) {
            console.warn('[humanclaw-memory] 直连 LLM 写入记忆失败：', error.message || error);
        }
    }
    return result;
}

async function callDesktopElevenLabsTts(payload = {}) {
    return synthesizeElevenLabsSpeech(getPersistedElevenLabsSettings(), payload);
}

async function callDesktopTts(payload = {}) {
    if (payload?.provider === 'cosyvoice3') {
        return synthesizeCosyVoice3Speech({}, payload);
    }
    if (payload?.provider === 'kokoro') {
        return synthesizeKokoroSpeech({}, payload);
    }
    return callDesktopElevenLabsTts(payload);
}

function warmupDesktopSpeechMode(mode, { delayMs = 0 } = {}) {
    const normalizedMode = normalizeSpeechMode(mode);
    const runWarmup = () => {
        if (normalizedMode === 'cosyvoice3') {
            warmupCosyVoice3TTS({ timeoutMs: 300000 })
                .then((result) => {
                    if (!result?.ok) {
                        console.warn('[cosyvoice3] 后台预热失败：', result?.error || result);
                        return;
                    }
                    console.log(`[cosyvoice3] 后台预热完成：${result.elapsedSeconds}s`);
                })
                .catch((error) => {
                    console.warn('[cosyvoice3] 后台预热失败：', error.message || error);
                });
            return;
        }

        if (normalizedMode === 'kokoro') {
            warmupKokoroTTS({ timeoutMs: 120000 })
                .then((result) => {
                    if (!result?.ok) {
                        console.warn('[kokoro] 后台预热失败：', result?.error || result);
                        return;
                    }
                    if (result.skipped) {
                        return;
                    }
                    console.log(`[kokoro] 后台预热完成：${result.elapsedSeconds}s`);
                })
                .catch((error) => {
                    console.warn('[kokoro] 后台预热失败：', error.message || error);
                });
        }
    };

    if (delayMs > 0) {
        setTimeout(runWarmup, delayMs);
        return;
    }
    runWarmup();
}

function getOpenWindows() {
    return [petWindow, chatWindow, controlWindow].filter(
        (window) => window && !window.isDestroyed()
    );
}

function broadcastAssistantEvent(payload) {
    if (!payload) {
        return;
    }

    for (const window of getOpenWindows()) {
        window.webContents.send('aigril:assistant-event', payload);
    }
}

function broadcastHumanGatewayEvent(payload) {
    if (!payload) {
        return;
    }

    for (const window of getOpenWindows()) {
        window.webContents.send('aigril:gateway-event', payload);
    }
}

function ensureHumanClawGateway() {
    if (humanClawGateway) {
        return humanClawGateway;
    }

    humanClawGateway = new HumanClawGateway({
        app,
        projectRoot: getProjectRoot(),
        workspaceRoot: getProjectRoot(),
        auditDir: getPersistedHumanClawStateDir(),
        getDefaultContext: () => getHumanClawDefaultContext(),
        getEmailProfiles: () => getPersistedEmailProfiles(),
        visionServices: {
            permissionPolicy: 'manual',
            getLlmSettings: () => getResolvedLlmSettings(),
            capture: (payload) => captureVisionSnapshotForTool(payload)
        }
    });
    humanClawGateway.on('event', (event) => {
        broadcastHumanGatewayEvent(event);
    });
    return humanClawGateway;
}

function ensureOpenClawRuntimeSupervisor() {
    if (openclawRuntimeSupervisor) {
        return openclawRuntimeSupervisor;
    }

    openclawRuntimeSupervisor = new OpenClawRuntimeSupervisor({
        app,
        gatewayUrl: resolveOpenClawGatewayUrl()
    });
    openclawRuntimeSupervisor.on('status', (status) => {
        broadcastAssistantEvent({
            type: 'operator.runtime',
            payload: status
        });
    });

    return openclawRuntimeSupervisor;
}

function ensureAssistantGateway() {
    if (assistantGateway) {
        return assistantGateway;
    }

    assistantGateway = new OpenClawGatewayManager({
        app,
        clientVersion: app.getVersion(),
        enabled: true,
        gatewayUrl: resolveOpenClawGatewayUrl()
    });
    assistantGateway.on('status', (status) => {
        broadcastAssistantEvent({
            type: 'status',
            payload: status
        });
    });
    assistantGateway.on('event', (event) => {
        broadcastAssistantEvent(event);
    });

    return assistantGateway;
}

async function resetAssistantBridge() {
    if (assistantGateway) {
        await assistantGateway.shutdown().catch(() => {});
        assistantGateway = null;
    }
}

function getAssistantStatusSnapshot() {
    const gateway = ensureAssistantGateway();
    const supervisor = ensureOpenClawRuntimeSupervisor();
    const status = {
        ...gateway.getStatus(),
        selectedBackendMode: resolveDesktopBackendMode()
    };

    status.managedRuntime = supervisor.getStatus();
    status.toolSurface = getOpenClawToolSurfaceSummary();
    status.toolSurfaceValidation = validateOpenClawToolSurface().summary;
    status.humanGateway = ensureHumanClawGateway().getStatus();

    return status;
}

async function syncOpenClawSelection({ ensureReady = false } = {}) {
    const gatewayUrl = resolveOpenClawGatewayUrl();
    const backendMode = resolveDesktopBackendMode();
    const supervisor = ensureOpenClawRuntimeSupervisor();

    supervisor.configure({
        gatewayUrl
    });

    const currentGatewayUrl = assistantGateway?.getStatus?.()?.gatewayCandidates?.[0] || '';
    if (assistantGateway && currentGatewayUrl !== gatewayUrl) {
        await resetAssistantBridge();
    }

    const gateway = ensureAssistantGateway();

    broadcastAssistantEvent({
        type: 'status',
        payload: gateway.getStatus()
    });
    broadcastAssistantEvent({
        type: 'operator.runtime',
        payload: supervisor.getStatus()
    });

    if (backendMode !== 'openclaw') {
        if (assistantGateway) {
            await resetAssistantBridge();
        }
        await supervisor.shutdown().catch(() => {});
        broadcastAssistantEvent({
            type: 'status',
            payload: ensureAssistantGateway().getStatus()
        });
        broadcastAssistantEvent({
            type: 'operator.runtime',
            payload: supervisor.getStatus()
        });
        return getAssistantStatusSnapshot();
    }

    if (ensureReady) {
        await supervisor.ensureReady();
        await gateway.ensureConnected();
    }

    return getAssistantStatusSnapshot();
}

function getRendererPreferences() {
    return {
        petSkipTaskbar: Boolean(desktopState?.preferences?.petSkipTaskbar),
        petScale: normalizePetScale(desktopState?.preferences?.petScale || DEFAULT_PET_SCALE),
        speechMode: normalizeSpeechMode(desktopState?.preferences?.speechMode),
        recognitionMode: normalizeRecognitionMode(desktopState?.preferences?.recognitionMode),
        preferredMicDeviceId: normalizePreferredMicDeviceId(desktopState?.preferences?.preferredMicDeviceId),
        backendBaseUrl: resolveDesktopBackendBaseUrl(),
        backendMode: resolveDesktopBackendMode(),
        openclawGatewayUrl: resolveOpenClawGatewayUrl(),
        humanClawStateDir: normalizeHumanClawStateDir(desktopState?.preferences?.humanClawStateDir),
        humanClawResolvedStateDir: getPersistedHumanClawStateDir(),
        humanClawDefaultStateDir: getDefaultHumanClawStateDir(),
        ...getRendererLlmPreferences(),
        ...getRendererElevenLabsPreferences(),
        computerControlEnabled: getPersistedComputerControlEnabled(),
        emailProfiles: getRendererEmailProfiles(),
        cameraDistance: normalizeCameraDistance(
            desktopState?.preferences?.cameraDistance || DEFAULT_CAMERA_DISTANCE
        ),
        cameraHeight: normalizeCameraHeight(
            desktopState?.preferences?.cameraHeight || DEFAULT_CAMERA_HEIGHT
        ),
        cameraTargetY: normalizeCameraTargetY(
            desktopState?.preferences?.cameraTargetY || DEFAULT_CAMERA_TARGET_Y
        ),
        desktopNativeTtsRate: normalizeDesktopNativeTTSRate(
            desktopState?.preferences?.desktopNativeTtsRate || DEFAULT_DESKTOP_NATIVE_TTS_RATE
        ),
        desktopNativeTtsPitch: normalizeDesktopNativeTTSPitch(
            desktopState?.preferences?.desktopNativeTtsPitch || DEFAULT_DESKTOP_NATIVE_TTS_PITCH
        ),
        desktopNativeTtsVolume: normalizeDesktopNativeTTSVolume(
            desktopState?.preferences?.desktopNativeTtsVolume || DEFAULT_DESKTOP_NATIVE_TTS_VOLUME
        ),
        autoChatEnabled: normalizeAutoChatEnabled(
            desktopState?.preferences?.autoChatEnabled ?? DEFAULT_AUTO_CHAT_ENABLED
        ),
        autoChatMinIntervalSec: normalizeAutoChatMinIntervalSec(
            desktopState?.preferences?.autoChatMinIntervalSec || DEFAULT_AUTO_CHAT_MIN_INTERVAL_SEC
        ),
        autoChatMaxIntervalSec: normalizeAutoChatMaxIntervalSec(
            desktopState?.preferences?.autoChatMaxIntervalSec || DEFAULT_AUTO_CHAT_MAX_INTERVAL_SEC,
            normalizeAutoChatMinIntervalSec(
                desktopState?.preferences?.autoChatMinIntervalSec || DEFAULT_AUTO_CHAT_MIN_INTERVAL_SEC
            )
        ),
        avatarDialogueBubbleLeft: normalizeAvatarDialogueBubbleLeft(
            desktopState?.preferences?.avatarDialogueBubbleLeft
        ),
        avatarDialogueBubbleTop: normalizeAvatarDialogueBubbleTop(
            desktopState?.preferences?.avatarDialogueBubbleTop
        ),
        avatarDialogueBubbleScale: normalizeAvatarDialogueBubbleScale(
            desktopState?.preferences?.avatarDialogueBubbleScale
        ),
        avatarDialogueBubbleExtraWidth: normalizeAvatarDialogueBubbleExtraWidth(
            desktopState?.preferences?.avatarDialogueBubbleExtraWidth
        ),
        avatarDialogueBubbleExtraTop: normalizeAvatarDialogueBubbleExtraTop(
            desktopState?.preferences?.avatarDialogueBubbleExtraTop
        )
    };
}

function getControlPanelState() {
    return {
        preferences: getRendererPreferences(),
        options: {
            petScaleOptions: PET_SCALE_OPTIONS,
            speechModeOptions: SPEECH_MODE_OPTIONS,
            recognitionModeOptions: RECOGNITION_MODE_OPTIONS,
            backendModeOptions: BACKEND_MODE_OPTIONS,
            llmProviderOptions: LLM_PROVIDER_OPTIONS,
            emailProviderOptions: EMAIL_PROVIDER_OPTIONS
        },
        assistant: {
            selectedBackendMode: 'humanclaw',
            humanGateway: ensureHumanClawGateway().getStatus(),
            toolSurface: getOpenClawToolSurfaceSummary(),
            toolSurfaceValidation: validateOpenClawToolSurface().summary
        },
        environment: {
            version: app.getVersion(),
            isPackaged: app.isPackaged,
            userDataPath: app.getPath('userData'),
            projectRoot: getProjectRoot()
        }
    };
}

function broadcastPreferencesUpdated() {
    const payload = {
        preferences: getRendererPreferences()
    };

    petWindow?.webContents.send('aigril:preferences-updated', payload);
    chatWindow?.webContents.send('aigril:preferences-updated', payload);
    controlWindow?.webContents.send('aigril:preferences-updated', payload);
}

function getWindowMinimumSize(key) {
    if (key === 'petWindow') {
        return PET_MIN_SIZE;
    }
    if (key === 'controlWindow') {
        return {
            width: CONTROL_MIN_WIDTH,
            height: CONTROL_MIN_HEIGHT
        };
    }

    return {
        width: CHAT_MIN_WIDTH,
        height: CHAT_MIN_HEIGHT
    };
}

function updateWindowState(key, window, options = {}) {
    if (!window || !desktopState?.[key]) {
        return;
    }

    const minimumSize = getWindowMinimumSize(key);
    if (key === 'petWindow' && (petDialogueExpanded || petDialogueBoundsMutation)) {
        if (petDialogueCollapsedBounds) {
            desktopState[key].bounds = clampBoundsToDisplay(
                petDialogueCollapsedBounds,
                minimumSize.width,
                minimumSize.height
            );
        }
        desktopState[key].visible = window.isVisible();
        if (options.immediate) {
            persistDesktopState();
        }
        return;
    }

    desktopState[key].bounds = clampBoundsToDisplay(
        window.getBounds(),
        minimumSize.width,
        minimumSize.height
    );
    desktopState[key].visible = window.isVisible();

    if (options.immediate) {
        persistDesktopState();
        return;
    }

    clearTimeout(windowPersistTimers.get(key));
    windowPersistTimers.set(key, setTimeout(() => {
        persistDesktopState();
        windowPersistTimers.delete(key);
    }, 120));
}

function hookWindowPersistence(key, window) {
    window.on('move', () => updateWindowState(key, window));
    window.on('resize', () => updateWindowState(key, window));
    window.on('show', () => updateWindowState(key, window, { immediate: true }));
    window.on('hide', () => updateWindowState(key, window, { immediate: true }));
    window.on('closed', () => {
        clearTimeout(windowPersistTimers.get(key));
        windowPersistTimers.delete(key);
    });
}

function openExternalLinks(window) {
    window.webContents.setWindowOpenHandler(({ url }) => {
        void shell.openExternal(url);
        return { action: 'deny' };
    });
}

function loadWindowContent(window, pageName) {
    if (isDevMode()) {
        return window.loadURL(buildRendererUrl(pageName));
    }
    return window.loadURL(pathToFileURL(buildRendererUrl(pageName)).toString());
}

function registerMediaPermissionHandlers() {
    const defaultSession = session.defaultSession;
    if (!defaultSession) {
        return;
    }

    defaultSession.setPermissionCheckHandler((_webContents, permission) => {
        return permission === 'media';
    });

    defaultSession.setPermissionRequestHandler((_webContents, permission, callback, details) => {
        const requestsAudio = Array.isArray(details?.mediaTypes) && details.mediaTypes.includes('audio');
        callback(permission === 'media' && requestsAudio);
    });
}

function showChatWindow() {
    if (!chatWindow) {
        createChatWindow();
    }

    if (!chatWindow.isVisible()) {
        chatWindow.show();
    }

    chatWindow.focus();
}

function hideChatWindow() {
    if (chatWindow?.isVisible()) {
        chatWindow.hide();
    }
}

function toggleChatWindow() {
    if (!chatWindow || !chatWindow.isVisible()) {
        showChatWindow();
        return true;
    }

    hideChatWindow();
    return false;
}

function showControlPanel() {
    if (!controlWindow) {
        createControlWindow();
    }

    if (!controlWindow.isVisible()) {
        controlWindow.show();
    }

    controlWindow.focus();
    return true;
}

function quitApplication() {
    isQuitting = true;
    app.quit();
}

function applyPreferencesPatch(partialPreferences = {}) {
    if (!desktopState?.preferences || !partialPreferences || typeof partialPreferences !== 'object') {
        return getRendererPreferences();
    }

    const rendererPreferences = getRendererPreferences();
    const currentLlmSettings = getPersistedLlmSettings();
    const currentElevenLabsSettings = getPersistedElevenLabsSettings();
    const nextPreferences = {
        petSkipTaskbar: rendererPreferences.petSkipTaskbar,
        petScale: rendererPreferences.petScale,
        speechMode: rendererPreferences.speechMode,
        recognitionMode: rendererPreferences.recognitionMode,
        preferredMicDeviceId: rendererPreferences.preferredMicDeviceId,
        backendBaseUrl: resolveDesktopBackendBaseUrl(),
        backendMode: rendererPreferences.backendMode,
        openclawGatewayUrl: rendererPreferences.openclawGatewayUrl,
        humanClawStateDir: rendererPreferences.humanClawStateDir,
        llmProvider: currentLlmSettings.provider,
        llmBaseUrl: currentLlmSettings.baseUrl,
        llmModel: currentLlmSettings.model,
        llmApiKey: currentLlmSettings.apiKey,
        llmTemperature: currentLlmSettings.temperature,
        llmRequestTimeoutMs: currentLlmSettings.timeoutMs,
        elevenLabsApiBase: currentElevenLabsSettings.apiBase,
        elevenLabsApiKey: currentElevenLabsSettings.apiKey,
        elevenLabsVoiceId: currentElevenLabsSettings.voiceId,
        elevenLabsModelId: currentElevenLabsSettings.modelId,
        elevenLabsOutputFormat: currentElevenLabsSettings.outputFormat,
        elevenLabsTimeoutMs: currentElevenLabsSettings.timeoutMs,
        computerControlEnabled: rendererPreferences.computerControlEnabled,
        emailProfiles: getPersistedEmailProfiles(),
        cameraDistance: rendererPreferences.cameraDistance,
        cameraHeight: rendererPreferences.cameraHeight,
        cameraTargetY: rendererPreferences.cameraTargetY,
        desktopNativeTtsRate: rendererPreferences.desktopNativeTtsRate,
        desktopNativeTtsPitch: rendererPreferences.desktopNativeTtsPitch,
        desktopNativeTtsVolume: rendererPreferences.desktopNativeTtsVolume,
        autoChatEnabled: rendererPreferences.autoChatEnabled,
        autoChatMinIntervalSec: rendererPreferences.autoChatMinIntervalSec,
        autoChatMaxIntervalSec: rendererPreferences.autoChatMaxIntervalSec,
        avatarDialogueBubbleLeft: rendererPreferences.avatarDialogueBubbleLeft,
        avatarDialogueBubbleTop: rendererPreferences.avatarDialogueBubbleTop,
        avatarDialogueBubbleScale: rendererPreferences.avatarDialogueBubbleScale,
        avatarDialogueBubbleExtraWidth: rendererPreferences.avatarDialogueBubbleExtraWidth,
        avatarDialogueBubbleExtraTop: rendererPreferences.avatarDialogueBubbleExtraTop
    };

    if ('petSkipTaskbar' in partialPreferences) {
        nextPreferences.petSkipTaskbar = Boolean(partialPreferences.petSkipTaskbar);
    }
    if ('petScale' in partialPreferences) {
        nextPreferences.petScale = normalizePetScale(partialPreferences.petScale);
    }
    if ('speechMode' in partialPreferences) {
        nextPreferences.speechMode = normalizeSpeechMode(partialPreferences.speechMode);
    }
    if ('recognitionMode' in partialPreferences) {
        nextPreferences.recognitionMode = normalizeRecognitionMode(partialPreferences.recognitionMode);
    }
    if ('preferredMicDeviceId' in partialPreferences) {
        nextPreferences.preferredMicDeviceId = normalizePreferredMicDeviceId(
            partialPreferences.preferredMicDeviceId
        );
    }
    nextPreferences.backendBaseUrl = resolveDesktopBackendBaseUrl();
    if ('backendMode' in partialPreferences) {
        nextPreferences.backendMode = normalizeBackendMode(partialPreferences.backendMode);
    }
    if ('openclawGatewayUrl' in partialPreferences) {
        nextPreferences.openclawGatewayUrl = normalizeOpenClawGatewayUrl(
            partialPreferences.openclawGatewayUrl
        );
    }
    if ('humanClawStateDir' in partialPreferences) {
        nextPreferences.humanClawStateDir = normalizeHumanClawStateDir(partialPreferences.humanClawStateDir);
    }
    if ('llmProvider' in partialPreferences) {
        nextPreferences.llmProvider = normalizeLlmProvider(partialPreferences.llmProvider);
    }
    if ('llmBaseUrl' in partialPreferences) {
        nextPreferences.llmBaseUrl = normalizeLlmBaseUrl(partialPreferences.llmBaseUrl);
    }
    if ('llmModel' in partialPreferences) {
        nextPreferences.llmModel = normalizeLlmModel(partialPreferences.llmModel);
    }
    if ('llmApiKey' in partialPreferences) {
        const nextApiKey = normalizeLlmApiKey(partialPreferences.llmApiKey);
        if (nextApiKey) {
            nextPreferences.llmApiKey = nextApiKey;
        }
    }
    if (partialPreferences.llmApiKeyAction === 'clear') {
        nextPreferences.llmApiKey = '';
    }
    if ('llmTemperature' in partialPreferences) {
        nextPreferences.llmTemperature = normalizeLlmTemperature(partialPreferences.llmTemperature);
    }
    if ('llmRequestTimeoutMs' in partialPreferences) {
        nextPreferences.llmRequestTimeoutMs = normalizeLlmRequestTimeoutMs(
            partialPreferences.llmRequestTimeoutMs
        );
    }
    if ('elevenLabsApiBase' in partialPreferences) {
        nextPreferences.elevenLabsApiBase = normalizeElevenLabsApiBase(partialPreferences.elevenLabsApiBase);
    }
    if ('elevenLabsVoiceId' in partialPreferences) {
        nextPreferences.elevenLabsVoiceId = normalizeElevenLabsVoiceId(partialPreferences.elevenLabsVoiceId);
    }
    if ('elevenLabsModelId' in partialPreferences) {
        nextPreferences.elevenLabsModelId = normalizeElevenLabsModelId(partialPreferences.elevenLabsModelId);
    }
    if ('elevenLabsOutputFormat' in partialPreferences) {
        nextPreferences.elevenLabsOutputFormat = normalizeElevenLabsOutputFormat(
            partialPreferences.elevenLabsOutputFormat
        );
    }
    if ('elevenLabsTimeoutMs' in partialPreferences) {
        nextPreferences.elevenLabsTimeoutMs = normalizeElevenLabsTimeoutMs(
            partialPreferences.elevenLabsTimeoutMs
        );
    }
    if ('elevenLabsApiKey' in partialPreferences) {
        const nextApiKey = normalizeElevenLabsApiKey(partialPreferences.elevenLabsApiKey);
        if (nextApiKey) {
            nextPreferences.elevenLabsApiKey = nextApiKey;
        }
    }
    if (partialPreferences.elevenLabsApiKeyAction === 'clear') {
        nextPreferences.elevenLabsApiKey = '';
    }
    if ('computerControlEnabled' in partialPreferences) {
        nextPreferences.computerControlEnabled = normalizeComputerControlEnabled(
            partialPreferences.computerControlEnabled
        );
    }
    if (partialPreferences.emailProfiles && typeof partialPreferences.emailProfiles === 'object') {
        const currentProfiles = getPersistedEmailProfiles();
        const incomingProfiles = partialPreferences.emailProfiles;
        for (const providerId of EMAIL_PROVIDER_OPTIONS) {
            const incoming = incomingProfiles[providerId];
            if (!incoming || typeof incoming !== 'object') {
                continue;
            }
            const currentProfile = currentProfiles[providerId] || {};
            const nextProfile = {
                ...currentProfile,
                account: String(incoming.account || '').trim(),
                authType: String(incoming.authType || currentProfile.authType || 'password').trim().toLowerCase()
            };
            const nextSecret = normalizeLlmApiKey(incoming.secret || '');
            if (nextSecret) {
                nextProfile.secret = nextSecret;
            }
            if (incoming.secretAction === 'clear') {
                nextProfile.secret = '';
            }
            currentProfiles[providerId] = nextProfile;
        }
        nextPreferences.emailProfiles = normalizeEmailProfiles(currentProfiles);
    }
    if ('cameraDistance' in partialPreferences) {
        nextPreferences.cameraDistance = normalizeCameraDistance(partialPreferences.cameraDistance);
    }
    if ('cameraHeight' in partialPreferences) {
        nextPreferences.cameraHeight = normalizeCameraHeight(partialPreferences.cameraHeight);
    }
    if ('cameraTargetY' in partialPreferences) {
        nextPreferences.cameraTargetY = normalizeCameraTargetY(partialPreferences.cameraTargetY);
    }
    if ('desktopNativeTtsRate' in partialPreferences) {
        nextPreferences.desktopNativeTtsRate = normalizeDesktopNativeTTSRate(
            partialPreferences.desktopNativeTtsRate
        );
    }
    if ('desktopNativeTtsPitch' in partialPreferences) {
        nextPreferences.desktopNativeTtsPitch = normalizeDesktopNativeTTSPitch(
            partialPreferences.desktopNativeTtsPitch
        );
    }
    if ('desktopNativeTtsVolume' in partialPreferences) {
        nextPreferences.desktopNativeTtsVolume = normalizeDesktopNativeTTSVolume(
            partialPreferences.desktopNativeTtsVolume
        );
    }
    if ('autoChatEnabled' in partialPreferences) {
        nextPreferences.autoChatEnabled = normalizeAutoChatEnabled(partialPreferences.autoChatEnabled);
    }
    if ('avatarDialogueBubbleLeft' in partialPreferences) {
        nextPreferences.avatarDialogueBubbleLeft = normalizeAvatarDialogueBubbleLeft(
            partialPreferences.avatarDialogueBubbleLeft
        );
    }
    if ('avatarDialogueBubbleTop' in partialPreferences) {
        nextPreferences.avatarDialogueBubbleTop = normalizeAvatarDialogueBubbleTop(
            partialPreferences.avatarDialogueBubbleTop
        );
    }
    if ('avatarDialogueBubbleScale' in partialPreferences) {
        nextPreferences.avatarDialogueBubbleScale = normalizeAvatarDialogueBubbleScale(
            partialPreferences.avatarDialogueBubbleScale
        );
    }
    if ('avatarDialogueBubbleExtraWidth' in partialPreferences) {
        nextPreferences.avatarDialogueBubbleExtraWidth = normalizeAvatarDialogueBubbleExtraWidth(
            partialPreferences.avatarDialogueBubbleExtraWidth
        );
    }
    if ('avatarDialogueBubbleExtraTop' in partialPreferences) {
        nextPreferences.avatarDialogueBubbleExtraTop = normalizeAvatarDialogueBubbleExtraTop(
            partialPreferences.avatarDialogueBubbleExtraTop
        );
    }

    const nextAutoChatMinIntervalSec = 'autoChatMinIntervalSec' in partialPreferences
        ? normalizeAutoChatMinIntervalSec(partialPreferences.autoChatMinIntervalSec)
        : rendererPreferences.autoChatMinIntervalSec;
    const nextAutoChatMaxIntervalSec = 'autoChatMaxIntervalSec' in partialPreferences
        ? normalizeAutoChatMaxIntervalSec(
            partialPreferences.autoChatMaxIntervalSec,
            nextAutoChatMinIntervalSec
        )
        : normalizeAutoChatMaxIntervalSec(
            rendererPreferences.autoChatMaxIntervalSec,
            nextAutoChatMinIntervalSec
        );

    nextPreferences.autoChatMinIntervalSec = nextAutoChatMinIntervalSec;
    nextPreferences.autoChatMaxIntervalSec = nextAutoChatMaxIntervalSec;

    const petScaleChanged = nextPreferences.petScale !== rendererPreferences.petScale;
    const humanClawStateDirChanged =
        resolveHumanClawStateDir(nextPreferences.humanClawStateDir) !== rendererPreferences.humanClawResolvedStateDir;

    desktopState.preferences = {
        ...desktopState.preferences,
        ...nextPreferences
    };

    if (petScaleChanged) {
        const referenceBounds = petDialogueCollapsedBounds ||
            (petWindow ? petWindow.getBounds() : desktopState.petWindow.bounds);
        const nextBounds = clampBoundsToDisplay(
            resizePetBounds(referenceBounds, nextPreferences.petScale),
            PET_MIN_SIZE.width,
            PET_MIN_SIZE.height
        );

        desktopState.petWindow.bounds = nextBounds;
        if (petWindow && petDialogueExpanded) {
            const layout = getPetDialogueExpandedLayout(
                nextBounds,
                petDialogueExtraTop || PET_DIALOGUE_DEFAULT_EXTRA_TOP,
                petDialogueExtraWidth || PET_DIALOGUE_DEFAULT_EXTRA_WIDTH
            );
            petDialogueCollapsedBounds = layout.baseBounds;
            petDialogueExtraTop = layout.extraTop;
            petDialogueExtraWidth = layout.extraWidth;
            desktopState.petWindow.bounds = layout.baseBounds;
            setPetWindowBoundsTransient(layout.expandedBounds);
        } else {
            petWindow?.setBounds(nextBounds);
        }
    }

    if (
        !petScaleChanged &&
        petWindow &&
        petDialogueExpanded &&
        (
            'avatarDialogueBubbleExtraTop' in partialPreferences ||
            'avatarDialogueBubbleExtraWidth' in partialPreferences
        )
    ) {
        const layout = getPetDialogueExpandedLayout(
            petDialogueCollapsedBounds || desktopState.petWindow.bounds,
            nextPreferences.avatarDialogueBubbleExtraTop,
            nextPreferences.avatarDialogueBubbleExtraWidth
        );
        petDialogueCollapsedBounds = layout.baseBounds;
        petDialogueExtraTop = layout.extraTop;
        petDialogueExtraWidth = layout.extraWidth;
        desktopState.petWindow.bounds = layout.baseBounds;
        setPetWindowBoundsTransient(layout.expandedBounds);
    }

    if (petWindow) {
        petWindow.setSkipTaskbar(nextPreferences.petSkipTaskbar);
    }

    persistDesktopState();
    broadcastPreferencesUpdated();

    if ('speechMode' in partialPreferences) {
        warmupDesktopSpeechMode(nextPreferences.speechMode);
    }

    if ('backendMode' in partialPreferences || 'openclawGatewayUrl' in partialPreferences) {
        void syncOpenClawSelection({
            ensureReady: nextPreferences.backendMode === 'openclaw'
        }).catch((error) => {
            console.warn('[openclaw] 运行链路切换失败：', error.message || error);
        });
    }

    if (humanClawStateDirChanged && humanClawGateway) {
        const oldGateway = humanClawGateway;
        humanClawGateway = null;
        void oldGateway.stop()
            .catch((error) => {
                console.warn('[humanclaw-gateway] 状态目录切换时关闭旧 Gateway 失败：', error.message || error);
            })
            .finally(() => {
                void ensureHumanClawGateway().start().catch((error) => {
                    console.warn('[humanclaw-gateway] 状态目录切换后启动失败：', error.message || error);
                });
            });
    }

    return getRendererPreferences();
}

function applyPetScale(scale) {
    return applyPreferencesPatch({
        petScale: scale
    });
}

function buildPetScaleMenu() {
    const currentScale = normalizePetScale(desktopState?.preferences?.petScale || DEFAULT_PET_SCALE);

    return PET_SCALE_OPTIONS.map((scale) => ({
        label: `${Math.round(scale * 100)}%`,
        type: 'radio',
        checked: currentScale === scale,
        click: () => applyPetScale(scale)
    }));
}

function getSpeechModeLabel(mode) {
    if (mode === 'cosyvoice3') {
        return 'CosyVoice3 本地高质量';
    }
    if (mode === 'kokoro') {
        return 'Kokoro-82M 最低延迟';
    }
    if (mode === 'vits') {
        return '本地 VITS 实验模型';
    }
    if (mode === 'server') {
        return 'ElevenLabs 顶级音质';
    }
    if (mode === 'local') {
        return '浏览器 speechSynthesis';
    }
    if (mode === 'off') {
        return '关闭语音';
    }
    return '浏览器 speechSynthesis';
}

function buildControlMenuTemplate({ includeTaskbarToggle = false } = {}) {
    const template = [
        {
            label: '控制面板',
            click: () => showControlPanel()
        },
        {
            label: '聊天',
            click: () => showChatWindow()
        },
        {
            label: '语音模式',
            submenu: SPEECH_MODE_OPTIONS.map((mode) => ({
                label: getSpeechModeLabel(mode),
                type: 'radio',
                checked: getRendererPreferences().speechMode === mode,
                click: () => updateSpeechMode(mode)
            }))
        },
        {
            label: '缩放',
            submenu: buildPetScaleMenu()
        }
    ];

    if (includeTaskbarToggle) {
        template.push(
            { type: 'separator' },
            {
                label: '桌宠显示在任务栏',
                type: 'checkbox',
                checked: !desktopState.preferences.petSkipTaskbar,
                click: (menuItem) => {
                    applyPreferencesPatch({
                        petSkipTaskbar: !menuItem.checked
                    });
                }
            }
        );
    }

    template.push(
        { type: 'separator' },
        {
            label: '退出',
            click: () => quitApplication()
        }
    );

    return template;
}

function buildPetContextMenu() {
    return Menu.buildFromTemplate(buildControlMenuTemplate());
}

function showControlMenu(targetWindow = petWindow) {
    if (!targetWindow || targetWindow.isDestroyed()) {
        return false;
    }

    buildPetContextMenu().popup({ window: targetWindow });
    return true;
}

function createPetWindow() {
    const petState = desktopState.petWindow;
    const petBounds = clampBoundsToDisplay(petState.bounds, PET_MIN_SIZE.width, PET_MIN_SIZE.height);

    petWindow = new BrowserWindow({
        ...petBounds,
        frame: false,
        transparent: true,
        backgroundColor: '#00000000',
        hasShadow: false,
        resizable: false,
        movable: true,
        alwaysOnTop: true,
        skipTaskbar: desktopState.preferences.petSkipTaskbar,
        show: Boolean(petState.visible),
        title: 'HumanClaw Pet',
        webPreferences: {
            preload: path.join(__dirname, 'preload.cjs'),
            contextIsolation: true,
            nodeIntegration: false,
            sandbox: false
        }
    });

    petWindow.setAlwaysOnTop(true, 'screen-saver');
    petWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
    openExternalLinks(petWindow);
    hookWindowPersistence('petWindow', petWindow);

    petWindow.on('close', (event) => {
        if (isQuitting) {
            return;
        }
        event.preventDefault();
        petWindow.hide();
        hideChatWindow();
    });

    petWindow.on('closed', () => {
        petWindow = null;
        petDialogueCollapsedBounds = null;
        petDialogueExpanded = false;
        petDialogueExtraTop = 0;
        petDialogueExtraWidth = 0;
        petDialogueBoundsMutation = false;
        clearTimeout(petDialogueBoundsMutationTimer);
        petDialogueBoundsMutationTimer = null;
    });

    void loadWindowContent(petWindow, 'pet.html').catch((error) => {
        console.error('[window] 桌宠窗口加载失败：', error);
    });
    if (!desktopState.petWindow.visible) {
        petWindow.hide();
    }
}

function createChatWindow() {
    const chatState = desktopState.chatWindow;
    const chatBounds = clampBoundsToDisplay(chatState.bounds, CHAT_MIN_WIDTH, CHAT_MIN_HEIGHT);

    chatWindow = new BrowserWindow({
        ...chatBounds,
        frame: false,
        transparent: false,
        backgroundColor: '#f8fbff',
        hasShadow: true,
        resizable: true,
        show: false,
        skipTaskbar: false,
        alwaysOnTop: true,
        title: 'HumanClaw Chat',
        webPreferences: {
            preload: path.join(__dirname, 'preload.cjs'),
            contextIsolation: true,
            nodeIntegration: false,
            sandbox: false
        }
    });

    openExternalLinks(chatWindow);
    hookWindowPersistence('chatWindow', chatWindow);

    chatWindow.on('close', (event) => {
        if (isQuitting) {
            return;
        }
        event.preventDefault();
        chatWindow.hide();
    });

    chatWindow.on('closed', () => {
        chatWindow = null;
    });

    void loadWindowContent(chatWindow, 'chat.html')
        .then(() => {
            if (desktopState.chatWindow.visible) {
                chatWindow.show();
            }
        })
        .catch((error) => {
            console.error('[window] 聊天窗口加载失败：', error);
        });
}

function createControlWindow() {
    const controlState = desktopState.controlWindow;
    const controlBounds = clampBoundsToDisplay(
        controlState.bounds,
        CONTROL_MIN_WIDTH,
        CONTROL_MIN_HEIGHT
    );

    controlWindow = new BrowserWindow({
        ...controlBounds,
        minWidth: CONTROL_MIN_WIDTH,
        minHeight: CONTROL_MIN_HEIGHT,
        frame: false,
        transparent: false,
        backgroundColor: '#f4f6f8',
        hasShadow: true,
        resizable: true,
        show: false,
        skipTaskbar: false,
        title: 'HumanClaw Control Panel',
        webPreferences: {
            preload: path.join(__dirname, 'preload.cjs'),
            contextIsolation: true,
            nodeIntegration: false,
            sandbox: false
        }
    });

    openExternalLinks(controlWindow);
    hookWindowPersistence('controlWindow', controlWindow);

    controlWindow.on('close', (event) => {
        if (isQuitting) {
            return;
        }
        event.preventDefault();
        controlWindow.hide();
    });

    controlWindow.on('closed', () => {
        controlWindow = null;
    });

    void loadWindowContent(controlWindow, 'control.html')
        .then(() => {
            if (desktopState.controlWindow.visible) {
                controlWindow.show();
            }
        })
        .catch((error) => {
            console.error('[window] 控制面板加载失败：', error);
        });
}

function refreshTrayMenu() {
    if (!tray) {
        return;
    }

    const menu = Menu.buildFromTemplate([
        {
            label: petWindow?.isVisible() ? '隐藏桌宠' : '显示桌宠',
            click: () => {
                if (!petWindow) {
                    createPetWindow();
                    return;
                }
                if (petWindow.isVisible()) {
                    petWindow.hide();
                    hideChatWindow();
                } else {
                    petWindow.show();
                    petWindow.focus();
                }
            }
        },
        ...buildControlMenuTemplate({ includeTaskbarToggle: true })
    ]);

    tray.setContextMenu(menu);
    tray.setToolTip('HumanClaw 桌宠');
}

function createTray() {
    tray = new Tray(makeTrayIcon());
    tray.on('double-click', () => {
        if (!petWindow) {
            createPetWindow();
            return;
        }
        petWindow.show();
        petWindow.focus();
    });
    refreshTrayMenu();
}

function updateSpeechMode(nextMode) {
    return applyPreferencesPatch({
        speechMode: nextMode
    });
}

function updatePreferredMicDevice(nextDeviceId) {
    return applyPreferencesPatch({
        preferredMicDeviceId: nextDeviceId
    });
}

function updateRecognitionMode(nextMode) {
    return applyPreferencesPatch({
        recognitionMode: nextMode
    });
}

function restoreDefaultPreferences() {
    return applyPreferencesPatch({
        ...getDefaultState().preferences,
        llmApiKeyAction: 'clear',
        elevenLabsApiKeyAction: 'clear'
    });
}

async function chooseHumanClawStateDir() {
    const result = await dialog.showOpenDialog(controlWindow || BrowserWindow.getFocusedWindow() || petWindow, {
        title: '选择 HumanClaw 本地状态目录',
        defaultPath: getPersistedHumanClawStateDir(),
        properties: ['openDirectory', 'createDirectory']
    });
    if (result.canceled || !result.filePaths?.[0]) {
        return {
            ok: false,
            canceled: true
        };
    }
    return {
        ok: true,
        path: result.filePaths[0]
    };
}

function registerIpc() {
    ipcMain.on('aigril:get-preferences-sync', (event) => {
        event.returnValue = getRendererPreferences();
    });

    ipcMain.handle('aigril:get-control-panel-state', () => getControlPanelState());
    ipcMain.handle('aigril:save-preferences', (_event, payload = {}) => applyPreferencesPatch(payload));
    ipcMain.handle('aigril:restore-default-preferences', () => restoreDefaultPreferences());
    ipcMain.handle('aigril:choose-humanclaw-state-dir', () => chooseHumanClawStateDir());
    ipcMain.handle('aigril:toggle-chat-window', () => toggleChatWindow());
    ipcMain.handle('aigril:show-chat-window', () => {
        showChatWindow();
        return true;
    });
    ipcMain.handle('aigril:hide-chat-window', () => {
        hideChatWindow();
        return false;
    });
    ipcMain.handle('aigril:show-control-panel', () => showControlPanel());
    ipcMain.handle('aigril:show-control-menu', (event) => {
        const sourceWindow = BrowserWindow.fromWebContents(event.sender);
        return showControlMenu(sourceWindow || petWindow);
    });
    ipcMain.handle('aigril:close-current-window', (event) => {
        const sourceWindow = BrowserWindow.fromWebContents(event.sender);
        sourceWindow?.hide();
        return true;
    });
    ipcMain.handle('aigril:set-speech-mode', (_event, mode) => updateSpeechMode(mode));
    ipcMain.handle('aigril:set-recognition-mode', (_event, mode) => updateRecognitionMode(mode));
    ipcMain.handle('aigril:set-preferred-mic-device', (_event, deviceId) => updatePreferredMicDevice(deviceId));
    ipcMain.handle('aigril:set-pet-dialogue-expanded', (_event, payload = {}) =>
        setPetDialogueWindowExpanded(
            Boolean(payload.expanded),
            payload.extraTop,
            payload.extraWidth
        )
    );
    ipcMain.handle('aigril:vision-capture', async (event, payload = {}) =>
        captureVisionSnapshot(event, payload)
    );
    ipcMain.handle('aigril:memory-snapshot', async (_event, payload = {}) =>
        ensureHumanClawGateway().getMemorySnapshot(payload || {})
    );
    ipcMain.handle('aigril:memory-search', async (_event, payload = {}) =>
        ensureHumanClawGateway().searchMemory(payload.query || payload.text || '', payload || {})
    );
    ipcMain.handle('aigril:memory-update-block', async (_event, payload = {}) =>
        ensureHumanClawGateway().updateMemoryBlock(payload.key || '', payload.value || payload.content || '')
    );
    ipcMain.handle('aigril:memory-reset-affinity', async (_event, payload = {}) =>
        ensureHumanClawGateway().resetMemoryAffinity(payload.score)
    );
    ipcMain.handle('aigril:memory-forget', async (_event, payload = {}) =>
        ensureHumanClawGateway().forgetMemory(payload || {})
    );
    ipcMain.handle('aigril:memory-save-secret', async (_event, payload = {}) =>
        ensureHumanClawGateway().saveMemorySecret(payload || {})
    );
    ipcMain.handle('aigril:memory-delete-secret', async (_event, payload = {}) =>
        ensureHumanClawGateway().deleteMemorySecret(payload.name || payload.id || '')
    );
    ipcMain.on('aigril:vision-region-selected', (event, payload = {}) => {
        completeVisionRegionSelection(event, payload.selection || payload);
    });
    ipcMain.on('aigril:vision-region-cancelled', (event) => {
        cancelVisionRegionSelection(event);
    });
    ipcMain.handle('aigril:llm-chat', async (_event, payload = {}) => callDesktopLlm(payload));
    ipcMain.handle('aigril:tts-synthesize', async (_event, payload = {}) => callDesktopTts(payload));
    ipcMain.handle('aigril:asr-transcribe', async (_event, audioBytes) => {
        if (!desktopASRManager) {
            throw new Error('本地语音识别管理器尚未初始化');
        }

        return desktopASRManager.transcribeAudioBytes(audioBytes);
    });
    ipcMain.handle('aigril:assistant-status', async () => getAssistantStatusSnapshot());
    ipcMain.handle('aigril:assistant-tool-surface', async () => getOpenClawToolSurface());
    ipcMain.handle('aigril:assistant-validate-tool-surface', async () => validateOpenClawToolSurface());
    ipcMain.handle('aigril:assistant-history', async (_event, payload = {}) => {
        await syncOpenClawSelection({ ensureReady: true });
        return ensureAssistantGateway().getHistory(Number(payload.limit) || 200);
    });
    ipcMain.handle('aigril:assistant-send-message', async (_event, payload = {}) => {
        await syncOpenClawSelection({ ensureReady: true });
        return ensureAssistantGateway().sendMessage(payload.content || '', {
            timeoutMs: Number(payload.timeoutMs) || undefined
        });
    });
    ipcMain.handle('aigril:assistant-abort-run', async (_event, payload = {}) => {
        await syncOpenClawSelection({ ensureReady: true });
        return ensureAssistantGateway().abortRun(payload.runId || '');
    });
    ipcMain.handle('aigril:assistant-list-sessions', async (_event, payload = {}) => {
        await syncOpenClawSelection({ ensureReady: true });
        return ensureAssistantGateway().listSessions(Number(payload.limit) || 20);
    });
    ipcMain.handle('aigril:assistant-set-session-key', async (_event, payload = {}) => {
        await syncOpenClawSelection({ ensureReady: true });
        return ensureAssistantGateway().setSessionKey(payload.sessionKey || '');
    });
    ipcMain.handle('aigril:assistant-patch-session', async (_event, payload = {}) => {
        await syncOpenClawSelection({ ensureReady: true });
        return ensureAssistantGateway().patchSession(payload || {});
    });
    ipcMain.handle('aigril:gateway-status', async () => ensureHumanClawGateway().getStatus());
    ipcMain.handle('aigril:gateway-tools-list', async () => ensureHumanClawGateway().listTools());
    ipcMain.handle('aigril:gateway-tools-call', async (_event, payload = {}) =>
        ensureHumanClawGateway().callTool(payload || {})
    );
    ipcMain.handle('aigril:gateway-agent-run', async (_event, payload = {}) =>
        ensureHumanClawGateway().runAgent({
            ...(payload || {}),
            llmSettings: payload?.llmSettings || getResolvedLlmSettings()
        })
    );
    ipcMain.handle('aigril:gateway-audit-list', async (_event, payload = {}) => ({
        ok: true,
        entries: await ensureHumanClawGateway().readAuditEntries(Number(payload.limit) || 100)
    }));

    ipcMain.on('aigril:drag-pet-window', (_event, payload = {}) => {
        if (!petWindow) {
            return;
        }

        const rawDeltaX = Number(payload.deltaX || 0);
        const rawDeltaY = Number(payload.deltaY || 0);
        const deltaX = Number.isFinite(rawDeltaX) ? rawDeltaX : 0;
        const deltaY = Number.isFinite(rawDeltaY) ? rawDeltaY : 0;

        if (petDialogueExpanded && petDialogueCollapsedBounds) {
            const movedBaseBounds = clampBoundsToDisplay({
                ...petDialogueCollapsedBounds,
                x: Math.round(petDialogueCollapsedBounds.x + deltaX),
                y: Math.round(petDialogueCollapsedBounds.y + deltaY)
            }, PET_MIN_SIZE.width, PET_MIN_SIZE.height);
            const layout = getPetDialogueExpandedLayout(
                movedBaseBounds,
                petDialogueExtraTop || PET_DIALOGUE_DEFAULT_EXTRA_TOP,
                petDialogueExtraWidth || PET_DIALOGUE_DEFAULT_EXTRA_WIDTH
            );

            petDialogueCollapsedBounds = layout.baseBounds;
            petDialogueExtraTop = layout.extraTop;
            petDialogueExtraWidth = layout.extraWidth;
            petDialogueExpanded = layout.extraTop > 0 || layout.extraWidth > 0;
            desktopState.petWindow.bounds = layout.baseBounds;
            desktopState.petWindow.visible = petWindow.isVisible();
            setPetWindowBoundsTransient(layout.expandedBounds);
            return;
        }

        const bounds = petWindow.getBounds();
        const nextBounds = clampBoundsToDisplay({
            ...bounds,
            x: Math.round(bounds.x + deltaX),
            y: Math.round(bounds.y + deltaY)
        }, PET_MIN_SIZE.width, PET_MIN_SIZE.height);

        petWindow.setBounds(nextBounds);
    });

    ipcMain.on('aigril:chat-send-message', (_event, payload = {}) => {
        petWindow?.webContents.send('aigril:chat-send-message', payload);
        showChatWindow();
    });

    ipcMain.on('aigril:pet-chat-event', (_event, payload = {}) => {
        if (chatWindow) {
            chatWindow.webContents.send('aigril:chat-event', payload);
        }
    });

    ipcMain.on('aigril:chat-state-sync-request', () => {
        petWindow?.webContents.send('aigril:chat-state-sync-request', {});
    });
}

if (!app.requestSingleInstanceLock()) {
    app.quit();
} else {
    app.on('second-instance', () => {
        if (petWindow) {
            petWindow.show();
            petWindow.focus();
        }
        showChatWindow();
    });
}

app.whenReady().then(() => {
    desktopState = loadDesktopState(app);
    if (!desktopState.preferences.llmBaseUrl || desktopState.preferences.llmBaseUrl === 'https://api.openai.com/v1') {
        desktopState.preferences.llmBaseUrl = DEFAULT_LLM_BASE_URL;
    }
    if (!desktopState.preferences.llmModel) {
        desktopState.preferences.llmModel = DEFAULT_LLM_MODEL;
    }
    desktopState.preferences.backendBaseUrl = resolveDesktopBackendBaseUrl();
    desktopState.preferences.backendMode = normalizeBackendMode(
        desktopState.preferences.backendMode || DEFAULT_BACKEND_MODE
    );
    desktopState.preferences.openclawGatewayUrl = normalizeOpenClawGatewayUrl(
        desktopState.preferences.openclawGatewayUrl || DEFAULT_OPENCLAW_GATEWAY_URL
    );
    desktopState.preferences.llmProvider = normalizeLlmProvider(
        desktopState.preferences.llmProvider || DEFAULT_LLM_PROVIDER
    );
    desktopState.preferences.llmBaseUrl = normalizeLlmBaseUrl(
        desktopState.preferences.llmBaseUrl || DEFAULT_LLM_BASE_URL
    );
    desktopState.preferences.llmModel = normalizeLlmModel(
        desktopState.preferences.llmModel || DEFAULT_LLM_MODEL
    );
    desktopState.preferences.llmApiKey = normalizeLlmApiKey(
        desktopState.preferences.llmApiKey || ''
    );
    desktopState.preferences.llmTemperature = normalizeLlmTemperature(
        desktopState.preferences.llmTemperature ?? DEFAULT_LLM_TEMPERATURE
    );
    desktopState.preferences.llmRequestTimeoutMs = normalizeLlmRequestTimeoutMs(
        desktopState.preferences.llmRequestTimeoutMs || DEFAULT_LLM_REQUEST_TIMEOUT_MS
    );
    desktopState.preferences.elevenLabsApiBase = normalizeElevenLabsApiBase(
        desktopState.preferences.elevenLabsApiBase || DEFAULT_ELEVENLABS_API_BASE
    );
    desktopState.preferences.elevenLabsApiKey = normalizeElevenLabsApiKey(
        desktopState.preferences.elevenLabsApiKey || DEFAULT_ELEVENLABS_API_KEY
    );
    desktopState.preferences.elevenLabsVoiceId = normalizeElevenLabsVoiceId(
        desktopState.preferences.elevenLabsVoiceId || DEFAULT_ELEVENLABS_VOICE_ID
    );
    desktopState.preferences.elevenLabsModelId = normalizeElevenLabsModelId(
        desktopState.preferences.elevenLabsModelId || DEFAULT_ELEVENLABS_MODEL_ID
    );
    desktopState.preferences.elevenLabsOutputFormat = normalizeElevenLabsOutputFormat(
        desktopState.preferences.elevenLabsOutputFormat || DEFAULT_ELEVENLABS_OUTPUT_FORMAT
    );
    desktopState.preferences.elevenLabsTimeoutMs = normalizeElevenLabsTimeoutMs(
        desktopState.preferences.elevenLabsTimeoutMs || DEFAULT_ELEVENLABS_TIMEOUT_MS
    );
    desktopState.preferences.computerControlEnabled = normalizeComputerControlEnabled(
        desktopState.preferences.computerControlEnabled ?? DEFAULT_COMPUTER_CONTROL_ENABLED
    );
    desktopState = saveDesktopState(app, desktopState);
    desktopASRManager = new DesktopASRManager({ app });
    Menu.setApplicationMenu(null);
    registerMediaPermissionHandlers();
    protocol.handle(SPEECH_MODEL_PROTOCOL, handleSpeechModelProtocol);
    registerIpc();
    void ensureHumanClawGateway().start().catch((error) => {
        console.warn('[humanclaw-gateway] 启动失败：', error.message || error);
    });
    createPetWindow();
    createChatWindow();
    if (desktopState.controlWindow?.visible) {
        createControlWindow();
    }
    createTray();

    setTimeout(() => {
        desktopASRManager?.warmup?.().catch((error) => {
            console.warn('[ASR] 后台预热失败：', error.message || error);
        });
    }, 4000);

    const initialSpeechMode = normalizeSpeechMode(desktopState?.preferences?.speechMode);
    warmupDesktopSpeechMode(initialSpeechMode, {
        delayMs: initialSpeechMode === 'kokoro'
            ? KOKORO_WARMUP_DELAY_MS
            : COSYVOICE3_WARMUP_DELAY_MS
    });

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createPetWindow();
            createChatWindow();
            if (desktopState.controlWindow?.visible) {
                createControlWindow();
            }
            if (!tray) {
                createTray();
            }
        } else if (petWindow) {
            petWindow.show();
        }
    });
});

app.on('before-quit', () => {
    isQuitting = true;
    if (visionRegionSelectionRequest) {
        cancelVisionRegionSelection();
    }
    desktopASRManager?.close?.();
    const gatewayShutdown = assistantGateway?.shutdown?.();
    gatewayShutdown?.catch?.(() => {});
    const runtimeShutdown = openclawRuntimeSupervisor?.shutdown?.();
    runtimeShutdown?.catch?.(() => {});
    const humanGatewayShutdown = humanClawGateway?.stop?.();
    humanGatewayShutdown?.catch?.(() => {});
    closeCosyVoice3TTS();
    closeKokoroTTS();
});

app.on('window-all-closed', () => {
    // 托盘常驻形态下，窗口全部关闭并不等于退出应用。
});
