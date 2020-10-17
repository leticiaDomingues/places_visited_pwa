
const placesArea = document.getElementById("places-area");
const addPlaceButton = document.getElementById("add-place-button");

var bannerToInstallApp;
var places = [
  {
    title: "Monterey Bay",
    description: "Monterey Bay Aquarium was fun!",
    image: "/src/images/monterey.jpg"
  },
  {
    title: "Monterey Bay",
    description: "Monterey Bay Aquarium was fun!",
    image: "/src/images/monterey.jpg"
  },
  {
    title: "Monterey Bay",
    description: "Monterey Bay Aquarium was fun!",
    image: "/src/images/monterey.jpg"
  },
  {
    title: "Monterey Bay",
    description: "Monterey Bay Aquarium was fun!",
    image: "/src/images/monterey.jpg"
  },
  {
    title: "Monterey Bay",
    description: "Monterey Bay Aquarium was fun!",
    image: "/src/images/monterey.jpg"
  },
  {
    title: "Monterey Bay",
    description: "Monterey Bay Aquarium was fun!",
    image: "/src/images/monterey.jpg"
  }
];

function installServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js', { scope: '/' }).then((sw) => {
      fetchExample();
    });
  }
}

function createCards() {
  for (var place of places) {
    addNewPlace(place);
  }
}

function addNewPlace(place) {
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

addPlaceButton.addEventListener('click', () => {
  openBannerToInstallApp();
  var newPlace = {
    title: "Monterey Bay",
    description: "Monterey Bay Aquarium was fun!",
    image: "/src/images/monterey.jpg"
  };
  places.push(newPlace);
  addNewPlace(newPlace);
});

installServiceWorker();
createCards();

function fetchExample() {
  fetch('https://httpbin.org/ip')
  .then(function(res) {
    return res.json();
  })
  .then(function(data) {
    console.log(data.origin);
  });
}

function openBannerToInstallApp() {
  if (bannerToInstallApp) {
    bannerToInstallApp.prompt();

    bannerToInstallApp.userChoice().then(coiseResult => {
      if (coiseResult.outcome === 'dismissed') {
        console.log('User cancelled installation');
      } else {
        console.log('User added to home screen');
      }
    });

    bannerToInstallApp = null;
  }
}

window.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault();
  bannerToInstallApp = event;
});