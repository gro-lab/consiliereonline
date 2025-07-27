// sw.js - Optimized Service Worker for Presentational Site
const CACHE_NAME = 'consiliereonline-v2';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/styles.css',
  '/script.js',
  '/404.html',
  '/icons/og-image.jpg',
  '/icons/logo.png',
  '/manifest.json'
];

// Workshop images (cache but update frequently)
const WORKSHOP_ASSETS = [
  '/ev1.jpg',
  '/ev2.jpg',
  '/ev3.jpg'
];

// ===== INSTALL =====
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        // Cache static assets first
        return cache.addAll(STATIC_ASSETS)
          .then(() => {
            // Optional: Cache workshop assets with network-first strategy
            return Promise.all(
              WORKSHOP_ASSETS.map(url => {
                return fetch(url)
                  .then(response => cache.put(url, response))
                  .catch(() => console.log(`Failed to cache: ${url}`));
              })
            );
          });
      })
      .catch(err => console.error('Install error:', err))
  );
});

// ===== FETCH =====
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Strategy 1: Always fresh for dynamic content
  if (url.pathname.includes('/api/') || url.search.includes('fresh')) {
    event.respondWith(fetch(request));
    return;
  }

  // Strategy 2: Cache-first for static assets
  if (STATIC_ASSETS.includes(url.pathname)) {
    event.respondWith(
      caches.match(request)
        .then(cached => cached || fetch(request))
    );
    return;
  }

  // Strategy 3: Stale-while-revalidate for workshop images
  if (WORKSHOP_ASSETS.includes(url.pathname)) {
    event.respondWith(
      caches.match(request).then(cached => {
        const networkFetch = fetch(request).then(response => {
          // Update cache in background
          caches.open(CACHE_NAME).then(cache => cache.put(request, response.clone()));
          return response;
        });
        return cached || networkFetch;
      })
    );
    return;
  }

  // Default: Network fallback
  event.respondWith(fetch(request));
});

// ===== ACTIVATE =====
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(name => {
          if (name !== CACHE_NAME) return caches.delete(name);
        })
      );
    })
  );
});