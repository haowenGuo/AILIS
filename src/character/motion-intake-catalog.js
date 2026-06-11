import { EXTERNAL_MOTION_INTAKE_CATALOG } from './motion-intake-external-candidates.js';

const REQUIRED_REVIEW_FIELDS = Object.freeze([
    'source',
    'license',
    'style',
    'feminineScore',
    'clippingRisk',
    'approved'
]);

const LOADABLE_MOTION_IDS = Object.freeze(new Set([
    'idle',
    'idle1',
    'idle2',
    'jump',
    'vrma17',
    'vrma25',
    'vroid_show_full_body',
    'vroid_greeting',
    'vroid_peace',
    'vroid_shoot',
    'vroid_spin',
    'vroid_model_pose',
    'vroid_squat',
    'fumi_001_motion_pose',
    'fumi_002_dogeza',
    'fumi_003_humidai',
    'fumi_004_hello_1',
    'fumi_005_smartphone',
    'fumi_006_drinkwater',
    'fumi_007_gekirei',
    'fumi_008_gatan'
]));

export const MOTION_INTAKE_SOURCES = Object.freeze({
    'local-vrma-motionpack-named': {
        id: 'local-vrma-motionpack-named',
        title: 'Existing local named VRMA motions',
        itemUrl: '',
        downloadableUrl: '',
        license: 'unknown-local-file; do not redistribute until source is verified',
        downloadStatus: 'present',
        notes: 'Legacy local files under Resources/VRMA_MotionPack/vrma. Kept in candidate review unless explicitly approved.'
    },
    'vroid-official-7-vrma': {
        id: 'vroid-official-7-vrma',
        title: 'VRoid official 7 VRMA motions',
        itemUrl: 'https://booth.pm/ja/items/5512385',
        downloadableUrl: 'https://booth.pm/downloadables/4220234',
        license: 'VRoid Project free license; commercial use allowed with credit; redistribution/extractable reuse restricted',
        downloadStatus: 'present',
        notes: 'The local Resources/VRMA_MotionPack readme matches this pack and lists VRMA_01 to VRMA_07.'
    },
    'sachi-vrma-1': {
        id: 'sachi-vrma-1',
        title: '[CC0] Sachi VRMA 1',
        itemUrl: 'https://booth.pm/en/items/6412084',
        downloadableUrl: 'https://booth.pm/downloadables/5713997',
        license: 'CC0 according to BOOTH item description; verify archive terms after download',
        downloadStatus: 'imported_partial_archive',
        notes: 'Imported from F:/新建文件夹/SachiVRMA1.zip. The ZIP central directory is damaged; tar extracted 42 capture_vrma files but failed later on bundled Blender source.'
    },
    'fumi2kick-vrma-motion-pack': {
        id: 'fumi2kick-vrma-motion-pack',
        title: 'fumi2kick VRMA motion pack',
        itemUrl: 'https://booth.pm/ja/items/5527394',
        downloadableUrl: 'https://booth.pm/downloadables/4234181',
        license: 'CC0 according to BOOTH item description; verify archive terms after download',
        downloadStatus: 'imported',
        notes: 'Imported from F:/新建文件夹/fm_vrma_motion_pack_01.zip. Good free candidate source, but many motions may be gag/comedy oriented and need strict AIGL style review.'
    }
});

