// Places area in DOM
const placesArea = document.getElementById("places-area");

// Places array
let places = [];

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
        for (let place of data) {
          places.push(place);
        }
        refreshPlacesArea();
      });

  if ('indexedDB' in window) {
    readAllItemsFromDatabase(PLACES_STORE_NAME).then(data => {
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

  // Adding new card to html
  placesArea.appendChild(cardSection);
}

// Add a new place to places array and then add a new card for it
function addNewPlace() {
  const newPlace = {
      title: "Monterey Bay",
      description: "Monterey Bay Aquarium was fun!",
      image: "/src/images/monterey.jpg"
  };
  places.push(newPlace);
  createNewPlaceCard(newPlace);
};

fetchPlacesUsingCacheThenNetworkStrategy();