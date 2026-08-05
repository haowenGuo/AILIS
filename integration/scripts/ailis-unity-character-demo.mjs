import childProcess from 'node:child_process';
import dgram from 'node:dgram';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
    CHARACTER_ACTION_INTENT_IDS,
    getCharacterActionSupport
} from '../src/character/action-catalog.js';

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const REPOSITORY_ROOT = path.resolve(SCRIPT_DIR, '..');
const PROJECT_ROOT = path.join(REPOSITORY_ROOT, 'unity-character-demo');
const BUILD_EXE = path.join(PROJECT_ROOT, 'Build', 'Windows', 'AILISCharacterDemo.exe');
const MODEL_SOURCE = path.join(REPOSITORY_ROOT, 'Resources', 'AILIS.vrm');
const MOTION_NAMES = [
    'Idle.vrma',
    'Idle1.vrma',
    'Idle2.vrma',
    'Thinking.vrma',
    'LookAround.vrma',
    'Goodbye.vrma',
    'Clapping.vrma',
    'Jump.vrma',
    'Blush.vrma',
    'Angry.vrma',
    'Sad.vrma',
    'Sleepy.vrma',
    'Surprised.vrma',
    'VRMA_01.vrma',
    'VRMA_02.vrma',
    'VRMA_03.vrma',
    'VRMA_04.vrma',
    'VRMA_05.vrma',
    'VRMA_06.vrma',
    'VRMA_07.vrma',
    'VRMA_17.vrma',
    'VRMA_25.vrma'
];
const SACHI_MOTION_NAMES = [
    'AnimeConfident.vrma',
    'AnimeGentle.vrma',
    'AnimeHappy.vrma',
    'AnimeIdle.vrma',
    'AnimeListening.vrma',
    'AnimePresent.vrma',
    'AnimeWave.vrma'
];
const FUMI_MOTION_NAMES = [
    '001_motion_pose.vrma',
    '002_dogeza.vrma',
    '003_humidai.vrma',
    '004_hello_1.vrma',
    '005_smartphone.vrma',
    '006_drinkwater.vrma',
    '007_gekirei.vrma',
    '008_gatan.vrma'
];
const MOTION_SOURCE_DIRECTORY = path.join(
    REPOSITORY_ROOT,
    'Resources',
    'VRMA_MotionPack',
    'vrma');
const MOTION_SOURCE = path.join(MOTION_SOURCE_DIRECTORY, 'Idle.vrma');
const STREAMING_ASSETS = path.join(PROJECT_ROOT, 'Assets', 'StreamingAssets');
const BUILD_STREAMING_ASSETS = path.join(
    PROJECT_ROOT,
    'Build',
    'Windows',
    'AILISCharacterDemo_Data',
    'StreamingAssets');
const RUNTIME_PACKAGES = path.join(PROJECT_ROOT, 'RuntimePackages');
const SACHI_MOTION_SOURCE_DIRECTORY = path.join(
    RUNTIME_PACKAGES,
    'vroid-shino-cc0',
    'Motions');
const FUMI_MOTION_SOURCE_DIRECTORY = path.join(
    REPOSITORY_ROOT,
    'Resources',
    'MotionIntake',
    'candidates',
    'fumi2kick-vrma-motion-pack',
    'extracted',
    'fm_vrma_motion_pack_01',
    'vrma');
const BUILD_LOG = path.join(PROJECT_ROOT, 'Logs', 'command-line-build.log');
const CHARACTER_IMPORT_LOG = path.join(
    PROJECT_ROOT,
    'Logs',
    'command-line-character-import.log');
const CHARACTER_BUILD_LOG = path.join(
    PROJECT_ROOT,
    'Logs',
    'command-line-character-bundle.log');
const CHARACTER_CLEANUP_LOG = path.join(
    PROJECT_ROOT,
    'Logs',
    'command-line-character-cleanup.log');
const CHARACTER_ACTION_MAP_LOG = path.join(
    PROJECT_ROOT,
    'Logs',
    'character-action-map');
const CHARACTER_ACCEPTANCE_LOG = path.join(
    PROJECT_ROOT,
    'Logs',
    'character-acceptance');
const EXPECTED_UNITY_VERSION = '2022.3.62f3';
const DEFAULT_EDITOR_CANDIDATES = [
    process.env.AILIS_UNITY_EDITOR,
    `F:\\AILIS-Unity\\Editor\\${EXPECTED_UNITY_VERSION}\\Editor\\Unity.exe`,
    `F:\\AILIS-Unity\\Hub\\Editor\\${EXPECTED_UNITY_VERSION}\\Editor\\Unity.exe`,
    `C:\\Program Files\\Unity\\Hub\\Editor\\${EXPECTED_UNITY_VERSION}\\Editor\\Unity.exe`
].filter(Boolean);

function parseArgs(argv) {
    const command = argv[0] || 'doctor';
    const options = {};
    for (let index = 1; index < argv.length; index += 1) {
        const arg = argv[index];
        if (!arg.startsWith('--')) {
            continue;
        }
        const key = arg.slice(2);
        const next = argv[index + 1];
        if (next && !next.startsWith('--')) {
            options[key] = next;
            index += 1;
        } else {
            options[key] = true;
        }
    }
    return { command, options };
}

function ensureDirectory(directoryPath) {
    fs.mkdirSync(directoryPath, { recursive: true });
}

function copyIfChanged(sourcePath, destinationPath) {
    const source = fs.statSync(sourcePath);
    const destination = fs.existsSync(destinationPath)
        ? fs.statSync(destinationPath)
        : null;
    if (destination && source.size === destination.size && source.mtimeMs <= destination.mtimeMs) {
        return false;
    }
    fs.copyFileSync(sourcePath, destinationPath);
    return true;
}

function copyDirectoryIfChanged(sourceDirectory, destinationDirectory) {
    if (!fs.existsSync(sourceDirectory)) {
        return 0;
    }
    let copied = 0;
    ensureDirectory(destinationDirectory);
    for (const entry of fs.readdirSync(sourceDirectory, { withFileTypes: true })) {
        const sourcePath = path.join(sourceDirectory, entry.name);
        const destinationPath = path.join(destinationDirectory, entry.name);
        if (entry.isDirectory()) {
            copied += copyDirectoryIfChanged(sourcePath, destinationPath);
        } else if (entry.isFile() && copyIfChanged(sourcePath, destinationPath)) {
            copied += 1;
        }
    }
    return copied;
}

function findUnityEditor() {
    return DEFAULT_EDITOR_CANDIDATES.find((candidate) => fs.existsSync(candidate)) || '';
}

function readLastBuildIssue() {
    if (!fs.existsSync(BUILD_LOG)) {
        return null;
    }
    const log = fs.readFileSync(BUILD_LOG, 'utf8');
    if (log.includes('No valid Unity Editor license found')) {
        return 'unity_license_missing';
    }
    const compilerError = log.match(/error CS\d+:[^\r\n]+/i);
    if (compilerError) {
        return compilerError[0];
    }
    const packageError = log.match(/(?:Package Manager|UPM)[^\r\n]*(?:error|failed)[^\r\n]*/i);
    return packageError ? packageError[0] : null;
}

function doctor() {
    const editorPath = findUnityEditor();
    const result = {
        projectRoot: PROJECT_ROOT,
        expectedUnityVersion: EXPECTED_UNITY_VERSION,
        unityEditor: editorPath || null,
        unityEditorReady: Boolean(editorPath),
        modelReady: fs.existsSync(MODEL_SOURCE),
        motionReady: fs.existsSync(MOTION_SOURCE),
        buildReady: fs.existsSync(BUILD_EXE),
        buildExe: BUILD_EXE,
        lastBuildIssue: readLastBuildIssue(),
        port: 19131
    };
    console.log(JSON.stringify(result, null, 2));
    return result;
}

