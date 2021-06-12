// Recieve parameters from URL for search

const BASE_URL = "https://images-api.nasa.gov/search?q=";
var pageNumber = "&page=1";

var tempSearchQuery = "Jupiter";

function getMediaFromNASALibrary(request) {

    fetch(request).then(function (response) {

        if (response.status > 400) {
            // Maybe let user know that there was an error?
            return;
        }
        return response.json();

    }).then(function (data) {

        mediaItems = data.collection.items;
        console.log(mediaItems);
    });
}

var tempRequest = BASE_URL + tempSearchQuery + pageNumber;

getMediaFromNASALibrary(tempRequest);