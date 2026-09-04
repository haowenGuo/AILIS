
const FUMI2KICK_FILES = Object.freeze([
    '001_motion_pose.vrma',
    '002_dogeza.vrma',
    '003_humidai.vrma',
    '004_hello_1.vrma',
    '005_smartphone.vrma',
    '006_drinkwater.vrma',
    '007_gekirei.vrma',
    '008_gatan.vrma'
]);

function stripExtension(fileName) {
    return fileName.replace(/\.[^.]+$/, '');
}

function normalizeToken(fileName) {
    return stripExtension(fileName)
        .replace(/^CC0animation/i, '')
        .replace(/[^a-zA-Z0-9]+/g, '_')
        .replace(/_+/g, '_')
        .replace(/^_|_$/g, '')
        .toLowerCase();
}

function classifyStyle(token) {
    if (/idle|hima|stand/.test(token)) {
        return ['idle_candidate', 'daily'];
    }
    if (/wave|hello/.test(token)) {
        return ['greeting', 'daily'];
    }
    if (/happy|gekirei/.test(token)) {
        return ['happy', 'cheer'];
    }
    if (/sit|drink|smartphone/.test(token)) {
        return ['prop_or_sit', 'daily'];
    }
    if (/skirt|small|ruru/.test(token)) {
        return ['cute', 'soft'];
    }
    if (/point|pose|motion/.test(token)) {
        return ['pose', 'daily'];
    }
    if (/rotate|kurukuru|airplane/.test(token)) {
        return ['showcase', 'spin'];
    }
    if (/dogeza|humidai|gatan|unknown|zatu|unwalk/.test(token)) {
        return ['gag_or_unclear', 'experimental'];
    }
    return ['unclear', 'experimental'];
}

function estimateFeminineScore(token) {
    if (/skirt|small|ruru|happy|wave|hello/.test(token)) {
        return 0.62;
    }
    if (/idle|hima|stand|drink|smartphone/.test(token)) {
        return 0.54;
    }
    if (/point|pose|motion|sit/.test(token)) {
        return 0.46;
    }
    if (/rotate|kurukuru|airplane/.test(token)) {
        return 0.36;
    }
    if (/dogeza|humidai|gatan|unknown|zatu|unwalk/.test(token)) {
        return 0.22;
    }
    return 0.38;
}

function estimateClippingRisk(token) {
    if (/sit|dogeza|humidai|drink|smartphone|skirt|gatan/.test(token)) {
        return 'high';
    }
    if (/rotate|kurukuru|airplane|ruru|unknown|unwalk/.test(token)) {
        return 'high';
    }
    if (/wave|hello|happy|point|pose|motion/.test(token)) {
        return 'medium';
    }
    return 'medium';
}

function createEntry({
    id,
    displayName,
    localPath,
    source,
    license,
    notes,
    token
}) {
    return {
        id,
        displayName,
        localPath,
        source,
        license,
        style: classifyStyle(token),
        feminineScore: estimateFeminineScore(token),
        clippingRisk: estimateClippingRisk(token),
        approved: false,
        reviewStatus: 'candidate',
        reviewBy: '',
        notes
    };
}

function createFumiEntry(fileName) {
    const token = normalizeToken(fileName);
    return createEntry({
        id: `fumi_${token}`,
        displayName: `fumi2kick ${stripExtension(fileName)}`,
        localPath: `Resources/MotionIntake/candidates/fumi2kick-vrma-motion-pack/extracted/fm_vrma_motion_pack_01/vrma/${fileName}`,
        source: 'fumi2kick-vrma-motion-pack',
        license: 'CC0 according to packaged README and BOOTH item description',
        token,
        notes: 'Imported from local fm_vrma_motion_pack_01.zip. Many motions are gag/comedy oriented, so keep out of stable Runtime until AILIS visual review.'
    });
}

export const EXTERNAL_MOTION_INTAKE_CATALOG = Object.freeze(Object.fromEntries([
    ...FUMI2KICK_FILES.map(createFumiEntry)
].map((entry) => [entry.id, entry])));
