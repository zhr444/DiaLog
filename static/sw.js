const CACHE_NAME = 'dialog-v1';

self.addEventListener('install', (event) => {
    console.log('[Service Worker] Установлен');
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    console.log('[Service Worker] Активирован');
    return self.clients.claim();
});

// Стратегия Network-first: всегда пытаемся получить свежие данные,
// чтобы приложение не «застревало» в кэше
self.addEventListener('fetch', (event) => {
    event.respondWith(
        fetch(event.request).catch(() => {
            return caches.match(event.request);
        })
    );
});