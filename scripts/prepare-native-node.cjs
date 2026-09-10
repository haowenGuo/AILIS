// Native build-time packaging repair. Never downloads tools or mutates a user's
// installation at runtime. node-pty 1.1.0 publishes macOS spawn-helper as 0644.
const fs=require('node:fs');
const path=require('node:path');
if(process.platform==='darwin') {
    const root=path.dirname(require.resolve('node-pty/package.json'));
    const native=require(path.join(root,'lib/utils.js')).loadNativeModule('pty');
    const helper=path.resolve(root,'lib',native.dir,'spawn-helper');
    const real=fs.realpathSync.native(helper);
    if(!real.startsWith(fs.realpathSync.native(root)+path.sep))throw Error('node-pty helper outside dependency root');
    const before=fs.statSync(real).mode & 0o777;
    fs.chmodSync(real,before|0o111);
    fs.accessSync(real,fs.constants.X_OK);
    console.log(JSON.stringify({nativePtyHelper:real,before:before.toString(8),after:(fs.statSync(real).mode&0o777).toString(8)}));
} else console.log('Native node-pty helper permissions require no repair on this platform.');
