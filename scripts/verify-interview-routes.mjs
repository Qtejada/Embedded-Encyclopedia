import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import * as cheerio from 'cheerio';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const directory=path.join(root,'.docusaurus/docusaurus-plugin-content-docs/default');
const docs=fs.readdirSync(directory).filter(p=>p.endsWith('.json')).map(p=>JSON.parse(fs.readFileSync(path.join(directory,p)))).filter(p=>p.source?.startsWith('@site/docs/')&&fs.existsSync(path.join(root,p.source.replace('@site/',''))));
const origin=process.env.INTERVIEW_PREVIEW_ORIGIN||'http://127.0.0.1:3000';
const report=[],assets=new Set(),articleLinks=new Set();
for(const doc of docs){
  const response=await fetch(origin+encodeURI(doc.permalink));
  assert.equal(response.status,200,doc.permalink);
  const dom=cheerio.load(await response.text());
  assert.equal(dom('article h1').length,1,doc.permalink);
  assert.equal(dom('.katex-error').length,0,doc.permalink);
  assert.ok(!/\bNaN\b/.test(dom('article').text()),doc.permalink);
  const ids=dom('article [id]').map((_,el)=>dom(el).attr('id')).get();
  assert.equal(new Set(ids).size,ids.length,doc.permalink);
  dom('img[src],script[src],link[rel="stylesheet"][href]').each((_,el)=>{const u=new URL(dom(el).attr('src')||dom(el).attr('href'),response.url);if(u.origin===origin)assets.add(u.href);});
  dom('article a[href]').each((_,el)=>{const u=new URL(dom(el).attr('href'),response.url);if(u.origin===origin)articleLinks.add(u.href);});
  report.push({source:doc.source.replace('@site/',''),title:doc.title,url:doc.permalink,equations:dom('.katex-display').length,tools:dom('article section[aria-label]').map((_,el)=>dom(el).attr('aria-label')).get()});
}
for(const url of assets){const response=await fetch(url,{method:'HEAD'});assert.equal(response.status,200,url);}
// Docusaurus also validates document links during the build. Check actual rendered targets here.
const pages=new Map();
for(const href of articleLinks){const u=new URL(href);const fragment=decodeURIComponent(u.hash.slice(1));u.hash='';if(!pages.has(u.href)){const response=await fetch(u.href);assert.equal(response.status,200,u.href);pages.set(u.href,await response.text());}
  if(fragment){const dom=cheerio.load(pages.get(u.href));assert.ok(dom('[id]').toArray().some(el=>dom(el).attr('id')===fragment),'Missing anchor '+href);}
}
fs.writeFileSync(path.join(root,'scripts/interview-route-report.json'),JSON.stringify(report,null,2));
console.log(`PASS: ${report.length} article routes, ${assets.size} local assets, and ${articleLinks.size} local article links. Each article has one title, valid equation markup, and unique IDs.`);
