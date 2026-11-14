/**
 * SmartKisan Service Worker - Offline Field Caching & Progressive Web App
 * Ensures seamless offline operation in rural agricultural belts with intermittent cellular coverage.
 */

const CACHE_NAME = 'smartkisan-pwa-v1.3';
const ASSETS_TO_CACHE = [
  './',
  'index.html',
  'manifest.json',
  'css/style.css',
  'js/config.js',
  'js/i18n.js',
  'js/api.js',
  'js/auth.js',
  'js/weather.js',
  'js/socket.js',
  'js/router.js',
  'js/app.js',
  'js/views/loginView.js',
  'js/views/registerView.js',
  'js/views/dashboardView.js',
  'js/views/pumpsView.js',
  'js/views/fieldsView.js',
  'js/views/schedulesView.js',
  'js/views/sensorsView.js',
  'js/views/aiAdvisoryView.js',
  'js/views/reportsView.js',
  'icons/icon-192.png',
  'icons/icon-512.png'
];

// Install: Cache essential platform shell assets
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    }).catch((err) => {
      console.warn('PWA Asset caching non-fatal error:', err);
    })
  );
});

// Activate: Clean up older cache versions
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch: Network-First with Cache Fallback for maximum freshness & offline reliability
self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Bypass cross-origin API calls like Open-Meteo or custom backends (they handle their own caching)
  if (url.origin !== self.location.origin) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        // Clone and store fresh copy in cache
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(async () => {
        // Network unavailable: retrieve from offline cache
        const cachedResponse = await caches.match(event.request);
        if (cachedResponse) {
          return cachedResponse;
        }

        // Fallback to index.html for SPA client-side routing
        if (event.request.mode === 'navigate') {
          return caches.match('./') || caches.match('index.html');
        }
      })
  );
});
