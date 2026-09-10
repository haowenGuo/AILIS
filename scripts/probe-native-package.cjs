const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');
const assert=require('node:assert/strict');
const [packageDir,identityFile,reportFile]=process.argv.slice(2);
const identity=JSON.parse(fs.readFileSync(identityFile,'utf8'));
const resources=path.join(packageDir,process.platform==='darwin'?'Contents/Resources':'resources');
const app=path.join(resources,'app.asar');
const metadata=JSON.parse(fs.readFileSync(path.join(app,'package.json'),'utf8'));
assert.equal(metadata.version,identity.version);
assert.equal(metadata.ailisSourceCommit,identity.commit);
assert.equal(metadata.ailisBundledAsr,true);
assert.equal(process.platform,identity.platform);assert.equal(process.arch,identity.arch);
for(const row of identity.files)assert.equal(crypto.createHash('sha256').update(fs.readFileSync(path.join(app,row.file))).digest('hex'),row.sha256,row.file);
const runtime=path.join(resources,'ailis-asr-runtime');
const manifest=JSON.parse(fs.readFileSync(path.join(runtime,'manifest.json'),'utf8'));
assert.equal(manifest.platform,process.platform);assert.equal(manifest.arch,process.arch);
assert.equal(manifest.selfContained,true);assert.equal(manifest.device,'cpu');
const inventory=JSON.parse(fs.readFileSync(path.join(runtime,'files.sha256.json'),'utf8'));
for(const row of inventory.files) {
    const target=path.resolve(runtime,row.path);assert.ok(target.startsWith(runtime+path.sep),'Runtime inventory escape');
    assert.equal(fs.statSync(target).size,row.bytes,row.path);
    assert.equal(crypto.createHash('sha256').update(fs.readFileSync(target)).digest('hex'),row.sha256,row.path);
}
const report={success:true,platform:process.platform,arch:process.arch,version:metadata.version,sourceCommit:identity.commit,
    verifiedSourceFiles:identity.files.length,verifiedRuntimeFiles:inventory.files.length,runtimeBytes:inventory.totalBytes};
fs.writeFileSync(reportFile,JSON.stringify(report,null,2));console.log(JSON.stringify(report));
