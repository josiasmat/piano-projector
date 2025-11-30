// Dynamically import cache config (production only)
let CACHE_NAME = null;
let PRECACHE_ASSETS = [];

try {
  const cacheConfig = await (async () => {
    const response = await fetch('./cache.json');
    return response.json();
  })();
  CACHE_NAME = cacheConfig.cacheName;
  PRECACHE_ASSETS = cacheConfig.precacheAssets;
} catch (error) {
  console.warn('service worker caching disabled: ', error);
}

// Install: open cache & add assets (only if cache config loaded)
self.addEventListener('install', event => {
  if (CACHE_NAME && PRECACHE_ASSETS.length > 0) {
    event.waitUntil(
      caches.open(CACHE_NAME).then(cache => cache.addAll(PRECACHE_ASSETS))
    );
  }
  self.skipWaiting();
});

// Activate: delete old caches (only if cache config loaded)
self.addEventListener('activate', event => {
  if (CACHE_NAME) {
    event.waitUntil(
      caches.keys().then(keys =>
        Promise.all(keys
          .filter(k => k !== CACHE_NAME)
          .map(k => caches.delete(k))
        )
      )
    );
  }
  self.clients.claim();
});

// Fetch: cache-first for static, network-first for navigation
self.addEventListener('fetch', event => {
  if (!CACHE_NAME) {
    // No caching in development mode
    return;
  }

  const request = event.request;

  // Navigation requests → network first
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() => caches.match('/pwa/index.html'))
    );
    return;
  }

  // For static files → cache first
  event.respondWith(
    caches.match(request).then(response =>
      response ||
      fetch(request).then(fetchRes => {
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(request, fetchRes.clone());
          return fetchRes;
        });
      })
    )
  );
});
