import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import * as cheerio from 'cheerio';

const root=path.resolve(import.meta.dirname,'..');
const base='/Embedded-Encyclopedia/';
const origin='https://review.invalid';
const baseline=JSON.parse(fs.readFileSync(path.join(root,'scripts/readability-baseline.json'),'utf8'));
const metaDir=path.join(root,'.docusaurus/docusaurus-plugin-content-docs/default');
const metadata=fs.readdirSync(metaDir).filter(p=>p.endsWith('.json')).map(p=>JSON.parse(fs.readFileSync(path.join(metaDir,p),'utf8'))).filter(p=>p.source?.startsWith('@site/docs/'));
const bySource=new Map(metadata.map(p=>[p.source.replace('@site/',''),p]));
const doms=new Map();
function builtFile(pathname){
  assert.ok(pathname.startsWith(base),`Unexpected base path: ${pathname}`);
  const rel=decodeURIComponent(pathname.slice(base.length)).replace(/\/$/,'');
  const candidates=[path.join(root,'build',rel),path.join(root,'build',rel+'.html'),path.join(root,'build',rel,'index.html')];
  const file=candidates.find(p=>fs.existsSync(p)&&fs.statSync(p).isFile());
  assert.ok(file,`Missing built route or asset: ${pathname}`);
  return file;
}
function load(pathname){
  if(!doms.has(pathname))doms.set(pathname,cheerio.load(fs.readFileSync(builtFile(pathname),'utf8')));
  return doms.get(pathname);
}
let links=0,images=0,viewers=0;
for(const record of baseline.files){
  const meta=bySource.get(record.path);
  assert.ok(meta,`Missing metadata: ${record.path}`);
  const dom=load(meta.permalink);
  assert.equal(dom('article h1').length,1,meta.permalink);
  assert.equal(dom('.katex-error').length,0,meta.permalink);
  const ids=dom('article [id]').map((_,el)=>dom(el).attr('id')).get();
  assert.equal(new Set(ids).size,ids.length,`Duplicate article ID: ${meta.permalink}`);
  assert.equal(dom('article a a').length,0,`Nested link: ${meta.permalink}`);
  viewers+=dom('[data-ltspice-placement]').length;
  for(const el of dom('article a[href]').toArray()){
    const url=new URL(dom(el).attr('href'),origin+meta.permalink);
    if(url.origin!==origin)continue;
    builtFile(url.pathname);
    if(url.hash){
      const target=load(url.pathname),id=decodeURIComponent(url.hash.slice(1));
      assert.ok(target('[id]').toArray().some(e=>target(e).attr('id')===id),`Missing anchor: ${url.pathname}#${id}`);
    }
    links++;
  }
  for(const el of dom('article img[src]').toArray()){
    const url=new URL(dom(el).attr('src'),origin+meta.permalink);
    if(url.origin===origin){builtFile(url.pathname);images++;}
  }
}
const circuits=JSON.parse(fs.readFileSync(path.join(root,'src/components/learning/data/circuit-index.json'),'utf8'));
assert.equal(circuits.length,54);
assert.equal(viewers,54);
for(const circuit of circuits){
  const [route,id]=circuit.url.split('#');
  const dom=load(base+route.replace(/^\//,''));
  assert.equal(dom('[id]').toArray().filter(e=>dom(e).attr('id')===id).length,1,circuit.slug);
}
console.log(`PASS: ${baseline.files.length} built article routes, ${links} internal links, ${images} image placements, and ${viewers} circuit viewers. All subsection targets exist; no duplicate article IDs or equation-rendering errors.`);
