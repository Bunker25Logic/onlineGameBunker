const CACHE_NAME = 'solaris-bunker-v1';

// Recursos Críticos para o Funcionamento Offline/Cache
const STATIC_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon-512.png',
  // Os arquivos JS e CSS são cacheados dinamicamente pelo Vite, 
  // mas aqui focamos em interceptar os modelos pesados
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Pre-caching estático...');
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Estratégia: Cache First para Modelos 3D e Texturas (Arquivos Pesados)
  if (url.pathname.includes('/assets/models/') || url.pathname.includes('/assets/textures/')) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) return cachedResponse;
        
        return fetch(event.request).then((networkResponse) => {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
        });
      })
    );
    return;
  }

  // Estratégia: Network First para Lógica do Jogo (Garante que updates do código entrem)
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});
