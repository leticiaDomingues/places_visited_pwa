const imagePreviewPlaceholder = document.getElementById("imagePreview");
const inputPlaceTitle = document.getElementById("placeTitle");
const inputPlaceDescription = document.getElementById("placeDescription");
const snackbar = document.getElementById("snackbar");

function addNewPlace() {
    const title = inputPlaceTitle.value;
    const description = inputPlaceDescription.value;
    const image = imagePreviewPlaceholder.src;

    if (!title || !description || !image || image.includes("/src/images/placeholder.png")) {
        showSnackBar("You have to provide place title, description and image")
        return false;
    }

    const place = { title, description, image };
    showSnackBar("Place successfully added");
    console.log(place);
}

function changeImage(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        
        reader.onload = function(e) {
            imagePreviewPlaceholder.src = e.target.result;
        }
        
        reader.readAsDataURL(input.files[0]);
    }
}

function showSnackBar(message) {
    const data = {
        message: message,
        timeout: 5000
    };
    snackbar.MaterialSnackbar.showSnackbar(data);
}