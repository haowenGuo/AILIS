import crypto from 'crypto';
import fs from 'fs';
import fsp from 'fs/promises';
import path from 'path';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');
const PACKAGE_JSON = JSON.parse(await fsp.readFile(path.join(PROJECT_ROOT, 'package.json'), 'utf8'));
const VERSION = PACKAGE_JSON.version || '0.0.0';
const PROFILE_PATH = path.join(PROJECT_ROOT, 'installer', 'ailis-release-profiles.json');
const COMPONENT_MANIFEST_PATH = path.join(PROJECT_ROOT, 'installer', 'ailis-runtime-components.json');

function readOption(args, name, fallback = '') {
    const prefix = `--${name}=`;
    const inline = args.find((arg) => arg.startsWith(prefix));
    if (inline) {
        return inline.slice(prefix.length);
    }
    const index = args.indexOf(`--${name}`);
    if (index >= 0 && args[index + 1] && !args[index + 1].startsWith('--')) {
        return args[index + 1];
    }
    return fallback;
}

function parseList(value = '') {
    return String(value || '')
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);
}

function unique(items = []) {
    return [...new Set(items.filter(Boolean))];
}

async function readJson(targetPath) {
    return JSON.parse(await fsp.readFile(targetPath, 'utf8'));
}

async function pathExists(targetPath) {
    try {
        await fsp.access(targetPath);
        return true;
    } catch {
        return false;
    }
}

async function hashFile(targetPath) {
    const hash = crypto.createHash('sha256');
    await new Promise((resolve, reject) => {
        const stream = fs.createReadStream(targetPath);
        stream.on('data', (chunk) => hash.update(chunk));
        stream.on('error', reject);
        stream.on('end', resolve);
    });
    return hash.digest('hex');
}

async function collectArtifacts(outputDir) {
    if (!(await pathExists(outputDir))) {
        return [];
    }
    const artifacts = [];
    const stack = [outputDir];
    while (stack.length) {
        const current = stack.pop();
        const entries = await fsp.readdir(current, { withFileTypes: true });
        for (const entry of entries) {
            const child = path.join(current, entry.name);
            if (entry.isDirectory()) {
                if (entry.name === 'win-unpacked') {
                    continue;
                }
                stack.push(child);
                continue;
            }
            if (!entry.isFile()) {
                continue;
            }
            if (!/\.(exe|zip|AppImage|deb|tar\.gz|yml|json)$/i.test(entry.name)) {
                continue;
            }
            const stat = await fsp.stat(child);
            artifacts.push({
                file: path.relative(outputDir, child).replace(/\\/g, '/'),
                path: child,
                bytes: stat.size,
                sha256: await hashFile(child)
            });
        }
    }
    return artifacts.sort((a, b) => a.file.localeCompare(b.file));
}

function expandRuntimeComponents(componentIds, componentManifest) {
    const byId = new Map((componentManifest.components || []).map((component) => [component.id, component]));
    const expanded = new Set();
    const visit = (id) => {
        if (!id || expanded.has(id)) {
            return;
        }
        const component = byId.get(id);
        if (!component) {
            throw new Error(`Unknown runtime component in release profile: ${id}`);
        }
        for (const dependencyId of component.dependsOn || []) {
            visit(dependencyId);
        }
        expanded.add(id);
    };
    componentIds.forEach(visit);
    return [...expanded];
}

function resolveProfileNames(requestedProfile, profiles) {
    if (requestedProfile === 'all') {
        return ['core', 'runtime-packs', 'with-packs'];
    }
    if (!profiles[requestedProfile]) {
        throw new Error(`Unknown release profile: ${requestedProfile}`);
    }
    return [requestedProfile];
}

function commandToString(command) {
    return command.args.length
        ? `${command.cmd} ${command.args.join(' ')}`
        : command.cmd;
}

function run(command) {
    return new Promise((resolve, reject) => {
        const child = spawn(command.cmd, command.args, {
            cwd: command.cwd || PROJECT_ROOT,
            stdio: 'inherit',
            shell: process.platform === 'win32',
            windowsHide: true,
            env: {
                ...process.env,
                ...(command.env || {})
            }
        });
        child.on('error', reject);
        child.on('exit', (code) => {
            if (code === 0) {
                resolve();
                return;
            }
            reject(new Error(`${commandToString(command)} exited with ${code}`));
        });
    });
}

