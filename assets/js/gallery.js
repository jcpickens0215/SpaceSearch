// Recieve parameters from URL for search

// Base URL for API call
const BASE_URL = "https://images-api.nasa.gov/search?q=";

// Temp vars
var pageNumber = "&page=1";
var tempSearchQuery = "Jupiter";
var tempRequest = BASE_URL + tempSearchQuery + pageNumber;

// Array containers
var mediaItems = []; // Holds objects from API calls
var cardData = []; // Holds image data from API call

// Fill cardData with thumbnails and links to The images stored in JSON
function populateCardData(data) {

    // Iterate through all the objects
    for (var index = 0; index < data.length; index++) {
        cardData[index] = [data[index].links[0].href, data[index].href];
    }
}

// Send API request, if successful, populate cardData
function getMediaFromNASALibrary(request) {

    fetch(request).then(function (response) {

        if (response.status > 400) {
            // Maybe let user know that there was an error?
            return;
        }
        return response.json();

    }).then(function (data) {

        mediaItems = data.collection.items;
        populateCardData(mediaItems);
        console.log(cardData);
    });
}

// Call on load page
getMediaFromNASALibrary(tempRequest);