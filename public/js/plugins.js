/**
 * Third-party/plugin initialization for the docs app.
 * Side-effect imports register the globals; initPlugins() wires up instances.
 */
import './karibase-ui.js'
import './karibase-modal.js'
import './karibase-inactivity-detector.js'
import './karibase-auto-seo.js'

export function initPlugins() {
  if (typeof AutoSEO !== 'undefined') {
    window.autoSEO = new AutoSEO({
      autoGenerate: true,
      updateMeta: true,
      updateOpenGraph: true,
      updateTwitter: true,
      addStructuredData: true,
      optimizeImages: true,
      debug: false
    })
  }

  if (typeof InactivityDetector !== 'undefined') {
    window.inactivityDetector = new InactivityDetector({
      timeout: 30 * 60 * 1000, // 30 minutes
      warningTime: 5 * 60 * 1000, // 5 minutes
      autoLogout: false,
      showWarning: true,
      debug: false
    })
  }
}
