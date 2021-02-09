import { fetchData, parseJSON, parseText } from '../utils/fetch.js'

export { fetchAndParseJSON, fetchAndParseText }

/**
 * Fetches and parses JSON data
 * @param {string} url URL to fetch data from
 * @param {Object} options Fetch options object
 * @returns {Promise} Promise resolving to object
 */
async function fetchAndParseJSON(url, options) {
  const response = await fetchData(url, options)
  return parseJSON(response)
}

/**
 * Fetches and parses text
 * @param {string} url URL to fetch data from
 * @param {Object} options Fetch options object
 * @returns {Promise} Promise resolving to text
 */
async function fetchAndParseText(url) {
  const response = await fetchData(url)
  return parseText(response)
}
