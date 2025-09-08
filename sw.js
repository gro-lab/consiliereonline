// Service Worker for consiliereonline.com
// Version: 3.2 - INCREMENT THIS TO TRIGGER UPDATE
const CACHE_VERSION = '3.2'; // Change this version number to trigger updates
const CACHE_NAME = `consiliereonline-v${CACHE_VERSION}`;
const OFFLINE_PAGE = '/404.html';

// Core assets to cache during installation
const CORE_ASSETS = [
  '/',
  '/index.html',
  '/styles.css',
  '/script.js',
  OFFLINE_PAGE,
  '/manifest.json'
];

// Dynamic assets (workshop images)
const DYNAMIC_ASSETS = [
  '/consiliere-online-razvan-mischie-event-1.jpg',
  '/consiliere-online-razvan-mischie-event-2.jpg',
  '/consiliere-online-razvan-mischie-event-3.jpg',
  '/consiliere-online-razvan-mischie-event-4.jpg'
];

// Optional assets
const OPTIONAL_ASSETS = [
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/icons/apple-touch-icon.png',
  '/icons/favicon-32x32.png',
  '/icons/favicon-16x16.png',
  '/favicon.ico'
];

// ===== INSTALLATION =====
self.addEventListener('install', (event) => {
  console.log('[ServiceWorker] Installing version:', CACHE_VERSION);
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[ServiceWorker] Caching core assets');
        return cache.addAll(CORE_ASSETS)
          .then(() => {
            console.log('[ServiceWorker] Caching dynamic assets');
            return Promise.all(
              DYNAMIC_ASSETS.map(url => {
                return fetch(url, { cache: 'reload' })
                  .then(response => {
                    if (response.ok) return cache.put(url, response);
                    throw new Error(`Bad response for ${url}: ${response.status}`);
                  })
                  .catch(err => {
                    console.warn(`[ServiceWorker] Failed to cache ${url}:`, err);
                  });
              })
            );
          })
          .then(() => {
            console.log('[ServiceWorker] Caching optional assets');
            return Promise.all(
              OPTIONAL_ASSETS.map(url => {
                return fetch(url, { cache: 'reload' })
                  .then(response => {
                    if (response.ok) {
                      return cache.put(url, response);
                    }
                  })
                  .catch(err => {
                    console.info(`[ServiceWorker] Optional asset not found: ${url}`);
                  });
              })
            );
          });
      })
      .catch(err => {
        console.error('[ServiceWorker] Installation failed:', err);
        throw err;
      })
  );
  
  // DON'T call skipWaiting() here - let the user decide when to update
  // This ensures the update notification will be shown
});

// ===== MESSAGE HANDLER FOR SKIP WAITING =====
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    console.log('[ServiceWorker] Received skipWaiting message');
    self.skipWaiting();
  }
});

// ===== FETCH HANDLER =====
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests and cross-origin requests
  if (request.method !== 'GET' || !url.origin.startsWith(self.location.origin)) {
    return;
  }

  // For service worker file itself, always fetch from network
  if (url.pathname.endsWith('/sw.js')) {
    event.respondWith(fetch(request));
    return;
  }

  // Strategy 1: Network-first for API calls
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then(networkResponse => {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME)
            .then(cache => cache.put(request, responseClone));
          return networkResponse;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // Strategy 2: Cache-first for core assets
  if (CORE_ASSETS.includes(url.pathname)) {
    event.respondWith(
      caches.match(request)
        .then(cached => cached || fetch(request))
    );
    return;
  }

  // Strategy 3: Stale-while-revalidate for dynamic assets
  if (DYNAMIC_ASSETS.includes(url.pathname)) {
    event.respondWith(
      caches.match(request).then(cached => {
        const networkFetch = fetch(request)
          .then(response => {
            if (response.ok) {
              const clone = response.clone();
              caches.open(CACHE_NAME)
                .then(cache => cache.put(request, clone));
            }
            return response;
          })
          .catch(() => cached);
        
        return cached || networkFetch;
      })
    );
    return;
  }

  // Default: Network with cache fallback
  event.respondWith(
    fetch(request)
      .catch(() => {
        if (request.headers.get('Accept') && request.headers.get('Accept').includes('text/html')) {
          return caches.match(OFFLINE_PAGE);
        }
      })
  );
});

// ===== ACTIVATION =====
self.addEventListener('activate', (event) => {
  console.log('[ServiceWorker] Activating version:', CACHE_VERSION);
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('[ServiceWorker] Removing old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
    .then(() => {
      if (self.registration.navigationPreload) {
        return self.registration.navigationPreload.enable();
      }
    })
    .then(() => {
      // Only claim clients after everything is ready
      // This allows the update notification to work properly
      return self.clients.claim();
    })
    .then(() => {
      console.log('[ServiceWorker] Activation complete, version:', CACHE_VERSION);
      
      // Notify all clients about the activation
      return self.clients.matchAll().then(clients => {
        clients.forEach(client => {
          client.postMessage({
            type: 'SERVICE_WORKER_ACTIVATED',
            version: CACHE_VERSION
          });
        });
      });
    })
  );
});

// ===== BACKGROUND SYNC =====
self.addEventListener('sync', (event) => {
  if (event.tag === 'update-content') {
    event.waitUntil(updateContent());
  }
});

async function updateContent() {
  const cache = await caches.open(CACHE_NAME);
  await Promise.all(
    DYNAMIC_ASSETS.map(async (url) => {
      try {
        const response = await fetch(url, { cache: 'reload' });
        if (response.ok) await cache.put(url, response);
      } catch (err) {
        console.warn(`[ServiceWorker] Background sync failed for ${url}:`, err);
      }
    })
  );
}