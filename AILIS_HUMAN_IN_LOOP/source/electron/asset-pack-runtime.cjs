const fs = require('fs');
const fsp = require('fs/promises');
const path = require('path');

const STATE_FILE_NAME = 'asset-pack-state.json';
const MANIFEST_FILE_NAME = 'manifest.json';
const SUPPORTED_TYPES = new Set(['character_pack', 'skin_pack']);
const DEFAULT_CHARACTER_ID = 'ailis.default';

function normalizeString(value, fallback = '') {
    return typeof value === 'string' ? value.trim() || fallback : fallback;
}

function normalizePackId(value = '') {
    return normalizeString(value)
        .replace(/\\/g, '/')
        .replace(/[^a-zA-Z0-9._-]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 96);
}

function isPathInsideRoot(candidatePath, rootPath) {
    const relativePath = path.relative(rootPath, candidatePath);
    return relativePath === '' || (
        Boolean(relativePath) &&
        !relativePath.startsWith('..') &&
        !path.isAbsolute(relativePath)
    );
}

function resolveInsideRoot(rootPath, relativePath = '') {
    const normalizedRelativePath = normalizeString(relativePath)
        .replace(/\\/g, '/')
        .replace(/^\/+/, '');
    if (!normalizedRelativePath || normalizedRelativePath.includes('\0')) {
        throw new Error('资源路径不能为空。');
    }
    const candidatePath = path.resolve(rootPath, normalizedRelativePath);
    if (!isPathInsideRoot(candidatePath, rootPath)) {
        throw new Error(`资源路径越界：${relativePath}`);
    }
    return candidatePath;
}

function readJsonFile(filePath, fallback = null) {
    try {
        return JSON.parse(fs.readFileSync(filePath, 'utf8').replace(/^\uFEFF/, ''));
    } catch {
        return fallback;
    }
}

async function copyDirectoryContents(sourceDir, targetDir) {
    await fsp.rm(targetDir, { recursive: true, force: true });
    await fsp.mkdir(path.dirname(targetDir), { recursive: true });
    await fsp.cp(sourceDir, targetDir, {
        recursive: true,
        force: true,
        errorOnExist: false,
        filter: (sourcePath) => {
            const basename = path.basename(sourcePath);
            return basename !== 'node_modules' && basename !== '.git';
        }
    });
}

class AssetPackRuntime {
    constructor({ userDataPath, projectRoot, appVersion = '' } = {}) {
        this.userDataPath = userDataPath;
        this.projectRoot = projectRoot;
        this.appVersion = appVersion;
        this.rootDir = path.join(userDataPath, 'asset-packs');
        this.installedDir = path.join(this.rootDir, 'installed');
        this.downloadsDir = path.join(this.rootDir, 'downloads');
        this.cacheDir = path.join(this.rootDir, 'cache');
        this.statePath = path.join(this.rootDir, STATE_FILE_NAME);
    }

    ensureDirs() {
        fs.mkdirSync(this.installedDir, { recursive: true });
        fs.mkdirSync(this.downloadsDir, { recursive: true });
        fs.mkdirSync(this.cacheDir, { recursive: true });
    }

    loadState() {
        this.ensureDirs();
        const state = readJsonFile(this.statePath, {}) || {};
        return {
            activeCharacterPackId: normalizeString(state.activeCharacterPackId),
            activeSkinPackId: normalizeString(state.activeSkinPackId),
            updatedAt: normalizeString(state.updatedAt)
        };
    }

    async saveState(nextState = {}) {
        this.ensureDirs();
        const state = {
            activeCharacterPackId: normalizeString(nextState.activeCharacterPackId),
            activeSkinPackId: normalizeString(nextState.activeSkinPackId),
            updatedAt: new Date().toISOString()
        };
        await fsp.writeFile(this.statePath, JSON.stringify(state, null, 2), 'utf8');
        return state;
    }

