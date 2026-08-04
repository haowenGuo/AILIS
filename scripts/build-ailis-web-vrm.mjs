import { readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const GLB_MAGIC = 0x46546c67;
const JSON_CHUNK_TYPE = 0x4e4f534a;
const BIN_CHUNK_TYPE = 0x004e4942;
const KHR_MESH_QUANTIZATION = 'KHR_mesh_quantization';
const COMPONENT_COUNTS = Object.freeze({ SCALAR: 1, VEC2: 2, VEC3: 3, VEC4: 4, MAT2: 4, MAT3: 9, MAT4: 16 });
const COMPONENT_SIZES = Object.freeze({ 5120: 1, 5121: 1, 5122: 2, 5123: 2, 5125: 4, 5126: 4 });

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, '..');
const require = createRequire(resolve(
    projectRoot,
    'node_modules',
    '.pnpm',
    'sharp@0.32.6',
    'node_modules',
    'sharp',
    'package.json'
));
const sharp = require('sharp');
const defaultInputPath = resolve(projectRoot, 'Resources', 'AILIS.vrm');
const defaultOutputPath = resolve(projectRoot, 'Resources', 'AILIS.web.vrm');

function align4(value) {
    return (value + 3) & ~3;
}

export function parseGlb(buffer) {
    if (buffer.readUInt32LE(0) !== GLB_MAGIC || buffer.readUInt32LE(4) !== 2) {
        throw new Error('Only binary glTF 2.0 files are supported');
    }

    let json = null;
    let binary = null;
    let offset = 12;
    while (offset < buffer.length) {
        const chunkLength = buffer.readUInt32LE(offset);
        const chunkType = buffer.readUInt32LE(offset + 4);
        const chunk = buffer.subarray(offset + 8, offset + 8 + chunkLength);
        if (chunkType === JSON_CHUNK_TYPE) {
            json = JSON.parse(chunk.toString('utf8').trimEnd());
        } else if (chunkType === BIN_CHUNK_TYPE) {
            binary = Buffer.from(chunk);
        }
        offset += 8 + chunkLength;
    }
    if (!json || !binary) {
        throw new Error('GLB is missing its JSON or BIN chunk');
    }
    return { json, binary };
}

export function encodeGlb(json, binary) {
    const jsonPayload = Buffer.from(JSON.stringify(json), 'utf8');
    const jsonLength = align4(jsonPayload.length);
    const binaryLength = align4(binary.length);
    const totalLength = 12 + 8 + jsonLength + 8 + binaryLength;
    const output = Buffer.alloc(totalLength, 0);

    output.writeUInt32LE(GLB_MAGIC, 0);
    output.writeUInt32LE(2, 4);
    output.writeUInt32LE(totalLength, 8);
    output.writeUInt32LE(jsonLength, 12);
    output.writeUInt32LE(JSON_CHUNK_TYPE, 16);
    jsonPayload.copy(output, 20);
    output.fill(0x20, 20 + jsonPayload.length, 20 + jsonLength);
    const binaryHeaderOffset = 20 + jsonLength;
    output.writeUInt32LE(binaryLength, binaryHeaderOffset);
    output.writeUInt32LE(BIN_CHUNK_TYPE, binaryHeaderOffset + 4);
    binary.copy(output, binaryHeaderOffset + 8);
    return output;
}

function collectAccessorSemantics(json) {
    const semantics = new Map();
    const add = (accessorIndex, semantic) => {
        if (!Number.isInteger(accessorIndex)) return;
        if (!semantics.has(accessorIndex)) semantics.set(accessorIndex, new Set());
        semantics.get(accessorIndex).add(semantic);
    };

    for (const mesh of json.meshes || []) {
        for (const primitive of mesh.primitives || []) {
            for (const [semantic, accessorIndex] of Object.entries(primitive.attributes || {})) {
                add(accessorIndex, semantic);
            }
            for (const target of primitive.targets || []) {
                for (const [semantic, accessorIndex] of Object.entries(target)) {
                    add(accessorIndex, `TARGET_${semantic}`);
                }
            }
            add(primitive.indices, 'INDICES');
        }
    }
    return semantics;
}

function collectBufferViewAccessorCounts(json) {
    const counts = new Map();
    for (const accessor of json.accessors || []) {
        if (Number.isInteger(accessor.bufferView)) {
            counts.set(accessor.bufferView, (counts.get(accessor.bufferView) || 0) + 1);
        }
    }
    return counts;
}

function readComponent(view, offset, componentType) {
    switch (componentType) {
        case 5120: return view.getInt8(offset);
        case 5121: return view.getUint8(offset);
        case 5122: return view.getInt16(offset, true);
        case 5123: return view.getUint16(offset, true);
        case 5125: return view.getUint32(offset, true);
        case 5126: return view.getFloat32(offset, true);
        default: throw new Error(`Unsupported accessor component type: ${componentType}`);
    }
}

