const fs = require('fs');
const fsp = require('fs/promises');
const path = require('path');
const { createHash, randomUUID } = require('crypto');
const { SerialWriteQueue, atomicWriteText } = require('./ailis-async-writes.cjs');

const clone = (value) => value == null ? null : JSON.parse(JSON.stringify(value));

function parseSession(raw, sessionId) {
    const state = JSON.parse(raw);
    if (state.sessionId !== String(sessionId) || !Array.isArray(state.checkpoint?.items)) {
        throw new Error('Invalid AILIS unified Session context store');
    }
    return state;
}

function sessionBusy() {
    const error = new Error('This AILIS Session is already active in another gateway. Wait for that turn to finish.');
    error.code = 'AILIS_SESSION_BUSY';
    return error;
}

function isDeadOwner(previous) {
    if (!Number.isInteger(previous?.pid) || previous.pid <= 0) return false;
    try { process.kill(previous.pid, 0); } catch (probe) { return probe.code === 'ESRCH'; }
    return false;
}

async function createLockFile(filePath, body) {
    const file = await fsp.open(filePath, 'wx');
    try {
        try {
            await file.writeFile(body, 'utf8');
        } finally {
            await file.close();
        }
    } catch (error) {
        await fsp.unlink(filePath).catch(() => {});
        throw error;
    }
}

// One writer per Session. A compacted checkpoint replaces its predecessor;
// it must never be merged with a second actor's divergent model history.
class AILISSessionContextStore {
    constructor({ rootDir }) {
        this.rootDir = path.resolve(rootDir);
        this.sessionsDir = path.join(this.rootDir, 'sessions');
        this.checkpointWrites = new SerialWriteQueue();
    }

    sessionPath(sessionId) {
        const key = createHash('sha256').update(String(sessionId)).digest('hex');
        return path.join(this.sessionsDir, `${key}.json`);
    }

    readSession(sessionId) {
        try {
            return parseSession(fs.readFileSync(this.sessionPath(sessionId), 'utf8'), sessionId);
        } catch (error) {
            if (error.code !== 'ENOENT') throw error;
            return null;
        }
    }

    getCheckpoint(sessionId) {
        return clone(this.readSession(sessionId)?.checkpoint);
    }

    async readSessionAsync(sessionId) {
        try {
            return parseSession(await fsp.readFile(this.sessionPath(sessionId), 'utf8'), sessionId);
        } catch (error) {
            if (error.code !== 'ENOENT') throw error;
            return null;
        }
    }

    async getCheckpointAsync(sessionId) {
        return (await this.readSessionAsync(sessionId))?.checkpoint || null;
    }

    acquireSession(sessionId) {
        fs.mkdirSync(this.sessionsDir, { recursive: true });
        const lockPath = `${this.sessionPath(sessionId)}.lock`;
        const owner = { pid: process.pid, token: randomUUID() };
        const acquire = () => fs.writeFileSync(lockPath, JSON.stringify(owner), { flag: 'wx' });
        try {
            acquire();
        } catch (error) {
            if (error.code !== 'EEXIST') throw error;
            // Serialize stale-lock recovery so two gateways cannot remove one
            // another's newly acquired lock after probing the same dead owner.
            const recoveryPath = `${lockPath}.recovery`;
            fs.writeFileSync(recoveryPath, JSON.stringify(owner), { flag: 'wx' });
            try {
                const previous = JSON.parse(fs.readFileSync(lockPath, 'utf8'));
                if (!isDeadOwner(previous)) throw sessionBusy();
                // Remove only this proven-dead writer's exact lock, never a process.
                fs.unlinkSync(lockPath);
                acquire();
            } finally {
                fs.unlinkSync(recoveryPath);
            }
        }
        return () => {
            const current = JSON.parse(fs.readFileSync(lockPath, 'utf8'));
            if (current.token !== owner.token) throw new Error('AILIS Session ownership changed');
            fs.unlinkSync(lockPath);
        };
    }

    async acquireSessionAsync(sessionId) {
        await fsp.mkdir(this.sessionsDir, { recursive: true });
        const lockPath = `${this.sessionPath(sessionId)}.lock`;
        const owner = { pid: process.pid, token: randomUUID() };
        const body = JSON.stringify(owner);
        const acquire = () => createLockFile(lockPath, body);
        try {
            await acquire();
        } catch (error) {
            if (error.code !== 'EEXIST') throw error;
            const recoveryPath = `${lockPath}.recovery`;
            try {
                await createLockFile(recoveryPath, body);
            } catch (recovery) {
                if (recovery.code === 'EEXIST') throw sessionBusy();
                throw recovery;
            }
            try {
                let raw;
                try { raw = await fsp.readFile(lockPath, 'utf8'); } catch (read) {
                    if (read.code !== 'ENOENT') throw read;
                }
                if (raw !== undefined) {
                    let previous;
                    // A new owner may have created the file but not written its token yet.
                    try { previous = JSON.parse(raw); } catch { throw sessionBusy(); }
                    if (!isDeadOwner(previous)) throw sessionBusy();
                    await fsp.unlink(lockPath);
                }
                try { await acquire(); } catch (retry) {
                    if (retry.code === 'EEXIST') throw sessionBusy();
                    throw retry;
                }
            } finally {
                await fsp.unlink(recoveryPath);
            }
        }
        return async () => {
            const current = JSON.parse(await fsp.readFile(lockPath, 'utf8'));
            if (current.token !== owner.token) throw new Error('AILIS Session ownership changed');
            await fsp.unlink(lockPath);
        };
    }

    buildSession(sessionId, checkpoint, metadata, previous) {
        if (!checkpoint || !Array.isArray(checkpoint.items)) {
            throw new Error('Invalid AILIS unified Session checkpoint');
        }
        return {
            ...previous,
            ...metadata,
            version: 1,
            sessionId: String(sessionId),
            checkpoint: clone(checkpoint),
            updatedAt: new Date().toISOString()
        };
    }

    commitCheckpoint(sessionId, checkpoint, metadata = {}) {
        const next = this.buildSession(sessionId, checkpoint, metadata, this.readSession(sessionId));
        const statePath = this.sessionPath(sessionId);
        fs.mkdirSync(this.sessionsDir, { recursive: true });
        const temporaryPath = `${statePath}.${process.pid}.${randomUUID()}.tmp`;
        fs.writeFileSync(temporaryPath, `${JSON.stringify(next, null, 2)}\n`, 'utf8');
        fs.renameSync(temporaryPath, statePath);
        return this.getCheckpoint(sessionId);
    }

    commitCheckpointAsync(sessionId, checkpoint, metadata = {}) {
        return this.checkpointWrites.run(String(sessionId), async () => {
            const next = this.buildSession(sessionId, checkpoint, metadata, await this.readSessionAsync(sessionId));
            await atomicWriteText(this.sessionPath(sessionId), `${JSON.stringify(next, null, 2)}\n`);
            return next.checkpoint;
        });
    }

    getStatus() {
        const files = fs.existsSync(this.sessionsDir) ? fs.readdirSync(this.sessionsDir) : [];
        return { version: 1, rootDir: this.rootDir, sessionCount: files.filter((file) => file.endsWith('.json')).length };
    }
}

module.exports = { AILISSessionContextStore };