    getInstallDir(packId) {
        const normalizedId = normalizePackId(packId);
        if (!normalizedId) {
            throw new Error('人物包 ID 无效。');
        }
        return path.join(this.installedDir, normalizedId);
    }

    getManifestPath(packDir) {
        return path.join(packDir, MANIFEST_FILE_NAME);
    }

    readManifestFromDir(packDir) {
        const manifestPath = this.getManifestPath(packDir);
        if (!fs.existsSync(manifestPath)) {
            throw new Error(`缺少 ${MANIFEST_FILE_NAME}`);
        }
        const manifest = readJsonFile(manifestPath);
        if (!manifest || typeof manifest !== 'object') {
            throw new Error('manifest.json 不是有效 JSON。');
        }
        return this.normalizeManifest(manifest, packDir);
    }

    normalizeManifest(manifest = {}, packDir = '') {
        const id = normalizePackId(manifest.id);
        if (!id) {
            throw new Error('manifest.id 不能为空。');
        }
        const type = normalizeString(manifest.type, 'character_pack');
        if (!SUPPORTED_TYPES.has(type)) {
            throw new Error(`不支持的人物资产类型：${type}`);
        }
        const displayName = normalizeString(manifest.displayName || manifest.name, id);
        const version = normalizeString(manifest.version, '0.0.0');
        const assets = manifest.assets && typeof manifest.assets === 'object'
            ? manifest.assets
            : {};
        const vrm = normalizeString(assets.vrm);
        if (vrm) {
            const vrmPath = resolveInsideRoot(packDir, vrm);
            if (!fs.existsSync(vrmPath)) {
                throw new Error(`VRM 资源不存在：${vrm}`);
            }
        }
        for (const optionalPath of [
            assets.renderProfile,
            assets.personaStyle,
            assets.voiceProfile,
            assets.expressions
        ]) {
            if (optionalPath) {
                const candidatePath = resolveInsideRoot(packDir, optionalPath);
                if (!fs.existsSync(candidatePath)) {
                    throw new Error(`资源不存在：${optionalPath}`);
                }
            }
        }
        return {
            schemaVersion: Number(manifest.schemaVersion) || 1,
            id,
            type,
            displayName,
            version,
            publisher: normalizeString(manifest.publisher, 'Local'),
            description: normalizeString(manifest.description),
            assets: {
                vrm,
                renderProfile: normalizeString(assets.renderProfile),
                personaStyle: normalizeString(assets.personaStyle),
                voiceProfile: normalizeString(assets.voiceProfile),
                expressions: normalizeString(assets.expressions)
            },
            renderProfileId: normalizeString(manifest.renderProfileId),
            compatibility: manifest.compatibility && typeof manifest.compatibility === 'object'
                ? manifest.compatibility
                : {},
            installedAt: normalizeString(manifest.installedAt)
        };
    }

    listInstalledPacks() {
        this.ensureDirs();
        const entries = fs.readdirSync(this.installedDir, { withFileTypes: true })
            .filter((entry) => entry.isDirectory())
            .map((entry) => path.join(this.installedDir, entry.name));
        const packs = [];
        for (const packDir of entries) {
            try {
                const manifest = this.readManifestFromDir(packDir);
                packs.push({
                    ...manifest,
                    installedDir: packDir,
                    installedAt: manifest.installedAt || fs.statSync(packDir).mtime.toISOString()
                });
            } catch (error) {
                packs.push({
                    id: path.basename(packDir),
                    type: 'broken',
                    displayName: path.basename(packDir),
                    version: '',
                    installedDir: packDir,
                    error: error.message || String(error)
                });
            }
        }
        return packs.sort((left, right) => (
            String(left.displayName || left.id).localeCompare(String(right.displayName || right.id))
        ));
    }

    getPack(packId) {
        const packs = this.listInstalledPacks();
        return packs.find((pack) => pack.id === packId) || null;
    }

