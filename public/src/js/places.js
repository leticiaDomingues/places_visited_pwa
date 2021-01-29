// DOM elements
const placesArea = document.getElementById("places-area");
const snackbar = document.getElementById("snackbar");

// Places array
let places = [];

// Remove sync event name
const REMOVE_PLACE_SYNC_EVENT_NAME = 'sync-remove-posts';

// Delete and then add cards for all places in the array
function refreshPlacesArea() {
  clearPlacesArea();
  for (const place of places) {
    createNewPlaceCard(place);
  }
}

// Delete all places cards from places area
function clearPlacesArea() {
  while(placesArea.hasChildNodes()) {
    placesArea.removeChild(placesArea.lastChild);
  }
}

// Fetch places trying to get it from the database and from the cache,
// always overriding if it's able to get data from the database
function fetchPlacesUsingCacheThenNetworkStrategy() {
  let networkDataReceived = false;

  fetch(EXTERNAL_DATABASE_URL)
    .then(res => res.json())
      .then(data => {
        console.log('From web: ', data);
        networkDataReceived = true;
        places = [];
        for (let index in data) {
          places.push(data[index]);
        }
        refreshPlacesArea();
      });

  if ('indexedDB' in window) {
    readAllItemsFromLocalDatabase(PLACES_STORE_NAME).then(data => {
      if(!networkDataReceived) {
        console.log('From idb: ', data);
        places = data;
        refreshPlacesArea();
      }
    });
  }
}

// Add a new card in placesArea
function createNewPlaceCard(place) {
  if (place == null) {
    return;
  }

  // Creating card section
  var cardSection = document.createElement('section');
  cardSection.className = 'mdl-card mdl-shadow--2dp card';

  // Creating card title wrapper
  var cardTitle = document.createElement('div');
  cardTitle.className = 'mdl-card__title title-wrapper';
  cardTitle.style.backgroundImage = `url("${place.image}")`;
  cardSection.appendChild(cardTitle);

  // Creating card title text element
  var cardTitleTextElement = document.createElement('h2');
  cardTitleTextElement.className = 'mdl-card__title-text';
  cardTitleTextElement.textContent = place.title;
  cardTitle.appendChild(cardTitleTextElement);

  // Creating card description
  var cardDescription = document.createElement('div');
  cardDescription.className = 'mdl-card__supporting-text';
  cardDescription.textContent = place.description;
  cardDescription.style.textAlign = 'center';
  cardSection.appendChild(cardDescription);

  // Creating remove button
  var cardMenu = document.createElement('div');
  cardMenu.className = 'mdl-card__menu';
  var removeButton = document.createElement('button');
  removeButton.className = 'mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect';
  removeButton.addEventListener('click', () => removePlace(place));
  var removeIcon = document.createElement('i');
  removeIcon.className = 'material-icons remove-icon';
  removeIcon.innerText = 'delete';
  removeButton.appendChild(removeIcon);
  cardMenu.appendChild(removeButton);
  cardSection.appendChild(cardMenu);

  // Adding new card to html
  placesArea.appendChild(cardSection);
}

// Redirect user to the "new place" page
function goToNewPlacePage() {
  window.location = "/src/new.html";
};

// Remove a place from database through a sync event, if it's enabled
function removePlace(place) {
  // If background syncronization is supported by the browser, add the post to idb and create a sync event.
  // If it's not supported, just remove the place from firebase
  if ('serviceWorker' in navigator && 'SyncManager' in window) {
    navigator.serviceWorker.ready.then(sw => {
        writeItemToLocalDatabase(PLACES_TO_SYNC_REMOVE_STORE_NAME, place)
            .then(() => { return sw.sync.register(REMOVE_PLACE_SYNC_EVENT_NAME); })
            .then(() => showSnackBar('The place was saved for syncing and removal!'))
            .catch(err => console.log(err));
    });
  } else {
    removePlaceFromDatabase(place);
  }
}

// Remove a place from external database
function removePlaceFromDatabase(place) {
  removePlaceFromExternalDatabase(place)
    .then(() => {
      fetchPlacesUsingCacheThenNetworkStrategy();
      showSnackBar('Place successfully removed.');
    }).catch((err) => console.log(err));
}

// Open material snack bar with the provided message
function showSnackBar(message) {
  const data = { message: message, timeout: 5000 };
  snackbar.MaterialSnackbar.showSnackbar(data);
}

fetchPlacesUsingCacheThenNetworkStrategy();