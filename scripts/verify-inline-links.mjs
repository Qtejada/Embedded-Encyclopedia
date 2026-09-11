import {restoreSiteWording} from './approved-site-wording.mjs';
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import * as cheerio from 'cheerio';
import {inlineLinkManifest, restoreBeforeInlineLinks} from './inline-link-utils.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
// Preserve this historical audit while allowing verified append-only additions.
const juniorSource = new Map(JSON.parse(fs.readFileSync(path.join(root, 'scripts/junior-originals.json'))).files.map(p => [p.path, p]));
const juniorRendered = new Map(JSON.parse(fs.readFileSync(path.join(root, 'scripts/junior-rendered-originals.json'))).map(p => [p.source, p]));
const pages = new Map(inlineLinkManifest.pages.map(page => [page.source, page]));
const rendered = new Map();
const origin = 'https://example.invalid';
let count = 0;
let reservedImages = 0;
let byteExactArticles = 0;
for (const page of pages.values()) {
  const current = fs.readFileSync(path.join(root, page.source));
  const original = juniorSource.get(page.source);
  const prefix = restoreSiteWording(page.source,current.toString('utf8').replace(/\r\n/g, '\n')).slice(0, original.normalized);
  assert.equal(hash(prefix), original.normalizedSha256, `Original article prefix changed: ${page.source}`);
  const bytes = hash(current.subarray(0, original.bytes)) === original.sha256 ? current.subarray(0, original.bytes) : Buffer.from(prefix);
  const restored = restoreBeforeInlineLinks(page.source, bytes);
  if (hash(restored) === page.beforeSha256) byteExactArticles++;
  // Git can convert CRLF and LF between Windows and the Linux Pages build.
  assert.equal(hash(restored.toString('utf8').replace(/\r\n/g, '\n')), page.beforeNormalizedSha256, `Article wording changed: ${page.source}`);
  assert.equal(hash(bytes.toString('utf8').replace(/\r\n/g, '\n')), page.afterNormalizedSha256, `Unexpected source change: ${page.source}`);
  const buildPath = decodeURI(page.url.replace('/Embedded-Encyclopedia/', '')).replace(/\/$/, '') + '.html';
  const dom = cheerio.load(fs.readFileSync(path.join(root, 'build', buildPath), 'utf8'));
  assert.equal(hash(restoreSiteWording(page.source,dom('article').text(),true).slice(0, juniorRendered.get(page.source).length)), page.articleTextSha256, `Rendered original article text changed: ${page.source}`);
  const headings = dom('article h2[id], article h3[id], article h4[id]').map((_, el) => ({id: dom(el).attr('id'), text: restoreSiteWording(page.source,dom(el).text().replace(/\u200b/g, ''),true)})).get();
  assert.deepEqual(headings.slice(0, page.headings.length), page.headings, `Original subsection headings changed: ${page.source}`);
  assert.equal(dom('article a a').length, 0, `Nested links: ${page.source}`);
  for (const element of dom('article img').toArray()) {
    const image = dom(element);
    if (/^\/Embedded-Encyclopedia\/img\/.*\.png$/i.test(image.attr('src') || '')) {
      assert.ok(Number(image.attr('width')) > 0 && Number(image.attr('height')) > 0, `Image can shift a subsection target: ${page.source}: ${image.attr('src')}`);
      reservedImages++;
    }
  }
  rendered.set(page.source, dom);
}
for (const page of pages.values()) {
  const seen = new Set();
  const dom = rendered.get(page.source);
  for (const link of page.links) {
    assert.ok(link.anchor && link.target !== page.source, `Not a cross-article subsection: ${page.source}`);
    const key = `${link.target}#${link.anchor}`;
    assert.ok(!seen.has(key), `Repeated destination: ${page.source}: ${key}`);
    seen.add(key);
    const target = pages.get(link.target);
    assert.ok(target, key);
    assert.ok(target.headings.some(heading => heading.id === link.anchor), `Not an h2/h3/h4 destination: ${key}`);
    const expected = new URL(target.url + '#' + link.anchor, origin);
    const matches = dom('article a[href]').toArray().filter(el => {
      const url = new URL(dom(el).attr('href'), origin + page.url);
      return decodeURI(url.pathname).replace(/\/$/, '') === decodeURI(expected.pathname).replace(/\/$/, '') && decodeURIComponent(url.hash) === decodeURIComponent(expected.hash) && dom(el).text() === link.label;
    });
    assert.equal(matches.length, 1, `Rendered link missing or duplicated: ${page.source}: ${link.label} -> ${key}`);
    const targetDom = rendered.get(link.target);
    assert.equal(targetDom('article h2[id], article h3[id], article h4[id]').toArray().filter(el => targetDom(el).attr('id') === link.anchor).length, 1, key);
    count++;
  }
}
console.log(`PASS: ${count} historical inline links reach exact subsections across ${[...pages.values()].filter(page => page.links.length).length} pages. All ${pages.size} original article prefixes reconstruct exactly apart from Git line endings (${byteExactArticles} byte-exact). Original rendered text and headings are unchanged. No duplicate destinations or nested links.`);
console.log(`PASS: ${reservedImages} local PNG placements reserve their dimensions before loading.`);
