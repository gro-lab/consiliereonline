// Service Worker for consiliereonline.com
// Version: 3.1
const CACHE_NAME = 'consiliereonline-v3-1';
const OFFLINE_PAGE = '/404.html';

// Core assets to cache during installation - only files that actually exist
const CORE_ASSETS = [
  '/',
  '/index.html',
  '/styles.css',
  '/script.min.js',
  OFFLINE_PAGE,
  '/manifest.json'
];

// Dynamic assets (workshop images)
const DYNAMIC_ASSETS = [
  '/consiliere-online-razvan-mischie-event-1.jpg',
  '/consiliere-online-razvan-mischie-event-2.jpg',
  '/consiliere-online-razvan-mischie-event-3.jpg'
];

// Optional assets - these may or may not exist
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
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        // Cache core assets first
        console.log('[ServiceWorker] Caching core assets');
        return cache.addAll(CORE_ASSETS)
          .then(() => {
            // Cache dynamic assets with network-first strategy
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
            // Try to cache optional assets
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
});

// ===== FETCH HANDLER =====
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests and cross-origin requests
  if (request.method !== 'GET' || !url.origin.startsWith(self.location.origin)) {
    return;
  }

  // Strategy 1: Network-first for API calls
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then(networkResponse => {
          // Update cache if successful
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
            // Update cache if valid response
            if (response.ok) {
              const clone = response.clone();
              caches.open(CACHE_NAME)
                .then(cache => cache.put(request, clone));
            }
            return response;
          })
          .catch(() => cached); // Fallback to cache if fetch fails
        
        return cached || networkFetch;
      })
    );
    return;
  }

  // Default: Network with cache fallback
  event.respondWith(
    fetch(request)
      .catch(() => {
        // Return offline page for document requests
        if (request.headers.get('Accept') && request.headers.get('Accept').includes('text/html')) {
          return caches.match(OFFLINE_PAGE);
        }
      })
  );
});

// ===== ACTIVATION =====
self.addEventListener('activate', (event) => {
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
      // Enable navigation preload if available
      if (self.registration.navigationPreload) {
        return self.registration.navigationPreload.enable();
      }
    })
    .then(() => self.clients.claim())
    .then(() => console.log('[ServiceWorker] Activation complete'))
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