import crypto from 'crypto';
import fs from 'fs';
import fsp from 'fs/promises';
import path from 'path';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');
const PACKAGE_JSON = JSON.parse(await fsp.readFile(path.join(PROJECT_ROOT, 'package.json'), 'utf8'));
const VERSION = PACKAGE_JSON.version || '0.0.0';
const OUTPUT_ROOT = path.resolve(
    process.env.AILIS_RUNTIME_PACK_OUTPUT || 'F:/AILIS/Build/AILIS/runtime-packs'
);
const MANIFEST_ONLY = process.argv.includes('--manifest-only');

const EXCLUDE_SEGMENTS = new Set([
    '__pycache__',
    '.git',
    '.cache',
    'pip-cache',
    'downloads',
    'uv-cache'
]);

const COMPONENTS = [
    {
        id: 'python-runtime',
        title: 'AILIS private Python runtime',
        estimatedUnpackedSize: '50 MB',
        cwd: PROJECT_ROOT,
        paths: ['models/voice-runtime/python'],
        packName: `AILIS-Runtime-python-runtime-${VERSION}.zip`,
        extractTo: 'resources',
        installRoot: 'resources/models/voice-runtime/python'
    },
    {
        id: 'cosyvoice3-runtime',
        title: 'CosyVoice3 local TTS runtime',
        estimatedUnpackedSize: '11.7 GB',
        dependsOn: ['python-runtime'],
        cwd: PROJECT_ROOT,
        paths: [
            'models/voice-runtime/voice-venv',
            'models/voice-runtime/CosyVoice',
            'models/voice-runtime/voice-runtime-manifest.json'
        ],
        packName: `AILIS-Runtime-cosyvoice3-runtime-${VERSION}.zip`,
        extractTo: 'resources',
        installRoot: 'resources/models/voice-runtime'
    },
    {
        id: 'asr-runtime',
        title: 'Local ASR runtime',
        estimatedUnpackedSize: '4.8 GB',
        dependsOn: ['python-runtime'],
        cwd: path.join(PROJECT_ROOT, 'build-cache'),
        paths: ['ailis-asr-runtime'],
        packName: `AILIS-Runtime-asr-runtime-${VERSION}.zip`,
        extractTo: 'resources',
        installRoot: 'resources/ailis-asr-runtime'
    },
    {
        id: 'web-runtime',
        title: 'Local Web/Search runtime',
        estimatedUnpackedSize: '1.4 GB',
        cwd: path.join(PROJECT_ROOT, 'build-cache'),
        paths: ['ailis-web-runtime'],
        packName: `AILIS-Runtime-web-runtime-${VERSION}.zip`,
        extractTo: 'resources',
        installRoot: 'resources/ailis-web-runtime'
    }
];

function toPosixPath(value) {
    return String(value || '').replace(/\\/g, '/');
}

function shouldExclude(targetPath) {
    const segments = toPosixPath(targetPath).split('/');
    if (segments.some((segment) => EXCLUDE_SEGMENTS.has(segment))) {
        return true;
    }
    return /\.(pyc|pyo)$/i.test(targetPath);
}

async function pathExists(targetPath) {
    try {
        await fsp.access(targetPath);
        return true;
    } catch {
        return false;
    }
}

async function collectStats(targetPath) {
    if (!(await pathExists(targetPath))) {
        return { exists: false, files: 0, bytes: 0 };
    }
    const stat = await fsp.stat(targetPath);
    if (stat.isFile()) {
        return { exists: true, files: 1, bytes: stat.size };
    }
    let files = 0;
    let bytes = 0;
    const stack = [targetPath];
    while (stack.length) {
        const current = stack.pop();
        if (shouldExclude(current)) {
            continue;
        }
        const entries = await fsp.readdir(current, { withFileTypes: true });
        for (const entry of entries) {
            const child = path.join(current, entry.name);
            if (shouldExclude(child)) {
                continue;
            }
            if (entry.isDirectory()) {
                stack.push(child);
            } else if (entry.isFile()) {
                const childStat = await fsp.stat(child);
                files += 1;
                bytes += childStat.size;
            }
        }
    }
    return { exists: true, files, bytes };
}

async function collectComponentStats(component) {
    const stats = await Promise.all(
        component.paths.map((relativePath) => collectStats(path.join(component.cwd, relativePath)))
    );
    return {
        exists: stats.every((entry) => entry.exists),
        files: stats.reduce((sum, entry) => sum + entry.files, 0),
        bytes: stats.reduce((sum, entry) => sum + entry.bytes, 0)
    };
}

