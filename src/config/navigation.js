/**
 * Karibase Navigation & Pages Registry
 * Single source of truth for the docs sidebar and the router.
 *
 * Each page: { name, path, view }
 *   - name: label shown in the sidebar
 *   - path: route path
 *   - view: file name (without .vue) inside src/views/
 *
 * To add a docs page: drop the .vue file in src/views/ and add one
 * entry under the right section — route + sidebar update automatically.
 */

export const navSections = [
  {
    title: 'Getting Started',
    items: [
      { name: 'Getting Started', path: '/getting-started', view: 'GettingStarted' },
      { name: 'Download', path: '/download', view: 'Download' },
      { name: 'Contents', path: '/contents', view: 'Contents' },
      { name: 'Browsers & devices', path: '/browsers-devices', view: 'BrowsersDevices' },
      { name: 'JavaScript', path: '/javascript', view: 'JavaScript' },
      { name: 'Webpack', path: '/webpack', view: 'Webpack' },
      { name: 'Parcel', path: '/parcel', view: 'Parcel' },
      { name: 'Vite', path: '/vite', view: 'Vite' },
      { name: 'Accessibility', path: '/accessibility', view: 'Accessibility' },
      { name: 'RFS', path: '/rfs', view: 'RFS' },
      { name: 'RTL', path: '/rtl', view: 'RTL' },
      { name: 'Contribute', path: '/contribute', view: 'Contribute' }
    ]
  },
  {
    title: 'Customize',
    items: [
      { name: 'Overview', path: '/customize', view: 'CustomizeOverview' },
      { name: 'Sass', path: '/customize/sass', view: 'CustomizeSass' },
      { name: 'Options', path: '/customize/options', view: 'CustomizeOptions' },
      { name: 'Color', path: '/customize/color', view: 'CustomizeColor' },
      { name: 'Color modes', path: '/customize/color-modes', view: 'CustomizeColorModes' },
      { name: 'Components', path: '/customize/components', view: 'CustomizeComponents' },
      { name: 'CSS variables', path: '/customize/css-variables', view: 'CustomizeCSSVariables' },
      { name: 'Optimize', path: '/customize/optimize', view: 'CustomizeOptimize' }
    ]
  },
  {
    title: 'Layout',
    items: [
      { name: 'Breakpoints', path: '/layout/breakpoints', view: 'LayoutBreakpoints' },
      { name: 'Containers', path: '/layout/containers', view: 'LayoutContainers' },
      { name: 'Grid', path: '/layout/grid', view: 'LayoutGrid' },
      { name: 'Columns', path: '/layout/columns', view: 'LayoutColumns' },
      { name: 'Gutters', path: '/layout/gutters', view: 'LayoutGutters' },
      { name: 'Utilities', path: '/layout/utilities', view: 'LayoutUtilities' },
      { name: 'Z-index', path: '/layout/z-index', view: 'LayoutZIndex' },
      { name: 'CSS Grid', path: '/layout/css-grid', view: 'LayoutCSSGrid' }
    ]
  },
  {
    title: 'Content',
    items: [
      { name: 'Reboot', path: '/content/reboot', view: 'ContentReboot' },
      { name: 'Typography', path: '/content/typography', view: 'ContentTypography' },
      { name: 'Images', path: '/content/images', view: 'ContentImages' },
      { name: 'Tables', path: '/content/tables', view: 'ContentTables' },
      { name: 'Figures', path: '/content/figures', view: 'ContentFigures' }
    ]
  },
  {
    title: 'Forms',
    items: [
      { name: 'Overview', path: '/forms', view: 'FormsOverview' },
      { name: 'Form control', path: '/forms/form-control', view: 'FormsFormControl' },
      { name: 'Select', path: '/forms/select', view: 'FormsSelect' },
      { name: 'Checks & radios', path: '/forms/checks-radios', view: 'FormsChecksRadios' },
      { name: 'Range', path: '/forms/range', view: 'FormsRange' },
      { name: 'Input group', path: '/forms/input-group', view: 'FormsInputGroup' },
      { name: 'Floating labels', path: '/forms/floating-labels', view: 'FormsFloatingLabels' },
      { name: 'Layout', path: '/forms/layout', view: 'FormsLayout' },
      { name: 'Validation', path: '/forms/validation', view: 'FormsValidation' }
    ]
  },
  {
    title: 'Components',
    items: [
      { name: 'Overview', path: '/components', view: 'Components' },
      { name: 'Buttons', path: '/components/buttons', view: 'Buttons' },
      { name: 'Cards', path: '/components/cards', view: 'Cards' },
      { name: 'Forms', path: '/components/forms', view: 'Forms' },
      { name: 'Tables', path: '/components/tables', view: 'Tables' },
      { name: 'Navigation', path: '/components/navigation', view: 'Navigation' },
      { name: 'Modals', path: '/components/modals', view: 'Modals' },
      { name: 'Alerts', path: '/components/alerts', view: 'Alerts' },
      { name: 'Charts', path: '/components/charts', view: 'Charts' },
      { name: 'Badges', path: '/components/badges', view: 'Badges' },
      { name: 'Avatars', path: '/components/avatars', view: 'Avatars' },
      { name: 'Dropdowns', path: '/components/dropdowns', view: 'Dropdowns' },
      { name: 'Tooltips', path: '/components/tooltips', view: 'Tooltips' },
      { name: 'Floating Bots ⭐', path: '/components/floating-bots', view: 'FloatingBots' }
    ]
  },
  {
    title: 'Examples',
    items: [
      { name: 'Login Examples', path: '/login-examples', view: 'LoginExamples' }
    ]
  },
  {
    title: 'Layout (Legacy)',
    items: [
      { name: 'Grid System', path: '/layout', view: 'Layout' }
    ]
  },
  {
    title: 'Utilities (Legacy)',
    items: [
      { name: 'Overview', path: '/utilities', view: 'Utilities' }
    ]
  },
  {
    title: 'Advanced (Legacy)',
    items: [
      { name: 'Theming', path: '/theming', view: 'Theming' }
    ]
  },
  {
    title: 'Tools (Legacy)',
    items: [
      { name: 'Tools', path: '/tools', view: 'Tools' }
    ]
  }
]

// Pages with a route but no sidebar entry
export const standalonePages = [
  { name: 'Home', path: '/', view: 'Home' },
  { name: 'Introduction', path: '/introduction', view: 'Introduction' },
  { name: 'Installation', path: '/installation', view: 'Installation' },
  { name: 'QuickStart', path: '/quick-start', view: 'QuickStart' },
  { name: 'CSSExtractor', path: '/tools/css-extractor', view: 'CSSExtractor' }
]

// Flat ordered list of every navigable docs page (sidebar pages only)
export const navPages = navSections.flatMap(section => section.items)
