import fs from 'node:fs/promises';
import {createReadStream} from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import crypto from 'node:crypto';
import {spawn,execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const release=path.join(root,'release');
const key=`${process.platform}-${process.arch}`;
const version=JSON.parse(await fs.readFile(path.join(root,'package.json'),'utf8')).version;
const git=(...args)=>execFileSync('git',args,{cwd:root,encoding:'utf8'}).trim();
async function run(command,args,env={}) {
    const child=spawn(command,args,{cwd:root,env:{...process.env,...env},stdio:'inherit',windowsHide:true});
    await new Promise((resolve,reject)=>{child.on('error',reject);child.on('close',code=>code===0?resolve():reject(Error(`${path.basename(command)} exited ${code}`)))});
}
async function sha(file) { const h=crypto.createHash('sha256');for await(const b of createReadStream(file))h.update(b);return h.digest('hex'); }
const pnpm=(...args)=>run(process.platform==='win32'?'cmd.exe':'pnpm',process.platform==='win32'?['/d','/s','/c','pnpm',...args]:args);
async function build() {
    if(!['win32-x64','linux-x64','darwin-x64','darwin-arm64'].includes(key))throw Error(`Unsupported target ${key}`);
    if(git('status','--porcelain','--untracked-files=no'))throw Error('Release source must be a clean commit');
    if(process.env.GITHUB_SHA && git('rev-parse','HEAD')!==process.env.GITHUB_SHA)throw Error('CI/source identity mismatch');
    const identity={version,commit:git('rev-parse','HEAD'),platform:process.platform,arch:process.arch,files:[]};
    const required=['electron/main.cjs','electron/ailis-gateway.cjs','electron/ailis-agent-runner.cjs',
        'electron/ailis-code-mode-runtime.cjs','electron/ailis-code-mode-worker.cjs','electron/codex-code-mode-protocol.cjs',
        'electron/ailis-platform-adapter.cjs','electron/ailis-local-patch.cjs','electron/local-asr-manager.cjs',
        'electron/voice-runtime-bootstrap.cjs','electron/desktop_asr_worker.py'];
    for(const file of required)identity.files.push({file,sha256:await sha(path.join(root,file))});
    await fs.mkdir(release,{recursive:true});
    await fs.writeFile(path.join(release,`source-identity-${key}.json`),JSON.stringify(identity,null,2));
    await pnpm('build:desktop');
    const flag=process.platform==='win32'?'--win':process.platform==='darwin'?'--mac':'--linux';
    await pnpm('exec','electron-builder','--config','electron-builder.yml',flag,`--${process.arch}`,'--publish','never',
        `-c.extraMetadata.ailisSourceCommit=${identity.commit}`);
    const files=[];
    for(const item of await fs.readdir(release,{withFileTypes:true})) {
        if(!item.isFile() || !/\.(exe|dmg|zip|AppImage|deb|tar\.gz|blockmap|yml)$/.test(item.name) || item.name==='builder-debug.yml')continue;
        const file=path.join(release,item.name);files.push({file:item.name,bytes:(await fs.stat(file)).size,sha256:await sha(file)});
    }
    if(!files.length)throw Error('No native release artifacts');
    const checksums=files.map(f=>`${f.sha256}  ${f.file}\n`).join('');
    await fs.writeFile(path.join(release,`SHA256SUMS-${key}.txt`),checksums);
    if(process.platform==='win32')await fs.writeFile(path.join(release,'SHA256SUMS.txt'),checksums);
    await fs.writeFile(path.join(release,`AILIS-Release-${version}-${key}.json`),JSON.stringify({
        ...identity,buildOS:os.release(),builtAt:new Date().toISOString(),artifacts:files,
        signing:process.platform==='darwin'?'ad-hoc; not Developer ID signed or notarized':'not publisher signed',
        included:['application','private Python 3.12.10','CPU inference dependencies','complete Whisper Small model'],
        excluded:['CUDA','CosyVoice','local TTS model','user configuration','API keys']},null,2));
}
async function verify() {
    const scratch=await fs.mkdtemp(path.join(os.tmpdir(),'ailis-release-'));
    const relocated=path.join(scratch,'安装验收 with spaces');await fs.mkdir(relocated);
    const reportDir=path.join(release,'evidence',key);await fs.mkdir(reportDir,{recursive:true});
    let packageDir;
    if(process.platform==='darwin') {
        const archive=path.join(release,`AILIS-${version}-mac-${process.arch}.zip`);
        await run('ditto',['-x','-k',archive,relocated]);packageDir=path.join(relocated,'AILIS.app');
        await run('codesign',['--verify','--verbose=2',packageDir]);
    } else if(process.platform==='linux') {
        await run('tar',['-xzf',path.join(release,`AILIS-${version}-linux-${process.arch}.tar.gz`),'-C',relocated]);
        const entries=await fs.readdir(relocated,{withFileTypes:true});
        packageDir=entries.some(e=>e.name==='ailis')?relocated:path.join(relocated,entries.find(e=>e.isDirectory()).name);
    } else packageDir=path.join(release,'win-unpacked');
    const resources=path.join(packageDir,process.platform==='darwin'?'Contents/Resources':'resources');
    const executable=path.join(packageDir,process.platform==='darwin'?'Contents/MacOS/AILIS':process.platform==='win32'?'AILIS.exe':'ailis');
    const env={ELECTRON_RUN_AS_NODE:'1'};
    await run(executable,[path.join(root,'scripts/probe-native-package.cjs'),packageDir,path.join(release,`source-identity-${key}.json`),path.join(reportDir,'package-identity.json')],env);
    await run(executable,[path.join(root,'scripts/test-clean-runtime.mjs'),'--module-root',path.join(resources,'app.asar/electron'),
        '--output',path.join(reportDir,'packaged-cold-runtime.json'),'tests/ailis-clean-environment.test.mjs'],env);
    await run(executable,[path.join(root,'scripts/verify-bundled-asr.cjs'),packageDir,path.join(root,'tests/fixtures/asr-install'),path.join(reportDir,'offline-asr.json')],env);
    await fs.writeFile(path.join(reportDir,'acceptance-scope.json'),JSON.stringify({success:true,platform:process.platform,arch:process.arch,
        realNativeOS:true,hostedRunnerHasBuildTools:true,testsUseSystemOnlyPathAndFreshProfile:true,
        relocatedArchive:process.platform!=='win32',windowsNSISInstallVerifiedSeparately:process.platform==='win32',
        realMicrophone:false,realProviderRequests:false,guiAccessibility:false,developerIDNotarization:false,
        scope:'Packaged source identity, shell/PTY, EXEC, apply_patch, workspace errors, offline CPU ASR; not all hardware or GUI permissions.'},null,2));
    // This unique owned scratch is retained until the ephemeral CI VM is disposed.
}
if(process.argv.includes('--verify'))await verify();else await build();
