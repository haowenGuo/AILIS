import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
    GESTURE_MOTION_MAP,
    listMotionLibrary
} from '../src/character/motion-library.js';
import {
    getLoadableMotionFiles,
    listMotionIntakeEntries
} from '../src/character/motion-intake-catalog.js';

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const REPOSITORY_ROOT = path.resolve(SCRIPT_DIR, '..');
const DEFAULT_MODEL_PATH = path.join(REPOSITORY_ROOT, 'Resources', 'AILIS.vrm');
const RESOURCE_ROOT = path.join(REPOSITORY_ROOT, 'Resources');
const GLB_MAGIC = 0x46546c67;
const JSON_CHUNK_TYPE = 0x4e4f534a;
const BINARY_CHUNK_TYPE = 0x004e4942;

function walkFiles(rootPath, predicate) {
    if (!fs.existsSync(rootPath)) {
        return [];
    }
    const files = [];
    const pending = [rootPath];
    while (pending.length) {
        const currentPath = pending.pop();
        for (const entry of fs.readdirSync(currentPath, { withFileTypes: true })) {
            const entryPath = path.join(currentPath, entry.name);
            if (entry.isDirectory()) {
                pending.push(entryPath);
            } else if (!predicate || predicate(entryPath)) {
                files.push(entryPath);
            }
        }
    }
    return files.sort();
}

function parseGlb(filePath) {
    const fileBuffer = fs.readFileSync(filePath);
    if (fileBuffer.length < 20 || fileBuffer.readUInt32LE(0) !== GLB_MAGIC) {
        throw new Error(`${filePath} is not a valid GLB/VRM file`);
    }

    const chunks = [];
    let offset = 12;
    while (offset + 8 <= fileBuffer.length) {
        const byteLength = fileBuffer.readUInt32LE(offset);
        const type = fileBuffer.readUInt32LE(offset + 4);
        const start = offset + 8;
        const end = start + byteLength;
        if (end > fileBuffer.length) {
            throw new Error(`${filePath} contains a truncated GLB chunk`);
        }
        chunks.push({
            type,
            buffer: fileBuffer.subarray(start, end)
        });
        offset = end;
    }

    const jsonChunk = chunks.find((chunk) => chunk.type === JSON_CHUNK_TYPE);
    if (!jsonChunk) {
        throw new Error(`${filePath} does not contain a GLB JSON chunk`);
    }

    const json = JSON.parse(jsonChunk.buffer.toString('utf8').replace(/\0+$/g, '').trim());
    const binaryChunk = chunks.find((chunk) => chunk.type === BINARY_CHUNK_TYPE)?.buffer || null;
    return { fileBuffer, json, binaryChunk };
}

function getAccessorCount(gltf, accessorIndex) {
    if (!Number.isInteger(accessorIndex)) {
        return 0;
    }
    return Number(gltf.accessors?.[accessorIndex]?.count) || 0;
}

function getImageBytes(gltf, binaryChunk, image) {
    if (!binaryChunk || !Number.isInteger(image?.bufferView)) {
        return null;
    }
    const bufferView = gltf.bufferViews?.[image.bufferView];
    if (!bufferView) {
        return null;
    }
    const start = Number(bufferView.byteOffset) || 0;
    const end = start + (Number(bufferView.byteLength) || 0);
    return binaryChunk.subarray(start, end);
}

function readPngDimensions(buffer) {
    if (
        !buffer ||
        buffer.length < 24 ||
        buffer.readUInt32BE(0) !== 0x89504e47 ||
        buffer.toString('ascii', 12, 16) !== 'IHDR'
    ) {
        return null;
    }
    return {
        width: buffer.readUInt32BE(16),
        height: buffer.readUInt32BE(20)
    };
}

