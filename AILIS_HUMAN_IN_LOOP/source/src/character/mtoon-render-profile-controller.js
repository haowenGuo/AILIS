import * as THREE from 'three';

import { getRenderProfile, normalizeRenderProfileId } from './render-profiles.js';

const OUTLINE_MATERIAL_SUFFIX = ' (Outline)';
const OUTLINE_WIDTH_MODE_SCREEN = 'screenCoordinates';

const MATERIAL_GROUP_RULES = Object.freeze([
    {
        group: 'eyes',
        pattern: /(eye|iris|pupil|hitomi|瞳|目|眼)/i
    },
    {
        group: 'faceLine',
        pattern: /(line|mouth|brow|lash|eyelash|eyebrow|face[_-]?line|口|眉|睫|まつげ)/i
    },
    {
        group: 'hair',
        pattern: /(hair|bang|tail|twin|髪|发|頭髪)/i
    },
    {
        group: 'skin',
        pattern: /(skin|face|body|head|neck|hand|arm|leg|ear|肌|顔|脸|体|手|腕|脚|耳)/i
    },
    {
        group: 'accessory',
        pattern: /(metal|accessory|ribbon|clip|button|bell|jewel|ring|zip|buck|饰|飾|扣|金属)/i
    },
    {
        group: 'cloth',
        pattern: /(cloth|dress|skirt|shirt|sleeve|sock|shoe|wear|costume|服|衣|裙|袜|鞋)/i
    }
]);

function clamp(value, minimum, maximum, fallbackValue = minimum) {
    const numericValue = Number(value);
    if (!Number.isFinite(numericValue)) {
        return fallbackValue;
    }
    return Math.min(Math.max(numericValue, minimum), maximum);
}

function colorFrom(value, fallback = '#ffffff') {
    try {
        return new THREE.Color(value || fallback);
    } catch {
        return new THREE.Color(fallback);
    }
}

function cloneColor(value, fallback = '#ffffff') {
    if (value?.isColor) {
        return value.clone();
    }
    return colorFrom(value, fallback);
}

function collectMaterialList(root) {
    const materials = [];
    const seen = new Set();
    root?.traverse?.((node) => {
        const nodeMaterials = Array.isArray(node.material)
            ? node.material
            : node.material
                ? [node.material]
                : [];
        for (const material of nodeMaterials) {
            if (!material || seen.has(material)) {
                continue;
            }
            seen.add(material);
            materials.push(material);
        }
    });
    return materials;
}

function collectMeshList(root) {
    const meshes = [];
    root?.traverse?.((node) => {
        if (node?.isMesh || node?.isSkinnedMesh) {
            meshes.push(node);
        }
    });
    return meshes;
}

function isMToonMaterial(material) {
    return Boolean(
        material?.isMToonMaterial ||
        (
            material &&
            material.shadeColorFactor?.isColor &&
            typeof material.shadingToonyFactor === 'number' &&
            typeof material.outlineWidthFactor === 'number'
        )
    );
}

function getMaterialArray(materialOrMaterials) {
    if (Array.isArray(materialOrMaterials)) {
        return materialOrMaterials.filter(Boolean);
    }
    return materialOrMaterials ? [materialOrMaterials] : [];
}

function hasOutlineMaterial(materials) {
    return materials.some((material) => Boolean(material?.isOutline));
}

function getGeometryVertexCount(geometry) {
    if (!geometry) {
        return 0;
    }
    if (geometry.index) {
        return geometry.index.count;
    }
    return geometry.attributes?.position?.count || 0;
}

function ensureFullGeometryGroup(geometry, materialIndex) {
    const vertexCount = getGeometryVertexCount(geometry);
    if (!geometry || vertexCount <= 0) {
        return false;
    }

    const alreadyExists = geometry.groups?.some((group) => (
        group.start === 0 &&
        group.count === vertexCount &&
        group.materialIndex === materialIndex
    ));
    if (alreadyExists) {
        return false;
    }

    geometry.addGroup(0, vertexCount, materialIndex);
    return true;
}

function canGenerateOutlineMaterial(material) {
    return isMToonMaterial(material) && typeof material.clone === 'function';
}

function getOutlineWidth(tuning = {}, fallbackValue = 0) {
    if ('outlineWidth' in tuning) {
        return clamp(tuning.outlineWidth, 0, 0.05, fallbackValue);
    }
    return fallbackValue;
}

function normalizeRenderLook(renderLook = {}) {
    return {
        outlineScale: clamp(renderLook.outlineScale, 0.25, 1.2, 1),
        outlineEnabled: renderLook.outlineEnabled !== false
    };
}

