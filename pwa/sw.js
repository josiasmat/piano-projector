// production service worker template
const CACHE_NAME = "pp-a317802207efa8bb";
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

async function createNewCache() {
  const cache = await caches.open(CACHE_NAME);
  await cache.addAll(PRECACHE_ASSETS);
}

async function deleteOldCaches() {
  const deleteCache = async(k) => await caches.delete(k);
  const keys = await caches.keys();
  const deletion_list = keys.filter((k) => k !== CACHE_NAME);
  await Promise.all(deletion_list.map(deleteCache));
}

async function get(request) {
  return await caches.match(request) ?? fetch(request);
}

// Install: open cache & add assets
self.addEventListener('install', event => {
  event.waitUntil(createNewCache());
  // self.skipWaiting();
});

// Activate: delete old caches
self.addEventListener('activate', event => {
  event.waitUntil(deleteOldCaches());
  self.clients.claim();
});

// Fetch: cache-first
self.addEventListener("fetch", event => {
  event.respondWith(get(event.request));
});
