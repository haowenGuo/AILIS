const SACHI_CAPTURE_FILES = Object.freeze([
    'CC0animation3airplane01.vrma',
    'CC0animation3airplane02.vrma',
    'CC0animation3airplane05.vrma',
    'CC0animationhappy01.vrma',
    'CC0animationhima01.vrma',
    'CC0animationidle01.vrma',
    'CC0animationidle03.vrma',
    'CC0animationidle04.vrma',
    'CC0animationidle05.vrma',
    'CC0animationkurukuru01.vrma',
    'CC0animationother1.vrma',
    'CC0animationother2.vrma',
    'CC0animationpoint1.vrma',
    'CC0animationrightwave1.vrma',
    'CC0animationrotate01.vrma',
    'CC0animationrotate02.vrma',
    'CC0animationrotate6.vrma',
    'CC0animationrotate7.vrma',
    'CC0animationrotate_left1.vrma',
    'CC0animationrotate_right.vrma',
    'CC0animationrotate_right2.vrma',
    'CC0animationruru01.vrma',
    'CC0animationruru02.vrma',
    'CC0animationsit01.vrma',
    'CC0animationsitwave01.vrma',
    'CC0animationskirt01.vrma',
    'CC0animationsmallwve.vrma',
    'CC0animationstand01.vrma',
    'CC0animationunknown1.vrma',
    'CC0animationunknown2.vrma',
    'CC0animationunknown3.vrma',
    'CC0animationunknown4.vrma',
    'CC0animationunknown5.vrma',
    'CC0animationunwalk1.vrma',
    'CC0animationunwalk2.vrma',
    'CC0animationunwave.vrma',
    'CC0animationunwave9.vrma',
    'CC0animationwave01.vrma',
    'CC0animationwave02.vrma',
    'CC0animationwave03.vrma',
    'CC0animationwave04.vrma',
    'CC0animationzatu01.vrma'
]);

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

function createSachiEntry(fileName) {
    const token = normalizeToken(fileName);
    return createEntry({
        id: `sachi_${token}`,
        displayName: `Sachi ${stripExtension(fileName)}`,
        localPath: `Resources/MotionIntake/candidates/sachi-vrma-1/extracted/SachiVRMA1/capture_vrma/${fileName}`,
        source: 'sachi-vrma-1',
        license: 'CC0 according to BOOTH item description; verify archive terms if re-downloaded',
        token,
        notes: 'Imported from local SachiVRMA1.zip. Archive extraction reached VRMA files but failed later on bundled Blender source, so keep this as candidate-only until visual and archive review.'
    });
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
