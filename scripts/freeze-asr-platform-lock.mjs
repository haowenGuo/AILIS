import fs from 'node:fs/promises';
import path from 'node:path';
import {spawn} from 'node:child_process';
const key=process.argv[2];
const specs=JSON.parse(await fs.readFile('installer/asr-platforms.json','utf8'));
const spec=specs[key];if(!spec?.wheels)throw Error('Specify a supported non-Windows target');
const build=path.resolve('build-cache/asr-locks');await fs.mkdir(build,{recursive:true});
const input=path.join(build,key+'.in');
const content=[...spec.wheels.map(w=>`${w.file.split('-')[0]} @ ${w.url}#sha256=${w.sha256}`),
 'transformers==4.53.3','accelerate==1.10.1',`numpy==${spec.numpy}`,'soundfile==0.13.1','librosa==0.11.0'].join('\n')+'\n';
await fs.writeFile(input,content);
const lock=path.join('installer',spec.lock);await fs.mkdir(path.dirname(lock),{recursive:true});
const child=spawn('uv',['pip','compile',input,'--python-version','3.12','--python-platform',spec.uvPlatform,
 '--generate-hashes','--no-header','--output-file',lock,'--default-index','https://pypi.org/simple'],
 {env:{...process.env,UV_NO_CONFIG:'1',UV_HTTP_TIMEOUT:'180',UV_CACHE_DIR:path.join(build,'uv-cache')},windowsHide:true,stdio:['ignore','ignore','pipe']});
let log='';child.stderr.on('data',b=>{log+=b});
const code=await new Promise((resolve,reject)=>{child.on('error',reject);child.on('close',resolve)});
await fs.writeFile(path.join(build,key+'.log'),log);
if(code!==0)throw Error(log.slice(-3500));
console.log(JSON.stringify({target:key,lock,success:true}));
