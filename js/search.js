const operaCtrlKeyCode = 17;
const webkitCtrlLeftKeyCode = 91;
const webkitCtrlRightKeyCode = 93;
const firefoxCtrlKeyCode = 224;
let searchBars = document.getElementsByClassName("search-bar");

Array.from(searchBars).forEach(function (searchBar) {
  searchBar.addEventListener("keydown", function (e) {
    var urlWithPlaceholder = searchBar.dataset.url;
    var searchTerm = this.value;

    if (isTargetBlank(e) && e.keyCode === 13) {
      search(urlWithPlaceholder, searchTerm, "_blank")
    } else if (e.keyCode === 13) {
      search(urlWithPlaceholder, searchTerm, "_self")
    }
  })
})

function isTargetBlank(e) {
  var keyCode = e.keyCode;
  return e.metaKey
    || e.ctrlKey
    || keyCode === operaCtrlKeyCode
    || keyCode === firefoxCtrlKeyCode
    || keyCode === webkitCtrlLeftKeyCode
    || keyCode === webkitCtrlRightKeyCode
}

function search(url, term, target) {
  var searchUrl = url.replace("[search-term]", encodeURIComponent(term));
  window.open(searchUrl, target);
}