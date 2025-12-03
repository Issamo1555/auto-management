const CACHE_NAME = 'automanager-v1.6';
const urlsToCache = [
    './',
    './index.html',
    './css/main.css',
    './js/app.js',
    './js/storage.js',
    './js/vehicle.js',
    './js/document.js',
    './js/maintenance.js',
    './js/dashboard.js',
    './js/settings.js',
    './js/notification.js',
    './js/charts.js',
    './js/utils.js',
    './js/car_data.js',
    './js/provider_data.js',
    './js/ai_service.js',
    './js/provider_search.js'
];

// Install event - cache files
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Cache hit - return response
                if (response) {
                    return response;
                }
                return fetch(event.request);
            }
            )
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
