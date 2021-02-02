export { fetchData, parseJSON, parseText }

function fetchData(url, options = {}) {
  return fetch(url, options)
}

function parseJSON(res) {
  return res.json()
}

function parseText(res) {
  return res.text()
}
