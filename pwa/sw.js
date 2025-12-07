// production service worker template
const CACHE_NAME = "pp-c22788bfa84b5645";
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
self.addEventListener("install", event => {
  event.waitUntil(doInstall());
});

// Activate: reload clients and delete old caches
self.addEventListener("activate", event => {
  event.waitUntil(doActivate());
});

// Fetch: cache-first
self.addEventListener("fetch", event => {
  event.respondWith(doFetch(event.request));
});


async function doInstall() {
  const cache = await caches.open(CACHE_NAME);
  await cache.addAll(PRECACHE_ASSETS);
  self.skipWaiting();
}

async function doActivate() {
  await self.clients.claim();
  const obsolete_caches = await getObsoleteCacheList();
  if (obsolete_caches.length > 0) {
    await deleteCaches(obsolete_caches);
    await reloadClients();
  }
}

async function doFetch(request) {
  return await caches.match(request) ?? fetch(request);
}


async function getObsoleteCacheList() {
  const keys = await caches.keys();
  return keys.filter((k) => k.startsWith("pp-") && k !== CACHE_NAME);
}

async function deleteCaches(cache_list) {
  const deleteCache = async(k) => await caches.delete(k);
  await Promise.all(cache_list.map(deleteCache));
}

async function reloadClients() {
  const clients = await self.clients.matchAll({type: 'window'})
  await Promise.all(clients.map(c => c.navigate(c.url).catch(() => {})));
}
