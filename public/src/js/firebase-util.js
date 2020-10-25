// Firebase configuration
const config = {
    apiKey: "AIzaSyBga-4a3rqiEvqyfCU5KxRV89gDW6-pUCM",
    authDomain: "places-visited-82e6a.firebaseapp.com",
    projectId: "places-visited-82e6a",
    databaseURL: "https://places-visited-82e6a.firebaseio.com",
};

// Initialize firebase, if it's not already initialized
if (!firebase.apps.length) {
    firebase.initializeApp(config);
}

// Get the reference for firebase database
const database = firebase.database();

const EXTERNAL_DATABASE_PLACES_REF_NAME = '/places-to-visit/places';
const placesRef = database.ref(EXTERNAL_DATABASE_PLACES_REF_NAME);

let newPlaceKey = 1;

placesRef.once('value', function(snapshot) {
    snapshot.forEach(function(childSnapshot) {
      var childKey = childSnapshot.key;
      if (newPlaceKey == childKey) {
        newPlaceKey++;
      }
    });
  });

// Write a single item to specified table in the external database
function writePlaceToExternalDatabase(item) {
    item.id = newPlaceKey++;
    return database.ref(`${EXTERNAL_DATABASE_PLACES_REF_NAME}/${item.id}`).set(item);
}