from approved_site_wording import restore_site_wording
"""Verify append-only content, exported data, and every downloadable archive."""
from pathlib import Path
import hashlib
import json
import math
import zipfile

ROOT=Path(__file__).resolve().parents[1]
digest=lambda b:hashlib.sha256(b).hexdigest()
baseline=json.loads((ROOT/'scripts/ltspice-batch-one-originals.json').read_text(encoding='utf-8'))
allowed={'01-Diodes.md','02-BJTs.md','03-MOSFETs.mdx','01-op-amps.md','02-differential-amps.md','comparators.md','Active-filters.md'}
for item in baseline:
    p=ROOT/item['path']
    text=restore_site_wording(item['path'],p.read_text(encoding='utf-8'))
    for change in json.loads((ROOT/'scripts/ltspice-approved-wording.json').read_text(encoding='utf-8')):
        if change['path']==item['path']:
            assert digest(text[:change['afterLength']].encode())==change['afterSha256']
            text=change['before']+text[change['afterLength']:]
    assert digest(text[:item['length']].encode())==item['sha256'],p
    if p.name not in allowed: assert len(text)==item['length'],p
    else:
        added=text[item['length']:]
        assert '\ufffd' not in added and 'thus' not in added.lower()
data=json.loads((ROOT/'src/components/learning/data/ltspice-batch-one.json').read_text(encoding='utf-8'))
specs=json.loads((ROOT/'scripts/ltspice-batch-one-spec.json').read_text(encoding='utf-8'))
assert len(data)==len(specs)==5
with zipfile.ZipFile(ROOT/'static/simulations/ltspice-batch-one.zip') as bundle:
    assert bundle.testzip() is None
    assert len(bundle.namelist())==30
    for spec in specs:
        slug=spec['slug']
        folder=ROOT/'static/simulations'/slug
        check=json.loads((folder/'validation.json').read_text(encoding='utf-8'))
        assert digest((folder/f'{slug}.asc').read_bytes())==check['ascSha256']
        assert len(data[slug]['cases'])==3
        assert data[slug]['schematic']=={k:spec[k] for k in ['components','wires','flags']}
        for case in data[slug]['cases']:
            assert len(case['points'])>=241
            assert all(all(math.isfinite(v) for v in row) for row in case['points'])
            assert all(a[0]<b[0] for a,b in zip(case['points'],case['points'][1:]))
            for row in case['points']: assert len(row)==1+len(data[slug]['keys'])
        with zipfile.ZipFile(folder/f'{slug}.zip') as archive:
            assert archive.testzip() is None and len(archive.namelist())==6
            for name in archive.namelist():
                payload=archive.read(name)
                assert payload==(folder/Path(name).name).read_bytes()
                assert payload==bundle.read(name)
print(f'PASS: {len(baseline)} original article prefixes unchanged, five circuit datasets, and six ZIP archives verified.')