    createAssetUrl(packId, assetPath = '') {
        const normalizedId = normalizePackId(packId);
        const cleanAssetPath = normalizeString(assetPath)
            .replace(/\\/g, '/')
            .replace(/^\/+/, '');
        if (!normalizedId || !cleanAssetPath) {
            return '';
        }
        return `ailis-asset:///${encodeURIComponent(normalizedId)}/${cleanAssetPath
            .split('/')
            .filter(Boolean)
            .map((segment) => encodeURIComponent(segment))
            .join('/')}`;
    }

    readPackJson(pack, relativePath = '') {
        if (!pack?.installedDir || !relativePath) {
            return null;
        }
        const filePath = resolveInsideRoot(pack.installedDir, relativePath);
        if (!fs.existsSync(filePath)) {
            return null;
        }
        return readJsonFile(filePath, null);
    }

    resolvePackRenderProfileId(pack = null) {
        if (!pack) {
            return '';
        }
        return pack.renderProfileId ||
            this.readPackJson(pack, pack.assets?.renderProfile)?.renderProfileId ||
            '';
    }

    getDefaultEffectiveCharacter() {
        return {
            id: DEFAULT_CHARACTER_ID,
            type: 'builtin',
            displayName: 'AILIS 默认人物',
            modelUrl: '',
            renderProfileId: '',
            personaStyle: null,
            voiceProfile: null,
            source: 'builtin'
        };
    }

    createEffectiveCharacter({ characterPack = null, skinPack = null } = {}) {
        if (!characterPack && !skinPack) {
            return this.getDefaultEffectiveCharacter();
        }

        const modelSource = skinPack?.assets?.vrm ? skinPack : characterPack;
        const skinRenderProfileId = this.resolvePackRenderProfileId(skinPack);
        const characterRenderProfileId = this.resolvePackRenderProfileId(characterPack);
        const renderProfileSource = skinRenderProfileId
            ? skinPack
            : characterPack;
        const characterPersonaStyle = this.readPackJson(characterPack, characterPack?.assets?.personaStyle);
        const skinPersonaStyle = this.readPackJson(skinPack, skinPack?.assets?.personaStyle);
        const characterVoiceProfile = this.readPackJson(characterPack, characterPack?.assets?.voiceProfile);
        const skinVoiceProfile = this.readPackJson(skinPack, skinPack?.assets?.voiceProfile);
        const activeLayers = [characterPack, skinPack].filter(Boolean);
        const effectiveType = characterPack && skinPack
            ? 'character_skin_composite'
            : activeLayers[0]?.type || 'asset_pack';

        return {
            id: activeLayers.map((pack) => pack.id).join('+'),
            type: effectiveType,
            displayName: activeLayers.map((pack) => pack.displayName || pack.id).join(' + '),
            modelUrl: modelSource?.assets?.vrm
                ? this.createAssetUrl(modelSource.id, modelSource.assets.vrm)
                : '',
            renderProfileId: skinRenderProfileId || characterRenderProfileId,
            personaStyle: characterPersonaStyle || skinPersonaStyle
                ? {
                    ...(characterPersonaStyle || {}),
                    ...(skinPersonaStyle || {})
                }
                : null,
            voiceProfile: skinVoiceProfile || characterVoiceProfile || null,
            source: 'asset_pack',
            requiresReloadForModel: Boolean(modelSource?.assets?.vrm),
            layers: {
                characterPackId: characterPack?.id || '',
                skinPackId: skinPack?.id || '',
                modelSourcePackId: modelSource?.id || '',
                renderProfileSourcePackId: renderProfileSource?.id || ''
            }
        };
    }

