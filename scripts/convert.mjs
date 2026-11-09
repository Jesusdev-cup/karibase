#!/usr/bin/env node
/**
 * Converts karibase Vue docs views (../karibase/src/views/*.vue) into
 * Astro pages (src/pages/**). Re-run only while iterating on the port —
 * hand-edited pages are listed in SKIP.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { navSections, standalonePages } from '../src/config/navigation.js'

const ROOT = path.dirname(fileURLToPath(import.meta.url))
const VIEWS = path.resolve(ROOT, '../../karibase/src/views')
const PAGES = path.resolve(ROOT, '../src/pages')

const SKIP = new Set(['Home']) // replaced by the new astro.build-style landing

const routes = [
  ...standalonePages,
  ...navSections.flatMap((s) => s.items)
]

const decode = (s) =>
  s
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&')

const lit = (s) => `\`${s.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${')}\``

const VUE_RE = /\b(ref|computed|reactive|onMounted|onUnmounted|watch|watchEffect|defineProps|defineEmits|useRoute|useRouter|nextTick)\b/

let flagged = []

function splitSfc(src) {
  const scriptStart = src.indexOf('<script')
  const tplEnd = scriptStart > -1 ? src.lastIndexOf('</template>', scriptStart) : -1
  const template = src.slice(src.indexOf('<template>') + 10, tplEnd)

  let script = ''
  let setup = false
  if (scriptStart > -1) {
    const tagEnd = src.indexOf('>', scriptStart)
    setup = src.slice(scriptStart, tagEnd).includes('setup')
    script = src.slice(tagEnd + 1, src.indexOf('</script>', tagEnd))
  }

  const rest = scriptStart > -1 ? src.slice(src.indexOf('</script>', scriptStart) + 9) : ''
  const styles = [...rest.matchAll(/<style([^>]*)>([\s\S]*?)<\/style>/g)].map((m) => ({
    scoped: m[1].includes('scoped'),
    css: m[2]
  }))

  return { template, script, setup, styles }
}

function transformTemplate(tpl, name) {
  let t = tpl

  // Extract code samples into placeholders first so markup transforms
  // never touch the example source
  const blocks = []
  const stash = (s) => `%%KB_BLOCK_${blocks.push(s) - 1}%%`

  // <template #slot> inside DocsExample -> CodeBlock with named slot
  t = t.replace(/<template #(\w+)>([\s\S]*?)<\/template>/g, (_, slot, inner) => {
    const code = decode(inner.trim())
    return stash(`<CodeBlock slot="${slot}" code={${lit(code)}} />`)
  })

  // CodeViewer -> CodeBlock
  t = t.replace(/<CodeViewer([^>]*)>([\s\S]*?)<\/CodeViewer>/g, (_, attrs, inner) => {
    const code = decode(inner.trim())
    const title = /title="([^"]*)"/.exec(attrs)?.[1]
    const bound = /:title="([^"]*)"/.exec(attrs)?.[1]
    const titleAttr = title ? ` title="${title}"` : bound ? ` title={${bound}}` : ''
    return stash(`<CodeBlock${titleAttr} code={${lit(code)}} />`)
  })

  // <div class="docs-code-block"><pre><code>…</code></pre></div> -> CodeBlock
  t = t.replace(
    /<div class="docs-code-block">\s*<pre><code>([\s\S]*?)<\/code><\/pre>\s*<\/div>/g,
    (_, inner) => stash(`<CodeBlock code={${lit(decode(inner.trim()))}} />`)
  )

  // router-link -> a
  t = t.replace(/<router-link/g, '<a').replace(/<\/router-link>/g, '</a>')
  t = t.replace(/\s:to="([^"]*)"/g, ' href={$1}')
  t = t.replace(/\s:to=\{([^}]*)\}/g, ' href={$1}')
  t = t.replace(/<a\s+to="([^"]*)"/g, '<a href="$1"')

  // hover-driven visibility (@mouseenter/@mouseleave -> delegated hover handlers)
  t = t.replace(/@mouseenter(\.\w+)*="(\w+)\s*=\s*true"/g, 'data-kb-hover-on="$2"')
  t = t.replace(/@mouseleave(\.\w+)*="(\w+)\s*=\s*false"/g, 'data-kb-hover-off="$2"')

  // events
  t = t.replace(/@(\w+)(\.\w+)*="([^"]*)"/g, (m, ev, _mods, expr) => {
    const e = expr.trim()
    let mm
    if (ev === 'click' && (mm = e.match(/^(\w+)\s*=\s*!?\1\s*$/))) {
      return `data-kb-toggle="${mm[1]}"`
    }
    if (ev === 'click' && (mm = e.match(/^(\w+)\s*=\s*true$/))) {
      return `data-kb-show="${mm[1]}"`
    }
    if (ev === 'click' && (mm = e.match(/^(\w+)\s*=\s*false$/))) {
      return `data-kb-hide="${mm[1]}" data-kb-close`
    }
    flagged.push(`${name}: @${ev}="${e}"`)
    return `data-action="${e.replace(/"/g, '&quot;')}"`
  })

  // conditional display -> hidden toggle targets
  t = t.replace(/\sv-if="([^"]*)"/g, ' data-kb-target="$1" hidden')
  t = t.replace(/\sv-show="([^"]*)"/g, ' data-kb-target="$1" hidden')
  if (/\sv-else/.test(t)) flagged.push(`${name}: v-else present`)
  t = t.replace(/\sv-else(-if="[^"]*")?/g, ' data-kb-else')

  // moustaches -> expressions (runs before bound attrs so {{ obj }} props keep their braces)
  t = t.replace(/\{\{\s*([^}]+?)\s*\}\}/g, '{$1}')

  // :class="{ 'cls': var }" pairs -> data-kb-class (toggled client-side)
  t = t.replace(/\s:class="([^"]*)"/g, (m, expr) => {
    const pairs = [...expr.matchAll(/'([^']+)'\s*:\s*([A-Za-z_$][\w$]*)/g)]
    const residue = expr
      .replace(/'[^']+'\s*:\s*[A-Za-z_$][\w$]*/g, '')
      .replace(/[{}\s,&gt;=&lt;]/g, '')
    if (pairs.length && residue === '') {
      return ` data-kb-class="${pairs.map((p) => `${p[2]}:${p[1]}`).join(' ')}"`
    }
    flagged.push(`${name}: :class="${expr.replace(/"/g, '&quot;')}"`)
    return ''
  })

  // v-model -> native name attr (pages needing real two-way binding get hand-fixed)
  t = t.replace(/\sv-model(\.\w+)*="([^"]*)"/g, (_, _m, path) => {
    const field = path.split('.').pop()
    flagged.push(`${name}: v-model="${path}"`)
    return ` name="${field}"`
  })

  // bound attributes -> Astro expressions
  t = t.replace(/\s:key="[^"]*"/g, '')
  t = t.replace(/\s:([a-zA-Z][\w-]*)="([^"]*)"/g, ' $1={$2}')
  t = t.replace(/\sv-bind:/g, ' :')

  // escape stray { } inside any remaining <code>/<pre> text
  t = t.replace(/<(pre|code)([^>]*)>([\s\S]*?)<\/\1>/g, (m, tag, attrs, inner) => {
    return `<${tag}${attrs}>${inner.replace(/\{/g, '&#123;').replace(/\}/g, '&#125;')}</${tag}>`
  })

  // leftover Vue directives
  const leftovers = t.match(/\s(v-[a-z-]+|@[\w.]+)="[^"]*"/g)
  if (leftovers) flagged.push(`${name}: leftover ${leftovers.join(', ')}`)

  // restore code samples
  t = t.replace(/%%KB_BLOCK_(\d+)%%/g, (_, i) => blocks[+i])

  return t
}