function getRenderLookAdjustedTuning(tuning = {}, renderLook = {}) {
    const look = normalizeRenderLook(renderLook);
    const adjusted = { ...tuning };

    if (!look.outlineEnabled) {
        return {
            ...adjusted,
            outlineWidth: 0,
            outlineScale: 0
        };
    }

    if ('outlineWidth' in adjusted) {
        adjusted.outlineWidth = clamp(adjusted.outlineWidth * look.outlineScale, 0, 0.05, adjusted.outlineWidth);
    }
    if ('outlineScale' in adjusted) {
        adjusted.outlineScale = clamp(adjusted.outlineScale * look.outlineScale, 0, 2, adjusted.outlineScale);
    } else {
        adjusted.outlineScale = look.outlineScale;
    }

    return adjusted;
}

function ensureMaterialOutlineBase(material, tuning = {}, renderLook = {}) {
    if (!isMToonMaterial(material)) {
        return false;
    }

    let changed = false;
    const adjustedTuning = getRenderLookAdjustedTuning(tuning, renderLook);
    const outlineWidth = getOutlineWidth(adjustedTuning, Number(material.outlineWidthFactor || 0));

    if ('outlineWidthMode' in material && material.outlineWidthMode !== OUTLINE_WIDTH_MODE_SCREEN) {
        material.outlineWidthMode = OUTLINE_WIDTH_MODE_SCREEN;
        changed = true;
    }
    if ('outlineWidthFactor' in material && Number(material.outlineWidthFactor || 0) < outlineWidth) {
        material.outlineWidthFactor = outlineWidth;
        changed = true;
    }
    if (changed) {
        material.needsUpdate = true;
    }
    return changed;
}

function createOutlineMaterial(surfaceMaterial) {
    const outlineMaterial = surfaceMaterial.clone();
    outlineMaterial.name = `${surfaceMaterial.name || 'MToon'}${OUTLINE_MATERIAL_SUFFIX}`;
    outlineMaterial.isOutline = true;
    outlineMaterial.side = THREE.BackSide;
    outlineMaterial.depthWrite = true;
    outlineMaterial.needsUpdate = true;
    return outlineMaterial;
}

function ensureMToonOutlineMeshes(root, profile = {}, renderLook = {}) {
    const look = normalizeRenderLook(renderLook);
    if (!look.outlineEnabled) {
        setOutlineMaterialsVisible(root, false);
        return { generated: 0, updated: 0 };
    }

    setOutlineMaterialsVisible(root, true);
    const meshes = collectMeshList(root);
    let generated = 0;
    let updated = 0;

    for (const mesh of meshes) {
        const materials = getMaterialArray(mesh.material);
        if (!materials.length || hasOutlineMaterial(materials)) {
            for (const material of materials) {
                if (ensureMaterialOutlineBase(material, profile.materialDefaults || {}, renderLook)) {
                    updated += 1;
                }
            }
            continue;
        }

        const surfaceMaterial = materials[0];
        if (!canGenerateOutlineMaterial(surfaceMaterial)) {
            continue;
        }

        if (ensureMaterialOutlineBase(surfaceMaterial, profile.materialDefaults || {}, renderLook)) {
            updated += 1;
        }

        const outlineMaterial = createOutlineMaterial(surfaceMaterial);
        const nextMaterials = Array.isArray(mesh.material)
            ? [...mesh.material, outlineMaterial]
            : [surfaceMaterial, outlineMaterial];
        mesh.material = nextMaterials;

        if (mesh.geometry?.groups?.length === 0) {
            ensureFullGeometryGroup(mesh.geometry, 0);
        }
        ensureFullGeometryGroup(mesh.geometry, nextMaterials.length - 1);

        generated += 1;
    }

    return { generated, updated };
}

function setOutlineMaterialsVisible(root, visible) {
    let updated = 0;
    for (const mesh of collectMeshList(root)) {
        for (const material of getMaterialArray(mesh.material)) {
            if (!material?.isOutline && !String(material?.name || '').includes(OUTLINE_MATERIAL_SUFFIX)) {
                continue;
            }
            if ('visible' in material && material.visible !== visible) {
                material.visible = visible;
                material.needsUpdate = true;
                updated += 1;
            }
            if ('outlineWidthFactor' in material && !visible && material.outlineWidthFactor !== 0) {
                material.outlineWidthFactor = 0;
                material.needsUpdate = true;
                updated += 1;
            }
        }
    }
    return updated;
}

