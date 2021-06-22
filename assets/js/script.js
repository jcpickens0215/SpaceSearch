var searchBtnEl = document.querySelector("#searchBtn");
var searchFieldEl = document.querySelector("#searchfield");
var background = document.querySelector(".hero-body");
var redirect = "./gallery.html";

// Vars for background image
var date = moment()
var query = date.format("YYYY") + "-" + date.format("MM") + "-" + date.format("DD");
var href = "https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY&start_date=" + query;
var smallerImage;
var largerImage;

// Attempt to fetch the Picture Of the Day
fetch(href).then(function (response) {

    return response.json();
}).then(function (data) {

    // On 404, the homepage uses the default (hardcoded) background image

    // Store the big and small versions
    smallerImage = data[0].url;
    largerImage = data[0].hdurl;

    // If the viewport is larger than 960px, use the larger image
    if (window.innerWidth > 960) {

        background.setAttribute("style", "background-image: url('" + largerImage + "');");
    } else {

        background.setAttribute("style", "background-image: url('" + smallerImage + "');");
    }
})

// Listen for user clicking Search button
searchBtnEl.addEventListener("click", function(){
    redirect = redirect + "?q=" + searchFieldEl.value;
    window.location.replace(redirect);
});