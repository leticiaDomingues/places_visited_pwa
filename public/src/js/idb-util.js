// Database name
const LOCAL_DATABASE_NAME = 'places-to-visit';

// Stores
const PLACES_STORE_NAME = 'places';
const PLACES_TO_SYNC_STORE_NAME = 'places-to-sync';
const PLACES_TO_SYNC_REMOVE_STORE_NAME = 'places-to-sync-remove';
const STORES = [ PLACES_STORE_NAME,  PLACES_TO_SYNC_STORE_NAME, PLACES_TO_SYNC_REMOVE_STORE_NAME ];

// Firebase url to get data
const EXTERNAL_DATABASE_URL = 'https://places-visited-82e6a.firebaseio.com/places-to-visit/places.json';

const DatabaseOperations = {
    READ_ONLY: 'readonly',
    READ_AND_WRITE: 'readwrite'
};

// Open the database and create the table if it's not already there
const dbPromise = idb.open(LOCAL_DATABASE_NAME, 1, (db) => {
    for (const storeName of STORES) {
        if (!db.objectStoreNames.contains(storeName)) {
            db.createObjectStore(storeName, { keyPath: 'id' });
        } 
    }
});

// Write a single item to specified store in the database
function writeItemToLocalDatabase(st, data) {
    return dbPromise.then(db => {
        var tx = db.transaction(st, DatabaseOperations.READ_AND_WRITE);
        var store = tx.objectStore(st);
        store.put(data);
        return tx.complete;
    });
}

// Read all items from specified store in the database
function readAllItemsFromLocalDatabase(st) {
    return dbPromise.then(db => {
        var tx = db.transaction(st, DatabaseOperations.READ_ONLY);
        var store = tx.objectStore(st);
        return store.getAll();
    });
}

// Read single item from specified store in the database
function readItemFromLocalDatabase(st, id) {
    return dbPromise.then(db => {
        var tx = db.transaction(st, DatabaseOperations.READ_ONLY);
        var store = tx.objectStore(st);
        return store.get(id);
    });
}

// Delete all items from specified store in the database
function clearAllItemsFromLocalDatabase(st) {
    return dbPromise.then(db => {
        var tx = db.transaction(st, DatabaseOperations.READ_AND_WRITE);
        var store = tx.objectStore(st);
        store.clear();
        return tx.complete;
    });
}

// Delete a single item from specified store in the database
function deleteItemFromLocalDatabase(st, id) {
    return dbPromise.then(db => {
        var tx = db.transaction(st, DatabaseOperations.READ_AND_WRITE);
        var store = tx.objectStore(st);
        store.delete(id);
        return tx.complete;
    });
}