const { spawn } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

function normalizeText(value, fallback = '') {
    if (typeof value !== 'string') {
        return fallback;
    }
    return value.trim() || fallback;
}

function clampInteger(value, fallback, minimum, maximum) {
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) {
        return fallback;
    }
    return Math.max(minimum, Math.min(Math.round(numeric), maximum));
}

function normalizeChessFen(value = '') {
    const parts = normalizeText(value).split(/\s+/).filter(Boolean);
    if (parts.length === 4) {
        parts.push('0', '1');
    }
    return parts.length === 6 ? parts.join(' ') : '';
}

function resolveStockfishEngine(enginePath = '') {
    const configured = normalizeText(
        enginePath || process.env.AILIS_STOCKFISH_ENGINE_PATH
    );
    if (configured && fs.existsSync(configured)) {
        return {
            path: path.resolve(configured),
            version: 'configured'
        };
    }
    try {
        const packagePath = require.resolve('stockfish/package.json');
        const stockfishPackage = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
        const version = normalizeText(stockfishPackage.buildVersion, '18');
        const bundledPath = path.join(
            path.dirname(packagePath),
            'bin',
            `stockfish-${version}-lite-single.js`
        );
        return fs.existsSync(bundledPath)
            ? { path: bundledPath, version }
            : { path: '', version };
    } catch {
        return {
            path: '',
            version: ''
        };
    }
}

function parseStockfishInfoLine(line = '') {
    if (!/^info\s/.test(line) || !/\bpv\s/.test(line)) {
        return null;
    }
    const depth = Number(line.match(/\bdepth\s+(\d+)/)?.[1] || 0);
    const scoreMatch = line.match(/\bscore\s+(cp|mate)\s+(-?\d+)/);
    const movesUci = normalizeText(line.match(/\bpv\s+(.+)$/)?.[1])
        .split(/\s+/)
        .filter(Boolean);
    if (!depth || !scoreMatch || !movesUci.length) {
        return null;
    }
    return {
        rank: Number(line.match(/\bmultipv\s+(\d+)/)?.[1] || 1),
        depth,
        selectiveDepth: Number(line.match(/\bseldepth\s+(\d+)/)?.[1] || 0),
        score: {
            type: scoreMatch[1],
            value: Number(scoreMatch[2]),
            perspective: 'side_to_move'
        },
        nodes: Number(line.match(/\bnodes\s+(\d+)/)?.[1] || 0),
        nps: Number(line.match(/\bnps\s+(\d+)/)?.[1] || 0),
        timeMs: Number(line.match(/\btime\s+(\d+)/)?.[1] || 0),
        movesUci
    };
}

function uciMoveArgs(uci = '') {
    const normalized = normalizeText(uci).toLowerCase();
    if (!/^[a-h][1-8][a-h][1-8][qrbn]?$/.test(normalized)) {
        return null;
    }
    return {
        from: normalized.slice(0, 2),
        to: normalized.slice(2, 4),
        ...(normalized[4] ? { promotion: normalized[4] } : {})
    };
}

function convertUciVariationToSan(Chess, fen, movesUci = []) {
    const board = new Chess(fen);
    const movesSan = [];
    for (const uci of Array.isArray(movesUci) ? movesUci : []) {
        const moveArgs = uciMoveArgs(uci);
        if (!moveArgs) {
            break;
        }
        try {
            const move = board.move(moveArgs);
            if (!move) {
                break;
            }
            movesSan.push(move.san);
        } catch {
            break;
        }
    }
    return movesSan;
}

