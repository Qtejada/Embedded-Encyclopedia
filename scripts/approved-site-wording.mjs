import fs from 'node:fs';
const changes=JSON.parse(fs.readFileSync(new URL('./ltspice-site-wording.json',import.meta.url),'utf8'));
const plain=s=>s.replace(/\[([^\]]+)\]\([^)]*\)/g,'$1').replace(/[*`]/g,'').replace(/^#+ /,'').replace(/ \{#[^}]+\}/g,'');
export function restoreSiteWording(file,text,rendered=false){
  if(rendered){
    if(file.endsWith('/PLL.md')) text=text.replaceAll('first-order model','first-order teaching model');
    text=text.replaceAll('Logic presets','Teaching presets');
  }
  for(const record of changes.filter(c=>c.path===file)) for(const change of record.changes){
    const after=rendered?plain(change.after):change.after;
    const before=rendered?plain(change.before):change.before;
    text=text.replace(after,before);
  }
  return text;
}
