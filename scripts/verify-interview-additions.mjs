import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {unified} from 'unified';
import remarkParse from 'remark-parse';
import {restoreBeforeInlineLinks} from './inline-link-utils.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=p=>restoreBeforeInlineLinks(p,fs.readFileSync(path.join(root,p)));
const json=p=>JSON.parse(read(p));
const hash=s=>crypto.createHash('sha256').update(s).digest('hex');
const originals=json('scripts/interview-originals.json').files;
const changes=json('scripts/interview-changes.json');
const coverage=json('scripts/interview-coverage.json');
let byteExact=0;
const cuts=new Map();
for(const record of originals){
  const bytes=read(record.path);
  if(hash(bytes.subarray(0,record.bytes))===record.sha256)byteExact++;
  const normalized=bytes.toString('utf8').replace(/\r\n/g,'\n');
  assert.equal(hash(normalized.slice(0,record.normalizedLength)),record.normalizedSha256,'Original writing changed: '+record.path);
  cuts.set(record.path,record.normalizedLength);
  if(record.path.endsWith('/Phils-lab.md'))assert.equal(normalized.length,record.normalizedLength,'Phil’s Lab must remain untouched');
}
const issues=[];
const segmenter=new Intl.Segmenter('en',{granularity:'sentence'});
const plain=node=>node.value||(node.children||[]).map(plain).join('');
let paragraphs=0;
for(const p of Object.keys(changes)){
  let added=read(p).toString('utf8').replace(/\r\n/g,'\n').slice(cuts.get(p)||0);
  assert.ok(!/\bthus\b/i.test(added),'Forbidden added word: '+p);
  added=added.replace(/^---\n[\s\S]*?\n---\n/,'').replace(/^import .*$/gm,'').replace(/^<.*>\s*$/gm,'');
  const tree=unified().use(remarkParse).parse(added);
  function visit(node){
    if(node.type==='paragraph'){
      const text=plain(node);
      if(text.includes('|'))return; // Markdown table cells need separate editorial review.
      paragraphs++;
      const sentences=[...segmenter.segment(text)].map(s=>s.segment.trim()).filter(Boolean);
      if(sentences.length>6)issues.push(`${p}: paragraph has ${sentences.length} sentences`);
      for(const sentence of sentences){const words=sentence.split(/\s+/).length;if(words>25)issues.push(`${p}: ${words} words: ${sentence}`);}
      if(text.includes(';'))issues.push(`${p}: prose semicolon`);
    }
    for(const child of node.children||[])visit(child);
  }
  visit(tree);
}
assert.equal(coverage.entries.length,1085);
for(const [index,row] of coverage.entries.entries()){
  assert.equal(row.id,index+1);
  assert.ok(coverage.statusDefinitions[row.status]);
  assert.ok(Number.isInteger(row.sourceLine)&&row.sourceLine>0);
  for(const p of row.evidence){assert.ok(p.startsWith('docs/')&&!p.includes('..'));assert.ok(fs.existsSync(path.join(root,p)),p);}
  if(['covered','derivable','added'].includes(row.status))assert.ok(row.evidence.length>0);
  if(row.status==='covered')for(const p of row.evidence)assert.ok(cuts.has(p),'Baseline coverage cites a new page: '+p);
}
if(issues.length){console.error(issues.join('\n'));process.exitCode=1;}
else console.log(`PASS: ${originals.length} original documents preserved (${byteExact} byte-exact prefixes after removing recorded inline-link wrappers). Phil’s Lab unchanged. ${paragraphs} added prose blocks pass sentence-length, paragraph-length, and banned-word checks. All 1085 coverage IDs have valid dispositions and evidence paths.`);
