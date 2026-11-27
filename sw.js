/* RetailPro Mini service worker: lets the app open with no internet. */
const CACHE = 'rpm-v1.1.0';
const SHELL = ['./', './index.html', './manifest.json', './icon-192.png', './icon-512.png'];
const FB = 'https://www.gstatic.com/firebasejs/10.12.5/';
const FB_FILES = ['firebase-app-compat.js', 'firebase-auth-compat.js', 'firebase-firestore-compat.js'].map(f => FB + f);

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(async c => {
    await c.addAll(SHELL);
    await Promise.all(FB_FILES.map(u => c.add(u).catch(() => {})));
  }).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const same = url.origin === location.origin;
  const fbLib = req.url.startsWith(FB);
  if (!same && !fbLib) return;                       // Firestore/Auth traffic goes straight to the network
  if (req.mode === 'navigate' || (same && url.pathname.endsWith('/index.html'))) {
    // network first so new versions arrive; cached copy when offline
    e.respondWith(fetch(req).then(r => { const cp = r.clone(); caches.open(CACHE).then(c => c.put('./index.html', cp)); return r; })
      .catch(() => caches.match('./index.html')));
    return;
  }
  e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(r => {
    if (r.ok) { const cp = r.clone(); caches.open(CACHE).then(c => c.put(req, cp)); }
    return r;
  })));
});