function getMaterialName(material) {
    return String(material?.name || material?.userData?.name || '')
        .replace(new RegExp(`${OUTLINE_MATERIAL_SUFFIX.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`), '')
        .trim();
}

function classifyMaterial(material) {
    const materialName = getMaterialName(material);
    for (const rule of MATERIAL_GROUP_RULES) {
        if (rule.pattern.test(materialName)) {
            return rule.group;
        }
    }
    return 'cloth';
}

function snapshotMaterial(material) {
    return {
        shadeColorFactor: cloneColor(material.shadeColorFactor, '#000000'),
        shadingShiftFactor: Number(material.shadingShiftFactor ?? 0),
        shadingToonyFactor: Number(material.shadingToonyFactor ?? 0.9),
        giEqualizationFactor: Number(material.giEqualizationFactor ?? 0.9),
        parametricRimColorFactor: cloneColor(material.parametricRimColorFactor, '#000000'),
        parametricRimLiftFactor: Number(material.parametricRimLiftFactor ?? 0),
        parametricRimFresnelPowerFactor: Number(material.parametricRimFresnelPowerFactor ?? 5),
        rimLightingMixFactor: Number(material.rimLightingMixFactor ?? 1),
        matcapFactor: cloneColor(material.matcapFactor, '#ffffff'),
        outlineWidthFactor: Number(material.outlineWidthFactor ?? 0),
        outlineColorFactor: cloneColor(material.outlineColorFactor, '#000000'),
        outlineLightingMixFactor: Number(material.outlineLightingMixFactor ?? 1),
        outlineWidthMode: material.outlineWidthMode,
        isOutline: Boolean(material.isOutline)
    };
}

function copyMaterialSnapshot(material, snapshot) {
    if (!material || !snapshot) {
        return;
    }

    if (material.shadeColorFactor?.isColor) {
        material.shadeColorFactor.copy(snapshot.shadeColorFactor);
    }
    if ('shadingShiftFactor' in material) {
        material.shadingShiftFactor = snapshot.shadingShiftFactor;
    }
    if ('shadingToonyFactor' in material) {
        material.shadingToonyFactor = snapshot.shadingToonyFactor;
    }
    if ('giEqualizationFactor' in material) {
        material.giEqualizationFactor = snapshot.giEqualizationFactor;
    }
    if (material.parametricRimColorFactor?.isColor) {
        material.parametricRimColorFactor.copy(snapshot.parametricRimColorFactor);
    }
    if ('parametricRimLiftFactor' in material) {
        material.parametricRimLiftFactor = snapshot.parametricRimLiftFactor;
    }
    if ('parametricRimFresnelPowerFactor' in material) {
        material.parametricRimFresnelPowerFactor = snapshot.parametricRimFresnelPowerFactor;
    }
    if ('rimLightingMixFactor' in material) {
        material.rimLightingMixFactor = snapshot.rimLightingMixFactor;
    }
    if (material.matcapFactor?.isColor) {
        material.matcapFactor.copy(snapshot.matcapFactor);
    }
    if ('outlineWidthFactor' in material) {
        material.outlineWidthFactor = snapshot.outlineWidthFactor;
    }
    if (material.outlineColorFactor?.isColor) {
        material.outlineColorFactor.copy(snapshot.outlineColorFactor);
    }
    if ('outlineLightingMixFactor' in material) {
        material.outlineLightingMixFactor = snapshot.outlineLightingMixFactor;
    }
    if ('outlineWidthMode' in material && snapshot.outlineWidthMode !== undefined) {
        material.outlineWidthMode = snapshot.outlineWidthMode;
    }
    if ('isOutline' in material) {
        material.isOutline = snapshot.isOutline;
    }
}

