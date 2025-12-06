// production service worker template
const CACHE_NAME = "pp-3df3ef4e67539f1f";
const PRECACHE_ASSETS = [
  "./",
  "index.html",
  "bundle.js",
  "bundle.css",
  "manifest.json",
  "assets/font/orbitron.woff2",
  "assets/icon/favicon-192.png",
  "assets/icon/favicon-512.png",
  "assets/icon/favicon.png",
  "assets/icon/favicon.svg",
  "assets/sf/organ.sf2",
  "assets/shoelace/assets/icons/arrow-counterclockwise.svg",
  "assets/shoelace/assets/icons/arrow-down-up.svg",
  "assets/shoelace/assets/icons/ban.svg",
  "assets/shoelace/assets/icons/chevron-down.svg",
  "assets/shoelace/assets/icons/chevron-up.svg",
  "assets/shoelace/assets/icons/circle-fill.svg",
  "assets/shoelace/assets/icons/dash.svg",
  "assets/shoelace/assets/icons/exclamation-diamond.svg",
  "assets/shoelace/assets/icons/exclamation-octagon.svg",
  "assets/shoelace/assets/icons/hand-index.svg",
  "assets/shoelace/assets/icons/keyboard.svg",
  "assets/shoelace/assets/icons/music-note-beamed.svg",
  "assets/shoelace/assets/icons/plus.svg",
  "assets/shoelace/assets/icons/power.svg",
  "assets/shoelace/assets/icons/question-lg.svg",
  "assets/shoelace/assets/icons/tags-fill.svg",
  "assets/svg/lped.svg",
  "assets/svg/midikbd.svg",
  "assets/svg/mped.svg",
  "assets/svg/rped.svg"
];

// Install: open cache & add assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(PRECACHE_ASSETS))
  );
  self.skipWaiting();
});

// Activate: delete old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys
        .filter(k => k !== CACHE_NAME)
        .map(k => caches.delete(k))
      ).then(() => {
        // After removing old caches, try to force a reload of open pages
        return self.clients.matchAll({ type: 'window', includeUncontrolled: true })
        .then(windowClients => {
          // Instead of forcing a navigation via `client.navigate()` (which
          // can cause navigation races or blank screens on some Android PWAs),
          // message clients and let the page reload itself. This is safer and
          // allows the page to handle UI/visibility concerns before reloading.
          for (const client of windowClients) {
            try {
              client.postMessage?.({ type: 'SW_RELOAD' });
            } catch (e) {
              // ignore any messaging errors
            }
          }
        });
      })
    )
  );
  self.clients.claim();
});

// Fetch: cache-first for static, network-first for navigation
self.addEventListener('fetch', event => {
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