const BASE_MOTION_INTAKE_CATALOG = Object.freeze({
    idle: {
        id: 'idle',
        displayName: 'Idle',
        localPath: 'Resources/VRMA_MotionPack/vrma/Idle.vrma',
        source: 'local-vrma-motionpack-named',
        license: 'unknown-local-file; do not redistribute until source is verified',
        style: ['soft_idle', 'daily'],
        feminineScore: 0.56,
        clippingRisk: 'low',
        approved: true,
        reviewStatus: 'approved',
        reviewBy: 'runtime-baseline',
        notes: 'Current stable idle baseline. Still worth replacing with a softer feminine idle later.'
    },
    idle1: {
        id: 'idle1',
        displayName: 'Idle 1',
        localPath: 'Resources/VRMA_MotionPack/vrma/Idle1.vrma',
        source: 'local-vrma-motionpack-named',
        license: 'unknown-local-file; do not redistribute until source is verified',
        style: ['soft_idle', 'daily'],
        feminineScore: 0.54,
        clippingRisk: 'low',
        approved: true,
        reviewStatus: 'approved',
        reviewBy: 'runtime-baseline',
        notes: 'Approved only as a stable idle fallback; not considered final AIGL art direction.'
    },
    idle2: {
        id: 'idle2',
        displayName: 'Idle 2',
        localPath: 'Resources/VRMA_MotionPack/vrma/Idle2.vrma',
        source: 'local-vrma-motionpack-named',
        license: 'unknown-local-file; do not redistribute until source is verified',
        style: ['soft_idle', 'daily'],
        feminineScore: 0.52,
        clippingRisk: 'low',
        approved: true,
        reviewStatus: 'approved',
        reviewBy: 'runtime-baseline',
        notes: 'Approved only as a stable idle fallback.'
    },
    thinking: {
        id: 'thinking',
        displayName: 'Thinking',
        localPath: 'Resources/VRMA_MotionPack/vrma/Thinking.vrma',
        source: 'local-vrma-motionpack-named',
        license: 'unknown-local-file; do not redistribute until source is verified',
        style: ['thinking', 'daily'],
        feminineScore: 0.42,
        clippingRisk: 'medium',
        approved: false,
        reviewStatus: 'candidate',
        notes: 'Needs visual pass on AIGL. Current procedural thinking pose is preferred for stable runtime.'
    },
    lookaround: {
        id: 'lookaround',
        displayName: 'Look Around',
        localPath: 'Resources/VRMA_MotionPack/vrma/LookAround.vrma',
        source: 'local-vrma-motionpack-named',
        license: 'unknown-local-file; do not redistribute until source is verified',
        style: ['curious', 'daily'],
        feminineScore: 0.4,
        clippingRisk: 'medium',
        approved: false,
        reviewStatus: 'candidate',
        notes: 'Useful intent, but needs head/shoulder clipping and gendered pose review.'
    },
    blush: {
        id: 'blush',
        displayName: 'Blush',
        localPath: 'Resources/VRMA_MotionPack/vrma/Blush.vrma',
        source: 'local-vrma-motionpack-named',
        license: 'unknown-local-file; do not redistribute until source is verified',
        style: ['shy', 'cute'],
        feminineScore: 0.62,
        clippingRisk: 'medium',
        approved: false,
        reviewStatus: 'candidate',
        notes: 'Promising AIGL style, but must be checked for hand/face clipping.'
    },
    relax: {
        id: 'relax',
        displayName: 'Relax',
        localPath: 'Resources/VRMA_MotionPack/vrma/Relax.vrma',
        source: 'local-vrma-motionpack-named',
        license: 'unknown-local-file; do not redistribute until source is verified',
        style: ['relaxed', 'daily'],
        feminineScore: 0.48,
        clippingRisk: 'medium',
        approved: false,
        reviewStatus: 'candidate',
        notes: 'Candidate for comforting/idle variation after visual review.'
    },
    goodbye: {
        id: 'goodbye',
        displayName: 'Goodbye',
        localPath: 'Resources/VRMA_MotionPack/vrma/Goodbye.vrma',
        source: 'local-vrma-motionpack-named',
        license: 'unknown-local-file; do not redistribute until source is verified',
        style: ['greeting', 'daily'],
        feminineScore: 0.46,
        clippingRisk: 'medium',
        approved: false,
        reviewStatus: 'candidate',
        notes: 'Greeting intent is useful; style and sleeve/arm clipping need review.'
    },
    clapping: {
        id: 'clapping',
        displayName: 'Clapping',
        localPath: 'Resources/VRMA_MotionPack/vrma/Clapping.vrma',
        source: 'local-vrma-motionpack-named',
        license: 'unknown-local-file; do not redistribute until source is verified',
        style: ['success', 'cheer'],
        feminineScore: 0.44,
        clippingRisk: 'high',
        approved: false,
        reviewStatus: 'candidate',
        notes: 'Likely to clip around hands/chest on AIGL. Keep out of stable runtime until visually accepted.'
    },
    jump: {
        id: 'jump',
        displayName: 'Jump',
        localPath: 'Resources/VRMA_MotionPack/vrma/Jump.vrma',
        source: 'local-vrma-motionpack-named',
        license: 'unknown-local-file; do not redistribute until source is verified',
        style: ['energetic', 'success'],
        feminineScore: 0.32,
        clippingRisk: 'high',
        approved: false,
        reviewStatus: 'candidate',
        notes: 'Energetic and risky for desktop assistant framing; stable runtime should prefer expression/procedural success pose.'
    },
    angry: {
        id: 'angry',
        displayName: 'Angry',
        localPath: 'Resources/VRMA_MotionPack/vrma/Angry.vrma',
        source: 'local-vrma-motionpack-named',
        license: 'unknown-local-file; do not redistribute until source is verified',
        style: ['angry', 'comic'],
        feminineScore: 0.28,
        clippingRisk: 'medium',
        approved: false,
        reviewStatus: 'candidate',
        notes: 'May be too strong/masculine for AIGL default personality.'
    },
    sad: {
        id: 'sad',
        displayName: 'Sad',
        localPath: 'Resources/VRMA_MotionPack/vrma/Sad.vrma',
        source: 'local-vrma-motionpack-named',
        license: 'unknown-local-file; do not redistribute until source is verified',
        style: ['sad', 'soft'],
        feminineScore: 0.5,
        clippingRisk: 'medium',
        approved: false,
        reviewStatus: 'candidate',
        notes: 'Potentially useful for apology/comforting, but needs visual pass.'
    },
    sleepy: {
        id: 'sleepy',
        displayName: 'Sleepy',
        localPath: 'Resources/VRMA_MotionPack/vrma/Sleepy.vrma',
        source: 'local-vrma-motionpack-named',
        license: 'unknown-local-file; do not redistribute until source is verified',
        style: ['sleepy', 'soft'],
        feminineScore: 0.5,
        clippingRisk: 'medium',
        approved: false,
        reviewStatus: 'candidate',
        notes: 'Good low-energy candidate; check head/hand positions.'
    },
    surprised: {
        id: 'surprised',
        displayName: 'Surprised',
        localPath: 'Resources/VRMA_MotionPack/vrma/Surprised.vrma',
        source: 'local-vrma-motionpack-named',
        license: 'unknown-local-file; do not redistribute until source is verified',
        style: ['surprised', 'comic'],
        feminineScore: 0.38,
        clippingRisk: 'medium',
        approved: false,
        reviewStatus: 'candidate',
        notes: 'Use expression mixer by default; one-shot motion needs review.'
    },
    vrma17: {
        id: 'vrma17',
        displayName: 'Dance VRMA 17',
        localPath: 'Resources/VRMA_MotionPack/vrma/VRMA_17.vrma',
        source: 'local-vrma-motionpack-named',
        license: 'unknown-local-file; do not redistribute until source is verified',
        style: ['dance', 'energetic'],
        feminineScore: 0.2,
        clippingRisk: 'high',
        approved: false,
        reviewStatus: 'rejected_for_stable',
        notes: 'Reported as too masculine and clipping-prone. Manual lab only.'
    },
    vrma25: {
        id: 'vrma25',
        displayName: 'Dance VRMA 25',
        localPath: 'Resources/VRMA_MotionPack/vrma/VRMA_25.vrma',
        source: 'local-vrma-motionpack-named',
        license: 'unknown-local-file; do not redistribute until source is verified',
        style: ['dance', 'energetic'],
        feminineScore: 0.24,
        clippingRisk: 'high',
        approved: false,
        reviewStatus: 'rejected_for_stable',
        notes: 'Reported as too masculine and clipping-prone. Manual lab only.'
    },
    vroid_show_full_body: {
        id: 'vroid_show_full_body',
        displayName: 'VRoid Show Full Body',
        localPath: 'Resources/VRMA_MotionPack/vrma/VRMA_01.vrma',
        source: 'vroid-official-7-vrma',
        license: 'VRoid Project free license; commercial use allowed with credit; redistribution/extractable reuse restricted',
        style: ['presentation', 'neutral'],
        feminineScore: 0.34,
        clippingRisk: 'medium',
        approved: false,
        reviewStatus: 'candidate',
        notes: 'Stable base quality but not especially feminine. Candidate only.'
    },
    vroid_greeting: {
        id: 'vroid_greeting',
        displayName: 'VRoid Greeting',
        localPath: 'Resources/VRMA_MotionPack/vrma/VRMA_02.vrma',
        source: 'vroid-official-7-vrma',
        license: 'VRoid Project free license; commercial use allowed with credit; redistribution/extractable reuse restricted',
        style: ['greeting', 'neutral'],
        feminineScore: 0.38,
        clippingRisk: 'medium',
        approved: false,
        reviewStatus: 'candidate',
        notes: 'Worth comparing against Goodbye.vrma, but not stable until AIGL visual review.'
    },
    vroid_peace: {
        id: 'vroid_peace',
        displayName: 'VRoid Peace Sign',
        localPath: 'Resources/VRMA_MotionPack/vrma/VRMA_03.vrma',
        source: 'vroid-official-7-vrma',
        license: 'VRoid Project free license; commercial use allowed with credit; redistribution/extractable reuse restricted',
        style: ['cute', 'pose'],
        feminineScore: 0.46,
        clippingRisk: 'medium',
        approved: false,
        reviewStatus: 'candidate',
        notes: 'Potentially cute, but hand/face and sleeve clipping must be checked.'
    },
    vroid_shoot: {
        id: 'vroid_shoot',
        displayName: 'VRoid Shoot',
        localPath: 'Resources/VRMA_MotionPack/vrma/VRMA_04.vrma',
        source: 'vroid-official-7-vrma',
        license: 'VRoid Project free license; commercial use allowed with credit; redistribution/extractable reuse restricted',
        style: ['pose', 'comic'],
        feminineScore: 0.28,
        clippingRisk: 'medium',
        approved: false,
        reviewStatus: 'candidate',
        notes: 'Probably outside AIGL default assistant tone.'
    },
    vroid_spin: {
        id: 'vroid_spin',
        displayName: 'VRoid Spin',
        localPath: 'Resources/VRMA_MotionPack/vrma/VRMA_05.vrma',
        source: 'vroid-official-7-vrma',
        license: 'VRoid Project free license; commercial use allowed with credit; redistribution/extractable reuse restricted',
        style: ['spin', 'showcase'],
        feminineScore: 0.4,
        clippingRisk: 'high',
        approved: false,
        reviewStatus: 'candidate',
        notes: 'Root/framing risk for desktop assistant. Manual lab only.'
    },
    vroid_model_pose: {
        id: 'vroid_model_pose',
        displayName: 'VRoid Model Pose',
        localPath: 'Resources/VRMA_MotionPack/vrma/VRMA_06.vrma',
        source: 'vroid-official-7-vrma',
        license: 'VRoid Project free license; commercial use allowed with credit; redistribution/extractable reuse restricted',
        style: ['pose', 'showcase'],
        feminineScore: 0.42,
        clippingRisk: 'medium',
        approved: false,
        reviewStatus: 'candidate',
        notes: 'May work as a screenshot pose, not as automatic conversation motion.'
    },
    vroid_squat: {
        id: 'vroid_squat',
        displayName: 'VRoid Squat',
        localPath: 'Resources/VRMA_MotionPack/vrma/VRMA_07.vrma',
        source: 'vroid-official-7-vrma',
        license: 'VRoid Project free license; commercial use allowed with credit; redistribution/extractable reuse restricted',
        style: ['squat', 'showcase'],
        feminineScore: 0.22,
        clippingRisk: 'high',
        approved: false,
        reviewStatus: 'rejected_for_stable',
        notes: 'High clothing/framing risk and not suitable for AIGL default desktop assistant behavior.'
    }
});

