// DOM Elements
const searchContainer = document.getElementById("search-container")
const searchBox = document.getElementById("search-box")
const searchInput = document.getElementById("search-input")
const clearSearchButton = document.getElementById("clear-search")
const searchResults = document.getElementById("search-results")

// State variables
let query = ""
let searchFieldQuery = ""
let results = []
let selectedIndex = -1
let isSearchFieldActive = false
let isTypingInMainSearch = false

// Search functionality
function performSearch(searchQuery) {
  if (!searchQuery.trim()) {
    results = []
    renderResults()
    return
  }

  results = lookupTable
  .map((item) => {
    const title = item.title.toLowerCase();
    const section = item.section.toLowerCase();
    const block = item.block.toLowerCase();
    const group = item.group ? item.group.toLowerCase() : "";

    const tokens = searchQuery.toLowerCase().trim().split(/\s+/);

    const allTokensMatch = tokens.every(token =>
      title.split(" ").some(word => word.startsWith(token)) ||
      section.split(" ").some(word => word.startsWith(token)) ||
      block.split(" ").some(word => word.startsWith(token)) ||
      group.split(" ").some(word => word.startsWith(token))
    );

    if (!allTokensMatch) {
      return {...item, score: 0};
    }

    // Score calculation
    let score = 0;

    for (const token of tokens) {
      if (title.split(" ").some(word => word.startsWith(token))) {
        score += 4;
      }
      if (section.split(" ").some(word => word.startsWith(token))) {
        score += 3;
      }
      if (block.split(" ").some(word => word.startsWith(token))) {
        score += 2;
      }
      if (group.split(" ").some(word => word.startsWith(token))) {
        score += 1;
      }
    }

    return {...item, score};
  })
  .filter((item) => item.score > 0)
  .sort((a, b) => b.score - a.score)
  .slice(0, 8);

  renderResults()

  // Don't auto-select the first result, only set selectedIndex if it's -1
  if (selectedIndex === -1 && results.length > 0) {
    selectedIndex = 0
    updateSelectedResult()
  }
}

function resetSearchField() {
  searchBox.classList.remove("focused")
  searchInput.blur()
  searchContainer.classList.remove("focused")
  searchResults.classList.add("hidden")
  searchBox.classList.remove("results-visible")
  clearSearchButton.classList.add("hidden")

  isSearchFieldActive = false

  searchInput.value = ""
  query = ""
  results = []
  selectedIndex = -1
}

// Render search results
function renderResults() {
  searchResults.innerHTML = ""

  if (results.length === 0) {
    searchResults.classList.add("hidden")
    searchBox.classList.remove("results-visible")
    return
  }

  searchResults.classList.remove("hidden")
  searchBox.classList.add("results-visible")

  results.forEach((result, index) => {
    const resultItem = document.createElement("div")
    resultItem.className = `result-item ${index === selectedIndex ? "selected"
      : ""}`
    resultItem.dataset.index = index

    // Create result content
    const resultContent = document.createElement("div")
    resultContent.className = "result-content"

    // Create title with icon
    const resultTitle = document.createElement("div")
    resultTitle.className = "result-title"

    const icon = document.createElement("span")
    icon.className = "result-title-icon"
    icon.innerHTML =
      result.type === "search-field"
        ? Icon.Search
        : Icon.ArrowOut;

    const titleText = document.createElement("span")
    titleText.className = "result-title-text"
    titleText.textContent = result.title

    resultTitle.appendChild(icon)
    resultTitle.appendChild(titleText)
    resultContent.appendChild(resultTitle)

    // Create context
    const resultContext = document.createElement("span")
    resultContext.className = "result-context"
    resultContext.textContent = result.section + " > " + result.block
      + (result.group ? " > " + result.group : "");

    // Add search prompt if this is a selected search field
    if (index === selectedIndex && result.type === "search-field"
      && !isSearchFieldActive) {
      const searchPrompt = document.createElement("span")
      searchPrompt.className = "search-prompt"
      searchPrompt.textContent = "(press enter to search)"
      resultContext.appendChild(searchPrompt)
    }

    resultContent.appendChild(resultContext)

    // Add search field input if active
    if (index === selectedIndex && result.type === "search-field"
      && isSearchFieldActive) {
      const searchFieldContainer = document.createElement("div")
      searchFieldContainer.className = "search-field-input-container"

      const searchFieldInput = document.createElement("input")
      searchFieldInput.type = "text"
      searchFieldInput.className = "search-field-input"
      searchFieldInput.value = searchFieldQuery
      searchFieldInput.autocomplete = "off"
      searchFieldInput.placeholder = `${result.title}...`
      searchFieldInput.id = "search-field-input"

      searchFieldContainer.appendChild(searchFieldInput)

      if (searchFieldQuery) {
        const clearButton = document.createElement("button")
        clearButton.className = "search-field-clear"
        clearButton.innerHTML = Icon.Clear

        clearButton.addEventListener("click", (e) => {
          e.stopPropagation()
          searchFieldQuery = ""
          renderResults()
          document.getElementById("search-field-input")?.focus()
        })
        searchFieldContainer.appendChild(clearButton)
      }

      resultContent.appendChild(searchFieldContainer)
    }

    // Create arrow icon
    const resultArrow = document.createElement("span")
    resultArrow.className = "result-arrow"
    resultArrow.innerHTML = Icon.ArrowRight
    resultItem.appendChild(resultContent)
    resultItem.appendChild(resultArrow)

    // Add click event
    resultItem.addEventListener("click",
      (e) => handleResultClick(result, index, e))

    searchResults.appendChild(resultItem)
  })

  // Focus the search field input if active
  setTimeout(() => {
    const searchFieldInput = document.getElementById("search-field-input")
    if (searchFieldInput) {
      searchFieldInput.focus()

      // Add event listeners to the search field input
      searchFieldInput.addEventListener("input", (e) => {
        searchFieldQuery = e.target.value
      })

      searchFieldInput.addEventListener("keydown", handleSearchFieldKeyDown)
    }
  }, 0)
}