function getSevenZipPath() {
    const platform = process.platform;
    const arch = process.arch === 'arm64' ? 'arm64' : process.arch === 'ia32' ? 'ia32' : 'x64';
    const exeName = platform === 'win32' ? '7za.exe' : '7za';
    return path.join(PROJECT_ROOT, 'node_modules', '.pnpm', '7zip-bin@5.2.0', 'node_modules', '7zip-bin',
        platform === 'win32' ? 'win' : platform === 'darwin' ? 'mac' : 'linux',
        arch,
        exeName
    );
}

function run(command, args, options = {}) {
    return new Promise((resolve, reject) => {
        const child = spawn(command, args, {
            cwd: options.cwd || PROJECT_ROOT,
            stdio: 'inherit',
            windowsHide: true
        });
        child.on('error', reject);
        child.on('exit', (code) => {
            if (code === 0) {
                resolve();
            } else {
                reject(new Error(`${command} exited with ${code}`));
            }
        });
    });
}

async function hashFile(targetPath) {
    if (!(await pathExists(targetPath))) {
        return '';
    }
    const hash = crypto.createHash('sha256');
    await new Promise((resolve, reject) => {
        const stream = fs.createReadStream(targetPath);
        stream.on('data', (chunk) => hash.update(chunk));
        stream.on('error', reject);
        stream.on('end', resolve);
    });
    return hash.digest('hex');
}

async function createPack(component) {
    const sevenZip = getSevenZipPath();
    if (!(await pathExists(sevenZip))) {
        throw new Error(`7za not found: ${sevenZip}`);
    }
    const outputPath = path.join(OUTPUT_ROOT, component.packName);
    await fsp.mkdir(OUTPUT_ROOT, { recursive: true });
    await fsp.rm(outputPath, { force: true });
    const args = [
        'a',
        '-tzip',
        '-mx=5',
        outputPath,
        ...component.paths,
        '-xr!__pycache__',
        '-xr!*.pyc',
        '-xr!*.pyo',
        '-xr!.git',
        '-xr!.cache',
        '-xr!pip-cache',
        '-xr!downloads',
        '-xr!uv-cache'
    ];
    await run(sevenZip, args, { cwd: component.cwd });
    return outputPath;
}

async function main() {
    await fsp.mkdir(OUTPUT_ROOT, { recursive: true });
    const components = [];
    for (const component of COMPONENTS) {
        const stats = await collectComponentStats(component);
        const packPath = path.join(OUTPUT_ROOT, component.packName);
        if (!MANIFEST_ONLY && stats.exists) {
            await createPack(component);
        }
        const packedExists = await pathExists(packPath);
        const packedBytes = packedExists ? (await fsp.stat(packPath)).size : 0;
        components.push({
            id: component.id,
            title: component.title,
            dependsOn: component.dependsOn || [],
            estimatedUnpackedSize: component.estimatedUnpackedSize,
            availableLocally: stats.exists,
            sourcePaths: component.paths.map((relativePath) => path.resolve(component.cwd, relativePath)),
            installRoot: component.installRoot,
            extractTo: component.extractTo,
            packName: component.packName,
            packPath: packedExists ? packPath : '',
            unpackedBytes: stats.bytes,
            unpackedFiles: stats.files,
            packedBytes,
            sha256: packedExists ? await hashFile(packPath) : ''
        });
    }

    const manifest = {
        schemaVersion: 1,
        product: 'AILIS',
        version: VERSION,
        generatedAt: new Date().toISOString(),
        outputRoot: OUTPUT_ROOT,
        mode: MANIFEST_ONLY ? 'manifest-only' : 'packs-built',
        components
    };
    const manifestPath = path.join(OUTPUT_ROOT, `AILIS-Runtime-Components-${VERSION}.json`);
    await fsp.writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
    console.log(`[AILIS Runtime Packs] manifest: ${manifestPath}`);
    for (const component of components) {
        console.log(
            `[AILIS Runtime Packs] ${component.id}: ` +
            `${component.availableLocally ? 'available' : 'missing'}, ` +
            `${(component.unpackedBytes / 1024 / 1024).toFixed(1)} MB unpacked, ` +
            `${component.packedBytes ? `${(component.packedBytes / 1024 / 1024).toFixed(1)} MB packed` : 'not packed'}`
        );
    }
}

await main();
