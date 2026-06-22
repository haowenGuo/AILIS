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
    configureCosyVoice3TTS,
    synthesizeCosyVoice3Speech,
    warmupCosyVoice3TTS
} = require('./desktop-cosyvoice3-tts.cjs');
const { VoiceRuntimeBootstrap } = require('./voice-runtime-bootstrap.cjs');
const {
    OpenClawGatewayManager,
    OpenClawRuntimeSupervisor
} = require('./openclaw-runtime.cjs');
const { AILISGateway } = require('./ailis-gateway.cjs');
const { createAILISDesktopPlatformAdapter } = require('./ailis-desktop-platform-adapter.cjs');
const {
    getOpenClawToolSurface,
    getOpenClawToolSurfaceSummary,
    validateOpenClawToolSurface
} = require('./openclaw-tool-surface.cjs');
const {
    callDesktopLlmProvider,
    checkDesktopLlmProvider,
    getDefaultProviderBaseUrl,
    getDefaultProviderModel,
    getProviderCapabilities
} = require('./desktop-llm-provider.cjs');
const { searchVllmModelCatalog } = require('./vllm-model-catalog.cjs');
const { VllmLocalDeployer } = require('./vllm-local-deployer.cjs');
const {
    BACKEND_MODE_OPTIONS,
    DEFAULT_AUTO_CHAT_ENABLED,
    DEFAULT_AUTO_CHAT_MAX_INTERVAL_SEC,
    DEFAULT_AUTO_CHAT_MIN_INTERVAL_SEC,
    DEFAULT_AVATAR_DIALOGUE_BUBBLE_EXTRA_TOP,
    DEFAULT_AVATAR_DIALOGUE_BUBBLE_EXTRA_WIDTH,
    DEFAULT_BACKEND_BASE_URL,
    DEFAULT_BACKEND_MODE,
    DEFAULT_CONVERSATION_MODE,
    DEFAULT_CAMERA_DISTANCE,
    DEFAULT_CAMERA_HEIGHT,
    DEFAULT_CAMERA_TARGET_Y,
    DEFAULT_COMPUTER_CONTROL_ENABLED,
    DEFAULT_RENDER_PROFILE_ID,
    DEFAULT_RENDER_LIGHT_YAW_DEG,
    DEFAULT_RENDER_KEY_LIGHT_SCALE,
    DEFAULT_RENDER_AMBIENT_FILL_SCALE,
    DEFAULT_RENDER_OUTLINE_SCALE,
    DEFAULT_RENDER_SHADOW_ENABLED,
    DEFAULT_RENDER_RESOLUTION_SCALE,
    DEFAULT_RENDER_FPS_LIMIT,
    DEFAULT_RENDER_SHADOW_QUALITY,
    DEFAULT_RENDER_OUTLINE_ENABLED,
    DEFAULT_RENDER_ANTIALIAS_ENABLED,
    DEFAULT_DESKTOP_NATIVE_TTS_PITCH,
    DEFAULT_DESKTOP_NATIVE_TTS_RATE,
    DEFAULT_DESKTOP_NATIVE_TTS_VOLUME,
    DEFAULT_CHUNKED_TTS_ENABLED,
    DEFAULT_LLM_BASE_URL,
    DEFAULT_LLM_MODEL,
    DEFAULT_LLM_PROVIDER,
    DEFAULT_LLM_REQUEST_TIMEOUT_MS,
    DEFAULT_LLM_TEMPERATURE,
    LLM_PROVIDER_DEFAULT_BASE_URLS,
    LLM_PROVIDER_DEFAULT_MODELS,
    DEFAULT_ELEVENLABS_API_BASE,
    DEFAULT_ELEVENLABS_API_KEY,
    DEFAULT_ELEVENLABS_LANGUAGE_CODE,
    DEFAULT_ELEVENLABS_MODEL_ID,
    DEFAULT_ELEVENLABS_OPTIMIZE_STREAMING_LATENCY,
    DEFAULT_ELEVENLABS_OUTPUT_FORMAT,
    DEFAULT_ELEVENLABS_SIMILARITY_BOOST,
    DEFAULT_ELEVENLABS_SPEED,
    DEFAULT_ELEVENLABS_STABILITY,
    DEFAULT_ELEVENLABS_STYLE,
    DEFAULT_ELEVENLABS_TIMEOUT_MS,
    DEFAULT_ELEVENLABS_USE_SPEAKER_BOOST,
    DEFAULT_ELEVENLABS_VOICE_ID,
    DEFAULT_ELEVENLABS_VOICE_PROFILES,
    DEFAULT_AILIS_STATE_DIR,
    DEFAULT_OPENCLAW_GATEWAY_URL,
    DEFAULT_PET_SCALE,
    EMAIL_PROVIDER_OPTIONS,
    ELEVENLABS_LANGUAGE_CODES,
    LLM_PROVIDER_OPTIONS,
    PET_SCALE_OPTIONS,
    CONVERSATION_MODE_OPTIONS,
    RECOGNITION_MODE_OPTIONS,
    RENDER_PROFILE_OPTIONS,
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
    normalizeConversationMode,
    normalizeComputerControlEnabled,
    normalizeRenderProfileId,
    normalizeRenderLightYawDeg,
    normalizeRenderKeyLightScale,
    normalizeRenderAmbientFillScale,
    normalizeRenderOutlineScale,
    normalizeRenderShadowEnabled,
    normalizeRenderResolutionScale,
    normalizeRenderFpsLimit,
    normalizeRenderShadowQuality,
    normalizeRenderOutlineEnabled,
    normalizeRenderAntialiasEnabled,
    normalizeDesktopNativeTTSPitch,
    normalizeDesktopNativeTTSRate,
    normalizeDesktopNativeTTSVolume,
    normalizeChunkedTtsEnabled,
    normalizeElevenLabsApiBase,
    normalizeElevenLabsApiKey,
    normalizeElevenLabsLanguageCode,
    normalizeElevenLabsModelId,
    normalizeElevenLabsOptimizeStreamingLatency,
    normalizeElevenLabsOutputFormat,
    normalizeElevenLabsSimilarityBoost,
    normalizeElevenLabsSpeed,
    normalizeElevenLabsStability,
    normalizeElevenLabsStyle,
    normalizeElevenLabsTimeoutMs,
    normalizeElevenLabsUseSpeakerBoost,
    normalizeElevenLabsVoiceProfiles,
    normalizeElevenLabsVoiceId,
    normalizeEmailProfiles,
    normalizeAILISStateDir,
    normalizeLlmApiKey,
    normalizeLlmBaseUrl,
    normalizeLlmModel,
    normalizeLlmProvider,
    normalizeLlmRequestTimeoutMs,
    normalizeLlmTemperature,
    normalizeOpenClawGatewayUrl,
    normalizePetMouseHitTestDebug,
    normalizePetMouseHitTestEnabled,
    normalizePetMouseHitTestHeightRatio,
    normalizePetMouseHitTestOffsetXRatio,
    normalizePetMouseHitTestOffsetYRatio,
    normalizePetMouseHitTestShape,
    normalizePetMouseHitTestWidthRatio,
    normalizeRecognitionMode,
    normalizeSpeechMode,
    normalizePreferredMicDeviceId,
    normalizePetScale,
    resizePetBounds,
    saveDesktopState
} = require('./store.cjs');

const DEFAULT_DEV_SERVER_URL = 'http://127.0.0.1:5173';
const devServerUrl = process.env.AILIS_DESKTOP_DEV_URL || '';
const PET_MIN_SIZE = getScaledPetSize(PET_SCALE_OPTIONS[0]);
const CHAT_MIN_WIDTH = 360;
const CHAT_MIN_HEIGHT = 420;
const CONTROL_MIN_WIDTH = 760;
const CONTROL_MIN_HEIGHT = 620;
const AGENT_LAB_MIN_WIDTH = 1100;
const AGENT_LAB_MIN_HEIGHT = 760;
const PET_DIALOGUE_DEFAULT_EXTRA_TOP = DEFAULT_AVATAR_DIALOGUE_BUBBLE_EXTRA_TOP;
const PET_DIALOGUE_DEFAULT_EXTRA_WIDTH = DEFAULT_AVATAR_DIALOGUE_BUBBLE_EXTRA_WIDTH;
const PET_DIALOGUE_MAX_EXTRA_TOP = 360;
const PET_DIALOGUE_MAX_EXTRA_WIDTH = 520;
const COSYVOICE3_WARMUP_DELAY_MS = 6500;
const LOCAL_RESOURCE_PROTOCOL = 'ailis-resource';
const SPEECH_MODEL_PROTOCOL = 'ailis-model';
const SPEECH_MODEL_CACHE_DIRNAME = 'speech-models';
const VISION_CACHE_DIRNAME = 'vision-snapshots';
const AILIS_STATE_DIRNAME = '.ailis-state';
const VISION_CACHE_MAX_FILES = 40;
const CHAT_FILE_ATTACHMENT_LIMIT = 12;
const VISION_REGION_MIN_SIZE_DIP = 12;
const VISION_MODEL_MAX_EDGE = 1800;
const VISION_MODEL_JPEG_QUALITY = 88;
const SPEECH_MODEL_REMOTE_HOSTS = {
    modelscope: 'https://www.modelscope.cn/models/',
    huggingface: 'https://huggingface.co/'
};
const PET_CURSOR_TRACK_INTERVAL_MS = 50;
const APP_ICON_PATH = path.join(__dirname, 'assets', 'ailis-icon.png');
const APP_TRAY_ICON_PATH = path.join(__dirname, 'assets', 'ailis-tray.png');

function getExistingImagePath(...candidatePaths) {
    for (const candidatePath of candidatePaths) {
        if (candidatePath && fs.existsSync(candidatePath)) {
            return candidatePath;
        }
    }
    return '';
}

function getAppIconPath() {
    return getExistingImagePath(APP_ICON_PATH);
}

function getTrayIconPath() {
    return getExistingImagePath(APP_TRAY_ICON_PATH, APP_ICON_PATH);
}

app.setName('AILIS');
app.setAppUserModelId('com.ailis.desktop');

let petWindow = null;
let chatWindow = null;
let controlWindow = null;
let controlWindowLoadPromise = null;
let agentLabWindow = null;
let agentLabWindowLoadPromise = null;
let tray = null;
let isQuitting = false;
let desktopState = null;
let desktopASRManager = null;
let voiceRuntimeBootstrap = null;
let vllmLocalDeployer = null;
let assistantGateway = null;
let openclawRuntimeSupervisor = null;
let ailisGateway = null;
let ailisGatewayStartPromise = null;
let petDialogueCollapsedBounds = null;
let petDialogueExpanded = false;
let petDialogueExtraTop = 0;
let petDialogueExtraWidth = 0;
let petDialogueBoundsMutation = false;
let petDialogueBoundsMutationTimer = null;
let petMousePassthroughEnabled = false;
let petDragState = null;
let petCursorTrackingTimer = null;
let petCursorTrackingLastSignature = '';
let visionRegionSelectionRequest = null;
const windowPersistTimers = new Map();
const speechModelDownloadTasks = new Map();
const desktopPlatformAdapter = createAILISDesktopPlatformAdapter({
    BrowserWindow,
    desktopCapturer,
    screen,
    icon: getAppIconPath(),
    preloadPath: path.join(__dirname, 'preload.cjs'),
    loadWindowContent
});

