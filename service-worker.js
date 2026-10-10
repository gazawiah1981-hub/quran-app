const CACHE_NAME = 'quran-app-v1';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

self.addEventListener('fetch', event => {
  if (event.request.url.includes('alquran.cloud') || 
      event.request.url.includes('everyayah.com') ||
      event.request.url.includes('mp3quran.net') ||
      event.request.url.includes('fonts.googleapis') ||
      event.request.url.includes('fonts.gstatic') ||
      event.request.url.includes('aladhan.com')) {
    return;
  }
  
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request).then(fetchRes => {
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, fetchRes.clone());
          return fetchRes;
        });
      });
    }).catch(() => caches.match('./index.html'))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      );
    })
  );
  self.clients.claim();
});
