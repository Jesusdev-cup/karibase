/**
 * Pass 2: strip shared docs-* rules from <style> blocks that also contain
 * @media/@keyframes (skipped by the main codemod). Brace-aware parser keeps
 * at-rules and page-specific selectors intact.
 * Usage: node scripts/strip-shared-css.mjs <file.vue> [...]
 */
import { readFileSync, writeFileSync } from 'node:fs'

const SHARED_BASES = new Set([
  'docs-breadcrumb', 'docs-breadcrumb-link', 'docs-breadcrumb-separator',
  'docs-breadcrumb-current', 'docs-heading', 'docs-heading-2', 'docs-heading-3',
  'docs-lead', 'docs-text', 'docs-inline-code', 'docs-section', 'docs-preview',
  'docs-code-block', 'docs-example', 'docs-list', 'docs-breakpoint-table',
  'docs-callout', 'docs-callout-info', 'docs-callout-warning',
  'docs-callout-success', 'docs-callout-danger', 'docs-callout-icon',
  'docs-callout-content', 'docs-callout-title', 'docs-callout-text',
  'docs-next-prev', 'docs-prev', 'docs-next'
])

const isShared = sel =>
  sel.split(',').every(s => {
    const base = (s.trim().match(/\.([\w-]+)/) || [])[1]
    return base && SHARED_BASES.has(base)
  })

function processCss(css) {
  const chunks = []
  let i = 0
  while (i < css.length) {
    const brace = css.indexOf('{', i)
    if (brace === -1) break
    const sel = css.slice(i, brace).trim()
    if (sel.startsWith('@')) {
      // consume the whole at-rule (balanced braces)
      let depth = 0, j = brace
      for (; j < css.length; j++) {
        if (css[j] === '{') depth++
        else if (css[j] === '}') { depth--; if (depth === 0) { j++; break } }
      }
      chunks.push({ keep: true, raw: css.slice(i, j) })
      i = j
    } else {
      const end = css.indexOf('}', brace)
      if (end === -1) break
      chunks.push({ keep: !isShared(sel), raw: css.slice(i, end + 1) })
      i = end + 1
    }
  }
  const kept = chunks.filter(c => c.keep)
  return { css: kept.length ? '\n' + kept.map(c => c.raw.trim() + '\n').join('\n') : '', dropped: chunks.length - kept.length }
}

for (const file of process.argv.slice(2)) {
  const src = readFileSync(file, 'utf8')
  let total = 0
  const out = src.replace(/(<style[^>]*>)([\s\S]*?)(<\/style>)/g, (_, open, css, close) => {
    const { css: kept, dropped } = processCss(css)
    total += dropped
    return kept ? open + kept + close : ''
  })
  writeFileSync(file, out)
  console.log(`${file}: dropped ${total} shared rules`)
}
