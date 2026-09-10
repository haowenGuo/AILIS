const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const cp = require('node:child_process');
const assert = require('node:assert/strict');

function recognitionQuality(expected, actual, keywords) {
    const normalize = text => Array.from(text.normalize('NFKC').replace(/[\p{P}\p{Z}\s]/gu, ''));
    const reference = normalize(expected), hypothesis = normalize(actual);
    let row = Array.from({ length: hypothesis.length + 1 }, (_, i) => i);
    for (let i = 0; i < reference.length; i++) {
        const next = [i + 1];
        for (let j = 0; j < hypothesis.length; j++) next.push(Math.min(next[j] + 1, row[j + 1] + 1,
            row[j] + (reference[i] === hypothesis[j] ? 0 : 1)));
        row = next;
    }
    const characterErrors = row.at(-1);
    return { exactText: expected === actual, normalizedExact: characterErrors === 0,
        referenceCharacters: reference.length, characterErrors,
        characterErrorRate: characterErrors / Math.max(1, reference.length),
        missingKeywords: keywords.filter(word => !actual.includes(word)) };
}

// Invoked using the actual package's Electron-as-Node executable. This is a
// cold-profile/payload test, not a replacement for native clean-OS installation.
async function main() {
    const [packageDir, fixtureDir, reportPath] = process.argv.slice(2).map(p => path.resolve(p));
    if (!packageDir || !fixtureDir || !reportPath) throw new Error('Usage: <package-dir> <fixtures-dir> <report.json>');
    const executable = path.join(packageDir, process.platform === 'darwin' ? 'Contents/MacOS/AILIS' : process.platform === 'win32' ? 'AILIS.exe' : 'ailis');
    assert.equal(path.resolve(process.execPath).toLowerCase(), executable.toLowerCase());
    const resources = path.join(packageDir, process.platform === 'darwin' ? 'Contents/Resources' : 'resources');
    fs.mkdirSync(path.dirname(reportPath), { recursive:true });
    const profile = fs.mkdtempSync(path.join(path.dirname(reportPath), 'cold-profile-'));
    const systemRoot = process.env.SystemRoot || 'C:\\Windows';
    const clean = { SystemRoot: systemRoot, WINDIR: systemRoot, ComSpec: path.join(systemRoot, 'System32/cmd.exe'),
        PATH: `${systemRoot}\\System32;${systemRoot};${systemRoot}\\System32\\WindowsPowerShell\\v1.0`,
        PATHEXT: '.COM;.EXE;.BAT;.CMD', HOME: profile, USERPROFILE: profile, TEMP: profile, TMP: profile,
        APPDATA: path.join(profile,'Roaming'), LOCALAPPDATA: path.join(profile,'Local'),
        // Deliberately poisoned locations must be overridden by the runtime.
        PYTHONHOME: path.join(profile,'missing-python'), PYTHONPATH: path.join(profile,'missing-packages'),
        HF_HOME: path.join(profile,'empty-models'), HF_HUB_CACHE: path.join(profile,'empty-models'),
        AILIS_ASR_LOCAL_ONLY: '1', AILIS_ASR_LANGUAGE: 'zh', ELECTRON_RUN_AS_NODE: '1' };
    if (process.platform !== 'win32') {
        for (const name of ['SystemRoot','WINDIR','ComSpec','PATHEXT']) delete clean[name];
        Object.assign(clean, { PATH:'/usr/bin:/bin:/usr/sbin:/sbin', TMPDIR:profile, LANG:'en_US.UTF-8',
            XDG_CONFIG_HOME:path.join(profile,'config'), XDG_CACHE_HOME:path.join(profile,'cache'),
            APPDATA:path.join(profile,process.platform === 'darwin' ? 'Library/Application Support' : '.config') });
    }
    for (const key of Object.keys(process.env)) delete process.env[key];
    Object.assign(process.env, clean);
    for (const dir of [clean.APPDATA,clean.LOCALAPPDATA,clean.HF_HOME]) fs.mkdirSync(dir,{recursive:true});
    Object.defineProperty(process, 'resourcesPath', { value: resources, configurable: true });
    const spawns = []; let networkAttempts = 0; let pythonEvidence = null;
    const originalSpawn = cp.spawn;
    const instrument = [
        'import sys,runpy,json,atexit',
        'def guard(event,args):',
        ' if event in ("socket.connect","socket.getaddrinfo","socket.sendto"):',
        '  print("AILIS_NETWORK_DENIED:"+event,file=sys.stderr,flush=True)',
        '  raise RuntimeError("Network disabled by offline acceptance harness")',
        'sys.addaudithook(guard)',
        // WAV recognition does not import torchaudio itself; probe this shipped
        // dependency explicitly as part of installation readiness acceptance.
        'import torchaudio',
        'def evidence():',
        ' modules={k:getattr(sys.modules.get(k),"__file__",None) for k in ("torch","torchaudio","transformers","numpy","accelerate")}',
        ' print("AILIS_PYTHON_EVIDENCE:"+json.dumps({"executable":sys.executable,"prefix":sys.prefix,"path":sys.path,"modules":modules}),file=sys.stderr,flush=True)',
        'atexit.register(evidence)',
        'runpy.run_path(sys.argv[1],run_name="__main__")'
    ].join('\n');
    cp.spawn = function(command,args,options) {
        if (args?.at(-1)?.endsWith('desktop_asr_worker.py')) {
            spawns.push({ command, worker: args.at(-1), cwd: options.cwd,
                pythonPath: options.env.PYTHONPATH, hfHome: options.env.HF_HOME });
            args = ['-u','-c',instrument,args.at(-1)];
        }
        const child = originalSpawn(command,args,options);
        let stderr = '';
        child.stderr?.on('data',data => {
            stderr += data;
            for (const line of stderr.split(/\r?\n/).slice(0,-1)) {
                if (line.startsWith('AILIS_NETWORK_DENIED:')) networkAttempts++;
                if (line.startsWith('AILIS_PYTHON_EVIDENCE:')) pythonEvidence = JSON.parse(line.slice('AILIS_PYTHON_EVIDENCE:'.length));
            }
            stderr = stderr.split(/\r?\n/).at(-1);
        });
        return child;
    };
    const { DesktopASRManager } = require(path.join(resources,'app.asar/electron/local-asr-manager.cjs'));
    const { VoiceRuntimeBootstrap } = require(path.join(resources,'app.asar/electron/voice-runtime-bootstrap.cjs'));
    const userData=path.join(clean.APPDATA,'AILIS');
    // Match main.cjs wiring, including its empty-profile runtime-path provider.
    const voiceRuntime=new VoiceRuntimeBootstrap({projectRoot:path.join(resources,'app.asar'),
        userDataPath:userData,appDataPath:clean.APPDATA,runtimeRoot:path.join(userData,'local-runtimes'),platform:process.platform});
    const manager = new DesktopASRManager({ app: { isPackaged:true,
        getPath: name => name === 'appData' ? clean.APPDATA : userData },getRuntimePaths:()=>voiceRuntime.getPaths() });
    const report = { platform: process.platform, arch:process.arch, packageDir, executable:process.execPath,
        freshProfile:true, systemOnlyPath:clean.PATH, poisonedDeveloperPaths:true, nativeCleanOS:false,
        pythonNetworkGuard:true, fixtures:[], success:false, acceptanceScope:'runtime readiness; accuracy reported separately' };
    let child;
    try {
        const start=Date.now();
        report.warmup = await manager.warmup();
        report.warmupMs=Date.now()-start;
        child=manager.child;
        assert.equal(report.warmup.model_id,'openai/whisper-small');
        assert.equal(manager.pythonCommand.source,'packaged-asr-runtime');
        assert.ok(manager.pythonCommand.command.toLowerCase().startsWith(path.join(resources,'ailis-asr-runtime').toLowerCase()+path.sep));
        report.python=manager.pythonCommand.command;
        const fixtures=JSON.parse(fs.readFileSync(path.join(fixtureDir,'fixtures.json'),'utf8').replace(/^\uFEFF/,''));
        for(const item of fixtures.cases) {
            const result=await manager.transcribeAudioBytes({audioBytes:fs.readFileSync(path.join(fixtureDir,item.file)),preset:'fast'});
            report.fixtures.push({file:item.file,expected:item.text,...result,
                quality:recognitionQuality(item.text, result.text || '', item.contains)});
            assert.ok(result.text?.trim(), 'Real speech fixture produced no text');
            assert.equal(result.model_id, 'openai/whisper-small');
        }
        const silence=Buffer.alloc(44+32000); silence.write('RIFF');silence.writeUInt32LE(silence.length-8,4);silence.write('WAVEfmt ',8);
        silence.writeUInt32LE(16,16);silence.writeUInt16LE(1,20);silence.writeUInt16LE(1,22);silence.writeUInt32LE(16000,24);
        silence.writeUInt32LE(32000,28);silence.writeUInt16LE(2,32);silence.writeUInt16LE(16,34);silence.write('data',36);silence.writeUInt32LE(32000,40);
        report.silence=await manager.transcribeAudioBytes({audioBytes:silence,preset:'fast'});
        assert.equal(report.silence.text,'');
        // Graceful EOF lets the evidence hook report actual imported module paths.
        await new Promise((resolve,reject)=>{ const timer=setTimeout(()=>reject(new Error('Worker did not exit after EOF')),10000);
            child.once('close',()=>{clearTimeout(timer);resolve()});child.stdin.end(); });
        assert.equal(networkAttempts,0);
        assert.ok(pythonEvidence,'Missing actual Python module evidence');
        for(const [name,file] of Object.entries(pythonEvidence.modules)) assert.ok(file?.toLowerCase().startsWith(resources.toLowerCase()+path.sep),`${name} loaded outside package`);
        report.quality = { allNormalizedExact:report.fixtures.every(f=>f.quality.normalizedExact),
            characterErrors:report.fixtures.reduce((n,f)=>n+f.quality.characterErrors,0),
            referenceCharacters:report.fixtures.reduce((n,f)=>n+f.quality.referenceCharacters,0) };
        report.success=true;
    } catch(error) { report.error=error.stack; process.exitCode=1; }
    finally {
        manager.close();cp.spawn=originalSpawn;
        Object.assign(report,{networkAttempts,pythonEvidence,spawns});
        fs.writeFileSync(reportPath,JSON.stringify(report,null,2));
        console.log(JSON.stringify({success:report.success,reportPath,warmupMs:report.warmupMs,fixtures:report.fixtures,error:report.error}));
    }
}
main().catch(error=>{console.error(error);process.exitCode=1});