function prepare() {
    if (!fs.existsSync(MODEL_SOURCE) || !fs.existsSync(MOTION_SOURCE)) {
        throw new Error('AILIS VRM or idle VRMA is missing.');
    }
    ensureDirectory(STREAMING_ASSETS);
    const motionsDirectory = path.join(STREAMING_ASSETS, 'Motions');
    ensureDirectory(motionsDirectory);
    let copied = [
        copyIfChanged(MODEL_SOURCE, path.join(STREAMING_ASSETS, 'AILIS.vrm')),
        ...MOTION_NAMES.map((motionName) => copyIfChanged(
            path.join(MOTION_SOURCE_DIRECTORY, motionName),
            path.join(motionsDirectory, motionName)))
    ].filter(Boolean).length;
    const sachiMotionDirectory = path.join(motionsDirectory, 'Sachi');
    ensureDirectory(sachiMotionDirectory);
    copied += SACHI_MOTION_NAMES
        .filter((motionName) => fs.existsSync(
            path.join(SACHI_MOTION_SOURCE_DIRECTORY, motionName)))
        .map((motionName) => copyIfChanged(
            path.join(SACHI_MOTION_SOURCE_DIRECTORY, motionName),
            path.join(sachiMotionDirectory, motionName)))
        .filter(Boolean)
        .length;
    const fumiMotionDirectory = path.join(motionsDirectory, 'Fumi');
    ensureDirectory(fumiMotionDirectory);
    copied += FUMI_MOTION_NAMES
        .filter((motionName) => fs.existsSync(
            path.join(FUMI_MOTION_SOURCE_DIRECTORY, motionName)))
        .map((motionName) => copyIfChanged(
            path.join(FUMI_MOTION_SOURCE_DIRECTORY, motionName),
            path.join(fumiMotionDirectory, motionName)))
        .filter(Boolean)
        .length;
    copied += copyDirectoryIfChanged(
        RUNTIME_PACKAGES,
        path.join(STREAMING_ASSETS, 'Characters'));
    if (fs.existsSync(BUILD_STREAMING_ASSETS)) {
        copied += copyDirectoryIfChanged(
            RUNTIME_PACKAGES,
            path.join(BUILD_STREAMING_ASSETS, 'Characters'));
    }
    console.log(`Prepared Unity demo runtime assets (${copied} updated).`);
    doctor();
}

function build() {
    prepare();
    const editorPath = findUnityEditor();
    if (!editorPath) {
        throw new Error(
            `Unity ${EXPECTED_UNITY_VERSION} Editor is not installed. ` +
            'Set AILIS_UNITY_EDITOR after installing the Editor on a drive with enough space.');
    }
    ensureDirectory(path.dirname(BUILD_EXE));
    ensureDirectory(path.dirname(BUILD_LOG));
    const result = childProcess.spawnSync(editorPath, [
        '-batchmode',
        '-nographics',
        '-quit',
        '-projectPath',
        PROJECT_ROOT,
        '-executeMethod',
        'Ailis.CharacterDemo.Editor.AilisCharacterDemoBuild.BuildWindowsDemoFromCommandLine',
        '-logFile',
        BUILD_LOG
    ], {
        cwd: PROJECT_ROOT,
        stdio: 'inherit',
        windowsHide: true
    });
    if (result.status !== 0 || !fs.existsSync(BUILD_EXE)) {
        const issue = readLastBuildIssue();
        if (issue === 'unity_license_missing') {
            throw new Error(
                'Unity demo build requires an active Unity Personal/Pro license. ' +
                'Sign in once through Unity Hub, then rerun this command.');
        }
        throw new Error(
            `Unity demo build failed${issue ? ` (${issue})` : ''}. See ${BUILD_LOG}`);
    }
    console.log(`Unity demo built: ${BUILD_EXE}`);
}

function runUnityEditor(editorPath, args, logPath, failureLabel) {
    ensureDirectory(path.dirname(logPath));
    const result = childProcess.spawnSync(editorPath, [
        '-batchmode',
        '-nographics',
        '-accept-apiupdate',
        '-quit',
        '-projectPath',
        PROJECT_ROOT,
        ...args,
        '-logFile',
        logPath
    ], {
        cwd: PROJECT_ROOT,
        stdio: 'inherit',
        windowsHide: true
    });
    if (result.status !== 0) {
        throw new Error(`${failureLabel} failed. See ${logPath}`);
    }
}

function importCharacterPackage(options) {
    const editorPath = findUnityEditor();
    if (!editorPath) {
        throw new Error(
            `Unity ${EXPECTED_UNITY_VERSION} Editor is not installed. ` +
            'Set AILIS_UNITY_EDITOR before importing a character package.');
    }

    if (!options.package || !options.recipe) {
        throw new Error('import-package requires --package and --recipe.');
    }
    const packagePath = path.resolve(String(options.package));
    const recipePath = path.resolve(String(options.recipe));
    if (!fs.existsSync(packagePath)) {
        throw new Error(`Unity package was not found: ${packagePath}`);
    }
    if (!fs.existsSync(recipePath)) {
        throw new Error(`Character import recipe was not found: ${recipePath}`);
    }

    runUnityEditor(
        editorPath,
        ['-importPackage', packagePath],
        CHARACTER_IMPORT_LOG,
        'Unity package import');
    runUnityEditor(
        editorPath,
        [
            '-executeMethod',
            'Ailis.CharacterDemo.Editor.AilisCharacterPackageBuilder.BuildFromCommandLine',
            '--character-recipe',
            recipePath
        ],
        CHARACTER_BUILD_LOG,
        'AILIS character AssetBundle build');

    const recipe = JSON.parse(fs.readFileSync(recipePath, 'utf8'));
    const packageManifest = path.join(
        STREAMING_ASSETS,
        'Characters',
        recipe.id,
        'ailis-character.json');
    if (!fs.existsSync(packageManifest)) {
        throw new Error(`Character package manifest was not produced: ${packageManifest}`);
    }
    const activate = booleanOption(options, 'activate', false);
    if (activate) {
        activateCharacterPackage({ manifest: packageManifest });
    }
    if (!booleanOption(options, 'keep-source', false)) {
        cleanupCharacterPackage({ recipe: recipePath });
    }

    console.log(JSON.stringify({
        status: 'ready',
        packageId: recipe.id,
        packageManifest,
        active: activate,
        sourcePackage: packagePath,
        recipe: recipePath
    }, null, 2));
}

function cleanupCharacterPackage(options) {
    if (!options.recipe) {
        throw new Error('cleanup-package-source requires --recipe.');
    }
    const editorPath = findUnityEditor();
    if (!editorPath) {
        throw new Error(
            `Unity ${EXPECTED_UNITY_VERSION} Editor is not installed. ` +
            'Set AILIS_UNITY_EDITOR before cleaning imported character sources.');
    }
    const recipePath = path.resolve(String(options.recipe));
    if (!fs.existsSync(recipePath)) {
        throw new Error(`Character import recipe was not found: ${recipePath}`);
    }
    runUnityEditor(
        editorPath,
        [
            '-executeMethod',
            'Ailis.CharacterDemo.Editor.AilisCharacterPackageBuilder.' +
                'CleanupImportedSourcesFromCommandLine',
            '--character-recipe',
            recipePath
        ],
        CHARACTER_CLEANUP_LOG,
        'AILIS imported character source cleanup');
}

function activateCharacterPackage(options) {
    if (!options.manifest && !options.id) {
        throw new Error('activate-package requires --manifest or --id.');
    }
    const packageManifest = options.manifest
        ? path.resolve(String(options.manifest))
        : path.join(
            STREAMING_ASSETS,
            'Characters',
            String(options.id),
            'ailis-character.json');
    if (!fs.existsSync(packageManifest)) {
        throw new Error(`Character package manifest was not found: ${packageManifest}`);
    }

    const characterPackage = JSON.parse(fs.readFileSync(packageManifest, 'utf8'));
    const characterDirectory = path.dirname(packageManifest);
    const relativeDirectory = path.relative(STREAMING_ASSETS, characterDirectory)
        .split(path.sep)
        .join('/');
    const rebasePackagePath = (configuredPath) => {
        const normalized = String(configuredPath || '').trim();
        if (!normalized || path.isAbsolute(normalized)) {
            return normalized;
        }
        return path.posix.normalize(path.posix.join(relativeDirectory, normalized));
    };
    characterPackage.model = rebasePackagePath(characterPackage.model);
    characterPackage.motions = Array.isArray(characterPackage.motions)
        ? characterPackage.motions.map((motion) => ({
            ...motion,
            file: rebasePackagePath(motion?.file)
        }))
        : [];
    const activeManifest = path.join(STREAMING_ASSETS, 'ailis-character.json');
    fs.writeFileSync(activeManifest, `${JSON.stringify(characterPackage, null, 2)}\n`);
    console.log(JSON.stringify({
        status: 'active',
        packageId: characterPackage.id,
        sourceManifest: packageManifest,
        activeManifest,
        model: characterPackage.model
    }, null, 2));
}

