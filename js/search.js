let searchBars = document.getElementsByClassName("search-bar");

Array.from(searchBars).forEach(function (searchBar) {
  searchBar.addEventListener("keydown", function (e) {
    var urlWithPlaceholder = searchBar.dataset.url;
    var searchTerm = this.value;

    if (e.metaKey && e.keyCode === 13) {
      search(urlWithPlaceholder, searchTerm, "_blank")
    } else if (e.keyCode === 13) {
      search(urlWithPlaceholder, searchTerm, "_self")
    }
  })
})

function search(url, term, target) {
  var searchUrl = url.replace("[search-term]", encodeURIComponent(term));
  window.open(searchUrl, target);
}