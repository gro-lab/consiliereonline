// Service Worker for consiliereonline.com
// Version: 3.1 - Optimized
const CACHE_NAME = 'consiliereonline-v3.1';
const OFFLINE_PAGE = '/404.html';
const CACHE_TIMEOUT = 30000; // 30s network timeout

// Core assets to cache during installation
const CORE_ASSETS = [
  '/',
  '/index.html',
  '/styles.css',
  '/script.js',
  OFFLINE_PAGE,
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/icons/apple-touch-icon.png',
  '/favicon.ico'
];

// Dynamic assets (workshop images)
const DYNAMIC_ASSETS = [
  '/ev1.jpg',
  '/ev2.jpg',
  '/ev3.jpg'
];

// Updated INSTALLATION section
self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      
      // Cache core assets with individual error handling
      await Promise.allSettled(
        CORE_ASSETS.map(url => 
          cache.add(url).catch(err => 
            console.warn(`[SW] Failed to cache ${url}:`, err)
          )
        )
      );
      
      // Cache dynamic assets
      await Promise.allSettled(
        DYNAMIC_ASSETS.map(url => 
          fetch(url, { cache: 'reload' })
            .then(res => res.ok && cache.put(url, res))
            .catch(err => console.warn(`[SW] Failed to cache ${url}:`, err))
        )
      );
      
      console.log('[SW] Installation completed with possible partial caching');
    })()
  );
  self.skipWaiting(); // Force activate new SW immediately
});

async function cacheDynamic(cache, url) {
  try {
    const response = await fetchWithTimeout(url, { cache: 'reload' });
    if (response.ok) await cache.put(url, response);
  } catch (err) {
    console.warn(`[SW] Failed to cache ${url}:`, err);
  }
}

function fetchWithTimeout(url, options) {
  return Promise.race([
    fetch(url, options),
    new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Request timeout')), CACHE_TIMEOUT)
    )
  ]);
}

// ===== FETCH HANDLER =====
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET and cross-origin
  if (request.method !== 'GET' || !url.origin.startsWith(self.location.origin)) {
    return;
  }

  // API calls - Network first
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(handleApiRequest(request));
    return;
  }

  // Core assets - Cache first
  if (CORE_ASSETS.includes(url.pathname)) {
    event.respondWith(handleCoreAsset(request));
    return;
  }

  // Dynamic assets - Stale-while-revalidate
  if (DYNAMIC_ASSETS.includes(url.pathname)) {
    event.respondWith(handleDynamicAsset(request));
    return;
  }

  // Default - Network with offline fallback
  event.respondWith(handleDefault(request));
});

async function handleApiRequest(request) {
  try {
    const response = await fetch(request);
    const clone = response.clone();
    caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
    return response;
  } catch {
    return caches.match(request);
  }
}

async function handleCoreAsset(request) {
  const cached = await caches.match(request);
  return cached || fetch(request);
}

async function handleDynamicAsset(request) {
  const cachePromise = caches.match(request);
  const networkPromise = fetch(request).then(response => {
    if (response.ok) {
      const clone = response.clone();
      caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
    }
    return response;
  }).catch(() => null);

  return (await cachePromise) || (await networkPromise);
}

async function handleDefault(request) {
  try {
    return await fetch(request);
  } catch {
    if (request.headers.get('Accept').includes('text/html')) {
      return caches.match(OFFLINE_PAGE);
    }
    return Response.error();
  }
}

// ===== ACTIVATION =====
self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      // Clear old caches
      const keys = await caches.keys();
      await Promise.all(
        keys.map(key => key !== CACHE_NAME && caches.delete(key))
      );

      // Enable navigation preload
      if (self.registration.navigationPreload) {
        await self.registration.navigationPreload.enable();
      }

      // Claim clients immediately
      await self.clients.claim();
      console.log('[SW] Activated and ready');
    })()
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
    DYNAMIC_ASSETS.map(url => cacheDynamic(cache, url))
  );
}