async function runStockfishAnalysis({
    fen,
    depth = 18,
    multiPv = 3,
    analysisTimeMs = 12000,
    timeoutMs = 45000,
    enginePath = ''
} = {}) {
    const engine = resolveStockfishEngine(enginePath);
    if (!engine.path) {
        return {
            ok: false,
            status: 'backend_unavailable',
            error: 'Stockfish engine was not found.'
        };
    }

    return await new Promise((resolve) => {
        let child;
        try {
            child = spawn(process.execPath, [engine.path], {
                windowsHide: true,
                stdio: ['pipe', 'pipe', 'pipe']
            });
        } catch (error) {
            resolve({
                ok: false,
                status: 'spawn_failed',
                error: error?.message || String(error)
            });
            return;
        }

        let settled = false;
        let resolved = false;
        let phase = 'uci';
        let stdoutBuffer = '';
        let stderr = '';
        let timeout = null;
        let softStopTimer = null;
        let cleanupTimer = null;
        const variations = new Map();

        const resolveOnce = (value) => {
            if (resolved) return;
            resolved = true;
            clearTimeout(cleanupTimer);
            resolve(value);
        };
        const finish = (value, graceful = false) => {
            if (settled) return;
            settled = true;
            clearTimeout(timeout);
            clearTimeout(softStopTimer);
            if (graceful && child.stdin.writable) {
                try {
                    child.stdin.write('quit\n');
                } catch {}
            } else {
                try {
                    child.kill();
                } catch {}
            }
            if (child.exitCode !== null) {
                resolveOnce(value);
                return;
            }
            child.once('close', () => resolveOnce(value));
            cleanupTimer = setTimeout(() => {
                try {
                    child.kill();
                } catch {}
                resolveOnce(value);
            }, 1500);
            cleanupTimer.unref?.();
        };
        const sendCommand = (command) => {
            if (!settled && child.stdin.writable) {
                child.stdin.write(`${command}\n`);
            }
        };
        const handleLine = (rawLine) => {
            const line = normalizeText(rawLine);
            if (!line || settled) return;
            if (phase === 'uci' && line === 'uciok') {
                phase = 'ready';
                sendCommand('isready');
                return;
            }
            if (phase === 'ready' && line === 'readyok') {
                phase = 'analysis';
                sendCommand(`setoption name MultiPV value ${multiPv}`);
                sendCommand(`position fen ${fen}`);
                sendCommand(`go depth ${depth}`);
                softStopTimer = setTimeout(() => {
                    sendCommand('stop');
                }, analysisTimeMs);
                softStopTimer.unref?.();
                return;
            }
            if (phase !== 'analysis') return;

            const info = parseStockfishInfoLine(line);
            if (info) {
                variations.set(info.rank, info);
                return;
            }
            const bestMoveMatch = line.match(/^bestmove\s+(\S+)(?:\s+ponder\s+(\S+))?/);
            if (bestMoveMatch) {
                finish({
                    ok: true,
                    status: 'completed',
                    engineVersion: engine.version,
                    bestMoveUci: bestMoveMatch[1],
                    ponderUci: bestMoveMatch[2] || '',
                    variations: [...variations.values()]
                        .sort((left, right) => left.rank - right.rank),
                    stderr
                }, true);
            }
        };
        const consumeStdout = (chunk) => {
            stdoutBuffer += chunk;
            let newlineIndex = stdoutBuffer.indexOf('\n');
            while (newlineIndex >= 0) {
                handleLine(stdoutBuffer.slice(0, newlineIndex));
                stdoutBuffer = stdoutBuffer.slice(newlineIndex + 1);
                newlineIndex = stdoutBuffer.indexOf('\n');
            }
        };

        child.stdout.setEncoding('utf8');
        child.stderr.setEncoding('utf8');
        child.stdout.on('data', consumeStdout);
        child.stderr.on('data', (chunk) => {
            stderr = `${stderr}${chunk}`.slice(-4000);
        });
        child.on('error', (error) => finish({
            ok: false,
            status: 'spawn_failed',
            error: error?.message || String(error)
        }));
        child.on('close', (exitCode) => {
            if (!settled) {
                finish({
                    ok: false,
                    status: 'engine_exited',
                    error: `Stockfish exited before returning bestmove (code ${exitCode ?? 'unknown'}).`,
                    stderr
                });
            }
        });
        timeout = setTimeout(() => finish({
            ok: false,
            status: 'timeout',
            error: `Stockfish analysis timed out after ${timeoutMs}ms.`,
            stderr
        }), timeoutMs);
        sendCommand('uci');
    });
}

async function analyzeChessPosition(args = {}) {
    const fen = normalizeChessFen(args.fen || args.position);
    if (!fen) {
        return {
            ok: false,
            status: 'invalid_fen',
            error: 'A complete FEN with 4 or 6 fields is required.',
            receivedFen: normalizeText(args.fen || args.position)
        };
    }

    let Chess;
    let board;
    try {
        ({ Chess } = require('chess.js'));
        board = new Chess(fen);
    } catch (error) {
        return {
            ok: false,
            status: 'invalid_fen',
            error: error?.message || String(error),
            fen
        };
    }

    const depth = clampInteger(args.depth, 18, 8, 24);
    const multiPv = clampInteger(args.multiPv ?? args.multi_pv, 3, 1, 5);
    const timeoutMs = clampInteger(args.timeoutMs, 45000, 5000, 120000);
    const analysisTimeMs = clampInteger(
        args.analysisTimeMs ?? args.maxTimeMs ?? args.max_time_ms,
        Math.min(12000, timeoutMs - 2000),
        1000,
        Math.max(1000, Math.min(60000, timeoutMs - 1500))
    );
    const canonicalFen = board.fen();
    const engineResult = await runStockfishAnalysis({
        fen: canonicalFen,
        depth,
        multiPv,
        analysisTimeMs,
        timeoutMs,
        enginePath: normalizeText(args.enginePath || args.engine_path)
    });
    if (!engineResult.ok) {
        return engineResult;
    }

    const variations = engineResult.variations.map((variation) => ({
        ...variation,
        movesSan: convertUciVariationToSan(
            Chess,
            canonicalFen,
            variation.movesUci
        )
    }));
    const bestMoveBoard = new Chess(canonicalFen);
    const bestMoveArgs = uciMoveArgs(engineResult.bestMoveUci);
    let bestMoveSan = '';
    try {
        bestMoveSan = bestMoveArgs
            ? bestMoveBoard.move(bestMoveArgs)?.san || ''
            : '';
    } catch {}
    if (!bestMoveSan) {
        return {
            ok: false,
            status: 'invalid_engine_move',
            error: 'Stockfish returned a move that is not legal in the submitted FEN.',
            fen: canonicalFen,
            bestMoveUci: engineResult.bestMoveUci
        };
    }

    const sideToMove = canonicalFen.split(/\s+/)[1] === 'b' ? 'black' : 'white';
    const topVariation = variations.find((variation) => variation.rank === 1) ||
        variations[0] ||
        null;
    return {
        ok: true,
        status: 'completed',
        backend: 'stockfish_wasm',
        engineVersion: engineResult.engineVersion,
        fen: canonicalFen,
        sideToMove,
        boardEcho: board.ascii(),
        bestMove: {
            san: bestMoveSan,
            uci: engineResult.bestMoveUci,
            ponderUci: engineResult.ponderUci
        },
        analysis: {
            requestedDepth: depth,
            requestedAnalysisTimeMs: analysisTimeMs,
            multiPv,
            topScore: topVariation?.score || null,
            reachedDepth: topVariation?.depth || 0,
            timeMs: topVariation?.timeMs || 0,
            nodes: topVariation?.nodes || 0
        },
        variations
    };
}

module.exports = {
    analyzeChessPosition,
    convertUciVariationToSan,
    normalizeChessFen,
    parseStockfishInfoLine,
    resolveStockfishEngine,
    runStockfishAnalysis,
    uciMoveArgs
};
