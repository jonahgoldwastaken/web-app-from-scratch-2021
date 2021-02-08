import { createSameOriginUrl } from '../utils/fetch.js'
import { fetchAndParseText, fetchAndParseData } from '../modules/fetch.js'
import { component } from '../modules/component.js'

export default profile

async function profile() {
  const source = await fetchAndParseText(
    createSameOriginUrl('/templates/profile.hbs')
  )
  return component(source, { profile: null }, mounted)
}

async function mounted(component) {
  const token = sessionStorage.getItem('spotify-token')
  const profile = await fetchAndParseData('https://api.spotify.com/v1/me', {
    headers: { Authorization: token },
  })
  profile.external_urls = Object.entries(profile.external_urls)
  component.state.profile = profile
}
