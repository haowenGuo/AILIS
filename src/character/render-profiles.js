export const DEFAULT_RENDER_PROFILE_ID = 'ailis_soft_anime_mtoon';

export const RENDER_PROFILE_IDS = Object.freeze([
    'ailis_soft_anime_mtoon',
    'ailis_bright_companion_mtoon',
    'ailis_cinematic_rim_toon',
    'ailis_material_hybrid_npr',
    'ailis_hard_cel_mtoon'
]);

const LEGACY_RENDER_PROFILE_ID_ALIASES = Object.freeze({
    ailis_soft_genshin_base: 'ailis_soft_anime_mtoon',
    ailis_bright_companion: 'ailis_bright_companion_mtoon',
    ailis_wuwa_cinematic: 'ailis_cinematic_rim_toon',
    ailis_endfield_hybrid: 'ailis_material_hybrid_npr',
    ailis_cel_anime_hard: 'ailis_hard_cel_mtoon'
});

const PROFILE_ORDER = new Map(RENDER_PROFILE_IDS.map((id, index) => [id, index]));

export const RENDER_PROFILES = Object.freeze([
    {
        id: 'ailis_soft_anime_mtoon',
        label: '柔和动漫 MToon',
        shortLabel: 'Soft Anime',
        description: '基于 VRM/MToon 的柔和动漫风：脸和皮肤更干净，阴影偏暖，轮廓克制。',
        lighting: {
            ambient: { color: '#fff7ef', intensity: 2.22 },
            key: { color: '#fff1df', intensity: 1.04, position: [4.9, 5.4, 5.2] },
            fill: { color: '#dfeaff', intensity: 0.34, position: [-4.2, 3.2, 3.8] },
            rim: { color: '#d9ecff', intensity: 0.28, position: [-3.8, 4.4, -4.2] },
            sceneMood: {
                ambientMultiplier: 1,
                keyMultiplier: 1.02,
                ambientOffset: 0.02,
                keyOffset: 0,
                fillMoodInfluence: 0.08,
                rimMoodInfluence: 0.1
            }
        },
        materialDefaults: {
            shadeColor: '#d8d8ff',
            shadingShift: -0.015,
            shadingToony: 0.92,
            giEqualization: 0.88,
            rimColor: '#e7f1ff',
            rimLift: 0.05,
            rimPower: 4.7,
            rimLightingMix: 0.72,
            matcapColor: '#fff7ee',
            outlineScale: 0.86,
            outlineWidth: 0.004,
            outlineColor: '#5e5671',
            outlineLightingMix: 0.55
        },
        materialGroups: {
            skin: {
                shadeColor: '#f1d4da',
                shadingShift: 0.012,
                shadingToony: 0.96,
                giEqualization: 0.96,
                rimColor: '#fff2e7',
                rimLift: 0.025,
                rimPower: 5.8,
                rimLightingMix: 0.54,
                matcapColor: '#fff8f0',
                outlineWidth: 0.0028,
                outlineScale: 0.62
            },
            faceLine: {
                shadeColor: '#f8e5ea',
                shadingShift: 0.04,
                shadingToony: 0.98,
                giEqualization: 1,
                rimColor: '#ffffff',
                rimLift: 0,
                rimPower: 7.5,
                rimLightingMix: 0.25,
                outlineWidth: 0.0018,
                outlineScale: 0.38
            },
            eyes: {
                shadeColor: '#ffffff',
                shadingShift: 0.055,
                shadingToony: 1,
                giEqualization: 1,
                rimColor: '#f5fbff',
                rimLift: 0.02,
                rimPower: 6.5,
                rimLightingMix: 0.28,
                matcapColor: '#ffffff',
                outlineWidth: 0.001,
                outlineScale: 0.2
            },
            hair: {
                shadeColor: '#cad2ff',
                shadingShift: -0.035,
                shadingToony: 0.9,
                giEqualization: 0.83,
                rimColor: '#e3efff',
                rimLift: 0.07,
                rimPower: 3.7,
                rimLightingMix: 0.74,
                matcapColor: '#ffe8f1',
                outlineWidth: 0.0045,
                outlineScale: 0.94
            },
            cloth: {
                shadeColor: '#cbd6ff',
                shadingShift: -0.025,
                shadingToony: 0.9,
                giEqualization: 0.86,
                rimColor: '#dbeaff',
                rimLift: 0.055,
                rimPower: 4.3,
                rimLightingMix: 0.74,
                outlineWidth: 0.0042,
                outlineScale: 0.9
            },
            accessory: {
                shadeColor: '#d9dcff',
                shadingShift: -0.018,
                shadingToony: 0.88,
                giEqualization: 0.82,
                rimColor: '#fff3d8',
                rimLift: 0.06,
                rimPower: 3.8,
                rimLightingMix: 0.8,
                matcapColor: '#fff5dc',
                outlineWidth: 0.004,
                outlineScale: 0.9
            }
        }
    },
    {
        id: 'ailis_bright_companion_mtoon',
        label: '明亮陪伴 MToon',
        shortLabel: 'Bright MToon',
        description: '基于 VRM/MToon 的高填充光日常风格：整体更亮、更软，适合长时间陪伴。',
        lighting: {
            ambient: { color: '#fffdf8', intensity: 2.55 },
            key: { color: '#fff6e8', intensity: 0.92, position: [4.5, 5.6, 5.4] },
            fill: { color: '#e5f1ff', intensity: 0.54, position: [-4.6, 3.6, 4.5] },
            rim: { color: '#e8f5ff', intensity: 0.18, position: [-3.4, 4.0, -4.4] },
            sceneMood: {
                ambientMultiplier: 1.12,
                keyMultiplier: 0.9,
                ambientOffset: 0.05,
                keyOffset: -0.02,
                fillMoodInfluence: 0.04,
                rimMoodInfluence: 0.04
            }
        },
        materialDefaults: {
            shadeColor: '#e4e5ff',
            shadingShift: 0.02,
            shadingToony: 0.86,
            giEqualization: 0.98,
            rimColor: '#f3fbff',
            rimLift: 0.035,
            rimPower: 5.6,
            rimLightingMix: 0.5,
            matcapColor: '#fffaf4',
            outlineScale: 0.58,
            outlineWidth: 0.0028,
            outlineColor: '#766f85',
            outlineLightingMix: 0.72
        },
        materialGroups: {
            skin: {
                shadeColor: '#f5dfe4',
                shadingShift: 0.05,
                shadingToony: 0.93,
                giEqualization: 1,
                rimColor: '#fff8ef',
                rimLift: 0.018,
                rimPower: 6.8,
                rimLightingMix: 0.34,
                outlineWidth: 0.0018,
                outlineScale: 0.35
            },
            faceLine: {
                shadeColor: '#fff2f4',
                shadingShift: 0.08,
                shadingToony: 1,
                giEqualization: 1,
                rimLift: 0,
                rimLightingMix: 0.18,
                outlineWidth: 0.001,
                outlineScale: 0.22
            },
            eyes: {
                shadeColor: '#ffffff',
                shadingShift: 0.08,
                shadingToony: 1,
                giEqualization: 1,
                rimColor: '#ffffff',
                rimLift: 0.02,
                rimPower: 7,
                rimLightingMix: 0.2,
                matcapColor: '#ffffff',
                outlineWidth: 0.0008,
                outlineScale: 0.14
            },
            hair: {
                shadeColor: '#d9ddff',
                shadingShift: 0,
                shadingToony: 0.84,
                giEqualization: 0.94,
                rimColor: '#eef7ff',
                rimLift: 0.045,
                rimPower: 4.8,
                rimLightingMix: 0.5,
                matcapColor: '#fff0f7',
                outlineWidth: 0.003,
                outlineScale: 0.62
            },
            cloth: {
                shadeColor: '#dfe7ff',
                shadingShift: 0.01,
                shadingToony: 0.82,
                giEqualization: 0.95,
                rimColor: '#edf7ff',
                rimLift: 0.04,
                rimPower: 5.2,
                rimLightingMix: 0.55,
                outlineWidth: 0.003,
                outlineScale: 0.6
            },
            accessory: {
                shadeColor: '#e9e8ff',
                shadingShift: 0.008,
                shadingToony: 0.82,
                giEqualization: 0.92,
                rimColor: '#fff8e8',
                rimLift: 0.04,
                rimPower: 4.8,
                rimLightingMix: 0.62,
                matcapColor: '#fff8e8',
                outlineWidth: 0.003,
                outlineScale: 0.62
            }
        }
    },
    {
        id: 'ailis_cinematic_rim_toon',
        label: '电影感边缘光 Toon',
        shortLabel: 'Cinematic Rim',
        description: '基于 VRM/MToon 与角色独立灯光的电影感预设：对比更强，冷暖光和边缘光更明显。',
        lighting: {
            ambient: { color: '#e9f2ff', intensity: 1.78 },
            key: { color: '#ffe7ce', intensity: 1.28, position: [3.5, 5.7, 4.6] },
            fill: { color: '#bcd6ff', intensity: 0.22, position: [-4.8, 3.0, 3.2] },
            rim: { color: '#bfe5ff', intensity: 0.48, position: [-4.8, 4.9, -4.8] },
            sceneMood: {
                ambientMultiplier: 0.86,
                keyMultiplier: 1.2,
                ambientOffset: -0.05,
                keyOffset: 0.03,
                fillMoodInfluence: 0.12,
                rimMoodInfluence: 0.22
            }
        },
        materialDefaults: {
            shadeColor: '#aebdec',
            shadingShift: -0.06,
            shadingToony: 0.95,
            giEqualization: 0.74,
            rimColor: '#bfe7ff',
            rimLift: 0.08,
            rimPower: 3.2,
            rimLightingMix: 0.88,
            matcapColor: '#f8f3ff',
            outlineScale: 1.08,
            outlineWidth: 0.006,
            outlineColor: '#403b56',
            outlineLightingMix: 0.38
        },
        materialGroups: {
            skin: {
                shadeColor: '#e4c6d2',
                shadingShift: -0.012,
                shadingToony: 0.97,
                giEqualization: 0.9,
                rimColor: '#ffe9db',
                rimLift: 0.035,
                rimPower: 5.2,
                rimLightingMix: 0.58,
                outlineWidth: 0.0042,
                outlineScale: 0.68
            },
            faceLine: {
                shadeColor: '#f0dfe8',
                shadingShift: 0.02,
                shadingToony: 0.99,
                giEqualization: 0.96,
                rimLift: 0,
                rimLightingMix: 0.2,
                outlineWidth: 0.0025,
                outlineScale: 0.42
            },
            eyes: {
                shadeColor: '#ffffff',
                shadingShift: 0.045,
                shadingToony: 1,
                giEqualization: 1,
                rimColor: '#ebfbff',
                rimLift: 0.025,
                rimPower: 5.8,
                rimLightingMix: 0.35,
                matcapColor: '#ffffff',
                outlineWidth: 0.0013,
                outlineScale: 0.22
            },
            hair: {
                shadeColor: '#98afe6',
                shadingShift: -0.08,
                shadingToony: 0.96,
                giEqualization: 0.7,
                rimColor: '#bbecff',
                rimLift: 0.1,
                rimPower: 2.9,
                rimLightingMix: 0.92,
                matcapColor: '#e6f3ff',
                outlineWidth: 0.007,
                outlineScale: 1.16
            },
            cloth: {
                shadeColor: '#9cafdd',
                shadingShift: -0.075,
                shadingToony: 0.95,
                giEqualization: 0.72,
                rimColor: '#bfe6ff',
                rimLift: 0.085,
                rimPower: 3.1,
                rimLightingMix: 0.92,
                outlineWidth: 0.0065,
                outlineScale: 1.12
            },
            accessory: {
                shadeColor: '#b7bde5',
                shadingShift: -0.06,
                shadingToony: 0.9,
                giEqualization: 0.72,
                rimColor: '#fff0cf',
                rimLift: 0.08,
                rimPower: 3,
                rimLightingMix: 0.96,
                matcapColor: '#fff1cc',
                outlineWidth: 0.006,
                outlineScale: 1.05
            }
        }
    },
    {
        id: 'ailis_material_hybrid_npr',
        label: '材质混合 NPR',
        shortLabel: 'Hybrid NPR',
        description: '基于 VRM/MToon 的材质分组 NPR 预设：保留动漫脸部可读性，同时让头发、衣物和配件更有层次。',
        lighting: {
            ambient: { color: '#f3f6ff', intensity: 2.02 },
            key: { color: '#fff0d8', intensity: 1.1, position: [4.2, 5.5, 5.1] },
            fill: { color: '#d7e6ff', intensity: 0.3, position: [-4.4, 3.4, 3.9] },
            rim: { color: '#ccefff', intensity: 0.34, position: [-4.2, 4.6, -4.4] },
            sceneMood: {
                ambientMultiplier: 0.96,
                keyMultiplier: 1.08,
                ambientOffset: -0.02,
                keyOffset: 0.02,
                fillMoodInfluence: 0.08,
                rimMoodInfluence: 0.14
            }
        },
        materialDefaults: {
            shadeColor: '#bfc8ee',
            shadingShift: -0.035,
            shadingToony: 0.88,
            giEqualization: 0.8,
            rimColor: '#d4ecff',
            rimLift: 0.065,
            rimPower: 3.8,
            rimLightingMix: 0.78,
            matcapColor: '#fff5e7',
            outlineScale: 0.9,
            outlineWidth: 0.0045,
            outlineColor: '#4b465d',
            outlineLightingMix: 0.48
        },
        materialGroups: {
            skin: {
                shadeColor: '#ead1da',
                shadingShift: 0.015,
                shadingToony: 0.95,
                giEqualization: 0.95,
                rimColor: '#fff0e4',
                rimLift: 0.026,
                rimPower: 5.8,
                rimLightingMix: 0.5,
                outlineWidth: 0.0028,
                outlineScale: 0.55
            },
            faceLine: {
                shadeColor: '#f4e4eb',
                shadingShift: 0.045,
                shadingToony: 0.98,
                giEqualization: 1,
                rimLift: 0,
                rimLightingMix: 0.18,
                outlineWidth: 0.0016,
                outlineScale: 0.36
            },
            eyes: {
                shadeColor: '#ffffff',
                shadingShift: 0.06,
                shadingToony: 1,
                giEqualization: 1,
                rimColor: '#f4fcff',
                rimLift: 0.02,
                rimPower: 6.4,
                rimLightingMix: 0.28,
                matcapColor: '#ffffff',
                outlineWidth: 0.001,
                outlineScale: 0.18
            },
            hair: {
                shadeColor: '#aebbe7',
                shadingShift: -0.05,
                shadingToony: 0.88,
                giEqualization: 0.76,
                rimColor: '#cfeeff',
                rimLift: 0.085,
                rimPower: 3.1,
                rimLightingMix: 0.82,
                matcapColor: '#fff0f6',
                outlineWidth: 0.0048,
                outlineScale: 0.94
            },
            cloth: {
                shadeColor: '#adb9e2',
                shadingShift: -0.048,
                shadingToony: 0.82,
                giEqualization: 0.76,
                rimColor: '#d4ecff',
                rimLift: 0.075,
                rimPower: 3.4,
                rimLightingMix: 0.82,
                matcapColor: '#f4f6ff',
                outlineWidth: 0.0048,
                outlineScale: 0.96
            },
            accessory: {
                shadeColor: '#c9c4df',
                shadingShift: -0.035,
                shadingToony: 0.76,
                giEqualization: 0.7,
                rimColor: '#fff0c8',
                rimLift: 0.09,
                rimPower: 2.7,
                rimLightingMix: 0.95,
                matcapColor: '#fff0c8',
                outlineWidth: 0.0045,
                outlineScale: 0.88
            }
        }
    },
    {
        id: 'ailis_hard_cel_mtoon',
        label: '硬边赛璐璐 MToon',
        shortLabel: 'Hard Cel',
        description: '基于 VRM/MToon 近似传统赛璐璐动画：硬边阴影、强轮廓和低填充光。它不是完整 ramp cel shader。',
        lighting: {
            ambient: { color: '#eef4ff', intensity: 1.38 },
            key: { color: '#fff0d8', intensity: 1.48, position: [3.4, 5.8, 4.4] },
            fill: { color: '#c9dcff', intensity: 0.08, position: [-4.5, 2.8, 3.4] },
            rim: { color: '#e2f2ff', intensity: 0.26, position: [-4.6, 4.7, -4.5] },
            sceneMood: {
                ambientMultiplier: 0.72,
                keyMultiplier: 1.35,
                ambientOffset: -0.08,
                keyOffset: 0.04,
                fillMoodInfluence: 0.04,
                rimMoodInfluence: 0.1
            }
        },
        materialDefaults: {
            shadeColor: '#8e9fd0',
            shadingShift: -0.14,
            shadingToony: 1,
            giEqualization: 0.52,
            rimColor: '#d4ecff',
            rimLift: 0.035,
            rimPower: 4.8,
            rimLightingMix: 0.92,
            matcapColor: '#ffffff',
            outlineScale: 1.36,
            outlineWidth: 0.008,
            outlineColor: '#282437',
            outlineLightingMix: 0.18
        },
        materialGroups: {
            skin: {
                shadeColor: '#e3b7c5',
                shadingShift: -0.055,
                shadingToony: 1,
                giEqualization: 0.72,
                rimColor: '#ffe9dd',
                rimLift: 0.018,
                rimPower: 6.5,
                rimLightingMix: 0.42,
                matcapColor: '#fff5ed',
                outlineWidth: 0.005,
                outlineScale: 0.78
            },
            faceLine: {
                shadeColor: '#efd7df',
                shadingShift: 0.018,
                shadingToony: 1,
                giEqualization: 0.9,
                rimColor: '#ffffff',
                rimLift: 0,
                rimPower: 8,
                rimLightingMix: 0.12,
                outlineWidth: 0.003,
                outlineScale: 0.52
            },
            eyes: {
                shadeColor: '#ffffff',
                shadingShift: 0.055,
                shadingToony: 1,
                giEqualization: 1,
                rimColor: '#ffffff',
                rimLift: 0.015,
                rimPower: 7,
                rimLightingMix: 0.18,
                matcapColor: '#ffffff',
                outlineWidth: 0.0018,
                outlineScale: 0.28
            },
            hair: {
                shadeColor: '#778cc4',
                shadingShift: -0.18,
                shadingToony: 1,
                giEqualization: 0.48,
                rimColor: '#cfeaff',
                rimLift: 0.06,
                rimPower: 4.2,
                rimLightingMix: 0.95,
                matcapColor: '#f0f7ff',
                outlineWidth: 0.009,
                outlineScale: 1.46
            },
            cloth: {
                shadeColor: '#7f90c4',
                shadingShift: -0.17,
                shadingToony: 1,
                giEqualization: 0.48,
                rimColor: '#d7ecff',
                rimLift: 0.045,
                rimPower: 4.6,
                rimLightingMix: 0.94,
                matcapColor: '#f7f8ff',
                outlineWidth: 0.0088,
                outlineScale: 1.42
            },
            accessory: {
                shadeColor: '#a49fc4',
                shadingShift: -0.14,
                shadingToony: 0.98,
                giEqualization: 0.46,
                rimColor: '#fff0c8',
                rimLift: 0.065,
                rimPower: 3.6,
                rimLightingMix: 1,
                matcapColor: '#fff2c9',
                outlineWidth: 0.008,
                outlineScale: 1.28
            }
        }
    }
].sort((left, right) => PROFILE_ORDER.get(left.id) - PROFILE_ORDER.get(right.id)));

export function normalizeRenderProfileId(value) {
    const id = String(value || '').trim();
    const aliasedId = LEGACY_RENDER_PROFILE_ID_ALIASES[id] || id;
    return RENDER_PROFILE_IDS.includes(aliasedId) ? aliasedId : DEFAULT_RENDER_PROFILE_ID;
}

export function getRenderProfile(id = DEFAULT_RENDER_PROFILE_ID) {
    const normalizedId = normalizeRenderProfileId(id);
    return RENDER_PROFILES.find((profile) => profile.id === normalizedId) || RENDER_PROFILES[0];
}

export function listRenderProfiles() {
    return RENDER_PROFILES.map((profile) => ({
        id: profile.id,
        label: profile.label,
        shortLabel: profile.shortLabel,
        description: profile.description
    }));
}