function applyMaterialTuning(material, original, tuning = {}, renderLook = {}) {
    if (!material || !original || !tuning) {
        return;
    }

    tuning = getRenderLookAdjustedTuning(tuning, renderLook);

    if (tuning.shadeColor && material.shadeColorFactor?.isColor) {
        material.shadeColorFactor.copy(colorFrom(tuning.shadeColor));
    }
    if ('shadingShift' in tuning && 'shadingShiftFactor' in material) {
        material.shadingShiftFactor = clamp(tuning.shadingShift, -1, 1, original.shadingShiftFactor);
    }
    if ('shadingToony' in tuning && 'shadingToonyFactor' in material) {
        material.shadingToonyFactor = clamp(tuning.shadingToony, 0, 1, original.shadingToonyFactor);
    }
    if ('giEqualization' in tuning && 'giEqualizationFactor' in material) {
        material.giEqualizationFactor = clamp(tuning.giEqualization, 0, 1, original.giEqualizationFactor);
    }
    if (tuning.rimColor && material.parametricRimColorFactor?.isColor) {
        material.parametricRimColorFactor.copy(colorFrom(tuning.rimColor));
    }
    if ('rimLift' in tuning && 'parametricRimLiftFactor' in material) {
        material.parametricRimLiftFactor = clamp(tuning.rimLift, 0, 1, original.parametricRimLiftFactor);
    }
    if ('rimPower' in tuning && 'parametricRimFresnelPowerFactor' in material) {
        material.parametricRimFresnelPowerFactor = clamp(
            tuning.rimPower,
            0.1,
            12,
            original.parametricRimFresnelPowerFactor
        );
    }
    if ('rimLightingMix' in tuning && 'rimLightingMixFactor' in material) {
        material.rimLightingMixFactor = clamp(tuning.rimLightingMix, 0, 1, original.rimLightingMixFactor);
    }
    if (tuning.matcapColor && material.matcapFactor?.isColor) {
        material.matcapFactor.copy(colorFrom(tuning.matcapColor));
    }
    if (('outlineScale' in tuning || 'outlineWidth' in tuning) && 'outlineWidthFactor' in material) {
        const outlineScale = clamp(tuning.outlineScale, 0, 2, 1);
        const scaledOutlineWidth = Math.max(0, original.outlineWidthFactor * outlineScale);
        const minimumOutlineWidth = getOutlineWidth(tuning, scaledOutlineWidth);
        material.outlineWidthFactor = Math.max(scaledOutlineWidth, minimumOutlineWidth);
        if (material.outlineWidthFactor > 0 && 'outlineWidthMode' in material) {
            material.outlineWidthMode = OUTLINE_WIDTH_MODE_SCREEN;
        } else if (material.outlineWidthFactor === 0 && 'outlineWidthMode' in material) {
            material.outlineWidthMode = 'none';
        }
    }
    if (tuning.outlineColor && material.outlineColorFactor?.isColor) {
        material.outlineColorFactor.copy(colorFrom(tuning.outlineColor));
    }
    if ('outlineLightingMix' in tuning && 'outlineLightingMixFactor' in material) {
        material.outlineLightingMixFactor = clamp(
            tuning.outlineLightingMix,
            0,
            1,
            original.outlineLightingMixFactor
        );
    }

    material.needsUpdate = true;
}

export class MToonRenderProfileController {
    constructor({ vrm = null, logger = console } = {}) {
        this.vrm = vrm;
        this.logger = logger;
        this.entries = [];
        this.activeProfileId = '';
    }

    bindVrm(vrm) {
        this.vrm = vrm;
        this.entries = collectMaterialList(vrm?.scene)
            .filter(isMToonMaterial)
            .map((material) => ({
                material,
                group: classifyMaterial(material),
                original: snapshotMaterial(material)
            }));
        return this.entries.length;
    }

    getMaterialSummary() {
        const byGroup = {};
        for (const entry of this.entries) {
            byGroup[entry.group] = (byGroup[entry.group] || 0) + 1;
        }
        return {
            count: this.entries.length,
            byGroup
        };
    }

    restoreOriginal() {
        for (const entry of this.entries) {
            copyMaterialSnapshot(entry.material, entry.original);
        }
    }

    apply(profileId, renderLook = {}) {
        const profile = getRenderProfile(profileId);
        const normalizedId = normalizeRenderProfileId(profile.id);
        const outlineSummary = this.vrm
            ? ensureMToonOutlineMeshes(this.vrm.scene, profile, renderLook)
            : { generated: 0, updated: 0 };
        if (outlineSummary.generated > 0) {
            this.bindVrm(this.vrm);
        }
        if (!this.entries.length && this.vrm) {
            this.bindVrm(this.vrm);
        }

        this.restoreOriginal();
        for (const entry of this.entries) {
            const tuning = {
                ...(profile.materialDefaults || {}),
                ...((profile.materialGroups || {})[entry.group] || {})
            };
            applyMaterialTuning(entry.material, entry.original, tuning, renderLook);
        }

        this.activeProfileId = normalizedId;
        return {
            id: normalizedId,
            materialSummary: this.getMaterialSummary(),
            outlineSummary
        };
    }
}

export const __renderProfileControllerInternals = {
    classifyMaterial,
    collectMaterialList,
    ensureMToonOutlineMeshes,
    getRenderLookAdjustedTuning,
    isMToonMaterial
};
