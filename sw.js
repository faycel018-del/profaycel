// =====================================================
// PROFAYCEL — Service Worker (application installable)
// =====================================================

const CACHE_NAME = "profaycel-v5";

const PRECACHE = [
    "./",
    "index.html",
    "404.html",
    "style.css",
    "script.js",
    "i18n.js",
    "home.css",
    "supabase.js",
    "manifest.json",
    "icons/icon-192.png",
    "icons/icon-512.png"
];

self.addEventListener("install", function (event) {
    event.waitUntil(
        caches.open(CACHE_NAME).then(function (cache) {
            return cache.addAll(PRECACHE);
        })
    );
    self.skipWaiting();
});

self.addEventListener("activate", function (event) {
    event.waitUntil(
        caches.keys().then(function (keys) {
            return Promise.all(keys.filter(function (key) {
                return key !== CACHE_NAME;
            }).map(function (key) {
                return caches.delete(key);
            }));
        })
    );
    self.clients.claim();
});

// Réseau d'abord (pour toujours avoir la dernière version),
// cache en secours quand il n'y a pas de connexion.
// Les requêtes vers Supabase et les autres domaines ne sont pas mises en cache.
self.addEventListener("fetch", function (event) {

    const request = event.request;

    if (request.method !== "GET" || new URL(request.url).origin !== self.location.origin) {
        return;
    }

    event.respondWith(
        // « no-cache » : le navigateur vérifie toujours auprès du serveur
        // (sinon il peut montrer une ancienne page pendant 10 minutes)
        fetch(request, { cache: "no-cache" }).then(function (response) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then(function (cache) {
                cache.put(request, copy);
            });
            return response;
        }).catch(function () {
            return caches.match(request, { ignoreSearch: true }).then(function (cached) {
                return cached || caches.match("index.html");
            });
        })
    );

});
