// ============================================================
// KKU Follow - service-worker.js
// PWA Service Worker — Cache Strategy (Online-first)
// ============================================================

var CACHE_NAME = 'kku-follow-v1';
var ASSETS_TO_CACHE = [
  './', './index.html', './login.html', './home.html', './record-work.html',
  './review-work.html', './history.html', './work-detail.html',
  './css/style.css',
  './js/app.js', './js/auth.js', './js/voice.js', './js/api.js', './js/ui.js', './js/photo.js',
  './manifest.json', './assets/icon-192.png', './assets/icon-512.png'
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(ASSETS_TO_CACHE).catch(function(err) { console.log('Cache addAll error:', err); });
    }).then(function() { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(names) {
      return Promise.all(names.map(function(n) { if (n !== CACHE_NAME) return caches.delete(n); }));
    }).then(function() { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function(event) {
  var url = new URL(event.request.url);
  if (url.pathname.includes('macros') || url.hostname === 'script.google.com') return;

  event.respondWith(
    fetch(event.request).then(function(response) {
      if (response.status === 200) {
        var clone = response.clone();
        caches.open(CACHE_NAME).then(function(cache) { cache.put(event.request, clone); });
      }
      return response;
    }).catch(function() {
      return caches.match(event.request).then(function(cached) { return cached || new Response('Offline', { status: 503 }); });
    })
  );
});
