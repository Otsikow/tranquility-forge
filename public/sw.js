// Peace PWA Service Worker v2025.10.20
const CACHE_VERSION = 'peace-v1';
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const DYNAMIC_CACHE = `${CACHE_VERSION}-dynamic`;
const OFFLINE_URL = '/offline.html';

// Assets to pre-cache on install
const STATIC_ASSETS = [
  '/',
  '/offline.html',
  '/logo.png',
  '/manifest.webmanifest'
];

// Install event - pre-cache static assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      console.log('[SW] Pre-caching static assets');
      return cache.addAll(STATIC_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name.startsWith('peace-') && name !== STATIC_CACHE && name !== DYNAMIC_CACHE)
          .map((name) => {
            console.log('[SW] Deleting old cache:', name);
            return caches.delete(name);
          })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip cross-origin requests
  if (url.origin !== location.origin) {
    return;
  }

  // Network-first for HTML documents
  if (request.mode === 'navigate' || request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const clonedResponse = response.clone();
          caches.open(DYNAMIC_CACHE).then((cache) => cache.put(request, clonedResponse));
          return response;
        })
        .catch(() => {
          return caches.match(request).then((cachedResponse) => {
            return cachedResponse || caches.match(OFFLINE_URL);
          });
        })
    );
    return;
  }

  // Cache-first for static assets (CSS, JS, fonts)
  if (
    request.url.match(/\.(css|js|woff2?|ttf|eot|otf)$/) ||
    request.url.includes('/_app/') ||
    request.url.includes('/assets/')
  ) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(request).then((response) => {
          const clonedResponse = response.clone();
          caches.open(STATIC_CACHE).then((cache) => cache.put(request, clonedResponse));
          return response;
        });
      })
    );
    return;
  }

  // Stale-while-revalidate for images
  if (request.url.match(/\.(png|jpg|jpeg|svg|gif|webp|ico)$/)) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        const fetchPromise = fetch(request).then((response) => {
          const clonedResponse = response.clone();
          caches.open(DYNAMIC_CACHE).then((cache) => cache.put(request, clonedResponse));
          return response;
        });
        return cachedResponse || fetchPromise;
      })
    );
    return;
  }

  // Network-first for API calls with cache fallback
  if (request.url.includes('/api/') || request.url.includes('/functions/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (request.method === 'GET') {
            const clonedResponse = response.clone();
            caches.open(DYNAMIC_CACHE).then((cache) => cache.put(request, clonedResponse));
          }
          return response;
        })
        .catch(() => {
          if (request.method === 'GET') {
            return caches.match(request);
          }
          // For POST/PUT/DELETE, we'll implement background sync later
          return new Response(JSON.stringify({ error: 'offline' }), {
            status: 503,
            headers: { 'Content-Type': 'application/json' }
          });
        })
    );
    return;
  }

  // Default: network-first
  event.respondWith(
    fetch(request)
      .then((response) => {
        const clonedResponse = response.clone();
        caches.open(DYNAMIC_CACHE).then((cache) => cache.put(request, clonedResponse));
        return response;
      })
      .catch(() => caches.match(request))
  );
});

// Message event for skip waiting
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
