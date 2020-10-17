// Caches name with versioning
const CACHE_STATIC_NAME = 'StaticCache_v1';
const CACHE_DYNAMIC_NAME = 'DynamicCache_v1';

// Static files of the application that will be added to the static cache
const staticFiles = [ '/',
                      '/index.html',
                      '/src/css/app.css',
                      '/src/css/main.css',
                      '/main.js',
                      '/src/js/material.min.js',
                      'https://fonts.googleapis.com/css?family=Roboto:400,700',
                      'https://fonts.googleapis.com/icon?family=Material+Icons',
                      'https://cdnjs.cloudflare.com/ajax/libs/material-design-lite/1.3.0/material.indigo-pink.min.css' ];

// Service worker installation listener
self.addEventListener('install', event => {
  console.log("[SW] Service worker installed.");

  // Add static files to the static cache
  event.waitUntil(
    caches.open(CACHE_STATIC_NAME).then(cache => cache.addAll(staticFiles))
  );
});

// Service worker activation listener
self.addEventListener('activate', event => {
  console.log("[SW] Service worker activated.");

  // Delete old caches that are not in the current cache version
  event.waitUntil(deleteOldVersionCaches());
});

// Fetch event listener
self.addEventListener('fetch', (event) => {	
  console.log("Fetching " + event.request.url);

  // Try to get resource from cache. If it's not there,
  // try to get resource from network (cache with network fallback)
  event.respondWith(
    caches.match(event.request).then((response) => { 
        return response ? response : 
            fetch(event.request).then(res => {
                return caches.open(CACHE_DYNAMIC_NAME).then(cache => {
                    cache.put(event.request.url, res.clone());
                    return res;
                })
            }).catch(err => {});
    })
  );
});


function deleteOldVersionCaches() {
  return caches.keys().then(keyList => {
    return Promise.all(
      keyList.map(key => {
        if (key !== CACHE_STATIC_NAME) {
          console.log("[SW] Deleting old version cache " + key);
          return caches.delete(key);
        }
      })
    );
  });
}
