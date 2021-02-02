import { fetchData, parseJSON, parseText } from '../utils/fetch.js'

export { fetchAndParseData, fetchAndParseText }

function fetchAndParseData(url, options) {
  return fetchData(url, options).then(parseJSON)
}

function fetchAndParseText(url) {
  return fetchData(url).then(parseText)
}
