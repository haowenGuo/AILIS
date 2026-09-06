const fs = require('fs');
const path = require('path');
const { createHash, randomUUID } = require('crypto');

const clone = (value) => value == null ? null : JSON.parse(JSON.stringify(value));

// One writer per Session. A compacted checkpoint replaces its predecessor;
// it must never be merged with a second actor's divergent model history.
class AILISSessionContextStore {
    constructor({ rootDir }) {
        this.rootDir = path.resolve(rootDir);
        this.sessionsDir = path.join(this.rootDir, 'sessions');
    }

    sessionPath(sessionId) {
        const key = createHash('sha256').update(String(sessionId)).digest('hex');
        return path.join(this.sessionsDir, `${key}.json`);
    }

    readSession(sessionId) {
        try {
            const state = JSON.parse(fs.readFileSync(this.sessionPath(sessionId), 'utf8'));
            if (state.sessionId !== String(sessionId) || !Array.isArray(state.checkpoint?.items)) {
                throw new Error('Invalid AILIS unified Session context store');
            }
            return state;
        } catch (error) {
            if (error.code !== 'ENOENT') throw error;
            return null;
        }
    }

    getCheckpoint(sessionId) {
        return clone(this.readSession(sessionId)?.checkpoint);
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
                let dead = false;
                if (Number.isInteger(previous.pid) && previous.pid > 0) {
                    try { process.kill(previous.pid, 0); } catch (probe) { dead = probe.code === 'ESRCH'; }
                }
                if (!dead) {
                    const busy = new Error('This AILIS Session is already active in another gateway. Wait for that turn to finish.');
                    busy.code = 'AILIS_SESSION_BUSY';
                    throw busy;
                }
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

    commitCheckpoint(sessionId, checkpoint, metadata = {}) {
        if (!checkpoint || !Array.isArray(checkpoint.items)) {
            throw new Error('Invalid AILIS unified Session checkpoint');
        }
        const next = {
            ...this.readSession(sessionId),
            ...metadata,
            version: 1,
            sessionId: String(sessionId),
            checkpoint: clone(checkpoint),
            updatedAt: new Date().toISOString()
        };
        const statePath = this.sessionPath(sessionId);
        fs.mkdirSync(this.sessionsDir, { recursive: true });
        const temporaryPath = `${statePath}.${process.pid}.${randomUUID()}.tmp`;
        fs.writeFileSync(temporaryPath, `${JSON.stringify(next, null, 2)}\n`, 'utf8');
        fs.renameSync(temporaryPath, statePath);
        return this.getCheckpoint(sessionId);
    }

    getStatus() {
        const files = fs.existsSync(this.sessionsDir) ? fs.readdirSync(this.sessionsDir) : [];
        return { version: 1, rootDir: this.rootDir, sessionCount: files.filter((file) => file.endsWith('.json')).length };
    }
}

module.exports = { AILISSessionContextStore };
