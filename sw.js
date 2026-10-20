// L'ancien service worker de cette adresse se retire et vide son cache,
// pour que les anciens visiteurs arrivent sur la page de redirection.
self.addEventListener("install", function () { self.skipWaiting(); });
self.addEventListener("activate", function (event) {
    event.waitUntil(
        caches.keys().then(function (keys) {
            return Promise.all(keys.map(function (k) { return caches.delete(k); }));
        }).then(function () {
            return self.registration.unregister();
        }).then(function () {
            return self.clients.matchAll();
        }).then(function (clients) {
            clients.forEach(function (c) { c.navigate(c.url); });
        })
    );
});
