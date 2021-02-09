import { component, fetchTemplate } from '../modules/component.js'
import { parseAccessToken } from '../modules/hash.js'
import { navigate } from '../modules/router.js'

export default accessToken

async function accessToken() {
  const source = await fetchTemplate('redirecting')
  return component(source, {}, { mounted })
}

function mounted() {
  const token = parseAccessToken()
  sessionStorage.setItem('spotify-token', `Bearer ${token}`)
  setTimeout(() => navigate('/route-duration'), 1000)
}
