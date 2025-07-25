// sw.js - Basic Service Worker
const CACHE_NAME = 'consiliereonline-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/styles.css',
  '/script.js',
  '/404.html',
  '/icons/og-image.jpg',
  '/icons/logo.png',
  '/ev1.jpeg',
  '/ev2.jpeg',
  '/ev3.jpeg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(ASSETS_TO_CACHE))
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => response || fetch(event.request))
});