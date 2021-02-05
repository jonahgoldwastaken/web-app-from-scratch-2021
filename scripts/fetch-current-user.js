import { fetchAndParseData } from './modules/fetch.js'

export { fetchCurrentUser }

/**
 * Fetches current logged in Spotify user
 * @returns {Promise} Promise resolving to Spotify user object
 */
function fetchCurrentUser() {
  const token = sessionStorage.getItem('spotify-token')
  return fetchAndParseData('https://api.spotify.com/v1/me', {
    headers: { Authorization: token },
  })
}