function readJpegDimensions(buffer) {
    if (!buffer || buffer.length < 4 || buffer[0] !== 0xff || buffer[1] !== 0xd8) {
        return null;
    }
    let offset = 2;
    while (offset + 9 < buffer.length) {
        if (buffer[offset] !== 0xff) {
            offset += 1;
            continue;
        }
        const marker = buffer[offset + 1];
        const segmentLength = buffer.readUInt16BE(offset + 2);
        const isStartOfFrame = (
            marker >= 0xc0 &&
            marker <= 0xc3
        ) || (
            marker >= 0xc5 &&
            marker <= 0xc7
        ) || (
            marker >= 0xc9 &&
            marker <= 0xcb
        ) || (
            marker >= 0xcd &&
            marker <= 0xcf
        );
        if (isStartOfFrame && offset + 8 < buffer.length) {
            return {
                width: buffer.readUInt16BE(offset + 7),
                height: buffer.readUInt16BE(offset + 5)
            };
        }
        if (segmentLength < 2) {
            break;
        }
        offset += 2 + segmentLength;
    }
    return null;
}

function getImageDimensions(gltf, binaryChunk, image) {
    const imageBytes = getImageBytes(gltf, binaryChunk, image);
    return readPngDimensions(imageBytes) || readJpegDimensions(imageBytes);
}

function summarizeModel(modelPath) {
    const { fileBuffer, json: gltf, binaryChunk } = parseGlb(modelPath);
    const primitives = (gltf.meshes || []).flatMap((mesh) => mesh.primitives || []);
    const triangleCount = primitives.reduce((sum, primitive) => (
        sum + Math.floor(getAccessorCount(gltf, primitive.indices) / 3)
    ), 0);
    const vertexCount = primitives.reduce((sum, primitive) => (
        sum + getAccessorCount(gltf, primitive.attributes?.POSITION)
    ), 0);
    const morphTargetCount = primitives.reduce((sum, primitive) => (
        sum + (Array.isArray(primitive.targets) ? primitive.targets.length : 0)
    ), 0);
    const imageDimensions = (gltf.images || [])
        .map((image) => getImageDimensions(gltf, binaryChunk, image))
        .filter(Boolean);
    const maxTextureWidth = Math.max(0, ...imageDimensions.map((item) => item.width));
    const maxTextureHeight = Math.max(0, ...imageDimensions.map((item) => item.height));
    const vrm = gltf.extensions?.VRMC_vrm || {};
    const springBone = gltf.extensions?.VRMC_springBone || {};

    return {
        path: path.relative(REPOSITORY_ROOT, modelPath).replaceAll('\\', '/'),
        bytes: fileBuffer.length,
        generator: gltf.asset?.generator || '',
        nodes: gltf.nodes?.length || 0,
        meshes: gltf.meshes?.length || 0,
        primitives: primitives.length,
        verticesAcrossPrimitives: vertexCount,
        triangles: triangleCount,
        materials: gltf.materials?.length || 0,
        textures: gltf.textures?.length || 0,
        images: gltf.images?.length || 0,
        maxEmbeddedTexture: imageDimensions.length
            ? `${maxTextureWidth}x${maxTextureHeight}`
            : 'unknown',
        morphTargetsAcrossPrimitives: morphTargetCount,
        expressions: Object.keys(vrm.expressions?.preset || {}).length +
            Object.keys(vrm.expressions?.custom || {}).length,
        springBoneColliders: springBone.colliders?.length || 0
    };
}

function summarizeMotions() {
    const diskFiles = walkFiles(RESOURCE_ROOT, (filePath) => filePath.toLowerCase().endsWith('.vrma'));
    const intakeEntries = listMotionIntakeEntries();
    const loadableFiles = getLoadableMotionFiles();
    const library = listMotionLibrary();
    const approvedEntries = intakeEntries.filter((entry) => entry.approved);
    const presentEntries = intakeEntries.filter((entry) => {
        if (!entry.localPath) {
            return false;
        }
        return fs.existsSync(path.join(REPOSITORY_ROOT, entry.localPath));
    });
    const reviewStatusCounts = intakeEntries.reduce((counts, entry) => {
        const status = entry.reviewStatus || (entry.approved ? 'approved' : 'candidate');
        counts[status] = (counts[status] || 0) + 1;
        return counts;
    }, {});
    const semanticIntents = Object.entries(GESTURE_MOTION_MAP)
        .filter(([intent]) => intent !== 'none')
        .map(([intent, candidates]) => ({
            intent,
            candidates,
            covered: candidates.length > 0
        }));
    const emptySemanticIntents = semanticIntents
        .filter((entry) => !entry.covered)
        .map((entry) => entry.intent);
    const loadableIds = new Set(loadableFiles.map((entry) => entry.name));
    const approvedLoadableIds = approvedEntries
        .map((entry) => entry.id)
        .filter((id) => loadableIds.has(id));

    return {
        vrmaFilesOnDisk: diskFiles.length,
        catalogEntries: intakeEntries.length,
        catalogFilesPresent: presentEntries.length,
        libraryDefinitions: library.length,
        loadableMotions: loadableFiles.length,
        approvedMotions: approvedEntries.length,
        approvedLoadableMotions: approvedLoadableIds.length,
        reviewStatusCounts,
        semanticIntentCoverage: {
            covered: semanticIntents.length - emptySemanticIntents.length,
            total: semanticIntents.length,
            empty: emptySemanticIntents
        }
    };
}

