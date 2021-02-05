import { fetchData, parseJSON, parseText } from '../utils/fetch.js'

export { fetchAndParseData, fetchAndParseText }

/**
 * Fetches and parses JSON data
 * @param {string} url URL to fetch data from
 * @param {Object} options Fetch options object
 * @returns {Promise} Promise resolving to object
 */
function fetchAndParseData(url, options) {
  return fetchData(url, options).then(parseJSON)
}

/**
 * Fetches and parses text
 * @param {string} url URL to fetch data from
 * @param {Object} options Fetch options object
 * @returns {Promise} Promise resolving to text
 */
function fetchAndParseText(url) {
  return fetchData(url).then(parseText)
}
