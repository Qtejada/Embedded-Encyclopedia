"""Append the circuit lessons without changing existing article text."""
from pathlib import Path
import json,re,hashlib
ROOT=Path(__file__).resolve().parents[1]
specs=json.loads((ROOT/'scripts/ltspice-library-spec.json').read_text())
baseline={r['path']:r for r in json.loads((ROOT/'scripts/ltspice-library-originals.json').read_text())}
groups={}
index=[]
for s in specs:
 groups.setdefault(s['article'],[]).append(s)
 route='/docs/'+'/'.join(re.sub(r'^\d+-','',part) for part in Path(s['article']).with_suffix('').parts[1:])
 index.append(dict(slug=s['slug'],title=s['title'],intro=s['intro'],group=Path(s['article']).stem.split('-',1)[-1],url=route+'#ltspice-'+s['slug']))
for article,circuits in groups.items():
 p=ROOT/article;text=p.read_text(encoding='utf-8');base=baseline[article]
 assert hashlib.sha256(text[:base['length']].encode()).hexdigest()==base['sha256']
 assert len(text)==base['length'],'Already integrated: '+article
 added="\n\nimport CircuitLibrarySimulation from '@site/src/components/learning/CircuitLibrarySimulation';\n\n## More LTspice circuits {#ltspice-circuits}\n\nThese examples show component behavior and reusable circuit blocks. Each example includes three parameter settings.\n\n[Browse all LTspice circuits](/ltspice-circuits).\n"
 for s in circuits:
  added+='\n### '+s['title']+' {#ltspice-'+s['slug']+'}\n\n'+s['intro']+'\n\n'+'\n\n'.join(s['explanation'])+'\n\n<CircuitLibrarySimulation circuit="'+s['slug']+'" />\n'
 p.write_text(text+added,encoding='utf-8')
existing=[
 ('bjt-current-mirror','NPN current mirror','BJTs#ltspice-example-a-basic-bjt-current-mirror','Compare reference and output currents.'),
 ('half-wave-rectifier','Half-wave rectifier','Diodes#ltspice-example-half-wave-rectifier','Compare reservoir capacitor values.'),
 ('bridge-rectifier','Full-wave bridge rectifier','Diodes#ltspice-example-full-wave-bridge-rectifier','Follow both current paths and compare ripple.'),
 ('jfet-self-bias','JFET self bias','MOSFETs#ltspice-example-jfet-self-bias','Compare source resistance and bias.'),
 ('mosfet-switches','N-channel and P-channel switches','MOSFETs#ltspice-example-n-channel-and-p-channel-switches','Compare low-side and high-side control.'),
 ('common-emitter-amplifier','Common-emitter amplifier','BJTs#ltspice-example-common-emitter-amplifier','Compare emitter bypass and gain.')]
for slug,title,url,intro in existing:
 index.insert(0,dict(slug=slug,title=title,url='/docs/Discrete-Components/Semicondctors/'+url,intro=intro,group=url.split('#')[0]))
(ROOT/'src/components/learning/data/circuit-index.json').write_text(json.dumps(index,indent=2)+'\n')
print('Appended',len(specs),'lessons to',len(groups),'articles.')
