// Elements
var cardContainerEl = document.querySelector("#resultsField");
var errorFieldEl = document.querySelector("#errorField");
var attemptFieldEl = document.querySelector("#attemptField");

// Holds query from searchbar
var searchQuery;
var defaultQuery = "earth";

// Base URL for API call
const BASE_URL = "https://images-api.nasa.gov/search?q=";

// Array containers
var mediaItems = []; // Holds objects from API calls
var cardData = []; // Holds image data from API call

// Recieve parameters from URL for search
function getQueryFromURL() {

    // Check to see if there are parameters
    if (window.location.href.includes('?')) { // If so,

        // Get the parameters
        var URLString = document.location.search;
        searchQuery = URLString.split("=")[1];

        console.log(searchQuery);

        // If the search wasn't ''
        if (searchQuery !== '') { // Test for empty string

            // Construct the API request and attempt it
            var myRequest = BASE_URL + searchQuery;
            getMediaFromNASALibrary(myRequest);  
        } else { // If blank ('') parameter

            // Go back home
            document.location.replace("index.html");
        }
    } else { // If there are no parameters

        // Show results for Earth!
        var myRequest = BASE_URL + defaultQuery;
        getMediaFromNASALibrary(myRequest);
    }
}

// Fill cardData with thumbnails and links to The images stored in JSON
function populateCardData(incomingData) {

    // Iterate through all the objects
    for (var index = 0; index < incomingData.length; index++) {

        // Ignore all "audio" type results
        if (incomingData[index].data[0].media_type !== "audio") {

            // Add it to cardData, dynamically resizing it
            cardData.push( [ incomingData[index].links[0].href,         // link to thumbnail
                             incomingData[index].href,                  // link to JSON (larger files)
                             incomingData[index].data[0].media_type ]); // What is it?
        }
    }
}

// This draws the image results to the screen
function renderCards(keyword) {

    // Create the header
    var searchHeader = document.createElement("H3");
    
    // Style the header
    searchHeader.classList.add("title", "is-3");

    // Set the header's content
    searchHeader.textContent = "Showing results for " + keyword + ":";

    // Append the header
    cardContainerEl.insertAdjacentElement("beforeBegin", searchHeader);

    // For each in cardData[]
    for (var index = 0; index < cardData.length; index++) {

        // Store the sources in this index
        var thumbSrc = cardData[index];

        // Create the elements
        var listItemEl = document.createElement("LI");
        var thumbEl = document.createElement("IMG");

        // Pimp my card!
        listItemEl.classList.add("column", "is-12-mobile", "is-4-tablet", "is-one-fifth-desktop", "is-2-widescreen", "box", "m-2");

        // Set image and card info
        thumbEl.setAttribute("src", thumbSrc[0]);
        thumbEl.setAttribute("data-index", index);

        // Append the elements
        listItemEl.append(thumbEl);
        cardContainerEl.append(listItemEl);
    }

}

// This function unhides the error field in gallery.html, and prints an error
function showError(attempt) {

    // Show the error field
    errorFieldEl.setAttribute("style", "display:block;");
    
    // Print the failed search to the screen
    attemptFieldEl.textContent = attempt;
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

        return response.json();
    }).then(function (data) {

        // Grab the keyword(s)
        var keyword = request.split("=")[1];

        if (data.collection.items.length < 1) {
            
            // Throw an error, and don't try anything else
            showError(keyword);
            return;
        }

        // Pre filter returned data (Only grab the items)
        mediaItems = data.collection.items;

        // Further filtering of data (Only keep media data)
        populateCardData(mediaItems);

        // Show the images!
        renderCards(keyword);

        // // Check if the item is an image or a video
        // if (tempImage[2] === "video") { // Is a video
            
        //     requestVideo(tempImage[1]);
            
        // } else { // Is an image

        //     requestLargeImage(tempImage[1]);
        // }
        
    });
}

// Call on load page
getQueryFromURL();