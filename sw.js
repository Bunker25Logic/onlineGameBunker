const CACHE_NAME = 'bunker25-assets-v3';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-512.png'
];

// Instalação: Cacheia apenas o básico solicitado (Manifest, Ícone)
self.addEventListener('install', (event) => {
  self.skipWaiting(); // Força a atualização imediata
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
});

// Ativação: Limpa caches antigos
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)));
    })
  );
});

// Interceptação de Requests: Estratégia Seletiva // Bunker25 Logic
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // 1. Cache-First apenas para Imagens, Fontes e CSS estático (Assets)
  const isAsset = url.pathname.match(/\.(png|jpg|jpeg|gif|svg|webp|css|woff2?|ttf)$/);
  
  // REGRA CRÍTICA: Não cachear scripts do /src/ nem APIs (conforme pedido)
  const isCodeOrApi = url.pathname.includes('/src/') || url.hostname.includes('googleapis.com') || url.hostname.includes('firebase');

  if (isAsset && !isCodeOrApi) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        return cached || fetch(event.request).then((response) => {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, response.clone());
            return response;
          });
        });
      })
    );
  } else {
    // 2. Network-Only para todo o resto (Scripts, APIs, etc)
    event.respondWith(fetch(event.request));
  }
});