export const MOTION_INTAKE_CATALOG = Object.freeze({
    ...BASE_MOTION_INTAKE_CATALOG,
    ...EXTERNAL_MOTION_INTAKE_CATALOG
});

function normalizeMotionId(motionId) {
    return String(motionId || '').trim();
}

export function getMotionIntakeEntry(motionId) {
    return MOTION_INTAKE_CATALOG[normalizeMotionId(motionId)] || null;
}

export function getMotionIntakeSource(sourceId) {
    return MOTION_INTAKE_SOURCES[String(sourceId || '').trim()] || null;
}

export function listMotionIntakeEntries() {
    return Object.values(MOTION_INTAKE_CATALOG).map((entry) => ({ ...entry }));
}

export function listMotionIntakeSources() {
    return Object.values(MOTION_INTAKE_SOURCES).map((source) => ({ ...source }));
}

export function getMotionReviewStatusFromIntake(motionId) {
    const entry = getMotionIntakeEntry(motionId);
    if (!entry) {
        return 'untracked';
    }
    if (isMotionIntakeApproved(motionId)) {
        return 'approved';
    }
    return entry.reviewStatus || 'candidate';
}

export function isMotionIntakeApproved(motionId) {
    const normalizedId = normalizeMotionId(motionId);
    return getMotionIntakeEntry(normalizedId)?.approved === true;
}

export function getLoadableMotionFiles() {
    return listMotionIntakeEntries()
        .filter((entry) => entry.localPath && entry.loadable !== false && LOADABLE_MOTION_IDS.has(entry.id))
        .map((entry) => ({
            name: entry.id,
            path: entry.localPath
        }));
}

export function validateMotionIntakeEntry(entry = {}) {
    const missing = REQUIRED_REVIEW_FIELDS.filter((field) => entry[field] === undefined || entry[field] === null);
    const source = getMotionIntakeSource(entry.source);
    if (!source) {
        missing.push('knownSource');
    }
    if (!Array.isArray(entry.style) || entry.style.length === 0) {
        missing.push('nonEmptyStyle');
    }
    const feminineScore = Number(entry.feminineScore);
    if (!Number.isFinite(feminineScore) || feminineScore < 0 || feminineScore > 1) {
        missing.push('feminineScore:0..1');
    }
    if (!['low', 'medium', 'high', 'unknown'].includes(entry.clippingRisk)) {
        missing.push('clippingRisk:low|medium|high|unknown');
    }
    if (typeof entry.approved !== 'boolean') {
        missing.push('approved:boolean');
    }
    return {
        ok: missing.length === 0,
        missing
    };
}
