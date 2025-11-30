const CACHE_VERSION = 'v4';
const CACHE_NAME = `piano-projector-${CACHE_VERSION}`;

const PRECACHE_ASSETS = [
  './',
  'index.html',
  'manifest.json',
  'bundle.js',
  'bundle.css',
  'assets/font/orbitron.woff2',
  'assets/icon/favicon.png',
  'assets/icon/favicon-192.png',
  'assets/icon/favicon-512.png',
  'assets/svg/lped.svg',
  'assets/svg/mped.svg',
  'assets/svg/rped.svg',
  'assets/svg/midikbd.svg',
  'assets/shoelace/assets/icons/arrow-counterclockwise.svg',
  'assets/shoelace/assets/icons/arrow-down-up.svg',
  'assets/shoelace/assets/icons/ban.svg',
  'assets/shoelace/assets/icons/chevron-down.svg',
  'assets/shoelace/assets/icons/chevron-up.svg',
  'assets/shoelace/assets/icons/circle-fill.svg',
  'assets/shoelace/assets/icons/dash.svg',
  'assets/shoelace/assets/icons/exclamation-diamond.svg',
  'assets/shoelace/assets/icons/exclamation-octagon.svg',
  'assets/shoelace/assets/icons/hand-index.svg',
  'assets/shoelace/assets/icons/keyboard.svg',
  'assets/shoelace/assets/icons/music-note-beamed.svg',
  'assets/shoelace/assets/icons/plus.svg',
  'assets/shoelace/assets/icons/power.svg',
  'assets/shoelace/assets/icons/question-lg.svg',
  'assets/shoelace/assets/icons/tags-fill.svg',
  'assets/sf/organ.sf2'
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
      )
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
