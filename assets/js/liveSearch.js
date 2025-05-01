function search(query, lookup) {
  if (!query) {
    return [];
  }

  query = query.toLowerCase();
  return lookup
  .map(item => ({
    ...item,
    score: item.title.toLowerCase().includes(query) ? 2
      : item.context.toLowerCase().includes(query) ? 1 : 0
  }))
  .filter(item => item.score > 0)
  .sort((a, b) => b.score - a.score); // Sort by relevance
}

document.getElementById("searchInput").addEventListener("input", (event) => {
  const results = search(event.target.value, lookupTable);
  displayResults(results);
});

function displayResults(results) {
  const resultBox = document.getElementById("searchResults");
  resultBox.innerHTML = ""; // Clear previous results

  results.forEach(item => {
    const div = document.createElement("div");
    div.className = "result-item";
    div.textContent = `${item.title} (${item.context})`;
    if (item.href) {
      const a = document.createElement("a");
      a.href = item.href;
      a.textContent = " 🔗";
      div.appendChild(a);
    }
    resultBox.appendChild(div);
  });
}

// Initialize lookup table on page load
// init();
