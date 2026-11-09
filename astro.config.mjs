import { defineConfig } from 'astro/config'
import { fileURLToPath } from 'node:url'

// GitHub Pages serves the site from https://jesusdev-cup.github.io/karibase/
export default defineConfig({
  site: 'https://jesusdev-cup.github.io',
  base: '/karibase',
  markdown: {
    shikiConfig: { theme: 'github-dark' }
  },
  vite: {
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    }
  }
})
