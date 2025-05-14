let searchBars = document.getElementsByClassName("search-bar");

Array.from(searchBars).forEach(function (searchBar) {
  searchBar.addEventListener("keydown", function (e) {
    var urlWithPlaceholder = searchBar.dataset.url;
    var searchTerm = this.value;
    var searchUrl = replaceSearchTerm(urlWithPlaceholder, searchTerm);

    var modifierKeyPressed = isModifierKey(e);

    if (e.keyCode === 13) {
      openUrl(searchUrl, modifierKeyPressed);
    }
  })
})