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
let isFocused = false
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
  .map((item) => ({
    ...item,
    score: item.title.toLowerCase().includes(searchQuery.toLowerCase())
      ? 2
      : item.context.toLowerCase().includes(searchQuery.toLowerCase())
        ? 1
        : 0,
  }))
  .filter((item) => item.score > 0)
  .sort((a, b) => b.score - a.score)
  .slice(0, 8) // Limit to 8 results

  renderResults()

  // Don't auto-select the first result, only set selectedIndex if it's -1
  if (selectedIndex === -1 && results.length > 0) {
    selectedIndex = 0
    updateSelectedResult()
  }
}

function resetSearchField() {
  isFocused = false
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
        ? '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>'
        : '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>'

    const titleText = document.createElement("span")
    titleText.className = "result-title-text"
    titleText.textContent = result.title

    resultTitle.appendChild(icon)
    resultTitle.appendChild(titleText)
    resultContent.appendChild(resultTitle)

    // Create context
    const resultContext = document.createElement("span")
    resultContext.className = "result-context"
    resultContext.textContent = result.context

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
        clearButton.innerHTML =
          '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>'
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
    resultArrow.innerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>'

    resultItem.appendChild(resultContent)
    resultItem.appendChild(resultArrow)

    // Add click event
    resultItem.addEventListener("click", () => handleResultClick(result, index))

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
function handleResultClick(result, index) {
  if (result.type === "search-field") {
    selectedIndex = index
    isSearchFieldActive = true
    searchFieldQuery = ""
    renderResults()
  } else {
    window.open(result.href, "_self")
  }
}

// Handle keyboard navigation in main search
function handleKeyDown(e) {
  // Track if we're actively typing in the main search input
  isTypingInMainSearch = e.key.length === 1 && !e.ctrlKey && !e.altKey
    && !e.metaKey

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
      window.open(selected.href.replace("[search-term]",
        encodeURIComponent(searchFieldQuery)), "_self")
    } else if (selected.type === "search-field") {
      // If search field is selected but not active, activate it
      isSearchFieldActive = true
      renderResults()
    } else {
      window.open(selected.href, "_self")
    }
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
  } else if (e.key === "Escape") {
    resetSearchField();
  }
}

// Handle key down in the search field input
function handleSearchFieldKeyDown(e) {
  if (e.key === "Escape") {
    e.preventDefault()
    isSearchFieldActive = false
    searchFieldQuery = ""
    renderResults()
  } else if (e.key === "Enter" && selectedIndex >= 0) {
    e.preventDefault()
    const selected = results[selectedIndex]
    window.open(selected.href.replace("[search-term]",
      encodeURIComponent(searchFieldQuery)), "_self")
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
  isFocused = true
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