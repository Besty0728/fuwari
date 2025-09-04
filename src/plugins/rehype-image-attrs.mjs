// A tiny rehype plugin to add sane default attrs to <img> in Markdown HTML output
// - loading="lazy" for offscreen images by default
// - decoding="async" to avoid main-thread blocking
// Safe and low-risk: only sets when not already present

import { visit } from 'unist-util-visit';

export default function rehypeImageAttrs() {
  return (tree) => {
    visit(tree, 'element', (node) => {
      if (node.tagName !== 'img') return;
      node.properties = node.properties || {};
      if (!('loading' in node.properties)) {
        node.properties.loading = 'lazy';
      }
      if (!('decoding' in node.properties)) {
        node.properties.decoding = 'async';
      }
      // Leave fetchpriority untouched to avoid hurting LCP images
    });
  };
}