if (typeof protocol?.registerSchemesAsPrivileged === 'function') {
    protocol.registerSchemesAsPrivileged([
        {
            scheme: LOCAL_RESOURCE_PROTOCOL,
            privileges: {
                standard: true,
                secure: true,
                supportFetchAPI: true,
                corsEnabled: true,
                stream: true
            }
        },
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

function getGatewayWorkspaceRoot() {
    if (app.isPackaged) {
        return path.join(app.getPath('userData'), 'workspace');
    }
    return getProjectRoot();
}

function getDefaultAILISStateDir() {
    if (app.isPackaged) {
        return path.join(app.getPath('userData'), AILIS_STATE_DIRNAME);
    }
    return path.join(getProjectRoot(), AILIS_STATE_DIRNAME);
}

function resolveAILISStateDir(value = '') {
    const normalized = normalizeAILISStateDir(value || DEFAULT_AILIS_STATE_DIR);
    if (!normalized) {
        return getDefaultAILISStateDir();
    }
    const relativeBaseDir = app.isPackaged ? app.getPath('userData') : getProjectRoot();
    return path.isAbsolute(normalized)
        ? path.resolve(normalized)
        : path.resolve(relativeBaseDir, normalized);
}

function getPersistedAILISStateDir() {
    return resolveAILISStateDir(desktopState?.preferences?.ailisStateDir);
}

function getVoiceRuntimeBootstrap() {
    if (!voiceRuntimeBootstrap) {
        voiceRuntimeBootstrap = new VoiceRuntimeBootstrap({
            projectRoot: getProjectRoot(),
            userDataPath: app.getPath('userData'),
            appDataPath: app.getPath('appData'),
            platform: process.platform
        });
    }
    return voiceRuntimeBootstrap;
}

function getVllmLocalDeployer() {
    if (!vllmLocalDeployer) {
        vllmLocalDeployer = new VllmLocalDeployer({
            projectRoot: getProjectRoot(),
            platform: process.platform
        });
    }
    return vllmLocalDeployer;
}

async function bootstrapVoiceRuntime(payload = {}) {
    const result = await getVoiceRuntimeBootstrap().bootstrap(payload || {});
    configureCosyVoice3TTS({
        projectRoot: getProjectRoot(),
        userDataPath: app.getPath('userData'),
        pythonPath: getVoiceRuntimeBootstrap().getPreferredVoicePythonPath()
    });
    return result;
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

function normalizeChatFilePath(value = '') {
    const filePath = String(value || '').trim();
    if (!filePath) {
        return '';
    }
    return path.resolve(filePath);
}

function formatChatFileBytes(bytes) {
    const numericValue = Number(bytes);
    if (!Number.isFinite(numericValue) || numericValue < 0) {
        return '';
    }
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let value = numericValue;
    let unitIndex = 0;
    while (value >= 1024 && unitIndex < units.length - 1) {
        value /= 1024;
        unitIndex += 1;
    }
    return `${value.toFixed(unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
}

function inferChatFileMimeType(filePath) {
    const extension = path.extname(filePath).toLowerCase();
    const mimeTypes = {
        '.txt': 'text/plain',
        '.md': 'text/markdown',
        '.markdown': 'text/markdown',
        '.json': 'application/json',
        '.jsonl': 'application/x-ndjson',
        '.csv': 'text/csv',
        '.tsv': 'text/tab-separated-values',
        '.yaml': 'application/yaml',
        '.yml': 'application/yaml',
        '.toml': 'application/toml',
        '.xml': 'application/xml',
        '.html': 'text/html',
        '.htm': 'text/html',
        '.js': 'text/javascript',
        '.mjs': 'text/javascript',
        '.cjs': 'text/javascript',
        '.ts': 'text/typescript',
        '.tsx': 'text/typescript',
        '.jsx': 'text/javascript',
        '.py': 'text/x-python',
        '.java': 'text/x-java-source',
        '.c': 'text/x-c',
        '.cpp': 'text/x-c++',
        '.h': 'text/x-c',
        '.hpp': 'text/x-c++',
        '.cs': 'text/x-csharp',
        '.go': 'text/x-go',
        '.rs': 'text/x-rust',
        '.php': 'text/x-php',
        '.rb': 'text/x-ruby',
        '.sh': 'text/x-shellscript',
        '.ps1': 'text/x-powershell',
        '.bat': 'application/x-bat',
        '.css': 'text/css',
        '.scss': 'text/x-scss',
        '.less': 'text/x-less',
        '.pdf': 'application/pdf',
        '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.webp': 'image/webp',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
        '.mp3': 'audio/mpeg',
        '.wav': 'audio/wav',
        '.mp4': 'video/mp4',
        '.zip': 'application/zip'
    };
    return mimeTypes[extension] || '';
}

async function describeChatFilePath(rawPath) {
    const filePath = normalizeChatFilePath(rawPath);
    if (!filePath) {
        return {
            ok: false,
            path: '',
            error: 'empty_path'
        };
    }
    let stat;
    try {
        stat = await fsp.lstat(filePath);
    } catch (error) {
        return {
            ok: false,
            path: filePath,
            error: error?.code === 'ENOENT' ? 'not_found' : (error?.message || String(error))
        };
    }

    const kind = stat.isDirectory()
        ? 'directory'
        : stat.isFile()
            ? 'file'
            : stat.isSymbolicLink()
                ? 'symlink'
                : 'other';
    if (!['file', 'directory'].includes(kind)) {
        return {
            ok: false,
            path: filePath,
            error: `unsupported_${kind}`
        };
    }

    const name = path.basename(filePath) || filePath;
    const extension = stat.isFile() ? path.extname(filePath).toLowerCase() : '';
    return {
        ok: true,
        type: 'file',
        id: `file-${Buffer.from(filePath).toString('base64url').slice(0, 72)}`,
        source: 'local-file',
        label: name,
        name,
        path: filePath,
        kind,
        extension,
        mimeType: stat.isFile() ? inferChatFileMimeType(filePath) : '',
        size: stat.isFile() ? stat.size : 0,
        sizeText: stat.isFile() ? formatChatFileBytes(stat.size) : '文件夹',
        createdAt: stat.birthtime ? stat.birthtime.toISOString() : '',
        modifiedAt: stat.mtime ? stat.mtime.toISOString() : ''
    };
}

async function describeChatFilePaths(rawPaths = []) {
    const paths = Array.isArray(rawPaths) ? rawPaths : [];
    const uniquePaths = [];
    const seen = new Set();
    for (const rawPath of paths) {
        const filePath = normalizeChatFilePath(rawPath);
        const key = process.platform === 'win32' ? filePath.toLowerCase() : filePath;
        if (filePath && !seen.has(key)) {
            uniquePaths.push(filePath);
            seen.add(key);
        }
        if (uniquePaths.length >= CHAT_FILE_ATTACHMENT_LIMIT) {
            break;
        }
    }

    const described = await Promise.all(uniquePaths.map(describeChatFilePath));
    const files = described.filter((entry) => entry.ok);
    const skipped = described
        .filter((entry) => !entry.ok)
        .map((entry) => ({
            path: entry.path || '',
            error: entry.error || 'unknown'
        }));
    return {
        ok: true,
        files,
        skipped,
        limit: CHAT_FILE_ATTACHMENT_LIMIT,
        truncated: paths.length > uniquePaths.length
    };
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

    return await desktopPlatformAdapter.captureWindowSnapshot({
        targetWindow,
        emptyMessage: '窗口截图为空。'
    });
}

async function captureScreenSnapshot(display = desktopPlatformAdapter.getPrimaryDisplay()) {
    return await desktopPlatformAdapter.captureScreenSnapshot(display);
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

    const selectionWindow = desktopPlatformAdapter.createRegionSelectionWindow(display, {
        title: 'AILIS Region Capture'
    });

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

    void desktopPlatformAdapter.showRegionSelectionWindow(selectionWindow, 'vision-region.html')
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
    return await desktopPlatformAdapter.captureRegionSnapshot({
        display: desktopPlatformAdapter.getPrimaryDisplay(),
        requestSelection: requestVisionRegionSelection,
        minSize: VISION_REGION_MIN_SIZE_DIP
    });
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

function isPathInsideRoot(candidatePath, rootPath) {
    const relativePath = path.relative(rootPath, candidatePath);
    return relativePath === '' || (
        Boolean(relativePath) &&
        !relativePath.startsWith('..') &&
        !path.isAbsolute(relativePath)
    );
}

function getLocalResourceRoots() {
    const appRoot = path.resolve(__dirname, '..');
    return [
        path.join(appRoot, 'Resources'),
        path.join(appRoot, 'dist', 'Resources'),
        process.resourcesPath ? path.join(process.resourcesPath, 'Resources') : ''
    ]
        .filter(Boolean)
        .map((rootPath) => path.resolve(rootPath))
        .filter((rootPath, index, roots) => roots.indexOf(rootPath) === index);
}

function parseLocalResourcePathFromUrl(requestUrl) {
    const targetUrl = new URL(requestUrl);
    const rawPath = decodeURIComponent([
        targetUrl.hostname || '',
        targetUrl.pathname || ''
    ].join('/'))
        .replace(/\\/g, '/')
        .replace(/\/+/g, '/')
        .replace(/^\/+/, '')
        .trim();

    if (!rawPath || rawPath.includes('\0')) {
        throw new Error('缺少本地资源路径');
    }

    const relativePath = rawPath
        .replace(/^resources\//i, '')
        .replace(/^\/+/, '');
    const roots = getLocalResourceRoots();

    for (const rootPath of roots) {
        const candidatePath = path.resolve(rootPath, relativePath);
        if (!isPathInsideRoot(candidatePath, rootPath)) {
            continue;
        }
        if (fs.existsSync(candidatePath)) {
            return candidatePath;
        }
    }

    throw new Error(`本地资源不存在：${rawPath}`);
}

async function handleLocalResourceProtocol(request) {
    try {
        return createFileResponse(parseLocalResourcePathFromUrl(request.url));
    } catch (error) {
        return new Response(String(error.message || error), {
            status: 404,
            headers: {
                'content-type': 'text/plain; charset=utf-8'
            }
        });
    }
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
    const trayIconPath = getTrayIconPath();
    if (trayIconPath) {
        const image = nativeImage.createFromPath(trayIconPath);
        if (!image.isEmpty()) {
            return image.resize({ width: 16, height: 16 });
        }
    }

    const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64">
            <defs>
                <linearGradient id="ailis-bg" x1="0" x2="1" y1="0" y2="1">
                    <stop offset="0%" stop-color="#e8f6ff"/>
                    <stop offset="100%" stop-color="#ffefe5"/>
                </linearGradient>
            </defs>
            <rect width="64" height="64" rx="16" fill="url(#ailis-bg)"/>
            <circle cx="22" cy="48" r="18" fill="#73b8e5" opacity="0.55"/>
            <text x="50%" y="59%" text-anchor="middle" font-size="28" font-family="Segoe UI, Arial" font-weight="700" fill="#49606d">A</text>
        </svg>
    `;

    return nativeImage
        .createFromDataURL(`data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`)
        .resize({ width: 16, height: 16 });
}

function clampBoundsToDisplay(bounds, minimumWidth = 320, minimumHeight = 320) {
    return desktopPlatformAdapter.clampBoundsToDisplay(bounds, minimumWidth, minimumHeight);
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
    return desktopPlatformAdapter.getExpandedWindowLayout({
        baseBounds,
        requestedExtraTop,
        requestedExtraWidth,
        minimumWidth: PET_MIN_SIZE.width,
        minimumHeight: PET_MIN_SIZE.height,
        normalizeExtraTop: normalizePetDialogueExtraTop,
        normalizeExtraWidth: normalizePetDialogueExtraWidth
    });
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

function getCurrentPetScale() {
    return normalizePetScale(desktopState?.preferences?.petScale || DEFAULT_PET_SCALE);
}

function canonicalizePetBounds(bounds) {
    return clampBoundsToDisplay(
        resizePetBounds(bounds, getCurrentPetScale()),
        PET_MIN_SIZE.width,
        PET_MIN_SIZE.height
    );
}

function setPetMousePassthrough(enabled, options = {}) {
    if (!petWindow || petWindow.isDestroyed()) {
        return false;
    }

    const nextEnabled = Boolean(enabled);
    if (petMousePassthroughEnabled === nextEnabled && !options.force) {
        return true;
    }

    petMousePassthroughEnabled = nextEnabled;
    return desktopPlatformAdapter.setMousePassthrough(petWindow, nextEnabled, {
        forward: true
    });
}

function stopPetCursorTracking() {
    if (petCursorTrackingTimer) {
        clearInterval(petCursorTrackingTimer);
        petCursorTrackingTimer = null;
    }
    petCursorTrackingLastSignature = '';
}

function startPetCursorTracking() {
    stopPetCursorTracking();
    petCursorTrackingTimer = setInterval(() => {
        if (!petWindow || petWindow.isDestroyed() || !petWindow.isVisible()) {
            return;
        }

        const bounds = petWindow.getBounds();
        const cursor = screen.getCursorScreenPoint();
        const inside =
            cursor.x >= bounds.x &&
            cursor.x <= bounds.x + bounds.width &&
            cursor.y >= bounds.y &&
            cursor.y <= bounds.y + bounds.height;

        const clientX = inside ? Math.round(cursor.x - bounds.x) : null;
        const clientY = inside ? Math.round(cursor.y - bounds.y) : null;
        const signature = inside ? `1:${clientX}:${clientY}` : '0';
        if (signature === petCursorTrackingLastSignature) {
            return;
        }
        petCursorTrackingLastSignature = signature;

        petWindow.webContents.send('ailis:pet-cursor-point', {
            inside,
            clientX,
            clientY,
            screenX: cursor.x,
            screenY: cursor.y
        });
    }, PET_CURSOR_TRACK_INTERVAL_MS);
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
        const referenceBounds = canonicalizePetBounds(
            petDialogueCollapsedBounds || petWindow.getBounds()
        );
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

    const restoreBounds = canonicalizePetBounds(
        petDialogueCollapsedBounds || petWindow.getBounds()
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

function persistDesktopState(options = {}) {
    desktopState = saveDesktopState(app, desktopState, options);
    refreshTrayMenu();
}

function resolveDesktopBackendBaseUrl() {
    const envBackendBaseUrl = String(process.env.AILIS_BACKEND_BASE_URL || '').trim();
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
        process.env.AILIS_OPENCLAW_GATEWAY_URL ||
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
    const provider = normalizeLlmProvider(preferences.llmProvider || DEFAULT_LLM_PROVIDER);
    return {
        provider,
        baseUrl: normalizeLlmBaseUrl(
            preferences.llmBaseUrl || getDefaultProviderBaseUrl(provider) || DEFAULT_LLM_BASE_URL
        ),
        model: normalizeLlmModel(
            preferences.llmModel || getDefaultProviderModel(provider) || DEFAULT_LLM_MODEL
        ),
        apiKey: normalizeLlmApiKey(preferences.llmApiKey || ''),
        temperature: normalizeLlmTemperature(
            preferences.llmTemperature ?? DEFAULT_LLM_TEMPERATURE
        ),
        timeoutMs: normalizeLlmRequestTimeoutMs(
            preferences.llmRequestTimeoutMs || DEFAULT_LLM_REQUEST_TIMEOUT_MS
        )
    };
}

function getEnvironmentLlmApiKey(provider = DEFAULT_LLM_PROVIDER) {
    const normalizedProvider = normalizeLlmProvider(provider);
    if (normalizedProvider === 'ollama') {
        return normalizeLlmApiKey(
            process.env.OLLAMA_API_KEY ||
                process.env.AILIS_OLLAMA_API_KEY ||
                ''
        );
    }
    if (normalizedProvider === 'vllm') {
        return normalizeLlmApiKey(
            process.env.VLLM_API_KEY ||
                process.env.AILIS_VLLM_API_KEY ||
                ''
        );
    }
    if (normalizedProvider === 'openai-responses') {
        return normalizeLlmApiKey(
            process.env.OPENAI_API_KEY ||
                process.env.AILIS_OPENAI_API_KEY ||
                ''
        );
    }
    if (normalizedProvider === 'anthropic') {
        return normalizeLlmApiKey(
            process.env.ANTHROPIC_API_KEY ||
                process.env.CLAUDE_API_KEY ||
                process.env.AILIS_ANTHROPIC_API_KEY ||
                ''
        );
    }
    if (normalizedProvider === 'gemini') {
        return normalizeLlmApiKey(
            process.env.GEMINI_API_KEY ||
                process.env.GOOGLE_API_KEY ||
                process.env.GOOGLE_GENERATIVE_AI_API_KEY ||
                process.env.AILIS_GEMINI_API_KEY ||
                ''
        );
    }
    return normalizeLlmApiKey(
        process.env.DOUBAO_API_KEY ||
        process.env.ARK_API_KEY ||
        process.env.VOLCENGINE_API_KEY ||
        process.env.OPENAI_COMPATIBLE_API_KEY ||
        process.env.OPENAI_API_KEY ||
        ''
    );
}

function isLocalLlmProvider(provider = DEFAULT_LLM_PROVIDER) {
    const normalizedProvider = normalizeLlmProvider(provider);
    return normalizedProvider === 'ollama' || normalizedProvider === 'vllm';
}

function getResolvedLlmSettings() {
    const persistedSettings = getPersistedLlmSettings();
    const environmentApiKey = getEnvironmentLlmApiKey(persistedSettings.provider);
    const apiKey = isLocalLlmProvider(persistedSettings.provider)
        ? environmentApiKey
        : persistedSettings.apiKey || environmentApiKey;
    const apiKeySource = apiKey && persistedSettings.apiKey && !isLocalLlmProvider(persistedSettings.provider)
        ? 'saved'
        : apiKey
        ? 'environment'
        : 'none';

    return {
        ...persistedSettings,
        apiKey,
        apiKeySource
    };
}

function buildTemporaryLlmSettings(settings = {}) {
    const provider = normalizeLlmProvider(settings.provider || settings.llmProvider || DEFAULT_LLM_PROVIDER);
    return {
        provider,
        baseUrl: normalizeLlmBaseUrl(
            settings.baseUrl ||
                settings.llmBaseUrl ||
                getDefaultProviderBaseUrl(provider) ||
                DEFAULT_LLM_BASE_URL
        ),
        model: normalizeLlmModel(
            settings.model ||
                settings.llmModel ||
                getDefaultProviderModel(provider) ||
                DEFAULT_LLM_MODEL
        ),
        apiKey: normalizeLlmApiKey(
            settings.apiKey ||
                settings.llmApiKey ||
                getEnvironmentLlmApiKey(provider) ||
                ''
        ),
        temperature: normalizeLlmTemperature(settings.temperature ?? settings.llmTemperature ?? DEFAULT_LLM_TEMPERATURE),
        timeoutMs: normalizeLlmRequestTimeoutMs(
            settings.timeoutMs ||
                settings.requestTimeoutMs ||
                settings.llmRequestTimeoutMs ||
                DEFAULT_LLM_REQUEST_TIMEOUT_MS
        )
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

function getAILISDefaultContext() {
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
        llmRequestTimeoutMs: settings.timeoutMs,
        llmCapabilities: getProviderCapabilities(settings)
    };
}

function detectElevenLabsLanguageFromText(text) {
    const source = String(text || '');
    const kanaCount = (source.match(/[\u3040-\u30ff]/g) || []).length;
    if (kanaCount > 0) {
        return 'ja';
    }

    const cjkCount = (source.match(/[\u3400-\u9fff]/g) || []).length;
    if (cjkCount > 0) {
        return 'zh';
    }

    const latinCount = (source.match(/[A-Za-z]/g) || []).length;
    if (latinCount > 0) {
        return 'en';
    }

    return '';
}

function normalizeRequestedElevenLabsLanguage(payload = {}, preferences = {}) {
    const requestedLanguage = String(
        payload.languageCode || payload.language_code || payload.language || ''
    ).trim().toLowerCase();
    if (ELEVENLABS_LANGUAGE_CODES.includes(requestedLanguage)) {
        return requestedLanguage;
    }

    const detectedLanguage = detectElevenLabsLanguageFromText(payload.text);
    if (detectedLanguage) {
        return detectedLanguage;
    }

    return normalizeElevenLabsLanguageCode(
        preferences.elevenLabsLanguageCode || DEFAULT_ELEVENLABS_LANGUAGE_CODE
    );
}

function getPersistedElevenLabsVoiceProfiles() {
    const preferences = desktopState?.preferences || {};
    return normalizeElevenLabsVoiceProfiles(preferences.elevenLabsVoiceProfiles, preferences);
}

function getPersistedElevenLabsSettings(payload = {}) {
    const preferences = desktopState?.preferences || {};
    const voiceProfiles = getPersistedElevenLabsVoiceProfiles();
    const languageCode = normalizeRequestedElevenLabsLanguage(payload, preferences);
    const selectedProfile = voiceProfiles[languageCode] || voiceProfiles.zh || DEFAULT_ELEVENLABS_VOICE_PROFILES.zh;

    return {
        apiBase: normalizeElevenLabsApiBase(
            preferences.elevenLabsApiBase || DEFAULT_ELEVENLABS_API_BASE
        ),
        apiKey: normalizeElevenLabsApiKey(preferences.elevenLabsApiKey || DEFAULT_ELEVENLABS_API_KEY),
        voiceId: normalizeElevenLabsVoiceId(
            selectedProfile.voiceId || preferences.elevenLabsVoiceId || DEFAULT_ELEVENLABS_VOICE_ID
        ),
        modelId: normalizeElevenLabsModelId(
            selectedProfile.modelId || preferences.elevenLabsModelId || DEFAULT_ELEVENLABS_MODEL_ID
        ),
        languageCode,
        outputFormat: normalizeElevenLabsOutputFormat(
            selectedProfile.outputFormat || preferences.elevenLabsOutputFormat || DEFAULT_ELEVENLABS_OUTPUT_FORMAT
        ),
        timeoutMs: normalizeElevenLabsTimeoutMs(
            preferences.elevenLabsTimeoutMs || DEFAULT_ELEVENLABS_TIMEOUT_MS
        ),
        enableLogging: true,
        optimizeStreamingLatency: normalizeElevenLabsOptimizeStreamingLatency(
            selectedProfile.optimizeStreamingLatency ??
                preferences.elevenLabsOptimizeStreamingLatency ??
                DEFAULT_ELEVENLABS_OPTIMIZE_STREAMING_LATENCY
        ),
        stability: normalizeElevenLabsStability(
            selectedProfile.stability ?? preferences.elevenLabsStability ?? DEFAULT_ELEVENLABS_STABILITY
        ),
        similarityBoost: normalizeElevenLabsSimilarityBoost(
            selectedProfile.similarityBoost ??
                preferences.elevenLabsSimilarityBoost ??
                DEFAULT_ELEVENLABS_SIMILARITY_BOOST
        ),
        style: normalizeElevenLabsStyle(
            selectedProfile.style ?? preferences.elevenLabsStyle ?? DEFAULT_ELEVENLABS_STYLE
        ),
        speed: normalizeElevenLabsSpeed(
            selectedProfile.speed ?? preferences.elevenLabsSpeed ?? DEFAULT_ELEVENLABS_SPEED
        ),
        useSpeakerBoost: normalizeElevenLabsUseSpeakerBoost(
            selectedProfile.useSpeakerBoost ??
                preferences.elevenLabsUseSpeakerBoost ??
                DEFAULT_ELEVENLABS_USE_SPEAKER_BOOST
        ),
        voiceProfiles,
        selectedLanguageCode: languageCode
    };
}

function getRendererElevenLabsPreferences() {
    const settings = getPersistedElevenLabsSettings();
    return {
        elevenLabsApiBase: settings.apiBase,
        elevenLabsVoiceId: settings.voiceId,
        elevenLabsModelId: settings.modelId,
        elevenLabsLanguageCode: settings.languageCode,
        elevenLabsOutputFormat: settings.outputFormat,
        elevenLabsTimeoutMs: settings.timeoutMs,
        elevenLabsOptimizeStreamingLatency: settings.optimizeStreamingLatency,
        elevenLabsStability: settings.stability,
        elevenLabsSimilarityBoost: settings.similarityBoost,
        elevenLabsStyle: settings.style,
        elevenLabsSpeed: settings.speed,
        elevenLabsUseSpeakerBoost: settings.useSpeakerBoost,
        elevenLabsVoiceProfiles: settings.voiceProfiles,
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

function attachAilisMemoryToLlmPayload(payload = {}) {
    if (payload.includeAilisMemory !== true) {
        return payload;
    }
    const messages = Array.isArray(payload.messages) ? payload.messages : [];
    if (!messages.length) {
        return payload;
    }

    let memoryContext = '';
    try {
        memoryContext = ensureAILISGateway().memoryRuntime?.compileContext?.({
            sessionId: payload.sessionId || payload.sessionKey || 'main',
            message: payload.memoryUserMessage || extractLatestUserTextFromLlmPayload(payload),
            messageHistory: payload.messageHistory || []
        }) || '';
    } catch (error) {
        console.warn('[ailis-memory] 直连 LLM 注入记忆失败：', error.message || error);
    }

    if (!memoryContext) {
        return payload;
    }

    const memoryMessage = {
        role: 'system',
        content: [
            '以下是 AILIS 的本地长期记忆上下文，只作为辅助参考。',
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
    const enrichedPayload = attachAilisMemoryToLlmPayload(payload);
    const result = await callDesktopLlmProvider(getResolvedLlmSettings(), enrichedPayload);
    if (payload.includeAilisMemory === true) {
        try {
            ensureAILISGateway().memoryRuntime?.recordTurn?.({
                sessionId: payload.sessionId || payload.sessionKey || 'main',
                userMessage: payload.memoryUserMessage || extractLatestUserTextFromLlmPayload(payload),
                assistantMessage: result?.content || result?.error || '',
                source: payload.memorySource || 'direct_llm',
                result,
                messageHistory: payload.messageHistory || [],
                attachments: payload.memoryAttachments || []
            });
        } catch (error) {
            console.warn('[ailis-memory] 直连 LLM 写入记忆失败：', error.message || error);
        }
    }
    return result;
}

async function callDesktopElevenLabsTts(payload = {}) {
    return synthesizeElevenLabsSpeech(getPersistedElevenLabsSettings(payload), payload);
}

async function callDesktopTts(payload = {}) {
    if (payload?.provider === 'cosyvoice3') {
        const runtime = getVoiceRuntimeBootstrap();
        const summary = runtime.getFastSummary();
        if (!summary.cosyVoice3?.ok) {
            return {
                ok: false,
                provider: 'cosyvoice3',
                code: 'voice_runtime_needs_setup',
                error: `CosyVoice3 本地运行时尚未就绪，需要完成 ${summary.installStepCount || 0} 个安装/修复步骤。`,
                runtimeSetup: summary
            };
        }
        return synthesizeCosyVoice3Speech({}, payload);
    }
    if (payload?.provider && payload.provider !== 'elevenlabs' && payload.provider !== 'server') {
        return {
            ok: false,
            provider: payload.provider,
            code: 'unsupported_tts_provider',
            error: '当前只支持关闭语音、ElevenLabs 和 CosyVoice3。'
        };
    }
    return callDesktopElevenLabsTts(payload);
}

function warmupDesktopSpeechMode(mode, { delayMs = 0 } = {}) {
    const normalizedMode = normalizeSpeechMode(mode);
    const runWarmup = () => {
        if (normalizedMode === 'cosyvoice3') {
            const runtime = getVoiceRuntimeBootstrap();
            const summary = runtime.getFastSummary();
            if (!summary.cosyVoice3?.ok) {
                console.warn(`[cosyvoice3] 本地运行时尚未就绪，需要 ${summary.installStepCount || 0} 个安装/修复步骤。`);
                return;
            }
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
        window.webContents.send('ailis:assistant-event', payload);
    }
}

function broadcastHumanGatewayEvent(payload) {
    if (!payload) {
        return;
    }

    for (const window of getOpenWindows()) {
        window.webContents.send('ailis:gateway-event', payload);
    }
}

function ensureAILISGateway() {
    if (ailisGateway) {
        return ailisGateway;
    }

    ailisGateway = new AILISGateway({
        app,
        projectRoot: getProjectRoot(),
        workspaceRoot: getGatewayWorkspaceRoot(),
        auditDir: getPersistedAILISStateDir(),
        getDefaultContext: () => getAILISDefaultContext(),
        getEmailProfiles: () => getPersistedEmailProfiles(),
        visionServices: {
            permissionPolicy: 'manual',
            getLlmSettings: () => getResolvedLlmSettings(),
            capture: (payload) => captureVisionSnapshotForTool(payload)
        }
    });
    ailisGateway.on('event', (event) => {
        broadcastHumanGatewayEvent(event);
    });
    return ailisGateway;
}

async function ensureAILISGatewayStarted(reason = 'manual') {
    const gateway = ensureAILISGateway();
    if (gateway.getStatus().running) {
        return gateway.getStatus();
    }
    if (!ailisGatewayStartPromise) {
        ailisGatewayStartPromise = gateway.start()
            .catch((error) => {
                console.warn(`[ailis-gateway] ${reason} 启动失败：`, error.message || error);
                throw error;
            })
            .finally(() => {
                ailisGatewayStartPromise = null;
            });
    }
    return ailisGatewayStartPromise;
}

async function getAILISGatewayStatusEnsuringStarted(reason = 'status') {
    try {
        return await ensureAILISGatewayStarted(reason);
    } catch (error) {
        return {
            ...ensureAILISGateway().getStatus(),
            startError: error?.message || String(error)
        };
    }
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
    status.humanGateway = ensureAILISGateway().getStatus();

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
        conversationMode: normalizeConversationMode(
            desktopState?.preferences?.conversationMode || DEFAULT_CONVERSATION_MODE
        ),
        preferredMicDeviceId: normalizePreferredMicDeviceId(desktopState?.preferences?.preferredMicDeviceId),
        backendBaseUrl: resolveDesktopBackendBaseUrl(),
        backendMode: resolveDesktopBackendMode(),
        openclawGatewayUrl: resolveOpenClawGatewayUrl(),
        ailisStateDir: normalizeAILISStateDir(desktopState?.preferences?.ailisStateDir),
        ailisResolvedStateDir: getPersistedAILISStateDir(),
        ailisDefaultStateDir: getDefaultAILISStateDir(),
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
        renderProfileId: normalizeRenderProfileId(
            desktopState?.preferences?.renderProfileId || DEFAULT_RENDER_PROFILE_ID
        ),
        renderLightYawDeg: normalizeRenderLightYawDeg(
            desktopState?.preferences?.renderLightYawDeg ?? DEFAULT_RENDER_LIGHT_YAW_DEG
        ),
        renderKeyLightScale: normalizeRenderKeyLightScale(
            desktopState?.preferences?.renderKeyLightScale ?? DEFAULT_RENDER_KEY_LIGHT_SCALE
        ),
        renderAmbientFillScale: normalizeRenderAmbientFillScale(
            desktopState?.preferences?.renderAmbientFillScale ?? DEFAULT_RENDER_AMBIENT_FILL_SCALE
        ),
        renderOutlineScale: normalizeRenderOutlineScale(
            desktopState?.preferences?.renderOutlineScale ?? DEFAULT_RENDER_OUTLINE_SCALE
        ),
        renderShadowEnabled: normalizeRenderShadowEnabled(
            desktopState?.preferences?.renderShadowEnabled ?? DEFAULT_RENDER_SHADOW_ENABLED
        ),
        renderResolutionScale: normalizeRenderResolutionScale(
            desktopState?.preferences?.renderResolutionScale ?? DEFAULT_RENDER_RESOLUTION_SCALE
        ),
        renderFpsLimit: normalizeRenderFpsLimit(
            desktopState?.preferences?.renderFpsLimit ?? DEFAULT_RENDER_FPS_LIMIT
        ),
        renderShadowQuality: normalizeRenderShadowQuality(
            desktopState?.preferences?.renderShadowQuality ?? DEFAULT_RENDER_SHADOW_QUALITY
        ),
        renderOutlineEnabled: normalizeRenderOutlineEnabled(
            desktopState?.preferences?.renderOutlineEnabled ?? DEFAULT_RENDER_OUTLINE_ENABLED
        ),
        renderAntialiasEnabled: normalizeRenderAntialiasEnabled(
            desktopState?.preferences?.renderAntialiasEnabled ?? DEFAULT_RENDER_ANTIALIAS_ENABLED
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
        chunkedTtsEnabled: normalizeChunkedTtsEnabled(
            desktopState?.preferences?.chunkedTtsEnabled ?? DEFAULT_CHUNKED_TTS_ENABLED
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
        ),
        petMouseHitTestEnabled: normalizePetMouseHitTestEnabled(
            desktopState?.preferences?.petMouseHitTestEnabled
        ),
        petMouseHitTestShape: normalizePetMouseHitTestShape(
            desktopState?.preferences?.petMouseHitTestShape
        ),
        petMouseHitTestWidthRatio: normalizePetMouseHitTestWidthRatio(
            desktopState?.preferences?.petMouseHitTestWidthRatio
        ),
        petMouseHitTestHeightRatio: normalizePetMouseHitTestHeightRatio(
            desktopState?.preferences?.petMouseHitTestHeightRatio
        ),
        petMouseHitTestOffsetXRatio: normalizePetMouseHitTestOffsetXRatio(
            desktopState?.preferences?.petMouseHitTestOffsetXRatio
        ),
        petMouseHitTestOffsetYRatio: normalizePetMouseHitTestOffsetYRatio(
            desktopState?.preferences?.petMouseHitTestOffsetYRatio
        ),
        petMouseHitTestDebug: normalizePetMouseHitTestDebug(
            desktopState?.preferences?.petMouseHitTestDebug
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
            conversationModeOptions: CONVERSATION_MODE_OPTIONS,
            backendModeOptions: BACKEND_MODE_OPTIONS,
            llmProviderOptions: LLM_PROVIDER_OPTIONS,
            llmProviderDefaultBaseUrls: LLM_PROVIDER_DEFAULT_BASE_URLS,
            llmProviderDefaultModels: LLM_PROVIDER_DEFAULT_MODELS,
            llmProviderCapabilities: Object.fromEntries(
                LLM_PROVIDER_OPTIONS.map((provider) => [
                    provider,
                    getProviderCapabilities({
                        provider,
                        model: getDefaultProviderModel(provider)
                    })
                ])
            ),
            renderProfileOptions: RENDER_PROFILE_OPTIONS,
            emailProviderOptions: EMAIL_PROVIDER_OPTIONS
        },
        assistant: {
            selectedBackendMode: 'ailis',
            humanGateway: ensureAILISGateway().getStatus(),
            toolSurface: getOpenClawToolSurfaceSummary(),
            toolSurfaceValidation: validateOpenClawToolSurface().summary
        },
        voiceRuntime: getVoiceRuntimeBootstrap().getFastSummary(),
        vllmRuntime: getVllmLocalDeployer().getStatus(),
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

    petWindow?.webContents.send('ailis:preferences-updated', payload);
    chatWindow?.webContents.send('ailis:preferences-updated', payload);
    controlWindow?.webContents.send('ailis:preferences-updated', payload);
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

function hookRendererDiagnostics(window, label) {
    const webContents = window?.webContents;
    if (!webContents || webContents.__ailisDiagnosticsHooked) {
        return;
    }

    webContents.__ailisDiagnosticsHooked = true;
    webContents.on('console-message', (_event, level, message, line, sourceId) => {
        console.log(`[renderer:${label}] console(${level}) ${message} (${sourceId || 'unknown'}:${line || 0})`);
    });
    webContents.on('did-fail-load', (_event, errorCode, errorDescription, validatedURL) => {
        console.error(`[renderer:${label}] did-fail-load ${errorCode}: ${errorDescription} ${validatedURL || ''}`);
    });
    webContents.on('render-process-gone', (_event, details = {}) => {
        console.error(`[renderer:${label}] render-process-gone`, details);
    });
    webContents.on('unresponsive', () => {
        console.error(`[renderer:${label}] unresponsive`);
    });
    webContents.on('dom-ready', () => {
        console.log(`[renderer:${label}] dom-ready`);
    });
    webContents.on('did-finish-load', () => {
        console.log(`[renderer:${label}] did-finish-load ${webContents.getURL()}`);
    });
}

function hookWindowContextMenu(window, label) {
    const webContents = window?.webContents;
    if (!webContents || webContents.__ailisContextMenuHooked) {
        return;
    }

    webContents.__ailisContextMenuHooked = true;
    webContents.on('context-menu', (event, params = {}) => {
        const sourceWindow = BrowserWindow.fromWebContents(webContents) || window;
        const inputFieldType = String(params.inputFieldType || 'none');
        const isEditable = Boolean(params.isEditable || inputFieldType !== 'none');
        const hasSelection = Boolean(String(params.selectionText || '').trim());

        if (isEditable || hasSelection) {
            event.preventDefault();
            showTextEditMenu(sourceWindow, {
                isEditable,
                hasSelection,
                editFlags: params.editFlags || {}
            });
            return;
        }

        if (label === 'chat') {
            event.preventDefault();
            showControlMenu(sourceWindow);
        }
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
        createControlWindow({ showWhenReady: true });
        return true;
    }

    controlWindow.__ailisShowWhenReady = true;
    const isControlLoaded = Boolean(controlWindow.__ailisDidFinishLoad);
    if (!controlWindow.isVisible() && isControlLoaded) {
        controlWindow.show();
    }

    if (isControlLoaded) {
        controlWindow.focus();
    } else {
        controlWindowLoadPromise?.then(() => {
            if (!controlWindow || controlWindow.isDestroyed()) {
                return;
            }
            if (controlWindow.__ailisShowWhenReady && !controlWindow.isVisible()) {
                controlWindow.show();
            }
            controlWindow.focus();
        }).catch((error) => {
            console.error('[window] 控制面板延迟显示失败：', error);
        });
    }
    return true;
}

function showAgentLabWindow() {
    if (!agentLabWindow) {
        createAgentLabWindow({ showWhenReady: true });
        return true;
    }

    agentLabWindow.__ailisShowWhenReady = true;
    const isLoaded = Boolean(agentLabWindow.__ailisDidFinishLoad);
    if (!agentLabWindow.isVisible() && isLoaded) {
        agentLabWindow.show();
    }

    if (isLoaded) {
        agentLabWindow.focus();
    } else {
        agentLabWindowLoadPromise?.then(() => {
            if (!agentLabWindow || agentLabWindow.isDestroyed()) {
                return;
            }
            if (agentLabWindow.__ailisShowWhenReady && !agentLabWindow.isVisible()) {
                agentLabWindow.show();
            }
            agentLabWindow.focus();
        }).catch((error) => {
            console.error('[window] Agent 分析台延迟显示失败：', error);
        });
    }
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
        conversationMode: rendererPreferences.conversationMode,
        preferredMicDeviceId: rendererPreferences.preferredMicDeviceId,
        backendBaseUrl: resolveDesktopBackendBaseUrl(),
        backendMode: rendererPreferences.backendMode,
        openclawGatewayUrl: rendererPreferences.openclawGatewayUrl,
        ailisStateDir: rendererPreferences.ailisStateDir,
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
        elevenLabsLanguageCode: currentElevenLabsSettings.languageCode,
        elevenLabsOutputFormat: currentElevenLabsSettings.outputFormat,
        elevenLabsTimeoutMs: currentElevenLabsSettings.timeoutMs,
        elevenLabsOptimizeStreamingLatency: currentElevenLabsSettings.optimizeStreamingLatency,
        elevenLabsStability: currentElevenLabsSettings.stability,
        elevenLabsSimilarityBoost: currentElevenLabsSettings.similarityBoost,
        elevenLabsStyle: currentElevenLabsSettings.style,
        elevenLabsSpeed: currentElevenLabsSettings.speed,
        elevenLabsUseSpeakerBoost: currentElevenLabsSettings.useSpeakerBoost,
        elevenLabsVoiceProfiles: currentElevenLabsSettings.voiceProfiles,
        computerControlEnabled: rendererPreferences.computerControlEnabled,
        emailProfiles: getPersistedEmailProfiles(),
        cameraDistance: rendererPreferences.cameraDistance,
        cameraHeight: rendererPreferences.cameraHeight,
        cameraTargetY: rendererPreferences.cameraTargetY,
        renderProfileId: rendererPreferences.renderProfileId,
        desktopNativeTtsRate: rendererPreferences.desktopNativeTtsRate,
        desktopNativeTtsPitch: rendererPreferences.desktopNativeTtsPitch,
        desktopNativeTtsVolume: rendererPreferences.desktopNativeTtsVolume,
        chunkedTtsEnabled: rendererPreferences.chunkedTtsEnabled,
        autoChatEnabled: rendererPreferences.autoChatEnabled,
        autoChatMinIntervalSec: rendererPreferences.autoChatMinIntervalSec,
        autoChatMaxIntervalSec: rendererPreferences.autoChatMaxIntervalSec,
        avatarDialogueBubbleLeft: rendererPreferences.avatarDialogueBubbleLeft,
        avatarDialogueBubbleTop: rendererPreferences.avatarDialogueBubbleTop,
        avatarDialogueBubbleScale: rendererPreferences.avatarDialogueBubbleScale,
        avatarDialogueBubbleExtraWidth: rendererPreferences.avatarDialogueBubbleExtraWidth,
        avatarDialogueBubbleExtraTop: rendererPreferences.avatarDialogueBubbleExtraTop,
        petMouseHitTestEnabled: rendererPreferences.petMouseHitTestEnabled,
        petMouseHitTestShape: rendererPreferences.petMouseHitTestShape,
        petMouseHitTestWidthRatio: rendererPreferences.petMouseHitTestWidthRatio,
        petMouseHitTestHeightRatio: rendererPreferences.petMouseHitTestHeightRatio,
        petMouseHitTestOffsetXRatio: rendererPreferences.petMouseHitTestOffsetXRatio,
        petMouseHitTestOffsetYRatio: rendererPreferences.petMouseHitTestOffsetYRatio,
        petMouseHitTestDebug: rendererPreferences.petMouseHitTestDebug
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
    if ('conversationMode' in partialPreferences) {
        nextPreferences.conversationMode = normalizeConversationMode(partialPreferences.conversationMode);
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
    if ('ailisStateDir' in partialPreferences) {
        nextPreferences.ailisStateDir = normalizeAILISStateDir(partialPreferences.ailisStateDir);
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
    if ('elevenLabsLanguageCode' in partialPreferences) {
        nextPreferences.elevenLabsLanguageCode = normalizeElevenLabsLanguageCode(
            partialPreferences.elevenLabsLanguageCode
        );
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
    if ('elevenLabsOptimizeStreamingLatency' in partialPreferences) {
        nextPreferences.elevenLabsOptimizeStreamingLatency = normalizeElevenLabsOptimizeStreamingLatency(
            partialPreferences.elevenLabsOptimizeStreamingLatency
        );
    }
    if ('elevenLabsStability' in partialPreferences) {
        nextPreferences.elevenLabsStability = normalizeElevenLabsStability(partialPreferences.elevenLabsStability);
    }
    if ('elevenLabsSimilarityBoost' in partialPreferences) {
        nextPreferences.elevenLabsSimilarityBoost = normalizeElevenLabsSimilarityBoost(
            partialPreferences.elevenLabsSimilarityBoost
        );
    }
    if ('elevenLabsStyle' in partialPreferences) {
        nextPreferences.elevenLabsStyle = normalizeElevenLabsStyle(partialPreferences.elevenLabsStyle);
    }
    if ('elevenLabsSpeed' in partialPreferences) {
        nextPreferences.elevenLabsSpeed = normalizeElevenLabsSpeed(partialPreferences.elevenLabsSpeed);
    }
    if ('elevenLabsUseSpeakerBoost' in partialPreferences) {
        nextPreferences.elevenLabsUseSpeakerBoost = normalizeElevenLabsUseSpeakerBoost(
            partialPreferences.elevenLabsUseSpeakerBoost
        );
    }
    if ('elevenLabsVoiceProfiles' in partialPreferences) {
        nextPreferences.elevenLabsVoiceProfiles = normalizeElevenLabsVoiceProfiles(
            partialPreferences.elevenLabsVoiceProfiles,
            nextPreferences
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
    if (
        'elevenLabsVoiceId' in partialPreferences ||
        'elevenLabsModelId' in partialPreferences ||
        'elevenLabsLanguageCode' in partialPreferences ||
        'elevenLabsOutputFormat' in partialPreferences ||
        'elevenLabsOptimizeStreamingLatency' in partialPreferences ||
        'elevenLabsStability' in partialPreferences ||
        'elevenLabsSimilarityBoost' in partialPreferences ||
        'elevenLabsStyle' in partialPreferences ||
        'elevenLabsSpeed' in partialPreferences ||
        'elevenLabsUseSpeakerBoost' in partialPreferences ||
        'elevenLabsVoiceProfiles' in partialPreferences
    ) {
        const activeLanguageCode = normalizeElevenLabsLanguageCode(nextPreferences.elevenLabsLanguageCode);
        const nextProfiles = normalizeElevenLabsVoiceProfiles(nextPreferences.elevenLabsVoiceProfiles, nextPreferences);
        nextProfiles[activeLanguageCode] = {
            ...nextProfiles[activeLanguageCode],
            voiceId: normalizeElevenLabsVoiceId(nextPreferences.elevenLabsVoiceId),
            modelId: normalizeElevenLabsModelId(nextPreferences.elevenLabsModelId),
            languageCode: activeLanguageCode,
            outputFormat: normalizeElevenLabsOutputFormat(nextPreferences.elevenLabsOutputFormat),
            optimizeStreamingLatency: normalizeElevenLabsOptimizeStreamingLatency(
                nextPreferences.elevenLabsOptimizeStreamingLatency
            ),
            stability: normalizeElevenLabsStability(nextPreferences.elevenLabsStability),
            similarityBoost: normalizeElevenLabsSimilarityBoost(nextPreferences.elevenLabsSimilarityBoost),
            style: normalizeElevenLabsStyle(nextPreferences.elevenLabsStyle),
            speed: normalizeElevenLabsSpeed(nextPreferences.elevenLabsSpeed),
            useSpeakerBoost: normalizeElevenLabsUseSpeakerBoost(nextPreferences.elevenLabsUseSpeakerBoost)
        };
        nextPreferences.elevenLabsVoiceProfiles = normalizeElevenLabsVoiceProfiles(nextProfiles, nextPreferences);
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
    if ('renderProfileId' in partialPreferences) {
        nextPreferences.renderProfileId = normalizeRenderProfileId(partialPreferences.renderProfileId);
    }
    if ('renderLightYawDeg' in partialPreferences) {
        nextPreferences.renderLightYawDeg = normalizeRenderLightYawDeg(partialPreferences.renderLightYawDeg);
    }
    if ('renderKeyLightScale' in partialPreferences) {
        nextPreferences.renderKeyLightScale = normalizeRenderKeyLightScale(partialPreferences.renderKeyLightScale);
    }
    if ('renderAmbientFillScale' in partialPreferences) {
        nextPreferences.renderAmbientFillScale = normalizeRenderAmbientFillScale(
            partialPreferences.renderAmbientFillScale
        );
    }
    if ('renderOutlineScale' in partialPreferences) {
        nextPreferences.renderOutlineScale = normalizeRenderOutlineScale(partialPreferences.renderOutlineScale);
    }
    if ('renderShadowEnabled' in partialPreferences) {
        nextPreferences.renderShadowEnabled = normalizeRenderShadowEnabled(partialPreferences.renderShadowEnabled);
    }
    if ('renderResolutionScale' in partialPreferences) {
        nextPreferences.renderResolutionScale = normalizeRenderResolutionScale(partialPreferences.renderResolutionScale);
    }
    if ('renderFpsLimit' in partialPreferences) {
        nextPreferences.renderFpsLimit = normalizeRenderFpsLimit(partialPreferences.renderFpsLimit);
    }
    if ('renderShadowQuality' in partialPreferences) {
        nextPreferences.renderShadowQuality = normalizeRenderShadowQuality(partialPreferences.renderShadowQuality);
    }
    if ('renderOutlineEnabled' in partialPreferences) {
        nextPreferences.renderOutlineEnabled = normalizeRenderOutlineEnabled(partialPreferences.renderOutlineEnabled);
    }
    if ('renderAntialiasEnabled' in partialPreferences) {
        nextPreferences.renderAntialiasEnabled = normalizeRenderAntialiasEnabled(partialPreferences.renderAntialiasEnabled);
    }
    delete nextPreferences.renderShadowStrength;
    delete nextPreferences.renderShadowRange;
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
    if ('chunkedTtsEnabled' in partialPreferences) {
        nextPreferences.chunkedTtsEnabled = normalizeChunkedTtsEnabled(partialPreferences.chunkedTtsEnabled);
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
    if ('petMouseHitTestEnabled' in partialPreferences) {
        nextPreferences.petMouseHitTestEnabled = normalizePetMouseHitTestEnabled(
            partialPreferences.petMouseHitTestEnabled
        );
    }
    if ('petMouseHitTestShape' in partialPreferences) {
        nextPreferences.petMouseHitTestShape = normalizePetMouseHitTestShape(
            partialPreferences.petMouseHitTestShape
        );
    }
    if ('petMouseHitTestWidthRatio' in partialPreferences) {
        nextPreferences.petMouseHitTestWidthRatio = normalizePetMouseHitTestWidthRatio(
            partialPreferences.petMouseHitTestWidthRatio
        );
    }
    if ('petMouseHitTestHeightRatio' in partialPreferences) {
        nextPreferences.petMouseHitTestHeightRatio = normalizePetMouseHitTestHeightRatio(
            partialPreferences.petMouseHitTestHeightRatio
        );
    }
    if ('petMouseHitTestOffsetXRatio' in partialPreferences) {
        nextPreferences.petMouseHitTestOffsetXRatio = normalizePetMouseHitTestOffsetXRatio(
            partialPreferences.petMouseHitTestOffsetXRatio
        );
    }
    if ('petMouseHitTestOffsetYRatio' in partialPreferences) {
        nextPreferences.petMouseHitTestOffsetYRatio = normalizePetMouseHitTestOffsetYRatio(
            partialPreferences.petMouseHitTestOffsetYRatio
        );
    }
    if ('petMouseHitTestDebug' in partialPreferences) {
        nextPreferences.petMouseHitTestDebug = normalizePetMouseHitTestDebug(
            partialPreferences.petMouseHitTestDebug
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
    const ailisStateDirChanged =
        resolveAILISStateDir(nextPreferences.ailisStateDir) !== rendererPreferences.ailisResolvedStateDir;

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

    const allowBlankCredentials = [];
    if (partialPreferences.llmApiKeyAction === 'clear') {
        allowBlankCredentials.push('llmApiKey');
    }
    if (partialPreferences.elevenLabsApiKeyAction === 'clear') {
        allowBlankCredentials.push('elevenLabsApiKey');
    }
    for (const [providerId, profile] of Object.entries(partialPreferences.emailProfiles || {})) {
        if (profile?.secretAction === 'clear') {
            allowBlankCredentials.push(`emailProfiles.${providerId}.secret`);
        }
    }

    persistDesktopState({ allowBlankCredentials });
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

    if (ailisStateDirChanged && ailisGateway) {
        const oldGateway = ailisGateway;
        ailisGateway = null;
        ailisGatewayStartPromise = null;
        void oldGateway.stop()
            .catch((error) => {
                console.warn('[ailis-gateway] 状态目录切换时关闭旧 Gateway 失败：', error.message || error);
            })
            .finally(() => {
                void ensureAILISGatewayStarted('state_dir_changed').catch((error) => {
                    console.warn('[ailis-gateway] 状态目录切换后启动失败：', error.message || error);
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
    if (mode === 'off') {
        return '关闭语音';
    }
    if (mode === 'server') {
        return 'ElevenLabs 云端语音';
    }
    if (mode === 'cosyvoice3') {
        return 'CosyVoice3 本地高质量';
    }
    return '关闭语音';
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

function buildTextEditMenuTemplate({ isEditable = false, hasSelection = false, editFlags = {} } = {}) {
    const editable = Boolean(isEditable);
    const selection = Boolean(hasSelection);
    const flags = editFlags && typeof editFlags === 'object' ? editFlags : {};
    const hasFlag = (key, fallback) => (
        Object.prototype.hasOwnProperty.call(flags, key)
            ? Boolean(flags[key])
            : fallback
    );
    const template = [];

    if (editable) {
        template.push(
            { label: '撤销', role: 'undo', enabled: hasFlag('canUndo', true) },
            { label: '重做', role: 'redo', enabled: hasFlag('canRedo', true) },
            { type: 'separator' },
            { label: '剪切', role: 'cut', enabled: hasFlag('canCut', selection) },
            { label: '复制', role: 'copy', enabled: hasFlag('canCopy', selection) },
            { label: '粘贴', role: 'paste', enabled: hasFlag('canPaste', true) }
        );
    } else {
        template.push({
            label: '复制',
            role: 'copy',
            enabled: hasFlag('canCopy', selection)
        });
    }

    template.push(
        { type: 'separator' },
        { label: '全选', role: 'selectAll', enabled: hasFlag('canSelectAll', true) }
    );

    return template;
}

function showTextEditMenu(targetWindow, context = {}) {
    if (!targetWindow || targetWindow.isDestroyed()) {
        return false;
    }

    const menu = Menu.buildFromTemplate(buildTextEditMenuTemplate(context));
    menu.popup({ window: targetWindow });
    return true;
}

function createPetWindow() {
    const petState = desktopState.petWindow;
    const petBounds = canonicalizePetBounds(petState.bounds);
    desktopState.petWindow.bounds = petBounds;
    persistDesktopState();

    console.log('[window:pet] create', {
        bounds: petBounds,
        visible: Boolean(petState.visible),
        skipTaskbar: desktopState.preferences.petSkipTaskbar
    });
    petWindow = desktopPlatformAdapter.createWindow({
        bounds: petBounds,
        frame: false,
        transparent: true,
        backgroundColor: '#00000000',
        hasShadow: false,
        resizable: false,
        movable: true,
        alwaysOnTop: true,
        skipTaskbar: desktopState.preferences.petSkipTaskbar,
        show: Boolean(petState.visible),
        title: 'AILIS Pet'
    });

    desktopPlatformAdapter.applyWindowBehavior(petWindow, {
        alwaysOnTop: true,
        alwaysOnTopLevel: 'screen-saver',
        visibleOnAllWorkspaces: true,
        visibleOnFullScreen: true
    });
    openExternalLinks(petWindow);
    hookRendererDiagnostics(petWindow, 'pet');
    hookWindowPersistence('petWindow', petWindow);

    petWindow.on('close', (event) => {
        console.log('[window:pet] close', { isQuitting });
        if (isQuitting) {
            return;
        }
        event.preventDefault();
        petWindow.hide();
        hideChatWindow();
    });

    petWindow.on('closed', () => {
        console.log('[window:pet] closed');
        petWindow = null;
        petDialogueCollapsedBounds = null;
        petDialogueExpanded = false;
        petDialogueExtraTop = 0;
        petDialogueExtraWidth = 0;
        petDialogueBoundsMutation = false;
        clearTimeout(petDialogueBoundsMutationTimer);
        petDialogueBoundsMutationTimer = null;
        petMousePassthroughEnabled = false;
        petDragState = null;
        stopPetCursorTracking();
    });

    void loadWindowContent(petWindow, 'pet.html').catch((error) => {
        console.error('[window] 桌宠窗口加载失败：', error);
    });
    setPetMousePassthrough(true, { force: true });
    startPetCursorTracking();
    if (!desktopState.petWindow.visible) {
        petWindow.hide();
    }
}

function createChatWindow() {
    const chatState = desktopState.chatWindow;
    const chatBounds = clampBoundsToDisplay(chatState.bounds, CHAT_MIN_WIDTH, CHAT_MIN_HEIGHT);

    chatWindow = desktopPlatformAdapter.createWindow({
        bounds: chatBounds,
        frame: false,
        transparent: false,
        backgroundColor: '#f8fbff',
        hasShadow: true,
        resizable: true,
        show: false,
        skipTaskbar: false,
        alwaysOnTop: true,
        title: 'AILIS Chat'
    });

    openExternalLinks(chatWindow);
    hookRendererDiagnostics(chatWindow, 'chat');
    hookWindowContextMenu(chatWindow, 'chat');
    hookWindowPersistence('chatWindow', chatWindow);

    chatWindow.on('close', (event) => {
        console.log('[window:chat] close', { isQuitting });
        if (isQuitting) {
            return;
        }
        event.preventDefault();
        chatWindow.hide();
    });

    chatWindow.on('closed', () => {
        console.log('[window:chat] closed');
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

function createControlWindow(options = {}) {
    const controlState = desktopState.controlWindow;
    const controlBounds = clampBoundsToDisplay(
        controlState.bounds,
        CONTROL_MIN_WIDTH,
        CONTROL_MIN_HEIGHT
    );
    const showWhenReady = Boolean(options.showWhenReady || controlState.visible);

    controlWindow = desktopPlatformAdapter.createWindow({
        bounds: controlBounds,
        minWidth: CONTROL_MIN_WIDTH,
        minHeight: CONTROL_MIN_HEIGHT,
        frame: false,
        transparent: false,
        backgroundColor: '#f4f6f8',
        hasShadow: true,
        resizable: true,
        show: false,
        skipTaskbar: false,
        title: 'AILIS Control Panel'
    });
    controlWindow.__ailisDidFinishLoad = false;
    controlWindow.__ailisShowWhenReady = showWhenReady;
    console.log('[window:control] create', {
        bounds: controlBounds,
        showWhenReady
    });

    openExternalLinks(controlWindow);
    hookRendererDiagnostics(controlWindow, 'control');
    hookWindowContextMenu(controlWindow, 'control');
    hookWindowPersistence('controlWindow', controlWindow);

    controlWindow.on('close', (event) => {
        console.log('[window:control] close', { isQuitting });
        if (isQuitting) {
            return;
        }
        event.preventDefault();
        controlWindow.hide();
    });

    controlWindow.on('closed', () => {
        console.log('[window:control] closed');
        controlWindow = null;
        controlWindowLoadPromise = null;
    });

    controlWindowLoadPromise = loadWindowContent(controlWindow, 'control.html')
        .then(() => {
            if (!controlWindow || controlWindow.isDestroyed()) {
                return;
            }
            controlWindow.__ailisDidFinishLoad = true;
            if (controlWindow.__ailisShowWhenReady) {
                controlWindow.show();
                controlWindow.focus();
            }
        })
        .catch((error) => {
            console.error('[window] 控制面板加载失败：', error);
        });
}

function createAgentLabWindow(options = {}) {
    const display = screen.getPrimaryDisplay();
    const workArea = display.workArea;
    const width = Math.min(Math.max(1280, AGENT_LAB_MIN_WIDTH), Math.max(AGENT_LAB_MIN_WIDTH, workArea.width - 48));
    const height = Math.min(Math.max(840, AGENT_LAB_MIN_HEIGHT), Math.max(AGENT_LAB_MIN_HEIGHT, workArea.height - 48));
    const bounds = clampBoundsToDisplay(
        {
            x: Math.round(workArea.x + (workArea.width - width) / 2),
            y: Math.round(workArea.y + (workArea.height - height) / 2),
            width,
            height
        },
        AGENT_LAB_MIN_WIDTH,
        AGENT_LAB_MIN_HEIGHT
    );
    const showWhenReady = Boolean(options.showWhenReady);

    agentLabWindow = desktopPlatformAdapter.createWindow({
        bounds,
        minWidth: AGENT_LAB_MIN_WIDTH,
        minHeight: AGENT_LAB_MIN_HEIGHT,
        frame: false,
        transparent: false,
        backgroundColor: '#0f172a',
        hasShadow: true,
        resizable: true,
        show: false,
        skipTaskbar: false,
        title: 'AILIS Agent Analysis Lab'
    });
    agentLabWindow.__ailisDidFinishLoad = false;
    agentLabWindow.__ailisShowWhenReady = showWhenReady;
    console.log('[window:agent-lab] create', {
        bounds,
        showWhenReady
    });

    openExternalLinks(agentLabWindow);
    hookRendererDiagnostics(agentLabWindow, 'agent-lab');
    hookWindowContextMenu(agentLabWindow, 'agent-lab');

    agentLabWindow.on('close', (event) => {
        console.log('[window:agent-lab] close', { isQuitting });
        if (isQuitting) {
            return;
        }
        event.preventDefault();
        agentLabWindow.hide();
    });

    agentLabWindow.on('closed', () => {
        console.log('[window:agent-lab] closed');
        agentLabWindow = null;
        agentLabWindowLoadPromise = null;
    });

    agentLabWindowLoadPromise = loadWindowContent(agentLabWindow, 'agent-lab.html')
        .then(() => {
            if (!agentLabWindow || agentLabWindow.isDestroyed()) {
                return;
            }
            agentLabWindow.__ailisDidFinishLoad = true;
            if (agentLabWindow.__ailisShowWhenReady) {
                agentLabWindow.show();
                agentLabWindow.focus();
            }
        })
        .catch((error) => {
            console.error('[window] Agent 分析台加载失败：', error);
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
    tray.setToolTip('AILIS 桌宠');
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

async function chooseAILISStateDir() {
    const result = await dialog.showOpenDialog(controlWindow || BrowserWindow.getFocusedWindow() || petWindow, {
        title: '选择 AILIS 本地状态目录',
        defaultPath: getPersistedAILISStateDir(),
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

async function chooseChatFiles(sourceWindow = null) {
    const result = await dialog.showOpenDialog(sourceWindow || chatWindow || BrowserWindow.getFocusedWindow() || petWindow, {
        title: '选择要交给 AILIS 的文件',
        properties: ['openFile', 'multiSelections'],
        filters: [
            { name: '所有文件', extensions: ['*'] }
        ]
    });
    if (result.canceled || !result.filePaths?.length) {
        return {
            ok: false,
            canceled: true,
            files: []
        };
    }
    return describeChatFilePaths(result.filePaths);
}

function registerIpc() {
    ipcMain.on('ailis:get-preferences-sync', (event) => {
        event.returnValue = getRendererPreferences();
    });

    ipcMain.handle('ailis:get-control-panel-state', () => getControlPanelState());
    ipcMain.handle('ailis:save-preferences', (_event, payload = {}) => applyPreferencesPatch(payload));
    ipcMain.handle('ailis:restore-default-preferences', () => restoreDefaultPreferences());
    ipcMain.handle('ailis:choose-ailis-state-dir', () => chooseAILISStateDir());
    ipcMain.handle('ailis:chat-files-choose', (event) =>
        chooseChatFiles(BrowserWindow.fromWebContents(event.sender))
    );
    ipcMain.handle('ailis:chat-files-describe', async (_event, payload = {}) =>
        describeChatFilePaths(payload?.paths || payload?.filePaths || [])
    );
    ipcMain.handle('ailis:toggle-chat-window', () => toggleChatWindow());
    ipcMain.handle('ailis:show-chat-window', () => {
        showChatWindow();
        return true;
    });
    ipcMain.handle('ailis:hide-chat-window', () => {
        hideChatWindow();
        return false;
    });
    ipcMain.handle('ailis:show-control-panel', () => showControlPanel());
    ipcMain.handle('ailis:show-agent-lab', () => showAgentLabWindow());
    ipcMain.handle('ailis:show-control-menu', (event) => {
        const sourceWindow = BrowserWindow.fromWebContents(event.sender);
        return showControlMenu(sourceWindow || petWindow);
    });
    ipcMain.handle('ailis:show-text-edit-menu', (event, payload = {}) => {
        const sourceWindow = BrowserWindow.fromWebContents(event.sender);
        return showTextEditMenu(sourceWindow || BrowserWindow.getFocusedWindow(), payload || {});
    });
    ipcMain.handle('ailis:close-current-window', (event) => {
        const sourceWindow = BrowserWindow.fromWebContents(event.sender);
        sourceWindow?.hide();
        return true;
    });
    ipcMain.handle('ailis:set-speech-mode', (_event, mode) => updateSpeechMode(mode));
    ipcMain.handle('ailis:set-recognition-mode', (_event, mode) => updateRecognitionMode(mode));
    ipcMain.handle('ailis:set-preferred-mic-device', (_event, deviceId) => updatePreferredMicDevice(deviceId));
    ipcMain.handle('ailis:voice-runtime-diagnose', async () =>
        getVoiceRuntimeBootstrap().diagnose()
    );
    ipcMain.handle('ailis:voice-runtime-status', async () =>
        getVoiceRuntimeBootstrap().getBootstrapStatus()
    );
    ipcMain.handle('ailis:voice-runtime-bootstrap', async (_event, payload = {}) =>
        bootstrapVoiceRuntime(payload || {})
    );
    ipcMain.handle('ailis:set-pet-dialogue-expanded', (_event, payload = {}) =>
        setPetDialogueWindowExpanded(
            Boolean(payload.expanded),
            payload.extraTop,
            payload.extraWidth
        )
    );
    ipcMain.handle('ailis:vision-capture', async (event, payload = {}) =>
        captureVisionSnapshot(event, payload)
    );
    ipcMain.handle('ailis:llm-health-check', async (_event, payload = {}) => {
        const currentSettings = getResolvedLlmSettings();
        const incomingSettings = payload?.settings || {};
        const incomingProvider = normalizeLlmProvider(
            incomingSettings.provider ||
                incomingSettings.llmProvider ||
                currentSettings.provider
        );
        const incomingApiKey = normalizeLlmApiKey(
            incomingSettings.apiKey ||
                incomingSettings.llmApiKey ||
                ''
        );
        const fallbackApiKey = isLocalLlmProvider(incomingProvider)
            ? getEnvironmentLlmApiKey(incomingProvider)
            : currentSettings.apiKey;
        const settings = payload?.settings
            ? buildTemporaryLlmSettings({
                ...currentSettings,
                ...incomingSettings,
                provider: incomingProvider,
                apiKey: incomingApiKey || fallbackApiKey || ''
            })
            : getResolvedLlmSettings();
        return checkDesktopLlmProvider(settings, {
            includeToolCall: payload?.includeToolCall !== false,
            includeVision: payload?.includeVision !== false,
            timeoutMs: payload?.timeoutMs || settings.timeoutMs
        });
    });
    ipcMain.handle('ailis:vllm-model-catalog-search', async (_event, payload = {}) =>
        searchVllmModelCatalog(payload || {})
    );
    ipcMain.handle('ailis:vllm-runtime-diagnose', async (_event, payload = {}) =>
        getVllmLocalDeployer().diagnose(payload || {})
    );
    ipcMain.handle('ailis:vllm-runtime-status', async () =>
        getVllmLocalDeployer().getStatus()
    );
    ipcMain.handle('ailis:vllm-runtime-deploy', async (_event, payload = {}) =>
        getVllmLocalDeployer().start(payload || {})
    );
    ipcMain.handle('ailis:vllm-runtime-cancel', async () =>
        getVllmLocalDeployer().cancel()
    );
    ipcMain.handle('ailis:memory-snapshot', async (_event, payload = {}) =>
        ensureAILISGateway().getMemorySnapshot(payload || {})
    );
    ipcMain.handle('ailis:memory-search', async (_event, payload = {}) =>
        ensureAILISGateway().searchMemory(payload.query || payload.text || '', payload || {})
    );
    ipcMain.handle('ailis:memory-update-block', async (_event, payload = {}) =>
        ensureAILISGateway().updateMemoryBlock(payload.key || '', payload.value || payload.content || '')
    );
    ipcMain.handle('ailis:memory-reset-affinity', async (_event, payload = {}) =>
        ensureAILISGateway().resetMemoryAffinity(payload.score)
    );
    ipcMain.handle('ailis:memory-clear', async (_event, payload = {}) =>
        ensureAILISGateway().clearMemory(payload || {})
    );
    ipcMain.handle('ailis:memory-forget', async (_event, payload = {}) =>
        ensureAILISGateway().forgetMemory(payload || {})
    );
    ipcMain.handle('ailis:memory-save-secret', async (_event, payload = {}) =>
        ensureAILISGateway().saveMemorySecret(payload || {})
    );
    ipcMain.handle('ailis:memory-delete-secret', async (_event, payload = {}) =>
        ensureAILISGateway().deleteMemorySecret(payload.name || payload.id || '')
    );
    ipcMain.on('ailis:vision-region-selected', (event, payload = {}) => {
        completeVisionRegionSelection(event, payload.selection || payload);
    });
    ipcMain.on('ailis:vision-region-cancelled', (event) => {
        cancelVisionRegionSelection(event);
    });
    ipcMain.handle('ailis:llm-chat', async (_event, payload = {}) => callDesktopLlm(payload));
    ipcMain.handle('ailis:tts-synthesize', async (_event, payload = {}) => callDesktopTts(payload));
    ipcMain.handle('ailis:asr-transcribe', async (_event, audioBytes) => {
        if (!desktopASRManager) {
            throw new Error('本地语音识别管理器尚未初始化');
        }

        return desktopASRManager.transcribeAudioBytes(audioBytes);
    });
    ipcMain.handle('ailis:assistant-status', async () => getAssistantStatusSnapshot());
    ipcMain.handle('ailis:assistant-tool-surface', async () => getOpenClawToolSurface());
    ipcMain.handle('ailis:assistant-validate-tool-surface', async () => validateOpenClawToolSurface());
    ipcMain.handle('ailis:assistant-history', async (_event, payload = {}) => {
        await syncOpenClawSelection({ ensureReady: true });
        return ensureAssistantGateway().getHistory(Number(payload.limit) || 200);
    });
    ipcMain.handle('ailis:assistant-send-message', async (_event, payload = {}) => {
        await syncOpenClawSelection({ ensureReady: true });
        return ensureAssistantGateway().sendMessage(payload.content || '', {
            timeoutMs: Number(payload.timeoutMs) || undefined
        });
    });
    ipcMain.handle('ailis:assistant-abort-run', async (_event, payload = {}) => {
        await syncOpenClawSelection({ ensureReady: true });
        return ensureAssistantGateway().abortRun(payload.runId || '');
    });
    ipcMain.handle('ailis:assistant-list-sessions', async (_event, payload = {}) => {
        await syncOpenClawSelection({ ensureReady: true });
        return ensureAssistantGateway().listSessions(Number(payload.limit) || 20);
    });
    ipcMain.handle('ailis:assistant-set-session-key', async (_event, payload = {}) => {
        await syncOpenClawSelection({ ensureReady: true });
        return ensureAssistantGateway().setSessionKey(payload.sessionKey || '');
    });
    ipcMain.handle('ailis:assistant-patch-session', async (_event, payload = {}) => {
        await syncOpenClawSelection({ ensureReady: true });
        return ensureAssistantGateway().patchSession(payload || {});
    });
    ipcMain.handle('ailis:gateway-status', async () =>
        getAILISGatewayStatusEnsuringStarted('status_request')
    );
    ipcMain.handle('ailis:gateway-tools-list', async () => {
        await ensureAILISGatewayStarted('tools_list');
        return ensureAILISGateway().listTools();
    });
    ipcMain.handle('ailis:gateway-tools-call', async (_event, payload = {}) => {
        await ensureAILISGatewayStarted('tool_call');
        return ensureAILISGateway().callTool(payload || {});
    });
    ipcMain.handle('ailis:gateway-agent-run', async (_event, payload = {}) => {
        await ensureAILISGatewayStarted('agent_run');
        return ensureAILISGateway().runAgent({
            ...(payload || {}),
            llmSettings: payload?.llmSettings || getResolvedLlmSettings()
        });
    });
    ipcMain.handle('ailis:gateway-agent-interrupt', async (_event, payload = {}) =>
        ensureAILISGateway().interruptAgentRun(payload || {})
    );
    ipcMain.handle('ailis:gateway-audit-list', async (_event, payload = {}) => ({
        ok: true,
        entries: await ensureAILISGateway().readAuditEntries(Number(payload.limit) || 100)
    }));
    ipcMain.handle('ailis:agent-lab-runs', async (_event, payload = {}) =>
        ensureAILISGateway().listAgentAnalysisRuns(Number(payload.limit) || 40)
    );
    ipcMain.handle('ailis:agent-lab-analysis', async (_event, payload = {}) =>
        ensureAILISGateway().analyzeAgentRun(payload.runId || '', {
            transcriptLimit: Number(payload.transcriptLimit || payload.limit || 2000)
        })
    );
    ipcMain.handle('ailis:agent-lab-run', async (_event, payload = {}) =>
        ensureAILISGateway().runAgentAnalysis({
            ...(payload || {}),
            llmSettings: payload?.llmSettings || getResolvedLlmSettings()
        })
    );
    ipcMain.handle('ailis:agent-lab-continue', async (_event, payload = {}) =>
        ensureAILISGateway().continueAgentAnalysis({
            ...(payload || {}),
            llmSettings: payload?.llmSettings || getResolvedLlmSettings()
        })
    );
    ipcMain.handle('ailis:agent-lab-interrupt', async (_event, payload = {}) =>
        ensureAILISGateway().interruptAgentRun({
            ...(payload || {}),
            source: payload?.source || 'agent-analysis-lab'
        })
    );

    ipcMain.on('ailis:begin-drag-pet-window', (event) => {
        const sourceWindow = BrowserWindow.fromWebContents(event.sender);
        if (!petWindow || sourceWindow !== petWindow) {
            return;
        }

        const cursor = screen.getCursorScreenPoint();
        const baseBounds = petDialogueExpanded && petDialogueCollapsedBounds
            ? { ...petDialogueCollapsedBounds }
            : petWindow.getBounds();
        petDragState = {
            cursor,
            baseBounds,
            lastAppliedBounds: { ...baseBounds },
            lastAppliedExpandedBounds: null,
            wasExpanded: Boolean(petDialogueExpanded && petDialogueCollapsedBounds),
            extraTop: petDialogueExtraTop || PET_DIALOGUE_DEFAULT_EXTRA_TOP,
            extraWidth: petDialogueExtraWidth || PET_DIALOGUE_DEFAULT_EXTRA_WIDTH
        };
    });

    ipcMain.on('ailis:drag-pet-window', (event, payload = {}) => {
        if (!petWindow) {
            return;
        }
        const sourceWindow = BrowserWindow.fromWebContents(event.sender);
        if (sourceWindow && sourceWindow !== petWindow) {
            return;
        }

        let deltaX = 0;
        let deltaY = 0;
        if (petDragState?.cursor && petDragState?.baseBounds) {
            const cursor = screen.getCursorScreenPoint();
            deltaX = cursor.x - petDragState.cursor.x;
            deltaY = cursor.y - petDragState.cursor.y;
        } else {
            const rawDeltaX = Number(payload.deltaX || 0);
            const rawDeltaY = Number(payload.deltaY || 0);
            deltaX = Number.isFinite(rawDeltaX) ? rawDeltaX : 0;
            deltaY = Number.isFinite(rawDeltaY) ? rawDeltaY : 0;
        }

        if (petDialogueExpanded && petDialogueCollapsedBounds) {
            const baseBounds = petDragState?.baseBounds
                ? { ...petDragState.baseBounds }
                : { ...petDialogueCollapsedBounds };
            const movedBaseBounds = clampBoundsToDisplay({
                ...baseBounds,
                x: Math.round(baseBounds.x + deltaX),
                y: Math.round(baseBounds.y + deltaY)
            }, PET_MIN_SIZE.width, PET_MIN_SIZE.height);
            const layout = getPetDialogueExpandedLayout(
                movedBaseBounds,
                petDragState?.extraTop || petDialogueExtraTop || PET_DIALOGUE_DEFAULT_EXTRA_TOP,
                petDragState?.extraWidth || petDialogueExtraWidth || PET_DIALOGUE_DEFAULT_EXTRA_WIDTH
            );

            petDialogueCollapsedBounds = layout.baseBounds;
            petDialogueExtraTop = layout.extraTop;
            petDialogueExtraWidth = layout.extraWidth;
            petDialogueExpanded = layout.extraTop > 0 || layout.extraWidth > 0;
            desktopState.petWindow.bounds = layout.baseBounds;
            desktopState.petWindow.visible = petWindow.isVisible();
            if (
                petDragState?.lastAppliedExpandedBounds &&
                petDragState.lastAppliedExpandedBounds.x === layout.expandedBounds.x &&
                petDragState.lastAppliedExpandedBounds.y === layout.expandedBounds.y &&
                petDragState.lastAppliedExpandedBounds.width === layout.expandedBounds.width &&
                petDragState.lastAppliedExpandedBounds.height === layout.expandedBounds.height
            ) {
                return;
            }
            if (petDragState) {
                petDragState.lastAppliedBounds = { ...layout.baseBounds };
                petDragState.lastAppliedExpandedBounds = { ...layout.expandedBounds };
            }
            setPetWindowBoundsTransient(layout.expandedBounds);
            return;
        }

        const bounds = petDragState?.baseBounds
            ? { ...petDragState.baseBounds }
            : petWindow.getBounds();
        const nextBounds = clampBoundsToDisplay({
            ...bounds,
            x: Math.round(bounds.x + deltaX),
            y: Math.round(bounds.y + deltaY)
        }, PET_MIN_SIZE.width, PET_MIN_SIZE.height);

        if (
            petDragState?.lastAppliedBounds &&
            petDragState.lastAppliedBounds.x === nextBounds.x &&
            petDragState.lastAppliedBounds.y === nextBounds.y &&
            petDragState.lastAppliedBounds.width === nextBounds.width &&
            petDragState.lastAppliedBounds.height === nextBounds.height
        ) {
            return;
        }
        if (petDragState) {
            petDragState.lastAppliedBounds = { ...nextBounds };
        }
        petWindow.setBounds(nextBounds);
        desktopState.petWindow.bounds = nextBounds;
        desktopState.petWindow.visible = petWindow.isVisible();
    });

    ipcMain.on('ailis:end-drag-pet-window', (event) => {
        const sourceWindow = BrowserWindow.fromWebContents(event.sender);
        if (sourceWindow && sourceWindow !== petWindow) {
            return;
        }
        petDragState = null;
        if (petWindow && !petWindow.isDestroyed()) {
            updateWindowState('petWindow', petWindow);
        }
    });

    ipcMain.on('ailis:set-pet-mouse-passthrough', (event, payload = {}) => {
        const sourceWindow = BrowserWindow.fromWebContents(event.sender);
        if (!petWindow || sourceWindow !== petWindow) {
            return;
        }
        setPetMousePassthrough(Boolean(payload.enabled));
    });

    ipcMain.on('ailis:chat-send-message', (_event, payload = {}) => {
        petWindow?.webContents.send('ailis:chat-send-message', payload);
        showChatWindow();
    });

    ipcMain.on('ailis:chat-control', (_event, payload = {}) => {
        petWindow?.webContents.send('ailis:chat-control', payload);
    });

    ipcMain.on('ailis:pet-chat-event', (_event, payload = {}) => {
        if (chatWindow) {
            chatWindow.webContents.send('ailis:chat-event', payload);
        }
    });

    ipcMain.on('ailis:chat-state-sync-request', () => {
        petWindow?.webContents.send('ailis:chat-state-sync-request', {});
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
    process.env.AILIS_PROJECT_ROOT = getProjectRoot();
    process.env.AILIS_USER_DATA = app.getPath('userData');
    configureCosyVoice3TTS({
        projectRoot: getProjectRoot(),
        userDataPath: app.getPath('userData'),
        pythonPath: getVoiceRuntimeBootstrap().getPreferredVoicePythonPath()
    });
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
    desktopState.preferences.conversationMode = normalizeConversationMode(
        desktopState.preferences.conversationMode || DEFAULT_CONVERSATION_MODE
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
    desktopState.preferences.elevenLabsLanguageCode = normalizeElevenLabsLanguageCode(
        desktopState.preferences.elevenLabsLanguageCode || DEFAULT_ELEVENLABS_LANGUAGE_CODE
    );
    desktopState.preferences.elevenLabsOutputFormat = normalizeElevenLabsOutputFormat(
        desktopState.preferences.elevenLabsOutputFormat || DEFAULT_ELEVENLABS_OUTPUT_FORMAT
    );
    desktopState.preferences.elevenLabsTimeoutMs = normalizeElevenLabsTimeoutMs(
        desktopState.preferences.elevenLabsTimeoutMs || DEFAULT_ELEVENLABS_TIMEOUT_MS
    );
    desktopState.preferences.elevenLabsOptimizeStreamingLatency = normalizeElevenLabsOptimizeStreamingLatency(
        desktopState.preferences.elevenLabsOptimizeStreamingLatency ?? DEFAULT_ELEVENLABS_OPTIMIZE_STREAMING_LATENCY
    );
    desktopState.preferences.elevenLabsStability = normalizeElevenLabsStability(
        desktopState.preferences.elevenLabsStability ?? DEFAULT_ELEVENLABS_STABILITY
    );
    desktopState.preferences.elevenLabsSimilarityBoost = normalizeElevenLabsSimilarityBoost(
        desktopState.preferences.elevenLabsSimilarityBoost ?? DEFAULT_ELEVENLABS_SIMILARITY_BOOST
    );
    desktopState.preferences.elevenLabsStyle = normalizeElevenLabsStyle(
        desktopState.preferences.elevenLabsStyle ?? DEFAULT_ELEVENLABS_STYLE
    );
    desktopState.preferences.elevenLabsSpeed = normalizeElevenLabsSpeed(
        desktopState.preferences.elevenLabsSpeed ?? DEFAULT_ELEVENLABS_SPEED
    );
    desktopState.preferences.elevenLabsUseSpeakerBoost = normalizeElevenLabsUseSpeakerBoost(
        desktopState.preferences.elevenLabsUseSpeakerBoost ?? DEFAULT_ELEVENLABS_USE_SPEAKER_BOOST
    );
    desktopState.preferences.elevenLabsVoiceProfiles = normalizeElevenLabsVoiceProfiles(
        desktopState.preferences.elevenLabsVoiceProfiles,
        desktopState.preferences
    );
    desktopState.preferences.computerControlEnabled = normalizeComputerControlEnabled(
        desktopState.preferences.computerControlEnabled ?? DEFAULT_COMPUTER_CONTROL_ENABLED
    );
    desktopState.preferences.chunkedTtsEnabled = normalizeChunkedTtsEnabled(
        desktopState.preferences.chunkedTtsEnabled ?? DEFAULT_CHUNKED_TTS_ENABLED
    );
    desktopState = saveDesktopState(app, desktopState);
    desktopASRManager = new DesktopASRManager({ app });
    Menu.setApplicationMenu(null);
    registerMediaPermissionHandlers();
    protocol.handle(LOCAL_RESOURCE_PROTOCOL, handleLocalResourceProtocol);
    protocol.handle(SPEECH_MODEL_PROTOCOL, handleSpeechModelProtocol);
    registerIpc();
    void ensureAILISGatewayStarted('app_ready').catch((error) => {
        console.warn('[ailis-gateway] 启动失败：', error.message || error);
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
        delayMs: COSYVOICE3_WARMUP_DELAY_MS
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
    console.log('[app] before-quit');
    isQuitting = true;
    if (visionRegionSelectionRequest) {
        cancelVisionRegionSelection();
    }
    desktopASRManager?.close?.();
    const gatewayShutdown = assistantGateway?.shutdown?.();
    gatewayShutdown?.catch?.(() => {});
    const runtimeShutdown = openclawRuntimeSupervisor?.shutdown?.();
    runtimeShutdown?.catch?.(() => {});
    const humanGatewayShutdown = ailisGateway?.stop?.();
    humanGatewayShutdown?.catch?.(() => {});
    closeCosyVoice3TTS();
});

app.on('will-quit', () => {
    console.log('[app] will-quit');
});

app.on('quit', (_event, exitCode) => {
    console.log('[app] quit', { exitCode });
});

app.on('window-all-closed', () => {
    console.log('[app] window-all-closed');
    // 托盘常驻形态下，窗口全部关闭并不等于退出应用。
});
