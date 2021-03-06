// Elements
var cardContainerEl = document.querySelector("#resultsField");
var errorFieldEl = document.querySelector("#errorField");
var attemptFieldEl = document.querySelector("#attemptField");

// Holds query from searchbar
var searchQuery;

// Base URL for API call
const BASE_URL = "https://images-api.nasa.gov/search?q=";

// Array containers
var mediaItems = []; // Holds objects from API calls
var cardData = []; // Holds image data from API call
var favData = []; // Holds all favorited items for comparison
                  // and setting

// Recieve parameters from URL for search
function getQueryFromURL() {

    // Try to get localstorage data
    var tempArray = JSON.parse(localStorage.getItem("favorites"));

    // If there was data, store it
    if (tempArray) {

        favData = tempArray;
    }

    // Check to see if there are parameters
    if (window.location.href.includes('?')) { // If so,

        // Get the parameters
        var URLString = document.location.search;
        searchQuery = URLString.split("=")[1];

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

        // Show favorites!
        cardData = favData;
        renderCards("favorites");
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
    if (keyword === "favorites") { // If this is the favorites page

        // Prints "Your favorites:"
        searchHeader.textContent = "Your " + keyword + ":";
    } else { // If this is a normal search

        // Prints "Showing results for (search query):"
        searchHeader.textContent = "Showing results for " + keyword + ":";
    }

    // Append the header
    cardContainerEl.insertAdjacentElement("beforeBegin", searchHeader);

    // For each in cardData[]
    for (var index = 0; index < cardData.length; index++) {

        // Store the sources in this index
        var thumbSrc = cardData[index];

        // Create the elements
        var listItemEl = document.createElement("LI");
        var favButtonEl = document.createElement("BUTTON");
        var thumbEl = document.createElement("IMG");

        // Pimp my card!
        listItemEl.classList.add("column", "is-12-mobile", "is-4-tablet", "is-one-fifth-desktop", "is-2-widescreen", "box", "m-2");

        // Set image and card info
        favButtonEl.textContent = "Fav";
        favButtonEl.classList.add("fav-button", "m-0");
        favButtonEl.setAttribute("data-index", index);
        favButtonEl.setAttribute("data-favorited", "false"); // Set not favorited by default
        thumbEl.setAttribute("src", thumbSrc[0]);
        thumbEl.setAttribute("data-index", index);
        listItemEl.setAttribute("data-index", index);

        // If we're on the favorites page
        if (keyword === "favorites") {

            // Well then everything here is a favorite, so make them all display as favorite
            favButtonEl.setAttribute("data-favorited", "true");
        } else { // Otherwise (normal search)

            // iterate through everything in favData
            // NOTE: I can't just check if the current card is included in
            //       favData, because strict equality doesn't like different memory addresses
            //       or something, idk. This works, and doesn't take too long overall (The API 
            //       call takes longer to complete honestly)
            // ! Might need to do a stress test, > 50 favorite items
            for (var jndex = 0; jndex < favData.length; jndex ++) {

                // Check if the thumbnail URL's are the same
                if (favData[jndex][0] == cardData[index][0]) { // If they are...

                    // It's a favorite! Display as such
                    favButtonEl.setAttribute("data-favorited", "true");
                }
            }
        }

        // Append the elements
        listItemEl.append(favButtonEl);
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

        // Open in new tab
        window.open(data[0], "_blank");
    })
}

function requestVideo(href) {
    fetch(href).then(function (response) {
        if (response.status > 400) {

            console.log("Error: unable to request large file");
        }
        return response.json();
    }).then(function (data) {

        // Open in new tab
        window.open(data.filter(video => video.includes('~orig.mp4'))[0], "_blank");
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
    });
}

// Call on load page
getQueryFromURL();

cardContainerEl.addEventListener("click", function (event) {

    // Get the card that was clickes, and its data
    var element = event.target;
    var elementCard = cardData[element.getAttribute("data-index")];

    // Did we just click on the card?
    if ((element.tagName === "LI") || (element.tagName === "IMG")) { // Yes, click on card

        // Check media type
        if (elementCard[2] === "video") { // Is a video

            requestVideo(elementCard[1]);
        } else { // Is an image

            requestLargeImage(elementCard[1]);
        }
    } else if (element.tagName === "BUTTON") { // No, clicked on Fav button

        // * Prevent duplicate favorites

        // Boolean that is only changed if the clicked card is a favorite
        var alreadyFavorited = false;

        // Why does this work???
        if (favData.includes(elementCard)) {

            alreadyFavorited = true;
        }

        // If the clicked card is NOT already a favorite
        if (alreadyFavorited !== true) {
            
            // Holds favorited cards as string data
            var favoritesToStore;

            // Set the button to render as white on red
            element.setAttribute("data-favorited", "true");

            // Push the card into favorites array
            favData.push(elementCard);

            // Save the data properly if there is only one item
            if (favData.length < 2) {

                favoritesToStore = '[' + JSON.stringify(elementCard) + ']';
            } else {

                favoritesToStore = JSON.stringify(favData);
            }

            // Save favorites to localstorage
            localStorage.setItem("favorites", favoritesToStore);
        }
    }
});