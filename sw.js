// Keeps the app working offline. Bump VERSION whenever any file changes.
const VERSION = "pid-v39";
const FILES = [
  "./", "index.html", "styles.css", "app.js", "data.js", "reader.js", "celebrate.js", "config.js", "legal.js", "friends.js", "games.js", "vendor/supabase/supabase.js", "manifest.webmanifest",
  "icons/favicon-32.png", "icons/wordmark.png", "icons/icon-192.png", "icons/icon-512.png", "icons/apple-touch-icon.png"
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Network first so updates show up quickly, falling back to the saved copy when offline.
self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET" || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(
    // no-cache: always ask the server if the file changed, instead of using the browser's 10-minute copy.
    fetch(e.request, { cache: "no-cache" })
      .then((res) => { const copy = res.clone(); caches.open(VERSION).then((c) => c.put(e.request, copy)); return res; })
      .catch(() => caches.match(e.request).then((r) => r || caches.match("index.html")))
  );
});
