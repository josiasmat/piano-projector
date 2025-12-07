// production service worker template
const CACHE_NAME = "pp-8070702944ffb961";
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
  event.waitUntil(createNewCacheAndActivate());
});

// Activate: reload clients and delete old caches
self.addEventListener("activate", event => {
  event.waitUntil(activateNewServiceWorker());
});

// Fetch: cache-first
self.addEventListener("fetch", event => {
  event.respondWith(get(event.request));
});


async function createNewCacheAndActivate() {
  const cache = await caches.open(CACHE_NAME);
  await cache.addAll(PRECACHE_ASSETS);
  self.skipWaiting();
}

async function deleteOldCaches() {
  const deleteCache = async(k) => await caches.delete(k);
  const keys = await caches.keys();
  const deletion_list = keys.filter((k) => k !== CACHE_NAME);
  await Promise.all(deletion_list.map(deleteCache));
}

async function getUncontrolledClientsList() {
  const all = await self.clients.matchAll({includeUncontrolled: true});
  const controlled = await self.clients.matchAll({includeUncontrolled: false});
  return all.filter(c => !controlled.some(cc => cc.id === c.id));
}

async function reloadClients() {
  const list = await getUncontrolledClientsList();
  await Promise.all(list.map(c => c.navigate(c.url).catch(() => {})));
}

async function activateNewServiceWorker() {
  await reloadClients();
  await deleteOldCaches();
  await self.clients.claim();
}

async function get(request) {
  return await caches.match(request) ?? fetch(request);
}