function writeComponent(buffer, offset, componentType, value) {
    switch (componentType) {
        case 5121: buffer.writeUInt8(value, offset); break;
        case 5122: buffer.writeInt16LE(value, offset); break;
        case 5123: buffer.writeUInt16LE(value, offset); break;
        default: throw new Error(`Unsupported output component type: ${componentType}`);
    }
}

function inspectAccessorValues(json, binary, accessorIndex) {
    const accessor = json.accessors[accessorIndex];
    const bufferView = json.bufferViews[accessor.bufferView];
    const componentCount = COMPONENT_COUNTS[accessor.type];
    const componentSize = COMPONENT_SIZES[accessor.componentType];
    const elementSize = componentCount * componentSize;
    const stride = bufferView.byteStride || elementSize;
    const start = (bufferView.byteOffset || 0) + (accessor.byteOffset || 0);
    const view = new DataView(binary.buffer, binary.byteOffset, binary.byteLength);
    const values = new Float64Array(accessor.count * componentCount);
    let minimum = Infinity;
    let maximum = -Infinity;

    for (let index = 0; index < accessor.count; index += 1) {
        for (let component = 0; component < componentCount; component += 1) {
            const value = readComponent(view, start + index * stride + component * componentSize, accessor.componentType);
            values[index * componentCount + component] = value;
            minimum = Math.min(minimum, value);
            maximum = Math.max(maximum, value);
        }
    }
    return { values, minimum, maximum, componentCount };
}

function chooseQuantization(semantic, accessor, inspected) {
    if (accessor.sparse) return null;
    if ((semantic === 'NORMAL' || semantic === 'TANGENT' || semantic === 'TARGET_NORMAL') && accessor.componentType === 5126) {
        if (inspected.minimum < -1.00001 || inspected.maximum > 1.00001) return null;
        return { componentType: 5122, normalized: true, encode: (value) => Math.round(Math.max(-1, Math.min(1, value)) * 32767), requiresExtension: true };
    }
    if (semantic.startsWith('TEXCOORD_') && accessor.componentType === 5126) {
        if (inspected.minimum < 0 || inspected.maximum > 1) return null;
        return { componentType: 5123, normalized: true, encode: (value) => Math.round(value * 65535) };
    }
    if (semantic.startsWith('WEIGHTS_') && accessor.componentType === 5126) {
        if (inspected.minimum < 0 || inspected.maximum > 1.00001) return null;
        return { componentType: 5121, normalized: true, encode: (value) => Math.round(Math.max(0, Math.min(1, value)) * 255) };
    }
    if (semantic.startsWith('JOINTS_') && accessor.componentType === 5123 && inspected.maximum <= 255) {
        return { componentType: 5121, normalized: false, encode: (value) => value };
    }
    if (semantic.startsWith('COLOR_') && accessor.componentType === 5126) {
        if (inspected.minimum < 0 || inspected.maximum > 1) return null;
        return { componentType: 5121, normalized: true, encode: (value) => Math.round(value * 255) };
    }
    if (semantic === 'INDICES' && accessor.componentType === 5125 && inspected.maximum <= 65535) {
        return { componentType: 5123, normalized: false, encode: (value) => value };
    }
    return null;
}

function quantizeGeometry(json, binary, replacements, report) {
    const semantics = collectAccessorSemantics(json);
    const viewAccessorCounts = collectBufferViewAccessorCounts(json);
    let requiresMeshQuantization = false;

    for (const [accessorIndex, semanticSet] of semantics.entries()) {
        if (semanticSet.size !== 1) continue;
        const semantic = [...semanticSet][0];
        const accessor = json.accessors[accessorIndex];
        const bufferViewIndex = accessor.bufferView;
        const bufferView = json.bufferViews[bufferViewIndex];
        if (!Number.isInteger(bufferViewIndex) || viewAccessorCounts.get(bufferViewIndex) !== 1 || bufferView.byteStride) continue;

        const inspected = inspectAccessorValues(json, binary, accessorIndex);
        const quantization = chooseQuantization(semantic, accessor, inspected);
        if (!quantization) continue;

        const targetComponentSize = COMPONENT_SIZES[quantization.componentType];
        const output = Buffer.alloc(accessor.count * inspected.componentCount * targetComponentSize);
        for (let index = 0; index < inspected.values.length; index += 1) {
            writeComponent(output, index * targetComponentSize, quantization.componentType, quantization.encode(inspected.values[index]));
        }
        replacements.set(bufferViewIndex, output);
        const originalBytes = bufferView.byteLength;
        accessor.componentType = quantization.componentType;
        if (quantization.normalized) accessor.normalized = true;
        else delete accessor.normalized;
        accessor.byteOffset = 0;
        delete bufferView.byteStride;
        requiresMeshQuantization ||= Boolean(quantization.requiresExtension);
        report.quantizedAccessors.push({ accessorIndex, semantic, originalBytes, outputBytes: output.length });
    }

    if (requiresMeshQuantization) {
        json.extensionsUsed = [...new Set([...(json.extensionsUsed || []), KHR_MESH_QUANTIZATION])];
        json.extensionsRequired = [...new Set([...(json.extensionsRequired || []), KHR_MESH_QUANTIZATION])];
    }
}

