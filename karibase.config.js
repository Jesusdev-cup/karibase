/**
 * Karibase CSS Framework Configuration
 * Specialized in Admin Dashboards and Floating Bots
 *
 * plugins / arcTemplates sections are populated by the sync scripts:
 *   npm run extract:plugins  → scans wp-content/plugins, extracts CSS + inline styles
 *   npm run build:themes     → one karibase-theme-<kit>.css per ARC starter template
 *   npm run sync:plugins     → both
 *
 * @version 2.0.0
 */
export default {
  content: [
    "./src/pages/**/*",
    "./src/**/*.{astro,js,ts,jsx,tsx}",
    // ARC starter template markup (utility scanning / coverage)
    "./src/config/arc-templates.js",
    "../laragon/www/Prwebsie/wp-content/plugins/arc-starter-templates/templates/**/*.html",
  ],
  pluginsDir: process.env.PLUGINS_DIR || 'C:/laragon/www/Prwebsie/wp-content/plugins',
  pluginStyles: {
    index: './public/styles/karibase-plugins.css',
    outDir: './public/styles/plugins',
    registry: './src/config/plugins.js',
  },
  arcTemplates: {
    outDir: './public/styles/themes',
    index: './public/styles/themes/index.css',
    registry: './src/config/arc-templates.js',
  },
  theme: {
    extend: {
      colors: {
        karibase: {
          primary: '#465fff',
          secondary: '#6c757d',
          success: '#12b76a',
          danger: '#f04438',
          warning: '#f79009',
          info: '#0ba5ec',
        },
        admin: {
          sidebar: '#1e293b',
          sidebarDark: '#0f172a',
          header: '#ffffff',
          headerDark: '#1e293b',
          content: '#f8fafc',
          contentDark: '#0f172a',
          card: '#ffffff',
          cardDark: '#1e293b',
          border: '#e2e8f0',
          borderDark: '#334155',
        },
        bot: {
          primary: '#465fff',
          secondary: '#6c757d',
          success: '#12b76a',
          bubble: '#f1f5f9',
          bubbleDark: '#334155',
          bubbleBot: '#465fff',
          bubbleUser: '#6366f1',
        }
      },
      fontFamily: {
        sans: ['Outfit', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      spacing: {
        'sidebar': '260px',
        'sidebar-collapsed': '64px',
        'header': '64px',
      },
      boxShadow: {
        'sidebar': '0 0 20px rgba(0, 0, 0, 0.1)',
        'card': '0 1px 3px rgba(0, 0, 0, 0.1)',
        'card-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        'bot': '0 4px 20px rgba(0, 0, 0, 0.15)',
        'bot-lg': '0 8px 30px rgba(0, 0, 0, 0.2)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
        'slide-in': 'slideIn 0.3s ease-out',
        'slide-out': 'slideOut 0.3s ease-in',
        'fade-in': 'fadeIn 0.3s ease-out',
        'fade-out': 'fadeOut 0.3s ease-in',
      },
      keyframes: {
        slideIn: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideOut: {
          '0%': { transform: 'translateX(0)', opacity: '1' },
          '100%': { transform: 'translateX(100%)', opacity: '0' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
      },
    },
  },
  plugins: [],
}
