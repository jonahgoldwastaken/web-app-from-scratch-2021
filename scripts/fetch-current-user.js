import { fetchAndParseData } from './modules/fetch.js'

export { fetchCurrentUser }

function fetchCurrentUser() {
  const token = sessionStorage.getItem('spotify-token')
  return fetchAndParseData('https://api.spotify.com/v1/me', {
    headers: { Authorization: token },
  })
}