function buildPlanForProfile(profileName, profile, options, componentManifest, outputRoot) {
    const outputDir = path.resolve(outputRoot, profile.outputSubdir || profileName);
    const runtimePackSubdir = Object.prototype.hasOwnProperty.call(profile, 'runtimePackSubdir')
        ? String(profile.runtimePackSubdir || '')
        : 'runtime-packs';
    const runtimePackOutput = runtimePackSubdir
        ? path.join(outputDir, runtimePackSubdir)
        : outputDir;
    const componentOverride = options.components.length ? options.components : null;
    const runtimeComponents = expandRuntimeComponents(
        componentOverride || profile.runtimeComponents || [],
        componentManifest
    );
    const commands = [];
    if (profile.buildFrontend && !options.skipFrontend) {
        commands.push({
            label: 'Build frontend assets',
            cmd: 'pnpm',
            args: ['build']
        });
    }
    if (profile.buildRuntimePacks && !options.skipRuntimePacks && runtimeComponents.length) {
        commands.push({
            label: 'Build selected runtime packs',
            cmd: 'node',
            args: [
                'scripts/build-ailis-runtime-packs.mjs',
                '--output',
                runtimePackOutput,
                '--components',
                runtimeComponents.join(',')
            ]
        });
    }
    if (profile.buildDesktop && !options.skipDesktop) {
        commands.push({
            label: 'Build desktop installer',
            cmd: 'pnpm',
            args: [
                'exec',
                'electron-builder',
                '--config',
                profile.builderConfig || 'electron-builder.yml',
                ...(profile.builderTargets || []),
                `--config.directories.output=${outputDir}`
            ]
        });
    }
    return {
        profileName,
        title: profile.title || profileName,
        description: profile.description || '',
        outputDir,
        runtimePackOutput,
        runtimeComponents,
        commands
    };
}

async function writeReleaseManifest(plan, dryRun) {
    if (dryRun) {
        return null;
    }
    await fsp.mkdir(plan.outputDir, { recursive: true });
    const artifacts = await collectArtifacts(plan.outputDir);
    const manifest = {
        schemaVersion: 1,
        product: 'AILIS',
        version: VERSION,
        profile: plan.profileName,
        title: plan.title,
        generatedAt: new Date().toISOString(),
        outputDir: plan.outputDir,
        runtimeComponents: plan.runtimeComponents,
        commands: plan.commands.map(commandToString),
        artifacts
    };
    const manifestPath = path.join(plan.outputDir, `AILIS-Release-${plan.profileName}-${VERSION}.json`);
    await fsp.writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
    return manifestPath;
}

async function main() {
    const args = process.argv.slice(2);
    const options = {
        profile: readOption(args, 'profile', 'core'),
        outputRoot: readOption(args, 'output-root', ''),
        components: parseList(readOption(args, 'components', '')),
        dryRun: args.includes('--dry-run'),
        json: args.includes('--json'),
        skipFrontend: args.includes('--skip-frontend') || args.includes('--skip-build'),
        skipDesktop: args.includes('--skip-desktop'),
        skipRuntimePacks: args.includes('--skip-runtime-packs')
    };
    const profileConfig = await readJson(PROFILE_PATH);
    const componentManifest = await readJson(COMPONENT_MANIFEST_PATH);
    const outputRoot = path.resolve(options.outputRoot || profileConfig.outputRoot || 'release');
    const profileNames = resolveProfileNames(options.profile, profileConfig.profiles || {});
    const plans = profileNames.map((profileName) =>
        buildPlanForProfile(
            profileName,
            profileConfig.profiles[profileName],
            options,
            componentManifest,
            outputRoot
        )
    );

    const summary = {
        product: 'AILIS',
        version: VERSION,
        dryRun: options.dryRun,
        outputRoot,
        profiles: plans.map((plan) => ({
            profileName: plan.profileName,
            title: plan.title,
            outputDir: plan.outputDir,
            runtimeComponents: plan.runtimeComponents,
            commands: plan.commands.map(commandToString)
        }))
    };

    if (options.json) {
        console.log(JSON.stringify(summary, null, 2));
    } else {
        console.log(`[AILIS Release] version ${VERSION}`);
        for (const plan of plans) {
            console.log(`\n[AILIS Release] profile=${plan.profileName}`);
            console.log(`  output: ${plan.outputDir}`);
            console.log(`  runtime components: ${plan.runtimeComponents.join(', ') || '(none)'}`);
            if (!plan.commands.length) {
                console.log('  commands: (none)');
            }
            for (const command of plan.commands) {
                console.log(`  - ${command.label}: ${commandToString(command)}`);
            }
        }
    }

    if (options.dryRun) {
        return;
    }

    for (const plan of plans) {
        await fsp.mkdir(plan.outputDir, { recursive: true });
        for (const command of plan.commands) {
            console.log(`\n[AILIS Release] ${command.label}`);
            await run(command);
        }
        const manifestPath = await writeReleaseManifest(plan, false);
        console.log(`[AILIS Release] manifest: ${manifestPath}`);
    }
}

await main();