function start() {
    if (!fs.existsSync(BUILD_EXE)) {
        throw new Error(`Unity demo has not been built: ${BUILD_EXE}`);
    }
    const runtimeAssets = fs.existsSync(
        path.join(BUILD_STREAMING_ASSETS, 'ailis-character.json'))
        ? BUILD_STREAMING_ASSETS
        : STREAMING_ASSETS;
    const child = childProcess.spawn(BUILD_EXE, [
        '-popupwindow',
        '-screen-fullscreen',
        '0',
        '-screen-width',
        '720',
        '-screen-height',
        '960',
        '--character-package',
        path.join(runtimeAssets, 'ailis-character.json'),
        '--model',
        path.join(runtimeAssets, 'AILIS.vrm'),
        '--motion',
        path.join(runtimeAssets, 'Motions', 'Idle.vrma'),
        '--port',
        '19131',
        '--event-port',
        '19132',
        '--width',
        '720',
        '--height',
        '960',
        '--x',
        '80',
        '--y',
        '80',
        '--transparent',
        'true',
        '--topmost',
        'true',
        '-force-d3d11',
    ], {
        cwd: path.dirname(BUILD_EXE),
        detached: true,
        stdio: 'ignore',
        windowsHide: false
    });
    child.unref();
    console.log(`Started Unity character renderer (pid ${child.pid}).`);
}

function validateMotionCompatibility(options) {
    if (!fs.existsSync(BUILD_EXE)) {
        throw new Error(`Unity demo has not been built: ${BUILD_EXE}`);
    }
    const outputDirectory = options.output
        ? path.resolve(String(options.output))
        : path.join(PROJECT_ROOT, 'Logs', 'motion-compatibility');
    const reportPath = options.report
        ? path.resolve(String(options.report))
        : path.join(outputDirectory, 'motion-compatibility-matrix.json');
    ensureDirectory(outputDirectory);
    const args = [
        '-popupwindow',
        '-screen-fullscreen',
        '0',
        '-screen-width',
        '360',
        '-screen-height',
        '540',
        '--motion-compatibility-report',
        reportPath,
        '--motion-compatibility-output',
        outputDirectory,
        '-force-d3d11'
    ];
    if (options.ids) {
        args.push('--motion-compatibility-ids', String(options.ids));
    }
    const result = childProcess.spawnSync(BUILD_EXE, args, {
        cwd: path.dirname(BUILD_EXE),
        stdio: 'inherit',
        windowsHide: true,
        timeout: numberOption(options, 'timeout-ms', 10 * 60 * 1000)
    });
    if (result.error) {
        throw result.error;
    }
    if (!fs.existsSync(reportPath)) {
        throw new Error(
            `Unity did not produce a motion compatibility report: ${reportPath}`);
    }
    const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
    if (result.status !== 0 && !report.results?.length) {
        throw new Error(
            `Motion compatibility validation failed with code ${result.status}. ` +
            `See ${reportPath}`);
    }
    const rows = Array.isArray(report.results) ? report.results : [];
    console.log(JSON.stringify({
        status: result.status === 0 ? 'complete' : 'complete_with_failures',
        reportPath,
        outputDirectory,
        characters: report.characterCount,
        motions: report.motionCount,
        combinations: report.combinationCount,
        pass: report.passCount,
        review: report.reviewCount,
        fail: report.failCount,
        retarget: {
            mechanicalPass: rows.filter(
                item => item.mechanicalStatus === 'pass').length,
            crossAvatarPass: rows.filter(
                item => item.crossAvatarStatus === 'pass').length,
            visualPending: rows.filter(
                item => item.visualStatus === 'pending_review').length,
            silhouetteOnly: rows.filter(
                item => item.visualStatus === 'silhouette_only').length,
            captureUnavailable: rows.filter(
                item => item.visualStatus === 'capture_unavailable').length
        }
    }, null, 2));
}

function resolveMotionDriver(characterPackage, motion) {
    if (!motion) {
        return {
            type: 'none',
            target: '',
            declared: false
        };
    }
    if (motion.nativeParameter) {
        return {
            type: 'native_parameter',
            target:
                `${motion.nativeLayerId || 'any'}.` +
                `${motion.nativeParameter}=${motion.nativeParameterValue}`,
            declared: true
        };
    }
    if (motion.stateName) {
        return {
            type: 'animator_state',
            target: motion.stateName,
            declared: true
        };
    }
    if (motion.bakedClipResource) {
        return {
            type: 'baked_clip',
            target: motion.bakedClipResource,
            declared: true
        };
    }
    if (characterPackage.adapter === 'vrm' && motion.file) {
        return {
            type: 'vrma_clip',
            target: motion.file,
            declared: true
        };
    }
    return {
        type: 'missing',
        target: '',
        declared: false
    };
}

function createCharacterActionMap(characterPackage, manifestPath) {
    const motions = Array.isArray(characterPackage.motions)
        ? characterPackage.motions
        : [];
    const rows = CHARACTER_ACTION_INTENT_IDS.map((actionId) => {
        const support = getCharacterActionSupport(actionId, motions);
        const driver = resolveMotionDriver(characterPackage, support.motion);
        return {
            actionId,
            status: actionId === 'none' ? 'no_action' : support.status,
            resolvedIntent: support.resolvedIntent,
            motionId: support.motion?.id || '',
            motionCompatibility: support.motion?.compatibility || '',
            reviewedMotionId: support.reviewedMotion?.id || '',
            driverType: driver.type,
            driverTarget: driver.target,
            driverDeclared: driver.declared,
            playback: 'not_run',
            playbackDetail: ''
        };
    });
    const counts = Object.fromEntries(
        Object.entries(Object.groupBy(rows, (row) => row.status))
            .map(([status, items]) => [status, items.length])
    );
    return {
        packageId: String(characterPackage.id || path.basename(path.dirname(manifestPath))),
        displayName: String(characterPackage.displayName || characterPackage.id || ''),
        adapter: String(characterPackage.adapter || ''),
        manifestPath,
        motionCount: motions.length,
        counts,
        rows
    };
}

function createEventInbox(port) {
    const socket = dgram.createSocket('udp4');
    const buffered = [];
    const waiters = [];
    socket.on('message', (payload) => {
        let event;
        try {
            event = JSON.parse(payload.toString('utf8'));
        } catch {
            return;
        }
        const waiterIndex = waiters.findIndex((waiter) => waiter.predicate(event));
        if (waiterIndex >= 0) {
            const [waiter] = waiters.splice(waiterIndex, 1);
            clearTimeout(waiter.timer);
            waiter.resolve(event);
            return;
        }
        buffered.push(event);
    });
    const ready = new Promise((resolve, reject) => {
        socket.once('error', reject);
        socket.bind(port, '127.0.0.1', resolve);
    });
    return {
        ready,
        waitFor(predicate, timeoutMs) {
            const bufferedIndex = buffered.findIndex(predicate);
            if (bufferedIndex >= 0) {
                return Promise.resolve(buffered.splice(bufferedIndex, 1)[0]);
            }
            return new Promise((resolve, reject) => {
                const waiter = {
                    predicate,
                    resolve,
                    reject,
                    timer: null
                };
                waiter.timer = setTimeout(() => {
                    const index = waiters.indexOf(waiter);
                    if (index >= 0) {
                        waiters.splice(index, 1);
                    }
                    reject(new Error(
                        `Unity event did not arrive on port ${port} within ${timeoutMs}ms.`
                    ));
                }, timeoutMs);
                waiters.push(waiter);
            });
        },
        close() {
            for (const waiter of waiters.splice(0)) {
                clearTimeout(waiter.timer);
                waiter.reject(new Error('Unity event inbox closed.'));
            }
            socket.close();
        }
    };
}

async function sendMessageToPort(message, port, timeoutMs = 5000) {
    const payload = Buffer.from(JSON.stringify(message), 'utf8');
    const socket = dgram.createSocket('udp4');
    return new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
            socket.close();
            reject(new Error(
                `Unity renderer on port ${port} did not acknowledge within ${timeoutMs}ms.`
            ));
        }, timeoutMs);
        socket.once('message', (reply) => {
            clearTimeout(timer);
            socket.close();
            try {
                resolve(JSON.parse(reply.toString('utf8')));
            } catch {
                resolve({ status: 'invalid_ack', detail: reply.toString('utf8') });
            }
        });
        socket.send(payload, port, '127.0.0.1', (error) => {
            if (!error) {
                return;
            }
            clearTimeout(timer);
            socket.close();
            reject(error);
        });
    });
}

