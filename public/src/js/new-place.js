const imagePreviewPlaceholder = document.getElementById("imagePreview");
const inputPlaceTitle = document.getElementById("placeTitle");
const inputPlaceDescription = document.getElementById("placeDescription");
const snackbar = document.getElementById("snackbar");

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
    writePlaceToExternalDatabase(place)
        .then(() => { showSnackBar("Place successfully added"); window.location = "/"})
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