import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import {spawn} from 'node:child_process';
const output=path.resolve(process.argv[2]);
const root=await fs.mkdtemp(path.join(os.tmpdir(),'ailis-shell-probe-'));
const systemRoot=process.env.SystemRoot||'C:\\Windows';
const minimal={SystemRoot:systemRoot,WINDIR:systemRoot,ComSpec:path.join(systemRoot,'System32/cmd.exe'),
    PATH:[path.join(systemRoot,'System32'),systemRoot,path.join(systemRoot,'System32/WindowsPowerShell/v1.0')].join(';'),
    PATHEXT:'.COM;.EXE;.BAT;.CMD',HOME:root,USERPROFILE:root,TMP:root,TEMP:root,
    APPDATA:path.join(root,'AppData/Roaming'),LOCALAPPDATA:path.join(root,'AppData/Local')};
await fs.mkdir(minimal.APPDATA,{recursive:true});await fs.mkdir(minimal.LOCALAPPDATA,{recursive:true});
const report={platform:process.platform,arch:process.arch,probes:[]};
for(const [label,command,args,env] of [
    ['minimal-cmd',minimal.ComSpec,['/d','/s','/c','echo COLD_CMD_OK'],minimal],
    ['minimal-powershell',path.join(systemRoot,'System32/WindowsPowerShell/v1.0/powershell.exe'),['-NoLogo','-NoProfile','-NonInteractive','-Command',"Write-Output 'COLD_PS_OK'"],minimal],
    ['minimal-with-machine-identity',path.join(systemRoot,'System32/WindowsPowerShell/v1.0/powershell.exe'),['-NoLogo','-NoProfile','-NonInteractive','-Command',"Write-Output 'COLD_PS_OK'"],
        {...minimal,...Object.fromEntries(['SYSTEMDRIVE','USERNAME','USERDOMAIN','COMPUTERNAME','OS','PROCESSOR_ARCHITECTURE','NUMBER_OF_PROCESSORS'].filter(k=>process.env[k]).map(k=>[k,process.env[k]]))}]
]) {
    const started=Date.now();const child=spawn(command,args,{cwd:root,env,windowsHide:true,stdio:['ignore','pipe','pipe']});
    let stdout='',stderr='',timedOut=false;child.stdout.on('data',b=>stdout+=b);child.stderr.on('data',b=>stderr+=b);
    const timer=setTimeout(()=>{timedOut=true;child.kill()},45000);
    const exit=await new Promise(resolve=>{child.on('error',e=>resolve({error:e.message}));child.on('close',(code,signal)=>resolve({code,signal}))});clearTimeout(timer);
    report.probes.push({label,command,envKeys:Object.keys(env),durationMs:Date.now()-started,timedOut,stdout,stderr,...exit});
}
await fs.mkdir(path.dirname(output),{recursive:true});await fs.writeFile(output,JSON.stringify(report,null,2));console.log(JSON.stringify(report));
