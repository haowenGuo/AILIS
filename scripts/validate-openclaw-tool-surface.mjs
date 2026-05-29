import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const {
    getOpenClawToolSurfaceSummary,
    validateOpenClawToolSurface
} = require('../electron/openclaw-tool-surface.cjs');

const summary = getOpenClawToolSurfaceSummary();
const validation = validateOpenClawToolSurface();

console.log('[openclaw-tools] summary');
console.log(
    JSON.stringify(
        {
            ...summary,
            validation: validation.summary
        },
        null,
        2
    )
);

if (!validation.ok) {
    console.error('[openclaw-tools] validation failed');
    for (const issue of validation.issues) {
        console.error(`- ${issue}`);
    }
    process.exitCode = 1;
} else {
    console.log('[openclaw-tools] validation passed');
}
