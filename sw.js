const CACHE_NAME = 'predger-v1';
const CACHE_VERSION = '2025-01-01';

// Files to cache for offline support
const STATIC_CACHE = [
  '/',
  '/index.html',
  '/app.js',
  '/styles.css',
  '/src/manifest.json',
  '/src/favicon.ico'
];

// CDN URLs (cache separately)
const CDN_CACHE = ['https://esm.sh/preact@10.25.4', 'https://esm.sh/uuid@11.0.3'];

// Install event - cache static assets
self.addEventListener('install', event => {
  console.log('[SW] Installing service worker...');

  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then(cache => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_CACHE);
      })
      .then(() => {
        return self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('[SW] Activating service worker...');

  event.waitUntil(
    caches
      .keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== CACHE_NAME) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache, fall back to network
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Cache-first strategy for all requests
  event.respondWith(
    caches.match(request).then(cachedResponse => {
      if (cachedResponse) {
        console.log('[SW] Serving from cache:', url.pathname);
        return cachedResponse;
      }

      // Not in cache, fetch from network
      return fetch(request)
        .then(response => {
          // Don't cache non-successful responses
          if (!response || response.status !== 200 || response.type === 'error') {
            return response;
          }

          // Clone the response (can only use it once)
          const responseToCache = response.clone();

          // Cache the fetched resource for next time
          caches.open(CACHE_NAME).then(cache => {
            // Only cache same-origin or CDN resources
            if (url.origin === location.origin || url.hostname === 'esm.sh') {
              console.log('[SW] Caching new resource:', url.href);
              cache.put(request, responseToCache);
            }
          });

          return response;
        })
        .catch(error => {
          console.error('[SW] Fetch failed:', error);
          // Could return a custom offline page here
          throw error;
        });
    })
  );
});

// Message event - allow cache updates from the app
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
