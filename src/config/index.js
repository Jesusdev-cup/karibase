/**
 * Karibase Configuration
 * Centralized configuration for modular and scalable architecture
 * @version 2.0.0
 */
import { plugins, pluginSlugs, pluginStyles, pluginSourceStyles } from './plugins.js'
import { arcTemplates, arcTemplateSlugs, getArcTemplate, arcThemePath } from './arc-templates.js'

export { plugins, pluginSlugs, pluginStyles, pluginSourceStyles }
export { arcTemplates, arcTemplateSlugs, getArcTemplate, arcThemePath }

/**
 * Core framework stylesheets (relative to src/styles/), in cascade order.
 * Bundled downloads append every ARC theme preset and extracted plugin
 * stylesheet on top of this list.
 */
export const coreStyles = [
  'karibase-variables.css',
  'karibase-bootstrap.css',
  'karibase-reset.css',
  'karibase-base.css',
  'karibase-layout.css',
  'karibase-components.css',
  'karibase-components-extended.css',
  'karibase-components-react.css',
  'karibase-utilities.css',
  'karibase-utilities-extended.css',
  'karibase-dark-mode.css',
  'karibase-dashboard.css',
  'karibase-modern.css',
  'karibase-container-queries.css',
  'karibase-style-docs.css',
  'karibase-framework-base.css',
  'karibase-framework-preflight.css',
  'karibase-framework-theme.css',
  'karibase-theme-archeon.css',
  'karibase-theme-aureon.css',
  'karibase-theme-blogify.css',
  'karibase-theme-builder.css',
  'karibase-theme-clinic.css',
  'karibase-theme-commercecraft.css',
  'karibase-theme-dashboard.css',
  'karibase-theme-edinburgh.css',
  'karibase-theme-flexiweb.css',
  'karibase-theme-kelion.css',
  'karibase-theme-printifix.css',
  'karibase-theme-retailridge.css',
  'karibase-website.css',
  'karibase.css'
]

/**
 * Full bundle file list: core + every generated ARC kit theme + every
 * extracted plugin stylesheet (authored sources, vendor/dynamic excluded).
 * The themes/plugins @import indexes are intentionally skipped: their contents
 * are already inlined here and their relative imports would break in a bundle.
 */
export function frameworkStyles() {
  const themes = arcTemplateSlugs.map((slug) => arcThemePath(slug))
  const pluginFiles = pluginSlugs.flatMap((slug) =>
    pluginSourceStyles(slug).map((s) => s.file)
  )
  return [...coreStyles, ...themes, ...pluginFiles]
}

export const config = {
  app: {
    name: 'Karibase',
    version: '2.0.0',
    description: 'CSS Framework specialized in Admin Dashboards and Floating Bots'
  },
  
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || '/api',
    timeout: 10000
  },
  
  features: {
    adminDashboard: true,
    floatingBots: true,
    cssExtractor: true,
    darkMode: true,
    hotReload: true
  },
  
  ui: {
    theme: {
      primary: '#465fff',
      secondary: '#6c757d',
      success: '#12b76a',
      danger: '#f04438',
      warning: '#f79009',
      info: '#0ba5ec'
    },
    sidebar: {
      width: 260,
      collapsedWidth: 64
    },
    header: {
      height: 64
    }
  },
  
  floatingBot: {
    defaultPosition: 'bottom-right',
    positions: ['bottom-right', 'bottom-left', 'top-right', 'top-left'],
    animationDuration: 300,
    typingIndicator: true
  },
  
  performance: {
    lazyLoad: true,
    codeSplitting: true,
    caching: true
  }
}

export default config
