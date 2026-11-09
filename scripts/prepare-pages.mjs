/**
 * Prepares dist/ for GitHub Pages:
 *  - copies index.html -> 404.html so the SPA router works on
 *    direct navigation / refresh of deep links (Pages serves
 *    404.html for unknown paths, the router then resolves it)
 * Usage: node scripts/prepare-pages.mjs   (run after `vite build`)
 */
import { copyFileSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const dist = fileURLToPath(new URL('../dist', import.meta.url))
const indexHtml = `${dist}/index.html`

if (!existsSync(indexHtml)) {
  console.error('dist/index.html not found — run `npm run build` first')
  process.exit(1)
}

copyFileSync(indexHtml, `${dist}/404.html`)
console.log('dist/404.html created (SPA fallback for GitHub Pages)')