    getSnapshot() {
        const state = this.loadState();
        const packs = this.listInstalledPacks();
        const activeCharacterPack = packs.find((pack) => pack.id === state.activeCharacterPackId) || null;
        const activeSkinPack = packs.find((pack) => pack.id === state.activeSkinPackId) || null;
        const effective = this.createEffectiveCharacter({
            characterPack: activeCharacterPack,
            skinPack: activeSkinPack
        });

        return {
            ok: true,
            rootDir: this.rootDir,
            installedDir: this.installedDir,
            packs,
            active: {
                characterPackId: activeCharacterPack?.id || '',
                skinPackId: activeSkinPack?.id || ''
            },
            effective
        };
    }

    async installFromPath(sourcePath) {
        this.ensureDirs();
        const resolvedSource = path.resolve(sourcePath || '');
        const sourceStats = await fsp.stat(resolvedSource).catch(() => null);
        if (!sourceStats?.isDirectory()) {
            throw new Error('请选择包含 manifest.json 的人物包目录。');
        }
        const manifest = this.readManifestFromDir(resolvedSource);
        const targetDir = this.getInstallDir(manifest.id);
        await copyDirectoryContents(resolvedSource, targetDir);
        const installedManifestPath = this.getManifestPath(targetDir);
        const installedManifest = {
            ...manifest,
            installedAt: new Date().toISOString()
        };
        await fsp.writeFile(installedManifestPath, JSON.stringify(installedManifest, null, 2), 'utf8');
        return {
            ok: true,
            installed: this.readManifestFromDir(targetDir),
            snapshot: this.getSnapshot()
        };
    }

    async activate(packId) {
        const pack = this.getPack(packId);
        if (!pack || pack.type === 'broken') {
            throw new Error('找不到可启用的人物包/皮肤包。');
        }
        const state = this.loadState();
        if (pack.type === 'character_pack') {
            state.activeCharacterPackId = pack.id;
        } else if (pack.type === 'skin_pack') {
            state.activeSkinPackId = pack.id;
        }
        await this.saveState(state);
        return {
            ok: true,
            activated: pack,
            snapshot: this.getSnapshot()
        };
    }

    async resetActive(payload = {}) {
        const state = this.loadState();
        if (payload.type === 'skin_pack') {
            state.activeSkinPackId = '';
        } else if (payload.type === 'character_pack') {
            state.activeCharacterPackId = '';
        } else {
            state.activeCharacterPackId = '';
            state.activeSkinPackId = '';
        }
        await this.saveState(state);
        return {
            ok: true,
            snapshot: this.getSnapshot()
        };
    }

    async uninstall(packId) {
        const pack = this.getPack(packId);
        if (!pack) {
            throw new Error('找不到要卸载的人物包/皮肤包。');
        }
        const state = this.loadState();
        if (state.activeCharacterPackId === pack.id) {
            state.activeCharacterPackId = '';
        }
        if (state.activeSkinPackId === pack.id) {
            state.activeSkinPackId = '';
        }
        await fsp.rm(this.getInstallDir(pack.id), { recursive: true, force: true });
        await this.saveState(state);
        return {
            ok: true,
            removed: pack.id,
            snapshot: this.getSnapshot()
        };
    }

    resolveAssetPathFromUrl(requestUrl) {
        const targetUrl = new URL(requestUrl);
        const rawPath = decodeURIComponent([
            targetUrl.hostname || '',
            targetUrl.pathname || ''
        ].join('/'))
            .replace(/\\/g, '/')
            .replace(/\/+/g, '/')
            .replace(/^\/+/, '')
            .trim();
        const [packIdRaw, ...assetSegments] = rawPath.split('/').filter(Boolean);
        const packId = normalizePackId(packIdRaw);
        const assetPath = assetSegments.join('/');
        if (!packId || !assetPath) {
            throw new Error('缺少人物包资源路径。');
        }
        const packDir = this.getInstallDir(packId);
        const filePath = resolveInsideRoot(packDir, assetPath);
        if (!fs.existsSync(filePath)) {
            throw new Error(`人物包资源不存在：${packId}/${assetPath}`);
        }
        return filePath;
    }
}

module.exports = {
    AssetPackRuntime
};