function convert(name, routePath) {
  const file = path.join(VIEWS, `${name}.vue`)
  const { template, script, setup, styles } = splitSfc(readFileSync(file, 'utf8'))

  let body = transformTemplate(template, name)

  const used = []
  for (const c of ['DocsArticle', 'DocsExample', 'DocsSection', 'CodeBlock', 'Fragment']) {
    if (new RegExp(`<${c}[\\s>/]`).test(body) || (c === 'Fragment' && /<Fragment/.test(body))) {
      if (c !== 'CodeBlock' || /<CodeBlock[\s/>]/.test(body)) used.push(c)
    }
  }

  // frontmatter: non-vue script-setup statements survive; options-api scripts are dropped
  let fm = ''
  if (setup && script.trim()) {
    const lines = script
      .split('\n')
      .filter((l) => !/^\s*import\s/.test(l) && !/^\s*\/\//.test(l))
      .join('\n')
      .trim()
    if (VUE_RE.test(lines)) {
      flagged.push(`${name}: script setup uses Vue APIs — dropped, port manually`)
    } else if (lines && !/export default/.test(lines)) {
      fm = lines
    } else if (/export default/.test(lines)) {
      flagged.push(`${name}: options-api script — dropped, check manually`)
    } else {
      fm = lines
    }
  } else if (script.trim() && !/export default/.test(script)) {
    fm = script.trim()
  } else if (script.trim()) {
    flagged.push(`${name}: options-api script — dropped, check manually`)
  }

  // keep non-component imports from the script (config, utils)
  const extraImports = [...script.matchAll(/import\s+([^'"]+)from\s+['"]([^'"]+)['"]/g)]
    .filter((m) => !m[2].endsWith('.vue') && !m[2].includes('vue') && !m[2].includes('components'))
    .map((m) => `import ${m[1].trim()} from '${m[2].replace(/\.vue$/, '')}'`)

  const depth = routePath.split('/').filter(Boolean).length
  const rel = '../'.repeat(depth + 1)

  const componentImports = [
    `import DocsLayout from '${rel}layouts/DocsLayout.astro'`,
    ...used
      .filter((c) => c !== 'Fragment')
      .map((c) => `import ${c} from '${rel}components/${c}.astro'`),
    ...(used.includes('Fragment') ? [`import { Fragment } from 'astro:components'`] : [])
  ]

  const titleMatch = /title="([^"]*)"/.exec(body)
  const pageTitle = titleMatch ? `${titleMatch[1]} — Karibase` : 'Karibase'

  const styleBlocks = styles
    .map((s) => `<style${s.scoped ? '' : ' is:global'}>${s.css}</style>`)
    .join('\n')

  const out = `---
${componentImports.join('\n')}
${extraImports.join('\n')}
${fm ? `\n${fm}\n` : ''}
---

<DocsLayout title="${pageTitle.replace(/"/g, '&quot;')}">
${body.trim()}
</DocsLayout>
${styleBlocks}
`

  const dir = routePath === '/' ? PAGES : path.join(PAGES, routePath.replace(/^\//, ''))
  mkdirSync(dir, { recursive: true })
  const filePath = path.join(dir, 'index.astro')
  writeFileSync(filePath, out)
  console.log(`✓ ${routePath}  <-  ${name}.vue`)
}

for (const r of routes) {
  if (SKIP.has(r.view)) {
    console.log(`– ${r.path} (${r.view}) skipped — hand-written`)
    continue
  }
  convert(r.view, r.path)
}

if (flagged.length) {
  console.log('\n⚠ Needs manual review:')
  flagged.forEach((f) => console.log('  - ' + f))
}
