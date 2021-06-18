// Recieve parameters from URL for search
var searchQuery;


// Base URL for API call
const BASE_URL = "https://images-api.nasa.gov/search?q=";

// ! Temp vars, hardcoded variables used for testing
var pageNumber = "&page=1"; // If we decide to do pagination...
var tempSearchQuery = "Jupiter"; // Temp search keyword

// ! Fully constructed temp search URL
var tempRequest = BASE_URL + tempSearchQuery + pageNumber;

// Array containers
var mediaItems = []; // Holds objects from API calls
var cardData = []; // Holds image data from API call

function getQueryFromURL() {

    var URLString = document.location.search;
    searchQuery = URLString.split("=")[1];

    if (searchQuery !== null) {

        var myRequest = BASE_URL + searchQuery;
        getMediaFromNASALibrary(myRequest);
    } else {

        document.location.replace('./index.html');
    }
}

// Fill cardData with thumbnails and links to The images stored in JSON
function populateCardData(incomingData) {

    // Iterate through all the objects
    for (var index = 0; index < incomingData.length; index++) {
        cardData[index] = [ incomingData[index].links[0].href,        // link to thumbnail
                            incomingData[index].href,                 // link to JSON (larger files)
                            incomingData[index].data[0].media_type ]; // What is it?
    }
}

// For a specified card in cardData[], fetch the large version from the
// internet. The large file is stored as a link inside of a JSON. That
// is why a new fetch needs to be made.
function requestLargeImage(href) {

    // Attempt to fetch the JSON containing links to larger image sizes
    fetch(href).then(function (response) {

        // Test for errors
        if (response.status > 400) {
            console.log("Error: unable to request large file");
        }

        return response.json();
    }).then(function (data) {

        // ! Temp: log link to large image in console
        console.log(data[0]);
    })
}

function requestVideo(href) {
    fetch(href).then(function (response) {
        if (response.status > 400) {
            console.log("Error: unable to request large file");
        }
        return response.json();
    }).then(function (data) {

        // ! Temp: log link to Video in console
        console.log('FILTERED VIDEO DATA', data.filter(video => video.includes('~orig.mp4'))[0]);

        // Ben says this should work
        // var theOriginalVideo = data.filter(video => video.includes('~orig.mp4'))[0];
    })
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

        // ! Testing the requestLargeImage function
        var tempImage = cardData[45];

        // Check if the item is an image or a video
        if (tempImage[2] === "video") { // Is a video
            
            requestVideo(tempImage[1]);
            
        } else { // Is an image

            requestLargeImage(tempImage[1]);
        }
        
    });
}

// Call on load page
getQueryFromURL();