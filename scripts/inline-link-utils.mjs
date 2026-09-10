import fs from 'node:fs';
import assert from 'node:assert/strict';

export const inlineLinkManifest = JSON.parse(fs.readFileSync(new URL('./inline-links.json', import.meta.url)));
const pages = new Map(inlineLinkManifest.pages.map(page => [page.source, page]));

// Remove only this update's recorded wrappers, never arbitrary Markdown links.
export function restoreBeforeInlineLinks(source, bytes) {
  const page = pages.get(source);
  if (!page?.links.length) return bytes;
  let text = bytes.toString('utf8');
  for (const link of page.links) {
    const first = text.indexOf(link.replacement);
    assert.ok(first >= 0, `Recorded link is missing: ${source}: ${link.label}`);
    assert.equal(text.indexOf(link.replacement, first + 1), -1, `Ambiguous recorded link: ${source}: ${link.label}`);
    text = text.slice(0, first) + link.label + text.slice(first + link.replacement.length);
  }
  return Buffer.from(text, 'utf8');
}
