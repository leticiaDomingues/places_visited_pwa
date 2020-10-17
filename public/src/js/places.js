const placesArea = document.getElementById("places-area");
const addPlaceButton = document.getElementById("add-place-button");

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
    var newPlace = {
        title: "Monterey Bay",
        description: "Monterey Bay Aquarium was fun!",
        image: "/src/images/monterey.jpg"
    };
    places.push(newPlace);
    addNewPlace(newPlace);
});

createCards();