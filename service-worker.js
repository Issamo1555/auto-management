/**
 * Service Worker - Optimized Version
 * Implements caching strategies and offline support
 */

const CACHE_VERSION = 'v1.5.0';
const CACHE_NAME = `automanager-${CACHE_VERSION}`;

// Assets to cache immediately
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/login.html',
    '/register.html',
    '/css/main.css',
    '/js/app.js',
    '/js/utils.js',
    '/js/storage.js',
    '/js/performance.js',
    '/manifest.json',
    '/icons/icon-192.png',
    '/icons/icon-512.png'
];

// Cache strategies
const CACHE_STRATEGIES = {
    CACHE_FIRST: 'cache-first',
    NETWORK_FIRST: 'network-first',
    STALE_WHILE_REVALIDATE: 'stale-while-revalidate'
};

// Install event - cache static assets
self.addEventListener('install', (event) => {
    console.log('[SW] Installing Service Worker...', CACHE_VERSION);

    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('[SW] Caching static assets');
                return cache.addAll(STATIC_ASSETS);
            })
            .then(() => self.skipWaiting())
    );
});

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
    console.log('[SW] Activating Service Worker...', CACHE_VERSION);

    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames
                        .filter(name => name.startsWith('automanager-') && name !== CACHE_NAME)
                        .map(name => {
                            console.log('[SW] Deleting old cache:', name);
                            return caches.delete(name);
                        })
                );
            })
            .then(() => self.clients.claim())
    );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip non-GET requests
    if (request.method !== 'GET') return;

    // Skip external requests (except CDN)
    if (url.origin !== location.origin && !isCDNRequest(url)) return;

    // Determine strategy based on request type
    const strategy = getStrategy(url);

    event.respondWith(
        handleRequest(request, strategy)
    );
});

/**
 * Handle request with appropriate strategy
 */
async function handleRequest(request, strategy) {
    switch (strategy) {
        case CACHE_STRATEGIES.CACHE_FIRST:
            return cacheFirst(request);

        case CACHE_STRATEGIES.NETWORK_FIRST:
            return networkFirst(request);

        case CACHE_STRATEGIES.STALE_WHILE_REVALIDATE:
            return staleWhileRevalidate(request);

        default:
            return fetch(request);
    }
}

/**
 * Cache-first strategy
 * Good for: Static assets, images, fonts
 */
async function cacheFirst(request) {
    const cached = await caches.match(request);
    if (cached) {
        return cached;
    }

    try {
        const response = await fetch(request);
        if (response.ok) {
            const cache = await caches.open(CACHE_NAME);
            cache.put(request, response.clone());
        }
        return response;
    } catch (error) {
        console.error('[SW] Cache-first failed:', error);
        return getOfflineFallback(request);
    }
}

/**
 * Network-first strategy
 * Good for: API calls, dynamic content
 */
async function networkFirst(request) {
    try {
        const response = await fetch(request);
        if (response.ok) {
            const cache = await caches.open(CACHE_NAME);
            cache.put(request, response.clone());
        }
        return response;
    } catch (error) {
        console.log('[SW] Network failed, trying cache');
        const cached = await caches.match(request);
        if (cached) {
            return cached;
        }
        return getOfflineFallback(request);
    }
}

/**
 * Stale-while-revalidate strategy
 * Good for: Frequently updated content
 */
async function staleWhileRevalidate(request) {
    const cached = await caches.match(request);

    const fetchPromise = fetch(request).then(response => {
        if (response.ok) {
            const cache = caches.open(CACHE_NAME);
            cache.then(c => c.put(request, response.clone()));
        }
        return response;
    }).catch(() => cached || getOfflineFallback(request));

    return cached || fetchPromise;
}

/**
 * Get offline fallback
 */
function getOfflineFallback(request) {
    const url = new URL(request.url);

    // Return offline page for navigation requests
    if (request.mode === 'navigate') {
        return caches.match('/index.html');
    }

    // Return placeholder for images
    if (request.destination === 'image') {
        return new Response(
            '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect fill="#ddd" width="200" height="200"/><text x="50%" y="50%" text-anchor="middle" fill="#999">Offline</text></svg>',
            { headers: { 'Content-Type': 'image/svg+xml' } }
        );
    }

    return new Response('Offline', { status: 503, statusText: 'Service Unavailable' });
}

/**
 * Determine caching strategy based on URL
 */
function getStrategy(url) {
    // Static assets - cache first
    if (url.pathname.match(/\.(css|js|png|jpg|jpeg|svg|woff2?|ttf)$/)) {
        return CACHE_STRATEGIES.CACHE_FIRST;
    }

    // API calls - network first
    if (url.pathname.startsWith('/api/') || url.hostname.includes('firebase')) {
        return CACHE_STRATEGIES.NETWORK_FIRST;
    }

    // HTML pages - stale while revalidate
    if (url.pathname.endsWith('.html') || url.pathname === '/') {
        return CACHE_STRATEGIES.STALE_WHILE_REVALIDATE;
    }

    // Default - network first
    return CACHE_STRATEGIES.NETWORK_FIRST;
}

/**
 * Check if request is from CDN
 */
function isCDNRequest(url) {
    const cdnDomains = [
        'cdn.jsdelivr.net',
        'cdnjs.cloudflare.com',
        'fonts.googleapis.com',
        'fonts.gstatic.com',
        'maps.googleapis.com'
    ];

    return cdnDomains.some(domain => url.hostname.includes(domain));
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
    console.log('[SW] Background sync:', event.tag);

    if (event.tag === 'sync-data') {
        event.waitUntil(syncData());
    }
});

/**
 * Sync data when back online
 */
async function syncData() {
    console.log('[SW] Syncing data...');
    // Implement your sync logic here
    // For example, send queued requests
}

// Push notifications (future feature)
self.addEventListener('push', (event) => {
    const data = event.data ? event.data.json() : {};

    const options = {
        body: data.body || 'Nouvelle notification',
        icon: '/icons/icon-192.png',
        badge: '/icons/icon-192.png',
        vibrate: [200, 100, 200]
    };

    event.waitUntil(
        self.registration.showNotification(data.title || 'AutoManager', options)
    );
});

console.log('[SW] Service Worker loaded', CACHE_VERSION);
