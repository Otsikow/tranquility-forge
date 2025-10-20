// Peace PWA Service Worker v2025.10.20
const CACHE_VERSION = 'peace-v2';
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const DYNAMIC_CACHE = `${CACHE_VERSION}-dynamic`;
const OFFLINE_URL = '/offline.html';
const SYNC_QUEUE_NAME = 'peace-write-ops';

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

// Background Sync event - retry failed operations
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync event:', event.tag);
  
  if (event.tag === SYNC_QUEUE_NAME) {
    event.waitUntil(processQueue());
  }
});

// Process queued operations
async function processQueue() {
  console.log('[SW] Processing background sync queue...');
  
  try {
    // Get queued operations from IndexedDB
    const db = await openDB();
    const tx = db.transaction('syncQueue', 'readonly');
    const store = tx.objectStore('syncQueue');
    const queuedOps = await store.getAll();
    
    console.log(`[SW] Found ${queuedOps.length} queued operations`);
    
    for (const op of queuedOps) {
      try {
        await retryOperation(op);
        
        // Remove from queue after successful retry
        const deleteTx = db.transaction('syncQueue', 'readwrite');
        const deleteStore = deleteTx.objectStore('syncQueue');
        await deleteStore.delete(op.id);
        
        console.log('[SW] Successfully synced operation:', op.id);
      } catch (error) {
        console.error('[SW] Failed to sync operation:', op.id, error);
        // Keep in queue for next sync attempt
      }
    }
  } catch (error) {
    console.error('[SW] Background sync failed:', error);
    throw error;
  }
}

// Retry a failed operation
async function retryOperation(op) {
  const { url, method, body, headers } = op.request;
  
  const response = await fetch(url, {
    method,
    headers: headers || {},
    body: body ? JSON.stringify(body) : undefined,
  });
  
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  
  return response;
}

// Open IndexedDB for sync queue
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('PeaceDB', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('syncQueue')) {
        db.createObjectStore('syncQueue', { keyPath: 'id' });
      }
    };
  });
}

// Periodic sync for affirmations (if supported)
self.addEventListener('periodicsync', (event) => {
  console.log('[SW] Periodic sync event:', event.tag);
  
  if (event.tag === 'refresh-affirmations') {
    event.waitUntil(refreshAffirmations());
  }
});

// Refresh affirmations in background
async function refreshAffirmations() {
  try {
    const response = await fetch('/api/affirmations/daily');
    if (response.ok) {
      const data = await response.json();
      // Cache the fresh data
      const cache = await caches.open(DYNAMIC_CACHE);
      await cache.put('/api/affirmations/daily', new Response(JSON.stringify(data)));
      console.log('[SW] Affirmations refreshed');
    }
  } catch (error) {
    console.error('[SW] Failed to refresh affirmations:', error);
  }
}

// Push notification event
self.addEventListener('push', (event) => {
  console.log('[SW] Push notification received');
  
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'Peace';
  const options = {
    body: data.body || 'You have a new notification',
    icon: '/logo.png',
    badge: '/logo.png',
    vibrate: [200, 100, 200],
    data: data.url ? { url: data.url } : undefined,
    actions: data.actions || [],
  };
  
  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked');
  event.notification.close();
  
  const urlToOpen = event.notification.data?.url || '/';
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Check if there's already a window open
      for (const client of clientList) {
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      // Open new window if none exists
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});

// Message event for skip waiting
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