function buildAudit(modelPath) {
    const motionSummary = summarizeMotions();
    const warnings = [];
    if (motionSummary.semanticIntentCoverage.empty.length) {
        warnings.push(
            `No one-shot motion candidates for: ${motionSummary.semanticIntentCoverage.empty.join(', ')}`
        );
    }
    if (motionSummary.approvedLoadableMotions < motionSummary.loadableMotions) {
        warnings.push(
            `${motionSummary.loadableMotions - motionSummary.approvedLoadableMotions} loadable motions are not approved for the stable runtime`
        );
    }
    if (motionSummary.vrmaFilesOnDisk > motionSummary.catalogFilesPresent) {
        warnings.push(
            `${motionSummary.vrmaFilesOnDisk - motionSummary.catalogFilesPresent} VRMA files on disk are outside the present intake catalog`
        );
    }
    return {
        generatedAt: new Date().toISOString(),
        model: summarizeModel(modelPath),
        motions: motionSummary,
        warnings
    };
}

function formatBytes(bytes) {
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function printHumanReadable(audit) {
    const { model, motions, warnings } = audit;
    console.log('AILIS Character Runtime Audit');
    console.log('');
    console.log('Model');
    console.log(`  File: ${model.path} (${formatBytes(model.bytes)})`);
    console.log(`  Generator: ${model.generator || 'unknown'}`);
    console.log(`  Geometry: ${model.triangles.toLocaleString()} triangles, ${model.meshes} meshes, ${model.primitives} primitives`);
    console.log(`  Materials: ${model.materials}; embedded images: ${model.images}; max texture: ${model.maxEmbeddedTexture}`);
    console.log(`  Expressions: ${model.expressions}; morph targets across primitives: ${model.morphTargetsAcrossPrimitives}`);
    console.log(`  Spring bone colliders: ${model.springBoneColliders}`);
    console.log('');
    console.log('Three.js / intake motion source');
    console.log(`  VRMA files on disk: ${motions.vrmaFilesOnDisk}`);
    console.log(`  Intake catalog: ${motions.catalogFilesPresent}/${motions.catalogEntries} files present`);
    console.log(`  Loadable: ${motions.loadableMotions}; approved stable motions: ${motions.approvedLoadableMotions}`);
    console.log(`  Semantic intent coverage: ${motions.semanticIntentCoverage.covered}/${motions.semanticIntentCoverage.total}`);
    console.log(`  Empty intents: ${motions.semanticIntentCoverage.empty.join(', ') || 'none'}`);
    console.log(`  Review statuses: ${JSON.stringify(motions.reviewStatusCounts)}`);
    if (warnings.length) {
        console.log('');
        console.log('Warnings');
        for (const warning of warnings) {
            console.log(`  - ${warning}`);
        }
    }
}

const args = process.argv.slice(2);
const jsonOutput = args.includes('--json');
const modelArgIndex = args.indexOf('--model');
const modelPath = modelArgIndex >= 0 && args[modelArgIndex + 1]
    ? path.resolve(process.cwd(), args[modelArgIndex + 1])
    : DEFAULT_MODEL_PATH;
const audit = buildAudit(modelPath);

if (jsonOutput) {
    console.log(JSON.stringify(audit, null, 2));
} else {
    printHumanReadable(audit);
}
