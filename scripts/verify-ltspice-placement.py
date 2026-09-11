from pathlib import Path
import json,hashlib
from approved_site_wording import restore_placement,placements
R=Path(__file__).resolve().parents[1]
for record in placements:
 text=(R/record['path']).read_text(encoding='utf-8')
 assert hashlib.sha256(text.encode()).hexdigest()==record['afterSha256']
 assert hashlib.sha256(restore_placement(record['path'],text).encode()).hexdigest()==record['beforeSha256']
index=json.loads((R/'src/components/learning/data/circuit-index.json').read_text(encoding='utf-8'))
assert len(index)==54
for item in index:
 text=(R/item['placement']['article']).read_text(encoding='utf-8')
 marker='data-ltspice-placement="'+item['slug']+'"'
 assert text.count(marker)==1
 assert text.index(marker)<text.index('\n'+item['placement']['before']+'\n')
 route,anchor=item['url'].split('#')
 html=(R/'build'/ (route.lstrip('/')+'.html')).read_text(encoding='utf-8')
 assert html.count('id="'+anchor+'"')==1
print('PASS: 54 in-context circuit viewers, exact placement anchors, and all seven original article texts reconstructed.')
