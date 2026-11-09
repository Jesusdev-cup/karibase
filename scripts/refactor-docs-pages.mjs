/**
 * Codemod: refactor docs views to the modular docs component system.
 *
 * Per file:
 *  - <div class="docs-article"> shell (breadcrumb, h1, lead, next-prev)
 *    -> <DocsArticle> props
 *  - simple <div class="docs-preview">X</div> + <div class="docs-code-block">
 *    pairs -> <DocsExample>X<template #code>...</template></DocsExample>
 *    (only when the preview contains no nested <div>)
 *  - duplicated docs-* rules in <style> blocks are stripped (they now live
 *    in src/styles/karibase-style-docs.css)
 *  - component imports are injected into <script>
 *
 * Usage: node scripts/refactor-docs-pages.mjs [--write]
 *   default = dry run (report only)
 */
import { readFileSync, writeFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const VIEWS_DIR = fileURLToPath(new URL('../src/views', import.meta.url))
const WRITE = process.argv.includes('--write')

// Base classes whose rules are now provided globally
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

const decodeEntities = s => s
  .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
  .replace(/&quot;/g, '"').replace(/&#0?39;|&apos;/g, "'")
const stripTags = s => decodeEntities(s.replace(/<[^>]*>/g, '')).replace(/\s+/g, ' ').trim()
const escapeAttr = s => s.replace(/"/g, '&quot;')
const jsStr = s => `'${s.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`
const linkObj = o => `{ name: ${jsStr(o.name)}, path: ${jsStr(o.path)} }`

const report = []

for (const file of readdirSync(VIEWS_DIR).filter(f => f.endsWith('.vue'))) {
  const path = join(VIEWS_DIR, file)
  const src = readFileSync(path, 'utf8')
  const info = { file, status: 'ok', notes: [], used: new Set() }

  const tplMatch = src.match(/<template>([\s\S]*?)<\/template>/)
  if (!tplMatch) { info.status = 'SKIP: no template'; report.push(info); continue }
  let tpl = tplMatch[1]

  if (!tpl.includes('<div class="docs-article">')) {
    info.status = 'SKIP: no docs-article root'
    report.push(info)
    continue
  }

  // ---- extract shell pieces ---------------------------------------------
  let title = '', lead = '', breadcrumb = [], prev = null, next = null
  const keep = []

  const bc = tpl.match(/<div class="docs-breadcrumb">([\s\S]*?)<\/div>/)
  if (bc) {
    for (const m of bc[1].matchAll(/<router-link to="([^"]+)" class="docs-breadcrumb-link">([\s\S]*?)<\/router-link>/g)) {
      const item = { name: stripTags(m[2]), path: m[1] }
      if (!(item.path === '/' && item.name === 'Home')) breadcrumb.push(item)
    }
    const cur = bc[1].match(/<span class="docs-breadcrumb-current">([\s\S]*?)<\/span>/)
    if (cur) breadcrumb.push({ name: stripTags(cur[1]) })
    tpl = tpl.replace(bc[0], '')
  } else {
    info.notes.push('no breadcrumb')
  }

  const h1 = tpl.match(/<h1 class="docs-heading">([\s\S]*?)<\/h1>/)
  if (h1) {
    if (h1[1].includes('<')) keep.push(h1[0])
    else title = stripTags(h1[1])
    tpl = tpl.replace(h1[0], '')
  }

  const leadM = tpl.match(/<p class="docs-lead">([\s\S]*?)<\/p>/)
  if (leadM) {
    if (leadM[1].includes('<')) keep.push(leadM[0])
    else lead = stripTags(leadM[1])
    tpl = tpl.replace(leadM[0], '')
  }

  const np = tpl.match(/<div class="docs-next-prev">([\s\S]*?)<\/div>/)
  if (np) {
    for (const m of np[1].matchAll(/<router-link to="([^"]+)" class="docs-(prev|next)">([\s\S]*?)<\/router-link>/g)) {
      const link = { name: stripTags(m[3]), path: m[1] }
      if (m[2] === 'prev') prev = link; else next = link
    }
    tpl = tpl.replace(np[0], '')
  }

  // ---- convert simple preview+code pairs ---------------------------------
  let examples = 0
  tpl = tpl.replace(
    /<div class="docs-preview">((?:(?!<\/?div)[\s\S])*)<\/div>\s*<div class="docs-code-block">\s*<pre><code>([\s\S]*?)<\/code><\/pre>\s*<\/div>/g,
    (_, preview, code) => {
      examples++
      return `<DocsExample>${preview}<template #code>${code}</template></DocsExample>`
    }
  )
  if (examples) info.used.add('DocsExample')
  if (/<div class="docs-preview/.test(tpl)) info.notes.push('raw docs-preview left')

  // ---- rebuild template --------------------------------------------------
  const attrs = []
  if (title) attrs.push(`title="${escapeAttr(title)}"`)
  if (lead) attrs.push(`lead="${escapeAttr(lead)}"`)
  if (breadcrumb.length > 1 || (breadcrumb.length === 1 && breadcrumb[0].path)) {
    attrs.push(`:breadcrumb="[${breadcrumb.map(i => i.path ? linkObj(i) : `{ name: ${jsStr(i.name)} }`).join(', ')}]"`)
  }
  if (prev) attrs.push(`:prev="${linkObj(prev)}"`)
  if (next) attrs.push(`:next="${linkObj(next)}"`)

  tpl = tpl.replace('<div class="docs-article">', `<DocsArticle\n    ${attrs.join('\n    ')}\n  >`)
  const lastClose = tpl.lastIndexOf('</div>')
  tpl = tpl.slice(0, lastClose) + '</DocsArticle>' + tpl.slice(lastClose + 6)
  if (keep.length) {
    tpl = tpl.replace(/(<DocsArticle[^>]*>)/, `$1\n    ${keep.join('\n    ')}`)
  }

  // ---- strip shared rules from style blocks -------------------------------
  const styleBlocks = []
  const styleRe = /<style([^>]*)>([\s\S]*?)<\/style>/g
  let m
  while ((m = styleRe.exec(src))) styleBlocks.push({ attrs: m[1], css: m[2] })

  const keptStyles = []
  let droppedRules = 0
  for (const { attrs, css } of styleBlocks) {
    if (css.includes('@media') || css.includes('@keyframes')) {
      keptStyles.push({ attrs, css })
      info.notes.push('style block kept (@media/@keyframes present)')
      continue
    }
    const rules = []
    let rest = css
    while (rest.trim()) {
      const brace = rest.indexOf('{')
      if (brace === -1) break
      const sel = rest.slice(0, brace).trim()
      const end = rest.indexOf('}')
      if (end === -1) break
      rules.push({ sel, body: rest.slice(brace + 1, end), raw: rest.slice(0, end + 1) })
      rest = rest.slice(end + 1)
    }
    const kept = rules.filter(r =>
      !r.sel.split(',').every(s => {
        const base = (s.trim().match(/\.([\w-]+)/) || [])[1]
        return base && SHARED_BASES.has(base)
      })
    )
    droppedRules += rules.length - kept.length
    if (kept.length) {
      keptStyles.push({ attrs, css: '\n' + kept.map(r => r.raw).join('\n') + '\n' })
      info.notes.push(`kept selectors: ${kept.map(r => r.sel).join(' | ')}`)
    }
  }
  if (droppedRules) info.notes.push(`dropped ${droppedRules} shared rules`)

  // ---- script: inject imports + components registration -------------------
  info.used.add('DocsArticle')
  const usedList = [...info.used]
  const importLine = `import { ${usedList.join(', ')} } from '@/components/docs'\n`
  const scriptMatch = src.match(/<script([^>]*)>([\s\S]*?)<\/script>/)
  let scriptBlock = ''

  if (!scriptMatch) {
    scriptBlock = `<script>\n${importLine}\nexport default {\n  name: '${basename(file, '.vue')}',\n  components: { ${usedList.join(', ')} }\n}\n</script>\n`
  } else {
    const [, attrs, body] = scriptMatch
    if (attrs.includes('setup')) {
      scriptBlock = `<script${attrs}>\n${importLine}${body.trimStart()}</script>`
    } else {
      let newBody = body
      if (/components:\s*{[^}]*}/.test(newBody)) {
        newBody = newBody.replace(/components:\s*{([^}]*)}/, (_, inner) => {
          const existing = inner.split(',').map(s => s.trim()).filter(Boolean)
          const merged = [...new Set([...existing, ...usedList])]
          return `components: { ${merged.join(', ')} }`
        })
      } else if (/export default\s*{/.test(newBody)) {
        newBody = newBody.replace(
          /export default\s*{/,
          `export default {\n  components: { ${usedList.join(', ')} },`
        )
      } else {
        info.notes.push('WARN: no export default found')
      }
      scriptBlock = `<script${attrs}>\n${importLine}${newBody.trimStart()}</script>`
    }
  }

  // ---- reassemble ---------------------------------------------------------
  const out =
    `<template>${tpl}</template>\n\n` +
    scriptBlock +
    (keptStyles.length ? '\n' + keptStyles.map(s => `<style${s.attrs}>${s.css}</style>`).join('\n\n') + '\n' : '')

  if (WRITE) writeFileSync(path, out)
  report.push(info)
}

// ---- report ---------------------------------------------------------------
for (const r of report) {
  const notes = r.notes.length ? `  -> ${r.notes.join('; ')}` : ''
  console.log(`${r.status === 'ok' ? 'OK  ' : '----'} ${r.file}${notes}`)
}
console.log(`\n${report.filter(r => r.status === 'ok').length} transformed, ${report.filter(r => r.status !== 'ok').length} skipped${WRITE ? ' (written)' : ' (dry run)'}`)
