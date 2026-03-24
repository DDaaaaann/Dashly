const searchBars = document.getElementsByClassName("search-bar");

Array.from(searchBars).forEach((searchBar) => {
  searchBar.addEventListener("keydown", (e) => {
    const urlWithPlaceholder = searchBar.dataset.url;
    const searchTerm = searchBar.value;
    const searchUrl = replaceSearchTerm(urlWithPlaceholder, searchTerm);
    const modifierKeyPressed = isModifierKey(e);

    if (e.key === "Enter") {
      openUrl(searchUrl, modifierKeyPressed);
    }
  });
});