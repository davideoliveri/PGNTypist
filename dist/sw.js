// Service Worker for Fast PGN Typist
// Change this version when deploying updates - forces cache refresh
const CACHE_VERSION = '1769335103386';
const CACHE_NAME = `pgn-typist-v${CACHE_VERSION}`;
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './logo.svg',
  './manifest.json'
];

// Install: Cache essential assets (but don't activate yet - wait for user)
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  // Don't call skipWaiting() here - let the new SW wait until user clicks refresh
});

// Activate: Clean up old caches and notify clients
self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      // Clean up old caches
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames
          .filter((name) => name.startsWith('pgn-typist-') && name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );

      // Take control of all pages immediately
      await self.clients.claim();

      // Notify all clients that an update is available
      const clients = await self.clients.matchAll({ type: 'window' });
      clients.forEach((client) => {
        client.postMessage({ type: 'SW_UPDATED', version: CACHE_VERSION });
      });
    })()
  );
});

// Fetch: Network-first for HTML, cache-first for assets
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Only handle http/https requests (skip chrome-extension://, etc.)
  if (!url.protocol.startsWith('http')) {
    return;
  }
  
  // For navigation requests (HTML pages), use network-first
  if (event.request.mode === 'navigate' || 
      event.request.destination === 'document' ||
      url.pathname.endsWith('.html') ||
      url.pathname === '/' ||
      url.pathname.endsWith('/')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Cache the fresh response
          if (response.ok) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }
          return response;
        })
        .catch(async () => {
          // Offline fallback - serve from cache
          const cachedResponse = await caches.match(event.request);
          return cachedResponse || caches.match('./index.html');
        })
    );
    return;
  }

  // For other assets (JS, CSS, images), use stale-while-revalidate
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request).then((response) => {
        if (response.ok) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      }).catch(() => cachedResponse);

      return cachedResponse || fetchPromise;
    })
  );
});

// Listen for skip waiting message from client
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
