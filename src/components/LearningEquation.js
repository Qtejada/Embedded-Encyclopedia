import React from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

/** Render only explicitly added equations. Existing Markdown parsing stays unchanged. */
export default function LearningEquation({tex}) {
  const html = katex.renderToString(tex, {displayMode: true, output: 'htmlAndMathml', throwOnError: true, trust: false, strict: 'error'});
  return <div style={{overflowX: 'auto', maxWidth: '100%', padding: '.25rem 0'}} dangerouslySetInnerHTML={{__html: html}} />;
}
