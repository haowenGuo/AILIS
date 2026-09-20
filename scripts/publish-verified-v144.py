"""One-shot authorized publication of an already accepted, immutable CI build.

No rebuilding or main-branch changes. Fail closed before any release mutation.
"""
import hashlib
import json
import os
from pathlib import Path
import subprocess
import tarfile

REPO = 'haowenGuo/AILIS'
RUN = 34671515862
COMMIT = '5fefaaf7cf6dada56a32420df018b2769beb8cb0'
OLD_TAG = '398cf7de0e9190603bc7c25b8161e17b672a39c8'
RELEASE = 384522096
TARGETS = ['win32-x64', 'linux-x64', 'darwin-x64', 'darwin-arm64']
ARTIFACTS = dict(zip(TARGETS, [10291132013, 10290784027, 10291016944, 10291710026]))
OLD_IDS = {550066106, 550066105, 550066113, 550066114, 550066111, 550066154, 550066200, 550066211}

def gh(*args, data=None):
    return subprocess.check_output(['gh', *args], input=None if data is None else json.dumps(data).encode())

def api(endpoint, method='GET', data=None):
    args = ['api', f'repos/{REPO}/{endpoint}', '--method', method]
    if data is not None: args += ['--input', '-']
    value = gh(*args, data=data)
    return json.loads(value) if value.strip() else None

def read(file): return json.loads(Path(file).read_text())
def digest(file, algorithm='sha256'):
    h = hashlib.new(algorithm)
    with open(file, 'rb') as stream:
        for chunk in iter(lambda: stream.read(8*1024*1024), b''): h.update(chunk)
    return h.hexdigest()

audit = Path('publication-audit'); audit.mkdir(exist_ok=True)
stage = Path('publication-stage'); stage.mkdir(exist_ok=True)
run = api(f'actions/runs/{RUN}')
assert run['conclusion'] == 'success' and run['head_sha'] == COMMIT
jobs = api(f'actions/runs/{RUN}/jobs?per_page=100')['jobs']
for target in TARGETS:
    matching = [j for j in jobs if j['name'] == f'Native package and offline acceptance - {target}']
    assert len(matching) == 1 and matching[0]['conclusion'] == 'success'
backup = api('actions/artifacts/10290372128')
assert not backup['expired'] and backup['size_in_bytes'] == 532746238
assert backup['digest'] == 'sha256:2f603ddc0644e09706e062bd193f9abb90140a6c72c6c7b667e4d95a0f82515c'
assert api('git/ref/tags/archive/v1.4.4-withdrawn-20260912')['object']['sha'] == OLD_TAG
old = api(f'releases/{RELEASE}')
assert old['draft'] and old['tag_name'] == 'v1.4.4'
assert not old['assets'], 'Resume only the exact empty draft left by run 34693603221'
assert api('git/ref/tags/v1.4.4')['object']['sha'] == COMMIT
(audit/'old-release.json').write_text(json.dumps(old, indent=2))
before_main = api('git/ref/heads/main')['object']['sha']
before_v145 = api('git/ref/tags/v1.4.5')['object']['sha']

summaries = []
for target in TARGETS:
    artifact = api(f'actions/artifacts/{ARTIFACTS[target]}')
    name = f'ailis-v1.4.4-{target}-{COMMIT}'
    assert artifact['name'] == name and not artifact['expired']
    directory = Path('publication-downloads')/target
    subprocess.run(['gh','run','download',str(RUN),'--repo',REPO,'--name',name,'--dir',str(directory)],check=True)
    manifest = read(directory/f'AILIS-Release-1.4.4-{target}.json')
    assert manifest['commit'] == COMMIT and manifest['version'] == '1.4.4'
    evidence = directory/'evidence'/target
    identity = read(evidence/'package-identity.json')
    assert identity['success'] and identity['sourceCommit'] == COMMIT and identity['verifiedSourceFiles'] == 11
    cold = read(evidence/'packaged-cold-runtime.json')
    assert cold['code'] == 0 and cold['pass'] == 22 and cold['fail'] == cold['cancelled'] == 0
    asr = read(evidence/'offline-asr.json')
    assert asr['success'] and len(asr['fixtures']) == 2
    if target == 'win32-x64':
        installed = read(evidence/'nsis/clean-install-report.json')
        assert installed['success'] and all(c['ok'] for c in installed['checks'])
        assert read(evidence/'nsis/installed-source-identity.json')['sourceCommit'] == COMMIT
    for item in manifest['artifacts']:
        filename = item['file']
        assert Path(filename).name == filename
        source = directory/filename
        assert source.stat().st_size == item['bytes'] and digest(source) == item['sha256'], filename
        # Preserve each original Mac update manifest under an unambiguous name.
        published_name = f'latest-mac-{target.split("-")[1]}.yml' if filename == 'latest-mac.yml' else filename
        target_path = stage/published_name
        assert not target_path.exists(), published_name
        os.link(source, target_path)
    os.link(directory/f'AILIS-Release-1.4.4-{target}.json', stage/f'AILIS-Release-1.4.4-{target}.json')
    os.link(directory/f'SHA256SUMS-{target}.txt', stage/f'SHA256SUMS-{target}.txt')
    with tarfile.open(stage/f'AILIS-1.4.4-acceptance-{target}.tar.gz','w:gz') as archive:
        archive.add(evidence, arcname=target)
    summaries.append({'target':target,'sourceCommit':COMMIT,'coldTests':cold['pass'],
                      'runtimeFiles':identity['verifiedRuntimeFiles'],'warmupMs':asr['warmupMs'],
                      'fixtures':[{'file':f['file'],'quality':f['quality']} for f in asr['fixtures']]})
    print(f'Verified all assets and acceptance reports: {target}', flush=True)

