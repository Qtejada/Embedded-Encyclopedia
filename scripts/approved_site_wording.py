import json
from pathlib import Path
changes=json.loads(Path(__file__).with_name('ltspice-site-wording.json').read_text(encoding='utf-8'))
def restore_site_wording(file,text):
 for record in changes:
  if record['path']==file:
   for change in record['changes']:
    assert text.count(change['after'])==1,(file,change['after'])
    text=text.replace(change['after'],change['before'])
 return text
