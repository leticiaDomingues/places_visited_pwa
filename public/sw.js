// IndexedDB
importScripts('/src/js/idb.js');
importScripts('/src/js/idb-util.js');

// Firebase
importScripts('/src/js/firebase-app.min.js');
importScripts('/src/js/firebase-database.min.js');
importScripts('/src/js/firebase-util.js');

// Caches name with versioning
const CACHE_STATIC_NAME = 'StaticCache_v1';
const CACHE_DYNAMIC_NAME = 'DynamicCache_v1';

// Sync events
const NEW_PLACE_SYNC_EVENT_NAME = 'sync-new-posts';
const REMOVE_PLACE_SYNC_EVENT_NAME = 'sync-remove-posts';

// Static files of the application that will be added to the static cache
const staticFiles = [ '/',
                      '/index.html',
                      '/src/offline.html',
                      '/src/css/app.css',
                      '/src/css/main.css',
                      '/src/css/offline.css',
                      '/main.js',
                      '/src/js/idb.js',
                      '/src/js/idb-util.js',
                      '/src/js/places.js',
                      '/src/js/firebase-util.js',
                      '/src/js/material.min.js',
                      '/src/js/firebase-database.min.js',
                      '/src/js/firebase-app.min.js',
                      'https://fonts.googleapis.com/css?family=Roboto:400,700',
                      'https://fonts.googleapis.com/icon?family=Material+Icons',
                      'https://cdnjs.cloudflare.com/ajax/libs/material-design-lite/1.3.0/material.indigo-pink.min.css' ];

// Check if the specified resource was precached
function isResourcePreCached(resource) {
  var cachePath;
  if (resource.indexOf(self.origin) === 0) { // request targets domain where we serve the page from (i.e. NOT a CDN)
      console.log('matched ', resource);
      cachePath = resource.substring(self.origin.length); // take the part of the URL AFTER the domain (e.g. after localhost:8080)
  } else {
      cachePath = resource; // store the full request (for CDNs)
  }
  return staticFiles.indexOf(cachePath) > -1;
}

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
  const request = event.request;

  // If the resource is the external database, try getting data from the network and then 
  if (request.url.indexOf(EXTERNAL_DATABASE_URL) > -1) {
      event.respondWith(
          fetch(request).then(response => {
              var clonedResponse = response.clone();
              clearAllItemsFromLocalDatabase(PLACES_STORE_NAME).then(() => {
                return clonedResponse.json();
              }).then(places => {
                  for (const placeIndex in places) {
                    const place = places[placeIndex];
                    if (place) {
                      writeItemToLocalDatabase(PLACES_STORE_NAME, place);
                    }
                  }
              });
              return response;
          })
      );
  } else if(isResourcePreCached(request.url, staticFiles)) {
    // If the resource is precached, return it from the cache
    event.respondWith(cacheOnlyStrategy(request));
  } else {
    // If it's not a resource from the external database and if it's not precached,
    // try to get resource from cache. If it's not there, try to get resource from network (cache with network fallback)
    event.respondWith(
      caches.match(request).then((response) => { 
          return response ? response : 
              fetch(request).then(res => {
                  return caches.open(CACHE_DYNAMIC_NAME).then(cache => {
                      cache.put(request.url, res.clone());
                      return res;
                  })
              }).catch(() => {
                return caches.open(CACHE_STATIC_NAME).then(cache => {
                  // If the resource is an html page and the request failed, return the offline page
                  if (request.headers.get('accept').includes('text/html')) {
                    return cache.match('/src/offline.html');
                  }
                });
              });
      })
    );
  }
});

// Delete caches that are not in the active version
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

function cacheOnlyStrategy(request) {
  return caches.match(request).then((response) => response);
}

// Sync event listener
self.addEventListener('sync', event => {
  console.log('[SW] Background syncing event', event);

  // Check if the triggered event is for adding a new place
  if (event.tag === NEW_PLACE_SYNC_EVENT_NAME) {
    console.log('[SW] Sync event to add new place');

    event.waitUntil(
      // Read the places to add from idb
      readAllItemsFromLocalDatabase(PLACES_TO_SYNC_STORE_NAME).then(places => {
          for (const place of places) {
            const placeIdToDeleteFromIdb = place.id;
            // Send the place for insertion on firebase.
            // If the operation was successful, remove recently added place from idb
            writePlaceToExternalDatabase(place)
              .then(() => deleteItemFromLocalDatabase(PLACES_TO_SYNC_STORE_NAME, placeIdToDeleteFromIdb))
              .catch(err => console.log('Error while sending data', err));
          }
        })
    );
  } 
  // Check if the triggered event is for removing a place 
  else if (event.tag === REMOVE_PLACE_SYNC_EVENT_NAME) {
    console.log('[SW] Sync event to remove place');

    event.waitUntil(
      // Read the places to remove from idb
      readAllItemsFromLocalDatabase(PLACES_TO_SYNC_REMOVE_STORE_NAME).then(places => {
          for (const place of places) {
            const placeIdToDeleteFromIdb = place.id;
            // Send the place for removal on firebase.
            // If the operation was successful, remove place from idb
            removePlaceFromExternalDatabase(place)
              .then(() => deleteItemFromLocalDatabase(PLACES_TO_SYNC_REMOVE_STORE_NAME, placeIdToDeleteFromIdb))
              .catch(err => console.log('Error while sending data', err));
          }
        })
    );
  }
});
