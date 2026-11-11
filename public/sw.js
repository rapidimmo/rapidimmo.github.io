// Service worker RapidImmo : rend l'app installable et utilisable hors ligne
// (dernière version consultée). Les données Firestore/Auth ne sont jamais mises en cache ici.
const VERSION = 'v1'
const CACHE = `rapidimmo-${VERSION}`
const CLOUDINARY = 'res.cloudinary.com'

self.addEventListener('install', (event) => {
  // Pré-cache minimal : la page d'accueil (shell de l'app SPA)
  event.waitUntil(caches.open(CACHE).then((c) => c.add('./')).then(() => self.skipWaiting()))
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', (event) => {
  const req = event.request
  if (req.method !== 'GET') return
  const url = new URL(req.url)

  // Navigation : réseau d'abord (toujours la dernière version), cache si hors ligne
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone()
          caches.open(CACHE).then((c) => c.put('./', copy))
          return res
        })
        .catch(() => caches.match('./'))
    )
    return
  }

  const memeOrigine = url.origin === self.location.origin
  // Vidéos : jamais en cache (requêtes partielles "Range")
  if (url.pathname.endsWith('.mp4')) return

  // Fichiers statiques du site + photos Cloudinary : cache, rafraîchi en arrière-plan
  if (memeOrigine || url.hostname === CLOUDINARY) {
    event.respondWith(
      caches.open(CACHE).then(async (cache) => {
        const cached = await cache.match(req)
        const network = fetch(req)
          .then((res) => {
            if (res.ok || res.type === 'opaque') cache.put(req, res.clone())
            return res
          })
          .catch(() => cached)
        return cached || network
      })
    )
  }
  // Tout le reste (Firebase, Google Fonts…) : comportement normal du navigateur
})
