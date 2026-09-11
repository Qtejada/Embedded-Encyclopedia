from approved_site_wording import restore_site_wording
"""Verify preservation, all library artifacts, and built lesson anchors."""
from pathlib import Path
import hashlib,json,zipfile,math,re
ROOT=Path(__file__).resolve().parents[1]
digest=lambda b:hashlib.sha256(b).hexdigest()
specs=json.loads((ROOT/'scripts/ltspice-library-spec.json').read_text())
allowed={s['article'] for s in specs}
baseline=json.loads((ROOT/'scripts/ltspice-library-originals.json').read_text())
for item in baseline:
 text=restore_site_wording(item['path'],(ROOT/item['path']).read_text(encoding='utf-8'))
 assert digest(text[:item['length']].encode())==item['sha256'],item['path']
 added=text[item['length']:]
 if item['path'] not in allowed:assert not added,item['path']
 assert not re.search(r'\bthus\b|teaching model',added,re.I),item['path']
registry=json.loads((ROOT/'src/components/learning/data/circuit-library.json').read_text())
assert len(specs)==len(registry)==48
for spec in specs:
 slug=spec['slug'];folder=ROOT/'static/simulations'/slug
 data=json.loads((folder/'viewer.json').read_text())
 report=json.loads((folder/'validation.json').read_text())
 assert digest((folder/(slug+'.asc')).read_bytes())==report['ascSha256']
 assert len(data['cases'])==len(report['cases'])==3
 assert data['schematic']==spec['schematic']
 for case in data['cases']:
  points=case['points'];assert len(points)>=100
  assert all(len(p)==len(data['keys'])+1 and all(math.isfinite(v) for v in p) for p in points)
  assert all(a[0]<b[0] for a,b in zip(points,points[1:]))
 with zipfile.ZipFile(folder/(slug+'.zip')) as archive:
  assert archive.testzip() is None and len(archive.namelist())==6
  for name in archive.namelist():assert archive.read(name)==(folder/Path(name).name).read_bytes()
 for file in folder.iterdir():
  assert file.stat().st_size<90_000_000,file
  if file.suffix in {'.txt','.asc','.cir','.json'}:assert not re.search(r'teaching model|TeachN|TeachP|TeachJ|TeachD|MirrorNPN',file.read_text(),re.I),file
index=json.loads((ROOT/'src/components/learning/data/circuit-index.json').read_text(encoding='utf-8-sig'))
assert len(index)==len({c['slug'] for c in index})==54
for item in index:
 route,anchor=item['url'].split('#');page=ROOT/'build'/route.lstrip('/')
 candidates=[page.with_suffix('.html'),page/'index.html']
 built=next((p for p in candidates if p.exists()),None)
 assert built,route
 assert f'id="{anchor}"' in built.read_text(encoding='utf-8'),(route,anchor)
print('PASS: 70 article prefixes, 48 new circuit datasets and ZIPs, 144 new cases, and 54 lesson anchors.')
