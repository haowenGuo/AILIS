import fs from 'node:fs/promises';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';
import {
    DEFAULT_WHEELHOUSE_DIR,
    getSweBenchWheelhousePackages,
    listSweBenchSetupRecipes
} from './swebench-setup-recipes.mjs';

const execFileAsync = promisify(execFile);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

function parseArgs(argv = process.argv.slice(2)) {
    const args = {
        outputDir: DEFAULT_WHEELHOUSE_DIR,
        pythonVersion: '310',
        abi: 'cp310',
        platform: 'manylinux2014_x86_64',
        implementation: 'cp',
        repos: [],
        recipes: [],
        packages: []
    };
    for (let index = 0; index < argv.length; index += 1) {
        const arg = argv[index];
        if (arg === '--output-dir') args.outputDir = path.resolve(argv[++index] || args.outputDir);
        else if (arg === '--python-version') args.pythonVersion = argv[++index] || args.pythonVersion;
        else if (arg === '--abi') args.abi = argv[++index] || args.abi;
        else if (arg === '--platform') args.platform = argv[++index] || args.platform;
        else if (arg === '--implementation') args.implementation = argv[++index] || args.implementation;
        else if (arg === '--repo') args.repos.push(argv[++index] || '');
        else if (arg === '--recipe') args.recipes.push(argv[++index] || '');
        else if (arg === '--package') args.packages.push(argv[++index] || '');
        else if (arg === '--only') args.packages = String(argv[++index] || '').split(',').map((item) => item.trim()).filter(Boolean);
        else if (arg === '--list-recipes') args.listRecipes = true;
    }
    if (!args.packages.length) {
        args.packages = getSweBenchWheelhousePackages({
            repos: args.repos,
            recipeIds: args.recipes
        });
    }
    args.packages = args.packages.filter(Boolean);
    return args;
}

async function prepareSweBenchWheelhouse(options = {}) {
    const args = {
        ...parseArgs([]),
        ...options
    };
    await fs.mkdir(args.outputDir, { recursive: true });
    const commandArgs = [
        '-m',
        'pip',
        'download',
        '--dest',
        args.outputDir,
        '--platform',
        args.platform,
        '--python-version',
        args.pythonVersion,
        '--implementation',
        args.implementation,
        '--abi',
        args.abi,
        '--only-binary=:all:',
        ...args.packages
    ];
    const startedAt = Date.now();
    const result = await execFileAsync('python', commandArgs, {
        cwd: projectRoot,
        timeout: 20 * 60 * 1000,
        maxBuffer: 30 * 1024 * 1024,
        windowsHide: true
    });
    const files = await fs.readdir(args.outputDir);
    return {
        ok: true,
        outputDir: args.outputDir,
        durationMs: Date.now() - startedAt,
        packageCount: args.packages.length,
        fileCount: files.length,
        stdout: result.stdout,
        stderr: result.stderr
    };
}

if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
    const args = parseArgs();
    if (args.listRecipes) {
        console.log(JSON.stringify(listSweBenchSetupRecipes(), null, 2));
        process.exit(0);
    }
    const report = await prepareSweBenchWheelhouse(args);
    console.log(JSON.stringify({
        ok: report.ok,
        outputDir: report.outputDir,
        durationMs: report.durationMs,
        packageCount: report.packageCount,
        fileCount: report.fileCount
    }, null, 2));
}

export { prepareSweBenchWheelhouse };