async function validateCharacterPlayback(characterMap, options, index) {
    const commandPort = 19431 + index;
    const eventPort = 19531 + index;
    const eventInbox = createEventInbox(eventPort);
    await eventInbox.ready;
    const logPath = path.join(
        PROJECT_ROOT,
        'Logs',
        `character-action-map-${characterMap.packageId}.log`
    );
    const processHandle = childProcess.spawn(BUILD_EXE, [
        '-popupwindow',
        '-screen-fullscreen',
        '0',
        '-screen-width',
        '320',
        '-screen-height',
        '480',
        '--character-package',
        characterMap.manifestPath,
        '--port',
        String(commandPort),
        '--event-port',
        String(eventPort),
        '--width',
        '320',
        '--height',
        '480',
        '--x',
        String(40 + index * 24),
        '--y',
        String(40 + index * 24),
        '--transparent',
        'true',
        '--topmost',
        'false',
        '-force-d3d11',
        '-logFile',
        logPath
    ], {
        cwd: path.dirname(BUILD_EXE),
        stdio: 'ignore',
        windowsHide: false
    });
    try {
        await eventInbox.waitFor(
            (event) => event.type === 'renderer.ready',
            numberOption(options, 'ready-timeout-ms', 90_000)
        );
        const motionRows = new Map();
        for (const row of characterMap.rows) {
            if (row.motionId && !motionRows.has(row.motionId)) {
                motionRows.set(row.motionId, row);
            }
        }
        const playbackByMotion = new Map();
        for (const [motionId] of motionRows) {
            const requestId =
                `action-map-${characterMap.packageId}-${motionId}-${Date.now()}`;
            const resultPromise = eventInbox.waitFor(
                (event) =>
                    event.type === 'character.action.result' &&
                    event.requestId === requestId,
                numberOption(options, 'action-timeout-ms', 15_000)
            );
            await sendMessageToPort({
                type: 'character.action',
                requestId,
                action: { motionId }
            }, commandPort);
            const result = await resultPromise;
            playbackByMotion.set(motionId, {
                status: result.status === 'played' ? 'passed' : 'failed',
                detail: String(result.detail || result.status || '')
            });
        }
        for (const row of characterMap.rows) {
            if (!row.motionId) {
                row.playback = row.status === 'no_action' ? 'not_applicable' : 'not_run';
                continue;
            }
            const playback = playbackByMotion.get(row.motionId);
            row.playback = playback?.status || 'failed';
            row.playbackDetail = playback?.detail || 'missing_action_result';
        }
    } catch (error) {
        for (const row of characterMap.rows) {
            if (row.motionId && row.playback === 'not_run') {
                row.playback = 'failed';
                row.playbackDetail = error.message;
            }
        }
        characterMap.runtimeError = error.message;
    } finally {
        eventInbox.close();
        if (!processHandle.killed) {
            processHandle.kill();
        }
    }
}

async function validateCharacterActionMaps(options) {
    if (!fs.existsSync(BUILD_EXE)) {
        throw new Error(`Unity demo has not been built: ${BUILD_EXE}`);
    }
    const live = booleanOption(options, 'live', true);
    const characterRoot = path.join(
        BUILD_STREAMING_ASSETS,
        'Characters'
    );
    const outputDirectory = options.output
        ? path.resolve(String(options.output))
        : CHARACTER_ACTION_MAP_LOG;
    const reportPath = options.report
        ? path.resolve(String(options.report))
        : path.join(outputDirectory, 'character-action-map.json');
    ensureDirectory(outputDirectory);
    const characterMaps = fs.readdirSync(characterRoot, { withFileTypes: true })
        .filter((entry) => entry.isDirectory())
        .map((entry) => path.join(characterRoot, entry.name, 'ailis-character.json'))
        .filter((manifestPath) => fs.existsSync(manifestPath))
        .map((manifestPath) => createCharacterActionMap(
            JSON.parse(fs.readFileSync(manifestPath, 'utf8')),
            manifestPath
        ));

    if (live) {
        for (let index = 0; index < characterMaps.length; index += 1) {
            await validateCharacterPlayback(characterMaps[index], options, index);
        }
    }

    const actionableRows = characterMaps.flatMap((character) =>
        character.rows.filter((row) => row.status !== 'no_action')
    );
    const motionProbes = characterMaps.flatMap((character) =>
        Array.from(
            new Map(
                character.rows
                    .filter((row) => row.motionId)
                    .map((row) => [row.motionId, row])
            ).values()
        )
    );
    const report = {
        schema: 'ailis.character-action-map-report.v1',
        createdAt: new Date().toISOString(),
        live,
        characterCount: characterMaps.length,
        semanticActionCount: CHARACTER_ACTION_INTENT_IDS.length,
        mappedCount: actionableRows.filter((row) => row.motionId).length,
        unmappedCount: actionableRows.filter((row) => !row.motionId).length,
        uniqueMotionProbeCount: motionProbes.length,
        uniqueMotionProbePassedCount: motionProbes.filter(
            (row) => row.playback === 'passed'
        ).length,
        uniqueMotionProbeFailedCount: motionProbes.filter(
            (row) => row.playback === 'failed'
        ).length,
        playbackPassedCount: actionableRows.filter(
            (row) => row.playback === 'passed'
        ).length,
        playbackFailedCount: actionableRows.filter(
            (row) => row.playback === 'failed'
        ).length,
        characters: characterMaps
    };
    fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
    console.log(JSON.stringify({
        status:
            report.unmappedCount === 0 &&
            (!live || report.playbackFailedCount === 0)
                ? 'passed'
                : 'review_required',
        reportPath,
        live,
        characters: report.characterCount,
        actionsPerCharacter: report.semanticActionCount,
        mapped: report.mappedCount,
        unmapped: report.unmappedCount,
        uniqueMotionProbes: report.uniqueMotionProbeCount,
        uniqueMotionProbesPassed: report.uniqueMotionProbePassedCount,
        uniqueMotionProbesFailed: report.uniqueMotionProbeFailedCount,
        playbackPassed: report.playbackPassedCount,
        playbackFailed: report.playbackFailedCount
    }, null, 2));
}