# Merge native builder-generated file entries; preserve x64 legacy fallback.
# Both architectures remain explicitly identified in filenames for modern updaters.
x64=(stage/'latest-mac-x64.yml').read_text()
arm=(stage/'latest-mac-arm64.yml').read_text()
def entries(text): return text.split('files:\n',1)[1].split('\npath:',1)[0]
merged=x64.replace(entries(x64),entries(x64)+'\n'+entries(arm),1)
(stage/'latest-mac.yml').write_text(merged)
# Validate SHA512 update records against the actual downloaded bytes, not only SHA256 manifests.
import base64
for filename in ['latest.yml','latest-linux.yml','latest-mac.yml']:
    text=(stage/filename).read_text()
    for block in text.split('  - url: ')[1:]:
        lines=block.splitlines(); name=lines[0].strip()
        sha512=next(line.split(': ',1)[1].strip() for line in lines if line.strip().startswith('sha512:'))
        assert base64.b64encode(bytes.fromhex(digest(stage/name,'sha512'))).decode() == sha512

(stage/'AILIS-1.4.4-acceptance-summary.json').write_text(json.dumps({'run':RUN,'commit':COMMIT,'platforms':summaries},indent=2))
checksums=''.join(f'{digest(f)}  {f.name}\n' for f in sorted(stage.iterdir()) if f.is_file())
(stage/'SHA256SUMS.txt').write_text(checksums)
expected={f.name:{'size':f.stat().st_size,'digest':'sha256:'+digest(f)} for f in stage.iterdir() if f.is_file()}
(audit/'expected-assets.json').write_text(json.dumps(expected,indent=2))
assert sum(name.endswith(('.exe','.dmg','.zip','.deb','.tar.gz','.AppImage')) and 'acceptance' not in name for name in expected)==9

# The original assets were backed up, then removed by run 34693603221.
# User-authenticated local gh updated the tag after the integration token was
# unable to do so. This resume must not mutate tags or delete any further assets.
current=api(f'releases/{RELEASE}')
assert current['draft'] and not current['assets']
assert api('git/ref/tags/v1.4.4')['object']['sha'] == COMMIT
# Metadata and final publication use the user's authenticated local CLI because
# this repository's Actions integration cannot PATCH this existing release.
for file in sorted(stage.iterdir()):
    if file.is_file():
        subprocess.run(['gh','release','upload','v1.4.4',str(file),'--repo',REPO],check=True)
        print(f'Uploaded {file.name}',flush=True)
remote=api(f'releases/{RELEASE}')
actual={a['name']:{'size':a['size'],'digest':a.get('digest')} for a in remote['assets']}
assert actual == expected, 'Remote asset names/size/SHA256 must exactly match before publication'
assert api('git/ref/heads/main')['object']['sha'] == before_main
assert api('git/ref/tags/v1.4.5')['object']['sha'] == before_v145
assert remote['draft']
(audit/'verified-draft.json').write_text(json.dumps(remote,indent=2))
print(json.dumps({'readyToPublish':True,'releaseId':RELEASE,'assets':len(actual),'commit':COMMIT}),flush=True)
