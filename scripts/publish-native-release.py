"""Publish one fully accepted native CI run without rebuilding or replacing tags."""
import argparse
import base64
import hashlib
import json
import os
from pathlib import Path
import subprocess
import tarfile

import yaml

REPO = 'haowenGuo/AILIS'
TARGETS = ['win32-x64', 'linux-x64', 'darwin-x64', 'darwin-arm64']


def gh(*args):
    return subprocess.check_output(['gh', *args])


def api(path):
    return json.loads(gh('api', f'repos/{REPO}/{path}'))


def read(path):
    return json.loads(path.read_text(encoding='utf-8-sig'))


def digest(path, algorithm='sha256'):
    value = hashlib.new(algorithm)
    with path.open('rb') as stream:
        for chunk in iter(lambda: stream.read(8 * 1024 * 1024), b''):
            value.update(chunk)
    return value.hexdigest()


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--run', required=True, type=int)
    args = parser.parse_args()
    version = read(Path('package.json'))['version']
    tag = f'v{version}'
    run = api(f'actions/runs/{args.run}')
    assert run['conclusion'] == 'success' and run['path'] == '.github/workflows/release-clean-install.yml'
    commit = run['head_sha']
    jobs = api(f'actions/runs/{args.run}/jobs?per_page=100')['jobs']
    for target in TARGETS:
        matches = [j for j in jobs if j['name'] == f'Native package and offline acceptance - {target}']
        assert len(matches) == 1 and matches[0]['conclusion'] == 'success', target
    # The authenticated maintainer creates this exact draft/tag. Actions can upload
    # attachments here, but cannot create or publish releases in this repository.
    draft = api(f'releases/tags/{tag}')
    assert draft['draft'] and draft['target_commitish'] == commit
    assert api('git/ref/tags/' + tag)['object']['sha'] == commit
    stage = Path('publication-stage')
    stage.mkdir()
    summaries = []
    for target in TARGETS:
        directory = Path('publication-downloads') / target
        subprocess.run(['gh', 'run', 'download', str(args.run), '--repo', REPO,
                        '--name', f'ailis-{tag}-{target}-{commit}', '--dir', str(directory)], check=True)
        manifest_name = f'AILIS-Release-{version}-{target}.json'
        manifest = read(directory / manifest_name)
        assert manifest['commit'] == commit and manifest['version'] == version
        evidence = directory / 'evidence' / target
        identity = read(evidence / 'package-identity.json')
        cold = read(evidence / 'packaged-cold-runtime.json')
        asr = read(evidence / 'offline-asr.json')
        assert identity['success'] and identity['sourceCommit'] == commit
        assert cold['code'] == 0 and cold['pass'] >= 22 and cold['fail'] == cold['cancelled'] == 0
        assert asr['success'] and len(asr['fixtures']) == 2
        if target == 'win32-x64':
            installed = read(evidence / 'nsis/clean-install-report.json')
            assert installed['success'] and all(c['ok'] for c in installed['checks'])
            assert installed['cleanAgentTurn']['ok'] and installed['cleanAgentTurn']['agentTurn']['nonceMatched']
            assert read(evidence / 'nsis/installed-source-identity.json')['sourceCommit'] == commit
        for item in manifest['artifacts']:
            name = item['file']
            assert Path(name).name == name
            source = directory / name
            assert source.stat().st_size == item['bytes'] and digest(source) == item['sha256'], name
            published = f'latest-mac-{target.split("-")[1]}.yml' if name == 'latest-mac.yml' else name
            assert not (stage / published).exists()
            os.link(source, stage / published)
        for name in [manifest_name, f'SHA256SUMS-{target}.txt']:
            os.link(directory / name, stage / name)
        with tarfile.open(stage / f'AILIS-{version}-acceptance-{target}.tar.gz', 'w:gz') as archive:
            archive.add(evidence, arcname=target)
        summaries.append({'target': target, 'sourceCommit': commit, 'coldTests': cold['pass'],
                          'runtimeFiles': identity['verifiedRuntimeFiles'], 'warmupMs': asr['warmupMs']})
        print(f'Verified {target}', flush=True)
    mac = yaml.safe_load((stage / 'latest-mac-x64.yml').read_text())
    mac['files'] += yaml.safe_load((stage / 'latest-mac-arm64.yml').read_text())['files']
    (stage / 'latest-mac.yml').write_text(yaml.safe_dump(mac, sort_keys=False))
    for name in ['latest.yml', 'latest-linux.yml', 'latest-mac.yml']:
        update = yaml.safe_load((stage / name).read_text())
        assert update['version'] == version
        for item in update['files']:
            assert Path(item['url']).name == item['url']
            assert base64.b64encode(bytes.fromhex(digest(stage / item['url'], 'sha512'))).decode() == item['sha512']
    (stage / f'AILIS-{version}-acceptance-summary.json').write_text(json.dumps(
        {'run': args.run, 'commit': commit, 'platforms': summaries}, indent=2))
    (stage / 'SHA256SUMS.txt').write_text(''.join(
        f'{digest(p)}  {p.name}\n' for p in sorted(stage.iterdir()) if p.is_file()))
    expected = {p.name: {'size': p.stat().st_size, 'digest': 'sha256:' + digest(p)} for p in stage.iterdir()}
    assert sum(name.endswith(('.exe', '.dmg', '.zip', '.deb', '.tar.gz', '.AppImage'))
               and 'acceptance' not in name for name in expected) == 9
    existing = {a['name']: {'size': a['size'], 'digest': a.get('digest')} for a in draft['assets']}
    assert all(name in expected and value == expected[name] for name, value in existing.items())
    for file in sorted(stage.iterdir()):
        if file.name in existing:
            continue
        subprocess.run(['gh', 'release', 'upload', tag, str(file), '--repo', REPO], check=True)
    remote = api(f'releases/tags/{tag}')
    actual = {a['name']: {'size': a['size'], 'digest': a.get('digest')} for a in remote['assets']}
    assert actual == expected and remote['draft'], 'Asset identity mismatch; keep release draft'
    # The maintainer publishes only after this run succeeds with all digests verified.
    print(json.dumps({'readyToPublish': tag, 'commit': commit, 'assets': len(expected)}), flush=True)


if __name__ == '__main__':
    main()