function wait(milliseconds) {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

function safeFileName(value) {
    return String(value || 'unnamed')
        .replace(/[^a-z0-9._-]+/gi, '-')
        .replace(/^-+|-+$/g, '') || 'unnamed';
}

function resolvePerformanceLayer(motion) {
    const configured = String(motion?.performanceLayer || '').trim().toLowerCase();
    if (['base', 'additive', 'gesture', 'action'].includes(configured)) {
        return configured;
    }
    return motion?.loop ? 'base' : 'gesture';
}

async function requestAnimationSnapshot(eventInbox, commandPort, prefix) {
    const requestId = `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const resultPromise = eventInbox.waitFor(
        (event) => event.type === 'character.animation.state' &&
            event.requestId === requestId,
        15_000
    );
    await sendMessageToPort({
        type: 'character.animation.state.request',
        requestId
    }, commandPort);
    return (await resultPromise).animation || null;
}

async function applyAnimationControl(
    eventInbox,
    commandPort,
    operation,
    layer = '',
    normalizedTime = 0
) {
    const requestId = `animation-${operation}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const resultPromise = eventInbox.waitFor(
        (event) => event.type === 'character.animation.state' &&
            event.requestId === requestId,
        15_000
    );
    await sendMessageToPort({
        type: 'character.animation.control',
        requestId,
        animationDebug: { operation, layer, normalizedTime }
    }, commandPort);
    return (await resultPromise).animation || null;
}

async function captureRuntimeFrame(
    eventInbox,
    commandPort,
    screenshotPath,
    prefix
) {
    const requestId = `capture-${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const resultPromise = eventInbox.waitFor(
        (event) => event.type === 'renderer.capture.completed' &&
            event.requestId === requestId,
        15_000
    );
    await sendMessageToPort({
        type: 'renderer.capture.request',
        requestId,
        capture: { path: screenshotPath, superSize: 1 }
    }, commandPort);
    const result = await resultPromise;
    return {
        status: result.status || 'failed',
        detail: result.detail || screenshotPath
    };
}

async function analyzeCapturedFrame(screenshotPath) {
    if (!fs.existsSync(screenshotPath) || fs.statSync(screenshotPath).size === 0) {
        return { readable: false, reason: 'capture_missing' };
    }
    const image = fs.readFileSync(screenshotPath);
    const pngSignature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
    const isPng = image.length >= 24 && image.subarray(0, 8).equals(pngSignature);
    const width = isPng ? image.readUInt32BE(16) : 0;
    const height = isPng ? image.readUInt32BE(20) : 0;
    return {
        readable: isPng && width > 0 && height > 0,
        width,
        height,
        bytes: image.length,
        // A valid rendered 360x540 PNG is substantially larger than an empty
        // header-only capture. Art quality is deliberately left to the contact
        // sheet review rather than guessed from pixel heuristics.
        visuallyNonBlank: isPng && image.length > 2048
    };
}

async function createContactSheets(items, outputDirectory, prefix, columns = 4) {
    const validItems = items.filter((item) =>
        item.screenshotPath && fs.existsSync(item.screenshotPath));
    if (validItems.length === 0) {
        return [];
    }
    const sheets = [];
    const pageSize = columns * 2;
    for (let offset = 0; offset < validItems.length; offset += pageSize) {
        const page = validItems.slice(offset, offset + pageSize);
        const sheetPath = path.join(
            outputDirectory,
            `${prefix}-${String(Math.floor(offset / pageSize) + 1).padStart(2, '0')}.html`
        );
        const cards = page.map((item) => {
            const label = String(item.id || item.label || '')
                .replace(/[&<>]/g, (character) => ({
                    '&': '&amp;', '<': '&lt;', '>': '&gt;'
                })[character]);
            const relativeImage = path.relative(outputDirectory, item.screenshotPath)
                .split(path.sep).join('/');
            return `<figure><img src="${relativeImage}" alt="${label}">` +
                `<figcaption>${label}</figcaption></figure>`;
        }).join('\n');
        fs.writeFileSync(sheetPath, `<!doctype html>
<html><head><meta charset="utf-8"><title>${prefix}</title>
<style>body{margin:0;background:#e5e7eb;font-family:Segoe UI,sans-serif}.grid{display:grid;grid-template-columns:repeat(${columns},1fr);gap:10px;padding:10px}figure{margin:0;background:#111827;color:white}img{display:block;width:100%;height:476px;object-fit:contain;background:#f3f4f6}figcaption{padding:10px 12px}</style>
</head><body><main class="grid">${cards}</main></body></html>\n`, 'utf8');
        sheets.push(sheetPath);
    }
    return sheets;
}

function createPcm16SineBase64({
    frequency = 180,
    sampleRate = 48_000,
    seconds = 0.18,
    amplitude = 0.72
} = {}) {
    const sampleCount = Math.floor(sampleRate * seconds);
    const pcm = Buffer.alloc(sampleCount * 2);
    for (let index = 0; index < sampleCount; index += 1) {
        const envelope = Math.sin(Math.PI * index / Math.max(1, sampleCount - 1));
        const value = Math.max(-1, Math.min(1,
            Math.sin(2 * Math.PI * frequency * index / sampleRate) *
            amplitude * envelope));
        pcm.writeInt16LE(Math.round(value * 32767), index * 2);
    }
    return pcm.toString('base64');
}

function weightFor(snapshot, field, id) {
    const rows = Array.isArray(snapshot?.[field]) ? snapshot[field] : [];
    return Number(rows.find((row) => row.id === id)?.weight || 0);
}

function writeCharacterAcceptanceMarkdown(report, markdownPath) {
    const motionRows = report.motions.map((item) =>
        `| ${item.id} | ${item.expectedLayer} | ${item.grade} | ` +
        `${item.playbackStatus} | ${item.layerMatched ? 'yes' : 'no'} | ` +
        `${item.resetPassed ? 'yes' : 'no'} | ${item.compatibilityBefore} |`
    );
    const expressionRows = report.expressions.map((item) =>
        `| ${item.id} | ${item.grade} | ${item.observedWeight.toFixed(3)} | ` +
        `${item.capture?.visuallyNonBlank ? 'yes' : 'no'} |`
    );
    const lipRows = report.lip.directVisemes.map((item) =>
        `| ${item.id} | ${item.grade} | ${item.observedViseme} | ` +
        `${item.observedWeight.toFixed(3)} |`
    );
    const lines = [
        '# AILIS 白毛女仆角色链路验收',
        '',
        `生成时间：${report.generatedAt}`,
        '',
        '## 结论',
        '',
        `- 动作：${report.summary.motionGradeA} A / ` +
            `${report.summary.motionGradeB} B / ${report.summary.motionGradeC} C，` +
            `共 ${report.summary.motionCount} 个。`,
        `- 表情：${report.summary.expressionPassed}/` +
            `${report.summary.expressionCount} 通过。`,
        `- 口型：直接音素 ${report.summary.directVisemePassed}/5；` +
            `PCM=${report.lip.pcm.grade}；停止归零=${report.lip.stopPassed}.`,
        '- A：允许自动调度；B：仅调试台手动使用；C：禁用。',
        '',
        '## 动作',
        '',
        '| ID | 层 | 级别 | 播放 | 层匹配 | 可复位 | 原状态 |',
        '|---|---|---:|---|---|---|---|',
        ...motionRows,
        '',
        '## 表情',
        '',
        '| ID | 级别 | 实测权重 | 画面有效 |',
        '|---|---:|---:|---|',
        ...expressionRows,
        '',
        '## 口型',
        '',
        '| 音素 | 级别 | 实际音素 | 实测权重 |',
        '|---|---:|---|---:|',
        ...lipRows,
        '',
        `JSON 证据：${report.reportPath}`,
        ''
    ];
    fs.writeFileSync(markdownPath, `${lines.join('\n')}\n`, 'utf8');
}

async function validateCharacterAcceptance(options) {
    if (!fs.existsSync(BUILD_EXE)) {
        throw new Error(`Unity demo has not been built: ${BUILD_EXE}`);
    }
    const packageId = String(options.package || 'ailis-default');
    const manifestPath = options.manifest
        ? path.resolve(String(options.manifest))
        : path.join(
            BUILD_STREAMING_ASSETS,
            'Characters',
            packageId,
            'ailis-character.json');
    if (!fs.existsSync(manifestPath)) {
        throw new Error(`Character manifest does not exist: ${manifestPath}`);
    }
    const characterPackage = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    if (String(characterPackage.id || '') !== packageId) {
        throw new Error(
            `Character manifest id ${characterPackage.id} does not match ${packageId}.`);
    }

    const outputDirectory = options.output
        ? path.resolve(String(options.output))
        : path.join(CHARACTER_ACCEPTANCE_LOG, packageId);
    const frameDirectory = path.join(outputDirectory, 'frames');
    ensureDirectory(frameDirectory);
    const reportPath = options.report
        ? path.resolve(String(options.report))
        : path.join(outputDirectory, 'acceptance-report.json');
    const markdownPath = path.join(outputDirectory, 'acceptance-report.md');
    const commandPort = numberOption(options, 'port', 19631);
    const eventPort = numberOption(options, 'event-port', 19632);
    const eventInbox = createEventInbox(eventPort);
    await eventInbox.ready;
    const logPath = path.join(outputDirectory, 'unity-acceptance.log');
    const processHandle = childProcess.spawn(BUILD_EXE, [
        '-popupwindow',
        '-screen-fullscreen', '0',
        '-screen-width', '360',
        '-screen-height', '540',
        '--character-package', manifestPath,
        '--port', String(commandPort),
        '--event-port', String(eventPort),
        '--width', '360',
        '--height', '540',
        '--x', '20',
        '--y', '20',
        '--transparent', 'false',
        '--topmost', 'false',
        '-force-d3d11',
        '-logFile', logPath
    ], {
        cwd: path.dirname(BUILD_EXE),
        stdio: 'ignore',
        windowsHide: false
    });

    const motions = [];
    const expressions = [];
    const directVisemes = [];
    let pcm = { grade: 'C', observedViseme: '', observedWeight: 0 };
    let stopPassed = false;
    try {
        await eventInbox.waitFor(
            (event) => event.type === 'renderer.ready',
            numberOption(options, 'ready-timeout-ms', 120_000)
        );
        await sendMessageToPort({
            type: 'persona.surface',
            requestId: `acceptance-neutral-${Date.now()}`,
            surface: {
                emotion: 'neutral',
                taskState: 'idle',
                gestureIntent: 'none',
                gazeTarget: 'user',
                intensity: 0.72,
                speechEnergy: 0,
                speechText: ''
            }
        }, commandPort);
        await wait(300);

        for (const motion of characterPackage.motions || []) {
            const id = String(motion.id || '');
            const expectedLayer = resolvePerformanceLayer(motion);
            const requestId = `accept-motion-${safeFileName(id)}-${Date.now()}`;
            const resultPromise = eventInbox.waitFor(
                (event) => event.type === 'character.action.result' &&
                    event.requestId === requestId,
                numberOption(options, 'action-timeout-ms', 30_000)
            );
            await sendMessageToPort({
                type: 'character.action',
                requestId,
                action: { motionId: id }
            }, commandPort);
            const actionResult = await resultPromise;
            const phaseRows = [];
            const phasePlan = [0.2, 0.5, 0.82];
            for (let phaseIndex = 0; phaseIndex < phasePlan.length; phaseIndex += 1) {
                const normalizedTime = phasePlan[phaseIndex];
                if (phaseIndex === 0) {
                    await wait(numberOption(options, 'settle-ms', 280));
                } else if (expectedLayer === 'base') {
                    await wait(numberOption(options, 'base-phase-ms', 420));
                } else {
                    await applyAnimationControl(
                        eventInbox,
                        commandPort,
                        'stop',
                        expectedLayer
                    );
                    await wait(80);
                    const phaseRequestId =
                        `accept-motion-${safeFileName(id)}-phase-${phaseIndex}-${Date.now()}`;
                    const phaseResultPromise = eventInbox.waitFor(
                        (event) => event.type === 'character.action.result' &&
                            event.requestId === phaseRequestId,
                        numberOption(options, 'action-timeout-ms', 30_000)
                    );
                    await sendMessageToPort({
                        type: 'character.action',
                        requestId: phaseRequestId,
                        action: { motionId: id }
                    }, commandPort);
                    await phaseResultPromise;
                    await wait(Math.max(
                        100,
                        Number(motion.transitionSeconds || 0.16) * 1000 + 30
                    ));
                    await applyAnimationControl(
                        eventInbox,
                        commandPort,
                        'seek',
                        expectedLayer,
                        normalizedTime
                    );
                    await wait(24);
                }
                const phaseId = `${Math.round(normalizedTime * 100)}`;
                const phaseSnapshot = await requestAnimationSnapshot(
                    eventInbox,
                    commandPort,
                    `motion-${safeFileName(id)}-${phaseId}`
                );
                const phaseScreenshotPath = path.join(
                    frameDirectory,
                    `motion-${safeFileName(id)}-${phaseId}.png`);
                const phaseCaptureResult = await captureRuntimeFrame(
                    eventInbox,
                    commandPort,
                    phaseScreenshotPath,
                    `${safeFileName(id)}-${phaseId}`
                );
                phaseRows.push({
                    phase: normalizedTime,
                    snapshot: phaseSnapshot,
                    screenshotPath: phaseScreenshotPath,
                    captureStatus: phaseCaptureResult.status,
                    capture: await analyzeCapturedFrame(phaseScreenshotPath)
                });
            }
            const snapshot = phaseRows[1].snapshot;
            const activeLayer = snapshot?.layers?.find(
                (layer) => layer.id === expectedLayer);
            const layerMatched = phaseRows.every((phaseRow) => {
                const phaseLayer = phaseRow.snapshot?.layers?.find(
                    (layer) => layer.id === expectedLayer);
                return Boolean(phaseLayer?.active && phaseLayer.motionId === id);
            });
            const screenshotPath = phaseRows[1].screenshotPath;
            const capture = phaseRows[1].capture;
            const captureStatus = phaseRows.every(
                (phaseRow) => phaseRow.captureStatus === 'captured')
                ? 'captured'
                : 'failed';

            let resetPassed = true;
            if (expectedLayer === 'base') {
                const resetId = `reset-${safeFileName(id)}-${Date.now()}`;
                const resetPromise = eventInbox.waitFor(
                    (event) => event.type === 'character.action.result' &&
                        event.requestId === resetId,
                    15_000
                );
                await sendMessageToPort({
                    type: 'character.action',
                    requestId: resetId,
                    action: { motionId: 'idle' }
                }, commandPort);
                await resetPromise;
                await wait(numberOption(options, 'reset-settle-ms', 560));
                const resetSnapshot = await requestAnimationSnapshot(
                    eventInbox,
                    commandPort,
                    `reset-${safeFileName(id)}`
                );
                resetPassed = resetSnapshot?.layers?.find(
                    (layer) => layer.id === 'base')?.motionId === 'idle';
            } else {
                await applyAnimationControl(
                    eventInbox,
                    commandPort,
                    'stop',
                    expectedLayer
                );
                await wait(numberOption(options, 'reset-settle-ms', 560));
                const resetSnapshot = await requestAnimationSnapshot(
                    eventInbox,
                    commandPort,
                    `reset-${safeFileName(id)}`
                );
                const resetLayer = resetSnapshot?.layers?.find(
                    (layer) => layer.id === expectedLayer);
                resetPassed = !resetLayer?.active && !resetLayer?.motionId;
            }

            const mechanicalPassed =
                actionResult.status === 'played' &&
                layerMatched &&
                resetPassed &&
                captureStatus === 'captured' &&
                phaseRows.every((phaseRow) =>
                    phaseRow.capture.readable &&
                    phaseRow.capture.visuallyNonBlank !== false);
            const compatibilityBefore = String(motion.compatibility || 'approved');
            const grade = mechanicalPassed
                ? compatibilityBefore === 'approved'
                    ? 'A'
                    : compatibilityBefore === 'rejected' ? 'C' : 'B'
                : 'C';
            motions.push({
                id,
                displayName: motion.displayName || id,
                sourceId: motion.sourceId || '',
                driver: resolveMotionDriver(characterPackage, motion),
                expectedLayer,
                loop: Boolean(motion.loop),
                compatibilityBefore,
                playbackStatus: actionResult.status || 'failed',
                playbackDetail: actionResult.detail || '',
                layerMatched,
                activeLayer: activeLayer || null,
                resetPassed,
                captureStatus,
                capture,
                screenshotPath,
                phases: phaseRows.map((phaseRow) => ({
                    phase: phaseRow.phase,
                    screenshotPath: phaseRow.screenshotPath,
                    captureStatus: phaseRow.captureStatus,
                    capture: phaseRow.capture,
                    layer: phaseRow.snapshot?.layers?.find(
                        (layer) => layer.id === expectedLayer) || null
                })),
                grade,
                recommendedCompatibility:
                    grade === 'A' ? 'approved' : grade === 'B' ? 'review' : 'rejected'
            });
        }

        const expressionIds = (characterPackage.vrmExpressionProfile?.bindings || [])
            .map((binding) => String(binding.id || binding.preset || ''))
            .filter(Boolean);
        for (const id of expressionIds) {
            await sendMessageToPort({
                type: 'persona.surface',
                requestId: `accept-expression-${safeFileName(id)}-${Date.now()}`,
                surface: {
                    emotion: id,
                    taskState: 'idle',
                    gestureIntent: 'none',
                    gazeTarget: 'user',
                    intensity: 1,
                    speechEnergy: 0,
                    speechText: ''
                }
            }, commandPort);
            await wait(320);
            const snapshot = await requestAnimationSnapshot(
                eventInbox,
                commandPort,
                `expression-${safeFileName(id)}`
            );
            const observedWeight = weightFor(snapshot, 'expressionWeights', id);
            const screenshotPath = path.join(
                frameDirectory,
                `expression-${safeFileName(id)}.png`);
            const captureResult = await captureRuntimeFrame(
                eventInbox,
                commandPort,
                screenshotPath,
                `expression-${safeFileName(id)}`
            );
            const capture = await analyzeCapturedFrame(screenshotPath);
            const passed = observedWeight >= 0.35 &&
                captureResult.status === 'captured' &&
                capture.readable && capture.visuallyNonBlank !== false;
            expressions.push({
                id,
                observedWeight,
                capture,
                screenshotPath,
                grade: passed ? 'A' : 'C'
            });
        }

        for (const id of ['aa', 'ih', 'ou', 'ee', 'oh']) {
            await sendMessageToPort({
                type: 'persona.lip',
                requestId: `accept-lip-${id}-${Date.now()}`,
                lip: {
                    mode: 'viseme',
                    viseme: id,
                    weight: 0.82,
                    durationSeconds: 1,
                    timestamp: Date.now()
                }
            }, commandPort);
            await wait(100);
            const snapshot = await requestAnimationSnapshot(
                eventInbox,
                commandPort,
                `lip-${id}`
            );
            const screenshotPath = path.join(frameDirectory, `lip-${id}.png`);
            await captureRuntimeFrame(
                eventInbox,
                commandPort,
                screenshotPath,
                `lip-${id}`
            );
            const capture = await analyzeCapturedFrame(screenshotPath);
            const observedWeight = Number(snapshot?.activeVisemeWeight || 0);
            const observedViseme = String(snapshot?.activeViseme || '');
            directVisemes.push({
                id,
                observedViseme,
                observedWeight,
                lipMode: snapshot?.lipMode || '',
                capture,
                screenshotPath,
                grade: observedViseme === id && observedWeight >= 0.75 ? 'A' : 'C'
            });
        }

        await sendMessageToPort({
            type: 'persona.speech.start',
            requestId: `accept-pcm-start-${Date.now()}`,
            mode: 'audio'
        }, commandPort);
        const pcmSamples = createPcm16SineBase64();
        let pcmBestSnapshot = null;
        for (let sequence = 0; sequence < 6; sequence += 1) {
            await sendMessageToPort({
                type: 'persona.audio.samples',
                requestId: `accept-pcm-${sequence}-${Date.now()}`,
                audio: {
                    encoding: 'pcm_s16le_base64',
                    samplesBase64: pcmSamples,
                    sampleRate: 48_000,
                    channels: 1,
                    sequence,
                    timestamp: Date.now()
                }
            }, commandPort);
            await wait(70);
            const snapshot = await requestAnimationSnapshot(
                eventInbox,
                commandPort,
                `pcm-${sequence}`
            );
            if (Number(snapshot?.activeVisemeWeight || 0) >
                Number(pcmBestSnapshot?.activeVisemeWeight || 0)) {
                pcmBestSnapshot = snapshot;
            }
        }
        pcm = {
            grade: Number(pcmBestSnapshot?.activeVisemeWeight || 0) > 0.01
                ? 'A'
                : 'C',
            observedViseme: String(pcmBestSnapshot?.activeViseme || ''),
            observedWeight: Number(pcmBestSnapshot?.activeVisemeWeight || 0),
            lipMode: pcmBestSnapshot?.lipMode || ''
        };
        await sendMessageToPort({
            type: 'persona.speech.stop',
            requestId: `accept-pcm-stop-${Date.now()}`
        }, commandPort);
        await wait(320);
        const stopped = await requestAnimationSnapshot(
            eventInbox,
            commandPort,
            'pcm-stopped'
        );
        stopPassed = !stopped?.speechActive &&
            Number(stopped?.activeVisemeWeight || 0) <= 0.001;
    } finally {
        eventInbox.close();
        if (!processHandle.killed) {
            processHandle.kill();
        }
    }

    const motionSheets = await createContactSheets(
        motions,
        outputDirectory,
        'motions');
    const expressionSheets = await createContactSheets(
        expressions,
        outputDirectory,
        'expressions',
        3);
    const lipSheets = await createContactSheets(
        directVisemes,
        outputDirectory,
        'lip',
        5);
    const report = {
        schema: 'ailis.character-acceptance-report.v1',
        generatedAt: new Date().toISOString(),
        packageId,
        displayName: characterPackage.displayName || packageId,
        manifestPath,
        reportPath,
        policy: {
            A: 'runtime and visual evidence pass; eligible for automatic scheduling',
            B: 'runtime pass; manual Character Lab use only pending art review',
            C: 'runtime evidence failed; disable until repaired'
        },
        summary: {
            motionCount: motions.length,
            motionGradeA: motions.filter((item) => item.grade === 'A').length,
            motionGradeB: motions.filter((item) => item.grade === 'B').length,
            motionGradeC: motions.filter((item) => item.grade === 'C').length,
            expressionCount: expressions.length,
            expressionPassed: expressions.filter((item) => item.grade === 'A').length,
            directVisemePassed: directVisemes.filter((item) => item.grade === 'A').length
        },
        motions,
        expressions,
        lip: { directVisemes, pcm, stopPassed },
        contactSheets: { motionSheets, expressionSheets, lipSheets },
        unityLogPath: logPath
    };
    fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
    writeCharacterAcceptanceMarkdown(report, markdownPath);
    console.log(JSON.stringify({
        status:
            report.summary.motionGradeC === 0 &&
            report.summary.expressionPassed === report.summary.expressionCount &&
            report.summary.directVisemePassed === 5 &&
            report.lip.pcm.grade === 'A' &&
            report.lip.stopPassed
                ? 'passed_with_visual_review'
                : 'review_required',
        reportPath,
        markdownPath,
        summary: report.summary,
        pcm: report.lip.pcm,
        stopPassed: report.lip.stopPassed,
        contactSheets: report.contactSheets
    }, null, 2));
}

function applyCharacterAcceptanceReview(options) {
    const packageId = String(options.package || 'ailis-default');
    const reviewPath = options.review
        ? path.resolve(String(options.review))
        : path.join(
            PROJECT_ROOT,
            'Reviews',
            `${packageId}-acceptance-v1.json`);
    if (!fs.existsSync(reviewPath)) {
        throw new Error(`Character acceptance review does not exist: ${reviewPath}`);
    }
    const review = JSON.parse(fs.readFileSync(reviewPath, 'utf8'));
    if (review.packageId !== packageId) {
        throw new Error(
            `Review package ${review.packageId} does not match ${packageId}.`);
    }
    const gradeRows = new Map();
    for (const grade of ['A', 'B', 'C']) {
        for (const entry of review.grades?.[grade] || []) {
            const row = typeof entry === 'string' ? { id: entry } : entry;
            if (!row?.id || gradeRows.has(row.id)) {
                throw new Error(`Invalid or duplicate review motion: ${row?.id || ''}`);
            }
            gradeRows.set(row.id, {
                grade,
                reason: String(row.reason || '')
            });
        }
    }

    const reportPath = path.join(
        CHARACTER_ACCEPTANCE_LOG,
        packageId,
        'acceptance-report.json');
    const report = fs.existsSync(reportPath)
        ? JSON.parse(fs.readFileSync(reportPath, 'utf8'))
        : null;
    const unreviewedMechanicalFailures = (report?.motions || [])
        .filter((motion) =>
            motion.playbackStatus !== 'played' ||
            !motion.layerMatched ||
            !motion.resetPassed ||
            motion.captureStatus !== 'captured' ||
            motion.phases?.some((phase) =>
                !phase.capture?.readable ||
                phase.capture?.visuallyNonBlank === false))
        .filter((motion) => gradeRows.get(motion.id)?.grade !== 'C')
        .map((motion) => motion.id);
    if (unreviewedMechanicalFailures.length > 0) {
        throw new Error(
            'Acceptance review cannot promote current mechanical failures: ' +
            unreviewedMechanicalFailures.join(', '));
    }

    const manifestCandidates = [
        path.join(STREAMING_ASSETS, 'ailis-character.json'),
        path.join(
            STREAMING_ASSETS,
            'Characters',
            packageId,
            'ailis-character.json'),
        path.join(RUNTIME_PACKAGES, packageId, 'ailis-character.json'),
        path.join(
            BUILD_STREAMING_ASSETS,
            'Characters',
            packageId,
            'ailis-character.json'),
        path.join(BUILD_STREAMING_ASSETS, 'ailis-character.json')
    ];
    const updatedManifests = [];
    for (const manifestPath of manifestCandidates) {
        if (!fs.existsSync(manifestPath)) {
            continue;
        }
        const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
        if (manifest.id !== packageId) {
            continue;
        }
        const motions = Array.isArray(manifest.motions) ? manifest.motions : [];
        const missing = motions.filter((motion) => !gradeRows.has(motion.id));
        if (missing.length > 0 || gradeRows.size !== motions.length) {
            throw new Error(
                `Review coverage mismatch for ${manifestPath}: ` +
                `${gradeRows.size} grades for ${motions.length} motions; ` +
                `missing=${missing.map((motion) => motion.id).join(',')}`);
        }
        manifest.motions = motions.map((motion) => {
            const reviewRow = gradeRows.get(motion.id);
            return {
                ...motion,
                compatibility:
                    reviewRow.grade === 'A'
                        ? 'approved'
                        : reviewRow.grade === 'B' ? 'review' : 'rejected',
                acceptanceGrade: reviewRow.grade,
                acceptanceNote: reviewRow.reason
            };
        });
        manifest.acceptance = {
            schema: review.schema,
            reviewedAt: review.reviewedAt,
            evidenceReport: review.evidenceReport,
            gradeCounts: {
                A: [...gradeRows.values()].filter((row) => row.grade === 'A').length,
                B: [...gradeRows.values()].filter((row) => row.grade === 'B').length,
                C: [...gradeRows.values()].filter((row) => row.grade === 'C').length
            }
        };
        fs.writeFileSync(
            manifestPath,
            `${JSON.stringify(manifest, null, 2)}\n`,
            'utf8');
        updatedManifests.push(manifestPath);
    }

    if (report) {
        for (const motion of report.motions || []) {
            const reviewRow = gradeRows.get(motion.id);
            motion.grade = reviewRow.grade;
            motion.visualReview = {
                status: reviewRow.grade === 'C' ? 'failed' : 'completed',
                reason: reviewRow.reason
            };
            motion.recommendedCompatibility =
                reviewRow.grade === 'A'
                    ? 'approved'
                    : reviewRow.grade === 'B' ? 'review' : 'rejected';
        }
        report.summary.motionGradeA = report.motions.filter(
            (motion) => motion.grade === 'A').length;
        report.summary.motionGradeB = report.motions.filter(
            (motion) => motion.grade === 'B').length;
        report.summary.motionGradeC = report.motions.filter(
            (motion) => motion.grade === 'C').length;
        report.reviewPath = reviewPath;
        fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
        writeCharacterAcceptanceMarkdown(
            report,
            path.join(path.dirname(reportPath), 'acceptance-report.md'));
    }

    console.log(JSON.stringify({
        status: 'applied',
        packageId,
        reviewPath,
        gradeCounts: {
            A: [...gradeRows.values()].filter((row) => row.grade === 'A').length,
            B: [...gradeRows.values()].filter((row) => row.grade === 'B').length,
            C: [...gradeRows.values()].filter((row) => row.grade === 'C').length
        },
        updatedManifests
    }, null, 2));
}

function numberOption(options, key, fallback) {
    const value = Number(options[key]);
    return Number.isFinite(value) ? value : fallback;
}

async function send(options) {
    const message = {
        type: 'persona.surface',
        requestId: options['request-id'] || `demo-${Date.now()}`,
        surface: {
            emotion: options.emotion || 'happy',
            taskState: options['task-state'] || 'speaking',
            gestureIntent: options['gesture-intent'] || 'greeting',
            gazeTarget: options.gaze || 'user',
            intensity: numberOption(options, 'intensity', 0.72),
            speechEnergy: numberOption(options, 'speech-energy', 0.48),
            speechText: options['speech-text'] || options.text || '',
            speechDurationSeconds: numberOption(options, 'duration', 0)
        }
    };
    await sendMessage(message, options);
}

function booleanOption(options, key, fallback) {
    if (!(key in options)) {
        return fallback;
    }
    return ['1', 'true', 'yes', 'on'].includes(String(options[key]).toLowerCase());
}

async function sendMessage(message, options = {}) {
    const payload = Buffer.from(JSON.stringify(message), 'utf8');
    const socket = dgram.createSocket('udp4');
    const timeoutMs = numberOption(options, 'timeout-ms', 2500);
    await new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
            socket.close();
            reject(new Error(`Unity renderer did not acknowledge within ${timeoutMs}ms.`));
        }, timeoutMs);
        socket.once('message', (reply) => {
            clearTimeout(timer);
            socket.close();
            console.log(reply.toString('utf8'));
            resolve();
        });
        socket.send(payload, 19131, '127.0.0.1', (error) => {
            if (error) {
                clearTimeout(timer);
                socket.close();
                reject(error);
            }
        });
    });
}

async function sendAction(options) {
    if (!options.id) {
        throw new Error('action requires --id.');
    }
    await sendMessage({
        type: 'character.action',
        requestId: options['request-id'] || `action-${Date.now()}`,
        action: { motionId: options.id }
    }, options);
}

async function sendLip(options) {
    await sendMessage({
        type: 'persona.lip',
        requestId: options['request-id'] || `lip-${Date.now()}`,
        lip: {
            mode: options.mode || 'viseme',
            viseme: options.viseme || 'aa',
            weight: numberOption(options, 'weight', 0.7),
            durationSeconds: numberOption(options, 'duration', 0.14),
            timestamp: Date.now()
        }
    }, options);
}

async function configure(options) {
    const profileDefaults = {
        performance: {
            renderScale: 0.85,
            msaaSampleCount: 2,
            shadowDistance: 8,
            shadowCascadeCount: 1
        },
        balanced: {
            renderScale: 1,
            msaaSampleCount: 4,
            shadowDistance: 12,
            shadowCascadeCount: 2
        },
        quality: {
            renderScale: 1,
            msaaSampleCount: 4,
            shadowDistance: 18,
            shadowCascadeCount: 4
        }
    };
    const requestedProfile = String(options.pipeline || options.quality || 'balanced').toLowerCase();
    const pipelineAsset = requestedProfile === 'crisp' || requestedProfile === 'ultra'
        ? 'quality'
        : requestedProfile;
    const preset = profileDefaults[pipelineAsset] || profileDefaults.balanced;
    await sendMessage({
        type: 'renderer.configure',
        requestId: options['request-id'] || `configure-${Date.now()}`,
        renderer: {
            schema: 'ailis.character-renderer-settings.v3',
            pipelineAsset: profileDefaults[pipelineAsset] ? pipelineAsset : 'balanced',
            renderScale: numberOption(options, 'render-scale', preset.renderScale),
            msaaSampleCount: numberOption(
                options,
                'msaa',
                numberOption(options, 'aa', preset.msaaSampleCount)),
            shadowDistance: numberOption(options, 'shadow-distance', preset.shadowDistance),
            shadowCascadeCount: numberOption(
                options,
                'shadow-cascades',
                preset.shadowCascadeCount),
            cameraAntialiasing: options['camera-aa'] || 'none',
            cameraAntialiasingQuality: options['camera-aa-quality'] || 'medium',
            renderPostProcessing: booleanOption(options, 'post-processing', false),
            postExposure: numberOption(options, 'exposure', 0),
            contrast: numberOption(options, 'contrast', 0),
            saturation: numberOption(options, 'saturation', 0),
            bloomIntensity: numberOption(options, 'bloom', 0),
            targetFrameRate: numberOption(options, 'fps', 60),
            cameraFramingMode: options.framing || 'full-body',
            cameraFieldOfView: numberOption(options, 'fov', 38),
            cameraDistance: numberOption(options, 'camera-distance', 2.15),
            cameraHeight: numberOption(options, 'camera-height', 1.3),
            cameraTargetHeight: numberOption(options, 'target-height', 1.18),
            ambientIntensity: numberOption(options, 'ambient-intensity', 0.72),
            mainLightShadows: booleanOption(options, 'main-light-shadows', true),
            mainLightShadowStrength: numberOption(options, 'shadow-strength', 0.82),
            keyLightIntensity: numberOption(options, 'key-light', 0.92),
            fillLightIntensity: numberOption(options, 'fill-light', 0.4),
            rimLightIntensity: numberOption(options, 'rim-light', 0.52),
            showDebugOverlay: booleanOption(options, 'debug-overlay', false),
            lipSyncMode: options['lip-sync'] || 'energy'
        }
    }, options);

    if ('width' in options || 'height' in options || 'x' in options || 'y' in options) {
        await sendMessage({
            type: 'renderer.window',
            requestId: options['request-id'] || `window-${Date.now()}`,
            window: {
                x: numberOption(options, 'x', 0),
                y: numberOption(options, 'y', 0),
                width: numberOption(options, 'width', 720),
                height: numberOption(options, 'height', 960)
            }
        }, options);
    }
}

async function protocolTest() {
    const server = dgram.createSocket('udp4');
    await new Promise((resolve, reject) => {
        server.once('error', reject);
        server.bind(19131, '127.0.0.1', resolve);
    });
    server.once('message', (buffer, remote) => {
        const message = JSON.parse(buffer.toString('utf8'));
        const reply = Buffer.from(JSON.stringify({
            type: 'renderer.surface.applied',
            requestId: message.requestId,
            status: message.type === 'persona.surface' ? 'ok' : 'invalid_message',
            detail: `${message.surface?.emotion || ''}/${message.surface?.taskState || ''}`
        }));
        server.send(reply, remote.port, remote.address);
    });
    try {
        await send({
            emotion: 'happy',
            'task-state': 'speaking',
            'speech-energy': '0.6'
        });
        console.log('AILIS Unity persona.surface protocol round trip passed.');
    } finally {
        server.close();
    }
}

const { command, options } = parseArgs(process.argv.slice(2));
try {
    if (command === 'doctor') {
        doctor();
    } else if (command === 'prepare') {
        prepare();
    } else if (command === 'build') {
        build();
    } else if (command === 'import-package') {
        importCharacterPackage(options);
    } else if (command === 'activate-package') {
        activateCharacterPackage(options);
    } else if (command === 'cleanup-package-source') {
        cleanupCharacterPackage(options);
    } else if (command === 'start') {
        start();
    } else if (command === 'validate-motions') {
        validateMotionCompatibility(options);
    } else if (command === 'validate-action-maps') {
        await validateCharacterActionMaps(options);
    } else if (command === 'accept-character') {
        await validateCharacterAcceptance(options);
    } else if (command === 'apply-character-review') {
        applyCharacterAcceptanceReview(options);
    } else if (command === 'send') {
        await send(options);
    } else if (command === 'action') {
        await sendAction(options);
    } else if (command === 'lip') {
        await sendLip(options);
    } else if (command === 'configure') {
        await configure(options);
    } else if (command === 'protocol-test') {
        await protocolTest();
    } else {
        throw new Error(`Unknown Unity demo command: ${command}`);
    }
} catch (error) {
    console.error(error.message || error);
    process.exitCode = 1;
}