// Update the selected result
function updateSelectedResult() {
  const resultItems = searchResults.querySelectorAll(".result-item")
  resultItems.forEach((item, index) => {
    if (index === selectedIndex) {
      item.classList.add("selected")
      item.scrollIntoView({block: "nearest", behavior: "smooth"})
    } else {
      item.classList.remove("selected")
    }
  })

  // Re-render to update UI for search field
  renderResults()
}

// Handle result click
function handleResultClick(result, index, event) {

  const isModifierPressed = isModifierKey(event);

  if (result.type === "search-field") {
    selectedIndex = index
    isSearchFieldActive = true
    searchFieldQuery = ""
    renderResults()
  } else {
    openUrl(result.href, isModifierPressed);
  }
}

// Handle keyboard navigation in main search
function handleKeyDown(e) {
  // Track if we're actively typing in the main search input
  isTypingInMainSearch = e.key.length === 1 && !e.ctrlKey && !e.altKey
    && !e.metaKey
  const isModifierPressed = isModifierKey(e);

  if (e.key === "ArrowDown") {
    e.preventDefault()
    if (results.length > 0) {
      selectedIndex = (selectedIndex + 1) % results.length
      updateSelectedResult()
      isSearchFieldActive = false
      searchFieldQuery = ""
    }
  } else if (e.key === "ArrowUp") {
    e.preventDefault()
    if (results.length > 0) {
      selectedIndex = (selectedIndex - 1 + results.length) % results.length
      updateSelectedResult()
      isSearchFieldActive = false
      searchFieldQuery = ""
    }
  } else if (e.key === "Enter" && selectedIndex >= 0) {
    e.preventDefault()
    const selected = results[selectedIndex]
    if (selected.type === "search-field" && isSearchFieldActive) {
      // If search field is active and has query, use that query
      // searchForField(selected.href, searchFieldQuery, "_blank")
      var searchUrl = replaceSearchTerm(selected.href, searchFieldQuery);
      openUrl(searchUrl, isModifierPressed);
    } else if (selected.type === "search-field") {
      // If search field is selected but not active, activate it
      isSearchFieldActive = true
      renderResults()
    } else {
      openUrl(selected.href, isModifierPressed);
      // window.open(selected.href, "_self")
    }
  } else if (e.key === "Escape") {
      resetSearchField();

  } else if (
    selectedIndex >= 0 &&
    results[selectedIndex]?.type === "search-field" &&
    !isSearchFieldActive &&
    !isTypingInMainSearch
  ) {
    // Only activate search field if we're not actively typing in the main search
    // AND a key is pressed while a search field is selected
    const key = e.key
    if (key.length === 1 && !e.ctrlKey && !e.altKey && !e.metaKey) {
      isSearchFieldActive = true
      searchFieldQuery = key
      renderResults()
    }
  }
}

// Handle key down in the search field input
function handleSearchFieldKeyDown(e) {
  const isModifierPressed = isModifierKey(e);

  if (e.key === "Escape") {
    resetSearchField();
  } else if (e.key === "Enter" && selectedIndex >= 0) {
    e.preventDefault()
    const selected = results[selectedIndex]
    console.log("modifier pressed", isModifierPressed);
    var searchUrl = replaceSearchTerm(selected.href, searchFieldQuery);
    openUrl(searchUrl, isModifierPressed);
  }

  // Don't propagate the event to prevent triggering the main search input's handlers
  e.stopPropagation()
}

// Event listeners
searchInput.addEventListener("input", (e) => {
  query = e.target.value
  isTypingInMainSearch = true

  if (query) {
    clearSearchButton.classList.remove("hidden")
  } else {
    clearSearchButton.classList.add("hidden")
  }

  performSearch(query)

  // Reset search field state when typing in main search
  isSearchFieldActive = false
  searchFieldQuery = ""
})

searchInput.addEventListener("focus", () => {
  searchBox.classList.add("focused")
  searchContainer.classList.add("focused")
  if (query) {
    performSearch(query)
  }
})

searchInput.addEventListener("keydown", handleKeyDown)

clearSearchButton.addEventListener("click", () => {
  searchInput.value = ""
  query = ""
  results = []
  selectedIndex = -1
  isSearchFieldActive = false
  searchFieldQuery = ""
  clearSearchButton.classList.add("hidden")
  searchResults.classList.add("hidden")
  searchBox.classList.remove("results-visible")
  searchInput.focus()
})

// Handle click outside to close search results
document.addEventListener("mousedown", (e) => {
  if (!searchContainer.contains(e.target)) {
    resetSearchField();
  }
})