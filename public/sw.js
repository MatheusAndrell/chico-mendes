// "Desliga" o service worker de versões anteriores do site (quando ele era um PWA).
// O navegador busca este arquivo para atualizar o worker antigo: este novo worker
// apaga os caches, se remove e recarrega as abas abertas com a versão atual do site.
self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys()
      await Promise.all(keys.map((k) => caches.delete(k)))
      await self.registration.unregister()
      const clients = await self.clients.matchAll({ type: 'window' })
      clients.forEach((c) => c.navigate(c.url))
    })()
  )
})
