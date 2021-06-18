var searchBtnEl = document.querySelector("#searchBtn");
var searchFieldEl = document.querySelector("#searchfield");
var redirect = "./gallery.html";
searchBtnEl.addEventListener("click", function(){
    redirect = redirect + "?q=" + searchFieldEl.value;
    window.location.replace(redirect);
});