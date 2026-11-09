# Karibase CSS Framework

CSS Framework specialized in Admin Dashboards and Floating Bots. Complete solution for building modern admin panels with intelligent floating assistants.

**Creado por jesus cupello** 🎓

## Overview

Karibase is a specialized CSS framework focused on building admin dashboards and SaaS applications with integrated floating bot assistants. **Works with CSS and JavaScript files only - no npm or build tools required.**

- **Admin Dashboard Components**: Complete set of UI components for admin panels
- **Floating Bots System**: JavaScript framework for intelligent floating assistants and chatbots
- **Dashboard Layout System**: Grid, sidebar, header, and content layouts
- **Interactive Components**: Charts, tables, forms, modals, and more
- **Developer Tools**: CSS extractor, theme customizer, and bot builder
- **Documentation**: Interactive documentation with live examples

## Features

- 🎨 **Admin Dashboard Components**: 50+ components specifically designed for admin panels
- 🤖 **Floating Bots System**: Intelligent floating assistants and chatbot framework
- 🌓 **Dark Mode Support**: Built-in dark mode with smooth transitions
- 📱 **Responsive Design**: Mobile-first approach with breakpoint system
- 🎭 **12+ Theme Presets**: RetailRidge, CommerceCraft, Blogify, Flexiweb, Edinburgh, and more
- 🔧 **CSS Variables**: Full customization via CSS custom properties
- 🌍 **RTL Support**: Right-to-left language support
- ♿ **Accessibility**: WCAG 2.1 compliant components
- 📊 **Dashboard Layouts**: Sidebar, header, grid, and content layouts
- 💬 **Chat Components**: Message bubbles, input fields, and typing indicators
- 🎨 **UCLA Branding**: Official UCLA colors (Blue #2774AE, Gold #FFD100)
- ✅ **CSS/JS Only**: No npm, no build tools, just link and use
- 🔍 **Auto SEO**: Built-in SEO optimization for any website
- 🛡️ **Form Validation**: Maximum validation system for all forms
- ⏰ **Inactivity Detector**: User activity monitoring and auto-logout

## Installation (CSS/JS Files Only)

Karibase works with plain CSS and JavaScript files. No npm, no build tools, no framework dependencies.

### Method 1: Direct File Link

1. Download the framework files:
   - `karibase.css` - Complete CSS framework
   - `karibase.js` - JavaScript components and utilities

2. Link the files in your HTML:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your App</title>
    <link rel="stylesheet" href="path/to/karibase.css">
</head>
<body>
    <!-- Your content here -->
    <script src="path/to/karibase.js"></script>
</body>
</html>
```

### Method 2: CDN (Coming Soon)

```html
<link rel="stylesheet" href="https://cdn.karibase.dev/karibase.css">
<script src="https://cdn.karibase.dev/karibase.js"></script>
```

### Method 3: Download from Documentation

Visit the documentation site and use the download buttons to get the latest CSS and JS files.

## Quick Start

### Basic Dashboard Layout

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Dashboard</title>
    <link rel="stylesheet" href="karibase.css">
</head>
<body>
    <div class="kb-dashboard">
        <header class="kb-header">
            <div class="kb-logo">My App</div>
            <nav class="kb-nav">
                <a href="#" class="kb-nav-link">Dashboard</a>
                <a href="#" class="kb-nav-link">Settings</a>
            </nav>
        </header>
        
        <div class="kb-layout">
            <aside class="kb-sidebar">
                <ul class="kb-sidebar-menu">
                    <li><a href="#" class="kb-sidebar-link active">Overview</a></li>
                    <li><a href="#" class="kb-sidebar-link">Analytics</a></li>
                    <li><a href="#" class="kb-sidebar-link">Users</a></li>
                </ul>
            </aside>
            
            <main class="kb-content">
                <h1 class="kb-heading">Dashboard</h1>
                <div class="kb-grid kb-grid-3">
                    <div class="kb-card">
                        <h3 class="kb-card-title">Total Users</h3>
                        <p class="kb-card-text">1,234</p>
                    </div>
                    <div class="kb-card">
                        <h3 class="kb-card-title">Revenue</h3>
                        <p class="kb-card-text">$45,678</p>
                    </div>
                    <div class="kb-card">
                        <h3 class="kb-card-title">Active Sessions</h3>
                        <p class="kb-card-text">89</p>
                    </div>
                </div>
            </main>
        </div>
    </div>
    
    <script src="karibase.js"></script>
</body>
</html>
```

### Floating Bot Integration

```html
<!-- Add floating bot to any page -->
<div class="kb-floating-bot" id="my-bot">
    <div class="kb-bot-header">
        <div class="kb-bot-avatar">
            <i class="fas fa-robot"></i>
        </div>
        <div class="kb-bot-title">Assistant</div>
    </div>
    <div class="kb-bot-messages">
        <div class="kb-bot-message kb-bot-message-incoming">
            Hello! How can I help you?
        </div>
    </div>
    <div class="kb-bot-input">
        <input type="text" class="kb-bot-input-field" placeholder="Type a message...">
        <button class="kb-bot-send-btn">
            <i class="fas fa-paper-plane"></i>
        </button>
    </div>
</div>

<script>
// Initialize floating bot
const bot = new KaribaseBot('#my-bot', {
    position: 'bottom-right',
    theme: 'ucla',
    autoOpen: false
});
</script>
```

## UCLA Branding

Karibase uses official UCLA colors:

- **UCLA Blue**: `#2774AE`
- **UCLA Gold**: `#FFD100`

These colors are applied throughout the framework for buttons, links, highlights, and interactive elements.

## Responsive Design

Karibase is fully responsive with the following breakpoints:

- Mobile: `< 768px`
- Tablet: `768px - 1024px`
- Desktop: `> 1024px`

All components automatically adapt to different screen sizes.

## JavaScript Components

### Modal System
```javascript
const modal = new KaribaseModal({
    title: 'Confirm Action',
    content: 'Are you sure you want to proceed?',
    onConfirm: () => console.log('Confirmed')
});
```

### Inactivity Detector
```javascript
const detector = new InactivityDetector({
    timeout: 30 * 60 * 1000, // 30 minutes
    warningTime: 5 * 60 * 1000, // 5 minutes
    autoLogout: true,
    onLogout: () => window.location.href = '/logout'
});
```

### Auto SEO
```javascript
const seo = new AutoSEO({
    title: 'Your Page Title',
    description: 'Your page description',
    keywords: 'your, keywords, here',
    autoGenerate: true
});
```

## Customization

### Colors

Override CSS variables to customize the framework:

```css
:root {
    --kb-primary-color: #2774AE;  /* UCLA Blue */
    --kb-secondary-color: #FFD100; /* UCLA Gold */
    --kb-text-color: #1a1a1a;
    --kb-bg-color: #ffffff;
    --kb-border-color: #e5e5e5;
}
```

### Typography

```css
:root {
    --kb-font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    --kb-font-size-base: 16px;
    --kb-font-size-lg: 18px;
    --kb-font-size-sm: 14px;
}
```

## WordPress Plugin Sync

Karibase can absorb the styles of the team's WordPress plugins without
modifying them (read-only extraction):

```bash
npm run sync:plugins     # one command: extraction + theme generation
npm run extract:plugins  # copies plugin CSS + inline <style> blocks
npm run build:themes     # one theme per ARC Starter Templates kit
```

Point `PLUGINS_DIR` at another plugins folder if needed
(default: `C:/laragon/www/Prwebsie/wp-content/plugins`).

**Output**

```
src/
└── config/
    ├── plugins.js / .json        # plugin → stylesheets registry
    └── arc-templates.js / .json  # resolved tokens per template kit
public/styles/
├── karibase-plugins.css          # @import index of all plugin styles
├── plugins/<plugin>/...          # extracted CSS, mirrored structure
└── themes/karibase-theme-<kit>.css  # 21 ARC theme presets
```

Theme presets mirror `Arc_ST_Templates::design_system()` token resolution
(kit meta → template `@theme` vars → UCLA defaults). Apply with
`.kb-<kit>-theme` (or `.arc-tpl-<kit>` in WP) and use the `.kb-<kit>-*`
components: `nav`, `hero`, `grid`, `card`, `stats`, `cta`, `footer`,
`btn-primary`, `btn-accent`, `btn-outline`.

**WordPress helpers**

```php
karibase_enqueue_theme( 'nomad' );              // one ARC kit theme
karibase_enqueue_plugin_styles( 'ix-projects' ); // all extracted plugin CSS
```

## Docs site (Astro)

The documentation site and landing page are built with
[Astro](https://astro.build) — no frontend framework, static output:

```bash
npm install
npm run dev        # astro dev server
npm run build      # build:css + astro build → dist/
npm run preview    # serve the production build locally
npm run build:css  # rebuild public/css/karibase.css from public/styles/
```

The site deploys to GitHub Pages automatically on every push to `main`
(`.github/workflows/deploy.yml`) at `https://jesusdev-cup.github.io/karibase/`.

## File Structure

```
karibase/
├── public/
│   ├── logo.svg              # Karibase brand logo
│   ├── css-extractor.html    # CSS extraction tool
│   ├── css/karibase.css      # Built framework bundle (generated)
│   ├── styles/               # CSS framework source files
│   │   ├── karibase.css      # @import entry point
│   │   ├── karibase-plugins.css  # All plugin styles (generated)
│   │   ├── plugins/          # Extracted plugin styles (generated)
│   │   └── themes/           # ARC kit themes (generated)
│   └── js/                   # JavaScript components
│       ├── karibase.min.js   # Framework JS bundle
│       ├── karibase-ui.js    # Core UI components
│       ├── karibase-modal.js # Modal system
│       ├── karibase-inactivity-detector.js
│       └── karibase-auto-seo.js
├── src/
│   ├── config/               # Generated registries + app config
│   │   ├── index.js
│   │   ├── navigation.js     # Docs sidebar/routes registry
│   │   ├── plugins.js        # plugin styles registry (generated)
│   │   └── arc-templates.js  # ARC kit tokens registry (generated)
│   ├── pages/                # Astro docs pages (one per docs entry)
│   ├── layouts/              # Base + DocsLayout shells
│   ├── components/           # Docs UI components (.astro)
│   └── styles/global.css     # Site chrome styles
├── scripts/
│   └── convert.mjs           # Legacy Vue views → Astro converter
├── extract-plugin-styles.js  # Plugin CSS/inline-style extractor
├── build-arc-themes.js       # ARC kit theme generator
├── build-css.js              # PostCSS framework bundle build
├── astro.config.mjs
├── package.json
└── README.md
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

MIT

## Support

For issues and questions, visit the Karibase documentation site or GitHub repository.

---

**Built with ❤️ by a UCLA Graduate**
