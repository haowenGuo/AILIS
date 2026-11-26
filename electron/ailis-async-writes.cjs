const fs = require('node:fs/promises');
const path = require('node:path');
const { randomUUID } = require('node:crypto');

class SerialWriteQueue {
    constructor() {
        this.pending = new Map();
    }

    run(key, operation) {
        const next = (this.pending.get(key) || Promise.resolve()).catch(() => {}).then(operation);
        const tail = next.finally(() => {
            if (this.pending.get(key) === tail) this.pending.delete(key);
        });
        this.pending.set(key, tail);
        return tail;
    }
}

async function atomicWriteText(filePath, content) {
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    const temporaryPath = `${filePath}.${process.pid}.${randomUUID()}.tmp`;
    try {
        await fs.writeFile(temporaryPath, content, 'utf8');
        await fs.rename(temporaryPath, filePath);
    } catch (error) {
        await fs.unlink(temporaryPath).catch(() => {});
        throw error;
    }
}

function requireSaved(result, description) {
    if (result?.ok === false && result.status !== 'empty_turn') {
        throw new Error(`${description}: ${result.error || result.status || 'write failed'}`);
    }
    return result;
}

module.exports = { SerialWriteQueue, atomicWriteText, requireSaved };
