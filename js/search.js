let searchBars = document.getElementsByClassName("search-bar");

Array.from(searchBars).forEach(function (searchBar) {
  searchBar.addEventListener("keypress", function (e) {
    var urlWithPlaceholder = searchBar.dataset.url;
    var searchUrl = urlWithPlaceholder.replace("[search-term]",
      encodeURIComponent(this.value));

    if (e.keyCode === 13) {
      window.open(searchUrl, '_blank');
    }
  })
})