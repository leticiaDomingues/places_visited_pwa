const imagePreviewPlaceholder = document.getElementById("imagePreview");
const inputPlaceTitle = document.getElementById("placeTitle");
const inputPlaceDescription = document.getElementById("placeDescription");
const snackbar = document.getElementById("snackbar");

// Sync event
const NEW_PLACE_SYNC_EVENT_NAME = 'sync-new-posts';

// If all information was provided, add the specified place to firebase db
function addNewPlace() {
    const title = inputPlaceTitle.value;
    const description = inputPlaceDescription.value;
    const image = imagePreviewPlaceholder.src;

    if (!title || !description || !image || image.includes("/src/images/placeholder.png")) {
        showSnackBar("You have to provide place title, description and image")
        return false;
    }

    const place = { title, description, image };

    // If background syncronization is supported by the browser, add the post to idb and create a sync event.
    // If it's not supported, just send the place to firebase
    if ('serviceWorker' in navigator && 'SyncManager' in window) {
        navigator.serviceWorker.ready.then(sw => {
            place.id = new Date().toISOString();
            writeItemToLocalDatabase(PLACES_TO_SYNC_STORE_NAME, place)
                .then(() => { return sw.sync.register(NEW_PLACE_SYNC_EVENT_NAME); })
                .then(() => showSnackBar('Your Post was saved for syncing!'))
                .catch(err => console.log(err));
        });
    } else {
        writePlaceToExternalDB(place);
    }
}

// Send event to external db (firebase) to add the new place
function writePlaceToExternalDB(place) {
    writePlaceToExternalDatabase(place)
        .then(() => showSnackBar("Place successfully added"))
        .catch(() => showSnackBar("Error adding the place. Please, try again later."));
}

// Change image event
function changeImage(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = e => imagePreviewPlaceholder.src = e.target.result;
        reader.readAsDataURL(input.files[0]);
    }
}

// Open material snack bar with the provided message
function showSnackBar(message) {
    const data = { message: message, timeout: 5000 };
    snackbar.MaterialSnackbar.showSnackbar(data);
}