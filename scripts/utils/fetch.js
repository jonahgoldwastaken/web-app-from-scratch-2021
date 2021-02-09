export {
    fetchData,
    parseJSON,
    parseText,
    createSameOriginUrl,
    createFetchAuthOptions,
}

/**
 * Fetches a url with the provided options
 * @param {string} url URL to fetch data from
 * @param {Object} options Object with Fetch API options
 * @returns {Promise} Fetch Promise
 */
function fetchData(url, options = {}) {
  return fetch(url, options)
}

/**
 * Parses a JSON response
 * @param {Object} res Response to parse as JSON
 * @returns {Promise} Promise resolving to an object
 */
function parseJSON(res) {
  return res.json()
}

/**
 * Parses a text response
 * @param {Object} res Response to parse as text
 * @returns {Promise} Promise resolving to a string
 */
function parseText(res) {
  return res.text()
}

/**
 * Concatenates a path string to the current origin
 * @param {string} path Path to concatenate to the window origin
 * @returns {string} Full url of current origin with provided path
 */
function createSameOriginUrl(path) {
  return `${window.location.origin}${path}`
}

function createFetchAuthOptions(token, method = 'GET') {
  return {
    method,
    headers: {
      Authorization: token,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  }
}
