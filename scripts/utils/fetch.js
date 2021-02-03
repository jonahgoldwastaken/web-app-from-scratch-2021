export { fetchData, parseJSON, parseText, createSameOriginUrl }

function fetchData(url, options = {}) {
  return fetch(url, options)
}

function parseJSON(res) {
  return res.json()
}

function parseText(res) {
  return res.text()
}

function createSameOriginUrl(path) {
  return `${window.location.origin}${path}`
}
