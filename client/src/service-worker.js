console.log("[sw.js] loaded");

// our fake endpoint to store data
const SHARED_DATA_ENDPOINT = "/credentials";
const SHARED_DATA_CACHE_NAME = "Credentials";

// see: https://developer.mozilla.org/en-US/docs/Web/API/Clients/claim
self.addEventListener("activate", (ev) => {
  console.log("[sw.js] activate");
  ev.waitUntil(clients.claim());
});

self.addEventListener("fetch", (ev) => {
  if (ev.request.url.match(SHARED_DATA_ENDPOINT)) {
    console.log(`[sw.js] ${ev.request.method} ${ev.request.url}`);
    if (ev.request.method === "POST") {
      ev.request.json().then((body) => {
        const response = new Response(JSON.stringify(body));
        caches.open(SHARED_DATA_CACHE_NAME).then((cache) => {
          cache.put(SHARED_DATA_ENDPOINT, response);
        });
      });

      ev.respondWith(new Response("OK"));
    } else {
      ev.respondWith(
        caches.open(SHARED_DATA_CACHE_NAME).then((cache) => {
          return cache.match(SHARED_DATA_ENDPOINT).then((response) => {
            return response || new Response("{}");
          });
        })
      );
    }
  } else {
    return ev;
  }
});
