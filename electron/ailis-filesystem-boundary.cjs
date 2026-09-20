'use strict';
const fs = require('node:fs');
const path = require('node:path');

// Resolve the existing ancestor as well as the not-yet-created tail. This
// catches directory symlinks/junctions without requiring the target to exist.
function realPathWithMissingTail(target) {
    const tail = [];
    let current = path.resolve(target);
    for (;;) {
        try {
            return path.join(fs.realpathSync.native(current), ...tail.reverse());
        } catch (error) {
            if (error.code !== 'ENOENT') throw error;
            // A dangling link is not an ordinary missing path.
            try { if (fs.lstatSync(current).isSymbolicLink()) throw new Error(`Dangling path link: ${current}`); }
            catch (statError) { if (statError.code !== 'ENOENT') throw statError; }
            const parent = path.dirname(current);
            if (parent === current) throw error;
            tail.push(path.basename(current)); current = parent;
        }
    }
}

function assertRealPathInside(workspace, target) {
    const root = realPathWithMissingTail(workspace);
    const resolved = realPathWithMissingTail(target);
    const relative = path.relative(root, resolved);
    if (relative === '..' || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative)) {
        const error = new Error('path must stay inside workspace after resolving filesystem links');
        error.code = 'path_outside_workspace';
        error.details = { workspace, target, resolved };
        throw error;
    }
    return resolved;
}

async function initializeOwnedWorkspace(workspace) {
    try {
        await fs.promises.mkdir(workspace, { recursive: true });
        if (!(await fs.promises.stat(workspace)).isDirectory()) throw new Error('path is not a directory');
        await fs.promises.access(workspace, fs.constants.R_OK | fs.constants.W_OK);
    } catch (cause) {
        const error = new Error(`Cannot initialize AILIS workspace ${workspace}: ${cause.message}`);
        error.code = 'workspace_initialization_failed';
        error.cause = cause;
        throw error;
    }
}
module.exports = { assertRealPathInside, realPathWithMissingTail, initializeOwnedWorkspace };
