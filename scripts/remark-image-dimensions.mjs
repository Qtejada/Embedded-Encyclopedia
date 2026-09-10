import fs from 'node:fs';
import path from 'node:path';

// Reserve the intrinsic size of existing JSX PNG images before they load.
// This prevents images above a deep link from moving its target after scrolling.
export default function remarkImageDimensions({staticDir}) {
  const root = path.resolve(staticDir);
  return tree => {
    function visit(node) {
      if (['mdxJsxFlowElement', 'mdxJsxTextElement'].includes(node.type) && node.name === 'img') {
        const attributes = node.attributes || [];
        const source = attributes.find(attribute => attribute.name === 'src')?.value;
        let url = typeof source === 'string' ? source : null;
        if (source?.type === 'mdxJsxAttributeValueExpression') {
          // Read only a literal useBaseUrl argument. Never evaluate MDX code.
          url = /^useBaseUrl\(\s*(['"])(\/img\/[^'"\r\n]+)\1\s*\)$/.exec(source.value.trim())?.[2];
        }
        if (url && !attributes.some(attribute => ['width', 'height'].includes(attribute.name))) {
          let bytes;
          if (/^data:image\/png;base64,/.test(url)) {
            bytes = Buffer.from(url.slice(url.indexOf(',') + 1), 'base64');
          } else if (/^\/img\/.*\.png$/i.test(url)) {
            const imagePath = path.resolve(root, '.' + decodeURI(url));
            const relative = path.relative(root, imagePath);
            if (!relative.startsWith('..') && !path.isAbsolute(relative) && fs.existsSync(imagePath)) bytes = fs.readFileSync(imagePath);
          }
          if (bytes?.length >= 24 && bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])) && bytes.toString('ascii', 12, 16) === 'IHDR') {
            const width = bytes.readUInt32BE(16);
            const height = bytes.readUInt32BE(20);
            if (width > 0 && height > 0) {
              attributes.push({type: 'mdxJsxAttribute', name: 'width', value: String(width)});
              attributes.push({type: 'mdxJsxAttribute', name: 'height', value: String(height)});
            }
          }
        }
      }
      for (const child of node.children || []) visit(child);
    }
    visit(tree);
  };
}
