// Service Worker for consiliereonline.com
// Version: 3.2 - Minimal Safe Version
const CACHE_NAME = 'consiliereonline-v3-2';

// Only cache files we know exist
const CORE_ASSETS = [
  './',
  './index.html',
  './styles.css',
  './script.min.js',
  './ev1.jpg',
  './ev2.jpg',
  './ev3.jpg'
];

// ===== INSTALLATION =====
self.addEventListener('install', (event) => {
  console.log('[ServiceWorker] Installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[ServiceWorker] Caching essential files');
        // Cache files one by one to identify which one fails
        return Promise.all(
          CORE_ASSETS.map(url => {
            return cache.add(url).catch(err => {
              console.warn(`[ServiceWorker] Failed to cache ${url}:`, err);
              return Promise.resolve(); // Don't fail installation for individual files
            });
          })
        );
      })
      .then(() => {
        console.log('[ServiceWorker] Installation complete');
        return self.skipWaiting();
      })
      .catch(err => {
        console.error('[ServiceWorker] Installation failed:', err);
      })
  );
});

// ===== ACTIVATION =====
self.addEventListener('activate', (event) => {
  console.log('[ServiceWorker] Activating...');
  
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
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
        console.log('[ServiceWorker] Activation complete');
        return self.clients.claim();
      })
  );
});

// ===== FETCH HANDLER =====
self.addEventListener('fetch', (event) => {
  // Only handle GET requests from same origin
  if (event.request.method !== 'GET' || !event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      })
      .catch(err => {
        console.warn('[ServiceWorker] Fetch failed:', err);
        // Return offline page for navigation requests
        if (event.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
        throw err;
      })
  );
});