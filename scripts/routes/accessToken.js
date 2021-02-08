import { createSameOriginUrl } from '../utils/fetch.js'
import { fetchAndParseText } from '../modules/fetch.js'
import { component } from '../modules/component.js'
import { parseAccessToken } from '../modules/hash.js'

export default accessToken

async function accessToken() {
  const source = await fetchAndParseText(
    createSameOriginUrl('/templates/redirecting.hbs')
  )
  return component(source, {}, mounted)
}

function mounted() {
  const token = parseAccessToken()
  sessionStorage.setItem('spotify-token', `Bearer ${token}`)
  window.location.replace(window.location.origin + '/#profile')
}
