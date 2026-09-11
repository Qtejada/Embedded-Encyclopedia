import {restoreSiteWording} from './approved-site-wording.mjs';
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {unified} from 'unified';
import remarkParse from 'remark-parse';

const root = path.resolve(import.meta.dirname, '..');
const baseline = JSON.parse(fs.readFileSync(path.join(root, 'scripts/junior-originals.json')));
const hash = text => createHash('sha256').update(text).digest('hex');
const cuts = new Map();
let exact = 0;
for (const record of baseline.files) {
  const bytes = fs.readFileSync(path.join(root, record.path));
  if (hash(bytes.subarray(0, record.bytes)) === record.sha256) exact++;
  const text = restoreSiteWording(record.path,bytes.toString('utf8').replace(/\r\n/g, '\n'));
  assert.equal(hash(text.slice(0, record.normalized)), record.normalizedSha256, `Original writing changed: ${record.path}`);
  if (record.path.endsWith('/Phils-lab.md')) assert.equal(text.length, record.normalized);
  cuts.set(record.path, record.normalized);
}
function files(dir) {
  return fs.readdirSync(dir, {withFileTypes: true}).flatMap(e => e.isDirectory() ? files(path.join(dir, e.name)) : [path.join(dir, e.name)]);
}
const segmenter = new Intl.Segmenter('en', {granularity: 'sentence'});
const plain = node => node.value || (node.children || []).map(plain).join('');
let changed = 0, paragraphs = 0;
const issues = [];
for (const file of files(path.join(root, 'docs')).filter(p => /\.mdx?$/.test(p))) {
  const rel = path.relative(root, file).replaceAll('\\', '/');
  let added = restoreSiteWording(rel,fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n')).slice(cuts.get(rel) || 0);
  if (!added.trim()) continue;
  changed++;
  assert.ok(!/\bthus\b/i.test(added), `Forbidden word: ${rel}`);
  added = added.replace(/^---\n[\s\S]*?\n---\n/, '').replace(/^import .*$/gm, '').replace(/^<.*>\s*$/gm, '');
  const tree = unified().use(remarkParse).parse(added);
  function visit(node) {
    if (node.type === 'paragraph') {
      const text = plain(node);
      if (text.includes('|')) return;
      paragraphs++;
      const sentences = [...segmenter.segment(text)].map(s => s.segment.trim()).filter(Boolean);
      if (sentences.length > 6) issues.push(`${rel}: paragraph has ${sentences.length} sentences`);
      for (const sentence of sentences) {
        const words = sentence.split(/\s+/).length;
        if (words > 25) issues.push(`${rel}: ${words} words: ${sentence}`);
      }
      if (text.includes(';')) issues.push(`${rel}: prose semicolon`);
    }
    for (const child of node.children || []) visit(child);
  }
  visit(tree);
}
assert.equal(issues.length, 0, issues.join('\n'));
console.log(`PASS: ${baseline.files.length} original article prefixes preserved (${exact} byte-exact). Phil's Lab unchanged. ${changed} added or expanded articles, ${paragraphs} prose blocks pass automated style checks.`);
console.log('Dictionary compliance and technical meaning require editorial review in addition to these mechanical checks.');