async function optimizeTextures(json, binary, replacements, report) {
    const thumbnailIndex = json.extensions?.VRMC_vrm?.meta?.thumbnailImage;
    for (let imageIndex = 0; imageIndex < (json.images || []).length; imageIndex += 1) {
        const image = json.images[imageIndex];
        if (image.mimeType !== 'image/png' || !Number.isInteger(image.bufferView)) continue;
        const bufferView = json.bufferViews[image.bufferView];
        const input = binary.subarray(bufferView.byteOffset || 0, (bufferView.byteOffset || 0) + bufferView.byteLength);

        if (imageIndex === thumbnailIndex) {
            const placeholder = await sharp({
                create: { width: 1, height: 1, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } }
            }).png({ compressionLevel: 9 }).toBuffer();
            replacements.set(image.bufferView, placeholder);
            report.thumbnail = { imageIndex, originalBytes: input.length, outputBytes: placeholder.length };
            continue;
        }

        const metadata = await sharp(input).metadata();
        const largestDimension = Math.max(metadata.width || 0, metadata.height || 0);
        if (largestDimension <= 1024) continue;
        const candidate = await sharp(input)
            .resize({ width: 1024, height: 1024, fit: 'inside', withoutEnlargement: true })
            .png({ compressionLevel: 9, adaptiveFiltering: true })
            .toBuffer();
        if (candidate.length < input.length) {
            replacements.set(image.bufferView, candidate);
            const outputMetadata = await sharp(candidate).metadata();
            report.resizedTextures.push({
                imageIndex,
                name: image.name || '',
                originalSize: `${metadata.width}x${metadata.height}`,
                outputSize: `${outputMetadata.width}x${outputMetadata.height}`,
                originalBytes: input.length,
                outputBytes: candidate.length
            });
        }
    }
}

function rebuildBinary(json, binary, replacements) {
    const chunks = [];
    let offset = 0;
    for (let index = 0; index < json.bufferViews.length; index += 1) {
        const bufferView = json.bufferViews[index];
        const source = replacements.get(index) || binary.subarray(
            bufferView.byteOffset || 0,
            (bufferView.byteOffset || 0) + bufferView.byteLength
        );
        const alignedOffset = align4(offset);
        if (alignedOffset > offset) chunks.push(Buffer.alloc(alignedOffset - offset));
        chunks.push(source);
        bufferView.byteOffset = alignedOffset;
        bufferView.byteLength = source.length;
        offset = alignedOffset + source.length;
    }
    const finalLength = align4(offset);
    if (finalLength > offset) chunks.push(Buffer.alloc(finalLength - offset));
    const output = Buffer.concat(chunks);
    json.buffers[0].byteLength = output.length;
    return output;
}

export async function buildWebVrm(inputBuffer) {
    const { json, binary } = parseGlb(inputBuffer);
    const replacements = new Map();
    const report = { thumbnail: null, resizedTextures: [], quantizedAccessors: [] };
    await optimizeTextures(json, binary, replacements, report);
    quantizeGeometry(json, binary, replacements, report);
    const rebuiltBinary = rebuildBinary(json, binary, replacements);
    return { buffer: encodeGlb(json, rebuiltBinary), json, report };
}

async function main() {
    const inputPath = resolve(process.argv[2] || defaultInputPath);
    const outputPath = resolve(process.argv[3] || defaultOutputPath);
    const inputBuffer = readFileSync(inputPath);
    const result = await buildWebVrm(inputBuffer);
    writeFileSync(outputPath, result.buffer);
    const savingPercent = ((1 - result.buffer.length / inputBuffer.length) * 100).toFixed(1);
    const geometryBytesSaved = result.report.quantizedAccessors.reduce(
        (sum, entry) => sum + entry.originalBytes - entry.outputBytes,
        0
    );
    console.log(`[web-vrm] ${inputBuffer.length.toLocaleString()} -> ${result.buffer.length.toLocaleString()} bytes (${savingPercent}% smaller)`);
    console.log(`[web-vrm] thumbnail payload removed: ${result.report.thumbnail?.originalBytes?.toLocaleString() || 0} bytes`);
    console.log(`[web-vrm] textures resized: ${result.report.resizedTextures.length}; geometry bytes saved: ${geometryBytesSaved.toLocaleString()}`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
    await main();
}
