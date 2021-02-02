import { fetchAndParseData } from './modules/fetch.js'
import { parseQueryString } from './modules/query.js'

export { getAuthToken }

function getAuthToken() {
  const { code } = parseQueryString()
  fetchAndParseData(
    `${window.location.origin}/.netlify/functions/callback?code=${code}`
  ).then(data => {
    sessionStorage.setItem(
      'spotify-token',
      `${data.token_type} ${data.access_token}`
    )
    window.location = 'http://localhost:8888'
  })
}
