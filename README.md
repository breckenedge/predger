# Predger

A build-free Preact-based single-page app to track spending. All data is stored in localStorage. Uses service workers for offline functionality.

## 🚀 Modern Architecture (2025)

This app has been completely modernized to work **without any build step**:

- ✅ **Zero build tools** - No webpack, no babel, no bundlers
- ✅ **Native ES modules** - Uses browser-native import/export
- ✅ **CDN dependencies** - Import maps load Preact from esm.sh
- ✅ **Modern Preact 10** - Functional components with hooks
- ✅ **Direct `h()` calls** - No JSX, no HTM, just Preact's hyperscript
- ✅ **PWA ready** - Service worker for offline support
- ✅ **Instant development** - Edit files and refresh, no compilation

## 📋 Prerequisites

- A modern browser with ES module support (Chrome 89+, Firefox 89+, Safari 15+, Edge 89+)
- Node.js 18+ (only for running the development server)

## 🏃 Getting Started

```sh
# Start the development server
npm start

# Or use npm run dev (same thing)
npm run dev
```

Then open http://localhost:8080 in your browser.

That's it! No build step, no compilation. Just edit files and refresh.

## 📁 Project Structure

```
/
├── index.html          # Entry point with import maps
├── app.js              # Main application (ES module)
├── sw.js               # Service worker for PWA
├── styles.css          # Plain CSS styles
├── package.json        # Minimal config (just dev tools)
├── src/
│   ├── assets/        # Icons and images
│   ├── manifest.json  # PWA manifest
│   ├── favicon.ico    # Favicon
│   └── main.manifest  # App cache manifest (legacy)
├── eslint.config.js   # ESLint configuration
└── .prettierrc        # Prettier configuration
```

## 🛠️ Development

### Hot Reloading

The serve package provides basic static file serving. For live reload during development, you can use any static server with live reload capability:

```sh
# Using live-server (install globally: npm i -g live-server)
live-server . --port=8080

# Or browser-sync
npx browser-sync start --server --files "*.js,*.css,*.html"
```

### Code Quality

```sh
# Run ESLint
npm run lint

# Format code with Prettier
npm run format
```

## 🌐 How It Works

### Import Maps

The app uses [import maps](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script/type/importmap) to alias CDN URLs:

```javascript
import { h, render } from 'preact';          // → https://esm.sh/preact@10.25.4
import { useState } from 'preact/hooks';     // → https://esm.sh/preact@10.25.4/hooks
import { v4 } from 'uuid';                   // → https://esm.sh/uuid@11.0.3
```

No bundler needed - the browser resolves these imports natively!

### Hyperscript (h) Instead of JSX

Instead of JSX, we use Preact's `h()` function directly:

```javascript
// Instead of: <div className="title">Hello</div>
h('div', { className: 'title' }, 'Hello')

// Nested elements:
h('form', { onSubmit: handler },
  h('input', { type: 'text', value: val }),
  h('button', null, 'Submit')
)
```

More verbose than JSX, but completely transparent and build-free!

### Service Worker

The app registers a service worker for offline functionality. It uses a cache-first strategy for all assets.

## 📦 Deployment

To deploy, simply copy all files to any static host:

```sh
# Copy to your static host (Netlify, Vercel, GitHub Pages, etc.)
# No build step needed!

# Example for GitHub Pages:
git push origin main

# Or just upload these files to any web server
```

The app works entirely client-side, so any static file host will work.

## 🔧 Technologies

- **Preact 10** - Fast 3kb React alternative
- **Native ES Modules** - No bundler required
- **Import Maps** - Native dependency management
- **Service Workers** - PWA & offline support
- **LocalStorage** - Client-side data persistence
- **ESLint + Prettier** - Code quality tools

## 📝 Browser Support

This app requires a modern browser with:
- ES2022+ JavaScript support
- ES modules (`import`/`export`)
- Import maps
- Service workers (optional, for offline)

Supported browsers:
- Chrome/Edge 89+
- Firefox 89+
- Safari 15+

## 🎯 Features

- ✅ Add/remove spending items
- ✅ Categorize expenses
- ✅ Real-time total calculation
- ✅ Data persists in localStorage
- ✅ Works offline (PWA)
- ✅ Mobile-friendly
- ✅ Zero dependencies to install

## 📜 License

MIT

## 👤 Author

Aaron Breckenridge <aaronbreckenridge@gmail.com>

---

**Note**: This project was originally based on the [preact-boilerplate](https://github.com/developit/preact-boilerplate) project but has been completely modernized to eliminate all build tools and use native browser capabilities.
