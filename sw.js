const CACHE_NAME = 'qimen-cache-v1';
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './css/grid.css',
    './css/picker.css',
    './css/style.css',
    './scripts/main.js',
    './scripts/button.js',
    './scripts/calendar.js',
    './scripts/clipboard.js',
    './qimen/ai.js',
    './qimen/bamen.js',
    './qimen/bashen.js',
    './qimen/dipan.js',
    './qimen/jushu.js',
    './qimen/stars.js',
    './qimen/tianpan.js',
    './qimen/ui.js',
    './qimen/wuxing.js',
    './qimen/xunshou.js',
    './qimen/yima.js',
    './qimen/zhifu.js',
    './qimen/zhishi.js',
    './favicon/favicon.png',
    './favicon/icon-192.png',
    './favicon/icon-512.png',
    'https://cdn.jsdelivr.net/npm/lunar-javascript/lunar.js'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});
